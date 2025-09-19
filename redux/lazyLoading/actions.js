export const actions = {
    RELOAD_SCREEN_NAME: 'RELOAD_SCREEN_NAME',
    reloadScreen: (reloadScreenName, message) => {
        return {
            type: actions.RELOAD_SCREEN_NAME,
            reloadScreenName,
            message: message
        };
    }
};
