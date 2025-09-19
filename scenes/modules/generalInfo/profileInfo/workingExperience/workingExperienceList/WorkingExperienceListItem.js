import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, CustomStyleSheet, Size, styleSheets } from '../../../../../../constants/styleConfig';
import moment from 'moment';
import format from 'number-format.js';
import Vnr_Function from '../../../../../../utils/Vnr_Function';
import { translate } from '../../../../../../i18n/translate';
import { IconBack, IconCheckCirlceo } from '../../../../../../constants/Icons';
import VnrText from '../../../../../../components/VnrText/VnrText';
import Color from 'color';
import RightActions from '../../../../../../components/ListButtonMenuRight/RightActions';

export default class WorkingExperienceListItem extends React.Component {
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
    setRightAction = (thisProps) => {
        const { dataItem } = thisProps;
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

    actionSheetOnCLick = (index) => {
        const { dataItem } = this.props;
        !Vnr_Function.CheckIsNullOrEmpty(this.sheetActions[index].onPress) &&
            this.sheetActions[index].onPress(dataItem);
    };

    rightActionsEmpty = () => {
        return <View style={CustomStyleSheet.margin(0)} />;
    };

    convertTextToColor = (value) => {
        const [num1, num2, num3, opacity] = value.split(',');
        return Color.rgb(parseFloat(num1), parseFloat(num2), parseFloat(num3), parseFloat(opacity));
    };

    render() {
        const { dataItem, isSelect, index, listItemOpenSwipeOut, rowActions, isOpenAction, isDisable } = this.props;

        // eslint-disable-next-line no-unused-vars
        let viewRate = <View />,
            colorStatusView = null,
            borderStatusView = null,
            bgStatusView = null;

        viewRate = (
            <View style={[styles.lineLeft, CustomStyleSheet.borderRightWidth(0)]}>
                <View style={styles.line_date_row}>
                    <VnrText
                        i18nKey={'HRM_Payroll_UnusualED_ProfileName'}
                        style={[styleSheets.text, styles.line_lable]}
                    />
                    <View style={[styles.line_time_wrap]}>
                        <Text
                            style={[styleSheets.text, styles.line_text, CustomStyleSheet.textAlign('right')]}
                            numberOfLines={1}
                        >
                            {dataItem.ProfileName ? dataItem.ProfileName : ''}
                        </Text>
                    </View>
                </View>

                {/* nơi đi */}
                <View style={styles.line_date_row}>
                    <VnrText
                        i18nKey={'HRM_Sal_PITFinalizationDelegatee_Year'}
                        style={[styleSheets.text, styles.line_lable]}
                    />
                    <View style={styles.line_time_wrap}>
                        <Text style={[styleSheets.text, styles.line_text]} numberOfLines={1}>
                            {dataItem.Year ? dataItem.Year : ''}
                        </Text>
                    </View>
                </View>
            </View>
        );

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
                renderRightActions={
                    rowActions != null && !isOpenAction
                        ? () => <RightActions rowActions={rowActions} dataItem={dataItem} />
                        : this.rightActionsEmpty
                }
                friction={0.6}
                containerStyle={styles.swipeable}
            >
                <View
                    style={[
                        styles.swipeableLayout,
                        isSelect && { backgroundColor: Colors.primary_transparent_8 },
                        dataItem.WarningViolation && { borderColor: Colors.red }
                    ]}
                >
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
                                        !this.props.isSelect && CustomStyleSheet.borderWidth(1)
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
                        <View style={styles.Line}>
                            <View style={[styles.lineLeft, CustomStyleSheet.borderRightWidth(0)]}>
                                <View style={styles.line_date_row}>
                                    <Text
                                        style={[
                                            styleSheets.text,
                                            styles.line_text,
                                            CustomStyleSheet.textAlign('right')
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {dataItem.CompanyName ? dataItem.CompanyName : ''}
                                    </Text>
                                </View>

                                <View style={styles.line_date_row}>
                                    <VnrText
                                        i18nKey={'HRM_Rec_RecruimentInternal_Specialized'}
                                        style={[styleSheets.text, styles.line_lable]}
                                    />
                                    <View style={[styles.line_time_wrap]}>
                                        <Text
                                            style={[
                                                styleSheets.text,
                                                styles.line_text,
                                                CustomStyleSheet.textAlign('right')
                                            ]}
                                            numberOfLines={1}
                                        >
                                            {dataItem.Major ? dataItem.Major : ''}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.line_date_row}>
                                    <VnrText
                                        i18nKey={'HRM_REC_Candidate_YearExperience'}
                                        style={[styleSheets.text, styles.line_lable]}
                                    />
                                    <View style={styles.line_time_wrap}>
                                        <Text style={[styleSheets.text, styles.line_text]} numberOfLines={1}>
                                            {dataItem.YearOfExperience}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={styles.viewStatusBottom}>
                            <View style={styles.dateTimeSubmit}>
                                <Text numberOfLines={1} style={[styleSheets.textItalic, styles.dateTimeSubmit_Text]}>
                                    {dataItem.DateCreate != null &&
                                        dataItem.DateCreate != undefined &&
                                        `${translate('E_AT_TIME')} ${moment(dataItem.DateCreate).format(
                                            'HH:mm DD/MM/YYYY'
                                        )}`}
                                </Text>
                            </View>

                            {dataItem.StatusView != null && (
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
                                        {dataItem.StatusView != null ? dataItem.StatusView : ''}
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
        flexDirection: 'row'
    },
    container: {
        flex: 1,
        // flexDirection: 'row',
        paddingTop: Size.defineSpace,
        marginBottom: 4
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
        alignSelf: 'flex-end',
        paddingRight: 5,
        flex: 1
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
    line_time_wrap: {
        flex: 1,
        alignItems: 'flex-end'
    },
    actionRight: {
        position: 'absolute',
        top: 0,
        right: -Size.defineSpace,
        height: '100%',
        justifyContent: 'center'
    },
    Line: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor: Colors.primary_transparent_8,
        paddingHorizontal: Size.defineSpace,
        //paddingVertical: Size.defineHalfSpace,
        //marginHorizontal: Size.defineSpace,
        marginBottom: Size.defineHalfSpace
    },
    lineLeft: {
        flex: 6,
        borderRightColor: Colors.primary,
        borderRightWidth: 0.3,
        paddingRight: Size.defineSpace / 2
    },
    dateTimeSubmit_Text: {
        fontSize: Size.text - 4,
        color: Colors.gray_10
    },
    // line_Time: {
    //   flex: 1,
    //   paddingHorizontal: PADDING_DEFINE / 2,
    //   justifyContent: 'center',
    //   backgroundColor: Colors.primary_transparent_8,
    //   paddingVertical: PADDING_DEFINE / 2,
    //   borderRadius: 8,
    // },
    // line_time_text: {
    //   fontSize: Size.text + 3,
    //   color: Colors.primary,
    //   fontWeight: '600',
    //   marginRight: 2,
    // },
    // line_date: {
    //   flex: 1,
    //   marginLeft: PADDING_DEFINE / 2,
    //   paddingHorizontal: PADDING_DEFINE / 2,
    //   justifyContent: 'center',
    //   backgroundColor: Colors.primary_transparent_8,
    //   paddingVertical: PADDING_DEFINE / 2,
    //   borderRadius: 8,
    // },
    line_date_row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    line_text: {
        fontSize: Size.text,
        color: Colors.black,
        fontWeight: '500'
    },
    line_lable: {
        fontSize: Size.text,
        color: Colors.gray_8
    }
});
