import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import { Size, Colors, styleSheets } from '../../../../../constants/styleConfig';
import { IconRight } from '../../../../../constants/Icons';
import { translate } from '../../../../../i18n/translate';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import DrawerServices from '../../../../../utils/DrawerServices';

class AttLeaveFundManagementItem extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nextProps) {
        return !Vnr_Function.compare(nextProps?.dataItem, this.props?.dataItem);
    }

    render() {
        const { dataItem } = this.props;
        let available = dataItem?.Available !== undefined && dataItem?.Available !== null ? dataItem?.Available : 0,
            remain = dataItem?.Remain !== undefined && dataItem?.Remain !== null ? dataItem?.Remain : 0,
            usedDays = dataItem?.UsedDays !== undefined && dataItem?.UsedDays !== null ? dataItem?.UsedDays : 0,
            progressbar = available > 0 || remain > 0 ? (remain / available) * 100 : 0;

        return (
            <TouchableOpacity
                style={styles.wrapItem}
                onPress={() => {
                    DrawerServices.navigate('AttLeaveFundManagementViewDetail', {
                        fullData: this.props?.fullData,
                        title: dataItem?.TypeName,
                        Type: dataItem?.Type
                    });
                }}
            >
                <View>
                    <Text style={[styleSheets.lable, { fontSize: Size.text + 3, color: dataItem?.color }]}>
                        {translate(dataItem?.TypeName)}
                    </Text>
                </View>
                <View style={styles.wrapMiddle}>
                    <View style={styles.progressbar}>
                        <View
                            style={[styles.progressbar, { width: `${progressbar}%`, backgroundColor: dataItem?.color }]}
                        />
                    </View>
                    <View style={styles.wrapIcon}>
                        <IconRight size={Size.text + 5} color={Colors.black} />
                    </View>
                </View>
                <View>
                    <Text style={[styleSheets.text, { fontSize: Size.text + 1 }]}>
                        {translate('HRM_PortalApp_Only_Remain')}:
                        <Text style={[styleSheets.lable, { fontSize: Size.text + 1 }]}>
                            {' ' + remain} {translate('HRM_PortalApp_Only_days')}
                        </Text>{' '}
                        / {translate('HRM_PortalApp_Only_Used')}:
                        <Text style={[styleSheets.lable, { fontSize: Size.text + 1 }]}>
                            {' ' + usedDays} {translate('HRM_PortalApp_Only_days')}
                        </Text>
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    wrapItem: {
        backgroundColor: Colors.white,
        borderRadius: 4,
        padding: 16,
        justifyContent: 'space-between',
        marginVertical: 8
    },

    wrapMiddle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    progressbar: {
        flex: 0.9,
        height: 5,
        backgroundColor: Colors.gray_5,
        borderRadius: 4
    },

    wrapIcon: {
        flex: 0.1,
        alignItems: 'flex-end'
    }
});

export default AttLeaveFundManagementItem;
