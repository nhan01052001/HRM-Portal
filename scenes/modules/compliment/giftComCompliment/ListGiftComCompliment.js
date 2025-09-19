import React from 'react';
import {
    View,
    FlatList,
    RefreshControl,
    TouchableWithoutFeedback,
    StyleSheet,
    Keyboard,
    TouchableOpacity,
    Text,
    Platform
} from 'react-native';
import { Colors, Size, styleSheets, stylesScreenDetailV3, CustomStyleSheet } from '../../../../constants/styleConfig';
import VnrLoading from '../../../../components/VnrLoading/VnrLoading';
import VnrIndeterminate from '../../../../components/VnrLoading/VnrIndeterminate';
import VnrLoadingScreen from '../../../../components/VnrLoading/VnrLoadingScreen';
import Vnr_Function from '../../../../utils/Vnr_Function';
import EmptyData from '../../../../components/EmptyData/EmptyData';
import DrawerServices from '../../../../utils/DrawerServices';
import { EnumName, EnumStatus, ScreenName } from '../../../../assets/constant';
import { getDataLocal } from '../../../../factories/LocalData';
import ItemGiftComCompliment from './ItemGiftComCompliment';
import { ConfigListFilter } from '../../../../assets/configProject/ConfigListFilter';
import Vnr_Services from '../../../../utils/Vnr_Services';
import { DATA } from './GiftComCompliment';
import { ToasterSevice } from '../../../../components/Toaster/Toaster';
import GiftConfirmExChangeComCompliment from './GiftConfirmExChangeComCompliment';

const heightActionBottom = 45;

export default class ListGiftComCompliment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //valueField: "ID",
            itemSelected: [],
            refreshing: false, //biến hiển thị loading pull to refresh
            isLoading: true, // biến hiển thị loading dữ liệu cho danh sách
            // stateProps: { ...props },
            dataSource: DATA,
            totalRow: 0,
            page: 1,
            isLoadingFooter: false, // biến hiển thị loading ở footer hay không
            isOpenAction: false, // biến ẩn hiện Action
            messageEmptyData: 'EmptyData',
            marginTopNumber: 0,
            isDisableSelectItem: null,
            isPullToRefresh: false, // biến dùng phủ định lại dữ liệu để render lại RenderItem
            isAddItemChecked: false, // biến dùng để reload DS khi add item checked
            isLoadingHeader: true, // biến hiển thị đang compare data local
            isRefreshItem: false
        };
        this.endLoading = false;
        this.callOnEndReached = false;
        this.oldIndexOpenSwipeOut = null;
        this.listItemOpenSwipeOut = [];
        this.GiftConfirmExChangeComCompliment = null;
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

    // reset array when exit screen (TEMP)
    componentWillUnmount() {
        DATA.forEach((item) => {
            if (item?.quantitySelected) {
                item.Remaining += item?.quantitySelected;
            }
            delete item?.isSelect;
            delete item?.quantitySelected;
        });
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
                            if (this.props?.detail?.screenName === ScreenName.HistoryConversion) {
                                item.BusinessAllowAction = Vnr_Services.handleStatus(item?.Status, '');
                                item.itemStatus = Vnr_Services.formatStyleStatusApp(item?.Status);
                            } else {
                                item.BusinessAllowAction = 'E_SENDTHANKS';
                            }
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
                    } else {
                        this.setState({
                            itemSelected: [],
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
            <View style={styles.styLoadingFooter}>
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
        itemChecked.quantitySelected = 1;
        itemChecked.Remaining -= 1;

        this.setState({
            dataSource: dataSource,
            itemSelected: itemSelected,
            isAddItemChecked: !isAddItemChecked
        });
    };

    handleAdd = (indexItem) => {
        // Keyboard.dismiss();
        let { itemSelected, dataSource, isAddItemChecked, isRefreshItem } = this.state;

        let itemChecked = dataSource[indexItem];

        if (!itemChecked.isSelect) {
            // kiem tra isSelect == true thi add vao mang itemSelected
            //itemChecked.index = indexItem;
            itemSelected = itemSelected.concat(itemChecked);
        }

        if (itemChecked.Remaining === 0) {
            ToasterSevice.showWarning('Hết hàng!');
            return;
        }

        itemChecked.isSelect = true;
        itemChecked.quantitySelected += 1;
        itemChecked.Remaining -= 1;

        this.setState({
            dataSource: dataSource,
            itemSelected: itemSelected,
            isAddItemChecked: !isAddItemChecked,
            isRefreshItem: !isRefreshItem
        });
    };

    handleMinus = (indexItem) => {
        // Keyboard.dismiss();
        const valueField = !Vnr_Function.CheckIsNullOrEmpty(this.props.valueField) ? this.props.valueField : 'ID';
        let { itemSelected, dataSource, isAddItemChecked, isRefreshItem } = this.state;

        let itemChecked = dataSource[indexItem];

        if (itemChecked?.isSelect) {
            if (itemChecked.quantitySelected === 0) {
                return;
            }

            itemChecked.isSelect = true;
            itemChecked.quantitySelected -= 1;
            itemChecked.Remaining += 1;

            if (itemChecked.quantitySelected === 0) {
                itemChecked.isSelect = false;
                itemSelected = Vnr_Function.removeObjectInArray(itemSelected, itemChecked, valueField);
            }

            this.setState({
                dataSource: dataSource,
                itemSelected: itemSelected,
                isAddItemChecked: !isAddItemChecked,
                isRefreshItem: !isRefreshItem
            });
        }
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
        let { itemSelected } = this.state;
        if (!Vnr_Function.CheckIsNullOrEmpty(rowTouch) && typeof rowTouch == 'function') {
            rowTouch();
        } else if (
            !Vnr_Function.CheckIsNullOrEmpty(detail) &&
            !Vnr_Function.CheckIsNullOrEmpty(detail.screenDetail) &&
            !Vnr_Function.CheckIsNullOrEmpty(detail.screenName)
        ) {
            //const _listActions = this.handelListActionParamsScreenDetail(item);
            DrawerServices.navigate(detail.screenDetail, {
                point: this.props?.point,
                dataItem: item,
                screenName: detail.screenName,
                itemSelected: itemSelected,
                //  listActions: _listActions,
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
                marginTopNumber,
                isRefreshItem
            } = this.state,
            { api, detail, rowActions } = this.props;
        this.isHaveFilter = detail.screenName && ConfigListFilter.value[detail.screenName];

        let dataBody = api ? (api.dataBody && this.isCheckAllServer ? api.dataBody : null) : null;

        let totalPoints = 0;

        itemSelected.map((item) => {
            if (item?.Cost && item?.quantitySelected) {
                totalPoints += item?.Cost * item?.quantitySelected;
            }
        });

        if (dataBody) {
            dataBody = {
                ...dataBody,
                pageSize: totalRow
            };
        }

        let contentList = <View />;
        if (isLoading) {
            contentList = (
                <VnrLoadingScreen
                    size="large"
                    screenName={this.props.detail ? this.props.detail.screenName : null}
                    isVisible={isLoading}
                    type={EnumStatus.E_SUBMIT}
                />
            );
        } else if (dataSource == EnumName.E_EMPTYDATA || dataSource.length == 0) {
            contentList = <EmptyData messageEmptyData={'EmptyData'} />;
        } else if (dataSource && dataSource.length > 0) {
            contentList = (
                <FlatList
                    ref={(refs) => (this.refFlatList = refs)}
                    showsVerticalScrollIndicator={false}
                    disableScrollViewPanResponder={true} // fix bug khong the click onPess sau khi pulltoRefresh
                    data={dataSource}
                    extraData={this.state}
                    ListFooterComponent={this._renderFooterLoading}
                    // ListHeaderComponent={this._renderHeaderLoading}
                    style={this.isHaveFilter ? styles.styHaveFilter : styles.styNotHaveFilter}
                    renderItem={({ item, index }) => (
                        <View style={[styles.containBotton]} onPes>
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    this.moveToDetail(item);
                                }}
                                style={[
                                    styles.containBotton,
                                    index === dataSource.length - 1 && CustomStyleSheet.marginBottom(12)
                                ]}
                            >
                                <View style={styles.styleViewBorderButtom}>
                                    <View style={CustomStyleSheet.flex(1)}>
                                        <ItemGiftComCompliment
                                            key={index}
                                            currentDetail={detail}
                                            onAdd={() => {
                                                this.handleAdd(index);
                                            }}
                                            onMinus={() => {
                                                this.handleMinus(index);
                                            }}
                                            onClick={() => {
                                                // this.addItemChecked(index, false, null);
                                                this.addItemChecked(index);
                                            }}
                                            onMoveDetail={() => {
                                                this.moveToDetail(item);
                                            }}
                                            isDisable={isDisableSelectItem}
                                            numberDataSoure={dataSource.length}
                                            isPullToRefresh={isPullToRefresh}
                                            isOpenAction={isOpenAction}
                                            isSelect={item.isSelect}
                                            index={index}
                                            dataItem={item}
                                            isRefreshItem={isRefreshItem}
                                            // toggleAction={this.toggleAction}
                                            handerOpenSwipeOut={this.handerOpenSwipeOut}
                                            listItemOpenSwipeOut={this.listItemOpenSwipeOut}
                                            color={this.props.color}
                                            rowActions={
                                                !Vnr_Function.CheckIsNullOrEmpty(rowActions) ? rowActions : null
                                            }
                                        />
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    )}
                    keyExtractor={(item, index) => {
                        return index;
                    }}
                    refreshControl={
                        <RefreshControl
                            onRefresh={() => this._handleRefresh()}
                            refreshing={refreshing}
                            size="large"
                            tintColor={Colors.primary}
                        />
                    }
                    onEndReached={() => {
                        // this.callOnEndReached = true;
                        if (!this.endLoading) {
                            this.endLoading = true;
                            this._handleEndRefresh();
                        }
                    }}
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
                {contentList}
                <GiftConfirmExChangeComCompliment
                    ref={(refs) => (this.GiftConfirmExChangeComCompliment = refs)}
                    dateItems={itemSelected}
                    totalPoints={totalPoints}
                />
                {itemSelected.length > 0 && (
                    <View style={styles.styViewItemSelected}>
                        <TouchableOpacity
                            style={styles.styTouchExchange}
                            onPress={() => {
                                if (this.props?.point < totalPoints) {
                                    ToasterSevice.showWarning('Điểm quy đổi không đủ!');
                                } else if (
                                    this.GiftConfirmExChangeComCompliment &&
                                    this.GiftConfirmExChangeComCompliment.onShow
                                ) {
                                    this.GiftConfirmExChangeComCompliment.onShow({
                                        reload: this.reload,
                                        record: null
                                    });
                                }
                            }}
                        >
                            <View>
                                <Text style={styles.styTextTotalChoice}>Tổng chọn</Text>
                            </View>
                            <View>
                                <Text style={styles.styTextTotalPoints}>
                                    {itemSelected.length} phần • {totalPoints} điểm
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    styNotHaveFilter: { marginTop: Size.defineHalfSpace, paddingTop: 0 },
    styHaveFilter: { marginTop: 0, paddingTop: Size.defineHalfSpace },
    styTextTotalPoints: { fontSize: 16, fontWeight: Platform.OS === 'ios' ? '300' : '500', color: Colors.white },
    styTextTotalChoice: { fontSize: 16, fontWeight: Platform.OS === 'ios' ? '400' : '600', color: Colors.white },
    styTouchExchange: {
        backgroundColor: Colors.primary,
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 12
    },
    styViewItemSelected: {
        backgroundColor: Colors.white,
        padding: 12
    },
    styLoadingFooter: {
        flex: 1,
        paddingVertical: styleSheets.p_10,
        marginBottom: 30
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
