import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Size, styleSheets } from '../../../../../constants/styleConfig';
import moment from 'moment';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { translate } from '../../../../../i18n/translate';
import VnrText from '../../../../../components/VnrText/VnrText';
import Color from 'color';
export default class TaxInfoListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        //this.setRightAction(props);
        this.Swipe = null;
    }

    setRightAction = thisProps => {
        const { dataItem } = thisProps;
        this.sheetActions = [
            {
                title: translate('HRM_Common_Close'),
                onPress: null
            }
        ];

        dataItem.BusinessAllowAction = ['E_DELETE', 'E_MODIFY'];
        if (!Vnr_Function.CheckIsNullOrEmpty(thisProps.rowActions)) {
            this.rightListActions = thisProps.rowActions.filter(item => {
                return (
                    !Vnr_Function.CheckIsNullOrEmpty(dataItem.BusinessAllowAction) &&
                    dataItem.BusinessAllowAction.indexOf(item.type) >= 0
                );
            });
            if (this.rightListActions.length > 2) {
                this.sheetActions = [...this.rightListActions.slice(1), ...this.sheetActions];
            } else if (this.rightListActions.length > 0) {
                this.sheetActions = [...this.rightListActions.slice(2), ...this.sheetActions];
            }
        }
    };

    shouldComponentUpdate(nextProps) {
        if (
            nextProps.isPullToRefresh !== this.props.isPullToRefresh ||
            nextProps.isSelect !== this.props.isSelect ||
            nextProps.isOpenAction !== this.props.isOpenAction ||
            nextProps.isDisable !== this.props.isDisable
        ) {
            return true;
        } else {
            return false;
        }
    }

    convertTextToColor = value => {
        const [num1, num2, num3, opacity] = value.split(',');
        return Color.rgb(parseFloat(num1), parseFloat(num2), parseFloat(num3), parseFloat(opacity));
    };

    render() {
        const { dataItem, isSelect, index } = this.props;
        let colorStatusView = null,
            borderStatusView = null,
            bgStatusView = null;

        // xử lý color
        if (dataItem.itemStatus) {
            const { colorStatus, borderStatus, bgStatus } = dataItem.itemStatus;
            colorStatusView = colorStatus ? colorStatus : null;
            borderStatusView = borderStatus ? borderStatus : null;
            bgStatusView = bgStatus ? bgStatus : null;
        }

        return (
            <View style={styles.swipeable}>
                <View style={[styles.swipeableLayout, isSelect && { backgroundColor: Colors.Secondary95 }]}>
                    <View style={[styles.container]} key={index}>
                        <View style={styles.line}>
                            <View style={styles.line_date_row}>
                                <VnrText
                                    i18nKey={'HRM_Payroll_Sal_TaxInformationRegister_strType'}
                                    style={[styleSheets.text, styles.line_date_text]}
                                />
                                <Text style={[styleSheets.text, styles.line_text]}>
                                    {dataItem.TypeView ? dataItem.TypeView : ''}
                                </Text>
                            </View>

                            <View style={styles.line_date_row}>
                                <VnrText
                                    i18nKey={'HRM_Payroll_Sal_TaxInformationRegister_DateSubmit'}
                                    style={[styleSheets.text, styles.line_date_text]}
                                />
                                <Text style={[styleSheets.text, styles.line_text]}>
                                    {dataItem.DateSubmit ? moment(dataItem.DateSubmit).format('DD/MM/YYYY') : ''}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.viewStatusBottom}>
                            <View style={styles.dateTimeSubmit}>
                                <Text style={[styleSheets.textItalic, styles.dateTimeSubmit_Text]}>
                                    {dataItem.DateUpdate != null &&
                                        dataItem.DateUpdate != undefined &&
                                        `${translate('E_AT_TIME')} ${moment(dataItem.DateUpdate).format(
                                            'HH:mm DD/MM/YYYY'
                                        )}`}
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.lineSatus,
                                    {
                                        borderColor: borderStatusView
                                            ? this.convertTextToColor(borderStatusView)
                                            : Colors.gray_10,
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
                                            color: colorStatusView
                                                ? this.convertTextToColor(colorStatusView)
                                                : dataItem.colorStatus
                                        }
                                    ]}
                                >
                                    {dataItem.StatusView ? dataItem.StatusView : ''}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const PADDING_DEFINE = Size.defineSpace;
const styles = StyleSheet.create({
    swipeable: {
        flex: 1,
        paddingHorizontal: Size.defineSpace
    },
    swipeableLayout: {
        flex: 1,
        borderRadius: 8,
        backgroundColor: Colors.white,
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        position: 'relative',
        flexDirection: 'row'
    },
    container: {
        flex: 1,
        paddingTop: PADDING_DEFINE,
        marginBottom: 4
    },
    viewStatusBottom: {
        paddingVertical: PADDING_DEFINE / 2,
        paddingHorizontal: PADDING_DEFINE,
        borderTopColor: Colors.gray_5,
        borderTopWidth: 0.5,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    lineSatus: {
        borderRadius: styleSheets.radius_5,
        alignItems: 'center',
        borderWidth: 0.5,
        paddingVertical: 2,
        paddingHorizontal: PADDING_DEFINE
    },
    dateTimeSubmit: {
        alignSelf: 'flex-end'
    },

    lineSatus_text: {
        fontSize: Size.text - 3,
        fontWeight: '500'
    },
    line: {
        marginHorizontal: PADDING_DEFINE,
        marginBottom: PADDING_DEFINE,
        paddingHorizontal: PADDING_DEFINE / 2,
        justifyContent: 'center',
        backgroundColor: Colors.primary_transparent_8,
        paddingVertical: PADDING_DEFINE / 2,
        borderRadius: 8
    },

    dateTimeSubmit_Text: {
        fontSize: Size.text - 3,
        color: Colors.gray_10
    },
    line_date_row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    line_text: {
        fontSize: Size.text + 1,
        color: Colors.primary,
        fontWeight: '500'
    },
    line_date_text: {
        fontSize: Size.text,
        color: Colors.gray_8,
        marginRight: 15
    }
});
