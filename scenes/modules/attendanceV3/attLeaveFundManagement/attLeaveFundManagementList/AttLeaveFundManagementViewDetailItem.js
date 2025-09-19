import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { styleSheets, Size, Colors } from '../../../../../constants/styleConfig';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { translate } from '../../../../../i18n/translate';

class AttLeaveFundManagementViewDetailItem extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nextProps) {
        return !Vnr_Function.compare(nextProps?.dataItems, this.props?.dataItems);
    }

    render() {
        const { dataItems } = this.props;

        return (
            <View
                style={styles.container}
            >
                <Text style={[styleSheets.text, { fontSize: Size.text + 2 }]}>{translate(dataItems?.lable)}</Text>
                <Text style={[styleSheets.text, { fontSize: Size.text + 2 }]}>{dataItems?.item}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray_3,
        paddingHorizontal: 16,
        paddingVertical: 10
    }
});

export default AttLeaveFundManagementViewDetailItem;
