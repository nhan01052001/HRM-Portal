import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import {
    styleSheets,
    styleScreenDetail,
    styleSafeAreaView,
    stylesListPickerControl,
    CustomStyleSheet,
    Colors
} from '../../../../../constants/styleConfig';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import ListButtonMenuRight from '../../../../../componentsV3/ListButtonMenuRight/ListButtonMenuRight';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';
import { EnumName, ScreenName } from '../../../../../assets/constant';
import DrawerServices from '../../../../../utils/DrawerServices';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import VnrText from '../../../../../components/VnrText/VnrText';

const configDefault = [
    {
        TypeView: 'E_COMMON',
        Name: 'URNPageName',
        DisplayKey: 'HRM_PortalApp_HreRecruitment_Fanpage',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'PostingContent',
        DisplayKey: 'HRM_PortalApp_HreRecruitment_ContentOnline',
        DataType: 'E_HTML'
    }
];

export default class HrePostChanelViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            dataRowActionAndSelected: [],
            listActions: this.resultListActionHeader(),
            lstCollapse: {}
        };

        if (props.navigation.state.params && props.navigation.state.params.dataItem) {
            const { dataItem } = props.navigation.state.params;
            const title = dataItem.SourceAdsName;

            if (dataItem && dataItem.TypeOfSource == 'E_RECRUITMENTONLINE') {
                props.navigation.setParams({
                    title: title ? title : ''
                });
            } else if (dataItem) {
                props.navigation.setParams({
                    headerRight: (
                        <TouchableOpacity
                            onPress={() =>
                                DrawerServices.navigate('HrePostPreviewViewDetail', {
                                    dataItem,
                                    screenName : ScreenName.HrePostPreviewViewDetail
                                })
                            }
                            style={stylesListPickerControl.headerButtonStyle}
                        >
                            <VnrText
                                i18nKey={'HRM_PortalApp_ButtonPreviewPost'}
                                style={[styleSheets.lable, CustomStyleSheet.color(Colors.blue)]}
                            />
                        </TouchableOpacity>
                    ),
                    title: title ? title : ''
                });
            }
        }
    }

    resultListActionHeader = () => {
        return [];
    };

    rowActionsHeaderRight = (dataItem) => {
        let _listActions = [];
        const { listActions } = this.state;

        if (
            !Vnr_Function.CheckIsNullOrEmpty(listActions) &&
            !Vnr_Function.CheckIsNullOrEmpty(dataItem.BusinessAllowAction)
        ) {
            _listActions = listActions.filter((item) => {
                return dataItem.BusinessAllowAction.indexOf(item.type) >= 0;
            });
        }
        return _listActions;
    };

    getDataItem = async () => {
        try {
            const _params = this.props.navigation.state.params,
                { dataItem, screenName } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail = ConfigListDetail.value[screenName]
                    ? ConfigListDetail.value[screenName]
                    : configDefault;

            const data = { ...dataItem };
            if (data != null) {
                this.setState({ dataItem: data, listActions: [], configListDetail: _configListDetail });
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

    reload = () => {
        const { reloadScreenList } = this.props.navigation.state.params;
        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');
        DrawerServices.goBack();
    };

    render() {
        const { dataItem, listActions, configListDetail } = this.state,
            { containerItemDetail, contentScroll, bottomActions } = styleScreenDetail;
        let contentViewDetail = <VnrLoading size={'large'} />;

        if (dataItem && Object.keys(dataItem).length > 0) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <ScrollView style={contentScroll} showsVerticalScrollIndicator={false}>
                        <View style={[containerItemDetail]}>
                            {configListDetail.map((e) => {
                                if (e.TypeView != 'E_COMMON_PROFILE')
                                    return Vnr_Function.formatStringTypeV3(dataItem, e, configListDetail);
                            })}
                        </View>
                    </ScrollView>
                    {Array.isArray(listActions) && listActions.length > 0 && (
                        <View style={bottomActions}>
                            <ListButtonMenuRight listActions={listActions} dataItem={dataItem} />
                        </View>
                    )}
                </View>
            );
        } else if (dataItem == EnumName.E_EMPTYDATA) {
            contentViewDetail = <EmptyData messageEmptyData={'EmptyData'} />;
        }

        return (
            <SafeAreaViewDetail style={styleSafeAreaView.style}>
                <View style={[styleSheets.container]}>{contentViewDetail}</View>
            </SafeAreaViewDetail>
        );
    }
}
