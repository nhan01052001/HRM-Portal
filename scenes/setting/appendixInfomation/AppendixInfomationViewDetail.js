/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Colors, styleSafeAreaView } from '../../../constants/styleConfig';
import { WebView } from 'react-native-webview';
import VnrLoading from '../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../components/EmptyData/EmptyData';
import Vnr_Function from '../../../utils/Vnr_Function';

export default class AppendixInfomationViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uriPDF: '',
            visible: true,
            id: ''
        };
        props.navigation.setParams({
            title:
                props.navigation.state.params && props.navigation.state.params.dataItem
                    ? props.navigation.state.params.dataItem.name
                    : ''
        });
    }

    componentDidMount() {
        const _params = this.props.navigation.state.params,
            { dataItem } = _params,
            { uriPDF } = dataItem ? dataItem : {};

        if (uriPDF) {
            let newId = Vnr_Function.MakeId(12);
            this.setState({ uriPDF: uriPDF, id: newId });
        } else {
            this.setState({ uriPDF: 'EmptyData' });
        }
    }

    reload = () => {
        let newId = Vnr_Function.MakeId(12);
        this.setState({
            id: newId
        });
    };

    render() {
        const { uriPDF, id } = this.state;
        let contentViewDetail = <VnrLoading size={'large'} />;
        if (uriPDF) {
            let urlFilePDF = uriPDF,
                INJECTED_JAVASCRIPT = '';

            try {
                urlFilePDF = encodeURI(uriPDF);
            } catch (error) {
                urlFilePDF = uriPDF.split(' ').join('%20');
            }

            urlFilePDF = `https://docs.google.com/gview?embedded=true&url=${urlFilePDF}?v=${new Date().getTime()}`;
            INJECTED_JAVASCRIPT = `(function() {
                            if(document.getElementsByClassName('ndfHFb-c4YZDc-GSQQnc-LgbsSe ndfHFb-c4YZDc-to915-LgbsSe VIpgJd-TzA9Ye-eEGnhe ndfHFb-c4YZDc-LgbsSe') && 
                            document.getElementsByClassName('ndfHFb-c4YZDc-GSQQnc-LgbsSe ndfHFb-c4YZDc-to915-LgbsSe VIpgJd-TzA9Ye-eEGnhe ndfHFb-c4YZDc-LgbsSe')[0] 
                            ){
                                document.getElementsByClassName('ndfHFb-c4YZDc-GSQQnc-LgbsSe ndfHFb-c4YZDc-to915-LgbsSe VIpgJd-TzA9Ye-eEGnhe ndfHFb-c4YZDc-LgbsSe')[0].style.display='none';
                            }
                          })();`;

            contentViewDetail = (
                <View style={{ flex: 1, backgroundColor: Colors.white }}>
                    <WebView
                        ref={ref => (this.refWeb = ref)}
                        key={id}
                        style={{ flex: 1 }}
                        cacheEnabled={false}
                        source={{
                            uri: urlFilePDF
                        }}
                        scalesPageToFit={Platform.OS === 'android' ? false : true}
                        incognito={true}
                        startInLoadingState={true}
                        javaScriptEnabled={true}
                        injectedJavaScript={INJECTED_JAVASCRIPT}
                        scrollEnabled={true}
                        onLoadEnd={syntheticEvent => {
                            // update component to be aware of loading status
                            const { nativeEvent } = syntheticEvent;
                            if (!nativeEvent.title) {
                                this.reload();
                            }
                        }}
                        renderLoading={() => (
                            <View style={{ alignSelf: 'center' }}>
                                <VnrLoading size={'large'} />
                            </View>
                        )}
                        onLoad={() => {}}
                    />
                </View>
            );
        } else if (uriPDF == 'EmptyData') {
            contentViewDetail = <EmptyData messageEmptyData={'EmptyData'} />;
        }

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={{ flex: 1 }}>{contentViewDetail}</View>
            </SafeAreaView>
        );
    }
}
