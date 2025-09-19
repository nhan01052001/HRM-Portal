import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    Size,
    Colors,
    styleSafeAreaView,
    stylesListPickerControl,
    styleValid,
    styleButtonAddOrEdit,
    CustomStyleSheet
} from '../../../../../../constants/styleConfig';
import VnrText from '../../../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../../../components/VnrTextInput/VnrTextInput';
import VnrPicker from '../../../../../../components/VnrPicker/VnrPicker';
import VnrPickerQuickly from '../../../../../../components/VnrPickerQuickly/VnrPickerQuickly';
import HttpService from '../../../../../../utils/HttpService';
import { ToasterSevice } from '../../../../../../components/Toaster/Toaster';
import { VnrLoadingSevices } from '../../../../../../components/VnrLoading/VnrLoadingPages';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { translate } from '../../../../../../i18n/translate';
import { EnumName } from '../../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../../assets/auth/authentication';
import DrawerServices from '../../../../../../utils/DrawerServices';

let enumName = null,
    profileInfo = null;

export default class HreTaskConfirmTabCreateNotModelConfirm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            CreatorID: null,
            TaskName: null,
            Code: null,
            TaskProject: {
                visible: true,
                disable: false,
                refresh: false,
                value: null
            },
            TaskType: {
                visible: true,
                disable: false,
                refresh: false,
                value: null
            },
            TaskPhase: {
                visible: true,
                disable: false,
                refresh: false,
                value: null,
                data: []
            },
            TaskGroup: {
                visible: true,
                disable: false,
                refresh: false,
                value: null,
                data: []
            },
            Type: {
                visible: true,
                disable: false,
                refresh: false,
                value: null
            },
            Evaluator: {
                visible: true,
                disable: false,
                refresh: false,
                value: null
            },
            StatusView: 'E_ASSIGNED',
            AssignmentDate: new Date(),
            ExpectedDate: null,
            FinishDate: null,
            ExpectedDuration: null,
            ActualDuration: null,
            PICID: {
                visible: true,
                disable: false,
                refresh: false,
                value: null
            },
            FileAttach: {
                value: null,
                refresh: false,
                disable: false
            },
            Content: {
                value: null,
                refresh: false,
                disable: false
            },
            ListTaskLevel: null,
            ListTasTaskKPI: null,
            fieldValid: {},
            fieldDisable: {}
        };

        //check processing cho nhấn lưu nhiều lần
        this.isProcessing = false;
    }

    componentDidMount() {
        //get config validate
        this.getConfigValid('Hre_Tas_Task', 'Tas_Task').then((resAll) => {
            const [res1, resDisableField] = resAll,
                objDisableField = {};

            if (Array.isArray(resDisableField) && resDisableField.length > 0) {
                resDisableField.forEach((e) => (objDisableField[e] = true));
            }
            if (res1) {
                try {
                    this.setState({ fieldValid: res1, fieldDisable: objDisableField }, () => {
                        enumName = EnumName;
                        profileInfo = dataVnrStorage
                            ? dataVnrStorage.currentUser
                                ? dataVnrStorage.currentUser.info
                                : null
                            : null;

                        const { E_ProfileID, E_FullName } = enumName,
                            _profile = { ID: profileInfo[E_ProfileID], ProfileName: profileInfo[E_FullName] };
                        this.setState({ CreatorID: _profile.ID }, () => this.initData());
                    });
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            }
        });
    }

    // componentDidMount() {

    //     const { dataConfirm } = this.props.navigation.state.params;

    //     //get config validate
    //     this.getConfigValid('Hre_Tas_Task', 'Tas_Task').then(resAll => {
    //         const [res1, resDisableField] = resAll,
    //             objDisableField = {};
    //         if (Array.isArray(resDisableField) && resDisableField.length > 0) {
    //             resDisableField.forEach(e => objDisableField[e] = true);
    //         }

    //         if (res1) {
    //             try {
    //                 this.setState({ fieldValid: res1, fieldDisable: objDisableField }, () => {
    //                     enumName = EnumName;
    //                     profileInfo = dataVnrStorage ? dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info : null : null;

    //                     const { AssignmentDateRefresh, ProfileIds } = this.state,
    //                         _valProd = dataConfirm.ProfileIds;

    //                     let nextState = {
    //                         ...this.state,
    //                         ...dataConfirm,
    //                         ProfileIds: {
    //                             ...ProfileIds,
    //                             value: _valProd ? [..._valProd] : null,
    //                             refresh: !ProfileIds.refresh
    //                         },
    //                         AssignmentDateRefresh: !AssignmentDateRefresh
    //                     };

    //                     this.setState(nextState);
    //                 });
    //             } catch (error) {
    //                 DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
    //             }
    //         }
    //     })
    // }

    // //get config valid
    // getConfigValid = tblName => {
    //     return HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + tblName);
    // }

    //get config valid
    getConfigValid = (tblNameValid, tblNameValidField) => {
        return HttpService.MultiRequest([
            HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + tblNameValid),
            HttpService.Post('[URI_HR]/Sys_GetData/GetFieldGenerateCode', { _tableName: tblNameValidField })
        ]);
    };

    //get KPI Evaluation
    getKPIEva = (sampleTaskID, tasTaskID) => {
        return HttpService.Get(
            '[URI_HR]/Tas_GetData/GetTasTaskKPIPortal?SampleTaskID=' + sampleTaskID + '&TaskID=' + tasTaskID
        );
    };

    //get Level Evaluation
    getLevelEva = (sampleTaskID, tasTaskID, IsSpecifcTask) => {
        return HttpService.Post('[URI_HR]/Tas_GetData/GetTasTaskTaskLevelPortal', {
            SampleTaskID: sampleTaskID,
            TaskID: tasTaskID,
            IsSpecifcTask: IsSpecifcTask
        });
    };

    //init data
    initData = () => {
        VnrLoadingSevices.show();

        HttpService.MultiRequest([
            HttpService.Get('[URI_HR]/Tas_GetData/GetMultiTaskPhaseAll'),
            HttpService.Get('[URI_HR]/Tas_GetData/GetMultiTaskGroupAll')
        ]).then((res) => {
            VnrLoadingSevices.hide();
            try {
                if (res) {
                    const { TaskPhase, TaskGroup } = this.state;

                    let nextState = {};

                    if (res['0']) {
                        nextState = {
                            ...nextState,
                            TaskPhase: {
                                ...TaskPhase,
                                data: [...res['0']],
                                refresh: !TaskPhase.refresh
                            }
                        };
                    }

                    if (res['1']) {
                        nextState = {
                            ...nextState,
                            TaskGroup: {
                                ...TaskGroup,
                                data: [...res['1']],
                                refresh: !TaskGroup.refresh
                            }
                        };
                    }

                    this.setState(nextState);
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    //change dự án
    onChangeTaskProject = (item) => {
        const { TaskProject } = this.state;

        this.setState(
            {
                TaskProject: {
                    ...TaskProject,
                    value: item
                }
            },
            () => {
                //load KPI, target

                VnrLoadingSevices.show();
                HttpService.MultiRequest([
                    HttpService.Post('[URI_HR]//Tas_GetData/GetMultiTaskPhaseAll', {
                        TaskProjectID: item ? item.ID : null
                    }),
                    HttpService.Post('[URI_HR]//Tas_GetData/GetMultiTaskGroupAll', {
                        TaskProjectID: item ? item.ID : null
                    })
                ]).then((res) => {
                    VnrLoadingSevices.hide();
                    try {
                        if (res) {
                            const { TaskPhase, TaskGroup } = this.state;

                            let nextState = {};

                            if (res['0']) {
                                nextState = {
                                    TaskPhase: {
                                        ...TaskPhase,
                                        data: [...res['0']],
                                        refresh: !TaskPhase.refresh
                                    }
                                };
                            }

                            if (res['1']) {
                                nextState = {
                                    ...nextState,
                                    TaskGroup: {
                                        ...TaskGroup,
                                        data: [...res['1']],
                                        refresh: !TaskGroup.refresh
                                    }
                                };
                            }

                            this.setState(nextState, () => this.loadMultiPersByChanges());
                        }
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    }
                });
            }
        );
    };

    //change giai đoạn
    onChangeTaskPhase = (item) => {
        const { TaskPhase, TaskProject } = this.state;

        this.setState(
            {
                TaskPhase: {
                    ...TaskPhase,
                    value: item
                }
            },
            () => {
                //load taskGroup

                VnrLoadingSevices.show();
                HttpService.Post('[URI_HR]/Tas_GetData/GetMultiTaskGroupAll', {
                    TaskProjectID: TaskProject.value ? TaskProject.value.ID : null,
                    TaskPhaseID: item ? item.ID : null
                }).then((data) => {
                    VnrLoadingSevices.hide();
                    const { TaskGroup } = this.state;

                    try {
                        if (data) {
                            this.setState(
                                {
                                    TaskGroup: {
                                        ...TaskGroup,
                                        data: [...data],
                                        refresh: !TaskGroup.refresh
                                    }
                                },
                                () => this.loadMultiPersByChanges()
                            );
                        }
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    }
                });
            }
        );
    };

    //change nhóm công việc
    onChangeTaskGroup = (item) => {
        const { TaskGroup } = this.state;

        this.setState(
            {
                TaskGroup: {
                    ...TaskGroup,
                    value: item
                }
            },
            () => {
                //load Danh sách mức độ
                let tasTaskID = null,
                    tempSampleTaskID = null;

                VnrLoadingSevices.show();
                HttpService.Post('[URI_HR]/Tas_GetData/GetTasTaskTaskLevelPortal?', {
                    SampleTaskID: tempSampleTaskID,
                    TaskGroupID: item ? item.ID : null,
                    TaskID: tasTaskID,
                    IsSpecifcTask: false
                }).then((data) => {
                    VnrLoadingSevices.hide();
                    try {
                        if (data && data.Data) {
                            this.setState({ ListTaskLevel: [...data.Data] }, () => () => this.loadMultiPersByChanges());
                        }
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    }
                });
            }
        );
    };

    loadMultiPersByChanges = () => {
        const { TaskGroup, TaskPhase, TaskProject } = this.state;

        let taskProjectID = TaskProject.value ? TaskProject.value.ID : '00000000-0000-0000-0000-000000000000',
            taskPhaseID = TaskPhase.value ? TaskPhase.value.Id : '00000000-0000-0000-0000-000000000000',
            taskGroupID = TaskGroup.value ? TaskGroup.value.ID : '00000000-0000-0000-0000-000000000000';

        HttpService.Post('[URI_HR]/Tas_GetData/GetPersonsConcernedByIds', {
            taskProjectID: taskProjectID,
            taskPhaseID: taskPhaseID,
            taskGroupID: taskGroupID
        }).then((response) => {
            if (response && Array.isArray(response)) {
                this.setState({ ProfileIds: response });
            }
        });
    };

    onConfirm = () => {
        const { fieldValid, Code, TaskName, TaskProject, TaskPhase, TaskGroup, Type } = this.state;

        if (fieldValid.Code && (!Code || Code === '')) {
            let mess = '[' + translate('HRM_Hre_Tas_Task_CodeTask') + '] ' + translate('E_NotNull').toLowerCase();
            ToasterSevice.showWarning(mess);
        } else if (fieldValid.TaskName && (!TaskName || TaskName === '')) {
            let mess = '[' + translate('HRM_HR_Task_TaskName') + '] ' + translate('E_NotNull').toLowerCase();
            ToasterSevice.showWarning(mess);
        } else if (fieldValid.TaskProjectID && !TaskProject.value) {
            let mess = '[' + translate('HRM_Tas_Task_Project') + '] ' + translate('E_NotNull').toLowerCase();
            ToasterSevice.showWarning(mess);
        } else if (fieldValid.TaskPhaseID && !TaskPhase.value) {
            let mess = '[' + translate('HRM_Tas_Task_Phase') + '] ' + translate('E_NotNull').toLowerCase();
            ToasterSevice.showWarning(mess);
        } else if (fieldValid.TaskGroupID && !TaskGroup.value) {
            let mess = '[' + translate('HRM_Tas_Task_TaskGroup') + '] ' + translate('E_NotNull').toLowerCase();
            ToasterSevice.showWarning(mess);
        } else if (fieldValid.Type && !Type.value) {
            let mess = '[' + translate('HRM_Tas_Task_Type') + '] ' + translate('E_NotNull').toLowerCase();
            ToasterSevice.showWarning(mess);
        } else {
            DrawerServices.navigate('HreTaskCreateSaveNotModel', { dataConfirm: this.state });
        }
    };

    render() {
        const { TaskProject, TaskPhase, TaskGroup, Type, fieldValid, fieldDisable } = this.state;

        const { textLableInfo, contentViewControl, viewLable, viewControl } = stylesListPickerControl;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    {
                        <KeyboardAwareScrollView
                            contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                            keyboardShouldPersistTaps={'handled'}
                        >
                            {/* Mã công việc - Code */}
                            {
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Hre_Tas_Task_CodeTask'}
                                        />

                                        {/* valid Code */}
                                        {fieldValid.Code && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrTextInput
                                            refresh={fieldDisable && fieldDisable.Code ? true : false}
                                            style={[
                                                styleSheets.textInput,
                                                { height: Size.heightInput },
                                                fieldDisable &&
                                                    fieldDisable.Code && {
                                                    backgroundColor: Colors.greyPrimaryConstraint
                                                }
                                            ]}
                                            returnKeyType={'done'}
                                            disable={fieldDisable && fieldDisable.Code ? true : false}
                                            onChangeText={(text) => this.setState({ Code: text })}
                                        />
                                    </View>
                                </View>
                            }

                            {/* Công việc - TaskName */}
                            {
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_HR_Task_TaskName'}
                                        />

                                        {/* valid TaskName */}
                                        {fieldValid.TaskName && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrTextInput
                                            style={[styleSheets.textInput, { height: Size.heightInput }]}
                                            returnKeyType={'done'}
                                            onChangeText={(text) => this.setState({ TaskName: text })}
                                        />
                                    </View>
                                </View>
                            }

                            {/* Dự án - TaskProject */}
                            {
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Tas_Task_Project'}
                                        />

                                        {/* valid TaskProjectID */}
                                        {fieldValid.TaskProjectID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            api={{
                                                urlApi: '[URI_HR]/Tas_GetData/GetMultiTaskProjectAll',
                                                type: 'E_GET'
                                            }}
                                            textField="TaskProjectName"
                                            valueField="ID"
                                            filter={true}
                                            refresh={TaskProject.refresh}
                                            filterServer={true}
                                            filterParams="text"
                                            value={TaskProject.value}
                                            onFinish={(item) => this.onChangeTaskProject(item)}
                                        />
                                    </View>
                                </View>
                            }

                            {/* Giai đoạn - TaskPhase */}
                            {
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Tas_Task_Phase'}
                                        />

                                        {/* valid TaskPhaseID */}
                                        {fieldValid.TaskPhaseID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPickerQuickly
                                            dataLocal={TaskPhase.data}
                                            textField="TaskPhaseName"
                                            valueField="Id"
                                            filter={true}
                                            refresh={TaskPhase.refresh}
                                            filterServer={false}
                                            autoFilter={true}
                                            value={TaskPhase.value}
                                            onFinish={(item) => this.onChangeTaskPhase(item)}
                                        />
                                    </View>
                                </View>
                            }

                            {/* Nhóm công việc - TaskGroup */}
                            {
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Tas_Task_TaskGroup'}
                                        />

                                        {/* valid TaskGroupID */}
                                        {fieldValid.TaskGroupID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPickerQuickly
                                            dataLocal={TaskGroup.data}
                                            textField="TaskGroupName"
                                            valueField="ID"
                                            filter={true}
                                            autoFilter={true}
                                            refresh={TaskGroup.refresh}
                                            filterServer={false}
                                            value={TaskGroup.value}
                                            onFinish={(item) => this.onChangeTaskGroup(item)}
                                        />
                                    </View>
                                </View>
                            }

                            {/* Loại công việc - Type */}
                            {
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Tas_Task_Type'}
                                        />

                                        {fieldValid.Type && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPickerQuickly
                                            api={{
                                                urlApi: '[URI_SYS]/Sys_GetData/GetEnum?text=CatSampleTask_Type',
                                                type: 'E_GET'
                                            }}
                                            textField="Text"
                                            valueField="Value"
                                            filter={false}
                                            refresh={Type.refresh}
                                            value={Type.value}
                                            onFinish={(item) =>
                                                this.setState({
                                                    Type: {
                                                        ...Type,
                                                        value: item
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            }
                        </KeyboardAwareScrollView>
                    }

                    {/* bottom button close, confirm */}
                    <View style={styleButtonAddOrEdit.groupButton}>
                        <TouchableOpacity
                            onPress={() => DrawerServices.goBack()}
                            style={[styleButtonAddOrEdit.btnClose]}
                        >
                            <VnrText
                                style={[styleSheets.lable, { color: Colors.greySecondary }]}
                                i18nKey={'HRM_Common_Close'}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => this.onConfirm()}
                            style={styleButtonAddOrEdit.groupButton__button_Confirm}
                        >
                            <VnrText
                                style={[styleSheets.lable, styleButtonAddOrEdit.groupButton__text]}
                                i18nKey={'HRM_Common_Confirm'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}
