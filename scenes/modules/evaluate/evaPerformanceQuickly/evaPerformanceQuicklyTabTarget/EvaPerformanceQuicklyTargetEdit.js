import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    styleScreenDetail,
    styleSafeAreaView,
    styleProfileInfo,
    Colors,
    Size,
    stylesListPickerControl,
    styleButtonAddOrEdit,
    styleValid,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import { IconPrev, IconPublish } from '../../../../../constants/Icons';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DrawerServices from '../../../../../utils/DrawerServices';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import HttpService from '../../../../../utils/HttpService';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import moment from 'moment';
import VnrAttachFile from '../../../../../components/VnrAttachFile/VnrAttachFile';
import { TaskBusinessFunction } from '../EvaPerformanceQuickly';
import { ScreenName } from '../../../../../assets/constant';
import VnrPickerMulti from '../../../../../components/VnrPickerMulti/VnrPickerMulti';
export default class EvaPerformanceQuicklyTargetEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            listUserEdit: null,
            listUserSeleted: null,
            isRefreshUsersPicker: false,
            dataRowTouch: null,
            Comment: '',
            Score: '',
            Target: '',
            Actual: '',
            Times: '',
            FileAttach: {
                value: null,
                refresh: false,
                disable: false
            }
        };
    }

    getDataItem = () => {
        try {
            const _params = this.props.navigation.state.params,
                { listdataEdit, dataRecord } = typeof _params == 'object' ? _params : JSON.parse(_params);

            if (listdataEdit && Array.isArray(listdataEdit) && listdataEdit[0] && Object.keys(dataRecord).length > 0) {
                this.setState({
                    dataItem: dataRecord,
                    listUserEdit: listdataEdit,
                    Target: dataRecord && dataRecord.Target ? `${dataRecord.Target}` : ''
                });
            } else {
                this.setState({ dataItem: 'EmptyData' });
            }
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    componentDidMount() {
        this.getDataItem();
    }

    SaveEditTarget = () => {
        try {
            const _params = this.props.navigation.state.params,
                { reloadList } = typeof _params == 'object' ? _params : JSON.parse(_params),
                { Score, Comment, Actual, Target, Times, dataItem, listUserSeleted, FileAttach } = this.state;

            if (!dataItem) {
                return;
            }

            if (listUserSeleted && Array.isArray(listUserSeleted) && listUserSeleted.length > 0) {
                // save
                const dataBody = {
                    IsPortal: true,
                    PerformanceQuicklyIDs: listUserSeleted.map((item) => item.ID).join(','),
                    Comment: Comment,
                    DateEvaluation: dataItem.DateEvaluation
                        ? moment(dataItem.DateEvaluation).format('"YYYY-MM-DD HH:mm:ss"')
                        : null,
                    EvaluatorID: dataVnrStorage.currentUser.info.ProfileID,
                    FileAttach: FileAttach.value ? FileAttach.value.map((item) => item.fileName).join(',') : null,
                    ID: dataItem.ID,
                    Score: Score ? parseFloat(Score) : null,
                    Target: Target ? parseFloat(Target) : null,
                    Actual: Actual ? parseFloat(Actual) : null,
                    Times: Times ? parseFloat(Times) : null,
                    UserSubmit: dataVnrStorage.currentUser.info.ProfileID
                };
                VnrLoadingSevices.show();
                HttpService.Post('[URI_HR]/Eva_GetData/SaveEditFormBulk', dataBody).then((res) => {
                    VnrLoadingSevices.hide();
                    if (res && res.success) {
                        ToasterSevice.showSuccess('Hrm_Succeed');

                        // reload các màn hinh liên quan
                        TaskBusinessFunction.checkForLoadEditDelete = {
                            [ScreenName.EvaPerformanceQuicklyTarget]: false,
                            [ScreenName.EvaPerformanceQuicklyProfile]: true
                        };
                        //reload va Tro lai man hinh danh sanh
                        typeof reloadList === 'function' && reloadList();
                        DrawerServices.navigate('EvaPerformanceQuicklyTarget');
                    } else if (res && res.messageNotify && typeof res.messageNotify === 'string') {
                        ToasterSevice.showWarning(res.messageNotify);
                    } else {
                        ToasterSevice.showWarning('Hrm_Fail');
                    }
                });
            } else {
                ToasterSevice.showWarning('HRM_Sal_UnusualEDChildCare_NotSelectProfile', 5000);
                return;
            }
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    hideModalMore = () => {
        this.setState({ dataRowTouch: null });
    };

    initControlFromCaculation = () => {
        const { textLableInfo, contentViewControl, viewLable, viewControl } = stylesListPickerControl,
            { Score, Actual, Target, Times, dataItem } = this.state;

        if (!dataItem) return;

        let controlView = <View />;
        if (dataItem.FormOfCaculation === 'E_SATISFACTORYDAYRATE') {
            controlView = (
                <View>
                    <View style={contentViewControl}>
                        <View style={viewLable}>
                            <VnrText
                                style={[styleSheets.text, textLableInfo]}
                                i18nKey={'HRM_Evaluation_PerformanceDetail_Value'}
                            />
                        </View>

                        <View style={viewControl}>
                            <VnrTextInput
                                disable={true}
                                value={Target}
                                keyboardType={'numeric'}
                                charType={'double'}
                                returnKeyType={'done'}
                                onChangeText={(value) => this.setState({ Target: value })}
                            />
                        </View>
                    </View>
                    <View style={contentViewControl}>
                        <View style={viewLable}>
                            <VnrText
                                style={[styleSheets.text, textLableInfo]}
                                i18nKey={'HRM_Evaluation_PerformanceDetail_Value2'}
                            />
                        </View>

                        <View style={viewControl}>
                            <VnrTextInput
                                ref={(ref) => (this.viewCaculation = ref)}
                                //placeholder={}
                                value={Actual}
                                keyboardType={'numeric'}
                                charType={'double'}
                                returnKeyType={'done'}
                                onChangeText={(value) => this.setState({ Actual: value })}
                            />
                        </View>
                    </View>
                </View>
            );
        } else if (dataItem.FormOfCaculation === 'E_SCORE') {
            controlView = (
                <View style={contentViewControl}>
                    <View style={viewLable}>
                        <VnrText
                            style={[styleSheets.text, textLableInfo]}
                            i18nKey={'HRM_Evaluation_PerformanceDetail_Mark'}
                        />
                    </View>

                    <View style={viewControl}>
                        <VnrTextInput
                            ref={(ref) => (this.viewCaculation = ref)}
                            value={Score}
                            keyboardType={'numeric'}
                            charType={'double'}
                            returnKeyType={'done'}
                            onChangeText={(value) => this.setState({ Score: value })}
                        />
                    </View>
                </View>
            );
        } else if (dataItem.FormOfCaculation === 'E_TIMES') {
            controlView = (
                <View style={contentViewControl}>
                    <View style={viewLable}>
                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'FormOfCalculation__E_TIMES'} />
                    </View>

                    <View style={viewControl}>
                        <VnrTextInput
                            ref={(ref) => (this.viewCaculation = ref)}
                            value={Times}
                            keyboardType={'numeric'}
                            charType={'double'}
                            returnKeyType={'done'}
                            onChangeText={(value) => this.setState({ Times: value })}
                        />
                    </View>
                </View>
            );
        }
        return controlView;
    };

    onAddUser = (items) => {
        this.setState({ listUserSeleted: items });
    };

    render() {
        const { dataItem, listUserEdit, Comment, FileAttach, listUserSeleted, isRefreshUsersPicker } = this.state,
            { itemContent, containerItemDetail } = styleScreenDetail,
            { textLableInfo, contentViewControl, viewLable, viewControl } = stylesListPickerControl;

        let contentViewDetail = <VnrLoading size={'large'} />;

        if (dataItem && listUserEdit) {
            // lay danh sach ten nhan vien
            contentViewDetail = (
                <View style={[styleSheets.col_10]}>
                    {/* <View style={styles.viewUpdate}> */}
                    <KeyboardAwareScrollView
                        contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                        enableOnAndroid={false}
                        keyboardShouldPersistTaps={'handled'}
                    >
                        <View style={styleProfileInfo.styleViewTitleGroup}>
                            <VnrText
                                style={[styleSheets.text, styleProfileInfo.textLableGroup]}
                                i18nKey={'HRM_HR_GeneralInformation'}
                            />
                        </View>

                        <View style={containerItemDetail}>
                            <View style={itemContent}>
                                <View style={styleSheets.viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Tas_Task_Evaluationdate'}
                                    />
                                </View>
                                <View style={styleSheets.viewControl}>
                                    <Text style={styleSheets.text}>
                                        {moment(dataItem.DateEvaluation).format('DD/MM/YYYY')}
                                    </Text>
                                </View>
                            </View>
                            <View style={itemContent}>
                                <View style={[styleSheets.viewLable, CustomStyleSheet.justifyContent('space-between')]}>
                                    <View style={CustomStyleSheet.flexDirection('row')}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Common_List_Profile'}
                                        />
                                        {/* valid FormulaID */}
                                        {<VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                    </View>

                                    <TouchableOpacity
                                        onPress={() =>
                                            this.setState({
                                                listUserSeleted: listUserEdit,
                                                isRefreshUsersPicker: !isRefreshUsersPicker
                                            })
                                        }
                                    >
                                        <VnrText
                                            style={[styleSheets.lable, styles.styTextCheckAll]}
                                            i18nKey={'HRM_CheckAll'}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={styleSheets.viewControl}>
                                    <VnrPickerMulti
                                        refresh={isRefreshUsersPicker}
                                        dataLocal={listUserEdit}
                                        textField="ProfileName"
                                        valueField="ID"
                                        filter={true}
                                        filterServer={false}
                                        value={listUserSeleted}
                                        onFinish={(items) => this.onAddUser(items)}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={styleProfileInfo.styleViewTitleGroup}>
                            <VnrText
                                style={[styleSheets.text, styleProfileInfo.textLableGroup]}
                                i18nKey={'HRM_Tas_SampleTaskKPI_PopUp_Edit_Title'}
                            />
                        </View>

                        <View style={styleSheets.container}>
                            {/* {KPIName - Tiên tiêu chí} */}
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'KPIName'} />
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput value={dataItem.KPIName} disable={true} />
                                </View>
                            </View>

                            {/* {Score,Actua,Time - điểm} */}
                            {this.initControlFromCaculation()}

                            {/* Ghi chú - Comment */}
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Sal_InsuranceSalry_Note'}
                                    />
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        value={Comment}
                                        returnKeyType={'done'}
                                        height={60}
                                        multiline={true}
                                        onChangeText={(value) => this.setState({ Comment: value })}
                                    />
                                </View>
                            </View>

                            {/* file  - AttachFile */}
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Rec_JobVacancy_FileAttachment'}
                                    />
                                </View>
                                <View style={viewControl}>
                                    <VnrAttachFile
                                        key={dataItem ? dataItem.ID : `${Math.random()}`}
                                        disable={FileAttach.disable}
                                        refresh={FileAttach.refresh}
                                        value={FileAttach.value}
                                        multiFile={true}
                                        uri={'[URI_POR]/New_Home/saveFileFromApp'}
                                        onFinish={(file) => {
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
                        </View>
                    </KeyboardAwareScrollView>

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
                            onPress={() => this.SaveEditTarget()}
                            style={styleButtonAddOrEdit.groupButton__button_save}
                        >
                            <IconPublish size={Size.iconSize} color={Colors.white} />
                            <VnrText
                                style={[styleSheets.lable, styleButtonAddOrEdit.groupButton__text]}
                                i18nKey={'HRM_Common_Save'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            );
        } else if (dataItem == 'EmptyData') {
            contentViewDetail = <EmptyData messageEmptyData={'EmptyData'} />;
        }
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container]}>{contentViewDetail}</View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    styTextCheckAll: {
        color: Colors.primary,
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
        textDecorationColor: Colors.primary
    }
});
