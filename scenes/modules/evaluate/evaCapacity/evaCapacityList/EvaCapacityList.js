import React from 'react';
import { View, FlatList, RefreshControl, TouchableWithoutFeedback, StyleSheet, Keyboard } from 'react-native';
import {
    Colors,
    CustomStyleSheet,
    Size,
    styleSheets,
    stylesScreenDetailV3
} from '../../../../../constants/styleConfig';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import VnrIndeterminate from '../../../../../components/VnrLoading/VnrIndeterminate';
import VnrLoadingScreen from '../../../../../components/VnrLoading/VnrLoadingScreen';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import BottomAction from './BottomAction';
import TopAction from './TopAction';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import DrawerServices from '../../../../../utils/DrawerServices';
import { EnumName, EnumStatus, ScreenName } from '../../../../../assets/constant';
import { getDataLocal } from '../../../../../factories/LocalData';
import EvaCapacityListItem from './EvaCapacityListItem';
import EvaCapacityListItemApprove from './EvaCapacityListItemApprove';
import { ConfigListFilter } from '../../../../../assets/configProject/ConfigListFilter';

const heightActionBottom = 45;
export default class EvaCapacityList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //valueField: "ID",
            itemSelected: [],
            refreshing: false, //biến hiển thị loading pull to refresh
            isLoading: true, // biến hiển thị loading dữ liệu cho danh sách
            // stateProps: { ...props },
            dataSource: [],
            totalRow: 0,
            page: 1,
            isLoadingFooter: false, // biến hiển thị loading ở footer hay không
            isOpenAction: false, // biến ẩn hiện Action
            messageEmptyData: 'EmptyData',
            marginTopNumber: 0,
            isDisableSelectItem: null,
            isPullToRefresh: false, // biến dùng phủ định lại dữ liệu để render lại RenderItem
            isAddItemChecked: false, // biến dùng để reload DS khi add item checked
            isLoadingHeader: true // biến hiển thị đang compare data local
        };
        this.endLoading = false;
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

        //biến để kiểm tra có check all server
        this.isCheckAllServer = false;
    }

    renderSeparator = () => {
        return <View style={stylesScreenDetailV3.separator} />;
    };

    shouldComponentUpdate(nextProps, nextState) {
        return (
            nextProps.isRefreshList !== this.props.isRefreshList ||
            nextState.isLoading !== this.state.isLoading ||
            // nextProps.dataFilter !== this.props.dataFilter ||
            nextProps.isLazyLoading !== this.props.isLazyLoading ||
            nextState.refreshing !== this.state.refreshing ||
            nextState.isOpenAction !== this.state.isOpenAction ||
            nextState.isAddItemChecked !== this.state.isAddItemChecked ||
            nextState.isLoadingFooter !== this.state.isLoadingFooter ||
            nextState.isLoadingHeader !== this.state.isLoadingHeader
        );
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.isRefreshList != this.props.isRefreshList) {
            this.refresh(nextProps);
        }

        if (nextProps.isLazyLoading !== this.props.isLazyLoading) {
            this.lazyLoading(nextProps);
        }
    }

    remoteData = (param = {}) => {
        const { dataSource, page } = this.state,
            { isLazyLoading } = param,
            { keyDataLocal, keyQuery } = this.props;
        if (keyDataLocal) {
            getDataLocal(keyDataLocal)
                .then((resData) => {
                    const res = resData && resData[keyQuery] ? resData[keyQuery] : null;
                    if (res && res !== EnumName.E_EMPTYDATA) {
                        let data = [],
                            total = 0;

                        if (res && (res.data || res.Data)) {
                            if (res.data) {
                                data = [...res.data];
                            } else if (res.Data) {
                                data = [...res.Data];
                            }
                        } else if (res && Array.isArray(res)) {
                            data = [...res];
                        }

                        data.map((item) => {
                            item.isSelect = false;
                        });

                        if (res.total) {
                            total = res.total;
                        } else if (res.Total) {
                            total = res.Total;
                        }

                        if (page == 1) {
                            this.setState(
                                {
                                    itemSelected: [],
                                    dataSource: data,
                                    totalRow: total,
                                    isLoading: false,
                                    refreshing: false,
                                    isLoadingHeader: isLazyLoading ? false : true,
                                    isLoadingFooter: false,
                                    isOpenAction: false,
                                    isPullToRefresh: !this.state.isPullToRefresh
                                },
                                () => {
                                    setTimeout(() => {
                                        this.endLoading = false;
                                    }, 1000);
                                }
                            );
                        } else {
                            this.setState(
                                {
                                    itemSelected: [],
                                    dataSource: [...dataSource, ...data],
                                    totalRow: total,
                                    isLoading: false,
                                    refreshing: false,
                                    isLoadingHeader: isLazyLoading ? false : true,
                                    isLoadingFooter: false,
                                    isOpenAction: false,
                                    isPullToRefresh: !this.state.isPullToRefresh
                                },
                                () => {
                                    setTimeout(() => {
                                        this.endLoading = false;
                                    }, 1000);
                                }
                            );
                        }
                    } else if (res === EnumName.E_EMPTYDATA) {
                        this.setState({
                            itemSelected: [],
                            dataSource: EnumName.E_EMPTYDATA,
                            totalRow: 0,
                            isLoading: false,
                            refreshing: false,
                            isLoadingHeader: isLazyLoading ? false : true,
                            isLoadingFooter: false,
                            isOpenAction: false,
                            isPullToRefresh: !this.state.isPullToRefresh
                        });
                    }
                })
                .catch((error) => {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                });
        } else {
            DrawerServices.navigate('ErrorScreen', {
                ErrorDisplay: 'Thiêu Prop keyDataLocal'
            });
        }
    };

    componentDidMount() {
        this.remoteData();
    }

    refresh = () => {
        this.setState({ isLoading: true, page: 1 });
    };

    lazyLoading = (nexProps) => {
        // các trường hợp (pulltoRefresh, Màn hình) thì kiểm tra dữ liệu dữ liệu mới và củ có khác nhau hay không
        // paging,filter luôn thay đổi
        // dataChange (dùng để kiểm tra dữ liệu mới và củ  có khác nhau hay không )
        // dataChange == true ? khác : giống nhau
        if (!nexProps.dataChange) {
            this.setState({
                isLoadingHeader: false,
                refreshing: false,
                isLoading: false
            });
        } else {
            this.remoteData({ isLazyLoading: true });
        }
    };

    _handleRefresh = () => {
        const { pullToRefresh } = this.props;

        !this.state.isOpenAction &&
            this.setState({ refreshing: true, page: 1 }, () => {
                pullToRefresh && typeof pullToRefresh === 'function' && pullToRefresh();
            });
    };

    _handleEndRefresh = () => {
        if (this.state.isOpenAction || this.pageSize == 0) {
            return false;
        }
        const { pagingRequest } = this.props;
        let { totalRow, page } = this.state;
        let PageTotal = Math.ceil(totalRow / this.pageSize);
        if (page < PageTotal) {
            this.setState({ page: page + 1, isLoadingFooter: true }, () => {
                pagingRequest && typeof pagingRequest == 'function' && pagingRequest(this.state.page, this.pageSize);
            });
        } else {
            return null;
        }
    };

    _renderFooterLoading = () => {
        return (
            <View style={styles.styFooterLoading}>
                <VnrLoading size="large" isVisible={this.state.isLoadingFooter} />
            </View>
        );
    };

    _renderHeaderLoading = () => {
        return <VnrIndeterminate isVisible={this.state.isLoadingHeader} />;
    };

    handerOpenSwipeOut = (indexOnOpen) => {
        Keyboard.dismiss();
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

    addItemChecked = (indexItem) => {
        // Keyboard.dismiss();
        const valueField = !Vnr_Function.CheckIsNullOrEmpty(this.props.valueField) ? this.props.valueField : 'ID';
        let { itemSelected, dataSource, isAddItemChecked } = this.state;

        let itemChecked = dataSource[indexItem];
        if (!itemChecked.isSelect) {
            // kiem tra isSelect == true thi add vao mang itemSelected
            //itemChecked.index = indexItem;
            itemSelected = itemSelected.concat(itemChecked);
        } else {
            itemSelected = Vnr_Function.removeObjectInArray(itemSelected, itemChecked, valueField);
        }
        itemChecked.isSelect = !itemChecked.isSelect;

        this.setState({
            dataSource: dataSource,
            itemSelected: itemSelected,
            isAddItemChecked: !isAddItemChecked
        });
    };

    checkedAll = (isDisable) => {
        const { dataSource, isAddItemChecked } = this.state;
        dataSource.map((item) => {
            item.isSelect = true;
        });
        let itemSelected = [...dataSource],
            nextState = {
                ...this.state,
                dataSource: dataSource,
                itemSelected: itemSelected,
                isAddItemChecked: !isAddItemChecked
            };

        if (isDisable == true) {
            this.isCheckAllServer = true;
            nextState = {
                ...nextState,
                isDisableSelectItem: isDisable
            };
        }
        this.setState(nextState);
    };

    unCheckedAll = (isDisable) => {
        const { dataSource, isAddItemChecked } = this.state;
        dataSource.map((item) => {
            item.isSelect = false;
        });

        let nextState = {
            ...this.state,
            dataSource: dataSource,
            itemSelected: [],
            isAddItemChecked: !isAddItemChecked
        };
        if (isDisable == false) {
            this.isCheckAllServer = false;
            nextState = {
                ...nextState,
                isDisableSelectItem: false
            };
        }
        this.setState(nextState);
    };

    addItemCheckedWidthOpenAction = (indexItem) => {
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

    openAction = (index) => {
        const { selected } = this.props;
        const { isOpenAction } = this.state;
        // Keyboard.dismiss();
        if (!isOpenAction && !Vnr_Function.CheckIsNullOrEmpty(selected)) {
            const result = this.addItemCheckedWidthOpenAction(index);
            this.setState({
                ...{ isOpenAction: true },
                ...result,
                marginTopNumber: -65,
                isDisableSelectItem: false
            });
        }
    };

    closeAction = () => {
        const { dataSource } = this.state;
        dataSource.map((item) => {
            item.isSelect = false;
        });
        this.isCheckAllServer = false;
        this.setState({
            dataSource: dataSource,
            isOpenAction: false,
            itemSelected: [],
            marginTopNumber: 0,
            isDisableSelectItem: false
        });
    };

    handelListActionParamsScreenDetail = (dataItem) => {
        const { rowActions } = this.props;
        let listActions = [];
        if (!Vnr_Function.CheckIsNullOrEmpty(dataItem.BusinessAllowAction)) {
            listActions = rowActions.filter((item) => {
                return dataItem.BusinessAllowAction.indexOf(item.type) >= 0;
            });
        }
        return listActions;
    };

    moveToDetail = (item) => {
        const { detail, rowTouch, reloadScreenList } = this.props;
        // Keyboard.dismiss();

        if (!Vnr_Function.CheckIsNullOrEmpty(rowTouch) && typeof rowTouch == 'function') {
            rowTouch();
        } else if (
            !Vnr_Function.CheckIsNullOrEmpty(detail) &&
            !Vnr_Function.CheckIsNullOrEmpty(detail.screenDetail) &&
            !Vnr_Function.CheckIsNullOrEmpty(detail.screenName)
        ) {
            const _listActions = this.handelListActionParamsScreenDetail(item);
            DrawerServices.navigate(detail.screenDetail, {
                dataId: '12494125-6766-49e9-a6a5-d0b1417ed378',
                dataItem: item,
                screenName: detail.screenName,
                listActions: _listActions,
                reloadScreenList: reloadScreenList
            });
        }
    };

    render() {
        const {
                dataSource,
                isLoading,
                refreshing,
                isPullToRefresh,
                isOpenAction,
                isDisableSelectItem,
                itemSelected,
                totalRow,
                marginTopNumber
            } = this.state,
            { api, detail, renderConfig, rowActions, selected } = this.props,
            valueField = !Vnr_Function.CheckIsNullOrEmpty(this.props.valueField) ? this.props.valueField : 'ID',
            isHaveFilter = detail.screenName && ConfigListFilter.value[detail.screenName];

        let dataBody = api ? (api.dataBody && this.isCheckAllServer ? api.dataBody : null) : null;

        if (dataBody) {
            dataBody = {
                ...dataBody,
                pageSize: totalRow
            };
        }

        let contentList = <View />;
        if (isLoading) {
            let typeLoading =
                detail.screenName == ScreenName.EvaCapacityDetailConfirmed ||
                detail.screenName == ScreenName.EvaCapacityDetailWatting
                    ? EnumStatus.E_APPROVE
                    : EnumStatus.E_SUBMIT;

            contentList = (
                <VnrLoadingScreen
                    size="large"
                    screenName={this.props.detail ? this.props.detail.screenName : null}
                    isVisible={isLoading}
                    type={typeLoading}
                />
            );
        } else if (dataSource == EnumName.E_EMPTYDATA || dataSource.length == 0) {
            contentList = <EmptyData messageEmptyData={'EmptyData'} />;
        } else if (dataSource && dataSource.length > 0) {
            contentList = (
                <FlatList
                    keyboardShouldPersistTaps={'handled'}
                    showsVerticalScrollIndicator={false}
                    disableScrollViewPanResponder={true} // fix bug khong the click onPess sau khi pulltoRefresh
                    data={dataSource}
                    extraData={this.state}
                    ListFooterComponent={this._renderFooterLoading}
                    ListHeaderComponent={this._renderHeaderLoading}
                    style={[!isHaveFilter ? styles.paddingTopIsNotHaveFilter : styles.paddingTopIsHaveFilter]}
                    renderItem={({ item, index }) => (
                        <View style={[styles.containBotton]}>
                            <View style={styles.styleViewBorderButtom}>
                                <TouchableWithoutFeedback
                                    onLongPress={() => this.openAction(index)}
                                    onPress={() => {
                                        if (isOpenAction && !isDisableSelectItem) {
                                            this.addItemChecked(index);
                                        } else if (!isOpenAction) {
                                            this.moveToDetail(item);
                                        }
                                    }}
                                    onPressIn={() => this.handerOpenSwipeOut(index)}
                                >
                                    <View style={CustomStyleSheet.flex(1)}>
                                        {detail.screenName == ScreenName.EvaCapacityDetailConfirmed ||
                                        detail.screenName == ScreenName.EvaCapacityDetailWatting ? (
                                                <EvaCapacityListItemApprove
                                                    currentDetail={detail}
                                                    onClick={() => {
                                                        isOpenAction == true ? this.addItemChecked(index) : null;
                                                    }}
                                                    isDisable={isDisableSelectItem}
                                                    numberDataSoure={dataSource.length}
                                                    isPullToRefresh={isPullToRefresh}
                                                    isOpenAction={isOpenAction}
                                                    isSelect={item.isSelect}
                                                    index={index}
                                                    renderRowConfig={renderConfig}
                                                    dataItem={item}
                                                    addItem={this.addItemChecked}
                                                    toggleAction={this.toggleAction}
                                                    handerOpenSwipeOut={this.handerOpenSwipeOut}
                                                    listItemOpenSwipeOut={this.listItemOpenSwipeOut}
                                                    rowActions={
                                                        !Vnr_Function.CheckIsNullOrEmpty(rowActions) ? rowActions : null
                                                    }
                                                />
                                            ) : (
                                                <EvaCapacityListItem
                                                    currentDetail={detail}
                                                    onClick={() => {
                                                        isOpenAction == true ? this.addItemChecked(index) : null;
                                                    }}
                                                    isDisable={isDisableSelectItem}
                                                    numberDataSoure={dataSource.length}
                                                    isPullToRefresh={isPullToRefresh}
                                                    isOpenAction={isOpenAction}
                                                    isSelect={item.isSelect}
                                                    index={index}
                                                    renderRowConfig={renderConfig}
                                                    dataItem={item}
                                                    addItem={this.addItemChecked}
                                                    toggleAction={this.toggleAction}
                                                    handerOpenSwipeOut={this.handerOpenSwipeOut}
                                                    listItemOpenSwipeOut={this.listItemOpenSwipeOut}
                                                    rowActions={
                                                        !Vnr_Function.CheckIsNullOrEmpty(rowActions) ? rowActions : null
                                                    }
                                                />
                                            )}
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    )}
                    keyExtractor={(item) => item[valueField]}
                    refreshControl={
                        <RefreshControl
                            onRefresh={() => this._handleRefresh()}
                            refreshing={refreshing}
                            size="large"
                            tintColor={Colors.primary}
                        />
                    }
                    onMomentumScrollEnd={() => {
                        if (this.callOnEndReached && !this.endLoading) {
                            this.endLoading = true;
                            this.callOnEndReached = false;
                            this._handleEndRefresh();
                        }
                    }}
                    onEndReached={() => {
                        this.callOnEndReached = true;
                    }} // refresh khi scroll den cuoi
                    onEndReachedThreshold={0.5} // khoan cach tinh tu vi tri cuoi ds , se goi onEndReached
                />
            );
        }

        return (
            <View
                style={[
                    styles.containerGrey,
                    isOpenAction == true && {
                        paddingBottom: heightActionBottom,
                        marginTop: marginTopNumber
                    }
                ]}
            >
                {isOpenAction == true && (
                    <BottomAction
                        lengthDataSource={dataSource.length}
                        listActions={selected}
                        numberItemSelected={itemSelected.length}
                        closeAction={this.closeAction}
                        checkedAll={this.checkedAll}
                        unCheckedAll={this.unCheckedAll}
                        heightAction={heightActionBottom}
                        itemSelected={itemSelected}
                        totalRow={totalRow}
                    />
                )}
                {isOpenAction == true && (
                    <TopAction
                        listActions={selected}
                        numberItemSelected={itemSelected.length}
                        closeAction={this.closeAction}
                        checkedAll={this.checkedAll}
                        unCheckedAll={this.unCheckedAll}
                        heightAction={heightActionBottom}
                        itemSelected={itemSelected}
                        dataBody={dataBody}
                    />
                )}
                {contentList}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    styFooterLoading: { flex: 1, paddingVertical: styleSheets.p_10, marginBottom: 30 },
    paddingTopIsHaveFilter: {
        paddingTop: 0
    },
    paddingTopIsNotHaveFilter: {
        paddingTop: Size.defineSpace
    },
    containBotton: {
        flex: 1
    },
    containerGrey: {
        flex: 1,
        backgroundColor: Colors.gray_3
    },
    styleViewBorderButtom: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 8,
        marginBottom: Size.defineSpace / 2
    }
});
