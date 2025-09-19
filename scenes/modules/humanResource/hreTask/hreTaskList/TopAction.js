import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Size, styleSheets } from '../../../../../constants/styleConfig';
import { IconBack, IconDelete, IconInfo, IconEvaluate, IconProgressCheck } from '../../../../../constants/Icons';
import ActionSheet from 'react-native-actionsheet';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { translate } from '../../../../../i18n/translate';
import { EnumName } from '../../../../../assets/constant';
import { IconMoreHorizontal } from '../../../../../constants/Icons';
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
            this.sheetActions = [...this.listActionsTop.slice(3), ...this.sheetActions];
        }
    }

    actionSheetOnCLick = (index) => {
        const { itemSelected, dataBody } = this.props;
        !Vnr_Function.CheckIsNullOrEmpty(this.sheetActions[index].onPress) &&
            this.sheetActions[index].onPress(itemSelected, dataBody, true);
    };

    openActionSheet = () => {
        this.ActionSheet.show();
    };

    // render() {
    //     const options = this.sheetActions.map((item) => { return item.title });
    //     const TopActions = styleVnrListItem.TopActions;
    //     const { dataBody, itemSelected } = this.props;

    //     return (
    //         <View style={[TopActions.actionHeader, {}]}>
    //             <View style={TopActions.ActionList}>
    //                 <View style={TopActions.leftAction}>
    //                     <TouchableHighlight
    //                         onPress={() => this.props.closeAction()}
    //                         underlayColor={Colors.lightAccent}
    //                         style={TopActions.iconHighLight}>
    //                         <IconBack color={Colors.primary} size={Size.iconSize} />
    //                     </TouchableHighlight>
    //                     <Text style={TopActions.number}>{this.props.numberItemSelected} </Text>
    //                 </View>

    //                 <View style={TopActions.rightAction}>
    //                     {
    //                         (!Vnr_Function.CheckIsNullOrEmpty(this.listActionsTop) && this.listActionsTop.length > 0) &&
    //                         (
    //                             this.listActionsTop.map((item, index) => {

    //                                 let buttonColor = '';
    //                                 let iconName = '';
    //                                 let typeStatus = !Vnr_Function.CheckIsNullOrEmpty(item.type) ? item.type : null;
    //                                 switch (typeStatus) {
    //                                     case EnumName.E_DELETE:
    //                                         iconName = <IconDelete size={Size.iconSize} color={Colors.primary} />
    //                                         break;
    //                                     case EnumName.E_EVALUATION:
    //                                         iconName = <IconEvaluate size={Size.iconSize} color={Colors.primary} />
    //                                         break;
    //                                     case EnumName.E_UPDATESTATUS:
    //                                         iconName = <IconProgressCheck size={Size.iconSize + 5} color={Colors.primary} />
    //                                         break;
    //                                     default:
    //                                         iconName = <IconInfo size={Size.iconSize} color={Colors.primary} />
    //                                         break;
    //                                 }
    //                                 if (index <= 2) {
    //                                     return (
    //                                         <View style={TopActions.trashlefticon}>
    //                                             <TouchableHighlight
    //                                                 onPress={() => { item.onPress(itemSelected, dataBody, true) }}
    //                                                 underlayColor={Colors.lightAccent}
    //                                                 style={TopActions.iconLeftAction}>
    //                                                 {iconName}
    //                                             </TouchableHighlight>
    //                                         </View>
    //                                     )
    //                                 }

    //                             })
    //                         )
    //                     }
    //                     {
    //                         (!Vnr_Function.CheckIsNullOrEmpty(this.sheetActions) && this.sheetActions.length > 1) &&
    //                         (
    //                             <View style={TopActions.trashlefticon}>
    //                                 <TouchableHighlight onPress={() => this.openActionSheet()}
    //                                     underlayColor={Colors.lightAccent}
    //                                     style={TopActions.iconHighLight}>
    //                                     <IconFeather name={'more-horizontal'} size={Size.iconSize} color={Colors.primary} />
    //                                 </TouchableHighlight>
    //                                 <ActionSheet
    //                                     ref={o => this.ActionSheet = o}
    //                                     //title={'Which one do you like ?'}
    //                                     options={options}
    //                                     cancelButtonIndex={this.sheetActions.length - 1}
    //                                     destructiveButtonIndex={this.sheetActions.length - 1}
    //                                     onPress={(index) => this.actionSheetOnCLick(index)}
    //                                 />
    //                             </View>
    //                         )
    //                     }
    //                 </View>
    //             </View>
    //         </View>
    //     )
    // }

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
                            <IconBack color={Colors.primary} size={Size.iconSize} />
                        </TouchableOpacity>
                        <Text style={styles.number}>{this.props.numberItemSelected} </Text>
                    </View>

                    <View style={styles.rightAction}>
                        {!Vnr_Function.CheckIsNullOrEmpty(this.listActionsTop) &&
                            this.listActionsTop.length > 0 &&
                            this.listActionsTop.map((item, index) => {
                                let iconName = '',
                                    typeStatus = !Vnr_Function.CheckIsNullOrEmpty(item.type) ? item.type : null;
                                switch (typeStatus) {
                                    case EnumName.E_DELETE:
                                        iconName = <IconDelete size={Size.iconSize} color={Colors.primary} />;
                                        break;
                                    case EnumName.E_EVALUATION:
                                        iconName = <IconEvaluate size={Size.iconSize} color={Colors.primary} />;
                                        break;
                                    case EnumName.E_UPDATESTATUS:
                                        iconName = (
                                            <IconProgressCheck size={Size.iconSize + 5} color={Colors.primary} />
                                        );
                                        break;
                                    default:
                                        iconName = <IconInfo size={Size.iconSize} color={Colors.primary} />;
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
                                                style={[styles.iconLeftAction]}
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
                                    <IconMoreHorizontal size={Size.iconSize} color={Colors.primary} />
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
        color: Colors.primary
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
        borderWidth: 0.3,
        borderColor: Colors.primary,
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
        fontSize: Size.text - 1,
        color: Colors.primary,
        marginLeft: 3,
        fontWeight: '400'
    }
});
