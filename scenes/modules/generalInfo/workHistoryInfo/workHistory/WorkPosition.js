import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import VnrText from '../../../../../components/VnrText/VnrText';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    styleProfileInfo,
    styleSafeAreaView,
    styleScreenDetail,
    stylesScreenDetailV2,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import format from 'number-format.js';
import moment from 'moment';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { EnumName, EnumStatus, EnumTask } from '../../../../../assets/constant';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import { getDataLocal } from '../../../../../factories/LocalData';
import VnrIndeterminate from '../../../../../components/VnrLoading/VnrIndeterminate';
import { startTask } from '../../../../../factories/BackGroundTask';
import { connect } from 'react-redux';
import VnrLoadingScreen from '../../../../../components/VnrLoading/VnrLoadingScreen';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import DrawerServices from '../../../../../utils/DrawerServices';

class WorkPosition extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataInfoWorkHistory: {},
            isLoading: true,
            isLoadingHeader: true,
            refreshing: false,
            keyQuery: EnumName.E_PRIMARY_DATA
        };
    }

    renderItemView = (item, index) => {
        const { dataInfoWorkHistory } = this.state,
            { styleViewTitleGroup, textLableGroup } = styleProfileInfo,
            stylesDetailV2 = stylesScreenDetailV2;

        if (item['Name'] == 'E_Group') {
            return (
                <View style={styleViewTitleGroup} key={index}>
                    <VnrText style={[styleSheets.text, textLableGroup]} i18nKey={item['DisplayKey']} />
                </View>
            );
        } else {
            let _field = item['Name'],
                _value = dataInfoWorkHistory[_field];

            if (_value) {
                if (item['DataType'] && item['DataType'] !== '' && item['DataType'].toLowerCase() === 'datetime') {
                    let _format = item['DataFormat'];
                    _value = moment(_value).format(_format);
                } else if (item['DataType'] && item['DataType'] !== '' && item['DataType'].toLowerCase() === 'double') {
                    let _format = item['DataFormat'];
                    _value = format(_format, _value);
                }
            } else {
                _value = '';
            }
            return (
                <View style={stylesDetailV2.containerItemDetail}>
                    <View style={stylesDetailV2.styItemContent}>
                        <View style={stylesDetailV2.viewLable}>
                            <VnrText
                                style={[styleSheets.lable, stylesDetailV2.styTextLableInfo]}
                                i18nKey={item['DisplayKey']}
                            />
                        </View>
                        <View style={stylesDetailV2.styViewValue}>
                            <VnrText style={[styleSheets.text, stylesDetailV2.styTextValueInfo]} value={_value} />
                        </View>
                    </View>
                </View>

            // <View style={itemContent} key={index}>
            //     <View style={styleSheets.viewLable} >
            //         <VnrText style={[styleSheets.text, textLableInfo]}
            //             i18nKey={item["DisplayKey"]} />
            //     </View>
            //     <View style={styleSheets.viewControl}>
            //         <VnrText style={[styleSheets.text, textValueInfo]}
            //             value={_value} />
            //     </View>
            // </View>
            );
        }
    };

    remoteData = (param = {}) => {
        const { keyQuery } = this.state,
            { isLazyLoading } = param;
        getDataLocal(EnumTask.KT_WorkPosition)
            .then(resData => {
                const res = resData && resData[keyQuery] ? resData[keyQuery] : null;

                if (res && res !== EnumName.E_EMPTYDATA) {
                    //console.log(res, 'res')
                    // const data = {
                    //     profile: { ...res[0] },
                    //     dataWaitingApprove: [...res[1]]
                    // }

                    //this.props.setProfileInfo(data);

                    this.setState({
                        dataInfoWorkHistory: res,
                        isLoading: false,
                        refreshing: false,
                        isLoadingHeader: isLazyLoading ? false : true
                    });
                } else if (res === EnumName.E_EMPTYDATA) {
                    this.setState({
                        dataInfoWorkHistory: EnumName.E_EMPTYDATA,
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
        if (nextProps.reloadScreenName == EnumTask.KT_WorkPosition) {
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
        //this.pullToReFresh();
    }

    reload = () => {
        this.setState({ isLoading: true });
        this.remoteData();
        startTask({
            keyTask: EnumTask.KT_WorkPosition,
            payload: {
                keyQuery: EnumName.E_PRIMARY_DATA,
                reload: this.reload,
                isCompare: true
            }
        });
        // this.pullToReFresh();
    };

    pullToReFresh = () => {
        this.setState({
            refreshing: true
        });

        startTask({
            keyTask: EnumTask.KT_WorkPosition,
            payload: {
                keyQuery: EnumName.E_PRIMARY_DATA,
                reload: this.reload,
                isCompare: true
            }
        });
        // let { dataInfoWorkHistory } = this.state;
        // HttpService.Post(`[URI_HR]/Por_GetData/NewPortal_GetProfile`, null, null, this.reload)
        //     .then(res1 => {
        //         if (res1 && Object.keys(res1).length > 0) {
        //             dataInfoWorkHistory = res1;
        //         }
        //         this.setState({ dataInfoWorkHistory, isLoading: false });
        //     })
        //     .catch(e => this.setState({ dataInfoWorkHistory: EnumName.E_EMPTYDATA, isLoading: false }))
    };

    _renderHeaderLoading = () => {
        return <VnrIndeterminate isVisible={this.state.isLoading == false && this.state.isLoadingHeader} />;
    };

    render() {
        const { dataInfoWorkHistory, isLoading } = this.state,
            configList = ConfigList.value,
            { containerItemDetail } = styleScreenDetail,
            _configGeneralInfoWorkHistory = configList && configList['GeneralInfoWorkHistory'];

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
        } else if (dataInfoWorkHistory == EnumName.E_EMPTYDATA || Object.keys(dataInfoWorkHistory).length == 0) {
            contentList = <EmptyData messageEmptyData={'EmptyData'} />;
        } else if (
            dataInfoWorkHistory &&
            Object.keys(dataInfoWorkHistory).length > 0 &&
            _configGeneralInfoWorkHistory &&
            typeof dataInfoWorkHistory === 'object'
        ) {
            contentList = (
                <View style={CustomStyleSheet.flex(1)}>
                    <ScrollView>
                        <View style={containerItemDetail}>
                            {_configGeneralInfoWorkHistory.map(e =>
                                Vnr_Function.formatStringTypeV2(dataInfoWorkHistory, e)
                            )}
                        </View>
                    </ScrollView>
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
)(WorkPosition);
