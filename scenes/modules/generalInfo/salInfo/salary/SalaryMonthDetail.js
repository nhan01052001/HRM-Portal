/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    styleScreenDetail,
    styleSafeAreaView,
    Colors,
    Size,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import VnrText from '../../../../../components/VnrText/VnrText';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import DrawerServices from '../../../../../utils/DrawerServices';
import HttpService from '../../../../../utils/HttpService';
import format from 'number-format.js';
import { IconMinus } from '../../../../../constants/Icons';
import moment from 'moment';
import { translate } from '../../../../../i18n/translate';
import { EnumName, ScreenName } from '../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import { connect } from 'react-redux';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import RootState from '../../../../../redux/RootState';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import VnrPickerQuickly from '../../../../../componentsV3/VnrPickerQuickly/VnrPickerQuickly';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import { IconFilePdf, IconFileExcel } from '../../../../../constants/Icons';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';

const configDefault = [
    {
        Name: 'PaymentDate',
        DisplayKey: 'HRM_PortalApp_SalMonthDetail_DatePayMent',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'PaymentMethod',
        DisplayKey: 'HRM_PortalApp_SalMonthDetail_PaymentMethod',
        DataType: 'string'
    },
    {
        Name: 'BankName',
        DisplayKey: 'HRM_PortalApp_SalMonthDetail_BankName',
        DataType: 'string'
    }
];

class SalaryMonthDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            configViewPayrollDetail: null,
            configViewAdvanceDetail: null,
            TempplateExport: {
                value: null,
                lable: 'HRM_PortalApp_ChooseTemplateExportSalary',
                disable: false,
                refresh: false,
                visible: false,
                visibleConfig: false,
                isShow: false,
                isPDF: false
            }
        };

        (this.modalTemplateExport = null),
        (this.monthPayroll =
                props.navigation.state.params && props.navigation.state.params.dataItem
                    ? moment(props.navigation.state.params.dataItem.MonthYear).format('MM/YYYY')
                    : null);

        this.monthPayroll !== null &&
            props.navigation.setParams({
                title: `${this.monthPayroll}`
            });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { dataItem } = this.state;
        const currentScreen = DrawerServices.getCurrentScreen();
        if (
            nextProps.cancelPublishPayslip != null &&
            dataItem != null &&
            dataItem != 'EmptyData' &&
            nextProps.cancelPublishPayslip.cutOffDurationID == dataItem.CutOffDurationID &&
            currentScreen == ScreenName.SalaryMonthDetail
        ) {
            this.confirmCancelPublishPayslip(nextProps.cancelPublishPayslip);
        }
    }

    confirmCancelPublishPayslip = data => {
        const { cutOffDurationName } = data,
            { reloadScreenList } = this.props.navigation.state.params,
            { setCancelPaySlip } = this.props;

        let mess = translate('HRM_PortalApp_CancelPublishPayslip_Confirm');
        if (cutOffDurationName) mess = mess.replace('E_CUTOFF_NAME', cutOffDurationName);

        ToasterSevice.showWarning(mess, 5000);

        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList();
        typeof setCancelPaySlip == 'function' && setCancelPaySlip(null);
        DrawerServices.navigate('Salary');
    };

    getDataItem = async () => {
        try {
            const _params = this.props.navigation.state.params,
                { dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params);
            const configPayrollDetail = ConfigListDetail.value['SalaryMonthPayrollDetail']
                ? ConfigListDetail.value['SalaryMonthPayrollDetail']
                : configDefault;

            const configAdvanceDetail = ConfigListDetail.value['SalaryMonthAdvanceDetail']
                ? ConfigListDetail.value['SalaryMonthAdvanceDetail']
                : configDefault;

            if (dataItem && dataItem.CutOffDurationID) {
                HttpService.Post('[URI_HR]/Sal_GetData/GetReportDetailForCutOff', {
                    CutOffDurationID: dataItem.CutOffDurationID,
                    ProfileID: dataVnrStorage.currentUser.info.ProfileID
                }).then(res => {
                    if (res && res.data && Object.keys(res.data).length > 0) {
                        this.setState({
                            dataItem: {
                                ...dataItem,
                                headerInfo: res.data['HeaderInfo'],
                                advanceDetail: res.data['AdvanceDetail'],
                                payrollDetail: {
                                    ...res.data['PayrollDetail'],
                                    elementCode: res.data['GradeCode']
                                }
                            },
                            configViewPayrollDetail: configPayrollDetail,
                            configViewAdvanceDetail: configAdvanceDetail
                        });
                    }
                });
            } else {
                this.setState({
                    dataItem: 'EmptyData',
                    configViewPayrollDetail: configPayrollDetail,
                    configViewAdvanceDetail: configAdvanceDetail
                });
            }
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    componentDidMount() {
        this.getDataItem();
    }

    initLableValue = (data, item) => {
        const { textLableInfo } = styleScreenDetail;
        let _field = item['Name'],
            _value = data[_field];

        if (_value) {
            if (item['DataType'] && item['DataType'] !== '' && item['DataType'].toLowerCase() === 'datetime') {
                let _format = item['DataFormat'];
                _value = moment(_value).format(_format);
            } else if (item['DataType'] && item['DataType'] !== '' && item['DataType'].toLowerCase() === 'double') {
                let _format = item['DataFormat'];
                _value = format(_format, _value);
            }
        } else {
            _value = '';
        }

        return (
            <View style={styles.styItemData}>
                <VnrText
                    style={[styleSheets.text, textLableInfo, styles.styboxLable, { flexShrink: 1, minWidth: 50 }]}
                    i18nKey={item['DisplayKey']}
                />

                {_value != '' ? (
                    <VnrText style={[styleSheets.text, styles.styboxValue, styles.styTextRight]} value={_value} />
                ) : (
                    <IconMinus size={Size.iconSize} color={Colors.gray_5} />
                )}
            </View>
        );
    };

    handleExportFile = (ExportId = null) => {
        try {
            const { dataItem, TempplateExport } = this.state;

            let params = {
                ExportPDF: TempplateExport.isPDF
            };

            if (dataItem?.payrollDetail?.CutOffDurationID && ExportId) {
                params = {
                    ...params,
                    ExportId: ExportId,
                    CutOffDurationID: dataItem?.payrollDetail?.CutOffDurationID
                };
            }

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Sal_GetData/New_GetPayrollTableItemByIdProfilePortal', {
                ...params
            }).then(res => {
                VnrLoadingSevices.hide();
                if (res && typeof res === 'string') {
                    const [status, url] = res.split(',');
                    if (status === EnumName.E_Success && url) {
                        if (dataVnrStorage?.apiConfig?.uriPor) {
                            let fullURL = `${dataVnrStorage?.apiConfig?.uriPor}${url}`;
                            ManageFileSevice.ReviewFile(fullURL);
                        } else {
                            ToasterSevice.showWarning('HRM_PortalApp_NoResultsFound');
                        }
                    }
                }
            });
        } catch (error) {
            VnrLoadingSevices.hide();
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    handleGetExportIDFromCutOffDurationID = isPDF => {
        try {
            const { dataItem, TempplateExport } = this.state;
            if (!dataItem?.payrollDetail?.CutOffDurationID) return;

            let params = {
                CutOffDurationID: dataItem?.payrollDetail?.CutOffDurationID
            };

            HttpService.Post('[URI_HR]/Sal_GetData/New_GetExportIDPayslipByProfile', { ...params }).then(res => {
                if (res && typeof res === 'string' || (!!res?.ExportID && res?.Message?.length === 0)) {
                    this.setState(
                        {
                            TempplateExport: {
                                ...TempplateExport,
                                value: null,
                                isShow: false,
                                refresh: !TempplateExport.refresh,
                                isPDF: isPDF
                            }
                        },
                        () => {
                            this.handleExportFile(res && typeof res === 'string' ? res : res?.ExportID);
                        }
                    );
                    return;
                }

                this.setState(
                    {
                        TempplateExport: {
                            ...TempplateExport,
                            value: null,
                            isShow: true,
                            refresh: !TempplateExport.refresh,
                            isPDF: isPDF
                        }
                    },
                    () => {
                        this.modalTemplateExport.opentModal();
                    }
                );
            });
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    render() {
        const { dataItem, configViewPayrollDetail, configViewAdvanceDetail, TempplateExport } = this.state,
            { reloadScreenList } = this.props.navigation.state.params;

        let contentViewDetail = <VnrLoading size={'large'} />,
            calPayroll = 0;

        const permissionBtnExportPDF =
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Sal_Payroll_btnExportPDF'] &&
            PermissionForAppMobile.value['New_Sal_Payroll_btnExportPDF']['View'];
        const permissionBtnExportExcel =
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Sal_Payroll_btnExportExcel'] &&
            PermissionForAppMobile.value['New_Sal_Payroll_btnExportExcel']['View'];

        if (dataItem) {
            const { headerInfo, advanceDetail, payrollDetail } = dataItem;

            const { MoneyPayrollD, MoneyPayrollBeforeD } = headerInfo ? headerInfo : {};

            if (
                MoneyPayrollD !== null &&
                MoneyPayrollD !== 0 &&
                MoneyPayrollBeforeD !== null &&
                MoneyPayrollBeforeD !== 0
            ) {
                calPayroll = ((MoneyPayrollD - MoneyPayrollBeforeD) / MoneyPayrollBeforeD) * 100;

                if (calPayroll > 0) {
                    calPayroll = `+${Vnr_Function.mathRoundNumber(calPayroll)}% ${translate(
                        'HRM_Payroll_Mesage_From_LastMonth'
                    )}`;
                } else {
                    calPayroll = `${Vnr_Function.mathRoundNumber(calPayroll)}% ${translate(
                        'HRM_Payroll_Mesage_From_LastMonth'
                    )}`;
                }
            }

            {
                /* MoneyUnusual - Luong thuong */
            }
            {
                /* MoneyAdvance - Luong ung */
            }
            contentViewDetail = (
                <View style={styleSheets.container}>
                    {headerInfo != null && (
                        <View style={styles.styViewHeader}>
                            <View
                                style={[
                                    styles.styHeaderLeft,
                                    headerInfo.MoneyUnusual === null &&
                                        headerInfo.MoneyAdvance === null &&
                                        styles.styViewTotalSalRow
                                ]}
                            >
                                <VnrText
                                    style={[styleSheets.lable, styles.styHdTotal, styles.styTextTotalSalRemain]}
                                    i18nKey={'HRM_Payroll_Sal_Total_Salary_Remain'}
                                />
                                <Text
                                    style={[styleSheets.lable, styles.styHdTotalRemain, { flexShrink: 1 }]}
                                    numberOfLines={1}
                                >
                                    {headerInfo.MoneyPayroll != null ? headerInfo.MoneyPayroll : ''}
                                </Text>
                                {/* {
                                        calPayroll !== '' && calPayroll !== 0 && (
                                            <View
                                                style={[
                                                    styles.lineSatus,
                                                    {
                                                        borderColor: borderStatusView,
                                                        backgroundColor: bgStatusView,
                                                    },
                                                ]}>
                                                <Text
                                                    numberOfLines={1}
                                                    style={[
                                                        styleSheets.text,
                                                        styles.lineSatus_text,
                                                        {
                                                            color: colorStatusView,
                                                        },
                                                    ]}>
                                                    {calPayroll != 0 ? Vnr_Function.mathRoundNumber(calPayroll) : ''}
                                                </Text>
                                            </View>
                                        )
                                    } */}
                            </View>
                            {(headerInfo.MoneyUnusual !== null || headerInfo.MoneyAdvance !== null) && (
                                <View style={styles.styHeaderRight}>
                                    {headerInfo.MoneyUnusual != null && (
                                        <View style={styles.styBox}>
                                            <View style={styles.styBoxLable}>
                                                <View style={[styles.styboxDot, { backgroundColor: Colors.green }]} />

                                                <VnrText
                                                    style={[styleSheets.lable, styles.styboxLable]}
                                                    i18nKey={'HRM_Category_ProductItem_BonusPrice'}
                                                />
                                            </View>
                                            <View style={styles.styBoxLable}>
                                                <View style={styles.styboxDot} />

                                                <Text style={[styleSheets.text, styles.styboxValue]}>
                                                    {headerInfo.MoneyUnusual == 0 ? headerInfo.MoneyUnusual : ''}
                                                </Text>
                                            </View>
                                        </View>
                                    )}

                                    {headerInfo.MoneyAdvance != null && (
                                        <View style={styles.styBox2}>
                                            <View style={styles.styBoxLable}>
                                                <View style={[styles.styboxDot, { backgroundColor: Colors.red }]} />

                                                <VnrText
                                                    style={[styleSheets.lable, styles.styboxLable]}
                                                    i18nKey={'HRM_Common_Advance_Payment_Salary'}
                                                />
                                            </View>
                                            <View style={styles.styBoxLable}>
                                                <View style={styles.styboxDot} />

                                                <Text style={[styleSheets.lable, styles.styboxValue]}>
                                                    {headerInfo.MoneyAdvance != 0 ? headerInfo.MoneyAdvance : ''}
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    )}

                    <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                        {/* Lương tháng */}
                        {payrollDetail != null && (
                            <View style={styles.styBlock}>
                                <View style={styles.styTopTitle}>
                                    <View style={styles.styWrap}>
                                        <VnrText
                                            style={[styleSheets.text, styles.styTitle]}
                                            value={`${translate('E_SALARY')} ${
                                                this.monthPayroll ? this.monthPayroll : ''
                                            }`}
                                            numberOfLines={1}
                                        />
                                    </View>

                                    <TouchableOpacity
                                        style={styles.styWrapRight}
                                        onPress={() =>
                                            DrawerServices.navigate('SalaryViewDetail', {
                                                reloadScreenList: reloadScreenList,
                                                dataItem: payrollDetail,
                                                elementCode: payrollDetail.elementCode
                                                    ? payrollDetail.elementCode
                                                    : null,
                                                screenName: ScreenName.SalaryPayrollViewDetail
                                            })
                                        }
                                    >
                                        <VnrText
                                            style={[styleSheets.text, styles.styTextDetail]}
                                            i18nKey={'HRM_Common_ViewMore'}
                                        />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.styViewData}>
                                    {/* {this.initLableValue(payrollDetail, {
                                            Name: 'MonthYear',
                                            DisplayKey: 'HRM_Sal_SalaryBusiness_CutOffDurationName',
                                            DataType: 'string',
                                            DataType: 'DateTime',
                                            DataFormat: 'MM/YYYY',
                                        })} */}
                                    {Array.isArray(configViewPayrollDetail) &&
                                        configViewPayrollDetail.map(item => {
                                            if (item?.Name === 'BankName') {
                                                if (payrollDetail.PaymentMethodEnum !== 'E_CASH')
                                                    return this.initLableValue(payrollDetail, item);
                                                else return null;
                                            }
                                            return this.initLableValue(payrollDetail, item);
                                        })}

                                    {/* {isShowPaymentDatePayroll && this.initLableValue(payrollDetail, {
                                            Name: 'PaymentDate',
                                            DisplayKey: 'DatePayMent',
                                            DataType: 'DateTime',
                                            DataFormat: 'DD/MM/YYYY',
                                        })}

                                        {this.initLableValue(payrollDetail, {
                                            Name: 'PaymentMethod',
                                            DisplayKey: 'PaymentMethod',
                                            DataType: 'string',
                                        })}

                                        {payrollDetail && payrollDetail.PaymentMethodEnum !== 'E_CASH'
                                            && this.initLableValue(payrollDetail, {
                                                Name: 'BankName',
                                                DisplayKey: 'BankName',
                                                DataType: 'string',
                                            })
                                        } */}

                                    {/* {headerInfo !== null && this.initLableValue(headerInfo, {
                                            Name: 'MoneyPayroll',
                                            DisplayKey: 'HRM_Fin_PurchaseRequest_PaidAmount',
                                            DataType: 'string',
                                        })} */}
                                </View>
                            </View>
                        )}

                        {/* lương tạm ứng */}
                        {advanceDetail != null && (
                            <View style={styles.styBlock}>
                                <View style={styles.styTopTitle}>
                                    <View style={styles.styWrap}>
                                        <VnrText
                                            style={[styleSheets.text, styles.styTitle]}
                                            value={`${translate('HRM_Payroll_Sal_MonthYear_Temp_Info')} ${
                                                this.monthPayroll ? this.monthPayroll : ''
                                            }`}
                                            numberOfLines={1}
                                        />
                                    </View>

                                    <TouchableOpacity
                                        style={styles.styWrapRight}
                                        onPress={() =>
                                            DrawerServices.navigate('SalaryViewDetail', {
                                                dataItem: advanceDetail,
                                                screenName: ScreenName.SalaryTempViewDetail
                                            })
                                        }
                                    >
                                        <VnrText
                                            style={[styleSheets.text, styles.styTextDetail]}
                                            i18nKey={'HRM_Common_ViewMore'}
                                        />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.styViewData}>
                                    {/* {this.initLableValue(advanceDetail, {
                                            Name: 'MonthYear',
                                            DisplayKey: 'HRM_Sal_SalaryBusiness_CutOffDurationName',
                                            DataType: 'string',
                                            DataType: 'DateTime',
                                            DataFormat: 'MM/YYYY',
                                        })} */}
                                    {Array.isArray(configViewAdvanceDetail) &&
                                        configViewAdvanceDetail.map(item => {
                                            if (item?.Name === 'BankName') {
                                                if (advanceDetail.PaymentMethodEnum !== 'E_CASH')
                                                    return this.initLableValue(advanceDetail, item);
                                                else return null;
                                            }
                                            return this.initLableValue(advanceDetail, item);
                                        })}
                                    {/* {isShowPaymentDateAdvance && this.initLableValue(advanceDetail, {
                                            Name: 'PaymentDate',
                                            DisplayKey: 'DatePayMent',
                                            DataType: 'DateTime',
                                            DataFormat: 'DD/MM/YYYY',
                                        })}

                                        {this.initLableValue(advanceDetail, {
                                            Name: 'PaymentMethod',
                                            DisplayKey: 'PaymentMethod',
                                            DataType: 'string',
                                        })}

                                        {advanceDetail && advanceDetail.PaymentMethodEnum !== 'E_CASH'
                                            && this.initLableValue(advanceDetail, {
                                                Name: 'BankName',
                                                DisplayKey: 'BankName',
                                                DataType: 'string',
                                            })
                                        } */}

                                    {/* {headerInfo !== null && this.initLableValue(headerInfo, {
                                            Name: 'MoneyAdvance',
                                            DisplayKey: 'HRM_Fin_PurchaseRequest_PaidAmount',
                                            DataType: 'string',
                                        })} */}
                                </View>
                            </View>
                        )}

                        {/* lương thưởng */}
                        {/* <View style={styles.styBlock}>
                            <View style={styles.styTopTitle}>
                                <View style={styles.styWrap}>
                                    <VnrText
                                        style={[styleSheets.text, styles.styTitle]}
                                        i18nKey={'HRM_Payroll_Sal_MonthYear_Bonus_Info'}
                                        numberOfLines={1}
                                    />
                                </View>

                                <TouchableOpacity
                                    style={styles.styWrapRight}
                                    onPress={() =>
                                        DrawerServices.navigate('SalaryViewDetail', {
                                            dataItem: advanceDetail,
                                            screenName: ScreenName.SalaryBonusViewDetail
                                        })
                                    }>
                                    <VnrText
                                        style={[styleSheets.text, styles.styTextDetail]}
                                        i18nKey={'HRM_Common_ViewMore'}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.styViewData}>
                                {this.initLableValue(advanceDetail.listValue, {
                                    Name: 'LCB',
                                    DisplayKey: 'HRM_Sal_SalaryBusiness_CutOffDurationName',
                                    DataType: 'string',
                                })}

                                {this.initLableValue(advanceDetail.listValue, {
                                    Name: 'BdasdasB',
                                    DisplayKey: 'DatePayMent',
                                    DataType: 'DateTime',
                                    DataFormat: 'DD/MM/YYYY',
                                })}

                                {this.initLableValue(advanceDetail.listValue, {
                                    Name: 'JobTitleName',
                                    DisplayKey: 'PaymentMethod',
                                    DataType: 'string',
                                })}

                                {this.initLableValue(advanceDetail.listValue, {
                                    Name: 'PositionName',
                                    DisplayKey: 'BankName',
                                    DataType: 'string',
                                })}

                            </View>
                        </View> */}
                    </ScrollView>

                    {(permissionBtnExportPDF || permissionBtnExportExcel) && (
                        <View
                            style={[
                                styles.wrapBtnExport,
                                (!permissionBtnExportPDF || !permissionBtnExportExcel) &&
                                    CustomStyleSheet.justifyContent('center')
                            ]}
                        >
                            {permissionBtnExportExcel && (
                                <TouchableOpacity
                                    style={[styles.btnExport, styles.styViewExportBtn]}
                                    onPress={() => {
                                        this.handleGetExportIDFromCutOffDurationID(false);
                                    }}
                                >
                                    <IconFileExcel size={20} color={Colors.white} />
                                    <Text style={[styleSheets.lable, styles.styTextExportExcel]}>
                                        {translate('HRM_PortalApp_ExportExcel')}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            {permissionBtnExportPDF && (
                                <TouchableOpacity
                                    style={[styles.btnExport, styles.styViewBtnExport]}
                                    onPress={() => {
                                        this.setState(
                                            {
                                                TempplateExport: {
                                                    ...TempplateExport,
                                                    value: null,
                                                    isShow: true,
                                                    refresh: !TempplateExport.refresh,
                                                    isPDF: true
                                                }
                                            },
                                            () => {
                                                this.handleGetExportIDFromCutOffDurationID(true);
                                            }
                                        );
                                    }}
                                >
                                    <IconFilePdf size={20} color={Colors.white} />
                                    <Text style={[styleSheets.lable, styles.styViewExportPDF]}>
                                        {translate('HRM_PortalApp_ExportPDF')}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
            );
        } else if (dataItem == 'EmptyData') {
            contentViewDetail = <EmptyData messageEmptyData={'EmptyData'} />;
        }

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container]}>
                    {contentViewDetail}
                    <View style={styles.styViewTempExport}>
                        {TempplateExport.isShow ? (
                            <VnrPickerQuickly
                                ref={ref => (this.modalTemplateExport = ref)}
                                refresh={TempplateExport.refresh}
                                api={{
                                    urlApi: '[URI_HR]/Cat_GetData/GetScreenName?screenName=Personal/Paysips',
                                    type: 'E_GET'
                                }}
                                value={TempplateExport.value}
                                textField="ExportName"
                                valueField="ID"
                                filter={true}
                                filterServer={false}
                                disable={TempplateExport.disable}
                                titlePicker={TempplateExport.lable}
                                autoShowModal={true}
                                onFinish={item => {
                                    this.setState(
                                        {
                                            TempplateExport: {
                                                ...TempplateExport,
                                                value: item,
                                                refresh: !TempplateExport.refresh,
                                                isShow: false
                                            }
                                        },
                                        () => {
                                            this.handleExportFile(item?.ID);
                                        }
                                    );
                                }}
                            />
                        ) : null}
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    styTextTotalSalRemain: { flexShrink: 1, maxWidth: 160 + Size.defineSpace * 2 },
    styViewTotalSalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 0,
        justifyContent: 'space-between'
    },
    styViewBtnExport: { backgroundColor: Colors.volcano, marginLeft: 6 },
    styTextExportExcel: { marginLeft: 4, color: Colors.white },
    styViewExportPDF: { marginLeft: 4, color: Colors.white },
    styViewTempExport: { position: 'absolute' },
    styViewExportBtn: { backgroundColor: Colors.success, marginRight: 6 },
    styViewHeader: {
        flexDirection: 'row',
        width: Size.deviceWidth - Size.defineSpace * 2,
        marginHorizontal: Size.defineSpace,
        paddingVertical: Size.defineSpace,
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    styHeaderLeft: {
        alignItems: 'flex-start',
        marginRight: Size.defineHalfSpace,
        flex: 6
    },
    styBox2: {
        marginTop: 7
    },
    styHeaderRight: {
        flex: 4,
        alignItems: 'flex-start'
    },
    styHdTotal: {
        fontSize: Size.text + 1,
        color: Colors.gray_7,
        textTransform: 'uppercase'
    },
    styHdTotalRemain: {
        fontSize: Size.textlarge + 4,
        fontWeight: '700',
        color: Colors.black
    },
    styBoxLable: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    styboxDot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        marginRight: 7,
        marginBottom: 5
    },
    styboxLable: {
        fontSize: Size.text,
        fontWeight: Platform.OS == 'android' ? '600' : '400',
        color: Colors.gray_10
    },
    styboxValue: {
        fontSize: Size.text,
        fontWeight: Platform.OS == 'android' ? '600' : '400',
        color: Colors.black
    },
    styBox: {
        justifyContent: 'flex-end'
    },
    styBlock: {
        width: Size.deviceWidth - Size.defineSpace * 2,
        // width: '100%',
        paddingTop: Size.defineSpace,
        paddingBottom: Size.defineHalfSpace,
        marginHorizontal: Size.defineSpace,
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5
    },
    styTopTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    styWrap: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginRight: Size.defineSpace,
        alignItems: 'center'
    },
    styWrapRight: {
        alignItems: 'flex-end'
    },
    styTitle: {
        fontSize: Size.text + 4,
        fontWeight: 'bold'
    },
    styTextDetail: {
        fontWeight: '500',
        color: Colors.primary
    },
    styViewData: {
        width: '100%',
        // flexDirection: 'row',
        // flexWrap: 'wrap',
        marginTop: Size.defineSpace
        // paddingRight: Size.defineSpace / 2,
        // alignItems: 'flex-start',
    },
    styItemData: {
        width: '100%',
        marginBottom: Size.defineSpace,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    styTextRight: {
        textAlign: 'right',
        fontWeight: Platform.OS == 'android' ? '600' : '400'
    },

    btnExport: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        paddingVertical: 12,
        borderRadius: 4
    },

    wrapBtnExport: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 6
    }
});

const mapStateToProps = state => {
    return {
        cancelPublishPayslip: state.RootState.cancelPublishPayslip
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setCancelPaySlip: data => {
            dispatch(RootState.actions.setCancelPaySlip(data));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SalaryMonthDetail);
