import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Size, styleSafeAreaView, stylesListPickerControl } from '../../constants/styleConfig';
import NtfNotificationList from './ntfNotificationfList/NtfNotificationList';
import DrawerServices from '../../utils/DrawerServices';
import { IconNotify } from '../../constants/Icons';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import { startTask } from '../../factories/BackGroundTask';
import { ConfigVersionBuild } from '../../assets/configProject/ConfigVersionBuild';
import { EnumName, EnumTask, ScreenName } from '../../assets/constant';
import { generateRowActionAndSelected, NtfNotificationBusinessFunction } from './NtfNotificationBusiness';
//#region  Overtime
import AttApproveOvertimeBusiness0 from '../modules/attendance/attOvertime/attApproveOvertime/AttApproveOvertimeBusiness';
import AttApproveOvertimeBusiness080834 from '../modules080834/attendance/attOvertime/attApproveOvertime/AttApproveOvertimeBusiness';
import AttApproveOvertimeBusiness080904 from '../modules080904/attendance/attOvertime/attApproveOvertime/AttApproveOvertimeBusiness';
import AttApproveOvertimeBusiness080912 from '../modules080912/attendance/attOvertime/attApproveOvertime/AttApproveOvertimeBusiness';
//#endregion
//#region  LeaveDay
import AttApproveLeaveDayBusiness0 from '../modules/attendance/attLeaveDay/attApproveLeaveDay/AttApproveLeaveDayBusiness';
import AttApproveLeaveDayBusiness080834 from '../modules080834/attendance/attLeaveDay/attApproveLeaveDay/AttApproveLeaveDayBusiness';
import AttApproveLeaveDayBusiness080904 from '../modules080904/attendance/attLeaveDay/attApproveLeaveDay/AttApproveLeaveDayBusiness';
import AttApproveLeaveDayBusiness080912 from '../modules080912/attendance/attLeaveDay/attApproveLeaveDay/AttApproveLeaveDayBusiness';
//#endregion
//#region  TSLRegister
import AttApproveTSLRegisterBusiness0 from '../modules/attendance/attTSLRegister/attApproveTSLRegister/AttApproveTSLRegisterBusiness';
import AttApproveTSLRegisterBusiness080834 from '../modules080834/attendance/attTSLRegister/attApproveTSLRegister/AttApproveTSLRegisterBusiness';
import AttApproveTSLRegisterBusiness080904 from '../modules080904/attendance/attTSLRegister/attApproveTSLRegister/AttApproveTSLRegisterBusiness';
import AttApproveTSLRegisterBusiness080912 from '../modules080912/attendance/attTSLRegister/attApproveTSLRegister/AttApproveTSLRegisterBusiness';
//#endregion
//#region  Roster
import AttApproveRosterBusiness0 from '../modules/attendance/attRoster/attApproveRoster/AttApproveRosterBusiness';
import AttApproveRosterBusiness080834 from '../modules080834/attendance/attRoster/attApproveRoster/AttApproveRosterBusiness';
import AttApproveRosterBusiness080904 from '../modules080904/attendance/attRoster/attApproveRoster/AttApproveRosterBusiness';
import AttApproveRosterBusiness080912 from '../modules080912/attendance/attRoster/attApproveRoster/AttApproveRosterBusiness';
//#endregion
//#region  Roster
import HreTaskBusiness0 from '../modules/humanResource/hreTask/HreTaskBusiness';
import HreTaskBusiness080834 from '../modules080834/humanResource/hreTask/HreTaskBusiness';
import HreTaskBusiness080904 from '../modules080904/humanResource/hreTask/HreTaskBusiness';
import HreTaskBusiness080912 from '../modules080912/humanResource/hreTask/HreTaskBusiness';
//#endregion
const listBussiness = {
    //#region  TAMScanLog
    attApproveTSLRegisterBusiness: {
        generateRowActionAndSelected: AttApproveTSLRegisterBusiness0.generateRowActionAndSelected,
        AttApproveTSLRegisterBusinessFunction: AttApproveTSLRegisterBusiness0.AttApproveTSLRegisterBusinessFunction
    },
    attApproveTSLRegisterBusiness080834: {
        generateRowActionAndSelected: AttApproveTSLRegisterBusiness080834.generateRowActionAndSelected,
        AttApproveTSLRegisterBusinessFunction: AttApproveTSLRegisterBusiness080834.AttApproveTSLRegisterBusinessFunction
    },
    attApproveTSLRegisterBusiness080904: {
        generateRowActionAndSelected: AttApproveTSLRegisterBusiness080904.generateRowActionAndSelected,
        AttApproveTSLRegisterBusinessFunction: AttApproveTSLRegisterBusiness080904.AttApproveTSLRegisterBusinessFunction
    },

    attApproveTSLRegisterBusiness080912: {
        generateRowActionAndSelected: AttApproveTSLRegisterBusiness080912.generateRowActionAndSelected,
        AttApproveTSLRegisterBusinessFunction: AttApproveTSLRegisterBusiness080912.AttApproveTSLRegisterBusinessFunction
    },
    //#endregion
    //#region  AttOvertime
    attApproveOvertimeBusiness: {
        generateRowActionAndSelected: AttApproveOvertimeBusiness0.generateRowActionAndSelected,
        AttApproveOvertimeBusinessFunction: AttApproveOvertimeBusiness0.AttApproveOvertimeBusinessFunction
    },
    attApproveOvertimeBusiness080834: {
        generateRowActionAndSelected: AttApproveOvertimeBusiness080834.generateRowActionAndSelected,
        AttApproveOvertimeBusinessFunction: AttApproveOvertimeBusiness080834.AttApproveOvertimeBusinessFunction
    },
    attApproveOvertimeBusiness080904: {
        generateRowActionAndSelected: AttApproveOvertimeBusiness080904.generateRowActionAndSelected,
        AttApproveOvertimeBusinessFunction: AttApproveOvertimeBusiness080904.AttApproveOvertimeBusinessFunction
    },

    attApproveOvertimeBusiness080912: {
        generateRowActionAndSelected: AttApproveOvertimeBusiness080912.generateRowActionAndSelected,
        AttApproveOvertimeBusinessFunction: AttApproveOvertimeBusiness080912.AttApproveOvertimeBusinessFunction
    },
    //#endregion
    //#region LeaveDay
    attApproveLeaveDayBusiness: {
        generateRowActionAndSelected: AttApproveLeaveDayBusiness0.generateRowActionAndSelected,
        AttApproveLeaveDayBusinessFunction: AttApproveLeaveDayBusiness0.AttApproveLeaveDayBusinessFunction
    },
    attApproveLeaveDayBusiness080834: {
        generateRowActionAndSelected: AttApproveLeaveDayBusiness080834.generateRowActionAndSelected,
        AttApproveLeaveDayBusinessFunction: AttApproveLeaveDayBusiness080834.AttApproveLeaveDayBusinessFunction
    },
    attApproveLeaveDayBusiness080904: {
        generateRowActionAndSelected: AttApproveLeaveDayBusiness080904.generateRowActionAndSelected,
        AttApproveLeaveDayBusinessFunction: AttApproveLeaveDayBusiness080904.AttApproveLeaveDayBusinessFunction
    },

    attApproveLeaveDayBusiness080912: {
        generateRowActionAndSelected: AttApproveLeaveDayBusiness080912.generateRowActionAndSelected,
        AttApproveLeaveDayBusinessFunction: AttApproveLeaveDayBusiness080912.AttApproveLeaveDayBusinessFunction
    },
    //#endregion
    //#region Roster
    attApproveRosterBusiness: {
        generateRowActionAndSelected: AttApproveRosterBusiness0.generateRowActionAndSelected,
        AttApproveRosterBusinessFunction: AttApproveRosterBusiness0.AttApproveRosterBusinessFunction
    },
    attApproveRosterBusiness080834: {
        generateRowActionAndSelected: AttApproveRosterBusiness080834.generateRowActionAndSelected,
        AttApproveRosterBusinessFunction: AttApproveRosterBusiness080834.AttApproveRosterBusinessFunction
    },
    attApproveRosterBusiness080904: {
        generateRowActionAndSelected: AttApproveRosterBusiness080904.generateRowActionAndSelected,
        AttApproveRosterBusinessFunction: AttApproveRosterBusiness080904.AttApproveRosterBusinessFunction
    },

    attApproveRosterBusiness080912: {
        generateRowActionAndSelected: AttApproveRosterBusiness080912.generateRowActionAndSelected,
        AttApproveRosterBusinessFunction: AttApproveRosterBusiness080912.AttApproveRosterBusinessFunction
    },
    //#endregion
    //#region HreTask
    hreTaskEvaluation: {
        generateRowActionAndSelected: HreTaskBusiness0.generateRowActionAndSelected,
        TaskBusinessBusinessFunction: HreTaskBusiness0.TaskBusinessBusinessFunction
    },
    hreTaskEvaluation080834: {
        generateRowActionAndSelected: HreTaskBusiness080834.generateRowActionAndSelected,
        TaskBusinessBusinessFunction: HreTaskBusiness080834.TaskBusinessBusinessFunction
    },
    hreTaskEvaluation080904: {
        generateRowActionAndSelected: HreTaskBusiness080904.generateRowActionAndSelected,
        TaskBusinessBusinessFunction: HreTaskBusiness080904.TaskBusinessBusinessFunction
    },

    hreTaskEvaluation080912: {
        generateRowActionAndSelected: HreTaskBusiness080912.generateRowActionAndSelected,
        TaskBusinessBusinessFunction: HreTaskBusiness080912.TaskBusinessBusinessFunction
    }
    //#endregion
};

class NtfOverview extends Component {
    constructor(props) {
        super(props);
        // this.checkPosition = null;

        this.state = {
            // isLoading: true,
            listConfigModule: null,
            isRefreshList: false,
            isLazyLoading: false,
            keyQuery: null,
            dataChange: false, //biến check dữ liệu có thay đổi hay không
            rowActions: []
        };

        // props.navigation.setParams({
        //     headerRight: (
        //         <View style={{ flexDirection: 'row' }}>
        //             <TouchableOpacity
        //                 onPress={() => DrawerServices.navigate('NtfOffSetting')}
        //                 style={{ flex: 1 }}>
        //                 <View style={stylesListPickerControl.headerButtonStyle}>
        //                     <IconNotify
        //                         size={Size.iconSizeHeader}
        //                         color={Colors.gray_10}
        //                     />
        //                 </View>
        //             </TouchableOpacity>
        //         </View>
        //     ),
        // });

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            NtfNotificationBusinessFunction.setThisForBusiness(this);
        });

        this.pageSize = 20;
    }

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
    }

    reload = () => {
        // Gửi yêu cầu lọc dữ liệu
        this.setState(
            {
                keyQuery: EnumName.E_PRIMARY_DATA,
                isRefreshList: !this.state.isRefreshList
            },
            () => {
                startTask({
                    keyTask: EnumTask.KT_NtfOverview,
                    payload: {
                        PageSize: this.pageSize,
                        keyQuery: EnumName.E_PRIMARY_DATA,
                        isCompare: true,
                        reload: this.reload
                    }
                });
            }
        );
    };

    pullToRefresh = () => {
        const { dataBody, keyQuery } = this.state;
        this.setState(
            {
                keyQuery: keyQuery == EnumName.E_FILTER ? keyQuery : EnumName.E_PRIMARY_DATA
            },
            () => {
                startTask({
                    keyTask: EnumTask.KT_NtfOverview,
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
                    keyTask: EnumTask.KT_NtfOverview,
                    payload: {
                        ...dataBody,
                        Page: page,
                        PageSize: pageSize,
                        keyQuery: EnumName.E_PAGING,
                        isCompare: false,
                        reload: this.reload
                    }
                });
            }
        );
    };

    initState = () => {
        const checkVersion = ConfigVersionBuild.value != null ? ConfigVersionBuild.value : '080834',
            rowActionsPrimary = generateRowActionAndSelected().rowActions,
            initState = {};
        try {
            //#region  [ApproveOvertime]
            const attApproveOvertimeBusinessFunction =
                    listBussiness[`attApproveOvertimeBusiness${checkVersion}`].AttApproveOvertimeBusinessFunction,
                attApproveOvertimeRowAction = listBussiness[
                    `attApproveOvertimeBusiness${checkVersion}`
                ].generateRowActionAndSelected();

            initState[ScreenName.AttApproveOvertime] = {
                rowActions: attApproveOvertimeRowAction.rowActions,
                screenName: ScreenName.AttApproveOvertime
            };
            attApproveOvertimeBusinessFunction.setThisForBusiness(this, true);
            //#endregion

            //#region  [LeaveDay]
            const attApproveLeaveDayBusinessFunction =
                    listBussiness[`attApproveLeaveDayBusiness${checkVersion}`].AttApproveLeaveDayBusinessFunction,
                attApproveLeaveDayRowAction = listBussiness[
                    `attApproveLeaveDayBusiness${checkVersion}`
                ].generateRowActionAndSelected();

            initState[ScreenName.AttApproveLeaveDay] = {
                rowActions: attApproveLeaveDayRowAction.rowActions,
                screenName: ScreenName.AttApproveLeaveDay
            };
            attApproveLeaveDayBusinessFunction.setThisForBusiness(this, true);
            //#endregion

            //#region  [TSLRegister]
            const attApproveTSLRegisterBusinessFunction =
                    listBussiness[`attApproveTSLRegisterBusiness${checkVersion}`].AttApproveTSLRegisterBusinessFunction,
                attApproveTSLRegisterRowAction = listBussiness[
                    `attApproveTSLRegisterBusiness${checkVersion}`
                ].generateRowActionAndSelected();

            initState[ScreenName.AttApproveTSLRegister] = {
                rowActions: attApproveTSLRegisterRowAction.rowActions,
                screenName: ScreenName.AttApproveTSLRegister
            };
            attApproveTSLRegisterBusinessFunction.setThisForBusiness(this, true);
            //#endregion

            //#region  [Roster]
            const attApproveRosterBusinessFunction =
                    listBussiness[`attApproveRosterBusiness${checkVersion}`].AttApproveRosterBusinessFunction,
                attApproveRosterBusinessRowAction = listBussiness[
                    `attApproveRosterBusiness${checkVersion}`
                ].generateRowActionAndSelected();

            initState[ScreenName.AttApproveRoster] = {
                rowActions: attApproveRosterBusinessRowAction.rowActions,
                screenName: ScreenName.AttApproveRoster
            };
            attApproveRosterBusinessFunction.setThisForBusiness(this, true);
            //#endregion

            //#region  [HreTask Evaluation]
            const hreTaskEvaluationBusinessFunction =
                    listBussiness[`hreTaskEvaluation${checkVersion}`].TaskBusinessBusinessFunction,
                hreTaskEvaluationBusinessRowAction = listBussiness[
                    `hreTaskEvaluation${checkVersion}`
                ].generateRowActionAndSelected(ScreenName.HreTaskEvaluation);

            initState[ScreenName.HreTaskEvaluation] = {
                rowActions: hreTaskEvaluationBusinessRowAction.rowActions,
                screenName: ScreenName.HreTaskEvaluation
            };
            hreTaskEvaluationBusinessFunction.setThisForBusiness(this);
            //#endregion

            console.log(rowActionsPrimary, 'rowActionsPrimary');
            this.setState(
                {
                    listConfigModule: initState,
                    rowActions: rowActionsPrimary,
                    keyQuery: EnumName.E_PRIMARY_DATA
                },
                () => {
                    startTask({
                        keyTask: EnumTask.KT_NtfOverview,
                        payload: {
                            PageSize: this.pageSize,
                            keyQuery: EnumName.E_PRIMARY_DATA,
                            isCompare: true,
                            reload: this.reload
                        }
                    });
                }
            );
        } catch (error) {
            console.log(error, 'error');
        }
    };

    componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;
        debugger;
        if (nextProps.reloadScreenName == EnumTask.KT_NtfOverview) {
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
        this.initState();
    }

    render() {
        const { listConfigModule, keyQuery, isLazyLoading, isRefreshList, dataChange, rowActions } = this.state;
        return (
            <SafeAreaView {...styleSafeAreaView}>
                {listConfigModule !== null && (
                    <View style={styles.container}>
                        {keyQuery && (
                            <NtfNotificationList
                                listConfigModule={listConfigModule}
                                reloadScreenList={this.reload.bind(this)}
                                keyDataLocal={EnumTask.KT_NtfOverview}
                                isLazyLoading={isLazyLoading}
                                isRefreshList={isRefreshList}
                                dataChange={dataChange}
                                keyQuery={keyQuery}
                                valueField="ID"
                                pagingRequest={this.pagingRequest}
                                pullToRefresh={this.pullToRefresh}
                                rowActions={rowActions}
                            />
                        )}
                    </View>
                )}
            </SafeAreaView>
        );
    }
}
const TABAR_HEIGHT = Size.deviceWidth <= 320 ? Size.deviceheight * 0.09 : Size.deviceheight * 0.075;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: TABAR_HEIGHT
    }
});

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
)(NtfOverview);
