import { generateRowActionAndSelected, SalWaitApprovePaymentCostRegisterBusiness } from './salWaitApprovePaymentCostRegister/SalWaitApprovePaymentCostRegisterBusiness';
import SalSubmitPaymentCostRegisterViewDetail from '../salSubmitPaymentCostRegister/SalSubmitPaymentCostRegisterViewDetail';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import { translate } from '../../../../../i18n/translate';

const configDefault = [
    {
        'TypeView': 'E_GROUP',
        'DisplayKey': 'HRM_Detail_Approve_Info_Common',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_USERAPPROVE1',
        'Name': 'UserInfoFirstApproverName1',
        'DisplayKey': 'HRM_Attendance_Overtime_UserApproveID',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_USERAPPROVE2',
        'Name': 'UserInfoMidApproverName3',
        'DisplayKey': 'HRM_Attendance_Overtime_UserApproveID3',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_USERAPPROVE3',
        'Name': 'UserInfoLastApporoverName4',
        'DisplayKey': 'HRM_Attendance_Overtime_UserApproveID4',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_USERAPPROVE4',
        'Name': 'UserInfoNextApproverName2',
        'DisplayKey': 'HRM_Attendance_Overtime_UserApproveID2',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_STATUS',
        'Name': 'StatusView',
        'DisplayKey': 'HRM_Attendance_Overtime_OvertimeList_Status',
        'DataType': 'string'
    }
];

const configDefaultInfoEmployee = [
    {
        'TypeView': 'E_GROUP',
        'DisplayKey': 'HRM_HR_Profile_Info',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'CodeEmp',
        'DisplayKey': 'HRM_HR_Profile_CodeEmp',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'ProfileName',
        'DisplayKey': 'HRM_HR_Profile_ProfileName',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'OrgStructureName',
        'DisplayKey': 'Department',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'SalaryClassName',
        'DisplayKey': 'HRM_PortalApp_ContractHistory_Level',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_GROUP',
        'DisplayKey': 'HRM_Detail_Process_Info_Common',
        'DataType': 'string'
    }
];

export default class SalApprovePaymentCostRegisterViewDetail extends SalSubmitPaymentCostRegisterViewDetail {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            dataRowActionAndSelected: generateRowActionAndSelected(),
            listActions: this.resultListActionHeader()
        };

        const _params = props.navigation.state.params,
            { dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params);


        if (dataItem) {
            props.navigation.setParams({
                title: translate('HRM_PortalApp_CostPaymentDetails')
            });
        }
    }

    onPessDelete = (item) => {
        SalWaitApprovePaymentCostRegisterBusiness.businessDeleteSalPaymentCost([item]);
    };

    componentDidMount() {
        SalWaitApprovePaymentCostRegisterBusiness.setThisForBusiness(this, true);
        const _params = this.props.navigation.state.params;
        if (!ConfigListDetail.value[_params?.screenName]) {
            ConfigListDetail.value[_params?.screenName] = [
                ...configDefault
            ];
        }

        if (!ConfigListDetail.value['SalApprovePaymentCostRegisterViewDetailInfoEmployee']) {
            ConfigListDetail.value['SalApprovePaymentCostRegisterViewDetailInfoEmployee'] = [
                ...configDefaultInfoEmployee
            ];
        }

        this.getDataItem();
    }
}

