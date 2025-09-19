import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView, createAppContainer } from 'react-navigation';
import { styleSheets, styleScreenDetail, styleSafeAreaView, Colors, CustomStyleSheet } from '../../../../../constants/styleConfig';
import { TaskBusinessBusinessFunction } from '../HreTaskBusiness';
import VnrText from '../../../../../components/VnrText/VnrText';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HreTaskCeriteriaList from '../hreTaskCeriteriaList/HreTaskCeriteriaList';
import HreTaskLevelList from '../hreTaskLevelList/HreTaskLevelList';
import DrawerServices from '../../../../../utils/DrawerServices';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../../i18n/translate';
import { EnumName } from '../../../../../assets/constant';
import HreModalEvaluation from '../HreModalEvaluation';
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
const TaskLevel = _props => {
    const { dataItem } = _props.screenProps,
        SampleTaskID = dataItem.SampleTaskID ? dataItem.SampleTaskID : '',
        TaskID = dataItem.ID ? dataItem.ID : '',
        UriApi = `[URI_HR]/Tas_GetData/GetTasTaskTaskLevelPortal?SampleTaskID=${SampleTaskID}&TaskID=${TaskID}&IsSpecifcTask=false`;
    return (
        <View style={styleSheets.container}>
            <HreTaskLevelList
                api={{
                    urlApi: UriApi,
                    dataBody: {},
                    type: EnumName.E_POST,
                    pageSize: 20
                }}
                valueField="ID"
            />
        </View>
    );
};

const Ceriteria = _props => {
    const { dataItem } = _props.screenProps,
        SampleTaskID = dataItem.SampleTaskID ? dataItem.SampleTaskID : '',
        TaskID = dataItem.ID ? dataItem.ID : '',
        UriApi = `[URI_HR]/Tas_GetData/GetTasTaskKPIPortal?SampleTaskID=${SampleTaskID}&TaskID=${TaskID}`;
    return (
        <View style={styleSheets.container}>
            <HreTaskCeriteriaList
                api={{
                    urlApi: UriApi,
                    dataBody: {},
                    type: EnumName.E_POST,
                    pageSize: 20
                }}
                valueField="ID"
            />
        </View>
    );
};

export default class HreTaskEvalueteDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataItem: null,
            configListDetail: null,
            listActions: this.resultListActionHeader(),
            // cập nhật đánh gía
            evaluateModalVisible: false,
            evaluateData: null
        };
    }

    resultListActionHeader = () => {
        const _params = this.props;
        if (_params && _params.listActions && Array.isArray(_params.listActions)) {
            return _params.listActions;
        }
        return [];
    };

    getDataItem = async () => {
        try {
            const _params = this.props,
                { dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params);
            if (!Vnr_Function.CheckIsNullOrEmpty(dataItem)) {
                this.setState({ dataItem });
            } else {
                this.setState({ dataItem: 'EmptyData' });
            }
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    // cập nhật đánh gía
    hideModalEvaluate = () => {
        this.setState({ evaluateModalVisible: false, evaluateData: null });
    };
    // cập nhật đánh gía
    showModalEvaluate = dataItem => {
        this.setState({ evaluateModalVisible: true, evaluateData: dataItem });
    };

    reload = (E_KEEP_FILTER, actionIsDelete) => {
        const { reloadScreenList, screenName } = this.props;
        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');

        //nếu action = Delete => back về danh sách
        if (actionIsDelete) {
            DrawerServices.navigate(screenName);
        } else {
            this.getDataItem(true);
        }
    };

    componentDidMount() {
        TaskBusinessBusinessFunction.setThisForBusiness(this, true);
        this.getDataItem();
    }

    render() {
        const { dataItem, listActions, evaluateData, evaluateModalVisible } = this.state,
            { itemContent, containerItemDetail, textLableInfo, bottomActions } = styleScreenDetail;
        let contentViewDetail = <VnrLoading size={'large'} />;

        if (dataItem) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <ScrollView style={CustomStyleSheet.flex(1)}>
                        <View style={containerItemDetail}>
                            <View key={''} style={itemContent}>
                                <View style={styleSheets.viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Tas_Task_Evaluationdate'}
                                    />
                                </View>
                                <View style={styleSheets.viewControl}>
                                    {Vnr_Function.formatStringType(dataItem, {
                                        Name: 'EvaluationDate',
                                        DataType: 'datetime',
                                        DataFormat: 'DD/MM/YYYY'
                                    })}
                                </View>
                            </View>

                            <View key={''} style={itemContent}>
                                <View style={styleSheets.viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Tas_Task_Evaluator'}
                                    />
                                </View>
                                <View style={styleSheets.viewControl}>
                                    {Vnr_Function.formatStringType(dataItem, {
                                        Name: 'EvaluationEmployee',
                                        DataType: '',
                                        DataFormat: ''
                                    })}
                                </View>
                            </View>

                            <View key={''} style={itemContent}>
                                <View style={styleSheets.viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'SumMark'} />
                                </View>
                                <View style={styleSheets.viewControl}>
                                    {/* <VnrText
                                        style={[styleSheets.text]}
                                        value={Vnr_Function.mathRoundNumber(dataItem.Score)}
                                    /> */}
                                    {Vnr_Function.formatStringType(dataItem, {
                                        Name: 'Score',
                                        DataType: 'double',
                                        DataFormat: '##,###.#0'
                                    })}
                                </View>
                            </View>

                            {/* <View key={''} style={itemContent}>
                                <View style={styleSheets.viewLable} >
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Attendance_Comment'}
                                    />
                                </View>
                                <View style={styleSheets.viewControl}>
                                    {Vnr_Function.formatStringType(dataItem,
                                        {
                                            Name: 'Note',
                                            DataType: '',
                                            DataFormat: ''
                                        }
                                    )}
                                </View>
                            </View> */}
                        </View>
                        {/* Tab Mức độ và tiêu chí đánh giá */}
                        <View style={styleSheets.container}>
                            <ContainerbHreTaskLevel_Ceriterial screenProps={{ dataItem: dataItem }} />
                        </View>
                    </ScrollView>
                    {Array.isArray(listActions) && listActions.length > 0 && (
                        <View style={bottomActions}>
                            {/* [bottomActions, { flex: 1 }] */}
                            <ListButtonMenuRight listActions={listActions} dataItem={dataItem} />
                        </View>
                    )}
                    {/* cập nhật đánh giá */}
                    {evaluateData && (
                        <HreModalEvaluation
                            evaluateData={evaluateData}
                            evaluateModalVisible={evaluateModalVisible}
                            hideModalEvaluate={this.hideModalEvaluate}
                        />
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
