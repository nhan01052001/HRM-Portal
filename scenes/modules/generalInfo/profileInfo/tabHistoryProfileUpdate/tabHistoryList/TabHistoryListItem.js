import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, Size, styleSheets, styleSwipeableAction } from '../../../../../../constants/styleConfig';
import moment from 'moment';
import format from 'number-format.js';
import ActionSheet from 'react-native-actionsheet';
import Vnr_Function from '../../../../../../utils/Vnr_Function';
import { translate } from '../../../../../../i18n/translate';
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
    IconDate,
    IconUser,
    IconSwapright
} from '../../../../../../constants/Icons';
import VnrText from '../../../../../../components/VnrText/VnrText';
import { EnumName, ScreenName } from '../../../../../../assets/constant';
import Color from 'color';
import RightActions from '../../../../../../components/ListButtonMenuRight/RightActions';

export default class TabHistoryListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            widthIconBack: new Animated.Value(Size.defineSpace),
            heightIconNext: new Animated.Value(0),
            springIconBack: new Animated.Value(1),
            springIconNext: new Animated.Value(0)
        };
        this.formatStringType = this.formatStringType.bind(this);
        this.setRightAction(props);
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

        // dataItem.BusinessAllowAction = ['E_DELETE', 'E_MODIFY']
        if (!Vnr_Function.CheckIsNullOrEmpty(thisProps.rowActions)) {
            this.rightListActions = thisProps.rowActions.filter(item => {
                item.title = item.title;
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

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.isPullToRefresh !== this.props.isPullToRefresh) {
            this.setRightAction(nextProps);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
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

    formatStringType = (data, col) => {
        if (data[col.Name]) {
            if (col.DataType && col.DataType.toLowerCase() == 'datetime') {
                return moment(data[col.Name]).format(col.DataFormat);
            }
            if (col.DataType && col.DataType.toLowerCase() == 'double') {
                return format(col.DataFormat, data[col.Name]);
            } else {
                return data[col.Name];
            }
        } else {
            return '';
        }
    };

    openActionSheet = () => {
        this.ActionSheet.show();
    };

    actionSheetOnCLick = index => {
        const { dataItem } = this.props;
        !Vnr_Function.CheckIsNullOrEmpty(this.sheetActions[index].onPress) &&
            this.sheetActions[index].onPress(dataItem);
    };

    rightActionsEmpty = () => {
        return <View style={{ width: 0 }} />;
    };

    rightActions = (progress, dragX) => {
        const options = this.sheetActions.map(item => {
            return item.title;
        });
        const { dataItem } = this.props;
        return (
            <View style={{ maxWidth: 300, flexDirection: 'row', marginBottom: 0.5 }}>
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
            renderRowConfig,
            index,
            listItemOpenSwipeOut,
            rowActions,
            isOpenAction,
            numberDataSoure,
            isDisable,
            currentDetail
        } = this.props;
        let TimeCouse = '';
        if (dataItem.YearOfBirth) {
            TimeCouse = dataItem.YearOfBirth;
        }

        let colorStatusView = null,
            borderStatusView = null,
            bgStatusView = null,
            textFieldDate = '';

        // xử lý color
        if (dataItem.itemStatus) {
            const { colorStatus, borderStatus, bgStatus } = dataItem.itemStatus;
            colorStatusView = colorStatus ? colorStatus : null;
            borderStatusView = borderStatus ? borderStatus : null;
            bgStatusView = bgStatus ? bgStatus : null;
        }
        // console.log(dataItem, 'dataItem');
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
                renderRightActions={
                    rowActions != null && !isOpenAction
                        ? () => <RightActions rowActions={rowActions} dataItem={dataItem} />
                        : this.rightActionsEmpty
                }
                friction={0.6}
                containerStyle={styles.swipeable}
            >
                <View style={[styles.swipeableLayout, isSelect && { backgroundColor: Colors.Secondary95 }]}>
                    {isOpenAction && (
                        <View style={[styles.leftContent, isDisable ? { opacity: 0.5 } : { opacity: 1 }]}>
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
                                            borderColor: Colors.primary,
                                            borderWidth: 1
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
                                    <Text numberOfLines={1} style={[styleSheets.lable]}>
                                        {dataItem.FieldChange}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.styLine}>
                                <View style={styles.styLineLeft}>
                                    <Text numberOfLines={1} style={[styleSheets.text, styles.txtLableOld]}>
                                        {dataItem.InfoOld}
                                    </Text>
                                </View>

                                <IconSwapright size={Size.iconSize} color={Colors.primary} />

                                <View style={[styles.styLineLeft, { alignItems: 'flex-end' }]}>
                                    <Text numberOfLines={1} style={[styleSheets.text, styles.txtLable_1]}>
                                        {dataItem.InfoNew}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.viewStatusBottom}>
                            <View style={styles.dateTimeSubmit}>
                                <Text style={[styleSheets.textItalic, styles.dateTimeSubmit_Text]} numberOfLines={1}>
                                    {dataItem.DateCreate != null &&
                                        dataItem.DateCreate != undefined &&
                                        `${translate('E_AT_TIME')} ${moment(dataItem.DateCreate).format(
                                            'HH:mm DD/MM/YYYY'
                                        )}`}
                                </Text>
                            </View>
                            {dataItem.StatusView && (
                                <View
                                    style={[
                                        styles.lineSatus,
                                        {
                                            borderColor: borderStatusView
                                                ? this.convertTextToColor(borderStatusView)
                                                : Colors.gray_10,
                                            backgroundColor: bgStatusView
                                                ? this.convertTextToColor(bgStatusView)
                                                : Colors.white
                                        }
                                    ]}
                                >
                                    <Text
                                        numberOfLines={1}
                                        style={[
                                            styleSheets.text,
                                            styles.lineSatus_text,
                                            {
                                                color: colorStatusView
                                                    ? this.convertTextToColor(colorStatusView)
                                                    : Colors.gray_10
                                            }
                                        ]}
                                    >
                                        {dataItem.StatusView ? dataItem.StatusView : ''}
                                    </Text>
                                </View>
                            )}
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
        // flex: 1,
        // // backgroundColor: Colors.white,
        // // borderRadius: 10,
        // justifyContent: 'center',
        // flexDirection: 'row',
        // alignItems: 'center',
        // paddingVertical: PADDING_DEFINE,
        flex: 1,
        paddingTop: PADDING_DEFINE,
        marginBottom: 4
    },
    circle: {
        borderColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        width: 19,
        height: 19,
        borderRadius: 19 / 2
    },
    txtLableOld: {
        textDecorationLine: 'line-through',
        color: Colors.primary
    },
    txtLable_1: {
        fontSize: Size.text + 1,
        color: Colors.primary
    },
    txtLable_2: {
        fontSize: Size.text,
        fontWeight: '400',
        marginLeft: 3
    },
    styViewStatusColor: bgColor => {
        return {
            width: 4.5,
            height: '100%',
            backgroundColor: bgColor,
            marginLeft: Size.defineSpace / 2,
            borderRadius: 7
        };
    },
    styTypeTime: {
        fontSize: Size.text - 1,
        color: Colors.gray_7
    },
    styContentItem: {
        flex: 7,
        backgroundColor: Colors.primary_transparent_8,

        paddingVertical: Size.defineHalfSpace,
        paddingHorizontal: Size.defineSpace,
        marginBottom: Size.defineHalfSpace,

        marginHorizontal: Size.defineSpace,
        borderRadius: 7
    },
    styLine: {
        flexDirection: 'row',
        marginBottom: 5
    },
    styLineRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    styLineValue: {
        marginLeft: 10
    },
    styLineLeft: {
        flex: 1
    },
    viewStatusBottom: {
        paddingVertical: PADDING_DEFINE / 2,
        paddingHorizontal: PADDING_DEFINE,
        borderTopColor: Colors.gray_5,
        borderTopWidth: 0.5,
        flexDirection: 'row'
    },
    dateTimeSubmit: {
        alignSelf: 'flex-end',
        paddingRight: 5,
        flex: 1
    },
    dateTimeSubmit_Text: {
        fontSize: Size.text - 4,
        color: Colors.gray_10
    },
    lineSatus: {
        paddingHorizontal: 3,
        borderRadius: styleSheets.radius_5,
        alignItems: 'center',
        borderWidth: 0.5,
        paddingVertical: 2,
        paddingHorizontal: PADDING_DEFINE
    },
    lineSatus_text: {
        fontSize: Size.text - 3,
        fontWeight: '500'
    }
});
