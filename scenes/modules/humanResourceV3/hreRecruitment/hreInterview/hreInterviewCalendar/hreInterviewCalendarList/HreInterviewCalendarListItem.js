import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Clipboard } from 'react-native';
import { Colors, styleSheets, Size, CustomStyleSheet } from '../../../../../../../constants/styleConfig';
import moment from 'moment';
import { translate } from '../../../../../../../i18n/translate';
import Vnr_Function from '../../../../../../../utils/Vnr_Function';
import { IconCopy, IconDot } from '../../../../../../../constants/Icons';
import DrawerServices from '../../../../../../../utils/DrawerServices';

export class HreInterviewCalendarListItem extends Component {
    onPress = (item) => {
        const { reloadScreenList, rowActions } = this.props;
        if (item) {
            if (item.TotalCandidate != null)
                DrawerServices.navigate('HreWaitingInterview', {
                    dataItem: item,
                    reloadScreenList: reloadScreenList
                });
            else {
                DrawerServices.navigate('HreCandidateInterview', {
                    dataItem: item,
                    listActions: rowActions,
                    reloadScreenList: reloadScreenList
                });
            }
        }
    };

    render() {
        const { dataItem } = this.props;
        let listInterview = dataItem.source;

        return (
            <View style={styles.container}>
                <View style={styles.timeline}>
                    <View style={[styles.stylineIcon]}>
                        <IconDot size={Size.text} color={Colors.gray_7} />
                    </View>
                    <View style={styles.stickViewVertical} />
                </View>


                <View style={styles.itemContent}>
                    <View style={styles.itemHeader}>
                        {/* {moment(dataItem.day).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') && (
                            <Text style={[styleSheets.textFontMedium, { color: Colors.gray_10 }]}>
                                {`${translate('HRM_PortalApp_Today')}`},
                            </Text>
                        )} */}
                        <Text style={[styleSheets.lable]}>{`${dataItem.DayOfWeek} `}</Text>
                        <Text style={[styleSheets.text]}>{moment(dataItem.Date).format('DD/MM/YYYY')}</Text>
                        <View style={styles.stickViewHonrizontal} />
                    </View>
                    <View style={styles.containerBody}>
                        {listInterview.map((item, index) => {
                            const bgColorStatus = item.ColorRGB ? Vnr_Function.convertTextToColor(item.ColorRGB) : Colors.white;
                            return (
                                <TouchableWithoutFeedback key={index} onPress={() => this.onPress(item)}>
                                    <View style={styles.styViewBodyItem}>
                                        <View style={styles.styViewHeaderItem}>
                                            <View style={styles.styLeftText}>
                                                <Text style={[styleSheets.lable, styles.styTextItem]}>
                                                    {`${item.TimeInterview || ''} (${item.RoundInterviewView || ''})`}
                                                </Text>
                                            </View>

                                            {item.InterviewType == 'E_ONLINE' ? (
                                                <View style={styles.styRightText}>
                                                    <Text style={[styleSheets.lable, styles.styTextItem]}>
                                                        {item.InterviewTypeView || ''}
                                                    </Text>
                                                    <TouchableOpacity style={styles.styBtnCopy} onPress={() => Clipboard.setString(item.InterviewLink || '') }>
                                                        <IconCopy size={Size.text} color={Colors.gray_10}/>
                                                    </TouchableOpacity>
                                                </View>
                                            ) : (
                                                <View style={styles.styRightText}>
                                                    <Text style={[styleSheets.lable, styles.styTextTypeView]}>
                                                        {item.InterviewLocation || ''}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                        <View style={styles.styStickSeparate} />
                                        <View style={styles.styViewJob}>
                                            <Text style={[styleSheets.lable, styles.styTextItem]}>
                                                {item.JobVacancyName || ''}
                                            </Text>
                                        </View>

                                        {(!item.TotalCandidate) ? (
                                            <View View style={styles.styViewCandicateContent}>
                                                <View>
                                                    {Vnr_Function.renderAvatarCricleByName(
                                                        item?.ImagePath,
                                                        item?.CandidateName,
                                                        Size.AvatarSize
                                                    )}
                                                </View>
                                                <View style={styles.styViewCandicateInfo}>
                                                    <Text
                                                        style={[styleSheets.lable, styles.styTextItem]}
                                                        numberOfLines={1}
                                                    >
                                                        {item?.CandidateName || ''}
                                                    </Text>
                                                    <Text style={[styleSheets.text, styles.styTextItem]}>
                                                        {`${item?.CandidateCode ? item?.CandidateCode + ' - ' : ''}${item?.GenderView || ''} - ${item?.CandicateAge}`}
                                                    </Text>
                                                </View>
                                                <View>
                                                    <View style={styles.styViewFavorPercentStatus}>
                                                        <Text
                                                            style={[
                                                                styleSheets.lable,
                                                                CustomStyleSheet.fontSize(Size.text - 2)
                                                            ]}
                                                        >
                                                            {item?.FavorPercent}
                                                        </Text>
                                                    </View>
                                                    {item?.TagName && (
                                                        <View
                                                            style={[
                                                                styles.styViewSuiStatus,
                                                                bgColorStatus&& CustomStyleSheet.backgroundColor(bgColorStatus)
                                                            ]}
                                                        >
                                                            <Text
                                                                numberOfLines={1}
                                                                style={[
                                                                    styleSheets.lable,
                                                                    CustomStyleSheet.fontSize(Size.text - 2),
                                                                    item.Color && CustomStyleSheet.color(item.Color)
                                                                ]}
                                                            >
                                                                {item?.TagName}
                                                            </Text>
                                                        </View>
                                                    )}
                                                </View>
                                            </View>
                                        ) : (
                                            <View style={styles.styViewCandidate}>
                                                <Text style={[styleSheets.lable, styles.styTextItem]}>
                                                    {`${translate('HRM_PortalApp_TopTab_CountCandidate')} ${item.TotalCandidate}`}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </TouchableWithoutFeedback>
                            );
                        })}
                    </View>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    stylineIcon: {
        width: Size.text + 2,
        height: Size.text + 2,
        borderRadius: (Size.text + 2) / 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.gray_7
    },
    styViewFavorPercentStatus: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        backgroundColor: Colors.gray_5,
        borderRadius: Size.borderRadiusCircle,
        alignSelf: 'flex-end'
    },
    styViewSuiStatus: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        backgroundColor: Colors.gray_5,
        borderRadius: Size.borderRadiusCircle,
        marginTop: 4
    },
    styViewCandicateInfo: { marginStart: Size.defineHalfSpace, flex: 1 },
    styViewCandicateContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        paddingHorizontal: Size.defineSpace,
        paddingBottom: Size.defineHalfSpace
    },
    styStickSeparate: {
        borderBottomWidth: 0.5,
        flex: 1,
        borderBottomColor: Colors.gray_5
    },
    styViewHeaderItem: {
        paddingHorizontal: Size.defineSpace,
        paddingVertical: Size.defineSpace,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    styViewBodyItem: {
        backgroundColor: Colors.white,
        borderRadius: Size.defineHalfSpace,
        marginBottom: 12
    },
    styTextItem: {
        fontSize: Size.text - 1
    },
    styTextTypeView: {
        fontSize: Size.text - 1,
        textAlign : 'right'
    },
    styBtnCopy :{
        marginLeft :5
    },
    stickViewHonrizontal: {
        flex: 1,
        marginLeft: Size.defineHalfSpace,
        borderBottomColor: Colors.gray_6,
        borderBottomWidth: 1
    },
    styViewJob: {
        paddingHorizontal: Size.defineSpace,
        paddingTop: Size.defineHalfSpace,
        paddingBottom: Size.defineHalfSpace
    },
    styViewCandidate: {
        paddingHorizontal: Size.defineSpace,
        paddingBottom: Size.defineSpace
    },
    stickViewVertical: {
        flex: 1,
        marginTop: 2,
        borderLeftWidth: 1,
        marginBottom: 2,
        borderLeftColor: Colors.gray_6
    },
    container: {
        flexDirection: 'row'
    },
    timeline: {
        marginRight: 10,
        flexDirection: 'column',
        alignItems: 'center'
    },
    itemContent: {
        flexDirection: 'column',
        flex: 1
    },
    itemHeader: {
        marginBottom: 6,
        flexDirection: 'row',
        alignItems: 'center'
    },
    containerBody: {
        marginTop: Size.defineHalfSpace
    },
    styLeftText: {
        flexShrink: 1
    },
    styRightText: {
        flexDirection :'row',
        flexShrink: 1,
        justifyContent: 'flex-end',
        alignItems : 'center'
    }
});

export default HreInterviewCalendarListItem;
