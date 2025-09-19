import React, { Component } from 'react';
import { View, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    Size,
    Colors,
    styleSafeAreaView,
    stylesListPickerControl,
    stylesModalPopupBottom,
    styleValid,
    stylesScreenDetailV3,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import Modal from 'react-native-modal';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrPickerMulti from '../../../../../components/VnrPickerMulti/VnrPickerMulti';
import HttpService from '../../../../../utils/HttpService';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import DrawerServices from '../../../../../utils/DrawerServices';
import { translate } from '../../../../../i18n/translate';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';

export default class HreModalAddDependant extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listUserDependant: null,
            loadding: false
        };
    }

    onPickerStatusView = item => {
        this.setState({
            Status: item
        });
    };

    hideModalEdit = () => {
        const { hideModaldependant } = this.props;
        hideModaldependant();
    };

    saveUpdate = () => {
        const { dataRecord, reload } = this.props,
            { listUserDependant } = this.state;

        if (!listUserDependant) {
            this.setState({
                textShowError: `${translate('SELECT_ITEM')} ${translate('HRM_Tas_Task_PersonsConcerned')}`
            });
            return;
        }
        if (!dataRecord) {
            return;
        }

        //save and show loadding
        this.setState({ loadding: true, textShowError: '' });
        try {
            let listDependantID = listUserDependant.map(item => item.ID);
            let dataBody = {
                TaskID: dataRecord.ID ? dataRecord.ID : '',
                ProfileIDs: listDependantID && listDependantID.length > 0 ? listDependantID.join(',') : ''
            };
            HttpService.Post('[URI_HR]/api/Tas_PersonsConcerned', dataBody).then(res => {
                if (res && Object.keys(res).length > 0 && res.ActionStatus === 'Success') {
                    this.hideModalEdit();
                    ToasterSevice.showSuccess('InsertSuccess');
                    // reload danh sach nguoi phu thuoc
                    reload();
                } else if (res && Object.keys(res).length > 0 && res.ActionStatus) {
                    this.setState({ loadding: false, textShowError: res.ActionStatus });
                } else {
                    ToasterSevice.showWarning('Hrm_Fail');
                }
            });
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    onChangeTaskDependant = Item => {
        this.setState({ listUserDependant: Item, textShowError: '' });
    };

    render() {
        const { listUserDependant, loadding, textShowError } = this.state,
            { dependantModalVisible } = this.props;
        const { textLableInfo, contentViewControl, viewLable, viewControl } = stylesListPickerControl;
        return (
            <View>
                <Modal
                    onBackButtonPress={() => this.hideModalEdit()}
                    key={'@MODAL_EVALUATE'}
                    isVisible={dependantModalVisible}
                    onBackdropPress={() => this.hideModalEdit()}
                    customBackdrop={
                        <TouchableWithoutFeedback onPress={() => this.hideModalEdit()}>
                            <View
                                style={stylesScreenDetailV3.modalBackdrop}
                            />
                        </TouchableWithoutFeedback>
                    }
                    style={CustomStyleSheet.margin(0)}
                >
                    <View
                        style={[
                            stylesModalPopupBottom.viewEditModal,
                            {
                                height: Size.deviceheight * 0.4
                            }
                        ]}
                    >
                        <SafeAreaView
                            {...styleSafeAreaView}
                            style={styles.stySafeArea}
                        >
                            <KeyboardAwareScrollView
                                contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                                enableOnAndroid={false}
                                keyboardShouldPersistTaps={'handled'}
                            >
                                <View style={stylesModalPopupBottom.headerCloseModal}>
                                    <View style={stylesModalPopupBottom.titleModal}>
                                        <VnrText
                                            style={[styleSheets.lable]}
                                            i18nKey={'HRM_TAS_PersonsConcerned_Create'}
                                        />
                                        <VnrLoading
                                            style={styles.styLoadingSamll}
                                            size="small"
                                            isVisible={loadding}
                                        />
                                    </View>
                                </View>

                                <View style={styleSheets.container}>
                                    {textShowError ? (
                                        <View
                                            style={styles.styViewShowErr}
                                        >
                                            <VnrText
                                                style={[styleSheets.text, { color: Colors.warning }]}
                                                value={textShowError}
                                            />
                                        </View>
                                    ) : (
                                        <View />
                                    )}

                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={'HRM_Tas_Task_PersonsConcerned'}
                                            />
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPickerMulti
                                                api={{
                                                    urlApi:
                                                        '[URI_HR]/Hre_GetData/GetMultiProfileActive_Training_Portal',
                                                    type: 'E_POST',
                                                    dataBody: {}
                                                }}
                                                textField="ProfileName"
                                                valueField="ID"
                                                filter={true}
                                                filterServer={true}
                                                filterParams="text"
                                                value={listUserDependant}
                                                onFinish={item => (!loadding ? this.onChangeTaskDependant(item) : null)}
                                            />
                                        </View>
                                    </View>
                                </View>

                                <View style={stylesModalPopupBottom.styleViewBntApprove}>
                                    <TouchableOpacity
                                        style={stylesModalPopupBottom.bntCancel}
                                        onPress={() => this.hideModalEdit()}
                                    >
                                        <VnrText
                                            style={[styleSheets.lable, { color: Colors.black }]}
                                            i18nKey={'HRM_Common_Close'}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={stylesModalPopupBottom.bntApprove}
                                        onPress={() => (!loadding ? this.saveUpdate() : null)}
                                    >
                                        <VnrText
                                            style={[styleSheets.lable, { color: Colors.white }]}
                                            i18nKey={'HRM_Common_Save'}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </KeyboardAwareScrollView>
                        </SafeAreaView>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    styViewShowErr: { justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },
    styLoadingSamll: { height: 'auto',
        width: 'auto',
        marginLeft: 10
    },
    stySafeArea: { flex: 1,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    }
})