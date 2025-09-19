import React, { Component } from 'react';
import { View, RefreshControl } from 'react-native';
import VnrText from '../../../../../components/VnrText/VnrText';
import { SafeAreaView } from 'react-navigation';
import {
    Colors,
    styleSheets,
    styleSafeAreaView,
    styleViewTitleForGroup,
    styleScreenDetail,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { FlatList } from 'react-native-gesture-handler';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import { EnumName, EnumTask } from '../../../../../assets/constant';
import { getDataLocal } from '../../../../../factories/LocalData';
import { startTask } from '../../../../../factories/BackGroundTask';
import { connect } from 'react-redux';
import { EnumStatus } from '../../../../../assets/constant';
import VnrLoadingScreen from '../../../../../components/VnrLoading/VnrLoadingScreen';
import DrawerServices from '../../../../../utils/DrawerServices';

class UnEmploymentInsurance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataInsurance: {},
            isLoading: true,
            refreshing: false,
            keyQuery: EnumName.E_PRIMARY_DATA
        };
    }

    renderItemView = (item, index) => {
        const { dataInsurance } = this.state,
            { itemContent, styleViewTitleGroup, textLableGroup } = styleViewTitleForGroup,
            { textLableInfo } = styleScreenDetail;

        if (item['Name'] == 'E_Group') {
            return (
                <View style={styleViewTitleGroup} key={index}>
                    <VnrText style={[styleSheets.text, textLableGroup]} i18nKey={item['DisplayKey']} />
                </View>
            );
        } else {
            let _value = Vnr_Function.formatStringType(dataInsurance, item);
            return (
                <View style={itemContent} key={index}>
                    <View style={styleSheets.viewLable}>
                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={item['DisplayKey']} />
                    </View>
                    <View style={styleSheets.viewControl}>{_value}</View>
                </View>
            );
        }
    };

    remoteData = () => {
        const { keyQuery } = this.state;
        getDataLocal(EnumTask.KT_GeneralInfomation)
            .then(resData => {
                const res = resData && resData[keyQuery] ? resData[keyQuery] : null;

                if (res && res !== EnumName.E_EMPTYDATA) {
                    this.setState({
                        dataSource: { ...res[0] },
                        isLoading: false,
                        refreshing: false
                    });
                } else if (res === EnumName.E_EMPTYDATA) {
                    this.setState({
                        dataSource: null,
                        isLoading: false,
                        refreshing: false
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
                    keyTask: EnumTask.KT_GeneralInfomation,
                    payload: {
                        keyQuery: EnumName.E_PRIMARY_DATA,
                        reload: this.remoteData,
                        isCompare: true
                    }
                });
            }
        );
    };

    componentDidMount() {
        this.remoteData();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;
        if (nextProps.reloadScreenName == EnumTask.KT_GeneralInfomation) {
            //khi màn hình đang reload thì messsage phải là filter thì màn hình mới reload
            if (nextProps.message && keyQuery == nextProps.message.keyQuery) {
                if (nextProps.message.dataChange) {
                    this.remoteData({ isLazyLoading: true });
                } else {
                    this.setState({
                        isLoading: false,
                        refreshing: false
                    });
                }
            }
        }
    }

    render() {
        const { dataInsurance, isLoading } = this.state,
            configList = ConfigList.value,
            _configList = configList && configList['GeneralInfoInsurance'];

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
        } else if (dataInsurance == EnumName.E_EMPTYDATA || Object.keys(dataInsurance).length == 0) {
            contentList = <EmptyData messageEmptyData={'EmptyData'} />;
        } else if (
            dataInsurance &&
            Object.keys(dataInsurance).length > 0 &&
            (_configList && _configList['UnEmploymentInsurance'])
        ) {
            contentList = (
                <View style={CustomStyleSheet.flex(1)}>
                    <View style={styleScreenDetail.containerItemDetail}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={_configList['UnEmploymentInsurance']}
                            renderItem={({ item }) => Vnr_Function.formatStringTypeV2(dataInsurance, item, _configList['UnEmploymentInsurance'])}
                            keyExtractor={(item, index) => index}
                            refreshControl={
                                <RefreshControl
                                    onRefresh={() => this.pullToReFresh()}
                                    refreshing={false}
                                    size="large"
                                    tintColor={Colors.primary}
                                />
                            }
                        />
                    </View>
                </View>
            );
        }

        return <SafeAreaView {...styleSafeAreaView}>{contentList}</SafeAreaView>;
    }
}

const mapStateToProps = state => {
    return {
        //generalProfileInfo: state.generalProfileInfo.data,
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
)(UnEmploymentInsurance);
