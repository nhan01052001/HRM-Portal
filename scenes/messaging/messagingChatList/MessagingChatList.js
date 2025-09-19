import React from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';
import { Colors, Size, styleSheets } from '../../../constants/styleConfig';
import VnrLoading from '../../../components/VnrLoading/VnrLoading';
import Vnr_Function from '../../../utils/Vnr_Function';
import EmptyData from '../../../components/EmptyData/EmptyData';
import HttpService from '../../../utils/HttpService';
import DrawerServices from '../../../utils/DrawerServices';
import moment from 'moment';
import RenderItem from './RenderItem';
import { ScreenName, EnumName } from '../../../assets/constant';
import VnrText from '../../../components/VnrText/VnrText';
import { IconDown } from '../../../constants/Icons';
import { dataVnrStorage } from '../../../assets/auth/authentication';

export default class MessagingChatList extends React.Component {
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
            messageEmptyData: 'HRM_Empty_Content_Messaging',
            marginTopNumber: 0,
            isDisableSelectItem: null,
            isPullToRefresh: false
        };
        this.endLoading = false;
        this.callOnEndReached = false;
        this.oldIndexOpenSwipeOut = null;
        this.listItemOpenSwipeOut = [];
        this.refScrollChat = null;
        this.chatEndpointApi = dataVnrStorage.apiConfig.chatEndpointApi;
        this.checkDateIsShow = {};
        if (
            !Vnr_Function.CheckIsNullOrEmpty(this.props.api) &&
            !Vnr_Function.CheckIsNullOrEmpty(this.props.api.pageSize) &&
            typeof this.props.api.pageSize == 'number'
        ) {
            this.pageSize = this.props.api.pageSize;
        } else {
            this.pageSize = 10;
        }

        //biến để kiểm tra có check all server
        this.isCheckAllServer = false;

        this.checkTimeShowIsYou = {};
        this.checkTimeShowIsFriend = {};
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 0.5,
                    width: 'auto',
                    backgroundColor: Colors.grey,
                    marginHorizontal: styleSheets.p_10
                    //marginVertical : 2
                }}
            />
        );
    };

    remoteData = nextProps => {
        debugger;
        // console.log(nextProps, 'nextProps')
        let { dataLocal, dataRecord } = nextProps ? nextProps : this.props;

        // if (isShowMore) {
        //     console.log(dataLocal);
        //     const dataHandel = [];
        //                 console.log(page, 'page')
        //                 this.checkTimeShowIsYou = {};
        //                 this.checkTimeShowIsFriend = {};
        //                 res.Data.forEach(item => {
        //                     let dateChat = moment(item.TimeChat).format('DD/MM/YYYY');
        //                     //item.Status = EnumName.E_DONE;
        //                     if (this.checkDateIsShow[dateChat]) {
        //                         //item.Type = 'E_CHAT';
        //                         dataHandel.push(item)
        //                     }
        //                     else {
        //                         this.checkDateIsShow[dateChat] = true;
        //                         dataHandel.push({
        //                             ID: dateChat,
        //                             TimeChat: item.TimeChat,
        //                             TopicID: item.TopicID,
        //                             Type: EnumName.E_DATE,
        //                             UserID: item.UserID,
        //                         });
        //                         //item.Type = 'E_CHAT';
        //                         dataHandel.push(item)
        //                     }
        //                 });
        // }
        //else
        if (!Vnr_Function.CheckIsNullOrEmpty(dataLocal)) {
            // console.log(dataLocal[0].Status, 'Status')
            // if (page == 1) {
            const dataReverse = [...dataLocal].reverse(),
                dataHandel = [];
            debugger;
            // console.log(page, 'page')
            // this.checkTimeShowIsYou = {};
            // this.checkTimeShowIsFriend = {};
            this.checkDateIsShow = {};
            dataReverse.forEach(item => {
                let dateChat = moment(item.TimeChat).format('DD/MM/YYYY');
                if (this.checkDateIsShow[dateChat]) {
                    //item.Type = 'E_CHAT';
                    dataHandel.push({ ...item });
                } else {
                    this.checkDateIsShow[dateChat] = true;
                    dataHandel.push({
                        ID: dateChat,
                        TimeChat: item.TimeChat,
                        TopicID: item.TopicID,
                        Type: EnumName.E_DATE,
                        UserID: item.UserID
                    });
                    //item.Type = 'E_CHAT';
                    dataHandel.push({ ...item });
                }
            });

            this.setState(
                {
                    dataSource: dataHandel.reverse(),
                    totalRow: dataRecord.ListMessage.Total,
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
    };

    componentDidMount() {
        this.remoteData();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            nextProps.isRefreshListChat !== this.props.isRefreshListChat ||
            nextProps.isShowMoreListChat !== this.props.isShowMoreListChat ||
            this.state.isPullToRefresh !== nextState.isPullToRefresh ||
            this.state.footerLoading !== nextState.footerLoading
        );
    }

    componentWillReceiveProps(nextProps) {
        // this.remoteData()
        if (nextProps.isRefreshListChat !== this.props.isRefreshListChat) {
            //console.log(nextProps.dataLocal);
            // this.setState({
            //     stateProps: nextProps,
            //     //isPullToRefresh: !this.state.isPullToRefresh
            // }, () =>
            this.remoteData(nextProps);
            //  );
        }
        // else if (nextProps.isShowMoreListChat !== this.props.isShowMoreListChat) {
        //     this.remoteData(nextProps)
        // }
    }

    _handleRefresh = () => {
        !this.state.isOpenAction && this.setState({ refreshing: true, page: 1 }, this.remoteData);
    };

    _handleEndRefresh = () => {
        debugger;
        const { showMoreChat } = this.props;
        if (this.state.isOpenAction || this.pageSize == 0) {
            return false;
        }

        let { totalRow, page } = this.state;
        let PageTotal = Math.ceil(totalRow / this.pageSize);
        if (page < PageTotal) {
            this.setState({ page: page + 1, footerLoading: true }, () => {
                showMoreChat(this.state.page, this.pageSize);
            });
        } else {
            return null;
        }
    };

    _renderLoading = () => {
        return (
            <View style={{ flex: 1, paddingVertical: styleSheets.p_10, marginTop: 30 }}>
                <VnrLoading size="large" isVisible={this.state.footerLoading} />
            </View>
        );
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
        const {
                dataSource,
                isLoading,
                refreshing,
                isPullToRefresh,
                isOpenAction,
                isDisableSelectItem,
                itemSelected,
                totalRow,
                messageEmptyData,
                marginTopNumber
            } = this.state,
            { sendMessaging, isChatGroup, renderConfig, dataRecord, rowActions, detail } = this.props,
            { screenName, screenDetail } = detail;

        const valueField = !Vnr_Function.CheckIsNullOrEmpty(this.props.valueField) ? this.props.valueField : 'ID';

        return (
            <View style={[styleSheets.containerGrey, { backgroundColor: Colors.gray_3 }]}>
                {isLoading ? (
                    <VnrLoading size="large" isVisible={isLoading} />
                ) : dataSource.length == 0 && !isLoading ? (
                    <EmptyData messageEmptyData={messageEmptyData} />
                ) : (
                    <FlatList
                        onStartShouldSetResponder={() => console.log('onStartShouldSetResponder')}
                        inverted // Đảo ngược danh sách
                        ref={r => {
                            this.refScrollChat = r;
                        }}
                        showsVerticalScrollIndicator={false}
                        disableScrollViewPanResponder={true} // fix bug khong the click onPess sau khi pulltoRefresh
                        data={dataSource}
                        extraData={this.state}
                        contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
                        renderItem={({ item, index }) => (
                            <View style={[{ flex: 1 }]}>
                                <RenderItem
                                    key={item.ID}
                                    sendMessaging={sendMessaging}
                                    checkTimeShowIsYou={this.checkTimeShowIsYou}
                                    checkTimeShowIsFriend={this.checkTimeShowIsFriend}
                                    isChatGroup={isChatGroup}
                                    //={dataSource.length}
                                    //isPullToRefresh={isPullToRefresh}
                                    //isOpenAction={isOpenAction}
                                    //isSelect={item.isSelect}
                                    index={index}
                                    renderRowConfig={renderConfig}
                                    dataItem={item}
                                    dataRecord={dataRecord}
                                    //addItem={this.addItemChecked}
                                    //toggleAction={this.toggleAction}
                                    // handerOpenSwipeOut={this.handerOpenSwipeOut}
                                    //listItemOpenSwipeOut={this.listItemOpenSwipeOut}
                                    // rowActions={
                                    //     (!Vnr_Function.CheckIsNullOrEmpty(rowActions)) ?
                                    //         rowActions : null}
                                />

                                {/* </View> */}
                                {/* </TouchableWithoutFeedback> */}
                            </View>
                        )}
                        keyExtractor={item => item[valueField]}
                        ListFooterComponent={this._renderLoading}
                        // refreshControl={
                        //     <RefreshControl
                        //         onRefresh={() => this._handleRefresh()}
                        //         refreshing={refreshing}
                        //         size="large"
                        //         tintColor={Colors.primary}
                        //     />
                        // }
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
                        onEndReachedThreshold={0.5} // khoan cach tinh tu vi tri cuoi ds , se goi onEndReached
                    />
                )}
            </View>
        );
    }
}
