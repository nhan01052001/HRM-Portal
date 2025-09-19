import React, { Component } from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';

import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';
import { Size, Colors, styleSheets, CustomStyleSheet } from '../../../../../constants/styleConfig';
import { IconInfo, IconDate } from '../../../../../constants/Icons';
import { translate } from '../../../../../i18n/translate';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import AttLeaveFundManagementViewDetailItem from './AttLeaveFundManagementViewDetailItem';
import { ScreenName } from '../../../../../assets/constant';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import DrawerServices from '../../../../../utils/DrawerServices';

// eslint-disable-next-line no-unused-vars
const dataGeneralInformationDefault = [
    {
        Field: 'MonthStartProfile',
        FieldName: 'MonthStartProfile',
        E_ANNUAL_LEAVE: 0.0,
        E_SICK_LEAVE: 0.0,
        E_ADDITIONAL_LEAVE: 0.0
    },
    {
        Field: 'InitAvailable',
        FieldName: 'InitAvailable',
        E_ANNUAL_LEAVE: 0.0,
        E_SICK_LEAVE: 0.0,
        E_ADDITIONAL_LEAVE: 0.0
    },
    {
        Field: 'RemainAnlBegining',
        FieldName: 'RemainAnlBegining'
    },
    {
        Field: 'MonthResetInitAvailable',
        FieldName: 'MonthResetInitAvailable',
        E_ANNUAL_LEAVE: 0.0,
        E_SICK_LEAVE: 0.0,
        E_ADDITIONAL_LEAVE: 0.0
    },
    {
        Field: 'InitSaveSickValue',
        FieldName: 'InitSaveSickValue',
        E_ANNUAL_LEAVE: 0.0
    },
    {
        Field: 'SeniorBonus',
        FieldName: 'SeniorBonus',
        E_ANNUAL_LEAVE: 0.0
    },
    {
        Field: 'LeaveInMonth',
        FieldName: 'LeaveInMonth',
        E_ANNUAL_LEAVE: 0.0,
        E_SICK_LEAVE: 0.0,
        E_ADDITIONAL_LEAVE: 0.0
    },
    {
        Field: 'AvailableInMonth',
        FieldName: 'AvailableInMonth',
        E_ANNUAL_LEAVE: 0.0
    },
    {
        Field: 'Available',
        FieldName: 'Available',
        E_ANNUAL_LEAVE: 20.0,
        E_SICK_LEAVE: 0.0,
        E_ADDITIONAL_LEAVE: 0.0
    },
    {
        Field: 'TotalLeaveBef',
        FieldName: 'TotalLeaveBef',
        E_ANNUAL_LEAVE: 0.0,
        E_SICK_LEAVE: 0.0,
        E_ADDITIONAL_LEAVE: 0.0
    },
    {
        Field: 'Remain',
        FieldName: 'Remain',
        E_ANNUAL_LEAVE: 0.0,
        E_SICK_LEAVE: 0.0,
        E_ADDITIONAL_LEAVE: 0.0
    }
];

const configDefault = [
    {
        TypeView: 'E_COMMON',
        Name: 'MonthStartProfile'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'InitAvailable'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'RemainAnlBegining'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'MonthResetInitAvailable'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'InitSaveSickValue'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'SeniorBonus'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'LeaveInMonth'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'AvailableInMonth'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Available'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TotalLeaveBef'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Remain'
    }
];

const initSateDefault = {
    dataGeneralInformation: [],
    dataNumberOfLeaveUsedInTheMonth: [],
    type: null,
    totalLeave: 0,
    leaveTaken: 0,
    leaveReman: 0,
    allHeightsView: 0
};

class AttLeaveFundManagementViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = { ...initSateDefault };

        props.navigation.setParams({
            title: this.props.navigation.state.params?.title
                ? this.props.navigation.state.params?.title
                : 'HRM_Common_ViewMore'
        });
    }

    getConfig = () => {
        try {
            const { dataGeneralInformation } = this.state,
                _configListDetail = ConfigListDetail.value[ScreenName.AttLeaveFundManagement]
                    ? ConfigListDetail.value[ScreenName.AttLeaveFundManagement]
                    : configDefault;

            let arrObject = [];

            if (_configListDetail.length > 0) {
                dataGeneralInformation.map(item => {
                    const rs = _configListDetail.find(e => item?.Field === e?.Name);
                    if (rs) {
                        arrObject.push({ ...item, FieldName: rs?.DisplayKey ? rs?.DisplayKey : item?.FieldName });
                    }
                });

                if (arrObject.length > 0) {
                    this.setState({
                        dataGeneralInformation: arrObject
                    });
                }
            } else {
                this.setState({
                    dataGeneralInformation: []
                });
            }
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    getData = () => {
        const _params = this.props.navigation.state.params;
        let nextState = {},
            totalLeave = 0,
            leaveTaken = 0,
            leaveReman = 0;
        if (Array.isArray(_params?.fullData?.GeneralModel) && _params?.Type) {
            _params?.fullData?.GeneralModel.map(item => {
                if (item[(_params?.Type)] !== null && item[(_params?.Type)] !== undefined) {
                    // tổng phép
                    if (item?.Field === 'Available') {
                        totalLeave = item[(_params?.Type)];
                    }

                    // phép đã nghỉ
                    if (item?.Field === 'TotalLeaveBef') {
                        leaveTaken = item[(_params?.Type)];
                    }

                    // phép còn lại
                    if (item?.Field === 'Remain') {
                        leaveReman = item[(_params?.Type)];
                    }
                }
            });
            nextState = {
                dataGeneralInformation: _params?.fullData?.GeneralModel,
                totalLeave,
                leaveTaken,
                leaveReman
            };
        } else {
            nextState = {
                dataGeneralInformation: [],
                totalLeave,
                leaveTaken,
                leaveReman
            };
        }

        if (Array.isArray(_params?.fullData?.ChartModel) && _params?.Type) {
            const rs = _params?.fullData?.ChartModel.find(item => item?.Type === _params?.Type);
            if (Array.isArray(rs?.Values)) {
                nextState = {
                    ...nextState,
                    dataNumberOfLeaveUsedInTheMonth: rs?.Values,
                    type: _params?.Type
                };
            }
        } else {
            nextState = {
                ...nextState,
                dataNumberOfLeaveUsedInTheMonth: [],
                type: null
            };
        }

        this.setState(
            {
                ...nextState
            },
            () => {
                this.getConfig();
            }
        );
    };

    componentDidMount() {
        this.getData();
    }

    render() {
        const {
            dataGeneralInformation,
            type,
            dataNumberOfLeaveUsedInTheMonth,
            totalLeave,
            leaveTaken,
            leaveReman
        } = this.state;

        return (
            <SafeAreaViewDetail style={CustomStyleSheet.flex(1)}>
                <View style={styles.wrapHeader}>
                    <Text style={[styleSheets.text, { fontSize: Size.text + 1 }]}>
                        {translate('HRM_Att_ManageLeave_Available')}
                    </Text>
                    <Text style={[styleSheets.lable, CustomStyleSheet.fontSize(24)]}>
                        {totalLeave} {translate('HRM_PortalApp_Day_Lowercase')}
                    </Text>
                </View>
                <View style={styles.wrapMiddle}>
                    <View style={styles.itemMiddle}>
                        <View style={styles.wrapImgInMiddle}>
                            <Image source={require('../../../../../assets/images/paidLeave/leavetaken.png')} />
                        </View>
                        <View style={{ ...CustomStyleSheet.flex(1), ...CustomStyleSheet.paddingLeft(6) }}>
                            <Text
                                numberOfLines={1}
                                style={[styleSheets.text, { ...CustomStyleSheet.fontSize(Size.text - 1), ...CustomStyleSheet.maxWidth('100%') }]}
                            >
                                {translate('HRM_PortalApp_Remaining_Leave')}
                            </Text>
                            <Text style={[styleSheets.lable, { fontSize: Size.text + 3 }]}>
                                {leaveReman} {translate('HRM_PortalApp_Day_Lowercase')}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.itemMiddle}>
                        <View style={styles.wrapImgInMiddle}>
                            <Image source={require('../../../../../assets/images/paidLeave/leaveremain.png')} />
                        </View>
                        <View style={{ ...CustomStyleSheet.flex(1), ...CustomStyleSheet.paddingLeft(6) }}>
                            <Text
                                numberOfLines={1}
                                style={[styleSheets.text, { ...CustomStyleSheet.fontSize(Size.text - 1), ...CustomStyleSheet.maxWidth('100%') }]}
                            >
                                {translate('HRM_PortalApp_Leave_Used')}
                            </Text>
                            <Text style={[styleSheets.lable, { fontSize: Size.text + 3 }]}>
                                {leaveTaken} {translate('HRM_PortalApp_Day_Lowercase')}
                            </Text>
                        </View>
                    </View>
                </View>

                <ScrollView style={CustomStyleSheet.flex(1)}>
                    {dataGeneralInformation.length > 0 && type && (
                        <View style={CustomStyleSheet.flex(1)}>
                            <View style={styles.titleDetail}>
                                <IconInfo size={Size.text + 3} color={Colors.gray_8} />
                                <Text style={[styleSheets.lable, { ...CustomStyleSheet.fontSize(14), ...CustomStyleSheet.marginLeft(6) }]}>
                                    {translate('HRM_HR_GeneralInformation')}
                                </Text>
                            </View>
                            {dataGeneralInformation.map((item, index) => {
                                return (
                                    <AttLeaveFundManagementViewDetailItem
                                        key={index}
                                        dataItems={{
                                            lable: item?.FieldName,
                                            item: item[type] ? item[type] : 0
                                        }}
                                    />
                                );
                            })}
                        </View>
                    )}

                    {dataNumberOfLeaveUsedInTheMonth.length > 0 && (
                        <View style={CustomStyleSheet.flex(1)}>
                            <View style={styles.titleDetail}>
                                <IconDate size={Size.text + 3} color={Colors.gray_8} />
                                <Text style={[styleSheets.lable, { ...CustomStyleSheet.fontSize(14), ...CustomStyleSheet.marginLeft(6) }]}>
                                    {translate('HRM_PortalApp_NumberOfLeaveUsedInTheMonth')}
                                </Text>
                            </View>
                            {dataNumberOfLeaveUsedInTheMonth.map((item, index) => {
                                return (
                                    <AttLeaveFundManagementViewDetailItem
                                        key={index}
                                        dataItems={{
                                            lable: translate('BirtDayConfig__E_MONTH') + ' ' + (Number(index) + 1),
                                            item: item ? item : 0
                                        }}
                                    />
                                );
                            })}
                        </View>
                    )}

                    {dataGeneralInformation.length === 0 && dataNumberOfLeaveUsedInTheMonth.length === 0 && (
                        <EmptyData messageEmptyData={'EmptyData'} />
                    )}
                </ScrollView>
            </SafeAreaViewDetail>
        );
    }
}

const styles = StyleSheet.create({
    wrapHeader: {
        width: '100%',
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
        borderBottomColor: Colors.gray_3,
        borderBottomWidth: 0.5
    },

    wrapMiddle: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    itemMiddle: {
        flex: 0.5,
        padding: 16,
        backgroundColor: Colors.white,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRightColor: Colors.gray_3,
        borderRightWidth: 0.5
    },

    wrapImgInMiddle: {
        width: 40,
        height: 40,
        backgroundColor: Colors.gray_3,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },

    titleDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16
    }
});

export default AttLeaveFundManagementViewDetail;
