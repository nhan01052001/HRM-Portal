import React, { Component } from 'react';
import { View, TouchableOpacity, Modal, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HreWorkHistoryList from '../hreWorkHistoryList/HreWorkHistoryList';
import { styleSheets, Colors, Size, CustomStyleSheet } from '../../../../../constants/styleConfig';
import { IconSliders, IconCancel, IconCheck } from '../../../../../constants/Icons';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumTask } from '../../../../../assets/constant';
import { connect } from 'react-redux';
import { startTask } from '../../../../../factories/BackGroundTask';
import { translate } from '../../../../../i18n/translate';

let configList = null,
    enumName = null,
    hreWorkHistorySubmit = null,
    hreWorkHistorySubmitViewDetail = null,
    hreWorkHistorySubmitKeyTask = null,
    pageSizeList = 20,
    dataFilter = [
        {
            id: 1,
            lable: 'HRM_PortalApp_WorkProcess',
            enum: 'Hre_WorkHistory',
            icon: require('../../../../../assets/images/workhistory/workhistory.png'),
            isSelected: false
        },
        {
            id: 2,
            lable: 'ModuleFunction__E_REWARD',
            enum: 'Hre_Reward',
            icon: require('../../../../../assets/images/workhistory/reward.png'),
            isSelected: false
        },
        {
            id: 3,
            lable: 'HRM_PortalApp_SalaryLevel',
            enum: 'Sal_BasicSalary',
            icon: require('../../../../../assets/images/workhistory/basicsalary.png'),
            isSelected: false
        },
        {
            id: 4,
            lable: 'ModuleFunction__E_CONCURRENT',
            enum: 'Hre_ConCurrent',
            icon: require('../../../../../assets/images/workhistory/concurrent.png'),
            isSelected: false
        },
        {
            id: 5,
            lable: 'ModuleFunction__E_DISCIPLINE',
            enum: 'Hre_Discipline',
            icon: require('../../../../../assets/images/workhistory/discipline.png'),
            isSelected: false
        },
        {
            id: 6,
            lable: 'HRM_Hr_Hre_IsCopyAccident',
            enum: 'Hre_Accident',
            icon: require('../../../../../assets/images/workhistory/accident.png'),
            isSelected: false
        }
    ];

class HreWorkHistorySubmit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataBody: null,
            rowActions: [],
            selected: [],
            isRefreshList: false,
            isLazyLoading: false,
            keyQuery: null,
            dataChange: false, //biến check dữ liệu có thay đổi hay không,
            isShowFilter: false,
            dataFilter: dataFilter
        };

        this.storeParamsDefault = null;

        //biến lưu lại object filter
        this.paramsFilter = null;

        props.navigation.setParams({
            headerRight: this.headerRight()
        });
    }

    headerRight = () => {
        const { dataBody } = this.state;

        return (
            <TouchableOpacity
                onPress={() => {
                    this.setState({
                        isShowFilter: true
                    });
                }}
            >
                <View style={styleSheets.bnt_HeaderRight}>
                    <IconSliders color={Colors.gray_10} size={Size.iconSizeHeader} />
                    {Array.isArray(dataBody?.TypeCardTimeline) && dataBody?.TypeCardTimeline.length > 0 && (
                        <View style={[styles.wrapNumberCountFilter]}>
                            <Text
                                style={[
                                    styleSheets.lable,
                                    {
                                        color: Colors.white,
                                        fontSize: Size.text
                                    }
                                ]}
                            >
                                {dataBody?.TypeCardTimeline.length}
                            </Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    reload = (paramsFilter) => {
        if (paramsFilter === 'E_KEEP_FILTER') {
            paramsFilter = { ...this.paramsFilter };
        } else {
            this.paramsFilter = { ...paramsFilter };
        }

        let _paramsDefault = this.storeParamsDefault,
            _keyQuery = EnumName.E_FILTER;

        _paramsDefault = {
            ..._paramsDefault,
            keyQuery: _keyQuery,
            isRefreshList: !this.state.isRefreshList, // reload lại ds.
            dataBody: {
                ..._paramsDefault.dataBody,
                ...paramsFilter
            }
        };

        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: hreWorkHistorySubmitKeyTask,
                payload: {
                    ...dataBody,
                    keyQuery: keyQuery,
                    isCompare: false,
                    reload: this.reload
                }
            });
            this.props.navigation.setParams({
                headerRight: this.headerRight()
            });
        });
    };

    checkDataFormNotify = () => {
        const { params = {} } = this.props.navigation.state,
            { NotificationID } = typeof params == 'object' ? params : JSON.parse(params);
        return NotificationID ? NotificationID : null;
    };

    paramsDefault = () => {
        if (!configList[hreWorkHistorySubmit]) {
            configList[hreWorkHistorySubmit] = {
                Api: {
                    urlApi: '[URI_CENTER]/api/Hre_WorkHistoryAPI/GetWorkHistoryProfileTimeLine',
                    type: 'POST',
                    pageSize: 20
                },
                Order: [
                    {
                        field: 'DateUpdate',
                        dir: 'desc'
                    }
                ],
                Row: [],
                BusinessAction: []
            };
        }

        const _configList = configList[hreWorkHistorySubmit],
            renderRow = _configList[enumName.E_Row],
            orderBy = _configList[enumName.E_Order];

        // const dataRowActionAndSelected = generateRowActionAndSelected();
        let _params = {
            IsPortal: true,
            sort: orderBy,
            pageSize: pageSizeList,
            NotificationID: this.checkDataFormNotify()
        };

        return {
            // rowActions: dataRowActionAndSelected.rowActions,
            // selected: dataRowActionAndSelected.selected,
            renderRow: renderRow,
            dataBody: _params,
            keyQuery: EnumName.E_PRIMARY_DATA
        };
    };

    pullToRefresh = () => {
        const { dataBody, keyQuery } = this.state;
        this.setState(
            {
                keyQuery: keyQuery == EnumName.E_FILTER ? keyQuery : EnumName.E_PRIMARY_DATA
            },
            () => {
                startTask({
                    keyTask: hreWorkHistorySubmitKeyTask,
                    payload: {
                        ...dataBody,
                        keyQuery: keyQuery == EnumName.E_FILTER ? keyQuery : EnumName.E_PRIMARY_DATA,
                        isCompare: false,
                        reload: this.reload
                    }
                });
            }
        );
    };

    pagingRequest = (page, pageSize) => {
        const { dataBody } = this.state;
        this.setState(
            {
                keyQuery: EnumName.E_PAGING
            },
            () => {
                startTask({
                    keyTask: hreWorkHistorySubmitKeyTask,
                    payload: {
                        ...dataBody,
                        page: page,
                        pageSize: pageSize,
                        keyQuery: EnumName.E_PAGING,
                        isCompare: false,
                        reload: this.reload
                    }
                });
            }
        );
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;
        if (nextProps.reloadScreenName == hreWorkHistorySubmitKeyTask) {
            //khi màn hình đang reload thì messsage phải là filter thì màn hình mới reload
            if (keyQuery === EnumName.E_FILTER && nextProps.message && keyQuery == nextProps.message.keyQuery) {
                this.setState({
                    isLazyLoading: !this.state.isLazyLoading,
                    dataChange: nextProps.message.dataChange
                });
            } else if (nextProps.message && keyQuery == nextProps.message.keyQuery) {
                // trường hợp không filter
                this.setState({
                    isLazyLoading: !this.state.isLazyLoading,
                    dataChange: nextProps.message.dataChange
                });
            }
        }
    }

    componentDidMount() {
        //main
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;

        hreWorkHistorySubmit = ScreenName.HreWorkHistorySubmit;
        hreWorkHistorySubmitViewDetail = ScreenName.HreWorkHistorySubmitViewDetail;

        hreWorkHistorySubmitKeyTask = EnumTask.KT_HreWorkHistorySubmit;

        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState({ ..._paramsDefault, dataFilter: dataFilter });

        startTask({
            keyTask: hreWorkHistorySubmitKeyTask,
            payload: {
                ..._paramsDefault.dataBody,
                pageSize: pageSizeList,
                keyQuery: EnumName.E_PRIMARY_DATA,
                isCompare: true,
                reload: this.reload
            }
        });
    }

    render() {
        const {
            dataBody,
            renderRow,
            rowActions,
            selected,
            isLazyLoading,
            isRefreshList,
            keyQuery,
            dataChange,
            isShowFilter,
            dataFilter
        } = this.state;
        const isDisableBtnConfirm = !(dataFilter.find((v) => v.isSelected));
        return (
            <SafeAreaView style={styles.styleSafeAreaView}>
                {hreWorkHistorySubmit && hreWorkHistorySubmitViewDetail && enumName && (
                    <View style={[styleSheets.container]}>
                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <HreWorkHistoryList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: hreWorkHistorySubmitViewDetail,
                                        screenName: hreWorkHistorySubmit
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={hreWorkHistorySubmitKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    // need fix
                                    api={{
                                        urlApi: '[URI_CENTER]/api/Hre_WorkHistoryAPI/GetWorkHistoryProfileTimeLine',
                                        type: enumName.E_POST,
                                        dataBody: dataBody,
                                        pageSize: 20
                                    }}
                                    valueField="ID"
                                    renderConfig={renderRow}
                                    dataFilter={dataFilter}
                                />
                            )}
                        </View>
                    </View>
                )}
                <Modal
                    animationType="fade"
                    transparent={false}
                    visible={isShowFilter}
                    onRequestClose={() => {
                        this.setState({
                            isShowFilter: false
                        });
                    }}
                >
                    <SafeAreaView style={styles.containerModal}>
                        <View style={styles.wrapHeaderModal}>
                            <Text style={[styleSheets.lable]}>{translate('HRM_Tra_Calendar_Filter')}</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        isShowFilter: false
                                    });
                                }}
                            >
                                <IconCancel color={Colors.gray_10} size={Size.iconSizeHeader} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView
                            style={CustomStyleSheet.paddingHorizontal(12)}
                        >
                            {dataFilter.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        activeOpacity={0.5}
                                        onPress={() => {
                                            dataFilter.forEach((value) => {
                                                if (item.id === value.id) {
                                                    value.isSelected = !value.isSelected;
                                                }
                                            });
                                            this.setState({
                                                dataFilter: [...dataFilter]
                                            });
                                        }}
                                        style={[
                                            styles.item,
                                            index !== dataFilter.length - 1 && styles.styBtnborder,
                                            { backgroundColor: Colors.white }
                                        ]}
                                    >
                                        <View style={styles.wrapItemInModal}>
                                            <View style={styles.styleFlex_row_Align_Center}>
                                                <Image style={styles.size18} source={item.icon} />
                                                <Text style={[styleSheets.lable, styles.styTextLable]}>
                                                    {translate(item.lable)}
                                                </Text>
                                            </View>
                                            {item?.isSelected ? (
                                                <View style={styles.iconCheckActive}>
                                                    <IconCheck color={Colors.white} size={16} />
                                                </View>
                                            ) : (
                                                <View style={styles.iconCheckNoActive} />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                        <View style={styles.wrapButton}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        isShowFilter: false
                                    });
                                }}
                                style={styles.btnClose}
                            >
                                <Text style={styleSheets.lable}>{translate('HRM_Common_Close')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                disabled={isDisableBtnConfirm}
                                onPress={() => {
                                    let dataSelected = [];
                                    dataFilter.map((item) => {
                                        if (item.isSelected) {
                                            dataSelected.push(item.enum);
                                        }
                                    });
                                    this.reload({
                                        TypeCardTimeline: dataSelected
                                    });
                                    this.setState({
                                        isShowFilter: false
                                    });
                                }}
                                style={[styles.btnConfirm, isDisableBtnConfirm && CustomStyleSheet.backgroundColor(Colors.gray_3)]}
                            >
                                <Text style={[styleSheets.lable, { color: Colors.white }, isDisableBtnConfirm && { color: Colors.gray_8 }]}>
                                    {translate('HRM_PortalApp_Compliment_Commfirm')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </Modal>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    styleSafeAreaView: {
        flex: 1,
        backgroundColor: Colors.white,
        paddingTop: 0,
        marginTop: 0
    },
    styTextLable: { fontSize: 16, marginLeft: 6 },
    styBtnborder: { borderBottomColor: Colors.gray_5, borderBottomWidth: 0.5 },
    containerModal: {
        flex: 1,
        backgroundColor: Colors.white
    },

    wrapHeaderModal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12
    },

    wrapItemInModal: {
        padding: 12,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    size18: {
        width: 18,
        height: 18
    },

    iconCheckActive: {
        width: 26,
        height: 26,
        borderRadius: 26,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center'
    },

    iconCheckNoActive: {
        width: 26,
        height: 26,
        borderRadius: 26,
        backgroundColor: Colors.white,
        borderColor: Colors.gray_7,
        borderWidth: 0.5
    },

    wrapButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: Colors.white
    },

    btnClose: {
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: Colors.gray_7,
        borderRadius: 8,
        width: '30%',
        alignItems: 'center'
    },

    btnConfirm: {
        paddingVertical: 8,
        backgroundColor: Colors.primary,
        borderRadius: 8,
        width: '65%',
        alignItems: 'center'
    },

    styleFlex_row_Align_Center: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    wrapNumberCountFilter: {
        backgroundColor: Colors.red,
        position: 'absolute',
        top: -5,
        right: 5,
        width: 18,
        height: 18,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const mapStateToProps = (state) => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

export default connect(mapStateToProps, null)(HreWorkHistorySubmit);
