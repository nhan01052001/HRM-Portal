import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    Size,
    styleSheets,
    Colors,
    stylesModalPopupBottom,
    styleSafeAreaView,
    stylesScreenDetailV3,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import moment from 'moment';
import format from 'number-format.js';
import VnrText from '../../../../../components/VnrText/VnrText';
import { IconColse } from '../../../../../constants/Icons';
import Modal from 'react-native-modal';
import { translate } from '../../../../../i18n/translate';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
import { ConfigField } from '../../../../../assets/configProject/ConfigField';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import DrawerServices from '../../../../../utils/DrawerServices';
import VnrFormatStringTypeItem from '../../../../../componentsV3/VnrFormatStringType/VnrFormatStringTypeItem';

const NUMBER_ALLOWANCEAMOUNT = 40;

export default class BasicSalaryDetailItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisibleModalSalary: false
        };
        this.formatStringType = this.formatStringType.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (
            nextProps.isPullToRefresh !== this.props.isPullToRefresh ||
            nextProps.isSelect !== this.props.isSelect ||
            nextProps.isOpenAction !== this.props.isOpenAction ||
            nextState.isVisibleModalSalary !== this.state.isVisibleModalSalary
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

    showSalaryCP = () => {
        this.setState({
            isVisibleModalSalary: true
        });
    };

    hideDetailSal = () => {
        this.setState({
            isVisibleModalSalary: false
        });
    };

    viewListDetailSal = (dataItem) => {
        //0182528: [hot fix OPA_v8.12.20.01.06] [App OPA] Lấy động thông tin tên phụ cấp của nhân viên để hiển thị lên app
        let arr = [];

        for (let i = 0; i < NUMBER_ALLOWANCEAMOUNT; i++) {
            if (
                !!dataItem[`UsualAllowanceName${i + 1}Salary`] &&
                dataItem[`AllowanceAmount${i + 1}`] &&
                dataItem[`AllowanceAmount${i + 1}`] > 0
            )
                arr.push({
                    lable: dataItem[`UsualAllowanceName${i + 1}Salary`],
                    value: `${format('#,###.#', dataItem[`AllowanceAmount${i + 1}`])} ${dataItem[`CurrencyCode${i + 1}`] ? dataItem[`CurrencyCode${i + 1}`] : ''}`
                });
        }

        return (
            <View style={styles.styContentViewSalList}>
                {arr.map((item, index) => {
                    return (
                        <View style={styles.styRowSal} key={index}>
                            <VnrText i18nKey={item.lable} style={[styleSheets.text, styles.line_date_text]} />
                            <View style={styles.line_time_wrap}>
                                <Text style={[styleSheets.text, styles.line_text]}>{item.value}</Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        );
    };

    render() {
        const { dataItem, index, renderRowConfig } = this.props,
            { isVisibleModalSalary } = this.state;
        let _renderRowConfig = renderRowConfig

        //0182528: [hot fix OPA_v8.12.20.01.06] [App OPA] Lấy động thông tin tên phụ cấp của nhân viên để hiển thị lên app
        let totalPC = 0,
            isShowTotalAmount = true;

        for (let i = 0; i < NUMBER_ALLOWANCEAMOUNT; i++) {
            if (dataItem[`AllowanceAmount${i + 1}`]) totalPC += dataItem[`AllowanceAmount${i + 1}`];

            if (dataItem?.CurrencyCode !== dataItem[`CurrencyCode${i + 1}`]) isShowTotalAmount = false;
        }

        const _configField =
                ConfigField && ConfigField.value['BasicSalaryDetail']
                    ? ConfigField.value['BasicSalaryDetail']['Hidden']
                    : [],
            fileAttachment = dataItem.FileAttachment ? dataItem.FileAttachment : null;

        const handleFiles = [];

        if (fileAttachment != null)
            fileAttachment.split(',').map((nameFile) => {
                handleFiles.push(`${dataVnrStorage.apiConfig.uriPor}/Uploads/${nameFile}`);
            });

        // Mặc định ẩn
        let isShowCodeEmp = _configField.findIndex((key) => key == 'ReviewMail') > -1 ? false : true,
            isAllowanceAmount = _configField.findIndex((key) => key == 'AllowanceAmount') > -1 ? false : true;
        return (
            <View style={styles.swipeable}>
                <View style={[styles.swipeableLayout]}>
                    <View style={[styles.container]} key={index}>
                        <View style={styles.Line}>
                            <View style={styles.lineLeft}>
                                {_renderRowConfig.map((col, index) => (
                                    <VnrFormatStringTypeItem
                                        key={index}
                                        data={dataItem}
                                        col={col}
                                        allConfig={_renderRowConfig}
                                    />
                                ))}

                                {isAllowanceAmount && (
                                    <View style={styles.line_date_row}>
                                        <VnrText
                                            i18nKey={'TotalAllowance'}
                                            style={[styleSheets.text, styles.line_date_text]}
                                        />
                                        <TouchableOpacity
                                            style={styles.line_time_wrap}
                                            onPress={() => this.showSalaryCP()}
                                        >
                                            <Text
                                                style={[styleSheets.text, styles.line_text, styles.styLinkText]}
                                                numberOfLines={1}
                                            >
                                                {totalPC && isShowTotalAmount
                                                    ? `${format('#,###.#', totalPC)} ${dataItem.CurrencyCode}`
                                                    : translate('HRM_Common_Showmore')}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {isShowCodeEmp && (
                                    <View style={styles.line_date_row}>
                                        <View style={styles.styViewTitleMail}>
                                            <VnrText
                                                i18nKey={'HRM_Payroll_Basic_Salary_Lable_ReviewMail'}
                                                style={[styleSheets.text, styles.line_date_text]}
                                            />
                                        </View>
                                        <View style={styles.styViewMail}>
                                            {handleFiles.map((link, index) => (
                                                <TouchableOpacity
                                                    key={index}
                                                    style={styles.styBtnViewMail}
                                                    onPress={() => {
                                                        Platform.OS == 'android'
                                                            ? DrawerServices.navigate('BasicSalaryDetailViewDetail', {
                                                                dataItem: {
                                                                    FileAttachment: link
                                                                }
                                                            })
                                                            : ManageFileSevice.ReviewFile(link);
                                                    }}
                                                >
                                                    <VnrText
                                                        value={`${translate(
                                                            'HRM_Payroll_Basic_Salary_ViewMail'
                                                        )} ${index + 1}`}
                                                        style={[styleSheets.text, styles.line_text, styles.styLinkText]}
                                                    />
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>

                    <Modal
                        onBackButtonPress={() => this.hideDetailSal()}
                        isVisible={isVisibleModalSalary}
                        onBackdropPress={() => this.hideDetailSal()}
                        customBackdrop={
                            <TouchableWithoutFeedback onPress={() => this.hideDetailSal()}>
                                <View style={stylesScreenDetailV3.modalBackdrop} />
                            </TouchableWithoutFeedback>
                        }
                        style={CustomStyleSheet.margin(0)}
                    >
                        <View style={stylesModalPopupBottom.viewModal}>
                            <SafeAreaView {...styleSafeAreaView} style={stylesModalPopupBottom.safeRadius}>
                                <View style={styles.headerCloseModal}>
                                    <TouchableOpacity onPress={() => this.hideDetailSal()}>
                                        <IconColse color={Colors.grey} size={Size.iconSize} />
                                    </TouchableOpacity>
                                    <VnrText style={styleSheets.lable} i18nKey={'TotalAllowance'} />
                                    <IconColse color={Colors.white} size={Size.iconSize} />
                                </View>
                                <ScrollView style={styleSheets.flexGrow1flexDirectionColumn}>
                                    {this.viewListDetailSal(dataItem)}
                                </ScrollView>
                            </SafeAreaView>
                        </View>
                    </Modal>
                </View>
            </View>
        );
    }
}

const PADDING_DEFINE = Size.defineSpace;
const styles = StyleSheet.create({
    headerCloseModal: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
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
        flexDirection: 'row',
        marginBottom: Size.defineSpace
    },
    container: {
        flex: 1
    },

    styLinkText: {
        color: Colors.primary,
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
        textDecorationColor: Colors.primary
    },
    styViewMail: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-end'
    },
    styViewTitleMail: {
        height: '100%',
        justifyContent: 'flex-start'
    },
    Line: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: PADDING_DEFINE,
        paddingVertical: PADDING_DEFINE,
        paddingBottom: PADDING_DEFINE - 5
        // marginHorizontal: Size.defineSpace
    },
    lineLeft: {
        flex: 1,
        paddingRight: Size.defineSpace / 2
    },

    line_date_row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        marginBottom: 5
    },
    line_time_wrap: {
        flex: 1,
        alignItems: 'flex-end'
    },
    styBtnViewMail: {
        alignItems: 'flex-end',
        marginLeft: Size.defineSpace
    },
    line_text: {
        fontSize: Size.text,
        color: Colors.gray_10,
        fontWeight: '500'
    },
    line_date_text: {
        fontSize: Size.text - 1,
        color: Colors.gray_10,
        textAlign: 'left'
    },
    styContentViewSalList: {
        flex: 1,
        paddingHorizontal: Size.defineSpace
    },
    styRowSal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        paddingVertical: Size.defineSpace - 4
    }
});
