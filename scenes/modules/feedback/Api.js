import HttpService from '../../../utils/HttpService';
import { AsyncStorageService } from '../../../factories/LocalData';
import DeviceInfo from 'react-native-device-info';
import { dataVnrStorage } from '../../../assets/auth/authentication';
import { Platform } from 'react-native';
import { VnrLoadingSevices } from '../../../components/VnrLoading/VnrLoadingPages';
import { ToasterSevice } from '../../../components/Toaster/Toaster';
import { EnumName } from '../../../assets/constant';
import moment from 'moment';

export const SaveLogError = async (error) => {
    try {
        if (error == null) return;
        const dataListQr = await AsyncStorageService.getItem('@DATA_SCANED_QR_LIST'),
            qrSelected = dataListQr ? dataListQr.find((item) => item.isSelect == true) : null;

        const { apiConfig } = dataVnrStorage,
            _uriPor = apiConfig ? apiConfig.uriPor : null;
        // const params = null;
        const namePhone = DeviceInfo.getModel();
        // Check if the description is a string, if not, convert it to a string
        const errorDescription = typeof error === 'string' ? error : JSON.stringify(error);

        VnrLoadingSevices.show();
        const DataFeedback = {
            CusCode: qrSelected?.CusCode ? qrSelected?.CusCode : qrSelected?.CusName ? qrSelected?.CusName : '',
            CusName: qrSelected?.CusName ? qrSelected?.CusName : '',
            VersionCode: qrSelected?.VersionCode,
            UriPor: _uriPor,
            DateError: moment(new Date()).format('DD-MM-YYYY HH:mm:ss'),
            PlatForm: Platform.OS,
            PlatFormVersion: Platform.Version.toString(),
            UserName: dataVnrStorage.currentUser?.headers?.userlogin,
            Email: '', //Email.value,
            ScreenName: '',
            DescriptionError: errorDescription ? errorDescription : '',
            StatusError: '',
            NameAPI: '',
            DescriptionErrorAPI: '',
            LinkVideo: '',
            LinkImage: '',
            UserID: dataVnrStorage.currentUser?.headers?.userid,
            ProfileID: dataVnrStorage.currentUser?.info?.ProfileID,
            NamePhone: namePhone ? namePhone : '',
            Note: 'Ghi log lỗi app'
        };

        FeedbackApi(DataFeedback)
            .then((res) => {
                VnrLoadingSevices.hide();
                if (res === EnumName.E_Success || res === 'Sucess') {
                    ToasterSevice.showSuccess('Ghi log lỗi thành công', 4000);
                }
            })
            .catch(() => {
                ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
            });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
    }
};

export const FeedbackApi = async (DataFeedback) => {
    return HttpService.Post('[URI_SYS]/sys_getdata/FeedbackErrorApp', { DataFeedback });
};
