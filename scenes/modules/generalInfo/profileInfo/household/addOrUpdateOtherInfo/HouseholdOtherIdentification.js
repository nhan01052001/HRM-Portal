import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    styleProfileInfo,
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
import VnrDate from '../../../../../../components/VnrDate/VnrDate';
import VnrPicker from '../../../../../../components/VnrPicker/VnrPicker';
import DrawerServices from '../../../../../../utils/DrawerServices';
import VnrAutoComplete from '../../../../../../components/VnrAutoComplete/VnrAutoComplete';

export default class OtherIdentification extends Component {
    constructor(porps) {
        super(porps);

        const { RelativesPassport, Identification, IDNoInfo, fieldValid } = porps.navigation.state.params;
        this.state = { RelativesPassport, Identification, IDNoInfo, fieldValid };
    }

    render() {
        const { RelativesPassport, Identification, IDNoInfo, fieldValid } = this.state,
            {
                PassportNo,
                PassportPlaceOfIssue,
                HouseholdInfoPassportIssuePlaceID,
                PassportDateOfIssue,
                PassportDateOfExpiry
            } = RelativesPassport,
            {
                IdentificationNo,
                IDCardPlaceOfIssue,
                HouseholdInfoIDCardIssuePlaceID,
                IDCardDateOfIssue
            } = Identification,
            { IDNo, IDPlaceOfIssue, HouseholdInfoIDPlaceOfIssueID, IDDateOfIssue } = IDNoInfo;

        const { textLableInfo, contentViewControl, viewLable, viewControl } = stylesListPickerControl,
            { textLableGroup, styleViewTitleGroup } = styleProfileInfo;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    <KeyboardAwareScrollView contentContainerStyle={CustomStyleSheet.flexGrow(1)}>
                        {/* chứng minh nhân dân */}
                        {IDNoInfo.visibleConfig && IDNoInfo.visible && (
                            <View>
                                <View style={styleViewTitleGroup}>
                                    <VnrText style={[styleSheets.text, textLableGroup]} i18nKey={IDNoInfo.label} />
                                </View>

                                {/* IDNo */}
                                {IDNo.visibleConfig && IDNo.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={IDNo.label} />

                                            {/* valid IDNoInfo */}
                                            {fieldValid.IDNo && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>

                                        <View style={viewControl}>
                                            <VnrTextInput
                                                keyboardType={'numeric'}
                                                charType={'int'}
                                                maxLength={9}
                                                disable={IDNo.disable}
                                                refresh={IDNo.refresh}
                                                value={IDNo.value}
                                                onChangeText={text =>
                                                    this.setState({
                                                        IDNoInfo: {
                                                            ...this.state.IDNoInfo,
                                                            IDNo: {
                                                                ...this.state.IDNoInfo.IDNo,
                                                                value: text
                                                            }
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* IDPlaceOfIssue */}
                                {IDPlaceOfIssue.visibleConfig && IDPlaceOfIssue.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={IDPlaceOfIssue.label}
                                            />

                                            {/* valid IDPlaceOfIssue */}
                                            {fieldValid.IDPlaceOfIssue && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrAutoComplete
                                                api={{
                                                    urlApi: '[URI_HR]/Cat_GetData/GetMultiProvinceList',
                                                    type: 'E_GET',
                                                    dataBody: {}
                                                }}
                                                autoBind={true}
                                                value={IDPlaceOfIssue.value}
                                                refresh={IDPlaceOfIssue.refresh}
                                                textField="ProvinceName"
                                                valueField="ProvinceName"
                                                filterParams="ProvinceName"
                                                filter={true}
                                                filterServer={false}
                                                autoFilter={true}
                                                onFinish={value =>
                                                    this.setState({
                                                        IDNoInfo: {
                                                            ...this.state.IDNoInfo,
                                                            IDPlaceOfIssue: {
                                                                ...this.state.IDNoInfo.IDPlaceOfIssue,
                                                                value
                                                            }
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* HouseholdInfoIDPlaceOfIssueID */}
                                {HouseholdInfoIDPlaceOfIssueID.visibleConfig && HouseholdInfoIDPlaceOfIssueID.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={HouseholdInfoIDPlaceOfIssueID.label}
                                            />

                                            {/* valid HouseholdInfoIDPlaceOfIssueID */}
                                            {fieldValid.HouseholdInfoIDPlaceOfIssueID && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPicker
                                                api={{
                                                    urlApi: '[URI_HR]/Cat_GetData/GetMultiProvinceList',
                                                    type: 'E_GET'
                                                }}
                                                refresh={HouseholdInfoIDPlaceOfIssueID.refresh}
                                                textField="ProvinceName"
                                                valueField="ID"
                                                filter={true}
                                                filterServer={false}
                                                autoBind={true}
                                                value={HouseholdInfoIDPlaceOfIssueID.value}
                                                disable={HouseholdInfoIDPlaceOfIssueID.disable}
                                                onFinish={item =>
                                                    this.setState({
                                                        IDNoInfo: {
                                                            ...this.state.IDNoInfo,
                                                            HouseholdInfoIDPlaceOfIssueID: {
                                                                ...this.state.IDNoInfo.HouseholdInfoIDPlaceOfIssueID,
                                                                value: item
                                                            }
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* IDDateOfIssue */}
                                {IDDateOfIssue.visibleConfig && IDDateOfIssue.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={IDDateOfIssue.label}
                                            />

                                            {fieldValid.IDDateOfIssue && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={IDDateOfIssue.value}
                                                refresh={IDDateOfIssue.refresh}
                                                type={'date'}
                                                onFinish={value =>
                                                    this.setState({
                                                        IDNoInfo: {
                                                            ...this.state.IDNoInfo,
                                                            IDDateOfIssue: {
                                                                ...this.state.IDNoInfo.IDDateOfIssue,
                                                                value
                                                            }
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}
                            </View>
                        )}

                        {/* căn cước công dân */}
                        {Identification.visibleConfig && Identification.visible && (
                            <View>
                                <View style={styleViewTitleGroup}>
                                    <VnrText
                                        style={[styleSheets.text, textLableGroup]}
                                        i18nKey={Identification.label}
                                    />
                                </View>

                                {/* IdentificationNo */}
                                {IdentificationNo.visibleConfig && IdentificationNo.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={IdentificationNo.label}
                                            />

                                            {/* valid IdentificationNo */}
                                            {fieldValid.IdentificationNo && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>

                                        <View style={viewControl}>
                                            <VnrTextInput
                                                keyboardType={'numeric'}
                                                charType={'int'}
                                                maxLength={12}
                                                disable={IdentificationNo.disable}
                                                refresh={IdentificationNo.refresh}
                                                value={IdentificationNo.value}
                                                onChangeText={text =>
                                                    this.setState({
                                                        Identification: {
                                                            ...this.state.Identification,
                                                            IdentificationNo: {
                                                                ...this.state.Identification.IdentificationNo,
                                                                value: text
                                                            }
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* IDCardPlaceOfIssue */}
                                {IDCardPlaceOfIssue.visibleConfig && IDCardPlaceOfIssue.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={IDCardPlaceOfIssue.label}
                                            />

                                            {/* valid IDCardPlaceOfIssue */}
                                            {fieldValid.IDCardPlaceOfIssue && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrAutoComplete
                                                api={{
                                                    urlApi: '[URI_HR]/Cat_GetData/GetMultiProvinceList',
                                                    type: 'E_GET',
                                                    dataBody: {}
                                                }}
                                                // autoBind={true}
                                                value={IDCardPlaceOfIssue.value}
                                                refresh={IDCardPlaceOfIssue.refresh}
                                                textField="ProvinceName"
                                                valueField="ProvinceName"
                                                filterParams="ProvinceName"
                                                filter={true}
                                                filterServer={false}
                                                autoFilter={true}
                                                onFinish={value => {
                                                    this.setState({
                                                        Identification: {
                                                            ...this.state.Identification,
                                                            IDCardPlaceOfIssue: {
                                                                ...this.state.Identification.IDCardPlaceOfIssue,
                                                                value
                                                            }
                                                        }
                                                    });
                                                }}
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* HouseholdInfoIDCardIssuePlaceID */}
                                {HouseholdInfoIDCardIssuePlaceID.visibleConfig &&
                                    HouseholdInfoIDCardIssuePlaceID.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={HouseholdInfoIDCardIssuePlaceID.label}
                                            />

                                            {/* valid HouseholdInfoIDCardIssuePlaceID */}
                                            {fieldValid.HouseholdInfoIDCardIssuePlaceID && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPicker
                                                api={{
                                                    urlApi: '[URI_HR]/Cat_GetData/GetMultiIDCardIssuePlace',
                                                    type: 'E_GET'
                                                }}
                                                refresh={HouseholdInfoIDCardIssuePlaceID.refresh}
                                                textField="IDCardIssuePlaceName"
                                                valueField="ID"
                                                filter={true}
                                                filterServer={false}
                                                autoBind={true}
                                                value={HouseholdInfoIDCardIssuePlaceID.value}
                                                disable={HouseholdInfoIDCardIssuePlaceID.disable}
                                                onFinish={item =>
                                                    this.setState({
                                                        Identification: {
                                                            ...this.state.Identification,
                                                            HouseholdInfoIDCardIssuePlaceID: {
                                                                ...this.state.Identification
                                                                    .HouseholdInfoIDCardIssuePlaceID,
                                                                value: item
                                                            }
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* IDCardDateOfIssue */}
                                {IDCardDateOfIssue.visibleConfig && IDCardDateOfIssue.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={IDCardDateOfIssue.label}
                                            />

                                            {fieldValid.IDCardDateOfIssue && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={IDCardDateOfIssue.value}
                                                refresh={IDCardDateOfIssue.refresh}
                                                type={'date'}
                                                onFinish={value =>
                                                    this.setState({
                                                        Identification: {
                                                            ...this.state.Identification,
                                                            IDCardDateOfIssue: {
                                                                ...this.state.Identification.IDCardDateOfIssue,
                                                                value
                                                            }
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}
                            </View>
                        )}

                        {/* hộ chiếu */}
                        {RelativesPassport.visibleConfig && RelativesPassport.visible && (
                            <View>
                                <View style={styleViewTitleGroup}>
                                    <VnrText
                                        style={[styleSheets.text, textLableGroup]}
                                        i18nKey={RelativesPassport.label}
                                    />
                                </View>

                                {/* PassportNo */}
                                {PassportNo.visibleConfig && PassportNo.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={PassportNo.label}
                                            />

                                            {/* valid PassportNo */}
                                            {fieldValid.PassportNo && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>

                                        <View style={viewControl}>
                                            <VnrTextInput
                                                disable={PassportNo.disable}
                                                refresh={PassportNo.refresh}
                                                value={PassportNo.value}
                                                onChangeText={text =>
                                                    this.setState({
                                                        RelativesPassport: {
                                                            ...this.state.RelativesPassport,
                                                            PassportNo: {
                                                                ...this.state.RelativesPassport.PassportNo,
                                                                value: text
                                                            }
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* PassportPlaceOfIssue */}
                                {PassportPlaceOfIssue.visibleConfig && PassportPlaceOfIssue.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={PassportPlaceOfIssue.label}
                                            />

                                            {/* valid PassportPlaceOfIssue */}
                                            {fieldValid.PassportPlaceOfIssue && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrAutoComplete
                                                api={{
                                                    urlApi: '[URI_HR]/Cat_GetData/GetMultiProvinceList',
                                                    type: 'E_GET',
                                                    dataBody: {}
                                                }}
                                                value={PassportPlaceOfIssue.value}
                                                refresh={PassportPlaceOfIssue.refresh}
                                                textField="ProvinceName"
                                                valueField="ProvinceName"
                                                filterParams="ProvinceName"
                                                filter={true}
                                                filterServer={false}
                                                autoFilter={true}
                                                onFinish={value =>
                                                    this.setState({
                                                        RelativesPassport: {
                                                            ...this.state.RelativesPassport,
                                                            PassportPlaceOfIssue: {
                                                                ...this.state.RelativesPassport.PassportPlaceOfIssue,
                                                                value
                                                            }
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* HouseholdInfoPassportIssuePlaceID */}
                                {HouseholdInfoPassportIssuePlaceID.visibleConfig &&
                                    HouseholdInfoPassportIssuePlaceID.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={HouseholdInfoPassportIssuePlaceID.label}
                                            />

                                            {/* valid HouseholdInfoPassportIssuePlaceID */}
                                            {fieldValid.HouseholdInfoPassportIssuePlaceID && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPicker
                                                api={{
                                                    urlApi: '[URI_HR]/Cat_GetData/GetMultiPassportIssuePlace',
                                                    type: 'E_GET'
                                                }}
                                                refresh={HouseholdInfoPassportIssuePlaceID.refresh}
                                                textField="PassportIssuePlaceName"
                                                valueField="ID"
                                                filter={true}
                                                autoBind={true}
                                                filterServer={false}
                                                value={HouseholdInfoPassportIssuePlaceID.value}
                                                disable={HouseholdInfoPassportIssuePlaceID.disable}
                                                onFinish={item =>
                                                    this.setState({
                                                        RelativesPassport: {
                                                            ...this.state.RelativesPassport,
                                                            HouseholdInfoPassportIssuePlaceID: {
                                                                ...this.state.RelativesPassport
                                                                    .HouseholdInfoPassportIssuePlaceID,
                                                                value: item
                                                            }
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* PassportDateOfIssue */}
                                {PassportDateOfIssue.visibleConfig && PassportDateOfIssue.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={PassportDateOfIssue.label}
                                            />

                                            {fieldValid.PassportDateOfIssue && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={PassportDateOfIssue.value}
                                                refresh={PassportDateOfIssue.refresh}
                                                type={'date'}
                                                onFinish={value =>
                                                    this.setState({
                                                        RelativesPassport: {
                                                            ...this.state.RelativesPassport,
                                                            PassportDateOfIssue: {
                                                                ...this.state.RelativesPassport.PassportDateOfIssue,
                                                                value
                                                            }
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* PassportDateOfExpiry */}
                                {PassportDateOfExpiry.visibleConfig && PassportDateOfExpiry.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={PassportDateOfExpiry.label}
                                            />

                                            {fieldValid.PassportDateOfExpiry && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={PassportDateOfExpiry.value}
                                                refresh={PassportDateOfExpiry.refresh}
                                                type={'date'}
                                                onFinish={value =>
                                                    this.setState({
                                                        RelativesPassport: {
                                                            ...this.state.RelativesPassport,
                                                            PassportDateOfExpiry: {
                                                                ...this.state.RelativesPassport.PassportDateOfExpiry,
                                                                value
                                                            }
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}
                            </View>
                        )}
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
