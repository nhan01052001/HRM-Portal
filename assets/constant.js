import { Platform } from 'react-native';
export const ScreenName = {
    AttendanceDetail: 'AttendanceDetail',
    AttendanceCalendarDetail: 'AttendanceCalendarDetail',
    AttendanceCalenderDetailHistory: 'AttendanceCalenderDetailHistory',
    AttendanceCalenderDetailHistoryDetail: 'AttendanceCalenderDetailHistoryDetail',
    Permission: 'Permission',
    AttCheckInGPS: 'GoogleMaps',
    AttTSLCheckInOutWifi: 'AttTSLCheckInOutWifi',
    AttTSLCheckInOutNFC: 'AttTSLCheckInOutNFC',
    GoogleMaps: 'GoogleMaps',
    AttSubmitLeaveDay: 'AttSubmitLeaveDay',
    AttSubmitLeaveDayAddOrEdit: 'AttSubmitLeaveDayAddOrEdit',
    AttSubmitLeaveDayViewDetail: 'AttSubmitLeaveDayViewDetail',
    AttApproveLeaveDay: 'AttApproveLeaveDay',
    AttApproveLeaveDayViewDetail: 'AttApproveLeaveDayViewDetail',
    AttApprovedLeaveDay: 'AttApprovedLeaveDay',
    AttApprovedLeaveDayViewDetail: 'AttApprovedLeaveDayViewDetail',

    AttSubmitLeaveDayCancel: 'AttSubmitLeaveDayCancel',
    AttSubmitLeaveDayCancelAddOrEdit: 'AttSubmitLeaveDayCancelAddOrEdit',
    AttSubmitLeaveDayCancelViewDetail: 'AttSubmitLeaveDayCancelViewDetail',
    AttApproveLeaveDayCancel: 'AttApproveLeaveDayCancel',
    AttApproveLeaveDayCancelViewDetail: 'AttApproveLeaveDayCancelViewDetail',
    AttApprovedLeaveDayCancel: 'AttApprovedLeaveDayCancel',
    AttApprovedLeaveDayCancelViewDetail: 'AttApprovedLeaveDayCancelViewDetail',

    AttSubmitRoster: 'AttSubmitRoster',
    AttSubmitRosterAddOrEdit: 'AttSubmitRosterAddOrEdit',
    AttSubmitRosterFlexibleAddOrEdit: 'AttSubmitRosterFlexibleAddOrEdit',
    AttSubmitRosterViewDetail: 'AttSubmitRosterViewDetail',
    AttApproveRoster: 'AttApproveRoster',
    AttApproveRosterViewDetail: 'AttApproveRosterViewDetail',
    AttApprovedRoster: 'AttApprovedRoster',
    AttApprovedRosterViewDetail: 'AttApprovedRosterViewDetail',

    AttSubmitRosterGroupByEmp: 'AttSubmitRosterGroupByEmp',
    AttSubmitRosterGroupByEmpAddOrEdit: 'AttSubmitRosterGroupByEmpAddOrEdit',
    AttSubmitRosterGroupByEmpViewDetail: 'AttSubmitRosterGroupByEmpViewDetail',
    AttApproveRosterGroupByEmp: 'AttApproveRosterGroupByEmp',
    AttApproveRosterGroupByEmpViewDetail: 'AttApproveRosterGroupByEmpViewDetail',
    AttApprovedRosterGroupByEmp: 'AttApprovedRosterGroupByEmp',
    AttApprovedRosterGroupByEmpViewDetail: 'AttApprovedRosterGroupByEmpViewDetail',

    AttSubmitShiftSubstitution: 'AttSubmitShiftSubstitution',
    AttSubmitShiftSubstitutionAddOrEdit: 'AttSubmitShiftSubstitutionAddOrEdit',
    AttSubmitShiftSubstitutionViewDetail: 'AttSubmitShiftSubstitutionViewDetail',
    AttApproveShiftSubstitution: 'AttApproveShiftSubstitution',
    AttApproveShiftSubstitutionViewDetail: 'AttApproveShiftSubstitutionViewDetail',
    AttApprovedShiftSubstitution: 'AttApprovedShiftSubstitution',
    AttApprovedShiftSubstitutionViewDetail: 'AttApprovedShiftSubstitutionViewDetail',
    AttWaitConfirmShiftSubstitution: 'AttWaitConfirmShiftSubstitution',
    AttWaitConfirmShiftSubstitutionViewDetail: 'AttWaitConfirmShiftSubstitutionViewDetail',
    AttWaitConfirmedShiftSubstitution: 'AttWaitConfirmedShiftSubstitution',
    AttWaitConfirmedShiftSubstitutionViewDetail: 'AttWaitConfirmedShiftSubstitutionViewDetail',

    AttSubmitTSLRegister: 'AttSubmitTSLRegister',
    AttSubmitTSLRegisterAddOrEdit: 'AttSubmitTSLRegisterAddOrEdit',
    AttSubmitTSLRegisterViewDetail: 'AttSubmitTSLRegisterViewDetail',
    AttApproveTSLRegister: 'AttApproveTSLRegister',
    AttApproveTSLRegisterViewDetail: 'AttApproveTSLRegisterViewDetail',
    AttApprovedTSLRegister: 'AttApprovedTSLRegister',
    AttApprovedTSLRegisterViewDetail: 'AttApprovedTSLRegisterViewDetail',

    AttSubmitOvertime: 'AttSubmitOvertime',
    AttSubmitOvertimeAddOrEdit: 'AttSubmitOvertimeAddOrEdit',
    AttSubmitOvertimeViewDetail: 'AttSubmitOvertimeViewDetail',
    AttApproveOvertime: 'AttApproveOvertime',
    AttApproveOvertimeViewDetail: 'AttApproveOvertimeViewDetail',
    AttApprovedOvertime: 'AttApprovedOvertime',
    AttApprovedOvertimeViewDetail: 'AttApprovedOvertimeViewDetail',

    AttSubmitLateEarlyAllowed: 'AttSubmitLateEarlyAllowed',
    AttSubmitLateEarlyAllowedAddOrEdit: 'AttSubmitLateEarlyAllowedAddOrEdit',
    AttSubmitLateEarlyAllowedViewDetail: 'AttSubmitLateEarlyAllowedViewDetail',
    AttApproveLateEarlyAllowed: 'AttApproveLateEarlyAllowed',
    AttApproveLateEarlyAllowedViewDetail: 'AttApproveLateEarlyAllowedViewDetail',
    AttApprovedLateEarlyAllowed: 'AttApprovedLateEarlyAllowed',
    AttApprovedLateEarlyAllowedViewDetail: 'AttApprovedLateEarlyAllowedViewDetail',

    AttSubmitPlanOvertime: 'AttSubmitPlanOvertime',
    AttSubmitPlanOvertimeAddOrEdit: 'AttSubmitPlanOvertimeAddOrEdit',
    AttSubmitPlanOvertimeViewDetail: 'AttSubmitPlanOvertimeViewDetail',
    AttApprovePlanOvertime: 'AttApprovePlanOvertime',
    AttApprovePlanOvertimeViewDetail: 'AttApprovePlanOvertimeViewDetail',
    AttApprovedPlanOvertime: 'AttApprovedPlanOvertime',
    AttApprovedPlanOvertimeViewDetail: 'AttApprovedPlanOvertimeViewDetail',

    AttSubmitPlanOvertimeCancel: 'AttSubmitPlanOvertimeCancel',
    AttSubmitPlanOvertimeCancelAddOrEdit: 'AttSubmitPlanOvertimeCancelAddOrEdit',
    AttSubmitPlanOvertimeCancelViewDetail: 'AttSubmitPlanOvertimeCancelViewDetail',
    AttApprovePlanOvertimeCancel: 'AttApprovePlanOvertimeCancel',
    AttApprovePlanOvertimeCancelViewDetail: 'AttApprovePlanOvertimeCancelViewDetail',
    AttApprovedPlanOvertimeCancel: 'AttApprovedPlanOvertimeCancel',
    AttApprovedPlanOvertimeCancelViewDetail: 'AttApprovedPlanOvertimeCancelViewDetail',

    // add new by nhan
    AttSubmitRegisterVehicle: 'AttSubmitRegisterVehicle',
    AttSubmitRegisterVehicleAddOrEdit: 'AttSubmitRegisterVehicleAddOrEdit',
    AttSubmitRegisterVehicleViewDetail: 'AttSubmitRegisterVehicleViewDetail',
    AttApproveRegisterVehicle: 'AttApproveRegisterVehicle',
    AttApproveRegisterVehicleViewDetail: 'AttApproveRegisterVehicleViewDetail',
    AttApprovedRegisterVehicle: 'AttApprovedRegisterVehicle',
    AttApprovedRegisterVehicleViewDetail: 'AttApprovedRegisterVehicleViewDetail',
    AttSubmitRegisterVehicleCancel: 'AttSubmitRegisterVehicleCancel',
    AttSubmitRegisterVehicleCancelAddOrEdit: 'AttSubmitRegisterVehicleCancelAddOrEdit',
    AttSubmitRegisterVehicleCancelViewDetail: 'AttSubmitRegisterVehicleCancelViewDetail',
    AttApproveRegisterVehicleCancel: 'AttApproveRegisterVehicleCancel',
    AttApproveRegisterVehicleCancelViewDetail: 'AttApproveRegisterVehicleCancelViewDetail',
    AttApprovedRegisterVehicleCancel: 'AttApprovedRegisterVehicleCancel',
    AttApprovedRegisterVehicleCancelViewDetail: 'AttApprovedRegisterVehicleCancelViewDetail',

    // TAX
    TaxSubmitTaxInformationRegister: 'TaxSubmitTaxInformationRegister',
    TaxSubmitTaxInformationRegisterAddOrEdit: 'TaxSubmitTaxInformationRegisterAddOrEdit',
    TaxSubmitTaxInformationRegisterViewDetail: 'TaxSubmitTaxInformationRegisterViewDetail',
    TaxApproveTaxInformationRegister: 'TaxApproveTaxInformationRegister',
    TaxApproveTaxInformationRegisterViewDetail: 'TaxApproveTaxInformationRegisterViewDetail',
    TaxApprovedTaxInformationRegister: 'TaxApprovedTaxInformationRegister',
    TaxApprovedTaxInformationRegisterViewDetail: 'TaxApprovedTaxInformationRegisterViewDetail',

    // salSubmitPITFinalization
    SalApprovePITFinalization: 'SalApprovePITFinalization',
    SalApprovePITFinalizationAddOrEdit: 'SalApprovePITFinalizationAddOrEdit',
    SalApprovePITFinalizationViewDetail: 'SalApprovePITFinalizationViewDetail',
    SalApprovedPITFinalization: 'SalApprovedPITFinalization',
    SalApprovedPITFinalizationAddOrEdit: 'SalApprovedPITFinalizationAddOrEdit',
    SalApprovedPITFinalizationViewDetail: 'SalApprovedPITFinalizationViewDetail',

    // Relative
    RelativeAddOrEdit: 'RelativeAddOrEdit',

    // Dependant
    DependantAddOrEdit: 'DependantAddOrEdit',

    // Passport
    PassportConfirmed: 'PassportConfirmed',
    PassportConfirmedViewDetail: 'PassportConfirmedViewDetail',
    PassportWaitConfirm: 'PassportWaitConfirm',
    PassportWaitConfirmViewDetail: 'PassportWaitConfirmViewDetail',

    // end add new by nhan

    AttSubmitBusinessTravel: 'AttSubmitBusinessTravel',
    AttSubmitBusinessTravelAddOrEdit: 'AttSubmitBusinessTravelAddOrEdit',
    AttSubmitBusinessTravelViewDetail: 'AttSubmitBusinessTravelViewDetail',
    AttApproveBusinessTravel: 'AttApproveBusinessTravel',
    AttApproveBusinessTravelViewDetail: 'AttApproveBusinessTravelViewDetail',
    AttApprovedBusinessTravel: 'AttApprovedBusinessTravel',
    AttApprovedBusinessTravelViewDetail: 'AttApprovedBusinessTravelViewDetail',

    AttSubmitBusinessTravelCancel: 'AttSubmitBusinessTravelCancel',
    AttSubmitBusinessTravelCancelAddOrEdit: 'AttSubmitBusinessTravelCancelAddOrEdit',
    AttSubmitBusinessTravelCancelViewDetail: 'AttSubmitBusinessTravelCancelViewDetail',
    AttApproveBusinessTravelCancel: 'AttApproveBusinessTravelCancel',
    AttApproveBusinessTravelCancelViewDetail: 'AttApproveBusinessTravelCancelViewDetail',
    AttApprovedBusinessTravelCancel: 'AttApprovedBusinessTravelCancel',
    AttApprovedBusinessTravelCancelViewDetail: 'AttApprovedBusinessTravelCancelViewDetail',

    AttSubmitBusinessTrip: 'AttSubmitBusinessTrip',
    AttSubmitBusinessTripAddOrEdit: 'AttSubmitBusinessTripAddOrEdit',
    AttSubmitBusinessTripViewDetail: 'AttSubmitBusinessTripViewDetail',
    AttApproveBusinessTrip: 'AttApproveBusinessTrip',
    AttApproveBusinessTripViewDetail: 'AttApproveBusinessTripViewDetail',
    AttApprovedBusinessTrip: 'AttApprovedBusinessTrip',
    AttApprovedBusinessTripViewDetail: 'AttApprovedBusinessTripViewDetail',

    AttSubmitBusinessTravelTransfer: 'AttSubmitBusinessTravelTransfer',
    AttSubmitBusinessTravelTransferAddOrEdit: 'AttSubmitBusinessTravelTransferAddOrEdit',
    AttSubmitBusinessTravelTransferViewDetail: 'AttSubmitBusinessTravelTransferViewDetail',
    AttApproveBusinessTravelTransfer: 'AttApproveBusinessTravelTransfer',
    AttApproveBusinessTravelTransferViewDetail: 'AttApproveBusinessTravelTransferViewDetail',
    AttApprovedBusinessTravelTransfer: 'AttApprovedBusinessTravelTransfer',
    AttApprovedBusinessTravelTransferViewDetail: 'AttApprovedBusinessTravelTransferViewDetail',

    AttSubmitPregnancy: 'AttSubmitPregnancy',
    AttSubmitPregnancyAddOrEdit: 'AttSubmitPregnancyAddOrEdit',
    AttSubmitPregnancyViewDetail: 'AttSubmitPregnancyViewDetail',
    AttApprovePregnancy: 'AttApprovePregnancy',
    AttApprovePregnancyViewDetail: 'AttApprovePregnancyViewDetail',
    AttApprovedPregnancy: 'AttApprovedPregnancy',
    AttApprovedPregnancyViewDetail: 'AttApprovedPregnancyViewDetail',

    EvaSubmitManager: 'EvaSubmitManager',
    EvaSubmitManagerAddOrEdit: 'EvaSubmitManagerAddOrEdit',
    EvaSubmitManagerViewDetail: 'EvaSubmitManagerViewDetail',
    EvaEmployee: 'EvaEmployee',
    EvaEmployeeViewDetail: 'EvaEmployeeViewDetail',
    EvaCapacityDetailWatting: 'EvaCapacityDetailWatting',
    EvaCapacityDetailWattingViewDetail: 'EvaCapacityDetailWattingViewDetail',
    EvaCapacityDetailConfirmed: 'EvaCapacityDetailConfirmed',
    EvaCapacityDetailConfirmedViewDetail: 'EvaCapacityDetailConfirmedViewDetail',

    AttPaidLeave: 'AttPaidLeave',
    AttPaidLeavePregnant: 'AttPaidLeavePregnant',
    AttPaidLeaveViewDetail: 'AttPaidLeaveViewDetail',
    AttConfirmLeaveDay: 'AttConfirmLeaveDay',
    FilterList: 'FilterList',
    // add new by nhan
    FilterListV3: 'FilterListV3',
    FilterToAddProfile: 'FilterToAddProfile',
    HreFilterToAddProfile: 'HreFilterToAddProfile',
    FilterToAddProfileViewDetail: 'FilterToAddProfileViewDetail',
    GeneralInfoInsuranceGrade: 'GeneralInfoInsuranceGrade',
    GradeInsuranceViewDetail: 'GradeInsuranceViewDetail',
    GeneralInfoReward: 'GeneralInfoReward',
    Reward: 'Reward',
    Contract: 'Contract',
    ContractDetail: 'ContractViewDetail',

    ContractHistoryConfirmed: 'ContractHistoryConfirmed',
    ContractHistoryConfirmedViewDetail: 'ContractHistoryConfirmedViewDetail',
    ContractHistoryAll: 'ContractHistoryAll',
    ContractHistoryAllViewDetail: 'ContractHistoryAllViewDetail',
    ContractHistoryWaitConfirm: 'ContractHistoryWaitConfirm',
    ContractHistoryWaitConfirmViewDetail: 'ContractHistoryWaitConfirmViewDetail',

    AppendixContract: 'AppendixContract',
    AppendixContractViewDetail: 'AppendixContractViewDetail',
    TaxInfo: 'TaxInfo',
    TaxInfoViewDetail: 'TaxInfoViewDetail',
    RewardViewDetail: 'RewardViewDetail',
    GeneralInfoDiscipline: 'GeneralInfoDiscipline',
    Discipline: 'Discipline',
    DisciplineViewDetail: 'DisciplineViewDetail',
    GeneralInfoTrainee: 'GeneralInfoTrainee',
    Trainee: 'Trainee',
    TraineeViewDetail: 'TraineeViewDetail',
    TraineeCertificate: 'TraineeCertificate',
    TraineeCertificateViewDetail: 'TraineeCertificateViewDetail',
    TraineePlan: 'TraineePlan',
    TraineePlanViewDetail: 'TraineePlanViewDetail',
    GeneralInfoDependant: 'GeneralInfoDependant',
    DependantViewDetail: 'DependantViewDetail',
    LookupProfile: 'LookupProfile',
    LookupProfileViewDetail: 'LookupProfileViewDetail',
    LookupRosterProfile: 'LookupRosterProfile',
    LookupRosterProfileViewDetail: 'LookupRosterProfileViewDetail',
    GeneralInfoSalaryGrade: 'GeneralInfoSalaryGrade',
    GradeSalaryViewDetail: 'GradeSalaryViewDetail',
    GeneralInfoAttendanceGrade: 'GeneralInfoAttendanceGrade',
    GradeAttendanceViewDetail: 'GradeAttendanceViewDetail',
    HreTaskAssigned: 'HreTaskAssigned',
    HreTaskAssign: 'HreTaskAssign',
    HreTaskFollow: 'HreTaskFollow',
    HreTaskViewDetail: 'HreTaskViewDetail',
    HreTaskEvaluation: 'HreTaskEvaluation',
    EvaPerformanceQuicklyHistory: 'EvaPerformanceQuicklyHistory',
    EvaPerformanceQuicklyHistoryViewDetail: 'EvaPerformanceQuicklyHistoryViewDetail',
    EvaPerformanceEvaDataResultV3: 'EvaPerformanceEvaDataResultV3',
    EvaPerformanceEvaDataResultV3Detail: 'EvaPerformanceEvaDataResultV3Detail',
    EvaPerformanceGroupTarget: 'EvaPerformanceGroupTarget',
    EvaPerformanceGroupTargetViewDetail: 'EvaPerformanceGroupTargetViewDetail',
    EvaPerformanceTarget: 'EvaPerformanceTarget',
    EvaPerformanceTargetViewDetail: 'EvaPerformanceTargetViewDetail',
    EvaPerformanceQuicklyProfile: 'EvaPerformanceQuicklyProfile',
    EvaPerformanceQuicklyProfileDetail: 'EvaPerformanceQuicklyProfileDetail',
    EvaPerformanceQuicklyTarget: 'EvaPerformanceQuicklyTarget',
    EvaPerformanceQuicklyTargetDetail: 'EvaPerformanceQuicklyTargetDetail',
    EvaPerformanceResult: 'EvaPerformanceResult',
    EvaPerformanceResultViewDetail: 'EvaPerformanceResultViewDetail',
    EvaPerformanceWait: 'EvaPerformanceWait',
    EvaPerformanceWaitViewDetail: 'EvaPerformanceWaitViewDetail',
    GeneralInfoListWorkHistory: 'GeneralInfoListWorkHistory',
    GeneralInfo: 'ProfileInfo',
    TopTabProfileBasicInfo: 'TopTabProfileBasicInfo',
    TopTabProfileContactInfo: 'TopTabProfileContactInfo',
    TopTabProfilePersonalInfo: 'TopTabProfilePersonalInfo',
    TopTabProfileBasicInfoUpdate: 'TopTabProfileBasicInfoUpdate',
    TopTabProfileContactInfoUpdate: 'TopTabProfileContactInfoUpdate',
    TopTabProfilePersonalInfoUpdate: 'TopTabProfilePersonalInfoUpdate',

    TopTabHisProfileBasicInfo: 'TopTabHisProfileBasicInfo',
    TopTabHisProfilePersonalInfo: 'TopTabHisProfilePersonalInfo',
    TopTabHisProfileContactInfo: 'TopTabHisProfileContactInfo',

    WorkHistory: 'WorkHistory',
    WorkPosition: 'WorkPosition',
    RequirementRecruitment: 'RequirementRecruitment',

    WorkDay: 'WorkDay',
    WorkDayV2: 'WorkDayV2',
    AttWorkDayCalendar: 'AttWorkDayCalendar',
    InOut: 'InOut',
    InOutViewDetail: 'InOutViewDetail',
    WorkHistoryViewDetail: 'WorkHistoryViewDetail',
    AnnualDetailViewDetail: 'AnnualDetailViewDetail',
    GeneralInfoAttAnnualDetail: 'GeneralInfoAttAnnualDetail',
    AnnualRemainViewDetail: 'AnnualRemainViewDetail',
    GeneralInfoAttAnnualRemainDetail: 'GeneralInfoAttAnnualRemainDetail',

    Salary: 'Salary',
    SalaryMonthDetail: 'SalaryMonthDetail',
    SalaryPayrollViewDetail: 'SalaryPayrollViewDetail',
    SalaryTempViewDetail: 'SalaryTempViewDetail',
    SalaryBonusViewDetail: 'SalaryBonusViewDetail',
    SalaryViewDetail: 'SalaryViewDetail',
    BasicSalaryDetail: 'BasicSalaryDetail',
    BasicSalaryDetailViewDetail: 'BasicSalaryDetailViewDetail',
    GeneralInfoSalBasicSalaryDetail: 'GeneralInfoSalBasicSalaryDetail',
    SalRewardPayslip: 'SalRewardPayslip',
    SalRewardPayslipViewDetail: 'SalRewardPayslipViewDetail',

    SalSubmitPITAmount: 'SalSubmitPITAmount',
    SalSubmitPITAmountViewDetail: 'SalSubmitPITAmountViewDetail',

    Messaging: 'Messaging',
    MessagingFilter: 'MessagingFilter',
    ChatListUserInGroup: 'ChatListUserInGroup',
    ChatFriend: 'ChatFriend',
    ChatGroup: 'ChatGroup',
    NewsSlider: 'NewsSlider',
    HreSubmitStopWorking: 'HreSubmitStopWorking',
    HreSubmitStopWorkingViewDetail: 'HreSubmitStopWorkingViewDetail',
    HreSubmitStopWorkingAddOrEdit: 'HreSubmitStopWorkingAddOrEdit',
    HreApproveStopWorking: 'HreApproveStopWorking',
    HreApproveStopWorkingViewDetail: 'HreApproveStopWorkingViewDetail',
    HreApprovedStopWorking: 'HreApprovedStopWorking',
    HreApprovedStopWorkingViewDetail: 'HreApprovedStopWorkingViewDetail',
    HreSubmitWorkHistorySalary: 'HreSubmitWorkHistorySalary',
    HreSubmitWorkHistorySalaryViewDetail: 'HreSubmitWorkHistorySalaryViewDetail',
    HreSubmitWorkHistorySalaryAddOrEdit: 'HreSubmitWorkHistorySalaryAddOrEdit',
    HreApproveWorkHistorySalary: 'HreApproveWorkHistorySalary',
    HreApproveWorkHistorySalaryViewDetail: 'HreApproveWorkHistorySalaryViewDetail',
    HreApprovedWorkHistorySalary: 'HreApprovedWorkHistorySalary',
    HreApprovedWorkHistorySalaryViewDetail: 'HreApprovedWorkHistorySalaryViewDetail',
    HreEventCalendar: 'HreEventCalendar',

    HreSubmitRequirementRecruitment: 'HreSubmitRequirementRecruitment',
    HreSubmitRequirementRecruitmentViewDetail: 'HreSubmitRequirementRecruitmentViewDetail',
    HreSubmitRequirementRecruitmentAddOrEdit: 'HreSubmitRequirementRecruitmentAddOrEdit',
    HreApproveRequirementRecruitment: 'HreApproveRequirementRecruitment',
    HreApproveRequirementRecruitmentViewDetail: 'HreApproveRequirementRecruitmentViewDetail',
    HreApprovedRequirementRecruitment: 'HreApprovedRequirementRecruitment',
    HreApprovedRequirementRecruitmentViewDetail: 'HreApprovedRequirementRecruitmentViewDetail',

    HreSubmitProfileCard: 'HreSubmitProfileCard',
    HreSubmitProfileCardViewDetail: 'HreSubmitProfileCardViewDetail',
    HreSubmitProfileCardAddOrEdit: 'HreSubmitProfileCardAddOrEdit',
    HreApproveProfileCard: 'HreApproveProfileCard',
    HreApproveProfileCardViewDetail: 'HreApproveProfileCardViewDetail',
    HreApprovedProfileCard: 'HreApprovedProfileCard',
    HreApprovedProfileCardViewDetail: 'HreApprovedProfileCardViewDetail',

    HreLanguageLevel: 'HreLanguageLevel',
    HreLanguageLevelViewDetail: 'HreLanguageLevelViewDetail',
    HreSurveyEmployee: 'HreSurveyEmployee',
    HreSurveyEmployeeViewDetail: 'HreSurveyEmployeeViewDetail',
    HreSurveyHistory: 'HreSurveyHistory',
    HreSurveyHistoryViewDetail: 'HreSurveyHistoryViewDetail',
    HreSurveyQuiz: 'HreSurveyQuiz',
    HreSurveyQuizViewDetail: 'HreSurveyQuizViewDetail',
    HreApproveEvaluationDoc: 'HreApproveEvaluationDoc',
    HreApproveEvaluationDocViewDetail: 'HreApproveEvaluationDocViewDetail',
    HreApprovedEvaluationDoc: 'HreApprovedEvaluationDoc',
    HreApprovedEvaluationDocViewDetail: 'HreApprovedEvaluationDocViewDetail',
    HreApproveViolation: 'HreApproveViolation',
    HreApproveViolationViewDetail: 'HreApproveViolationViewDetail',
    HreApprovedViolation: 'HreApprovedViolation',
    HreApprovedViolationViewDetail: 'HreApprovedViolationViewDetail',

    RelativeConfirmed: 'RelativeConfirmed',
    RelativeConfirmedViewDetail: 'RelativeConfirmedViewDetail',
    RelativeEdit: 'RelativeEdit',
    RelativeEditViewDetail: 'RelativeEditViewDetail',
    RelativeWaitConfirm: 'RelativeWaitConfirm',
    RelativeWaitConfirmViewDetail: 'RelativeWaitConfirmViewDetail',
    DependantConfirmed: 'DependantConfirmed',
    DependantConfirmedViewDetail: 'DependantConfirmedViewDetail',
    DependantEdit: 'DependantEdit',
    DependantEditViewDetail: 'DependantEditViewDetail',
    DependantWaitConfirm: 'DependantWaitConfirm',
    DependantWaitConfirmViewDetail: 'DependantWaitConfirmViewDetail',

    BankAccountAddOrEdit: 'BankAccountAddOrEdit',
    BankAccountConfirmed: 'BankAccountConfirmed',
    BankAccountConfirmedViewDetail: 'BankAccountConfirmedViewDetail',
    BankAccountEdit: 'BankAccountEdit',
    BankAccountEditViewDetail: 'BankAccountEditViewDetail',
    BankAccountWaitConfirm: 'BankAccountWaitConfirm',
    BankAccountWaitConfirmViewDetail: 'BankAccountWaitConfirmViewDetail',
    BankWalletConfirmViewDetail: 'BankWalletConfirmViewDetail',
    HouseholdAddRelative: 'HouseholdAddRelative',
    HouseholdAddRelativeViewDetail: 'HouseholdAddRelativeViewDetail',
    HouseholdConfirmed: 'HouseholdConfirmed',
    HouseholdConfirmedViewDetail: 'HouseholdConfirmedViewDetail',
    BankAccountConfirm: 'BankAccountConfirm',
    BankAccountConfirmViewDetail: 'BankAccountConfirmViewDetail',
    BankWalletConfirmedViewDetail: 'BankWalletConfirmedViewDetail',
    HouseholdEdit: 'HouseholdEdit',
    HouseholdAddOrEdit: 'HouseholdAddOrEdit',
    HouseholdEditViewDetail: 'HouseholdEditViewDetail',
    HouseholdWaitConfirm: 'HouseholdWaitConfirm',
    HouseholdWaitConfirmViewDetail: 'HouseholdWaitConfirmViewDetail',
    QualificationConfirmed: 'QualificationConfirmed',
    QualificationConfirmedViewDetail: 'QualificationConfirmedViewDetail',
    QualificationEdit: 'QualificationEdit',
    QualificationEditViewDetail: 'QualificationEditViewDetail',
    QualificationWaitConfirm: 'QualificationWaitConfirm',
    QualificationWaitConfirmViewDetail: 'QualificationWaitConfirmViewDetail',

    Notification: 'Notification',
    NtfOverview: 'NtfOverview',
    NtfManage: 'NtfManage',
    NtfPersonal: 'NtfPersonal',

    SalSubmitUnusualAllowance: 'SalSubmitUnusualAllowance',
    SalSubmitUnusualAllowanceAddOrEdit: 'SalSubmitUnusualAllowanceAddOrEdit',
    SalSubmitUnusualAllowanceViewDetail: 'SalSubmitUnusualAllowanceViewDetail',
    SalSubmitPaymentCostRegister: 'SalSubmitPaymentCostRegister',
    SalSubmitPaymentCostRegisterAddOrEdit: 'SalSubmitPaymentCostRegisterAddOrEdit',
    SalSubmitPaymentCostRegisterViewDetail: 'SalSubmitPaymentCostRegisterViewDetail',
    SalSubmitPaymentCostRegisterAddPay: 'SalSubmitPaymentCostRegisterAddPay',

    LanguageLevelConfirmed: 'LanguageLevelConfirmed',
    LanguageLevelConfirmedViewDetail: 'LanguageLevelConfirmedViewDetail',
    LanguageLevelEdit: 'LanguageLevelEdit',
    LanguageLevelEditViewDetail: 'LanguageLevelEditViewDetail',
    LanguageLevelWaitConfirm: 'LanguageLevelWaitConfirm',
    LanguageLevelWaitConfirmViewDetail: 'LanguageLevelWaitConfirmViewDetail',

    WorkingExperienceConfirmed: 'WorkingExperienceConfirmed',
    WorkingExperienceConfirmedViewDetail: 'WorkingExperienceConfirmedViewDetail',
    WorkingExperienceEdit: 'WorkingExperienceEdit',
    WorkingExperienceEditViewDetail: 'WorkingExperienceEditViewDetail',
    WorkingExperienceWaitConfirm: 'WorkingExperienceWaitConfirm',
    WorkingExperienceWaitConfirmViewDetail: 'WorkingExperienceWaitConfirmViewDetail',
    WorkingExperienceAddOrEdit: 'WorkingExperienceAddOrEdit',

    AppendixInfomation: 'AppendixInfomation',
    AppendixInfomationViewDetail: 'AppendixInfomationViewDetail',

    InsInsuranceRecord: 'InsInsuranceRecord',
    InsInsuranceRecordViewDetail: 'InsInsuranceRecordViewDetail',
    InsInsuranceRecordWaiting: 'InsInsuranceRecordWaiting',
    InsInsuranceRecordWaitingViewDetail: 'InsInsuranceRecordWaitingViewDetail',
    InsInsuranceRecordAddOrEdit: 'InsInsuranceRecordAddOrEdit',
    InsInsuranceRecordWaitingAddOrEdit: 'InsInsuranceRecordWaitingAddOrEdit',
    InsSubmitChangeInsInfoRegister: 'InsSubmitChangeInsInfoRegister',
    InsSubmitChangeInsInfoRegisterViewDetail: 'InsSubmitChangeInsInfoRegisterViewDetail',
    InsSubmitChangeInsInfoRegisterAddOrEdit: 'InsSubmitChangeInsInfoRegisterAddOrEdit',

    MedImmunization: 'MedImmunization',
    MedImmunizationAddOrEdit: 'MedImmunizationAddOrEdit',
    MedImmunizationViewDetail: 'MedImmunizationViewDetail',

    MedAnnualHealth: 'MedAnnualHealth',
    MedAnnualHealthAddOrEdit: 'MedAnnualHealthAddOrEdit',
    MedAnnualHealthViewDetail: 'MedAnnualHealthViewDetail',

    MedHistoryMedical: 'MedHistoryMedical',
    MedHistoryMedicalAddOrEdit: 'MedHistoryMedicalAddOrEdit',
    MedHistoryMedicalViewDetail: 'MedHistoryMedicalViewDetail',

    // V3:
    // Region: TamScanLogRegister
    AttSubmitTamScanLogRegister: 'AttSubmitTamScanLogRegister',
    AttSaveTempSubmitTamScanLogRegister: 'AttSaveTempSubmitTamScanLogRegister',
    AttRejectSubmitTamScanLogRegister: 'AttRejectSubmitTamScanLogRegister',
    AttCanceledSubmitTamScanLogRegister: 'AttCanceledSubmitTamScanLogRegister',
    AttApproveSubmitTamScanLogRegister: 'AttApproveSubmitTamScanLogRegister',
    AttApprovedSubmitTamScanLogRegister: 'AttApprovedSubmitTamScanLogRegister',
    AttSubmitTamScanLogRegisterViewDetail: 'AttSubmitTamScanLogRegisterViewDetail',
    AttSubmitTamScanLogRegisterAddOrEdit: 'AttSubmitTamScanLogRegisterAddOrEdit',

    AttRejectTamScanLogRegister: 'AttRejectTamScanLogRegister',
    AttCanceledTamScanLogRegister: 'AttCanceledTamScanLogRegister',
    AttAllTamScanLogRegister: 'AttAllTamScanLogRegister',

    AttApproveTamScanLogRegister: 'AttApproveTamScanLogRegister',
    AttApproveTamScanLogRegisterViewDetail: 'AttApproveTamScanLogRegisterViewDetail',

    AttApprovedTamScanLogRegister: 'AttApprovedTamScanLogRegister',
    AttApprovedTamScanLogRegisterViewDetail: 'AttApprovedTamScanLogRegisterViewDetail',

    // Region: AttSubmitTakeLeaveDay
    AttSubmitTakeLeaveDay: 'AttSubmitTakeLeaveDay',
    AttSubmitTakeLeaveDayViewDetail: 'AttSubmitTakeLeaveDayViewDetail',
    AttSubmitTakeLeaveDayAddOrEdit: 'AttSubmitTakeLeaveDayAddOrEdit',
    AttSaveTempSubmitTakeLeaveDay: 'AttSaveTempSubmitTakeLeaveDay',
    AttCanceledSubmitTakeLeaveDay: 'AttCanceledSubmitTakeLeaveDay',
    AttApproveSubmitTakeLeaveDay: 'AttApproveSubmitTakeLeaveDay',
    AttApprovedSubmitTakeLeaveDay: 'AttApprovedSubmitTakeLeaveDay',
    AttRejectSubmitTakeLeaveDay: 'AttRejectSubmitTakeLeaveDay',

    AttApproveTakeLeaveDay: 'AttApproveTakeLeaveDay',
    AttApproveTakeLeaveDayViewDetail: 'AttApproveTakeLeaveDayViewDetail',

    AttApprovedTakeLeaveDay: 'AttApprovedTakeLeaveDay',
    AttApprovedTakeLeaveDayViewDetail: 'AttApprovedTakeLeaveDayViewDetail',

    AttRejectTakeLeaveDay: 'AttRejectTakeLeaveDay',
    AttCanceledTakeLeaveDay: 'AttCanceledTakeLeaveDay',
    AttAllTakeLeaveDay: 'AttAllTakeLeaveDay',

    // Region: AttSubmitTakeBusinessTrip
    AttSubmitTakeBusinessTrip: 'AttSubmitTakeBusinessTrip',
    AttSubmitTakeBusinessTripViewDetail: 'AttSubmitTakeBusinessTripViewDetail',
    AttSubmitTakeBusinessTripAddOrEdit: 'AttSubmitTakeBusinessTripAddOrEdit',
    AttApproveSubmitTakeBusinessTrip: 'AttApproveSubmitTakeBusinessTrip',
    AttApprovedSubmitTakeBusinessTrip: 'AttApprovedSubmitTakeBusinessTrip',
    AttSaveTempSubmitTakeBusinessTrip: 'AttSaveTempSubmitTakeBusinessTrip',
    AttRejectSubmitTakeBusinessTrip: 'AttRejectSubmitTakeBusinessTrip',
    AttCanceledSubmitTakeBusinessTrip: 'AttCanceledSubmitTakeBusinessTrip',

    AttApproveTakeBusinessTrip: 'AttApproveTakeBusinessTrip',
    AttApproveTakeBusinessTripViewDetail: 'AttApproveTakeBusinessTripViewDetail',

    AttApprovedTakeBusinessTrip: 'AttApprovedTakeBusinessTrip',
    AttApprovedTakeBusinessTripViewDetail: 'AttApprovedTakeBusinessTripViewDetail',

    AttRejectTakeBusinessTrip: 'AttRejectTakeBusinessTrip',
    AttCanceledTakeBusinessTrip: 'AttCanceledTakeBusinessTrip',
    AttAllTakeBusinessTrip: 'AttAllTakeBusinessTrip',

    // Region: AttBackWorkBeforeMaternity V3
    AttSubmitBackWorkBeforeMaternity: 'AttSubmitBackWorkBeforeMaternity',
    AttSubmitBackWorkBeforeMaternityViewDetail: 'AttSubmitBackWorkBeforeMaternityViewDetail',
    AttSubmitBackWorkBeforeMaternityAddOrEdit: 'AttSubmitBackWorkBeforeMaternityAddOrEdit',
    AttApproveSubmitBackWorkBeforeMaternity: 'AttApproveSubmitBackWorkBeforeMaternity',
    AttApprovedSubmitBackWorkBeforeMaternity: 'AttApprovedSubmitBackWorkBeforeMaternity',
    AttSaveTempSubmitBackWorkBeforeMaternity: 'AttSaveTempSubmitBackWorkBeforeMaternity',
    AttRejectSubmitBackWorkBeforeMaternity: 'AttRejectSubmitBackWorkBeforeMaternity',
    AttCanceledSubmitBackWorkBeforeMaternity: 'AttCanceledSubmitBackWorkBeforeMaternity',

    AttApproveBackWorkBeforeMaternity: 'AttApproveBackWorkBeforeMaternity',
    AttApproveBackWorkBeforeMaternityViewDetail: 'AttApproveBackWorkBeforeMaternityViewDetail',

    AttApprovedBackWorkBeforeMaternity: 'AttApprovedBackWorkBeforeMaternity',
    AttApprovedBackWorkBeforeMaternityViewDetail: 'AttApprovedBackWorkBeforeMaternityViewDetail',

    AttRejectBackWorkBeforeMaternity: 'AttRejectBackWorkBeforeMaternity',
    AttCanceledBackWorkBeforeMaternity: 'AttCanceledBackWorkBeforeMaternity',
    AttAllBackWorkBeforeMaternity: 'AttAllBackWorkBeforeMaternity',

    //Region: WorkingOvertime V3
    AttSubmitWorkingOvertime: 'AttSubmitWorkingOvertime',
    AttSubmitWorkingOvertimeAddOrEdit: 'AttSubmitWorkingOvertimeAddOrEdit',
    AttSubmitWorkingOvertimeViewDetail: 'AttSubmitWorkingOvertimeViewDetail',
    AttApproveWorkingOvertime: 'AttApproveWorkingOvertime',
    AttApproveWorkingOvertimeViewDetail: 'AttApproveWorkingOvertimeViewDetail',
    AttApprovedWorkingOvertime: 'AttApprovedWorkingOvertime',
    AttApprovedWorkingOvertimeViewDetail: 'AttApprovedWorkingOvertimeViewDetail',
    AttSaveTempSubmitWorkingOvertime: 'AttSaveTempSubmitWorkingOvertime',
    AttCanceledSubmitWorkingOvertime: 'AttCanceledSubmitWorkingOvertime',
    AttApproveSubmitWorkingOvertime: 'AttApproveSubmitWorkingOvertime',
    AttApprovedSubmitWorkingOvertime: 'AttApprovedSubmitWorkingOvertime',
    AttConfirmedSubmitWorkingOvertime: 'AttConfirmedSubmitWorkingOvertime',
    AttRejectSubmitWorkingOvertime: 'AttRejectSubmitWorkingOvertime',
    AttAllSubmitWorkingOvertime: 'AttAllSubmitWorkingOvertime',
    AttSaveTempWorkingOvertime: 'AttSaveTempWorkingOvertime',
    AttCanceledWorkingOvertime: 'AttCanceledWorkingOvertime',
    AttRejectWorkingOvertime: 'AttRejectWorkingOvertime',
    AttAllWorkingOvertime: 'AttAllWorkingOvertime',

    // Region: Att LateEarlyAllowed
    AttSubmitTakeLateEarlyAllowed: 'AttSubmitTakeLateEarlyAllowed',
    AttSubmitTakeLateEarlyAllowedAddOrEdit: 'AttSubmitTakeLateEarlyAllowedAddOrEdit',
    AttSubmitTakeLateEarlyAllowedViewDetail: 'AttSubmitTakeLateEarlyAllowedViewDetail',
    AttApproveTakeLateEarlyAllowed: 'AttApproveTakeLateEarlyAllowed',
    AttApproveTakeLateEarlyAllowedViewDetail: 'AttApproveTakeLateEarlyAllowedViewDetail',
    AttApprovedTakeLateEarlyAllowed: 'AttApprovedTakeLateEarlyAllowed',
    AttApprovedTakeLateEarlyAllowedViewDetail: 'AttApprovedTakeLateEarlyAllowedViewDetail',
    AttRejectSubmitTakeLateEarlyAllowed: 'AttRejectSubmitTakeLateEarlyAllowed',
    AttApprovedSubmitTakeLateEarlyAllowed: 'AttApprovedSubmitTakeLateEarlyAllowed',
    AttApproveSubmitTakeLateEarlyAllowed: 'AttApproveSubmitTakeLateEarlyAllowed',
    AttCanceledSubmitTakeLateEarlyAllowed: 'AttCanceledSubmitTakeLateEarlyAllowed',
    AttSaveTempSubmitTakeLateEarlyAllowed: 'AttSaveTempSubmitTakeLateEarlyAllowed',
    AttSaveTempTakeLateEarlyAllowed: 'AttSaveTempTakeLateEarlyAllowed',
    AttCanceledTakeLateEarlyAllowed: 'AttCanceledTakeLateEarlyAllowed',
    AttRejectTakeLateEarlyAllowed: 'AttRejectTakeLateEarlyAllowed',
    AttAllTakeLateEarlyAllowed: 'AttAllTakeLateEarlyAllowed',

    // khen ngợi:
    HistoryOfComComplimented: 'HistoryOfComComplimented',
    HistoryOfComComplimenting: 'HistoryOfComComplimenting',
    HistoryConversion: 'HistoryConversion',
    ComCompliment: 'ComCompliment',
    GiftComCompliment: 'GiftComCompliment',
    GiftComComplimentViewDetail: 'GiftComComplimentViewDetail',
    RankingPersonal: 'RankingPersonal',
    RankingPeopleGiving: 'RankingPeopleGiving',
    RankingDepartment: 'RankingDepartment',
    RankingCriteria: 'RankingCriteria',

    // Computer Level
    ComputerLevelConfirmed: 'ComputerLevelConfirmed',
    ComputerLevelConfirmedViewDetail: 'ComputerLevelConfirmedViewDetail',
    ComputerLevelWaitConfirm: 'ComputerLevelWaitConfirm',
    ComputerLevelWaitConfirmViewDetail: 'ComputerLevelWaitConfirmViewDetail',

    // Work Permit
    WorkPermit: 'WorkPermit',
    WorkPermitViewDetail: 'WorkPermitViewDetail',

    // Residence Card
    ResidenceCard: 'ResidenceCard',
    ResidenceCardViewDetail: 'ResidenceCardViewDetail',

    SocialInsurance: 'SocialInsurance',
    HealthInsurance: 'HealthInsurance',
    UnEmploymentInsurance: 'UnEmploymentInsurance',

    AttLeaveFundManagement: 'AttLeaveFundManagement',
    AttLeaveFundSeniorBonusViewDetail: 'AttLeaveFundSeniorBonusViewDetail',
    AttLeaveFundCompensatoryViewDetail: 'AttLeaveFundCompensatoryViewDetail',

    // Hre WorkHistory
    HreWorkHistorySubmit: 'HreWorkHistorySubmit',
    HreWorkHistorySubmitViewDetail: 'HreWorkHistorySubmitViewDetail',
    HreWorkHistorySubmitViewDetailConCurrentAllowance: 'HreWorkHistorySubmitViewDetailConCurrentAllowance',

    // hreWorkManage
    HreAllWorkBoard: 'HreAllWorkBoard',
    HreDoneWorkBoard: 'HreDoneWorkBoard',
    HreWaitWorkBoard: 'HreWaitWorkBoard',
    HreWorkBoardViewDetail: 'HreWorkBoardViewDetail',
    HreAllWorkManage: 'HreAllWorkManage',
    HreDoneWorkManage: 'HreDoneWorkManage',
    HreWaitWorkManage: 'HreWaitWorkManage',
    HreWorkManageViewDetail: 'HreWorkManageViewDetail',

    // hrePersonalInfoManage
    HreAllPersonalInfoManage: 'HreAllPersonalInfoManage',
    HreHirePersonalInfoManage: 'HreHirePersonalInfoManage',
    HreStopPersonalInfoManage: 'HreStopPersonalInfoManage',
    HreWaitPersonalInfoManage: 'HreWaitPersonalInfoManage',
    HrePersonalInfoManageViewDetail: 'HrePersonalInfoManageViewDetail',

    HreAllDocumentManage: 'HreAllDocumentManage',
    HreHireDocumentManage: 'HreHireDocumentManage',
    HreStopDocumentManage: 'HreStopDocumentManage',
    HreWaitDocumentManage: 'HreWaitDocumentManage',
    HreDocumentManageViewDetail: 'HreDocumentManageViewDetail',

    HreAllRelativeManage: 'HreAllRelativeManage',
    HreHireRelativeManage: 'HreHireRelativeManage',
    HreStopRelativeManage: 'HreStopRelativeManage',
    HreWaitRelativeManage: 'HreWaitRelativeManage',
    HreRelativeManageViewDetail: 'HreRelativeManageViewDetail',

    HreAllCompensationManage: 'HreAllCompensationManage',
    HreHireCompensationManage: 'HreHireCompensationManage',
    HreStopCompensationManage: 'HreStopCompensationManage',
    HreWaitCompensationManage: 'HreWaitCompensationManage',
    HreCompensationManageViewDetail: 'HreCompensationManageViewDetail',

    HreAllAnnualManage: 'HreAllAnnualManage',
    HreHireAnnualManage: 'HreHireAnnualManage',
    HreStopAnnualManage: 'HreStopAnnualManage',
    HreWaitAnnualManage: 'HreWaitAnnualManage',
    HreAnnualManageViewDetail: 'HreAnnualManageViewDetail',

    HreAllAccidentManage: 'HreAllAccidentManage',
    HreHireAccidentManage: 'HreHireAccidentManage',
    HreStopAccidentManage: 'HreStopAccidentManage',
    HreWaitAccidentManage: 'HreWaitAccidentManage',
    HreAccidentManageViewDetail: 'HreAccidentManageViewDetail',

    HreAllRewardManage: 'HreAllRewardManage',
    HreHireRewardManage: 'HreHireRewardManage',
    HreStopRewardManage: 'HreStopRewardManage',
    HreWaitRewardManage: 'HreWaitRewardManage',
    HreRewardManageViewDetail: 'HreRewardManageViewDetail',

    HreAllCandidateHistory: 'HreAllCandidateHistory',
    HreHireCandidateHistory: 'HreHireCandidateHistory',
    HreStopCandidateHistory: 'HreStopCandidateHistory',
    HreWaitCandidateHistory: 'HreWaitCandidateHistory',
    HreCandidateHistoryViewDetail: 'HreCandidateHistoryViewDetail',

    // hreContractManage
    HreAllContractManage: 'HreAllContractManage',
    HreHireContractManage: 'HreHireContractManage',
    HreStopContractManage: 'HreStopContractManage',
    HreWaitContractManage: 'HreWaitContractManage',
    HreContractManageViewDetail: 'HreContractManageViewDetail',
    HreContractManageViewDetailContractExtend: 'HreContractManageViewDetailContractExtend',

    // hreInforContact
    HreHireInforContact: 'HreHireInforContact',
    HreAllInforContact: 'HreAllInforContact',
    HreStopInforContact: 'HreStopInforContact',
    HreWaitInforContact: 'HreWaitInforContact',
    HreInforContactViewDetail: 'HreInforContactViewDetail',

    //hreTerminationOfWork
    HreSubmitTerminationOfWork: 'HreSubmitTerminationOfWork',
    HreSubmitTerminationOfWorkViewDetail: 'HreSubmitTerminationOfWorkViewDetail',
    HreRejectTerminationOfWork: 'HreRejectTerminationOfWork',
    HreCanceledTerminationOfWork: 'HreCanceledTerminationOfWork',
    HreApproveTerminationOfWork: 'HreApproveTerminationOfWork',
    HreApprovedTerminationOfWork: 'HreApprovedTerminationOfWork',
    HreAllTerminationOfWork: 'HreAllTerminationOfWork',
    HreApproveTerminationOfWorkViewDetail: 'HreApproveTerminationOfWorkViewDetail',
    HreSubmitTerminationOfWorkAddOrEdit: 'HreSubmitTerminationOfWorkAddOrEdit',

    // hrePersonalInfoProfileIdentification
    HreAllPersonalInfoProfileIdentification: 'HreAllPersonalInfoProfileIdentification',
    HreHirePersonalInfoProfileIdentification: 'HreHirePersonalInfoProfileIdentification',
    HreStopPersonalInfoProfileIdentification: 'HreStopPersonalInfoProfileIdentification',
    HreWaitPersonalInfoProfileIdentification: 'HreWaitPersonalInfoProfileIdentification',
    HrePersonalInfoProfileIdentificationViewDetail: 'HrePersonalInfoProfileIdentificationViewDetail',
    HrePersonalInfoProfileIdentificationViewDetailWorkPermit:
        'HrePersonalInfoProfileIdentificationViewDetailWorkPermit',
    HrePersonalInfoProfileIdentificationViewDetailResident: 'HrePersonalInfoProfileIdentificationViewDetailResident',

    // hreEducationLevel
    HreAllEducationLevel: 'HreAllEducationLevel',
    HreHireEducationLevel: 'HreHireEducationLevel',
    HreStopEducationLevel: 'HreStopEducationLevel',
    HreWaitEducationLevel: 'HreWaitEducationLevel',
    HreEducationLevelViewDetail: 'HreEducationLevelViewDetail',
    HreEducationLevelViewDetailEducationLevel: 'HreEducationLevelViewDetailEducationLevel',
    HreEducationLevelViewDetailComputingLevel: 'HreEducationLevelViewDetailComputingLevel',

    // hrePartyAndUnionManage
    HreHirePartyAndUnion: 'HreHirePartyAndUnion',
    HreAllPartyAndUnion: 'HreAllPartyAndUnion',
    HreStopPartyAndUnion: 'HreStopPartyAndUnion',
    HreWaitPartyAndUnion: 'HreWaitPartyAndUnion',
    HrePartyAndUnionViewDetail: 'HrePartyAndUnionViewDetail',

    // hreMovementHistory
    HreAllMovementHistory: 'HreAllMovementHistory',
    HreHireMovementHistory: 'HreHireMovementHistory',
    HreStopMovementHistory: 'HreStopMovementHistory',
    HreWaitMovementHistory: 'HreWaitMovementHistory',
    HreMovementHistoryViewDetail: 'HreMovementHistoryViewDetail',

    // hreConcurrentManage
    HreAllConcurrentManage: 'HreAllConcurrentManage',
    HreHireConcurrentManage: 'HreHireConcurrentManage',
    HreStopConcurrentManage: 'HreStopConcurrentManage',
    HreWaitConcurrentManage: 'HreWaitConcurrentManage',
    HreConcurrentManageViewDetail: 'HreConcurrentManageViewDetail',
    HreConcurrentManageViewDetailAllowance: 'HreConcurrentManageViewDetailAllowance',

    // hreDisciplineManage
    HreAllDisciplineManage: 'HreAllDisciplineManage',
    HreHireDisciplineManage: 'HreHireDisciplineManage',
    HreStopDisciplineManage: 'HreStopDisciplineManage',
    HreWaitDisciplineManage: 'HreWaitDisciplineManage',
    HreDisciplineManageViewDetail: 'HreDisciplineManageViewDetail',
    HreDisciplineManageViewDetailDisciplineInformation: 'HreDisciplineManageViewDetailDisciplineInformation',

    // hreTaxPayManage
    HreAllTaxPayManage: 'HreAllTaxPayManage',
    HreHireTaxPayManage: 'HreHireTaxPayManage',
    HreStopTaxPayManage: 'HreStopTaxPayManage',
    HreWaitTaxPayManage: 'HreWaitTaxPayManage',
    HreTaxPayManageViewDetail: 'HreTaxPayManageViewDetail',
    HreTaxPayManageViewDetailTaxPay: 'HreTaxPayManageViewDetailTaxPay',

    // hreInsuranceManage
    HreAllInsuranceManage: 'HreAllInsuranceManage',
    HreHireInsuranceManage: 'HreHireInsuranceManage',
    HreStopInsuranceManage: 'HreStopInsuranceManage',
    HreWaitInsuranceManage: 'HreWaitInsuranceManage',
    HreInsuranceManageViewDetail: 'HreInsuranceManageViewDetail',
    HreInsuranceManageViewDetailHealthInsurance: 'HreInsuranceManageViewDetailHealthInsurance',
    HreInsuranceManageViewDetailSocialInsurance: 'HreInsuranceManageViewDetailSocialInsurance',
    HreInsuranceManageViewDetailUnemploymentInsurance: 'HreInsuranceManageViewDetailUnemploymentInsurance',

    // Chart org
    ChOrgProfileChart: 'ChOrgProfileChart',
    ChOrgDepartmentChart: 'ChOrgDepartmentChart',
    ChOrgPositionChart: 'ChOrgPositionChart',

    // hreEvalutionContract
    HreAllEvalutionContract: 'HreAllEvalutionContract',
    HreDoneEvalutionContract: 'HreDoneEvalutionContract',
    HreWaitEvalutionContract: 'HreWaitEvalutionContract',
    HreEvalutionContractViewDetail: 'HreEvalutionContractViewDetail',

    //hreEvaluationResult
    HreEvaluationResult: 'HreEvaluationResult',

    //HreProfileBadge
    HreProfileBadge: 'HreProfileBadge',

    // salPITFinalization V3
    SalSubmitPITFinalization: 'SalSubmitPITFinalization',
    SalSubmitPITFinalizationViewDetail: 'SalSubmitPITFinalizationViewDetail',
    SalWaitingConfirmSubmitPITFinalization: 'SalWaitingConfirmSubmitPITFinalization',
    SalSaveTempSubmitPITFinalization: 'SalSaveTempSubmitPITFinalization',
    SalRejectedSubmitPITFinalization: 'SalRejectedSubmitPITFinalization',
    SalConfirmedSubmitPITFinalization: 'SalConfirmedSubmitPITFinalization',
    SalCanceledSubmitPITFinalization: 'SalCanceledSubmitPITFinalization',
    SalSubmitPITFinalizationAddOrEdit: 'SalSubmitPITFinalizationAddOrEdit',

    //Region: ShiftChange V3
    AttSubmitShiftChange: 'AttSubmitShiftChange',
    AttSubmitShiftChangeAddOrEdit: 'AttSubmitShiftChangeAddOrEdit',
    AttSubmitShiftChangeViewDetail: 'AttSubmitShiftChangeViewDetail',
    AttSaveTempSubmitShiftChange: 'AttSaveTempSubmitShiftChange',
    AttCanceledSubmitShiftChange: 'AttCanceledSubmitShiftChange',
    AttApproveSubmitShiftChange: 'AttApproveSubmitShiftChange',
    AttApprovedSubmitShiftChange: 'AttApprovedSubmitShiftChange',
    AttRejectSubmitShiftChange: 'AttRejectSubmitShiftChange',
    AttAllSubmitShiftChange: 'AttAllSubmitShiftChange',

    AttAllTakeShiftChange: 'AttAllTakeShiftChange',
    AttApproveShiftChange: 'AttApproveShiftChange',
    AttApprovedShiftChange: 'AttApprovedShiftChange',
    AttCanceledShiftChange: 'AttCanceledShiftChange',
    AttRejectShiftChange: 'AttRejectShiftChange',
    AttApproveShiftChangeViewDetail: 'AttApproveShiftChangeViewDetail',

    //Region: attTakeDailyTask v3
    AttSubmitTakeDailyTask: 'AttSubmitTakeDailyTask',
    AttSubmitTakeDailyTaskViewDetail: 'AttSubmitTakeDailyTaskViewDetail',
    AttSubmitTakeDailyTaskAddOrEdit: 'AttSubmitTakeDailyTaskAddOrEdit',
    AttApproveSubmitTakeDailyTask: 'AttApproveSubmitTakeDailyTask',
    AttApprovedSubmitTakeDailyTask: 'AttApprovedSubmitTakeDailyTask',
    AttSaveTempSubmitTakeDailyTask: 'AttSaveTempSubmitTakeDailyTask',
    AttRejectSubmitTakeDailyTask: 'AttRejectSubmitTakeDailyTask',
    AttCanceledSubmitTakeDailyTask: 'AttCanceledSubmitTakeDailyTask',

    AttApproveTakeDailyTask: 'AttApproveTakeDailyTask',
    AttApproveTakeDailyTaskViewDetail: 'AttApproveTakeDailyTaskViewDetail',

    AttApprovedTakeDailyTask: 'AttApprovedTakeDailyTask',
    AttApprovedTakeDailyTaskViewDetail: 'AttApprovedTakeDailyTaskViewDetail',

    AttRejectTakeDailyTask: 'AttRejectTakeDailyTask',
    AttCanceledTakeDailyTask: 'AttCanceledTakeDailyTask',
    AttAllTakeDailyTask: 'AttAllTakeDailyTask',
    // module HRE V3: hreRecruitment
    HreProcessingCandidateApplicationsViewDetail: 'HreProcessingCandidateApplicationsViewDetail',
    HrePendingProcessingCandidateApplications: 'HrePendingProcessingCandidateApplications',
    HreProcesedProcessingCandidateApplications: 'HreProcesedProcessingCandidateApplications',

    HreCandidateProfileViewDetail: 'HreCandidateProfileViewDetail',
    HreCandidateProfile: 'HreCandidateProfile',

    HreRecruitmentReportViewDetail: 'HreRecruitmentReportViewDetail',
    HrePendingRecruitmentReport: 'HrePendingRecruitmentReport',
    HreProcesedRecruitmentReport: 'HreProcesedProcessingCandidateApplications',

    //module HRE V3: hreInterview
    HreInterviewCalendar: 'HreInterviewCalendar',
    HreWaitingInterview: 'HreWaitingInterview',
    HreCompletedInterview: 'HreCompletedInterview',
    HreCandidateHistoryApply: 'HreCandidateHistoryApply',
    HreCandidateInformation: 'HreCandidateInformation',
    HreCandidateInterview: 'HreCandidateInterview',
    HreRecruitmentProposal: 'HreRecruitmentProposal',
    TopTabHreCandidateDetail: 'TopTabHreCandidateDetail',
    HreResultInterviewViewDetail: 'HreResultInterviewViewDetail',


    //module HRE V3: hreRecruitmentProposalProcessing
    HreRecruitmentProposalProcessing: 'HreRecruitmentProposalProcessing',
    HreWaitRecruitmentProposalProcessing: 'HreWaitRecruitmentProposalProcessing',
    HreDoneRecruitmentProposalProcessing: 'HreDoneRecruitmentProposalProcessing',
    HreRecruitmentProposalProcessingViewDetail: 'HreRecruitmentProposalProcessingViewDetail',

    //module HRE V3: HreProcessingPostingPlan
    HreProcessingPostingPlan: 'HreProcessingPostingPlan',
    HreWaitProcessingPostingPlan: 'HreWaitProcessingPostingPlan',
    HreDoneProcessingPostingPlan: 'HreDoneProcessingPostingPlan',
    HreProcessingPostingPlanViewDetail: 'HreProcessingPostingPlanViewDetail',

    //module HRE V3: HreProcessingJobPosting
    HreProcessingJobPosting: 'HreProcessingJobPosting',
    HreWaitProcessingJobPosting: 'HreWaitProcessingJobPosting',
    HreDoneProcessingJobPosting: 'HreDoneProcessingJobPosting',
    HreProcessingJobPostingViewDetail: 'HreProcessingJobPostingViewDetail',
    HrePostChanelViewDetail: 'HrePostChanelViewDetail',
    HrePostPreviewViewDetail: 'HrePostPreviewViewDetail',

    // module HRE V3: hreRecruitment/hreApproveRecruitmentProposal
    HrePendingApproveRecruitmentProposal: 'HrePendingApproveRecruitmentProposal',
    HreProcesedApproveRecruitmentProposal: 'HreProcesedApproveRecruitmentProposal',
    HreApproveRecruitmentProposalViewDetail: 'HreApproveRecruitmentProposalViewDetail',

    //module ATT V3: attLeaveDayReplacement
    AttLeaveDayReplacement: 'AttLeaveDayReplacement',
    AttConfirmedLeaveDayReplacement: 'AttConfirmedLeaveDayReplacement',
    AttWaitConfirmLeaveDayReplacement: 'AttWaitConfirmLeaveDayReplacement',
    AttLeaveDayReplacementViewDetail: 'AttLeaveDayReplacementViewDetail',

    //module ATT V3: attConfirmeShiftChange
    AttConfirmedShiftChange: 'AttConfirmedShiftChange',
    AttConfirmShiftChange: 'AttConfirmShiftChange',
    AttWaitConfirmShiftChange: 'AttWaitConfirmShiftChange',
    AttRejectedShiftChange: 'AttRejectedShiftChange',
    AttConfirmShiftChangeViewDetail: 'AttConfirmShiftChangeViewDetail',

    // module HRE V3: hreRecruitment/hreReceiveJob
    HreWaitingReceiveJob: 'HreWaitingReceiveJob',
    HreRefuseReceiveJob: 'HreRefuseReceiveJob',
    HreReceiveJobViewDetail: 'HreReceiveJobViewDetail',

    // module HRE V3: hreJobPosting
    HreInProcessJobPosting: 'HreInProcessJobPosting',
    HreOutDateJobPosting: 'HreOutDateJobPosting',
    HreStopJobPosting: 'HreStopJobPosting',
    HreJobPostingViewDetail: 'HreJobPostingViewDetail',

    // uỷ quyền duyệt
    AttSubmitDelegationApproval: 'AttSubmitDelegationApproval',
    AttWaitConfirmSubmitDelegationApproval: 'AttWaitConfirmSubmitDelegationApproval',
    AttConfirmedSubmitDelegationApproval: 'AttConfirmedSubmitDelegationApproval',
    AttCanceledSubmitDelegationApproval: 'AttCanceledSubmitDelegationApproval',
    AttRejectSubmitDelegationApproval: 'AttRejectSubmitDelegationApproval',
    AttRejectDelegationApproval: 'AttRejectDelegationApproval',
    AttWaitConfirmDelegationApproval: 'AttWaitConfirmDelegationApproval',
    AttConfirmedDelegationApproval: 'AttConfirmedDelegationApproval',
    AttCanceledDelegationApproval: 'AttCanceledDelegationApproval',
    AttSubmitDelegationApprovalAddOrEdit: 'AttSubmitDelegationApprovalAddOrEdit',
    AttSubmitDelegationApprovalViewDetail: 'AttSubmitDelegationApprovalViewDetail',
    AttConfirmDelegationApprovalViewDetail: 'AttConfirmDelegationApprovalViewDetail',
    AttConfirmDelegationApproval: 'AttConfirmDelegationApproval',

    SalFeeCheck: 'SalFeeCheck',
    SalFeeCheckAddOrEdit: 'SalFeeCheckAddOrEdit',
    SalFeeCheckViewDetail: 'SalFeeCheckViewDetail',

    SalWaitApprovePaymentCostRegister: 'SalWaitApprovePaymentCostRegister',
    SalApprovedPaymentCostRegister: 'SalApprovedPaymentCostRegister',
    SalApprovePaymentCostRegister: 'SalApprovePaymentCostRegister',
    SalApprovePaymentCostRegisterViewDetail: 'SalApprovePaymentCostRegisterViewDetail',

    RecruitmentReport: 'RecruitmentReport'
};

export const EnumName = {
    E_ENTER_INTERVIEW: 'E_ENTER_INTERVIEW',
    E_GRANT_PERMISSION: 'E_GRANT_PERMISSION',
    E_SYSTEM: 'system',
    E_ANALYSICS: 'E_ANALYSICS',
    E_EMPTYDATA: 'EmptyData',
    E_REQUEST_NO_RESPONSE: 'E_REQUEST_NO_RESPONSE',
    E_NOINTERNET: 'E_NOINTERNET',
    E_New_Att_LeaveDay_Register_Help: 'New_Att_LeaveDay_Register_Help',
    E_Att_Overtime_Register_Help: 'Att_Overtime_Register_Help',
    E_SENDTHANKS: 'E_SENDTHANKS',
    E_SENDMAIL: 'E_SENDMAIL',
    E_DELETE: 'E_DELETE',
    E_CANCEL: 'E_CANCEL',
    E_MODIFY: 'E_MODIFY',
    E_SUBMIT_TEMP: 'E_SUBMIT_TEMP',
    E_MODIFY_SERIES: 'E_MODIFY_SERIES',
    DefaultParams: 'DefaultParams',
    E_ResourceName: 'Resource',
    E_Name: 'Name',
    E_Rule: 'Rule',
    E_Permission: 'Permission',
    E_Value: 'Value',
    E_value: 'value',
    E_object: 'object',
    E_string: 'string',
    E_func: 'function',
    E_Confirm: 'Confirm',
    E_Success: 'Success',
    E_success: 'success',
    E_SUCCESS: 'SUCCESS',
    E_Locked: 'Locked',
    E_Row: 'Row',
    E_Order: 'Order',
    E_BusinessAction: 'BusinessAction',
    E_search: 'search',
    E_fieldName: 'fieldName',
    E_POST: 'E_POST',
    E_PUT: 'E_PUT',
    E_GET: 'E_GET',
    E_column: 'column',
    E_row: 'row',
    E_Field_Group: 'GroupField',
    // nhan.nguyen V3
    E_Filter: 'Filter',
    E_CONFIRM: 'E_CONFIRM',
    E_APPROVE: 'E_APPROVE',
    E_REJECT: 'E_REJECT',
    E_REJECTED: 'E_REJECTED',
    E_isInputText: 'isInputText',
    E_isCheckBox: 'E_isCheckBox',
    E_isValidInputText: 'isValidInputText',
    E_false: 'false',
    E_true: 'true',
    E_boolean: 'boolean',
    E_View: 'View',
    E_ProfileID: 'ProfileID',
    E_FullName: 'FullName',
    E_FULLSHIFT: 'E_FULLSHIFT',
    E_BYHOURS: 'E_BYHOURS',
    E_FILTER: 'E_FILTER',
    E_COUNTRY: 'E_COUNTRY',
    E_PROVINCE: 'E_PROVINCE',
    E_DISTRICT: 'E_DISTRICT',
    E_VILLAGE: 'E_VILLAGE',
    E_NEXT: 'E_NEXT',
    E_CHECK: 'E_CHECK',
    E_IN: 'E_IN',
    E_OUT: 'E_OUT',
    E_INOUT: 'E_INOUT',
    E_UPDATESTATUS: 'E_UPDATESTATUS',
    E_DONE: 'E_DONE',
    E_PROGRESS: 'E_PROGRESS',
    E_ERROR: 'E_ERROR',
    E_EDIT: 'E_EDIT',
    E_EVALUATION: 'E_EVALUATION',
    E_ALL: 'E_ALL',
    E_OVERTIME: 'E_OVERTIME',
    E_LEAVE_DAY: 'E_LEAVE_DAY',
    E_MISS_INOUT: 'E_MISS_INOUT',
    E_TAMSCANLOGREGISTER: 'E_TAMSCANLOGREGISTER',
    E_ROSTER: 'E_ROSTER',
    E_BUSSINESSTRAVEL: 'E_BUSSINESSTRAVEL',
    E_AVAILABLE: 'E_AVAILABLE',
    E_UNAVAILABLE: 'E_UNAVAILABLE',
    E_PRIMARY_DATA: 'E_PRIMARY_DATA',
    E_PULL_TO_REFRESH: 'E_PULLTO_REFRESH',
    E_PAGING: 'E_PAGING',
    E_DATE: 'E_DATE',
    E_BUSINESSTRIPVIEWCOST: 'E_BUSINESSTRIPVIEWCOST',
    E_BUSINESSTRIPADDCOST: 'E_BUSINESSTRIPADDCOST',
    E_EARLYALLOWED: 'E_EARLYALLOWED',
    E_LATEEARLY_ALLOWED: 'E_LATEEARLY_ALLOWED',
    E_LIMIT_OT: 'E_LIMIT_OT',
    E_SAVE_CLOSE: 'E_SAVE_CLOSE',
    E_SAVE_NEW: 'E_SAVE_NEW',
    E_SAVE_SENMAIL: 'E_SAVE_SENMAIL',
    E_CHANGE_SHIFT: 'E_CHANGE_SHIFT',
    E_REQUESTCANCEL: 'E_REQUESTCANCEL',
    E_BLOCK: 'E_BLOCK',
    E_COMMENT: 'E_COMMENT',
    E_ANNUAL_LEAVE: 'E_ANNUAL_LEAVE',
    E_COMPENSATORY_LEAVE: 'E_COMPENSATORY_LEAVE',
    E_SICK_LEAVE: 'E_SICK_LEAVE',
    E_ADDITIONAL_LEAVE: 'E_ADDITIONAL_LEAVE',
    E_COMPENSATORY_LEAVE_DETAIL: 'E_COMPENSATORY_LEAVE_DETAIL',
    E_SENIORBONUS_LEAVE_DETAIL: 'E_SENIORBONUS_LEAVE_DETAIL',
    E_FAIL: 'FAIL',
    E_MIDDLEOFSHIFT: 'E_MIDDLEOFSHIFT',
    E_ATTACH_FILE: 'E_ATTACH_FILE',
    E_REQUEST_CANCEL: 'E_REQUEST_CANCEL',
    E_REQUEST_CHANGE: 'E_REQUEST_CHANGE',
    E_SHOW: 'E_SHOW',
    E_HIDE: 'E_HIDE',
    E_READONLY: 'E_READONLY',
    E_process: 'process',
    E_error: 'error',
    E_REFRESH: 'E_REFRESH',
    E_SAVE_TEMP: 'E_SAVE_TEMP',
    E_REGISTER: 'E_REGISTER',
    E_ALLOWNOTE_STOPWORKING: 'E_ALLOWNOTE_STOPWORKING',
    E_CHANGE_SHIFT_COMPANSATION: 'E_CHANGE_SHIFT_COMPANSATION',
    E_DIFFERENTDAY: 'E_DIFFERENTDAY',
    E_SAMEDAY: 'E_SAMEDAY',
    E_CLUSTER: 'E_CLUSTER',
    E_EXPIRE: 'E_EXPIRE',
    E_REPOST: 'E_REPOST',
    E_POSTPONE: 'E_POSTPONE',
    E_STOP_POSTING: 'E_STOP_POSTING',
    E_warning: 'warning',
    E_wait: 'wait',
    E_submitChange: 'submitChange'
};

export const EnumStatus = {
    E_CONFIRM: 'E_CONFIRM',
    E_CONFIRMED: 'E_CONFIRMED',
    E_CANCEL: 'E_CANCEL',
    E_APPROVE: 'E_APPROVE',
    E_APPROVED: 'E_APPROVED',
    E_APPROVED1: 'E_APPROVED1',
    E_APPROVED2: 'E_APPROVED2',
    E_APPROVED3: 'E_APPROVED3',
    E_WAITING: 'E_WAITING',
    E_WAIT_APPROVED: 'E_WAIT_APPROVED',
    E_FIRST_APPROVED: 'E_FIRST_APPROVED',
    E_REJECT: 'E_REJECT',
    E_REJECTED: 'E_REJECTED',
    E_SENDMAIL: 'E_SENDMAIL',
    E_DELETE: 'E_DELETE',
    E_MODIFY: 'E_MODIFY',
    E_SUBMIT_TEMP: 'E_SUBMIT_TEMP',
    E_SUBMIT: 'E_SUBMIT',
    E_REQUEST_CANCEL: 'E_REQUEST_CANCEL',
    E_REQUEST_CHANGE: 'E_REQUEST_CHANGE',
    E_EXPIRE: 'E_EXPIRE',
    E_REPOST: 'E_REPOST',
    E_STOP_POSTING: 'E_STOP_POSTING',
    E_POSTPONE: 'E_POSTPONE'
};

export const ControlName = {
    VnrText: 'VnrText',
    VnrDate: 'VnrDate',
    VnrTime: 'VnrTime',
    VnrPicker: 'VnrPicker',
    VnrSwitch: 'VnrSwitch',
    VnrPickerMulti: 'VnrPickerMulti',
    VnrTreeView: 'VnrTreeView',
    VnrCheckBox: 'VnrCheckBox',
    VnrMonthYear: 'VnrMonthYear',
    VnrYearPicker: 'VnrYearPicker',
    VnrDateFromTo: 'VnrDateFromTo',
    VnrSuperFilterWithTextInput: 'VnrSuperFilterWithTextInput'
};

export const Format = {
    Date_DDMMYYYY: 'DD/MM/YYYY',
    VnrDate: 'VnrDate',
    VnrTime: 'VnrTime',
    VnrPicker: 'VnrPicker',
    VnrPickerMulti: 'VnrPickerMulti',
    VnrTreeView: 'VnrTreeView'
};

export const EnumIcon = {
    E_CONFIRM: 'E_CONFIRM',
    E_SENDMAIL: 'E_SENDMAIL', // Đặc biệt
    E_APPROVE: 'E_APPROVE',
    E_REJECT: 'E_REJECT',
    E_CANCEL: 'E_CANCEL',
    E_REQUEST_CANCEL: 'E_REQUEST_CANCEL',
    E_DELETE: 'E_DELETE',
    E_MODIFY: 'E_MODIFY',
    E_KEY: 'E_KEY', // Đặc biệt
    E_INFO: 'E_INFO', // trạng thái không rỏ ràng
    E_DEFAULT: 'E_DEFAULT', //
    E_WARNING: 'E_WARNING',
    E_AGREE: 'E_AGREE', //đồng ý
    E_FORWARD: 'E_FORWARD', // ( chuyển ) TH ĐẶC BIỆT
    E_REQUEST_CHANGE: 'E_REQUEST_CHANGE' // yêu cầu thay đổi
};

export const EnumTask = {
    KT_Workday: 'KT_Workday',
    KT_AttWorkDayCalendar: 'KT_AttWorkDayCalendar',
    KT_AttendanceDetail: 'KT_AttendanceDetail',
    KT_AttendanceCalendarDetail: 'KT_AttendanceCalendarDetail',
    KT_AttendanceCalenderDetailHistory: 'KT_AttendanceCalenderDetailHistory',
    KT_AttCheckInGPS: 'KT_AttCheckInGPS',
    KT_AttCheckInGPS_AVN: 'KT_AttCheckInGPS_AVN',
    KT_AttTSLCheckInOutWifi: 'KT_AttTSLCheckInOutWifi',
    KT_AttTSLCheckInOutNFC: 'KT_AttTSLCheckInOutNFC',
    TAMScanLogOrderTimeLogDesc: 'TAMScanLogOrderTimeLogDesc',
    KT_Permission_RequestDataConfig: 'Permission_RequestDataConfig',
    KT_AttSubmitTSLRegister: 'KT_AttSubmitTSLRegister',
    KT_AttApproveTSLRegister: 'KT_AttApproveTSLRegister',
    KT_AttApprovedTSLRegister: 'KT_AttApprovedTSLRegister',

    KT_AttSubmitRoster: 'KT_AttSubmitRoster',
    KT_AttApproveRoster: 'KT_AttApproveRoster',
    KT_AttApprovedRoster: 'KT_AttApprovedRoster',

    KT_AttSubmitRosterGroupByEmp: 'KT_AttSubmitRosterGroupByEmp',
    KT_AttApproveRosterGroupByEmp: 'KT_AttApproveRosterGroupByEmp',
    KT_AttApprovedRosterGroupByEmp: 'KT_AttApprovedRosterGroupByEmp',

    KT_AttSubmitShiftSubstitution: 'KT_AttSubmitShiftSubstitution',
    KT_AttApproveShiftSubstitution: 'KT_AttApproveShiftSubstitution',
    KT_AttApprovedShiftSubstitution: 'KT_AttApprovedShiftSubstitution',
    KT_AttWaitConfirmShiftSubstitution: 'KT_AttWaitConfirmShiftSubstitution',
    KT_AttWaitConfirmedShiftSubstitution: 'KT_AttWaitConfirmedShiftSubstitution',

    KT_AttSubmitLeaveDay: 'KT_AttSubmitLeaveDay',
    KT_AttApproveLeaveDay: 'KT_AttApproveLeaveDay',
    KT_AttApprovedLeaveDay: 'KT_AttApprovedLeaveDay',
    KT_AttSubmitLeaveDayCancel: 'KT_AttSubmitLeaveDayCancel',
    KT_AttApproveLeaveDayCancel: 'KT_AttApproveLeaveDayCancel',
    KT_AttApprovedLeaveDayCancel: 'KT_AttApprovedLeaveDayCancel',

    KT_AttSubmitOvertime: 'KT_AttSubmitOvertime',
    KT_AttApproveOvertime: 'KT_AttApproveOvertime',
    KT_AttApprovedOvertime: 'KT_AttApprovedOvertime',

    KT_AttSubmitLateEarlyAllowed: 'KT_AttSubmitLateEarlyAllowed',
    KT_AttApproveLateEarlyAllowed: 'KT_AttApproveLateEarlyAllowed',
    KT_AttApprovedLateEarlyAllowed: 'KT_AttApprovedLateEarlyAllowed',

    KT_AttSubmitPlanOvertime: 'KT_AttSubmitPlanOvertime',
    KT_AttApprovePlanOvertime: 'KT_AttApprovePlanOvertime',
    KT_AttApprovedPlanOvertime: 'KT_AttApprovedPlanOvertime',

    KT_AttSubmitPlanOvertimeCancel: 'KT_AttSubmitPlanOvertimeCancel',
    KT_AttApprovePlanOvertimeCancel: 'KT_AttApprovePlanOvertimeCancel',
    KT_AttApprovedPlanOvertimeCancel: 'KT_AttApprovedPlanOvertimeCancel',

    // add new by nhan
    KT_AttSubmitRegisterVehicle: 'KT_AttSubmitRegisterVehicle',
    KT_AttApproveRegisterVehicle: 'KT_AttApproveRegisterVehicle',
    KT_AttApprovedRegisterVehicle: 'KT_AttApprovedRegisterVehicle',
    KT_AttSubmitRegisterVehicleCancel: 'KT_AttSubmitRegisterVehicleCancel',
    KT_AttApproveRegisterVehicleCancel: 'KT_AttApproveRegisterVehicleCancel',
    KT_AttApprovedRegisterVehicleCancel: 'KT_AttApprovedRegisterVehicleCancel',

    // TAX
    KT_TaxSubmitTaxInformationRegister: 'KT_TaxSubmitTaxInformationRegister',
    KT_AttApproveTaxInformationRegister: 'KT_AttApproveTaxInformationRegister',
    KT_AttApprovedTaxInformationRegister: 'KT_AttApprovedTaxInformationRegister',

    // relative
    KT_RelativeConfirmed: 'KT_RelativeConfirmed',
    KT_RelativeWaitConfirm: 'KT_RelativeWaitConfirm',

    // dependant
    KT_DependantConfirmed: 'KT_DependantConfirmed',
    KT_DependantWaitConfirm: 'KT_DependantWaitConfirm',

    // passport
    KT_PassportConfirmed: 'KT_PassportConfirmed',
    KT_PassportWaitConfirm: 'KT_PassportWaitConfirm',

    // Qualification
    KT_QualificationConfirmed: 'KT_QualificationConfirmed',
    KT_QualificationWaitConfirm: 'KT_QualificationWaitConfirm',

    // end add new by nhan

    // salSubmitPITFinalization
    KT_SalApprovePITFinalization: 'KT_SalApprovePITFinalization',
    KT_SalApprovedPITFinalization: 'KT_SalApprovedPITFinalization',

    KT_AttSubmitBusinessTravel: 'KT_AttSubmitBusinessTravel',
    KT_AttApproveBusinessTravel: 'KT_AttApproveBusinessTravel',
    KT_AttApprovedBusinessTravel: 'KT_AttApprovedBusinessTravel',

    KT_AttSubmitBusinessTravelCancel: 'KT_AttSubmitBusinessTravelCancel',
    KT_AttApproveBusinessTravelCancel: 'KT_AttApproveBusinessTravelCancel',
    KT_AttApprovedBusinessTravelCancel: 'KT_AttApprovedBusinessTravelCancel',

    KT_AttSubmitBusinessTrip: 'KT_AttSubmitBusinessTrip',
    KT_AttApproveBusinessTrip: 'KT_AttApproveBusinessTrip',
    KT_AttApprovedBusinessTrip: 'KT_AttApprovedBusinessTrip',
    KT_AttSubmitBusinessTravelTransfer: 'KT_AttSubmitBusinessTravelTransfer',
    KT_AttApproveBusinessTravelTransfer: 'KT_AttApproveBusinessTravelTransfer',
    KT_AttApprovedBusinessTravelTransfer: 'KT_AttApprovedBusinessTravelTransfer',
    KT_AttSubmitPregnancy: 'KT_AttSubmitPregnancy',
    KT_AttApprovePregnancy: 'KT_AttApprovePregnancy',
    KT_AttApprovedPregnancy: 'KT_AttApprovedPregnancy',

    KT_EvaSubmitManager: 'KT_EvaSubmitManager',
    KT_EvaEmployee: 'KT_EvaEmployee',
    KT_EvaCapacityDetailWatting: 'KT_EvaCapacityDetailWatting',
    KT_EvaCapacityDetailConfirmed: 'KT_EvaCapacityDetailConfirmed',

    KT_AttPaidLeave: 'KT_AttPaidLeave',
    KT_AttConfirmLeaveDay: 'KT_AttConfirmLeaveDay',
    KT_Notification_Setting: 'KT_Notification_Setting',
    KT_NtfOverview: 'KT_NtfOverview',
    KT_NtfManage: 'KT_NtfManage',
    KT_NtfPersonal: 'KT_NtfPersonal',
    KT_GeneralInfomation: 'KT_GeneralInfomation',
    KT_WorkPosition: 'KT_WorkPosition',
    KT_WorkHistory: 'KT_WorkHistory',
    KT_RequirementRecruitment: 'KT_RequirementRecruitment',
    KT_Reward: 'KT_Reward',
    KT_Discipline: 'KT_Discipline',

    KT_SalSubmitUnusualAllowanceKeyTask: 'KT_SalSubmitUnusualAllowanceKeyTask',
    KT_SalSubmitPaymentCostRegisterKeyTask: 'KT_SalSubmitPaymentCostRegisterKeyTask',
    KT_Salary: 'KT_Salary',

    KT_HreApproveEvaluationDoc: 'KT_HreApproveEvaluationDoc',
    KT_HreApprovedEvaluationDoc: 'KT_HreApprovedEvaluationDoc',
    KT_HreApproveViolation: 'KT_HreApproveViolation',
    KT_HreApprovedViolation: 'KT_HreApprovedViolation',

    KT_HreSurveyEmployee: 'KT_HreSurveyEmployee',
    KT_HreSurveyHistory: 'KT_HreSurveyHistory',
    KT_AppendixInfomation: 'KT_AppendixInfomation',

    KT_HreSubmitWorkHistorySalary: 'KT_HreSubmitWorkHistorySalary',
    KT_HreApproveWorkHistorySalary: 'KT_HreApproveWorkHistorySalary',
    KT_HreApprovedWorkHistorySalary: 'KT_HreApprovedWorkHistorySalary',
    KT_HreEventCalendar: 'KT_HreEventCalendar',


    KT_HreSubmitRequirementRecruitment: 'KT_HreSubmitRequirementRecruitment',
    KT_HreApproveRequirementRecruitment: 'KT_HreApproveRequirementRecruitment',
    KT_HreApprovedRequirementRecruitment: 'KT_HreApprovedRequirementRecruitment',

    KT_HreSubmitProfileCard: 'KT_HreSubmitProfileCard',
    KT_HreApproveProfileCard: 'KT_HreApproveProfileCard',
    KT_HreApprovedProfileCard: 'KT_HreApprovedProfileCard',

    KT_InsInsuranceRecordWaiting: 'KT_InsInsuranceRecordWaiting',
    KT_InsInsuranceRecord: 'KT_InsInsuranceRecord',
    KT_InsSubmitChangeInsInfoRegister: 'KT_InsSubmitChangeInsInfoRegister',
    KT_NewsSlider: 'KT_NewsSlider',
    KT_SalRewardPayslip: 'KT_SalRewardPayslip',
    KT_SalSubmitPITAmount: 'KT_SalSubmitPITAmount',
    KT_MedImmunization: 'KT_MedImmunization',
    KT_MedAnnualHealth: 'KT_MedAnnualHealth',
    KT_MedHistoryMedical: 'KT_MedHistoryMedical',
    // V3 TamScanLog
    KT_AttSubmitTamScanLogRegister: 'KT_AttSubmitTamScanLogRegister',
    KT_AttSaveTempSubmitTamScanLogRegister: 'KT_AttSaveTempSubmitTamScanLogRegister',
    KT_AttRejectSubmitTamScanLogRegister: 'KT_AttRejectSubmitTamScanLogRegister',
    KT_AttCanceledSubmitTamScanLogRegister: 'KT_AttCanceledSubmitTamScanLogRegister',
    KT_AttApproveSubmitTamScanLogRegister: 'KT_AttApproveSubmitTamScanLogRegister',
    KT_AttApprovedSubmitTamScanLogRegister: 'KT_AttApprovedSubmitTamScanLogRegister',
    KT_AttRejectTamScanLogRegister: 'KT_AttRejectTamScanLogRegister',
    KT_AttCanceledTamScanLogRegister: 'KT_AttCanceledTamScanLogRegister',
    KT_AttAllTamScanLogRegister: 'KT_AttAllTamScanLogRegister',
    KT_AttApproveTamScanLogRegister: 'KT_AttApproveTamScanLogRegister',
    KT_AttApprovedTamScanLogRegister: 'KT_AttApprovedTamScanLogRegister',

    KT_AttSubmitTakeLeaveDay: 'KT_AttSubmitTakeLeaveDay',
    KT_AttApproveTakeLeaveDay: 'KT_AttApproveTakeLeaveDay',
    KT_AttApprovedTakeLeaveDay: 'KT_AttApprovedTakeLeaveDay',
    KT_AttRejectTakeLeaveDay: 'KT_AttRejectTakeLeaveDay',
    KT_AttCanceledTakeLeaveDay: 'KT_AttCanceledTakeLeaveDay',
    KT_AttAllTakeLeaveDay: 'KT_AttAllTakeLeaveDay',
    KT_AttSaveTempSubmitTakeLeaveDay: 'KT_AttSaveTempSubmitTakeLeaveDay',
    KT_AttCanceledSubmitTakeLeaveDay: 'KT_AttCanceledSubmitTakeLeaveDay',
    KT_AttApproveSubmitTakeLeaveDay: 'KT_AttApproveSubmitTakeLeaveDay',
    KT_AttApprovedSubmitTakeLeaveDay: 'KT_AttApprovedSubmitTakeLeaveDay',
    KT_AttRejectSubmitTakeLeaveDay: 'KT_AttRejectSubmitTakeLeaveDay',

    // V3 Business Trip
    KT_AttSubmitTakeBusinessTrip: 'KT_AttSubmitTakeBusinessTrip',
    KT_AttRejectSubmitTakeBusinessTrip: 'KT_AttRejectSubmitTakeBusinessTrip',
    KT_AttCanceledSubmitTakeBusinessTrip: 'KT_AttCanceledSubmitTakeBusinessTrip',
    KT_AttSaveTempSubmitTakeBusinessTrip: 'KT_AttSaveTempSubmitTakeBusinessTrip',
    KT_AttApproveSubmitTakeBusinessTrip: 'KT_AttApproveSubmitTakeBusinessTrip',
    KT_AttApprovedSubmitTakeBusinessTrip: 'KT_AttApprovedSubmitTakeBusinessTrip',
    KT_AttApproveTakeBusinessTrip: 'KT_AttApproveTakeBusinessTrip',
    KT_AttApprovedTakeBusinessTrip: 'KT_AttApprovedTakeBusinessTrip',
    KT_AttRejectTakeBusinessTrip: 'KT_AttRejectTakeBusinessTrip',
    KT_AttCanceledTakeBusinessTrip: 'KT_AttCanceledTakeBusinessTrip',
    KT_AttAllTakeBusinessTrip: 'KT_AttAllTakeBusinessTrip',

    // V3 BackWorkBeforeMaternity
    KT_AttSubmitBackWorkBeforeMaternity: 'KT_AttSubmitBackWorkBeforeMaternity',
    KT_AttRejectSubmitBackWorkBeforeMaternity: 'KT_AttRejectSubmitBackWorkBeforeMaternity',
    KT_AttCanceledSubmitBackWorkBeforeMaternity: 'KT_AttCanceledSubmitBackWorkBeforeMaternity',
    KT_AttSaveTempSubmitBackWorkBeforeMaternity: 'KT_AttSaveTempSubmitBackWorkBeforeMaternity',
    KT_AttApproveSubmitBackWorkBeforeMaternity: 'KT_AttApproveSubmitBackWorkBeforeMaternity',
    KT_AttApprovedSubmitBackWorkBeforeMaternity: 'KT_AttApprovedSubmitBackWorkBeforeMaternity',
    KT_AttApproveBackWorkBeforeMaternity: 'KT_AttApproveBackWorkBeforeMaternity',
    KT_AttApprovedBackWorkBeforeMaternity: 'KT_AttApprovedBackWorkBeforeMaternity',
    KT_AttRejectBackWorkBeforeMaternity: 'KT_AttRejectBackWorkBeforeMaternity',
    KT_AttCanceledBackWorkBeforeMaternity: 'KT_AttCanceledBackWorkBeforeMaternity',
    KT_AttAllBackWorkBeforeMaternity: 'KT_AttAllBackWorkBeforeMaternity',

    // V3 WorkingOvertime
    KT_AttSubmitWorkingOvertime: 'KT_AttSubmitWorkingOvertime',
    KT_AttApproveWorkingOvertime: 'KT_AttApproveWorkingOvertime',
    KT_AttApprovedWorkingOvertime: 'KT_AttApprovedWorkingOvertime',
    KT_AttSaveTempSubmitWorkingOvertime: 'KT_AttSaveTempSubmitWorkingOvertime',
    KT_AttCanceledSubmitWorkingOvertime: 'KT_AttCanceledSubmitWorkingOvertime',
    KT_AttApproveSubmitWorkingOvertime: 'KT_AttApproveSubmitWorkingOvertime',
    KT_AttApprovedSubmitWorkingOvertime: 'KT_AttApprovedSubmitWorkingOvertime',
    KT_AttConfirmedSubmitWorkingOvertime: 'KT_AttConfirmedSubmitWorkingOvertime',
    KT_AttRejectSubmitWorkingOvertime: 'KT_AttRejectSubmitWorkingOvertime',
    KT_AttAllSubmitWorkingOvertime: 'KT_AttAllSubmitWorkingOvertime',
    KT_AttSaveTempWorkingOvertime: 'KT_AttSaveTempWorkingOvertime',
    KT_AttCanceledWorkingOvertime: 'KT_AttCanceledWorkingOvertime',
    KT_AttRejectWorkingOvertime: 'KT_AttRejectWorkingOvertime',
    KT_AttAllWorkingOvertime: 'KT_AttAllWorkingOvertime',

    // V3 TakeLateEarlyAllowed
    KT_AttSubmitTakeLateEarlyAllowed: 'KT_AttSubmitTakeLateEarlyAllowed',
    KT_AttApproveTakeLateEarlyAllowed: 'KT_AttApproveTakeLateEarlyAllowed',
    KT_AttApprovedTakeLateEarlyAllowed: 'KT_AttApprovedTakeLateEarlyAllowed',
    KT_AttRejectSubmitTakeLateEarlyAllowed: 'KT_AttRejectSubmitTakeLateEarlyAllowed',
    KT_AttApprovedSubmitTakeLateEarlyAllowed: 'KT_AttApprovedSubmitTakeLateEarlyAllowed',
    KT_AttApproveSubmitTakeLateEarlyAllowed: 'KT_AttApproveSubmitTakeLateEarlyAllowed',
    KT_AttCanceledSubmitTakeLateEarlyAllowed: 'KT_AttCanceledSubmitTakeLateEarlyAllowed',
    KT_AttSaveTempSubmitTakeLateEarlyAllowed: 'AttSaveTempSubmitTakeLateEarlyAllowed',
    KT_AttCanceledTakeLateEarlyAllowed: 'KT_AttCanceledTakeLateEarlyAllowed',
    KT_AttRejectTakeLateEarlyAllowed: 'KT_AttRejectTakeLateEarlyAllowed',
    KT_AttAllTakeLateEarlyAllowed: 'KT_AttAllTakeLateEarlyAllowed',

    // Household - Hồ sơ cá Nhân - Hộ khẩu
    KT_HouseholdConfirmed: 'KT_HouseholdConfirmed',
    KT_HouseholdWaitConfirm: 'KT_HouseholdWaitConfirm',
    KT_HouseholdAddRelative: 'KT_HouseholdAddRelative',

    // WorkingExperienc - Hồ sơ cá Nhân - kinh nghiệm làm việc
    KT_WorkingExperienceConfirmed: 'KT_WorkingExperienceConfirmed',
    KT_WorkingExperienceWaitConfirm: 'KT_WorkingExperienceWaitConfirm',

    // Lịch sử Update thông tin Chung
    KT_TopTabHisProfileBasicInfo: 'KT_TopTabHisProfileBasicInfo',
    KT_TopTabHisProfilePersonalInfo: 'KT_TopTabHisProfilePersonalInfo',
    KT_TopTabHisProfileContactInfo: 'KT_TopTabHisProfileContactInfo',

    KT_BankAccountConfirmed: 'KT_BankAccountConfirmed',
    KT_BankAccountConfirm: 'KT_BankAccountConfirm',

    // khen ngợi
    KT_HistoryOfComComplimented: 'KT_HistoryOfComComplimented',
    KT_HistoryOfComComplimenting: 'KT_HistoryOfComComplimenting',
    KT_HistoryConversion: 'KT_HistoryConversion',
    KT_GiftComCompliment: 'KT_GiftComCompliment',
    KT_RankingPersonal: 'KT_RankingPersonal',
    KT_RankingPeopleGiving: 'KT_RankingPeopleGiving',
    KT_RankingDepartment: 'KT_RankingDepartment',
    KT_RankingCriteria: 'KT_RankingCriteria',

    // Computer Level
    KT_ComputerLevelConfirmed: 'KT_ComputerLevelConfirmed',
    KT_ComputerLevelWaitConfirm: 'KT_ComputerLevelWaitConfirm',

    // Work Permit
    KT_WorkPermit: 'KT_WorkPermit',

    // Residence Card
    KT_ResidenceCard: 'KT_ResidenceCard',

    // Contract History V3
    KT_ContractHistoryAll: 'KT_ContractHistoryAll',
    KT_ContractHistoryConfirmed: 'KT_ContractHistoryConfirmed',
    KT_ContractHistoryWaitConfirm: 'KT_ContractHistoryWaitConfirm',

    // Hre WorkHistory
    KT_HreWorkHistorySubmit: 'KT_HreWorkHistorySubmit',
    // HreWorkManage
    KT_HreAllWorkBoard: 'KT_HreAllWorkBoard',
    KT_HreDoneWorkBoard: 'KT_HreDoneWorkBoard',
    KT_HreWaitWorkBoard: 'KT_HreWaitWorkBoard',
    KT_HreAllWorkManage: 'KT_HreAllWorkManage',
    KT_HreDoneWorkManage: 'KT_HreDoneWorkManage',
    KT_HreWaitWorkManage: 'KT_HreWaitWorkManage',

    // hrePersonalInfoManage
    KT_HreAllPersonalInfoManage: 'KT_HreAllPersonalInfoManage',
    KT_HreHirePersonalInfoManage: 'KT_HreHirePersonalInfoManage',
    KT_HreStopPersonalInfoManage: 'KT_HreStopPersonalInfoManage',
    KT_HreWaitPersonalInfoManage: 'KT_HreWaitPersonalInfoManage',

    KT_HreAllDocumentManage: 'KT_HreAllDocumentManage',
    KT_HreHireDocumentManage: 'KT_HreHireDocumentManage',
    KT_HreStopDocumentManage: 'KT_HreStopDocumentManage',
    KT_HreWaitDocumentManage: 'KT_HreWaitDocumentManage',

    KT_HreAllRelativeManage: 'KT_HreAllRelativeManage',
    KT_HreHireRelativeManage: 'KT_HreHireRelativeManage',
    KT_HreStopRelativeManage: 'KT_HreStopRelativeManage',
    KT_HreWaitRelativeManage: 'KT_HreWaitRelativeManage',

    KT_HreAllCompensationManage: 'KT_HreAllCompensationManage',
    KT_HreHireCompensationManage: 'KT_HreHireCompensationManage',
    KT_HreStopCompensationManage: 'KT_HreStopCompensationManage',
    KT_HreWaitCompensationManage: 'KT_HreWaitCompensationManage',

    KT_HreAllAnnualManage: 'KT_HreAllAnnualManage',
    KT_HreHireAnnualManage: 'KT_HreHireAnnualManage',
    KT_HreStopAnnualManage: 'KT_HreStopAnnualManage',
    KT_HreWaitAnnualManage: 'KT_HreWaitAnnualManage',

    KT_HreAllAccidentManage: 'KT_HreAllAccidentManage',
    KT_HreHireAccidentManage: 'KT_HreHireAccidentManage',
    KT_HreStopAccidentManage: 'KT_HreStopAccidentManage',
    KT_HreWaitAccidentManage: 'KT_HreWaitAccidentManage',

    KT_HreAllRewardManage: 'KT_HreAllRewardManage',
    KT_HreHireRewardManage: 'KT_HreHireRewardManage',
    KT_HreStopRewardManage: 'KT_HreStopRewardManage',
    KT_HreWaitRewardManage: 'KT_HreWaitRewardManage',

    KT_HreAllCandidateHistory: 'KT_HreAllCandidateHistory',
    KT_HreHireCandidateHistory: 'KT_HreHireCandidateHistory',
    KT_HreStopCandidateHistory: 'KT_HreStopCandidateHistory',
    KT_HreWaitCandidateHistory: 'KT_HreWaitCandidateHistory',

    // hreContractManage
    KT_HreAllContractManage: 'KT_HreAllContractManage',
    KT_HreHireContractManage: 'KT_HreHireContractManage',
    KT_HreStopContractManage: 'KT_HreStopContractManage',
    KT_HreWaitContractManage: 'KT_HreWaitContractManage',

    // hreInforContact
    KT_HreAllInforContact: 'KT_HreAllInforContact',
    KT_HreHireInforContact: 'KT_HreHireInforContact',
    KT_HreStopInforContact: 'KT_HreStopInforContact',
    KT_HreWaitInforContact: 'KT_HreWaitInforContact',

    //hreTerminationOfWork
    KT_HreSubmitTerminationOfWork: 'KT_HreSubmitTerminationOfWork',
    KT_HreRejectTerminationOfWork: 'KT_HreRejectTerminationOfWork',
    KT_HreCanceledTerminationOfWork: 'KT_HreCanceledTerminationOfWork',
    KT_HreApproveTerminationOfWork: 'KT_HreApproveTerminationOfWork',
    KT_HreApprovedTerminationOfWork: 'KT_HreApprovedTerminationOfWork',
    KT_HreAllTerminationOfWork: 'KT_HreAllTerminationOfWork',

    // hrePersonalInfoProfileIdentification
    KT_HreAllPersonalInfoProfileIdentification: 'KT_HreAllPersonalInfoProfileIdentification',
    KT_HreHirePersonalInfoProfileIdentification: 'KT_HreHirePersonalInfoProfileIdentification',
    KT_HreStopPersonalInfoProfileIdentification: 'KT_HreStopPersonalInfoProfileIdentification',
    KT_HreWaitPersonalInfoProfileIdentification: 'KT_HreWaitPersonalInfoProfileIdentification',

    // hreEducationLevel
    KT_HreAllEducationLevel: 'KT_HreAllEducationLevel',
    KT_HreHireEducationLevel: 'KT_HreHireEducationLevel',
    KT_HreStopEducationLevel: 'KT_HreStopEducationLevel',
    KT_HreWaitEducationLevel: 'KT_HreWaitEducationLevel',

    // hrePartyAndUnionManage
    KT_HreHirePartyAndUnion: 'KT_HreHirePartyAndUnion',
    KT_HreAllPartyAndUnion: 'KT_HreAllPartyAndUnion',
    KT_HreStopPartyAndUnion: 'KT_HreStopPartyAndUnion',
    KT_HreWaitPartyAndUnion: 'KT_HreWaitPartyAndUnion',

    // hreMovementHistory
    KT_HreAllMovementHistory: 'KT_HreAllMovementHistory',
    KT_HreHireMovementHistory: 'KT_HreHireMovementHistory',
    KT_HreStopMovementHistory: 'KT_HreStopMovementHistory',
    KT_HreWaitMovementHistory: 'KT_HreWaitMovementHistory',

    // hreConcurrentManage
    KT_HreAllConcurrentManage: 'KT_HreAllConcurrentManage',
    KT_HreHireConcurrentManage: 'KT_HreHireConcurrentManage',
    KT_HreStopConcurrentManage: 'KT_HreStopConcurrentManage',
    KT_HreWaitConcurrentManage: 'KT_HreWaitConcurrentManage',

    // hreDisciplineManage
    KT_HreAllDisciplineManage: 'KT_HreAllDisciplineManage',
    KT_HreHireDisciplineManage: 'KT_HreHireDisciplineManage',
    KT_HreStopDisciplineManage: 'KT_HreStopDisciplineManage',
    KT_HreWaitDisciplineManage: 'KT_HreWaitDisciplineManage',

    // hreTaxPayManage
    KT_HreAllTaxPayManage: 'KT_HreAllTaxPayManage',
    KT_HreHireTaxPayManage: 'KT_HreHireTaxPayManage',
    KT_HreStopTaxPayManage: 'KT_HreStopTaxPayManage',
    KT_HreWaitTaxPayManage: 'KT_HreWaitTaxPayManage',

    // hreInsuranceManage
    KT_HreAllInsuranceManage: 'KT_HreAllInsuranceManage',
    KT_HreHireInsuranceManage: 'KT_HreHireInsuranceManage',
    KT_HreStopInsuranceManage: 'KT_HreStopInsuranceManage',
    KT_HreWaitInsuranceManage: 'KT_HreWaitInsuranceManage',

    // Chart org
    KT_ChOrgDepartmentChart: 'KT_ChOrgDepartmentChart',
    KT_ChOrgProfileChart: 'KT_ChOrgProfileChart',
    KT_ChOrgPositionChart: 'KT_ChOrgPositionChart',

    // hreEvalutionContract
    KT_HreAllEvalutionContract: 'KT_HreAllEvalutionContract',
    KT_HreDoneEvalutionContract: 'KT_HreDoneEvalutionContract',
    KT_HreWaitEvalutionContract: 'KT_HreWaitEvalutionContract',

    //hreEvaluationResult
    KT_HreEvaluationResult: 'KT_HreEvaluationResult',

    // salPITFinalization V3
    KT_SalSubmitPITFinalization: 'KT_SalSubmitPITFinalization',
    KT_SalWaitingConfirmSubmitPITFinalization: 'KT_SalWaitingConfirmSubmitPITFinalization',
    KT_SalSaveTempSubmitPITFinalization: 'KT_SalSaveTempSubmitPITFinalization',
    KT_SalRejectedSubmitPITFinalization: 'KT_SalRejectedSubmitPITFinalization',
    KT_SalConfirmedSubmitPITFinalization: 'KT_SalConfirmedSubmitPITFinalization',
    KT_SalCanceledSubmitPITFinalization: 'KT_SalCanceledSubmitPITFinalization',

    // V3 ShiftChange
    KT_AttSubmitShiftChange: 'KT_AttSubmitShiftChange',
    KT_AttSaveTempSubmitShiftChange: 'KT_AttSaveTempSubmitShiftChange',
    KT_AttCanceledSubmitShiftChange: 'KT_AttCanceledSubmitShiftChange',
    KT_AttApproveSubmitShiftChange: 'KT_AttApproveSubmitShiftChange',
    KT_AttApprovedSubmitShiftChange: 'KT_AttApprovedSubmitShiftChange',
    KT_AttRejectSubmitShiftChange: 'KT_AttRejectSubmitShiftChange',

    KT_AttAllTakeShiftChange: 'KT_AttAllTakeShiftChange',
    KT_AttApproveShiftChange: 'KT_AttApproveShiftChange',
    KT_AttApprovedShiftChange: 'KT_AttApprovedShiftChange',
    KT_AttCanceledShiftChange: 'KT_AttCanceledShiftChange',
    KT_AttRejectShiftChange: 'KT_AttRejectShiftChange',

    // V3 TakeDailyTask
    KT_AttSubmitTakeDailyTask: 'KT_AttSubmitTakeDailyTask',
    KT_AttRejectSubmitTakeDailyTask: 'KT_AttRejectSubmitTakeDailyTask',
    KT_AttCanceledSubmitTakeDailyTask: 'KT_AttCanceledSubmitTakeDailyTask',
    KT_AttSaveTempSubmitTakeDailyTask: 'KT_AttSaveTempSubmitTakeDailyTask',
    KT_AttApproveSubmitTakeDailyTask: 'KT_AttApproveSubmitTakeDailyTask',
    KT_AttApprovedSubmitTakeDailyTask: 'KT_AttApprovedSubmitTakeDailyTask',
    KT_AttApproveTakeDailyTask: 'KT_AttApproveTakeDailyTask',
    KT_AttApprovedTakeDailyTask: 'KT_AttApprovedTakeDailyTask',
    KT_AttRejectTakeDailyTask: 'KT_AttRejectTakeDailyTask',
    KT_AttCanceledTakeDailyTask: 'KT_AttCanceledTakeDailyTask',
    KT_AttAllTakeDailyTask: 'KT_AttAllTakeDailyTask',
    //module HRE V3: hreRecruitment
    KT_HrePendingProcessingCandidateApplications: 'KT_HrePendingProcessingCandidateApplications',
    KT_HreProcesedProcessingCandidateApplications: 'KT_HreProcesedProcessingCandidateApplications',

    KT_HreCandidateProfile: 'KT_HreCandidateProfile',

    KT_HrePendingRecruitmentReport: 'KT_HrePendingRecruitmentReport',
    KT_HreProcesedRecruitmentReport: 'KT_HreProcesedRecruitmentReport',

    KT_HreWaitRecruitmentProposalProcessing: 'KT_HreWaitRecruitmentProposalProcessing',
    KT_HreDoneRecruitmentProposalProcessing: 'KT_HreDoneRecruitmentProposalProcessing',

    KT_HreWaitProcessingPostingPlan: 'KT_HreWaitProcessingPostingPlan',
    KT_HreDoneProcessingPostingPlan: 'KT_HreDoneProcessingPostingPlan',

    KT_HreWaitProcessingJobPosting: 'KT_HreWaitProcessingJobPosting',
    KT_HreDoneProcessingJobPosting: 'KT_HreDoneProcessingJobPosting',

    KT_HreInterviewCalendar: 'KT_HreInterviewCalendar',
    KT_HreWaitingInterview: 'KT_HreWaitingInterview',
    KT_HreCompletedInterview: 'KT_HreCompletedInterview',

    // module HRE V3: hreRecruitment/hreApproveRecruitmentProposal
    KT_HrePendingApproveRecruitmentProposal: 'KT_HrePendingApproveRecruitmentProposal',
    KT_HreProcesedApproveRecruitmentProposal: 'KT_HreProcesedApproveRecruitmentProposal',

    // module ATT V3: AttLeaveDayReplacement
    KT_AttWaitConfirmLeaveDayReplacement: 'KT_AttWaitConfirmLeaveDayReplacement',
    KT_AttConfirmedLeaveDayReplacement: 'KT_AttConfirmedLeaveDayReplacement',

    KT_AttLeaveFundSeniorBonusViewDetail: 'KT_AttLeaveFundSeniorBonusViewDetail',
    KT_AttLeaveFundCompensatoryViewDetail: 'KT_AttLeaveFundCompensatoryViewDetail',
    // module ATT V3: AttConfirmShiftChange
    KT_AttWaitConfirmShiftChange: 'KT_AttWaitConfirmShiftChange',
    KT_AttConfirmedShiftChange: 'KT_AttConfirmedShiftChange',
    KT_AttRejectedShiftChange: 'KT_AttRejectedShiftChange',

    KT_HreWaitingReceiveJob: 'KT_HreWaitingReceiveJob',
    KT_HreRefuseReceiveJob: 'KT_HreRefuseReceiveJob',

    // module HRE V3: hreJobPosting
    KT_HreInProcessJobPosting: 'KT_HreInProcessJobPosting',
    KT_HreOutDateJobPosting: 'KT_HreOutDateJobPosting',
    KT_HreStopJobPosting: 'KT_HreStopJobPosting',

    // uỷ quyền duyệt
    KT_AttSubmitDelegationApproval: 'KT_AttSubmitDelegationApproval',
    KT_AttRejectSubmitDelegationApproval: 'KT_AttRejectSubmitDelegationApproval',
    KT_AttWaitConfirmSubmitDelegationApproval: 'KT_AttWaitConfirmSubmitDelegationApproval',
    KT_AttConfirmedSubmitDelegationApproval: 'KT_AttConfirmedSubmitDelegationApproval',
    KT_AttCanceledSubmitDelegationApproval: 'KT_AttCanceledSubmitDelegationApproval',
    KT_AttRejectDelegationApproval: 'KT_AttRejectDelegationApproval',
    KT_AttWaitConfirmDelegationApproval: 'KT_AttWaitConfirmDelegationApproval',
    KT_AttConfirmedDelegationApproval: 'KT_AttConfirmedDelegationApproval',
    KT_AttCanceledDelegationApproval: 'KT_AttCanceledDelegationApproval',
    KT_AttConfirmDelegationApproval: 'KT_AttConfirmDelegationApproval',

    KT_SalFeeCheck: 'KT_SalFeeCheck',
    KT_SalWaitApprovePaymentCostRegister: 'KT_SalWaitApprovePaymentCostRegister',
    KT_SalApprovedPaymentCostRegister: 'KT_SalApprovedPaymentCostRegister'
};

export const EnumUser = {
    DATASAVEID: '@DATA_VNR_STORAGE_BIO',
    USERID: 'userid',
    USERNAME: 'username',
    PASSWORD: 'password',
    TOUCHID: 'touchID',
    SHARED_PREFERENCES: 'myLocalAndroid',
    KEYCHANGE_SERVICE: 'myLocalIOS',

    // Key quan trong thay đổi khi tách nhánh
    // Cần đổi tên theo dự án
    DATA_VNR_SECUR_LTM: '@DATA_VNR_SECUR_'
};

export const PlatformURL = Platform.select({
    ios: 'https://apps.apple.com/vn/app/vnresource-hrm-ex-portal/id6450327312',
    android: 'https://play.google.com/store/apps/details?id=com.hrmeportal'
});
