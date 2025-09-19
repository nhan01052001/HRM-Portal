import HttpService from '../utils/HttpService';
import Vnr_function from '../utils/Vnr_Function';

export default class HttpFactory {
    static getDataPicker(api, headerConfig?) {
        //debugger
        const config = {};
        config.headers = headerConfig;

        if (api.type == 'E_GET') {
            return HttpService.Get(api.urlApi, config);
        }
        if (api.type == 'E_POST' && Vnr_function.CheckIsNullOrEmpty(api.dataBody) == false) {
            return HttpService.Post(api.urlApi, api.dataBody, config);
        }
    }
}
