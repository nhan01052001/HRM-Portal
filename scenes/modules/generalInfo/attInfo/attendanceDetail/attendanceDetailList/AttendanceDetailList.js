import React, { Component } from 'react';
import { View, FlatList, RefreshControl, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import {
    Colors,
    CustomStyleSheet,
    styleSheets,
    styleVnrListItem,
    stylesScreenDetailV3
} from '../../../../../../constants/styleConfig';
import RenderTitleWeeks from './RenderTitleWeeks';
import AttendanceDetailItem from './AttendanceDetailItem';
import VnrLoading from '../../../../../../components/VnrLoading/VnrLoading';
import Vnr_Function from '../../../../../../utils/Vnr_Function';
import EmptyData from '../../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../../utils/HttpService';
import DrawerServices from '../../../../../../utils/DrawerServices';
import moment from 'moment';

const heightActionBottom = 45;

export default class AttendanceDetailList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //itemSelected: [],
            refreshing: false,
            isLoading: true,
            stateProps: props,
            dataSource: [],
            fullData: [],
            footerLoading: false,
            //isOpenAction: false,
            messageEmptyData: 'EmptyData'
        };
        this.callOnEndReached = false;
        this.oldIndexOpenSwipeOut = null;
        this.listItemOpenSwipeOut = [];
    }

    UNSAFE_componentWillReceiveProps(nexProps) {
        if (nexProps.dataFilter != this.props.dataFilter) {
            this.filterData(nexProps.dataFilter);
        }
        if (nexProps != this.props) {
            this.refresh(nexProps);
        }
    }

    filterData = (dataFilter) => {
        const { fullData } = this.state;
        let data = fullData.filter((item) => {
            return moment(item['WorkDate']).format('DD/MM/YYYY') == moment(dataFilter).format('DD/MM/YYYY');
        });

        this.setState({ dataSource: data });
    };

    renderSeparator = () => {
        return <View style={stylesScreenDetailV3.separator} />;
    };

    remoteData = () => {
        const { api, dataLocal } = this.state.stateProps;
        if (!Vnr_Function.CheckIsNullOrEmpty(dataLocal)) {
            this.setState({
                fullData: dataLocal,
                dataSource: dataLocal,
                isLoading: false,
                refreshing: false,
                footerLoading: false
            });
        } else if (!Vnr_Function.CheckIsNullOrEmpty(api.dataBody.CutOffDurationID)) {
            api.dataBody = Object.assign(api.dataBody);
            HttpService.Post(api.urlApi, api.dataBody)
                .then((res) => {
                    this.setState({
                        fullData: res,
                        dataSource: res,
                        isLoading: false,
                        refreshing: false,
                        footerLoading: false
                    });
                })
                .catch((error) => {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                });
        }
    };

    componentDidMount() {
        this.remoteData();
    }

    _handleRefresh = () => {
        this.setState({ refreshing: true }, this.remoteData);
    };

    _renderLoading = () => {
        return (
            <View style={styles.styViewLoadingFooter}>
                <VnrLoading size="large" isVisible={this.state.footerLoading} />
            </View>
        );
    };

    refresh = (nexProps) => {
        this.setState({ isLoading: true, stateProps: nexProps }, this.remoteData);
    };

    handerOpenSwipeOut = (indexOnOpen) => {
        if (this.oldIndexOpenSwipeOut !== null && this.oldIndexOpenSwipeOut != indexOnOpen) {
            if (
                !Vnr_Function.CheckIsNullOrEmpty(this.listItemOpenSwipeOut[this.oldIndexOpenSwipeOut]) &&
                this.listItemOpenSwipeOut[this.oldIndexOpenSwipeOut]['value'] != null
            ) {
                this.listItemOpenSwipeOut[this.oldIndexOpenSwipeOut]['value'].close();
            }
        }
        this.oldIndexOpenSwipeOut = indexOnOpen;
    };

    moveToDetail = (item) => {
        const { detail, rowTouch } = this.props;
        if (!Vnr_Function.CheckIsNullOrEmpty(rowTouch) && typeof rowTouch == 'function') {
            rowTouch(item);
        } else if (
            !Vnr_Function.CheckIsNullOrEmpty(detail) &&
            !Vnr_Function.CheckIsNullOrEmpty(detail.screenDetail) &&
            !Vnr_Function.CheckIsNullOrEmpty(detail.screenName)
        ) {
            DrawerServices.navigate(detail.screenDetail, {
                dataItem: item,
                screenName: detail.screenName
            });
        }
    };

    render() {
        const { dataSource, stateProps, isLoading, refreshing, isOpenAction, messageEmptyData } = this.state;
        const valueField = !Vnr_Function.CheckIsNullOrEmpty(stateProps.valueField) ? stateProps.valueField : 'ID';
        const VnrListItemAction = styleVnrListItem.VnrListItemAction;

        return (
            <View style={[VnrListItemAction.container, isOpenAction == true && { paddingBottom: heightActionBottom }]}>
                {/* {(isOpenAction == true) && (
                    <BottomAction
                        listActions={stateProps.selected}
                        numberItemSelected={itemSelected.length}
                        closeAction={this.closeAction}
                        checkedAll={this.checkedAll}
                        unCheckedAll={this.unCheckedAll}
                        heightAction={heightActionBottom}
                        itemSelected={itemSelected}
                    />
                )}
                {(isOpenAction == true) && (
                    <TopAction
                        listActions={stateProps.selected}
                        numberItemSelected={itemSelected.length}
                        closeAction={this.closeAction}
                        checkedAll={this.checkedAll}
                        unCheckedAll={this.unCheckedAll}
                        heightAction={heightActionBottom}
                        itemSelected={itemSelected}
                    />
                )} */}
                {isLoading ? (
                    <VnrLoading size="large" isVisible={isLoading} />
                ) : dataSource.length == 0 ? (
                    <EmptyData messageEmptyData={messageEmptyData} />
                ) : (
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        disableScrollViewPanResponder={true} // fix bug khong the click onPess sau khi pulltoRefresh
                        data={dataSource}
                        extraData={this.state}
                        ListFooterComponent={this._renderLoading}
                        ItemSeparatorComponent={this.renderSeparator}
                        renderItem={({ item, index }) => {
                            if (item.TitleWeek != null) {
                                return (
                                    <RenderTitleWeeks
                                        dataItem={item}
                                        index={index}
                                        listItemOpenSwipeOut={this.listItemOpenSwipeOut}
                                        handerOpenSwipeOut={this.handerOpenSwipeOut}
                                    />
                                );
                            } else {
                                return (
                                    <View style={[styles.styViewItemDetail]}>
                                        <TouchableWithoutFeedback
                                            //onLongPress={() => { this.openAction(index) }}
                                            onPress={() => {
                                                this.moveToDetail(item);
                                            }}
                                            onPressIn={() => {
                                                this.handerOpenSwipeOut(index);
                                            }}
                                        >
                                            <View style={CustomStyleSheet.flex(1)}>
                                                <AttendanceDetailItem
                                                    index={index}
                                                    renderRowConfig={stateProps.renderConfig}
                                                    dataItem={item}
                                                    handerOpenSwipeOut={this.handerOpenSwipeOut}
                                                    listItemOpenSwipeOut={this.listItemOpenSwipeOut}
                                                    rowActions={
                                                        !Vnr_Function.CheckIsNullOrEmpty(stateProps.rowActions)
                                                            ? stateProps.rowActions
                                                            : null
                                                    }
                                                />
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                );
                            }
                        }}
                        keyExtractor={(item) => item[valueField]}
                        refreshControl={
                            <RefreshControl
                                onRefresh={() => this._handleRefresh()}
                                refreshing={refreshing}
                                size="large"
                                tintColor={Colors.primary}
                            />
                        }
                    />
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    styViewItemDetail: { flex: 1, flexDirection: 'row', backgroundColor: Colors.white },
    styViewLoadingFooter: { flex: 1, paddingVertical: styleSheets.p_10 }
});
