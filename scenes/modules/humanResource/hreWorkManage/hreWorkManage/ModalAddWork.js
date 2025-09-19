import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal } from 'react-native';
import {
    styleSheets,
    styleValid,
    Size,
    Colors,
    stylesVnrPickerV3,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import HttpService from '../../../../../utils/HttpService';
import DrawerServices from '../../../../../utils/DrawerServices';
import { translate } from '../../../../../i18n/translate';
import { IconCancel, IconUser } from '../../../../../constants/Icons';
import VnrSuperFilterWithTextInput from '../../../../../componentsV3/VnrSuperFilterWithTextInput/VnrSuperFilterWithTextInput';
import VnrDate from '../../../../../componentsV3/VnrDate/VnrDate';
import VnrTextInput from '../../../../../componentsV3/VnrTextInput/VnrTextInput';
import VnrText from '../../../../../components/VnrText/VnrText';
import moment from 'moment';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import { EnumName, EnumIcon } from '../../../../../assets/constant';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { ToasterInModal } from '../../../../../components/Toaster/Toaster';
import ModalSearch from './ModalSearch';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import Color from 'color';

const initSateDefault = {
    ImplementerID: {
        label: 'HRM_PortalApp_HreWorkManage_Implementer',
        disable: false,
        refresh: false,
        value: [],
        visible: true,
        visibleConfig: true
    },

    DateEnd: {
        label: 'HRM_PortalApp_HreWorkManage_Deadline',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    Note: {
        lable: 'HRM_PortalApp_Notes',
        visible: true,
        visibleConfig: true,
        disable: false,
        value: '',
        refresh: false
    },
    Type: null,
    ID: null
};
class ModalAddWork extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowModal: false,
            work: null,
            ...initSateDefault
        };

        this.ToasterSevice = {
            showError: null,
            showSuccess: null,
            showWarning: null,
            showInfo: null
        };

        this.refModalSearch = null;
    }

    onShow = (item, type = 'E_NEW', dataModify) => {
        if (!dataModify) {
            this.setState({
                isShowModal: true,
                work: item,
                Type: type
            });
        } else {
            const { ImplementerID, Note, DateEnd } = this.state;

            let nextState = {
                ID: dataModify?.ID,
                ImplementerID: {
                    ...ImplementerID,
                    value: dataModify?.ImplementerID
                        ? [
                            {
                                ID: dataModify?.ImplementerID,
                                ProfileName: dataModify?.ImplementerName,
                                ImagePath: dataModify?.ImplementerImagePath
                            }
                        ]
                        : [],
                    refresh: !ImplementerID.refresh
                },
                DateEnd: {
                    ...DateEnd,
                    value: dataModify?.ColorDate ? dataModify?.ColorDate : null,
                    refresh: !DateEnd.refresh
                },
                Note: {
                    ...Note,
                    value: dataModify?.Note ? dataModify?.Note : '',
                    refresh: !Note.refresh
                }
            };
            this.setState({
                ...nextState,
                isShowModal: true,
                work: item,
                Type: type
            });
        }
    };

    onHide = (isFisnish) => {
        AlertSevice.alert({
            iconType: EnumIcon.E_WARNING,
            title: translate('HRM_PortalApp_HreWorkManage_CancelWork'),
            message: `${translate('HRM_PortalApp_HreWorkManage_AskBeforeDelete')} \n${translate(
                'HRM_PortalApp_HreWorkManage_AreYouSureExit'
            )}`,
            onCancel: () => {},
            onConfirm: () => {
                this.setState(
                    {
                        isShowModal: false
                    },
                    () => {
                        if (isFisnish) {
                            this.props?.onFisnish();
                        }
                    }
                );
            }
        });
    };

    handleAddData = () => {
        try {
            const { work, ImplementerID, DateEnd, Note, Type, ID } = this.state;
            if (ImplementerID.value.length === 0) {
                this.ToasterSevice.showWarning('HRM_PortalApp_HreWorkManage_PleaseChooseImplementer');
            } else {
                const profileInfo = dataVnrStorage
                    ? dataVnrStorage.currentUser
                        ? dataVnrStorage.currentUser.info
                        : null
                    : null;

                if (profileInfo?.ProfileID) {
                    let params = {
                        DateEnd: DateEnd?.value ? moment(DateEnd?.value).format('YYYY/MM/DD') : null,
                        IsCreate: true,
                        IsManager: true,
                        Note: Note.value,
                        Type: Type,
                        ProfileID: profileInfo?.ProfileID,
                        ImplementerID: ImplementerID.value[0]?.ID,
                        WorkListID: work?.ID
                    };

                    // modify
                    if (ID) {
                        params = {
                            ...params,
                            ID
                        };
                    }

                    VnrLoadingSevices.show();
                    HttpService.Post('[URI_CENTER]/api/Hre_ProfileWorkList/CreateOrUpdateProfileWorkList', {
                        ...params
                    })
                        .then((res) => {
                            VnrLoadingSevices.hide();
                            if (res?.Status === EnumName.E_SUCCESS) {
                                this.setState(
                                    {
                                        isShowModal: false,
                                        ...initSateDefault
                                    },
                                    () => {
                                        this.props?.onFisnish();
                                    }
                                );
                            } else {
                                this.ToasterSevice.showWarning(res?.Message);
                            }
                        })
                        .catch((error) => {
                            VnrLoadingSevices.hide();
                            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                        });
                }
            }
        } catch (error) {
            VnrLoadingSevices.hide();
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (
            nextState?.isShowModal !== this.state.isShowModal ||
            (nextState?.work && this.state.work && !Vnr_Function.compare(nextState?.work, this.state.work)) ||
            nextState?.ImplementerID?.refresh !== this.state.ImplementerID.refresh ||
            nextState?.DateEnd?.refresh !== this.state.DateEnd.refresh ||
            nextState?.Note?.refresh !== this.state.Note.refresh ||
            nextState?.Type !== this.state.Type ||
            nextState?.ID !== this.state.ID
        ) {
            return true;
        }
        return false;
    }

    render() {
        const { ID, isShowModal, Type, work, ImplementerID, DateEnd, Note } = this.state;

        return (
            <Modal animationType="fade" transparent={true} visible={isShowModal} onRequestClose={() => {}}>
                <ToasterInModal
                    ref={(refs) => {
                        this.ToasterSevice = refs;
                    }}
                />
                <ModalSearch
                    type={Type}
                    ref={(ref) => {
                        this.refModalSearch = ref;
                    }}
                    onFisnish={(item) => {
                        this.setState({
                            work: item
                        });
                    }}
                />
                <View style={styles.modal}>
                    <TouchableOpacity
                        onPress={() => {
                            this.onHide();
                        }}
                        style={CustomStyleSheet.flex(0.3)}
                    />
                    <View style={styles.containerDisplay}>
                        <View style={styles.container}>
                            <TouchableOpacity
                                disabled={ID ? false : true}
                                onPress={() => {
                                    this.refModalSearch.onShow(Type, work);
                                }}
                            >
                                <Text
                                    style={[
                                        styleSheets.lable,
                                        CustomStyleSheet.fontSize(16),
                                        ID && styles.styYexyWotkListCode
                                    ]}
                                >
                                    {work?.WorkListCodeName}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    this.onHide();
                                }}
                                style={CustomStyleSheet.paddingHorizontal(6)}
                            >
                                <IconCancel size={24} color={Colors.black} />
                            </TouchableOpacity>
                        </View>

                        <View>
                            <VnrSuperFilterWithTextInput
                                lable={ImplementerID.label}
                                value={ImplementerID.value}
                                onFinish={(listItem) => {
                                    this.setState({
                                        ImplementerID: {
                                            ...ImplementerID,
                                            value: listItem,
                                            refresh: !ImplementerID.refresh
                                        }
                                    });
                                }}
                                refresh={ImplementerID.refresh}
                                api={{
                                    urlApi: '[URI_CENTER]/api/Hre_ProfileLoadControlShared/GetProfileMultiEntities',
                                    type: 'E_GET'
                                }}
                                filterParams={'text'}
                                textField={'ProfileName'}
                                valueField={'ID'}
                                filter={true}
                                filterServer={true}
                                response={'string'}
                                fieldName={'ID'}
                                placeholder={'SELECT_ITEM'}
                                isChooseOne={true}
                                licensedDisplay={[
                                    {
                                        Name: ['ProfileName'],
                                        Avatar: ['ImagePath'],
                                        UnderName: ['OrgStructureName', 'HRM_Cat_HeadCountSum_OrgStructureID']
                                    }
                                ]}
                            >
                                <View style={styles.chil_controlVnrSuperTextInput}>
                                    <View style={styles.chil_controlVnrSuperTextInput_left}>
                                        <View>
                                            <IconUser size={24} color={Colors.black} />
                                        </View>
                                        <Text
                                            numberOfLines={2}
                                            style={[styleSheets.lable, styles.styTextImpLabel]}
                                        >
                                            {translate(ImplementerID.label)}
                                            <VnrText style={[styleSheets.text, styleValid]} i18nKey={'*'} />
                                        </Text>
                                    </View>
                                    <View style={styles.chil_controlVnrSuperTextInput_right}>
                                        {ImplementerID.value.length === 0 ? (
                                            <Text
                                                style={[
                                                    styleSheets.lable,
                                                    { fontSize: Size.text + 1, color: Colors.gray_6 }
                                                ]}
                                            >
                                                {translate('SELECT_ITEM')}
                                            </Text>
                                        ) : (
                                            <View style={styles.flex_Row_Ali_Center}>
                                                {Vnr_Function.renderAvatarCricleByName(
                                                    ImplementerID.value[0]?.ImagePath,
                                                    ImplementerID.value[0]?.ProfileName,
                                                    24
                                                )}
                                                <Text
                                                    numberOfLines={2}
                                                    style={[styleSheets.lable, styles.textImplementer]}
                                                >
                                                    {ImplementerID.value[0]?.ProfileName}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </VnrSuperFilterWithTextInput>
                        </View>

                        <View>
                            <VnrDate
                                lable={DateEnd.label}
                                response={'string'}
                                format={'DD/MM/YYYY'}
                                value={DateEnd.value}
                                refresh={DateEnd.refresh}
                                type={'date'}
                                onFinish={(value) => {
                                    this.setState({
                                        DateEnd: {
                                            ...DateEnd,
                                            value: value,
                                            refresh: !DateEnd.refresh
                                        }
                                    });
                                }}
                            />
                        </View>
                        <VnrTextInput
                            fieldValid={false}
                            isCheckEmpty={false}
                            placeHolder={'HRM_PortalApp_PleaseInput'}
                            disable={Note.disable}
                            lable={Note.lable}
                            style={[
                                styleSheets.text,
                                stylesVnrPickerV3.viewInputMultiline,
                                CustomStyleSheet.paddingHorizontal(0)
                            ]}
                            multiline={true}
                            value={Note.value}
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

                        <View style={styles.wrapBtn}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.handleAddData();
                                }}
                                style={styles.btnAdd}
                            >
                                <Text style={[styleSheets.lable, { fontSize: Size.text + 1, color: Colors.white }]}>
                                    {translate('HRM_PortalApp_HreWorkManage_Add')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    styTextImpLabel: { fontSize: Size.text + 1,
        maxWidth: '90%' },
    styYexyWotkListCode: { textDecorationLine: 'underline' },
    container: {
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.gray_2
    },

    wrapBtn: {
        width: '100%',
        paddingVertical: 12,
        paddingHorizontal: 16
    },

    btnAdd: {
        width: '100%',
        paddingVertical: 8,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center'
    },

    modal: {
        flex: 1,
        backgroundColor: Color.rgb(38, 38, 38, 0.5)
    },

    containerDisplay: {
        flex: 0.7,
        backgroundColor: Colors.white
    },

    chil_controlVnrSuperTextInput: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    chil_controlVnrSuperTextInput_left: {
        flex: 1,
        maxWidth: '50%',
        flexDirection: 'row',
        alignItems: 'center'
    },

    chil_controlVnrSuperTextInput_right: {
        flex: 1,
        maxWidth: '50%',
        alignItems: 'flex-end'
    },

    flex_Row_Ali_Center: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    textImplementer: {
        fontSize: Size.text + 1,
        marginLeft: 6,
        color: Colors.blue,
        maxWidth: '90%'
    }
});

export default ModalAddWork;
