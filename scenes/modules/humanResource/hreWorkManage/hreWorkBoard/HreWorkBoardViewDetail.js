/* eslint-disable no-undef */
/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    Platform,
    KeyboardAvoidingView,
    Image
} from 'react-native';
import { styleSheets, styleScreenDetail, styleSafeAreaView, Size, Colors, CustomStyleSheet } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import DrawerServices from '../../../../../utils/DrawerServices';
import { EnumName, ScreenName, EnumIcon } from '../../../../../assets/constant';
import Vnr_Services from '../../../../../utils/Vnr_Services';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';
import { IconTime } from '../../../../../constants/Icons';
import moment from 'moment';
import { Swipeable } from 'react-native-gesture-handler';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import HreWorkBoardAdd from './HreWorkBoardAdd';
import VnrCheckBox from '../../../../../componentsV3/VnrCheckBox/VnrCheckBox';
import VnrText from '../../../../../components/VnrText/VnrText';
import CommentItem from '../hreWorkManageList/CommentItem';
import { translate } from '../../../../../i18n/translate';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';

const configDefault = [
    {
        TypeView: 'E_STATUS',
        Name: 'WorkListStatusView',
        DisplayKey: 'HRM_Attendance_Overtime_OvertimeList_Status',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP_PROFILE',
        DisplayKey: 'HRM_System_User_ProfileIDs',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'CodeEmp',
        DisplayKey: 'HRM_HR_Profile_CodeEmp',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'ProfileName',
        DisplayKey: 'HRM_HR_Profile_ProfileName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'PositionName',
        DisplayKey: 'HRM_HR_Profile_PositionName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'JobTitleName',
        DisplayKey: 'HRM_HR_Profile_JobTitleName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'OrgStructureName',
        DisplayKey: 'HRM_Eva_Performance_OrgStructureName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'E_UNIT',
        DisplayKey: 'HRM_Hre_SignatureRegister_E_UNIT',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'E_DIVISION',
        DisplayKey: 'HRM_Hre_SignatureRegister_E_DIVISION',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'E_TEAM',
        DisplayKey: 'Group',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'E_SECTION',
        DisplayKey: 'HRM_HR_ReportProfileWaitingStopWorking_TeamName',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_System_Resource_Att_Task',
        DataType: 'string'
    }
];

const configFileAttach = [
    {
        TypeView: 'E_FILEATTACH',
        Name: 'lstFileAttach',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_FileAttach',
        DataType: 'FileAttach'
    }
];

const EnumNameWork = {
        E_NEW: 'HRM_PortalApp_ONBOARDING',
        E_QUIT: 'HRM_PortalApp_OFFBOARDING',
        E_REJECTOFFER: 'HRM_PortalApp_CANCELONBOARDING'
    },
    EnumColors = {
        E_GREEN: {
            bgColors: '82, 196, 26, 0.08',
            colors: '#52C41A'
        },
        E_BLACK: {
            bgColors: '0, 0, 0, 0.08',
            colors: '#262626'
        },
        E_RED: {
            bgColors: '245, 34, 45, 0.08',
            colors: '#F5222D'
        },
        E_ORANGE: {
            bgColors: '250, 140, 22, 0.08',
            colors: '#FA541C'
        }
    };

export default class HreWorkBoardViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            dataWorkList: [],
            search: ''
        };

        this.HreWorkBoardAdd = null;
        this.refModal = null;
        this.refModalAddWork = null;
    }

    getDataItem = async () => {
        try {
            const _params = this.props.navigation.state.params,
                { dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail =
                    ConfigListDetail.value[ScreenName.HreWorkBoardViewDetail] && 1 == 2
                        ? ConfigListDetail.value[ScreenName.HreWorkBoardViewDetail]
                        : configDefault;

            let id = !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ProfileID;
            if (id) {
                const dataBody = {
                    ProfileID: id,
                    Type: dataItem?.Type,
                    IsManager: false
                };
                const response = await HttpService.Post(
                    '[URI_CENTER]/api/Hre_ProfileWorkList/GetDetailProfileWorkList',
                    dataBody,
                    null,
                    this.reload
                );
                if (response && response.Status == EnumName.E_SUCCESS) {
                    let data = response.Data;
                    // data.BusinessAllowAction = Vnr_Services.handleStatus(data.Status, dataItem?.SendEmailStatus ? dataItem?.SendEmailStatus : false);
                    data.itemStatus = Vnr_Services.formatStyleStatusApp(dataItem?.WorkListStatus);
                    data.WorkListStatusView = dataItem?.WorkListStatusView;

                    if (Array.isArray(data?.ProfileWorkList)) {
                        data?.ProfileWorkList.forEach(element => {
                            if (element?.Status === EnumName.E_DONE) {
                                element.isSelected = true;
                            }
                        });
                    }
                    // data.lstFileAttach = ManageFileSevice.setFileAttachApp(data.FileAttachment);
                    this.setState({
                        configListDetail: _configListDetail,
                        dataItem: { ...data, ...dataItem },
                        dataWorkList: [...data?.ProfileWorkList]
                    });
                } else {
                    this.setState({ dataItem: 'EmptyData' });
                }
            } else if (!Vnr_Function.CheckIsNullOrEmpty(dataItem)) {
                this.setState({ configListDetail: _configListDetail, dataItem });
            } else {
                this.setState({ dataItem: 'EmptyData' });
            }
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    reload = () => {
        const { reloadScreenList } = this.props.navigation.state.params;
        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');
        this.setState({ dataItem: null }, () => {
            this.getDataItem(true);
        });
    };

    componentDidMount() {
        this.getDataItem();
    }

    onSelected = indexItem => {
        const { dataWorkList } = this.state;
        const item = dataWorkList[indexItem];
        if (item) {
            item.isSelected = !item.isSelected;
            if (item.IsArrear == true && item.isSelected) {
                // Show Amount of Arrears
                this.refModalAddWork &&
                    this.refModalAddWork.onShow({
                        record: item,
                        onAddDone: this.onAddDone.bind(this)
                    });
            }
            // this.refModalAddWork && this.refModalAddWork.onShow({
            //     record: item,
            //     onAddDone: this.onAddDone.bind(this)
            // });
            this.setState({
                dataWorkList: dataWorkList
            });
        }
    };

    onAddDone = item => {
        const { dataWorkList } = this.state;
        const indexItem = dataWorkList.findIndex(e => e.ID == item.ID);
        let itemFind = dataWorkList[indexItem];
        if (itemFind) {
            dataWorkList[indexItem] = {
                ...itemFind,
                ...item
            };

            this.setState({
                dataWorkList: dataWorkList
            });
        }
    };

    handleDeleta = item => {
        AlertSevice.alert({
            iconType: EnumIcon.E_WARNING,
            title: translate('HRM_PortalApp_HreWorkManage_DeleteWork'),
            message: `${translate('HRM_PortalApp_HreWorkManage_AskBeforeDelete')} \n ${translate(
                'HRM_PortalApp_HreWorkManage_AreYouSureDelete'
            )}`,
            onCancel: () => {},
            onConfirm: () => {
                if (item?.ID) {
                    try {
                        VnrLoadingSevices.show();
                        HttpService.Post('[URI_CENTER]/api/Hre_ProfileWorkList/RemoveProfileWorkList', {
                            ID: item?.ID
                        })
                            .then(res => {
                                VnrLoadingSevices.hide();
                                if (res?.Status === EnumName.E_SUCCESS) {
                                    ToasterSevice.showSuccess('DeleteSuccess');
                                    this.getDataItem();
                                }
                            })
                            .catch(error => {
                                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                            });
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    }
                }
            }
        });
    };

    onSave = () => {
        const { dataWorkList } = this.state;
        let dataSelect = dataWorkList.filter(item => {
            return item.isSelected == true && item.Status !== EnumName.E_DONE;
        });

        const params = {
            listProfileWorkListByEmp: dataSelect,
            IsManager: false
        };

        HttpService.Post('[URI_CENTER]/api/Hre_ProfileWorkList/CreateOrUpdateProfileWorkList', {
            ...params
        })
            .then(res => {
                if (res?.Status === EnumName.E_SUCCESS) {
                    ToasterSevice.showSuccess('Hrm_Succeed');
                    this.reload();
                } else {
                    ToasterSevice.showWarning(res?.Message);
                }
            })
            .catch(error => {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            });
    };

    render() {
        const { dataItem, configListDetail, dataWorkList } = this.state,
            { containerItemDetail, contentScroll } = styleScreenDetail;
        let valueProgress = (dataItem?.CompletedTaskCount / dataItem?.TaskCount) * 100;
        const isSelected =
            dataWorkList.filter(item => item.isSelected == true && item.Status !== EnumName.E_DONE).length > 0;

        let contentViewDetail = <VnrLoading size={'large'} />;

        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <ScrollView style={contentScroll} showsVerticalScrollIndicator={false}>
                        <View style={[containerItemDetail, CustomStyleSheet.paddingHorizontal(0)]}>
                            <View style={{ paddingHorizontal: styleSheets.p_10 }}>
                                {configListDetail.map(e => {
                                    if (e.TypeView != 'E_COMMON_PROFILE')
                                        return Vnr_Function.formatStringTypeV3(dataItem, e, configListDetail);
                                })}
                            </View>

                            <View style={{ paddingHorizontal: styleSheets.p_10 }}>
                                <Text style={[styleSheets.lable, { fontSize: Size.text + 2 }]}>
                                    {EnumNameWork[(dataItem?.Type)] ? translate(EnumNameWork[(dataItem?.Type)]) : ''}
                                </Text>
                            </View>
                            <View style={[styles.styProgress, { paddingHorizontal: styleSheets.p_10 }]}>
                                <View style={styles.styLeftProgress}>
                                    <View style={styles.styViewProgress}>
                                        <View style={[styles.styValProgress, { width: `${valueProgress}%` }]} />
                                    </View>
                                </View>
                                <View style={styles.styRightProgress}>
                                    <Text style={styleSheets.lable}>{dataItem?.ProgressTask}</Text>
                                </View>
                            </View>

                            {/* ds cong viec */}
                            <View>
                                {Array.isArray(dataWorkList) &&
                                    dataWorkList.map((item, index) => {
                                        if (item?.AttachFile) {
                                            item.lstFileAttach = ManageFileSevice.setFileAttachApp(item.AttachFile);
                                        }

                                        let isDisable = item?.isSelected && item?.Status === EnumName.E_DONE,
                                            dateWorkStatus = null;

                                        if (item.Status != EnumName.E_DONE) {
                                            dateWorkStatus = item.ColorDate;
                                        } else if (item.Status == EnumName.E_DONE) {
                                            dateWorkStatus = item.ResolveDate;
                                        }
                                        return (
                                            <Swipeable key={index}
                                                overshootRight={false}
                                                containerStyle={[
                                                    CustomStyleSheet.flex(1)
                                                ]}
                                            >
                                                <TouchableOpacity
                                                    disabled={isDisable}
                                                    activeOpacity={0.7}
                                                    style={styles.styItemAction}
                                                    onPress={() => this.onSelected(index)}
                                                >
                                                    <View style={styles.styViewCheck}>
                                                        <VnrCheckBox isDisable={true} value={item?.isSelected} />
                                                    </View>
                                                    <View style={styles.StyRightCode}>
                                                        <View>
                                                            <Text
                                                                numberOfLines={2}
                                                                style={[
                                                                    styleSheets.lable,
                                                                    styles.styTextCode,
                                                                    isDisable && styles.textTaskCompleted
                                                                ]}
                                                            >
                                                                {item?.WorkListCode} - {item?.WorkListName}
                                                            </Text>
                                                        </View>
                                                        <View style={styles.styViewDate}>
                                                            {(item?.ResolveDate || item?.ColorDate) && (
                                                                <View
                                                                    style={[
                                                                        styles.styColorDate,
                                                                        {
                                                                            backgroundColor: item?.Color
                                                                                ? rgb(
                                                                                      EnumColors[(item?.Color)]
                                                                                          ?.bgColors
                                                                                )
                                                                                : null
                                                                        }
                                                                    ]}
                                                                >
                                                                    <IconTime size={16} color={Colors.black} />
                                                                    <Text
                                                                        style={[
                                                                            styleSheets.lable,
                                                                            styles.styColorText,
                                                                            {
                                                                                color: item?.Color
                                                                                    ? EnumColors[(item?.Color)]?.colors
                                                                                    : null
                                                                            }
                                                                        ]}
                                                                    >
                                                                        {moment(dateWorkStatus).format('DD/MM/YYYY')}
                                                                    </Text>
                                                                </View>
                                                            )}
                                                            <View
                                                                style={[
                                                                    styles.styViewAv,
                                                                    { maxWidth: item?.ColorDate ? '58%' : '90%' }
                                                                ]}
                                                            >
                                                                {Vnr_Function.renderAvatarCricleByName(
                                                                    item?.ImplementerImagePath,
                                                                    item?.ImplementerName,
                                                                    24
                                                                )}
                                                                <Text
                                                                    numberOfLines={1}
                                                                    style={[styleSheets.lable, styles.textProfileName]}
                                                                >
                                                                    {item?.ImplementerName}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                        {item?.IsArrear && item?.Status === 'E_DONE' && (
                                                            <View style={{ paddingVertical: 6 }}>
                                                                <View style={styles.flex_Row_Ali_Center}>
                                                                    <Text
                                                                        style={[
                                                                            styleSheets.text,
                                                                            { fontSize: Size.text + 1 }
                                                                        ]}
                                                                    >
                                                                        {translate('HRM_PortalApp_Tas_AmountOfArrears')}{' '}
                                                                    </Text>
                                                                    <Text
                                                                        style={[
                                                                            styleSheets.lable,
                                                                            { fontSize: Size.text + 1 }
                                                                        ]}
                                                                    >
                                                                        {item?.AmountOfArrears}
                                                                    </Text>
                                                                </View>

                                                                {configFileAttach.map(e => {
                                                                    if (e.TypeView != 'E_COMMON_PROFILE')
                                                                        return Vnr_Function.formatStringTypeV3(
                                                                            item,
                                                                            e,
                                                                            configFileAttach
                                                                        );
                                                                })}

                                                                <View style={styles.flex_Row_Ali_Center}>
                                                                    <Text
                                                                        style={[
                                                                            styleSheets.text,
                                                                            { fontSize: Size.text + 1 }
                                                                        ]}
                                                                    >
                                                                        {translate('HRM_PortalApp_Tas_Note')}{' '}
                                                                    </Text>
                                                                    <Text
                                                                        style={[
                                                                            styleSheets.lable,
                                                                            { fontSize: Size.text + 1 }
                                                                        ]}
                                                                    >
                                                                        {item?.Note}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                        )}
                                                    </View>
                                                </TouchableOpacity>
                                            </Swipeable>
                                        );
                                    })}
                            </View>

                            {/* ghi chú */}
                            <View style={{ paddingHorizontal: styleSheets.p_10 }}>
                                <View
                                    style={{
                                        paddingVertical: 6
                                    }}
                                >
                                    <Text style={[styleSheets.lable, {}]}>{translate('Note')}</Text>
                                </View>
                                <View style={styles.flex1Center}>
                                    {Array.isArray(dataItem?.CommentProfileWorkList) &&
                                    dataItem?.CommentProfileWorkList.length > 0 ? (
                                        dataItem?.CommentProfileWorkList.map((item, index) => {
                                            return (
                                                <View key={index} style={styles.wrapContentNote}>
                                                    <View style={{ flex: 1 }}>
                                                        <View style={styles.wrapProfileNameAndSubTitleNote}>
                                                            {dataItem?.CommentProfileWorkList[index - 1]?.CodeEmp !==
                                                            item?.CodeEmp ? (
                                                                    Vnr_Function.renderAvatarCricleByName(
                                                                    item?.ImagePath,
                                                                    item?.ProfileName,
                                                                    32
                                                                    )
                                                                ) : (
                                                                    <View style={{ width: 32 }} />
                                                                )}
                                                            <View style={{ marginLeft: 6 }}>
                                                                <Text
                                                                    numberOfLines={3}
                                                                    style={styles.textProfileNameAndSubTitleNote}
                                                                >
                                                                    <Text
                                                                        style={[
                                                                            styleSheets.lable,
                                                                            styles.textProfileNameLable
                                                                        ]}
                                                                    >
                                                                        {item?.ProfileName}{' '}
                                                                    </Text>
                                                                    {`${translate('HRM_PortalApp_AlreadyAddWorkNote')}`}
                                                                    <Text
                                                                        style={[
                                                                            styleSheets.lable,
                                                                            { fontSize: Size.text + 1 }
                                                                        ]}
                                                                    >
                                                                        {' '}
                                                                        {item?.WorkListCode} - {item?.WorkListName}
                                                                    </Text>
                                                                </Text>
                                                            </View>
                                                        </View>

                                                        <CommentItem comment={item?.Comment} />

                                                        <View style={styles.wrapDateNote}>
                                                            <Text
                                                                style={[
                                                                    styleSheets.text,
                                                                    { fontSize: Size.text - 1, color: Colors.gray_8 }
                                                                ]}
                                                            >
                                                                {item?.DateComment
                                                                    ? moment(item?.DateComment).format(
                                                                        'HH:mm, DD/MM/YYYY'
                                                                    )
                                                                    : ''}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            );
                                        })
                                        ) : (
                                            <View style={styles.noFlexButCenter}>
                                                <Image
                                                    source={require('../../../../../assets/images/icon/empty-comment.png')}
                                                    style={styles.size66}
                                                />
                                                <Text style={[styleSheets.lable, { fontSize: Size.text + 1 }]}>
                                                    {translate('HRM_PortalApp_NoCommentFromManager')}
                                                </Text>
                                            </View>
                                        )}
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                    {dataItem && dataItem?.CompletedTaskCount != dataItem?.TaskCount && (
                        <View style={styles.styViewSave}>
                            <TouchableOpacity
                                disabled={!isSelected}
                                style={[styles.styBtnSave, !isSelected && { backgroundColor: Colors.gray_3 }]}
                                onPress={() => isSelected && this.onSave()}
                            >
                                <VnrText
                                    style={[
                                        styleSheets.lable,
                                        {
                                            color: !isSelected ? Colors.gray_7 : Colors.white
                                        }
                                    ]}
                                    i18nKey={'HRM_Common_Save'}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            );
        } else if (dataItem == 'EmptyData') {
            contentViewDetail = <EmptyData messageEmptyData={'EmptyData'} />;
        }

        return (
            <SafeAreaViewDetail style={styleSafeAreaView.style}>
                <View style={[styleSheets.container]}>
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        scrollEnabled={true}
                        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                    >
                        {contentViewDetail}
                        <HreWorkBoardAdd ref={refs => (this.refModalAddWork = refs)} />
                    </KeyboardAvoidingView>
                </View>
            </SafeAreaViewDetail>
        );
    }
}

const styles = StyleSheet.create({
    StyRightCode: { marginLeft: 7 },
    styBtnSave: {
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        height: 44,
        paddingVertical: 8,
        paddingHorizontal: 16
    },
    styCancel: {
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 0.3,
        height: 44,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: Colors.gray_5
    },
    styViewSave: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: Colors.gray_1,
        borderTopWidth: 1,
        borderTopColor: Colors.gray_5
    },

    styViewAv: {
        marginLeft: 4,
        flexDirection: 'row',
        alignItems: 'center'
    },
    styColorText: { marginLeft: 6 },
    styColorDate: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 2,
        paddingHorizontal: 4,
        alignSelf: 'baseline'
    },
    styProgress: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    styLeftProgress: {
        flex: 9,
        paddingRight: Size.defineSpace
    },
    styRightProgress: {
        flex: 1
    },
    styViewProgress: {
        height: 6,
        borderRadius: 6,
        backgroundColor: Colors.gray_5
    },
    styValProgress: {
        height: 6,
        borderRadius: 6,
        backgroundColor: Colors.primary
    },
    styTextValProgress: {
        color: Colors.gray_10
    },
    styItemAction: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.gray_2,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5
    },
    styViewCheck: {
        flexDirection: 'row'
    },
    styTextCode: {
        fontSize: Size.text + 3
    },
    styViewDate: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    textTaskCompleted: {
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid'
    },

    textProfileName: {
        fontSize: Size.text + 2,
        color: '#0971DC',
        marginLeft: 4
    },

    flex_Row_Ali_Center: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    flex1Center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    wrapContentNote: {
        flex: 1,
        padding: 16
    },

    wrapProfileNameAndSubTitleNote: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },

    textProfileNameAndSubTitleNote: {
        maxWidth: '97%',
        fontSize: Size.text + 1
    },

    textProfileNameLable: {
        fontSize: Size.text + 1,
        fontWeight: Platform.OS === 'ios' ? '500' : '700'
    },

    wrapDateNote: {
        marginLeft: 38,
        padding: 4
    },

    size66: {
        width: 66,
        height: 66
    },

    noFlexButCenter: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});
