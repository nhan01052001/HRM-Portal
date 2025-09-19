import React from 'react';
import {
    View,
    Text,
    FlatList,
    RefreshControl,
    StyleSheet,
    Keyboard,
    TouchableOpacity
} from 'react-native';
import { Colors, CustomStyleSheet, Size, styleSheets, stylesVnrLoading } from '../../../../../constants/styleConfig';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import VnrIndeterminate from '../../../../../components/VnrLoading/VnrIndeterminate';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import DrawerServices from '../../../../../utils/DrawerServices';
import { EnumName } from '../../../../../assets/constant';
import { getDataLocal } from '../../../../../factories/LocalData';
import HreWorkHistoryListItem from './HreWorkHistoryListItem';
import { ConfigListFilter } from '../../../../../assets/configProject/ConfigListFilter';
import TouchIDService from '../../../../../utils/TouchIDService';
import { translate } from '../../../../../i18n/translate';

export default class HreWorkHistoryList extends React.Component {
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
            isLoadingHeader: true, // biến hiển thị đang compare data local
            isLock: true
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
            nextState.isLoadingHeader !== this.state.isLoadingHeader ||
            nextState?.isLock !== this.state.isLock
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
                .then(resData => {
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

                        data.map(item => {
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
                                    isPullToRefresh: !this.state.isPullToRefresh,
                                    isLock: this.state.isLock
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
                .catch(error => {
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

    lazyLoading = nexProps => {
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
            <View
                style={stylesVnrLoading.loadingInList}
            >
                <VnrLoading size="large" isVisible={this.state.isLoadingFooter} />
            </View>
        );
    };

    _renderHeaderLoading = () => {
        return <VnrIndeterminate isVisible={this.state.isLoadingHeader} />;
    };

    handerOpenSwipeOut = indexOnOpen => {
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

    handelListActionParamsScreenDetail = dataItem => {
        const { rowActions } = this.props;
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
                dataItem: item,
                screenName: detail.screenName,
                listActions: _listActions,
                reloadScreenList: reloadScreenList
            });
        }
    };

    handleUnLock = () => {
        TouchIDService.checkConfirmPass(this.onFinish.bind(this), 'E_CONTRACT');
    };

    onFinish = isSuccess => {
        if (isSuccess) {
            this.setState({
                isLock: false
            });
        }
    };

    render() {
        const { dataSource, isLoading, refreshing, isPullToRefresh, totalRow, isLock } = this.state,
            { api, detail } = this.props,
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
            contentList = <VnrLoading size="large" isVisible={isLoading} />;
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
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{
                        // nếu không có filter thì padding top
                        paddingTop: !isHaveFilter ? Size.defineSpace : 0
                    }}
                    renderItem={({ item, index }) => (
                        <View style={[styles.containBotton]}>
                            <HreWorkHistoryListItem
                                currentDetail={detail}
                                isPullToRefresh={isPullToRefresh}
                                index={index}
                                dataItem={item}
                                isLock={isLock}
                                length={dataSource.length}
                                dataFilter={this.props?.dataFilter}
                            />
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
            <View style={[styles.containerGrey]}>
                {isLock && (
                    <View
                        style={styles.styIsLockView}
                    >
                        <View style={CustomStyleSheet.width('70%')}>
                            <Text style={[styleSheets.text, CustomStyleSheet.fontSize(16)]}>
                                {translate('HRM_PortalApp_NotificationLockSalary')}
                            </Text>
                        </View>
                        <View style={styles.styUnLoack}>
                            <TouchableOpacity
                                style={CustomStyleSheet.padding(8)}
                                onPress={() => {
                                    this.handleUnLock();
                                }}
                            >
                                <Text style={[styleSheets.lable, styles.styTextUnLock]}>
                                    {translate('HRM_PortalApp_UnLock')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                {contentList}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    styTextUnLock: { fontSize: 16,
        color: Colors.blue },
    styUnLoack: { width: '30%',
        alignItems: 'flex-end' },
    // eslint-disable-next-line react-native/no-color-literals
    styIsLockView: {
        backgroundColor: '#FFFBE6',
        borderColor: '#FFE58F',
        borderWidth: 0.5,
        padding: 8,
        marginTop: 8,
        marginHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    containBotton: {
        flex: 1
    },
    containerGrey: {
        flex: 1,
        backgroundColor: Colors.gray_3
    }
});
