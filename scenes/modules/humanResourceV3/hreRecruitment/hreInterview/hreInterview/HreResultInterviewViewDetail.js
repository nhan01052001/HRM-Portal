import React, { Component } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import {
    styleSheets,
    styleScreenDetail,
    styleSafeAreaView,
    Colors,
    Size,
    stylesScreenDetailV2
} from '../../../../../../constants/styleConfig';
import Vnr_Function from '../../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../../components/EmptyData/EmptyData';
import ListButtonMenuRight from '../../../../../../componentsV3/ListButtonMenuRight/ListButtonMenuRight';
import SafeAreaViewDetail from '../../../../../../components/safeAreaView/SafeAreaViewDetail';
import { IconBack } from '../../../../../../constants/Icons';
import {
    generateRowActionAndSelected,
    HreWaitingInterviewBusiness
} from './hreWaitingInterview/HreWaitingInterviewBusiness';
import { translate } from '../../../../../../i18n/translate';
import { EnumName, ScreenName } from '../../../../../../assets/constant';
import HreResultInterviewAddOrEdit from './hreWaitingInterview/HreResultInterviewAddOrEdit';
import DrawerServices from '../../../../../../utils/DrawerServices';
import { ConfigListDetail } from '../../../../../../assets/configProject/ConfigListDetail';
import ManageFileSevice from '../../../../../../utils/ManageFileSevice';

const configDefault = [
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_PortalApp_Interview_EvaCri',
        DataType: 'string',
        isCollapse: true
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Knowledge',
        DisplayKey: 'HRM_PortalApp_Interview_Kno',
        DataType: 'string',
        isWrapLine: true
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Skill',
        DisplayKey: 'HRM_PortalApp_Interview_Skill',
        DataType: 'string',
        isWrapLine: true
    },
    {
        TypeView: 'E_COMMON',
        Name: 'WorkAttitude',
        DisplayKey: 'HRM_PortalApp_Interview_Beh',
        DataType: 'string',
        isWrapLine: true
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Competency',
        DisplayKey: 'HRM_PortalApp_Interview_Com',
        DataType: 'string',
        isWrapLine: true
    },
    {
        TypeView: 'E_COMMON',
        Name: 'LeaderShip',
        DisplayKey: 'HRM_PortalApp_Interview_Lea',
        DataType: 'string',
        isWrapLine: true
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Management',
        DisplayKey: 'HRM_PortalApp_Interview_Adm',
        DataType: 'string',
        isWrapLine: true
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Professional',
        DisplayKey: 'HRM_PortalApp_Interview_Spe',
        DataType: 'string',
        isWrapLine: true
    },
    {
        TypeView: 'E_COMMON',
        Name: 'CareerObjective',
        DisplayKey: 'HRM_PortalApp_Interview_CareerObj',
        DataType: 'string',
        isWrapLine: true
    },
    {
        TypeView: 'E_COMMON',
        Name: 'HealthStatus',
        DisplayKey: 'HRM_PortalApp_Interview_Health',
        DataType: 'string',
        isWrapLine: true
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_PortalApp_Interview_EvaResult',
        DataType: 'string',
        isCollapse: true
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Strengths',
        DisplayKey: 'HRM_PortalApp_Interview_Str',
        DataType: 'string',
        isWrapLine: true
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Weaknesses',
        DisplayKey: 'HRM_PortalApp_Interview_Wea',
        DataType: 'string',
        isWrapLine: true
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ResultNote',
        DisplayKey: 'HRM_PortalApp_Interview_GenFee',
        DataType: 'string',
        isWrapLine: true
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ResultInterviewView',
        DisplayKey: 'HRM_PortalApp_Interview_ResultpassFail',
        DataType: 'string',
        isWrapLine: true
    },
    {
        TypeView: 'E_COMMON',
        Name: 'RatingAchievedView',
        DisplayKey: 'HRM_PortalApp_Interview_Qua',
        DataType: 'string',
        isWrapLine: true
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TypeSalaryViewAndProposedSalaryView',
        DisplayKey: 'HRM_PortalApp_Interview_RecSalary',
        DataType: 'string',
        isWrapLine: true
    },
    {
        TypeView: 'E_COMMON',
        Name: 'EnteringDate',
        DisplayKey: 'HRM_PortalApp_Interview_JobAccDate',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY',
        isWrapLine: true
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'FileAttachment',
        DisplayKey: '',
        DataType: 'FileAttach'
    }
];

export default class HreResultInterviewViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            dataRowActionAndSelected: [], //generateRowActionAndSelected(this.props.navigation.state.params?.screenName),
            listActions: this.resultListActionHeader(),
            lstCollapse: {}
        };

        this.HreResultInterviewAddOrEdit = null;
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
        const screenName = ScreenName.HreCompletedInterview;
        const dataRowActionAndSelected = generateRowActionAndSelected(screenName);
        if (dataRowActionAndSelected.rowActions) {
            return dataRowActionAndSelected.rowActions;
        }
        return [];
    };

    rowActionsHeaderRight = (dataItem) => {
        let _listActions = [];
        const { listActions } = this.state;

        if (
            !Vnr_Function.CheckIsNullOrEmpty(listActions) &&
            !Vnr_Function.CheckIsNullOrEmpty(dataItem.BusinessAllowAction)
        ) {
            _listActions = listActions.filter((item) => {
                return dataItem.BusinessAllowAction.indexOf(item.type) >= 0;
            });
        }
        return _listActions;
    };

    getDataItem = async () => {
        try {
            const _params = this.props.navigation.state.params,
                { dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail =
                    ConfigListDetail.value[ScreenName.HreResultInterviewViewDetail]
                        ? ConfigListDetail.value[ScreenName.HreResultInterviewViewDetail]
                        : configDefault;

            const data = { ...dataItem };
            if (data != null) {
                data.FileAttachment = ManageFileSevice.setFileAttachApp(data.FileAttachment);
                data.BusinessAllowAction = data.IsInputResult ? 'E_MODIFY' : '';
                data.RoundInterviewName = data.RoundInterview
                    ? `${translate('HRM_PortalApp_RoundInterview')} ${data.RoundInterview}`
                    : '';
                data.TypeSalaryViewAndProposedSalaryView = data?.ProposedSalary ? `${data.TypeSalaryView ?? ''} ${(data.TypeSalaryView && data?.ProposedSalaryView) && '-'} ${data?.ProposedSalaryView ?? ''}` : '';
                const _listActions = this.rowActionsHeaderRight(data);

                this.setState({ dataItem: data, listActions: _listActions, configListDetail: _configListDetail });
            } else {
                this.setState({ dataItem: 'EmptyData' });
            }
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    componentDidMount() {
        if (this.props.navigation.state?.params?.nameScreen)
            this.props.navigation.setParams({ title: this.props.navigation.state?.params?.nameScreen });
        HreWaitingInterviewBusiness.setThisForBusiness(this);
        this.getDataItem();
    }

    reload = () => {
        const { reloadScreenList } = this.props.navigation.state.params;
        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');
        DrawerServices.goBack();
    };

    onEdit = () => {
        const _params = this.props.navigation.state.params,
            { dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params);
        if (dataItem) {
            if (this.HreResultInterviewAddOrEdit && this.HreResultInterviewAddOrEdit.onShow) {
                dataItem.InterviewerInfoID = dataItem.ID;
                this.HreResultInterviewAddOrEdit.onShow({
                    reload: this.reload,
                    record: dataItem,
                    isCreate: false
                });
            }
        }
    };

    render() {
        const { dataItem, listActions, configListDetail } = this.state,
            { containerItemDetail, contentScroll, bottomActions } = styleScreenDetail;
        let contentViewDetail = <VnrLoading size={'large'} />;

        if (dataItem && Object.keys(dataItem).length > 0) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <ScrollView style={contentScroll} showsVerticalScrollIndicator={false}>
                        <View style={[containerItemDetail]}>
                            <View style={stylesScreenDetailV2.styItemContent}>
                                <View style={stylesScreenDetailV2.viewLable}>
                                    <Text style={styleSheets.text}>{dataItem.RoundInterviewName}</Text>
                                </View>
                            </View>

                            {configListDetail.map((e) => {
                                if (e.TypeView != 'E_COMMON_PROFILE')
                                    return Vnr_Function.formatStringTypeV3(dataItem, e, configListDetail);
                            })}
                        </View>
                    </ScrollView>
                    {Array.isArray(listActions) && listActions.length > 0 && (
                        <View style={bottomActions}>
                            <ListButtonMenuRight listActions={listActions} dataItem={dataItem} />
                        </View>
                    )}

                    <HreResultInterviewAddOrEdit ref={(refs) => (this.HreResultInterviewAddOrEdit = refs)} />
                </View>
            );
        } else if (dataItem == EnumName.E_EMPTYDATA) {
            contentViewDetail = <EmptyData messageEmptyData={'EmptyData'} />;
        }

        return (
            <SafeAreaViewDetail style={styleSafeAreaView.style}>
                <View style={[styleSheets.container]}>{contentViewDetail}</View>
            </SafeAreaViewDetail>
        );
    }
}
