import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSafeAreaView, Colors, CustomStyleSheet } from '../../../../constants/styleConfig';
import { dataVnrStorage } from '../../../../assets/auth/authentication';
import EmptyData from '../../../../components/EmptyData/EmptyData';
import VnrLoading from '../../../../components/VnrLoading/VnrLoading';
import VnrIndeterminate from '../../../../components/VnrLoading/VnrIndeterminate';
import { connect } from 'react-redux';
import { EnumTask, EnumName } from '../../../../assets/constant';
import { startTask } from '../../../../factories/BackGroundTask';
import { getDataLocal } from '../../../../factories/LocalData';
import HttpService from '../../../../utils/HttpService';
import DrawerServices from '../../../../utils/DrawerServices';
import VnrYearPicker from '../../../../components/VnrYearPicker/VnrYearPicker';
import { styleSheets } from '../../../../constants/styleConfig';
import TouchIDService from '../../../../utils/TouchIDService';

class SalRewardPayslip extends Component {
    constructor(porps) {
        super(porps);

        this.state = {
            isLoading: false,
            dataGeneral: [],
            dataListFull: null,
            dataList: null,
            //   restDayByType: 0,
            //   remainDayByType: 0,
            //   totalAvaiableDayByType: 0,
            isLoadingHeader: true,
            keyQuery: EnumName.E_PRIMARY_DATA,
            //   isActiveFilterYears: true,
            refreshing: false,
            isLoadingList: false,
            //   typeNumberLeave: translate('E_DAY_LOWERCASE'),
            cutOffData: {
                disable: false,
                refresh: false,
                value: null,
                data: []
            },

            yearSelected: new Date().getFullYear()
        };

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            setTimeout(() => {
                DrawerServices.getBeforeScreen() != 'SalRewardPayslipViewDetail' &&
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
        this.getDataGeneral();
        //this.getCutOffDuration();

        startTask({
            keyTask: EnumTask.KT_SalRewardPayslip,
            payload: {
                // ...dataBody,
                keyQuery: EnumName.E_PRIMARY_DATA,
                isCompare: true,
                reload: this.getDataGeneral
            }
        });
    };

    onPickcutOff = (item) => {
        if (!item) {
            return;
        }
        const { cutOffData } = this.state;
        const dataBody = {
            CutOffDurationID: item.ID
        };

        this.setState(
            {
                cutOffData: {
                    ...cutOffData,
                    value: item,
                    refresh: !cutOffData.refresh
                },
                isLoading: true,
                keyQuery: EnumName.E_FILTER
            },
            () => {
                startTask({
                    keyTask: EnumTask.KT_SalRewardPayslip,
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
        getDataLocal(EnumTask.KT_SalRewardPayslip).then((resData) => {
            const res = resData && resData[keyQuery] ? resData[keyQuery] : null;
            // console.log(res,'resresres')
            if (res && res !== EnumName.E_EMPTYDATA) {
                this.setState({
                    dataGeneral: res,
                    // dataList: _listData,
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
                    // dataList: EnumName.E_EMPTYDATA,
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
        const dataBody = {
            profileID: dataVnrStorage.currentUser.info.ProfileID,
            year: this.state.yearSelected
        };

        this.setState(
            {
                refreshing: true,
                keyQuery: EnumName.E_FILTER
            },
            () => {
                startTask({
                    keyTask: EnumTask.KT_SalRewardPayslip,
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

    getCutOffDuration = () => {
        const { cutOffData } = this.state;
        HttpService.Post(
            `[URI_HR]/Cat_GetData/GetMultiCatRewardPeriod_Portal?RewardPeriodYear=${this.state.yearSelected}`
        ).then((res) => {
            this.setState({
                cutOffData: {
                    ...cutOffData,
                    data: res,
                    value: res.length > 0 ? res[0] : null,
                    refresh: cutOffData.refresh
                }
            });
        });
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;
        if (nextProps.reloadScreenName == EnumTask.KT_SalRewardPayslip) {
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

    onConfirmYear = (item) => {
        let dataBody = {
            year: item.year
        };

        this.setState(
            {
                isLoading: true,
                yearSelected: item.year,
                keyQuery: EnumName.E_FILTER
            },
            () => {
                startTask({
                    keyTask: EnumTask.KT_SalRewardPayslip,
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

    render() {
        const { isLoading, dataGeneral } = this.state;
        // console.log(dataGeneral, 'dataGeneral');

        let viewContent = <View />;
        if (isLoading) {
            viewContent = <VnrLoading size="large" isVisible={isLoading} />;
        } else if (dataGeneral == EnumName.E_EMPTYDATA) {
            viewContent = <EmptyData messageEmptyData={'EmptyData'} />;
        } else if (dataGeneral && dataGeneral.length > 0) {
            viewContent = (
                <View style={styles.container}>
                    {/* <ScrollView style={{ flex: 1 }}>
                        <View style={containerItemDetail}>
                            {configListDetail.map((e) => {
                                return Vnr_Function.formatStringTypeV2(dataGeneral, e);
                            })}
                        </View>
                    </ScrollView> */}
                    <FlatList
                        data={dataGeneral}
                        refreshing={this.state.refreshing}
                        onRefresh={() => this._handleRefresh()}
                        keyExtractor={(item) => item.ID}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.styViewItemBtn}
                                onPress={() => {
                                    // console.log('123');
                                    DrawerServices.navigate('SalRewardPayslipViewDetail', {
                                        screenName: 'SalRewardPayslipViewDetail',
                                        dataId: item.ID,
                                        dataItem: item
                                    });
                                }}
                            >
                                {/* có thể sử dụng Vnr_Function.randomColor("A") để random màu sắc! */}
                                <View
                                    // eslint-disable-next-line react-native/no-inline-styles
                                    style={{
                                        height: '100%',
                                        width: 5,
                                        backgroundColor: `${'#' + Math.floor(Math.random() * 16777215).toString(16)}`,
                                        borderRadius: 2
                                    }}
                                />
                                <Text style={[styleSheets.lable, CustomStyleSheet.marginLeft(12)]}>
                                    {item.RewardPeriodName.toUpperCase()}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            );
        }

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styles.searchYear}>
                    {/* <VnrPickerQuickly
                        autoBind={true}
                        stylePicker={styles.styPickercutOff}
                        dataLocal={cutOffData.data}
                        refresh={cutOffData.refresh}
                        textField="RewardPeriodName"
                        filterParams={'RewardPeriodName'}
                        valueField="ID"
                        filter={true}
                        filterServer={false}
                        value={cutOffData.value}
                        disable={cutOffData.disable}
                        onFinish={(item) => this.onPickcutOff(item)}
                    /> */}
                    <VnrYearPicker onFinish={(item) => this.onConfirmYear(item)} value={this.state.yearSelected} />
                </View>

                {this._renderHeaderLoading()}
                {viewContent}
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    styViewItemBtn: {
        backgroundColor: Colors.white,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 12
    },
    container: {
        flex: 1,
        backgroundColor: Colors.whitePure2,
        minHeight: 200,
        padding: 12
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

export default connect(mapStateToProps, null)(SalRewardPayslip);
