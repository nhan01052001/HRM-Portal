import React, { Component } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import VnrText from '../../components/VnrText/VnrText';
import { Colors, styleSheets } from '../../constants/styleConfig';

export default class EmptyDataSearch extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { messageEmptyData, uriImage, valueSearch } = this.props;

        return (
            <View style={styles.styContent}>
                <Image
                    source={uriImage ? uriImage : require('../../assets/images/approval/Group.png')}
                    style={styles.styImg}
                    resizeMode={'contain'}
                />
                <View style={styles.styViewSearch}>
                    <VnrText
                        i18nKey={messageEmptyData}
                        style={[
                            styleSheets.text,
                            styles.styTextSearch
                        ]}
                    />
                    <Text
                        style={[
                            styleSheets.text,
                            styles.styTextSearch
                        ]}
                    >
                        {`"${valueSearch}"`}
                    </Text>
                </View>
                <VnrText
                    i18nKey={'Kiểm tra lại chính tả hoặc nhập lại tên khác'}
                    style={[
                        styleSheets.text,
                        styles.styMess
                    ]}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    styContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 50
    },
    styImg: {
        aspectRatio: 1.5,
        marginBottom: 20
    },
    styViewSearch: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    styTextSearch : {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '700'
    },
    styMess : {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '400',
        color: Colors.gray_7
    }
});
