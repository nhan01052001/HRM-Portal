import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { styleSheets, Colors } from '../../../../../../constants/styleConfig';
import moment from 'moment';
import format from 'number-format.js';
import VnrText from '../../../../../../components/VnrText/VnrText';
export default class EvaPerformanceTargetItem extends React.Component {
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
        let ScoreBetween = '';
        if (dataItem.MinimumRating) {
            ScoreBetween = dataItem.MinimumRating;
        }

        if (dataItem.MaximumRating) {
            if (ScoreBetween !== '') {
                ScoreBetween = `${ScoreBetween} ~ ${dataItem.MaximumRating}`;
            } else {
                ScoreBetween = dataItem.MaximumRating;
            }
        }

        return (
            <View style={Platform.OS == 'ios' ? styles.viewButtonIOS : styles.swipeable} key={index}>
                <View style={styles.viewButton}>
                    <View style={styles.rightBody}>
                        {/* KPIName - Tên tiêu chí */}
                        <View style={styles.Line}>
                            <View style={styles.IconView}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.lable, styles.txtLable]}
                                    i18nKey={'HRM_Evaluation_KPIName'}
                                />
                            </View>
                            <View style={styles.valueView}>
                                <Text numberOfLines={1} style={[styleSheets.text]}>
                                    {dataItem && dataItem.KPIName ? dataItem.KPIName : ''}
                                </Text>
                            </View>
                        </View>

                        {/* KPIGroupName - Tên nhóm */}
                        <View style={styles.Line}>
                            <View style={styles.IconView}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.lable, styles.txtLable]}
                                    i18nKey={'HRM_Tra_KPIGroup_Tittle'}
                                />
                            </View>
                            <View style={styles.valueView}>
                                <Text numberOfLines={1} style={[styleSheets.text]}>
                                    {dataItem && dataItem.KPIGroupName ? dataItem.KPIGroupName : ''}
                                </Text>
                            </View>
                        </View>

                        {/* Rate - Trọng số */}
                        <View style={styles.Line}>
                            <View style={styles.IconView}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.lable, styles.txtLable]}
                                    i18nKey={'HRM_Evaluation_Performance_Rate'}
                                />
                            </View>
                            <View style={styles.valueView}>
                                <Text numberOfLines={1} style={[styleSheets.text]}>
                                    {dataItem && dataItem.Rate ? dataItem.Rate : ''}
                                </Text>
                            </View>
                        </View>

                        {/* MinimumRating ~ MaximumRating - điểm tối thiểu ~ điểm tối đa */}
                        <View style={styles.Line}>
                            <View style={styles.IconView}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.lable, styles.txtLable]}
                                    i18nKey={'TotalMark'}
                                />
                            </View>
                            <View style={styles.valueView}>
                                <Text numberOfLines={1} style={[styleSheets.text]}>
                                    {ScoreBetween}
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

        marginBottom: 13,
        marginHorizontal: 10,
        padding: 4,
        backgroundColor: Colors.whitePure
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
    txtLable: {
        marginRight: 3
    },
    rightBody: {
        flex: 7,
        paddingHorizontal: 10
    },
    Line: {
        flex: 1,
        flexDirection: 'row',
        maxWidth: '100%',
        justifyContent: 'center',
        marginBottom: 5
    },
    valueView: {
        flex: 6,
        marginLeft: 5,
        alignItems: 'center',
        flexDirection: 'row'
    },
    IconView: {
        flex: 4,
        height: '100%',
        justifyContent: 'flex-start',
        flexDirection: 'row'
    }
});
