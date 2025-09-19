import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, TouchableWithoutFeedback, Text } from 'react-native';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    Colors,
    styleSafeAreaView,
    stylesListPickerControl,
    styleValid,
    Size,
    styleViewTitleForGroup,
    stylesModalPopupBottom,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import VnrDate from '../../../../../components/VnrDate/VnrDate';
import VnrPicker from '../../../../../components/VnrPicker/VnrPicker';
import HttpService from '../../../../../utils/HttpService';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import VnrAttachFile from '../../../../../components/VnrAttachFile/VnrAttachFile';
import { ConfigField } from '../../../../../assets/configProject/ConfigField';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import DrawerServices from '../../../../../utils/DrawerServices';
import { EnumIcon, EnumName } from '../../../../../assets/constant';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { IconColse } from '../../../../../constants/Icons';
import VnrPickerQuickly from '../../../../../components/VnrPickerQuickly/VnrPickerQuickly';
import format from 'number-format.js';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { translate } from '../../../../../i18n/translate';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import VnrMonthYear from '../../../../../components/VnrMonthYear/VnrMonthYear';

let enumName = null,
    profileInfo = null;

const initSateDefault = {
    ID: null,
    Profile: {
        label: 'HRM_Attendance_WorkDay_ProfileID',
        ID: null,
        ProfileName: '',
        disable: true,
        visible: false
    },
    RelativeID: {
        label: 'HRM_Recruitment_UnusualAllowance_RelativeName',
        data: [],
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    RelativeTypeName: {
        label: 'HRM_Recruitment_UnusualAllowance_RelativeTypeName',
        disable: true,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    UnusualEDTypeID: {
        label: 'HRM_Payroll_UnusualED_UnusualEDTypeID',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    DateHire: {
        label: 'HRM_HR_Profile_DateHire',
        value: null,
        refresh: false,
        disable: true,
        visibleConfig: true,
        visible: true
    },
    DateOccur: {
        label: 'HRM_Sal_UnusualED_DateEffect',
        value: new Date(),
        refresh: false,
        disable: true,
        visibleConfig: true,
        visible: true
    },
    MonthStart: {
        label: 'HRM_Payroll_UnusualED_MonthStart',
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },
    YearOfBirth: {
        label: 'HRM_HR_Relatives_RelativeDayOfBirth',
        value: null,
        refresh: false,
        disable: true,
        visibleConfig: true,
        visible: false
    },
    YearOfLose: {
        label: 'HRM_HR_Relatives_LostDay',
        value: null,
        refresh: false,
        disable: true,
        visibleConfig: true,
        visible: false
    },
    DateOfWedding: {
        label: 'HRM_HRE_Relatives_DateOfWedding',
        value: null,
        refresh: false,
        disable: true,
        visibleConfig: true,
        visible: false
    },
    Amount: {
        label: 'HRM_Payroll_UnusualED_Amount',
        disable: true,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    CurrencyID: {
        label: 'HRM_Payroll_UnusualED_Amount',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true,
        data: []
    },
    Notes: {
        label: 'HRM_Category_Subject_Notes',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    Attachment: {
        label: 'HRM_Sal_UnusualAllownance_Attachment',
        visible: true,
        visibleConfig: true,
        disable: false,
        refresh: false,
        value: null
    },
    modalErrorDetail: {
        isModalVisible: false,
        cacheID: null,
        data: []
    },
    fieldValid: {}
};

export default class SalSubmitUnusualAllowanceAddOrEdit extends Component {
    constructor(props) {
        super(props);

        this.state = initSateDefault;
        this.setVariable();
        //set title screen
        props.navigation.setParams({
            title:
                props.navigation.state.params && props.navigation.state.params.record
                    ? 'HRM_Recruitment_UnusualAllowance_Update_Title'
                    : 'HRM_Recruitment_UnusualAllowance_Create_Title'
        });
    }

    setVariable = () => {
        //biến trạng thái
        this.isModify = false;
        //check processing cho nhấn lưu nhiều lần
        this.isProcessing = false;

        // this xử lý save
        this.ProfileRemoveIDs = null;
        this.IsRemoveAndContinue = null;
        this.CacheID = null;
    };

    //#region [khởi tạo - lấy các dữ liệu cho control, lấy giá trị mặc đinh]
    //promise get config valid
    getConfigValid = (tblName, isRefresh) => {
        //get config validate
        VnrLoadingSevices.show();
        HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + tblName).then((res) => {
            VnrLoadingSevices.hide();
            if (res) {
                try {
                    //map field hidden by config
                    const _configField =
                        ConfigField && ConfigField.value['SalSubmitUnusualAllowanceAddOrEdit']
                            ? ConfigField.value['SalSubmitUnusualAllowanceAddOrEdit']['Hidden']
                            : [];

                    let nextState = { fieldValid: res };
                    _configField.forEach((fieldConfig) => {
                        let _field = this.state[fieldConfig];
                        if (_field && typeof _field === 'object') {
                            _field = {
                                ..._field,
                                visibleConfig: false
                            };

                            nextState = {
                                ...nextState,
                                [fieldConfig]: { ..._field }
                            };
                        }
                    });

                    this.setState({ ...nextState }, () => {
                        enumName = EnumName;
                        profileInfo = dataVnrStorage
                            ? dataVnrStorage.currentUser
                                ? dataVnrStorage.currentUser.info
                                : null
                            : null;

                        let { record } = !isRefresh ? this.props.navigation.state.params : {};

                        //get config khi đăng ký
                        if (!record) {
                            this.initData();
                        } else {
                            this.isModify = true;
                            this.getRecordAndConfigByID(record, this.handleSetState);
                        }
                    });
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            }
        });
    };

    componentDidMount() {
        this.getConfigValid('UnusualAllowanceinfoEventPortal');
    }

    initData = () => {
        const { E_ProfileID, E_FullName } = enumName,
            _profile = { ID: profileInfo[E_ProfileID], ProfileName: profileInfo[E_FullName] },
            { Profile } = this.state;

        let nextState = {
            Profile: {
                ...Profile,
                ..._profile
            }
        };

        this.setState(nextState, () => {
            //this.getRalativeByProfileId();
            this.getDateHireForProfile();
            this.getDefaultValueCurrencyID();

            // 0151531: [AVN_Hotfix_W02][App] Bổ sung cấu hình tích chọn ẩn hiện loại phụ cấp hiếu hỷ từ task 0151525 ở MH "Thanh toán hiếu hỷ"
            this.getDataUnusualEDTypeID();
        });
    };

    refreshView = () => {
        this.props.navigation.setParams({ title: 'HRM_Recruitment_UnusualAllowance_Create_Title' });
        this.setVariable();
        this.setState(initSateDefault, () => this.getConfigValid('UnusualAllowanceinfoEventPortal', true));
    };

    getDataUnusualEDTypeID = () => {
        VnrLoadingSevices.show();
        const { UnusualEDTypeID } = this.state;
        HttpService.Get('[URI_HR]/Cat_GetData/GetMultiCfgByUnusualAllowanceGroupEvent?type=E_EVENT').then((data) => {
            if (data && data.length > 0) {
                let dataHandleHide = data.filter((e) => {
                    return e.IsHideOnPortal !== true;
                });
                VnrLoadingSevices.hide();
                this.setState({
                    UnusualEDTypeID: {
                        ...UnusualEDTypeID,
                        data: [...dataHandleHide],
                        refresh: !UnusualEDTypeID.refresh
                    }
                });
            }
        });
    };

    getDateHireForProfile = () => {
        const { Profile, DateHire, DateOccur } = this.state;
        HttpService.Post('[URI_HR]/Sal_GetData/GetDateHireForProfile', { profileid: Profile.ID }).then((data) => {
            if (data) {
                this.setState({
                    DateHire: {
                        ...DateHire,
                        value: data,
                        refresh: !DateHire.refresh
                    },
                    DateOccur: {
                        ...DateOccur,
                        value: new Date(),
                        refresh: !DateOccur.refresh
                    }
                });
            }
        });
    };

    getDefaultValueCurrencyID = () => {
        VnrLoadingSevices.show();
        HttpService.MultiRequest([
            HttpService.Get('[URI_HR]/Cat_GetData/GetMultiCurrency'),
            HttpService.Post('[URI_HR]/Sal_GetData/GetDefaultValue', { tableName: 'Cat_Currency' })
        ]).then((res) => {
            VnrLoadingSevices.hide();
            try {
                if (res && res.length) {
                    const dataCurrency = res[0] ? res[0] : [],
                        valueCurrency = res[1],
                        { CurrencyID } = this.state;

                    let finValueCurrency = null;
                    if (dataCurrency && dataCurrency.length && valueCurrency) {
                        finValueCurrency = dataCurrency.find((item) => item.ID == valueCurrency);
                    }

                    this.setState({
                        CurrencyID: {
                            ...CurrencyID,
                            data: [...dataCurrency],
                            value: finValueCurrency,
                            refresh: !CurrencyID.refresh
                        }
                    });
                } else {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 5000);
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    newDateFb = (value) => {
        // eslint-disable-next-line no-useless-escape
        var regex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
        if (regex.test(value) == true) {
            return moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss');
        } else {
            return moment(value).format('YYYY-MM-DD HH:mm:ss');
        }
    };

    handleSetState = (record, res) => {
        const {
                Profile,
                RelativeID,
                RelativeTypeName,
                UnusualEDTypeID,
                DateHire,
                DateOccur,
                MonthStart,
                YearOfBirth,
                YearOfLose,
                DateOfWedding,
                Amount,
                CurrencyID,
                Notes,
                Attachment
            } = this.state,
            item = res[0],
            dataRalative = res[1],
            dataCurrencyID = res[2],
            dataUnusualEDTypeID = res[3];

        let nextState = {},
            _dataRalative = [],
            _dataCurrencyID = [];

        if (dataRalative) {
            _dataRalative = [...dataRalative];
        }

        if (dataCurrencyID) {
            _dataCurrencyID = [...dataCurrencyID];
        }

        // 0151531: [AVN_Hotfix_W02][App] Bổ sung cấu hình tích chọn ẩn hiện loại phụ cấp hiếu hỷ từ task 0151525 ở MH "Thanh toán hiếu hỷ"
        let dataHandleHide = [];
        if (dataUnusualEDTypeID && dataUnusualEDTypeID.length > 0)
            dataHandleHide = dataUnusualEDTypeID.filter((e) => {
                if (e.IsHideOnPortal == true && item.UnusualEDTypeID == e.ID) {
                    item.UnusualEDTypeID = null;
                    item.UnusualAllowanceCfgName = null;
                }
                return e.IsHideOnPortal !== true;
            });

        nextState = {
            ID: record.ID,
            Profile: {
                ...Profile,
                ID: item.ProfileID,
                ProfileName: item.ProfileName
            },
            RelativeID: {
                ...RelativeID,
                data: _dataRalative,
                disable: false,
                value: item.RelativeID ? { ID: item.RelativeID, RelativeName: item.RelativeName } : null,
                refresh: !RelativeID.refresh
            },
            RelativeTypeName: {
                ...RelativeTypeName,
                value: item.RelativeTypeName,
                refresh: !RelativeTypeName.refresh
            },
            UnusualEDTypeID: {
                ...UnusualEDTypeID,
                data: [...dataHandleHide],
                value: item.UnusualEDTypeID
                    ? { ID: item.UnusualEDTypeID, UnusualAllowanceCfgName: item.UnusualAllowanceCfgName }
                    : null,
                refresh: !UnusualEDTypeID.refresh
            },
            DateHire: {
                ...DateHire,
                value: item.DateHire ? moment(item.DateHire).format('YYYY-MM-DD HH:mm:ss') : null,
                refresh: !DateHire.refresh
            },
            DateOccur: {
                ...DateOccur,
                value: item.DateOccur ? moment(item.DateOccur).format('YYYY-MM-DD HH:mm:ss') : null,
                refresh: !DateOccur.refresh
            },
            MonthStart: {
                ...MonthStart,
                value: item.MonthStart ? moment(item.MonthStart).format('YYYY-MM-DD HH:mm:ss') : null,
                refresh: !MonthStart.refresh
            },
            YearOfLose: {
                ...YearOfLose,
                value: item.YearOfLose ? this.newDateFb(item.YearOfLose) : null,
                visible: false,
                refresh: !YearOfLose.refresh
            },
            DateOfWedding: {
                ...DateOfWedding,
                value: item.DateOfWedding ? this.newDateFb(item.DateOfWedding) : null,
                visible: false,
                refresh: !DateOfWedding.refresh
            },
            YearOfBirth: {
                ...YearOfBirth,
                value: item.YearOfBirth ? this.newDateFb(item.YearOfBirth) : null,
                visible: false,
                refresh: !YearOfBirth.refresh
            },
            Amount: {
                ...Amount,
                value: item.Amount && item.Amount != 0 ? format('#,###.#', item.Amount) : '0',
                refresh: !Amount.refresh
            },
            CurrencyID: {
                ...CurrencyID,
                data: _dataCurrencyID,
                value: item.CurrencyID ? { ID: item.CurrencyID, CurrencyName: item.CurrencyName } : null,
                refresh: !CurrencyID.refresh
            },
            Notes: {
                ...Notes,
                value: item.Notes,
                refresh: !Notes.refresh
            },
            Attachment: {
                ...Attachment,
                value: item.lstFileAttach,
                refresh: !Attachment.refresh
            }
        };

        this.setState(nextState, () => {
            this.showRelativeType();
        });
    };

    getRecordAndConfigByID = (record, _handleSetState) => {
        const { ID } = record;
        let arrRequest = [
            HttpService.Get('[URI_HR]/api/Sal_UnusualAllowance/GetById?ID=' + ID),
            HttpService.Post('[URI_HR]/Sal_GetData/GetRalativeByProfileId', { profileid: record.ProfileID }),
            HttpService.Get('[URI_HR]/Cat_GetData/GetMultiCurrency'),
            HttpService.Get('[URI_HR]/Cat_GetData/GetMultiCfgByUnusualAllowanceGroupEvent?type=E_EVENT')
        ];

        VnrLoadingSevices.show();
        HttpService.MultiRequest(arrRequest).then((res) => {
            VnrLoadingSevices.hide();
            try {
                if (res && res.length) {
                    _handleSetState(record, res);
                } else {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 5000);
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };
    //#endregion

    //change RelativeID
    onChangeRelativeID = (item) => {
        const { RelativeID } = this.state;
        let nextState = {
            RelativeID: {
                ...RelativeID,
                value: item,
                refresh: !RelativeID.refresh
            }
        };

        this.setState(nextState, () => {
            this.showRelativeType();
        });
    };

    showRelativeType = async () => {
        const { RelativeID, RelativeTypeName, UnusualEDTypeID, YearOfBirth, YearOfLose, DateOfWedding } = this.state;
        if (RelativeID.value) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Sal_GetData/GetRalativeTypeByRelativeId', {
                relativeid: RelativeID.value.ID,
                relativetypeFilter: ''
            }).then(async (data) => {
                VnrLoadingSevices.hide();

                if (data.length > 0) {
                    const item = data[0];
                    let nextState = {
                        RelativeTypeName: {
                            ...RelativeTypeName,
                            value: item.RelativeTypeName,
                            refresh: !RelativeTypeName.refresh
                        }
                    };

                    let _UnusualEDTypeID = UnusualEDTypeID.value ? UnusualEDTypeID.value.ID : null;
                    let sFamilyBusinessType = await this.GetFamilyBusinessTypeUnusualAllowanceCfg(_UnusualEDTypeID);
                    if (sFamilyBusinessType == 'E_FAMILYBUSINESS_SON') {
                        nextState = {
                            ...nextState,
                            YearOfBirth: {
                                ...YearOfBirth,
                                value: item && item.YearOfBirth ? this.newDateFb(item.YearOfBirth) : null,
                                visible: true, // show
                                disable: true,
                                refresh: !YearOfBirth.refresh
                            }
                        };
                    } else if (sFamilyBusinessType == 'E_FAMILYBUSINESS_MARRIED') {
                        nextState = {
                            ...nextState,
                            DateOfWedding: {
                                ...DateOfWedding,
                                value: item && item.DateOfWedding ? this.newDateFb(item.DateOfWedding) : null,
                                visible: true, // show
                                disable: true,
                                refresh: !DateOfWedding.refresh
                            }
                        };
                    } else if (sFamilyBusinessType == 'E_FAMILYBUSINESS_MOURNING') {
                        nextState = {
                            ...nextState,
                            YearOfLose: {
                                ...YearOfLose,
                                value: item && item.YearOfLose ? this.newDateFb(item.YearOfLose) : null,
                                visible: true, // show
                                disable: true,
                                refresh: !YearOfLose.refresh
                            }
                        };
                    }

                    this.setState(nextState);
                }
            });
        }
    };

    //change DateHire
    onChangeDateHire = (item) => {
        const { BusinessTrip } = this.state;
        let nextState = {
            BusinessTrip: {
                ...BusinessTrip,
                value: item,
                refresh: !BusinessTrip.refresh
            }
        };

        this.setState(nextState, () => {
            this.GetDataBusinessTravel();
            this.ReadOnlyHourFromHourTo();
        });
    };

    //change UnusualEDTypeID
    onChangeUnusualEDTypeID = (item) => {
        const { UnusualEDTypeID, RelativeTypeName, YearOfBirth, YearOfLose, DateOfWedding } = this.state;

        let nextState = {
            UnusualEDTypeID: {
                ...UnusualEDTypeID,
                value: item,
                refresh: !UnusualEDTypeID.refresh
            },
            RelativeTypeName: {
                ...RelativeTypeName,
                value: null,
                refresh: !RelativeTypeName.refresh
            },
            YearOfLose: {
                ...YearOfLose,
                value: null,
                visible: false,
                refresh: !YearOfLose.refresh
            },
            DateOfWedding: {
                ...DateOfWedding,
                value: null,
                visible: false,
                refresh: !DateOfWedding.refresh
            },
            YearOfBirth: {
                ...YearOfBirth,
                value: null,
                visible: false,
                refresh: !YearOfBirth.refresh
            }
        };

        this.setState(nextState, () => {
            this.changeMonthStart();
            this.SetHideShowControlByFamilyBusinessType();
            this.LoadRelativeByFamilyBusinessType();
        });
    };

    GetFamilyBusinessTypeUnusualAllowanceCfg = async (UnusualEDTypeID) => {
        if (UnusualEDTypeID != '' && UnusualEDTypeID != null) {
            VnrLoadingSevices.show();

            const data = await HttpService.Post('[URI_HR]/Cat_GetData/GetFamilyBusinessTypeUnusualAllowanceCfg', {
                unusualEDTypeID: UnusualEDTypeID
            });

            VnrLoadingSevices.hide();
            if (data != null) return data.FamilyBusinessType;
            else return null;
        } else {
            return null;
        }
    };

    SetHideShowControlByFamilyBusinessType = async () => {
        const { UnusualEDTypeID, YearOfBirth, YearOfLose, DateOfWedding } = this.state;

        let _UnusualEDTypeID = UnusualEDTypeID.value ? UnusualEDTypeID.value.ID : null;
        let sFamilyBusinessType = await this.GetFamilyBusinessTypeUnusualAllowanceCfg(_UnusualEDTypeID);

        if (sFamilyBusinessType) {
            let nextState = {};
            if (sFamilyBusinessType == 'E_FAMILYBUSINESS_SON') {
                nextState = {
                    ...nextState,
                    YearOfLose: {
                        ...YearOfLose,
                        value: null,
                        visible: false,
                        disable: true,
                        refresh: !YearOfLose.refresh
                    },
                    DateOfWedding: {
                        ...DateOfWedding,
                        value: null,
                        visible: false,
                        disable: true,
                        refresh: !DateOfWedding.refresh
                    },
                    YearOfBirth: {
                        ...YearOfBirth,
                        value: null,
                        visible: true, // show
                        disable: true,
                        refresh: !YearOfBirth.refresh
                    }
                };
            } else if (sFamilyBusinessType == 'E_FAMILYBUSINESS_MARRIED') {
                nextState = {
                    ...nextState,
                    YearOfLose: {
                        ...YearOfLose,
                        value: null,
                        visible: false,
                        disable: true,
                        refresh: !YearOfLose.refresh
                    },
                    DateOfWedding: {
                        ...DateOfWedding,
                        value: null,
                        visible: true, // show
                        disable: true,
                        refresh: !DateOfWedding.refresh
                    },
                    YearOfBirth: {
                        ...YearOfBirth,
                        value: null,
                        visible: false,
                        disable: true,
                        refresh: !YearOfBirth.refresh
                    }
                };
            } else if (sFamilyBusinessType == 'E_FAMILYBUSINESS_MOURNING') {
                nextState = {
                    ...nextState,
                    YearOfLose: {
                        ...YearOfLose,
                        value: null,
                        visible: true, // show
                        disable: true,
                        refresh: !YearOfLose.refresh
                    },
                    DateOfWedding: {
                        ...DateOfWedding,
                        value: null,
                        visible: false,
                        disable: true,
                        refresh: !DateOfWedding.refresh
                    },
                    YearOfBirth: {
                        ...YearOfBirth,
                        value: null,
                        visible: false,
                        disable: true,
                        refresh: !YearOfBirth.refresh
                    }
                };
            }

            this.setState(nextState);
        }

        // $("#RelativeTypeName").attr('readonly', true);
    };

    //change DateOccur
    onChangeDateOccur = (item) => {
        const { DateOccur } = this.state;
        let nextState = {
            DateOccur: {
                ...DateOccur,
                value: item,
                refresh: !DateOccur.refresh
            }
        };

        this.setState(nextState, () => this.changeMonthStart());
    };

    changeMonthStart = () => {
        const { DateOccur, UnusualEDTypeID, Amount } = this.state;

        let _monthStart = DateOccur.value ? moment(DateOccur.value).format('YYYY-MM-DD 00:00:00') : null,
            _unusualEDTypeID = UnusualEDTypeID.value ? UnusualEDTypeID.value.ID : null;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Cat_GetData/GetUnusualAllowanceCfgAmount', {
            UnusualAllowanceID: _unusualEDTypeID,
            Month: _monthStart
        }).then((data) => {
            //var numerictextbox = $("#Amount").data("kendoNumericTextBox");
            //numerictextbox.value(data);
            VnrLoadingSevices.hide();
            this.setState({
                Amount: {
                    ...Amount,
                    value: format('#,###.#', data.toString()),
                    refresh: !Amount.refresh
                }
            });
        });
    };

    LoadRelativeByFamilyBusinessType = () => {
        const { UnusualEDTypeID, Profile, RelativeID, RelativeTypeName } = this.state;
        let _unusualEDTypeID = UnusualEDTypeID.value ? UnusualEDTypeID.value.ID : null;

        if (_unusualEDTypeID) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Sal_GetData/GetRalativeByProfileIdByFamilyBusinessType', {
                profileid: Profile.ID,
                unusualEDTypeID: _unusualEDTypeID
            }).then((data) => {
                VnrLoadingSevices.hide();
                let valueRelative = null;

                if (data.length == 1) {
                    valueRelative = data[0];
                }

                this.setState(
                    {
                        RelativeID: {
                            ...RelativeID,
                            data: [...data],
                            disable: false,
                            value: valueRelative,
                            refresh: !RelativeID.refresh
                        },
                        RelativeTypeName: {
                            ...RelativeTypeName,
                            value: valueRelative != null ? valueRelative['RelativeTypeName'] : null,
                            refresh: !RelativeTypeName.refresh
                        }
                    },
                    () => {
                        this.showRelativeType();
                    }
                );
            });
        }
    };

    onSave = (navigation, isCreate, isSend) => {
        if (this.isProcessing) {
            return;
        }

        this.isProcessing = true;

        const {
            ID,
            Profile,
            RelativeID,
            RelativeTypeName,
            UnusualEDTypeID,
            DateHire,
            DateOccur,
            MonthStart,
            Amount,
            CurrencyID,
            Notes,
            Attachment,
            YearOfBirth,
            YearOfLose,
            DateOfWedding,
            modalErrorDetail
        } = this.state;
        let param = {
            Amount: Amount.value ? parseFloat(Amount.value.split(',').join('')) : null,
            Attachment: Attachment.value ? Attachment.value.map((item) => item.fileName).join(',') : null,
            CurrencyID: CurrencyID.value ? CurrencyID.value.ID : null,
            DateHire: DateHire.value ? moment(DateHire.value).format('YYYY-MM-DD 00:00:00') : null,
            DateOccur: DateOccur.value ? moment(DateOccur.value).format('YYYY-MM-DD 00:00:00') : null,
            IsPortal: true,
            MonthStart: MonthStart.value ? moment(MonthStart.value).format('YYYY-MM-DD 00:00:00') : null,
            YearOfBirth: YearOfBirth.value ? moment(YearOfBirth.value).format('YYYY-MM-DD 00:00:00') : null,
            YearOfLose: YearOfLose.value ? moment(YearOfLose.value).format('YYYY-MM-DD 00:00:00') : null,
            DateOfWedding: DateOfWedding.value ? moment(DateOfWedding.value).format('YYYY-MM-DD 00:00:00') : null,
            Notes: Notes.value,
            ProfileID: Profile.ID,
            ProfileIDs: Profile.ID,
            RelativeID: RelativeID.value ? RelativeID.value.ID : null,
            RelativeTypeName: RelativeTypeName.value,
            // Status: "E_SUBMIT",
            UnusualEDTypeID: UnusualEDTypeID.value ? UnusualEDTypeID.value.ID : null,
            UserID: dataVnrStorage.currentUser.info.userid,
            UserSubmit: Profile.ID,
            validateUnusualAllowanceinfo: 'UnusualAllowanceinfoEventPortal'
        };

        if (ID) {
            param = {
                ...param,
                ID
            };
        }

        if (isSend) {
            param = {
                ...param,
                IsSendMailPortal: true
            };
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/api/Sal_UnusualAllowance', param).then((data) => {
            VnrLoadingSevices.hide();

            if (data) {
                if (data.ErrorRespone) {
                    if (data.ErrorRespone.IsBlock == true) {
                        if (data.ErrorRespone.IsShowRemoveAndContinue) {
                            //xử lý lại event Save
                            this.isProcessing = false;

                            AlertSevice.alert({
                                title: translate('Hrm_Notification'),
                                iconType: EnumIcon.E_WARNING,
                                message: translate('HRM_Attendance_Message_InvalidRequestDataPleaseCheckAgain'),
                                //lưu và tiếp tục
                                colorSecondConfirm: Colors.primary,
                                textSecondConfirm: translate('Button_OK'),
                                onSecondConfirm: () => {
                                    this.ProfileRemoveIDs = data.ErrorRespone.ProfileRemoveIDs;
                                    this.IsRemoveAndContinue = true;
                                    this.CacheID = data.ErrorRespone.CacheID;
                                    this.onSave(navigation, isCreate, isSend);
                                },
                                //đóng
                                onCancel: () => {},
                                //chi tiết lỗi
                                textRightButton: translate('Button_Detail'),
                                onConfirm: () => {
                                    this.setState(
                                        {
                                            modalErrorDetail: {
                                                ...modalErrorDetail,
                                                cacheID: data.ErrorRespone.CacheID,
                                                isModalVisible: true
                                            }
                                        },
                                        () => {
                                            this.getErrorMessageRespone();
                                            this.isProcessing = false;
                                        }
                                    );
                                }
                            });
                        } else {
                            //xử lý lại event Save
                            this.isProcessing = false;

                            AlertSevice.alert({
                                title: translate('Hrm_Notification'),
                                iconType: EnumIcon.E_WARNING,
                                message: translate('HRM_Attendance_Message_InvalidRequestDataPleaseCheckAgain'),
                                textRightButton: translate('Button_Detail'),
                                //đóng popup
                                onCancel: () => {},
                                //chi tiết lỗi
                                onConfirm: () => {
                                    this.setState(
                                        {
                                            modalErrorDetail: {
                                                ...modalErrorDetail,
                                                cacheID: data.ErrorRespone.CacheID,
                                                isModalVisible: true
                                            }
                                        },
                                        () => {
                                            this.getErrorMessageRespone();
                                            this.isProcessing = false;
                                        }
                                    );
                                }
                            });
                        }
                    } else {
                        this.isProcessing = false;

                        AlertSevice.alert({
                            title: translate('Hrm_Notification'),
                            iconType: EnumIcon.E_WARNING,
                            message: translate('HRM_Attendance_Message_InvalidRequestDataPleaseCheckAgain'),
                            //lưu và tiếp tục
                            colorSecondConfirm: Colors.primary,
                            textSecondConfirm: translate('Button_OK'),
                            onSecondConfirm: () => {
                                this.IsContinueSave = true;
                                this.ProfileRemoveIDs = data.ErrorRespone.ProfileRemoveIDs;
                                this.IsRemoveAndContinue = true;
                                this.CacheID = data.ErrorRespone.CacheID;
                                this.onSave(navigation, isCreate, isSend);
                            },
                            //đóng
                            onCancel: () => {},
                            //chi tiết lỗi
                            textRightButton: translate('Button_Detail'),
                            onConfirm: () => {
                                this.setState(
                                    {
                                        modalErrorDetail: {
                                            ...modalErrorDetail,
                                            cacheID: data.ErrorRespone.CacheID,
                                            isModalVisible: true
                                        }
                                    },
                                    () => {
                                        this.getErrorMessageRespone();
                                        this.isProcessing = false;
                                    }
                                );
                            }
                        });
                    }
                } else if (data.ActionStatus.indexOf('Success') >= 0) {
                    ToasterSevice.showSuccess('Hrm_Succeed', 4000);

                    if (isCreate) {
                        this.refreshView();
                    } else {
                        navigation.goBack();
                    }

                    const { reload } = this.props.navigation.state.params;
                    if (reload && typeof reload == 'function') {
                        reload();
                    }

                    //xử lý lại event Save
                    this.isProcessing = false;
                } else {
                    ToasterSevice.showWarning(data.ActionStatus, 4000);

                    //xử lý lại event Save
                    this.isProcessing = false;
                }
            }

            //xử lý lại event Save
            //this.isProcessing = false;

            // if (data) {
            //   if (data.ActionStatus == 'Success') {

            //     if (isCreate) {
            //       this.refreshView();
            //     }
            //     else {
            //       navigation.goBack();
            //     }

            //     const { reload } = this.props.navigation.state.params;
            //     if (reload && typeof (reload) == 'function') {
            //       reload();
            //     }

            //     ToasterSevice.showSuccess("Hrm_Succeed", 4000);
            //   }
            //   else {
            //     ToasterSevice.showWarning(data.ActionStatus, 4000);
            //   }
            // }
        });
    };

    onSaveAndCreate = (navigation) => {
        this.onSave(navigation, true, null);
    };

    onSaveAndSend = (navigation) => {
        this.onSave(navigation, null, true);
    };

    //#region [xử lý group theo Message để thông báo lỗi]
    groupByMessage = (array, key) => {
        // Return the end result
        return array.reduce((result, currentValue) => {
            // If an array already present for key, push it to the array. Else create an array and push the object
            (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
            // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
            return result;
        }, {}); // empty object is the initial value for result object
    };

    mappingDataGroup = (dataGroup) => {
        let dataSource = [];
        // eslint-disable-next-line no-unused-vars
        for (let key in dataGroup) {
            let title =
                translate('HRM_Attendance_Message_MessageName') +
                ': ' +
                key +
                ' (' +
                translate('NumberCount') +
                ': ' +
                dataGroup[key].length +
                ')';

            dataSource = [...dataSource, { Type: 'E_GROUP', TitleGroup: title }, ...dataGroup[key]];
        }

        return dataSource;
    };

    renderErrorDetail = () => {
        const { modalErrorDetail } = this.state,
            { data } = modalErrorDetail,
            { styleViewTitleGroup } = styleViewTitleForGroup,
            RenderItemAction = stylesModalPopupBottom;

        if (data) {
            const dataGroup = this.groupByMessage(data, 'MessageName'),
                dataSourceError = this.mappingDataGroup(dataGroup);

            return dataSourceError.map((dataItem, index) => {
                let viewContent = <View />;
                if (dataItem['Type'] && dataItem['Type'] == 'E_GROUP') {
                    viewContent = (
                        <View style={[styleViewTitleGroup, styles.styViewGroupExtend]}>
                            <VnrText
                                style={[styleSheets.text, styles.styTextTitleGroup]}
                                i18nKey={dataItem['TitleGroup']}
                            />
                        </View>
                    );
                } else {
                    viewContent = (
                        <View style={RenderItemAction.viewInfo}>
                            <View style={RenderItemAction.Line}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, RenderItemAction.fontText]}
                                    i18nKey={'HRM_HR_Profile_CodeEmp'}
                                />
                                <Text style={[styleSheets.textItalic, RenderItemAction.fontText]}>: </Text>
                                <View style={CustomStyleSheet.flex(1)}>
                                    <Text numberOfLines={1} style={[styleSheets.textItalic, RenderItemAction.fontText]}>
                                        {dataItem['CodeEmp']}
                                    </Text>
                                </View>
                            </View>

                            <View style={RenderItemAction.Line}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, RenderItemAction.fontText]}
                                    i18nKey={'HRM_HR_Profile_ProfileName'}
                                />
                                <Text style={[styleSheets.textItalic, RenderItemAction.fontText]}>: </Text>
                                <View style={CustomStyleSheet.flex(1)}>
                                    <Text numberOfLines={1} style={[styleSheets.textItalic, RenderItemAction.fontText]}>
                                        {dataItem['ProfileName']}
                                    </Text>
                                </View>
                            </View>

                            <View style={RenderItemAction.Line}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, RenderItemAction.fontText]}
                                    i18nKey={'HRM_Attendance_ErrorMessageRespone_ErrorDescription'}
                                />
                                <Text style={[styleSheets.textItalic, RenderItemAction.fontText]}>: </Text>
                                <View style={CustomStyleSheet.flex(1)}>
                                    <Text style={[styleSheets.textItalic, RenderItemAction.fontText]}>
                                        {dataItem['ErrorDescription']}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    );
                }

                return (
                    <View key={index} style={styles.styleViewBorderButtom}>
                        {viewContent}
                    </View>
                );
            });
        } else {
            return <View />;
        }
    };

    getErrorMessageRespone() {
        const { modalErrorDetail } = this.state,
            { cacheID } = modalErrorDetail;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/GetErrorMessageRespone', { cacheID: cacheID }).then((res) => {
            VnrLoadingSevices.hide();
            if (res && res.Data) {
                this.setState({
                    modalErrorDetail: {
                        ...modalErrorDetail,
                        data: res.Data
                    }
                });
            }
        });
    }

    closeModal = () => {
        let nextState = {
            modalErrorDetail: {
                ...this.state.modalErrorDetail,
                isModalVisible: false
            }
        };

        this.setState(nextState);
    };
    //#endregion

    render() {
        const {
                Profile,
                RelativeID,
                RelativeTypeName,
                UnusualEDTypeID,
                DateHire,
                DateOccur,
                MonthStart,
                Amount,
                CurrencyID,
                Notes,
                Attachment,
                DateOfWedding,
                YearOfBirth,
                YearOfLose,
                modalErrorDetail,
                fieldValid
            } = this.state,
            {
                textLableInfo,
                contentViewControl,
                viewLable,
                viewControl,
                controlDate_To,
                controlDate_from,
                formDate_To_From
            } = stylesListPickerControl;

        //#region [Xử lý 3 nút lưu]
        const listActions = [];

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Personal_New_UnusualAllowance_CreateOrUpdate_btnSaveandSendMail'] &&
            PermissionForAppMobile.value['New_Personal_New_UnusualAllowance_CreateOrUpdate_btnSaveandSendMail']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_SENMAIL,
                title: translate('HRM_Common_SaveAndSendMail'),
                onPress: () => this.onSaveAndSend(this.props.navigation)
            });
        }

        listActions.push(
            {
                type: EnumName.E_SAVE_CLOSE,
                title: translate('HRM_Common_SaveClose'),
                onPress: () => this.onSave(this.props.navigation)
            },
            {
                type: EnumName.E_SAVE_NEW,
                title: translate('HRM_Common_SaveNew'),
                onPress: () => this.onSaveAndCreate(this.props.navigation)
            }
        );
        //#endregion

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps={'handled'}
                        contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                    >
                        {/* Tên nhân viên -  ProfileName*/}
                        {Profile.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Profile.label} />

                                    {/* valid ProfileID */}
                                    {fieldValid.ProfileID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput disable={Profile.disable} value={Profile.ProfileName} />
                                </View>
                            </View>
                        )}

                        {/* Tên phụ cấp - UnusualEDTypeID */}
                        {UnusualEDTypeID.visibleConfig && UnusualEDTypeID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={UnusualEDTypeID.label}
                                    />

                                    {/* valid UnusualEDTypeID */}
                                    {fieldValid.UnusualEDTypeID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        dataLocal={UnusualEDTypeID.data}
                                        // api={{
                                        //   urlApi:
                                        //     '[URI_HR]/Cat_GetData/GetMultiCfgByUnusualAllowanceGroupEvent?type=E_EVENT',
                                        //   type: 'E_GET'
                                        // }}
                                        refresh={UnusualEDTypeID.refresh}
                                        textField="UnusualAllowanceCfgName"
                                        valueField="ID"
                                        filter={true}
                                        autoFilter={true}
                                        value={UnusualEDTypeID.value}
                                        filterServer={false}
                                        disable={UnusualEDTypeID.disable}
                                        onFinish={(item) => this.onChangeUnusualEDTypeID(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Người thân - RelativeID */}
                        {RelativeID.visibleConfig && RelativeID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={RelativeID.label} />

                                    {/* valid RelativeID */}
                                    {fieldValid.RelativeID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        dataLocal={RelativeID.data}
                                        refresh={RelativeID.refresh}
                                        textField="RelativeName"
                                        valueField="ID"
                                        filter={true}
                                        value={RelativeID.value}
                                        filterServer={false}
                                        disable={RelativeID.disable}
                                        onFinish={(item) => this.onChangeRelativeID(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Quan hệ - RelativeTypeName*/}
                        {RelativeTypeName.visibleConfig && RelativeTypeName.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={RelativeTypeName.label}
                                    />

                                    {/* valid RelativeTypeName */}
                                    {fieldValid.RelativeTypeName && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={RelativeTypeName.disable}
                                        refresh={RelativeTypeName.refresh}
                                        value={RelativeTypeName.value}
                                        onChangeText={(text) =>
                                            this.setState({
                                                RelativeTypeName: {
                                                    ...RelativeTypeName,
                                                    value: text,
                                                    refresh: !RelativeTypeName.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ngày Sinh - YearOfBirth*/}
                        {YearOfBirth.visibleConfig && YearOfBirth.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={YearOfBirth.label} />

                                    {fieldValid.YearOfBirth && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={YearOfBirth.value}
                                        refresh={YearOfBirth.refresh}
                                        disable={YearOfBirth.disable}
                                        type={'date'}
                                        onFinish={(item) =>
                                            this.setState({
                                                YearOfBirth: {
                                                    ...YearOfBirth,
                                                    value: item,
                                                    refresh: !YearOfBirth.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ngày mất - YearOfLose*/}
                        {YearOfLose.visibleConfig && YearOfLose.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={YearOfLose.label} />

                                    {fieldValid.YearOfLose && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={YearOfLose.value}
                                        refresh={YearOfLose.refresh}
                                        disable={YearOfLose.disable}
                                        type={'date'}
                                        onFinish={(item) =>
                                            this.setState({
                                                YearOfLose: {
                                                    ...YearOfLose,
                                                    value: item,
                                                    refresh: !YearOfLose.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ngày kêt hôn - DateOfWedding*/}
                        {DateOfWedding.visibleConfig && DateOfWedding.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={DateOfWedding.label} />

                                    {fieldValid.DateOfWedding && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={DateOfWedding.value}
                                        refresh={DateOfWedding.refresh}
                                        disable={DateOfWedding.disable}
                                        type={'date'}
                                        onFinish={(item) =>
                                            this.setState({
                                                DateOfWedding: {
                                                    ...DateOfWedding,
                                                    value: item,
                                                    refresh: !DateOfWedding.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ngày vào làm - DateHire*/}
                        {DateHire.visibleConfig && DateHire.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={DateHire.label} />

                                    {fieldValid.DateHire && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={DateHire.value}
                                        refresh={DateHire.refresh}
                                        disable={DateHire.disable}
                                        type={'date'}
                                        onFinish={(value) => this.onChangeDateHire(value)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ngày áp dụng - DateOccur */}
                        {DateOccur.visibleConfig && DateOccur.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={DateOccur.label} />

                                    {fieldValid.DateOccur && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        disable={DateOccur.disable}
                                        value={DateOccur.value}
                                        refresh={DateOccur.refresh}
                                        type={'date'}
                                        onFinish={(value) => this.onChangeDateOccur(value)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Tháng thưởng -  MonthStart*/}
                        {MonthStart.visibleConfig && MonthStart.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={MonthStart.label} />

                                    {fieldValid.MonthStart && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrMonthYear
                                        response={'string'}
                                        format={'MM/YYYY'}
                                        value={MonthStart.value}
                                        refresh={MonthStart.refresh}
                                        type={'date'}
                                        onFinish={(value) =>
                                            this.setState({
                                                MonthStart: {
                                                    ...MonthStart,
                                                    value,
                                                    refresh: !MonthStart.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Số tiền -  Amount, Đơn vị tính - CurrencyID */}
                        {Amount.visibleConfig && Amount.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Amount.label} />
                                    {fieldValid.Amount && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>

                                <View style={formDate_To_From}>
                                    {/* Số tiền -  Amount */}
                                    <View style={controlDate_from}>
                                        <VnrTextInput
                                            value={Amount.value}
                                            refresh={Amount.refresh}
                                            disable={Amount.disable}
                                            keyboardType={'numeric'}
                                            charType={'money'}
                                            returnKeyType={'done'}
                                            onChangeText={(value) =>
                                                this.setState({
                                                    Amount: {
                                                        ...Amount,
                                                        value,
                                                        refresh: !Amount.refresh
                                                    }
                                                })
                                            }
                                            // onBlur={this.onChangeRegisterHours}
                                            // onSubmitEditing={this.onChangeRegisterHours}
                                        />
                                    </View>

                                    {/* Đơn vị tính - CurrencyID */}
                                    <View style={controlDate_To}>
                                        <VnrPickerQuickly
                                            dataLocal={CurrencyID.data}
                                            refresh={CurrencyID.refresh}
                                            textField="CurrencyName"
                                            valueField="ID"
                                            filter={false}
                                            value={CurrencyID.value}
                                            filterServer={false}
                                            disable={CurrencyID.disable}
                                            onFinish={(item) =>
                                                this.setState({
                                                    CurrencyID: {
                                                        ...CurrencyID,
                                                        value: item,
                                                        refresh: !CurrencyID.refresh
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Ghi chú - Notes*/}
                        {Notes.visibleConfig && Notes.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Notes.label} />

                                    {/* valid Notes */}
                                    {fieldValid.Notes && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={Notes.disable}
                                        refresh={Notes.refresh}
                                        value={Notes.value}
                                        onChangeText={(text) =>
                                            this.setState({
                                                Notes: {
                                                    ...Notes,
                                                    value: text,
                                                    refresh: !Notes.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* File đính kèm- Attachment*/}
                        {Attachment.visibleConfig && Attachment.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Attachment.label} />

                                    {/* valid Attachment */}
                                    {fieldValid.Attachment && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrAttachFile
                                        disable={Attachment.disable}
                                        refresh={Attachment.refresh}
                                        value={Attachment.value}
                                        multiFile={true}
                                        uri={'[URI_POR]/New_Home/saveFileFromApp'}
                                        onFinish={(file) =>
                                            this.setState({
                                                Attachment: {
                                                    ...Attachment,
                                                    value: file,
                                                    refresh: !Attachment.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}
                    </KeyboardAwareScrollView>

                    {modalErrorDetail.isModalVisible && (
                        <Modal
                            onBackButtonPress={() => this.closeModal()}
                            isVisible={true}
                            onBackdropPress={() => this.closeModal()}
                            customBackdrop={
                                <TouchableWithoutFeedback onPress={() => this.closeModal()}>
                                    <View style={styles.StyModalVIewBackrop} />
                                </TouchableWithoutFeedback>
                            }
                            style={CustomStyleSheet.margin(0)}
                        >
                            <View style={stylesModalPopupBottom.viewModal}>
                                <SafeAreaView {...styleSafeAreaView} style={stylesModalPopupBottom.safeRadius}>
                                    <View style={stylesModalPopupBottom.headerCloseModal}>
                                        <TouchableOpacity onPress={() => this.closeModal()}>
                                            <IconColse color={Colors.grey} size={Size.iconSize} />
                                        </TouchableOpacity>
                                        <VnrText
                                            style={styleSheets.lable}
                                            i18nKey={'HRM_Attendance_Message_ViolationNotification'}
                                        />
                                        <IconColse color={Colors.white} size={Size.iconSize} />
                                    </View>
                                    <ScrollView style={stylesModalPopupBottom.scrollViewError}>
                                        {this.renderErrorDetail()}
                                    </ScrollView>
                                    <View style={stylesModalPopupBottom.groupButton}>
                                        <TouchableOpacity
                                            onPress={() => this.closeModal()}
                                            style={stylesModalPopupBottom.btnClose}
                                        >
                                            <VnrText
                                                style={[styleSheets.lable, { color: Colors.greySecondary }]}
                                                i18nKey={'Cancel'}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </SafeAreaView>
                            </View>
                        </Modal>
                    )}

                    <ListButtonSave listActions={listActions} />
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    StyModalVIewBackrop: { flex: 1, backgroundColor: Colors.black, opacity: 0.5 },
    styTextTitleGroup: { fontWeight: '500', color: Colors.primary },
    styViewGroupExtend: { marginHorizontal: 0, paddingBottom: 5, marginBottom: 10 }
});
