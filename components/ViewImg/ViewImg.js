import React from 'react';
import { View, TouchableOpacity, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Colors, styleViewImg, Size, CustomStyleSheet } from '../../constants/styleConfig';
import Vnr_Function from '../../utils/Vnr_Function';
import { IconCancel } from '../../constants/Icons';
import VnrText from '../VnrText/VnrText';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Video from 'react-native-video';
export default class ViewImg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalImg: {
                visible: false,
                link: null
            },
            isPaused: false
        };
    }

    showImg = () => {
        const { format } = this.props;
        let { source } = this.props;
        const { modalImg } = this.state;
        modalImg.visible = true;
        if (!Vnr_Function.CheckIsNullOrEmpty(format)) {
            if (format == 'base64') {
                source = `data:image/png;base64,${source}`;
            }
        }
        modalImg.link = source;
        this.setState({ modalImg });
    };

    closeImg = () => {
        const { modalImg } = this.state;
        modalImg.visible = false;
        this.setState({ modalImg });
    };

    render() {
        const { bntGoBack, ViewImg, styleImg, viewGoBack } = styleViewImg;
        const { modalImg, isPaused } = this.state,
            { showChildren, children, type } = this.props;

        return (
            <View style={CustomStyleSheet.flex(1)}>
                <TouchableWithoutFeedback onPress={() => this.showImg()}>
                    <View style={CustomStyleSheet.flex(1)}>{showChildren ? children : <VnrText i18nKey={'Image'} />}</View>
                </TouchableWithoutFeedback>
                <Modal
                    visible={modalImg.visible}
                    animationType="none"
                    transparent={false}
                    onRequestClose={this.closeModal}
                >
                    <View style={ViewImg}>
                        {type === 'img' ? (
                            <Image
                                backgroundColor={Colors.black}
                                resizeMode="contain"
                                style={styleImg}
                                source={{
                                    uri: modalImg.link
                                }}
                            />
                        ) : (
                            <Video
                                source={{ uri: modalImg.link }}
                                resizeMode="contain"
                                paused={isPaused}
                                controls={true}
                                style={[styleImg, { backgroundColor: Colors.black }]}
                                muted={true}
                            />
                        )}
                        <View style={viewGoBack}>
                            <SafeAreaView>
                                <TouchableOpacity style={bntGoBack} onPress={() => this.closeImg()}>
                                    <IconCancel size={Size.iconSizeHeader} color={Colors.white} />
                                </TouchableOpacity>
                            </SafeAreaView>
                        </View>
                    </View>
                </Modal>
            </View>
            //
        );
    }
}
