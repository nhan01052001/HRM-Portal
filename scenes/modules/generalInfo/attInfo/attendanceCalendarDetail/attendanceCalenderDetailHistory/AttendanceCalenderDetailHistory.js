import React from 'react';
import { View, SafeAreaView } from 'react-native';

import { styleSheets, styleSafeAreaView } from '../../../../../../constants/styleConfig';
import AttendanceCalenderDetailHistoryList from './AttendanceCalenderDetailHistoryList';
import { ConfigList } from '../../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumTask } from '../../../../../../assets/constant';
import { connect } from 'react-redux';
import { startTask } from '../../../../../../factories/BackGroundTask';
import HttpService from '../../../../../../utils/HttpService';
import { dataVnrStorage } from '../../../../../../assets/auth/authentication';
import DrawerServices from '../../../../../../utils/DrawerServices';

let configList = null,
    enumName = null,
    attendanceCalenderDetailHistory = null,
    attendanceCalenderDetailHistoryDetail = null,
    attendanceCalenderDetailHistoryKeyTask = null,
    pageSizeList = 20;

class AttendanceCalenderDetailHistory extends React.Component {
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
                keyTask: attendanceCalenderDetailHistoryKeyTask,
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
        if (!configList[attendanceCalenderDetailHistory]) {
            configList[attendanceCalenderDetailHistory] = {
                Api: {
                    urlApi: '[URI_HR]/Att_GetData/GetConfirmHistoryAttendanceTable',
                    type: 'POST',
                    pageSize: 20
                },
                Order: [
                    {
                        field: 'TimeLog',
                        dir: 'desc'
                    }
                ],
                Filter: [
                    {
                        logic: 'and',
                        filters: []
                    }
                ],
                BusinessAction: []
            };
        }

        const _configList = configList[attendanceCalenderDetailHistory],
            renderRow = _configList[enumName.E_Row],
            orderBy = _configList[enumName.E_Order];

        // const dataRowActionAndSelected = generateRowActionAndSelected();
        let _params = {
            IsPortal: true,
            sort: orderBy,
            pageSize: pageSizeList,
            NotificationID: this.checkDataFormNotify()
        };

        return {
            // rowActions: dataRowActionAndSelected.rowActions,
            // selected: dataRowActionAndSelected.selected,
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
                    keyTask: attendanceCalenderDetailHistoryKeyTask,
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
                    keyTask: attendanceCalenderDetailHistoryKeyTask,
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
        if (nextProps.reloadScreenName == attendanceCalenderDetailHistoryKeyTask) {
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

    GetCutOffDurationByMonthYear = (_Month, _Year) => {
        // chay lazy loading
        // startTask({
        //   keyTask: EnumTask.KT_AttendanceCalendarDetail,
        //   payload: {
        //     Month: _Month,
        //     Year: _Year,
        //     keyQuery: EnumName.E_FILTER,
        //   }
        // });
        if (_Month && _Year) {
            HttpService.Post('[URI_HR]/Att_GetData/GetCutOffDurationByMonthYear', {
                Month: _Month,
                Year: _Year
            })
                .then((res) => {
                    if (res && res[0] && res[0].ID) {
                        let _paramsDefault = this.paramsDefault();
                        this.storeParamsDefault = _paramsDefault;
                        this.setState({
                            ..._paramsDefault,
                            dataBody: {
                                ..._paramsDefault.dataBody,
                                CutOffDurationID: res[0].ID,
                                ProfileID: dataVnrStorage.currentUser.info.ProfileID
                            }
                        });
                        startTask({
                            keyTask: attendanceCalenderDetailHistoryKeyTask,
                            payload: {
                                CutOffDurationID: res[0].ID,
                                ProfileID: dataVnrStorage.currentUser.info.ProfileID,
                                ..._paramsDefault.dataBody,
                                pageSize: pageSizeList,
                                keyQuery: EnumName.E_PRIMARY_DATA,
                                isCompare: true,
                                reload: this.reload
                            }
                        });
                    }
                })
                .catch((err) => {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: err });
                });
        }
    };

    componentDidMount() {
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        attendanceCalenderDetailHistory = ScreenName.AttendanceCalenderDetailHistory;
        attendanceCalenderDetailHistoryDetail = ScreenName.AttendanceCalenderDetailHistoryDetail;
        attendanceCalenderDetailHistoryKeyTask = EnumTask.KT_AttendanceCalenderDetailHistory;
        this.GetCutOffDurationByMonthYear(
            this.props.navigation.state.params.monthSelected,
            this.props.navigation.state.params.yearSelected
        );
        // let _paramsDefault = this.paramsDefault();
        // this.storeParamsDefault = _paramsDefault;
        // this.setState(_paramsDefault);

        // startTask({
        //     keyTask: attendanceCalenderDetailHistoryKeyTask,
        //     payload: {
        //         ..._paramsDefault.dataBody,
        //         pageSize: pageSizeList,
        //         keyQuery: EnumName.E_PRIMARY_DATA,
        //         isCompare: true,
        //         reload: this.reload
        //     },
        // });
    }

    render() {
        const { dataBody, renderRow, rowActions, selected, isLazyLoading, isRefreshList, keyQuery, dataChange } =
            this.state;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                {attendanceCalenderDetailHistory && attendanceCalenderDetailHistoryDetail && enumName && (
                    <View style={[styleSheets.container]}>
                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <AttendanceCalenderDetailHistoryList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: attendanceCalenderDetailHistoryDetail,
                                        screenName: attendanceCalenderDetailHistory
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={attendanceCalenderDetailHistoryKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    api={{
                                        urlApi: '[URI_HR]/Att_GetData/GetConfirmHistoryAttendanceTable',
                                        type: enumName.E_POST,
                                        dataBody: dataBody,
                                        pageSize: 20
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

const mapStateToProps = (state) => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

export default connect(mapStateToProps, null)(AttendanceCalenderDetailHistory);
