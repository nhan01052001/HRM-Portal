import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, CustomStyleSheet, Size, styleSheets } from '../../../../constants/styleConfig';
export default class RenderItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    rightActionsEmpty = () => {
        return <View style={CustomStyleSheet.width(0)} />;
    };

    render() {
        const { dataItem, isSelect, index, listItemOpenSwipeOut, isDisable } = this.props,
            Content = JSON.parse(dataItem.data);
        let imageAvatar = Content ? { uri: Content.logo } : null;

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
                //onSwipeableRightOpen={() => this.onSwipeableRightOpen()}
                //onSwipeableClose={() => this.onSwipeableClose()}
                overshootRight={false}
                renderRightActions={this.rightActionsEmpty}
                friction={0.6}
                containerStyle={[styles.swipeable]}
            >
                <View style={[styles.swipeableLayout, isSelect && { backgroundColor: Colors.Secondary95 }]}>
                    <View style={[styles.container]} key={index}>
                        <View style={[styles.leftContent, isDisable ? styleSheets.opacity05 : styleSheets.opacity1]}>
                            <View style={styles.leftContentIconView}>
                                <Image source={imageAvatar} style={styles.leftContentIcon} />
                            </View>
                        </View>

                        <View style={styles.contentRight}>
                            <Text numberOfLines={2} style={[styleSheets.lable, styles.profileText]}>
                                {Content.title ? Content.title : ''}
                            </Text>
                            <Text numberOfLines={3} style={[styleSheets.text, styles.positionText]}>
                                {Content.description ? Content.description : ''}
                            </Text>
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
        paddingTop: PADDING_DEFINE,
        marginBottom: PADDING_DEFINE
    },
    profileText: {
        fontSize: Size.text + 2,
        fontWeight: '600'
    },
    positionText: {
        color: Colors.gray_8
    },
    leftContent: {
        paddingHorizontal: PADDING_DEFINE
    },
    contentRight: {
        flex: 7.2,
        justifyContent: 'flex-start',
        paddingRight: PADDING_DEFINE
    },
    leftContentIconView: {
        position: 'relative',
        backgroundColor: Colors.gray_3,
        borderRadius: 17
    },
    leftContentIcon: {
        width: Size.deviceWidth * 0.25,
        height: Size.deviceWidth * 0.27,
        resizeMode: 'contain',
        maxWidth: 150,
        maxHeight: 190,
        borderRadius: 18
    }
});
