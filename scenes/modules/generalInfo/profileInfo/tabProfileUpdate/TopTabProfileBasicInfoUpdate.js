import React, { Component } from 'react';
// eslint-disable-next-line react-native/split-platform-components
import { View, StyleSheet, Image, TouchableOpacity, Platform, PermissionsAndroid } from 'react-native';
import HttpService from '../../../../../utils/HttpService';
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
import { IconEdit, IconCheck, IconColse, IconError } from '../../../../../constants/Icons';
import format from 'number-format.js';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import VnrPicker from '../../../../../components/VnrPicker/VnrPicker';
import VnrDate from '../../../../../components/VnrDate/VnrDate';
import DrawerServices from '../../../../../utils/DrawerServices';
import VnrText from '../../../../../components/VnrText/VnrText';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import { translate } from '../../../../../i18n/translate';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import { EnumIcon, EnumName, EnumTask } from '../../../../../assets/constant';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrAttachFile from '../../../../../components/VnrAttachFile/VnrAttachFile';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import { getDataLocal } from '../../../../../factories/LocalData';
import { startTask } from '../../../../../factories/BackGroundTask';
import ActionSheet from 'react-native-actionsheet';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

class TopTabProfileBasicInfoUpdate extends Component {
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
            fileIamgeAvatar: null,
            isLoading: true,
            refreshing: false,
            keyQuery: EnumName.E_PRIMARY_DATA,
            configField: {},
            showHidecontrol: {
                ProbationTime: false,
                DateEndProbation: false
            }
        };

        // props.navigation.setParams({
        //     getDataUpdate: this.getDataUpdate.bind(this),
        //     undoUpdate: this.undoUpdate.bind(this)
        // });

        this.toControl = null;

        this.sheetActions = [
            {
                title: translate('Att_TAMScanLog_Camera'),
                onPress: () => this.showPickerCamera()
            },
            {
                title: translate('HRM_ChooseFromLibrary'),
                onPress: () => this.showPickerImage()
            },
            {
                title: translate('HRM_Common_Close'),
                onPress: null
            }
        ];
        this.resActionSheet = null;
    }

    showActionSheet = () => {
        const { disable } = this.props;
        !disable && this.resActionSheet ? this.resActionSheet.show() : null;
    };
    actionSheetOnCLick = (index) => {
        if (this.sheetActions[index].onPress) {
            this.sheetActions[index].onPress();
        }
    };

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

        //không có dữ iệu thay đổi => khỏi save
        return null;
    };

    onUpdate = () => {
        let dataBasic = this.getDataUpdate();

        if (dataBasic) {
            dataBasic.IsPortalApp = true;

            // nhan.nguyen: 0179283: [Hotfix NS2PC_v8.10.38] App_Lỗi tự sinh 1 dòng chỉnh sửa ảnh đại diện dù không chỉnh sửa
            if (dataBasic?.ImagePath && typeof dataBasic?.ImagePath === 'string' && dataBasic?.ImagePath.includes('Images/')) {
                const imagePath = dataBasic?.ImagePath.split('Images/');
                dataBasic.ImagePath = imagePath[imagePath.length - 1];

                // nhan.nguyen: new logic
                // if user not have avatar will load 'no_avatar.jpg' make avatar default. so, need hard = null if it's 'no_avatar.jpg'
                if (dataBasic.ImagePath === 'no_avatar.jpg') {
                    dataBasic.ImagePath = null;
                }
            }

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

                    VnrLoadingSevices.show();
                    HttpService.Post('[URI_HR]/Hre_GetDataV2/CreateBasicInfo', {
                        ...dataBasic,
                        CodeTaxTemp: dataBasic?.CodeTax
                    }).then((res) => {
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
            HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=Hre_BasicInfoPortal')
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
                    ProbationTime: _profile['ProbationTime'] == null ? false : true,
                    DateEndProbation: _profile['ProbationTime'] == null ? false : true
                };

                if (res && res.Value1) {
                    // ProbationTime mặc định disable task 0172569
                    res.Value1 = res.Value1 + ',ProbationTime,SeniorityByFormula,DateJoinCorporation';
                    nextState = {
                        ...nextState,
                        dataNotChange: res.Value1,
                        isLoading: false,
                        refreshing: false,
                        configField: { ...configField },
                        showHidecontrol: showHidecontrol
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
        if (Object.prototype.hasOwnProperty.call(profileUpdate, varTmp)) {
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
        if (Object.prototype.hasOwnProperty.call(profileUpdate, varTmp)) {
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
                    Object.prototype.hasOwnProperty.call(profileUpdate, _objValue['value']) &&
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
        const { profileUpdate, dataNotChange, dataWaitingApprove, configField, showHidecontrol } = this.state,
            { itemContent, textLableGroup, viewInputEdit, bntSaveInputView, bntCancelInputView, bntCenter } =
                styleProfileInfo,
            { textValueInfo, textLableInfo } = styleScreenDetail,
            { viewLable, viewControl } = stylesListPickerControl,
            stylesDetailV2 = stylesScreenDetailV2;

        return config.map((item, index) => {
            if (item['Name'] == 'FileAttach') {
                let _value = null;
                if (Object.prototype.hasOwnProperty.call(profileUpdate, 'Attachment')) {
                    _value = profileUpdate['Attachment']['value'];
                } else {
                    let _field = item['FieldNameAttach'];
                    _value = profile[_field];
                }

                let isChange = dataWaitingApprove && dataWaitingApprove.indexOf('Attachment') > -1,
                    colorTextWaiting = isChange ? { color: Colors.orange, marginTop: Size.defineHalfSpace } : {};

                return (
                    <View style={itemContent}>
                        <View style={viewLable}>
                            <VnrText
                                style={[styleSheets.text, textLableInfo]}
                                i18nKey={'HRM_Rec_JobVacancy_FileAttachment'}
                            />
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
                                onFinish={(files) => this.onFinishFileAttach(files, 'Attachment')}
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
            } else if (item['Name'] == 'ImagePath') {
                if (dataVnrStorage.apiConfig && dataVnrStorage.apiConfig.uriMain) {
                    let _img = profileUpdate['ImagePath'],
                        _isUpdateRecord = false;

                    if (profileUpdate['ImagePath'] && dataVnrStorage.apiConfig && dataVnrStorage.apiConfig.uriStorage) {
                        _img = '[URI_STORAGE]images/' + profileUpdate['ImagePath'];
                        _isUpdateRecord = true;
                    } else if (profileUpdate['ImagePath']) {
                        _img = '[URI_MAIN]/Images/' + profileUpdate['ImagePath'];
                        _isUpdateRecord = true;
                    } else {
                        _img = profile['ImagePath'];
                    }

                    let isChange = dataWaitingApprove && dataWaitingApprove.indexOf('ImagePath') > -1,
                        colorTextWaiting = isChange ? { color: Colors.orange } : {};

                    let _imagePath = _img
                        .replace('[URI_MAIN]', dataVnrStorage.apiConfig.uriMain)
                        .replace('[URI_HR]', dataVnrStorage.apiConfig.uriHr)
                        .replace('[URI_SYS]', dataVnrStorage.apiConfig.uriSys)
                        .replace('[URI_POR]', dataVnrStorage.apiConfig.uriPor)
                        .replace('[URI_STORAGE]', dataVnrStorage.apiConfig.uriStorage);

                    return (
                        <View style={styles.ContentAvatarUser} key={-1}>
                            <View>
                                <View style={styleSheets.viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={item['DisplayKey']} />
                                </View>
                                <View style={[styleSheets.viewControl, CustomStyleSheet.flexDirection('row')]}>
                                    <VnrText
                                        style={[
                                            styleSheets.text,
                                            textValueInfo,
                                            colorTextWaiting,
                                            CustomStyleSheet.marginRight(5)
                                        ]}
                                        i18nKey={'HRM_HR_Profile_Image_Of_You'}
                                    />
                                    {_isUpdateRecord && <IconError size={Size.iconSize - 2} color={Colors.warning} />}
                                </View>
                            </View>
                            <View style={styles.viewAvatar}>
                                <TouchableOpacity
                                    style={styles.avatar}
                                    onPress={() =>
                                        !isChange && this.resActionSheet ? this.resActionSheet.show() : null
                                    }
                                >
                                    <Image source={{ uri: _imagePath }} style={styles.imgAvatar} />
                                </TouchableOpacity>
                                <View style={styles.avatarEdit}>
                                    {!isChange && (
                                        <TouchableOpacity
                                            onPress={() => (this.resActionSheet ? this.resActionSheet.show() : null)}
                                            style={styles.avatarEdit__bnt}
                                        >
                                            <VnrText
                                                style={[
                                                    styleSheets.text,
                                                    { color: Colors.primary, fontSize: Size.text - 2 }
                                                ]}
                                                i18nKey={'HRM_Common_Edit_Profile'}
                                            />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </View>
                    );
                } else {
                    return <View />;
                }
            } else {
                // 0172569: App - Màn hình "Hồ sơ cá nhân", thêm trường thông tin cho tab "Thông tin nhân viên và liên hệ"
                if (item.Control.fieldName == 'ProbationTime' || item.Control.fieldName == 'DateEndProbation') {
                    let isVisible = showHidecontrol[item.Control.fieldName];
                    if (!isVisible) return <View />;
                }

                let _value = '',
                    _isUpdateRecord = false;

                if (Object.prototype.hasOwnProperty.call(profileUpdate, [item['Name']])) {
                    _isUpdateRecord = true;
                    _value = profileUpdate[item['Name']];
                } else {
                    _value = profile[item['Name']];
                }

                if (_value && typeof _value == 'object') {
                    if (Object.prototype.hasOwnProperty.call(_value, 'valueField')) {
                        let _property = _value['valueField'];
                        _value = _value[_property];
                    }
                }

                let _isUpdateTextForField = this.state.isUpdateTextForField,
                    renderCtrl;

                if (item.Control && item.Control.fieldName == _isUpdateTextForField) {
                    let varChanging = 'TEMPORARILY_SLUG_' + _isUpdateTextForField;
                    let _valueChanging = Object.prototype.hasOwnProperty.call(profileUpdate, varChanging)
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

                            <View style={styles.styVIewSaveInput}>
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

                        if (item.Control.fieldName == 'ProbationTime' && profile.ProbationTimeUnitView) {
                            _value = `${_value} ${profile.ProbationTimeUnitView}`;
                        }
                    } else {
                        _value = '';
                    }

                    let isChange = dataWaitingApprove && dataWaitingApprove.indexOf(item.Control.fieldName) > -1,
                        colorTextWaiting = isChange ? { color: Colors.orange } : {};
                    //     <View style={styleSheets.viewControl}>
                    //     <VnrText style={[styleSheets.text, colorTextWaiting]}
                    //         value={_value} />
                    // </View>

                    renderCtrl = (
                        <View style={styleSheets.viewControl}>
                            <View style={styles.styFlex9Row}>
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
                                    <TouchableOpacity style={styles.styViewEdit} onPress={() => this.onViewEdit(item)}>
                                        <IconEdit size={Size.iconSize} color={Colors.primary} />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    );
                }

                return (
                    <View style={itemContent} key={index}>
                        <View style={[styleSheets.viewLable]}>
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
        let _state = this.addFieldToState(item),
            { Control } = item;

        if (Control.Name === 'VnrPicker') {
            let _ctrl = { ...Control, ..._state };
            this.setControl(_ctrl);
            this.setState({ isUpdateTextForField: null, ..._state });
        } else if (Control.Name === 'VnrDate') {
            let _ctrl = { ...Control, ..._state };
            this.setControl(_ctrl);
            this.setState({ isUpdateTextForField: null, ..._state });
        } else if (Control.Name === 'VnrText') {
            this.setState({ isUpdateTextForField: Control.fieldName });
        }
    };

    onFinish = (item, control) => {
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

                const { profileUpdate } = this.state;
                this.setState({ profileUpdate: { ...profileUpdate, ...obj } });
            } else if (control.Name == 'VnrDate') {
                let obj = { [control.fieldName]: item };
                this.setState({ profileUpdate: { ...this.state.profileUpdate, ...obj } });
            }
        } else {
            this.setState({ isRefresh: !this.state.isRefresh });
        }
    };

    showPickerImage = () => {
        if (!PermissionsAndroid.PERMISSIONS?.READ_MEDIA_IMAGES) {
            PermissionsAndroid.PERMISSIONS = {
                ...PermissionsAndroid.PERMISSIONS,
                READ_MEDIA_IMAGES: 'android.permission.READ_MEDIA_IMAGES'
            };
        }
        if (!PermissionsAndroid.PERMISSIONS?.READ_MEDIA_VIDEO) {
            PermissionsAndroid.PERMISSIONS = {
                ...PermissionsAndroid.PERMISSIONS,
                READ_MEDIA_VIDEO: 'android.permission.READ_MEDIA_VIDEO'
            };
        }
        let options = {
            mediaType: 'any',
            multiple: false,
            width: 400,
            height: 400,
            cropping: true,
            includeBase64: true
        };
        ImagePicker.openPicker({
            ...options
        }).then(async (image) => {
            if (image) {
                this.updateAvatar({
                    data: image.data,
                    type: image.mime
                });
            }
        });
    };

    showPickerCamera = async () => {
        if (Platform.OS === 'android') {
            if (!PermissionsAndroid.PERMISSIONS?.READ_MEDIA_IMAGES) {
                PermissionsAndroid.PERMISSIONS = {
                    ...PermissionsAndroid.PERMISSIONS,
                    READ_MEDIA_IMAGES: 'android.permission.READ_MEDIA_IMAGES'
                };
            }

            if (!PermissionsAndroid.PERMISSIONS?.READ_MEDIA_VIDEO) {
                PermissionsAndroid.PERMISSIONS = {
                    ...PermissionsAndroid.PERMISSIONS,
                    READ_MEDIA_VIDEO: 'android.permission.READ_MEDIA_VIDEO'
                };
            }
            if (!PermissionsAndroid.PERMISSIONS?.CAMERA) {
                PermissionsAndroid.PERMISSIONS = {
                    ...PermissionsAndroid.PERMISSIONS,
                    CAMERA: 'android.permission.CAMERA'
                };
            }
        } else {
            const response = await check(
                Platform.select({
                    ios: PERMISSIONS.IOS.CAMERA
                })
            );
            if (response !== RESULTS.GRANTED && response !== RESULTS.UNAVAILABLE) {
                request(PERMISSIONS.IOS.CAMERA).then(() => { });
            }
        }
        ImagePicker.openCamera({
            cropping: true,
            includeBase64: true,
            width: 400,
            height: 400
        }).then((image) => {
            if (!image) {
                return;
            }
            this.updateAvatar({
                data: image.data,
                type: image.mime
            });
        });
    };

    updateAvatar = (dataFile) => {
        if (dataVnrStorage.isNewLayoutV3) {
            HttpService.Post('[URI_CENTER]/api/Sys_Common/UploadImageString', {
                DataImage: `data:image/png;base64,${dataFile.data}`
            }).then((res) => {
                if (res && res.Data && res.Status === EnumName.E_SUCCESS) {
                    //set tên file để lưu vào DB
                    const { profileUpdate } = this.state;

                    //update lại avatar
                    this.setState({ profileUpdate: { ...profileUpdate, ImagePath: res.Data.fileName } });
                } else {
                    ToasterSevice.showError('ErrorInProcessing');
                }
            });
        } else {
            HttpService.Post('[URI_POR]//New_Home/saveAvatarFromApp', {
                base64String: dataFile.data,
                contentType: dataFile.type,
                userLogin: dataVnrStorage.currentUser.headers.userlogin
            }).then((res) => {
                if (res && res === 'FAIL') {
                    ToasterSevice.showError('ErrorInProcessing');
                } else {
                    //set tên file để lưu vào DB
                    const { profileUpdate } = this.state;

                    //update lại avatar
                    this.setState({ profileUpdate: { ...profileUpdate, ImagePath: res } });
                }
            });
        }
    };

    render() {
        const { isLoading, profile } = this.state;
        let contentList = <View />;
        let listConfigBasic;

        if (ConfigList.value['GeneralInfoHreProfileBasicInfo']) {
            listConfigBasic = ConfigList.value['GeneralInfoHreProfileBasicInfo'];
        }

        if (isLoading) {
            contentList = <VnrLoading size="large" isVisible={isLoading} />;
        } else if (profile == EnumName.E_EMPTYDATA || Object.keys(profile).length == 0) {
            contentList = <EmptyData messageEmptyData={'EmptyData'} />;
        } else if (profile && Object.keys(profile).length > 0) {
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
                        {/* update Avatar */}
                        {this.initView(listConfigBasic, profile)}
                    </KeyboardAwareScrollView>

                    {/* bottom button save */}
                    <View style={styles.wrapButtonHandler}>
                        <TouchableOpacity style={styles.wrapBtnRegister} onPress={() => this.onUpdate()}>
                            <VnrText
                                style={[styleSheets.lable, styles.styRegister]}
                                i18nKey={'HRM_Common_SendRequest_Button'}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnRefresh} onPress={() => this.undoUpdate()}>
                            <Image
                                style={{ width: Size.iconSize, height: Size.iconSize }}
                                resizeMode="cover"
                                source={require('../../../../../assets/images/vnrDateFromTo/reset-sm.png')}
                            />
                        </TouchableOpacity>
                    </View>
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
                </View>
            );
        }

        const options = this.sheetActions.map((item) => {
            return item.title;
        });

        return (
            <SafeAreaViewDetail style={styleSafeAreaView.style}>
                {contentList}
                {this.sheetActions && this.sheetActions.length > 1 && (
                    <ActionSheet
                        ref={(o) => (this.resActionSheet = o)}
                        //title={'Which one do you like ?'}
                        options={options}
                        cancelButtonIndex={this.sheetActions.length - 1}
                        destructiveButtonIndex={this.sheetActions.length - 1}
                        onPress={(index) => this.actionSheetOnCLick(index)}
                    />
                )}
            </SafeAreaViewDetail>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

export default connect(mapStateToProps)(TopTabProfileBasicInfoUpdate);

const styles = StyleSheet.create({
    styViewEdit: { alignItems: 'center', justifyContent: 'center' },
    styFlex9Row: { flex: 9, flexDirection: 'row' },
    styVIewSaveInput: {
        flex: 3,
        flexDirection: 'row'
    },
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
    ContentAvatarUser: {
        // padding: styleSheets.p_10,
        paddingHorizontal: 10,
        paddingTop: 10,
        // borderBottomWidth: PixelRatio.getPixelSizeForLayoutSize(0.4),
        // borderBottomColor: Colors.borderColor,
        //marginHorizontal: styleSheets.m_10,
        flexDirection: 'row',
        backgroundColor: Colors.white
    },
    viewAvatar: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
        //height:60
    },
    avatarEdit__bnt: {
        // height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 5
    },
    avatarEdit: {
        // height: 50,
        width: 35
        // borderRadius: 50 / 2,
        // position: 'absolute',
    },
    avatar: {
        height: 35,
        width: 35,
        backgroundColor: Colors.grey,
        borderRadius: 35 / 2
    },
    imgAvatar: {
        height: 35,
        width: 35,
        borderRadius: 35 / 2
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
    btnRefresh: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
