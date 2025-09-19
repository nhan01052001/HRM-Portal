import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Size, styleSheets, Colors } from '../../../../../constants/styleConfig';
import moment from 'moment';
import format from 'number-format.js';
import VnrText from '../../../../../components/VnrText/VnrText';

const Enum = {
    E_NEWTASK: {
        value: 'E_NEWTASK'
    },
    E_EVALUATED: {
        value: 'E_EVALUATED'
    },
    E_COMPLETED: {
        value: 'E_COMPLETED'
    },
    E_CANCEL: {
        value: 'E_CANCEL'
    },
    E_ASSIGNED: {
        value: 'E_ASSIGNED'
    },
    E_FEEDBACK: {
        value: 'E_FEEDBACK'
    },
    E_CONFIRMED: {
        value: 'E_CONFIRMED'
    }
};

export default class RenderItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.formatStringType = this.formatStringType.bind(this);
        this.listDay = {};
    }

    shouldComponentUpdate(nextProps) {
        if (
            nextProps.isPullToRefresh !== this.props.isPullToRefresh ||
            nextProps.isSelect !== this.props.isSelect ||
            nextProps.isOpenAction !== this.props.isOpenAction
        ) {
            return true;
        } else {
            return false;
        }
    }

    formatStringType = (data, col) => {
        if (data[col.Name]) {
            if (col.DataType && col.DataType.toLowerCase() == 'datetime') {
                return moment(data[col.Name]).format(col.DataFormat);
            }
            if (col.DataType && col.DataType.toLowerCase() == 'double') {
                return format(col.DataFormat, data[col.Name]);
            } else {
                return data[col.Name];
            }
        } else {
            return '';
        }
    };

    render() {
        const { dataItem, index, numberDataSoure, listDayGroupTimeLine } = this.props;
        let ContentRight = <View />,
            viewDayGroup = <View />,
            ColorStatus = dataItem && dataItem.colorStatus ? dataItem.colorStatus : Colors.grey,
            dayCreate = moment(dataItem.DateCreate).format('DD/MM/YYYY');

        if (!listDayGroupTimeLine[dayCreate]) {
            listDayGroupTimeLine[dayCreate] = true;
            viewDayGroup = (
                <View style={styles.timeLine_Item__RightDayGroup}>
                    <Text style={[styleSheets.text, styles.timeLine_Item__RightTextDayGroup]}>{dayCreate}</Text>
                </View>
            );
        }

        if (dataItem.Action === Enum.E_NEWTASK.value) {
            ContentRight = (
                <View
                    style={[
                        styles.timeLine_Item__RightStart,
                        {
                            backgroundColor: ColorStatus
                        }
                    ]}
                >
                    <VnrText i18nKey={'E_NEWONJOB'} />
                </View>
            );
        } else {
            ContentRight = (
                <View
                    style={[
                        styles.timeLine_Item__RightContent,
                        {
                            borderColor: ColorStatus
                        }
                    ]}
                >
                    <View style={styles.timeLine_Item__RightItem}>
                        <View style={styles.timeLine_Item__RightIconView}>
                            <VnrText style={[styleSheets.lable, styles.txtLable]} i18nKey={'AssignTask__E_ASSIGNED'} />
                        </View>
                        <View style={styles.timeLine_Item__RightValueView}>
                            <Text numberOfLines={1} style={[styleSheets.text]}>
                                {dataItem.FullNameAssigned ? dataItem.FullNameAssigned : ''}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.timeLine_Item__RightItem}>
                        <View style={styles.timeLine_Item__RightIconView}>
                            <VnrText
                                style={[styleSheets.lable, styles.txtLable]}
                                i18nKey={'HRM_Attendance_UserCreate'}
                            />
                        </View>
                        <View style={styles.timeLine_Item__RightValueView}>
                            <Text numberOfLines={1} style={styleSheets.text}>
                                {dataItem.UserCreate ? dataItem.UserCreate : ''}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.timeLine_Item__RightItem}>
                        <View style={styles.timeLine_Item__RightIconView}>
                            <VnrText style={[styleSheets.lable, styles.txtLable]} i18nKey={'HRM_Hre_Tas_Task_Status'} />
                        </View>
                        <View style={styles.timeLine_Item__RightValueView}>
                            <Text
                                numberOfLines={1}
                                style={[
                                    styleSheets.text,
                                    {
                                        color: ColorStatus
                                    }
                                ]}
                            >
                                {dataItem.StatusTask ? dataItem.StatusTask : ''}
                            </Text>
                        </View>
                    </View>
                </View>
            );
        }
        return (
            <View style={styles.timeLine_Item}>
                <View style={styles.timeLine_Item__Left}>
                    {index < numberDataSoure - 1 && <View style={styles.line} />}
                    <View
                        style={[
                            styles.timeLine_Start,
                            {
                                backgroundColor: ColorStatus
                            }
                        ]}
                    >
                        <Text style={styleSheets.text}>{index}</Text>
                    </View>
                </View>
                <View style={styles.timeLine_Item__Right}>
                    {viewDayGroup}
                    {ContentRight}
                </View>
            </View>
        );
    }
}

const withLeft = Size.deviceWidth * 0.18,
    widthRight = Size.deviceWidth * 0.82;

const styles = StyleSheet.create({
    timeLine_Item: {
        flex: 1,
        flexDirection: 'row'
    },
    timeLine_Item__Left: {
        // flex: 3.5,
        width: withLeft,
        alignItems: 'center'
    },
    // timeLine_Item__Center: {
    //     // flex: 3.5,
    //     width: withCenter,
    //     alignItems: 'center',

    // },
    timeLine_Item__Right: {
        width: widthRight,
        paddingTop: 5,
        // paddingHorizontal: 10,
        paddingRight: 10,
        paddingBottom: 10
    },
    timeLine_Item__RightContent: {
        flex: 1,
        borderColor: Colors.primary,
        borderWidth: 1.5,
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 5
    },
    timeLine_Item__RightStart: {
        flex: 1,
        borderColor: Colors.primary,
        borderWidth: 0.5,
        paddingVertical: 15,
        alignItems: 'center',
        paddingHorizontal: 10,
        borderRadius: 5
    },
    timeLine_Start: {
        width: withLeft * 0.5,
        height: withLeft * 0.5,
        borderColor: Colors.borderColor,
        borderWidth: 1.5,
        borderRadius: (withLeft * 0.5) / 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    line: {
        width: 1.5,
        height: '100%',
        position: 'absolute',
        left: withLeft / 2,
        backgroundColor: Colors.grey
    },
    timeLine_Item__RightItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    timeLine_Item__RightIconView: {
        flex: 3,
        justifyContent: 'center'
    },
    timeLine_Item__RightValueView: {
        flex: 7,
        justifyContent: 'center'
    },
    timeLine_Item__RightDayGroup: {
        flex: 1,
        marginBottom: 5,
        alignItems: 'center'
    },
    timeLine_Item__RightTextDayGroup: {
        fontSize: Size.text + 2,
        color: Colors.grey
    }
});
