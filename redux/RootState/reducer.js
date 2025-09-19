import { actions } from './actions';
const defaultState = {
    cancelPublishPayslip: null
};
export default (state = defaultState, action) => {
    switch (action.type) {
        case actions.SET_CANCEL_PAYSLIP:
            return { ...state, cancelPublishPayslip: action.data };
        default:
            return state;
    }
};
