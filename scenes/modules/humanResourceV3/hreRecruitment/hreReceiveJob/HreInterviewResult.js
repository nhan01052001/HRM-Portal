import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { styleSheets, Colors, Size } from '../../../../../constants/styleConfig';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { translate } from '../../../../../i18n/translate';
import { ScreenName } from '../../../../../assets/constant';
import DrawerServices from '../../../../../utils/DrawerServices';
import HreCandidateInterview from '../hreCandidateDetail/HreCandidateInterview';

export default class HreInterviewResult extends HreCandidateInterview {
    renderInterViewResult = (el, index) => {
        if (index == 0) {
            return (
                <TouchableOpacity key={index} style={styles.styUsResult}
                    onPress={() => {
                        if (el.ResultInterview != null)
                            DrawerServices.navigate(ScreenName.HreResultInterviewViewDetail, {
                                dataItem: el,
                                reloadScreenList: this.reload,
                                nameScreen: 'HRM_PortalApp_InterviewResultsDetails'
                            });
                    }}
                >
                    <View style={styles.styAvtaUser}>
                        <Text style={[styleSheets.text, styles.styOverallInterview]} numberOfLines={1}>
                            {translate('HRM_PortalApp_OverallInterview')}
                        </Text>
                    </View>

                    {el.ResultInterview != null && (
                        <View style={styles.styStusView}>
                            <Text style={[styleSheets.text, styles.styStusViewText]}>
                                {translate('HRM_PortalApp_CompletedInterview')}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            );
        } else if (index != 0) {
            return (
                <TouchableOpacity
                    key={index}
                    disabled={el.ResultInterview == null}
                    style={styles.styUsResult}
                    onPress={() => {
                        if (el.ResultInterview != null)
                            DrawerServices.navigate(ScreenName.HreResultInterviewViewDetail, {
                                dataItem: el,
                                reloadScreenList: this.reload,
                                nameScreen: 'HRM_PortalApp_InterviewResultsDetails'
                            });
                    }}
                >
                    <View style={styles.styAvtaUser}>
                        {Vnr_Function.renderAvatarCricleByName(el?.ImagePath, el?.ProfileNameOnly, Size.iconSize - 3)}
                        <Text style={[styleSheets.text, styles.styUsText]} numberOfLines={1}>
                            {el.ProfileNameOnly || ''}
                        </Text>
                    </View>

                    {el.ResultInterview != null && (
                        <View style={styles.styStusView}>
                            <Text style={[styleSheets.text, styles.styStusViewText]}>
                                {translate('HRM_PortalApp_CompletedInterview')}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            );
        }
    };
}

const styles = StyleSheet.create({
    styUsText: {
        fontSize: Size.textSmall - 1,
        marginLeft: 5
    },
    styOverallInterview: {
        fontSize: Size.textSmall,
        marginLeft: 5
    },
    styUsResult: {
        width: 'auto',
        flexDirection: 'row',
        backgroundColor: Colors.gray_3,
        borderRadius: Size.borderRadiusPrimary,
        // padding: 5,
        marginTop: Size.defineHalfSpace,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Size.defineHalfSpace,
        borderWidth: 0.5,
        borderColor: Colors.gray_5
    },
    styAvtaUser: {
        flexShrink: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: Size.defineHalfSpace,
        paddingRight: Size.defineSpace
    },
    styStusView: {
        backgroundColor: Colors.green_1,
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: Size.borderRadiusCircle
    },
    styStusViewText: {
        color: Colors.green,
        fontSize: Size.textSmall - 1
    }
});
