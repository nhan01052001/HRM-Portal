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

class EvaPerformanceOrther extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            dataItem: null,
            ExtraInfo1: {
                value: ''
            },
            ExtraInfo2: {
                value: ''
            },
            ExtraInfo3: {
                value: ''
            },
            ExtraInfo4: {
                value: ''
            },
            ExtraInfo5: {
                value: ''
            },
            ExtraInfo6: {
                value: ''
            },
            ExtraInfo7: {
                value: ''
            },
            ExtraInfo8: {
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
                //     ExtraInfo1.value = dataItemFormRedux.ExtraInfo1 ? dataItemFormRedux.ExtraInfo1 : '';
                //     ExtraInfo2.value = dataItemFormRedux.ExtraInfo2 ? dataItemFormRedux.ExtraInfo2 : '';
                //     ExtraInfo3.value = dataItemFormRedux.ExtraInfo3 ? dataItemFormRedux.ExtraInfo3 : '';
                //     ExtraInfo4.value = dataItemFormRedux.ExtraInfo4 ? dataItemFormRedux.ExtraInfo4 : '';
                //     ExtraInfo5.value = dataItemFormRedux.ExtraInfo5 ? dataItemFormRedux.ExtraInfo5 : '';
                //     ExtraInfo6.value = dataItemFormRedux.ExtraInfo6 ? dataItemFormRedux.ExtraInfo6 : '';
                //     ExtraInfo7.value = dataItemFormRedux.ExtraInfo7 ? dataItemFormRedux.ExtraInfo7 : '';
                //     ExtraInfo8.value = dataItemFormRedux.ExtraInfo8 ? dataItemFormRedux.ExtraInfo8 : '';
                //     this.setState({
                //         dataItem: dataItemFormRedux,
                //         ExtraInfo1,
                //         ExtraInfo2,
                //         ExtraInfo3,
                //         ExtraInfo4,
                //         ExtraInfo5,
                //         ExtraInfo6,
                //         ExtraInfo7,
                //         ExtraInfo8
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
            { ExtraInfo1, ExtraInfo2, ExtraInfo3, ExtraInfo4, ExtraInfo5, ExtraInfo6, ExtraInfo7, ExtraInfo8 } =
                this.state;
        if (dataItemFormRedux) {
            ExtraInfo1.value = dataItemFormRedux.ExtraInfo1 ? dataItemFormRedux.ExtraInfo1 : '';
            ExtraInfo2.value = dataItemFormRedux.ExtraInfo2 ? dataItemFormRedux.ExtraInfo2 : '';
            ExtraInfo3.value = dataItemFormRedux.ExtraInfo3 ? dataItemFormRedux.ExtraInfo3 : '';
            ExtraInfo4.value = dataItemFormRedux.ExtraInfo4 ? dataItemFormRedux.ExtraInfo4 : '';
            ExtraInfo5.value = dataItemFormRedux.ExtraInfo5 ? dataItemFormRedux.ExtraInfo5 : '';
            ExtraInfo6.value = dataItemFormRedux.ExtraInfo6 ? dataItemFormRedux.ExtraInfo6 : '';
            ExtraInfo7.value = dataItemFormRedux.ExtraInfo7 ? dataItemFormRedux.ExtraInfo7 : '';
            ExtraInfo8.value = dataItemFormRedux.ExtraInfo8 ? dataItemFormRedux.ExtraInfo8 : '';

            this.setState({
                dataItem: dataItemFormRedux,
                ExtraInfo1,
                ExtraInfo2,
                ExtraInfo3,
                ExtraInfo4,
                ExtraInfo5,
                ExtraInfo6,
                ExtraInfo7,
                ExtraInfo8,
                updateData: {}
            });
        }
    }

    onUpdate = (isCloseOnSaved) => {
        const {
            ExtraInfo1,
            ExtraInfo2,
            ExtraInfo3,
            ExtraInfo4,
            ExtraInfo5,
            ExtraInfo6,
            ExtraInfo7,
            ExtraInfo8,
            updateData,
            dataItem
        } = this.state;

        if (updateData && Object.keys(updateData).length === 0) {
            ToasterSevice.showWarning('HRM_Data_Not_Change');
            return;
        }

        try {
            const dataBody = {
                ID: dataItem && dataItem.ID ? dataItem.ID : '',
                Strengths: dataItem && dataItem.Strengths ? dataItem.Strengths : null,
                Weaknesses: dataItem && dataItem.Weaknesses ? dataItem.Weaknesses : null,
                ResultNote: dataItem && dataItem.ResultNote ? dataItem.ResultNote : null,
                ExtraInfo1: ExtraInfo1 && ExtraInfo1.value ? ExtraInfo1.value : null,
                ExtraInfo2: ExtraInfo2 && ExtraInfo2.value ? ExtraInfo2.value : null,
                ExtraInfo3: ExtraInfo3 && ExtraInfo3.value ? ExtraInfo3.value : null,
                ExtraInfo4: ExtraInfo4 && ExtraInfo4.value ? ExtraInfo4.value : null,
                ExtraInfo5: ExtraInfo5 && ExtraInfo5.value ? ExtraInfo5.value : null,
                ExtraInfo6: ExtraInfo6 && ExtraInfo6.value ? ExtraInfo6.value : null,
                ExtraInfo7: ExtraInfo7 && ExtraInfo7.value ? ExtraInfo7.value : null,
                ExtraInfo8: ExtraInfo8 && ExtraInfo8.value ? ExtraInfo8.value : null
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
        const { ExtraInfo1, ExtraInfo2, ExtraInfo3, ExtraInfo4, ExtraInfo5, ExtraInfo6, ExtraInfo7, ExtraInfo8 } =
                this.state,
            { textLableInfo, contentViewControl, viewLable, viewControl } = stylesListPickerControl;
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container]}>
                    <KeyboardAwareScrollView
                        extraScrollHeight={70} // khoan cach
                        contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                        keyboardShouldPersistTaps={'handled'}
                    >
                        {/*Thông tin bổ sung 1 - ExtraInfo1 */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText
                                    style={[styleSheets.text, textLableInfo]}
                                    i18nKey={'Eva_PerformanceEva_ExtraInfo1'}
                                />
                            </View>

                            <View style={viewControl}>
                                <VnrTextInput
                                    height={70}
                                    value={ExtraInfo1.value}
                                    onChangeText={(text) => this.onChangeText(text, 'ExtraInfo1')}
                                    multiline={true}
                                    numberOfLines={5}
                                    returnKeyType={'done'}
                                />
                            </View>
                        </View>

                        {/*Thông tin bổ sung 2 - ExtraInfo2 */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText
                                    style={[styleSheets.text, textLableInfo]}
                                    i18nKey={'Eva_PerformanceEva_ExtraInfo2'}
                                />
                            </View>

                            <View style={viewControl}>
                                <VnrTextInput
                                    height={70}
                                    value={ExtraInfo2.value}
                                    onChangeText={(text) => this.onChangeText(text, 'ExtraInfo2')}
                                    multiline={true}
                                    numberOfLines={5}
                                    returnKeyType={'done'}
                                />
                            </View>
                        </View>
                        {/*Thông tin bổ sung 3 - ExtraInfo3 */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText
                                    style={[styleSheets.text, textLableInfo]}
                                    i18nKey={'Eva_PerformanceEva_ExtraInfo3'}
                                />
                            </View>

                            <View style={viewControl}>
                                <VnrTextInput
                                    height={70}
                                    value={ExtraInfo3.value}
                                    onChangeText={(text) => this.onChangeText(text, 'ExtraInfo3')}
                                    multiline={true}
                                    numberOfLines={5}
                                    returnKeyType={'done'}
                                />
                            </View>
                        </View>

                        {/*Thông tin bổ sung 4 - ExtraInfo4 */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText
                                    style={[styleSheets.text, textLableInfo]}
                                    i18nKey={'Eva_PerformanceEva_ExtraInfo4'}
                                />
                            </View>

                            <View style={viewControl}>
                                <VnrTextInput
                                    height={70}
                                    value={ExtraInfo4.value}
                                    onChangeText={(text) => this.onChangeText(text, 'ExtraInfo4')}
                                    multiline={true}
                                    numberOfLines={5}
                                    returnKeyType={'done'}
                                />
                            </View>
                        </View>

                        {/*Thông tin bổ sung 5 - ExtraInfo5 */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText
                                    style={[styleSheets.text, textLableInfo]}
                                    i18nKey={'Eva_PerformanceEva_ExtraInfo5'}
                                />
                            </View>

                            <View style={viewControl}>
                                <VnrTextInput
                                    height={70}
                                    value={ExtraInfo5.value}
                                    onChangeText={(text) => this.onChangeText(text, 'ExtraInfo5')}
                                    multiline={true}
                                    numberOfLines={5}
                                    returnKeyType={'done'}
                                />
                            </View>
                        </View>

                        {/*Thông tin bổ sung 6 - ExtraInfo6 */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText
                                    style={[styleSheets.text, textLableInfo]}
                                    i18nKey={'Eva_PerformanceEva_ExtraInfo6'}
                                />
                            </View>

                            <View style={viewControl}>
                                <VnrTextInput
                                    height={70}
                                    value={ExtraInfo6.value}
                                    onChangeText={(text) => this.onChangeText(text, 'ExtraInfo6')}
                                    multiline={true}
                                    numberOfLines={5}
                                    returnKeyType={'done'}
                                />
                            </View>
                        </View>

                        {/*Thông tin bổ sung 7 - ExtraInfo7 */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText
                                    style={[styleSheets.text, textLableInfo]}
                                    i18nKey={'Eva_PerformanceEva_ExtraInfo7'}
                                />
                            </View>

                            <View style={viewControl}>
                                <VnrTextInput
                                    height={70}
                                    value={ExtraInfo7.value}
                                    onChangeText={(text) => this.onChangeText(text, 'ExtraInfo7')}
                                    multiline={true}
                                    numberOfLines={5}
                                    returnKeyType={'done'}
                                />
                            </View>
                        </View>

                        {/*Thông tin bổ sung 8 - ExtraInfo8 */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText
                                    style={[styleSheets.text, textLableInfo]}
                                    i18nKey={'Eva_PerformanceEva_ExtraInfo8'}
                                />
                            </View>

                            <View style={viewControl}>
                                <VnrTextInput
                                    height={70}
                                    value={ExtraInfo8.value}
                                    onChangeText={(text) => this.onChangeText(text, 'ExtraInfo8')}
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
export default connect(mapStateToProps, mapDispatchToProps)(EvaPerformanceOrther);
