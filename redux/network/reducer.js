import { actions } from './actions';
const _defaultState = {
    isConnected: true,
    detailsNetwork: null
};
export default (state = _defaultState, action) => {
    switch (action.type) {
        case actions.SET_IS_CONNECTED:
            return { ...state, isConnected: action.isConnected };
        case actions.SET_INFO_NETWORK:
            // data = { isConnected : bool , detailsNetwork }
            return { ...state, ...action.data };
        default:
            return state;
    }
};
