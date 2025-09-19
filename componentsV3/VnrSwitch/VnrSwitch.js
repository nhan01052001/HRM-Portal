/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Switch, Platform } from 'react-native';
import { Colors, stylesVnrPickerV3, styleSheets, Size, CustomStyleSheet } from '../../constants/styleConfig';
import VnrText from '../../components/VnrText/VnrText';
class VnrSwitch extends React.Component {
    shouldComponentUpdate(nextProps) {
        if (this.props.value !== nextProps.value || this.props.isDisable !== nextProps.isDisable) {
            return true;
        }
        return false;
    }

    render() {
        const { lable, subLable, value, isDisable, onFinish } = this.props;

        return (
            <View style={[CustomStyleSheet.width('100%'), stylesVnrPickerV3.styContentPicker]}>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: Size.defineSpace
                    }}
                >
                    <View style={{ maxWidth: '80%' }}>
                        <VnrText style={[styleSheets.lable, stylesVnrPickerV3.styLableLayoutFilter]} i18nKey={lable} />
                        {
                            subLable && (
                                <VnrText
                                    style={[styleSheets.text, { fontSize: 12, fontWeight: '400', color: Colors.gray_6 }]}
                                    i18nKey={subLable}
                                />
                            )
                        }
                    </View>
                    <Switch
                        disabled={isDisable}
                        lable={'Switch'}
                        trackColor={{ false: Colors.gray_5, true: Colors.primary }}
                        thumbColor={Colors.white}
                        ios_backgroundColor={Colors.gray_5}
                        value={value}
                        style={[
                            Platform.OS == 'android' ? { transform: [{ scaleX: 1.3 }, { scaleY: 1.2 }] } : {},
                            isDisable && { opacity: 0.5 }
                        ]}
                        onValueChange={value => {
                            onFinish(value);
                        }}
                    />
                </View>
            </View>
        );
    }
}

export default VnrSwitch;
