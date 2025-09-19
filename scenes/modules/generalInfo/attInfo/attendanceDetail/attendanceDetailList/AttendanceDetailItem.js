/* eslint-disable react-native/no-unused-styles */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, CustomStyleSheet, Size, styleSheets, styleVnrListItem } from '../../../../../../constants/styleConfig';
import moment from 'moment';
import format from 'number-format.js';
import ActionSheet from 'react-native-actionsheet';
import Vnr_Function from '../../../../../../utils/Vnr_Function';
import { translate } from '../../../../../../i18n/translate';
import { IconLeaveDay, IconInOut, IconTime, IconMoreHorizontal, IconMinus } from '../../../../../../constants/Icons';
import VnrText from '../../../../../../components/VnrText/VnrText';
import { ScreenName } from '../../../../../../assets/constant';

export default class AttendanceDetailItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.formatStringType = this.formatStringType.bind(this);
        this.sheetActions = [
            {
                title: translate('HRM_Common_Close'),
                onPress: null
            }
        ];
        if (!Vnr_Function.CheckIsNullOrEmpty(this.props.rowActions)) {
            this.rightListActions = this.props.rowActions;
            if (this.rightListActions.length > 3) {
                this.sheetActions = [...this.rightListActions.slice(2), ...this.sheetActions];
            } else {
                this.sheetActions = [...this.rightListActions.slice(3), ...this.sheetActions];
            }
        }
    }

    formatStringType = (data, col) => {
        if (col.DataType && col.DataType.toLowerCase() == 'datetime') {
            return moment(data[col.Name]).format(col.DataFormat);
        }
        if (col.DataType && col.DataType.toLowerCase() == 'double') {
            return format(col.DataFormat, data[col.Name]);
        } else {
            return data[col.Name];
        }
    };
    openActionSheet = () => {
        this.ActionSheet.show();
    };
    actionSheetOnCLick = (index) => {
        const { dataItem } = this.props;
        !Vnr_Function.CheckIsNullOrEmpty(this.sheetActions[index].onPress) &&
            this.sheetActions[index].onPress(dataItem);
    };
    rightActionsEmpty = () => {
        return <View style={CustomStyleSheet.width(0)} />;
    };

    rightActions = () => {
        const options = this.sheetActions.map((item) => {
            return item.title;
        });
        const { dataItem } = this.props;

        return (
            <View style={CustomStyleSheet.flexDirection('row')}>
                {!Vnr_Function.CheckIsNullOrEmpty(this.sheetActions) && this.sheetActions.length > 1 && (
                    <View style={[styleVnrListItem.RenderItem.viewIcon, { backgroundColor: Colors.info }]}>
                        <TouchableOpacity onPress={() => this.openActionSheet()} style={styleSheets.flex1Center}>
                            <View style={styleVnrListItem.RenderItem.icon}>
                                <IconMoreHorizontal size={Size.iconSize} color={Colors.white} />
                            </View>
                            <Text style={[styleSheets.text, { color: Colors.white }]}>{translate('MoreActions')}</Text>
                        </TouchableOpacity>
                        <ActionSheet
                            ref={(o) => (this.ActionSheet = o)}
                            //title={'Which one do you like ?'}
                            options={options}
                            cancelButtonIndex={this.sheetActions.length - 1}
                            destructiveButtonIndex={this.sheetActions.length - 1}
                            onPress={(index) => this.actionSheetOnCLick(index)}
                        />
                    </View>
                )}
                {!Vnr_Function.CheckIsNullOrEmpty(this.rightListActions) &&
                    this.rightListActions.length > 0 &&
                    this.rightListActions.map((item, index) => {
                        let buttonColor = '';
                        let iconName = '';
                        switch (item.type) {
                            case 'E_LEAVEDAY':
                                buttonColor = Colors.info;
                                iconName = <IconLeaveDay size={Size.iconSize} color={Colors.white} />;
                                break;
                            case 'E_INOUT':
                                buttonColor = Colors.warning;
                                iconName = <IconInOut size={Size.iconSize} color={Colors.white} />;
                                break;
                            case 'E_OVERTIME':
                                buttonColor = Colors.primary;
                                iconName = <IconTime size={Size.iconSize} color={Colors.white} />;
                                break;
                        }
                        if (this.sheetActions.length > 1 && index < 2) {
                            return (
                                <View style={[styleVnrListItem.RenderItem.viewIcon, { backgroundColor: buttonColor }]}>
                                    <TouchableOpacity
                                        onPress={() => item.onPress(dataItem)}
                                        style={styleSheets.flex1Center}
                                    >
                                        <View style={styleVnrListItem.RenderItem.icon}>{iconName}</View>
                                        <Text style={[styleSheets.text, { color: Colors.white }]}>{item.title}</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        } else if (this.sheetActions.length <= 1 && index < 3) {
                            return (
                                <View style={[styleVnrListItem.RenderItem.viewIcon, { backgroundColor: buttonColor }]}>
                                    <TouchableOpacity
                                        onPress={() => item.onPress(dataItem)}
                                        style={styleSheets.flex1Center}
                                    >
                                        <View style={styleVnrListItem.RenderItem.icon}>{iconName}</View>
                                        <Text style={[styleSheets.text, { color: Colors.white }]}>{item.title}</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        }
                    })}
            </View>
        );
    };

    render() {
        const { dataItem, index, listItemOpenSwipeOut, isOpenAction, rowActions } = this.props;

        const {
            itemContent,
            leftItem,
            rightItem,
            timeIn,
            timeOut,
            titleView,
            textLeftItem,
            timeLarge,
            viewRowTime,
            titleTime,
            boxTitle,
            datailTime
        } = styles;

        let isShowLateEarlyMinutes = Vnr_Function.checkIsShowConfigField(
            ScreenName.AttendanceDetail,
            'LateEarlyMinutes'
        );

        let txtTimeWork = '',
            txtDuration = '',
            timeInView = (
                <View style={timeIn}>
                    <IconMinus size={Size.iconSize + 2} color={Colors.primary} />
                </View>
            ),
            timeOutView = (
                <View style={timeIn}>
                    <IconMinus size={Size.iconSize + 2} color={Colors.primary} />
                </View>
            );

        if (txtTimeWork.length > 0) {
            txtTimeWork = `${txtTimeWork}, ${translate('HRM_Common_WorkHours')} ${dataItem.WorkHoursFormat} ${translate(
                'E_IMPORT_FILE_HOUR'
            )}`;
        } else {
            txtTimeWork = `${translate('HRM_Common_WorkHours')} ${dataItem.WorkHoursFormat} ${translate(
                'E_IMPORT_FILE_HOUR'
            )}`;
        }

        if (dataItem.LateEarlyMinutesFormat && isShowLateEarlyMinutes) {
            txtDuration = ` ${translate('HRM_Attendance_AttendanceTableItem_LateEarlyMinutes')} ${
                dataItem.LateEarlyMinutesFormat
            }`;
        }

        if (dataItem.FirstInTime != null) {
            timeInView = (
                <View style={timeIn}>
                    <View style={viewRowTime}>
                        <Text style={[styleSheets.text, timeLarge]}>
                            {moment(dataItem.FirstInTime).format('HH:mm')}
                        </Text>
                    </View>
                    <View style={viewRowTime}>
                        <VnrText style={[styleSheets.text, textLeftItem]} i18nKey={'E_IN'} />
                    </View>
                </View>
            );
        }

        if (dataItem.LastOutTime != null) {
            timeOutView = (
                <View style={timeOut}>
                    <View style={viewRowTime}>
                        <Text style={[styleSheets.text, timeLarge]}>
                            {moment(dataItem.LastOutTime).format('HH:mm')}
                        </Text>
                    </View>
                    <View style={viewRowTime}>
                        <VnrText style={[styleSheets.text, textLeftItem]} i18nKey={'E_OUT'} />
                    </View>
                </View>
            );
        }

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
                renderRightActions={rowActions != null && !isOpenAction ? this.rightActions : this.rightActionsEmpty}
                friction={0.6}
            >
                <View style={itemContent}>
                    <View style={leftItem}>
                        <Text style={[styleSheets.text, styles.textLeftItemDay]}>{dataItem.WorkDateOfWeekView}</Text>
                        <Text style={[styleSheets.text, styles.textLeftItemWeek]}>{dataItem.WorkDateOfWeek}</Text>
                    </View>
                    <View style={rightItem}>
                        <View style={datailTime}>
                            {timeInView}
                            <View style={titleView}>
                                <View style={boxTitle}>
                                    <Text style={[styleSheets.text, titleTime]} numberOfLines={1}>
                                        {dataItem.ShiftName}
                                    </Text>
                                </View>
                                <View style={boxTitle}>
                                    <Text style={[styleSheets.text, textLeftItem]} numberOfLines={2}>
                                        {txtTimeWork}
                                    </Text>
                                    <Text style={[styleSheets.text, textLeftItem]} numberOfLines={2}>
                                        {txtDuration}
                                    </Text>
                                </View>
                            </View>
                            {timeOutView}
                        </View>
                    </View>
                </View>
            </Swipeable>
        );
    }
}

const styles = StyleSheet.create({
    itemContent: {
        backgroundColor: Colors.white,
        flexDirection: 'row'
    },
    leftItem: {
        borderRightWidth: 1,
        borderRightColor: Colors.borderColor,
        width: 45,
        justifyContent: 'center',
        alignItems: 'center'
    },
    rightItem: {
        flex: 1,
        flexDirection: 'column'
    },
    timeIn: {
        paddingLeft: styleSheets.p_10,
        paddingRight: styleSheets.p_5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleView: {
        flex: 1,
        paddingVertical: styleSheets.p_10
    },
    textLeftItemDay: {
        color: Colors.greySecondary,
        paddingVertical: 1.5,
        fontSize: Size.text + 4,
        fontWeight: '600'
    },
    textLeftItemWeek: {
        color: Colors.greySecondary,
        paddingVertical: 1.5,
        fontSize: Size.text + 1
    },
    timeOut: {
        paddingLeft: styleSheets.p_5,
        paddingRight: styleSheets.p_10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textLeftItem: {
        color: Colors.greySecondary,
        paddingVertical: 1.5,
        textAlign: 'center'
    },
    timeLarge: {
        fontWeight: '600'
    },
    viewRowTime: {
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    titleTime: {
        color: Colors.primary,
        paddingVertical: 3,
        fontWeight: '400'
    },
    boxTitle: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    datailTime: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    }
});
