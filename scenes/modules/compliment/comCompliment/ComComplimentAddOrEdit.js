import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Modal,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styleSheets, Size, Colors, CustomStyleSheet } from '../../../../constants/styleConfig';
import { IconCancel, IconCheck, IconGroupUser, IconPlus, IconMinus } from '../../../../constants/Icons';
import VnrText from '../../../../components/VnrText/VnrText';
import HttpService from '../../../../utils/HttpService';
import { ToasterSevice, ToasterInModal } from '../../../../components/Toaster/Toaster';
import { translate } from '../../../../i18n/translate';
import { AlertInModal } from '../../../../components/Alert/Alert';
import { EnumName, EnumIcon } from '../../../../assets/constant';
import { dataVnrStorage } from '../../../../assets/auth/authentication';
import Vnr_Function from '../../../../utils/Vnr_Function';
import styleComonAddOrEdit from '../../../../constants/styleComonAddOrEdit';
import VnrIndeterminate from '../../../../components/VnrLoading/VnrIndeterminate';
import VnrSuperFilterWithTextInput from '../../../../componentsV3/VnrSuperFilterWithTextInput/VnrSuperFilterWithTextInput';

const API_APPROVE = {
    urlApi: '[URI_HR]/Com_GetData/GetProfileMultiEntities',
    type: 'E_GET'
};

const initSateDefault = {
    isRefresh: false,
    ID: null,
    Profile: {
        label: 'HRM_Attendance_Leaveday_ProfileID',
        ID: null,
        ProfileName: '',
        disable: true
    },
    UserReceiver: {
        // label: 'HRM_Attendance_LateEarlyAllowed_UserApproveName',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    Note: {
        lable: 'HRM_PortalApp_Compliment_Note',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    dataSelect: [],
    fieldValid: {},
    isConfigMultiShift: false,
    params: null,
    isShowModal: false,
    isShowLoading: false,
    dayNotHaveShift: null,
    dispensingPoint: null
};

export default class ComComplimentAddOrEdit extends Component {
    constructor(props) {
        super(props);
        this.state = initSateDefault;
        this.refReceiver = null;
        this.listRefGetDataSave = {};
        this.isModify = false;
        this.isProcessing = false;
    }

    //#region [khởi tạo - check đăng ký hộ, lấy các dữ liệu cho control, lấy giá trị mặc đinh]

    //promise get config valid
    getConfigValid = () => {
        const { params } = this.state;

        let { record } = params;

        if (!record) {
            // [CREATE] Step 3: Tạo mới
            this.isModify = false;
            this.initData();
        } else {
            // [EDIT] Step 3: Chỉnh sửa
            this.isModify = true;
            this.getRecordAndConfigByID(record, this.handleSetState);
        }
    };

    componentDidMount() {
        this.getCriteriaGroup();
    }

    handleSetState = (response) => {
        const { UserReceiver, Profile } = this.state;

        const profileInfo = dataVnrStorage
            ? dataVnrStorage.currentUser
                ? dataVnrStorage.currentUser.info
                : null
            : null;

        const { E_ProfileID, E_FullName } = EnumName,
            _profile = { ID: profileInfo[E_ProfileID], ProfileName: profileInfo[E_FullName] };

        let nextState = {
            isShowModal: true,
            Profile: {
                ...Profile,
                ..._profile
            },
            UserReceiver: {
                ...UserReceiver,
                value: response,
                refresh: !UserReceiver.refresh
            }
        };

        this.setState(nextState, () => {
            this.getCriteriaGroup();
        });
    };

    getRecordAndConfigByID = (record, _handleSetState) => {
        // trường hợp có get config thì vào hàm này get
        _handleSetState(record);
    };
    //#endregion

    initData = () => {
        this.showLoading(false);
        const profileInfo = dataVnrStorage
            ? dataVnrStorage.currentUser
                ? dataVnrStorage.currentUser.info
                : null
            : null;

        const { E_ProfileID, E_FullName } = EnumName,
            _profile = { ID: profileInfo[E_ProfileID], ProfileName: profileInfo[E_FullName] };

        const { Profile } = this.state;

        let nextState = {
            Profile: {
                ...Profile,
                ..._profile
            }
        };

        this.setState(nextState, () => {
            // Show modal chọn ngày đăng ký
            this.onShowUserReceiver();
        });
    };

    onShowUserReceiver = () => {
        if (this.refReceiver && this.refReceiver.opentModal) {
            this.refReceiver.opentModal();
        }
    };

    refreshForm = () => {
        this.AlertSevice.alert({
            iconType: EnumIcon.E_WARNING,
            title: 'HRM_PortalApp_OnReset',
            message: 'HRM_PortalApp_OnReset_Message',
            onCancel: () => {},
            onConfirm: () => {
                this.setState(initSateDefault, () => this.initData());
            }
        });
    };

    //#endregion

    //#region [lưu]
    onSaveAndSend = () => {
        this.onSave(true);
    };

    onSaveTemp = () => {
        this.AlertSevice.alert({
            iconType: EnumIcon.E_WARNING,
            title: 'HRM_PortalApp_OnSave_Temp',
            message: 'HRM_PortalApp_OnSave_Temp_Message',
            onCancel: () => {},
            onConfirm: () => {
                this.onSave();
            }
        });
    };

    onSave = () => {
        const { UserReceiver, Profile, Note, dataSelect, params, dispensingPoint } = this.state;
        if (this.isProcessing) return;

        if (UserReceiver.value && Array.isArray(UserReceiver.value) && UserReceiver.value.length > 0) {
            const dataListGivenGroup = [];
            let totalPoint = 0,
                complimentGroupID = null;
            dataSelect.forEach((gp) => {
                if (gp.isSelect == true) {
                    const listItem = [];
                    gp.listValue.forEach((item) => {
                        if (item.isSelect == true) {
                            listItem.push({
                                CriteriaID: item.ID,
                                Point: item.Point
                            });
                            totalPoint += item.Point;
                        }
                    });

                    complimentGroupID = gp.ID;
                    dataListGivenGroup.push({
                        GroupID: gp.ID,
                        ListCriteria: listItem
                    });
                }
            });
            let payload = {
                ProfileID: Profile.ID,
                ListGivenProfileID: UserReceiver.value.map((item) => item.ID),
                GivenProfileID: UserReceiver.value[0].ID,
                Point: totalPoint,
                Note: Note.value,
                ComplimentGroupID: complimentGroupID,
                ListGiven: dataListGivenGroup
            };

            // validate on UI
            if (dataListGivenGroup.length <= 0) {
                this.ToasterSevice.showWarning('HRM_PortalApp_PleaseChooseCriteriaGroup');
                return;
            } else {
                dataListGivenGroup.map((item) => {
                    if (!item?.GroupID || (Array.isArray(item?.ListCriteria) && item?.ListCriteria.length <= 0)) {
                        this.ToasterSevice.showWarning('HRM_PortalApp_PleaseChooseCriteria');
                        return;
                    }
                });
            }

            if (dispensingPoint < totalPoint) {
                this.ToasterSevice.showWarning('HRM_PortalApp_NotEnoughDistributionPoints');
                return;
            }

            this.isProcessing = true;
            this.showLoading(true);
            HttpService.Post('[URI_HR]/api/Com_ComplimentRecord', payload).then((res) => {
                this.isProcessing = false;
                this.showLoading(false);
                if (res.ActionStatus == EnumName.E_Success) {
                    this.onClose();

                    ToasterSevice.showSuccess('Hrm_Succeed', 5500);

                    const { reload } = params;
                    if (reload && typeof reload === 'function') {
                        reload();
                    }
                } else if (res.Message) {
                    this.ToasterSevice.showWarning(res.Message, 4000);
                }
            });
        } else {
            this.ToasterSevice.showWarning('HRM_PortalApp_Compliment_Plaese_Receiver');
        }
    };
    //#endregion

    onClose = () => {
        const { UserReceiver } = this.state;

        this.setState({
            isShowModal: false,
            UserReceiver: {
                ...UserReceiver,
                value: null,
                refresh: !UserReceiver.refresh
            }
        });
    };

    // Step 1: Gọi hàm onShow để tạo mới hoặc chỉnh sửa hoặc onShowFromWorkDay để tạo mới
    onShow = (params) => {
        this.setState(
            {
                ...{ ...initSateDefault },
                params: params
            },
            () => {
                this.getConfigValid();
            }
        );
    };

    showLoading = (isShow) => {
        this.setState({
            isShowLoading: isShow
        });
    };

    _renderHeaderLoading = () => {
        if (this.state.isShowLoading) {
            return (
                <View style={styleComonAddOrEdit.styLoadingHeader}>
                    <View style={styleComonAddOrEdit.styViewLoading} />
                    <VnrIndeterminate isVisible={this.state.isShowLoading} />
                </View>
            );
        } else return <View />;
    };

    ToasterSeviceCallBack = () => {
        return this.ToasterSevice;
    };

    getCriteriaGroup = () => {
        const { Profile } = this.state;
        this.showLoading(true);
        HttpService.MultiRequest([
            HttpService.Post('[URI_HR]/Cat_GetData/GetComplimentGroupList'),
            HttpService.Post('[URI_HR]/Cat_GetData/GetComplimentCriteriaList'),
            HttpService.Get(`[URI_HR]/Com_GetData/GetEmpPointForMaster?ProfileID=${Profile.ID}`)
        ]).then((resData) => {
            const [dataGroup, dataCriteria, dataDispensingPoint] = resData;

            let _dataSelect = [];
            if (dataGroup.Data && dataGroup.Data.length > 0 && dataCriteria.Data && dataCriteria.Data.length > 0) {
                dataGroup.Data.sort((a, b) => {
                    return a.OrderNumber - b.OrderNumber;
                });
                dataCriteria.Data.sort((a, b) => {
                    return a.OrderNumber - b.OrderNumber;
                });
                _dataSelect = dataGroup.Data.map((item) => {
                    return {
                        ...item,
                        listValue: dataCriteria.Data.filter((e) => e.ComplimentGroupID == item.ID).map((e) => {
                            return {
                                ...e,
                                isSelect: false
                            };
                        }),
                        isSelect: false
                    };
                });
                this.setState({
                    dataSelect: _dataSelect,
                    isShowLoading: false,
                    dispensingPoint:
                        dataDispensingPoint?.IssuedPoint !== null && dataDispensingPoint?.IssuedPoint !== undefined
                            ? dataDispensingPoint?.IssuedPoint
                            : 0
                });
            } else {
                this.setState({
                    dataSelect: [],
                    isShowLoading: false,
                    dispensingPoint:
                        dataDispensingPoint?.IssuedPoint !== null && dataDispensingPoint?.IssuedPoint !== undefined
                            ? dataDispensingPoint?.IssuedPoint
                            : 0
                });
            }
        });
    };

    onChangeUserReceiver = (item) => {
        const { UserReceiver, isRefresh } = this.state;

        let nextState = {
            UserReceiver: {
                ...UserReceiver,
                value: item,
                refresh: !UserReceiver.refresh
            },
            isRefresh: !isRefresh,
            isShowModal: true
        };

        this.setState(nextState, () => {
            this.getCriteriaGroup();
        });
    };

    //change duyệt cuối
    onChangeUserApprove2 = (item) => {
        const { UserApprove, UserApprove2, UserApprove3, UserApprove4 } = this.state;

        let nextState = {
            UserApprove2: {
                ...UserApprove2,
                value: { ...item },
                refresh: !UserApprove2.refresh
            }
        };

        //nếu 1 cấp duyệt mới chạy
        if (this.levelApprove == 1) {
            nextState = {
                ...nextState,
                UserApprove3: {
                    ...UserApprove3,
                    visible: false
                },
                UserApprove4: {
                    ...UserApprove4,
                    visible: false
                }
            };

            if (!item) {
                nextState = {
                    ...nextState,
                    UserApprove: {
                        ...UserApprove,
                        value: null,
                        refresh: !UserApprove.refresh
                    },
                    UserApprove3: {
                        ...UserApprove3,
                        value: null,
                        refresh: !UserApprove3.refresh
                    },
                    UserApprove4: {
                        ...UserApprove4,
                        value: null,
                        refresh: !UserApprove4.refresh
                    }
                };
            } else {
                nextState = {
                    ...nextState,
                    UserApprove: {
                        ...UserApprove,
                        value: { ...item },
                        refresh: !UserApprove.refresh
                    },
                    UserApprove3: {
                        ...UserApprove3,
                        value: { ...item },
                        refresh: !UserApprove3.refresh
                    },
                    UserApprove4: {
                        ...UserApprove4,
                        value: { ...item },
                        refresh: !UserApprove4.refresh
                    }
                };
            }
        } else if (this.levelApprove == 2) {
            if (!item) {
                nextState = {
                    ...nextState,
                    UserApprove3: {
                        ...UserApprove3,
                        value: null,
                        refresh: !UserApprove3.refresh
                    },
                    UserApprove4: {
                        ...UserApprove4,
                        value: null,
                        refresh: !UserApprove4.refresh
                    }
                };
            } else {
                nextState = {
                    ...nextState,
                    UserApprove3: {
                        ...UserApprove3,
                        value: { ...item },
                        refresh: !UserApprove3.refresh
                    },
                    UserApprove4: {
                        ...UserApprove4,
                        value: { ...item },
                        refresh: !UserApprove4.refresh
                    }
                };
            }
        } else if (this.levelApprove == 3) {
            if (!item) {
                nextState = {
                    ...nextState,
                    UserApprove4: {
                        ...UserApprove4,
                        value: null,
                        refresh: !UserApprove4.refresh
                    }
                };
            } else {
                nextState = {
                    ...nextState,
                    UserApprove4: {
                        ...UserApprove4,
                        value: { ...item },
                        refresh: !UserApprove4.refresh
                    }
                };
            }
        }

        this.setState(nextState);
    };

    closeModalErrorDetail = () => {
        let nextState = {
            modalErrorDetail: {
                ...this.state.modalErrorDetail,
                isModalVisible: false
            }
        };

        this.setState(nextState);
    };

    onSelectGroup = (indexGroup) => {
        const { dataSelect } = this.state;

        if (dataSelect && dataSelect.length > 0 && dataSelect[indexGroup]) {
            const itemGroup = dataSelect[indexGroup];
            dataSelect[indexGroup].isSelect = !itemGroup.isSelect;

            this.setState({ dataSelect: dataSelect });
        }
    };

    onSelectItem = (indexGroup, indexItem) => {
        const { dataSelect } = this.state;

        if (dataSelect && dataSelect.length > 0 && dataSelect[indexGroup]) {
            const itemGroup = dataSelect[indexGroup];

            if (itemGroup && itemGroup.listValue[indexItem]) {
                const chilrenItem = itemGroup.listValue[indexItem];
                itemGroup.listValue[indexItem].isSelect = !chilrenItem.isSelect;
            }

            this.setState({ dataSelect: dataSelect });
        }
    };

    render() {
        const { UserReceiver, dataSelect, isShowModal } = this.state;

        const isShowJobTitleName = Vnr_Function.checkIsShowConfigField('ComComplimentAddOrEdit', 'JobTitleName'),
            isShowPositionName = Vnr_Function.checkIsShowConfigField('ComComplimentAddOrEdit', 'PositionName'),
            isShowCodeEmp = Vnr_Function.checkIsShowConfigField('ComComplimentAddOrEdit', 'CodeEmp'),
            underName = [],
            nameList = ['ProfileName'];

        if (isShowJobTitleName) underName.push('JobTitleName');

        if (isShowPositionName) underName.push('PositionName');

        if (isShowCodeEmp) nameList.push('CodeEmp');

        return (
            <View style={styles.container}>
                <VnrSuperFilterWithTextInput
                    ref={(resf) => (this.refReceiver = resf)}
                    api={API_APPROVE}
                    refresh={UserReceiver.refresh}
                    textField="ProfileName"
                    valueField="ID"
                    licensedDisplay={[
                        {
                            Name: nameList,
                            Avatar: ['ImagePath'],
                            UnderName: underName
                        }
                    ]}
                    filter={true}
                    filterServer={true}
                    filterParams={'text'}
                    autoFilter={true}
                    status={UserReceiver.status}
                    value={UserReceiver.value ? UserReceiver.value : []}
                    disable={UserReceiver.disable}
                    onFinish={(item) => {
                        this.onChangeUserReceiver(item);
                    }}
                />

                {UserReceiver.value && (
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={isShowModal} //isShowModal
                        style={styles.styModalUserReceiver}
                    >
                        <SafeAreaView style={styleComonAddOrEdit.wrapInsideModal}>
                            <ToasterInModal
                                ref={(refs) => {
                                    this.ToasterSevice = refs;
                                }}
                            />
                            <AlertInModal ref={(refs) => (this.AlertSevice = refs)} />

                            <View style={styleComonAddOrEdit.flRowSpaceBetween}>
                                <VnrText
                                    style={[
                                        styleSheets.lable,
                                        styleComonAddOrEdit.styHeaderText,
                                        CustomStyleSheet.fontWeight('700')
                                    ]}
                                    i18nKey={
                                        this.isModify
                                            ? 'HRM_PortalApp_Compliment_SendAppreciation'
                                            : 'HRM_PortalApp_Compliment_SendAppreciation'
                                    }
                                />
                                <TouchableOpacity onPress={() => this.onClose()}>
                                    <IconCancel size={Size.iconSize} color={Colors.gray_8} />
                                </TouchableOpacity>
                            </View>
                            {/*
                                <View style={styleComonAddOrEdit.styViewLogo}>
                                    <Image source={require('../../../../assets/images/vnrDateFromTo/Group.png')} />
                                </View> */}

                            {this._renderHeaderLoading()}
                            <KeyboardAvoidingView
                                scrollEnabled={true}
                                style={[styleComonAddOrEdit.styAvoiding, styles.styContenGray]}
                                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                            >
                                <ScrollView style={styles.wrapModalAdd}>
                                    <View style={styles.flRowSpaceBetween}>
                                        <VnrText
                                            style={[styleSheets.lable, styles.styLableGp]}
                                            i18nKey={'HRM_PortalApp_Compliment_UserReceiver'}
                                        />
                                    </View>

                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={styles.styBtnGroup}
                                        onPress={() => this.onShowUserReceiver()}
                                    >
                                        <View style={styles.styUserView}>
                                            <IconGroupUser size={Size.iconSize} color={Colors.gray_9} />
                                            <VnrText
                                                style={[styleSheets.text, styles.styUserLable]}
                                                i18nKey={'HRM_PortalApp_Compliment_PraisedBy'}
                                            />
                                        </View>
                                        {UserReceiver.value && UserReceiver.value.length == 1 ? (
                                            <View style={styles.styUserName}>
                                                {Vnr_Function.renderAvatarCricleByName(
                                                    UserReceiver.value[0]['ImagePath'],
                                                    UserReceiver.value[0]['ProfileName'],
                                                    25
                                                )}
                                                <Text
                                                    numberOfLines={1}
                                                    style={[styleSheets.text, styles.styUserTxtName]}
                                                >
                                                    {UserReceiver.value[0]['ProfileName']}
                                                </Text>
                                            </View>
                                        ) : (
                                            <View style={styles.styUserName}>
                                                <Text style={[styleSheets.text]}>{`${
                                                    UserReceiver.value.length
                                                } ${translate('HRM_PortalApp_Compliment_User')}`}</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>

                                    <View style={styles.flRowSpaceBetween}>
                                        <VnrText
                                            style={[styleSheets.lable, styles.styLableGp]}
                                            i18nKey={'HRM_PortalApp_Compliment_Group'}
                                        />
                                    </View>

                                    {dataSelect &&
                                        dataSelect.length > 0 &&
                                        dataSelect.map((itemGp, index) => {
                                            const uriIcon = HttpService.handelUrl(`[URI_POR]/Uploads/${itemGp.Icon}`);
                                            return (
                                                <View key={index} style={styles.styGroup}>
                                                    <TouchableOpacity
                                                        activeOpacity={0.8}
                                                        style={styles.styBtnGroup}
                                                        onPress={() => this.onSelectGroup(index)}
                                                    >
                                                        <View style={styles.styViewIcon}>
                                                            <Image
                                                                source={{ uri: uriIcon }}
                                                                style={styles.styImgIcon}
                                                            />
                                                        </View>
                                                        {/* {Vnr_Function.renderAvatarCricleByName(dataItem[licensedDisplay.Avatar[0]], dataItem[textField], 40)} */}
                                                        <View style={styles.styViewTitle}>
                                                            <View>
                                                                <Text style={[styleSheets.text]}>
                                                                    {itemGp.GroupName}
                                                                </Text>
                                                                <Text style={[styleSheets.text, styles.styTxtTitle]}>
                                                                    {`${itemGp.listValue?.length} ${translate(
                                                                        'HRM_PortalApp_Compliment_CriteriaLower'
                                                                    )}`}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                        <View style={[styles.styCheckbox]}>
                                                            {itemGp.isSelect === true ? (
                                                                <IconMinus size={Size.text + 8} color={Colors.black} />
                                                            ) : (
                                                                <IconPlus size={Size.text + 8} color={Colors.black} />
                                                            )}
                                                        </View>
                                                    </TouchableOpacity>

                                                    {itemGp.listValue &&
                                                        itemGp.listValue.length > 0 &&
                                                        itemGp.isSelect === true &&
                                                        itemGp.listValue.map((item, indexItem) => {
                                                            const iconUriItem = HttpService.handelUrl(
                                                                `[URI_POR]/Uploads/${item.Icon}`
                                                            );
                                                            return (
                                                                <TouchableOpacity
                                                                    key={indexItem}
                                                                    activeOpacity={0.8}
                                                                    style={styles.styViewItem}
                                                                    onPress={() => this.onSelectItem(index, indexItem)}
                                                                >
                                                                    <View
                                                                        style={[
                                                                            styles.styBtnItem,
                                                                            indexItem == itemGp.listValue.length - 1 &&
                                                                                styles.styBtnItemLast
                                                                        ]}
                                                                    >
                                                                        <View style={styles.styViewIcon}>
                                                                            <Image
                                                                                source={{ uri: iconUriItem }}
                                                                                style={styles.styImgIcon}
                                                                            />
                                                                        </View>
                                                                        {/* {Vnr_Function.renderAvatarCricleByName(dataItem[licensedDisplay.Avatar[0]], dataItem[textField], 40)} */}
                                                                        <View style={styles.styViewTitle}>
                                                                            <View>
                                                                                <Text style={[styleSheets.text]}>
                                                                                    {item.CriteriaName}
                                                                                </Text>
                                                                                <Text
                                                                                    style={[
                                                                                        styleSheets.text,
                                                                                        styles.styTxtPoint
                                                                                    ]}
                                                                                >
                                                                                    {`${item.Point} ${translate(
                                                                                        'HRM_PortalApp_Compliment_Point'
                                                                                    )}`}
                                                                                </Text>
                                                                            </View>
                                                                        </View>
                                                                        <View
                                                                            style={[
                                                                                styles.styCheckbox,
                                                                                item.isSelect && {
                                                                                    backgroundColor: Colors.blue
                                                                                },
                                                                                styles.stySelectItem
                                                                            ]}
                                                                        >
                                                                            {item.isSelect === true && (
                                                                                <IconCheck
                                                                                    size={Size.text}
                                                                                    color={Colors.white}
                                                                                />
                                                                            )}
                                                                        </View>
                                                                    </View>
                                                                </TouchableOpacity>
                                                            );
                                                        })}
                                                </View>
                                            );
                                        })}

                                    {/* <View style={[styles.styBtnGroup, { borderBottomWidth: 0 }]}>
                                            <VnrTextInput
                                                placeHolder={'HRM_PortalApp_PleaseInput'}
                                                disable={Note.disable}
                                                lable={Note.lable}
                                                styleContent={styles.styInput}
                                                style={[
                                                    styleSheets.text,
                                                    viewInputMultiline,
                                                    { borderBottomWidth: 0 }
                                                ]}
                                                multiline={true}
                                                value={Note.value}
                                                onFocus={() => {
                                                    // Platform.OS == 'ios' && onScrollToInputIOS(indexDay + 1, this.layoutHeightItem)
                                                }}
                                                onChangeText={(text) => {
                                                    this.setState({
                                                        Note: {
                                                            ...Note,
                                                            value: text,
                                                            refresh: !Note.refresh,
                                                        },
                                                    });
                                                }}
                                                refresh={Note.refresh}
                                            />

                                        </View> */}
                                </ScrollView>
                            </KeyboardAvoidingView>

                            {/* button */}
                            <View style={styles.wrapButtonHandler}>
                                <TouchableOpacity
                                    style={[styles.wrapBtnRegister, styles.wrapRegister]}
                                    onPress={() => this.onSaveAndSend()}
                                >
                                    <VnrText
                                        style={[styleSheets.lable, styles.styRegister]}
                                        i18nKey={'HRM_PortalApp_Compliment_Send'}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.btnRefresh} onPress={() => this.refreshForm()}>
                                    <Image
                                        style={{ width: Size.iconSize, height: Size.iconSize }}
                                        resizeMode="cover"
                                        source={require('../../../../assets/images/vnrDateFromTo/reset-sm.png')}
                                    />
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>
                    </Modal>
                )}
            </View>
        );
    }
}

const styles = {
    ...styleComonAddOrEdit,
    ...StyleSheet.create({
        styBtnItemLast: { borderBottomWidth: 0 },
        stySelectItem: {
            borderRadius: (Size.iconSize + 4) / 2,
            borderWidth: 1,
            borderColor: Colors.gray_5
        },
        styModalUserReceiver: { padding: 0, margin: 0 },
        wrapModalAdd: {
            flex: 1
        },
        styContenGray: {
            flex: 1,
            backgroundColor: Colors.gray_4
        },
        styGroup: {
            marginBottom: Size.defineHalfSpace
        },
        styBtnGroup: {
            flexDirection: 'row',
            backgroundColor: Colors.white,
            paddingHorizontal: Size.defineSpace,
            paddingVertical: Size.defineHalfSpace,
            alignItems: 'center',
            borderBottomColor: Colors.gray_5,
            borderBottomWidth: 0.5
        },
        styViewItem: {
            backgroundColor: Colors.white
        },
        styBtnItem: {
            alignItems: 'center',
            flexDirection: 'row',
            marginLeft: Size.defineSpace * 2 + 5,
            paddingVertical: Size.defineHalfSpace,
            paddingRight: Size.defineSpace,
            borderBottomColor: Colors.gray_5,
            borderBottomWidth: 0.5
        },
        styViewIcon: {
            marginRight: Size.defineHalfSpace
        },
        styImgIcon: {
            width: 50,
            height: 50,
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.gray_4
        },
        styViewTitle: {
            flex: 1,
            marginLeft: Size.defineHalfSpace
        },
        styTxtTitle: {
            fontSize: Size.text - 1,
            color: Colors.gray_8
        },
        styTxtPoint: {
            fontSize: Size.text - 1,
            color: Colors.orange
        },
        styCheckbox: {
            width: Size.iconSize + 4,
            height: Size.iconSize + 4,
            // borderRadius: (Size.iconSize + 4) / 2,
            // borderWidth: 1,
            // borderColor: Colors.gray_5,
            justifyContent: 'center',
            alignItems: 'center'
        },

        styLableGp: {
            color: Colors.gray_9
        },
        styUserView: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        styUserName: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingLeft: Size.defineSpace + 25
        },
        styUserLable: {
            color: Colors.gray_9,
            marginLeft: Size.defineHalfSpace
        },
        styUserTxtName: {
            marginLeft: Size.defineHalfSpace
        },

        wrapRegister: {
            backgroundColor: Colors.volcano
        },
        styInput: {
            paddingHorizontal: 0
        }
    })
};
