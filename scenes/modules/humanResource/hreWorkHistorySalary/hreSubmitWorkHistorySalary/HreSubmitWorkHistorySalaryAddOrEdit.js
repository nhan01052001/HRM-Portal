import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    Colors,
    styleSafeAreaView,
    stylesListPickerControl,
    styleValid,
    Size,
    stylesModalPopupBottom,
    CustomStyleSheet,
    stylesScreenDetailV3
} from '../../../../../constants/styleConfig';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import VnrDate from '../../../../../components/VnrDate/VnrDate';
import VnrPicker from '../../../../../components/VnrPicker/VnrPicker';
import HttpService from '../../../../../utils/HttpService';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ConfigField } from '../../../../../assets/configProject/ConfigField';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import DrawerServices from '../../../../../utils/DrawerServices';
import { EnumName, EnumIcon } from '../../../../../assets/constant';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import VnrPickerQuickly from '../../../../../components/VnrPickerQuickly/VnrPickerQuickly';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { IconDown, IconUp, IconColse, IconCheckSquare, IconUnCheckSquare } from '../../../../../constants/Icons';
import Modal from 'react-native-modal';
import { translate } from '../../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrTreeView from '../../../../../components/VnrTreeView/VnrTreeView';

let enumName = null,
    profileInfo = null;

// need fix (Overtime)
const initSateDefault = {
    ID: null,
    ProfileID: {
        label: 'HRM_HR_Profile_Portal_ProfileName',
        data: [],
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true,
        isShowProfile: false
    },
    DateEffective: {
        label: 'lblform_Hre_WorkHistorySalary_DateEffective1',
        value: null,
        refresh: false,
        disable: true,
        visibleConfig: true,
        visible: true
    },
    DecisionDate: {
        label: 'DecisionDate',
        value: null,
        refresh: false,
        disable: true,
        visibleConfig: true,
        visible: true
    },
    TypeOfTransferID: {
        label: 'lblformTabWorkHistorySalaryInfo_TypeOfTransferID',
        data: [],
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    DecisionNo: {
        label: 'DecisionNo',
        disable: true,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    OrganizationStructureID: {
        label: 'lblform_Hre_WorkHistorySalary_OrganizationStructureID1',
        disable: true,
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    JobTitleID: {
        label: 'CostCenTreAllow__E_JOBTITTLE',
        data: [],
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    PositionID: {
        label: 'HRM_HR_Profile_PositionID',
        data: [],
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    CompanyID: {
        label: 'CompanyID',
        data: [],
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    AbilityTileID: {
        label: 'AbilityTileID',
        data: [],
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    PayrollGroupID: {
        label: 'PayrollGroupID',
        data: [],
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    WorkPlaceID: {
        label: 'WorkPlaceID',
        data: [],
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    RegionID: {
        label: 'HRM_Sal_ProductiveBusiness_RegionID',
        data: [],
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    UsualAllowanceGroupID: {
        data: [],
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },

    // Quản lý trực tiếp
    Supervisor: {
        label: 'HRM_Hre_CandidateGeneral_Supervisor',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    MidSupervisor: {
        label: 'HRM_Hre_CandidateGeneral_Midsupervisor',
        disable: false,
        visible: true,
        refresh: false,
        value: null,
        visibleConfig: true
    },
    NextSupervisor: {
        label: 'HRM_Hre_CandidateGeneral_Nextsupervisor',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    HighSupervisor: {
        label: 'HRM_Hre_CandidateGeneral_Highsupervisor',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    InfoApprove: {
        visible: true,
        visibleConfig: true,
        isShowInfoAdvance: false
    },
    InfoUser: {
        visible: true,
        visibleConfig: true,
        isShowInfoUser: false
    },

    // cập duyệt
    SuggetedUserID: {
        label: 'HRM_HR_Profile_SuggetedUserID',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    DateSugget: {
        label: 'DateSugget',
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },
    UserApproveID: {
        label: 'HRM_Hre_StopWorking_UserApproveID',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    UserApproveID2: {
        label: 'HRM_Hre_StopWorking_UserApproveID2',
        disable: false,
        visible: true,
        refresh: false,
        value: null,
        visibleConfig: true
    },
    UserApproveID3: {
        label: 'HRM_Hre_StopWorking_UserApproveID3',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    UserApproveID4: {
        label: 'HRM_Hre_StopWorking_UserApproveID4',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },

    // Thông tin lương cơ bản
    DateOfEffect: {
        label: 'lblform_Hre_WorkHistorySalary_DateEffective1',
        value: null,
        refresh: false,
        disable: true,
        visibleConfig: true,
        visible: true
    },
    IsCreateBasicSalary: {
        label: 'IsCreateBasicSalary',
        disable: false,
        refresh: false,
        value: false,
        visibleConfig: true,
        visible: true
    },
    GrossAmountMoneySalary: {
        label: 'HRM_Payroll_BasicSalary',
        value: '',
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },
    CurrencyIDSalary: {
        label: 'HRM_Payroll_BasicSalary',
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },

    InsuranceAmountSalary: {
        label: 'SalaryType__E_SALARY_INSURANCE',
        value: '',
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },
    CurrencyInsID: {
        label: 'CurrencyInsID',
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },
    AmountTotalSalary: {
        label: 'lblform_Hre_WorkHistorySalary_AmountTotalSalary',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },

    NoteSalary: {
        label: 'Note',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    AllowanceType: {
        AllowanceType1ID: {
            AllowanceType1IDSalary: {
                label: 'AllowanceID1',
                value: null,
                valueSalary: '',
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            AllowanceAmount1Salary: {
                value: null,
                valueSalary: '',
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            CurrencyID1Salary: {
                disable: false,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: true
            }
        },
        AllowanceType2ID: {
            AllowanceType2IDSalary: {
                label: 'AllowanceID2',
                value: null,
                valueSalary: '',
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            AllowanceAmount2Salary: {
                value: null,
                valueSalary: '',
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            CurrencyID2Salary: {
                disable: false,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: true
            }
        },
        AllowanceType3ID: {
            AllowanceType3IDSalary: {
                label: 'AllowanceID3',
                value: null,
                valueSalary: '',
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            AllowanceAmount3Salary: {
                value: null,
                valueSalary: '',
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            CurrencyID3Salary: {
                disable: false,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: true
            }
        },
        AllowanceType4ID: {
            AllowanceType4IDSalary: {
                label: 'AllowanceID4',
                value: null,
                valueSalary: '',
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            AllowanceAmount4Salary: {
                value: null,
                valueSalary: '',
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            CurrencyID4Salary: {
                disable: false,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: true
            }
        },
        AllowanceType5ID: {
            AllowanceType5IDSalary: {
                label: 'AllowanceID5',
                value: null,
                valueSalary: '',
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            AllowanceAmount5Salary: {
                value: null,
                valueSalary: '',
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            CurrencyID5Salary: {
                disable: false,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: true
            }
        },
        AllowanceType6ID: {
            AllowanceType6IDSalary: {
                label: 'AllowanceID6',
                value: null,
                valueSalary: '',
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            AllowanceAmount6Salary: {
                value: null,
                valueSalary: '',
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            CurrencyID6Salary: {
                disable: false,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: true
            }
        },
        AllowanceType7ID: {
            AllowanceType7IDSalary: {
                label: 'AllowanceID7',
                value: null,
                valueSalary: '',
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            AllowanceAmount7Salary: {
                value: null,
                valueSalary: '',
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            CurrencyID7Salary: {
                disable: false,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: true
            }
        },
        AllowanceType8ID: {
            AllowanceType8IDSalary: {
                label: 'AllowanceID8',
                value: null,
                valueSalary: '',
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            AllowanceAmount8Salary: {
                value: null,
                valueSalary: '',
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            CurrencyID8Salary: {
                disable: false,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: true
            }
        },
        AllowanceType9ID: {
            AllowanceType9IDSalary: {
                label: 'AllowanceID9',
                value: null,
                valueSalary: '',
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            AllowanceAmount9Salary: {
                value: null,
                valueSalary: '',
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            CurrencyID9Salary: {
                disable: false,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: true
            }
        },
        AllowanceType10ID: {
            AllowanceType10IDSalary: {
                label: 'AllowanceID10',
                value: null,
                valueSalary: '',
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            AllowanceAmount10Salary: {
                value: null,
                valueSalary: '',
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            CurrencyID10Salary: {
                disable: false,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: true
            }
        },
        AllowanceType11ID: {
            AllowanceType11IDSalary: {
                label: 'AllowanceID11',
                value: null,
                valueSalary: '',
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            AllowanceAmount11Salary: {
                value: null,
                valueSalary: '',
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            CurrencyID11Salary: {
                disable: false,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: true
            }
        },
        AllowanceType12ID: {
            AllowanceType12IDSalary: {
                label: 'AllowanceID12',
                value: null,
                valueSalary: '',
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            AllowanceAmount12Salary: {
                value: null,
                valueSalary: '',
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            CurrencyID12Salary: {
                disable: false,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: true
            }
        },
        AllowanceType13ID: {
            AllowanceType13IDSalary: {
                label: 'AllowanceID13',
                value: null,
                valueSalary: '',
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            AllowanceAmount13Salary: {
                value: null,
                valueSalary: '',
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            CurrencyID13Salary: {
                disable: false,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: true
            }
        },
        AllowanceType14ID: {
            AllowanceType14IDSalary: {
                label: 'AllowanceID14',
                value: null,
                valueSalary: '',
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            AllowanceAmount14Salary: {
                value: null,
                valueSalary: '',
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            CurrencyID14Salary: {
                disable: false,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: true
            }
        },
        AllowanceType15ID: {
            AllowanceType15IDSalary: {
                label: 'AllowanceID15',
                value: null,
                valueSalary: '',
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            AllowanceAmount15Salary: {
                value: null,
                valueSalary: '',
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            CurrencyID15Salary: {
                disable: false,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: true
            }
        }
    },

    dataError: null,
    modalErrorDetail: {
        isModalVisible: false,
        cacheID: null,
        data: []
    },
    fieldValid: {}
};

export default class HreSubmitWorkHistorySalaryAddOrEdit extends Component {
    constructor(props) {
        super(props);

        this.state = initSateDefault;

        // need fix
        props.navigation.setParams({
            title:
                props.navigation.state.params && props.navigation.state.params.record
                    ? 'HRM_HR_WorkHistorySalary_Update'
                    : 'HRM_HR_WorkHistorySalary_AddNew'
        });

        this.setVariable();
    }
    //#region [khởi tạo - lấy các dữ liệu cho control, lấy giá trị mặc đinh]
    setVariable = () => {
        //biến trạng thái
        this.isModify = false;
        //check processing cho nhấn lưu nhiều lần
        this.isProcessing = false;

        this.isChangeLevelApprove = null;
        this.levelApproveLateEarlyAllowed = null;

        this.strActionStatus = null;
    };

    refreshView = () => {
        this.props.navigation.setParams({ title: 'HRM_Attendance_RegisterVehicle_Popup_Create' });
        this.setVariable();

        // const { DateFrom, DateTo } = this.state;
        let resetState = {
            ...initSateDefault
            // DateFrom: {
            //   ...initSateDefault.DateFrom,
            //   refresh: !DateFrom.refresh
            // },
            // DateTo: {
            //   ...initSateDefault.DateTo,
            //   refresh: !DateTo.refresh
            // }
        };
        this.setState(resetState, () => this.getConfigValid('Hre_WorkHistory', true));
    };

    //promise get config valid
    getConfigValid = (tblName, isRefresh) => {
        VnrLoadingSevices.show();
        HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + tblName).then((res) => {
            VnrLoadingSevices.hide();
            if (res) {
                try {
                    //map field hidden by config
                    const _configField =
                        ConfigField && ConfigField.value['HreSubmitWorkHistorySalaryAddOrEdit']
                            ? ConfigField.value['HreSubmitWorkHistorySalaryAddOrEdit']['Hidden']
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
        //get config validate
        this.getConfigValid('Hre_WorkHistory');
    }

    onChangeProfileID = (value) => {
        const { ProfileID } = this.state;

        this.setState(
            {
                ProfileID: {
                    ...ProfileID,
                    value: value,
                    refresh: !ProfileID.refresh
                }
            },
            () => {
                this.initUser();
            }
        );
    };

    initUser = () => {
        const {
            ProfileID,
            TypeOfTransferID,
            JobTitleID,
            PositionID,
            CompanyID,
            AbilityTileID,
            PayrollGroupID,
            WorkPlaceID,
            RegionID,
            OrganizationStructureID,
            DateEffective,
            DecisionNo,
            DecisionDate,
            UsualAllowanceGroupID,
            // Quản lý trực tiếp
            Supervisor,
            MidSupervisor,
            NextSupervisor,
            HighSupervisor,

            // cập duyệt
            //InfoApprove,
            SuggetedUserID,
            DateSugget,
            // UserApproveID,
            // UserApproveID2,
            // UserApproveID3,
            // UserApproveID4,

            // Thông tin lương cơ bản
            DateOfEffect,
            IsCreateBasicSalary,
            GrossAmountMoneySalary,
            CurrencyIDSalary,

            InsuranceAmountSalary,
            CurrencyInsID,
            AmountTotalSalary,
            NoteSalary,
            AllowanceType
        } = this.state;

        if (ProfileID.value) {
            let _profileid = ProfileID.value.ID;

            VnrLoadingSevices.show();
            HttpService.MultiRequest([
                HttpService.Get('[URI_POR]/New_Hre_WorkHistorySalary/GetDefaultValue'),
                HttpService.Get('[URI_HR]/Cat_GetData/GetUsualAllowanceForPriotity'),
                HttpService.Get('[URI_HR]/Cat_GetData/GetMultiUsualAllowance'),
                HttpService.Get('[URI_HR]/Cat_GetData/GetMultiCurrency'),

                HttpService.Get('[URI_HR]/Cat_GetData/GetMultiJobTitle'),
                HttpService.Get('[URI_HR]/Cat_GetData/GetMultiPosition'),
                HttpService.Get('[URI_HR]/Cat_GetData/GetMultiCompany'),
                HttpService.Get('[URI_HR]/Cat_GetData/GetMultiWorkPlace')
            ]).then((data) => {
                VnrLoadingSevices.hide();
                let nextState = {};
                const item = data[0],
                    item2 = data[1],
                    dataUsual = data[2],
                    dataCurrency = data[3];

                if (item) {
                    if (!item.TypeAppendixContractExtend) item.TypeAppendixContractExtend = 'E_ADJUST';

                    if (!item.AppendixStatusContractExtend) item.AppendixStatusContractExtend = 'E_WAITINGCONFIRM';
                }

                nextState = {
                    TypeOfTransferID: {
                        ...TypeOfTransferID,
                        value:
                            item.TypeOfTransferID && item.TypeOfTransferName
                                ? {
                                    NameEntityName: item.TypeOfTransferName,
                                    ID: item.TypeOfTransferID
                                }
                                : null,
                        disable: false,
                        refresh: !TypeOfTransferID.refresh
                    },
                    JobTitleID: {
                        ...JobTitleID,
                        disable: false,
                        data: data[4],
                        value: item.JobTitleID ? { ID: item.JobTitleID, JobTitleName: item.JobTitleName } : null,
                        refresh: !JobTitleID.refresh
                    },
                    PositionID: {
                        ...PositionID,
                        disable: false,
                        data: data[5],
                        value: item.PositionID ? { ID: item.PositionID, PositionName: item.PositionName } : null,
                        refresh: !PositionID.refresh
                    },
                    CompanyID: {
                        ...CompanyID,
                        disable: false,
                        data: data[6],
                        value: item.CompanyID ? { ID: item.CompanyID, CompanyName: item.CompanyName } : null,
                        refresh: !CompanyID.refresh
                    },
                    AbilityTileID: {
                        ...AbilityTileID,
                        disable: false,
                        value: item.AbilityTileID
                            ? { ID: item.AbilityTileID, AbilityTileName: item.AbilityTitleVNI }
                            : null,
                        refresh: !AbilityTileID.refresh
                    },
                    PayrollGroupID: {
                        ...PayrollGroupID,
                        disable: false,
                        value: item.PayrollGroupID
                            ? { ID: item.PayrollGroupID, PayrollGroupName: item.PayrollGroupName }
                            : null,
                        refresh: !PayrollGroupID.refresh
                    },
                    WorkPlaceID: {
                        ...WorkPlaceID,
                        disable: false,
                        data: data[7],
                        value: item.WorkPlaceID ? { ID: item.WorkPlaceID, WorkPlaceName: item.WorkPlaceName } : null,
                        refresh: !WorkPlaceID.refresh
                    },
                    RegionID: {
                        ...RegionID,
                        disable: false,
                        value: item.RegionID ? { ID: item.RegionID, RegionName: item.RegionName } : null,
                        refresh: !RegionID.refresh
                    },
                    UsualAllowanceGroupID: {
                        ...UsualAllowanceGroupID,
                        disable: false,
                        value: item.UsualAllowanceGroupID
                            ? { ID: item.UsualAllowanceGroupID, UsualAllowanceGroupName: item.UsualAllowanceGroupName }
                            : null,
                        refresh: !UsualAllowanceGroupID.refresh
                    },
                    SuggetedUserID: {
                        ...SuggetedUserID,
                        disable: false,
                        value: item.SuggetedUserID
                            ? { ID: item.SuggetedUserID, ProfileName: item.SuggetedUserName }
                            : null,
                        refresh: !SuggetedUserID.refresh
                    },
                    DateSugget: {
                        ...DateSugget,
                        disable: false,
                        value: item.DateSugget ? Vnr_Function.formatDateAPI(item.DateSugget) : null,
                        refresh: !DateSugget.refresh
                    },
                    DateEffective: {
                        ...DateEffective,
                        disable: false,
                        value: item.DateEffective ? Vnr_Function.formatDateAPI(item.DateEffective) : null,
                        refresh: !DateEffective.refresh
                    },

                    DecisionDate: {
                        ...DecisionDate,
                        disable: false,
                        value: item.DecisionDate ? Vnr_Function.formatDateAPI(item.DecisionDate) : null,
                        refresh: !DecisionDate.refresh
                    },
                    DecisionNo: {
                        ...DecisionNo,
                        disable: false,
                        value: item.DecisionNo ? `${item.DecisionNo}` : null,
                        refresh: !DecisionNo.refresh
                    },
                    GrossAmountMoneySalary: {
                        ...GrossAmountMoneySalary,
                        disable: false,
                        value: item.GrossAmountMoneySalary
                            ? `${Vnr_Function.formatNumber(item.GrossAmountMoneySalary)}`
                            : '',
                        refresh: !GrossAmountMoneySalary.refresh
                    },
                    CurrencyIDSalary: {
                        ...CurrencyIDSalary,
                        disable: false,
                        data: dataCurrency,
                        value: item.CurrencyIDSalary
                            ? { ID: item.CurrencyIDSalary, CurrencyName: item.CurrencyNameSalary }
                            : null,
                        refresh: !CurrencyIDSalary.refresh
                    },

                    DateOfEffect: {
                        ...DateOfEffect,
                        disable: false,
                        value: item.DateOfEffect ? Vnr_Function.formatDateAPI(item.DateOfEffect) : null,
                        refresh: !DateOfEffect.refresh
                    },
                    InsuranceAmountSalary: {
                        ...InsuranceAmountSalary,
                        disable: false,
                        value: item.InsuranceAmountSalary
                            ? `${Vnr_Function.formatNumber(item.InsuranceAmountSalary)}`
                            : ''
                    },
                    CurrencyInsID: {
                        ...CurrencyInsID,
                        disable: false,
                        data: dataCurrency,
                        value: item.CurrencyInsID
                            ? { ID: item.CurrencyInsIDm, CurrencyName: item.CurrencyNameIns }
                            : null,
                        refresh: !CurrencyInsID.refresh
                    },
                    AmountTotalSalary: {
                        ...AmountTotalSalary,
                        disable: false,
                        value: item.AmountTotalSalary ? `${Vnr_Function.formatNumber(item.AmountTotalSalary)}` : ''
                    },
                    NoteSalary: {
                        ...NoteSalary,
                        disable: false,
                        value: item.NoteSalary ? `${item.NoteSalary}` : ''
                    },

                    IsCreateBasicSalary: {
                        ...IsCreateBasicSalary,
                        value: false
                    }
                };

                let nextAllowanceType = {
                    ...AllowanceType
                };

                for (let index = 1; index <= Object.keys(AllowanceType).length; index++) {
                    let keyField = `AllowanceType${index}ID`,
                        keyType = `AllowanceType${index}IDSalary`,
                        keyAmount = `AllowanceAmount${index}Salary`,
                        keyCurency = `CurrencyID${index}Salary`,
                        keyCurencyName = `CurrencyName${index}Salary`,
                        _AllowanceTypeID = AllowanceType[keyField];

                    nextAllowanceType = {
                        ...nextAllowanceType,
                        //---------------//
                        [keyField]: {
                            ..._AllowanceTypeID,
                            [keyType]: {
                                ..._AllowanceTypeID[keyType],
                                data: dataUsual,
                                value: item2[index].ID ? dataUsual.find((item) => item.ID == item2[index].ID) : null,
                                refresh: _AllowanceTypeID[keyType].refresh
                            },
                            [keyAmount]: {
                                ..._AllowanceTypeID[keyAmount],
                                value: item[keyAmount] ? `${Vnr_Function.formatNumber(item[keyAmount])}` : '',
                                refresh: _AllowanceTypeID[keyAmount].refresh
                            },
                            [keyCurency]: {
                                ..._AllowanceTypeID[keyCurency],
                                data: dataCurrency,
                                value: item[keyCurency]
                                    ? { ID: item[keyCurency], CurrencyName: item[keyCurencyName] }
                                    : null,
                                refresh: _AllowanceTypeID[keyCurency].refresh
                            }
                            //---------------//
                        }
                    };
                }

                nextState = {
                    ...nextState,
                    AllowanceType: nextAllowanceType
                };
                VnrLoadingSevices.show();
                HttpService.Post('[URI_HR]/Hre_GetData/GetDataViewWorkHistoryByProfileID', {
                    ProfileID: _profileid
                }).then((resData) => {
                    VnrLoadingSevices.hide();
                    if (resData.JobTitleID) {
                        nextState = {
                            ...nextState,
                            JobTitleID: {
                                ...nextState.JobTitleID,
                                value: resData.JobTitleID
                                    ? { ID: resData.JobTitleID, JobTitleName: resData.JobTitleName }
                                    : null
                            }
                        };
                    }

                    if (resData.PositionID) {
                        nextState = {
                            ...nextState,
                            PositionID: {
                                ...nextState.PositionID,
                                value: resData.PositionID
                                    ? { ID: resData.PositionID, PositionName: resData.PositionName }
                                    : null
                            }
                        };
                    }

                    if (resData.DateOfEffect) {
                        nextState = {
                            ...nextState,
                            DateOfEffect: {
                                ...nextState.DateOfEffect,
                                value: resData.DateOfEffect ? Vnr_Function.formatDateAPI(resData.DateOfEffect) : null
                            },
                            DateEffective: {
                                ...nextState.DateEffective,
                                value: resData.DateOfEffect ? Vnr_Function.formatDateAPI(resData.DateOfEffect) : null
                            }
                        };
                    }

                    if (resData.UsualAllowanceGroupID) {
                        nextState = {
                            ...nextState,
                            UsualAllowanceGroupID: {
                                ...nextState.UsualAllowanceGroupID,
                                value: resData.UsualAllowanceGroupID
                                    ? {
                                        ID: resData.UsualAllowanceGroupID,
                                        UsualAllowanceGroupName: resData.UsualAllowanceGroupName
                                    }
                                    : null
                            }
                        };
                    }

                    if (resData.CompanyID) {
                        nextState = {
                            ...nextState,
                            CompanyID: {
                                ...nextState.CompanyID,
                                value: resData.CompanyID
                                    ? { ID: resData.CompanyID, CompanyName: resData.CompanyName }
                                    : null
                            }
                        };
                    }

                    if (resData.PayrollGroupID) {
                        nextState = {
                            ...nextState,
                            PayrollGroupID: {
                                ...nextState.PayrollGroupID,
                                value: resData.PayrollGroupID
                                    ? { ID: resData.PayrollGroupID, PayrollGroupName: resData.PayrollGroupName }
                                    : null
                            }
                        };
                    }

                    if (resData.WorkPlaceID) {
                        nextState = {
                            ...nextState,
                            WorkPlaceID: {
                                ...nextState.WorkPlaceID,
                                value: resData.WorkPlaceID
                                    ? { ID: resData.WorkPlaceID, WorkPlaceName: resData.WorkPlaceName }
                                    : null
                            }
                        };
                    }

                    if (resData.RegionID) {
                        nextState = {
                            ...nextState,
                            RegionID: {
                                ...nextState.RegionID,
                                value: resData.RegionID
                                    ? { ID: resData.RegionID, RegionName: resData.RegionName }
                                    : null
                            }
                        };
                    }

                    nextState = {
                        ...nextState,
                        OrganizationStructureID: {
                            ...OrganizationStructureID,
                            value: resData.OrgStructureID
                                ? [
                                    {
                                        Name: `${resData.OrgStructureCode} - ${resData.OrgStructureName}`,
                                        id: resData.OrgStructureID
                                    }
                                ]
                                : null,
                            refresh: !OrganizationStructureID.refresh
                        },
                        Supervisor: {
                            ...Supervisor,
                            value: resData.SupervisorID
                                ? {
                                    ID: resData.SupervisorID,
                                    ProfileName: resData.SupervisorName,
                                    CodeEmp: resData.SupervisorCode
                                }
                                : null,
                            refresh: !Supervisor.refresh
                        },
                        MidSupervisor: {
                            ...MidSupervisor,
                            value: item.MidSupervisorID
                                ? {
                                    ID: item.MidSupervisorID,
                                    ProfileName: item.MidSupervisorName,
                                    CodeEmp: resData.MidSupervisorCode
                                }
                                : null,
                            refresh: !MidSupervisor.refresh
                        },
                        NextSupervisor: {
                            ...NextSupervisor,
                            value: item.NextSupervisorID
                                ? {
                                    ID: item.NextSupervisorID,
                                    ProfileName: item.NextSupervisorName,
                                    CodeEmp: resData.NextSupervisorCode
                                }
                                : null,
                            refresh: !NextSupervisor.refresh
                        },
                        HighSupervisor: {
                            ...HighSupervisor,
                            value: item.HighSupervisorID
                                ? {
                                    ID: item.HighSupervisorID,
                                    ProfileName: item.HighSupervisorName,
                                    CodeEmp: resData.HighSupervisorCode
                                }
                                : null,
                            refresh: !HighSupervisor.refresh
                        }
                    };

                    this.setState(nextState, () => {
                        this.getUserApprove();
                        this.SetDataSupervisorByConfig();
                        //this.DateStartContractExtend();
                        this.onchangePosition();
                    });
                });
            });
        }
    };

    // DateStartContractExtend = () => {
    //   const {
    //     ProfileID,
    //     TypeOfTransferID,
    //     JobTitleID,
    //     PositionID,
    //     CompanyID,
    //     AbilityTileID,
    //     PayrollGroupID,
    //     WorkPlaceID,
    //     RegionID,
    //     OrganizationStructureID,
    //     DateEffective,
    //     DecisionNo,
    //     DecisionDate,
    //     // Quản lý trực tiếp
    //     Supervisor,
    //     MidSupervisor,
    //     NextSupervisor,
    //     HighSupervisor,

    //     // cập duyệt
    //     //InfoApprove,
    //     SuggetedUserID,
    //     DateSugget,
    //     UserApproveID,
    //     UserApproveID2,
    //     UserApproveID3,
    //     UserApproveID4,

    //     // Thông tin lương cơ bản
    //     DateOfEffect,
    //     IsCreateBasicSalary,
    //     GrossAmountMoneySalary,
    //     CurrencyIDSalary,

    //     InsuranceAmountSalary,
    //     CurrencyInsID,
    //     AmountTotalSalary,
    //     NoteSalary,
    //     AllowanceType,

    //   } = this.state;

    //   if (ProfileID.value && DateOfEffect.value) {
    //     let _profileid = ProfileID.value.ID;
    //     VnrLoadingSevices.show();
    //     HttpService.Post('[URI_HR]/Hre_GetData/GetWorkHistoryDataForCreateContract', {
    //       ProfileID: _profileid,
    //       dateStart: Vnr_Function.parseDateTime(DateOfEffect.value)
    //     })
    //       .then(data => {
    //         let nextState = {};
    //         console.log(data, 'data');

    //         VnrLoadingSevices.hide();
    //         if (data.Salary) {
    //           _Salary.value(data1.Salary);

    //           if (data1.CurrencyIDSalary && data1.CurrencyIDSalaryName) {
    //             _CurenncyIDSalary.value(data1.CurrencyIDSalary);
    //             _CurenncyIDSalary.text(data1.CurrencyIDSalaryName);
    //           }
    //         }
    //         if (data1.InsuranceAmount) {
    //           _InsuranceAmount.value(data1.InsuranceAmount);
    //           if (data1.CurenncyID && data1.CurrencyIDInsName) {
    //             _CurenncyIDIns.value(data1.CurenncyID);
    //             _CurenncyIDIns.text(data1.CurrencyIDInsName);
    //           }
    //         }
    //       });
    //   }

    // }

    SetDataSupervisorByConfig = () => {
        const {
            ProfileID,
            OrganizationStructureID,
            JobTitleID,
            PositionID,
            DateEffective,
            WorkPlaceID,
            Supervisor,
            MidSupervisor,
            NextSupervisor,
            HighSupervisor
        } = this.state;

        if (ProfileID.value) {
            const profileID = ProfileID.value?.ID;
            let nextState = {};

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Hre_GetData/GetSupervisorByConfig', {
                positionID: PositionID.value ? PositionID.value.ID : null,
                ProfileID: profileID,
                DateEffective: DateEffective.value ? Vnr_Function.formatDateAPI(DateEffective.value) : null,
                organizationStructureID: OrganizationStructureID.value ? OrganizationStructureID.value[0].id : null,
                jobTitle: JobTitleID.value ? JobTitleID.value.ID : null,
                workPlaceId: WorkPlaceID.value ? WorkPlaceID.value.ID : null
            }).then((data) => {
                VnrLoadingSevices.hide();

                nextState = {
                    ...nextState,
                    Supervisor: {
                        ...Supervisor,
                        value: data.SupervisorCode
                            ? { ProfileName: data.SupervisorCodeName, CodeEmp: data.SupervisorCode }
                            : null,
                        refresh: !Supervisor.refresh
                    },
                    MidSupervisor: {
                        ...MidSupervisor,
                        value: data.NextMidSupervisorCode
                            ? { ProfileName: data.NextMidSupervisorCodeName, CodeEmp: data.NextMidSupervisorCode }
                            : null,
                        refresh: !MidSupervisor.refresh
                    },
                    NextSupervisor: {
                        ...NextSupervisor,
                        value: data.SupervisorNextCode
                            ? { ProfileName: data.SupervisorNextCodeName, CodeEmp: data.SupervisorNextCode }
                            : null,
                        refresh: !NextSupervisor.refresh
                    },
                    HighSupervisor: {
                        ...HighSupervisor,
                        value: data.HighSupervisorCode
                            ? { ProfileName: data.HighSupervisorCodeName, CodeEmp: data.HighSupervisorCode }
                            : null,
                        refresh: !HighSupervisor.refresh
                    }
                };

                this.setState(nextState);
            });
        }
    };

    //config user approve
    getUserApprove = () => {
        const _UserSubmit = dataVnrStorage.currentUser.info.userid,
            {
                UserApproveID,
                UserApproveID2,
                UserApproveID3,
                UserApproveID4,
                ProfileID,
                OrganizationStructureID,
                AbilityTileID,
                PositionID,
                JobTitleID,
                TypeOfTransferID,
                CompanyID,
                DateEffective
            } = this.state;

        if (ProfileID.value == null) {
            return;
        }
        const profileID = ProfileID.value?.ID;

        HttpService.Post('[URI_HR]/Hre_GetData/GetUserApproveWithType', {
            // userSubmit: _UserSubmit, profileID: profileID, Type: 'E_STOPWORKING', DateStart: dateStopVal
            userSubmit: _UserSubmit,
            profileID: profileID,
            Type: 'E_WORKHISTORYSALARY',
            organizationStructureID: OrganizationStructureID.value ? OrganizationStructureID.value.id : null,
            AbtilityID: AbilityTileID.value ? AbilityTileID.value.ID : null,
            DateStart: DateEffective.value ? Vnr_Function.formatDateAPI(DateEffective.value) : null,
            PosID: PositionID.value ? PositionID.value.ID : null,
            '_dic[0].Key': 'TypeOfTransferID', // QUyen.Quach 10/04/2020
            '_dic[0].Value': TypeOfTransferID.value ? TypeOfTransferID.value.ID : null,
            employeeTypeID: null,
            jobTitleID: JobTitleID.value ? JobTitleID.value.ID : null,
            salaryClassID: null,
            companyID: CompanyID.value ? CompanyID.value.ID : null
        }).then((data) => {
            //VnrLoadingSevices.hide();

            try {
                if (data != null) {
                    let nextState = {
                        UserApproveID: { ...UserApproveID },
                        UserApproveID2: { ...UserApproveID2 },
                        UserApproveID3: { ...UserApproveID3 },
                        UserApproveID4: { ...UserApproveID4 }
                    };

                    //_UserApproveID4.readonly(false);
                    this.levelApproved = data.LevelApprove;

                    if (data.LevelApprove == '1' || data.LevelApprove == '2') {
                        //isShowEle('#div_NguoiDuyetKeTiepStop');
                        //isShowEle('#div_NguoiDuyetTiepTheoStop');

                        nextState = {
                            ...nextState,
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                visible: false,
                                refresh: !UserApproveID2.refresh
                            },
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                visible: false,
                                refresh: !UserApproveID3.refresh
                            }
                        };

                        if (data.LevelApprove == '1') {
                            if (data.SupervisorID != null) {
                                // _UserApproveID.dataSource.add({ UserInfoName: data.SupervisorName, ID: data.SupervisorID });
                                // _UserApproveID.refresh();
                                // _UserApproveID.value([data.SupervisorID]);

                                nextState = {
                                    ...nextState,
                                    UserApproveID: {
                                        ...nextState.UserApproveID,
                                        refresh: !UserApproveID.refresh,
                                        value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID }
                                    },
                                    UserApproveID4: {
                                        ...nextState.UserApproveID4,
                                        refresh: !UserApproveID4.refresh,
                                        value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID }
                                    }
                                };

                                // _UserApproveID4.dataSource.add({ UserInfoName: data.SupervisorName, ID: data.SupervisorID });
                                // _UserApproveID4.refresh();
                                // _UserApproveID4.value([data.SupervisorID]);
                                // _UserApproveID4.readonly(true);
                            }
                        }

                        if (data.LevelApprove == '2') {
                            if (data.IsOnlyOneLevelApprove == true) {
                                this.isOnlyOneLevelApprove = true;

                                nextState = {
                                    ...nextState,
                                    UserApproveID4: {
                                        ...nextState.UserApproveID4,
                                        disable: true,
                                        refresh: !UserApproveID4.refresh
                                    }
                                };

                                //_UserApproveID4.readonly(true);
                                if (data.SupervisorID != null) {
                                    // _UserApproveID.dataSource.add({ UserInfoName: data.SupervisorName, ID: data.SupervisorID });
                                    // _UserApproveID.refresh();
                                    // _UserApproveID.value([data.SupervisorID]);

                                    // _UserApproveID2.dataSource.add({ UserInfoName: data.SupervisorName, ID: data.SupervisorID });
                                    // _UserApproveID2.refresh();
                                    // _UserApproveID2.value([data.SupervisorID]);

                                    nextState = {
                                        ...nextState,
                                        UserApproveID: {
                                            ...nextState.UserApproveID,
                                            value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID },
                                            refresh: !UserApproveID.refresh
                                        },
                                        UserApproveID2: {
                                            ...nextState.UserApproveID2,
                                            value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID },
                                            refresh: !UserApproveID2.refresh
                                        },
                                        UserApproveID3: {
                                            ...nextState.UserApproveID3,
                                            value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID },
                                            refresh: !UserApproveID3.refresh
                                        },
                                        UserApproveID4: {
                                            ...nextState.UserApproveID4,
                                            value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID },
                                            refresh: !UserApproveID4.refresh
                                        }
                                    };
                                    // _UserApproveID3.dataSource.add({ UserInfoName: data.SupervisorName, ID: data.SupervisorID });
                                    // _UserApproveID3.refresh();
                                    // _UserApproveID3.value([data.SupervisorID]);

                                    // _UserApproveID4.dataSource.add({ UserInfoName: data.SupervisorName, ID: data.SupervisorID });
                                    // _UserApproveID4.refresh();
                                    // _UserApproveID4.value([data.SupervisorID]);
                                }
                            } else {
                                if (data.SupervisorID != null) {
                                    // _UserApproveID.dataSource.add({ UserInfoName: data.SupervisorName, ID: data.SupervisorID });
                                    // _UserApproveID.refresh();
                                    // _UserApproveID.value([data.SupervisorID]);
                                    nextState = {
                                        ...nextState,
                                        UserApproveID: {
                                            ...nextState.UserApproveID,
                                            refresh: !UserApproveID.refresh,
                                            value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID }
                                        }
                                    };
                                }
                                if (data.MidSupervisorID != null) {
                                    // _UserApproveID2.dataSource.add({ UserInfoName: data.SupervisorNextName, ID: data.MidSupervisorID });
                                    // _UserApproveID2.refresh();
                                    // _UserApproveID2.value([data.MidSupervisorID]);

                                    // _UserApproveID3.dataSource.add({ UserInfoName: data.SupervisorNextName, ID: data.MidSupervisorID });
                                    // _UserApproveID3.refresh();
                                    // _UserApproveID3.value([data.MidSupervisorID]);

                                    // _UserApproveID4.dataSource.add({ UserInfoName: data.SupervisorNextName, ID: data.MidSupervisorID });
                                    // _UserApproveID4.refresh();
                                    // _UserApproveID4.value([data.MidSupervisorID]);

                                    nextState = {
                                        ...nextState,
                                        UserApproveID2: {
                                            ...nextState.UserApproveID2,
                                            refresh: !UserApproveID2.refresh,
                                            value: { UserInfoName: data.SupervisorNextName, ID: data.MidSupervisorID }
                                        },
                                        UserApproveID3: {
                                            ...nextState.UserApproveID3,
                                            refresh: !UserApproveID3.refresh,
                                            value: { UserInfoName: data.SupervisorNextName, ID: data.MidSupervisorID }
                                        },
                                        UserApproveID4: {
                                            ...nextState.UserApproveID4,
                                            refresh: !UserApproveID4.refresh,
                                            value: { UserInfoName: data.SupervisorNextName, ID: data.MidSupervisorID }
                                        }
                                    };
                                }
                            }
                        }
                    } else if (data.LevelApprove == '3') {
                        //$("#div_NguoiDuyetKeTiepStop").show();
                        //$("#div_NguoiDuyetTiepTheoStop").hide();

                        // isShowEle('#div_NguoiDuyetKeTiepStop', true);
                        // isShowEle('#div_NguoiDuyetTiepTheoStop');

                        nextState = {
                            ...nextState,
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                visible: true,
                                refresh: !UserApproveID2.refresh
                            },
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                visible: false,
                                refresh: !UserApproveID3.refresh
                            }
                        };

                        if (data.SupervisorID != null) {
                            // _UserApproveID.dataSource.add({ UserInfoName: data.SupervisorName, ID: data.SupervisorID });
                            // _UserApproveID.refresh();
                            // _UserApproveID.value([data.SupervisorID]);
                            nextState = {
                                ...nextState,
                                UserApproveID: {
                                    ...nextState.UserApproveID,
                                    refresh: !UserApproveID.refresh,
                                    value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID }
                                }
                            };
                        }
                        if (data.MidSupervisorID != null) {
                            // _UserApproveID2.dataSource.add({ UserInfoName: data.SupervisorNextName, ID: data.MidSupervisorID });
                            // _UserApproveID2.refresh();
                            // _UserApproveID2.value([data.MidSupervisorID]);
                            nextState = {
                                ...nextState,
                                UserApproveID2: {
                                    ...nextState.UserApproveID2,
                                    refresh: !UserApproveID2.refresh,
                                    value: { UserInfoName: data.SupervisorNextName, ID: data.MidSupervisorID }
                                }
                            };
                        }
                        if (data.NextMidSupervisorID != null) {
                            // _UserApproveID3.dataSource.add({ UserInfoName: data.NextMidSupervisorName, ID: data.NextMidSupervisorID });
                            // _UserApproveID3.refresh();
                            // _UserApproveID3.value([data.NextMidSupervisorID]);

                            // _UserApproveID4.dataSource.add({ UserInfoName: data.NextMidSupervisorName, ID: data.NextMidSupervisorID });
                            // _UserApproveID2.refresh();
                            // _UserApproveID4.value(data.NextMidSupervisorID);

                            nextState = {
                                ...nextState,
                                UserApproveID3: {
                                    ...nextState.UserApproveID3,
                                    refresh: !UserApproveID3.refresh,
                                    value: { UserInfoName: data.NextMidSupervisorName, ID: data.NextMidSupervisorID }
                                },
                                UserApproveID4: {
                                    ...nextState.UserApproveID4,
                                    refresh: !UserApproveID4.refresh,
                                    value: { UserInfoName: data.NextMidSupervisorName, ID: data.NextMidSupervisorID }
                                }
                            };
                        }
                    } else if (data.LevelApprove == '4') {
                        //$("#div_NguoiDuyetKeTiepStop").show();
                        //$("#div_NguoiDuyetTiepTheoStop").show();

                        // isShowEle('#div_NguoiDuyetKeTiepStop', true);
                        // isShowEle('#div_NguoiDuyetTiepTheoStop', true);

                        nextState = {
                            ...nextState,
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                visible: true,
                                refresh: !UserApproveID2.refresh
                            },
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                visible: true,
                                refresh: !UserApproveID3.refresh
                            }
                        };

                        if (data.SupervisorID != null) {
                            // _UserApproveID.dataSource.add({ UserInfoName: data.SupervisorName, ID: data.SupervisorID });
                            // _UserApproveID.refresh();
                            // _UserApproveID.value([data.SupervisorID]);

                            nextState = {
                                ...nextState,
                                UserApproveID: {
                                    ...nextState.UserApproveID,
                                    refresh: !UserApproveID.refresh,
                                    value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID }
                                }
                            };
                        }
                        if (data.MidSupervisorID != null) {
                            // _UserApproveID2.dataSource.add({ UserInfoName: data.SupervisorNextName, ID: data.MidSupervisorID });
                            // _UserApproveID2.refresh();
                            // _UserApproveID2.value([data.MidSupervisorID]);
                            nextState = {
                                ...nextState,
                                UserApproveID2: {
                                    ...nextState.UserApproveID2,
                                    refresh: !UserApproveID2.refresh,
                                    value: { UserInfoName: data.SupervisorNextName, ID: data.MidSupervisorID }
                                }
                            };
                        }
                        if (data.NextMidSupervisorID != null) {
                            // _UserApproveID3.dataSource.add({ UserInfoName: data.NextMidSupervisorName, ID: data.NextMidSupervisorID });
                            // _UserApproveID3.refresh();
                            // _UserApproveID3.value([data.NextMidSupervisorID]);
                            nextState = {
                                ...nextState,
                                UserApproveID3: {
                                    ...nextState.UserApproveID3,
                                    refresh: !UserApproveID3.refresh,
                                    value: { UserInfoName: data.NextMidSupervisorName, ID: data.NextMidSupervisorID }
                                }
                            };
                        }
                        if (data.HighSupervisorID != null) {
                            // _UserApproveID4.dataSource.add({ UserInfoName: data.HighSupervisorName, ID: data.HighSupervisorID });
                            // _UserApproveID4.refresh();
                            // _UserApproveID4.value([data.HighSupervisorID]);
                            nextState = {
                                ...nextState,
                                UserApproveID4: {
                                    ...nextState.UserApproveID4,
                                    refresh: !UserApproveID4.refresh,
                                    value: { UserInfoName: data.HighSupervisorName, ID: data.HighSupervisorID }
                                }
                            };
                        }
                    } else {
                        //$("#div_NguoiDuyetKeTiepStop").hide();
                        //$("#div_NguoiDuyetTiepTheoStop").hide();
                        // isShowEle('#div_NguoiDuyetKeTiepStop');
                        // isShowEle('#div_NguoiDuyetTiepTheoStop');
                        nextState = {
                            ...nextState,
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                visible: false,
                                refresh: !UserApproveID2.refresh
                            },
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                visible: false,
                                refresh: !UserApproveID3.refresh
                            }
                        };
                    }

                    this.setState(nextState);
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    initData = () => {
        const { E_ProfileID, E_FullName } = enumName,
            _profile = { ID: profileInfo[E_ProfileID], ProfileName: profileInfo[E_FullName] },
            { ProfileID } = this.state;
        let nextState = {};

        HttpService.Get(
            '[URI_HR]/Att_GetData/GetSettingByKey?Key=HRM_HRE_CONFIG_ISALLOWREGISTDEPARTMENTTRANSFERINPORTAL'
        ).then((data) => {
            //cho phép đăng ký hộ
            if (
                PermissionForAppMobile.value &&
                PermissionForAppMobile.value['New_Hre_DepartmentTransfer_Register_Help'] &&
                PermissionForAppMobile.value['New_Hre_DepartmentTransfer_Register_Help']['View'] &&
                data &&
                data.Value1 &&
                (data.Value1 == 'True' || data.Value1 == true)
            ) {
                nextState = {
                    ProfileID: {
                        ...ProfileID,
                        value: null,
                        disable: false,
                        refresh: !ProfileID.refresh
                    }
                };
            } else {
                nextState = {
                    ProfileID: {
                        ...ProfileID,
                        value: _profile,
                        disable: true
                    }
                };
            }

            this.setState(nextState, () => {
                this.initUser();
            });
        });
    };

    // on change
    onChangeTypeOfTransferID = (value) => {
        const { TypeOfTransferID } = this.state;

        this.setState(
            {
                TypeOfTransferID: {
                    ...TypeOfTransferID,
                    value: value,
                    refresh: !TypeOfTransferID.refresh
                }
            },
            this.getUserApprove()
        );
    };

    onChangeJobTitleID = (value) => {
        const { JobTitleID } = this.state;

        this.setState(
            {
                JobTitleID: {
                    ...JobTitleID,
                    value: value,
                    refresh: !JobTitleID.refresh
                }
            },
            () => {
                this.getUserApprove();
            }
        );
    };

    OnchangeAllowanceGroupSalary = () => {
        const { UsualAllowanceGroupID, AllowanceType } = this.state;

        if (UsualAllowanceGroupID.value) {
            HttpService.Post('[URI_HR]/Hre_GetData/GetUsualAllowanceGroupID', {
                AllowanceGroupID: UsualAllowanceGroupID.value ? UsualAllowanceGroupID.value.ID : null
            }).then((data) => {
                let nextState = {};
                let nextAllowanceType = {
                    ...AllowanceType
                };
                for (let index = 1; index <= Object.keys(AllowanceType).length; index++) {
                    let keyField = `AllowanceType${index}ID`,
                        keyType = `AllowanceType${index}IDSalary`,
                        keyAmount = `AllowanceAmount${index}Salary`,
                        keyCurency = `CurrencyID${index}Salary`,
                        _AllowanceTypeID = AllowanceType[keyField];

                    let keyAmountAPI = `AllowanceAmount${index}`,
                        keyTypeID = `AllowanceTypeID${index}`,
                        keyTypeName = `UsualAllowanceName${index}`,
                        keyCurencyID = `CurrencyID${index}`,
                        keyCurencyName = `CurrencyName${index}`;

                    nextAllowanceType = {
                        ...nextAllowanceType,
                        //---------------//
                        [keyField]: {
                            ..._AllowanceTypeID,
                            [keyType]: {
                                ..._AllowanceTypeID[keyType],
                                value:
                                    data[keyTypeID] && data[keyTypeName]
                                        ? { ID: data[keyTypeID], UsualAllowanceName: data[keyTypeName] }
                                        : null,
                                refresh: _AllowanceTypeID[keyType].refresh
                            },
                            [keyAmount]: {
                                ..._AllowanceTypeID[keyAmount],
                                value: data[keyAmountAPI] ? `${Vnr_Function.formatNumber(data[keyAmountAPI])}` : '',
                                refresh: _AllowanceTypeID[keyAmount].refresh
                            },
                            [keyCurency]: {
                                ..._AllowanceTypeID[keyCurency],
                                value:
                                    data[keyCurencyID] && data[keyCurencyName]
                                        ? { ID: data[keyCurencyID], CurrencyName: data[keyCurencyName] }
                                        : null,
                                refresh: _AllowanceTypeID[keyCurency].refresh
                            }
                            //---------------//
                        }
                    };
                }

                nextState = {
                    ...nextState,
                    AllowanceType: nextAllowanceType
                };

                this.setState(nextState);
            });
        }
    };

    onchangePosition = () => {
        const { PositionID, AbilityTileID, PayrollGroupID, WorkPlaceID, UsualAllowanceGroupID } = this.state;

        HttpService.Post('[URI_HR]/Hre_GetData/LoadDataPosition', {
            positionID: PositionID.value ? PositionID.value.ID : null
        }).then((data) => {
            let nextState = {};
            if (data) {
                // WorkPlaceID
                if (data.WorkPlaceID && data.WorkPlaceName) {
                    nextState = {
                        ...nextState,
                        WorkPlaceID: {
                            ...WorkPlaceID,
                            value: { WorkPlaceName: data.WorkPlaceName, ID: data.WorkPlaceID },
                            refresh: !WorkPlaceID.refresh
                        }
                    };
                }

                // PayrollGroupID
                if (data.PayrollGroupID && data.PayrollGroupName) {
                    nextState = {
                        ...nextState,
                        PayrollGroupID: {
                            ...PayrollGroupID,
                            value: { PayrollGroupName: data.PayrollGroupID, ID: data.PayrollGroupID },
                            refresh: !PayrollGroupID.refresh
                        }
                    };
                }

                // AbilityTileID
                if (data.AbilityTileID && data.AbilityTileName) {
                    nextState = {
                        ...nextState,
                        AbilityTileID: {
                            ...AbilityTileID,
                            value: { AbilityTileName: data.AbilityTileName, ID: data.AbilityTileID },
                            refresh: !AbilityTileID.refresh
                        }
                    };
                }

                if (data.UsualAllowanceGroupID && data.UsualAllowanceGroupName) {
                    nextState = {
                        ...nextState,
                        UsualAllowanceGroupID: {
                            ...UsualAllowanceGroupID,
                            value: {
                                UsualAllowanceGroupName: data.UsualAllowanceGroupName,
                                ID: data.UsualAllowanceGroupID
                            },
                            refresh: !UsualAllowanceGroupID.refresh
                        }
                    };
                } else {
                    nextState = {
                        ...nextState,
                        UsualAllowanceGroupID: {
                            ...UsualAllowanceGroupID,
                            value: null,
                            refresh: !UsualAllowanceGroupID.refresh
                        }
                    };
                }

                this.setState(nextState, () => {
                    this.getUserApprove();
                    this.SetDataSupervisorByConfig();
                    this.OnchangeAllowanceGroupSalary();
                });
                //Son.Vo - 20180825 - 0097374
                //   if (data.JobtitleID && data.JobTitleName) {
                //     _JobTitleID.dataSource.add({ JobTitleName: data.JobTitleName, ID: data.JobtitleID });
                //     _JobTitleID.value([data.JobtitleID]);
                // }
            } // -- ernd IF--//
        });
    };

    onChangePositionID = (value) => {
        const { PositionID } = this.state;

        this.setState(
            {
                PositionID: {
                    ...PositionID,
                    value: value,
                    refresh: !PositionID.refresh
                }
            },
            () => {
                this.onchangePosition();
            }
        );
    };

    onChangeAbilityTileID = (value) => {
        const { AbilityTileID } = this.state;

        this.setState(
            {
                AbilityTileID: {
                    ...AbilityTileID,
                    value: value,
                    refresh: !AbilityTileID.refresh
                }
            },
            this.getUserApprove
        );
    };

    onChangePayrollGroupID = (value) => {
        const { PayrollGroupID } = this.state;

        this.setState({
            PayrollGroupID: {
                ...PayrollGroupID,
                value: value,
                refresh: !PayrollGroupID.refresh
            }
        });
    };

    onChangeWorkPlaceID = (value) => {
        const { WorkPlaceID } = this.state;

        this.setState({
            WorkPlaceID: {
                ...WorkPlaceID,
                value: value,
                refresh: !WorkPlaceID.refresh
            }
        });
    };

    onChangeRegionID = (value) => {
        const { RegionID } = this.state;

        this.setState({
            RegionID: {
                ...RegionID,
                value: value,
                refresh: !RegionID.refresh
            }
        });
    };

    onChangeOrganizationStructureID = (value) => {
        const { OrganizationStructureID } = this.state;

        this.setState({
            OrganizationStructureID: {
                ...OrganizationStructureID,
                value: value,
                refresh: !OrganizationStructureID.refresh
            }
        });
    };

    onChangeCompanyID = (value) => {
        const { CompanyID } = this.state;

        this.setState({
            CompanyID: {
                ...CompanyID,
                value: value,
                refresh: !CompanyID.refresh
            }
        });
    };

    treeViewResult = (items) => {
        const { OrganizationStructureID } = this.state;
        this.setState(
            {
                OrganizationStructureID: {
                    ...OrganizationStructureID,
                    value: items
                }
            },
            () => {
                this.onChangeTreeView();
            }
        );
    };

    onChangeTreeView = () => {
        const { OrganizationStructureID, JobTitleID, CompanyID, PositionID, WorkPlaceID } = this.state;

        if (OrganizationStructureID.value) {
            let _OrgStructureID = OrganizationStructureID.value ? OrganizationStructureID.value.id : null,
                _JobTitleValueID = JobTitleID.value ? JobTitleID.value.ID : null;

            HttpService.MultiRequest([
                HttpService.Post('[URI_HR]/Cat_GetData/GetOrgStructureDataByID', { orgstructureID: _OrgStructureID }),
                HttpService.Post('[URI_HR]/Cat_GetData/GetlstJobtitleByOrgStructureID', {
                    orgstructureID: _OrgStructureID
                }),
                HttpService.Post('[URI_HR]/Cat_GetData/GetlstPositionByOrgAndJobtitle', {
                    orgstructureID: _OrgStructureID,
                    jobtitleID: _JobTitleValueID
                }),
                HttpService.Post('[URI_HR]/Cat_GetData/GetlstWorkPlaceOrgStructureID', {
                    orgstructureID: _OrgStructureID
                })
            ]).then((resAll) => {
                let nextState = {};

                if (resAll[0] != null) {
                    let data = resAll[0];
                    nextState = {
                        ...nextState,
                        CompanyID: {
                            ...CompanyID,
                            value: { CompanyName: data.CompanyName, ID: data.CompanyID },
                            refresh: !CompanyID.refresh
                        }
                    };
                }

                if (resAll[1] && Array.isArray(resAll[1]) && resAll[1].length > 0) {
                    let data = resAll[1];

                    if (data.length == 1) {
                        nextState = {
                            ...nextState,
                            JobTitleID: {
                                ...JobTitleID,
                                data: data,
                                value: data[0],
                                refresh: !JobTitleID.refresh
                            }
                        };
                    } else {
                        let lstJobTitleID = data.map(function (x) {
                            return x.ID;
                        });
                        let value = null;

                        if (JobTitleID.value && lstJobTitleID.indexOf(JobTitleID.value.ID.toString()) > -1) {
                            value = JobTitleID.value;
                        }
                        nextState = {
                            ...nextState,
                            JobTitleID: {
                                ...JobTitleID,
                                data: data,
                                value: value,
                                refresh: !JobTitleID.refresh
                            }
                        };
                    }
                }

                if (resAll[2] && Array.isArray(resAll[2]) && resAll[2].length > 0) {
                    let data = resAll[2];

                    if (data.length == 1) {
                        nextState = {
                            ...nextState,
                            PositionID: {
                                ...PositionID,
                                data: data,
                                value: data[0],
                                refresh: !PositionID.refresh
                            }
                        };
                    } else {
                        let lstPositionID = data.map(function (x) {
                            return x.ID;
                        });
                        let value = null;

                        if (PositionID.value && lstPositionID.indexOf(PositionID.value.ID.toString()) > -1) {
                            value = PositionID.value;
                        }

                        nextState = {
                            ...nextState,
                            PositionID: {
                                ...PositionID,
                                data: data,
                                value: value,
                                refresh: !PositionID.refresh
                            }
                        };
                    }
                }

                if (resAll[3] && Array.isArray(resAll[3]) && resAll[3].length > 0) {
                    let data = resAll[3];

                    if (data.length == 1) {
                        nextState = {
                            ...nextState,
                            WorkPlaceID: {
                                ...WorkPlaceID,
                                data: data,
                                value: data[0],
                                refresh: !WorkPlaceID.refresh
                            }
                        };
                    } else {
                        let lstWorkPlaceID = data.map(function (x) {
                            return x.ID;
                        });
                        let value = null;

                        if (WorkPlaceID.value && lstWorkPlaceID.indexOf(WorkPlaceID.value.ID.toString()) > -1) {
                            value = WorkPlaceID.value;
                        }

                        nextState = {
                            ...nextState,
                            WorkPlaceID: {
                                ...WorkPlaceID,
                                data: data,
                                value: value,
                                refresh: !WorkPlaceID.refresh
                            }
                        };
                    }
                }

                this.setState(nextState, () => this.getUserApprove());
            });
        }
    };

    strMoneyToNumber = (text) => {
        if (text) return parseFloat(text.split(',').join(''));
        else return 0;
    };

    getDataForm = () => {
        const {
            ProfileID,
            JobTitleID,
            PositionID,
            UsualAllowanceGroupID,
            DateOfEffect,
            GrossAmountMoneySalary,

            InsuranceAmountSalary,
            AmountTotalSalary,
            AllowanceType
            //DateEffective,
        } = this.state;

        let nextParams = {};

        for (let index = 1; index <= Object.keys(AllowanceType).length; index++) {
            let keyField = `AllowanceType${index}ID`,
                keyFieldType = `AllowanceTypeID${index}`,
                keyType = `AllowanceType${index}IDSalary`,
                keyAmount = `AllowanceAmount${index}`,
                keyAmountSalary = `AllowanceAmount${index}Salary`,
                _AllowanceTypeID = AllowanceType[keyField];

            nextParams = {
                ...nextParams,
                [keyAmount]: _AllowanceTypeID[keyAmountSalary]
                    ? this.strMoneyToNumber(_AllowanceTypeID[keyAmountSalary].value)
                    : 0,
                [keyFieldType]:
                    _AllowanceTypeID[keyType] && _AllowanceTypeID[keyType].value
                        ? _AllowanceTypeID[keyType].value.ID
                        : null
            };
        }

        return {
            ...nextParams,
            JobtitleID: JobTitleID.value ? JobTitleID.value.ID : null,
            PositionID: PositionID.value ? PositionID.value.ID : null,
            BasicSalary: GrossAmountMoneySalary.value ? this.strMoneyToNumber(GrossAmountMoneySalary.value) : 0,
            InsuranceAmount: InsuranceAmountSalary.value ? this.strMoneyToNumber(InsuranceAmountSalary.value) : 0,
            ProfileID: ProfileID.value ? ProfileID.value.ID : null,
            DateOfEffect: DateOfEffect.value ? Vnr_Function.formatDateAPI(DateOfEffect.value) : null,
            AmountTotal: AmountTotalSalary.value ? this.strMoneyToNumber(AmountTotalSalary.value) : 0,
            RankRateID: null,
            EmployeeTypeID: null,
            EmployeeGroupID: null,
            UsualAllowanceGroupID: UsualAllowanceGroupID.value ? UsualAllowanceGroupID.value.ID : null,
            ConfigScreen: 'Salary'
        };
    };

    getReloadbyConfigFormula = (keyChange) => {
        const {
            ProfileID,
            IsCreateBasicSalary,
            GrossAmountMoneySalary,

            InsuranceAmountSalary,
            AmountTotalSalary,
            AllowanceType
        } = this.state;

        if (ProfileID.value == null) {
            return;
        }

        if (IsCreateBasicSalary.value) {
            const dataReturn = this.getDataForm();
            HttpService.Post('[URI_HR]/Hre_GetData/GetConfigSalaryBasic', {
                modelAllowanceAmount: dataReturn
            }).then((data) => {
                let nextState = {};

                if (keyChange != 'GrossAmountMoneySalary') {
                    nextState = {
                        ...nextState,
                        GrossAmountMoneySalary: {
                            ...GrossAmountMoneySalary,
                            value: data.BasicSalary ? `${Vnr_Function.formatNumber(data.BasicSalary)}` : '',
                            refresh: !GrossAmountMoneySalary.refresh
                        }
                    };
                }

                if (keyChange != 'InsuranceAmountSalary') {
                    nextState = {
                        ...nextState,
                        InsuranceAmountSalary: {
                            ...InsuranceAmountSalary,
                            value: data.InsuranceAmount ? `${Vnr_Function.formatNumber(data.InsuranceAmount)}` : '',
                            refresh: !InsuranceAmountSalary.refresh
                        }
                    };
                }

                if (keyChange != 'InsuranceAmountSalary') {
                    nextState = {
                        ...nextState,
                        AmountTotalSalary: {
                            ...AmountTotalSalary,
                            value: data.AmountTotal ? `${Vnr_Function.formatNumber(data.AmountTotal)}` : '',
                            refresh: !AmountTotalSalary.refresh
                        }
                    };
                }

                let nextAllowanceType = AllowanceType;

                for (let index = 1; index <= Object.keys(AllowanceType).length; index++) {
                    let keyField = `AllowanceType${index}ID`,
                        keyAmount = `AllowanceAmount${index}Salary`,
                        keyAmountValue = `AllowanceAmount${index}`,
                        _AllowanceTypeID = AllowanceType[keyField];

                    if (keyChange != keyAmount) {
                        nextAllowanceType = {
                            ...nextAllowanceType,
                            [keyField]: {
                                ..._AllowanceTypeID,
                                [keyAmount]: {
                                    ..._AllowanceTypeID[keyAmount],
                                    value: data[keyAmountValue]
                                        ? `${Vnr_Function.formatNumber(data[keyAmountValue])}`
                                        : '',
                                    refresh: _AllowanceTypeID[keyAmount].refresh
                                }
                            }
                        };
                    }
                }

                nextState = {
                    ...nextState,
                    AllowanceType: nextAllowanceType
                };

                this.setState(nextState);
            });
        }
    };
    getUserApproveByEdit = (nextState) => {
        const _UserSubmit = dataVnrStorage.currentUser.info.userid,
            {
                ProfileID,
                OrganizationStructureID,
                AbilityTileID,
                PositionID,
                JobTitleID,
                TypeOfTransferID,
                CompanyID,
                DateEffective
            } = this.state;

        if (ProfileID.value == null) {
            return;
        }
        const profileID = ProfileID.value?.ID;

        HttpService.Post('[URI_HR]/Hre_GetData/GetUserApproveWithType', {
            userSubmit: _UserSubmit,
            profileID: profileID,
            Type: 'E_WORKHISTORYSALARY',
            organizationStructureID: OrganizationStructureID.value ? OrganizationStructureID.value.id : null,
            AbtilityID: AbilityTileID.value ? AbilityTileID.value.ID : null,
            DateStart: DateEffective.value ? Vnr_Function.formatDateAPI(DateEffective.value) : null,
            PosID: PositionID.value ? PositionID.value.ID : null,
            '_dic[0].Key': 'TypeOfTransferID',
            '_dic[0].Value': TypeOfTransferID.value ? TypeOfTransferID.value.ID : null,
            employeeTypeID: null,
            jobTitleID: JobTitleID.value ? JobTitleID.value.ID : null,
            salaryClassID: null,
            companyID: CompanyID.value ? CompanyID.value.ID : null
        }).then((UserApproveWithType) => {
            //config user approve
            if (UserApproveWithType != null) {
                this.levelApproved = UserApproveWithType.LevelApprove;

                if (UserApproveWithType.IsOnlyOneLevelApprove == true) {
                    this.isOnlyOneLevelApprove = true;
                }
                if (UserApproveWithType.LevelApprove == '1' || UserApproveWithType.LevelApprove == '2') {
                    if (UserApproveWithType.LevelApprove == '1') {
                        // isShowEle('#div_NguoiDuyetKeTiepStop');
                        // isShowEle('#div_NguoiDuyetTiepTheoStop');

                        nextState = {
                            ...nextState,
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                visible: false
                            },
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                visible: false
                            }
                        };
                    }
                } else if (UserApproveWithType.LevelApprove == '3') {
                    // isShowEle('#div_NguoiDuyetKeTiepStop', true);
                    // isShowEle('#div_NguoiDuyetTiepTheoStop');
                    nextState = {
                        ...nextState,
                        UserApproveID2: {
                            ...nextState.UserApproveID2,
                            visible: true
                        },
                        UserApproveID3: {
                            ...nextState.UserApproveID3,
                            visible: false
                        }
                    };
                } else if (UserApproveWithType.LevelApprove == '4') {
                    // isShowEle('#div_NguoiDuyetKeTiepStop', true);
                    // isShowEle('#div_NguoiDuyetTiepTheoStop', true);
                    nextState = {
                        ...nextState,
                        UserApproveID2: {
                            ...nextState.UserApproveID2,
                            visible: true
                        },
                        UserApproveID3: {
                            ...nextState.UserApproveID3,
                            visible: true
                        }
                    };
                } else {
                    // isShowEle('#div_NguoiDuyetKeTiepStop', true);
                    // isShowEle('#div_NguoiDuyetTiepTheoStop');
                    nextState = {
                        ...nextState,
                        UserApproveID2: {
                            ...nextState.UserApproveID2,
                            visible: true
                        },
                        UserApproveID3: {
                            ...nextState.UserApproveID3,
                            visible: false
                        }
                    };
                }

                this.setState(nextState);
            }
        });
    };
    getRecordAndConfigByID = (record, _handleSetState) => {
        let arrRequest = [
            //HttpService.Get('[URI_POR]/New_Hre_WorkHistorySalary/GetDefaultValue'),
            // HttpService.Get('[URI_HR]/Cat_GetData/GetUsualAllowanceForPriotity'),
            HttpService.Get('[URI_HR]/Cat_GetData/GetMultiUsualAllowance'),
            HttpService.Get('[URI_HR]/Cat_GetData/GetMultiCurrency'),

            HttpService.Get('[URI_HR]/Cat_GetData/GetMultiJobTitle'),
            HttpService.Get('[URI_HR]/Cat_GetData/GetMultiPosition'),
            HttpService.Get('[URI_HR]/Cat_GetData/GetMultiCompany'),
            HttpService.Get('[URI_HR]/Cat_GetData/GetMultiWorkPlace')
        ];

        VnrLoadingSevices.show();
        HttpService.MultiRequest(arrRequest).then((resAll) => {
            VnrLoadingSevices.hide();
            try {
                _handleSetState(record, resAll);
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    handleSetState = (record, resAll) => {
        let nextState = {};

        const {
                ProfileID,
                TypeOfTransferID,
                JobTitleID,
                PositionID,
                CompanyID,
                AbilityTileID,
                PayrollGroupID,
                WorkPlaceID,
                RegionID,
                OrganizationStructureID,
                DateEffective,
                DecisionNo,
                DecisionDate,
                UsualAllowanceGroupID,
                // Quản lý trực tiếp
                Supervisor,
                MidSupervisor,
                NextSupervisor,
                HighSupervisor,

                // cập duyệt
                //InfoApprove,
                SuggetedUserID,
                DateSugget,
                UserApproveID,
                UserApproveID2,
                UserApproveID3,
                UserApproveID4,

                // Thông tin lương cơ bản
                DateOfEffect,
                IsCreateBasicSalary,
                GrossAmountMoneySalary,
                CurrencyIDSalary,

                InsuranceAmountSalary,
                CurrencyInsID,
                AmountTotalSalary,
                NoteSalary,
                AllowanceType
            } = this.state,
            item = record,
            dataUsual = resAll[0],
            dataCurrency = resAll[1],
            dataJobTitle = resAll[2],
            dataPosition = resAll[3],
            dataCompany = resAll[4],
            dataWorkPlace = resAll[5];

        nextState = {
            ...this.state,
            ID: record.ID,
            ProfileID: {
                ...ProfileID,
                value:
                    item.ProfileID && item.ProfileName
                        ? {
                            ProfileName: item.ProfileName,
                            ID: item.ProfileID
                        }
                        : null,
                disable: false,
                refresh: !ProfileID.refresh
            },
            OrganizationStructureID: {
                ...OrganizationStructureID,
                value: item.OrganizationStructureID
                    ? [{ Name: item.OrgStructureName, id: item.OrganizationStructureID }]
                    : null,
                refresh: !OrganizationStructureID.refresh
            },
            TypeOfTransferID: {
                ...TypeOfTransferID,
                value:
                    item.TypeOfTransferID && item.TypeOfTransferName
                        ? {
                            NameEntityName: item.TypeOfTransferName,
                            ID: item.TypeOfTransferID
                        }
                        : null,
                disable: false,
                refresh: !TypeOfTransferID.refresh
            },
            JobTitleID: {
                ...JobTitleID,
                disable: false,
                data: dataJobTitle[4],
                value: item.JobTitleID ? { ID: item.JobTitleID, JobTitleName: item.JobTitleName } : null,
                refresh: !JobTitleID.refresh
            },
            PositionID: {
                ...PositionID,
                disable: false,
                data: dataPosition[5],
                value: item.PositionID ? { ID: item.PositionID, PositionName: item.PositionName } : null,
                refresh: !PositionID.refresh
            },
            CompanyID: {
                ...CompanyID,
                disable: false,
                data: dataCompany,
                value: item.CompanyID ? { ID: item.CompanyID, CompanyName: item.CompanyName } : null,
                refresh: !CompanyID.refresh
            },
            AbilityTileID: {
                ...AbilityTileID,
                disable: false,
                value: item.AbilityTileID ? { ID: item.AbilityTileID, AbilityTitleVNI: item.AbilityTitleVNI } : null,
                refresh: !AbilityTileID.refresh
            },
            PayrollGroupID: {
                ...PayrollGroupID,
                disable: false,
                value: item.PayrollGroupID
                    ? { ID: item.PayrollGroupID, PayrollGroupName: item.PayrollGroupName }
                    : null,
                refresh: !PayrollGroupID.refresh
            },
            WorkPlaceID: {
                ...WorkPlaceID,
                disable: false,
                data: dataWorkPlace,
                value: item.WorkPlaceID ? { ID: item.WorkPlaceID, WorkPlaceName: item.WorkPlaceName } : null,
                refresh: !WorkPlaceID.refresh
            },
            RegionID: {
                ...RegionID,
                disable: false,
                value: item.RegionID ? { ID: item.RegionID, ManageRegionName: item.RegionName } : null,
                refresh: !RegionID.refresh
            },
            UsualAllowanceGroupID: {
                ...UsualAllowanceGroupID,
                disable: false,
                value: item.UsualAllowanceGroupID
                    ? { ID: item.UsualAllowanceGroupID, UsualAllowanceGroupName: item.UsualAllowanceGroupName }
                    : null,
                refresh: !UsualAllowanceGroupID.refresh
            },
            SuggetedUserID: {
                ...SuggetedUserID,
                disable: false,
                value: item.SuggetedUserID ? { ID: item.SuggetedUserID, ProfileName: item.SuggetedUserName } : null,
                refresh: !SuggetedUserID.refresh
            },
            DateSugget: {
                ...DateSugget,
                disable: false,
                value: item.DateSugget ? Vnr_Function.formatDateAPI(item.DateSugget) : null,
                refresh: !DateSugget.refresh
            },
            DateEffective: {
                ...DateEffective,
                disable: false,
                value: item.DateEffective ? Vnr_Function.formatDateAPI(item.DateEffective) : null,
                refresh: !DateEffective.refresh
            },

            DecisionDate: {
                ...DecisionDate,
                disable: false,
                value: item.DecisionDate ? Vnr_Function.formatDateAPI(item.DecisionDate) : null,
                refresh: !DecisionDate.refresh
            },
            DecisionNo: {
                ...DecisionNo,
                disable: false,
                value: item.DecisionNo ? `${item.DecisionNo}` : null,
                refresh: !DecisionNo.refresh
            },
            GrossAmountMoneySalary: {
                ...GrossAmountMoneySalary,
                disable: false,
                value: item.GrossAmountSalary ? `${Vnr_Function.formatNumber(item.GrossAmountSalary)}` : '',
                refresh: !GrossAmountMoneySalary.refresh
            },
            CurrencyIDSalary: {
                ...CurrencyIDSalary,
                disable: false,
                data: dataCurrency,
                value: item.CurrencyIDSalary
                    ? { ID: item.CurrencyIDSalary, CurrencyName: item.CurrencyNameSalary }
                    : null,
                refresh: !CurrencyIDSalary.refresh
            },

            DateOfEffect: {
                ...DateOfEffect,
                disable: false,
                value: item.DateOfEffectSalary ? Vnr_Function.formatDateAPI(item.DateOfEffectSalary) : null,
                refresh: !DateOfEffect.refresh
            },
            InsuranceAmountSalary: {
                ...InsuranceAmountSalary,
                disable: false,
                value: item.InsuranceAmountSalary ? `${Vnr_Function.formatNumber(item.InsuranceAmountSalary)}` : ''
            },
            CurrencyInsID: {
                ...CurrencyInsID,
                disable: false,
                data: dataCurrency,
                value: item.CurrencyInsID ? { ID: item.CurrencyInsIDm, CurrencyName: item.CurrencyNameIns } : null,
                refresh: !CurrencyInsID.refresh
            },
            AmountTotalSalary: {
                ...AmountTotalSalary,
                disable: false,
                value: item.AmountTotalSalary ? `${Vnr_Function.formatNumber(item.AmountTotalSalary)}` : ''
            },
            NoteSalary: {
                ...NoteSalary,
                disable: false,
                value: item.NoteSalary ? `${item.NoteSalary}` : ''
            },

            IsCreateBasicSalary: {
                ...IsCreateBasicSalary,
                value: item.IsCreateBasicSalary
            },

            Supervisor: {
                ...Supervisor,
                value: item.Supervisor ? { ProfileName: item.SupervisorName, CodeEmp: item.Supervisor } : null,
                refresh: !Supervisor.refresh
            },
            MidSupervisor: {
                ...MidSupervisor,
                value: item.MidSupervisor ? { ProfileName: item.MidSupervisorName, CodeEmp: item.MidSupervisor } : null,
                refresh: !MidSupervisor.refresh
            },
            NextSupervisor: {
                ...NextSupervisor,
                value: item.NextSupervisor
                    ? { ProfileName: item.NextSupervisorName, CodeEmp: item.NextSupervisor }
                    : null,
                refresh: !NextSupervisor.refresh
            },
            HighSupervisor: {
                ...HighSupervisor,
                value: item.HighSupervisor
                    ? { ProfileName: item.HighSupervisorName, CodeEmp: item.HighSupervisor }
                    : null,
                refresh: !HighSupervisor.refresh
            },

            UserApproveID: {
                ...UserApproveID,
                value: item.UserApproveID ? { ID: item.UserApproveID, UserInfoName: item.UserApproveName } : null,
                refresh: !UserApproveID.refresh
            },
            UserApproveID2: {
                ...UserApproveID2,
                value: item.UserApproveID2 ? { ID: item.UserApproveID2, UserInfoName: item.UserApproveID2Name } : null,
                refresh: !UserApproveID2.refresh
            },
            UserApproveID3: {
                ...UserApproveID3,
                value: item.UserApproveID3 ? { ID: item.UserApproveID3, UserInfoName: item.UserApproveID3Name } : null,
                refresh: !UserApproveID3.refresh
            },
            UserApproveID4: {
                ...UserApproveID4,
                value: item.UserApproveID4 ? { ID: item.UserApproveID4, UserInfoName: item.UserApproveID4Name } : null,
                refresh: !UserApproveID4.refresh
            }
        };

        let nextAllowanceType = {
            ...AllowanceType
        };

        for (let index = 1; index <= Object.keys(AllowanceType).length; index++) {
            let keyField = `AllowanceType${index}ID`,
                keyType = `AllowanceType${index}IDSalary`,
                keyTypeID = index > 4 ? `AllowanceTypeID${index}Salary` : `AllowanceType${index}IDSalary`,
                keyTypeName = `UsualAllowanceName${index}Salary`,
                keyAmount = `AllowanceAmount${index}Salary`,
                keyCurency = `CurrencyID${index}Salary`,
                keyCurencyName = `CurrencyName${index}Salary`,
                _AllowanceTypeID = AllowanceType[keyField];
            nextAllowanceType = {
                ...nextAllowanceType,
                //---------------//
                [keyField]: {
                    ..._AllowanceTypeID,
                    [keyType]: {
                        ..._AllowanceTypeID[keyType],
                        data: dataUsual,
                        value: item[keyTypeID] ? { ID: item[keyTypeID], UsualAllowanceName: item[keyTypeName] } : null,
                        refresh: !_AllowanceTypeID[keyType].refresh
                    },
                    [keyAmount]: {
                        ..._AllowanceTypeID[keyAmount],
                        value: item[keyAmount] ? `${Vnr_Function.formatNumber(item[keyAmount])}` : '',
                        refresh: !_AllowanceTypeID[keyAmount].refresh
                    },
                    [keyCurency]: {
                        ..._AllowanceTypeID[keyCurency],
                        data: dataCurrency,
                        value: item[keyCurency] ? { ID: item[keyCurency], CurrencyName: item[keyCurencyName] } : null,
                        refresh: !_AllowanceTypeID[keyCurency].refresh
                    }
                    //---------------//
                }
            };
        }

        nextState = {
            ...nextState,
            AllowanceType: nextAllowanceType
        };

        this.setState(nextState, () => {
            this.getUserApproveByEdit(nextState);
        });
    };
    //#endregion

    GetHighSupervior = () => {
        const {
            Profile,
            UserApproveID,
            UserApproveID2,
            UserApproveID3,
            UserApproveID4
            //PurposeRegisterID
        } = this.state;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/GetHighSupervisor', {
            ProfileID: Profile.ID,
            userSubmit: Profile.ID,
            type: 'E_REGISTERVEHICLEAPPROVE',
            resource: {
                // BusinessTripTypeID : PurposeRegisterID.val
            }
        }).then((result) => {
            VnrLoadingSevices.hide();
            let nextState = {
                UserApproveID: { ...UserApproveID },
                UserApproveID2: { ...UserApproveID2 },
                UserApproveID3: { ...UserApproveID3 },
                UserApproveID4: { ...UserApproveID4 }
            };

            //truong hop chạy theo approve grade
            if (result.LevelApprove > 0) {
                if (result.IsChangeApprove == true) {
                    this.isChangeLevelApprove = true;
                }
                this.levelApproveLateEarlyAllowed = result.LevelApprove;

                if (result.LevelApprove == 2) {
                    if (result.IsOnlyOneLevelApprove) {
                        this.levelApproveLateEarlyAllowed = 1;

                        if (result.SupervisorID != null) {
                            nextState = {
                                UserApproveID: {
                                    ...nextState.UserApproveID,
                                    value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                },
                                UserApproveID2: {
                                    ...nextState.UserApproveID2,
                                    value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                },
                                UserApproveID3: {
                                    ...nextState.UserApproveID3,
                                    value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                },
                                UserApproveID4: {
                                    ...nextState.UserApproveID4,
                                    value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                }
                            };
                        }
                        // checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                        // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                        // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                        // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                    } else {
                        if (result.SupervisorID != null) {
                            //checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                            nextState = {
                                ...nextState,
                                UserApproveID: {
                                    ...nextState.UserApproveID,
                                    value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                }
                            };
                        } else if (!this.isModify) {
                            //multiUserApproveID.value(null);
                            nextState = {
                                ...nextState,
                                UserApproveID: {
                                    ...nextState.UserApproveID,
                                    value: null
                                }
                            };
                        }

                        if (result.MidSupervisorID != null) {
                            // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                            // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                            // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);

                            nextState = {
                                ...nextState,
                                UserApproveID2: {
                                    ...nextState.UserApproveID2,
                                    value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                                },
                                UserApproveID3: {
                                    ...nextState.UserApproveID3,
                                    value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                                },
                                UserApproveID4: {
                                    ...nextState.UserApproveID4,
                                    value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                                }
                            };
                        } else if (!this.isModify) {
                            // multiUserApproveID3.value(null);
                            // multiUserApproveID2.value(null);
                            // multiUserApproveID4.value(null);
                            nextState = {
                                ...nextState,
                                UserApproveID2: {
                                    ...nextState.UserApproveID2,
                                    value: null
                                },
                                UserApproveID3: {
                                    ...nextState.UserApproveID3,
                                    value: null
                                },
                                UserApproveID4: {
                                    ...nextState.UserApproveID4,
                                    value: null
                                }
                            };
                        }
                    }

                    // isShowEle('#' + divControl3);
                    // isShowEle('#' + divControl4);

                    nextState = {
                        ...nextState,
                        UserApproveID2: {
                            ...nextState.UserApproveID2,
                            visible: false
                        },
                        UserApproveID3: {
                            ...nextState.UserApproveID3,
                            visible: false
                        }
                    };
                } else if (result.LevelApprove == 3) {
                    if (result.SupervisorID != null) {
                        //checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                        nextState = {
                            ...nextState,
                            UserApproveID: {
                                ...nextState.UserApproveID,
                                value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                            }
                        };
                    } else if (!this.isModify) {
                        // multiUserApproveID.value(null);
                        nextState = {
                            ...nextState,
                            UserApproveID: {
                                ...nextState.UserApproveID,
                                value: null
                            }
                        };
                    }

                    if (result.MidSupervisorID != null) {
                        //checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                        nextState = {
                            ...nextState,
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                value: {
                                    UserInfoName: result.SupervisorNextName,
                                    ID: result.MidSupervisorIDa
                                }
                            }
                        };
                    } else if (!this.isModify) {
                        //multiUserApproveID3.value(null);
                        nextState = {
                            ...nextState,
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                value: null
                            }
                        };
                    }

                    if (result.NextMidSupervisorID != null) {
                        //checkAddDatasource(multiUserApproveID2, { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }, "ID", result.NextMidSupervisorID);
                        //checkAddDatasource(multiUserApproveID4, { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }, "ID", result.NextMidSupervisorID);
                        nextState = {
                            ...nextState,
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                value: { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }
                            },
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                value: { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }
                            }
                        };
                    } else if (!this.isModify) {
                        // multiUserApproveID2.value(null);
                        // multiUserApproveID4.value(null);
                        nextState = {
                            ...nextState,
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                value: null
                            },
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                value: null
                            }
                        };
                    }

                    // isShowEle('#' + divControl3, true);
                    // isShowEle('#' + divControl4);
                    nextState = {
                        ...nextState,
                        UserApproveID2: {
                            ...nextState.UserApproveID2,
                            visible: true
                        },
                        UserApproveID3: {
                            ...nextState.UserApproveID3,
                            visible: false
                        }
                    };
                } else if (result.LevelApprove == 4) {
                    if (result.SupervisorID != null) {
                        //checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                        nextState = {
                            ...nextState,
                            UserApproveID: {
                                ...nextState.UserApproveID,
                                value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                            }
                        };
                    } else if (!this.isModify) {
                        // multiUserApproveID.value(null);
                        nextState = {
                            ...nextState,
                            UserApproveID: {
                                ...nextState.UserApproveID,
                                value: null
                            }
                        };
                    }

                    if (result.MidSupervisorID != null) {
                        // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                        nextState = {
                            ...nextState,
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                            }
                        };
                    } else if (!this.isModify) {
                        // multiUserApproveID3.value(null);
                        nextState = {
                            ...nextState,
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                value: null
                            }
                        };
                    }

                    if (result.NextMidSupervisorID != null) {
                        // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }, "ID", result.NextMidSupervisorID);
                        nextState = {
                            ...nextState,
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                value: { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }
                            }
                        };
                    } else if (!this.isModify) {
                        // multiUserApproveID4.value(null);
                        nextState = {
                            ...nextState,
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                value: null
                            }
                        };
                    }

                    if (result.HighSupervisorID) {
                        // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }, "ID", result.HighSupervisorID);
                        nextState = {
                            ...nextState,
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                value: { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }
                            }
                        };
                    } else if (!this.isModify) {
                        // multiUserApproveID2.value(null);
                        nextState = {
                            ...nextState,
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                value: null
                            }
                        };
                    }

                    // isShowEle('#' + divControl3, true);
                    // isShowEle('#' + divControl4, true);
                    nextState = {
                        ...nextState,
                        UserApproveID2: {
                            ...nextState.UserApproveID2,
                            visible: true
                        },
                        UserApproveID3: {
                            ...nextState.UserApproveID3,
                            visible: true
                        }
                    };
                }
            }

            //TH chạy không theo approve grade
            else if (result.LevelApprove == 0) {
                if (result.IsConCurrent) {
                    let dataFirstApprove = [];
                    for (let i = 0; i < result.lstSupervior.length; i++) {
                        dataFirstApprove.push({
                            UserInfoName: result.lstSupervior[i].SupervisorName,
                            ID: result.lstSupervior[i].SupervisorID
                        });
                    }
                    for (let i = 0; i < result.lstHightSupervior.length; i++) {
                        this.dataMidApprove.push({
                            UserInfoName: result.lstHightSupervior[i].HighSupervisorName,
                            ID: result.lstHightSupervior[i].HighSupervisorID
                        });
                        this.dataLastApprove.push({
                            UserInfoName: result.lstHightSupervior[i].HighSupervisorName,
                            ID: result.lstHightSupervior[i].HighSupervisorID
                        });
                    }
                    // multiUserApproveID.setDataSource(dataFirstApprove);
                    // multiUserApproveID.refresh();
                    // multiUserApproveID2.setDataSource(dataLastApprove);
                    // multiUserApproveID2.refresh();
                    // multiUserApproveID3.setDataSource(dataMidApprove);
                    // multiUserApproveID3.refresh();
                    nextState = {
                        ...nextState,
                        UserApproveID: {
                            ...nextState.UserApproveID,
                            data: dataFirstApprove
                        },
                        UserApproveID4: {
                            ...nextState.UserApproveID4,
                            data: this.dataLastApprove
                        },
                        UserApproveID2: {
                            ...nextState.UserApproveID2,
                            data: this.dataMidApprove
                        }
                    };
                } else {
                    if (result.SupervisorID != null) {
                        // checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                        nextState = {
                            ...nextState,
                            UserApproveID: {
                                ...nextState.UserApproveID,
                                value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                            }
                        };
                    } else {
                        // multiUserApproveID.refresh();
                        // multiUserApproveID.value(null);
                        nextState = {
                            ...nextState,
                            UserApproveID: {
                                ...nextState.UserApproveID,
                                value: null
                            }
                        };
                    }
                    if (result.HighSupervisorID != null) {
                        this.dataLastApprove.push({
                            UserInfoName: result.HighSupervisorName,
                            ID: result.HighSupervisorID
                        });
                        nextState = {
                            ...nextState,
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                value: { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }
                            }
                        };
                        // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }, "ID", result.HighSupervisorID);
                    } else {
                        // multiUserApproveID2.refresh();
                        // multiUserApproveID2.value(null);
                        nextState = {
                            ...nextState,
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                value: null
                            }
                        };
                    }
                    if (result.MidSupervisorID != null) {
                        this.dataMidApprove.push({
                            UserInfoName: result.SupervisorNextName,
                            ID: result.MidSupervisorID
                        });
                        // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                        // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                        // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                        nextState = {
                            ...nextState,
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                            },
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                            },
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                            }
                        };
                    } else {
                        // multiUserApproveID2.refresh();
                        // multiUserApproveID2.value(null);
                        // multiUserApproveID3.refresh();
                        // multiUserApproveID3.value(null);
                        // multiUserApproveID4.refresh();
                        // multiUserApproveID4.value(null);
                        nextState = {
                            ...nextState,
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                value: null
                            },
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                value: null
                            },
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                value: null
                            }
                        };
                    }
                    if (result.IsChangeApprove != true) {
                        // isReadOnlyComboBox($("#" + control1), true);
                        // isReadOnlyComboBox($("#" + control2), true);
                        // isReadOnlyComboBox($("#" + control3), true);
                        // isReadOnlyComboBox($("#" + control4), true);
                        nextState = {
                            UserApproveID: {
                                ...nextState.UserApproveID,
                                disable: true
                            },
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                disable: true
                            },
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                disable: true
                            },
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                disable: true
                            }
                        };
                    } else {
                        // isReadOnlyComboBox($("#" + control1), false);
                        // isReadOnlyComboBox($("#" + control2), false);
                        // isReadOnlyComboBox($("#" + control3), false);
                        // isReadOnlyComboBox($("#" + control4), false);
                        nextState = {
                            UserApproveID: {
                                ...nextState.UserApproveID,
                                disable: false
                            },
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                disable: false
                            },
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                disable: false
                            },
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                disable: false
                            }
                        };
                    }
                }
            }

            nextState = {
                UserApproveID: {
                    ...nextState.UserApproveID,
                    refresh: !UserApproveID.refresh
                },
                UserApproveID2: {
                    ...nextState.UserApproveID2,
                    refresh: !UserApproveID2.refresh
                },
                UserApproveID3: {
                    ...nextState.UserApproveID3,
                    refresh: !UserApproveID3.refresh
                },
                UserApproveID4: {
                    ...nextState.UserApproveID4,
                    refresh: !UserApproveID4.refresh
                }
            };

            this.setState(nextState);
        });
    };

    //picked duyệt đầu
    onChangeUserApproveID = (item) => {
        const { UserApproveID, UserApproveID2, UserApproveID3, UserApproveID4 } = this.state;
        let nextState = {
            UserApproveID: {
                ...UserApproveID,
                value: item,
                refresh: !UserApproveID.refresh
            }
        };

        // var user1 = $("#UserApproveID").data("kendoComboBox");
        // var user2 = $("#UserApproveID2").data("kendoComboBox");
        // var user3 = $("#UserApproveID3").data("kendoComboBox");
        // var user4 = $("#UserApproveID4").data("kendoComboBox");
        //nếu 1 cấp duyệt mới chạy
        if (this.levelApproveLateEarlyAllowed == 1) {
            //ẩn 3,4
            // isShowEle('#divMidApprove');
            // isShowEle('#divMidNextApprove');

            nextState = {
                ...nextState,
                UserApproveID2: {
                    ...UserApproveID2,
                    visible: false
                },
                UserApproveID3: {
                    ...UserApproveID3,
                    visible: false
                }
            };

            if (item) {
                nextState = {
                    ...nextState,
                    UserApproveID2: {
                        ...nextState.UserApproveID2,
                        value: item,
                        refresh: !UserApproveID2.refresh
                    },
                    UserApproveID3: {
                        ...nextState.UserApproveID3,
                        value: item,
                        refresh: !UserApproveID3.refresh
                    },
                    UserApproveID4: {
                        ...UserApproveID4,
                        value: item,
                        refresh: !UserApproveID4.refresh
                    }
                };
            }

            //_data1 = user1.dataSource.data();
            // if (false) {
            //     // user2.value([]);
            //     // user3.value([]);
            //     // user4.value([]);
            // }
            // else {
            //     _data1.forEach(function (item) {
            //         if (item.ID == user1.value()) {
            //             checkAddDatasource(user2, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
            //             checkAddDatasource(user3, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
            //             checkAddDatasource(user4, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
            //         }
            //     });

            // }
        }

        this.setState(nextState);
    };

    //picked duyệt cuối
    onChangeUserApproveID4 = (item) => {
        const { UserApproveID, UserApproveID2, UserApproveID3, UserApproveID4 } = this.state;
        let nextState = {
            UserApproveID4: {
                ...UserApproveID4,
                value: item,
                refresh: !UserApproveID4.refresh
            }
        };

        //nếu 1 cấp duyệt mới chạy
        if (this.levelApproveLateEarlyAllowed == 1) {
            //ẩn 3,4
            // isShowEle('#divMidApprove');
            // isShowEle('#divMidNextApprove');
            nextState = {
                ...nextState,
                UserApproveID2: {
                    ...UserApproveID2,
                    visible: false
                },
                UserApproveID3: {
                    ...UserApproveID3,
                    visible: false
                }
            };

            //set duyệt 2,3,4 = 1
            // var user1 = $("#UserApproveID").data("kendoComboBox"),
            //   user2 = $("#UserApproveID4").data("kendoComboBox"),
            //   user3 = $("#UserApproveID2").data("kendoComboBox"),
            //   user4 = $("#UserApproveID3").data("kendoComboBox"),
            //   _data2 = user2.dataSource.data();

            if (!item) {
                // user1.value([]);
                // user3.value([]);
                // user4.value([]);
                nextState = {
                    ...nextState,
                    UserApproveID: {
                        ...UserApproveID,
                        value: null,
                        refresh: !UserApproveID.refresh
                    },
                    UserApproveID2: {
                        ...nextState.UserApproveID2,
                        value: null,
                        refresh: !UserApproveID2.refresh
                    },
                    UserApproveID3: {
                        ...nextState.UserApproveID3,
                        value: null,
                        refresh: !UserApproveID3.refresh
                    }
                };
            } else {
                // _data2.forEach(function (item) {
                //   if (item.ID == user2.value()) {
                //     checkAddDatasource(user1, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
                //     checkAddDatasource(user3, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
                //     checkAddDatasource(user4, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
                //   }
                // });
                nextState = {
                    ...nextState,
                    UserApproveID: {
                        ...UserApproveID,
                        value: { ...item },
                        refresh: !UserApproveID.refresh
                    },
                    UserApproveID2: {
                        ...nextState.UserApproveID2,
                        value: { ...item },
                        refresh: !UserApproveID2.refresh
                    },
                    UserApproveID3: {
                        ...nextState.UserApproveID3,
                        value: { ...item },
                        refresh: !UserApproveID3.refresh
                    }
                };
            }
        } else if (this.levelApproveLateEarlyAllowed == 2) {
            // var user1 = $("#UserApproveID").data("kendoComboBox"),
            //   user2 = $("#UserApproveID4").data("kendoComboBox"),
            //   user3 = $("#UserApproveID2").data("kendoComboBox"),
            //   user4 = $("#UserApproveID3").data("kendoComboBox"),
            //   _data2 = user2.dataSource.data();
            if (!item) {
                // user3.value([]);
                // user4.value([]);
                nextState = {
                    ...nextState,
                    UserApproveID2: {
                        ...UserApproveID2,
                        value: null,
                        refresh: !UserApproveID2.refresh
                    },
                    UserApproveID3: {
                        ...UserApproveID3,
                        value: null,
                        refresh: !UserApproveID3.refresh
                    }
                };
            } else {
                // _data2.forEach(function (item) {
                //   if (item.ID == user2.value()) {
                //     checkAddDatasource(user3, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
                //     checkAddDatasource(user4, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
                //   }
                // });
                nextState = {
                    ...nextState,
                    UserApproveID2: {
                        ...UserApproveID2,
                        value: { ...item },
                        refresh: !UserApproveID2.refresh
                    },
                    UserApproveID3: {
                        ...UserApproveID3,
                        value: { ...item },
                        refresh: !UserApproveID3.refresh
                    }
                };
            }
        } else if (this.levelApproveLateEarlyAllowed == 3) {
            // var user1 = $("#UserApproveID").data("kendoComboBox"),
            //   user2 = $("#UserApproveID4").data("kendoComboBox"),
            //   user3 = $("#UserApproveID2").data("kendoComboBox"),
            //   user4 = $("#UserApproveID3").data("kendoComboBox"),
            //   _data2 = user2.dataSource.data();
            if (!item) {
                // user4.value([]);
                nextState = {
                    ...nextState,
                    UserApproveID3: {
                        ...UserApproveID3,
                        value: null,
                        refresh: !UserApproveID3.refresh
                    }
                };
            } else {
                // _data2.forEach(function (item) {
                //   if (item.ID == user2.value()) {
                //     checkAddDatasource(user4, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
                //   }
                // });
                nextState = {
                    ...nextState,
                    UserApproveID3: {
                        ...UserApproveID3,
                        value: { ...item },
                        refresh: !UserApproveID3.refresh
                    }
                };
            }
        }

        this.setState(nextState);
    };

    dosaveWorkHistorySalary = (navigation, isCreate, isSend) => {
        if (this.isProcessing) {
            return;
        }

        this.isProcessing = true;

        const {
                ID,
                ProfileID,
                TypeOfTransferID,
                JobTitleID,
                PositionID,
                CompanyID,
                AbilityTileID,
                PayrollGroupID,
                WorkPlaceID,
                RegionID,
                OrganizationStructureID,
                DateEffective,
                DecisionNo,
                DecisionDate,
                UsualAllowanceGroupID,
                // Quản lý trực tiếp
                Supervisor,
                MidSupervisor,
                NextSupervisor,
                HighSupervisor,

                // cập duyệt
                //InfoApprove,
                SuggetedUserID,
                DateSugget,
                UserApproveID,
                UserApproveID2,
                UserApproveID3,
                UserApproveID4,

                // Thông tin lương cơ bản
                DateOfEffect,
                IsCreateBasicSalary,
                GrossAmountMoneySalary,
                CurrencyIDSalary,

                InsuranceAmountSalary,
                CurrencyInsID,
                AmountTotalSalary,
                NoteSalary,
                AllowanceType
            } = this.state,
            { apiConfig } = dataVnrStorage,
            { uriPor } = apiConfig;

        let nextParams = {};
        for (let index = 1; index <= Object.keys(AllowanceType).length; index++) {
            let keyField = `AllowanceType${index}ID`,
                keyType = `AllowanceType${index}IDSalary`,
                keyAmountSalary = `AllowanceAmount${index}Salary`,
                keyCurency = `CurrencyID${index}Salary`,
                _AllowanceTypeID = AllowanceType[keyField];

            nextParams = {
                ...nextParams,
                [keyCurency]:
                    _AllowanceTypeID[keyCurency] && _AllowanceTypeID[keyCurency].value
                        ? _AllowanceTypeID[keyCurency].value.ID
                        : null,
                [keyAmountSalary]: _AllowanceTypeID[keyAmountSalary]
                    ? this.strMoneyToNumber(_AllowanceTypeID[keyAmountSalary].value)
                    : 0,
                [keyType]:
                    _AllowanceTypeID[keyType] && _AllowanceTypeID[keyType].value
                        ? _AllowanceTypeID[keyType].value.ID
                        : null
            };
        }

        nextParams = {
            ...nextParams,
            JobtitleID: JobTitleID.value ? JobTitleID.value.ID : null,
            PositionID: PositionID.value ? PositionID.value.ID : null,
            BasicSalary: GrossAmountMoneySalary.value ? this.strMoneyToNumber(GrossAmountMoneySalary.value) : 0,
            InsuranceAmount: InsuranceAmountSalary.value ? this.strMoneyToNumber(InsuranceAmountSalary.value) : 0,
            ProfileID: ProfileID.value ? ProfileID.value.ID : null,
            DateOfEffect: DateOfEffect.value ? Vnr_Function.formatDateAPI(DateOfEffect.value) : null,
            AmountTotal: AmountTotalSalary.value ? this.strMoneyToNumber(AmountTotalSalary.value) : 0,
            RankRateID: null,
            EmployeeTypeID: null,
            EmployeeGroupID: null,
            UsualAllowanceGroupID: UsualAllowanceGroupID.value ? UsualAllowanceGroupID.value.ID : null,
            ConfigScreen: 'Salary',
            TypeOfTransferID: TypeOfTransferID.value ? TypeOfTransferID.value.ID : null,
            CompanyID: CompanyID.value ? CompanyID.value.ID : null,
            AbilityTileID: AbilityTileID.value ? AbilityTileID.value.ID : null,
            PayrollGroupID: PayrollGroupID.value ? PayrollGroupID.value.ID : null,
            WorkPlaceID: WorkPlaceID.value ? WorkPlaceID.value.ID : null,
            RegionID: RegionID.value ? RegionID.value.ID : null,
            OrganizationStructureID: OrganizationStructureID.value ? OrganizationStructureID.value[0].id : null,
            DateEffective: DateEffective.value ? Vnr_Function.formatDateAPI(DateEffective.value) : null,
            DecisionNo: DecisionNo.value ? DecisionNo.value : null,
            DecisionDate: DecisionDate.value ? Vnr_Function.formatDateAPI(DecisionDate.value) : null,
            Supervisor: Supervisor.value ? Supervisor.value.ID : null,
            MidSupervisor: MidSupervisor.value ? MidSupervisor.value.ID : null,
            NextSupervisor: NextSupervisor.value ? NextSupervisor.value.ID : null,
            HighSupervisor: HighSupervisor.value ? HighSupervisor.value.ID : null,
            CurrencyIDSalary: CurrencyIDSalary.value ? CurrencyIDSalary.value.ID : null,
            CurrencyInsID: CurrencyInsID.value ? CurrencyInsID.value.ID : null,
            NoteSalary: NoteSalary.value ? NoteSalary.value : null,
            IsCreateBasicSalary: IsCreateBasicSalary.value,
            UrlLinkPortal: uriPor,
            // cập duyệt
            //InfoApprove,
            SuggetedUserID: SuggetedUserID.value ? SuggetedUserID.value.ID : null,
            DateSugget: DateSugget.value ? Vnr_Function.formatDateAPI(DateSugget.value) : null,
            UserApproveID: UserApproveID.value ? UserApproveID.value.ID : null,
            UserApproveID2: UserApproveID2.value ? UserApproveID2.value.ID : null,
            UserApproveID3: UserApproveID3.value ? UserApproveID3.value.ID : null,
            UserApproveID4: UserApproveID4.value ? UserApproveID4.value.ID : null,
            UserComment1: null,
            UserComment2: null,
            UserComment3: null,
            UserComment4: null,

            IsPortal: true
            //AppendixStatusContractExtend: ['E_WAITINGCONFIRM']
        };

        if (isSend) {
            nextParams = {
                ...nextParams,
                isSendMail: true
            };
        }

        if (this.strActionStatus) {
            nextParams = {
                ...nextParams,
                ActionStatus: this.strActionStatus
            };
        }

        if (ID) {
            nextParams = {
                ...nextParams,
                ID
            };
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/api/Hre_WorkHistorySalary', nextParams).then((dataReturn) => {
            VnrLoadingSevices.hide();
            this.isProcessing = false;

            if (dataReturn != null) {
                if (dataReturn.ActionStatus == 'HRM_HR_Profile_DoYouWantToCreateWH') {
                    AlertSevice.alert({
                        title: translate('Hrm_Notification'),
                        iconType: EnumIcon.E_WARNING,
                        message: translate('HRM_HR_Profile_DoYouWantToCreateWH'),
                        //đóng
                        onCancel: () => {},
                        //chi tiết lỗi
                        textRightButton: translate('Button_OK'),
                        onConfirm: () => {
                            this.strActionStatus = '1';
                            this.dosaveWorkHistorySalary(navigation, isCreate, isSend);
                        }
                    });
                } else if (dataReturn.ActionStatus == 'HRM_HR_Profile_DoYouWantToUpdateWH') {
                    AlertSevice.alert({
                        title: translate('Hrm_Notification'),
                        iconType: EnumIcon.E_WARNING,
                        message: translate('HRM_HR_Profile_DoYouWantToUpdateWH'),
                        //đóng
                        onCancel: () => {},
                        //chi tiết lỗi
                        textRightButton: translate('Button_OK'),
                        onConfirm: () => {
                            this.strActionStatus = '1';
                            this.dosaveWorkHistorySalary(navigation, isCreate, isSend);
                        }
                    });
                } else if (dataReturn.ActionStatus == 'Success') {
                    ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                    if (isCreate) {
                        this.refreshView();
                    } else {
                        navigation.goBack();
                    }

                    const { reload } = navigation.state.params;
                    if (typeof reload == 'function') {
                        reload();
                    }
                } else if (dataReturn.ActionStatus && typeof dataReturn.ActionStatus == 'string') {
                    ToasterSevice.showWarning(dataReturn.ActionStatus);
                }
            } else {
                ToasterSevice.showWarning('HRM_Common_SendRequest_Error');
            }
        });
    };

    updateWorkHistorySalary = (navigation, isCreate, isSend, IsCheckDiscipline) => {
        if (this.isProcessing) {
            return;
        }

        this.isProcessing = true;

        const {
                ID,
                ProfileID,
                TypeOfTransferID,
                JobTitleID,
                PositionID,
                CompanyID,
                AbilityTileID,
                PayrollGroupID,
                WorkPlaceID,
                RegionID,
                OrganizationStructureID,
                DateEffective,
                DecisionNo,
                DecisionDate,
                UsualAllowanceGroupID,
                // Quản lý trực tiếp
                Supervisor,
                MidSupervisor,
                NextSupervisor,
                HighSupervisor,

                // cập duyệt
                //InfoApprove,
                SuggetedUserID,
                DateSugget,
                UserApproveID,
                UserApproveID2,
                UserApproveID3,
                UserApproveID4,

                // Thông tin lương cơ bản
                DateOfEffect,
                IsCreateBasicSalary,
                GrossAmountMoneySalary,
                CurrencyIDSalary,

                InsuranceAmountSalary,
                CurrencyInsID,
                AmountTotalSalary,
                NoteSalary,
                AllowanceType
            } = this.state,
            { apiConfig } = dataVnrStorage,
            { uriPor } = apiConfig;

        let nextParams = {},
            paramsAllowance = {};

        for (let index = 1; index <= Object.keys(AllowanceType).length; index++) {
            let keyField = `AllowanceType${index}ID`,
                keyType = `AllowanceType${index}IDSalary`,
                keyAmountSalary = `AllowanceAmount${index}Salary`,
                keyCurency = `CurrencyID${index}Salary`,
                _AllowanceTypeID = AllowanceType[keyField];

            paramsAllowance = {
                ...paramsAllowance,
                [keyCurency]:
                    _AllowanceTypeID[keyCurency] && _AllowanceTypeID[keyCurency].value
                        ? _AllowanceTypeID[keyCurency].value.ID
                        : null,
                [keyAmountSalary]: _AllowanceTypeID[keyAmountSalary]
                    ? this.strMoneyToNumber(_AllowanceTypeID[keyAmountSalary].value)
                    : 0,
                [keyType]:
                    _AllowanceTypeID[keyType] && _AllowanceTypeID[keyType].value
                        ? _AllowanceTypeID[keyType].value.ID
                        : null
            };
        }

        nextParams = {
            Tab_WorkHistory: {
                ID: ID,
                JobtitleID: JobTitleID.value ? JobTitleID.value.ID : null,
                PositionID: PositionID.value ? PositionID.value.ID : null,
                ProfileID: ProfileID.value ? ProfileID.value.ID : null,
                EmployeeTypeID: null,
                EmployeeGroupID: null,
                UsualAllowanceGroupID: UsualAllowanceGroupID.value ? UsualAllowanceGroupID.value.ID : null,
                CompanyID: CompanyID.value ? CompanyID.value.ID : null,
                AbilityTileID: AbilityTileID.value ? AbilityTileID.value.ID : null,
                PayrollGroupID: PayrollGroupID.value ? PayrollGroupID.value.ID : null,
                WorkPlaceID: WorkPlaceID.value ? WorkPlaceID.value.ID : null,
                RegionID: RegionID.value ? RegionID.value.ID : null,
                OrganizationStructureID: OrganizationStructureID.value ? OrganizationStructureID.value[0].id : null,
                DateEffective: DateEffective.value ? Vnr_Function.formatDateAPI(DateEffective.value) : null,
                TypeOfTransferID: TypeOfTransferID.value ? TypeOfTransferID.value.ID : null,
                DecisionNo: DecisionNo.value ? DecisionNo.value : null,
                DecisionDate: DecisionDate.value ? Vnr_Function.formatDateAPI(DecisionDate.value) : null,
                Supervisor: Supervisor.value ? Supervisor.value.ID : null,
                MidSupervisor: MidSupervisor.value ? MidSupervisor.value.ID : null,
                NextSupervisor: NextSupervisor.value ? NextSupervisor.value.ID : null,
                HighSupervisor: HighSupervisor.value ? HighSupervisor.value.ID : null,
                RankRateID: null,
                SuggetedUserID: SuggetedUserID.value ? SuggetedUserID.value.ID : null,
                DateSugget: DateSugget.value ? Vnr_Function.formatDateAPI(DateSugget.value) : null,
                UserApproveID: UserApproveID.value ? UserApproveID.value.ID : null,
                UserApproveID2: UserApproveID2.value ? UserApproveID2.value.ID : null,
                UserApproveID3: UserApproveID3.value ? UserApproveID3.value.ID : null,
                UserApproveID4: UserApproveID4.value ? UserApproveID4.value.ID : null,
                UserComment1: null,
                UserComment2: null,
                UserComment3: null,
                UserComment4: null,
                UrlLinkPortal: uriPor,
                Status: 'E_SUBMIT',
                UserSubmit: dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null,
                IsPortal: true
            },
            Tab_BasicSalary: {
                ...paramsAllowance,
                ID: ID,
                GrossAmountSalary: GrossAmountMoneySalary.value
                    ? this.strMoneyToNumber(GrossAmountMoneySalary.value)
                    : 0,
                GrossAmountMoneySalary: GrossAmountMoneySalary.value
                    ? this.strMoneyToNumber(GrossAmountMoneySalary.value)
                    : 0,
                //BasicSalary: GrossAmountMoneySalary.value ? this.strMoneyToNumber(GrossAmountMoneySalary.value) : 0,

                InsuranceAmount: InsuranceAmountSalary.value ? this.strMoneyToNumber(InsuranceAmountSalary.value) : 0,
                InsuranceAmountSalary: InsuranceAmountSalary.value
                    ? this.strMoneyToNumber(InsuranceAmountSalary.value)
                    : 0,

                DateOfEffect: DateOfEffect.value ? Vnr_Function.formatDateAPI(DateOfEffect.value) : null,
                DateOfEffectSalary: DateOfEffect.value ? Vnr_Function.formatDateAPI(DateOfEffect.value) : null,

                AmountTotalSalary: AmountTotalSalary.value ? this.strMoneyToNumber(AmountTotalSalary.value) : 0,
                AmountTotal: AmountTotalSalary.value ? this.strMoneyToNumber(AmountTotalSalary.value) : 0,

                CurrencyIDSalary: CurrencyIDSalary.value ? CurrencyIDSalary.value.ID : null,
                CurrencyInsID: CurrencyInsID.value ? CurrencyInsID.value.ID : null,
                NoteSalary: NoteSalary.value ? NoteSalary.value : null,
                IsCreateBasicSalary: IsCreateBasicSalary.value,
                UserSubmit: dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null,
                IsPortal: true
            },
            ID: ID
        };

        if (isSend) {
            nextParams.Tab_WorkHistory.isSendMail = true;
        }

        if (this.strActionStatus) {
            nextParams = {
                ...nextParams,
                ActionStatus: this.strActionStatus
            };
        }

        if (IsCheckDiscipline) {
            AlertSevice.alert({
                title: translate('Hrm_Notification'),
                iconType: EnumIcon.E_WARNING,
                message: translate('HRM_CheckDisciplineCreateBasicSalary'),
                //đóng
                onCancel: () => {},
                //chi tiết lỗi
                textRightButton: translate('Button_OK'),
                onConfirm: () => {
                    VnrLoadingSevices.show();
                    HttpService.Post('[URI_HR]/Hre_GetData/EditWorkhistorySalary', nextParams).then((dataReturn) => {
                        VnrLoadingSevices.hide();
                        this.isProcessing = false;

                        if (dataReturn != null) {
                            if (dataReturn.ActionStatus == 'HRM_HR_Profile_DoYouWantToCreateWH') {
                                AlertSevice.alert({
                                    title: translate('Hrm_Notification'),
                                    iconType: EnumIcon.E_WARNING,
                                    message: translate('HRM_HR_Profile_DoYouWantToCreateWH'),
                                    //đóng
                                    onCancel: () => {},
                                    //chi tiết lỗi
                                    textRightButton: translate('Button_OK'),
                                    onConfirm: () => {
                                        this.strActionStatus = '1';
                                        this.dosaveWorkHistorySalary(navigation, isCreate, isSend);
                                    }
                                });
                            } else if (dataReturn.ActionStatus == 'HRM_HR_Profile_DoYouWantToUpdateWH') {
                                AlertSevice.alert({
                                    title: translate('Hrm_Notification'),
                                    iconType: EnumIcon.E_WARNING,
                                    message: translate('HRM_HR_Profile_DoYouWantToUpdateWH'),
                                    //đóng
                                    onCancel: () => {},
                                    //chi tiết lỗi
                                    textRightButton: translate('Button_OK'),
                                    onConfirm: () => {
                                        this.strActionStatus = '1';
                                        this.dosaveWorkHistorySalary(navigation, isCreate, isSend);
                                    }
                                });
                            } else if (dataReturn.ActionStatus == 'Success') {
                                ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                                if (isCreate) {
                                    this.refreshView();
                                } else {
                                    navigation.goBack();
                                }

                                const { reload } = navigation.state.params;
                                if (typeof reload == 'function') {
                                    reload();
                                }
                            } else if (dataReturn.ActionStatus && typeof dataReturn.ActionStatus == 'string') {
                                ToasterSevice.showWarning(dataReturn.ActionStatus);
                            }
                        } else {
                            ToasterSevice.showWarning('HRM_Common_SendRequest_Error');
                        }
                    });
                }
            });
        } else {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Hre_GetData/EditWorkhistorySalary', nextParams).then((dataReturn) => {
                VnrLoadingSevices.hide();
                this.isProcessing = false;

                if (dataReturn != null) {
                    if (dataReturn.ActionStatus == 'HRM_HR_Profile_DoYouWantToCreateWH') {
                        AlertSevice.alert({
                            title: translate('Hrm_Notification'),
                            iconType: EnumIcon.E_WARNING,
                            message: translate('HRM_HR_Profile_DoYouWantToCreateWH'),
                            //đóng
                            onCancel: () => {},
                            //chi tiết lỗi
                            textRightButton: translate('Button_OK'),
                            onConfirm: () => {
                                this.strActionStatus = '1';
                                this.dosaveWorkHistorySalary(navigation, isCreate, isSend);
                            }
                        });
                    } else if (dataReturn.ActionStatus == 'HRM_HR_Profile_DoYouWantToUpdateWH') {
                        AlertSevice.alert({
                            title: translate('Hrm_Notification'),
                            iconType: EnumIcon.E_WARNING,
                            message: translate('HRM_HR_Profile_DoYouWantToUpdateWH'),
                            //đóng
                            onCancel: () => {},
                            //chi tiết lỗi
                            textRightButton: translate('Button_OK'),
                            onConfirm: () => {
                                this.strActionStatus = '1';
                                this.dosaveWorkHistorySalary(navigation, isCreate, isSend);
                            }
                        });
                    } else if (dataReturn.ActionStatus == 'Success') {
                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                        if (isCreate) {
                            this.refreshView();
                        } else {
                            navigation.goBack();
                        }

                        const { reload } = navigation.state.params;
                        if (typeof reload == 'function') {
                            reload();
                        }
                    } else if (dataReturn.ActionStatus && typeof dataReturn.ActionStatus == 'string') {
                        ToasterSevice.showWarning(dataReturn.ActionStatus);
                    }
                } else {
                    ToasterSevice.showWarning('HRM_Common_SendRequest_Error');
                }
            });
        }
    };

    onSave = (navigation, isCreate, isSend) => {
        const { DateEffective, ProfileID, ID, IsCreateBasicSalary, DateOfEffect } = this.state;
        VnrLoadingSevices.show();

        HttpService.Post('[URI_HR]/Hre_GetDataV2/GetConfigSettingSaveWorkHistory', {
            DateEffect: Vnr_Function.formatDateAPI(DateEffective.value),
            ProfileID: ProfileID.value ? ProfileID.value.ID : null
        }).then((dataReturn) => {
            VnrLoadingSevices.hide();
            if (dataReturn != null && dataReturn != '') {
                if (dataReturn == 'E_BLOCK') {
                    ToasterSevice.showWarning('HRM_WorkHistory_DoneHave');
                    //isDisabledLink(eleLink, false);
                    // return "";
                } else if (dataReturn == 'E_WARNING') {
                    AlertSevice.alert({
                        title: translate('Hrm_Notification'),
                        iconType: EnumIcon.E_WARNING,
                        message: translate('HRM_WorkHistory_DoneHaveContinue'),
                        //đóng
                        onCancel: () => {},
                        //chi tiết lỗi
                        textRightButton: translate('Button_OK'),
                        onConfirm: () => {
                            if (ID) {
                                this.updateWorkHistorySalary(navigation, isCreate, isSend);
                            } else {
                                this.dosaveWorkHistorySalary(navigation, isCreate, isSend);
                            }
                        }
                    });
                }
            } else if (ID) {
                if (IsCreateBasicSalary) {
                    HttpService.Post('[URI_HR]/Sal_GetData/CheckDisciplineCreateBasicSalary', {
                        ProfileID: ProfileID.value ? ProfileID.value.ID : null,
                        DateOfEffect: DateOfEffect.value ? Vnr_Function.formatDateAPI(DateOfEffect.value) : null
                    }).then((IsCheckDiscipline) => {
                        this.updateWorkHistorySalary(navigation, isCreate, isSend, IsCheckDiscipline);
                    });
                } else {
                    this.updateWorkHistorySalary(navigation, isCreate, isSend);
                }
            } else {
                this.dosaveWorkHistorySalary(navigation, isCreate, isSend);
            }
        });
    };

    onSaveAndCreate = (navigation) => {
        this.onSave(navigation, true, null);
    };

    onSaveAndSend = (navigation) => {
        this.onSave(navigation, null, true);
    };

    formatDate = (val) => {
        if (val) {
            return moment(val).format('YYYY-MM-DD HH:mm:ss');
        }

        return null;
    };

    formatTime = (val) => {
        if (val) {
            return moment(val).format('HH:mm');
        }

        return null;
    };

    onchangeAllowanceType = (keyField, keyType, keyAmount, keyCurency, value) => {
        const { AllowanceType } = this.state;
        let _AllowanceTypeID = AllowanceType[keyField],
            AllowanceTypeSalary = _AllowanceTypeID[keyType];

        this.setState(
            {
                AllowanceType: {
                    ...AllowanceType,
                    [keyField]: {
                        ..._AllowanceTypeID,
                        [keyType]: {
                            ...AllowanceTypeSalary,
                            value: value,
                            refresh: !AllowanceTypeSalary.refresh
                        }
                    }
                }
            },
            () => this.getReloadbyConfigFormula(keyType)
        );
    };

    onchangeAllowanceTypeAmount = (keyField, keyType, keyAmount, keyCurency, value) => {
        const { AllowanceType } = this.state;
        let _AllowanceTypeID = AllowanceType[keyField],
            AllowanceTypeAmount = _AllowanceTypeID[keyAmount];

        this.setState({
            AllowanceType: {
                ...AllowanceType,
                [keyField]: {
                    ..._AllowanceTypeID,
                    [keyAmount]: {
                        ...AllowanceTypeAmount,
                        value: value,
                        refresh: !AllowanceTypeAmount.refresh
                    }
                }
            }
        });
    };

    onchangeAllowanceTypeCurency = (keyField, keyType, keyAmount, keyCurency, value) => {
        const { AllowanceType } = this.state;
        let _AllowanceTypeID = AllowanceType[keyField],
            AllowanceTypeCurrent = _AllowanceTypeID[keyCurency];

        this.setState({
            AllowanceType: {
                ...AllowanceType,
                [keyField]: {
                    ..._AllowanceTypeID,
                    [keyCurency]: {
                        ...AllowanceTypeCurrent,
                        value: value,
                        refresh: !AllowanceTypeCurrent.refresh
                    }
                }
            }
        });
    };

    renderAllowanceType = () => {
        const { IsCreateBasicSalary, AllowanceType, fieldValid } = this.state;
        const {
            textLableInfo,
            contentViewControl,
            viewLable,
            viewControl,
            formDate_To_From,
            controlDate_To,
            controlDate_from
        } = stylesListPickerControl;

        if (IsCreateBasicSalary.value) {
            return Object.keys(AllowanceType).map((item, index) => {
                index += 1;

                let keyField = `AllowanceType${index}ID`,
                    keyType = `AllowanceType${index}IDSalary`,
                    keyAmount = `AllowanceAmount${index}Salary`,
                    keyCurency = `CurrencyID${index}Salary`,
                    _AllowanceTypeID = AllowanceType[keyField];

                let AllowanceTypeSalary = _AllowanceTypeID[keyType],
                    AllowanceTypeAmount = _AllowanceTypeID[keyAmount],
                    AllowanceTypeCurrent = _AllowanceTypeID[keyCurency];
                // keyTypeID = `AllowanceTypeID${index}`,
                // keyTypeName = `UsualAllowanceName${index}`,
                // keyCurencyID = `CurrencyID${index}`,
                // keyCurencyName = `CurrencyName${index}`;
                return (
                    <View key={index}>
                        {/* - AllowanceTypeSalary (n) */}
                        {AllowanceTypeSalary.visibleConfig && AllowanceTypeSalary.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={AllowanceTypeSalary.label}
                                    />

                                    {/* valid AllowanceTypeSalary */}
                                    {fieldValid.AllowanceTypeSalary && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        dataLocal={AllowanceTypeSalary.data}
                                        refresh={AllowanceTypeSalary.refresh}
                                        textField={'UsualAllowanceName'}
                                        valueField={'ID'}
                                        filter={true}
                                        value={AllowanceTypeSalary.value}
                                        filterServer={false}
                                        autoFilter={true}
                                        disable={AllowanceTypeSalary.disable}
                                        onFinish={(item) =>
                                            this.onchangeAllowanceType(keyField, keyType, keyAmount, keyCurency, item)
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/*  - AllowanceTypeAmount (1 - 15) */}
                        <View style={[contentViewControl, CustomStyleSheet.paddingTop(0)]}>
                            <View style={viewControl}>
                                <View style={formDate_To_From}>
                                    <View style={[controlDate_from, CustomStyleSheet.flex(5)]}>
                                        <VnrTextInput
                                            value={AllowanceTypeAmount.value}
                                            refresh={AllowanceTypeAmount.refresh}
                                            disable={AllowanceTypeAmount.disable}
                                            keyboardType={'numeric'}
                                            charType={'money'}
                                            returnKeyType={'done'}
                                            onChangeText={(item) =>
                                                this.onchangeAllowanceTypeAmount(
                                                    keyField,
                                                    keyType,
                                                    keyAmount,
                                                    keyCurency,
                                                    item
                                                )
                                            }
                                            onSubmitEditing={() => this.getReloadbyConfigFormula(keyAmount)}
                                            onBlur={() => this.getReloadbyConfigFormula(keyAmount)}
                                        />
                                    </View>
                                    <View style={[controlDate_To, CustomStyleSheet.flex(5)]}>
                                        <VnrPickerQuickly
                                            dataLocal={AllowanceTypeCurrent.data}
                                            refresh={AllowanceTypeCurrent.refresh}
                                            textField={'CurrencyName'}
                                            valueField={'ID'}
                                            filter={true}
                                            value={AllowanceTypeCurrent.value}
                                            filterServer={false}
                                            autoFilter={true}
                                            disable={AllowanceTypeCurrent.disable}
                                            onFinish={(item) =>
                                                this.onchangeAllowanceTypeCurency(
                                                    keyField,
                                                    keyType,
                                                    keyAmount,
                                                    keyCurency,
                                                    item
                                                )
                                            }
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                );
            });
        }
    };

    render() {
        const {
                ProfileID,
                DateEffective,
                DecisionDate,
                TypeOfTransferID,

                InfoUser,
                JobTitleID,
                PositionID,
                CompanyID,
                AbilityTileID,
                PayrollGroupID,
                DecisionNo,
                WorkPlaceID,
                RegionID,
                OrganizationStructureID,
                // Quản lý trực tiếp
                Supervisor,
                MidSupervisor,
                NextSupervisor,
                HighSupervisor,

                // cập duyệt
                InfoApprove,
                SuggetedUserID,
                DateSugget,
                UserApproveID,
                UserApproveID2,
                UserApproveID3,
                UserApproveID4,

                // Thông tin lương cơ bản
                DateOfEffect,
                IsCreateBasicSalary,
                GrossAmountMoneySalary,
                CurrencyIDSalary,

                InsuranceAmountSalary,
                CurrencyInsID,
                AmountTotalSalary,
                NoteSalary,
                AllowanceType,

                fieldValid,
                modalErrorDetail
            } = this.state,
            { isShowInfoAdvance } = InfoApprove,
            { isShowInfoUser } = InfoUser;

        const {
            textLableInfo,
            contentViewControl,
            viewLable,
            viewControl,
            viewInputMultiline,
            formDate_To_From,
            controlDate_To,
            controlDate_from,
            viewBtnShowHideUser,
            viewBtnShowHideUser_text
        } = stylesListPickerControl;

        //#region [Xử lý 3 nút lưu]
        const listActions = [];

        listActions.push(
            {
                type: EnumName.E_SAVE_SENMAIL,
                title: translate('HRM_Common_SaveAndSendMail'),
                onPress: () => this.onSaveAndSend(this.props.navigation)
            },
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
                        contentContainerStyle={styles.stykeyBoard}
                        ref={(ref) => (this.scrollViewRef = ref)}
                    >
                        {/* Nhân viên - ProfileID*/}
                        {ProfileID.visibleConfig && ProfileID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={ProfileID.label} />

                                    {/* valid ProfileID */}
                                    {fieldValid.ProfileID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={{
                                            urlApi: '[URI_HR]/Hre_GetData/GetMultiProfile',
                                            type: 'E_GET'
                                        }}
                                        autoFilter={true}
                                        refresh={ProfileID.refresh}
                                        textField="ProfileName"
                                        valueField="ID"
                                        filter={true}
                                        value={ProfileID.value}
                                        filterServer={true}
                                        filterParams="text"
                                        disable={ProfileID.disable}
                                        onFinish={(item) => this.onChangeProfileID(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ngày hiệu lực - DateEffective */}
                        {DateEffective.visibleConfig && DateEffective.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={DateEffective.label} />

                                    {/* valid DateEffective */}
                                    {fieldValid.DateEffective && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        disable={DateEffective.disable}
                                        format={'DD/MM/YYYY'}
                                        value={DateEffective.value}
                                        refresh={DateEffective.refresh}
                                        type={'date'}
                                        onFinish={(value) =>
                                            this.setState({
                                                DateEffective: {
                                                    ...DateEffective,
                                                    value: value,
                                                    refresh: !DateEffective.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ngày hiệu lực - DecisionDate */}
                        {DecisionDate.visibleConfig && DecisionDate.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={DecisionDate.label} />

                                    {/* valid DecisionDate */}
                                    {fieldValid.DecisionDate && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        disable={DecisionDate.disable}
                                        format={'DD/MM/YYYY'}
                                        value={DecisionDate.value}
                                        refresh={DecisionDate.refresh}
                                        type={'date'}
                                        onFinish={(value) =>
                                            this.setState({
                                                DecisionDate: {
                                                    ...DecisionDate,
                                                    value: value,
                                                    refresh: !DecisionDate.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Loại điều chuyển - TypeOfTransferID */}
                        {TypeOfTransferID.visibleConfig && TypeOfTransferID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={TypeOfTransferID.label}
                                    />

                                    {/* valid TypeOfTransferID */}
                                    {fieldValid.TypeOfTransferID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={{
                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiTypeOfTransferHistory',
                                            type: 'E_GET'
                                        }}
                                        refresh={TypeOfTransferID.refresh}
                                        textField="NameEntityName"
                                        valueField="ID"
                                        filter={true}
                                        value={TypeOfTransferID.value}
                                        filterServer={false}
                                        filterParams="NameEntityName"
                                        disable={TypeOfTransferID.disable}
                                        onFinish={(item) => this.onChangeTypeOfTransferID(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/*Số quyết định -  DecisionNo*/}
                        {DecisionNo.visibleConfig && DecisionNo.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={DecisionNo.label} />
                                    {fieldValid.DecisionNo && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={DecisionNo.disable}
                                        refresh={DecisionNo.refresh}
                                        value={DecisionNo.value}
                                        keyboardType={'numeric'}
                                        charType={'double'}
                                        returnKeyType={'done'}
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

                        {/*  Thông tin phê duyệt - InfoApprove */}
                        {InfoUser.visible && InfoUser.visibleConfig && (
                            <View style={styles.styViewAllMore}>
                                {isShowInfoUser && (
                                    <View>
                                        {/* Phòng ban -  OrganizationStructureID*/}
                                        {OrganizationStructureID.visibleConfig && OrganizationStructureID.visible && (
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={OrganizationStructureID.label}
                                                    />
                                                    {fieldValid.OrganizationStructureID && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrTreeView
                                                        api={{
                                                            urlApi: '[URI_HR]/Cat_GetData/GetOrgTreeView',
                                                            type: 'E_GET'
                                                        }}
                                                        valueField={'ID'}
                                                        value={OrganizationStructureID.value}
                                                        refresh={OrganizationStructureID.refresh}
                                                        isCheckChildren={false}
                                                        onSelect={(items) => this.treeViewResult(items)}
                                                    />
                                                </View>
                                            </View>
                                        )}

                                        {/* Chức danh - JobTitleID */}
                                        {JobTitleID.visibleConfig && JobTitleID.visible && (
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={JobTitleID.label}
                                                    />

                                                    {/* valid JobTitleID */}
                                                    {fieldValid.JobTitleID && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrPicker
                                                        dataLocal={JobTitleID.data}
                                                        refresh={JobTitleID.refresh}
                                                        textField="JobTitleName"
                                                        valueField="ID"
                                                        filter={true}
                                                        value={JobTitleID.value}
                                                        filterServer={false}
                                                        filterParams="JobTitleName"
                                                        disable={JobTitleID.disable}
                                                        onFinish={(item) => this.onChangeJobTitleID(item)}
                                                    />
                                                </View>
                                            </View>
                                        )}

                                        {/* Chức vụ - PositionID */}
                                        {PositionID.visibleConfig && PositionID.visible && (
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={PositionID.label}
                                                    />

                                                    {/* valid PositionID */}
                                                    {fieldValid.PositionID && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrPicker
                                                        api={{
                                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiPosition',
                                                            type: 'E_GET'
                                                        }}
                                                        refresh={PositionID.refresh}
                                                        textField="PositionName"
                                                        valueField="ID"
                                                        filter={true}
                                                        value={PositionID.value}
                                                        filterServer={false}
                                                        filterParams="PositionName"
                                                        disable={PositionID.disable}
                                                        onFinish={(item) => this.onChangePositionID(item)}
                                                    />
                                                </View>
                                            </View>
                                        )}

                                        {/* Công ty - CompanyID */}
                                        {CompanyID.visibleConfig && CompanyID.visible && (
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={CompanyID.label}
                                                    />

                                                    {/* valid CompanyID */}
                                                    {fieldValid.CompanyID && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrPickerQuickly
                                                        api={{
                                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiCompany',
                                                            type: 'E_GET'
                                                        }}
                                                        refresh={CompanyID.refresh}
                                                        textField="CompanyName"
                                                        valueField="ID"
                                                        filter={true}
                                                        value={CompanyID.value}
                                                        filterServer={false}
                                                        filterParams="CompanyName"
                                                        disable={CompanyID.disable}
                                                        onFinish={(item) => this.onChangeCompanyID(item)}
                                                    />
                                                </View>
                                            </View>
                                        )}

                                        {/* Cấp bậc chuyên môn - AbilityTileID */}
                                        {AbilityTileID.visibleConfig && AbilityTileID.visible && (
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={AbilityTileID.label}
                                                    />

                                                    {/* valid AbilityTileID */}
                                                    {fieldValid.AbilityTileID && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrPickerQuickly
                                                        api={{
                                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiAbilityTile',
                                                            type: 'E_GET'
                                                        }}
                                                        refresh={AbilityTileID.refresh}
                                                        textField="AbilityTitleVNI"
                                                        valueField="ID"
                                                        filter={true}
                                                        value={AbilityTileID.value}
                                                        filterServer={false}
                                                        filterParams="AbilityTitleVNI"
                                                        disable={AbilityTileID.disable}
                                                        onFinish={(item) => this.onChangeAbilityTileID(item)}
                                                    />
                                                </View>
                                            </View>
                                        )}

                                        {/* Nhóm lương - PayrollGroupID */}
                                        {PayrollGroupID.visibleConfig && PayrollGroupID.visible && (
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={PayrollGroupID.label}
                                                    />

                                                    {/* valid PayrollGroupID */}
                                                    {fieldValid.PayrollGroupID && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrPickerQuickly
                                                        api={{
                                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiPayrollGroup',
                                                            type: 'E_GET'
                                                        }}
                                                        refresh={PayrollGroupID.refresh}
                                                        textField="PayrollGroupName"
                                                        valueField="ID"
                                                        filter={true}
                                                        value={PayrollGroupID.value}
                                                        filterServer={false}
                                                        filterParams="PayrollGroupName"
                                                        disable={PayrollGroupID.disable}
                                                        onFinish={(item) => this.onChangePayrollGroupID(item)}
                                                    />
                                                </View>
                                            </View>
                                        )}

                                        {/* Nơi làm việc - WorkPlaceID */}
                                        {WorkPlaceID.visibleConfig && WorkPlaceID.visible && (
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={WorkPlaceID.label}
                                                    />

                                                    {/* valid WorkPlaceID */}
                                                    {fieldValid.WorkPlaceID && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrPickerQuickly
                                                        api={{
                                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiWorkPlace',
                                                            type: 'E_GET'
                                                        }}
                                                        refresh={WorkPlaceID.refresh}
                                                        textField="WorkPlaceName"
                                                        valueField="ID"
                                                        filter={true}
                                                        value={WorkPlaceID.value}
                                                        filterServer={false}
                                                        filterParams="CompanyName"
                                                        disable={WorkPlaceID.disable}
                                                        onFinish={(item) => this.onChangeWorkPlaceID(item)}
                                                    />
                                                </View>
                                            </View>
                                        )}

                                        {/* Khu vực bảo hiểm - RegionID */}
                                        {RegionID.visibleConfig && RegionID.visible && (
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={RegionID.label}
                                                    />

                                                    {/* valid RegionID */}
                                                    {fieldValid.RegionID && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrPickerQuickly
                                                        api={{
                                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiRegion',
                                                            type: 'E_GET'
                                                        }}
                                                        refresh={RegionID.refresh}
                                                        textField="ManageRegionName"
                                                        valueField="ID"
                                                        filter={true}
                                                        value={RegionID.value}
                                                        filterServer={false}
                                                        filterParams="ManageRegionName"
                                                        disable={RegionID.disable}
                                                        onFinish={(item) => this.onChangeRegionID(item)}
                                                    />
                                                </View>
                                            </View>
                                        )}

                                        {/* Người QL trực tiếp - Supervisor*/}
                                        {Supervisor.visibleConfig && Supervisor.visible && (
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={Supervisor.label}
                                                    />

                                                    {/* valid Supervisor */}
                                                    {fieldValid.Supervisor && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrPicker
                                                        api={{
                                                            urlApi: '[URI_HR]/Hre_GetData/LoadProfileMultiByConfigV2',
                                                            type: 'E_GET'
                                                        }}
                                                        autoFilter={true}
                                                        refresh={Supervisor.refresh}
                                                        textField="ProfileName"
                                                        valueField="CodeEmp"
                                                        filter={true}
                                                        value={Supervisor.value}
                                                        filterServer={true}
                                                        filterParams="text"
                                                        disable={Supervisor.disable}
                                                        onFinish={(item) => {
                                                            this.setState({
                                                                Supervisor: {
                                                                    ...Supervisor,
                                                                    value: item,
                                                                    refresh: !Supervisor.refresh
                                                                }
                                                            });
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                        )}

                                        {/* Người QL kế tiếp - MidSupervisor*/}
                                        {MidSupervisor.visibleConfig && MidSupervisor.visible && (
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={MidSupervisor.label}
                                                    />

                                                    {/* valid MidSupervisor */}
                                                    {fieldValid.MidSupervisor && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrPicker
                                                        api={{
                                                            urlApi: '[URI_HR]/Hre_GetData/LoadProfileMultiByConfigV2',
                                                            type: 'E_GET'
                                                        }}
                                                        autoFilter={true}
                                                        refresh={MidSupervisor.refresh}
                                                        textField="ProfileName"
                                                        valueField="CodeEmp"
                                                        filter={true}
                                                        value={MidSupervisor.value}
                                                        filterServer={true}
                                                        filterParams="text"
                                                        disable={MidSupervisor.disable}
                                                        onFinish={(item) => {
                                                            this.setState({
                                                                MidSupervisor: {
                                                                    ...MidSupervisor,
                                                                    value: item,
                                                                    refresh: !MidSupervisor.refresh
                                                                }
                                                            });
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                        )}

                                        {/* Người QL tiếp theo - NextSupervisor*/}
                                        {NextSupervisor.visibleConfig && NextSupervisor.visible && (
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={NextSupervisor.label}
                                                    />

                                                    {/* valid NextSupervisor */}
                                                    {fieldValid.NextSupervisor && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrPicker
                                                        api={{
                                                            urlApi: '[URI_HR]/Hre_GetData/LoadProfileMultiByConfigV2',
                                                            type: 'E_GET'
                                                        }}
                                                        autoFilter={true}
                                                        refresh={NextSupervisor.refresh}
                                                        textField="ProfileName"
                                                        valueField="CodeEmp"
                                                        filter={true}
                                                        value={NextSupervisor.value}
                                                        filterServer={true}
                                                        filterParams="text"
                                                        disable={NextSupervisor.disable}
                                                        onFinish={(item) => {
                                                            this.setState({
                                                                NextSupervisor: {
                                                                    ...NextSupervisor,
                                                                    value: item,
                                                                    refresh: !NextSupervisor.refresh
                                                                }
                                                            });
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                        )}

                                        {/* Người QL cấp cao - HighSupervisor*/}
                                        {HighSupervisor.visibleConfig && HighSupervisor.visible && (
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={HighSupervisor.label}
                                                    />

                                                    {/* valid HighSupervisor */}
                                                    {fieldValid.HighSupervisor && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrPicker
                                                        api={{
                                                            urlApi: '[URI_HR]/Hre_GetData/LoadProfileMultiByConfigV2',
                                                            type: 'E_GET'
                                                        }}
                                                        autoFilter={true}
                                                        refresh={HighSupervisor.refresh}
                                                        textField="ProfileName"
                                                        valueField="CodeEmp"
                                                        filter={true}
                                                        value={HighSupervisor.value}
                                                        filterServer={true}
                                                        filterParams="text"
                                                        disable={HighSupervisor.disable}
                                                        onFinish={(item) => {
                                                            this.setState({
                                                                HighSupervisor: {
                                                                    ...HighSupervisor,
                                                                    value: item,
                                                                    refresh: !HighSupervisor.refresh
                                                                }
                                                            });
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                )}

                                <View
                                    style={contentViewControl}
                                    onLayout={(event) => (this.layoutViewInfoMore = event.nativeEvent.layout)}
                                >
                                    <TouchableOpacity
                                        style={viewBtnShowHideUser}
                                        onPress={() =>
                                            this.setState(
                                                {
                                                    InfoUser: {
                                                        ...InfoUser,
                                                        isShowInfoUser: !isShowInfoUser
                                                    }
                                                },
                                                () => {
                                                    // setTimeout(() => {
                                                    //   this.layoutViewInfoMore !== null && this.scrollViewRef.scrollToPosition(0, this.layoutViewInfoMore.y + 1000);
                                                    // }, 0);
                                                }
                                            )
                                        }
                                    >
                                        {isShowInfoUser ? (
                                            <IconUp size={Size.iconSize - 3} color={Colors.primary} />
                                        ) : (
                                            <IconDown size={Size.iconSize - 3} color={Colors.primary} />
                                        )}
                                        <VnrText
                                            style={[styleSheets.lable, viewBtnShowHideUser_text]}
                                            i18nKey={
                                                isShowInfoUser
                                                    ? 'HRM_PortalApp_Colspan_Info'
                                                    : 'HRM_HRM_WorkingPosition'
                                            }
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {/*  Thông tin phê duyệt - InfoApprove */}
                        {InfoApprove.visible && InfoApprove.visibleConfig && (
                            <View style={styles.styViewAllMore}>
                                {isShowInfoAdvance && (
                                    <View>
                                        {/* Người đề nghị - SuggetedUserID */}
                                        {SuggetedUserID.visibleConfig && SuggetedUserID.visible && (
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={SuggetedUserID.label}
                                                    />

                                                    {/* valid SuggetedUserID */}
                                                    {fieldValid.SuggetedUserID && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrPicker
                                                        api={{
                                                            urlApi: '[URI_HR]/Hre_GetData/GetMultiProfileNoPermission',
                                                            type: 'E_GET'
                                                        }}
                                                        autoFilter={true}
                                                        refresh={SuggetedUserID.refresh}
                                                        textField="ProfileName"
                                                        valueField="ID"
                                                        filter={true}
                                                        value={SuggetedUserID.value}
                                                        filterServer={true}
                                                        filterParams="text"
                                                        disable={SuggetedUserID.disable}
                                                        onFinish={(item) => {
                                                            this.setState({
                                                                SuggetedUserID: {
                                                                    ...SuggetedUserID,
                                                                    value: item,
                                                                    refresh: !SuggetedUserID.refresh
                                                                }
                                                            });
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                        )}

                                        {/* Ngày đề nghị -  DateSugget */}
                                        {DateSugget.visibleConfig && DateSugget.visible && (
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={DateSugget.label}
                                                    />

                                                    {/* valid DateSugget */}
                                                    {fieldValid.DateSugget && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrDate
                                                        disable={DateSugget.disable}
                                                        type={'date'}
                                                        format={'DD/MM/YYYY'}
                                                        value={DateSugget.value}
                                                        refresh={DateSugget.refresh}
                                                        onFinish={(value) =>
                                                            this.setState({
                                                                DateSugget: {
                                                                    ...DateSugget,
                                                                    value: value,
                                                                    refresh: !DateSugget.refresh
                                                                }
                                                            })
                                                        }
                                                    />
                                                </View>
                                            </View>
                                        )}

                                        {/* Người duyệt đầu - UserApproveID*/}
                                        {UserApproveID.visibleConfig && UserApproveID.visible && (
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={UserApproveID.label}
                                                    />

                                                    {/* valid UserApproveID */}
                                                    {fieldValid.UserApproveID && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrPicker
                                                        api={{
                                                            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_WORKHISTORYSALARY',
                                                            type: 'E_GET'
                                                        }}
                                                        refresh={UserApproveID.refresh}
                                                        textField="UserInfoName"
                                                        valueField="ID"
                                                        filter={true}
                                                        value={UserApproveID.value}
                                                        filterServer={true}
                                                        filterParams="text"
                                                        disable={UserApproveID.disable}
                                                        onFinish={(item) => this.onChangeUserApproveID(item)}
                                                    />
                                                </View>
                                            </View>
                                        )}

                                        {/* Người duyệt kế tiếp - UserApproveID3*/}
                                        {UserApproveID2.visibleConfig && UserApproveID2.visible && (
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={UserApproveID2.label}
                                                    />

                                                    {/* valid UserApproveID2 */}
                                                    {fieldValid.UserApproveID2 && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrPicker
                                                        api={{
                                                            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_WORKHISTORYSALARY',
                                                            type: 'E_GET'
                                                        }}
                                                        refresh={UserApproveID2.refresh}
                                                        textField="UserInfoName"
                                                        valueField="ID"
                                                        filter={true}
                                                        filterServer={true}
                                                        value={UserApproveID2.value}
                                                        filterParams="text"
                                                        disable={UserApproveID2.disable}
                                                        onFinish={(item) => {
                                                            this.setState({
                                                                UserApproveID2: {
                                                                    ...UserApproveID2,
                                                                    value: item,
                                                                    refresh: !UserApproveID2.refresh
                                                                }
                                                            });
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                        )}

                                        {/* Người duyệt tiếp theo - UserApproveID4*/}
                                        {UserApproveID3.visibleConfig && UserApproveID3.visible && (
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={UserApproveID3.label}
                                                    />

                                                    {/* valid UserApproveID3 */}
                                                    {fieldValid.UserApproveID3 && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrPicker
                                                        api={{
                                                            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_WORKHISTORYSALARY',
                                                            type: 'E_GET'
                                                        }}
                                                        value={UserApproveID3.value}
                                                        refresh={UserApproveID3.refresh}
                                                        textField="UserInfoName"
                                                        valueField="ID"
                                                        filter={true}
                                                        filterServer={true}
                                                        filterParams="text"
                                                        disable={UserApproveID3.disable}
                                                        onFinish={(item) => {
                                                            this.setState({
                                                                UserApproveID3: {
                                                                    ...UserApproveID3,
                                                                    value: item,
                                                                    refresh: !UserApproveID3.refresh
                                                                }
                                                            });
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                        )}

                                        {/* Người duyệt cuối - UserApproveID2 */}
                                        {UserApproveID4.visibleConfig && UserApproveID4.visible && (
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={UserApproveID4.label}
                                                    />

                                                    {/* valid UserApproveID4 */}
                                                    {fieldValid.UserApproveID4 && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrPicker
                                                        api={{
                                                            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_WORKHISTORYSALARY',
                                                            type: 'E_GET'
                                                        }}
                                                        value={UserApproveID4.value}
                                                        refresh={UserApproveID4.refresh}
                                                        textField="UserInfoName"
                                                        valueField="ID"
                                                        filter={true}
                                                        filterServer={true}
                                                        filterParams="text"
                                                        disable={UserApproveID4.disable}
                                                        onFinish={(item) => this.onChangeUserApproveID4(item)}
                                                    />
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                )}

                                <View
                                    style={contentViewControl}
                                    onLayout={(event) => (this.layoutViewInfoMore = event.nativeEvent.layout)}
                                >
                                    <TouchableOpacity
                                        style={viewBtnShowHideUser}
                                        onPress={() =>
                                            this.setState(
                                                {
                                                    InfoApprove: {
                                                        ...InfoApprove,
                                                        isShowInfoAdvance: !isShowInfoAdvance
                                                    }
                                                },
                                                () => {
                                                    // setTimeout(() => {
                                                    //   this.layoutViewInfoMore !== null && this.scrollViewRef.scrollToPosition(0, this.layoutViewInfoMore.y + 1000);
                                                    // }, 0);
                                                }
                                            )
                                        }
                                    >
                                        {isShowInfoAdvance ? (
                                            <IconUp size={Size.iconSize - 3} color={Colors.primary} />
                                        ) : (
                                            <IconDown size={Size.iconSize - 3} color={Colors.primary} />
                                        )}
                                        <VnrText
                                            style={[styleSheets.lable, viewBtnShowHideUser_text]}
                                            i18nKey={
                                                isShowInfoAdvance
                                                    ? 'HRM_PortalApp_Colspan_Info'
                                                    : 'HRM_Detail_Approve_Info_Common'
                                            }
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {/*  Tạo mới lương ca bản - IsCreateBasicSalary */}
                        <View style={styles.styViewAllMore}>
                            {IsCreateBasicSalary.value && (
                                <View>
                                    {/* Ngày hiệu lực - DateOfEffect */}
                                    {DateOfEffect.visibleConfig && DateOfEffect.visible && (
                                        <View style={contentViewControl}>
                                            <View style={viewLable}>
                                                <VnrText
                                                    style={[styleSheets.text, textLableInfo]}
                                                    i18nKey={DateOfEffect.label}
                                                />

                                                {/* valid DateOfEffect */}
                                                {fieldValid.DateOfEffect && (
                                                    <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                )}
                                            </View>
                                            <View style={viewControl}>
                                                <VnrDate
                                                    disable={DateOfEffect.disable}
                                                    format={'DD/MM/YYYY'}
                                                    value={DateOfEffect.value}
                                                    refresh={DateOfEffect.refresh}
                                                    type={'date'}
                                                    onFinish={(value) =>
                                                        this.setState({
                                                            DateEffective: {
                                                                ...DateOfEffect,
                                                                value: value,
                                                                refresh: !DateOfEffect.refresh
                                                            }
                                                        })
                                                    }
                                                />
                                            </View>
                                        </View>
                                    )}

                                    {/* Lương cơ bản - GrossAmountMoneySalary */}
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={GrossAmountMoneySalary.label}
                                            />

                                            {/* valid GrossAmountMoneySalary */}
                                            {fieldValid.GrossAmountMoneySalary && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <View style={formDate_To_From}>
                                                <View style={[controlDate_from, CustomStyleSheet.flex(5)]}>
                                                    <VnrTextInput
                                                        value={GrossAmountMoneySalary.value}
                                                        refresh={GrossAmountMoneySalary.refresh}
                                                        disable={GrossAmountMoneySalary.disable}
                                                        keyboardType={'numeric'}
                                                        charType={'money'}
                                                        returnKeyType={'done'}
                                                        onChangeText={(value) => {
                                                            this.setState({
                                                                GrossAmountMoneySalary: {
                                                                    ...GrossAmountMoneySalary,
                                                                    value,
                                                                    refresh: !GrossAmountMoneySalary.refresh
                                                                }
                                                            });
                                                        }}
                                                    />
                                                </View>
                                                <View style={[controlDate_To, CustomStyleSheet.flex(5)]}>
                                                    <VnrPickerQuickly
                                                        dataLocal={CurrencyIDSalary.data}
                                                        refresh={CurrencyIDSalary.refresh}
                                                        textField={'CurrencyName'}
                                                        valueField={'ID'}
                                                        filter={true}
                                                        value={CurrencyIDSalary.value}
                                                        filterServer={false}
                                                        autoFilter={true}
                                                        disable={CurrencyIDSalary.disable}
                                                        onFinish={(item) =>
                                                            this.setState({
                                                                CurrencyIDSalary: {
                                                                    ...CurrencyIDSalary,
                                                                    value: item,
                                                                    refresh: !CurrencyIDSalary.refresh
                                                                }
                                                            })
                                                        }
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    {/* Lương đóng BHXH - InsuranceAmountSalary */}
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={InsuranceAmountSalary.label}
                                            />

                                            {/* valid InsuranceAmountSalary */}
                                            {fieldValid.InsuranceAmountSalary && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <View style={formDate_To_From}>
                                                <View style={[controlDate_from, CustomStyleSheet.flex(5)]}>
                                                    <VnrTextInput
                                                        value={InsuranceAmountSalary.value}
                                                        refresh={InsuranceAmountSalary.refresh}
                                                        disable={InsuranceAmountSalary.disable}
                                                        keyboardType={'numeric'}
                                                        charType={'money'}
                                                        returnKeyType={'done'}
                                                        onChangeText={(value) => {
                                                            this.setState({
                                                                InsuranceAmountSalary: {
                                                                    ...InsuranceAmountSalary,
                                                                    value,
                                                                    refresh: !InsuranceAmountSalary.refresh
                                                                }
                                                            });
                                                        }}
                                                    />
                                                </View>
                                                <View style={[controlDate_To, CustomStyleSheet.flex(5)]}>
                                                    <VnrPickerQuickly
                                                        dataLocal={CurrencyInsID.data}
                                                        refresh={CurrencyInsID.refresh}
                                                        textField={'CurrencyName'}
                                                        valueField={'ID'}
                                                        filter={true}
                                                        value={CurrencyInsID.value}
                                                        filterServer={false}
                                                        autoFilter={true}
                                                        disable={CurrencyInsID.disable}
                                                        onFinish={(item) =>
                                                            this.setState({
                                                                CurrencyInsID: {
                                                                    ...CurrencyInsID,
                                                                    value: item,
                                                                    refresh: !CurrencyInsID.refresh
                                                                }
                                                            })
                                                        }
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    {/* Tổng lương -  AmountTotalSalary*/}
                                    {AmountTotalSalary.visibleConfig && AmountTotalSalary.visible && (
                                        <View style={contentViewControl}>
                                            <View style={viewLable}>
                                                <VnrText
                                                    style={[styleSheets.text, textLableInfo]}
                                                    i18nKey={AmountTotalSalary.label}
                                                />
                                                {fieldValid.AmountTotalSalary && (
                                                    <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                )}
                                            </View>
                                            <View style={viewControl}>
                                                <VnrTextInput
                                                    value={AmountTotalSalary.value}
                                                    refresh={AmountTotalSalary.refresh}
                                                    disable={AmountTotalSalary.disable}
                                                    keyboardType={'numeric'}
                                                    charType={'money'}
                                                    returnKeyType={'done'}
                                                    onChangeText={(value) => {
                                                        this.setState({
                                                            AmountTotalSalary: {
                                                                ...AmountTotalSalary,
                                                                value,
                                                                refresh: !AmountTotalSalary.refresh
                                                            }
                                                        });
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    )}

                                    {/* Ghi chú -  NoteSalary*/}
                                    {NoteSalary.visibleConfig && NoteSalary.visible && (
                                        <View style={contentViewControl}>
                                            <View style={viewLable}>
                                                <VnrText
                                                    style={[styleSheets.text, textLableInfo]}
                                                    i18nKey={NoteSalary.label}
                                                />
                                                {fieldValid.NoteSalary && (
                                                    <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                )}
                                            </View>
                                            <View style={viewControl}>
                                                <VnrTextInput
                                                    disable={NoteSalary.disable}
                                                    refresh={NoteSalary.refresh}
                                                    value={NoteSalary.value}
                                                    style={[styleSheets.text, viewInputMultiline]}
                                                    multiline={true}
                                                    onChangeText={(text) =>
                                                        this.setState({
                                                            NoteSalary: {
                                                                ...NoteSalary,
                                                                value: text
                                                            }
                                                        })
                                                    }
                                                />
                                            </View>
                                        </View>
                                    )}

                                    {this.renderAllowanceType(AllowanceType)}
                                </View>
                            )}

                            <View
                                style={contentViewControl}
                                onLayout={(event) => (this.layoutViewInfoMore = event.nativeEvent.layout)}
                            >
                                <TouchableOpacity
                                    style={viewBtnShowHideUser}
                                    onPress={() =>
                                        this.setState(
                                            {
                                                IsCreateBasicSalary: {
                                                    ...IsCreateBasicSalary,
                                                    value: ProfileID.value != null ? !IsCreateBasicSalary.value : false
                                                }
                                            },
                                            () => {
                                                this.getReloadbyConfigFormula();
                                                // setTimeout(() => {
                                                //   this.layoutViewInfoMore !== null && this.scrollViewRef.scrollToPosition(0, this.layoutViewInfoMore.y + 1000);
                                                // }, 0);
                                            }
                                        )
                                    }
                                >
                                    {IsCreateBasicSalary.value ? (
                                        <IconCheckSquare size={Size.iconSize - 3} color={Colors.primary} />
                                    ) : (
                                        <IconUnCheckSquare size={Size.iconSize - 3} color={Colors.primary} />
                                    )}
                                    <VnrText
                                        style={[styleSheets.lable, viewBtnShowHideUser_text]}
                                        i18nKey={'IsCreateBasicSalary'}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>

                    <ListButtonSave listActions={listActions} />

                    {modalErrorDetail.isModalVisible && (
                        <Modal
                            onBackButtonPress={() => this.closeModalErrorDetail()}
                            isVisible={true}
                            onBackdropPress={() => this.closeModalErrorDetail()}
                            customBackdrop={
                                <TouchableWithoutFeedback onPress={() => this.closeModalErrorDetail()}>
                                    <View
                                        style={stylesScreenDetailV3.modalBackdrop}
                                    />
                                </TouchableWithoutFeedback>
                            }
                            style={CustomStyleSheet.margin(0)}
                        >
                            <View style={stylesModalPopupBottom.viewModal}>
                                <SafeAreaView {...styleSafeAreaView} style={stylesModalPopupBottom.safeRadius}>
                                    <View style={styles.headerCloseModal}>
                                        <IconColse color={Colors.white} size={Size.iconSize} />
                                        <VnrText
                                            style={styleSheets.lable}
                                            i18nKey={'HRM_Attendance_Message_ViolationNotification'}
                                        />
                                        <TouchableOpacity onPress={() => this.closeModalErrorDetail()}>
                                            <IconColse color={Colors.grey} size={Size.iconSize} />
                                        </TouchableOpacity>
                                    </View>
                                    <ScrollView style={styleSheets.flexGrow1flexDirectionColumn}>
                                        {this.renderErrorDetail()}
                                    </ScrollView>
                                    <View style={styles.groupButton}>
                                        <TouchableOpacity
                                            onPress={() => this.closeModalErrorDetail()}
                                            style={styles.btnClose}
                                        >
                                            <VnrText
                                                style={[styleSheets.lable, { color: Colors.white }]}
                                                i18nKey={'HRM_Common_Close'}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </SafeAreaView>
                            </View>
                        </Modal>
                    )}
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    stykeyBoard: { flexGrow: 1, paddingTop: 10 },
    headerCloseModal: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    groupButton: {
        flexGrow: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: styleSheets.p_10,
        backgroundColor: Colors.white,
        marginTop: 10,
        marginBottom: 10
    },
    btnClose: {
        height: Size.heightButton,
        backgroundColor: Colors.red,
        borderRadius: styleSheets.radius_5,
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5
    },

    // Show hide Approve
    styViewAllMore: {
        backgroundColor: Colors.gray_2,
        paddingVertical: Size.defineSpace
    }
});
