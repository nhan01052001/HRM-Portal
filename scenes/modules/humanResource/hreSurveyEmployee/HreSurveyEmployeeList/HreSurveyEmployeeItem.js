import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, CustomStyleSheet, Size, styleSheets } from '../../../../../constants/styleConfig';
import Vnr_Function from '../../../../../utils/Vnr_Function';

export default class RenderItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    rightActionsEmpty = () => {
        return <View style={CustomStyleSheet.width(0)} />;
    };

    render() {
        const { dataItem, isSelect, index, listItemOpenSwipeOut, isDisable } = this.props;
        let Content = dataItem.data ? JSON.parse(dataItem.data) : {};
        let imageAvatar = Content ? { uri: Content.logo } : null;

        if (Content) {
            Content = {
                ...Content,
                title: dataItem?.SurveyPortalName,
                description: dataItem?.SurveyPortalDescription
            };
        }

        const randomColor = Vnr_Function.randomColorV3(Content?.title ? Content?.title : ''),
            { PrimaryColor, SecondaryColor, FirstCharName } = randomColor;

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
                                <ImageBackground
                                    source={{ uri: imageAvatar.uri }}
                                    resizeMode="cover"
                                    style={[{ width: Size.deviceWidth * 0.25, height: Size.deviceWidth * 0.27 }]}
                                    imageStyle={[
                                        styles.styViewIamgeBAckground
                                    ]}
                                >
                                    <View
                                        // eslint-disable-next-line react-native/no-inline-styles
                                        style={{
                                            flex: 1,
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: 17,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            zIndex: 1,
                                            elevation: 1,
                                            backgroundColor: SecondaryColor
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styleSheets.textFontMedium,
                                                {
                                                    color: PrimaryColor,
                                                    fontSize:
                                                        (Size.deviceWidth * 0.25 + Size.deviceWidth * 0.27) / 2 / 2
                                                }
                                            ]}
                                        >
                                            {FirstCharName}
                                        </Text>
                                    </View>
                                </ImageBackground>
                                {/* <Image
                                    source={imageAvatar}
                                    style={styles.leftContentIcon}
                                /> */}
                                {/* {
                                Vnr_Function.renderAvatarCricleByName(imageAvatar?.uri, Content?.title, Size.deviceWidth * 0.25, null, Size.deviceWidth * 0.27)
                            } */}
                            </View>
                        </View>

                        <View style={styles.contentRight}>
                            <Text numberOfLines={2} style={[styleSheets.lable, styles.profileText]}>
                                {Content?.title ? Content.title : ''}
                            </Text>
                            <Text numberOfLines={3} style={[styleSheets.text, styles.positionText]}>
                                {Content?.description ? Content.description : ''}
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
    styViewIamgeBAckground: { width: Size.deviceWidth * 0.25,
        height: Size.deviceWidth * 0.27,
        borderRadius: 17,
        zIndex: 2,
        elevation: 2
    },
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
        marginTop: 4,
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
    }
});
