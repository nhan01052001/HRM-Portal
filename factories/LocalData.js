/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EnumTask, EnumUser } from '../assets/constant';
import RNFetchBlob from 'rn-fetch-blob';
import SInfo from 'react-native-sensitive-info';

const DocumentDir = RNFetchBlob.fs.dirs.DocumentDir;
const storagePath = `${DocumentDir}/persistStore`;
const encoding = 'utf8';
const toFileName = (name) => name.split(':').join('-');
const fromFileName = (name) => name.split('-').join(':');
const pathForKey = (key) => `${storagePath}/${toFileName(key)}`;
export const PlatformFileStorage = {
    setItem: (
        key, // string
        value, // string
        callback // function
    ) =>
        new Promise((resolve, reject) =>
            RNFetchBlob.fs
                .writeFile(pathForKey(key), value, encoding)
                .then(() => {
                    if (callback) {
                        callback();
                    }
                    resolve();
                })
                .catch((error) => {
                    console.log(error, 'setItem');
                    if (callback) {
                        callback(error && error);
                    }
                    reject(error);
                })
        ),
    getItem: (
        key, // string
        callback // function
    ) =>
        new Promise((resolve, reject) => {
            RNFetchBlob.fs
                .exists(pathForKey(toFileName(key)))
                .then((ext) => {
                    if (ext) {
                        RNFetchBlob.fs
                            .readFile(pathForKey(toFileName(key)), encoding)
                            .then((data) => {
                                if (callback) {
                                    callback(null, data);
                                }
                                resolve(data);
                            })
                            .catch((error) => {
                                if (callback) {
                                    callback(error);
                                }
                                resolve(null);
                            });
                    } else {
                        resolve(null);
                    }
                })
                .catch((error) => {
                    console.log(error, 'getItem');
                    resolve(null);
                });
        }),
    removeItem: (key, callback) =>
        new Promise((resolve, reject) =>
            RNFetchBlob.fs
                .exists(pathForKey(toFileName(key)))
                .then((exists) => {
                    if (exists) {
                        RNFetchBlob.fs
                            .unlink(pathForKey(toFileName(key)))
                            .then(() => {
                                resolve();
                            })
                            .catch((error) => {
                                error;
                            });
                    } else {
                        resolve();
                    }
                })
                .catch((error) => {
                    console.log(error, 'removeItem');
                    reject();
                })
        ),
    getAllKeys: (callback) =>
        new Promise((resolve, reject) =>
            RNFetchBlob.fs
                .exists(storagePath)
                .then((exists) => (exists ? Promise.resolve() : RNFetchBlob.fs.mkdir(storagePath)))
                .then(() =>
                    RNFetchBlob.fs
                        .ls(storagePath)
                        .then((files) => files.map((file) => fromFileName(file)))
                        .then((files) => {
                            if (callback) {
                                callback(null, files);
                            }
                            resolve(files);
                        })
                )
                .catch((error) => {
                    if (callback) {
                        callback(error);
                    }
                    reject(error);
                })
        )
};

export const saveDataLocal = async (keyStore, Data) => {
    try {
        if (keyStore != null && typeof keyStore == 'string') {
            const dataSave = JSON.stringify(Data);
            await PlatformFileStorage.setItem(keyStore, dataSave);
            return { actionStatus: true };
        } else {
            return { actionStatus: false };
        }
    } catch (e) {
        console.log(e, 'saveDataLocal');
        return { actionStatus: false };
    }
};

export const getDataLocal = async (keyStore) => {
    try {
        if (keyStore != null && typeof keyStore == 'string') {
            let dataSave = null;

            dataSave = await PlatformFileStorage.getItem(keyStore.trim());
            if (dataSave == null && keyStore == EnumTask.KT_Permission_RequestDataConfig) {
                // Trường hợp đã chuyển IOS qua dùng PlatformFileStorage nhưng user đã có cấu hình từ AyncStorage thì vẫn dùng lại được
                dataSave = await AsyncStorage.getItem(keyStore.trim());
            }

            return dataSave != null ? JSON.parse(dataSave) : null;
        } else {
            return null;
        }
    } catch (e) {
        console.log(e, 'getDataLocal');
        // return null;
        throw e;
    }
};

export const removeMultiKey = async () => {
    try {
        const keyTask = { ...EnumTask };
        await saveDataLocal(keyTask.KT_Permission_RequestDataConfig, '');
        delete keyTask.KT_Permission_RequestDataConfig;
        const listKeyStore = Object.values(keyTask);

        if (listKeyStore.length > 0) {
            const anAsyncFunction = async (key) => {
                PlatformFileStorage.removeItem(key)
                    .then(Promise.resolve())
                    .catch((e) => Promise.resolve());
            };
            const multiRemove = async () => {
                return Promise.all(listKeyStore.map((key) => anAsyncFunction(key)));
            };
            await multiRemove();
        }
        return { actionStatus: true };
    } catch (e) {
        console.log(e, 'removeMultiKey')
        // return { actionStatus: true };
        throw e;
    }
};
// dùng cho xác thực bằng vân tay hay khuôn mặt

export const AsyncStorageService = {
    getItem: async (key) => {
        const result = await AsyncStorage.getItem(key);
        return typeof result === 'string' && result ? JSON.parse(result) : null;
    },
    setItem: async (key, value) => {
        await AsyncStorage.setItem(key, JSON.stringify(value));
        const result = await AsyncStorageService.getItem(key);
        return result;
    },
    clearItem: async (key) => await AsyncStorage.removeItem(key),
    clearAll: async () => await AsyncStorage.clear()
};

export const SInfoService = {
    getItem: async (key) => {
        const result = await SInfo.getItem(key, {
            sharedPreferencesName: EnumUser.SHARED_PREFERENCES,
            keychainService: EnumUser.KEYCHANGE_SERVICE
        });
        return typeof result === 'string' && result ? JSON.parse(result) : null;
    },

    setItem: async (key, value) => {
        try {
            await SInfo.setItem(key, JSON.stringify(value), {
                sharedPreferencesName: EnumUser.SHARED_PREFERENCES,
                keychainService: EnumUser.KEYCHANGE_SERVICE
            });
            const result = await SInfoService.getItem(key);
            return result;
        } catch (error) {
            console.log(error, 'setItem');
        }
    },

    clearItem: async (key) =>
        await SInfo.deleteItem(key, {
            sharedPreferencesName: EnumUser.SHARED_PREFERENCES,
            keychainService: EnumUser.KEYCHANGE_SERVICE
        }),

    getAllItems: async () =>
        await SInfo.getAllItems({
            sharedPreferencesName: EnumUser.SHARED_PREFERENCES,
            keychainService: EnumUser.KEYCHANGE_SERVICE
        })
};
