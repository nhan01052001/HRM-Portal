import React, { Component } from 'react';
import { View, TouchableOpacity, TouchableWithoutFeedback, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    Colors,
    styleSafeAreaView,
    stylesListPickerControl,
    stylesModalPopupBottom,
    stylesScreenDetailV3,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import Modal from 'react-native-modal';
import VnrText from '../../../../../components/VnrText/VnrText';
import HttpService from '../../../../../utils/HttpService';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import moment from 'moment';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import VnrAttachFile from '../../../../../components/VnrAttachFile/VnrAttachFile';
import DrawerServices from '../../../../../utils/DrawerServices';

export default class EvaModalEditTarger extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listUserDependant: null,
            loadding: false,
            Comment: '',
            Score: '',
            Target: '',
            Actual: '',
            Times: '',
            FileAttach: {
                value: null,
                refresh: false,
                disable: false
            }
        };
        this.KeyboardAwareScrollView = null;
    }

    onPickerStatusView = (item) => {
        this.setState({
            Status: item
        });
    };

    hideModalEdit = () => {
        const { hideModalEdit } = this.props;
        hideModalEdit();
    };

    saveUpdate = () => {
        try {
            const { dataRecord, reload } = this.props,
                { Score, Comment, Actual, Target, Times, FileAttach } = this.state;

            if (!dataRecord) {
                return;
            }

            this.setState({ loadding: true });
            // save
            const dataBody = [
                    {
                        Comment: Comment,
                        DateEvaluation: dataRecord.DateEvaluation
                            ? moment(dataRecord.DateEvaluation).format('"YYYY-MM-DD HH:mm:ss"')
                            : null,
                        EvaluatorID: dataVnrStorage.currentUser.info.ProfileID,
                        FileAttach: FileAttach.value ? FileAttach.value.map((item) => item.fileName).join(',') : null,
                        ID: dataRecord.ID,
                        IsPortal: true,
                        Score: Score ? parseFloat(Score) : null,
                        Target: Target ? parseFloat(Target) : null,
                        Actual: Actual ? parseFloat(Actual) : null,
                        Times: Times ? parseFloat(Times) : null,
                        UserSubmit: dataVnrStorage.currentUser.info.ProfileID
                    }
                ],
                dataRecordUpdate = { ...dataRecord, ...dataBody[0] };

            HttpService.Post('[URI_HR]/Eva_GetData/SaveEditFormCriteria', dataBody).then((res) => {
                if (res && res.success) {
                    this.setState({ loadding: false });
                    this.hideModalEdit();
                    setTimeout(() => {
                        ToasterSevice.showSuccess('Hrm_Succeed');
                    }, 100);
                    // reload danh sach
                    reload(dataRecordUpdate);
                } else if (res && res.messageNotify && typeof res.messageNotify === 'string') {
                    this.setState({ loadding: false, textShowError: res.messageNotify });
                } else {
                    this.hideModalEdit();
                    ToasterSevice.showWarning('Hrm_Fail');
                }
            });
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    onChangeTaskDependant = (Item) => {
        this.setState({ listUserDependant: Item });
    };

    initControlFromCaculation = () => {
        const { dataRecord } = this.props,
            { textLableInfo, contentViewControl, viewLable, viewControl } = stylesListPickerControl,
            { Score, Actual, Target, Times } = this.state;
        if (!dataRecord) return;

        let controlView = <View />;
        if (dataRecord.FormOfCaculation === 'E_SATISFACTORYDAYRATE') {
            controlView = (
                <View>
                    <View style={contentViewControl}>
                        <View style={viewLable}>
                            <VnrText
                                style={[styleSheets.text, textLableInfo]}
                                i18nKey={'HRM_Evaluation_PerformanceDetail_Value'}
                            />
                        </View>

                        <View style={viewControl}>
                            <VnrTextInput
                                disable={true}
                                value={Target}
                                keyboardType={'numeric'}
                                charType={'double'}
                                returnKeyType={'done'}
                                onChangeText={(value) => this.setState({ Target: value })}
                            />
                        </View>
                    </View>
                    <View style={contentViewControl}>
                        <View style={viewLable}>
                            <VnrText
                                style={[styleSheets.text, textLableInfo]}
                                i18nKey={'HRM_Evaluation_PerformanceDetail_Value2'}
                            />
                        </View>

                        <View style={viewControl}>
                            <VnrTextInput
                                ref={(ref) => (this.viewCaculation = ref)}
                                //placeholder={}
                                value={Actual}
                                keyboardType={'numeric'}
                                charType={'double'}
                                returnKeyType={'done'}
                                onChangeText={(value) => this.setState({ Actual: value })}
                            />
                        </View>
                    </View>
                </View>
            );
        } else if (dataRecord.FormOfCaculation === 'E_SCORE') {
            controlView = (
                <View style={contentViewControl}>
                    <View style={viewLable}>
                        <VnrText
                            style={[styleSheets.text, textLableInfo]}
                            i18nKey={'HRM_Evaluation_PerformanceDetail_Mark'}
                        />
                    </View>

                    <View style={viewControl}>
                        <VnrTextInput
                            ref={(ref) => (this.viewCaculation = ref)}
                            value={Score}
                            keyboardType={'numeric'}
                            charType={'double'}
                            returnKeyType={'done'}
                            onChangeText={(value) => this.setState({ Score: value })}
                        />
                    </View>
                </View>
            );
        } else if (dataRecord.FormOfCaculation === 'E_TIMES') {
            controlView = (
                <View style={contentViewControl}>
                    <View style={viewLable}>
                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'FormOfCalculation__E_TIMES'} />
                    </View>

                    <View style={viewControl}>
                        <VnrTextInput
                            ref={(ref) => (this.viewCaculation = ref)}
                            value={Times}
                            keyboardType={'numeric'}
                            charType={'double'}
                            returnKeyType={'done'}
                            onChangeText={(value) => this.setState({ Times: value })}
                        />
                    </View>
                </View>
            );
        }
        return controlView;
    };

    initDataEdit = () => {
        const { dataRecord } = this.props,
            { FileAttach } = this.state;

        this.setState({
            FileAttach: {
                ...FileAttach,
                value: dataRecord.lstFileAttach ? dataRecord.lstFileAttach : null,
                refresh: !FileAttach.refresh
            },
            Comment: dataRecord && dataRecord.Comment != null ? dataRecord.Comment : '',
            Score: dataRecord && dataRecord.Score != null ? `${dataRecord.Score}` : '',
            Target: dataRecord && dataRecord.Target != null ? `${dataRecord.Target}` : '',
            Actual: dataRecord && dataRecord.Actual != null ? `${dataRecord.Actual}` : '',
            Times: dataRecord && dataRecord.Times != null ? `${dataRecord.Times}` : ''
        });
    };

    componentDidMount() {
        this.initDataEdit();
    }

    render() {
        const { Comment, textShowError, loadding, FileAttach } = this.state,
            { modalEditVisible, dataRecord } = this.props;
        const { textLableInfo, contentViewControl, viewLable, viewControl } = stylesListPickerControl;

        return (
            <View>
                <Modal
                    onBackButtonPress={() => this.hideModalEdit()}
                    key={'@MODAL_EDIT_TARGET'}
                    isVisible={modalEditVisible}
                    onBackdropPress={() => this.hideModalEdit()}
                    customBackdrop={
                        <TouchableWithoutFeedback onPress={() => this.hideModalEdit()}>
                            <View style={stylesScreenDetailV3.modalBackdrop} />
                        </TouchableWithoutFeedback>
                    }
                    style={CustomStyleSheet.margin(0)}
                >
                    <View style={[stylesModalPopupBottom.viewEditModal]}>
                        <SafeAreaView {...styleSafeAreaView} style={styles.stySafeAreaView}>
                            <KeyboardAwareScrollView
                                innerRef={(ref) => {
                                    this.KeyboardAwareScrollView = ref;
                                }}
                                contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                                enableOnAndroid={false}
                                keyboardShouldPersistTaps={'handled'}
                            >
                                <View style={stylesModalPopupBottom.headerCloseModal}>
                                    <View style={stylesModalPopupBottom.titleModal}>
                                        <VnrText
                                            style={[styleSheets.lable]}
                                            i18nKey={'HRM_Tas_SampleTaskKPI_PopUp_Edit_Title'}
                                        />
                                        <VnrLoading
                                            style={styles.styViewLoadingSmall}
                                            size="small"
                                            isVisible={loadding}
                                        />
                                    </View>
                                </View>
                                {textShowError ? (
                                    <View style={styles.styViewShowErrer}>
                                        <VnrText
                                            style={[styleSheets.text, { color: Colors.warning }]}
                                            value={textShowError}
                                        />
                                    </View>
                                ) : (
                                    <View />
                                )}
                                <View style={styleSheets.container}>
                                    {/* {Score,Actua,Time - điểm} */}

                                    {this.initControlFromCaculation()}

                                    {/* Ghi chú - Comment */}

                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={'HRM_Sal_InsuranceSalry_Note'}
                                            />
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                onFocus={() => {
                                                    setTimeout(() => {
                                                        if (
                                                            Platform.OS == 'ios' &&
                                                            this.KeyboardAwareScrollView &&
                                                            typeof this.KeyboardAwareScrollView.scrollIntoView ==
                                                                'function'
                                                        ) {
                                                            this.KeyboardAwareScrollView.scrollIntoView(
                                                                this.viewCaculation
                                                            );
                                                        }
                                                    }, 400);
                                                }}
                                                value={Comment}
                                                returnKeyType={'done'}
                                                height={60}
                                                multiline={true}
                                                onChangeText={(value) => this.setState({ Comment: value })}
                                            />
                                        </View>
                                    </View>

                                    {/* file  - AttachFile */}
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={'HRM_Rec_JobVacancy_FileAttachment'}
                                            />
                                        </View>
                                        <View style={viewControl}>
                                            <VnrAttachFile
                                                key={dataRecord ? dataRecord.ID : `${Math.random()}`}
                                                disable={FileAttach.disable}
                                                refresh={FileAttach.refresh}
                                                value={FileAttach.value}
                                                multiFile={true}
                                                uri={'[URI_POR]/New_Home/saveFileFromApp'}
                                                onFinish={(file) => {
                                                    this.setState({
                                                        FileAttach: {
                                                            ...FileAttach,
                                                            value: file
                                                        }
                                                    });
                                                }}
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
                                        onPress={() => {
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
    styViewShowErrer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },
    styViewLoadingSmall: {
        height: 'auto',
        width: 'auto',
        marginLeft: 10
    },
    stySafeAreaView: {
        flex: 1,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    }
});
