import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    styleScreenDetail,
    styleSafeAreaView,
    stylesModalPopupBottom,
    Colors,
    Size,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import Modal from 'react-native-modal';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import VnrText from '../../../../../components/VnrText/VnrText';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { generateRowActionAndSelected, AttApprovePlanOvertimeBusinessFunction } from './AttApprovePlanOvertimeBusiness';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import { EnumName } from '../../../../../assets/constant';
import { IconCancel, IconColse, IconTime } from '../../../../../constants/Icons';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';

const configDefault = [];
const configDefaultLimit = [
    {
        TypeView: 'E_COMMON',
        Name: 'udHourByMonth',
        DisplayKey: 'udHourByMonth',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'udHourByYear',
        DisplayKey: 'udHourByYear',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'udHourByYearFinance',
        DisplayKey: 'udHourByYearFinance',
        DataType: 'string'
    }
];

export default class AttApprovePlanOvertimeViewDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataItem: null,
            configListDetail: null,
            dataRowActionAndSelected: generateRowActionAndSelected(),
            listActions: this.resultListActionHeader(),
            dataPlanLimit: {
                data: null,
                modalVisiblePlanLimit: false
            }
        };
    }

    resultListActionHeader = () => {
        const _params = this.props.navigation.state.params;
        if (_params && _params.listActions && Array.isArray(_params.listActions)) {
            return _params.listActions.filter(item => {
                return item.type !== EnumName.E_LIMIT_OT;
            });
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
                return item.type !== EnumName.E_LIMIT_OT && dataItem.BusinessAllowAction.indexOf(item.type) >= 0;
            });
        }
        return _listActions;
    };

    getDataItem = async (isReload = false) => {
        try {
            const _params = this.props.navigation.state.params,
                { screenName, dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail =
                    ConfigListDetail.value[screenName] != null ? ConfigListDetail.value[screenName] : configDefault;

            if (!Vnr_Function.CheckIsNullOrEmpty(dataId) || isReload) {
                const response = await HttpService.Post('[URI_HR]/Att_GetData/GetPlanOvertimeById', {
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
        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER', true);
        this.getDataItem(true);
    };

    componentDidMount() {
        AttApprovePlanOvertimeBusinessFunction.setThisForBusiness(this, true);
        this.getDataItem();
    }

    //#region  hiển thị số giờ lũy kế
    openModalPlanLimit = data => {
        const { dataPlanLimit } = this.state;
        if (!data) {
            return;
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/GetOvertimePlanLimit', {
            ProfileIDs: data.ProfileID,
            WorkDateRoot: Vnr_Function.formatDateAPI(data.WorkDate)
        }).then(res => {
            VnrLoadingSevices.hide();
            if (res && res.Data && res.Data.length > 0)
                this.setState({
                    dataPlanLimit: {
                        ...dataPlanLimit,
                        data: res.Data[0],
                        modalVisiblePlanLimit: true
                    }
                });
            else
                this.setState({
                    dataPlanLimit: {
                        ...dataPlanLimit,
                        data: EnumName.E_EMPTYDATA,
                        modalVisiblePlanLimit: true
                    }
                });
        });
    };

    closeModalPlanLimit = () => {
        const { dataPlanLimit } = this.state;
        this.setState({
            dataPlanLimit: {
                ...dataPlanLimit,
                modalVisiblePlanLimit: false
            }
        });
    };

    viewListItemPlanLimitTime = () => {
        const { dataPlanLimit } = this.state;
        if (dataPlanLimit.data === EnumName.E_EMPTYDATA) {
            return <EmptyData messageEmptyData={'EmptyData'} />;
        } else {
            const { udLimitColorYearFinance, udLimitColorMonth, udLimitColorYear } = dataPlanLimit.data;

            const data = dataPlanLimit.data;
            const dataColor = {
                udHourByMonth: udLimitColorMonth ? udLimitColorMonth : null,
                udHourByYear: udLimitColorYear ? udLimitColorYear : null,
                udHourByYearFinance: udLimitColorYearFinance ? udLimitColorYearFinance : null
            };

            const _configListLimit = ConfigListDetail.value['GetOvertimePlanLimitViewDetail']
                ? ConfigListDetail.value['GetOvertimePlanLimitViewDetail']
                : configDefaultLimit;

            if (_configListLimit) {
                return (
                    <View style={{}}>
                        {_configListLimit.map((col, index) => {
                            return (
                                <View
                                    key={index}
                                    style={
                                        index == _configListLimit.length - 1
                                            ? styles.viewTextTimeWithoutBorder
                                            : styles.viewTextTimeWithBorder
                                    }
                                >
                                    <VnrText
                                        style={[
                                            styleSheets.text,
                                            dataColor[col.Name] && { color: dataColor[col.Name] }
                                        ]}
                                        i18nKey={col.DisplayKey}
                                    />

                                    <Text
                                        style={[
                                            styleSheets.text,
                                            dataColor[col.Name] && { color: dataColor[col.Name] }
                                        ]}
                                    >
                                        {data[col.Name] !== null ? `: ${data[col.Name]}` : ''}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                );
            }
        }
    };
    //#endregion

    render() {
        const { dataItem, configListDetail, listActions, dataPlanLimit } = this.state,
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

                    {/* số giờ lũy kế */}
                    {PermissionForAppMobile &&
                        PermissionForAppMobile.value['Att_OvertimePlan_btnViewAccumulation'] &&
                        PermissionForAppMobile.value['Att_OvertimePlan_btnViewAccumulation']['View'] && (
                        <TouchableOpacity style={styles.viewTime} onPress={() => this.openModalPlanLimit(dataItem)}>
                            <IconTime size={Size.text + 3} color={Colors.gray_7} />

                            <VnrText
                                style={[styleSheets.lable, styles.groupButton__text__view]}
                                i18nKey={'HRM_Common_ViewLimit'}
                            />
                        </TouchableOpacity>
                    )}

                    {Array.isArray(listActions) && listActions.length > 0 && (
                        <View style={bottomActions}>
                            <ListButtonMenuRight listActions={listActions} dataItem={dataItem} />
                        </View>
                    )}
                    {dataPlanLimit.modalVisiblePlanLimit && (
                        <Modal
                            onBackButtonPress={() => this.closeModalPlanLimit()}
                            isVisible={true}
                            onBackdropPress={() => this.closeModalPlanLimit()}
                            customBackdrop={
                                <TouchableWithoutFeedback onPress={() => this.closeModalPlanLimit()}>
                                    <View
                                        style={styles.coating}
                                    />
                                </TouchableWithoutFeedback>
                            }
                            style={CustomStyleSheet.margin(0)}
                        >
                            <View style={stylesModalPopupBottom.viewModalTime}>
                                <SafeAreaView {...styleSafeAreaView} style={stylesModalPopupBottom.safeRadius}>
                                    <View style={styles.headerCloseModal}>
                                        <IconColse color={Colors.white} size={Size.iconSize} />
                                        <VnrText style={styleSheets.lable} i18nKey={'HRM_Common_ViewLimit'} />
                                        <TouchableOpacity onPress={() => this.closeModalPlanLimit()}>
                                            <IconCancel color={Colors.black} size={Size.iconSize} />
                                        </TouchableOpacity>
                                    </View>
                                    <ScrollView style={styles.viewListItemPlanLimitTime}>
                                        {this.viewListItemPlanLimitTime()}
                                    </ScrollView>
                                </SafeAreaView>
                            </View>
                        </Modal>
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
    headerCloseModal: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    viewTextTimeWithBorder: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        padding: styleSheets.p_15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColor
    },
    viewTextTimeWithoutBorder: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        padding: styleSheets.p_15
    },
    viewTime: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 35,
        paddingTop: 5
    },
    groupButton__text__view: {
        paddingLeft: styleSheets.p_7
    },
    coating: {
        flex: 1,
        backgroundColor: Colors.black,
        opacity: 0.5
    },
    viewListItemPlanLimitTime: { flexGrow: 1, flexDirection: 'column' }
});
