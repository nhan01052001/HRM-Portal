import React from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, CustomStyleSheet, Size, styleSheets } from '../../../../../../constants/styleConfig';
import moment from 'moment';
import { IconDate, IconUser } from '../../../../../../constants/Icons';
import Color from 'color';
export default class ContractHistoryListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            widthIconBack: new Animated.Value(Size.defineSpace),
            heightIconNext: new Animated.Value(0),
            springIconBack: new Animated.Value(1),
            springIconNext: new Animated.Value(0)
        };
        this.Swipe = null;
    }

    UNSAFE_componentWillReceiveProps() {
        // if (nextProps.isPullToRefresh !== this.props.isPullToRefresh) {
        //   this.setRightAction(nextProps);
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

    rightActionsEmpty = () => {
        return <View style={CustomStyleSheet.width(0)} />;
    };

    convertTextToColor = value => {
        const [num1, num2, num3, opacity] = value.split(',');
        return Color.rgb(parseFloat(num1), parseFloat(num2), parseFloat(num3), parseFloat(opacity));
    };

    render() {
        const { dataItem, index, listItemOpenSwipeOut } = this.props;

        let colorStatusView = null,
            textFieldContract = '',
            bgStatusView = null;

        // xử lý color
        if (dataItem.itemStatus) {
            const { colorStatus, bgStatus } = dataItem.itemStatus;
            colorStatusView = colorStatus ? colorStatus : null;
            bgStatusView = bgStatus ? bgStatus : null;
        }

        if (dataItem.ContractNo != null) {
            textFieldContract = dataItem.ContractNo;
        }

        if (dataItem?.NumberExtend) {
            textFieldContract =
                textFieldContract != '' ? `${textFieldContract}, ${dataItem?.NumberExtend}` : dataItem?.NumberExtend;
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
                renderRightActions={this.rightActionsEmpty}
                friction={0.6}
                containerStyle={[styles.swipeable]}
            >
                <View style={[styles.swipeableLayout]}>
                    <View style={styles.left_isCheckbox} />
                    <View style={styles.btnRight_ViewDetail}>
                        <View style={CustomStyleSheet.flex(1)}>
                            <View style={[styles.contentMain]} key={index}>
                                {/* Top - left */}
                                <View style={styles.wh69}>
                                    <Text numberOfLines={2} style={[styleSheets.lable, styles.styleTextViewTop]}>
                                        {`${dataItem?.ContractTypeName}  `}

                                        <Text style={[styleSheets.text, styles.styTexTimeTop]}>
                                            {` ${dataItem.DurationView}  `}
                                        </Text>
                                    </Text>

                                    <View style={styles.styleFlex1_row_AlignCenter}>
                                        {textFieldContract != '' && (
                                            <Text style={[styleSheets.lable, styles.styleTextType]} numberOfLines={1}>
                                                {textFieldContract}
                                            </Text>
                                        )}
                                    </View>
                                </View>

                                {/* Top - right */}
                                <View style={styles.viewContentTopRight}>
                                    <View
                                        style={[
                                            styles.lineSatus,
                                            {
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
                                                    color: colorStatusView ? colorStatusView : Colors.gray_10
                                                }
                                            ]}
                                        >
                                            {dataItem.StatusEvaView ? dataItem.StatusEvaView : ''}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={[styles.viewStatusBottom]}>
                                <View style={styles.styViewPosition}>
                                    <IconUser size={Size.text - 1} color={Colors.gray_7} />

                                    <Text style={[styleSheets.text, styles.dateTimeSubmit_Text]} numberOfLines={1}>
                                        {dataItem.PositionName ? dataItem.PositionName : ''}
                                    </Text>
                                </View>

                                {dataItem?.DateSigned && (
                                    <View style={styles.styViewDate}>
                                        <IconDate size={Size.text - 1} color={Colors.gray_7} />

                                        <Text style={[styleSheets.text, styles.dateTimeSubmit_Text]}>
                                            {moment(dataItem.DateSigned).format('DD/MM/YYYY')}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                </View>
            </Swipeable>
        );
    }
}

const PADDING_DEFINE = Size.defineSpace;
const styles = StyleSheet.create({
    styViewDate: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: Size.defineSpace
    },
    styViewPosition: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    swipeable: {
        flex: 1
    },
    swipeableLayout: {
        flex: 1,
        backgroundColor: Colors.white,
        flexDirection: 'row'
    },
    viewStatusBottom: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: PADDING_DEFINE / 2,
        paddingRight: Size.defineSpace,
        flexDirection: 'row'
    },
    lineSatus: {
        // paddingHorizontal: 3,
        alignItems: 'center',
        // paddingVertical: 2,
        padding: 4
    },
    lineSatus_text: {
        fontSize: Size.text - 3,
        fontWeight: '500'
    },
    dateTimeSubmit_Text: {
        fontSize: Size.text - 2,
        color: Colors.gray_8,
        marginLeft: 3
    },
    contentMain: {
        flex: 1,
        paddingTop: Size.defineHalfSpace,
        flexDirection: 'row',
        justifyContent: 'space-between'
        // paddingHorizontal: Size.defineSpace,
    },

    styleFlex1_row_AlignCenter: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    styleTextViewTop: {
        // fontWeight: fw,
        color: Colors.gray_10,
        fontSize: Size.text + 1
    },
    styTexTimeTop: {
        backgroundColor: Colors.gray_3,
        paddingHorizontal: Size.defineSpace,
        marginLeft: Size.defineSpace
    },
    styleTextType: {
        fontWeight: Platform.OS == 'android' ? '600' : '500',
        color: Colors.gray_10,
        fontSize: Size.text - 2
    },

    left_isCheckbox: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingLeft: 8
    },
    btnRight_ViewDetail: {
        flex: 1,
        zIndex: 1,
        elevation: 1
    },
    viewContentTopRight: {
        // width: '30%',
        maxWidth: '33%',
        justifyContent: 'center',
        paddingRight: 12
    },
    wh69: { width: '69%', maxWidth: '69%' }
});
