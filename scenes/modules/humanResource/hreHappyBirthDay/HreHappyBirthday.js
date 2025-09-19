/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, CustomStyleSheet, Size, styleSheets } from '../../../../constants/styleConfig';
import DrawerServices from '../../../../utils/DrawerServices';
import HttpService from '../../../../utils/HttpService';
import { WebView } from 'react-native-webview';
import { IconCancel } from '../../../../constants/Icons';

const backgroundImage = '[URI_POR]/Content/images/icons/HappyBirthDay.gif';
export default class HreHappyBirthday extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uri: null,
            countdown: 2
        };

        this.interval = null;
    }

    componentDidMount() {
        this.startCountdown();
        this.setState({ uri: `${HttpService.handelUrl(backgroundImage)}?v=${new Date().getTime()}` });
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    startCountdown = () => {
        this.interval = setInterval(() => {
            const { countdown } = this.state;
            if (countdown > 0) {
                this.setState({ countdown: countdown - 1 });
            } else {
                clearInterval(this.interval);
            }
        }, 1000);
    };

    render() {
        const width = Size.deviceWidth;
        const height = Size.deviceheight;
        const { uri, countdown } = this.state;

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: fill;
                    position: absolute;
                    left: 0;
                    top:0
                }
                </style>
            </head>
            <body>
                <img src="${uri}" alt="Paris" width="${width}" height="${height}">
            </body>
            </html>
        `;

        return (
            <SafeAreaView style={CustomStyleSheet.flex(1)}>
                <TouchableWithoutFeedback
                    onPress={() => {
                        countdown < 1 && DrawerServices.goBack();
                    }}
                >
                    <View style={styles.container}>
                        <View
                            style={{
                                width,
                                height,
                                overflow: 'hidden'
                            }}
                        >
                            <WebView
                                source={{ html: html }}
                                style={{
                                    flex: 1,
                                    width,
                                    height
                                }}
                            />
                        </View>

                        <View style={styles.styViewClose}>
                            {countdown > 0 ? (
                                <Text style={[styleSheets.text, styles.styViewCloseTxt]}>{countdown}</Text>
                            ) : (
                                <IconCancel size={Size.iconSize} color={Colors.white} />
                            )}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    styViewClose: {
        position: 'absolute',
        top: Size.defineSpace,
        right: Size.defineSpace,
        height: 30,
        width: 30,
        borderRadius: 15,
        backgroundColor: Colors.black,
        justifyContent: 'center',
        alignItems: 'center'
    },
    styViewCloseTxt: {
        color: Colors.white,
        fontSize: Size.text + 1
    }
});
