/* eslint-disable no-prototype-builtins */
import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import HttpService from '../../../../../utils/HttpService';
import VnrText from '../../../../../components/VnrText/VnrText';
import { connect } from 'react-redux';
import {
    Colors,
    Size,
    styleSheets,
    styleProfileInfo,
    styleSafeAreaView,
    styleScreenDetail,
    stylesListPickerControl,
    stylesScreenDetailV2,
    styleValid,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import { IconEdit, IconCheck, IconColse, IconError, IconSave } from '../../../../../constants/Icons';
import format from 'number-format.js';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import { translate } from '../../../../../i18n/translate';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import VnrPicker from '../../../../../components/VnrPicker/VnrPicker';
import VnrDate from '../../../../../components/VnrDate/VnrDate';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import DrawerServices from '../../../../../utils/DrawerServices';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrPickerAddress from '../../../../../components/VnrPickerAddress/VnrPickerAddress';
import { EnumIcon, EnumName, EnumTask } from '../../../../../assets/constant';
import VnrAttachFile from '../../../../../components/VnrAttachFile/VnrAttachFile';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import { getDataLocal } from '../../../../../factories/LocalData';
import { startTask } from '../../../../../factories/BackGroundTask';

class TopTabProfileContactInfoUpdate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            profile: null,
            profileUpdate: {},
            isUpdateTextForField: null,
            isUpdate: true,
            isRefresh: false,
            dataWaitingApprove: [],
            dataNotChange: null,
            //File đính kèm
            FileAttach: {
                label: 'HRM_Rec_JobVacancy_FileAttachment',
                disable: false,
                refresh: false,
                value: null,
                visibleConfig: true,
                visible: true
            },
            isLoading: true,
            refreshing: false,
            keyQuery: EnumName.E_PRIMARY_DATA,
            configField: {}
        };

        props.navigation.setParams({
            getDataUpdate: this.getDataUpdate.bind(this),
            undoUpdate: this.undoUpdate.bind(this)
        });

        this.toControl = null;
        this.checkVisibleFileAttch = false;
    }

    getControl = () => this.toControl;

    setControl = (ctrl) => {
        this.toControl = ctrl;
    };

    undoUpdate = () => {
        this.setControl(null);
        this.setState({
            isUpdate: false,
            profileUpdate: {},
            isUpdateTextForField: null
        });
    };

    createObj = (profile, profileUpdate, keys) => {
        let lenKeys = keys.length;

        for (let j = 0; j < lenKeys; j++) {
            //let key = keys[j];

            let key = keys[j];
            let value = profileUpdate[key];

            if (value && value !== '') {
                //value is date
                if (
                    (typeof value === 'string' && value.indexOf('/Date(') == 0) ||
                    ((typeof value === 'object' ||
                        (typeof value === 'string' && value.length > 10 && value.indexOf(' ') < 0)) &&
                        moment(value).isValid() &&
                        !isNaN(Date.parse(value)))
                ) {
                    if (moment(profile[key]).format('DD/MM/YYYY') != moment(value).format('DD/MM/YYYY')) {
                        profile = {
                            ...profile,
                            [key]: moment(value).format('YYYY-MM-DD HH:mm:ss')
                        };
                    }
                }
                //value is object
                else if (typeof value === 'object') {
                    let _valueField = profileUpdate[key]['valueField'];
                    let _val = profileUpdate[key][_valueField];

                    if (profile[key] !== _val) {
                        profile = { ...profile, [key]: _val };
                    }
                }
                //value is string
                else if (profile[key] !== value) {
                    profile = { ...profile, [key]: value };
                }
            } else if (profile[key] !== value) {
                profile = { ...profile, [key]: value };
            }
        }

        return profile;
    };

    formatDateToServer = (profile, keys, keysProfile) => {
        let lenKeysProfile = keysProfile.length;

        for (let j = 0; j < lenKeysProfile; j++) {
            let key = keysProfile[j];

            if (keys.indexOf(key) < 0) {
                let value = profile[key];
                if (
                    (typeof value === 'string' && value.indexOf('/Date(') == 0) ||
                    ((typeof value === 'object' ||
                        (typeof value === 'string' && value.length > 10 && value.indexOf(' ') < 0)) &&
                        moment(value).isValid() &&
                        !isNaN(Date.parse(value)))
                ) {
                    profile = {
                        ...profile,
                        [key]: moment(value).format('YYYY-MM-DD HH:mm:ss')
                    };
                }
            }
        }

        return profile;
    };

    getDataUpdate = () => {
        let { profileUpdate, profile } = this.state,
            keys = Object.keys(profileUpdate);

        //có dữ liệu thay đổi
        if (profileUpdate && keys.length) {
            profile = { ...profile, FieldChanged: keys.join() };

            //merge dữ liệu thay đổi vào profile ban đầu
            profile = this.createObj(profile, profileUpdate, keys);

            //format lại những dữ liệu Date cho server
            profile = this.formatDateToServer(profile, keys, Object.keys(profile));

            return profile;
        }

        //không có dữ iệu thay đổi => return
        return null;
    };

    onUpdate = (isSaveTemp) => {
        let dataContact = this.getDataUpdate();

        if (dataContact) {
            dataContact.IsPortalApp = true;
            AlertSevice.alert({
                iconType: EnumIcon.E_CONFIRM,
                message: translate('DoyouwanttoupdateChangesIncollaborativeprocess'),
                onCancel: () => {
                    //undo tab nhân viên cơ bản
                    this.undoUpdate();
                },
                onConfirm: () => {
                    // //update personal
                    // if (dataPersonal) {
                    //     dataPersonal.IsPortalApp = true;
                    //     arrRequest.push(HttpService.Post('[URI_POR]/Personal/CreatePersonalInfo', dataPersonal));
                    // }

                    // //update contact
                    // if (dataContact) {
                    //     dataContact.IsPortalApp = true;
                    //     arrRequest.push(HttpService.Post('[URI_POR]/Personal/CreateContactInfo', dataContact));
                    // }
                    const emailFields = ['Email', 'Email2', 'Email3', 'Email4'];

                    // eslint-disable-next-line no-unused-vars
                    for (const field of emailFields) {
                        if (dataContact[field] && !Vnr_Function.isValidateEmail(dataContact[field])) {
                            let displayField = ''
                            if (field == 'Email') displayField = translate('Email')
                            else if (field == 'Email2') displayField = translate('Email2')
                            else if (field == 'Email3') displayField = translate('HRM_HR_Profile_Email3')
                            else if (field == 'Email4') displayField = translate('HRM_HR_Profile_Email4')

                            const nameField = translate('HRM_FieldInvalidEmail').replace('[{0}]', `[${displayField}]`);
                            ToasterSevice.showWarning(nameField);
                            return;
                        }
                    }

                    if (isSaveTemp) dataContact.IsSaveTemp = true;

                    VnrLoadingSevices.show();
                    HttpService.Post('[URI_HR]/Hre_GetDataV2/CreateContactInfo', dataContact).then((res) => {
                        VnrLoadingSevices.hide();
                        try {
                            if (res && typeof res == 'object') {
                                //lưu thành công
                                if (res.ActionStatus === 'Success') {
                                    //thông báo
                                    ToasterSevice.showSuccess('HRM_Profile_UpdateSuccess', 5000);

                                    //reload lại ProfileInfo
                                    // if (navBasicInfoUpdate.state.params
                                    //     && navBasicInfoUpdate.state.params.reload
                                    //     && typeof navBasicInfoUpdate.state.params.reload === 'function') {
                                    //     navBasicInfoUpdate.state.params.reload();
                                    // }
                                    this.reload();

                                    this.undoUpdate();
                                } else {
                                    ToasterSevice.showWarning(res.ActionStatus, 5000);
                                }
                            } else {
                                DrawerServices.navigate('ErrorScreen', {});
                            }
                        } catch (error) {
                            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                        }
                    });
                }
            });
        } else {
            ToasterSevice.showInfo('HRM_Data_Not_Change', 5000);
        }
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;
        if (nextProps.reloadScreenName == EnumTask.KT_GeneralInfomation) {
            //khi màn hình đang reload thì messsage phải là filter thì màn hình mới reload
            if (nextProps.message && keyQuery == nextProps.message.keyQuery) {
                if (nextProps.message.dataChange) {
                    this.remoteData();
                } else {
                    this.setState({
                        isLoading: false,
                        refreshing: false
                    });
                }
            }
        }
    }

    remoteData = () => {
        const { keyQuery } = this.state;
        getDataLocal(EnumTask.KT_GeneralInfomation)
            .then((resData) => {
                const res = resData && resData[keyQuery] ? resData[keyQuery] : null;
                if (res && res !== EnumName.E_EMPTYDATA) {
                    const data = {
                        profile: { ...res[0] },
                        dataWaitingApprove: [...res[1]]
                    };

                    this.getAllConfig(
                        data.profile,
                        data.dataWaitingApprove
                        // this.handleSetState,
                    );
                } else if (res === EnumName.E_EMPTYDATA) {
                    this.setState({
                        profile: EnumName.E_EMPTYDATA,
                        dataWaitingApprove: null,
                        isLoading: false,
                        refreshing: false
                        //isLoadingHeader: isLazyLoading ? false : true,
                    });
                }
            })
            .catch((error) => {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            });
    };

    componentDidMount() {
        this.remoteData();
    }

    reload = () => {
        this.setState(
            {
                isLoading: true,
                keyQuery: EnumName.E_PRIMARY_DATA
            },
            () => {
                startTask({
                    keyTask: EnumTask.KT_GeneralInfomation,
                    payload: {
                        keyQuery: EnumName.E_PRIMARY_DATA,
                        reload: this.remoteData,
                        isCompare: true
                    }
                });
            }
        );
    };

    getAllConfig = (_profile, _dataWaitingApprove) => {
        HttpService.MultiRequest([
            HttpService.Get('[URI_HR]/Att_GetData/GetSettingByKey?Key=HRM_HRE_CONFIG_FIELDCANNOTEDITINPORTAL'),
            HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=Hre_ContactInfoPortal')
        ]).then((resAll) => {
            try {
                const [res, configField] = resAll;

                let nextState = {
                    dataWaitingApprove: _dataWaitingApprove,
                    profile: _profile
                };

                if (res && res.Value1) {
                    nextState = {
                        ...nextState,
                        dataNotChange: res.Value1,
                        isLoading: false,
                        refreshing: false,
                        configField: { ...configField }
                    };
                }

                this.setState(nextState);
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    onChangeText = (field, val) => {
        let varTmp = 'TEMPORARILY_SLUG_' + field;
        let obj = { [varTmp]: val };
        this.setState({ profileUpdate: { ...this.state.profileUpdate, ...obj } });
    };

    applyText = (field, isValidateEmail) => {
        let { profileUpdate } = this.state;
        let varTmp = 'TEMPORARILY_SLUG_' + field;
        if (profileUpdate.hasOwnProperty(varTmp)) {
            let valTmp = profileUpdate[varTmp];
            if (isValidateEmail && valTmp && !Vnr_Function.isValidateEmail(valTmp)) {
                let displayField = ''
                if (field == 'Email') displayField = translate('Email')
                else if (field == 'Email2') displayField = translate('Email2')
                else if (field == 'Email3') displayField = translate('HRM_HR_Profile_Email3')
                else if (field == 'Email4') displayField = translate('HRM_HR_Profile_Email4')

                const nameField = translate('HRM_FieldInvalidEmail').replace('[{0}]', `[${displayField}]`);
                ToasterSevice.showWarning(nameField);
            }
            let obj = { [field]: valTmp };
            delete profileUpdate[varTmp];
            this.setState({
                profileUpdate: { ...this.state.profileUpdate, ...obj },
                isUpdateTextForField: null
            });
        } else {
            let valTmp = profileUpdate[field];
            if (isValidateEmail && valTmp && !Vnr_Function.isValidateEmail(valTmp)) {
                let displayField = ''
                if (field == 'Email') displayField = translate('Email')
                else if (field == 'Email2') displayField = translate('Email2')
                else if (field == 'Email3') displayField = translate('HRM_HR_Profile_Email3')
                else if (field == 'Email4') displayField = translate('HRM_HR_Profile_Email4')

                const nameField = translate('HRM_FieldInvalidEmail').replace('[{0}]', `[${displayField}]`);
                ToasterSevice.showWarning(nameField);
            }
            this.setState({ isUpdateTextForField: null });
        }
    };

    undoText = (field) => {
        let { profileUpdate } = this.state;
        let varTmp = 'TEMPORARILY_SLUG_' + field;
        if (profileUpdate.hasOwnProperty(varTmp)) {
            delete profileUpdate[varTmp];
        }
        this.setState({
            profileUpdate: { ...profileUpdate },
            isUpdateTextForField: null
        });
    };

    addFieldToState = (item) => {
        const { profile, profileUpdate } = this.state;
        let control = item.Control;
        let _field = control['fieldName'];
        let _name = control['Name'];
        let objState = {};

        if (_name && (_name.toLowerCase() === 'vnrpicker' || _name.toLowerCase() === 'vnrpickeraddress')) {
            let _objValue = control['objValue'];

            if (_objValue && (profile[_objValue['value']] || profileUpdate[_objValue['value']])) {
                let _valueValueField = profileUpdate[_objValue['value']]
                    ? profileUpdate[_objValue['value']]
                    : profile[_objValue['value']];

                if (_valueValueField && typeof _valueValueField === 'object') {
                    objState[_field] = _valueValueField;
                } else if (
                    profileUpdate.hasOwnProperty(_objValue['value']) &&
                    profileUpdate[_objValue['value']] === null
                ) {
                    objState[_field] = null;
                } else {
                    let _textField = control['textField'];
                    let _valueField = control['valueField'];
                    let _valueTextField = profileUpdate[_objValue['key']]
                        ? profileUpdate[_objValue['key']]
                        : profile[_objValue['key']];

                    objState[_field] = {
                        [_textField]: _valueTextField,
                        [_valueField]: _valueValueField
                    };
                }
            }
        } else {
            objState[_field] = profileUpdate[_field] ? profileUpdate[_field] : profile[_field];
        }

        return objState;
    };

    onFinishFileAttach = (files, fieldName) => {
        let { profileUpdate } = this.state;
        if (files.length > 0)
            this.setState({
                profileUpdate: {
                    ...profileUpdate,
                    [fieldName]: {
                        valueField: fieldName,
                        [fieldName]: files.map((item) => item.fileName).join(','),
                        value: files
                    }
                }
            });
    };

    initView = (config, profile) => {
        const { profileUpdate, dataNotChange, dataWaitingApprove, configField } = this.state,
            {
                itemContent,
                textLableGroup,
                viewInputEdit,
                bntSaveInputView,
                bntCancelInputView,
                bntCenter
            } = styleProfileInfo,
            { textValueInfo, textLableInfo } = styleScreenDetail,
            { viewLable, viewControl } = stylesListPickerControl,
            stylesDetailV2 = stylesScreenDetailV2;

        // config.push
        return config.map((item, index) => {
            if (item['Name'] == 'FileAttach') {
                let _fieldName = item['fieldName'] ? item['fieldName'] : item['FieldName'];
                let _value = null;
                // let _field = item['FieldNameAttach'];

                if (profileUpdate.hasOwnProperty(_fieldName)) {
                    _value = profileUpdate[_fieldName]['value'];
                } else {
                    let _field = item['FieldNameAttach'];
                    _value = profile[_field];
                }

                let isChange = dataWaitingApprove && dataWaitingApprove.indexOf(_fieldName) > -1,
                    colorTextWaiting = isChange ? { color: Colors.orange, marginTop: Size.defineHalfSpace } : {};

                return (
                    <View style={itemContent}>
                        <View style={viewLable}>
                            <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={item['DisplayKey']} />

                            {configField[_fieldName] && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                        </View>

                        {isChange && (
                            <VnrText
                                style={[styleSheets.text, colorTextWaiting]}
                                value={translate('HRM_Common_Waitting')}
                            />
                        )}

                        <View style={viewControl}>
                            <VnrAttachFile
                                disable={isChange}
                                key={Vnr_Function.MakeId(5)}
                                value={_value}
                                multiFile={true}
                                uri={'[URI_POR]/New_Home/saveFileFromApp'}
                                onFinish={(files) => this.onFinishFileAttach(files, _fieldName)}
                            />
                        </View>
                    </View>
                );
            } else if (item['Name'] == 'E_Group') {
                return (
                    <View style={[stylesDetailV2.styItemContentGroup, { paddingHorizontal: Size.defineSpace }]}>
                        <View style={styleSheets.viewLable}>
                            <VnrText style={[styleSheets.text, textLableGroup]} i18nKey={item['DisplayKey']} />
                        </View>
                    </View>
                );
            } else {
                let _value = '',
                    _isUpdateRecord = false;

                if (profileUpdate.hasOwnProperty([item['Name']])) {
                    _isUpdateRecord = true;
                    _value = profileUpdate[item['Name']];
                } else {
                    _value = profile[item['Name']];
                }

                if (_value && typeof _value == 'object') {
                    if (_value.hasOwnProperty('valueField')) {
                        let _property = _value['valueField'];
                        _value = _value[_property];
                    }
                    // else {
                    //     _value = '';
                    // }
                }
                let isValidateEmail = false
                if (item['Name'] === 'Email'
                    || item['Name'] === 'Email2'
                    || item['Name'] === 'Email3'
                    || item['Name'] === 'Email4') {
                    isValidateEmail = true;
                }

                let _isUpdateTextForField = this.state.isUpdateTextForField;
                let renderCtrl;
                if (item.Control && item.Control.fieldName == _isUpdateTextForField) {
                    let varChanging = 'TEMPORARILY_SLUG_' + _isUpdateTextForField;
                    let _valueChanging = profileUpdate.hasOwnProperty(varChanging)
                        ? profileUpdate[varChanging]
                        : _value;
                    let _keyboardType = item.Control.keyboardType ? item.Control.keyboardType : 'default',
                        _charType = item.Control.charType ? item.Control.charType : '';

                    renderCtrl = (
                        <View style={styleSheets.viewControl}>
                            <View style={viewInputEdit}>
                                <VnrTextInput
                                    style={[styleSheets.textInput, { height: Size.heightInput }]}
                                    autoFocus={true}
                                    returnKeyType={'done'}
                                    onBlur={() => this.applyText(_isUpdateTextForField, isValidateEmail)}
                                    onSubmitEditing={() => this.applyText(_isUpdateTextForField, isValidateEmail)}
                                    value={_valueChanging}
                                    onChangeText={(text) => this.onChangeText(_isUpdateTextForField, text)}
                                    keyboardType={_keyboardType}
                                    charType={_charType}
                                />
                            </View>

                            <View style={styles.styViewSaveInput}>
                                <View style={bntSaveInputView}>
                                    <TouchableOpacity
                                        style={bntCenter}
                                        onPress={() => {
                                            this.applyText(_isUpdateTextForField, isValidateEmail);
                                        }}
                                    >
                                        <IconCheck size={Size.iconSize} color={Colors.white} />
                                    </TouchableOpacity>
                                </View>

                                <View style={bntCancelInputView}>
                                    <TouchableOpacity
                                        style={bntCenter}
                                        onPress={() => {
                                            this.undoText(_isUpdateTextForField);
                                        }}
                                    >
                                        <IconColse size={Size.iconSize} color={Colors.white} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    );
                } else {
                    if (_value) {
                        if (
                            item['DataType'] &&
                            item['DataType'] !== '' &&
                            item['DataType'].toLowerCase() === 'datetime'
                        ) {
                            let _format = item['DataFormat'];
                            _value = moment(_value).format(_format);
                        } else if (
                            item['DataType'] &&
                            item['DataType'] !== '' &&
                            item['DataType'].toLowerCase() === 'double'
                        ) {
                            let _format = item['DataFormat'];
                            _value = format(_format, _value);
                        }
                    } else {
                        _value = '';
                    }

                    let isChange = dataWaitingApprove && dataWaitingApprove.indexOf(item.Control.fieldName) > -1,
                        colorTextWaiting = isChange ? { color: Colors.orange } : {};

                    renderCtrl = (
                        <View style={styleSheets.viewControl}>
                            <View style={styles.styFlex9Row}>
                                <VnrText
                                    style={[styleSheets.text, textValueInfo, colorTextWaiting, CustomStyleSheet.marginRight(5)]}
                                    value={_value}
                                />

                                {_isUpdateRecord && <IconError size={Size.iconSize - 2} color={Colors.warning} />}
                            </View>

                            {isChange && (
                                <VnrText
                                    style={[styleSheets.text, colorTextWaiting]}
                                    value={translate('HRM_Common_Waitting')}
                                />
                            )}

                            {dataNotChange && dataNotChange.indexOf(item.Control.fieldName) < 0 && !isChange && (
                                <View style={CustomStyleSheet.flex(1)}>
                                    <TouchableOpacity
                                        style={styles.styVIewEdit}
                                        onPress={() => this.onViewEdit(item)}
                                    >
                                        <IconEdit size={Size.iconSize} color={Colors.primary} />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    );
                }

                return (
                    <View style={itemContent} key={index}>
                        <View style={styleSheets.viewLable}>
                            <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={item['DisplayKey']} />

                            {configField[item.Control.fieldName] && (
                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                            )}
                        </View>
                        {renderCtrl}
                    </View>
                );
            }
        });
    };

    callControlProvince = (controlEditName, keyGetDataFilterCountry) => {
        //ex: TProvinceName and TCountryID
        const { profileUpdate } = this.state;
        let listConfigPersonalAll = ConfigList.value['GeneralInfoHreProfileContactInfo'];
        const controlProvince = listConfigPersonalAll.find((item) => item.Name === controlEditName);
        if (
            controlProvince !== undefined &&
            Object.keys(controlProvince).length > 0 &&
            profileUpdate[keyGetDataFilterCountry] != undefined
        ) {
            setTimeout(() => {
                this.onViewEdit(controlProvince);
            }, 100);
        }
    };

    callControlDistrict = (controlEditName, keyGetDataFilterProvince) => {
        //ex: 'TDistrictName','TProvinceID'

        const { profileUpdate } = this.state;
        let listConfigPersonalAll = ConfigList.value['GeneralInfoHreProfileContactInfo'];
        const controlDistrict = listConfigPersonalAll.find((item) => item.Name === controlEditName);
        if (
            controlDistrict !== undefined &&
            Object.keys(controlDistrict).length > 0 &&
            profileUpdate[keyGetDataFilterProvince] != undefined
        ) {
            setTimeout(() => {
                this.onViewEdit(controlDistrict);
            }, 100);
        }
    };

    callControlVillage = (controlEditName, keyGetDataFilterDistrict) => {
        //ex : 'TVillageName','TDistrictID'
        const { profileUpdate } = this.state;
        let listConfigPersonalAll = ConfigList.value['GeneralInfoHreProfileContactInfo'];
        const controlVillage = listConfigPersonalAll.find((item) => item.Name === controlEditName);
        if (
            controlVillage !== undefined &&
            Object.keys(controlVillage).length > 0 &&
            profileUpdate[keyGetDataFilterDistrict] != undefined
        ) {
            setTimeout(() => {
                this.onViewEdit(controlVillage);
            }, 100);
        }
    };

    onViewEdit = (item) => {
        const { profileUpdate, profile } = this.state;
        let _state = this.addFieldToState(item);
        let { Control } = item;
        if (Control.Name === 'VnrPicker') {
            let _ctrl = { ...Control, ..._state };
            switch (Control.fieldName) {
                case 'TProvinceID': {
                    if (
                        !Vnr_Function.CheckIsNullOrEmpty(profileUpdate['TCountryID']) ||
                        (profileUpdate['TCountryID'] === undefined &&
                            !Vnr_Function.CheckIsNullOrEmpty(profile['TCountryID']))
                    ) {
                        let valueParam = profileUpdate['TCountryID']
                            ? profileUpdate['TCountryID']['ID']
                            : profile['TCountryID'];
                        _ctrl.api = {
                            urlApi: `[URI_HR]/Cat_GetData/GetProvinceCascading?country=${valueParam}`,
                            type: 'E_GET'
                        };
                        this.setControl(_ctrl);
                        this.setState({ isUpdateTextForField: null, ..._state });
                    } else {
                        ToasterSevice.showWarning('HRM_common_Please_Select_Country', 4000);
                    }
                    break;
                }
                case 'TDistrictID': {
                    if (
                        !Vnr_Function.CheckIsNullOrEmpty(profileUpdate['TProvinceID']) ||
                        (profileUpdate['TProvinceID'] === undefined &&
                            !Vnr_Function.CheckIsNullOrEmpty(profile['TProvinceID']))
                    ) {
                        let valueParam = profileUpdate['TProvinceID']
                            ? profileUpdate['TProvinceID']['ID']
                            : profile['TProvinceID'];
                        _ctrl.api = {
                            urlApi: `[URI_HR]/Cat_GetData/GetDistrictCascading?province=${valueParam}`,
                            type: 'E_GET'
                        };
                        this.setControl(_ctrl);
                        this.setState({ isUpdateTextForField: null, ..._state });
                    } else {
                        ToasterSevice.showWarning('HRM_common_Please_Select_Province', 4000);
                    }
                    break;
                }
                case 'TAVillageID': {
                    if (
                        !Vnr_Function.CheckIsNullOrEmpty(profileUpdate['TDistrictID']) ||
                        (profileUpdate['TDistrictID'] === undefined &&
                            !Vnr_Function.CheckIsNullOrEmpty(profile['TDistrictID']))
                    ) {
                        let valueParam = profileUpdate['TDistrictID']
                            ? profileUpdate['TDistrictID']['ID']
                            : profile['TDistrictID'];
                        _ctrl.api = {
                            urlApi: `[URI_HR]/Cat_GetData/GetVillageCascading?districtid=${valueParam}`,
                            type: 'E_GET'
                        };
                        this.setControl(_ctrl);
                        this.setState({ isUpdateTextForField: null, ..._state });
                    } else {
                        ToasterSevice.showWarning('HRM_common_Please_Select_District', 4000);
                    }
                    break;
                }
                case 'PProvinceID': {
                    if (
                        !Vnr_Function.CheckIsNullOrEmpty(profileUpdate['PCountryID']) ||
                        (profileUpdate['PCountryID'] === undefined &&
                            !Vnr_Function.CheckIsNullOrEmpty(profile['PCountryID']))
                    ) {
                        let valueParam = profileUpdate['PCountryID']
                            ? profileUpdate['PCountryID']['ID']
                            : profile['PCountryID'];
                        _ctrl.api = {
                            urlApi: `[URI_HR]/Cat_GetData/GetProvinceCascading?country=${valueParam}`,
                            type: 'E_GET'
                        };
                        this.setControl(_ctrl);
                        this.setState({ isUpdateTextForField: null, ..._state });
                    } else {
                        ToasterSevice.showWarning('HRM_common_Please_Select_Country', 4000);
                    }
                    break;
                }
                case 'PDistrictID': {
                    if (
                        !Vnr_Function.CheckIsNullOrEmpty(profileUpdate['PProvinceID']) ||
                        (profileUpdate['PProvinceID'] === undefined &&
                            !Vnr_Function.CheckIsNullOrEmpty(profile['PProvinceID']))
                    ) {
                        let valueParam = profileUpdate['PProvinceID']
                            ? profileUpdate['PProvinceID']['ID']
                            : profile['PProvinceID'];
                        _ctrl.api = {
                            urlApi: `[URI_HR]/Cat_GetData/GetDistrictCascading?province=${valueParam}`,
                            type: 'E_GET'
                        };
                        this.setControl(_ctrl);
                        this.setState({ isUpdateTextForField: null, ..._state });
                    } else {
                        ToasterSevice.showWarning('HRM_common_Please_Select_Province', 4000);
                    }
                    break;
                }
                case 'VillageID': {
                    if (
                        !Vnr_Function.CheckIsNullOrEmpty(profileUpdate['PDistrictID']) ||
                        (profileUpdate['PDistrictID'] === undefined &&
                            !Vnr_Function.CheckIsNullOrEmpty(profile['PDistrictID']))
                    ) {
                        let valueParam = profileUpdate['PDistrictID']
                            ? profileUpdate['PDistrictID']['ID']
                            : profile['PDistrictID'];
                        _ctrl.api = {
                            urlApi: `[URI_HR]/Cat_GetData/GetVillageCascading?districtid=${valueParam}`,
                            type: 'E_GET'
                        };
                        this.setControl(_ctrl);
                        this.setState({ isUpdateTextForField: null, ..._state });
                    } else {
                        ToasterSevice.showWarning('HRM_common_Please_Select_District', 4000);
                    }
                    break;
                }
                default: {
                    this.setControl(_ctrl);
                    this.setState({ isUpdateTextForField: null, ..._state });
                    break;
                }
            }
        } else if (Control.Name === 'VnrPickerAddress') {
            let _ctrl = { ...Control, ..._state },
                { listPicker } = _ctrl;
            switch (Control.fieldName) {
                case 'TCountryID': {
                    if (listPicker.country) {
                        listPicker.country.value = _ctrl[listPicker.country.fieldName]
                            ? _ctrl[listPicker.country.fieldName]
                            : null;
                        this.setControl(_ctrl);
                        this.setState({ isUpdateTextForField: null, ..._state });
                    } else {
                        ToasterSevice.showWarning('HRM_common_Please_Select_Country', 4000);
                    }
                    break;
                }
                case 'TProvinceID': {
                    if (
                        listPicker.province &&
                        (!Vnr_Function.CheckIsNullOrEmpty(profileUpdate.TCountryID) ||
                            (profileUpdate.TCountryID === undefined &&
                                !Vnr_Function.CheckIsNullOrEmpty(profile.TCountryID)))
                    ) {
                        let valueParam = profileUpdate['TCountryID']
                            ? profileUpdate['TCountryID']['ID']
                            : profile['TCountryID'];
                        listPicker.province.api = {
                            urlApi: `[URI_HR]/Cat_GetData/GetProvinceCascading?country=${valueParam}`,
                            type: 'E_GET'
                        };
                        listPicker.province.value = _ctrl[listPicker.province.fieldName]
                            ? _ctrl[listPicker.province.fieldName]
                            : null;
                        this.setControl(_ctrl);
                        this.setState({ isUpdateTextForField: null, ..._state });
                    } else {
                        ToasterSevice.showWarning('HRM_common_Please_Select_Country', 4000);
                    }
                    break;
                }
                case 'TDistrictID': {
                    if (
                        listPicker.district &&
                        (!Vnr_Function.CheckIsNullOrEmpty(profileUpdate['TProvinceID']) ||
                            (profileUpdate['TProvinceID'] === undefined &&
                                !Vnr_Function.CheckIsNullOrEmpty(profile['TProvinceID'])))
                    ) {
                        let valueParam = profileUpdate['TProvinceID']
                            ? profileUpdate['TProvinceID']['ID']
                            : profile['TProvinceID'];
                        listPicker.district.api = {
                            urlApi: `[URI_HR]/Cat_GetData/GetDistrictCascading?province=${valueParam}`,
                            type: 'E_GET'
                        };
                        listPicker.district.value = _ctrl[listPicker.district.fieldName]
                            ? _ctrl[listPicker.district.fieldName]
                            : null;
                        this.setControl(_ctrl);
                        this.setState({ isUpdateTextForField: null, ..._state });
                    } else {
                        ToasterSevice.showWarning('HRM_common_Please_Select_Province', 4000);
                    }
                    break;
                }
                case 'TAVillageID': {
                    if (
                        listPicker.village &&
                        (!Vnr_Function.CheckIsNullOrEmpty(profileUpdate['TDistrictID']) ||
                            (profileUpdate['TDistrictID'] === undefined &&
                                !Vnr_Function.CheckIsNullOrEmpty(profile['TDistrictID'])))
                    ) {
                        let valueParam = profileUpdate['TDistrictID']
                            ? profileUpdate['TDistrictID']['ID']
                            : profile['TDistrictID'];
                        listPicker.village.api = {
                            urlApi: `[URI_HR]/Cat_GetData/GetVillageCascading?districtid=${valueParam}`,
                            type: 'E_GET'
                        };
                        listPicker.village.value = _ctrl[listPicker.village.fieldName]
                            ? _ctrl[listPicker.village.fieldName]
                            : null;
                        this.setControl(_ctrl);
                        this.setState({ isUpdateTextForField: null, ..._state });
                    } else {
                        ToasterSevice.showWarning('HRM_common_Please_Select_District', 4000);
                    }
                    break;
                }
                case 'PCountryID': {
                    if (listPicker.country) {
                        listPicker.country.value = _ctrl[listPicker.country.fieldName]
                            ? _ctrl[listPicker.country.fieldName]
                            : null;
                        this.setControl(_ctrl);
                        this.setState({ isUpdateTextForField: null, ..._state });
                    } else {
                        ToasterSevice.showWarning('HRM_common_Please_Select_Country', 4000);
                    }
                    break;
                }
                case 'PProvinceID': {
                    if (
                        listPicker.province &&
                        (!Vnr_Function.CheckIsNullOrEmpty(profileUpdate['PCountryID']) ||
                            (profileUpdate['PCountryID'] === undefined &&
                                !Vnr_Function.CheckIsNullOrEmpty(profile['PCountryID'])))
                    ) {
                        let valueParam = profileUpdate['PCountryID']
                            ? profileUpdate['PCountryID']['ID']
                            : profile['PCountryID'];
                        listPicker.province.api = {
                            urlApi: `[URI_HR]/Cat_GetData/GetProvinceCascading?country=${valueParam}`,
                            type: 'E_GET'
                        };
                        listPicker.province.value = _ctrl[listPicker.province.fieldName]
                            ? _ctrl[listPicker.province.fieldName]
                            : null;
                        this.setControl(_ctrl);
                        this.setState({ isUpdateTextForField: null, ..._state });
                    } else {
                        ToasterSevice.showWarning('HRM_common_Please_Select_Country', 4000);
                    }
                    break;
                }
                case 'PDistrictID': {
                    if (
                        listPicker.district &&
                        (!Vnr_Function.CheckIsNullOrEmpty(profileUpdate['PProvinceID']) ||
                            (profileUpdate['PProvinceID'] === undefined &&
                                !Vnr_Function.CheckIsNullOrEmpty(profile['PProvinceID'])))
                    ) {
                        let valueParam = profileUpdate['PProvinceID']
                            ? profileUpdate['PProvinceID']['ID']
                            : profile['PProvinceID'];
                        listPicker.district.api = {
                            urlApi: `[URI_HR]/Cat_GetData/GetDistrictCascading?province=${valueParam}`,
                            type: 'E_GET'
                        };
                        listPicker.district.value = _ctrl[listPicker.district.fieldName]
                            ? _ctrl[listPicker.district.fieldName]
                            : null;
                        this.setControl(_ctrl);
                        this.setState({ isUpdateTextForField: null, ..._state });
                    } else {
                        ToasterSevice.showWarning('HRM_common_Please_Select_Province', 4000);
                    }
                    break;
                }
                case 'VillageID': {
                    if (
                        listPicker.village &&
                        (!Vnr_Function.CheckIsNullOrEmpty(profileUpdate['PDistrictID']) ||
                            (profileUpdate['PDistrictID'] === undefined &&
                                !Vnr_Function.CheckIsNullOrEmpty(profile['PDistrictID'])))
                    ) {
                        let valueParam = profileUpdate['PDistrictID']
                            ? profileUpdate['PDistrictID']['ID']
                            : profile['PDistrictID'];
                        listPicker.village.api = {
                            urlApi: `[URI_HR]/Cat_GetData/GetVillageCascading?districtid=${valueParam}`,
                            type: 'E_GET'
                        };
                        listPicker.village.value = _ctrl[listPicker.village.fieldName]
                            ? _ctrl[listPicker.village.fieldName]
                            : null;
                        this.setControl(_ctrl);
                        this.setState({ isUpdateTextForField: null, ..._state });
                    } else {
                        ToasterSevice.showWarning('HRM_common_Please_Select_District', 4000);
                    }
                    break;
                }
                case 'CountryBirthCertificateID': {
                    if (listPicker.country) {
                        listPicker.country.value = _ctrl[listPicker.country.fieldName]
                            ? _ctrl[listPicker.country.fieldName]
                            : null;
                        this.setControl(_ctrl);
                        this.setState({ isUpdateTextForField: null, ..._state });
                    } else {
                        ToasterSevice.showWarning('HRM_common_Please_Select_Country', 4000);
                    }
                    break;
                }
                case 'ProvinceBirthCertificateID': {
                    listPicker.province.api = {
                        urlApi: '[URI_HR]/Cat_GetData/GetMultiProvince',
                        type: 'E_GET'
                    };
                    listPicker.province.value = _ctrl[listPicker.province.fieldName]
                        ? _ctrl[listPicker.province.fieldName]
                        : null;
                    this.setControl(_ctrl);
                    this.setState({ isUpdateTextForField: null, ..._state });
                    break;
                }
                case 'DistrictBirthCertificateID': {
                    if (
                        listPicker.district &&
                        (!Vnr_Function.CheckIsNullOrEmpty(profileUpdate['ProvinceBirthCertificateID']) ||
                            (profileUpdate['ProvinceBirthCertificateID'] === undefined &&
                                !Vnr_Function.CheckIsNullOrEmpty(profile['ProvinceBirthCertificateID'])))
                    ) {
                        let valueParam = profileUpdate['ProvinceBirthCertificateID']
                            ? profileUpdate['ProvinceBirthCertificateID']['ID']
                            : profile['ProvinceBirthCertificateID'];
                        listPicker.district.api = {
                            urlApi: `[URI_HR]/Cat_GetData/GetDistrictCascading?province=${valueParam}`,
                            type: 'E_GET'
                        };
                        listPicker.district.value = _ctrl[listPicker.district.fieldName]
                            ? _ctrl[listPicker.district.fieldName]
                            : null;
                        this.setControl(_ctrl);
                        this.setState({ isUpdateTextForField: null, ..._state });
                    } else {
                        ToasterSevice.showWarning('HRM_common_Please_Select_Province', 4000);
                    }
                    break;
                }
                case 'VillageBirthCertificateID': {
                    if (
                        listPicker.village &&
                        (!Vnr_Function.CheckIsNullOrEmpty(profileUpdate['DistrictBirthCertificateID']) ||
                            (profileUpdate['DistrictBirthCertificateID'] === undefined &&
                                !Vnr_Function.CheckIsNullOrEmpty(profile['DistrictBirthCertificateID'])))
                    ) {
                        let valueParam = profileUpdate['DistrictBirthCertificateID']
                            ? profileUpdate['DistrictBirthCertificateID']['ID']
                            : profile['DistrictBirthCertificateID'];
                        listPicker.village.api = {
                            urlApi: `[URI_HR]/Cat_GetData/GetVillageCascading?districtid=${valueParam}`,
                            type: 'E_GET'
                        };
                        listPicker.village.value = _ctrl[listPicker.village.fieldName]
                            ? _ctrl[listPicker.village.fieldName]
                            : null;
                        this.setControl(_ctrl);
                        this.setState({ isUpdateTextForField: null, ..._state });
                    } else {
                        ToasterSevice.showWarning('HRM_common_Please_Select_District', 4000);
                    }
                    break;
                }
                default: {
                    this.setControl(_ctrl);
                    this.setState({ isUpdateTextForField: null, ..._state });
                    break;
                }
            }
        } else if (Control.Name === 'VnrDate') {
            let _ctrl = { ...Control, ..._state };
            this.setControl(_ctrl);
            this.setState({ isUpdateTextForField: null, ..._state });
        } else if (Control.Name === 'VnrText') {
            this.setState({ isUpdateTextForField: Control.fieldName });
        }
    };

    onFinish = (item, control) => {
        if (item !== null) {
            if (control.Name == 'VnrPicker') {
                this.setControl(null);
                let obj = {
                    [control.objValue.key]: translate('SELECT_ITEM'),
                    [control.fieldName]: null
                };

                if (item !== undefined) {
                    obj = {
                        [control.objValue.key]: item[control.textField],
                        [control.fieldName]: {
                            [control.textField]: item[control.textField],
                            [control.valueField]: item[control.valueField],
                            valueField: control.valueField
                        }
                    };
                }
                switch (control.fieldName) {
                    case 'TCountryID': {
                        let resetDataCascade = {
                            TProvinceID: null,
                            TProvinceName: null,
                            TDistrictID: null,
                            TDistrictName: null,
                            TVillageName: null,
                            TAVillageID: null
                        };
                        this.setState(
                            {
                                profileUpdate: {
                                    ...this.state.profileUpdate,
                                    ...obj,
                                    ...resetDataCascade
                                }
                            },
                            () => this.callControlProvince('TProvinceName', 'TCountryID')
                        );
                        break;
                    }
                    case 'TProvinceID': {
                        let resetDataCascade = {
                            TDistrictID: null,
                            TDistrictName: null,
                            TVillageName: null,
                            TAVillageID: null
                        };
                        this.setState(
                            {
                                profileUpdate: {
                                    ...this.state.profileUpdate,
                                    ...obj,
                                    ...resetDataCascade
                                }
                            },
                            () => this.callControlDistrict('TDistrictName', 'TProvinceID')
                        );
                        break;
                    }
                    case 'TDistrictID': {
                        let resetDataCascade = {
                            TVillageName: null,
                            TAVillageID: null
                        };
                        this.setState(
                            {
                                profileUpdate: {
                                    ...this.state.profileUpdate,
                                    ...obj,
                                    ...resetDataCascade
                                }
                            },
                            () => this.callControlVillage('TVillageName', 'TDistrictID')
                        );
                        break;
                    }
                    case 'PCountryID': {
                        let resetDataCascade = {
                            PProvinceID: null,
                            PProvinceName: null,
                            PDistrictID: null,
                            PDistrictName: null,
                            PVillageName: null,
                            VillageID: null
                        };
                        this.setState(
                            {
                                profileUpdate: {
                                    ...this.state.profileUpdate,
                                    ...obj,
                                    ...resetDataCascade
                                }
                            },
                            () => this.callControlProvince('PProvinceName', 'PCountryID')
                        );
                        break;
                    }
                    case 'PProvinceID': {
                        let resetDataCascade = {
                            PDistrictID: null,
                            PDistrictName: null,
                            PVillageName: null,
                            VillageID: null
                        };
                        this.setState(
                            {
                                profileUpdate: {
                                    ...this.state.profileUpdate,
                                    ...obj,
                                    ...resetDataCascade
                                }
                            },
                            () => this.callControlDistrict('PDistrictName', 'PProvinceID')
                        );
                        break;
                    }
                    case 'PDistrictID': {
                        let resetDataCascade = {
                            PVillageName: null,
                            VillageID: null
                        };
                        this.setState(
                            {
                                profileUpdate: {
                                    ...this.state.profileUpdate,
                                    ...obj,
                                    ...resetDataCascade
                                }
                            },
                            () => this.callControlVillage('PVillageName', 'PDistrictID')
                        );
                        break;
                    }
                    default:
                        this.setState({
                            profileUpdate: { ...this.state.profileUpdate, ...obj }
                        });
                        break;
                }
            } else if (control.Name == 'VnrPickerAddress' && control.listPicker) {
                // ex : item = { TCountryID : {...}, TAVillageID :{...}, TDistrictID : {...}, TProvinceID :{...} }
                let obj = {};

                // trong listPicker chua tat ca cac control lien quan
                // eslint-disable-next-line no-unused-vars
                for (let key in control.listPicker) {
                    let controlTemp = control.listPicker[key];

                    if (item[controlTemp.fieldName]) {
                        // lay value cua control theo fieldName
                        let valueControl = item[controlTemp.fieldName];
                        obj[controlTemp.objValue.key] = valueControl[controlTemp.textField];
                        obj[controlTemp.fieldName] = {
                            [controlTemp.textField]: valueControl[controlTemp.textField],
                            [controlTemp.valueField]: valueControl[controlTemp.valueField],
                            valueField: controlTemp.valueField
                        };
                    } else {
                        obj[controlTemp.objValue.key] = translate('SELECT_ITEM');
                        obj[controlTemp.fieldName] = null;
                    }
                }

                // dua control ve null
                this.setControl(null);

                this.setState({ profileUpdate: { ...this.state.profileUpdate, ...obj } });
            } else if (control.Name == 'VnrDate') {
                this.setControl(null);
                let obj = { [control.fieldName]: item };
                this.setState({ profileUpdate: { ...this.state.profileUpdate, ...obj } });
            }
        } else {
            this.setControl(null);
            this.setState({ isRefresh: !this.state.isRefresh });
        }
    };

    render() {
        const { profile, isLoading } = this.state;
        let listConfigPersonalAll = [],
            contentList = <View />,
            viewEditControl = <View />;

        if (isLoading) {
            contentList = <VnrLoading size="large" isVisible={isLoading} />;
        } else if (profile == EnumName.E_EMPTYDATA || Object.keys(profile).length == 0) {
            contentList = <EmptyData messageEmptyData={'EmptyData'} />;
        } else if (profile && Object.keys(profile).length > 0) {
            if (profile) {
                listConfigPersonalAll = ConfigList.value['GeneralInfoHreProfileContactInfo'];
            }

            if (this.getControl()) {
                if (this.getControl().Name === 'VnrPicker') {
                    viewEditControl = (
                        <VnrPicker
                            autoShowModal={true}
                            key={this.getControl().fieldName}
                            value={this.getControl()[this.getControl().fieldName]}
                            {...this.getControl()}
                            onFinish={(item) => this.onFinish(item, this.getControl())}
                        />
                    );
                } else if (this.getControl().Name === 'VnrPickerAddress') {
                    viewEditControl = (
                        <VnrPickerAddress
                            autoShowModal={true}
                            key={this.getControl().fieldName}
                            {...this.getControl()}
                            onFinish={(item) => this.onFinish(item, this.getControl())}
                        />
                    );
                } else {
                    viewEditControl = (
                        <VnrDate
                            autoShowModal={true}
                            key={this.getControl().fieldName}
                            {...this.getControl()}
                            value={this.getControl()[this.getControl().fieldName]}
                            onFinish={(item) => this.onFinish(item, this.getControl())}
                        />
                    );
                }
            }

            contentList = (
                <View style={styleSheets.container}>
                    {PermissionForAppMobile &&
                        PermissionForAppMobile.value['New_Personal_Warning_EditInformation_AttachFile'] &&
                        PermissionForAppMobile.value['New_Personal_Warning_EditInformation_AttachFile']['View'] && (
                        <View style={styles.styViewWarning}>
                            <VnrText
                                style={[styleSheets.lable, styles.styWarText]}
                                i18nKey={'HRM_LB_Warning_EditInformation_ProfileTab'}
                            />
                        </View>
                    )}

                    <KeyboardAwareScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                        extraScrollHeight={20} // khoan cach
                        keyboardShouldPersistTaps={'handled'}
                    >
                        {this.initView(listConfigPersonalAll, profile)}
                    </KeyboardAwareScrollView>
                    {/* bottom button save */}
                    <View style={styles.wrapButtonHandler}>
                        <TouchableOpacity style={styles.wrapBtnRegister} onPress={() => this.onUpdate()}>
                            <VnrText
                                style={[styleSheets.lable, styles.styRegister]}
                                i18nKey={'HRM_Common_SendRequest_Button'}
                            />
                        </TouchableOpacity>

                        {PermissionForAppMobile &&
                            PermissionForAppMobile.value['Personal_GeneralProfileDetail_btnSaveTempPersonal_Portal'] &&
                            PermissionForAppMobile.value['Personal_GeneralProfileDetail_btnSaveTempPersonal_Portal'][
                                'View'
                            ] && (
                            <TouchableOpacity style={styles.btnSaveTemp} onPress={() => this.onUpdate(true)}>
                                <IconSave size={Size.iconSize} color={'#000'} />
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity style={styles.btnRefresh} onPress={() => this.undoUpdate()}>
                            <Image
                                style={{ width: Size.iconSize, height: Size.iconSize }}
                                resizeMode="cover"
                                source={require('../../../../../assets/images/vnrDateFromTo/reset-sm.png')}
                            />
                        </TouchableOpacity>
                    </View>

                    {viewEditControl}
                </View>
            );
        }

        return <SafeAreaViewDetail style={styleSafeAreaView.style}>{contentList}</SafeAreaViewDetail>;
    }
}

const mapStateToProps = (state) => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

export default connect(mapStateToProps)(TopTabProfileContactInfoUpdate);

const styles = StyleSheet.create({
    styVIewEdit: { alignItems: 'center',
        justifyContent: 'center' },
    styFlex9Row: { flex: 9,
        flexDirection: 'row' },
    styViewSaveInput: { flex: 3,
        flexDirection: 'row' },
    styViewWarning: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.danger,
        borderRadius: 7,
        padding: Size.defineHalfSpace,
        marginTop: Size.defineSpace,
        marginHorizontal: Size.defineSpace,
        marginBottom: Size.defineHalfSpace
    },
    styWarText: {
        color: Colors.danger
    },
    wrapButtonHandler: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: Size.defineSpace,
        zIndex: 1,
        elevation: 1,
        paddingVertical: Size.defineSpace,
        backgroundColor: Colors.white
    },
    wrapBtnRegister: {
        flex: 6,
        marginRight: Size.defineHalfSpace,
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
        paddingVertical: 10
    },
    styRegister: {
        fontSize: Size.text + 1,
        fontWeight: '400',
        color: Colors.white
    },
    btnSaveTemp: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.black_transparent_8,
        marginRight: Size.defineHalfSpace,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 2
    },
    btnRefresh: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
