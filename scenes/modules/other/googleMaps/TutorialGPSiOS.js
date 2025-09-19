/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import { Size, styleSheets, Colors } from '../../../../constants/styleConfig';

const arrImageLangVN = [
    {
        step: 'Bước 1',
        title: (
            <Text style={[styleSheets.text]}>
                {' '}
                Vào <Text style={[{ fontWeight: 'bold', fontSize: Size.text + 2 }]}>cài đặt</Text> tại giao diện chính
                của điện thoại.
            </Text>
        ),
        image: require('../../../../assets/images/GPS/step01.jpg')
    },
    {
        step: 'Bước 2',
        title: (
            <Text style={[styleSheets.text]}>
                {' '}
                Chọn <Text style={[{ fontWeight: 'bold', fontSize: Size.text + 2 }]}>quyền riêng tư</Text>{' '}
            </Text>
        ),
        image: require('../../../../assets/images/GPS/step02.jpg')
    },
    {
        step: 'Bước 3',
        title: (
            <Text style={[styleSheets.text]}>
                {' '}
                Chọn <Text style={[{ fontWeight: 'bold', fontSize: Size.text + 2 }]}>dịch vụ định vị</Text> {'->'} Kéo
                để bật lên.{' '}
            </Text>
        ),
        image: require('../../../../assets/images/GPS/step03.jpg')
    },
    {
        step: 'Bước 4',
        title: (
            <Text style={[styleSheets.text]}>
                {' '}
                Chọn <Text style={[{ fontWeight: 'bold', fontSize: Size.text + 2 }]}>ứng dụng</Text> {'->'} cho phép{' '}
                <Text style={[{ fontWeight: 'bold', fontSize: Size.text + 2 }]}>VnResource HRM Pro</Text> cập nhật vị
                trí{' '}
            </Text>
        ),
        image: require('../../../../assets/images/GPS/step04.jpg')
    }
];

class TutorialGPSiOS extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    render() {
        return (
            <View>
                <FlatList
                    data={arrImageLangVN}
                    renderItem={({ item }) => (
                        <View key={item.title} style={styles.cardItem}>
                            <View style={styles.textView}>
                                <Text>
                                    <Text style={[styleSheets.text, styles.textStep]}>{item.step}:</Text>
                                    {item.title}
                                </Text>
                            </View>

                            <View style={{}}>
                                <Image source={item.image} style={styles.imageTu} />
                            </View>
                        </View>
                    )}
                />
            </View>
        );
    }
}

export default TutorialGPSiOS;

const styles = StyleSheet.create({
    cardItem: {
        width: Size.deviceWidth,
        backgroundColor: Colors.white,
        paddingHorizontal: Size.defineSpace
    },
    imageTu: {
        height: 600,
        width: Size.deviceWidth - Size.defineSpace * 2,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: Colors.gray_5
    },
    textStep: {
        fontWeight: 'bold',
        fontSize: Size.text + 2
    },
    textView: {
        marginVertical: Size.defineSpace,
        marginTop: 25
    }
});
