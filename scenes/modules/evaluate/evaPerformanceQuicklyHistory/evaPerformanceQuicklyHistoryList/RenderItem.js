import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { styleSheets, Colors, Size } from '../../../../../constants/styleConfig';
import moment from 'moment';
import format from 'number-format.js';
import VnrText from '../../../../../components/VnrText/VnrText';

export default class RenderItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.formatStringType = this.formatStringType.bind(this);
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
        const { dataItem, index } = this.props;
        let viewFromCaculation = <View />;

        if (dataItem.Score) {
            viewFromCaculation = (
                <View style={styles.iconAvatarView}>
                    <View style={styles.viewScore}>
                        <Text style={styles.txtMonthValue}>{dataItem.Score}</Text>
                    </View>
                    <VnrText i18nKey={'TotalMark'} style={styles.txtMonthLable} />
                </View>
            );
        } else if (dataItem.Actual) {
            viewFromCaculation = (
                <View style={styles.iconAvatarView}>
                    <View style={styles.viewScore}>
                        <Text style={styles.txtMonthValue}>{dataItem.Actual}</Text>
                    </View>
                    <VnrText i18nKey={'ResultNumber'} style={styles.txtMonthLable} />
                </View>
            );
        } else if (dataItem.Times) {
            viewFromCaculation = (
                <View style={styles.iconAvatarView}>
                    <View style={styles.viewScore}>
                        <Text style={styles.txtMonthValue}>{dataItem.Times}</Text>
                    </View>
                    <VnrText i18nKey={'FormOfCalculation__E_TIMES'} style={styles.txtMonthLable} />
                </View>
            );
        }

        return (
            <View style={Platform.OS == 'ios' ? styles.viewButtonIOS : styles.swipeable} key={index}>
                <View style={styles.viewButton}>
                    <View style={styles.leftBody} key={index}>
                        {viewFromCaculation}
                    </View>
                    <View style={styles.rightBody}>
                        {/* chức vụ - PositionName */}
                        <View style={styles.Line}>
                            <View style={styles.IconView}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.lable, styles.txtLable]}
                                    i18nKey={'HRM_HR_Category_Employee'}
                                />
                            </View>
                            <View style={styles.valueView}>
                                {/* <Text style={styleSheets.text}>: </Text> */}
                                <Text numberOfLines={1} style={[styleSheets.text]}>
                                    {dataItem.ProfileName}
                                </Text>
                            </View>
                        </View>

                        {/* Tiêu chí - KPINameView */}
                        <View style={styles.Line}>
                            <View style={styles.IconView}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.lable, styles.txtLable]}
                                    i18nKey={'Hrm_Sal_EvaluationOfSalaryApprove_Criteria'}
                                />
                            </View>
                            <View style={styles.valueView}>
                                <Text numberOfLines={1} style={[styleSheets.text]}>
                                    {dataItem.KPINameView}
                                </Text>
                            </View>
                        </View>

                        {/* Ngày đánh giá - DateSigned */}
                        <View style={styles.Line}>
                            <View style={styles.IconView}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.lable, styles.txtLable]}
                                    i18nKey={'HRM_Tas_Task_Evaluationdate'}
                                />
                            </View>
                            <View style={styles.valueView}>
                                {/* <Text style={styleSheets.text}>: </Text> */}
                                <Text numberOfLines={1} style={[styleSheets.text]}>
                                    {dataItem.DateEvaluation
                                        ? moment(dataItem.DateEvaluation).format('DD/MM/YYYY')
                                        : ''}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    swipeable: {
        flex: 1,
        borderRadius: 10,
        flexDirection: 'row',
        marginBottom: 13,
        marginHorizontal: 10,
        backgroundColor: Colors.whiteOpacity70,
        borderWidth: 2,
        borderColor: Colors.borderColor,
        paddingVertical: 12
    },
    viewButton: {
        flex: 1,
        backgroundColor: Colors.whiteOpacity70,
        borderRadius: 10,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    viewButtonIOS: {
        flex: 1,
        borderRadius: 10,
        marginBottom: 13,
        marginHorizontal: 10,
        shadowColor: Colors.black,
        backgroundColor: Colors.whitePure,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.2,
        shadowRadius: 5.46,
        elevation: 8
    },
    leftBody: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightColor: Colors.borderColor,
        borderRightWidth: 0.5,
        paddingHorizontal: 5
    },
    rightBody: {
        flex: 8,
        paddingHorizontal: 10
    },
    iconAvatarView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    txtMonthLable: {
        fontSize: Size.text - 2,
        color: Colors.greySecondary
    },
    txtMonthValue: {
        fontSize: Size.text + 3,
        fontWeight: '500'
    },
    Line: {
        flex: 1,
        flexDirection: 'row',
        maxWidth: '100%',
        justifyContent: 'center'
    },
    valueView: {
        flex: 6,
        marginLeft: 10,
        alignItems: 'center',
        flexDirection: 'row'
    },
    IconView: {
        flex: 4,
        height: '100%',
        justifyContent: 'center'
    },
    viewScore: {
        // paddingVertical: 7,
        // paddingHorizontal: 7,
        // borderWidth: 0.5,
        // borderRadius: 5,
        // borderColor: Colors.black,
        marginBottom: 5
    }
});
