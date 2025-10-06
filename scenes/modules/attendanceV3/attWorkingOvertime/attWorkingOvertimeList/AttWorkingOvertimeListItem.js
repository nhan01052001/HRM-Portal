import React from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {
    Colors,
    CustomStyleSheet,
    Size,
    styleSheets,
    stylesScreenDetailV3,
    styleListItemV3
} from '../../../../../constants/styleConfig';
import moment from 'moment';
import { translate } from '../../../../../i18n/translate';
import { IconCheck, IconGroupUser, IconOclock } from '../../../../../constants/Icons';
import RightActions from '../../../../../componentsV3/ListButtonMenuRight/RightActions';
import Vnr_Services from '../../../../../utils/Vnr_Services';
import VnrRenderListItem from '../../../../../componentsV3/VnrRenderList/VnrRenderListItem';
import { StyleSheet } from 'react-native';

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
            bgStatusView = null;

        hiddenFiled &&
            typeof hiddenFiled == 'object' &&
            Object.keys(hiddenFiled).forEach((key) => {
                if (!hiddenFiled[key]) {
                    dataItem[key] = null;
                }
            });

        const { DataStatus, Status } = dataItem;

        // xử lý color
        if (dataItem.itemStatus) {
            const { colorStatus, bgStatus } = dataItem.itemStatus;
            if (Status === 'E_CONFIRM') {
                let itemStatus = Vnr_Services.formatStyleStatusApp(Status);
                colorStatusView = itemStatus.colorStatus;
                bgStatusView = itemStatus.bgStatus;
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

        return (
            <Swipeable
                ref={(ref) => {
                    this.Swipe = ref;
                    if (
                        listItemOpenSwipeOut.findIndex((value) => {
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
                    <View style={[styles.left_isCheckbox, customStyle.wrapCheckbox]}>
                        {rowActions === null || (Array.isArray(rowActions) && rowActions.length === 0) ? null : (
                            <View style={[styles.styRadiusCheck, this.props.isSelect && stylesScreenDetailV3.checkAll]}>
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
                                    <View style={[styles.styViewTop, CustomStyleSheet.alignItems('flex-start')]}>
                                        {/* Top - left */}
                                        <View style={styles.wh69}>
                                            {/* flexible fontsize */}
                                            <Text
                                                numberOfLines={3}
                                                style={[styleSheets.lable, styles.styleTextViewTop]}
                                            >
                                                {dataItem?.OrgStructureName ?? ''}
                                            </Text>

                                            {dataItem?.OrgStructureName && (
                                                <View style={CustomStyleSheet.flex(1)}>
                                                    <View style={styles.styleFlex1_row_AlignCenter}>
                                                        <Text
                                                            style={[styleSheets.text, customStyle.textmaphieu]}
                                                            numberOfLines={1}
                                                        >
                                                            {dataItem?.OrgStructureName}
                                                        </Text>
                                                    </View>
                                                </View>
                                            )}
                                        </View>

                                        {/* Top - right */}
                                        <View style={styles.viewContentTopRight}>
                                            <View
                                                style={[
                                                    styles.lineSatus,
                                                    {
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
                                                            color: colorStatusView ? colorStatusView : Colors.gray_10
                                                        }
                                                    ]}
                                                >
                                                    {DataStatus && DataStatus.StatusView ? DataStatus.StatusView : ''}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={styles.wrapContentCenter}>
                                        <View style={styles.styIconMess}>
                                            <IconGroupUser size={Size.text + 1} color={Colors.gray_8} />
                                        </View>
                                        <View style={styles.wrapReason}>
                                            <Text
                                                numberOfLines={2}
                                                style={[styleSheets.text, customStyle.textQuantityEmp]}
                                            >
                                                {translate('HRM_PortalApp_TakeBusinessTrip_EmployeeCount')}:{' '}
                                                <Text
                                                    style={[
                                                        CustomStyleSheet.color(Colors.black),
                                                        CustomStyleSheet.fontWeight('500')
                                                    ]}
                                                >
                                                    {123}
                                                </Text>
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={[styles.viewStatusBottom]}>
                                    {dataItem?.DateCreate && (
                                        <View style={styles.styViewDate}>
                                            <IconOclock size={Size.text - 1} color={Colors.gray_7} />
                                            <Text style={[styleSheets.text, styles.dateTimeSubmit_Text]}>
                                                {moment(dataItem.DateCreate).format('DD/MM/YYYY')}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </Swipeable>
        );
    }
}

const styles = styleListItemV3;
const customStyle = StyleSheet.create({
    wrapCheckbox: {
        justifyContent: 'flex-start',
        paddingTop: Size.defineSpace + 8
    },

    textmaphieu: {
        fontSize: 12,
        fontWeight: '400',
        color: Colors.gray_7
    },

    textQuantityEmp: {
        color: Colors.gray_7,
        fontSize: 14,
        fontWeight: '500'
    }
});