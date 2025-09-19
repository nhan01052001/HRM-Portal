import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { IconCreate } from '../../../../../constants/Icons';
import { SafeAreaView, createAppContainer } from 'react-navigation';
import {
    styleSheets,
    styleSafeAreaView,
    Colors,
    Size,
    styleButtonAddOrEdit,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import HreTaskCeriteriaList from '../hreTaskCeriteriaList/HreTaskCeriteriaList';
import HreTaskLevelList from '../hreTaskLevelList/HreTaskLevelList';
import DrawerServices from '../../../../../utils/DrawerServices';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../../i18n/translate';
import { EnumName, EnumIcon } from '../../../../../assets/constant';
import HreModalAddTaskLevel from '../hreTaskEdit/HreModalAddTaskLevel';
import HreModalAddCeriteria from '../hreTaskEdit/HreModalAddCeriteria';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

//#region [tạo tab màn hình detail (công việc, đánh giá)]
const TopTabHreTaskLevel_KPI = createMaterialTopTabNavigator(
    {
        // TabTaskLevel: {
        //     screen: props => <TabTaskLevel {...props} />,
        //     navigationOptions: ({ navigation }) => (navigationOptionsCogfig(navigation, 'HRM_Tas_Task_Level'))
        // },
        TabTaskKPI: {
            // eslint-disable-next-line react/display-name
            screen: props => <TabTaskKPI {...props} />,
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
const ContainerTopTabHreTaskLevel_KPI = createAppContainer(TopTabHreTaskLevel_KPI);
//#endregion

// eslint-disable-next-line no-unused-vars
class TabTaskLevel extends Component {
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
            ];

        let contentView = <VnrLoading size={'large'} />;

        if (dataItem) {
            const SampleTaskID = dataItem.SampleTaskID ? dataItem.SampleTaskID : '',
                TaskID = dataItem.ID ? dataItem.ID : '',
                UriApi = `[URI_HR]/Tas_GetData/GetTasTaskTaskLevelPortal?SampleTaskID=${SampleTaskID}&TaskID=${TaskID}&IsSpecifcTask=false`;

            contentView = (
                <HreTaskLevelList
                    rowActions={_rowActions}
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
                <TouchableOpacity style={styles.viewButtonUpdate__bnt} onPress={() => this.showModalAdd(dataItem)}>
                    <IconCreate size={Size.iconSize} color={Colors.black} />
                    <VnrText style={[styleSheets.text, styles.txtButtonAdd]} i18nKey={'HRM_Tas_Task_LevelTaskCreate'} />
                </TouchableOpacity>
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

class TabTaskKPI extends Component {
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
            ];

        let contentView = <VnrLoading size={'large'} />;

        if (dataItem) {
            const SampleTaskID = dataItem.SampleTaskID ? dataItem.SampleTaskID : '',
                TaskID = dataItem.ID ? dataItem.ID : '',
                UriApi = `[URI_HR]/Tas_GetData/GetTasTaskKPIPortal?SampleTaskID=${SampleTaskID}&TaskID=${TaskID}`;

            contentView = (
                <HreTaskCeriteriaList
                    rowActions={_rowActions}
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
                <TouchableOpacity style={styles.viewButtonUpdate__bnt} onPress={() => this.showModalAdd(dataItem)}>
                    <IconCreate size={Size.iconSize} color={Colors.black} />
                    <VnrText
                        style={[styleSheets.text, styles.txtButtonAdd]}
                        i18nKey={'HRM_Evaluation_KPI_PopUp_Create_Title'}
                    />
                </TouchableOpacity>
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

export default class HreTaskAddTargetAndLevelForEva extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataItem: null,
            EvaluationDate: {
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
            fieldValid: {}
        };
    }

    componentDidMount() {
        const { dataConfirm } = this.props.navigation.state.params;
        this.setState({
            ...this.state,
            ...dataConfirm
        });
    }

    render() {
        const { dataItem } = this.state

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    <ScrollView style={CustomStyleSheet.flexGrow(1)}>
                        {/* Tab Mức độ và tiêu chí đánh giá */}
                        <View style={styleSheets.container}>
                            {dataItem && <ContainerTopTabHreTaskLevel_KPI screenProps={{ dataItem: dataItem }} />}
                        </View>
                    </ScrollView>

                    {/* bottom button close */}
                    <View style={styleButtonAddOrEdit.groupButton}>
                        <TouchableOpacity
                            onPress={() => DrawerServices.navigate('HreTaskAssign', { refreshListTaskAssign: true })}
                            style={[styleButtonAddOrEdit.btnClose]}
                        >
                            <VnrText
                                style={[styleSheets.lable, { color: Colors.greySecondary }]}
                                i18nKey={'HRM_Common_BackList'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
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
