import { actions } from './actions';
const _defaultState = {
    language: 'VN'
};
export default (state = _defaultState, action) => {
    switch (action.type) {
        case actions.CHANGE_LANGUAGE:
            return { ...state, language: action.language };
        default:
            return { ...state };
    }
};
