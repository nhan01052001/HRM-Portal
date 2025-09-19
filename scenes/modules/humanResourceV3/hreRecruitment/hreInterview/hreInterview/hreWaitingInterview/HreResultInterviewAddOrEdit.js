import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Modal,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styleSheets, Size, Colors, CustomStyleSheet } from '../../../../../../../constants/styleConfig';
import { IconCancel } from '../../../../../../../constants/Icons';
import VnrText from '../../../../../../../components/VnrText/VnrText';
import HttpService from '../../../../../../../utils/HttpService';
import { ToasterSevice, ToasterInModal } from '../../../../../../../components/Toaster/Toaster';
import { AlertInModal } from '../../../../../../../components/Alert/Alert';
import { EnumName, ScreenName } from '../../../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../../../assets/auth/authentication';
import styleComonAddOrEdit from '../../../../../../../constants/styleComonAddOrEdit';
import VnrIndeterminate from '../../../../../../../components/VnrLoading/VnrIndeterminate';
import DrawerServices from '../../../../../../../utils/DrawerServices';
import HreResultInterviewComponent from './HreResultInterviewComponent';
import { HreWaitingInterviewBusiness } from './HreWaitingInterviewBusiness';

const initSateDefault = {
    isRefresh: false,
    ID: null,
    Profile: {
        label: 'HRM_Attendance_Leaveday_ProfileID',
        ID: null,
        ProfileName: '',
        disable: true
    },
    fieldConfig: {
        Knowledge: {
            visibleConfig: true,
            isValid: false
        },
        Skill: {
            visibleConfig: true,
            isValid: false
        },
        WorkAttitude: {
            visibleConfig: true,
            isValid: false
        },
        ResultInterview: {
            visibleConfig: true,
            isValid: false
        },
        Competency: {
            visibleConfig: true,
            isValid: false
        },
        LeaderShip: {
            visibleConfig: true,
            isValid: false
        },
        Management: {
            visibleConfig: true,
            isValid: false
        },
        Professional: {
            visibleConfig: true,
            isValid: false
        },
        CareerObjective: {
            visibleConfig: true,
            isValid: false
        },
        HealthStatus: {
            visibleConfig: true,
            isValid: false
        },
        Strengths: {
            visibleConfig: true,
            isValid: false
        },
        Weaknesses: {
            visibleConfig: true,
            isValid: false
        },
        ResultNote: {
            visibleConfig: true,
            isValid: false
        },
        RatingAchieved: {
            visibleConfig: true,
            isValid: false
        },
        TypeSalary: {
            visibleConfig: true,
            isValid: false
        },
        ProposedSalary: {
            visibleConfig: true,
            isValid: false
        },
        CurrencyID: {
            visibleConfig: true,
            isValid: false
        },
        EnteringDate: {
            visibleConfig: true,
            isValid: false
        },
        FileAttachment: {
            visibleConfig: true,
            isValid: false
        }
    },
    fieldValid: {},
    params: null,
    isShowModal: false,
    isShowLoading: false
};

export default class HreResultInterviewAddOrEdit extends Component {
    constructor(props) {
        super(props);
        this.state = initSateDefault;
        this.refReceiver = null;
        this.listRefGetDataSave = null;
        this.isModify = false;
        this.isProcessing = false;
    }

    //#region [khởi tạo - check đăng ký hộ, lấy các dữ liệu cho control, lấy giá trị mặc đinh]

    //promise get config valid
    getConfigValid = () => {
        let { fieldConfig } = this.state;
        const tblName = 'Rec_formInterview_ResultInterview';
        const profileInfo = dataVnrStorage
            ? dataVnrStorage.currentUser
                ? dataVnrStorage.currentUser.info
                : null
            : null;

        const { E_ProfileID, E_FullName } = EnumName,
            _profile = { ID: profileInfo[E_ProfileID], ProfileName: profileInfo[E_FullName] };

        HttpService.Get(`[URI_CENTER]/api/Sys_common/GetValidateJson?listFormId=${tblName}`)
            .then((resConfig) => {
                let nextState = { Profile: _profile };
                if (resConfig) {
                    const data =
                        resConfig.Status == EnumName.E_SUCCESS && resConfig.Data && resConfig.Data[tblName]
                            ? resConfig.Data[tblName]
                            : null;
                    if (data && Object.keys(data).length > 0) {
                        const listControl = Object.keys(fieldConfig);
                        listControl.forEach((key) => {
                            if (data[key] && data[key]['hasInApp']) {
                                const { validation } = data[key];
                                fieldConfig = {
                                    ...fieldConfig,
                                    [key]: {
                                        visibleConfig: data[key] && data[key]['hidden'] == true ? false : true,
                                        isValid: validation && validation.nullable == false ? true : false
                                    }
                                };
                            }
                        });
                    }
                    nextState = {
                        ...nextState,
                        fieldConfig: fieldConfig
                    };
                }

                this.setState({ ...nextState }, () => {
                    const { params } = this.state;

                    let { record, isCreate } = params;
                    if (isCreate == true) {
                        // [CREATE] Step 3: Tạo mới
                        this.isModify = false;
                        this.initData();
                    } else {
                        // [EDIT] Step 3: Chỉnh sửa
                        this.isModify = true;
                        this.getRecordAndConfigByID(record, this.handleSetState);
                    }
                });
            })
            .catch((error) => {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            });
    };

    componentDidMount() {}

    handleSetState = () => {
        const { Profile } = this.state;

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
            }
        };

        this.setState(nextState);
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
            // Show modal
            this.onShowModal();
        });
    };

    onShowModal = () => {
        const { isRefresh } = this.state;
        this.setState({
            isRefresh: !isRefresh,
            isShowModal: true
        });
    };

    //#endregion

    //#region [lưu]
    onSave = () => {
        const { params } = this.state;
        if (this.isProcessing) return;

        if (params.record) {
            let payload = this.listRefGetDataSave.getAllData();
            if (payload !=null ) {
                this.isProcessing = true;
                this.showLoading(true);
                HttpService.Post('[URI_CENTER]/api/Rec_Interview/UpdateInterviewResult', payload).then((res) => {
                    this.isProcessing = false;
                    this.showLoading(false);

                    if ( res && res.Status == EnumName.E_SUCCESS && res.Data) {
                        this.onClose();
                        HreWaitingInterviewBusiness.checkForReLoadScreen[ScreenName.HreWaitingInterview] = true;
                        HreWaitingInterviewBusiness.checkForReLoadScreen[ScreenName.HreCompletedInterview] = true;
                        ToasterSevice.showSuccess('Hrm_Succeed', 5500);

                        const { reload } = params;
                        if (reload && typeof reload === 'function' && res.Data != null) {
                            reload(res.Data);
                        }
                    } else if (res.Message) {
                        this.ToasterSevice.showWarning(res.Message, 4000);
                    }
                });
            }
        } else {
            this.ToasterSevice.showWarning('');
        }
    };
    //#endregion

    onClose = () => {
        this.setState({
            isShowModal: false
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

    render() {
        const { isRefresh, fieldConfig, params, isShowModal } = this.state;

        return (
            <View style={styles.container}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={isShowModal} //isShowModal
                    style={{ ...CustomStyleSheet.padding(0), ...CustomStyleSheet.margin(0) }}
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
                                        ? 'HRM_PortalApp_InputResult_Edit'
                                        : 'HRM_PortalApp_InputResult_Create'
                                }
                            />
                            <TouchableOpacity onPress={() => this.onClose()}>
                                <IconCancel size={Size.iconSize} color={Colors.gray_8} />
                            </TouchableOpacity>
                        </View>

                        {this._renderHeaderLoading()}

                        <KeyboardAvoidingView
                            scrollEnabled={true}
                            style={styleComonAddOrEdit.styAvoiding}
                            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                        >
                            <ScrollView style={styles.styFlatListContainer}>
                                <HreResultInterviewComponent
                                    ref={(ref) => {
                                        this.listRefGetDataSave = ref;
                                    }}
                                    // onScrollToInputIOS={this.onScrollToInputIOS}
                                    // onDeleteItemDay={this.onDeleteItemDay}
                                    isRefresh={isRefresh}
                                    record={params?.record}
                                    isCreate={params?.isCreate}
                                    fieldConfig={fieldConfig}
                                    showLoading={this.showLoading}
                                    ToasterSevice={() => this.ToasterSeviceCallBack()}
                                />
                            </ScrollView>
                        </KeyboardAvoidingView>

                        {/* button */}
                        <View style={styles.wrapButtonHandler}>
                            <TouchableOpacity
                                style={[styles.wrapBtnRegister, styles.wrapCancel]}
                                onPress={() => this.onClose()}
                            >
                                <VnrText style={[styleSheets.lable, styles.styCancel]} i18nKey={'Cancel'} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.wrapBtnRegister, styles.wrapRegister]}
                                onPress={() => this.onSave()}
                            >
                                <VnrText
                                    style={[styleSheets.lable, styles.styRegister]}
                                    i18nKey={'HRM_PortalApp_Common_Save'}
                                />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </Modal>
            </View>
        );
    }
}

const styles = {
    ...styleComonAddOrEdit,
    ...StyleSheet.create({
        wrapCancel: {
            flex: 3,
            backgroundColor: Colors.white,
            borderRadius: Size.borderRadiusBotton,
            borderWidth: 0.5
        },
        wrapRegister: {
            flex: 7,
            backgroundColor: Colors.primary,
            marginLeft: Size.defineSpace
        },
        styInput: {
            paddingHorizontal: 0
        },
        styCancel: {
            color: Colors.gray_10
        }
    })
};
