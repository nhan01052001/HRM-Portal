import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import AttPregnancyList from '../attPregnancyList/AttPregnancyList';
import {
    styleSheets,
    styleSafeAreaView,
    styleContentFilterDesign
} from '../../../../../constants/styleConfig';
import VnrFilterCommon from '../../../../../components/VnrFilter/VnrFilterCommon';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ScreenName, EnumName, EnumTask } from '../../../../../assets/constant';
import { generateRowActionAndSelected, AttSubmitPregnancyBusinessFunction } from './AttSubmitPregnancyBusiness';
import { connect } from 'react-redux';
import { startTask } from '../../../../../factories/BackGroundTask';
import VnrPickerQuickly from '../../../../../components/VnrPickerQuickly/VnrPickerQuickly';
import HttpService from '../../../../../utils/HttpService';
import { VnrBtnCreate } from '../../../../../componentsV3/VnrBtnCreate/VnrBtnCreate';

let configList = null,
    enumName = null,
    attSubmitPregnancy = null,
    attSubmitPregnancyAddOrEdit = null,
    attSubmitPregnancyViewDetail = null,
    attSubmitPregnancyKeyTask = null,
    pageSizeList = 20;

class AttSubmitPregnancy extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataBody: null,
            rowActions: [],
            selected: [],
            isRefreshList: false,
            isLazyLoading: false,
            keyQuery: null,
            dataChange: false, //biến check dữ liệu có thay đổi hay không
            dataTypePregnancy: null,
            Type: {
                label: 'HRM_Attendance_Pregnancy_Type',
                data: [],
                disable: false,
                refresh: false,
                value: null,
                visible: false,
                visibleConfig: true
            }
        };

        this.storeParamsDefault = null;

        //biến lưu lại object filter
        this.paramsFilter = null;
        this.refPickerType = null;
    }

    actionCreate = () => {
        //debugger
        // if (this.refPickerType !== null)
        //     this.refPickerType.opentModal()
        this.setState({
            Type: {
                ...this.state.Type,
                visible: true
            }
        });
    };

    onPickType = dataType => {
        //debugger
        this.setState({
            Type: {
                ...this.state.Type,
                visible: false
            }
        });

        if (dataType == null) return;

        const { navigation } = this.props;
        navigation.navigate(attSubmitPregnancyAddOrEdit, {
            typePrenancySelected: dataType,
            reload: () => this.reload()
        });
    };

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
        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: attSubmitPregnancyKeyTask,
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
        if (!configList[attSubmitPregnancy]) {
            configList[attSubmitPregnancy] = {
                Api: {
                    urlApi: '[URI_HR]/Att_GetData/Get_Att_PregnancyRegister_Portal',
                    type: 'POST',
                    pageSize: 20
                },
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
                            Name: 'New_Att_PregnancyRegister_New_Index_Portal',
                            Rule: 'Modify'
                        },
                        Confirm: {
                            isInputText: true,
                            isValidInputText: false
                        }
                    },
                    {
                        Type: 'E_DELETE',
                        Resource: {
                            Name: 'New_Att_PregnancyRegister_New_Index_Portal',
                            Rule: 'Delete'
                        },
                        Confirm: {
                            isInputText: false,
                            isValidInputText: false
                        }
                    },
                    {
                        Type: 'E_SENDMAIL',
                        Resource: {
                            Name: 'New_Att_PregnancyRegister_btnSendMail_Portal',
                            Rule: 'View'
                        }
                    },
                    {
                        Type: 'E_CANCEL',
                        Resource: {
                            Name: 'New_Att_PregnancyRegister_btnCancel_Portal',
                            Rule: 'View'
                        },
                        Confirm: {
                            isInputText: true,
                            isValidInputText: false
                        }
                    }
                ]
            };
        }
        const _configList = configList[attSubmitPregnancy],
            renderRow = _configList[enumName.E_Row],
            orderBy = _configList[enumName.E_Order];

        const dataRowActionAndSelected = generateRowActionAndSelected();
        let _params = {
            IsPortal: true,
            sort: orderBy,
            pageSize: pageSizeList,
            NotificationID: this.checkDataFormNotify()
        };

        return {
            rowActions: dataRowActionAndSelected.rowActions,
            selected: dataRowActionAndSelected.selected,
            renderRow: renderRow,
            dataBody: _params,
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
                    keyTask: attSubmitPregnancyKeyTask,
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
                    keyTask: attSubmitPregnancyKeyTask,
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
        if (nextProps.reloadScreenName == attSubmitPregnancyKeyTask) {
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

    getTypePregnancy = () => {
        HttpService.Get('[URI_SYS]/Sys_GetData/GetEnumForAtt?text=PregnancyTypeRegister&filterConfig=E_PORTAL').then(
            res => {
                this.setState({
                    dataTypePregnancy: res
                });
            }
        );
    };

    componentDidMount() {
        this.getTypePregnancy();
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        attSubmitPregnancy = ScreenName.AttSubmitPregnancy;
        attSubmitPregnancyAddOrEdit = ScreenName.AttSubmitPregnancyAddOrEdit;
        attSubmitPregnancyViewDetail = ScreenName.AttSubmitPregnancyViewDetail;
        attSubmitPregnancyKeyTask = EnumTask.KT_AttSubmitPregnancy;
        AttSubmitPregnancyBusinessFunction.setThisForBusiness(this);
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: attSubmitPregnancyKeyTask,
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
            keyQuery,
            dataChange,
            Type,
            dataTypePregnancy
        } = this.state;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                {attSubmitPregnancy && attSubmitPregnancyViewDetail && enumName && (
                    <View style={[styleSheets.container]}>
                        <VnrFilterCommon
                            dataBody={dataBody}
                            style={styleContentFilterDesign}
                            screenName={attSubmitPregnancy}
                            onSubmitEditing={this.reload}
                        />

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <AttPregnancyList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: attSubmitPregnancyViewDetail,
                                        screenName: attSubmitPregnancy
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={attSubmitPregnancyKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    api={{
                                        urlApi: '[URI_HR]/Att_GetData/Get_Att_PregnancyRegister_Portal',
                                        type: enumName.E_POST,
                                        dataBody: dataBody,
                                        pageSize: 20
                                    }}
                                    valueField="ID"
                                    renderConfig={renderRow}
                                />
                            )}

                            {PermissionForAppMobile &&
                                PermissionForAppMobile.value['New_Att_PregnancyRegister_New_Index_Portal'] &&
                                PermissionForAppMobile.value['New_Att_PregnancyRegister_New_Index_Portal'][
                                    'Create'
                                ] && <VnrBtnCreate onAction={this.actionCreate} />}
                        </View>

                        {Type.visible && (
                            <View style={styles.wrapController}>
                                <VnrPickerQuickly
                                    autoShowModal={true}
                                    dataLocal={dataTypePregnancy}
                                    titlePicker={'HRM_Attendance_Pregnancy_Type'}
                                    refresh={Type.refresh}
                                    textField="Text"
                                    valueField="Value"
                                    filter={false}
                                    value={Type.value}
                                    disable={Type.disable}
                                    onFinish={item => this.onPickType(item)}
                                />
                            </View>
                        )}
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
)(AttSubmitPregnancy);

const styles = StyleSheet.create({
    wrapController: {
        position: 'absolute', top: -999
    }
});
