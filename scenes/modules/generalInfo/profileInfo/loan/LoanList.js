import React from 'react';
import {
    View, FlatList,
    RefreshControl,
    StyleSheet
} from 'react-native';
import { Colors, CustomStyleSheet, Size, styleSheets } from '../../../../../constants/styleConfig';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import DrawerServices from '../../../../../utils/DrawerServices';
import ContractItem from './LoanItem';
import { EnumName, EnumStatus } from '../../../../../assets/constant';
import VnrLoadingScreen from '../../../../../components/VnrLoading/VnrLoadingScreen';

export default class LoanList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            isLoading: true,
            stateProps: props,
            dataSource: [],
            totalRow: 0,
            //pageSize: 20,
            page: 1,
            isLoadingFooter: false,
            isPullToRefresh: false
        };
        this.endLoading = false;
        this.callOnEndReached = false;
        if (!Vnr_Function.CheckIsNullOrEmpty(this.props.api) &&
            !Vnr_Function.CheckIsNullOrEmpty(this.props.api.pageSize) &&
            typeof this.props.api.pageSize == 'number') {
            this.pageSize = this.props.api.pageSize;
        }
        else {
            this.pageSize = 20;
        }

        //biến để kiểm tra có check all server
        this.isCheckAllServer = false;
    }

    renderSeparator = () => {
        return (
            <View
                style={styles.separator}
            />
        );
    };

    reload = () => {
        this.setState({ isLoading: true });
        this.remoteData();
    }

    remoteData = () => {
        const { api } = this.state.stateProps;
        const { dataSource, page } = this.state;

        HttpService.Get(api.urlApi, null, this.reload)
            .then((res) => {
                try {
                    if (res?.Status !== EnumName.E_SUCCESS) {
                        this.setState({
                            dataSource: [],
                            totalRow: 0,
                            isLoading: false,
                            refreshing: false,
                            isLoadingFooter: false,
                            isPullToRefresh: !this.state.isPullToRefresh
                        }, () => {
                            setTimeout(() => {
                                this.endLoading = false;
                            }, 1000);
                        })
                        return;
                    }

                    let data = [], total = 0;
                    if (res && (res.data || res.Data)) {
                        if (res.data) {
                            data = Array.isArray(res.data) ? [...res.data] : [res.data];
                        }
                        else if (res.Data) {
                            data = Array.isArray(res.Data) ? [...res.Data] : [res.Data];
                        }
                    }

                    if (Object.prototype.hasOwnProperty.call(res, 'total')) {
                        total = res.total;
                    }
                    else if (Object.prototype.hasOwnProperty.call(res, 'Total')) {
                        total = res.Total;
                    }

                    data.map((item) => {
                        item.isSelect = false;
                    })

                    if (page == 1) {
                        this.setState({
                            dataSource: data,
                            totalRow: total,
                            isLoading: false,
                            refreshing: false,
                            isLoadingFooter: false,
                            isPullToRefresh: !this.state.isPullToRefresh
                        }, () => {
                            setTimeout(() => {
                                this.endLoading = false;
                            }, 1000);
                        })
                    }
                    else {
                        this.setState({
                            dataSource: [...dataSource, ...data],
                            totalRow: total,
                            isLoading: false,
                            refreshing: false,
                            isLoadingFooter: false,
                            isPullToRefresh: !this.state.isPullToRefresh
                        }, () => {
                            setTimeout(() => {
                                this.endLoading = false;
                            }, 1000);
                        })
                    }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            })
    }

    componentDidMount() {
        this.remoteData();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.isRefreshList !== nextProps.isRefreshList) {
            this.setState({
                dataSource: [],
                stateProps: nextProps,
                page: 1,
                isLoading: true
            }, () => this.remoteData());
        }
    }

    shouldComponentUpdate(nextProps, nextState) {

        return (
            nextProps.isRefreshList !== this.props.isRefreshList ||
            nextState.isLoading !== this.state.isLoading ||
            nextState.refreshing !== this.state.refreshing ||
            nextState.isAddItemChecked !== this.state.isAddItemChecked ||
            nextState.isLoadingFooter !== this.state.isLoadingFooter
        );
    }

    _handleRefresh = () => {
        this.setState({ refreshing: true, page: 1 }, this.remoteData);
    }

    _handleEndRefresh = () => {
        let { totalRow, page } = this.state;
        let PageTotal = Math.ceil(totalRow / this.pageSize);
        if (page < PageTotal) {
            this.setState({ page: page + 1, isLoadingFooter: true }, this.remoteData);
        }
        else {
            return null
        }
    }

    _renderLoading = () => {
        return (
            <View style={styles.wrapLoading}>
                <VnrLoading
                    size="large" isVisible={this.state.isLoadingFooter}
                />
            </View>
        );
    }


    render() {

        const {
                dataSource,
                isLoading,
                refreshing,
                isPullToRefresh,
                totalRow
            } = this.state,
            {
                api,
                rowActions
            } = this.props,
            valueField = !Vnr_Function.CheckIsNullOrEmpty(this.props.valueField)
                ? this.props.valueField
                : 'ID';


        let dataBody = api
            ? api.dataBody && this.isCheckAllServer
                ? api.dataBody
                : null
            : null;

        if (dataBody) {
            dataBody = {
                ...dataBody,
                pageSize: totalRow
            };
        }

        let contentList = <View />;
        if (isLoading) {
            let typeLoading = EnumStatus.E_SUBMIT;
            contentList = <VnrLoadingScreen size="large" screenName={null} isVisible={isLoading} type={typeLoading} />;
        } else if (dataSource == EnumName.E_EMPTYDATA || dataSource.length == 0 || !Array.isArray(rowActions) || rowActions.length === 0) {
            contentList = <EmptyData messageEmptyData={'EmptyData'} />;
        } else if (dataSource && dataSource.length > 0) {
            contentList = (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    disableScrollViewPanResponder={true} // fix bug khong the click onPess sau khi pulltoRefresh
                    data={dataSource}
                    extraData={this.state}
                    ListFooterComponent={this._renderLoading}
                    contentContainerStyle={{ marginTop: Size.defineSpace }}
                    // ItemSeparatorComponent={this.renderSeparator}
                    renderItem={
                        ({ item }) => (
                            <View
                                style={[styles.containBotton]}>
                                <View
                                    style={styles.styleViewBorderButtom}>
                                    <View style={CustomStyleSheet.flex(1)}>
                                        <ContractItem
                                            isPullToRefresh={isPullToRefresh}
                                            rowActions={rowActions}
                                            dataItem={item}
                                        />

                                    </View>
                                </View>
                            </View>
                        )
                    }
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
                            this.callOnEndReached = false
                            this._handleEndRefresh();
                        }
                    }}
                    onEndReached={() => {
                        this.callOnEndReached = true
                    }} // refresh khi scroll den cuoi
                    onEndReachedThreshold={0.1} // khoan cach tinh tu vi tri cuoi ds , se goi onEndReached
                />
            );
        }
        return (
            <View
                style={[styles.containerGrey]}>
                {contentList}
            </View>
        );
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
    },
    wrapLoading: { flex: 1, paddingVertical: styleSheets.p_10 },
    separator: {
        height: 0.5,
        width: 'auto',
        backgroundColor: Colors.grey,
        marginHorizontal: styleSheets.p_10
    }
});
