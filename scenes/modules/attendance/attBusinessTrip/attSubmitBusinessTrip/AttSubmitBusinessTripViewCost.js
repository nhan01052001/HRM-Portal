import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    ActivityIndicator,
    Text
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import AttBusinessTripList from '../attBusinessTripList/AttBusinessTripList';
import {
    styleSheets,
    Colors,
    Size,
    styleSafeAreaView,
    styleContentFilterDesign,
    stylesModalPopupBottom,
    styleScreenDetail,
    stylesListPickerControl,
    styleValid,
    stylesScreenDetailV2
} from '../../../../../constants/styleConfig';
import Modal from 'react-native-modal';
import { IconDelete, IconColse, IconBack, IconPlus, IconEdit } from '../../../../../constants/Icons';
import VnrFilterCommon from '../../../../../components/VnrFilter/VnrFilterCommon';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ScreenName, EnumName, EnumTask, EnumIcon } from '../../../../../assets/constant';
import { generateRowActionAndSelected, AttSubmitBusinessTripBusinessFunction } from './AttSubmitBusinessTripBusiness';
import { connect } from 'react-redux';
import { startTask } from '../../../../../factories/BackGroundTask';
import VnrText from '../../../../../components/VnrText/VnrText';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import VnrPickerQuickly from '../../../../../components/VnrPickerQuickly/VnrPickerQuickly';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';
import { translate } from '../../../../../i18n/translate';
import HttpService from '../../../../../utils/HttpService';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import moment from 'moment';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { ConfigField } from '../../../../../assets/configProject/ConfigField';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import DrawerServices from '../../../../../utils/DrawerServices';
import Swipeable from 'react-native-gesture-handler/Swipeable';

class AttSubmitBusinessTripViewCost extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataBody: null,
            rowActions: [],
            selected: [],
            isRefreshList: false,
            isLazyLoading: false,
            keyQuery: null,
            dataChange: false, //biến check dữ liệu có thay đổi hay không
            modalVisible: false,
            isLoading: true,
            isLoadingModal: false,
            isVisibleModalAddCost: false,
            dataBusinessCost: null,
            IDItem: null,
            textWarning: '',
            dataBusinessAddCost: {
                data: null
            },
            MissionCostTypeID: {
                visible: true,
                visibleConfig: true,
                disable: false,
                refresh: false,
                value: null,
                data: []
            },
            Cost: {
                disable: true,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: false
            },
            CurrencyID: {
                visible: true,
                visibleConfig: true,
                disable: true,
                refresh: false,
                value: null,
                data: []
            },

            ActualCost: {
                disable: false,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: true
            },
            ActualCurrencyID: {
                visible: true,
                visibleConfig: true,
                disable: false,
                refresh: false,
                value: null,
                data: []
            },

            AdCost: {
                disable: false,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: true
            },
            AdCurrencyID: {
                visible: true,
                visibleConfig: true,
                disable: false,
                refresh: false,
                value: null,
                data: []
            },

            Note: {
                disable: false,
                value: null,
                refresh: false,
                visibleConfig: true,
                visible: true
            }
        };
    }

    componentDidMount() {
        this.reload();
    }

    showTextWarning = text => {
        let timeOut = setTimeout(() => {
            this.setState({
                textWarning: ''
            });

            clearTimeout(timeOut);
        }, 4000);

        this.setState({
            textWarning: text
        });
    };

    reload = () => {
        const _params = this.props.navigation.state.params,
            { dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params);

        this.setState({
            isLoading: true
        });

        HttpService.Post('[URI_HR]/Att_GetData/GetListLeavedayItemByRecordID', {
            recordIDs: dataItem.ID
        }).then(res => {
            try {
                console.log(res, 'res.Data');
                if (res && res.length > 0) {
                    this.setState({
                        IDItem: null,
                        dataBusinessCost: res,
                        isLoading: false,
                        dataBusinessAddCost: {
                            data: dataItem
                        }
                    });
                    // const { reload } = _this;
                    // _this.props.navigation.navigate(attSubmitBusinessTripAddOrEdit, { record: item, reload });
                } else {
                    this.setState({
                        dataBusinessAddCost: {
                            data: dataItem
                        },
                        dataBusinessCost: EnumName.E_EMPTYDATA,
                        isLoading: false
                    });
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    getDataAddCost = dataModify => {
        const { MissionCostTypeID, CurrencyID, ActualCost } = this.state;

        if (
            MissionCostTypeID.data &&
            MissionCostTypeID.data.length > 0 &&
            CurrencyID.data &&
            CurrencyID.data.length > 0
        ) {
            this.showAddCost(MissionCostTypeID.data, CurrencyID.data, ActualCost.visible, dataModify);
        } else {
            VnrLoadingSevices.show();
            HttpService.MultiRequest([
                HttpService.Get('[URI_HR]/Att_GetData/GetListMissionCostTypeByBusinessTravel'),
                HttpService.Get('[URI_HR]/Cat_GetData/GetMultiCurrency'),
                HttpService.Get(
                    '[URI_HR]/Att_GetData/GetSettingByKey?Key=HRM_ATT_CONFIG_ISSHOWACTUALCOSTBUSINESSTRAVEL'
                )
            ]).then(resAll => {
                VnrLoadingSevices.hide();
                try {
                    if (resAll && resAll.length > 0) {
                        const configActuaCost = resAll[2],
                            isShowActualCost =
                                configActuaCost &&
                                configActuaCost.Value1 &&
                                configActuaCost.Value1.indexOf('True') >= 0;

                        this.showAddCost(resAll[0], resAll[1], isShowActualCost, dataModify);
                    }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            });
        }
    };

    showAddCost = (misstionCostType, adCrrencyData, isShowActualCost, dataModify) => {
        debugger;
        const _params = this.props.navigation.state.params,
            { dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params);

        const {
            MissionCostTypeID,
            Cost,
            CurrencyID,
            ActualCost,
            ActualCurrencyID,
            AdCost,
            AdCurrencyID,
            Note
        } = this.state;
        console.log(dataModify, 'dataModify');
        this.setState({
            IDItem: dataModify ? dataModify.ID : null,
            MissionCostTypeID: {
                ...MissionCostTypeID,
                data: misstionCostType,
                value:
                    dataModify && dataModify.MissionCostTypeID
                        ? { ID: dataModify.MissionCostTypeID, MissionCostTypeName: dataModify.MissionCostTypeName }
                        : null,
                refresh: !MissionCostTypeID.refresh
            },
            Cost: {
                ...Cost,
                value: dataModify && dataModify.Cost ? `${dataModify.Cost}` : '',
                visible: dataModify && dataModify.Cost ? true : false,
                refresh: !Cost.refresh
            },
            CurrencyID: {
                ...CurrencyID,
                data: adCrrencyData,
                value:
                    dataModify && dataModify.CurrencyID
                        ? { ID: dataModify.CurrencyID, CurrencyName: dataModify.CurrencyName }
                        : null,
                refresh: !CurrencyID.refresh
            },

            ActualCost: {
                ...ActualCost,
                value: dataModify && dataModify.ActualCost ? `${dataModify.ActualCost}` : '',
                visible: isShowActualCost, // hiển thị
                refresh: !ActualCost.refresh
            },
            ActualCurrencyID: {
                ...ActualCurrencyID,
                data: adCrrencyData,
                value:
                    dataModify && dataModify.ActualCurrencyID
                        ? { ID: dataModify.ActualCurrencyID, CurrencyName: dataModify.ActualCurrency }
                        : null,
                refresh: !ActualCurrencyID.refresh
            },

            AdCost: {
                ...AdCost,
                value: dataModify && dataModify.AdCost ? `${dataModify.AdCost}` : '',
                refresh: !AdCost.refresh
            },
            AdCurrencyID: {
                ...AdCurrencyID,
                data: adCrrencyData,
                value:
                    dataModify && dataModify.AdCurrencyID
                        ? { ID: dataModify.AdCurrencyID, CurrencyName: dataModify.AdCurrency }
                        : null,
                refresh: !AdCurrencyID.refresh
            },

            Note: {
                ...Note,
                value: dataModify && dataModify.Note ? dataModify.Note : '',
                refresh: !Note.refresh
            },
            dataBusinessAddCost: {
                data: dataItem
            },
            isVisibleModalAddCost: true
        });
    };

    reloadFromClaim = isHide => {
        const {
            MissionCostTypeID,
            Cost,
            CurrencyID,
            ActualCost,
            ActualCurrencyID,
            AdCost,
            AdCurrencyID,
            Note,
            dataBusinessAddCost
        } = this.state;

        this.setState({
            IDItem: null,
            MissionCostTypeID: {
                ...MissionCostTypeID,
                value: null,
                refresh: !MissionCostTypeID.refresh
            },
            Cost: {
                ...Cost,
                value: '',
                visible: false,
                refresh: !Cost.refresh
            },
            CurrencyID: {
                ...CurrencyID,
                value: null,
                refresh: !CurrencyID.refresh
            },

            ActualCost: {
                ...ActualCost,
                value: ''
            },
            ActualCurrencyID: {
                ...ActualCurrencyID,
                value: null,
                refresh: !ActualCurrencyID.refresh
            },

            AdCost: {
                ...AdCost,
                value: ''
            },
            AdCurrencyID: {
                ...AdCurrencyID,
                value: null,
                refresh: !AdCurrencyID.refresh
            },
            Note: {
                ...Note,
                value: ''
            },
            dataBusinessAddCost: {
                ...dataBusinessAddCost
            },
            isVisibleModalAddCost: isHide ? false : true
        });
    };

    onChangeMissionCost = item => {
        const { MissionCostTypeID } = this.state;
        this.setState(
            {
                MissionCostTypeID: {
                    ...MissionCostTypeID,
                    value: item,
                    isLoadingModal: true,
                    refresh: !MissionCostTypeID.refresh
                },
                isLoadingModal: true
            },
            () => {
                const { dataBusinessAddCost, MissionCostTypeID, Cost, CurrencyID } = this.state;
                if (MissionCostTypeID.value) {
                    const _data = {
                        ProfileID: dataVnrStorage.currentUser.info.ProfileID,
                        // DateStart: null,
                        // DateEnd: null,
                        LeaveDayID: dataBusinessAddCost.data.ID,
                        MissionCostTypeID: MissionCostTypeID.value.ID,
                        IsPortalApp: true
                    };

                    HttpService.Post('[URI_HR]/Att_GetData/GetMissionCostTypeByID', { model: _data }).then(data => {
                        console.log(data, 'GetMissionCostTypeByID');
                        if (data) {
                            this.setState({
                                Cost: {
                                    ...Cost,
                                    value: data && data.Cost ? `${data.Cost}` : null,
                                    visible: data && data.Cost ? true : false,
                                    refresh: !Cost.refresh
                                },
                                CurrencyID: {
                                    ...CurrencyID,
                                    value: { CurrencyName: data['CurrencyName'], ID: data['CurrencyID'] },
                                    refresh: !CurrencyID.refresh
                                },
                                isLoadingModal: false
                            });
                        } else {
                            this.setState({
                                Cost: {
                                    ...Cost,
                                    value: '',
                                    visible: false,
                                    refresh: !Cost.refresh
                                },
                                CurrencyID: {
                                    ...CurrencyID,
                                    value: null,
                                    refresh: !CurrencyID.refresh
                                },
                                isLoadingModal: false
                            });
                        }
                    });
                }
            }
        );
    };

    onSaveAndCreate = () => {
        this.onSave(true);
    };

    onSave = (isNew, isContinue) => {
        const {
            IDItem,
            dataBusinessAddCost,
            dataBusinessCost,
            MissionCostTypeID,
            Cost,
            CurrencyID,
            ActualCost,
            ActualCurrencyID,
            AdCost,
            AdCurrencyID,
            Note
        } = this.state;

        if (dataBusinessAddCost.data == null) {
            return;
        }

        // kiểm tra bắt trùng Những dòng tạo mới không check khi Edit IDItem !== null
        if (
            IDItem == null &&
            dataBusinessCost !== null &&
            dataBusinessCost !== EnumName.E_EMPTYDATA &&
            dataBusinessCost.length > 0 &&
            MissionCostTypeID.value
        ) {
            let checkTypeClaim = dataBusinessCost.findIndex(
                item => item.MissionCostTypeID == MissionCostTypeID.value.ID
            );
            if (checkTypeClaim > -1) {
                this.showTextWarning(`${translate('DataIsExists')}`);
                return;
            }
        }

        this.setState({ isLoadingModal: true });

        let params = {
            model: {
                ID: IDItem ? IDItem : null,
                ProfileIds: dataVnrStorage.currentUser.info.ProfileID,
                ProfileID: dataVnrStorage.currentUser.info.ProfileID,
                DateFrom: moment(dataBusinessAddCost.data.DateStart).format('YYYY-MM-DD HH:mm:ss'),

                Cost: Cost.value,
                CurrencyID: CurrencyID.value ? CurrencyID.value.ID : null,
                Currency: CurrencyID.value ? CurrencyID.value.CurrencyName : null,

                AdCost: AdCost.value,
                AdCurrency: AdCurrencyID.value ? AdCurrencyID.value.CurrencyName : null,
                AdCurrencyID: AdCurrencyID.value ? AdCurrencyID.value.ID : null,

                ActualCost: ActualCost.value,
                ActualCurrency: ActualCurrencyID.value ? ActualCurrencyID.value.CurrencyName : null,
                ActualCurrencyID: ActualCurrencyID.value ? ActualCurrencyID.value.ID : null,

                MissionCostTypeID: MissionCostTypeID.value ? MissionCostTypeID.value.ID : null,
                MissionCostTypeName: MissionCostTypeID.value ? MissionCostTypeID.value.MissionCostTypeName : null,

                Note: Note.value,
                IsPortal: true,
                UserSubmit: dataVnrStorage.currentUser.info.ProfileID,
                LeaveDayID: dataBusinessAddCost.data.ID
            },
            leaveDayModel: null,
            isContinue: true
        };

        let _data = params.model;

        HttpService.Post('[URI_HR]/Att_GetData/ValidateSaveBizTripClaim', params).then(data => {
            this.setState({ isLoadingModal: false });
            debugger;
            if (data) {
                let message = data.msg;
                let source = data.source;
                if (message.indexOf('WarningActualCost') != -1) {
                    let mess = message.split('|');

                    AlertSevice.alert({
                        title: translate('Hrm_Notification'),
                        iconType: EnumIcon.E_WARNING,
                        message: mess,
                        // colorSecondConfirm: Colors.primary,
                        onCancel: () => {},
                        textRightButton: translate('HRM_Common_SCV_Submit'),
                        onConfirm: () => {
                            this.onSave(isNew, true);
                        }
                    });
                } else if (message && message != '') {
                    this.showTextWarning(message);
                } else {
                    let objSave = { ..._data };
                    let dataSave = [];
                    debugger;
                    if (dataBusinessCost !== null && dataBusinessCost !== EnumName.E_EMPTYDATA) {
                        dataSave = dataBusinessCost.map(item => {
                            item = {
                                ...item,
                                ProfileIds: objSave.ProfileIds,
                                ProfileID: objSave.ProfileID,
                                DateFrom: objSave.DateFrom,
                                IsPortal: true,
                                UserSubmit: objSave.UserSubmit,
                                LeaveDayID: objSave.LeaveDayID
                            };

                            return item;
                        });
                    }

                    if (source && source.length > 0) {
                        let sourceItem = source.find(function(ele) {
                            if (ele.ProfileID == objSave.ProfileID) return ele;
                            return null;
                        });

                        if (sourceItem) {
                            objSave.Cost = sourceItem != null ? sourceItem['Cost'] : '';
                            objSave.CurrencyID = sourceItem != null ? sourceItem['CurrencyID'] : '';
                            objSave.ActualCurrency = sourceItem != null ? sourceItem['ActualCurrency'] : '';
                        }
                    }

                    if (objSave.ID) {
                        this.onEditClaim(objSave, isNew);
                    } else {
                        dataSave.push(objSave);
                        this.onSaveClaim(dataSave, isNew);
                    }
                }
            }
        });
    };

    onEditClaim = (dataSave, isNew) => {
        if (dataSave.ID) {
            // Modify
            this.setState({ isLoadingModal: true });
            HttpService.Post('[URI_HR]/Att_GetData/SaveLeavedayItemApp', {
                leaveDayItem: dataSave
            }).then(message => {
                debugger;
                this.setState({ isLoadingModal: false });

                if (message != null && message != '') {
                    this.reload();
                    if (isNew) {
                        this.reloadFromClaim();
                    } else {
                        this.reloadFromClaim(true);
                    }

                    ToasterSevice.showSuccess('Success', 6000);
                } else {
                    ToasterSevice.showSuccess('HRM_Common_SendRequest_Error', 6000);
                }
            });
        }
    };

    onSaveClaim = (dataSave, isNew) => {
        this.setState({ isLoadingModal: true });
        const { dataBusinessAddCost } = this.state;
        // Create
        HttpService.Post('[URI_HR]/Att_GetData/GetInforEmployeeByIDs', {
            listLeaveDayItem: dataSave
        }).then(dataResult => {
            this.setState({ isLoadingModal: false });

            if (dataResult) {
                debugger;

                let dataSource = [];
                dataResult.forEach(function(item) {
                    dataSource.push({
                        ID: dataBusinessAddCost.data.ID,
                        ProfileID: item['ProfileID'],
                        CodeEmp: item['CodeEmp'],
                        ProfileName: item['ProfileName'],
                        MissionCostTypeID: item['MissionCostTypeID'],
                        MissionCostTypeName: item['MissionCostTypeName'],
                        Cost: item['Cost'],
                        CurrencyID: item['CurrencyID'],
                        AdvanceCurrency: item['AdvanceCurrency'],
                        ActualCost: item['ActualCost'],
                        ActualCurrency: item['ActualCurrency'],
                        ActualCurrencyID: item['ActualCurrencyID'],
                        AdCost: item['AdCost'],
                        AdCurrency: item['AdCurrency'],
                        AdCurrencyID: item['AdCurrencyID'],
                        TotalAmount: item['TotalAmount'],
                        UserCreate: item['UserCreate'],
                        DateCreate: item['DateCreate'],
                        DateUpdate: item['DateUpdate'],
                        UserUpdate: item['UserUpdate'],
                        Note: item['Note']
                    });
                });

                HttpService.Post('[URI_HR]/Att_GetData/SaveLeavedayItemNew', {
                    leaveDayIDs: dataBusinessAddCost.data.ID,
                    leaveDayItemSaves: dataSource
                }).then(data => {
                    ToasterSevice.showSuccess('Success', 6000);

                    this.reload();
                    console.log(isNew, 'isNewisNews');
                    if (isNew) {
                        this.reloadFromClaim();
                    } else {
                        this.reloadFromClaim(true);
                    }
                });
            }
        });
    };

    onPessDelete = items => {
        const { dataBusinessCost, dataBusinessAddCost } = this.state;

        if (items.length === 0) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = items.map(item => {
                return item.ID;
            });

            AlertSevice.alert({
                iconType: EnumIcon.E_DELETE,
                message:
                    translate('HRM_Message_AreYouSureWantToDelete2') +
                    ' ' +
                    selectedID.length +
                    ' ' +
                    translate('HRM_Message_RecordSelected'),
                onCancel: () => {},
                onConfirm: () => {
                    let objSave = {
                        ProfileIds: dataVnrStorage.currentUser.info.ProfileID,
                        ProfileID: dataVnrStorage.currentUser.info.ProfileID,
                        DateFrom: moment(dataBusinessAddCost.data.DateStart).format('YYYY-MM-DD HH:mm:ss'),
                        IsPortal: true,
                        UserSubmit: dataVnrStorage.currentUser.info.ProfileID,
                        LeaveDayID: dataBusinessAddCost.data.ID
                    };

                    let dataSave = [];

                    dataBusinessCost.forEach(item => {
                        if (selectedID.findIndex(e => e == item.ID) <= -1) {
                            dataSave.push({
                                ...item,
                                objSave
                            });
                        }
                    });

                    this.onSaveClaim(dataSave);
                }
            });
        }
    };

    onPessEdit = item => {
        this.getDataAddCost(item);
    };

    rightActions = item => {
        const { dataBusinessAddCost } = this.state;
        let dataRoot = dataBusinessAddCost.data;
        if (dataRoot && dataRoot.BusinessAllowAction && dataRoot.BusinessAllowAction.indexOf(EnumName.E_MODIFY) > -1) {
            return (
                <View style={{ maxWidth: 300, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.viewIcon}>
                        <TouchableOpacity
                            onPress={() => {
                                this.onPessDelete([item]);
                            }}
                            style={styles.styBtn}
                        >
                            <IconDelete size={Size.text} color={Colors.white} />
                            <VnrText style={[styleSheets.text, styles.styBtnText]} i18nKey={'HRM_Common_Delete'} />
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.viewIcon, { backgroundColor: Colors.orange }]}>
                        <TouchableOpacity
                            onPress={() => {
                                this.onPessEdit(item);
                            }}
                            style={styles.styBtn}
                        >
                            <IconEdit size={Size.text} color={Colors.white} />
                            <VnrText
                                style={[styleSheets.text, styles.styBtnText]}
                                i18nKey={'HRM_System_Resource_Sys_Edit'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            );
        } else {
            return <View />;
        }
    };

    initLableValue = item => {
        const { dataBusinessAddCost } = this.state,
            { styViewValue, viewLable, containerItemDetail, styTextValueInfo } = stylesScreenDetailV2;
        let styTextValue = { ...styleSheets.text, ...styTextValueInfo },
            styTextLable = {
                ...styleSheets.lable,
                ...{ textAlign: 'left', fontSize: Size.text + 1, fontWeight: '700' }
            };

        let dataRoot = dataBusinessAddCost.data,
            isHaveEditAndDelete =
                dataRoot &&
                dataRoot.BusinessAllowAction &&
                dataRoot.BusinessAllowAction.indexOf(EnumName.E_MODIFY) > -1,
            dateStart = dataRoot && dataRoot.DateStart ? dataRoot.DateStart : null,
            dateEnd = dataRoot && dataRoot.DateEnd ? dataRoot.DateEnd : null,
            timeCouse = '';

        let dmyStart = moment(dateStart).format('DD/MM/YYYY'),
            dmyEnd = moment(dateEnd).format('DD/MM/YYYY'),
            myStart = moment(dateStart).format('MM/YYYY'),
            myEnd = moment(dateEnd).format('MM/YYYY'),
            yStart = moment(dateStart).format('YYYY'),
            yEnd = moment(dateEnd).format('YYYY'),
            dStart = moment(dateStart).format('DD'),
            dEnd = moment(dateEnd).format('DD'),
            dmStart = moment(dateStart).format('DD/MM');
        if (dmyStart === dmyEnd) {
            timeCouse = dmyStart;
        } else if (myStart === myEnd) {
            timeCouse = `${dStart} - ${dEnd}/${myStart}`;
        } else if (yStart === yEnd) {
            timeCouse = `${dmStart} - ${dmyEnd}`;
        } else {
            timeCouse = `${dmyStart} - ${dmyEnd}`;
        }

        return (
            <Swipeable overshootRight={false} renderRightActions={() => this.rightActions(item)} friction={0.6}>
                <View style={styles.styContentData}>
                    {item.AdCost && (
                        <View style={styles.styItemData}>
                            <View style={viewLable}>
                                <VnrText
                                    style={styTextLable}
                                    value={item.MissionCostTypeName ? item.MissionCostTypeName : ''}
                                />
                            </View>
                            <View style={styViewValue}>
                                <VnrText
                                    style={styTextLable}
                                    value={
                                        item.AdCost != null
                                            ? `${item.AdCost} ${item.AdCurrency ? item.AdCurrency : ''}`
                                            : ''
                                    }
                                />
                            </View>
                        </View>
                    )}

                    {item.Cost && (
                        <View style={styles.styItemData}>
                            <View style={viewLable}>
                                <VnrText style={styTextLable} i18nKey={'HRM_Att_BusinessTravelClaim_Cost'} />
                            </View>
                            <View style={styViewValue}>
                                <VnrText
                                    style={styTextLable}
                                    value={
                                        item.Cost != null ? `${item.Cost} ${item.Currency ? item.Currency : ''}` : ''
                                    }
                                />
                            </View>
                        </View>
                    )}

                    {item.ActualCost && (
                        <View style={styles.styItemData}>
                            <View style={viewLable}>
                                <VnrText
                                    style={styTextLable}
                                    value={item.MissionCostTypeName ? item.MissionCostTypeName : ''}
                                />
                            </View>
                            <View style={styViewValue}>
                                <VnrText
                                    style={styTextLable}
                                    value={
                                        item.ActualCost != null
                                            ? `${item.ActualCost} ${item.ActualCurrency ? item.ActualCurrency : ''}`
                                            : ''
                                    }
                                />
                            </View>
                        </View>
                    )}

                    <View style={styles.styItemData}>
                        <View style={[viewLable]}>
                            {timeCouse && (
                                <VnrText
                                    style={[styTextValue, styles.styTextValueCus, { textAlign: 'left' }]}
                                    i18nKey={timeCouse}
                                />
                            )}
                        </View>
                    </View>

                    <View style={styles.styViewNote}>
                        <View style={styles.styItemDataNote}>
                            <View style={viewLable}>
                                <VnrText style={styleSheets.lable} i18nKey={'Note'} />
                            </View>
                            <View style={viewLable}>
                                <VnrText
                                    style={[styleSheets.text, styles.styTextNote]}
                                    value={item.Note ? item.Note : ''}
                                />
                            </View>
                        </View>
                    </View>

                    {isHaveEditAndDelete && (
                        <View style={styles.actionRight}>
                            <IconBack color={Colors.gray_7} size={Size.defineSpace} />
                        </View>
                    )}
                </View>
            </Swipeable>
        );
    };

    render() {
        const {
                isVisibleModalAddCost,
                isLoadingModal,
                dataBusinessCost,
                dataBusinessAddCost,
                MissionCostTypeID,
                Cost,
                CurrencyID,

                ActualCost,
                ActualCurrencyID,

                textWarning,
                AdCost,
                AdCurrencyID,
                Note
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
        let listActions = [];
        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_BusinessTravel_CreateOrUpdate_btnSaveAndCloseClaim'] &&
            PermissionForAppMobile.value['New_Att_BusinessTravel_CreateOrUpdate_btnSaveAndCloseClaim']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_CLOSE,
                title: translate('HRM_Common_SaveClose'),
                onPress: () => this.onSave()
            });
        }

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_BusinessTravel_CreateOrUpdate_btnSaveAndContinuteClaim'] &&
            PermissionForAppMobile.value['New_Att_BusinessTravel_CreateOrUpdate_btnSaveAndContinuteClaim']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_NEW,
                title: translate('HRM_Common_SaveNew'),
                onPress: () => this.onSaveAndCreate()
            });
        }
        //#endregion

        let isShowBtnAdd = false;

        console.log(dataBusinessAddCost.data, 'dataBusinessAddCost.data');
        if (
            dataBusinessAddCost.data &&
            dataBusinessAddCost.data.BusinessAllowAction &&
            dataBusinessAddCost.data.BusinessAllowAction.indexOf(EnumName.E_MODIFY) >= 0 &&
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_BusinessTravel_CreateOrUpdate_btnCreateClaim'] &&
            PermissionForAppMobile.value['New_Att_BusinessTravel_CreateOrUpdate_btnCreateClaim']['View']
        ) {
            isShowBtnAdd = true;
        }

        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataBusinessCost !== null && dataBusinessCost == EnumName.E_EMPTYDATA) {
            contentViewDetail = <EmptyData messageEmptyData={'EmptyData'} />;
        } else if (dataBusinessCost && dataBusinessCost.length > 0) {
            contentViewDetail = (
                <ScrollView style={{ flex: 1 }}>{dataBusinessCost.map(e => this.initLableValue(e))}</ScrollView>
            );
        }

        return (
            <SafeAreaView {...styleSafeAreaView}>
                {contentViewDetail}

                {isShowBtnAdd && (
                    <TouchableOpacity style={styles.styBtnAddCost} onPress={() => this.getDataAddCost()}>
                        <IconPlus size={Size.iconSizeHeader + 10} color={Colors.white} />
                    </TouchableOpacity>
                )}

                {isVisibleModalAddCost && (
                    <Modal
                        onBackButtonPress={() => this.reloadFromClaim(true)}
                        isVisible={true}
                        // onBackdropPress={() => this.hideAddCost()}
                        customBackdrop={
                            <TouchableWithoutFeedback onPress={() => this.reloadFromClaim(true)}>
                                <View
                                    style={{
                                        flex: 1,
                                        backgroundColor: Colors.black,
                                        opacity: 0.6
                                    }}
                                />
                            </TouchableWithoutFeedback>
                        }
                        style={{
                            margin: 0
                        }}
                    >
                        <View
                            style={[
                                stylesModalPopupBottom.viewModal,
                                { borderTopColor: Colors.gray_5, borderTopWidth: 1 }
                            ]}
                        >
                            <SafeAreaView {...styleSafeAreaView} style={stylesModalPopupBottom.safeRadius}>
                                {isLoadingModal && (
                                    <View style={styles.styleViewLoading}>
                                        <ActivityIndicator size={Size.iconSize} color={Colors.primary} />
                                    </View>
                                )}

                                <View style={styles.headerCloseModal}>
                                    <TouchableOpacity onPress={() => this.reloadFromClaim(true)}>
                                        <IconColse color={Colors.grey} size={Size.iconSize} />
                                    </TouchableOpacity>
                                    <VnrText style={styleSheets.lable} i18nKey={'HRM_Common_BusinessTravelCosts_Add'} />
                                    <IconColse color={Colors.white} size={Size.iconSize} />
                                </View>

                                <KeyboardAwareScrollView
                                    keyboardShouldPersistTaps={'handled'}
                                    contentContainerStyle={{ flexGrow: 1 }}
                                >
                                    <View style={styles.formError}>
                                        <View style={styleSheets.lable}>
                                            <Text style={[styleSheets.text, styles.textError]}>{textWarning}</Text>
                                        </View>
                                    </View>
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={'HRM_Att_LeaveDayBusiness_CostType'}
                                            />

                                            {<VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPickerQuickly
                                                dataLocal={MissionCostTypeID.data}
                                                refresh={MissionCostTypeID.refresh}
                                                textField={'MissionCostTypeName'}
                                                valueField={'ID'}
                                                filter={true}
                                                value={MissionCostTypeID.value}
                                                filterServer={false}
                                                disable={MissionCostTypeID.disable}
                                                onFinish={item => this.onChangeMissionCost(item)}
                                            />
                                        </View>
                                    </View>

                                    {/*Số tiền định mức -  Cost */}
                                    {Cost.visible && Cost.visibleConfig && (
                                        <View style={contentViewControl}>
                                            <View style={viewLable}>
                                                <VnrText
                                                    style={[styleSheets.text, textLableInfo]}
                                                    i18nKey={'HRM_Att_BusinessTravelClaim_Cost'}
                                                />
                                            </View>

                                            <View style={formDate_To_From}>
                                                <View style={controlDate_from}>
                                                    <VnrTextInput
                                                        value={Cost.value}
                                                        refresh={Cost.refresh}
                                                        disable={Cost.disable}
                                                        keyboardType={'numeric'}
                                                        charType={'double'}
                                                        returnKeyType={'done'}
                                                        onChangeText={value => {
                                                            this.setState({
                                                                Cost: {
                                                                    ...Cost,
                                                                    value,
                                                                    refresh: !Cost.refresh
                                                                }
                                                            });
                                                        }}
                                                    />
                                                </View>

                                                {/* Đơn vị tính - UnitView */}
                                                <View style={controlDate_To}>
                                                    <VnrPickerQuickly
                                                        dataLocal={CurrencyID.data}
                                                        refresh={CurrencyID.refresh}
                                                        textField={'CurrencyName'}
                                                        valueField={'ID'}
                                                        autoBind={true}
                                                        filter={true}
                                                        value={CurrencyID.value}
                                                        filterServer={false}
                                                        disable={CurrencyID.disable}
                                                        onFinish={item =>
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

                                    {/* Số tiền tạm ứng -  AdCost */}
                                    {AdCost.visible && AdCost.visibleConfig && (
                                        <View style={contentViewControl}>
                                            <View style={viewLable}>
                                                <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'AdCost'} />
                                            </View>

                                            <View style={formDate_To_From}>
                                                {/* Số tiền tạm ứng -  AdCost */}
                                                <View style={controlDate_from}>
                                                    <VnrTextInput
                                                        value={AdCost.value}
                                                        refresh={AdCost.refresh}
                                                        disable={AdCost.disable}
                                                        keyboardType={'numeric'}
                                                        charType={'double'}
                                                        returnKeyType={'done'}
                                                        onChangeText={value => {
                                                            this.setState({
                                                                AdCost: {
                                                                    ...AdCost,
                                                                    value,
                                                                    refresh: !AdCost.refresh
                                                                }
                                                            });
                                                        }}
                                                    />
                                                </View>

                                                {/* Đơn vị tính - UnitView */}
                                                <View style={controlDate_To}>
                                                    <VnrPickerQuickly
                                                        dataLocal={AdCurrencyID.data}
                                                        refresh={AdCurrencyID.refresh}
                                                        textField={'CurrencyName'}
                                                        valueField={'ID'}
                                                        filter={true}
                                                        value={AdCurrencyID.value}
                                                        filterServer={false}
                                                        disable={AdCurrencyID.disable}
                                                        onFinish={item =>
                                                            this.setState({
                                                                AdCurrencyID: {
                                                                    ...AdCurrencyID,
                                                                    value: item,
                                                                    refresh: !AdCurrencyID.refresh
                                                                }
                                                            })
                                                        }
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    )}

                                    {/* Số tiền thực tế -  ActualCost */}
                                    {ActualCost.visible && ActualCost.visibleConfig && (
                                        <View style={contentViewControl}>
                                            <View style={viewLable}>
                                                <VnrText
                                                    style={[styleSheets.text, textLableInfo]}
                                                    i18nKey={'HRM_Att_BusinessTravelClaim_ActualAmount'}
                                                />
                                            </View>

                                            <View style={formDate_To_From}>
                                                <View style={controlDate_from}>
                                                    <VnrTextInput
                                                        value={ActualCost.value}
                                                        refresh={ActualCost.refresh}
                                                        disable={ActualCost.disable}
                                                        keyboardType={'numeric'}
                                                        charType={'double'}
                                                        returnKeyType={'done'}
                                                        onChangeText={value => {
                                                            this.setState({
                                                                ActualCost: {
                                                                    ...ActualCost,
                                                                    value,
                                                                    refresh: !ActualCost.refresh
                                                                }
                                                            });
                                                        }}
                                                    />
                                                </View>

                                                {/* Đơn vị tính - UnitView */}
                                                <View style={controlDate_To}>
                                                    <VnrPickerQuickly
                                                        dataLocal={ActualCurrencyID.data}
                                                        refresh={ActualCurrencyID.refresh}
                                                        textField={'CurrencyName'}
                                                        valueField={'ID'}
                                                        filter={true}
                                                        value={ActualCurrencyID.value}
                                                        filterServer={false}
                                                        disable={ActualCurrencyID.disable}
                                                        onFinish={item =>
                                                            this.setState({
                                                                ActualCurrencyID: {
                                                                    ...ActualCurrencyID,
                                                                    value: item,
                                                                    refresh: !AdCurrencyID.refresh
                                                                }
                                                            })
                                                        }
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    )}

                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'Note'} />
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                value={Note.value}
                                                refresh={Note.refresh}
                                                disable={Note.disable}
                                                returnKeyType={'done'}
                                                onChangeText={value => {
                                                    this.setState({
                                                        Note: {
                                                            ...Note,
                                                            value,
                                                            refresh: !Note.refresh
                                                        }
                                                    });
                                                }}
                                            />
                                        </View>
                                    </View>
                                </KeyboardAwareScrollView>

                                {/* bottom button close, confirm */}
                                <ListButtonSave listActions={listActions} />
                            </SafeAreaView>
                        </View>
                    </Modal>
                )}
            </SafeAreaView>
        );
    }
}

const mapStateToProps = state => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

const sizeBtnAdd = Size.iconSizeHeader + 30;
const styles = StyleSheet.create({
    textError: {
        color: Colors.warning,
        fontSize: Size.text
    },
    textSuccess: {
        color: Colors.success,
        fontSize: Size.text
    },
    formError: {
        width: '100%',
        marginVertical: styleSheets.defineHalfSpace,
        alignItems: 'center',
        justifyContent: 'center'
    },
    styBtnAddCost: {
        position: 'absolute',
        height: sizeBtnAdd,
        width: sizeBtnAdd,
        borderRadius: sizeBtnAdd / 2,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: Size.deviceWidth * 0.25,
        backgroundColor: Colors.neutralGreen,
        right: Size.defineSpace
    },
    actionRight: {
        position: 'absolute',
        top: 0,
        right: -Size.defineSpace,
        height: '100%',
        justifyContent: 'center'
    },
    headerCloseModal: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textTitleBussiness: { marginTop: 20, textAlign: 'center', fontWeight: 'bold' },
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
    groupButton__button_save: {
        height: Size.heightButton,
        borderRadius: styleSheets.radius_5,
        backgroundColor: Colors.primary,
        flex: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    styViewItem: {
        flexDirection: 'row'
    },

    // Style item
    styViewBottomCost: {
        backgroundColor: Colors.gray_3,
        width: Size.deviceWidth - Size.defineSpace * 2,
        marginHorizontal: Size.defineSpace,
        marginTop: Size.defineSpace,
        marginBottom: Size.defineSpace * 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Size.defineHalfSpace,
        borderRadius: 8,
        borderColor: Colors.gray_5,
        borderWidth: 0.5
    },
    bottomActions: {
        flexGrow: 1,
        paddingVertical: Size.defineSpace,
        backgroundColor: Colors.white,
        minHeight: 40 + Size.defineSpace * 2,
        maxHeight: 45 + Size.defineSpace * 2
    },
    styLableTextBottom: {
        color: Colors.gray_8,
        fontSize: Size.text - 1
    },
    styTextValueCus: {
        fontSize: Size.text - 1
    },
    styBlock: {
        width: Size.deviceWidth,
        backgroundColor: Colors.white,
        paddingBottom: Size.defineHalfSpace,
        marginBottom: Size.defineHalfSpace
    },
    styWrap: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginRight: Size.defineSpace,
        alignItems: 'center'
    },
    styWrapRight: {
        alignItems: 'flex-end'
    },
    styTitle: {
        fontSize: Size.text + 4,
        fontWeight: 'bold'
    },
    styTextDetail: {
        fontWeight: '500',
        color: Colors.primary
    },
    styViewData: {},
    styViewDataTotal: {
        marginRight: Size.defineSpace,
        marginTop: Size.defineSpace
    },
    styContentData: {
        width: Size.deviceWidth - Size.defineSpace * 2,
        backgroundColor: Colors.white,

        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 1,
        marginTop: Size.defineSpace,
        paddingBottom: Size.defineSpace,
        marginHorizontal: Size.defineSpace,
        paddingRight: 2
    },
    styViewNote: {
        marginVertical: Size.defineHalfSpace,
        width: '100%'
    },
    styItemData: {
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: Size.defineHalfSpace - 2
    },
    styItemDataNote: {
        width: '100%',
        marginTop: Size.defineHalfSpace - 2
    },
    styTextRight: {
        textAlign: 'right',
        fontWeight: '600'
    },
    viewIcon: {
        backgroundColor: Colors.danger,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
        borderRadius: 8,
        paddingHorizontal: Size.defineSpace,
        marginVertical: 10,
        marginRight: Size.defineSpace,
        height: 40
    },
    styBtn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    styBtnText: {
        color: Colors.white,
        fontWeight: '500',
        marginLeft: 3
    },
    styTextNote: {
        fontSize: Size.text - 1,
        color: Colors.gray_9,
        marginTop: 5,
        marginLeft: 3
    },

    styleViewLoading: {
        position: 'absolute',
        top: 0,
        height: '100%',
        width: '100%',
        zIndex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default connect(
    mapStateToProps,
    null
)(AttSubmitBusinessTripViewCost);
