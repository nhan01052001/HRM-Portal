/* eslint-disable react-native/no-unused-styles */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, CustomStyleSheet, Size, styleSheets, styleVnrListItem } from '../../../../constants/styleConfig';
import moment from 'moment';
import format from 'number-format.js';
import ActionSheet from 'react-native-actionsheet';
import Vnr_Function from '../../../../utils/Vnr_Function';
import { translate } from '../../../../i18n/translate';
import { IconDate, IconTime, IconInOut, IconHourGlass } from '../../../../constants/Icons';
import { EnumName } from '../../../../assets/constant';
import { IconMoreHorizontal, IconLeaveDay, IconSuitcase } from '../../../../constants/Icons';

export default class RenderItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        const { dataItem } = this.props;
        this.formatStringType = this.formatStringType.bind(this);
        this.sheetActions = [
            {
                title: translate('HRM_Common_Close'),
                onPress: null
            }
        ];
        //dataItem.BusinessAllowAction = ["E_LEAVEDAY", "E_INOUT", "E_OVERTIME"];
        if (!Vnr_Function.CheckIsNullOrEmpty(this.props.rowActions)) {
            this.rightListActions = this.props.rowActions.filter(item => {
                item.title = item?.title;
                return (
                    !Vnr_Function.CheckIsNullOrEmpty(dataItem.BusinessAllowAction) &&
                    dataItem.BusinessAllowAction.indexOf(item.type) >= 0
                );
            });
            if (this.rightListActions.length > 3) {
                this.sheetActions = [...this.rightListActions.slice(2), ...this.sheetActions];
            } else {
                this.sheetActions = [...this.rightListActions.slice(3), ...this.sheetActions];
            }
        }
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     return nextProps.isSelect !== this.props.isSelect || nextProps.isOpenAction !== this.props.isOpenAction;

    // }
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
    actionSheetOnCLick = index => {
        const { dataItem } = this.props;
        !Vnr_Function.CheckIsNullOrEmpty(this.sheetActions[index].onPress) &&
            this.sheetActions[index].onPress(dataItem);
    };
    rightActionsEmpty = () => {
        return <View style={CustomStyleSheet.width(0)} />;
    };
    rightActions = () => {
        const options = this.sheetActions.map(item => {
            return item.title;
        });

        return (
            <View style={styles.flexDirection}>
                {!Vnr_Function.CheckIsNullOrEmpty(this.sheetActions) && this.sheetActions.length > 1 && (
                    <View style={[styleVnrListItem.RenderItem.viewIcon, { backgroundColor: Colors.info }]}>
                        <TouchableOpacity
                            onPress={() => this.openActionSheet()}
                            style={styleSheets.flex1Center}
                        >
                            <View style={styleVnrListItem.RenderItem.icon}>
                                <IconMoreHorizontal size={Size.iconSize} color={Colors.white} />
                            </View>
                            <Text style={[styleSheets.text, { color: Colors.white }]}>{translate('MoreActions')}</Text>
                        </TouchableOpacity>
                        <ActionSheet
                            ref={o => (this.ActionSheet = o)}
                            //title={'Which one do you like ?'}
                            options={options}
                            cancelButtonIndex={this.sheetActions.length - 1}
                            destructiveButtonIndex={this.sheetActions.length - 1}
                            onPress={index => this.actionSheetOnCLick(index)}
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
                                        onPress={() => item.onPress()}
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
                                        onPress={() => item.onPress()}
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
            styleDateAndTitle,
            styleTimeRequest,
            styleStatus,
            txtStatus,
            txtDateTimeTitle
        } = styles;
        let viewStatus = <View />,
            viewDataFromDateTo = <View />,
            viewDataFromHourTo = <View />,
            viewDataDurationTypeView = <View />,
            viewIconType = <View />;

        // hiển thị icon theo từng loại nghiệp vụ
        switch (dataItem.Type) {
            case EnumName.E_OVERTIME:
                viewIconType = <IconTime size={Size.iconSize} color={Colors.primary} />;
                break;
            case EnumName.E_LEAVE_DAY:
                viewIconType = <IconDate size={Size.iconSize} color={Colors.primary} />;
                break;
            case EnumName.E_TAMSCANLOGREGISTER:
                viewIconType = <IconInOut size={Size.iconSize} color={Colors.primary} />;
                break;
            case EnumName.E_ROSTER:
                viewIconType = <IconHourGlass size={Size.iconSize} color={Colors.primary} />;
                break;
            case EnumName.E_BUSSINESSTRAVEL:
                viewIconType = <IconSuitcase size={Size.iconSize} color={Colors.primary} />;
                break;
            default:
                break;
        }

        // xử lý trạng thái
        if (dataItem.StatusView != null) {
            viewStatus = (
                <View style={styleStatus}>
                    <Text style={[styleSheets.text, txtStatus]}>
                        {Vnr_Function.formatStringType(dataItem, {
                            Name: 'StatusView',
                            DataType: 'string'
                        })}
                    </Text>
                </View>
            );
        }

        // xử lý ngày tháng
        if (dataItem.DateFrom != null || dataItem.DateTo) {
            let DateFrom = '',
                DateTo = '';
            if (dataItem.DateFrom != null) {
                DateFrom = moment(dataItem.DateFrom).format('DD/MM/YYYY');
            }
            if (dataItem.DateTo != null) {
                DateTo = `- ${moment(dataItem.DateTo).format('DD/MM/YYYY')}`;
            }

            viewDataFromDateTo = (
                <Text style={[styleSheets.text, { color: Colors.grey }]}>{`${DateFrom} ${DateTo} `}</Text>
            );
        }
        if (dataItem.HourTo != null || dataItem.HourFrom) {
            let HourTo = '',
                HourFrom = '';
            if (dataItem.HourFrom != null) {
                HourFrom = dataItem.HourFrom;
            }
            if (dataItem.HourTo != null) {
                HourTo = `- ${dataItem.HourTo}`;
            }

            viewDataFromHourTo = (
                <Text style={[styleSheets.text, { color: Colors.grey }]}>{`${HourFrom} ${HourTo}`}</Text>
            );
        }

        if (dataItem.DurationTypeView != null) {
            viewDataDurationTypeView = (
                <Text style={[styleSheets.text, { color: Colors.grey }]}>{dataItem.DurationTypeView}</Text>
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
                renderRightActions={rowActions != null && !isOpenAction ? this.rightActions : this.rightActionsEmpty}
                friction={0.6}
            >
                <View style={itemContent}>
                    <View style={leftItem}>
                        <View style={styleDateAndTitle}>
                            {viewIconType}
                            <Text style={[styleSheets.text, txtDateTimeTitle]}>{dataItem.TitleRequest}</Text>
                        </View>
                        <View style={styleTimeRequest}>
                            {viewDataFromDateTo}
                            {viewDataFromHourTo}
                        </View>
                        <View style={styleTimeRequest}>{viewDataDurationTypeView}</View>
                    </View>
                    <View style={rightItem}>{viewStatus}</View>
                </View>
            </Swipeable>
        );
    }
}

const styles = StyleSheet.create({
    styleTimeRequest: {
        flexDirection: 'row'
    },
    itemContent: {
        backgroundColor: Colors.white,
        flexDirection: 'row',
        paddingVertical: styleSheets.p_15,
        paddingHorizontal: styleSheets.p_10
    },
    leftItem: {
        flex: 1,
        justifyContent: 'center'
    },
    rightItem: {
        width: Size.deviceWidth * 0.25,
        flexDirection: 'column'
    },
    styleDateAndTitle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    viewIconNext: {
        marginHorizontal: styleSheets.m_5
    },
    styleStatus: {
        paddingVertical: styleSheets.p_7,
        paddingHorizontal: styleSheets.p_10,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txtStatus: {
        textAlign: 'center',
        fontWeight: '600'
    },
    txtDateTimeTitle: {
        fontSize: Size.text + 1,
        fontWeight: '700',
        color: Colors.primary,
        marginLeft: 3
    },
    flexDirection: {
        flexDirection: 'row'
    }
});
