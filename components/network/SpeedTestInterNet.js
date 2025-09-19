import RNFetchBlob from 'rn-fetch-blob';
const metric = 'KB';
const POOR = 150;
const MODERATE = 550;
const GOOD = 2000;

export const SpeedTestInterNet = imageURIParam => {
    const imageURI = imageURIParam
        ? imageURIParam
        : 'https://drive.google.com/file/d/1IKnhYI6l0LG156a-s40SAZorB1bAkuqO/view?usp=sharing';

    return new Promise((resolve, reject) => {
        const startTime = new Date().getTime();
        RNFetchBlob.config({
            fileCache: false
        })
            .fetch('GET', imageURI, {})
            .then(res => {
                const endTime = new Date().getTime();
                const kbPerSecond = Math.floor(1024 / ((endTime - startTime) / 1000));

                var isSlow = false;
                var isGood = false;
                console.log((endTime - startTime) / 1000, kbPerSecond, 'kbPerSecond');
                if (kbPerSecond <= POOR) {
                    // very bad connection
                    //Warning('very bad connection');

                    isSlow = true;
                } else if (kbPerSecond >= POOR && kbPerSecond <= MODERATE) {
                    // avg speed
                    //Warning('avg speed');

                    isSlow = true;
                } else if (kbPerSecond >= MODERATE && kbPerSecond <= GOOD) {
                    // good connection
                    //Warning('good connection');

                    isGood = true;
                } else if (kbPerSecond > GOOD) {
                    // excellent connection
                    //Warning('excellent connection');

                    isGood = true;
                }

                resolve({ metric, isGood });
            })
            .catch(reject);
    });
};
