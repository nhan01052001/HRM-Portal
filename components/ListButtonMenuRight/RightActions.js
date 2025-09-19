import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Colors, Size, styleSheets, styleSwipeableAction } from '../../constants/styleConfig';
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
    IconComment
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

    actionSheetOnCLick = (index) => {
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

    reloadAction = (nextProps) => {
        let sheetActions = (sheetActions = [
                {
                    title: translate('HRM_Common_Close'),
                    onPress: null
                }
            ]),
            rightListActions = [],
            sortByAction = {
                E_SENDMAIL: [],
                E_MODIFY: [],
                E_DELETE: [],
                E_CANCEL: [],
                E_APPROVE: [],
                E_CONFIRM: [],
                E_REJECT: []
            },
            notInAction = [],
            { rowActions, dataItem } = nextProps ? nextProps : this.props;

        if (!Vnr_Function.CheckIsNullOrEmpty(rowActions)) {
            // sắp sếp độ ưu tiên của action
            rowActions.forEach((item) => {
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
                ...Object.values(sortByAction).filter((item) => Object.keys(item).length > 0),
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
            options = sheetActions.map((item) => {
                return item.title;
            });
        const { dataItem } = this.props;
        return (
            // eslint-disable-next-line react-native/no-inline-styles
            <View style={{ maxWidth: 300, flexDirection: 'row-reverse', marginBottom: 0.5 }}>
                {!Vnr_Function.CheckIsNullOrEmpty(rightListActions) &&
                    rightListActions.length > 0 &&
                    rightListActions.map((item, index) => {
                        let buttonColor = '';
                        let iconName = '';
                        switch (item.type) {
                            case 'E_MODIFY':
                                buttonColor = Colors.warning;
                                iconName = <IconEdit size={Size.iconSize} color={Colors.white} />;
                                break;
                            case 'E_CANCEL':
                                buttonColor = Colors.red;
                                iconName = <IconCancelMarker size={Size.iconSize} color={Colors.white} />;
                                break;
                            case 'E_REQUESTCANCEL':
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
                            default:
                                buttonColor = Colors.info;
                                iconName = <IconInfo size={Size.iconSize} color={Colors.white} />;
                                break;
                        }
                        //if (sheetActions.length > 0 && index < LimitTheTheNumberButtons -1) {
                        return (
                            <View
                                accessibilityLabel={`RightActions-${item.type}`}
                                style={styleSwipeableAction.viewIcon}
                                key={index}
                            >
                                <TouchableOpacity
                                    onPress={() => item.onPress(dataItem)}
                                    style={styleSwipeableAction.bnt_icon}
                                >
                                    <View style={[styleSwipeableAction.icon, { backgroundColor: buttonColor }]}>
                                        {iconName}
                                    </View>
                                    <Text style={[styleSheets.text]}>{item.title}</Text>
                                </TouchableOpacity>
                            </View>
                        );
                        // } else if (sheetActions.length <= 1 && index < LimitTheTheNumberButtons) {
                        //   return (
                        //     <View style={styleSwipeableAction.viewIcon}>
                        //       <TouchableOpacity
                        //         onPress={() => item.onPress(dataItem)}
                        //         style={styleSwipeableAction.bnt_icon}>
                        //         <View
                        //           style={[
                        //             styleSwipeableAction.icon,
                        //             { backgroundColor: buttonColor },
                        //           ]}>
                        //           {iconName}
                        //         </View>
                        //         <Text style={[styleSheets.text]}>{item.title}</Text>
                        //       </TouchableOpacity>
                        //     </View>
                        //   );
                        // }
                    })}

                {!Vnr_Function.CheckIsNullOrEmpty(sheetActions) && sheetActions.length > 1 && (
                    <View style={styleSwipeableAction.viewIcon} accessibilityLabel={'RightActions-More'}>
                        <TouchableOpacity
                            onPress={() => this.openActionSheet()}
                            style={styleSwipeableAction.bnt_icon}
                        >
                            <View style={[styleSwipeableAction.icon, { backgroundColor: Colors.gray_7 }]}>
                                <IconMoreHorizontal size={Size.iconSize} color={Colors.white} />
                            </View>
                            <Text style={[styleSheets.text]}>{translate('MoreActions')}</Text>
                        </TouchableOpacity>
                        <ActionSheet
                            ref={(o) => (this.ActionSheet = o)}
                            //title={'Which one do you like ?'}
                            options={options}
                            cancelButtonIndex={sheetActions.length - 1}
                            destructiveButtonIndex={sheetActions.length - 1}
                            onPress={(index) => this.actionSheetOnCLick(index)}
                        />
                    </View>
                )}
            </View>
        );
    }
}
