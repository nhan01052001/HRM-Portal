import { actions } from './actions';
const _defaultState = {
    countBadgesMessaging: 0,
    countBadgesNotify: 0,
    countNumbersApprove: null
};
export default (state = _defaultState, action) => {
    switch (action.type) {
        case actions.SET_NUMBER_BADGES_MESSAGING:
            return {
                ...state,
                countBadgesMessaging: action.number
            };
        case actions.SET_NUMBER_BADGES_NOTIFY:
            return {
                ...state,
                countBadgesNotify: action.number
            };
        case actions.SET_NUMBER_BADGES_COUNT_APPROVE:
            return {
                ...state,
                countNumbersApprove: action.data
            };
        case action.CLEAN_ALL_NUMBER_BADGES:
            return {
                ...state,
                countBadgesMessaging: 0,
                countBadgesNotify: 0,
                countNumbersApprove: null
            };
        default:
            return { ...state };
    }
};
