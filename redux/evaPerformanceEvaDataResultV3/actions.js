import HttpService from '../../utils/HttpService';
import { VnrLoadingSevices } from '../../components/VnrLoading/VnrLoadingPages';
export const actions = {
    SET_DATA11: 'SET_DATA11',
    //SET_CALLBACK_UNDO_UPDATE_INFO : 'SET_CALLBACK_UNDO_UPDATE_INFO',
    setGeneralDataGetbyId: data => {
        return {
            type: actions.SET_DATA11,
            data: data
        };
    },
    // setCallbackUndoUpdateInfo : (callback)=>{
    //     return {
    //         type: actions.SET_CALLBACK_UNDO_UPDATE_INFO,
    //         data: callback
    //     };
    // },
    fetchGetById: ID => {
        return dispatch => {
            VnrLoadingSevices.show();
            HttpService.Get(`[URI_POR]/New_PerformanceEvaDataResultV3/GetById?ID=${ID ? ID : ''}`)
                .then(res => {
                    VnrLoadingSevices.hide();
                    return dispatch(actions.setGeneralDataGetbyId(res));
                })
                .catch(function(error) {
                    VnrLoadingSevices.hide();
                    return dispatch(actions.setGeneralDataGetbyId(null));
                });
        };
    }
};
