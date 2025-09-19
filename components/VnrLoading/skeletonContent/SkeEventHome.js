/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Colors, CustomStyleSheet, Size } from '../../../constants/styleConfig';
import Skeleton from './Skeleton';

const PADDING_DEFINE = Size.defineSpace,
    WIDTH_LAYOUT_ITEM = Size.deviceWidth - PADDING_DEFINE * 2,
    WIDTH_LAYOUT_ITEM_LEFT = WIDTH_LAYOUT_ITEM * 0.3,
    WIDTH_LAYOUT_ITEM_RIGHT = WIDTH_LAYOUT_ITEM,
    SIZE_SKE_CYCLE = WIDTH_LAYOUT_ITEM_LEFT * 0.45,
    HEIGHT_LINE = 20,
    MAX_HEIGHT_LAYOUT_ITEM = SIZE_SKE_CYCLE + PADDING_DEFINE * 2 + HEIGHT_LINE + 20;

export default class SkeEventHome extends React.Component {
    render() {
        return (
            <View style={styles.content}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.skeLayout}>
                        <View style={styles.skeLayoutRight}>
                            <View style={[styles.skeViewColumn, CustomStyleSheet.height('100%')]}>
                                <Skeleton
                                    width={WIDTH_LAYOUT_ITEM_RIGHT}
                                    height={WIDTH_LAYOUT_ITEM_RIGHT}
                                    style={[
                                        styles.skeLine_3((WIDTH_LAYOUT_ITEM_RIGHT - 16) * 0.5),
                                        // eslint-disable-next-line react-native/no-inline-styles
                                        {
                                            backgroundColor: Colors.gray_7,
                                            height: 20,
                                            marginBottom: Size.defineSpace * 1.5
                                        }
                                    ]}
                                />
                                <Skeleton
                                    width={WIDTH_LAYOUT_ITEM_RIGHT}
                                    height={WIDTH_LAYOUT_ITEM_RIGHT}
                                    style={[
                                        styles.skeLine_3((WIDTH_LAYOUT_ITEM_RIGHT - 16) * 0.4),
                                        {
                                            backgroundColor: Colors.gray_5,
                                            marginBottom: Size.defineHalfSpace
                                        }
                                    ]}
                                />
                                <View style={[styles.skeViewRow]}>
                                    <View
                                        style={[
                                            styles.skeViewColumn,
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
                                                styles.skeLine_3((WIDTH_LAYOUT_ITEM_RIGHT - 16) * 0.7),
                                                {
                                                    height: 15,
                                                    marginBottom: Size.defineHalfSpace
                                                }
                                            ]}
                                        />
                                        <Skeleton
                                            width={WIDTH_LAYOUT_ITEM_RIGHT}
                                            height={WIDTH_LAYOUT_ITEM_RIGHT}
                                            style={[
                                                styles.skeLine_3((WIDTH_LAYOUT_ITEM_RIGHT - 16) * 0.7),
                                                {
                                                    marginRight: 8,
                                                    marginBottom: Size.defineHalfSpace
                                                }
                                            ]}
                                        />
                                    </View>

                                    <View
                                        style={[
                                            styles.skeViewColumn,
                                            {
                                                width: WIDTH_LAYOUT_ITEM_RIGHT * 0.46,
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-end',
                                                marginLeft: 25
                                            }
                                        ]}
                                    >
                                        <Skeleton
                                            width={WIDTH_LAYOUT_ITEM_RIGHT}
                                            height={WIDTH_LAYOUT_ITEM_RIGHT}
                                            style={[
                                                styles.skeLine_3((WIDTH_LAYOUT_ITEM_RIGHT - 16) * 0.25),
                                                {
                                                    height: 15,
                                                    marginBottom: Size.defineHalfSpace
                                                }
                                            ]}
                                        />
                                        <Skeleton
                                            width={WIDTH_LAYOUT_ITEM_RIGHT}
                                            height={WIDTH_LAYOUT_ITEM_RIGHT}
                                            style={[
                                                styles.skeLine_3((WIDTH_LAYOUT_ITEM_RIGHT - 16) * 0.25),
                                                {
                                                    marginBottom: Size.defineHalfSpace
                                                }
                                            ]}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
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
        marginBottom: PADDING_DEFINE,
        maxHeight: MAX_HEIGHT_LAYOUT_ITEM
    },
    skeLayoutRight: {
        width: WIDTH_LAYOUT_ITEM_RIGHT,
        justifyContent: 'space-between'
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
