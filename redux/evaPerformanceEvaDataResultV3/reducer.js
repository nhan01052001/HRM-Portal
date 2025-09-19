import { actions } from './actions';
const defaultState = {
    data: null
    //callbackUnfoUpdateInfo : null
};
export default (state = defaultState, action) => {
    switch (action.type) {
        case actions.SET_DATA11:
            return { ...state, data: action.data };
        default:
            return state;
    }
};
