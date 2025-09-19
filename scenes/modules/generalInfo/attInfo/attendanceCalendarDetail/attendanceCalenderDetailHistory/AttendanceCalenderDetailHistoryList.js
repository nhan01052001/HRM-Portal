import React from 'react';
import { View, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';

import { Colors, Size, stylesScreenDetailV3, stylesVnrLoading } from '../../../../../../constants/styleConfig';
import AttendanceCalenderDetailHistoryItem from './AttendanceCalenderDetailHistoryItem';
import Vnr_Function from '../../../../../../utils/Vnr_Function';
import DrawerServices from '../../../../../../utils/DrawerServices';
import { getDataLocal } from '../../../../../../factories/LocalData';
import VnrLoading from '../../../../../../components/VnrLoading/VnrLoading';
import { EnumName } from '../../../../../../assets/constant';
import EmptyData from '../../../../../../components/EmptyData/EmptyData';
import VnrIndeterminate from '../../../../../../components/VnrLoading/VnrIndeterminate';

export default class AttendanceCalenderDetailHistoryList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //valueField: "ID",
            itemSelected: [],
            refreshing: false, //biến hiển thị loading pull to refresh
            isLoading: true, // biến hiển thị loading dữ liệu cho danh sách
            stateProps: { ...props },
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
        const { keyDataLocal, keyQuery } = this.state.stateProps,
            { isLazyLoading } = param;
        const { dataSource, page } = this.state;
        this.indexToday = 0;
        if (keyDataLocal) {
            this.successRender = false;
            getDataLocal(keyDataLocal)
                .then((resData) => {
                    const res = resData && resData[keyQuery] ? resData[keyQuery] : null;
                    if (res && res !== EnumName.E_EMPTYDATA) {
                        if (page === 1) {
                            this.setState({
                                dataSource: res.Data,
                                isLoading: false,
                                refreshing: false,
                                footerLoading: false,
                                isLoadingHeader: isLazyLoading ? false : true
                            });
                        } else {
                            this.setState({
                                dataSource: [...dataSource, ...res.Data],
                                isLoading: false,
                                refreshing: false,
                                footerLoading: false,
                                isLoadingHeader: isLazyLoading ? false : true
                            });
                        }
                    } else if (res === EnumName.E_EMPTYDATA) {
                        this.setState({
                            checkDateOfWeek: 0,
                            dataCalendar: EnumName.E_EMPTYDATA,
                            fullData: [],
                            dataSource: EnumName.E_EMPTYDATA,
                            isLoading: false,
                            refreshing: false,
                            footerLoading: false,
                            isLoadingHeader: isLazyLoading ? false : true,
                            isPullToRefresh: !this.state.isPullToRefresh
                        });
                    }
                })
                .catch((error) => {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                });
        } else {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: 'Thiêu Prop keyDataLocal' });
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
            <View style={stylesVnrLoading.loadingInList}>
                <VnrLoading size="large" isVisible={this.state.isLoadingFooter} />
            </View>
        );
    };

    _renderHeaderLoading = () => {
        return <VnrIndeterminate isVisible={this.state.isLoadingHeader} />;
    };

    moveToDetail = (item) => {
        const { detail, rowTouch } = this.props;
        // Keyboard.dismiss();

        if (!Vnr_Function.CheckIsNullOrEmpty(rowTouch) && typeof rowTouch == 'function') {
            rowTouch();
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
        const { dataSource, isLoading, refreshing, totalRow } = this.state,
            { api } = this.props,
            valueField = !Vnr_Function.CheckIsNullOrEmpty(this.props.valueField) ? this.props.valueField : 'ID';

        let dataBody = api ? (api.dataBody && this.isCheckAllServer ? api.dataBody : null) : null;

        if (dataBody) {
            dataBody = {
                ...dataBody,
                pageSize: totalRow
            };
        }

        let contentList = <View />;
        if (isLoading) {
            contentList = <VnrLoading size="large" isVisible={isLoading} />;
        } else if (dataSource == EnumName.E_EMPTYDATA || dataSource.length == 0) {
            contentList = <EmptyData messageEmptyData={'EmptyData'} />;
        } else if (dataSource && Array.isArray(dataSource) && dataSource.length > 0) {
            contentList = (
                <FlatList
                    keyboardShouldPersistTaps={'handled'}
                    showsVerticalScrollIndicator={false}
                    disableScrollViewPanResponder={true} // fix bug khong the click onPess sau khi pulltoRefresh
                    data={dataSource}
                    extraData={this.state}
                    ListFooterComponent={this._renderFooterLoading}
                    ListHeaderComponent={this._renderHeaderLoading}
                    style={{
                        // nếu không có filter thì padding top
                        paddingTop: Size.defineSpace
                    }}
                    renderItem={({ item }) => (
                        <View style={[styles.containBotton]}>
                            <TouchableOpacity
                                activeOpacity={1}
                                style={styles.styleViewBorderButtom}
                                onPress={() => {
                                    this.moveToDetail(item);
                                }}
                            >
                                <AttendanceCalenderDetailHistoryItem dataItem={item} />
                            </TouchableOpacity>
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

        return <View style={[styles.containerGrey]}>{contentList}</View>;
    }
}

const styles = StyleSheet.create({
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
