import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSafeAreaView,
    Size,
    Colors,
    styleContentFilterDesign,
    CustomStyleSheet
} from '../../../../constants/styleConfig';
import VnrLoading from '../../../../components/VnrLoading/VnrLoading';
import NewsListSlider from './NewsListSlider/NewsListSlider';
import { ScreenName, EnumName, EnumTask } from '../../../../assets/constant';
import VnrFilterCommon from '../../../../components/VnrFilter/VnrFilterCommon';
import EmptyData from '../../../../components/EmptyData/EmptyData';
import VnrIndeterminate from '../../../../components/VnrLoading/VnrIndeterminate';
import { getDataLocal } from '../../../../factories/LocalData';
import { startTask } from '../../../../factories/BackGroundTask';
import { connect } from 'react-redux';

class NewsSlider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            refreshSlider: false,
            dataBody: null,
            dataSource: null,
            isLoading: true,
            isLoadingHeader: true,
            keyQuery: EnumName.E_PRIMARY_DATA,
            refreshing: false
        };

        this.paramsFilter = null;
        this.storeParamsDefault = null;
    }

    checkDataFormNotify = () => {
        const { params = {} } = this.props.navigation.state,
            { dataId } = typeof params == 'object' ? params : JSON.parse(params);
        return dataId ? dataId : null;
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
            refreshSlider: !this.state.refreshSlider, // reload lại ds.
            dataBody: {
                ..._paramsDefault.dataBody,
                ...paramsFilter
            }
        };
        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: EnumTask.KT_NewsSlider,
                payload: {
                    ...dataBody,
                    keyQuery: keyQuery,
                    isCompare: false,
                    reload: this.reload
                }
            });
        });
    };

    getDataGeneral = (isLazyLoading) => {
        const { keyQuery, refreshSlider } = this.state;

        getDataLocal(EnumTask.KT_NewsSlider).then((resData) => {
            const res = resData && resData[keyQuery] ? resData[keyQuery] : null;
            let data = res;

            if (data && data !== EnumName.E_EMPTYDATA && data.length > 0) {
                this.setState({
                    dataSource: data,
                    refreshSlider: !refreshSlider,
                    isLoading: false,
                    isLoadingHeader: isLazyLoading ? false : true,
                    refreshing: false
                });
            } else {
                this.setState({
                    dataSource: EnumName.E_EMPTYDATA,
                    refreshSlider: !refreshSlider,
                    isLoading: false,
                    isLoadingHeader: isLazyLoading ? false : true,
                    refreshing: false
                });
            }
        });
    };

    _renderHeaderLoading = () => {
        return <VnrIndeterminate isVisible={this.state.isLoadingHeader} />;
    };

    pullToRefresh = () => {
        const { dataBody, keyQuery } = this.state;
        this.setState(
            {
                keyQuery: keyQuery == EnumName.E_FILTER ? keyQuery : EnumName.E_PRIMARY_DATA
            },
            () => {
                startTask({
                    keyTask: EnumTask.KT_NewsSlider,
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

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;

        if (nextProps.reloadScreenName == EnumTask.KT_NewsSlider) {
            //khi màn hình đang reload thì messsage phải là filter thì màn hình mới reload
            if (keyQuery === EnumName.E_FILTER && nextProps.message && keyQuery == nextProps.message.keyQuery) {
                this.getDataGeneral(true);
            } else if (nextProps.message && keyQuery == nextProps.message.keyQuery) {
                // dataChange == true ? khác : giống nhau
                if (!nextProps.message.dataChange) {
                    this.setState({
                        isLoadingHeader: false
                    });
                } else {
                    this.getDataGeneral(true);
                }
            }
        }
    }

    paramsDefault = () => {
        let _params = {
            NotificationID: this.checkDataFormNotify()
        };

        return {
            dataBody: _params,
            keyQuery: EnumName.E_PRIMARY_DATA
        };
    };

    componentDidMount() {
        this.getDataGeneral();
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;

        startTask({
            keyTask: EnumTask.KT_NewsSlider,
            payload: {
                ..._paramsDefault.dataBody,
                keyQuery: EnumName.E_PRIMARY_DATA,
                isCompare: true,
                reload: this.reload
            }
        });
    }

    render() {
        const { dataSource, refreshSlider, dataBody } = this.state;

        let viewContent = <VnrLoading size={'large'} />;
        if (dataSource == EnumName.E_EMPTYDATA) {
            viewContent = <EmptyData messageEmptyData={'EmptyData'} />;
        } else if (dataSource != null) {
            viewContent = (
                <NewsListSlider
                    refreshSlider={refreshSlider}
                    data={dataSource}
                    imageKey={'FilePath'}
                    local={false}
                    width={Size.deviceWidth}
                    // height={Size.deviceheight * 0.7}
                    separator={0}
                    loop={false}
                    autoscroll={false}
                    currentIndexCallback={() => {}}
                    onPress={() => {}}
                    indicator
                    animation
                    indicatorActiveColor={Colors.primary}
                    indicatorInActiveColor={Colors.gray_5}
                />
            );
        }

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <VnrFilterCommon
                    dataBody={dataBody}
                    style={styleContentFilterDesign}
                    screenName={ScreenName.NewsSlider}
                    onSubmitEditing={this.reload}
                />
                {this._renderHeaderLoading()}
                <View style={CustomStyleSheet.flex(1)}>{viewContent}</View>
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

export default connect(mapStateToProps, null)(NewsSlider);
