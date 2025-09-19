import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, CustomStyleSheet, Size, styleSheets } from '../../../../../../constants/styleConfig';
export default class RenderTitleWeeks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    rightActionsEmpty = () => {
        return <View style={CustomStyleSheet.width(0)} />;
    };
    render() {
        const { dataItem, index, listItemOpenSwipeOut } = this.props;
        return (
            <Swipeable
                ref={(ref) => {
                    this.Swipe = ref;
                    if (!listItemOpenSwipeOut[index]) {
                        listItemOpenSwipeOut[index] = { ID: index, value: ref };
                    } else {
                        listItemOpenSwipeOut[index].value = ref;
                    }
                }}
                overshootRight={false}
                renderRightActions={this.rightActionsEmpty}
                friction={0.6}
                index={index}
            >
                <View style={styles.viewDateStart}>
                    <View style={styles.viewDateStart_line} />
                    <View>
                        <Text style={[styleSheets.textFontMedium, styles.viewDateStart_text]}>
                            {dataItem.TitleWeek}
                        </Text>
                    </View>
                    <View style={styles.viewDateStart_line} />
                </View>
            </Swipeable>
        );
    }
}

const styles = StyleSheet.create({
    viewDateStart: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: Size.defineSpace,
        marginVertical: Size.defineSpace
    },
    viewDateStart_line: {
        flex: 1,
        height: 0.5,
        backgroundColor: Colors.gray_5
    },
    viewDateStart_text: {
        color: Colors.gray_9,
        fontSize: Size.text - 1,
        marginHorizontal: Size.defineSpace
    }
});
