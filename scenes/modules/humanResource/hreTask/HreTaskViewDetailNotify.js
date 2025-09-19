import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleSafeAreaView } from '../../../../constants/styleConfig';
import VnrLoading from '../../../../components/VnrLoading/VnrLoading';
import DrawerServices from '../../../../utils/DrawerServices';
import HttpService from '../../../../utils/HttpService';
import Vnr_Function from '../../../../utils/Vnr_Function';
import { EnumName } from '../../../../assets/constant';
import EmptyData from '../../../../components/EmptyData/EmptyData';
import HreTaskTopTabViewDetail from './HreTaskTopTabViewDetail';
import { generateRowActionAndSelected, TaskBusinessBusinessFunction } from './HreTaskBusiness';

export default class HreTaskViewDetailNotify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            listActions: this.resultListActionHeader(),
            isLoading: false
        };

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            TaskBusinessBusinessFunction.setThisForBusiness(this);
            this.getDataItem();
        });
    }

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
    }

    resultListActionHeader = () => {
        const _params = this.props.navigation.state.params;
        if (_params && _params.listActions && Array.isArray(_params.listActions)) {
            return _params.listActions;
        }
        return [];
    };

    rowActionsHeaderRight = (dataItem, screenName) => {
        let _listActions = [];
        const dataRowActionAndSelected = generateRowActionAndSelected(screenName),
            { rowActions } = dataRowActionAndSelected;

        if (
            !Vnr_Function.CheckIsNullOrEmpty(rowActions) &&
            !Vnr_Function.CheckIsNullOrEmpty(dataItem.BusinessAllowAction)
        ) {
            _listActions = rowActions.filter((item) => {
                return dataItem.BusinessAllowAction.indexOf(item.type) >= 0;
            });
        }

        return _listActions;
    };

    getDataItem = async (isReload = false) => {
        try {
            this.setState({ isLoading: true });

            const _params = this.props.navigation.state.params,
                { screenName, dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params);

            if (!Vnr_Function.CheckIsNullOrEmpty(dataId) || isReload) {
                const response = await HttpService.Post('[URI_HR]/Tas_GetData/GetListTaskMobile', {
                    NotificationID: !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID,
                    ScreenName: screenName
                });
                const _listActions = this.rowActionsHeaderRight(response, screenName);

                if (response && response != null) {
                    this.setState({ dataItem: response, listActions: _listActions, isLoading: false });
                } else {
                    this.setState({ dataItem: EnumName.E_EMPTYDATA, isLoading: false });
                }
            } else if (!Vnr_Function.CheckIsNullOrEmpty(dataItem)) {
                this.setState({ dataItem });
            } else {
                this.setState({ dataItem: EnumName.E_EMPTYDATA, isLoading: false });
            }
        } catch (error) {
            this.setState({ dataItem: EnumName.E_EMPTYDATA, isLoading: false });
        }
    };

    reload = (E_KEEP_FILTER, actionIsDelete) => {
        //detail
        const _params = this.props.navigation.state.params,
            { screenName, reloadScreenList } = typeof _params == 'object' ? _params : JSON.parse(_params);
        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');

        //nếu action = Delete => back về danh sách
        if (actionIsDelete) {
            DrawerServices.navigate(screenName);
        } else {
            this.getDataItem(true);
        }
    };

    componentDidMount() {}

    render() {
        const { dataItem, listActions, isLoading } = this.state,
            _params = this.props.navigation.state.params,
            { screenName } = typeof _params == 'object' ? _params : JSON.parse(_params);

        let contentViewDetail = <View />;
        if (isLoading) {
            contentViewDetail = <VnrLoading size={'large'} />;
        } else if (dataItem && !isLoading) {
            contentViewDetail = (
                <HreTaskTopTabViewDetail
                    screenProps={{
                        dataItem: dataItem,
                        screenName: screenName,
                        listActions: listActions,
                        reloadScreenList: this.reload
                    }}
                />
            );
        } else if (dataItem == 'EmptyData') {
            contentViewDetail = (
                <SafeAreaView {...styleSafeAreaView}>
                    <View style={[styleSheets.container]}>
                        <EmptyData messageEmptyData={'EmptyData'} />
                    </View>
                </SafeAreaView>
            );
        }
        return contentViewDetail;
    }
}
