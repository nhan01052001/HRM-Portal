import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Size, styleSheets } from '../../../../../constants/styleConfig';
import {
    IconEdit,
    IconColse,
    IconCheckCirlceo,
    IconMail,
    IconDelete,
    IconMoreHorizontal,
    IconInfo,
    IconCancelMarker,
    IconCancel
} from '../../../../../constants/Icons';
import ActionSheet from 'react-native-actionsheet';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { translate } from '../../../../../i18n/translate';

export default class TopAction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toggleCheckedAll: true
        };

        this.sheetActions = [
            {
                title: translate('HRM_Common_Close'),
                onPress: null
            }
        ];
        this.listActionsTop = null;
        if (!Vnr_Function.CheckIsNullOrEmpty(this.props.listActions)) {
            this.listActionsTop = this.props.listActions.map((item) => {
                return item;
            });
            this.sheetActions = [...this.listActionsTop.slice(2), ...this.sheetActions];
        }
    }

    actionSheetOnCLick = (index) => {
        const { itemSelected, dataBody } = this.props;
        !Vnr_Function.CheckIsNullOrEmpty(this.sheetActions[index].onPress) &&
            this.sheetActions[index].onPress(itemSelected, dataBody);
    };

    openActionSheet = () => {
        this.ActionSheet.show();
    };

    render() {
        const options = this.sheetActions.map((item) => {
            return item.title;
        });
        const { dataBody, itemSelected } = this.props;

        return (
            <View style={[styles.actionHeader, {}]}>
                <View style={styles.ActionList}>
                    <View style={styles.leftAction}>
                        <TouchableOpacity
                            onPress={() => this.props.closeAction()}
                            underlayColor={Colors.lightAccent}
                            style={styles.iconHighLight}
                        >
                            <IconCancel color={Colors.gray_10} size={Size.iconSize} />
                        </TouchableOpacity>
                        <Text style={styles.number}>{this.props.numberItemSelected} </Text>
                    </View>

                    <View style={styles.rightAction}>
                        {!Vnr_Function.CheckIsNullOrEmpty(this.listActionsTop) &&
                            this.listActionsTop.length > 0 &&
                            this.listActionsTop.map((item, index) => {
                                let buttonColor = '',
                                    iconName = '',
                                    iconSize = Size.iconSize - 3;
                                switch (item.type) {
                                    case 'E_MODIFY':
                                        buttonColor = Colors.warning;
                                        iconName = <IconEdit size={iconSize} color={Colors.white} />;
                                        break;
                                    case 'E_CANCEL':
                                        buttonColor = Colors.red;
                                        iconName = <IconCancelMarker size={iconSize} color={Colors.white} />;
                                        break;
                                    case 'E_APPROVE':
                                        buttonColor = Colors.success;
                                        iconName = <IconCheckCirlceo size={iconSize} color={Colors.white} />;
                                        break;
                                    case 'E_REJECT':
                                        buttonColor = Colors.volcano;
                                        iconName = <IconColse size={iconSize} color={Colors.white} />;
                                        break;
                                    case 'E_SENDMAIL':
                                        buttonColor = Colors.primary;
                                        iconName = <IconMail size={iconSize} color={Colors.white} />;
                                        break;
                                    case 'E_DELETE':
                                        buttonColor = Colors.danger;
                                        iconName = <IconDelete size={iconSize} color={Colors.white} />;
                                        break;
                                    default:
                                        buttonColor = Colors.info;
                                        iconName = <IconInfo size={iconSize} color={Colors.white} />;
                                        break;
                                }

                                if (index <= 1) {
                                    return (
                                        <View style={styles.trashlefticon}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    item.onPress(itemSelected, dataBody);
                                                }}
                                                underlayColor={Colors.lightAccent}
                                                style={[
                                                    styles.iconLeftAction,
                                                    {
                                                        backgroundColor: buttonColor
                                                    }
                                                ]}
                                            >
                                                {iconName}
                                                <Text style={[styleSheets.text, styles.iconLeftAction_title]}>
                                                    {item.title}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                }
                            })}
                        {!Vnr_Function.CheckIsNullOrEmpty(this.sheetActions) && this.sheetActions.length > 1 && (
                            <View style={styles.trashlefticon}>
                                <TouchableOpacity
                                    onPress={() => this.openActionSheet()}
                                    underlayColor={Colors.lightAccent}
                                    style={styles.iconHighLight}
                                >
                                    <IconMoreHorizontal size={Size.iconSize} color={Colors.gray_10} />
                                </TouchableOpacity>
                                <ActionSheet
                                    ref={(o) => (this.ActionSheet = o)}
                                    //title={'Which one do you like ?'}
                                    options={options}
                                    cancelButtonIndex={this.sheetActions.length - 1}
                                    destructiveButtonIndex={this.sheetActions.length - 1}
                                    onPress={(index) => this.actionSheetOnCLick(index)}
                                />
                            </View>
                        )}
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    number: {
        fontSize: 18,
        color: Colors.gray_10
    },
    trashlefticon: {
        marginRight: 8
    },
    iconHighLight: {
        paddingHorizontal: styleSheets.p_5,
        borderRadius: styleSheets.radius_5
    },
    iconLeftAction: {
        paddingHorizontal: 8,
        borderRadius: styleSheets.radius_5,
        flexDirection: 'row',
        // borderWidth: 0.3,
        // borderColor: Colors.primary,
        height: '65%',
        alignItems: 'center'
    },
    actionHeader: {
        top: 0,
        width: Size.deviceWidth,
        backgroundColor: Colors.gray_3,
        zIndex: 1,
        flexDirection: 'row',
        height: 65,
        paddingVertical: Size.defineSpace / 2,
        paddingHorizontal: Size.defineSpace
    },
    ActionList: {
        flex: 1,
        height: '100%',
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        borderRadius: 8,
        flexDirection: 'row',
        backgroundColor: Colors.white
    },
    leftAction: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    rightAction: {
        flex: 8,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    iconLeftAction_title: {
        fontSize: Size.text,
        color: Colors.white,
        marginLeft: 3,
        fontWeight: '500'
    }
});
