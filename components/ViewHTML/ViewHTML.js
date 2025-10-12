
import React from 'react';
import { View, TouchableOpacity, Modal, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Colors, Size, CustomStyleSheet, styleSheets } from '../../constants/styleConfig';
import { IconCancel } from '../../constants/Icons';
import VnrText from '../VnrText/VnrText';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import WebView from 'react-native-webview';
export default class ViewHTML extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalHTML: {
                visible: false,
                source: null,
                lable : null
            },
            isPaused: false
        };
    }

    show = () => {
        let { source, lable } = this.props;
        const { modalHTML } = this.state;
        modalHTML.visible = true;
        modalHTML.source = source;
        modalHTML.source = source;
        modalHTML.lable = lable;
        this.setState({ modalHTML });
    };

    close = () => {
        const { modalHTML } = this.state;
        modalHTML.visible = false;
        this.setState({ modalHTML });
    };

    render() {
        const { modalHTML } = this.state,
            { children } = this.props;

        return (
            <View>
                <TouchableWithoutFeedback onPress={() => this.show()}>
                    {children ? children : null}
                </TouchableWithoutFeedback>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={modalHTML.visible} //isShowModal
                    style={{ ...CustomStyleSheet.padding(0), ...CustomStyleSheet.margin(0) }}
                >
                    <SafeAreaView style={styles.wrapInsideModal}>
                        <View style={styles.flRowSpaceBetween}>
                            <VnrText
                                style={[
                                    styleSheets.lable,
                                    styles.styHeaderText
                                    // CustomStyleSheet.fontWeight('700')
                                ]}
                                i18nKey={modalHTML.lable ? modalHTML.lable : ''}
                            />
                            <TouchableOpacity onPress={() => this.close()}>
                                <IconCancel size={Size.iconSize} color={Colors.gray_8} />
                            </TouchableOpacity>
                        </View>


                        <View style={styles.wrapModalAdd}>
                            <WebView
                                // ref={(ref) => (this.refWeb = ref)}
                                style={CustomStyleSheet.flex(1)}
                                cacheEnabled={false}
                                setDisplayZoomControls={false} // android only
                                source={{
                                    html: modalHTML.source
                                }}
                                scalesPageToFit={ false}
                                //incognito={true}
                                //javaScriptEnabled={true}
                                scrollEnabled={true}
                            />
                        </View>
                    </SafeAreaView>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapInsideModal: {
        flex: 1,
        backgroundColor: Colors.gray_2,
        borderRadius: 8
    },
    flRowSpaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: Size.defineSpace,
        paddingVertical: Size.defineHalfSpace
    },
    styHeaderText: {
        fontSize: Size.text,
        fontWeight: Platform.OS === 'android' ? '700' : '500'
    },
    wrapModalAdd :{
        flex :1
    }
})