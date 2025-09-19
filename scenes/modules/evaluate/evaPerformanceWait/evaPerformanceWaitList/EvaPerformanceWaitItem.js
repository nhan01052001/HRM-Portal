import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {
    Colors,
    CustomStyleSheet,
    Size,
    styleSheets,
    styleSwipeableAction
} from '../../../../../constants/styleConfig';
import moment from 'moment';
import format from 'number-format.js';
import ActionSheet from 'react-native-actionsheet';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { translate } from '../../../../../i18n/translate';
import {
    IconEdit,
    IconCheckCirlceo,
    IconDelete,
    IconMoreHorizontal,
    IconEvaluate,
    IconInfo,
    IconProgressCheck,
    IconBack
} from '../../../../../constants/Icons';
import VnrText from '../../../../../components/VnrText/VnrText';
import { EnumName } from '../../../../../assets/constant';
export default class EvaPerformanceWaitItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.setRightAction(props);
    }

    setRightAction = (thisProps) => {
        const { dataItem } = thisProps;
        dataItem.BusinessAllowAction = ['E_EVALUATION'];
        this.sheetActions = [
            {
                title: translate('HRM_Common_Close'),
                onPress: null
            }
        ];
        if (!Vnr_Function.CheckIsNullOrEmpty(thisProps.rowActions)) {
            this.rightListActions = thisProps.rowActions.filter((item) => {
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

    formatStringType = (data, col, styleText) => {
        if (!Vnr_Function.CheckIsNullOrEmpty(data[col.Name])) {
            if (!Vnr_Function.CheckIsNullOrEmpty(data.colorStatus)) {
                return (
                    <View style={[styles.LineSatus, { backgroundColor: data.colorStatus }]}>
                        <Text style={[styleSheets.textItalic, styles.txtstyleStatus]} numberOfLines={2}>
                            {data[col.Name]}
                        </Text>
                    </View>
                );
            }
            if (col.DataType && col.DataType.toLowerCase() == 'datetime') {
                return (
                    <Text style={[styleSheets.text, { fontSize: Size.text - 2 }]} numberOfLines={1}>
                        {moment(data[col.Name]).format(col.DataFormat)}
                    </Text>
                );
            }
            if (col.DataType && col.DataType.toLowerCase() == 'double') {
                return (
                    <Text style={[styleSheets.text, { fontSize: Size.text - 2 }]} numberOfLines={1}>
                        {format(col.DataFormat, data[col.Name])}
                    </Text>
                );
            } else {
                return (
                    <Text style={[styleSheets.text, styleText]} numberOfLines={1}>
                        {data[col.Name]}
                    </Text>
                );
            }
        }
    };

    openActionSheet = () => {
        this.ActionSheet.show();
    };

    actionSheetOnCLick = (index) => {
        const { dataItem } = this.props;
        !Vnr_Function.CheckIsNullOrEmpty(this.sheetActions[index].onPress) &&
            this.sheetActions[index].onPress(dataItem);
    };

    rightActionsEmpty = () => {
        return <View style={CustomStyleSheet.width(0)} />;
    };

    rightActions = () => {
        const options = this.sheetActions.map((item) => {
            return item.title;
        });
        const { dataItem } = this.props;
        return (
            <View style={styles.styViewrightActions}>
                {!Vnr_Function.CheckIsNullOrEmpty(this.sheetActions) && this.sheetActions.length > 1 && (
                    <View style={styleSwipeableAction.viewIcon}>
                        <TouchableOpacity onPress={() => this.openActionSheet()} style={styleSwipeableAction.bnt_icon}>
                            <View style={[styleSwipeableAction.icon, { backgroundColor: Colors.gray_7 }]}>
                                <IconMoreHorizontal size={Size.iconSize} color={Colors.white} />
                            </View>
                            <Text style={[styleSheets.text]}>{translate('MoreActions')}</Text>
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
                {!Vnr_Function.CheckIsNullOrEmpty(this.rightListActions) &&
                    this.rightListActions.length > 0 &&
                    this.rightListActions.map((item, index) => {
                        let buttonColor = '',
                            iconName = '';

                        switch (item.type) {
                            case EnumName.E_MODIFY:
                                buttonColor = Colors.warning;
                                iconName = <IconEdit size={Size.iconSize} color={Colors.white} />;
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

    render() {
        const { dataItem, isSelect, index, listItemOpenSwipeOut, rowActions, isOpenAction, isDisable } = this.props;
        // let displayNameEmployee = false;

        let imageAvatar = dataItem.ImagePath ? { uri: dataItem.ImagePath } : null,
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
                ref={(ref) => {
                    this.Swipe = ref;
                    if (
                        listItemOpenSwipeOut.findIndex((value) => {
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
                containerStyle={[styles.swipeable]}
            >
                <View style={[styles.swipeableLayout, isSelect && { backgroundColor: Colors.Secondary95 }]}>
                    {isOpenAction && (
                        <View style={[styles.selectView, isDisable ? styleSheets.opacity05 : styleSheets.opacity1]}>
                            <TouchableOpacity
                                activeOpacity={isDisable ? 1 : 0.8}
                                onPress={() => {
                                    !isDisable ? this.props.onClick() : null;
                                }}
                            >
                                <View style={[styles.selectViewCircle, !this.props.isSelect && styleSheets.border1]}>
                                    {this.props.isSelect && (
                                        <IconCheckCirlceo size={Size.iconSize - 4} color={Colors.primary} />
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                    <View style={styles.container}>
                        <View style={styles.contentMain} key={index}>
                            <View
                                style={[styles.leftContent, isDisable ? styleSheets.opacity05 : styleSheets.opacity1]}
                            >
                                <View style={styles.leftContentIconView}>
                                    <Image
                                        source={
                                            imageAvatar
                                                ? imageAvatar
                                                : require('../../../../../assets/images/default-user-profile.png')
                                        }
                                        style={styles.leftContentIcon}
                                    />
                                </View>
                            </View>

                            <View style={styles.contentRight}>
                                <Text numberOfLines={1} style={[styleSheets.lable, styles.profileText]}>
                                    {dataItem.ProfileName}
                                </Text>
                                <Text numberOfLines={1} style={[styleSheets.text, styles.positionText]}>
                                    {dataItem.PositionName}
                                </Text>

                                {
                                    <View style={styles.Line}>
                                        <View style={styles.line_value}>
                                            <VnrText
                                                style={[styleSheets.text, styles.line_value_lable]}
                                                i18nKey={'HRM_Sys_Task_Type'}
                                            />

                                            <View style={[styles.viewValue]}>
                                                <Text
                                                    numberOfLines={1}
                                                    style={[styleSheets.text, styles.line_value_value]}
                                                >
                                                    {dataItem.PerformanceTypeName ? dataItem.PerformanceTypeName : ''}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={styles.line_value}>
                                            <VnrText
                                                style={[styleSheets.text, styles.line_value_lable]}
                                                i18nKey={'TotalMark'}
                                            />

                                            <View style={styles.viewValue}>
                                                <Text
                                                    numberOfLines={1}
                                                    style={[styleSheets.text, styles.line_value_value]}
                                                >
                                                    {dataItem.TotalMark ? dataItem.TotalMark : ''}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                }
                            </View>
                        </View>
                        <View style={styles.viewStatusBottom}>
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
                                                : dataItem.colorStatus
                                        }
                                    ]}
                                >
                                    {dataItem.StatusView ? dataItem.StatusView : ''}
                                </Text>
                            </View>
                            <View style={styles.dateTimeSubmit}>
                                <Text style={[styleSheets.textItalic, styles.dateTimeSubmit_Text]}>
                                    {dataItem.DateUpdate != null &&
                                        dataItem.DateUpdate != undefined &&
                                        `${translate('E_AT_TIME')} ${moment(dataItem.DateUpdate).format(
                                            'HH:mm DD/MM/YYYY'
                                        )}`}
                                </Text>
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
    styViewrightActions: { maxWidth: 300, flexDirection: 'row' },
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
        flexDirection: 'row'
    },
    container: {
        flex: 1
    },
    contentMain: {
        flex: 1,
        flexDirection: 'row',
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
        // backgroundColor: Colors.volcano_1,
        // borderColor: Color.rgb(18, 13, 224, 0.5),
        borderWidth: 0.5,
        paddingVertical: 2,
        paddingHorizontal: PADDING_DEFINE
        // backgroundColor: Color.rgb(18, 13, 224, 0.04),
    },
    dateTimeSubmit: {
        alignSelf: 'flex-end'
    },

    lineSatus_text: {
        fontSize: Size.text - 3,
        // color: Colors.volcano,
        fontWeight: '500'
    },

    txtstyleStatus: {
        color: Colors.white,
        fontWeight: '600'
    },
    Line: {
        // flex: 1,
        // height: 'auto',
        // flexDirection: "row",
        // justifyContent: 'space-between',
        // marginBottom: 5,
        backgroundColor: Colors.primary_transparent_8,
        paddingHorizontal: PADDING_DEFINE / 2,
        paddingVertical: PADDING_DEFINE / 2,
        borderRadius: 8,
        marginTop: 3
    },
    // line_value: {
    //   flexDirection: 'row',
    //   width: '100%',
    //   justifyContent: 'space-between',
    //   alignItems: 'center',
    // },
    dateTimeSubmit_Text: {
        fontSize: Size.text - 3,
        color: Colors.gray_10
    },
    line_value: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    line_value_value: {
        fontSize: Size.text - 1,
        color: Colors.primary,
        fontWeight: '500'
    },
    line_value_lable: {
        fontSize: Size.text - 2,
        marginRight: PADDING_DEFINE / 2
    },
    viewValue: {
        flex: 1,
        alignItems: 'flex-end'
    },
    leftContent: {
        paddingHorizontal: PADDING_DEFINE
    },
    contentRight: {
        flex: 7.2,
        justifyContent: 'flex-start',
        paddingRight: PADDING_DEFINE
    },
    actionRight: {
        position: 'absolute',
        top: 0,
        right: -Size.defineSpace,
        height: '100%',
        justifyContent: 'center'
    },
    leftContentIconView: {
        position: 'relative',
        borderRadius: 18
    },
    leftContentIcon: {
        width: Size.deviceWidth * 0.23,
        height: Size.deviceWidth * 0.25,
        resizeMode: 'cover',
        maxWidth: 150,
        maxHeight: 190,
        borderRadius: 18
    },
    selectView: {
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        paddingLeft: 5,
        paddingRight: 5,
        borderRightColor: Colors.gray_5,
        borderRightWidth: 0.5
    },
    selectViewCircle: {
        borderColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        width: Size.iconSize - 4,
        height: Size.iconSize - 4,
        borderRadius: (Size.iconSize - 4) / 2
    }
});
