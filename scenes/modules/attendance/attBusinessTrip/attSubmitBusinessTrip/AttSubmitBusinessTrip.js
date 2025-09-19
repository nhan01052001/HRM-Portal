import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import AttBusinessTripList from '../attBusinessTripList/AttBusinessTripList';
import {
    styleSheets,
    Colors,
    Size,
    styleSafeAreaView,
    styleContentFilterDesign,
    stylesModalPopupBottom,
    styleScreenDetail,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import Modal from 'react-native-modal';
import { IconCancel, IconColse } from '../../../../../constants/Icons';
import VnrFilterCommon from '../../../../../components/VnrFilter/VnrFilterCommon';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ScreenName, EnumName, EnumTask } from '../../../../../assets/constant';
import { generateRowActionAndSelected, AttSubmitBusinessTripBusinessFunction } from './AttSubmitBusinessTripBusiness';
import { connect } from 'react-redux';
import { startTask } from '../../../../../factories/BackGroundTask';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import VnrText from '../../../../../components/VnrText/VnrText';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import { VnrBtnCreate } from '../../../../../componentsV3/VnrBtnCreate/VnrBtnCreate';
import DrawerServices from '../../../../../utils/DrawerServices';

const sourceNgoaiTinh = '../../../../../assets/images/Bussiness/ngoaiTinh.png';
const sourceNoiTinh = '../../../../../assets/images/Bussiness/noiTinh.png';
const sourceNuocNgoai = '../../../../../assets/images/Bussiness/nuocNgoai.png';

let configList = null,
    enumName = null,
    attSubmitBusinessTrip = null,
    attSubmitBusinessTripAddOrEdit = null,
    attSubmitBusinessTripViewDetail = null,
    attSubmitBusinessTripKeyTask = null,
    pageSizeList = 20;

class AttSubmitBusinessTrip extends Component {
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
            modalVisible: false,
            dataBusinessCost: {
                isVisible: false,
                data: null
            }
        };
        (this.navigateToDetail = () =>
            props.navigation.navigate(attSubmitBusinessTripAddOrEdit, { reload: () => this.reload() })),
        (this.storeParamsDefault = null);

        //biến lưu lại object filter
        this.paramsFilter = null;
    }

    showModal = () => {
        this.setState({
            modalVisible: true
        });
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
            startTask({
                keyTask: attSubmitBusinessTripKeyTask,
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
        const _configList = configList[attSubmitBusinessTrip],
            //renderRow = _configList[enumName.E_Row],
            orderBy = _configList[enumName.E_Order];

        const dataRowActionAndSelected = generateRowActionAndSelected();
        let _params = {
            IsPortal: true,
            sort: orderBy,
            pageSize: pageSizeList
        };

        return {
            rowActions: dataRowActionAndSelected.rowActions,
            selected: dataRowActionAndSelected.selected,
            //renderRow: renderRow,
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
                    keyTask: attSubmitBusinessTripKeyTask,
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
                    keyTask: attSubmitBusinessTripKeyTask,
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
        // console.log(nextProps,'nextProps')
        if (nextProps.reloadScreenName == attSubmitBusinessTripKeyTask) {
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

    componentDidMount() {
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        attSubmitBusinessTrip = ScreenName.AttSubmitBusinessTrip; // undefind
        attSubmitBusinessTripAddOrEdit = ScreenName.AttSubmitBusinessTripAddOrEdit;
        attSubmitBusinessTripViewDetail = ScreenName.AttSubmitBusinessTripViewDetail;
        attSubmitBusinessTripKeyTask = EnumTask.KT_AttSubmitBusinessTrip;
        AttSubmitBusinessTripBusinessFunction.setThisForBusiness(this);
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: attSubmitBusinessTripKeyTask,
            payload: {
                pageSize: pageSizeList,
                keyQuery: EnumName.E_PRIMARY_DATA,
                isCompare: true,
                reload: this.reload
            }
        });
    }

    closeModal = () => {
        // let nextState = {
        //     modalLimit: {
        //         isModalVisible: false,
        //         data: [],
        //     },
        // };

        // this.setState(nextState);
        this.setState({ modalVisible: false });
    };

    router = roouterName => {
        const { navigation } = this.props;
        navigation.navigate(roouterName);
        this.closeModal();
    };

    viewListItemBussinessTrip = () => {
        return (
            <View
                style={styles.wrapViewListItemBussinessTrip}
            >
                <View style={styles.viewTextTimeWithBorder}>
                    <TouchableOpacity onPress={() => this.router(attSubmitBusinessTripAddOrEdit)}>
                        <Image source={require(sourceNoiTinh)} style={{ ...CustomStyleSheet.width(70), ...CustomStyleSheet.height(70) }} />
                    </TouchableOpacity>

                    <VnrText style={[styleSheets.text, styles.textTitleBussiness]} i18nKey={'MissionPlaceType__E_IN'} />
                </View>

                <View style={styles.viewTextTimeWithBorder}>
                    <TouchableOpacity onPress={() => this.router(attSubmitBusinessTripAddOrEdit)}>
                        <Image source={require(sourceNgoaiTinh)} style={{ ...CustomStyleSheet.width(70), ...CustomStyleSheet.height(70) }} />
                    </TouchableOpacity>
                    <VnrText
                        style={[styleSheets.text, styles.textTitleBussiness]}
                        i18nKey={'MissionPlaceType__E_DOMESTIC'}
                    />
                </View>

                <View style={styles.viewTextTimeWithBorder}>
                    <TouchableOpacity onPress={() => this.router(attSubmitBusinessTripAddOrEdit)}>
                        <Image source={require(sourceNuocNgoai)} style={{ ...CustomStyleSheet.width(70), ...CustomStyleSheet.height(70) }} />
                    </TouchableOpacity>
                    <VnrText
                        style={[styleSheets.text, styles.textTitleBussiness]}
                        i18nKey={'MissionPlaceType__E_OUT'}
                    />
                </View>
            </View>
        );
    };

    showDetailCost = data => {
        this.setState({
            dataBusinessCost: {
                isVisible: true,
                data: data
            }
        });
    };

    hideDetailCost = () => {
        this.setState({
            dataBusinessCost: {
                isVisible: false,
                data: null
            }
        });
    };

    viewListDetailCost = data => {
        const { itemContent, textLableInfo } = styleScreenDetail;

        if (data && data.length == 0) {
            return <EmptyData messageEmptyData={'EmptyData'} />;
        }

        return data.map((item, index) => {
            return (
                <View
                    key={index}
                    style={styles.wrapViewListDetailCost}
                >
                    <View style={itemContent}>
                        <View style={styleSheets.viewLable}>
                            <VnrText
                                style={[styleSheets.text, textLableInfo]}
                                i18nKey={'BusinessTripNorm__E_CostType'}
                            />
                        </View>
                        <View style={styleSheets.viewControl}>
                            <VnrText value={item['MissionCostTypeName']} />
                        </View>
                    </View>
                    <View style={itemContent}>
                        <View style={styleSheets.viewLable}>
                            <VnrText
                                style={[styleSheets.text, textLableInfo]}
                                i18nKey={'HRM_Att_LeaveDayBusiness_Cost'}
                            />
                        </View>
                        <View style={styleSheets.viewControl}>
                            <VnrText value={item['Cost']} />
                        </View>
                    </View>
                    <View style={[itemContent, CustomStyleSheet.borderBottomWidth(0)]}>
                        <View style={styleSheets.viewLable}>
                            <VnrText
                                style={[styleSheets.text, textLableInfo]}
                                i18nKey={'HRM_Att_LeaveDayBusiness_CurrentName'}
                            />
                        </View>
                        <View style={styleSheets.viewControl}>
                            <VnrText value={item['CurrencyName']} />
                        </View>
                    </View>
                </View>
            );
        });
    };

    render() {
        const {
            dataBody,
            // renderRow,
            rowActions,
            selected,
            isLazyLoading,
            isRefreshList,
            keyQuery,
            dataChange,
            dataBusinessCost
        } = this.state;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                {attSubmitBusinessTrip && attSubmitBusinessTripViewDetail && enumName && (
                    <View style={[styleSheets.container]}>
                        <VnrFilterCommon
                            style={styleContentFilterDesign}
                            screenName={attSubmitBusinessTrip}
                            onSubmitEditing={this.reload}
                        />

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <AttBusinessTripList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: attSubmitBusinessTripViewDetail,
                                        screenName: attSubmitBusinessTrip
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={attSubmitBusinessTripKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    api={{
                                        urlApi: '[URI_HR]/Att_GetData/New_GetBusinessTravelByFilter',
                                        type: enumName.E_POST,
                                        dataBody: dataBody,
                                        pageSize: 20
                                    }}
                                    valueField="ID"
                                //renderConfig={renderRow}
                                />
                            )}

                            {PermissionForAppMobile &&
                                PermissionForAppMobile.value['New_List_Travel_New_Index_Portal'] &&
                                PermissionForAppMobile.value['New_List_Travel_New_Index_Portal']['Create'] && (
                                <VnrBtnCreate
                                    onAction={() => {
                                        DrawerServices.navigate(attSubmitBusinessTripAddOrEdit, {
                                            reload: () => this.reload()
                                        });
                                    }}
                                />
                            )}
                        </View>
                    </View>
                )}

                {dataBusinessCost.isVisible && (
                    <Modal
                        onBackButtonPress={() => this.hideDetailCost()}
                        isVisible={true}
                        onBackdropPress={() => this.hideDetailCost()}
                        customBackdrop={
                            <TouchableWithoutFeedback onPress={() => this.hideDetailCost()}>
                                <View
                                    style={styleSheets.coatingOpacity05}
                                />
                            </TouchableWithoutFeedback>
                        }
                        style={CustomStyleSheet.margin(0)}
                    >
                        <View style={stylesModalPopupBottom.viewModal}>
                            <SafeAreaView {...styleSafeAreaView} style={stylesModalPopupBottom.safeRadius}>
                                <View style={styles.headerCloseModal}>
                                    <TouchableOpacity onPress={() => this.hideDetailCost()}>
                                        <IconColse color={Colors.grey} size={Size.iconSize} />
                                    </TouchableOpacity>
                                    <VnrText
                                        style={styleSheets.lable}
                                        i18nKey={'HRM_Common_BusinessTravelCosts_View'}
                                    />
                                    <IconColse color={Colors.white} size={Size.iconSize} />
                                </View>
                                <ScrollView style={styleSheets.flexGrow1flexDirectionColumn}>
                                    {this.viewListDetailCost(dataBusinessCost.data)}
                                </ScrollView>
                            </SafeAreaView>
                        </View>
                    </Modal>
                )}

                {this.state.modalVisible && (
                    <Modal
                        onBackButtonPress={() => this.closeModal()}
                        isVisible={true}
                        onBackdropPress={() => this.closeModal()}
                        customBackdrop={
                            <TouchableWithoutFeedback onPress={() => this.closeModal()}>
                                <View
                                    style={styleSheets.coatingOpacity05}
                                />
                            </TouchableWithoutFeedback>
                        }
                        style={CustomStyleSheet.margin(0)}
                    >
                        <View style={stylesModalPopupBottom.viewModalBussiness}>
                            <SafeAreaView
                            >
                                <View style={styles.headerCloseModal}>
                                    <IconColse color={Colors.white} size={Size.iconSize} />
                                    <VnrText
                                        style={[styleSheets.lable]}
                                        i18nKey={'Chọn loại công tác'}
                                    />
                                    <TouchableOpacity onPress={() => this.closeModal()}>
                                        <IconCancel color={Colors.black} size={Size.iconSize} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{}}>{this.viewListItemBussinessTrip()}</View>
                            </SafeAreaView>
                        </View>
                    </Modal>
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

const styles = StyleSheet.create({
    headerCloseModal: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textTitleBussiness: { marginTop: 20, textAlign: 'center', fontWeight: 'bold' },
    wrapViewListItemBussinessTrip: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 30,
        marginLeft: 10
    },
    wrapViewListDetailCost: {
        borderColor: Colors.gray_5,
        borderWidth: 0.5,
        borderRadius: 7,
        marginBottom: Size.defineSpace,
        paddingHorizontal: Size.defineHalfSpace,
        paddingVertical: 10,
        marginHorizontal: Size.defineHalfSpace
    }
});

export default connect(
    mapStateToProps,
    null
)(AttSubmitBusinessTrip);
