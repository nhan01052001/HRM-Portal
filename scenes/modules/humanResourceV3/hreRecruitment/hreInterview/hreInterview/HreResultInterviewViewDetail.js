import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
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
import { IconBack, IconCheck, IconDown, IconUp } from '../../../../../../constants/Icons';
import { generateRowActionAndSelected, HreWaitingInterviewBusiness } from './hreWaitingInterview/HreWaitingInterviewBusiness';
import { translate } from '../../../../../../i18n/translate';
import { EnumName, ScreenName } from '../../../../../../assets/constant';
import HreResultInterviewAddOrEdit from './hreWaitingInterview/HreResultInterviewAddOrEdit';
import DrawerServices from '../../../../../../utils/DrawerServices';
import { ConfigListDetail } from '../../../../../../assets/configProject/ConfigListDetail';
import ManageFileSevice from '../../../../../../utils/ManageFileSevice';

const configDefault = [
    {
        'TypeView':'E_GROUP',
        'DisplayKey':'HRM_PortalApp_Interview_EvaCri',
        'DataType':'string',
        isCollapse: true
    },
    {
        'TypeView':'E_COMMON',
        'Name':'Knowledge',
        'DisplayKey':'HRM_PortalApp_Interview_Kno',
        'DataType':'string',
        'isWrapLine':true
    },
    {
        'TypeView':'E_COMMON',
        'Name':'Skill',
        'DisplayKey':'HRM_PortalApp_Interview_Skill',
        'DataType':'string',
        'isWrapLine':true
    },
    {
        'TypeView':'E_COMMON',
        'Name':'WorkAttitude',
        'DisplayKey':'HRM_PortalApp_Interview_Beh',
        'DataType':'string',
        'isWrapLine':true
    },
    {
        'TypeView':'E_COMMON',
        'Name':'Competency',
        'DisplayKey':'HRM_PortalApp_Interview_Com',
        'DataType':'string',
        'isWrapLine':true
    },
    {
        'TypeView':'E_COMMON',
        'Name':'LeaderShip',
        'DisplayKey':'HRM_PortalApp_Interview_Lea',
        'DataType':'string',
        'isWrapLine':true
    },
    {
        'TypeView':'E_COMMON',
        'Name':'Management',
        'DisplayKey':'HRM_PortalApp_Interview_Adm',
        'DataType':'string',
        'isWrapLine':true
    },
    {
        'TypeView':'E_COMMON',
        'Name':'Professional',
        'DisplayKey':'HRM_PortalApp_Interview_Spe',
        'DataType':'string',
        'isWrapLine':true
    },
    {
        'TypeView':'E_COMMON',
        'Name':'CareerObjective',
        'DisplayKey':'HRM_PortalApp_Interview_CareerObj',
        'DataType':'string',
        'isWrapLine':true
    },
    {
        'TypeView':'E_COMMON',
        'Name':'HealthStatus',
        'DisplayKey':'HRM_PortalApp_Interview_Health',
        'DataType':'string',
        'isWrapLine':true
    },
    {
        'TypeView':'E_GROUP',
        'DisplayKey':'HRM_PortalApp_Interview_EvaResult',
        'DataType':'string',
        isCollapse: true

    },
    {
        'TypeView':'E_COMMON',
        'Name':'Strengths',
        'DisplayKey':'HRM_PortalApp_Interview_Str',
        'DataType':'string',
        'isWrapLine':true
    },
    {
        'TypeView':'E_COMMON',
        'Name':'Weaknesses',
        'DisplayKey':'HRM_PortalApp_Interview_Wea',
        'DataType':'string',
        'isWrapLine':true
    },
    {
        'TypeView':'E_COMMON',
        'Name':'ResultNote',
        'DisplayKey':'HRM_PortalApp_Interview_GenFee',
        'DataType':'string',
        'isWrapLine':true
    },
    {
        'TypeView':'E_COMMON',
        'Name':'ResultInterviewView',
        'DisplayKey':'HRM_PortalApp_Interview_ResultpassFail',
        'DataType':'string',
        'isWrapLine':true
    },
    {
        'TypeView':'E_COMMON',
        'Name':'RatingAchievedView',
        'DisplayKey':'HRM_PortalApp_Interview_Qua',
        'DataType':'string',
        'isWrapLine':true
    },
    {
        'TypeView':'E_COMMON',
        'Name':'TypeSalaryView',
        'DisplayKey':'HRM_PortalApp_Interview_SalaryType',
        'DataType':'string',
        'isWrapLine':true
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'ProposedSalary',
        'Unit': 'CurrencyName',
        'DisplayKey': 'HRM_PortalApp_Interview_RecSalary',
        'DataType': 'Double',
        'DataFormat': '#.###,##',
        'isWrapLine':true
    },
    {
        'TypeView':'E_COMMON',
        'Name':'EnteringDate',
        'DisplayKey':'HRM_PortalApp_Interview_JobAccDate',
        'DataType': 'DateTime',
        'DataFormat': 'DD/MM/YYYY',
        'isWrapLine':true
    },
    {
        'TypeView': 'E_FILEATTACH',
        'Name': 'FileAttachment',
        'DisplayKey': 'HRM_PortalApp_Interview_Att',
        'DataType': 'FileAttach'
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
                        DrawerServices.navigate(ScreenName.HreCandidateInterview);
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
        const dataRowActionAndSelected = generateRowActionAndSelected();
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
                _configListDetail = ConfigListDetail.value[ScreenName.HreResultInterviewViewDetail] && 1 == 2
                    ? ConfigListDetail.value[ScreenName.HreResultInterviewViewDetail]
                    : configDefault;

            const data = { ...dataItem };
            if (data != null) {
                data.FileAttachment = ManageFileSevice.setFileAttachApp(data.FileAttachment);
                data.BusinessAllowAction = data.IsInputResult ? 'E_MODIFY' : '';
                data.RoundInterviewName = data.RoundInterview ? `${translate('HRM_PortalApp_RoundInterview')} ${data.RoundInterview}` : '';
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
        HreWaitingInterviewBusiness.setThisForBusiness(this);
        this.getDataItem();
    }

    reload = () => {
        const { reloadScreenList } = this.props.navigation.state.params;
        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');
        DrawerServices.goBack();
    };

    renderItemContent = (item, index) => {
        const { lstCollapse, dataItem } = this.state;
        let numberLastRound = null;
        if (index == dataItem.rounds.length - 1) {
            numberLastRound = index + 1;
        }
        return (
            <View style={styles.container} key={index}>
                <View style={styles.timeline}>
                    <View
                        style={[
                            styles.stylineIcon,
                            numberLastRound != null && {
                                backgroundColor: Colors.green
                            }
                        ]}
                    >
                        {numberLastRound != null ? (
                            <Text style={[styleSheets.text, styles.styLastRound]}>{numberLastRound}</Text>
                        ) : (
                            <IconCheck size={Size.text / 1.5} color={Colors.green} />
                        )}
                    </View>
                    <View style={styles.stickViewVertical} />
                </View>

                <View style={styles.itemContent}>
                    <View style={styles.itemHeader}>
                        <View style={styles.styHeaderLeft}>
                            <Text style={[styleSheets.lable]}>{item.RoundInterviewView || ''}</Text>
                            <Text style={[styleSheets.text, styles.styDateViewer]}>{item.InterviewSchedule || ''}</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.styHeaderRight}
                            onPress={() => {
                                this.setState({
                                    lstCollapse: {
                                        ...lstCollapse,
                                        [index]: !lstCollapse[index]
                                    }
                                });
                            }}
                        >
                            {!lstCollapse[index] ? (
                                <IconUp size={Size.iconSize + 1} color={Colors.gray_7} />
                            ) : (
                                <IconDown size={Size.iconSize + 1} color={Colors.gray_7} />
                            )}
                        </TouchableOpacity>
                    </View>
                    {!lstCollapse[index] && (
                        <View style={styles.containerBody}>
                            <View style={styles.styViewer}>
                                <Text style={[styleSheets.lable]}>{translate('HRM_PortalApp_InterviewPanel')}</Text>
                                <View style={styles.styListViewer}>
                                    {item.ListInterviewer &&
                                        item.ListInterviewer.length > 0 &&
                                        item.ListInterviewer.map((el, id) => (
                                            <View key={id} style={styles.styUsViewer}>
                                                {Vnr_Function.renderAvatarCricleByName(
                                                    el?.ImagePath,
                                                    el?.ProfileName,
                                                    Size.iconSize - 3
                                                )}
                                                <Text style={[styleSheets.text, styles.styUsText]}>
                                                    {el.ProfileName || ''}
                                                </Text>
                                            </View>
                                        ))}
                                </View>
                            </View>

                            <View style={styles.styRound}>
                                <Text style={[styleSheets.lable]}>{translate('HRM_PortalApp_InterviewResult')}</Text>

                                <View style={styles.styListResult}>
                                    {item.ListInterviewResultDetail &&
                                        item.ListInterviewResultDetail.length > 0 &&
                                        item.ListInterviewResultDetail.map((el, id) => (
                                            <View key={id} style={styles.styUsResult}>
                                                {id == 0 ? (
                                                    <View style={styles.styAvtaUser}>
                                                        <Text
                                                            st
                                                            yle={[styleSheets.text, styles.styOverallInterview]}
                                                            numberOfLines={1}
                                                        >
                                                            {translate('HRM_PortalApp_OverallInterview')}
                                                        </Text>
                                                    </View>
                                                ) : (
                                                    <View style={styles.styAvtaUser}>
                                                        {Vnr_Function.renderAvatarCricleByName(
                                                            el?.ImagePath,
                                                            el?.InterviewerName,
                                                            Size.iconSize - 3
                                                        )}
                                                        <Text
                                                            style={[styleSheets.text, styles.styUsText]}
                                                            numberOfLines={1}
                                                        >
                                                            {el.InterviewerName || ''}
                                                        </Text>
                                                    </View>
                                                )}

                                                {el.RatingAchieved == 'E_PASS' && (
                                                    <View style={styles.styStusView}>
                                                        <Text style={[styleSheets.text, styles.styStusViewText]}>
                                                            {translate('HRM_PortalApp_CompletedInterview')}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                        ))}
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </View>
        );
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
                        <View style={[containerItemDetail, styles.styContent]}>
                            <View style={stylesScreenDetailV2.styItemContent}>
                                <View style={stylesScreenDetailV2.viewLable}>
                                    <Text style={styleSheets.text}>
                                        {dataItem.RoundInterviewName}
                                    </Text>
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

const styles = StyleSheet.create({
    stylineIcon: {
        width: Size.text + 2,
        height: Size.text + 2,
        borderRadius: (Size.text + 2) / 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
        backgroundColor: Colors.green_1
        // borderWidth: 1
        // borderColor: Colors.green_5
    },
    styHeaderLeft: {
        flex: 1
    },
    styViewer: {},
    styRound: {},
    stickViewVertical: {
        flex: 1,
        marginTop: 5,
        borderLeftWidth: 1,
        marginBottom: 2,
        borderLeftColor: Colors.green
    },
    container: {
        flexDirection: 'row'
    },
    timeline: {
        marginRight: Size.defineHalfSpace,
        flexDirection: 'column',
        alignItems: 'center'
    },
    itemContent: {
        flexDirection: 'column',
        flex: 1,
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        borderRadius: Size.borderRadiusPrimary,
        padding: Size.defineSpace,
        marginBottom: Size.defineSpace
    },
    containerBody: {
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        borderRadius: Size.borderRadiusPrimary,
        padding: Size.defineHalfSpace
    },
    itemHeader: {
        marginBottom: 6,
        flexDirection: 'row',
        alignItems: 'center'
    },
    styDateViewer: {
        color: Colors.gray_8
    },
    styUsText: {
        fontSize: Size.textSmall - 1,
        marginLeft: 5
    },
    styOverallInterview: {
        fontSize: Size.textSmall,
        marginLeft: 5
    },
    styListViewer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: Size.defineHalfSpace
    },
    styListResult: {
        marginBottom: Size.defineHalfSpace
    },
    styUsViewer: {
        width: 'auto',
        flexDirection: 'row',
        backgroundColor: Colors.gray_4,
        borderRadius: Size.borderRadiusCircle,
        padding: 5,
        marginTop: 5,
        alignItems: 'center',
        marginRight: Size.defineHalfSpace
    },
    styUsResult: {
        width: 'auto',
        flexDirection: 'row',
        backgroundColor: Colors.gray_3,
        borderRadius: Size.borderRadiusPrimary,
        marginTop: Size.defineHalfSpace,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Size.defineHalfSpace,
        borderWidth: 0.5,
        borderColor: Colors.gray_5
    },
    styAvtaUser: {
        flexShrink: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: Size.defineHalfSpace,
        paddingRight: Size.defineSpace
    },
    styStusView: {
        backgroundColor: Colors.green_1,
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: Size.borderRadiusCircle
    },
    styStusViewText: {
        color: Colors.green,
        fontSize: Size.textSmall - 1
    },
    styHeaderRight: {
        padding: Size.defineHalfSpace
    },
    styLastRound: {
        fontSize: Size.textSmall - 2,
        color: Colors.white
    }
});
