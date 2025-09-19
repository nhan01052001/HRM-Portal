import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
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
} from '../../../../../constants/styleConfig';
import { IconPublish, IconPrev } from '../../../../../constants/Icons';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import VnrDate from '../../../../../components/VnrDate/VnrDate';
import VnrPicker from '../../../../../components/VnrPicker/VnrPicker';
import HttpService from '../../../../../utils/HttpService';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import VnrAttachFile from '../../../../../components/VnrAttachFile/VnrAttachFile';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import DrawerServices from '../../../../../utils/DrawerServices';
import VnrPickerMulti from '../../../../../components/VnrPickerMulti/VnrPickerMulti';

let profileInfo = null;

export default class HreTaskCreateSaveNotModel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            TaskName: null,
            Code: null,
            Formula: {
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
            ExpectedDate: null,
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
            Note: null,
            AssignmentDateRefresh: false,
            ProfileIds: {
                visible: true,
                disable: false,
                refresh: false,
                value: null
            },
            fieldValid: {}
        };

        //check processing cho nhấn lưu nhiều lần
        this.isProcessing = false;
    }

    componentDidMount() {
        const { dataConfirm } = this.props.navigation.state.params;

        //get config validate
        this.getConfigValid('Hre_Tas_Task').then(resAll => {
            const [res, FormulaData] = resAll;

            let nextState = { ...dataConfirm };

            if (res) {
                try {
                    nextState = {
                        ...nextState,
                        fieldValid: res
                    };

                    profileInfo = dataVnrStorage
                        ? dataVnrStorage.currentUser
                            ? dataVnrStorage.currentUser.info
                            : null
                        : null;

                    const { AssignmentDateRefresh, ProfileIds, Evaluator } = this.state,
                        _ProfileIds = dataConfirm.ProfileIds;

                    nextState = {
                        ...nextState,
                        Evaluator: {
                            ...Evaluator,
                            value: {
                                ID: profileInfo ? profileInfo.ProfileID : null,
                                ProfileName: profileInfo ? profileInfo.FullName : null
                            },
                            refresh: !Evaluator.refresh
                        },
                        AssignmentDateRefresh: !AssignmentDateRefresh
                    };

                    if (_ProfileIds && _ProfileIds.length) {
                        nextState = {
                            ...nextState,
                            ProfileIds: {
                                ...ProfileIds,
                                value: [..._ProfileIds],
                                refresh: !ProfileIds.refresh
                            }
                        };
                    }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            }

            //Formula
            if (FormulaData && Array.isArray(FormulaData)) {
                const { Formula } = this.state,
                    obj = { ...FormulaData[0] };

                if (obj) {
                    nextState = {
                        ...nextState,
                        Formula: {
                            ...Formula,
                            value: { ID: obj.ID, NameEntityNameAndCode: obj.NameEntityName },
                            refresh: !Formula.refresh
                        }
                    };
                }
            }
            this.setState(nextState);
        });
    }

    //get config valid
    getConfigValid = tblName => {
        return HttpService.MultiRequest([
            HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + tblName),
            HttpService.Get('[URI_HR]//Tas_GetData/GetMultiNameEntityOfTypeAll')
        ]);
    };

    createTask = () => {
        const {
            TaskName,
            Evaluator,
            ExpectedDate,
            FileAttach,
            AssignmentDate,
            Content,
            TaskProject,
            TaskPhase,
            TaskGroup,
            Type,
            StatusView,
            Formula,
            CreatorID,
            PICID,
            ProfileIds,
            ListTasTaskKPI,
            ListTaskLevel
        } = this.state;

        let params = {
            TaskName,
            Content: Content.value,
            AssignmentDate: AssignmentDate ? moment(AssignmentDate).format('YYYY-MM-DD HH:mm:ss') : null,
            ExpectedDate: ExpectedDate ? moment(ExpectedDate).format('YYYY-MM-DD HH:mm:ss') : null,
            TaskProjectID: TaskProject.value ? TaskProject.value.ID : null,
            TaskPhaseID: TaskPhase.value ? TaskPhase.value.Id : null,
            TaskGroupID: TaskGroup.value ? TaskGroup.value.ID : null,
            Type: Type.value ? Type.value.Value : null,
            Status: 'E_SUBMIT',
            StatusView,
            FormulaID: Formula.value ? Formula.value.ID : null,
            CreatorID,
            PICID: PICID.value ? PICID.value.ID : null,
            EvaluatorId: Evaluator.value ? Evaluator.value.ID : null,
            IsPortal: true,
            UserSubmit: CreatorID,
            FileAttach: FileAttach.value ? FileAttach.value.map(item => item.fileName).join() : null,
            ListTaskLevel: ListTaskLevel,
            ListTasTaskKPI: ListTasTaskKPI,
            ProfileIds: ProfileIds.value ? ProfileIds.value.map(item => item.ID).join() : null,
            IsSaveAndNotice: true
        };

        VnrLoadingSevices.show();

        HttpService.Post('[URI_HR]/api/Tas_Task', params).then(data => {
            VnrLoadingSevices.hide();

            try {
                if (data.ActionStatus != 'Success') {
                    ToasterSevice.showWarning(data.ActionStatus);
                } else {
                    ToasterSevice.showSuccess('Hrm_Succeed');
                    this.setState(
                        {
                            dataItem: { ...data }
                        },
                        () => {
                            DrawerServices.navigate('HreTaskAddTargetAndLevelForEva', { dataConfirm: this.state });
                        }
                    );

                    //create Note
                    this.createNote(data);
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    //create Note
    createNote = data => {
        const { Note } = this.state;

        if (Note && Note !== '') {
            let params = {
                TaskID: data.ID,
                CreatorID: data.CreatorID,
                Content: Note
            };

            HttpService.Post('[URI_HR]/api/Tas_TaskNote', params);
        }
    };

    render() {
        const {
            Note,
            Formula,
            AssignmentDate,
            ExpectedDate,
            AssignmentDateRefresh,
            PICID,
            FileAttach,
            Content,
            Evaluator,
            ProfileIds,
            fieldValid
        } = this.state;

        const { textLableInfo, contentViewControl, viewLable, viewControl } = stylesListPickerControl;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    {
                        <KeyboardAwareScrollView
                            keyboardShouldPersistTaps={'handled'}
                            contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                        >
                            {/* Ngày giao -  AssignmentDate */}
                            {
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Hre_Tas_Task_DateGive'}
                                        />

                                        {/* valid AssignmentDate */}
                                        {fieldValid.AssignmentDate && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrDate
                                            response={'string'}
                                            format={'DD/MM/YYYY'}
                                            refresh={AssignmentDateRefresh}
                                            value={AssignmentDate}
                                            type={'date'}
                                            onFinish={value => this.setState({ AssignmentDate: value })}
                                        />
                                    </View>
                                </View>
                            }

                            {/* Ngày mong đợi -  ExpectedDate */}
                            {
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Tas_Task_ExpectedDate'}
                                        />

                                        {/* valid ExpectedDate */}
                                        {fieldValid.ExpectedDate && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrDate
                                            response={'string'}
                                            format={'DD/MM/YYYY'}
                                            value={ExpectedDate}
                                            type={'date'}
                                            onFinish={value => this.setState({ ExpectedDate: value })}
                                        />
                                    </View>
                                </View>
                            }

                            {/* Người được phân công - PICID */}
                            {
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Tas_Task_AssignedEmpID'}
                                        />

                                        {/* valid PICID */}
                                        {fieldValid.PICID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            api={{
                                                urlApi: '[URI_HR]/Hre_GetData/GetMultiProfileAll',
                                                type: 'E_GET'
                                            }}
                                            textField="ProfileName"
                                            valueField="ID"
                                            filter={true}
                                            refresh={PICID.refresh}
                                            value={PICID.value}
                                            filterServer={true}
                                            filterParams="text"
                                            onFinish={item =>
                                                this.setState({
                                                    PICID: {
                                                        ...PICID,
                                                        value: item
                                                        //refresh: !PICID.refresh
                                                    }
                                                })
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
                                            onFinish={items =>
                                                this.setState({
                                                    ProfileIds: {
                                                        ...ProfileIds,
                                                        value: items
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            }

                            {/* Người đánh giá - Evaluator */}
                            {
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Tas_Task_Evaluator'}
                                        />

                                        {/* valid EvaluatorId */}
                                        {fieldValid.EvaluatorId && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            api={{
                                                urlApi: '[URI_HR]/Hre_GetData/GetMultiProfileAll',
                                                type: 'E_GET'
                                            }}
                                            textField="ProfileName"
                                            valueField="ID"
                                            filter={true}
                                            refresh={Evaluator.refresh}
                                            value={Evaluator.value}
                                            filterServer={true}
                                            autoBind={true}
                                            filterParams="text"
                                            onFinish={item =>
                                                this.setState({
                                                    Evaluator: {
                                                        ...Evaluator,
                                                        value: item
                                                        //refresh: !Evaluator.refresh
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            }

                            {/* Công thức - Formula */}
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
                                            onFinish={item =>
                                                this.setState({
                                                    Formula: {
                                                        ...Formula,
                                                        value: item
                                                        //refresh: !Formula.refresh
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            }

                            {/* Tập tin đính kèm - FileAttach */}
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Rec_JobVacancy_FileAttachment'}
                                    />
                                </View>
                                <View style={viewControl}>
                                    <VnrAttachFile
                                        disable={FileAttach.disable}
                                        refresh={FileAttach.refresh}
                                        value={FileAttach.value}
                                        multiFile={true}
                                        uri={'[URI_POR]/New_Home/saveFileFromApp'}
                                        onFinish={file => {
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

                            {/* Nội dung - Content */}
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Tas_Task_Content'}
                                    />

                                    {/* valid Content */}
                                    {fieldValid.Content && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>

                                <View style={viewControl}>
                                    <VnrTextInput
                                        value={Content}
                                        onChangeText={text =>
                                            this.setState({
                                                Content: {
                                                    ...Content,
                                                    value: text
                                                }
                                            })
                                        }
                                        multiline={true}
                                        style={[
                                            styleSheets.text,
                                            styles.styTextInputContent
                                        ]}
                                        returnKeyType={'done'}
                                    />
                                </View>
                            </View>

                            {/* Ghi chú - Note */}
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Tas_Task_NoteHistory'}
                                    />

                                    {/* valid Note */}
                                    {fieldValid.Note && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>

                                <View style={viewControl}>
                                    <VnrTextInput
                                        value={Note}
                                        onChangeText={text => this.setState({ Note: text })}
                                        multiline={true}
                                        numberOfLines={5}
                                        returnKeyType={'done'}
                                    />
                                </View>
                            </View>
                        </KeyboardAwareScrollView>
                    }

                    {/* bottom button close, confirm */}
                    <View style={styleButtonAddOrEdit.groupButton}>
                        <TouchableOpacity
                            onPress={() => DrawerServices.goBack()}
                            style={[styleButtonAddOrEdit.btnClose]}
                        >
                            <IconPrev size={Size.iconSize} color={Colors.black} />
                            <VnrText
                                style={[
                                    styleSheets.lable,
                                    styleButtonAddOrEdit.groupButton__text,
                                    { color: Colors.greySecondary }
                                ]}
                                i18nKey={'HRM_Common_GoBack'}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => this.createTask()}
                            style={styleButtonAddOrEdit.groupButton__button_save}
                        >
                            <IconPublish size={Size.iconSize} color={Colors.white} />
                            <View style={CustomStyleSheet.flex(1)}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.lable, styleButtonAddOrEdit.groupButton__text]}
                                    i18nKey={'HRM_Common_Save_And_Next_Action'}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    styTextInputContent: { minHeight: 60,
        borderWidth: 0.5,
        borderColor: Colors.grey,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 10
    }
})