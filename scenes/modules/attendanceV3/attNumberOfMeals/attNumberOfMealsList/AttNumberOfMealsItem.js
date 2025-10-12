/* eslint-disable react-native/no-raw-text */
import React from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    StyleSheet
} from 'react-native';
import { Colors, CustomStyleSheet, Size, styleSheets, styleListItemV3 } from '../../../../../constants/styleConfig';
import {
    IconChat,
    IconSun,
    IconSunCloud,
    IconMoon,
    IconMoonStar
} from '../../../../../constants/Icons';
import VnrRenderListItem from '../../../../../componentsV3/VnrRenderList/VnrRenderListItem';
import { translate } from '../../../../../i18n/translate';
export default class MealCalendarItem extends VnrRenderListItem {

    mealTimeConfigs = () => {
        return [
            {
                label: 'Sáng',
                range: [4, 10],
                color: Colors.yellow,
                icon: (size, color) => <IconSun size={size + 6} color={color} />
            },
            {
                label: 'Trưa',
                range: [11, 13],
                color: Colors.orange,
                icon: (size, color) => <IconSunCloud size={size} color={color} />
            },
            {
                label: 'Chiều/Tối',
                range: [14, 19],
                color: Colors.purple,
                icon: (size, color) => <IconMoon size={size} color={color} />
            },
            {
                label: 'Khuya',
                range: [20, 23],
                color: Colors.gray_7,
                icon: (size, color) => <IconMoonStar size={size} color={color} />
            },
            {
                label: 'Khuya',
                range: [0, 3],
                color: Colors.gray_7,
                icon: (size, color) => <IconMoonStar size={size} color={color} />
            }
        ]
    }
    getMealTimeIcon = (MealTimeName) => {
        if (!MealTimeName) return null;
        const hour = parseInt(MealTimeName.replace('H', ''), 10);

        const config = this.mealTimeConfigs().find(
            ({ range }) => hour >= range[0] && hour <= range[1]
        );

        const color = config?.color ?? Colors.gray_7;
        const iconFn = config?.icon ?? ((size, color) => <IconMoonStar size={size} color={color} />);

        return (
            <View style={[styles.wrapICon, CustomStyleSheet.backgroundColor(color)]}>
                {iconFn(Size.iconSize, Colors.white)}
            </View>
        );

    };


    renderMealTimeCard = (mealTime, index) => {
        const totalMeals = mealTime.ToTalMeal ?? 0;

        return (
            <View key={index} style={[styles.mealTimeCard]}>
                <View style={styles.mealTimeHeader}>
                    <View style={[CustomStyleSheet.flexDirection('row'), CustomStyleSheet.alignItems('center')]}>
                        <View style={styles.mealTimeIconContainer}>{this.getMealTimeIcon(mealTime.MealTimeName)}</View>
                        <View style={[CustomStyleSheet.justifyContent('space-between'), CustomStyleSheet.marginLeft(16)]}>
                            <Text style={[styles.MealTimeName, CustomStyleSheet.marginBottom(2)]}>{mealTime.MealTimeName}</Text>
                            <Text style={[styles.MealTimeName, CustomStyleSheet.marginTop(2)]}>{translate('HRM_PortalApp_MealTime')}</Text>
                        </View>
                    </View>
                    <View style={[styles.totalMealBadge]}>
                        <Text style={styles.totalMealText}>{totalMeals} {translate('HRM_PortalApp_Meal')}</Text>
                    </View>
                </View>

                <View style={styles.orgListContainer}>
                    {mealTime.ListMealByOrgDetail?.map((org, orgIndex) => (
                        <View key={orgIndex} >
                            <View style={styles.orgItem}>
                                <Text style={styles.orgName} numberOfLines={2}>
                                    {org.OrgStructureName}
                                </Text>
                                <View>
                                    <View style={styles.mealStatsRow}>
                                        <Text style={[styles.normalMeal]}>{org.TotalMeal} {translate('HRM_PortalApp_Meal')}</Text>
                                    </View>
                                </View>
                            </View>
                            <View
                                style={[
                                    CustomStyleSheet.flexDirection('row'),
                                    CustomStyleSheet.alignItems('center'),
                                    CustomStyleSheet.justifyContent('flex-end'),
                                    CustomStyleSheet.marginTop(org.TotalMealGuest > 0 || org.TotalMealOT > 0 ? -8 : 0)
                                ]}>
                                {org.TotalMealGuest > 0 && (
                                    <Text style={[styles.statText, styles.guestMeal]}>{org.TotalMealGuest} {translate('HRM_PortalApp_GuestMeal')}</Text>
                                )}
                                {org.TotalMealOT > 0 && (
                                    <Text style={[styles.statText, styles.otMeal]}>{org.TotalMealOT} {translate('HRM_PortalApp_OTMeal')}</Text>
                                )}
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    render() {
        const {
            dataItem,
            index,
            hiddenFiled
        } = this.props;

        // Handle hidden fields
        hiddenFiled &&
            typeof hiddenFiled == 'object' &&
            Object.keys(hiddenFiled).forEach(key => {
                if (!hiddenFiled[key]) {
                    dataItem[key] = null;
                }
            });

        return (
            <View
                style={[styles.swipeable]}
            >
                <View style={[styles.swipeableLayout, CustomStyleSheet.backgroundColor(Colors.gray_4), CustomStyleSheet.paddingHorizontal(12)]}>
                    <TouchableWithoutFeedback>
                        <View style={styles.btnRight_ViewDetail}>
                            <View style={[CustomStyleSheet.flex(1)]}>
                                <View style={[styles.contentMain]} key={index}>
                                    {/* Meal times cards */}
                                    <View>
                                        {dataItem.ListMealByOrg?.map((mealTime, mealIndex) =>
                                            this.renderMealTimeCard(mealTime, mealIndex)
                                        )}
                                    </View>

                                    {/* Notes section if exists */}
                                    {dataItem.DataNote && (
                                        <View style={styles.wrapContentCenter}>
                                            <View style={styles.styIconMess}>
                                                <IconChat size={Size.text + 1} color={Colors.gray_8} />
                                            </View>
                                            <View style={styles.wrapReason}>
                                                <Text
                                                    numberOfLines={2}
                                                    style={[styleSheets.text, styles.viewReason_text]}
                                                >
                                                    {dataItem.DataNote}
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ...styleListItemV3,
    mealTimeCard: {
        backgroundColor: Colors.white,
        borderRadius: 8,
        marginBottom: 12,
        padding: Size.defineHalfSpace
    },
    mealTimeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.gray_5
    },
    mealTimeIconContainer: {
        marginRight: Size.defineHalfSpace / 2
    },
    MealTimeName: {
        fontSize: Size.text,
        fontWeight: '600',
        color: Colors.gray_10
    },
    totalMealBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4
    },
    totalMealText: {
        color: Colors.black,
        fontSize: 24,
        fontWeight: 'bold'
    },
    orgListContainer: {
        // Container for organization list
    },
    orgItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12
    },
    orgName: {
        fontSize: 16,
        fontWeight: '400',
        color: Colors.black,
        maxWidth: '70%'
    },
    mealStatsRow: {
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 100,
        backgroundColor: Colors.blue_1
    },
    normalMeal: {
        color: Colors.blue,
        fontWeight: '500',
        fontSize: 14
    },
    wrapICon: {
        width: 56,
        height: 56,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    statText: {
        fontSize: Size.text - 2,
        marginRight: Size.defineHalfSpace,
        marginBottom: 2
    },
    guestMeal: {
        color: Colors.green,
        fontWeight: '500'
    },
    otMeal: {
        color: Colors.red,
        fontWeight: '500'
    }
});