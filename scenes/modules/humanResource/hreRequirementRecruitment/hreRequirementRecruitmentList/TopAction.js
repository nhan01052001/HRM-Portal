import React from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import { Colors, Size, styleSheets } from '../../../../../constants/styleConfig';
import { IconBack } from '../../../../../constants/Icons';
import ActionSheet from 'react-native-actionsheet';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { translate } from '../../../../../i18n/translate';
import IconFeather from 'react-native-vector-icons/Feather';
import IconAntDesign from 'react-native-vector-icons/AntDesign';

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
            this.listActionsTop = this.props.listActions.map(item => {
                return item;
            });
            this.sheetActions = [...this.listActionsTop.slice(3), ...this.sheetActions];
        }
    }

    actionSheetOnCLick = index => {
        const { itemSelected, dataBody } = this.props;
        !Vnr_Function.CheckIsNullOrEmpty(this.sheetActions[index].onPress) &&
            this.sheetActions[index].onPress(itemSelected, dataBody);
    };

    openActionSheet = () => {
        this.ActionSheet.show();
    };

    // toggleChecked = () => {
    //     const { toggleCheckedAll } = this.state;
    //     if (toggleCheckedAll) {
    //         this.props.checkedAll(null);
    //     }
    //     else {
    //         this.props.unCheckedAll(null);
    //     }
    //     this.setState({ toggleCheckedAll: !this.state.toggleCheckedAll });
    // }

    render() {
        const options = this.sheetActions.map(item => {
            return item.title;
        });
        const { dataBody, itemSelected } = this.props;

        return (
            <View style={[styles.actionHeader, {}]}>
                <View style={styles.ActionList}>
                    <View style={styles.leftAction}>
                        <TouchableHighlight
                            onPress={() => this.props.closeAction()}
                            underlayColor={Colors.lightAccent}
                            style={styles.iconHighLight}
                        >
                            <IconBack color={Colors.primary} size={Size.iconSize} />
                        </TouchableHighlight>
                        <Text style={styles.number}>{this.props.numberItemSelected} </Text>
                    </View>

                    <View style={styles.rightAction}>
                        {!Vnr_Function.CheckIsNullOrEmpty(this.listActionsTop) &&
                            this.listActionsTop.length > 0 &&
                            this.listActionsTop.map((item, index) => {
                                let iconName = '';
                                let typeStatus = !Vnr_Function.CheckIsNullOrEmpty(item.type) ? item.type : null;
                                switch (typeStatus) {
                                    case 'E_MODIFY':
                                        iconName = 'edit';
                                        break;
                                    case 'E_CANCEL':
                                        iconName = 'closecircleo';
                                        break;
                                    case 'E_APPROVE':
                                        iconName = 'checksquareo';
                                        break;
                                    case 'E_REJECT':
                                        iconName = 'closecircleo';
                                        break;
                                    case 'E_SENDMAIL':
                                        iconName = 'mail';
                                        break;
                                    case 'E_DELETE':
                                        iconName = 'delete';
                                        break;
                                    default:
                                        iconName = 'creditcard';
                                        break;
                                }
                                if (index <= 2) {
                                    return (
                                        <View style={styles.trashlefticon}>
                                            <TouchableHighlight
                                                onPress={() => {
                                                    item.onPress(itemSelected, dataBody);
                                                }}
                                                underlayColor={Colors.lightAccent}
                                                style={styles.iconLeftAction}
                                            >
                                                <IconAntDesign
                                                    name={iconName}
                                                    size={Size.iconSize}
                                                    color={Colors.primary}
                                                />
                                            </TouchableHighlight>
                                        </View>
                                    );
                                }
                                // else if (this.sheetActions.length > 1 && index < 1) {
                                //     return (
                                //         <View style={styles.trashlefticon}>
                                //             <TouchableHighlight
                                //                 onPress={() => item.onPress(this.props.itemSelected)}
                                //                 underlayColor={Colors.lightAccent}
                                //                 style={styles.iconLeftAction}
                                //             >
                                //                 <IconAntDesign name={iconName} size={Size.iconSize} color={Colors.primary} />
                                //             </TouchableHighlight>
                                //         </View>
                                //     )
                                // }
                            })}
                        {!Vnr_Function.CheckIsNullOrEmpty(this.sheetActions) && this.sheetActions.length > 1 && (
                            <View style={styles.trashlefticon}>
                                <TouchableHighlight
                                    onPress={() => this.openActionSheet()}
                                    underlayColor={Colors.lightAccent}
                                    style={styles.iconHighLight}
                                >
                                    <IconFeather name={'more-horizontal'} size={Size.iconSize} color={Colors.primary} />
                                </TouchableHighlight>
                                <ActionSheet
                                    ref={o => (this.ActionSheet = o)}
                                    //title={'Which one do you like ?'}
                                    options={options}
                                    cancelButtonIndex={this.sheetActions.length - 1}
                                    destructiveButtonIndex={this.sheetActions.length - 1}
                                    onPress={index => this.actionSheetOnCLick(index)}
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
        color: Colors.primary
    },
    trashlefticon: {
        marginRight: styleSheets.m_5
    },
    iconHighLight: {
        paddingHorizontal: styleSheets.p_5,
        borderRadius: styleSheets.radius_5
    },
    iconLeftAction: {
        paddingHorizontal: styleSheets.p_15,
        borderRadius: styleSheets.radius_5
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
    }
});
