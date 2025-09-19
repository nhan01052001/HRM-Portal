import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, CustomStyleSheet, Size, styleSheets } from '../../../../../constants/styleConfig';

export default class HreSurveyHistoryItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    rightActionsEmpty = () => {
        return <View style={CustomStyleSheet.width(0)} />;
    };

    render() {
        const { dataItem, isSelect, index, listItemOpenSwipeOut } = this.props,
            Content = dataItem;

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
                <View style={[styles.swipeableLayout, isSelect && { backgroundColor: Colors.Secondary95 }]}>
                    <View style={[styles.container]} key={index}>
                        <View style={styles.styViewStatusColor} />

                        <View style={styles.contentRight}>
                            <Text numberOfLines={2} style={[styleSheets.lable, styles.profileText]}>
                                {Content.name ? Content.name : ''}
                            </Text>

                            {Content.surveyTitle && (
                                <Text numberOfLines={3} style={[styleSheets.text, styles.positionText]}>
                                    {Content.surveyTitle}
                                </Text>
                            )}

                            {Content.createdDate && (
                                <Text numberOfLines={3} style={[styleSheets.text, styles.dateText]}>
                                    {Content.createdDate}
                                </Text>
                            )}
                        </View>
                    </View>
                </View>
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
        flexDirection: 'row',
        paddingVertical: PADDING_DEFINE,
        paddingHorizontal: Size.defineHalfSpace + 4
    },
    styViewStatusColor: {
        width: 3.5,
        height: '100%',
        backgroundColor: Colors.primary,
        marginRight: Size.defineHalfSpace,
        borderRadius: 7
    },
    profileText: {
        fontSize: Size.text + 2,
        fontWeight: '600'
    },
    positionText: {
        marginTop: 4,
        color: Colors.gray_8
    },
    dateText: {
        fontSize: Size.text - 1,
        marginTop: 4,
        color: Colors.gray_7
    },
    contentRight: {
        flex: 7.2,
        justifyContent: 'flex-start'
    }
});
