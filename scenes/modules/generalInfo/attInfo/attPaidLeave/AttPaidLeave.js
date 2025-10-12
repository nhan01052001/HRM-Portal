import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import moment from 'moment';
import VnrText from '../../../../../components/VnrText/VnrText';
import { Size, styleSheets, styleSafeAreaView, Colors, CustomStyleSheet } from '../../../../../constants/styleConfig';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import VnrYearPicker from '../../../../../components/VnrYearPicker/VnrYearPicker';
import VnrIndeterminate from '../../../../../components/VnrLoading/VnrIndeterminate';
import { translate } from '../../../../../i18n/translate';
import { connect } from 'react-redux';
import { EnumTask, EnumName, ScreenName, EnumStatus } from '../../../../../assets/constant';
import { startTask } from '../../../../../factories/BackGroundTask';
import { getDataLocal } from '../../../../../factories/LocalData';
import AttPaidLeaveItem from './AttPaidLeaveItem';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import VnrPickerQuickly from '../../../../../components/VnrPickerQuickly/VnrPickerQuickly';
import HttpService from '../../../../../utils/HttpService';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoadingScreen from '../../../../../components/VnrLoading/VnrLoadingScreen';

export const typePaidLeave = {
    E_ANNUAL_LEAVE: {
        key: 'E_ANNUAL_LEAVE',
        icon: require('../../../../../assets/images/paidLeave/AnnualRemain.png'),
        keyTras: 'HRM_Attendance_AnnualDetailView',
        primaryColor: Colors.neutralGreen,
        secondaryColor: Colors.neutralGreen_1,
        resouce: 'HRM_Tab_Attendance_AnnualDetail_Portal_Mobile'
    },
    E_ADDITIONAL_LEAVE: {
        key: 'E_ADDITIONAL_LEAVE',
        icon: require('../../../../../assets/images/paidLeave/AnnualAdd.png'),
        keyTras: 'HRM_Attendance_AnnualAddtionalView',
        primaryColor: Colors.purple,
        secondaryColor: Colors.purple_1,
        resouce: 'New_Attendance_RemainingLeave_Portal'
    },
    E_SICK_LEAVE: {
        key: 'E_SICK_LEAVE',
        icon: require('../../../../../assets/images/paidLeave/AnnualSick.png'),
        keyTras: 'HRM_Attendance_AnnualDetailSickView',
        primaryColor: Colors.primary,
        secondaryColor: Colors.primary_transparent_8,
        resouce: 'New_Attendance_RemainingSickLeave_Portal'
    },
    E_COMPENSATORY_LEAVE: {
        key: 'E_COMPENSATORY_LEAVE',
        icon: require('../../../../../assets/images/paidLeave/Annual.png'),
        keyTras: 'HRM_Compensation',
        primaryColor: Colors.orange,
        secondaryColor: Colors.orange_1,
        resouce: 'New_Attendance_CompensationDetail_Portal'
    },
    E_PREGNANT_LEAVE: {
        key: 'E_PREGNANT_LEAVE',
        icon: require('../../../../../assets/images/paidLeave/AnnualMenseLeave.png'),
        keyTras: 'HRM_Attendance_PregnantLeaveView',
        primaryColor: Colors.red,
        secondaryColor: Colors.red_1,
        resouce: 'New_Attendance_ChildCareCompensation_Portal'
    }
};

// https://test-app.vnresource.net:4322/Att_GetData/GetMultiCutOffDuration
// https://test-app.vnresource.net:4322//Att_GetData/Get_List_ChildCareCompensation
// CutOffDurationID: "4bdf7e8c-925f-4391-90bb-15d5c2e82e95"
// New_Attendance_ChildCareCompensation_Portal Thai sản
// HRM_Tab_Attendance_AnnualDetail_Portal_Mobile Phép năm
// New_Attendance_CompensationDetail_Portal Phép bù
// New_Attendance_RemainingLeave_Portal  Phép thêm
// New_Attendance_RemainingSickLeave_Portal Phép ốm

class AttPaidLeave extends Component {
    constructor(porps) {
        super(porps);

        this.state = {
            isLoading: true,
            dataGeneral: {},
            dataListFull: null,
            dataList: null,
            yearSelected: new Date().getFullYear(),
            restDayByType: 0,
            remainDayByType: 0,
            totalAvaiableDayByType: 0,
            totalRemainAnlBegining: 0,
            isLoadingHeader: true,
            keyQuery: EnumName.E_PRIMARY_DATA,
            isActiveFilterYears: true,
            refreshing: false,
            isLoadingList: false,
            typeNumberLeave: translate('E_DAY_LOWERCASE'),
            keyType: typePaidLeave.E_ANNUAL_LEAVE.key,
            cutOffData: {
                disable: false,
                refresh: false,
                value: null,
                data: []
            }
        };
    }

    onSubmitYear = (data) => {
        const dataBody = {
            profileID: dataVnrStorage.currentUser.info.ProfileID,
            year: data.year
        };

        this.setState(
            {
                isLoading: true,
                yearSelected: data.year,
                keyQuery: EnumName.E_FILTER
            },
            () => {
                startTask({
                    keyTask: EnumTask.KT_AttPaidLeave,
                    payload: {
                        ...dataBody,
                        keyQuery: EnumName.E_FILTER,
                        isCompare: false,
                        reload: this.getDataGeneral
                    }
                });
            }
        );
    };

    onPickcutOff = (item) => {
        this.setState(
            {
                cutOffData: {
                    ...this.state.cutOffData,
                    value: item
                }
            },
            () => this.filterType('E_PREGNANT_LEAVE')
        );
    };

    filterType = (key) => {
        const { dataGeneral, dataListFull } = this.state;
        let { typeNumberLeave } = this.state;
        if (dataGeneral == EnumName.E_EMPTYDATA) {
            return;
        }

        let _restDayByType = 0,
            _remainDayByType = 0,
            _totalAvaiableDayByType = 0,
            _totalRemainAnlBegining = 0;

        //xử lý Phép bù đang tính theo đơn vị là Giờ , những phép khác đơn vị là ngày
        if (key === typePaidLeave.E_COMPENSATORY_LEAVE.key) {
            typeNumberLeave = translate('Hour_Lowercase');
        } else {
            typeNumberLeave = translate('E_DAY_LOWERCASE');
        }

        Object.keys(dataGeneral).forEach((keyType) => {
            const type = dataGeneral[keyType];
            if (keyType == key) {
                type.isSelect = true;
                if (type.isSelect) {
                    _restDayByType = type.Avaiable - type.Remain;
                    _remainDayByType = type.Remain;
                    _totalAvaiableDayByType = type.Avaiable;
                    _totalRemainAnlBegining = type.RemainAnlBegining;
                    typeNumberLeave = type?.TypeUnit
                        ? type.TypeUnit === 'E_DAY'
                            ? translate('HRM_PortalApp_Days')
                            : type.TypeUnit === 'E_HOUR'
                                ? translate('HRM_PortalApp_Hours')
                                : translate(type.TypeUnit)
                        : typeNumberLeave;
                }
            } else {
                type.isSelect = false;
            }
            // if (type.isSelect == false) countTypefalse += 1;
        });

        if (key == typePaidLeave.E_PREGNANT_LEAVE.key) {
            if (dataGeneral[key]['isSelect'] === false) {
                this.setState({
                    dataGeneral: dataGeneral,
                    isActiveFilterYears: false,
                    dataList: [],
                    restDayByType: 0,
                    remainDayByType: 0,
                    totalAvaiableDayByType: 0,
                    typeNumberLeave: typeNumberLeave,
                    keyType: key,
                    isLoadingList: false
                });
                return;
            }

            this.setState({
                dataGeneral: dataGeneral,
                isActiveFilterYears: false,
                isLoadingList: true
            });

            const { cutOffData } = this.state;
            if (cutOffData.value != null) {
                const dataBody = {
                    CutOffDurationID: cutOffData.value.ID,
                    ProfileID: dataVnrStorage.currentUser.info.ProfileID
                };

                HttpService.Post('[URI_HR]/Att_GetData/Get_List_ChildCareCompensation', dataBody).then((res) => {
                    if (res && res.Data.length > 0) {
                        const itemData = res.Data[0];
                        itemData.configType = typePaidLeave['E_PREGNANT_LEAVE']
                            ? typePaidLeave['E_PREGNANT_LEAVE']
                            : {};
                        itemData.typeGroup = 'E_PREGNANT_LEAVE';
                        _restDayByType =
                            itemData.Available - (itemData.Remain >= 0 ? itemData.Remain : -itemData.Remain);
                        _remainDayByType = itemData.Remain;
                        _totalAvaiableDayByType = itemData.Available;

                        this.setState({
                            dataList: itemData.LeaveInMonth ? [itemData] : [],
                            restDayByType: _restDayByType,
                            remainDayByType: _remainDayByType,
                            totalAvaiableDayByType: _totalAvaiableDayByType,
                            totalRemainAnlBegining: 0,
                            keyType: key,
                            isLoadingList: false,
                            typeNumberLeave: typeNumberLeave
                        });
                    } else {
                        this.setState({
                            dataList: [],
                            restDayByType: 0,
                            remainDayByType: 0,
                            totalAvaiableDayByType: 0,
                            totalRemainAnlBegining: 0,
                            keyType: key,
                            isLoadingList: false,
                            typeNumberLeave: typeNumberLeave
                        });
                    }
                });
            }
        } else {
            const dataListFilter = dataListFull.filter((e) => {
                const checkTypeTrue = dataGeneral[e.typeGroup];
                // if (!checkTypeTrue) countTypefalse += 1;
                return checkTypeTrue.isSelect;
            });

            this.setState({
                dataList: dataListFilter,
                typeNumberLeave: typeNumberLeave,
                dataGeneral: dataGeneral,
                restDayByType: _restDayByType,
                remainDayByType: _remainDayByType,
                totalAvaiableDayByType: _totalAvaiableDayByType,
                totalRemainAnlBegining: _totalRemainAnlBegining,
                keyType: key,
                isActiveFilterYears: true
            });
        }
    };

    _renderHeaderLoading = () => {
        return <VnrIndeterminate isVisible={this.state.isLoadingHeader} />;
    };

    getDataGeneral = () => {
        const { keyQuery } = this.state;

        getDataLocal(EnumTask.KT_AttPaidLeave).then((resData) => {
            const permission = PermissionForAppMobile.value;
            const res = resData && resData[keyQuery] ? resData[keyQuery] : null;
            let typeNumberLeave = translate('E_DAY_LOWERCASE');
            if (res && res !== EnumName.E_EMPTYDATA && res.length > 0) {
                let _dataGeneral = {},
                    _restDayByType = 0,
                    _remainDayByType = 0,
                    _totalAvaiableDayByType = 0,
                    _totalRemainAnlBegining = 0,
                    _listData = [],
                    _listFullData = [];

                if (
                    typePaidLeave['E_PREGNANT_LEAVE'] !== undefined &&
                    permission[typePaidLeave['E_PREGNANT_LEAVE']['resouce']] &&
                    permission[typePaidLeave['E_PREGNANT_LEAVE']['resouce']]['View']
                ) {
                    res.push({
                        Remain: 0,
                        Avaiable: 0,
                        AnnualType: typePaidLeave.E_PREGNANT_LEAVE.key,
                        LeaveDayDetailEntities: []
                    });
                }

                res.forEach((group) => {
                    // check key quyền trước khi render
                    if (
                        typePaidLeave[group.AnnualType] !== undefined &&
                        permission[typePaidLeave[group.AnnualType]['resouce']] &&
                        permission[typePaidLeave[group.AnnualType]['resouce']]['View']
                    ) {
                        if (group.AnnualType == typePaidLeave.E_ANNUAL_LEAVE.key) {
                            _restDayByType = group.Avaiable - (group.Remain >= 0 ? group.Remain : -group.Remain);
                            _remainDayByType = group.Remain;
                            _totalAvaiableDayByType = group.Avaiable;
                            _totalRemainAnlBegining = group.RemainAnlBegining;
                        }

                        // xử lý group
                        _dataGeneral[group.AnnualType] = {
                            ...group,
                            ...{
                                isSelect: group.AnnualType == typePaidLeave.E_ANNUAL_LEAVE.key ? true : false,
                                configType: typePaidLeave[group.AnnualType] ? typePaidLeave[group.AnnualType] : {}
                            }
                        };

                        // Xử lý DS
                        if (group.LeaveDayDetailEntities && group.LeaveDayDetailEntities.length > 0) {
                            group.LeaveDayDetailEntities.map((entities) => {
                                // lấy list phép năm
                                if (group.AnnualType == typePaidLeave.E_ANNUAL_LEAVE.key) {
                                    _listData.push({
                                        ...entities,
                                        ...{
                                            configType: typePaidLeave[group.AnnualType]
                                                ? typePaidLeave[group.AnnualType]
                                                : {},
                                            typeGroup: group.AnnualType
                                        }
                                    });
                                }
                                _listFullData.push({
                                    ...entities,
                                    ...{
                                        configType: typePaidLeave[group.AnnualType]
                                            ? typePaidLeave[group.AnnualType]
                                            : {},
                                        typeGroup: group.AnnualType
                                    }
                                });
                            });
                        }
                    }
                });

                if (_listData.length > 0)
                    _listData.sort(function (a, b) {
                        return moment(b.DateStart).toDate() - moment(a.DateStart).toDate();
                    });

                // nhan.nguyen: 0171134
                if (_dataGeneral) {
                    const rs = Object.values(_dataGeneral).find((item) => item?.isSelect === true);

                    if (rs && rs?.TypeUnit) {
                        typeNumberLeave =
                            rs.TypeUnit === 'E_DAY'
                                ? translate('HRM_PortalApp_Days')
                                : rs.TypeUnit === 'E_HOUR'
                                    ? translate('HRM_PortalApp_Hours')
                                    : translate(rs.TypeUnit);
                    }
                }

                this.setState({
                    dataGeneral: _dataGeneral,
                    dataList: _listData,
                    dataListFull: _listFullData,
                    restDayByType: _restDayByType,
                    remainDayByType: _remainDayByType,
                    totalAvaiableDayByType: _totalAvaiableDayByType,
                    totalRemainAnlBegining: _totalRemainAnlBegining,
                    typeNumberLeave: typeNumberLeave,
                    isLoading: false,
                    isLoadingHeader: false,
                    refreshing: false
                });
            } else if (res === EnumName.E_EMPTYDATA) {
                this.setState({
                    dataGeneral: EnumName.E_EMPTYDATA,
                    dataList: EnumName.E_EMPTYDATA,
                    dataListFull: EnumName.E_EMPTYDATA,
                    typeNumberLeave: typeNumberLeave,
                    restDayByType: 0,
                    remainDayByType: 0,
                    totalAvaiableDayByType: 0,
                    totalRemainAnlBegining: 0,
                    isLoading: false,
                    isLoadingHeader: false,
                    refreshing: false
                });
            }
        });
    };

    _handleRefresh = () => {
        const dataBody = {
            profileID: dataVnrStorage.currentUser.info.ProfileID,
            year: this.state.yearSelected
        };

        this.setState(
            {
                refreshing: true,
                keyQuery: EnumName.E_FILTER
            },
            () => {
                startTask({
                    keyTask: EnumTask.KT_AttPaidLeave,
                    payload: {
                        ...dataBody,
                        keyQuery: EnumName.E_FILTER,
                        isCompare: false,
                        reload: this.getDataGeneral
                    }
                });
            }
        );
    };

    getCutOffDuration = () => {
        HttpService.Post('[URI_HR]/Att_GetData/GetMultiCutOffDuration').then((res) => {
            const { cutOffData } = this.state;
            if (res && res.length > 0) {
                const findItemCurrent = res.find(
                    (e) => moment(e.MonthYear).format('MM/YYYY') === moment().format('MM/YYYY')
                );
                this.setState({
                    cutOffData: {
                        ...cutOffData,
                        value: findItemCurrent ? findItemCurrent : null,
                        data: res
                        // refresh: !cutOffData.refresh
                    }
                });
            }
        });
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;
        if (nextProps.reloadScreenName == EnumTask.KT_AttPaidLeave) {
            //khi màn hình đang reload thì messsage phải là filter thì màn hình mới reload
            if (keyQuery === EnumName.E_FILTER && nextProps.message && keyQuery == nextProps.message.keyQuery) {
                this.getDataGeneral();
            } else if (nextProps.message && keyQuery == nextProps.message.keyQuery) {
                // dataChange == true ? khác : giống nhau
                if (!nextProps.message.dataChange) {
                    this.setState({
                        isLoadingHeader: false
                    });
                } else {
                    this.getDataGeneral();
                }
            }
        }
    }

    componentDidMount() {
        this.getDataGeneral();
        this.getCutOffDuration();
        startTask({
            keyTask: EnumTask.KT_AttPaidLeave,
            payload: {
                keyQuery: EnumName.E_PRIMARY_DATA,
                isCompare: true,
                reload: this.getDataGeneral
            }
        });
    }

    renderItemListGeneral = (key, listDataGeneral, index) => {
        const lengthData = Object.keys(listDataGeneral).length,
            { configType = {}, isSelect } = listDataGeneral[key];

        let content = <View />;

        if (lengthData == 1) {
            const SPACE_ITEM = Size.defineSpace * lengthData,
                WIDTH_ITEM = (Size.deviceWidth - Size.defineSpace - lengthData * 2 - SPACE_ITEM) / lengthData;

            content = (
                <View
                    key={index}
                    style={styles.styListItemRow(
                        configType.secondaryColor,
                        configType.primaryColor,
                        isSelect,
                        WIDTH_ITEM
                    )}
                >
                    <Image source={configType.icon} style={styles.styItemIcon(WIDTH_ITEM)} />
                    <View style={styles.styItemInfoRow}>
                        <VnrText
                            style={[styleSheets.text, styles.styItemTitle2(configType.primaryColor)]}
                            i18nKey={configType.keyTras}
                        />
                        {/* {txtValueView} */}
                    </View>
                </View>
            );
        } else if (lengthData == 2) {
            const SPACE_ITEM = (Size.defineSpace / 1.5) * lengthData,
                WIDTH_ITEM = (Size.deviceWidth - Size.defineSpace - lengthData * 2 - SPACE_ITEM) / lengthData;
            content = (
                <TouchableOpacity
                    onPress={() => this.filterType(key)}
                    style={styles.styListItemRow(
                        configType.secondaryColor,
                        configType.primaryColor,
                        isSelect,
                        WIDTH_ITEM
                    )}
                >
                    <Image source={configType.icon} style={styles.styItemIcon(WIDTH_ITEM)} />
                    <View style={styles.styItemInfo}>
                        <VnrText
                            style={[styleSheets.text, styles.styItemTitle2(configType.primaryColor)]}
                            i18nKey={configType.keyTras}
                        />
                        {/* <Text style={[styleSheets.lable, styles.styItemValue(Size.text + 3)]}>
              <Text style={{ color: Colors.primary }}>{Remain}</Text>/{Avaiable}
            </Text> */}
                    </View>
                </TouchableOpacity>
            );
        } else if (lengthData > 4) {
            const MARGIN_ITEM = index == 0 ? 0 : Size.defineHalfSpace,
                SPACE_ITEM = Size.defineHalfSpace * lengthData,
                WIDTH_ITEM =
                    (Size.deviceWidth -
                        Size.defineSpace - // padding hai bên
                        lengthData * 2 - // chừa khoản cách của border khi active
                        SPACE_ITEM) / // khoảng cách cách item
                    3.3;

            content = (
                <TouchableOpacity
                    onPress={() => this.filterType(key)}
                    style={styles.styListItem(
                        configType.secondaryColor,
                        configType.primaryColor,
                        isSelect,
                        WIDTH_ITEM,
                        MARGIN_ITEM
                    )}
                >
                    <Image source={configType.icon} style={styles.styItemIcon(WIDTH_ITEM)} />
                    <View style={styles.styItemInfo}>
                        <VnrText
                            style={[
                                styleSheets.text,
                                styles.styItemTitle(configType.primaryColor),
                                CustomStyleSheet.marginTop(5)
                            ]}
                            i18nKey={configType.keyTras}
                        />
                        {/* <Text style={[styleSheets.lable, styles.styItemValue(Size.text + 1)]}>
              <Text style={{ color: Colors.primary }}>{Remain}</Text>/{Avaiable}
            </Text> */}
                    </View>
                </TouchableOpacity>
            );
        } else {
            const SPACE_ITEM = Size.defineHalfSpace * lengthData,
                WIDTH_ITEM =
                    (Size.deviceWidth -
                        Size.defineSpace - // padding hai bên
                        lengthData * 2 - // chừa khoản cách của border khi active
                        SPACE_ITEM) / // khoảng cách cách item
                    lengthData;
            content = (
                <TouchableOpacity
                    onPress={() => this.filterType(key)}
                    style={styles.styListItem(configType.secondaryColor, configType.primaryColor, isSelect, WIDTH_ITEM)}
                >
                    <Image source={configType.icon} style={styles.styItemIcon(WIDTH_ITEM)} />
                    <View style={styles.styItemInfo}>
                        <VnrText
                            style={[
                                styleSheets.text,
                                styles.styItemTitle(configType.primaryColor),
                                CustomStyleSheet.marginTop(5)
                            ]}
                            i18nKey={configType.keyTras}
                        />
                        {/* <Text style={[styleSheets.lable, styles.styItemValue(Size.text + 1)]}>
              <Text style={{ color: Colors.primary }}>{Remain}</Text>/{Avaiable}
            </Text> */}
                    </View>
                </TouchableOpacity>
            );
        }

        return content;
    };

    render() {
        const {
            isLoading,
            dataGeneral,
            dataList,
            yearSelected,
            restDayByType,
            remainDayByType,
            refreshing,
            totalAvaiableDayByType,
            totalRemainAnlBegining,
            cutOffData,
            isActiveFilterYears,
            isLoadingList,
            typeNumberLeave,
            keyType
        } = this.state;

        let viewContent = <View />,
            isShowTotalRemainAnlBegining =
                keyType != typePaidLeave.E_ANNUAL_LEAVE.key ? { justifyContent: 'center' } : {};

        if (isLoading) {
            viewContent = <VnrLoadingScreen size="large" isVisible={isLoading} type={EnumStatus.E_SUBMIT} />;
        } else if (dataGeneral == EnumName.E_EMPTYDATA || Object.keys(dataGeneral).length == 0) {
            viewContent = <EmptyData messageEmptyData={'EmptyData'} />;
        } else if (dataGeneral && Object.keys(dataGeneral).length > 0) {
            viewContent = (
                <View style={styles.container}>
                    <View style={styles.styTopView}>
                        {/* {Object.keys(dataGeneral).length > 1 && (
              <View style={styles.styViewPrimary}>
                <VnrText
                  style={[styleSheets.text, styles.styPrimaryTitle]}
                  i18nKey={'HRM_AttPaidLeave_Number_Spell_Remain'}
                />
                <Text style={[styleSheets.lable, styles.styPrimaryValue]}>
                  {`${restDayByType} ${translate('E_DAY_LOWERCASE')}`}
                </Text>
              </View>
            )} */}

                        {Object.keys(dataGeneral).length > 4 ? (
                            <ScrollView
                                showsHorizontalScrollIndicator={false}
                                horizontal
                                contentContainerStyle={styles.styListPrimaryScroll}
                                // pagingEnabled
                            >
                                {Object.keys(dataGeneral).map((key, index) =>
                                    this.renderItemListGeneral(key, dataGeneral, index)
                                )}
                            </ScrollView>
                        ) : (
                            <View style={styles.styListPrimary}>
                                {Object.keys(dataGeneral).map((key) => this.renderItemListGeneral(key, dataGeneral))}
                            </View>
                        )}
                    </View>

                    {isLoadingList ? (
                        <VnrLoading size="large" isVisible={isLoadingList} />
                    ) : dataList && dataList !== EnumName.E_EMPTYDATA && dataList.length > 0 ? (
                        <FlatList
                            refreshControl={
                                <RefreshControl
                                    onRefresh={() => this._handleRefresh()}
                                    refreshing={refreshing}
                                    size="large"
                                    tintColor={Colors.primary}
                                />
                            }
                            data={dataList}
                            renderItem={({ item, index }) => (
                                <AttPaidLeaveItem
                                    dataItem={item}
                                    index={index}
                                    typeNumberLeave={typeNumberLeave}
                                    screenDetail={ScreenName.AttPaidLeaveViewDetail}
                                    // screenName={ScreenName.AttPaidLeavePregnant}
                                />
                            )}
                            keyExtractor={(item, index) => index}
                        />
                    ) : (
                        <View style={styles.styContentEmpty}>
                            <EmptyData
                                uriImage={require('../../../../../assets/images/EmptyAttPaidLeave.png')}
                                messageEmptyData={'HRM_PortalApp_NotUseLeaveDay'}
                            />
                        </View>
                    )}

                    <View style={styles.styViewNumber}>
                        <View style={[styles.styViewBox, isShowTotalRemainAnlBegining]}>
                            <VnrText
                                style={[styleSheets.text, styles.styTitleDay]}
                                i18nKey={'HRM_PortalApp_Total_Leave'}
                            />
                            <Text style={[styleSheets.text, styles.styValueDay]}>
                                {`${totalAvaiableDayByType} ${typeNumberLeave}`}
                            </Text>
                        </View>

                        {(keyType == typePaidLeave.E_ANNUAL_LEAVE.key && totalRemainAnlBegining !== 0 && !!totalRemainAnlBegining) && (
                            <View style={styles.styViewBox}>
                                <VnrText
                                    style={[styleSheets.text, styles.styTitleDay]}
                                    i18nKey={'HRM_PortalApp_Total_RemainAnlBegining'}
                                />
                                <Text style={[styleSheets.text, styles.styValueDay]}>
                                    {`${Vnr_Function.mathRoundNumber(
                                        totalRemainAnlBegining ? totalRemainAnlBegining : 0
                                    )} ${typeNumberLeave}`}
                                </Text>
                            </View>
                        )}

                        <View style={[styles.styViewBox, isShowTotalRemainAnlBegining]}>
                            <VnrText
                                style={[styleSheets.text, styles.styTitleDay]}
                                i18nKey={'HRM_PortalApp_Leave_Used'}
                            />
                            <Text style={[styleSheets.text, styles.styValueDay]}>
                                {`${Vnr_Function.mathRoundNumber(restDayByType)} ${typeNumberLeave}`}
                            </Text>
                        </View>

                        <View style={[styles.styViewBox, isShowTotalRemainAnlBegining]}>
                            <VnrText
                                style={[styleSheets.text, styles.styTitleDay]}
                                i18nKey={'HRM_PortalApp_Remaining_Leave'}
                            />
                            <Text
                                style={[
                                    styleSheets.text,
                                    styles.styValueDay,
                                    remainDayByType < 0 ? { color: Colors.red } : { color: Colors.primary }
                                ]}
                            >
                                {`${Vnr_Function.mathRoundNumber(remainDayByType)} ${typeNumberLeave}`}
                            </Text>
                        </View>
                    </View>
                </View>
            );
        }
        // else {
        //   viewContent = <EmptyData messageEmptyData={'EmptyData'} />;
        // }

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styles.searchYear}>
                    {isActiveFilterYears ? (
                        <VnrYearPicker onFinish={(item) => this.onSubmitYear(item)} value={yearSelected} />
                    ) : (
                        <VnrPickerQuickly
                            stylePicker={styles.styPickercutOff}
                            dataLocal={cutOffData.data}
                            refresh={cutOffData.refresh}
                            textField="CutOffDurationName"
                            filterParams={'CutOffDurationName'}
                            valueField="ID"
                            filter={true}
                            filterServer={false}
                            value={cutOffData.value}
                            disable={cutOffData.disable}
                            onFinish={(item) => this.onPickcutOff(item)}
                        />
                    )}
                </View>

                {this._renderHeaderLoading()}
                {viewContent}
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        minHeight: 200
    },
    searchYear: {
        backgroundColor: Colors.white,
        paddingVertical: 10,
        flexDirection: 'row'
    },
    styPickercutOff: {
        marginHorizontal: Size.defineSpace
    },
    styTopView: {
        marginVertical: Size.defineSpace / 2,
        paddingHorizontal: Size.defineSpace
    },
    styListPrimary: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    styListPrimaryScroll: {},
    styListItem: (bgColor, brColor, focus, width, marLeft = 0) => {
        return {
            backgroundColor: bgColor,
            width: width, // WIDTH_ITEM,
            paddingHorizontal: 9,
            borderRadius: 8,
            paddingTop: 5,
            paddingBottom: 5,
            borderColor: focus ? brColor : bgColor,
            borderWidth: 1,
            marginLeft: marLeft
        };
    },
    styListItemRow: (bgColor, brColor, focus, width, marLeft = 0) => {
        return {
            backgroundColor: bgColor,
            width: width, // WIDTH_ITEM,
            // flexDirection: 'row',s
            paddingHorizontal: 7,
            borderRadius: 8,
            paddingVertical: 7,
            borderColor: focus ? brColor : bgColor,
            borderWidth: 1,
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: marLeft
        };
    },
    styItemIcon: (width) => {
        return {
            width: width * 0.4,
            height: width * 0.4,
            marginRight: 5,
            maxHeight: Size.deviceWidth >= 1024 ? 100 : 60,
            maxWidth: Size.deviceWidth >= 1024 ? 100 : 60
        };
    },
    styItemInfo: {},
    styItemInfoRow: {
        paddingTop: 5
    },
    styItemTitle: (txtColor) => {
        return {
            fontSize: Size.text - 3,
            color: txtColor
        };
    },
    styItemTitle2: (txtColor) => {
        return {
            fontSize: Size.text,
            color: txtColor
        };
    },
    styContentEmpty: {
        flex: 1
    },
    styViewNumber: {
        height: Size.defineSpace + Size.text * 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: Size.defineSpace,
        paddingVertical: Size.defineHalfSpace,
        alignItems: 'center',
        borderTopWidth: 0.5,
        borderTopColor: Colors.gray_5
    },
    styViewBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%'
    },
    styTitleDay: {
        fontSize: Size.textSmall,
        textAlign: 'center'
    },
    styValueDay: {
        fontWeight: '600',
        marginTop: 5
    }
});

const mapStateToProps = (state) => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message,
        language: state.languageReducer.language
    };
};

export default connect(mapStateToProps, null)(AttPaidLeave);
