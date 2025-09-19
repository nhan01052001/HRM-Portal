import { actions } from './action';
const defaultState = {
    dataProfileAdded: null
};
export default (state = defaultState, action) => {
    switch (action.type) {
        case actions.SET_PROFILE_ADDED:
            return { ...state, dataProfileAdded: action.data };
        default:
            return state;
    }
};
