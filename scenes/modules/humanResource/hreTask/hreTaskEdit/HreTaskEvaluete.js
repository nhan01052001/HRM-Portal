import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { IconPublish, IconCreate } from '../../../../../constants/Icons';
import { SafeAreaView, createAppContainer } from 'react-navigation';
import {
    styleSheets,
    styleScreenDetail,
    styleSafeAreaView,
    Colors,
    Size,
    styleButtonAddOrEdit,
    styleValid,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import { TaskBusinessBusinessFunction } from '../HreTaskBusiness';
import VnrText from '../../../../../components/VnrText/VnrText';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import HreTaskCeriteriaList from '../hreTaskCeriteriaList/HreTaskCeriteriaList';
import HreTaskLevelList from '../hreTaskLevelList/HreTaskLevelList';
import DrawerServices from '../../../../../utils/DrawerServices';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../../i18n/translate';
import { EnumName, EnumIcon } from '../../../../../assets/constant';
import HreModalAddTaskLevel from './HreModalAddTaskLevel';
import HreModalAddCeriteria from './HreModalAddCeriteria';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import VnrDate from '../../../../../components/VnrDate/VnrDate';
import VnrPicker from '../../../../../components/VnrPicker/VnrPicker';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

//#region [tạo tab màn hình detail (công việc, đánh giá)]
const TopTabHreTaskLevel_Ceriterial = createMaterialTopTabNavigator(
    {
        // TaskLevel: {
        //     screen: props => <TaskLevel {...props} />,
        //     navigationOptions: ({ navigation }) => (navigationOptionsCogfig(navigation, 'HRM_Tas_Task_Level'))
        // },
        Ceriteria: {
            // eslint-disable-next-line react/display-name
            screen: props => <Ceriteria {...props} />,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'Hrm_Sal_EvaluationOfSalaryApprove_Criteria')
        }
    },
    {
        tabBarOptions: {
            style: {
                backgroundColor: Colors.white,
                borderTopColor: Colors.white,
                borderTopWidth: 0,
                borderBottomColor: Colors.white,
                borderBottomWidth: 0,
                shadowRadius: 0,
                shadowOffset: {
                    height: 0
                },
                elevation: 0,
                paddingHorizontal: 5
            },
            tabStyle: {
                marginHorizontal: 5,
                borderRadius: 5,
                borderColor: Colors.borderColor,
                borderWidth: 1,
                marginTop: 10,
                marginBottom: 5
            },
            labelStyle: styleSheets.text,
            activeTintColor: Colors.primary,
            inactiveTintColor: Colors.grey,
            renderIndicator: () => {},
            upperCaseLabel: false
        },
        lazy: true
    }
);
const ContainerbHreTaskLevel_Ceriterial = createAppContainer(TopTabHreTaskLevel_Ceriterial);
//#endregion

// eslint-disable-next-line no-unused-vars
class TaskLevel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            refreshList: false,
            dataRecord: null,
            dataMofidy: null,
            modalVisible: false,
            isModify: false
        };
    }

    componentDidMount() {
        this.reload();
    }

    reload = () => {
        const { dataItem } = this.props.screenProps;
        if (dataItem) {
            this.setState({ dataItem: dataItem, refreshList: !this.state.refreshList });
        } else {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    hideModalAddOrModify = () => {
        this.setState({ modalVisible: false, dataRecord: null, dataMofidy: null });
    };

    showModalAdd = dataItem => {
        if (!dataItem) {
            return;
        }
        this.setState({ modalVisible: true, dataRecord: dataItem, isModify: false });
    };

    businessModifyRecord = (item, dataItem) => {
        if (!item) {
            return;
        }
        this.setState({ modalVisible: true, dataRecord: dataItem, dataMofidy: item, isModify: true });
    };

    //#region [Delete TaskLeve]
    businessDeleteRecords = (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = items.map(item => item.ID),
                lengthItemDelete = selectedID.length;
            AlertSevice.alert({
                iconType: EnumIcon.E_DELETE,
                message: `${translate('AreYouSureYouWantToDeleteV2')} ${lengthItemDelete} ${translate(
                    'SelectedDataLines'
                )}`,
                onCancel: () => {},
                onConfirm: () => {
                    this.checkingDataWorkingForTaskDelete(selectedID);
                }
            });
        }
    };

    checkingDataWorkingForTaskDelete = selectedID => {
        if (Array.isArray(selectedID) && selectedID.length > 0) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_POR]//New_Hre_Tas_Task/RemoveSelected_Task_LevelTask', {
                selectedIds: selectedID,
                userLogin: dataVnrStorage.currentUser.headers.userlogin
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res && res === 'Success') {
                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                        this.reload();
                    } else {
                        ToasterSevice.showError('Hrm_Fail', 4000);
                    }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            });
        }
    };
    //#endregion

    render() {
        const { dataItem, dataRecord, dataMofidy, modalVisible, refreshList, isModify } = this.state,
            _rowActions = [
                {
                    title: translate('HRM_Common_Delete'),
                    type: EnumName.E_DELETE,
                    onPress: (item, dataBody) => this.businessDeleteRecords([{ ...item }], dataBody)
                },
                {
                    title: translate('HRM_System_Resource_Sys_Edit'),
                    type: EnumName.E_MODIFY,
                    onPress: (item) => this.businessModifyRecord(item, dataItem)
                }
            ],
            // Xử lý disable control Edit cho taskAsigned
            { roleEditStatusOnly } = this.props.screenProps;

        let contentView = <VnrLoading size={'large'} />;

        if (dataItem) {
            const SampleTaskID = dataItem.SampleTaskID ? dataItem.SampleTaskID : '',
                TaskID = dataItem.ID ? dataItem.ID : '',
                UriApi = `[URI_HR]/Tas_GetData/GetTasTaskTaskLevelPortal?SampleTaskID=${SampleTaskID}&TaskID=${TaskID}&IsSpecifcTask=false`;

            contentView = (
                <HreTaskLevelList
                    rowActions={!roleEditStatusOnly ? _rowActions : null}
                    isRefreshList={refreshList}
                    api={{
                        urlApi: UriApi,
                        dataBody: {},
                        type: EnumName.E_POST,
                        pageSize: 20
                    }}
                    valueField="ID"
                />
            );
        } else if (dataItem == 'EmptyData') {
            contentView = <EmptyData messageEmptyData={'EmptyData'} />;
        }
        return (
            <View style={styleSheets.container}>
                {!roleEditStatusOnly && (
                    <TouchableOpacity style={styles.viewButtonUpdate__bnt} onPress={() => this.showModalAdd(dataItem)}>
                        <IconCreate size={Size.iconSize} color={Colors.black} />
                        <VnrText
                            style={[styleSheets.text, styles.txtButtonAdd]}
                            i18nKey={'HRM_Tas_Task_LevelTaskCreate'}
                        />
                    </TouchableOpacity>
                )}

                {contentView}
                {(dataRecord || dataMofidy) && (
                    <HreModalAddTaskLevel
                        reload={this.reload}
                        dataMofidy={dataMofidy}
                        dataRecord={dataRecord}
                        modalVisible={modalVisible}
                        hideModalAdd={this.hideModalAddOrModify}
                        isModify={isModify}
                    />
                )}
            </View>
        );
    }
}

class Ceriteria extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            refreshList: false,
            dataRecord: null,
            dataMofidy: null,
            modalVisible: false,
            isModify: false
        };
    }

    componentDidMount() {
        this.reload();
    }

    reload = () => {
        const { dataItem } = this.props.screenProps;
        if (dataItem) {
            this.setState({ dataItem: dataItem, refreshList: !this.state.refreshList });
        } else {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    hideModalAddOrModify = () => {
        this.setState({ modalVisible: false, dataRecord: null, dataMofidy: null });
    };

    showModalAdd = dataItem => {
        if (!dataItem) {
            return;
        }
        this.setState({ modalVisible: true, dataRecord: dataItem, isModify: false });
    };

    businessModifyRecord = item => {
        if (!item) {
            return;
        }
        this.setState({ modalVisible: true, dataMofidy: item, isModify: true });
    };
    //#region [Delete TaskLeve]
    businessDeleteRecords = (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = items.map(item => item.ID),
                lengthItemDelete = selectedID.length;
            AlertSevice.alert({
                iconType: EnumIcon.E_DELETE,
                message: `${translate('AreYouSureYouWantToDeleteV2')} ${lengthItemDelete} ${translate(
                    'SelectedDataLines'
                )}`,
                onCancel: () => {},
                onConfirm: () => {
                    this.checkingDataWorkingForTaskDelete(selectedID);
                }
            });
        }
    };

    checkingDataWorkingForTaskDelete = selectedID => {
        if (Array.isArray(selectedID) && selectedID.length > 0) {
            VnrLoadingSevices.show();
            //http://192.168.1.58:28237/New_Hre_Tas_Task/RemoveSelected_Tas_TaskKPI
            HttpService.Post('[URI_POR]/New_Hre_Tas_Task/RemoveSelected_Tas_TaskKPI', {
                selectedIds: selectedID,
                userLogin: dataVnrStorage.currentUser.headers.userlogin
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res && res === 'Success') {
                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                        this.reload();
                    } else {
                        ToasterSevice.showError('Hrm_Fail', 4000);
                    }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            });
        }
    };
    //#endregion

    render() {
        const { dataItem, dataRecord, modalVisible, refreshList, dataMofidy, isModify } = this.state,
            _rowActions = [
                {
                    title: translate('HRM_Common_Delete'),
                    type: EnumName.E_DELETE,
                    onPress: (item, dataBody) => this.businessDeleteRecords([{ ...item }], dataBody)
                },
                {
                    title: translate('HRM_System_Resource_Sys_Edit'),
                    type: EnumName.E_MODIFY,
                    onPress: (item) => this.businessModifyRecord(item)
                }
            ],
            // Xử lý disable control Edit cho taskAsigned
            { roleEditStatusOnly } = this.props.screenProps;

        let contentView = <VnrLoading size={'large'} />;

        if (dataItem) {
            const SampleTaskID = dataItem.SampleTaskID ? dataItem.SampleTaskID : '',
                TaskID = dataItem.ID ? dataItem.ID : '',
                UriApi = `[URI_HR]/Tas_GetData/GetTasTaskKPIPortal?SampleTaskID=${SampleTaskID}&TaskID=${TaskID}`;

            contentView = (
                <HreTaskCeriteriaList
                    rowActions={!roleEditStatusOnly ? _rowActions : null}
                    isRefreshList={refreshList}
                    api={{
                        urlApi: UriApi,
                        dataBody: {},
                        type: EnumName.E_POST,
                        pageSize: 20
                    }}
                    valueField="ID"
                />
            );
        } else if (dataItem == 'EmptyData') {
            contentView = <EmptyData messageEmptyData={'EmptyData'} />;
        }
        return (
            <View style={styleSheets.container}>
                {!roleEditStatusOnly && (
                    <TouchableOpacity style={styles.viewButtonUpdate__bnt} onPress={() => this.showModalAdd(dataItem)}>
                        <IconCreate size={Size.iconSize} color={Colors.black} />
                        <VnrText
                            style={[styleSheets.text, styles.txtButtonAdd]}
                            i18nKey={'HRM_Evaluation_KPI_PopUp_Create_Title'}
                        />
                    </TouchableOpacity>
                )}

                {contentView}
                {(dataRecord || dataMofidy) && (
                    <HreModalAddCeriteria
                        isModify={isModify}
                        dataMofidy={dataMofidy}
                        reload={this.reload}
                        dataRecord={dataRecord}
                        modalVisible={modalVisible}
                        hideModalAdd={this.hideModalAddOrModify}
                    />
                )}
            </View>
        );
    }
}

export default class HreTaskEvaluete extends Component {
    constructor(props) {
        super(props);

        // Xử lý disable control Edit cho taskAsigned
        const { params } = props.navigation.state,
            { roleEditStatusOnly } = params;

        this.state = {
            dataItem: null,
            EvaluationDate: {
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
            Score: '',
            fieldValid: {},
            configListDetail: null,
            dataRowActionAndSelected: null,
            listActions: this.resultListActionHeader()
        };
    }

    resultListActionHeader = () => {
        const _params = this.props;
        if (_params && _params.listActions && Array.isArray(_params.listActions)) {
            return _params.listActions;
        }
        return [];
    };

    rowActionsHeaderRight = (dataItem, dataRowActionAndSelected) => {
        let _listActions = [];
        const { rowActions } = dataRowActionAndSelected;

        if (
            !Vnr_Function.CheckIsNullOrEmpty(rowActions) &&
            !Vnr_Function.CheckIsNullOrEmpty(dataItem.BusinessAllowAction)
        ) {
            _listActions = rowActions.filter(item => {
                return dataItem.BusinessAllowAction.indexOf(item.type) >= 0;
            });
        }
        return _listActions;
    };

    getDataItem = async (isReload = false) => {
        try {
            const _params = this.props,
                { dataId, newRecord, dataItem, fieldValid } =
                    typeof _params == 'object' ? _params : JSON.parse(_params);
            if (!Vnr_Function.CheckIsNullOrEmpty(dataId) || isReload) {
                // const response = await HttpService.Post(`[URI_HR]/Att_GetData/GetOvertimeById`, {
                //     id: !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID,
                //     screenName: screenName,
                //     uri: dataVnrStorage.apiConfig.uriHr
                // });
                // const _listActions = await this.rowActionsHeaderRight(response, _dataRowActionAndSelected);
                // if (!Vnr_Function.CheckIsNullOrEmpty(response)) {
                //     this.setState({  dataItem: response, listActions: _listActions, dataRowActionAndSelected: _dataRowActionAndSelected });
                // }
                // else {
                //     this.setState({ dataItem: 'EmptyData' });
                // }
            } else if (newRecord && dataItem) {
                const { Evaluator, EvaluationDate } = this.state;

                let record = { ...newRecord };
                this.setState({
                    dataItem: record,
                    Score: record.Score ? `${record.Score}` : '',
                    Evaluator: {
                        ...Evaluator,
                        value: record.EvaluatorId
                            ? { ID: record.EvaluatorId, ProfileName: dataItem.EvaluationEmployee }
                            : null,
                        refresh: !Evaluator.refresh
                    },
                    EvaluationDate: {
                        ...EvaluationDate,
                        value: record.EvaluationDate,
                        refresh: !EvaluationDate.refresh
                    },
                    fieldValid
                });
            } else {
                this.setState({ dataItem: 'EmptyData' });
            }
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    reload = () => {
        const { reload } = this.props;
        !Vnr_Function.CheckIsNullOrEmpty(reload) && reload();
        this.getDataItem(true);
    };

    componentDidMount() {
        TaskBusinessBusinessFunction.setThisForBusiness(this, true);
        this.getDataItem();
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
        const { dataItem, listActions, EvaluationDate, Evaluator, fieldValid, Score } = this.state,
            { itemContent, containerItemDetail, textLableInfo, bottomActions } = styleScreenDetail;
        let contentViewDetail = <VnrLoading size={'large'} />;

        // Xử lý disable control Edit cho taskAsigned
        const { params } = this.props.navigation.state,
            { roleEditStatusOnly } = params;

        if (dataItem) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <ScrollView style={CustomStyleSheet.flexGrow(1)}>
                        <View style={containerItemDetail}>
                            {/* Ngày đánh giá - EvaluationDate */}
                            <View key={''} style={itemContent}>
                                <View style={styleSheets.viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Tas_Task_Evaluationdate'}
                                    />

                                    {/* valid EvaluationDate */}
                                    {fieldValid.EvaluationDate && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={styleSheets.viewControl}>
                                    <VnrDate
                                        disable={EvaluationDate.disable}
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        refresh={EvaluationDate.refresh}
                                        value={EvaluationDate.value}
                                        type={'date'}
                                        onFinish={value =>
                                            this.setState(
                                                {
                                                    EvaluationDate: {
                                                        ...EvaluationDate,
                                                        value: value
                                                    }
                                                },
                                                () => {
                                                    this.onUpdateNewRecord({ EvaluationDate: value });
                                                }
                                            )
                                        }
                                    />
                                </View>
                            </View>

                            {/* Người đánh giá - Evaluator */}
                            <View key={''} style={itemContent}>
                                <View style={styleSheets.viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Tas_Task_Evaluator'}
                                    />

                                    {/* valid EvaluatorId */}
                                    {fieldValid.EvaluatorId && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={styleSheets.viewControl}>
                                    <VnrPicker
                                        disable={EvaluationDate.disable}
                                        api={{
                                            urlApi: '[URI_HR]/Hre_GetData/GetMultiProfileAll',
                                            type: 'E_GET'
                                        }}
                                        textField="ProfileName"
                                        valueField="ID"
                                        filter={true}
                                        refresh={Evaluator.refresh}
                                        filterServer={true}
                                        filterParams="text"
                                        value={Evaluator.value}
                                        onFinish={item =>
                                            this.setState(
                                                {
                                                    Evaluator: {
                                                        ...Evaluator,
                                                        value: item
                                                    }
                                                },
                                                () => {
                                                    this.onUpdateNewRecord({ EvaluatorId: item ? item.ID : null });
                                                }
                                            )
                                        }
                                    />
                                </View>
                            </View>

                            {/* Tổng điểm - SumMark */}
                            <View key={''} style={itemContent}>
                                <View style={styleSheets.viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'SumMark'} />
                                </View>
                                <View style={styleSheets.viewControl}>
                                    <VnrTextInput value={Score} disable={true} />
                                </View>
                            </View>
                        </View>
                        {/* Tab Mức độ và tiêu chí đánh giá */}
                        <View style={styleSheets.container}>
                            <ContainerbHreTaskLevel_Ceriterial
                                screenProps={{
                                    dataItem: dataItem,
                                    roleEditStatusOnly: roleEditStatusOnly ? true : false
                                }}
                            />
                        </View>
                    </ScrollView>
                    <View style={styleButtonAddOrEdit.groupButton}>
                        <TouchableOpacity
                            onPress={() => this.onUpdate()}
                            style={styleButtonAddOrEdit.groupButton__button_save}
                        >
                            <IconPublish size={Size.iconSize} color={Colors.white} />
                            <VnrText
                                style={[styleSheets.lable, styleButtonAddOrEdit.groupButton__text]}
                                i18nKey={'HRM_Common_Save'}
                            />
                        </TouchableOpacity>
                    </View>
                    {Array.isArray(listActions) && listActions.length > 0 && (
                        <View style={bottomActions}>
                            {/* [bottomActions, { flex: 1 }] */}
                            <ListButtonMenuRight listActions={listActions} dataItem={dataItem} />
                        </View>
                    )}
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
    viewButtonUpdate__bnt: {
        height: Size.heightButton,
        backgroundColor: Colors.primaryOpacity20,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginHorizontal: 10
    },
    txtButtonAdd: {
        marginLeft: 5
    }
});

{
    /* <View key={''} style={itemContent}>
    <View style={styleSheets.viewLable} >
        <VnrText
            style={[styleSheets.text, textLableInfo]}
            i18nKey={'SumMark'}
        />

        {
            fieldValid.EvaluationNote && <VnrText style={styleValid} i18nKey={"HRM_Valid_Char"} />
        }
    </View>
    <View style={styleSheets.viewControl}>
        <VnrTextInput
            value={ExpectedDuration.value}
            refresh={ExpectedDuration.refresh}
            keyboardType={'numeric'}
            charType={'double'}
            returnKeyType={'done'}
            onChangeText={value => {
                this.setState({
                    ExpectedDuration: {
                        ...ExpectedDuration,
                        value: value
                    },
                }, () => {
                    this.onUpdateNewRecord({ ExpectedDuration: value });
                });
            }}
        />
    </View>
</View>


<View key={''} style={itemContent}>
    <View style={styleSheets.viewLable} >
        <VnrText
            style={[styleSheets.text, textLableInfo]}
            i18nKey={'HRM_Tas_Task_NoteHistory'}
        />


        {
            fieldValid.EvaluationNote && <VnrText style={styleValid} i18nKey={"HRM_Valid_Char"} />
        }
    </View>
    <View style={styleSheets.viewControl}>
        <VnrTextInput
            value={EvaluationNote.value}
            onChangeText={text => this.setState({
                Note:
                {
                    ...EvaluationNote,
                    value: text
                }
            }, () => {
                this.onUpdateNewRecord({ EvaluationNote: text });
            })}
            multiline={true}
            numberOfLines={5}
            returnKeyType={"done"}
        />
    </View>
</View> */
}
