import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import InsChangeInsInfoRegisterList from '../insChangeInsInfoRegisterList/InsChangeInsInfoRegisterList';
import { styleSheets, Colors, styleSafeAreaView, styleContentFilterDesign } from '../../../../../constants/styleConfig';
import VnrFilterCommon from '../../../../../components/VnrFilter/VnrFilterCommon';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ScreenName, EnumName, EnumTask } from '../../../../../assets/constant';
import {
    generateRowActionAndSelected,
    InsSubmitChangeInsInfoRegisterBusinessFunction
} from './InsSubmitChangeInsInfoRegisterBusiness';
import { connect } from 'react-redux';
import { startTask } from '../../../../../factories/BackGroundTask';
import { VnrBtnCreate } from '../../../../../componentsV3/VnrBtnCreate/VnrBtnCreate';
import DrawerServices from '../../../../../utils/DrawerServices';

let configList = null,
    enumName = null,
    insSubmitChangeInsInfoRegister = null,
    insSubmitChangeInsInfoRegisterViewDetail = null,
    insSubmitChangeInsInfoRegisterKeyTask = null,
    pageSizeList = 20;

class InsSubmitChangeInsInfoRegister extends Component {
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
            isvisibleModalRefer: false
        };

        this.storeParamsDefault = null;
        // this.setCheckBoxFilter = this.setCheckBoxFilter.bind(this);
        //biến lưu lại object filter
        this.paramsFilter = null;
    }

    reload = (paramsFilter) => {
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
                keyTask: insSubmitChangeInsInfoRegisterKeyTask,
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
        const _configList = configList[insSubmitChangeInsInfoRegister],
            renderRow = _configList[enumName.E_Row],
            orderBy = _configList[enumName.E_Order];

        const dataRowActionAndSelected = generateRowActionAndSelected();
        let _params = {
            IsPortal: true,
            sort: orderBy,
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
                    keyTask: insSubmitChangeInsInfoRegisterKeyTask,
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
                    keyTask: insSubmitChangeInsInfoRegisterKeyTask,
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
        if (nextProps.reloadScreenName == insSubmitChangeInsInfoRegisterKeyTask) {
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

    componentDidMount() {
        if (!ConfigList.value[ScreenName.InsSubmitChangeInsInfoRegister]) {
            PermissionForAppMobile.value = {
                ...PermissionForAppMobile.value,
                New_Ins_ChangeInsInfoRegister_Portal: {
                    View: true,
                    Modify: true,
                    Delete: true
                },
                New_Ins_ChangeInsInfoRegister_Portal_btnSendRequest: { View: true }
            };
            ConfigList.value[ScreenName.InsSubmitChangeInsInfoRegister] = {
                Api: {
                    urlApi: '[URI_HR]/Ins_GetData/GetIns_ChangeInsInfoRegisterList',
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
                            Name: 'New_Ins_ChangeInsInfoRegister_Portal',
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
                            Name: 'New_Ins_ChangeInsInfoRegister_Portal',
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
                            Name: 'New_Ins_ChangeInsInfoRegister_Portal_btnSendRequest',
                            Rule: 'View'
                        }
                    }
                ]
            };
        }
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        insSubmitChangeInsInfoRegister = ScreenName.InsSubmitChangeInsInfoRegister;
        insSubmitChangeInsInfoRegisterViewDetail = ScreenName.InsSubmitChangeInsInfoRegisterViewDetail;
        insSubmitChangeInsInfoRegisterKeyTask = EnumTask.KT_InsSubmitChangeInsInfoRegister;
        InsSubmitChangeInsInfoRegisterBusinessFunction.setThisForBusiness(this);
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: insSubmitChangeInsInfoRegisterKeyTask,
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
        const { dataBody, renderRow, rowActions, selected, isLazyLoading, isRefreshList, keyQuery, dataChange } =
            this.state;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                {insSubmitChangeInsInfoRegister && insSubmitChangeInsInfoRegisterViewDetail && enumName && (
                    <View style={[styles.container]}>
                        <VnrFilterCommon
                            dataBody={dataBody}
                            style={styleContentFilterDesign}
                            screenName={insSubmitChangeInsInfoRegister}
                            onSubmitEditing={this.reload}
                        />

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <InsChangeInsInfoRegisterList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: insSubmitChangeInsInfoRegisterViewDetail,
                                        screenName: insSubmitChangeInsInfoRegister
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    //callbackDataSource={this.getDataSource}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={insSubmitChangeInsInfoRegisterKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    api={{
                                        urlApi: '[URI_HR]/Ins_GetData/GetIns_ChangeInsInfoRegisterList',
                                        type: enumName.E_POST,
                                        dataBody: dataBody,
                                        pageSize: 20
                                    }}
                                    valueField="ID"
                                    renderConfig={renderRow}
                                />
                            )}

                            {PermissionForAppMobile &&
                                PermissionForAppMobile.value['New_Ins_ChangeInsInfoRegister_Portal'] &&
                                PermissionForAppMobile.value['New_Ins_ChangeInsInfoRegister_Portal']['Create'] && (
                                <VnrBtnCreate
                                    onAction={() => {
                                        DrawerServices.navigate('InsSubmitChangeInsInfoRegisterAddOrEdit', {
                                            reload: () => this.reload()
                                        });
                                    }}
                                />
                            )}
                        </View>
                    </View>
                )}
            </SafeAreaView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

export default connect(mapStateToProps, null)(InsSubmitChangeInsInfoRegister);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.gray_3
    }
});
