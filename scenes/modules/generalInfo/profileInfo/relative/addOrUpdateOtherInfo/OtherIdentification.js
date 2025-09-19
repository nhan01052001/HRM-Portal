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
import DrawerServices from '../../../../../../utils/DrawerServices';
import VnrPickerQuickly from '../../../../../../components/VnrPickerQuickly/VnrPickerQuickly';
import { ToasterSevice } from '../../../../../../components/Toaster/Toaster';
import VnrAutoComplete from '../../../../../../components/VnrAutoComplete/VnrAutoComplete';

export default class OtherIdentification extends Component {
    constructor(porps) {
        super(porps);

        const { RelativesPassport, Identification, IDNoInfo, fieldValid } = porps.navigation.state.params;
        this.state = { RelativesPassport, Identification, IDNoInfo, fieldValid };
    }

    warningCMND = value => {
        //[Số CMND] phải là 9 hoặc 12 số
        if (value && (value.length == 9 || value.length == 12)) {
            return true;
        } else {
            ToasterSevice.showWarning('HRM_HR_Profile_IDNoMust9or12', 4000);
            return false;
        }
    };

    warningCCCD = value => {
        //[Số CCCD] phải là 12 số
        if (value && value.length == 12) {
            return true;
        } else {
            ToasterSevice.showWarning('HRM_HR_Profile_IDCardMust9or12', 4000);
            return false;
        }
    };

    render() {
        const { RelativesPassport, Identification, IDNoInfo, fieldValid } = this.state,
            {
                RelativesPassportNo,
                RelativesPassportIssuePlaceID,
                RelativesPassportDateOfIssue,
                RelativesPassportDateOfExpiry,
                RelativesPassportPlaceOfIssue
            } = RelativesPassport,
            {
                IdentificationNo,
                RelativesIDCardIssuePlaceID,
                DateOfIssuanceOfIdentityCard,
                ExpiryDateOfIdentityCard,
                PlaceOfIssuanceOfIdentityCard
            } = Identification,
            { IDNo, RelativesIDPlaceOfIssueID, IDDateOfIssue, IDDateOfExpiry, RelativesIDPlaceOfIssue } = IDNoInfo;

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
                                                onBlur={() => this.warningCMND(this.state.IDNoInfo.IDNo.value)}
                                                onSubmitEditing={() => this.warningCMND(this.state.IDNoInfo.IDNo.value)}
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

                                {/* RelativesIDPlaceOfIssue task: 0164813 => default hidden */}
                                {RelativesIDPlaceOfIssue.visibleConfig && RelativesIDPlaceOfIssue.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={RelativesIDPlaceOfIssue.label}
                                            />

                                            {/* valid RelativesIDPlaceOfIssue */}
                                            {fieldValid.RelativesIDPlaceOfIssue && (
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
                                                value={RelativesIDPlaceOfIssue.value}
                                                refresh={RelativesIDPlaceOfIssue.refresh}
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
                                                            RelativesIDPlaceOfIssue: {
                                                                ...this.state.IDNoInfo.RelativesIDPlaceOfIssue,
                                                                value
                                                            }
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* RelativesIDPlaceOfIssueID */}
                                {RelativesIDPlaceOfIssueID.visibleConfig && RelativesIDPlaceOfIssueID.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={RelativesIDPlaceOfIssueID.label}
                                            />

                                            {/* valid RelativesIDPlaceOfIssueID */}
                                            {fieldValid.RelativesIDPlaceOfIssueID && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPickerQuickly
                                                api={{
                                                    urlApi: '[URI_HR]/Cat_GetData/GetMultiProvinceList',
                                                    type: 'E_GET'
                                                }}
                                                refresh={RelativesIDPlaceOfIssueID.refresh}
                                                textField="ProvinceName"
                                                valueField="ID"
                                                autoBind={true}
                                                filter={true}
                                                filterServer={false}
                                                value={RelativesIDPlaceOfIssueID.value}
                                                disable={RelativesIDPlaceOfIssueID.disable}
                                                onFinish={item =>
                                                    this.setState({
                                                        IDNoInfo: {
                                                            ...this.state.IDNoInfo,
                                                            RelativesIDPlaceOfIssueID: {
                                                                ...this.state.IDNoInfo.RelativesIDPlaceOfIssueID,
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

                                {/* IDDateOfExpiry */}
                                {IDDateOfExpiry.visibleConfig && IDDateOfExpiry.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={IDDateOfExpiry.label}
                                            />

                                            {fieldValid.IDDateOfExpiry && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={IDDateOfExpiry.value}
                                                refresh={IDDateOfExpiry.refresh}
                                                type={'date'}
                                                onFinish={value =>
                                                    this.setState({
                                                        IDNoInfo: {
                                                            ...this.state.IDNoInfo,
                                                            IDDateOfExpiry: {
                                                                ...this.state.IDNoInfo.IDDateOfExpiry,
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
                                                onBlur={() =>
                                                    this.warningCCCD(this.state.Identification.IdentificationNo.value)
                                                }
                                                onSubmitEditing={() =>
                                                    this.warningCCCD(this.state.Identification.IdentificationNo.value)
                                                }
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

                                {/* PlaceOfIssuanceOfIdentityCard task: 0164813 => default hidden */}
                                {PlaceOfIssuanceOfIdentityCard.visibleConfig && PlaceOfIssuanceOfIdentityCard.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={PlaceOfIssuanceOfIdentityCard.label}
                                            />

                                            {/* valid PlaceOfIssuanceOfIdentityCard */}
                                            {fieldValid.PlaceOfIssuanceOfIdentityCard && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrAutoComplete
                                                api={{
                                                    urlApi: '[URI_HR]/Cat_GetData/GetMultiIDCardIssuePlace',
                                                    type: 'E_GET',
                                                    dataBody: {}
                                                }}
                                                autoBind={true}
                                                value={PlaceOfIssuanceOfIdentityCard.value}
                                                refresh={PlaceOfIssuanceOfIdentityCard.refresh}
                                                textField="IDCardIssuePlaceName"
                                                valueField="IDCardIssuePlaceName"
                                                filterParams="IDCardIssuePlaceName"
                                                filter={true}
                                                filterServer={false}
                                                autoFilter={true}
                                                onFinish={value =>
                                                    this.setState({
                                                        Identification: {
                                                            ...this.state.Identification,
                                                            PlaceOfIssuanceOfIdentityCard: {
                                                                ...this.state.Identification
                                                                    .PlaceOfIssuanceOfIdentityCard,
                                                                value
                                                            }
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* RelativesIDCardIssuePlaceID */}
                                {RelativesIDCardIssuePlaceID.visibleConfig && RelativesIDCardIssuePlaceID.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={RelativesIDCardIssuePlaceID.label}
                                            />

                                            {/* valid RelativesIDCardIssuePlaceID */}
                                            {fieldValid.RelativesIDCardIssuePlaceID && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPickerQuickly
                                                api={{
                                                    urlApi: '[URI_HR]/Cat_GetData/GetMultiIDCardIssuePlace',
                                                    type: 'E_GET'
                                                }}
                                                refresh={RelativesIDCardIssuePlaceID.refresh}
                                                textField="IDCardIssuePlaceName"
                                                valueField="ID"
                                                autoBind={true}
                                                filter={true}
                                                filterServer={false}
                                                value={RelativesIDCardIssuePlaceID.value}
                                                disable={RelativesIDCardIssuePlaceID.disable}
                                                onFinish={item =>
                                                    this.setState({
                                                        Identification: {
                                                            ...this.state.Identification,
                                                            RelativesIDCardIssuePlaceID: {
                                                                ...this.state.Identification
                                                                    .RelativesIDCardIssuePlaceID,
                                                                value: item
                                                            }
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* DateOfIssuanceOfIdentityCard */}
                                {DateOfIssuanceOfIdentityCard.visibleConfig && DateOfIssuanceOfIdentityCard.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={DateOfIssuanceOfIdentityCard.label}
                                            />

                                            {fieldValid.DateOfIssuanceOfIdentityCard && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={DateOfIssuanceOfIdentityCard.value}
                                                refresh={DateOfIssuanceOfIdentityCard.refresh}
                                                type={'date'}
                                                onFinish={value =>
                                                    this.setState({
                                                        Identification: {
                                                            ...this.state.Identification,
                                                            DateOfIssuanceOfIdentityCard: {
                                                                ...this.state.Identification
                                                                    .DateOfIssuanceOfIdentityCard,
                                                                value
                                                            }
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* ExpiryDateOfIdentityCard */}
                                {ExpiryDateOfIdentityCard.visibleConfig && ExpiryDateOfIdentityCard.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={ExpiryDateOfIdentityCard.label}
                                            />

                                            {fieldValid.ExpiryDateOfIdentityCard && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={ExpiryDateOfIdentityCard.value}
                                                refresh={ExpiryDateOfIdentityCard.refresh}
                                                type={'date'}
                                                onFinish={value =>
                                                    this.setState({
                                                        Identification: {
                                                            ...this.state.Identification,
                                                            ExpiryDateOfIdentityCard: {
                                                                ...this.state.Identification.ExpiryDateOfIdentityCard,
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

                                {/* RelativesPassportNo */}
                                {RelativesPassportNo.visibleConfig && RelativesPassportNo.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={RelativesPassportNo.label}
                                            />

                                            {/* valid RelativesPassportNo */}
                                            {fieldValid.RelativesPassportNo && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>

                                        <View style={viewControl}>
                                            <VnrTextInput
                                                disable={RelativesPassportNo.disable}
                                                refresh={RelativesPassportNo.refresh}
                                                value={RelativesPassportNo.value}
                                                onChangeText={text =>
                                                    this.setState({
                                                        RelativesPassport: {
                                                            ...this.state.RelativesPassport,
                                                            RelativesPassportNo: {
                                                                ...this.state.RelativesPassport.RelativesPassportNo,
                                                                value: text
                                                            }
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* RelativesPassportIssuePlaceID */}
                                {RelativesPassportIssuePlaceID.visibleConfig && RelativesPassportIssuePlaceID.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={RelativesPassportIssuePlaceID.label}
                                            />

                                            {/* valid RelativesPassportIssuePlaceID */}
                                            {fieldValid.RelativesPassportIssuePlaceID && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>

                                        <View style={viewControl}>
                                            <VnrPickerQuickly
                                                api={{
                                                    urlApi: '[URI_HR]/Cat_GetData/GetMultiPassportIssuePlace',
                                                    type: 'E_GET'
                                                }}
                                                refresh={RelativesPassportIssuePlaceID.refresh}
                                                textField="PassportIssuePlaceName"
                                                valueField="ID"
                                                autoBind={true}
                                                filter={true}
                                                filterServer={false}
                                                value={RelativesPassportIssuePlaceID.value}
                                                disable={RelativesPassportIssuePlaceID.disable}
                                                onFinish={item => {
                                                    this.setState({
                                                        RelativesPassport: {
                                                            ...this.state.RelativesPassport,
                                                            RelativesPassportIssuePlaceID: {
                                                                ...this.state.RelativesPassport
                                                                    .RelativesPassportIssuePlaceID,
                                                                value: item
                                                            }
                                                        }
                                                    });
                                                }}
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* RelativesPassportPlaceOfIssue task: 0164813 => default hidden */}
                                {RelativesPassportPlaceOfIssue.visibleConfig && RelativesPassportPlaceOfIssue.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={RelativesPassportPlaceOfIssue.label}
                                            />

                                            {/* valid RelativesPassportPlaceOfIssue */}
                                            {fieldValid.RelativesPassportPlaceOfIssue && (
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
                                                value={RelativesPassportPlaceOfIssue.value}
                                                refresh={RelativesPassportPlaceOfIssue.refresh}
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
                                                            RelativesPassportPlaceOfIssue: {
                                                                ...this.state.RelativesPassport
                                                                    .RelativesPassportPlaceOfIssue,
                                                                value
                                                            }
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* RelativesPassportDateOfIssue */}
                                {RelativesPassportDateOfIssue.visibleConfig && RelativesPassportDateOfIssue.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={RelativesPassportDateOfIssue.label}
                                            />

                                            {fieldValid.RelativesPassportDateOfIssue && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={RelativesPassportDateOfIssue.value}
                                                refresh={RelativesPassportDateOfIssue.refresh}
                                                type={'date'}
                                                onFinish={value =>
                                                    this.setState({
                                                        RelativesPassport: {
                                                            ...this.state.RelativesPassport,
                                                            RelativesPassportDateOfIssue: {
                                                                ...this.state.RelativesPassport
                                                                    .RelativesPassportDateOfIssue,
                                                                value
                                                            }
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* RelativesPassportDateOfExpiry */}
                                {RelativesPassportDateOfExpiry.visibleConfig && RelativesPassportDateOfExpiry.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={RelativesPassportDateOfExpiry.label}
                                            />

                                            {fieldValid.RelativesPassportDateOfExpiry && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={RelativesPassportDateOfExpiry.value}
                                                refresh={RelativesPassportDateOfExpiry.refresh}
                                                type={'date'}
                                                onFinish={value =>
                                                    this.setState({
                                                        RelativesPassport: {
                                                            ...this.state.RelativesPassport,
                                                            RelativesPassportDateOfExpiry: {
                                                                ...this.state.RelativesPassport
                                                                    .RelativesPassportDateOfExpiry,
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
                                if (IDNo.value && this.warningCMND(IDNo.value) === false) {
                                    return;
                                }

                                if (IdentificationNo.value && this.warningCCCD(IdentificationNo.value) === false) {
                                    return;
                                }

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
