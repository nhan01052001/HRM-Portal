import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import AttLeaveDayList from '../attLeaveDayList/AttLeaveDayList';
import {
    styleSheets,
    Colors,
    Size,
    styleSafeAreaView,
    styleContentFilterDesign
} from '../../../../../constants/styleConfig';
import VnrFilterCommon from '../../../../../components/VnrFilter/VnrFilterCommon';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ScreenName, EnumName, EnumTask } from '../../../../../assets/constant';
import { AttSubmitLeaveDayBusinessFunction, generateRowActionAndSelected } from './AttSubmitLeaveDayBusiness';
import { connect } from 'react-redux';
import { startTask } from '../../../../../factories/BackGroundTask';
import DrawerServices from '../../../../../utils/DrawerServices';
import VnrText from '../../../../../components/VnrText/VnrText';
import { VnrBtnCreate } from '../../../../../componentsV3/VnrBtnCreate/VnrBtnCreate';

let configList = null,
    enumName = null,
    attSubmitLeaveDay = null,
    attSubmitLeaveDayAddOrEdit = null,
    attSubmitLeaveDayViewDetail = null,
    attSubmitLeaveDayKeyTask = null,
    pageSizeList = 20;

class AttSubmitLeaveDay extends Component {
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
                keyTask: attSubmitLeaveDayKeyTask,
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
        const _configList = configList[attSubmitLeaveDay],
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
                    keyTask: attSubmitLeaveDayKeyTask,
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
                    keyTask: attSubmitLeaveDayKeyTask,
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
        if (nextProps.reloadScreenName == attSubmitLeaveDayKeyTask) {
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
        //main
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        attSubmitLeaveDay = ScreenName.AttSubmitLeaveDay;
        attSubmitLeaveDayAddOrEdit = ScreenName.AttSubmitLeaveDayAddOrEdit;
        attSubmitLeaveDayViewDetail = ScreenName.AttSubmitLeaveDayViewDetail;
        attSubmitLeaveDayKeyTask = EnumTask.KT_AttSubmitLeaveDay;
        AttSubmitLeaveDayBusinessFunction.setThisForBusiness(this);
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: attSubmitLeaveDayKeyTask,
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
                {attSubmitLeaveDay && attSubmitLeaveDayViewDetail && enumName && (
                    <View style={[styleSheets.container]}>
                        <VnrFilterCommon
                            dataBody={dataBody}
                            style={styleContentFilterDesign}
                            screenName={attSubmitLeaveDay}
                            onSubmitEditing={this.reload}
                        />

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <AttLeaveDayList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: attSubmitLeaveDayViewDetail,
                                        screenName: attSubmitLeaveDay
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={attSubmitLeaveDayKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    api={{
                                        urlApi: '[URI_HR]/Att_GetData/New_GetLeaveDayByFilter',
                                        type: enumName.E_POST,
                                        dataBody: dataBody,
                                        pageSize: 20
                                    }}
                                    valueField="ID"
                                    renderConfig={renderRow}
                                />
                            )}

                            {PermissionForAppMobile &&
                                PermissionForAppMobile.value['New_Att_Leaveday_New_Index_Portal'] &&
                                PermissionForAppMobile.value['New_Att_Leaveday_New_Index_Portal']['Create'] && (
                                <VnrBtnCreate
                                    onAction={() => {
                                        DrawerServices.navigate(attSubmitLeaveDayAddOrEdit, {
                                            reload: () => this.reload()
                                        });
                                    }}
                                />
                            )}
                        </View>

                        {PermissionForAppMobile &&
                            PermissionForAppMobile.value['New_Attendance_ConfirmLeaveDay_Portal'] &&
                            PermissionForAppMobile.value['New_Attendance_ConfirmLeaveDay_Portal']['View'] && (
                            <TouchableOpacity
                                onPress={() => DrawerServices.navigate('AttConfirmLeaveDay')}
                                style={styles.btnConfirmLeaveDay}
                            >
                                <VnrText
                                    style={[styleSheets.lable, { color: Colors.primary }]}
                                    i18nKey="HRM_Attendance_LeaveDayComfirm"
                                />
                            </TouchableOpacity>
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
)(AttSubmitLeaveDay);

const styles = StyleSheet.create({
    btnConfirmLeaveDay: {
        height: 50,
        width: Size.deviceWidth,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
