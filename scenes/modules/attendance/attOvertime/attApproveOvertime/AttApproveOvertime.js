import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import AttOvertimeList from '../attOvertimeList/AttOvertimeList';
import {
    styleSheets,
    Colors,
    Size,
    styleSafeAreaView,
    styleContentFilterDesign,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import VnrFilterCommon from '../../../../../components/VnrFilter/VnrFilterCommon';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumTask } from '../../../../../assets/constant';
import { generateRowActionAndSelected, AttApproveOvertimeBusinessFunction } from './AttApproveOvertimeBusiness';
import { connect } from 'react-redux';
import { startTask } from '../../../../../factories/BackGroundTask';
import VnrText from '../../../../../components/VnrText/VnrText';
import Modal from 'react-native-modal';
import { IconColse } from '../../../../../constants/Icons';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { translate } from '../../../../../i18n/translate';

let configList = null,
    enumName = null,
    attApproveOvertime = null,
    attApproveOvertimeViewDetail = null,
    attApproveOvertimeKeyTask = null,
    pageSizeList = 20;

class AttApproveOvertime extends Component {
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
            isAll: true,
            isWaitting: false,
            isReCheck: false,
            topInfoOvertime: {
                isUpdated: false,
                month1: '',
                total1: '',
                month2: '',
                total2: '',
                month3: '',
                total3: '',
                month4: '',
                total4: '',
                totalAll: '',
                totalOvertimeRegister: '',
                totalOvertimeRegisterReCheck: ''
            },
            // refreshList: true,
            isvisibleModalRefer: false
        };

        this.storeParamsDefault = null;
        this.setCheckBoxFilter = this.setCheckBoxFilter.bind(this);
        //biến lưu lại object filter
        this.paramsFilter = null;
        // props.navigation.setParams({
        //     headerRight: (
        //         <View style={{ flexDirection: 'row' }}>
        //             <TouchableOpacity
        //                 onPress={() => this.showDataRefer()}
        //                 style={{ flex: 1 }}>
        //                 <View style={stylesListPickerControl.headerButtonStyle}>
        //                     <IconCreditCard
        //                         size={Size.iconSizeHeader}
        //                         color={Colors.gray_10}
        //                     />
        //                 </View>
        //             </TouchableOpacity>
        //         </View>
        //     ),
        // });
    }

    checkDataFormNotify = () => {
        const { params = {} } = this.props.navigation.state,
            { NotificationID } = typeof params == 'object' ? params : JSON.parse(params);
        return NotificationID ? NotificationID : null;
    };

    reload = paramsFilter => {
        if (paramsFilter === 'E_KEEP_FILTER') {
            paramsFilter = { ...this.paramsFilter };
        } else {
            this.paramsFilter = { ...paramsFilter };
        }

        let _paramsDefault = this.storeParamsDefault,
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
        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            this.getTotalOvertimeApprovePreMobile();
            startTask({
                keyTask: attApproveOvertimeKeyTask,
                payload: {
                    ...dataBody,
                    keyQuery: keyQuery,
                    isCompare: false,
                    reload: this.reload
                }
            });
        });
    };

    paramsDefault = () => {
        const _configList = configList[attApproveOvertime],
            renderRow = _configList[enumName.E_Row],
            orderBy = _configList[enumName.E_Order],
            { isWaitting, isReCheck } = this.state;

        const dataRowActionAndSelected = generateRowActionAndSelected();
        let _params = {
            IsPortal: true,
            IsReCheck: isReCheck,
            IsWaitting: isWaitting,
            //IsAll: isAll,
            sort: orderBy,
            NotificationID: this.checkDataFormNotify()
        };

        return {
            rowActions: dataRowActionAndSelected.rowActions,
            selected: dataRowActionAndSelected.selected,
            renderRow: renderRow,
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
                    keyTask: attApproveOvertimeKeyTask,
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
                    keyTask: attApproveOvertimeKeyTask,
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
        if (nextProps.reloadScreenName == attApproveOvertimeKeyTask) {
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

    setCheckBoxFilter = value => () => {
        switch (value) {
            case 'E_ALL': {
                this.setState(
                    {
                        isAll: !this.state.isAll,
                        isWaitting: false,
                        isReCheck: false
                        // refreshList: true,
                    },
                    () =>
                        this.reload({
                            //IsAll: this.state.isAll,
                            IsWaitting: false,
                            IsReCheck: false
                        })
                );
                break;
            }
            case 'E_REVIEW': {
                this.setState(
                    {
                        //isAll: false,
                        isReCheck: !this.state.isReCheck
                        // refreshList: true,
                    },
                    () =>
                        this.reload({
                            IsReCheck: this.state.isReCheck,
                            //IsAll: this.state.isAll,
                            IsWaitting: this.state.isWaitting
                        })
                );
                break;
            }
            case 'E_WAITING': {
                this.setState(
                    {
                        //isAll: false,
                        isWaitting: !this.state.isWaitting
                        // refreshList: true,
                    },
                    () =>
                        this.reload({
                            IsReCheck: this.state.isReCheck,
                            //IsAll: this.state.isAll,
                            IsWaitting: this.state.isWaitting
                        })
                );
                break;
            }
        }
    };

    getDataSource = data => {
        if (data && data[0]) {
            const { TotalOvertimeRegisterReCheck, TotalOvertimeRegister } = data[0],
                { topInfoOvertime } = this.state;
            this.setState({
                topInfoOvertime: {
                    ...topInfoOvertime,
                    totalOvertimeRegisterReCheck: TotalOvertimeRegisterReCheck,
                    totalOvertimeRegister: TotalOvertimeRegister
                },
                refreshList: false
            });
        }
    };

    showDataRefer = () => {
        this.setState({ isvisibleModalRefer: true, refreshList: false });
    };

    hideModalRefer = () => {
        this.setState({ isvisibleModalRefer: false, refreshList: false });
    };

    renderTopInfoOvertime = () => {
        const { topInfoOvertime } = this.state,
            {
                month1,
                total1,
                month2,
                total2,
                month3,
                total3,
                month4,
                total4,
                totalAll,
                totalOvertimeRegister, //chờ phê duyệt
                totalOvertimeRegisterReCheck //kiểm tra lại
            } = topInfoOvertime;
        const {
            listViewMonth,
            viewOption,
            option,
            option_number,
            txtStyleNumberOld,
            lebleTxtHour,
            txtStyleNumberCurrent,
            txtColorWarning,
            txtColorSeconary
        } = styles;

        return (
            <View style={listViewMonth}>
                {/* <View style={viewOption}>
                    <View style={option}>
                        <Text style={[styleSheets.text, txtStyleHour]}>
                            {`${translate('E_MONTH')}`}
                        </Text>
                    </View>
                    <View style={option_number}>
                        <Text style={[styleSheets.text, txtStyleHour]}>
                            {`${translate('E_HOUR')}`}
                        </Text>
                    </View>
                </View> */}
                <View style={viewOption}>
                    <View style={option}>
                        <Text style={[styleSheets.text, lebleTxtHour]}>{month1 ? month1 : ''}</Text>
                    </View>
                    <View style={option_number}>
                        <Text style={[styleSheets.text, txtStyleNumberOld]}>{`${Vnr_Function.mathRoundNumber(
                            total1
                        )} (${translate('Hour_Lowercase')})`}</Text>
                    </View>
                </View>
                <View style={viewOption}>
                    <View style={option}>
                        <Text style={[styleSheets.text, lebleTxtHour]}>{month2 ? month2 : ''}</Text>
                    </View>
                    <View style={option_number}>
                        <Text style={[styleSheets.text, txtStyleNumberOld]}>{`${Vnr_Function.mathRoundNumber(
                            total2
                        )} (${translate('Hour_Lowercase')})`}</Text>
                    </View>
                </View>
                <View style={viewOption}>
                    <View style={option}>
                        <Text style={[styleSheets.text, lebleTxtHour]}>{month3 ? month3 : ''}</Text>
                    </View>
                    <View style={option_number}>
                        <Text style={[styleSheets.text, txtStyleNumberOld]}>{`${Vnr_Function.mathRoundNumber(
                            total3
                        )} (${translate('Hour_Lowercase')})`}</Text>
                    </View>
                </View>
                <View style={[viewOption, CustomStyleSheet.borderBottomWidth(0)]}>
                    <View style={option}>
                        <Text style={[styleSheets.text, lebleTxtHour]}>{month4 ? month4 : ''}</Text>
                    </View>
                    <View style={option_number}>
                        <Text style={[styleSheets.text, txtStyleNumberCurrent]}>{`${Vnr_Function.mathRoundNumber(
                            total4
                        )} (${translate('Hour_Lowercase')})`}</Text>
                    </View>
                </View>
                <View style={styles.titleDataRefer}>
                    <VnrText style={styleSheets.lable} i18nKey={'HRM_Sys_ConfigGeneral_TabStatistic'} />
                </View>
                <View style={viewOption}>
                    <View style={option}>
                        <VnrText style={[styleSheets.text, styles.lebleDataRefer]} i18nKey={'HRM_System_AllSetting'} />
                    </View>
                    <View style={option_number}>
                        <Text style={[styleSheets.text]}>
                            {`${Vnr_Function.mathRoundNumber(totalAll)} ${translate('Hour_Lowercase')}`}
                        </Text>
                    </View>
                </View>
                <View style={[viewOption]}>
                    <View style={option}>
                        <VnrText
                            style={[styleSheets.text, styles.lebleDataRefer, txtColorSeconary]}
                            i18nKey={'ContractSearchStatus__E_WAITING'}
                        />
                    </View>
                    <View style={option_number}>
                        <Text style={[styleSheets.text, txtColorSeconary]}>
                            {`${Vnr_Function.mathRoundNumber(totalOvertimeRegister)} ${translate('Hour_Lowercase')}`}
                        </Text>
                    </View>
                </View>
                <View style={[viewOption, CustomStyleSheet.borderBottomWidth(0)]}>
                    <View style={option}>
                        <VnrText
                            style={[styleSheets.text, styles.lebleDataRefer, txtColorWarning]}
                            i18nKey={'ContractSearchStatus__Review'}
                        />
                    </View>
                    <View style={option_number}>
                        <Text style={[styleSheets.text, txtColorWarning]}>
                            {`${Vnr_Function.mathRoundNumber(totalOvertimeRegisterReCheck)} ${translate(
                                'Hour_Lowercase'
                            )}`}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    getTotalOvertimeApprovePreMobile = () => {
        //VnrLoadingSevices.show();
        // HttpService.Post(
        //     '[URI_HR]/Att_GetData/GetTotalOvertimeApprovePreMobile',
        // ).then(res => {
        //     //VnrLoadingSevices.hide();
        //     if (res) {
        //         const { topInfoOvertime } = this.state;
        //         this.setState({
        //             refreshList: false,
        //             topInfoOvertime: {
        //                 ...topInfoOvertime,
        //                 totalAll: res.Total,
        //                 total1: res.TotalOvertimeRegisterReMonth1,
        //                 month1: res.Title1,
        //                 total2: res.TotalOvertimeRegisterReMonth2,
        //                 month2: res.Title2,
        //                 total3: res.TotalOvertimeRegisterReMonth3,
        //                 month3: res.Title3,
        //                 total4: res.TotalOvertimeRegisterReMonth4,
        //                 month4: res.Title4,
        //             },
        //         });
        //     }
        // });
    };

    componentDidMount() {
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        attApproveOvertime = ScreenName.AttApproveOvertime;
        attApproveOvertimeViewDetail = ScreenName.AttApproveOvertimeViewDetail;
        attApproveOvertimeKeyTask = EnumTask.KT_AttApproveOvertime;
        AttApproveOvertimeBusinessFunction.setThisForBusiness(this);
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault, () => {
            this.getTotalOvertimeApprovePreMobile();
        });

        startTask({
            keyTask: attApproveOvertimeKeyTask,
            payload: {
                ..._paramsDefault.dataBody,
                pageSize: pageSizeList,
                keyQuery: EnumName.E_PRIMARY_DATA,
                isCompare: true,
                reload: this.reload
            }
        });
    }

    render() {
        const {
            dataBody,
            renderRow,
            rowActions,
            selected,
            isLazyLoading,
            isRefreshList,
            keyQuery,
            dataChange,
            isvisibleModalRefer
        } = this.state;

        // let _dataBody = {
        //     ...dataBody,
        //     IsReCheck: isReCheck,
        //     IsWaitting: isWaitting,
        //     IsAll: isAll,
        // };

        return (
            <SafeAreaView {...styleSafeAreaView}>
                {attApproveOvertime && attApproveOvertimeViewDetail && enumName && (
                    <View style={[styles.container]}>
                        {/* <View style={styles.viewCheckBox}>
                            <TouchableOpacity
                                style={styles.styleCheckBox}
                                onPress={this.setCheckBoxFilter('E_WAITING')}>
                                <CheckBox
                                    checkBoxColor={Colors.grey}
                                    checkedCheckBoxColor={Colors.primary}
                                    onClick={this.setCheckBoxFilter('E_WAITING')}
                                    isChecked={isWaitting}
                                />
                                <VnrText
                                    style={[styleSheets.text, styles.txtColorSeconary]}
                                    i18nKey={'ContractSearchStatus__E_WAITING'}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.styleCheckBox}
                                onPress={this.setCheckBoxFilter('E_REVIEW')}>
                                <CheckBox
                                    checkBoxColor={Colors.grey}
                                    checkedCheckBoxColor={Colors.primary}
                                    onClick={this.setCheckBoxFilter('E_REVIEW')}
                                    isChecked={isReCheck}
                                />
                                <VnrText
                                    style={[styleSheets.text, styles.txtColorWarning]}
                                    i18nKey={'ContractSearchStatus__Review'}
                                />
                            </TouchableOpacity>
                        </View> */}

                        <VnrFilterCommon
                            dataBody={dataBody}
                            style={styleContentFilterDesign}
                            screenName={attApproveOvertime}
                            onSubmitEditing={this.reload}
                        />

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <AttOvertimeList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: attApproveOvertimeViewDetail,
                                        screenName: attApproveOvertime
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    callbackDataSource={this.getDataSource}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={attApproveOvertimeKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    api={{
                                        urlApi: '[URI_HR]/Att_GetData/GetListOvertimeWaittingApproveMobile',
                                        type: enumName.E_POST,
                                        dataBody: dataBody,
                                        pageSize: 20
                                    }}
                                    valueField="ID"
                                    renderConfig={renderRow}
                                />
                            )}
                        </View>

                        <Modal
                            animationIn={'fadeIn'}
                            animationOut={'zoomOut'}
                            onBackButtonPress={() => this.hideModalRefer()}
                            isVisible={isvisibleModalRefer}
                            customBackdrop={
                                <TouchableWithoutFeedback onPress={() => this.hideModalRefer()} activeOpacity={1}>
                                    <View
                                        style={styles.coating}
                                    />
                                </TouchableWithoutFeedback>
                            }
                            style={CustomStyleSheet.margin(0)}
                        >
                            <View style={styles.viewEditModal}>
                                <View style={styles.headerCloseModal}>
                                    <TouchableOpacity onPress={() => this.hideModalRefer()} activeOpacity={1}>
                                        <IconColse color={Colors.grey} size={Size.iconSize} />
                                    </TouchableOpacity>
                                    <VnrText style={styleSheets.lable} i18nKey={'HRM_Reference_data'} />
                                    <IconColse color={Colors.white} size={Size.iconSize} />
                                </View>

                                <ScrollView style={styles.renderTopInfoOvertime}>
                                    {/* <View style={styles.titleDataRefer}>
                                        <VnrText
                                            style={styleSheets.lable}
                                            i18nKey={'HRM_Reference_data'}
                                        />
                                    </View> */}

                                    {this.renderTopInfoOvertime()}
                                </ScrollView>
                            </View>
                        </Modal>
                    </View>
                )}
            </SafeAreaView>
        );
    }
}

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
)(AttApproveOvertime);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.gray_3
    },
    headerCloseModal: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: Colors.borderColor,
        borderBottomWidth: 1,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },
    viewEditModal: {
        backgroundColor: Colors.white,
        maxHeight: Size.deviceheight * 0.7,
        width: Size.deviceWidth * 0.8,
        borderRadius: 5,
        marginHorizontal: (Size.deviceWidth - Size.deviceWidth * 0.8) / 2
    },
    lebleDataRefer: {
        fontSize: Size.text,
        color: Colors.greySecondary,
        fontWeight: '500'
    },
    titleDataRefer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 12,
        borderBottomColor: Colors.borderColor,
        borderBottomWidth: 1,
        borderTopColor: Colors.borderColor,
        borderTopWidth: 1
    },
    coating: {
        flex: 1,
        backgroundColor: Colors.black,
        opacity: 0.5
    },
    renderTopInfoOvertime: { flexGrow: 5, flexDirection: 'column' }
});
