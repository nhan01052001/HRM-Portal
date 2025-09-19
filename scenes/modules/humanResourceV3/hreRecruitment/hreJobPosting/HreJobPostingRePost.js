import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import styleComonAddOrEdit from '../../../../../constants/styleComonAddOrEdit';
import { Colors, CustomStyleSheet, Size, styleSheets } from '../../../../../constants/styleConfig';
import VnrText from '../../../../../components/VnrText/VnrText';
import { IconCancel } from '../../../../../constants/Icons';
import VnrDateFromTo from '../../../../../componentsV3/VnrDateFromTo/VnrDateFromTo';
import { translate } from '../../../../../i18n/translate';
import moment from 'moment';
import DrawerServices from '../../../../../utils/DrawerServices';
import HttpService from '../../../../../utils/HttpService';
import { EnumName } from '../../../../../assets/constant';
import { HreJobPostingBusiness } from './HreJobPostingBusiness';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import { themeStyleCalanderList } from '../../../../../constants/styleConfigV3';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';

const theme = {
    ...themeStyleCalanderList,
    todayTextColor: Colors.gray_5
}

class HreJobPostingRePost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: {
                lable: null,
                value: false,
                message: null
            },
            date: {
                lable: 'HRM_PortalApp_ExtendJobPosting',
                value: null,
                refresh: true,
                onlyChooseOneDay: true,
                onlyChooseEveryDay: false
            },
            type: null
        };

        this.refVnrDateFromTo = null;
        this.ListRecordID = [];
        this.reload = null;
    }

    onShow = (type, ListRecordID, data, reload) => {
        let nextState = {
            modal: {
                lable: 'HRM_PortalApp_RePost',
                value: true
            },
            date: {
                lable: 'HRM_PortalApp_EffectiveDateOfPosting',
                value: data?.EffectiveDateFrom && data?.EffectiveDateTo ? {
                    startDate: moment(data?.EffectiveDateFrom).format('YYYY-MM-DD'),
                    endDate: moment(data?.EffectiveDateTo).format('YYYY-MM-DD')
                } : null,
                refresh: true,
                onlyChooseOneDay: false,
                onlyChooseEveryDay: false
            }
        };

        if (type === 'E_EXPIRE') {
            nextState = {
                modal: {
                    lable: 'HRM_PortalApp_ExtendJobPosting',
                    value: true
                },
                date: {
                    lable: 'HRM_PortalApp_ExntedUntil',
                    value: null,
                    refresh: true,
                    onlyChooseOneDay: true,
                    onlyChooseEveryDay: false
                }
            };
        }

        if (type === 'E_POSTPONE') {
            nextState = {
                modal: {
                    lable: 'HRM_PortalApp_PostponeEffectiveDate',
                    value: true,
                    message: ListRecordID?.message ? ListRecordID?.message : null
                },
                date: {
                    lable: 'HRM_PortalApp_PostponeUntil',
                    value: null,
                    refresh: true,
                    onlyChooseOneDay: true,
                    onlyChooseEveryDay: false
                }
            };
        }

        this.ListRecordID = ListRecordID?.ListRecordID;
        this.reload = reload;

        this.setState({ ...nextState, type });
    }

    closeModal = () => {
        this.setState({
            modal: {
                lable: null,
                value: false
            }
        })
    }

    onConfirm = () => {
        try {

            const { type, date } = this.state;

            if (!this.ListRecordID?.length > 0 || !date.value)
                return;

            let params = {
                'ListRecordID': this.ListRecordID
            };

            if (type === 'E_EXPIRE')
                params = {
                    ...params,
                    'ActionType': 'E_EXTEND',
                    'EffectiveDateTo': moment(date.value[0]).format('YYYY-MM-DD')
                }
            else if (date.value?.startDate && date.value?.endDate)
                params = {
                    ...params,
                    'ActionType': 'E_REPOST',
                    'EffectiveDateFrom': moment(date.value?.startDate).toISOString(),
                    'EffectiveDateTo': moment(date.value?.endDate).toISOString()
                }
            else if (type === 'E_POSTPONE')
                params = {
                    ...params,
                    'ActionType': 'E_POSTPONE',
                    'EffectiveDateTo': moment(date.value[0]).format('YYYY-MM-DD')
                }

            VnrLoadingSevices.show();
            HttpService.Post('[URI_CENTER]/api/Rec_ComposePostingDetail/ComposePostingDetaiAction', { ...params }).then((res) => {
                VnrLoadingSevices.hide();
                if (res && res?.Status === EnumName.E_SUCCESS) {
                    this.setState({
                        modal: {
                            lable: null,
                            value: false
                        }
                    }, () => {
                        ToasterSevice.showSuccess('Hrm_Succeed', 5500);
                        // set true when need reloaded
                        HreJobPostingBusiness.checkForReLoadScreen['HreInProcessJobPosting'] = true;
                        if (typeof this.reload === 'function')
                            this.reload();
                    })
                }
            })
        } catch (error) {
            VnrLoadingSevices.hide();
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    }

    render() {
        const { modal, date, type } = this.state;

        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={modal.value} //isModalVisible
                style={[CustomStyleSheet.padding(0), CustomStyleSheet.margin(0)]}
                onShow={this.onShowModal}
                onRequestClose={this.closeModal}
            >
                <View style={[styleComonAddOrEdit.wrapModalApprovaLevel, CustomStyleSheet.paddingBottom(0)]}>
                    <TouchableOpacity
                        style={[styleComonAddOrEdit.bgOpacity, CustomStyleSheet.backgroundColor(Colors.black), CustomStyleSheet.opacity(0.5)]}
                        onPress={this.closeModal}
                    />
                    <View style={[CustomStyleSheet.width('100%'), CustomStyleSheet.backgroundColor(Colors.white)]}>
                        <View
                            style={styles.wrapLable}
                        >
                            <VnrText
                                style={[
                                    styleSheets.text,
                                    styleComonAddOrEdit.styRegister,
                                    styleComonAddOrEdit.fS16fW600,
                                    { color: Colors.black }
                                ]}
                                i18nKey={modal.lable}
                            />
                            <TouchableOpacity onPress={this.closeModal}>
                                <IconCancel size={22} color={Colors.black} />
                            </TouchableOpacity>
                        </View>

                        <View style={styleComonAddOrEdit.container}>
                            <VnrDateFromTo
                                theme={
                                    type === 'E_REPOST'
                                        ? {
                                            ...themeStyleCalanderList,
                                            todayTextColor: Colors.primary
                                        }
                                        : theme}
                                // minDate={moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').add('days', 1).format('YYYY-MM-DD')}
                                minDate={
                                    type === 'E_REPOST'
                                        ? moment().format('YYYY-MM-DD')
                                        : moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').add('days', 1).format('YYYY-MM-DD')
                                }
                                ref={ref => (this.refVnrDateFromTo = ref)}
                                isHiddenIcon={true}
                                placeHolder={'Phạm vi'}
                                layoutFilter={true}
                                isControll={true}
                                lable={'HRM_PortalApp_EffectiveDateOfPosting'}
                                refresh={this.state.refresh}
                                value={date?.value ? date.value : {}}
                                displayOptions={false}
                                onlyChooseEveryDay={date.onlyChooseEveryDay}
                                onlyChooseOneDay={date.onlyChooseOneDay}
                                stylePlaceholder={{ color: Colors.greySecondaryConstraint }}
                                textButtonFinish={translate('E_CONFIRM')}
                                onFinish={(value) => {
                                    this.setState({
                                        date: {
                                            ...date,
                                            value: value,
                                            refresh: !date.refresh
                                        }
                                    })
                                }}
                            />
                        </View>

                        <View
                            style={CustomStyleSheet.marginVertical(12)}
                        >
                            {
                                modal.message &&
                               <View
                                   style={styles.controlVnrDateFromTo}
                               >
                                   <Text style={[styleSheets.text, { fontSize: Size.text + 2 }, CustomStyleSheet.maxWidth('100%')]}>
                                       {translate(modal.message)}
                                   </Text>
                               </View>
                            }
                            <TouchableOpacity
                                style={styles.controlVnrDateFromTo}
                                onPress={() => {
                                    if (this.refVnrDateFromTo && this.refVnrDateFromTo.showModal) {
                                        // Show modal chọn ngày đăng ký
                                        this.refVnrDateFromTo.showModal();
                                    }
                                }}
                            >
                                <View
                                    style={[styles.wrapTextControl,
                                        (date.value?.startDate && date.value?.endDate) && CustomStyleSheet.flex(1)]}
                                >
                                    <Text
                                        style={[styleSheets.text, { fontSize: Size.text + 2 }, CustomStyleSheet.maxWidth('100%')]}
                                        numberOfLines={2}
                                    >
                                        {translate(date.lable)}
                                        <Text style={{ color: Colors.red }}>*</Text>
                                    </Text>
                                </View>
                                <View
                                    style={[styles.wrapValueControl,
                                        (date.value?.startDate && date.value?.endDate) && CustomStyleSheet.flex(1)]}
                                >
                                    {
                                        Array.isArray(date.value) && date.value.length > 0 ? (
                                            <Text
                                                style={[styleSheets.text]}
                                            >{date.value.length === 1 ? `${moment(date.value[0]).format('DD/MM/YYYY')}` : `${moment(date.value[0]).format('DD/MM/YYYY')} - ${moment(date.value[1]).format('DD/MM/YYYY')}`}</Text>
                                        ) : (date.value?.startDate && date.value?.endDate) ? (
                                            <Text
                                                style={[styleSheets.text]}
                                            >{`${moment(date.value?.startDate).format('DD/MM/YYYY')} - ${moment(date.value?.endDate).format('DD/MM/YYYY')}`}</Text>
                                        )
                                            : (
                                                <Text
                                                    style={[styleSheets.text, { color: Colors.gray_7 }]}
                                                >{translate('HRM_PortalApp_ChooseDate')}</Text>
                                            )
                                    }
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View
                            style={styles.wrapBtnConfirm}
                        >
                            <TouchableOpacity
                                style={[styles.btnConfirm,
                                    (!date?.value || Object.keys(date?.value).length === 0) && CustomStyleSheet.backgroundColor(Colors.gray_3)]}
                                onPress={this.onConfirm}
                                disabled={!date?.value || Object.keys(date?.value).length === 0}
                            >
                                <Text
                                    style={[styles.btnTextBtnConfirm,
                                        (!date?.value || Object.keys(date?.value).length === 0) && CustomStyleSheet.color(Colors.grayD1)]}
                                >{translate('E_CONFIRM')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal >
        );
    }
}

const styles = StyleSheet.create({
    wrapLable: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: Colors.gray_3
    },

    controlVnrDateFromTo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10
    },

    wrapTextControl: {
        flex: 0.6,
        flexDirection: 'row',
        alignItems: 'center'
    },

    wrapValueControl: {
        flex: 0.4,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },

    wrapBtnConfirm: {
        padding: 12,
        paddingHorizontal: 32,
        marginBottom: 12,
        borderTopColor: Colors.gray_5,
        borderTopWidth: 0.5
    },

    btnConfirm: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },

    btnTextBtnConfirm: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '400'
    }
});

export default HreJobPostingRePost;