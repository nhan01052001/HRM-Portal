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
import DrawerServices from '../../../../../../utils/DrawerServices';

export default class DenpendantOtherBirthCertificate extends Component {
    constructor(porps) {
        super(porps);

        const { BirthCertificate, fieldValid, fieldHiden } = porps.navigation.state.params;
        this.state = { BirthCertificate, fieldValid, fieldHiden };
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
                        value: listValues['ProvinceID']
                        //disable: listValues['CountryID'] != null ? false : true,
                    },
                    DistrictID: {
                        ...DistrictID,
                        value: listValues['DistrictID']
                        //disable: listValues['ProvinceID'] != null ? false : true
                    },
                    WardID: {
                        ...WardID,
                        value: listValues['WardID']
                        //disable: listValues['DistrictID'] != null ? false : true,
                    }
                }
            };

            this.setState(nextState);
        }
    };

    // onFinishProvince = (listValues) => {
    //     const {
    //         BirthCertificate
    //     } = this.state, {
    //         ProvinceID,
    //         DistrictID,
    //         WardID
    //     } = BirthCertificate;

    //     let nextState = {};

    //     if (listValues) {

    //         nextState = {
    //             BirthCertificate: {
    //                 ...BirthCertificate,
    //                 ProvinceID: {
    //                     ...ProvinceID,
    //                     value: listValues['ProvinceID'],
    //                    // disable: listValues['CountryID'] != null ? false : true,
    //                 },
    //                 DistrictID: {
    //                     ...DistrictID,
    //                     value: listValues['DistrictID'],
    //                    // disable: listValues['ProvinceID'] != null ? false : true
    //                 },
    //                 WardID: {
    //                     ...WardID,
    //                     value: listValues['WardID'],
    //                    // disable: listValues['DistrictID'] != null ? false : true,
    //                 }
    //             }
    //         }

    //         this.setState(nextState);
    //     }
    // }

    // onFinishDistrict = (listValues) => {
    //     const {
    //         BirthCertificate
    //     } = this.state, {
    //         DistrictID,
    //         WardID
    //     } = BirthCertificate;

    //     let nextState = {};

    //     if (listValues) {

    //         nextState = {
    //             BirthCertificate: {
    //                 ...BirthCertificate,
    //                 DistrictID: {
    //                     ...DistrictID,
    //                     value: listValues['DistrictID'],
    //                     //disable: listValues['ProvinceID'] != null ? false : true
    //                 },
    //                 WardID: {
    //                     ...WardID,
    //                     value: listValues['WardID'],
    //                     //disable: listValues['DistrictID'] != null ? false : true,
    //                 }
    //             }
    //         }

    //         this.setState(nextState);
    //     }
    // }

    // onFinishVillage = (listValues) => {
    //     const {
    //         BirthCertificate
    //     } = this.state, {
    //         WardID
    //     } = BirthCertificate;

    //     let nextState = {};

    //     if (listValues) {

    //         nextState = {
    //             BirthCertificate: {
    //                 ...BirthCertificate,
    //                 WardID: {
    //                     ...WardID,
    //                     value: listValues['WardID'],
    //                     //disable: listValues['DistrictID'] != null ? false : true,
    //                 }
    //             }
    //         }

    //         this.setState(nextState);
    //     }
    // }

    render() {
        const { BirthCertificate, fieldValid, fieldHiden } = this.state,
            {
                //Số chứng từ
                NoDocument,
                //Quyển sổ
                VolDocument,
                IdentifierNumber
            } = BirthCertificate;

        const { textLableInfo, contentViewControl, viewLable, viewControl } = stylesListPickerControl;

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

                            {/* Quyển sổ - VolDocument */}
                            {VolDocument.visibleConfig && VolDocument.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={VolDocument.label}
                                        />

                                        {fieldValid.VolDocument && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={VolDocument.disable}
                                            refresh={VolDocument.refresh}
                                            value={VolDocument.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    BirthCertificate: {
                                                        ...this.state.BirthCertificate,
                                                        VolDocument: {
                                                            ...this.state.BirthCertificate.VolDocument,
                                                            value: text
                                                        }
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {!fieldHiden?.IdentifierNumber && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={IdentifierNumber.label}
                                        />

                                        {/* valid IdentifierNumber */}
                                        {fieldValid.IdentifierNumber && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            charType={'int'}
                                            disable={IdentifierNumber.disable}
                                            refresh={IdentifierNumber.refresh}
                                            value={IdentifierNumber.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    BirthCertificate: {
                                                        ...this.state.BirthCertificate,
                                                        IdentifierNumber: {
                                                            ...this.state.BirthCertificate.IdentifierNumber,
                                                            value: text
                                                        }
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}
                            {/* <View style={contentViewControl}>
                                <View style={viewLable} >
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={CountryID.label} />
                                    {
                                        fieldValid.CountryID && <VnrText style={styleValid} i18nKey={"HRM_Valid_Char"} />
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
                            </View>

                            <View style={contentViewControl}>
                                <View style={viewLable} >
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={ProvinceID.label} />
                                    {
                                        fieldValid.ProvinceID && <VnrText style={styleValid} i18nKey={"HRM_Valid_Char"} />
                                    }
                                </View>

                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={ProvinceID.disable}
                                        refresh={ProvinceID.refresh}
                                        value={ProvinceID.value ? ProvinceID.value.ProvinceName : ''}
                                    />
                                </View>
                            </View>

                            <View style={contentViewControl}>
                                <View style={viewLable} >
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={DistrictID.label} />
                                    {
                                        fieldValid.DistrictID && <VnrText style={styleValid} i18nKey={"HRM_Valid_Char"} />
                                    }
                                </View>

                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={DistrictID.disable}
                                        refresh={DistrictID.refresh}
                                        value={DistrictID.value ? DistrictID.value.DistrictName : ''}
                                    />

                                </View>
                            </View>

                            <View style={contentViewControl}>
                                <View style={viewLable} >
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={WardID.label} />
                                    {
                                        fieldValid.WardID && <VnrText style={styleValid} i18nKey={"HRM_Valid_Char"} />
                                    }
                                </View>

                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={WardID.disable}
                                        refresh={WardID.refresh}
                                        value={WardID.value ? WardID.value.VillageName : ''}
                                    />

                                </View>
                            </View>

                            {Address.visibleConfig && Address.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable} >
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Address.label} />
                                        {
                                            fieldValid.Address && <VnrText style={styleValid} i18nKey={"HRM_Valid_Char"} />
                                        }
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
                            )} */}
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

                                DrawerServices.navigate('DependantAddOrEdit');
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
