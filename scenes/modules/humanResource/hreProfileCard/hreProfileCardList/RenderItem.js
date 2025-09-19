import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, CustomStyleSheet, Size, styleSheets } from '../../../../../constants/styleConfig';
import moment from 'moment';
import format from 'number-format.js';
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
    IconCancel
} from '../../../../../constants/Icons';
import VnrText from '../../../../../components/VnrText/VnrText';
import Color from 'color';
export default class RenderItem extends React.Component {
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
        // dataItem.BusinessAllowAction = ['E_MODIFY', 'E_SENDMAIL', 'E_DELETE', 'E_APPROVE', 'E_REJECT', 'E_CANCEL']
        this.sheetActions = [
            {
                title: translate('HRM_Common_Close'),
                onPress: null
            }
        ];
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
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.isPullToRefresh !== this.props.isPullToRefresh) {
            this.setRightAction(nextProps);
        }
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
        return <View style={CustomStyleSheet.width(0)} />;
    };

    rightActions = () => {
        const options = this.sheetActions.map(item => {
            return item.title;
        });
        const { dataItem } = this.props;

        return (
            <View style={styles.wrapRightActions}>
                {!Vnr_Function.CheckIsNullOrEmpty(this.sheetActions) && this.sheetActions.length > 1 && (
                    <View style={stylesSheetAction.viewIcon}>
                        <TouchableOpacity onPress={() => this.openActionSheet()} style={stylesSheetAction.bnt_icon}>
                            <View style={[stylesSheetAction.icon, { backgroundColor: Colors.gray_7 }]}>
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
                                buttonColor = Colors.green;
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
                                <View style={stylesSheetAction.viewIcon}>
                                    <TouchableOpacity
                                        onPress={() => item.onPress(dataItem)}
                                        style={stylesSheetAction.bnt_icon}
                                    >
                                        <View style={[stylesSheetAction.icon, { backgroundColor: buttonColor }]}>
                                            {iconName}
                                        </View>
                                        <Text style={[styleSheets.text]}>{item.title}</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        } else if (this.sheetActions.length <= 1 && index < 2) {
                            return (
                                <View style={stylesSheetAction.viewIcon}>
                                    <TouchableOpacity
                                        onPress={() => item.onPress(dataItem)}
                                        style={stylesSheetAction.bnt_icon}
                                    >
                                        <View style={[stylesSheetAction.icon, { backgroundColor: buttonColor }]}>
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
        // opacity = value.split('|')[1];
        return Color.rgb(parseFloat(num1), parseFloat(num2), parseFloat(num3), parseFloat(opacity));
        // return Color.rgb('255,153,0,0.5')
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

        let imageAvatar = dataItem.ImagePath
                ? { uri: dataItem.ImagePath }
                : require('../../../../../assets/images/default-user-profile.png'),
            colorStatusView = null,
            borderStatusView = null,
            bgStatusView = null;

        // xử lý color
        if (dataItem.itemStatus) {
            const { colorStatus, borderStatus, bgStatus } = dataItem.itemStatus;
            colorStatusView = colorStatus ? colorStatus : null;
            borderStatusView = borderStatus ? borderStatus : null;
            bgStatusView = bgStatus ? bgStatus : null;
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
                //onSwipeableRightOpen={() => this.onSwipeableRightOpen()}
                //onSwipeableClose={() => this.onSwipeableClose()}
                overshootRight={false}
                renderRightActions={rowActions != null && !isOpenAction ? this.rightActions : this.rightActionsEmpty}
                friction={0.6}
                containerStyle={[styles.swipeable]}
            >
                <View style={[styles.swipeableLayout, isSelect && { backgroundColor: Colors.Secondary95 }]}>
                    <View style={[styles.container]} key={index}>
                        <View style={[styles.leftContent, { ...CustomStyleSheet.flex(1), ...CustomStyleSheet.flexDirection('row') }]}>
                            <TouchableOpacity
                                activeOpacity={isDisable ? 1 : 0.8}
                                onPress={() => {
                                    !isDisable ? this.props.onClick() : null;
                                }}
                                style={styles.leftContentButton}
                            >
                                <View style={styles.leftContentIconView}>
                                    <Image
                                        source={imageAvatar}
                                        style={[styles.leftContentIcon, CustomStyleSheet.backgroundColor(Colors.red)]}
                                    />
                                </View>
                            </TouchableOpacity>
                            <View style={CustomStyleSheet.marginLeft(12)}>
                                <Text numberOfLines={1} style={[styleSheets.lable, styles.profileText]}>
                                    {dataItem.ProfileName}
                                </Text>
                                <Text numberOfLines={1} style={[styleSheets.text, styles.positionText]}>
                                    {dataItem.PositionName}
                                </Text>
                                <Text numberOfLines={1} style={[styleSheets.text, styles.positionText]}>
                                    {dataItem.PositionName}
                                </Text>
                            </View>
                        </View>

                        <View style={[styles.leftContent, { ...CustomStyleSheet.flex(1), ...CustomStyleSheet.marginTop(6) }]}>
                            {
                                <View style={styles.Line}>
                                    <View style={styles.viewDateNotWorking}>
                                        <VnrText
                                            style={[styleSheets.text, styles.viewDateNotWorking_lable]}
                                            i18nKey={'HRM_HR_Profile_DateStop'}
                                        />

                                        <View style={[styles.viewValue, { ...CustomStyleSheet.alignItems('flex-end') }]}>
                                            <Text
                                                numberOfLines={1}
                                                style={[styleSheets.text, styles.viewDateNotWorking_value]}
                                            >
                                                {moment(dataItem.DateStop).format('DD/MM/YYYY')}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.viewDateReason}>
                                        <VnrText
                                            style={[styleSheets.text, styles.viewDateNotWorking_lable]}
                                            i18nKey={'E_REASON'}
                                        />

                                        <View style={styles.viewValue}>
                                            <Text
                                                numberOfLines={1}
                                                style={[styleSheets.text, styles.viewDateNotWorking_value]}
                                            >
                                                {dataItem.OtherReason}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            }
                        </View>

                    </View>
                    <View style={styles.viewStatusBottom}>
                        <View style={styles.dateTimeSubmit}>
                            <Text style={[styleSheets.textItalic, styles.dateTimeSubmit_Text]}>
                                {`${translate('E_AT_TIME')} ${moment(dataItem.RequestDate).format('HH:mm DD/MM/YYYY')}`}
                            </Text>
                        </View>

                        <View
                            style={[
                                styles.lineSatus,
                                {
                                    borderColor: borderStatusView
                                        ? this.convertTextToColor(borderStatusView)
                                        : Colors.gray_10,
                                    backgroundColor: bgStatusView ? this.convertTextToColor(bgStatusView) : Colors.white
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
        position: 'relative'
    },
    container: {
        flex: 1,
        paddingTop: PADDING_DEFINE,
        marginBottom: PADDING_DEFINE / 2
    },
    viewStatusBottom: {
        paddingVertical: PADDING_DEFINE / 2,
        paddingHorizontal: PADDING_DEFINE,
        borderTopColor: Colors.gray_5,
        borderTopWidth: 0.5,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    lineSatus: {
        borderRadius: styleSheets.radius_5,
        alignItems: 'center',
        borderWidth: 0.5,
        paddingVertical: 2,
        paddingHorizontal: PADDING_DEFINE
    },
    dateTimeSubmit: {
        alignSelf: 'flex-end'
    },

    lineSatus_text: {
        fontSize: Size.text - 3,
        // color: Colors.volcano,
        fontWeight: '500'
    },
    Line: {
        flex: 1,
        // flexDirection: "row",
        justifyContent: 'center',
        // marginBottom: 5,
        backgroundColor: Colors.primary_transparent_8,
        paddingHorizontal: PADDING_DEFINE / 2,
        paddingVertical: PADDING_DEFINE / 2,
        borderRadius: 8,
        marginTop: 3
    },
    viewDateNotWorking: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    dateTimeSubmit_Text: {
        fontSize: Size.text - 3,
        color: Colors.gray_10
    },
    viewDateNotWorking_value: {
        fontSize: Size.text - 1,
        color: Colors.primary,
        fontWeight: '500'
    },
    viewDateNotWorking_lable: {
        fontSize: Size.text - 2,
        marginRight: PADDING_DEFINE / 2
    },
    viewDateReason: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center'
    },
    viewValue: {
        flex: 1
    },
    profileText: {
        fontSize: Size.text + 3,
        fontWeight: '600'
    },
    positionText: {
        color: Colors.gray_7
    },
    leftContent: {
        paddingHorizontal: PADDING_DEFINE
    },
    actionRight: {
        position: 'absolute',
        top: 0,
        right: -Size.defineSpace,
        height: '100%',
        justifyContent: 'center'
    },
    leftContentButton: {
        maxWidth: 60,
        maxHeight: 70
    },
    leftContentIconView: {
        borderRadius: 18
    },
    leftContentIcon: {
        width: Size.deviceWidth * 0.23,
        height: Size.deviceWidth * 0.25,
        resizeMode: 'cover',
        maxWidth: 60,
        maxHeight: 70,
        borderRadius: 18
    },
    wrapRightActions: { maxWidth: 300, flexDirection: 'row', marginBottom: 0.5 }
});

const stylesSheetAction = StyleSheet.create({
    bnt_icon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        height: '37%',
        width: Size.deviceWidth * 0.16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Size.defineSpace * 0.5
    },
    viewIcon: {
        marginHorizontal: Size.defineSpace
    }
});
