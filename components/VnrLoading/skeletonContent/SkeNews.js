/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Colors, Size } from '../../../constants/styleConfig';
import Skeleton from './Skeleton';

const PADDING_DEFINE = Size.defineSpace;
const WIDTH_LAYOUT_ITEM = Size.deviceWidth - PADDING_DEFINE * 2;

// Chiều cao ước tính cho các thành phần
const HEIGHT_IMAGE_FEATURED = 200; // Chiều cao cố định cho ảnh
const HEIGHT_TITLE_LINE = 20;
const HEIGHT_DESC_LINE = 16;

// Tổng chiều cao của một mục tin tức
const HEIGHT_NEWS_ITEM = HEIGHT_IMAGE_FEATURED + 150; // Ảnh + khoảng 150px cho text
const MAX_HEIGHT_LAYOUT_ITEM = HEIGHT_NEWS_ITEM + PADDING_DEFINE * 2;

// Tính toán chiều rộng cho các dòng text
const CONTENT_WIDTH = WIDTH_LAYOUT_ITEM - PADDING_DEFINE * 2; // Trừ padding của skeLayout

export default class SkeNews extends React.Component {
    render() {
        const lengthSkeleton = Math.floor(Size.deviceheight / (MAX_HEIGHT_LAYOUT_ITEM + PADDING_DEFINE)) || 1;
        const newArraySkeleton = new Array(lengthSkeleton + 2).fill(0);

        return (
            <View style={styles.content}>
                <ScrollView showsVerticalScrollIndicator={false} contentInsetAdjustmentBehavior="never">
                    {newArraySkeleton.map((el, index) => {
                        return (
                            <View key={index} style={styles.skeLayout}>
                                {/* Phần ảnh lớn ở trên */}
                                <View style={styles.imagePlaceholder}>
                                    <Skeleton
                                        width={CONTENT_WIDTH}
                                        height={HEIGHT_IMAGE_FEATURED}
                                        style={{ backgroundColor: Colors.gray_5, borderRadius: 4 }}
                                    />
                                </View>
                                {/* Phần nội dung bên dưới */}
                                <View style={styles.contentPlaceholder}>
                                    {/* Tiêu đề */}
                                    <Skeleton
                                        width={CONTENT_WIDTH * 0.9}
                                        height={HEIGHT_TITLE_LINE}
                                        style={[styles.skeLine, { marginBottom: PADDING_DEFINE / 2 }]}
                                    />

                                    {/* Mô tả ngắn */}
                                    <Skeleton
                                        width={CONTENT_WIDTH}
                                        height={HEIGHT_DESC_LINE}
                                        style={[styles.skeLine, { marginBottom: PADDING_DEFINE / 2 }]}
                                    />
                                    <Skeleton
                                        width={CONTENT_WIDTH * 0.95}
                                        height={HEIGHT_DESC_LINE}
                                        style={[styles.skeLine, { marginBottom: PADDING_DEFINE / 2 }]}
                                    />
                                    <Skeleton
                                        width={CONTENT_WIDTH * 0.6}
                                        height={HEIGHT_DESC_LINE}
                                        style={styles.skeLine}
                                    />
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
        paddingHorizontal: PADDING_DEFINE,
        backgroundColor: Colors.white
    },
    skeLayout: {
        width: WIDTH_LAYOUT_ITEM,
        flexDirection: 'column',
        backgroundColor: Colors.white,
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: Colors.gray_3,
        padding: PADDING_DEFINE,
        marginBottom: PADDING_DEFINE
    },
    imagePlaceholder: {
        width: CONTENT_WIDTH,
        height: HEIGHT_IMAGE_FEATURED,
        marginBottom: PADDING_DEFINE,
        justifyContent: 'center',
        alignItems: 'center'
    },
    contentPlaceholder: {
        width: CONTENT_WIDTH,
        flexDirection: 'column',
        alignItems: 'center'
    },
    skeLine: {
        backgroundColor: Colors.gray_3,
        borderRadius: 2
    }
});
