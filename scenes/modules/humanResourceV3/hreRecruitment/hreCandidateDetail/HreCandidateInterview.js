import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { styleSheets, styleScreenDetail, styleSafeAreaView, Colors, Size } from '../../../../../constants/styleConfig';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import ListButtonMenuRight from '../../../../../componentsV3/ListButtonMenuRight/ListButtonMenuRight';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';
import { IconBack, IconCheck, IconDown, IconUp } from '../../../../../constants/Icons';
import { HreWaitingInterviewBusiness } from '../hreInterview/hreInterview/hreWaitingInterview/HreWaitingInterviewBusiness';
import { translate } from '../../../../../i18n/translate';
import HttpService from '../../../../../utils/HttpService';
import { EnumName, ScreenName } from '../../../../../assets/constant';
import HreResultInterviewAddOrEdit from '../hreInterview/hreInterview/hreWaitingInterview/HreResultInterviewAddOrEdit';
import DrawerServices from '../../../../../utils/DrawerServices';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';

export default class HreCandidateInterview extends Component {
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
                        const beforeScreen = DrawerServices.getBeforeScreen();
                        if (
                            beforeScreen == ScreenName.HreWaitingInterview ||
                            beforeScreen == ScreenName.HreCompletedInterview
                        )
                            DrawerServices.navigate('TopTabHreInterview');
                        else if (beforeScreen == ScreenName.HreInterviewCalendar) {
                            DrawerServices.navigate(ScreenName.HreInterviewCalendar);
                        }
                        else DrawerServices.goBack();
                    }}
                >
                    <View style={styleSheets.bnt_HeaderRight}>
                        <IconBack color={Colors.gray_10} size={Size.iconSizeHeader} />
                    </View>
                </TouchableOpacity>
            )
        });

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            // Trường hợp goBack từ detail thì phải gán lại this
            HreWaitingInterviewBusiness.setThisForBusiness(this);
        });
    }

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
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
                profileID = dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info.ProfileID : null,
                { dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params);

            let id = null;
            if (!Vnr_Function.CheckIsNullOrEmpty(dataId)) {
                id = dataId;
            } else if (dataItem?.CandidateID) {
                id = dataItem?.CandidateID;
            }

            if (id) {
                const response = await HttpService.Get(
                    `[URI_CENTER]/api/Rec_Interview/GetInfoInterviewDetail?CandidateID=${id}&IsGeneral=false`
                );

                if (response && response.Data && response.Data.length > 0) {
                    let data = { ...dataItem, rounds: response.Data };
                    data.BusinessAllowAction = '';
                    if (
                        data.rounds &&
                        data.rounds.length > 0 &&
                        data.rounds[data.rounds.length - 1] &&
                        data.rounds[data.rounds.length - 1]['ListInterviewResultDetail'] != null
                    ) {
                        const _ListInterviewResultDetail = data.rounds[data.rounds.length - 1]['ListInterviewResultDetail'];
                        const lastItem = _ListInterviewResultDetail.find(item => item.InterviewerID == profileID);
                        if (lastItem && lastItem.IsInputResult == true && lastItem.ResultInterview == undefined) {
                            data = {
                                ...data,
                                ID: lastItem.ID
                            };
                            data.BusinessAllowAction = 'E_ENTER_INTERVIEW';
                        }
                    }

                    const _listActions = this.rowActionsHeaderRight(data);
                    this.setState({ dataItem: data, listActions: _listActions });
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

    componentDidMount() {
        HreWaitingInterviewBusiness.setThisForBusiness(this);
        this.getDataItem();
    }

    reload = () => {
        const { reloadScreenList } = this.props.navigation.state.params;

        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');
        this.setState({ dataItem: null }, () => {
            this.getDataItem(true);
        });
    };

    renderInterViewResult = (el, index, item) => {
        if (index == 0 && item.ListInterviewer.length > 1) {
            return (
                <View key={index} style={styles.styUsResult}>
                    <View style={styles.styAvtaUser}>
                        <Text style={[styleSheets.text, styles.styOverallInterview]} numberOfLines={1}>
                            {translate('HRM_PortalApp_OverallInterview')}
                        </Text>
                    </View>

                    {el.ResultInterview != null && (
                        <View style={styles.styStusView}>
                            <Text style={[styleSheets.text, styles.styStusViewText]}>
                                {translate('HRM_PortalApp_CompletedInterview')}
                            </Text>
                        </View>
                    )}
                </View>
            );
        } else if (index != 0) {
            return (
                <TouchableOpacity
                    key={index}
                    disabled={el.ResultInterview == null}
                    style={styles.styUsResult}
                    onPress={() => {
                        if (el.ResultInterview != null)
                            DrawerServices.navigate(ScreenName.HreResultInterviewViewDetail, {
                                dataItem: el,
                                reloadScreenList: this.reload
                            });
                    }}
                >
                    <View style={styles.styAvtaUser}>
                        {Vnr_Function.renderAvatarCricleByName(el?.ImagePath, el?.InterviewerName, Size.iconSize - 3)}
                        <Text style={[styleSheets.text, styles.styUsText]} numberOfLines={1}>
                            {el.InterviewerName || ''}
                        </Text>
                    </View>

                    {el.ResultInterview != null && (
                        <View style={styles.styStusView}>
                            <Text style={[styleSheets.text, styles.styStusViewText]}>
                                {translate('HRM_PortalApp_CompletedInterview')}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            );
        }
    };

    renderItemContent = (item, index) => {
        const { lstCollapse, dataItem } = this.state;
        let numberLastRound = null;
        if (index == dataItem.rounds.length - 1 && item.Status !== 'E_PASS') {
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
                                <Text style={[styleSheets.lable]}>
                                    {translate('HRM_PortalApp_InterviewResult')}
                                </Text>

                                <View style={styles.styListResult}>
                                    {item.ListInterviewResultDetail &&
                                        item.ListInterviewResultDetail.length > 0 &&
                                        item.ListInterviewResultDetail.map((el, id) =>
                                            this.renderInterViewResult(el, id, item)
                                        )}
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    onCreate = (item) => {
        if (this.HreResultInterviewAddOrEdit && this.HreResultInterviewAddOrEdit.onShow && item != null) {
            item = {
                ...item,
                InterviewerInfoID: item.ID
            };

            this.HreResultInterviewAddOrEdit.onShow({
                reload: this.reload,
                record: item,
                isCreate: true
            });
        }
    };

    render() {
        const { dataItem, listActions } = this.state,
            { containerItemDetail, contentScroll, bottomActions } = styleScreenDetail;
        let contentViewDetail = <VnrLoading size={'large'} />;

        if (dataItem && dataItem.rounds && dataItem.rounds.length > 0) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <ScrollView style={contentScroll} showsVerticalScrollIndicator={false}>
                        <View style={[containerItemDetail, styles.styContent]}>
                            {dataItem.rounds.map((item, index) => {
                                return this.renderItemContent(item, index);
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
    styContent: {
        paddingVertical: Size.defineSpace
    },
    stylineIcon: {
        width: Size.text + 2,
        height: Size.text + 2,
        borderRadius: (Size.text + 2) / 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
        backgroundColor: Colors.green_1
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
        // padding: 5,
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
