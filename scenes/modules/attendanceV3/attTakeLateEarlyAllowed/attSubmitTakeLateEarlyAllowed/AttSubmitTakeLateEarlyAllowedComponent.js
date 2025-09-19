import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import {
    Colors,
    CustomStyleSheet,
    styleSheets,
    stylesVnrPickerV3
} from '../../../../../constants/styleConfig';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../../componentsV3/VnrTextInput/VnrTextInput';
import VnrAttachFile from '../../../../../componentsV3/VnrAttachFile/VnrAttachFile';
import HttpService from '../../../../../utils/HttpService';
import { EnumName } from '../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import moment from 'moment';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
import VnrPickerLittle from '../../../../../componentsV3/VnrPickerLittle/VnrPickerLittle';
import { translate } from '../../../../../i18n/translate';
import VnrDateFromTo from '../../../../../componentsV3/VnrDateFromTo/VnrDateFromTo';
import styleComonAddOrEdit from '../../../../../constants/styleComonAddOrEdit';

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
    WorkDate: {
        value: null,
        lable: 'HRM_PortalApp_TSLRegister_WorkDate',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    ShiftID: {
        label: 'HRM_Attendance_InOut_ShiftID',
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: false
    },
    LateEarlyType: {
        label: 'Hrm_Hre_Type',
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },
    LateMinutes: {
        disable: false,
        refresh: false,
        value: null,
        visible: false,
        visibleConfig: true
    },
    EarlyMinutes: {
        disable: false,
        refresh: false,
        value: null,
        visible: false,
        visibleConfig: true
    },
    EarlyReasonID: {
        lable: 'HRM_PortalApp_ReasonEarly',
        disable: false,
        refresh: false,
        value: null,
        data: null,
        visible: false,
        visibleConfig: true
    },
    LateReasonID: {
        lable: 'HRM_PortalApp_ReasonLate',
        disable: false,
        refresh: false,
        value: null,
        data: null,
        visible: false,
        visibleConfig: true
    },
    Note: {
        lable: 'HRM_HR_Reward_Reason',
        visible: true,
        visibleConfig: true,
        disable: false,
        value: null,
        refresh: false
    },
    FileAttach: {
        lable: 'HRM_PortalApp_TakeLeave_FileAttachment',
        visible: true,
        visibleConfig: true,
        disable: false,
        refresh: false,
        value: null
    },
    DateFromTo: {
        refresh: false,
        disable: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    params: null,
    isShowModal: false,
    workDateAllowe: null,
    isRefreshState: false,
    OptionReasonOT: {
        lable: 'HRM_Attendance_handleWhenChangeDateLateEarly_handleWhenChangeDateLateEarlyList_ReasonOT',
        visible: false,
        visibleConfig: true,
        disable: false,
        refresh: false,
        value: null,
        data: []
    },
    isError: false
};

class AttSubmitTakeLateEarlyAllowedComponent extends Component {
    constructor(props) {
        super(props);
        this.state = initSateDefault;

        this.focusTextInput = null;

        this.layoutHeightItem = null;
    }

    componentDidMount() {
        this.initState();
    }

    //change ngày công
    onChangeWorkDate = item => {
        const { indexDay } = this.props;
        this.props.onUpdateDateRegister(item, indexDay);
    };

    // Step 1: Khởi tạo dữ liệu
    initState = async () => {
        const { record, value } = this.props,
            { Profiles, isRefreshState, WorkDate, Profile } = this.state;
        const profileInfo = dataVnrStorage
            ? dataVnrStorage.currentUser
                ? dataVnrStorage.currentUser.info
                : null
            : null;

        const { E_ProfileID, E_FullName } = EnumName,
            _profile = { ID: profileInfo[E_ProfileID], ProfileName: profileInfo[E_FullName] };
        if (record) {
            const {
                FileAttach,
                LateEarlyType,
                Note,
                LateReasonID,
                EarlyReasonID,
                LateMinutes,
                EarlyMinutes
            } = this.state;
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
                },
                WorkDate: {
                    ...WorkDate,
                    value: record && record.WorkDate ? [moment(record.WorkDate).format('YYYY-MM-DD')] : null,
                    refresh: !WorkDate.refresh
                },
                Note: {
                    ...Note,
                    value: record.Note ? record.Note : '',
                    refresh: !Note.refresh
                },

                LateEarlyType: {
                    ...LateEarlyType,
                    value: {
                        Text: record.LateEarlyTypeView ? record.LateEarlyTypeView : null,
                        Value: record.LateEarlyType ? record.LateEarlyType : null
                    },
                    refresh: !LateEarlyType.refresh
                }
            };

            if (record.LateEarlyType === 'E_ALLOWLATE') {
                nextState = {
                    ...nextState,
                    LateReasonID: {
                        ...LateReasonID,
                        value: {
                            OvertimeResonName: record.OvertimeResonName ? record.OvertimeResonName : null,
                            TotalRow: 0,
                            ID: record.LateEarlyReasonID ? record.LateEarlyReasonID : null
                        },
                        visibleConfig: true,
                        visible: true,
                        refresh: !LateReasonID.refresh
                    },
                    LateMinutes: {
                        ...LateMinutes,
                        value: record.LateMinutes ? `${record.LateMinutes}` : null,
                        refresh: !LateMinutes.refresh,
                        disable: false,
                        visible: true
                    }
                };
            } else {
                nextState = {
                    ...nextState,
                    EarlyReasonID: {
                        ...EarlyReasonID,
                        value: {
                            OvertimeResonName: record.OvertimeResonName ? record.OvertimeResonName : null,
                            TotalRow: 0,
                            ID: record.LateEarlyReasonID ? record.LateEarlyReasonID : null
                        },
                        visibleConfig: true,
                        visible: true,
                        refresh: !EarlyReasonID.refresh
                    },
                    EarlyMinutes: {
                        ...EarlyMinutes,
                        value: record.EarlyMinutes ? `${record.EarlyMinutes}` : null,
                        refresh: !EarlyMinutes.refresh,
                        disable: false,
                        visible: true
                    }
                };
            }

            // Value Acttachment
            if (
                record.FileAttachment ||
                (record.Attachment &&
                    record.FileAttachOfUser &&
                    typeof record.Attachment === 'string' &&
                    typeof record.FileAttachOfUser === 'string')
            ) {
                let valFile = ManageFileSevice.setFileAttachApp(
                    record.FileAttachment ? record.FileAttachment : record.Attachment + '|' + record.FileAttachOfUser
                );

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
            this.setState(nextState, () => {
                this.getLateEarlyType(true);
            });
        } else {
            this.setState(
                {
                    ...initSateDefault,
                    Profiles: {
                        ...Profiles,
                        ..._profile
                    },
                    WorkDate: {
                        ...WorkDate,
                        value: value ? value : null,
                        refresh: !WorkDate.refresh
                    },
                    isRefreshState: !isRefreshState
                },
                () => {
                    this.getLateEarlyType();
                }
            );
        }
    };

    showLoading = isShow => {
        const { showLoading } = this.props;
        showLoading && showLoading(isShow);
    };

    ToasterSevice = () => {
        const { ToasterSevice } = this.props;
        return ToasterSevice;
    };

    getAllData = () => {
        const {
                WorkDate,
                LateEarlyType,
                Note,
                FileAttach,
                LateReasonID,
                EarlyMinutes,
                EarlyReasonID,
                LateMinutes,
                Profiles
            } = this.state,
            { fieldConfig, levelApprove } = this.props;
        let FinallyFileName = [];

        if (FileAttach.value && Array.isArray(FileAttach.value) && FileAttach.value.length > 0) {
            FileAttach.value.map(item => {
                FinallyFileName.push(item.fileName);
            });
        }

        if (
            (fieldConfig?.WorkDate?.isValid && !WorkDate.value) ||
            (!LateEarlyType.value) ||
            (fieldConfig?.Note?.isValid && !Note.value) ||
            (fieldConfig?.Attachment?.isValid && !FileAttach.value) ||
            (LateReasonID.visible && !LateReasonID.value) ||
            (EarlyReasonID.visible && !EarlyReasonID.value)
        ) {
            this.setState(
                {
                    isError: true
                },
                () => {
                    this.props.ToasterSevice().showWarning('HRM_PortalApp_InputValue_Please');
                }
            );
        } else {
            this.setState({
                isError: false
            });
            return {
                Attachment: FinallyFileName.length > 0 ? FinallyFileName.join(',') : null,
                EarlyMinutes: EarlyMinutes.value,
                EarlyReasonID: EarlyReasonID.value ? EarlyReasonID.value.ID : null,
                LateEarlyType: LateEarlyType.value ? LateEarlyType.value.Value : null,
                LateMinutes: LateMinutes.value,
                LateReasonID: LateReasonID.value ? LateReasonID.value.ID : null,
                Note: Note.value,
                ProfileID: Profiles.ID,
                ListProfileID: [Profiles.ID],
                WorkDate: moment(WorkDate.value[0]).format('YYYY/MM/DD'),
                LevelApproved: levelApprove,
                Scans: null
            };
        }
    };

    unduData = () => {
        this.initState();
    };

    handleWhenChangeDatehandleWhenChangeDateLateEarly = value => {
        this.onChangeWorkDate(value);
    };

    //change loại đăng ký
    onChangeLateEarlyType = item => {
        const { LateEarlyType, LateMinutes, EarlyMinutes, EarlyReasonID, LateReasonID } = this.state;

        let nextState = {
            LateEarlyType: {
                ...LateEarlyType,
                value: item,
                refresh: !LateEarlyType.refresh
            },
            LateMinutes: {
                ...LateMinutes,
                refresh: !LateMinutes.refresh,
                visible: false
            },
            EarlyMinutes: {
                ...EarlyMinutes,
                refresh: !EarlyMinutes.refresh,
                visible: false
            }
        };

        if (item && item.Value == 'E_ALLOWEARLYLATE') {
            nextState = {
                ...nextState,
                LateMinutes: {
                    ...nextState.LateMinutes,
                    visible: true
                },
                EarlyMinutes: {
                    ...nextState.EarlyMinutes,
                    visible: true
                },
                EarlyReasonID: {
                    ...EarlyReasonID,
                    visible: true,
                    refresh: !EarlyReasonID.refresh
                },
                LateReasonID: {
                    ...LateReasonID,
                    visible: true,
                    refresh: !LateReasonID.refresh
                }
            };
        } else if (item && item.Value == 'E_ALLOWLATE') {
            nextState = {
                ...nextState,
                LateMinutes: {
                    ...nextState.LateMinutes,
                    visible: true
                },
                EarlyMinutes: {
                    ...nextState.EarlyMinutes,
                    visible: false
                },
                EarlyReasonID: {
                    ...EarlyReasonID,
                    visible: false,
                    refresh: !EarlyReasonID.refresh
                },
                LateReasonID: {
                    ...LateReasonID,
                    visible: true,
                    refresh: !LateReasonID.refresh
                }
            };
        } else if (item && item.Value == 'E_ALLOWEARLY') {
            nextState = {
                ...nextState,
                LateMinutes: {
                    ...nextState.LateMinutes,
                    visible: false
                },
                EarlyMinutes: {
                    ...nextState.EarlyMinutes,
                    visible: true
                },
                EarlyReasonID: {
                    ...EarlyReasonID,
                    visible: true,
                    refresh: !EarlyReasonID.refresh
                },
                LateReasonID: {
                    ...LateReasonID,
                    visible: false,
                    refresh: !LateReasonID.refresh
                }
            };
        } else {
            nextState = {
                ...nextState,
                LateMinutes: {
                    ...nextState.LateMinutes,
                    visible: false
                },
                EarlyMinutes: {
                    ...nextState.EarlyMinutes,
                    visible: false
                },
                EarlyReasonID: {
                    ...EarlyReasonID,
                    visible: false,
                    refresh: !EarlyReasonID.refresh
                },
                LateReasonID: {
                    ...LateReasonID,
                    visible: false,
                    refresh: !LateReasonID.refresh
                }
            };
        }

        this.setState(nextState);
    };

    getLateEarlyDurationWorkDay = (
        type = this.state.LateEarlyType.value && this.state.LateEarlyType.value.Value
            ? this.state.LateEarlyType.value.Value
            : null
    ) => {
        // this.showLoading(true);
        const { WorkDate } = this.state;

        if (WorkDate.value == null) return;

        HttpService.Post('[URI_CENTER]/api/Att_LateEarlyAllowed/GetLateEarlyDurationByWorkDate', {
            ProfileID: [dataVnrStorage.currentUser.info.ProfileID],
            // OrderNumber: "string",
            WorkDate: moment(WorkDate.value[0]).format('YYYY-MM-DD HH:mm:ss')
        }).then(data => {
            if (data) {
                this.showLoading(false);
                if (data.Status === 'SUCCESS') {
                    if (data.Data && (data.Data.LateDuration || data.Data.EarlyDuration)) {
                        let params = {
                            EarlyDuration1: data.Data.EarlyDuration,
                            LateDuration1: data.Data.LateDuration
                        };

                        this.initFormSumitFromWorkday(params, type);
                    }
                }
            }
        });
    };

    initFormSumitFromWorkday = (workDayItem, type) => {
        const { WorkDate, LateEarlyType, LateMinutes, EarlyMinutes, EarlyReasonID, LateReasonID } = this.state;
        let nextState = {};

        if (WorkDate.value == null && workDayItem && workDayItem.WorkDate) {
            // Vào từ màn hình Ngày công
            nextState = {
                ...nextState,
                WorkDate: {
                    ...WorkDate,
                    value: moment(workDayItem.WorkDate).format('YYYY-MM-DD HH:mm:ss'),
                    refresh: !WorkDate.refresh
                }
            };
        }

        let valLateEarlyType = type ? type : null;
        if (LateEarlyType.data) {
            if (workDayItem.LateDuration1 && workDayItem.EarlyDuration1) {
                valLateEarlyType = LateEarlyType.data.find(item => item.Value == 'E_ALLOWEARLYLATE');

                nextState = {
                    ...nextState,
                    LateMinutes: {
                        ...LateMinutes,
                        value: `${workDayItem.LateDuration1}`,
                        refresh: !LateMinutes.refresh,
                        disable: false,
                        visible: true
                    },
                    EarlyMinutes: {
                        ...EarlyMinutes,
                        value: `${workDayItem.EarlyDuration1}`,
                        refresh: !EarlyMinutes.refresh,
                        disable: false,
                        visible: true
                    },
                    EarlyReasonID: {
                        ...EarlyReasonID,
                        visible: true,
                        refresh: !EarlyReasonID.refresh
                    },
                    LateReasonID: {
                        ...LateReasonID,
                        visible: true,
                        refresh: !LateReasonID.refresh
                    }
                };
            } else if (workDayItem.LateDuration1) {
                valLateEarlyType = LateEarlyType.data.find(item => item.Value == 'E_ALLOWLATE');

                nextState = {
                    ...nextState,
                    LateMinutes: {
                        ...LateMinutes,
                        value: `${workDayItem.LateDuration1}`,
                        refresh: !LateMinutes.refresh,
                        disable: false,
                        visible: true
                    },
                    EarlyReasonID: {
                        ...EarlyReasonID,
                        visible: false,
                        refresh: !EarlyReasonID.refresh
                    },
                    LateReasonID: {
                        ...LateReasonID,
                        visible: true,
                        refresh: !LateReasonID.refresh
                    }
                };
            } else if (workDayItem.EarlyDuration1) {
                valLateEarlyType = LateEarlyType.data.find(item => item.Value == 'E_ALLOWEARLY');

                nextState = {
                    ...nextState,
                    EarlyMinutes: {
                        ...EarlyMinutes,
                        value: `${workDayItem.EarlyDuration1}`,
                        refresh: !EarlyMinutes.refresh,
                        disable: false,
                        visible: true
                    },
                    EarlyReasonID: {
                        ...EarlyReasonID,
                        visible: true,
                        refresh: !EarlyReasonID.refresh
                    },
                    LateReasonID: {
                        ...LateReasonID,
                        visible: false,
                        refresh: !LateReasonID.refresh
                    }
                };
            }
        }

        nextState = {
            ...nextState,
            LateEarlyType: {
                ...LateEarlyType,
                value: valLateEarlyType,
                refresh: !LateEarlyType.refresh,
                disable: false,
                visible: true
            }
        };

        this.setState(nextState);
    };

    getLateEarlyType = (isPass = false) => {
        const { LateEarlyType } = this.state;
        HttpService.Get('[URI_CENTER]/api/Att_GetData/GetLateEarlyType')
            .then(res => {
                if (res && res.Status === 'SUCCESS' && res.Data && Array.isArray(res.Data)) {
                    this.setState(
                        {
                            LateEarlyType: {
                                ...LateEarlyType,
                                data: res.Data,
                                refresh: !LateEarlyType.refresh
                            }
                        },
                        () => {
                            if (isPass) {
                                this.getLateEarlyDurationWorkDay();
                            }
                        }
                    );
                }
            })
            .catch(() => {
                this.props.ToasterSevice().showWarning(translate('HRM_Message_GetDataServices_Error'), 3000);
            });
    };

    render() {
        const { isShowDelete, fieldConfig, value, onDeleteItemDay, indexDay, onScrollToInputIOS } = this.props,
            {
                WorkDate,
                LateEarlyType,
                Note,
                FileAttach,
                OptionReasonOT,
                isError,
                EarlyReasonID,
                LateReasonID,
                LateMinutes,
                EarlyMinutes
            } = this.state,
            { viewInputMultiline } = stylesVnrPickerV3;
        let resultLateEarly = null;

        if (LateEarlyType.value) {
            if (LateEarlyType.value.Value === 'E_ALLOWEARLY' && EarlyMinutes.value) {
                resultLateEarly = `${translate('LateEarlyType__E_ALLOWEARLY')}: ${EarlyMinutes.value}`;
            } else if (LateEarlyType.value.Value === 'E_ALLOWLATE' && LateMinutes.value) {
                resultLateEarly = `${translate('LateEarlyType__E_ALLOWLATE')}: ${LateMinutes.value}`;
            } else if (LateEarlyType.value.Value === 'E_ALLOWEARLYLATE' && EarlyMinutes.value && LateMinutes.value) {
                resultLateEarly = `${translate('LateEarlyType__E_ALLOWLATE')}: ${LateMinutes.value} / ${translate(
                    'LateEarlyType__E_ALLOWEARLY'
                )}:  ${EarlyMinutes.value}`;
            } else {
                resultLateEarly = null;
            }
        }

        return (
            <View
                style={styles.wrapItem}
                onLayout={event => {
                    const layout = event.nativeEvent.layout;
                    this.layoutHeightItem = layout.height;
                }}
            >
                {/* Thời gian */}
                {/* Title group for time */}
                <View style={[styles.flRowSpaceBetween, {}]}>
                    <VnrText
                        style={[styleSheets.lable, styles.styLableGp, CustomStyleSheet.fontWeight('600')]}
                        i18nKey={'HRM_PortalApp_LableTime'}
                    />

                    {isShowDelete && (
                        <TouchableOpacity onPress={() => onDeleteItemDay(indexDay)}>
                            <VnrText
                                style={[styleSheets.lable, styles.styLableDeleteGp]}
                                i18nKey={'HRM_PortalApp_Delete'}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Ngày đăng ký */}
                {WorkDate.visible && fieldConfig?.WorkDay?.visibleConfig && (
                    <VnrDateFromTo
                        fieldValid={fieldConfig?.WorkDay?.isValid}
                        isCheckEmpty={fieldConfig?.WorkDate?.isValid && !WorkDate.value ? true : false}
                        key={WorkDate.id}
                        lable={WorkDate.lable}
                        refresh={WorkDate.refresh}
                        value={value}
                        displayOptions={false}
                        onlyChooseEveryDay={false}
                        onlyChooseOneDay={true}
                        disable={WorkDate.disable}
                        isControll={true}
                        onFinish={value => {
                            this.handleWhenChangeDatehandleWhenChangeDateLateEarly(value);
                        }}
                    />
                )}

                {/* Loại đăng ký */}
                {LateEarlyType.visible && fieldConfig?.LateEarlyType?.visibleConfig && (
                    <VnrPickerLittle
                        fieldValid={true}
                        isCheckEmpty={
                            isError && !LateEarlyType.value ? true : false
                        }
                        refresh={LateEarlyType.refresh}
                        dataLocal={LateEarlyType.data ? LateEarlyType.data : []}
                        // api={{
                        //     urlApi:
                        //         '[URI_CENTER]/api/Att_GetData/GetLateEarlyType',
                        //     type: 'E_GET',
                        // }}
                        value={LateEarlyType.value}
                        textField="Text"
                        valueField="Value"
                        filter={false}
                        filterServer={true}
                        filterParams="text"
                        disable={LateEarlyType.disable}
                        lable={LateEarlyType.label}
                        stylePicker={styles.resetBorder}
                        onFinish={item => {
                            this.onChangeLateEarlyType(item);
                        }}
                    />
                )}

                {resultLateEarly && (
                    <View style={styles.caculatorHour}>
                        <Text style={[{ color: Colors.black }, { ...CustomStyleSheet.fontWeight('400'), ...CustomStyleSheet.fontSize(14) }]}>
                            {resultLateEarly}
                        </Text>
                    </View>
                )}

                {/* Diễn giải */}
                <View style={[styles.flRowSpaceBetween, {}]}>
                    <VnrText
                        style={[styleSheets.lable, styles.styLableGp, CustomStyleSheet.fontWeight('600')]}
                        i18nKey={'HRM_PortalApp_Explanation'}
                    />
                </View>

                {/* Lý do đi trễ */}
                {LateReasonID.visible && fieldConfig?.LateReasonID?.visibleConfig && (
                    <VnrPickerLittle
                        fieldValid={LateReasonID.visible}
                        isCheckEmpty={
                            LateReasonID.visible && isError && !LateReasonID.value ? true : false
                        }
                        refresh={LateReasonID.refresh}
                        //dataLocal={LateReasonID.data ? LateReasonID.data : []}
                        api={{
                            urlApi: '[URI_CENTER]/api/Cat_GetData/GetLateEarlyReason',
                            type: 'E_GET'
                        }}
                        value={LateReasonID.value}
                        textField="OvertimeResonName"
                        valueField="ID"
                        filter={false}
                        filterServer={false}
                        filterParams="text"
                        disable={LateReasonID.disable}
                        lable={LateReasonID.lable}
                        stylePicker={styles.resetBorder}
                        onFinish={item => {
                            this.setState(
                                {
                                    LateReasonID: {
                                        ...LateReasonID,
                                        value: item ? { ...item } : null,
                                        refresh: !LateReasonID.refresh
                                    }
                                },
                                () => {}
                            );
                        }}
                    />
                )}

                {/* Lý do về sớm */}
                {EarlyReasonID.visible && fieldConfig?.EarlyReasonID?.visibleConfig && (
                    <VnrPickerLittle
                        fieldValid={EarlyReasonID.visible}
                        isCheckEmpty={
                            EarlyReasonID.visible && isError && !EarlyReasonID.value ? true : false
                        }
                        refresh={EarlyReasonID.refresh}
                        //dataLocal={EarlyReasonID.data ? EarlyReasonID.data : []}
                        api={{
                            urlApi: '[URI_CENTER]/api/Cat_GetData/GetLateEarlyReason',
                            type: 'E_GET'
                        }}
                        value={EarlyReasonID.value}
                        textField="OvertimeResonName"
                        valueField="ID"
                        filter={false}
                        filterServer={false}
                        filterParams="text"
                        disable={EarlyReasonID.disable}
                        lable={EarlyReasonID.lable}
                        stylePicker={styles.resetBorder}
                        onFinish={item => {
                            this.setState(
                                {
                                    EarlyReasonID: {
                                        ...EarlyReasonID,
                                        value: item ? { ...item } : null,
                                        refresh: !EarlyReasonID.refresh
                                    }
                                },
                                () => {}
                            );
                        }}
                    />
                )}

                {/* OPTION Lý do */}
                {/* default hide */}
                {OptionReasonOT.visible && fieldConfig?.OptionReasonOT?.visibleConfig && (
                    <VnrPickerLittle
                        fieldValid={fieldConfig?.OptionReasonOT?.isValid}
                        refresh={OptionReasonOT.refresh}
                        api={{
                            urlApi: '[URI_CENTER]/api/Att_GetData/GetMultihandleWhenChangeDateLateEarlyReason',
                            type: 'E_GET'
                        }}
                        value={OptionReasonOT.value}
                        textField="Text"
                        valueField="Value"
                        filter={true}
                        filterServer={true}
                        filterParams="text"
                        params="OptionReasonOT"
                        disable={OptionReasonOT.disable}
                        lable={OptionReasonOT.lable}
                        stylePicker={styles.resetBorder}
                        onFinish={item => {
                            this.setState({
                                OptionReasonOT: {
                                    ...OptionReasonOT,
                                    value: { ...item },
                                    refresh: !OptionReasonOT.refresh
                                }
                            });
                        }}
                    />
                )}

                {/* Lý do tăng ca */}
                {Note.visible && fieldConfig?.Note?.visibleConfig && (
                    <View>
                        <VnrTextInput
                            fieldValid={fieldConfig?.Note?.isValid}
                            isCheckEmpty={
                                (fieldConfig?.Note?.isValid && isError) ||
                                (Note.value && (Note.value.length === 0 || Note.value.length > 1000))
                                    ? true
                                    : false
                            }
                            placeHolder={'HRM_PortalApp_PleaseInput'}
                            disable={Note.disable}
                            lable={Note.lable}
                            style={[
                                styleSheets.text,
                                viewInputMultiline,
                                CustomStyleSheet.paddingHorizontal(0)
                            ]}
                            multiline={true}
                            value={Note.value}
                            onChangeText={text => {
                                this.setState({
                                    Note: {
                                        ...Note,
                                        value: text,
                                        refresh: !Note.refresh
                                    }
                                });
                            }}
                            onFocus={() => {
                                Platform.OS == 'ios' && onScrollToInputIOS(indexDay + 1, this.layoutHeightItem);
                            }}
                            refresh={Note.refresh}
                        />
                        {Note.value && Note.value.length > 1000 ? (
                            <View>
                                <Text numberOfLines={3} style={styles.styErrorInputLength}>
                                    {translate('HRM_PortalApp_BlockResonLateEarly')}
                                </Text>
                            </View>
                        ) : null}
                    </View>
                )}

                {/* Tập tin đính kèm */}
                {FileAttach.visible && fieldConfig?.Attachment?.visibleConfig && (
                    <View style={{}}>
                        <VnrAttachFile
                            fieldValid={fieldConfig?.Attachment?.isValid}
                            isCheckEmpty={
                                fieldConfig?.Attachment?.isValid && isError && !FileAttach.value ? true : false
                            }
                            lable={FileAttach.lable}
                            disable={FileAttach.disable}
                            refresh={FileAttach.refresh}
                            value={FileAttach.value}
                            multiFile={true}
                            uri={'[URI_CENTER]/api/Sys_Common/saveFileFromApp'}
                            onFinish={file => {
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
        );
    }
}

const styles = styleComonAddOrEdit;

export default AttSubmitTakeLateEarlyAllowedComponent;
