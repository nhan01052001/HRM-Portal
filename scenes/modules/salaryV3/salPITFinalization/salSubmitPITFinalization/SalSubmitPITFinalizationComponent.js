import React from 'react';
import { View, TouchableOpacity, Platform, Text, ScrollView } from 'react-native';
import {
    Colors,
    CustomStyleSheet,
    Size,
    styleSheets,
    stylesVnrPickerV3,
    styleValid
} from '../../../../../constants/styleConfig';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../../componentsV3/VnrTextInput/VnrTextInput';
import VnrAttachFile from '../../../../../componentsV3/VnrAttachFile/VnrAttachFile';
import VnrPickerQuickly from '../../../../../componentsV3/VnrPickerQuickly/VnrPickerQuickly';
import HttpService from '../../../../../utils/HttpService';
import { EnumName } from '../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import moment from 'moment';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
import styleComonAddOrEdit from '../../../../../constants/styleComonAddOrEdit';
import { translate } from '../../../../../i18n/translate';
import VnrYearPicker from '../../../../../components/VnrYearPicker/VnrYearPicker';
import DrawerServices from '../../../../../utils/DrawerServices';
import { IconRadioCheck, IconRadioUnCheck } from '../../../../../constants/Icons';

const initSateDefault = {
    YearFormat: {
        label: 'HRM_Sal_PITFinalizationDelegatee_Year',
        value: null,
        refresh: false,
        disable: true,
        visibleConfig: true,
        visible: true
    },
    CodeTax: {
        value: null,
        lable: 'HRM_PortalApp_PITFinalization_TaxCode',
        disable: true,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    RegisterType: {
        value: null,
        lable: 'HRM_PortalApp_PITFinalization_RegisterType',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true,
        data: [
            {
                Text: 'HRM_PortalApp_PITFinalization_TaxableIncome',
                Value: 'IsTaxableIncome',
                isSelected: true
            },
            {
                Text: 'HRM_PortalApp_PITFinalization_TransferCompany',
                Value: 'IsTransferCompany',
                isSelected: false
            },
            {
                Text: 'HRM_PortalApp_PITFinalization_TaxCurrentIncome',
                Value: 'IsTaxCurrentIncome',
                isSelected: false
            }
        ]
    },
    Note: {
        value: '',
        lable: 'Comment',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    FileAttachment: {
        lable: 'HRM_PortalApp_TSLRegister_Attachment',
        visible: true,
        visibleConfig: true,
        disable: false,
        refresh: false,
        value: null
    },
    isError: false,
    isDisableYearControl: true
};

class SalSubmitPITFinalizationComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initSateDefault,
            Profile: {
                ID: null,
                ProfileName: '',
                disable: true
            },
            // isConfigMultiTimeInOut: true,
            isRefreshState: false
        };
        this.layoutHeightItem = null;
        this.vnrYearPicker = null;
    }

    // Những trường hợp được phép render lại
    shouldComponentUpdate(nextProps, nextState) {
        if (
            nextState.isRefreshState !== this.state.isRefreshState ||
            // thay đổi state value thì mới render lại

            Number(nextState.YearFormat.value) !== Number(this.state.YearFormat.value) ||
            nextState.CodeTax.value !== this.state.CodeTax.value ||
            // !Vnr_Function.compare(nextState.RegisterType.value, this.state.RegisterType.value) ||
            nextState.RegisterType.refresh !== this.state.RegisterType.refresh ||
            nextState.Note.value !== this.state.Note.value ||
            nextState.FileAttachment.value !== this.state.FileAttachment.value ||
            nextState.isError !== this.state.isError
        ) {
            return true;
        } else {
            return false;
        }
    }

    checkHaveDoneValueField = (isShowWarn) => {
        const { setDisableSave, fieldConfig } = this.props;
        const { YearFormat, RegisterType, Note, FileAttachment } = this.state;

        if (Note && Note.value?.length > 500) {
            if (isShowWarn) {
                let keyTras = translate('HRM_Sytem_MaxLength500');
                if (Note.value?.length > 500)
                    this.props.ToasterSevice().showWarning(keyTras.replace('[E_NAME]', translate(Note.lable)));
            } else setDisableSave && setDisableSave(true);
            return false;
        }

        if (
            (fieldConfig?.YearFormat?.isValid && !YearFormat.value) ||
            (fieldConfig?.RegisterType?.isValid && !RegisterType.value) ||
            (fieldConfig?.Note?.isValid && !Note.value) ||
            (fieldConfig?.FileAttachment?.isValid && !FileAttachment.value)
        ) {
            if (isShowWarn) this.props.ToasterSevice().showWarning('HRM_PortalApp_InputValue_Please');
            else setDisableSave && setDisableSave(true);
            return false;
        } else {
            setDisableSave && setDisableSave(false);
            return true;
        }
    };

    componentDidMount() {
        this.initState();
    }

    componentWillUnmount() {}

    unduData = () => {
        this.initState();
    };

    showLoading = (isShow) => {
        const { showLoading } = this.props;
        showLoading && showLoading(isShow);
    };

    // Step 1: Khởi tạo dữ liệu
    initState = () => {
        const { record = null } = this.props,
            { Profile, isRefreshState, YearFormat } = this.state;
        const profileInfo = dataVnrStorage
            ? dataVnrStorage.currentUser
                ? dataVnrStorage.currentUser.info
                : null
            : null;

        const { E_ProfileID, E_FullName } = EnumName,
            _profile = { ID: profileInfo[E_ProfileID], ProfileName: profileInfo[E_FullName] };

        const { RegisterType, CodeTax, Note, FileAttachment } = this.state;

        if (record) {
            RegisterType.data.forEach((item) => {
                item.isSelected = record[item.Value] ? true : false;
            });

            //Modify
            let nextState = {
                isRefreshState: !isRefreshState,
                Profile: {
                    ...Profile,
                    ..._profile
                },
                CodeTax: {
                    ...CodeTax,
                    value: record.CodeTax ? record.CodeTax : null,
                    lable: 'HRM_PortalApp_PITFinalization_TaxCode',
                    disable: false,
                    refresh: !CodeTax.refresh,
                    visible: true
                },
                RegisterType: {
                    ...RegisterType,
                    value: record.RegisterType ? { Text: record.RegisterTypeView, Value: record.RegisterType } : null,
                    lable: 'HRM_PortalApp_PITFinalization_RegisterType',
                    disable: false,
                    refresh: !RegisterType.refresh,
                    visible: true
                },
                Note: {
                    ...Note,
                    value: record.Note ? record.Note : '',
                    lable: 'Comment',
                    disable: false,
                    refresh: !Note.refresh,
                    visible: true
                },
                YearFormat: {
                    ...YearFormat,
                    value: record.Year ? record.Year : null,
                    refresh: !YearFormat.refresh
                }
            };

            // Value Acttachment
            if (record.FileAttachment) {
                let valFile = ManageFileSevice.setFileAttachApp(record.FileAttachment);

                nextState = {
                    ...nextState,
                    FileAttachment: {
                        ...FileAttachment,
                        disable: false,
                        value: valFile && valFile.length > 0 ? valFile : null,
                        refresh: !FileAttachment.refresh
                    }
                };
            } else {
                nextState = {
                    ...nextState,
                    FileAttachment: {
                        ...FileAttachment,
                        disable: false,
                        value: null,
                        refresh: !FileAttachment.refresh
                    }
                };
            }

            this.setState(nextState);
        } else {
            this.setState(
                {
                    ...initSateDefault,
                    Profile: {
                        ...Profile,
                        ..._profile
                    },
                    YearFormat: {
                        ...YearFormat,
                        value: !isNaN(Number(moment(new Date()).format('YYYY')))
                            ? Number(moment(new Date()).format('YYYY')) - 1
                            : null,
                        isRefresh: !YearFormat.refresh
                    },
                    // fix lại chỗ này
                    RegisterType: {
                        ...RegisterType,
                        data: [
                            {
                                Text: 'HRM_PortalApp_PITFinalization_TaxableIncome',
                                Value: 'IsTaxableIncome',
                                isSelected: true
                            },
                            {
                                Text: 'HRM_PortalApp_PITFinalization_TransferCompany',
                                Value: 'IsTransferCompany',
                                isSelected: false
                            },
                            {
                                Text: 'HRM_PortalApp_PITFinalization_TaxCurrentIncome',
                                Value: 'IsTaxCurrentIncome',
                                isSelected: false
                            }
                        ],
                        refresh: !RegisterType.refresh
                    },
                    isRefreshState: !isRefreshState
                },
                () => {
                    this.getDefaultTaxCodeFromProfile();
                }
            );
        }
    };

    getAllData = () => {
        const { Profile, RegisterType, Note, FileAttachment, YearFormat, CodeTax } = this.state;

        if (this.checkHaveDoneValueField(true) == true) {
            let nextPrams = {
                IsPITFinalization: true,
                IsExportTax: false
            };

            if (RegisterType?.value?.Value === 'E_PERSONALPITFINALIZATION') {
                nextPrams = {
                    IsPITFinalization: false,
                    IsExportTax: true
                };
            }

            let rsFind = RegisterType.data.find((item) => item.isSelected === true);

            if (rsFind) {
                nextPrams = {
                    ...nextPrams,
                    [`${rsFind?.Value}`]: true
                };
            }

            return {
                ...nextPrams,
                ProfileID: Profile.ID,
                RegisterType: RegisterType.value ? RegisterType.value?.Value : null,
                FileAttachment: FileAttachment.value
                    ? FileAttachment.value.map((item) => item.fileName).join(',')
                    : null,
                Note: Note.value ? Note.value : null,
                Year: YearFormat.value ? YearFormat.value : null,
                YearFormat: YearFormat.value ? `${YearFormat.value}/01/01` : null,
                CodeTax: CodeTax.value ? CodeTax.value : null
            };
        } else this.setState({ isError: true });
    };

    getDefaultTaxCodeFromProfile = () => {
        try {
            if (this.state.Profile.ID) {
                HttpService.Get('[URI_CENTER]/api/Sal_GetData/GetProfileDataCreatePITFInalizationDelegatee', {
                    ProfileID: this.state.Profile.ID
                }).then((response) => {
                    if (response && response?.Status === EnumName.E_SUCCESS && response?.Data) {
                        this.setState({
                            CodeTax: {
                                ...this.state.CodeTax,
                                value: response?.Data?.CodeTax ? response?.Data?.CodeTax : null,
                                refresh: !this.state.CodeTax.refresh
                            },
                            RegisterType: {
                                ...this.state.RegisterType,
                                value: response?.Data?.RegisterType
                                    ? {
                                        Value: response?.Data?.RegisterType,
                                        Text: response?.Data?.RegisterTypeView
                                    }
                                    : null,
                                refresh: !this.state.RegisterType.refresh
                            }
                        });
                    }
                });
            }
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    render() {
        const { YearFormat, RegisterType, isDisableYearControl, CodeTax, Note, FileAttachment, isError } = this.state;

        const { fieldConfig, onScrollToInputIOS, indexDay } = this.props,
            { viewInputMultiline } = stylesVnrPickerV3;

        this.checkHaveDoneValueField(false);
        return (
            <View
                style={styles.wrapItem}
                onLayout={(event) => {
                    const layout = event.nativeEvent.layout;
                    this.layoutHeightItem = layout.height;
                }}
            >
                <View style={styles.flRowSpaceBetween}>
                    <Text style={[styleSheets.lable, styles.styLableGp]}>
                        {translate('HRM_Detail_Process_Info_Common')}
                    </Text>
                </View>

                {/* Năm quyết toán */}
                <VnrYearPicker
                    ref={(ref) => (this.vnrYearPicker = ref)}
                    onFinish={(item) => {
                        let year = null,
                            numberToSubtract = RegisterType.value?.Value === 'E_PERSONALPITFINALIZATION' ? 0 : 1;

                        if (!isNaN(Number(item.year))) {
                            year = Number(item.year) - numberToSubtract;
                        } else if (!isNaN(Number(moment(new Date()).format('YYYY')))) {
                            year = Number(moment(new Date()).format('YYYY')) - numberToSubtract;
                        }

                        this.setState({
                            YearFormat: {
                                ...YearFormat,
                                value: year,
                                refresh: !YearFormat.refresh
                            }
                        });
                    }}
                    value={YearFormat.value}
                    stylePicker={styles.styPickerView}
                >
                    <TouchableOpacity
                        disabled={isDisableYearControl}
                        style={[
                            stylesVnrPickerV3.styBntPicker,
                            stylesVnrPickerV3.styContentPicker,
                            isDisableYearControl && {
                                backgroundColor: Colors.gray_3
                            }
                        ]}
                        onPress={() => {
                            this.vnrYearPicker.showPicker();
                        }}
                    >
                        <View style={[stylesVnrPickerV3.styLeftPicker, stylesVnrPickerV3.onlyFlRowSpaceBetween]}>
                            <View style={[stylesVnrPickerV3.styLbPicker, styles.styLbPickerExtend]}>
                                {YearFormat.label && (
                                    <Text
                                        numberOfLines={2}
                                        style={[styleSheets.text, stylesVnrPickerV3.styLbNoValuePicker]}
                                    >
                                        {translate(YearFormat.label)}
                                    </Text>
                                )}

                                {fieldConfig?.YearFormat?.isValid && (
                                    <VnrText style={[styleSheets.text, styleValid]} i18nKey={'*'} />
                                )}
                            </View>

                            <View style={[stylesVnrPickerV3.styVlPicker, styles.styV1PickerExtend]}>
                                {YearFormat?.value != null ? (
                                    <Text style={[styleSheets.text, stylesVnrPickerV3.styLableValue]} numberOfLines={1}>
                                        {YearFormat?.value}
                                    </Text>
                                ) : (
                                    <Text style={[styleSheets.text, stylesVnrPickerV3.stylePlaceholder]}>
                                        {translate('SELECT_ITEM')}
                                    </Text>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                </VnrYearPicker>

                {/* Mã số thuế */}
                {CodeTax.visible && fieldConfig?.CodeTax?.visibleConfig && (
                    <VnrTextInput
                        isCheckEmpty={fieldConfig?.CodeTax?.isValid && isError && !CodeTax.value ? true : false}
                        fieldValid={fieldConfig?.CodeTax?.isValid}
                        disable={CodeTax.disable}
                        lable={CodeTax.lable}
                        value={CodeTax.value}
                        isTextRow={true}
                        placeHolder={'SELECT_ITEM'}
                        onFocus={() => {
                            Platform.OS == 'ios' && onScrollToInputIOS(indexDay + 1, this.layoutHeightItem);
                        }}
                        onChangeText={(text) => {
                            this.setState({
                                CodeTax: {
                                    ...CodeTax,
                                    value: text,
                                    refresh: !CodeTax.refresh
                                }
                            });
                        }}
                        refresh={CodeTax.refresh}
                    />
                )}

                {/* Loại đăng ký */}
                {RegisterType.visible && fieldConfig?.RegisterType?.visibleConfig && (
                    <VnrPickerQuickly
                        fieldValid={fieldConfig?.RegisterType?.isValid}
                        isCheckEmpty={
                            fieldConfig?.RegisterType?.isValid && isError && !RegisterType.value ? true : false
                        }
                        refresh={RegisterType.refresh}
                        // api={{
                        //     urlApi:
                        //         '[URI_CENTER]/api/Att_GetData/GetEnum?text=PITFinalizationRegisterType',
                        //     type: 'E_GET',
                        // }}
                        dataLocal={[
                            {
                                Text: translate('HRM_PortalApp_PITFinalization_DelegatePITFinalization'),
                                Value: 'E_DELEGATEPITFINALIZATION',
                                Number: 1
                            },
                            {
                                Text: translate('HRM_PortalApp_PITFinalization_PersonalPITFinalization'),
                                Value: 'E_PERSONALPITFINALIZATION',
                                Number: 2
                            }
                        ]}
                        value={RegisterType.value}
                        textField="Text"
                        valueField="Value"
                        filter={false}
                        filterServer={false}
                        autoFilter="false"
                        disable={RegisterType.disable}
                        lable={RegisterType.lable}
                        onFinish={(item) => {
                            let nextState = {
                                isDisableYearControl: true,
                                YearFormat: {
                                    ...YearFormat,
                                    value: Number(moment(new Date()).format('YYYY')) - 1,
                                    refresh: !YearFormat.refresh
                                }
                            };

                            if (item?.Value === 'E_PERSONALPITFINALIZATION') {
                                nextState = {
                                    isDisableYearControl: false,
                                    YearFormat: {
                                        ...YearFormat,
                                        value: Number(moment(new Date()).format('YYYY')),
                                        refresh: !YearFormat.refresh
                                    }
                                };
                            }

                            this.setState({
                                RegisterType: {
                                    ...RegisterType,
                                    value: item,
                                    data: [
                                        {
                                            Text: 'HRM_PortalApp_PITFinalization_TaxableIncome',
                                            Value: 'IsTaxableIncome',
                                            isSelected: true
                                        },
                                        {
                                            Text: 'HRM_PortalApp_PITFinalization_TransferCompany',
                                            Value: 'IsTransferCompany',
                                            isSelected: false
                                        },
                                        {
                                            Text: 'HRM_PortalApp_PITFinalization_TaxCurrentIncome',
                                            Value: 'IsTaxCurrentIncome',
                                            isSelected: false
                                        }
                                    ],
                                    refresh: !RegisterType.refresh
                                },
                                ...nextState
                            });
                        }}
                    />
                )}

                {/* Ghi chú */}
                {Note.visible && fieldConfig?.Note.visibleConfig && (
                    <VnrTextInput
                        isCheckEmpty={fieldConfig?.Note?.isValid && isError && !Note.value ? true : false}
                        fieldValid={fieldConfig?.Note?.isValid}
                        placeHolder={'HRM_PortalApp_PleaseInput'}
                        disable={Note.disable}
                        lable={Note.lable}
                        style={[styleSheets.text, viewInputMultiline]}
                        multiline={true}
                        value={Note.value}
                        onFocus={() => {
                            Platform.OS == 'ios' && onScrollToInputIOS(indexDay + 1, this.layoutHeightItem);
                        }}
                        onChangeText={(text) => {
                            this.setState({
                                Note: {
                                    ...Note,
                                    value: text,
                                    refresh: !Note.refresh
                                }
                            });
                        }}
                        refresh={Note.refresh}
                    />
                )}

                {/* Tập tin đính kèm */}
                {FileAttachment.visible && fieldConfig?.FileAttachment.visibleConfig && (
                    <View style={{}}>
                        <VnrAttachFile
                            fieldValid={fieldConfig?.FileAttachment?.isValid}
                            isCheckEmpty={
                                fieldConfig?.FileAttachment?.isValid && isError && !FileAttachment.value ? true : false
                            }
                            lable={FileAttachment.lable}
                            disable={FileAttachment.disable}
                            refresh={FileAttachment.refresh}
                            value={FileAttachment.value}
                            multiFile={true}
                            uri={'[URI_CENTER]/api/Sys_Common/saveFileFromApp'}
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
                )}

                {RegisterType.value?.Value === 'E_DELEGATEPITFINALIZATION' && (
                    <View style={CustomStyleSheet.flex(1)}>
                        <View style={CustomStyleSheet.padding(16)}>
                            <Text style={styles.styTextRegisterType}>
                                {translate('HRM_PortalApp_PITFinalization_Choose1Below')}{' '}
                            </Text>
                        </View>
                        <View style={CustomStyleSheet.flex(1)}>
                            <ScrollView style={CustomStyleSheet.flex(1)}>
                                {RegisterType.data.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.styTouchaRegisterType}
                                            onPress={() => {
                                                let rsFindIndex = RegisterType.data.findIndex(
                                                    (item) => item.isSelected === true
                                                );
                                                RegisterType.data[rsFindIndex].isSelected = false;
                                                RegisterType.data[index].isSelected = true;
                                                this.setState({
                                                    RegisterType: {
                                                        ...RegisterType,
                                                        data: RegisterType.data,
                                                        refresh: !RegisterType.refresh
                                                    }
                                                });
                                            }}
                                        >
                                            <View style={CustomStyleSheet.flex(0.9)}>
                                                <Text style={styles.styTextExtend} numberOfLines={5}>
                                                    {item?.Text ? translate(item?.Text) : ''}
                                                </Text>
                                            </View>
                                            <View style={styles.styViewIconRadio}>
                                                {item?.isSelected ? (
                                                    <IconRadioCheck size={28} color={Colors.primary} />
                                                ) : (
                                                    <IconRadioUnCheck size={28} color={Colors.primary} />
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </View>
                    </View>
                )}
            </View>
        );
    }
}

const styles = {
    ...styleComonAddOrEdit,
    styViewIconRadio: { flex: 0.1, alignItems: 'flex-end', justifyContent: 'center' },
    styTouchaRegisterType: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 1
    },
    styV1PickerExtend: { width: '50%', justifyContent: 'flex-end', alignItems: 'center' },
    styLbPickerExtend: { width: '50%', maxHeight: '100%' },
    styPickerView: {
        backgroundColor: Colors.white,
        width: Size.deviceWidth - Size.defineSpace * 2,
        marginHorizontal: 0
    },
    styTextExtend: { marginLeft: 8, fontSize: 16 },
    styTextRegisterType: {
        fontSize: 16,
        fontWeight: Platform.OS === 'ios' ? '500' : '700'
    }
};

export default SalSubmitPITFinalizationComponent;
