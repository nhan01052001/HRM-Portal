import React from 'react';
import { View } from 'react-native';
import { CustomStyleSheet, Size, stylesScreenDetailV3 } from '../../../../../constants/styleConfig';
import VnrIndeterminate from '../../../../../components/VnrLoading/VnrIndeterminate';
import VnrLoadingScreen from '../../../../../components/VnrLoading/VnrLoadingScreen';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import DrawerServices from '../../../../../utils/DrawerServices';
import { EnumName, EnumStatus } from '../../../../../assets/constant';
import { getDataLocal } from '../../../../../factories/LocalData';
import { ConfigListFilter } from '../../../../../assets/configProject/ConfigListFilter';
import { WebView } from 'react-native-webview';

export default class HrePersonalManageList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false, //biến hiển thị loading pull to refresh
            isLoading: true, // biến hiển thị loading dữ liệu cho danh sách
            dataSource: [],
            htmlResource: null,
            configChart: null,
            configColor: null
        };
        this.isHaveFilter = props.detail && props.detail.screenName && ConfigListFilter.value[props.detail.screenName];
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.isRefreshList != this.props.isRefreshList) {
            this.refresh(nextProps);
        }

        if (nextProps.isLazyLoading !== this.props.isLazyLoading) {
            this.lazyLoading(nextProps);
        }
    }

    remoteData = (param = {}) => {
        const { isLazyLoading } = param,
            { keyDataLocal, keyQuery } = this.props;
        if (keyDataLocal) {
            getDataLocal(keyDataLocal)
                .then((resData) => {
                    let resAll = resData && resData[keyQuery] ? resData[keyQuery] : null;
                    if (resAll && resAll !== EnumName.E_EMPTYDATA) {
                        const [htmlSource, data, config] = resAll;
                        let _configChart = config?.Data.SectionHidden;

                        if (htmlSource && data.Data && config.Data)
                            this.setState({
                                htmlResource: htmlSource,
                                configChart: _configChart,
                                dataSource: data.Data,
                                isLoading: false,
                                refreshing: false,
                                isLoadingHeader: isLazyLoading ? false : true
                            });
                        else
                            this.setState({
                                htmlResource: null,
                                configChart: null,
                                dataSource: EnumName.E_EMPTYDATA,
                                isLoading: false,
                                refreshing: false,
                                isLoadingHeader: isLazyLoading ? false : true
                            });
                    } else if (resAll === EnumName.E_EMPTYDATA) {
                        this.setState({
                            dataSource: EnumName.E_EMPTYDATA,
                            isLoading: false,
                            refreshing: false,
                            isLoadingHeader: isLazyLoading ? false : true
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

    componentDidMount() {
        // Cho đợi dữ liệu từ server k lấy từ local nữa...
        //this.remoteData();
    }

    refresh = () => {
        this.setState({ isLoading: true, page: 1 });
    };

    lazyLoading = (nexProps) => {
        // các trường hợp (pulltoRefresh, Màn hình) thì kiểm tra dữ liệu dữ liệu mới và củ có khác nhau hay không
        // paging,filter luôn thay đổi
        // dataChange (dùng để kiểm tra dữ liệu mới và củ  có khác nhau hay không )
        // dataChange == true ? khác : giống nhau
        if (!nexProps.dataChange) {
            this.setState({
                isLoadingHeader: false,
                refreshing: false,
                isLoading: false
            });
        } else {
            this.remoteData({ isLazyLoading: true });
        }
    };

    _renderHeaderLoading = () => {
        if (this.state.refreshing || this.state.isLoadingHeader) {
            return (
                <View style={{ width: Size.deviceWidth }}>
                    <VnrIndeterminate isVisible={this.state.refreshing || this.state.isLoadingHeader} />
                </View>
            );
        }
    };

    render() {
        const { dataSource, isLoading, htmlResource, configChart } = this.state,
            { keyDataLocal } = this.state;

        const { listFilterID } = this.props;
        let contentList = <View />,
            typeLoading = EnumStatus.E_APPROVE;
        if (isLoading) {
            contentList = (
                <VnrLoadingScreen
                    size="large"
                    screenName={this.props.detail ? this.props.detail.screenName : null}
                    isVisible={isLoading}
                    type={typeLoading}
                />
            );
        } else if (dataSource == EnumName.E_EMPTYDATA || dataSource.length == 0) {
            contentList = <EmptyData messageEmptyData={'EmptyData'} />;
        } else if (dataSource && dataSource.length > 0 && htmlResource) {
            const INJECTED_JAVASCRIPT = `
            ( function () {
                initControl(${JSON.stringify(configChart)});
                setModelData(${JSON.stringify(dataSource)});
                filterEmployFun(${JSON.stringify(listFilterID)})
            })();
            `;

            contentList = (
                <WebView
                    ref={(ref) => (this.refWeb = ref)}
                    key={keyDataLocal}
                    style={CustomStyleSheet.flex(1)}
                    cacheEnabled={false}
                    setDisplayZoomControls={true} // android only
                    source={{
                        html: htmlResource
                    }}
                    //scalesPageToFit={Platform.OS === 'android' ? false : true}
                    //incognito={true}
                    startInLoadingState={true}
                    //javaScriptEnabled={true}
                    injectedJavaScript={INJECTED_JAVASCRIPT}
                    scrollEnabled={true}
                    onLoadEnd={() => {
                        // update component to be aware of loading status
                        // if (!nativeEvent.title) {
                        //     //this.reload()
                        // }
                    }}
                    renderLoading={() => (
                        // eslint-disable-next-line react-native/no-inline-styles
                        <View style={{ alignSelf: 'center' }}>
                            <VnrLoadingScreen size="large" isVisible={true} type={typeLoading} />
                        </View>
                    )}
                    onError={() => {}}
                    // onMessage={this.onMessage}
                    onLoad={() => {}}
                />
            );
        }

        return (
            <View
                style={[
                    styles.containerGrey,
                    this.isHaveFilter ? CustomStyleSheet.paddingTop(80) : CustomStyleSheet.paddingTop(0)
                ]}
            >
                {this._renderHeaderLoading()}
                {contentList}
            </View>
        );
    }
}

const styles = stylesScreenDetailV3;
