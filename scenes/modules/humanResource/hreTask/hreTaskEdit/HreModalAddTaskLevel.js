import React, { Component } from 'react';
import { View, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from 'react-native';
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
    TaskLevelGroup: null,
    TaskLeve: null,
    Proportion: '',
    loadding: false,
    textShowError: '',
    TaskLeveIsRefresh: false,
    Description: ''
};
export default class HreModalAddTaskLevel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            TaskLevelGroup: null,
            TaskLeve: null,
            Proportion: '',
            loadding: false,
            textShowError: '',
            TaskLeveIsRefresh: false,
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
        const { dataRecord, reload, isModify, dataMofidy } = this.props,
            { Proportion, TaskLeve, TaskLevelGroup } = this.state;
        let dataBody = null;

        //show loadding
        this.setState({ loadding: true, textShowError: '' });
        try {
            // chỉnh sửa
            if (isModify && dataMofidy) {
                const SampleTaskID = dataMofidy ? dataMofidy.SampleTaskID : '',
                    TaskID = dataMofidy ? dataMofidy.TaskID : '';

                dataBody = {
                    Proportion: Proportion ? Proportion : '',
                    TaskLevelGroupID: TaskLevelGroup ? TaskLevelGroup.ID : null,
                    TaskLevelID: TaskLeve ? TaskLeve.ID : null,
                    TaskID: TaskID,
                    SampleTaskID: SampleTaskID,
                    ID: dataMofidy.ID
                };
            } else if (dataRecord) {
                //Tạo mới
                const SampleTaskID = dataRecord ? dataRecord.SampleTaskID : '',
                    TaskID = dataRecord ? dataRecord.ID : '';

                dataBody = {
                    Proportion: Proportion ? Proportion : '',
                    TaskLevelGroupID: TaskLevelGroup ? TaskLevelGroup.ID : null,
                    TaskLevelID: TaskLeve ? TaskLeve.ID : null,
                    TaskID: TaskID,
                    SampleTaskID: SampleTaskID
                };
            } else {
                return;
            }

            HttpService.Post('[URI_HR]//api/Tas_TaskLevel', dataBody).then(res => {
                if (res && Object.keys(res).length > 0 && res.ActionStatus === 'Success') {
                    this.hideModalEdit();
                    // reload danh sách mức độ
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

    onchangeTaskLevelGroup = Item => {
        this.setState({
            TaskLevelGroup: Item,
            TaskLeveIsRefresh: !this.state.TaskLeveIsRefresh,
            TaskLeve: null,
            Proportion: '',
            textShowError: ''
        });
    };

    onchangeTaskLeve = async Item => {
        if (Item) {
            // show loadding
            this.setState({ loadding: true });

            let proportionByID = 0;
            const ID = Item ? Item.ID : '',
                getByTaskLeve = await HttpService.Get(`[URI_HR]/api/Cat_TaskLevel/GetById?ID=${ID}`);

            if (getByTaskLeve && Object.keys(getByTaskLeve).length > 0 && getByTaskLeve.ActionStatus === 'Success') {
                proportionByID = getByTaskLeve.Proportion;
                this.setState({
                    TaskLeve: Item,
                    Proportion: proportionByID.toString(),
                    loadding: false,
                    textShowError: '',
                    Description: getByTaskLeve.Description ? getByTaskLeve.Description : ''
                });
            }
        } else {
            this.setState({
                TaskLeve: null,
                Proportion: '',
                loadding: false,
                textShowError: ''
            });
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
            const _TaskLevelGroup =
                    dataMofidy.TaskLevelGroupName && dataMofidy.TaskLevelGroupID
                        ? {
                            ID: dataMofidy.TaskLevelGroupID,
                            TaskLevelGroupName: dataMofidy.TaskLevelGroupName
                        }
                        : null,
                _TaskLevel =
                    dataMofidy.TaskLevelName && dataMofidy.TaskLevelID
                        ? {
                            ID: dataMofidy.TaskLevelID,
                            LevelName: dataMofidy.TaskLevelName
                        }
                        : null;
            this.setState({
                TaskLevelGroup: _TaskLevelGroup,
                TaskLeve: _TaskLevel,
                Proportion: dataMofidy.Proportion ? `${dataMofidy.Proportion}` : '',
                loadding: false,
                textShowError: '',
                Description: dataMofidy.Description ? dataMofidy.Description : '',
                TaskLeveIsRefresh: !this.state.TaskLeveIsRefresh
            });
        }
    };

    componentDidMount() {
        this.generateEdit(this.props);
    }

    render() {
        const {
                TaskLevelGroup,
                TaskLeve,
                Proportion,
                loadding,
                textShowError,
                TaskLeveIsRefresh,
                Description
            } = this.state,
            { modalVisible, dataRecord } = this.props,
            { textLableInfo, contentViewControl, viewLable, viewControl } = stylesListPickerControl;

        // Nhóm mức độ load theo nhóm công việc (ID nhóm công việc)
        const TaskGroupID = dataRecord ? dataRecord.TaskGroupID : null;
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
                            style={styles.styViewSafeArea}
                        >
                            <KeyboardAwareScrollView
                                contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                                enableOnAndroid={false}
                                keyboardShouldPersistTaps={'handled'}
                            >
                                <View style={stylesModalPopupBottom.headerCloseModal}>
                                    <View style={[stylesModalPopupBottom.titleModal]}>
                                        <VnrText style={[styleSheets.lable]} i18nKey={'HRM_Tas_Task_LevelTaskCreate'} />
                                        <VnrLoading
                                            style={styles.StyViewLoadingSmall}
                                            size="small"
                                            isVisible={loadding}
                                        />
                                    </View>
                                </View>

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

                                {/* nhóm mức độ - TaskLevelGroup */}
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Tas_Task_LevelGroup'}
                                        />
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            api={{
                                                urlApi: '[URI_HR]//Tas_GetData/GetMultiTaskLevelGroupAll',
                                                type: 'E_POST',
                                                dataBody: {
                                                    TaskGroupID: TaskGroupID
                                                }
                                            }}
                                            textField="TaskLevelGroupName"
                                            valueField="ID"
                                            filter={true}
                                            filterServer={false}
                                            value={TaskLevelGroup}
                                            onFinish={item => (!loadding ? this.onchangeTaskLevelGroup(item) : null)}
                                        />
                                    </View>
                                </View>
                                {/* Mức độ - TaskLeve */}
                                {
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={'HRM_Tas_Task_Level'}
                                            />
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPicker
                                                refresh={TaskLeveIsRefresh}
                                                api={{
                                                    urlApi: '[URI_HR]//Tas_GetData/GetMultiTaskLevelAll',
                                                    type: 'E_POST',
                                                    dataBody: {
                                                        TaskLevelGroupID: TaskLevelGroup ? TaskLevelGroup.ID : null
                                                    }
                                                }}
                                                textField="LevelName"
                                                valueField="ID"
                                                filter={false}
                                                filterServer={false}
                                                value={TaskLeve}
                                                onFinish={item => (!loadding ? this.onchangeTaskLeve(item) : null)}
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
                                                value={Proportion}
                                                keyboardType={'numeric'}
                                                charType={'double'}
                                                returnKeyType={'done'}
                                                onChangeText={value =>
                                                    !loadding ? this.setState({ Proportion: value }) : null
                                                }
                                            />
                                        </View>
                                    </View>
                                }

                                {/* Description - Mô tả */}
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
                                                styles.styViewDesc
                                            ]}
                                            value={Description}
                                            returnKeyType={'done'}
                                            multiline={true}
                                        />
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
    styViewDesc: { minHeight: 60,
        borderWidth: 0.5,
        borderColor: Colors.grey,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    styViewShowErr: { justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },
    StyViewLoadingSmall: { height: 'auto',
        width: 'auto',
        marginLeft: 10
    },
    styViewSafeArea: { flex: 1,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    }
})