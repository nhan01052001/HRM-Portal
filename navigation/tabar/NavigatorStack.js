// customer date
import CustomerDate from '../../scenes/customer/CustomerDate';
import Feedback from '../../scenes/modules/feedback/Feedback.js';
import TakePictureFace from '../../scenes/faceAuthentication/TakePictureFace.js';
import ScanFace from '../../scenes/faceAuthentication/ScanFace.js';
//#region [common/system]
import React from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { IconBack, IconCreate } from '../../constants/Icons';
import { Colors, Size, styleSheets } from '../../constants/styleConfig';
import { translate } from '../../i18n/translate';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import FunctionCommon from './FunctionCommon';
import HomeScene from '../../scenes/home/Home';
import { AlertSevice } from '../../components/Alert/Alert';
import { ToasterSevice } from '../../components/Toaster/Toaster';
import HttpService from '../../utils/HttpService';
import { VnrLoadingSevices } from '../../components/VnrLoading/VnrLoadingPages';
import DrawerServices from '../../utils/DrawerServices';
import VnrText from '../../components/VnrText/VnrText';
import ButtonGoBackHome from '../../components/buttonGoBack/buttonGoBackHome';
import ButtonGoBack from '../../components/buttonGoBack/buttonGoBack';
// import ButtonGoBack from '../../components/buttonGoBack/ButtonGoBack';
import { PermissionForAppMobile } from '../../assets/configProject/PermissionForAppMobile';
import { EnumIcon, ScreenName } from '../../assets/constant';
//#endregion

//#region [common/filter]
import FilterList from '../../scenes/common/FilterList';
// add new by nhan
import FilterListV3 from '../../scenes/common/FilterListV3';
import FilterToAddProfile from '../../scenes/common/FilterToAddProfile';
import FilterToAddProfileViewDetail from '../../scenes/common/FilterToAddProfileViewDetail';
//#endregion

//#region [modules/Other]
import LookupProfile from '../../scenes/modules/other/lookupProfile/LookupProfile';
import LookupProfileViewDetail from '../../scenes/modules/other/lookupProfile/LookupProfileViewDetail';
import LookupRosterProfile from '../../scenes/modules/other/lookupRosterProfile/LookupRosterProfile';
import LookupRosterProfileViewDetail from '../../scenes/modules/other/lookupRosterProfile/LookupRosterProfileViewDetail';
import News from '../../scenes/modules/other/news/News';
import NewsSlider from '../../scenes/modules/other/news/NewsSlider';
import SocialNetWork from '../../scenes/modules/other/socialNetWork/SocialNetWork';
import GeneralChart from '../../scenes/modules/other/generalChart/GeneralChart';
import ChReportDynamic from '../../scenes/modules/other/generalChart/ChReportDynamic';

import CheckInventory from '../../scenes/modules/other/checkInventory/CheckInventory';
import CheckInventoryViewDetail from '../../scenes/modules/other/checkInventory/CheckInventoryViewDetail';

import AppVui from '../../scenes/modules/other/appVui/AppVui';
//#endregion

//#region [modules/Task]
import HreTaskAssign from '../../scenes/modules/humanResource/hreTask/HreTaskAssign';
import HreTaskAssigned from '../../scenes/modules/humanResource/hreTask/HreTaskAssigned';
import HreTaskFollow from '../../scenes/modules/humanResource/hreTask/HreTaskFollow';
import HreTaskEvaluation from '../../scenes/modules/humanResource/hreTask/HreTaskEvaluation';
import HreTaskCreateSave from '../../scenes/modules/humanResource/hreTask/hreTaskAdd/HreTaskCreateSave';
import HreTaskCreateSaveNotModel from '../../scenes/modules/humanResource/hreTask/hreTaskAdd/HreTaskCreateSaveNotModel';
import HreTaskViewDetail from '../../scenes/modules/humanResource/hreTask//HreTaskViewDetail';
import HreTaskViewDetailNotify from '../../scenes/modules/humanResource/hreTask//HreTaskViewDetailNotify';
import HreTaskAddTargetAndLevelForEva from '../../scenes/modules/humanResource/hreTask/hreTaskAdd/HreTaskAddTargetAndLevelForEva';
import HreTaskConfirmTabCreateByModelConfirm from '../../scenes/modules/humanResource/hreTask/hreTaskAdd/hreTaskConfirmTab/HreTaskConfirmTabCreateByModelConfirm';
import HreTaskConfirmTabCreateNotModelConfirm from '../../scenes/modules/humanResource/hreTask/hreTaskAdd/hreTaskConfirmTab/HreTaskConfirmTabCreateNotModelConfirm';
import HreTaskTabEdit from '../../scenes/modules/humanResource/hreTask/hreTaskEdit/HreTaskTabEdit';
import HreTaskTabEditEvaluation from '../../scenes/modules/humanResource/hreTask/hreTaskEditEvaluation/HreTaskTabEditEvaluation';
//#endregion

//#region [modules/Task]
import HreApproveEvaluationDoc from '../../scenes/modules/humanResource/hreEvaluationDoc/hreApproveEvaluationDoc/HreApproveEvaluationDoc';
import HreApproveEvaluationDocViewDetail from '../../scenes/modules/humanResource/hreEvaluationDoc/hreApproveEvaluationDoc/HreApproveEvaluationDocViewDetail';
import HreApprovedEvaluationDoc from '../../scenes/modules/humanResource/hreEvaluationDoc/hreApprovedEvaluationDoc/HreApprovedEvaluationDoc';
import HreApprovedEvaluationDocViewDetail from '../../scenes/modules/humanResource/hreEvaluationDoc/hreApprovedEvaluationDoc/HreApprovedEvaluationDocViewDetail';
import HreApproveEvaluationDocDocument from '../../scenes/modules/humanResource/hreEvaluationDoc/hreApproveEvaluationDoc/HreApproveEvaluationDocDocument';

import HreApproveViolation from '../../scenes/modules/humanResource/hreViolation/hreApproveViolation/HreApproveViolation';
import HreApproveViolationViewDetail from '../../scenes/modules/humanResource/hreViolation/hreApproveViolation/HreApproveViolationViewDetail';
import HreApprovedViolation from '../../scenes/modules/humanResource/hreViolation/hreApprovedViolation/HreApprovedViolation';
import HreApprovedViolationViewDetail from '../../scenes/modules/humanResource/hreViolation/hreApprovedViolation/HreApprovedViolationViewDetail';
//#endregion

//#region [modules/Evaluate]
import EvaPerformanceQuicklyHistory from '../../scenes/modules/evaluate/evaPerformanceQuicklyHistory/EvaPerformanceQuicklyHistory';
import EvaPerformanceQuicklyHistoryViewDetail from '../../scenes/modules/evaluate/evaPerformanceQuicklyHistory/EvaPerformanceQuicklyHistoryViewDetail';
import EvaPerformanceEvaDataResultV3 from '../../scenes/modules/evaluate/evaPerformanceEvaDataResultV3/EvaPerformanceEvaDataResultV3';
import EvaPerformanceEvaDataResultV3Edit from '../../scenes/modules/evaluate/evaPerformanceEvaDataResultV3/EvaPerformanceEvaDataResultV3Edit';
import EvaPerformanceEvaDataResultV3Detail from '../../scenes/modules/evaluate/evaPerformanceEvaDataResultV3/EvaPerformanceEvaDataResultV3Detail';
import EvaPerformanceGroupTargetViewDetail from '../../scenes/modules/evaluate/evaPerformanceEvaDataResultV3/evaPerformanceEvaDataResultV3Detail/EvaPerformanceGroupTargetViewDetail';
import EvaPerformanceTargetViewDetail from '../../scenes/modules/evaluate/evaPerformanceEvaDataResultV3/evaPerformanceEvaDataResultV3Detail/EvaPerformanceTargetViewDetail';
import EvaPerformanceQuickly from '../../scenes/modules/evaluate/evaPerformanceQuickly/EvaPerformanceQuickly.js';
import EvaPerformanceQuicklyProfileDetail from '../../scenes/modules/evaluate/evaPerformanceQuickly/evaPerformanceQuicklyTabProfile/EvaPerformanceQuicklyProfileDetail';
import EvaPerformanceQuicklyProfileEdit from '../../scenes/modules/evaluate/evaPerformanceQuickly/evaPerformanceQuicklyTabProfile/EvaPerformanceQuicklyProfileEdit';
import EvaPerformanceQuicklyTargetDetail from '../../scenes/modules/evaluate/evaPerformanceQuickly/evaPerformanceQuicklyTabTarget/EvaPerformanceQuicklyTargetDetail';
import EvaPerformanceQuicklyTargetEdit from '../../scenes/modules/evaluate/evaPerformanceQuickly/evaPerformanceQuicklyTabTarget/EvaPerformanceQuicklyTargetEdit';
import EvaPerformanceQuicklyAdd from '../../scenes/modules/evaluate/evaPerformanceQuickly/EvaPerformanceQuicklyAdd';
import EvaPerformanceQuicklyAddChoseMore from '../../scenes/modules/evaluate/evaPerformanceQuickly/EvaPerformanceQuicklyAddChoseMore';
import EvaPerformanceResult from '../../scenes/modules/evaluate/evaPerformanceResult/EvaPerformanceResult';
import EvaPerformanceResultViewDetail from '../../scenes/modules/evaluate/evaPerformanceResult/EvaPerformanceResultViewDetail';
import EvaPerformanceWait from '../../scenes/modules/evaluate/evaPerformanceWait/EvaPerformanceWait';
import EvaPerformanceWaitViewDetail from '../../scenes/modules/evaluate/evaPerformanceWait/EvaPerformanceWaitViewDetail';
import EvaPerformanceWaitEvaluation from '../../scenes/modules/evaluate/evaPerformanceWait/evaPerformanceWaitEvaluation/EvaPerformanceWaitEvaluation';

// Đánh giá V2 (Mới)
import EvaEmployee from '../../scenes/modules/evaluate/evaCapacity/evaEmployee/EvaEmployee';
import EvaEmployeeViewDetail from '../../scenes/modules/evaluate/evaCapacity/evaEmployee/EvaEmployeeViewDetail';
import EvaSubmitManager from '../../scenes/modules/evaluate/evaCapacity/evaSubmitManager/EvaSubmitManager';
import EvaSubmitManagerAddOrEdit from '../../scenes/modules/evaluate/evaCapacity/evaSubmitManager/EvaSubmitManagerAddOrEdit';
import EvaSubmitManagerViewDetail from '../../scenes/modules/evaluate/evaCapacity/evaSubmitManager/EvaSubmitManagerViewDetail';
import TopTabEvaCapacityDetail from '../../scenes/modules/evaluate/evaCapacity/evaCapacityDetail/TopTabEvaCapacityDetail';
import EvaCapacityEmployeeViewDetail from '../../scenes/modules/evaluate/evaCapacity/evaCapacityDetail/EvaCapacityEmployeeViewDetail';
//#endregion

//#region [modules/generalInfo]
import GeneralInfo from '../../scenes/modules/generalInfo/GeneralInfo';
import TopTabProfileInfo from '../../scenes/modules/generalInfo/profileInfo/tabProfile/TopTabProfileInfo';
import TopTabHisProfileInfo from '../../scenes/modules/generalInfo/profileInfo/tabHistoryProfileUpdate/TopTabHisProfileInfo';
import TopTabProfileBasicInfoUpdate from '../../scenes/modules/generalInfo/profileInfo/tabProfileUpdate/TopTabProfileBasicInfoUpdate';
import TopTabProfilePersonalInfoUpdate from '../../scenes/modules/generalInfo/profileInfo/tabProfileUpdate/TopTabProfilePersonalInfoUpdate';
import TopTabProfileContactInfoUpdate from '../../scenes/modules/generalInfo/profileInfo/tabProfileUpdate/TopTabProfileContactInfoUpdate';
import AnnualDetail from '../../scenes/modules/generalInfo/attInfo/annualDetail/AnnualDetail';
import AnnualDetailViewDetail from '../../scenes/modules/generalInfo/attInfo/annualDetail/AnnualDetailViewDetail';
import AnnualRemain from '../../scenes/modules/generalInfo/attInfo/annualRemain/AnnualRemain';
import AnnualRemainViewDetail from '../../scenes/modules/generalInfo/attInfo/annualRemain/AnnualRemainViewDetail';
import AttendanceDetail from '../../scenes/modules/generalInfo/attInfo/attendanceDetail/AttendanceDetail';
import AttendanceDetailViewDetail from '../../scenes/modules/generalInfo/attInfo/attendanceDetail/AttendanceDetailViewDetail';
import AttendanceCalendarDetail from '../../scenes/modules/generalInfo/attInfo/attendanceCalendarDetail/AttendanceCalendarDetail';
import AttendanceCalendarViewDetail from '../../scenes/modules/generalInfo/attInfo/attendanceCalendarDetail/AttendanceCalendarViewDetail';
import AttendanceCalenderDetailHistory from '../../scenes/modules/generalInfo/attInfo/attendanceCalendarDetail/attendanceCalenderDetailHistory/AttendanceCalenderDetailHistory';
import AttendanceCalenderDetailHistoryDetail from '../../scenes/modules/generalInfo/attInfo/attendanceCalendarDetail/attendanceCalenderDetailHistory/AttendanceCalenderDetailHistoryDetail';

import AttPaidLeave from '../../scenes/modules/generalInfo/attInfo/attPaidLeave/AttPaidLeave';
import AttPaidLeaveViewDetail from '../../scenes/modules/generalInfo/attInfo/attPaidLeave/AttPaidLeaveViewDetail';
import TopTabInOutInfo from '../../scenes/modules/generalInfo/attInfo/inOut/TopTabInOutInfo';
import InOutViewDetail from '../../scenes/modules/generalInfo/attInfo/inOut/InOutViewDetail';
import WorkDay from '../../scenes/modules/generalInfo/attInfo/workDay/WorkDay';
import WorkDayViewDetail from '../../scenes/modules/generalInfo/attInfo/workDay/WorkDayViewDetail';
import WorkDayV2 from '../../scenes/modules/generalInfo/attInfo/workDayV2/WorkDayV2';
import WorkDayV2ViewDetail from '../../scenes/modules/generalInfo/attInfo/workDayV2/WorkDayV2ViewDetail';
import AttWorkDayCalendar from '../../scenes/modules/attendanceV3/attWorkdayCalendar/AttWorkDayCalendar';
import AttWorkDayCalendarViewDetail from '../../scenes/modules/attendanceV3/attWorkdayCalendar/AttWorkDayCalendarViewDetail';

import Salary from '../../scenes/modules/generalInfo/salInfo/salary/Salary';
import SalaryMonthDetail from '../../scenes/modules/generalInfo/salInfo/salary/SalaryMonthDetail';
import SalaryViewDetail from '../../scenes/modules/generalInfo/salInfo/salary/SalaryViewDetail';

import BasicSalaryDetail from '../../scenes/modules/generalInfo/salInfo/basicSalaryDetail/BasicSalaryDetail';
import BasicSalaryDetailViewDetail from '../../scenes/modules/generalInfo/salInfo/basicSalaryDetail/BasicSalaryDetailViewDetail';

import TabInsurance from '../../scenes/modules/generalInfo/gradeInfo/TabInsurance';
import GradeInfo from '../../scenes/modules/generalInfo/gradeInfo/GradeInfo';
import GradeInsurance from '../../scenes/modules/generalInfo/gradeInfo/gradeInsurance/GradeInsurance';
import GradeInsuranceViewDetail from '../../scenes/modules/generalInfo/gradeInfo/gradeInsurance/GradeInsuranceViewDetail';
import GradeAttendanceViewDetail from '../../scenes/modules/generalInfo/gradeInfo/gradeAttendance/GradeAttendanceViewDetail';
import GradeSalaryViewDetail from '../../scenes/modules/generalInfo/gradeInfo/gradeSalary/GradeSalaryViewDetail';
import Reward from '../../scenes/modules/generalInfo/workHistoryInfo/reward/Reward';
import RewardViewDetail from '../../scenes/modules/generalInfo/workHistoryInfo/reward/RewardViewDetail';
import Discipline from '../../scenes/modules/generalInfo/workHistoryInfo/discipline/Discipline';
import DisciplineViewDetail from '../../scenes/modules/generalInfo/workHistoryInfo/discipline/DisciplineViewDetail';
import TopWorkHistory from '../../scenes/modules/generalInfo/workHistoryInfo/workHistory/TabWorkHistory';
import WorkHistoryViewDetail from '../../scenes/modules/generalInfo/workHistoryInfo/workHistory/WorkHistoryViewDetail';

import TopTabTraineeInfo from '../../scenes/modules/generalInfo/trainInfo/TopTabTraineeInfo';
import Trainee from '../../scenes/modules/generalInfo/trainInfo/trainee/Trainee';
import TraineeViewDetail from '../../scenes/modules/generalInfo/trainInfo/trainee/TraineeViewDetail';
import TraineeCertificate from '../../scenes/modules/generalInfo/trainInfo/traineeCertificate/TraineeCertificate';
import TraineeCertificateViewDetail from '../../scenes/modules/generalInfo/trainInfo/traineeCertificate/TraineeCertificateViewDetail';
import TraineePlan from '../../scenes/modules/generalInfo/trainInfo/traineePlan/TraineePlan';
import TraineePlanViewDetail from '../../scenes/modules/generalInfo/trainInfo/traineePlan/TraineePlanViewDetail';

import TopTabHouseholdInfo from '../../scenes/modules/generalInfo/profileInfo/household/TopTabHouseholdInfo';
import HouseholdConfirmedViewDetail from '../../scenes/modules/generalInfo/profileInfo/household/householdConfirmed/HouseholdConfirmedViewDetail';
import HouseholdWaitConfirmViewDetail from '../../scenes/modules/generalInfo/profileInfo/household/householdWaitConfirm/HouseholdWaitConfirmViewDetail';
import HouseholdAddOrEdit from '../../scenes/modules/generalInfo/profileInfo/household/HouseholdAddOrEdit';
import HouseholdAddRelative from '../../scenes/modules/generalInfo/profileInfo/household/householdAddRelative/HouseholdAddRelative';
import HouseholdAddRelativeViewDetail from '../../scenes/modules/generalInfo/profileInfo/household/householdAddRelative/HouseholdAddRelativeViewDetail';
import HouseholdOtherBirthCertificate from '../../scenes/modules/generalInfo/profileInfo/household/addOrUpdateOtherInfo/HouseholdOtherBirthCertificate';
import HouseholdOtherIdentification from '../../scenes/modules/generalInfo/profileInfo/household//addOrUpdateOtherInfo/HouseholdOtherIdentification';

import BankAccountAddOrEdit from '../../scenes/modules/generalInfo/profileInfo/bankAccount/BankAccountAddOrEdit';
import BankAccountMultiAddOrEdit from '../../scenes/modules/generalInfo/profileInfo/bankAccount/BankAccountMultiAddOrEdit';
import BankWalletAddOrEdit from '../../scenes/modules/generalInfo/profileInfo/bankAccount/BankWalletAddOrEdit.js';
import TopTabBankAccountInfo from '../../scenes/modules/generalInfo/profileInfo/bankAccount/TopTabBankAccountInfo';
import BankAccountConfirmViewDetail from '../../scenes/modules/generalInfo/profileInfo/bankAccount/bankAccountConfirm/BankAccountConfirmViewDetail';
import BankAccountConfirmedViewDetail from '../../scenes/modules/generalInfo/profileInfo/bankAccount/bankAccountConfirmed/BankAccountConfirmedViewDetail';
import BankWalletConfirmedViewDetail from '../../scenes/modules/generalInfo/profileInfo/bankAccount/bankAccountConfirmed/BankWalletConfirmedViewDetail';
import BankWalletConfirmViewDetail from '../../scenes/modules/generalInfo/profileInfo/bankAccount/bankAccountConfirm/BankWalletConfirmViewDetail';

// import BankAccountEditViewDetail from '../../scenes/modules/generalInfo/profileInfo/bankAccount/bankAccountEdit/BankAccountEditViewDetail';
// import BankAccountWaitConfirmViewDetail from '../../scenes/modules/generalInfo/profileInfo/bankAccount/bankAccountWaitConfirm/BankAccountWaitConfirmViewDetail';
// import BankAccountAddOrEdit from '../../scenes/modules/generalInfo/profileInfo/bankAccount/BankAccountAddOrEdit';

// import Dependant from '../../scenes/modules/generalInfo/profileInfo/dependant/Dependant';
// import DependantViewDetail from '../../scenes/modules/generalInfo/profileInfo/dependant/DependantViewDetail';
import TopTabDependantInfo from '../../scenes/modules/generalInfo/profileInfo/dependant/TopTabDependantInfo';
import DependantConfirmedViewDetail from '../../scenes/modules/generalInfo/profileInfo/dependant/dependantConfirmed/DependantConfirmedViewDetail';
import DependantEditViewDetail from '../../scenes/modules/generalInfo/profileInfo/dependant/dependantEdit/DependantEditViewDetail';
import DependantWaitConfirmViewDetail from '../../scenes/modules/generalInfo/profileInfo/dependant/dependantWaitConfirm/DependantWaitConfirmViewDetail';
import DependantAddOrEdit from '../../scenes/modules/generalInfo/profileInfo/dependant/DependantAddOrEdit';
import DependantOtherIdentification from '../../scenes/modules/generalInfo/profileInfo/dependant/addOrUpdateOtherInfo/DependantOtherIdentification';
import DenpendantOtherBirthCertificate from '../../scenes/modules/generalInfo/profileInfo/dependant/addOrUpdateOtherInfo/DenpendantOtherBirthCertificate';
import DependantOtherAddress from '../../scenes/modules/generalInfo/profileInfo/dependant/addOrUpdateOtherInfo/DependantOtherAddress.js';

import Contract from '../../scenes/modules/generalInfo/profileInfo/contract/Contract';
import ContractViewDetail from '../../scenes/modules/generalInfo/profileInfo/contract/ContractViewDetail';
import TopTabContractHistory from '../../scenes/modules/generalInfo/profileInfo/contractV3/TopTabContractHistory';
import ContractV3ViewDetail from '../../scenes/modules/generalInfo/profileInfo/contractV3/ContractV3ViewDetail';
import ContractHistoryAllViewDetail from '../../scenes/modules/generalInfo/profileInfo/contractV3/contractHistoryAll/ContractHistoryAllViewDetail';
import ContractHistoryWaitConfirm from '../../scenes/modules/generalInfo/profileInfo/contractV3/contractHistoryWaitConfirm/ContractHistoryWaitConfirm';
import ContractHistoryConfirmed from '../../scenes/modules/generalInfo/profileInfo/contractV3/contractHistoryConfirmed/ContractHistoryConfirmed';
import ContractHistoryConfirmedViewDetail from '../../scenes/modules/generalInfo/profileInfo/contractV3/contractHistoryConfirmed/ContractHistoryConfirmedViewDetail.js';
import ContractHistoryWaitConfirmViewDetail from '../../scenes/modules/generalInfo/profileInfo/contractV3/contractHistoryWaitConfirm/ContractHistoryWaitConfirmViewDetail.js';

import PartyUnionViewDetail from '../../scenes/modules/generalInfo/profileInfo/PartyUnion/PartyUnionViewDetail';

import AppendixContract from '../../scenes/modules/generalInfo/profileInfo/appendixContract/AppendixContract';
import AppendixContractViewDetail from '../../scenes/modules/generalInfo/profileInfo/appendixContract/AppendixContractViewDetail';
import TaxInfo from '../../scenes/modules/generalInfo/profileInfo/taxInfo/TaxInfo';
import TaxInfoViewDetail from '../../scenes/modules/generalInfo/profileInfo/taxInfo/TaxInfoViewDetail';

import TopTabRelativeInfo from '../../scenes/modules/generalInfo/profileInfo/relative/TopTabRelativeInfo';
import OtherBirthCertificate from '../../scenes/modules/generalInfo/profileInfo/relative/addOrUpdateOtherInfo/OtherBirthCertificate';
import OtherIdentification from '../../scenes/modules/generalInfo/profileInfo/relative/addOrUpdateOtherInfo/OtherIdentification';
import OtherAddressInformation from '../../scenes/modules/generalInfo/profileInfo/relative/addOrUpdateOtherInfo/OtherAddressInformation';
import RelativeConfirmedViewDetail from '../../scenes/modules/generalInfo/profileInfo/relative/relativeConfirmed/RelativeConfirmedViewDetail';
import RelativeEditViewDetail from '../../scenes/modules/generalInfo/profileInfo/relative/relativeEdit/RelativeEditViewDetail';
import RelativeWaitConfirmViewDetail from '../../scenes/modules/generalInfo/profileInfo/relative/relativeWaitConfirm/RelativeWaitConfirmViewDetail';
import RelativeAddOrEdit from '../../scenes/modules/generalInfo/profileInfo/relative/RelativeAddOrEdit';

import TopTabPassportInfo from '../../scenes/modules/generalInfo/profileInfo/passport/TopTabPassportInfo';
import PassportWaitConfirmViewDetail from '../../scenes/modules/generalInfo/profileInfo/passport/passportWaitConfirm/PassportWaitConfirmViewDetail';
import PassportAddOrEdit from '../../scenes/modules/generalInfo/profileInfo/passport/PassportAddOrEdit';
import PassportConfirmedViewDetail from '../../scenes/modules/generalInfo/profileInfo/passport/passportConfirmed/PassportConfirmedViewDetail';

import QualificationAddOrEdit from '../../scenes/modules/generalInfo/profileInfo/qualification/QualificationAddOrEdit';
import TopTabQualificationInfo from '../../scenes/modules/generalInfo/profileInfo/qualification/TopTabQualificationInfo';
import QualificationConfirmedViewDetail from '../../scenes/modules/generalInfo/profileInfo/qualification/qualificationConfirmed/QualificationConfirmedViewDetail';
import QualificationEditViewDetail from '../../scenes/modules/generalInfo/profileInfo/qualification/qualificationEdit/QualificationEditViewDetail';
import QualificationWaitConfirmViewDetail from '../../scenes/modules/generalInfo/profileInfo/qualification/qualificationWaitConfirm/QualificationWaitConfirmViewDetail';

//#endregion

//#region [module/attendance/attTSLRegister]
import AttTSLCheckInOut from '../../scenes/modules/attendance/attTSLCheckInOut/AttTSLCheckInOut';
import AttTSLCheckInOutWifi from '../../scenes/modules/attendance/attTSLCheckInOutWifi/AttTSLCheckInOutWifi';
import GoogleMaps from '../../scenes/modules/other/googleMaps/GoogleMaps';
import AttTSLCheckInOutNFC from '../../scenes/modules/attendance/attTSLCheckInOutNFC/AttTSLCheckInOutNFC';
// import CheckinNFCTest from '../../scenes/modules/other/CheckinNFCTest/CheckinNFCTest';
import ShiftDetail from '../../scenes/modules/other/googleMaps/ShiftDetail';
import TutorialGPSiOS from '../../scenes/modules/other/googleMaps/TutorialGPSiOS';
import TutorialGPSiOSEn from '../../scenes/modules/other/googleMaps/TutorialGPSiOSEn';
import AttSubmitTSLRegister from '../../scenes/modules/attendance/attTSLRegister/attSubmitTSLRegister/AttSubmitTSLRegister';
import AttSubmitTSLRegisterViewDetail from '../../scenes/modules/attendance/attTSLRegister/attSubmitTSLRegister/AttSubmitTSLRegisterViewDetail';
import AttSubmitTSLRegisterAddOrEdit from '../../scenes/modules/attendance/attTSLRegister/attSubmitTSLRegister/AttSubmitTSLRegisterAddOrEdit';
import AttApproveTSLRegister from '../../scenes/modules/attendance/attTSLRegister/attApproveTSLRegister/AttApproveTSLRegister';
import AttApproveTSLRegisterViewDetail from '../../scenes/modules/attendance/attTSLRegister/attApproveTSLRegister/AttApproveTSLRegisterViewDetail';
import AttApprovedTSLRegister from '../../scenes/modules/attendance/attTSLRegister/attApprovedTSLRegister/AttApprovedTSLRegister';
import AttApprovedTSLRegisterViewDetail from '../../scenes/modules/attendance/attTSLRegister/attApprovedTSLRegister/AttApprovedTSLRegisterViewDetail';
//#endregion

//#region [module/attendance/attRoster]
import AttSubmitRoster from '../../scenes/modules/attendance/attRoster/attSubmitRoster/AttSubmitRoster';
import AttSubmitRosterViewDetail from '../../scenes/modules/attendance/attRoster/attSubmitRoster/AttSubmitRosterViewDetail';
import AttSubmitRosterAddOrEdit from '../../scenes/modules/attendance/attRoster/attSubmitRoster/AttSubmitRosterAddOrEdit';
import AttSubmitRosterFlexibleAddOrEdit from '../../scenes/modules/attendance/attRoster/attSubmitRoster/AttSubmitRosterFlexibleAddOrEdit';
import AttApproveRoster from '../../scenes/modules/attendance/attRoster/attApproveRoster/AttApproveRoster';
import AttApproveRosterViewDetail from '../../scenes/modules/attendance/attRoster/attApproveRoster/AttApproveRosterViewDetail';
import AttApprovedRoster from '../../scenes/modules/attendance/attRoster/attApprovedRoster/AttApprovedRoster';
import AttApprovedRosterViewDetail from '../../scenes/modules/attendance/attRoster/attApprovedRoster/AttApprovedRosterViewDetail';
//#endregion

//#region [module/attendance/attRosterGroupByEmp]
import AttSubmitRosterGroupByEmp from '../../scenes/modules/attendance/attRosterGroupByEmp/attSubmitRosterGroupByEmp/AttSubmitRosterGroupByEmp';
import AttSubmitRosterGroupByEmpViewDetail from '../../scenes/modules/attendance/attRosterGroupByEmp/attSubmitRosterGroupByEmp/AttSubmitRosterGroupByEmpViewDetail';
import AttSubmitRosterGroupByEmpAddOrEdit from '../../scenes/modules/attendance/attRosterGroupByEmp/attSubmitRosterGroupByEmp/AttSubmitRosterGroupByEmpAddOrEdit';
import AttApproveRosterGroupByEmp from '../../scenes/modules/attendance/attRosterGroupByEmp/attApproveRosterGroupByEmp/AttApproveRosterGroupByEmp';
import AttApproveRosterGroupByEmpViewDetail from '../../scenes/modules/attendance/attRosterGroupByEmp/attApproveRosterGroupByEmp/AttApproveRosterGroupByEmpViewDetail';
import AttApprovedRosterGroupByEmp from '../../scenes/modules/attendance/attRosterGroupByEmp/attApprovedRosterGroupByEmp/AttApprovedRosterGroupByEmp';
import AttApprovedRosterGroupByEmpViewDetail from '../../scenes/modules/attendance/attRosterGroupByEmp/attApprovedRosterGroupByEmp/AttApprovedRosterGroupByEmpViewDetail';
//#endregion

//#region [module/attendance/attLeaveDay]
import AttSubmitLeaveDay from '../../scenes/modules/attendance/attLeaveDay/attSubmitLeaveDay/AttSubmitLeaveDay';
import AttSubmitLeaveDayViewDetail from '../../scenes/modules/attendance/attLeaveDay/attSubmitLeaveDay/AttSubmitLeaveDayViewDetail';
import AttSubmitLeaveDayAddOrEdit from '../../scenes/modules/attendance/attLeaveDay/attSubmitLeaveDay/AttSubmitLeaveDayAddOrEdit';
import AttApproveLeaveDay from '../../scenes/modules/attendance/attLeaveDay/attApproveLeaveDay/AttApproveLeaveDay';
import AttApproveLeaveDayViewDetail from '../../scenes/modules/attendance/attLeaveDay/attApproveLeaveDay/AttApproveLeaveDayViewDetail';
import AttApprovedLeaveDay from '../../scenes/modules/attendance/attLeaveDay/attApprovedLeaveDay/AttApprovedLeaveDay';
import AttApprovedLeaveDayViewDetail from '../../scenes/modules/attendance/attLeaveDay/attApprovedLeaveDay/AttApprovedLeaveDayViewDetail';
// Xác nhận ngày nghỉ
import AttConfirmLeaveDay from '../../scenes/modules/attendance/attLeaveDay/attConfirmLeaveDay/AttConfirmLeaveDay';
//#endregion

//#region [module/attendance/attLeaveDayCancel]
import AttSubmitLeaveDayCancel from '../../scenes/modules/attendance/attLeaveDayCancel/attSubmitLeaveDayCancel/AttSubmitLeaveDayCancel';
import AttSubmitLeaveDayCancelViewDetail from '../../scenes/modules/attendance/attLeaveDayCancel/attSubmitLeaveDayCancel/AttSubmitLeaveDayCancelViewDetail';
import AttSubmitLeaveDayCancelAddOrEdit from '../../scenes/modules/attendance/attLeaveDayCancel/attSubmitLeaveDayCancel/AttSubmitLeaveDayCancelAddOrEdit';
import AttApproveLeaveDayCancel from '../../scenes/modules/attendance/attLeaveDayCancel/attApproveLeaveDayCancel/AttApproveLeaveDayCancel';
import AttApproveLeaveDayCancelViewDetail from '../../scenes/modules/attendance/attLeaveDayCancel/attApproveLeaveDayCancel/AttApproveLeaveDayCancelViewDetail';
import AttApprovedLeaveDayCancel from '../../scenes/modules/attendance/attLeaveDayCancel/attApprovedLeaveDayCancel/AttApprovedLeaveDayCancel';
import AttApprovedLeaveDayCancelViewDetail from '../../scenes/modules/attendance/attLeaveDayCancel/attApprovedLeaveDayCancel/AttApprovedLeaveDayCancelViewDetail';
//#endregion

//#region [module/attendance/attOvertime]
import AttSubmitOvertime from '../../scenes/modules/attendance/attOvertime/attSubmitOvertime/AttSubmitOvertime';
import AttSubmitOvertimeViewDetail from '../../scenes/modules/attendance/attOvertime/attSubmitOvertime/AttSubmitOvertimeViewDetail';
import AttSubmitOvertimeAddOrEdit from '../../scenes/modules/attendance/attOvertime/attSubmitOvertime/AttSubmitOvertimeAddOrEdit';
import AttApproveOvertime from '../../scenes/modules/attendance/attOvertime/attApproveOvertime/AttApproveOvertime';
import AttApproveOvertimeViewDetail from '../../scenes/modules/attendance/attOvertime/attApproveOvertime/AttApproveOvertimeViewDetail';
import AttApproveOvertimeComment from '../../scenes/modules/attendance/attOvertime/attApproveOvertime/AttApproveOvertimeComment';
import AttApprovedOvertime from '../../scenes/modules/attendance/attOvertime/attApprovedOvertime/AttApprovedOvertime';
import AttApprovedOvertimeViewDetail from '../../scenes/modules/attendance/attOvertime/attApprovedOvertime/AttApprovedOvertimeViewDetail';
//#endregion

//#region [module/attendance/attPlanOvertime]
import AttSubmitPlanOvertime from '../../scenes/modules/attendance/attPlanOvertime/attSubmitPlanOvertime/AttSubmitPlanOvertime';
import AttSubmitPlanOvertimeViewDetail from '../../scenes/modules/attendance/attPlanOvertime/attSubmitPlanOvertime/AttSubmitPlanOvertimeViewDetail';
import AttSubmitPlanOvertimeAddOrEdit from '../../scenes/modules/attendance/attPlanOvertime/attSubmitPlanOvertime/AttSubmitPlanOvertimeAddOrEdit';
import AttApprovePlanOvertime from '../../scenes/modules/attendance/attPlanOvertime/attApprovePlanOvertime/AttApprovePlanOvertime';
import AttApprovePlanOvertimeViewDetail from '../../scenes/modules/attendance/attPlanOvertime/attApprovePlanOvertime/AttApprovePlanOvertimeViewDetail';
import AttApprovedPlanOvertime from '../../scenes/modules/attendance/attPlanOvertime/attApprovedPlanOvertime/AttApprovedPlanOvertime';
import AttApprovedPlanOvertimeViewDetail from '../../scenes/modules/attendance/attPlanOvertime/attApprovedPlanOvertime/AttApprovedPlanOvertimeViewDetail';
//#endregion

// add new by nhan
//#region [module/attendance/attRegisterVehicle]
import AttSubmitRegisterVehicle from '../../scenes/modules/attendance/attRegisterVehicle/attSubmitRegisterVehicle/AttSubmitRegisterVehicle';
import AttSubmitRegisterVehicleViewDetail from '../../scenes/modules/attendance/attRegisterVehicle/attSubmitRegisterVehicle/AttSubmitRegisterVehicleViewDetail';
import AttSubmitRegisterVehicleAddOrEdit from '../../scenes/modules/attendance/attRegisterVehicle/attSubmitRegisterVehicle/AttSubmitRegisterVehicleAddOrEdit';
import AttApproveRegisterVehicle from '../../scenes/modules/attendance/attRegisterVehicle/attApproveRegisterVehicle/AttApproveRegisterVehicle';
import AttApproveRegisterVehicleViewDetail from '../../scenes/modules/attendance/attRegisterVehicle/attApproveRegisterVehicle/AttApproveRegisterVehicleViewDetail';
import AttApprovedRegisterVehicle from '../../scenes/modules/attendance/attRegisterVehicle/attApprovedRegisterVehicle/AttApprovedRegisterVehicle';
import AttApprovedRegisterVehicleViewDetail from '../../scenes/modules/attendance/attRegisterVehicle/attApprovedRegisterVehicle/AttApprovedRegisterVehicleViewDetail';
//#endregion

//#region [module/salary/taxInformationRegister]
import TaxSubmitTaxInformationRegister from '../../scenes/modules/salary/taxInformationRegister/taxSubmitTaxInformationRegister/TaxSubmitTaxInformationRegister';
import TaxSubmitTaxInformationRegisterAddOrEdit from '../../scenes/modules/salary/taxInformationRegister/taxSubmitTaxInformationRegister/TaxSubmitTaxInformationRegisterAddOrEdit';
import TaxApproveTaxInformationRegister from '../../scenes/modules/salary/taxInformationRegister/taxApproveTaxInformationRegister/TaxApproveTaxInformationRegister';
import TaxApprovedTaxInformationRegister from '../../scenes/modules/salary/taxInformationRegister/taxApprovedTaxInformationRegister/TaxApprovedTaxInformationRegister';
import TaxApproveTaxInformationRegisterViewDetail from '../../scenes/modules/salary/taxInformationRegister/taxApproveTaxInformationRegister/TaxApproveTaxInformationRegisterViewDetail';
import TaxApprovedTaxInformationRegisterViewDetail from '../../scenes/modules/salary/taxInformationRegister/taxApprovedTaxInformationRegister/TaxApprovedTaxInformationRegisterViewDetail';
//#endregion
// end add new by nhan

//#region [module/attendance/attLateEarlyAllowed]
import AttSubmitLateEarlyAllowed from '../../scenes/modules/attendance/attLateEarlyAllowed/attSubmitLateEarlyAllowed/AttSubmitLateEarlyAllowed';
import AttSubmitLateEarlyAllowedViewDetail from '../../scenes/modules/attendance/attLateEarlyAllowed/attSubmitLateEarlyAllowed/AttSubmitLateEarlyAllowedViewDetail';
import AttSubmitLateEarlyAllowedAddOrEdit from '../../scenes/modules/attendance/attLateEarlyAllowed/attSubmitLateEarlyAllowed/AttSubmitLateEarlyAllowedAddOrEdit';
import AttApproveLateEarlyAllowed from '../../scenes/modules/attendance/attLateEarlyAllowed/attApproveLateEarlyAllowed/AttApproveLateEarlyAllowed';
import AttApproveLateEarlyAllowedViewDetail from '../../scenes/modules/attendance/attLateEarlyAllowed/attApproveLateEarlyAllowed/AttApproveLateEarlyAllowedViewDetail';
import AttApprovedLateEarlyAllowed from '../../scenes/modules/attendance/attLateEarlyAllowed/attApprovedLateEarlyAllowed/AttApprovedLateEarlyAllowed';
import AttApprovedLateEarlyAllowedViewDetail from '../../scenes/modules/attendance/attLateEarlyAllowed/attApprovedLateEarlyAllowed/AttApprovedLateEarlyAllowedViewDetail';
//#endregion

//#region [module/attendance/attPlanOvertimeCancel]
import AttSubmitPlanOvertimeCancel from '../../scenes/modules/attendance/attPlanOvertimeCancel/attSubmitPlanOvertimeCancel/AttSubmitPlanOvertimeCancel';
import AttSubmitPlanOvertimeCancelViewDetail from '../../scenes/modules/attendance/attPlanOvertimeCancel/attSubmitPlanOvertimeCancel/AttSubmitPlanOvertimeCancelViewDetail';
import AttSubmitPlanOvertimeCancelAddOrEdit from '../../scenes/modules/attendance/attPlanOvertimeCancel/attSubmitPlanOvertimeCancel/AttSubmitPlanOvertimeCancelAddOrEdit';
import AttApprovePlanOvertimeCancel from '../../scenes/modules/attendance/attPlanOvertimeCancel/attApprovePlanOvertimeCancel/AttApprovePlanOvertimeCancel';
import AttApprovePlanOvertimeCancelViewDetail from '../../scenes/modules/attendance/attPlanOvertimeCancel/attApprovePlanOvertimeCancel/AttApprovePlanOvertimeCancelViewDetail';
import AttApprovedPlanOvertimeCancel from '../../scenes/modules/attendance/attPlanOvertimeCancel/attApprovedPlanOvertimeCancel/AttApprovedPlanOvertimeCancel';
import AttApprovedPlanOvertimeCancelViewDetail from '../../scenes/modules/attendance/attPlanOvertimeCancel/attApprovedPlanOvertimeCancel/AttApprovedPlanOvertimeCancelViewDetail';
//#endregion

//#region [module/attendance/attBusinessTravel]
import AttSubmitBusinessTravel from '../../scenes/modules/attendance/attBusinessTravel/attSubmitBusinessTravel/AttSubmitBusinessTravel';
import AttSubmitBusinessTravelViewDetail from '../../scenes/modules/attendance/attBusinessTravel/attSubmitBusinessTravel/AttSubmitBusinessTravelViewDetail';
import AttSubmitBusinessTravelAddOrEdit from '../../scenes/modules/attendance/attBusinessTravel/attSubmitBusinessTravel/AttSubmitBusinessTravelAddOrEdit';
import AttApproveBusinessTravel from '../../scenes/modules/attendance/attBusinessTravel/attApproveBusinessTravel/AttApproveBusinessTravel';
import AttApproveBusinessTravelViewDetail from '../../scenes/modules/attendance/attBusinessTravel/attApproveBusinessTravel/AttApproveBusinessTravelViewDetail';
import AttApprovedBusinessTravel from '../../scenes/modules/attendance/attBusinessTravel/attApprovedBusinessTravel/AttApprovedBusinessTravel';
import AttApprovedBusinessTravelViewDetail from '../../scenes/modules/attendance/attBusinessTravel/attApprovedBusinessTravel/AttApprovedBusinessTravelViewDetail';
//#endregion

//#region [module/attendance/attBusinessTravel]
import AttSubmitBusinessTravelCancel from '../../scenes/modules/attendance/attBusinessTravelCancel/attSubmitBusinessTravelCancel/AttSubmitBusinessTravelCancel';
import AttSubmitBusinessTravelCancelViewDetail from '../../scenes/modules/attendance/attBusinessTravelCancel/attSubmitBusinessTravelCancel/AttSubmitBusinessTravelCancelViewDetail';
import AttSubmitBusinessTravelCancelAddOrEdit from '../../scenes/modules/attendance/attBusinessTravelCancel/attSubmitBusinessTravelCancel/AttSubmitBusinessTravelCancelAddOrEdit';
import AttApproveBusinessTravelCancel from '../../scenes/modules/attendance/attBusinessTravelCancel/attApproveBusinessTravelCancel/AttApproveBusinessTravelCancel';
import AttApproveBusinessTravelCancelViewDetail from '../../scenes/modules/attendance/attBusinessTravelCancel/attApproveBusinessTravelCancel/AttApproveBusinessTravelCancelViewDetail';
import AttApprovedBusinessTravelCancel from '../../scenes/modules/attendance/attBusinessTravelCancel/attApprovedBusinessTravelCancel/AttApprovedBusinessTravelCancel';
import AttApprovedBusinessTravelCancelViewDetail from '../../scenes/modules/attendance/attBusinessTravelCancel/attApprovedBusinessTravelCancel/AttApprovedBusinessTravelCancelViewDetail';
//#endregion

//#region [module/attendance/AttBusinessTrip]
import AttSubmitBusinessTrip from '../../scenes/modules/attendance/attBusinessTrip/attSubmitBusinessTrip/AttSubmitBusinessTrip';
import AttSubmitBusinessTripViewDetail from '../../scenes/modules/attendance/attBusinessTrip/attSubmitBusinessTrip/AttSubmitBusinessTripViewDetail';
import AttSubmitBusinessTripAddOrEdit from '../../scenes/modules/attendance/attBusinessTrip/attSubmitBusinessTrip/AttSubmitBusinessTripAddOrEdit';
import AttSubmitBusinessTripViewCost from '../../scenes/modules/attendance/attBusinessTrip/attSubmitBusinessTrip/AttSubmitBusinessTripViewCost';
import AttApproveBusinessTrip from '../../scenes/modules/attendance/attBusinessTrip/attApproveBusinessTrip/AttApproveBusinessTrip';
import AttApproveBusinessTripViewDetail from '../../scenes/modules/attendance/attBusinessTrip/attApproveBusinessTrip/AttApproveBusinessTripViewDetail';
import AttApprovedBusinessTrip from '../../scenes/modules/attendance/attBusinessTrip/attApprovedBusinessTrip/AttApprovedBusinessTrip';
import AttApprovedBusinessTripViewDetail from '../../scenes/modules/attendance/attBusinessTrip/attApprovedBusinessTrip/AttApprovedBusinessTripViewDetail';
//#endregion

//#region [module/attendance/attBusinessTravelTransfer]
import AttSubmitBusinessTravelTransfer from '../../scenes/modules/attendance/attBusinessTravelTransfer/attSubmitBusinessTravelTransfer/AttSubmitBusinessTravelTransfer';
import AttSubmitBusinessTravelTransferViewDetail from '../../scenes/modules/attendance/attBusinessTravelTransfer/attSubmitBusinessTravelTransfer/AttSubmitBusinessTravelTransferViewDetail';
import AttSubmitBusinessTravelTransferAddOrEdit from '../../scenes/modules/attendance/attBusinessTravelTransfer/attSubmitBusinessTravelTransfer/AttSubmitBusinessTravelTransferAddOrEdit';
import AttApproveBusinessTravelTransfer from '../../scenes/modules/attendance/attBusinessTravelTransfer/attApproveBusinessTravelTransfer/AttApproveBusinessTravelTransfer';
import AttApproveBusinessTravelTransferViewDetail from '../../scenes/modules/attendance/attBusinessTravelTransfer/attApproveBusinessTravelTransfer/AttApproveBusinessTravelTransferViewDetail';
import AttApprovedBusinessTravelTransfer from '../../scenes/modules/attendance/attBusinessTravelTransfer/attApprovedBusinessTravelTransfer/AttApprovedBusinessTravelTransfer';
import AttApprovedBusinessTravelTransferViewDetail from '../../scenes/modules/attendance/attBusinessTravelTransfer/attApprovedBusinessTravelTransfer/AttApprovedBusinessTravelTransferViewDetail';
//#endregion

//#region [module/attendance/attPregnancy]
import AttSubmitPregnancy from '../../scenes/modules/attendance/attPregnancy/attSubmitPregnancy/AttSubmitPregnancy';
import AttSubmitPregnancyViewDetail from '../../scenes/modules/attendance/attPregnancy/attSubmitPregnancy/AttSubmitPregnancyViewDetail';
import AttSubmitPregnancyAddOrEdit from '../../scenes/modules/attendance/attPregnancy/attSubmitPregnancy/AttSubmitPregnancyAddOrEdit';
import AttApprovePregnancy from '../../scenes/modules/attendance/attPregnancy/attApprovePregnancy/AttApprovePregnancy';
import AttApprovePregnancyViewDetail from '../../scenes/modules/attendance/attPregnancy/attApprovePregnancy/AttApprovePregnancyViewDetail';
import AttApprovedPregnancy from '../../scenes/modules/attendance/attPregnancy/attApprovedPregnancy/AttApprovedPregnancy';
import AttApprovedPregnancyViewDetail from '../../scenes/modules/attendance/attPregnancy/attApprovedPregnancy/AttApprovedPregnancyViewDetail';
//#endregion

//#region [module/attendance/attShiftSubstitution]
import AttSubmitShiftSubstitution from '../../scenes/modules/attendance/attShiftSubstitution/attSubmitShiftSubstitution/AttSubmitShiftSubstitution';
import AttSubmitShiftSubstitutionViewDetail from '../../scenes/modules/attendance/attShiftSubstitution/attSubmitShiftSubstitution/AttSubmitShiftSubstitutionViewDetail';
import AttSubmitShiftSubstitutionAddOrEdit from '../../scenes/modules/attendance/attShiftSubstitution/attSubmitShiftSubstitution/AttSubmitShiftSubstitutionAddOrEdit';

import AttWaitConfirmShiftSubstitution from '../../scenes/modules/attendance/attShiftSubstitution/attWaitConfirmShiftSubstitution/AttWaitConfirmShiftSubstitution';
import AttWaitConfirmShiftSubstitutionViewDetail from '../../scenes/modules/attendance/attShiftSubstitution/attWaitConfirmShiftSubstitution/AttWaitConfirmShiftSubstitutionViewDetail';

import AttWaitConfirmedShiftSubstitution from '../../scenes/modules/attendance/attShiftSubstitution/attWaitConfirmedShiftSubstitution/AttWaitConfirmedShiftSubstitution';
import AttWaitConfirmedShiftSubstitutionViewDetail from '../../scenes/modules/attendance/attShiftSubstitution/attWaitConfirmedShiftSubstitution/AttWaitConfirmedShiftSubstitutionViewDetail';

import AttApproveShiftSubstitution from '../../scenes/modules/attendance/attShiftSubstitution/attApproveShiftSubstitution/AttApproveShiftSubstitution';
import AttApproveShiftSubstitutionViewDetail from '../../scenes/modules/attendance/attShiftSubstitution/attApproveShiftSubstitution/AttApproveShiftSubstitutionViewDetail';

import AttApprovedShiftSubstitution from '../../scenes/modules/attendance/attShiftSubstitution/attApprovedShiftSubstitution/AttApprovedShiftSubstitution';
import AttApprovedShiftSubstitutionViewDetail from '../../scenes/modules/attendance/attShiftSubstitution/attApprovedShiftSubstitution/AttApprovedShiftSubstitutionViewDetail';
//#endregion

//#region [module/humanResource/HreLanguageLevel]
import HreLanguageLevel from '../../scenes/modules/humanResource/hreLanguageLevel/HreLanguageLevel';
import HreLanguageLevelViewDetail from '../../scenes/modules/humanResource/hreLanguageLevel/HreLanguageLevelViewDetail';
//#endregion

//#region [module/humanResource/HreLanguageLevel]
import HreTopTabSurvey from '../../scenes/modules/humanResource/hreSurveyEmployee/HreTopTabSurvey';
import HreSurveyHistoryViewDetail from '../../scenes/modules/humanResource/hreSurveyEmployee/HreSurveyHistoryViewDetail';
import HreSurveyEmployeeViewDetail from '../../scenes/modules/humanResource/hreSurveyEmployee/HreSurveyEmployeeViewDetail';
//#endregion

//#region [module/humanResource/HreSurveyQuiz]
import HreSurveyQuiz from '../../scenes/modules/humanResource/hreSurveyQuiz/HreSurveyQuiz';
import HreSurveyQuizViewDetail from '../../scenes/modules/humanResource/hreSurveyQuiz/HreSurveyQuizViewDetail';
//#endregion

//#region [module/humanResource/HreStopWorking]
import HreSubmitStopWorking from '../../scenes/modules/humanResource/hreStopWorking/hreSubmitStopWorking/HreSubmitStopWorking';
import HreSubmitStopWorkingViewDetail from '../../scenes/modules/humanResource/hreStopWorking/hreSubmitStopWorking/HreSubmitStopWorkingViewDetail';
import HreSubmitStopWorkingAddOrEdit from '../../scenes/modules/humanResource/hreStopWorking/hreSubmitStopWorking/HreSubmitStopWorkingAddOrEdit';
import HreSubmitStopWorkingAddOrEditNext from '../../scenes/modules/humanResource/hreStopWorking/hreSubmitStopWorking/HreSubmitStopWorkingAddOrEditNext';
import HreApproveStopWorking from '../../scenes/modules/humanResource/hreStopWorking/hreApproveStopWorking/HreApproveStopWorking';
import HreApproveStopWorkingViewDetail from '../../scenes/modules/humanResource/hreStopWorking/hreApproveStopWorking/HreApproveStopWorkingViewDetail';
import HreApprovedStopWorking from '../../scenes/modules/humanResource/hreStopWorking/hreApprovedStopWorking/HreApprovedStopWorking';
import HreApprovedStopWorkingViewDetail from '../../scenes/modules/humanResource/hreStopWorking/hreApprovedStopWorking/HreApprovedStopWorkingViewDetail';
//#endregion

//#region [module/humanResource/HreWorkHistorySalary]
import HreSubmitWorkHistorySalary from '../../scenes/modules/humanResource/hreWorkHistorySalary/hreSubmitWorkHistorySalary/HreSubmitWorkHistorySalary';
import HreSubmitWorkHistorySalaryViewDetail from '../../scenes/modules/humanResource/hreWorkHistorySalary/hreSubmitWorkHistorySalary/HreSubmitWorkHistorySalaryViewDetail';
import HreSubmitWorkHistorySalaryAddOrEdit from '../../scenes/modules/humanResource/hreWorkHistorySalary/hreSubmitWorkHistorySalary/HreSubmitWorkHistorySalaryAddOrEdit';
import HreSubmitWorkHistorySalaryAddOrEditNext from '../../scenes/modules/humanResource/hreWorkHistorySalary/hreSubmitWorkHistorySalary/HreSubmitWorkHistorySalaryAddOrEditNext';
import HreApproveWorkHistorySalary from '../../scenes/modules/humanResource/hreWorkHistorySalary/hreApproveWorkHistorySalary/HreApproveWorkHistorySalary';
import HreApproveWorkHistorySalaryViewDetail from '../../scenes/modules/humanResource/hreWorkHistorySalary/hreApproveWorkHistorySalary/HreApproveWorkHistorySalaryViewDetail';
import HreApprovedWorkHistorySalary from '../../scenes/modules/humanResource/hreWorkHistorySalary/hreApprovedWorkHistorySalary/HreApprovedWorkHistorySalary';
import HreApprovedWorkHistorySalaryViewDetail from '../../scenes/modules/humanResource/hreWorkHistorySalary/hreApprovedWorkHistorySalary/HreApprovedWorkHistorySalaryViewDetail';
//#endregion

//#region [module/humanResource/HreRequirementRecruitment]
import HreSubmitRequirementRecruitment from '../../scenes/modules/humanResource/hreRequirementRecruitment/hreSubmitRequirementRecruitment/HreSubmitRequirementRecruitment';
import HreSubmitRequirementRecruitmentViewDetail from '../../scenes/modules/humanResource/hreRequirementRecruitment/hreSubmitRequirementRecruitment/HreSubmitRequirementRecruitmentViewDetail';
import HreSubmitRequirementRecruitmentAddOrEdit from '../../scenes/modules/humanResource/hreRequirementRecruitment/hreSubmitRequirementRecruitment/HreSubmitRequirementRecruitmentAddOrEdit';
import HreSubmitRequirementRecruitmentAddOrEditNext from '../../scenes/modules/humanResource/hreRequirementRecruitment/hreSubmitRequirementRecruitment/HreSubmitRequirementRecruitmentAddOrEditNext';
import HreApproveRequirementRecruitment from '../../scenes/modules/humanResource/hreRequirementRecruitment/hreApproveRequirementRecruitment/HreApproveRequirementRecruitment';
import HreApproveRequirementRecruitmentViewDetail from '../../scenes/modules/humanResource/hreRequirementRecruitment/hreApproveRequirementRecruitment/HreApproveRequirementRecruitmentViewDetail';
import HreApprovedRequirementRecruitment from '../../scenes/modules/humanResource/hreRequirementRecruitment/hreApprovedRequirementRecruitment/HreApprovedRequirementRecruitment';
import HreApprovedRequirementRecruitmentViewDetail from '../../scenes/modules/humanResource/hreRequirementRecruitment/hreApprovedRequirementRecruitment/HreApprovedRequirementRecruitmentViewDetail';
//#endregion

//#region [module/humanResource/HreHappyBirthday]
import HreHappyBirthday from '../../scenes/modules/humanResource/hreHappyBirthDay/HreHappyBirthday';
//#endregion

//#region [module/attendance/attDataWorkdaysEmps]
import AttDataWorkdaysEmps from '../../scenes/modules/attendance/attDataWorkdaysEmps/AttDataWorkdaysEmps';
import AttDataWorkdaysEmpsViewDetail from '../../scenes/modules/attendance/attDataWorkdaysEmps/AttDataWorkdaysEmpsViewDetail';
//#endregion

//#region [module/attendance/attRequest]
import AttRequest from '../../scenes/modules/attendance/attRequest/AttRequest';

//#endregion

//#region [module/profileInfo/LanguageLeve]
import LanguageLevelWaitConfirmViewDetail from '../../scenes/modules/generalInfo/profileInfo/languageLevel/languageLevelWaitConfirm/LanguageLevelWaitConfirmViewDetail';
import LanguageLevelEditViewDetail from '../../scenes/modules/generalInfo/profileInfo/languageLevel/languageLevelEdit/LanguageLevelEditViewDetail';
import LanguageLevelConfirmedViewDetail from '../../scenes/modules/generalInfo/profileInfo/languageLevel/languageLevelConfirmed/LanguageLevelConfirmedViewDetail';
import LanguageLevelAddOrEdit from '../../scenes/modules/generalInfo/profileInfo/languageLevel/LanguageLevelAddOrEdit';
import TopTabLanguageLevelInfo from '../../scenes/modules/generalInfo/profileInfo/languageLevel/TopTabLanguageLevelInfo';
//#endregion

//#region [module/profileInfo/WorkingExperience]
import WorkingExperienceAddOrEdit from '../../scenes/modules/generalInfo/profileInfo/workingExperience/WorkingExperienceAddOrEdit';
import WorkingExperienceConfirmedViewDetail from '../../scenes/modules/generalInfo/profileInfo/workingExperience/workingExperienceConfirmed/WorkingExperienceConfirmedViewDetail';
// import WorkingExperienceEditViewDetail from '../../scenes/modules/generalInfo/profileInfo/workingExperience/workingExperienceEdit/WorkingExperienceEditViewDetail';
import WorkingExperienceWaitConfirmViewDetail from '../../scenes/modules/generalInfo/profileInfo/workingExperience/workingExperienceWaitConfirm/WorkingExperienceWaitConfirmViewDetail';
// import WorkingExperienceOtherBirthCertificate from '../../scenes/modules/generalInfo/profileInfo/workingExperience/addOrUpdateOtherInfo/OtherBirthCertificate';
// import WorkingExperienceOtherIdentification from '../../scenes/modules/generalInfo/profileInfo/workingExperience/addOrUpdateOtherInfo/OtherIdentification';
import TopTabWorkingExperienceInfo from '../../scenes/modules/generalInfo/profileInfo/workingExperience/TopTabworkingExperienceInfo';
//#endregion

//#region [modules/insurance]
import InsInsuranceRecord from '../../scenes/modules/insurance/insInsuranceRecord/insInsuranceRecord/InsInsuranceRecord';
import InsInsuranceRecordViewDetail from '../../scenes/modules/insurance/insInsuranceRecord/insInsuranceRecord/InsInsuranceRecordViewDetail';
import InsInsuranceRecordAddOrEdit from '../../scenes/modules/insurance/insInsuranceRecord/insInsuranceRecord/InsInsuranceRecordAddOrEdit';
import InsInsuranceRecordWaiting from '../../scenes/modules/insurance/insInsuranceRecord/insInsuranceRecordWaiting/InsInsuranceRecordWaiting';
import InsInsuranceRecordWaitingViewDetail from '../../scenes/modules/insurance/insInsuranceRecord/insInsuranceRecordWaiting/InsInsuranceRecordWaitingViewDetail';
import InsInsuranceRecordWaitingAddOrEdit from '../../scenes/modules/insurance/insInsuranceRecord/insInsuranceRecordWaiting/InsInsuranceRecordWaitingAddOrEdit';

import InsSubmitChangeInsInfoRegister from '../../scenes/modules/insurance/insChangeInsInfoRegister/insSubmitChangeInsInfoRegister/InsSubmitChangeInsInfoRegister';
import InsSubmitChangeInsInfoRegisterViewDetail from '../../scenes/modules/insurance/insChangeInsInfoRegister/insSubmitChangeInsInfoRegister/InsSubmitChangeInsInfoRegisterViewDetail';
import InsSubmitChangeInsInfoRegisterAddOrEdit from '../../scenes/modules/insurance/insChangeInsInfoRegister/insSubmitChangeInsInfoRegister/InsSubmitChangeInsInfoRegisterAddOrEdit';
//#endregion
//#region [modules/train]
import TraAttendance from '../../scenes/modules/train/traAttendance/TraAttendance';
import TraAttendanceV2 from '../../scenes/modules/train/traAttendanceV2/TraAttendanceV2';
//#endregion
//#region [module/salary/salUnusualAllowance]
import SalSubmitUnusualAllowance from '../../scenes/modules/salary/salUnusualAllowance/salSubmitUnusualAllowance/SalSubmitUnusualAllowance';
import SalSubmitUnusualAllowanceViewDetail from '../../scenes/modules/salary/salUnusualAllowance/salSubmitUnusualAllowance/SalSubmitUnusualAllowanceViewDetail';
import SalSubmitUnusualAllowanceAddOrEdit from '../../scenes/modules/salary/salUnusualAllowance/salSubmitUnusualAllowance/SalSubmitUnusualAllowanceAddOrEdit';
//#endregion

//#region [module/salary/SalSubmitPITAmount]
import SalSubmitPITAmount from '../../scenes/modules/salary/salPITAmount/salSubmitPITAmount/SalSubmitPITAmount';
import SalSubmitPITAmountViewDetail from '../../scenes/modules/salary/salPITAmount/salSubmitPITAmount/SalSubmitPITAmountViewDetail';
//#endregion

//#region [module/salary/SalApprovePITFinalization]
import SalApprovePITFinalizationAddOrEdit from '../../scenes/modules/salary/salPITFinalization/salApprovePITFinalization/SalApprovePITFinalizationAddOrEdit';
import SalApprovePITFinalization from '../../scenes/modules/salary/salPITFinalization/salApprovePITFinalization/SalApprovePITFinalization';
import SalApprovePITFinalizationViewDetail from '../../scenes/modules/salary/salPITFinalization/salApprovePITFinalization/SalApprovePITFinalizationViewDetail';
import SalApprovedPITFinalization from '../../scenes/modules/salary/salPITFinalization/salApprovedPITFinalization/SalApprovedPITFinalization';
import SalApprovedPITFinalizationViewDetail from '../../scenes/modules/salary/salPITFinalization/salApprovedPITFinalization/SalApprovedPITFinalizationViewDetail';
//#endregion

//#region [module/salary/SalRewardPayslip]
import SalRewardPayslip from '../../scenes/modules/salary/salRewardPayslip/SalRewardPayslip';
import SalRewardPayslipViewDetail from '../../scenes/modules/salary/salRewardPayslip/SalRewardPayslipViewDetail';
//#endregion

//#region [module/salary/salPaymentCostRegister]
import SalSubmitPaymentCostRegister from '../../scenes/modules/salary/salPaymentCostRegister/salSubmitPaymentCostRegister/SalSubmitPaymentCostRegister';
import SalSubmitPaymentCostRegisterViewDetail from '../../scenes/modules/salary/salPaymentCostRegister/salSubmitPaymentCostRegister/SalSubmitPaymentCostRegisterViewDetail';
import SalSubmitPaymentCostRegisterMoreViewDetail from '../../scenes/modules/salary/salPaymentCostRegister/salSubmitPaymentCostRegister/SalSubmitPaymentCostRegisterMoreViewDetail';
import SalSubmitPaymentCostRegisterAddOrEdit from '../../scenes/modules/salary/salPaymentCostRegister/salSubmitPaymentCostRegister/SalSubmitPaymentCostRegisterAddOrEdit';
import SalSubmitPaymentCostRegisterAddPay from '../../scenes/modules/salary/salPaymentCostRegister/salSubmitPaymentCostRegister/SalSubmitPaymentCostRegisterAddPay';
//#endregion

//#region [module/generalInfo/Medical]
import MedImmunization from '../../scenes/modules/generalInfo/medical/medImmunization/MedImmunization';
import MedImmunizationViewDetail from '../../scenes/modules/generalInfo/medical/medImmunization/MedImmunizationViewDetail';
import MedImmunizationAddOrEdit from '../../scenes/modules/generalInfo/medical/medImmunization/MedImmunizationAddOrEdit';

import MedAnnualHealth from '../../scenes/modules/generalInfo/medical/medAnnualHealth/MedAnnualHealth';
import MedAnnualHealthViewDetail from '../../scenes/modules/generalInfo/medical/medAnnualHealth/MedAnnualHealthViewDetail';
import MedAnnualHealthAddOrEdit from '../../scenes/modules/generalInfo/medical/medAnnualHealth/MedAnnualHealthAddOrEdit';

import MedHistoryMedical from '../../scenes/modules/generalInfo/medical/medHistoryMedical/MedHistoryMedical';
import MedHistoryMedicalViewDetail from '../../scenes/modules/generalInfo/medical/medHistoryMedical/MedHistoryMedicalViewDetail';
import MedHistoryMedicalAddOrEdit from '../../scenes/modules/generalInfo/medical/medHistoryMedical/MedHistoryMedicalAddOrEdit';
import MedicalGeneral from '../../scenes/modules/generalInfo/medical/MedicalGeneral';
import SalChangePassword from '../../scenes/setting/salChangePassword/SalChangePassword';
import SalChangePasswordV3 from '../../scenes/setting/salChangePasswordV3/SalChangePasswordV3';

//#endregion

//#region [module/attendanceV3/attTamScanLogRegister
import AttSubmitTamScanLogRegisterViewDetail from '../../scenes/modules/attendanceV3/attTamScanLogRegister/attSubmitTamScanLogRegister/AttSubmitTamScanLogRegisterViewDetail';
import AttApproveTamScanLogRegisterViewDetail from '../../scenes/modules/attendanceV3/attTamScanLogRegister/attApproveTamScanLogRegister/AttApproveTamScanLogRegisterViewDetail';
import TopTabAttSubmitTamScanLogRegister from '../../scenes/modules/attendanceV3/attTamScanLogRegister/TopTabAttSubmitTamScanLogRegister';
import TopTabAttApproveTamScanLogRegister from '../../scenes/modules/attendanceV3/attTamScanLogRegister/TopTabAttApproveTamScanLogRegister';
//#endregion

//#region [module/attendanceV3/attTakeLeaveDay
// import AttSubmitTakeLeaveDay from '../../scenes/modules/attendanceV3/attTakeLeaveDay/attSubmitTakeLeaveDay/AttSubmitTakeLeaveDay';
import AttSubmitTakeLeaveDayViewDetail from '../../scenes/modules/attendanceV3/attTakeLeaveDay/attSubmitTakeLeaveDay/AttSubmitTakeLeaveDayViewDetail';
// import AttApproveTakeLeaveDay from '../../scenes/modules/attendanceV3/attTakeLeaveDay/attApproveLeaveDay/attApproveTakeLeaveDay/AttApproveTakeLeaveDay';
import AttApproveTakeLeaveDayViewDetail from '../../scenes/modules/attendanceV3/attTakeLeaveDay/attApproveLeaveDay/AttApproveTakeLeaveDayViewDetail';
// import AttApprovedTakeLeaveDay from '../../scenes/modules/attendanceV3/attTakeLeaveDay/attApproveLeaveDay/attApprovedTakeLeaveDay/AttApprovedTakeLeaveDay';
// import AttApprovedTakeLeaveDayViewDetail from '../../scenes/modules/attendanceV3/attTakeLeaveDay/attApproveLeaveDay/attApprovedTakeLeaveDay/AttApprovedTakeLeaveDayViewDetail';
import TopTabAttApproveTakeLeaveDay from '../../scenes/modules/attendanceV3/attTakeLeaveDay/TopTabAttApproveTakeLeaveDay';
import TopTabAttSubmitTakeLeaveDay from '../../scenes/modules/attendanceV3/attTakeLeaveDay/TopTabAttSubmitTakeLeaveDay.js';
//#endregion

//#region [module/attendanceV3/attTakeBusinessTrip
import TopTabAttSubmitTakeBusinessTrip from '../../scenes/modules/attendanceV3/attTakeBusinessTrip/TopTabAttSubmitTakeBusinessTrip.js';
import TopTabAttApproveTakeBusinessTrip from '../../scenes/modules/attendanceV3/attTakeBusinessTrip/TopTabAttApproveTakeBusinessTrip.js';
import AttSubmitTakeBusinessTripViewDetail from '../../scenes/modules/attendanceV3/attTakeBusinessTrip/attSubmitTakeBusinessTrip/AttSubmitTakeBusinessTripViewDetail';
import AttApproveTakeBusinessTripViewDetail from '../../scenes/modules/attendanceV3/attTakeBusinessTrip/attApproveTakeBusinessTrip/AttApproveTakeBusinessTripViewDetail';
//#endregion

// V3
// #region [module/attendanceV3/attWokringOvertime
// import AttSubmitWorkingOvertime from '../../scenes/modules/attendanceV3/attWorkingOvertime/attSubmitWorkingOvertime/AttSubmitWorkingOvertime';
import AttSubmitWorkingOvertimeViewDetail from '../../scenes/modules/attendanceV3/attWorkingOvertime/attSubmitWorkingOvertime/AttSubmitWorkingOvertimeViewDetail';
import AttApproveWorkingOvertimeViewDetail from '../../scenes/modules/attendanceV3/attWorkingOvertime/attApproveWorkingOvertime/AttApproveWorkingOvertimeViewDetail';
import TopTabAttSubmitWorkingOvertime from '../../scenes/modules/attendanceV3/attWorkingOvertime/TopTabAttSubmitWorkingOvertime';
import TopTabAttApproveWorkingOvertime from '../../scenes/modules/attendanceV3/attWorkingOvertime/TopTabAttApproveWorkingOvertime';

// #region [module/attendanceV3/attTakeLateEarlyAllowed
// import AttSubmitTakeLateEarlyAllowed from '../../scenes/modules/attendanceV3/attTakeLateEarlyAllowed/attSubmitTakeLateEarlyAllowed/AttSubmitTakeLateEarlyAllowed';
import AttSubmitTakeLateEarlyAllowedViewDetail from '../../scenes/modules/attendanceV3/attTakeLateEarlyAllowed/attSubmitTakeLateEarlyAllowed/AttSubmitTakeLateEarlyAllowedViewDetail';
import AttApproveTakeLateEarlyAllowedViewDetail from '../../scenes/modules/attendanceV3/attTakeLateEarlyAllowed/attApproveTakeLateEarlyAllowed/AttApproveTakeLateEarlyAllowedViewDetail';
import TopTabAttSubmitTakeLateEarlyAllowed from '../../scenes/modules/attendanceV3/attTakeLateEarlyAllowed/TopTabAttSubmitTakeLateEarlyAllowed.js';
import TopTabAttApproveTakeLateEarlyAllowed from '../../scenes/modules/attendanceV3/attTakeLateEarlyAllowed/TopTabAttApproveTakeLateEarlyAllowed.js';
//#endregion

//#region [tạo tab navigate và button HeaderRight cho screen Update Profile]

// #region [module/Compliment/ComCompliment
import ComCompliment from '../../scenes/modules/compliment/comCompliment/ComCompliment';
import HistoryOfComComplimented from '../../scenes/modules/compliment/historyOfComCompliment/historyOfComComplimented/HistoryOfComComplimented';
import HistoryOfComComplimenting from '../../scenes/modules/compliment/historyOfComCompliment/historyOfComComplimenting/HistoryOfComComplimenting.js';
import HistoryConversion from '../../scenes/modules/compliment/historyOfComCompliment/historyConversion/HistoryConversion.js';
import GiftComCompliment from '../../scenes/modules/compliment/giftComCompliment/GiftComCompliment.js';
import GiftComComplimentViewDetail from '../../scenes/modules/compliment/giftComCompliment/GiftComComplimentViewDetail.js';
import RankingPersonal from '../../scenes/modules/compliment/rankingCompliment/rankingPersonal/RankingPersonal.js';
import RankingPeopleGiving from '../../scenes/modules/compliment/rankingCompliment/rankingPeopleGiving/RankingPeopleGiving.js';
import RankingDepartment from '../../scenes/modules/compliment/rankingCompliment/rankingDepartment/RankingDepartment.js';
import RankingCriteria from '../../scenes/modules/compliment/rankingCompliment/rankingCriteria/RankingCriteria.js';

//#endregion

//#region [module/HreProfileCard]
import HreSubmitProfileCard from '../../scenes/modules/humanResource/hreProfileCard/hreSubmitProfileCard/HreSubmitProfileCard.js';
import HreSubmitProfileCardAddOrEdit from '../../scenes/modules/humanResource/hreProfileCard/hreSubmitProfileCard/HreSubmitProfileCardAddOrEdit.js';
import HreSubmitProfileCardViewDetail from '../../scenes/modules/humanResource/hreProfileCard/hreSubmitProfileCard/HreSubmitProfileCardViewDetail.js';
import HreApproveProfileCard from '../../scenes/modules/humanResource/hreProfileCard/hreApproveProfileCard/HreApproveProfileCard.js';
import HreApprovedProfileCard from '../../scenes/modules/humanResource/hreProfileCard/hreApprovedProfileCard/HreApprovedProfileCard.js';
import HreApproveProfileCardViewDetail from '../../scenes/modules/humanResource/hreProfileCard/hreApproveProfileCard/HreApproveProfileCardViewDetail.js';
import HreApprovedProfileCardViewDetail from '../../scenes/modules/humanResource/hreProfileCard/hreApprovedProfileCard/HreApprovedProfileCardViewDetail.js';
//#endregion

//#region [profileInfo/computerLevel]
import TopTabComputerLevel from '../../scenes/modules/generalInfo/profileInfo/computerLevel/TopTabComputerLevel.js';
import ComputerLevelWaitConfirmViewDetail from '../../scenes/modules/generalInfo/profileInfo/computerLevel/computerLevelWaitConfirm/ComputerLevelWaitConfirmViewDetail.js';
import ComputerLevelConfirmedViewDetail from '../../scenes/modules/generalInfo/profileInfo/computerLevel/computerLevelConfirmed/ComputerLevelConfirmedViewDetail.js';
import ComputerLevelAddOrEdit from '../../scenes/modules/generalInfo/profileInfo/computerLevel/ComputerLevelAddOrEdit.js';
//#endregion

//#region [profileInfo/workPermit]
import WorkPermit from '../../scenes/modules/generalInfo/profileInfo/workPermit/workPermit/WorkPermit.js';
import WorkPermitViewDetail from '../../scenes/modules/generalInfo/profileInfo/workPermit/workPermit/WorkPermitViewDetail.js';
//#endregion

//#region [profileInfo/workPermit]
import ResidenceCard from '../../scenes/modules/generalInfo/profileInfo/residenceCard/residenceCard/ResidenceCard.js';
import ResidenceCardViewDetail from '../../scenes/modules/generalInfo/profileInfo/residenceCard/residenceCard/ResidenceCardViewDetail.js';
import RenderTopTab from './RenderTopTab.js';
//#endregion

//#region [attV3/attLeaveFundManagement]
import AttLeaveFundManagement from '../../scenes/modules/attendanceV3/attLeaveFundManagement/AttLeaveFundManagement.js';
import AttLeaveFundManagementViewDetail from '../../scenes/modules/attendanceV3/attLeaveFundManagement/attLeaveFundManagementList/AttLeaveFundManagementViewDetail.js';
//#endregion

//#region [module/profileInfo/profileAddition]
import ProfileAddition from '../../scenes/modules/generalInfo/profileInfo/profileAddition/ProfileAddition.js';
//#endregion

//#region [module/humanResources/HreWorkHistory
import HreWorkHistorySubmit from '../../scenes/modules/humanResource/hreWorkHistory/hreWorkHistorySubmit/HreWorkHistorySubmit.js';
import HreWorkHistorySubmitViewDetail from '../../scenes/modules/humanResource/hreWorkHistory/hreWorkHistorySubmit/HreWorkHistorySubmitViewDetail.js';
//#endregion

//#region [module/humanResource/hreWorkManage]
import TopTabHreWorkBoard from '../../scenes/modules/humanResource/hreWorkManage/TopTabHreWorkBoard';
import HreWorkBoardViewDetail from '../../scenes/modules/humanResource/hreWorkManage/hreWorkBoard/HreWorkBoardViewDetail';
import HreWorkManageViewDetail from '../../scenes/modules/humanResource/hreWorkManage/hreWorkManage/HreWorkManageViewDetail';
import TopTabHreWorkManage from '../../scenes/modules/humanResource/hreWorkManage/TopTabHreWorkManage';
//#endregion

//#region [module/humanResource/HrePersonalManage]
import HrePersonalManage from '../../scenes/modules/humanResource/hrePersonalManage/HrePersonalManage';
import TopTabPersonalInfoManage from '../../scenes/modules/humanResource/hrePersonalManage/TopTabPersonalInfoManage.js';
import HrePersonalInfoManageViewDetail from '../../scenes/modules/humanResource/hrePersonalManage/hrePersonalInfoManage/HrePersonalInfoManageViewDetail.js';
import TopTabDocumentManage from '../../scenes/modules/humanResource/hrePersonalManage/TopTabDocumentManage.js';
import HreDocumentManageViewDetail from '../../scenes/modules/humanResource/hrePersonalManage/hreDocumentManage/HreDocumentManageViewDetail.js';
import TopTabInforContactManage from '../../scenes/modules/humanResource/hrePersonalManage/TopTabInforContactManage.js';
import HreInforContactViewDetail from '../../scenes/modules/humanResource/hrePersonalManage/hreInforContact/HreInforContactViewDetail.js';
import TopTabRelativeManage from '../../scenes/modules/humanResource/hrePersonalManage/TopTabRelativeManage.js';
import HreRelativeManageViewDetail from '../../scenes/modules/humanResource/hrePersonalManage/hreRelativeManage/HreRelativeManageViewDetail.js';
import TopTabCompensationManage from '../../scenes/modules/humanResource/hrePersonalManage/TopTabCompensationManage.js';
import HreCompensationManageViewDetail from '../../scenes/modules/humanResource/hrePersonalManage/hreCompensationManage/HreCompensationManageViewDetail.js';
import TopTabAnnualManage from '../../scenes/modules/humanResource/hrePersonalManage/TopTabAnnualManage.js';
import HreAnnualManageViewDetail from '../../scenes/modules/humanResource/hrePersonalManage/hreAnnualManage/HreAnnualManageViewDetail.js';
import TopTabRewardManage from '../../scenes/modules/humanResource/hrePersonalManage/TopTabRewardManage.js';
import HreRewardManageViewDetail from '../../scenes/modules/humanResource/hrePersonalManage/hreRewardManage/HreRewardManageViewDetail.js';
import TopTabCandidateHistory from '../../scenes/modules/humanResource/hrePersonalManage/TopTabCandidateHistory.js';
import HreCandidateHistoryViewDetail from '../../scenes/modules/humanResource/hrePersonalManage/hreCandidateHistory/HreCandidateHistoryViewDetail.js';
import TopTabPersonalInfoProfileIdentification from '../../scenes/modules/humanResource/hrePersonalManage/hrePersonalInfoProfileIdentification/TopTabPersonalInfoProfileIdentification.js';
import HrePersonalInfoProfileIdentificationViewDetail from '../../scenes/modules/humanResource/hrePersonalManage/hrePersonalInfoProfileIdentification/HrePersonalInfoProfileIdentificationViewDetail.js';
import TopTabEducationLevel from '../../scenes/modules/humanResource/hrePersonalManage/TopTabEducationLevel.js';
import HreEducationLevelViewDetail from '../../scenes/modules/humanResource/hrePersonalManage/hreEducationLevel/HreEducationLevelViewDetail.js';
import TopTabContractManage from '../../scenes/modules/humanResource/hrePersonalManage/TopTabContractManage.js';
import HreContractManageViewDetail from '../../scenes/modules/humanResource/hrePersonalManage/hreContractManage/HreContractManageViewDetail.js';
import TopTabAccidentManage from '../../scenes/modules/humanResource/hrePersonalManage/TopTabAccidentManage.js';
import HreAccidentManageViewDetail from '../../scenes/modules/humanResource/hrePersonalManage/hreAccidentManage/HreAccidentManageViewDetail.js';
import TopTabPartyAndUnionManage from '../../scenes/modules/humanResource/hrePersonalManage/TopTabPartyAndUnionManage.js';
import HrePartyAndUnionViewDetail from '../../scenes/modules/humanResource/hrePersonalManage/hrePartyAndUnionManage/HrePartyAndUnionViewDetail.js';
import TopTabHreMovementHistory from '../../scenes/modules/humanResource/hrePersonalManage/TopTabHreMovementHistory.js';
import HreMovementHistoryViewDetail from '../../scenes/modules/humanResource/hrePersonalManage/hreMovementHistory/HreMovementHistoryViewDetail.js';
import TopTabConcurrentManage from '../../scenes/modules/humanResource/hrePersonalManage/TopTabConcurrentManage.js';
import HreConcurrentManageViewDetail from '../../scenes/modules/humanResource/hrePersonalManage/hreConcurrentManage/HreConcurrentManageViewDetail.js';
import TopTabDisciplineManage from '../../scenes/modules/humanResource/hrePersonalManage/TopTabDisciplineManage.js';
import HreDisciplineManageViewDetail from '../../scenes/modules/humanResource/hrePersonalManage/hreDisciplineManage/HreDisciplineManageViewDetail.js';
import TopTabTaxPayManage from '../../scenes/modules/humanResource/hrePersonalManage/TopTabTaxPayManage.js';
import HreTaxPayManageViewDetail from '../../scenes/modules/humanResource/hrePersonalManage/hreTaxPayManage/HreTaxPayManageViewDetail.js';
import TopTabInsuranceManage from '../../scenes/modules/humanResource/hrePersonalManage/TopTabInsuranceManage.js';
import HreInsuranceManageViewDetail from '../../scenes/modules/humanResource/hrePersonalManage/hreInsuranceManage/HreInsuranceManageViewDetail.js';
//#endregion

// #region [module/humanResource/hreTerminationOfWork
import HreSubmitTerminationOfWork from '../../scenes/modules/humanResource/hreTerminationOfWork/hreSubmitTerminationOfWork/HreSubmitTerminationOfWork.js';
import HreSubmitTerminationOfWorkViewDetail from '../../scenes/modules/humanResource/hreTerminationOfWork/hreSubmitTerminationOfWork/HreSubmitTerminationOfWorkViewDetail.js';
import HreApproveTerminationOfWorkViewDetail from '../../scenes/modules/humanResource/hreTerminationOfWork/hreApproveTerminationOfWork/HreApproveTerminationOfWorkViewDetail.js';
import TopTabHreApproveTerminationOfWork from '../../scenes/modules/humanResource/hreTerminationOfWork/TopTabHreApproveTerminationOfWork.js';
//region [module/humanResource/hreEventCalendar]
import HreEventCalendar from '../../scenes/modules/humanResource/hreEventCalendar/hreEventCalendar/HreEventCalendar.js';
//#endregion

//#region [module/other/generalChart]
import TopTabChOrgChart from '../../scenes/modules/other/generalChart/chOrgChart/TopTabChOrgChart.js';
//#endregion

// #region [module/humanResource/hreEvalutionContract
import TopTabEvalutionContract from '../../scenes/modules/humanResource/hreEvalutionContract/TopTabEvalutionContract.js';
import HreEvalutionContractViewDetail from '../../scenes/modules/humanResource/hreEvalutionContract/hreEvalutionContract/HreEvalutionContractViewDetail.js';
//#endregion

// #region [module/salaryV3/salPITFinalization
import TopTabSalSubmitPITFinalization from '../../scenes/modules/salaryV3/salPITFinalization/TopTabSalSubmitPITFinalization.js';
import SalSubmitPITFinalizationViewDetail from '../../scenes/modules/salaryV3/salPITFinalization/salSubmitPITFinalization/SalSubmitPITFinalizationViewDetail.js';
//#endregion

//region [module/humanResource/hreEvaluationResult]
import HreEvaluationResult from '../../scenes/modules/humanResource/hreEvaluationResult/hreEvaluationResult/HreEvaluationResult.js';
//#endregion

//region [module/humanResource/hreProfileBadge]
import HreProfileBadge from '../../scenes/modules/humanResource/hreProfileBadge/HreProfileBadge.js';
//#endregion

//region [module/attendanceV3/attRosterShiftChange]
import TopTabAttSubmitShiftChange from '../../scenes/modules/attendanceV3/attRosterShiftChange/TopTabAttSubmitShiftChange.js';
import AttSubmitShiftChangeViewDetail from '../../scenes/modules/attendanceV3/attRosterShiftChange/attSubmitShiftChange/AttSubmitShiftChangeViewDetail.js';
//#endregion

//region [module/attendanceV3/attTakeDailyTask]
import TopTabAttSubmitTakeDailyTask from '../../scenes/modules/attendanceV3/attTakeDailyTask/TopTabAttSubmitTakeDailyTask.js';
import TopTabAttApproveTakeDailyTask from '../../scenes/modules/attendanceV3/attTakeDailyTask/TopTabAttApproveTakeDailyTask.js';
import AttApproveTakeDailyTaskViewDetail from '../../scenes/modules/attendanceV3/attTakeDailyTask/attApproveTakeDailyTask/AttApproveTakeDailyTaskViewDetail.js';
import AttSubmitTakeDailyTaskViewDetail from '../../scenes/modules/attendanceV3/attTakeDailyTask/attSubmitTakeDailyTask/AttSubmitTakeDailyTaskViewDetail.js';
//#endregion

// import ScanFaceViewDetail from '../../scenes/faceAuthentication/ScanFaceViewDetail.js';

// visa
import VisaViewDetail from '../../scenes/modules/generalInfo/profileInfo/visa/VisaViewDetail.js';
//region [module/humanResourceV3/hreInterview/hreInterviewCalendar]
import HreInterviewCalendar from '../../scenes/modules/humanResourceV3/hreRecruitment/hreInterview/hreInterviewCalendar/hreInterviewCalendar/HreInterviewCalendar.js';
import TopTabHreInterview from '../../scenes/modules/humanResourceV3/hreRecruitment/hreInterview/hreInterview/TopTabHreInterview.js';
import TopTabHreCandidateDetail from '../../scenes/modules/humanResourceV3/hreRecruitment/hreCandidateDetail/TopTabHreCandidateDetail.js';
import HreResultInterviewViewDetail from '../../scenes/modules/humanResourceV3/hreRecruitment/hreInterview/hreInterview/HreResultInterviewViewDetail.js';
//#endregion

//region [module/humanResourceV3/hreRecruitmentProposalProcessing]
import TopTabHreRecruitmentProposalProcessing from '../../scenes/modules/humanResourceV3/hreRecruitment/hreRecruitmentProposalProcessing/TopTabHreRecruitmentProposalProcessing.js';
import HreRecruitmentProposalProcessingViewDetail from '../../scenes/modules/humanResourceV3/hreRecruitment/hreRecruitmentProposalProcessing/HreRecruitmentProposalProcessingViewDetail.js';
//#endregion

// #region [module/humanResourceV3
import TopTabHreProcessingCandidateApplications from '../../scenes/modules/humanResourceV3/hreRecruitment/hreProcessingCandidateApplications/TopTabHreProcessingCandidateApplications.js';
import HreProcessingCandidateApplicationsViewDetail from '../../scenes/modules/humanResourceV3/hreRecruitment/hreProcessingCandidateApplications/HreProcessingCandidateApplicationsViewDetail.js';

//hreRecruitmentReport
import TopTabHreRecruitmentReport from '../../scenes/modules/humanResourceV3/hreRecruitment/hreRecruitmentReport/TopTabHreRecruitmentReport.js';
import HreRecruitmentReportViewDetail from '../../scenes/modules/humanResourceV3/hreRecruitment/hreRecruitmentReport/HreRecruitmentReportViewDetail.js';

// #region [module/humanResourceV3/hreApproveRecruitmentProposal
import TopTabHreApproveRecruitmentProposal from '../../scenes/modules/humanResourceV3/hreRecruitment/hreApproveRecruitmentProposal/TopTabHreApproveRecruitmentProposal.js';
import HreApproveRecruitmentProposalViewDetail from '../../scenes/modules/humanResourceV3/hreRecruitment/hreApproveRecruitmentProposal/HreApproveRecruitmentProposalViewDetail.js';

//#endregion

// #region [module/attv3/attLeaveDayReplacement]
import TopTabAttLeaveDayReplacement from '../../scenes/modules/attendanceV3/attLeaveDayReplacement/TopTabAttLeaveDayReplacement.js';
import AttLeaveDayReplacementViewDetail from '../../scenes/modules/attendanceV3/attLeaveDayReplacement/AttLeaveDayReplacementViewDetail.js';
//#endregion

// #region [module/humanResourceV3/hreReceiveJob
import TopTabHreReceiveJob from '../../scenes/modules/humanResourceV3/hreRecruitment/hreReceiveJob/TopTabHreReceiveJob.js';

//#endregion

//region [module/humanResourceV3/hreRecruitmentProposalProcessing]
import HreCandidateProfile from '../../scenes/modules/humanResourceV3/hreRecruitment/hreCandidateProfile/HreCandidateProfile.js';
import HreCandidateProfileViewDetail from '../../scenes/modules/humanResourceV3/hreRecruitment/hreCandidateProfile/HreCandidateProfileViewDetail.js';
//#endregion

//region [module/humanResourceV3/hreProcessingPostingPlan]
import TopTabHreProcessingPostingPlan from '../../scenes/modules/humanResourceV3/hreRecruitment/hreProcessingPostingPlan/TopTabHreProcessingPostingPlan.js';
import HreProcessingPostingPlanViewDetail from '../../scenes/modules/humanResourceV3/hreRecruitment/hreProcessingPostingPlan/HreProcessingPostingPlanViewDetail.js';
//#endregion

import Loan from '../../scenes/modules/generalInfo/profileInfo/loan/Loan.js';

import AttNumberOfMeals from '../../scenes/modules/attendanceV3/attNumberOfMeals/AttNumberOfMeals.js';
import AttNumberOfMealsHistory from '../../scenes/modules/attendanceV3/attNumberOfMeals/AttNumberOfMealsHistory.js';

const TopTabProfileInfoUpdate = createMaterialTopTabNavigator(
    {
        TopTabProfileBasicInfoUpdate: {
            screen: TopTabProfileBasicInfoUpdate
        },
        TopTabProfilePersonalInfoUpdate: {
            screen: TopTabProfilePersonalInfoUpdate
        },
        TopTabProfileContactInfoUpdate: {
            screen: TopTabProfileContactInfoUpdate
        }
    },
    {
        lazy: true,
        swipeEnabled: true,
        tabBarComponent: navigationAll => {
            const data = [
                {
                    title: 'HRM_HR_Profile_Basic',
                    screenName: ScreenName.TopTabProfileBasicInfoUpdate
                },
                {
                    title: 'HRM_HR_Profile_PersonalInfo',
                    screenName: ScreenName.TopTabProfilePersonalInfoUpdate
                },
                {
                    title: 'HRM_HR_Profile_ContactInfo',
                    screenName: ScreenName.TopTabProfileContactInfoUpdate
                }
            ];

            return <RenderTopTab data={data} navigationAll={navigationAll} />;
        }
    }
);

const navigationOptionsProfile = (navigation, Title_Key) => {
    return {
        tabBarVisible: false,
        title: (
            <VnrText i18nKey={Title_Key} style={styleSheets.headerTitleStyle}>
                {Title_Key}
            </VnrText>
        ),
        headerLeft: <ButtonGoBack Key={Title_Key} navigation={navigation} />,
        headerStyle: {
            backgroundColor: Colors.white,
            shadowColor: 'transparent',
            shadowRadius: 0,
            shadowOffset: {
                height: 0
            },
            elevation: 0
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
            fontWeight: '500'
        }
        // headerRight: () => {

        //     let screenNavigate = 'ProfileInfoUpdate';
        //     if (navigation.state.index == 0)
        //         screenNavigate = 'TopTabProfileBasicInfoUpdate';
        //     else if (navigation.state.index == 1)
        //         screenNavigate = 'TopTabProfilePersonalInfoUpdate';
        //     else if (navigation.state.index == 2)
        //         screenNavigate = 'TopTabProfileContactInfoUpdate';

        //     if (
        //         PermissionForAppMobile &&
        //         PermissionForAppMobile.value['Personal_GeneralProfileDetail_btnUpdateBasic_Portal'] &&
        //         PermissionForAppMobile.value['Personal_GeneralProfileDetail_btnUpdateBasic_Portal']['View']
        //     ) {
        //         return (
        //             <View
        //                 style={{
        //                     flex: 1,
        //                     flexDirection: 'row',
        //                     justifyContent: 'center',
        //                     alignItems: 'center',
        //                 }}
        //             >
        //                 <TouchableOpacity
        //                     onPress={() => {
        //                         let navBasicInfo = navigation.getChildNavigation('TopTabProfileBasicInfo'),
        //                             navPersonalInfo = navigation.getChildNavigation('TopTabProfilePersonalInfo'),
        //                             navContactInfo = navigation.getChildNavigation('TopTabProfileContactInfo');

        //                         if (
        //                             !Vnr_Function.CheckIsNullOrEmpty(navBasicInfo.state.params) &&
        //                             !Vnr_Function.CheckIsNullOrEmpty(navBasicInfo.state.params.reload)
        //                         ) {
        //                             navigation.navigate(screenNavigate, {
        //                                 reload: navBasicInfo.state.params.reload,
        //                             });
        //                         } else if (
        //                             !Vnr_Function.CheckIsNullOrEmpty(navPersonalInfo.state.params) &&
        //                             !Vnr_Function.CheckIsNullOrEmpty(navPersonalInfo.state.params.reload)
        //                         ) {
        //                             navigation.navigate(screenNavigate, {
        //                                 reload: navPersonalInfo.state.params.reload,
        //                             });
        //                         } else if (
        //                             !Vnr_Function.CheckIsNullOrEmpty(navContactInfo.state.params) &&
        //                             !Vnr_Function.CheckIsNullOrEmpty(navContactInfo.state.params.reload)
        //                         ) {
        //                             navigation.navigate(screenNavigate, {
        //                                 reload: navContactInfo.state.params.reload,
        //                             });
        //                         }
        //                         // else {
        //                         //   navigation.navigate('ProfileInfoUpdate');
        //                         // }
        //                     }}
        //                 >
        //                     <View style={styleSheets.bnt_HeaderRight}>
        //                         <IconEditSquare size={Size.iconSizeHeader} color={Colors.gray_10} />
        //                     </View>
        //                 </TouchableOpacity>
        //             </View>
        //         );
        //     } else {
        //         return null;
        //     }
        // },
    };
};

const navigationOptionsProfileUpdate = (navigation, Title_Key) => {
    return {
        tabBarVisible: false,
        title: (
            <VnrText i18nKey={Title_Key} style={styleSheets.headerTitleStyle}>
                {Title_Key}
            </VnrText>
        ),
        // headerLeft: () => <ButtonGoBack Key={Title_Key} navigation={navigation}></ButtonGoBack>,
        // eslint-disable-next-line react/display-name
        headerLeft: () => {
            return (
                <View
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            let navBasicInfoUpdate = navigation.getChildNavigation('TopTabProfileBasicInfoUpdate'),
                                navPersonalInfoUpdate = navigation.getChildNavigation(
                                    'TopTabProfilePersonalInfoUpdate'
                                ),
                                navContactInfoUpdate = navigation.getChildNavigation('TopTabProfileContactInfoUpdate'),
                                dataBasic = null,
                                dataPersonal = null,
                                currentScreen = DrawerServices.getCurrentScreen(),
                                dataContact = null;

                            //get data tab basic
                            if (
                                navBasicInfoUpdate.state.params &&
                                navBasicInfoUpdate.state.params.getDataUpdate &&
                                typeof navBasicInfoUpdate.state.params.getDataUpdate === 'function'
                            ) {
                                dataBasic = navBasicInfoUpdate.state.params.getDataUpdate();
                            }

                            //get data tab personal
                            if (
                                navPersonalInfoUpdate.state.params &&
                                navPersonalInfoUpdate.state.params.getDataUpdate &&
                                typeof navPersonalInfoUpdate.state.params.getDataUpdate === 'function'
                            ) {
                                dataPersonal = navPersonalInfoUpdate.state.params.getDataUpdate();
                            }

                            //get data tab contact
                            if (
                                navContactInfoUpdate.state.params &&
                                navContactInfoUpdate.state.params.getDataUpdate &&
                                typeof navContactInfoUpdate.state.params.getDataUpdate === 'function'
                            ) {
                                dataContact = navContactInfoUpdate.state.params.getDataUpdate();
                            }

                            const handleGoBack = () => {
                                const updateIndex = currentScreen.indexOf('Update');
                                const tobTabInfoScreen = currentScreen.substring(0, updateIndex);
                                DrawerServices.navigate(tobTabInfoScreen);
                            }

                            //kiểm tra có thông tin thay đổi ở 3 tab
                            if (!dataBasic && !dataContact && !dataPersonal) {
                                handleGoBack()
                            } else {
                                AlertSevice.alert({
                                    iconType: EnumIcon.E_CONFIRM,
                                    message: translate('DoyouwanttoupdateChangesIncollaborativeprocess'),
                                    onCancel: () => {
                                        //undo tab nhân viên cơ bản
                                        if (
                                            navBasicInfoUpdate.state.params &&
                                            navBasicInfoUpdate.state.params.undoUpdate &&
                                            typeof navBasicInfoUpdate.state.params.undoUpdate === 'function'
                                        ) {
                                            navBasicInfoUpdate.state.params.undoUpdate();
                                        }

                                        //undo tab cá nhân
                                        if (
                                            navPersonalInfoUpdate.state.params &&
                                            navPersonalInfoUpdate.state.params.undoUpdate &&
                                            typeof navPersonalInfoUpdate.state.params.undoUpdate === 'function'
                                        ) {
                                            navPersonalInfoUpdate.state.params.undoUpdate();
                                        }

                                        //undo tab liên hệ
                                        if (
                                            navContactInfoUpdate.state.params &&
                                            navContactInfoUpdate.state.params.undoUpdate &&
                                            typeof navContactInfoUpdate.state.params.undoUpdate === 'function'
                                        ) {
                                            navContactInfoUpdate.state.params.undoUpdate();
                                        }

                                        handleGoBack()
                                    },
                                    onConfirm: () => {
                                        let arrRequest = [];

                                        //update basice
                                        if (dataBasic) {
                                            dataBasic.IsPortalApp = true;
                                            arrRequest.push(
                                                HttpService.Post('[URI_HR]/Hre_GetDataV2/CreateBasicInfo', dataBasic)
                                            );
                                        }

                                        //update personal
                                        if (dataPersonal) {
                                            dataPersonal.IsPortalApp = true;
                                            arrRequest.push(
                                                HttpService.Post('[URI_HR]/Hre_GetDataV2/CreatePersonalInfo', dataPersonal)
                                            );
                                        }

                                        //update contact
                                        if (dataContact) {
                                            dataContact.IsPortalApp = true;
                                            arrRequest.push(
                                                HttpService.Post('[URI_HR]/Hre_GetDataV2/CreateContactInfo', dataContact)
                                            );
                                        }

                                        VnrLoadingSevices.show();
                                        HttpService.MultiRequest(arrRequest).then(res => {
                                            VnrLoadingSevices.hide();
                                            try {
                                                if (res && typeof res == 'object') {
                                                    //lưu thành công
                                                    if (
                                                        (res['0'] && res['0'].ActionStatus === 'Success') ||
                                                        (res['1'] && res['1'].ActionStatus === 'Success') ||
                                                        (res['2'] && res['2'].ActionStatus === 'Success')
                                                    ) {
                                                        //thông báo
                                                        ToasterSevice.showSuccess(
                                                            'HRM_Attendance_WorkDay_UpdateSuccess',
                                                            5000
                                                        );

                                                        //back về
                                                        handleGoBack()
                                                        // DrawerServices.navigate('ProfileInfo');

                                                        //reload lại ProfileInfo
                                                        if (
                                                            navBasicInfoUpdate.state.params &&
                                                            navBasicInfoUpdate.state.params.reload &&
                                                            typeof navBasicInfoUpdate.state.params.reload === 'function'
                                                        ) {
                                                            navBasicInfoUpdate.state.params.reload();
                                                        }
                                                    } else {
                                                        //cộng chuỗi các mess trả về để thông báo
                                                        let mes = '';

                                                        if (res['0'] && res['0'].ActionStatus) {
                                                            mes = res['0'].ActionStatus;
                                                        }

                                                        if (res['1'] && res['1'].ActionStatus) {
                                                            mes = res['1'].ActionStatus;
                                                        }

                                                        if (res['2'] && res['2'].ActionStatus) {
                                                            mes = res['2'].ActionStatus;
                                                        }

                                                        ToasterSevice.showWarning(mes, 5000);
                                                    }
                                                } else {
                                                    DrawerServices.navigate('ErrorScreen');
                                                }
                                            } catch (error) {
                                                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                                            }
                                        });
                                    }
                                });
                            }
                        }}
                    >
                        <View
                            // eslint-disable-next-line react-native/no-inline-styles
                            style={{
                                marginLeft: 5
                            }}
                        >
                            <IconBack size={Size.iconSizeHeader} color={Colors.gray_10} />
                        </View>
                        {/* <ButtonGoBack Key={Title_Key} navigation={navigation}></ButtonGoBack> */}
                    </TouchableOpacity>
                </View>
            );
        },
        headerStyle: {
            backgroundColor: Colors.white,
            shadowColor: 'transparent',
            shadowRadius: 0,
            shadowOffset: {
                height: 0
            },
            elevation: 0
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
            textTransform: 'uppercase',
            fontWeight: '500'
        },
        headerRight: () => {
            let screenNavigate = 'TopTabHisProfileInfo';

            let perTabBacsicInfo = false,
                perTabPersonalInfo = false,
                perTabContactInfo = false;

            if (
                PermissionForAppMobile &&
                PermissionForAppMobile.value['HRM_HR_Profile_BasicInfo_Grid_WaitingConfirm'] &&
                PermissionForAppMobile.value['HRM_HR_Profile_BasicInfo_Grid_WaitingConfirm']['View']
            ) {
                if (navigation.state.index == 0) screenNavigate = 'TopTabHisProfileBasicInfo';
                perTabBacsicInfo = true;
            }

            if (
                PermissionForAppMobile &&
                PermissionForAppMobile.value['HRM_HR_Profile_PersonalInfo_Grid_WaitingConfirm'] &&
                PermissionForAppMobile.value['HRM_HR_Profile_PersonalInfo_Grid_WaitingConfirm']['View']
            ) {
                if (navigation.state.index == 1) screenNavigate = 'TopTabHisProfilePersonalInfo';
                perTabPersonalInfo = true;
            }

            if (
                PermissionForAppMobile &&
                PermissionForAppMobile.value['HRM_HR_Profile_PersonalContact_Grid_WaitingConfirm'] &&
                PermissionForAppMobile.value['HRM_HR_Profile_PersonalContact_Grid_WaitingConfirm']['View']
            ) {
                if (navigation.state.index == 2) screenNavigate = 'TopTabHisProfileContactInfo';

                perTabContactInfo = true;
            }

            if (perTabBacsicInfo || perTabPersonalInfo || perTabContactInfo)
                return (
                    <TouchableOpacity onPress={() => navigation.navigate(screenNavigate)}>
                        <View style={styleSheets.bnt_HeaderRight}>
                            <VnrText
                                style={[styleSheets.lable, { color: Colors.blue }]}
                                i18nKey={'HRM_AppPortal_History_ProfileInfo'}
                            />
                        </View>
                    </TouchableOpacity>
                );
        }
    };
};

//#endregion

//#region [tạo Ham xữ lý nút goback và relaod webview News]
const navigationOptionsGobackNews = (navigation, Title_Key) => {
    return {
        tabBarVisible: false,
        title: (
            <VnrText i18nKey={Title_Key} style={styleSheets.headerTitleStyle}>
                {Title_Key}
            </VnrText>
        ),
        // eslint-disable-next-line react/display-name
        headerLeft: () => {
            return (
                <View
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            const { params = {} } = navigation.state;
                            params && params.goback && params.goback();
                        }}
                    >
                        <View
                            // eslint-disable-next-line react-native/no-inline-styles
                            style={{
                                marginLeft: 5
                            }}
                        >
                            <IconBack size={Size.iconSizeHeader} color={Colors.gray_10} />
                        </View>
                    </TouchableOpacity>
                </View>
            );
        },
        headerStyle: {
            backgroundColor: Colors.white,
            shadowColor: 'transparent',
            shadowRadius: 0,
            shadowOffset: {
                height: 0
            },
            elevation: 0,
            borderBottomColor: Colors.gray_5,
            borderBottomWidth: 0.5
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
            fontWeight: '500'
        }
    };
};
//#endregion

//#region [tạo tab navigate và button HeaderRight cho screen approve leaveday]
const TopTabAttApproveLeaveDay = createMaterialTopTabNavigator(
    {
        AttApproveLeaveDay: {
            screen: AttApproveLeaveDay,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_Approve')
        },
        AttApprovedLeaveDay: {
            screen: AttApprovedLeaveDay,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_IsApproved')
        }
    },
    {
        tabBarOptions: {
            style: {
                backgroundColor: Colors.white,
                borderTopColor: Colors.white,
                borderTopWidth: 0
            },
            activeTintColor: Colors.primary,
            inactiveTintColor: Colors.gray_10,
            labelStyle: styleSheets.lable,
            indicatorStyle: {
                borderBottomColor: Colors.primary,
                borderBottomWidth: 2.5
            },
            upperCaseLabel: false
        },
        lazy: true
    }
);
//#endregion

//#region [tạo tab navigate và button HeaderRight cho screen approve leavedayCancel]
const TopTabAttApproveLeaveDayCancel = createMaterialTopTabNavigator(
    {
        AttApproveLeaveDayCancel: {
            screen: AttApproveLeaveDayCancel,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_Approve')
        },
        AttApprovedLeaveDayCancel: {
            screen: AttApprovedLeaveDayCancel,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_IsApproved')
        }
    },
    {
        tabBarOptions: {
            style: {
                backgroundColor: Colors.white,
                borderTopColor: Colors.white,
                borderTopWidth: 0
            },
            activeTintColor: Colors.primary,
            inactiveTintColor: Colors.gray_10,
            labelStyle: styleSheets.lable,
            indicatorStyle: {
                borderBottomColor: Colors.primary,
                borderBottomWidth: 2.5
            },
            upperCaseLabel: false
        },
        lazy: true
    }
);
//#endregion

//#region [tạo tab navigate và button HeaderRight cho screen approve TSCLRegister]
const TopTabAttApproveTSLRegister = createMaterialTopTabNavigator(
    {
        AttApproveTSLRegister: {
            screen: AttApproveTSLRegister,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_Approve')
        },
        AttApprovedTSLRegister: {
            screen: AttApprovedTSLRegister,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_IsApproved')
        }
    },
    {
        tabBarOptions: {
            style: {
                backgroundColor: Colors.white,
                borderTopColor: Colors.white,
                borderTopWidth: 0
            },
            activeTintColor: Colors.primary,
            inactiveTintColor: Colors.gray_10,
            labelStyle: styleSheets.lable,
            indicatorStyle: {
                borderBottomColor: Colors.primary,
                borderBottomWidth: 2.5
            },
            upperCaseLabel: false
        },
        lazy: true
    }
);
//#endregion

//#region [tạo tab navigate và button HeaderRight cho screen approve TakeLeaveDay V3]
// const TopTabAttApproveTakeBusinessTrip = createMaterialTopTabNavigator(
//     {
//         AttApproveTakeBusinessTrip: {
//             screen: AttApproveTakeBusinessTrip,
//             navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Sal_WaitingConfirmPaymentCost')
//         },
//         AttApprovedTakeBusinessTrip: {
//             screen: AttApprovedTakeBusinessTrip,
//             navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Sal_ConfirmPaymentCost')
//         }
//     },
//     {
//         tabBarOptions: {
//             style: {
//                 backgroundColor: Colors.white,
//                 borderTopColor: Colors.white,
//                 borderTopWidth: 0
//             },
//             activeTintColor: Colors.primary,
//             inactiveTintColor: Colors.gray_10,
//             labelStyle: styleSheets.lable,
//             indicatorStyle: {
//                 borderBottomColor: Colors.primary,
//                 borderBottomWidth: 2.5
//             },
//             upperCaseLabel: false
//         },
//         lazy: true
//     }
// );
//#endregion

//#region [tạo tab navigate và button HeaderRight cho screen approve OverTime]
const TopTabAttApproveOvertime = createMaterialTopTabNavigator(
    {
        AttApproveOvertime: {
            screen: AttApproveOvertime,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_Approve')
        },
        AttApprovedOvertime: {
            screen: AttApprovedOvertime,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_IsApproved')
        }
    },
    {
        tabBarOptions: {
            style: {
                backgroundColor: Colors.white,
                borderTopColor: Colors.white,
                borderTopWidth: 0
            },
            activeTintColor: Colors.primary,
            inactiveTintColor: Colors.gray_10,
            labelStyle: styleSheets.lable,
            indicatorStyle: {
                borderBottomColor: Colors.primary,
                borderBottomWidth: 2.5
            },
            upperCaseLabel: false
        },
        lazy: true
    }
);
//#endregion

//#region [tạo tab navigate và button HeaderRight cho screen HreApproveEvaluationDoc]
const TopTabHreApproveEvaluationDoc = createMaterialTopTabNavigator(
    {
        HreApproveEvaluationDoc: {
            screen: HreApproveEvaluationDoc,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_Approve')
        },
        HreApprovedEvaluationDoc: {
            screen: HreApprovedEvaluationDoc,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_IsApproved')
        }
    },
    {
        tabBarOptions: {
            style: {
                backgroundColor: Colors.white,
                borderTopColor: Colors.white,
                borderTopWidth: 0
            },
            activeTintColor: Colors.primary,
            inactiveTintColor: Colors.gray_10,
            labelStyle: styleSheets.lable,
            indicatorStyle: {
                borderBottomColor: Colors.primary,
                borderBottomWidth: 2.5
            },
            upperCaseLabel: false
        },
        lazy: true
    }
);
//#endregion

//#region [tạo tab navigate và button HeaderRight cho screen HreApproveViolation]
const TopTabHreApproveViolation = createMaterialTopTabNavigator(
    {
        HreApproveViolation: {
            screen: HreApproveViolation,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_Approve')
        },
        HreApprovedViolation: {
            screen: HreApprovedViolation,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_IsApproved')
        }
    },
    {
        tabBarOptions: {
            style: {
                backgroundColor: Colors.white,
                borderTopColor: Colors.white,
                borderTopWidth: 0
            },
            activeTintColor: Colors.primary,
            inactiveTintColor: Colors.gray_10,
            labelStyle: styleSheets.lable,
            indicatorStyle: {
                borderBottomColor: Colors.primary,
                borderBottomWidth: 2.5
            },
            upperCaseLabel: false
        },
        lazy: true
    }
);
//#endregion

//#region [tạo tab navigate và button HeaderRight cho screen approve LateEarlyAllowed]
const TopTabAttApproveLateEarlyAllowed = createMaterialTopTabNavigator(
    {
        AttApproveLateEarlyAllowed: {
            screen: AttApproveLateEarlyAllowed,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_Approve')
        },
        AttApprovedLateEarlyAllowed: {
            screen: AttApprovedLateEarlyAllowed,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_IsApproved')
        }
    },
    {
        tabBarOptions: {
            style: {
                backgroundColor: Colors.white,
                borderTopColor: Colors.white,
                borderTopWidth: 0
            },
            activeTintColor: Colors.primary,
            inactiveTintColor: Colors.gray_10,
            labelStyle: styleSheets.lable,
            indicatorStyle: {
                borderBottomColor: Colors.primary,
                borderBottomWidth: 2.5
            },
            upperCaseLabel: false
        },
        lazy: true
    }
);
//#endregion

//#region [tạo tab navigate và button HeaderRight cho screen approve PlanOvertime]
const TopTabAttApprovePlanOvertime = createMaterialTopTabNavigator(
    {
        AttApprovePlanOvertime: {
            screen: AttApprovePlanOvertime,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_Approve')
        },
        AttApprovedPlanOvertime: {
            screen: AttApprovedPlanOvertime,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_IsApproved')
        }
    },
    {
        tabBarOptions: {
            style: {
                backgroundColor: Colors.white,
                borderTopColor: Colors.white,
                borderTopWidth: 0
            },
            activeTintColor: Colors.primary,
            inactiveTintColor: Colors.gray_10,
            labelStyle: styleSheets.lable,
            indicatorStyle: {
                borderBottomColor: Colors.primary,
                borderBottomWidth: 2.5
            },
            upperCaseLabel: false
        },
        lazy: true
    }
);
//#endregion

//#region [tạo tab navigate và button HeaderRight cho screen approve PlanOvertimeCancel]
const TopTabAttApprovePlanOvertimeCancel = createMaterialTopTabNavigator(
    {
        AttApprovePlanOvertimeCancel: {
            screen: AttApprovePlanOvertimeCancel,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_Approve')
        },
        AttApprovedPlanOvertimeCancel: {
            screen: AttApprovedPlanOvertimeCancel,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_IsApproved')
        }
    },
    {
        tabBarOptions: {
            style: {
                backgroundColor: Colors.white,
                borderTopColor: Colors.white,
                borderTopWidth: 0
            },
            activeTintColor: Colors.primary,
            inactiveTintColor: Colors.gray_10,
            labelStyle: styleSheets.lable,
            indicatorStyle: {
                borderBottomColor: Colors.primary,
                borderBottomWidth: 2.5
            },
            upperCaseLabel: false
        },
        lazy: true
    }
);
//#endregion

// add new by nhan
//#region [tạo tab navigate và button HeaderRight cho screen approve RegisterVehicle]
const TopTabAttApproveRegisterVehicle = createMaterialTopTabNavigator(
    {
        AttApproveRegisterVehicle: {
            screen: AttApproveRegisterVehicle,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_TamScanLogRegister_Approve')
        },
        AttApprovedRegisterVehicle: {
            screen: AttApprovedRegisterVehicle,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_RegisterVehicle_Approved')
        }
    },
    {
        tabBarOptions: {
            style: {
                backgroundColor: Colors.white,
                borderTopColor: Colors.white,
                borderTopWidth: 0
            },
            activeTintColor: Colors.primary,
            inactiveTintColor: Colors.gray_10,
            labelStyle: styleSheets.lable,
            indicatorStyle: {
                borderBottomColor: Colors.primary,
                borderBottomWidth: 2.5
            },
            upperCaseLabel: false
        },
        lazy: true
    }
);
//#endregion

//#region [tạo tab navigate và button HeaderRight cho screen approve TaxInformationRegister]
const TopTabTaxApproveTaxInformationRegister = createMaterialTopTabNavigator(
    {
        TaxApproveTaxInformationRegister: {
            screen: TaxApproveTaxInformationRegister
        },
        TaxApprovedTaxInformationRegister: {
            screen: TaxApprovedTaxInformationRegister
        }
    },
    {
        lazy: true,
        swipeEnabled: true,
        tabBarComponent: navigationAll => {
            const data = [
                {
                    title: 'PromotionClassQualification__E_WAITCONFIRM',
                    screenName: ScreenName.TaxApproveTaxInformationRegister
                },
                {
                    title: 'PayrollPaybackStatus__E_CONFIRMED',
                    screenName: ScreenName.TaxApprovedTaxInformationRegister
                }
            ];

            return <RenderTopTab data={data} navigationAll={navigationAll} />;
        }
    }
);
//#endregion

//#region [tạo tab navigate và button HeaderRight cho screen approve SalPITFinalization]
const TopTabSalApprovePITFinalization = createMaterialTopTabNavigator(
    {
        SalApprovePITFinalization: {
            screen: SalApprovePITFinalization
        },
        SalApprovedPITFinalization: {
            screen: SalApprovedPITFinalization
        }
    },
    {
        lazy: true,
        swipeEnabled: true,
        tabBarComponent: navigationAll => {
            const data = [
                {
                    title: 'PromotionClassQualification__E_WAITCONFIRM',
                    screenName: ScreenName.SalApprovePITFinalization
                },
                {
                    title: 'PayrollPaybackStatus__E_CONFIRMED',
                    screenName: ScreenName.SalApprovedPITFinalization
                }
            ];

            return <RenderTopTab data={data} navigationAll={navigationAll} />;
        }
    }
);
//#endregion

//#region [tạo tab navigate cho screen approve BusinessTravel]
const TopTabAttApproveBusinessTravel = createMaterialTopTabNavigator(
    {
        AttApproveBusinessTravel: {
            screen: AttApproveBusinessTravel,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_Approve')
        },
        AttApprovedBusinessTravel: {
            screen: AttApprovedBusinessTravel,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_IsApproved')
        }
    },
    {
        tabBarOptions: {
            style: {
                backgroundColor: Colors.white,
                borderTopColor: Colors.white,
                borderTopWidth: 0
            },
            activeTintColor: Colors.primary,
            inactiveTintColor: Colors.gray_10,
            labelStyle: styleSheets.lable,
            indicatorStyle: {
                borderBottomColor: Colors.primary,
                borderBottomWidth: 2.5
            },
            upperCaseLabel: false
        },
        lazy: true
    }
);
//#endregion

//#region [tạo tab navigate cho screen approve BusinessTravel]
const TopTabAttApproveBusinessTravelCancel = createMaterialTopTabNavigator(
    {
        AttApproveBusinessTravelCancel: {
            screen: AttApproveBusinessTravelCancel,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_Approve')
        },
        AttApprovedBusinessTravelCancel: {
            screen: AttApprovedBusinessTravelCancel,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_IsApproved')
        }
    },
    {
        tabBarOptions: {
            style: {
                backgroundColor: Colors.white,
                borderTopColor: Colors.white,
                borderTopWidth: 0
            },
            activeTintColor: Colors.primary,
            inactiveTintColor: Colors.gray_10,
            labelStyle: styleSheets.lable,
            indicatorStyle: {
                borderBottomColor: Colors.primary,
                borderBottomWidth: 2.5
            },
            upperCaseLabel: false
        },
        lazy: true
    }
);
//#endregion

//#region [tạo tab navigate cho screen approve ShiftSubstitution]
const TopTabAttApproveShiftSubstitution = createMaterialTopTabNavigator(
    {
        AttApproveShiftSubstitution: {
            screen: AttApproveShiftSubstitution,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_Approve')
        },
        AttApprovedShiftSubstitution: {
            screen: AttApprovedShiftSubstitution,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_IsApproved')
        }
    },
    {
        tabBarOptions: {
            style: {
                backgroundColor: Colors.white,
                borderTopColor: Colors.white,
                borderTopWidth: 0
            },
            activeTintColor: Colors.primary,
            inactiveTintColor: Colors.gray_10,
            labelStyle: styleSheets.lable,
            indicatorStyle: {
                borderBottomColor: Colors.primary,
                borderBottomWidth: 2.5
            },
            upperCaseLabel: false
        },
        lazy: true
    }
);
//#endregion

//#region [tạo tab navigate cho screen WaitConfirm ShiftSubstitution]
const TopTabAttWaitConfirmShiftSubstitution = createMaterialTopTabNavigator(
    {
        AttWaitConfirmShiftSubstitution: {
            screen: AttWaitConfirmShiftSubstitution,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_ShiftSubstitution_Confirm')
        },
        AttWaitConfirmedShiftSubstitution: {
            screen: AttWaitConfirmedShiftSubstitution,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_ShiftSubstitution_IsConfirmed')
        }
    },
    {
        tabBarOptions: {
            style: {
                backgroundColor: Colors.white,
                borderTopColor: Colors.white,
                borderTopWidth: 0
            },
            activeTintColor: Colors.primary,
            inactiveTintColor: Colors.gray_10,
            labelStyle: styleSheets.lable,
            indicatorStyle: {
                borderBottomColor: Colors.primary,
                borderBottomWidth: 2.5
            },
            upperCaseLabel: false
        },
        lazy: true
    }
);
//#endregion

const TopTabAttApproveBusinessTrip = createMaterialTopTabNavigator(
    {
        AttApproveBusinessTrip: {
            screen: AttApproveBusinessTrip,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_Approve')
        },
        AttApprovedBusinessTrip: {
            screen: AttApprovedBusinessTrip,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_IsApproved')
        }
    },
    {
        tabBarOptions: {
            style: {
                backgroundColor: Colors.white,
                borderTopColor: Colors.white,
                borderTopWidth: 0
            },
            activeTintColor: Colors.primary,
            inactiveTintColor: Colors.gray_10,
            labelStyle: styleSheets.lable,
            indicatorStyle: {
                borderBottomColor: Colors.primary,
                borderBottomWidth: 2.5
            },
            upperCaseLabel: false
        },
        lazy: true
    }
);

//#endregion

//#region [tạo tab navigate cho screen approve BusinessTravelTransfer]
const TopTabAttApproveBusinessTravelTransfer = createMaterialTopTabNavigator(
    {
        AttApproveBusinessTravelTransfer: {
            screen: AttApproveBusinessTravelTransfer,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_Approve')
        },
        AttApprovedBusinessTravelTransfer: {
            screen: AttApprovedBusinessTravelTransfer,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_IsApproved')
        }
    },
    {
        tabBarOptions: {
            style: {
                backgroundColor: Colors.white,
                borderTopColor: Colors.white,
                borderTopWidth: 0
            },
            activeTintColor: Colors.primary,
            inactiveTintColor: Colors.gray_10,
            labelStyle: styleSheets.lable,
            indicatorStyle: {
                borderBottomColor: Colors.primary,
                borderBottomWidth: 2.5
            },
            upperCaseLabel: false
        },
        lazy: true
    }
);

//#endregion

//#region [tạo tab navigate cho screen approve Pregnancy]
const TopTabAttApprovePregnancy = createMaterialTopTabNavigator(
    {
        AttApprovePregnancy: {
            screen: AttApprovePregnancy,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_Approve')
        },
        AttApprovedPregnancy: {
            screen: AttApprovedPregnancy,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_IsApproved')
        }
    },
    {
        tabBarOptions: {
            style: {
                backgroundColor: Colors.white,
                borderTopColor: Colors.white,
                borderTopWidth: 0
            },
            activeTintColor: Colors.primary,
            inactiveTintColor: Colors.gray_10,
            labelStyle: styleSheets.lable,
            indicatorStyle: {
                borderBottomColor: Colors.primary,
                borderBottomWidth: 2.5
            },
            upperCaseLabel: false
        },
        lazy: true
    }
);
//#endregion

//#region [tạo tab navigate cho screen approve StopWorking]
const TopTabHreSubmitStopWorking = createMaterialTopTabNavigator(
    {
        HreApproveStopWorking: {
            screen: HreApproveStopWorking
        },
        HreApprovedStopWorking: {
            screen: HreApprovedStopWorking
        }
    },
    {
        lazy: true,
        swipeEnabled: false,
        tabBarComponent: navigationAll => {
            const data = [
                {
                    title: 'HRM_Portal_Leaveday_Approve',
                    screenName: ScreenName.HreApproveStopWorking
                },
                {
                    title: 'HRM_Portal_Leaveday_IsApproved',
                    screenName: ScreenName.HreApprovedStopWorking
                }
            ];

            return <RenderTopTab data={data} navigationAll={navigationAll} />;
        }
    }
);

//#endregion

//#region [tạo tab navigate cho screen approve WorkHistorySalary]
const TopTabHreApproveWorkHistorySalary = createMaterialTopTabNavigator(
    {
        HreApproveWorkHistorySalary: {
            screen: HreApproveWorkHistorySalary,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_Approve')
        },
        HreApprovedWorkHistorySalary: {
            screen: HreApprovedWorkHistorySalary,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_IsApproved')
        }
    },
    {
        tabBarOptions: {
            style: {
                backgroundColor: Colors.white,
                borderTopColor: Colors.white,
                borderTopWidth: 0
            },
            activeTintColor: Colors.primary,
            inactiveTintColor: Colors.gray_10,
            labelStyle: styleSheets.lable,
            indicatorStyle: {
                borderBottomColor: Colors.primary,
                borderBottomWidth: 2.5
            },
            upperCaseLabel: false
        },
        lazy: true
    }
);
//#endregion

//#region [tạo tab navigate cho screen approve RequirementRecruitment]
const TopTabHreApproveRequirementRecruitment = createMaterialTopTabNavigator(
    {
        HreApproveRequirementRecruitment: {
            screen: HreApproveRequirementRecruitment,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('EmployeeStatus__E_WAITING_APPROVE')
        },
        HreApprovedRequirementRecruitment: {
            screen: HreApprovedRequirementRecruitment,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_IsApproved')
        }
    },
    {
        tabBarOptions: {
            style: {
                backgroundColor: Colors.white,
                borderTopColor: Colors.white,
                borderTopWidth: 0
            },
            activeTintColor: Colors.primary,
            inactiveTintColor: Colors.gray_10,
            labelStyle: styleSheets.lable,
            indicatorStyle: {
                borderBottomColor: Colors.primary,
                borderBottomWidth: 2.5
            },
            upperCaseLabel: false
        },
        lazy: true
    }
);
//#endregion

//#region [tạo tab navigate cho screen approve HreProfileCard]
const TopTabHreApproveProfileCard = createMaterialTopTabNavigator(
    {
        HreApproveProfileCard: {
            screen: HreApproveProfileCard
        },
        HreApprovedProfileCard: {
            screen: HreApprovedProfileCard
        }
    },
    {
        lazy: true,
        swipeEnabled: true,
        tabBarComponent: navigationAll => {
            const data = [
                {
                    title: 'EmployeeStatus__E_WAITING_APPROVE',
                    screenName: ScreenName.HreApproveProfileCard
                },
                {
                    title: 'HRM_Portal_Leaveday_IsApproved',
                    screenName: ScreenName.HreApprovedProfileCard
                }
            ];

            return <RenderTopTab data={data} navigationAll={navigationAll} />;
        }
    }
);
//#endregion

//#region [tạo tab navigate và button HeaderRight cho screen approve Roster]
const TopTabAttApproveRoster = createMaterialTopTabNavigator(
    {
        AttApproveRoster: {
            screen: AttApproveRoster,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_Approve')
        },
        AttApprovedRoster: {
            screen: AttApprovedRoster,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_IsApproved')
        }
    },
    {
        tabBarOptions: {
            style: {
                backgroundColor: Colors.white,
                borderTopColor: Colors.white,
                borderTopWidth: 0
            },
            activeTintColor: Colors.primary,
            inactiveTintColor: Colors.gray_10,
            labelStyle: styleSheets.lable,
            indicatorStyle: {
                borderBottomColor: Colors.primary,
                borderBottomWidth: 2.5
            },
            upperCaseLabel: false
        },
        lazy: true
    }
);
//#endregion

//#region [tạo tab navigate và button HeaderRight cho screen approve RosterGroupByEmp]
const TopTabAttApproveRosterGroupByEmp = createMaterialTopTabNavigator(
    {
        AttApproveRosterGroupByEmp: {
            screen: AttApproveRosterGroupByEmp,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_Approve')
        },
        AttApprovedRosterGroupByEmp: {
            screen: AttApprovedRosterGroupByEmp,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Portal_Leaveday_IsApproved')
        }
    },
    {
        tabBarOptions: {
            style: {
                backgroundColor: Colors.white,
                borderTopColor: Colors.white,
                borderTopWidth: 0
            },
            activeTintColor: Colors.primary,
            inactiveTintColor: Colors.gray_10,
            labelStyle: styleSheets.lable,
            indicatorStyle: {
                borderBottomColor: Colors.primary,
                borderBottomWidth: 2.5
            },
            upperCaseLabel: false
        },
        lazy: true
    }
);
//#endregion

//#region [tạo tab danh sách quản lý công việc]
const TopTabHreTaskManagerment = createMaterialTopTabNavigator(
    {
        HreTaskAssigned: {
            screen: HreTaskAssigned,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Human_Task_Feild_Assigned')
        },
        HreTaskAssign: {
            screen: HreTaskAssign,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Human_Task_Feild_Assign')
        },
        HreTaskFollow: {
            screen: HreTaskFollow,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Human_Task_Feild_Follow')
        }
    },
    {
        tabBarOptions: {
            style: {
                backgroundColor: Colors.white,
                borderTopColor: Colors.white,
                borderTopWidth: 0
            },
            activeTintColor: Colors.primary,
            inactiveTintColor: Colors.gray_10,
            labelStyle: styleSheets.lable,
            indicatorStyle: {
                borderBottomColor: Colors.primary,
                borderBottomWidth: 2.5
            },
            upperCaseLabel: false
        },
        lazy: true
    }
);

const navigationOptionsTaskCreate = (navigation, Title_Key) => {
    return {
        tabBarVisible: false,
        title: (
            <VnrText i18nKey={Title_Key} style={styleSheets.headerTitleStyle}>
                {Title_Key}
            </VnrText>
        ),
        headerLeft: <ButtonGoBackHome Key={Title_Key} navigation={navigation} />,
        headerStyle: {
            backgroundColor: Colors.white,
            shadowColor: 'transparent',
            shadowRadius: 0,
            shadowOffset: {
                height: 0
            },
            elevation: 0
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
            // textTransform: 'uppercase',
            fontWeight: '500'
        },
        headerRight: () => {
            if (
                PermissionForAppMobile &&
                PermissionForAppMobile.value['Hre_Task_Managerment'] &&
                PermissionForAppMobile.value['Hre_Task_Managerment']['Create']
            ) {
                return (
                    <View
                        // eslint-disable-next-line react-native/no-inline-styles
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <TouchableOpacity onPress={() => navigation.navigate('HreTaskCreateConfirm')}>
                            <View style={styleSheets.bnt_HeaderRight}>
                                <IconCreate size={Size.iconSizeHeader} color={Colors.gray_10} />
                            </View>
                        </TouchableOpacity>
                    </View>
                );
            } else {
                return null;
            }
        }
    };
};
//#endregion

//#region [Chứng từ BHXH]
const TopTabInsInsuranceRecord = createMaterialTopTabNavigator(
    {
        InsInsuranceRecordWaiting: {
            screen: InsInsuranceRecordWaiting
        },
        InsInsuranceRecord: {
            screen: InsInsuranceRecord
        }
    },
    {
        lazy: true,
        swipeEnabled: true,
        tabBarComponent: navigationAll => {
            const data = [
                {
                    title: 'HRM_General_IsWaitingSocialInsDocument_Portal',
                    screenName: ScreenName.InsInsuranceRecordWaiting
                },
                {
                    title: 'HRM_Insurance_InsuranceRecord',
                    screenName: ScreenName.InsInsuranceRecord
                }
            ];

            return <RenderTopTab data={data} navigationAll={navigationAll} />;
        }
    }
);
//#endregion

const navigationOptionsQuicklyEvaluateCreate = (navigation, Title_Key) => {
    return {
        tabBarVisible: false,
        title: (
            <VnrText i18nKey={Title_Key} style={styleSheets.headerTitleStyle}>
                {Title_Key}
            </VnrText>
        ),
        headerLeft: <ButtonGoBackHome Key={Title_Key} navigation={navigation} />,
        headerStyle: {
            backgroundColor: Colors.white,
            shadowColor: 'transparent',
            shadowRadius: 0,
            shadowOffset: {
                height: 0
            },
            elevation: 0
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
            textTransform: 'uppercase',
            fontWeight: '500'
        },
        headerRight: () => {
            const { routes } = navigation.state;

            let param, param1;

            if (routes && Array.isArray(routes)) {
                param = routes[0] ? routes[0].params : null;
                param1 = routes[1] ? routes[1].params : null;
            }

            let params = {
                reloadTabProfile: param ? param.reload : null,
                reloadTabKPI: param1 ? param1.reload : null
            };

            if (
                PermissionForAppMobile &&
                PermissionForAppMobile.value['Hre_Task_Evaluation'] &&
                PermissionForAppMobile.value['Hre_Task_Evaluation']['Create']
            ) {
                return (
                    <View
                        // eslint-disable-next-line react-native/no-inline-styles
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('EvaPerformanceQuicklyAdd', params);
                            }}
                        >
                            <View style={styleSheets.bnt_HeaderRight}>
                                <IconCreate size={Size.iconSizeHeader} color={Colors.gray_10} />
                            </View>
                        </TouchableOpacity>
                    </View>
                );
            } else {
                return null;
            }
        }
    };
};

//#region [tạo tab danh sách quản lý công việc Theo mẫu]
const TopTabHreTaskCreateConfirm = createMaterialTopTabNavigator(
    {
        HreTaskConfirmTabCreateByModelConfirm: {
            screen: HreTaskConfirmTabCreateByModelConfirm,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Tas_Task_TaskByModel')
        },
        HreTaskConfirmTabCreateNotModelConfirm: {
            screen: HreTaskConfirmTabCreateNotModelConfirm,
            navigationOptions: () => FunctionCommon.navigationOptionsTopTab('HRM_Tas_Task_TaskNotModel')
        }
    },
    {
        tabBarOptions: {
            style: {
                backgroundColor: Colors.white,
                borderTopColor: Colors.white,
                borderTopWidth: 0
            },
            activeTintColor: Colors.primary,
            inactiveTintColor: Colors.gray_10,
            labelStyle: styleSheets.lable,
            indicatorStyle: {
                borderBottomColor: Colors.primary,
                borderBottomWidth: 2.5
            },
            upperCaseLabel: false
        },
        lazy: true
    }
);
//#endregion

let objStack = {
    Home: {
        screen: HomeScene,
        //path: '../../scenes/home/Home',
        navigationOptions: ({ navigation }) => FunctionCommon.navigationOptionsConfigHeaderNull(navigation, 'home')
    },
    // ScanFaceViewDetail : {
    //     screen: ScanFaceViewDetail,
    //     navigationOptions: ({ navigation }) => (FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_PortalApp_HrePersonalManage_TitleDetail'))
    // },

    Feedback: {
        screen: Feedback,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_Feedback_SendFeedback')
    },

    // customer date
    CustomerDate: {
        screen: CustomerDate,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'Customer Date')
    },

    //#region [module/attendanceV3/attTSLRegisterV3
    TopTabAttSubmitTakeLeaveDay: {
        screen: TopTabAttSubmitTakeLeaveDay,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_PortalApp_TakeLeaveDay_Title')
    },
    TopTabAttApproveTakeLeaveDay: {
        screen: TopTabAttApproveTakeLeaveDay,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_PortalApp_TakeLeaveDayApprove_Title')
    },
    AttSubmitTakeLeaveDayViewDetail: {
        screen: AttSubmitTakeLeaveDayViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_DetailLeaveDay')
    },
    AttApproveTakeLeaveDayViewDetail: {
        screen: AttApproveTakeLeaveDayViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_DetailLeaveDay')
    },
    //#endregion

    //#region [module/attendanceV3/attTakeBusinessTrip
    TopTabAttSubmitTakeBusinessTrip: {
        screen: TopTabAttSubmitTakeBusinessTrip,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_PortalApp_TakeBusinessTrip_Title')
    },
    TopTabAttApproveTakeBusinessTrip: {
        screen: TopTabAttApproveTakeBusinessTrip,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_PortalApp_TakeBusinessTripApprove_Title')
    },
    AttSubmitTakeBusinessTripViewDetail: {
        screen: AttSubmitTakeBusinessTripViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_TakeBusinessTrip_TitleDetail')
    },
    AttApproveTakeBusinessTripViewDetail: {
        screen: AttApproveTakeBusinessTripViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_TakeBusinessTrip_TitleDetail')
    },
    //#endregion

    //#region [module/attendanceV3/attTSLRegisterV3
    TopTabAttSubmitTamScanLogRegister: {
        screen: TopTabAttSubmitTamScanLogRegister,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_PortalApp_TSLRegister_Title')
    },
    AttSubmitTamScanLogRegisterViewDetail: {
        screen: AttSubmitTamScanLogRegisterViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_TSLRegister_TitleDetail')
    },
    TopTabAttApproveTamScanLogRegister: {
        screen: TopTabAttApproveTamScanLogRegister,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_PortalApp_ApproveTamScanLogRegister')
    },
    AttApproveTamScanLogRegisterViewDetail: {
        screen: AttApproveTamScanLogRegisterViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Attendance_TitleGrid')
    },

    //#region [module/attendanceV3/attWorkingOvertime
    TopTabAttSubmitWorkingOvertime: {
        screen: TopTabAttSubmitWorkingOvertime,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Attendance_PlanOvertime')
    },
    TopTabAttApproveWorkingOvertime: {
        screen: TopTabAttApproveWorkingOvertime,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Attendance_PlanOvertimeApprove')
    },

    AttSubmitWorkingOvertimeViewDetail: {
        screen: AttSubmitWorkingOvertimeViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_WorkingOvertime_TitleDetail')
    },
    AttApproveWorkingOvertimeViewDetail: {
        screen: AttApproveWorkingOvertimeViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_ApproveWorkingOvertime_TitleDetail')
    },
    //#endregion

    //#region [module/attendanceV3/attTakeLateEarlyAllowed
    TopTabAttSubmitTakeLateEarlyAllowed: {
        screen: TopTabAttSubmitTakeLateEarlyAllowed,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Att_LateEarlyAllowed_Tittle')
    },

    TopTabAttApproveTakeLateEarlyAllowed: {
        screen: TopTabAttApproveTakeLateEarlyAllowed,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'New_Att_LateEarlyAllowedApprove')
    },

    AttSubmitTakeLateEarlyAllowedViewDetail: {
        screen: AttSubmitTakeLateEarlyAllowedViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },

    AttApproveTakeLateEarlyAllowedViewDetail: {
        screen: AttApproveTakeLateEarlyAllowedViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    //#endregion

    //#region [module/hreTask/HreTask]
    TopTabHreTaskManagerment: {
        screen: TopTabHreTaskManagerment,
        navigationOptions: ({ navigation }) => navigationOptionsTaskCreate(navigation, 'HRM_Hre_Tas_Task')
    },
    HreTaskCreateConfirm: {
        screen: TopTabHreTaskCreateConfirm,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Tas_Task_TaskModelCode_Pick')
    },
    HreTaskCreateSave: {
        screen: HreTaskCreateSave,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Tas_Task_Task_Add')
    },
    HreTaskCreateSaveNotModel: {
        screen: HreTaskCreateSaveNotModel,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Tas_Task_Task_Add')
    },
    HreTaskAddTargetAndLevelForEva: {
        screen: HreTaskAddTargetAndLevelForEva,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Tas_Task_Add_Target_And_Level')
    },
    HreTaskEvaluation: {
        screen: HreTaskEvaluation,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Hre_Task_Evaluation')
    },
    HreTaskViewDetail: {
        screen: HreTaskViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    HreTaskViewDetailNotify: {
        screen: HreTaskViewDetailNotify,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    HreTaskTabEdit: {
        screen: HreTaskTabEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Hre_Task_Update_Title', () =>
                DrawerServices.navigate('TopTabHreTaskManagerment')
            )
    },
    HreTaskTabEditEvaluation: {
        screen: HreTaskTabEditEvaluation,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Hre_Task_Evaluation', () =>
                DrawerServices.navigate('HreTaskEvaluation')
            )
    },
    //#endregion
    ProfileInfo: {
        screen: GeneralInfo, // TopTabProfileInfo,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HR_App_Profile_Information')
    },
    TopTabProfileInfo: {
        screen: TopTabProfileInfo,
        navigationOptions: ({ navigation }) => navigationOptionsProfile(navigation, 'HR_ProfileInformation')
    },
    ProfileInfoUpdate: {
        screen: TopTabProfileInfoUpdate,
        navigationOptions: ({ navigation }) => navigationOptionsProfileUpdate(navigation, 'HRM_Common_Edit')
    },
    TopTabHisProfileInfo: {
        screen: TopTabHisProfileInfo,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_AppPortal_History_ProfileInfo')
    },
    WorkDay: {
        screen: WorkDay,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Attendance_InOut_WorkDate')
    },
    WorkDayViewDetail: {
        screen: WorkDayViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Att_Workday_Total_ViewDetail')
    },
    WorkDayV2: {
        screen: WorkDayV2,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Attendance_InOut_WorkDate')
    },
    WorkDayV2ViewDetail: {
        screen: WorkDayV2ViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Att_Workday_Total_ViewDetail')
    },
    AttWorkDayCalendar: {
        screen: AttWorkDayCalendar,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigHeaderNull(navigation, 'HRM_PortalApp_Attendance_WorkDate')
    },
    AttWorkDayCalendarViewDetail: {
        screen: AttWorkDayCalendarViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Att_Workday_Total_ViewDetail')
    },
    InOut: {
        screen: TopTabInOutInfo,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'Att_TAMScanLog')
    },
    InOutViewDetail: {
        screen: InOutViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'InOutViewDetail')
    },
    AttendanceDetail: {
        screen: AttendanceDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'Att_AttendanceTableDetail')
    },
    AttendanceDetailViewDetail: {
        screen: AttendanceDetailViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    AttendanceCalendarDetail: {
        screen: AttendanceCalendarDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'Att_AttendanceTableDetail')
    },
    AttendanceCalenderDetailHistory: {
        screen: AttendanceCalenderDetailHistory,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Attendance_ConfirmHistoryAttendanceTable')
    },
    AttendanceCalenderDetailHistoryDetail: {
        screen: AttendanceCalenderDetailHistoryDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    AttendanceCalendarViewDetail: {
        screen: AttendanceCalendarViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'Att_AttendanceTableDetail')
    },
    AnnualDetail: {
        screen: AnnualDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Attendance_AnnualDetailView')
    },
    AnnualDetailViewDetail: {
        screen: AnnualDetailViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    AnnualRemain: {
        screen: AnnualRemain,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Tab_Attendance_RemainingLeave')
    },
    AnnualRemainViewDetail: {
        screen: AnnualRemainViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    AttPaidLeave: {
        screen: AttPaidLeave,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_AttPaidLeave_List')
    },
    AttPaidLeaveViewDetail: {
        screen: AttPaidLeaveViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    BasicSalaryDetail: {
        screen: BasicSalaryDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Payroll_BasicSalary_BasicSalary')
    },
    BasicSalaryDetailViewDetail: {
        screen: BasicSalaryDetailViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Payroll_Basic_Salary_ViewMail')
    },
    Salary: {
        screen: Salary,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Payroll_SalaryPayslips')
    },
    SalaryMonthDetail: {
        screen: SalaryMonthDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Payroll_Sal_ProductSalary_Title')
    },
    SalaryViewDetail: {
        screen: SalaryViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    AttSubmitTSLRegister: {
        screen: AttSubmitTSLRegister,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Attendance_TamScanLogRegister')
    },
    AttSubmitTSLRegisterViewDetail: {
        screen: AttSubmitTSLRegisterViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    AttSubmitTSLRegisterAddOrEdit: {
        screen: AttSubmitTSLRegisterAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Att_TAMScanLog_PopUp_Create_Title')
    },
    GoogleMaps: {
        screen: GoogleMaps,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigHeaderNull(navigation, 'HRM_Attendance_CheckIn_GPS')
    },
    AttTSLCheckInOutWifi: {
        screen: AttTSLCheckInOutWifi,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigHeaderNull(navigation, 'HRM_Attendance_CheckIn_Wifi')
    },
    AttTSLCheckInOutNFC: {
        screen: AttTSLCheckInOutNFC,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigHeaderNull(navigation, 'HRM_Attendance_CheckIn_GPS')
    },
    // CheckinNFCTest: {
    //     screen: CheckinNFCTest,
    //     navigationOptions: ({ navigation }) => (FunctionCommon.navigationOptionsConfigHeaderNull(navigation, 'HRM_Attendance_CheckIn_GPS')),
    // },
    TutorialGPSiOS: {
        screen: TutorialGPSiOS,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'Hướng dẫn bật GPS')
    },
    TutorialGPSiOSEN: {
        screen: TutorialGPSiOSEn,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'Tutorial turn on GPS')
    },
    AttTSLCheckInOut: {
        screen: AttTSLCheckInOut,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigHeaderNull(navigation, 'HRM_Attendance_CheckIn_GPS')
    },
    ShiftDetail: {
        screen: ShiftDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Att_TamScanLogRegister_List')
    },
    FilterToAddProfile: {
        screen: FilterToAddProfile,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'FilterToAddProfile')
    },
    FilterToAddProfileViewDetail: {
        screen: FilterToAddProfileViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    TopTabAttApproveTSLRegister: {
        screen: TopTabAttApproveTSLRegister,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Attendance_TAMScanLog_Waiting_Approve')
    },
    AttApproveTSLRegisterViewDetail: {
        screen: AttApproveTSLRegisterViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    AttApprovedTSLRegisterViewDetail: {
        screen: AttApprovedTSLRegisterViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    AttSubmitRoster: {
        screen: AttSubmitRoster,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Attendance_Roster')
    },
    AttSubmitRosterAddOrEdit: {
        screen: AttSubmitRosterAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_AddNewRoster')
    },
    AttSubmitRosterFlexibleAddOrEdit: {
        screen: AttSubmitRosterFlexibleAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_Flexible_Shift_Change')
    },
    AttSubmitRosterViewDetail: {
        screen: AttSubmitRosterViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    TopTabAttApproveRoster: {
        screen: TopTabAttApproveRoster,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Attendance_Roster_Waiting_Approve')
    },
    AttApproveRosterViewDetail: {
        screen: AttApproveRosterViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    AttApprovedRosterViewDetail: {
        screen: AttApprovedRosterViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },

    AttSubmitRosterGroupByEmp: {
        screen: AttSubmitRosterGroupByEmp,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Att_RosterGroupByEmp_Title')
    },
    AttSubmitRosterGroupByEmpAddOrEdit: {
        screen: AttSubmitRosterGroupByEmpAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Attendance_RosterGroupByEmp_Popup_Create')
    },
    AttSubmitRosterGroupByEmpViewDetail: {
        screen: AttSubmitRosterGroupByEmpViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    TopTabAttApproveRosterGroupByEmp: {
        screen: TopTabAttApproveRosterGroupByEmp,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Attendance_RosterGroupByEmp_Approve')
    },
    AttApproveRosterGroupByEmpViewDetail: {
        screen: AttApproveRosterGroupByEmpViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    AttApprovedRosterGroupByEmpViewDetail: {
        screen: AttApprovedRosterGroupByEmpViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    AttSubmitLeaveDay: {
        screen: AttSubmitLeaveDay,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_ATT_Holiday_RegisterDayOff')
    },
    AttSubmitLeaveDayAddOrEdit: {
        screen: AttSubmitLeaveDayAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_ATT_Holiday_RegisterDayOff')
    },
    AttSubmitLeaveDayViewDetail: {
        screen: AttSubmitLeaveDayViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    TopTabAttApproveLeaveDay: {
        screen: TopTabAttApproveLeaveDay,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Attendance_LeaveDay_Waiting_Approve')
    },
    AttApproveLeaveDayViewDetail: {
        screen: AttApproveLeaveDayViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    AttApprovedLeaveDayViewDetail: {
        screen: AttApprovedLeaveDayViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },

    //#region [module/attendance/attLeaveDayCancel]
    AttSubmitLeaveDayCancel: {
        screen: AttSubmitLeaveDayCancel,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_New_Att_RequireCancel_New_Index')
    },
    AttSubmitLeaveDayCancelAddOrEdit: {
        screen: AttSubmitLeaveDayCancelAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_New_Att_Require')
    },
    AttSubmitLeaveDayCancelViewDetail: {
        screen: AttSubmitLeaveDayCancelViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    TopTabAttApproveLeaveDayCancel: {
        screen: TopTabAttApproveLeaveDayCancel,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_New_Att_RequireCancelApprove_New_Index')
    },
    AttApproveLeaveDayCancelViewDetail: {
        screen: AttApproveLeaveDayCancelViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    AttApprovedLeaveDayCancelViewDetail: {
        screen: AttApprovedLeaveDayCancelViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    AttConfirmLeaveDay: {
        screen: AttConfirmLeaveDay,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Attendance_LeaveDayComfirm')
    },
    //#endregion
    GradeInfo: {
        screen: GradeInfo,
        navigationOptions: ({ navigation }) => FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Grade')
    },
    GradeAttendanceViewDetail: {
        screen: GradeAttendanceViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    GradeSalaryViewDetail: {
        screen: GradeSalaryViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    GradeInsurance: {
        screen: GradeInsurance,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'Ins_InsuranceGradeDetail_Title')
    },
    GradeInsuranceViewDetail: {
        screen: GradeInsuranceViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    Insurance: {
        screen: TabInsurance,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_HR_Profile_Insurance')
    },
    Reward: {
        screen: Reward,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Payroll_Bonuses')
    },
    RewardViewDetail: {
        screen: RewardViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    Discipline: {
        screen: Discipline,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HR_Discipline')
    },
    DisciplineViewDetail: {
        screen: DisciplineViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    WorkHistory: {
        screen: TopWorkHistory,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_HR_Profile_WorkHistory')
    },
    WorkHistoryViewDetail: {
        screen: WorkHistoryViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    //tmp
    TopTabTraineeInfo: {
        screen: TopTabTraineeInfo,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Evaluation_TraAndEva_List')
    },
    Trainee: {
        screen: Trainee,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Evaluation_TraAndEva_List')
    },
    TraineeViewDetail: {
        screen: TraineeViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    TraineeCertificate: {
        screen: TraineeCertificate,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_System_Resource_Tra_Certificate')
    },
    TraineeCertificateViewDetail: {
        screen: TraineeCertificateViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    TraineePlan: {
        screen: TraineePlan,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_System_Resource_Tra_Certificate')
    },
    TraineePlanViewDetail: {
        screen: TraineePlanViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    // Dependant: {
    //     screen: Dependant,
    //     navigationOptions: ({ navigation }) => (FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_HR_Dependant')),
    // },
    TopTabDependantInfo: {
        screen: TopTabDependantInfo,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_HR_Dependant')
    },
    DependantAddOrEdit: {
        screen: DependantAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_HR_Dependant_PopUp_Create_Title')
    },
    DependantConfirmedViewDetail: {
        screen: DependantConfirmedViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    DependantEditViewDetail: {
        screen: DependantEditViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    DependantWaitConfirmViewDetail: {
        screen: DependantWaitConfirmViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    DenpendantOtherBirthCertificate: {
        screen: DenpendantOtherBirthCertificate,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(
                navigation,
                'HRM_OnlyApp_Certificat_De_Naissance_For_Dependant'
            )
    },
    DependantOtherIdentification: {
        screen: DependantOtherIdentification,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_HR_Profile_AdditionalInfo')
    },
    DependantOtherAddress: {
        screen: DependantOtherAddress,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Hre_Dependant_AddressInformation')
    },

    //    chứng chỉ ngoại ngữ LanguageLevel
    TopTabLanguageLevelInfo: {
        screen: TopTabLanguageLevelInfo,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_HR_ProfileLanguage')
    },
    LanguageLevelAddOrEdit: {
        screen: LanguageLevelAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Hre_ProfileLanguageLevel_Create_Title')
    },
    LanguageLevelConfirmedViewDetail: {
        screen: LanguageLevelConfirmedViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    LanguageLevelEditViewDetail: {
        screen: LanguageLevelEditViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    LanguageLevelWaitConfirmViewDetail: {
        screen: LanguageLevelWaitConfirmViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },

    // //Kinh nghiệm làm việc
    TopTabWorkingExperienceInfo: {
        screen: TopTabWorkingExperienceInfo,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Hre_ProfileCandidateHistory')
    },
    WorkingExperienceAddOrEdit: {
        screen: WorkingExperienceAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(
                navigation,
                'HRM_HR_CandidateHistory_Profile_PopUp_Create_Title'
            )
    },
    WorkingExperienceConfirmedViewDetail: {
        screen: WorkingExperienceConfirmedViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    // WorkingExperienceEditViewDetail: {
    //     screen: WorkingExperienceEditViewDetail,
    //     navigationOptions: ({ navigation }) =>
    //         FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore'),
    // },
    WorkingExperienceWaitConfirmViewDetail: {
        screen: WorkingExperienceWaitConfirmViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    // WorkingExperienceOtherIdentification: {
    //     screen: WorkingExperienceOtherIdentification,
    //     navigationOptions: ({ navigation }) => (FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_HR_Profile_AdditionalInfo')),
    // },
    // WorkingExperienceOtherBirthCertificate: {
    //     screen: WorkingExperienceOtherBirthCertificate,
    //     navigationOptions: ({ navigation }) => (FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_HR_BirthCertificate')),
    // },

    TopTabBankAccountInfo: {
        screen: TopTabBankAccountInfo,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_BankAccunt_Info')
    },
    BankAccountAddOrEdit: {
        screen: BankAccountAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(
                navigation,
                'HRM_PortalApp_Sal_SalaryInformation_PopUp_Create_Title'
            )
    },
    BankWalletAddOrEdit: {
        screen: BankWalletAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Payroll_Sal_EWalletInformation_Create_Title')
    },
    BankAccountMultiAddOrEdit: {
        screen: BankAccountMultiAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(
                navigation,
                'HRM_Payroll_Sal_SalaryInformation_PopUp_Create_Title'
            )
    },
    BankAccountConfirmedViewDetail: {
        screen: BankAccountConfirmedViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    BankAccountConfirmViewDetail: {
        screen: BankAccountConfirmViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    BankWalletConfirmedViewDetail: {
        screen: BankWalletConfirmedViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_BankAccuntWallet_Info')
    },
    BankWalletConfirmViewDetail: {
        screen: BankWalletConfirmViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },

    // BankAccountEditViewDetail: {
    //     screen: BankAccountEditViewDetail,
    //     navigationOptions: ({ navigation }) => (FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')),
    // },
    // BankAccountWaitConfirmViewDetail: {
    //     screen: BankAccountWaitConfirmViewDetail,
    //     navigationOptions: ({ navigation }) => (FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')),
    // },

    HouseholdInfo: {
        screen: TopTabHouseholdInfo,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_HR_Profile_HouseholdInfo')
    },
    HouseholdAddOrEdit: {
        screen: HouseholdAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_HR_Relatives_AddNew')
    },
    HouseholdAddRelative: {
        screen: HouseholdAddRelative,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Hr_Relatives_Title_CreateApp')
    },
    HouseholdAddRelativeViewDetail: {
        screen: HouseholdAddRelativeViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Hr_Relatives_Title_ViewDetail')
    },
    HouseholdConfirmedViewDetail: {
        screen: HouseholdConfirmedViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_App_MemberDetails')
    },
    HouseholdWaitConfirmViewDetail: {
        screen: HouseholdWaitConfirmViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_App_MemberDetails')
    },
    HouseholdOtherIdentification: {
        screen: HouseholdOtherIdentification,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_HR_Profile_AdditionalInfo')
    },
    HouseholdOtherBirthCertificate: {
        screen: HouseholdOtherBirthCertificate,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Household_FamilyMemberBirthReg')
    },
    RelativeInfo: {
        screen: TopTabRelativeInfo,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_HR_Profiles_Relatives')
    },
    OtherAddressInformation: {
        screen: OtherAddressInformation,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Hre_Relatives_AddressInformation')
    },
    OtherIdentification: {
        screen: OtherIdentification,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_HR_Profile_AdditionalInfo')
    },
    OtherBirthCertificate: {
        screen: OtherBirthCertificate,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_OnlyApp_Certificat_De_Naissance_For_Relative')
    },
    RelativeAddOrEdit: {
        screen: RelativeAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_HR_Relatives_AddNew')
    },
    RelativeConfirmedViewDetail: {
        screen: RelativeConfirmedViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    RelativeEditViewDetail: {
        screen: RelativeEditViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    RelativeWaitConfirmViewDetail: {
        screen: RelativeWaitConfirmViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },

    // passport
    TopTabPassportInfo: {
        screen: TopTabPassportInfo,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_HR_Profile_PassPortInfo')
    },
    PassportAddOrEdit: {
        screen: PassportAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_HR_Passports_AddNew')
    },
    PassportConfirmedViewDetail: {
        screen: PassportConfirmedViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    PassportWaitConfirmViewDetail: {
        screen: PassportWaitConfirmViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },

    //tmp
    TopTabQualificationInfo: {
        screen: TopTabQualificationInfo,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_HR_Qualification_QualificationName')
    },
    QualificationAddOrEdit: {
        screen: QualificationAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_HR_Qualification_AddNew')
    },
    QualificationConfirmedViewDetail: {
        screen: QualificationConfirmedViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    QualificationWaitConfirmViewDetail: {
        screen: QualificationWaitConfirmViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    QualificationEditViewDetail: {
        screen: QualificationEditViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    // DependantViewDetail: {
    //     screen: DependantViewDetail,
    //     navigationOptions: ({ navigation }) => (FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')),
    // },
    Contract: {
        screen: Contract,
        navigationOptions: ({ navigation }) => FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Contract')
    },
    ContractViewDetail: {
        screen: ContractViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    TopTabContractHistory: {
        screen: TopTabContractHistory,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_ContractHistory_Title')
    },
    ContractV3ViewDetail: {
        screen: ContractV3ViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_ContractHistory_Screen')
    },
    ContractHistoryAllViewDetail: {
        screen: ContractHistoryAllViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_ContractHistory_Detail')
    },
    ContractHistoryConfirmed: {
        screen: ContractHistoryConfirmed,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_ContractHistory_Detail')
    },
    ContractHistoryConfirmedViewDetail: {
        screen: ContractHistoryConfirmedViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_ContractHistory_Detail')
    },
    ContractHistoryWaitConfirm: {
        screen: ContractHistoryWaitConfirm,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_ContractHistory_Detail')
    },
    ContractHistoryWaitConfirmViewDetail: {
        screen: ContractHistoryWaitConfirmViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_ContractHistory_Detail')
    },

    PartyUnionViewDetail: {
        screen: PartyUnionViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    AppendixContract: {
        screen: AppendixContract,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Hr_AppendixContract_Title')
    },
    AppendixContractViewDetail: {
        screen: AppendixContractViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    TaxInfo: {
        screen: TaxInfo,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Payroll_TaxInformationRegister')
    },
    TaxInfoViewDetail: {
        screen: TaxInfoViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    LookupProfile: {
        screen: LookupProfile,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_ProfileInformationLookup')
    },
    LookupProfileViewDetail: {
        screen: LookupProfileViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    LookupRosterProfile: {
        screen: LookupRosterProfile,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_LookupRoster')
    },
    LookupRosterProfileViewDetail: {
        screen: LookupRosterProfileViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    News: {
        screen: News,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigHeaderNull(navigation, 'HRM_Common_News')
    },
    NewsSlider: {
        screen: NewsSlider,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Common_News')
    },
    GeneralChart: {
        screen: GeneralChart,
        navigationOptions: ({ navigation }) => FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'chart')
    },
    ChReportDynamic: {
        screen: ChReportDynamic,
        navigationOptions: ({ navigation }) => FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'chart')
    },
    SocialNetWork: {
        screen: SocialNetWork,
        navigationOptions: ({ navigation }) => navigationOptionsGobackNews(navigation, 'HRM_Hre_Social_Network')
    },
    //#region [module/attendance/attOvertime]
    AttSubmitOvertime: {
        screen: AttSubmitOvertime,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Att_Overtime_Config_RegisterOvertime')
    },
    AttSubmitOvertimeAddOrEdit: {
        screen: AttSubmitOvertimeAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Att_Overtime_Config_RegisterOvertime')
    },
    AttSubmitOvertimeViewDetail: {
        screen: AttSubmitOvertimeViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    TopTabAttApproveOvertime: {
        screen: TopTabAttApproveOvertime,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsTopTabCustomHeaderRight(
                navigation,
                'HRM_Att_Overtime_Config_ApproveOvertime'
            )
    },
    AttApproveOvertimeViewDetail: {
        screen: AttApproveOvertimeViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    AttApproveOvertimeComment: {
        screen: AttApproveOvertimeComment,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigHeaderNull(navigation, 'HRM_System_Comment__E_OVERTIME')
    },
    AttApprovedOvertimeViewDetail: {
        screen: AttApprovedOvertimeViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    //#endregion

    //#region [module/attendance/attLateEarlyAllowed]
    AttSubmitLateEarlyAllowed: {
        screen: AttSubmitLateEarlyAllowed,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Att_LateEarlyAllowed_Tittle')
    },
    AttSubmitLateEarlyAllowedAddOrEdit: {
        screen: AttSubmitLateEarlyAllowedAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Attendance_LateEarlyAllowed_Popup_Create')
    },
    AttSubmitLateEarlyAllowedViewDetail: {
        screen: AttSubmitLateEarlyAllowedViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    TopTabAttApproveLateEarlyAllowed: {
        screen: TopTabAttApproveLateEarlyAllowed,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsTopTabCustomHeaderRight(navigation, 'New_Att_LateEarlyAllowedApprove')
    },
    AttApproveLateEarlyAllowedViewDetail: {
        screen: AttApproveLateEarlyAllowedViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    AttApprovedLateEarlyAllowedViewDetail: {
        screen: AttApprovedLateEarlyAllowedViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    //#endregion

    //#region [module/attendance/attPlanOvertime]
    AttSubmitPlanOvertime: {
        screen: AttSubmitPlanOvertime,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Attendance_PlanOvertime')
    },
    AttSubmitPlanOvertimeAddOrEdit: {
        screen: AttSubmitPlanOvertimeAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'Hrm_Portal_Submit_PlanOvertime')
    },
    AttSubmitPlanOvertimeViewDetail: {
        screen: AttSubmitPlanOvertimeViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    TopTabAttApprovePlanOvertime: {
        screen: TopTabAttApprovePlanOvertime,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsTopTabCustomHeaderRight(navigation, 'HRM_Attendance_PlanOvertimeApprove')
    },
    AttApprovePlanOvertimeViewDetail: {
        screen: AttApprovePlanOvertimeViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    AttApprovedPlanOvertimeViewDetail: {
        screen: AttApprovedPlanOvertimeViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    //#endregion

    //#region [module/attendance/attPlanOvertimeCancel]
    AttSubmitPlanOvertimeCancel: {
        screen: AttSubmitPlanOvertimeCancel,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'New_Att_RequestCancelationOvertimePlan_Title')
    },
    AttSubmitPlanOvertimeCancelAddOrEdit: {
        screen: AttSubmitPlanOvertimeCancelAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_New_Att_RequestCancelationOvertimePlan_Add')
    },
    AttSubmitPlanOvertimeCancelViewDetail: {
        screen: AttSubmitPlanOvertimeCancelViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    TopTabAttApprovePlanOvertimeCancel: {
        screen: TopTabAttApprovePlanOvertimeCancel,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsTopTabCustomHeaderRight(
                navigation,
                'New_Att_RequestCancelationOvertimePlan_Approve_Title'
            )
    },
    AttApprovePlanOvertimeCancelViewDetail: {
        screen: AttApprovePlanOvertimeCancelViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    AttApprovedPlanOvertimeCancelViewDetail: {
        screen: AttApprovedPlanOvertimeCancelViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    //#endregion

    //#region [module/attendance/attBusinessTrip]
    AttSubmitBusinessTrip: {
        screen: AttSubmitBusinessTrip,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Attendance_LeaveDayTrip')
    },
    AttSubmitBusinessTripAddOrEdit: {
        screen: AttSubmitBusinessTripAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'Business_Travel_Create')
    },
    AttSubmitBusinessTripViewCost: {
        screen: AttSubmitBusinessTripViewCost,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_BusinessTravelCosts_View')
    },
    AttSubmitBusinessTripViewDetail: {
        screen: AttSubmitBusinessTripViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    TopTabAttApproveBusinessTrip: {
        screen: TopTabAttApproveBusinessTrip,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsTopTabCustomHeaderRight(navigation, 'List_Approved_Business_Travel')
    },
    AttApproveBusinessTripViewDetail: {
        screen: AttApproveBusinessTripViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    AttApprovedBusinessTripViewDetail: {
        screen: AttApprovedBusinessTripViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    //#endregion

    // add new by nhan
    //#region [module/attendance/attRegisterVehicle] Hrm_Portal_Submit_RegisterVehicle
    AttSubmitRegisterVehicle: {
        screen: AttSubmitRegisterVehicle,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Attendance_RegisterVehicle')
    },
    AttSubmitRegisterVehicleAddOrEdit: {
        screen: AttSubmitRegisterVehicleAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Attendance_RegisterVehicle_Popup_Create')
    },
    AttSubmitRegisterVehicleViewDetail: {
        screen: AttSubmitRegisterVehicleViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    TopTabAttApproveRegisterVehicle: {
        screen: TopTabAttApproveRegisterVehicle,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsTopTabCustomHeaderRight(navigation, 'New_Att_RegisterVehicleApprove')
    },
    AttApproveRegisterVehicleViewDetail: {
        screen: AttApproveRegisterVehicleViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    AttApprovedRegisterVehicleViewDetail: {
        screen: AttApprovedRegisterVehicleViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    //#endregion

    //#region [module/salary/taxInformationRegister]
    TaxSubmitTaxInformationRegister: {
        screen: TaxSubmitTaxInformationRegister,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Payroll_TaxInformationRegister')
    },
    TaxSubmitTaxInformationRegisterAddOrEdit: {
        screen: TaxSubmitTaxInformationRegisterAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(
                navigation,
                'HRM_Payroll_Sal_TaxInformationRegister_Update_Title'
            )
    },
    TopTabTaxApproveTaxInformationRegister: {
        screen: TopTabTaxApproveTaxInformationRegister,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsTopTabCustomHeaderRight(navigation, 'HRM_Payroll_TaxInformationRegister')
    },
    TaxApproveTaxInformationRegisterViewDetail: {
        screen: TaxApproveTaxInformationRegisterViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    TaxApprovedTaxInformationRegisterViewDetail: {
        screen: TaxApprovedTaxInformationRegisterViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    //#endregion
    // end add new by nhan

    //#region [module/attendance/attBusinessTravel]
    AttSubmitBusinessTravel: {
        screen: AttSubmitBusinessTravel,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Attendance_BussinessTravel')
    },
    AttSubmitBusinessTravelAddOrEdit: {
        screen: AttSubmitBusinessTravelAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'Business_Travel_Create')
    },
    AttSubmitBusinessTravelViewDetail: {
        screen: AttSubmitBusinessTravelViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    TopTabAttApproveBusinessTravel: {
        screen: TopTabAttApproveBusinessTravel,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsTopTabCustomHeaderRight(
                navigation,
                'HRM_Attendance_BussinessTravel_Approve'
            )
    },
    AttApproveBusinessTravelViewDetail: {
        screen: AttApproveBusinessTravelViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    AttApprovedBusinessTravelViewDetail: {
        screen: AttApprovedBusinessTravelViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    //#endregion

    //#region [module/attendance/attBusinessTravelCancel]
    AttSubmitBusinessTravelCancel: {
        screen: AttSubmitBusinessTravelCancel,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(
                navigation,
                'New_Att_RequestCancelationBusinessTravel_Title'
            )
    },
    AttSubmitBusinessTravelCancelAddOrEdit: {
        screen: AttSubmitBusinessTravelCancelAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'Business_Travel_Create')
    },
    AttSubmitBusinessTravelCancelViewDetail: {
        screen: AttSubmitBusinessTravelCancelViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    TopTabAttApproveBusinessTravelCancel: {
        screen: TopTabAttApproveBusinessTravelCancel,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsTopTabCustomHeaderRight(
                navigation,
                'HRM_New_Att_RequestCancelationBusinessTravel_Approve_New_Index'
            )
    },
    AttApproveBusinessTravelCancelViewDetail: {
        screen: AttApproveBusinessTravelCancelViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    AttApprovedBusinessTravelCancelViewDetail: {
        screen: AttApprovedBusinessTravelCancelViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    //#endregion

    //#region [module/attendance/attBusinessTravelTransfer]
    AttSubmitBusinessTravelTransfer: {
        screen: AttSubmitBusinessTravelTransfer,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'BusinessType__E_BUSINESSTRAVELTRANSFER')
    },
    AttSubmitBusinessTravelTransferAddOrEdit: {
        screen: AttSubmitBusinessTravelTransferAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(
                navigation,
                'HRM_Attendance_BusinessTravelTransfer_Popup_Create'
            )
    },
    AttSubmitBusinessTravelTransferViewDetail: {
        screen: AttSubmitBusinessTravelTransferViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    TopTabAttApproveBusinessTravelTransfer: {
        screen: TopTabAttApproveBusinessTravelTransfer,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsTopTabCustomHeaderRight(
                navigation,
                'HRM_Attendance_BusinessTravelTransfer_Approve'
            )
    },
    AttApproveBusinessTravelTransferViewDetail: {
        screen: AttApproveBusinessTravelTransferViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    AttApprovedBusinessTravelTransferViewDetail: {
        screen: AttApprovedBusinessTravelTransferViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    //#endregion

    //#region [module/attendance/attPregnancy]
    AttSubmitPregnancy: {
        screen: AttSubmitPregnancy,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Attendance_PregnancyRegister_AddNew')
    },
    AttSubmitPregnancyAddOrEdit: {
        screen: AttSubmitPregnancyAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'Business_Travel_Create')
    },
    AttSubmitPregnancyViewDetail: {
        screen: AttSubmitPregnancyViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    TopTabAttApprovePregnancy: {
        screen: TopTabAttApprovePregnancy,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsTopTabCustomHeaderRight(navigation, 'ApproveType__E_PREGNANCYREGISTER')
    },
    AttApprovePregnancyViewDetail: {
        screen: AttApprovePregnancyViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    AttApprovedPregnancyViewDetail: {
        screen: AttApprovedPregnancyViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    //#endregion

    //#region [module/attendance/attShiftSubstitution]
    AttSubmitShiftSubstitution: {
        screen: AttSubmitShiftSubstitution,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Attendance_ShiftSubstitution')
    },
    AttSubmitShiftSubstitutionAddOrEdit: {
        screen: AttSubmitShiftSubstitutionAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Attendance_ShiftSubstitution_Popup_Create')
    },
    AttSubmitShiftSubstitutionViewDetail: {
        screen: AttSubmitShiftSubstitutionViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    AttWaitConfirmShiftSubstitution: {
        screen: TopTabAttWaitConfirmShiftSubstitution,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Att_ShiftSubstitution_Confirm')
    },
    AttWaitConfirmShiftSubstitutionViewDetail: {
        screen: AttWaitConfirmShiftSubstitutionViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    AttWaitConfirmedShiftSubstitutionViewDetail: {
        screen: AttWaitConfirmedShiftSubstitutionViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    TopTabAttApproveShiftSubstitution: {
        screen: TopTabAttApproveShiftSubstitution,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsTopTabCustomHeaderRight(navigation, 'HRM_Att_ShiftSubstitution_Approve')
    },
    AttApproveShiftSubstitutionViewDetail: {
        screen: AttApproveShiftSubstitutionViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    AttApprovedShiftSubstitutionViewDetail: {
        screen: AttApprovedShiftSubstitutionViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    //#endregion

    //#region [module/humanResource/HreStopWorking]
    HreSubmitStopWorking: {
        screen: HreSubmitStopWorking,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Hre_PersonalSubmitStopWorking_List')
    },
    HreSubmitStopWorkingAddOrEdit: {
        screen: HreSubmitStopWorkingAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HreSubmitStopWorkingAddOrEdit')
    },
    HreSubmitStopWorkingAddOrEditNext: {
        screen: HreSubmitStopWorkingAddOrEditNext,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_HR_Profile_AdditionalInfo')
    },
    HreSubmitStopWorkingViewDetail: {
        screen: HreSubmitStopWorkingViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    TopTabHreSubmitStopWorking: {
        screen: TopTabHreSubmitStopWorking,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Hr_StopWorkingWaiting')
    },
    HreApproveStopWorkingViewDetail: {
        screen: HreApproveStopWorkingViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    HreApprovedStopWorkingViewDetail: {
        screen: HreApprovedStopWorkingViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },

    //#region [module/humanResource/HreWorkHistorySalary]
    HreSubmitWorkHistorySalary: {
        screen: HreSubmitWorkHistorySalary,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Hre_WorkHistorySalary')
    },
    HreSubmitWorkHistorySalaryAddOrEdit: {
        screen: HreSubmitWorkHistorySalaryAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HreSubmitWorkHistorySalaryAddOrEdit')
    },
    HreSubmitWorkHistorySalaryAddOrEditNext: {
        screen: HreSubmitWorkHistorySalaryAddOrEditNext,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'TChange__Hre_ProfileMoreInfo')
    },
    HreSubmitWorkHistorySalaryViewDetail: {
        screen: HreSubmitWorkHistorySalaryViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    TopTabHreApproveWorkHistorySalary: {
        screen: TopTabHreApproveWorkHistorySalary,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Hre_WorkHistorySalary_Approve')
    },
    HreApproveWorkHistorySalaryViewDetail: {
        screen: HreApproveWorkHistorySalaryViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    HreApprovedWorkHistorySalaryViewDetail: {
        screen: HreApprovedWorkHistorySalaryViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },

    //#endregion

    //#region [module/humanResource/HreRequirementRecruitment]
    HreSubmitRequirementRecruitment: {
        screen: HreSubmitRequirementRecruitment,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Rec_List_Require')
    },
    HreSubmitRequirementRecruitmentAddOrEdit: {
        screen: HreSubmitRequirementRecruitmentAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HreSubmitRequirementRecruitmentAddOrEdit')
    },
    HreSubmitRequirementRecruitmentAddOrEditNext: {
        screen: HreSubmitRequirementRecruitmentAddOrEditNext,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'TChange__Hre_ProfileMoreInfo')
    },
    HreSubmitRequirementRecruitmentViewDetail: {
        screen: HreSubmitRequirementRecruitmentViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    TopTabHreApproveRequirementRecruitment: {
        screen: TopTabHreApproveRequirementRecruitment,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'BusinessType__E_REQUIREMENTRECRUITMENT')
    },
    HreApproveRequirementRecruitmentViewDetail: {
        screen: HreApproveRequirementRecruitmentViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    HreApprovedRequirementRecruitmentViewDetail: {
        screen: HreApprovedRequirementRecruitmentViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },

    //#endregion

    HreLanguageLevel: {
        screen: HreLanguageLevel,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Hre_ProfileLanguageLevel')
    },
    HreLanguageLevelViewDetail: {
        screen: HreLanguageLevelViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    HreSurveyEmployee: {
        screen: HreTopTabSurvey,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'CategoryType__E_EMPLOYEE')
    },
    HreSurveyEmployeeViewDetail: {
        screen: HreSurveyEmployeeViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'CategoryType__E_EMPLOYEE')
    },
    HreSurveyQuiz: {
        screen: HreSurveyQuiz,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Hre_SurveyQuiz')
    },
    HreSurveyQuizViewDetail: {
        screen: HreSurveyQuizViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    HreSurveyHistoryViewDetail: {
        screen: HreSurveyHistoryViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    //#endregion

    //#region [module/humanResource/SubmitProfileCard]
    HreSubmitProfileCard: {
        screen: HreSubmitProfileCard,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_PortalApp_WearableTagSubscriptions')
    },
    HreSubmitProfileCardAddOrEdit: {
        screen: HreSubmitProfileCardAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'Hrm_Hre_ProfileCard_Add')
    },
    HreSubmitProfileCardViewDetail: {
        screen: HreSubmitProfileCardViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    //#endregion

    AttRequest: {
        screen: AttRequest,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Data_Requested')
    },
    FilterList: {
        screen: FilterList,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Filter_Data')
    },
    FilterListV3: {
        screen: FilterListV3,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Filter_Data')
    },
    //#region [module/Attendance]
    AttDataWorkdaysEmps: {
        screen: AttDataWorkdaysEmps,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Att_Workdays_Emps')
    },
    AttDataWorkdaysEmpsViewDetail: {
        screen: AttDataWorkdaysEmpsViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    //#endregion
    //#region [modules/Evaluate]
    EvaPerformanceQuicklyHistory: {
        screen: EvaPerformanceQuicklyHistory,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Evaluate_Flight_History')
    },
    EvaPerformanceQuicklyHistoryViewDetail: {
        screen: EvaPerformanceQuicklyHistoryViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    EvaPerformanceEvaDataResultV3: {
        screen: EvaPerformanceEvaDataResultV3,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Evaluation_PerformanceResultV3_Title')
    },
    EvaPerformanceEvaDataResultV3Detail: {
        screen: EvaPerformanceEvaDataResultV3Detail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    EvaPerformanceEvaDataResultV3Edit: {
        screen: EvaPerformanceEvaDataResultV3Edit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Eva_PerformanceEvaDataResultV3_EditResult')
    },
    EvaPerformanceGroupTargetViewDetail: {
        screen: EvaPerformanceGroupTargetViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Evaluation_KPIGroup_KPIGroupName_Detail')
    },
    EvaPerformanceTargetViewDetail: {
        screen: EvaPerformanceTargetViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Evaluation_KPI_KPIGName_Detail')
    },
    EvaPerformanceQuickly: {
        screen: EvaPerformanceQuickly,
        navigationOptions: ({ navigation }) => navigationOptionsQuicklyEvaluateCreate(navigation, 'HRM_Evaluate_Flight')
    },
    EvaPerformanceQuicklyProfileDetail: {
        screen: EvaPerformanceQuicklyProfileDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    EvaPerformanceQuicklyProfileEdit: {
        screen: EvaPerformanceQuicklyProfileEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Quickly_Evaluation_Performance_Edit_Title')
    },
    EvaPerformanceQuicklyTargetDetail: {
        screen: EvaPerformanceQuicklyTargetDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    EvaPerformanceQuicklyTargetEdit: {
        screen: EvaPerformanceQuicklyTargetEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Edit_In_bulk')
    },
    EvaPerformanceQuicklyAdd: {
        screen: EvaPerformanceQuicklyAdd,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Quickly_Evaluation_Performance_Create_Title')
    },
    EvaPerformanceQuicklyAddChoseMore: {
        screen: EvaPerformanceQuicklyAddChoseMore,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ChoseMore_Info')
    },
    EvaPerformanceResult: {
        screen: EvaPerformanceResult,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Evaluation_Result')
    },
    EvaPerformanceResultViewDetail: {
        screen: EvaPerformanceResultViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    EvaPerformanceWait: {
        screen: EvaPerformanceWait,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Portal_Personal_WaitingEvaluation')
    },
    EvaPerformanceWaitViewDetail: {
        screen: EvaPerformanceWaitViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    EvaPerformanceWaitEvaluation: {
        screen: EvaPerformanceWaitEvaluation,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Portal_Personal_WaitingEvaluation')
    },

    // Đánh giá V2 (Mới)
    EvaEmployee: {
        screen: EvaEmployee,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'DS Nhân viên đánh giá')
    },
    EvaEmployeeViewDetail: {
        screen: EvaEmployeeViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'Nhân viên tự đánh giá')
    },
    EvaSubmitManager: {
        screen: EvaSubmitManager,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'Quản lý đánh giá')
    },
    EvaSubmitManagerAddOrEdit: {
        screen: EvaSubmitManagerAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'Tạo mới tiêu chí')
    },
    EvaSubmitManagerViewDetail: {
        screen: EvaSubmitManagerViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'DS quản lý đánh giá')
    },
    EvaCapacityEmployeeViewDetail: {
        screen: EvaCapacityEmployeeViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'Chi tiết đánh giá nhân viên')
    },
    TopTabEvaCapacityDetail: {
        screen: TopTabEvaCapacityDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'DS chi tiết đánh giá')
    },
    //#endregion

    //#region [module/salary/salUnusualAllowance]
    SalSubmitUnusualAllowance: {
        screen: SalSubmitUnusualAllowance,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Sal_UnusualAllowance_Title')
    },
    SalSubmitUnusualAllowanceAddOrEdit: {
        screen: SalSubmitUnusualAllowanceAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Recruitment_UnusualAllowance_Create_Title')
    },
    SalSubmitUnusualAllowanceViewDetail: {
        screen: SalSubmitUnusualAllowanceViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    //#endregion

    //#region [module/salary/SalSubmitPITAmount]
    SalSubmitPITAmount: {
        screen: SalSubmitPITAmount,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'Sal_PITAmountTab')
    },
    SalSubmitPITAmountViewDetail: {
        screen: SalSubmitPITAmountViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    //#endregion

    //#region [module/salary/SalSubmitPITAmount]
    TopTabSalApprovePITFinalization: {
        screen: TopTabSalApprovePITFinalization,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsTopTabCustomHeaderRight(navigation, 'HRM_Payroll_PITFinalizationDelegatee')
    },
    SalApprovePITFinalizationAddOrEdit: {
        screen: SalApprovePITFinalizationAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(
                navigation,
                'HRM_Payroll_Sal_PITFinalizationDelegatee_Create_Title'
            )
    },
    SalApprovePITFinalizationViewDetail: {
        screen: SalApprovePITFinalizationViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    SalApprovedPITFinalizationViewDetail: {
        screen: SalApprovedPITFinalizationViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    //#endregion

    //#region [module/salary/salRewardPayslip]
    SalRewardPayslip: {
        screen: SalRewardPayslip,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Sal_RewardPayslip_Title')
    },
    SalRewardPayslipViewDetail: {
        screen: SalRewardPayslipViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    //#endregion

    //#region [module/salary/salPaymentCostRegister]
    SalSubmitPaymentCostRegister: {
        screen: SalSubmitPaymentCostRegister,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'BusinessType__E_SAL_PAYMENT_COST')
    },
    SalSubmitPaymentCostRegisterAddOrEdit: {
        screen: SalSubmitPaymentCostRegisterAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Sal_PaymentCostRegister_Create_Title')
    },
    SalSubmitPaymentCostRegisterAddPay: {
        screen: SalSubmitPaymentCostRegisterAddPay,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_SearchAddPayCost')
    },
    SalSubmitPaymentCostRegisterViewDetail: {
        screen: SalSubmitPaymentCostRegisterViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    SalSubmitPaymentCostRegisterMoreViewDetail: {
        screen: SalSubmitPaymentCostRegisterMoreViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    //#endregion

    //#region [module/humanResource/HreApproveEvaluationDoc]
    TopTabHreApproveEvaluationDoc: {
        screen: TopTabHreApproveEvaluationDoc,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Hre_EvaluationDoc')
    },
    HreApproveEvaluationDocViewDetail: {
        screen: HreApproveEvaluationDocViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    HreApprovedEvaluationDocViewDetail: {
        screen: HreApprovedEvaluationDocViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    HreApproveEvaluationDocDocument: {
        screen: HreApproveEvaluationDocDocument,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Hre_EvaluationDoc_ApprovePopup')
    },
    //#endregion
    //#region [module/humanResource/HreApproveViolation]
    TopTabHreApproveViolation: {
        screen: TopTabHreApproveViolation,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_New_Hre_ViolationApprove')
    },
    HreApproveViolationViewDetail: {
        screen: HreApproveViolationViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    HreApprovedViolationViewDetail: {
        screen: HreApprovedViolationViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    //#endregion

    //#region [modules/insInsuranceRecord]
    TopTabInsInsuranceRecord: {
        screen: TopTabInsInsuranceRecord,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Insurance_InsuranceRecord')
    },
    InsInsuranceRecordViewDetail: {
        screen: InsInsuranceRecordViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    InsInsuranceRecordWaitingViewDetail: {
        screen: InsInsuranceRecordWaitingViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    InsInsuranceRecordAddOrEdit: {
        screen: InsInsuranceRecordAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Insurance_InsuranceRecord_PopUp_Create_Title')
    },
    InsInsuranceRecordWaitingAddOrEdit: {
        screen: InsInsuranceRecordWaitingAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Insurance_InsuranceRecord_PopUp_Create_Title')
    },
    //#endregion

    //#region [modules/InsChangeInsInfoRegister]
    InsSubmitChangeInsInfoRegister: {
        screen: InsSubmitChangeInsInfoRegister,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(
                navigation,
                'HRM_Insurance_ChangeInsInfoRegister_Title_List'
            )
    },
    InsSubmitChangeInsInfoRegisterViewDetail: {
        screen: InsSubmitChangeInsInfoRegisterViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    InsSubmitChangeInsInfoRegisterAddOrEdit: {
        screen: InsSubmitChangeInsInfoRegisterAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(
                navigation,
                'HRM_Insurance_Ins_ChangeInsInfoRegister_PopUp_Addnew_Title'
            )
    },
    //#endregion

    //#region [modules/other/checkInventory]
    CheckInventory: {
        screen: CheckInventory,
        navigationOptions: ({ navigation }) => FunctionCommon.navigationOptionsConfigHeaderNull(navigation, '')
    },
    CheckInventoryViewDetail: {
        screen: CheckInventoryViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Hre_CheckInventory_Detail')
    },

    AppVui: {
        screen: AppVui,
        navigationOptions: ({ navigation }) => FunctionCommon.navigationOptionsConfigGoBack(navigation, 'Vui App')
    },
    //#endregion

    //#region [modules/other/TraAttendace]
    TraAttendance: {
        screen: TraAttendance,
        navigationOptions: ({ navigation }) => FunctionCommon.navigationOptionsConfigHeaderNull(navigation, '')
    },
    TraAttendanceV2: {
        screen: TraAttendanceV2,
        navigationOptions: ({ navigation }) => FunctionCommon.navigationOptionsConfigHeaderNull(navigation, '')
    },
    //#endregion

    //#region [module/generalInfo/Medical/MedImmunization]
    MedicalGeneral: {
        screen: MedicalGeneral,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_HR_Medical_Portal')
    },
    MedImmunization: {
        screen: MedImmunization,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HR_ImmunizationRecord_Portal')
    },
    MedImmunizationViewDetail: {
        screen: MedImmunizationViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    MedImmunizationAddOrEdit: {
        screen: MedImmunizationAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Med_ImmunizationRecord_PopUp_Create_Title')
    },
    MedAnnualHealth: {
        screen: MedAnnualHealth,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Medical_AnnualHealth_List_Title')
    },
    MedAnnualHealthViewDetail: {
        screen: MedAnnualHealthViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    MedAnnualHealthAddOrEdit: {
        screen: MedAnnualHealthAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Medical_AnnualHealth_Create')
    },
    MedHistoryMedical: {
        screen: MedHistoryMedical,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HR_HistoryMedical_Portal')
    },
    MedHistoryMedicalViewDetail: {
        screen: MedHistoryMedicalViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    MedHistoryMedicalAddOrEdit: {
        screen: MedHistoryMedicalAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Medical_HistoryMedical_Create_Title')
    },
    // HR_HealthCheckupResults_Portal

    SalChangePasswordFromHome: {
        screen: SalChangePassword,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_Sal_Change_Password_First')
    },
    SalChangePasswordFromHomeV3: {
        screen: SalChangePasswordV3,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_System_ConfirmChangePasswordPayslip')
    },
    //#endregion

    //#region [module/humanResource/HreHappyBirthday]
    HreHappyBirthday: {
        screen: HreHappyBirthday,
        navigationOptions: ({ navigation }) => FunctionCommon.navigationOptionsConfigHeaderNull(navigation, '')
    },
    //#endregion

    //#region [module/comCompliment/ComCompliment]

    ComCompliment: {
        screen: ComCompliment,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_PortalApp_Compliment')
    },
    HistoryOfComComplimented: {
        screen: HistoryOfComComplimented,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(
                navigation,
                'HRM_PortalApp_Compliment_ComplimentingColleaguesHistory'
            )
    },
    HistoryOfComComplimenting: {
        screen: HistoryOfComComplimenting,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_Compliment_PraisedHistory')
    },
    HistoryConversion: {
        screen: HistoryConversion,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_Exchange_History')
    },
    GiftComCompliment: {
        screen: GiftComCompliment,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'Danh sách quà tặng')
    },
    GiftComComplimentViewDetail: {
        screen: GiftComComplimentViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'Chi tiết quà tặng')
    },
    RankingPersonal: {
        screen: RankingPersonal,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_PersonalRanking')
    },
    RankingPeopleGiving: {
        screen: RankingPeopleGiving,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_RankingOfPeopleGiving')
    },
    RankingDepartment: {
        screen: RankingDepartment,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_RankingDepartment')
    },
    RankingCriteria: {
        screen: RankingCriteria,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_RankingCriteria')
    },
    //#endregion

    //#region [module/hreProfileCard/HreProfileCard]
    TopTabHreApproveProfileCard: {
        screen: TopTabHreApproveProfileCard,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_HRE_ProfileCardList_Approve')
    },
    HreApproveProfileCardViewDetail: {
        screen: HreApproveProfileCardViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    HreApprovedProfileCardViewDetail: {
        screen: HreApprovedProfileCardViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },

    //#endregion

    //#region [module/profileInfo/computerLevel]
    TopTabComputerLevel: {
        screen: TopTabComputerLevel,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Hre_TabComputerSkill')
    },
    ComputerLevelAddOrEdit: {
        screen: ComputerLevelAddOrEdit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_HR_ComputerLevel_PopUp_Create_Title')
    },
    ComputerLevelConfirmedViewDetail: {
        screen: ComputerLevelConfirmedViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    ComputerLevelWaitConfirmViewDetail: {
        screen: ComputerLevelWaitConfirmViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    //#endregion

    //#region [module/profileInfo/workPermit]
    WorkPermit: {
        screen: WorkPermit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Hre_WorkPermit')
    },
    WorkPermitViewDetail: {
        screen: WorkPermitViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    //#endregion

    //#region [module/profileInfo/ResidenceCard]
    ResidenceCard: {
        screen: ResidenceCard,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Hre_ResidenceCard')
    },
    ResidenceCardViewDetail: {
        screen: ResidenceCardViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    //#endregion

    //#region [module/attV3/attLeaveFundManagement]
    AttLeaveFundManagement: {
        screen: AttLeaveFundManagement,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_TitleHeader_LeaveFundManagement')
    },
    AttLeaveFundManagementViewDetail: {
        screen: AttLeaveFundManagementViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },
    //#endregion

    //#region [module/profileInfo/profileAddition]
    ProfileAddition: {
        screen: ProfileAddition,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_ListRequestDocs')
    },
    //#endregion

    //region [module/humanResource/hreEventCalendar]
    HreEventCalendar: {
        screen: HreEventCalendar,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigHeaderNull(navigation, 'HRM_System_Resource_Sys_Event')
    },
    //#endregion

    //#region [module/humanResources/HreWorkHistory
    HreWorkHistorySubmit: {
        screen: HreWorkHistorySubmit,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_AchievementsContributions')
    },
    HreWorkHistorySubmitViewDetail: {
        screen: HreWorkHistorySubmitViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Common_ViewMore')
    },

    //#endregion

    //#region [module/humanResource/HrePersonalManage]
    HrePersonalManage: {
        screen: HrePersonalManage,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_PortalApp_HrePersonalManage_Title')
    },
    TopTabPersonalInfoManage: {
        screen: TopTabPersonalInfoManage,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_HrePersonalInfoManage_Title')
    },
    HrePersonalInfoManageViewDetail: {
        screen: HrePersonalInfoManageViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_HrePersonalManage_TitleDetail')
    },
    HreDocumentManageViewDetail: {
        screen: HreDocumentManageViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_HrePersonalManage_TitleDetail')
    },
    TopTabInforContactManage: {
        screen: TopTabInforContactManage,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_Contact')
    },
    HreInforContactViewDetail: {
        screen: HreInforContactViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_ContactInformation')
    },
    TopTabPartyAndUnionManage: {
        screen: TopTabPartyAndUnionManage,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_CommunistAndUnion')
    },
    HrePartyAndUnionViewDetail: {
        screen: HrePartyAndUnionViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_CommunistAndUnionDetail')
    },
    //#endregion

    //#region [module/humanResource/hreTerminationOfWork
    TopTabHreApproveTerminationOfWork: {
        screen: TopTabHreApproveTerminationOfWork,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(
                navigation,
                'HRM_PortalApp_TerminationOfWork_ApproveTermination'
            )
    },
    HreSubmitTerminationOfWork: {
        screen: HreSubmitTerminationOfWork,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_PortalApp_RegistrationForResignation')
    },
    HreApproveTerminationOfWorkViewDetail: {
        screen: HreApproveTerminationOfWorkViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_DetailsOfLeaveApproval')
    },
    HreApprovedTerminationOfWorkViewDetail: {
        screen: HreApproveTerminationOfWorkViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_DetailsOfLeaveApproval')
    },
    HreRejectTerminationOfWorkViewDetail: {
        screen: HreApproveTerminationOfWorkViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_DetailsOfLeaveApproval')
    },
    HreCanceledTerminationOfWorkViewDetail: {
        screen: HreApproveTerminationOfWorkViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_DetailsOfLeaveApproval')
    },

    HreSubmitTerminationOfWorkViewDetail: {
        screen: HreSubmitTerminationOfWorkViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_DetailsOfLeaveSubmit')
    },
    TopTabDocumentManage: {
        screen: TopTabDocumentManage,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_HreDocumentManage_Title')
    },
    TopTabRelativeManage: {
        screen: TopTabRelativeManage,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_HreRelativeManage_Title')
    },
    HreRelativeManageViewDetail: {
        screen: HreRelativeManageViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_HreRelativeManage_TitleDetail')
    },
    TopTabCompensationManage: {
        screen: TopTabCompensationManage,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_HreCompensationManage_Title')
    },
    HreCompensationManageViewDetail: {
        screen: HreCompensationManageViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_HreCompensationManage_TitleDetail')
    },
    TopTabAnnualManage: {
        screen: TopTabAnnualManage,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_HreAnnualManage_Title')
    },
    HreAnnualManageViewDetail: {
        screen: HreAnnualManageViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_HreAnnualManage_TitleDetail')
    },
    TopTabAccidentManage: {
        screen: TopTabAccidentManage,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_HreAccidentManage_Title')
    },
    HreAccidentManageViewDetail: {
        screen: HreAccidentManageViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_HreAccidentManage_TitleDetail')
    },
    TopTabRewardManage: {
        screen: TopTabRewardManage,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_HreRewardManage_Title')
    },
    HreRewardManageViewDetail: {
        screen: HreRewardManageViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_HreRewardManage_TitleDetail')
    },
    TopTabCandidateHistory: {
        screen: TopTabCandidateHistory,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_HreCandidateHistory_Title')
    },
    HreCandidateHistoryViewDetail: {
        screen: HreCandidateHistoryViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_HreCandidateHistory_TitleDetail')
    },
    TopTabPersonalInfoProfileIdentification: {
        screen: TopTabPersonalInfoProfileIdentification,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(
                navigation,
                'HRM_PortalApp_HrePersonalInfoProfileIdentification'
            )
    },
    HrePersonalInfoProfileIdentificationViewDetail: {
        screen: HrePersonalInfoProfileIdentificationViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_IdentityDocumentsDetails')
    },
    TopTabEducationLevel: {
        screen: TopTabEducationLevel,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_HreEducationLevel')
    },
    HreEducationLevelViewDetail: {
        screen: HreEducationLevelViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_EducationLevelDetails')
    },
    TopTabContractManage: {
        screen: TopTabContractManage,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_ContractHistory_Contract')
    },
    HreContractManageViewDetail: {
        screen: HreContractManageViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_HreContractManage_ContractDetails')
    },
    TopTabHreMovementHistory: {
        screen: TopTabHreMovementHistory,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_HreMovementHistory')
    },
    HreMovementHistoryViewDetail: {
        screen: HreMovementHistoryViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_MovementHistoryDetails')
    },
    TopTabConcurrentManage: {
        screen: TopTabConcurrentManage,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_Concurrent')
    },
    HreConcurrentManageViewDetail: {
        screen: HreConcurrentManageViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_ConcurrentDetails')
    },
    TopTabDisciplineManage: {
        screen: TopTabDisciplineManage,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_Discipline')
    },
    HreDisciplineManageViewDetail: {
        screen: HreDisciplineManageViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_DisciplineDetails')
    },
    TopTabTaxPayManage: {
        screen: TopTabTaxPayManage,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_TaxPay')
    },
    HreTaxPayManageViewDetail: {
        screen: HreTaxPayManageViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_TaxPayDetails')
    },
    TopTabInsuranceManage: {
        screen: TopTabInsuranceManage,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_Insurance')
    },
    HreInsuranceManageViewDetail: {
        screen: HreInsuranceManageViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_InsuranceDetails')
    },
    //#endregion

    //#region [module/humanResource/hreWorkManage]
    TopTabHreWorkBoard: {
        screen: TopTabHreWorkBoard,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_PortalApp_Tas_Task')
    },
    HreWorkBoardViewDetail: {
        screen: HreWorkBoardViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Hre_Task_Update_Details_Title')
    },
    TopTabHreWorkManage: {
        screen: TopTabHreWorkManage,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_PortalApp_Tas_TaskManage')
    },
    HreWorkManageViewDetail: {
        screen: HreWorkManageViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Hre_Task_Update_Details_Title')
    },
    //#endregion

    //#region [module/other/generalChart]
    TopTabChOrgChart: {
        screen: TopTabChOrgChart,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(
                navigation,
                'HRM_System_Sys_ManagePermission_Index_DepartmentTree'
            )
    },
    //#endregion

    // #region [module/humanResource/hreEvalutionContract
    TopTabEvaContract: {
        screen: TopTabEvalutionContract,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_PortalApp_EvalutionContract')
    },
    HreEvalutionContractViewDetail: {
        screen: HreEvalutionContractViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_DetailsOfContractEvaluation')
    },
    //#endregion

    TakePictureFace: {
        screen: TakePictureFace,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigHeaderNull(navigation, 'TakePictureFace')
    },

    ScanFace: {
        screen: ScanFace,
        navigationOptions: ({ navigation }) => FunctionCommon.navigationOptionsConfigHeaderNull(navigation, 'ScanFace')
    },

    //region [module/humanResource/hreEvaluationResult]
    HreEvaluationResult: {
        screen: HreEvaluationResult,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_EvaluationResult')
    },
    //#endregion

    //region [module/humanResource/hreEvaluationResult]
    HreProfileBadge: {
        screen: HreProfileBadge,
        navigationOptions: ({ navigation }) => FunctionCommon.navigationOptionsConfigGoBackHone(navigation, '')
    },

    // #region [module/salaryV3/salPITFinalization
    TopTabSalSubmitPITFinalization: {
        screen: TopTabSalSubmitPITFinalization,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_PortalApp_PITFinalization_Title')
    },
    SalSubmitPITFinalizationViewDetail: {
        screen: SalSubmitPITFinalizationViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_PITFinalization_ViewDetail')
    },
    //#endregion

    //region [module/attendanceV3/attRosterShiftChange]
    TopTabAttSubmitShiftChange: {
        screen: TopTabAttSubmitShiftChange,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_PortalApp_ShiftChange_RegisterTitle')
    },
    AttSubmitShiftChangeViewDetail: {
        screen: AttSubmitShiftChangeViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'AttSubmitShiftChangeViewDetail')
    },
    //#endregion

    //region [module/attendanceV3/attTakeDailyTask]
    TopTabAttSubmitTakeDailyTask: {
        screen: TopTabAttSubmitTakeDailyTask,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_PortalApp_AttSubmitDailyTask')
    },
    TopTabAttApproveTakeDailyTask: {
        screen: TopTabAttApproveTakeDailyTask,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_PortalApp_AttApproveDailyTask')
    },

    AttSubmitTakeDailyTaskViewDetail: {
        screen: AttSubmitTakeDailyTaskViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_TakeDailyTask_TitleDetail')
    },
    AttApproveTakeDailyTaskViewDetail: {
        screen: AttApproveTakeDailyTaskViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_ApproveTakeDailyTask_TitleDetail')
    },
    //#endregion

    //#region [module/profileInfo/visa]
    VisaViewDetail: {
        screen: VisaViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'VisaViewDetail')
    },
    //region [module/humanResource/hreInterview/hreInterviewCalendar]
    HreInterviewCalendar: {
        screen: HreInterviewCalendar,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigHeaderNull(navigation, 'HRM_PortalApp_ChedulerInterview')
    },
    TopTabHreInterview: {
        screen: TopTabHreInterview,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_TopTabInterview')
    },
    TopTabHreCandidateDetail: {
        screen: TopTabHreCandidateDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_CandidateDetail')
    },
    HreResultInterviewViewDetail: {
        screen: HreResultInterviewViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_ResultInterview')
    },
    //#endregion
    //region [module/humanResourceV3]
    TopTabHreProcessingCandidateApplications: {
        screen: TopTabHreProcessingCandidateApplications,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_PortalApp_ApproveCandidate')
    },
    HreProcessingCandidateApplicationsViewDetail: {
        screen: HreProcessingCandidateApplicationsViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_CandidateInformationDetails')
    },

    //hreRecruitmentReport
    TopTabHreRecruitmentReport: {
        screen: TopTabHreRecruitmentReport,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'Xử lý tờ trình tuyển dụng')
    },
    HreRecruitmentReportViewDetail: {
        screen: HreRecruitmentReportViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'Chi tiết tờ trình tuyển dụng')
    },
    //region [module/humanResourceV3/hreRecruitmentProposalProcessing]
    TopTabHreRecruitmentProposalProcessing: {
        screen: TopTabHreRecruitmentProposalProcessing,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_PortalApp_HreRecruitmentProposalProcessing')
    },
    HreRecruitmentProposalProcessingViewDetail: {
        screen: HreRecruitmentProposalProcessingViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_HreRecruitmentProposalProcessing_ViewDetail')
    },
    //#endregion

    TopTabHreApproveRecruitmentProposal: {
        screen: TopTabHreApproveRecruitmentProposal,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_PortalApp_ApproveRecruitmentProposal')
    },
    HreApproveRecruitmentProposalViewDetail: {
        screen: HreApproveRecruitmentProposalViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_RecruitmentProposalDetails')
    },

    //region [module/attV3/AttLeaveDayReplacement]
    TopTabAttLeaveDayReplacement: {
        screen: TopTabAttLeaveDayReplacement,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_PortalApp_AttLeaveDayReplacement_Title')
    },
    AttLeaveDayReplacementViewDetail: {
        screen: AttLeaveDayReplacementViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_AttLeaveDayReplacement_ViewDetail')
    },
    //region [module/humanResourceV3/hreRecruitmentProposalProcessing]
    HreCandidateProfile: {
        screen: HreCandidateProfile,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_PortalApp_ApproveCandidate')
    },
    HreCandidateProfileViewDetail: {
        screen: HreCandidateProfileViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_CandidateInformationDetails')
    },

    TopTabHreReceiveJob: {
        screen: TopTabHreReceiveJob,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_PortalApp_ReceiveJob')
    },
    //#endregion

    Loan: {
        screen: Loan,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_Loan')
    },

    //region [module/humanResourceV3/hreProcessingPostingPlan]
    TopTabHreProcessingPostingPlan: {
        screen: TopTabHreProcessingPostingPlan,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBackHone(navigation, 'HRM_PortalApp_HreProcessingPostingPlan')
    },
    HreProcessingPostingPlanViewDetail: {
        screen: HreProcessingPostingPlanViewDetail,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_HreProcessingPostingPlan_ViewDetail')
    },
    //#endregion

    AttNumberOfMeals: {
        screen: AttNumberOfMeals,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_MealVouchers')
    },

    AttNumberOfMealsHistory: {
        screen: AttNumberOfMealsHistory,
        navigationOptions: ({ navigation }) =>
            FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_PortalApp_MealHistory')
    }
};

const NavigatorStack0 = createStackNavigator(objStack, {
    navigationOptions: ({ navigation }) => ({ tabBarVisible: navigation.state.index < 1 }),
    // navigationOptions: {
    //     tabBarVisible: false,
    // },
    transitionConfig: () => ({
        transitionSpec: {
            duration: 0
        }
    }),
    headerLayoutPreset: 'center',
    defaultNavigationOptions: {
        // gesturesEnabled: false,
        animationEnabled: Platform.OS == 'ios' ? true : false
    }
});

export default NavigatorStack0;
