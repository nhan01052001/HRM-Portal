import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { styleSheets, styleScreenDetail, styleSafeAreaView, CustomStyleSheet, Colors, Size, styleApproveProcessHRE } from '../../../../../constants/styleConfig';
import Vnr_Function from '../../../../../utils/Vnr_Function';
// import {
//     generateRowActionAndSelected,
//     AttSubmitWorkingOvertimeBusinessFunction
// } from './AttSubmitWorkingOvertimeBusiness';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';
import HttpService from '../../../../../utils/HttpService';
import { EnumName } from '../../../../../assets/constant';
import { IconBack } from '../../../../../constants/Icons';
import moment from 'moment';
import Vnr_Services from '../../../../../utils/Vnr_Services';
import Color from 'color';
import DrawerServices from '../../../../../utils/DrawerServices';
import { translate } from '../../../../../i18n/translate';


export default class HreCandidateHistoryApply extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            dataRowActionAndSelected: [], //generateRowActionAndSelected(this.props.navigation.state.params?.screenName),
            listActions: this.resultListActionHeader()
        };

        props.navigation.setParams({
            headerLeft: (
                <TouchableOpacity
                    onPress={() => {
                        const _params = this.props.navigation.state.params,
                            { beforeScreen } = typeof _params == 'object' ? _params : JSON.parse(_params);
                        if (beforeScreen != null) DrawerServices.navigate(beforeScreen);
                        else DrawerServices.goBack();
                    }}
                >
                    <View style={styleSheets.bnt_HeaderRight}>
                        <IconBack color={Colors.gray_10} size={Size.iconSizeHeader} />
                    </View>
                </TouchableOpacity>
            )
        });
    }

    resultListActionHeader = () => {
        const _params = this.props.navigation.state.params;
        if (_params && _params.listActions && Array.isArray(_params.listActions)) {
            return _params.listActions;
        }
        return [];
    };

    rowActionsHeaderRight = (dataItem) => {
        let _listActions = [];
        const { rowActions } = this.state.dataRowActionAndSelected;

        if (
            !Vnr_Function.CheckIsNullOrEmpty(rowActions) &&
            !Vnr_Function.CheckIsNullOrEmpty(dataItem.BusinessAllowAction)
        ) {
            _listActions = rowActions.filter((item) => {
                return dataItem.BusinessAllowAction.indexOf(item.type) >= 0;
            });
        }
        return _listActions;
    };

    getDataItem = async () => {
        try {
            const _params = this.props.navigation.state.params,
                { dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params);

            let id = null;
            if (!Vnr_Function.CheckIsNullOrEmpty(dataId)) {
                id = dataId;
            } else if (dataItem?.CandidateProfileID) {
                id = dataItem?.CandidateProfileID;
            }

            if (!id || !Vnr_Services.checkPermissions('New_PortalV3_Rec_CandidateProfileDetail_HistoryCandidateTab', 'View')) {
                this.setState({ dataItem: 'EmptyData' });
                return;
            }

            // passing data between tabs
            const response = await HttpService.Get(
                `[URI_CENTER]api/Rec_CandidateProfile/GetHistoryCandidateByCandidateProfileId?ID=${id}`
            );

            if (response?.Status !== EnumName.E_SUCCESS || !Array.isArray(response.Data) || !response.Data.length > 0) {
                this.setState({ dataItem: 'EmptyData' });
            }

            let data = response.Data;

            const _listActions = await this.rowActionsHeaderRight(dataItem);

            this.setState({ dataItem: data, listActions: _listActions });

        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    componentDidMount() {
        // AttSubmitWorkingOvertimeBusinessFunction.setThisForBusiness(this);
        this.getDataItem();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const _params = nextProps.navigation.state.params,
            { dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params);

        if (dataItem != null) {
            this.getDataItem();
        }
    }

    reload = () => {
        const { reloadScreenList } = this.props.navigation.state.params;

        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');
        this.setState({ dataItem: null }, () => {
            this.getDataItem(true);
        });
    };

    convertTextToColor = value => {
        const [num1, num2, num3, opacity] = value.split(',');
        return Color.rgb(parseFloat(num1), parseFloat(num2), parseFloat(num3), parseFloat(opacity));
    };

    render() {
        const { dataItem } = this.state,
            { containerItemDetail, contentScroll } = styleScreenDetail;


        let contentViewDetail = <VnrLoading size={'large'} />;
        if (Array.isArray(dataItem) && dataItem.length > 0) {
            contentViewDetail = (
                <View style={[styleSheets.container, CustomStyleSheet.backgroundColor(Colors.gray_2), CustomStyleSheet.paddingVertical(12)]}>
                    <ScrollView style={contentScroll} showsVerticalScrollIndicator={false}>
                        <View style={[containerItemDetail, CustomStyleSheet.backgroundColor(Colors.gray_2)]}>
                            {
                                dataItem.map((item, index) => {
                                    item.CandidateID = item?.ID;
                                    if (!item?.BusinessAllowAction)
                                        item.BusinessAllowAction = '';
                                    const { colorStatus, bgStatus } = Vnr_Services.formatStyleStatusApp(item.Status);
                                    let colorStatusView = colorStatus ? colorStatus : null,
                                        bgStatusView = bgStatus ? bgStatus : null;
                                    return (
                                        <View style={[
                                            CustomStyleSheet.flex(1)
                                        ]}
                                        key={index}
                                        >
                                            <View style={[CustomStyleSheet.flexDirection('row')]}>
                                                <View style={[CustomStyleSheet.height('100%'), CustomStyleSheet.alignItems('center'), CustomStyleSheet.marginTop(14)]}>
                                                    <View
                                                        style={styles.circle}
                                                    >

                                                    </View>
                                                    <View
                                                        style={[
                                                            CustomStyleSheet.width(2),
                                                            CustomStyleSheet.backgroundColor(Colors.gray_5),
                                                            index === dataItem.length - 1
                                                                ? CustomStyleSheet.flex(1)
                                                                : CustomStyleSheet.height('90%')
                                                        ]}
                                                    />
                                                </View>
                                                <View style={CustomStyleSheet.flex(1)}>
                                                    <View style={styles.wrapTextDateStartDateEnd_Line}>
                                                        <View>
                                                            <Text style={styleSheets.lable}>
                                                                {item?.DateApply ? moment(item.DateApply).format('DD/MM/YYYY') : ' '}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <ScrollView style={{ paddingLeft: Size.defineSpace / 2 }}>
                                                        <View
                                                            style={styles.wrapItem}
                                                        >
                                                            <View
                                                                style={styleApproveProcessHRE.flex_Row_Ali_Center_Jus_Beet}
                                                            >
                                                                <View style={styles.w60}>
                                                                    <Text style={[styleSheets.lable, styles.textLable]}>{item?.JobVacancyName ? item?.JobVacancyName : ''}</Text>
                                                                </View>

                                                                <View style={styles.w40}>
                                                                    <View
                                                                        style={[
                                                                            styles.lineSatus,
                                                                            {
                                                                                backgroundColor: bgStatusView ? this.convertTextToColor(bgStatusView) : Colors.white
                                                                            }
                                                                        ]}
                                                                    >
                                                                        <Text
                                                                            numberOfLines={1}
                                                                            style={[
                                                                                styleSheets.text,
                                                                                styles.lineSatus_text,
                                                                                {
                                                                                    color: colorStatusView ? colorStatusView : Colors.gray_10
                                                                                }
                                                                            ]}
                                                                        >
                                                                            {item?.StatusView ? item?.StatusView : ''}
                                                                        </Text>
                                                                    </View>
                                                                </View>
                                                            </View>

                                                            <View
                                                                style={[
                                                                    styleApproveProcessHRE.flex_Row_Ali_Center_Jus_Beet,
                                                                    CustomStyleSheet.marginVertical(16),
                                                                    CustomStyleSheet.alignItems('flex-start')
                                                                ]}
                                                            >
                                                                <View style={CustomStyleSheet.maxWidth('40%')}>
                                                                    <Text style={styleSheets.text}>{translate('HRM_PortalApp_PITFinalization_ReasonToRejection')}</Text>
                                                                </View>

                                                                <View style={[CustomStyleSheet.maxWidth('60%')]}>
                                                                    <Text style={[styleSheets.lable, styles.textLable]}>{item?.DeclineReason ? item?.DeclineReason : ''}</Text>
                                                                </View>
                                                            </View>

                                                            <View
                                                                style={styleApproveProcessHRE.flex_Row_Ali_Center_Jus_Beet}
                                                            >
                                                                <TouchableOpacity
                                                                    style={styles.button}
                                                                    onPress={() => {
                                                                        DrawerServices.navigate('HreInterviewResult', {
                                                                            dataItem: item,
                                                                            screenName: null,
                                                                            listActions: [],
                                                                            reloadScreenList: null,
                                                                            beforeScreen: null
                                                                        });
                                                                    }}
                                                                >
                                                                    <Text style={styleSheets.text}>{translate('HRM_PortalApp_InterviewResult')}</Text>
                                                                </TouchableOpacity>

                                                                <TouchableOpacity
                                                                    style={styles.button}
                                                                    onPress={() => {
                                                                        DrawerServices.navigate('HreApproveRecruitmentProposalViewDetail', {
                                                                            dataItem: item,
                                                                            screenName: null,
                                                                            listActions: [],
                                                                            reloadScreenList: null,
                                                                            beforeScreen: null
                                                                        });
                                                                    }}
                                                                >
                                                                    <Text style={styleSheets.text}>{translate('HRM_PortalApp_ProposalInformation')}</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    </ScrollView>
                                                </View>
                                            </View>
                                        </View>
                                    );
                                })
                            }
                        </View>
                    </ScrollView>
                </View>
            );
        } else if (dataItem == 'EmptyData') {
            contentViewDetail = <EmptyData messageEmptyData={'EmptyData'} />;
        }

        return (
            <SafeAreaViewDetail style={styleSafeAreaView.style}>
                <View style={[styleSheets.container]}>{contentViewDetail}</View>
            </SafeAreaViewDetail>
        );
    }
}

const styles = StyleSheet.create({
    circle: {
        backgroundColor: Colors.white,
        width: 18,
        height: 18,
        borderRadius: 18,
        marginTop: Size.defineSpace / 2 - 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.gray_5,
        marginBottom: 4
    },

    wrapTextDateStartDateEnd_Line: {
        paddingLeft: Size.defineSpace / 2,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 12
    },

    textLable: {
        color: Colors.black,
        fontSize: Size.text + 1
    },

    lineSatus: {
        paddingHorizontal: 6,
        alignItems: 'center',
        paddingVertical: 2,
        borderRadius: Size.borderRadiusCircle
        // padding: 4
    },
    lineSatus_text: {
        fontSize: Size.text - 2,
        fontWeight: '500'
    },

    button: {
        flex: 0.48,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        borderRadius: 8
    },

    wrapItem: {
        padding: 8,
        backgroundColor: Colors.white,
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        borderRadius: 4
    },

    w60: {
        width: '60%',
        maxWidth: '60%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },

    w40: {
        maxWidth: '40%',
        justifyContent: 'center'
    }
});
