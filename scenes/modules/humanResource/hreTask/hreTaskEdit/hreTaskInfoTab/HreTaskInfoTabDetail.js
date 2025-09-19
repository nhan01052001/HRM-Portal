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
import HttpService from '../../../../../../utils/HttpService';
import DrawerServices from '../../../../../../utils/DrawerServices';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import VnrTextInput from '../../../../../../components/VnrTextInput/VnrTextInput';
import { IconPublish } from '../../../../../../constants/Icons';
import VnrAttachFile from '../../../../../../components/VnrAttachFile/VnrAttachFile';

export default class HreTaskInfoTabDetail extends Component {
    constructor(props) {
        super(props);

        // Xử lý disable control Edit cho taskAsigned
        const { params } = props.navigation.state,
            { roleEditStatusOnly } = params;

        this.state = {
            dataItem: null,
            TaskName: null,
            Code: null,
            TaskProject: {
                visible: true,
                disable: roleEditStatusOnly ? true : false,
                refresh: false,
                value: null
            },
            Evaluator: {
                visible: true,
                disable: roleEditStatusOnly ? true : false,
                refresh: false,
                value: null
            },
            TaskPhase: {
                visible: true,
                disable: roleEditStatusOnly ? true : false,
                refresh: false,
                value: null
            },
            TaskGroup: {
                visible: true,
                disable: roleEditStatusOnly ? true : false,
                refresh: false,
                value: null
            },
            Type: {
                visible: true,
                disable: false,
                refresh: false,
                value: null
            },
            StatusView: {
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
            AssignmentDate: {
                visible: true,
                disable: roleEditStatusOnly ? true : false,
                refresh: false,
                value: null
            },
            ExpectedDate: {
                visible: true,
                disable: roleEditStatusOnly ? true : false,
                refresh: false,
                value: null
            },
            FinishDate: {
                visible: true,
                disable: roleEditStatusOnly ? true : false,
                refresh: false,
                value: null
            },
            ExpectedDuration: {
                visible: true,
                disable: roleEditStatusOnly ? true : false,
                refresh: false,
                value: null
            },
            ActualDuration: {
                visible: true,
                disable: roleEditStatusOnly ? true : false,
                refresh: false,
                value: null
            },
            PICID: {
                visible: true,
                disable: roleEditStatusOnly ? true : false,
                refresh: false,
                value: null
            },
            FileAttach: {
                value: null,
                refresh: false,
                disable: roleEditStatusOnly ? true : false
            },
            Content: {
                value: null,
                refresh: false,
                disable: roleEditStatusOnly ? true : false
            },
            fieldValid: {}
        };
    }

    //get item by ID
    getDataItem = () => {
        try {
            let recordID = null;
            const { params } = this.props.navigation.state;

            if (params) {
                recordID = params.recordID;
            }

            return HttpService.Get('[URI_POR]/New_Hre_Tas_Task/GetById?ID=' + recordID);
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    //get config valid
    getConfigValid = tblName => {
        return HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + tblName);
    };

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
        const { params } = this.props.navigation.state,
            { FileAttach, Content } = this.state;

        if (params) {
            const { newRecord, fieldValid } = params;
            let record = { ...newRecord };

            this.setState({
                dataItem: record,
                FileAttach: {
                    ...FileAttach,
                    value: record.lstFileAttach,
                    refresh: !FileAttach.refresh
                },
                Content: {
                    ...Content,
                    value: record.Content
                        ? record.Content.replace(/&amp;/g, '&')
                            .replace(/&lt;/g, '<')
                            .replace(/&gt;/g, '>')
                            .replace(/&Agrave;/g, 'À')
                            .replace(/&Aacute;/g, 'Á')
                            .replace(/&Acirc;/g, 'Â')
                            .replace(/&Atilde;/g, 'Ã')
                            .replace(/&Egrave;/g, 'È')
                            .replace(/&Eacute;/g, 'É')
                            .replace(/&Ecirc;/g, 'Ê')
                            .replace(/&Igrave;/g, 'Ì')
                            .replace(/&Iacute;/g, 'Í')
                            .replace(/&ETH;/g, 'Ð')
                            .replace(/&Ograve;/g, 'Ò')
                            .replace(/&Oacute;/g, 'Ó')
                            .replace(/&Ocirc;/g, 'Ô')
                            .replace(/&Otilde;/g, 'Õ')
                            .replace(/&Ugrave;/g, 'Ù')
                            .replace(/&Uacute;/g, 'Ú')
                            .replace(/&Yacute;/g, 'Ý')
                            .replace(/&agrave;/g, 'à')
                            .replace(/&aacute;/g, 'á')
                            .replace(/&acirc;/g, 'â')
                            .replace(/&atilde;/g, 'ã')
                            .replace(/&egrave;/g, 'è')
                            .replace(/&eacute;/g, 'é')
                            .replace(/&ecirc;/g, 'ê')
                            .replace(/&igrave;/g, 'ì')
                            .replace(/&iacute;/g, 'í')
                            .replace(/&ograve;/g, 'ò')
                            .replace(/&oacute;/g, 'ó')
                            .replace(/&ocirc;/g, 'ô')
                            .replace(/&otilde;/g, 'õ')
                            .replace(/&ugrave;/g, 'ù')
                            .replace(/&uacute;/g, 'ú')
                            .replace(/&yacute;/g, 'ý')
                            .replace(/&amp;/g, '&')
                            .replace(/<[^>]*>?/gm, '')
                        : null,
                    refresh: !Content.refresh
                },
                fieldValid
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
    onUpdateNewRecord = obj => {
        const { params } = this.props.navigation.state;

        if (params) {
            const { updateNewRecord } = params;
            if (updateNewRecord && typeof updateNewRecord === 'function') {
                updateNewRecord(obj);
            }
        }
    };

    render() {
        const { FileAttach, Content, fieldValid } = this.state;

        const { textLableInfo, contentViewControl, viewLable, viewControl } = stylesListPickerControl;
        // console.log(FileAttach, 'FileAttach')
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    {
                        <KeyboardAwareScrollView
                            contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                            keyboardShouldPersistTaps={'handled'}
                        >
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
                                        //key={dataItem ? dataItem.ID : `${Math.random()}`}
                                        disable={FileAttach.disable}
                                        refresh={FileAttach.refresh}
                                        value={FileAttach.value}
                                        multiFile={true}
                                        uri={'[URI_POR]/New_Home/saveFileFromApp'}
                                        onFinish={file => {
                                            this.setState(
                                                {
                                                    FileAttach: {
                                                        ...FileAttach,
                                                        value: file
                                                    }
                                                },
                                                () => {
                                                    let obj = {
                                                        FileAttach: file ? file.map(item => item.fileName).join() : null
                                                    };

                                                    this.onUpdateNewRecord(obj);
                                                }
                                            );
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
                                        disable={Content.disable}
                                        value={Content.value}
                                        onChangeText={text =>
                                            this.setState(
                                                {
                                                    Content: {
                                                        ...Content,
                                                        value: text
                                                    }
                                                },
                                                () => {
                                                    this.onUpdateNewRecord({ Content: text });
                                                }
                                            )
                                        }
                                        multiline={true}
                                        style={[
                                            styleSheets.text,
                                            styles.styViewContent,
                                            Content.disable && styles.styViewContentDisable
                                        ]}
                                        //numberOfLines={5}
                                        returnKeyType={'done'}
                                    />
                                </View>
                            </View>
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
    styViewContentDisable: {
        backgroundColor: Colors.greyPrimaryConstraint,
        opacity: 0.7
    },
    styViewContent: { minHeight: 60,
        borderWidth: 0.5,
        borderColor: Colors.grey,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 10
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
