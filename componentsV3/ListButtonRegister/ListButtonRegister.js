import React, { Component } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import styleComonAddOrEdit from '../../constants/styleComonAddOrEdit';
import { styleSheets, Size, Colors, CustomStyleSheet } from '../../constants/styleConfig';
import { EnumName } from '../../assets/constant';
import { IconSave } from '../../constants/Icons';
import VnrText from '../../components/VnrText/VnrText';
import Vnr_Function from '../../utils/Vnr_Function';

class ListButtonRegister extends Component {
    renderActions = () => {
        const { listActions } = this.props;

        return listActions.map((action, index) => {
            let isDisable = false,
                buttonColor = null,
                styleView = null,
                contentView = <View />;
            if (action.disable !== undefined && action.disable === true) {
                isDisable = true;
            } else {
                isDisable = false;
            }

            switch (action.type) {
                case EnumName.E_REFRESH:
                    styleView = listActions?.length === 2 ? { ...styles.btnRefresh, ...CustomStyleSheet.flex(1) } : styles.btnRefresh;
                    contentView = (
                        <Image
                            style={{ width: Size.iconSize, height: Size.iconSize }}
                            resizeMode="cover"
                            source={require('../../assets/images/vnrDateFromTo/reset-sm.png')}
                        />
                    );
                    break;
                case EnumName.E_SAVE_TEMP:
                    styleView = listActions?.length === 2 ? { ...styles.btnSaveTemp, ...CustomStyleSheet.flex(9), ...CustomStyleSheet.paddingVertical(10) } : styles.btnSaveTemp;
                    buttonColor = isDisable ? Colors.gray_3 : styles.btnSaveTemp.backgroundColor;
                    contentView = <IconSave size={Size.iconSize} color={isDisable ? Colors.gray_7 : Colors.black} />;
                    break;
                case EnumName.E_REGISTER:
                    styleView = styles.wrapBtnRegister;
                    buttonColor = isDisable ? Colors.gray_3 : styles.wrapBtnRegister.backgroundColor;
                    contentView = (
                        <VnrText
                            style={[
                                styleSheets.lable,
                                styles.styRegister,
                                { color: isDisable ? Colors.gray_7 : Colors.white }
                            ]}
                            i18nKey={action.title}
                        />
                    );
                    break;
                default:
                    break;
            }

            return (
                <TouchableOpacity
                    key={index}
                    accessibilityLabel={`ListButtonRegister-${action.type}`}
                    disabled={isDisable}
                    style={[styleView, buttonColor && { backgroundColor: buttonColor }]}
                    onPress={() => action.onPress()}
                >
                    {contentView}
                </TouchableOpacity>
            );
        });
    };

    render() {
        let { isKeyboardShowOrHide, listActions } = this.props;
        return (
            <View style={[styles.wrapButtonHandler, isKeyboardShowOrHide && CustomStyleSheet.paddingBottom(24)]}>
                {!Vnr_Function.CheckIsNullOrEmpty(listActions) && listActions.length > 0 && this.renderActions()}
            </View>
        );
    }
}

const styles = styleComonAddOrEdit;

export default ListButtonRegister;
