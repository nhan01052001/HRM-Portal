import React from 'react';
import { View, FlatList, TouchableWithoutFeedback } from 'react-native';
import VnrLoading from '../../../components/VnrLoading/VnrLoading';
import Vnr_Function from '../../../utils/Vnr_Function';
import EmptyData from '../../../components/EmptyData/EmptyData';
import HttpService from '../../../utils/HttpService';
import DrawerServices from '../../../utils/DrawerServices';
import RenderChatListUserInGroup from './RenderChatListUserInGroup';

export default class MessagingListMemberGroup extends React.Component {
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
        const { api, dataLocal } = this.props,
            { dataSource, page } = this.state;

        if (!Vnr_Function.CheckIsNullOrEmpty(dataLocal)) {
            let data = [...dataLocal],
                total = 0;
            data.map(item => {
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
            api.dataBody = Object.assign(api.dataBody, {
                pageSize: this.pageSize,
                page: page
            });
            HttpService.Post(api.urlApi, api.dataBody)
                .then(res => {
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
                .catch(error => {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    // ToasterSevice.showError("HRM_Common_SendRequest_Error", 4000);
                    // this.setState({ isLoading: false, messageEmptyData: 'HRM_Common_SendRequest_Error' });
                });
        }
    };

    componentDidMount() {
        this.remoteData();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            nextProps.isRefreshList !== this.props.isRefreshList ||
            this.state.isPullToRefresh !== nextState.isPullToRefresh
        );
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

    moveToDetail = (item, index) => {
        const { detail, rowTouch, reloadScreenList } = this.props;
        if (!Vnr_Function.CheckIsNullOrEmpty(rowTouch) && typeof rowTouch == 'function') {
            rowTouch(item, index);
        } else if (
            !Vnr_Function.CheckIsNullOrEmpty(detail) &&
            !Vnr_Function.CheckIsNullOrEmpty(detail.screenDetail) &&
            !Vnr_Function.CheckIsNullOrEmpty(detail.screenName)
        ) {
            DrawerServices.navigate(detail.screenDetail, {
                dataItem: item,
                screenName: detail.screenName,
                reloadScreenList: reloadScreenList
            });
        }
    };

    render() {
        const {
                dataSource,
                isLoading,
                isPullToRefresh,
                isOpenAction,
                isDisableSelectItem,
                messageEmptyData,
                isVisibleModal
            } = this.state,
            stateProps = this.props,
            { screenName, screenDetail } = stateProps.detail;

        const valueField = !Vnr_Function.CheckIsNullOrEmpty(stateProps.valueField) ? stateProps.valueField : 'ID';

        return (
            <View style={{ flex: 1 }}>
                {isLoading ? (
                    <VnrLoading size="large" isVisible={isLoading} />
                ) : dataSource.length == 0 && !isLoading ? (
                    <EmptyData messageEmptyData={messageEmptyData} />
                ) : (
                    <FlatList
                        inverted={stateProps.inverted ? stateProps.inverted : false} // Đảo ngược danh sách
                        showsVerticalScrollIndicator={false}
                        disableScrollViewPanResponder={true} // fix bug khong the click onPess sau khi pulltoRefresh
                        data={dataSource}
                        extraData={this.state}
                        renderItem={({ item, index }) => (
                            <View style={[{ flex: 1, flexDirection: 'row' }]}>
                                <TouchableWithoutFeedback
                                    onPress={() => this.moveToDetail(item, index)}
                                    onPressIn={() => {
                                        this.handerOpenSwipeOut(index);
                                    }}
                                >
                                    <View style={{ flex: 1 }}>
                                        <RenderChatListUserInGroup
                                            currentDetail={stateProps.detail}
                                            onClick={() => {
                                                isOpenAction == true ? this.addItemChecked(index) : null;
                                            }}
                                            showModalAction={this.showModalAction}
                                            isDisable={isDisableSelectItem}
                                            numberDataSoure={dataSource.length}
                                            isPullToRefresh={isPullToRefresh}
                                            isOpenAction={isOpenAction}
                                            isSelect={item.isSelect}
                                            index={index}
                                            renderRowConfig={stateProps.renderConfig}
                                            dataItem={item}
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
                        keyExtractor={item => item[valueField]}
                    />
                )}
            </View>
        );
    }
}
