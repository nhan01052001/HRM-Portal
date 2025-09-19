import React from 'react';
import { Image, Text, View, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Size, styleSheets } from '../../constants/styleConfig';
import VnrProgressBar from './VnrProgressBar';
import { IconCancel } from '../../constants/Icons';
import { translate } from '../../i18n/translate';
import AnimationDot from './AnimationDot';
import { STATUS_UPDATE_LATER } from '../../redux/update/reducer';
import codePush from 'react-native-code-push';

const VnrUpdateAppAtHome = ({ progress, status, onClose }) => {
    const isUpdated = status == STATUS_UPDATE_LATER.DONE ? true : false;
    return (
        <View style={styles.container}>
            <View style={styles.wrap}>
                <View style={styles.maxWidth80}>
                    <Image style={styles.w80h80} source={require('../../assets/images/IconUpdateApp.png')} />
                </View>

                <View style={styles.content}>
                    {isUpdated ? (
                        <Text style={[styleSheets.lable, styles.fs18]}>{translate('HRM_PortalApp_Downloaded')}.</Text>
                    ) : (
                        <View style={styles.updating}>
                            <Text style={[styleSheets.lable, styles.fs18]}>
                                {translate('HRM_PortalApp_Downloading')}
                            </Text>
                            <View>
                                <AnimationDot />
                            </View>
                        </View>
                    )}
                    <View></View>
                    {isUpdated ? (
                        <TouchableOpacity style={styles.buttonUpdate} onPress={() => codePush.restartApp()}>
                            <Text style={[styleSheets.lable, styles.textButtonUpdate]}>
                                {translate('HRM_PortalApp_UpdateNow')}
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.alignItemsStart}>
                            <VnrProgressBar
                                progress={progress}
                                width={Dimensions.get('screen').width - WIDTH_ICON * 2 - 32}
                                height={10}
                                hidePercent={true}
                            />
                        </View>
                    )}
                </View>

                <View style={styles.wrapButton}>
                    <TouchableOpacity
                        onPress={() => {
                            if (typeof onClose === 'function') onClose();
                        }}
                        style={styles.button}
                    >
                        <IconCancel size={15} color={Colors.black} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const [shortDimension] =
    Size.deviceWidth < Size.deviceheight
        ? [Size.deviceWidth, Size.deviceheight]
        : [Size.deviceheight, Size.deviceWidth];
const guidelineBaseWidth = 350;
const WIDTH_ICON = (shortDimension / guidelineBaseWidth) * 52;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16
    },
    content: {
        flex: 1,
        paddingVertical: 16,
        marginLeft: 16
    },
    wrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    maxWidth80: {
        maxWidth: 80
    },

    w80h80: {
        width: WIDTH_ICON,
        height: WIDTH_ICON
    },

    wrapButton: {
        height: '100%',
        marginTop: 15,
        alignItems: 'flex-end'
    },

    button: {
        padding: 8,
        backgroundColor: Colors.gray_4,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },

    alignItemsStart: {
        alignItems: 'flex-start'
    },

    fs18: {
        fontSize: 16
    },

    buttonUpdate: {
        backgroundColor: Colors.blue,
        width: '95%',
        alignItems: 'center',
        paddingVertical: 4,
        borderRadius: 8,
        marginTop: 5
    },

    textButtonUpdate: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '500'
    },

    updating: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    }
});

export default VnrUpdateAppAtHome;
