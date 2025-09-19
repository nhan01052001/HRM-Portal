import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import { Colors, Size, styleSheets } from '../../../../constants/styleConfig';

const arrImageLangEN = [
    {
        step: 'Step 1',
        title: (
            <Text style={[styleSheets.text]}>
                {' '}
                Go to <Text style={styles.textStep}>settings</Text> at the main
                interface of the phone
            </Text>
        ),
        image: require('../../../../assets/images/GPS/step1_EN.jpg')
    },
    {
        step: 'Step 2',
        title: (
            <Text style={[styleSheets.text]}>
                {' '}
                Choose <Text style={styles.textStep}>Privacy</Text>{' '}
            </Text>
        ),
        image: require('../../../../assets/images/GPS/step02_EN.jpg')
    },
    {
        step: 'Step 3',
        title: (
            <Text style={[styleSheets.text]}>
                {' '}
                Choose <Text style={styles.textStep}>
                    Location services
                </Text> {'->'} Drag to turn on.{' '}
            </Text>
        ),
        image: require('../../../../assets/images/GPS/step03_EN.jpg')
    },
    {
        step: 'Step 4',
        title: (
            <Text style={[styleSheets.text]}>
                {' '}
                Choose <Text style={styles.textStep} /> {'->'} allow VnResource HRM
                Pro to update location{' '}
            </Text>
        ),
        image: require('../../../../assets/images/GPS/step04_EN.jpg')
    }
];

class TutorialGPSiOSEN extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View>
                <FlatList
                    data={arrImageLangEN}
                    renderItem={({ item }) => (
                        <View key={item.title} style={styles.cardItem}>
                            <View style={styles.textView}>
                                <Text style={styleSheets.text}>
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

export default TutorialGPSiOSEN;

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
