import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
    styleSheets,
    CustomStyleSheet,
    Size,
    Colors,
    styleValid,
    stylesVnrPickerV3
} from '../../../../../constants/styleConfig';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { EnumName } from '../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import styleComonAddOrEdit from '../../../../../constants/styleComonAddOrEdit';
import VnrPickerQuickly from '../../../../../componentsV3/VnrPickerQuickly/VnrPickerQuickly';
import { translate } from '../../../../../i18n/translate';
import DrawerServices from '../../../../../utils/DrawerServices';
import HttpService from '../../../../../utils/HttpService';
import VnrSwitch from '../../../../../componentsV3/VnrSwitch/VnrSwitch';
import VnrSuperFilterWithTextInput from '../../../../../componentsV3/VnrSuperFilterWithTextInput/VnrSuperFilterWithTextInput';
import VnrText from '../../../../../components/VnrText/VnrText';

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
    ShiftChange: {
        label: 'HRM_Attendance_Roster_ChangeShiftID',
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    ReplacementShift: {
        label: 'HRM_Att_ShiftSubstitution_SubstituteShift',
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    IsSubstitute: {
        refresh: false,
        disable: false,
        value: false,
        visible: true,
        visibleConfig: true
    },
    ProfileID2: {
        label: 'HRM_PortalApp_ReplacementStaff',
        disable: false,
        refresh: false,
        value: [],
        visible: true,
        visibleConfig: true,
        isValid: false
    },
    WeekDayChangeShift: [],
    isRefeshChanged: false
};

class AttSubmitShiftChangeComponent extends Component {
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
        // case type === E_CHANGE_SHIFT, call initState(), else don't need, because called initState() from AttSubmitShiftChangeAddOrEdit
        if (this.props.type === EnumName.E_CHANGE_SHIFT)
            this.initState();
    }

    // Step 1: Khởi tạo dữ liệu
    initState = async () => {
        const { record, value, type, workDayRoot } = this.props,
            { Profiles, isRefreshState, Profile, IsSubstitute, ProfileID2, ShiftChange, ReplacementShift } = this.state;
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
            let tempType = type;

            if (value?.ID) {
                nextState = {
                    ...nextState,
                    [`Item${value.ID}`]: value[`Item${value.ID}`]
                        ? {
                            ...value[`Item${value.ID}`]
                        }
                        : null
                }
            }

            if (type !== EnumName.E_CHANGE_SHIFT) {
                if (IsSubstitute.value || record?.ProfileID2) {
                    if (workDayRoot?.startDate !== workDayRoot?.endDate)
                        tempType = EnumName.E_DIFFERENTDAY;
                    else tempType = EnumName.E_SAMEDAY;

                    nextState = {
                        ...nextState,
                        ProfileID2: {
                            ...ProfileID2,
                            value: record?.ProfileID2 ? [{
                                ID: record?.ProfileID2,
                                JoinProfileNameCode: `${record?.ProfileName2}-${record?.CodeEmp2}`,
                                isSelect: true
                            }] : null,
                            refresh: !ProfileID2.refresh
                        }
                    }
                }
                nextState = {
                    ...nextState,
                    IsSubstitute: {
                        ...IsSubstitute,
                        value: record?.ProfileID2 ? true : false,
                        refresh: !IsSubstitute.refresh
                    },
                    ShiftChange: {
                        ...ShiftChange,
                        value: record?.ChangeShiftID ? {
                            ChangeShiftID: record.ChangeShiftID,
                            ChangeShiftName: record?.ChangeShiftName
                        } : null,
                        refresh: !ShiftChange.refresh
                    },

                    ReplacementShift: {
                        ...ReplacementShift,
                        value: record?.AlternateShiftID ? {
                            AlternateShiftID: record.AlternateShiftID,
                            AlternateShiftName: record?.AlternateShiftName
                        } : null,
                        refresh: !ReplacementShift.refresh
                    }
                }
            }
            this.setState({ ...nextState, Type: tempType, isRefreshState: !isRefreshState });
        } else {
            let nextState = {};
            let tempType = type;
            if (value?.ID) {
                nextState = {
                    ...nextState,
                    [`Item${value.ID}`]: null
                }
            }

            if (type !== EnumName.E_CHANGE_SHIFT) {
                if (IsSubstitute.value) {
                    if (workDayRoot?.startDate !== workDayRoot?.endDate)
                        tempType = EnumName.E_DIFFERENTDAY;
                    else tempType = EnumName.E_SAMEDAY;

                    nextState = {
                        ...nextState,
                        ProfileID2: {
                            ...ProfileID2,
                            refresh: !ProfileID2.refresh
                        }
                    }
                }
                nextState = {
                    ...nextState,
                    IsSubstitute: {
                        ...IsSubstitute,
                        refresh: !IsSubstitute.refresh
                    }
                }
            }

            this.setState(
                {
                    ...initSateDefault,
                    ...nextState,
                    Profiles: {
                        ...Profiles,
                        ..._profile
                    },
                    isRefreshState: !isRefreshState,
                    Type: tempType
                }, () => {
                    const { Type } = this.state;
                    (Type !== EnumName.E_CHANGE_SHIFT) && this.handleGetShiftChange(this.props?.workDayRoot, Type, _profile.ID);
                }
            );
        }
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (
            nextProps.isRefresh !== this.props.isRefresh ||
            nextProps.type !== this.props.type ||
            nextProps.value[0]?.isDisable !== this.props.value[0]?.isDisable ||
            JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value) ||
            Vnr_Function.compare(nextState.ReplacementShift.value, this.state.ReplacementShift.value) === false ||
            Vnr_Function.compare(nextState.ShiftChange.value, this.state.ShiftChange.value) === false ||
            Vnr_Function.compare(nextState.ProfileID2.value, this.state.ProfileID2.value) === false ||
            nextState?.ProfileID2?.refresh !== this.state.ProfileID2.refresh ||
            nextState.isError !== this.state.isError ||
            nextState.isRefeshChanged !== this.state.isRefeshChanged ||
            nextState.Type !== this.state.Type ||
            nextState.IsSubstitute.value !== this.state.IsSubstitute.value
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
        const { value } = this.props,
            { IsSubstitute, ShiftChange, ProfileID2, Type, ReplacementShift } = this.state;
        if ((!this.state[`Item${value.ID}`] ||
            !this.state[`Item${value.ID}`].ShiftID) && (Type === EnumName.E_CHANGE_SHIFT)
        ) {
            this.setState({
                isError: true
            }, () => {
                this.props.ToasterSevice().showWarning('HRM_PortalApp_InputValue_Please');
            });
            return null;
        }

        this.setState({
            isError: false
        });

        if (Type === EnumName.E_CHANGE_SHIFT)
            return {
                'ShiftID': this.state[`Item${value.ID}`].ShiftID,
                'DateShift': this.state[`Item${value.ID}`].DateShift,
                'DayOfWeek': this.state[`Item${value.ID}`].DayOfWeek
            }

        let nextState = {};
        if (ReplacementShift.value?.AlternateShiftID) {
            nextState = {
                AlternateShiftID: ReplacementShift.value?.AlternateShiftID
            }
        }

        return {
            ...nextState,
            ChangeShiftID: ShiftChange.value?.ChangeShiftID,
            IsSubstitute: IsSubstitute.value,
            ProfileID2: ProfileID2.value[0]?.ID ? ProfileID2.value[0]?.ID : null,
            Type,
            MonShiftID: null,
            TueShiftID: null,
            WedShiftID: null,
            ThuShiftID: null,
            FriShiftID: null,
            SatShiftID: null,
            SunShiftID: null
        }
    };

    unduData = () => {
        this.initState();
    };

    renderItemChangeShift = (value) => {
        const { isError } = this.state;

        return (
            <View>
                <View
                    style={{
                        paddingHorizontal: Size.defineSpace,
                        paddingTop: Size.defineHalfSpace
                    }}
                >
                    <Text style={[styleSheets.lable, styles.styLableGp]}>
                        {value?.Text}
                    </Text>
                </View>
                <VnrPickerQuickly
                    fieldValid={isError}
                    isCheckEmpty={isError}
                    // refresh={DurationType.refresh}
                    value={this.state[`Item${value.ID}`] ? this.state[`Item${value.ID}`] : null}
                    dataLocal={Array.isArray(value?.value?.ListShift) ? value?.value?.ListShift : []}
                    textField="ShiftName"
                    valueField="ID"
                    filter={true}
                    autoFilter={true}
                    disable={false}
                    lable={'HRM_PortalApp_AlternateShift'}
                    onFinish={(item) => {
                        if (!item)
                            return;
                        this.setState({
                            [`Item${value.ID}`]: {
                                ...item,
                                'ShiftID': item.ID,
                                'DateShift': value.rootdate,
                                'DayOfWeek': value.numberWeekday
                            },
                            isRefeshChanged: !this.state.isRefeshChanged,
                            isError: false
                        });
                    }}
                />
                <View
                    style={stylesLocal.wrapCurrentShift}
                >
                    <Text style={[styleSheets.text, styles.styLableGp]}>
                        {translate('HRM_PortalApp_CurrentShift')}: {value?.value?.ShiftName}
                    </Text>
                </View>
            </View>
        )
    }

    renderItemChangeSchedule = () => {
        const { ReplacementShift, ShiftChange, IsSubstitute, ProfileID2 } = this.state,
            { workDayRoot } = this.props;
        return (
            <View>
                <View>
                    <VnrPickerQuickly
                        fieldValid={true}
                        isCheckEmpty={false}
                        // refresh={DurationType.refresh}
                        value={ShiftChange.value}
                        dataLocal={[]}
                        textField="ChangeShiftName"
                        valueField="ChangeShiftID"
                        filter={false}
                        disable={ShiftChange.disable}
                        lable={ShiftChange.label}
                        onFinish={() => {
                            //
                        }}
                    />
                </View>
                <View>
                    <VnrPickerQuickly
                        fieldValid={true}
                        isCheckEmpty={false}
                        // refresh={DurationType.refresh}
                        value={ReplacementShift.value}
                        dataLocal={[]}
                        textField="AlternateShiftName"
                        valueField="AlternateShiftID"
                        filter={false}
                        disable={ReplacementShift.disable}
                        lable={ReplacementShift.label}
                        onFinish={() => {
                            //
                        }}
                    />
                </View>
                <View style={CustomStyleSheet.backgroundColor(Colors.white)}>
                    <VnrSwitch
                        lable={'HRM_PortalApp_AdditionalSubstitutes'}
                        subLable={translate('HRM_PortalApp_ChooseEmployeeNeedChange')}
                        value={IsSubstitute.value}
                        onFinish={value => {
                            let type = null;
                            // check isSameDay
                            if (value && workDayRoot?.startDate && workDayRoot?.endDate) {
                                if (workDayRoot?.startDate !== workDayRoot?.endDate) {
                                    type = EnumName.E_DIFFERENTDAY;
                                } else {
                                    type = EnumName.E_SAMEDAY;
                                }
                            }

                            this.setState({
                                IsSubstitute: {
                                    ...IsSubstitute,
                                    value: value,
                                    refresh: !IsSubstitute.refresh
                                },
                                Type: type ? type : EnumName.E_CHANGE_SHIFT_COMPANSATION
                            }, () => {
                                this.handleGetReplacementShift(this.props?.workDayRoot,
                                    type ? type : EnumName.E_CHANGE_SHIFT_COMPANSATION,
                                    this.state.Profiles.ID,
                                    this.state.ShiftChange.value);
                            });
                        }}
                    />
                </View>
                {
                    IsSubstitute.value && (
                        <VnrSuperFilterWithTextInput
                            lable={ProfileID2.label}
                            value={ProfileID2.value}
                            onFinish={(listItem) => {
                                this.setState({
                                    ProfileID2: {
                                        ...ProfileID2,
                                        value: [{ ...listItem[0], isSelect: true }],
                                        refresh: !ProfileID2.refresh
                                    }
                                }, () => {
                                    this.handleGetReplacementShift(this.props?.workDayRoot,
                                        this.state.Type,
                                        this.state.Profiles.ID,
                                        ShiftChange.value);
                                });
                            }}
                            refresh={ProfileID2.refresh}
                            api={{
                                urlApi: '[URI_CENTER]/api/Att_GetData/GetProfileDetailForAttendance_App',
                                type: 'E_POST',
                                dataBody: {
                                    page: 1,
                                    pageSize: 100
                                }
                            }}
                            filterParams={'ProfileName'}
                            textField={'JoinProfileNameCode'}
                            textFieldFilter={'FormatProfileCodeLogin'}
                            valueField={'ID'}
                            filter={true}
                            autoFilter={true}
                            filterServer={true}
                            response={'string'}
                            placeholder={'SELECT_ITEM'}
                            isChooseOne={true}
                            licensedDisplay={
                                [
                                    {
                                        'Name': [
                                            'JoinProfileNameCode'
                                        ],
                                        'Avatar': [
                                            'ImagePath'
                                        ],
                                        'UnderName': [
                                            'PositionName',
                                            'HRM_PortalApp_ContractHistory_Position'
                                        ]
                                    }
                                ]
                            }
                        >
                            <View style={stylesLocal.chil_controlVnrSuperTextInput}>
                                <View style={stylesLocal.chil_controlVnrSuperTextInput_left}>
                                    <Text
                                        numberOfLines={2}
                                        style={[styleSheets.text,
                                            stylesVnrPickerV3.styLbNoValuePicker]}
                                    >
                                        {translate(ProfileID2.label)}
                                        {ProfileID2.isValid && <VnrText style={[styleSheets.text, styleValid]} i18nKey={'*'} />}
                                    </Text>
                                </View>
                                <View style={stylesLocal.chil_controlVnrSuperTextInput_right}>
                                    {ProfileID2.value.length === 0 ? (
                                        <Text
                                            style={[
                                                styleSheets.lable,
                                                { fontSize: Size.text + 1, color: Colors.gray_6 }
                                            ]}
                                        >
                                            {translate('SELECT_ITEM')}
                                        </Text>
                                    ) : (
                                        <View style={stylesLocal.flex_Row_Ali_Center}>
                                            {Vnr_Function.renderAvatarCricleByName(
                                                ProfileID2.value[0]?.ImagePath,
                                                ProfileID2.value[0]?.JoinProfileNameCode,
                                                24
                                            )}
                                            <Text
                                                numberOfLines={2}
                                                style={[styleSheets.lable, stylesLocal.textImplementer]}
                                            >
                                                {ProfileID2.value[0]?.JoinProfileNameCode}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </VnrSuperFilterWithTextInput>
                    )
                }
            </View>
        )
    }

    handleGetShiftChange = (workDayRoot, type = this.state.Type, ProfileID = this.state.Profile.ID) => {
        try {
            if (!type || !workDayRoot?.startDate || !workDayRoot?.endDate || !ProfileID) {
                this.props
                    .ToasterSevice()
                    .showWarning(translate('HRM_Message_GetDataServices_Error'), 3000);
                return;
            }
            let payload = {
                'DateStart': workDayRoot.startDate,
                'Type': type,
                'IsDateStart': true,
                'ProfileID': ProfileID
            };

            this.showLoading(true);
            HttpService.Post('[URI_CENTER]/api/Att_Roster/GetShiftByDate', payload)
                .then((res) => {
                    this.showLoading(false);
                    if (res && res?.Status === EnumName.E_SUCCESS) {
                        if (res?.Data?.Message) {
                            this.props
                                .ToasterSevice()
                                .showWarning(res?.Data?.Message, 3000);
                            this.props?.onDisableButtonSave(true);
                            return;
                        }

                        // cale handleGetReplacementShift then setState one time
                        this.handleGetReplacementShift(workDayRoot, type, ProfileID, res?.Data, true);
                    }
                })
                .catch((error) => {
                    this.showLoading(false);
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                });
        } catch (error) {
            this.showLoading(false);
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    }

    handleGetReplacementShift = (workDayRoot, type = this.state.Type, ProfileID = this.state.Profiles.ID, currentShift, isShiftChange = false) => {
        try {
            const { ReplacementShift, ShiftChange, IsSubstitute, ProfileID2 } = this.state;
            let payload = {
                'DateStart': workDayRoot.startDate,
                'DateEnd': workDayRoot.endDate,
                'Type': type,
                'IsDateEnd': true
            };

            // case: dateState not have shift when currentShift === null
            if (currentShift?.ChangeShiftID) {
                payload = {
                    ...payload,
                    'ChangeShiftID': currentShift?.ChangeShiftID
                }
            }

            // case: call form function handleGetShiftChange()
            if (isShiftChange) {
                payload = {
                    ...payload,
                    ProfileID: ProfileID,
                    AlternateShiftID: currentShift?.ChangeShiftID
                }
            }

            // case: have tick choose Replacement Staff
            if (IsSubstitute.value) {
                delete payload.AlternateShiftID;
                payload = {
                    ...payload,
                    ProfileID: ProfileID,
                    IsSubstitute: IsSubstitute.value
                }
            }

            // case: choose Replacement Staff
            if (ProfileID2.value[0]?.ID) {
                payload = {
                    ...payload,
                    ProfileID2: ProfileID2.value[0]?.ID
                }
            }

            this.showLoading(true);
            HttpService.Post('[URI_CENTER]/api/Att_Roster/GetShiftByDate', payload)
                .then((res) => {
                    this.showLoading(false);
                    if (res && res?.Status === EnumName.E_SUCCESS) {
                        let nextState = {};

                        if (res?.Data?.AlternateShiftID) {
                            nextState = {
                                ReplacementShift: {
                                    ...ReplacementShift,
                                    value: {
                                        AlternateShiftID: res?.Data?.AlternateShiftID,
                                        AlternateShiftName: res?.Data?.AlternateShiftName
                                    },
                                    refresh: !ReplacementShift.refresh
                                }
                            }
                        }

                        this.setState({
                            ...nextState,
                            ShiftChange: {
                                ...ShiftChange,
                                value: currentShift,
                                refresh: !ShiftChange.refresh
                            }
                        }, () => {
                            if (res?.Data?.Message) {
                                this.props
                                    .ToasterSevice()
                                    .showWarning(res?.Data?.Message, 3000);
                                this.props?.onDisableButtonSave(true);
                                return;
                            }
                            this.props?.onDisableButtonSave(false);
                        });
                    }
                })
                .catch((error) => {
                    this.showLoading(false);
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                });
        } catch (error) {
            this.showLoading(false);
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    }

    render() {
        const { value } = this.props,
            { Type } = this.state;
        return (
            <View
                style={CustomStyleSheet.backgroundColor(Colors.white)}
                onLayout={event => {
                    const layout = event.nativeEvent.layout;
                    this.layoutHeightItem = layout.height;
                }}
            >
                {
                    Type === EnumName.E_CHANGE_SHIFT ? (
                        (value && !value?.isDisable) && this.renderItemChangeShift(value)
                    ) : (
                        this.renderItemChangeSchedule()
                    )
                }
            </View>
        );
    }
}

const styles = styleComonAddOrEdit;
const stylesLocal = StyleSheet.create({
    wrapCurrentShift: {
        paddingHorizontal: Size.defineSpace,
        paddingVertical: Size.defineHalfSpace - 2,
        backgroundColor: Colors.gray_2,
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5
    },
    chil_controlVnrSuperTextInput: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    chil_controlVnrSuperTextInput_left: {
        flex: 1,
        maxWidth: '50%',
        flexDirection: 'row',
        alignItems: 'center'
    },

    chil_controlVnrSuperTextInput_right: {
        flex: 1,
        maxWidth: '50%',
        alignItems: 'flex-end'
    },
    flex_Row_Ali_Center: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    textImplementer: {
        fontSize: Size.text + 1,
        marginLeft: 6,
        color: Colors.blue,
        maxWidth: '90%'
    }
});

export default AttSubmitShiftChangeComponent;
