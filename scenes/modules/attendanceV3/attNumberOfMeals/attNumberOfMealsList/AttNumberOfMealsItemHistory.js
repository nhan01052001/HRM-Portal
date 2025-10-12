/* eslint-disable react-native/no-raw-text */
import React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import { Colors, CustomStyleSheet } from '../../../../../constants/styleConfig';
import VnrRenderListItem from '../../../../../componentsV3/VnrRenderList/VnrRenderListItem';
import { translate } from '../../../../../i18n/translate';

export default class AttNumberOfMealsItemHistory extends VnrRenderListItem {

    renderTextItem = (text1 = null, text2 = null) => {
        if (!text1 || !!text2) return <View />;

        return (
            <View
                style={styles.containerTextItem}
            >
                <Text
                    style={styles.text1}
                >{text1}</Text>
                <Text
                    style={styles.text2}
                >{text2}</Text>
            </View>
        )
    }

    render() {
        const {
            dataItem,
            isLastItem
        } = this.props;

        return (
            <View
                style={[styles.container, CustomStyleSheet.marginBottom(isLastItem ? 0 : 8)]}
            >
                {
                    dataItem?.OrgStructureName && (
                        <Text
                            style={styles.orgStructureName}
                        >{dataItem?.OrgStructureName}</Text>
                    )
                }

                <View style={CustomStyleSheet.marginTop(8)}>
                    {this.renderTextItem(`${translate('HRM_PortalApp_TotalMeal')}`, dataItem?.TotalMeal)}
                </View>
                <View style={CustomStyleSheet.marginTop(6)}>
                    {this.renderTextItem(`${translate('HRM_PortalApp_TotalOTMeal')}`, dataItem?.TotalMealOT)}
                </View>
                <View style={CustomStyleSheet.marginTop(6)}>
                    {this.renderTextItem(`${translate('HRM_PortalApp_TotalGuestMeal')}`, dataItem?.TotalMealGuest)}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: Colors.gray_3
    },

    containerTextItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    text1: {
        fontSize: 14,
        fontWeight: '400',
        color: Colors.black
    },

    text2: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.black
    },

    orgStructureName: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.blue
    }
});