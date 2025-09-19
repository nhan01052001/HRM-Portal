import React, { Component } from 'react';
import { View, TouchableOpacity, TouchableWithoutFeedback, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
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
import VnrPicker from '../../../../../components/VnrPicker/VnrPicker';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import HttpService from '../../../../../utils/HttpService';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import DrawerServices from '../../../../../utils/DrawerServices';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';

const stateDefault = {
    KPIID: null,
    Proportion: '',
    loadding: false,
    Score: '',
    Notes: '',
    textShowError: '',
    Description: ''
};
export default class HreModalAddCeriteria extends Component {
    constructor(props) {
        super(props);
        this.state = {
            KPIID: null,
            Proportion: '',
            loadding: false,
            Score: '',
            Notes: '',
            textShowError: '',
            Description: ''
        };
    }

    onPickerStatusView = item => {
        this.setState({
            Status: item
        });
    };

    hideModalEdit = () => {
        const { hideModalAdd } = this.props;
        hideModalAdd();
    };

    saveOrUpdate = () => {
        const { dataRecord, reload, dataMofidy, isModify } = this.props,
            { KPIID, Score, Proportion, Notes } = this.state;
        let dataBody = null;

        //save and show loadding
        this.setState({ loadding: true, textShowError: '' });
        try {
            // chỉnh sửa
            if (isModify && dataMofidy) {
                const TaskID = dataMofidy ? dataMofidy.TaskID : '';

                dataBody = {
                    Proportion: Proportion ? Proportion : '',
                    KPIID: KPIID ? KPIID.ID : null,
                    Notes: Notes,
                    Score: Score,
                    TaskID: TaskID,
                    ID: dataMofidy.ID
                };
            } else if (dataRecord) {
                //Tạo mới
                const TaskID = dataRecord ? dataRecord.ID : '';
                dataBody = {
                    Proportion: Proportion ? Proportion : '',
                    KPIID: KPIID ? KPIID.ID : null,
                    Notes: Notes,
                    Score: Score,
                    TaskID: TaskID
                };
            } else {
                return;
            }

            HttpService.Post('[URI_HR]//api/Tas_TaskKPI', dataBody).then(res => {
                if (res && Object.keys(res).length > 0 && res.ActionStatus === 'Success') {
                    this.hideModalEdit();
                    // reload danh sach nguoi phu thuoc
                    reload();
                    setTimeout(() => {
                        isModify
                            ? ToasterSevice.showSuccess('HRM_UpdateSuccess')
                            : ToasterSevice.showSuccess('InsertSuccess');
                    }, 500);
                } else if (res && Object.keys(res).length > 0 && res.ActionStatus) {
                    this.setState({ loadding: false, textShowError: res.ActionStatus });
                } else {
                    this.hideModalEdit();
                    ToasterSevice.showWarning('Hrm_Fail');
                }
            });
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    onchangeKPIID = async Item => {
        if (Item) {
            this.setState({ loadding: true });
            try {
                let proportionByID = 0;
                const ID = Item ? Item.ID : '',
                    getByKPIID = await HttpService.Get(`[URI_HR]/api/Eva_KPI/GetById?ID=${ID}`);

                if (getByKPIID && Object.keys(getByKPIID).length > 0 && getByKPIID.ActionStatus === 'Success') {
                    proportionByID = getByKPIID.Rate;
                }
                this.setState({
                    KPIID: Item,
                    Proportion: proportionByID.toString(),
                    Description: getByKPIID.DescriptionKPIFix ? getByKPIID.DescriptionKPIFix : '',
                    loadding: false,
                    textShowError: ''
                });
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        } else {
            this.setState({ KPIID: null, Proportion: '', loadding: false });
        }
    };

    UNSAFE_componentWillReceiveProps(nexProps) {
        if (nexProps.isModify) {
            this.generateEdit(nexProps);
        } else {
            this.setState(stateDefault);
        }
    }

    generateEdit = currentProps => {
        const { isModify, dataMofidy } = currentProps;
        if (isModify && dataMofidy) {
            const _KPIID =
                dataMofidy.KPIName && dataMofidy.KPIID
                    ? {
                        ID: dataMofidy.KPIID,
                        KPIName: dataMofidy.KPIName
                    }
                    : null;
            this.setState({
                KPIID: _KPIID,
                Proportion: dataMofidy.Proportion ? `${dataMofidy.Proportion}` : '',
                Description: dataMofidy.Description ? dataMofidy.Description : '',
                Notes: dataMofidy.Notes ? dataMofidy.Notes : '',
                Score: dataMofidy.Score ? `${dataMofidy.Score}` : '',
                loadding: false,
                textShowError: ''
            });
        }
    };

    componentDidMount() {
        this.generateEdit(this.props);
    }

    render() {
        const { KPIID, Score, Proportion, Notes, loadding, textShowError, Description } = this.state,
            { modalVisible, isModify } = this.props;
        const { textLableInfo, contentViewControl, viewLable, viewControl } = stylesListPickerControl;

        let viewTitle = <VnrText style={[styleSheets.lable]} i18nKey={'HRM_Evaluation_KPI_PopUp_Create_Title'} />;

        if (isModify) {
            viewTitle = <VnrText style={[styleSheets.lable]} i18nKey={'HRM_Evaluation_KPI_PopUp_Edit_Title'} />;
        }

        return (
            <View>
                <Modal
                    onBackButtonPress={() => this.hideModalEdit()}
                    key={'@MODAL_EVALUATE'}
                    isVisible={modalVisible}
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
                    <View style={stylesModalPopupBottom.viewEditModal}>
                        <SafeAreaView
                            {...styleSafeAreaView}
                            style={styles.stySafeAreaView}
                        >
                            <KeyboardAwareScrollView
                                innerRef={ref => {
                                    this.KeyboardAwareScrollView = ref;
                                }}
                                contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                                enableOnAndroid={false}
                                keyboardShouldPersistTaps={'handled'}
                            >
                                <View style={stylesModalPopupBottom.headerCloseModal}>
                                    <View style={[stylesModalPopupBottom.titleModal]}>
                                        {viewTitle}
                                        <VnrLoading
                                            style={styles.styViewLoading}
                                            size="small"
                                            isVisible={loadding}
                                        />
                                    </View>
                                </View>

                                {textShowError ? (
                                    <View
                                        style={styles.styVIewShoeErr}
                                    >
                                        <VnrText
                                            style={[styleSheets.text, { color: Colors.warning }]}
                                            value={textShowError}
                                        />
                                    </View>
                                ) : (
                                    <View />
                                )}

                                {/* Tiêu chí - KPIID */}
                                {
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={'Hrm_Sal_EvaluationOfSalaryApprove_Criteria'}
                                            />
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPicker
                                                api={{
                                                    urlApi: '[URI_HR]/Tas_GetData/GetMultiKPIAll',
                                                    type: 'E_GET'
                                                }}
                                                textField="KPIName"
                                                valueField="ID"
                                                filter={true}
                                                filterServer={false}
                                                value={KPIID}
                                                onFinish={item => (!loadding ? this.onchangeKPIID(item) : null)}
                                            />
                                        </View>
                                    </View>
                                }
                                {/* điểm - Score */}
                                {
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'TotalMark'} />
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                value={Score}
                                                keyboardType={'numeric'}
                                                charType={'double'}
                                                returnKeyType={'done'}
                                                onChangeText={value => this.setState({ Score: value })}
                                            />
                                        </View>
                                    </View>
                                }
                                {/* Tỉ trọng - Proportion */}
                                {
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={'HRM_Tas_Task_Proportion'}
                                            />
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                ref={ref => (this.viewProportion = ref)}
                                                value={Proportion}
                                                keyboardType={'numeric'}
                                                charType={'double'}
                                                returnKeyType={'done'}
                                                onChangeText={value => this.setState({ Proportion: value })}
                                            />
                                        </View>
                                    </View>
                                }

                                {/* Ghi chú - Notes */}
                                {
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={'HRM_Sal_InsuranceSalry_Note'}
                                            />
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                ref={ref => (this.viewNote = ref)}
                                                onFocus={() => {
                                                    setTimeout(() => {
                                                        if (
                                                            Platform.OS == 'ios' &&
                                                            this.KeyboardAwareScrollView &&
                                                            typeof this.KeyboardAwareScrollView.scrollIntoView ==
                                                                'function'
                                                        ) {
                                                            this.KeyboardAwareScrollView.props.scrollIntoView(
                                                                this.viewProportion
                                                            );
                                                        }
                                                    }, 400);
                                                }}
                                                style={[
                                                    styleSheets.text,
                                                    styles.styViewInputNote
                                                ]}
                                                value={Notes}
                                                returnKeyType={'done'}
                                                multiline={true}
                                                onChangeText={value => this.setState({ Notes: value })}
                                            />
                                        </View>
                                    </View>
                                }

                                {/* Description - Mô tả */}
                                {
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={'HRM_Hre_Tas_Task_Description'}
                                            />
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                disable={true}
                                                style={[
                                                    styleSheets.text,
                                                    styles.styViewInputDes
                                                ]}
                                                value={Description}
                                                returnKeyType={'done'}
                                                multiline={true}
                                            />
                                        </View>
                                    </View>
                                }

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
                                        onPress={() => (!loadding ? this.saveOrUpdate() : null)}
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
    styViewInputDes: { minHeight: 60,
        borderWidth: 0.5,
        borderColor: Colors.grey,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    styViewInputNote: { minHeight: 60,
        borderWidth: 0.5,
        borderColor: Colors.grey,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    styVIewShoeErr: { justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10 },
    styViewLoading: { height: 'auto',
        width: 'auto',
        marginLeft: 10
    },
    stySafeAreaView: { flex: 1,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    }
})