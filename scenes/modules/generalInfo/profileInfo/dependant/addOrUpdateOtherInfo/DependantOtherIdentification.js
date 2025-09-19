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
import VnrAutoComplete from '../../../../../../components/VnrAutoComplete/VnrAutoComplete';

export default class DependantOtherIdentification extends Component {
    constructor(porps) {
        super(porps);

        const { DepentantsPassport, Identification, IDNoInfo, fieldValid } = porps.navigation.state.params;
        this.state = { DepentantsPassport, Identification, IDNoInfo, fieldValid };
    }

    componentDidMount() {
        const { DepentantsPassport, Identification, IDNoInfo } = this.state,
            { DependantPassportIssuePlaceID } = DepentantsPassport,
            { PlaceOfIssuanceOfIdentityCardID } = Identification,
            { DependantIDPlaceOfIssueID } = IDNoInfo;

        this.setState({
            DepentantsPassport: {
                ...DepentantsPassport,
                DependantPassportIssuePlaceID: {
                    ...DependantPassportIssuePlaceID,
                    refresh: !DependantPassportIssuePlaceID.refresh
                }
            },
            Identification: {
                ...Identification,
                PlaceOfIssuanceOfIdentityCardID: {
                    ...PlaceOfIssuanceOfIdentityCardID,
                    refresh: !PlaceOfIssuanceOfIdentityCardID.refresh
                }
            },
            IDNoInfo: {
                ...IDNoInfo,
                DependantIDPlaceOfIssueID: {
                    ...DependantIDPlaceOfIssueID,
                    refresh: !DependantIDPlaceOfIssueID.refresh
                }
            }
        });
    }

    render() {
        const { DepentantsPassport, Identification, IDNoInfo, fieldValid } = this.state,
            {
                PassportNo,
                // Task: 0164814 => default hidden
                DependantPassportPlaceOfIssue,
                DependantPassportIssuePlaceID,
                DependantPassportDateOfIssue,
                DependantPassportDateOfExpiry
            } = DepentantsPassport,
            {
                IdentificationNo,
                // task: 0164814
                PlaceOfIssuanceOfIdentityCard,
                PlaceOfIssuanceOfIdentityCardID,
                DateOfIssuanceOfIdentityCard,
                ExpiryDateOfIdentityCard
            } = Identification,
            {
                IDNo,
                // task: 0164814
                DependantIDPlaceOfIssue,
                DependantIDPlaceOfIssueID,
                DependantIDDateOfIssue,
                DependantIDDateOfExpiry
            } = IDNoInfo;

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

                                {/* DependantIDPlaceOfIssue task: 0164814 => default hidden */}
                                {DependantIDPlaceOfIssue.visibleConfig && DependantIDPlaceOfIssue.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={DependantIDPlaceOfIssue.label}
                                            />

                                            {/* valid DependantIDPlaceOfIssue */}
                                            {fieldValid.DependantIDPlaceOfIssue && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrAutoComplete
                                                api={{
                                                    urlApi: '[URI_HR]/Cat_GetData/GetMultiProvince',
                                                    type: 'E_GET',
                                                    dataBody: {}
                                                }}
                                                autoBind={true}
                                                value={DependantIDPlaceOfIssue.value}
                                                refresh={DependantIDPlaceOfIssue.refresh}
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
                                                            DependantIDPlaceOfIssue: {
                                                                ...this.state.IDNoInfo.DependantIDPlaceOfIssue,
                                                                value
                                                            }
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* DependantIDPlaceOfIssueID */}
                                {DependantIDPlaceOfIssueID.visibleConfig && DependantIDPlaceOfIssueID.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={DependantIDPlaceOfIssueID.label}
                                            />

                                            {/* valid DependantIDPlaceOfIssueID */}
                                            {fieldValid.DependantIDPlaceOfIssueID && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPickerQuickly
                                                api={{
                                                    urlApi: '[URI_HR]/Cat_GetData/GetMultiProvince',
                                                    type: 'E_GET'
                                                }}
                                                refresh={DependantIDPlaceOfIssueID.refresh}
                                                textField="ProvinceName"
                                                autoBind={true}
                                                valueField="ID"
                                                filter={true}
                                                filterServer={false}
                                                autoFilter={true}
                                                value={DependantIDPlaceOfIssueID.value}
                                                disable={DependantIDPlaceOfIssueID.disable}
                                                onFinish={item =>
                                                    this.setState({
                                                        IDNoInfo: {
                                                            ...this.state.IDNoInfo,
                                                            DependantIDPlaceOfIssueID: {
                                                                ...this.state.IDNoInfo.DependantIDPlaceOfIssueID,
                                                                value: item
                                                            }
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* DependantIDDateOfIssue */}
                                {DependantIDDateOfIssue.visibleConfig && DependantIDDateOfIssue.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={DependantIDDateOfIssue.label}
                                            />

                                            {fieldValid.DependantIDDateOfIssue && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={DependantIDDateOfIssue.value}
                                                refresh={DependantIDDateOfIssue.refresh}
                                                type={'date'}
                                                onFinish={value =>
                                                    this.setState({
                                                        IDNoInfo: {
                                                            ...this.state.IDNoInfo,
                                                            DependantIDDateOfIssue: {
                                                                ...this.state.IDNoInfo.DependantIDDateOfIssue,
                                                                value
                                                            }
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* DependantIDDateOfExpiry */}
                                {DependantIDDateOfExpiry.visibleConfig && DependantIDDateOfExpiry.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={DependantIDDateOfExpiry.label}
                                            />

                                            {fieldValid.DependantIDDateOfExpiry && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={DependantIDDateOfExpiry.value}
                                                refresh={DependantIDDateOfExpiry.refresh}
                                                type={'date'}
                                                onFinish={value =>
                                                    this.setState({
                                                        IDNoInfo: {
                                                            ...this.state.IDNoInfo,
                                                            DependantIDDateOfExpiry: {
                                                                ...this.state.IDNoInfo.DependantIDDateOfExpiry,
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

                                {/* PlaceOfIssuanceOfIdentityCard task: 0164814 => default hidden */}
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

                                {/* PlaceOfIssuanceOfIdentityCardID */}
                                {PlaceOfIssuanceOfIdentityCardID.visibleConfig &&
                                    PlaceOfIssuanceOfIdentityCardID.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={PlaceOfIssuanceOfIdentityCardID.label}
                                            />

                                            {/* valid PlaceOfIssuanceOfIdentityCardID */}
                                            {fieldValid.PlaceOfIssuanceOfIdentityCardID && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPickerQuickly
                                                api={{
                                                    urlApi: '[URI_HR]/Cat_GetData/GetMultiIDCardIssuePlace',
                                                    type: 'E_GET'
                                                }}
                                                refresh={PlaceOfIssuanceOfIdentityCardID.refresh}
                                                textField="IDCardIssuePlaceName"
                                                autoBind={true}
                                                valueField="ID"
                                                filter={true}
                                                filterServer={false}
                                                autoFilter={true}
                                                value={PlaceOfIssuanceOfIdentityCardID.value}
                                                disable={PlaceOfIssuanceOfIdentityCardID.disable}
                                                onFinish={item =>
                                                    this.setState({
                                                        Identification: {
                                                            ...this.state.Identification,
                                                            PlaceOfIssuanceOfIdentityCardID: {
                                                                ...this.state.Identification
                                                                    .PlaceOfIssuanceOfIdentityCardID,
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
                        {DepentantsPassport.visibleConfig && DepentantsPassport.visible && (
                            <View>
                                <View style={styleViewTitleGroup}>
                                    <VnrText
                                        style={[styleSheets.text, textLableGroup]}
                                        i18nKey={DepentantsPassport.label}
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
                                                        DepentantsPassport: {
                                                            ...this.state.DepentantsPassport,
                                                            PassportNo: {
                                                                ...DepentantsPassport.PassportNo,
                                                                value: text
                                                            }
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* DependantPassportPlaceOfIssue task: 0164814 => default hidden */}
                                {DependantPassportPlaceOfIssue.visibleConfig && DependantPassportPlaceOfIssue.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={DependantPassportPlaceOfIssue.label}
                                            />

                                            {/* valid DependantPassportPlaceOfIssue */}
                                            {fieldValid.DependantPassportPlaceOfIssue && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrAutoComplete
                                                api={{
                                                    urlApi: '[URI_HR]/Cat_GetData/GetMultiPassportIssuePlace',
                                                    type: 'E_GET',
                                                    dataBody: {}
                                                }}
                                                autoBind={true}
                                                value={DependantPassportPlaceOfIssue.value}
                                                refresh={DependantPassportPlaceOfIssue.refresh}
                                                textField="PassportIssuePlaceName"
                                                valueField="PassportIssuePlaceName"
                                                filterParams="PassportIssuePlaceName"
                                                filter={true}
                                                filterServer={false}
                                                autoFilter={true}
                                                onFinish={value =>
                                                    this.setState({
                                                        DepentantsPassport: {
                                                            ...this.state.DepentantsPassport,
                                                            DependantPassportPlaceOfIssue: {
                                                                ...this.state.DepentantsPassport
                                                                    .DependantPassportPlaceOfIssue,
                                                                value
                                                            }
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* DependantPassportIssuePlaceID */}
                                {DependantPassportIssuePlaceID.visibleConfig && DependantPassportIssuePlaceID.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={DependantPassportIssuePlaceID.label}
                                            />

                                            {/* valid DependantPassportIssuePlaceID */}
                                            {fieldValid.DependantPassportIssuePlaceID && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPickerQuickly
                                                api={{
                                                    urlApi: '[URI_HR]/Cat_GetData/GetMultiPassportIssuePlace',
                                                    type: 'E_GET'
                                                }}
                                                autoBind={true}
                                                refresh={DependantPassportIssuePlaceID.refresh}
                                                textField="PassportIssuePlaceName"
                                                valueField="ID"
                                                filter={true}
                                                filterServer={false}
                                                autoFilter={true}
                                                value={DependantPassportIssuePlaceID.value}
                                                disable={DependantPassportIssuePlaceID.disable}
                                                onFinish={item =>
                                                    this.setState({
                                                        DepentantsPassport: {
                                                            ...this.state.DepentantsPassport,
                                                            DependantPassportIssuePlaceID: {
                                                                ...this.state.DepentantsPassport
                                                                    .DependantPassportIssuePlaceID,
                                                                value: item
                                                            }
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* DependantPassportDateOfIssue */}
                                {DependantPassportDateOfIssue.visibleConfig && DependantPassportDateOfIssue.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={DependantPassportDateOfIssue.label}
                                            />

                                            {fieldValid.DependantPassportDateOfIssue && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={DependantPassportDateOfIssue.value}
                                                refresh={DependantPassportDateOfIssue.refresh}
                                                type={'date'}
                                                onFinish={value =>
                                                    this.setState({
                                                        DepentantsPassport: {
                                                            ...this.state.DepentantsPassport,
                                                            DependantPassportDateOfIssue: {
                                                                ...this.state.DepentantsPassport
                                                                    .DependantPassportDateOfIssue,
                                                                value
                                                            }
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* DependantPassportDateOfExpiry */}
                                {DependantPassportDateOfExpiry.visibleConfig && DependantPassportDateOfExpiry.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={DependantPassportDateOfExpiry.label}
                                            />

                                            {fieldValid.DependantPassportDateOfExpiry && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={DependantPassportDateOfExpiry.value}
                                                refresh={DependantPassportDateOfExpiry.refresh}
                                                type={'date'}
                                                onFinish={value =>
                                                    this.setState({
                                                        DepentantsPassport: {
                                                            ...this.state.DepentantsPassport,
                                                            DependantPassportDateOfExpiry: {
                                                                ...this.state.DepentantsPassport
                                                                    .DependantPassportDateOfExpiry,
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
