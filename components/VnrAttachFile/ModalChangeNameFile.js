/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Colors, styleSheets, stylesVnrPickerV3 } from '../../constants/styleConfig';
import VnrTextInput from '../../componentsV3/VnrTextInput/VnrTextInput';
import { translate } from '../../i18n/translate';

const defaultState = {
    FileName: {
        lable: 'Vui lòng nhập tên file trước khi lưu',
        visible: true,
        visibleConfig: true,
        disable: false,
        value: '',
        refresh: false
    },

    File: {
        lable: 'HRM_PortalApp_TakeLeave_FileAttachment',
        visible: true,
        visibleConfig: true,
        disable: false,
        refresh: false,
        value: null
    },

    errorResponse: {
        value: '',
        visible: false
    },

    isShowModal: false
};

export default class ModalChangeNameFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...defaultState
        };
    }

    onShow = () => {
        this.setState(
            {
                isShowModal: true
            },
            () => {
                // if (file) {
                //     const { File } = this.state;
                //     this.setState({
                //         File: {
                //             ...File,
                //             value: file,
                //             refresh: !File.refresh
                //         }
                //     });
                // }
            }
        );
    };

    onHide = () => {
        this.setState({
            isShowModal: false
        });
    };

    render() {
        const { FileName, isShowModal } = this.state,
            { onFinish } = this.props;

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={isShowModal} // isShowModal
                onRequestClose={() => {}}
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: Colors.transparent_modal,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: 24
                    }}
                >
                    <View
                        style={{
                            width: '100%',
                            height: 170,
                            backgroundColor: Colors.white,
                            borderRadius: 8
                        }}
                    >
                        <View
                            style={{
                                padding: 12,
                                flex: 1
                            }}
                        >
                            <View
                                style={{
                                    flex: 1
                                }}
                            >
                                <View
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: -24
                                    }}
                                >
                                    <Text style={[styleSheets.lable, {}]}>{FileName.lable}</Text>
                                </View>
                                <VnrTextInput
                                    placeHolder={'Nhập tên'}
                                    disable={FileName.disable}
                                    lable={' '}
                                    style={[
                                        styleSheets.text,
                                        stylesVnrPickerV3.viewInputMultiline,
                                        {
                                            minHeight: 40,
                                            borderBottomWidth: 1
                                        }
                                    ]}
                                    styleContent={{
                                        paddingHorizontal: 0,
                                        borderBottomWidth: 0
                                    }}
                                    multiline={false}
                                    value={FileName.value}
                                    onChangeText={text => {
                                        this.setState({
                                            FileName: {
                                                ...FileName,
                                                value: text,
                                                refresh: !FileName.refresh
                                            }
                                        });
                                    }}
                                    refresh={FileName.refresh}
                                />
                            </View>
                            <View>
                                <Text
                                    style={[
                                        styleSheets.text,
                                        {
                                            color: Colors.red
                                        }
                                    ]}
                                >
                                    {translate('HRM_PortalApp_NameFileIsNotEmpty')}
                                </Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-evenly'
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState(
                                            {
                                                isShowModal: false
                                            },
                                            () => {
                                                onFinish(null);
                                            }
                                        );
                                    }}
                                    style={{
                                        paddingHorizontal: 16,
                                        paddingVertical: 6,
                                        borderColor: Colors.blue,
                                        borderWidth: 0.5,
                                        borderRadius: 6
                                    }}
                                >
                                    <Text style={[styleSheets.lable, {}]}>{translate('Cancel')}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState(
                                            {
                                                isShowModal: false
                                            },
                                            () => {
                                                if (typeof FileName.value === 'string' && FileName.value) {
                                                    onFinish(FileName.value);
                                                }
                                            }
                                        );
                                    }}
                                    style={{
                                        backgroundColor: Colors.blue,
                                        paddingHorizontal: 16,
                                        paddingVertical: 6,
                                        borderRadius: 6
                                    }}
                                >
                                    <Text Text style={[styleSheets.lable, { color: Colors.white }]}>
                                        {translate('HRM_PortalApp_Compliment_Commfirm')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}
