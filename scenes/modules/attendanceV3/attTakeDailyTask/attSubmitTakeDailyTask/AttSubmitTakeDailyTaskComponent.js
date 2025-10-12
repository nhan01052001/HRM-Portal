import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import {
    styleSheets,
    CustomStyleSheet,
    Size,
    Colors,
    stylesVnrPickerV3
} from '../../../../../constants/styleConfig';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { EnumName } from '../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import styleComonAddOrEdit from '../../../../../constants/styleComonAddOrEdit';
import VnrPickerQuickly from '../../../../../componentsV3/VnrPickerQuickly/VnrPickerQuickly';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrDateFromTo from '../../../../../componentsV3/VnrDateFromTo/VnrDateFromTo';
import VnrTextInput from '../../../../../componentsV3/VnrTextInput/VnrTextInput';
import VnrAttachFile from '../../../../../componentsV3/VnrAttachFile/VnrAttachFile';
import VnrTreeView from '../../../../../componentsV3/VnrTreeView/VnrTreeView';
import { translate } from '../../../../../i18n/translate';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';

const configOrgStructureTransID = {
    textField: 'Name',
    valueField: 'id'
}

const initSateDefault = {
    modalLimit: {
        isModalVisible: false,
        data: []
    },
    isRefesh: false,
    isChoseProfile: true,
    CheckProfilesExclude: false,
    Profiles: {
        ID: null,
        ProfileName: '',
        disable: true
    },
    Profile: {
        ID: null,
        ProfileName: ''
    },

    fieldValid: {},

    params: null,
    isShowModal: false,
    isRefreshState: false,
    isError: false,
    OrgStructureIDs: {
        label: 'HRM_PortalApp_TransferDepartment',
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    JobTypeID: {
        label: 'HRM_Tas_Task_Type',
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    ShopTransID: {
        label: 'HRM_PortalApp_TransferShopName',
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    Note: {
        lable: 'HRM_PortalApp_Reason_Note',
        visible: true,
        visibleConfig: true,
        disable: false,
        value: '',
        refresh: false,
        isValid: true
    },
    FileAttach: {
        lable: 'HRM_PortalApp_FileAttach',
        visible: true,
        visibleConfig: true,
        disable: false,
        refresh: false,
        value: null
    },
    ActualHours: {
        lable: 'HRM_PortalApp_WorkingHrs',
        disable: false,
        data: null,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    WeekDayChangeShift: [],
    isRefeshChanged: false
};

const maxNumber = 999;
class AttSubmitTakeDailyTaskComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initSateDefault,
            Type: props?.type
        };

        this.focusTextInput = null;

        this.layoutHeightItem = null;
    }

    componentDidMount() {
        this.initState();
    }

    // Step 1: Khởi tạo dữ liệu
    initState = async () => {
        const { record } = this.props,
            { Profiles, isRefreshState, Profile,
                OrgStructureIDs,
                JobTypeID,
                ShopTransID,
                ActualHours,
                Note,
                FileAttach
            } = this.state;
        const profileInfo = dataVnrStorage
            ? dataVnrStorage.currentUser
                ? dataVnrStorage.currentUser.info
                : null
            : null;
        const { E_ProfileID, E_FullName } = EnumName,
            _profile = { ID: profileInfo[E_ProfileID], ProfileName: profileInfo[E_FullName] };
        if (record) {
            // Modify
            let nextState = {
                isRefreshState: !isRefreshState,
                Profile: {
                    ...Profile,
                    ..._profile
                },
                Profiles: {
                    ...Profiles,
                    ..._profile
                }
            };

            nextState = {
                ...nextState,
                OrgStructureIDs: {
                    ...OrgStructureIDs,
                    value: record?.OrgStructureID ? [
                        {
                            id: record.OrgStructureTransID,
                            Name: record?.OrgStructureTransName,
                            isChecked: true
                        }
                    ] : null,
                    refresh: !OrgStructureIDs.refresh
                },

                JobTypeID: {
                    ...JobTypeID,
                    value: record?.JobTypeID ? {
                        ID: record.JobTypeID,
                        JobTypeCodeName: record?.JobTypeName
                    } : null,
                    refresh: !JobTypeID.refresh
                },

                ShopTransID: {
                    ...ShopTransID,
                    value: record?.ShopTransID ? {
                        ID: record.ShopTransID,
                        ShopView: record?.ShopTransName
                    } : null,
                    refresh: !ShopTransID.refresh
                },

                ActualHours: {
                    ...ActualHours,
                    value: record.ActualHours ? `${record.ActualHours}` : null,
                    refresh: !ActualHours.refresh
                },

                Note: {
                    ...Note,
                    value: record.Note,
                    refresh: !Note.refresh
                }
            };

            // Value Acttachment
            if (record.FileAttach) {
                let valFile = ManageFileSevice.setFileAttachApp(record.FileAttach);

                nextState = {
                    ...nextState,
                    FileAttach: {
                        ...FileAttach,
                        disable: false,
                        value: valFile && valFile.length > 0 ? valFile : null,
                        refresh: !FileAttach.refresh
                    }
                };
            } else {
                nextState = {
                    ...nextState,
                    FileAttach: {
                        ...FileAttach,
                        disable: false,
                        value: null,
                        refresh: !FileAttach.refresh
                    }
                };
            }

            this.setState({ ...nextState, isRefreshState: !isRefreshState });
        } else {
            let nextState = {};
            this.setState(
                {
                    ...initSateDefault,
                    ...nextState,
                    Profiles: {
                        ...Profiles,
                        ..._profile
                    },
                    isRefreshState: !isRefreshState
                }
            );
        }
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (
            nextProps.isRefresh !== this.props.isRefresh ||
            nextProps.value[0]?.isDisable !== this.props.value[0]?.isDisable ||
            JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value) ||
            Vnr_Function.compare(nextState.ShopTransID.value, this.state.ShopTransID.value) === false ||
            Vnr_Function.compare(nextState.JobTypeID.value, this.state.JobTypeID.value) === false ||
            Vnr_Function.compare(nextState.OrgStructureIDs.value, this.state.OrgStructureIDs.value) === false ||
            nextState.OrgStructureIDs.refresh !== this.state.OrgStructureIDs.refresh ||
            nextState.ActualHours !== this.state.ActualHours ||
            nextState.isError !== this.state.isError ||
            nextState.Note !== this.state.Note ||
            nextState.isRefeshChanged !== this.state.isRefeshChanged
        ) {
            return true;
        } else {
            return false;
        }
    }

    showLoading = isShow => {
        const { showLoading } = this.props;
        showLoading && showLoading(isShow);
    };

    ToasterSevice = () => {
        const { ToasterSevice } = this.props;
        return ToasterSevice;
    };

    getAllData = () => {
        const { fieldConfig } = this.props,
            {
                OrgStructureIDs,
                JobTypeID,
                ActualHours,
                FileAttach,
                Note,
                ShopTransID
            } = this.state;

        let FinallyFileName = [];
        if (FileAttach.value && Array.isArray(FileAttach.value) && FileAttach.value.length > 0) {
            FileAttach.value.map(item => {
                FinallyFileName.push(item.fileName);
            });
        }

        if (
            (fieldConfig?.TransferDepartment?.isValid && !OrgStructureIDs.value) ||
            (fieldConfig?.JobType?.isValid && !JobTypeID.value) ||
            (fieldConfig?.ActualHours?.isValid && !ActualHours.value) ||
            (fieldConfig?.FileAttach?.isValid && !FileAttach.value) ||
            (fieldConfig?.Note?.isValid && !Note.value) ||
            (Note.value && Note.value.length > 500) ||
            (fieldConfig?.TransferShop?.isValid && !ShopTransID.value) ||
            (!isNaN(Number(ActualHours.value))
                && Number(ActualHours.value) >= maxNumber + 1)
        ) {
            this.setState({
                isError: true
            }, () => {
                if (Note.value && Note.value.length > 500) {
                    let keyTrans = translate('HRM_Sytem_MaxLength500');
                    let errorMax500 = keyTrans.replace('[E_NAME]', Note.lable ? `[${translate(Note.lable)}]` : '');
                    this.props.ToasterSevice().showWarning(errorMax500);
                    return null;
                }

                if (!isNaN(Number(ActualHours.value))
                    && Number(ActualHours.value) >= maxNumber + 1) {
                    let keyTrans = translate('E_INVALID');
                    let errorMax100 = `${translate(ActualHours.lable)} ${keyTrans.toLowerCase()}`
                    this.props.ToasterSevice().showWarning(errorMax100);

                    return null;
                }

                this.props.ToasterSevice().showWarning('HRM_PortalApp_InputValue_Please');
            });
            return null;
        }

        this.setState({
            isError: false
        });

        let orgStructureTransID = null;

        if (Array.isArray(OrgStructureIDs.value) && OrgStructureIDs.value.length > 0)
            orgStructureTransID = OrgStructureIDs.value[0][configOrgStructureTransID.valueField];

        return {
            OrgStructureIDs: orgStructureTransID,
            JobTypeID: JobTypeID.value?.ID ? JobTypeID.value?.ID : null,
            ActualHours: ActualHours.value ? Number(ActualHours.value) : 0,
            Note: Note.value,
            ShopTransID: ShopTransID.value?.ID ? ShopTransID.value?.ID : null,
            FileAttach: FinallyFileName.length > 0 ? FinallyFileName.join(',') : null
        };
    };

    unduData = () => {
        this.initState();
    };

    render() {
        const { fieldConfig, workDayRoot, onChangeDate, onScrollToInputIOS } = this.props,
            {
                isError,
                Note,
                FileAttach,
                ActualHours,
                OrgStructureIDs,
                JobTypeID,
                ShopTransID } = this.state;

        return (
            <View
                style={CustomStyleSheet.backgroundColor(Colors.white)}
                onLayout={event => {
                    const layout = event.nativeEvent.layout;
                    this.layoutHeightItem = layout.height;
                }}
            >
                <View>
                    <View>
                        <View
                            style={{
                                paddingHorizontal: Size.defineSpace,
                                paddingVertical: Size.defineHalfSpace
                            }}
                        >
                            <VnrText
                                style={[styleSheets.lable, styles.styLableGp]}
                                i18nKey={'HRM_PortalApp_LableTime'}
                            />
                        </View>

                        <VnrDateFromTo
                            isHiddenIcon={false}
                            fieldValid={fieldConfig?.WorkDate?.isValid}
                            lable={'HRM_Attendance_Overtime_WorkDate'}
                            refresh={true}
                            value={workDayRoot}
                            displayOptions={false}
                            onlyChooseOneDay={true}
                            isControll={true}
                            onFinish={(value) => {
                                if (typeof onChangeDate === 'function')
                                    onChangeDate(value);
                            }}
                        />
                    </View>

                    <View>
                        <VnrPickerQuickly
                            fieldValid={fieldConfig?.JobType?.isValid}
                            isCheckEmpty={
                                fieldConfig?.JobType?.isValid && isError && !JobTypeID.value ? true : false
                            }
                            refresh={true}
                            value={JobTypeID.value}
                            api={{
                                urlApi:
                                    '[URI_CENTER]/api/Att_GetData/GetMultiJobType',
                                type: 'E_GET'
                            }}
                            filter={true}
                            filterServer={true}
                            autoFilter={true}
                            filterParams="text"
                            textField="JobTypeCodeName"
                            valueField="ID"
                            disable={false}
                            lable={JobTypeID.label}
                            onFinish={(value) => {
                                this.setState(
                                    {
                                        JobTypeID: {
                                            ...JobTypeID,
                                            value: value,
                                            refresh: !JobTypeID.refresh
                                        }
                                    }
                                );
                            }}
                        />
                    </View>

                    <View style={styles.flRowSpaceBetween}>
                        <VnrText
                            style={[styleSheets.lable, styles.styLableGp]}
                            i18nKey={'HRM_PortalApp_Explanation'}
                        />
                    </View>

                    <View>
                        <VnrTreeView
                            api={
                                {
                                    urlApi: '[URI_CENTER]/api/Cat_GetData/GetOrgTreeView',
                                    type: 'E_GET'
                                }
                            }
                            isControlCreate={true}
                            fieldValid={fieldConfig?.TransferDepartment?.isValid}
                            isCheckEmpty={
                                fieldConfig?.TransferDepartment?.isValid && isError && !OrgStructureIDs.value ? true : false
                            }
                            fieldName={'OrgStructureIDs'}
                            isCheckChildren={false}
                            response={'string'}
                            textField={configOrgStructureTransID.textField}
                            valueField={configOrgStructureTransID.valueField}
                            newStyle={true}
                            layoutFilter={true}
                            value={OrgStructureIDs.value}
                            lable={OrgStructureIDs.label}
                            refresh={OrgStructureIDs.refresh}
                            onSelect={(listItem) => {
                                this.setState(
                                    {
                                        OrgStructureIDs: {
                                            ...OrgStructureIDs,
                                            value: listItem,
                                            refresh: !OrgStructureIDs.refresh
                                        }
                                    }
                                );
                            }}
                        />
                    </View>

                    <View>
                        <VnrPickerQuickly
                            api={{
                                urlApi:
                                    '[URI_CENTER]/api/Att_GetData/GetMultiShop',
                                type: 'E_GET'
                            }}
                            fieldValid={fieldConfig?.TransferShop?.isValid}
                            filter={true}
                            filterServer={true}
                            filterParams="text"
                            isCheckEmpty={
                                fieldConfig?.TransferShop?.isValid && isError && !ShopTransID.value ? true : false
                            }
                            refresh={true}
                            value={ShopTransID.value}
                            textField="ShopView"
                            valueField="ID"
                            disable={false}
                            lable={ShopTransID.label}
                            onFinish={(value) => {
                                this.setState(
                                    {
                                        ShopTransID: {
                                            ...ShopTransID,
                                            value: value,
                                            refresh: !ShopTransID.refresh
                                        }
                                    }
                                );
                            }}
                        />
                    </View>

                    <View>
                        <VnrTextInput
                            ref={input => {
                                this.focusTextInput = input;
                            }}
                            maxNumber={maxNumber}
                            isCheckEmpty={
                                isError
                                && (
                                    (fieldConfig?.ActualHours?.isValid
                                        && !ActualHours.value)
                                    || (!isNaN(Number(ActualHours.value))
                                        && Number(ActualHours.value) >= maxNumber + 1)
                                )
                            }
                            fieldValid={fieldConfig?.ActualHours?.isValid}
                            lable={ActualHours.lable}
                            isTextRow={true}
                            placeHolder={'HRM_PortalApp_PleaseInput'}
                            value={ActualHours.value}
                            refresh={ActualHours.refresh}
                            disable={ActualHours.disable}
                            styleContent={[
                                stylesVnrPickerV3.styContentPicker,
                                styles.resetBorder,
                                CustomStyleSheet.borderBottomWidth(1)
                            ]}
                            style={[
                                styleSheets.text,
                                styleSheets.textInput,
                                styles.customForTextInputChooseHour
                            ]}
                            keyboardType={'numeric'}
                            charType={'double'}
                            returnKeyType={'done'}
                            textRight={true}
                            onChangeText={value => {
                                this.setState(
                                    {
                                        ActualHours: {
                                            ...ActualHours,
                                            value: value,
                                            refresh: !ActualHours.refresh
                                        }
                                    }
                                );
                            }}
                            onBlur={this.onChangeRegisterHours}
                            onSubmitEditing={this.onChangeRegisterHours}
                        />
                    </View>

                    {/* Lý do tăng ca */}
                    {Note.visible && fieldConfig?.Note?.visibleConfig && (
                        <VnrTextInput
                            fieldValid={fieldConfig?.Note?.isValid}
                            isCheckEmpty={
                                fieldConfig?.Note?.isValid && isError && Note.value.length === 0 ? true : false
                            }
                            placeHolder={'HRM_PortalApp_PleaseInput'}
                            disable={Note.disable}
                            lable={Note.lable}
                            style={[
                                styleSheets.text,
                                stylesVnrPickerV3.viewInputMultiline,
                                CustomStyleSheet.paddingHorizontal(0)
                            ]}
                            multiline={true}
                            value={Note.value}
                            onChangeText={(text) => {
                                this.setState({
                                    Note: {
                                        ...Note,
                                        value: text,
                                        refresh: !Note.refresh
                                    }
                                });
                            }}
                            onFocus={() => {
                                Platform.OS == 'ios' &&
                                    onScrollToInputIOS(1, this.layoutHeightItem);
                            }}
                            refresh={Note.refresh}
                        />
                    )}

                    {/* Tập tin đính kèm */}
                    {FileAttach.visible && fieldConfig?.FileAttach?.visibleConfig && (
                        <View style={{}}>
                            <VnrAttachFile
                                fieldValid={fieldConfig?.FileAttach?.isValid}
                                isCheckEmpty={
                                    fieldConfig?.FileAttach?.isValid && isError && !FileAttach.value ? true : false
                                }
                                lable={FileAttach.lable}
                                disable={FileAttach.disable}
                                refresh={FileAttach.refresh}
                                value={FileAttach.value}
                                multiFile={true}
                                uri={'[URI_CENTER]/api/Sys_Common/saveFileFromApp'}
                                onFinish={(file) => {
                                    this.setState({
                                        FileAttach: {
                                            ...FileAttach,
                                            value: file,
                                            refresh: !FileAttach.refresh
                                        }
                                    });
                                }}
                            />
                        </View>
                    )}
                </View>
            </View>
        );
    }
}

const styles = styleComonAddOrEdit;

export default AttSubmitTakeDailyTaskComponent;
