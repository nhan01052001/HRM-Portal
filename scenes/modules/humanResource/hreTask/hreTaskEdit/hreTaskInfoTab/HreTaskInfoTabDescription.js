import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation';

import {
    styleSheets,
    styleSafeAreaView,
    stylesListPickerControl,
    Colors,
    Size,
    styleValid,
    CustomStyleSheet
} from '../../../../../../constants/styleConfig';
import VnrText from '../../../../../../components/VnrText/VnrText';
import Vnr_Function from '../../../../../../utils/Vnr_Function';
import DrawerServices from '../../../../../../utils/DrawerServices';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import VnrTextInput from '../../../../../../components/VnrTextInput/VnrTextInput';
import VnrPicker from '../../../../../../components/VnrPicker/VnrPicker';
import VnrPickerQuickly from '../../../../../../components/VnrPickerQuickly/VnrPickerQuickly';
import { IconPublish } from '../../../../../../constants/Icons';
import VnrPickerMulti from '../../../../../../components/VnrPickerMulti/VnrPickerMulti';
import { VnrLoadingSevices } from '../../../../../../components/VnrLoading/VnrLoadingPages';
import HttpService from '../../../../../../utils/HttpService';
import { TaskBusinessBusinessFunction } from '../../HreTaskBusiness';

export default class HreTaskInfoTabDescription extends Component {
    constructor(props) {
        super(props);

        // Xử lý disable control Edit cho taskAsigned
        const { params } = props.navigation.state,
            { roleEditStatusOnly } = params;

        this.state = {
            dataItem: null,
            TaskName: null,
            TaskNameDisable: roleEditStatusOnly ? true : false,
            TaskProject: {
                visible: true,
                disable: roleEditStatusOnly ? true : false,
                refresh: false,
                value: null
            },
            TaskPhase: {
                visible: true,
                disable: roleEditStatusOnly ? true : false,
                refresh: false,
                value: null,
                data: []
            },
            TaskGroup: {
                visible: true,
                disable: roleEditStatusOnly ? true : false,
                refresh: false,
                value: null,
                data: []
            },
            Type: {
                visible: true,
                disable: roleEditStatusOnly ? true : false,
                refresh: false,
                value: null
            },
            ProfileIds: {
                visible: true,
                disable: roleEditStatusOnly ? true : false,
                refresh: false,
                value: null
            },
            Formula: {
                visible: true,
                disable: roleEditStatusOnly ? true : false,
                refresh: false,
                value: null
            },
            fieldValid: {}
        };

        //set function để update lại value chon Control Người liên quan
        TaskBusinessBusinessFunction.onUpdatProfileIds = this.onUpdatProfileIds;
    }

    reload = (E_KEEP_FILTER, actionIsDelete) => {
        const { reloadScreenList } = this.props.navigation.state.params;
        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');

        //nếu action = Delete => back về danh sách
        if (actionIsDelete) {
            DrawerServices.navigate('');
        } else {
            this.getDataItem(true);
        }
    };

    componentDidMount() {
        const { params } = this.props.navigation.state;

        if (params) {
            const { newRecord } = params;
            let record = { ...newRecord };

            VnrLoadingSevices.show();

            HttpService.MultiRequest([
                HttpService.Post('[URI_HR]//Tas_GetData/GetMultiTaskPhaseAll', { TaskProjectID: record.TaskProjectID }),
                HttpService.Post('[URI_HR]//Tas_GetData/GetMultiTaskGroupAll', { TaskProjectID: record.TaskProjectID })
            ]).then((res) => {
                VnrLoadingSevices.hide();
                try {
                    const { fieldValid } = params,
                        { TaskProject, TaskPhase, TaskGroup, Type, Formula, ProfileIds } = this.state;
                    let nextState = {
                        dataItem: record,
                        TaskName: record.TaskName,
                        code: record.Code,
                        CreatorID: record.CreatorID,
                        ProfileIds: {
                            ...ProfileIds,
                            value: record.lstConcerned ? record.lstConcerned : null,
                            refresh: !ProfileIds.refresh
                        },
                        TaskProject: {
                            ...TaskProject,
                            value: record.TaskProjectID
                                ? { ID: record.TaskProjectID, TaskProjectName: record.TaskProjectName }
                                : null,
                            refresh: !TaskProject.refresh
                        },
                        TaskPhase: {
                            ...TaskPhase,
                            value: record.TaskPhaseID
                                ? { ID: record.TaskPhaseID, TaskPhaseName: record.TaskPhaseName }
                                : null,
                            refresh: !TaskPhase.refresh
                        },
                        TaskGroup: {
                            ...TaskGroup,
                            value: record.TaskGroupID
                                ? { ID: record.TaskGroupID, TaskGroupName: record.TaskGroupName }
                                : null,
                            refresh: !TaskGroup.refresh
                        },
                        Type: {
                            ...Type,
                            value: record.Type ? { Value: record.Type, Text: record.TypeView } : null,
                            refresh: !Type.refresh
                        },
                        Formula: {
                            ...Formula,
                            value: record.FormulaID
                                ? { ID: record.FormulaID, NameEntityNameAndCode: record.NameEntityName }
                                : null,
                            refresh: !Formula.refresh
                        },
                        fieldValid
                    };

                    if (res) {
                        if (res['0']) {
                            let dataTaskPhase = [...res['0']],
                                objValue = dataTaskPhase.find((item) => item.Id === record.TaskPhaseID);

                            nextState = {
                                ...nextState,
                                TaskPhase: {
                                    ...nextState.TaskPhase,
                                    data: dataTaskPhase,
                                    value: objValue ? { ...objValue } : nextState.TaskPhase.value,
                                    refresh: !TaskPhase.refresh
                                }
                            };
                        }

                        if (res['1']) {
                            let dataTaskGroup = [...res['1']],
                                objValue = dataTaskGroup.find((item) => item.ID === record.TaskGroupID);

                            nextState = {
                                ...nextState,
                                TaskGroup: {
                                    ...nextState.TaskGroup,
                                    data: dataTaskGroup,
                                    value: objValue ? { ...objValue } : nextState.TaskGroup.value,
                                    refresh: !TaskGroup.refresh
                                }
                            };
                        }
                    }

                    this.setState(nextState, () => {
                        this.loadMultiPersByChanges();
                    });
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            });
        }
    }

    //update data
    onUpdate = () => {
        const { params } = this.props.navigation.state;

        if (params) {
            const { update, reload } = params;
            if (update && typeof update === 'function') {
                update(reload);
            }
        }
    };

    //update value cho record
    onUpdateNewRecord = (obj) => {
        const { params } = this.props.navigation.state;

        if (params) {
            const { updateNewRecord } = params;
            if (updateNewRecord && typeof updateNewRecord === 'function') {
                updateNewRecord(obj);
            }
        }
    };

    //update Người liên quan khi thêm/xóa người liên quan ở tab Người liên quan
    onUpdatProfileIds = (taskID) => {
        HttpService.Post('[URI_HR]/Tas_GetData/GetTasPersonsConcernedList', { taskID }).then((data) => {
            if (data.Data.length > 0) {
                let dataPers = data.Data,
                    arrPers = [];

                for (let i = 0; i < dataPers.length; i++) {
                    if (dataPers[i].Role == 'E_PERSONSCONCERNED') {
                        let profile = { ...dataPers[i] };

                        arrPers.push({
                            ID: profile.ProfileID,
                            ProfileName: profile.ProfileName + ' - ' + profile.CodeEmp
                        });
                    }
                }

                if (arrPers.length > 0) {
                    //set value cho Người liên quan
                    const { ProfileIds } = this.state;

                    this.setState(
                        {
                            ProfileIds: {
                                ...ProfileIds,
                                value: [...arrPers],
                                refresh: !ProfileIds.refresh
                            }
                        },
                        () => {
                            let _obj = {
                                ProfileIds: arrPers.map((item) => item.ID).join()
                            };

                            this.onUpdateNewRecord(_obj);
                        }
                    );
                } else {
                    this.loadMultiPersByChanges();
                }
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
                this.onUpdateNewRecord({ TaskProjectID: item ? item.ID : null });

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
                this.onUpdateNewRecord({ TaskPhaseID: item ? item.Id : null });

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
                this.onUpdateNewRecord({ TaskGroupID: item ? item.ID : null });

                //load Danh sách mức độ
                // let tasTaskID = dataItem ? dataItem.ID : null;

                // VnrLoadingSevices.show();
                // HttpService.Post('[URI_HR]/Tas_GetData/GetTasTaskTaskLevelPortal?', {
                //     SampleTaskID: null,
                //     TaskGroupID: item ? item.ID : null,
                //     TaskID: tasTaskID,
                //     IsSpecifcTask: false
                // })
                //     .then(data => {
                //         VnrLoadingSevices.hide();
                //         try {
                //             if (data && data.Data) {
                //                 //this.setState({ ListTaskLevel: [...data.Data] });
                //             }
                //         } catch (error) {
                //             DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                //         }
                //     })

                this.loadMultiPersByChanges();
            }
        );
    };

    loadMultiPersByChanges = () => {
        const { TaskGroup, TaskPhase, TaskProject, dataItem } = this.state;

        let taskProjectID = TaskProject.value ? TaskProject.value.ID : '00000000-0000-0000-0000-000000000000',
            taskPhaseID = TaskPhase.value ? TaskPhase.value.Id : '00000000-0000-0000-0000-000000000000',
            taskGroupID = TaskGroup.value ? TaskGroup.value.ID : '00000000-0000-0000-0000-000000000000',
            taskID = dataItem ? dataItem.ID : null;

        //xử lý load người liên quan
        VnrLoadingSevices.show();
        HttpService.MultiRequest([
            HttpService.Post('[URI_HR]/Tas_GetData/GetPersonsConcernedByIds', {
                taskProjectID: taskProjectID,
                taskPhaseID: taskPhaseID,
                taskGroupID: taskGroupID
            }),
            HttpService.Post('[URI_HR]/Tas_GetData/GetTasPersonsConcernedList', { TaskID: taskID })
        ]).then((res) => {
            VnrLoadingSevices.hide();
            try {
                if (res) {
                    let arrPers = [];

                    if (res['1']) {
                        let data = res['1'];

                        if (data.Data.length > 0) {
                            let dataPers = data.Data;

                            for (let i = 0; i < dataPers.length; i++) {
                                if (dataPers[i].Role == 'E_PERSONSCONCERNED') {
                                    let profile = { ...dataPers[i] };

                                    arrPers.push({
                                        ID: profile.ProfileID,
                                        ProfileName: profile.ProfileName + ' - ' + profile.CodeEmp
                                    });
                                }
                            }
                        }
                    }

                    if (res['0']) {
                        let response = res['0'];

                        response.forEach((item1) => {
                            //check item1 đã có trong mảng arrPers chưa => add vào nếu chưa có
                            let findItem = arrPers.find((item) => item.ID == item1.ID);

                            if (!findItem) {
                                arrPers.push({ ...item1 });
                            }
                        });
                    }

                    //set value cho Người liên quan
                    const { ProfileIds } = this.state;
                    this.setState(
                        {
                            ProfileIds: {
                                ...ProfileIds,
                                value: [...arrPers],
                                refresh: !ProfileIds.refresh
                            }
                        },
                        () => {
                            let _obj = {
                                ProfileIds: arrPers.map((item) => item.ID).join()
                            };

                            this.onUpdateNewRecord(_obj);
                        }
                    );
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });

        //

        // HttpService.Post('[URI_HR]/Tas_GetData/GetPersonsConcernedByIds',
        //     {
        //         taskProjectID: taskProjectID,
        //         taskPhaseID: taskPhaseID,
        //         taskGroupID: taskGroupID
        //     })
        //     .then(response => {
        //         if (response && Array.isArray(response)) {
        //             this.setState({ ProfileIds: response });
        //         }
        //     })
    };

    render() {
        const {
            TaskName,
            TaskNameDisable,
            TaskProject,
            TaskPhase,
            TaskGroup,
            Type,
            Formula,
            ProfileIds,
            fieldValid,
            dataItem
        } = this.state;

        let TaskID = dataItem ? dataItem.ID : null;

        const { textLableInfo, contentViewControl, viewLable, viewControl } = stylesListPickerControl;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    {
                        <KeyboardAwareScrollView
                            contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                            keyboardShouldPersistTaps={'handled'}
                        >
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
                                            style={[
                                                styleSheets.textInput,
                                                { height: Size.heightInput },
                                                TaskNameDisable && styles.styViewTextInput
                                            ]}
                                            disable={TaskNameDisable}
                                            returnKeyType={'done'}
                                            value={TaskName}
                                            onChangeText={(text) =>
                                                this.setState({ TaskName: text }, () => {
                                                    this.onUpdateNewRecord({ TaskName: text });
                                                })
                                            }
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
                                            disable={TaskProject.disable}
                                            textField="TaskProjectName"
                                            valueField="ID"
                                            filter={true}
                                            refresh={TaskProject.refresh}
                                            filterServer={true}
                                            filterParams={'typeTaskId=' + TaskID + '&text'}
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
                                            disable={TaskPhase.disable}
                                            dataLocal={TaskPhase.data}
                                            textField="TaskPhaseName"
                                            valueField="Id"
                                            filter={true}
                                            refresh={TaskPhase.refresh}
                                            filterServer={false}
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
                                            disable={TaskGroup.disable}
                                            dataLocal={TaskGroup.data}
                                            textField="TaskGroupName"
                                            valueField="ID"
                                            filter={true}
                                            refresh={TaskGroup.refresh}
                                            filterServer={false}
                                            value={TaskGroup.value}
                                            onFinish={(item) => this.onChangeTaskGroup(item)}
                                        />
                                    </View>
                                </View>
                            }

                            {/* công thức - Formula */}
                            {
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Tas_Task_Formula'}
                                        />

                                        {/* valid FormulaID */}
                                        {fieldValid.FormulaID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            disable={Formula.disable}
                                            api={{
                                                urlApi: '[URI_HR]/Tas_GetData/GetMultiNameEntityOfTypeAll',
                                                type: 'E_GET'
                                            }}
                                            textField="NameEntityNameAndCode"
                                            valueField="ID"
                                            filter={true}
                                            refresh={Formula.refresh}
                                            filterServer={true}
                                            filterParams="text"
                                            value={Formula.value}
                                            onFinish={(item) =>
                                                this.setState(
                                                    {
                                                        Formula: {
                                                            ...Formula,
                                                            value: item
                                                        }
                                                    },
                                                    () => {
                                                        this.onUpdateNewRecord({ FormulaID: item ? item.ID : null });
                                                    }
                                                )
                                            }
                                        />
                                    </View>
                                </View>
                            }

                            {/* Người liên quan - ProfileIds */}
                            {
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Tas_Task_PersonsConcerned'}
                                        />

                                        {/* valid ProfileIds */}
                                        {fieldValid.ProfileIds && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPickerMulti
                                            disable={ProfileIds.disable}
                                            api={{
                                                urlApi: '[URI_HR]/Hre_GetData/GetMultiProfile',
                                                type: 'E_GET'
                                            }}
                                            value={ProfileIds.value}
                                            refresh={ProfileIds.refresh}
                                            textField="ProfileName"
                                            valueField="ID"
                                            filter={true}
                                            filterServer={true}
                                            filterParams="text"
                                            onFinish={(items) => {
                                                this.setState(
                                                    {
                                                        ProfileIds: {
                                                            ...ProfileIds,
                                                            value: items
                                                        }
                                                    },
                                                    () => {
                                                        let obj = {
                                                            ProfileIds: items
                                                                ? items.map((item) => item.ID).join()
                                                                : null
                                                        };

                                                        this.onUpdateNewRecord(obj);
                                                    }
                                                );
                                            }}
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

                                        {/* valid Type */}
                                        {fieldValid.Type && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPickerQuickly
                                            disable={Type.disable}
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
                                                this.setState(
                                                    {
                                                        Type: {
                                                            ...Type,
                                                            value: item
                                                        }
                                                    },
                                                    () => {
                                                        this.onUpdateNewRecord({ Type: item ? item.Value : null });
                                                    }
                                                )
                                            }
                                        />
                                    </View>
                                </View>
                            }
                        </KeyboardAwareScrollView>
                    }

                    {/* bottom button save */}
                    <View style={styles.groupButton}>
                        <TouchableOpacity onPress={() => this.onUpdate()} style={styles.groupButton__button_save}>
                            <IconPublish size={Size.iconSize} color={Colors.white} />
                            <VnrText
                                style={[styleSheets.lable, styles.groupButton__text]}
                                i18nKey={'HRM_Common_Save'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    styViewTextInput: {
        backgroundColor: Colors.greyPrimaryConstraint,
        opacity: 0.7
    },
    groupButton: {
        flexGrow: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: styleSheets.p_10,
        backgroundColor: Colors.white,
        marginTop: 10,
        marginBottom: 10
    },
    groupButton__button_save: {
        height: Size.heightButton,
        borderRadius: styleSheets.radius_5,
        backgroundColor: Colors.primary,
        flex: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    groupButton__text: {
        marginLeft: 5,
        color: Colors.white
    }
});
