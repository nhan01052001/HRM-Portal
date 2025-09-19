import React, { Component } from 'react';
import { View, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { styleSheets, Colors, Size, styleSafeAreaView, CustomStyleSheet } from '../../../../constants/styleConfig';
import { connect } from 'react-redux';
import SafeAreaViewDetail from '../../../../components/safeAreaView/SafeAreaViewDetail';
import Vnr_Function from '../../../../utils/Vnr_Function';
import VnrText from '../../../../components/VnrText/VnrText';
import { IconSearch } from '../../../../constants/Icons';
import VnrTextInput from '../../../../componentsV3/VnrTextInput/VnrTextInput';
import { translate } from '../../../../i18n/translate';
import DrawerServices from '../../../../utils/DrawerServices';

const SCREEN_LIST = [
    {
        ID: Vnr_Function.MakeId(10),
        label: 'Cá nhân',
        icon: require('../../../../assets/images/personalManage/frame0.png'),
        ScreenName: 'TopTabPersonalInfoManage',
        keyTranslate: translate('HRM_PortalApp_HrePersonalInfoManage_Title'),
        keyPermission: 'New_Hre_ProfileManage_NewPortal_E_PROFILE_MANAGER_PERSONAL'
    },
    {
        ID: Vnr_Function.MakeId(10),
        label: 'Giấy tờ tùy thân',
        icon: require('../../../../assets/images/personalManage/frame1.png'),
        ScreenName: 'TopTabPersonalInfoProfileIdentification',
        keyTranslate: translate('HRM_PortalApp_HrePersonalInfoProfileIdentification'),
        keyPermission: 'New_Hre_ProfileManage_NewPortal_E_PROFILE_MANAGER_IDENTIFICATION'
    },
    {
        ID: Vnr_Function.MakeId(10),
        label: 'Liên hệ',
        icon: require('../../../../assets/images/personalManage/frame2.png'),
        ScreenName: 'TopTabInforContactManage',
        keyTranslate: translate('HRM_PortalApp_Contact'),
        keyPermission: 'New_Hre_ProfileManage_NewPortal_E_PROFILE_MANAGER_CONTACT'
    },
    {
        ID: Vnr_Function.MakeId(10),
        label: 'Quá trình làm việc',
        icon: require('../../../../assets/images/personalManage/frame3.png'),
        ScreenName: 'TopTabHreMovementHistory',
        keyTranslate: translate('HRM_PortalApp_HreMovementHistory'),
        keyPermission: 'New_Hre_ProfileManage_NewPortal_E_PROFILE_MANAGER_WORKHISTORY'
    },
    // {
    //     ID: Vnr_Function.MakeId(10),
    //     label: 'Lương & Phúc lợi',
    //     icon: require('../../../../assets/images/personalManage/frame4.png'),
    //     ScreenName: '',
    //     keyTranslate: translate(''),
    //     keyPermission: 'New_Hre_ProfileManage_NewPortal_E_PROFILE_MANAGER_SALARYBENEFIT',
    // },
    {
        ID: Vnr_Function.MakeId(10),
        label: 'Hợp đồng',
        icon: require('../../../../assets/images/personalManage/frame5.png'),
        ScreenName: 'TopTabContractManage',
        keyTranslate: translate('HRM_PortalApp_ContractHistory_Contract'),
        keyPermission: 'New_Hre_ProfileManage_NewPortal_E_PROFILE_MANAGER_CONTRACT'
    },
    {
        ID: Vnr_Function.MakeId(10),
        label: 'Hồ sơ bổ sung',
        icon: require('../../../../assets/images/personalManage/frame6.png'),
        ScreenName: 'TopTabDocumentManage',
        keyTranslate: translate('HRM_PortalApp_HreDocumentManage_Title'),
        keyPermission: 'New_Hre_ProfileManage_NewPortal_E_PROFILE_MANAGER_DOCUMENT'
    },
    {
        ID: Vnr_Function.MakeId(10),
        label: 'Bảo hiểm',
        icon: require('../../../../assets/images/personalManage/frame7.png'),
        ScreenName: 'TopTabInsuranceManage',
        keyTranslate: translate('HRM_PortalApp_Insurance'),
        keyPermission: 'New_Hre_ProfileManage_NewPortal_E_PROFILE_MANAGER_INSURANCE'
    },
    // {
    //     ID: Vnr_Function.MakeId(10),
    //     label: 'Chế độ nhân viên ',
    //     icon: require('../../../../assets/images/personalManage/frame8.png'),
    //     ScreenName: '',
    //     keyTranslate: translate(''),
    //     keyPermission: 'New_Hre_ProfileManage_NewPortal_E_PROFILE_MANAGER_REGIME',
    // },
    // {
    //     ID: Vnr_Function.MakeId(10),
    //     label: 'Thông tin tài khoản  ',
    //     icon: require('../../../../assets/images/personalManage/frame9.png'),
    //     selected: false,
    //     ScreenName: '',
    //     keyPermission: 'New_Hre_ProfileManage_NewPortal_E_PROFILE_MANAGER_SALARYACCOUNT',
    // },
    {
        ID: Vnr_Function.MakeId(10),
        label: 'Phép năm',
        icon: require('../../../../assets/images/personalManage/frame10.png'),
        ScreenName: 'TopTabAnnualManage',
        keyTranslate: translate('HRM_PortalApp_HreAnnualManage_Title'),
        keyPermission: 'New_Hre_ProfileManage_NewPortal_E_PROFILE_MANAGER_ANNUALLEAVE'
    },
    {
        ID: Vnr_Function.MakeId(10),
        label: 'Phép Bù',
        icon: require('../../../../assets/images/personalManage/frame10.png'),
        ScreenName: 'TopTabCompensationManage',
        keyTranslate: translate('HRM_PortalApp_HreCompensationManage_Title'),
        keyPermission: 'New_Hre_ProfileManage_NewPortal_E_PROFILE_MANAGER_COMPENSATIONLEAVE'
    },
    {
        ID: Vnr_Function.MakeId(10),
        label: 'Người thân',
        icon: require('../../../../assets/images/personalManage/frame14.png'),
        ScreenName: 'TopTabRelativeManage',
        keyTranslate: translate('HRM_PortalApp_HreRelativeManage_Title'),
        keyPermission: 'New_Hre_ProfileManage_NewPortal_E_PROFILE_MANAGER_RELATIVE'
    },
    // {
    //     ID: Vnr_Function.MakeId(10),
    //     label: 'Người phụ thuộc',
    //     icon: require('../../../../assets/images/personalManage/frame15.png'),
    //     ScreenName: '',
    //     keyTranslate: translate(''),
    //     keyPermission: 'New_Hre_ProfileManage_NewPortal_E_PROFILE_MANAGER_DEPENDANT',
    // },
    {
        ID: Vnr_Function.MakeId(10),
        label: 'Trình độ học vấn',
        icon: require('../../../../assets/images/personalManage/frame13.png'),
        ScreenName: 'TopTabEducationLevel',
        keyTranslate: translate('HRM_PortalApp_HreEducationLevel'),
        keyPermission: 'New_Hre_ProfileManage_NewPortal_E_PROFILE_MANAGER_ACADEMICLEVEL'
    },
    {
        ID: Vnr_Function.MakeId(10),
        label: 'Kinh nghiệm làm việc',
        icon: require('../../../../assets/images/personalManage/frame11.png'),
        ScreenName: 'TopTabCandidateHistory',
        keyTranslate: translate('HRM_PortalApp_HreCandidateHistory_Title'),
        keyPermission: 'New_Hre_ProfileManage_NewPortal_E_PROFILE_MANAGER_WORKEXPERIENCE'
    },
    {
        ID: Vnr_Function.MakeId(10),
        label: 'Kiêm nhiệm',
        icon: require('../../../../assets/images/personalManage/frame20.png'),
        ScreenName: 'TopTabConcurrentManage',
        keyTranslate: translate('HRM_PortalApp_Concurrent'),
        keyPermission: 'New_Hre_ProfileManage_NewPortal_E_PROFILE_MANAGER_CONCURREN'
    },
    {
        ID: Vnr_Function.MakeId(10),
        label: 'Dữ liệu thuế',
        icon: require('../../../../assets/images/personalManage/frame17.png'),
        ScreenName: 'TopTabTaxPayManage',
        keyTranslate: translate('HRM_PortalApp_TaxPay'),
        keyPermission: 'New_Hre_ProfileManage_NewPortal_E_PROFILE_MANAGER_TAXDATA'
    },
    {
        ID: Vnr_Function.MakeId(10),
        label: 'Đảng & Đoàn',
        icon: require('../../../../assets/images/personalManage/frame18.png'),
        ScreenName: 'TopTabPartyAndUnionManage',
        keyTranslate: translate('HRM_PortalApp_CommunistAndUnion'),
        keyPermission: 'New_Hre_ProfileManage_NewPortal_E_PROFILE_MANAGER_PARTYANDUNION'
    },
    {
        ID: Vnr_Function.MakeId(10),
        label: 'Khen thưởng',
        icon: require('../../../../assets/images/personalManage/frame19.png'),
        ScreenName: 'TopTabRewardManage',
        keyTranslate: translate('HRM_PortalApp_HreRewardManage_Title'),
        keyPermission: 'New_Hre_ProfileManage_NewPortal_E_PROFILE_MANAGER_REWARD'
    },
    {
        ID: Vnr_Function.MakeId(10),
        label: 'Kỷ luật',
        icon: require('../../../../assets/images/personalManage/frame21.png'),
        ScreenName: 'TopTabDisciplineManage',
        keyTranslate: translate('HRM_PortalApp_Discipline'),
        keyPermission: 'New_Hre_ProfileManage_NewPortal_E_PROFILE_MANAGER_DISCIPLINE'
    },
    {
        ID: Vnr_Function.MakeId(10),
        label: 'Tai nạn',
        icon: require('../../../../assets/images/personalManage/frame22.png'),
        ScreenName: 'TopTabAccidentManage',
        keyTranslate: translate('HRM_PortalApp_HreAccidentManage_Title'),
        keyPermission: 'New_Hre_ProfileManage_NewPortal_E_PROFILE_MANAGER_ACCIDENT'
    }
];

class HrePersonalManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            dataSource: []
        };
    }

    componentDidMount() {
        this.setState({ dataSource: [...SCREEN_LIST] });
    }

    onPressItemMenu = screenName => {
        if (screenName) DrawerServices.navigate(screenName);
    };

    changeSearchBar = text => {
        this.setState({ searchText: text }, () => {
            this.onFilter();
        });
    };

    onFilter = () => {
        const { searchText } = this.state;
        const dataFilter = [
            ...SCREEN_LIST.filter(
                item => item.keyTranslate && item.keyTranslate.toLowerCase().indexOf(searchText.toLowerCase()) > -1
            )
        ];
        this.setState({ dataSource: dataFilter });
    };

    renderItem = (item, index, lengthData) => {

        const title = item.keyTranslate != undefined ? item.keyTranslate : item.label,
            checkPermison = Vnr_Function.checkPermission(item.keyPermission);

        if (!checkPermison) return <View />;

        return (
            <TouchableOpacity
                style={[styles.BackgroundIcon, lengthData - 1 == index && CustomStyleSheet.borderBottomWidth(0)]}
                onPress={() => {
                    this.onPressItemMenu(item.ScreenName);
                    // updateTopNavigate({ ...nav });
                }}
            >
                <View style={styles.icon}>
                    <Image source={item.icon} style={styles.iconStyle} />
                </View>
                <View style={styles.viewLable}>
                    <VnrText numberOfLines={1} i18nKey={title} style={styles.lableStyle} />
                </View>
            </TouchableOpacity>
        );
    };

    render() {
        const { searchText, dataSource } = this.state;
        const lengthData = SCREEN_LIST.length;

        return (
            <SafeAreaViewDetail style={styleSafeAreaView.style}>
                <View style={[styleSheets.containerGrey]}>
                    <View style={styles.view_searchForFilter}>
                        <View style={[styles.search_inputForFilter]}>
                            <VnrTextInput
                                onClearText={() => this.changeSearchBar('')}
                                placeholder={translate('HRM_Common_Search')}
                                onChangeText={text => this.changeSearchBar(text)}
                                value={searchText}
                                returnKeyType="search"
                                onSubmitEditing={() => {}}
                                style={[styleSheets.text, styles.search_VnrTextInput]}
                                styleContent={CustomStyleSheet.borderBottomWidth(0)}
                            />

                            <View style={styles.iconSearch}>
                                <IconSearch size={Size.iconSize} color={Colors.gray_7} />
                            </View>
                        </View>
                    </View>

                    <FlatList
                        data={dataSource}
                        renderItem={({ item, index }) => this.renderItem(item, index, lengthData)}
                        keyExtractor={(item) => item.ID}
                    />
                </View>
            </SafeAreaViewDetail>
        );
    }
}

const mapStateToProps = () => {
    return {};
};

export default connect(
    mapStateToProps,
    null
)(HrePersonalManage);

const widthView = Size.deviceWidth;
const styles = StyleSheet.create({
    view_searchForFilter: {
        backgroundColor: Colors.white,
        paddingHorizontal: Size.defineSpace,
        paddingVertical: Size.defineHalfSpace
    },
    search_VnrTextInput: {
        height: '100%',
        fontSize: Size.text - 1
    },
    search_inputForFilter: {
        height: Size.heightInput,
        flexDirection: 'row',
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: Colors.gray_3
    },
    iconSearch: {
        marginLeft: 0,
        marginRight: Size.defineSpace
    },
    BackgroundIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5,
        paddingVertical: 12,
        backgroundColor: Colors.white,
        paddingHorizontal: Size.defineSpace
    },
    icon: {
        marginRight: Size.defineSpace
    },
    iconStyle: {
        minWidth: 25,
        maxWidth: 50,
        width: widthView * 0.07,
        height: widthView * 0.07,
        resizeMode: 'contain'
    },
    lableStyle: {
        fontSize: Size.text
    },
    viewLable: {
        flex: 1
    }
});
