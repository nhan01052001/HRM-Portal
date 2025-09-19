import React from 'react';
import { View, FlatList, RefreshControl, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { Colors, CustomStyleSheet, styleSheets, stylesScreenDetailV3 } from '../../../../../constants/styleConfig';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import DrawerServices from '../../../../../utils/DrawerServices';
import InOutItem from './InOutItem';
import VnrLoadingScreen from '../../../../../components/VnrLoading/VnrLoadingScreen';
import { EnumStatus } from '../../../../../assets/constant';

export default class InOutList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
            marginTopNumber: 0,
            isDisableSelectItem: null,
            isPullToRefresh: false
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

    remoteData = () => {
        const { api, dataLocal } = this.props,
            { dataSource, page } = this.state;

        if (!Vnr_Function.CheckIsNullOrEmpty(dataLocal)) {
            let data = [...dataLocal];
            data.map((item) => {
                item.isSelect = false;
            });

            this.setState({
                dataSource: data,
                totalRow: data.length,
                isLoading: false,
                refreshing: false,
                footerLoading: false,
                isPullToRefresh: !this.state.isPullToRefresh
            });
            return true;
        } else {
            api.dataBody = Object.assign(api.dataBody, { pageSize: this.pageSize, page: page });
            HttpService.Post(api.urlApi, api.dataBody)
                .then((res) => {
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
                                dataSource: data,
                                totalRow: total,
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
                        this.setState(
                            {
                                dataSource: [...dataSource, ...data],
                                totalRow: total,
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
                    }
                })
                .catch((error) => {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                });
        }
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
        if (this.state.isOpenAction || this.pageSize == 0) {
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
            <View style={styles.styViewLoading}>
                <VnrLoading size="large" isVisible={this.state.footerLoading} />
            </View>
        );
    };

    handelListActionParamsScreenDetail = (dataItem) => {
        const { rowActions } = this.state.stateProps;
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
        const { dataSource, isLoading, refreshing, isPullToRefresh, isOpenAction, messageEmptyData } = this.state,
            stateProps = this.props,
            valueField = !Vnr_Function.CheckIsNullOrEmpty(stateProps.valueField) ? stateProps.valueField : 'ID';

        return (
            <View style={[styleSheets.containerGrey, { backgroundColor: Colors.white }]}>
                {isLoading ? (
                    <VnrLoadingScreen
                        size="large"
                        screenName={this.props.detail ? this.props.detail.screenName : null}
                        isVisible={isLoading}
                        type={EnumStatus.E_SUBMIT}
                    />
                ) : dataSource.length == 0 && !isLoading ? (
                    <EmptyData messageEmptyData={messageEmptyData} />
                ) : (
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        disableScrollViewPanResponder={true} // fix bug khong the click onPess sau khi pulltoRefresh
                        data={dataSource}
                        extraData={this.state}
                        ListFooterComponent={this._renderLoading}
                        style={CustomStyleSheet.paddingTop(10)}
                        renderItem={({ item, index }) => (
                            <View style={[styleSheets.flex1flexDirectionRow]}>
                                <TouchableWithoutFeedback onPress={() => this.moveToDetail(item)}>
                                    <View style={CustomStyleSheet.flex(1)}>
                                        <InOutItem
                                            numberDataSoure={dataSource.length}
                                            isPullToRefresh={isPullToRefresh}
                                            isOpenAction={isOpenAction}
                                            isSelect={item.isSelect}
                                            index={index}
                                            renderRowConfig={stateProps.renderConfig}
                                            dataItem={item}
                                            addItem={this.addItemChecked}
                                            toggleAction={this.toggleAction}
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
                        onEndReachedThreshold={0.1} // khoan cach tinh tu vi tri cuoi ds , se goi onEndReached
                    />
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    styViewLoading: { flex: 1,
        paddingVertical: styleSheets.p_10 }
})