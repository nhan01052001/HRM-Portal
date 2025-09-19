import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { CustomStyleSheet, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import WorkHistoryList from './WorkHistoryList';
import { ScreenName, EnumName, EnumTask, EnumStatus } from '../../../../../assets/constant';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import { connect } from 'react-redux';
import { startTask } from '../../../../../factories/BackGroundTask';
import { getDataLocal } from '../../../../../factories/LocalData';
import VnrIndeterminate from '../../../../../components/VnrLoading/VnrIndeterminate';
import DrawerServices from '../../../../../utils/DrawerServices';
import VnrLoadingScreen from '../../../../../components/VnrLoading/VnrLoadingScreen';

class WorkHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataListWorkHistory: [],
            isLoading: true,
            isLoadingHeader: true,
            keyQuery: EnumName.E_PRIMARY_DATA
        };
    }

    remoteData = (param = {}) => {
        const { keyQuery } = this.state,
            { isLazyLoading } = param;
        getDataLocal(EnumTask.KT_WorkHistory)
            .then(resData => {
                const res = resData && resData[keyQuery] ? resData[keyQuery] : null;

                if (res && res !== EnumName.E_EMPTYDATA) {
                    this.setState({
                        dataListWorkHistory: res,
                        isLoading: false,
                        refreshing: false,
                        isLoadingHeader: isLazyLoading ? false : true
                    });
                } else if (res === EnumName.E_EMPTYDATA) {
                    this.setState({
                        dataListWorkHistory: EnumName.E_EMPTYDATA,
                        isLoading: false,
                        refreshing: false,
                        isLoadingHeader: isLazyLoading ? false : true
                    });
                }
            })
            .catch(error => {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            });
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;

        if (nextProps.reloadScreenName == EnumTask.KT_WorkHistory) {
            //khi màn hình đang reload thì messsage phải là filter thì màn hình mới reload
            if (nextProps.message && keyQuery == nextProps.message.keyQuery) {
                if (nextProps.message.dataChange) {
                    this.remoteData({ isLazyLoading: true });
                } else {
                    this.setState({
                        isLoadingHeader: false,
                        isLoading: false,
                        refreshing: false
                    });
                }
            }
        }
    }

    componentDidMount() {
        this.reload();
    }

    reload = () => {
        this.setState({ isLoading: true });
        this.remoteData();
        startTask({
            keyTask: EnumTask.KT_WorkHistory,
            payload: {
                keyQuery: EnumName.E_PRIMARY_DATA,
                reload: this.reload,
                isCompare: true
            }
        });
    };

    pullToRefresh = () => {
        startTask({
            keyTask: EnumTask.KT_WorkHistory,
            payload: {
                keyQuery: EnumName.E_PRIMARY_DATA,
                reload: this.reload,
                isCompare: true
            }
        });
    };

    _renderHeaderLoading = () => {
        return <VnrIndeterminate isVisible={this.state.isLoading == false && this.state.isLoadingHeader} />;
    };

    render() {
        const { dataListWorkHistory, isLoading } = this.state,
            configList = ConfigList.value,
            _configGeneralInfoListWorkHistory = configList && configList['GeneralInfoListWorkHistory'];

        let contentList = <View />;
        if (isLoading) {
            let typeLoading = EnumStatus.E_SUBMIT;
            contentList = (
                <VnrLoadingScreen
                    size="large"
                    screenName={this.props.detail ? this.props.detail.screenName : null}
                    isVisible={isLoading}
                    type={typeLoading}
                />
            );
        } else if (dataListWorkHistory == EnumName.E_EMPTYDATA || dataListWorkHistory.length == 0) {
            contentList = <EmptyData messageEmptyData={'EmptyData'} />;
        } else if (dataListWorkHistory && Array.isArray(dataListWorkHistory) && dataListWorkHistory.length > 0) {
            contentList = (
                <View style={CustomStyleSheet.flex(1)}>
                    <WorkHistoryList
                        detail={{
                            dataLocal: false,
                            screenDetail: ScreenName.WorkHistoryViewDetail,
                            screenName: ScreenName.GeneralInfoListWorkHistory
                        }}
                        dataLocal={dataListWorkHistory}
                        valueField="ID"
                        renderConfig={_configGeneralInfoListWorkHistory.Row}
                        pullToRefresh={this.pullToRefresh}
                    />
                </View>
            );
        }
        return (
            <SafeAreaView {...styleSafeAreaView}>
                {this._renderHeaderLoading()}
                {contentList}
            </SafeAreaView>
        );
    }
}

const mapStateToProps = state => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

const mapDispatchToProps = () => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WorkHistory);
