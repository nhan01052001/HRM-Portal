import React from 'react';
import { View, FlatList, RefreshControl, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { Colors, CustomStyleSheet, styleSheets, stylesScreenDetailV3 } from '../../../../../constants/styleConfig';
import RenderItem from './RenderItem';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import BottomAction from './BottomAction';
import TopAction from './TopAction';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import DrawerServices from '../../../../../utils/DrawerServices';
import { EnumStatus } from '../../../../../assets/constant';
import VnrLoadingScreen from '../../../../../components/VnrLoading/VnrLoadingScreen';

const heightActionBottom = 45;

export default class EvaPerformanceEvaDataResultV3List extends React.Component {
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

    renderSeparator = () => {
        return <View style={stylesScreenDetailV3.separator} />;
    };

    remoteData = () => {
        const { api } = this.state.stateProps;
        const { dataSource, page } = this.state;
        api.dataBody = Object.assign(api.dataBody, { pageSize: this.pageSize, page: page });
        HttpService.Post(api.urlApi, api.dataBody).then((res) => {
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

                if (Object.prototype.hasOwnProperty.call(res, 'total')) {
                    total = res.total;
                } else if (Object.prototype.hasOwnProperty.call(res, 'Total')) {
                    total = res.Total;
                }

                data.map((item) => {
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
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    componentDidMount() {
        this.remoteData();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.refresh != undefined && nextProps.refresh != null && nextProps.refresh == false) {
            return;
        }

        if (this.props !== nextProps) {
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
                <View style={styles.styLoadingVIew}>
                    <VnrLoading size="large" isVisible={this.state.footerLoading} />
                </View>
            );
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    handerOpenSwipeOut = (indexOnOpen) => {
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

    addItemChecked = (indexItem) => {
        const valueField = !Vnr_Function.CheckIsNullOrEmpty(this.state.stateProps.valueField)
            ? this.state.stateProps.valueField
            : 'ID';
        let { itemSelected, dataSource } = this.state;

        let itemChecked = dataSource[indexItem];
        if (!itemChecked.isSelect) {
            // kiem tra isSelect == true thi add vao mang itemSelected
            itemChecked.index = indexItem;
            itemSelected = itemSelected.concat(itemChecked);
        } else {
            itemSelected = Vnr_Function.removeObjectInArray(itemSelected, itemChecked, valueField);
        }
        itemChecked.isSelect = !itemChecked.isSelect;

        this.setState({ dataSource: dataSource, itemSelected: itemSelected });
    };

    addItemCheckedWidthOpenAction = (indexItem) => {
        const valueField = !Vnr_Function.CheckIsNullOrEmpty(this.state.stateProps.valueField)
            ? this.state.stateProps.valueField
            : 'ID';
        let { itemSelected, dataSource } = this.state;

        let itemChecked = dataSource[indexItem];
        if (!itemChecked.isSelect) {
            // kiem tra isSelect == true thi add vao mang itemSelected
            itemChecked.index = indexItem;
            itemSelected = itemSelected.concat(itemChecked);
        } else {
            itemSelected = Vnr_Function.removeObjectInArray(itemSelected, itemChecked, valueField);
        }
        itemChecked.isSelect = !itemChecked.isSelect;

        return { dataSource: dataSource, itemSelected: itemSelected };
    };

    openAction = (index) => {
        const stateProps = this.props;
        const { isOpenAction } = this.state;
        if (!isOpenAction && !Vnr_Function.CheckIsNullOrEmpty(stateProps.selected)) {
            const result = this.addItemCheckedWidthOpenAction(index);
            this.setState({
                ...{ isOpenAction: true },
                ...result,
                marginTopNumber: -65, ///-120,
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
        this.setState({ dataSource: dataSource, isOpenAction: false, itemSelected: [], marginTopNumber: 0 });
    };

    handelListActionParamsScreenDetail = (dataItem) => {
        const { rowActions } = this.state.stateProps;
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

    checkedAll = (isDisable) => {
        const { dataSource } = this.state;
        dataSource.map((item) => {
            item.isSelect = true;
        });
        let itemSelected = [...dataSource],
            nextState = { dataSource: dataSource, itemSelected: itemSelected };

        if (isDisable == true) {
            this.isCheckAllServer = true;
            nextState = {
                ...nextState,
                isDisableSelectItem: isDisable
            };
        }
        this.setState(nextState);
    };

    unCheckedAll = (isDisable) => {
        const { dataSource } = this.state;
        dataSource.map((item) => {
            item.isSelect = false;
        });

        let nextState = { dataSource: dataSource, itemSelected: [] };

        if (isDisable == false) {
            this.isCheckAllServer = false;
            nextState = {
                ...nextState,
                isDisableSelectItem: false
            };
        }
        this.setState(nextState);
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
        } = this.state;
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
                        listActions={stateProps.selected}
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
                        listActions={stateProps.selected}
                        numberItemSelected={itemSelected.length}
                        closeAction={this.closeAction}
                        checkedAll={this.checkedAll}
                        unCheckedAll={this.unCheckedAll}
                        heightAction={heightActionBottom}
                        itemSelected={itemSelected}
                        dataBody={dataBody}
                    />
                )}
                {isLoading ? (
                    <VnrLoadingScreen
                        size="large"
                        screenName={this.props.detail ? this.props.detail.screenName : null}
                        isVisible={isLoading}
                        type={EnumStatus.E_SUBMIT}
                    />
                ) : dataSource.length == 0 && !isLoading ? (
                    <EmptyData messageEmptyData={messageEmptyData} />
                ) : (
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        disableScrollViewPanResponder={true} // fix bug khong the click onPess sau khi pulltoRefresh
                        data={dataSource}
                        extraData={this.state}
                        ListFooterComponent={this._renderLoading}
                        //ItemSeparatorComponent={this.renderSeparator}
                        renderItem={({ item, index }) => (
                            // eslint-disable-next-line react-native/no-inline-styles
                            <View style={[styles.containBotton, { marginTop: index == 0 ? 10 : 0 }]}>
                                <View
                                    style={[
                                        styles.styleViewBorderButtom,
                                        item.isSelect && { backgroundColor: Colors.primary_transparent_8 }
                                    ]}
                                >
                                    <TouchableWithoutFeedback
                                        onLongPress={() => this.openAction(index)}
                                        onPress={() => {
                                            if (isOpenAction && !isDisableSelectItem) {
                                                this.addItemChecked(index);
                                            } else if (!isOpenAction) {
                                                this.moveToDetail(item);
                                            }
                                        }}
                                        onPressIn={() => this.handerOpenSwipeOut(index)}
                                    >
                                        <View style={CustomStyleSheet.flex(1)}>
                                            <RenderItem
                                                currentDetail={stateProps.detail}
                                                onClick={() => {
                                                    isOpenAction == true ? this.addItemChecked(index) : null;
                                                }}
                                                isDisable={isDisableSelectItem}
                                                numberDataSoure={dataSource.length}
                                                isPullToRefresh={isPullToRefresh}
                                                isOpenAction={isOpenAction}
                                                isSelect={item.isSelect}
                                                index={index}
                                                renderRowConfig={stateProps.renderConfig}
                                                dataItem={item}
                                                addItem={this.addItemChecked}
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
                            </View>
                        )}
                        keyExtractor={(item) => item[valueField]}
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
                        onEndReachedThreshold={0.1} // khoan cach tinh tu vi tri cuoi ds , se goi onEndReached
                    />
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    styLoadingVIew: {
        flex: 1,
        paddingVertical: styleSheets.p_10
    },
    containBotton: {
        flex: 1,
        paddingHorizontal: 10
    },
    containerGrey: {
        flex: 1,
        backgroundColor: Colors.white
        // paddingTop: 10
    },
    styleViewBorderButtom: {
        borderWidth: 1,
        borderColor: Colors.borderColor,
        flex: 1,
        flexDirection: 'row',
        borderRadius: 5,
        marginBottom: 10
        // paddingVertical: 7
    }
});
