import { actions } from './action';
const defaultState = {
    dataEmail: null,
    dataDescription: null,
    dataImgVideo: []
};
export default (state = defaultState, action) => {
    switch (action.type) {
        case actions.SET_DATA_EMAIL:
            return { ...state, dataEmail: action.data };

        case actions.SET_DATA_DESCRIPTION:
            return { ...state, dataDescription: action.data };

        case actions.SET_DATA_IMG_VIDEO:
            return { ...state, dataImgVideo: action.data === null ? [] : [...action.data] };
        default:
            return state;
    }
};
