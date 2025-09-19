import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import moment from 'moment';
import {
    styleSafeAreaView,
    Colors,
    stylesScreenDetailV2,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import VnrYearPicker from '../../../../../components/VnrYearPicker/VnrYearPicker';
import VnrIndeterminate from '../../../../../components/VnrLoading/VnrIndeterminate';
import { connect } from 'react-redux';
import { EnumTask, EnumName, ScreenName } from '../../../../../assets/constant';
import { startTask } from '../../../../../factories/BackGroundTask';
import { getDataLocal } from '../../../../../factories/LocalData';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import SalPITAmountList from '../salPITAmountList/SalPITAmountList';
import DrawerServices from '../../../../../utils/DrawerServices';
import TouchIDService from '../../../../../utils/TouchIDService';

const configDefault = [
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_Personal_New_SalaryInfo_PITFinalizationYear',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'CodeEmp',
        DisplayKey: 'HRM_Personal_New_SalaryInfo_TaxPolicy',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'CodeTax',
        DisplayKey: 'HRM_Personal_New_SalaryInfo_TaxCode',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TotalTaxableIncome',
        DisplayKey: 'HRM_Personal_New_SalaryInfo_TaxableIncome',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TotalDependent',
        DisplayKey: 'HRM_Personal_New_SalaryInfo_TotalDependent',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TotalFamilyDeduction',
        DisplayKey: 'HRM_Personal_New_SalaryInfo_TotalFamilyDeduction',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TotalCharity',
        DisplayKey: 'HRM_Personal_New_SalaryInfo_TotalCharity',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TotalIns',
        DisplayKey: 'HRM_Personal_New_SalaryInfo_TotalIns',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TotalOtherIncome',
        DisplayKey: 'HRM_Personal_New_SalaryInfo_TotalOtherIncome',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'AvgAssessableIncome',
        DisplayKey: 'HRM_Personal_New_SalaryInfo_AvgAssessableIncome',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TotalDeductedPIT',
        DisplayKey: 'HRM_Personal_New_SalaryInfo_TotalDeductedPIT',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TotallPersonalIncomeTax',
        DisplayKey: 'HRM_Personal_New_SalaryInfo_TotallPersonalIncomeTax',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'RedundantTaxincome',
        DisplayKey: 'HRM_Personal_New_SalaryInfo_RedundantTaxincome',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ShortTaxincome',
        DisplayKey: 'HRM_Personal_New_SalaryInfo_ShortTaxincome',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_Personal_New_SalaryInfo_MonthlyPITTitle',
        DataType: 'string'
    }
];

class SalSubmitPITAmount extends Component {
    constructor(porps) {
        super(porps);

        this.state = {
            isLoading: false,
            dataGeneral: {},
            dataListFull: null,
            dataList: null,
            yearSelected: new Date().getFullYear(),
            isLoadingHeader: true,
            keyQuery: EnumName.E_PRIMARY_DATA,
            refreshing: false,
            isLoadingList: false,
            cutOffData: {
                disable: false,
                refresh: false,
                value: null,
                data: []
            }
        };

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            setTimeout(() => {
                DrawerServices.getBeforeScreen() != 'SalSubmitPITAmountViewDetail' &&
                    TouchIDService.checkConfirmPass(this.onFinish.bind(this));
            }, 200);
        });
    }

    onFinish = (isSuccess) => {
        if (isSuccess) this.generaRender();
        else DrawerServices.goBack();
    };

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
    }

    generaRender = () => {
        const { params = {} } = this.props.navigation.state,
            { CutOffDurationID } = typeof params == 'object' ? params : JSON.parse(params);

        if (CutOffDurationID) {
            const yearFromFilter = parseInt(CutOffDurationID);
            this.onSubmitYear({
                year: yearFromFilter
            });
        } else {
            this.getDataGeneral();
            startTask({
                keyTask: EnumTask.KT_SalSubmitPITAmount,
                payload: {
                    keyQuery: EnumName.E_PRIMARY_DATA,
                    isCompare: true,
                    reload: this.getDataGeneral
                }
            });
        }
    };

    checkDataFormNotify = () => {};

    onSubmitYear = (data) => {
        let dataBody = {
            ProfileID: dataVnrStorage.currentUser.info.ProfileID,
            Year: data.year,
            MonthYearFrom: `01/${data.year}`,
            MonthYearTo: `12/${data.year}`
        };

        this.setState(
            {
                isLoading: true,
                yearSelected: data.year,
                keyQuery: EnumName.E_FILTER
            },
            () => {
                startTask({
                    keyTask: EnumTask.KT_SalSubmitPITAmount,
                    payload: {
                        ...dataBody,
                        keyQuery: EnumName.E_FILTER,
                        isCompare: false,
                        reload: this.getDataGeneral
                    }
                });
            }
        );
    };

    filterType = () => {};

    _renderHeaderLoading = () => {
        return <VnrIndeterminate isVisible={this.state.isLoadingHeader} />;
    };

    getDataGeneral = () => {
        const { keyQuery } = this.state;

        this.setState({ isLoading: true });
        getDataLocal(EnumTask.KT_SalSubmitPITAmount).then((resData) => {
            const res = resData && resData[keyQuery] ? resData[keyQuery] : null;
            if (res && res !== EnumName.E_EMPTYDATA) {
                const masterData = res[0] ? res[0] : {},
                    listData = res[1] && res[1]['Data'] ? res[1]['Data'] : null;

                this.setState({
                    dataGeneral: masterData,
                    dataList: listData,
                    // dataListFull: _listFullData,
                    // restDayByType: _restDayByType,
                    // remainDayByType: _remainDayByType,
                    // totalAvaiableDayByType: _totalAvaiableDayByType,
                    // typeNumberLeave: translate('E_DAY_LOWERCASE'),
                    isLoading: false,
                    isLoadingHeader: false,
                    refreshing: false
                });
            } else if (res === EnumName.E_EMPTYDATA) {
                this.setState({
                    dataGeneral: EnumName.E_EMPTYDATA,
                    dataList: EnumName.E_EMPTYDATA,
                    // dataListFull: EnumName.E_EMPTYDATA,
                    // typeNumberLeave: translate('E_DAY_LOWERCASE'),
                    // restDayByType: 0,
                    // remainDayByType: 0,
                    // totalAvaiableDayByType: 0,
                    isLoading: false,
                    isLoadingHeader: false,
                    refreshing: false
                });
            }
        });
    };

    _handleRefresh = () => {
        const date = new Date(),
            currentYear = parseInt(moment(date).format('YYYY'));

        let dataBody = {
            ProfileID: dataVnrStorage.currentUser.info.ProfileID,
            Year: new Date().getFullYear(),
            MonthYearFrom: `01/${currentYear}`,
            MonthYearTo: `12/${currentYear}`
        };

        this.setState(
            {
                refreshing: true,
                keyQuery: EnumName.E_FILTER
            },
            () => {
                startTask({
                    keyTask: EnumTask.KT_SalSubmitPITAmount,
                    payload: {
                        ...dataBody,
                        keyQuery: EnumName.E_FILTER,
                        isCompare: false,
                        reload: this.getDataGeneral
                    }
                });
            }
        );
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;
        if (nextProps.reloadScreenName == EnumTask.KT_SalSubmitPITAmount) {
            //khi màn hình đang reload thì messsage phải là filter thì màn hình mới reload
            if (keyQuery === EnumName.E_FILTER && nextProps.message && keyQuery == nextProps.message.keyQuery) {
                this.getDataGeneral();
            } else if (nextProps.message && keyQuery == nextProps.message.keyQuery) {
                // dataChange == true ? khác : giống nhau
                if (!nextProps.message.dataChange) {
                    this.setState({
                        isLoadingHeader: false
                    });
                } else {
                    this.getDataGeneral();
                }
            }
        }
    }

    componentDidMount() {}

    render() {
        const { isLoading, dataGeneral, yearSelected, dataList } = this.state,
            { containerItemDetail } = stylesScreenDetailV2,
            configListDetail =
                ConfigListDetail.value[ScreenName.SalSubmitPITAmount] != null
                    ? ConfigListDetail.value[ScreenName.SalSubmitPITAmount]
                    : configDefault;

        let viewContent = <View />;
        if (isLoading) {
            viewContent = <VnrLoading size="large" isVisible={isLoading} />;
        } else if (dataGeneral == EnumName.E_EMPTYDATA) {
            viewContent = <EmptyData messageEmptyData={'EmptyData'} />;
        } else if (dataGeneral && Object.keys(dataGeneral).length > 0) {
            viewContent = (
                <View style={styles.container}>
                    <ScrollView style={CustomStyleSheet.flex(1)}>
                        <View style={containerItemDetail}>
                            {configListDetail.map((e) => {
                                return Vnr_Function.formatStringTypeV2(dataGeneral, e);
                            })}
                        </View>

                        <SalPITAmountList
                            detail={{
                                dataLocal: false,
                                screenDetail: ScreenName.SalSubmitPITAmountViewDetail,
                                screenName: ScreenName.SalSubmitPITAmountViewDetail
                            }}
                            dataLocal={dataList}
                            rowActions={[]}
                            selected={[]}
                            valueField="ID"
                        />
                    </ScrollView>
                </View>
            );
        }

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styles.searchYear}>
                    <VnrYearPicker onFinish={(item) => this.onSubmitYear(item)} value={yearSelected} />
                </View>

                {this._renderHeaderLoading()}
                {viewContent}
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        minHeight: 200
    },
    searchYear: {
        backgroundColor: Colors.white,
        paddingVertical: 10,
        flexDirection: 'row'
    }
});

const mapStateToProps = (state) => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message,
        language: state.languageReducer.language
    };
};

export default connect(mapStateToProps, null)(SalSubmitPITAmount);
