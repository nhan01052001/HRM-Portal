/* eslint-disable no-console */
import { AppState } from 'react-native';
import * as signalR from '@microsoft/signalr';
import { getDataVnrStorage, logout } from '../assets/auth/authentication';
import HttpService from './HttpService';
import store from '../store';
import RootState from '../redux/RootState';

class SignalRService {
    static startConnect() {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            let dataVnrStorage = getDataVnrStorage(),
                { currentUser } = dataVnrStorage,
                stateHub = null;

            if (this.connection) {
                stateHub = this.connection.state;
            }

            if (HttpService.checkConnectInternet() === false) return;

            // Nếu đã connect thì k connect nữa
            if (currentUser && (stateHub == null || stateHub == signalR.HubConnectionState.Disconnected)) {
                let token = await HttpService.getToken();
                if (token) {
                    this.connection = new signalR.HubConnectionBuilder()
                        .withUrl(HttpService.handelUrl('[URI_IDENTITY]identityHub'), {
                            withCredentials: true,
                            accessTokenFactory: () => token
                            // transport: signalR.HttpTransportType.WebSockets
                        })
                        // .configureLogging(signalR.LogLevel.Debug)
                        .build();

                    // Start the connection
                    this.connection
                        .start()
                        .then(() => {
                            resolve(this.connection);
                            this.listenDeactiveUser(); // check deactive user
                            this.listenCancelPubishPayslip(); // check deactive user
                            this.listenSignOut(); // check deactive user
                        })
                        .catch((err) => {
                            console.log(err, 'err connection');
                            reject(this.connection);
                        });
                }
            }
        });
    }

    static listenDeactiveUser() {
        let dataVnrStorage = getDataVnrStorage(),
            { currentUser } = dataVnrStorage;

        if (currentUser) {
            this.connection.on('DeactiveUser', (userId) => {
                if (
                    currentUser &&
                    currentUser.headers?.userid &&
                    currentUser.headers?.userid == userId &&
                    AppState.currentState == 'active'
                ) {
                    logout();
                }
            });
        }
    }

    static listenCancelPubishPayslip() {
        let dataVnrStorage = getDataVnrStorage(),
            { currentUser } = dataVnrStorage;
        if (currentUser) {
            this.connection.on('cancelPublishPayslip', (data) => {
                if (
                    currentUser &&
                    data &&
                    currentUser.headers?.userid &&
                    currentUser.headers?.userid == data.userID &&
                    data.cutOffDurationID
                ) {
                    store.dispatch(RootState.actions.setCancelPaySlip(data));
                }
            });
        }
    }

    static listenSignOut() {
        let dataVnrStorage = getDataVnrStorage(),
            { currentUser } = dataVnrStorage;
        if (currentUser) {
            this.connection.on('SignOut', (isSignOut) => {
                if (isSignOut && isSignOut == true && AppState.currentState == 'active') {
                    logout();
                }
            });
        }
    }

    static disconnect() {
        if (this.connection && this.connection.onclose) {
            this.connection.onclose();
        }
    }
}

export default SignalRService;
