/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Colors, CustomStyleSheet, Size, styleSheets, styleSwipeableAction } from '../../constants/styleConfig';
import ActionSheet from 'react-native-actionsheet';
import Vnr_Function from '../../utils/Vnr_Function';
import { translate } from '../../i18n/translate';
import {
    IconEdit,
    IconMail,
    IconDelete,
    IconMoreHorizontal,
    IconInfo,
    IconCancelMarker,
    IconCancel,
    IconCheck,
    IconComment,
    IconHeart,
    IconRequestCancel,
    IconReturnUpBack
} from '../../constants/Icons';

// giới hạn số lượng nút ở bên phải item
let numberButtons = 2;
export const LimitTheTheNumberButtons = numberButtons;

export default class RightActions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toggleCheckedAll: true,
            sheetActions: [],
            rightListActions: null,
            listActions: null
        };
    }

    actionSheetOnCLick = index => {
        const { sheetActions } = this.state,
            { dataItem } = this.props;

        if (dataItem.isGroup && sheetActions[index].onPress) {
            sheetActions[index].onPress(dataItem.dataGroupMaster);
        } else if (sheetActions[index].onPress) {
            sheetActions[index].onPress(dataItem);
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
            rightListActions = [],
            sortByAction = {
                E_SENDTHANKS: [],
                E_SENDMAIL: [],
                E_MODIFY: [],
                E_DELETE: [],
                E_REQUEST_CANCEL: [],
                E_REQUESTCANCEL: [],
                E_CANCEL: [],
                E_APPROVE: [],
                E_CONFIRM: [],
                E_REJECT: [],
                E_REQUEST_CHANGE: []
            },
            notInAction = [],
            { rowActions, dataItem } = nextProps ? nextProps : this.props;

        if (!Vnr_Function.CheckIsNullOrEmpty(rowActions)) {
            // sắp sếp độ ưu tiên của action
            rowActions.forEach(item => {
                if (
                    sortByAction[item.type] &&
                    dataItem.BusinessAllowAction &&
                    dataItem.BusinessAllowAction.indexOf(item.type) >= 0
                ) {
                    sortByAction[item.type] = item;
                } else if (dataItem.BusinessAllowAction && dataItem.BusinessAllowAction.indexOf(item.type) >= 0) {
                    notInAction.push(item);
                }
            });

            rightListActions = [
                ...Object.values(sortByAction).filter(item => Object.keys(item).length > 0),
                ...notInAction
            ];
            ///==============//
            if (rightListActions.length > LimitTheTheNumberButtons) {
                sheetActions = [...rightListActions.slice(LimitTheTheNumberButtons - 1), ...sheetActions];
                rightListActions = rightListActions.splice(0, LimitTheTheNumberButtons - 1);
            } else if (rightListActions.length > 0 && rightListActions.length > 1) {
                sheetActions = [...rightListActions.slice(LimitTheTheNumberButtons), ...sheetActions];
            }
        }

        this.setState({
            sheetActions: sheetActions,
            rightListActions: rightListActions
        });
    };

    componentDidMount() {
        this.reloadAction();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (!Vnr_Function.compare(nextProps.BusinessAllowAction, this.props.BusinessAllowAction)) {
            this.reloadAction(nextProps);
        }
    }

    render() {
        const { sheetActions, rightListActions } = this.state,
            options = sheetActions.map(item => {
                return item.title;
            });
        const { dataItem } = this.props;
        let lengthBusinessAction = sheetActions.length > 1 ? LimitTheTheNumberButtons : rightListActions?.length;
        return (
            <View
                style={[
                    styleSwipeableAction.wrapStyleSwipeableAction,
                    lengthBusinessAction === 1 && { width: Size.deviceWidth / 4 },
                    CustomStyleSheet.flexDirection('row-reverse')
                ]}
            >
                {!Vnr_Function.CheckIsNullOrEmpty(rightListActions) &&
                    rightListActions.length > 0 &&
                    rightListActions.map((item, index) => {
                        let buttonColor = '';
                        let iconName = '';
                        let textColor = null;
                        switch (item.type) {
                            case 'E_MODIFY':
                                buttonColor = Colors.warning;
                                iconName = <IconEdit size={Size.iconSize} color={Colors.white} />;
                                break;
                            case 'E_REQUEST_CANCEL':
                                buttonColor = Colors.green;
                                textColor = Colors.white;
                                iconName = <IconRequestCancel size={Size.iconSize} color={Colors.white} />;
                                break;
                            case 'E_REQUESTCANCEL':
                                buttonColor = Colors.yellow_6;
                                textColor = Colors.black;
                                iconName = <IconCancelMarker size={Size.iconSize} color={Colors.black} />;
                                break;
                            case 'E_CANCEL':
                                buttonColor = Colors.red;
                                iconName = <IconCancelMarker size={Size.iconSize} color={Colors.white} />;
                                break;
                            case 'E_APPROVE':
                                buttonColor = Colors.success;
                                iconName = <IconCheck size={Size.iconSize} color={Colors.white} />;
                                break;
                            case 'E_CONFIRM':
                                buttonColor = Colors.success;
                                iconName = <IconCheck size={Size.iconSize} color={Colors.white} />;
                                break;
                            case 'E_REJECT':
                                buttonColor = Colors.volcano;
                                iconName = <IconCancel size={Size.iconSize + 2} color={Colors.white} />;
                                break;
                            case 'E_SENDTHANKS':
                                buttonColor = Colors.volcano;
                                iconName = <IconHeart size={Size.iconSize} color={Colors.white} />;
                                break;
                            case 'E_SENDMAIL':
                                buttonColor = Colors.blue;
                                iconName = <IconMail size={Size.iconSize} color={Colors.white} />;
                                break;
                            case 'E_DELETE':
                                buttonColor = Colors.danger;
                                iconName = <IconDelete size={Size.iconSize} color={Colors.white} />;
                                break;
                            case 'E_COMMENT':
                                buttonColor = Colors.primary;
                                iconName = <IconComment size={Size.iconSize} color={Colors.white} />;
                                break;
                            case 'E_REQUEST_CHANGE':
                                    buttonColor = Colors.purple;
                                    iconName = <IconReturnUpBack size={Size.iconSize} color={Colors.white} />;
                                    break;
                            default:
                                buttonColor = Colors.info;
                                iconName = <IconInfo size={Size.iconSize} color={Colors.white} />;
                                break;
                        }
                        //if (sheetActions.length > 0 && index < LimitTheTheNumberButtons -1) {
                        return (
                            <View style={[{ height: '100%' }]} key={index}>
                                <TouchableOpacity
                                    accessibilityLabel={`RightActions-${item.type}`}
                                    onPress={() => item.onPress(dataItem)}
                                    style={styleSwipeableAction.bnt_iconV3}
                                >
                                    <View
                                        style={[
                                            styleSwipeableAction.iconV3,
                                            { backgroundColor: buttonColor, paddingHorizontal: 6 }
                                        ]}
                                    >
                                        {iconName}
                                        <Text
                                            style={[
                                                styleSheets.text,
                                                { color: textColor ? textColor : Colors.white, textAlign: 'center' }
                                            ]}
                                        >
                                            {item.title}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        );
                    })}

                {!Vnr_Function.CheckIsNullOrEmpty(sheetActions) && sheetActions.length > 1 && (
                    <View style={{ height: '100%' }}>
                        <TouchableOpacity
                            accessibilityLabel={'RightActions-More'}
                            onPress={() => this.openActionSheet()}
                            style={styleSwipeableAction.bnt_iconV3}
                        >
                            <View
                                style={[
                                    styleSwipeableAction.iconV3,
                                    { backgroundColor: Colors.gray_7 }
                                    // {borderRadius: 0,}
                                ]}
                            >
                                <IconMoreHorizontal size={Size.iconSize} color={Colors.white} />
                                <Text style={[styleSheets.text, { color: Colors.white }]}>
                                    {translate('MoreActions')}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <ActionSheet
                            ref={o => (this.ActionSheet = o)}
                            //title={'Which one do you like ?'}
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