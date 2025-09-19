export const actions = {
    SET_CANCEL_PAYSLIP: 'SET_CANCEL_PAYSLIP',
    setCancelPaySlip: data => {
        return {
            type: actions.SET_CANCEL_PAYSLIP,
            data: data
        };
    }
};
