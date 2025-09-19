import React, { Component } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import ListHistoryOfComCompliment from '../listHistoryOfComCompliment/ListHistoryOfComCompliment';
import {
    styleSheets,
    styleSafeAreaView,
    styleContentFilterDesign,
    styleContentFilterDesignV3,
    Colors,
    Size,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import VnrFilterCommon from '../../../../../components/VnrFilter/VnrFilterCommon';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ScreenName, EnumName, EnumTask } from '../../../../../assets/constant';
import {
    generateRowActionAndSelected,
    HistoryOfComComplimentBusinessFunction
} from '../HistoryOfComComplimentBusiness';
import { connect } from 'react-redux';
import { startTask } from '../../../../../factories/BackGroundTask';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import moment from 'moment';
import VnrMonthYear from '../../../../../components/VnrMonthYear/VnrMonthYear';
import { ConfigListFilter } from '../../../../../assets/configProject/ConfigListFilter';
import ComComplimentAddOrEdit from '../../comCompliment/ComComplimentAddOrEdit';

let configList = null,
    enumName = null,
    historyOfComComplimenting = null,
    attHistoryOfComComplimentingKeyTask = null,
    pageSizeList = 20;

class HistoryOfComComplimenting extends Component {
    constructor(props) {
        super(props);

        this.state = {
            SearchDate: {
                value: null,
                refresh: false,
                disable: false
            },
            dataBody: null,
            rowActions: [],
            selected: [],
            isRefreshList: false,
            isLazyLoading: false,
            keyQuery: null,
            dataChange: false //biến check dữ liệu có thay đổi hay không
        };

        // animation filter
        this.scrollYAnimatedValue = new Animated.Value(0);

        this.storeParamsDefault = null;

        //biến lưu lại object filter
        this.paramsFilter = null;

        this.ComComplimentAddOrEdit = null;

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            // Trường hợp goBack từ detail thì phải gán lại this
            HistoryOfComComplimentBusinessFunction.setThisForBusiness(this);
            if (HistoryOfComComplimentBusinessFunction.checkForReLoadScreen[historyOfComComplimenting]) {
                this.reload();
            }
        });
    }

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
    }

    reload = (paramsFilter) => {
        if (paramsFilter === 'E_KEEP_FILTER') {
            paramsFilter = { ...this.paramsFilter };
        } else {
            this.paramsFilter = { ...paramsFilter };
        }

        let _paramsDefault = this.storeParamsDefault ? this.storeParamsDefault : this.paramsDefault(),
            _keyQuery = EnumName.E_FILTER;

        _paramsDefault = {
            ..._paramsDefault,
            keyQuery: _keyQuery,
            isRefreshList: !this.state.isRefreshList, // reload lại ds.
            dataBody: {
                ..._paramsDefault?.dataBody,
                ...paramsFilter
            }
        };

        // set false when reloaded
        HistoryOfComComplimentBusinessFunction.checkForReLoadScreen[historyOfComComplimenting] = false;

        // reload list ComCompliment
        HistoryOfComComplimentBusinessFunction.checkForReLoadScreen[ScreenName.ComCompliment] = true;

        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: attHistoryOfComComplimentingKeyTask,
                payload: {
                    ...dataBody,
                    keyQuery: keyQuery,
                    isCompare: false,
                    reload: this.reload
                }
            });
        });
    };

    checkDataFormNotify = () => {
        const { params = {} } = this.props.navigation.state,
            { NotificationID } = typeof params == 'object' ? params : JSON.parse(params);
        return NotificationID ? NotificationID : null;
    };

    paramsDefault = () => {
        if (!historyOfComComplimenting) {
            historyOfComComplimenting = ScreenName.HistoryOfComComplimenting;
        }
        if (!configList[historyOfComComplimenting]) {
            configList[historyOfComComplimenting] = {
                Api: {
                    urlApi: '[URI_HR]/Com_GetData/GetComplimentHistoryPraisedBy',
                    type: 'POST',
                    pageSize: 20
                },
                Order: [
                    {
                        field: 'TimeLog',
                        dir: 'desc'
                    }
                ],
                Filter: [
                    {
                        logic: 'and',
                        filters: []
                    }
                ],
                BusinessAction: [
                    {
                        Type: 'E_SENDTHANKS',
                        Resource: {
                            Name: 'HistoryOfBeComCompliment_New_Index_btnSendMail',
                            Rule: 'View'
                        }
                    }
                ]
            };
        }

        const _configList = configList[historyOfComComplimenting],
            filter = _configList[enumName.E_Filter];

        const dataRowActionAndSelected = generateRowActionAndSelected(historyOfComComplimenting);
        let _params = {
            // IsPortal: true,
            // sort: orderBy,
            IsPortalNew: true,
            filter: filter,
            pageSize: pageSizeList,
            // NotificationID: this.checkDataFormNotify(),
            ProfileID: dataVnrStorage.currentUser.info.ProfileID
        };

        return {
            rowActions: dataRowActionAndSelected.rowActions,
            selected: dataRowActionAndSelected.selected,
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
                    keyTask: attHistoryOfComComplimentingKeyTask,
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

    pagingRequest = (page) => {
        const { dataBody } = this.state;
        this.setState(
            {
                keyQuery: EnumName.E_PAGING
            },
            () => {
                startTask({
                    keyTask: attHistoryOfComComplimentingKeyTask,
                    payload: {
                        ...dataBody,
                        page: page,
                        pageSize: 20,
                        keyQuery: EnumName.E_PAGING,
                        isCompare: false,
                        reload: this.reload,
                        dataSourceRequestString: `page=${page}&pageSize=20`,
                        take: 20
                    }
                });
            }
        );
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;
        if (nextProps.reloadScreenName == attHistoryOfComComplimentingKeyTask) {
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
        PermissionForAppMobile.value = {
            ...PermissionForAppMobile.value,
            HistoryOfBeComCompliment_New_Index_btnSendMail: {
                View: true
            }
        };

        historyOfComComplimenting = ScreenName.HistoryOfComComplimenting;
        attHistoryOfComComplimentingKeyTask = EnumTask.KT_HistoryOfComComplimenting;
        HistoryOfComComplimentBusinessFunction.checkForReLoadScreen[historyOfComComplimenting] = false;
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: attHistoryOfComComplimentingKeyTask,
            payload: {
                ..._paramsDefault.dataBody,
                pageSize: pageSizeList,
                keyQuery: EnumName.E_PRIMARY_DATA,
                isCompare: true,
                reload: this.reload,
                Status: null,
                skip: 0,
                take: 20
            }
        });
    }

    onSendThanks = (item) => {
        if (item) {
            if (this.ComComplimentAddOrEdit && this.ComComplimentAddOrEdit.onShow) {
                this.ComComplimentAddOrEdit.onShow({
                    reload: this.reload,
                    record: item
                });
            }
        }
    };

    render() {
        const { dataBody, rowActions, selected, isLazyLoading, isRefreshList, keyQuery, dataChange, SearchDate } =
            this.state;

        // "HistoryOfComComplimenting": {
        //     "FilterCommon": {
        //       "fieldName": "Key",
        //       "placeholder": [
        //         "ProfileNameUpercase"
        //       ],
        //       "ClassStyle": "",
        //     },
        //     "FilterAdvance": [
        //       {
        //         "ControlGroup": [
        //           {
        //             "Name": "VnrText",
        //             "fieldName": "Key",
        //             "placeHolder": "ProfileNameUpercase"
        //           }
        //         ]
        //       },
        //     ]
        //   }

        return (
            <SafeAreaViewDetail style={styleSafeAreaView.style}>
                {historyOfComComplimenting && enumName && (
                    <View style={[styleSheets.containerGrey]}>
                        {ConfigListFilter.value[historyOfComComplimenting] && (
                            <View style={[styleContentFilterDesign.styRightPicker, { backgroundColor: Colors.white }]}>
                                <VnrFilterCommon
                                    dataBody={dataBody}
                                    style={{
                                        ...styleContentFilterDesign,
                                        contentFilter: {
                                            ...styleContentFilterDesign.contentFilter,
                                            backgroundColor: Colors.white,
                                            paddingHorizontal: 12
                                        },
                                        viewFilter: styleContentFilterDesignV3.viewFilter,
                                        filter: {
                                            ...styleContentFilterDesignV3.filter
                                        },
                                        search: {
                                            ...styleContentFilterDesign.search,
                                            backgroundColor: Colors.gray_3
                                        }
                                    }}
                                    screenName={historyOfComComplimenting}
                                    onSubmitEditing={this.reload}
                                />
                                <View style={styles.wrapBtnSearchBymonth}>
                                    <VnrMonthYear
                                        response={'string'}
                                        format={'MM/YYYY'}
                                        value={SearchDate.value}
                                        refresh={SearchDate.refresh}
                                        type={'date'}
                                        stylePicker={styles.styleControll}
                                        styleTextPicker={CustomStyleSheet.fontSize(13)}
                                        placeHolder="AnalysisPeriod__ALL"
                                        onFinish={(value) => {
                                            if (value) {
                                                this.setState(
                                                    {
                                                        SearchDate: {
                                                            ...SearchDate,
                                                            value: value,
                                                            refresh: !SearchDate.refresh
                                                        }
                                                    },
                                                    () => {
                                                        this.reload({ RecordDate: moment(value).format('YYYY/MM') });
                                                    }
                                                );
                                            }
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <ListHistoryOfComCompliment
                                    detail={{
                                        dataLocal: false,
                                        screenName: historyOfComComplimenting,
                                        screenNameRender: ScreenName.HistoryOfComComplimenting
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={attHistoryOfComComplimentingKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    color="blue"
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    api={{
                                        urlApi: '[URI_HR]/Com_GetData/GetComplimentHistoryPraisedBy',
                                        type: enumName.E_POST,
                                        dataBody: dataBody,
                                        pageSize: pageSizeList
                                    }}
                                    valueField="ID"
                                />
                            )}
                        </View>

                        <ComComplimentAddOrEdit ref={(refs) => (this.ComComplimentAddOrEdit = refs)} />
                    </View>
                )}
            </SafeAreaViewDetail>
        );
    }
}

const styles = StyleSheet.create({
    wrapBtnSearchBymonth: { width: 110, paddingVertical: Size.defineSpace / 2, paddingRight: 12 },
    styleControll: {
        height: 50,
        justifyContent: 'center',
        backgroundColor: Colors.gray_3,
        borderWidth: 0,
        paddingHorizontal: 6,
        borderRadius: 0
    }
});

const mapStateToProps = (state) => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

export default connect(mapStateToProps, null)(HistoryOfComComplimenting);
