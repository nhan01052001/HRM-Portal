import React from 'react';
import {
    View,
    FlatList,
    RefreshControl,
    TouchableWithoutFeedback,
    Text,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import {
    Colors,
    CustomStyleSheet,
    Size,
    stylesScreenDetailV3
} from '../../../../../constants/styleConfig';
import VnrLoadingScreen from '../../../../../components/VnrLoading/VnrLoadingScreen';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import BottomAction from './BottomAction';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import DrawerServices from '../../../../../utils/DrawerServices';
import { EnumName, EnumStatus, ScreenName } from '../../../../../assets/constant';
import { getDataLocal } from '../../../../../factories/LocalData';
import HreTerminationOfWorkListItem from './HreTerminationOfWorkListItem';
import HreTerminationOfWorkListItemApprove from './HreTerminationOfWorkListItemApprove';
import Vnr_Services from '../../../../../utils/Vnr_Services';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
import { IconCheck, IconCancel } from '../../../../../constants/Icons';
const heightActionBottom = 45;
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { VnrBtnCreate } from '../../../../../componentsV3/VnrBtnCreate/VnrBtnCreate';
import { translate } from '../../../../../i18n/translate';
import VnrRenderList from '../../../../../componentsV3/VnrRenderList/VnrRenderList';

export default class HreTerminationOfWorkList extends VnrRenderList {
    remoteData = (param = {}) => {
        const { page } = this.state,
            { isLazyLoading } = param,
            { keyDataLocal, keyQuery, detail, groupField, isRefreshList } = this.props;
        if (keyDataLocal) {
            getDataLocal(keyDataLocal)
                .then((resData) => {
                    const resTemp = resData && resData[keyQuery] ? resData[keyQuery] : null;
                    if (resTemp?.Status === EnumName.E_SUCCESS && resTemp?.Data) {
                        const res = resTemp?.Data;
                        if (res && res.Data && res.Data.length > 0) {
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

                            if (detail?.screenName === ScreenName.HreApproveTerminationOfWork) {
                                data.map((item) => {
                                    item.isSelect = false;
                                    item.BusinessAllowAction = Vnr_Services.handleStatusApprove(
                                        item.Status,
                                        'E_APPROVED'
                                    );
                                    item.itemStatus = Vnr_Services.formatStyleStatusApp(item.Status);
                                    item.lstFileAttach = ManageFileSevice.setFileAttachApp(item.FileAttachment);
                                    if (item.Status === 'E_SUBMIT') {
                                        let arr = item.BusinessAllowAction.split(',');
                                        arr.push('E_REQUEST_CHANGE');
                                        item.BusinessAllowAction = arr.join(',');
                                    }
                                });
                            } else if (detail?.screenName == ScreenName.HreApprovedTerminationOfWork) {
                                data.map((item) => {
                                    item.isSelect = false;
                                    item.BusinessAllowAction = Vnr_Services.handleStatusApprove(item.Status, null);
                                    item.itemStatus = Vnr_Services.formatStyleStatusApp(item.Status);
                                    item.lstFileAttach = ManageFileSevice.setFileAttachApp(item.FileAttachment);
                                    if (item.Status === 'E_SUBMIT') {
                                        let arr = item.BusinessAllowAction.split(',');
                                        arr.push('E_REQUEST_CHANGE');
                                        item.BusinessAllowAction = arr.join(',');
                                    }
                                });
                            } else {
                                data.map((item) => {
                                    item.isSelect = false;
                                    item.BusinessAllowAction = Vnr_Services.handleStatus(
                                        item.Status,
                                        item?.SendEmailStatus ? item?.SendEmailStatus : false,
                                        false,
                                        true
                                    );
                                    item.itemStatus = Vnr_Services.formatStyleStatusApp(item.Status);
                                    item.lstFileAttach = ManageFileSevice.setFileAttachApp(item.FileAttachment);
                                    if (item.Status === 'E_SUBMIT' || item.Status === 'E_REQUEST_CHANGE') {
                                        let arr = item.BusinessAllowAction.split(',');
                                        arr.push('E_MODIFY');
                                        item.BusinessAllowAction = arr.join(',');
                                    }
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
                        } else {
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
                    } else if (resTemp === EnumName.E_EMPTYDATA) {
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
            { detail, rowActions, renderConfig } = this.props;

        return (
            <ScrollView>
                {data.map((value, index) => {
                    return (
                        <View
                            key={index}
                            style={[styles.containBotton, index === data.length - 1 && CustomStyleSheet.margin(12)]}
                        >
                            <View style={styles.styleViewBorderButtom}>
                                <TouchableWithoutFeedback>
                                    <View style={CustomStyleSheet.flex(1)}>
                                        {detail?.screenName === ScreenName.HreApproveTerminationOfWork ? (
                                            <HreTerminationOfWorkListItemApprove
                                                renderConfig={renderConfig}
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
                                            <HreTerminationOfWorkListItem
                                                renderConfig={renderConfig}
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
            { api, detail, rowActions, onCreate, scrollYAnimatedValue, renderConfig, isShowHideCreate } =
                this.props,
            permissionBtnCreate =
                PermissionForAppMobile &&
                PermissionForAppMobile.value['New_Hre_PersonalSubmitStopWorking_New_Index_PortalV3'] &&
                PermissionForAppMobile.value['New_Hre_PersonalSubmitStopWorking_New_Index_PortalV3']['Create']
                    ? true
                    : false;
        let dataBody = api ? (api.dataBody && this.isCheckAllServer ? api.dataBody : null) : null;
        if (dataBody) {
            dataBody = {
                ...dataBody,
                pageSize: totalRow
            };
        }

        let contentList = <View />;
        if (isLoading) {
            let typeLoading =
                detail.screenName == ScreenName.HreApproveTerminationOfWork ||
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
                                        index === dataSource.length - 1 && CustomStyleSheet.margin(0)
                                    ]}
                                >
                                    <View style={styles.styleViewBorderButtom}>
                                        <View style={CustomStyleSheet.flex(1)}>
                                            {detail.screenName !== ScreenName.HreSubmitTerminationOfWork ? (
                                                <HreTerminationOfWorkListItemApprove
                                                    renderConfig={renderConfig}
                                                    key={index}
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
                                                <HreTerminationOfWorkListItem
                                                    renderConfig={renderConfig}
                                                    key={index}
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
                    }}
                    onEndReachedThreshold={0.5} // khoan cach tinh tu vi tri cuoi ds , se goi onEndReached
                />
            );
        }
        let isShowBtn =
            permissionBtnCreate &&
            detail.screenNameRender === ScreenName.HreSubmitTerminationOfWork &&
            isShowHideCreate;
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
                        ) : (Array.isArray(rowActions) && rowActions.length > 0 && Array.isArray(dataSource) && dataSource.length > 0) ? (
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
