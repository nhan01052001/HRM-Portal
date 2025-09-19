import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Colors, CustomStyleSheet, Size } from '../../../constants/styleConfig';
import Skeleton from './Skeleton';

const PADDING_DEFINE = Size.defineSpace,
    WIDTH_LAYOUT_ITEM = Size.deviceWidth - PADDING_DEFINE * 2,
    WIDTH_LAYOUT_ITEM_LEFT = WIDTH_LAYOUT_ITEM * 0.3,
    WIDTH_LAYOUT_ITEM_RIGHT = WIDTH_LAYOUT_ITEM * 0.7,
    SIZE_SKE_CYCLE = WIDTH_LAYOUT_ITEM_LEFT * 0.45,
    HEIGHT_LINE = 20,
    MAX_HEIGHT_LAYOUT_ITEM = SIZE_SKE_CYCLE + PADDING_DEFINE * 2 + HEIGHT_LINE + 8;

export default class SkeApprove extends React.Component {
    render() {
        const lengthSkeleton = Math.floor(Size.deviceheight / (MAX_HEIGHT_LAYOUT_ITEM + 48)),
            newArraySkeleton = new Array(lengthSkeleton + 3).fill(0);

        return (
            <View style={styles.content}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {newArraySkeleton.map((el, index) => {
                        return (
                            <View key={index} style={styles.skeLayout}>
                                <View style={styles.skeLayoutLeft}>
                                    <Skeleton width={SIZE_SKE_CYCLE} height={SIZE_SKE_CYCLE} style={styles.skeCycle} />

                                    <Skeleton
                                        width={WIDTH_LAYOUT_ITEM}
                                        height={WIDTH_LAYOUT_ITEM}
                                        style={[
                                            styles.skeLine_3(WIDTH_LAYOUT_ITEM_LEFT * 0.75),
                                            CustomStyleSheet.marginTop(8)
                                        ]}
                                    />
                                </View>
                                <View style={styles.skeLayoutRight}>
                                    <View style={[styles.skeViewRow, CustomStyleSheet.height('100%')]}>
                                        <View
                                            style={[
                                                styles.skeViewColumn,
                                                // eslint-disable-next-line react-native/no-inline-styles
                                                {
                                                    width: WIDTH_LAYOUT_ITEM_RIGHT * 0.46,
                                                    justifyContent: 'space-between'
                                                }
                                            ]}
                                        >
                                            <Skeleton
                                                width={WIDTH_LAYOUT_ITEM_RIGHT}
                                                height={WIDTH_LAYOUT_ITEM_RIGHT}
                                                style={[
                                                    styles.skeLine_3((WIDTH_LAYOUT_ITEM_RIGHT - 16) * 0.4),
                                                    {
                                                        backgroundColor: Colors.gray_5
                                                    }
                                                ]}
                                            />
                                            <Skeleton
                                                width={WIDTH_LAYOUT_ITEM_RIGHT}
                                                height={WIDTH_LAYOUT_ITEM_RIGHT}
                                                style={[
                                                    styles.skeLine_3((WIDTH_LAYOUT_ITEM_RIGHT - 16) * 0.26),
                                                    CustomStyleSheet.height(15)
                                                ]}
                                            />
                                            <Skeleton
                                                width={WIDTH_LAYOUT_ITEM_RIGHT}
                                                height={WIDTH_LAYOUT_ITEM_RIGHT}
                                                style={[
                                                    styles.skeLine_3((WIDTH_LAYOUT_ITEM_RIGHT - 16) * 0.45),
                                                    CustomStyleSheet.height(8)
                                                ]}
                                            />
                                        </View>

                                        <View
                                            style={[
                                                styles.skeViewColumn,
                                                // eslint-disable-next-line react-native/no-inline-styles
                                                {
                                                    width: WIDTH_LAYOUT_ITEM_RIGHT * 0.46,
                                                    justifyContent: 'space-between'
                                                }
                                            ]}
                                        >
                                            <Skeleton
                                                width={WIDTH_LAYOUT_ITEM_RIGHT}
                                                height={WIDTH_LAYOUT_ITEM_RIGHT}
                                                style={[
                                                    styles.skeLine_3((WIDTH_LAYOUT_ITEM_RIGHT - 16) * 0.4),
                                                    {
                                                        backgroundColor: Colors.gray_5
                                                    }
                                                ]}
                                            />
                                            <Skeleton
                                                width={WIDTH_LAYOUT_ITEM_RIGHT}
                                                height={WIDTH_LAYOUT_ITEM_RIGHT}
                                                style={[
                                                    styles.skeLine_3((WIDTH_LAYOUT_ITEM_RIGHT - 16) * 0.26),
                                                    CustomStyleSheet.height(15)
                                                ]}
                                            />
                                            <Skeleton
                                                width={WIDTH_LAYOUT_ITEM_RIGHT}
                                                height={WIDTH_LAYOUT_ITEM_RIGHT}
                                                style={[
                                                    styles.skeLine_3((WIDTH_LAYOUT_ITEM_RIGHT - 16) * 0.45),
                                                    CustomStyleSheet.height(8)
                                                ]}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        paddingHorizontal: PADDING_DEFINE
    },
    skeLayout: {
        width: WIDTH_LAYOUT_ITEM,
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        paddingVertical: PADDING_DEFINE,
        marginBottom: PADDING_DEFINE,
        maxHeight: MAX_HEIGHT_LAYOUT_ITEM
    },
    skeLayoutLeft: {
        width: WIDTH_LAYOUT_ITEM_LEFT,
        alignItems: 'center'
    },
    skeLayoutRight: {
        width: WIDTH_LAYOUT_ITEM_RIGHT,
        justifyContent: 'space-between'
    },
    skeCycle: {
        width: SIZE_SKE_CYCLE,
        height: SIZE_SKE_CYCLE,
        backgroundColor: Colors.gray_5,
        borderRadius: SIZE_SKE_CYCLE / 2
    },
    skeLine_3: maxWidth => {
        return {
            height: HEIGHT_LINE,
            width: '100%',
            maxWidth: maxWidth,
            backgroundColor: Colors.gray_3,
            borderRadius: 2
        };
    },
    skeViewRow: {
        flexDirection: 'row'
    },
    skeViewColumn: {
        flexDirection: 'column'
    }
});
