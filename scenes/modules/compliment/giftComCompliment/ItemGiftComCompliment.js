import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Platform } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, Size, styleSheets, CustomStyleSheet } from '../../../../constants/styleConfig';
import moment from 'moment';
import format from 'number-format.js';
import Vnr_Function from '../../../../utils/Vnr_Function';
import { translate } from '../../../../i18n/translate';
import { IconPlus, IconMinus } from '../../../../constants/Icons';
import Color from 'color';
import RightActions from '../../../../componentsV3/ListButtonMenuRight/RightActions';

const fw = Platform.OS == 'android' ? '700' : '500';

export default class ItemGiftComCompliment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            widthIconBack: new Animated.Value(Size.defineSpace),
            heightIconNext: new Animated.Value(0),
            springIconBack: new Animated.Value(1),
            springIconNext: new Animated.Value(0),
            isShowMore: false,
            numberOfLines: 1
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
    shouldComponentUpdate(nextProps, nextState) {
        if (
            nextProps.isPullToRefresh !== this.props.isPullToRefresh ||
            nextProps.isSelect !== this.props.isSelect ||
            nextProps.isOpenAction !== this.props.isOpenAction ||
            nextProps.isDisable !== this.props.isDisable ||
            nextState.isShowMore !== this.state.isShowMore ||
            nextState.numberOfLines !== this.state.numberOfLines ||
            nextProps.isRefreshItem !== this.props.isRefreshItem
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
        const { dataItem, index, listItemOpenSwipeOut, rowActions, isOpenAction } = this.props,
            { isShowMore, numberOfLines } = this.state;

        let permissionRightAction =
            rowActions != null &&
            Array.isArray(rowActions) &&
            rowActions.length > 0 &&
            !isOpenAction &&
            this.rightListActions &&
            Array.isArray(this.rightListActions) &&
            this.rightListActions.length > 0
                ? true
                : false;

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
                    permissionRightAction
                        ? () => <RightActions rowActions={rowActions} dataItem={dataItem} />
                        : this.rightActionsEmpty
                }
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
                    <View style={styles.styViewContainer}>
                        <View style={styles.styViewFlex}>
                            <View>
                                {dataItem?.Image && (
                                    <Image source={{ uri: dataItem?.Image }} style={styles.styImageView} />
                                )}
                            </View>
                            <View style={styles.styViewItemRender}>
                                {/* title */}
                                <View>
                                    <Text numberOfLines={1} style={[styleSheets.lable, styles.title]}>
                                        {dataItem?.Title}
                                    </Text>
                                </View>

                                {/* description */}
                                <View style={styles.styViewDescription}>
                                    <Text
                                        numberOfLines={numberOfLines}
                                        style={[styles.description, isShowMore && styles.styDescMore]}
                                        onTextLayout={(e) => {
                                            const { lines } = e.nativeEvent;
                                            if (lines.length > 1) {
                                                this.setState({
                                                    isShowMore: true
                                                });
                                            } else {
                                                this.setState({
                                                    isShowMore: false
                                                });
                                            }
                                        }}
                                    >
                                        {dataItem?.Description}
                                    </Text>
                                    {isShowMore && (
                                        <View style={styles.styBtnShowMore}>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                onPress={() => {
                                                    this.setState({
                                                        numberOfLines: numberOfLines === 3 ? 1 : 3
                                                    });
                                                }}
                                            >
                                                <Text style={[styles.description, styles.styTextDescription]}>
                                                    {numberOfLines === 1
                                                        ? translate('HRM_Common_Showmore')
                                                        : translate('Hrm_Common_Colspan')}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>

                                {/* quantity */}
                                <View>
                                    <Text style={styles.description}>
                                        {translate('RemainCost')}: {dataItem?.Remaining} | {translate('Đã đổi')}:{' '}
                                        {dataItem?.Exchange}
                                    </Text>
                                </View>

                                {/* point && btn Add */}
                                <View style={styles.styViewBtnWrap}>
                                    {/* point */}
                                    <View>
                                        <Text style={[styleSheets.lable, styles.title, { color: Colors.blue }]}>
                                            {dataItem?.Cost} {translate('Point')}
                                        </Text>
                                    </View>

                                    {/* btn Add */}
                                    {dataItem?.isSelect && dataItem?.quantitySelected > 0 ? (
                                        <View style={styles.styViewBtnAdd}>
                                            <TouchableOpacity
                                                style={[styles.styTouchAddOrMinus, styles.btnAddOrMinus]}
                                                onPress={() => {
                                                    this.props.onMinus();
                                                }}
                                            >
                                                <IconMinus size={20} color={Colors.primary} />
                                            </TouchableOpacity>
                                            <Text style={[styleSheets.lable, styles.styTextQuantitySelected]}>
                                                {isNaN(Number(dataItem?.quantitySelected)) === false
                                                    ? dataItem?.quantitySelected < 10
                                                        ? '0' + dataItem?.quantitySelected
                                                        : dataItem?.quantitySelected
                                                    : '0'}
                                            </Text>
                                            <TouchableOpacity
                                                style={[{ backgroundColor: Colors.primary }, styles.btnAddOrMinus]}
                                                onPress={() => {
                                                    this.props.onAdd();
                                                }}
                                            >
                                                <IconPlus size={20} color={Colors.white} />
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <TouchableOpacity
                                            style={styles.styBtnPlus}
                                            onPress={() => {
                                                this.props.onClick();
                                            }}
                                        >
                                            <IconPlus size={20} color={Colors.white} />
                                            <Text
                                                style={[
                                                    styles.description,
                                                    { fontSize: Size.text + 1, color: Colors.white }
                                                ]}
                                            >
                                                {translate('HRM_Common_SearchAdd')}
                                            </Text>
                                        </TouchableOpacity>
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
    styImageView: { width: 90, height: 90 },
    styTextQuantitySelected: { paddingHorizontal: 12, fontSize: Size.text + 1 },
    styBtnPlus: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        paddingHorizontal: 6,
        paddingVertical: 8,
        borderRadius: 2
    },
    styTouchAddOrMinus: {
        backgroundColor: Colors.white,
        borderColor: Colors.primary,
        borderWidth: 0.5
    },
    styViewBtnAdd: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    styViewBtnWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    styTextDescription: { color: Colors.gray_8, fontSize: Size.text, fontWeight: '600' },
    styBtnShowMore: { height: '100%', flexDirection: 'row', alignItems: 'flex-end' },
    styDescMore: { maxWidth: '78%' },
    styViewDescription: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
    styViewItemRender: { marginLeft: 12, flex: 1, width: '100%', height: '100%', justifyContent: 'space-between' },
    styViewFlex: { flex: 1, flexDirection: 'row', alignItems: 'center' },
    styViewContainer: { flex: 1, padding: 12 },
    swipeable: {
        flex: 1
    },
    swipeableLayout: {
        flex: 1,
        backgroundColor: Colors.white
    },

    title: {
        fontWeight: fw
    },

    description: {
        fontSize: Size.text - 1,
        color: Colors.gray_7,
        fontWeight: '500'
    },

    btnAddOrMinus: {
        padding: 4
    }
});
