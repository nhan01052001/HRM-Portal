import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Colors, Size, styleSheets, styleSafeAreaView, styleScreenDetail } from '../../../constants/styleConfig';
import { connect } from 'react-redux';
import generalProfileInfo from '../../../redux/generalProfileInfo';
import VnrIndeterminate from '../../../components/VnrLoading/VnrIndeterminate';
import { SafeAreaView } from 'react-navigation';
import VnrText from '../../../components/VnrText/VnrText';
import DrawerServices from '../../../utils/DrawerServices';
import { EnumName, EnumStatus, EnumTask } from '../../../assets/constant';
import { getDataLocal } from '../../../factories/LocalData';
import { startTask } from '../../../factories/BackGroundTask';
import EmptyData from '../../../components/EmptyData/EmptyData';
import VnrLoadingScreen from '../../../components/VnrLoading/VnrLoadingScreen';

class AppendixInfomation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: null,
            isLoading: true,
            isLoadingHeader: true,
            refreshing: false,
            keyQuery: EnumName.E_PRIMARY_DATA
        };
    }

    remoteData = (param = {}) => {
        const { keyQuery } = this.state,
            { isLazyLoading } = param;

        getDataLocal(EnumTask.KT_AppendixInfomation)
            .then(resData => {
                const res = resData && resData[keyQuery] ? resData[keyQuery] : null;
                if (res && res !== EnumName.E_EMPTYDATA) {
                    this.setState({
                        dataSource: res,
                        isLoading: false,
                        refreshing: false,
                        isLoadingHeader: isLazyLoading ? false : true
                    });
                } else if (res === EnumName.E_EMPTYDATA) {
                    this.setState({
                        dataSource: EnumName.E_EMPTYDATA,
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

    pullToReFresh = () => {
        this.setState(
            {
                refreshing: true,
                keyQuery: EnumName.E_PRIMARY_DATA
            },
            () => {
                startTask({
                    keyTask: EnumTask.KT_AppendixInfomation,
                    payload: {
                        keyQuery: EnumName.E_PRIMARY_DATA,
                        reload: this.remoteData,
                        isCompare: true
                    }
                });
            }
        );
    };

    _renderHeaderLoading = () => {
        return <VnrIndeterminate isVisible={this.state.isLoading == false && this.state.isLoadingHeader} />;
    };

    componentDidMount() {
        //this.reload();
        this.remoteData();
        startTask({
            keyTask: EnumTask.KT_AppendixInfomation,
            payload: {
                keyQuery: EnumName.E_PRIMARY_DATA,
                reload: this.reload,
                isCompare: true
            }
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;
        if (nextProps.reloadScreenName == EnumTask.KT_AppendixInfomation) {
            //khi màn hình đang reload thì messsage phải là filter thì màn hình mới reload
            if (nextProps.message && keyQuery == nextProps.message.keyQuery) {
                if (nextProps.message.dataChange) {
                    this.remoteData({ isLazyLoading: true });
                } else {
                    this.setState({
                        isLoadingHeader: false,
                        refreshing: false
                    });
                }
            }
        }
    }

    moveToDetail = dataItem => {
        DrawerServices.navigate('AppendixInfomationViewDetail', { dataItem: dataItem });
    };

    renderInfo = dataSource => {
        const { textLableInfo } = styleScreenDetail;
        if (dataSource && dataSource.listKey) {
            return (
                <View style={styles.container}>
                    {dataSource.listKey.map((key, index) => {
                        const dataFolder = dataSource.listValues[index];
                        return (
                            <View style={styles.styBlock} key={index}>
                                <View style={styles.styTopTitle}>
                                    <View style={styles.styWrap}>
                                        <VnrText
                                            style={[styleSheets.text, styles.styTitle]}
                                            value={key}
                                            numberOfLines={1}
                                        />
                                    </View>
                                </View>

                                {dataFolder.listFileName &&
                                    dataFolder.listFileName.map((itemName, index) => {
                                        const dataItem = {
                                            name: itemName,
                                            uriPDF: dataFolder.listPathFile[index]
                                        };
                                        return (
                                            <TouchableOpacity
                                                key={index}
                                                style={styles.styViewData}
                                                onPress={() => this.moveToDetail(dataItem)}
                                            >
                                                <View style={styles.styItemData}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={itemName}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    })}
                            </View>
                        );
                    })}
                </View>
            );
        } else {
            return <View />;
        }
    };

    render() {
        const { isLoading, dataSource, refreshing } = this.state;
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
        } else if (dataSource == EnumName.E_EMPTYDATA || Object.keys(dataSource).length == 0) {
            contentList = <EmptyData messageEmptyData={'EmptyData'} />;
        } else if (dataSource && Object.keys(dataSource).length > 0) {
            contentList = (
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            onRefresh={() => this.pullToReFresh()}
                            refreshing={refreshing}
                            size="large"
                            tintColor={Colors.primary}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                >
                    {this.renderInfo(dataSource)}
                </ScrollView>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: Size.defineSpace
    },
    styBlock: {
        width: Size.deviceWidth - Size.defineSpace * 2,
        paddingVertical: Size.defineHalfSpace
    },
    styTitle: {
        fontSize: Size.text + 2,
        fontWeight: 'bold',
        color: Colors.gray_10
    },
    styItemData: {
        width: '100%',
        paddingVertical: 12,
        justifyContent: 'center',
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5
    }
});

const mapStateToProps = state => {
    return {
        //generalProfileInfo: state.generalProfileInfo.data,
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchGeneralProfileInfo: () => {
            dispatch(generalProfileInfo.actions.fetchGeneralProfileInfo());
        },
        setProfileInfo: data => {
            dispatch(generalProfileInfo.actions.setGeneralProfileInfo(data));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppendixInfomation);
