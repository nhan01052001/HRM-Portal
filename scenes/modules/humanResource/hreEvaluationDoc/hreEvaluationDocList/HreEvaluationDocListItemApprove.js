import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, CustomStyleSheet, Size, styleSheets } from '../../../../../constants/styleConfig';
import moment from 'moment';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { translate } from '../../../../../i18n/translate';
import { IconInfo, IconBack, IconCheckCirlceo } from '../../../../../constants/Icons';
import VnrText from '../../../../../components/VnrText/VnrText';
import Color from 'color';
import RightActions from '../../../../../components/ListButtonMenuRight/RightActions';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';

export default class HreEvaluationDocListItemApprove extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.setRightAction(props);
        this.Swipe = null;
    }

    setRightAction = thisProps => {
        const { dataItem } = thisProps;
        // dataItem.BusinessAllowAction = ['E_MODIFY', 'E_SENDMAIL', 'E_DELETE', 'E_APPROVE', 'E_REJECT', 'E_CANCEL']
        this.sheetActions = [
            {
                title: translate('HRM_Common_Close'),
                onPress: null
            }
        ];
        if (!Vnr_Function.CheckIsNullOrEmpty(thisProps.rowActions)) {
            this.rightListActions = thisProps.rowActions.filter(item => {
                return (
                    !Vnr_Function.CheckIsNullOrEmpty(dataItem.BusinessAllowAction) &&
                    dataItem.BusinessAllowAction.indexOf(item.type) >= 0
                );
            });
        }
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.isPullToRefresh !== this.props.isPullToRefresh) {
            this.setRightAction(nextProps);
        }
    }

    shouldComponentUpdate(nextProps) {
        if (
            nextProps.isPullToRefresh !== this.props.isPullToRefresh ||
            nextProps.isSelect !== this.props.isSelect ||
            nextProps.isOpenAction !== this.props.isOpenAction ||
            nextProps.isDisable !== this.props.isDisable
        ) {
            return true;
        } else {
            return false;
        }
    }

    rightActionsEmpty = () => {
        return <View style={CustomStyleSheet.width(0)} />;
    };

    convertTextToColor = value => {
        const [num1, num2, num3, opacity] = value.split(',');
        return Color.rgb(parseFloat(num1), parseFloat(num2), parseFloat(num3), parseFloat(opacity));
    };

    render() {
        const {
            dataItem,
            isSelect,
            index,
            listItemOpenSwipeOut,
            rowActions,
            isOpenAction,
            isDisable
        } = this.props;

        let imageAvatar = '',
            colorStatusView = null,
            borderStatusView = null,
            textFieldSalary = '',
            bgStatusView = null;

        if (dataItem.ImagePath) {
            imageAvatar = { uri: dataItem.ImagePath };
        }
        // xử lý color
        if (dataItem.itemStatus) {
            const { colorStatus, borderStatus, bgStatus } = dataItem.itemStatus;
            colorStatusView = colorStatus ? colorStatus : null;
            borderStatusView = borderStatus ? borderStatus : null;
            bgStatusView = bgStatus ? bgStatus : null;
        }

        if (dataItem.SalaryClassName) {
            textFieldSalary = `${dataItem.SalaryClassName}`;
        }
        if (dataItem.PositionName) {
            if (textFieldSalary != '') {
                textFieldSalary = `${textFieldSalary} | ${dataItem.PositionName}`;
            } else {
                textFieldSalary = `${dataItem.PositionName}`;
            }
        }

        let noteAssessment = '',
            keyNoteAssessment = '';

        if (dataVnrStorage.currentUser.info.userid == dataItem.UserApproveID) {
            noteAssessment = dataItem.AssessmentNote1;
            keyNoteAssessment = 'HRM_Hre_EvaluationDoc_AssessmentNote1';
        } else if (dataVnrStorage.currentUser.info.userid == dataItem.UserApproveID2) {
            noteAssessment = dataItem.AssessmentNote2;
            keyNoteAssessment = 'HRM_Hre_EvaluationDoc_AssessmentNote2';
        } else if (dataVnrStorage.currentUser.info.userid == dataItem.UserApproveID3) {
            noteAssessment = dataItem.AssessmentNote3;
            keyNoteAssessment = 'HRM_Hre_EvaluationDoc_AssessmentNote3';
        } else if (dataVnrStorage.currentUser.info.userid == dataItem.UserApproveID4) {
            noteAssessment = dataItem.AssessmentNote4;
            keyNoteAssessment = 'HRM_Hre_EvaluationDoc_AssessmentNote4';
        }

        return (
            <Swipeable
                ref={ref => {
                    this.Swipe = ref;
                    if (
                        listItemOpenSwipeOut.findIndex(value => {
                            return value['ID'] == index;
                        }) < 0
                    ) {
                        listItemOpenSwipeOut.push({ ID: index, value: ref });
                    } else {
                        listItemOpenSwipeOut[index].value = ref;
                    }
                }}
                overshootRight={false}
                renderRightActions={
                    rowActions != null && !isOpenAction
                        ? () => <RightActions rowActions={rowActions} dataItem={dataItem} />
                        : this.rightActionsEmpty
                }
                friction={0.6}
                containerStyle={[styles.swipeable]}
            >
                <View
                    style={[
                        styles.swipeableLayout,
                        isSelect && { backgroundColor: Colors.Secondary95 },
                        dataItem.WarningViolation && { borderColor: Colors.red }
                    ]}
                >
                    {isOpenAction && (
                        <View style={[styles.selectView, isDisable ? styleSheets.opacity05 : styleSheets.opacity1]}>
                            <TouchableOpacity
                                activeOpacity={isDisable ? 1 : 0.8}
                                onPress={() => {
                                    !isDisable ? this.props.onClick() : null;
                                }}
                            >
                                <View
                                    style={[
                                        styles.selectViewCircle,
                                        !this.props.isSelect && styleSheets.border1
                                    ]}
                                >
                                    {this.props.isSelect && (
                                        <IconCheckCirlceo size={Size.iconSize - 4} color={Colors.primary} />
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                    <View style={styles.container}>
                        <View style={[styles.contentMain]} key={index}>
                            <View style={styles.styViewTop}>
                                <View style={[styles.leftContent, isDisable ? styleSheets.opacity05 : styleSheets.opacity1]}>
                                    <View style={styles.leftContentIconView}>
                                        <Image source={imageAvatar} style={styles.leftContentIcon} />
                                    </View>
                                </View>

                                <View style={styles.contentRight}>
                                    <Text numberOfLines={1} style={[styleSheets.lable, styles.profileText]}>
                                        {dataItem.ProfileName}
                                    </Text>

                                    {dataItem.OrgStructureName != null && (
                                        <Text numberOfLines={1} style={[styleSheets.text, styles.positionText]}>
                                            {dataItem.OrgStructureName ? dataItem.OrgStructureName : ''}
                                        </Text>
                                    )}

                                    {textFieldSalary != '' && (
                                        <Text numberOfLines={1} style={[styleSheets.text, styles.positionText]}>
                                            {textFieldSalary}
                                        </Text>
                                    )}
                                </View>
                            </View>

                            <View style={styles.Line}>
                                <View style={styles.lineLeft}>
                                    <View style={[styles.line_date_row]}>
                                        <VnrText
                                            style={[styleSheets.text, styles.line_value_lable]}
                                            i18nKey={'HRM_Evaluation_Result'}
                                        />
                                        <View style={[styles.line_time_wrap]}>
                                            <Text numberOfLines={1} style={[styleSheets.text, styles.line_value_value]}>
                                                {dataItem.EvaDocEvaluationType != null
                                                    ? dataItem.EvaDocEvaluationType
                                                    : ''}
                                            </Text>
                                        </View>
                                    </View>

                                    {dataItem.lstFileAttach && dataItem.lstFileAttach.length > 0 && (
                                        <View style={[styles.line_date_row]}>
                                            <VnrText
                                                style={[styleSheets.text, styles.line_value_lable]}
                                                i18nKey={'HRM_Evaluation_Performance_AttachFile'}
                                                // HRM_Att_Report_Time
                                            />

                                            <View style={styles.line_time_wrap}>
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        Vnr_Function.downloadFileAttach(dataItem.lstFileAttach[0].path)
                                                    }
                                                >
                                                    <Text
                                                        numberOfLines={1}
                                                        style={[
                                                            styles.styViewFileName,
                                                            styleSheets.text,
                                                            styles.line_value_value
                                                        ]}
                                                    >
                                                        {dataItem.lstFileAttach[0].fileName}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                        <View style={styles.viewReason}>
                            <Text numberOfLines={2} style={[styleSheets.textItalic, styles.viewReason_text]}>
                                {noteAssessment != '' && noteAssessment != null
                                    ? `${translate(keyNoteAssessment)}: ${noteAssessment}`
                                    : `${translate(keyNoteAssessment)} : `}
                            </Text>
                        </View>
                        <View style={styles.viewStatusBottom}>
                            <View style={styles.dateTimeSubmit}>
                                <Text style={[styleSheets.textItalic, styles.dateTimeSubmit_Text]} numberOfLines={1}>
                                    {dataItem.DateCreate != null &&
                                        dataItem.DateCreate != undefined &&
                                        `${translate('E_AT_TIME')} ${moment(dataItem.DateCreate).format(
                                            'HH:mm DD/MM/YYYY'
                                        )}`}
                                </Text>
                            </View>

                            <View
                                style={[
                                    styles.lineSatus,
                                    {
                                        borderColor: borderStatusView
                                            ? this.convertTextToColor(borderStatusView)
                                            : Colors.gray_10,
                                        backgroundColor: bgStatusView
                                            ? this.convertTextToColor(bgStatusView)
                                            : Colors.white
                                    }
                                ]}
                            >
                                <Text
                                    numberOfLines={1}
                                    style={[
                                        styleSheets.text,
                                        styles.lineSatus_text,
                                        {
                                            color: colorStatusView
                                                ? this.convertTextToColor(colorStatusView)
                                                : Colors.gray_10
                                        }
                                    ]}
                                >
                                    {dataItem.StatusView ? dataItem.StatusView : ''}
                                </Text>
                            </View>
                        </View>
                        {dataItem.WarningViolation && (
                            <View style={styles.viewLimitTitle}>
                                <IconInfo color={Colors.red} size={Size.text} />
                                <Text numberOfLines={1} style={[styleSheets.lable, styles.viewReasoLimitTitle_text]}>
                                    {translate('HRM_Attendance_Limit_Violation_Title')}
                                </Text>
                            </View>
                        )}
                    </View>
                    {/* </View> */}
                </View>
                {Array.isArray(this.rightListActions) && this.rightListActions.length > 0 && (
                    <View style={styles.actionRight}>
                        <IconBack color={Colors.gray_7} size={Size.defineSpace} />
                    </View>
                )}
            </Swipeable>
        );
    }
}

const PADDING_DEFINE = Size.defineSpace;
const styles = StyleSheet.create({
    styViewFileName: { color: Colors.primary,
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
        textDecorationColor: Colors.primary,
        textAlign: 'right'
    },
    swipeable: {
        flex: 1,
        paddingHorizontal: Size.defineSpace
    },
    swipeableLayout: {
        flex: 1,
        borderRadius: 8,
        backgroundColor: Colors.white,
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        position: 'relative',
        flexDirection: 'row'
    },
    container: {
        flex: 1
    },

    viewStatusBottom: {
        paddingVertical: PADDING_DEFINE / 2,
        paddingHorizontal: PADDING_DEFINE,
        borderTopColor: Colors.gray_5,
        borderTopWidth: 0.5,
        flexDirection: 'row'
    },
    lineSatus: {
        borderRadius: styleSheets.radius_5,
        alignItems: 'center',
        borderWidth: 0.5,
        paddingVertical: 2,
        paddingHorizontal: PADDING_DEFINE
    },
    viewReason: {
        width: '100%',
        marginBottom: PADDING_DEFINE / 2,
        paddingHorizontal: PADDING_DEFINE
    },
    viewLimitTitle: {
        width: '100%',
        marginBottom: PADDING_DEFINE / 2,
        paddingHorizontal: PADDING_DEFINE,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    viewReasoLimitTitle_text: {
        fontSize: Size.text - 1,
        color: Colors.red,
        marginLeft: 5
    },
    viewReason_text: {
        fontSize: Size.text - 1,
        color: Colors.gray_10
    },
    lineSatus_text: {
        fontSize: Size.text - 3,
        fontWeight: '500'
    },
    line_time_wrap: {
        flex: 1,
        alignItems: 'flex-end'
    },
    selectView: {
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        paddingLeft: 5,
        paddingRight: 5,
        borderRightColor: Colors.gray_5,
        borderRightWidth: 0.5
    },
    selectViewCircle: {
        borderColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        width: Size.iconSize - 4,
        height: Size.iconSize - 4,
        borderRadius: (Size.iconSize - 4) / 2
    },
    dateTimeSubmit: {
        alignSelf: 'flex-end',
        paddingRight: 5,
        flex: 1
    },
    dateTimeSubmit_Text: {
        fontSize: Size.text - 4,
        color: Colors.gray_10
    },
    positionText: {
        fontSize: Size.text - 4.5,
        color: Colors.gray_7,
        marginTop: -2
    },
    profileText: {
        fontSize: Size.text,
        color: Colors.gray_10,
        marginTop: -2
    },
    contentMain: {
        flex: 1,
        paddingTop: Size.defineSpace,
        marginBottom: Size.defineSpace / 2,
        paddingHorizontal: Size.defineSpace
    },
    styViewTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Size.defineHalfSpace
    },
    leftContent: {
        marginRight: Size.defineHalfSpace
    },
    contentRight: {
        flex: 7.2,
        paddingRight: PADDING_DEFINE,
        justifyContent: 'center'
    },
    actionRight: {
        position: 'absolute',
        top: 0,
        right: -Size.defineSpace,
        height: '100%',
        justifyContent: 'center'
    },
    leftContentIconView: {
        borderRadius: 11,
        maxWidth: 60,
        maxHeight: 70
    },
    leftContentIcon: {
        width: Size.deviceWidth * 0.11,
        height: Size.deviceWidth * 0.11,
        resizeMode: 'cover',
        maxWidth: 60,
        maxHeight: 60,
        borderRadius: 11
    },
    Line: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colors.primary_transparent_8,
        paddingHorizontal: PADDING_DEFINE / 2,
        paddingVertical: PADDING_DEFINE / 2,
        borderRadius: 8
        // marginTop: 3,
    },
    lineLeft: {
        flex: 5,
        justifyContent: 'center'
    },
    line_value_value: {
        fontSize: Size.text - 1,
        color: Colors.primary,
        fontWeight: '500'
    },
    line_value_lable: {
        fontSize: Size.text - 1,
        marginRight: PADDING_DEFINE / 2
    },
    line_date_row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5
    }
});
