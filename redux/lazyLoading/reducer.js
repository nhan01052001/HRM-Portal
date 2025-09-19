import { actions } from './actions';
const _defaultState = {
    reloadScreenName: null,
    isChange: false, // Tham số này chống trường hợp action như cũ conponent sẽ không chạy lại
    message: null
};
export default (state = _defaultState, action) => {
    switch (action.type) {
        case actions.RELOAD_SCREEN_NAME:
            return {
                ...state,
                reloadScreenName: action.reloadScreenName,
                message: action.message,
                isChange: !state.isChange
            };
        default:
            return { ...state };
    }
};
