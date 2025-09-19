import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import SalaryList from '../salary/salaryList/SalaryList';
import { styleSheets, Colors, Size, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { ScreenName, EnumName, EnumTask } from '../../../../../assets/constant';
import { connect } from 'react-redux';
import { startTask } from '../../../../../factories/BackGroundTask';
import DrawerServices from '../../../../../utils/DrawerServices';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import VnrYearPicker from '../../../../../components/VnrYearPicker/VnrYearPicker';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import TouchIDService from '../../../../../utils/TouchIDService';
import RootState from '../../../../../redux/RootState';
import { translate } from '../../../../../i18n/translate';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';

let salary = null,
    salaryMonthDetail = null,
    salaryKeyTask = null,
    pageSizeList = 20;

class Salary extends Component {
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

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            DrawerServices.getBeforeScreen() != 'SalaryMonthDetail' &&
                DrawerServices.getBeforeScreen() != 'SalaryViewDetail' &&
                TouchIDService.checkConfirmPass(this.onFinish.bind(this));
        });
    }

    onFinish = isSuccess => {
        if (isSuccess) this.generaRender();
        else DrawerServices.goBack();
    };

    reload = paramsFilter => {
        const { dataBody } = this.state;
        let _paramsDefault = this.storeParamsDefault,
            _keyQuery = EnumName.E_FILTER;

        _paramsDefault = {
            ..._paramsDefault,
            keyQuery: _keyQuery,
            isRefreshList: !this.state.isRefreshList, // reload lại ds.
            dataBody: paramsFilter?.year ? { ..._paramsDefault.dataBody, Year: paramsFilter?.year } : dataBody
        };
        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: salaryKeyTask,
                payload: {
                    ...dataBody,
                    keyQuery: keyQuery,
                    isCompare: false,
                    reload: this.reload
                }
            });
        });
    };

    paramsDefault = () => {
        let _params = {
            Year: new Date().getFullYear(),
            ProfileID: dataVnrStorage.currentUser.info.ProfileID
        };

        return {
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
                    keyTask: salaryKeyTask,
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
                    keyTask: salaryKeyTask,
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
        const { keyQuery, dataBody } = this.state;
        const currentScreen = DrawerServices.getCurrentScreen();
        if (
            nextProps.cancelPublishPayslip != null &&
            nextProps.cancelPublishPayslip.year == dataBody.Year &&
            currentScreen == ScreenName.Salary
        ) {
            this.confirmCancelPublishPayslip(nextProps.cancelPublishPayslip);
        } else if (nextProps.reloadScreenName == salaryKeyTask) {
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

    confirmCancelPublishPayslip = data => {
        const { setCancelPaySlip } = this.props,
            { cutOffDurationName } = data;

        setCancelPaySlip(null);
        let mess = translate('HRM_PortalApp_CancelPublishPayslip_Confirm');
        if (cutOffDurationName) mess = mess.replace('E_CUTOFF_NAME', cutOffDurationName);

        ToasterSevice.showWarning(mess, 5000);
        this.reload();
    };

    generaRender = () => {
        // let dataVnrStorage = getDataVnrStorage(),
        //   { currentUser } = dataVnrStorage;

        // setTimeout(() => {
        //   const data = {
        //     cutOffDurationID: '4a83b472-8045-4170-99da-b9dc4137655f',
        //     userID: currentUser.headers?.userid,
        //     year: '2021',
        //     cutOffDurationName: 'Tháng 11'
        //   }
        //   store.dispatch(
        //     RootState.actions.setCancelPaySlip(data),
        //   );
        // }, 9000);
        //set by config

        salary = ScreenName.Salary;
        salaryMonthDetail = ScreenName.SalaryMonthDetail;
        salaryKeyTask = EnumTask.KT_Salary;

        // AttSubmitPlanOvertimeBusinessFunction.setThisForBusiness(this);
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: salaryKeyTask,
            payload: {
                ..._paramsDefault.dataBody,
                pageSize: pageSizeList,
                keyQuery: EnumName.E_PRIMARY_DATA,
                isCompare: true,
                reload: this.reload
            }
        });
    };

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
    }

    render() {
        const { rowActions, selected, isLazyLoading, isRefreshList, keyQuery, dataChange, dataBody } = this.state;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                {salary && salaryMonthDetail && dataBody ? (
                    <View style={[styleSheets.containerGrey]}>
                        <View
                            style={styles.styViewYearPicker}
                        >
                            <VnrYearPicker
                                onFinish={item => this.reload(item)}
                                value={dataBody.Year}
                                stylePicker={{
                                    backgroundColor: Colors.white
                                }}
                            />
                        </View>
                        {keyQuery && (
                            <SalaryList
                                detail={{
                                    dataLocal: false,
                                    screenDetail: salaryMonthDetail,
                                    screenName: salary
                                }}
                                rowActions={rowActions}
                                selected={selected}
                                reloadScreenList={this.reload}
                                keyDataLocal={salaryKeyTask}
                                pullToRefresh={this.pullToRefresh}
                                pagingRequest={this.pagingRequest}
                                isLazyLoading={isLazyLoading}
                                isRefreshList={isRefreshList}
                                dataChange={dataChange}
                                keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                // api={{
                                //     urlApi: '[URI_HR]/Att_GetData/New_PlanOvertimeByFilter',
                                //     type: enumName.E_POST,
                                //     dataBody: dataBody,
                                //     pageSize: 20,
                                // }}
                                valueField="ID"
                                // renderConfig={renderRow}
                            />
                        )}
                    </View>
                ) : (
                    <VnrLoading size="large" isVisible={true} />
                )}
            </SafeAreaView>
        );
    }
}

const mapStateToProps = state => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message,
        cancelPublishPayslip: state.RootState.cancelPublishPayslip
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setCancelPaySlip: data => {
            dispatch(RootState.actions.setCancelPaySlip(data));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Salary);

const styles = StyleSheet.create({
    styViewYearPicker: { flexDirection: 'row',
        marginVertical: Size.defineHalfSpace
    }
})