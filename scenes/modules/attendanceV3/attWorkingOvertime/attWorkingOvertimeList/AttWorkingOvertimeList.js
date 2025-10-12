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
import { Colors, CustomStyleSheet, Size, stylesScreenDetailV3 } from '../../../../../constants/styleConfig';
import VnrLoadingScreen from '../../../../../components/VnrLoading/VnrLoadingScreen';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import BottomAction from '../../../../../componentsV3/BottomAction/BottomAction';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import { EnumName, EnumStatus, ScreenName } from '../../../../../assets/constant';
import AttWorkingOvertimeListItem from './AttWorkingOvertimeListItem';
import AttWorkingOvertimeListItemApprove from './AttWorkingOvertimeListItemApprove';
import { IconCheck, IconCancel } from '../../../../../constants/Icons';
const heightActionBottom = 45;
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { VnrBtnCreate } from '../../../../../componentsV3/VnrBtnCreate/VnrBtnCreate';
import { translate } from '../../../../../i18n/translate';
import VnrRenderList from '../../../../../componentsV3/VnrRenderList/VnrRenderList';

export default class AttWorkingOvertimeList extends VnrRenderList {
    // indexInDataSource is variable when have isGroup === true
    renderDataOfGroup = (data, isGroup, indexInDataSource) => {
        const { dataSource, isPullToRefresh, isOpenAction, isDisableSelectItem } = this.state,
            { detail, rowActions } = this.props;

        return (
            <ScrollView>
                {data.map((value, index) => {
                    return (
                        <View key={index} style={[styles.containBotton, index === data.length - 1 && CustomStyleSheet.marginBottom(12)]}>
                            <View style={styles.styleViewBorderButtom}>
                                <TouchableWithoutFeedback>
                                    <View style={CustomStyleSheet.flex(1)}>
                                        {detail?.screenName === ScreenName.AttApproveWorkingOvertime ? (
                                            <AttWorkingOvertimeListItemApprove
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
                                            <AttWorkingOvertimeListItem
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
                PermissionForAppMobile.value['New_Att_OvertimePlan_New_Index_V2'] &&
                PermissionForAppMobile.value['New_Att_OvertimePlan_New_Index_V2']['Create']
                    ? true
                    : false;

        let dataBody = api ? (api.dataBody && this.isCheckAllServer ? api.dataBody : null) : null;
        if (dataBody) {
            dataBody = {
                ...dataBody,
                pageSize: totalRow
            };
        }

        const hiddenFiled = {
            MethodPaymentView: Vnr_Function.checkIsHaveConfigListDetail(detail?.screenName, 'MethodPaymentView'),
            DataNote: Vnr_Function.checkIsHaveConfigListDetail(detail?.screenName, 'ReasonOT')
        };

        let contentList = <View />;
        if (isLoading) {
            let typeLoading =
                detail.screenName == ScreenName.AttApproveWorkingOvertime ||
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
                    ref={refs => (this.refFlatList = refs)}
                    showsVerticalScrollIndicator={false}
                    disableScrollViewPanResponder={true} // fix bug khong the click onPess sau khi pulltoRefresh
                    data={dataSource}
                    extraData={this.state}
                    ListFooterComponent={this._renderFooterLoading}
                    ListHeaderComponent={this._renderHeaderLoading}
                    onScroll={e => {
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
                    // nếu không có filter thì padding top
                    style={
                        this.isHaveFilter ? { ...CustomStyleSheet.paddingTop(80), ...CustomStyleSheet.marginTop(0) }
                            : { ...CustomStyleSheet.paddingTop(0), ...CustomStyleSheet.marginTop(Size.defineHalfSpace) }
                    }
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
                                        index === dataSource.length - 1 && CustomStyleSheet.marginBottom(12)
                                    ]}
                                >
                                    <View style={styles.styleViewBorderButtom}>
                                        <View style={CustomStyleSheet.flex(1)}>
                                            {detail.screenName !== ScreenName.AttSubmitWorkingOvertime ? (
                                                <AttWorkingOvertimeListItemApprove
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
                                                <AttWorkingOvertimeListItem
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
                    }}
                    onEndReachedThreshold={0.5} // khoan cach tinh tu vi tri cuoi ds , se goi onEndReached
                />
            );
        }
        let isShowBtn =
            permissionBtnCreate &&
            (detail.screenNameRender === ScreenName.AttSubmitWorkingOvertime ||
                detail.screenNameRender === ScreenName.AttSaveTempSubmitWorkingOvertime);
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
