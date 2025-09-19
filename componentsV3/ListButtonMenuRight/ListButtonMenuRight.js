import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Colors, CustomStyleSheet, Size, styleSheets } from '../../constants/styleConfig';
import ActionSheet from 'react-native-actionsheet';
import Vnr_Function from '../../utils/Vnr_Function';
import { translate } from '../../i18n/translate';
import {
    IconEdit,
    IconColse,
    IconCheckCirlceo,
    IconMail,
    IconDelete,
    IconMoreHorizontal,
    IconInfo,
    IconEvaluate,
    IconProgressCheck,
    IconCancelMarker,
    IconComment,
    IconRequestCancel,
    IconPlus
} from '../../constants/Icons';
import { EnumName } from '../../assets/constant';

// giới hạn số lượng nút
let numberButtons = 2;
export const LimitBottomTheTheNumberButtons = numberButtons;
export default class ListButtonMenuRight extends Component {
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
        let sheetActions = [
                {
                    title: translate('HRM_Common_Close'),
                    onPress: null
                }
            ],
            listActionshandle = [],
            notInAction = [],
            sortByAction = {
                E_SENDMAIL: {},
                E_MODIFY: {},
                E_DELETE: {},
                E_CANCEL: {},
                E_APPROVE: {},
                E_CONFIRM: {},
                E_REJECT: {}
            },
            { listActions, dataItem } = nextProps ? nextProps : this.props;

        if (!Vnr_Function.CheckIsNullOrEmpty(listActions)) {
            // sắp sếp độ ưu tiên của action
            listActions.forEach((item) => {
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

            listActionshandle = [
                ...Object.values(sortByAction).filter((item) => Object.keys(item).length > 0),
                ...notInAction
            ];
            ///==============//

            if (listActionshandle.length > LimitBottomTheTheNumberButtons) {
                sheetActions = [...listActionshandle.slice(LimitBottomTheTheNumberButtons - 1), ...sheetActions];
                listActionshandle = listActionshandle.splice(0, LimitBottomTheTheNumberButtons - 1);
            } else if (listActionshandle.length > 0 && listActionshandle.length > 1) {
                sheetActions = [...listActionshandle.slice(LimitBottomTheTheNumberButtons), ...sheetActions];
            }
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
            options = sheetActions.map((item) => {
                return item.title;
            });

        return (
            <View style={[styles.container, CustomStyleSheet.flexDirection('row-reverse')]}>
                {!Vnr_Function.CheckIsNullOrEmpty(listActions) &&
                    listActions.length > 0 &&
                    listActions.map((item, index) => {
                        let iconName = '',
                            buttonColor = '',
                            textColor = null;

                        const _dataItem = !Vnr_Function.CheckIsNullOrEmpty(this.props.dataItem)
                            ? this.props.dataItem
                            : null;
                        let typeStatus = !Vnr_Function.CheckIsNullOrEmpty(item.type) ? item.type : null;

                        switch (typeStatus) {
                            case EnumName.E_MODIFY:
                                buttonColor = Colors.warning;
                                iconName = <IconEdit size={Size.iconSize} color={Colors.white} />;
                                break;
                            case EnumName.E_MODIFY_SERIES:
                                buttonColor = Colors.navy;
                                iconName = <IconEdit size={Size.iconSize} color={Colors.white} />;
                                break;
                            case EnumName.E_REQUEST_CANCEL:
                                buttonColor = Colors.yellow_6;
                                textColor = Colors.black;
                                iconName = <IconRequestCancel size={Size.iconSize} color={Colors.black} />;
                                break;
                            case EnumName.E_CANCEL:
                                buttonColor = Colors.red;
                                iconName = <IconCancelMarker size={Size.iconSize} color={Colors.white} />;
                                break;
                            case EnumName.E_REQUESTCANCEL:
                                buttonColor = Colors.red;
                                iconName = <IconCancelMarker size={Size.iconSize} color={Colors.white} />;
                                break;
                            case EnumName.E_APPROVE:
                                buttonColor = Colors.success;
                                iconName = <IconCheckCirlceo size={Size.iconSize} color={Colors.white} />;
                                break;
                            case EnumName.E_CONFIRM:
                                buttonColor = Colors.success;
                                iconName = <IconCheckCirlceo size={Size.iconSize} color={Colors.white} />;
                                break;
                            case EnumName.E_REJECT:
                                buttonColor = Colors.volcano;
                                iconName = <IconColse size={Size.iconSize} color={Colors.white} />;
                                break;
                            case EnumName.E_SENDMAIL:
                                buttonColor = Colors.blue;
                                iconName = <IconMail size={Size.iconSize} color={Colors.white} />;
                                break;
                            case EnumName.E_DELETE:
                                buttonColor = Colors.danger;
                                iconName = <IconDelete size={Size.iconSize} color={Colors.white} />;
                                break;
                            case EnumName.E_EVALUATION:
                                buttonColor = Colors.BahamaBlue;
                                iconName = <IconEvaluate size={Size.iconSize} color={Colors.white} />;
                                break;
                            case EnumName.E_UPDATESTATUS:
                                buttonColor = Colors.indigo;
                                iconName = <IconProgressCheck size={Size.iconSize + 5} color={Colors.white} />;
                                break;

                            case EnumName.E_COMMENT:
                                buttonColor = Colors.primary;
                                iconName = <IconComment size={Size.iconSize} color={Colors.white} />;
                                break;
                            case EnumName.E_ENTER_INTERVIEW:
                                buttonColor = Colors.neutralGreen;
                                iconName = <IconPlus size={Size.iconSize} color={Colors.white} />;
                                break;
                            default:
                                buttonColor = Colors.info;
                                iconName = <IconInfo size={Size.iconSize} color={Colors.white} />;
                                break;
                        }

                        //if (index <= 1) {
                        return (
                            <View
                                style={styles.viewIcon}
                                key={index}
                                accessibilityLabel={`ListButtonMenuRight-${item.type}`}
                            >
                                <TouchableOpacity
                                    onPress={() => item.onPress(_dataItem)}
                                    style={[styles.bnt_icon, { backgroundColor: buttonColor }]}
                                >
                                    <View style={styles.icon}>{iconName}</View>
                                    <View style={styles.styWrapText}>
                                        <Text
                                            numberOfLines={1}
                                            style={[styleSheets.text, { color: textColor ? textColor : Colors.white }]}>
                                            {item.title}
                                        </Text>
                                    </View>

                                </TouchableOpacity>
                            </View>
                        );
                        //}
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
                        <TouchableOpacity
                            accessibilityLabel={'ListButtonMenuRight-More'}
                            onPress={() => this.openActionSheet()}
                            style={[styles.bnt_iconMore]}
                        >
                            <IconMoreHorizontal size={Size.iconSize} color={Colors.blue} />
                        </TouchableOpacity>

                        <ActionSheet
                            ref={(o) => (this.ActionSheet = o)}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    styWrapText : { maxWidth : '75%' },
    bnt_icon: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
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
        marginRight: styleSheets.p_5
    },
    viewIcon: {
        flex: 1,
        marginHorizontal: 5
    }
});
