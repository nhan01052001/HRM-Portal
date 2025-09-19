import React from 'react';
import { View, TouchableOpacity, Image, FlatList, Platform } from 'react-native';
import { Colors, CustomStyleSheet, styleSheets, stylesVnrPickerV3 } from '../../../../../constants/styleConfig';
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
import VnrTreeView from '../../../../../componentsV3/VnrTreeView/VnrTreeView';

const configOrgStructureTransID = {
    textField: 'Name',
    valueField: 'id'
};

const initSateDefault = {
    WorkDate: {
        value: null,
        lable: 'HRM_PortalApp_TSLRegister_WorkDate',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    InTime: {
        value: null,
        lable: 'HRM_PortalApp_TSLRegister_InTime',
        disable: true,
        refresh: false,
        visible: false,
        visibleConfig: true
    },
    OutTime: {
        value: null,
        lable: 'HRM_PortalApp_TSLRegister_OutTime',
        disable: true,
        refresh: false,
        visible: false,
        visibleConfig: true
    },
    PlaceID: {
        value: null,
        lable: 'HRM_PortalApp_TSLRegister_PlaceID',
        disable: true,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    Type: {
        value: null,
        disable: true,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    Comment: {
        value: null,
        lable: 'HRM_PortalApp_TSLRegister_Comment',
        disable: true,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    MissInOutReason: {
        value: null,
        lable: 'HRM_PortalApp_TSLRegister_MissInOutReason',
        disable: true,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    FileAttachment: {
        lable: 'HRM_PortalApp_TSLRegister_Attachment',
        visible: true,
        visibleConfig: true,
        disable: true,
        refresh: false,
        value: null
    },
    ListInTime: [],
    ListOutTime: [],
    isError: false,
    OrgStructureTransID: {
        lable: 'HRM_PortalApp_TransferDepartment',
        disable: false,
        refresh: false,
        value: null,
        data: [],
        visible: true,
        visibleConfig: true
    }
};

class AttTamScanLogRegisterComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initSateDefault,
            Profile: {
                ID: null,
                ProfileName: '',
                disable: true
            },
            isConfigMultiTimeInOut: true,
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
            nextState.WorkDate.value !== this.state.WorkDate.value ||
            nextState.InTime.value !== this.state.InTime.value ||
            nextState.OutTime.value !== this.state.OutTime.value ||
            nextState.PlaceID.value !== this.state.PlaceID.value ||
            nextState.Type.value !== this.state.Type.value ||
            nextState.Comment.value !== this.state.Comment.value ||
            nextState.MissInOutReason.value !== this.state.MissInOutReason.value ||
            nextState.FileAttachment.value !== this.state.FileAttachment.value ||
            nextState.ListInTime.length !== this.state.ListInTime.length ||
            nextState.isError !== this.state.isError ||
            nextState.ListOutTime.length !== this.state.ListOutTime.length ||
            Vnr_Function.compare(nextState.OrgStructureTransID.value, this.state.OrgStructureTransID.value) === false ||
            nextState.OrgStructureTransID.refresh !== this.state.OrgStructureTransID.refresh
        ) {
            return true;
        } else {
            return false;
        }
    }

    // Step 2: Change WorkDate
    onChangeWorkDate = (item, isFromInit) => {
        const { WorkDate, InTime, OutTime, PlaceID, MissInOutReason, FileAttachment, Comment, isRefreshState } =
            this.state;

        this.setState(
            {
                WorkDate: {
                    ...WorkDate,
                    value: item,
                    refresh: !WorkDate.refresh
                },
                InTime: {
                    ...InTime,
                    disable: false,
                    refresh: !InTime.refresh
                },
                OutTime: {
                    ...OutTime,
                    disable: false,
                    refresh: !OutTime.refresh
                },
                PlaceID: {
                    ...PlaceID,
                    disable: false,
                    refresh: !PlaceID.refresh
                },

                MissInOutReason: {
                    ...MissInOutReason,
                    disable: false,
                    refresh: !MissInOutReason.refresh
                },
                Comment: {
                    ...Comment,
                    disable: false,
                    refresh: !Comment.refresh
                },
                FileAttachment: {
                    ...FileAttachment,
                    disable: false,
                    refresh: !FileAttachment.refresh
                },
                isRefreshState: !isRefreshState
            },
            () => {
                this.getDataWorkdays();

                // gọi từ componentsDidmount thì k cần gọi
                if (!isFromInit) {
                    // Cập nhật lại ngày đăng ký bên ngoài
                    const { WorkDate } = this.state;

                    const { onUpdateDay, indexDay } = this.props;
                    onUpdateDay && onUpdateDay(indexDay, WorkDate.value);
                }
            }
        );
    };

    // Step 3: Get inTime and outTime from Roster data
    getDataWorkdays = () => {
        const { WorkDate, Profile, InTime, OutTime, Type } = this.state;
        this.showLoading(true);
        if (WorkDate.value) {
            HttpService.Post('[URI_CENTER]/api/Att_TAMScanLogRegister/GetDataWorkDayByProfileAndWorkDate', {
                ProfileID: Profile.ID,
                WorkDate: Vnr_Function.formatDateAPI(WorkDate.value)
            }).then((response) => {
                this.showLoading(false);
                let nextState = {};
                if (response.Status == EnumName.E_SUCCESS && response.Data) {
                    let data = response.Data;
                    if (data.Type === EnumName.E_INOUT) {
                        nextState = {
                            ...nextState,
                            InTime: {
                                ...InTime,
                                value: data.InTime1 ? Vnr_Function.parseDateTime(data.InTime1, false) : null,
                                visible: true,
                                refresh: !InTime.refresh
                            },
                            OutTime: {
                                ...OutTime,
                                value: data.OutTime1 ? Vnr_Function.parseDateTime(data.OutTime1, false) : null,
                                visible: true,
                                refresh: !OutTime.refresh
                            },
                            Type: {
                                ...Type,
                                value: data.Type ? data.Type : null,
                                refresh: !Type.refresh
                            }
                        };
                    } else if (data.Type === EnumName.E_IN) {
                        nextState = {
                            ...nextState,
                            InTime: {
                                ...InTime,
                                value: data.InTime1 ? Vnr_Function.parseDateTime(data.InTime1, false) : null,
                                visible: true,
                                refresh: !InTime.refresh
                            },
                            OutTime: {
                                ...OutTime,
                                value: data.OutTime1 ? Vnr_Function.parseDateTime(data.OutTime1, false) : null, // nhan.nguyen/0172916: [Hotfix_TBCBALL_v8.11.31.01.08] Bug đăng ký nhanh dữ liệu quẹt thẻ ở màn hình Ngày công App bị sai ngày
                                visible: true,
                                disable: true,
                                refresh: !OutTime.refresh
                            },
                            Type: {
                                ...Type,
                                value: data.Type ? data.Type : null,
                                refresh: !Type.refresh
                            }
                        };
                    } else if (data.Type === EnumName.E_OUT) {
                        nextState = {
                            ...nextState,
                            InTime: {
                                ...InTime,
                                value: data.InTime1 ? Vnr_Function.parseDateTime(data.InTime1, false) : null, // nhan.nguyen/0172916: [Hotfix_TBCBALL_v8.11.31.01.08] Bug đăng ký nhanh dữ liệu quẹt thẻ ở màn hình Ngày công App bị sai ngày
                                visible: true,
                                disable: true,
                                refresh: !InTime.refresh
                            },
                            OutTime: {
                                ...OutTime,
                                value: data.OutTime1 ? Vnr_Function.parseDateTime(data.OutTime1, false) : null,
                                visible: true,
                                refresh: !OutTime.refresh
                            },
                            Type: {
                                ...Type,
                                value: data.Type ? data.Type : null,
                                refresh: !Type.refresh
                            }
                        };
                    } else {
                        nextState = {
                            ...nextState,
                            InTime: {
                                ...InTime,
                                value: data.InTime1 ? Vnr_Function.parseDateTime(data.InTime1, false) : null,
                                visible: true,
                                disable: true,
                                refresh: !InTime.refresh
                            },
                            OutTime: {
                                ...OutTime,
                                value: data.OutTime1 ? Vnr_Function.parseDateTime(data.OutTime1, false) : null,
                                visible: true,
                                disable: true,
                                refresh: !OutTime.refresh
                            },
                            Type: {
                                ...Type,
                                value: EnumName.E_INOUT,
                                refresh: !Type.refresh
                            }
                        };
                    }
                } else {
                    nextState = {
                        ...nextState,
                        InTime: {
                            ...InTime,
                            value: null,
                            visible: true,
                            refresh: !InTime.refresh
                        },
                        OutTime: {
                            ...OutTime,
                            value: null,
                            visible: true,
                            refresh: !OutTime.refresh
                        },
                        Type: {
                            ...Type,
                            value: EnumName.E_INOUT,
                            refresh: !Type.refresh
                        }
                    };
                }

                this.setState(nextState);
            });
        }
    };

    removeInOutTime = (type) => {
        const { InTime, OutTime, Type } = this.state;
        let nextState = {};

        if (type == EnumName.E_IN) {
            nextState = {
                ...nextState,
                InTime: {
                    ...InTime,
                    value: null,
                    visible: false,
                    refresh: !InTime.refresh
                },
                Type: {
                    ...Type,
                    value: EnumName.E_OUT,
                    refresh: !Type.refresh
                }
            };
        } else {
            nextState = {
                ...nextState,
                OutTime: {
                    ...OutTime,
                    value: null,
                    visible: false,
                    refresh: !OutTime.refresh
                },
                Type: {
                    ...Type,
                    value: EnumName.E_IN,
                    refresh: !Type.refresh
                }
            };
        }

        this.setState(nextState);
    };

    componentDidMount() {
        this.initState();
    }

    unduData = () => {
        this.initState();
    };

    showLoading = (isShow) => {
        const { showLoading } = this.props;
        showLoading && showLoading(isShow);
    };

    // Step 1: Khởi tạo dữ liệu
    initState = () => {
        const { workDate, record, fieldConfig } = this.props,
            { Profile, isRefreshState } = this.state;

        const profileInfo = dataVnrStorage
            ? dataVnrStorage.currentUser
                ? dataVnrStorage.currentUser.info
                : null
            : null;

        const { E_ProfileID, E_FullName } = EnumName,
            _profile = { ID: profileInfo[E_ProfileID], ProfileName: profileInfo[E_FullName] };

        const { WorkDate, InTime, OutTime, PlaceID, MissInOutReason, FileAttachment, Comment, Type, OrgStructureTransID } = this.state;

        if (record) {
            // Dữ liệu trả ra sai thêm 1 field DataNote
            record.Comment = record.Comment != null ? record.Comment : record.DataNote ? record.DataNote : '';
            // Modify
            let nextState = {
                isRefreshState: !isRefreshState,
                Profile: {
                    ...Profile,
                    ..._profile
                },
                WorkDate: {
                    ...WorkDate,
                    value: record.TimeLog ? moment(record.TimeLog) : null,
                    refresh: !WorkDate.refresh
                },
                PlaceID: {
                    ...PlaceID,
                    disable: false,
                    value: record?.WorkPlaceID
                        ? { WorkPlaceCodeName: record?.WorkPlaceName, WorkPlaceID: record.WorkPlaceID }
                        : record?.PlaceID
                            ? { WorkPlaceCodeName: record?.PlaceName, WorkPlaceID: record.PlaceID }
                            : null,
                    refresh: !PlaceID.refresh
                },
                MissInOutReason: {
                    ...MissInOutReason,
                    disable: false,
                    value: record.MissInOutReason
                        ? { TAMScanReasonMissName: record.TAMScanReasonMissName, ID: record.MissInOutReason }
                        : null,
                    refresh: !MissInOutReason.refresh
                },
                Comment: {
                    ...Comment,
                    disable: false,
                    value: record.Comment ? record.Comment : null,
                    refresh: !Comment.refresh
                },
                Type: {
                    ...Type,
                    disable: false,
                    value: record.Type ? record.Type : null,
                    refresh: !Type.refresh
                },
                OrgStructureTransID: {
                    ...OrgStructureTransID,
                    value: record.OrgStructureTransID ? [{
                        id: record.OrgStructureTransID,
                        Name: record.OrgStructureTransName
                    }] : null,
                    refresh: !OrgStructureTransID.refresh
                }
            };

            if (record.Type == EnumName.E_IN) {
                nextState = {
                    ...nextState,
                    InTime: {
                        ...InTime,
                        value: record.TimeLog ? moment(record.TimeLog) : null,
                        visible: true,
                        disable: false,
                        refresh: !InTime.refresh
                    },
                    OutTime: {
                        ...OutTime,
                        value: null,
                        visible: false,
                        disable: true,
                        refresh: !OutTime.refresh
                    }
                };
                fieldConfig.OutTime.isValid = false;
            } else {
                nextState = {
                    ...nextState,
                    InTime: {
                        ...InTime,
                        value: null,
                        visible: false,
                        disable: true,
                        refresh: !InTime.refresh
                    },
                    OutTime: {
                        ...OutTime,
                        value: record.TimeLog ? moment(record.TimeLog) : null,
                        visible: true,
                        disable: false,
                        refresh: !OutTime.refresh
                    }
                };
                fieldConfig.InTime.isValid = false;
            }

            // Value Acttachment
            if (record.FileAttachment) {
                let valFile = ManageFileSevice.setFileAttachApp(record.FileAttachment);

                nextState = {
                    ...nextState,
                    FileAttachment: {
                        ...FileAttachment,
                        disable: false,
                        value: valFile && valFile.length > 0 ? valFile : null,
                        refresh: !FileAttachment.refresh
                    }
                };
            } else {
                nextState = {
                    ...nextState,
                    FileAttachment: {
                        ...FileAttachment,
                        disable: false,
                        value: null,
                        refresh: !FileAttachment.refresh
                    }
                };
            }

            this.setState(nextState);
        } else {
            this.setState(
                {
                    ...JSON.parse(JSON.stringify(initSateDefault)),
                    Profile: {
                        ...Profile,
                        ..._profile
                    },
                    isRefreshState: !isRefreshState
                },
                () => {
                    this.onChangeWorkDate(Vnr_Function.parseDateTime(workDate), true);
                }
            );
        }
    };

    getAllData = () => {
        const {
                Profile,
                WorkDate,
                InTime,
                OutTime,
                PlaceID,
                MissInOutReason,
                FileAttachment,
                Comment,
                ListInTime,
                ListOutTime,
                Type,
                OrgStructureTransID
            } = this.state,
            { levelApprove, fieldConfig } = this.props;
        // let lstIntime = ListInTime.length > 0 ? ListInTime.map(time => Vnr_Function.formatDateAPI(time)) : [],
        //     lstOuttime = ListOutTime.length > 0 ? ListOutTime.map(time => Vnr_Function.formatDateAPI(time)) : [];
        let lstIntime = [];
        let lstOuttime = [];

        if (ListInTime.length > 0) {
            ListInTime.map((item) => {
                if (item.value !== null) {
                    lstIntime.push(Vnr_Function.formatDateAPI(item.value));
                }
            });
        }

        if (ListOutTime.length > 0) {
            ListOutTime.map((item) => {
                if (item.value !== null) {
                    lstOuttime.push(Vnr_Function.formatDateAPI(item.value));
                }
            });
        }

        if (
            (fieldConfig?.WorkDate?.isValid && !WorkDate.value) ||
            (fieldConfig?.InTime.visibleConfig && fieldConfig?.InTime?.isValid && !InTime.value) ||
            (fieldConfig?.OutTime.visibleConfig && fieldConfig?.OutTime?.isValid && !OutTime.value) ||
            (fieldConfig?.PlaceID.visibleConfig && fieldConfig?.PlaceID?.isValid && !PlaceID.value) ||
            (fieldConfig?.MissInOutReason.visibleConfig &&
                fieldConfig?.MissInOutReason?.isValid &&
                !MissInOutReason.value) ||
            (fieldConfig?.Comment.visibleConfig && fieldConfig?.Comment?.isValid && !Comment.value) ||
            (fieldConfig?.FileAttachment.visibleConfig && fieldConfig?.FileAttachment?.isValid && !FileAttachment.value) ||
            (fieldConfig?.OrgStructureTransID?.visibleConfig &&
                fieldConfig?.OrgStructureTransID?.isValid &&
                !OrgStructureTransID.value)
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

            let orgStructureTransID = null;
            if (Array.isArray(OrgStructureTransID.value) && OrgStructureTransID.value.length > 0)
                orgStructureTransID = OrgStructureTransID.value[0][configOrgStructureTransID.valueField];

            return {
                ProfileID: Profile.ID,
                ListProfileID: [Profile.ID],
                WorkDate: WorkDate.value ? Vnr_Function.formatDateAPI(WorkDate.value, false, true) : null,
                InTime: InTime.value && !InTime.disable ? Vnr_Function.formatDateAPI(InTime.value) : null,
                OutTime: OutTime.value && !OutTime.disable ? Vnr_Function.formatDateAPI(OutTime.value) : null,
                Type: Type.value,
                MissInOutReason: MissInOutReason.value ? MissInOutReason.value.ID : null,
                PlaceID: PlaceID.value ? PlaceID.value.ID : null,
                FileAttachment: FileAttachment.value
                    ? FileAttachment.value.map((item) => item.fileName).join(',')
                    : null,
                Comment: Comment.value ? Comment.value : null,
                ListInTime: lstIntime,
                ListOutTime: lstOuttime,
                LevelApproved: levelApprove,
                OrgStructureTransID: orgStructureTransID
            };
        }
    };

    renderListInTime = () => {
        const { ListInTime, InTime } = this.state;
        const { fieldConfig } = this.props;

        return (
            <View>
                <FlatList
                    data={ListInTime}
                    listKey={(item, index) => 'N' + index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.styAddTimeIn}>
                            <View style={styles.fl1}>
                                <VnrDate
                                    stylePicker={styles.resetBorder}
                                    fieldValid={fieldConfig?.InTime?.isValid}
                                    refresh={InTime.refresh}
                                    response={'string'}
                                    format={'HH:mm'}
                                    type={'time'}
                                    value={item.value}
                                    lable={InTime.lable}
                                    placeHolder={'HRM_PortalApp_TSLRegister_Time'}
                                    disable={false}
                                    onFinish={(value) => {
                                        ListInTime.map((it) => {
                                            if (it.id === item.id) {
                                                it.value = value;
                                            }
                                            return it;
                                        });
                                    }}
                                />
                            </View>
                            <TouchableOpacity
                                style={styles.btnDeleteTimeInOut}
                                onPress={() => {
                                    this.setState({
                                        ListInTime: ListInTime.filter((it) => {
                                            return it.id !== item.id;
                                        })
                                    });
                                }}
                            >
                                <VnrText
                                    style={[styleSheets.lable, styles.styLableGp, { color: Colors.red }]}
                                    i18nKey={'HRM_Common_Delete'}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={(item) => item.id}
                />
            </View>
        );
    };

    renderListOutTime = () => {
        const { ListOutTime, OutTime } = this.state;
        const { fieldConfig } = this.props;
        return (
            <View>
                <FlatList
                    data={ListOutTime}
                    listKey={(item, index) => 'N' + index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.styAddTimeIn}>
                            <View style={styles.fl1}>
                                <VnrDate
                                    stylePicker={styles.resetBorder}
                                    fieldValid={fieldConfig?.OutTime?.isValid}
                                    refresh={OutTime.refresh}
                                    response={'string'}
                                    format={'HH:mm'}
                                    type={'time'}
                                    value={item.value}
                                    lable={OutTime.lable}
                                    placeHolder={'HRM_PortalApp_TSLRegister_Time'}
                                    disable={false}
                                    onFinish={(value) => {
                                        ListOutTime.map((it) => {
                                            if (it.id === item.id) {
                                                it.value = value;
                                            }
                                            return it;
                                        });
                                    }}
                                />
                            </View>
                            <TouchableOpacity
                                style={styles.btnDeleteTimeInOut}
                                onPress={() => {
                                    this.setState({
                                        ListOutTime: ListOutTime.filter((it) => {
                                            return it.id !== item.id;
                                        })
                                    });
                                }}
                            >
                                <VnrText
                                    style={[styleSheets.lable, styles.styLableGp, { color: Colors.red }]}
                                    i18nKey={'HRM_Common_Delete'}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={(item) => item.id}
                />
            </View>
        );
    };

    render() {
        const {
            WorkDate,
            InTime,
            OutTime,
            PlaceID,
            MissInOutReason,
            FileAttachment,
            Comment,
            ListInTime,
            ListOutTime,
            isConfigMultiTimeInOut,
            isError,
            OrgStructureTransID
        } = this.state;

        const { fieldConfig, isShowDelete, onDeleteItemDay, indexDay, onScrollToInputIOS, onGetHighSupervisorFromOrgStructureTransID } = this.props,
            { viewInputMultiline } = stylesVnrPickerV3;

        return (
            <View
                style={styles.wrapItem}
                onLayout={(event) => {
                    const layout = event.nativeEvent.layout;
                    this.layoutHeightItem = layout.height;
                }}
            >
                {/* Thời gian */}
                {/* Title group for time */}
                <View style={styles.flRowSpaceBetween}>
                    <VnrText style={[styleSheets.lable, styles.styLableGp]} i18nKey={'HRM_PortalApp_LableTime'} />

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
                <VnrDate
                    fieldValid={fieldConfig?.WorkDate?.isValid}
                    isCheckEmpty={fieldConfig?.WorkDate?.isValid && isError && !WorkDate.value ? true : false}
                    refresh={WorkDate.refresh}
                    response={'string'}
                    format={'DD/MM/YYYY'}
                    type={'date'}
                    value={WorkDate.value}
                    lable={WorkDate.lable}
                    placeHolder={'HRM_PortalApp_TSLRegister_Date'}
                    onFinish={(item) => this.onChangeWorkDate(item)}
                />

                {/* Giờ vào */}
                {InTime.visible && fieldConfig?.InTime.visibleConfig && (
                    <View>
                        <View style={styles.styAddTimeIn}>
                            <View style={styles.fl1}>
                                <VnrDate
                                    stylePicker={styles.resetBorder}
                                    fieldValid={fieldConfig?.InTime?.isValid}
                                    isCheckEmpty={
                                        fieldConfig?.InTime?.isValid && isError && !InTime.value ? true : false
                                    }
                                    refresh={InTime.refresh}
                                    response={'string'}
                                    format={'HH:mm'}
                                    type={'time'}
                                    value={InTime.value}
                                    lable={InTime.lable}
                                    placeHolder={'HRM_PortalApp_TSLRegister_Time'}
                                    disable={InTime.disable}
                                    onFinish={(item) => {
                                        this.setState({
                                            InTime: {
                                                ...InTime,
                                                value: item,
                                                refresh: !InTime.refresh
                                            }
                                        });
                                    }}
                                />
                            </View>
                            {/* {
                                Type.value == EnumName.E_INOUT && (
                                    <TouchableOpacity
                                        style={styles.btnDeleteTimeInOut}
                                        onPress={() => this.removeInOutTime(EnumName.E_IN)}
                                    >
                                        <VnrText
                                            style={[styleSheets.lable, styles.styLableGp, { color: "red" }]}
                                            i18nKey={'HRM_Common_Delete'}
                                        />
                                    </TouchableOpacity>
                                )
                            } */}
                        </View>

                        {ListInTime.length > 0 ? this.renderListInTime() : null}

                        {isConfigMultiTimeInOut === true ? (
                            <TouchableOpacity
                                style={styles.btnAddTimeInOut}
                                onPress={() => {
                                    this.setState({
                                        ListInTime: [...ListInTime, { id: Vnr_Function.MakeId(24), value: null }]
                                    });
                                }}
                            >
                                <Image
                                    source={require('../../../../../assets/images/approval/add.png')}
                                    style={CustomStyleSheet.marginRight(8)}
                                />
                                <VnrText style={styles.lblAddTimeInOut} i18nKey={'HRM_PortalApp_Add_TimeIn'} />
                            </TouchableOpacity>
                        ) : null}
                    </View>
                )}

                {/* Giờ ra */}
                {OutTime.visible && fieldConfig?.OutTime.visibleConfig && (
                    <View>
                        <View style={styles.styAddTimeIn}>
                            <View style={styles.fl1}>
                                <VnrDate
                                    stylePicker={styles.resetBorder}
                                    fieldValid={fieldConfig?.OutTime?.isValid}
                                    isCheckEmpty={
                                        fieldConfig?.OutTime?.isValid && isError && !OutTime.value ? true : false
                                    }
                                    refresh={OutTime.refresh}
                                    response={'string'}
                                    format={'HH:mm'}
                                    type={'time'}
                                    value={OutTime.value}
                                    lable={OutTime.lable}
                                    placeHolder={'HRM_PortalApp_TSLRegister_Time'}
                                    disable={OutTime.disable}
                                    onFinish={(item) => {
                                        this.setState({
                                            OutTime: {
                                                ...OutTime,
                                                value: item,
                                                refresh: !OutTime.refresh
                                            }
                                        });
                                    }}
                                />
                            </View>
                            {/* {
                                Type.value == EnumName.E_INOUT && (
                                    <TouchableOpacity
                                        style={styles.btnDeleteTimeInOut}
                                        onPress={() => this.removeInOutTime(EnumName.E_OUT)}
                                    >
                                        <VnrText
                                            style={[styleSheets.lable, styles.styLableGp, { color: "red" }]}
                                            i18nKey={'HRM_Common_Delete'}
                                        />
                                    </TouchableOpacity>
                                )
                            } */}
                        </View>

                        {ListOutTime.length > 0 ? this.renderListOutTime() : null}
                        {isConfigMultiTimeInOut === true ? (
                            <TouchableOpacity
                                style={styles.btnAddTimeInOut}
                                onPress={() => {
                                    this.setState({
                                        ListOutTime: [...ListOutTime, { id: Vnr_Function.MakeId(24), value: null }]
                                    });
                                }}
                            >
                                <Image
                                    source={require('../../../../../assets/images/approval/add.png')}
                                    style={CustomStyleSheet.marginRight(8)}
                                />
                                <VnrText style={styles.lblAddTimeInOut} i18nKey={'HRM_PortalApp_Add_TimeOut'} />
                            </TouchableOpacity>
                        ) : null}
                    </View>
                )}

                {/* diễn giải */}
                <View style={styles.styRowControl}>
                    {/* Title group for Explanation */}
                    <View style={styles.flRowSpaceBetween}>
                        <VnrText style={[styleSheets.lable, styles.styLableGp]} i18nKey={'HRM_PortalApp_Explanation'} />
                    </View>
                </View>

                {/* Nơi làm việc */}
                {PlaceID.visible && fieldConfig?.PlaceID.visibleConfig && (
                    <VnrPickerQuickly
                        fieldValid={fieldConfig?.PlaceID?.isValid}
                        isCheckEmpty={fieldConfig?.PlaceID?.isValid && isError && !PlaceID.value ? true : false}
                        refresh={PlaceID.refresh}
                        api={{
                            urlApi: '[URI_CENTER]/api/Att_GetData/GetMultiWorkPlace',
                            type: 'E_GET'
                        }}
                        value={PlaceID.value}
                        textField="WorkPlaceCodeName"
                        valueField="WorkPlaceID"
                        filter={true}
                        filterServer={true}
                        filterParams="text"
                        autoFilter="true"
                        disable={PlaceID.disable}
                        lable={PlaceID.lable}
                        onFinish={(item) => {
                            this.setState({
                                PlaceID: {
                                    ...PlaceID,
                                    value: item,
                                    refresh: !PlaceID.refresh
                                }
                            });
                        }}
                    />
                )}

                {/* Phong ban điều chuyển */}
                {OrgStructureTransID.visible && fieldConfig?.OrgStructureTransID?.visibleConfig &&
                    <View>
                        <VnrTreeView
                            api={{
                                urlApi: '[URI_CENTER]/api/Cat_GetData/GetOrgTreeView',
                                type: 'E_GET'
                            }}
                            refresh={OrgStructureTransID.refresh}
                            isControlCreate={true}
                            fieldValid={fieldConfig?.OrgStructureTransID?.isValid}
                            isCheckEmpty={
                                fieldConfig?.OrgStructureTransID?.isValid && isError && !OrgStructureTransID.value
                                    ? true
                                    : false
                            }
                            fieldName={'OrgStructureIDs'}
                            isCheckChildren={false}
                            response={'string'}
                            textField={configOrgStructureTransID.textField}
                            valueField={configOrgStructureTransID.valueField}
                            newStyle={true}
                            layoutFilter={true}
                            value={OrgStructureTransID.value}
                            lable={OrgStructureTransID.lable}
                            onSelect={(listItem) => {
                                this.setState({
                                    OrgStructureTransID: {
                                        ...OrgStructureTransID,
                                        value: listItem,
                                        refresh: !OrgStructureTransID.refresh
                                    }
                                }, () => {
                                    if (typeof onGetHighSupervisorFromOrgStructureTransID === 'function')
                                        onGetHighSupervisorFromOrgStructureTransID(listItem[0]?.id);
                                });
                            }}
                        />
                    </View>
                }

                {/* Lý do quyên */}
                {MissInOutReason.visible && fieldConfig?.MissInOutReason.visibleConfig && (
                    <VnrPickerQuickly
                        fieldValid={fieldConfig?.MissInOutReason?.isValid}
                        isCheckEmpty={
                            fieldConfig?.MissInOutReason?.isValid && isError && !MissInOutReason.value ? true : false
                        }
                        refresh={MissInOutReason.refresh}
                        api={{
                            urlApi: '[URI_CENTER]/api/Att_GetData/GetMultiTamScanReasonMiss',
                            type: 'E_GET'
                        }}
                        value={MissInOutReason.value}
                        textField="TAMScanReasonMissName"
                        valueField="ID"
                        filter={true}
                        filterServer={true}
                        filterParams="text"
                        disable={MissInOutReason.disable}
                        lable={MissInOutReason.lable}
                        onFinish={(item) => {
                            this.setState({
                                MissInOutReason: {
                                    ...MissInOutReason,
                                    value: item,
                                    refresh: !MissInOutReason.refresh
                                }
                            });
                        }}
                    />
                )}

                {Comment.visible && fieldConfig?.Comment.visibleConfig && (
                    <VnrTextInput
                        fieldValid={fieldConfig?.Comment?.isValid}
                        isCheckEmpty={fieldConfig?.Comment?.isValid && isError && !Comment.value ? true : false}
                        placeHolder={'HRM_PortalApp_PleaseInput'}
                        disable={Comment.disable}
                        lable={Comment.lable}
                        style={[styleSheets.text, viewInputMultiline]}
                        multiline={true}
                        value={Comment.value}
                        onChangeText={(text) => {
                            this.setState({
                                Comment: {
                                    ...Comment,
                                    value: text,
                                    refresh: !Comment.refresh
                                }
                            });
                        }}
                        onFocus={() => {
                            Platform.OS == 'ios' && onScrollToInputIOS(indexDay + 1, this.layoutHeightItem);
                        }}
                        refresh={Comment.refresh}
                    />
                )}

                {/* Tập tin đính kèm */}
                {FileAttachment.visible && fieldConfig?.FileAttachment.visibleConfig && (
                    <View style={{}}>
                        <VnrAttachFile
                            fieldValid={fieldConfig?.FileAttachment?.isValid}
                            isCheckEmpty={
                                fieldConfig?.FileAttachment?.isValid && isError && !FileAttachment.value ? true : false
                            }
                            lable={FileAttachment.lable}
                            disable={FileAttachment.disable}
                            refresh={FileAttachment.refresh}
                            value={FileAttachment.value}
                            multiFile={true}
                            uri={'[URI_CENTER]/api/Sys_Common/saveFileFromApp'}
                            onFinish={(file) => {
                                this.setState({
                                    FileAttachment: {
                                        ...FileAttachment,
                                        value: file,
                                        refresh: !FileAttachment.refresh
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

export default AttTamScanLogRegisterComponent;
