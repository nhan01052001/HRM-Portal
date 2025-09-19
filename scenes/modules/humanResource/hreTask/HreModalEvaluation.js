import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    Size,
    Colors,
    styleSafeAreaView,
    stylesListPickerControl,
    stylesScreenDetailV3,
    CustomStyleSheet
} from '../../../../constants/styleConfig';
import Modal from 'react-native-modal';
import VnrText from '../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../components/VnrTextInput/VnrTextInput';
import VnrDate from '../../../../components/VnrDate/VnrDate';
import Vnr_Function from '../../../../utils/Vnr_Function';
import HttpService from '../../../../utils/HttpService';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ToasterSevice } from '../../../../components/Toaster/Toaster';
import { VnrLoadingSevices } from '../../../../components/VnrLoading/VnrLoadingPages';
import moment from 'moment';
import DrawerServices from '../../../../utils/DrawerServices';

export default class HreModalEvaluation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            EvaluationDate: new Date(),
            Note: ''
        };
    }

    onPickerStatusView = item => {
        this.setState({
            Status: item
        });
    };

    hideModalEdit = () => {
        const { hideModalEvaluate } = this.props;
        hideModalEvaluate();
    };

    // Hàm lưu đánh giá
    saveUpdate = () => {
        // IsSaveAndNotice: null // luu va thong bao (bool)
        // IsSaveTaskEvaluation: true // thêm filed này để tính đánh giá (bool)
        const { evaluateData } = this.props,
            { EvaluationDate, Note } = this.state;

        if (!evaluateData) {
            return;
        }
        try {
            let dataBody = {
                ...evaluateData,
                Status: 'E_EVALUATED',
                EvaluationDate: EvaluationDate
                    ? moment(EvaluationDate).format('YYYY-MM-DD HH:mm:ss')
                    : moment().format('YYYY-MM-DD HH:mm:ss'),
                Note: Note
            };
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/api/Tas_TaskEvaluation', dataBody)
                .then(res => {
                    VnrLoadingSevices.hide();
                    if (
                        !Vnr_Function.CheckIsNullOrEmpty(res) &&
                        Object.keys(res).length > 0 &&
                        res.Score !== undefined
                    ) {
                        ToasterSevice.showSuccess('Hrm_Succeed');
                    } else if (res && typeof res === 'string') {
                        ToasterSevice.showWarning(res);
                    } else {
                        ToasterSevice.showWarning('Hrm_Fail');
                    }
                })
                .catch(() => {
                    VnrLoadingSevices.hide();
                });
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    render() {
        const { EvaluationDate, Note } = this.state,
            { evaluateModalVisible } = this.props;
        const { textLableInfo, contentViewControl, viewLable, viewControl } = stylesListPickerControl;
        return (
            <View>
                <Modal
                    onBackButtonPress={() => this.hideModalEdit()}
                    key={'@MODAL_EVALUATE'}
                    isVisible={evaluateModalVisible}
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
                    <View style={styles.viewEditModal}>
                        <SafeAreaView
                            {...styleSafeAreaView}
                            style={styles.styViewSafeArea}
                        >
                            <KeyboardAwareScrollView
                                contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                                enableOnAndroid={false}
                                keyboardShouldPersistTaps={'handled'}
                            >
                                <View style={styles.headerCloseModal}>
                                    <View style={styles.groupTitle}>
                                        <View style={styles.titleModal}>
                                            <VnrText
                                                style={[styleSheets.lable, styles.titleModal__text]}
                                                i18nKey={'HRM_System_Resource_Evaluation'}
                                            />
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.container}>
                                    {/* Ngay Danh gia */}
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={'HRM_Tas_Task_FinishDate'}
                                            />
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                format={'DD/MM/YYYY'}
                                                value={EvaluationDate}
                                                type={'date'}
                                                onFinish={_value => this.setState({ EvaluationDate: _value })}
                                            />
                                        </View>
                                    </View>

                                    {/* Mo ta */}
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={'HRM_Hre_Tas_Task_Description'}
                                            />
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                value={Note}
                                                style={[styleSheets.text, styles.txtComment]}
                                                returnKeyType={'done'}
                                                onChangeText={value => this.setState({ Note: value })}
                                                multiline={true}
                                            />
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.styleViewBntApprove}>
                                    <TouchableOpacity style={styles.bntCancel} onPress={() => this.hideModalEdit()}>
                                        <VnrText
                                            style={[styleSheets.lable, { color: Colors.black }]}
                                            i18nKey={'HRM_Common_Close'}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.bntApprove}
                                        onPress={() => {
                                            this.hideModalEdit();
                                            this.saveUpdate();
                                        }}
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
    styViewSafeArea: { flex: 1,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },
    container: {
        flex: 1
    },
    bntApprove: {
        flex: 1,
        height: 40,
        borderRadius: 15,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bntCancel: {
        width: '30%',
        height: 40,
        borderRadius: 15,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colors.black,
        borderWidth: 0.5
    },
    styleViewBntApprove: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        flex: 1,
        alignItems: 'flex-end',
        paddingVertical: 15
    },
    headerCloseModal: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: Colors.borderColor,
        borderBottomWidth: 1
    },
    viewEditModal: {
        backgroundColor: Colors.white,
        height: Size.deviceheight * 0.7,
        width: Size.deviceWidth,
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },
    groupTitle: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleModal: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleModal__text: {
        marginLeft: 13
    },
    txtComment: {
        minHeight: Size.deviceheight * 0.2,
        borderWidth: 0.5,
        borderColor: Colors.grey,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 10
    }
});
