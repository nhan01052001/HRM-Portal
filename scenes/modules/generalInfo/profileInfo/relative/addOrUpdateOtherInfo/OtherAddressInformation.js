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
    styleProfileInfo,
    CustomStyleSheet
} from '../../../../../../constants/styleConfig';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import VnrText from '../../../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../../../components/VnrTextInput/VnrTextInput';
import VnrPickerAddress from '../../../../../../components/VnrPickerAddress/VnrPickerAddress';
import DrawerServices from '../../../../../../utils/DrawerServices';

export default class OtherAddressInformation extends Component {
    constructor(porps) {
        super(porps);

        const { AddressInformation, fieldValid, fieldHiden } = porps.navigation.state.params;
        this.state = { AddressInformation, fieldValid, fieldHiden };
    }

    onFinishCountry = listValues => {
        const { AddressInformation } = this.state,
            { PCountryID, PProvinceID, PDistrictID, PVillageID } = AddressInformation;

        let nextState = {};

        if (listValues) {
            nextState = {
                AddressInformation: {
                    ...AddressInformation,
                    PCountryID: {
                        ...PCountryID,
                        value: listValues['CountryID']
                    },
                    PProvinceID: {
                        ...PProvinceID,
                        value: listValues['ProvinceID'],
                        disable: listValues['CountryID'] != null ? false : true
                    },
                    PDistrictID: {
                        ...PDistrictID,
                        value: listValues['DistrictID'],
                        disable: listValues['ProvinceID'] != null ? false : true
                    },
                    PVillageID: {
                        ...PVillageID,
                        value: listValues['WardID'],
                        disable: listValues['DistrictID'] != null ? false : true
                    }
                }
            };

            this.setState(nextState);
        }
    };

    onFinishProvince = listValues => {
        const { AddressInformation } = this.state,
            { PProvinceID, PDistrictID, PVillageID } = AddressInformation;

        let nextState = {};

        if (listValues) {
            nextState = {
                AddressInformation: {
                    ...AddressInformation,
                    PProvinceID: {
                        ...PProvinceID,
                        value: listValues['ProvinceID'],
                        disable: false
                    },
                    PDistrictID: {
                        ...PDistrictID,
                        value: listValues['DistrictID'],
                        disable: listValues['ProvinceID'] != null ? false : true
                    },
                    PVillageID: {
                        ...PVillageID,
                        value: listValues['WardID'],
                        disable: listValues['DistrictID'] != null ? false : true
                    }
                }
            };

            this.setState(nextState);
        }
    };

    onFinishDistrict = listValues => {
        const { AddressInformation } = this.state,
            { PProvinceID, PDistrictID, PVillageID } = AddressInformation;

        let nextState = {};

        if (listValues) {
            nextState = {
                AddressInformation: {
                    ...AddressInformation,
                    PDistrictID: {
                        ...PDistrictID,
                        value: listValues['DistrictID'],
                        disable: PProvinceID.value ? false : true
                    },
                    PVillageID: {
                        ...PVillageID,
                        value: listValues['WardID'],
                        disable: listValues['DistrictID'] != null ? false : true
                    }
                }
            };

            this.setState(nextState);
        }
    };

    onFinishVillage = listValues => {
        const { AddressInformation } = this.state,
            { PVillageID, PDistrictID } = AddressInformation;

        let nextState = {};

        if (listValues) {
            nextState = {
                AddressInformation: {
                    ...AddressInformation,
                    PVillageID: {
                        ...PVillageID,
                        value: listValues['WardID'],
                        disable: PDistrictID.value ? false : true
                    }
                }
            };

            this.setState(nextState);
        }
    };

    // address 2
    onFinishTCountry = listValues => {
        const { AddressInformation } = this.state,
            { TCountryID, TProvinceID, TDistrictID, TVillageID } = AddressInformation;

        let nextState = {};
        if (listValues) {
            nextState = {
                AddressInformation: {
                    ...AddressInformation,
                    TCountryID: {
                        ...TCountryID,
                        value: listValues['CountryID']
                    },
                    TProvinceID: {
                        ...TProvinceID,
                        value: listValues['ProvinceID'],
                        disable: listValues['CountryID'] != null ? false : true
                    },
                    TDistrictID: {
                        ...TDistrictID,
                        value: listValues['DistrictID'],
                        disable: listValues['ProvinceID'] != null ? false : true
                    },
                    TVillageID: {
                        ...TVillageID,
                        value: listValues['WardID'],
                        disable: listValues['DistrictID'] != null ? false : true
                    }
                }
            };

            this.setState(nextState);
        }
    };

    onFinishTProvince = listValues => {
        const { AddressInformation } = this.state,
            { TProvinceID, TDistrictID, TVillageID } = AddressInformation;

        let nextState = {};

        if (listValues) {
            nextState = {
                AddressInformation: {
                    ...AddressInformation,
                    TProvinceID: {
                        ...TProvinceID,
                        value: listValues['ProvinceID'],
                        disable: false
                    },
                    TDistrictID: {
                        ...TDistrictID,
                        value: listValues['DistrictID'],
                        disable: listValues['ProvinceID'] != null ? false : true
                    },
                    TVillageID: {
                        ...TVillageID,
                        value: listValues['WardID'],
                        disable: listValues['DistrictID'] != null ? false : true
                    }
                }
            };

            this.setState(nextState);
        }
    };

    onFinishTDistrict = listValues => {
        const { AddressInformation } = this.state,
            { TProvinceID, TDistrictID, TVillageID } = AddressInformation;

        let nextState = {};

        if (listValues) {
            nextState = {
                AddressInformation: {
                    ...AddressInformation,
                    TDistrictID: {
                        ...TDistrictID,
                        value: listValues['DistrictID'],
                        disable: TProvinceID.value ? false : true
                    },
                    TVillageID: {
                        ...TVillageID,
                        value: listValues['WardID'],
                        disable: listValues['DistrictID'] != null ? false : true
                    }
                }
            };

            this.setState(nextState);
        }
    };

    onFinishTVillage = listValues => {
        const { AddressInformation } = this.state,
            { PVillageID, PDistrictID } = AddressInformation;

        let nextState = {};

        if (listValues) {
            nextState = {
                AddressInformation: {
                    ...AddressInformation,
                    PVillageID: {
                        ...PVillageID,
                        value: listValues['WardID'],
                        disable: PDistrictID.value ? false : true
                    }
                }
            };

            this.setState(nextState);
        }
    };

    render() {
        const { AddressInformation, fieldValid, fieldHiden } = this.state,
            {
                PCountryID,
                PProvinceID,
                PDistrictID,
                PVillageID,
                PAddress2,
                // ---- //
                TCountryID,
                TProvinceID,
                TDistrictID,
                TVillageID,
                TAddress2
            } = AddressInformation;

        const { textLableInfo, contentViewControl, viewLable, viewControl } = stylesListPickerControl;

        const { textLableGroup, styleViewTitleGroup } = styleProfileInfo;

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
                value: PCountryID.value
            },
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
                value: PProvinceID.value,
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
                        PProvinceID.value ? '?province=' + PProvinceID.value.ID : ''
                    }`,
                    type: 'E_GET'
                },
                textField: 'DistrictName',
                valueField: 'ID',
                filter: true,
                filterServer: false,
                value: PDistrictID.value,
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
                        PDistrictID.value ? '?districtid=' + PDistrictID.value.ID : ''
                    }`,
                    type: 'E_GET'
                },
                textField: 'VillageName',
                valueField: 'ID',
                filter: true,
                filterServer: false,
                value: PVillageID.value,
                fieldName: 'WardID',
                objValue: {
                    key: 'TVillageName',
                    value: 'TAVillageID'
                }
            }
        };

        const objAddress2 = {
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
                value: TCountryID.value
            },
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
                value: TProvinceID.value,
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
                        TProvinceID.value ? '?province=' + TProvinceID.value.ID : ''
                    }`,
                    type: 'E_GET'
                },
                textField: 'DistrictName',
                valueField: 'ID',
                filter: true,
                filterServer: false,
                value: TDistrictID.value,
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
                        TDistrictID.value ? '?districtid=' + TDistrictID.value.ID : ''
                    }`,
                    type: 'E_GET'
                },
                textField: 'VillageName',
                valueField: 'ID',
                filter: true,
                filterServer: false,
                value: TVillageID.value,
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
                            {!fieldHiden?.lablePermanent && (
                                <View style={styleViewTitleGroup}>
                                    <VnrText
                                        style={[styleSheets.text, textLableGroup]}
                                        i18nKey={'HRM_PortalApp_Permanent'}
                                    />
                                </View>
                            )}
                            {!fieldHiden?.PCountryID && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={PCountryID.label} />

                                        {fieldValid.PCountryID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrPickerAddress
                                            key="E_COUNTRY"
                                            disable={PCountryID.disable}
                                            listPicker={objAddress}
                                            onFinish={item => this.onFinishCountry(item)}
                                        />
                                    </View>
                                </View>
                            )}

                            {!fieldHiden?.PProvinceID && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={PProvinceID.label}
                                        />

                                        {/* valid RelativeVolDocument */}
                                        {fieldValid.PProvinceID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrPickerAddress
                                            key="E_PROVINCE"
                                            disable={PProvinceID.disable}
                                            listPicker={{
                                                province: objAddress.province,
                                                district: objAddress.district,
                                                village: objAddress.village
                                            }}
                                            onFinish={item => this.onFinishProvince(item)}
                                        />
                                    </View>
                                </View>
                            )}

                            {!fieldHiden?.PDistrictID && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={PDistrictID.label}
                                        />

                                        {/* valid RelativeVolDocument */}
                                        {fieldValid.PDistrictID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrPickerAddress
                                            key="E_DISTRICT"
                                            disable={PDistrictID.disable}
                                            listPicker={{ district: objAddress.district, village: objAddress.village }}
                                            onFinish={item => this.onFinishDistrict(item)}
                                        />
                                    </View>
                                </View>
                            )}

                            {!fieldHiden?.PVillageID && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={PVillageID.label} />

                                        {/* valid RelativeVolDocument */}
                                        {fieldValid.PVillageID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrPickerAddress
                                            key="E_VILLAGE"
                                            disable={PVillageID.disable}
                                            listPicker={{ village: objAddress.village }}
                                            onFinish={item => this.onFinishVillage(item)}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* PAddress2 */}
                            {!fieldHiden?.PAddress2 && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={PAddress2.label} />

                                        {/* valid PAddress2 */}
                                        {fieldValid.PAddress2 && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={PAddress2.disable}
                                            refresh={PAddress2.refresh}
                                            value={PAddress2.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    AddressInformation: {
                                                        ...this.state.AddressInformation,
                                                        PAddress2: {
                                                            ...this.state.AddressInformation.PAddress2,
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

                        <View>
                            {!fieldHiden?.lableTemporary && (
                                <View style={styleViewTitleGroup}>
                                    <VnrText
                                        style={[styleSheets.text, textLableGroup]}
                                        i18nKey={'HRM_PortalApp_Temporary'}
                                    />
                                </View>
                            )}

                            {!fieldHiden?.TCountryID && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={TCountryID.label} />

                                        {fieldValid.TCountryID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrPickerAddress
                                            key="E_COUNTRY"
                                            disable={TCountryID.disable}
                                            listPicker={objAddress2}
                                            onFinish={item => this.onFinishTCountry(item)}
                                        />
                                    </View>
                                </View>
                            )}

                            {!fieldHiden?.TProvinceID && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={TProvinceID.label}
                                        />

                                        {/* valid RelativeVolDocument */}
                                        {fieldValid.TProvinceID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrPickerAddress
                                            key="E_PROVINCE"
                                            disable={TProvinceID.disable}
                                            listPicker={{
                                                province: objAddress2.province,
                                                district: objAddress2.district,
                                                village: objAddress2.village
                                            }}
                                            onFinish={item => this.onFinishTProvince(item)}
                                        />
                                    </View>
                                </View>
                            )}

                            {!fieldHiden?.TDistrictID && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={TDistrictID.label}
                                        />

                                        {/* valid RelativeVolDocument */}
                                        {fieldValid.TDistrictID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrPickerAddress
                                            key="E_DISTRICT"
                                            disable={TDistrictID.disable}
                                            listPicker={{
                                                district: objAddress2.district,
                                                village: objAddress2.village
                                            }}
                                            onFinish={item => this.onFinishTDistrict(item)}
                                        />
                                    </View>
                                </View>
                            )}

                            {!fieldHiden?.TVillageID && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={TVillageID.label} />

                                        {/* valid RelativeVolDocument */}
                                        {fieldValid.TVillageID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrPickerAddress
                                            key="E_VILLAGE"
                                            disable={TVillageID.disable}
                                            listPicker={{ village: objAddress2.village }}
                                            onFinish={item => this.onFinishTVillage(item)}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* PAddress2 */}
                            {!fieldHiden?.TAddress2 && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={TAddress2.label} />

                                        {/* valid PAddress2 */}
                                        {fieldValid.TAddress2 && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={TAddress2.disable}
                                            refresh={TAddress2.refresh}
                                            value={TAddress2.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    AddressInformation: {
                                                        ...this.state.AddressInformation,
                                                        TAddress2: {
                                                            ...this.state.AddressInformation.TAddress2,
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
                                    onFinish(this.state.AddressInformation);
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
