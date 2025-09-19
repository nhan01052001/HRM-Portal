import React from 'react';
import { View, Text, Platform } from 'react-native';
import { styleSheets, styleListLableValueCommom } from '../../../../../constants/styleConfig';
import moment from 'moment';
import format from 'number-format.js';
import VnrText from '../../../../../components/VnrText/VnrText';

export default class DisciplineItem extends React.Component {
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

        let TimeCouse = '';
        if (dataItem.DateOfEffective) {
            TimeCouse = moment(dataItem.DateOfEffective).format('DD/MM/YYYY');
        }

        if (dataItem.DateEndOfViolation) {
            if (TimeCouse !== '') {
                TimeCouse = `${TimeCouse} - ${moment(dataItem.DateEndOfViolation).format('DD/MM/YYYY')}`;
            } else {
                TimeCouse = moment(dataItem.DateEndOfViolation).format('DD/MM/YYYY');
            }
        }
        const styles = styleListLableValueCommom;
        // ClassName DateTime EndDate StatusView
        return (
            <View style={Platform.OS == 'ios' ? styles.viewButtonIOS : styles.swipeable} key={index}>
                <View style={styles.viewButton}>
                    <View style={styles.rightBody}>
                        <View style={styles.Line}>
                            <View style={styles.IconView}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.lable, styles.txtLable]}
                                    i18nKey={'HRM_HR_ArchivesTable_Formality'}
                                />
                            </View>
                            <View style={styles.valueView}>
                                {/* <Text style={styleSheets.text}>: </Text> */}
                                <Text numberOfLines={1} style={[styleSheets.text]}>
                                    {dataItem.DisciplinedTypesName}
                                </Text>
                            </View>
                        </View>

                        {TimeCouse != '' && (
                            <View style={styles.Line}>
                                <View style={styles.IconView}>
                                    <VnrText
                                        numberOfLines={1}
                                        style={[styleSheets.lable, styles.txtLable]}
                                        i18nKey={'HRM_Field_Train_DurationTime'}
                                    />
                                </View>
                                <View style={styles.valueView}>
                                    {/* <Text style={styleSheets.text}>: </Text> */}
                                    <Text numberOfLines={1} style={[styleSheets.text]}>
                                        {TimeCouse}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        );
    }
}
