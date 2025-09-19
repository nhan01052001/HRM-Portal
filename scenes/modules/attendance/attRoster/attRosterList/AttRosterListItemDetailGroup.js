import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, CustomStyleSheet, Size, styleSheets } from '../../../../../constants/styleConfig';
import moment from 'moment';
import { translate } from '../../../../../i18n/translate';
import { IconBack, IconCheckCirlceo } from '../../../../../constants/Icons';
import VnrText from '../../../../../components/VnrText/VnrText';
import Color from 'color';
export default class AttRosterListItemDetailGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    convertTextToColor = value => {
        const [num1, num2, num3, opacity] = value.split(',');
        return Color.rgb(parseFloat(num1), parseFloat(num2), parseFloat(num3), parseFloat(opacity));
    };

    renderItem = () => {
        return <View />;
    };

    renderItemIsGroup = () => {
        const { dataItem, isSelect, index, isOpenAction, isDisable } = this.props,
            listConfigRoster = [
                {
                    Name: 'MonShiftName'
                },
                {
                    Name: 'TueShiftName'
                },
                {
                    Name: 'WedShiftName'
                },
                {
                    Name: 'ThuShiftName'
                },
                {
                    Name: 'FriShiftName'
                },
                {
                    Name: 'SatShiftName'
                },
                {
                    Name: 'SunShiftName'
                }
            ];

        let TimeCouse = dataItem.DateStart ? moment(dataItem.DateStart).format('DD/MM/YYYY') : '',
            valueShiftChange = '',
            colorStatusView = null,
            borderStatusView = null,
            bgStatusView = null;

        for (let i = 0; i < 7; i++) {
            let e = listConfigRoster[i];
            if (dataItem[e.Name] !== null) {
                valueShiftChange = dataItem[e.Name];
                break;
            }
        }

        // xử lý color
        if (dataItem.itemStatus) {
            const { colorStatus, borderStatus, bgStatus } = dataItem.itemStatus;
            colorStatusView = colorStatus ? colorStatus : null;
            borderStatusView = borderStatus ? borderStatus : null;
            bgStatusView = bgStatus ? bgStatus : null;
        }

        return (
            <View style={styles.swipeable}>
                <View style={[styles.swipeableLayout, isSelect && { backgroundColor: Colors.Secondary95 }]}>
                    {isOpenAction && (
                        <View style={[styles.selectView, isDisable ? styleSheets.opacity05 : styleSheets.opacity1]}>
                            <TouchableOpacity
                                activeOpacity={isDisable ? 1 : 0.8}
                                onPress={() => {
                                    !isDisable ? this.props.onClick() : null;
                                }}
                            >
                                <View
                                    style={[
                                        styles.selectViewCircle,
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
                        <View style={styles.line}>
                            <View style={styles.line_value}>
                                <VnrText i18nKey={'E_DAY'} style={[styleSheets.text, styles.line_value_lable]} />
                                <View style={styles.line_time_wrap}>
                                    <Text style={[styleSheets.text, styles.line_value_value]} numberOfLines={1}>
                                        {TimeCouse}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.line_value}>
                                <VnrText
                                    i18nKey={'HRM_PortalApp_Roster_ShiftChanges'}
                                    style={[styleSheets.text, styles.line_value_lable]}
                                />
                                <View style={styles.line_time_wrap}>
                                    <Text
                                        numberOfLines={1}
                                        style={[styleSheets.text, styles.line_value_value]}
                                    >
                                        {valueShiftChange}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.viewStatusBottom}>
                            <View style={styles.dateTimeSubmit}>
                                <Text style={[styleSheets.textItalic, styles.dateTimeSubmit_Text]}>
                                    {dataItem.DateCreate != null &&
                                        dataItem.DateCreate != undefined &&
                                        `${translate('E_AT_TIME')} ${moment(dataItem.DateCreate).format(
                                            'HH:mm DD/MM/YYYY'
                                        )}`}
                                </Text>
                            </View>
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
                        </View>
                    </View>
                </View>

                {Array.isArray(this.rightListActions) && this.rightListActions.length > 0 && (
                    <View style={styles.actionRight}>
                        <IconBack color={Colors.gray_7} size={Size.defineSpace} />
                    </View>
                )}
            </View>
        );
    };

    render() {
        const { dataItem } = this.props;

        return dataItem.isGroup ? this.renderItemIsGroup() : this.renderItem();
    }
}

const PADDING_DEFINE = Size.defineSpace;
const styles = StyleSheet.create({
    swipeable: {
        flex: 1,
        paddingHorizontal: Size.defineSpace,
        marginBottom: Size.defineSpace
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
        flex: 1,
        paddingTop: PADDING_DEFINE,
        marginBottom: 4
    },
    line_time_wrap: {
        flex: 1,
        alignItems: 'flex-end'
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
        fontWeight: '500'
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
    },
    actionRight: {
        position: 'absolute',
        top: 0,
        right: -Size.defineSpace,
        height: '100%',
        justifyContent: 'center'
    },
    line: {
        marginHorizontal: PADDING_DEFINE,
        marginBottom: PADDING_DEFINE / 2,
        paddingHorizontal: PADDING_DEFINE / 2,
        justifyContent: 'center',
        backgroundColor: Colors.primary_transparent_8,
        paddingVertical: PADDING_DEFINE / 2,
        borderRadius: 8
    },
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
        fontSize: Size.text - 1,
        marginRight: PADDING_DEFINE / 2
    }
});
