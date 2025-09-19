// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
// import {
//     styleSheets,
//     styleListLableValueCommom,
//     Colors,
//     Size
// } from '../../../../../constants/styleConfig';
// import moment from 'moment';
// import format from 'number-format.js';
// import VnrText from '../../../../../components/VnrText/VnrText';

// export default class ContractItem extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {};
//         this.formatStringType = this.formatStringType.bind(this);

//     }

//     shouldComponentUpdate(nextProps, nextState) {
//         if (
//             nextProps.isPullToRefresh !== this.props.isPullToRefresh ||
//             nextProps.isSelect !== this.props.isSelect ||
//             nextProps.isOpenAction !== this.props.isOpenAction
//         ) {
//             return true;
//         } else {
//             return false;
//         }
//     }

//     formatStringType = (data, col) => {
//         if (data[col.Name]) {
//             if (col.DataType && col.DataType.toLowerCase() == 'datetime') {
//                 return moment(data[col.Name]).format(col.DataFormat);
//             }
//             if (col.DataType && col.DataType.toLowerCase() == 'double') {
//                 return format(col.DataFormat, data[col.Name]);
//             } else {
//                 return data[col.Name];
//             }
//         } else {
//             return '';
//         }
//     };

//     render() {
//         const {
//             dataItem,
//             index,
//         } = this.props;
//         return (
//             <View style={Platform.OS == 'ios' ? styles.viewButtonIOS : styles.swipeable} key={index}>
//                 <View style={styles.viewButton}>
//                     <View style={styles.rightBody} >
//                         {/* chức vụ - PositionName */}
//                         <View style={styles.Line}>
//                             <View style={styles.IconView}>
//                                 <VnrText
//                                     numberOfLines={1}
//                                     style={[styleSheets.lable, styles.txtLable]}
//                                     i18nKey={'HRM_HR_Profile_PositionName'}
//                                 />

//                             </View>
//                             <View style={styles.valueView}>
//                                 {/* <Text style={styleSheets.text}>: </Text> */}
//                                 <Text numberOfLines={1}
//                                     style={[styleSheets.text]}>
//                                     {dataItem.PositionName}
//                                 </Text>
//                             </View>

//                         </View>

//                         {/* Loại hợp động - ContractTypeName */}
//                         <View style={styles.Line}>
//                             <View style={styles.IconView}>
//                                 <VnrText
//                                     numberOfLines={1}
//                                     style={[styleSheets.lable, styles.txtLable]}
//                                     i18nKey={'HRM_HR_Contract_ContractTypeID'}
//                                 />

//                             </View>
//                             <View style={styles.valueView}>
//                                 <Text numberOfLines={1}
//                                     style={[styleSheets.text]}>
//                                     {dataItem.ContractTypeName}
//                                 </Text>
//                             </View>

//                         </View>
//                         {/* Ngày ký hợp đồng - DateSigned */}
//                         <View style={styles.Line}>
//                             <View style={styles.IconView}>
//                                 <VnrText
//                                     numberOfLines={1}
//                                     style={[styleSheets.lable, styles.txtLable]}
//                                     i18nKey={'HRM_HR_Contract_DateSigned'}
//                                 />

//                             </View>
//                             <View style={styles.valueView}>
//                                 {/* <Text style={styleSheets.text}>: </Text> */}
//                                 <Text numberOfLines={1}
//                                     style={[styleSheets.text]}>
//                                     {dataItem.DateSigned ? moment(dataItem.DateSigned).format('DD/MM/YYYY') : ''}
//                                 </Text>
//                             </View>
//                         </View>
//                     </View>
//                 </View>

//             </View>
//         );
//     }
// }

// const styles = StyleSheet.create({
//     swipeable: {
//         flex: 1,
//         borderRadius: 10,

//         marginBottom: 13,
//         marginHorizontal: 10,
//         padding: 4,
//         backgroundColor: '#f3f2f2',
//     },
//     viewButton: {
//         flex: 1,
//         backgroundColor: Colors.whiteOpacity70,
//         borderRadius: 10,
//         justifyContent: 'center',
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingVertical: 10,
//     },
//     viewButtonIOS: {
//         flex: 1,
//         borderRadius: 10,
//         marginBottom: 13,
//         marginHorizontal: 10,
//         shadowColor: Colors.black,
//         backgroundColor: '#f3f2f2',
//         shadowOffset: {
//             width: 0,
//             height: 2.5,
//         },
//         shadowOpacity: 0.2,
//         shadowRadius: 5.46,
//         elevation: 6,
//     },
//     txtLable: {
//         marginRight: 3,
//     },
//     leftBody: {
//         flex: 3,
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderRightColor: Colors.borderColor,
//         borderRightWidth: 0.5
//     },
//     rightBody: {
//         flex: 7,
//         paddingHorizontal: 10,
//     },
//     iconAvatarView: {
//         flex: 1,
//         marginBottom: 5
//     },
//     avatarUser: {
//         width: Size.deviceWidth * 0.2,
//         height: Size.deviceWidth * 0.2,
//         borderRadius: (Size.deviceWidth * 0.2) / 2,
//         resizeMode: 'cover',
//         backgroundColor: Colors.borderColor,
//     },
//     Line: {
//         flex: 1,
//         flexDirection: "row",
//         maxWidth: "100%",
//         justifyContent: 'center',
//         //  paddingBottom: 4,
//         marginBottom: 7,
//         // borderBottomColor: Colors.borderColor,
//         // borderBottomWidth: 0.5
//     },

//     valueView: {
//         flex: 6.5,
//         marginLeft: 5,
//         alignItems: 'center',
//         flexDirection: 'row'
//     },
//     IconView: {
//         flex: 4.5,
//         height: '100%',
//         justifyContent: 'flex-start',
//         flexDirection: 'row'
//     }
// })

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, CustomStyleSheet, Size, styleSheets, styleSwipeableAction } from '../../../../../constants/styleConfig';
import moment from 'moment';
import ActionSheet from 'react-native-actionsheet';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { translate } from '../../../../../i18n/translate';
import {
    IconEdit,
    IconMail,
    IconDelete,
    IconMoreHorizontal,
    IconInfo,
    IconCheck,
    IconBack,
    IconCancelMarker,
    IconCancel,
    IconCheckCirlceo,
    IconDate
} from '../../../../../constants/Icons';
import Color from 'color';
export default class AppendixContractItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        //this.setRightAction(props);
        this.Swipe = null;
    }

    setRightAction = thisProps => {
        const { dataItem } = thisProps;
        this.sheetActions = [
            {
                title: translate('HRM_Common_Close'),
                onPress: null
            }
        ];

        dataItem.BusinessAllowAction = ['E_DELETE', 'E_MODIFY'];
        if (!Vnr_Function.CheckIsNullOrEmpty(thisProps.rowActions)) {
            this.rightListActions = thisProps.rowActions.filter(item => {
                item.title = item?.title;
                return (
                    !Vnr_Function.CheckIsNullOrEmpty(dataItem.BusinessAllowAction) &&
                    dataItem.BusinessAllowAction.indexOf(item.type) >= 0
                );
            });
            if (this.rightListActions.length > 2) {
                this.sheetActions = [...this.rightListActions.slice(1), ...this.sheetActions];
            } else if (this.rightListActions.length > 0) {
                this.sheetActions = [...this.rightListActions.slice(2), ...this.sheetActions];
            }
        }
    };

    UNSAFE_componentWillReceiveProps() {
        // if (nextProps.isPullToRefresh !== this.props.isPullToRefresh) {
        //     this.setRightAction(nextProps);
        // }
    }

    shouldComponentUpdate(nextProps) {
        if (
            nextProps.isPullToRefresh !== this.props.isPullToRefresh ||
            nextProps.isSelect !== this.props.isSelect ||
            nextProps.isOpenAction !== this.props.isOpenAction ||
            nextProps.isDisable !== this.props.isDisable
        ) {
            return true;
        } else {
            return false;
        }
    }

    openActionSheet = () => {
        this.ActionSheet.show();
    };

    actionSheetOnCLick = index => {
        const { dataItem } = this.props;
        !Vnr_Function.CheckIsNullOrEmpty(this.sheetActions[index].onPress) &&
            this.sheetActions[index].onPress(dataItem);
    };

    rightActionsEmpty = () => {
        return <View style={CustomStyleSheet.width(0)} />;
    };

    rightActions = () => {
        const options = this.sheetActions.map(item => {
            return item.title;
        });
        const { dataItem } = this.props;
        return (
            <View style={styleSheets.rightActions}>
                {!Vnr_Function.CheckIsNullOrEmpty(this.sheetActions) && this.sheetActions.length > 1 && (
                    <View style={styleSwipeableAction.viewIcon}>
                        <TouchableOpacity onPress={() => this.openActionSheet()} style={styleSwipeableAction.bnt_icon}>
                            <View style={[styleSwipeableAction.icon, { backgroundColor: Colors.gray_7 }]}>
                                <IconMoreHorizontal size={Size.iconSize} color={Colors.white} />
                            </View>
                            <Text style={[styleSheets.text]}>{translate('MoreActions')}</Text>
                        </TouchableOpacity>
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
                {!Vnr_Function.CheckIsNullOrEmpty(this.rightListActions) &&
                    this.rightListActions.length > 0 &&
                    this.rightListActions.map((item, index) => {
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
                            case 'E_APPROVE':
                                buttonColor = Colors.success;
                                iconName = <IconCheck size={Size.iconSize} color={Colors.white} />;
                                break;
                            case 'E_REJECT':
                                buttonColor = Colors.volcano;
                                iconName = <IconCancel size={Size.iconSize + 2} color={Colors.white} />;
                                break;
                            case 'E_SENDMAIL':
                                buttonColor = Colors.primary;
                                iconName = <IconMail size={Size.iconSize} color={Colors.white} />;
                                break;
                            case 'E_DELETE':
                                buttonColor = Colors.danger;
                                iconName = <IconDelete size={Size.iconSize} color={Colors.white} />;
                                break;
                            default:
                                buttonColor = Colors.info;
                                iconName = <IconInfo size={Size.iconSize} color={Colors.white} />;
                                break;
                        }
                        if (this.sheetActions.length > 0 && index < 1) {
                            return (
                                <View style={styleSwipeableAction.viewIcon}>
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
                        } else if (this.sheetActions.length <= 1 && index < 2) {
                            return (
                                <View style={styleSwipeableAction.viewIcon}>
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
                        }
                    })}
            </View>
        );
    };

    convertTextToColor = value => {
        const [num1, num2, num3, opacity] = value.split(',');
        return Color.rgb(parseFloat(num1), parseFloat(num2), parseFloat(num3), parseFloat(opacity));
    };

    render() {
        const {
            dataItem,
            isSelect,
            index,
            listItemOpenSwipeOut,
            rowActions,
            isOpenAction,
            isDisable
        } = this.props;
        let timeCouse = '',
            codeContract = '';

        if (dataItem.AnnexCode != null) {
            codeContract = dataItem.AnnexCode;
        }

        if (dataItem.ContractTypeName != null) {
            if (codeContract != '') codeContract = `${codeContract} - ${dataItem.ContractTypeName}`;
            else codeContract = dataItem.ContractTypeName;
        }

        if (dataItem.DateStart) {
            timeCouse = moment(dataItem.DateStart).format('DD/MM/YYYY');
        }

        if (dataItem.DateEnd) {
            if (timeCouse !== '') {
                timeCouse = `${timeCouse} - ${moment(dataItem.DateEnd).format('DD/MM/YYYY')}`;
            } else {
                timeCouse = moment(dataItem.DateEnd).format('DD/MM/YYYY');
            }
        }

        return (
            <Swipeable
                ref={ref => {
                    this.Swipe = ref;
                    if (
                        listItemOpenSwipeOut.findIndex(value => {
                            return value['ID'] == index;
                        }) < 0
                    ) {
                        listItemOpenSwipeOut.push({ ID: index, value: ref });
                    } else {
                        listItemOpenSwipeOut[index].value = ref;
                    }
                }}
                overshootRight={false}
                renderRightActions={rowActions != null && !isOpenAction ? this.rightActions : this.rightActionsEmpty}
                friction={0.6}
                containerStyle={styles.swipeable}
            >
                <View style={[styles.swipeableLayout, isSelect && { backgroundColor: Colors.Secondary95 }]}>
                    {isOpenAction && (
                        <View style={[styles.leftContent, isDisable ? styleSheets.opacity05 : styleSheets.opacity1]}>
                            <TouchableOpacity
                                activeOpacity={isDisable ? 1 : 0.8}
                                onPress={() => {
                                    !isDisable ? this.props.onClick() : null;
                                }}
                            >
                                <View
                                    style={[
                                        styles.circle,
                                        !this.props.isSelect && {
                                            ...CustomStyleSheet.borderColor(Colors.primary),
                                            ...CustomStyleSheet.borderWidth(1)
                                        }
                                    ]}
                                >
                                    {this.props.isSelect && (
                                        <IconCheckCirlceo size={Size.iconSize - 4} color={Colors.primary} />
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={[styles.container]} key={index}>
                        <View style={styles.styContentItem}>
                            <View style={styles.styLine}>
                                <View style={styles.styLineLeft}>
                                    <Text numberOfLines={1} style={[styleSheets.lable, styles.txtLable_1]}>
                                        {codeContract}
                                    </Text>
                                </View>
                            </View>

                            <View style={[styles.styLine, CustomStyleSheet.marginBottom(0)]}>
                                {/* <View style={styles.styLineRow}>
                                    <IconUser size={Size.text} color={Colors.gray_7} />
                                    <Text numberOfLines={1}
                                        style={[styleSheets.text, styles.txtLable_2]}>
                                        {dataItem.RelativeTypeName}
                                    </Text>
                                </View> */}
                                {timeCouse != '' && (
                                    <View style={styles.styLineRow}>
                                        <IconDate size={Size.text} color={Colors.gray_7} />
                                        <Text numberOfLines={1} style={[styleSheets.text, styles.txtLable_2]}>
                                            {timeCouse}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                </View>
                {Array.isArray(this.rightListActions) && this.rightListActions.length > 0 && (
                    <View style={styles.actionRight}>
                        <IconBack color={Colors.gray_7} size={Size.defineSpace} />
                    </View>
                )}
            </Swipeable>
        );
    }
}

const PADDING_DEFINE = Size.defineSpace;
const styles = StyleSheet.create({
    swipeable: {
        flex: 1,
        paddingHorizontal: Size.defineSpace
    },
    swipeableLayout: {
        flex: 1,
        borderRadius: 8,
        backgroundColor: Colors.white,
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        position: 'relative',
        flexDirection: 'row',
        minHeight: 90
    },
    actionRight: {
        position: 'absolute',
        top: 0,
        right: -Size.defineSpace,
        height: '100%',
        justifyContent: 'center'
    },
    leftContent: {
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        paddingLeft: 5,
        paddingRight: 5,
        borderRightColor: Colors.gray_5,
        borderRightWidth: 0.5
    },
    container: {
        flex: 1,
        // backgroundColor: Colors.white,
        // borderRadius: 10,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: PADDING_DEFINE
    },
    circle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 19,
        height: 19,
        borderRadius: 19 / 2
    },
    txtLable_1: {
        fontSize: Size.text + 1,
        fontWeight: '500'
    },
    txtLable_2: {
        fontSize: Size.text,
        fontWeight: '400',
        marginLeft: 3
    },
    styContentItem: {
        flex: 7,
        paddingHorizontal: Size.defineSpace
    },
    styLine: {
        flexDirection: 'row',
        marginBottom: 10
    },
    styLineRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    styLineLeft: {
        flex: 1
    }
});
