import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import HreApproveEvaluationDocList from '../insInsuranceRecordList/InsInsuranceRecordList';
import { styleSheets, styleSafeAreaView, styleContentFilterDesign } from '../../../../../constants/styleConfig';
import VnrFilterCommon from '../../../../../components/VnrFilter/VnrFilterCommon';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ScreenName, EnumName, EnumTask } from '../../../../../assets/constant';
import {
    generateRowActionAndSelected,
    InsInsuranceRecordWaitingBusinessFunction
} from './InsInsuranceRecordWaitingBusiness';
// import { HreApproveEvaluationDocBusinessFunction } from '../insInsuranceRecordList/HreApproveEvaluationDocBusiness';
import { connect } from 'react-redux';
import { startTask } from '../../../../../factories/BackGroundTask';
import { translate } from '../../../../../i18n/translate';

let configList = null,
    enumName = null,
    insInsuranceRecordWaiting = null,
    insInsuranceRecordWaitingViewDetail = null,
    insInsuranceRecordWaitingKeyTask = null,
    pageSizeList = 20;

class InsInsuranceRecordWaiting extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataBody: null,
            rowActions: [],
            selected: [],
            isRefreshList: false,
            isRefreshFilter: false,
            isLazyLoading: false,
            keyQuery: null,
            dataChange: false //biến check dữ liệu có thay đổi hay không
        };

        this.storeParamsDefault = null;

        //biến lưu lại object filter
        this.paramsFilter = null;
        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            // // reload danh sách khi có approve hoặc reject dữ liệu
            // if (HreApproveEvaluationDocBusinessFunction.checkForReLoadScreen[ScreenName.InsInsuranceRecordWaiting]) {
            //     this.reload();
            // }
        });
    }

    reload = paramsFilter => {
        if (paramsFilter === 'E_KEEP_FILTER') {
            paramsFilter = { ...this.paramsFilter };
        } else {
            this.paramsFilter = { ...paramsFilter };
        }

        let _paramsDefault = this.storeParamsDefault,
            _keyQuery = EnumName.E_FILTER;

        _paramsDefault = {
            ..._paramsDefault,
            keyQuery: _keyQuery,
            isRefreshList: !this.state.isRefreshList, // reload lại ds.
            dataBody: {
                ..._paramsDefault.dataBody,
                ...paramsFilter
            }
        };
        // set false khi đã reload.
        //InsInsuranceRecordWaitingBusinessFunction.checkForReLoadScreen[ScreenName.InsInsuranceRecordWaiting] = false;
        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: insInsuranceRecordWaitingKeyTask,
                payload: {
                    ...dataBody,
                    keyQuery: keyQuery,
                    isCompare: false,
                    reload: this.reload
                }
            });
        });
    };

    checkDataFormNotify = () => {
        const { params = {} } = this.props.navigation.state,
            { NotificationID } = typeof params == 'object' ? params : JSON.parse(params);
        return NotificationID ? NotificationID : null;
    };

    paramsDefault = () => {
        const _configList = configList[insInsuranceRecordWaiting],
            renderRow = _configList[enumName.E_Row],
            orderBy = _configList[enumName.E_Order];

        let defaultParams = _configList[enumName.DefaultParams];

        const dataRowActionAndSelected = generateRowActionAndSelected();
        let _params = {
            IsPortal: true,
            sort: orderBy,
            pageSize: pageSizeList,
            NotificationID: this.checkDataFormNotify()
        };

        // Xử lý filter mặc định
        if (defaultParams && defaultParams.length > 0) {
            defaultParams.map(el => {
                if (el.fieldName && el.value && el.valueField) {
                    let value = el.value,
                        handledValue = null;

                    if (Array.isArray(value)) {
                        // dịch textField
                        el.value = value.map(e => {
                            e[el.textField] = translate(e[el.textField]);
                            return e;
                        });
                        handledValue = value.map(e => e[el.valueField]).join(',');
                    } else if (Object.keys(value).length > 0 && value[el.valueField]) {
                        el.value = {
                            ...el.value,
                            [el.textField]: translate(el.textField)
                        };
                        handledValue = value[el.valueField];
                    } else if (typeof value === 'string') {
                        handledValue = value;
                    }

                    _params = {
                        ..._params,
                        defaultParams: defaultParams,
                        [el.fieldName]: handledValue
                    };
                    return el;
                }
            });

            _params = {
                ..._params,
                defaultParams: defaultParams
            };
        }

        return {
            rowActions: dataRowActionAndSelected.rowActions,
            selected: dataRowActionAndSelected.selected,
            renderRow: renderRow,
            dataBody: _params,
            isRefreshFilter: !this.state.isRefreshFilter,
            keyQuery: EnumName.E_PRIMARY_DATA
        };
    };

    pullToRefresh = () => {
        const { dataBody, keyQuery } = this.state;
        this.setState(
            {
                keyQuery: keyQuery == EnumName.E_FILTER ? keyQuery : EnumName.E_PRIMARY_DATA
            },
            () => {
                startTask({
                    keyTask: insInsuranceRecordWaitingKeyTask,
                    payload: {
                        ...dataBody,
                        keyQuery: keyQuery == EnumName.E_FILTER ? keyQuery : EnumName.E_PRIMARY_DATA,
                        isCompare: false,
                        reload: this.reload
                    }
                });
            }
        );
    };

    pagingRequest = (page, pageSize) => {
        const { dataBody } = this.state;
        this.setState(
            {
                keyQuery: EnumName.E_PAGING
            },
            () => {
                startTask({
                    keyTask: insInsuranceRecordWaitingKeyTask,
                    payload: {
                        ...dataBody,
                        page: page,
                        pageSize: pageSize,
                        keyQuery: EnumName.E_PAGING,
                        isCompare: false,
                        reload: this.reload
                    }
                });
            }
        );
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;
        if (nextProps.reloadScreenName == insInsuranceRecordWaitingKeyTask) {
            //khi màn hình đang reload thì messsage phải là filter thì màn hình mới reload
            if (keyQuery === EnumName.E_FILTER && nextProps.message && keyQuery == nextProps.message.keyQuery) {
                this.setState({
                    isLazyLoading: !this.state.isLazyLoading,
                    dataChange: nextProps.message.dataChange
                });
            } else if (nextProps.message && keyQuery == nextProps.message.keyQuery) {
                // trường hợp không filter
                this.setState({
                    isLazyLoading: !this.state.isLazyLoading,
                    dataChange: nextProps.message.dataChange
                });
            }
        }
    }

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
    }

    componentDidMount() {
        if (!ConfigList.value[ScreenName.InsInsuranceRecordWaiting]) {
            PermissionForAppMobile.value = {
                ...PermissionForAppMobile.value,
                New_Ins_InsuranceRecordWaiting_Portal: {
                    View: true,
                    Modify: true,
                    Delete: true
                }
            };
            ConfigList.value[ScreenName.InsInsuranceRecordWaiting] = {
                Api: {
                    urlApi: '[URI_HR]/Ins_GetData/GetInsuranceRecordWaitingList',
                    type: 'POST',
                    pageSize: 20
                },
                Row: [],
                Order: [
                    {
                        field: 'DateUpdate',
                        dir: 'desc'
                    }
                ],
                BusinessAction: [
                    {
                        Type: 'E_MODIFY',
                        Resource: {
                            Name: 'New_Ins_InsuranceRecordWaiting_Portal',
                            Rule: 'Modify'
                        },
                        Confirm: {
                            isInputText: true,
                            isValidInputText: false
                        }
                    }
                ]
            };
        }
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        insInsuranceRecordWaiting = ScreenName.InsInsuranceRecordWaiting;
        insInsuranceRecordWaitingViewDetail = ScreenName.InsInsuranceRecordWaitingViewDetail;
        insInsuranceRecordWaitingKeyTask = EnumTask.KT_InsInsuranceRecordWaiting;
        InsInsuranceRecordWaitingBusinessFunction.setThisForBusiness(this);
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: insInsuranceRecordWaitingKeyTask,
            payload: {
                ..._paramsDefault.dataBody,
                pageSize: pageSizeList,
                keyQuery: EnumName.E_PRIMARY_DATA,
                isCompare: true,
                reload: this.reload
            }
        });
    }

    render() {
        const {
            dataBody,
            renderRow,
            rowActions,
            selected,
            isLazyLoading,
            isRefreshList,
            isRefreshFilter,
            keyQuery,
            dataChange
        } = this.state;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                {insInsuranceRecordWaiting && insInsuranceRecordWaitingViewDetail && enumName && (
                    <View style={[styleSheets.container]}>
                        <VnrFilterCommon
                            isRefreshFilter={isRefreshFilter}
                            dataBody={dataBody}
                            style={styleContentFilterDesign}
                            screenName={insInsuranceRecordWaiting}
                            onSubmitEditing={this.reload}
                        />

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <HreApproveEvaluationDocList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: insInsuranceRecordWaitingViewDetail,
                                        screenName: insInsuranceRecordWaiting
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={insInsuranceRecordWaitingKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    GroupField={dataBody.GroupField}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    api={{
                                        urlApi: '[URI_HR]/Ins_GetData/GetInsuranceRecordWaitingList',
                                        type: enumName.E_POST,
                                        pageSize: 20,
                                        dataBody: dataBody
                                    }}
                                    valueField="ID"
                                    renderConfig={renderRow}
                                />
                            )}
                        </View>
                    </View>
                )}
            </SafeAreaView>
        );
    }
}

const mapStateToProps = state => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

export default connect(
    mapStateToProps,
    null
)(InsInsuranceRecordWaiting);
