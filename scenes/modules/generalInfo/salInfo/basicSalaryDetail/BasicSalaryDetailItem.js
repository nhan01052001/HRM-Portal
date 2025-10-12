import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    TouchableWithoutFeedback,
    ScrollView
} from 'react-native';
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

    viewListDetailSal = dataItem => {
        const {
            AllowanceAmount1 = 0,
            AllowanceAmount2 = 0,
            AllowanceAmount3 = 0,
            AllowanceAmount4 = 0,
            AllowanceAmount5 = 0,
            AllowanceAmount6 = 0,
            AllowanceAmount7 = 0,
            AllowanceAmount8 = 0,
            AllowanceAmount9 = 0,
            AllowanceAmount10 = 0,
            AllowanceAmount11 = 0,
            AllowanceAmount12 = 0,
            AllowanceAmount13 = 0,
            AllowanceAmount14 = 0,
            AllowanceAmount15 = 0,
            CurrencyCode1,
            CurrencyCode2,
            CurrencyCode3,
            CurrencyCode4,
            CurrencyCode5,
            CurrencyCode6,
            CurrencyCode7,
            CurrencyCode8,
            CurrencyCode9,
            CurrencyCode10,
            CurrencyCode11,
            CurrencyCode12,
            CurrencyCode13,
            CurrencyCode14,
            CurrencyCode15
        } = dataItem;

        let arr = [
            {
                lable: 'HRM_HR_Contract_AllowanceID1',
                value:
                    AllowanceAmount1 != null && AllowanceAmount1 > 0
                        ? `${format('#,###.#', AllowanceAmount1)} ${CurrencyCode1 != null ? CurrencyCode1 : ''}`
                        : ''
            },
            {
                lable: 'HRM_HR_Contract_AllowanceID2',
                value:
                    AllowanceAmount2 != null && AllowanceAmount2 > 0
                        ? `${format('#,###.#', AllowanceAmount2)} ${CurrencyCode2 != null ? CurrencyCode2 : ''}`
                        : ''
            },
            {
                lable: 'HRM_HR_Contract_AllowanceID3',
                value:
                    AllowanceAmount3 != null && AllowanceAmount3 > 0
                        ? `${format('#,###.#', AllowanceAmount3)} ${CurrencyCode3 != null ? CurrencyCode3 : ''}`
                        : ''
            },
            {
                lable: 'HRM_HR_Contract_AllowanceID4',
                value:
                    AllowanceAmount4 != null && AllowanceAmount4 > 0
                        ? `${format('#,###.#', AllowanceAmount4)} ${CurrencyCode4 != null ? CurrencyCode4 : ''}`
                        : ''
            },
            {
                lable: 'HRM_HR_Contract_AllowanceID5',
                value:
                    AllowanceAmount5 != null && AllowanceAmount5 > 0
                        ? `${format('#,###.#', AllowanceAmount5)} ${CurrencyCode5 != null ? CurrencyCode5 : ''}`
                        : ''
            },
            {
                lable: 'HRM_HR_Contract_AllowanceID6',
                value:
                    AllowanceAmount6 != null && AllowanceAmount6 > 0
                        ? `${format('#,###.#', AllowanceAmount6)} ${CurrencyCode6 != null ? CurrencyCode6 : ''}`
                        : ''
            },
            {
                lable: 'HRM_HR_Contract_AllowanceID7',
                value:
                    AllowanceAmount7 != null && AllowanceAmount7 > 0
                        ? `${format('#,###.#', AllowanceAmount7)} ${CurrencyCode7 != null ? CurrencyCode7 : ''}`
                        : ''
            },
            {
                lable: 'HRM_HR_Contract_AllowanceID8',
                value:
                    AllowanceAmount8 != null && AllowanceAmount8 > 0
                        ? `${format('#,###.#', AllowanceAmount8)} ${CurrencyCode8 != null ? CurrencyCode8 : ''}`
                        : ''
            },
            {
                lable: 'HRM_HR_Contract_AllowanceID9',
                value:
                    AllowanceAmount9 != null && AllowanceAmount9 > 0
                        ? `${format('#,###.#', AllowanceAmount9)} ${CurrencyCode9 != null ? CurrencyCode9 : ''}`
                        : ''
            },
            {
                lable: 'HRM_HR_Contract_AllowanceID10',
                value:
                    AllowanceAmount10 != null && AllowanceAmount10 > 0
                        ? `${format('#,###.#', AllowanceAmount10)} ${CurrencyCode10 != null ? CurrencyCode10 : ''}`
                        : ''
            },
            {
                lable: 'HRM_HR_Contract_AllowanceID11',
                value:
                    AllowanceAmount11 != null && AllowanceAmount11 > 0
                        ? `${format('#,###.#', AllowanceAmount11)} ${CurrencyCode11 != null ? CurrencyCode11 : ''}`
                        : ''
            },
            {
                lable: 'HRM_HR_Contract_AllowanceID12',
                value:
                    AllowanceAmount12 != null && AllowanceAmount12 > 0
                        ? `${format('#,###.#', AllowanceAmount12)} ${CurrencyCode12 != null ? CurrencyCode12 : ''}`
                        : ''
            },
            {
                lable: 'HRM_HR_Contract_AllowanceID13',
                value:
                    AllowanceAmount13 != null && AllowanceAmount13 > 0
                        ? `${format('#,###.#', AllowanceAmount13)} ${CurrencyCode13 != null ? CurrencyCode13 : ''}`
                        : ''
            },
            {
                lable: 'HRM_HR_Contract_AllowanceID14',
                value:
                    AllowanceAmount14 != null && AllowanceAmount14 > 0
                        ? `${format('#,###.#', AllowanceAmount14)} ${CurrencyCode14 != null ? CurrencyCode14 : ''}`
                        : ''
            },
            {
                lable: 'HRM_HR_Contract_AllowanceID15',
                value:
                    AllowanceAmount15 != null && AllowanceAmount15 > 0
                        ? `${format('#,###.#', AllowanceAmount15)} ${CurrencyCode15 != null ? CurrencyCode15 : ''}`
                        : ''
            }
        ];

        return (
            <View style={styles.styContentViewSalList}>
                {arr.map((item) => {
                    return item.value !== '' ? (
                        <View style={styles.styRowSal}>
                            <VnrText i18nKey={item.lable} style={[styleSheets.text, styles.line_date_text]} />
                            <View style={styles.line_time_wrap}>
                                <Text style={[styleSheets.text, styles.line_text]}>{item.value}</Text>
                            </View>
                        </View>
                    ) : (
                        <View />
                    );
                })}
            </View>
        );
    };

    render() {
        const { dataItem, index } = this.props,
            { isVisibleModalSalary } = this.state;

        const {
            AllowanceAmount1 = 0,
            AllowanceAmount2 = 0,
            AllowanceAmount3 = 0,
            AllowanceAmount4 = 0,
            AllowanceAmount5 = 0,
            AllowanceAmount6 = 0,
            AllowanceAmount7 = 0,
            AllowanceAmount8 = 0,
            AllowanceAmount9 = 0,
            AllowanceAmount10 = 0,
            AllowanceAmount11 = 0,
            AllowanceAmount12 = 0,
            AllowanceAmount13 = 0,
            AllowanceAmount14 = 0,
            AllowanceAmount15 = 0,
            CurrencyCode,
            CurrencyCode1,
            CurrencyCode2,
            CurrencyCode3,
            CurrencyCode4,
            CurrencyCode5,
            CurrencyCode6,
            CurrencyCode7,
            CurrencyCode8,
            CurrencyCode9,
            CurrencyCode10,
            CurrencyCode11,
            CurrencyCode12,
            CurrencyCode13,
            CurrencyCode14,
            CurrencyCode15
        } = dataItem;

        let totalPC =
                AllowanceAmount1 +
                AllowanceAmount2 +
                AllowanceAmount3 +
                AllowanceAmount4 +
                AllowanceAmount5 +
                AllowanceAmount6 +
                AllowanceAmount7 +
                AllowanceAmount8 +
                AllowanceAmount9 +
                AllowanceAmount10 +
                AllowanceAmount11 +
                AllowanceAmount12 +
                AllowanceAmount13 +
                AllowanceAmount14 +
                AllowanceAmount15,
            isShowTotalAmount = false;

        // kiểm tra có 1 đơn vị tiền tệ trong 15 phụ cấp khác đơn vị của LCB thì không hiển thị
        if (
            CurrencyCode1 == CurrencyCode &&
            CurrencyCode2 == CurrencyCode &&
            CurrencyCode3 == CurrencyCode &&
            CurrencyCode4 == CurrencyCode &&
            CurrencyCode5 == CurrencyCode &&
            CurrencyCode6 == CurrencyCode &&
            CurrencyCode7 == CurrencyCode &&
            CurrencyCode8 == CurrencyCode &&
            CurrencyCode9 == CurrencyCode &&
            CurrencyCode10 == CurrencyCode &&
            CurrencyCode11 == CurrencyCode &&
            CurrencyCode12 == CurrencyCode &&
            CurrencyCode13 == CurrencyCode &&
            CurrencyCode14 == CurrencyCode &&
            CurrencyCode15 == CurrencyCode
        ) {
            isShowTotalAmount = true;
        }

        const _configField =
                ConfigField && ConfigField.value['BasicSalaryDetail']
                    ? ConfigField.value['BasicSalaryDetail']['Hidden']
                    : [],
            fileAttachment = dataItem.FileAttachment ? dataItem.FileAttachment : null;

        const handleFiles = [];

        if (fileAttachment != null)
            fileAttachment.split(',').map(nameFile => {
                handleFiles.push(`${dataVnrStorage.apiConfig.uriPor}/Uploads/${nameFile}`);
            });

        // Mặc định ẩn
        let isShowCodeEmp = _configField.findIndex(key => key == 'ReviewMail') > -1 ? false : true,
            isAmountTotal = _configField.findIndex(key => key == 'AmountTotal') > -1 ? false : true,
            isAllowanceAmount = _configField.findIndex(key => key == 'AllowanceAmount') > -1 ? false : true;
        return (
            <View style={styles.swipeable}>
                <View style={[styles.swipeableLayout]}>
                    <View style={[styles.container]} key={index}>
                        <View style={styles.Line}>
                            <View style={styles.lineLeft}>
                                <View style={styles.line_date_row}>
                                    <VnrText
                                        i18nKey={'HRM_Payroll_BasicSalary_DateOfEffect'}
                                        style={[styleSheets.text, styles.line_date_text]}
                                    />
                                    <View style={styles.line_time_wrap}>
                                        <Text style={[styleSheets.text, styles.line_text]} numberOfLines={1}>
                                            {dataItem.DateOfEffect
                                                ? moment(dataItem.DateOfEffect).format('DD/MM/YYYY')
                                                : ''}
                                        </Text>
                                    </View>
                                </View>

                                {isAmountTotal && (
                                    <View style={styles.line_date_row}>
                                        <VnrText
                                            i18nKey={'HRM_Payroll_BasicSalary_AmountTotal'}
                                            style={[styleSheets.text, styles.line_date_text]}
                                        />
                                        <View style={styles.line_time_wrap}>
                                            <Text style={[styleSheets.text, styles.line_text]} numberOfLines={1}>
                                                {dataItem.AmountTotal
                                                    ? `${format('#,###.#', dataItem.AmountTotal)} ${
                                                        dataItem.CurrencyCode
                                                    }`
                                                    : ''}
                                            </Text>
                                        </View>
                                    </View>
                                )}

                                <View style={styles.line_date_row}>
                                    <VnrText
                                        i18nKey={'HRM_Payroll_Basic_Salary'}
                                        style={[styleSheets.text, styles.line_date_text]}
                                    />
                                    <View style={styles.line_time_wrap}>
                                        <Text style={[styleSheets.text, styles.line_text]} numberOfLines={1}>
                                            {dataItem.GrossAmountView != null
                                                ? `${format('#,###.#', dataItem.GrossAmountView)} ${
                                                    dataItem.CurrencyCode
                                                }`
                                                : ''}
                                        </Text>
                                    </View>
                                </View>

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
                                                <TouchableOpacity key={index}
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
                                <View
                                    style={stylesScreenDetailV3.modalBackdrop}
                                />
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
        color: Colors.gray_8,
        marginRight: 15
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
