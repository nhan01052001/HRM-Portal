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
import VnrTextInput from '../../../../../../components/VnrTextInput/VnrTextInput';;
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
                        disable: false
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
            { ProvinceID, DistrictID, WardID } = BirthCertificate;

        let nextState = {};

        if (listValues) {
            nextState = {
                BirthCertificate: {
                    ...BirthCertificate,
                    DistrictID: {
                        ...DistrictID,
                        value: listValues['DistrictID'],
                        disable: ProvinceID.value ? false : true
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
            { WardID, DistrictID } = BirthCertificate;

        let nextState = {};

        if (listValues) {
            nextState = {
                BirthCertificate: {
                    ...BirthCertificate,
                    WardID: {
                        ...WardID,
                        value: listValues['WardID'],
                        disable: DistrictID.value ? false : true
                    }
                }
            };

            this.setState(nextState);
        }
    };

    render() {
        const { BirthCertificate, fieldValid } = this.state,
            { ProvinceID, DistrictID, WardID, HouseholdIssuePlace } = BirthCertificate;

        const { textLableInfo, contentViewControl, viewLable, viewControl } = stylesListPickerControl;

        const objAddress = {
            // country: {
            //     "titlePicker": "HRM_HR_Profile_TACountry",
            //     "typeName": "E_COUNTRY",
            //     "api": {
            //         "urlApi": "[URI_HR]/Cat_GetData/GetMultiCountry",
            //         "type": "E_GET"
            //     },
            //     "textField": "CountryName",
            //     "valueField": "ID",
            //     "filter": true,
            //     "filterServer": false,
            //     "fieldName": "CountryID",
            //     "value": CountryID.value
            // },
            province: {
                typeName: 'E_PROVINCE',
                titlePicker: 'HRM_HR_Profile_TAProvince',
                api: {
                    urlApi: '[URI_HR]/Cat_GetData/GetMultiProvinceList',
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
                    urlApi: `[URI_HR]/Cat_GetData/GetDistrictCascading${
                        ProvinceID.value ? '?province=' + ProvinceID.value.ID : ''
                    }`,
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
                    urlApi: `[URI_HR]/Cat_GetData/GetVillageCascading${
                        DistrictID.value ? '?districtid=' + DistrictID.value.ID : ''
                    }`,
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
                            {/* <View style={contentViewControl}>
                                <View style={viewLable} >
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={CountryID.label} />

                                    {
                                        fieldValid.RelativeVolDocument && <VnrText style={styleValid} i18nKey={"HRM_Valid_Char"} />
                                    }
                                </View>

                                <View style={viewControl}>
                                    <VnrPickerAddress
                                        key='E_COUNTRY'
                                        disable={CountryID.disable}
                                        listPicker={objAddress}
                                        onFinish={(item) => this.onFinishCountry(item)}
                                    />
                                </View>
                            </View> */}

                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={ProvinceID.label} />

                                    {/* valid RelativeVolDocument */}
                                    {fieldValid.ProvinceBirthCertificateID && (
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
                                    {fieldValid.DistrictBirthCertificateID && (
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
                                    {fieldValid.VillageBirthCertificateID && (
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

                            {/* HouseholdIssuePlace */}
                            {HouseholdIssuePlace.visibleConfig && HouseholdIssuePlace.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={HouseholdIssuePlace.label}
                                        />

                                        {/* valid HouseholdIssuePlace */}
                                        {fieldValid.HouseholdIssuePlace && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={HouseholdIssuePlace.disable}
                                            refresh={HouseholdIssuePlace.refresh}
                                            value={HouseholdIssuePlace.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    BirthCertificate: {
                                                        ...this.state.BirthCertificate,
                                                        HouseholdIssuePlace: {
                                                            ...this.state.BirthCertificate.HouseholdIssuePlace,
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

                                DrawerServices.goBack();
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
