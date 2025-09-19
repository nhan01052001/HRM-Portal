/* eslint-disable react-native/no-unused-styles */
import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Colors, Size, styleSheets, styleSafeAreaView, styleScreenDetail } from '../../../constants/styleConfig';
import { IconMinus } from '../../../constants/Icons';
import { connect } from 'react-redux';
import generalProfileInfo from '../../../redux/generalProfileInfo';
import VnrLoading from '../../../components/VnrLoading/VnrLoading';
import VnrIndeterminate from '../../../components/VnrLoading/VnrIndeterminate';
import { SafeAreaView } from 'react-navigation';
import { dataVnrStorage } from '../../../assets/auth/authentication';
import { PermissionForAppMobile } from '../../../assets/configProject/PermissionForAppMobile';
import VnrText from '../../../components/VnrText/VnrText';
import moment from 'moment';
import format from 'number-format.js';
import DrawerServices from '../../../utils/DrawerServices';
import ContractComponent from './profileInfo/contract/ContractComponent';
import InsuranceComponent from './gradeInfo/insurance/InsuranceComponent';
import DependantComponent from './profileInfo/dependant/DependantComponent';
import RelativeComponent from './profileInfo/relative/RelativeComponent';
import LanguageLevelComponent from './profileInfo/languageLevel/LanguageLevelComponent';
import WorkingExperienceComponent from './profileInfo/workingExperience/WorkingExperienceComponent';
import QualificationComponent from './profileInfo/qualification/QualificationComponent';
import ComputerLevelComponent from './profileInfo/computerLevel/ComputerLevelComponent';
import BankAccountComponent from './profileInfo/bankAccount/BankAccountComponent';
import HouseholdComponent from './profileInfo/household/HouseholdComponent';
import AppendixContractComponent from './profileInfo/appendixContract/AppendixContractComponent';
import BasicSalaryDetailComponent from './salInfo/basicSalaryDetail/BasicSalaryDetailComponent';
import TaxInfoComponent from './profileInfo/taxInfo/TaxInfoComponent';
import { EnumName, EnumTask } from '../../../assets/constant';
import { getDataLocal } from '../../../factories/LocalData';
import { startTask } from '../../../factories/BackGroundTask';
import EmptyData from '../../../components/EmptyData/EmptyData';
import { ConfigField } from '../../../assets/configProject/ConfigField';
import PartyUnionComponent from './profileInfo/PartyUnion/PartyUnionComponent';
import WorkPermitComponent from './profileInfo/workPermit/WorkPermitComponent';
import ResidenceCardComponent from './profileInfo/residenceCard/ResidenceCardComponent';
import ContractV3Component from './profileInfo/contractV3/ContractV3Component';
import ProfileAdditonComponent from './profileInfo/profileAddition/ProfileAdditonComponent';
import GradeComponent from './gradeInfo/GradeComponent';
import VisaComponent from './profileInfo/visa/VisaComponent';
import LoanComponent from './profileInfo/loan/LoanComponent';
import PassportComponent from './profileInfo/passport/PassportComponent';

class GeneralInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: {},
            isLoading: true,
            isLoadingHeader: true,
            refreshing: false,
            keyQuery: EnumName.E_PRIMARY_DATA
        };
    }

    remoteData = (param = {}) => {
        const { keyQuery } = this.state,
            { isLazyLoading } = param;
        getDataLocal(EnumTask.KT_GeneralInfomation)
            .then((resData) => {
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

                    this.props.setProfileInfo(data);

                    this.setState({
                        dataSource: data,
                        isLoading: false,
                        refreshing: false,
                        isLoadingHeader: isLazyLoading ? false : true
                    });
                } else if (res === EnumName.E_EMPTYDATA) {
                    this.setState({
                        dataSource: EnumName.E_EMPTYDATA,
                        isLoading: false,
                        refreshing: false,
                        isLoadingHeader: isLazyLoading ? false : true
                    });
                }
            })
            .catch((error) => {
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

    _renderHeaderLoading = () => {
        return <VnrIndeterminate isVisible={this.state.isLoading == false && this.state.isLoadingHeader} />;
    };

    componentDidMount() {
        this.remoteData();
        startTask({
            keyTask: EnumTask.KT_GeneralInfomation,
            payload: {
                keyQuery: EnumName.E_PRIMARY_DATA,
                reload: this.reload,
                isCompare: true
            }
        });
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
                        isLoadingHeader: false,
                        isLoading: false,
                        refreshing: false
                    });
                }
            }
        }
    }

    initLableValue = (data, item) => {
        const { textValueInfo, textLableInfo } = styleScreenDetail;
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
                <VnrText style={[styleSheets.lable, textLableInfo]} i18nKey={item['DisplayKey']} />

                {_value != '' ? (
                    <VnrText style={[styleSheets.text, textValueInfo]} value={_value} />
                ) : (
                    <IconMinus size={Size.iconSize} color={Colors.gray_5} />
                )}
            </View>
        );
    };

    checkIsShow = (field) => {
        let _configField =
            ConfigField && ConfigField.value['GeneralInfo'] ? ConfigField.value['GeneralInfo']['Hidden'] : [];
        return _configField.findIndex((key) => key == field) > -1 ? false : true;
    };

    renderInfo = (dataSource) => {
        const generalProfileInfo = dataSource;
        if (generalProfileInfo && generalProfileInfo.profile) {
            const { profile } = generalProfileInfo;
            let _imagePath = profile.ImagePath
                ? profile.ImagePath.replace('[URI_MAIN]', dataVnrStorage.apiConfig.uriMain)
                : '';

            let isShowOrgStructureName = this.checkIsShow('OrgStructureName'),
                isShowDateHire = this.checkIsShow('DateHire'),
                isShowSalaryClassName = this.checkIsShow('SalaryClassName'),
                isShowJobTitleName = this.checkIsShow('JobTitleName'),
                isShowPositionName = this.checkIsShow('PositionName'),
                isShowCodeEmpClient = this.checkIsShow('CodeEmpClient'),
                isShowDateOfBirth = this.checkIsShow('DateOfBirth'),
                isShowGenderView = this.checkIsShow('GenderView'),
                isShowEthnicGroupName = this.checkIsShow('EthnicGroupName'),
                isShowNationalityName = this.checkIsShow('NationalityName'),
                isShowEmail = this.checkIsShow('Email'),
                isShowCellphone = this.checkIsShow('Cellphone'),
                isShowEmail2 = this.checkIsShow('Email2'),
                isShowHomePhone = this.checkIsShow('HomePhone'),
                isShowNoPassport = this.checkIsShow('NoPassport'),
                isShowDatePassport = this.checkIsShow('DatePassport'),
                isShowDateExpirationPassport = this.checkIsShow('DateExpirationPassport'),
                isShowPlacePassport = this.checkIsShow('PlacePassport');

            return (
                <View style={styles.container}>
                    {/* avatar */}
                    <View style={styles.styBlockAvatar}>
                        <View style={styles.styAvatar}>
                            <Image source={{ uri: _imagePath }} style={styles.styAvatarImg} resizeMode={'cover'} />
                        </View>

                        {/* tên - mã */}
                        <View style={styles.styViewFullName}>
                            <Text style={[styleSheets.lable, styles.styTextFullName]}>{profile.ProfileName}</Text>
                            <Text style={[styleSheets.lable, styles.styTextCode, {}]}>{profile.CodeEmp}</Text>
                        </View>

                        {isShowOrgStructureName && (
                            <View style={[styles.styCategory, styles.styCategoryAvatar]}>
                                <Text style={[styleSheets.text, styles.styTextTar]}>
                                    {profile.OrgStructureName ? profile.OrgStructureName : ''}
                                </Text>
                            </View>
                        )}
                    </View>
                    {/* Cơ bản */}
                    <View style={styles.styBlock}>
                        <View style={styles.styTopTitle}>
                            <View style={styles.styWrap}>
                                <VnrText
                                    style={[styleSheets.lable, styles.styTitle]}
                                    i18nKey={'HRM_HR_Profile_Basic'}
                                    numberOfLines={1}
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.styWrapRight}
                                onPress={() => DrawerServices.navigate('TopTabProfileBasicInfo')}
                            >
                                <VnrText
                                    style={[styleSheets.text, styles.styTextDetail]}
                                    i18nKey={'HRM_Common_ViewMore'}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Ngày vào làm */}
                        <View style={styles.styViewData}>
                            {isShowDateHire &&
                                this.initLableValue(profile, {
                                    Name: 'DateHire',
                                    DisplayKey: 'HRM_HR_Profile_DateHire',
                                    DataType: 'DateTime',
                                    DataFormat: 'DD/MM/YYYY'
                                })}

                            {isShowSalaryClassName &&
                                profile.SalaryClassName != null &&
                                this.initLableValue(profile, {
                                    Name: 'SalaryClassName',
                                    DisplayKey: 'HRM_HR_Profile_SalaryClassName',
                                    DataType: 'string'
                                })}

                            {isShowJobTitleName &&
                                this.initLableValue(profile, {
                                    Name: 'JobTitleName',
                                    DisplayKey: 'HRM_HR_Profile_JobTitleName',
                                    DataType: 'string'
                                })}

                            {isShowPositionName &&
                                this.initLableValue(profile, {
                                    Name: 'PositionName',
                                    DisplayKey: 'HRM_HR_Contract_PositionID',
                                    DataType: 'string'
                                })}

                            {isShowCodeEmpClient &&
                                this.initLableValue(profile, {
                                    Name: 'CodeEmpClient',
                                    DisplayKey: 'HRM_HR_ProfileTemp_CodeEmpClient',
                                    DataType: 'string'
                                })}
                        </View>
                    </View>
                    {/* Cá nhân */}
                    <View style={styles.styBlock}>
                        <View style={styles.styTopTitle}>
                            <View style={styles.styWrap}>
                                <VnrText
                                    style={[styleSheets.lable, styles.styTitle]}
                                    i18nKey={'HRM_HR_Profile_PersonalInfo'}
                                    numberOfLines={1}
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.styWrapRight}
                                onPress={() => DrawerServices.navigate('TopTabProfilePersonalInfo')}
                            >
                                <VnrText
                                    style={[styleSheets.text, styles.styTextDetail]}
                                    i18nKey={'HRM_Common_ViewMore'}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.styViewData}>
                            {/* {Name: "ProfileName", DisplayKey: "HRM_HR_Profile_ProfileName", DataType: "string" */}
                            {isShowDateOfBirth &&
                                this.initLableValue(profile, {
                                    Name: 'DateOfBirth',
                                    DisplayKey: 'HRM_HR_Profile_DayOfBirth',
                                    DataType: 'DateTime',
                                    DataFormat: 'DD/MM/YYYY'
                                })}

                            {isShowGenderView &&
                                this.initLableValue(profile, {
                                    Name: 'GenderView',
                                    DisplayKey: 'HRM_HR_Profile_Gender',
                                    DataType: 'string'
                                })}

                            {isShowEthnicGroupName &&
                                this.initLableValue(profile, {
                                    Name: 'EthnicGroupName',
                                    DisplayKey: 'HRM_HR_Profile_EthnicID',
                                    DataType: 'string'
                                })}

                            {isShowNationalityName &&
                                this.initLableValue(profile, {
                                    Name: 'NationalityName',
                                    DisplayKey: 'HRM_HR_Profile_NationalityID',
                                    DataType: 'string'
                                })}
                        </View>
                    </View>
                    {/* Liên hệ */}
                    <View style={styles.styBlock}>
                        <View style={styles.styTopTitle}>
                            <View style={styles.styWrap}>
                                <VnrText
                                    style={[styleSheets.lable, styles.styTitle]}
                                    i18nKey={'HRM_HR_Profile_ContactInfo'}
                                    numberOfLines={1}
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.styWrapRight}
                                onPress={() => DrawerServices.navigate('TopTabProfileContactInfo')}
                            >
                                <VnrText
                                    style={[styleSheets.text, styles.styTextDetail]}
                                    i18nKey={'HRM_Common_ViewMore'}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.styViewData}>
                            {isShowEmail &&
                                this.initLableValue(profile, {
                                    Name: 'Email',
                                    DisplayKey: 'Email',
                                    DataType: 'string'
                                })}

                            {isShowCellphone &&
                                this.initLableValue(profile, {
                                    Name: 'Cellphone',
                                    DisplayKey: 'Cellphone',
                                    DataType: 'string'
                                })}

                            {isShowEmail2 &&
                                profile.Email2 != null &&
                                this.initLableValue(profile, {
                                    Name: 'Email2',
                                    DisplayKey: 'HRM_HR_Profile_Email2',
                                    DataType: 'stirng'
                                })}

                            {isShowHomePhone &&
                                profile.HomePhone != null &&
                                this.initLableValue(profile, {
                                    Name: 'HomePhone',
                                    DisplayKey: 'HRM_HR_Profile_HomePhone',
                                    DataType: 'string'
                                })}
                        </View>
                    </View>

                    {/* Thông tin Đảng Đoàn */}
                    {PermissionForAppMobile &&
                        PermissionForAppMobile.value['New_Personal_New_PartyUnion_Portal'] &&
                        PermissionForAppMobile.value['New_Personal_New_PartyUnion_Portal']['View'] && (
                        <PartyUnionComponent styles={styles} initLableValue={this.initLableValue} />
                    )}

                    {/* Hộ chiếu */}
                    {PermissionForAppMobile &&
                        PermissionForAppMobile.value['HR_Passport_Portal'] &&
                        PermissionForAppMobile.value['HR_Passport_Portal']['View'] && (
                        <PassportComponent styles={styles} initLableValue={this.initLableValue} />
                    )}

                    {/* Visa */}
                    {PermissionForAppMobile &&
                        PermissionForAppMobile.value['Hre_VisaInfo_Index'] &&
                        PermissionForAppMobile.value['Hre_VisaInfo_Index']['View'] && (
                        <VisaComponent styles={styles} initLableValue={this.initLableValue} />
                    )}

                    {/* Giấy phép lao động*/}
                    {PermissionForAppMobile &&
                        PermissionForAppMobile.value['Hre_WorkPermit_Index'] &&
                        PermissionForAppMobile.value['Hre_WorkPermit_Index']['View'] && (
                        <WorkPermitComponent styles={styles} initLableValue={this.initLableValue} />
                    )}

                    {/* Thẻ cư trú */}
                    {PermissionForAppMobile &&
                        PermissionForAppMobile.value['HR_ResidenceCardDetail_Portal'] &&
                        PermissionForAppMobile.value['HR_ResidenceCardDetail_Portal']['View'] && (
                        <ResidenceCardComponent styles={styles} initLableValue={this.initLableValue} />
                    )}

                    {/* Tài khoản ngân hàng */}
                    {PermissionForAppMobile &&
                        PermissionForAppMobile.value['HR_BankAccount_Portal'] &&
                        PermissionForAppMobile.value['HR_BankAccount_Portal']['View'] && (
                        <BankAccountComponent styles={styles} initLableValue={this.initLableValue} />
                    )}
                    {/* Hợp đồng */}
                    {PermissionForAppMobile &&
                        PermissionForAppMobile.value['New_Personal_New_Contract_Portal'] &&
                        PermissionForAppMobile.value['New_Personal_New_Contract_Portal']['View'] && (
                        <ContractComponent styles={styles} initLableValue={this.initLableValue} />
                    )}

                    {/* Hợp đồng V3 */}
                    {PermissionForAppMobile &&
                        PermissionForAppMobile.value['HR_Profile_App_Contract_Index'] &&
                        PermissionForAppMobile.value['HR_Profile_App_Contract_Index']['View'] && (
                        <ContractV3Component styles={styles} initLableValue={this.initLableValue} />
                    )}

                    {/* Phụ lục hợp đồng */}
                    {PermissionForAppMobile &&
                        PermissionForAppMobile.value['HR_AppendixContractDetail_Portal'] &&
                        PermissionForAppMobile.value['HR_AppendixContractDetail_Portal']['View'] && (
                        <AppendixContractComponent styles={styles} initLableValue={this.initLableValue} />
                    )}

                    {/* Lương cơ bản */}
                    {PermissionForAppMobile &&
                        PermissionForAppMobile.value['New_Personal_New_BasicSalaryDetail_Portal'] &&
                        PermissionForAppMobile.value['New_Personal_New_BasicSalaryDetail_Portal']['View'] && (
                        <BasicSalaryDetailComponent styles={styles} initLableValue={this.initLableValue} />
                    )}

                    {/* Trình độ chuyên môn */}
                    {PermissionForAppMobile &&
                        PermissionForAppMobile.value['New_QualificationInfo_New_Index'] &&
                        PermissionForAppMobile.value['New_QualificationInfo_New_Index']['View'] && (
                        <QualificationComponent styles={styles} initLableValue={this.initLableValue} />
                    )}

                    {/* Người thân */}
                    {PermissionForAppMobile &&
                        PermissionForAppMobile.value['Personal_Relative'] &&
                        PermissionForAppMobile.value['Personal_Relative']['View'] && (
                        <RelativeComponent styles={styles} initLableValue={this.initLableValue} />
                    )}

                    {/* Người phụ thuộc */}
                    {PermissionForAppMobile &&
                        PermissionForAppMobile.value['HR_Dependant_Portal'] &&
                        PermissionForAppMobile.value['HR_Dependant_Portal']['View'] && (
                        <DependantComponent styles={styles} initLableValue={this.initLableValue} />
                    )}

                    {/* Hộ khẩu */}
                    {PermissionForAppMobile &&
                        PermissionForAppMobile.value['HR_HouseholdInfo_Portal'] &&
                        PermissionForAppMobile.value['HR_HouseholdInfo_Portal']['View'] &&
                        PermissionForAppMobile &&
                        PermissionForAppMobile.value['HouseholdInfo_Index_HouseholdInfoGird'] &&
                        PermissionForAppMobile.value['HouseholdInfo_Index_HouseholdInfoGird']['View'] && (
                        <HouseholdComponent styles={styles} initLableValue={this.initLableValue} />
                    )}

                    {/* Bảo hiểm */}
                    {PermissionForAppMobile &&
                        PermissionForAppMobile.value['New_Personal_Insurance'] &&
                        PermissionForAppMobile.value['New_Personal_Insurance']['View'] && (
                        <InsuranceComponent styles={styles} initLableValue={this.initLableValue} />
                    )}

                    {/* Chế độ */}
                    {
                        (PermissionForAppMobile && PermissionForAppMobile.value['New_Ins_Grade_New_Index_Portal']
                            && PermissionForAppMobile.value['New_Ins_Grade_New_Index_Portal']['View']) && (
                            <GradeComponent
                                styles={styles}
                                initLableValue={this.initLableValue}
                            />
                        )
                    }

                    {/* Ds trình độ ngoại ngữ */}
                    {PermissionForAppMobile &&
                        PermissionForAppMobile.value['HR_ProfileLanguageLevel_Portal'] &&
                        PermissionForAppMobile.value['HR_ProfileLanguageLevel_Portal']['View'] && (
                        <LanguageLevelComponent styles={styles} initLableValue={this.initLableValue} />
                    )}

                    {/* Trình độ tin học */}
                    {PermissionForAppMobile &&
                        PermissionForAppMobile.value['HR_ComputerLevel_Portal'] &&
                        PermissionForAppMobile.value['HR_ComputerLevel_Portal']['View'] && (
                        <ComputerLevelComponent styles={styles} initLableValue={this.initLableValue} />
                    )}

                    {/* Kinh nghiệm làm việc */}
                    {PermissionForAppMobile &&
                        PermissionForAppMobile.value['HR_WorkingExperience_Portal'] &&
                        PermissionForAppMobile.value['HR_WorkingExperience_Portal']['View'] && (
                        <WorkingExperienceComponent styles={styles} initLableValue={this.initLableValue} />
                    )}

                    {/* Thông tin thuế */}
                    {PermissionForAppMobile &&
                        PermissionForAppMobile.value['New_Sal_TaxInformationRegister_New_Index_Portal'] &&
                        PermissionForAppMobile.value['New_Sal_TaxInformationRegister_New_Index_Portal']['View'] && (
                        <TaxInfoComponent styles={styles} initLableValue={this.initLableValue} />
                    )}

                    {/* Thông tin thuế */}
                    {PermissionForAppMobile &&
                        PermissionForAppMobile.value['New_Hre_New_WorkHistory_App'] &&
                        PermissionForAppMobile.value['New_Hre_New_WorkHistory_App']['View'] && (
                        <View style={styles.styBlock}>
                            <View style={styles.styTopTitle}>
                                <View style={styles.styWrap}>
                                    <VnrText
                                        style={[styleSheets.lable, styles.styTitle]}
                                        i18nKey={'HRM_PortalApp_AchievementsContributions'}
                                    />
                                </View>
                                <TouchableOpacity
                                    onPress={() => DrawerServices.navigate('HreWorkHistorySubmit')}
                                    style={styles.styWrapRight}
                                >
                                    <VnrText
                                        style={[styleSheets.text, styles.styTextDetail]}
                                        i18nKey={'HRM_Common_ViewMore'}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {/* Vay vốn */}
                    {
                        (PermissionForAppMobile && PermissionForAppMobile.value['Sal_LoanInformation_Index']
                            && PermissionForAppMobile.value['Sal_LoanInformation_Index']['View']) && (
                            <LoanComponent
                                styles={styles}
                                initLableValue={this.initLableValue}
                            />
                        )
                    }
                </View>
            );
        } else {
            return <View />;
        }
    };

    render() {
        const { isLoading, dataSource, refreshing } = this.state;
        let contentList = <View />;

        if (isLoading) {
            contentList = <VnrLoading size="large" isVisible={isLoading} />;
        } else if (dataSource == EnumName.E_EMPTYDATA || Object.keys(dataSource).length == 0) {
            contentList = <EmptyData messageEmptyData={'EmptyData'} />;
        } else if (dataSource && Object.keys(dataSource).length > 0) {
            contentList = (
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            onRefresh={() => this.pullToReFresh()}
                            refreshing={refreshing}
                            size="large"
                            tintColor={Colors.primary}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                >
                    {this.renderInfo(dataSource)}
                </ScrollView>
            );
        }
        return (
            <SafeAreaView {...styleSafeAreaView}>
                {this._renderHeaderLoading()}
                {contentList}
                {/* Bổ sung hồ sơ yêu cầu */}
                {
                    (PermissionForAppMobile && PermissionForAppMobile.value['New_PortalV3_ProfileAddition']
                        && PermissionForAppMobile.value['New_PortalV3_ProfileAddition']['View']) && (
                        <ProfileAdditonComponent />
                    )
                }
            </SafeAreaView>
        );
    }
}

const SIZE_AVATAR = Size.deviceWidth * 0.28;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: Size.defineSpace
    },
    styBlockAvatar: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: Size.defineSpace
        // backgroundColor: 'red'
    },
    styBlock: {
        width: Size.deviceWidth - Size.defineSpace * 2,
        // width: '100%',
        paddingVertical: Size.defineSpace,
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5
    },
    styAvatar: {
        width: SIZE_AVATAR,
        height: SIZE_AVATAR,
        borderRadius: SIZE_AVATAR / 2
    },
    styAvatarImg: {
        width: SIZE_AVATAR,
        height: SIZE_AVATAR,
        borderRadius: SIZE_AVATAR / 2,
        backgroundColor: Colors.gray_3
    },
    styViewFullName: {
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
        flexDirection: 'column',
        width: '100%'
        // flexWrap: 'wrap'
    },
    styTextFullName: {
        fontSize: Size.text + 5,
        fontWeight: 'bold',
        marginRight: 5,
        textAlign: 'center'
    },
    styTextCode: {
        fontSize: Size.text + 2,
        fontWeight: 'normal',
        marginRight: 5,
        textAlign: 'center',
        color: Colors.gray_8
    },
    styCategory: {
        borderRadius: 4,
        flexDirection: 'row',
        paddingTop: 3.5,
        paddingBottom: 2,
        paddingHorizontal: Size.defineSpace,
        marginVertical: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    styCategoryAvatar: {
        maxWidth: Size.deviceWidth - Size.defineSpace * 2,
        flexWrap: 'wrap'
    },
    styTextTar: {
        color: Colors.black,
        fontWeight: '500',
        textAlign: 'center'
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
        fontSize: Size.text + 4
        // fontWeight: Platform.OS == 'android' ? '700' : '500',
    },
    styTextDetail: {
        fontWeight: '500',
        color: Colors.primary
    },
    styViewData: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: Size.defineSpace,
        paddingRight: Size.defineSpace / 2,
        alignItems: 'flex-start'
    },
    styItemData: {
        width: '50%',
        marginBottom: Size.defineSpace,
        justifyContent: 'center',
        paddingRight: Size.defineHalfSpace
    },

    styViewCount: {
        backgroundColor: Colors.gray_4,
        borderRadius: 3,
        paddingHorizontal: 5,
        paddingVertical: 3,
        marginLeft: Size.defineHalfSpace
    },
    styCountText: { color: Colors.black, fontSize: Size.text - 2 },

    wrapAllRequestDocs: {
        backgroundColor: Colors.gray_10,
        padding: 16,
        margin: 8,
        borderRadius: 8
    },

    wrapRequestDocsAbove: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },

    requestDoocsAboveLeft: {
        flex: 0.2,
        justifyContent: 'flex-start'
    },

    imageRequestDoc: {
        width: 56,
        height: 56
    },

    textRequestDocAndBtn: {
        fontSize: Size.text + 2,
        color: Colors.white
    },

    wrapDeadline: {
        backgroundColor: Colors.yellow_6,
        paddingHorizontal: 4,
        alignSelf: 'baseline',
        borderRadius: 4,
        marginVertical: 4
    },

    textViewDetailTypeDocs: {
        fontSize: Size.text + 1,
        color: Colors.gray_5
    },

    wrapRequestDocsBelow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16
    },

    btnTempHide: {
        flex: 0.3,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 4
    },

    btnAddRequestDocs: {
        flex: 0.65,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 4
    }
});

const mapStateToProps = (state) => {
    return {
        //generalProfileInfo: state.generalProfileInfo.data,
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchGeneralProfileInfo: () => {
            dispatch(generalProfileInfo.actions.fetchGeneralProfileInfo());
        },
        setProfileInfo: (data) => {
            dispatch(generalProfileInfo.actions.setGeneralProfileInfo(data));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneralInfo);
