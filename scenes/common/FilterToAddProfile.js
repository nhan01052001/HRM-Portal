/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import VnrListItem from '../../components/VnrListItem/VnrListItem';
import { styleSheets, Colors, styleSafeAreaView } from '../../constants/styleConfig';
import Icon from 'react-native-vector-icons/Ionicons';
import { ConfigList } from '../../assets/configProject/ConfigList';
import { ScreenName, EnumName } from '../../assets/constant';
import VnrFilterCommon from '../../components/VnrFilter/VnrFilterCommon';

let configList = null,
    enumName = null,
    hreFilterToAddProfile = null,
    filterToAddProfile = null,
    filterToAddProfileViewDetail = null;

export default class FilterToAddProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataBody: null,
            profiles: []
        };

        this.textFilterCommon = null;
        this.storeParamsDefault = null;
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 5, paddingLeft: 10 }}>
                    <Icon name={'md-close'} size={28} color={Colors.white} />
                </TouchableOpacity>
            )
        };
    };

    reload = () => {
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);
    };

    onFilterAdvance = data => {
        let paramsCommon = Object.keys(data)[0].split(','),
            valueCommon = data[paramsCommon];

        paramsCommon.forEach(param => {
            param = param.trim();
            data[param] = valueCommon;
        });

        let _dataBody = { ...this.state.dataBody, ...data };

        this.props.navigation.navigate(filterToAddProfile);

        this.setState({ dataBody: _dataBody });
    };

    onFilterCommon = () => {
        let { dataBody } = this.state,
            paramsCommon = dataBody.paramsCommon.split(',');

        paramsCommon.forEach(param => {
            dataBody[param] = this.textFilterCommon;
        });

        this.setState({ dataBody: { ...dataBody } });
    };

    onChangeFilterCommon = text => {
        this.textFilterCommon = text;
    };

    paramsDefault = () => {
        const _configList = configList[hreFilterToAddProfile],
            renderRow = _configList[enumName.E_Row],
            orderBy = _configList[enumName.E_Order],
            _valueFilter = this.props.navigation.state.params ? this.props.navigation.state.params.valueFilter : null;

        let _params = {
                sort: orderBy
            },
            toObj = null;

        if (
            _valueFilter &&
            typeof _valueFilter === enumName.E_object &&
            Object.prototype.hasOwnProperty.call(_valueFilter, 'OrgStructureID')
        ) {
            const _value = _valueFilter['OrgStructureID'],
                arrOrgID = _value.map(item => item.OrderNumber);

            if (arrOrgID && Array.isArray(arrOrgID)) {
                toObj = { OrgStructureID: arrOrgID.join() };
            }
        }

        if (toObj) {
            _params = {
                ..._params,
                ...toObj
            };
        }

        return {
            renderRow,
            dataBody: _params
        };
    };

    componentDidMount() {
        configList = ConfigList.value;
        enumName = EnumName;
        filterToAddProfile = ScreenName.FilterToAddProfile;
        hreFilterToAddProfile = ScreenName.HreFilterToAddProfile;
        filterToAddProfileViewDetail = ScreenName.FilterToAddProfileViewDetail;
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);
    }

    businessAddMoreProfiles = items => {
        let { addMoreProfiles } = this.props.navigation.state.params;
        addMoreProfiles(items);
    };

    render() {
        const { dataBody, renderRow } = this.state,
            _valueFilter = this.props.navigation.state.params ? this.props.navigation.state.params.valueFilter : null;

        let _value = [];
        if (_valueFilter && enumName && typeof _valueFilter === enumName.E_object) {
            _value = [{ ..._valueFilter }];
        }

        return (
            <SafeAreaView {...styleSafeAreaView}>
                {hreFilterToAddProfile && filterToAddProfileViewDetail && (
                    <View style={[styleSheets.container]}>
                        <VnrFilterCommon
                            value={_value}
                            screenName={hreFilterToAddProfile}
                            onSubmitEditing={this.reload}
                        />

                        <View style={[styleSheets.col_10]}>
                            {dataBody && (
                                <VnrListItem
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: filterToAddProfileViewDetail,
                                        screenName: hreFilterToAddProfile
                                    }}
                                    rowActions={[]}
                                    selected={[
                                        {
                                            title: 'Add profiles',
                                            Type: 'E_ORTHER_ACTION',
                                            isSheet: false,
                                            onPress: items => this.businessAddMoreProfiles(items)
                                        }
                                    ]}
                                    api={{
                                        urlApi: '[URI_HR]/Hre_GetData/GetProfileForDetail',
                                        type: enumName.E_POST,
                                        dataBody: dataBody,
                                        pageSize: 20
                                    }}
                                    valueField="ID"
                                    // headerConfig={{
                                    //     ProfileID: "98697a85-dee0-49eb-8ae7-8dcca846b0ec",
                                    //     sysuserid: "98697a85-dee0-49eb-8ae7-8dcca846b0ec",
                                    //     userid: "c91f2cec-ce99-4a7e-bd2e-af85c996c7bf",
                                    //     userlogin: "hanh.nguyen"
                                    // }}
                                    renderConfig={renderRow}
                                />
                            )}
                        </View>
                    </View>
                )}
            </SafeAreaView>
        );
    }
}
