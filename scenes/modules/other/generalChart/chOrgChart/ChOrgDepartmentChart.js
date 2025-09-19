import React, { Component } from 'react';
import { View, Animated, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
    styleSheets,
    styleSafeAreaView,
    styleContentFilterDesign,
    styleContentFilterDesignV3,
    Size,
    stylesListPickerControl,
    Colors,
    stylesVnrFilter
} from '../../../../../constants/styleConfig';
import VnrFilterCommon from '../../../../../componentsV3/VnrFilter/VnrFilterCommon';
import { ScreenName, EnumName, EnumTask } from '../../../../../assets/constant';
import { connect } from 'react-redux';
import { startTask } from '../../../../../factories/BackGroundTask';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';
import ChWebViewChart from './ChWebViewChart';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import { IconSliders } from '../../../../../constants/Icons';
import VnrTreeView from '../../../../../componentsV3/VnrTreeView/VnrTreeView';
import { translate } from '../../../../../i18n/translate';
import { ConfigListFilter } from '../../../../../assets/configProject/ConfigListFilter';

let chOrgDepartmentChart = null,
    chOrgDepartmentChartKeyTask = null;

class ChOrgDepartmentChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataBody: null,
            isRefreshList: false,
            isLazyLoading: false,
            keyQuery: null,
            dataChange: false, //biến check dữ liệu có thay đổi hay không
            EmpTypeIDs: '',
            numberCountFilter: 0,
            OrgStructureIDs: {
                control: {
                    Name: 'VnrTreeView',
                    api: {
                        urlApi: '[URI_CENTER]/api/Cat_GetData/GetOrgTreeView',
                        type: 'E_GET'
                    },
                    fieldName: 'OrgStructureIDs',
                    isCheckChildren: false,
                    response: 'string',
                    textField: 'Name',
                    valueField: 'id',
                    newStyle: true
                },
                value: null,
                refresh: false
            }
        };

        // animation filter
        this.scrollYAnimatedValue = new Animated.Value(0);

        this.storeParamsDefault = null;

        //biến lưu lại object filter
        this.paramsFilter = null;
        this.refFilter = null;
    }

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
    }

    reload = (paramsFilter) => {
        const { OrgStructureIDs } = this.state;
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
                ..._paramsDefault?.dataBody,
                ...paramsFilter,
                OrgStructureIDs:
                    OrgStructureIDs.value && OrgStructureIDs.value.length > 0
                        ? OrgStructureIDs.value
                            .map((item) => {
                                return item['id'];
                            })
                            .join(', ')
                        : null
            }
        };

        let _configListFilter = ConfigListFilter.value[chOrgDepartmentChart],
            _numberCountFilter = 0;

        if (_configListFilter && _configListFilter.FilterAdvance) {
            _configListFilter.FilterAdvance.forEach((item) => {
                const control = item.ControlGroup[0];
                if (_paramsDefault.dataBody[control.fieldName]) {
                    _numberCountFilter++;
                }
            });

            _paramsDefault = {
                ..._paramsDefault,
                numberCountFilter: _numberCountFilter
            };
        }

        // set false when reloaded
        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: chOrgDepartmentChartKeyTask,
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
            _params = typeof params == 'object' ? params : JSON.parse(params);
        return _params;
    };

    paramsDefault = () => {
        const dataFromParams = this.checkDataFormNotify();

        let _params = {
            ...dataFromParams,
            ProfileID: dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null
        };

        return {
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
                    keyTask: chOrgDepartmentChartKeyTask,
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

    pagingRequest = () => {
        const { dataBody } = this.state;
        this.setState(
            {
                keyQuery: EnumName.E_PAGING
            },
            () => {
                startTask({
                    keyTask: chOrgDepartmentChartKeyTask,
                    payload: {
                        ...dataBody,
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
        if (nextProps.reloadScreenName == chOrgDepartmentChartKeyTask) {
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
        chOrgDepartmentChart = ScreenName.ChOrgDepartmentChart;
        chOrgDepartmentChartKeyTask = EnumTask.KT_ChOrgDepartmentChart;
        //set by config
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: chOrgDepartmentChartKeyTask,
            payload: {
                ..._paramsDefault.dataBody,
                keyQuery: EnumName.E_PRIMARY_DATA,
                isCompare: false,
                reload: this.reload
            }
        });
    }

    render() {
        const { dataBody, keyQuery, isLazyLoading, isRefreshList, dataChange, numberCountFilter, OrgStructureIDs } =
            this.state;

        let listFilterID = [];
        if (dataBody && dataBody.EmpTypeIDs) {
            listFilterID = dataBody.EmpTypeIDs.split(',');
        }

        return (
            <SafeAreaViewDetail style={styleSafeAreaView.style}>
                {chOrgDepartmentChart && chOrgDepartmentChartKeyTask && (
                    <View style={[styleSheets.containerGrey]}>
                        <VnrFilterCommon
                            ref={(ref) => (this.refFilter = ref)}
                            dataBody={dataBody}
                            style={{
                                ...styleContentFilterDesign,
                                ...styleContentFilterDesignV3
                            }}
                            screenName={chOrgDepartmentChart}
                            onSubmitEditing={this.reload}
                            scrollYAnimatedValue={this.scrollYAnimatedValue}
                        >
                            <View style={styleContentFilterDesignV3.styBoxFilter}>
                                <View style={styleContentFilterDesignV3.contentFilter}>
                                    <View style={styleContentFilterDesignV3.filter}>
                                        <TouchableOpacity
                                            onPress={() =>
                                                this.refOrgStructureIDs && this.refOrgStructureIDs.opentModal()
                                            }
                                            style={[
                                                styleContentFilterDesign.fl1Jus_Center,
                                                styleContentFilterDesignV3.search
                                            ]}
                                        >
                                            <View
                                                style={[
                                                    stylesListPickerControl.formDate_To_From,
                                                    styles.styTouchListPicker
                                                ]}
                                            >
                                                <Text style={[styleSheets.text, { color: Colors.gray_7 }]}>
                                                    {translate('HRM_PortalApp_FilterChart_OrgStructureIDs')}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[
                                                styleContentFilterDesignV3.viewFilter,
                                                !isNaN(numberCountFilter) &&
                                                    numberCountFilter !== 0 && {
                                                    backgroundColor: Colors.blue_7
                                                }
                                            ]}
                                            onPress={() => this.refFilter && this.refFilter.nextScreenFilterAdv()}
                                        >
                                            <IconSliders
                                                size={Size.iconSize}
                                                color={
                                                    !isNaN(numberCountFilter) && numberCountFilter !== 0
                                                        ? Colors.white
                                                        : Colors.grey
                                                }
                                            />
                                            {!isNaN(numberCountFilter) && numberCountFilter !== 0 && (
                                                <View style={stylesVnrFilter.wrapNumberCountFilter}>
                                                    <Text
                                                        style={[
                                                            styleSheets.lable,
                                                            {
                                                                color: Colors.white
                                                            }
                                                        ]}
                                                    >
                                                        {numberCountFilter}
                                                    </Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </VnrFilterCommon>

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <ChWebViewChart
                                    detail={{
                                        screenName: chOrgDepartmentChart
                                    }}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    listFilterID={listFilterID}
                                    keyDataLocal={chOrgDepartmentChartKeyTask}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    valueField="ID"
                                />
                            )}
                        </View>

                        <View style={styles.styViewTreeControl}>
                            <VnrTreeView
                                {...OrgStructureIDs.control}
                                ref={(ref) => (this.refOrgStructureIDs = ref)}
                                layoutFilter={true}
                                value={OrgStructureIDs.value}
                                lable={'HRM_Filter_Chart_Org'}
                                onSelect={(listItem) => {
                                    this.setState(
                                        {
                                            OrgStructureIDs: {
                                                ...OrgStructureIDs,
                                                value: listItem
                                            }
                                        },
                                        () => {
                                            this.reload({ ...dataBody });
                                        }
                                    );
                                }}
                                refresh={OrgStructureIDs.refresh}
                            />
                        </View>
                    </View>
                )}
            </SafeAreaViewDetail>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

export default connect(mapStateToProps, null)(ChOrgDepartmentChart);

const styles = StyleSheet.create({
    styTouchListPicker: {
        width: '100%',
        alignItems: 'center'
    },
    styViewTreeControl: { position: 'absolute', top: -Size.deviceWidth }
});
