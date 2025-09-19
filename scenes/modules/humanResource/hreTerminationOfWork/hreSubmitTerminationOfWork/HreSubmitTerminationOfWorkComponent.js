import React from 'react';
import { View, Platform, Text } from 'react-native';
import { styleSheets, stylesVnrPickerV3 } from '../../../../../constants/styleConfig';
import VnrText from '../../../../../components/VnrText/VnrText';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrDate from '../../../../../componentsV3/VnrDate/VnrDate';
import VnrTextInput from '../../../../../componentsV3/VnrTextInput/VnrTextInput';
import VnrAttachFile from '../../../../../componentsV3/VnrAttachFile/VnrAttachFile';
import VnrPickerQuickly from '../../../../../componentsV3/VnrPickerQuickly/VnrPickerQuickly';
import HttpService from '../../../../../utils/HttpService';
import { EnumName } from '../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import moment from 'moment';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
import styleComonAddOrEdit from '../../../../../constants/styleComonAddOrEdit';
import { translate } from '../../../../../i18n/translate';

const initSateDefault = {
    RequestDate: {
        value: null,
        lable: 'HRM_HR_StopWorking_RequestDate',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    DecisionNo: {
        value: null,
        lable: 'HRM_HR_StopWorking_DecisionNo',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    TypeOfStopID: {
        value: null,
        lable: 'HRM_HR_StopWorking_TypeOfStop',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    ResignReasonID: {
        value: null,
        lable: 'HRM_Category_ResignReason_ReasonName',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    OtherReason: {
        value: null,
        lable: 'HRM_HR_StopWorking_OtherReason',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    LastWorkingDay: {
        value: null,
        lable: 'HRM_HR_Profile_LastWorkingDate',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    DateStop: {
        value: null,
        lable: 'HRM_HR_Profile_DateStop',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    Note: {
        value: '',
        lable: 'Comment',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    Attachment: {
        lable: 'HRM_PortalApp_TSLRegister_Attachment',
        visible: true,
        visibleConfig: true,
        disable: false,
        refresh: false,
        value: null
    },
    AfterDataStopWorking: {
        value: null,
        visible: false
    },
    isError: false
};

class HreSubmitTerminationOfWorkComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initSateDefault,
            Profile: {
                ID: null,
                ProfileName: '',
                disable: true
            },
            // isConfigMultiTimeInOut: true,
            isRefreshState: false
        };
        this.layoutHeightItem = null;
    }

    // Những trường hợp được phép render lại
    shouldComponentUpdate(nextProps, nextState) {
        if (
            nextProps.isRefresh !== this.props.isRefresh ||
            nextProps.isShowDelete !== this.props.isShowDelete ||
            // thay đổi state value thì mới render lại
            nextState.isRefreshState !== this.state.isRefreshState ||
            // thay đổi state value thì mới render lại

            nextState.RequestDate.value !== this.state.RequestDate.value ||
            nextState.DecisionNo.value !== this.state.DecisionNo.value ||
            nextState.TypeOfStopID.value !== this.state.TypeOfStopID.value ||
            nextState.ResignReasonID.value !== this.state.ResignReasonID.value ||
            nextState.OtherReason.value !== this.state.OtherReason.value ||
            nextState.DateStop.value !== this.state.DateStop.value ||
            nextState.Note.value !== this.state.Note.value ||
            nextState.OtherReason.value !== this.state.OtherReason.value ||
            nextState.LastWorkingDay.value !== this.state.LastWorkingDay.value ||
            nextState.Attachment.value !== this.state.Attachment.value ||
            nextState.AfterDataStopWorking.value !== this.state.AfterDataStopWorking.value ||
            nextState.isError !== this.state.isError
        ) {
            return true;
        } else {
            return false;
        }
    }

    checkHaveDoneValueField = (isShowWarn) => {
        const { setDisableSave, fieldConfig } = this.props;
        const {
            RequestDate,
            TypeOfStopID,
            ResignReasonID,
            DateStop,
            LastWorkingDay,
            Note,
            Attachment,
            OtherReason,
            AfterDataStopWorking
        } = this.state;

        if ((Note && Note.value?.length > 500) || (OtherReason && OtherReason.value?.length > 500)) {
            if (isShowWarn) {
                let keyTras = translate('HRM_Sytem_MaxLength500');
                if (Note.value?.length > 500)
                    this.props.ToasterSevice().showWarning(keyTras.replace('[E_NAME]', translate(Note.lable)));
                else this.props.ToasterSevice().showWarning(keyTras.replace('[E_NAME]', translate(OtherReason.lable)));
            } else setDisableSave && setDisableSave(true);
            return false;
        }

        if (
            (fieldConfig?.RequestDate?.isValid && !RequestDate.value) ||
            (fieldConfig?.DateStop?.isValid && !DateStop.value) ||
            (fieldConfig?.TypeOfStopID?.isValid && !TypeOfStopID.value) ||
            (fieldConfig?.ResignReasonID?.isValid && !ResignReasonID.value) ||
            (fieldConfig?.LastWorkingDay?.isValid && !LastWorkingDay.value) ||
            (fieldConfig?.OtherReason?.isValid && !OtherReason.value) ||
            (fieldConfig?.Note?.isValid && !Note.value) ||
            (fieldConfig?.Attachment?.isValid && !Attachment.value) ||
            (AfterDataStopWorking.value && AfterDataStopWorking.value.Status == 'E_BLOCK')
        ) {
            if (isShowWarn) this.props.ToasterSevice().showWarning('HRM_PortalApp_InputValue_Please');
            else setDisableSave && setDisableSave(true);
            return false;
        } else {
            setDisableSave && setDisableSave(false);
            return true;
        }
    };

    componentDidMount() {
        this.initState();
    }

    componentWillUnmount() {}

    unduData = () => {
        this.initState();
    };

    showLoading = (isShow) => {
        const { showLoading } = this.props;
        showLoading && showLoading(isShow);
    };

    // Step 1: Khởi tạo dữ liệu
    initState = () => {
        const { record } = this.props,
            { Profile, isRefreshState } = this.state;
        const profileInfo = dataVnrStorage
            ? dataVnrStorage.currentUser
                ? dataVnrStorage.currentUser.info
                : null
            : null;

        const { E_ProfileID, E_FullName } = EnumName,
            _profile = { ID: profileInfo[E_ProfileID], ProfileName: profileInfo[E_FullName] };

        const {
            RequestDate,
            TypeOfStopID,
            ResignReasonID,
            DateStop,
            DecisionNo,
            LastWorkingDay,
            Note,
            Attachment,
            OtherReason
        } = this.state;

        if (record) {
            //Modify
            let nextState = {
                isRefreshState: !isRefreshState,
                Profile: {
                    ...Profile,
                    ..._profile
                },
                RequestDate: {
                    ...RequestDate,
                    value: record.RequestDate ? record.RequestDate : null,
                    lable: 'HRM_HR_StopWorking_RequestDate',
                    disable: false,
                    refresh: !RequestDate.refresh,
                    visible: true
                },
                DecisionNo: {
                    ...DecisionNo,
                    value: record.DecisionNo ? record.DecisionNo : null,
                    lable: 'HRM_HR_StopWorking_DecisionNo',
                    disable: false,
                    refresh: !DecisionNo.refresh,
                    visible: true
                },
                TypeOfStopID: {
                    ...TypeOfStopID,
                    value: record.TypeOfStopID
                        ? { NameEntityName: record.TypeOfStopName, ID: record.TypeOfStopID }
                        : null,
                    lable: 'HRM_HR_StopWorking_TypeOfStop',
                    disable: false,
                    refresh: !TypeOfStopID.refresh,
                    visible: true
                },
                ResignReasonID: {
                    ...ResignReasonID,
                    value: record.ResignReasonID
                        ? { ResignReasonName: record.ResignReasonName, ID: record.ResignReasonID }
                        : null,
                    lable: 'HRM_Category_ResignReason_ReasonName',
                    disable: false,
                    refresh: !ResignReasonID.refresh,
                    visible: true
                },
                OtherReason: {
                    ...OtherReason,
                    value: record.OtherReason ? record.OtherReason : null,
                    lable: 'HRM_HR_StopWorking_OtherReason',
                    disable: false,
                    refresh: !OtherReason.refresh,
                    visible: true
                },
                LastWorkingDay: {
                    ...LastWorkingDay,
                    value: record.LastWorkingDay ? record.LastWorkingDay : null,
                    lable: 'HRM_HR_Profile_LastWorkingDate',
                    disable: false,
                    refresh: !LastWorkingDay.refresh,
                    visible: true
                },
                DateStop: {
                    ...DateStop,
                    value: record.DateStop ? record.DateStop : null,
                    lable: 'HRM_HR_Profile_DateStop',
                    disable: false,
                    refresh: !DateStop.refresh,
                    visible: true
                },
                Note: {
                    ...Note,
                    value: record.Note ? record.Note : '',
                    lable: 'Comment',
                    disable: false,
                    refresh: !Note.refresh,
                    visible: true
                }
            };

            // Value Acttachment
            if (record.Attachment) {
                let valFile = ManageFileSevice.setFileAttachApp(record.Attachment);

                nextState = {
                    ...nextState,
                    Attachment: {
                        ...Attachment,
                        disable: false,
                        value: valFile && valFile.length > 0 ? valFile : null,
                        refresh: !Attachment.refresh
                    }
                };
            } else {
                nextState = {
                    ...nextState,
                    Attachment: {
                        ...Attachment,
                        disable: false,
                        value: null,
                        refresh: !Attachment.refresh
                    }
                };
            }

            this.setState(nextState);
        } else {
            this.setState({
                ...initSateDefault,
                Profile: {
                    ...Profile,
                    ..._profile
                },
                RequestDate: {
                    ...RequestDate,
                    value: new Date(),
                    disable: false,
                    refresh: !RequestDate.refresh
                },
                isRefreshState: !isRefreshState
            });
        }
    };

    getAllData = () => {
        const {
                Profile,
                RequestDate,
                TypeOfStopID,
                ResignReasonID,
                DateStop,
                LastWorkingDay,
                Note,
                Attachment,
                OtherReason
            } = this.state,
            { levelApprove } = this.props;

        if (this.checkHaveDoneValueField(true) == true)
            return {
                ProfileID: Profile.ID,
                ListProfileID: [Profile.ID],
                RequestDate: RequestDate.value ? Vnr_Function.formatDateAPI(RequestDate.value) : null,
                DateStop: DateStop.value ? Vnr_Function.formatDateAPI(DateStop.value) : null,
                LastWorkingDay: LastWorkingDay.value ? Vnr_Function.formatDateAPI(LastWorkingDay.value) : null,
                TypeOfStopID: TypeOfStopID.value ? TypeOfStopID.value.ID : null,
                ResignReasonID: ResignReasonID.value ? ResignReasonID.value.ID : null,
                Attachment: Attachment.value ? Attachment.value.map((item) => item.fileName).join(',') : null,
                OtherReason: OtherReason.value ? OtherReason.value : null,
                Note: Note.value ? Note.value : null,
                LevelApproved: levelApprove
            };
        else this.setState({ isError: true });
    };

    onChangeLastWorkingDay = (item) => {
        const { LastWorkingDay, AfterDataStopWorking } = this.state;
        let nextState = {
            LastWorkingDay: {
                ...LastWorkingDay,
                value: item,
                refresh: !LastWorkingDay.refresh
            }
        };

        if (!item) {
            nextState = {
                ...nextState,
                AfterDataStopWorking: {
                    ...AfterDataStopWorking,
                    value: null,
                    visible: false
                }
            };
        }

        this.setState(nextState, () => {
            this.getHighSupervisor();
            this.alearDataStop();
        });
    };

    onChangeDateStop = (value) => {
        const { DateStop } = this.state;
        this.setState(
            {
                DateStop: {
                    ...DateStop,
                    value: value,
                    refresh: !DateStop.refresh
                }
            },
            () => {
                if (value) this.onChangeLastWorkingDay(moment(value).add(1, 'days'));
            }
        );
    };

    alearDataStop = () => {
        const { AfterDataStopWorking, LastWorkingDay, DateStop, Profile } = this.state;
        if (LastWorkingDay.value || DateStop.value) {
            this.showLoading(true);
            const dataBody = {
                LastWorkingDay: LastWorkingDay.value ? Vnr_Function.formatDateAPI(LastWorkingDay.value) : null,
                DateStop: DateStop.value ? Vnr_Function.formatDateAPI(DateStop.value) : null,
                UserSubmit: Profile.ID,
                ProfileID: Profile.ID
            };

            HttpService.Post('[URI_CENTER]/api/Hre_StopWorking/AlearDataStopWorking', dataBody).then((res) => {
                this.showLoading(false);
                if (res && res.Status == EnumName.E_SUCCESS && res.Data) {
                    this.setState({
                        AfterDataStopWorking: {
                            ...AfterDataStopWorking,
                            value: res.Data,
                            visible: true
                        }
                    });
                } else {
                    this.setState({
                        AfterDataStopWorking: {
                            ...AfterDataStopWorking,
                            value: null,
                            visible: false
                        }
                    });
                }
            });
        }
    };

    getHighSupervisor = () => {
        const { getHighSupervisor } = this.props;
        const { RequestDate, TypeOfStopID, ResignReasonID, DateStop, LastWorkingDay } = this.state;

        const params = {
            RequestDate: RequestDate.value ? Vnr_Function.formatDateAPI(RequestDate.value) : null,
            DateStop: DateStop.value ? Vnr_Function.formatDateAPI(DateStop.value) : null,
            LastWorkingDay: LastWorkingDay.value ? Vnr_Function.formatDateAPI(LastWorkingDay.value) : null,
            TypeOfStopID: TypeOfStopID.value ? TypeOfStopID.value.ID : null,
            ResignReasonID: ResignReasonID.value ? ResignReasonID.value.ID : null
        };

        getHighSupervisor && getHighSupervisor(params);
    };

    render() {
        const {
            RequestDate,
            TypeOfStopID,
            ResignReasonID,
            DateStop,
            DecisionNo,
            LastWorkingDay,
            Note,
            Attachment,
            isError,
            AfterDataStopWorking,
            OtherReason
        } = this.state;

        const { fieldConfig, onScrollToInputIOS, indexDay } = this.props,
            { viewInputMultiline } = stylesVnrPickerV3;

        this.checkHaveDoneValueField(false);
        return (
            <View
                style={styles.wrapItem}
                onLayout={(event) => {
                    const layout = event.nativeEvent.layout;
                    this.layoutHeightItem = layout.height;
                }}
            >
                {/* Thời gian */}
                <View style={styles.flRowSpaceBetween}>
                    <VnrText
                        style={[styleSheets.lable, styles.styLableGp]}
                        i18nKey={'HRM_Detail_Process_Info_Common'}
                    />
                </View>

                {/* Ngày Nộp đơn */}
                <VnrDate
                    fieldValid={fieldConfig?.RequestDate?.isValid}
                    isCheckEmpty={fieldConfig?.RequestDate?.isValid && isError && !RequestDate.value ? true : false}
                    refresh={RequestDate.refresh}
                    response={'string'}
                    format={'DD/MM/YYYY'}
                    type={'date'}
                    value={RequestDate.value}
                    lable={RequestDate.lable}
                    placeHolder={'HRM_PortalApp_TSLRegister_Date'}
                    disable={RequestDate.disable}
                    onFinish={(value) =>
                        this.setState(
                            {
                                RequestDate: {
                                    ...RequestDate,
                                    value: value,
                                    refresh: !RequestDate.refresh
                                }
                            },
                            () => {
                                this.getHighSupervisor();
                                //this.checkHaveDoneValueField(false);
                            }
                        )
                    }
                />

                {/* Số quyết định */}
                {DecisionNo.visible && fieldConfig?.DecisionNo.visibleConfig && (
                    <VnrTextInput
                        isCheckEmpty={fieldConfig?.DecisionNo?.isValid && isError && !DecisionNo.value ? true : false}
                        fieldValid={fieldConfig?.DecisionNo?.isValid}
                        disable={fieldConfig?.DecisionNo?.disable}
                        lable={DecisionNo.lable}
                        value={DecisionNo.value}
                        isTextRow={true}
                        placeHolder={'HRM_PortalApp_TerminationOfWork_AutoCode'}
                        onFocus={() => {
                            Platform.OS == 'ios' && onScrollToInputIOS(indexDay + 1, this.layoutHeightItem);
                        }}
                        onChangeText={(text) => {
                            this.setState(
                                {
                                    DecisionNo: {
                                        ...DecisionNo,
                                        value: text,
                                        refresh: !DecisionNo.refresh
                                    }
                                },
                                () => {
                                    // this.checkHaveDoneValueField(false);
                                }
                            );
                        }}
                        refresh={DecisionNo.refresh}
                    />
                )}

                {/* Loại nghỉ việc */}
                {TypeOfStopID.visible && fieldConfig?.TypeOfStopID.visibleConfig && (
                    <VnrPickerQuickly
                        fieldValid={fieldConfig?.TypeOfStopID?.isValid}
                        isCheckEmpty={
                            fieldConfig?.TypeOfStopID?.isValid && isError && !TypeOfStopID.value ? true : false
                        }
                        refresh={TypeOfStopID.refresh}
                        api={{
                            urlApi: '[URI_CENTER]/api/Cat_GetData/GetMultiTypeOfStop',
                            type: 'E_GET'
                        }}
                        value={TypeOfStopID.value}
                        textField="NameEntityName"
                        valueField="ID"
                        filter={true}
                        filterServer={true}
                        filterParams="text"
                        autoFilter="true"
                        disable={TypeOfStopID.disable}
                        lable={TypeOfStopID.lable}
                        onFinish={(item) => {
                            this.setState(
                                {
                                    TypeOfStopID: {
                                        ...TypeOfStopID,
                                        value: item,
                                        refresh: !TypeOfStopID.refresh
                                    }
                                },
                                () => {
                                    // this.checkHaveDoneValueField(false);
                                }
                            );
                        }}
                    />
                )}

                {/* Lý do nghỉ việc */}
                {ResignReasonID.visible && fieldConfig?.ResignReasonID.visibleConfig && (
                    <VnrPickerQuickly
                        fieldValid={fieldConfig?.ResignReasonID?.isValid}
                        isCheckEmpty={
                            fieldConfig?.ResignReasonID?.isValid && isError && !ResignReasonID.value ? true : false
                        }
                        refresh={ResignReasonID.refresh}
                        api={{
                            urlApi: '[URI_CENTER]/api/Cat_GetData/GetMultiResignReason',
                            type: 'E_GET'
                        }}
                        value={ResignReasonID.value}
                        textField="ResignReasonName"
                        valueField="ID"
                        filter={true}
                        filterServer={true}
                        filterParams="text"
                        autoFilter="true"
                        disable={ResignReasonID.disable}
                        lable={ResignReasonID.lable}
                        onFinish={(item) => {
                            this.setState(
                                {
                                    ResignReasonID: {
                                        ...ResignReasonID,
                                        value: item,
                                        refresh: !ResignReasonID.refresh
                                    }
                                },
                                () => {
                                    //this.checkHaveDoneValueField(false);
                                }
                            );
                        }}
                    />
                )}

                {DateStop.visible && fieldConfig?.DateStop.visibleConfig && (
                    <VnrDate
                        fieldValid={fieldConfig?.DateStop?.isValid}
                        isCheckEmpty={fieldConfig?.DateStop?.isValid && isError && !DateStop.value ? true : false}
                        refresh={DateStop.refresh}
                        response={'string'}
                        format={'DD/MM/YYYY'}
                        type={'date'}
                        value={DateStop.value}
                        lable={DateStop.lable}
                        placeHolder={'HRM_PortalApp_TSLRegister_Date'}
                        onFinish={(item) => this.onChangeDateStop(item)}
                    />
                )}

                {LastWorkingDay.visible && fieldConfig?.LastWorkingDay.visibleConfig && (
                    <VnrDate
                        fieldValid={fieldConfig?.LastWorkingDay?.isValid}
                        isCheckEmpty={
                            fieldConfig?.LastWorkingDay?.isValid && isError && !LastWorkingDay.value ? true : false
                        }
                        refresh={LastWorkingDay.refresh}
                        response={'string'}
                        format={'DD/MM/YYYY'}
                        type={'date'}
                        value={LastWorkingDay.value}
                        lable={LastWorkingDay.lable}
                        placeHolder={'HRM_PortalApp_TSLRegister_Date'}
                        onFinish={(item) => this.onChangeLastWorkingDay(item)}
                    />
                )}

                {AfterDataStopWorking.visible &&
                    AfterDataStopWorking.value &&
                    AfterDataStopWorking.value.Status == 'E_WARNING' &&
                    AfterDataStopWorking.value.ContentApp && (
                    <View style={styles.styViewLeaveDayCount}>
                        <Text style={[styleSheets.lable, styles.styViewLeaveDayCountLable]}>
                            {AfterDataStopWorking.value.ContentApp ? AfterDataStopWorking.value.ContentApp : ''}
                        </Text>
                    </View>
                )}

                {AfterDataStopWorking.visible &&
                    AfterDataStopWorking.value &&
                    AfterDataStopWorking.value.Status == 'E_BLOCK' &&
                    AfterDataStopWorking.value.ContentApp && (
                    <View style={styles.styViewError}>
                        <Text style={[styleSheets.textItalic, styles.styViewLeaveDayCountLable]}>
                            {AfterDataStopWorking.value.ContentApp ? AfterDataStopWorking.value.ContentApp : ''}
                        </Text>
                    </View>
                )}

                {/* Lý do khác */}
                {OtherReason.visible && fieldConfig?.OtherReason.visibleConfig && (
                    <VnrTextInput
                        isCheckEmpty={fieldConfig?.OtherReason?.isValid && isError && !OtherReason.value ? true : false}
                        fieldValid={fieldConfig?.OtherReason?.isValid}
                        placeHolder={'HRM_PortalApp_PleaseInput'}
                        disable={OtherReason.disable}
                        lable={OtherReason.lable}
                        style={[styleSheets.text, viewInputMultiline]}
                        multiline={true}
                        value={OtherReason.value}
                        onFocus={() => {
                            Platform.OS == 'ios' && onScrollToInputIOS(indexDay + 1, this.layoutHeightItem);
                        }}
                        onChangeText={(text) => {
                            this.setState({
                                OtherReason: {
                                    ...OtherReason,
                                    value: text,
                                    refresh: !OtherReason.refresh
                                }
                            });
                        }}
                        refresh={OtherReason.refresh}
                    />
                )}

                {/* Ghi chú */}
                {Note.visible && fieldConfig?.Note.visibleConfig && (
                    <VnrTextInput
                        isCheckEmpty={fieldConfig?.Note?.isValid && isError && !Note.value ? true : false}
                        fieldValid={fieldConfig?.Note?.isValid}
                        placeHolder={'HRM_PortalApp_PleaseInput'}
                        disable={Note.disable}
                        lable={Note.lable}
                        style={[styleSheets.text, viewInputMultiline]}
                        multiline={true}
                        value={Note.value}
                        onFocus={() => {
                            Platform.OS == 'ios' && onScrollToInputIOS(indexDay + 1, this.layoutHeightItem);
                        }}
                        onChangeText={(text) => {
                            this.setState({
                                Note: {
                                    ...Note,
                                    value: text,
                                    refresh: !Note.refresh
                                }
                            });
                        }}
                        refresh={Note.refresh}
                    />
                )}

                {/* Tập tin đính kèm */}
                {Attachment.visible && fieldConfig?.Attachment.visibleConfig && (
                    <View style={{}}>
                        <VnrAttachFile
                            fieldValid={fieldConfig?.Attachment?.isValid}
                            isCheckEmpty={
                                fieldConfig?.Attachment?.isValid && isError && !Attachment.value ? true : false
                            }
                            lable={Attachment.lable}
                            disable={Attachment.disable}
                            refresh={Attachment.refresh}
                            value={Attachment.value}
                            multiFile={true}
                            uri={'[URI_CENTER]/api/Sys_Common/saveFileFromApp'}
                            onFinish={(file) => {
                                this.setState({
                                    Attachment: {
                                        ...Attachment,
                                        value: file,
                                        refresh: !Attachment.refresh
                                    }
                                });
                            }}
                        />
                    </View>
                )}
            </View>
        );
    }
}

const styles = styleComonAddOrEdit;

export default HreSubmitTerminationOfWorkComponent;
