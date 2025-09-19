import React, { Component } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import VnrText from '../../../../../components/VnrText/VnrText';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import {
    Colors,
    styleSheets,
    styleProfileInfo,
    styleSafeAreaView,
    styleScreenDetail,
    stylesScreenDetailV2,
    Size,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import format from 'number-format.js';
import moment from 'moment';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { EnumName, EnumTask } from '../../../../../assets/constant';
import { getDataLocal } from '../../../../../factories/LocalData';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import { startTask } from '../../../../../factories/BackGroundTask';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import { translate } from '../../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import DrawerServices from '../../../../../utils/DrawerServices';
import { VnrBtnEdit } from '../../../../../componentsV3/VnrBtnCreate/VnrBtnEdit';
import Vnr_Function from '../../../../../utils/Vnr_Function';

class TopTabProfileContactInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: {},
            isLoading: true,
            refreshing: false,
            keyQuery: EnumName.E_PRIMARY_DATA
        };
        props.navigation.setParams({
            reload: this.pullToReFresh
        });
    }

    renderItemView = item => {
        const { dataSource } = this.state,
            { profile, dataWaitingApprove } = dataSource,
            { containerItemDetail } = styleScreenDetail,
            { itemContent, textLableGroup } = styleProfileInfo,
            stylesDetailV2 = stylesScreenDetailV2;

        if (item['Name'] == 'E_Group') {
            return (
                <View
                    style={[
                        stylesDetailV2.styItemContentGroup,
                        {
                            paddingHorizontal: Size.defineSpace
                        }
                    ]}
                >
                    <View style={styleSheets.viewLable}>
                        <VnrText style={[styleSheets.text, textLableGroup]} i18nKey={item['DisplayKey']} />
                    </View>
                </View>
            );
        } else if (item['Name'] == 'FileAttach') {
            let _fieldValue = item['FieldNameAttach'],
                _fieldName = item['fieldName'] ? item['fieldName'] : item['FieldName'],
                _value = profile[_fieldValue],
                isChange = dataWaitingApprove.indexOf(_fieldName) > -1,
                colorTextWaiting = isChange ? { color: Colors.orange } : {};

            if (!_value) _value = [];
            return (
                <View style={itemContent}>
                    <View style={styleSheets.viewLable}>
                        <VnrText
                            style={[styleSheets.lable, stylesDetailV2.styTextLableInfo]}
                            i18nKey={item['DisplayKey']}
                        />
                    </View>
                    <View style={CustomStyleSheet.flex(1)}>
                        {_value && Array.isArray(_value) && _value.length > 0 ? (
                            Vnr_Function.formatStringTypeV3(profile, {
                                TypeView: 'E_FILEATTACH',
                                Name: _fieldValue,
                                DisplayKey: '',
                                DataType: 'FileAttach'
                            })
                        ) : (
                            <VnrText
                                style={[styleSheets.text, stylesDetailV2.styTextValueInfo, colorTextWaiting]}
                                value={isChange ? translate('HRM_Common_Waitting') : ''}
                            />
                        )}
                    </View>
                </View>
            );
        } else {
            let _field = item['Name'],
                _value = profile[_field],
                _fieldName = item['Control']['fieldName'],
                isChange = dataWaitingApprove.indexOf(_fieldName) > -1,
                colorTextWaiting = isChange ? { color: Colors.orange } : {};

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
                <View style={containerItemDetail}>
                    <View style={stylesDetailV2.styItemContent}>
                        <View style={stylesDetailV2.viewLable}>
                            <VnrText
                                style={[styleSheets.lable, stylesDetailV2.styTextLableInfo]}
                                i18nKey={item['DisplayKey']}
                            />
                        </View>
                        <View style={stylesDetailV2.styViewValue}>
                            <VnrText
                                style={[styleSheets.text, stylesDetailV2.styTextValueInfo, colorTextWaiting]}
                                value={_value ? _value : isChange ? translate('HRM_Common_Waitting') : ''}
                            />
                        </View>
                    </View>
                </View>
            );
        }
    };

    remoteData = () => {
        const { keyQuery } = this.state;
        getDataLocal(EnumTask.KT_GeneralInfomation)
            .then(resData => {
                const res = resData && resData[keyQuery] ? resData[keyQuery] : null;

                if (res && res !== EnumName.E_EMPTYDATA) {
                    const profile = { ...res[0] };
                    const data = {
                        profile: { ...res[0] },
                        dataWaitingApprove: [...res[1]]
                    };

                    let _imagePath =
                        profile && profile.ImagePath
                            ? profile.ImagePath.replace('[URI_MAIN]', dataVnrStorage.apiConfig.uriMain)
                            : '';

                    // Đồng bộ avatar khi vào Lại hồ sơ cá nhân.
                    if (_imagePath) dataVnrStorage.currentUser.info.ImagePath = _imagePath;

                    this.setState({
                        dataSource: data,
                        isLoading: false,
                        refreshing: false
                    });
                } else if (res === EnumName.E_EMPTYDATA) {
                    this.setState({
                        dataSource: EnumName.E_EMPTYDATA,
                        isLoading: false,
                        refreshing: false
                    });
                }
            })
            .catch(error => {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            });
    };

    pullToReFresh = () => {
        this.setState(
            {
                refreshing: true,
                keyQuery: EnumName.E_PRIMARY_DATA
            },
            () => {
                startTask({
                    keyTask: EnumTask.KT_GeneralInfomation,
                    payload: {
                        keyQuery: EnumName.E_PRIMARY_DATA,
                        reload: this.remoteData,
                        isCompare: true
                    }
                });
            }
        );
    };

    componentDidMount() {
        this.remoteData();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;
        if (nextProps.reloadScreenName == EnumTask.KT_GeneralInfomation) {
            //khi màn hình đang reload thì messsage phải là filter thì màn hình mới reload
            if (nextProps.message && keyQuery == nextProps.message.keyQuery) {

                if (nextProps.message.dataChange) {
                    this.remoteData({ isLazyLoading: true });
                } else {
                    this.setState({
                        isLoading: false,
                        refreshing: false
                    });
                }
            }
        }
    }

    render() {
        const { isLoading, dataSource, refreshing } = this.state;
        let contentList = <View />;
        let listConfigPersonalAll = [];

        if (ConfigList.value['GeneralInfoHreProfileContactInfo']) {
            listConfigPersonalAll = ConfigList.value['GeneralInfoHreProfileContactInfo'];
        }

        if (isLoading) {
            contentList = <VnrLoading size="large" isVisible={isLoading} />;
        } else if (dataSource == EnumName.E_EMPTYDATA || Object.keys(dataSource).length == 0) {
            contentList = <EmptyData messageEmptyData={'EmptyData'} />;
        } else if (dataSource && Object.keys(dataSource).length > 0) {
            contentList = (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={listConfigPersonalAll}
                    renderItem={({ item }) => this.renderItemView(item)}
                    keyExtractor={(item, index) => index}
                    refreshControl={
                        <RefreshControl
                            onRefresh={() => this.pullToReFresh()}
                            refreshing={refreshing}
                            size="large"
                            tintColor={Colors.primary}
                        />
                    }
                />
            );
        }

        return (
            <SafeAreaView {...styleSafeAreaView}>
                {contentList}

                {PermissionForAppMobile &&
                    PermissionForAppMobile.value['Personal_GeneralProfileDetail_btnUpdateBasic_Portal'] &&
                    PermissionForAppMobile.value['Personal_GeneralProfileDetail_btnUpdateBasic_Portal']['View'] && (
                    <VnrBtnEdit
                        onAction={() => {
                            DrawerServices.navigate('TopTabProfileContactInfoUpdate', {
                                reload: this.pullToReFresh
                            });
                        }}
                    />
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

const mapDispatchToProps = () => {
    return {};
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopTabProfileContactInfo);
