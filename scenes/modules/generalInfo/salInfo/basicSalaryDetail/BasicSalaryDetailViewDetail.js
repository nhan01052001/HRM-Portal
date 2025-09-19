import React from 'react';
import { View, Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleSafeAreaView, CustomStyleSheet } from '../../../../../constants/styleConfig';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import { WebView } from 'react-native-webview';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import { ScreenName } from '../../../../../assets/constant';
import DrawerServices from '../../../../../utils/DrawerServices';
import TouchIDService from '../../../../../utils/TouchIDService';

export default class BasicSalaryDetailViewDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null
        };
        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            setTimeout(() => {
                if (
                    DrawerServices.getBeforeScreen() !== ScreenName.BasicSalaryDetail &&
                    DrawerServices.getBeforeScreen() !== ScreenName.BasicSalaryDetailViewDetail
                ) {
                    TouchIDService.checkConfirmPass(this.onFinish.bind(this));
                } else {
                    this.getDataItem();
                }
            }, 200);
        });
    }

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
    }

    onFinish = isSuccess => {
        if (isSuccess) this.getDataItem();
        else DrawerServices.goBack();
    };

    getDataItem = () => {
        try {
            const _params = this.props.navigation.state.params,
                { FileAttachment, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params);

            if (FileAttachment) {
                let linkFile = `${dataVnrStorage.apiConfig.uriPor}/${FileAttachment}`;
                this.setState({
                    dataItem: {
                        FileAttachment: linkFile
                    }
                });
            } else if (!Vnr_Function.CheckIsNullOrEmpty(dataItem)) {
                this.setState({ dataItem });
            } else {
                this.setState({ dataItem: 'EmptyData' });
            }
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    componentDidMount() {
        //this.getDataItem();
    }

    render() {
        const { dataItem } = this.state;
        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem) {
            let fileAttachment = dataItem.FileAttachment ? dataItem.FileAttachment : null;

            let urlFilePDF = fileAttachment,
                INJECTED_JAVASCRIPT = '';

            if (Platform.OS == 'android') {
                try {
                    urlFilePDF = encodeURI(urlFilePDF);
                } catch (error) {
                    urlFilePDF = urlFilePDF.split(' ').join('%20');
                }

                urlFilePDF = `https://docs.google.com/gview?embedded=true&url=${urlFilePDF}?v=${new Date().getTime()}`;
                INJECTED_JAVASCRIPT = `(function() {
                        if(document.getElementsByClassName('ndfHFb-c4YZDc-GSQQnc-LgbsSe ndfHFb-c4YZDc-to915-LgbsSe VIpgJd-TzA9Ye-eEGnhe ndfHFb-c4YZDc-LgbsSe') &&
                        document.getElementsByClassName('ndfHFb-c4YZDc-GSQQnc-LgbsSe ndfHFb-c4YZDc-to915-LgbsSe VIpgJd-TzA9Ye-eEGnhe ndfHFb-c4YZDc-LgbsSe')[0]
                        ){
                            document.getElementsByClassName('ndfHFb-c4YZDc-GSQQnc-LgbsSe ndfHFb-c4YZDc-to915-LgbsSe VIpgJd-TzA9Ye-eEGnhe ndfHFb-c4YZDc-LgbsSe')[0].style.display='none';
                        }
                      })();`;
            }

            contentViewDetail = (
                <WebView
                    key={new Date().getDate()}
                    cacheEnabled={false}
                    style={CustomStyleSheet.flex(1)}
                    source={{ uri: urlFilePDF }}
                    scalesPageToFit={Platform.OS === 'android' ? false : true}
                    javaScriptEnabled={true}
                    injectedJavaScript={INJECTED_JAVASCRIPT}
                    startInLoadingState={true}
                    scrollEnabled={true}
                    renderLoading={() => (
                        // eslint-disable-next-line react-native/no-inline-styles
                        <View style={{ alignSelf: 'center' }}>
                            <VnrLoading size={'large'} />
                        </View>
                    )}
                />
            );
        } else if (dataItem == 'EmptyData') {
            contentViewDetail = <EmptyData messageEmptyData={'EmptyData'} />;
        }
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container]}>{contentViewDetail}</View>
            </SafeAreaView>
        );
    }
}
