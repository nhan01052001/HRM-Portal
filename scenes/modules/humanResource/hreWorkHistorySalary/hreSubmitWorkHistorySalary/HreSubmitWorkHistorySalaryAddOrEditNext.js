import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    Size,
    Colors,
    styleSafeAreaView,
    stylesListPickerControl,
    styleValid,
    styleButtonAddOrEdit,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import { IconPublish, IconPrev } from '../../../../../constants/Icons';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import VnrDate from '../../../../../components/VnrDate/VnrDate';
import HttpService from '../../../../../utils/HttpService';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import VnrPickerMulti from '../../../../../components/VnrPickerMulti/VnrPickerMulti';
import moment from 'moment';
import CheckBox from 'react-native-check-box';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { translate } from '../../../../../i18n/translate';
import { AlertSevice } from '../../../../../components/Alert/Alert';
//import { ConfigField } from '../../../../../assets/configProject/ConfigField';
//import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { EnumIcon } from '../../../../../assets/constant';
import DrawerServices from '../../../../../utils/DrawerServices';
// import RenderItemDataAnalysic from './RenderItemDataAnalysic';

export default class HreSubmitWorkHistorySalaryAddOrEditNext extends Component {
    constructor(props) {
        super(props);
        this.state = { isLoad: false };
    }

    componentDidMount() {
        //debugger
        const { dataConfirm } = this.props.navigation.state.params;
        this.setState({ ...dataConfirm, isLoad: true });
    }

    //lưu
    saveWorkHistorySalary = () => {
        const { objConfig } = this.props.navigation.state.params;
        const {
            ID,
            Profile,
            ResignReasonID,
            TypeOfStopID,
            OtherReason,
            RequestDate,
            DateQuitSubmit,
            LastWorkingDay,
            DateStop,
            NumberDayQuitJob,
            Note,
            AnnualLeave,
            UserApproveID,
            UserApproveID2,
            UserApproveID3,
            UserApproveID4,
            DateQuitApprove,
            DateQuitSign,
            PaymentDay,
            SocialInsDeliveryDate,
            DecisionNo,
            IsBlackList,
            ReasonBackList,
            DateHire,
            DeptPath,
            ContractTypeName,
            DateStart,
            DateEnd,
            StoredDocumentCodes,
            DateEndUnion,
            DateChildEnough1Year
        } = this.state;

        let params = {
            ID,
            Status: 'E_WAITAPPROVE',
            workHistorySalaryID: objConfig.workHistorySalaryID,
            ContractTypeID: objConfig.ContractTypeID,
            UpdateRequiredDocumentWorkHistorySalary: objConfig.UpdateRequiredDocumentWorkHistorySalary,
            OtherReason: OtherReason.value,
            DecisionNo: DecisionNo.value,
            DeptPath: DeptPath.value,
            ContractTypeName: ContractTypeName.value,
            NumberDayQuitJob: NumberDayQuitJob.value,
            AnnualLeave: AnnualLeave.value,
            IsBlackList: IsBlackList.value,
            //IsCheckAnnualLeave:
            ReasonBackList: ReasonBackList.value,
            Note: Note.value,
            RequestDate: RequestDate.value ? moment(RequestDate.value).format('YYYY-MM-DD HH:mm:ss') : null,
            DateQuitSubmit: DateQuitSubmit.value ? moment(DateQuitSubmit.value).format('YYYY-MM-DD HH:mm:ss') : null,
            LastWorkingDay: LastWorkingDay.value ? moment(LastWorkingDay.value).format('YYYY-MM-DD HH:mm:ss') : null,
            DateStop: DateStop.value ? moment(DateStop.value).format('YYYY-MM-DD HH:mm:ss') : null,
            DateQuitApprove: DateQuitApprove.value ? moment(DateQuitApprove.value).format('YYYY-MM-DD HH:mm:ss') : null,
            DateQuitSign: DateQuitSign.value ? moment(DateQuitSign.value).format('YYYY-MM-DD HH:mm:ss') : null,
            PaymentDay: PaymentDay.value ? moment(PaymentDay.value).format('YYYY-MM-DD HH:mm:ss') : null,
            SocialInsDeliveryDate: SocialInsDeliveryDate.value
                ? moment(SocialInsDeliveryDate.value).format('YYYY-MM-DD HH:mm:ss')
                : null,
            DateHire: DateHire.value ? moment(DateHire.value).format('YYYY-MM-DD HH:mm:ss') : null,
            DateStart: DateStart.value ? moment(DateStart.value).format('YYYY-MM-DD HH:mm:ss') : null,
            DateEnd: DateEnd.value ? moment(DateEnd.value).format('YYYY-MM-DD HH:mm:ss') : null,
            DateEndUnion: DateEndUnion.value ? moment(DateEndUnion.value).format('YYYY-MM-DD HH:mm:ss') : null,
            DateChildEnough1Year: DateChildEnough1Year.value
                ? moment(DateChildEnough1Year.value).format('YYYY-MM-DD HH:mm:ss')
                : null,
            TypeOfStopID: TypeOfStopID.value ? TypeOfStopID.value.ID : null,
            ResignReasonID: ResignReasonID.value ? ResignReasonID.value.ID : null,
            StoredDocumentCodes: StoredDocumentCodes.value
                ? StoredDocumentCodes.value.map((item) => item.Code).join()
                : null,
            UserApproveID: UserApproveID.value ? UserApproveID.value.ID : null,
            UserApproveID2: UserApproveID2.value ? UserApproveID2.value.ID : null,
            UserApproveID3: UserApproveID3.value ? UserApproveID3.value.ID : null,
            UserApproveID4: UserApproveID4.value ? UserApproveID4.value.ID : null,
            IsPortal: true,
            UserSubmit: Profile.ID,
            TypeWorkHistorySalary: 'E_Actual',
            StopWorkType: 'E_STOP',
            TableValidate: 'Hre_StopWorking',
            TypeRegister: 'ProfileRegisterStop',
            ProfileID: Profile.ID,
            Attachment: ''
        };
        var lstModel = { Modeldetail: [], Model: params };

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Hre_GetData/SaveStopWorking', lstModel).then((data) => {
            VnrLoadingSevices.hide();
            try {
                if (
                    data.ActionStatus == 'Thao tác thành công' ||
                    data.ActionStatus == 'Cập nhật thành công' ||
                    data.ActionStatus == 'Success'
                ) {
                    ToasterSevice.showSuccess('Hrm_Succeed', 4000);

                    DrawerServices.navigate('HreSubmitWorkHistorySalary');

                    const { reload } = this.props.navigation.state.params;

                    if (reload && typeof reload == 'function') {
                        reload();
                    }
                } else if (data.ActionStatus == 'HRM_HR_StopWorking_DoYouWantToUpdateWorkHistory') {
                    AlertSevice.alert({
                        title: translate('Hrm_Notification'),
                        iconType: EnumIcon.E_INFO,
                        message: translate('HRM_HR_StopWorking_DoYouWantToUpdateWorkHistory'),
                        onCancel: () => {},
                        onConfirm: () => {
                            VnrLoadingSevices.show();
                            HttpService.Post('[URI_HR]/Hre_GetData/SaveStopWorking', lstModel).then((data) => {
                                VnrLoadingSevices.hide();

                                try {
                                    if (
                                        data.ActionStatus == 'Thao tác thành công' ||
                                        data.ActionStatus == 'Cập nhật thành công' ||
                                        data.ActionStatus == 'Success'
                                    ) {
                                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);

                                        DrawerServices.navigate('HreSubmitWorkHistorySalary');

                                        const { reload } = this.props.navigation.state.params;

                                        if (reload && typeof reload == 'function') {
                                            reload();
                                        }

                                        //confirm xuất quyết định
                                    } else {
                                        ToasterSevice.showWarning(data.ActionStatus);
                                    }
                                } catch (error) {
                                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                                }
                            });
                        }
                    });
                } else {
                    ToasterSevice.showWarning(data.ActionStatus);
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    render() {
        const {
            DateQuitApprove,
            DateQuitSign,
            PaymentDay,
            SocialInsDeliveryDate,
            DecisionNo,
            IsBlackList,
            ReasonBackList,
            DateHire,
            DeptPath,
            ContractTypeName,
            DateStart,
            DateEnd,
            StoredDocumentCodes,
            DateEndUnion,
            DateChildEnough1Year,
            fieldValid,
            isLoad
        } = this.state;

        const {
            textLableInfo,
            formDate_To_From,
            controlDate_To,
            controlDate_from,
            contentViewControl,
            viewLable,
            viewControl,
            viewInputMultiline
        } = stylesListPickerControl;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    {isLoad && (
                        <KeyboardAwareScrollView
                            keyboardShouldPersistTaps={'handled'}
                            contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                        >
                            {/* Ngày được duyệt -  DateQuitApprove*/}
                            {DateQuitApprove.visibleConfig && DateQuitApprove.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_HR_StopWorking_DateQuitApprove'}
                                        />

                                        {fieldValid.DateQuitApprove && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrDate
                                            response={'string'}
                                            format={'DD/MM/YYYY'}
                                            value={DateQuitApprove.value}
                                            disable={DateQuitApprove.disable}
                                            refresh={DateQuitApprove.refresh}
                                            type={'date'}
                                            onFinish={(value) => {
                                                this.setState({
                                                    DateQuitApprove: {
                                                        ...DateQuitApprove,
                                                        value: value
                                                    }
                                                });
                                            }}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Ngày ký quyết định -  DateQuitSign*/}
                            {DateQuitSign.visibleConfig && DateQuitSign.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_HR_StopWorking_DateQuitSign'}
                                        />

                                        {fieldValid.DateQuitSign && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrDate
                                            response={'string'}
                                            format={'DD/MM/YYYY'}
                                            value={DateQuitSign.value}
                                            disable={DateQuitSign.disable}
                                            refresh={DateQuitSign.refresh}
                                            type={'date'}
                                            onFinish={(value) => {
                                                this.setState({
                                                    DateQuitSign: {
                                                        ...DateQuitSign,
                                                        value: value
                                                    }
                                                });
                                            }}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Ngày thanh toán -  PaymentDay*/}
                            {PaymentDay.visibleConfig && PaymentDay.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_HR_StopWorking_PaymentDay'}
                                        />

                                        {fieldValid.PaymentDay && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrDate
                                            response={'string'}
                                            format={'DD/MM/YYYY'}
                                            value={PaymentDay.value}
                                            disable={PaymentDay.disable}
                                            refresh={PaymentDay.refresh}
                                            type={'date'}
                                            onFinish={(value) => {
                                                this.setState({
                                                    PaymentDay: {
                                                        ...PaymentDay,
                                                        value: value
                                                    }
                                                });
                                            }}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Ngày trả sổ bảo hiểm -  SocialInsDeliveryDate*/}
                            {SocialInsDeliveryDate.visibleConfig && SocialInsDeliveryDate.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_HR_Profile_SocialInsDeliveryDate'}
                                        />

                                        {fieldValid.SocialInsDeliveryDate && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrDate
                                            response={'string'}
                                            format={'DD/MM/YYYY'}
                                            value={SocialInsDeliveryDate.value}
                                            disable={SocialInsDeliveryDate.disable}
                                            refresh={SocialInsDeliveryDate.refresh}
                                            type={'date'}
                                            onFinish={(value) => {
                                                this.setState({
                                                    SocialInsDeliveryDate: {
                                                        ...SocialInsDeliveryDate,
                                                        value: value
                                                    }
                                                });
                                            }}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Số quyết định -  DecisionNo*/}
                            {DecisionNo.visibleConfig && DecisionNo.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_HR_StopWorking_DecisionNo'}
                                        />

                                        {fieldValid.DecisionNo && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={DecisionNo.disable}
                                            refresh={DecisionNo.refresh}
                                            value={DecisionNo.value}
                                            onChangeText={(text) =>
                                                this.setState({
                                                    DecisionNo: {
                                                        ...DecisionNo,
                                                        value: text
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* DS đen -  IsBlackList*/}
                            {IsBlackList.visibleConfig && IsBlackList.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'IsBlackList'} />
                                    </View>
                                    <View style={viewControl}>
                                        <CheckBox
                                            checkBoxColor={Colors.black}
                                            checkedCheckBoxColor={Colors.primary}
                                            onClick={() => {
                                                this.setState({
                                                    IsBlackList: {
                                                        ...IsBlackList,
                                                        value: !IsBlackList.value
                                                    }
                                                });
                                            }}
                                            isChecked={IsBlackList.value}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Lý do vào DS đen -  ReasonBackList*/}
                            {ReasonBackList.visibleConfig && ReasonBackList.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_HR_Profile_ReasonBackList'}
                                        />
                                        {fieldValid.ReasonBackList && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={ReasonBackList.disable}
                                            refresh={ReasonBackList.refresh}
                                            value={ReasonBackList.value}
                                            style={[styleSheets.text, viewInputMultiline]}
                                            multiline={true}
                                            onChangeText={(text) =>
                                                this.setState({
                                                    ReasonBackList: {
                                                        ...ReasonBackList,
                                                        value: text
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Ngày vào làm -  DateHire*/}
                            {DateHire.visibleConfig && DateHire.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_HR_StopWorking_DateHire'}
                                        />

                                        {fieldValid.DateHire && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrDate
                                            response={'string'}
                                            format={'DD/MM/YYYY'}
                                            value={DateHire.value}
                                            disable={DateHire.disable}
                                            refresh={DateHire.refresh}
                                            type={'date'}
                                            onFinish={(value) => {
                                                this.setState({
                                                    DateHire: {
                                                        ...DateHire,
                                                        value: value
                                                    }
                                                });
                                            }}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Mã chuỗi phòng ban -  DeptPath*/}
                            {DeptPath.visibleConfig && DeptPath.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_HR_StopWorking_DeptPath'}
                                        />
                                        {fieldValid.DeptPath && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={DeptPath.disable}
                                            refresh={DeptPath.refresh}
                                            value={DeptPath.value}
                                            onChangeText={(text) =>
                                                this.setState({
                                                    DeptPath: {
                                                        ...DeptPath,
                                                        value: text
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Loại hợp đồng -  ContractTypeName*/}
                            {ContractTypeName.visibleConfig && ContractTypeName.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_HR_StopWorking_ContractTypeID'}
                                        />
                                        {fieldValid.ContractTypeName && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={ContractTypeName.disable}
                                            refresh={ContractTypeName.refresh}
                                            value={ContractTypeName.value}
                                            onChangeText={(text) =>
                                                this.setState({
                                                    ContractTypeName: {
                                                        ...ContractTypeName,
                                                        value: text
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Thời hạn - DateStart, DateEnd */}
                            {DateStart.visibleConfig && DateStart.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Category_ContractType_ValueTime'}
                                        />

                                        {/* valid DateStart */}
                                        {fieldValid.DateStart && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <View style={formDate_To_From}>
                                            <View style={controlDate_from}>
                                                <VnrDate
                                                    response={'string'}
                                                    format={'DD/MM/YYYY'}
                                                    value={DateStart.value}
                                                    refresh={DateStart.refresh}
                                                    type={'date'}
                                                    onFinish={(value) => {
                                                        this.setState({
                                                            DateStart: {
                                                                ...DateStart,
                                                                value: value
                                                            }
                                                        });
                                                    }}
                                                />
                                            </View>
                                            <View style={controlDate_To}>
                                                <VnrDate
                                                    disable={DateEnd.disable}
                                                    response={'string'}
                                                    format={'DD/MM/YYYY'}
                                                    value={DateEnd.value}
                                                    refresh={DateEnd.refresh}
                                                    type={'date'}
                                                    onFinish={(value) => {
                                                        this.setState({
                                                            DateEnd: {
                                                                ...DateEnd,
                                                                value: value
                                                            }
                                                        });
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}

                            {/* Hồ sơ yêu cầu -  StoredDocumentCodes*/}
                            {StoredDocumentCodes.visibleConfig && StoredDocumentCodes.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'lblform_StopWorkingInfo_StoredDocumentCodes'}
                                        />
                                        {fieldValid.StoredDocumentCodes && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPickerMulti
                                            dataLocal={StoredDocumentCodes.data}
                                            refresh={StoredDocumentCodes.refresh}
                                            textField="ReqDocumentName"
                                            valueField="Code"
                                            filter={true}
                                            value={StoredDocumentCodes.value}
                                            filterServer={false}
                                            //filterParams="text"
                                            disable={StoredDocumentCodes.disable}
                                            // eslint-disable-next-line no-console
                                            onFinish={(item) => console.log(item)}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Ngày kết thúc công đoàn -  DateEndUnion*/}
                            {DateEndUnion.visibleConfig && DateEndUnion.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_HR_StopWorking_DateEndUnion'}
                                        />

                                        {fieldValid.DateEndUnion && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrDate
                                            response={'string'}
                                            format={'DD/MM/YYYY'}
                                            value={DateEndUnion.value}
                                            disable={DateEndUnion.disable}
                                            refresh={DateEndUnion.refresh}
                                            type={'date'}
                                            onFinish={(value) => {
                                                this.setState({
                                                    DateEndUnion: {
                                                        ...DateEndUnion,
                                                        value: value
                                                    }
                                                });
                                            }}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Ngày con đủ 1 tuổi -  DateChildEnough1Year*/}
                            {DateChildEnough1Year.visible && DateChildEnough1Year.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Medical_Prenatal_DateChildEnough1Year'}
                                        />

                                        {fieldValid.DateChildEnough1Year && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrDate
                                            response={'string'}
                                            format={'DD/MM/YYYY'}
                                            value={DateChildEnough1Year.value}
                                            disable={DateChildEnough1Year.disable}
                                            refresh={DateChildEnough1Year.refresh}
                                            type={'date'}
                                            onFinish={(value) => {
                                                this.setState({
                                                    DateChildEnough1Year: {
                                                        ...DateChildEnough1Year,
                                                        value: value
                                                    }
                                                });
                                            }}
                                        />
                                    </View>
                                </View>
                            )}
                        </KeyboardAwareScrollView>
                    )}
                    {/* bottom button close, confirm */}
                    <View style={styleButtonAddOrEdit.groupButton}>
                        <TouchableOpacity
                            onPress={() => DrawerServices.goBack()}
                            style={[styleButtonAddOrEdit.btnClose]}
                        >
                            <IconPrev size={Size.iconSize} color={Colors.black} />
                            <VnrText
                                style={[
                                    styleSheets.lable,
                                    styleButtonAddOrEdit.groupButton__text,
                                    { color: Colors.greySecondary }
                                ]}
                                i18nKey={'HRM_Common_GoBack'}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => this.saveWorkHistorySalary()}
                            style={styleButtonAddOrEdit.groupButton__button_save}
                        >
                            <IconPublish size={Size.iconSize} color={Colors.white} />
                            <VnrText
                                style={[styleSheets.lable, styleButtonAddOrEdit.groupButton__text]}
                                i18nKey={'HRM_Common_Save'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}
