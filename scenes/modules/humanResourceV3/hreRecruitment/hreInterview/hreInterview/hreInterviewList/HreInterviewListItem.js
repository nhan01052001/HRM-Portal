import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Colors, CustomStyleSheet, Size, styleSheets } from '../../../../../../../constants/styleConfig';
import Vnr_Function from '../../../../../../../utils/Vnr_Function';
import VnrFormatStringTypeItem from '../../../../../../../componentsV3/VnrFormatStringType/VnrFormatStringTypeItem';
import RightActions from '../../../../../../../componentsV3/ListButtonMenuRight/RightActions';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Color from 'color';
export default class HreInterviewListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.Swipe = null;
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

    renderStatusView = (dataItem) => {
        if (dataItem.TagName) {
            let colorStatusView = dataItem.Color,
                bgStatusView = dataItem.ColorRGB ? Vnr_Function.convertTextToColor(dataItem.ColorRGB) : null;
            return (
                <View style={styles.contentRight}>
                    <View
                        style={[
                            styles.lineSatus,
                            {
                                backgroundColor: bgStatusView ? bgStatusView : Colors.white
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
                            {dataItem.TagName}
                        </Text>
                    </View>
                </View>
            );
        }

        return <View />;
    };

    render() {
        const { dataItem, index, listItemOpenSwipeOut, rowActions, isDisable, renderConfig, handerOpenSwipeOut } = this.props;
        let _renderConfig = [];
        if (renderConfig && renderConfig.length > 0)
            _renderConfig = renderConfig.filter((config) => config.TypeView !== 'E_STATUS');

        dataItem.BusinessAllowAction = 'E_ENTER_INTERVIEW';
        let permissionRightAction =
        rowActions != null &&
            Array.isArray(rowActions) &&
            rowActions.length > 0
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
                renderRightActions={ permissionRightAction
                    ? () => <RightActions rowActions={rowActions} dataItem={dataItem} />
                    : this.rightActionsEmpty}
                friction={0.6}
                containerStyle={[styles.swipeableLayout]}
            >
                <TouchableWithoutFeedback
                    onPressIn={() => handerOpenSwipeOut && handerOpenSwipeOut(index)}
                    onPress={() => {
                        this.props.onMoveDetail();
                    }}
                >
                    <View style={styles.swipeableLayout}>
                        <View style={styles.container}>
                            <View style={styles.styViewTop}>
                                <View
                                    style={[
                                        styles.leftContent,
                                        isDisable ? styleSheets.opacity05 : styleSheets.opacity1
                                    ]}
                                >
                                    {Vnr_Function.renderAvatarCricleByName(
                                        dataItem.ImagePath,
                                        dataItem.CandidateName,
                                        Size.AvatarSize
                                    )}
                                </View>

                                <View style={styles.contentCenter}>
                                    <Text numberOfLines={1} style={[styleSheets.lable, styles.profileText]}>
                                        {dataItem.CandidateName}
                                    </Text>

                                    <Text numberOfLines={1} style={[styleSheets.text, styles.positionText]}>
                                        {`${dataItem?.CodeCandidate ? dataItem?.CodeCandidate + ' - ' : ''}${dataItem?.GenderView || ''} - ${dataItem?.CandicateAge || ''}`}
                                    </Text>
                                </View>

                                {/* top right */}
                                <View
                                    style={[styles.viewContentTopRight, CustomStyleSheet.justifyContent('flex-start')]}
                                >
                                    {/* sub top right */}
                                    <View style={[styles.subTopRight, CustomStyleSheet.marginBottom(6)]}>
                                        <Text
                                            numberOfLines={1}
                                            style={[
                                                styleSheets.lable,
                                                styles.lineSatus_text,
                                                CustomStyleSheet.textAlign('center')
                                            ]}
                                        >
                                            {`${dataItem?.Percent}%`}
                                        </Text>
                                    </View>

                                    {/* render status */}
                                    {this.renderStatusView(dataItem)}
                                </View>
                            </View>

                            <View style={styles.styProgress}>
                                {_renderConfig.map((col, index) => (
                                    <VnrFormatStringTypeItem
                                        key={index}
                                        data={dataItem}
                                        col={col}
                                        allConfig={_renderConfig}
                                    />
                                ))}
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Swipeable>
        );
    }
}

const PADDING_DEFINE = Size.defineSpace;
const styles = StyleSheet.create({
    swipeableLayout: {
        flex: 1,
        backgroundColor: Colors.white
    },
    container: {
        flex: 1,
        paddingHorizontal: Size.defineSpace,
        paddingVertical: Size.defineHalfSpace
    },
    styViewTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Size.defineHalfSpace
    },
    leftContent: {
        marginRight: Size.defineHalfSpace,
        justifyContent: 'center'
    },
    contentCenter: {
        flex: 7.2,
        paddingRight: PADDING_DEFINE,
        justifyContent: 'center'
    },
    contentRight: {
        justifyContent: 'center'
    },
    profileText: {
        fontSize: Size.text - 1
    },
    positionText: {
        fontSize: Size.text - 2
    },
    lineSatus: {
        // paddingHorizontal: 3,
        alignItems: 'center',
        // paddingVertical: 2,
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: Size.borderRadiusCircle
    },
    lineSatus_text: {
        fontSize: Size.text - 2,
        fontWeight: '500'
    },
    // ============= //
    styProgress: {
        flex: 1,
        borderRadius: 3
        // paddingBottom: Size.defineHalfSpace
        // marginHorizontal: Size.defineHalfSpace
    },
    viewContentTopRight: {
        // width: '30%',
        maxWidth: '33%',
        justifyContent: 'center',
        paddingRight: 12
    },
    subTopRight: {
        backgroundColor: Colors.gray_3,
        borderRadius: Size.borderRadiusCircle,
        paddingHorizontal: Size.defineHalfSpace,
        paddingVertical: 5
    }
});
