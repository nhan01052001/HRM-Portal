import React, { Component } from 'react';
import { TouchableOpacity, View, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import BankAccountList from '../bankAccountList/BankAccountList';
import { styleSheets, styleSafeAreaView, Colors, Size, CustomStyleSheet } from '../../../../../../constants/styleConfig';
import { ConfigList } from '../../../../../../assets/configProject/ConfigList';
import { PermissionForAppMobile } from '../../../../../../assets/configProject/PermissionForAppMobile';
import { ScreenName, EnumName, EnumTask } from '../../../../../../assets/constant';
import {
    BankAccountConfirmedBusinessFunction,
    generateRowActionAndSelected
} from './BankAccountConfirmedBusinessFunction';
import { connect } from 'react-redux';
import { startTask } from '../../../../../../factories/BackGroundTask';
import { IconCancel } from '../../../../../../constants/Icons';
import { VnrBtnCreate } from '../../../../../../componentsV3/VnrBtnCreate/VnrBtnCreate';
import Modal from 'react-native-modal';
import VnrText from '../../../../../../components/VnrText/VnrText';
import HttpService from '../../../../../../utils/HttpService';
import { ToasterSevice } from '../../../../../../components/Toaster/Toaster';
import { translate } from '../../../../../../i18n/translate';

let enumName = null,
    bankAccountConfirmed = null,
    bankAccountConfirmedViewDetail = null,
    bankAccountConfirmedTask = null,
    pageSizeList = 20;

class BankAccountConfirmed extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataBody: null,
            rowActions: [],
            selected: [],
            isRefreshList: false,
            isLazyLoading: false,
            keyQuery: null,
            dataChange: false, //biến check dữ liệu có thay đổi hay không
            isVisibleCreate: false,
            totalBank: 1,
            totalWallet: -1,
            totalCurentWallet: 0
        };

        this.storeParamsDefault = null;

        //biến lưu lại object filter
        this.paramsFilter = null;

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            // Trường hợp goBack từ detail thì phải gán lại this
            BankAccountConfirmedBusinessFunction.setThisForBusiness(this);
            if (BankAccountConfirmedBusinessFunction.checkForLoadEditDelete[ScreenName.BankAccountConfirmed]) {
                this.reload();
            }
        });
    }

    componentDidMount() {
        this.getMaximumAccountNumber();
        this.handleComponentMount();
    }

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
    }

    reload = paramsFilter => {
        if (paramsFilter === 'E_KEEP_FILTER') {
            paramsFilter = { ...this.paramsFilter };
        } else {
            this.paramsFilter = { ...paramsFilter };
        }


        let _paramsDefault = this.storeParamsDefault ? this.storeParamsDefault : this.paramsDefault(),
            _keyQuery = EnumName.E_FILTER;

        _paramsDefault = {
            ..._paramsDefault,
            keyQuery: _keyQuery,
            isRefreshList: !this.state.isRefreshList, // reload lại ds.
            dataBody: {
                ..._paramsDefault.dataBody,
                ...paramsFilter
            }
        };

        // set false when reloaded
        BankAccountConfirmedBusinessFunction.checkForLoadEditDelete[ScreenName.BankAccountConfirmed] = false;

        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: bankAccountConfirmedTask,
                payload: {
                    ...dataBody,
                    keyQuery: keyQuery,
                    isCompare: false,
                    reload: this.reload
                }
            });
        });
    };

    checkDataFormNotify = () => {
        const { params = {} } = this.props.navigation.state,
            { NotificationID } = typeof params == 'object' ? params : JSON.parse(params);
        return NotificationID ? NotificationID : null;
    };

    paramsDefault = () => {
        if (!bankAccountConfirmed) {
            bankAccountConfirmed = ScreenName.BankAccountConfirmed;
        }

        const dataRowActionAndSelected = generateRowActionAndSelected(bankAccountConfirmed);
        let _params = {
            // IsPortal: true,
            // sort: orderBy,
            // pageSize: pageSizeList,
            // NotificationID: this.checkDataFormNotify()
        };

        return {
            rowActions: dataRowActionAndSelected.rowActions,
            selected: dataRowActionAndSelected.selected,
            // renderRow: renderRow,
            dataBody: _params,
            keyQuery: EnumName.E_PRIMARY_DATA
        };
    };

    pullToRefresh = () => {
        const { dataBody, keyQuery } = this.state;
        this.setState(
            {
                keyQuery: keyQuery == EnumName.E_FILTER ? keyQuery : EnumName.E_PRIMARY_DATA
            },
            () => {
                startTask({
                    keyTask: bankAccountConfirmedTask,
                    payload: {
                        ...dataBody,
                        keyQuery: keyQuery == EnumName.E_FILTER ? keyQuery : EnumName.E_PRIMARY_DATA,
                        isCompare: false,
                        reload: this.reload
                    }
                });
            }
        );
    };

    pagingRequest = (page, pageSize) => {
        const { dataBody } = this.state;
        this.setState(
            {
                keyQuery: EnumName.E_PAGING
            },
            () => {
                startTask({
                    keyTask: bankAccountConfirmedTask,
                    payload: {
                        ...dataBody,
                        page: page,
                        pageSize: pageSize,
                        keyQuery: EnumName.E_PAGING,
                        isCompare: false,
                        reload: this.reload
                    }
                });
            }
        );
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;
        if (nextProps.reloadScreenName == bankAccountConfirmedTask) {
            //khi màn hình đang reload thì messsage phải là filter thì màn hình mới reload
            if (keyQuery === EnumName.E_FILTER && nextProps.message && keyQuery == nextProps.message.keyQuery) {
                this.setState({
                    isLazyLoading: !this.state.isLazyLoading,
                    dataChange: nextProps.message.dataChange
                });
            } else if (nextProps.message && keyQuery == nextProps.message.keyQuery) {
                // trường hợp không filter
                this.setState({
                    isLazyLoading: !this.state.isLazyLoading,
                    dataChange: nextProps.message.dataChange
                });
            }
        }
    }

    handleComponentMount() {
        if (!ConfigList.value[ScreenName.BankAccountConfirmed]) {
            PermissionForAppMobile.value['BankAccount_Info_Index_BankAccount_InfoGird_btnCreate'] = {
                View: true
            };

            PermissionForAppMobile.value['BankAccount_Info_Index_BankAccount_InfoGird_btnEdit'] = {
                View: true
            };

            PermissionForAppMobile.value['BankAccount_Info_Index_BankAccount_InfoGird'] = {
                View: true
            };

            ConfigList.value[ScreenName.BankAccountConfirmed] = {
                Api: {
                    urlApi: '[URI_HR]/Att_GetData/GetSalSalaryInformation',
                    type: 'POST',
                    pageSize: 20
                },
                Row: [],
                Order: [
                    {
                        field: 'DateUpdate',
                        dir: 'desc'
                    }
                ],
                BusinessAction: [
                    {
                        Type: 'E_MODIFY',
                        Resource: {
                            Name: 'BankAccount_Info_Index_BankAccount_InfoGird_btnEdit',
                            Rule: 'View'
                        },
                        Confirm: {
                            isInputText: false,
                            isValidInputText: false
                        }
                    }
                ]
            };
        }

        //set by config
        enumName = EnumName;

        bankAccountConfirmed = ScreenName.BankAccountConfirmed;
        bankAccountConfirmedViewDetail = ScreenName.BankAccountConfirmedViewDetail;
        bankAccountConfirmedTask = EnumTask.KT_BankAccountConfirmed;

        BankAccountConfirmedBusinessFunction.setThisForBusiness(this);
        BankAccountConfirmedBusinessFunction.checkForLoadEditDelete[ScreenName.BankAccountConfirmed] = false;
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: bankAccountConfirmedTask,
            payload: {
                ..._paramsDefault.dataBody,
                pageSize: pageSizeList,
                keyQuery: EnumName.E_PRIMARY_DATA,
                isCompare: true,
                reload: this.reload
            }
        });
    }

    showHideBtnCreate = bool => {
        this.setState({ isVisibleCreate: bool });
    };

    getMaximumAccountNumber() {
        HttpService.Get('[URI_HR]/Sal_GetData/GetConfigMaximumAccountNumber')
            .then(res => {
                let nextState = {};
                if (res !== null && res.MaximumBankAccountNumber) {
                    nextState = {
                        ...nextState,
                        totalBank: res.MaximumBankAccountNumber
                    };
                } else if (res === null) {
                    nextState = {
                        ...nextState,
                        totalBank: 13
                    };
                }

                if (res !== null && res.MaximumEWalletNumber) {
                    nextState = {
                        ...nextState,
                        totalWallet: res.MaximumEWalletNumber
                    };
                } else if (res === null) {
                    nextState = {
                        ...nextState,
                        totalWallet: -1
                    };
                }

                this.setState(nextState);
            })
            .catch(() => {
                //
            });
    }

    updateCurentWallet = number => {
        this.setState({
            totalCurentWallet: number ? number : 0
        });
    };

    render() {
        const {
            dataBody,
            rowActions,
            selected,
            isLazyLoading,
            isRefreshList,
            keyQuery,
            dataChange,
            isVisibleCreate,
            totalBank,
            totalWallet,
            totalCurentWallet
        } = this.state;

        let isShowCreateWallet = false,
            messageWarm = null,
            isBlockCreateWallet = true,
            isShowCreateBank = false;

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['BankAccount_Info_Index_Wallet_btnCreate'] &&
            PermissionForAppMobile.value['BankAccount_Info_Index_Wallet_btnCreate']['View']
        ) {
            isShowCreateWallet = true;
        }

        if (totalWallet == -1 || (totalWallet != -1 && totalWallet > -1 && totalCurentWallet < totalWallet)) {
            isBlockCreateWallet = false;
        }

        if (isBlockCreateWallet) {
            let trans = translate('HRM_PortalApp_BankAccuntWallet_Total_Message');
            messageWarm = trans.replace('[E_TOTAL]', totalWallet);
        }

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['BankAccount_Info_Index_BankAccount_InfoGird_btnCreate'] &&
            PermissionForAppMobile.value['BankAccount_Info_Index_BankAccount_InfoGird_btnCreate']['View']
        ) {
            isShowCreateBank = true;
        }

        return (
            <SafeAreaView {...styleSafeAreaView}>
                {bankAccountConfirmed && bankAccountConfirmedViewDetail && enumName && (
                    <View style={[styleSheets.container]}>
                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <BankAccountList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: bankAccountConfirmedViewDetail,
                                        screenName: bankAccountConfirmed,
                                        screenNameWallet: ScreenName.BankWalletConfirmedViewDetail
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={bankAccountConfirmedTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    updateCurentWallet={this.updateCurentWallet}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    api={{
                                        urlApi: '[URI_HR]/Att_GetData/GetSalSalaryInformation',
                                        type: enumName.E_POST,
                                        dataBody: dataBody,
                                        pageSize: 20
                                    }}
                                    valueField="ID"
                                    renderConfig={null}
                                />
                            )}
                            {/* {
                                (PermissionForAppMobile && PermissionForAppMobile.value['BankAccount_Info_Index_BankAccount_InfoGird_btnCreateMultiAccount']
                                    && PermissionForAppMobile.value['BankAccount_Info_Index_BankAccount_InfoGird_btnCreateMultiAccount']['View'])
                                    ? (
                                        <VnrBtnCreate onAction={() => {
                                            this.props.navigation.navigate('BankAccountMultiAddOrEdit', {
                                                isMultipleAccounts: true
                                            })
                                        }} />
                                    ) : (PermissionForAppMobile && PermissionForAppMobile.value['BankAccount_Info_Index_BankAccount_InfoGird_btnCreate']
                                        && PermissionForAppMobile.value['BankAccount_Info_Index_BankAccount_InfoGird_btnCreate']['View']
                                    ) ? (
                                        <VnrBtnCreate onAction={() => {
                                            this.props.navigation.navigate('BankAccountAddOrEdit', {
                                                numberAccount: 1,
                                                isMultipleAccounts: false
                                            })
                                        }} />
                                    )
                                        : null
                            } */}

                            {!isVisibleCreate && (isShowCreateWallet || isShowCreateBank) && (
                                <VnrBtnCreate onAction={() => this.showHideBtnCreate(true)} />
                            )}

                            {isVisibleCreate && (
                                <Modal visible={true} style={CustomStyleSheet.margin(0)}>
                                    <View style={styles.styViewCreate}>
                                        <View style={styles.styViewBtnCreate}>
                                            {isShowCreateBank && (
                                                <TouchableOpacity
                                                    style={styles.styBtnCreate}
                                                    onPress={() => {
                                                        this.showHideBtnCreate(false);
                                                        if (totalBank && totalBank > 1) {
                                                            this.props.navigation.navigate(
                                                                'BankAccountMultiAddOrEdit',
                                                                {
                                                                    isMultipleAccounts: true
                                                                }
                                                            );
                                                        } else {
                                                            this.props.navigation.navigate('BankAccountAddOrEdit', {
                                                                numberAccount: 1,
                                                                isMultipleAccounts: false
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <VnrText
                                                        style={[styleSheets.text, styles.styBtnCreatetext]}
                                                        i18nKey={'HRM_PortalApp_BankAccunt_Info'}
                                                    />
                                                    <View style={styles.styBtnCreateRight}>
                                                        <Image
                                                            source={require('../../../../../../assets/images/bank-building.png')}
                                                            style={styles.styBtnCreateIcon}
                                                        />
                                                    </View>
                                                </TouchableOpacity>
                                            )}

                                            {isShowCreateWallet && (
                                                <TouchableOpacity
                                                    style={styles.styBtnCreate}
                                                    onPress={() => {
                                                        if (isBlockCreateWallet) {
                                                            this.showHideBtnCreate(false);
                                                            ToasterSevice.showWarning(messageWarm);
                                                        } else {
                                                            this.showHideBtnCreate(false);
                                                            this.props.navigation.navigate('BankWalletAddOrEdit');
                                                        }
                                                    }}
                                                >
                                                    <VnrText
                                                        style={[styleSheets.text, styles.styBtnCreatetext]}
                                                        i18nKey={'Sal_E_Wallet'}
                                                    />
                                                    <View style={styles.styBtnCreateRight}>
                                                        <Image
                                                            source={require('../../../../../../assets/images/walletBank.png')}
                                                            style={styles.styBtnCreateIcon}
                                                        />
                                                    </View>
                                                </TouchableOpacity>
                                            )}

                                            <TouchableOpacity
                                                style={styles.styBtnCreate}
                                                onPress={() => this.showHideBtnCreate(false)}
                                            >
                                                <View style={styles.styBtnCreateIconWhite}>
                                                    <IconCancel size={Size.iconSize} color={Colors.black} />
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </Modal>
                            )}
                        </View>
                    </View>
                )}
            </SafeAreaView>
        );
    }
}

const HIGHT_BTN = Size.deviceWidth >= 1024 ? 60 : Size.deviceWidth * 0.15;
const styles = StyleSheet.create({
    styViewCreate: {
        top: 0,
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: Colors.black_transparent_7
    },
    styViewBtnCreate: {
        position: 'absolute',
        bottom: Size.defineSpace * 3,
        right: Size.defineSpace,
        alignItems: 'flex-end'
    },
    styBtnCreate: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Size.defineSpace
    },
    styBtnCreatetext: {
        color: Colors.white
    },
    styBtnCreateRight: {
        marginLeft: Size.defineSpace
    },
    styBtnCreateIcon: {
        width: HIGHT_BTN,
        height: HIGHT_BTN,
        borderRadius: HIGHT_BTN / 2,
        resizeMode: 'cover'
    },
    styBtnCreateIconWhite: {
        width: HIGHT_BTN,
        height: HIGHT_BTN,
        borderRadius: HIGHT_BTN / 2,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
const mapStateToProps = state => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

export default connect(
    mapStateToProps,
    null
)(BankAccountConfirmed);
