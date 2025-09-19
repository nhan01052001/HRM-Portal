import Vnr_Function from '../../utils/Vnr_Function';
import Vnr_Services from '../../utils/Vnr_Services';
import ManageFileSevice from '../../utils/ManageFileSevice';

export const ItemViewDetail = (props) => {
    const configListDetail = props?.props?.config,
        dataItem = props?.props?.data;

    dataItem.ProfileName = dataItem?.CandidateName;
    dataItem.SalarySuggest = `${dataItem?.TypeSalaryView} - ${dataItem?.SalarySuggest} ${dataItem?.CurrencyName}`
    dataItem.BusinessAllowAction = Vnr_Services.handleStatusApprove(
        dataItem.Status,
        dataItem?.SendEmailStatus ? dataItem?.SendEmailStatus : false
    );
    dataItem.itemStatus = Vnr_Services.formatStyleStatusApp(dataItem.Status);
    if (!Array.isArray(dataItem.FileAttachment))
        dataItem.FileAttachment = ManageFileSevice.setFileAttachApp(dataItem.FileAttachment);

    if (!Array.isArray(dataItem.Attachment))
        dataItem.Attachment = ManageFileSevice.setFileAttachApp(dataItem.Attachment);

    return (
        configListDetail.map((e) => {
            if (e.TypeView != 'E_COMMON_PROFILE')
                return Vnr_Function.formatStringTypeV3(dataItem, e, configListDetail);
        })
    )
}