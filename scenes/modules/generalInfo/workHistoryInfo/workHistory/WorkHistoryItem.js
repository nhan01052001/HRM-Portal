import React from 'react';
import { View, Text, Platform } from 'react-native';
import { styleSheets, styleListLableValueCommom } from '../../../../../constants/styleConfig';
import moment from 'moment';
import format from 'number-format.js';
import VnrText from '../../../../../components/VnrText/VnrText';
import { ConfigField } from '../../../../../assets/configProject/ConfigField';

export default class WorkHistoryItem extends React.Component {
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
        const styles = styleListLableValueCommom;

        const _configField =
            ConfigField && ConfigField.value['WorkHistory'] ? ConfigField.value['WorkHistory']['Hidden'] : [];
        let isShowPositionName = _configField.findIndex(key => key == 'PositionName') > -1 ? false : true;
        let isShowEmployeeTypeName = _configField.findIndex(key => key == 'EmployeeTypeName') > -1 ? false : true;

        return (
            <View style={Platform.OS == 'ios' ? styles.viewButtonIOS : styles.swipeable} key={index}>
                <View style={styles.viewButton}>
                    <View style={styles.rightBody}>
                        {dataItem.OrgStructureName != null && (
                            <View style={styles.Line}>
                                <View style={styles.IconView}>
                                    <VnrText
                                        numberOfLines={1}
                                        style={[styleSheets.lable, styles.txtLable]}
                                        i18nKey={'HRM_HR_WorkHistory_OrgStructureID'}
                                    />
                                </View>
                                <View style={styles.valueView}>
                                    <Text numberOfLines={1} style={[styleSheets.text]}>
                                        {dataItem.OrgStructureName}
                                    </Text>
                                </View>
                            </View>
                        )}

                        {isShowEmployeeTypeName ? (
                            <View style={styles.Line}>
                                <View style={styles.IconView}>
                                    <VnrText
                                        numberOfLines={1}
                                        style={[styleSheets.lable, styles.txtLable]}
                                        i18nKey={'HRM_Common_JobTitle'}
                                    />
                                </View>
                                <View style={styles.valueView}>
                                    <Text numberOfLines={1} style={[styleSheets.text]}>
                                        {dataItem.JobTitleName}
                                    </Text>
                                </View>
                            </View>
                        ) : null}

                        {isShowPositionName ? (
                            <View style={styles.Line}>
                                <View style={styles.IconView}>
                                    <VnrText
                                        numberOfLines={1}
                                        style={[styleSheets.lable, styles.txtLable]}
                                        i18nKey={'PositionOffer'}
                                    />
                                </View>
                                <View style={styles.valueView}>
                                    <Text numberOfLines={1} style={[styleSheets.text]}>
                                        {dataItem.PositionName}
                                    </Text>
                                </View>
                            </View>
                        ) : null}

                        {/* {
                            dataItem.TypeOfTransferName != null && ( */}
                        <View style={styles.Line}>
                            <View style={styles.IconView}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.lable, styles.txtLable]}
                                    i18nKey={'HRM_HR_WorkHistory_JRType'}
                                />
                            </View>
                            <View style={styles.valueView}>
                                <Text numberOfLines={1} style={[styleSheets.text]}>
                                    {dataItem.TypeOfTransferName ? dataItem.TypeOfTransferName : ''}
                                </Text>
                            </View>
                        </View>
                        {/* )
                        } */}
                        {dataItem.DateEffective != null && (
                            <View style={styles.Line}>
                                <View style={styles.IconView}>
                                    <VnrText
                                        numberOfLines={1}
                                        style={[styleSheets.lable, styles.txtLable]}
                                        i18nKey={'HRM_HR_WorkHistory_DateEffective'}
                                    />
                                </View>
                                <View style={styles.valueView}>
                                    <Text numberOfLines={1} style={[styleSheets.text]}>
                                        {moment(dataItem.DateEffective).format('DD/MM/YYYY')}
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
