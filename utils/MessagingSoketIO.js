import io from 'socket.io-client';
import DeviceInfo from 'react-native-device-info';
import { dataVnrStorage } from '../assets/auth/authentication';

const deviceID = DeviceInfo.getUniqueId();

class MessagingSoketIO {
    //http://192.168.1.58:3000/
    static connect(userID) {
        const { chatEndpointSocket } = dataVnrStorage.apiConfig;

        this.socket = io(chatEndpointSocket, {
            transports: ['websocket'],
            jsonp: false,
            query: {
                userID,
                token: deviceID
            }
        });

        // io('disconnect', (reason) => {
        //     console.log(this.socket + ' disconnected');
        // });

        // io('error', (reason) => {
        //     console.log(this.socket + ' error');
        // });
    }

    static send(dataBody, key) {
        if (this.socket) {
            this.socket.emit(key, dataBody);
        }
    }

    static listen(fnc, key) {
        if (fnc && typeof fnc === 'function') {
            this.socket.on(key, data => {
                //check token khi nhận message
                if (key == 'SERVER-SEND-MESSAGE') {
                    if (data && data.token == deviceID) fnc(data);
                }
                //nhận thông báo khác, khỏi check
                else {
                    fnc(data);
                }
            });
        }
    }
}

export default MessagingSoketIO;
