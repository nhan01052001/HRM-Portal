import React, { Component } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    Platform,
    KeyboardAvoidingView,
    Image,
    Keyboard
} from 'react-native';
import {
    styleSheets,
    styleScreenDetail,
    styleSafeAreaView,
    Size,
    Colors,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import DrawerServices from '../../../../../utils/DrawerServices';
import { EnumName, ScreenName, EnumIcon } from '../../../../../assets/constant';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
import Vnr_Services from '../../../../../utils/Vnr_Services';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';
import { translate } from '../../../../../i18n/translate';
import { IconDelete } from '../../../../../constants/Icons';
import moment from 'moment';
import { VnrBtnCreate } from '../../../../../componentsV3/VnrBtnCreate/VnrBtnCreate';
import ModalSearch from './ModalSearch';
import ModalAddWork from './ModalAddWork';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import CommentItem from '../hreWorkManageList/CommentItem';
import HreWorkManageItemDetail from './HreWorkManageItemDetail';
import { ToasterInModal } from '../../../../../components/Toaster/Toaster';

const configDefault = [
    {
        TypeView: 'E_STATUS',
        Name: 'WorkListStatusView',
        DisplayKey: 'HRM_Attendance_Overtime_OvertimeList_Status',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP_PROFILE',
        DisplayKey: 'HRM_PortalApp_Subscribers',
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

export default class HreWorkManageViewDetail extends Component {
    constructor(props) {
        super(props);
        (this.state = {
            dataItem: null,
            configListDetail: null,
            dataWorkList: [],
            search: '',
            isDisableBtnSave: true,
            lsItemChecked: []
        }),
        (this.refModal = null);
        this.refModalAddWork = null;
        this.refSwipe = null;
        this.listItemOpenSwipeOut = [];
        this.oldIndexOpenSwipeOut = null;
        this.ToasterSevice = {
            showError: null,
            showSuccess: null,
            showWarning: null,
            showInfo: null
        };
    }

    handerOpenSwipeOut = (indexOnOpen) => {
        Keyboard.dismiss();
        if (this.oldIndexOpenSwipeOut !== null && this.oldIndexOpenSwipeOut != indexOnOpen) {
            if (
                !Vnr_Function.CheckIsNullOrEmpty(this.listItemOpenSwipeOut[this.oldIndexOpenSwipeOut]) &&
                this.listItemOpenSwipeOut[this.oldIndexOpenSwipeOut]['value'] != null
            ) {
                this.listItemOpenSwipeOut[this.oldIndexOpenSwipeOut]['value'].close();
            }
        }
        this.oldIndexOpenSwipeOut = indexOnOpen;
    };

    getDataItem = async () => {
        try {
            const _params = this.props.navigation.state.params,
                { dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail = ConfigListDetail.value[ScreenName.HreWorkManageViewDetail]
                    ? ConfigListDetail.value[ScreenName.HreWorkManageViewDetail]
                    : configDefault;

            let id = !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ProfileID;
            if (id) {
                const dataBody = {
                    ProfileID: id,
                    Type: dataItem?.Type,
                    IsManager: true
                };
                const response = await HttpService.Post(
                    '[URI_CENTER]/api/Hre_ProfileWorkList/GetDetailProfileWorkList',
                    dataBody,
                    null,
                    this.reload
                );
                if (response && response.Status == EnumName.E_SUCCESS) {
                    let data = response.Data,
                        disabledBtnSave = true;

                    data.itemStatus = Vnr_Services.formatStyleStatusApp(dataItem?.WorkListStatus);
                    data.WorkListStatusView = dataItem?.WorkListStatusView;

                    if (Array.isArray(data?.ProfileWorkList)) {
                        data?.ProfileWorkList.forEach((element) => {
                            if (element?.Status === EnumName.E_DONE) {
                                element.isSelected = true;
                                disabledBtnSave = false;
                            }
                        });
                    }

                    if (dataItem?.ImagePath) {
                        data.ImagePath = dataItem?.ImagePath;
                    }

                    this.setState({
                        configListDetail: _configListDetail,
                        dataItem: { ...dataItem, ...data },
                        dataWorkList: data?.ProfileWorkList,
                        isDisableBtnSave: disabledBtnSave
                    });
                } else {
                    this.setState({ dataItem: 'EmptyData' });
                }
            } else if (!Vnr_Function.CheckIsNullOrEmpty(dataItem)) {
                dataItem.ProfileName = `${dataItem?.ProfileName} - ${dataItem?.CodeEmp}`;
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

    handleDeleta = (item, index) => {
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
                            .then((res) => {
                                VnrLoadingSevices.hide();
                                if (res?.Status === EnumName.E_SUCCESS) {
                                    ToasterSevice.showSuccess('DeleteSuccess');
                                    this.listItemOpenSwipeOut[index]['value'].close();
                                    this.getDataItem();
                                }
                            })
                            .catch((error) => {
                                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                            });
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    }
                }
            }
        });
    };

    ToasterSeviceCallBack = () => {
        return this.ToasterSevice;
    };

    render() {
        const { dataItem, configListDetail, dataWorkList, lsItemChecked } = this.state,
            { containerItemDetail, contentScroll } = styleScreenDetail;
        let valueProgress = (dataItem?.CompletedTaskCount / dataItem?.TaskCount) * 100;

        let contentViewDetail = <VnrLoading size={'large'} />;

        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <ScrollView style={contentScroll} showsVerticalScrollIndicator={false}>
                        <View style={[containerItemDetail, CustomStyleSheet.paddingHorizontal(0)]}>
                            <View style={{ paddingHorizontal: styleSheets.p_10 }}>
                                {configListDetail.map((e) => {
                                    if (e.TypeView != 'E_COMMON_PROFILE')
                                        return Vnr_Function.formatStringTypeV3(dataItem, e, configListDetail);
                                })}
                            </View>

                            <View style={{ paddingHorizontal: styleSheets.p_10 }}>
                                <Text style={[styleSheets.lable, { fontSize: Size.text + 2 }]}>
                                    {dataItem?.WorkListTypeView}
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
                                        let isDisable = item?.isSelected && item?.Status === EnumName.E_DONE;
                                        let rightActions = <View style={{ width: 0 }} />;
                                        let maxWidth = '90%';
                                        if (item?.ColorDate) {
                                            maxWidth = '60%';
                                        }
                                        if (item?.Status !== EnumName.E_DONE) {
                                            rightActions = (
                                                <View style={styles.styViewRightAction}>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            this.handleDeleta(item, index);
                                                        }}
                                                        style={styles.btnDelete}
                                                    >
                                                        <IconDelete size={Size.iconSize} color={Colors.white} />
                                                        <Text style={[styleSheets.text, { color: Colors.white }]}>
                                                            {translate('HRM_PortalApp_Delete')}
                                                        </Text>
                                                    </TouchableOpacity>
                                                    {/* <TouchableOpacity
                                                    onPress={() => {
                                                        if (item?.WorkListID && item?.ID) {
                                                            this.refModalAddWork?.onShow({
                                                                ID: item?.WorkListID,
                                                                WorkListCode: item?.WorkListCode,
                                                                WorkListName: item?.WorkListName,
                                                                WorkListCodeName: item?.WorkListCodeName ? item?.WorkListCodeName : `${item?.WorkListCode} - ${item?.WorkListName}`,
                                                                Type: item?.Type
                                                            }, item?.Type, item);
                                                        }
                                                    }}
                                                    style={[styles.btnDelete, {
                                                        backgroundColor: Colors.warning
                                                    }]}>
                                                    <IconEdit size={Size.iconSize} color={Colors.white} />
                                                    <Text style={[styleSheets.text, { color: Colors.white }]}>
                                                        {translate('HRM_System_Resource_Sys_Edit')}
                                                    </Text>
                                                </TouchableOpacity> */}
                                                </View>
                                            );
                                        }
                                        return (
                                            <HreWorkManageItemDetail
                                                item={item}
                                                rightActions={rightActions}
                                                isDisable={isDisable}
                                                index={index}
                                                handerOpenSwipeOut={this.handerOpenSwipeOut}
                                                listItemOpenSwipeOut={this.listItemOpenSwipeOut}
                                                maxWidth={maxWidth}
                                                configFileAttach={configFileAttach}
                                                onPress={() => {
                                                    let nextState = {};

                                                    if (item?.isSelected) {
                                                        const arr = lsItemChecked.filter(
                                                            (value) => value?.ID !== item?.ID
                                                        );
                                                        nextState = {
                                                            lsItemChecked: [...arr]
                                                        };
                                                    } else {
                                                        nextState = {
                                                            lsItemChecked: [...lsItemChecked, { ...item }]
                                                        };
                                                    }

                                                    item.isSelected = !item.isSelected;
                                                    this.setState({
                                                        dataWorkList: dataWorkList,
                                                        ...nextState
                                                    });
                                                }}
                                            />
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
                                                                    <View style={CustomStyleSheet.width(32)} />
                                                                )}
                                                            <View style={CustomStyleSheet.marginLeft(6)}>
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
                </View>
            );
        } else if (dataItem == 'EmptyData') {
            contentViewDetail = <EmptyData messageEmptyData={'EmptyData'} />;
        }

        return (
            <SafeAreaViewDetail style={styleSafeAreaView.style}>
                <View style={[styleSheets.container]}>
                    <KeyboardAvoidingView
                        style={CustomStyleSheet.flex(1)}
                        scrollEnabled={true}
                        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                    >
                        {contentViewDetail}
                        <View style={styles.styViewBtnScreae}>
                            <VnrBtnCreate
                                onAction={() => {
                                    this.refModal?.onShow(dataItem?.Type);
                                }}
                            />
                        </View>
                        <ToasterInModal
                            ref={(refs) => {
                                this.ToasterSevice = refs;
                            }}
                        />
                        <ModalSearch
                            type={dataItem?.Type}
                            ref={(ref) => {
                                this.refModal = ref;
                            }}
                            onFisnish={(item) => {
                                this.refModalAddWork?.onShow(item, dataItem?.Type);
                            }}
                        />
                        <ModalAddWork
                            ToasterSevice={() => this.ToasterSeviceCallBack()}
                            ref={(ref) => {
                                this.refModalAddWork = ref;
                            }}
                            onFisnish={() => {
                                ToasterSevice.showSuccess('Hrm_Succeed');
                                this.getDataItem();
                            }}
                        />
                    </KeyboardAvoidingView>
                </View>
            </SafeAreaViewDetail>
        );
    }
}

const styles = StyleSheet.create({
    styViewBtnScreae: { position: 'absolute', bottom: Size.defineSpace, right: 0 },
    styViewRightAction: { flexDirection: 'row', alignItems: 'center' },
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

    btnDelete: {
        height: '100%',
        width: 100,
        backgroundColor: Colors.red,
        justifyContent: 'center',
        alignItems: 'center'
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
