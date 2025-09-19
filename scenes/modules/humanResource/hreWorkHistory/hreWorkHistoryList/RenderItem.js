import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Colors, CustomStyleSheet, styleSheets } from '../../../../../constants/styleConfig';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { translate } from '../../../../../i18n/translate';
import DrawerServices from '../../../../../utils/DrawerServices';

class RenderItem extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nextProps) {
        return !Vnr_Function.compare(nextProps?.item, this.props?.item) || nextProps?.isLock !== this.props.isLock;
    }

    render() {
        const { item, isLock, dateEffect, characters, dataFilter } = this.props;
        let rsFind = Array.isArray(dataFilter)
            ? dataFilter.find((value) => value.enum === item?.rootDataItem?.TableData)
            : null;

        return (
            <View style={styles.styViewContainer}>
                <View style={styles.styViewDetail}>
                    <View style={styles.styViewCneter}>
                        {rsFind?.icon && <Image source={rsFind.icon} />}
                        <Text numberOfLines={2} style={[styleSheets.lable, CustomStyleSheet.marginLeft(6)]}>
                            {item?.lable}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            DrawerServices.navigate('HreWorkHistorySubmitViewDetail', {
                                dataItem: { ...item?.rootDataItem, dateEffect },
                                screenName: item?.rootDataItem?.TableData,
                                isLock: isLock
                            });
                        }}
                    >
                        <Text style={[styleSheets.text, { color: Colors.blue }]}>
                            {translate('HRM_PortalApp_ViewDetail')}
                        </Text>
                    </TouchableOpacity>
                </View>
                {item?.obj1 && (
                    <View style={styles.styViewItemobj}>
                        <View style={CustomStyleSheet.width('50%')}>
                            <Text numberOfLines={2} style={[styleSheets.text, styles.styTextitemlable]}>
                                {item?.obj1?.lable}
                            </Text>
                        </View>
                        {item?.obj1?.value && (
                            <View style={CustomStyleSheet.width('50%')}>
                                {item?.obj1?.value?.valueOld && (
                                    <Text
                                        numberOfLines={2}
                                        style={[
                                            styleSheets.lable,
                                            styles.styTextValueOld,
                                            !isLock ||
                                                (item?.obj1?.value?.valueOld !== characters && styles.stytextDeco)
                                        ]}
                                    >
                                        {item?.obj1?.value?.valueOld}
                                    </Text>
                                )}
                                {item?.obj1?.value?.valueNew && (
                                    <Text numberOfLines={2} style={[styleSheets.lable, styles.styTextLable]}>
                                        {item?.obj1?.value?.valueNew}
                                    </Text>
                                )}
                            </View>
                        )}
                    </View>
                )}
                {item?.obj2 && (
                    <View style={styles.styViewItemobj}>
                        <View style={CustomStyleSheet.width('50%')}>
                            <Text numberOfLines={2} style={[styleSheets.text, styles.styTextitemlable]}>
                                {item?.obj2?.lable}
                            </Text>
                        </View>
                        {item?.obj2?.value && (
                            <View style={CustomStyleSheet.width('50%')}>
                                {item?.obj2?.value?.valueOld && (
                                    <Text
                                        numberOfLines={2}
                                        style={[
                                            styleSheets.lable,
                                            styles.styTextValueOld,
                                            !isLock ||
                                                (item?.obj2?.value?.valueOld !== characters && styles.stytextDeco)
                                        ]}
                                    >
                                        {item?.obj2?.value?.valueOld}
                                    </Text>
                                )}
                                {item?.obj2?.value?.valueNew && (
                                    <Text numberOfLines={2} style={[styleSheets.lable, styles.styTextLable]}>
                                        {item?.obj2?.value?.valueNew}
                                    </Text>
                                )}
                            </View>
                        )}
                    </View>
                )}
                {item?.obj3 && (
                    <View style={styles.styViewItemobj}>
                        <View style={CustomStyleSheet.width('50%')}>
                            <Text numberOfLines={2} style={[styleSheets.text, styles.styTextitemlable]}>
                                {item?.obj3?.lable}
                            </Text>
                        </View>
                        {item?.obj3?.value && (
                            <View style={CustomStyleSheet.width('50%')}>
                                {item?.obj3?.value?.valueOld && (
                                    <Text
                                        numberOfLines={2}
                                        style={[
                                            styleSheets.lable,
                                            styles.styTextValueOld,
                                            !isLock ||
                                                (item?.obj3?.value?.valueOld !== characters && styles.stytextDeco)
                                        ]}
                                    >
                                        {item?.obj3?.value?.valueOld}
                                    </Text>
                                )}
                                {item?.obj3?.value?.valueNew && (
                                    <Text numberOfLines={2} style={[styleSheets.lable, styles.styTextLable]}>
                                        {item?.obj3?.value?.valueNew}
                                    </Text>
                                )}
                            </View>
                        )}
                    </View>
                )}
            </View>
        );
    }
}

export default RenderItem;

const styles = StyleSheet.create({
    styViewCneter: { flexDirection: 'row', alignItems: 'center' },
    styViewDetail: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    styViewContainer: { flex: 1, backgroundColor: Colors.white, marginVertical: 6, padding: 8 },
    styViewItemobj: { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
    styTextLable: {
        color: Colors.gray_10,
        fontSize: 14,
        maxWidth: '100%'
    },
    styTextValueOld: {
        color: Colors.gray_10,
        fontSize: 14,
        maxWidth: '100%'
    },
    stytextDeco: {
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid'
    },
    styTextitemlable: { color: Colors.gray_8, fontSize: 14, maxWidth: '100%' }
});
