import React from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Colors, CustomStyleSheet, styleViewMap } from '../../constants/styleConfig';
import Map from './Map';
import VnrText from '../VnrText/VnrText';
import ViewShot from 'react-native-view-shot';

export default class ViewMapTouchConfirm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowModalMap: this.props.isShowTouchConfirm
        };
    }
    onRefresh = () => {
        this.setState({ isShowModalMap: !this.state.isShowModalMap });
    };

    // eslint-disable-next-line react/no-deprecated
    componentWillReceiveProps(nextProps) {
        if (nextProps.isShowTouchConfirm !== this.props.isShowTouchConfirm) {
            this.onRefresh(nextProps.isShowTouchConfirm);
        }
    }

    onSaveTouch = () => {
        // eslint-disable-next-line react/no-string-refs
        this.viewShot.capture().then(uri => {
            const title = uri
                .split('/')
                .pop()
                .split('#')[0]
                .split('?')[0];
            const ext = title.substring(title.indexOf('.') + 1, title.length);
            const file = {
                uri: uri,
                name: title,
                type: 'image/' + ext
            };
            this.props.onFinish(file);
        });
    };
    render() {
        const { bntGoBack, viewGoback, styleMap } = styleViewMap;
        const { longitude, latitude, address } = this.props;

        return (
            <View style={CustomStyleSheet.flex(1)}>
                <Modal
                    visible={this.state.isShowModalMap}
                    animationType="none"
                    transparent={false}
                    onRequestClose={this.closeModal}
                >
                    <ViewShot
                        style={styleMap}
                        ref={thisRef => (this.viewShot = thisRef)}
                        options={{ format: 'jpg', quality: 0.9 }}
                    >
                        <Map
                            ref={ref => (this.ResMapViewComponent = ref)}
                            coordinate={{ latitude: latitude, longitude: longitude }}
                            address={address}
                        />
                        <View style={viewGoback}>
                            <SafeAreaView>
                                <TouchableOpacity style={bntGoBack} onPress={() => this.onSaveTouch()}>
                                    <VnrText i18nKey={'HRM_Common_Save'} style={{ color: Colors.primary }} />
                                </TouchableOpacity>
                            </SafeAreaView>
                        </View>
                    </ViewShot>
                </Modal>
            </View>
        );
    }
}
