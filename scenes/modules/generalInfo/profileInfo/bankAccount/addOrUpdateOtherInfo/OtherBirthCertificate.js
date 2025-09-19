import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    styleSafeAreaView,
    Colors,
    styleButtonAddOrEdit,
    stylesListPickerControl,
    styleValid,
    CustomStyleSheet
} from '../../../../../../constants/styleConfig';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import VnrText from '../../../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../../../components/VnrTextInput/VnrTextInput';
import VnrPickerAddress from '../../../../../../components/VnrPickerAddress/VnrPickerAddress';
import DrawerServices from '../../../../../../utils/DrawerServices';

export default class OtherBirthCertificate extends Component {
    constructor(porps) {
        super(porps);

        const { BirthCertificate, fieldValid } = porps.navigation.state.params;
        this.state = { BirthCertificate, fieldValid };
    }

    onFinishCountry = listValues => {
        const { BirthCertificate } = this.state,
            { CountryID, ProvinceID, DistrictID, WardID } = BirthCertificate;

        let nextState = {};

        if (listValues) {
            nextState = {
                BirthCertificate: {
                    ...BirthCertificate,
                    CountryID: {
                        ...CountryID,
                        value: listValues['CountryID']
                    },
                    ProvinceID: {
                        ...ProvinceID,
                        value: listValues['ProvinceID'],
                        disable: listValues['CountryID'] != null ? false : true
                    },
                    DistrictID: {
                        ...DistrictID,
                        value: listValues['DistrictID'],
                        disable: listValues['ProvinceID'] != null ? false : true
                    },
                    WardID: {
                        ...WardID,
                        value: listValues['WardID'],
                        disable: listValues['DistrictID'] != null ? false : true
                    }
                }
            };

            this.setState(nextState);
        }
    };

    onFinishProvince = listValues => {
        const { BirthCertificate } = this.state,
            { ProvinceID, DistrictID, WardID } = BirthCertificate;

        let nextState = {};

        if (listValues) {
            nextState = {
                BirthCertificate: {
                    ...BirthCertificate,
                    ProvinceID: {
                        ...ProvinceID,
                        value: listValues['ProvinceID'],
                        disable: listValues['CountryID'] != null ? false : true
                    },
                    DistrictID: {
                        ...DistrictID,
                        value: listValues['DistrictID'],
                        disable: listValues['ProvinceID'] != null ? false : true
                    },
                    WardID: {
                        ...WardID,
                        value: listValues['WardID'],
                        disable: listValues['DistrictID'] != null ? false : true
                    }
                }
            };

            this.setState(nextState);
        }
    };

    onFinishDistrict = listValues => {
        const { BirthCertificate } = this.state,
            { DistrictID, WardID } = BirthCertificate;

        let nextState = {};

        if (listValues) {
            nextState = {
                BirthCertificate: {
                    ...BirthCertificate,
                    DistrictID: {
                        ...DistrictID,
                        value: listValues['DistrictID'],
                        disable: listValues['ProvinceID'] != null ? false : true
                    },
                    WardID: {
                        ...WardID,
                        value: listValues['WardID'],
                        disable: listValues['DistrictID'] != null ? false : true
                    }
                }
            };

            this.setState(nextState);
        }
    };

    onFinishVillage = listValues => {
        const { BirthCertificate } = this.state,
            { WardID } = BirthCertificate;

        let nextState = {};

        if (listValues) {
            nextState = {
                BirthCertificate: {
                    ...BirthCertificate,
                    WardID: {
                        ...WardID,
                        value: listValues['WardID'],
                        disable: listValues['DistrictID'] != null ? false : true
                    }
                }
            };

            this.setState(nextState);
        }
    };

    render() {
        const { BirthCertificate, fieldValid } = this.state,
            {
                //Số chứng từ
                NoDocument,
                //Quyển sổ
                RelativeVolDocument,
                CountryID,
                ProvinceID,
                DistrictID,
                WardID,
                Address
            } = BirthCertificate;

        const { textLableInfo, contentViewControl, viewLable, viewControl } = stylesListPickerControl;

        const objAddress = {
            country: {
                titlePicker: 'HRM_HR_Profile_TACountry',
                typeName: 'E_COUNTRY',
                api: {
                    urlApi: '[URI_HR]/Cat_GetData/GetMultiCountry',
                    type: 'E_GET'
                },
                textField: 'CountryName',
                valueField: 'ID',
                filter: true,
                filterServer: false,
                fieldName: 'CountryID',
                value: CountryID.value
            },
            province: {
                typeName: 'E_PROVINCE',
                titlePicker: 'HRM_HR_Profile_TAProvince',
                api: {
                    urlApi: '[URI_HR]/Cat_GetData/GetProvinceCascading',
                    type: 'E_GET'
                },
                textField: 'ProvinceName',
                valueField: 'ID',
                filter: true,
                filterServer: false,
                value: ProvinceID.value,
                fieldName: 'ProvinceID',
                objValue: {
                    key: 'TProvinceName',
                    value: 'TProvinceID'
                }
            },
            district: {
                typeName: 'E_DISTRICT',
                titlePicker: 'HRM_HR_Profile_TADistrict',
                api: {
                    urlApi: '[URI_HR]/Cat_GetData/GetDistrictCascading',
                    type: 'E_GET'
                },
                textField: 'DistrictName',
                valueField: 'ID',
                filter: true,
                filterServer: false,
                value: DistrictID.value,
                fieldName: 'DistrictID',
                objValue: {
                    key: 'TDistrictName',
                    value: 'TDistrictID'
                }
            },
            village: {
                typeName: 'E_VILLAGE',
                titlePicker: 'HRM_HR_Profile_Village',
                api: {
                    urlApi: '[URI_HR]/Cat_GetData/GetVillageCascading',
                    type: 'E_GET'
                },
                textField: 'VillageName',
                valueField: 'ID',
                filter: true,
                filterServer: false,
                value: WardID.value,
                fieldName: 'WardID',
                objValue: {
                    key: 'TVillageName',
                    value: 'TAVillageID'
                }
            }
        };

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    <KeyboardAwareScrollView contentContainerStyle={CustomStyleSheet.flexGrow(1)}>
                        <View>
                            {/* Số chứng từ - NoDocument */}
                            {NoDocument.visibleConfig && NoDocument.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={NoDocument.label} />

                                        {/* valid NoDocument */}
                                        {fieldValid.NoDocument && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={NoDocument.disable}
                                            refresh={NoDocument.refresh}
                                            value={NoDocument.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    BirthCertificate: {
                                                        ...this.state.BirthCertificate,
                                                        NoDocument: {
                                                            ...this.state.BirthCertificate.NoDocument,
                                                            value: text
                                                        }
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Quyển sổ - RelativeVolDocument */}
                            {RelativeVolDocument.visibleConfig && RelativeVolDocument.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={RelativeVolDocument.label}
                                        />

                                        {/* valid RelativeVolDocument */}
                                        {fieldValid.RelativeVolDocument && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={RelativeVolDocument.disable}
                                            refresh={RelativeVolDocument.refresh}
                                            value={RelativeVolDocument.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    BirthCertificate: {
                                                        ...this.state.BirthCertificate,
                                                        RelativeVolDocument: {
                                                            ...this.state.BirthCertificate.RelativeVolDocument,
                                                            value: text
                                                        }
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={CountryID.label} />

                                    {/* valid RelativeVolDocument */}
                                    {fieldValid.RelativeVolDocument && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>

                                <View style={viewControl}>
                                    <VnrPickerAddress
                                        key="E_COUNTRY"
                                        disable={CountryID.disable}
                                        listPicker={objAddress}
                                        onFinish={item => this.onFinishCountry(item)}
                                    />
                                </View>
                            </View>

                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={ProvinceID.label} />

                                    {/* valid RelativeVolDocument */}
                                    {fieldValid.RelativeVolDocument && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>

                                <View style={viewControl}>
                                    <VnrPickerAddress
                                        key="E_PROVINCE"
                                        disable={ProvinceID.disable}
                                        listPicker={{
                                            province: objAddress.province,
                                            district: objAddress.district,
                                            village: objAddress.village
                                        }}
                                        onFinish={item => this.onFinishProvince(item)}
                                    />
                                </View>
                            </View>

                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={DistrictID.label} />

                                    {/* valid RelativeVolDocument */}
                                    {fieldValid.RelativeVolDocument && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>

                                <View style={viewControl}>
                                    <VnrPickerAddress
                                        key="E_DISTRICT"
                                        disable={DistrictID.disable}
                                        listPicker={{ district: objAddress.district, village: objAddress.village }}
                                        onFinish={item => this.onFinishDistrict(item)}
                                    />
                                </View>
                            </View>

                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={WardID.label} />

                                    {/* valid RelativeVolDocument */}
                                    {fieldValid.RelativeVolDocument && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>

                                <View style={viewControl}>
                                    <VnrPickerAddress
                                        key="E_VILLAGE"
                                        disable={WardID.disable}
                                        listPicker={{ village: objAddress.village }}
                                        onFinish={item => this.onFinishVillage(item)}
                                    />
                                </View>
                            </View>

                            {/* Address */}
                            {Address.visibleConfig && Address.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Address.label} />

                                        {/* valid Address */}
                                        {fieldValid.Address && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={Address.disable}
                                            refresh={Address.refresh}
                                            value={Address.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    BirthCertificate: {
                                                        ...this.state.BirthCertificate,
                                                        Address: {
                                                            ...this.state.BirthCertificate.Address,
                                                            value: text
                                                        }
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}
                        </View>
                    </KeyboardAwareScrollView>

                    {/* bottom button close, confirm */}
                    <View style={styleButtonAddOrEdit.groupButton}>
                        <TouchableOpacity
                            onPress={() => DrawerServices.goBack()}
                            style={[styleButtonAddOrEdit.btnClose]}
                        >
                            <VnrText
                                style={[
                                    styleSheets.lable,
                                    styleButtonAddOrEdit.groupButton__text,
                                    { color: Colors.greySecondary }
                                ]}
                                i18nKey={'HRM_Common_Close'}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                const { onFinish } = this.props.navigation.state.params;
                                if (onFinish && typeof onFinish === 'function') {
                                    onFinish(this.state);
                                }

                                DrawerServices.navigate('RelativeAddOrEdit');
                            }}
                            style={styleButtonAddOrEdit.groupButton__button_save}
                        >
                            <VnrText
                                style={[styleSheets.lable, styleButtonAddOrEdit.groupButton__text]}
                                i18nKey={'HRM_Att_Complete'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}
