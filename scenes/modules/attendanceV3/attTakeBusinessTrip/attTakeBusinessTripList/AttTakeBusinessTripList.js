import React from 'react';
import {
    View,
    FlatList,
    RefreshControl,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Text,
    ScrollView
} from 'react-native';
import { IconCheck, IconCancel } from '../../../../../constants/Icons';
import { Colors, CustomStyleSheet, Size, stylesScreenDetailV3 } from '../../../../../constants/styleConfig';
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
import Vnr_Services from '../../../../../utils/Vnr_Services';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import VnrRenderList from '../../../../../componentsV3/VnrRenderList/VnrRenderList';
const heightActionBottom = 45;
export default class AttTakeBusinessTripList extends VnrRenderList {
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
                detail.screenNameRender === ScreenName.AttSaveTempSubmitTakeBusinessTrip) && itemSelected.length === 0;

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
