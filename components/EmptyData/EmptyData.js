import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import VnrText from '../VnrText/VnrText';
import { styleSheets } from '../../constants/styleConfig';

export default class EmptyData extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { messageEmptyData, uriImage } = this.props;

        return (
            <View style={styles.styViewEmpty}>
                <Image
                    source={uriImage ? uriImage : require('../../assets/images/EmptyImage.png')}
                    style={styles.styViewEmptyImg}
                    resizeMode={'contain'}
                />
                <VnrText i18nKey={messageEmptyData} style={[styleSheets.text, styles.styViewEmptyText]} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    styViewEmpty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 50
    },
    styViewEmptyImg: {
        aspectRatio: 1.5,
        marginBottom: 20
    },
    styViewEmptyText: {
        textAlign: 'center'
    }
});
