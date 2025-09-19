import React, { Component } from 'react';
import { View } from 'react-native';
import { styleSheets, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { SafeAreaView } from 'react-navigation';
import { EnumName, EnumTask } from '../../../../../assets/constant';
import { connect } from 'react-redux';
import HreEvaluationResultList from '../hreEvaluationResultList/HreEvaluationResultList';
import { startTask } from '../../../../../factories/BackGroundTask';

let hreEvaluationResultKeyTask = null,
    pageSizeList = 10;

class HreEvaluationResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowExport: true,
            dataBody: null,
            isRefreshList: false,
            isLazyLoading: false,
            keyQuery: null,
            dataChange: false //biến check dữ liệu có thay đổi hay không,
        };
        this.hreEvaluationResultList = null;
        this.storeParamsDefault = null;
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
                keyTask: hreEvaluationResultKeyTask,
                payload: {
                    ...dataBody,
                    keyQuery: keyQuery,
                    isCompare: false,
                    reload: this.reload
                }
            });
        });
    };

    pullToRefresh = () => {
        const { dataBody, keyQuery } = this.state;
        this.setState(
            {
                keyQuery: keyQuery == EnumName.E_FILTER ? keyQuery : EnumName.E_PRIMARY_DATA
            },
            () => {
                startTask({
                    keyTask: hreEvaluationResultKeyTask,
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
                    keyTask: hreEvaluationResultKeyTask,
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

    componentDidMount() {
        //main
        //set by config

        hreEvaluationResultKeyTask = EnumTask.KT_HreEvaluationResult;

        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState({ ..._paramsDefault });

        startTask({
            keyTask: hreEvaluationResultKeyTask,
            payload: {
                ..._paramsDefault.dataBody,
                pageSize: pageSizeList,
                keyQuery: EnumName.E_PRIMARY_DATA,
                isCompare: true,
                reload: this.reload
            }
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;
        if (nextProps.reloadScreenName == hreEvaluationResultKeyTask) {
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

    paramsDefault = () => {
        let _params = {
            pageSize: pageSizeList
        };

        return {
            dataBody: _params,
            keyQuery: EnumName.E_PRIMARY_DATA
        };
    };

    render() {
        const { keyQuery, dataChange, isRefreshList, isLazyLoading } = this.state;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container]}>
                    {keyQuery && (
                        <HreEvaluationResultList
                            ref={(ref) => (this.hreEvaluationResultList = ref)}
                            reloadScreenList={this.reload.bind(this)}
                            keyDataLocal={hreEvaluationResultKeyTask}
                            pullToRefresh={this.pullToRefresh}
                            pagingRequest={this.pagingRequest}
                            isLazyLoading={isLazyLoading}
                            isRefreshList={isRefreshList}
                            dataChange={dataChange}
                            keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                            valueField="ID"
                        />
                    )}
                </View>
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

export default connect(mapStateToProps, null)(HreEvaluationResult);
