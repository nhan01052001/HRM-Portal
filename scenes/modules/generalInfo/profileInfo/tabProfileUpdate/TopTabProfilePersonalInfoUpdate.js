/* eslint-disable no-prototype-builtins */
import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
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
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { translate } from '../../../../../i18n/translate';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import VnrPicker from '../../../../../components/VnrPicker/VnrPicker';
import VnrDate from '../../../../../components/VnrDate/VnrDate';
import DrawerServices from '../../../../../utils/DrawerServices';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { EnumIcon, EnumName, EnumTask } from '../../../../../assets/constant';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import VnrAttachFile from '../../../../../components/VnrAttachFile/VnrAttachFile';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import { getDataLocal } from '../../../../../factories/LocalData';
import { startTask } from '../../../../../factories/BackGroundTask';

class TopTabProfilePersonalInfoUpdate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            profile: null,
            profileUpdate: {},
            showHidecontrol: {
                MarriageFileAttach: false,
                EducationFileAttach: false,
                SpecializationFileAttach: false
            },
            isUpdateTextForField: null,
            isUpdate: true,
            isRefresh: false,
            dataWaitingApprove: [],
            dataNotChange: null,
            isLoading: true,
            refreshing: false,
            keyQuery: EnumName.E_PRIMARY_DATA,
            configField: {}
        };

        props.navigation.setParams({
            headerRight: (
                <TouchableOpacity onPress={() => props.navigation.navigate('TopTabHisProfileInfo')}>
                    <View style={styleSheets.bnt_HeaderRight}>
                        <VnrText style={[styleSheets.text]} i18nKey={'DisplayKey'} />
                    </View>
                </TouchableOpacity>
            )
        });

        this.toControl = null;
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

    // updateProfile() {
    //     //personal

    //     let { profile, profileUpdate } = this.state;
    //     let keys = Object.keys(profileUpdate);

    //     //check info has change
    //     if (profileUpdate && keys.length) {
    //         profile = { ...profile, FieldChanged: keys.join() };
    //         return this.createObj(profile, profileUpdate, keys, 0, this.formatDateToServer, this.onUpdate, this.undoUpdate);
    //     }
    //     else {
    //         //ToasterSevice.showInfo("HRM_Data_Not_Change", 5000);
    //         return 'NotChange';
    //     }
    // }

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

    // onUpdate = (obj, undoUpdate) => {
    //     return { obj, undoUpdate };
    // }

    onUpdate = (isSaveTemp) => {
        let dataPersonal = this.getDataUpdate();

        if (dataPersonal) {
            dataPersonal.IsPortalApp = true;

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
                    if (isSaveTemp) dataPersonal.IsSaveTemp = true;

                    VnrLoadingSevices.show();
                    HttpService.Post('[URI_HR]/Hre_GetDataV2/CreatePersonalInfo', dataPersonal).then((res) => {
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
            HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=Hre_PersonalInfoPortal')
        ]).then((resAll) => {
            try {
                const [res, configField] = resAll;
                let { showHidecontrol } = this.state;
                let nextState = {
                    dataWaitingApprove: _dataWaitingApprove,
                    profile: _profile
                };

                showHidecontrol = {
                    ...showHidecontrol,
                    MarriageFileAttach:
                        _profile['MarriageStatus'] == 'E_SINGLE' || _profile['MarriageStatus'] == null ? false : true,
                    EducationFileAttach: _profile['EducationLevelID'] == null ? false : true,
                    SpecializationFileAttach: _profile['Specialization'] == null ? false : true
                };

                if (res && res.Value1) {
                    nextState = {
                        ...nextState,
                        showHidecontrol: showHidecontrol,
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

    applyText = (field) => {
        let { profileUpdate } = this.state;
        let varTmp = 'TEMPORARILY_SLUG_' + field;
        if (profileUpdate.hasOwnProperty(varTmp)) {
            let valTmp = profileUpdate[varTmp];
            let obj = { [field]: valTmp };
            delete profileUpdate[varTmp];
            this.setState({
                profileUpdate: { ...this.state.profileUpdate, ...obj },
                isUpdateTextForField: null
            });
        } else {
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

        if (_name && _name.toLowerCase() === 'vnrpicker') {
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
        const { profileUpdate, dataNotChange, dataWaitingApprove, showHidecontrol, configField } = this.state,
            { itemContent, textLableGroup, viewInputEdit, bntSaveInputView, bntCancelInputView, bntCenter } =
                styleProfileInfo,
            { textValueInfo, textLableInfo } = styleScreenDetail,
            { viewLable, viewControl } = stylesListPickerControl,
            stylesDetailV2 = stylesScreenDetailV2;

        return config.map((item, index) => {
            // Fix thêm File đính kèm CMDD vs CCCD
            // task 0143186
            if (item['Name'] == 'FileAttach') {
                let _fieldName = item['fieldName'] ? item['fieldName'] : item['FieldName'];
                let _value = null;
                if (profileUpdate.hasOwnProperty(_fieldName)) {
                    _value = profileUpdate[_fieldName]['value'];
                } else {
                    let _field = item['FieldNameAttach'];
                    _value = profile[_field];
                }
                let isChange = dataWaitingApprove && dataWaitingApprove.indexOf(_fieldName) > -1,
                    colorTextWaiting = isChange ? { color: Colors.orange, marginTop: Size.defineHalfSpace } : {};

                // 0172569: App - Màn hình "Hồ sơ cá nhân", thêm trường thông tin cho tab "Thông tin nhân viên và liên hệ"
                let isVisible = true;
                if (
                    item['fieldName'] == 'MarriageFileAttach' ||
                    item['fieldName'] == 'EducationFileAttach' ||
                    item['fieldName'] == 'SpecializationFileAttach'
                ) {
                    isVisible = showHidecontrol[item['fieldName']];
                }

                // #region: hashcode task: 0170040: [Hotfix build 05 QC] App - Tích hợp chức năng trích xuất thông tin từ hình ảnh CCCD/CMND/Hộ chiếu
                let subName = null;

                // CCCD
                if (item['fieldName'] === 'ScannedCopyOfIDCard') {
                    subName = 'CCCD';
                }

                // CMND
                if (item['fieldName'] === 'ScannedCopyOfIDNo') {
                    subName = 'CMND';
                }

                // HC
                if (item['fieldName'] === 'ScannedCopyOfPassport') {
                    subName = 'HC';
                }

                // #endregion

                if (isVisible)
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
                                    isCamera={true}
                                    subNameFile={subName}
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
                //let _value = profileUpdate.hasOwnProperty([item["Name"]]) ? profileUpdate[item["Name"]] : profile[item["Name"]];

                if (_value && typeof _value == 'object') {
                    if (_value.hasOwnProperty('valueField')) {
                        let _property = _value['valueField'];
                        _value = _value[_property];
                    }
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
                                    onSubmitEditing={() => this.applyText(_isUpdateTextForField)}
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
                                            this.applyText(_isUpdateTextForField);
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
                            <View style={styles.styViewFlex9ROw}>
                                <VnrText
                                    style={[
                                        styleSheets.text,
                                        textValueInfo,
                                        colorTextWaiting,
                                        CustomStyleSheet.marginRight(5)
                                    ]}
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
                                    <TouchableOpacity style={styles.styVIewEdit} onPress={() => this.onViewEdit(item)}>
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

    onViewEdit = (item) => {
        let _state = this.addFieldToState(item);
        let { Control } = item;

        if (Control.Name === 'VnrPicker') {
            let _ctrl = { ...Control, ..._state };
            this.setControl(_ctrl);
            this.setState({ isUpdateTextForField: null, ..._state });
        } else if (Control.Name === 'VnrDate') {
            let _ctrl = { ...Control, ..._state };
            this.setControl(_ctrl);
            this.setState({ isUpdateTextForField: null, ..._state });
        } else if (Control.Name === 'VnrText') {
            // this.refs['ref' + Control.fieldName];
            // conosle.log(this.refsInput)
            this.setState({ isUpdateTextForField: Control.fieldName });
        }
    };

    onFinish = (item, control) => {
        // control.value = item ? { ...item } : null;
        let { showHidecontrol } = this.state;
        this.setControl(null);
        if (item !== null) {
            if (control.Name == 'VnrPicker') {
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

                // 0172569: App - Màn hình "Hồ sơ cá nhân", thêm trường thông tin cho tab "Thông tin nhân viên và liên hệ"
                if (control.fieldName == 'MarriageStatus') {
                    if (item[control.valueField] == 'E_SINGLE' || item[control.valueField] == null) {
                        obj = {
                            ...obj,
                            ['MarriageFileAttach']: {
                                valueField: 'MarriageFileAttach',
                                ['MarriageFileAttach']: '',
                                value: null
                            }
                        };

                        showHidecontrol = {
                            ...showHidecontrol,
                            MarriageFileAttach: false
                        };
                    } else {
                        showHidecontrol = {
                            ...showHidecontrol,
                            MarriageFileAttach: true
                        };
                    }
                }

                if (control.fieldName == 'EducationLevelID') {
                    if (item[control.valueField] == null) {
                        obj = {
                            ...obj,
                            ['EducationFileAttach']: {
                                valueField: 'EducationFileAttach',
                                ['EducationFileAttach']: '',
                                value: null
                            }
                        };

                        showHidecontrol = {
                            ...showHidecontrol,
                            EducationFileAttach: false
                        };
                    } else {
                        showHidecontrol = {
                            ...showHidecontrol,
                            EducationFileAttach: true
                        };
                    }
                }

                if (control.fieldName == 'Specialization') {
                    if (item[control.valueField] == null) {
                        obj = {
                            ...obj,
                            ['SpecializationFileAttach']: {
                                valueField: 'SpecializationFileAttach',
                                ['SpecializationFileAttach']: '',
                                value: null
                            }
                        };

                        showHidecontrol = {
                            ...showHidecontrol,
                            SpecializationFileAttach: false
                        };
                    } else {
                        showHidecontrol = {
                            ...showHidecontrol,
                            SpecializationFileAttach: true
                        };
                    }
                }

                this.setState({ profileUpdate: { ...this.state.profileUpdate, ...obj }, showHidecontrol });
            } else if (control.Name == 'VnrDate') {
                let obj = null;
                if (control.fieldName == 'DateOfBirth') {
                    obj = {
                        DateOfBirth: item,
                        YearOfBirth: new Date(item).getFullYear(),
                        MonthOfBirth: new Date(item).getMonth() + 1,
                        DayOfBirth: new Date(item).getDate()
                    };
                } else {
                    obj = { [control.fieldName]: item };
                }

                this.setState({ profileUpdate: { ...this.state.profileUpdate, ...obj } });
            }
        } else {
            this.setState({ isRefresh: !this.state.isRefresh });
        }
    };

    render() {
        const { profile, isLoading } = this.state;
        //const listConfig = config["ConfigList"].find(item => item.ScreenName === "GeneralInfoHreProfile");
        let contentList = <View />,
            listConfigBasic = []; //listConfig["PersonalInfo"];

        if (isLoading) {
            contentList = <VnrLoading size="large" isVisible={isLoading} />;
        } else if (profile == EnumName.E_EMPTYDATA || Object.keys(profile).length == 0) {
            contentList = <EmptyData messageEmptyData={'EmptyData'} />;
        } else if (profile && Object.keys(profile).length > 0) {
            listConfigBasic = ConfigList.value['GeneralInfoHreProfilePersonalInfo'];
            contentList = (
                <View style={styleSheets.container}>
                    {/* <ScrollView> */}
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
                        {this.initView(listConfigBasic, profile)}
                    </KeyboardAwareScrollView>
                    {/* </ScrollView> */}

                    {this.getControl() &&
                        (this.getControl().Name === 'VnrPicker' ? (
                            <VnrPicker
                                autoShowModal={true}
                                key={this.getControl().fieldName}
                                value={this.getControl()[this.getControl().fieldName]}
                                {...this.getControl()}
                                onFinish={(item) => this.onFinish(item, this.getControl())}
                            />
                        ) : (
                            <VnrDate
                                autoShowModal={true}
                                key={this.getControl().fieldName}
                                {...this.getControl()}
                                value={this.getControl()[this.getControl().fieldName]}
                                onFinish={(item) => this.onFinish(item, this.getControl())}
                            />
                        ))}

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
                </View>
            );
        }

        return <SafeAreaViewDetail style={styleSafeAreaView.style}>{contentList}</SafeAreaViewDetail>;
    }
}
const styles = StyleSheet.create({
    styVIewEdit: { alignItems: 'center', justifyContent: 'center' },
    styViewFlex9ROw: { flex: 9, flexDirection: 'row' },
    styViewSaveInput: { flex: 3, flexDirection: 'row' },
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
const mapStateToProps = (state) => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

export default connect(mapStateToProps)(TopTabProfilePersonalInfoUpdate);
