import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Colors, Size, styleSheets } from '../../constants/styleConfig';
import ActionSheet from 'react-native-actionsheet';
import Vnr_Function from '../../utils/Vnr_Function';
import { translate } from '../../i18n/translate';
import {
    IconMoreHorizontal,
    IconInfo,
    IconProgressCheck,
    IconPublish,
    IconUpload,
    IconCheck
} from '../../constants/Icons';
import { EnumName } from '../../assets/constant';

// giới hạn số lượng nút
let numberButtons = 2;
export const LimitBottomTheTheNumberButtonSave = numberButtons;
export default class ListButtonSave extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toggleCheckedAll: true,
            sheetActions: [
                {
                    title: translate('HRM_Common_Close'),
                    onPress: null
                }
            ],
            listActions: null
        };
    }

    actionSheetOnCLick = index => {
        const { sheetActions } = this.state;

        if (!Vnr_Function.CheckIsNullOrEmpty(sheetActions[index].onPress)) {
            sheetActions[index].onPress();
        }
    };

    openActionSheet = () => {
        this.ActionSheet.show();
    };

    reloadAction = nextProps => {
        let sheetActions = [
                {
                    title: translate('HRM_Common_Close'),
                    onPress: null
                }
            ],
            listActionshandle = [],
            listActions = nextProps ? nextProps.listActions : this.props.listActions;
        if (!Vnr_Function.CheckIsNullOrEmpty(listActions)) {
            // listActionsTop = listActions;
            listActionshandle = listActions;
            if (listActions.length > LimitBottomTheTheNumberButtonSave) {
                sheetActions = [...listActions.slice(LimitBottomTheTheNumberButtonSave - 1), ...sheetActions];
                listActionshandle = listActions.splice(0, LimitBottomTheTheNumberButtonSave - 1);
            } else if (listActions.length > 0 && listActions.length > 1) {
                sheetActions = [...listActions.slice(LimitBottomTheTheNumberButtonSave), ...sheetActions];
            }

            // if (listActions.length > LimitBottomTheTheNumberButtonSave) {
            //     sheetActions = [...listActions.slice(LimitBottomTheTheNumberButtonSave), ...sheetActions];
            // }

            // listActionshandle = listActions.splice(0, LimitBottomTheTheNumberButtonSave);
        }

        this.setState({
            sheetActions: sheetActions,
            listActions: listActionshandle
        });
    };

    componentDidMount() {
        this.reloadAction();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (!Vnr_Function.compare(nextProps.listActions, this.props.listActions)) {
            this.reloadAction(nextProps);
        }
    }

    render() {
        const { sheetActions, listActions } = this.state,
            options = sheetActions.map(item => {
                return item.title;
            });

        return (
            <View style={styles.container}>
                {!Vnr_Function.CheckIsNullOrEmpty(listActions) &&
                    listActions.length > 0 &&
                    listActions.map((item, index) => {
                        let iconName = '',
                            buttonColor = '',
                            isDisable = false;
                        let typeStatus = !Vnr_Function.CheckIsNullOrEmpty(item.type) ? item.type : null;

                        if (item.disable !== undefined && item.disable === true) {
                            isDisable = true;
                        } else {
                            isDisable = false;
                        }

                        switch (typeStatus) {
                            case EnumName.E_SAVE_CLOSE:
                                buttonColor = isDisable ? Colors.gray_3 : Colors.info;
                                iconName = (
                                    <IconPublish
                                        size={Size.iconSize}
                                        color={isDisable ? Colors.gray_7 : Colors.white}
                                    />
                                );
                                break;
                            case EnumName.E_SAVE_NEW:
                                buttonColor = isDisable ? Colors.gray_3 : Colors.success;
                                iconName = (
                                    <IconProgressCheck
                                        size={Size.iconSize}
                                        color={isDisable ? Colors.gray_7 : Colors.white}
                                    />
                                );
                                break;
                            case EnumName.E_SAVE_SENMAIL:
                                buttonColor = isDisable ? Colors.gray_3 : Colors.blue;
                                iconName = (
                                    <IconUpload size={Size.iconSize} color={isDisable ? Colors.gray_7 : Colors.white} />
                                );
                                break;
                            case EnumName.E_ANALYSICS:
                                buttonColor = isDisable ? Colors.gray_3 : Colors.info;
                                iconName = (
                                    <IconCheck size={Size.iconSize} color={isDisable ? Colors.gray_7 : Colors.white} />
                                );
                                break;
                            default:
                                buttonColor = isDisable ? Colors.gray_3 : Colors.info;
                                iconName = (
                                    <IconInfo size={Size.iconSize} color={isDisable ? Colors.gray_7 : Colors.white} />
                                );
                                break;
                        }

                        return (
                            <View style={styles.viewIcon} key={index}>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (isDisable) {
                                            return;
                                        } else {
                                            item.onPress();
                                        }
                                    }}
                                    style={[
                                        styles.bnt_icon,
                                        buttonColor
                                            ? { backgroundColor: buttonColor }
                                            // eslint-disable-next-line react-native/no-inline-styles
                                            : {
                                                borderColor: Colors.gray_7,
                                                borderWidth: 0.5
                                            }
                                    ]}
                                >
                                    <View style={styles.icon}>{iconName}</View>
                                    <View style={styles.styViewtxt}>
                                        <Text
                                            style={[
                                                styleSheets.text,
                                                { color: isDisable ? Colors.gray_7 : Colors.white }
                                            ]}
                                            numberOfLines={1}
                                        >
                                            {item.title}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        );
                    })}

                {!Vnr_Function.CheckIsNullOrEmpty(sheetActions) && sheetActions.length > 1 && (
                    <View
                        style={[
                            styles.viewIcon,
                            {
                                maxWidth: Size.deviceWidth * 0.12
                            }
                        ]}
                    >
                        <TouchableOpacity onPress={() => this.openActionSheet()} style={[styles.bnt_iconMore]}>
                            <IconMoreHorizontal size={Size.iconSize} color={Colors.blue} />
                        </TouchableOpacity>

                        <ActionSheet
                            ref={o => (this.ActionSheet = o)}
                            options={options}
                            cancelButtonIndex={sheetActions.length - 1}
                            destructiveButtonIndex={sheetActions.length - 1}
                            onPress={index => this.actionSheetOnCLick(index)}
                        />
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        flexDirection: 'row',
        minHeight: 40,
        marginVertical: 10,
        maxHeight: 45,
        paddingHorizontal: Size.defineSpace
    },
    bnt_icon: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        paddingHorizontal: 5
    },
    bnt_iconMore: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: Colors.blue,
        borderRadius: 5
    },
    icon: {
        marginRight: 7
    },
    styViewtxt: {
        flexShrink: 1
    },
    viewIcon: {
        flex: 1,
        marginHorizontal: 5
    }
});
