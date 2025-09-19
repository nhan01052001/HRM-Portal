import React from 'react';
import { View, TouchableOpacity, Modal, Platform, Linking, Text } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Colors, CustomStyleSheet, Size, styleSheets, styleViewMap } from '../../constants/styleConfig';
import Map from './Map';
import Icon from 'react-native-vector-icons/Ionicons';
import Geocoder from 'react-native-geocoder';
import { dataVnrStorage } from '../../assets/auth/authentication';
import { VnrLoadingSevices } from '../VnrLoading/VnrLoadingPages';
import { AlertSevice } from '../Alert/Alert';
import { EnumIcon } from '../../assets/constant';
import DrawerServices from '../../utils/DrawerServices';
import Vnr_Function from '../../utils/Vnr_Function';
import AndroidOpenSettings from 'react-native-android-open-settings';
import Geolocation from '@react-native-community/geolocation';

const iconNameDeleteAll = `${Platform.OS === 'ios' ? 'ios-' : 'md-'}close`;

export default class ViewMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalMap: {
                visible: false,
                latitude: 0,
                longitude: 0,
                address: null
            }
        };
    }

    closeMap = () => {
        const { modalMap } = this.state;
        const { onFinish } = this.props;

        modalMap.visible = false;
        this.setState({ modalMap }, () => {
            onFinish &&
                typeof onFinish == 'function' &&
                modalMap.address &&
                modalMap.latitude &&
                modalMap.latitude &&
                onFinish(modalMap);
        });
    };

    getAddressFromCoordinate = (latitude, longitude) => {
        var NY = {
            lat: latitude,
            lng: longitude
        };
        return Geocoder.geocodePosition(NY);
    };

    alertContrainPermission = () => {
        AlertSevice.alert({
            iconType: EnumIcon.E_WARNING,
            message: 'HRM_PortalApp_Allow_Permission_GPS',
            title: 'setting',
            textRightButton: 'setting',
            onCancel: () => {
                VnrLoadingSevices.hide();
                this.closeMap();
            },
            onConfirm: () => {
                this.closeMap();
                Platform.OS === 'ios' ? Vnr_Function.openLink('app-settings:') : Linking.openSettings();
            }
        });
    };

    alertContrainPermissionGpsService = () => {
        AlertSevice.alert({
            iconType: EnumIcon.E_WARNING,
            message: 'PERMISSION_DENIED_GPS',
            textRightButton: 'setting',
            title: 'setting',
            onCancel: () => {
                VnrLoadingSevices.hide();
                this.closeMap();
            },
            onConfirm: () => {
                this.closeMap();
                Platform.OS === 'ios'
                    ? DrawerServices.navigate(
                        dataVnrStorage.languageApp === 'VN' ? 'TutorialGPSiOS' : 'TutorialGPSiOSEn'
                    )
                    : AndroidOpenSettings.locationSourceSettings();
            }
        });
    };

    getLocation = async () => {
        VnrLoadingSevices.show();
        Geolocation.getCurrentPosition(
            async position => {
                let { modalMap } = this.state,
                    { latitude, longitude } = modalMap;

                latitude = position.coords.latitude;
                longitude = position.coords.longitude;

                this.getAddressFromCoordinate(latitude, longitude).then(res => {
                    VnrLoadingSevices.hide();
                    this.setState({
                        modalMap: {
                            ...modalMap,
                            latitude,
                            longitude,
                            address: res[0].formattedAddress,
                            visible: true
                        }
                    });
                });
            },
            error => {
                VnrLoadingSevices.hide();
                if (error && error.code === 1) {
                    this.alertContrainPermission();
                } else if (error && error.code === 2) {
                    this.alertContrainPermissionGpsService();
                }
                this.setState({
                    address: null
                });
            },
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 }
        );
    };

    showMap = () => {
        const { x, y } = this.props;
        const { modalMap } = this.state;

        if (x && y) {
            modalMap.visible = true;
            modalMap.latitude = x;
            modalMap.longitude = y;
            this.getAddressFromCoordinate(x, y).then(address => {
                modalMap.address = address[0].formattedAddress;
                this.setState(modalMap);
            });
        } else {
            this.getLocation();
        }
    };

    componentDidMount() {
        const { x, y, address } = this.props;
        const { modalMap } = this.state;

        if (address && x && y) {
            modalMap.latitude = x;
            modalMap.longitude = y;
            modalMap.address = address;

            this.setState(modalMap);
        } else if (x && y) {
            modalMap.latitude = x;
            modalMap.longitude = y;
            this.getAddressFromCoordinate(x, y).then(address => {
                modalMap.address = address[0].formattedAddress;
                this.setState(modalMap);
            });
        }
    }

    render() {
        const { bntGoBack, viewGoback, styleMap } = styleViewMap;
        const { modalMap } = this.state;
        const { styleTextButton, x, y } = this.props;

        return (
            <View style={CustomStyleSheet.flex(1)}>
                <TouchableOpacity onPress={() => this.showMap()}>
                    {modalMap.address ? (
                        <Text
                            style={[
                                styleSheets.text,
                                // eslint-disable-next-line react-native/no-inline-styles
                                {
                                    color: Colors.primary,
                                    textDecorationLine: 'underline',
                                    textDecorationStyle: 'solid',
                                    textDecorationColor: Colors.primary
                                },
                                styleTextButton && styleTextButton
                            ]}
                            numberOfLines={1}
                        >
                            {modalMap.address}
                        </Text>
                    ) : (
                        <Text
                            numberOfLines={1}
                            style={[
                                styleSheets.text,
                                // eslint-disable-next-line react-native/no-inline-styles
                                {
                                    color: Colors.primary,
                                    textDecorationLine: 'underline',
                                    textDecorationStyle: 'solid',
                                    textDecorationColor: Colors.primary
                                },
                                styleTextButton && styleTextButton
                            ]}
                        >
                            {`${x} - ${y}`}
                        </Text>
                    )}
                </TouchableOpacity>
                <Modal
                    visible={modalMap.visible}
                    animationType="none"
                    transparent={false}
                    onRequestClose={this.closeModal}
                >
                    <View style={styleMap}>
                        <Map
                            ref={ref => (this.ResMapViewComponent = ref)}
                            coordinate={{
                                latitude: modalMap.latitude,
                                longitude: modalMap.longitude
                            }}
                            isShowCallout={true}
                            address={modalMap.address}
                        />
                        <View style={viewGoback}>
                            <SafeAreaView>
                                <TouchableOpacity
                                    style={[bntGoBack, { marginTop: Size.defineSpace }]}
                                    onPress={() => this.closeMap()}
                                >
                                    <Icon name={iconNameDeleteAll} size={30} color={Colors.black} />
                                </TouchableOpacity>
                            </SafeAreaView>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}
