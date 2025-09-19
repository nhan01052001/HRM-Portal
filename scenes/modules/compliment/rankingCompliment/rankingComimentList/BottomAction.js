import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Size, styleSheets } from '../../../../../constants/styleConfig';
import { IconMoreHorizontal } from '../../../../../constants/Icons';
import ActionSheet from 'react-native-actionsheet';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { translate } from '../../../../../i18n/translate';

// giới hạn số lượng nút
let numberButtons = 2;
export const LimitBottomTheTheNumberButtons = numberButtons;
export default class BottomAction extends React.Component {
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
            listActionsTop: null
        };
    }

    actionSheetOnCLick = (index) => {
        const { itemSelected, dataBody } = this.props,
            { sheetActions } = this.state;
        !Vnr_Function.CheckIsNullOrEmpty(sheetActions[index].onPress) &&
            sheetActions[index].onPress(itemSelected, dataBody);
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
            sortByAction = {
                E_SENDTHANKS: {},
                E_SENDMAIL: {},
                E_MODIFY: {},
                E_DELETE: {},
                E_APPROVE: {},
                E_CONFIRM: {},
                E_REJECT: {},
                E_CANCEL: {}
            },
            { listActions } = nextProps ? nextProps : this.props;

        if (!Vnr_Function.CheckIsNullOrEmpty(listActions)) {
            // sắp sếp độ ưu tiên của action
            listActions.forEach((item) => {
                if (sortByAction[item.type]) {
                    sortByAction[item.type] = item;
                }
            });

            listActionshandle = [...Object.values(sortByAction).filter((item) => Object.keys(item).length > 0)];
            ///==============//

            if (listActionshandle.length > LimitBottomTheTheNumberButtons) {
                sheetActions = [...listActionshandle.slice(LimitBottomTheTheNumberButtons - 1), ...sheetActions];
                listActionshandle = listActionshandle.splice(0, LimitBottomTheTheNumberButtons - 1);
            } else if (listActionshandle.length > 0 && listActionshandle.length > 1) {
                sheetActions = [...listActionshandle.slice(LimitBottomTheTheNumberButtons), ...sheetActions];
            }

            this.setState({
                sheetActions: sheetActions,
                listActionsTop: [...listActionshandle]
            });
        }
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
        const { dataBody, itemSelected } = this.props,
            { sheetActions, listActionsTop } = this.state;
        const options =
            sheetActions && Array.isArray(sheetActions)
                ? sheetActions.map((item) => {
                    return item.title;
                })
                : null;

        return (
            <View style={styles.actionHeader}>
                {!Vnr_Function.CheckIsNullOrEmpty(listActionsTop) &&
                    Array.isArray(listActionsTop) &&
                    listActionsTop.length > 0 &&
                    listActionsTop.map((item, index) => {
                        let buttonColor = '';
                        switch (item.type) {
                            case 'E_MODIFY':
                                buttonColor = Colors.warning;
                                break;
                            case 'E_CANCEL':
                                buttonColor = Colors.red;
                                break;
                            case 'E_APPROVE':
                                buttonColor = Colors.success;
                                break;
                            case 'E_REJECT':
                                buttonColor = Colors.volcano;
                                break;
                            case 'E_SENDTHANKS':
                                buttonColor = Colors.volcano;
                                break;
                            case 'E_SENDMAIL':
                                buttonColor = Colors.blue;
                                break;
                            case 'E_DELETE':
                                buttonColor = Colors.danger;
                                break;
                            default:
                                buttonColor = Colors.info;
                                break;
                        }

                        // if (index <= 1) {
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    item.onPress(itemSelected, dataBody);
                                }}
                                underlayColor={Colors.lightAccent}
                                style={[
                                    styles.buttonAction,
                                    {
                                        backgroundColor: buttonColor
                                    }
                                    // (!Vnr_Function.CheckIsNullOrEmpty(sheetActions) && sheetActions.length > 1) && { width: '75%' },
                                    // listActionsTop.length === 1 && sheetActions.length === 1 && { width: '100%' }
                                ]}
                            >
                                <Text style={[styleSheets.text, styles.iconLeftAction_title]}>
                                    {item.title}{' '}
                                    {itemSelected && Array.isArray(itemSelected) && itemSelected.length > 0
                                        ? `(${itemSelected.length})`
                                        : null}
                                </Text>
                            </TouchableOpacity>
                        );
                        // }
                    })}

                {!Vnr_Function.CheckIsNullOrEmpty(sheetActions) && sheetActions.length > 1 && (
                    <View style={[styles.viewIcon]}>
                        <TouchableOpacity onPress={() => this.openActionSheet()} style={styles.bnt_iconMore}>
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
    actionHeader: {
        height: 60,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: Colors.white,
        zIndex: 3,
        elevation: 3,
        paddingHorizontal: Size.defineHalfSpace,
        paddingVertical: Size.defineHalfSpace + 2
    },
    iconLeftAction_title: {
        fontSize: Size.text,
        color: Colors.white,
        marginLeft: 3,
        fontWeight: '500'
    },
    bnt_iconMore: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: Colors.blue,
        borderRadius: 4
    },
    viewIcon: {
        flex: 1,
        height: '100%',
        maxWidth: Size.deviceWidth * 0.12,
        marginHorizontal: Size.defineHalfSpace / 2
    },
    buttonAction: {
        flex: 1,
        height: '100%',
        marginHorizontal: Size.defineHalfSpace / 2,
        // width: Size.deviceWidth / 2.5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4
    }
});
