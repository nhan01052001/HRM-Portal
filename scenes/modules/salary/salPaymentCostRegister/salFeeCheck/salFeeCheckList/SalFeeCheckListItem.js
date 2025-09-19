import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, CustomStyleSheet, Size, styleSheets } from '../../../../../../constants/styleConfig';
import moment from 'moment';
import format from 'number-format.js';
import Vnr_Function from '../../../../../../utils/Vnr_Function';
import { translate } from '../../../../../../i18n/translate';
import { IconBack, IconCheckCirlceo } from '../../../../../../constants/Icons';
import Color from 'color';
import RightActions from '../../../../../../components/ListButtonMenuRight/RightActions';

export default class SalFeeCheckListItem extends React.Component {
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
        return <View style={CustomStyleSheet.width(0)} />;
    };

    convertTextToColor = (value) => {
        const [num1, num2, num3, opacity] = value.split(',');
        return Color.rgb(parseFloat(num1), parseFloat(num2), parseFloat(num3), parseFloat(opacity));
    };

    render() {
        const { dataItem, isSelect, index, listItemOpenSwipeOut, rowActions, isOpenAction, isDisable } = this.props;

        const configShowData = [
            {
                DisplayKey: 'HRM_PortalApp_RequestPeriod',
                Value: 'RequestPeriodName'
            },
            {
                DisplayKey: 'HRM_PortalApp_PeriodPay',
                Value: 'PaymentPeriodName'
            },
            {
                DisplayKey: 'HRM_PortalApp_PaymentCostsGroup',
                Value: 'PaymentCostGroupName'
            },
            {
                DisplayKey: 'HRM_PortalApp_CostPaymentAmount',
                Value: 'PaymentAmountName'
            },
            {
                DisplayKey: 'HRM_PortalApp_FromDate',
                Value: 'FromDate',
                TypeValue: 'Date'
            },
            {
                DisplayKey: 'HRM_PortalApp_ToDate',
                Value: 'ToDate',
                TypeValue: 'Date'
            },
            {
                DisplayKey: 'HRM_PortalApp_Quantity',
                Value: 'Quantity'
            },
            {
                DisplayKey: 'HRM_PortalApp_NumberOfItemsComputedBySystem',
                Value: 'QuantitySystem'
            },
            {
                DisplayKey: 'HRM_PortalApp_Unit',
                Value: 'UnitView'
            },
            {
                DisplayKey: 'HRM_PortalApp_DataNote',
                Value: 'DataNote'
            }
        ];

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
                        isSelect && { backgroundColor: Colors.Secondary95 }
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
                                    style={[styles.selectViewCircle, !this.props.isSelect && styles.styCheckSelected]}
                                >
                                    {this.props.isSelect && (
                                        <IconCheckCirlceo size={Size.iconSize - 4} color={Colors.primary} />
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={[styles.container]}>
                        {
                            configShowData.map((item, index) => {
                                return (
                                    <View style={styles.Line} key={index}>
                                        <View style={styles.lineLeft}>
                                            <Text
                                                numberOfLines={2}
                                                style={[styleSheets.text, styles.text]}
                                            >
                                                {translate(item.DisplayKey)}
                                            </Text>
                                        </View>

                                        <View style={styles.lineRight}>
                                            <Text
                                                numberOfLines={2}
                                                style={[styleSheets.text, styles.text]}
                                            >
                                                {dataItem[item.Value]
                                                    ? item?.TypeValue && item?.TypeValue === 'Date'
                                                        ? moment(dataItem[item.Value]).format('DD/MM/YYYY')
                                                        : dataItem[item.Value]
                                                    : ''}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })
                        }
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
    styCheckSelected: { borderColor: Colors.primary, borderWidth: 1 },
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
        paddingTop: PADDING_DEFINE,
        marginBottom: 4
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
    Line: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: Size.defineSpace,
        marginBottom: Size.defineHalfSpace
    },
    lineLeft: {
        flex: 5.5,
        justifyContent: 'flex-start'
    },
    lineRight: {
        flex: 4.5,
        justifyContent: 'flex-start',
        paddingLeft: Size.defineHalfSpace
    },
    text: {
        fontSize: 16,
        textAlign: 'left'
    }
});
