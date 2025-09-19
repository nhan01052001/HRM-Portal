import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import AttRosterList from '../attRosterList/AttRosterList';
import {
    styleSheets,
    styleSafeAreaView,
    styleContentFilterDesign
} from '../../../../../constants/styleConfig';
import VnrFilterCommon from '../../../../../components/VnrFilter/VnrFilterCommon';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ScreenName, EnumName, EnumTask } from '../../../../../assets/constant';
import { AttSubmitRosterBusinessFunction, generateRowActionAndSelected } from './AttSubmitRosterBusiness';
import { connect } from 'react-redux';
import { startTask } from '../../../../../factories/BackGroundTask';
import { translate } from '../../../../../i18n/translate';
import ActionSheet from 'react-native-actionsheet';
import { VnrBtnCreate } from '../../../../../componentsV3/VnrBtnCreate/VnrBtnCreate';

let configList = null,
    enumName = null,
    attSubmitRoster = null,
    attSubmitRosterAddOrEdit = null,
    attSubmitRosterFlexibleAddOrEdit = null,
    attSubmitRosterViewDetail = null,
    attSubmitRosterKeyTask = null,
    pageSizeList = 20;

class AttSubmitRoster extends Component {
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
        this.resActionSheet = null;
        this.sheetActionsCreate = [];
        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_Roster_New_Index_Portal'] &&
            PermissionForAppMobile.value['New_Att_Roster_New_Index_Portal']['Create']
        ) {
            this.sheetActionsCreate.push({
                title: translate('HRM_Attendance_Roster_Create'),
                onPress: () =>
                    props.navigation.navigate(attSubmitRosterAddOrEdit, {
                        reload: () => this.reload()
                    })
            });
        }

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_ChangeShift_New_Index'] &&
            PermissionForAppMobile.value['New_Att_ChangeShift_New_Index']['View']
        ) {
            this.sheetActionsCreate.push({
                title: translate('HRM_PortalApp_Flexible_Shift_Change'),
                onPress: () =>
                    props.navigation.navigate(attSubmitRosterFlexibleAddOrEdit, {
                        reload: () => this.reload()
                    })
            });
        }

        // co cac truong hop 1 2 0
        // 1 co 1 quyen
        // 2  co 2 quyen
        // 0 khong co quyen nao

        if (this.sheetActionsCreate.length > 1) {
            // this.sheetActionsCreate > 1 có nghĩa là có trên 1 quyền , push thêm button close
            this.sheetActionsCreate.push({
                title: translate('HRM_Common_Close'),
                onPress: null
            });
        }
    }

    navigateCreate = () => {
        if (this.sheetActionsCreate.length && this.sheetActionsCreate.length > 1) {
            this.resActionSheet.show();
        } else if (
            PermissionForAppMobile &&
                PermissionForAppMobile.value['New_Att_Roster_New_Index_Portal'] &&
                PermissionForAppMobile.value['New_Att_Roster_New_Index_Portal']['Create']
        ) {
            this.props.navigation.navigate(attSubmitRosterAddOrEdit, {
                reload: () => this.reload()
            });
        } else if (
            PermissionForAppMobile &&
                PermissionForAppMobile.value['New_Att_ChangeShift_New_Index'] &&
                PermissionForAppMobile.value['New_Att_ChangeShift_New_Index']['View']
        ) {
            this.props.navigation.navigate(attSubmitRosterFlexibleAddOrEdit, {
                reload: () => this.reload()
            });
        }
    };

    actionSheetOnCLick = index => {
        if (this.sheetActionsCreate[index].onPress) {
            this.sheetActionsCreate[index].onPress();
        }
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
                keyTask: attSubmitRosterKeyTask,
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
        const _configList = configList[attSubmitRoster],
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
                    keyTask: attSubmitRosterKeyTask,
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
                    keyTask: attSubmitRosterKeyTask,
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
        if (nextProps.reloadScreenName == attSubmitRosterKeyTask) {
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
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        attSubmitRoster = ScreenName.AttSubmitRoster;
        attSubmitRosterAddOrEdit = ScreenName.AttSubmitRosterAddOrEdit;
        attSubmitRosterFlexibleAddOrEdit = ScreenName.AttSubmitRosterFlexibleAddOrEdit;
        attSubmitRosterViewDetail = ScreenName.AttSubmitRosterViewDetail;
        attSubmitRosterKeyTask = EnumTask.KT_AttSubmitRoster;
        AttSubmitRosterBusinessFunction.setThisForBusiness(this);
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: attSubmitRosterKeyTask,
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
            } = this.state,
            options = this.sheetActionsCreate.map(item => {
                return item.title;
            });

        return (
            <SafeAreaView {...styleSafeAreaView}>
                {attSubmitRoster && attSubmitRosterViewDetail && enumName && (
                    <View style={[styleSheets.container]}>
                        <VnrFilterCommon
                            dataBody={dataBody}
                            style={styleContentFilterDesign}
                            screenName={attSubmitRoster}
                            onSubmitEditing={this.reload}
                        />

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <AttRosterList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: attSubmitRosterViewDetail,
                                        screenName: attSubmitRoster
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={attSubmitRosterKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    GroupField={dataBody.GroupField}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    api={{
                                        urlApi: '[URI_HR]/Att_GetData/New_GetPersonalsubmitRoster',
                                        type: enumName.E_POST,
                                        dataBody: dataBody,
                                        pageSize: 20
                                    }}
                                    valueField="ID"
                                    renderConfig={renderRow}
                                />
                            )}

                            {this.sheetActionsCreate.length > 0 && (
                                <VnrBtnCreate onAction={() => this.navigateCreate()} />
                            )}

                            {this.sheetActionsCreate && this.sheetActionsCreate.length > 1 && (
                                <ActionSheet
                                    ref={o => (this.resActionSheet = o)}
                                    //title={'Which one do you like ?'}
                                    options={options}
                                    cancelButtonIndex={this.sheetActionsCreate.length - 1}
                                    destructiveButtonIndex={this.sheetActionsCreate.length - 1}
                                    onPress={index => this.actionSheetOnCLick(index)}
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
)(AttSubmitRoster);
