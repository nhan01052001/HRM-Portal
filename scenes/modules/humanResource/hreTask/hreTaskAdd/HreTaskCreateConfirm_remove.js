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
} from '../../../../../constants/styleConfig';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrPicker from '../../../../../components/VnrPicker/VnrPicker';
import HttpService from '../../../../../utils/HttpService';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { EnumName } from '../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import DrawerServices from '../../../../../utils/DrawerServices';

let enumName = null,
    profileInfo = null;

export default class HreTaskCreateConfirm extends Component {
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
            TaskPhase: { text: '', value: null },
            TaskGroup: { text: '', value: null },
            Type: { text: '', value: null },
            StatusView: 'E_ASSIGNED',
            Formula: null,
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
        this.getConfigValid('Hre_Tas_Task').then(res => {
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
    getConfigValid = tblName => {
        return HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + tblName);
    };

    //get Formular
    getFormula = () => {
        return HttpService.Get('[URI_HR]//Tas_GetData/GetMultiNameEntityOfTypeAll');
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
            this.getFormula(),
            this.getKPIEva(null, null),
            this.getLevelEva(null, null, false)
        ]).then(res => {
            VnrLoadingSevices.hide();
            try {
                //console.log(res['0'], res['1'], res['2']);
                if (res) {
                    let formulaID = null,
                        lstKPI = null,
                        lstLevel = null;

                    //set value cho Formula
                    if (res['0']) {
                        formulaID = res['0'][0].ID;
                    }

                    //set list KPI
                    if (res['1']) {
                        lstKPI = res['1'].Data;
                    }

                    //set list Level
                    if (res['2']) {
                        lstLevel = res['2'].Data;
                    }

                    this.setState({
                        Formula: formulaID,
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
    onChangeSampleTask = item => {
        const { SampleTask } = this.state;

        if (item) {
            let { ID } = item;

            //get data cho đánh giá (mức độ, KPI)
            VnrLoadingSevices.show();

            HttpService.MultiRequest([this.getKPIEva(ID, null), this.getLevelEva(ID, null, false)]).then(res => {
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

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]//Tas_GetData/GetMultiBySampleTaskID', { sampleTaskID: ID }).then(data => {
                VnrLoadingSevices.hide();

                if (data) {
                    this.setState(
                        {
                            SampleTask: {
                                ...SampleTask,
                                value: { ...item },
                                refresh: !SampleTask.refresh
                            },
                            TaskGroup: { text: data.TaskGroupName, value: data.TaskGroupID },
                            TaskPhase: { text: data.TaskPhaseName, value: data.TaskPhaseID },
                            TaskProject: { text: data.TaskProjectName, value: data.TaskProjectID },
                            Type: { text: data.TypeView, value: data.Type }
                        },
                        () => {
                            this.loadMultiPersByChanges(data.TaskProjectID, data.TaskPhaseID, data.TaskGroupID);
                        }
                    );
                }
            });
        } else {
            //get data cho đánh giá (mức độ, KPI)
            VnrLoadingSevices.show();

            // eslint-disable-next-line no-undef
            HttpService.MultiRequest([this.getKPIEva(ID, null), this.getLevelEva(ID, null, false)]).then(res => {
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
                    TaskGroup: { text: '', value: null },
                    TaskPhase: { text: '', value: null },
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
    onChangeTaskProject = item => {
        const { TaskGroup, TaskPhase, TaskProject } = this.state;

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
                    this.loadMultiPersByChanges(ID, TaskPhase.value, TaskGroup.value);
                }
            );
        } else {
            this.loadMultiPersByChanges(null, TaskPhase.value, TaskGroup.value);
        }
    };

    loadMultiPersByChanges = (taskProjectID, taskPhaseID, taskGroupID) => {
        taskProjectID = taskProjectID != null ? taskProjectID : '00000000-0000-0000-0000-000000000000';
        taskPhaseID = taskPhaseID != null ? taskPhaseID : '00000000-0000-0000-0000-000000000000';
        taskGroupID = taskGroupID != null ? taskGroupID : '00000000-0000-0000-0000-000000000000';

        HttpService.Post('[URI_HR]/Tas_GetData/GetPersonsConcernedByIds', {
            taskProjectID: taskProjectID,
            taskPhaseID: taskPhaseID,
            taskGroupID: taskGroupID
        }).then(response => {
            //console.log(response);
            if (response && Array.isArray(response)) {
                this.setState({ ProfileIds: response.join() });
            }
        });
    };

    render() {
        const {
            SampleTask,
            TaskProject,
            TaskPhase,
            TaskGroup,
            Type,
            fieldValid
        } = this.state;

        const {
            textLableInfo,
            contentViewControl,
            viewLable,
            viewControl
        } = stylesListPickerControl;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    {
                        <KeyboardAwareScrollView
                            contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                            keyboardShouldPersistTaps={'handled'}
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
                                            value={SampleTask.value}
                                            onFinish={item => this.onChangeSampleTask(item)}
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
                                            filterServer={false}
                                            value={TaskProject.value}
                                            onFinish={item => this.onChangeTaskProject(item)}
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
                                        <VnrText style={[styleSheets.text]} value={TaskPhase.Text} />
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
                                        <VnrText style={[styleSheets.text]} value={TaskGroup.Text} />
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
                                        <VnrText style={[styleSheets.text]} value={Type.Text} />
                                    </View>
                                </View>
                            }

                            {/* Tập tin đính kèm - FileAttachment - IsCheckMedical */}
                            {/* {
                                    IsCheckMedical.visible && (
                                        <View style={contentViewControl}>
                                            <View style={viewLable} >
                                                <VnrText style={[styleSheets.text, textLableInfo]}
                                                    i18nKey={"HRM_Rec_JobVacancy_FileAttachment"} />
                                            </View>
                                            <View style={viewControl}>
                                                <VnrAttachFile
                                                    disable={FileAttachment.disable}
                                                    // value={[{ exr: 'sdsadsa' },
                                                    // { "ext": ".doc", "fileName": "docssss.doc",
                                                    //  "path": "http://192.168.1.58:6200//Uploads//doc.doc",
                                                    //   "size": 19 }]}
                                                    value={FileAttachment.value}
                                                    multiFile={true}
                                                    uri={'[URI_POR]/New_Home/SaveAttachFile'}
                                                    onFinish={(file) => { }}
                                                />
                                            </View>
                                        </View>
                                    )
                                } */}
                            {/* </ScrollView> */}
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
                            onPress={() => DrawerServices.navigate('HreTaskCreateSave', { dataConfirm: this.state })}
                            style={styleButtonAddOrEdit.groupButton__button_save}
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
