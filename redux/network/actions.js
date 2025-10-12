export const actions = {
    SET_IS_CONNECTED: '@NETWORK/SET_IS_CONNECTED',
    SET_INFO_NETWORK: '@SET_INFO_NETWORK',
    setIsConnected: (isConnected) => {
        return {
            type: actions.SET_IS_CONNECTED,
            isConnected
        };
    },
    // data = { isConnected : bool , detailsNetwork }
    setInfoNetwork: (data) => {
        return {
            type: actions.SET_INFO_NETWORK,
            data
        };
    }
};
