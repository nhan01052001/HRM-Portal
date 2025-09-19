/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image, FlatList, RefreshControl } from 'react-native';
import { styleSheets, Colors, Size, stylesVnrLoading } from '../../../../../constants/styleConfig';
import { translate } from '../../../../../i18n/translate';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import { EnumName, EnumStatus } from '../../../../../assets/constant';
import HreEvaluationResultListItem from './HreEvaluationResultListItem';
import { getDataLocal } from '../../../../../factories/LocalData';
import DrawerServices from '../../../../../utils/DrawerServices';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoadingScreen from '../../../../../components/VnrLoading/VnrLoadingScreen';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import HttpService from '../../../../../utils/HttpService';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';

export class HreEvaluationResultList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false, //biến hiển thị loading pull to refresh
            isLoading: true, // biến hiển thị loading dữ liệu cho danh sách
            dataSource: [],
            page: 1,
            isLoadingFooter: false, // biến hiển thị loading ở footer hay không
            isPullToRefresh: false, // biến dùng phủ định lại dữ liệu để render lại RenderItem
            totalRow: 0,
            isItemChecked: false, //biến xem đã check hay chưa
            isDisableSelectItem: null,
            selectedItemID: null //ID xuat file
        };
        this.endLoading = false;
        this.callOnEndReached = false;
        this.pageSize = 10;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            nextProps.isRefreshList !== this.props.isRefreshList ||
            nextState.isLoading !== this.state.isLoading ||
            nextProps.isLazyLoading !== this.props.isLazyLoading ||
            nextState.refreshing !== this.state.refreshing ||
            nextState.isLoadingFooter !== this.state.isLoadingFooter ||
            nextState.isItemChecked !== this.state.isItemChecked ||
            nextState.isDisableSelectItem !== this.state.isDisableSelectItem
        );
    }

    componentDidMount() {
        this.remoteData();
    }

    refresh = () => {
        this.setState({ isLoading: true, page: 1 });
    };

    remoteData = () => {
        const { dataSource, page } = this.state,
            { keyDataLocal, keyQuery } = this.props;
        if (keyDataLocal) {
            getDataLocal(keyDataLocal)
                .then((resData) => {
                    const res = resData && resData[keyQuery] ? resData[keyQuery] : null;

                    if (res && res !== EnumName.E_EMPTYDATA) {
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

                        data.map((item) => {
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
                                    isLoadingFooter: false,
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
                                    isLoadingFooter: false,
                                    isPullToRefresh: !this.state.isPullToRefresh
                                },
                                () => {
                                    setTimeout(() => {
                                        this.endLoading = false;
                                    }, 1000);
                                }
                            );
                        }
                    } else if (res === EnumName.E_EMPTYDATA) {
                        this.setState({
                            dataSource: EnumName.E_EMPTYDATA,
                            totalRow: 0,
                            isLoading: false,
                            refreshing: false,
                            isLoadingFooter: false,
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

    lazyLoading = (nexProps) => {
        // các trường hợp (pulltoRefresh, Màn hình) thì kiểm tra dữ liệu dữ liệu mới và củ có khác nhau hay không
        // paging,filter luôn thay đổi
        // dataChange (dùng để kiểm tra dữ liệu mới và củ  có khác nhau hay không )
        // dataChange == true ? khác : giống nhau
        if (!nexProps.dataChange) {
            this.setState({
                refreshing: false,
                isLoading: false
            });
        } else {
            this.remoteData({ isLazyLoading: true });
        }
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.isRefreshList != this.props.isRefreshList) {
            this.refresh(nextProps);
        }
        if (nextProps.isLazyLoading !== this.props.isLazyLoading) {
            this.lazyLoading(nextProps);
        }
    }

    _renderFooterLoading = () => {
        return (
            <View style={stylesVnrLoading.loadingInList}>
                <VnrLoading size="large" isVisible={this.state.isLoadingFooter} />
            </View>
        );
    };

    _handleRefresh = () => {
        const { pullToRefresh } = this.props;

        !this.state.isOpenAction &&
            this.setState({ refreshing: true, page: 1, isItemChecked: false }, () => {
                pullToRefresh && typeof pullToRefresh === 'function' && pullToRefresh();
            });
    };

    _handleEndRefresh = () => {
        if (this.pageSize == 0) {
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

    handleExportFile = (Format) => {
        try {
            const { selectedItemID } = this.state;

            let params = {
                PerformanceID: selectedItemID ? selectedItemID : null,
                Format: Format
            };

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Eva_GetData/ExportEvaluationFormForApp', {
                ...params
            }).then((res) => {
                VnrLoadingSevices.hide();
                if (res && typeof res === 'string') {
                    const [status, url] = res.split(',');
                    if (status === EnumName.E_Success && url) {
                        if (dataVnrStorage?.apiConfig?.uriMain) {
                            let fullURL = `${dataVnrStorage?.apiConfig?.uriMain}${url}`;
                            ManageFileSevice.ReviewFile(fullURL);
                        } else {
                            ToasterSevice.showWarning('HRM_PortalApp_NoResultsFound');
                        }
                    }
                }
            });
        } catch (error) {
            VnrLoadingSevices.hide();
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    handleItemChecked(itemID) {
        const { dataSource, isItemChecked } = this.state;

        const updatedDataSource = dataSource.map((item) => {
            if (item.ID === itemID) {
                return { ...item, isSelect: !item.isSelect };
            }
            return item;
        });

        this.setState({
            dataSource: updatedDataSource,
            isItemChecked: !isItemChecked,
            selectedItemID: itemID
        });
    }

    render() {
        const { dataSource, isLoading, refreshing, isPullToRefresh, isItemChecked, isDisableSelectItem } =
                this.state,
            valueField = !Vnr_Function.CheckIsNullOrEmpty(this.props.valueField) ? this.props.valueField : 'ID';

        const permissionBtnExportPDF = true;
        const permissionBtnExportExcel = true;

        let contentList = <View />;
        if (isLoading) {
            contentList = <VnrLoadingScreen size="large" isVisible={isLoading} type={EnumStatus.E_SUBMIT} />;
        } else if (dataSource == EnumName.E_EMPTYDATA || dataSource.length == 0) {
            contentList = <EmptyData messageEmptyData={'EmptyData'} />;
        } else if (dataSource && dataSource.length > 0) {
            contentList = (
                <FlatList
                    keyboardShouldPersistTaps={'handled'}
                    showsVerticalScrollIndicator={false}
                    disableScrollViewPanResponder={true} // fix bug khong the click onPess sau khi pulltoRefresh
                    data={dataSource}
                    extraData={this.state}
                    ListFooterComponent={this._renderFooterLoading}
                    renderItem={({ item, index }) => (
                        <View style={[styles.containBotton]}>
                            <HreEvaluationResultListItem
                                onClick={() => {
                                    this.handleItemChecked(item.ID);
                                }}
                                isDisable={isDisableSelectItem}
                                isPullToRefresh={isPullToRefresh}
                                index={index}
                                dataItem={item}
                                length={dataSource.length}
                                isItemChecked={isItemChecked}
                                isSelect={item.isSelect}
                            />
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
                    onEndReachedThreshold={0.5} // khoan cach tinh tu vi tri cuoi ds , se goi onEndReached
                />
            );
        }

        return (
            <View style={[styleSheets.container, { backgroundColor: Colors.gray_3 }]}>
                {contentList}
                {isItemChecked && (permissionBtnExportPDF || permissionBtnExportExcel) && (
                    <View
                        style={[
                            styles.wrapBtnExport,
                            (!permissionBtnExportPDF || !permissionBtnExportExcel) && {
                                justifyContent: 'center'
                            }
                        ]}
                    >
                        {permissionBtnExportPDF && (
                            <TouchableOpacity
                                style={[styles.btnExport, { marginRight: 6 }]}
                                onPress={() => {
                                    this.handleExportFile('PDF');
                                }}
                            >
                                <Image
                                    source={require('../../../../../assets/images/icon/IconPDF2.png')}
                                    style={[
                                        Size.iconSize,
                                        { marginRight: Size.defineHalfSpace, width: 16, height: 16 }
                                    ]}
                                    resizeMode={'contain'}
                                />
                                <Text style={[styleSheets.lable, { marginLeft: 4, color: Colors.gray_10 }]}>
                                    {translate('HRM_PortalApp_ExportPDF')}
                                </Text>
                            </TouchableOpacity>
                        )}
                        {permissionBtnExportExcel && (
                            <TouchableOpacity
                                style={[styles.btnExport, { marginLeft: 6 }]}
                                onPress={() => {
                                    this.handleExportFile('Excel');
                                }}
                            >
                                <Image
                                    source={require('../../../../../assets/images/icon/IconExcel2.png')}
                                    style={[
                                        Size.iconSize,
                                        { marginRight: Size.defineHalfSpace, width: 16, height: 16 }
                                    ]}
                                    resizeMode={'contain'}
                                />
                                <Text style={[styleSheets.lable, { marginLeft: 4, color: Colors.gray_10 }]}>
                                    {translate('HRM_PortalApp_ExportExcel')}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containBotton: {
        flex: 1
    },
    btnExport: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.gray_5,
        paddingVertical: 12,
        borderRadius: Size.borderRadiusBotton
    },
    wrapBtnExport: {
        backgroundColor: Colors.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Size.defineSpace,
        borderTopWidth: 0.5,
        borderTopColor: Colors.gray_5
    }
});

export default HreEvaluationResultList;
