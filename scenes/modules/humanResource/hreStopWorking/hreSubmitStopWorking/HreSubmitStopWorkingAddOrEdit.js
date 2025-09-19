import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    Colors,
    styleSafeAreaView,
    stylesListPickerControl,
    styleValid,
    styleButtonAddOrEdit,
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
import { EnumName } from '../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import DrawerServices from '../../../../../utils/DrawerServices';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';

let enumName = null,
    profileInfo = null;

export default class HreSubmitStopWorkingAddOrEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ID: null,
            Profile: {
                ID: null,
                ProfileName: '',
                disable: true
            },
            TypeOfStopID: {
                data: [],
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            ResignReasonID: {
                data: [],
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            OtherReason: {
                disable: false,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: true
            },
            RequestDate: {
                value: null,
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            DateQuitSubmit: {
                value: null,
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            LastWorkingDay: {
                value: null,
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            DateStop: {
                value: new Date(),
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            NumberDayQuitJob: {
                visible: true,
                visibleConfig: true,
                disable: true,
                refresh: false,
                value: null
            },
            FileAttach: {
                visible: true,
                visibleConfig: true,
                disable: false,
                refresh: false,
                value: null
            },
            Note: {
                disable: false,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: true
            },
            AnnualLeave: {
                visible: false,
                value: null,
                visibleConfig: true
            },
            UserApproveID: {
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            UserApproveID2: {
                disable: false,
                refresh: false,
                value: null,
                visible: false,
                visibleConfig: true
            },
            UserApproveID3: {
                disable: false,
                refresh: false,
                value: null,
                visible: false,
                visibleConfig: true
            },
            UserApproveID4: {
                disable: false,
                visible: true,
                refresh: false,
                visibleConfig: true,
                value: null
            },
            fieldValid: {},
            DateQuitApprove: {
                value: null,
                refresh: false,
                disable: false,
                visible: true,
                visibleConfig: true
            },
            DateQuitSign: {
                value: null,
                refresh: false,
                disable: false,
                visible: true,
                visibleConfig: true
            },
            PaymentDay: {
                value: null,
                refresh: false,
                disable: false,
                visible: true,
                visibleConfig: true
            },
            SocialInsDeliveryDate: {
                value: null,
                refresh: false,
                disable: false,
                visible: true,
                visibleConfig: true
            },
            DecisionNo: {
                disable: true,
                value: '',
                refresh: false,
                visible: true,
                visibleConfig: true
            },
            IsBlackList: {
                value: null,
                visible: true,
                visibleConfig: true,
                disable: false
            },
            ReasonBackList: {
                disable: false,
                value: '',
                refresh: false,
                visible: true,
                visibleConfig: true
            },
            DateHire: {
                value: null,
                refresh: false,
                disable: false,
                visible: true,
                visibleConfig: true
            },
            DeptPath: {
                disable: true,
                value: '',
                refresh: false,
                visible: true,
                visibleConfig: true
            },
            ContractTypeName: {
                disable: true,
                value: '',
                refresh: false,
                visible: true,
                visibleConfig: true
            },
            DateStart: {
                value: null,
                refresh: false,
                visible: true,
                visibleConfig: true,
                disable: false
            },
            DateEnd: {
                value: null,
                refresh: false,
                disable: false,
                visible: true,
                visibleConfig: true
            },
            StoredDocumentCodes: {
                data: [],
                disable: false,
                value: null,
                refresh: false,
                visible: true,
                visibleConfig: true
            },
            DateEndUnion: {
                value: null,
                refresh: false,
                disable: false,
                visible: true,
                visibleConfig: true
            },
            DateChildEnough1Year: {
                value: null,
                refresh: false,
                disable: false,
                visible: false,
                visibleConfig: true
            }
        };

        //set title screen
        props.navigation.setParams({
            title:
                props.navigation.state.params && props.navigation.state.params.record
                    ? 'HRM_HR_StopWorking_Edit'
                    : 'HRM_HR_StopWorking_AddNew'
        });

        //biến trạng thái
        this.isModify = false;
        this.checkConfig = null;
        this.isOnlyOneLevelApprove = false;
        this.levelApproved = null;
        this.UpdateRequiredDocumentStopWorking = null;
        this.stopWorkingID = null;
        this.ContractTypeID = null;
    }

    //#region [khởi tạo - check đăng ký hộ, lấy các dữ liệu cho control, lấy giá trọ mặc đinh]

    //promise get config valid
    getConfigValid = (tblName) => {
        return HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + tblName);
    };

    componentDidMount() {
        //get config validate
        VnrLoadingSevices.show();
        this.getConfigValid('Hre_StopWorking').then((res) => {
            if (res) {
                try {
                    //map field hidden by config
                    const _configField =
                        ConfigField && ConfigField.value['HreSubmitStopWorkingAddOrEdit']
                            ? ConfigField.value['HreSubmitStopWorkingAddOrEdit']['Hidden']
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
                            this.getRecordAndConfigByID(record, this.handleSetState);
                        }
                    });
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            }
        });
    }

    initData = (record) => {
        //sửa
        if (this.isModify) {
            this.isModify = true;
            this.getRecordAndConfigByID(record, this.handleSetState);
        } else {
            const { E_ProfileID, E_FullName } = enumName,
                _profile = { ID: profileInfo[E_ProfileID], ProfileName: profileInfo[E_FullName] };
            this.setState({ Profile: _profile }, () => {
                this.getConfig(_profile);
            });
        }
    };

    getConfig = (_profile) => {
        //get dataSource, config value default
        this.getMultiDataSource();

        //config user approve
        this.getUserApprove();

        //config textDataLink
        this.GetTalentCommitmentByStopWorking(_profile);
    };

    //get dataSource, config value default
    getMultiDataSource = () => {
        VnrLoadingSevices.show();

        HttpService.MultiRequest([
            HttpService.Get('[URI_HR]/Cat_GetData/GetMultiTypeOfStop'),
            HttpService.Get('[URI_HR]/Cat_GetData/GetMultiResignReasonPortalApp'),
            HttpService.Get('[URI_HR]/Cat_GetData/GetMultiReqDocumentQuit'),
            HttpService.Post('[URI_HR]/Hre_GetDataV2/getvalueDefaultCombineStopWorking', {
                tableName: 'Hre_StopWorking',
                fieldName: 'TypeOfStopID'
            })
        ]).then((resAll) => {
            VnrLoadingSevices.hide();
            try {
                if (resAll && Array.isArray(resAll) && resAll.length > 0) {
                    const [dataTypeOfStop, dataResignReason, dataReqDocumentQuit, valueDefaultTypeOfStopID] = resAll,
                        { TypeOfStopID, ResignReasonID, StoredDocumentCodes } = this.state;

                    this.setState(
                        {
                            TypeOfStopID: {
                                ...TypeOfStopID,
                                // task: Nhan.Nguyen 0167692: [Hotfix source LTG_v8.11.21.01.11] apply giá trị mặc định loại nghỉ việc vào mh đăng ký nghỉ việc trên app
                                value: valueDefaultTypeOfStopID?.DefaultValue?.ValueID
                                    ? {
                                        ID: valueDefaultTypeOfStopID.DefaultValue.ValueID,
                                        NameEntityName: valueDefaultTypeOfStopID.DefaultValue.DefaultValue
                                    }
                                    : null,
                                data: dataTypeOfStop ? [...dataTypeOfStop] : [],
                                refresh: !TypeOfStopID.refresh
                            },
                            ResignReasonID: {
                                ...ResignReasonID,
                                data: dataResignReason ? [...dataResignReason] : [],
                                refresh: !ResignReasonID.refresh
                            },
                            StoredDocumentCodes: {
                                ...StoredDocumentCodes,
                                data: dataReqDocumentQuit ? [...dataReqDocumentQuit] : [],
                                refresh: !StoredDocumentCodes.refresh
                            }
                        },
                        () => {
                            this.GetDefaultValue();
                        }
                    );
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    //config value default
    GetDefaultValue = () => {
        const { Profile, DateStop } = this.state,
            profileID = Profile.ID,
            dateStopVal = DateStop.value ? moment(DateStop.value).format('YYYY-MM-DD 00:00:00') : null,
            requestDate = DateStop.value ? moment(DateStop.value).format('YYYY-MM-DD 00:00:00') : null;

        HttpService.MultiRequest([
            HttpService.Get('[URI_HR]/Hre_GetData/GetConfigLoadRegisterDateStop'),
            HttpService.Get('[URI_HR]/Hre_GetDataV2/GetDefaultValue_SubmitStopWorking'),
            HttpService.Post('[URI_HR]/Hre_GetData/GetPrenatalForCreateStopWorking', {
                ProfileID: profileID,
                dateStop: dateStopVal
            }),
            HttpService.Post('[URI_HR]/Hre_GetData/GetDataViewStop', {
                ProfileID: profileID,
                dateStop: dateStopVal,
                requestDate: requestDate
            })
        ]).then((resAll) => {
            VnrLoadingSevices.hide();
            try {
                if (resAll) {
                    let nextState = {};
                    const [configRequestDate, defaultValue, prenatal, dataViewStop] = resAll,
                        {
                            DateHire,
                            DateStart,
                            DateEnd,
                            DateChildEnough1Year,
                            AnnualLeave,
                            RequestDate,
                            DateQuitSign,
                            DeptPath,
                            ContractTypeName,
                            NumberDayQuitJob,
                            DateQuitSubmit,
                            DateEndUnion,
                            DateQuitApprove
                        } = this.state;

                    //#region [config by RequestDate]
                    if (configRequestDate) {
                        let strConfig = configRequestDate.replace(/"/g, '');
                        this.checkConfig = strConfig;
                        if (strConfig == 'E_REQUESTDATE') {
                            nextState = {
                                ...nextState,
                                RequestDate: {
                                    ...RequestDate,
                                    value: new Date(),
                                    refresh: !RequestDate.refresh
                                }
                            };
                        }

                        if (strConfig == 'E_DATESTOP') {
                            nextState = {
                                ...nextState,
                                RequestDate: {
                                    ...RequestDate,
                                    value: null,
                                    refresh: !RequestDate.refresh
                                },
                                DateQuitSign: {
                                    ...DateQuitSign,
                                    value: new Date(),
                                    refresh: !DateQuitSign.refresh
                                }
                            };
                        }
                    } else {
                        nextState = {
                            ...nextState,
                            RequestDate: {
                                ...RequestDate,
                                value: new Date(),
                                refresh: !RequestDate.refresh
                            }
                        };
                    }
                    //#endregion

                    //#region [config by defaultValue]
                    if (defaultValue) {
                        const { TypeOfStopID, ResignReasonID, StoredDocumentCodes } = this.state;

                        if (defaultValue.TypeOfStopID) {
                            const findItem = TypeOfStopID.data.find((item) => item.ID == defaultValue.TypeOfStopID);
                            if (findItem) {
                                nextState = {
                                    ...nextState,
                                    TypeOfStopID: {
                                        ...TypeOfStopID,
                                        value: { ...findItem },
                                        refresh: !TypeOfStopID.refresh
                                    }
                                };
                            }
                        }

                        if (defaultValue.ResignReasonID) {
                            const findItem = TypeOfStopID.data.find((item) => item.ID == defaultValue.ResignReasonID);
                            if (findItem) {
                                nextState = {
                                    ...nextState,
                                    ResignReasonID: {
                                        ...ResignReasonID,
                                        value: { ...findItem },
                                        refresh: !ResignReasonID.refresh
                                    }
                                };
                            }
                        }

                        if (defaultValue.StoredDocuments) {
                            let _StoredDocumentCodes = defaultValue.StoredDocuments.split(',');

                            const filterItem = _StoredDocumentCodes.map((item) => {
                                return StoredDocumentCodes.defaultValue.find(item.Code == item.Code);
                            });

                            if (filterItem.length) {
                                nextState = {
                                    ...nextState,
                                    StoredDocumentCodes: {
                                        ...StoredDocumentCodes,
                                        value: [...filterItem],
                                        refresh: !StoredDocumentCodes.refresh
                                    }
                                };
                            }
                        }
                    }

                    this.UpdateRequiredDocumentStopWorking = 'False';

                    nextState = {
                        ...nextState,
                        DateHire: {
                            ...DateHire,
                            disable: true,
                            refresh: !DateHire.refresh
                        },
                        DateStart: {
                            ...DateStart,
                            disable: true,
                            refresh: !DateStart.refresh
                        },
                        DateEnd: {
                            ...DateEnd,
                            disable: true,
                            refresh: !DateEnd.refresh
                        },
                        DateChildEnough1Year: {
                            ...DateChildEnough1Year,
                            disable: true,
                            refresh: !DateChildEnough1Year.refresh
                        }
                    };

                    //check quyền Xem phép năm còn lại
                    if (
                        PermissionForAppMobile &&
                        PermissionForAppMobile.value['Hre_StopWorking_Create_BtnCheckData'] &&
                        PermissionForAppMobile.value['Hre_StopWorking_Create_BtnCheckData']['View']
                    ) {
                        nextState = {
                            ...nextState,
                            AnnualLeave: {
                                ...AnnualLeave,
                                visible: true,
                                refresh: !AnnualLeave.refresh
                            }
                        };
                    } else {
                        nextState = {
                            ...nextState,
                            AnnualLeave: {
                                ...AnnualLeave,
                                visible: false,
                                refresh: !AnnualLeave.refresh
                            }
                        };
                    }
                    //#endregion

                    //#region [config by prenatal]
                    if (prenatal && prenatal.DateChildEnough1Year) {
                        nextState = {
                            ...nextState,
                            DateChildEnough1Year: {
                                ...nextState.DateChildEnough1Year,
                                visible: true,
                                value: prenatal.DateChildEnough1Year
                            }
                        };
                    } else {
                        nextState = {
                            ...nextState,
                            DateChildEnough1Year: {
                                ...nextState.DateChildEnough1Year,
                                visible: false
                            }
                        };
                    }
                    //#endregion

                    //#region [config by dataViewStop]
                    if (dataViewStop) {
                        this.ContractTypeID = dataViewStop.ContractTypeID;

                        nextState = {
                            ...nextState,
                            DateHire: {
                                ...DateHire,
                                value: dataViewStop.DateHire,
                                refresh: !DateHire.refresh
                            },
                            DateStart: {
                                ...DateStart,
                                value: dataViewStop.DateStart,
                                refresh: !DateStart.refresh
                            },
                            DateEnd: {
                                ...DateEnd,
                                value: dataViewStop.DateEnd,
                                refresh: !DateEnd.refresh
                            },
                            DeptPath: {
                                ...DeptPath,
                                value: dataViewStop.OrgStructureName,
                                refresh: !DeptPath.refresh
                            },
                            ContractTypeName: {
                                ...ContractTypeName,
                                value: dataViewStop.ContractTypeName,
                                refresh: !ContractTypeName.refresh
                            },
                            NumberDayQuitJob: {
                                ...NumberDayQuitJob,
                                value:
                                    dataViewStop.NumberDayQuitJob !== '' && dataViewStop.NumberDayQuitJob != null
                                        ? dataViewStop.NumberDayQuitJob.toString()
                                        : null,
                                refresh: !NumberDayQuitJob.refresh
                            },
                            DateEndUnion: {
                                ...DateEndUnion,
                                value: dataViewStop.TradeUnionistEndDate,
                                refresh: !DateEndUnion.refresh
                            }
                        };

                        if (dataViewStop.IsLoadResignInfoByDateStop == 'E_DATESTOP') {
                            //_RequestDate.value(data.RequestDate);
                            nextState = {
                                ...nextState,
                                RequestDate: {
                                    ...RequestDate,
                                    value: dataViewStop.RequestDate,
                                    refresh: !RequestDate.refresh
                                }
                            };
                            if (dataViewStop.DateQuitSubmit) {
                                //_DateQuitSubmit.value(data.RequestDate);
                                nextState = {
                                    ...nextState,
                                    DateQuitSubmit: {
                                        ...DateQuitSubmit,
                                        value: dataViewStop.RequestDate,
                                        refresh: !DateQuitSubmit.refresh
                                    }
                                };
                            } else {
                                //_DateQuitSubmit.value(data.RequestDate);
                                nextState = {
                                    ...nextState,
                                    DateQuitSubmit: {
                                        ...DateQuitSubmit,
                                        value: dataViewStop.RequestDate,
                                        refresh: !DateQuitSubmit.refresh
                                    }
                                };
                            }
                            //_DateQuitSign.value(_DateStop.value());
                            nextState = {
                                ...nextState,
                                DateQuitSign: {
                                    ...DateQuitSign,
                                    value: DateStop.value,
                                    refresh: !DateQuitSign.refresh
                                }
                            };
                        }
                        //Son.Vo - 20190831 - 0107743 - đọc cấu hình load
                        else if (
                            dataViewStop.IsLoadResignInfoByDateStop == 'E_REQUESTDATE' ||
                            !dataViewStop.IsLoadResignInfoByDateStop
                        ) {
                            // _DateStop.value(data.DateQuitSubmit);
                            // _DateQuitSign.value(data.DateQuitSubmit);
                            // _DateQuitApprove.value(data.DateQuitSubmit);
                            // _DateQuitSubmit.value(_RequestDate.value());
                            nextState = {
                                ...nextState,
                                DateStop: {
                                    ...DateStop,
                                    value: dataViewStop.DateQuitSubmit,
                                    refresh: !DateStop.refresh
                                },
                                DateQuitSign: {
                                    ...DateQuitSign,
                                    value: dataViewStop.DateQuitSubmit,
                                    refresh: !DateQuitSign.refresh
                                },
                                DateQuitApprove: {
                                    ...DateQuitApprove,
                                    value: dataViewStop.DateQuitSubmit,
                                    refresh: !DateQuitApprove.refresh
                                },
                                DateQuitSubmit: {
                                    ...DateQuitSubmit,
                                    value:
                                        nextState.RequestDate && nextState.RequestDate.value
                                            ? nextState.RequestDate.value
                                            : null,
                                    refresh: !DateQuitSubmit.refresh
                                }
                            };
                        }
                    }
                    //#endregion

                    //set state
                    this.setState(nextState);
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    // GetDefaultValue = () => {
    //   const { Profile, DateStop } = this.state,
    //     profileID = Profile.ID,
    //     dateStopVal = DateStop.value ? moment(DateStop.value).format('YYYY-MM-DD HH:mm:ss') : null;

    //   HttpService.MultiRequest([
    //     HttpService.Get('[URI_HR]/Hre_GetData/GetConfigLoadRegisterDateStop'),
    //     HttpService.Get('[URI_HR]/Hre_GetDataV2/GetDefaultValue_SubmitStopWorking'),
    //     HttpService.Post('[URI_HR]/Hre_GetData/GetPrenatalForCreateStopWorking',
    //       { ProfileID: profileID, dateStop: dateStopVal }),
    //     HttpService.Post('[URI_HR]/Hre_GetData/GetDataViewStop',
    //       { ProfileID: profileID, dateStop: dateStopVal })
    //   ])
    //     .then(resAll => {

    //       VnrLoadingSevices.hide();
    //       try {
    //         if (resAll) {

    //           let nextState = {};
    //           const [configRequestDate, defaultValue, prenatal, dataViewStop] = resAll,
    //             { DateHire, DateStart, DateEnd, DateChildEnough1Year,
    //               AnnualLeave, RequestDate, DateQuitSign,
    //               DeptPath, ContractTypeName, NumberDayQuitJob,
    //               DateQuitSubmit, DateEndUnion, DateQuitApprove } = this.state;

    //           //#region [config by RequestDate]
    //           if (configRequestDate) {
    //             let strConfig = configRequestDate.replace(/"/g, '');
    //             this.checkConfig = strConfig;

    //             if (strConfig == 'E_REQUESTDATE' || strConfig == 'E_REQUESTDATE') {
    //               nextState = {
    //                 ...nextState,
    //                 RequestDate: {
    //                   ...RequestDate,
    //                   value: new Date(),
    //                   refresh: !RequestDate.refresh
    //                 }
    //               }
    //             }

    //             if (strConfig == 'E_DATESTOP') {
    //               nextState = {
    //                 ...nextState,
    //                 RequestDate: {
    //                   ...RequestDate,
    //                   value: null,
    //                   refresh: !RequestDate.refresh
    //                 },
    //                 DateQuitSign: {
    //                   ...DateQuitSign,
    //                   value: new Date(),
    //                   refresh: !DateQuitSign.refresh
    //                 }
    //               }
    //             }
    //           }
    //           else {
    //             nextState = {
    //               ...nextState,
    //               RequestDate: {
    //                 ...RequestDate,
    //                 value: new Date(),
    //                 refresh: !RequestDate.refresh
    //               }
    //             }
    //           }
    //           //#endregion

    //           //#region [config by defaultValue]
    //           if (defaultValue) {
    //             const { TypeOfStopID, ResignReasonID, StoredDocumentCodes } = this.state;

    //             if (defaultValue.TypeOfStopID) {
    //               const findItem = TypeOfStopID.data ? TypeOfStopID.data.find(item => item.ID == defaultValue.TypeOfStopID) : null;

    //               if (findItem) {
    //                 nextState = {
    //                   ...nextState,
    //                   TypeOfStopID: {
    //                     ...TypeOfStopID,
    //                     value: { ...findItem },
    //                     refresh: !TypeOfStopID.refresh
    //                   }
    //                 }
    //               }
    //             }

    //             if (defaultValue.ResignReasonID) {
    //               const findItem = ResignReasonID.data ? ResignReasonID.data.find(item => item.ID == defaultValue.ResignReasonID) : null;
    //               if (findItem) {
    //                 nextState = {
    //                   ...nextState,
    //                   ResignReasonID: {
    //                     ...ResignReasonID,
    //                     value: { ...findItem },
    //                     refresh: !ResignReasonID.refresh
    //                   }
    //                 }
    //               }
    //             }

    //             if (defaultValue.StoredDocuments) {
    //               let _StoredDocumentCodes = defaultValue.StoredDocuments.split(',');

    //               const filterItem = _StoredDocumentCodes.map(item => {
    //                 return StoredDocumentCodes.defaultValue.find(item1.Code == item.Code);
    //               });

    //               if (filterItem.length) {
    //                 nextState = {
    //                   ...nextState,
    //                   StoredDocumentCodes: {
    //                     ...StoredDocumentCodes,
    //                     value: [...filterItem],
    //                     refresh: !StoredDocumentCodes.refresh
    //                   }
    //                 }
    //               }
    //             }
    //           }

    //           this.UpdateRequiredDocumentStopWorking = 'False';

    //           nextState = {
    //             ...nextState,
    //             DateHire: {
    //               ...DateHire,
    //               disable: true,
    //               refresh: !DateHire.refresh
    //             },
    //             DateStart: {
    //               ...DateStart,
    //               disable: true,
    //               refresh: !DateStart.refresh
    //             },
    //             DateEnd: {
    //               ...DateEnd,
    //               disable: true,
    //               refresh: !DateEnd.refresh
    //             },
    //             DateChildEnough1Year: {
    //               ...DateChildEnough1Year,
    //               disable: true,
    //               refresh: !DateChildEnough1Year.refresh
    //             }
    //           }

    //           //check quyền Xem phép năm còn lại
    //           if (PermissionForAppMobile
    //             && PermissionForAppMobile.value['Hre_StopWorking_Create_BtnCheckData']
    //             && PermissionForAppMobile.value['Hre_StopWorking_Create_BtnCheckData']['View']) {
    //             nextState = {
    //               ...nextState,
    //               AnnualLeave: {
    //                 ...AnnualLeave,
    //                 visible: true,
    //                 refresh: !AnnualLeave.refresh
    //               }
    //             }
    //           }
    //           else {
    //             nextState = {
    //               ...nextState,
    //               AnnualLeave: {
    //                 ...AnnualLeave,
    //                 visible: false,
    //                 refresh: !AnnualLeave.refresh
    //               }
    //             }
    //           }
    //           //#endregion

    //           //#region [config by prenatal]
    //           if (prenatal && prenatal.DateChildEnough1Year) {
    //             nextState = {
    //               ...nextState,
    //               DateChildEnough1Year: {
    //                 ...nextState.DateChildEnough1Year,
    //                 visible: true,
    //                 value: prenatal.DateChildEnough1Year
    //               }
    //             }
    //           }
    //           else {
    //             nextState = {
    //               ...nextState,
    //               DateChildEnough1Year: {
    //                 ...nextState.DateChildEnough1Year,
    //                 visible: false
    //               }
    //             }
    //           }
    //           //#endregion

    //           //#region [config by dataViewStop]
    //           if (dataViewStop) {
    //             this.ContractTypeID = dataViewStop.ContractTypeID;

    //             nextState = {
    //               ...nextState,
    //               DateHire: {
    //                 ...DateHire,
    //                 value: dataViewStop.DateHire,
    //                 refresh: !DateHire.refresh
    //               },
    //               DateStart: {
    //                 ...DateStart,
    //                 value: dataViewStop.DateStart,
    //                 refresh: !DateStart.refresh
    //               },
    //               DateEnd: {
    //                 ...DateEnd,
    //                 value: dataViewStop.DateEnd,
    //                 refresh: !DateEnd.refresh
    //               },
    //               DeptPath: {
    //                 ...DeptPath,
    //                 value: dataViewStop.OrgStructureName,
    //                 refresh: !DeptPath.refresh
    //               },
    //               ContractTypeName: {
    //                 ...ContractTypeName,
    //                 value: dataViewStop.ContractTypeName,
    //                 refresh: !ContractTypeName.refresh
    //               },
    //               NumberDayQuitJob: {
    //                 ...NumberDayQuitJob,
    //                 value: dataViewStop.NumberDayQuitJob,
    //                 refresh: !NumberDayQuitJob.refresh
    //               },
    //               DateEndUnion: {
    //                 ...DateEndUnion,
    //                 value: dataViewStop.TradeUnionistEndDate,
    //                 refresh: !DateEndUnion.refresh
    //               }
    //             }

    //             if (dataViewStop.IsLoadResignInfoByDateStop == 'E_DATESTOP') {
    //               nextState = {
    //                 ...nextState,
    //                 RequestDate: {
    //                   ...RequestDate,
    //                   value: dataViewStop.RequestDate,
    //                   refresh: !RequestDate.refresh
    //                 },
    //                 DateQuitSubmit: {
    //                   ...DateQuitSubmit,
    //                   value: dataViewStop.RequestDate,
    //                   refresh: !DateQuitSubmit.refresh
    //                 },
    //                 DateQuitSign: {
    //                   ...DateQuitSign,
    //                   value: DateStop.value,
    //                   refresh: !DateQuitSign.refresh
    //                 }
    //               }
    //             }
    //             else if (dataViewStop.IsLoadResignInfoByDateStop == 'E_REQUESTDATE' || !dataViewStop.IsLoadResignInfoByDateStop) {
    //               nextState = {
    //                 ...nextState,
    //                 DateStop: {
    //                   ...DateStop,
    //                   value: dataViewStop.DateQuitSubmit,
    //                   refresh: !DateStop.refresh
    //                 },
    //                 DateQuitSign: {
    //                   ...DateQuitSign,
    //                   value: dataViewStop.DateQuitSubmit,
    //                   refresh: !DateQuitSign.refresh
    //                 },
    //                 DateQuitApprove: {
    //                   ...DateQuitApprove,
    //                   value: dataViewStop.DateQuitSubmit,
    //                   refresh: !DateQuitApprove.refresh
    //                 },
    //                 DateQuitSubmit: {
    //                   ...DateQuitSubmit,
    //                   value: RequestDate.value,
    //                   refresh: !DateQuitSubmit.refresh
    //                 }
    //               }
    //             }

    //             // if (dataViewStop.IsLoadResignInfoByDateStop == true) {
    //             //   nextState = {
    //             //     ...nextState,
    //             //     RequestDate: {
    //             //       ...RequestDate,
    //             //       value: dataViewStop.RequestDate,
    //             //       refresh: !RequestDate.refresh
    //             //     },
    //             //     DateQuitSubmit: {
    //             //       ...DateQuitSubmit,
    //             //       value: dataViewStop.RequestDate,
    //             //       refresh: !DateQuitSubmit.refresh
    //             //     },
    //             //     DateQuitSign: {
    //             //       ...DateQuitSign,
    //             //       value: DateStop.value,
    //             //       refresh: !DateQuitSign.refresh
    //             //     }
    //             //   }

    //             //   if (data.DateQuitSubmit) {
    //             //     nextState = {
    //             //       ...nextState,
    //             //       DateQuitSubmit: {
    //             //         ...DateQuitSubmit,
    //             //         value: dataViewStop.DateQuitSubmit,
    //             //         refresh: !DateQuitSubmit.refresh
    //             //       }
    //             //     }
    //             //   }
    //             // }
    //           }
    //           //#endregion

    //           //set state
    //           this.setState(nextState);
    //         }
    //       } catch (error) {
    //         DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
    //       }
    //     })
    // }

    //config user approve
    getUserApprove = () => {
        const { UserApproveID, UserApproveID2, UserApproveID3, UserApproveID4, Profile, DateStop, RequestDate } =
                this.state,
            profileID = Profile.ID,
            dateStopVal = DateStop.value ? moment(DateStop.value).format('YYYY-MM-DD HH:mm:ss') : null,
            _RequestDateVal = RequestDate.value ? moment(RequestDate.value).format('YYYY-MM-DD HH:mm:ss') : null;

        HttpService.Post('[URI_HR]/Hre_GetData/GetUserApproveWithType', {
            userSubmit: profileID,
            profileID: profileID,
            Type: 'E_STOPWORKING',
            datestop: dateStopVal,
            RequestDate: _RequestDateVal
        }).then((result) => {
            VnrLoadingSevices.hide();

            try {
                if (result != null) {
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
                        if (result.LevelApprove == 1) {
                            if (result.SupervisorID != null) {
                                nextState = {
                                    ...nextState,
                                    UserApproveID: {
                                        ...nextState.UserApproveID,
                                        value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID },
                                        disable: true,
                                        refresh: !UserApproveID.refresh
                                    },
                                    UserApproveID2: {
                                        ...nextState.UserApproveID2,
                                        value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID },
                                        refresh: !UserApproveID2.refresh
                                    },
                                    UserApproveID3: {
                                        ...nextState.UserApproveID3,
                                        value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID },
                                        refresh: !UserApproveID3.refresh
                                    },
                                    UserApproveID4: {
                                        ...nextState.UserApproveID4,
                                        value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID },
                                        disable: true,
                                        refresh: !UserApproveID4.refresh
                                    }
                                };
                            }

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
                        } else if (result.LevelApprove == 2) {
                            if (result.IsOnlyOneLevelApprove) {
                                this.levelApproveLateEarlyAllowed = 1;

                                if (result.SupervisorID != null) {
                                    nextState = {
                                        UserApproveID: {
                                            ...nextState.UserApproveID,
                                            value: {
                                                UserInfoName: result.SupervisorName,
                                                ID: result.SupervisorID
                                            }
                                        },
                                        UserApproveID2: {
                                            ...nextState.UserApproveID2,
                                            value: {
                                                UserInfoName: result.SupervisorName,
                                                ID: result.SupervisorID
                                            }
                                        },
                                        UserApproveID3: {
                                            ...nextState.UserApproveID3,
                                            value: {
                                                UserInfoName: result.SupervisorName,
                                                ID: result.SupervisorID
                                            }
                                        },
                                        UserApproveID4: {
                                            ...nextState.UserApproveID4,
                                            value: {
                                                UserInfoName: result.SupervisorName,
                                                ID: result.SupervisorID
                                            }
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
                                            value: {
                                                UserInfoName: result.SupervisorName,
                                                ID: result.SupervisorID
                                            }
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
                                            value: {
                                                UserInfoName: result.SupervisorNextName,
                                                ID: result.MidSupervisorID
                                            }
                                        },
                                        UserApproveID3: {
                                            ...nextState.UserApproveID3,
                                            value: {
                                                UserInfoName: result.SupervisorNextName,
                                                ID: result.MidSupervisorID
                                            }
                                        },
                                        UserApproveID4: {
                                            ...nextState.UserApproveID4,
                                            value: {
                                                UserInfoName: result.SupervisorNextName,
                                                ID: result.MidSupervisorID
                                            }
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
                                        value: {
                                            UserInfoName: result.SupervisorName,
                                            ID: result.SupervisorID
                                        }
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
                                            ID: result.MidSupervisorID
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
                                        value: {
                                            UserInfoName: result.NextMidSupervisorName,
                                            ID: result.NextMidSupervisorID
                                        }
                                    },
                                    UserApproveID3: {
                                        ...nextState.UserApproveID3,
                                        value: {
                                            UserInfoName: result.NextMidSupervisorName,
                                            ID: result.NextMidSupervisorID
                                        }
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
                                        value: {
                                            UserInfoName: result.SupervisorName,
                                            ID: result.SupervisorID
                                        }
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
                                        value: {
                                            UserInfoName: result.SupervisorNextName,
                                            ID: result.MidSupervisorID
                                        }
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
                                        value: {
                                            UserInfoName: result.NextMidSupervisorName,
                                            ID: result.NextMidSupervisorID
                                        }
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
                                        value: {
                                            UserInfoName: result.HighSupervisorName,
                                            ID: result.HighSupervisorID
                                        }
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
                                        value: {
                                            UserInfoName: result.SupervisorName,
                                            ID: result.SupervisorID
                                        }
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
                                        value: {
                                            UserInfoName: result.HighSupervisorName,
                                            ID: result.HighSupervisorID
                                        }
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
                                        value: {
                                            UserInfoName: result.SupervisorNextName,
                                            ID: result.MidSupervisorID
                                        }
                                    },
                                    UserApproveID2: {
                                        ...nextState.UserApproveID2,
                                        value: {
                                            UserInfoName: result.SupervisorNextName,
                                            ID: result.MidSupervisorID
                                        }
                                    },
                                    UserApproveID3: {
                                        ...nextState.UserApproveID3,
                                        value: {
                                            UserInfoName: result.SupervisorNextName,
                                            ID: result.MidSupervisorID
                                        }
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
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    //config textDataLink
    GetTalentCommitmentByStopWorking = (profile) => {
        const profileID = profile.ID,
            { DateStop } = this.state,
            dateStopVal = DateStop.value ? moment(DateStop.value).format('YYYY-MM-DD HH:mm:ss') : null;

        if (!profileID || !dateStopVal) {
            return;
        }

        //VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Hre_GetData/GetTalentCommitmentByStopWorking', {
            profileID: profileID,
            dateStop: dateStopVal
        }).then(() => {
            //VnrLoadingSevices.hide();

            try {
                // let liststrLink = [];
                // if (TalentCommitment && TalentCommitment.length > 0) {
                //   Toaster('HRM_EmpViolatedTalentCommitment_Portal', 'warning', true);
                //   isShowEle('#divTalentCommitment', true);
                //   TalentCommitment.forEach(function (el) {
                //     var strLink = '<a style="color: #009FFF;" target="_blank" href="#/Hrm_Main_Web/Hre_Talent/Index?id=' + el['ID'] + '">' + el['TalentCommitment'] + '</a>';
                //     var strLink = '<a style="color: #009FFF;">' + el['TalentCommitment'] + '</a>';
                //     liststrLink.push(strLink);
                //   })
                //   $("#divTalentCommitment div.textDataLink").html(liststrLink.join(" | "));
                // }
                // else {
                //   isShowEle('#divTalentCommitment', false);
                // }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    handleSetState = (resAll) => {
        let nextState = {};
        const {
                Profile,
                ResignReasonID,
                TypeOfStopID,
                OtherReason,
                RequestDate,
                DateQuitSubmit,
                LastWorkingDay,
                DateStop,
                NumberDayQuitJob,
                FileAttach,
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
                DateEndUnion,
                DateChildEnough1Year
            } = this.state,
            dataTypeOfStop = resAll[0],
            dataResignReason = resAll[1],
            Prenatal = resAll[3],
            DataViewStop = resAll[4],
            UserApproveWithType = resAll[5];

        // Fix error response type data is Araray
        let record = resAll[6];

        if (record && Array.isArray(record) && record.length > 0) {
            record = record[0];
        }
        // --------------- //

        this.ContractTypeID = record.ContractTypeID;

        nextState = {
            ID: record.ID,
            Profile: {
                ...Profile,
                ID: record.ProfileID,
                ProfileName: record.ProfileName
            },
            ResignReasonID: {
                ...ResignReasonID,
                data: dataResignReason ? [...dataResignReason] : [],
                value: record.ResignReasonID
                    ? { ID: record.ResignReasonID, ResignReasonName: record.ResignReasonName }
                    : null,
                refresh: !ResignReasonID.refresh
            },
            TypeOfStopID: {
                ...TypeOfStopID,
                data: dataTypeOfStop ? [...dataTypeOfStop] : [],
                value: record.TypeOfStopID ? { ID: record.TypeOfStopID, NameEntityName: record.TypeOfStopName } : null,
                refresh: !TypeOfStopID.refresh
            },
            OtherReason: {
                ...OtherReason,
                value: record.OtherReason,
                refresh: !OtherReason.refresh
            },
            RequestDate: {
                ...RequestDate,
                value: record.RequestDate,
                refresh: !RequestDate.refresh
            },
            DateQuitSubmit: {
                ...DateQuitSubmit,
                value: record.DateQuitSubmit,
                refresh: !DateQuitSubmit.refresh
            },
            DateStop: {
                ...DateStop,
                value: record.DateStop,
                refresh: !DateStop.refresh
            },
            LastWorkingDay: {
                ...LastWorkingDay,
                value: record.LastWorkingDay,
                refresh: !LastWorkingDay.refresh
            },
            NumberDayQuitJob: {
                ...NumberDayQuitJob,
                value: record.NumberDayQuitJob,
                refresh: !NumberDayQuitJob.refresh
            },
            FileAttach: {
                ...FileAttach,
                value: record?.lstFileAttach,
                refresh: !FileAttach.refresh
            },
            Note: {
                ...Note,
                value: record.Note,
                refresh: !Note.refresh
            },
            AnnualLeave: {
                ...AnnualLeave,
                value: record.AnnualLeave,
                refresh: !AnnualLeave.refresh
            },
            UserApproveID: {
                ...UserApproveID,
                value: record.UserApproveID ? { ID: record.UserApproveID, UserInfoName: record.UserApproveName } : null,
                refresh: !UserApproveID.refresh
            },
            UserApproveID2: {
                ...UserApproveID2,
                value: record.UserApproveID2
                    ? { ID: record.UserApproveID2, UserInfoName: record.UserApproveID2Name }
                    : null,
                refresh: !UserApproveID2.refresh
            },
            UserApproveID3: {
                ...UserApproveID3,
                value: record.UserApproveID3
                    ? { ID: record.UserApproveID3, UserInfoName: record.UserApproveID3Name }
                    : null,
                refresh: !UserApproveID3.refresh
            },
            UserApproveID4: {
                ...UserApproveID4,
                value: record.UserApproveID4
                    ? { ID: record.UserApproveID4, UserInfoName: record.UserApproveID4Name }
                    : null,
                refresh: !UserApproveID4.refresh
            },
            DateQuitApprove: {
                ...DateQuitApprove,
                value: record.DateQuitApprove,
                refresh: !DateQuitApprove.refresh
            },
            DateQuitSign: {
                ...DateQuitSign,
                value: record.DateQuitSign,
                refresh: !DateQuitSign.refresh
            },
            PaymentDay: {
                ...PaymentDay,
                value: record.PaymentDay,
                refresh: !PaymentDay.refresh
            },
            SocialInsDeliveryDate: {
                ...SocialInsDeliveryDate,
                value: record.SocialInsDeliveryDate,
                refresh: !SocialInsDeliveryDate.refresh
            },
            DecisionNo: {
                ...DecisionNo,
                value: record.DecisionNo,
                refresh: !DecisionNo.refresh
            },
            IsBlackList: {
                ...IsBlackList,
                value: !record.IsBlackList ? false : true,
                refresh: !IsBlackList.refresh
            },
            ReasonBackList: {
                ...ReasonBackList,
                value: record.ReasonBackList,
                refresh: !ReasonBackList.refresh
            },
            DateHire: {
                ...DateHire,
                value: record.DateHire,
                refresh: !DateHire.refresh
            },
            DeptPath: {
                ...DeptPath,
                value: record.DeptPath,
                refresh: !DeptPath.refresh
            },
            ContractTypeName: {
                ...ContractTypeName,
                value: record.ContractTypeName,
                refresh: !ContractTypeName.refresh
            },
            DateStart: {
                ...DateStart,
                value: record.DateStart,
                refresh: !DateStart.refresh
            },
            DateEnd: {
                ...DateEnd,
                value: record.DateEnd,
                refresh: !DateEnd.refresh
            },
            // StoredDocumentCodes: {
            //   ...StoredDocumentCodes,
            //   data: dataReqDocumentQuit ? [...dataReqDocumentQuit] : [],
            //   value: record.ReqDocumentID ?
            //     { Code: record.TypeOfStopID, ReqDocumentName: record.TypeOfStopName } : null,
            //   refresh: !StoredDocumentCodes.refresh
            // },
            DateEndUnion: {
                ...DateEndUnion,
                value: record.DateEndUnion,
                refresh: !DateEndUnion.refresh
            },
            DateChildEnough1Year: {
                ...DateChildEnough1Year,
                value: record.DateChildEnough1Year,
                refresh: !DateChildEnough1Year.refresh
            }
        };

        //config DateChildEnough1Year
        if (Prenatal && Prenatal !== '') {
            nextState = {
                ...nextState,
                DateChildEnough1Year: {
                    ...nextState.DateChildEnough1Year,
                    visible: true
                }
            };
        } else {
            nextState = {
                ...nextState,
                DateChildEnough1Year: {
                    ...nextState.DateChildEnough1Year,
                    visible: false
                }
            };
        }

        //config by DataViewStop
        if (DataViewStop) {
            // _DateHire.value(data.DateHire);
            // _DateStart.value(data.DateStart);
            // _DateEnd.value(data.DateEnd);
            // $("#DeptPath").val(data.OrgStructureName);
            // $("#ContractTypeName").val(data.ContractTypeName);
            //$("#ContractTypeID").val(data.ContractTypeID);

            nextState = {
                ...nextState,
                DateHire: {
                    ...nextState.DateHire,
                    value: DataViewStop.DateHire
                },
                DateStart: {
                    ...nextState.DateStart,
                    value: DataViewStop.DateStart
                },
                DateEnd: {
                    ...nextState.DateEnd,
                    value: DataViewStop.DateEnd
                },
                DeptPath: {
                    ...nextState.DeptPath,
                    value: DataViewStop.OrgStructureName
                },
                ContractTypeName: {
                    ...nextState.ContractTypeName,
                    value: DataViewStop.ContractTypeName
                }
            };

            this.ContractTypeID = DataViewStop.ContractTypeID;
        }

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
        }

        this.setState(nextState);
    };

    getRecordAndConfigByID = (record, _handleSetState) => {
        const { ID, ProfileID, UserSubmit } = record,
            dateStopVal = record.DateStop ? moment(record.DateStop).format('YYYY-MM-DD HH:mm:ss') : null,
            requestDateVal = record.RequestDate ? moment(record.RequestDate).format('YYYY-MM-DD HH:mm:ss') : null;

        let arrRequest = [
            HttpService.Get('[URI_HR]/Cat_GetData/GetMultiTypeOfStop'),
            HttpService.Get('[URI_HR]/Cat_GetData/GetMultiResignReasonPortalApp'),
            HttpService.Get('[URI_HR]/Cat_GetData/GetMultiReqDocumentQuit'),
            HttpService.Post('[URI_HR]/Hre_GetData/GetPrenatalForCreateStopWorking', {
                ProfileID: ProfileID,
                dateStop: dateStopVal
            }),
            HttpService.Post('[URI_HR]/Hre_GetData/GetDataViewStop', {
                ProfileID: ProfileID,
                dateStop: dateStopVal,
                requestDate: requestDateVal
            }),
            HttpService.Post('[URI_HR]/Hre_GetData/GetUserApproveWithType', {
                userSubmit: UserSubmit,
                profileID: ProfileID,
                Type: 'E_STOPWORKING',
                datestop: dateStopVal
            }),
            HttpService.Get('[URI_HR]/api/Hre_StopWorking/' + ID)
        ];

        HttpService.MultiRequest(arrRequest).then((resAll) => {
            VnrLoadingSevices.hide();
            try {
                _handleSetState(resAll);
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };
    //#endregion

    //xem phép năm còn lại
    checkAnnualLeave = () => {};

    //picked Loại nghỉ việc
    onPickedTypeOfStopID = (item) => {
        const { TypeOfStopID, ResignReasonID } = this.state;
        let nextState = {
                TypeOfStopID: {
                    ...TypeOfStopID,
                    value: item,
                    refresh: !TypeOfStopID.refresh
                }
            },
            _TypeOfStopID = item ? item.ID : null;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Cat_GetData/GetResignReasonByTypeOfStopPortalApp', {
            typeOfStopID: _TypeOfStopID
        }).then((data) => {
            VnrLoadingSevices.hide();

            try {
                if (data) {
                    if (data.length == 1) {
                        let obj = { ...data[0] };
                        nextState = {
                            ...nextState,
                            ResignReasonID: {
                                ...ResignReasonID,
                                data: [...data],
                                value: obj,
                                refresh: !ResignReasonID.refresh
                            }
                        };
                        this.setState(nextState, () => {
                            //exce function onPickedResignReasonID
                            this.onPickedResignReasonID(obj);
                        });
                    } else {
                        nextState = {
                            ...nextState,
                            ResignReasonID: {
                                ...ResignReasonID,
                                data: [...data],
                                value: null,
                                refresh: !ResignReasonID.refresh
                            }
                        };
                        this.setState(nextState);
                    }
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    //picked Lý do nghỉ việc
    onPickedResignReasonID = (item) => {
        const { ResignReasonID } = this.state;
        let nextState = {
            ResignReasonID: {
                ...ResignReasonID,
                value: item,
                refresh: !ResignReasonID.refresh
            }
        };

        this.setState(nextState);
    };

    //picked duyệt đầu
    onChangeUserApproveID = (item) => {
        const { UserApproveID } = this.state;
        let nextState = {
            UserApproveID: {
                ...UserApproveID,
                value: item,
                refresh: !UserApproveID.refresh
            }
        };

        if (this.isOnlyOneLevelApprove == true) {
            // _UserApproveID2.value(_UserApproveID);
            // _UserApproveID3.value(_UserApproveID);
            // _UserApproveID4.value(_UserApproveID);
            const { UserApproveID2, UserApproveID3, UserApproveID4 } = this.state;

            nextState = {
                ...nextState,
                UserApproveID2: {
                    ...UserApproveID2,
                    value: item ? { ...item } : null,
                    refresh: !UserApproveID2.refresh
                },
                UserApproveID3: {
                    ...UserApproveID3,
                    value: item ? { ...item } : null,
                    refresh: !UserApproveID3.refresh
                },
                UserApproveID4: {
                    ...UserApproveID4,
                    value: item ? { ...item } : null,
                    refresh: !UserApproveID4.refresh
                }
            };
        }

        this.setState(nextState);
    };

    //picked duyệt cuối
    onChangeUserApproveID4 = (item) => {
        const { UserApproveID4 } = this.state;
        let nextState = {
            UserApproveID4: {
                ...UserApproveID4,
                value: item,
                refresh: !UserApproveID4.refresh
            }
        };

        if (this.levelApproved == '2') {
            const { UserApproveID2, UserApproveID3 } = this.state;

            // _UserApproveID2.value(_UserApproveID4);
            // _UserApproveID3.value(_UserApproveID4);
            nextState = {
                ...nextState,
                UserApproveID2: {
                    ...UserApproveID2,
                    value: item ? { ...item } : null,
                    refresh: !UserApproveID2.refresh
                },
                UserApproveID3: {
                    ...UserApproveID3,
                    value: item ? { ...item } : null,
                    refresh: !UserApproveID3.refresh
                }
            };
        }
        if (this.levelApproved == '3') {
            const { UserApproveID3 } = this.state;

            //_UserApproveID3.value(_UserApproveID4);
            nextState = {
                ...nextState,
                UserApproveID3: {
                    ...UserApproveID3,
                    value: item ? { ...item } : null,
                    refresh: !UserApproveID3.refresh
                }
            };
        }

        this.setState(nextState);
    };

    //change Ngày nộp đơn
    onChangeRequestDate = (value) => {
        const { RequestDate, Profile, DateQuitSubmit, DateStop, DateQuitApprove, DateQuitSign } = this.state;
        let nextState = {
                RequestDate: {
                    ...RequestDate,
                    value: value,
                    refresh: !RequestDate.refresh
                }
            },
            _profileID = Profile.ID,
            _DateStopVal = DateStop.value ? moment(DateStop.value).format('YYYY-MM-DD HH:mm:ss') : null,
            _RequestDateVal = value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null;

        HttpService.Get('[URI_HR]/Hre_GetData/IsLoadResignInfoByDateStop').then((returnValue) => {
            if (returnValue == 'E_DATESTOP' || returnValue == 'E_REQUESTDATE') {
                VnrLoadingSevices.show();
                HttpService.Post('[URI_HR]/Hre_GetData/GetDataViewStop', {
                    ProfileID: _profileID,
                    dateStop: _DateStopVal,
                    requestDate: _RequestDateVal
                }).then((data) => {
                    VnrLoadingSevices.hide;

                    if (data && data.DateQuitSubmit) {
                        nextState = {
                            ...nextState,
                            DateQuitSubmit: {
                                ...DateQuitSubmit,
                                value: data.DateQuitSubmit,
                                refresh: !DateQuitSubmit.refresh
                            }
                        };
                    } else {
                        nextState = {
                            ...nextState,
                            DateQuitSubmit: {
                                ...DateQuitSubmit,
                                value: value,
                                refresh: !DateQuitSubmit.refresh
                            }
                        };
                    }

                    this.setState(nextState, () => {
                        this.getUserApprove();
                    });
                });

                if (returnValue == 'E_REQUESTDATE' || !returnValue) {
                    nextState = {
                        ...nextState,
                        DateStop: {
                            ...DateStop,
                            value: value,
                            refresh: !DateStop.refresh
                        },
                        DateQuitApprove: {
                            ...DateQuitApprove,
                            value: value,
                            refresh: !DateQuitApprove.refresh
                        },
                        DateQuitSign: {
                            ...DateQuitSign,
                            value: value,
                            refresh: !DateQuitSign.refresh
                        }
                    };
                }
            } else {
                nextState = {
                    ...nextState,
                    DateQuitSubmit: {
                        ...DateQuitSubmit,
                        value: null,
                        refresh: !DateQuitSubmit.refresh
                    },
                    DateStop: {
                        ...DateStop,
                        value: null,
                        refresh: !DateStop.refresh
                    },
                    DateQuitApprove: {
                        ...DateQuitApprove,
                        value: null,
                        refresh: !DateQuitApprove.refresh
                    },
                    DateQuitSign: {
                        ...DateQuitSign,
                        value: null,
                        refresh: !DateQuitSign.refresh
                    }
                };
            }
        });

        this.setState(nextState, () => {
            this.loadByRequestDate();
            this.getUserApprove();
        });
    };

    //change Ngày yêu cầu nghỉ
    onChangeDateQuitSubmit = (value) => {
        const { DateQuitSubmit } = this.state;
        let nextState = {
            DateQuitSubmit: {
                ...DateQuitSubmit,
                value: value,
                refresh: !DateQuitSubmit.refresh
            }
        };

        this.setState(nextState);

        const _checkConfig = this.checkConfig;
        if (
            _checkConfig == 'E_NOLOAD' ||
            _checkConfig == null ||
            _checkConfig == '' ||
            _checkConfig == 'E_REQUESTDATE' ||
            _checkConfig == 'E_DATESTOP'
        )
            return;

        HttpService.Get('[URI_HR]/Hre_GetData/IsLoadResignInfoByDateStop').then(() => {
            const { DateQuitSubmit, DateQuitApprove, DateQuitSign } = this.state;

            let nextState = {
                DateQuitApprove: {
                    ...DateQuitApprove,
                    value: DateQuitSubmit.value,
                    refresh: !DateQuitApprove.refresh
                },
                // DateStop: {
                //   ...DateStop,
                //   value: DateQuitSubmit.value,
                //   refresh: !DateStop.refresh
                // },
                DateQuitSign: {
                    ...DateQuitSign,
                    value: DateQuitSubmit.value,
                    refresh: !DateQuitSign.refresh
                }
            };

            this.setState(nextState, () => {
                this.onChangeDateStop(DateQuitSubmit.value);
            });
        });
    };

    //change Ngày nghỉ việc
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
                // laod lai cap duyet
                this.getUserApprove();

                const { Profile, DateStop } = this.state;
                let _profileID = Profile.ID,
                    _DateStop = DateStop.value ? moment(DateStop.value).format('YYYY-MM-DD HH:mm:ss') : null;

                VnrLoadingSevices.show();
                //Son.Vo - 20160815 - 0071041
                HttpService.Post('[URI_HR]/Hre_GetData/GetPrenatalForCreateStopWorking', {
                    ProfileID: _profileID,
                    dateStop: _DateStop
                }).then((data) => {
                    VnrLoadingSevices.hide();
                    try {
                        let nextState = {};
                        const { DateChildEnough1Year } = this.state;

                        if (data != null && data.DateChildEnough1Year != null) {
                            nextState = {
                                DateChildEnough1Year: {
                                    ...DateChildEnough1Year,
                                    value: data.DateChildEnough1Year,
                                    visible: true,
                                    refresh: !DateChildEnough1Year.refresh
                                }
                            };
                        } else {
                            nextState = {
                                DateChildEnough1Year: {
                                    ...DateChildEnough1Year,
                                    visible: false,
                                    refresh: !DateChildEnough1Year.refresh
                                }
                            };
                        }

                        this.setState(nextState, () => {});
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    }
                });

                // HttpService.Post('[URI_HR]/Hre_GetData/GetDataViewStop',
                //   { ProfileID: _profileID, dateStop: _DateStop, requestDate: _RequestDateVal })
                //   .then(data => {
                //     console.log(data, 'GetDataViewStop');
                //     VnrLoadingSevices.hide();

                //   try {
                //     if (data != null) {
                //       let nextState = {
                //         ContractTypeName: {
                //           ...ContractTypeName,
                //           value: data.ContractTypeName,
                //           refresh: !ContractTypeName.refresh
                //         },
                //         DateStart: {
                //           ...DateStart,
                //           value: data.DateStart,
                //           refresh: !DateStart.refresh
                //         },
                //         DateEnd: {
                //           ...DateEnd,
                //           value: data.DateEnd,
                //           refresh: !DateEnd.refresh
                //         },
                //         NumberDayQuitJob: {
                //           ...NumberDayQuitJob,
                //           value: data.NumberDayQuitJob,
                //           refresh: !NumberDayQuitJob.refresh
                //         }
                //       };

                //       this.ContractTypeID = data.ContractTypeID;

                //       if (data.IsLoadResignInfoByDateStop == 'E_DATESTOP') {
                //         if (data.RequestDate != null) {
                //           nextState = {
                //             ...nextState,
                //             RequestDate: {
                //               ...RequestDate,
                //               value: data.RequestDate,
                //               refresh: !RequestDate.refresh
                //             },
                //             DateQuitSign: {
                //               ...DateQuitSign,
                //               value: DateStop.value,
                //               refresh: !DateQuitSign.refresh
                //             }
                //           }
                //         }
                //       }
                //       else if (data.IsLoadResignInfoByDateStop == 'E_REQUESTDATE'
                //         || !data.IsLoadResignInfoByDateStop) {
                //         nextState = {
                //           ...nextState,
                //           DateQuitApprove: {
                //             ...DateQuitApprove,
                //             value: DateStop.value,
                //             refresh: !DateQuitApprove.refresh
                //           },
                //           DateQuitSign: {
                //             ...DateQuitSign,
                //             value: DateStop.value,
                //             refresh: !DateQuitSign.refresh
                //           }
                //         }
                //       }
                //       if (data.DateQuitSubmit) {
                //         nextState = {
                //           ...nextState,
                //           DateQuitSubmit: {
                //             ...DateQuitSubmit,
                //             value: data.DateQuitSubmit,
                //             refresh: !DateQuitSubmit.refresh
                //           }
                //         }
                //       }
                //     }
                //   } catch (error) {
                //     DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                //   }
                // })
            }
        );
    };

    //change Ngày làm việc cuối
    onChangeLastWorkingDay = (value) => {
        const { LastWorkingDay } = this.state;
        this.setState(
            {
                LastWorkingDay: {
                    ...LastWorkingDay,
                    value: value,
                    refresh: !LastWorkingDay.refresh
                }
            },
            () => {
                this.lastWorkingDayChange();
            }
        );
    };

    lastWorkingDayChange = () => {
        const {
            Profile,
            DateHire,
            RequestDate,
            DateQuitSign,
            DateQuitApprove,
            DateStop,
            DateStart,
            DateEnd,
            DeptPath,
            ContractTypeName,
            DateQuitSubmit,
            LastWorkingDay
        } = this.state;
        if (LastWorkingDay.value) {
            let nextState = {
                DateQuitSign: {
                    ...DateQuitSign,
                    value: LastWorkingDay.value,
                    refresh: !DateQuitSign.refresh
                }
            };

            let _profileID = Profile.ID,
                _DateStopVal = DateStop.value ? moment(DateStop.value).format('YYYY-MM-DD HH:mm:ss') : null,
                _RequestDateVal = RequestDate.value ? moment(RequestDate.value).format('YYYY-MM-DD HH:mm:ss') : null;

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Hre_GetData/GetDataViewStop', {
                ProfileID: _profileID,
                dateStop: _DateStopVal,
                requestDate: _RequestDateVal
            }).then((data) => {
                VnrLoadingSevices.hide();
                try {
                    if (data != null) {
                        nextState = {
                            ...nextState,
                            DateHire: {
                                ...DateHire,
                                value: data ? data.DateHire : null,
                                refresh: !DateHire.refresh
                            },
                            DateStart: {
                                ...DateStart,
                                value: data ? data.DateStart : null,
                                refresh: !DateStart.refresh
                            },
                            DateEnd: {
                                ...DateEnd,
                                value: data ? data.DateEnd : null,
                                refresh: !DateEnd.refresh
                            },
                            DeptPath: {
                                ...DeptPath,
                                value: data ? data.OrgStructureName : null,
                                refresh: !DeptPath.refresh
                            },
                            ContractTypeName: {
                                ...ContractTypeName,
                                value: data ? data.ContractTypeName : null,
                                refresh: !ContractTypeName.refresh
                            }
                        };

                        this.ContractTypeID = data.ContractTypeID;

                        if (data.IsLoadResignInfoByDateStop == 'E_DATESTOP') {
                            if (data.RequestDate != null) {
                                nextState = {
                                    ...nextState,
                                    RequestDate: {
                                        ...RequestDate,
                                        value: data.RequestDate,
                                        refresh: !RequestDate.refresh
                                    },
                                    DateQuitSign: {
                                        ...DateQuitSign,
                                        value: DateStop.value,
                                        refresh: !DateQuitSign.refresh
                                    }
                                };
                            }

                            if (data.DateQuitSubmit != null) {
                                nextState = {
                                    ...nextState,
                                    DateQuitSubmit: {
                                        ...DateQuitSubmit,
                                        value: data.DateQuitSubmit,
                                        refresh: !DateQuitSubmit.refresh
                                    }
                                };
                            }

                            this.setValueWorkingDayChangeConfig(LastWorkingDay.value);
                        }
                        //Son.Vo - 20190831 - 0107743 - đọc cấu hình load
                        else if (
                            data.IsLoadResignInfoByDateStop == 'E_REQUESTDATE' ||
                            !data.IsLoadResignInfoByDateStop
                        ) {
                            nextState = {
                                ...nextState,
                                DateQuitApprove: {
                                    ...DateQuitApprove,
                                    value: DateStop.value,
                                    refresh: !DateQuitApprove.refresh
                                },
                                DateQuitSign: {
                                    ...DateQuitSign,
                                    value: DateStop.value,
                                    refresh: !DateQuitSign.refresh
                                }
                            };

                            if (data.DateQuitSubmit != null) {
                                nextState = {
                                    ...nextState,
                                    DateQuitSubmit: {
                                        ...DateQuitSubmit,
                                        value: data.DateQuitSubmit,
                                        refresh: !DateQuitSubmit.refresh
                                    }
                                };
                            }

                            this.setValueWorkingDayChangeConfig(LastWorkingDay.value);
                        } else if (data.IsLoadResignInfoByDateStop == 'E_NOLOAD') {
                            nextState = {
                                ...nextState,
                                DateQuitApprove: {
                                    ...DateQuitApprove,
                                    value: null,
                                    refresh: !DateQuitApprove.refresh
                                },
                                DateQuitSign: {
                                    ...DateQuitSign,
                                    value: null,
                                    refresh: !DateQuitSign.refresh
                                }
                                // DateQuitSubmit: {
                                //   ...DateQuitSubmit,
                                //   value: null,
                                //   refresh: !DateQuitSubmit.refresh
                                // },
                                // DateStop: {
                                //   ...DateStop,
                                //   value: null,
                                //   refresh: !DateStop.refresh
                                // }
                            };
                        }

                        this.setState(nextState);
                    }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            });
        }
    };

    setValueWorkingDayChangeConfig = (value) => {
        if (value) {
            const { DateQuitSign } = this.state;
            this.setState(
                {
                    DateQuitSign: {
                        ...DateQuitSign,
                        value: value,
                        refresh: !DateQuitSign.refresh
                    }
                    // DateStop: {
                    //   ...DateStop,
                    //   value: moment(value).add(1, 'days'),
                    //   refresh: !DateStop.refresh
                    // }
                },
                () => {
                    this.onChangeDateStop(moment(value).add(1, 'days'));
                }
            );
        }
    };

    // loadByLastWorkingDay = () => {
    //   var _profileID = $('#ProfileID').val()[0];
    //   var _DateStart = $("#DateStart").data("kendoDatePicker");
    //   var _DateEnd = $("#DateEnd").data("kendoDatePicker");
    //   var _DateHire = $("#DateHire").data("kendoDatePicker");
    //   var _RequestDate = $("#RequestDate").data("kendoDatePicker");
    //   var _DateStop = ConvertDatetime(uriSys + 'Sys_GetData/GetFormatDate/', $(frm + ' #DateStop').val());
    //   var _DateStopVal = $("#DateStop").data("kendoDatePicker");
    //   var _DateChildEnough1Year = $("#DateChildEnough1Year").data("kendoDatePicker");
    //   var _DateQuitSign = $("#DateQuitSign").data("kendoDatePicker");
    //   var _DateQuitApprove = $("#DateQuitApprove").data("kendoDatePicker");
    //   var _DateQuitSubmit = $("#DateQuitSubmit").data("kendoDatePicker");
    //   var _RequestDateVal = ConvertDatetime(uriSys + 'Sys_GetData/GetFormatDate/', $(frm + ' #RequestDate').val());
    //   $.ajax({
    //     url: uriHr + "Hre_GetData/GetDataViewStop",
    //     data: { ProfileID: _profileID, dateStop: _DateStop, requestDate: _RequestDateVal },
    //     type: 'POST',
    //     success: function (data) {
    //       if (data != null) {
    //         //$("#DeptPath").val(data.OrgStructureName);
    //         //_DateHire.value(data.DateHire);
    //         $("#ContractTypeName").val(data.ContractTypeName);
    //         $("#ContractTypeID").val(data.ContractTypeID);
    //         data.DateStart ? _DateStart.value(data.DateStart) : _DateStart.value(null);
    //         data.DateEnd ? _DateEnd.value(data.DateEnd) : _DateEnd.value(null);
    //         data.NumberDayQuitJob ? $("#NumberDayQuitJob").data('kendoNumericTextBox').value(data.NumberDayQuitJob) : $("#NumberDayQuitJob").data('kendoNumericTextBox').value(null);
    //         if (data.IsLoadResignInfoByDateStop == 'E_DATESTOP') {
    //           if (data.RequestDate != null) {
    //             _RequestDate.value(data.RequestDate);
    //             _DateQuitSig.value(_DateStopVal.value());
    //           }
    //         }
    //         else if (data.IsLoadResignInfoByDateStop == 'E_REQUESTDATE' || !data.IsLoadResignInfoByDateStop) {
    //           _DateQuitSign.value(_DateStopVal.value());
    //           _DateQuitApprove.value(_DateStopVal.value());
    //         }
    //         if (data.DateQuitSubmit) {
    //           _DateQuitSubmit.value(data.DateQuitSubmit);
    //         }
    //       }
    //     }
    //   });

    //   //Son.Vo - 20160815 - 0071041
    //   $.ajax({
    //     url: uriHr + "Hre_GetData/GetPrenatalForCreateStopWorking",
    //     data: { ProfileID: _profileID, dateStop: _DateStop },
    //     type: 'POST',
    //     success: function (data) {
    //       if (data != null && data.DateChildEnough1Year != null) {
    //         $("#div_DateChildEnough1Year").show();
    //         _DateChildEnough1Year.value(data.DateChildEnough1Year);
    //       }
    //       else {
    //         $("#div_DateChildEnough1Year").hide();
    //       }
    //     }
    //   });

    //   this.GetTalentCommitmentByStopWorking();
    // }

    //change Ngày duyệt
    onChangeDateQuitApprove = () => {
        const checkConfig = this.checkConfig;
        if (
            checkConfig == 'E_NOLOAD' ||
            checkConfig == null ||
            checkConfig == '' ||
            checkConfig == 'E_REQUESTDATE' ||
            checkConfig == 'E_DATESTOP'
        )
            return;
        // eslint-disable-next-line no-undef
        var _DateQuitApprove = $('#DateQuitApprove').data('kendoDatePicker');
        var _DateQuitApprovevalue = _DateQuitApprove.value();
        // eslint-disable-next-line no-undef
        var _DateQuitSign = $('#DateQuitSign').data('kendoDatePicker');
        // eslint-disable-next-line no-undef
        $.ajax({
            type: 'POST',
            // eslint-disable-next-line no-undef
            url: uriHr + 'Hre_GetData/IsLoadResignInfoByDateStop',
            async: false,
            success: function (returnValue) {
                if (returnValue != true) {
                    _DateQuitSign.value(_DateQuitApprovevalue);
                }
            }
        });
    };

    //load by Ngày nghỉ việc
    loadByRequestDate = () => {
        const {
            Profile,
            DateHire,
            RequestDate,
            DateQuitSign,
            DateQuitApprove,
            DateStop,
            NumberDayQuitJob,
            DateEndUnion,
            DateStart,
            DateEnd,
            DeptPath,
            ContractTypeName,
            DateQuitSubmit
        } = this.state;

        let _profileID = Profile.ID,
            _DateStopVal = DateStop.value ? moment(DateStop.value).format('YYYY-MM-DD HH:mm:ss') : null,
            _RequestDateVal = RequestDate.value ? moment(RequestDate.value).format('YYYY-MM-DD HH:mm:ss') : null;

        if (!_DateStopVal) {
            let nextState = {
                DeptPath: {
                    ...DeptPath,
                    value: '',
                    refresh: !DeptPath.refresh
                },
                ContractTypeName: {
                    ...ContractTypeName,
                    value: '',
                    refresh: !ContractTypeName.refresh
                },
                DateStart: {
                    ...DateStart,
                    value: null,
                    refresh: !DateStart.refresh
                },
                DateEndUnion: {
                    ...DateEndUnion,
                    value: null,
                    refresh: !DateEndUnion.refresh
                },
                DateEnd: {
                    ...DateEnd,
                    value: null,
                    refresh: !DateEnd.refresh
                },
                NumberDayQuitJob: {
                    ...NumberDayQuitJob,
                    value: null,
                    refresh: !NumberDayQuitJob.refresh
                }
            };

            this.ContractTypeID = null;

            this.setState(nextState);

            return;
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Hre_GetData/GetDataViewStop', {
            ProfileID: _profileID,
            dateStop: _DateStopVal,
            requestDate: _RequestDateVal
        }).then((data) => {
            VnrLoadingSevices.hide();

            try {
                if (data) {
                    let nextState = {
                        DateHire: {
                            ...DateHire,
                            value: data.DateHire,
                            refresh: !DateHire.refresh
                        },
                        DateStart: {
                            ...DateStart,
                            value: data.DateStart,
                            refresh: !DateStart.refresh
                        },
                        DateEnd: {
                            ...DateEnd,
                            value: data.DateEnd,
                            refresh: !DateEnd.refresh
                        },
                        DeptPath: {
                            ...DeptPath,
                            value: data.OrgStructureName,
                            refresh: !DeptPath.refresh
                        },
                        ContractTypeName: {
                            ...ContractTypeName,
                            value: data.ContractTypeName,
                            refresh: !ContractTypeName.refresh
                        }
                    };

                    this.ContractTypeID = data.ContractTypeID;

                    if (data.IsLoadResignInfoByDateStop == 'E_DATESTOP') {
                        if (data.RequestDate != null) {
                            nextState = {
                                ...nextState,
                                RequestDate: {
                                    ...RequestDate,
                                    value: data.RequestDate,
                                    refresh: !RequestDate.refresh
                                },
                                DateQuitSign: {
                                    ...DateQuitSign,
                                    value: DateStop.value,
                                    refresh: !DateQuitSign.refresh
                                }
                            };
                        }
                    }
                    //Son.Vo - 20190831 - 0107743 - đọc cấu hình load
                    else if (data.IsLoadResignInfoByDateStop == 'E_REQUESTDATE' || !data.IsLoadResignInfoByDateStop) {
                        nextState = {
                            ...nextState,
                            DateQuitApprove: {
                                ...DateQuitApprove,
                                value: DateStop.value,
                                refresh: !DateQuitApprove.refresh
                            },
                            DateQuitSign: {
                                ...DateQuitSign,
                                value: DateStop.value,
                                refresh: !DateQuitSign.refresh
                            }
                        };
                    }

                    if (data.DateQuitSubmit) {
                        nextState = {
                            ...nextState,
                            DateQuitSubmit: {
                                ...DateQuitSubmit,
                                value: data.DateQuitSubmit,
                                refresh: !DateQuitSubmit.refresh
                            }
                        };
                    }

                    nextState = {
                        ...nextState,
                        DateEndUnion: {
                            ...DateEndUnion,
                            value: data.TradeUnionistEndDate,
                            refresh: !DateEndUnion.refresh
                        },
                        NumberDayQuitJob: {
                            ...NumberDayQuitJob,
                            value: data.NumberDayQuitJob,
                            valueField: !NumberDayQuitJob.refresh
                        }
                    };

                    this.setState(nextState);
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    render() {
        const {
            Profile,
            ResignReasonID,
            TypeOfStopID,
            OtherReason,
            RequestDate,
            DateQuitSubmit,
            LastWorkingDay,
            DateStop,
            NumberDayQuitJob,
            FileAttach,
            Note,
            AnnualLeave,
            UserApproveID,
            UserApproveID2,
            UserApproveID3,
            UserApproveID4,
            fieldValid
        } = this.state;

        const { textLableInfo, contentViewControl, viewLable, viewControl, viewInputMultiline } =
            stylesListPickerControl;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps={'handled'}
                        contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                    >
                        {/* thông tin đăng ký */}
                        <View style={styleProfileInfo.styleViewTitleGroup}>
                            <VnrText
                                style={[styleSheets.text, styleProfileInfo.textLableGroup]}
                                i18nKey={'HRM_HR_StopWorking_Info_Group_Resgistration'}
                            />
                        </View>

                        {/* Tên nhân viên -  ProfileName*/}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText
                                    style={[styleSheets.text, textLableInfo]}
                                    i18nKey={'HRM_Attendance_Overtime_ProfileName'}
                                />

                                {/* valid ProfileID */}
                                {fieldValid.ProfileID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                            </View>
                            <View style={viewControl}>
                                <VnrTextInput disable={Profile.disable} value={Profile.ProfileName} />
                            </View>
                        </View>

                        {/* Loại nghỉ việc -  TypeOfStopID*/}
                        {TypeOfStopID.visibleConfig && TypeOfStopID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_HR_StopWorking_TypeOfStop'}
                                    />

                                    {fieldValid.TypeOfStopID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        dataLocal={TypeOfStopID.data}
                                        refresh={TypeOfStopID.refresh}
                                        textField="NameEntityName"
                                        valueField="ID"
                                        filter={true}
                                        value={TypeOfStopID.value}
                                        filterServer={false}
                                        disable={TypeOfStopID.disable}
                                        onFinish={(item) => this.onPickedTypeOfStopID(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Lý do nghỉ việc -  ResignReasonID*/}
                        {ResignReasonID.visibleConfig && ResignReasonID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Category_ResignReason_ReasonName'}
                                    />
                                    {fieldValid.ResignReasonID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        dataLocal={ResignReasonID.data}
                                        refresh={ResignReasonID.refresh}
                                        textField="ResignReasonName"
                                        valueField="ID"
                                        filter={true}
                                        value={ResignReasonID.value}
                                        filterServer={false}
                                        disable={ResignReasonID.disable}
                                        onFinish={(item) => this.onPickedResignReasonID(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Lý do khác -  OtherReason*/}
                        {OtherReason.visibleConfig && OtherReason.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_HR_StopWorking_OtherReason'}
                                    />

                                    {fieldValid.OtherReason && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={OtherReason.disable}
                                        refresh={OtherReason.refresh}
                                        value={OtherReason.value}
                                        onChangeText={(text) =>
                                            this.setState({
                                                OtherReason: {
                                                    ...OtherReason,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ngày nộp đơn -  RequestDate*/}
                        {RequestDate.visibleConfig && RequestDate.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_HR_StopWorking_RequestDate'}
                                    />

                                    {fieldValid.RequestDate && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={RequestDate.value}
                                        disable={RequestDate.disable}
                                        refresh={RequestDate.refresh}
                                        type={'date'}
                                        onFinish={(value) => this.onChangeRequestDate(value)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ngày yêu cầu nghỉ -  DateQuitSubmit*/}
                        {DateQuitSubmit.visibleConfig && DateQuitSubmit.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_HR_StopWorking_DateQuitSubmit'}
                                    />

                                    {fieldValid.DateQuitSubmit && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={DateQuitSubmit.value}
                                        disable={DateQuitSubmit.disable}
                                        refresh={DateQuitSubmit.refresh}
                                        type={'date'}
                                        onFinish={(value) => this.onChangeDateQuitSubmit(value)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ngày làm việc cuối cùng -  LastWorkingDay*/}
                        {LastWorkingDay.visibleConfig && LastWorkingDay.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_HR_Profile_LastWorkingDate'}
                                    />

                                    {fieldValid.LastWorkingDay && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={LastWorkingDay.value}
                                        disable={LastWorkingDay.disable}
                                        refresh={LastWorkingDay.refresh}
                                        type={'date'}
                                        onFinish={(value) => this.onChangeLastWorkingDay(value)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ngày nghỉ việc -  DateStop*/}
                        {DateStop.visibleConfig && DateStop.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_HR_Profile_DateStop'}
                                    />

                                    {fieldValid.DateStop && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={DateStop.value}
                                        disable={DateStop.disable}
                                        refresh={DateStop.refresh}
                                        type={'date'}
                                        onFinish={(value) => this.onChangeDateStop(value)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Số ngày xin nghỉ việc trước -  NumberDayQuitJob*/}
                        {NumberDayQuitJob.visibleConfig && NumberDayQuitJob.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Hr_Hre_NumberDayQuitJob'}
                                    />

                                    {fieldValid.NumberDayQuitJob && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        value={NumberDayQuitJob.value}
                                        refresh={NumberDayQuitJob.refresh}
                                        disable={NumberDayQuitJob.disable}
                                        keyboardType={'numeric'}
                                        charType={'double'}
                                        returnKeyType={'done'}
                                        onChangeText={() => {
                                            // this.setState({
                                            //   eleRegisterHours: {
                                            //     ...eleRegisterHours,
                                            //     RegisterHours: {
                                            //       ...RegisterHours,
                                            //       value: value,
                                            //     },
                                            //   },
                                            // });
                                        }}
                                        //onBlur={this.onChangeRegisterHours}
                                        //onSubmitEditing={this.onChangeRegisterHours}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Phép năm - AnnualLeave */}
                        {AnnualLeave.visibleConfig && AnnualLeave.visible && (
                            <View style={contentViewControl}>
                                <View style={viewControl}>
                                    <View style={styles.viewStyleDayPortal}>
                                        <TouchableOpacity
                                            onPress={() => this.checkAnnualLeave()}
                                            style={styles.bntSearchManualLeave}
                                        >
                                            <VnrText
                                                style={[styleSheets.lable, styles.styTextAnnaulLeave]}
                                                i18nKey={'HRM_HR_StopWorking_AnnualLeave'}
                                            />
                                        </TouchableOpacity>
                                        <View style={styles.styleValueManualLeave}>
                                            <VnrText
                                                style={[styleSheets.text, { color: Colors.primary }]}
                                                value={AnnualLeave.value}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Tập tin đính kèm - FileAttach */}
                        {FileAttach.visible && FileAttach.visibleConfig && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_HR_Reward_Attachment'}
                                    />

                                    {/* valid FileAttach */}
                                    {fieldValid.FileAttach && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrAttachFile
                                        disable={FileAttach.disable}
                                        // value={[{ exr: 'sdsadsa' },
                                        // { "ext": ".doc", "fileName": "docssss.doc",
                                        //  "path": "http://192.168.1.58:6200//Uploads//doc.doc",
                                        //   "size": 19 }]}
                                        value={FileAttach.value}
                                        multiFile={true}
                                        uri={'[URI_POR]/New_Home/SaveAttachFile'}
                                        onFinish={(file) => {
                                            // eslint-disable-next-line no-console
                                            console.log(file, 'data');
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ghi chú -  Note*/}
                        {OtherReason.visibleConfig && OtherReason.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'Comment'} />
                                    {fieldValid.Note && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={Note.disable}
                                        refresh={Note.refresh}
                                        value={Note.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                Note: {
                                                    ...Note,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* thông tin phê duyệt */}
                        {UserApproveID.visibleConfig ||
                            UserApproveID2.visibleConfig ||
                            UserApproveID3.visibleConfig ||
                            (UserApproveID4.visibleConfig && (
                                <View style={styleProfileInfo.styleViewTitleGroup}>
                                    <VnrText
                                        style={[styleSheets.text, styleProfileInfo.textLableGroup]}
                                        i18nKey={'HRM_HR_StopWorking_Info_Group_Approve'}
                                    />
                                </View>
                            ))}

                        {/* Người duyệt đầu - UserApproveID*/}
                        {UserApproveID.visibleConfig && UserApproveID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Attendance_Overtime_UserApproveID'}
                                    />

                                    {/* valid UserApproveID */}
                                    {fieldValid.UserApproveID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={{
                                            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_STOPWORKING',
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

                        {/* Người duyệt kế tiếp - UserApproveID2*/}
                        {UserApproveID2.visibleConfig && UserApproveID2.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Attendance_Overtime_UserApproveID3'}
                                    />

                                    {/* valid UserApproveID2 */}
                                    {fieldValid.UserApproveID2 && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={{
                                            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_STOPWORKING',
                                            type: 'E_GET'
                                        }}
                                        value={UserApproveID2.value}
                                        refresh={UserApproveID2.refresh}
                                        textField="UserInfoName"
                                        valueField="ID"
                                        filter={true}
                                        filterServer={true}
                                        filterParams="text"
                                        disable={UserApproveID2.disable}
                                        onFinish={(item) => {
                                            this.setState({
                                                UserApproveID2: {
                                                    ...UserApproveID2,
                                                    value: item
                                                }
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Người duyệt tiếp theo - UserApproveID3*/}
                        {UserApproveID3.visibleConfig && UserApproveID3.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Attendance_Att_Overtime_Submit_UserApproveID4'}
                                    />

                                    {/* valid UserApproveID3 */}
                                    {fieldValid.UserApproveID3 && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={{
                                            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_STOPWORKING',
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
                                                    value: item
                                                }
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Người duyệt cuối - UserApproveID4 */}
                        {UserApproveID4.visibleConfig && UserApproveID4.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Attendance_Overtime_UserApproveID2'}
                                    />

                                    {/* valid UserApproveID4 */}
                                    {fieldValid.UserApproveID4 && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={{
                                            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_STOPWORKING',
                                            type: 'E_GET'
                                        }}
                                        refresh={UserApproveID4.refresh}
                                        textField="UserInfoName"
                                        valueField="ID"
                                        filter={true}
                                        filterServer={true}
                                        value={UserApproveID4.value}
                                        filterParams="text"
                                        disable={UserApproveID4.disable}
                                        onFinish={(item) => this.onChangeUserApproveID4(item)}
                                    />
                                </View>
                            </View>
                        )}
                    </KeyboardAwareScrollView>

                    {/* bottom button close, confirm */}
                    <View style={styleButtonAddOrEdit.groupButton}>
                        <TouchableOpacity
                            onPress={() => DrawerServices.goBack()}
                            style={[styleButtonAddOrEdit.btnClose]}
                        >
                            <VnrText
                                style={[styleSheets.lable, { color: Colors.greySecondary }]}
                                i18nKey={'HRM_Common_Close'}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() =>
                                DrawerServices.navigate('HreSubmitStopWorkingAddOrEditNext', {
                                    dataConfirm: this.state,
                                    reload: this.props.navigation.state.params.reload,
                                    objConfig: {
                                        checkConfig: this.checkConfig,
                                        isOnlyOneLevelApprove: this.isOnlyOneLevelApprove,
                                        levelApproved: this.levelApproved,
                                        UpdateRequiredDocumentStopWorking: this.UpdateRequiredDocumentStopWorking,
                                        stopWorkingID: this.stopWorkingID,
                                        ContractTypeID: this.ContractTypeID
                                    }
                                })
                            }
                            style={styleButtonAddOrEdit.groupButton__button_Confirm}
                        >
                            <VnrText
                                style={[styleSheets.lable, styleButtonAddOrEdit.groupButton__text]}
                                i18nKey={'HRM_Common_Confirm'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    styTextAnnaulLeave: { color: Colors.white,
        marginRight: 10 },
    viewStyleDayPortal: {
        flex: 1,
        flexDirection: 'row',
        alignContent: 'space-between',
        justifyContent: 'center'
    },
    bntSearchManualLeave: {
        flexDirection: 'row',
        backgroundColor: Colors.primary,
        borderRadius: 5,
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginRight: 10
    },
    styleValueManualLeave: {
        flexDirection: 'row',
        alignContent: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        borderColor: Colors.grey,
        borderWidth: 0.5,
        flex: 1,
        borderRadius: 5
    }
});
