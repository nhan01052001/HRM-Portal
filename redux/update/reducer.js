import { actions } from './action';
export const STATUS_UPDATE_LATER = {
    NONE: 0,
    DOWNLOADING : 1,
    DONE: 2,
    ERROR: 3
};

const defaultState = {
    isUpdateLater: false,
    progress: 0,
    status: STATUS_UPDATE_LATER.NONE
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case actions.SET_IS_UPDATE:
            return { ...state, isUpdateLater: action.data };
        case actions.SET_PROGRESS:
            return { ...state, progress: action.data };
        case actions.SET_STATUS:
            return { ...state, status: action.data };
        default:
            return state;
    }
};
