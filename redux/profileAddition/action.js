export const actions = {
    SET_PROFILE_ADDED: 'set-profile-added',

    setProfileAdded: data => {
        return {
            type: actions.SET_PROFILE_ADDED,
            data: data
        };
    }
};
