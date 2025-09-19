import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    TouchableWithoutFeedback,
    ScrollView
} from 'react-native';
import Modal from 'react-native-modal';
import moment from 'moment';
import Vnr_Function from '../../utils/Vnr_Function';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, Size, Colors, styleSafeAreaView, CustomStyleSheet } from '../../constants/styleConfig';
import VnrText from '../VnrText/VnrText';
import {
    IconColse,
    IconCancel
} from '../../constants/Icons';
const api = {};

export const ModalDataSevice = api;
export default class ModalShowData extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inputValue: null,
            keyboardSpace: 0,
            // modalAlert: {
            //   typeInputText: 'E_TEXT',
            //   isInputText: false,
            //   isVisible: false,
            //   placeholder: '',
            //   title: '',
            //   message: '',
            //   icon: null,
            //   iconColor: null,
            //   onConfirm: null,
            //   onCancel: null,
            //   isValidInputText: false,
            //   showConfirm: true,
            //   iconType: null,
            // },
            Modals: []
        };
    }

    addModal = objModal => {
        this.setState({
            Modals: [
                {
                    ...objModal,
                    ...{
                        isVisible: true,
                        id: moment(new Date()).format('DD-MM-YYYY HH:mm:ss:SSS')
                    }
                },
                ...this.state.Modals
            ]
        });
    };

    _closeModal = ID => {
        let { Modals } = this.state;
        const modalAlert = Modals.filter(item => {
            return item.id == ID;
        })[0];

        Modals = Vnr_Function.removeObjectInArray(Modals, { id: ID }, 'id');
        let callbackOnCancel = null;
        modalAlert.isVisible = false;

        if (!Vnr_Function.CheckIsNullOrEmpty(modalAlert.onCancel) && typeof modalAlert.onCancel == 'function') {
            callbackOnCancel = modalAlert.onCancel;
        }
        this.setState({ Modals: Modals, inputValue: null }, () => {
            callbackOnCancel != null && callbackOnCancel();
        });
    };

    backDropOnPress = ID => {
        let { Modals } = this.state;
        const modalAlert = Modals.filter(item => {
            return item.id == ID;
        })[0];

        Modals = Vnr_Function.removeObjectInArray(Modals, { id: ID }, 'id');
        let callbackOnBackDrop = null;
        modalAlert.isVisible = false;

        if (!Vnr_Function.CheckIsNullOrEmpty(modalAlert.onBackDrop) && typeof modalAlert.onBackDrop == 'function') {
            callbackOnBackDrop = modalAlert.onBackDrop;
        }
        this.setState({ Modals: Modals, inputValue: null }, () => {
            callbackOnBackDrop != null && callbackOnBackDrop();
        });
    };

    _onConfirm = (ID, isValidInputText) => {
        let { Modals, inputValue } = this.state;
        const modalAlert = Modals.filter(item => {
            return item.id == ID;
        })[0];

        if (!isValidInputText || (isValidInputText && !Vnr_Function.CheckIsNullOrEmpty(inputValue))) {
            Modals = Vnr_Function.removeObjectInArray(Modals, { id: ID }, 'id');
        }

        let callbackOnConfirm = null;
        if (!Vnr_Function.CheckIsNullOrEmpty(modalAlert.onConfirm) && typeof modalAlert.onConfirm == 'function') {
            callbackOnConfirm = modalAlert.onConfirm;
        }

        this.setState({ Modals: Modals, inputValue: null }, () => {
            callbackOnConfirm != null && callbackOnConfirm(inputValue);
        });
    };

    _onConfirmSecond = ID => {
        let { Modals } = this.state;
        const modalAlert = Modals.filter(item => {
            return item.id == ID;
        })[0];

        Modals = Vnr_Function.removeObjectInArray(Modals, { id: ID }, 'id');
        modalAlert.isVisible = false;
        let callbackOnSecondConfirm = null;
        if (
            !Vnr_Function.CheckIsNullOrEmpty(modalAlert.onSecondConfirm) &&
            typeof modalAlert.onSecondConfirm == 'function'
        ) {
            callbackOnSecondConfirm = modalAlert.onSecondConfirm;
        }

        this.setState({ Modals: Modals, inputValue: null }, () => {
            callbackOnSecondConfirm != null && callbackOnSecondConfirm();
        });
    };

    autoFocusInput = () => {
        setTimeout(() => {
            if (this.refsTextInput) {
                this.refsTextInput.focus();
            }
        }, 500);
    };

    showAlert = object => {
        this.addModal(object);
    };

    componentDidMount() {
        api.show = this.showAlert;
    }

    // componentDidUpdate(){
    //   this.autoFocusInput();
    // }

    createModal(modal) {
        const { isVisible, id, title, configListDetail, dataItem } = modal;

        return (
            <Modal
                key={id}
                isVisible={isVisible}
                // onBackdropPress={() => this.backDropOnPress(id)}
                onBackButtonPress={() => this.backDropOnPress(id)}
                customBackdrop={
                    <TouchableWithoutFeedback onPress={() => this.backDropOnPress(id)}>
                        <View
                            style={styles.styDrop}
                        />
                    </TouchableWithoutFeedback>
                }
                style={CustomStyleSheet.margin(0)}
            >
                <View style={styles.viewModalTime}>
                    <SafeAreaView {...styleSafeAreaView} style={styles.safeRadius}>
                        <View style={styles.headerCloseModal}>
                            <IconColse color={Colors.white} size={Size.iconSize} />
                            <VnrText
                                style={[styleSheets.headerTitleStyle, styles.styTitleModalText]}
                                i18nKey={title ? title : 'HRM_PortalApp_Expand_Info'}
                            />
                            <TouchableOpacity onPress={() => this.backDropOnPress(id)}>
                                <IconCancel color={Colors.black} size={Size.iconSize} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.styScroll}>
                            <View style={styles.containerItemDetail}>
                                {configListDetail.map(e => {
                                    return Vnr_Function.formatStringTypeV2(dataItem, e);
                                })}
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                </View>
            </Modal>

        // <Modal
        //   animationIn="fadeIn"
        //   animationOut="fadeOut"

        //   style={[
        //     stylesAlert.modal,
        //     {
        //       minHeight: heightModal,
        //       //height: 'auto',
        //       top:
        //         (keyboardSpace && marginTopAfterKeyboardShow < marginTopModal)
        //           ? marginTopAfterKeyboardShow
        //           : marginTopModal,
        //     },
        //   ]}>
        //   <View
        //     style={{ flex: 1, flexDirection: 'column' }}
        //     onLayout={event => {
        //       this.heightModalLayout = event.nativeEvent.layout.height;
        //     }}>
        //     <View style={[stylesAlert.contentToaster]}>

        //       <View style={stylesAlert.topAlert}>
        //         {title && this.renderTitleIncon(modal)}

        //         {message && (
        //           <View style={stylesAlert.itemTopAlert}>
        //             <VnrText
        //               i18nKey={message}
        //               style={[
        //                 styleSheets.text,
        //                 stylesAlert.itemTopAlert_message__text

        //               ]}
        //             />
        //           </View>
        //         )}

        //         {isInputText && (
        //           <View style={[stylesAlert.itemTopAlert]}>
        //             <TextInput
        //               ref={ref => (this.refsTextInput = ref)}
        //               style={[
        //                 styleSheets.text,
        //                 stylesAlert.itemTopAlert_input,

        //                 typeInputText == 'E_PASSWORD' && { paddingVertical: 8 }
        //               ]}
        //               // autoFocus={typeInputText == 'E_PASSWORD'}
        //               secureTextEntry={
        //                 typeInputText == 'E_PASSWORD' ? true : false
        //               }
        //               onSubmitEditing={() =>
        //                 this._onConfirm(id, isValidInputText)
        //               }
        //               returnKeyType={'done'}
        //               placeholder={placeholder}
        //               onChangeText={text => this.setState({ inputValue: text })}
        //               value={inputValue}
        //               multiline={typeInputText == 'E_PASSWORD' ? false : true}
        //               numberOfLines={2}
        //               autoCapitalize={'none'}
        //             />
        //           </View>
        //         )}
        //       </View>
        //       <View style={stylesAlert.buttomAlert}>
        //         {this.renderButtonAlert(modal)}
        //       </View>
        //     </View>
        //   </View>
        // </Modal>
        );
    }

    render() {
        const { Modals } = this.state;
        return <View style={CustomStyleSheet.zIndex(2)}>{Modals.map(modal => this.createModal(modal))}</View>;
    }
}

const styles = StyleSheet.create({
    styScroll : { flexGrow: 1, flexDirection: 'column' },
    styDrop: {
        flex: 1,
        backgroundColor: Colors.black,
        opacity: 0.5
    },
    styTitleModalText: {},
    containerItemDetail: {
        flexDirection: 'column',
        paddingHorizontal: styleSheets.p_10,
        backgroundColor: Colors.white
    },
    viewModalTime: {
        backgroundColor: Colors.white,
        height: Size.deviceheight * 0.45,
        width: Size.deviceWidth,
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },
    safeRadius: {
        flex: 1,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },
    // headerCloseModal: {
    //     paddingVertical: 15,
    //     flexDirection: 'row',
    //     paddingHorizontal: Size.defineSpace,
    //     justifyContent: 'space-between',
    //     alignItems: 'center',
    //     borderBottomColor: Colors.borderColor,
    //     borderBottomWidth: 1
    // },
    headerCloseModal: {
        paddingVertical: 15,
        paddingHorizontal: Size.defineSpace,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});
