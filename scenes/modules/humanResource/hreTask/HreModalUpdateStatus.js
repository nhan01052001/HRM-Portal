import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    Size,
    Colors,
    styleSafeAreaView,
    stylesListPickerControl,
    styleValid,
    stylesScreenDetailV3,
    CustomStyleSheet
} from '../../../../constants/styleConfig';
import Modal from 'react-native-modal';
import VnrText from '../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../components/VnrTextInput/VnrTextInput';
import VnrDate from '../../../../components/VnrDate/VnrDate';
import VnrPicker from '../../../../components/VnrPicker/VnrPicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default class HreModalUpdateStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Status: null,
            FinishDate: null,
            ActualDuration: '',
            Note: ''
        };
    }

    onPickerStatusView = item => {
        this.setState({
            Status: item
        });
    };

    hideModalEdit = () => {
        const { hideModalUpdateStatus } = this.props;
        hideModalUpdateStatus();
    };

    saveUpdate = () => {
        // https://demo13.vnresource.net:1040/api/Tas_Task
        // IsSaveAndNotice: null // luu va thong bao (bool)
        // IsSaveTaskEvaluation: true // thêm filed này để tính đánh giá (bool)

    };

    render() {
        const { TimeLogTime, isTimeLogTimeModal, Status, FinishDate, ActualDuration, Note } = this.state,
            { updateStatusVisible } = this.props;
        const {
            textLableInfo,
            contentViewControl,
            viewLable,
            viewControl
        } = stylesListPickerControl;
        return (
            <View>
                <Modal
                    onBackButtonPress={() => this.hideModalEdit()}
                    key={'@MODAL_UPDATE_STATUS'}
                    isVisible={updateStatusVisible}
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
                            style={styles.styVIewSafeView}
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
                                                i18nKey={'HRM_Common_Edit'}
                                            />
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.container}>
                                    {/* Trang thai */}
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'StatusView'} />
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPicker
                                                api={{
                                                    urlApi: '[URI_SYS]/Sys_GetData/GetEnum?text=AssignTask',
                                                    type: 'E_GET'
                                                }}
                                                textField="Text"
                                                valueField="Value"
                                                filter={true}
                                                value={Status}
                                                filterServer={false}
                                                filterParams="text"
                                                disable={false}
                                                onFinish={item => this.onPickerStatusView(item)}
                                            />
                                        </View>
                                    </View>
                                    {/* Ngay hoan thanh */}
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
                                                value={FinishDate}
                                                type={'date'}
                                                onFinish={_value => this.setState({ FinishDate: _value })}
                                            />
                                        </View>
                                    </View>
                                    {/* Thoi luong thuc te */}
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={'thoi luong thuc te ( chua có key)'}
                                            />
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                value={ActualDuration}
                                                keyboardType={'numeric'}
                                                charType={'double'}
                                                returnKeyType={'done'}
                                                onChangeText={value => {
                                                    this.setState({ ActualDuration: value });
                                                }}
                                                // onBlur={this.onChangeRegisterHours}
                                                // onSubmitEditing={this.onChangeRegisterHours}
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
                                            //this.hideModalEdit();
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

                    {isTimeLogTimeModal && (
                        <VnrDate
                            autoShowModal={true}
                            hideControl={true}
                            value={TimeLogTime.value}
                            refresh={TimeLogTime.refresh}
                            format={'HH:mm'}
                            type={'time'}
                            onFinish={value => {
                                this.setState({
                                    TimeLogTime: {
                                        ...TimeLogTime,
                                        value: value ? value : null
                                    },
                                    isTimeLogTimeModal: false
                                });
                            }}
                            onCancel={() => this.setState({ isTimeLogTimeModal: false })}
                        />
                    )}
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    styVIewSafeView: { flex: 1,
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
        height: Size.deviceheight * 0.5,
        width: Size.deviceWidth,
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
        // paddingBottom:70,
        // flex:1
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
        minHeight: 40,
        borderWidth: 0.2,
        borderColor: Colors.grey,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 10
    }
});
