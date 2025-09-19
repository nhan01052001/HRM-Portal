import { actions } from './actions';
const defaultState = {
    data: null
    //callbackUnfoUpdateInfo : null
};
export default (state = defaultState, action) => {
    switch (action.type) {
        case actions.SET_DATA11:
            return { ...state, data: action.data };
        // case actions.SET_CALLBACK_UNDO_UPDATE_INFO:
        //     return { ...state, callbackUnfoUpdateInfo: action.data };
        default:
            return state;
    }
};
