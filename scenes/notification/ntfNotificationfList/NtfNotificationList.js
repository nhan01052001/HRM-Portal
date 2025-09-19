import React from 'react';
import { View, FlatList, RefreshControl, StyleSheet, Keyboard } from 'react-native';
import { Colors, Size, styleSheets } from '../../../constants/styleConfig';
import VnrLoading from '../../../components/VnrLoading/VnrLoading';
import VnrIndeterminate from '../../../components/VnrLoading/VnrIndeterminate';
import VnrLoadingScreen from '../../../components/VnrLoading/VnrLoadingScreen';
import Vnr_Function from '../../../utils/Vnr_Function';
import BottomAction from './BottomAction';
import TopAction from './TopAction';
import EmptyData from '../../../components/EmptyData/EmptyData';
import DrawerServices from '../../../utils/DrawerServices';
import { EnumName, EnumStatus } from '../../../assets/constant';
import { getDataLocal } from '../../../factories/LocalData';
import NtfListNotificationItem from './NtfNotificationListItem';
import { dataVnrStorage } from '../../../assets/auth/authentication';

const heightActionBottom = 45;
const eTypeGroup = {
    E_TODAY: 'E_TODAY',
    E_YESTERDAY: 'E_YESTERDAY',
    E_BEFORE: 'E_BEFORE'
};
export default class NtfNotificationList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //valueField: "ID",
            itemSelected: [],
            refreshing: false, //biến hiển thị loading pull to refresh
            isLoading: true, // biến hiển thị loading dữ liệu cho danh sách
            isReloadList: true, // biến để check khi cập nhật trạng thái đã xem của item.
            // stateProps: { ...props },
            dataSource: [],
            dataIndexTitleGroup: [],
            dataGroup: {},
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
        this.languageApp = dataVnrStorage.currentUser.headers.languagecode;
    }

    renderSeparator = () => {
        return (
            <View
                style={styles.separator}
            />
        );
    };

    shouldComponentUpdate(nextProps, nextState) {
        return (
            nextProps.isRefreshList !== this.props.isRefreshList ||
            nextState.isLoading !== this.state.isLoading ||
            nextState.isReloadList !== this.state.isReloadList ||
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

    getAllIDNotify = () => {
        const { dataSource } = this.state
        if (Array.isArray(dataSource) && dataSource.length > 0 && dataSource !== EnumName.E_EMPTYDATA) {
            const combinedIDs = dataSource.reduce((accumulator, current) => {
                return accumulator.concat(current.lstID);
            }, []);
            return combinedIDs
        }
    }

    updateAllStatusSeen = () => {
        const { dataSource, dataGroup, refreshing } = this.state;

        const updatedDataSource = dataSource.map(item => ({
            ...item,
            Status: 'E_SEEN'
        }));

        const updatedDataGroup = dataGroup.map(group =>
            group.map(item => {
                if (!item.Status) {
                    return { ...item, Status: 'E_SEEN' };
                }
                return item;
            })
        );

        this.setState({
            dataSource: updatedDataSource,
            dataGroup: updatedDataGroup,
            refreshing: !refreshing
        }, () => {
            const { reloadScreenList } = this.props;
            if (reloadScreenList && typeof reloadScreenList === 'function') {
                reloadScreenList();
            }
        });
    };

    remoteData = (param = {}) => {
        const { isLazyLoading } = param,
            { keyDataLocal, keyQuery } = this.props;
        if (keyDataLocal) {
            getDataLocal(keyDataLocal)
                .then(resData => {
                    const res = resData && resData[keyQuery] ? resData[keyQuery] : null;
                    if (res && res !== EnumName.E_EMPTYDATA) {
                        let data = res;
                        // if (page == 1) {
                        let listDataGroupHandle = {};
                        let checkGroupCurrent = '';
                        let checkTotalGroupRecord = 0;
                        // let countIsNotSeen = 0;

                        data.map((item) => {
                            // if (item.Status !== 'E_SEEN') {
                            //     countIsNotSeen += 1;
                            // }

                            if (item.type && item.type == 'E_GROUP') {
                                listDataGroupHandle[item.title] = [];
                                checkGroupCurrent = item.title;
                                checkTotalGroupRecord = item.totalRecord;
                            } else {
                                const getGroupCurrent = checkGroupCurrent;
                                listDataGroupHandle[getGroupCurrent] &&
                                    Array.isArray(listDataGroupHandle[getGroupCurrent]) &&
                                    listDataGroupHandle[getGroupCurrent].push({
                                        ...item,
                                        titeGroup: getGroupCurrent,
                                        totalGroupRecord: checkTotalGroupRecord
                                    });
                            }
                        });

                        // console.log(data, 'data')
                        // cập nhật con số th4ng báo
                        // không cần set lại
                        // countIsNotSeen >= 0 &&
                        //     store.dispatch(badgesNotification.actions.setNumberBadgesNotify(countIsNotSeen));

                        this.setState({
                            dataGroup:
                                Object.keys(listDataGroupHandle).length > 0
                                    ? Object.values(listDataGroupHandle)
                                    : [data],
                            dataSource: data,
                            isLoading: false,
                            refreshing: false,
                            isLoadingHeader: isLazyLoading ? false : true,
                            isLoadingFooter: false,
                            isOpenAction: false,
                            isPullToRefresh: !this.state.isPullToRefresh
                        });
                        // } else {
                        //     this.setState(
                        //         {
                        //             dataSource: [...dataSource, ...data],
                        //             totalRow: total,
                        //             isLoading: false,
                        //             refreshing: false,
                        //             isLoadingHeader: isLazyLoading ? false : true,
                        //             isLoadingFooter: false,
                        //             isOpenAction: false,
                        //             isPullToRefresh: !this.state.isPullToRefresh,
                        //         },
                        //         () => {
                        //             setTimeout(() => {
                        //                 this.endLoading = false;
                        //             }, 1000);
                        //         },
                        //     );
                        // }
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
                style={styles.footerLoading}
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

    addItemChecked = indexItem => {
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

    checkedAll = isDisable => {
        const { dataSource, isAddItemChecked } = this.state;
        dataSource.map(item => {
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

    unCheckedAll = isDisable => {
        const { dataSource, isAddItemChecked } = this.state;
        dataSource.map(item => {
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

    addItemCheckedWidthOpenAction = indexItem => {
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

    openAction = index => {
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
        dataSource.map(item => {
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

    deleteItems = ({ typeGroup = null, item = null }) => {
        const { dataGroup } = this.state,
            { rowActions } = this.props,
            firstActions = rowActions[0] ? rowActions[0] : null;
        try {
            if (firstActions && firstActions.type == EnumName.E_DELETE && typeof firstActions.onPress === 'function') {
                if (typeGroup && dataGroup[typeGroup] && dataGroup[typeGroup].length > 1) {
                    // Xoá theo group
                    const itemGroup = dataGroup[typeGroup].slice(1, dataGroup[typeGroup].length);
                    let meaasge = '';

                    if (typeGroup == eTypeGroup.E_TODAY) {
                        meaasge = 'HRM_Notification_Confirm_Delete_Today';
                    } else if (typeGroup === eTypeGroup.E_YESTERDAY) {
                        meaasge = 'HRM_Notification_Confirm_Delete_Yesterday';
                    } else if (typeGroup == eTypeGroup.E_BEFORE) {
                        meaasge = 'HRM_Notification_Confirm_Delete_Before';
                    }

                    firstActions.onPress(itemGroup, meaasge);
                } else if (item) {
                    // Xoá từng Item
                    firstActions.onPress([item], 'HRM_Notification_Confirm_Delete_Item');
                }
            }
        } catch (error) {
            //
        }

        // console.log(rowActions, 'rowActions')
    };

    callBackUpdated = id => {
        const { dataSource, isReloadList } = this.state;
        const indexItem = dataSource.findIndex(e => e.ID === id);
        if (indexItem > -1) {
            dataSource[indexItem]['Status'] = 'E_SEEN';
            this.setState({
                dataSource,
                isReloadList: !isReloadList
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
                dataGroup
            } = this.state,
            { api, detail, rowActions, selected, listConfigModule } = this.props;

        let dataBody = api ? (api.dataBody && this.isCheckAllServer ? api.dataBody : null) : null;

        if (dataBody) {
            dataBody = {
                ...dataBody,
                pageSize: totalRow
            };
        }

        let contentList = <View />;
        if (isLoading) {
            let typeLoading = EnumStatus.E_SUBMIT;
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
                    //stickyHeaderIndices={dataIndexTitleGroup}
                    showsVerticalScrollIndicator={false}
                    disableScrollViewPanResponder={true} // fix bug khong the click onPess sau khi pulltoRefresh
                    data={dataGroup}
                    extraData={this.state}
                    ListFooterComponent={this._renderFooterLoading}
                    ListHeaderComponent={this._renderHeaderLoading}
                    renderItem={({ item, index }) => (
                        <NtfListNotificationItem
                            listConfigModule={listConfigModule}
                            currentDetail={detail}
                            onClick={() => {
                                isOpenAction == true ? this.addItemChecked(index) : null;
                            }}
                            isDisable={isDisableSelectItem}
                            numberDataSoure={dataGroup.length}
                            index={index}
                            isPullToRefresh={isPullToRefresh}
                            dataGroupItem={item}
                            toggleAction={this.toggleAction}
                            handerOpenSwipeOut={this.handerOpenSwipeOut}
                            listItemOpenSwipeOut={this.listItemOpenSwipeOut}
                            rowActions={!Vnr_Function.CheckIsNullOrEmpty(rowActions) ? rowActions : null}
                        />
                    )}
                    keyExtractor={(item, index) => index}
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
    containerGrey: {
        flex: 1,
        backgroundColor: Colors.white
    },
    separator: {
        height: 0.5,
        width: 'auto',
        backgroundColor: Colors.grey,
        marginHorizontal: styleSheets.p_10
    },
    footerLoading: {
        color: Colors.gray_10,
        fontWeight: '500',
        fontSize: Size.text - 1
    }
});
