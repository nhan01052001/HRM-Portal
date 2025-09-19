import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    Colors,
    styleSafeAreaView,
    stylesListPickerControl,
    styleValid,
    Size,
    styleProfileInfo,
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
import DrawerServices from '../../../../../utils/DrawerServices';
import { EnumName, ScreenName } from '../../../../../assets/constant';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import VnrAutoComplete from '../../../../../components/VnrAutoComplete/VnrAutoComplete';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';
import { WorkingExperienceConfirmedBusinessFunction } from './workingExperienceConfirmed/WorkingExperienceConfirmedBusinessFunction';
import { translate } from '../../../../../i18n/translate';

let enumName = null,
    profileInfo = null;

const initSateDefault = {
    ID: null,
    Profile: {
        label: 'HRM_Attendance_Overtime_ProfileName',
        ID: null,
        ProfileName: '',
        disable: true
    },
    DateStart: {
        label: 'HRM_Att_Report_Time',
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true,
        disable: false
    },
    DayFrom: {
        label: 'HRM_Common_FromDate',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    MonthFrom: {
        label: 'HRM_Common_FromDate',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    YearFrom: {
        label: 'HRM_Common_FromDate',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    DateFinish: {
        label: 'HRM_Att_Report_Time',
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true,
        disable: false
    },
    DayTo: {
        label: 'HRM_Common_ToDate',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    MonthTo: {
        label: 'HRM_Common_ToDate',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    YearTo: {
        label: 'HRM_Common_ToDate',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    JobTitle: {
        label: 'Hre_ReportBirthday_JobTitle',
        data: [],
        api: {
            urlApi: '[URI_HR]/Cat_GetData/GetMultiJobTitle',
            type: 'E_GET'
        },
        valueField: 'JobTitleName',
        textField: 'JobTitleName',
        disable: false,
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    PositionFirst: {
        label: 'HRM_HR_Profile_FirstPositionID',
        data: [],
        api: {
            urlApi: '[URI_HR]/Cat_GetData/GetMultiPositionNoCode',
            type: 'E_GET'
        },
        valueField: 'PositionName',
        textField: 'PositionName',
        disable: false,
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    PositionLast: {
        label: 'HRM_HR_Profile_LastPositionID',
        data: [],
        api: {
            urlApi: '[URI_HR]/Cat_GetData/GetMultiPositionNoCode',
            type: 'E_GET'
        },
        valueField: 'PositionName',
        textField: 'PositionName',
        disable: false,
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    SalaryFirst: {
        label: 'HRM_HR_Profile_SalaryFirst',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    CurrencyID: {
        label: 'HRM_HR_Profile_SalaryFirst',
        api: {
            urlApi: '[URI_HR]/Cat_GetData/GetMultiCurrency',
            type: 'E_GET'
        },
        valueField: 'ID',
        textField: 'CurrencyName',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    SalaryLast: {
        label: 'HRM_HR_CandidateHistory_SalaryLast',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    CurrencyID2: {
        label: 'HRM_HR_Profile_SalaryFirst',
        api: {
            urlApi: '[URI_HR]/Cat_GetData/GetMultiCurrency',
            type: 'E_GET'
        },
        valueField: 'ID',
        textField: 'CurrencyName',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    CompanyName: {
        label: 'HRM_HR_CandidateHistory_CompanyName',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    Major: {
        label: 'HRM_HR_CandidateHistory_Major',
        data: [],
        api: {
            urlApi: '[URI_HR]/Cat_GetData/GetMultiMajor',
            type: 'E_GET'
        },
        valueField: 'MajorName',
        textField: 'MajorName',
        disable: false,
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    Phone: {
        label: 'HRM_HR_CandidateHistory_Phone',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    IsMainExperience: {
        label: 'HRM_HR_CandidateHistory_IsMainExperience',
        disable: false,
        refresh: false,
        value: false,
        visibleConfig: true,
        visible: true
    },
    BussinessType: {
        label: 'HRM_HR_CandidateHistory_BussinessType',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    EmployeeType: {
        label: 'HRM_HR_Profile_EmpTypeID',
        data: [],
        api: {
            urlApi: '[URI_HR]/Cat_GetData/GetMultiEmployeeType',
            type: 'E_GET'
        },
        valueField: 'EmployeeType_Name',
        textField: 'EmployeeType_Name',
        disable: false,
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    CountryID: {
        label: 'HRM_HR_Dependant_CountryID',
        api: {
            urlApi: '[URI_HR]/Cat_GetData/GetMultiCountry',
            type: 'E_GET'
        },
        valueField: 'ID',
        textField: 'CountryName',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    ProvinceID: {
        label: 'HRM_Category_Village_ProvinceID',
        api: {
            urlApi: '[URI_HR]/Cat_GetData/GetMultiProvince',
            type: 'E_GET'
        },
        valueField: 'ID',
        textField: 'ProvinceName',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    YearOfExperience: {
        label: 'HRM_REC_Candidate_YearExperience',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    FileAttachment: {
        label: 'HRM_Hre_CandidateHistory_AttachProfile',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    JobDescription: {
        label: 'HRM_HR_CandidateHistory_JobDescription',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true,
        multiple: true
    },
    ResignReason: {
        label: 'HRM_HR_Profile_ResignReason',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true,
        multiple: true
    },
    SupRelation: {
        label: 'HRM_HR_CandidateHistory_SupRelation',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    SupMobile: {
        label: 'HRM_HR_CandidateHistory_SupMobile',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    SupPosition: {
        label: 'HRM_HR_CandidateHistory_SupPosition',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    SupEmail: {
        label: 'HRM_HR_CandidateHistory_SupEmail',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    SupComment: {
        label: 'HRM_HR_CandidateHistory_SupComment',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true,
        multiple: true
    },
    fieldValid: {}
};

export default class WorkingExperienceAddOrEdit extends Component {
    constructor(props) {
        super(props);
        this.state = initSateDefault;
        this.setVariable();
        props.navigation.setParams({
            title:
                props.navigation.state.params && props.navigation.state.params.record
                    ? 'HRM_HR_WorkingExperience_PopUp_Edit_Title'
                    : 'HRM_HR_WorkingExperience_PopUp_Create_Title'
        });
    }

    //#region [khởi tạo - lấy các dữ liệu cho control, lấy giá trị mặc đinh]

    //promise get config valid
    getConfigValid = (tblName) => {
        VnrLoadingSevices.show();
        HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + tblName).then((res) => {
            VnrLoadingSevices.hide();
            if (res) {
                try {
                    //map field hidden by config
                    const _configField =
                        ConfigField && ConfigField.value['WorkingExperienceAddOrEdit']
                            ? ConfigField.value['WorkingExperienceAddOrEdit']['Hidden']
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

                        let { record } = this.props.navigation.state.params;

                        //get config khi đăng ký
                        if (!record) {
                            this.initData();
                        } else {
                            this.isModify = true;
                            this.getRecordAndConfigByID(record);
                        }
                    });
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            }
        });
    };

    componentDidMount() {
        //get config validate
        this.getConfigValid('Hre_WorkingExperience');
    }

    initData = () => {
        const { E_ProfileID, E_FullName } = enumName,
            _profile = {
                ID: profileInfo[E_ProfileID],
                ProfileName: profileInfo[E_FullName]
            };

        let nextState = {
            Profile: _profile
        };

        this.setState(nextState);
    };

    setVariable = () => {
        //biến trạng thái
        this.isModify = false;
        //check processing cho nhấn lưu nhiều lần
        this.isProcessing = false;
    };

    refreshView = () => {
        const { FileAttachment } = this.state;
        this.props.navigation.setParams({ title: 'HRM_HR_WorkingExperience_PopUp_Create_Title' });
        this.setVariable();

        let resetState = {
            ...initSateDefault,
            FileAttachment: {
                ...FileAttachment,
                value: null,
                refresh: !FileAttachment.refresh
            }
        };
        this.setState(resetState, () => this.getConfigValid('Hre_WorkingExperience', true));
    };

    handleSetState = (record) => {
        const {
                Profile,
                DateStart,
                DateFinish,
                JobTitle,
                PositionFirst,
                PositionLast,
                SalaryFirst,
                CurrencyID,
                SalaryLast,
                CurrencyID2,
                CompanyName,
                Major,
                Phone,
                IsMainExperience,
                BussinessType,
                EmployeeType,
                CountryID,
                ProvinceID,
                YearOfExperience,
                FileAttachment,
                JobDescription,
                ResignReason,
                SupRelation,
                SupMobile,
                SupPosition,
                SupEmail,
                SupComment
            } = this.state,
            item = record;

        let nextState = {
            ID: record.ID,
            Profile: {
                ...Profile,
                ID: item.ProfileID,
                ProfileName: item.ProfileName
            },
            DateFinish: {
                ...DateFinish,
                value: item.DateFinish,
                refresh: !DateFinish.refresh
            },
            DateStart: {
                ...DateStart,
                value: item.DateStart,
                refresh: !DateStart.refresh
            },
            JobTitle: {
                ...JobTitle,
                value: item.JobTitle ? { JobTitleName: item.JobTitle } : null,
                refresh: !JobTitle.refresh
            },
            PositionFirst: {
                ...PositionFirst,
                value: item.PositionFirst ? { PositionName: item.PositionFirst } : null,
                refresh: !PositionFirst.refresh
            },
            PositionLast: {
                ...PositionLast,
                value: item.PositionLast ? { PositionName: item.PositionLast } : null,
                refresh: !PositionLast.refresh
            },
            SalaryFirst: {
                ...SalaryFirst,
                value: item.SalaryFirst ? item.SalaryFirst.toString() : null,
                refresh: !SalaryFirst.refresh
            },
            CurrencyID: {
                ...CurrencyID,
                value: item.CurrencyID ? { ID: item.CurrencyID, CurrencyName: item.CurrencyName } : null,
                refresh: !CurrencyID.refresh
            },
            SalaryLast: {
                ...SalaryLast,
                value: item.SalaryLast ? item.SalaryLast.toString() : null,
                refresh: !SalaryLast.refresh
            },
            CurrencyID2: {
                ...CurrencyID2,
                value: item.CurrencyID2 ? { ID: item.CurrencyID2, CurrencyName: item.CurrencyName2 } : null,
                refresh: !CurrencyID2.refresh
            },
            CompanyName: {
                ...CompanyName,
                value: item.CompanyName,
                refresh: !CompanyName.refresh
            },
            Major: {
                ...Major,
                value: item.Major ? { MajorName: item.Major } : null,
                refresh: !Major.refresh
            },
            Phone: {
                ...Phone,
                value: item.Phone,
                refresh: !Phone.refresh
            },
            IsMainExperience: {
                ...IsMainExperience,
                value: item.IsMainExperience == true ? true : false,
                refresh: !IsMainExperience.refresh
            },
            BussinessType: {
                ...BussinessType,
                value: item.BussinessType,
                refresh: !BussinessType.refresh
            },
            EmployeeType: {
                ...EmployeeType,
                value: item.EmployeeType ? { EmployeeType_Name: item.EmployeeType } : null,
                refresh: !EmployeeType.refresh
            },
            CountryID: {
                ...CountryID,
                value: item.CountryID ? { ID: item.CountryID, CountryName: item.CountryName } : null,
                refresh: !CountryID.refresh
            },
            ProvinceID: {
                ...ProvinceID,
                value: item.ProvinceID ? { ID: item.ProvinceID, ProvinceName: item.ProvinceName } : null,
                refresh: !ProvinceID.refresh
            },
            YearOfExperience: {
                ...YearOfExperience,
                value: item.YearOfExperience ? item.YearOfExperience.toString() : null,
                refresh: !YearOfExperience.refresh
            },
            FileAttachment: {
                ...FileAttachment,
                value: item.lstFileAttach,
                refresh: !FileAttachment.refresh
            },
            JobDescription: {
                ...JobDescription,
                value: item.JobDescription,
                refresh: !JobDescription.refresh
            },
            ResignReason: {
                ...ResignReason,
                value: item.ResignReason,
                refresh: !ResignReason.refresh
            },
            SupRelation: {
                ...SupRelation,
                value: item.SupRelation,
                refresh: !SupRelation.refresh
            },
            SupMobile: {
                ...SupMobile,
                value: item.SupMobile,
                refresh: !SupMobile.refresh
            },
            SupPosition: {
                ...SupPosition,
                value: item.SupPosition,
                refresh: !SupPosition.refresh
            },
            SupEmail: {
                ...SupEmail,
                value: item.SupEmail,
                refresh: !SupEmail.refresh
            },
            SupComment: {
                ...SupComment,
                value: item.SupComment,
                refresh: !SupComment.refresh
            }
        };

        this.setState(nextState);
    };

    getRecordAndConfigByID = (record) => {
        this.handleSetState(record);
    };
    //#endregion

    //#region [event component]

    //change DateStart
    onChangeDateStart = (item) => {
        const { DateStart, DayFrom, MonthFrom, YearFrom } = this.state;

        let nextState = {
            DateStart: {
                ...DateStart,
                value: item,
                refresh: !DateStart.refresh
            }
        };

        if (item) {
            let _moment = moment(item),
                _day = _moment.format('D'),
                _month = _moment.format('M'),
                _year = _moment.format('YYYY');

            nextState = {
                ...nextState,
                DayFrom: {
                    ...DayFrom,
                    value: _day,
                    refresh: !DayFrom.refresh
                },
                MonthFrom: {
                    ...MonthFrom,
                    value: _month,
                    refresh: !MonthFrom.refresh
                },
                YearFrom: {
                    ...YearFrom,
                    value: _year,
                    refresh: !YearFrom.refresh
                }
            };
        }

        this.setState(nextState, () => {
            this.calYearExperience();
        });
    };

    handleValidateMail(email) {
        if (email.value && !Vnr_Function.isValidateEmail(email.value)) {
            let displayField = translate(email.label);
            const nameField = translate('HRM_FieldInvalidEmail').replace('[{0}]', `[${displayField}]`);
            ToasterSevice.showWarning(nameField);
        }
    }

    //change DateFinish
    onChangeDateFinish = (item) => {
        const { DateFinish, DayTo, MonthTo, YearTo } = this.state;

        let nextState = {
            DateFinish: {
                ...DateFinish,
                value: item,
                refresh: !DateFinish.refresh
            }
        };

        if (item) {
            let _moment = moment(item),
                _day = _moment.format('D'),
                _month = _moment.format('M'),
                _year = _moment.format('YYYY');

            nextState = {
                ...nextState,
                DayTo: {
                    ...DayTo,
                    value: _day,
                    refresh: !DayTo.refresh
                },
                MonthTo: {
                    ...MonthTo,
                    value: _month,
                    refresh: !MonthTo.refresh
                },
                YearTo: {
                    ...YearTo,
                    value: _year,
                    refresh: !YearTo.refresh
                }
            };
        }

        this.setState(nextState, () => {
            this.calYearExperience();
        });
    };
    //#endregion

    calYearExperience = () => {
        const { DateStart, DateFinish, YearOfExperience } = this.state;
        if (DateStart.value && DateFinish.value && moment(DateStart.value) < moment(DateFinish.value)) {
            let dateEnd = moment(DateFinish.value),
                dateStart = moment(DateStart.value),
                days = dateEnd.diff(dateStart, 'days'),
                yearOfExperience = days / 365;
            this.setState({
                YearOfExperience: {
                    ...YearOfExperience,
                    value: `${Vnr_Function.mathRoundNumber(yearOfExperience)}`
                }
            });
        } else {
            this.setState({
                ...YearOfExperience,
                value: ''
            });
        }
    };

    //#region [Lưu]

    onCheckCandidateHistory = (navigation) => {
        if (this.isProcessing) {
            return;
        }

        this.isProcessing = true;

        const {
                ID,
                Profile,
                DateStart,
                DateFinish,
                JobTitle,
                PositionFirst,
                PositionLast,
                SalaryFirst,
                CurrencyID,
                SalaryLast,
                CurrencyID2,
                CompanyName,
                Major,
                Phone,
                IsMainExperience,
                BussinessType,
                EmployeeType,
                CountryID,
                ProvinceID,
                YearOfExperience,
                FileAttachment,
                JobDescription,
                ResignReason,
                SupRelation,
                SupMobile,
                SupPosition,
                SupEmail,
                SupComment,
                DayFrom,
                DayTo,
                MonthFrom,
                MonthTo,
                YearFrom,
                YearTo
            } = this.state,
            { languageApp } = dataVnrStorage;

        let params = {
            BussinessType: BussinessType.value,
            CompanyName: CompanyName.value,
            CountryID: CountryID.value ? CountryID.value.ID : null,
            CurrencyID: CurrencyID.value ? CurrencyID.value.ID : null,
            CurrencyID2: CurrencyID2.value ? CurrencyID2.value.ID : null,
            DateFinish: DateFinish.value ? moment(DateFinish.value).format('YYYY-MM-DD HH:mm') : null,
            DateStart: DateStart.value ? moment(DateStart.value).format('YYYY-MM-DD HH:mm') : null,
            DayFrom: DayFrom.value,
            DayTo: DayTo.value,
            EmployeeType: EmployeeType.value ? EmployeeType.value.EmployeeType_Name : null,
            FileAttachment: FileAttachment.value ? FileAttachment.value.map((item) => item.fileName).join(',') : null,
            IsMainExperience: IsMainExperience.value,
            IsPortal: true,
            JobDescription: JobDescription.value,
            JobTitle: JobTitle.value ? JobTitle.value.JobTitleName : null,
            KeyCode: languageApp,
            Major: Major.value ? Major.value.MajorName : null,
            MonthFrom: MonthFrom.value,
            MonthTo: MonthTo.value,
            Phone: Phone.value,
            PositionFirst: PositionFirst.value ? PositionFirst.value.PositionName : null,
            PositionLast: PositionLast.value ? PositionLast.value.PositionName : null,
            ProfileID: Profile.ID,
            ProvinceID: ProvinceID.value ? ProvinceID.value.ID : null,
            ResignReason: ResignReason.value,
            SalaryFirst: SalaryFirst.value ? SalaryFirst.value.toString() : null,
            SalaryLast: SalaryLast.value ? SalaryLast.value.toString() : null,
            SupComment: SupComment.value,
            SupEmail: SupEmail.value,
            SupMobile: SupMobile.value,
            SupPosition: SupPosition.value,
            SupRelation: SupRelation.value,
            UserID: Profile.ID,
            UserSubmit: Profile.ID,
            YearFrom: YearFrom.value,
            YearOfExperience: YearOfExperience.value ? YearOfExperience.value.toString() : null,
            YearTo: YearTo.value
        };

        if (ID) {
            params = {
                ...params,
                ID
            };
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Hre_GetData/CheckSaveCandidateHistory', params).then((returnValue) => {
            this.isProcessing = false;
            VnrLoadingSevices.hide();

            if (returnValue && returnValue == 'AllowSave') {
                this.onSave(navigation);
            } else {
                ToasterSevice.showWarning('HRM_Hre_CandidateHistoryExist');
            }
        });
    };

    onSaveAndCreate = (navigation) => {
        this.onSave(navigation, true, null);
    };

    onSaveAndSend = (navigation) => {
        this.onSave(navigation, null, true);
    };

    onSave = (navigation, isCreate, isSend) => {
        const {
                ID,
                Profile,
                DateStart,
                DateFinish,
                JobTitle,
                PositionFirst,
                PositionLast,
                SalaryFirst,
                CurrencyID,
                SalaryLast,
                CurrencyID2,
                CompanyName,
                Major,
                Phone,
                IsMainExperience,
                BussinessType,
                EmployeeType,
                CountryID,
                ProvinceID,
                YearOfExperience,
                FileAttachment,
                JobDescription,
                ResignReason,
                SupRelation,
                SupMobile,
                SupPosition,
                SupEmail,
                SupComment,
                DayFrom,
                DayTo,
                MonthFrom,
                MonthTo,
                YearFrom,
                YearTo
            } = this.state,
            { languageApp } = dataVnrStorage;

        let params = {
            BussinessType: BussinessType.value,
            CompanyName: CompanyName.value,
            CountryID: CountryID.value ? CountryID.value.ID : null,
            CurrencyID: CurrencyID.value ? CurrencyID.value.ID : null,
            CurrencyID2: CurrencyID2.value ? CurrencyID2.value.ID : null,
            DateFinish: DateFinish.value ? moment(DateFinish.value).format('YYYY-MM-DD HH:mm') : null,
            DateStart: DateStart.value ? moment(DateStart.value).format('YYYY-MM-DD HH:mm') : null,
            DayFrom: DayFrom.value,
            DayTo: DayTo.value,
            EmployeeType: EmployeeType.value ? EmployeeType.value.EmployeeType_Name : null,
            FileAttachment: FileAttachment.value ? FileAttachment.value.map((item) => item.fileName).join(',') : null,
            IsMainExperience: IsMainExperience.value,
            IsPortal: true,
            JobDescription: JobDescription.value,
            JobTitle: JobTitle.value ? JobTitle.value.JobTitleName : null,
            KeyCode: languageApp,
            Major: Major.value ? Major.value.MajorName : null,
            MonthFrom: MonthFrom.value,
            MonthTo: MonthTo.value,
            Phone: Phone.value,
            PositionFirst: PositionFirst.value ? PositionFirst.value.PositionName : null,
            PositionLast: PositionLast.value ? PositionLast.value.PositionName : null,
            ProfileID: Profile.ID,
            ProvinceID: ProvinceID.value ? ProvinceID.value.ID : null,
            ResignReason: ResignReason.value,
            SalaryFirst: SalaryFirst.value ? SalaryFirst.value.toString() : null,
            SalaryLast: SalaryLast.value ? SalaryLast.value.toString() : null,
            SupComment: SupComment.value,
            SupEmail: SupEmail.value,
            SupMobile: SupMobile.value,
            SupPosition: SupPosition.value,
            SupRelation: SupRelation.value,
            UserID: Profile.ID,
            UserSubmit: Profile.ID,
            YearFrom: YearFrom.value,
            YearOfExperience: YearOfExperience.value ? YearOfExperience.value.toString() : null,
            YearTo: YearTo.value
        };

        if (SupEmail.value && !Vnr_Function.isValidateEmail(SupEmail.value)) {
            let displayField = translate(SupEmail.label);
            const nameField = translate('HRM_FieldInvalidEmail').replace('[{0}]', `[${displayField}]`);
            ToasterSevice.showWarning(nameField);
            return;
        }

        // Send mail
        if (isSend) {
            params = {
                ...params,
                IsSubmitSave: true,
                // Host: uriPor,
                IsAddNewAndSendMail: true
            };
        }

        if (ID) {
            params = {
                ...params,
                ID
            };
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/api/Hre_WorkingExperience', params).then((data) => {
            //xử lý lại event Save
            this.isProcessing = false;

            VnrLoadingSevices.hide();

            try {
                if (data.ActionStatus && data.ActionStatus.split('|')[0] == 'InValid') {
                    let _mess = data.ActionStatus.split('|')[1];
                    ToasterSevice.showWarning(_mess);
                } else if (data.ActionStatus == 'Success') {
                    ToasterSevice.showSuccess(data.ActionStatus);

                    if (isCreate) {
                        this.refreshView();
                    } else {
                        // navigation.goBack();
                        const { reload } = this.props.navigation.state.params;
                        if (reload && typeof reload === 'function') {
                            reload();
                        }

                        WorkingExperienceConfirmedBusinessFunction.checkForLoadEditDelete[
                            ScreenName.WorkingExperienceWaitConfirm
                        ] = true;
                        DrawerServices.navigate(ScreenName.WorkingExperienceWaitConfirm);
                    }
                } else {
                    ToasterSevice.showWarning(data.ActionStatus);
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };
    //#endregion

    render() {
        const {
            DateStart,
            DateFinish,
            JobTitle,
            PositionFirst,
            PositionLast,
            SalaryFirst,
            CurrencyID,
            SalaryLast,
            CurrencyID2,
            CompanyName,
            Major,
            Phone,
            IsMainExperience,
            BussinessType,
            EmployeeType,
            CountryID,
            ProvinceID,
            YearOfExperience,
            FileAttachment,
            JobDescription,
            ResignReason,
            SupRelation,
            SupMobile,
            SupPosition,
            SupEmail,
            SupComment,
            fieldValid
        } = this.state;

        const {
                textLableInfo,
                contentViewControl,
                viewLable,
                viewControl,
                controlDate_To,
                controlDate_from,
                formDate_To_From,
                viewInputMultiline
            } = stylesListPickerControl,
            { styleViewTitleGroup, textLableGroup } = styleProfileInfo;

        //#region [Xử lý 3 nút lưu]
        const listActions = [];
        listActions.push({
            type: EnumName.E_SAVE_SENMAIL,
            title: translate('HRM_Common_SaveAndSendRequest'),
            onPress: () => this.onSaveAndSend(this.props.navigation)
        });

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_WorkingExper_BtnSaveClose'] &&
            PermissionForAppMobile.value['New_WorkingExper_BtnSaveClose']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_CLOSE,
                title: translate('HRM_Common_SaveClose'),
                onPress: () => this.onSave(this.props.navigation)
            });
        }

        listActions.push({
            type: EnumName.E_SAVE_NEW,
            title: translate('HRM_Common_SaveNew'),
            onPress: () => this.onSaveAndCreate(this.props.navigation)
        });
        //#endregion

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps={'handled'}
                        contentContainerStyle={styles.styViewKeyBoard}
                        ref={(ref) => (this.scrollViewRef = ref)}
                    >
                        {/* DateStart, DateFinish */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={DateStart.label} />

                                {/* valid DateStart, DateFinish */}
                                {fieldValid.DateStart && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
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
                                            onFinish={(value) => this.onChangeDateStart(value)}
                                        />
                                    </View>
                                    <View style={controlDate_To}>
                                        <VnrDate
                                            disable={DateFinish.disable}
                                            response={'string'}
                                            format={'DD/MM/YYYY'}
                                            value={DateFinish.value}
                                            refresh={DateFinish.refresh}
                                            type={'date'}
                                            onFinish={(value) => this.onChangeDateFinish(value)}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* SalaryFirst, CurrencyID */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={SalaryFirst.label} />

                                {/* valid SalaryFirst */}
                                {fieldValid.SalaryFirst && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                            </View>
                            <View style={viewControl}>
                                <View style={formDate_To_From}>
                                    <View style={[controlDate_from, CustomStyleSheet.flex(4)]}>
                                        <VnrTextInput
                                            value={SalaryFirst.value}
                                            refresh={SalaryFirst.refresh}
                                            disable={SalaryFirst.disable}
                                            keyboardType={'numeric'}
                                            charType={'double'}
                                            returnKeyType={'done'}
                                            onChangeText={(value) => {
                                                this.setState({
                                                    SalaryFirst: {
                                                        ...SalaryFirst,
                                                        value,
                                                        refresh: !SalaryFirst.refresh
                                                    }
                                                });
                                            }}
                                        />
                                    </View>
                                    <View style={[controlDate_To, CustomStyleSheet.flex(6)]}>
                                        <VnrPicker
                                            api={CurrencyID.api}
                                            refresh={CurrencyID.refresh}
                                            textField={CurrencyID.textField}
                                            valueField={CurrencyID.valueField}
                                            filter={true}
                                            value={CurrencyID.value}
                                            filterServer={false}
                                            autoFilter={true}
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
                        </View>

                        {/* PositionFirst */}
                        {PositionFirst.visibleConfig && PositionFirst.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={PositionFirst.label} />
                                    {fieldValid.PositionFirst && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrAutoComplete
                                        api={PositionFirst.api}
                                        value={PositionFirst.value}
                                        refresh={PositionFirst.refresh}
                                        textField={PositionFirst.textField}
                                        valueField={PositionFirst.valueField}
                                        filter={true}
                                        filterServer={false}
                                        autoFilter={true}
                                        onFinish={(item) =>
                                            this.setState({
                                                PositionFirst: {
                                                    ...PositionFirst,
                                                    value: item,
                                                    refresh: !PositionFirst.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* CompanyName */}
                        {CompanyName.visibleConfig && CompanyName.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={CompanyName.label} />
                                    {fieldValid.CompanyName && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={CompanyName.disable}
                                        refresh={CompanyName.refresh}
                                        value={CompanyName.value}
                                        multiline={false}
                                        onChangeText={(text) =>
                                            this.setState({
                                                CompanyName: {
                                                    ...CompanyName,
                                                    value: text,
                                                    refresh: !CompanyName.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Major */}
                        {Major.visibleConfig && Major.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Major.label} />
                                    {fieldValid.Major && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrAutoComplete
                                        api={Major.api}
                                        value={Major.value}
                                        refresh={Major.refresh}
                                        textField={Major.textField}
                                        valueField={Major.valueField}
                                        filter={true}
                                        filterServer={false}
                                        autoFilter={true}
                                        onFinish={(item) =>
                                            this.setState({
                                                Major: {
                                                    ...Major,
                                                    value: item,
                                                    refresh: !Major.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* IsMainExperience */}
                        <View style={styles.styListBtnTypePregnancy}>
                            {IsMainExperience.visibleConfig && IsMainExperience.visible && (
                                <TouchableOpacity
                                    style={[
                                        styles.styBtnTypePregnancy,
                                        IsMainExperience.value == true && styles.styBtnTypePregnancyActive
                                    ]}
                                    onPress={() =>
                                        this.setState({
                                            IsMainExperience: {
                                                ...IsMainExperience,
                                                value: !IsMainExperience.value,
                                                refresh: !IsMainExperience.refresh
                                            }
                                        })
                                    }
                                >
                                    <VnrText
                                        style={[
                                            styleSheets.text,
                                            IsMainExperience.value == true && styles.styBtnTypePregnancyTextActive
                                        ]}
                                        i18nKey={IsMainExperience.label}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Phone */}
                        {Phone.visibleConfig && Phone.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Phone.label} />
                                    {fieldValid.Phone && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        value={Phone.value}
                                        refresh={Phone.refresh}
                                        disable={Phone.disable}
                                        keyboardType={'numeric'}
                                        charType={'double'}
                                        returnKeyType={'done'}
                                        onChangeText={(value) => {
                                            this.setState({
                                                Phone: {
                                                    ...Phone,
                                                    value: value,
                                                    refresh: !Phone.refresh
                                                }
                                            });
                                        }}
                                        //onBlur={this.onChangeRegisterHours}
                                        //onSubmitEditing={this.onChangeRegisterHours}
                                    />
                                </View>
                            </View>
                        )}

                        {/* JobTitle */}
                        {JobTitle.visibleConfig && JobTitle.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={JobTitle.label} />
                                    {fieldValid.JobTitle && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrAutoComplete
                                        api={JobTitle.api}
                                        value={JobTitle.value}
                                        refresh={JobTitle.refresh}
                                        textField={JobTitle.textField}
                                        valueField={JobTitle.valueField}
                                        filter={true}
                                        filterServer={false}
                                        autoFilter={true}
                                        onFinish={(item) =>
                                            this.setState({
                                                JobTitle: {
                                                    ...JobTitle,
                                                    value: item,
                                                    refresh: !JobTitle.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* SalaryLast,CurrencyID2 */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={SalaryLast.label} />

                                {/* valid SalaryLast */}
                                {fieldValid.SalaryLast && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                            </View>
                            <View style={viewControl}>
                                <View style={formDate_To_From}>
                                    <View style={[controlDate_from, CustomStyleSheet.flex(4)]}>
                                        <VnrTextInput
                                            value={SalaryLast.value}
                                            refresh={SalaryLast.refresh}
                                            disable={SalaryLast.disable}
                                            keyboardType={'numeric'}
                                            charType={'double'}
                                            returnKeyType={'done'}
                                            onChangeText={(value) => {
                                                this.setState({
                                                    SalaryLast: {
                                                        ...SalaryLast,
                                                        value,
                                                        refresh: !SalaryLast.refresh
                                                    }
                                                });
                                            }}
                                        />
                                    </View>
                                    <View style={[controlDate_To, CustomStyleSheet.flex(6)]}>
                                        <VnrPicker
                                            api={CurrencyID2.api}
                                            refresh={CurrencyID2.refresh}
                                            textField={CurrencyID2.textField}
                                            valueField={CurrencyID2.valueField}
                                            filter={true}
                                            value={CurrencyID2.value}
                                            filterServer={false}
                                            autoFilter={true}
                                            disable={CurrencyID2.disable}
                                            onFinish={(item) =>
                                                this.setState({
                                                    CurrencyID2: {
                                                        ...CurrencyID2,
                                                        value: item,
                                                        refresh: !CurrencyID2.refresh
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* PositionLast */}
                        {PositionLast.visibleConfig && PositionLast.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={PositionLast.label} />
                                    {fieldValid.PositionLast && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrAutoComplete
                                        api={PositionLast.api}
                                        value={PositionLast.value}
                                        refresh={PositionLast.refresh}
                                        textField={PositionLast.textField}
                                        valueField={PositionLast.valueField}
                                        filter={true}
                                        filterServer={false}
                                        autoFilter={true}
                                        onFinish={(item) =>
                                            this.setState({
                                                PositionLast: {
                                                    ...PositionLast,
                                                    value: item,
                                                    refresh: !PositionLast.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* BussinessType */}
                        {BussinessType.visibleConfig && BussinessType.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={BussinessType.label} />
                                    {fieldValid.BussinessType && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={BussinessType.disable}
                                        refresh={BussinessType.refresh}
                                        value={BussinessType.value}
                                        multiline={false}
                                        onChangeText={(text) =>
                                            this.setState({
                                                BussinessType: {
                                                    ...BussinessType,
                                                    value: text,
                                                    refresh: !BussinessType.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* EmployeeType */}
                        {EmployeeType.visibleConfig && EmployeeType.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={EmployeeType.label} />
                                    {fieldValid.EmployeeType && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrAutoComplete
                                        api={EmployeeType.api}
                                        value={EmployeeType.value}
                                        refresh={EmployeeType.refresh}
                                        textField={EmployeeType.textField}
                                        valueField={EmployeeType.valueField}
                                        filter={true}
                                        filterServer={false}
                                        autoFilter={true}
                                        onFinish={(item) =>
                                            this.setState({
                                                EmployeeType: {
                                                    ...EmployeeType,
                                                    value: item,
                                                    refresh: !EmployeeType.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* YearOfExperience */}
                        {YearOfExperience.visible && YearOfExperience.visibleConfig && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={YearOfExperience.label}
                                    />

                                    {/* valid YearOfExperience */}
                                    {fieldValid.YearOfExperience && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        value={YearOfExperience.value}
                                        refresh={YearOfExperience.refresh}
                                        disable={YearOfExperience.disable}
                                        keyboardType={'numeric'}
                                        charType={'double'}
                                        returnKeyType={'done'}
                                        onChangeText={(value) => {
                                            this.setState({
                                                YearOfExperience: {
                                                    ...YearOfExperience,
                                                    value: value,
                                                    refresh: !YearOfExperience.refresh
                                                }
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        {/* CountryID */}
                        {CountryID.visible && CountryID.visibleConfig && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={CountryID.label} />

                                    {/* valid CountryID */}
                                    {fieldValid.CountryID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={CountryID.api}
                                        refresh={CountryID.refresh}
                                        textField={CountryID.textField}
                                        valueField={CountryID.valueField}
                                        filter={true}
                                        value={CountryID.value}
                                        filterServer={false}
                                        autoFilter={true}
                                        disable={CountryID.disable}
                                        onFinish={(item) =>
                                            this.setState({
                                                CountryID: {
                                                    ...CountryID,
                                                    value: item,
                                                    refresh: !CountryID.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* ProvinceID */}
                        {ProvinceID.visible && ProvinceID.visibleConfig && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={ProvinceID.label} />

                                    {/* valid ProvinceID */}
                                    {fieldValid.ProvinceID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={ProvinceID.api}
                                        refresh={ProvinceID.refresh}
                                        textField={ProvinceID.textField}
                                        valueField={ProvinceID.valueField}
                                        filter={true}
                                        value={ProvinceID.value}
                                        filterServer={true}
                                        autoFilter={false}
                                        filterParams="text"
                                        disable={ProvinceID.disable}
                                        onFinish={(item) =>
                                            this.setState({
                                                ProvinceID: {
                                                    ...ProvinceID,
                                                    value: item,
                                                    refresh: !ProvinceID.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* FileAttachment */}
                        {FileAttachment.visible && FileAttachment.visibleConfig && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={FileAttachment.label} />
                                </View>
                                <View style={viewControl}>
                                    <VnrAttachFile
                                        refresh={FileAttachment.refresh}
                                        value={FileAttachment.value}
                                        multiFile={true}
                                        uri={'[URI_POR]/New_Home/saveFileFromApp'}
                                        disable={FileAttachment.disable}
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
                            </View>
                        )}

                        {/* JobDescription */}
                        {JobDescription.visibleConfig && JobDescription.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={JobDescription.label} />
                                    {fieldValid.JobDescription && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={JobDescription.disable}
                                        refresh={JobDescription.refresh}
                                        value={JobDescription.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                JobDescription: {
                                                    ...JobDescription,
                                                    value: text,
                                                    refresh: !JobDescription.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* ResignReason */}
                        {ResignReason.visibleConfig && ResignReason.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={ResignReason.label} />
                                    {fieldValid.ResignReason && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={ResignReason.disable}
                                        refresh={ResignReason.refresh}
                                        value={ResignReason.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                ResignReason: {
                                                    ...ResignReason,
                                                    value: text,
                                                    refresh: !ResignReason.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        <View style={styleViewTitleGroup}>
                            <VnrText
                                style={[styleSheets.text, textLableGroup]}
                                i18nKey={'HRM_HR_CandidateHistory_SupRelation'}
                            />
                        </View>

                        {/* SupRelation */}
                        {SupRelation.visibleConfig && SupRelation.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={SupRelation.label} />
                                    {fieldValid.SupRelation && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={SupRelation.disable}
                                        refresh={SupRelation.refresh}
                                        value={SupRelation.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                SupRelation: {
                                                    ...SupRelation,
                                                    value: text,
                                                    refresh: !SupRelation.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* SupMobile */}
                        {SupMobile.visibleConfig && SupMobile.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={SupMobile.label} />
                                    {fieldValid.SupMobile && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        value={SupMobile.value}
                                        refresh={SupMobile.refresh}
                                        disable={SupMobile.disable}
                                        keyboardType={'numeric'}
                                        charType={'double'}
                                        returnKeyType={'done'}
                                        onChangeText={(value) => {
                                            this.setState({
                                                SupMobile: {
                                                    ...SupMobile,
                                                    value: value,
                                                    refresh: !SupMobile.refresh
                                                }
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        {/* SupEmail */}
                        {SupEmail.visibleConfig && SupEmail.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={SupEmail.label} />
                                    {fieldValid.SupEmail && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={SupEmail.disable}
                                        refresh={SupEmail.refresh}
                                        value={SupEmail.value}
                                        onBlur={() => this.handleValidateMail(SupEmail)}
                                        multiline={false}
                                        onChangeText={(text) =>
                                            this.setState({
                                                SupEmail: {
                                                    ...SupEmail,
                                                    value: text,
                                                    refresh: !SupEmail.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* SupPosition */}
                        {SupPosition.visibleConfig && SupPosition.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={SupPosition.label} />
                                    {fieldValid.SupPosition && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={SupPosition.disable}
                                        refresh={SupPosition.refresh}
                                        value={SupPosition.value}
                                        multiline={false}
                                        onChangeText={(text) =>
                                            this.setState({
                                                SupPosition: {
                                                    ...SupPosition,
                                                    value: text,
                                                    refresh: !SupPosition.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* SupComment */}
                        {SupComment.visibleConfig && SupComment.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={SupComment.label} />
                                    {fieldValid.SupComment && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={SupComment.disable}
                                        refresh={SupComment.refresh}
                                        value={SupComment.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                SupComment: {
                                                    ...SupComment,
                                                    value: text,
                                                    refresh: !SupComment.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}
                    </KeyboardAwareScrollView>

                    {/* bottom button close, confirm */}
                    <ListButtonSave listActions={listActions} />
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    styViewKeyBoard: { flexGrow: 1, paddingTop: 10 },
    styListBtnTypePregnancy: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: Size.defineSpace,
        justifyContent: 'space-between',
        marginVertical: Size.defineHalfSpace
    },
    styBtnTypePregnancy: {
        paddingHorizontal: Size.defineSpace * 0.8,
        paddingVertical: 5,
        backgroundColor: Colors.gray_3,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 11
    },
    styBtnTypePregnancyActive: {
        backgroundColor: Colors.primary
    },
    styBtnTypePregnancyTextActive: {
        color: Colors.white,
        fontWeight: '500'
    }
});
