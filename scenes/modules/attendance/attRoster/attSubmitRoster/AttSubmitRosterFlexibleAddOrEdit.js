import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    Size,
    Colors,
    styleSafeAreaView,
    stylesModalPopupBottom,
    stylesListPickerControl,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import {
    IconArrowDown,
    IconColse,
    IconDate,
    IconRadioCheck,
    IconRadioUnCheck
} from '../../../../../constants/Icons';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrPickerQuickly from '../../../../../components/VnrPickerQuickly/VnrPickerQuickly';
import HttpService from '../../../../../utils/HttpService';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { translate } from '../../../../../i18n/translate';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { EnumName, EnumIcon } from '../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import moment from 'moment';
import { Calendar } from '../../../../../components/calendars';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import Modal from 'react-native-modal';
import VnrDate from '../../../../../components/VnrDate/VnrDate';

export default class AttSubmitRosterFlexibleAddOrEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            daySelected: moment(new Date()).format('YYYY-MM-DD'),
            currentMonth: null,
            dataFilter: null,
            isRefreshList: false,
            //Quyền
            isAllowChangeFlexbleShift: false,
            isAllowCancelAllStatus: true,
            isAllowChangeShiftApprove: true,
            isShowBtnCancel:
                PermissionForAppMobile &&
                PermissionForAppMobile.value['New_Att_ChangeShift_btnCancel'] &&
                PermissionForAppMobile.value['New_Att_ChangeShift_btnCancel']['View'],
            isShowBtnCancelWaitingApprove:
                PermissionForAppMobile &&
                PermissionForAppMobile.value['New_Att_ChangeShift_btnCancelWaitingApprove'] &&
                PermissionForAppMobile.value['New_Att_ChangeShift_btnCancelWaitingApprove']['View'],
            isShowBtnChooseShift:
                PermissionForAppMobile &&
                PermissionForAppMobile.value['New_Att_ChangeShift_btnChooseShift'] &&
                PermissionForAppMobile.value['New_Att_ChangeShift_btnChooseShift']['View'],
            isShowBtnSave:
                PermissionForAppMobile &&
                PermissionForAppMobile.value['New_Att_ChangeShift_btnSave'] &&
                PermissionForAppMobile.value['New_Att_ChangeShift_btnSave']['View'],
            ////
            isActiveSave: false,
            dataVnrStorage: null,
            isLoading: true,
            listSelected: [],
            listWaitingCancel: [],
            listWaitingChangeShift: [],
            dataShift: null,
            dataShiftBackup: null,
            statusCancel: [],
            numberStandard: 0,
            numberDifference: 0,
            loadShift: {
                refresh: false,
                value: null,
                data: null,
                visible: false,
                monthLoadShift: moment(new Date()).format('YYYY-MM-DD')
            },
            loadShiftManual: {
                refresh: false,
                value: null,
                data: null,
                visible: false,
                monthLoadShift: moment(new Date()).format('YYYY-MM-DD')
            },
            //isVisibleModalChoseShift: false,
            isVisibleModalChangeSchedule: false,
            DateChange: {
                value: null,
                ShiftName: '',
                disable: true,
                refresh: false
            },
            DateEnd: {
                value: null,
                ShiftName: '',
                disable: false,
                refresh: false
            },
            txtValid: '',
            txtDateChangeCompansation: '',
            typeChangeShift: {
                value: EnumName.E_SHIFT_MANUAL
            }
        };
        this.isProcessing = false;
    }

    onSelectDay = day => {
        this.setState({
            currentMonth: day,
            daySelected: day.dateString,
            dataFilter: day.timestamp
        });
    };

    onChangeMonth = value => {
        if (!value) {
            return;
        }

        this.setState(
            {
                currentMonth: value,
                daySelected: value.dateString,
                isRefreshList: !this.state.isRefreshList
                // keyQuery: EnumName.E_FILTER,
            },
            () => {
                this.initState(value.dateString);
            }
        );
    };

    refreshList = () => {
        this.setState({ isRefreshList: !this.state.isRefreshList });
        // this.pullToRefresh()
    };

    initState = dateMonth => {
        VnrLoadingSevices.show();

        const startOfMonth = moment(dateMonth)
            .startOf('month')
            .format('YYYY-MM-DD HH:mm:ss');
        const endOfMonth = moment(dateMonth)
            .endOf('month')
            .format('YYYY-MM-DD HH:mm:ss');

        const listRequest = [
            HttpService.Get(
                '[URI_HR]//Att_GetData/GetSettingByKey?Key=HRM_ATT_WORKDAY_SUMMARY_ISALLOWCHANGEFLEXIBLESHIFT'
            ),
            HttpService.Post('[URI_HR]//Att_GetData/GetListChangeRoster', {
                profileID: dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null,
                dateStart: startOfMonth,
                dateEnd: endOfMonth
            }),
            HttpService.Get('[URI_HR]//Att_GetData/GetSettingByKey?Key=HRM_ATT_ROSTER_STATUSCANCEL')
        ];

        HttpService.MultiRequest(listRequest).then(resAll => {
            let { isAllowChangeFlexbleShift } = this.state;
            const [configIsllowChangeFlexbleShift, resData, resStatusCancel] = resAll;
            if (resData && resData.length > 0) {
                let data = [],
                    _dataShift = [],
                    _dataShiftBackup = [],
                    calcStandard = 0,
                    firstDay = resData[0].DateStart,
                    checkDateOfWeek = moment(firstDay).day(),
                    dataStatusCancel = null;

                for (let i = 0; i < checkDateOfWeek; i++) {
                    data.push({});
                }

                if (checkDateOfWeek > 0) {
                    data = [...data, ...resData];
                } else {
                    data = resData;
                }

                data.forEach((item, index) => {
                    item.indexItem = index;
                    // (moment(item.DateStart).format('DD') == '18') &&
                    //     console.log(item)
                    if (item && item.DateStart && item.WorkHourStandard !== null) {
                        calcStandard += item.WorkHourStandard;
                        item.isSelect = false;
                    }
                    // else if(item && item.DateStart && item.WorkHour !== null && item.Type == EnumName.E_CHANGE_SHIFT_COMPANSATION){
                    //     calcStandard += item.WorkHour
                    //     item.isSelect = false;
                    // }
                    else item = { ...item, isSelect: false };

                    _dataShift.push({ ...item });
                    _dataShiftBackup.push({ ...item });
                });
                // console.log(calcStandard, 'calcStandard')

                // check cau hinh doi ca linh hoat
                if (configIsllowChangeFlexbleShift.Value1 == 'True' || configIsllowChangeFlexbleShift.Value1 == true) {
                    isAllowChangeFlexbleShift = true;
                }

                if (resStatusCancel && resStatusCancel.Value1) {
                    dataStatusCancel = resStatusCancel.Value1;
                }

                this.setState({
                    isLoading: false,
                    dataShift: _dataShift,
                    dataShiftBackup: _dataShiftBackup,
                    numberStandard: parseFloat(calcStandard.toFixed(2)),
                    numberDifference: 0,
                    listSelected: [],
                    listWaitingCancel: [],
                    listWaitingChangeShift: [],
                    isAllowChangeFlexbleShift: isAllowChangeFlexbleShift,
                    txtDateChangeCompansation: '',
                    isActiveSave: false,
                    statusCancel: dataStatusCancel.split(',')
                });
            } else {
                this.setState({
                    isLoading: false,
                    dataShift: EnumName.E_EMPTYDATA,
                    dataShiftBackup: null,
                    numberStandard: 0,
                    numberDifference: 0,
                    listSelected: [],
                    listWaitingCancel: [],
                    listWaitingChangeShift: [],
                    txtDateChangeCompansation: '',
                    isActiveSave: false,
                    statusCancel: []
                });
            }

            VnrLoadingSevices.hide();
            this.isProcessing = false;
        });
    };

    getFieldValid = () => {
        return HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=New_Att_ChangeShift__New_SaveReason');
    };

    selectDateItem = (index) => () => {
        const { dataShift, dataShiftBackup, numberStandard, isAllowChangeFlexbleShift, listWaitingCancel } = this.state;
        let { listWaitingChangeShift } = this.state;

        let { listSelected } = this.state,
            numberLineSelect = 0,
            newCalcStandard = 0,
            txtDateChangeCompansation;

        let item = dataShift[index],
            isActiveSave = false;


        if (!item.DateStart) return;

        // đã hũy tạm thì k được chọn nữa
        if (listWaitingCancel.length > 0) {
            const indexItemInListCancelTemp = listWaitingCancel.findIndex(e => e.indexItem == item.indexItem);
            if (indexItemInListCancelTemp > -1) return;
        }
        //     return;

        if (listSelected.length > 0) {
            let firstItem = listSelected[0];
            if (
                (firstItem.Type === EnumName.E_SHIFT_MANUAL ||
                    firstItem.Type === EnumName.E_CHANGE_SHIFT_COMPANSATION) &&
                listWaitingChangeShift.length == 0
            ) {
                //Type = E_SHIFT_MANUAL hoac E_CHANGE_SHIFT_COMPANSATION mới được hủy, đã check cấu hình được phép hủy
                if (item.Type === EnumName.E_SHIFT_MANUAL || item.Type === EnumName.E_CHANGE_SHIFT_COMPANSATION) {
                    item.isSelect = !item.isSelect;
                } else {
                    // Nếu chọn dòng không phải loại hủy thì k được phép chọn
                    return;
                }
            } else if (item.Type != EnumName.E_SHIFT_MANUAL && item.Type != EnumName.E_CHANGE_SHIFT_COMPANSATION) {
                item.isSelect = !item.isSelect;
            } else return;
        } else if (item.Type === EnumName.E_SHIFT_MANUAL || item.Type === EnumName.E_CHANGE_SHIFT_COMPANSATION) {
            if (item.Type === EnumName.E_SHIFT_MANUAL && listWaitingChangeShift.length > 0) {
                // Kiểm tra có trong list chờ Save thì cho phép unSelect
                const indexItemInList = listWaitingChangeShift.findIndex(e => e.indexItem == item.ID);
                if (indexItemInList) {
                    item.isSelect = !item.isSelect;
                    if (item.isSelect == false) {
                        listWaitingChangeShift.splice(indexItemInList, 1);
                    }
                }
            } else if (item.Type === EnumName.E_CHANGE_SHIFT_COMPANSATION && listWaitingChangeShift.length > 0) {
                item.isSelect = !item.isSelect;
                if (item.isSelect == false) {
                    let newlistWaitingChangeShift = [...listWaitingChangeShift];

                    listWaitingChangeShift.forEach((e) => {
                        let isDateChange = moment(item.DateChange).isSame(e.DateStart, 'day');

                        // sử lý hủy chọn ngày đổi ca
                        if (isDateChange) {
                            dataShift[e.indexItem] = dataShiftBackup[e.indexItem];
                            dataShift[e.indexItem].isSelect = false;
                            listSelected = Vnr_Function.removeObjectInArray(listSelected, e, 'indexItem');

                            let findIndex = newlistWaitingChangeShift.findIndex(el => el.indexItem == e.indexItem);
                            newlistWaitingChangeShift.splice(findIndex, 1);
                        }

                        if (e.indexItem == item.indexItem) {
                            let findIndex = newlistWaitingChangeShift.findIndex(el => el.indexItem == e.indexItem);
                            newlistWaitingChangeShift.splice(findIndex, 1);
                        }
                    });
                    listWaitingChangeShift = newlistWaitingChangeShift;
                }
            } else {
                item.isSelect = !item.isSelect;
            }
        } else if (item.Type != EnumName.E_SHIFT_MANUAL && item.Type != EnumName.E_CHANGE_SHIFT_COMPANSATION) {
            item.isSelect = !item.isSelect;
        }

        if (item.isSelect) {
            // kiem tra isSelect == true thi add vao mang itemSelected
            listSelected = listSelected.concat({ ...item });
        } else {
            //console.log(dataShiftBackup[index], ' dataShiftBackup[index];')
            dataShift[index] = dataShiftBackup[index];
            dataShift[index].isSelect = false;
            listSelected = Vnr_Function.removeObjectInArray(listSelected, item, 'indexItem');
        }

        dataShift.forEach(item => {
            if (item.isSelect && item.ShiftID !== dataShiftBackup[item.indexItem].ShiftID) {
                numberLineSelect += 1;
                newCalcStandard += item.WorkHour;
            } else if (item && item.DateStart && item.WorkHourStandard !== null) {
                newCalcStandard += item.WorkHourStandard;
            }
        });

        newCalcStandard = parseFloat(newCalcStandard.toFixed(2));

        /// nếu isAllowChangeFlexbleShift === false thì không cần kiểm tra số giờ chênh lệch
        if (isAllowChangeFlexbleShift === false && numberLineSelect > 0) {
            isActiveSave = true;
        } else if (newCalcStandard - numberStandard == 0 && numberLineSelect > 0) {
            isActiveSave = true;
        }

        // Xử lý và kiểm tra có đang chờ lưu hay không
        if (
            item.Type === 'E_CHANGE_SHIFT_COMPANSATION' &&
            item.IsFlexibleShift === null &&
            item.isSelect &&
            item.DateChange
        ) {
            txtDateChangeCompansation = item.DateChange;
        } else {
            txtDateChangeCompansation = '';
        }

        this.setState({
            dataShift,
            listSelected,
            listWaitingChangeShift,
            isActiveSave: isActiveSave,
            numberDifference: newCalcStandard - numberStandard,
            txtDateChangeCompansation: txtDateChangeCompansation
        });
    };

    changeShift = () => {

        const { loadShift, daySelected } = this.state;
        this.setState({
            loadShift: {
                ...loadShift,
                monthLoadShift: daySelected,
                visible: true
            }
        });

        // VnrLoadingSevices.show();

        // let dates = [];
        // dataShift.forEach(item => {
        //     if (item.isSelect) {
        //         dates.push(moment(item.DateStart).toDate());
        //     }
        // });

        // let maxDate = new Date(Math.max.apply(null, dates));
        // let minDate = new Date(Math.min.apply(null, dates));

        // const startOfMonth = moment(minDate).format('YYYY-MM-DD HH:mm:ss');
        // const endOfMonth = moment(maxDate).format('YYYY-MM-DD HH:mm:ss');

        // console.log({
        //     profileID: dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null,
        //     DateStart: startOfMonth,
        //     DateEnd: endOfMonth,
        // })
        // HttpService.Post('[URI_HR]//Att_GetData/GetListCatShiftRawData',
        //     {
        //         profileID: dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null,
        //         DateStart: startOfMonth,
        //         DateEnd: endOfMonth,
        //     })
        //     .then(res => {
        //         VnrLoadingSevices.hide();

        //         // const dataShiftRaw = res.map(item => {
        //         //     let shiftNameCustom = `${item.Code}`;
        //         //     if (item.InTime && item.EndShift && item.StdWorkHours) {
        //         //         shiftNameCustom = `${shiftNameCustom} (${moment(item.InTime).format('HH:mm')} - ${moment(item.EndShift).format('HH:mm')} | ${item.StdWorkHours} ${translate('Hour_Lowercase')})`;
        //         //     }
        //         //     else if (item.StdWorkHours) {
        //         //         shiftNameCustom = `${shiftNameCustom} (${item.StdWorkHours} ${translate('Hour_Lowercase')})`;
        //         //     }

        //         //     item.ShiftNameCustom = shiftNameCustom;
        //         //     return item;
        //         // })

        //         this.setState({
        //             loadShift: {
        //                 ...loadShift,
        //                 data: res,
        //                 monthLoadShift: daySelected,
        //                 visible: true
        //             }
        //         });
        //     })
    };

    onPickLoadShift = value => {
        let {
            loadShift,
            listSelected,
            dataShift,
            numberStandard,
            dataShiftBackup,
            isAllowChangeFlexbleShift
        } = this.state;
        let newCalcStandard = 0,
            numberLineSelect = 0,
            isActiveSave = false;

        let listWaitingChangeShift = [];
        if (!value) {
            this.setState({
                loadShift: {
                    ...loadShift,
                    visible: false
                }
            });
            return;
        }

        VnrLoadingSevices.show();

        listSelected.forEach(itemSl => {
            let item = dataShift[itemSl.indexItem];

            if (item) {
                dataShift[itemSl.indexItem] = {
                    ...item,
                    ShiftID: value.ID,
                    ShiftName: value.ShiftName,
                    WorkHour: value.WorkHours,
                    Type: 'E_SHIFT_MANUAL',
                    IsFlexibleShift: true
                };
            }
        });

        dataShift.forEach(item => {
            if (item.isSelect && item.ShiftID !== dataShiftBackup[item.indexItem].ShiftID) {
                numberLineSelect += 1;
                newCalcStandard += item.WorkHour;

                listWaitingChangeShift.push({
                    ...item,
                    DateEnd: Vnr_Function.formatDateAPI(item.DateEnd),
                    DateStart: Vnr_Function.formatDateAPI(item.DateStart)
                });
            } else if (item && item.DateStart && item.WorkHourStandard !== null) {
                newCalcStandard += item.WorkHourStandard;
            }
        });

        newCalcStandard = parseFloat(newCalcStandard.toFixed(2));

        // console.log(newCalcStandard,)
        /// nếu isAllowChangeFlexbleShift === false thì không cần kiểm tra số giờ chênh lệch
        if (isAllowChangeFlexbleShift === false && numberLineSelect > 0) {
            isActiveSave = true;
        } else if (newCalcStandard - numberStandard == 0 && numberLineSelect > 0) {
            isActiveSave = true;
        }


        this.setState(
            {
                loadShift: {
                    ...loadShift,
                    value: value,
                    visible: false
                },
                dataShift: dataShift,
                listSelected: [],
                listWaitingChangeShift: listWaitingChangeShift,
                isActiveSave: isActiveSave,
                numberDifference: newCalcStandard - numberStandard
            },
            () => VnrLoadingSevices.hide()
        );
    };

    changeShiftManual = () => {
        // const { loadShiftManual, daySelected } = this.state;
        // this.setState({
        //     loadShiftManual: {
        //         ...loadShiftManual,
        //         monthLoadShift: daySelected,
        //         visible: true
        //     }
        // });
        const { loadShiftManual, daySelected, dataShift } = this.state;
        let dates = [],
            getWorkHourFromlist = null,
            checkSameShift = {};

        dataShift.forEach(item => {
            if (item.isSelect) {
                getWorkHourFromlist = item.WorkHourStandard;
                checkSameShift[item.WorkHourStandard] = item.WorkHourStandard;
                dates.push(moment(item.DateStart).toDate());
            }
        });

        // nếu checkSameShift có nhiều key thì có nhiều là có ca khác nhau
        if (Object.keys(checkSameShift).length > 1) {
            ToasterSevice.showWarning('HRM_Portal_Att_ChangeShift_Casual_SelectSameStd', 5000);
            return;
        }

        VnrLoadingSevices.show();
        let maxDate = new Date(Math.max.apply(null, dates));
        let minDate = new Date(Math.min.apply(null, dates));

        const startOfMonth = moment(minDate).format('YYYY-MM-DD HH:mm:ss');
        const endOfMonth = moment(maxDate).format('YYYY-MM-DD HH:mm:ss');

        HttpService.Post('[URI_HR]//Att_GetData/GetListCatShiftNormalRawData', {
            profileID: dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null,
            DateStart: startOfMonth,
            DateEnd: endOfMonth,
            stdWorkHous: getWorkHourFromlist
        }).then(res => {
            VnrLoadingSevices.hide();

            const dataShiftRaw = res.map(item => {
                let shiftNameCustom = `${item.Code}`;
                if (item.InTime && item.EndShift && item.StdWorkHours) {
                    shiftNameCustom = `${shiftNameCustom} (${moment(item.InTime).format('HH:mm')} - ${moment(
                        item.EndShift
                    ).format('HH:mm')} | ${item.StdWorkHours} ${translate('Hour_Lowercase')})`;
                } else if (item.StdWorkHours) {
                    shiftNameCustom = `${shiftNameCustom} (${item.StdWorkHours} ${translate('Hour_Lowercase')})`;
                }

                item.ShiftNameCustom = shiftNameCustom;
                return item;
            });

            this.setState({
                loadShiftManual: {
                    ...loadShiftManual,
                    data: dataShiftRaw,
                    monthLoadShift: daySelected,
                    visible: true
                }
            });
        });
    };

    onPickloadShiftManual = value => {
        let {
            loadShiftManual,
            listSelected,
            dataShift,
            dataShiftBackup
        } = this.state;

        let listWaitingChangeShift = [];
        if (!value) {
            this.setState({
                loadShiftManual: {
                    ...loadShiftManual,
                    visible: false
                }
            });
            return;
        }

        VnrLoadingSevices.show();

        listSelected.forEach(itemSl => {
            let item = dataShift[itemSl.indexItem];

            if (item) {
                dataShift[itemSl.indexItem] = {
                    ...item,
                    ShiftID: value.ID,
                    ShiftName: value.ShiftName,
                    WorkHour: value.WorkHours,
                    Type: 'E_SHIFT_MANUAL',
                    IsFlexibleShift: null
                };
            }
        });

        dataShift.forEach(item => {
            if (item.isSelect && item.ShiftID !== dataShiftBackup[item.indexItem].ShiftID) {

                listWaitingChangeShift.push({
                    ...item,
                    DateEnd: Vnr_Function.formatDateAPI(item.DateEnd),
                    DateStart: Vnr_Function.formatDateAPI(item.DateStart)
                });
            }
        });

        this.setState(
            {
                loadShiftManual: {
                    ...loadShiftManual,
                    value: value,
                    visible: false
                },
                dataShift: dataShift,
                listSelected: [],
                listWaitingChangeShift: listWaitingChangeShift,
                isActiveSave: true
            },
            () => VnrLoadingSevices.hide()
        );
    };

    changeShiftCompansation = () => {
        const { DateChange, listSelected } = this.state;

        VnrLoadingSevices.show();

        const dataChange = listSelected[0];

        HttpService.Post('[URI_HR]//Att_GetData/GetShiftByChangeDate', {
            profileID: dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null,
            changeDate: Vnr_Function.formatDateAPI(dataChange.DateStart)
        }).then(res => {
            VnrLoadingSevices.hide();

            //if (res && Array.isArray(res) && res.length > 0) {
            const data = res[0];
            this.setState({
                isVisibleModalChangeSchedule: true,
                DateChange: {
                    ...DateChange,
                    value: dataChange.DateStart,
                    ShiftName: data && data.ShiftNameView ? data.ShiftNameView : '',
                    visible: true
                }
            });
            //}
        });
    };

    dateEndChange = value => {
        const { DateEnd } = this.state;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]//Att_GetData/GetShiftByChangeDate', {
            profileID: dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null,
            changeDate: Vnr_Function.formatDateAPI(value)
        }).then(res => {
            VnrLoadingSevices.hide();

            if (res && Array.isArray(res) && res.length > 0) {
                const data = res[0];
                this.setState({
                    txtValid: translate('WarningRegisterRosterTypeCompensationShiftDifference'),
                    DateEnd: {
                        ...DateEnd,
                        value: value,
                        ShiftName: data.ShiftNameView
                    }
                });
            } else {
                this.setState({
                    txtValid: '',
                    DateEnd: {
                        ...DateEnd,
                        value: value,
                        ShiftName: ''
                    }
                });
            }
        });
    };

    confirmChangeShift = () => {

        const { DateChange, DateEnd } = this.state;
        let { listSelected, dataShift, listWaitingChangeShift } = this.state;
        if (DateEnd.ShiftName !== '') {
            return;
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/CheckDateIsHoliday', {
            date: moment(DateEnd.value).format('YYYY-MM-DD HH:mm:ss')
        }).then(result => {
            VnrLoadingSevices.hide();

            if (result) {
                let formatDate = moment(DateEnd.value).format('DD/MM/YYYY'),
                    rpl = translate('HRM_Att_ChangeShiftDetail_AltDate_Holiday').replace('{0}', formatDate);

                ToasterSevice.showWarning(rpl);
            } else {
                // let listWaitingChangeShift = [];
                let findIndexDateEnd = dataShift.findIndex(
                    e => moment(e.DateStart).format('DD/MM/YYYY') === moment(DateEnd.value).format('DD/MM/YYYY')
                );

                VnrLoadingSevices.show();

                if (findIndexDateEnd > -1) {
                    // ngày thay thế

                    listSelected.forEach(itemSl => {
                        let item = dataShift[itemSl.indexItem]; // ngày đc chọn

                        if (item && dataShift[findIndexDateEnd]) {
                            listWaitingChangeShift.push({
                                ...dataShift[findIndexDateEnd],
                                DateStart: Vnr_Function.formatDateAPI(dataShift[findIndexDateEnd].DateStart),
                                DateEnd: Vnr_Function.formatDateAPI(dataShift[findIndexDateEnd].DateEnd),
                                DateChange: Vnr_Function.formatDateAPI(DateChange.value),
                                IsRootDate: false,
                                IsFlexibleShift: null,
                                Type: EnumName.E_CHANGE_SHIFT_COMPANSATION,
                                ShiftID: item.ShiftID,
                                ShiftName: item.ShiftName,
                                WorkHour: item.WorkHour,
                                WorkHourStandard: item.WorkHourStandard
                            });

                            listWaitingChangeShift.push({
                                ...item,
                                DateChange: Vnr_Function.formatDateAPI(DateEnd.value),
                                IsRootDate: true,
                                IsFlexibleShift: null,
                                Type: EnumName.E_CHANGE_SHIFT_COMPANSATION,
                                DateStart: Vnr_Function.formatDateAPI(item.DateStart),
                                DateEnd: Vnr_Function.formatDateAPI(item.DateEnd),
                                ShiftID: null,
                                ShiftName: null,
                                WorkHour: 0,
                                WorkHourStandard: 0
                            });

                            dataShift[findIndexDateEnd] = {
                                ...item,
                                DateChange: DateChange.value,
                                DateStart: dataShift[findIndexDateEnd].DateStart,
                                DateEnd: dataShift[findIndexDateEnd].DateEnd,
                                Type: EnumName.E_CHANGE_SHIFT_COMPANSATION,
                                IsFlexibleShift: null,
                                StatusView: null
                            };

                            dataShift[itemSl.indexItem] = {
                                ...dataShift[findIndexDateEnd],
                                DateChange: DateEnd.value,
                                ShiftID: null,
                                ShiftName: null,
                                WorkHour: 0,
                                Description: null,
                                Type: EnumName.E_CHANGE_SHIFT_COMPANSATION,
                                IsFlexibleShift: null
                            };
                        }
                    });

                    this.setState(
                        {
                            DateEnd: {
                                ...DateEnd,
                                value: null,
                                ShiftName: ''
                            },
                            dataShift: dataShift,
                            listSelected: [],
                            listWaitingChangeShift: listWaitingChangeShift,
                            isActiveSave: true,
                            isVisibleModalChangeSchedule: false
                        },
                        () => VnrLoadingSevices.hide()
                    );
                } else {
                    listSelected.forEach(itemSl => {
                        let item = dataShift[itemSl.indexItem]; // ngày đc chọn

                        if (item) {
                            listWaitingChangeShift.push({
                                // ...dataShift[findIndexDateEnd],
                                DateStart: Vnr_Function.formatDateAPI(DateEnd.value),
                                DateEnd: Vnr_Function.formatDateAPI(DateEnd.value),
                                DateChange: Vnr_Function.formatDateAPI(DateChange.value),
                                IsRootDate: false,
                                IsFlexibleShift: null,
                                Type: EnumName.E_CHANGE_SHIFT_COMPANSATION,
                                ShiftID: item.ShiftID,
                                ShiftName: item.ShiftName,
                                WorkHour: item.WorkHour,
                                WorkHourStandard: item.WorkHourStandard
                            });

                            listWaitingChangeShift.push({
                                ...item,
                                DateChange: Vnr_Function.formatDateAPI(DateEnd.value),
                                IsRootDate: true,
                                IsFlexibleShift: null,
                                Type: EnumName.E_CHANGE_SHIFT_COMPANSATION,
                                DateStart: Vnr_Function.formatDateAPI(item.DateStart),
                                DateEnd: Vnr_Function.formatDateAPI(item.DateEnd),
                                ShiftID: null,
                                ShiftName: null,
                                WorkHour: 0,
                                WorkHourStandard: 0
                            });

                            // dataShift[findIndexDateEnd] = {
                            //     ...item,
                            //     Type: EnumName.E_CHANGE_SHIFT_COMPANSATION,
                            //     IsFlexibleShift: null,
                            //     StatusView: null
                            // };

                            dataShift[itemSl.indexItem] = {
                                // ...dataShift[findIndexDateEnd],
                                ...item,
                                isSelect: false,
                                ShiftID: null,
                                ShiftName: null,
                                WorkHour: 0,
                                Type: EnumName.E_CHANGE_SHIFT_COMPANSATION,
                                IsFlexibleShift: null
                            };
                        }
                    });

                    this.setState(
                        {
                            DateEnd: {
                                ...DateEnd,
                                value: null,
                                ShiftName: ''
                            },
                            dataShift: dataShift,
                            listSelected: [],
                            listWaitingChangeShift: listWaitingChangeShift,
                            isActiveSave: true,
                            isVisibleModalChangeSchedule: false
                        },
                        () => VnrLoadingSevices.hide()
                    );
                }
            }
        });
    };

    saveRoster = () => {
        if (this.isProcessing) return;

        this.isProcessing = true;

        const { listWaitingCancel, listWaitingChangeShift } = this.state;

        let dataSave = [],
            dataCancel = [];

        VnrLoadingSevices.show();

        if (listWaitingCancel.length > 0) {
            // dữ liệu hủy
            dataCancel = listWaitingCancel;
        }

        if (listWaitingChangeShift.length > 0) {
            // dữ liệu tạo mới
            dataSave = listWaitingChangeShift;
            // dataShift.forEach(item => {
            //     if (item.isSelect && item.ShiftID !== dataShiftBackup[item.indexItem].ShiftID) {
            //         let newItem = {
            //             ...item,
            //             DateEnd: Vnr_Function.formatDateAPI(item.DateEnd),
            //             DateStart: Vnr_Function.formatDateAPI(item.DateStart)
            //         }
            //         dataSave.push(newItem);
            //     }

            // });

            //console.log(listWaitingChangeShift, dataSave, 'compare')
        }

        if (dataCancel.length > 0 && dataSave.length > 0) {

            VnrLoadingSevices.show();
            this.getFieldValid().then(res => {
                VnrLoadingSevices.hide();
                const fieldValid = res;
                AlertSevice.alert({
                    iconType: EnumIcon.E_INFO,
                    title: 'HRM_Portal_Att_ChangeShift_Save_Reason',
                    textLeftButton: 'HRM_Portal_Att_ChangeShift_btnCancel',
                    textRightButton: 'HRM_Portal_Att_ChangeShift_btnConfirm',
                    isValidInputText: fieldValid['Comment'] ? true : false,
                    isInputText: true,
                    placeholder: translate('HRM_Portal_Att_ChangeShift_Reason'),
                    onCancel: () => {
                        this.isProcessing = false;
                    },
                    onConfirm: text => {
                        if (fieldValid['Comment'] && (!text || text === '')) {
                            ToasterSevice.showWarning('HRM_Portal_Att_ChangeShift_Save_Reason_Empty', 5000);
                            this.isProcessing = false;
                        } else {
                            this.requestSaveAndCancelRoster(text, dataSave, dataCancel);
                        }
                        // if (text && text !== '') {
                        //     this.requestSaveAndCancelRoster(text, dataSave, dataCancel);
                        // }
                        // else {
                        //     ToasterSevice.showWarning('HRM_Portal_Att_ChangeShift_Save_Reason_Empty', 5000)
                        //     this.isProcessing = false;
                        //     this.saveRoster();
                        // }
                    }
                });
            });
            VnrLoadingSevices.hide();
        } else if (dataCancel.length > 0) {
            this.requestCancelRoster(dataCancel);
        } else if (dataSave.length > 0) {
            // Lưu đổi ca
            VnrLoadingSevices.show();
            this.getFieldValid().then(res => {
                VnrLoadingSevices.hide();
                const fieldValid = res;
                AlertSevice.alert({
                    iconType: EnumIcon.E_INFO,
                    title: 'HRM_Portal_Att_ChangeShift_Save_Reason',
                    textLeftButton: 'HRM_Portal_Att_ChangeShift_btnCancel',
                    textRightButton: 'HRM_Portal_Att_ChangeShift_btnConfirm',
                    isValidInputText: fieldValid['Comment'] ? true : false,
                    isInputText: true,
                    placeholder: translate('HRM_Portal_Att_ChangeShift_Reason'),
                    onCancel: () => {
                        this.isProcessing = false;
                    },
                    onConfirm: text => {
                        if (fieldValid['Comment'] && (!text || text === '')) {
                            ToasterSevice.showWarning('HRM_Portal_Att_ChangeShift_Save_Reason_Empty', 5000);
                            this.isProcessing = false;
                        } else {
                            this.requestSaveRoster(text, dataSave);
                        }
                    }
                });
            });
        } else {
            this.isProcessing = false;
            VnrLoadingSevices.hide();
        }
    };

    requestSaveAndCancelRoster = (comment, dataSave, dataCancel) => {
        let newListChangeRoster = dataSave,
            Concept = null;

        const firstItem = newListChangeRoster[0];

        if (firstItem.Type === EnumName.E_SHIFT_MANUAL && firstItem.IsFlexibleShift === null) {
            // đổi ca bình thường
            Concept = 'E_SHIFT_NON_FLEXIBLE';
        } else if (firstItem.Type === EnumName.E_CHANGE_SHIFT_COMPANSATION && firstItem.IsFlexibleShift === null) {
            // đổi lich làm việc
            Concept = 'E_CHANGE_SHIFT_COMPANSATION';
        } else if (firstItem.Type === EnumName.E_SHIFT_MANUAL && firstItem.IsFlexibleShift === true) {
            // đổi ca linh hoạt
            Concept = 'E_SHIFT_FLEXIBLE';
        }

        const dataBodySaveRoster = { listChangeRoster: newListChangeRoster, comment: comment, concept: Concept },
            dataBodyCancel = { listRosterCancel: dataCancel, commentCancel: dataCancel[0].CommentCancel },
            { navigation } = this.props;

        VnrLoadingSevices.show();
        // let listRequest = [
        //     HttpService.Post('[URI_HR]//Att_GetData/SaveListChangeRoster', dataBodySaveRoster),
        //     HttpService.Post('[URI_HR]//Att_GetData/CancelListChangeRoster', dataBodyCancel)
        // ];

        HttpService.Post('[URI_HR]//Att_GetData/CancelListChangeRoster', dataBodyCancel).then(resCancel => {
            VnrLoadingSevices.hide();

            // console.log(data, 'CancelListChangeRoster')
            if (resCancel == 'Success') {
                VnrLoadingSevices.show();
                HttpService.Post('[URI_HR]//Att_GetData/SaveListChangeRoster', dataBodySaveRoster).then(resSave => {
                    VnrLoadingSevices.hide();
                    if (resSave != 'Success') {
                        ToasterSevice.showWarning(resSave);

                        // //xử lý lại event Save
                        this.isProcessing = false;
                    } else if (resSave == 'Success') {
                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);

                        navigation.goBack();

                        const { reload } = navigation.state.params;
                        if (reload && typeof reload === 'function') {
                            reload();
                        }
                    } else if (typeof resSave === 'string') {
                        ToasterSevice.showWarning(translate(resSave.ActionStatus), 4000);

                        // //xử lý lại event Save
                        this.isProcessing = false;
                    }
                });
            } else if (typeof resCancel === 'string') {
                ToasterSevice.showWarning(translate(resCancel), 4000);

                // //xử lý lại event Save
                this.isProcessing = false;
            }
        });

        // HttpService.MultiRequest(listRequest)
        //     .then(resAll => {
        //         VnrLoadingSevices.hide();

        //         let resSave = resAll[0],
        //             resCancel = resAll[1];

        //         if (resSave == 'Success' && resCancel == 'Success') {
        //             ToasterSevice.showSuccess("Hrm_Succeed", 4000);

        //             //navigation.navigate('AttSubmitRoster');
        //             navigation.goBack();

        //             const { reload } = navigation.state.params;
        //             if (reload && typeof (reload) === 'function') {
        //                 reload();
        //             }
        //         }
        //         else {
        //             if (typeof resCancel === 'string') {
        //                 ToasterSevice.showWarning(translate(resCancel), 4000);

        //                 // //xử lý lại event Save
        //                 this.isProcessing = false;
        //             }

        //             else if (typeof resSave === 'string') {
        //                 ToasterSevice.showWarning(translate(data.ActionStatus), 4000);

        //                 // //xử lý lại event Save
        //                 this.isProcessing = false;
        //             }
        //             else {
        //                 ToasterSevice.showWarning(data);
        //                 //xử lý lại event Save
        //                 this.isProcessing = false;
        //             }
        //         }
        //     })
    };

    requestSaveRoster = (comment, dataSave) => {
        let newListChangeRoster = dataSave,
            Concept = null;

        const firstItem = newListChangeRoster[0];

        if (firstItem.Type === EnumName.E_SHIFT_MANUAL && firstItem.IsFlexibleShift === null) {
            // đổi ca bình thường
            Concept = 'E_SHIFT_NON_FLEXIBLE';
        } else if (firstItem.Type === EnumName.E_CHANGE_SHIFT_COMPANSATION && firstItem.IsFlexibleShift === null) {
            // đổi lich làm việc
            Concept = 'E_CHANGE_SHIFT_COMPANSATION';
        } else if (firstItem.Type === EnumName.E_SHIFT_MANUAL && firstItem.IsFlexibleShift === true) {
            // đổi ca linh hoạt
            Concept = 'E_SHIFT_FLEXIBLE';
        }


        const dataBody = { listChangeRoster: newListChangeRoster, comment: comment, concept: Concept },
            { navigation } = this.props;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]//Att_GetData/SaveListChangeRoster', dataBody).then(data => {
            VnrLoadingSevices.hide();

            if (data != 'Success') {
                ToasterSevice.showWarning(data);

                // //xử lý lại event Save
                this.isProcessing = false;
            } else if (data == 'Success') {
                ToasterSevice.showSuccess('Hrm_Succeed', 4000);

                navigation.goBack();

                const { reload } = navigation.state.params;
                if (reload && typeof reload === 'function') {
                    reload();
                }
            } else if (typeof data === 'string') {
                ToasterSevice.showWarning(translate(data.ActionStatus), 4000);

                // //xử lý lại event Save
                this.isProcessing = false;
            }
        });
    };

    requestCancelRoster = dataCancel => {
        VnrLoadingSevices.show();

        const dataBody = { listRosterCancel: dataCancel, commentCancel: dataCancel[0].CommentCancel },
            { navigation } = this.props;

        HttpService.Post('[URI_HR]//Att_GetData/CancelListChangeRoster', dataBody).then(data => {
            VnrLoadingSevices.hide();
            if (data == 'Success') {
                ToasterSevice.showSuccess('Hrm_Succeed', 4000);

                //navigation.navigate('AttSubmitRoster');
                navigation.goBack();

                const { reload } = navigation.state.params;
                if (reload && typeof reload === 'function') {
                    reload();
                }
            } else if (typeof data === 'string') {
                ToasterSevice.showWarning(translate(data), 4000);

                // //xử lý lại event Save
                this.isProcessing = false;
            }
        });
    };

    commentReasonCancel = () => {
        const { listSelected, listWaitingCancel, statusCancel } = this.state;

        if (this.isProcessing || listSelected.length < 0) return;

        let isApproveStatus = true;

        [...listSelected, ...listWaitingCancel].forEach(item => {
            if (isApproveStatus && statusCancel.includes(item.Status) == false) {
                isApproveStatus = false;
            }
        });

        if (!isApproveStatus) {
            let stringStatus = '';
            statusCancel.forEach(item => {
                stringStatus += `${stringStatus != '' ? ', ' : ''} ${translate(item)}`;
            });

            ToasterSevice.showWarning(`${translate('HRM_HR_StatusCanNotChangeToCancel')}[${stringStatus}]`, 6000);
            return;
        } else {
            AlertSevice.alert({
                iconType: EnumIcon.E_CANCEL,
                title: 'HRM_Portal_Att_ChangeShift_btnCancelWaitingApprove_Reason',
                textLeftButton: 'HRM_Portal_Att_ChangeShift_btnCancel',
                textRightButton: 'HRM_Portal_Att_ChangeShift_btnConfirm',
                isInputText: true,
                onCancel: () => {
                    this.isProcessing = false;
                },
                onConfirm: text => {
                    this.cancelTempShiftWatingApprove(text);
                }
            });
        }
    };

    cancelTempShiftWatingApprove = async reasonCancel => {
        const { listSelected, isAllowChangeFlexbleShift, daySelected, numberStandard, listWaitingCancel } = this.state;

        if (this.isProcessing || listSelected.length < 0) return;

        this.isProcessing = true;

        let dataSaveCancelTemp = [];

        VnrLoadingSevices.show();

        [...listSelected, ...listWaitingCancel].forEach(item => {
            let newItem = {
                ...item,
                DateEnd: Vnr_Function.formatDateAPI(item.DateEnd),
                DateStart: Vnr_Function.formatDateAPI(item.DateStart),
                CommentCancel: reasonCancel
            };
            dataSaveCancelTemp.push(newItem);
        });

        const startOfMonth = moment(daySelected)
            .startOf('month')
            .format('YYYY-MM-DD HH:mm:ss');
        const endOfMonth = moment(daySelected)
            .endOf('month')
            .format('YYYY-MM-DD HH:mm:ss');

        const checkLengthComment = await HttpService.Post(
            '[URI_HR]/Att_GetData/ValidateCancelListChangeRosterFlexible',
            {
                commentCancel: reasonCancel ? reasonCancel : ''
            }
        );

        if (checkLengthComment != '') {
            ToasterSevice.showWarning(checkLengthComment);
            VnrLoadingSevices.hide();
            return;
        }

        const checkValidListCancel = await HttpService.Post('[URI_HR]/Att_GetData/ValidateCancelListChangeRoster', {
            listRosterCancel: dataSaveCancelTemp
        });

        if (checkValidListCancel != 'Success') {
            ToasterSevice.showWarning(checkValidListCancel);
            VnrLoadingSevices.hide();
            return;
        }

        HttpService.Post('[URI_HR]//Att_GetData/GetListChangeRoster', {
            profileID: dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null,
            dateStart: startOfMonth,
            dateEnd: endOfMonth,
            listCancelTemp: dataSaveCancelTemp
        }).then(resData => {
            // console.log(resData, 'GetListChangeRoster')

            if (resData && resData.length > 0) {
                let data = [],
                    _dataShift = [],
                    _dataShiftBackup = [],
                    calcStandard = 0,
                    isActiveSave = false,
                    firstDay = resData[0].DateStart,
                    checkDateOfWeek = moment(firstDay).day();

                for (let i = 0; i < checkDateOfWeek; i++) {
                    data.push({});
                }

                if (checkDateOfWeek > 0) {
                    data = [...data, ...resData];
                } else {
                    data = resData;
                }

                data.forEach((item, index) => {
                    item.indexItem = index;
                    // (moment(item.DateStart).format('DD') == '18') &&
                    //     console.log(item)
                    if (item && item.DateStart && item.WorkHourStandard !== null) {
                        calcStandard += item.WorkHourStandard;
                        item.isSelect = false;
                    } else item = { ...item, isSelect: false };

                    _dataShift.push({ ...item });
                    _dataShiftBackup.push({ ...item });
                });
                // console.log(calcStandard, numberStandard)
                calcStandard = parseFloat(calcStandard.toFixed(2));

                /// nếu isAllowChangeFlexbleShift === false thì không cần kiểm tra số giờ chênh lệch
                if (isAllowChangeFlexbleShift === false) {
                    isActiveSave = true;
                } else if (numberStandard - calcStandard == 0) {
                    isActiveSave = true;
                } else {
                    // ToasterSevice.showWarning(, 4000);
                }

                this.setState({
                    isLoading: false,
                    dataShift: _dataShift,
                    dataShiftBackup: _dataShiftBackup,
                    isActiveSave: isActiveSave,
                    numberStandard: calcStandard,
                    numberDifference: numberStandard - calcStandard,
                    listSelected: [],
                    listWaitingCancel: dataSaveCancelTemp
                });
            } else {
                this.setState({
                    isLoading: false,
                    dataShift: EnumName.E_EMPTYDATA,
                    dataShiftBackup: null,
                    numberStandard: 0,
                    numberDifference: 0,
                    listSelected: [],
                    listWaitingCancel: []
                });
            }

            VnrLoadingSevices.hide();
            this.isProcessing = false;
        });

        // this.initState(daySelected, dataSave)
    };

    undoChange = () => {
        AlertSevice.alert({
            iconType: EnumIcon.E_WARNING,
            title: 'E_WARNING',
            message: 'HRM_Portal_Att_ChangeShift_Cancel_Confirm',
            textRightButton: 'Confirm',
            textLeftButton: 'HRM_Common_Close',
            // onCancel: () => { },
            onConfirm: () => {
                this.initState(this.state.daySelected);
            }
        });
    };

    componentDidMount() {
        this.initState(this.state.daySelected);
    }

    showChangeShift = () => {
        const { listWaitingChangeShift, dataShiftBackup, dataShift, listSelected, typeChangeShift } = this.state;

        // Nếu các ngày đang chọn tồn tại một ngày không có ca làm việc thì dừng xử lý ở popup này và hiện thông báo
        if (
            typeChangeShift.value == EnumName.E_SHIFT_MANUAL
            //|| typeChangeShift.value == EnumName.E_SHIFT_FLEXIBLE
        ) {
            let isCheckDayHaveNotShift = false;
            listSelected.map(item => {
                if (item.ShiftID == null && item.WorkHourStandard == 0) {
                    isCheckDayHaveNotShift = true;
                }
            });

            if (isCheckDayHaveNotShift) {
                ToasterSevice.showWarning('HRM_Portal_Att_ChangeShift_Casual_SelectNoStd');
                return;
            }
        }

        if (typeChangeShift.value == EnumName.E_CHANGE_SHIFT_COMPANSATION && listSelected.length != 1) {
            ToasterSevice.showWarning('HRM_Portal_Att_ChangeShift_ChangeSchedule_SelectOne');
            return;
        }

        if (listWaitingChangeShift.length > 0) {
            // có dữ liệu chờ duyệt, ràng buộc chọn đúng loại dữ liệu chờ lưu
            const firstItem = listWaitingChangeShift[0];

            if (
                typeChangeShift.value == EnumName.E_SHIFT_MANUAL &&
                firstItem.Type === EnumName.E_SHIFT_MANUAL &&
                firstItem.IsFlexibleShift === null
            ) {
                this.changeShiftManual();
            } else if (
                typeChangeShift.value == EnumName.E_CHANGE_SHIFT_COMPANSATION &&
                firstItem.Type === EnumName.E_CHANGE_SHIFT_COMPANSATION &&
                firstItem.IsFlexibleShift === null
            ) {
                this.changeShiftCompansation();
            } else if (
                typeChangeShift.value == EnumName.E_SHIFT_FLEXIBLE &&
                firstItem.Type === EnumName.E_SHIFT_MANUAL &&
                firstItem.IsFlexibleShift === true
            ) {
                this.changeShift();
            } else {
                AlertSevice.alert({
                    iconType: EnumIcon.E_WARNING,
                    message: 'HRM_Portal_Att_ChangeShift_Difference_Concept',
                    onCancel: () => {},
                    onConfirm: () => {
                        listWaitingChangeShift.map(item => {
                            dataShift[item.indexItem] = dataShiftBackup[item.indexItem];
                            dataShift[item.indexItem].isSelect = false;
                        });

                        this.setState(
                            {
                                dataShift: dataShift,
                                listWaitingChangeShift: [],
                                isActiveSave: true
                                // numberDifference: newCalcStandard - numberStandard
                            },
                            () => this.choseChangeShift(typeChangeShift.value)
                        );
                    }
                });
                return;
            }
        } else if (typeChangeShift.value == EnumName.E_SHIFT_MANUAL) {
            this.changeShiftManual();
        } else if (typeChangeShift.value == EnumName.E_CHANGE_SHIFT_COMPANSATION) {
            this.changeShiftCompansation();
        } else {
            this.changeShift();
        }
    };

    choseChangeShift = enumType => {
        const { listWaitingChangeShift, dataShiftBackup, dataShift } = this.state;

        // Nếu các ngày đang chọn tồn tại một ngày không có ca làm việc thì dừng xử lý ở popup này và hiện thông báo
        // if (enumType == EnumName.E_SHIFT_MANUAL || enumType == EnumName.E_SHIFT_FLEXIBLE) {
        //     let isCheckDayHaveNotShift = false;
        //     listSelected.map(item => {
        //         if (item.ShiftID == null && item.WorkHourStandard == 0) {
        //             isCheckDayHaveNotShift = true;
        //         }
        //     });

        //     if (isCheckDayHaveNotShift) {
        //         ToasterSevice.showWarning('HRM_Portal_Att_ChangeShift_Casual_SelectNoStd');
        //         return;
        //     }
        // }

        // if (enumType == EnumName.E_CHANGE_SHIFT_COMPANSATION && listSelected.length != 1) {
        //     ToasterSevice.showWarning('HRM_Portal_Att_ChangeShift_ChangeSchedule_SelectOne');
        //     return;
        // }

        // this.setState({
        //     isVisibleModalChoseShift: false
        // });

        if (listWaitingChangeShift.length > 0) {
            // có dữ liệu chờ duyệt, ràng buộc chọn đúng loại dữ liệu chờ lưu
            const firstItem = listWaitingChangeShift[0];

            if (
                enumType == EnumName.E_SHIFT_MANUAL &&
                firstItem.Type === EnumName.E_SHIFT_MANUAL &&
                firstItem.IsFlexibleShift === null
            ) {
                // this.changeShiftManual();
                this.setState({
                    typeChangeShift: {
                        value: EnumName.E_SHIFT_MANUAL
                    }
                });
            } else if (
                enumType == EnumName.E_CHANGE_SHIFT_COMPANSATION &&
                firstItem.Type === EnumName.E_CHANGE_SHIFT_COMPANSATION &&
                firstItem.IsFlexibleShift === null
            ) {
                // this.changeShiftCompansation();
                this.setState({
                    typeChangeShift: {
                        value: EnumName.E_CHANGE_SHIFT_COMPANSATION
                    }
                });
            } else if (
                enumType == EnumName.E_SHIFT_FLEXIBLE &&
                firstItem.Type === EnumName.E_SHIFT_MANUAL &&
                firstItem.IsFlexibleShift === true
            ) {
                // this.changeShift();
                this.setState({
                    typeChangeShift: {
                        value: EnumName.E_SHIFT_FLEXIBLE
                    }
                });
            } else {
                AlertSevice.alert({
                    iconType: EnumIcon.E_WARNING,
                    message: 'HRM_Portal_Att_ChangeShift_Difference_Concept',
                    onCancel: () => {},
                    onConfirm: () => {
                        listWaitingChangeShift.map(item => {
                            dataShift[item.indexItem] = dataShiftBackup[item.indexItem];
                            dataShift[item.indexItem].isSelect = false;
                        });

                        this.setState(
                            {
                                dataShift: dataShift,
                                listWaitingChangeShift: [],
                                isActiveSave: true
                                // numberDifference: newCalcStandard - numberStandard
                            },
                            () => this.choseChangeShift(enumType)
                        );
                    }
                });
                return;
            }
        } else if (enumType == EnumName.E_SHIFT_MANUAL) {
            // this.changeShiftManual();
            this.setState({
                typeChangeShift: {
                    value: EnumName.E_SHIFT_MANUAL
                }
            });
        } else if (enumType == EnumName.E_CHANGE_SHIFT_COMPANSATION) {
            //this.changeShiftCompansation()
            this.setState({
                typeChangeShift: {
                    value: EnumName.E_CHANGE_SHIFT_COMPANSATION
                }
            });
        } else {
            this.setState({
                typeChangeShift: {
                    value: EnumName.E_SHIFT_FLEXIBLE
                }
            });
            //this.changeShift();
        }
    };

    hideModalChangeSchedule = () => {
        this.setState({
            isVisibleModalChangeSchedule: false
        });
    };

    render() {
        const {
            refreshCalendarHeaderTotal,
            daySelected,
            dataShift,
            numberStandard,
            numberDifference,
            listSelected,
            loadShift,
            loadShiftManual,
            isActiveSave,
            isAllowChangeFlexbleShift,
            isShowBtnCancelWaitingApprove,
            isShowBtnCancel,
            isShowBtnChooseShift,
            isShowBtnSave,
            isVisibleModalChangeSchedule,
            DateChange,
            DateEnd,
            txtValid,
            txtDateChangeCompansation,
            typeChangeShift,
            isAllowChangeShiftApprove
        } = this.state;

        const { textLableInfo, contentViewControl, viewControl } = stylesListPickerControl;

        let contentViewshift = <View style={styleSheets.container} />,
            colorNumberDifferance = Colors.red,
            lisWeekName = {
                VN: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
                EN: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            },
            lableBtnChangeShift = '',
            contentBtnChangeShift = <View />;

        const firstItemSelect = listSelected.length > 0 ? listSelected[0] : null;

        if (numberDifference == 0) colorNumberDifferance = Colors.green;
        else if (numberDifference > 0) colorNumberDifferance = Colors.primary;
        else colorNumberDifferance = Colors.red;

        if (typeChangeShift.value == EnumName.E_SHIFT_FLEXIBLE) {
            lableBtnChangeShift = 'HRM_Portal_Att_ChangeShift_ShiftType_Flexible';
        } else if (typeChangeShift.value == EnumName.E_CHANGE_SHIFT_COMPANSATION) {
            lableBtnChangeShift = 'HRM_Portal_Att_ChangeShift_ShiftType_Schedule';
        } else {
            lableBtnChangeShift = 'HRM_Portal_Att_ChangeShift_ShiftType_Casual';
        }

        if (
            isShowBtnChooseShift &&
            isAllowChangeShiftApprove &&
            firstItemSelect &&
            firstItemSelect.Type == EnumName.E_SHIFT_MANUAL &&
            typeChangeShift.value !== EnumName.E_CHANGE_SHIFT_COMPANSATION
        ) {
            contentBtnChangeShift = (
                <TouchableOpacity onPress={this.showChangeShift} style={styles.styViewBtnChoseChangeShift}>
                    <IconDate size={Size.iconSize} color={Colors.primary} />
                    <VnrText
                        style={[styleSheets.lable, styles.groupButton__text, styles.styTextBtnChoseShift]}
                        i18nKey={lableBtnChangeShift}
                    />
                </TouchableOpacity>
            );
        } else if (
            isShowBtnChooseShift &&
            firstItemSelect &&
            firstItemSelect.Type != EnumName.E_SHIFT_MANUAL &&
            firstItemSelect.Type != EnumName.E_CHANGE_SHIFT_COMPANSATION
        ) {
            contentBtnChangeShift = (
                <TouchableOpacity onPress={this.showChangeShift} style={styles.styViewBtnChoseChangeShift}>
                    <IconDate size={Size.iconSize} color={Colors.primary} />
                    <VnrText
                        style={[styleSheets.lable, styles.groupButton__text, styles.styTextBtnChoseShift]}
                        i18nKey={lableBtnChangeShift}
                    />
                </TouchableOpacity>
            );
        }

        if (dataShift && Array.isArray(dataShift) && dataShift.length > 0) {
            contentViewshift = (
                <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'} contentContainerStyle={CustomStyleSheet.flexGrow(1)}>
                    <View style={styles.styViewListWrap}>
                        {lisWeekName[dataVnrStorage.languageApp == 'EN' ? 'EN' : 'VN'].map((text, index) => (
                            <View key={index} style={styles.styViewListWeekItem}>
                                <Text style={[styleSheets.text, styles.styWeekNameText]}>{text}</Text>
                            </View>
                        ))}
                    </View>

                    {/* <View style={styles.styViewListWrap}> */}
                    <FlatList
                        scrollEnabled={false}
                        style={{}}
                        data={dataShift}
                        numColumns={7}
                        columnWrapperStyle={
                            {
                                //   marginTop: PADDING * 0.5,
                                //   marginBottom: PADDING * 0.5,
                                //   paddingHorizontal: Size.defineSpace,
                            }
                        }
                        renderItem={({ item, index }) => {
                            let colorStatusView = null,
                                borderStatusView = null,
                                bgStatusView = null,
                                colorFromType = null,
                                dateValue = null,
                                workHourValue = null;

                            if (item.Type === 'E_SHIFT_MANUAL' && item.IsFlexibleShift === true) {
                                // đổi ca linh hoạt
                                colorFromType = Colors.green;
                            } else if (item.Type === 'E_SHIFT_MANUAL' && item.IsFlexibleShift === null) {
                                // đổi ca bình thường
                                colorFromType = Colors.pink;
                            } else if (item.Type === 'E_CHANGE_SHIFT_COMPANSATION' && item.IsFlexibleShift === null) {
                                // đổi lich làm việc
                                colorFromType = Colors.orange;
                            }

                            if (
                                item.Description !== null &&
                                item.Description !== '' &&
                                typeof item.Description == 'string'
                            ) {
                                let desValue = item.Description.split('|');
                                dateValue = desValue[0];
                                workHourValue = desValue[1];
                            }

                            // xử lý color
                            if (item.itemStatus) {
                                const { colorStatus, borderStatus, bgStatus } = item.itemStatus;
                                colorStatusView = colorStatus ? colorStatus : null;
                                borderStatusView = borderStatus ? borderStatus : null;
                                bgStatusView = bgStatus ? bgStatus : null;
                            }

                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.styViewListWrapItem}
                                    onPress={this.selectDateItem(index, item.ID)}
                                >
                                    <View
                                        style={[styles.styDateItemUnActive, item.isSelect && styles.styDateItemActive]}
                                    >
                                        <Text
                                            style={[
                                                styleSheets.text,
                                                styles.styDateText,
                                                colorFromType && { color: colorFromType },
                                                item.isSelect && styles.styDateTextActive
                                            ]}
                                        >
                                            {item.DateStart ? moment(item.DateStart).format('D') : ''}
                                        </Text>
                                    </View>

                                    <Text
                                        style={[
                                            styleSheets.text,
                                            styles.styHoursText,
                                            item.isSelect && styles.styTextActive,
                                            colorFromType && { color: colorFromType }
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {dateValue ? dateValue : ''}
                                    </Text>

                                    <Text
                                        style={[
                                            styleSheets.lable,
                                            styles.styShiftText,
                                            item.isSelect && styles.styTextActive,
                                            colorFromType && { color: colorFromType }
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {workHourValue ? `${item.ShiftName} | ${workHourValue}` : ''}
                                    </Text>

                                    {item.StatusView != null && (
                                        <View
                                            style={[
                                                styles.lineSatus,
                                                {
                                                    borderColor: borderStatusView
                                                        ? Vnr_Function.convertTextToColor(borderStatusView)
                                                        : Colors.gray_10,
                                                    backgroundColor: bgStatusView
                                                        ? Vnr_Function.convertTextToColor(bgStatusView)
                                                        : Colors.white
                                                }
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styleSheets.text,
                                                    styles.styStatusText,
                                                    colorStatusView !== null && {
                                                        color: Vnr_Function.convertTextToColor(colorStatusView)
                                                    }
                                                ]}
                                            >
                                                {item.StatusView}
                                            </Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        }}
                        keyExtractor={(item, index) => {
                            return index;
                        }}
                    />

                    <View style={styles.styViewBottom}>
                        {txtDateChangeCompansation !== '' && (
                            <View style={styles.styViewNumberDateChange}>
                                <View style={styles.styViewLeftNumber}>
                                    <VnrText
                                        style={[styleSheets.lable]}
                                        i18nKey={'HRM_Att_ShiftSubstitution_CurrentDate'}
                                    />
                                </View>
                                <View style={styles.styViewRightNumber}>
                                    <VnrText
                                        style={[styleSheets.lable]}
                                        value={moment(txtDateChangeCompansation).format('DD/MM/YYYY')}
                                    />
                                </View>
                            </View>
                        )}

                        {contentBtnChangeShift}

                        {isShowBtnCancelWaitingApprove &&
                            firstItemSelect &&
                            (firstItemSelect.Type === EnumName.E_SHIFT_MANUAL ||
                                firstItemSelect.Type === EnumName.E_CHANGE_SHIFT_COMPANSATION) && (
                            <TouchableOpacity
                                onPress={this.commentReasonCancel}
                                style={styles.styViewBtnCancelShift}
                            >
                                <IconColse size={Size.iconSize} color={Colors.white} />
                                <VnrText
                                    style={[styleSheets.lable, styles.groupButton__text]}
                                    i18nKey={'HRM_Portal_Att_ChangeShift_btnCancelWaitingApprove'}
                                />
                            </TouchableOpacity>
                        )}

                        {isAllowChangeFlexbleShift && (
                            <View style={styles.styViewNumberTime}>
                                <View style={styles.styViewLeftNumber}>
                                    <Image
                                        source={require('../../../../../assets/images/CheckFull.png')}
                                        style={styles.stySizeIcon}
                                    />
                                    <VnrText
                                        style={[styleSheets.lable, styles.styNumberTimeLable]}
                                        i18nKey={'HRM_PortalApp_Flexible_Standard'}
                                    />
                                </View>
                                <View style={styles.styViewRightNumber}>
                                    <VnrText
                                        style={[styleSheets.text, styles.styLeftValue]}
                                        value={`${numberStandard} ${translate('Hour_Lowercase')}`}
                                    />
                                </View>
                            </View>
                        )}

                        {isAllowChangeFlexbleShift && (
                            <View style={styles.styViewNumberTime}>
                                <View style={styles.styViewLeftNumber}>
                                    <Image
                                        source={require('../../../../../assets/images/Timer.png')}
                                        style={styles.stySizeIcon}
                                    />
                                    <VnrText
                                        style={[styleSheets.lable, styles.styNumberTimeLable]}
                                        i18nKey={'HRM_PortalApp_Flexible_Difference'}
                                    />
                                </View>
                                <View style={styles.styViewRightNumber}>
                                    <VnrText
                                        style={[
                                            styleSheets.text,
                                            styles.styRightValue,
                                            { color: colorNumberDifferance }
                                        ]}
                                        value={`${
                                            numberDifference > 0 ? `+${numberDifference}` : numberDifference
                                        } ${translate('Hour_Lowercase')}`}
                                    />
                                </View>
                            </View>
                        )}
                    </View>
                </KeyboardAwareScrollView>
            );
        } else if (dataShift == 'EmptyData') {
            contentViewshift = <EmptyData messageEmptyData={'EmptyData'} />;
        }

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    <View style={styles.styViewTypeChange}>
                        <TouchableOpacity
                            style={styles.styDotTypeItem}
                            onPress={() => this.choseChangeShift(EnumName.E_SHIFT_MANUAL)}
                        >
                            <View style={styles.styDotType}>
                                {typeChangeShift.value == EnumName.E_SHIFT_MANUAL ? (
                                    <IconRadioCheck size={Size.iconSize} color={Colors.pink} />
                                ) : (
                                    <IconRadioUnCheck size={Size.iconSize} color={Colors.pink} />
                                )}
                            </View>
                            <VnrText
                                style={[styleSheets.text, styles.styDotTypeLable]}
                                i18nKey={'HRM_Portal_Att_ChangeShift_ShiftType_Casual_Option'}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.styDotTypeItem}
                            onPress={() => this.choseChangeShift(EnumName.E_CHANGE_SHIFT_COMPANSATION)}
                        >
                            <View style={styles.styDotType}>
                                {typeChangeShift.value == EnumName.E_CHANGE_SHIFT_COMPANSATION ? (
                                    <IconRadioCheck size={Size.iconSize} color={Colors.orange} />
                                ) : (
                                    <IconRadioUnCheck size={Size.iconSize} color={Colors.orange} />
                                )}
                            </View>
                            <VnrText
                                style={[styleSheets.text, styles.styDotTypeLable]}
                                i18nKey={'HRM_Portal_Att_ChangeShift_ShiftType_Schedule_Option'}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.styDotTypeItem}
                            onPress={() => this.choseChangeShift(EnumName.E_SHIFT_FLEXIBLE)}
                        >
                            <View style={styles.styDotType}>
                                {typeChangeShift.value == EnumName.E_SHIFT_FLEXIBLE ? (
                                    <IconRadioCheck size={Size.iconSize} color={Colors.neutralGreen} />
                                ) : (
                                    <IconRadioUnCheck size={Size.iconSize} color={Colors.neutralGreen} />
                                )}
                            </View>
                            <VnrText
                                style={[styleSheets.text, styles.styDotTypeLable]}
                                i18nKey={'HRM_Portal_Att_ChangeShift_ShiftType_Flexible_Option'}
                            />
                        </TouchableOpacity>
                    </View>

                    <Calendar
                        //onPressHideAll={() => this.onChangeMonth(this.getCurrentMonth())}
                        // autoClose={fa}
                        headerStyle={{
                            ...CustomStyleSheet.backgroundColor(Colors.white),
                            ...CustomStyleSheet.paddingVertical(5)
                        }}
                        // viewTopWorkDay={this.renderViewTopWorkDay}
                        refreshCalendarHeaderTotal={refreshCalendarHeaderTotal}
                        //refreshList={this.refreshList}
                        current={daySelected}
                        markedDates={{ [daySelected]: { selected: true } }}
                        onDayPress={day => this.onSelectDay(day)}
                        monthFormat={'MM-yyyy'}
                        firstDay={1}
                        onMonthChange={dataValue => this.onChangeMonth(dataValue)}
                        onlyMonth={true}
                    />

                    {contentViewshift}

                    <View style={styles.groupButton}>
                        {isShowBtnCancel && (
                            <TouchableOpacity onPress={this.undoChange} style={styles.groupButton__button_cancel}>
                                <VnrText style={[styleSheets.lable]} i18nKey={'HRM_Cancel'} />
                            </TouchableOpacity>
                        )}

                        {isShowBtnSave && isActiveSave && (
                            <TouchableOpacity onPress={this.saveRoster} style={styles.groupButton__button_save}>
                                <VnrText
                                    style={[styleSheets.lable, styles.groupButton__text]}
                                    i18nKey={'HRM_Common_Save'}
                                />
                            </TouchableOpacity>
                        )}

                        {isShowBtnSave && !isActiveSave && (
                            <View style={styles.styBtnDisable}>
                                <VnrText
                                    style={[styleSheets.lable, styles.styBtnDisableText]}
                                    i18nKey={'HRM_Common_Save'}
                                />
                            </View>
                        )}
                    </View>

                    {loadShift.visible && (
                        <View style={styles.positionTop999}>
                            <VnrPickerQuickly
                                api={{
                                    urlApi: '[URI_HR]/Att_GetData/GetListCatShiftRawData',
                                    type: 'E_POST',
                                    dataBody: { text: '' }
                                }}
                                isAddEmptyItem={{
                                    isActive: true,
                                    value: {
                                        ID: null,
                                        ShiftID: null,
                                        ShiftName: translate('HRM_No_Shift_Day'),
                                        WorkHours: 0,
                                        WorkHourStandard: 0,
                                        isSelect: false
                                    }
                                }}
                                autoShowModal={true}
                                filter={true}
                                filterServer={true}
                                filterParams={'text'}
                                titlePicker={'HRM_Portal_Att_ChangeShift_ShiftType_Flexible'}
                                refresh={loadShift.refresh}
                                textField="ShiftName"
                                valueField="ID"
                                value={loadShift.value}
                                onFinish={item => this.onPickLoadShift(item)}
                            />
                        </View>
                    )}

                    {loadShiftManual.visible && (
                        <View style={styles.positionTop999}>
                            <VnrPickerQuickly
                                dataLocal={loadShiftManual.data}
                                autoFilter={true}
                                autoShowModal={true}
                                filter={true}
                                filterServer={false}
                                filterParams={'ShiftNameCustom'}
                                titlePicker={'HRM_Portal_Att_ChangeShift_ShiftType_Casual'}
                                refresh={loadShiftManual.refresh}
                                textField="ShiftNameCustom"
                                valueField="ID"
                                value={loadShiftManual.value}
                                onFinish={item => this.onPickloadShiftManual(item)}
                            />
                        </View>
                    )}

                    <Modal
                        onBackButtonPress={() => this.hideModalChangeSchedule()}
                        isVisible={isVisibleModalChangeSchedule}
                        onBackdropPress={() => this.hideModalChangeSchedule()}
                        customBackdrop={
                            <TouchableWithoutFeedback onPress={() => this.hideModalChangeSchedule()}>
                                <View
                                    style={styleSheets.coatingOpacity01}
                                />
                            </TouchableWithoutFeedback>
                        }
                        style={CustomStyleSheet.margin(0)}
                    >
                        <View style={[stylesModalPopupBottom.viewModal, styles.styHeighModalSchedule]}>
                            <SafeAreaView {...styleSafeAreaView} style={stylesModalPopupBottom.safeRadius}>
                                <View style={styles.headerCloseModal}>
                                    <VnrText
                                        style={styleSheets.lable}
                                        i18nKey={'HRM_Portal_Att_ChangeShift_ShiftType_Schedule'}
                                    />
                                </View>

                                <View style={styles.styViewDateToFrom}>
                                    {txtValid !== '' && (
                                        <View style={styles.styViewDownIcon}>
                                            <VnrText style={styles.styleValid} i18nKey={txtValid} />
                                        </View>
                                    )}

                                    {/* Ngày dổi ca */}
                                    <View style={contentViewControl}>
                                        <View style={viewControl}>
                                            <VnrDate
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={DateChange.value}
                                                refresh={DateChange.refresh}
                                                disable={DateChange.disable}
                                                type={'date'}
                                                onFinish={value =>
                                                    this.setState({
                                                        DateChange: {
                                                            ...DateChange,
                                                            value: value
                                                        }
                                                    })
                                                }
                                            />
                                        </View>

                                        <View style={styles.styViewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                value={DateChange.ShiftName}
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.styViewDownIcon}>
                                        <IconArrowDown size={Size.iconSize} color={Colors.black} />
                                    </View>

                                    <View style={contentViewControl}>
                                        <View style={viewControl}>
                                            <VnrDate
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={DateEnd.value}
                                                disable={DateEnd.disable}
                                                refresh={DateEnd.refresh}
                                                type={'date'}
                                                onFinish={value => this.dateEndChange(value)}
                                            />
                                        </View>

                                        <View style={styles.styViewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                value={DateEnd.ShiftName}
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.styleViewBntApprove}>
                                        <TouchableOpacity
                                            style={styles.bntCancel}
                                            onPress={() => this.hideModalChangeSchedule()}
                                        >
                                            <VnrText
                                                style={[styleSheets.lable, { color: Colors.gray_10 }]}
                                                i18nKey={'HRM_Common_Cancel'}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.bntApprove}
                                            onPress={() => this.confirmChangeShift()}
                                        >
                                            <VnrText
                                                style={[styleSheets.lable, styles.bntApprove_text]}
                                                i18nKey={'HRM_Portal_Att_ChangeShift_btnSelect'}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </SafeAreaView>
                        </View>
                    </Modal>
                </View>
            </SafeAreaView>
        );
    }
}

const WIDTH_DATE = 23;
const styles = StyleSheet.create({
    groupButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: styleSheets.p_10,
        backgroundColor: Colors.white,
        marginTop: 10,
        marginBottom: 10
    },
    groupButton__button_save: {
        height: Size.heightButton,
        borderRadius: styleSheets.radius_5,
        backgroundColor: Colors.primary,
        flex: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    groupButton__button_cancel: {
        flex: 5,
        height: Size.heightButton,
        borderRadius: styleSheets.radius_5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.gray_5,
        marginRight: Size.defineHalfSpace
    },
    groupButton__text: {
        marginLeft: 5,
        color: Colors.white
    },
    styBtnDisable: {
        height: Size.heightButton,
        borderRadius: styleSheets.radius_5,
        flex: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.gray_3
    },
    styBtnDisableText: {
        color: Colors.gray_7
    },
    styViewListWrap: {
        flexDirection: 'row'
    },
    styViewListWeekItem: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 2,
        marginBottom: Size.defineHalfSpace
    },
    styViewListWrapItem: {
        width: Size.deviceWidth / 7,
        maxWidth: Size.deviceWidth / 7,
        alignItems: 'center',
        paddingHorizontal: 2,
        marginBottom: Size.defineSpace
    },
    styWeekNameText: {
        fontWeight: '600',
        color: Colors.gray_7
    },
    styDateItemUnActive: {
        width: WIDTH_DATE,
        height: WIDTH_DATE,
        borderRadius: WIDTH_DATE / 2,
        paddingHorizontal: 5,
        paddingVertical: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    styDateItemActive: {
        width: WIDTH_DATE,
        height: WIDTH_DATE,
        borderRadius: WIDTH_DATE / 2,
        paddingHorizontal: 5,
        paddingVertical: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary
    },
    styDateText: {
        fontWeight: '600',
        fontSize: Size.text - 4,
        color: Colors.gray_10
    },
    styDateTextActive: {
        color: Colors.white
    },
    styShiftText: {
        fontSize: Size.text - 7,
        color: Colors.black
    },
    styHoursText: {
        fontWeight: '600',
        fontSize: Size.text - 7,
        color: Colors.black
    },
    styTextActive: {
        color: Colors.primary
    },
    lineSatus: {
        borderRadius: styleSheets.radius_5,
        alignItems: 'center',
        borderWidth: 0.5,
        paddingVertical: 1,
        paddingHorizontal: 3
    },
    styStatusText: {
        fontSize: Size.text - 7,
        color: Colors.gray_10
    },
    styViewBottom: {
        flex: 1,
        paddingHorizontal: Size.defineSpace,
        paddingVertical: Size.defineSpace,
        backgroundColor: Colors.gray_3
    },
    styViewBtnChoseChangeShift: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: Size.heightButton,

        borderColor: Colors.primary,
        borderRadius: styleSheets.radius_5,
        borderWidth: 1,
        backgroundColor: Colors.white,

        marginBottom: Size.defineHalfSpace
    },
    styTextBtnChoseShift: { color: Colors.primary },
    styViewBtnCancelShift: {
        height: Size.heightButton,
        borderRadius: styleSheets.radius_5,
        backgroundColor: Colors.red,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Size.defineHalfSpace
    },
    stySizeIcon: {
        width: Size.iconSize,
        height: Size.iconSize
    },
    styViewNumberTime: {
        flexDirection: 'row',
        paddingVertical: Size.defineHalfSpace
    },
    styViewNumberDateChange: {
        flexDirection: 'row',
        paddingVertical: Size.defineHalfSpace,
        // backgroundColor: Colors.gray_8,
        borderRadius: 5,
        paddingHorizontal: Size.defineHalfSpace,
        marginBottom: Size.defineSpace,
        borderWidth: 0.5,
        borderColor: Colors.black
    },
    styViewLeftNumber: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    styNumberTimeLable: {
        fontWeight: '600',
        marginLeft: Size.defineHalfSpace
    },
    styLeftValue: {
        color: Colors.green,
        fontWeight: '700'
    },
    styRightValue: {
        color: Colors.red,
        fontWeight: '700'
    },
    styViewTypeChange: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        width: '100%',
        paddingVertical: Size.defineHalfSpace,
        backgroundColor: Colors.gray_3,
        paddingHorizontal: Size.defineSpace,
        justifyContent: 'space-between'
    },
    styDotTypeItem: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    styDotType: {
        // width: 7,
        // height: 7,
        // backgroundColor: colorDot,
        // borderRadius: 3.5,
        marginRight: 5
    },
    styDotTypeLable: {
        fontSize: Size.text - 1
    },
    // ====================== //
    styHeighModalSchedule: {
        height: Size.deviceheight * 0.7
    },
    headerCloseModal: {
        paddingVertical: 15,
        flexDirection: 'row',
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    styViewDateToFrom: {
        flex: 1
    },
    styViewLable: {
        marginTop: Size.defineHalfSpace,
        marginLeft: Size.defineSpace
    },
    styViewDownIcon: {
        alignItems: 'center',
        marginVertical: 3,
        marginHorizontal: Size.defineSpace,
        width: Size.deviceWidth - Size.defineSpace * 2
    },
    styleValid: {
        textAlign: 'center',
        color: Colors.red,
        fontSize: Size.text - 2
    },
    bntApprove: {
        flex: 1,
        height: 50,
        borderRadius: 7,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bntApprove_text: {
        fontWeight: '600',
        color: Colors.white
    },
    bntCancel: {
        width: '40%',
        height: 50,
        borderRadius: 7,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colors.gray_5,
        borderWidth: 1
    },
    styleViewBntApprove: {
        flexDirection: 'row',
        paddingHorizontal: Size.defineSpace,
        flex: 1,
        alignItems: 'flex-end',
        paddingVertical: 15
    },
    positionTop999: { position: 'absolute', top: -999 }
});
