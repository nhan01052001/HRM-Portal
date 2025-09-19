/* eslint-disable no-constant-condition */
import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    Colors,
    styleSafeAreaView,
    stylesListPickerControl,
    styleValid,
    Size,
    stylesScreenDetailV2,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrPicker from '../../../../../components/VnrPicker/VnrPicker';
import HttpService from '../../../../../utils/HttpService';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ConfigField } from '../../../../../assets/configProject/ConfigField';
import DrawerServices from '../../../../../utils/DrawerServices';
import { EnumName } from '../../../../../assets/constant';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';
import { translate } from '../../../../../i18n/translate';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import VnrAttachFile from '../../../../../components/VnrAttachFile/VnrAttachFile';
import moment from 'moment';

export default class HreApproveEvaluationDocDocument extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ProfileID: {
                ID: null,
                ProfileName: '',
                disable: true,
                label: 'HRM_Attendance_ProfileName'
            },
            DocAssessmentResultID: {
                label: 'EvaDocEvaluationType',
                api: {
                    urlApi: '[URI_HR]/Cat_GetData/GetlstEvaluateResultByEvaluateType',
                    type: 'E_GET'
                },
                valueField: 'ID',
                textField: 'AssessmentResultName',
                data: [],
                disable: false,
                refresh: false,
                value: null,
                visibleConfig: true,
                visible: true
            },
            AssessmentNote1: {
                label: 'HRM_Hre_EvaluationDoc_AssessmentNote',
                disable: false,
                refresh: false,
                value: null,
                visible: false,
                visibleConfig: true
            },
            AssessmentNote2: {
                label: 'HRM_Hre_EvaluationDoc_AssessmentNote',
                disable: false,
                refresh: false,
                value: null,
                visible: false,
                visibleConfig: true
            },
            AssessmentNote3: {
                label: 'HRM_Hre_EvaluationDoc_AssessmentNote',
                disable: false,
                refresh: false,
                value: null,
                visible: false,
                visibleConfig: true
            },
            AssessmentNote4: {
                label: 'HRM_Hre_EvaluationDoc_AssessmentNote',
                disable: false,
                refresh: false,
                value: null,
                visible: false,
                visibleConfig: true
            },
            Attachment: {
                label: 'HRM_HR_Reward_Attachment',
                visible: true,
                visibleConfig: true,
                disable: true,
                refresh: false,
                value: null
            },
            UserComment1: {
                label: 'HRM_Rec_JobVacancy_UserComment1',
                disable: true,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            UserComment2: {
                label: 'HRM_Rec_JobVacancy_UserComment2',
                disable: true,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            UserComment3: {
                label: 'HRM_Rec_JobVacancy_UserComment3',
                disable: true,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            UserComment4: {
                label: 'HRM_Rec_JobVacancy_UserComment4',
                disable: true,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            Note: {
                label: 'HRM_Cat_RewardPeriod_Note',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            CommentList: [],
            fieldValid: {}
        };

        //set title screen
        props.navigation.setParams({ title: 'HRM_Hre_EvaluationDoc_ApprovePopup' });

        //biến trạng thái
        this.isModify = false;
        //check processing cho nhấn lưu nhiều lần
        this.isProcessing = false;

        this.levelApproved = null;
        this.isOnlyOneLevelApprove = null;
    }

    //#region [khởi tạo - lấy các dữ liệu cho control, lấy giá trị mặc đinh]

    //promise get config valid
    getConfigValid = (tblName) => {
        return HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + tblName);
    };

    componentDidMount() {
        //get config validate
        VnrLoadingSevices.show();
        this.getConfigValid('Hre_EvaluationDocument').then((res) => {
            VnrLoadingSevices.hide();
            if (res) {
                try {
                    //map field hidden by config
                    const _configField =
                        ConfigField && ConfigField.value['HreApproveEvaluationDocDocument']
                            ? ConfigField.value['HreApproveEvaluationDocDocument']['Hidden']
                            : [];

                    let nextState = { fieldValid: res };

                    _configField.forEach((fieldConfig) => {
                        let _field = this.state[fieldConfig];
                        if (_field && typeof _field === 'object') {
                            _field = {
                                ..._field,
                                visibleConfig: false
                            };

                            nextState = {
                                ...nextState,
                                [fieldConfig]: { ..._field }
                            };
                        }
                    });

                    this.setState({ ...nextState }, () => {
                        let { recordID } = this.props.navigation.state.params;

                        this.isModify = true;
                        this.getRecordAndConfigByID(recordID, this.handleSetState);
                    });
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            }
        });
    }

    getRecordAndConfigByID = (recordID, _handleSetState) => {
        let arrRequest = [
            HttpService.Post('[URI_HR]/Por_GetData/GetEvaluationDocumentById', { id: recordID }),
            HttpService.Post('[URI_SYS]/Sys_GetData/GetCommentList', { TableRecordID: recordID }),
            HttpService.Post('[URI_HR]/Hre_GetData/getStatusApproveEvaluationDoc', { ID: recordID })
        ];

        VnrLoadingSevices.show();
        HttpService.MultiRequest(arrRequest).then((resAll) => {
            VnrLoadingSevices.hide();
            try {
                _handleSetState(resAll);
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    handleSetState = (resAll) => {
        const {
                ProfileID,
                DocAssessmentResultID,
                AssessmentNote1,
                AssessmentNote2,
                AssessmentNote3,
                AssessmentNote4,
                Attachment,
                UserComment1,
                UserComment2,
                UserComment3,
                UserComment4,
                Note
            } = this.state,
            item = resAll[0],
            dataComments = resAll[1],
            statusApproveEvaluationDoc = resAll[2];

        let nextState = {};

        nextState = {
            record: item,
            ID: item.ID,
            ProfileID: {
                ...ProfileID,
                ID: item.ProfileID,
                ProfileName: item.ProfileName
            },
            DocAssessmentResultID: {
                ...DocAssessmentResultID,
                refresh: !DocAssessmentResultID.refresh
            },
            AssessmentNote1: {
                ...AssessmentNote1,
                value: item.AssessmentNote1,
                visible:
                    statusApproveEvaluationDoc == 'E_SUBMIT' || statusApproveEvaluationDoc == 'E_WAITAPPROVE'
                        ? true
                        : false,
                refresh: !AssessmentNote1.refresh
            },
            AssessmentNote2: {
                ...AssessmentNote2,
                value: item.AssessmentNote2,
                visible: statusApproveEvaluationDoc == 'E_APPROVED1' ? true : false,
                refresh: !AssessmentNote2.refresh
            },
            AssessmentNote3: {
                ...AssessmentNote3,
                value: item.AssessmentNote3,
                visible: statusApproveEvaluationDoc == 'E_APPROVED2' ? true : false,
                refresh: !AssessmentNote3.refresh
            },
            AssessmentNote4: {
                ...AssessmentNote4,
                value: item.AssessmentNote4,
                visible: statusApproveEvaluationDoc == 'E_APPROVED3' ? true : false,
                refresh: !AssessmentNote4.refresh
            },
            Attachment: {
                ...Attachment,
                value: item.lstFileAttach,
                refresh: !Attachment.refresh
            },
            UserComment1: {
                ...UserComment1,
                value: item.UserCommentName1,
                refresh: !UserComment1.refresh
            },
            UserComment2: {
                ...UserComment2,
                value: item.UserCommentName2,
                refresh: !UserComment1.refresh
            },
            UserComment3: {
                ...UserComment3,
                value: item.UserCommentName3,
                refresh: !UserComment1.refresh
            },
            UserComment4: {
                ...UserComment4,
                value: item.UserCommentName4,
                refresh: !UserComment1.refresh
            },
            Note: {
                ...Note,
                value: item.Note,
                refresh: !Note.refresh
            },
            CommentList: dataComments
        };

        this.setState(nextState, () => {
            if (item.EvaluationType && item.EvaluationType !== '') {
                VnrLoadingSevices.show();
                HttpService.Post('[URI_HR]/Cat_GetData/GetlstEvaluateResultByEvaluateType', {
                    EvaluateType: item.EvaluationType
                }).then((data) => {
                    VnrLoadingSevices.hide();

                    const { DocAssessmentResultID } = this.state;

                    if (data != null && data.length > 0) {
                        this.setState({
                            DocAssessmentResultID: {
                                ...DocAssessmentResultID,
                                data: [...data],
                                refresh: !DocAssessmentResultID.refresh
                            }
                        });
                    } else {
                        //ko có data nghĩa là nhóm này ko có tiêu chí nào
                        this.setState({
                            DocAssessmentResultID: {
                                ...DocAssessmentResultID,
                                data: [],
                                refresh: !DocAssessmentResultID.refresh
                            }
                        });
                    }
                });
            }
        });
    };
    //#endregion

    onChangeDocAssessmentResultID = (item) => {
        const { DocAssessmentResultID } = this.state;
        this.setState({
            DocAssessmentResultID: {
                ...DocAssessmentResultID,
                value: item,
                refresh: !DocAssessmentResultID.refresh
            }
        });
    };

    renderCommentList = (commentList) => {
        if (commentList && commentList.length > 0) {
            const { contentViewControl } = stylesListPickerControl;

            return commentList.map((item, index) => {
                let timeView = '';

                if (item.DateUpdate) {
                    let dateUpdated = item.DateUpdate ? moment(item.DateUpdate).format('DD/MM/YYYY') : '',
                        dateCalculate = item.DateUpdate ? moment(item.DateUpdate).format('MM/DD/YYYY HH:mm:ss') : '',
                        timeUnit = '';

                    if (dateCalculate != '') {
                        let newDate = new Date(),
                            dateCalculateFormated = new Date(Date.parse(dateCalculate)),
                            result = newDate - dateCalculateFormated;

                        if (result < 0) {
                            result = 0;
                        }

                        let minutes = Math.floor(result / 60000),
                            hours = Math.floor((result / (1000 * 60 * 60)) % 24),
                            fnresult = minutes;

                        if (fnresult < 60) {
                            dateUpdated = minutes;
                            timeUnit = translate('MinutesAgo');
                        } else if (fnresult >= 60 && fnresult < 1440) {
                            dateUpdated = hours;
                            timeUnit = translate('HoursAgo');
                        }
                    }

                    timeView = '(' + dateUpdated + ' ' + timeUnit + ')';
                }

                let imageAvatar = '';
                if (item.ImagePath) {
                    imageAvatar = { uri: item.ImagePath };
                }

                return (
                    <View key={index} style={contentViewControl}>
                        <View style={styles.styViewContentControl}>
                            <View style={styles.styImageWrap}>
                                <Image style={styles.styViewImage} source={imageAvatar} />
                            </View>

                            <VnrText
                                style={[styleSheets.text, CustomStyleSheet.fontWeight('600')]}
                                i18nKey={item.CreatorName}
                            />

                            <VnrText style={[styleSheets.text, styles.styTimeita]} i18nKey={timeView} />
                        </View>

                        <VnrText style={[styleSheets.text, styles.styTextContent]} i18nKey={item.Content} />
                    </View>
                );
            });
        } else {
            return (
                <VnrText style={[styleSheets.text, styles.styTextFontIta]} i18nKey={'HRM_Sys_Comment_EmptyComment'} />
            );
        }
    };

    onSave = (navigation, isCreate, isSend) => {
        if (this.isProcessing) {
            return;
        }

        this.isProcessing = true;

        const {
            record,
            ProfileID,
            DocAssessmentResultID,
            AssessmentNote1,
            AssessmentNote2,
            AssessmentNote3,
            AssessmentNote4,
            Attachment,
            // UserComment1,
            // UserComment2,
            // UserComment3,
            // UserComment4,
            Note
        } = this.state;

        let param = {
            ID: record.ID,
            ProfileID: ProfileID.ID,
            DocAssessmentResultID: DocAssessmentResultID.value ? DocAssessmentResultID.value.ID : null,
            AssessmentNote1: AssessmentNote1.value,
            AssessmentNote2: AssessmentNote2.value,
            AssessmentNote3: AssessmentNote3.value,
            AssessmentNote4: AssessmentNote4.value,
            UserComment1: record.UserComment1,
            UserComment2: record.UserComment2,
            UserComment3: record.UserComment3,
            UserComment4: record.UserComment4,
            Note: Note.value,
            IsPortal: true,
            // Status: 'E_SUBMIT',
            Attachment: Attachment.value ? Attachment.value.map((item) => item.fileName).join(',') : null,
            UserSubmitID: ProfileID.ID,
            UserSubmit: ProfileID.ID
        };

        if (isSend) {
            param = {
                ...param,
                isSendMail: true
            };
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Hre_GetData/saveAndApproveEvaluationDoc', param).then((data) => {
            VnrLoadingSevices.hide();

            //xử lý lại event Save
            this.isProcessing = false;

            if (data) {
                if (data.ActionStatus == 'Success') {
                    ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                    navigation.navigate('HreApproveEvaluationDoc');

                    const { reload } = this.props.navigation.state.params;
                    if (reload && typeof reload == 'function') {
                        reload();
                    }
                } else {
                    ToasterSevice.showWarning(data.ActionStatus);
                }
            }
        });
    };

    onSaveAndSend = (navigation) => {
        this.onSave(navigation, null, true);
    };

    render() {
        const {
                ProfileID,
                DocAssessmentResultID,
                AssessmentNote1,
                AssessmentNote2,
                AssessmentNote3,
                AssessmentNote4,
                Attachment,
                UserComment1,
                UserComment2,
                UserComment3,
                UserComment4,
                Note,
                CommentList,
                fieldValid
            } = this.state,
            { textLableInfo, contentViewControl, viewLable, viewControl, viewInputMultiline } = stylesListPickerControl,
            stylesDetailV2 = stylesScreenDetailV2;

        //#region [Xử lý 3 nút lưu]
        const listActions = [];

        if (true) {
            listActions.push({
                type: EnumName.E_SAVE_SENMAIL,
                title: translate('HRM_Common_SaveAndSendMail'),
                onPress: () => this.onSaveAndSend(this.props.navigation)
            });
        }

        if (true) {
            listActions.push({
                type: EnumName.E_SAVE_CLOSE,
                title: translate('HRM_Common_SaveClose'),
                onPress: () => this.onSave(this.props.navigation)
            });
        }

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps={'handled'}
                        contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                    >
                        {/* Tên nhân viên -  ProfileName*/}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={ProfileID.label} />

                                {/* valid ProfileID */}
                                {fieldValid.ProfileID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                            </View>
                            <View style={viewControl}>
                                <VnrTextInput disable={ProfileID.disable} value={ProfileID.ProfileName} />
                            </View>
                        </View>

                        {/* Kết quả đánh giá - DocAssessmentResultID */}
                        {DocAssessmentResultID.visibleConfig && DocAssessmentResultID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={DocAssessmentResultID.label}
                                    />

                                    {/* valid DocAssessmentResultID */}
                                    {fieldValid.DocAssessmentResultID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        dataLocal={DocAssessmentResultID.data}
                                        refresh={DocAssessmentResultID.refresh}
                                        textField={DocAssessmentResultID.textField}
                                        valueField={DocAssessmentResultID.valueField}
                                        filter={true}
                                        value={DocAssessmentResultID.value}
                                        filterServer={false}
                                        disable={DocAssessmentResultID.disable}
                                        onFinish={(item) => this.onChangeDocAssessmentResultID(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ghi chú người đánh giá -  AssessmentNote1*/}
                        {AssessmentNote1.visibleConfig && AssessmentNote1.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={AssessmentNote1.label}
                                    />
                                    {fieldValid.AssessmentNote1 && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={AssessmentNote1.disable}
                                        refresh={AssessmentNote1.refresh}
                                        value={AssessmentNote1.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                AssessmentNote1: {
                                                    ...AssessmentNote1,
                                                    value: text,
                                                    refresh: !AssessmentNote1.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ghi chú người đánh giá -  AssessmentNote2*/}
                        {AssessmentNote2.visibleConfig && AssessmentNote2.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={AssessmentNote2.label}
                                    />
                                    {fieldValid.AssessmentNote2 && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={AssessmentNote2.disable}
                                        refresh={AssessmentNote2.refresh}
                                        value={AssessmentNote2.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                AssessmentNote2: {
                                                    ...AssessmentNote2,
                                                    value: text,
                                                    refresh: !AssessmentNote2.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ghi chú người đánh giá -  AssessmentNote3*/}
                        {AssessmentNote3.visibleConfig && AssessmentNote3.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={AssessmentNote3.label}
                                    />
                                    {fieldValid.AssessmentNote3 && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={AssessmentNote3.disable}
                                        refresh={AssessmentNote3.refresh}
                                        value={AssessmentNote3.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                AssessmentNote3: {
                                                    ...AssessmentNote3,
                                                    value: text,
                                                    refresh: !AssessmentNote3.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ghi chú người đánh giá -  AssessmentNote4*/}
                        {AssessmentNote4.visibleConfig && AssessmentNote4.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={AssessmentNote4.label}
                                    />
                                    {fieldValid.AssessmentNote4 && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={AssessmentNote4.disable}
                                        refresh={AssessmentNote4.refresh}
                                        value={AssessmentNote4.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                AssessmentNote4: {
                                                    ...AssessmentNote4,
                                                    value: text,
                                                    refresh: !AssessmentNote4.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Tập tin đính kèm - Attachment */}
                        {Attachment.visible && Attachment.visibleConfig && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Attachment.label} />
                                </View>
                                <View style={viewControl}>
                                    <VnrAttachFile
                                        disable={Attachment.disable}
                                        refresh={Attachment.refresh}
                                        value={Attachment.value}
                                        multiFile={true}
                                        uri={'[URI_POR]/New_Home/saveFileFromApp'}
                                        onFinish={(file) => {
                                            this.setState({
                                                Attachment: {
                                                    ...Attachment,
                                                    value: file
                                                }
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Cấp bình luận 1 -  UserComment1*/}
                        {UserComment1.visibleConfig && UserComment1.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={UserComment1.label} />
                                    {fieldValid.UserComment1 && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={UserComment1.disable}
                                        refresh={UserComment1.refresh}
                                        value={UserComment1.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                UserComment1: {
                                                    ...UserComment1,
                                                    value: text,
                                                    refresh: !UserComment1.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Cấp bình luận 2 -  UserComment2*/}
                        {UserComment2.visibleConfig && UserComment2.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={UserComment2.label} />
                                    {fieldValid.UserComment2 && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={UserComment2.disable}
                                        refresh={UserComment2.refresh}
                                        value={UserComment2.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                UserComment2: {
                                                    ...UserComment2,
                                                    value: text,
                                                    refresh: !UserComment2.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Cấp bình luận 3 -  UserComment3*/}
                        {UserComment3.visibleConfig && UserComment3.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={UserComment3.label} />
                                    {fieldValid.UserComment3 && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={UserComment3.disable}
                                        refresh={UserComment3.refresh}
                                        value={UserComment3.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                UserComment3: {
                                                    ...UserComment3,
                                                    value: text,
                                                    refresh: !UserComment3.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Cấp bình luận 4 -  UserComment4*/}
                        {UserComment4.visibleConfig && UserComment4.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={UserComment4.label} />
                                    {fieldValid.UserComment4 && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={UserComment4.disable}
                                        refresh={UserComment4.refresh}
                                        value={UserComment4.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                UserComment4: {
                                                    ...UserComment4,
                                                    value: text,
                                                    refresh: !UserComment4.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ghi chú -  Note*/}
                        {Note.visibleConfig && Note.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Note.label} />
                                    {fieldValid.Note && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={Note.disable}
                                        refresh={Note.refresh}
                                        value={Note.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                Note: {
                                                    ...Note,
                                                    value: text,
                                                    refresh: !Note.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        <View
                            style={[
                                stylesDetailV2.styItemContentGroup,
                                {
                                    paddingHorizontal: Size.defineSpace
                                }
                            ]}
                        >
                            <View style={[styleSheets.viewLable, styles.styViewLableExtend]}>
                                <VnrText
                                    style={[styleSheets.text, stylesDetailV2.styTextGroup, { color: Colors.primary_7 }]}
                                    i18nKey={'HRM_Sys_ConfigGeneral_TabComment'}
                                />
                            </View>

                            <View>{this.renderCommentList(CommentList)}</View>
                        </View>
                    </KeyboardAwareScrollView>

                    <ListButtonSave listActions={listActions} />
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    styViewLableExtend: { borderBottomWidth: 1, borderBottomColor: Colors.primary_7 },
    styTextFontIta: { fontStyle: 'italic' },
    styTextContent: { backgroundColor: Colors.gray_3, paddingHorizontal: 7, paddingVertical: 7, marginTop: 7 },
    styTimeita: { fontStyle: 'italic', marginLeft: 5 },
    styViewImage: {
        width: Size.deviceWidth * 0.11,
        height: Size.deviceWidth * 0.11,
        resizeMode: 'cover',
        maxWidth: 20,
        maxHeight: 20,
        borderRadius: 5
    },
    styImageWrap: { borderRadius: 5, maxWidth: 20, maxHeight: 20, marginRight: 5 },
    styViewContentControl: { flexDirection: 'row', alignItems: 'center' }
});
