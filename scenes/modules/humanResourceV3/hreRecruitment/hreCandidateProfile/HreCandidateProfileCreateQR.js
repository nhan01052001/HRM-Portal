import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Modal from 'react-native-modal';
import { Size, Colors, CustomStyleSheet } from '../../../../../constants/styleConfig';
import { IconCancel, IconDownload } from '../../../../../constants/Icons';
import { styleSheets } from '../../../../../constants/styleConfig';
import HttpService from '../../../../../utils/HttpService';
import { EnumName } from '../../../../../assets/constant';
import RNQRGenerator from 'rn-qr-generator';
import moment from 'moment';
import { translate } from '../../../../../i18n/translate';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';

export class HreCandidateProfileCreateQR extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpenModalQR: false,
            QRImage: null,
            DateExpire: null,
            DateCreate: moment().format('DD/MM/YYYY')
        };
    }

    openModalQRcode = () => {
        this.setState(
            {
                isOpenModalQR: true
            },
            () => {
                this.getQRcode();
            }
        );
    };

    hideModalQR = () => {
        this.setState({
            isOpenModalQR: false
        });
    };

    getQRcode = () => {
        const { isOpenModalQR } = this.state;
        if (isOpenModalQR) {
            HttpService.Post('[URI_CENTER]/api/Rec_GetData/GenerateQRForRec', {
                Type: 'ActionCreateCandidate'
            }).then((res) => {
                if (res?.Status === EnumName.E_SUCCESS) {
                    if (res.Data && res.Data.token) {
                        RNQRGenerator.generate({
                            value: `${dataVnrStorage.apiConfig.uriPor}my-app/#/public/public-access/candidate-information-public/${res.Data.token}`,
                            height: 250,
                            width: 250
                        })
                            .then((response) => {
                                const { uri } = response;
                                this.setState({ QRImage: uri, DateExpire: moment(res.Data.DateExpire).format('DD/MM/YYYY') });
                            })
                            .catch((error) => console.error('Failed to generate QR code', error));
                    }
                }
            });
        }
    };

    componentDidMount = () => {};

    render() {
        const { QRImage, DateCreate, DateExpire } = this.state;

        return (
            <Modal
                isVisible={this.state.isOpenModalQR}
                onBackdropPress={() => {
                    this.hideModalQR();
                }}
                animationIn="slideInUp" // Hiệu ứng khi modal hiển thị (hiệu ứng từ phía dưới lên)
                animationOut="slideOutDown" // Hiệu ứng khi modal ẩn đi (hiệu ứng từ phía trên xuống)
                backdropOpacity={0.7}
                style={[[CustomStyleSheet.margin(0)]]}
                onRequestClose={() => this.hideModalQR()}
            >
                <View style={styles.styModalContainer}>
                    <TouchableOpacity style={[{ alignSelf: 'flex-end' }]} onPress={() => this.hideModalQR()}>
                        <IconCancel size={Size.iconSizeHeader} color={Colors.gray_7} />
                    </TouchableOpacity>
                    <View style={[CustomStyleSheet.flexDirection('column'), CustomStyleSheet.alignItems('center')]}>
                        <Text
                            style={[
                                styleSheets.lable,
                                CustomStyleSheet.fontWeight('700'),
                                CustomStyleSheet.fontSize(Size.text + 10)
                            ]}
                        >
                            Quét mã QR
                        </Text>
                        <Text
                            style={[
                                styleSheets.lable,
                                CustomStyleSheet.fontWeight('400'),
                                CustomStyleSheet.fontSize(Size.text + 2)
                            ]}
                        >
                            Quét mã này để nhập thông tin ứng viên
                        </Text>
                        {QRImage ? (
                            <View style={styles.styContainerIamgeQR}>
                                <Image style={{ width: 270, height: 270 }} source={{ uri: QRImage }} />
                            </View>
                        ) : (
                            <View></View>
                        )}
                        <Text style={[styleSheets.text, CustomStyleSheet.marginTop(5)]}>{`${translate('Ngày tạo')}: ${DateCreate}`}</Text>
                        <Text style={[styleSheets.text]}>{`${translate('Ngày hết hạn')}: ${DateExpire}`}</Text>
                        <TouchableOpacity style={styles.styBtnDown}>
                            <IconDownload size={Size.iconSize} color={Colors.white} />
                            <Text
                                style={[
                                    styleSheets.text,
                                    { fontSize: Size.text + 4, color: Colors.white, marginLeft: 5 }
                                ]}
                            >
                                Tải xuống
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
}

export default HreCandidateProfileCreateQR;

const styles = StyleSheet.create({
    styContainerIamgeQR: {
        padding: 4,
        backgroundColor: Colors.white,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: Colors.gray_5,
        marginTop: Size.defineSpace
    },
    styBtnDown: {
        backgroundColor: Colors.primary,
        paddingHorizontal: Size.defineSpace,
        paddingVertical: Size.defineHalfSpace,
        borderRadius: Size.borderRadiusBotton,
        alignItems: 'flex-start',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: Size.defineSpace
    },
    styModalContainer: {
        backgroundColor: Colors.white,
        flexDirection: 'column',
        flex: 1,
        height: Size.deviceheight * 0.7,
        width: Size.deviceWidth,
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        padding: Size.defineSpace
    }
});
