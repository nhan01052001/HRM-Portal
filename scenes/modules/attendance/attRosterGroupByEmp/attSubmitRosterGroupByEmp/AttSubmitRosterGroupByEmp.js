
import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import AttRosterGroupByEmpList from '../attRosterGroupByEmpList/AttRosterGroupByEmpList';
import {
    styleSheets,
    styleSafeAreaView,
    styleContentFilterDesign
} from '../../../../../constants/styleConfig';
import VnrFilterCommon from '../../../../../components/VnrFilter/VnrFilterCommon';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ScreenName, EnumName, EnumTask } from '../../../../../assets/constant';
import {
    AttSubmitRosterGroupByEmpBusinessFunction,
    generateRowActionAndSelected
} from './AttSubmitRosterGroupByEmpBusiness';
import { connect } from 'react-redux';
import { startTask } from '../../../../../factories/BackGroundTask';
import { VnrBtnCreate } from '../../../../../componentsV3/VnrBtnCreate/VnrBtnCreate';
import DrawerServices from '../../../../../utils/DrawerServices';

let configList = null,
    enumName = null,
    attSubmitRosterGroupByEmp = null,
    attSubmitRosterGroupByEmpAddOrEdit = null,
    attSubmitRosterGroupByEmpViewDetail = null,
    attSubmitRosterGroupByEmpKeyTask = null,
    pageSizeList = 20;

class AttSubmitRosterGroupByEmp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataBody: null,
            rowActions: [],
            selected: [],
            isRefreshList: false,
            isLazyLoading: false,
            keyQuery: null,
            dataChange: false //biến check dữ liệu có thay đổi hay không
        };

        this.storeParamsDefault = null;

        //biến lưu lại object filter
        this.paramsFilter = null;
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
        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: attSubmitRosterGroupByEmpKeyTask,
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
        // "FieldGroup" : [
        //   "IsFlexibleShift"
        //  ],
        const _configList = configList[attSubmitRosterGroupByEmp],
            renderRow = _configList[enumName.E_Row],
            GroupField = _configList[enumName.E_Field_Group] ? _configList[enumName.E_Field_Group] : null,
            orderBy = _configList[enumName.E_Order];
        const dataRowActionAndSelected = generateRowActionAndSelected();
        let _params = {
            IsPortal: true,
            sort: orderBy,
            GroupField: GroupField,
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
                    keyTask: attSubmitRosterGroupByEmpKeyTask,
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
                    keyTask: attSubmitRosterGroupByEmpKeyTask,
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
        if (nextProps.reloadScreenName == attSubmitRosterGroupByEmpKeyTask) {
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
        if (!ConfigList.value[ScreenName.AttSubmitRosterGroupByEmp]) {
            PermissionForAppMobile.value = {
                ...PermissionForAppMobile.value,
                New_Att_RosterGroupByEmp_New_Index: {
                    Modify: true,
                    Delete: true,
                    View: true,
                    Create: true
                },
                New_Att_RosterGroupByEmp_btnSendMail_Portal: { View: true },
                New_Att_RosterGroupByEmp_btnCancel_Portal: { View: true }
            };
            ConfigList.value[ScreenName.AttSubmitRosterGroupByEmp] = {
                Api: {
                    urlApi: '[URI_HR]/Att_GetData/Get_ListRosterGroupByEmp_Portal',
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
                            Name: 'New_Att_RosterGroupByEmp_New_Index',
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
                            Name: 'New_Att_RosterGroupByEmp_New_Index',
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
                            Name: 'New_Att_RosterGroupByEmp_btnSendMail_Portal',
                            Rule: 'View'
                        }
                    },
                    {
                        Type: 'E_CANCEL',
                        Resource: {
                            Name: 'New_Att_RosterGroupByEmp_btnCancel_Portal',
                            Rule: 'View'
                        }
                    }
                ]
            };
        }

        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        attSubmitRosterGroupByEmp = ScreenName.AttSubmitRosterGroupByEmp;
        attSubmitRosterGroupByEmpAddOrEdit = ScreenName.AttSubmitRosterGroupByEmpAddOrEdit;
        attSubmitRosterGroupByEmpViewDetail = ScreenName.AttSubmitRosterGroupByEmpViewDetail;
        attSubmitRosterGroupByEmpKeyTask = EnumTask.KT_AttSubmitRosterGroupByEmp;
        AttSubmitRosterGroupByEmpBusinessFunction.setThisForBusiness(this);
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: attSubmitRosterGroupByEmpKeyTask,
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
            dataChange
        } = this.state;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                {attSubmitRosterGroupByEmp && attSubmitRosterGroupByEmpViewDetail && enumName && (
                    <View style={[styleSheets.container]}>
                        <VnrFilterCommon
                            dataBody={dataBody}
                            style={styleContentFilterDesign}
                            screenName={attSubmitRosterGroupByEmp}
                            onSubmitEditing={this.reload}
                        />

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <AttRosterGroupByEmpList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: attSubmitRosterGroupByEmpViewDetail,
                                        screenName: attSubmitRosterGroupByEmp
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={attSubmitRosterGroupByEmpKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    GroupField={dataBody.GroupField}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    api={{
                                        urlApi: '[URI_HR]/Att_GetData/Get_ListRosterGroupByEmp_Portal',
                                        type: enumName.E_POST,
                                        dataBody: dataBody,
                                        pageSize: 20
                                    }}
                                    valueField="ID"
                                    renderConfig={renderRow}
                                />
                            )}

                            {PermissionForAppMobile &&
                                PermissionForAppMobile.value['New_Att_RosterGroupByEmp_New_Index'] &&
                                PermissionForAppMobile.value['New_Att_RosterGroupByEmp_New_Index']['Create'] && (
                                <VnrBtnCreate
                                    onAction={() => {
                                        DrawerServices.navigate(attSubmitRosterGroupByEmpAddOrEdit, {
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
)(AttSubmitRosterGroupByEmp);
