import HttpService from '../../utils/HttpService';
import { VnrLoadingSevices } from '../../components/VnrLoading/VnrLoadingPages';
import { EnumName, EnumTask } from '../../assets/constant';
import { getDataLocal, saveDataLocal } from '../../factories/LocalData';

const saveDataProfile = async resAll => {
    try {
        const dataListLocal = await getDataLocal(EnumTask.KT_GeneralInfomation);
        const resSave = await saveDataLocal(EnumTask.KT_GeneralInfomation, {
            ...dataListLocal,
            ...{
                [EnumName.E_PRIMARY_DATA]: [...resAll]
            }
        });
    } catch (error) {
        console.log(error);
    }
};

export const actions = {
    SET_DATA11: 'SET_DATA11',
    //SET_CALLBACK_UNDO_UPDATE_INFO : 'SET_CALLBACK_UNDO_UPDATE_INFO',
    setGeneralProfileInfo: data => {
        return {
            type: actions.SET_DATA11,
            data: data
        };
    },
    fetchGeneralProfileInfo: () => {
        return dispatch => {
            const listRequests = [
                HttpService.Post('[URI_HR]/Por_GetData/NewPortal_GetProfile'),
                HttpService.Get(
                    '[URI_HR]/Por_GetData/NewPortalGetRequestInfo?ProfileID=c91f2cec-ce99-4a7e-bd2e-af85c996c7bf'
                )
            ];

            VnrLoadingSevices.show();
            HttpService.MultiRequest(listRequests)
                .then(resAll => {
                    VnrLoadingSevices.hide();
                    const dataDispatch = {
                        profile: { ...resAll[0] },
                        dataWaitingApprove: [...resAll[1]]
                    };
                    saveDataProfile(resAll);
                    return dispatch(actions.setGeneralProfileInfo(dataDispatch));
                })
                .catch(function(error) {
                    VnrLoadingSevices.hide();
                    return dispatch(actions.setGeneralProfileInfo(null));
                });
        };
    }
};
