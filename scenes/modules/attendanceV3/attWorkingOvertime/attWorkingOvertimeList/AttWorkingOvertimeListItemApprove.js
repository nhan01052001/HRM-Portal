import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, CustomStyleSheet, Size, styleListItemV3, styleSheets, stylesScreenDetailV3 } from '../../../../../constants/styleConfig';
import moment from 'moment';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { translate } from '../../../../../i18n/translate';
import {
    IconCheck,
    IconDate,
    IconChat
} from '../../../../../constants/Icons';
import RightActions from '../../../../../componentsV3/ListButtonMenuRight/RightActions';
import VnrRenderListItem from '../../../../../componentsV3/VnrRenderList/VnrRenderListItem';

export default class AttWorkingOvertimeListItemApprove extends VnrRenderListItem {
    render() {
        const {
            dataItem,
            index,
            listItemOpenSwipeOut,
            rowActions,
            isOpenAction,
            isDisable,
            hiddenFiled,
            handerOpenSwipeOut
        } = this.props;

        let colorStatusView = null,
            textIn4Register = null,
            textTypeOvertime_MethhoadPayment = <View />,
            bgStatusView = null;

        hiddenFiled &&
            typeof hiddenFiled == 'object' &&
            Object.keys(hiddenFiled).forEach(key => {
                if (!hiddenFiled[key]) {
                    dataItem[key] = null;
                }
            });

        const { DataStatus } = dataItem,
            { ProfileInfo } = dataItem;

        // xử lý color
        if (dataItem.itemStatus) {
            const { colorStatus, bgStatus } = dataItem.itemStatus;
            colorStatusView = colorStatus ? colorStatus : null;
            bgStatusView = bgStatus ? bgStatus : null;
        }

        let permissionRightAction =
            rowActions != null &&
            Array.isArray(rowActions) &&
            rowActions.length > 0 &&
            !isOpenAction &&
            this.rightListActions &&
            Array.isArray(this.rightListActions) &&
            this.rightListActions.length > 0
                ? true
                : false;

        let isDisableWhenConfig = dataItem?.IsDisable ? true : false;

        if (dataItem?.DataTimeRegister?.RegisterHours || dataItem?.DataTimeRegister?.TimeOvertimeRegister) {
            textIn4Register =
                `${
                    dataItem?.DataTimeRegister?.RegisterHours
                        ? dataItem?.DataTimeRegister?.RegisterHours + ' ' + translate('HRM_PortalApp_Hour_Lowercase')
                        : null
                }` +
                ' ' +
                `${dataItem?.DataTimeRegister?.TimeOvertimeRegister &&
                    '(' + dataItem?.DataTimeRegister?.TimeOvertimeRegister + ')'}`;
        }

        if (dataItem?.DataRegister?.OvertimeTypeName || dataItem?.MethodPaymentView) {
            textTypeOvertime_MethhoadPayment = (
                <View style={styles.wh100}>
                    {dataItem?.DataRegister?.OvertimeTypeName && (
                        <Text style={[styleSheets.lable, styles.styleTextType]} numberOfLines={1}>
                            {dataItem?.DataRegister?.OvertimeTypeName}
                        </Text>
                    )}
                    {dataItem?.MethodPaymentView && (
                        <Text style={[styleSheets.lable, styles.styleTextType]} numberOfLines={1}>
                            {dataItem?.MethodPaymentView}
                        </Text>
                    )}
                </View>
            );
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
                    permissionRightAction && isDisableWhenConfig === false
                        ? () => <RightActions rowActions={rowActions} dataItem={dataItem} />
                        : this.rightActionsEmpty
                }
                friction={0.6}
                containerStyle={[styles.swipeable]}
            >
                <View style={[styles.swipeableLayout, isDisableWhenConfig && styleSheets.opacity05]}>
                    <View style={styles.left_isCheckbox}>
                        {rowActions === null || (Array.isArray(rowActions) && rowActions.length === 0) ? null : (
                            <View
                                style={[
                                    styles.styRadiusCheck,
                                    this.props.isSelect && stylesScreenDetailV3.checkAll
                                ]}
                            >
                                {this.props.isSelect && <IconCheck size={Size.iconSize - 10} color={Colors.white} />}
                            </View>
                        )}
                        <TouchableOpacity
                            style={[
                                styles.btnLeft_check,
                                (rowActions === null || (Array.isArray(rowActions) && rowActions.length === 0)) && {
                                    ...CustomStyleSheet.zIndex(1),
                                    ...CustomStyleSheet.elevation(1)
                                }
                            ]}
                            activeOpacity={isDisable ? 1 : 0.8}
                            onPress={() => {
                                if (rowActions === null || (Array.isArray(rowActions) && rowActions.length === 0)) {
                                    this.props.onMoveDetail();
                                } else {
                                    this.props.onClick();
                                }
                            }}
                        />
                    </View>
                    <TouchableWithoutFeedback
                        onPressIn={() => handerOpenSwipeOut && handerOpenSwipeOut(index)}
                        onPress={() => {
                            this.props.onMoveDetail();
                        }}
                    >
                        <View style={styles.btnRight_ViewDetail}>
                            <View style={[CustomStyleSheet.flex(1)]}>
                                <View style={[styles.contentMain]} key={index}>
                                    {/* top */}
                                    <View style={styles.styViewTop}>
                                        {/* Top - left */}
                                        <View style={styles.wh69}>
                                            <Text
                                                numberOfLines={1}
                                                adjustsFontSizeToFit
                                                allowFontScaling
                                                style={[styleSheets.lable, styles.styleTextViewTop]}
                                            >
                                                {dataItem?.DataRegister?.WorkDateRoot + ' '}
                                                <Text
                                                    style={[
                                                        styleSheets.lable,
                                                        styles.styleTextNum,
                                                        { backgroundColor: Colors.gray_5 }
                                                    ]}
                                                >
                                                    {' ' + textIn4Register + ' '}
                                                </Text>
                                            </Text>

                                            <View style={CustomStyleSheet.flex(1)}>
                                                <View style={styles.styleFlex1_row_AlignCenter}>
                                                    {textTypeOvertime_MethhoadPayment}
                                                </View>
                                            </View>
                                        </View>

                                        {/* Top - right */}
                                        <View style={styles.viewContentTopRight}>
                                            <View
                                                style={[
                                                    styles.lineSatus,
                                                    {
                                                        backgroundColor: bgStatusView ? this.convertTextToColor(bgStatusView) : Colors.white
                                                    }
                                                ]}
                                            >
                                                <Text
                                                    numberOfLines={1}
                                                    style={[
                                                        styleSheets.text,
                                                        styles.lineSatus_text,
                                                        {
                                                            color: colorStatusView ? colorStatusView : Colors.gray_10
                                                        }
                                                    ]}
                                                >
                                                    {DataStatus && DataStatus.StatusView ? DataStatus.StatusView : ''}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    {/* cennter */}
                                    {dataItem.DataNote != null && (
                                        <View style={styles.wrapContentCenter}>
                                            <View style={styles.styIconMess}>
                                                <IconChat size={Size.text + 1} color={Colors.gray_8} />
                                            </View>
                                            <View style={styles.wrapReason}>
                                                <Text
                                                    numberOfLines={2}
                                                    style={[styleSheets.text, styles.viewReason_text]}
                                                >
                                                    {dataItem.DataNote ? `${dataItem.DataNote}` : ''}
                                                </Text>
                                            </View>
                                        </View>
                                    )}

                                    {dataItem?.AccumulateHour !== null &&
                                        dataItem?.AccumulateHour !== undefined &&
                                        (dataItem?.AccumulateHour?.UdLimitColorDate ||
                                            dataItem?.AccumulateHour?.UdLimitColorMonth ||
                                            dataItem?.AccumulateHour?.UdLimitColorYear) && (
                                            <View
                                                style={styles.AccumulateHour}
                                            >
                                                <Text
                                                    numberOfLines={2}
                                                    style={[styleSheets.lable, { fontSize: Size.text - 1 }]}
                                                >
                                                    <Text style={{ color: Colors.red }}>
                                                        {translate('HRM_PortalApp_AccumulatedOT')}{' '}
                                                    </Text>
                                                    (<Text>{translate('HRM_PortalApp_AccumulatedOvertime')}:</Text>
                                                    <Text
                                                        style={[
                                                            dataItem?.AccumulateHour?.UdLimitColorDate ||
                                                                (dataItem?.UdLimitColorDay && { color: Colors.red })
                                                        ]}
                                                    >
                                                        {' '}
                                                        {dataItem?.AccumulateHour?.UdHourByDate}
                                                    </Text>{' '}
                                                    |
                                                    <Text
                                                        style={[
                                                            (dataItem?.AccumulateHour?.UdLimitColorMonth ||
                                                                dataItem?.UdLimitColorMonth) && { color: Colors.red }
                                                        ]}
                                                    >
                                                        {' '}
                                                        {dataItem?.AccumulateHour?.UdHourByMonth}
                                                    </Text>{' '}
                                                    |
                                                    <Text
                                                        style={[
                                                            (dataItem?.AccumulateHour?.UdLimitColorYear ||
                                                                dataItem?.UdLimitColorYear) && { color: Colors.red }
                                                        ]}
                                                    >
                                                        {' '}
                                                        {dataItem?.AccumulateHour?.UdHourByYear}{' '}
                                                    </Text>
                                                    <Text>{translate('HRM_PortalApp_Hour_Lowercase')}</Text>)
                                                </Text>
                                            </View>
                                        )}
                                </View>
                                <View style={styles.viewStatusBottom}>
                                    <View style={[styles.leftContent, isDisable ? styleSheets.opacity05 : styleSheets.opacity1]}>
                                        {Vnr_Function.renderAvatarCricleByName(
                                            ProfileInfo.ImagePath,
                                            ProfileInfo.ProfileName,
                                            20
                                        )}
                                    </View>
                                    <View style={styles.styUserApprove}>
                                        <Text numberOfLines={1} style={[styleSheets.lable, styles.textProfileName]}>
                                            {`${dataItem.ProfileName ? dataItem.ProfileName : ''} `}
                                        </Text>
                                    </View>

                                    {dataItem?.DateCreate && (
                                        <View style={styles.styViewDate}>
                                            <Text style={[styleSheets.text, styles.dateTimeSubmit_Text]}>{'|  '}</Text>

                                            <IconDate size={Size.text - 1} color={Colors.gray_7} />

                                            <Text style={[styleSheets.text, styles.dateTimeSubmit_Text]}>
                                                {moment(dataItem.DateCreate).format('DD/MM/YYYY')}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                                {/* {dataItem.WarningViolation && (
                                    <View style={styles.viewLimitTitle}>
                                        <IconInfo color={Colors.red} size={Size.text} />
                                        <Text
                                            numberOfLines={1}
                                            style={[styleSheets.lable, styles.viewReasoLimitTitle_text]}
                                        >
                                            {translate('HRM_Attendance_Limit_Violation_Title')}
                                        </Text>
                                    </View>
                                )} */}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </Swipeable>
        );
    }
}

const styles = styleListItemV3;
