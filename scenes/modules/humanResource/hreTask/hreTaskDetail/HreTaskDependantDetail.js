import React, { Component } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    styleScreenDetail,
    styleSafeAreaView,
    styleProfileInfo,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import { TaskBusinessBusinessFunction } from '../HreTaskBusiness';
import VnrText from '../../../../../components/VnrText/VnrText';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import DrawerServices from '../../../../../utils/DrawerServices';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import HreTaskDependantList from '../hreTaskDependantList/HreTaskDependantList';
import { EnumName } from '../../../../../assets/constant';
import HreModalEvaluation from '../HreModalEvaluation';

export default class HreTaskDependantDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataItem: null,
            configListDetail: null,
            dataRowActionAndSelected: null,
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

    // cập nhật đánh gía
    hideModalEvaluate = () => {
        this.setState({ evaluateModalVisible: false, evaluateData: null });
    };
    // cập nhật đánh gía
    showModalEvaluate = (dataItem) => {
        this.setState({ evaluateModalVisible: true, evaluateData: dataItem });
    };

    componentDidMount() {
        TaskBusinessBusinessFunction.setThisForBusiness(this, true);
        this.getDataItem();
    }

    render() {
        const { dataItem, listActions, evaluateData, evaluateModalVisible } = this.state,
            { bottomActions } = styleScreenDetail;
        let contentViewDetail = <VnrLoading size={'large'} />;

        if (dataItem) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <ScrollView style={CustomStyleSheet.flexGrow(1)}>
                        <View style={styles.viewUpdate}>
                            <View style={styleProfileInfo.styleViewTitleGroup}>
                                <VnrText
                                    style={[styleSheets.text, styleProfileInfo.textLableGroup]}
                                    i18nKey={'HRM_Tas_TaskPersonsConcerned'}
                                />
                            </View>
                            <HreTaskDependantList
                                api={{
                                    urlApi: `[URI_HR]/Tas_GetData/GetTasPersonsConcernedList?TaskID=${dataItem.ID}`,
                                    dataBody: {},
                                    type: EnumName.E_POST,
                                    pageSize: 20
                                }}
                                valueField="ID"
                            />
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

const styles = StyleSheet.create({
    viewUpdate: {
        flex: 1,
        marginTop: 5
    }
});
