import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import HreSurveyEmployeeList from './HreSurveyEmployeeList/HreSurveyEmployeeList';
import { styleSheets, styleSafeAreaView } from '../../../../constants/styleConfig';
import { ConfigList } from '../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumTask } from '../../../../assets/constant';
import { connect } from 'react-redux';
import { startTask } from '../../../../factories/BackGroundTask';

let configList = null,
    enumName = null,
    hreSurveyEmployee = null,
    hreSurveyEmployeeViewDetail = null,
    hreSurveyEmployeeKeyTask = null,
    pageSizeList = 20;

class HreSurveyEmployee extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataBody: null,
            // rowActions: [],
            // selected: [],
            isRefreshList: false,
            isLazyLoading: false,
            keyQuery: null,
            dataChange: false //biến check dữ liệu có thay đổi hay không
        };

        this.storeParamsDefault = null;
        //biến lưu lại object filter
        this.paramsFilter = null;
    }

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
                keyTask: hreSurveyEmployeeKeyTask,
                payload: {
                    ...dataBody,
                    keyQuery: keyQuery,
                    isCompare: false,
                    reload: this.reload
                }
            });
        });
    };

    paramsDefault = () => {
        const _configList = configList[hreSurveyEmployee]
                ? configList[hreSurveyEmployee]
                : {
                    Api: {
                        //"urlApi": "[URI_HR]/Hre_GetData/GetProfileLanguageLevelList",
                        type: 'POST',
                        pageSize: 20
                    },
                    Order: [
                        {
                            field: 'DateUpdate',
                            dir: 'desc'
                        }
                    ]
                },
            orderBy = _configList[enumName.E_Order];

        let _params = {
            IsPortal: true,
            sort: orderBy,
            page: 1,
            pageSize: pageSizeList
        };

        return {
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
                    keyTask: hreSurveyEmployeeKeyTask,
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
                    keyTask: hreSurveyEmployeeKeyTask,
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
        if (nextProps.reloadScreenName == hreSurveyEmployeeKeyTask) {
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
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        hreSurveyEmployee = ScreenName.HreSurveyEmployee;
        hreSurveyEmployeeKeyTask = EnumTask.KT_HreSurveyEmployee;
        hreSurveyEmployeeViewDetail = ScreenName.HreSurveyEmployeeViewDetail;
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: hreSurveyEmployeeKeyTask,
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
        const { isLazyLoading, isRefreshList, keyQuery, dataChange } = this.state;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                {hreSurveyEmployee && enumName && (
                    <View style={[styleSheets.container]}>
                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <HreSurveyEmployeeList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: hreSurveyEmployeeViewDetail,
                                        screenName: hreSurveyEmployee
                                    }}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={hreSurveyEmployeeKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    api={{
                                        pageSize: pageSizeList
                                    }}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    valueField="ID"
                                />
                            )}
                        </View>
                    </View>
                )}
            </SafeAreaView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

export default connect(mapStateToProps, null)(HreSurveyEmployee);
