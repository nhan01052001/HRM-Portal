import React from 'react';
import {
    View,
    TouchableOpacity,
    FlatList,
    RefreshControl,
    TouchableWithoutFeedback,
    Text,
    Keyboard,
    StyleSheet
} from 'react-native';
import { Colors, Size, styleSheets } from '../../../constants/styleConfig';
import VnrLoading from '../../../components/VnrLoading/VnrLoading';
import Vnr_Function from '../../../utils/Vnr_Function';
import EmptyData from '../../../components/EmptyData/EmptyData';
import HttpService from '../../../utils/HttpService';
import DrawerServices from '../../../utils/DrawerServices';
import RenderItemChatFriend from './RenderItemChatFriend';
import RenderItemChatGroup from './RenderItemChatGroup';
import RenderItemChatFriendFilter from './RenderItemChatFriendFilter';
import { ScreenName } from '../../../assets/constant';
import VnrText from '../../../components/VnrText/VnrText';
import { IconDown, IconUp, IconGroupUser } from '../../../constants/Icons';
import { translate } from '../../../i18n/translate';

export default class MessagingList extends React.Component {
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
            this.pageSize = 4;
        }

        //biến để kiểm tra có check all server
        this.isCheckAllServer = false;
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

    remoteData = () => {
        const { api, dataLocal, detail } = this.props,
            { dataSource, page } = this.state;

        if (dataLocal && dataLocal.Data && Array.isArray(dataLocal.Data)) {
            let data = [...dataLocal.Data],
                total = dataLocal.Total;
            this.setState({
                dataSource: data,
                totalRow: total,
                isLoading: false,
                refreshing: false,
                footerLoading: false,
                isPullToRefresh: !this.state.isPullToRefresh
            });
            return true;
        }
    };

    componentDidMount() {
        this.remoteData();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            nextProps.isRefreshList !== this.props.isRefreshList ||
            this.state.isPullToRefresh !== nextState.isPullToRefresh ||
            this.state.footerLoading !== nextState.footerLoading
        );
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.isRefreshList !== nextProps.isRefreshList) {
            this.setState(
                {
                    dataSource: [],
                    itemSelected: [],
                    stateProps: nextProps,
                    isOpenAction: false,
                    isLoading: true,
                    footerLoading: true
                },
                () => this.remoteData()
            );
        }

        if (this.props.isPullToRefresh !== nextProps.isPullToRefresh) {
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
        const { showMore } = this.props;
        if (this.state.isOpenAction || this.pageSize == 0) {
            return false;
        }

        let { totalRow, page } = this.state;
        let PageTotal = Math.ceil(totalRow / this.pageSize);
        if (page < PageTotal) {
            console.log(page + 1);
            this.setState({ page: page + 1, footerLoading: true }, () => {
                showMore && typeof showMore == 'function' && showMore(page + 1, this.pageSize);
            });
        } else {
            return null;
        }
    };

    _handelEndLessData = () => {
        const { showLess } = this.props;
        this.setState({ page: 1 }, () => {
            showLess && typeof showLess == 'function' && showLess(this.pageSize);
        });
    };

    _renderLoading = () => {
        return (
            <View style={{ flex: 1, paddingVertical: styleSheets.p_10 }}>
                <VnrLoading size="large" isVisible={this.state.footerLoading} />
            </View>
        );
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
        const { detail, rowTouch, reloadScreenList, updateLastMess, getListTopic, dataAgent, dataStatus } = this.props;

        if (!Vnr_Function.CheckIsNullOrEmpty(rowTouch) && typeof rowTouch == 'function') {
            rowTouch(item, index);
        } else if (
            !Vnr_Function.CheckIsNullOrEmpty(detail) &&
            !Vnr_Function.CheckIsNullOrEmpty(detail.screenDetail) &&
            !Vnr_Function.CheckIsNullOrEmpty(detail.screenName)
        ) {
            const _listActions = this.handelListActionParamsScreenDetail(item);
            DrawerServices.navigate(detail.screenDetail, {
                dataItem: item,
                screenName: detail.screenName,
                updateLastMess: updateLastMess,
                dataAgent: dataAgent,
                dataStatus: dataStatus,
                getListTopic: getListTopic,
                listActions: _listActions,
                reloadScreenList: reloadScreenList
            });
        }
    };

    router = roouterName => {
        DrawerServices.navigate(roouterName, {
            setStateValidApi: this.setStateValidApi
        });
    };

    renderItemFromScreenName = dataProps => {
        const stateProps = this.props,
            { screenName } = stateProps.detail;
        switch (screenName) {
            case ScreenName.ChatFriend:
                return <RenderItemChatFriend {...dataProps} />;
            case ScreenName.ChatGroup:
                return <RenderItemChatGroup {...dataProps} />;
            case ScreenName.MessagingFilter:
                return <RenderItemChatFriendFilter {...dataProps} />;
            default:
                break;
        }
    };

    renderHeaderList = () => {
        const stateProps = this.props,
            { screenName, screenDetail } = stateProps.detail;
        let titleList = '',
            styleText = null;
        switch (screenName) {
            case ScreenName.ChatFriend:
                titleList = 'HRM_Chat_Recently';
                styleText = [styleSheets.lable, styles.styTitle];
                break;
            case ScreenName.ChatGroup:
                titleList = 'TeamName';
                styleText = [styleSheets.lable, styles.styTitle];
                break;
            default:
                break;
        }
        return (
            <View style={styles.styViewTitle}>
                <VnrText i18nKey={titleList} style={styleText} />
            </View>
        );
    };

    ListFooterComponent = () => {
        const { dataSource, totalRow, footerLoading, page } = this.state;
        if (footerLoading) {
            return (
                <View style={{ flex: 1, paddingVertical: styleSheets.p_10 }}>
                    <VnrLoading size="small" />
                </View>
            );
        } else if (dataSource.length == totalRow && page > 1) {
            return (
                <TouchableOpacity style={styles.styBntColspan} onPress={this._handelEndLessData}>
                    <IconUp size={Size.iconSize} color={Colors.gray_10} />
                    <VnrText
                        i18nKey={'HRM_Common_Showless'}
                        style={[styleSheets.textFontMedium, styles.styBnt__text]}
                    />
                </TouchableOpacity>
            );
        } else if (dataSource.length < totalRow) {
            return (
                <TouchableOpacity style={styles.styBntMore} onPress={this._handleEndRefresh}>
                    <IconDown size={Size.iconSize} color={Colors.gray_10} />
                    <VnrText
                        i18nKey={'HRM_Common_Showmore'}
                        style={[styleSheets.textFontMedium, styles.styBnt__text]}
                    />
                </TouchableOpacity>
            );
        } else {
            return <View />;
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
            stateProps = this.props,
            { screenName, screenDetail } = stateProps.detail;

        const valueField = !Vnr_Function.CheckIsNullOrEmpty(stateProps.valueField) ? stateProps.valueField : 'ID';
        let contentList = <View />;
        if (isLoading) {
            contentList = <VnrLoading size="large" isVisible={isLoading} />;
        } else if (dataSource.length == 0 && !isLoading) {
            if (screenName == ScreenName.ChatGroup) {
                contentList = (
                    <View style={styles.viewButtonAddGroup}>
                        <TouchableOpacity
                            style={styles.viewButtonAddGroup_bnt}
                            onPress={() => this.router('CreateGroup')}
                        >
                            <IconGroupUser size={Size.iconSize} color={Colors.gray_10} />
                            <VnrText
                                i18nKey={'HRM_Chat_Create_Group'}
                                style={[styleSheets.textFontMedium, styles.viewButtonAddGroup_bnt_text]}
                            />
                        </TouchableOpacity>
                    </View>
                );
            } else {
                contentList = (
                    <View style={styles.styViewEmpty}>
                        <View style={styles.styViewTitle}>
                            <VnrText i18nKey={'HRM_Chat_Recently'} style={[styleSheets.text, styles.styTitleFilter]} />
                        </View>
                        <EmptyData messageEmptyData={'EmptyData'} />
                    </View>
                );
            }
        } else if (dataSource && dataSource.length > 0) {
            contentList = (
                <FlatList
                    inverted={stateProps.inverted ? stateProps.inverted : false} // Đảo ngược danh sách
                    ListHeaderComponent={this.renderHeaderList()}
                    showsVerticalScrollIndicator={false}
                    disableScrollViewPanResponder={true} // fix bug khong the click onPess sau khi pulltoRefresh
                    data={dataSource}
                    extraData={this.state}
                    ListFooterComponent={this.ListFooterComponent}
                    style={{ paddingTop: 10 }}
                    renderItem={({ item, index }) => (
                        <View style={[{ flex: 1, flexDirection: 'row' }]}>
                            <TouchableWithoutFeedback
                                onPress={() => this.moveToDetail(item, index)}
                                onPressIn={() => {
                                    this.handerOpenSwipeOut(index);
                                }}
                            >
                                <View style={{ flex: 1 }}>
                                    {this.renderItemFromScreenName({
                                        numberDataSoure: dataSource.length,
                                        isPullToRefresh: isPullToRefresh,
                                        isOpenAction: isOpenAction,
                                        isSelect: item.isSelect,
                                        index: index,
                                        renderRowConfig: stateProps.renderConfig,
                                        dataItem: item,
                                        addItem: this.addItemChecked,
                                        toggleAction: this.toggleAction,
                                        handerOpenSwipeOut: this.handerOpenSwipeOut,
                                        listItemOpenSwipeOut: this.listItemOpenSwipeOut,
                                        rowActions: !Vnr_Function.CheckIsNullOrEmpty(stateProps.rowActions)
                                            ? stateProps.rowActions
                                            : null
                                    })}
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
            );
        }

        return <View style={{ flex: 1 }}>{contentList}</View>;
    }
}

const styles = StyleSheet.create({
    viewButtonAddGroup: {
        height: Size.deviceWidth >= 1024 ? 54 : 44,
        width: '100%',
        alignItems: 'center',
        marginVertical: 12
    },
    viewButtonAddGroup_bnt: {
        flexDirection: 'row',
        height: '100%',
        width: Size.deviceWidth * 0.4,
        borderRadius: 8,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: Colors.gray_5
    },
    viewButtonAddGroup_bnt_text: {
        fontWeight: '500',
        marginLeft: 5
    },
    contentFilter: {
        flex: 1
    },
    styViewEmpty: {
        paddingVertical: Size.defineSpace
    },
    styViewTitle: {
        flex: 1,
        marginBottom: 10,
        marginLeft: 16
    },
    styTitle: {
        color: Colors.gray_7,
        textTransform: 'uppercase',
        fontSize: Size.text + 3
    },
    styBntColspan: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary_1,
        height: 42,
        marginHorizontal: 16,
        borderRadius: 28
    },
    styBntMore: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 42,
        marginHorizontal: 16,
        borderRadius: 28
    },
    styBnt__text: {
        color: Colors.gray_10,
        marginLeft: 5
    }
});
