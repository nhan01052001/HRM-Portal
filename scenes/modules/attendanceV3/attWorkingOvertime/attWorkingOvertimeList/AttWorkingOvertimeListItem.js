import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, CustomStyleSheet, Size, styleSheets, stylesScreenDetailV3, styleListItemV3 } from '../../../../../constants/styleConfig';
import moment from 'moment';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { translate } from '../../../../../i18n/translate';
import {
    IconCheck,
    IconDate,
    IconChat
} from '../../../../../constants/Icons';
import RightActions from '../../../../../componentsV3/ListButtonMenuRight/RightActions';
import Vnr_Services from '../../../../../utils/Vnr_Services';
import VnrRenderListItem from '../../../../../componentsV3/VnrRenderList/VnrRenderListItem';

export default class AttWorkingOvertimeListItem extends VnrRenderListItem {
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
            textFieldSalary = '',
            bgStatusView = null,
            isHaveAvatar = false,
            textIn4Register = null,
            textConfirmHours = null,
            textDataNote = null,
            textTypeOvertime_MethhoadPayment = <View />;

        hiddenFiled &&
            typeof hiddenFiled == 'object' &&
            Object.keys(hiddenFiled).forEach(key => {
                if (!hiddenFiled[key]) {
                    dataItem[key] = null;
                }
            });

        const { DataStatus, Status, DataConfirmReason } = dataItem;
        isHaveAvatar = DataStatus?.UserProcessName ? true : false;
        if (Status === 'E_CONFIRM') {
            textConfirmHours = `${dataItem?.ConfirmHours
                ? dataItem?.ConfirmHours
                : 0}`
            textDataNote = DataConfirmReason?.ConfirmReason ? `${DataConfirmReason?.ConfirmReason}` : null
        } else {
            textDataNote = dataItem.DataNote ? `${dataItem.DataNote}` : null
        }

        // xử lý color
        if (dataItem.itemStatus) {
            const { colorStatus, bgStatus } = dataItem.itemStatus;
            if (Status === 'E_CONFIRM') {
                let itemStatus = Vnr_Services.formatStyleStatusApp(Status);
                colorStatusView = itemStatus.colorStatus;
                bgStatusView = itemStatus.bgStatus
            } else {
                colorStatusView = colorStatus ? colorStatus : null;
                bgStatusView = bgStatus ? bgStatus : null;
            }
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

        if (dataItem?.DataTimeRegister?.RegisterHours || dataItem?.DataTimeRegister?.TimeOvertimeRegister) {
            textIn4Register =
                `${dataItem?.DataTimeRegister?.RegisterHours
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
                    permissionRightAction
                        ? () => <RightActions rowActions={rowActions} dataItem={dataItem} />
                        : this.rightActionsEmpty
                }
                friction={0.6}
                containerStyle={[styles.swipeable]}
            >
                <View style={[styles.swipeableLayout]}>
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
                                        <View style={CustomStyleSheet.width('75%')}>
                                            {/* flexible fontsize */}
                                            <Text
                                                numberOfLines={1}
                                                adjustsFontSizeToFit
                                                allowFontScaling
                                                style={[styleSheets.lable, styles.styleTextViewTop]}
                                            >
                                                {dataItem?.WorkDateOfWeek ? `${dataItem?.WorkDateOfWeek}, ` : ''}{dataItem?.DataRegister?.WorkDateRoot + ' '}
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
                                    {textDataNote != null && (
                                        <View style={styles.wrapContentCenter}>
                                            <View style={styles.styIconMess}>
                                                <IconChat size={Size.text + 1} color={Colors.gray_8} />
                                            </View>
                                            <View style={styles.wrapReason}>
                                                <Text
                                                    numberOfLines={2}
                                                    style={[styleSheets.text, styles.viewReason_text]}
                                                >
                                                    {textDataNote}
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
                                <View style={[styles.viewStatusBottom]}>
                                    <View style={[styles.leftContent, isDisable ? styleSheets.opacity05 : styleSheets.opacity1]}>
                                        {isHaveAvatar
                                            ? Vnr_Function.renderAvatarCricleByName(
                                                DataStatus.ImagePath,
                                                DataStatus?.UserProcessName,
                                                20
                                            )
                                            : null}
                                    </View>
                                    {isHaveAvatar ? (
                                        <View style={styles.styUserApprove}>
                                            <Text numberOfLines={1} style={[styleSheets.lable, styles.textProfileName]}>
                                                {dataItem?.DataStatus?.UserProcessNameForApp
                                                    ? dataItem?.DataStatus?.UserProcessNameForApp
                                                    : DataStatus?.UserProcessName
                                                        ? DataStatus?.UserProcessName
                                                        : null}
                                            </Text>
                                        </View>
                                    ) : (
                                        <View style={styles.styUserApprove} />
                                    )}

                                    {dataItem?.DateCreate && (
                                        <View style={styles.styViewDate}>
                                            {isHaveAvatar && (
                                                <Text style={[styleSheets.text, styles.dateTimeSubmit_Text]}>
                                                    {'|  '}
                                                </Text>
                                            )}

                                            <IconDate size={Size.text - 1} color={Colors.gray_7} />

                                            <Text style={[styleSheets.text, styles.dateTimeSubmit_Text]}>
                                                {Vnr_Services.getDayOfWeek(dataItem.DateCreate) ? `${Vnr_Services.getDayOfWeek(dataItem.DateCreate)}, ` : ''}{moment(dataItem.DateCreate).format('DD/MM/YYYY')}
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
                                {
                                    textConfirmHours !== null && (
                                        <View style={styles.styViewConfirmHours}>
                                            <Text style={[styleSheets.text]}>{`${translate('HRM_PortalApp_Overtime_ConfirmHours') + ': '}`}</Text>
                                            <Text style={[
                                                styleSheets.text,
                                                dataItem.ConfirmHours < dataItem.RegisterHours && { color: Colors.red }
                                            ]}>{textConfirmHours}</Text>
                                            <Text>{' '}</Text>
                                            <Text style={[styleSheets.text]}>{translate('HRM_PortalApp_Hour_Lowercase')}</Text>
                                        </View>
                                    )
                                }
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </Swipeable>
        );
    }
}

const styles = styleListItemV3;
