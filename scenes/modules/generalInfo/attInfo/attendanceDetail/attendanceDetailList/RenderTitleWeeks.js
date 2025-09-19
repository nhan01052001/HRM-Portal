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
                renderRightActions={this.rightActionsEmpty}
                friction={0.6}
                index={index}
            >
                <View style={styles.itemContent}>
                    {dataItem.TitleWeek && (
                        <Text style={[styleSheets.text, styles.styleTitleWeek]}>{dataItem.TitleWeek}</Text>
                    )}
                </View>
            </Swipeable>
        );
    }
}

const styles = StyleSheet.create({
    itemContent: {
        backgroundColor: Colors.navy,
        flexDirection: 'row',
        paddingVertical: 17,
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.borderColor
    },
    styleTitleWeek: {
        fontSize: Size.text + 1,
        fontWeight: '600',
        textAlign: 'center',
        color: Colors.white
    }
});
