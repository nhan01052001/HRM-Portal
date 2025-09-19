import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Modal from 'react-native-modal';
import { Colors, styleSheets } from '../../constants/styleConfig';
import { BackgroundUpdateApp } from '../../constants/Icons';
import LinearGradient from 'react-native-linear-gradient';
import VnrProgressBar from './VnrProgressBar';
import { translate } from '../../i18n/translate';
import PropTypes from 'prop-types';

const VnrUpdateApp = ({
    isUpdate,
    isMandatory,
    isShowModal,
    progress,
    description,
    onPressUpdate,
    onPressUpdateLater,
    title,
    textButtoncancel
}) => {
    return (
        <Modal
            animationIn="fadeIn"
            animationOut="fadeOut"
            key={'@MODAL_LANGUAGE'}
            isVisible={isShowModal}
            style={styles.modal}
        >
            <View style={styles.content}>
                <View style={styles.wrapTop}>
                    <BackgroundUpdateApp color={'#0971DC7F'} width={351} height={286} />
                    <View style={styles.wrapIconUpdateApp}>
                        <Image style={styles.iconUpdateApp} source={require('../../assets/images/IconUpdateApp.png')} />
                    </View>
                </View>
                <View style={[styles.container]}>
                    <View style={styles.wrapLinear}>
                        <LinearGradient
                            colors={[
                                'rgba(255, 255, 255, 0.1)',
                                'rgba(255, 255, 255, 0.3)',
                                'rgba(255, 255, 255, 0.5)',
                                'rgba(255, 255, 255, 0.7)',
                                'rgba(255, 255, 255, 0.9)',
                                'rgba(255, 255, 255, 0.95)'
                            ]}
                            style={styles.flex1}
                        ></LinearGradient>
                    </View>
                    <View style={styles.wrapContent}>
                        {isUpdate ? (
                            <View>
                                <VnrProgressBar progress={progress} />
                            </View>
                        ) : (
                            <View style={styles.alignItemsStart}>
                                <Text style={[styleSheets.lable, styles.fs20]}>
                                    {translate('HRM_PortalApp_NewUpdateIsAvailable')}
                                </Text>
                                <View style={styles.mt8}>
                                    <Text style={[styleSheets.text, styles.textContentUpdate]}>
                                        {title}
                                    </Text>
                                    <View style={styles.mt8}>
                                        {description && description.length > 0 ? (
                                            description.map((item, index) => (
                                                <View
                                                    key={index}
                                                    style={[index + 1 !== description.length && styles.mb2]}
                                                >
                                                    <Text style={[styleSheets.text]}>
                                                        <Text style={styles.fw500}>{index + 1}</Text>. {item}
                                                    </Text>
                                                </View>
                                            ))
                                        ) : (
                                            <View />
                                        )}
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                    {!isUpdate ? (
                        <View style={styles.wrapButton}>
                            <TouchableOpacity
                                onPress={() => {
                                    if (onPressUpdate) onPressUpdate(true);
                                }}
                                style={styles.buttonUpdate}
                            >
                                <Text style={[styleSheets.text, styles.textButtonUpdate]}>
                                    {translate('HRM_PortalApp_UpdateNow')}
                                </Text>
                            </TouchableOpacity>

                            {!isMandatory && (
                                <TouchableOpacity
                                    style={styles.butotnUpdateLatter}
                                    onPress={() => {
                                        if (onPressUpdateLater) {
                                            onPressUpdateLater(true);
                                            true;
                                        }
                                    }}
                                >
                                    <Text style={[styleSheets.text, styles.textbutotnUpdateLatter]}>
                                        {textButtoncancel}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ) : (
                        <View style={styles.h100} />
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        width: '100%',
        alignContent: 'center'
    },
    content: {
        minHeight: 70,
        backgroundColor: Colors.white,
        borderRadius: styleSheets.radius_10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingBottom: 16
    },
    wrapTop: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        maxHeight: 200
    },
    wrapIconUpdateApp: {
        position: 'absolute'
    },
    iconUpdateApp: {
        marginTop: 33,
        marginRight: 10
    },
    flex1: {
        flex: 1
    },
    wrapLinear: {
        width: '100%',
        height: 50,
        position: 'absolute',
        top: -5
    },
    wrapContent: {
        marginTop: 24,
        paddingHorizontal: 16
    },
    fs20: {
        fontSize: 20,
        textAlign: 'left'
    },
    mt8: {
        marginTop: 8
    },
    textContentUpdate: {
        fontSize: 16,
        textAlign: 'left'
    },
    wrapButton: {
        width: '100%',
        marginTop: 48,
        alignItems: 'center',
        paddingHorizontal: 14
    },
    buttonUpdate: {
        backgroundColor: Colors.blue,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        height:44,
        borderRadius: 12,
        paddingHorizontal: 16
    },
    textButtonUpdate: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '500'
    },
    butotnUpdateLatter: {
        marginTop: 12,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        height:44,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.gray_5,
        paddingHorizontal: 16
    },
    textbutotnUpdateLatter: {
        fontSize: 16,
        fontWeight: '500'
    },
    alignItemsStart: {
        alignItems: 'flex-start'
    },
    h100: {
        height: 100
    },
    // updating: {
    //     flexDirection: 'row',
    //     alignItems: 'center'
    // },
    // mb4: {
    //     marginBottom: 4
    // },
    mb2: {
        marginBottom: 2
    },
    fw500: {
        fontWeight: '500'
    }
});

// Prop types declaration
VnrUpdateApp.propTypes = {
    // Thông tin về bản update
    description: PropTypes.array,
    // isUpdate hiển thị modal
    isUpdate: PropTypes.bool,
    // isMandatory Bắt buộc update
    isMandatory: PropTypes.bool,
    // onPressUpdateLater Hàm update sau
    onPressUpdateLater: PropTypes.func.isRequired,
    // onPressUpdate Hàm kiểm update sau
    onPressUpdate: PropTypes.func.isRequired,
    // progress Tiến trình update
    progress: PropTypes.number,
    // title tiêu đề thông báo
    title: PropTypes.string,
    // textButtoncancel Text button cancel
    textButtoncancel: PropTypes.string
};

// // Default props values
// VnrUpdateApp.defaultProps = {
//     dataInforUpdate: []
// };

export default VnrUpdateApp;
