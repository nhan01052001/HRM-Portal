export const actions = {
    SET_IS_UPDATE: 'SET_IS_UPDATE',
    SET_PROGRESS: 'SET_PROGRESS',
    SET_STATUS: 'SET_STATUS',
    setIsUpdateLater: (data = false) => {
        return {
            type: actions.SET_IS_UPDATE,
            data: data
        };
    },
    setProgress: (data) => {
        return {
            type: actions.SET_PROGRESS,
            data: data
        };
    },
    setStatus: (data) => {
        return {
            type: actions.SET_STATUS,
            data: data
        };
    }
};
