import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import {
    styleSheets,
    styleScreenDetail,
    styleSafeAreaView,
    stylesScreenDetailV3,
    Size,
    Colors,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { generateRowActionAndSelected, HreProcessingJobPostingBusiness } from './HreProcessingJobPostingBusiness';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import DrawerServices from '../../../../../utils/DrawerServices';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import { EnumName, ScreenName } from '../../../../../assets/constant';
import Vnr_Services from '../../../../../utils/Vnr_Services';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';
import VnrText from '../../../../../components/VnrText/VnrText';
import { IconRight } from '../../../../../constants/Icons';
import HttpService from '../../../../../utils/HttpService';

const configDefault = [
    {
        TypeView: 'E_COMMON',
        Name: 'TitlePosting',
        DisplayKey: 'HRM_PortalApp_HreProcessingJobPosting_TitlePosting',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'StatusView',
        DisplayKey: 'HRM_Attendance_Overtime_OvertimeList_Status',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP_APPROVE',
        DisplayKey: 'HRM_PortalApp_Approval_Process',
        DataType: 'string'
    }
];

export default class HreProcessingJobPostingViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            configJobVacancy: null,
            dataRowActionAndSelected: generateRowActionAndSelected(ScreenName.HreWaitProcessingJobPosting),
            listActions: this.resultListActionHeader()
        };
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
                { screenName, dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail = ConfigListDetail.value[screenName]
                    ? ConfigListDetail.value[screenName]
                    : configDefault;

            let id = !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID;
            if (id) {
                const response = await HttpService.Get(
                    `[URI_CENTER]/api/Rec_ComposePosting/GetComposePostingDetailByID?ID=${id}`
                );

                if (response && response.Status == EnumName.E_SUCCESS) {
                    let data = { ...response.Data };
                    if (data.DataJobPostingPlan && data.DataJobPostingPlan.length > 0) {
                        data = {
                            ...data,
                            ...data.DataJobPostingPlan[0],
                            ID: data.ID
                        };
                    }

                    data.itemStatus = Vnr_Services.formatStyleStatusApp(data.Status);
                    data.BusinessAllowAction = Vnr_Services.handleStatusApprove(data.Status, dataItem?.TypeApprove);
                    if (data.Status === 'E_WAIT_APPROVED') {
                        let arr = data.BusinessAllowAction.split(',');
                        arr.push('E_REQUEST_CHANGE');
                        data.BusinessAllowAction = arr.join(',');
                    }
                    const _listActions = await this.rowActionsHeaderRight(data);
                    this.setState({
                        configListDetail: _configListDetail,
                        dataItem: data,
                        listActions: _listActions
                    });
                } else {
                    this.setState({ dataItem: 'EmptyData' });
                }
            } else {
                this.setState({ dataItem: 'EmptyData' });
            }
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    reload = (E_KEEP_FILTER, actionIsDelete) => {
        const { reloadScreenList } = this.props.navigation.state.params;

        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');

        //nếu action = Delete => back về danh sách
        if (actionIsDelete) {
            DrawerServices.navigate('AttSubmitTakeLeaveDay');
        } else {
            this.setState({ dataItem: null }, () => {
                this.getDataItem(true);
            });
        }
    };

    componentDidMount() {
        HreProcessingJobPostingBusiness.setThisForBusiness(this);
        this.getDataItem();
    }

    onPressChanel = () => {
        // E_RECRUITMENTCHANEL : HTML
        // Null or || E_RECRUITMENTCHANEL : Load tu data
    };

    renderChanel = (DataDetail) => {
        if (DataDetail && DataDetail.length > 0) {
            return (
                <View style={styles.styViewChanel}>
                    <View style={[styles.styItemContentGroup]}>
                        <VnrText
                            style={[styleSheets.lable, stylesScreenDetailV3.styTextGroup]}
                            i18nKey={'HRM_PortalApp_HreProcessingJobPosting_Chanel'}
                        />
                    </View>

                    {DataDetail.map((item, index) => {
                        if (item.TypeOfSource && item.TypeOfSource == 'E_RECRUITMENTONLINE') {
                            return (
                                <TouchableOpacity
                                    onPress={() =>
                                        DrawerServices.navigate('HrePostChanelViewDetail', {
                                            dataItem: item,
                                            screenName: 'E_RECRUITMENTONLINE'
                                        })
                                    }
                                    key={index}
                                    activeOpacity={0.7}
                                    style={[
                                        styles.styItemChanel,
                                        index == DataDetail.length - 1 && CustomStyleSheet.borderBottomWidth(0),
                                        index == DataDetail.length - 1 && CustomStyleSheet.marginBottom(0)
                                    ]}
                                >
                                    <VnrText
                                        style={[styleSheets.lable]}
                                        value={item.SourceAdsName ? item.SourceAdsName : item.SourceAdsName}
                                    />
                                    <IconRight size={Size.iconSize} color={Colors.black} />
                                </TouchableOpacity>
                            );
                        } else {
                            return (
                                <TouchableOpacity
                                    onPress={() =>
                                        DrawerServices.navigate('HrePostChanelViewDetail', {
                                            dataItem: item,
                                            screenName: ScreenName.HrePostChanelViewDetail
                                        })
                                    }
                                    key={index}
                                    activeOpacity={0.7}
                                    style={[
                                        styles.styItemChanel,
                                        index == DataDetail.length - 1 && CustomStyleSheet.borderBottomWidth(0),
                                        index == DataDetail.length - 1 && CustomStyleSheet.marginBottom(0)
                                    ]}
                                >
                                    <VnrText
                                        style={[styleSheets.lable]}
                                        value={item.SourceAdsName ? item.SourceAdsName : item.SourceAdsName}
                                    />
                                    <IconRight size={Size.iconSize} color={Colors.black} />
                                </TouchableOpacity>
                            );
                        }
                    })}
                </View>
            );
        }
        return null;
    };

    renderPlanPosting = (dataItem) => {
        if (dataItem) {
            let dataSourcePlan = {};
            if (dataItem.DataJobPostingPlan && dataItem.DataJobPostingPlan[0])
                dataSourcePlan = { ...dataSourcePlan, ...dataItem.DataJobPostingPlan[0] };

            // if(dataItem.GeneralJobPostingPlan && dataItem.GeneralJobPostingPlan[0])
            //     dataSourcePlan = {...dataSourcePlan, ...dataItem.GeneralJobPostingPlan[0]};

            // if(dataItem.DescriptionJobPostingPlan && dataItem.DescriptionJobPostingPlan[0])
            //     dataSourcePlan = {...dataSourcePlan, ...dataItem.DescriptionJobPostingPlan[0]};

            return (
                <View style={styles.styViewPlanPost}>
                    <TouchableOpacity
                        onPress={() =>
                            DrawerServices.navigate('HreProcessingPostingPlanViewDetail', {
                                dataItem: dataSourcePlan,
                                screenName: ScreenName.HreProcessingPostingPlan
                            })
                        }
                        activeOpacity={0.7}
                        style={[styles.styItemChanel, CustomStyleSheet.borderBottomWidth(0)]}
                    >
                        <VnrText style={[styleSheets.lable]} i18nKey={'HRM_PortalApp_HreProcessingPostingPlan_Title'} />
                        <IconRight size={Size.iconSize} color={Colors.black} />
                    </TouchableOpacity>
                </View>
            );
        }
        return null;
    };

    render() {
        const { dataItem, configListDetail, listActions } = this.state,
            { containerItemDetail, contentScroll, bottomActions } = styleScreenDetail;

        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <ScrollView style={[contentScroll]} showsVerticalScrollIndicator={false}>
                        <View style={[containerItemDetail, styles.containerGrey]}>
                            <View style={styles.styViewApprove}>
                                {configListDetail.map((e) => {
                                    if (e.TypeView != 'E_GROUP_APPROVE')
                                        return Vnr_Function.formatStringTypeV3(dataItem, e, configListDetail);
                                })}
                            </View>

                            {this.renderChanel(dataItem.DataDetail, dataItem)}

                            {this.renderPlanPosting(dataItem)}

                            <View style={styles.styViewApprove}>
                                {configListDetail.map((e) => {
                                    if (e.TypeView === 'E_GROUP_APPROVE')
                                        return Vnr_Function.formatStringTypeV3(dataItem, e, configListDetail);
                                })}
                            </View>
                        </View>
                    </ScrollView>
                    {Array.isArray(listActions) && listActions.length > 0 && (
                        <View style={bottomActions}>
                            <ListButtonMenuRight listActions={listActions} dataItem={dataItem} />
                        </View>
                    )}
                </View>
            );
        } else if (dataItem == 'EmptyData') {
            contentViewDetail = <EmptyData messageEmptyData={'EmptyData'} />;
        }

        return <SafeAreaViewDetail style={styleSafeAreaView.style}>{contentViewDetail}</SafeAreaViewDetail>;
    }
}

const styles = StyleSheet.create({
    styViewChanel: {
        marginVertical: Size.defineHalfSpace,
        padding: Size.defineSpace,
        paddingBottom: 0,
        backgroundColor: Colors.white
    },
    styViewPlanPost: {
        marginVertical: Size.defineHalfSpace,
        paddingHorizontal: Size.defineSpace,
        backgroundColor: Colors.white
    },
    styViewApprove: {
        paddingHorizontal: Size.defineSpace,
        backgroundColor: Colors.white
    },
    styItemChanel: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: Size.defineSpace,
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5
    },
    containerGrey: {
        flex: 1,
        backgroundColor: Colors.gray_2,
        paddingHorizontal: 0
    },
    styItemContentGroup: {
        marginBottom: Size.defineHalfSpace
    }
});
