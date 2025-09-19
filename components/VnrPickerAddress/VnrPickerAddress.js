/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Colors, Size, styleSheets, stylesVnrPicker, stylesVnrFilter } from '../../constants/styleConfig';
import VnrText from '../VnrText/VnrText';
import Vnr_Function from '../../utils/Vnr_Function';
import { IconColse, IconDown, IconCancel, IconBack } from '../../constants/Icons';
import Picker from './Picker';
import { EnumName } from '../../assets/constant';

const defaultState = {
    isModalVisible: false
};

export default class VnrPickerAddress extends React.Component {
    constructor(props) {
        super(props);
        const _state = defaultState;
        this.state = _state;
        this.toControl = null;
    }

    getControl = () => this.toControl;

    setControl = ctrl => {
        this.toControl = ctrl;
    };

    createState = () => {
        const arrState = {},
            { listPicker } = this.props;
        // eslint-disable-next-line no-unused-vars
        for (let key in listPicker) {
            let control = listPicker[key];
            //arrState[control.fieldName] = control.value ? control.value : null;
            arrState[control.fieldName] = null;
        }

        return arrState;
    };

    opentModal = () => {
        //defaultState.isModalVisible = true;
        const { listPicker } = this.props,
            _state = {
                ...{
                    isModalVisible: true
                },
                ...this.createState()
            },
            _listPicker = { ...listPicker },
            ctr = Object.keys(_listPicker).length > 0 ? _listPicker[Object.keys(_listPicker)[0]] : null;
        if (ctr.typeName === EnumName.E_VILLAGE) {
            ctr.typeIconPicker = EnumName.E_CHECK;
        } else {
            ctr.typeIconPicker = EnumName.E_NEXT;
        }

        this.setControl(ctr);
        this.setState(_state);
    };

    onRefreshControl = nextProps => {
        let _state = this.state;
        _state = defaultState;
        _state.stateProps = nextProps;
        this.setState(_state);
        this.isModalOpened = false;
    };

    componentDidMount() {
        const { autoShowModal } = this.props;

        if (autoShowModal) {
            this.opentModal();
        }
    }

    onFinishPicker = (item, control) => {
        if (!item) {
            return;
        }

        let displayName = '',
            uri = '',
            valueParam = item.ID,
            _typeIconPicker = EnumName.E_NEXT;
        const { listPicker } = this.props,
            _listPicker = { ...listPicker };

        if (control.typeName == EnumName.E_COUNTRY && _listPicker['province']) {
            displayName = 'province';
            uri = `[URI_HR]/Cat_GetData/GetProvinceCascading?country=${valueParam}`;
        } else if (control.typeName == EnumName.E_PROVINCE && _listPicker['district']) {
            displayName = 'district';
            uri = `[URI_HR]/Cat_GetData/GetDistrictCascading?province=${valueParam}`;
        } else if (control.typeName == EnumName.E_DISTRICT && _listPicker['village']) {
            _typeIconPicker = EnumName.E_CHECK;
            displayName = 'village';
            uri = `[URI_HR]/Cat_GetData/GetVillageCascading?districtid=${valueParam}`;
        }
        // else if (control.typeName == EnumName.E_VILLAGE) {
        // }

        if (uri && _listPicker[displayName]) {
            let _objControl = _listPicker[displayName];
            _objControl.api.urlApi = uri;
            _objControl.typeIconPicker = _typeIconPicker;
            this.setControl(_objControl);
        }

        this.setState({ [control.fieldName]: item });
    };

    closePicker = () => {
        this.props.onFinish(null);
        this.setState({ isModalVisible: false });
    };

    onOK = () => {
        const data = { ...this.state };
        delete data.isModalVisible;

        this.props.onFinish(data);
        this.setState({ isModalVisible: false });
    };

    renderIconBack = control => {
        let onPressGoBack = null,
            isGoBack = false;
        const { listPicker } = this.props,
            _listPicker = { ...listPicker };

        if (control.typeName == EnumName.E_PROVINCE && _listPicker['country']) {
            isGoBack = true;
            onPressGoBack = () => {
                let _ctr = { ..._listPicker['country'] };
                if (this.state[_ctr.fieldName] !== null) {
                    _ctr.value = this.state[_ctr.fieldName];
                }
                this.setControl(_ctr);
                this.setState({ [control.fieldName]: null });
            };
        } else if (control.typeName == EnumName.E_DISTRICT && _listPicker['province']) {
            isGoBack = true;
            onPressGoBack = () => {
                let _ctr = { ..._listPicker['province'] };
                if (this.state[_ctr.fieldName] !== null) {
                    _ctr.value = this.state[_ctr.fieldName];
                }
                this.setControl(_ctr);
                this.setState({ [control.fieldName]: null });
            };
        } else if (control.typeName == EnumName.E_VILLAGE && _listPicker['district']) {
            isGoBack = true;
            onPressGoBack = () => {
                let _ctr = { ..._listPicker['district'] };
                if (this.state[_ctr.fieldName] !== null) {
                    _ctr.value = this.state[_ctr.fieldName];
                }
                this.setControl(_ctr);
                this.setState({ [control.fieldName]: null });
            };
        }
        return isGoBack ? (
            <TouchableOpacity onPress={() => onPressGoBack()}>
                <IconBack size={Size.iconSizeHeader} color={Colors.primary} />
            </TouchableOpacity>
        ) : (
            <IconCancel size={Size.iconSizeHeader} color={Colors.white} />
        );
    };

    render() {
        const {
                bntPicker,
                bntPickerDisable,
                selectPicker,
                ScroollviewModal,
                bottomModal,
                stylePlaceholder,
                styLableValue
            } = stylesVnrPicker.VnrPicker,
            { listPicker, disable, placeholder } = this.props,
            { isModalVisible } = this.state;
        let textValue = null,
            // disable = false,
            viewPicker = <View />,
            viewTitlePicker = <View />;

        //console.log(disable, listPicker)
        if (listPicker && Object.keys(listPicker).length > 0) {
            // eslint-disable-next-line no-unused-vars
            for (let key in listPicker) {
                let control = listPicker[key],
                    { textField } = control;
                textValue = control.value && control.value[textField] ? control.value[textField] : null;
                break;
            }
        }

        if (this.getControl()) {
            viewPicker = (
                <Picker
                    key={this.getControl().fieldName}
                    {...this.getControl()}
                    onFinish={item => this.onFinishPicker(item, this.getControl())}
                />
            );
        }

        if (this.getControl() && this.getControl().titlePicker) {
            viewTitlePicker = (
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: 10,
                        paddingVertical: 10
                    }}
                >
                    {this.getControl() && this.renderIconBack(this.getControl())}
                    <VnrText
                        i18nKey={this.getControl().titlePicker}
                        style={[styleSheets.headerTitleStyle, { color: Colors.primary }]}
                    />
                    <IconColse size={Size.iconSize} color={Colors.white} />
                </View>
            );
        }

        return (
            <View style={[{ flex: 1 }]}>
                <View style={[selectPicker]}>
                    <TouchableOpacity
                        onPress={() => (!disable ? this.opentModal() : null)}
                        style={[
                            bntPicker,
                            //stateProps.stylePicker,
                            disable && bntPickerDisable
                        ]}
                        activeOpacity={!disable ? 0.2 : 1}
                    >
                        <View style={{ maxWidth: '90%' }}>
                            {textValue != null ? (
                                <Text style={[styleSheets.text, styLableValue]} numberOfLines={1}>
                                    {textValue}
                                </Text>
                            ) : (
                                <VnrText
                                    style={[
                                        styleSheets.text,
                                        // stylePlaceholder,
                                        stylePlaceholder
                                    ]}
                                    i18nKey={
                                        !Vnr_Function.CheckIsNullOrEmpty(placeholder) ? placeholder : 'SELECT_ITEM'
                                    }
                                />
                            )}
                        </View>
                        <View style={{ maxWidth: '10%' }}>
                            <IconDown size={Size.iconSize} color={disable ? Colors.gray_7 : Colors.gray_8} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    <Modal
                        visible={isModalVisible}
                        animationType="none"
                        transparent={false}
                        onRequestClose={this.closeModal}
                    >
                        <SafeAreaView style={ScroollviewModal}>
                            {viewTitlePicker}
                            <View style={{ flex: 9 }}>{viewPicker}</View>
                            <View style={bottomModal}>
                                <TouchableOpacity onPress={this.closePicker} style={[stylesVnrFilter.btn_ClearFilter]}>
                                    <VnrText
                                        style={[
                                            styleSheets.lable,
                                            {
                                                color: Colors.gray_8
                                            }
                                        ]}
                                        i18nKey={
                                            this.props.textLeftButton != null
                                                ? this.props.textLeftButton
                                                : 'HRM_Common_Close'
                                        }
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={this.onOK}
                                    style={[stylesVnrFilter.bnt_Ok, { backgroundColor: Colors.primary }]}
                                >
                                    <VnrText
                                        style={[styleSheets.lable, { color: Colors.white }]}
                                        i18nKey={
                                            this.props.textRightButton != null ? this.props.textRightButton : 'Confirm'
                                        }
                                    />
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>
                    </Modal>
                </View>
            </View>
        );
    }
}
