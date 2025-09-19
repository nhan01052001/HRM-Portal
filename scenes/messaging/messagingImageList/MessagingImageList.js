import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Image, StyleSheet } from 'react-native';
import { Colors, Size, styleSheets } from '../../../constants/styleConfig';
import VnrLoading from '../../../components/VnrLoading/VnrLoading';
import Vnr_Function from '../../../utils/Vnr_Function';
import EmptyData from '../../../components/EmptyData/EmptyData';
import HttpService from '../../../utils/HttpService';
import ViewImg from '../../../components/ViewImg/ViewImg';
const heightActionBottom = 45;

export default class MessagingImageList extends React.Component {
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

    remoteData = () => {
        const { api, dataLocal } = this.state.stateProps;
        const { dataSource, page } = this.state;
        if (!Vnr_Function.CheckIsNullOrEmpty(dataLocal)) {
            this.setState({
                fullData: dataLocal,
                dataSource: dataLocal,
                isLoading: false,
                refreshing: false,
                footerLoading: false
            });
        } else {
            api.dataBody = Object.assign(api.dataBody, { PageSize: this.pageSize, index: page });

            console.log(api.dataBody, 'api.dataBody ');
            HttpService.Post(api.urlApi, api.dataBody).then(res => {
                console.log(res, 'res');
                try {
                    let data = [],
                        total = 0;
                    if (res && (res.data || res.Data)) {
                        if (res.data) {
                            data = [...res.data];
                        } else if (res.Data) {
                            data = [...res.Data];
                        }
                    }

                    if (res.hasOwnProperty('total')) {
                        total = res.total;
                    } else if (res.hasOwnProperty('Total')) {
                        total = 40; //res.Total;
                    }

                    data.map(item => {
                        item.isSelect = false;
                    });

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
                } catch (error) {}
            });
        }
    };

    componentDidMount() {
        this.remoteData();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.isRefreshList !== nextProps.isRefreshList) {
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

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.isRefreshList !== this.props.isRefreshList || nextState.isLoading !== this.state.isLoading) {
            return true;
        }
        if (nextState.isOpenAction || !nextState.isOpenAction) {
            return true;
        }
    }

    _handleRefresh = () => {
        !this.state.isOpenAction && this.setState({ refreshing: true, page: 1 }, this.remoteData);
    };

    _handleEndRefresh = () => {
        debugger;
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
        try {
            return (
                <View style={{ flex: 1, paddingVertical: styleSheets.p_10 }}>
                    <VnrLoading size="large" isVisible={this.state.footerLoading} />
                </View>
            );
        } catch (error) {}
    };

    render() {
        const { dataSource, isLoading, refreshing, totalRow, messageEmptyData } = this.state;
        const stateProps = this.props;
        let dataBody = stateProps.api
            ? stateProps.api.dataBody && this.isCheckAllServer
                ? stateProps.api.dataBody
                : null
            : null;

        if (dataBody) {
            dataBody = {
                ...dataBody,
                pageSize: totalRow
            };
        }

        const valueField = !Vnr_Function.CheckIsNullOrEmpty(stateProps.valueField) ? stateProps.valueField : 'ID';
        return (
            <View style={styles.containerGrey}>
                {isLoading ? (
                    <VnrLoading size="large" isVisible={isLoading} />
                ) : dataSource.length == 0 && !isLoading ? (
                    <EmptyData messageEmptyData={messageEmptyData} />
                ) : (
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        disableScrollViewPanResponder={true} // fix bug khong the click onPess sau khi pulltoRefresh
                        data={dataSource}
                        extraData={this.state}
                        ListFooterComponent={this._renderLoading}
                        numColumns={Size.deviceWidth >= 1024 ? 4 : 3}
                        columnWrapperStyle={{
                            marginBottom: 5
                            // justifyContent: 'space-between'
                        }}
                        renderItem={({ item, index }) => (
                            <ViewImg source={item.Content} showChildren={true}>
                                <Image
                                    key={index}
                                    resizeMode={'contain'}
                                    source={{ uri: item.Content }}
                                    style={styles.libary_imge(index)}
                                />
                            </ViewImg>
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
                        onEndReached={aa => {
                            this.callOnEndReached = true;
                        }} // refresh khi scroll den cuoi
                        onEndReachedThreshold={0.1} // khoan cach tinh tu vi tri cuoi ds , se goi onEndReached
                    />
                )}
            </View>
        );
    }
}

const SIZE_IMAGE_LIBARY = Size.deviceWidth >= 1024 ? (Size.deviceWidth - 12) / 4 : (Size.deviceWidth - 8) / 3,
    styles = StyleSheet.create({
        containBotton: {
            flex: 1,
            paddingHorizontal: 10
        },
        containerGrey: {
            flex: 1,
            backgroundColor: Colors.white,
            paddingTop: 5
        },
        styleViewBorderButtom: {
            borderWidth: 1,
            borderColor: Colors.borderColor,
            flex: 1,
            flexDirection: 'row',
            borderRadius: 5,
            marginBottom: 10
        },
        libary_imge: index => {
            return {
                height: SIZE_IMAGE_LIBARY,
                width: SIZE_IMAGE_LIBARY,
                marginRight: Size.deviceWidth >= 1024 ? ((index + 1) % 4 == 0 ? 0 : 4) : (index + 1) % 3 == 0 ? 0 : 4
            };
        }
    });
