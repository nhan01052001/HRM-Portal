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
    ScrollView
} from 'react-native';
import { IconCheck, IconCancel } from '../../../../../constants/Icons';
import { Colors, CustomStyleSheet, Size, styleSheets, stylesScreenDetailV3 } from '../../../../../constants/styleConfig';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import VnrIndeterminate from '../../../../../components/VnrLoading/VnrIndeterminate';
import VnrLoadingScreen from '../../../../../components/VnrLoading/VnrLoadingScreen';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import BottomAction from '../../../../../componentsV3/BottomAction/BottomAction';
import { translate } from '../../../../../i18n/translate';
import { VnrBtnCreate } from '../../../../../componentsV3/VnrBtnCreate/VnrBtnCreate';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import DrawerServices from '../../../../../utils/DrawerServices';
import { EnumName, EnumStatus, ScreenName } from '../../../../../assets/constant';
import { getDataLocal } from '../../../../../factories/LocalData';
import AttTakeBusinessTripListItemApprove from './AttTakeBusinessTripListItemApprove';
import AttTakeBusinessTripListItem from './AttTakeBusinessTripListItem';
import { ConfigListFilter } from '../../../../../assets/configProject/ConfigListFilter';
import Vnr_Services from '../../../../../utils/Vnr_Services';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
const heightActionBottom = 45;
export default class AttTakeBusinessTripList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //valueField: "ID",
            itemSelected: [],
            refreshing: false, //biến hiển thị loading pull to refresh
            isLoading: true, // biến hiển thị loading dữ liệu cho danh sách
            // stateProps: { ...props },
            dataSource: [],
            dataNoGroup: [],
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

            isCheckAll: false
        };
        this.endLoading = false;
        this.callOnEndReached = false;
        this.oldIndexOpenSwipeOut = null;
        this.listItemOpenSwipeOut = [];
        this.isHaveFilter = props.detail && props.detail.screenName && ConfigListFilter.value[props.detail.screenName];

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

        this.scrollDirection = '';
        this.lastOffsetY = 0;
        this.refFlatList = null;
        this.stateEndScroll = true;
    }

    renderSeparator = () => {
        return <View style={styleSheet.styRenderSeparator} />;
    };

    shouldComponentUpdate(nextProps, nextState) {
        return (
            nextProps.isRefreshList !== this.props.isRefreshList ||
            nextState.isLoading !== this.state.isLoading ||
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
        const { page } = this.state,
            { isLazyLoading } = param,
            { keyDataLocal, keyQuery, detail, groupField, isRefreshList } = this.props;
        if (keyDataLocal) {
            getDataLocal(keyDataLocal)
                .then((resData) => {
                    const res = resData && resData[keyQuery] ? resData[keyQuery] : null;
                    if (res && res !== EnumName.E_EMPTYDATA) {
                        let data = [],
                            dataNoGroup = [],
                            total = 1;

                        if (res && (res.Data || res.data)) {
                            if (res.data) {
                                data = [...res.data];
                            } else if (res.Data) {
                                data = [...res.Data];
                            }
                        } else if (res && Array.isArray(res)) {
                            data = [...res];
                        }
                        if (detail?.screenName === ScreenName.AttApproveTakeBusinessTrip) {
                            data.map((item) => {
                                item.isSelect = false;
                                item.BusinessAllowAction = Vnr_Services.handleStatusApprove(
                                    item.Status,
                                    item?.TypeApprove
                                );
                                item.itemStatus = Vnr_Services.formatStyleStatusApp(item.Status);
                                item.lstFileAttach = ManageFileSevice.setFileAttachApp(item.FileAttachment);
                            });
                        } else if (detail?.screenName == ScreenName.AttApprovedTakeBusinessTrip) {
                            data.map((item) => {
                                item.isSelect = false;
                                item.BusinessAllowAction = Vnr_Services.handleStatus(
                                    item.Status,
                                    item?.SendEmailStatus ? item?.SendEmailStatus : false
                                );
                                item.itemStatus = Vnr_Services.formatStyleStatusApp(item.Status);
                                item.lstFileAttach = ManageFileSevice.setFileAttachApp(item.FileAttachment);
                            });
                        } else {
                            data.map((item) => {
                                item.isSelect = false;
                                item.BusinessAllowAction = Vnr_Services.handleStatus(
                                    item.Status,
                                    item?.SendEmailStatus ? item?.SendEmailStatus : false
                                );
                                item.itemStatus = Vnr_Services.formatStyleStatusApp(item.Status);
                                item.lstFileAttach = ManageFileSevice.setFileAttachApp(item.FileAttachment);
                            });
                        }

                        if (page === 1) {
                            dataNoGroup = [...data];
                        }

                        if (groupField && Array.isArray(groupField) && groupField.length > 0) {
                            if (page !== 1) {
                                dataNoGroup = [...this.state.dataNoGroup, ...data];
                                data = Vnr_Services.applyGroupField(dataNoGroup, groupField);

                                if (data && Array.isArray(data) && this.state.itemSelected.length > 0) {
                                    data.forEach((element) => {
                                        let rs = null;
                                        if (element?.dataGroupMaster && Array.isArray(element.dataGroupMaster)) {
                                            rs = element.dataGroupMaster.find((value) => value.isSelect === false);
                                        }

                                        element.isCheckAll = rs ? false : true;
                                    });
                                }
                            } else {
                                data = Vnr_Services.applyGroupField(data, groupField);
                            }
                            // if (keyQuery && keyQuery === EnumName.E_PAGING) {
                            //     data = [...dataSource, ...data];
                            // }
                        } else if (page !== 1) {
                            data = [...this.state.dataNoGroup, ...data];
                            dataNoGroup = data;
                        }

                        if (data.length > 0 && data.total) {
                            total = data.total;
                        } else if (data.length > 0 && data.Total) {
                            total = data.Total;
                        } else if (data.length > 0 && data[0].TotalRow) {
                            total = data[0].TotalRow;
                        } else if (data.length > 0 && data[0].TotalRow) {
                            total = data[0].TotalRow;
                        }

                        this.setState(
                            {
                                isCheckAll: false,
                                itemSelected:
                                    keyQuery && keyQuery === 'E_FILTER' && isRefreshList
                                        ? []
                                        : this.state.itemSelected.length > 0
                                            ? this.state.itemSelected
                                            : [],
                                dataSource: data,
                                dataNoGroup: dataNoGroup,
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
                    } else if (res === EnumName.E_EMPTYDATA) {
                        this.setState({
                            itemSelected: [],
                            dataNoGroup: [],
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
        this.setState({ isLoading: true, page: 1, itemSelected: [] });
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
            this.setState({ refreshing: true, page: 1, itemSelected: [] }, () => {
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
            <View style={styleSheet.styFooterLoading}>
                <VnrLoading size="large" isVisible={this.state.isLoadingFooter} />
            </View>
        );
    };

    _renderHeaderLoading = () => {
        return (
            <View style={{ width: Size.deviceWidth }}>
                <VnrIndeterminate
                    isVisible={(this.isHaveFilter && this.state.refreshing) || this.state.isLoadingHeader}
                />
            </View>
        );
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

    addItemChecked = (indexItem, isGroup, indexInDataSource) => {
        const valueField = !Vnr_Function.CheckIsNullOrEmpty(this.props.valueField) ? this.props.valueField : 'ID';
        let { itemSelected, dataSource, isAddItemChecked } = this.state;
        let itemChecked = null,
            nextState = {};

        if (isGroup && indexInDataSource !== null && indexInDataSource !== undefined) {
            itemChecked = dataSource[indexInDataSource]?.dataGroupMaster
                ? dataSource[indexInDataSource]?.dataGroupMaster[indexItem]
                : null;
        } else {
            itemChecked = dataSource[indexItem];
        }

        if (itemChecked) {
            if (!itemChecked?.isSelect) {
                // kiem tra isSelect == true thi add vao mang itemSelected
                //itemChecked.index = indexItem;
                itemSelected = itemSelected.concat(itemChecked);
            } else {
                nextState = {
                    isCheckAll: false
                };
                itemSelected = Vnr_Function.removeObjectInArray(itemSelected, itemChecked, valueField);
            }
            itemChecked.isSelect = !itemChecked.isSelect;

            if (isGroup && indexInDataSource !== null && indexInDataSource !== undefined) {
                if (
                    dataSource[indexInDataSource]?.dataGroupMaster &&
                    Array.isArray(dataSource[indexInDataSource]?.dataGroupMaster)
                ) {
                    const rs = dataSource[indexInDataSource]?.dataGroupMaster.find((item) => item?.isSelect === false);
                    if (rs) {
                        dataSource[indexInDataSource].isCheckAll = false;
                    } else {
                        dataSource[indexInDataSource].isCheckAll = true;
                    }
                }
            }

            if (nextState.isCheckAll === undefined || nextState.isCheckAll === null) {
                nextState = {
                    isCheckAll: this.isCheckedAll(true, dataSource, itemSelected)
                };
            }

            this.setState({
                dataSource: dataSource,
                itemSelected: itemSelected,
                isAddItemChecked: !isAddItemChecked,
                ...nextState
            });
        } else {
            ToasterSevice.showError('Có lỗi trong quá trình xử lý dữ liệu!');
        }
    };

    handleCheckAll = (isValue) => {
        let itemSlect = [];
        let { dataSource, isAddItemChecked } = this.state;

        if (this.props.groupField && Array.isArray(this.props.groupField) && this.props.groupField.length > 0) {
            dataSource.map((item) => {
                item.isCheckAll = isValue;
                if (item.dataGroupMaster && Array.isArray(item.dataGroupMaster)) {
                    item.dataGroupMaster.forEach((element) => {
                        element.isSelect = isValue;
                    });
                    itemSlect = [...itemSlect, ...item?.dataGroupMaster];
                }
            });

            this.setState({
                isCheckAll: isValue,
                dataSource: dataSource,
                itemSelected: isValue ? itemSlect : [],
                isAddItemChecked: !isAddItemChecked
            });
        } else if (isValue) {
            this.checkedAll();
        } else {
            this.unCheckedAll();
        }
    };

    checkedAll = () => {
        const { dataSource, isAddItemChecked } = this.state;
        dataSource.map((item) => {
            item.isSelect = true;
        });
        let itemSelected = [...dataSource],
            nextState = {
                ...this.state,
                isCheckAll: true,
                dataSource: dataSource,
                itemSelected: itemSelected,
                isAddItemChecked: !isAddItemChecked
            };

        // if (isDisable) {
        //     this.isCheckAllServer = true;
        //     nextState = {
        //         ...nextState,
        //         isDisableSelectItem: isDisable,
        //     };
        // }
        this.setState(nextState);
    };

    unCheckedAll = () => {
        const { dataSource, isAddItemChecked } = this.state;
        dataSource.map((item) => {
            item.isSelect = false;
        });

        let nextState = {
            ...this.state,
            isCheckAll: false,
            dataSource: dataSource,
            itemSelected: [],
            isAddItemChecked: !isAddItemChecked
        };
        // if (isDisable == false) {
        //     this.isCheckAllServer = false;
        //     nextState = {
        //         ...nextState,
        //         isDisableSelectItem: false,
        //     };
        // }
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

    openAction = (index) => () => {
        const { selected } = this.props;
        const { isOpenAction } = this.state;
        if (!isOpenAction && !Vnr_Function.CheckIsNullOrEmpty(selected)) {
            const result = this.addItemCheckedWidthOpenAction(index);
            this.setState({
                ...{ isOpenAction: true },
                ...result,
                marginTopNumber: this.isHaveFilter ? -65 : 0,
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
        if (!this.stateEndScroll) {
            // Phải scroll xong thì bấm mới hiệu lực
            return;
        }

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

    handleInfinityScroll = (event) => {
        let mHeight = event.nativeEvent.layoutMeasurement.height;
        let cSize = event.nativeEvent.contentSize.height;
        let Y = event.nativeEvent.contentOffset.y;
        if (Math.ceil(mHeight + Y) === Math.ceil(cSize)) {
            return true;
        }
        return false;
    };

    isCloseToBottom = (event) => {
        const paddingToBottom = 100;
        return (
            event.nativeEvent.layoutMeasurementlayoutMeasurement.height +
                event.nativeEvent.layoutMeasurement.contentOffset.y >=
            event.nativeEvent.layoutMeasurement.contentSize.height - paddingToBottom
        );
    };

    handleCheckAllOnTitleGroup = (index) => {
        const valueField = !Vnr_Function.CheckIsNullOrEmpty(this.props.valueField) ? this.props.valueField : 'ID';
        let { itemSelected, dataSource, isAddItemChecked } = this.state,
            itemChecked = dataSource[index],
            nextState = {},
            tempItemSelected = [];

        if (itemChecked) {
            itemChecked.isCheckAll = !itemChecked.isCheckAll;

            if (
                dataSource[index]?.dataGroupMaster &&
                Array.isArray(dataSource[index].dataGroupMaster) &&
                dataSource[index].dataGroupMaster.length > 0
            ) {
                dataSource[index].dataGroupMaster.forEach((element) => {
                    element.isSelect = itemChecked.isCheckAll;
                    if (element?.isSelect === true) {
                        tempItemSelected = tempItemSelected.concat(element);
                    } else {
                        nextState = {
                            isCheckAll: false
                        };
                        tempItemSelected = Vnr_Function.removeObjectInArray(itemSelected, element, valueField);
                    }
                });
            }

            if (nextState.isCheckAll === undefined || nextState.isCheckAll === null) {
                nextState = {
                    isCheckAll: this.isCheckedAll(true, dataSource, tempItemSelected)
                };
            }

            this.setState({
                dataSource: dataSource,
                itemSelected: tempItemSelected,
                isAddItemChecked: !isAddItemChecked,
                ...nextState
            });
        } else {
            ToasterSevice.showError('Có lỗi trong quá trình xử lý dữ liệu!');
        }
    };

    isCheckedAll = (isGroup, dataSource, itemSelected) => {
        const { dataNoGroup } = this.state;
        // case have config GroupField
        if (isGroup) {
            if (itemSelected.length !== dataNoGroup.length) {
                return false;
            }

            const rs = dataSource.find((item) => item?.isCheckAll === false);
            if (rs) {
                return false;
            }
        } else {
            const rs = dataSource.find((item) => item?.isSelect === false);
            if (rs) {
                return false;
            }
        }

        return true;
    };

    renderTitleGroup = (data, index, isCheckAll, quantityData) => {
        return (
            <ScrollView>
                {data.map((item, index) => {
                    return (
                        <TouchableOpacity
                            key={index}
                            style={styles.btnTitleGroup}
                            activeOpacity={1}
                            onPress={() => {
                                this.handleCheckAllOnTitleGroup(index);
                            }}
                        >
                            <View
                                style={[
                                    styles.checkTitleActive,
                                    isCheckAll && isCheckAll === true && styleSheet.styCheckTitleActive
                                ]}
                            >
                                {isCheckAll && isCheckAll === true && (
                                    <IconCheck size={Size.iconSize - 10} color={Colors.white} />
                                )}
                            </View>
                            <View>
                                <Text style={[styleSheets.lable, styles.textTitleGroup]} numberOfLines={2}>
                                    {item} {quantityData ? `(${quantityData})` : null}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        );
    };

    // indexInDataSource is variable when have isGroup === true
    renderDataOfGroup = (data, isGroup, indexInDataSource) => {
        const { dataSource, isPullToRefresh, isOpenAction, isDisableSelectItem } = this.state,
            { detail, rowActions } = this.props;

        return (
            <ScrollView>
                {data.map((value, index) => {
                    return (
                        <View
                            key={index}
                            style={[styles.containBotton, index === data.length - 1 && CustomStyleSheet.marginBottom(12)]}
                        >
                            <View style={styles.styleViewBorderButtom}>
                                <TouchableWithoutFeedback>
                                    <View style={CustomStyleSheet.flex(1)}>
                                        {detail?.screenName === ScreenName.AttApproveTakeBusinessTrip ||
                                        detail.screenName === ScreenName.AttApprovedTakeBusinessTrip ? (
                                                <AttTakeBusinessTripListItemApprove
                                                    key={index}
                                                    currentDetail={detail}
                                                    onClick={() => {
                                                        this.addItemChecked(index, isGroup, indexInDataSource);
                                                    }}
                                                    onMoveDetail={() => {
                                                        this.moveToDetail(value);
                                                    }}
                                                    isDisable={isDisableSelectItem}
                                                    numberDataSoure={dataSource.length}
                                                    isPullToRefresh={isPullToRefresh}
                                                    isOpenAction={isOpenAction}
                                                    isSelect={value.isSelect}
                                                    index={index}
                                                    dataItem={value}
                                                    addItem={this.addItemChecked}
                                                    // toggleAction={this.toggleAction}
                                                    handerOpenSwipeOut={this.handerOpenSwipeOut}
                                                    listItemOpenSwipeOut={this.listItemOpenSwipeOut}
                                                    rowActions={
                                                        !Vnr_Function.CheckIsNullOrEmpty(rowActions) ? rowActions : null
                                                    }
                                                />
                                            ) : (
                                                <AttTakeBusinessTripListItem
                                                    key={index}
                                                    currentDetail={detail}
                                                    onClick={() => {
                                                        this.addItemChecked(index, isGroup, indexInDataSource);
                                                    }}
                                                    onMoveDetail={() => {
                                                        this.moveToDetail(value);
                                                    }}
                                                    isDisable={isDisableSelectItem}
                                                    numberDataSoure={dataSource.length}
                                                    isPullToRefresh={isPullToRefresh}
                                                    isOpenAction={isOpenAction}
                                                    isSelect={value.isSelect}
                                                    index={index}
                                                    dataItem={value}
                                                    addItem={this.addItemChecked}
                                                    // toggleAction={this.toggleAction}
                                                    handerOpenSwipeOut={this.handerOpenSwipeOut}
                                                    listItemOpenSwipeOut={this.listItemOpenSwipeOut}
                                                    rowActions={
                                                        !Vnr_Function.CheckIsNullOrEmpty(rowActions) ? rowActions : null
                                                    }
                                                />
                                            )}
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
        );
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
                isCheckAll
            } = this.state,
            { api, detail, rowActions, onCreate, scrollYAnimatedValue } = this.props,
            permissionBtnCreate =
                PermissionForAppMobile &&
                PermissionForAppMobile.value['New_Att_BussinessTravel_New_Index_V2'] &&
                PermissionForAppMobile.value['New_Att_BussinessTravel_New_Index_V2']['Create']
                    ? true
                    : false;

        let dataBody = api ? (api.dataBody && this.isCheckAllServer ? api.dataBody : null) : null;

        const hiddenFiled = {
            OvertimeResonName: Vnr_Function.checkIsHaveConfigListDetail(detail?.screenName, 'OvertimeResonName')
        };
        if (dataBody) {
            dataBody = {
                ...dataBody,
                pageSize: totalRow
            };
        }
        let contentList = <View />;
        if (isLoading) {
            let typeLoading =
                detail.screenName == ScreenName.AttApproveTakeBusinessTrip ||
                detail.screenName == ScreenName.AttApprovedTSLRegister
                    ? EnumStatus.E_APPROVE
                    : EnumStatus.E_SUBMIT;

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
            scrollYAnimatedValue.setValue(0);
            contentList = (
                <FlatList
                    ref={(refs) => (this.refFlatList = refs)}
                    showsVerticalScrollIndicator={false}
                    disableScrollViewPanResponder={true} // fix bug khong the click onPess sau khi pulltoRefresh
                    data={dataSource}
                    extraData={this.state}
                    ListFooterComponent={this._renderFooterLoading}
                    ListHeaderComponent={this._renderHeaderLoading}
                    onScroll={(e) => {
                        const offsetY = e.nativeEvent.contentOffset.y;
                        this.scrollDirection = offsetY - this.lastOffsetY > 0 ? 'up' : 'down';
                        this.lastOffsetY = offsetY;
                        scrollYAnimatedValue.setValue(offsetY);
                    }}
                    onScrollBeginDrag={() => {
                        this.stateEndScroll = false;
                    }}
                    onScrollEndDrag={() => {
                        this.stateEndScroll = true;
                        if (this.lastOffsetY < 80 && !refreshing)
                            this.refFlatList?.scrollToOffset({
                                offset: this.scrollDirection === 'up' ? 80 : 0,
                                animated: true
                            });
                    }}
                    scrollEventThrottle={16}
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{
                        // nếu không có filter thì padding top ,
                        marginTop: this.isHaveFilter ? 0 : Size.defineHalfSpace,
                        paddingTop: this.isHaveFilter ? 80 : 0
                    }}
                    // style={{
                    //     // nếu không có filter thì padding top
                    //     paddingTop: !this.isHaveFilter && !isOpenAction ? Size.defineSpace : 0
                    // }}
                    renderItem={({ item, index }) => (
                        <View style={[styles.containBotton]}>
                            <View>
                                {item.listTextField &&
                                    Array.isArray(item.listTextField) &&
                                    item.listTextField.length > 0 &&
                                    this.renderTitleGroup(
                                        item.listTextField,
                                        index,
                                        item?.isCheckAll,
                                        item?.dataGroupMaster && Array.isArray(item.dataGroupMaster)
                                            ? item.dataGroupMaster.length
                                            : null
                                    )}
                            </View>
                            {item?.isGroup ? (
                                item?.dataGroupMaster &&
                                Array.isArray(item.dataGroupMaster) &&
                                item.dataGroupMaster.length > 0 ? (
                                        this.renderDataOfGroup(item.dataGroupMaster, true, index)
                                    ) : (
                                        <EmptyData messageEmptyData={'EmptyData'} />
                                    )
                            ) : (
                                // render data when no group
                                <View
                                    style={[
                                        styles.containBotton,
                                        index === dataSource.length - 1 && CustomStyleSheet.marginBottom(16)
                                    ]}
                                >
                                    <View style={styles.styleViewBorderButtom}>
                                        <View style={CustomStyleSheet.flex(1)}>
                                            {detail.screenName === ScreenName.AttApproveTakeBusinessTrip ||
                                            detail.screenName === ScreenName.AttApprovedTakeBusinessTrip ? (
                                                    <AttTakeBusinessTripListItemApprove
                                                        key={index}
                                                        hiddenFiled={hiddenFiled}
                                                        currentDetail={detail}
                                                        onClick={() => {
                                                            this.addItemChecked(index, false, null);
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
                                                        addItem={this.addItemChecked}
                                                        // toggleAction={this.toggleAction}
                                                        handerOpenSwipeOut={this.handerOpenSwipeOut}
                                                        listItemOpenSwipeOut={this.listItemOpenSwipeOut}
                                                        rowActions={
                                                            !Vnr_Function.CheckIsNullOrEmpty(rowActions) ? rowActions : null
                                                        }
                                                    />
                                                ) : (
                                                    <AttTakeBusinessTripListItem
                                                        key={index}
                                                        hiddenFiled={hiddenFiled}
                                                        currentDetail={detail}
                                                        onClick={() => {
                                                            this.addItemChecked(index, false, null);
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
                                                        addItem={this.addItemChecked}
                                                        // toggleAction={this.toggleAction}
                                                        handerOpenSwipeOut={this.handerOpenSwipeOut}
                                                        listItemOpenSwipeOut={this.listItemOpenSwipeOut}
                                                        rowActions={
                                                            !Vnr_Function.CheckIsNullOrEmpty(rowActions) ? rowActions : null
                                                        }
                                                    />
                                                )}
                                        </View>
                                    </View>
                                </View>
                            )}
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
                    }} // refresh khi scroll den cuoi
                    onEndReachedThreshold={0.5} // khoan cach tinh tu vi tri cuoi ds , se goi onEndReached
                />
            );
        }
        let isShowBtn =
            permissionBtnCreate &&
            (detail.screenNameRender === ScreenName.AttSubmitTakeBusinessTrip ||
                detail.screenNameRender === ScreenName.AttSaveTempSubmitTakeBusinessTrip);

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
                <View>
                    <View style={[!isShowBtn && styles.wrapBtnCreate]}>
                        {isShowBtn ? (
                            <VnrBtnCreate
                                onAction={() => {
                                    if (typeof onCreate == 'function' && onCreate) onCreate();
                                }}
                            />
                        ) : Array.isArray(rowActions) && rowActions.length > 0 ? (
                            <TouchableOpacity
                                onPress={() => {
                                    if (isCheckAll) {
                                        // case uncheck all
                                        this.handleCheckAll(false);
                                    } else {
                                        // case check all;
                                        this.handleCheckAll(true);
                                    }
                                }}
                                style={[
                                    styles.btnCheckAllAndUnChekAll,
                                    isCheckAll && { backgroundColor: Colors.red_1 }
                                ]}
                            >
                                {isCheckAll ? (
                                    <IconCancel size={Size.iconSizeHeader - 5} color={Colors.red} />
                                ) : (
                                    <IconCheck size={Size.iconSizeHeader - 5} color={Colors.blue} />
                                )}
                                <Text>
                                    {isCheckAll ? translate('HRM_PortalAp_DeselectAll') : translate('HRM_CheckAll')}
                                </Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </View>
                {Array.isArray(rowActions) && rowActions.length > 0 && itemSelected.length > 0 && (
                    <BottomAction
                        listActions={rowActions}
                        numberItemSelected={itemSelected.length}
                        closeAction={this.closeAction}
                        checkedAll={this.checkedAll}
                        unCheckedAll={this.unCheckedAll}
                        heightAction={heightActionBottom}
                        itemSelected={itemSelected}
                        dataBody={dataBody}
                    />
                )}
            </View>
        );
    }
}

const styles = stylesScreenDetailV3;

const styleSheet = StyleSheet.create({
    styCheckTitleActive: { backgroundColor: Colors.primary, borderRadius: 100, borderWidth: 0 },
    styFooterLoading: { flex: 1, paddingVertical: styleSheets.p_10, marginBottom: 30 },
    styRenderSeparator: {
        height: 0.5,
        width: 'auto',
        backgroundColor: Colors.grey,
        marginHorizontal: styleSheets.p_10
        //marginVertical : 2
    }
});
