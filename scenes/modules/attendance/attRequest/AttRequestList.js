import React from 'react';
import { View, FlatList, RefreshControl, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { Colors, CustomStyleSheet, styleSheets, styleVnrListItem, stylesScreenDetailV3 } from '../../../../constants/styleConfig';
import AttRequestItem from './AttRequestItem';
import VnrLoading from '../../../../components/VnrLoading/VnrLoading';
import Vnr_Function from '../../../../utils/Vnr_Function';
import EmptyData from '../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../utils/HttpService';
import DrawerServices from '../../../../utils/DrawerServices';
import moment from 'moment';
import { EnumName } from '../../../../assets/constant';

const heightActionBottom = 45;
export default class AttRequestList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //valueField: "ID",
            itemSelected: [],
            refreshing: false,
            isLoading: true,
            stateProps: { ...props },
            dataSource: [],
            totalRow: 0,
            page: 1,
            footerLoading: false,
            isOpenAction: false,
            messageEmptyData: 'EmptyData',
            marginTopNumber: 0
        };
        this.callOnEndReached = false;
        this.oldIndexOpenSwipeOut = null;
        this.listItemOpenSwipeOut = [];
        if (
            !Vnr_Function.CheckIsNullOrEmpty(this.props.api) &&
            !Vnr_Function.CheckIsNullOrEmpty(this.props.api.pageSize) &&
            typeof this.props.api.pageSize == 'number'
        ) {
            this.pageSize = this.props.api.pageSize;
        } else {
            this.pageSize = 20;
        }
    }

    renderSeparator = () => {
        return (
            <View
                style={stylesScreenDetailV3.separator}
            />
        );
    };
    requestFormatDateStart = () => {
        const { api } = this.state.stateProps;
        if (
            !Vnr_Function.CheckIsNullOrEmpty(api.dataBody.dateStart) &&
            !Vnr_Function.CheckIsNullOrEmpty(api.dataBody.dateEnd)
        ) {
            const dataBodyDateStart = {
                    value: moment(api.dataBody.dateStart).format('DD/MM/YYYY')
                },
                dataBodyDateEnd = {
                    value: moment(api.dataBody.dateEnd).format('DD/MM/YYYY')
                },
                listRequest = [
                    HttpService.Post('[URI_SYS]/Sys_GetData/GetFormatDate', dataBodyDateStart),
                    HttpService.Post('[URI_SYS]/Sys_GetData/GetFormatDate', dataBodyDateEnd)
                ];
            return HttpService.MultiRequest(listRequest);
        }
    };

    reload = () => {
        this.setState({ isLoading: true });
        this.remoteData();
    };

    remoteData = () => {
        const { api } = this.state.stateProps;
        const { dataSource, page } = this.state;

        api.dataBody = Object.assign(api.dataBody);
        this.requestFormatDateStart()
            .then(allRes => {
                api.dataBody.dateStart = allRes[0];
                api.dataBody.dateEnd = allRes[1];
                HttpService.Post(api.urlApi, api.dataBody, null, this.reload)
                    .then(res => {
                        let data = [],
                            total = 0;
                        if (res && (res.data || res.Data)) {
                            if (res.data) {
                                data = [...res.data];
                            } else if (res.Data) {
                                data = [...res.Data];
                            }
                        }
                        if (res.total) {
                            total = res.total;
                        } else if (res.Total) {
                            total = res.Total;
                        }

                        if (page == 1) {
                            this.setState({
                                dataSource: data,
                                totalRow: total,
                                isLoading: false,
                                refreshing: false,
                                footerLoading: false
                            });
                        } else {
                            this.setState({
                                dataSource: [...dataSource, ...data],
                                totalRow: total,
                                isLoading: false,
                                refreshing: false,
                                footerLoading: false
                            });
                        }
                    })
                    .catch(error => {
                        if (error == EnumName.E_NOINTERNET) {
                            this.setState(
                                {
                                    dataSource: [],
                                    totalRow: 0,
                                    isLoading: false,
                                    refreshing: false,
                                    footerLoading: false,
                                    isPullToRefresh: !this.state.isPullToRefresh
                                },
                                () => {
                                    setTimeout(() => {
                                        this.endLoading = false;
                                    }, 1000);
                                }
                            );
                        } else {
                            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                        }
                    });
            })
            .catch(error => {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            });
    };

    componentDidMount() {
        this.remoteData();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.setState(
                {
                    dataSource: [],
                    itemSelected: [],
                    stateProps: nextProps,
                    page: 1,
                    isOpenAction: false,
                    isLoading: true
                },
                () => this.remoteData()
            );
        }
    }

    _handleRefresh = () => {
        !this.state.isOpenAction && this.setState({ refreshing: true, page: 1 }, this.remoteData);
    };

    _handleEndRefresh = () => {
        if (this.state.isOpenAction) {
            return false;
        }
        let { totalRow, page } = this.state;
        let PageTotal = Math.ceil(totalRow / this.pageSize);
        if (page < PageTotal) {
            this.setState({ page: page + 1, footerLoading: true }, this.remoteData);
        } else {
            return null;
        }
    };

    _renderLoading = () => {
        return (
            <View style={{ ...CustomStyleSheet.flex(1), ...CustomStyleSheet.paddingVertical(styleSheets.p_10) }}>
                <VnrLoading size="large" isVisible={this.state.footerLoading} />
            </View>
        );
    };

    handerOpenSwipeOut = indexOnOpen => {
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

    addItemChecked = indexItem => {
        const valueField = !Vnr_Function.CheckIsNullOrEmpty(this.props.valueField) ? this.props.valueField : 'ID';
        let { itemSelected, dataSource } = this.state;

        let itemChecked = dataSource[indexItem];
        if (!itemChecked.isSelect) {
            // kiem tra isSelect == true thi add vao mang itemSelected
            itemSelected = itemSelected.concat(itemChecked);
        } else {
            itemSelected = Vnr_Function.removeObjectInArray(itemSelected, itemChecked, valueField);
        }
        itemChecked.isSelect = !itemChecked.isSelect;

        this.setState({ dataSource: dataSource, itemSelected: itemSelected });
    };

    checkedAll = () => {
        const { dataSource } = this.state;
        dataSource.map(item => {
            item.isSelect = true;
        });
        let itemSelected = [...dataSource];
        this.setState({ dataSource: dataSource, itemSelected: itemSelected });
    };

    unCheckedAll = () => {
        const { dataSource } = this.state;
        dataSource.map(item => {
            item.isSelect = false;
        });
        this.setState({ dataSource: dataSource, itemSelected: [] });
    };

    addItemCheckedWidthOpenAction = indexItem => {
        const valueField = !Vnr_Function.CheckIsNullOrEmpty(this.props.valueField) ? this.props.valueField : 'ID';
        let { itemSelected, dataSource } = this.state;

        let itemChecked = dataSource[indexItem];
        if (!itemChecked.isSelect) {
            // kiem tra isSelect == true thi add vao mang itemSelected
            itemSelected = itemSelected.concat(itemChecked);
        } else {
            itemSelected = Vnr_Function.removeObjectInArray(itemSelected, itemChecked, valueField);
        }
        itemChecked.isSelect = !itemChecked.isSelect;

        return { dataSource: dataSource, itemSelected: itemSelected };
    };

    openAction = index => {
        const stateProps = this.props;
        const { isOpenAction } = this.state;

        if (!isOpenAction && !Vnr_Function.CheckIsNullOrEmpty(stateProps.selected)) {
            const result = this.addItemCheckedWidthOpenAction(index);
            this.setState({ ...{ isOpenAction: true }, ...result, marginTopNumber: -65 });
        }
    };

    closeAction = () => {
        const { dataSource } = this.state;
        dataSource.map(item => {
            item.isSelect = false;
        });
        this.setState({ dataSource: dataSource, isOpenAction: false, itemSelected: [], marginTopNumber: 0 });
    };

    handelListActionParamsScreenDetail = dataItem => {
        const { rowActions } = this.state.stateProps;
        let listActions = [];
        if (!Vnr_Function.CheckIsNullOrEmpty(dataItem.BusinessAllowAction)) {
            listActions = rowActions.filter(item => {
                return dataItem.BusinessAllowAction.indexOf(item.type) >= 0;
            });
        }
        return listActions;
    };
    moveToDetail = item => {
        const { detail, rowTouch, reloadScreenList } = this.props;
        if (!Vnr_Function.CheckIsNullOrEmpty(rowTouch) && typeof rowTouch == 'function') {
            rowTouch();
        } else if (
            !Vnr_Function.CheckIsNullOrEmpty(detail) &&
            !Vnr_Function.CheckIsNullOrEmpty(detail.screenDetail) &&
            !Vnr_Function.CheckIsNullOrEmpty(detail.screenName)
        ) {
            const _listActions = this.handelListActionParamsScreenDetail(item);
            DrawerServices.navigate(detail.screenDetail, {
                dataItem: item,
                screenName: detail.screenName,
                listActions: _listActions,
                reloadScreenList: reloadScreenList
            });
        }
    };

    render() {
        const { dataSource, stateProps, isLoading, refreshing, isOpenAction, messageEmptyData } = this.state;
        const valueField = !Vnr_Function.CheckIsNullOrEmpty(stateProps.valueField) ? stateProps.valueField : 'ID';
        const VnrListItemAction = styleVnrListItem.VnrListItemAction;

        return (
            <View style={[VnrListItemAction.container, isOpenAction == true && { paddingBottom: heightActionBottom }]}>
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
                        renderItem={({ item, index }) => (
                            <View style={styles.wrapItemRender}>
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
                                        <AttRequestItem
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
                        )}
                        keyExtractor={item => item[valueField]}
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
    wrapItemRender: { flex: 1, flexDirection: 'row', backgroundColor: Colors.white }
})
