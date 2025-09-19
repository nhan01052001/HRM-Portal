import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    styleSafeAreaView,
    stylesListPickerControl,
    Size,
    Colors,
    styleButtonAddOrEdit,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import VnrText from '../../../../../components/VnrText/VnrText';
import { IconPublish, IconPrev } from '../../../../../constants/Icons';
import HttpService from '../../../../../utils/HttpService';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { connect } from 'react-redux';
import evaPerformanceEvaDataResultV3 from '../../../../../redux/evaPerformanceEvaDataResultV3';
import DrawerServices from '../../../../../utils/DrawerServices';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { EnumIcon } from '../../../../../assets/constant';
class EvaPerformanceGeneral extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            dataItem: null,
            Strengths: {
                value: ''
            },
            Weaknesses: {
                value: ''
            },
            ResultNote: {
                value: ''
            },
            updateData: {}
        };
    }

    reloadRecord = () => {
        const _params = this.props.navigation.state.params,
            { dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
            { fetchGetById } = this.props;
        fetchGetById(dataItem ? dataItem.ID : '');
    };

    getDataItem = () => {
        try {
            const _params = this.props.navigation.state.params,
                { dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                { fetchGetById } = this.props;
            if (!Vnr_Function.CheckIsNullOrEmpty(dataItem)) {
                // if (dataItemFormRedux && dataItemFormRedux.ID === dataItem.ID) {
                //     Strengths.value = dataItemFormRedux.Strengths ? dataItemFormRedux.Strengths : '';
                //     Weaknesses.value = dataItemFormRedux.Weaknesses ? dataItemFormRedux.Weaknesses : '';
                //     ResultNote.value = dataItemFormRedux.ResultNote ? dataItemFormRedux.ResultNote : '';

                //     this.setState({
                //         dataItem: dataItemFormRedux,
                //         Strengths,
                //         Weaknesses,
                //         ResultNote
                //     });
                // }
                // else {
                fetchGetById(dataItem ? dataItem.ID : '');
                // }
            } else {
                this.setState({ dataItem: 'EmptyData' });
            }
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    componentDidMount() {
        this.getDataItem();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { dataItemFormRedux } = nextProps,
            { Strengths, Weaknesses, ResultNote } = this.state;
        if (dataItemFormRedux) {
            Strengths.value = dataItemFormRedux.Strengths ? dataItemFormRedux.Strengths : '';
            Weaknesses.value = dataItemFormRedux.Weaknesses ? dataItemFormRedux.Weaknesses : '';
            ResultNote.value = dataItemFormRedux.ResultNote ? dataItemFormRedux.ResultNote : '';

            this.setState({
                dataItem: dataItemFormRedux,
                Strengths,
                Weaknesses,
                ResultNote,
                updateData: {}
            });
        }
    }

    onClose = () => {
        const { updateData } = this.state;
        if (updateData && Object.keys(updateData).length > 0) {
            AlertSevice.alert({
                iconType: EnumIcon.E_CONFIRM,
                message: 'HRM_HR_DoYouWantToUpdateDataBelow',
                onCancel: () => {
                    DrawerServices.navigate('EvaPerformanceEvaDataResultV3');
                },
                onConfirm: () => {
                    this.onUpdate(true);
                }
            });
        } else {
            DrawerServices.navigate('EvaPerformanceEvaDataResultV3');
        }
    };

    onUpdate = (isCloseOnSaved) => {
        const { Strengths, Weaknesses, ResultNote, updateData, dataItem } = this.state;

        if (updateData && Object.keys(updateData).length === 0) {
            ToasterSevice.showWarning('HRM_Data_Not_Change');
            return;
        }
        try {
            const dataBody = {
                ID: dataItem && dataItem.ID ? dataItem.ID : '',
                Strengths: Strengths && Strengths.value ? Strengths.value : null,
                Weaknesses: Weaknesses && Weaknesses.value ? Weaknesses.value : null,
                ResultNote: ResultNote && ResultNote.value ? ResultNote.value : null,
                ExtraInfo1: dataItem && dataItem.ExtraInfo1 ? dataItem.ExtraInfo1 : null,
                ExtraInfo2: dataItem && dataItem.ExtraInfo2 ? dataItem.ExtraInfo2 : null,
                ExtraInfo3: dataItem && dataItem.ExtraInfo3 ? dataItem.ExtraInfo3 : null,
                ExtraInfo4: dataItem && dataItem.ExtraInfo4 ? dataItem.ExtraInfo4 : null,
                ExtraInfo5: dataItem && dataItem.ExtraInfo5 ? dataItem.ExtraInfo5 : null,
                ExtraInfo6: dataItem && dataItem.ExtraInfo6 ? dataItem.ExtraInfo6 : null,
                ExtraInfo7: dataItem && dataItem.ExtraInfo7 ? dataItem.ExtraInfo7 : null,
                ExtraInfo8: dataItem && dataItem.ExtraInfo8 ? dataItem.ExtraInfo8 : null
            };
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Eva_GetData/SavePerformanceEvaDataResultV3', dataBody).then((res) => {
                VnrLoadingSevices.hide();
                if (res && Object.keys(res).length > 0 && res.success) {
                    ToasterSevice.showSuccess('Hrm_Succeed');
                    // xac nhận lưu và đóng
                    if (isCloseOnSaved) {
                        DrawerServices.navigate('EvaPerformanceEvaDataResultV3');
                    } else {
                        this.reloadRecord();
                    }
                } else if (res && Object.keys(res).length > 0 && res.messageNotify) {
                    ToasterSevice.showWarning(res.messageNotify);
                } else {
                    ToasterSevice.showWarning('Hrm_Fail');
                }
            });
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    // kiem tra dữ liệu có thay đổi không
    onChangeText = (text, key) => {
        const { dataItem, updateData } = this.state;
        if (dataItem && dataItem[key] && text === dataItem[key]) {
            updateData[key] && delete updateData[key];
            this.setState({
                [key]: {
                    ...this.state[key],
                    value: text
                },
                updateData
            });
        } else {
            this.setState({
                [key]: {
                    ...this.state[key],
                    value: text
                },
                updateData: { ...updateData, [key]: text }
            });
        }
    };

    render() {
        const { Strengths, Weaknesses, ResultNote } = this.state,
            { textLableInfo, contentViewControl, viewLable, viewControl } = stylesListPickerControl;
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container]}>
                    <KeyboardAwareScrollView
                        extraScrollHeight={70} // khoan cach
                        contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                        keyboardShouldPersistTaps={'handled'}
                    >
                        {/* Điểm mạnh - Strengths */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText
                                    style={[styleSheets.text, textLableInfo]}
                                    i18nKey={'HRM_Evaluation_Performance_Strengths'}
                                />
                            </View>

                            <View style={viewControl}>
                                <VnrTextInput
                                    height={70}
                                    value={Strengths.value}
                                    onChangeText={(text) => this.onChangeText(text, 'Strengths')}
                                    multiline={true}
                                    numberOfLines={5}
                                    returnKeyType={'done'}
                                />
                            </View>
                        </View>

                        {/* Điểm yếu - Weaknesses */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText
                                    style={[styleSheets.text, textLableInfo]}
                                    i18nKey={'HRM_Evaluation_Performance_Weaknesses'}
                                />
                            </View>

                            <View style={viewControl}>
                                <VnrTextInput
                                    height={70}
                                    value={Weaknesses.value}
                                    onChangeText={(text) => this.onChangeText(text, 'Weaknesses')}
                                    multiline={true}
                                    numberOfLines={5}
                                    returnKeyType={'done'}
                                />
                            </View>
                        </View>

                        {/* Đánh giá - ResultNote */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText
                                    style={[styleSheets.text, textLableInfo]}
                                    i18nKey={'HRM_Tas_Task_Evaluation'}
                                />
                            </View>

                            <View style={viewControl}>
                                <VnrTextInput
                                    height={70}
                                    value={ResultNote.value}
                                    onChangeText={(text) => this.onChangeText(text, 'ResultNote')}
                                    multiline={true}
                                    numberOfLines={5}
                                    returnKeyType={'done'}
                                />
                            </View>
                        </View>
                    </KeyboardAwareScrollView>

                    <View style={styleButtonAddOrEdit.groupButton}>
                        <TouchableOpacity onPress={() => this.onClose()} style={styleButtonAddOrEdit.btnClose}>
                            <IconPrev size={Size.iconSize} color={Colors.black} />
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
                            onPress={() => this.onUpdate()}
                            style={styleButtonAddOrEdit.groupButton__button_save}
                        >
                            <IconPublish size={Size.iconSize} color={Colors.white} />
                            <VnrText
                                style={[styleSheets.lable, styleButtonAddOrEdit.groupButton__text]}
                                i18nKey={'HRM_Common_Save'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const mapStateToProps = (state) => {
    return { dataItemFormRedux: state.evaPerformanceEvaDataResultV3.data };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchGetById: (ID) => {
            dispatch(evaPerformanceEvaDataResultV3.actions.fetchGetById(ID));
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(EvaPerformanceGeneral);
