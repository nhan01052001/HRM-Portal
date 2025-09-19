import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleScreenDetail, styleSafeAreaView, Size, Colors, CustomStyleSheet } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import VnrText from '../../../../../components/VnrText/VnrText';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { generateRowActionAndSelected, AttApprovedOvertimeBusinessFunction } from './AttApprovedOvertimeBusiness';
import HttpService from '../../../../../utils/HttpService';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import VnrLoading from '../.../../../../../../components/VnrLoading/VnrLoading';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import DrawerServices from '../../../../../utils/DrawerServices';
import { IconComment } from '../../../../../constants/Icons';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
export default class AttApprovedOvertimeViewDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataItem: null,
            configListDetail: null,
            dataRowActionAndSelected: generateRowActionAndSelected(),
            listActions: this.resultListActionHeader()
        };
    }

    resultListActionHeader = () => {
        const _params = this.props.navigation.state.params;
        if (_params && _params.listActions && Array.isArray(_params.listActions)) {
            return _params.listActions;
        }
        return [];
    };

    rowActionsHeaderRight = dataItem => {
        let _listActions = [];
        const { rowActions } = this.state.dataRowActionAndSelected;

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
            const _params = this.props.navigation.state.params,
                { screenName, dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail = ConfigListDetail.value[screenName];

            if (!Vnr_Function.CheckIsNullOrEmpty(dataId) || isReload) {
                const response = await HttpService.Post('[URI_HR]/Att_GetData/GetOvertimeById', {
                    id: !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID,
                    screenName: screenName,
                    uri: dataVnrStorage.apiConfig.uriHr
                });
                const _listActions = await this.rowActionsHeaderRight(response);
                if (!Vnr_Function.CheckIsNullOrEmpty(response)) {
                    this.setState({
                        configListDetail: _configListDetail,
                        dataItem: response,
                        listActions: _listActions
                    });
                } else {
                    this.setState({ dataItem: 'EmptyData' });
                }
            } else if (!Vnr_Function.CheckIsNullOrEmpty(dataItem)) {
                this.setState({ configListDetail: _configListDetail, dataItem });
            } else {
                this.setState({ dataItem: 'EmptyData' });
            }
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    reload = () => {
        const { reloadScreenList } = this.props.navigation.state.params;
        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');
        this.getDataItem(true);
    };

    componentDidMount() {
        AttApprovedOvertimeBusinessFunction.setThisForBusiness(this);
        this.getDataItem();
    }

    render() {
        const { dataItem, configListDetail, listActions } = this.state,
            { containerItemDetail, bottomActions } = styleScreenDetail;

        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <ScrollView style={CustomStyleSheet.flexGrow(1)}>
                        <View style={containerItemDetail}>
                            {configListDetail.map(e => {
                                return Vnr_Function.formatStringTypeV2(dataItem, e);
                            })}
                        </View>
                    </ScrollView>
                    {/* Xem chi tiết bình luận */}
                    {PermissionForAppMobile &&
                        PermissionForAppMobile.value['New_Att_Overtime_New_Index_btnViewDetail'] &&
                        PermissionForAppMobile.value['New_Att_Overtime_New_Index_btnViewDetail']['View'] && (
                        <TouchableOpacity
                            style={styles.viewTime}
                            onPress={() =>
                                DrawerServices.navigate('AttApproveOvertimeComment', {
                                    record: dataItem,
                                    reload: this.reload,
                                    isViewDetail: true
                                })
                            }
                        >
                            <IconComment size={Size.text + 3} color={Colors.gray_7} />
                            <VnrText
                                style={[styleSheets.lable, styles.groupButton__text__view]}
                                i18nKey={'HRM_HR_Detail_Comment'}
                            />
                        </TouchableOpacity>
                    )}
                    {Array.isArray(listActions) && listActions.length > 0 && (
                        <View style={bottomActions}>
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
    viewTime: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 35,
        paddingTop: 5
    },
    groupButton__text__view: {
        paddingLeft: styleSheets.p_7
    }
});
