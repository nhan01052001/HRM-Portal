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

export default class OtherIdentification extends Component {
    constructor(porps) {
        super(porps);

        const { RelativesPassport, Identification, IDNoInfo, fieldValid } = porps.navigation.state.params;
        this.state = { RelativesPassport, Identification, IDNoInfo, fieldValid };
    }

    componentDidMount() {
        const { RelativesPassport, Identification, IDNoInfo } = this.state,
            { DependantPassportPlaceOfIssue } = RelativesPassport,
            { PlaceOfIssuanceOfIdentityCard } = Identification,
            { DependantIDPlaceOfIssue } = IDNoInfo;

        this.setState({
            RelativesPassport: {
                ...RelativesPassport,
                DependantPassportPlaceOfIssue: {
                    ...DependantPassportPlaceOfIssue,
                    refresh: !DependantPassportPlaceOfIssue.refresh
                }
            },
            Identification: {
                ...Identification,
                PlaceOfIssuanceOfIdentityCard: {
                    ...PlaceOfIssuanceOfIdentityCard,
                    refresh: !PlaceOfIssuanceOfIdentityCard.refresh
                }
            },
            IDNoInfo: {
                ...IDNoInfo,
                DependantIDPlaceOfIssue: {
                    ...DependantIDPlaceOfIssue,
                    refresh: !DependantIDPlaceOfIssue.refresh
                }
            }
        });
    }

    render() {
        const { RelativesPassport, Identification, IDNoInfo, fieldValid } = this.state,
            {
                PassportNo,
                DependantPassportPlaceOfIssue,
                DependantPassportDateOfIssue,
                DependantPassportDateOfExpiry
            } = RelativesPassport,
            {
                IdentificationNo,
                PlaceOfIssuanceOfIdentityCard,
                DateOfIssuanceOfIdentityCard,
                ExpiryDateOfIdentityCard
            } = Identification,
            { IDNo, DependantIDPlaceOfIssue, DependantIDDateOfIssue, DependantIDDateOfExpiry } = IDNoInfo;

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

                                {/* DependantIDPlaceOfIssue */}
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
                                            <VnrPickerQuickly
                                                api={{
                                                    urlApi: '[URI_HR]/Cat_GetData/GetMultiProvinceList',
                                                    type: 'E_GET'
                                                }}
                                                refresh={DependantIDPlaceOfIssue.refresh}
                                                textField="ProvinceName"
                                                autoBind={true}
                                                valueField="ID"
                                                filter={true}
                                                filterServer={false}
                                                value={DependantIDPlaceOfIssue.value}
                                                disable={DependantIDPlaceOfIssue.disable}
                                                onFinish={item =>
                                                    this.setState({
                                                        IDNoInfo: {
                                                            ...this.state.IDNoInfo,
                                                            DependantIDPlaceOfIssue: {
                                                                ...this.state.IDNoInfo.DependantIDPlaceOfIssue,
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

                                {/* PlaceOfIssuanceOfIdentityCard */}
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
                                            <VnrPickerQuickly
                                                api={{
                                                    urlApi: '[URI_HR]/Cat_GetData/GetMultiProvinceList',
                                                    type: 'E_GET'
                                                }}
                                                refresh={PlaceOfIssuanceOfIdentityCard.refresh}
                                                textField="ProvinceName"
                                                autoBind={true}
                                                valueField="ID"
                                                filter={true}
                                                filterServer={false}
                                                value={PlaceOfIssuanceOfIdentityCard.value}
                                                disable={PlaceOfIssuanceOfIdentityCard.disable}
                                                onFinish={item =>
                                                    this.setState({
                                                        Identification: {
                                                            ...this.state.Identification,
                                                            PlaceOfIssuanceOfIdentityCard: {
                                                                ...this.state.Identification
                                                                    .PlaceOfIssuanceOfIdentityCard,
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

                                {/* DependantPassportPlaceOfIssue */}
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
                                            <VnrPickerQuickly
                                                api={{
                                                    urlApi: '[URI_HR]/Cat_GetData/GetMultiProvinceList',
                                                    type: 'E_GET'
                                                }}
                                                autoBind={true}
                                                refresh={DependantPassportPlaceOfIssue.refresh}
                                                textField="ProvinceName"
                                                valueField="ID"
                                                filter={true}
                                                filterServer={false}
                                                value={DependantPassportPlaceOfIssue.value}
                                                disable={DependantPassportPlaceOfIssue.disable}
                                                onFinish={item =>
                                                    this.setState({
                                                        RelativesPassport: {
                                                            ...this.state.RelativesPassport,
                                                            DependantPassportPlaceOfIssue: {
                                                                ...this.state.RelativesPassport.DependantIDPlaceOfIssue,
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
                                                        RelativesPassport: {
                                                            ...this.state.RelativesPassport,
                                                            DependantPassportDateOfIssue: {
                                                                ...this.state.RelativesPassport
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
                                                        RelativesPassport: {
                                                            ...this.state.RelativesPassport,
                                                            DependantPassportDateOfExpiry: {
                                                                ...this.state.RelativesPassport
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
