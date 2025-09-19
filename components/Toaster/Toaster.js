import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Platform, Animated } from 'react-native';
import { Size, Colors, stylesToaster } from '../../constants/styleConfig';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import Vnr_Function from '../../utils/Vnr_Function';
import VnrText from '../VnrText/VnrText';
import { Header } from 'react-navigation-stack';
import { IconCancel } from '../../constants/Icons';
const headerHeight = Header.HEIGHT / 2 + 10;
const api = {
    showError: null,
    showSuccess: null,
    showWarning: null,
    showInfo: null
};
export const ToasterSevice = api;
const iconNameAlter = `${Platform.OS === 'ios' ? 'ios-' : 'md-'}alert-circle`;
const iconNameInfo = `${Platform.OS === 'ios' ? 'ios-' : 'md-'}information-circle`;
const iconNameClose = `${Platform.OS === 'ios' ? 'ios-' : 'md-'}close-circle`;
const iconNameAppove = `${Platform.OS === 'ios' ? 'ios-' : 'md-'}checkmark-circle`;

class ToasterModal extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            fadeDownToaster: new Animated.Value(20)
        };
    }

    // eslint-disable-next-line react/no-deprecated
    componentWillMount() {
        const { modal } = this.props,
            { marginTop } = modal.position;
        if (marginTop && typeof marginTop === 'number') {
            Animated.timing(this.state.fadeDownToaster, {
                toValue: marginTop,
                duration: 130
            }).start();
        }
    }

    render() {
        const { modal, closeModal } = this.props;
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => closeModal(modal.id)}
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                    zIndex: 4,
                    elevation: 4,
                    position: 'absolute',
                    height: Size.deviceheight,
                    width: Size.deviceWidth
                }}
            >
                <Animated.View
                    style={[
                        stylesToaster.modal,
                        // eslint-disable-next-line react-native/no-inline-styles
                        {
                            backgroundColor: modal.background,
                            minHeight: modal.height,
                            borderColor: modal.color,
                            top: modal.position.marginTop ? this.state.fadeDownToaster : null, //modal.position.marginTop,
                            bottom: modal.position.marginButtom
                        }
                    ]}
                    onLayout={event => {
                        this.heightToaster = event.nativeEvent.layout.height;
                    }}
                >
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={[stylesToaster.contentToaster]}>
                            <View style={stylesToaster.left}>
                                <Icon name={modal.iconName} size={Size.iconSize} color={modal.color} />
                            </View>
                            <View style={stylesToaster.center}>
                                {modal.isTranslate ? (
                                    <VnrText
                                        style={{ fontSize: Size.text }}
                                        i18nKey={modal.content}
                                        value={modal.content}
                                    />
                                ) : (
                                    <Text style={{ color: Colors.gray_10, fontSize: Size.text }}>{modal.content}</Text>
                                )}
                            </View>
                            <View style={stylesToaster.right}>
                                <TouchableOpacity
                                    onPress={() => closeModal(modal.id)}
                                    // eslint-disable-next-line react-native/no-inline-styles
                                    style={{ flex: 1, justifyContent: 'center' }}
                                >
                                    {/* <Icon name={iconNameClose} size={15} color={modal.color} /> */}
                                    <IconCancel size={Size.iconSize} color={Colors.gray_8} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </TouchableOpacity>
        );
    }
}

export const ToasterInModal = class ToasterComponent extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            Modals: []
        };
        this.showError = this.showError.bind(this);
        this.showSuccess = this.showSuccess.bind(this);
        this.showInfo = this.showInfo.bind(this);
        this.showWarning = this.showWarning.bind(this);
        //this.heightToaster = null;
        //this.curentMarginToaster = 0 ;
    }

    addModal = objModal => {
        this.setState({
            Modals: [
                {
                    ...objModal,
                    ...{
                        isVisible: true,
                        height: 50
                    }
                },
                ...this.state.Modals
            ]
        });
    };

    showError = (title, timeOut, modalPosition, isTranslate) => {
        let time = 4000;
        let translate = true;
        !Vnr_Function.CheckIsNullOrEmpty(isTranslate) && typeof isTranslate == 'boolean' && (translate = isTranslate);
        let position = {
            index: 'TOP',
            marginTop: Size.defineSpace,
            marginButtom: null
        };
        // let marginTop = 0;
        if (!Vnr_Function.CheckIsNullOrEmpty(modalPosition) && modalPosition == 'BUTTOM') {
            position.index = 'BUTTOM';
            position.marginTop = null;
            position.marginButtom = 22;
        }
        // if(!Vnr_Function.CheckIsNullOrEmpty(this.heightToaster) && Modals.length > 0){
        //   position.marginTop = this.curentMarginToaster + this.heightToaster + 10;
        // }
        //this.curentMarginToaster = position.marginTop;
        !Vnr_Function.CheckIsNullOrEmpty(timeOut) && (time = timeOut);
        const ID = moment(new Date()).format();
        this.addModal({
            id: ID,
            content: title,
            color: Colors.danger,
            position: position,
            iconName: iconNameClose,
            isTranslate: translate,
            background: Colors.danger_blur
        });

        setTimeout(() => {
            let { Modals } = this.state;
            Modals = Vnr_Function.removeObjectInArray(Modals, { id: ID }, 'id');
            this.setState({ Modals: Modals });
        }, time);
    };

    showWarning = (title, timeOut, modalPosition, isTranslate) => {
        let time = 4000;
        let translate = true;
        !Vnr_Function.CheckIsNullOrEmpty(isTranslate) && typeof isTranslate == 'boolean' && (translate = isTranslate);
        let position = {
            index: 'TOP',
            marginTop: Size.defineSpace,
            marginButtom: null
        };
        //this.curentMarginToaster = position.marginTop;
        // let marginTop = 0;
        if (!Vnr_Function.CheckIsNullOrEmpty(modalPosition) && modalPosition == 'BUTTOM') {
            position.index = 'BUTTOM';
            position.marginTop = null;
            position.marginButtom = 22;
        }
        !Vnr_Function.CheckIsNullOrEmpty(timeOut) && (time = timeOut);
        const ID = moment(new Date()).format();
        this.addModal({
            id: ID,
            content: title,
            color: Colors.warning,
            position: position,
            iconName: iconNameAlter,
            isTranslate: translate,
            background: Colors.warning_blur
        });
        setTimeout(() => {
            let { Modals } = this.state;
            Modals = Vnr_Function.removeObjectInArray(Modals, { id: ID }, 'id');
            this.setState({ Modals: Modals });
        }, time);
    };

    showInfo = (title, timeOut, modalPosition, isTranslate) => {
        let time = 4000;
        let translate = true;
        !Vnr_Function.CheckIsNullOrEmpty(isTranslate) && typeof isTranslate == 'boolean' && (translate = isTranslate);
        let position = {
            index: 'TOP',
            marginTop: Size.defineSpace,
            marginButtom: null
        };
        //this.curentMarginToaster = position.marginTop;
        // let marginTop = 0;
        if (!Vnr_Function.CheckIsNullOrEmpty(modalPosition) && modalPosition == 'BUTTOM') {
            position.index = 'BUTTOM';
            position.marginTop = null;
            position.marginButtom = 22;
        }
        !Vnr_Function.CheckIsNullOrEmpty(timeOut) && (time = timeOut);
        const ID = moment(new Date()).format();
        this.addModal({
            id: ID,
            content: title,
            color: Colors.info,
            position: position,
            iconName: iconNameInfo,
            isTranslate: translate,
            background: Colors.info_blur
        });
        setTimeout(() => {
            let { Modals } = this.state;
            Modals = Vnr_Function.removeObjectInArray(Modals, { id: ID }, 'id');
            this.setState({ Modals: Modals });
        }, time);
    };

    showSuccess = (title, timeOut, modalPosition, isTranslate) => {
        let time = 4000;
        let translate = true;
        !Vnr_Function.CheckIsNullOrEmpty(isTranslate) && typeof isTranslate == 'boolean' && (translate = isTranslate);
        let position = {
            index: 'TOP',
            marginTop: Size.defineSpace,
            marginButtom: null
        };
        if (!Vnr_Function.CheckIsNullOrEmpty(modalPosition) && modalPosition == 'BUTTOM') {
            position.index = 'BUTTOM';
            position.marginTop = null;
            position.marginButtom = 22;
        }
        !Vnr_Function.CheckIsNullOrEmpty(timeOut) && (time = timeOut);
        const ID = moment(new Date()).format();
        this.addModal({
            id: ID,
            content: title,
            color: Colors.success,
            position: position,
            iconName: iconNameAppove,
            isTranslate: translate,
            background: Colors.success_blur
        });
        setTimeout(() => {
            let { Modals } = this.state;
            Modals = Vnr_Function.removeObjectInArray(Modals, { id: ID }, 'id');
            this.setState({ Modals: Modals });
        }, time);
    };

    _closeModal = ID => {
        let { Modals } = this.state;
        Modals = Vnr_Function.removeObjectInArray(Modals, { id: ID }, 'id');
        this.setState({ Modals: Modals });
    };

    createModal(_modal) {
        return <ToasterModal modal={_modal} />;
    }

    render() {
        const { Modals } = this.state;
        return (
            <View style={Platform.OS == 'ios' && { zIndex: 2 }}>
                {Modals.length > 0 &&
                    Modals.map((_modal, index) => (
                        <ToasterModal key={index} modal={_modal} closeModal={this._closeModal} />
                    )) // this.createModal(modal))
                }
            </View>
        );
    }
};

export default class ToasterComponent extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            Modals: []
        };
        this.showError = this.showError.bind(this);
        this.showSuccess = this.showSuccess.bind(this);
        this.showInfo = this.showInfo.bind(this);
        this.showWarning = this.showWarning.bind(this);
        //this.heightToaster = null;
        //this.curentMarginToaster = 0 ;
    }

    addModal = objModal => {
        this.setState({
            Modals: [
                {
                    ...objModal,
                    ...{
                        isVisible: true,
                        height: 50
                    }
                },
                ...this.state.Modals
            ]
        });
    };

    showError = (title, timeOut, modalPosition, isTranslate) => {
        let time = 4000;
        let translate = true;
        !Vnr_Function.CheckIsNullOrEmpty(isTranslate) && typeof isTranslate == 'boolean' && (translate = isTranslate);
        let position = {
            index: 'TOP',
            marginTop: headerHeight + Size.defineSpace,
            marginButtom: null
        };
        // let marginTop = 0;
        if (!Vnr_Function.CheckIsNullOrEmpty(modalPosition) && modalPosition == 'BUTTOM') {
            position.index = 'BUTTOM';
            position.marginTop = null;
            position.marginButtom = 22;
        }
        // if(!Vnr_Function.CheckIsNullOrEmpty(this.heightToaster) && Modals.length > 0){
        //   position.marginTop = this.curentMarginToaster + this.heightToaster + 10;
        // }
        //this.curentMarginToaster = position.marginTop;
        !Vnr_Function.CheckIsNullOrEmpty(timeOut) && (time = timeOut);
        const ID = moment(new Date()).format();
        this.addModal({
            id: ID,
            content: title,
            color: Colors.danger,
            position: position,
            iconName: iconNameClose,
            isTranslate: translate,
            background: Colors.danger_blur
        });

        setTimeout(() => {
            let { Modals } = this.state;
            Modals = Vnr_Function.removeObjectInArray(Modals, { id: ID }, 'id');
            this.setState({ Modals: Modals });
        }, time);
    };

    showWarning = (title, timeOut, modalPosition, isTranslate) => {
        let time = 4000;
        let translate = true;
        !Vnr_Function.CheckIsNullOrEmpty(isTranslate) && typeof isTranslate == 'boolean' && (translate = isTranslate);
        let position = {
            index: 'TOP',
            marginTop: headerHeight + Size.defineSpace,
            marginButtom: null
        };
        //this.curentMarginToaster = position.marginTop;
        // let marginTop = 0;
        if (!Vnr_Function.CheckIsNullOrEmpty(modalPosition) && modalPosition == 'BUTTOM') {
            position.index = 'BUTTOM';
            position.marginTop = null;
            position.marginButtom = 22;
        }
        !Vnr_Function.CheckIsNullOrEmpty(timeOut) && (time = timeOut);
        const ID = moment(new Date()).format();
        this.addModal({
            id: ID,
            content: title,
            color: Colors.warning,
            position: position,
            iconName: iconNameAlter,
            isTranslate: translate,
            background: Colors.warning_blur
        });
        setTimeout(() => {
            let { Modals } = this.state;
            Modals = Vnr_Function.removeObjectInArray(Modals, { id: ID }, 'id');
            this.setState({ Modals: Modals });
        }, time);
    };

    showInfo = (title, timeOut, modalPosition, isTranslate) => {
        let time = 4000;
        let translate = true;
        !Vnr_Function.CheckIsNullOrEmpty(isTranslate) && typeof isTranslate == 'boolean' && (translate = isTranslate);
        let position = {
            index: 'TOP',
            marginTop: headerHeight + Size.defineSpace,
            marginButtom: null
        };
        //this.curentMarginToaster = position.marginTop;
        // let marginTop = 0;
        if (!Vnr_Function.CheckIsNullOrEmpty(modalPosition) && modalPosition == 'BUTTOM') {
            position.index = 'BUTTOM';
            position.marginTop = null;
            position.marginButtom = 22;
        }
        !Vnr_Function.CheckIsNullOrEmpty(timeOut) && (time = timeOut);
        const ID = moment(new Date()).format();
        this.addModal({
            id: ID,
            content: title,
            color: Colors.info,
            position: position,
            iconName: iconNameInfo,
            isTranslate: translate,
            background: Colors.info_blur
        });
        setTimeout(() => {
            let { Modals } = this.state;
            Modals = Vnr_Function.removeObjectInArray(Modals, { id: ID }, 'id');
            this.setState({ Modals: Modals });
        }, time);
    };

    showSuccess = (title, timeOut, modalPosition, isTranslate) => {
        let time = 4000;
        let translate = true;
        !Vnr_Function.CheckIsNullOrEmpty(isTranslate) && typeof isTranslate == 'boolean' && (translate = isTranslate);
        let position = {
            index: 'TOP',
            marginTop: headerHeight + Size.defineSpace,
            marginButtom: null
        };
        if (!Vnr_Function.CheckIsNullOrEmpty(modalPosition) && modalPosition == 'BUTTOM') {
            position.index = 'BUTTOM';
            position.marginTop = null;
            position.marginButtom = 22;
        }
        !Vnr_Function.CheckIsNullOrEmpty(timeOut) && (time = timeOut);
        const ID = moment(new Date()).format();
        this.addModal({
            id: ID,
            content: title,
            color: Colors.success,
            position: position,
            iconName: iconNameAppove,
            isTranslate: translate,
            background: Colors.success_blur
        });
        setTimeout(() => {
            let { Modals } = this.state;
            Modals = Vnr_Function.removeObjectInArray(Modals, { id: ID }, 'id');
            this.setState({ Modals: Modals });
        }, time);
    };

    _closeModal = ID => {
        let { Modals } = this.state;
        Modals = Vnr_Function.removeObjectInArray(Modals, { id: ID }, 'id');
        this.setState({ Modals: Modals });
    };

    componentDidMount() {
        api.showError = this.showError;
        api.showSuccess = this.showSuccess;
        api.showWarning = this.showWarning;
        api.showInfo = this.showInfo;
    }

    createModal(_modal) {
        return <ToasterModal modal={_modal} />;
    }

    render() {
        const { Modals } = this.state;
        return (
            <View style={Platform.OS == 'ios' && { zIndex: 2 }}>
                {Modals.length > 0 &&
                    Modals.map((_modal, index) => (
                        <ToasterModal key={index} modal={_modal} closeModal={this._closeModal} />
                    )) // this.createModal(modal))
                }
            </View>
        );
    }
}
