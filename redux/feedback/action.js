export const actions = {
    SET_DATA_EMAIL: 'set-data-email',
    SET_DATA_DESCRIPTION: 'set-data-description',
    SET_DATA_IMG_VIDEO: 'set-data-image-video',

    setDataEmail: data => {
        return {
            type: actions.SET_DATA_EMAIL,
            data: data
        };
    },

    setDataDescription: data => {
        return {
            type: actions.SET_DATA_DESCRIPTION,
            data: data
        };
    },

    setDataImgVideo: data => {
        return {
            type: actions.SET_DATA_IMG_VIDEO,
            data: data
        };
    }
};
