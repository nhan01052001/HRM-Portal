import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { CustomStyleSheet, Colors, styleSheets, Size } from '../../constants/styleConfig';
import VnrText from '../../components/VnrText/VnrText';

export const RenderButtonChangeShift = (props) => {
    const {
        isChangeShift,
        isChangeDate,
        handleChangeShift,
        handleChangeDate
    } = props;

    return (
        <View style={[styles.flexD_align_center, CustomStyleSheet.justifyContent('space-between')]}>
            <View style={CustomStyleSheet.maxWidth('30%')}>
                <VnrText
                    numberOfLines={2}
                    style={[styleSheets.text]}
                    i18nKey={'HRM_PortalApp_DoYouWantToRegister'}
                />
            </View>
            <View>
                <View style={[styles.flexD_align_center, CustomStyleSheet.marginLeft(12)]}>
                    <TouchableOpacity
                        style={[
                            styles.btnOptionChoseDays,
                            CustomStyleSheet.marginRight(8),
                            isChangeShift
                                ? { backgroundColor: Colors.primary }
                                : { backgroundColor: Colors.Secondary95 }
                        ]}
                        onPress={() => handleChangeShift()}
                    >
                        <VnrText
                            numberOfLines={1}
                            style={[
                                styleSheets.text,
                                isChangeShift
                                    ? { color: Colors.white }
                                    : { color: Colors.black }
                            ]}
                            i18nKey={'HRM_PortalApp_ChangeShift'}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.btnOptionChoseDays,
                            isChangeDate
                                ? { backgroundColor: Colors.primary }
                                : { backgroundColor: Colors.Secondary95 }
                        ]}
                        onPress={() => handleChangeDate()}
                    >
                        <VnrText
                            numberOfLines={1}
                            style={[
                                styleSheets.text,
                                isChangeDate
                                    ? { color: Colors.white }
                                    : { color: Colors.black }
                            ]}
                            i18nKey={'HRM_PortalApp_ChangeSchedule'}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>


    )
}

const styles = StyleSheet.create({
    btnOptionChoseDays: {
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: Size.borderRadiusBotton,
        width: 110,
        justifyContent: 'center',
        alignItems: 'center'
    },

    flexD_align_center: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    }
});