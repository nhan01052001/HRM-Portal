import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, Size, styleSheets, CustomStyleSheet } from '../../../../../constants/styleConfig';
import moment from 'moment';
import format from 'number-format.js';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { translate } from '../../../../../i18n/translate';
import { IconCheck, IconDate, IconGift } from '../../../../../constants/Icons';
import Color from 'color';

export default class ItemHistoryConversion extends React.Component {
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

    rightActionsEmpty = () => {
        return <View style={CustomStyleSheet.width(0)} />;
    };

    convertTextToColor = (value) => {
        const [num1, num2, num3, opacity] = value.split(',');
        return Color.rgb(parseFloat(num1), parseFloat(num2), parseFloat(num3), parseFloat(opacity));
    };

    render() {
        const { dataItem, index, listItemOpenSwipeOut, rowActions } = this.props;

        let colorStatusView = null,
            bgStatusView = null;

        // xử lý color
        if (dataItem.itemStatus) {
            const { colorStatus, bgStatus } = dataItem.itemStatus;
            colorStatusView = colorStatus ? colorStatus : null;
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
                // renderRightActions={
                //   permissionRightAction
                //     ? () => <RightActions rowActions={rowActions} dataItem={dataItem} />
                //     : this.rightActionsEmpty
                // }
                friction={0.6}
                containerStyle={[styles.swipeable]}
            >
                <TouchableOpacity
                    style={[styles.swipeableLayout]}
                    activeOpacity={1}
                    disabled={rowActions === null || (Array.isArray(rowActions) && rowActions.length === 0)}
                    onPress={() => {
                        if (rowActions === null || (Array.isArray(rowActions) && rowActions.length === 0)) {
                            return;
                        } else {
                            this.props.onClick();
                        }
                    }}
                >
                    <View style={styles.left_isCheckbox}>
                        {rowActions === null || (Array.isArray(rowActions) && rowActions.length === 0) ? null : (
                            <View style={[styles.styRadiusCheck, this.props.isSelect && styles.itemSelected]}>
                                {this.props.isSelect && <IconCheck size={Size.iconSize - 10} color={Colors.white} />}
                            </View>
                        )}
                    </View>
                    {/* styles.container */}
                    <View activeOpacity={1} style={styles.btnRight_ViewDetail}>
                        <View style={[CustomStyleSheet.flex(1)]}>
                            <View style={[styles.contentMain]} key={index}>
                                {/* top */}
                                <View style={[styles.styViewTop]}>
                                    <View style={styles.wrapLeft}>
                                        <IconGift size={Size.iconSize} color={Colors.black} />
                                        <View style={[styles.wrapPoint, CustomStyleSheet.marginLeft(6)]}>
                                            <Text
                                                style={[
                                                    styleSheets.lable,
                                                    styles.styleTextNum,
                                                    { color: Colors.volcano }
                                                ]}
                                            >
                                                {dataItem?.ExchangePoint ? dataItem.ExchangePoint : '0'}{' '}
                                                {translate('Point')}
                                            </Text>
                                        </View>
                                        <View style={styles.divisionLine} />
                                        <View style={styles.wrapDateRequest}>
                                            <IconDate size={Size.iconSize} color={Colors.black} />
                                            <Text>
                                                {dataItem?.DateRequest
                                                    ? moment(dataItem.DateRequest).format('DD/MM/YYYY')
                                                    : ''}
                                            </Text>
                                        </View>
                                    </View>
                                    {dataItem?.Status && (
                                        <View
                                            style={[
                                                styles.lineSatus,
                                                {
                                                    backgroundColor: bgStatusView
                                                        ? Vnr_Function.convertTextToColor(bgStatusView)
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
                                                        color: colorStatusView ? colorStatusView : Colors.gray_10
                                                    }
                                                ]}
                                            >
                                                {translate(dataItem.Status)}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Swipeable>
        );
    }
}

const styles = StyleSheet.create({
    swipeable: {
        flex: 1
    },
    swipeableLayout: {
        flex: 1,
        backgroundColor: Colors.white,
        flexDirection: 'row'
    },
    styRadiusCheck: {
        width: Size.iconSize - 3,
        height: Size.iconSize - 3,
        borderRadius: (Size.iconSize - 3) / 2,
        borderWidth: 1,
        borderColor: Colors.gray_8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    contentMain: {
        flex: 1,
        justifyContent: 'center',
        paddingVertical: 12,
        paddingRight: 16
    },
    styViewTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
        // marginBottom: Size.defineHalfSpace,
    },
    styleTextNum: {
        fontSize: Size.text - 1
    },

    left_isCheckbox: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingLeft: 16
    },

    btnRight_ViewDetail: {
        flex: 1,
        zIndex: 1,
        elevation: 1
    },

    wrapPoint: {
        backgroundColor: Colors.brown_tranparent,
        paddingVertical: 2,
        paddingHorizontal: 6,
        alignSelf: 'flex-start'
    },
    lineSatus: {
        paddingHorizontal: 6,
        alignItems: 'center',
        paddingVertical: 2
    },
    lineSatus_text: {
        fontSize: Size.text - 1,
        fontWeight: '500'
    },

    itemSelected: {
        backgroundColor: Colors.primary,
        borderRadius: 100,
        borderWidth: 0
    },

    wrapLeft: {
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },

    divisionLine: {
        backgroundColor: Colors.gray_5,
        width: 1,
        height: '100%',
        marginHorizontal: 8
    },

    wrapDateRequest: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});
