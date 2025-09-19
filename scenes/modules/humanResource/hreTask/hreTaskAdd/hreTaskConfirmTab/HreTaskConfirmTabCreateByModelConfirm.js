import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    Colors,
    styleSafeAreaView,
    stylesListPickerControl,
    styleValid,
    styleProfileInfo,
    styleButtonAddOrEdit,
    CustomStyleSheet
} from '../../../../../../constants/styleConfig';
import VnrText from '../../../../../../components/VnrText/VnrText';
import VnrPicker from '../../../../../../components/VnrPicker/VnrPicker';
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

export default class HreTaskConfirmTabCreateByModelConfirm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            CreatorID: null,
            ProfileIds: null,
            SampleTask: {
                visible: true,
                disable: false,
                refresh: false,
                value: null
            },
            TaskName: null,
            Code: null,
            TaskProject: {
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
            TaskPhase: {
                visible: true,
                disable: true,
                refresh: false,
                value: null,
                data: []
            },
            TaskGroup: {
                visible: true,
                disable: true,
                refresh: false,
                value: null,
                data: []
            },
            Type: { text: '', value: null },
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
            fieldValid: {}
        };

        //check processing cho nhấn lưu nhiều lần
        this.isProcessing = false;
    }

    componentDidMount() {
        //get config validate
        this.getConfigValid('Hre_Tas_Task').then((res) => {
            if (res) {
                try {
                    this.setState({ fieldValid: res }, () => {
                        enumName = EnumName;
                        profileInfo = dataVnrStorage
                            ? dataVnrStorage.currentUser
                                ? dataVnrStorage.currentUser.info
                                : null
                            : null;

                        const { E_ProfileID, E_FullName } = enumName,
                            _profile = { ID: profileInfo[E_ProfileID], ProfileName: profileInfo[E_FullName] };
                        this.setState({ CreatorID: _profile.ID }, () => {
                            this.initData();
                        });
                    });
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            }
        });
    }

    //get config valid
    getConfigValid = (tblName) => {
        return HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + tblName);
    };

    //get KPI Evaluation
    getKPIEva = (sampleTaskID, tasTaskID) => {
        return HttpService.Get(
            '[URI_HR]/Tas_GetData/GetTasTaskKPIPortal?SampleTaskID=' + sampleTaskID + '&TaskID=' + tasTaskID
        );
    };

    //get Level Evaluation
    getLevelEva = (sampleTaskID, taskGroupID, tasTaskID, IsSpecifcTask) => {
        return HttpService.Post('[URI_HR]/Tas_GetData/GetTasTaskTaskLevelPortal', {
            SampleTaskID: sampleTaskID,
            TaskGroupID: taskGroupID,
            TaskID: tasTaskID,
            IsSpecifcTask: IsSpecifcTask
        });
    };

    //init data
    initData = () => {
        VnrLoadingSevices.show();

        HttpService.MultiRequest([this.getKPIEva(null, null), this.getLevelEva(null, null, null, false)]).then(
            (res) => {
                VnrLoadingSevices.hide();
                try {
                    if (res) {
                        let nextState = {};

                        //set list KPI
                        if (res['1']) {
                            nextState = {
                                ...nextState,
                                ListTasTaskKPI: res['1'].Data
                            };
                        }

                        //set list Level
                        if (res['2']) {
                            nextState = {
                                ...nextState,
                                ListTaskLevel: res['2'].Data
                            };
                        }

                        this.setState({ ...nextState });
                    }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            }
        );
    };

    getListKPIAndLevelFromSampleTask = (sampleTaskID, taskGroupID) => {
        //get data cho đánh giá (mức độ, KPI)
        VnrLoadingSevices.show();
        HttpService.MultiRequest([
            this.getKPIEva(sampleTaskID, null),
            this.getLevelEva(sampleTaskID, taskGroupID, null, false)
        ]).then((res) => {
            VnrLoadingSevices.hide();
            try {
                if (res) {
                    let lstKPI = null,
                        lstLevel = null;

                    //set list KPI
                    if (res['0']) {
                        lstKPI = res['0'].Data;
                    }

                    //set list Level
                    if (res['1']) {
                        lstLevel = res['1'].Data;
                    }

                    this.setState({
                        ListTasTaskKPI: lstKPI,
                        ListTaskLevel: lstLevel
                    });
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    //change Mẫu công việc
    onChangeSampleTask = (item) => {
        const { SampleTask, TaskProject, TaskPhase, TaskGroup } = this.state;

        if (item) {
            let { ID } = item;

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Tas_GetData/GetMultiBySampleTaskID', { sampleTaskID: ID }).then((data) => {
                VnrLoadingSevices.hide();
                if (data) {
                    this.setState(
                        {
                            SampleTask: {
                                ...SampleTask,
                                value: { ...item },
                                refresh: !SampleTask.refresh
                            },
                            // TaskPhase: {
                            //     ...TaskPhase,
                            //     data: dataTaskPhase,
                            //     value: data.TaskPhaseID ? { Id: data.TaskPhaseID, TaskPhaseName: data.TaskPhaseName } : null,
                            //     refresh: !TaskPhase.refresh
                            // },
                            // TaskGroup: {
                            //     ...TaskGroup,
                            //     data: dataTaskGroup,
                            //     value: data.TaskGroupID ? { ID: data.TaskGroupID, TaskGroupName: data.TaskGroupName } : null,
                            //     refresh: !TaskGroup.refresh
                            // },
                            // TaskPhase: { text: data.TaskPhaseName, value: data.TaskPhaseID },
                            // TaskGroup: { text: data.TaskGroupName, value: data.TaskGroupID },

                            TaskProject: {
                                ...TaskProject,
                                value: data.TaskProjectID
                                    ? { ID: data.TaskProjectID, TaskProjectName: data.TaskProjectName }
                                    : null,
                                refresh: !TaskProject.refresh
                            },
                            Type: { text: data.TypeView, value: data.Type }
                        },
                        () => {
                            this.loadMultiPersByChanges(data.TaskProjectID, data.TaskPhaseID, data.TaskGroupID, data);
                            this.getListKPIAndLevelFromSampleTask(ID, data.TaskGroupID);
                        }
                    );
                }
            });
        } else {
            //get data cho đánh giá (mức độ, KPI)
            VnrLoadingSevices.show();

            HttpService.MultiRequest([this.getKPIEva(null, null), this.getLevelEva(null, null, false)]).then((res) => {
                VnrLoadingSevices.hide();
                try {
                    if (res) {
                        let lstKPI = null,
                            lstLevel = null;

                        //set list KPI
                        if (res['0']) {
                            lstKPI = res['0'].Data;
                        }

                        //set list Level
                        if (res['1']) {
                            lstLevel = res['1'].Data;
                        }

                        this.setState({
                            ListTasTaskKPI: lstKPI,
                            ListTaskLevel: lstLevel
                        });
                    }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            });

            this.setState(
                {
                    TaskPhase: {
                        ...TaskPhase,
                        value: null,
                        refresh: !TaskPhase.refresh
                    },
                    TaskGroup: {
                        ...TaskGroup,
                        value: null,
                        refresh: !TaskGroup.refresh
                    },
                    TaskProject: { text: '', value: null },
                    Type: { text: '', value: null }
                },
                () => {
                    this.loadMultiPersByChanges(null, null, null);
                }
            );
        }
    };

    //change Dự án
    onChangeTaskProject = (item) => {
        const { TaskGroup, TaskPhase, TaskProject } = this.state;

        const TaskPhaseID = TaskPhase.value ? TaskPhase.value.ID : null,
            TaskGroupID = TaskGroup.value ? TaskGroup.value.TaskPhaseID : null;

        if (item) {
            let { ID } = item;

            this.setState(
                {
                    TaskProject: {
                        ...TaskProject,
                        value: { ...item },
                        refresh: !TaskProject.refresh
                    }
                },
                () => {
                    this.loadMultiPersByChanges(ID, TaskPhaseID, TaskGroupID);
                }
            );
        } else {
            this.loadMultiPersByChanges(null, TaskPhaseID, TaskGroupID);
        }
    };

    loadMultiPersByChanges = (taskProjectID, taskPhaseID, taskGroupID, dataBySampleTask) => {
        const { TaskPhase, TaskGroup } = this.state;

        taskProjectID = taskProjectID != null ? taskProjectID : '00000000-0000-0000-0000-000000000000';
        taskPhaseID = taskPhaseID != null ? taskPhaseID : '00000000-0000-0000-0000-000000000000';
        taskGroupID = taskGroupID != null ? taskGroupID : '00000000-0000-0000-0000-000000000000';

        VnrLoadingSevices.show();
        HttpService.MultiRequest([
            HttpService.Post('[URI_HR]/Tas_GetData/GetPersonsConcernedByIds', {
                taskProjectID: taskProjectID,
                taskPhaseID: taskPhaseID,
                taskGroupID: taskGroupID
            }),
            HttpService.Get(
                `[URI_HR]/Tas_GetData/GetMultiTaskPhaseAll?TaskProjectID=${taskProjectID ? taskProjectID : ''}`
            ),
            HttpService.Get(
                `[URI_HR]/Tas_GetData/GetMultiTaskGroupAll?TaskProjectID=${taskProjectID ? taskProjectID : ''}`
            )
        ]).then((resAll) => {
            VnrLoadingSevices.hide();
            const data = resAll[0],
                dataTaskPhase = resAll[1],
                dataTaskGroup = resAll[2];

            let getDataTaskPhase =
                    dataBySampleTask && dataBySampleTask.TaskPhaseID && dataTaskPhase.length > 0
                        ? dataTaskPhase.find((item) => item.TaskPhaseID == dataBySampleTask.TaskPhaseID)
                        : null,
                getDataTaskGroup =
                    dataBySampleTask && dataBySampleTask.TaskGroupID && dataTaskPhase.length > 0
                        ? dataTaskGroup.find((item) => item.ID == dataBySampleTask.TaskGroupID)
                        : null;

            if (!getDataTaskPhase && dataTaskPhase && dataTaskPhase.length == 1) {
                getDataTaskPhase = dataTaskPhase[0];
            }

            if (!getDataTaskGroup && dataTaskGroup && dataTaskGroup.length == 1) {
                getDataTaskGroup = dataTaskGroup[0];
            }

            if (data && Array.isArray(data)) {
                this.setState({
                    ProfileIds: [...data],
                    TaskPhase: {
                        ...TaskPhase,
                        data: dataTaskPhase,
                        disable: getDataTaskPhase ? true : false,
                        value: getDataTaskPhase,
                        refresh: !TaskPhase.refresh
                    },
                    TaskGroup: {
                        ...TaskGroup,
                        data: dataTaskGroup,
                        disable: getDataTaskGroup ? true : false,
                        value: getDataTaskGroup,
                        refresh: !TaskGroup.refresh
                    }
                });
            }
        });
    };

    onChangeTaskPhase = (item) => {
        const { TaskPhase } = this.state;
        this.setState(
            {
                TaskPhase: {
                    ...TaskPhase,
                    value: item,
                    refresh: TaskPhase.refresh
                }
            },
            () => {
                VnrLoadingSevices.show();
                const { TaskProject, TaskPhase, TaskGroup } = this.state;
                HttpService.Get(
                    `[URI_HR]/Tas_GetData/GetMultiTaskGroupAll?TaskProjectID=${
                        TaskProject.value ? TaskProject.value.ID : ''
                    }&TaskPhaseID=${TaskPhase.value ? TaskPhase.value.TaskPhaseID : ''}`
                ).then((resData) => {
                    VnrLoadingSevices.hide();
                    this.setState({
                        TaskGroup: {
                            ...TaskGroup,
                            data: resData,
                            value: null,
                            disable: false,
                            refresh: !TaskGroup.refresh
                        }
                    });
                });
            }
        );
    };

    onConfirm = () => {
        const { fieldValid, SampleTask, TaskPhase, TaskGroup, TaskProject } = this.state;

        if (fieldValid.SampleTaskID && !SampleTask.value) {
            let mess = '[' + translate('HRM_Tas_Task_TaskModelName') + '] ' + translate('E_NotNull').toLowerCase();
            ToasterSevice.showWarning(mess);
        } else if (fieldValid.TaskProjectID && !TaskProject.value) {
            let mess = '[' + translate('HRM_Tas_Task_Project') + '] ' + translate('E_NotNull').toLowerCase();
            ToasterSevice.showWarning(mess);
        } else {
            let dataConfirm = {
                ...this.state,
                TaskPhase: { ...TaskPhase, value: TaskPhase.value ? TaskPhase.value.TaskPhaseID : null },
                TaskGroup: { ...TaskPhase, value: TaskGroup.value ? TaskGroup.value.ID : null }
            };
            DrawerServices.navigate('HreTaskCreateSave', { dataConfirm: dataConfirm });
        }
    };

    render() {
        const { SampleTask, TaskProject, TaskPhase, TaskGroup, Type, fieldValid } = this.state;

        const { textLableInfo, contentViewControl, viewLable, viewControl } = stylesListPickerControl;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    {
                        <KeyboardAwareScrollView
                            keyboardShouldPersistTaps={'handled'}
                            contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                        >
                            {/* Mẫu công việc - SampleTask */}
                            {
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Tas_Task_TaskModelName'}
                                        />

                                        {/* valid SampleTaskID */}
                                        {fieldValid.SampleTaskID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            api={{
                                                urlApi: '[URI_HR]/Tas_GetData/GetMultiSampleTaskAll',
                                                type: 'E_GET'
                                            }}
                                            textField="SampleTaskName"
                                            valueField="ID"
                                            filter={true}
                                            refresh={SampleTask.refresh}
                                            filterServer={false}
                                            autoFilter={true}
                                            value={SampleTask.value}
                                            onFinish={(item) => this.onChangeSampleTask(item)}
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

                            {/* show thông tin theo dự án */}
                            <View style={styleProfileInfo.styleViewTitleGroup}>
                                <VnrText
                                    style={[styleSheets.text, styleProfileInfo.textLableGroup]}
                                    i18nKey={'HRM_Evalution_Project_Info'}
                                />
                            </View>

                            {/* Giai đoạn - TaskPhase */}
                            {
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Tas_Task_Phase'}
                                        />
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            dataLocal={TaskPhase.data}
                                            textField="TaskPhaseName"
                                            valueField="TaskPhaseID"
                                            filter={true}
                                            disable={TaskPhase.disable}
                                            refresh={TaskPhase.refresh}
                                            filterServer={false}
                                            filterParams="text"
                                            value={TaskPhase.value}
                                            onFinish={(item) => this.onChangeTaskPhase(item)}
                                        />
                                        {/* <VnrText style={[styleSheets.text]} value={TaskPhase.text} /> */}
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
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            dataLocal={TaskGroup.data}
                                            textField="TaskGroupName"
                                            valueField="ID"
                                            filter={true}
                                            refresh={TaskGroup.refresh}
                                            disable={TaskGroup.disable}
                                            filterServer={false}
                                            filterParams="text"
                                            value={TaskGroup.value}
                                            onFinish={(item) =>
                                                this.setState({
                                                    TaskGroup: {
                                                        ...TaskGroup,
                                                        value: item,
                                                        refresh: TaskGroup.refresh
                                                    }
                                                })
                                            }
                                        />
                                        {/* <VnrText style={[styleSheets.text]} value={TaskGroup.text} /> */}
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
                                    </View>
                                    <View style={viewControl}>
                                        <VnrText style={[styleSheets.text]} value={Type.text} />
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
