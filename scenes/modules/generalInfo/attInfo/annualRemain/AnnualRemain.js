import React, { Component } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    Size,
    styleViewTitleForGroup,
    styleSafeAreaView,
    Colors,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import AnnualRemainList from './AnnualRemainList';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import VnrText from '../../../../../components/VnrText/VnrText';
import moment from 'moment';
import HttpService from '../../../../../utils/HttpService';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import ChartAnnualRemain from './ChartAnnualRemain';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import { IconSearchOutline } from '../../../../../constants/Icons';
import { ScreenName } from '../../../../../assets/constant';
export default class AnnualRemain extends Component {
    constructor(porps) {
        super(porps);

        this.state = {
            Year: moment().format('YYYY'),
            dataGeneral: null,
            dataList: null,
            isloadingData: true,
            isRefreshChart: false
        };
    }

    onChangeYear = (year) => {
        this.setState({ Year: year });
    };

    onSubmitEditing = () => {
        this.setState({ isRefreshList: !this.state.isRefreshList, isloadingData: true }, () => {
            this.getDataGeneral();
        });
    };

    getDataGeneral = () => {
        const listRequest = [
            HttpService.Post('[URI_HR]/Att_GetData/Get_RemainingLeaveByProfileId', {
                profileID: null,
                YearAnnual: this.state.Year
            }),
            HttpService.Post('[URI_HR]/Att_GetData/GetAnnualRemainLeave_ByProfileId_Portal', {
                profileID: null,
                YearAnnual: this.state.Year
            })
        ];
        HttpService.MultiRequest(listRequest, this.getDataGeneral).then((resAll) => {
            const [res1, res2] = resAll;
            this.setState({
                dataGeneral: { ...res1 },
                isloadingData: false,
                dataList: res2.Data
            });
        });
    };

    componentDidMount() {
        this.getDataGeneral();
    }

    render() {
        const { Year, dataGeneral, isloadingData, isRefreshChart, dataList } = this.state;
        let renderRow =
                ConfigList && ConfigList.value ? ConfigList.value['GeneralInfoAttAnnualRemainDetail']['Row'] : [],
            listConfigGeneral =
                ConfigList && ConfigList.value ? ConfigList.value['GeneralInfoAttAnnualRemain']['Row'] : [],
            listConfigMaster =
                ConfigList && ConfigList.value ? ConfigList.value['GeneralInfoAttAnnualRemain']['Master'] : [],
            viewContent = <View />;

        if (isloadingData) {
            viewContent = (
                <View style={CustomStyleSheet.flex(1)}>
                    <VnrLoading size="large" isVisible={true} />
                </View>
            );
        } else if (dataGeneral && dataList) {
            viewContent = (
                <View style={CustomStyleSheet.flex(1)}>
                    <View style={styles.containerChart}>
                        {dataGeneral && (
                            <ChartAnnualRemain
                                dataSource={dataGeneral}
                                listConfigMaster={listConfigMaster}
                                listConfigGeneral={listConfigGeneral}
                                isRefresh={isRefreshChart}
                            />
                        )}
                    </View>
                    <View style={styles.containerWhite}>
                        <View style={CustomStyleSheet.flex(1)}>
                            <View
                                style={[styleViewTitleForGroup.styleViewTitleGroup, CustomStyleSheet.marginBottom(10)]}
                            >
                                <VnrText
                                    style={styleViewTitleForGroup.textLableGroup}
                                    i18nKey={'HRM_Tab_Attendance_RemainingLeave'}
                                />
                            </View>
                            <AnnualRemainList
                                detail={{
                                    dataLocal: false,
                                    screenDetail: ScreenName.AnnualRemainViewDetail,
                                    screenName: ScreenName.GeneralInfoAttAnnualRemainDetail
                                }}
                                dataLocal={dataList}
                                valueField="ID"
                                renderConfig={renderRow}
                            />
                        </View>
                    </View>
                </View>
            );
        } else if (!isloadingData) {
            viewContent = (
                <View style={CustomStyleSheet.flex(1)}>
                    <EmptyData messageEmptyData={'EmptyData'} />
                </View>
            );
        }
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styles.containerGrey}>
                    <View style={styles.searchYear}>
                        <View style={styles.searchYear_bnt}>
                            <IconSearchOutline size={Size.iconSize - 2} color={Colors.gray_10} />
                            <VnrTextInput
                                iconCloseColor={Colors.gray_10}
                                onClearText={() => this.setState({ Year: '' }, this.onSubmitEditing)}
                                charType={'int'}
                                style={styles.searchYear__input}
                                value={Year}
                                keyboardType={'numeric'}
                                returnKeyType={Platform.OS === 'ios' ? 'done' : 'search'}
                                onChangeText={this.onChangeYear}
                                onSubmitEditing={this.onSubmitEditing}
                                maxLength={4}
                            />
                        </View>
                    </View>
                    {viewContent}
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    containerGrey: { flex: 1, backgroundColor: Colors.greyBorder },
    containerWhite: { flex: 1, backgroundColor: Colors.white, minHeight: 200 },
    containerChart: {
        backgroundColor: Colors.white,
        marginVertical: 10
        // paddingVertical : 10,
    },
    searchYear: {
        backgroundColor: Colors.white,
        height: 60,
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    searchYear_bnt: {
        flex: 1,
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
        borderRadius: 5,
        width: '100%'
    },
    searchYear__input: {
        flex: 1,
        height: Size.heightInput,
        paddingLeft: 5,
        color: Colors.gray_10,
        fontWeight: '700'
    }
});
