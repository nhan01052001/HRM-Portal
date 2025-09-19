import React, { Component } from 'react';
import { View } from 'react-native';
import { CustomStyleSheet, styleSheets, stylesVnrPickerV3 } from '../../../../../../../constants/styleConfig';
import VnrText from '../../../../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../../../../componentsV3/VnrTextInput/VnrTextInput';
import VnrAttachFile from '../../../../../../../componentsV3/VnrAttachFile/VnrAttachFile';
import { EnumName } from '../../../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../../../assets/auth/authentication';
import styleComonAddOrEdit from '../../../../../../../constants/styleComonAddOrEdit';
import VnrDate from '../../../../../../../componentsV3/VnrDate/VnrDate';
import Vnr_Function from '../../../../../../../utils/Vnr_Function';
import format from 'number-format.js';
import ManageFileSevice from '../../../../../../../utils/ManageFileSevice';
import HttpService from '../../../../../../../utils/HttpService';
import VnrPickerLittle from '../../../../../../../componentsV3/VnrPickerLittle/VnrPickerLittle';

const initSateDefault = {
    Profile: {
        ID: null,
        ProfileName: ''
    },
    Knowledge: {
        lable: 'HRM_PortalApp_Interview_Kno',
        disable: false,
        refresh: false,
        value: '',
        visible: true,
        visibleConfig: true
    },
    Skill: {
        lable: 'HRM_PortalApp_Interview_Skill',
        disable: false,
        refresh: false,
        value: '',
        visible: true,
        visibleConfig: true
    },
    WorkAttitude: {
        lable: 'HRM_PortalApp_Interview_Beh',
        disable: false,
        refresh: false,
        value: '',
        visible: true,
        visibleConfig: true
    },
    Competency: {
        lable: 'HRM_PortalApp_Interview_Com',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    LeaderShip: {
        lable: 'HRM_PortalApp_Interview_Lea',
        disable: false,
        refresh: false,
        value: '',
        visible: true,
        visibleConfig: true
    },
    Management: {
        lable: 'HRM_PortalApp_Interview_Adm',
        disable: false,
        refresh: false,
        value: '',
        visible: true,
        visibleConfig: true
    },
    Professional: {
        lable: 'HRM_PortalApp_Interview_Spe',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    CareerObjective: {
        lable: 'HRM_PortalApp_Interview_CareerObj',
        disable: false,
        refresh: false,
        value: '',
        visible: true,
        visibleConfig: true
    },
    HealthStatus: {
        lable: 'HRM_PortalApp_Interview_Health',
        disable: false,
        refresh: false,
        value: '',
        visible: true,
        visibleConfig: true
    },
    // Ket qua danh gia
    Strengths: {
        lable: 'HRM_PortalApp_Interview_Str',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    Weaknesses: {
        lable: 'HRM_PortalApp_Interview_Wea',
        disable: false,
        refresh: false,
        value: '',
        visible: true,
        visibleConfig: true
    },
    ResultNote: {
        lable: 'HRM_PortalApp_Interview_GenFee',
        disable: false,
        refresh: false,
        value: '',
        visible: true,
        visibleConfig: true
    },

    ResultInterview: {
        lable: 'HRM_PortalApp_Interview_ResultpassFail',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    RatingAchieved: {
        lable: 'HRM_PortalApp_Interview_Qua',
        value: null,
        refresh: false,
        visible: true,
        visibleConfig: true,
        disable: false
    },
    TypeSalary: {
        lable: 'HRM_PortalApp_Interview_SalaryType',
        value: null,
        refresh: false,
        visible: true,
        visibleConfig: true,
        disable: false
    },
    ProposedSalary: {
        lable: 'HRM_PortalApp_Interview_RecSalary',
        value: null,
        refresh: false,
        visible: true,
        visibleConfig: true,
        disable: false
    },
    CurrencyID: {
        lable: 'HRM_PortalApp_Interview_Unit',
        value: null,
        refresh: false,
        visible: true,
        visibleConfig: true,
        disable: false
    },
    EnteringDate: {
        lable: 'HRM_PortalApp_Interview_JobAccDate',
        value: null,
        refresh: false,
        visible: true,
        visibleConfig: true,
        disable: false
    },
    FileAttachment: {
        lable: 'HRM_PortalApp_Interview_Att',
        value: null,
        refresh: false,
        visible: true,
        visibleConfig: true,
        disable: false
    },
    acIsCheckEmpty: false,
    params: null,
    isShowModal: false,
    workDateAllowe: null,
    isRefreshState: false,
    isError: false
};

class HreResultInterviewComponent extends Component {
    constructor(props) {
        super(props);
        this.state = initSateDefault;
        this.focusTextInput = null;
        this.layoutHeightItem = null;
    }

    componentDidMount() {
        this.initState();
    }

    //change ngày công
    onChangeWorkDate = (item) => {
        const { indexDay } = this.props;
        this.props.onUpdateDateRegister(item, indexDay);
    };

    // Step 1: Khởi tạo dữ liệu
    initState = async () => {
        const { record, isCreate } = this.props,
            { isRefreshState, Profile } = this.state;
        const profileInfo = dataVnrStorage
            ? dataVnrStorage.currentUser
                ? dataVnrStorage.currentUser.info
                : null
            : null;

        const { E_ProfileID, E_FullName } = EnumName,
            _profile = { ID: profileInfo[E_ProfileID], ProfileName: profileInfo[E_FullName] };

        if (record && !isCreate) {
            const {
                RatingAchieved,
                ResultInterview,
                TypeSalary,
                ProposedSalary,
                CurrencyID,
                EnteringDate,
                FileAttachment
            } = this.state;

            let nextState = {
                isRefreshState: !isRefreshState,
                Profile: {
                    ...Profile,
                    ..._profile
                },
                ProposedSalary: {
                    ...ProposedSalary,
                    value: record.ProposedSalary ? format('#,###.#', record.ProposedSalary) : '',
                    refresh: !ProposedSalary.refresh
                },
                RatingAchieved: {
                    ...RatingAchieved,
                    value: record.RatingAchieved
                        ? { Value: record.RatingAchieved, Text: record.RatingAchievedView }
                        : null,
                    refresh: !RatingAchieved.refresh
                },
                CurrencyID: {
                    ...CurrencyID,
                    value: record.CurrencyID ? { ValueID: record.CurrencyID, DefaultValue: record.CurrencyName } : null,
                    refresh: !CurrencyID.refresh
                },
                ResultInterview: {
                    ...ResultInterview,
                    value: record.ResultInterview
                        ? { Value: record.ResultInterview, Text: record.ResultInterviewView }
                        : null,
                    refresh: !ResultInterview.refresh
                },
                TypeSalary: {
                    ...TypeSalary,
                    value: record.TypeSalary ? { Value: record.TypeSalary, Text: record.TypeSalaryView } : null,
                    refresh: !TypeSalary.refresh
                },
                EnteringDate: {
                    ...EnteringDate,
                    value: record.EnteringDate ? record.EnteringDate : null,
                    refresh: !EnteringDate.refresh
                },
                FileAttachment: {
                    ...FileAttachment,
                    disable: false,
                    value: record.FileAttachment ? ManageFileSevice.setFileAttachApp(record.FileAttachment) : null,
                    refresh: !FileAttachment.refresh
                }
            };

            [
                'Knowledge',
                'Skill',
                'WorkAttitude',
                'Competency',
                'LeaderShip',
                'Management',
                'Professional',
                'CareerObjective',
                'HealthStatus',
                'Strengths',
                'Weaknesses',
                'ResultNote'
            ].forEach((key) => {
                const stateControl = this.state[key];
                nextState = {
                    ...nextState,
                    [key]: {
                        ...stateControl,
                        value: record[key] ? record[key] : '',
                        refresh: !stateControl.refresh
                    }
                };
            });

            this.setState(nextState);
        } else {
            this.setState(
                {
                    ...initSateDefault,
                    Profile: {
                        ...Profile,
                        ..._profile
                    },
                    isRefreshState: !isRefreshState
                },
                () => {
                    this.getCurrency();
                }
            );
        }
    };

    showLoading = (isShow) => {
        const { showLoading } = this.props;
        showLoading && showLoading(isShow);
    };

    ToasterSevice = () => {
        const { ToasterSevice } = this.props;
        return ToasterSevice;
    };

    getCurrency = () => {
        this.showLoading(true);
        HttpService.Get('[URI_CENTER]/api/Sys_Common/GetDefaultConfig?tableName=Cat_Currency')
            .then(res => {
                this.showLoading(false);
                if (res && res.Data) {
                    const { CurrencyID } = this.state;
                    const defaultValue = res.Data.find(item => item.DefaultValue == 'VND');
                    if (defaultValue != null) {
                        this.setState({
                            CurrencyID: {
                                ...CurrencyID,
                                value: defaultValue,
                                refresh: !CurrencyID.refresh
                            }
                        })
                    }
                }
            })
    }

    getAllData = () => {
        const {
            // Profile,
                Knowledge,
                Skill,
                WorkAttitude,
                ResultInterview,
                Competency,
                LeaderShip,
                Management,
                Professional,
                CareerObjective,
                HealthStatus,
                Strengths,
                Weaknesses,
                ResultNote,
                RatingAchieved,
                TypeSalary,
                ProposedSalary,
                CurrencyID,
                EnteringDate,
                FileAttachment
            } = this.state,
            { fieldConfig, record } = this.props;

        const listHandle = Object.keys(this.state).filter(
            (key) =>
                Object.prototype.toString.call(this.state[key]) == '[object Object]' &&
                Object.prototype.hasOwnProperty.call(this.state[key], 'value')
        );

        if (fieldConfig) {
            let isHaveEmpty = false;
            listHandle.forEach((key) => {
                const stateControl = this.state[key];
                if (fieldConfig[key]?.isValid && Vnr_Function.CheckIsNullOrEmpty(stateControl.value) == true) {
                    isHaveEmpty = true;
                    return;
                }
            });

            if (isHaveEmpty) {
                this.props.ToasterSevice().showWarning('HRM_PortalApp_InputValue_Please');
                this.setState({
                    acIsCheckEmpty: true
                });
                return null;
            }
        }


        return {
            ID: record && record.InterviewerInfoID ? record.InterviewerInfoID : null,
            Knowledge: Knowledge.value ? Knowledge.value : null,
            Skill: Skill.value ? Skill.value : null,
            WorkAttitude: WorkAttitude.value ? WorkAttitude.value : null,
            ResultInterview: ResultInterview.value ? ResultInterview.value.Value : null,
            Competency: Competency.value ? Competency.value : null,
            LeaderShip: LeaderShip.value ? LeaderShip.value : null,
            Management: Management.value ? Management.value : null,
            Professional: Professional.value ? Professional.value : null,
            CareerObjective: CareerObjective.value ? CareerObjective.value : null,
            HealthStatus: HealthStatus.value ? HealthStatus.value : null,
            Strengths: Strengths.value ? Strengths.value : null,
            Weaknesses: Weaknesses.value ? Weaknesses.value : null,
            ResultNote: ResultNote.value ? ResultNote.value : null,
            RatingAchieved: RatingAchieved.value ? RatingAchieved.value.Value : null,
            TypeSalary: TypeSalary.value ? TypeSalary.value.Value : null,
            ProposedSalary: ProposedSalary.value ? parseFloat(ProposedSalary.value.split(',').join('')) : null,
            CurrencyID: CurrencyID.value ? CurrencyID.value.ValueID : null,
            EnteringDate: EnteringDate.value ? EnteringDate.value : null,
            FileAttachment: FileAttachment.value ? FileAttachment.value.map((item) => item.fileName).join(',') : null
        };
    };

    render() {
        const { fieldConfig } = this.props,
            {
                RatingAchieved,
                ResultInterview,
                TypeSalary,
                ProposedSalary,
                CurrencyID,
                EnteringDate,
                FileAttachment,
                acIsCheckEmpty
            } = this.state,
            { viewInputMultiline } = stylesVnrPickerV3;

        return (
            <View
                style={styles.wrapItem}
                onLayout={(event) => {
                    const layout = event.nativeEvent.layout;
                    this.layoutHeightItem = layout.height;
                }}
            >
                {/* Title group for time */}
                <View style={[styles.flRowSpaceBetween, {}]}>
                    <VnrText
                        style={[styleSheets.lable, styles.styLableGp, CustomStyleSheet.fontWeight('600')]}
                        i18nKey={'HRM_PortalApp_Interview_EvaCri'}
                    />
                </View>
                {[
                    'Knowledge',
                    'Skill',
                    'WorkAttitude',
                    'Competency',
                    'LeaderShip',
                    'Management',
                    'Professional',
                    'CareerObjective',
                    'HealthStatus'
                ].map((key) => {
                    const stateControl = this.state[key];
                    return (
                        <View key={key}>
                            <VnrTextInput
                                fieldValid={fieldConfig?.[key]?.isValid}
                                isCheckEmpty={acIsCheckEmpty}
                                placeHolder={'HRM_PortalApp_PleaseInput'}
                                disable={stateControl.disable}
                                lable={stateControl.lable}
                                style={[styleSheets.text, viewInputMultiline, CustomStyleSheet.paddingHorizontal(0)]}
                                multiline={true}
                                value={stateControl.value}
                                onChangeText={(text) => {
                                    this.setState({
                                        [key]: {
                                            ...stateControl,
                                            value: text,
                                            refresh: !stateControl.refresh
                                        }
                                    });
                                }}
                                refresh={stateControl.refresh}
                            />
                        </View>
                    );
                })}

                <View style={[styles.flRowSpaceBetween, {}]}>
                    <VnrText
                        style={[styleSheets.lable, styles.styLableGp, CustomStyleSheet.fontWeight('600')]}
                        i18nKey={'HRM_PortalApp_Interview_EvaResult'}
                    />
                </View>
                {['Strengths', 'Weaknesses', 'ResultNote'].map((key) => {
                    const stateControl = this.state[key];
                    return (
                        <View key={key}>
                            <VnrTextInput
                                fieldValid={fieldConfig?.[key]?.isValid}
                                isCheckEmpty={acIsCheckEmpty}
                                placeHolder={'HRM_PortalApp_PleaseInput'}
                                disable={stateControl.disable}
                                lable={stateControl.lable}
                                style={[styleSheets.text, viewInputMultiline, CustomStyleSheet.paddingHorizontal(0)]}
                                multiline={true}
                                value={stateControl.value}
                                onChangeText={(text) => {
                                    this.setState({
                                        [key]: {
                                            ...stateControl,
                                            value: text,
                                            refresh: !stateControl.refresh
                                        }
                                    });
                                }}
                                refresh={stateControl.refresh}
                            />
                        </View>
                    );
                })}

                {/* ResultInterview - Kết quả (Đạt/Không đạt) */}
                {ResultInterview.visible && fieldConfig?.ResultInterview?.visibleConfig && (
                    <VnrPickerLittle
                        isChooseQuickly={true}
                        fieldValid={fieldConfig?.ResultInterview?.isValid}
                        isCheckEmpty={acIsCheckEmpty}
                        refresh={ResultInterview.refresh}
                        //dataLocal={ResultInterview.data ? ResultInterview.data : []}
                        api={{
                            urlApi: '[URI_CENTER]/api/Att_GetData/GetEnumByEnumType',
                            type: 'E_POST',
                            dataBody: {
                                Type: 'ResultInterviewV3'
                            }
                        }}
                        value={ResultInterview.value}
                        textField="Text"
                        valueField="Value"
                        filter={false}
                        filterServer={false}
                        filterParams="text"
                        disable={ResultInterview.disable}
                        lable={ResultInterview.lable}
                        // stylePicker={styles.resetBorder}
                        onFinish={(item) => {
                            this.setState(
                                {
                                    ResultInterview: {
                                        ...ResultInterview,
                                        value: item ? { ...item } : null,
                                        refresh: !ResultInterview.refresh
                                    }
                                });
                        }}
                    />
                )}

                {/* RatingAchieved - Xếp loại*/}
                {RatingAchieved.visible && fieldConfig?.RatingAchieved?.visibleConfig && (
                    <VnrPickerLittle
                        isChooseQuickly={true}
                        fieldValid={fieldConfig?.RatingAchieved?.isValid}
                        isCheckEmpty={acIsCheckEmpty}
                        refresh={RatingAchieved.refresh}
                        //dataLocal={RatingAchieved.data ? RatingAchieved.data : []}
                        api={{
                            urlApi: '[URI_CENTER]/api/Att_GetData/GetEnumByEnumType',
                            type: 'E_POST',
                            dataBody: {
                                Type: 'RatingAchieved'
                            }
                        }}
                        value={RatingAchieved.value}
                        textField="Text"
                        valueField="Value"
                        filter={false}
                        filterServer={false}
                        filterParams="text"
                        disable={RatingAchieved.disable}
                        lable={RatingAchieved.lable}
                        // stylePicker={styles.resetBorder}
                        onFinish={(item) => {
                            this.setState(
                                {
                                    RatingAchieved: {
                                        ...RatingAchieved,
                                        value: item ? { ...item } : null,
                                        refresh: !RatingAchieved.refresh
                                    }
                                },
                                () => { }
                            );
                        }}
                    />
                )}

                {/* TypeSalary - Mức lương đề xuất */}
                {TypeSalary.visible && fieldConfig?.TypeSalary?.visibleConfig && (
                    <VnrPickerLittle
                        isChooseQuickly={true}
                        fieldValid={fieldConfig?.TypeSalary?.isValid}
                        isCheckEmpty={acIsCheckEmpty}
                        refresh={TypeSalary.refresh}
                        //dataLocal={TypeSalary.data ? TypeSalary.data : []}
                        api={{
                            urlApi: '[URI_CENTER]/api/Att_GetData/GetEnumByEnumType',
                            type: 'E_POST',
                            dataBody: {
                                Type: 'TypeSalary'
                            }
                        }}
                        value={TypeSalary.value}
                        textField="Text"
                        valueField="Value"
                        filter={false}
                        filterServer={false}
                        filterParams="text"
                        disable={TypeSalary.disable}
                        lable={TypeSalary.lable}
                        // stylePicker={styles.resetBorder}
                        onFinish={(item) => {
                            this.setState(
                                {
                                    TypeSalary: {
                                        ...TypeSalary,
                                        value: item ? { ...item } : null,
                                        refresh: !TypeSalary.refresh
                                    }
                                },
                                () => { }
                            );
                        }}
                    />
                )}

                {/* TypeSalary - Loai luong */}
                <VnrTextInput
                    isCheckEmpty={acIsCheckEmpty}
                    fieldValid={fieldConfig?.ProposedSalary?.isValid}
                    disable={fieldConfig?.ProposedSalary?.disable}
                    lable={ProposedSalary.lable}
                    value={ProposedSalary.value}
                    isTextRow={true}
                    placeHolder={'HRM_PortalApp_PleaseInput'}
                    keyboardType={'numeric'}
                    charType={'money'}
                    returnKeyType={'done'}
                    onChangeText={(text) => {
                        this.setState(
                            {
                                ProposedSalary: {
                                    ...ProposedSalary,
                                    value: text,
                                    refresh: !ProposedSalary.refresh
                                }
                            },
                            () => {
                                // this.checkHaveDoneValueField(false);
                            }
                        );
                    }}
                    refresh={ProposedSalary.refresh}
                />

                {/* CurrencyID - Đơn vị tiền tệ */}
                {CurrencyID.visible && fieldConfig?.CurrencyID?.visibleConfig && (
                    <VnrPickerLittle
                        isChooseQuickly={true}
                        fieldValid={fieldConfig?.CurrencyID?.isValid}
                        isCheckEmpty={acIsCheckEmpty}
                        refresh={CurrencyID.refresh}
                        //dataLocal={CurrencyID.data ? CurrencyID.data : []}
                        api={{
                            urlApi: '[URI_CENTER]/api/Sys_Common/GetDefaultConfig?tableName=Cat_Currency',
                            type: 'E_GET'
                        }}
                        value={CurrencyID.value}
                        textField="DefaultValue"
                        valueField="ValueID"
                        filter={false}
                        filterServer={false}
                        filterParams="text"
                        disable={CurrencyID.disable}
                        lable={CurrencyID.lable}
                        // stylePicker={styles.resetBorder}
                        onFinish={(item) => {
                            this.setState(
                                {
                                    CurrencyID: {
                                        ...CurrencyID,
                                        value: item ? { ...item } : null,
                                        refresh: !CurrencyID.refresh
                                    }
                                },
                                () => { }
                            );
                        }}
                    />
                )}

                {/* EnteringDate -Ngày nhận việc */}
                <VnrDate
                    isCheckEmpty={acIsCheckEmpty}
                    fieldValid={fieldConfig?.EnteringDate?.isValid}
                    refresh={EnteringDate.refresh}
                    response={'string'}
                    format={'DD/MM/YYYY'}
                    type={'date'}
                    value={EnteringDate.value}
                    lable={EnteringDate.lable}
                    placeHolder={'HRM_PortalApp_Selectdate'}
                    disable={EnteringDate.disable}
                    onFinish={(item) => {
                        this.setState(
                            {
                                EnteringDate: {
                                    ...EnteringDate,
                                    value: item,
                                    refresh: !EnteringDate.refresh
                                }
                            },
                            () => { }
                        );
                    }}
                />

                {/* Tập tin đính kèm */}
                {FileAttachment.visible && fieldConfig?.FileAttachment?.visibleConfig && (
                    <View style={{}}>
                        <VnrAttachFile
                            fieldValid={fieldConfig?.FileAttachment?.isValid}
                            isCheckEmpty={acIsCheckEmpty}
                            lable={FileAttachment.lable}
                            disable={FileAttachment.disable}
                            refresh={FileAttachment.refresh}
                            value={FileAttachment.value}
                            multiFile={true}
                            uri={'[URI_CENTER]/api/Sys_Common/saveFileFromApp'}
                            onFinish={(file) => {
                                this.setState({
                                    FileAttachment: {
                                        ...FileAttachment,
                                        value: file,
                                        refresh: !FileAttachment.refresh
                                    }
                                });
                            }}
                        />
                    </View>
                )}
            </View>
        );
    }
}

const styles = styleComonAddOrEdit;

export default HreResultInterviewComponent;
