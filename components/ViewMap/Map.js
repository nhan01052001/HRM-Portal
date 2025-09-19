import React, { Component } from 'react';
import { Text, Image } from 'react-native';
import { styleSheets, Size, CustomStyleSheet, Colors } from '../../constants/styleConfig';
import MapView, { PROVIDER_GOOGLE, Callout, Marker } from 'react-native-maps';
import { Platform } from 'react-native';

export default class MapViewComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDelay: true
        };
        this.Marker = null;
    }

    getResMarker = () => {
        return this.Marker;
    };

    showCallout = () => {
        this.Marker.showCallout();
    };

    componentDidMount() {
        this.props.isShowCallout &&
            setTimeout(() => {
                if (this.props.address != '' && this.Marker != null) {
                    this.Marker.showCallout();
                }
            }, 800);

        setTimeout(() => {
            this.setState({ isDelay: false });
        }, 300);
    }

    render() {
        const { coordinate, address, styleMap, isShowCallout } = this.props;
        return (
            this.state.isDelay == false && (
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={
                        styleMap
                            ? styleMap
                            : CustomStyleSheet.flex(1)
                    }
                    initialRegion={{
                        latitude: coordinate.latitude,
                        longitude: coordinate.longitude,
                        latitudeDelta: 0.001,
                        longitudeDelta: 0.006
                    }}
                >
                    {/* <View style={{
                        position: 'absolute', top: 100, left: 50,
                        backgroundColor: 'red'
                    }} /> */}

                    {/* <Circle
                        center={coordinate}
                        radius={50}
                        fillColor={Colors.lightAccent}
                    /> */}

                    <Marker coordinate={coordinate} ref={ref => (this.Marker = ref)}>
                        <Image
                            source={require('../../assets/images/GPS/MarkerImg.png')}
                            style={{ width: Size.iconSize + 30, height: Size.iconSize + 30 }}
                            resizeMode="contain"
                        />
                        {isShowCallout && (
                            <Callout
                                tooltip={Platform.OS == 'ios' ? true : false}
                                // eslint-disable-next-line react-native/no-inline-styles
                                style={{
                                    width: Size.deviceWidth - 70,
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                    borderRadius: 10,
                                    backgroundColor: Colors.white,
                                    borderWidth: 1,
                                    borderColor: Colors.gray_9
                                }}
                            >
                                <Text style={[styleSheets.text, { fontSize: Size.text }]}>{address}</Text>
                            </Callout>
                        )}
                    </Marker>
                </MapView>
            )
        );
    }
}
