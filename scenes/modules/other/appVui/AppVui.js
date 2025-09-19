import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, Size, styleSafeAreaView } from '../../../../constants/styleConfig';
import { connect } from 'react-redux';
import HttpService from '../../../../utils/HttpService';
import DrawerServices from '../../../../utils/DrawerServices';
import WebView from 'react-native-webview';
import VnrLoading from '../../../../components/VnrLoading/VnrLoading';
import { ToasterSevice } from '../../../../components/Toaster/Toaster';
import TouchIDService from '../../../../utils/TouchIDService';

// const URI_VUIAPP = {
//     auth: 'https://auth.sandbox.vuiapp.vn/',
//     api: 'https://api.sandbox.vuiapp.vn/'
// };

class AppVui extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isConfirmPass: false,
            linkWebAccess: null,
            AuthLinkAppVui: null,
            ApiLinkAppVui: null
        };

        this.refWebView = null;

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            //DrawerServices.getBeforeScreen() != 'SalaryMonthDetail' &&
            TouchIDService.checkConfirmPass(this.onFinish.bind(this));
        });
    }

    onFinish = (isSuccess) => {
        if (isSuccess) this.getLinkAccess();
        //gọi api lấy url app vui dựa vào profileID đăng nhập vào App
        else DrawerServices.goBack();
    };

    // putDataAttendance = async (token) => {
    //     try {
    //         const infoAccount = await SInfoService.getItem('E_SAVE_ACCOUNT');
    //         if (infoAccount && infoAccount.Cellphone && infoAccount.CodeEmp) {
    //             this.getLinkAccess(token, infoAccount);
    //         }
    //         else {
    //             const profile = await HttpService.Get('[URI_HR]/Hre_GetDataV2/GetUserInfoAuthVuiAppForApp'),
    //                 _infoAccount = {
    //                     Cellphone: profile.Data.CellPhone,
    //                     CodeEmp: profile.Data.CodeEmp,
    //                     UserName: infoAccount.UserName,
    //                     Password: infoAccount.Password
    //                 };
    //             console.log(_infoAccount, '_infoAccount');
    //             await SInfoService.setItem('E_SAVE_ACCOUNT', _infoAccount);
    //             this.getLinkAccess(token, _infoAccount);
    //         }

    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    getLinkAccess = async () => {
        // const configsSessions = {
        //     headers: {
        //         'Authorization': `Bearer ${token}`,
        //         'Content-Type': 'application/json',
        //     },
        // },
        //     numberPhone = profile.Cellphone,
        //     codeEmp = profile.CodeEmp;
        // if (dataVnrStorage.apiConfig.serviceEndpointApi) {
        // Lấy UserName và Password
        // const bodyToken = {
        //     grant_type: 'password',
        //     username: profile.UserName,
        //     password: profile.Password
        // };

        // Lấy token từ VnR HRM để gửi qua AppVui dùng cho việc gửi Notify
        // const configs = {
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //     },
        // };

        // const params = new URLSearchParams();
        // params.append('grant_type', 'password');
        // params.append('username', bodyToken.username);
        // params.append('password', bodyToken.password);

        // Lấy access_token từ AppVui
        // axios.post(`${dataVnrStorage.apiConfig.serviceEndpointApi}/Token`, params, configs)
        //     .then(getTokenHrmJson => {

        // const dataBody = {
        //     companyCode: "VNR",
        //     employee: {
        //         phoneNumber: numberPhone,
        //         employeeCode: codeEmp
        //     },
        // serviceEndpointApi: dataVnrStorage.apiConfig.serviceEndpointApi,
        // notificationAccessToken: getTokenHrmJson.access_token, // gán access_token
        // notificationRefreshToken: getTokenHrmJson.refresh_token // gán refresh_token
        // };

        // Lấy Link trang web AppVui
        HttpService.Get('[URI_HR]/Sal_Getdata/GetURLEmbeddedVuiApp')
            .then((res) => {
                if (res && res.webUri)
                    this.setState({
                        linkWebAccess: res.webUri
                    });
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status == 404) {
                        ToasterSevice.showWarning('Tài khoản chưa được kích hoạt');
                    } else if (error.response.status == 409) {
                        ToasterSevice.showWarning('Yêu cầu đã được liên kết với người dùng khác');
                    }
                    DrawerServices.goBack();
                }
            });
        // })

        // }
        // else {
        //     ToasterSevice.showError('Chưa cấu hình link service API')
        // }
    };

    // generaRender = async () => {
    //     const configs = {
    //         headers: {
    //             'Content-Type': 'application/x-www-form-urlencoded',
    //         },
    //     };

    //     HttpService.Get('[URI_HR]/Sys_GetData/GetAccessTokenVuiAppForApp')
    //     .then(
    //         res => {
    //                 const params = new URLSearchParams();
    //                 console.log(res, 'api token');
    //                 params.append('client_id', res.Data.client_id);
    //                 params.append('client_secret', res.Data.client_secret);
    //                 params.append('grant_type', res.Data.grant_type);
    //                 //params.append('scope', 'openid');

    //                 this.setState({
    //                     ApiLinkAppVui: res.Data.ApiLinkAppVui ? res.Data.ApiLinkAppVui : URI_VUIAPP.api,
    //                     AuthLinkAppVui: res.Data.AuthLinkAppVui  ? res.Data.AuthLinkAppVui : URI_VUIAPP.auth
    //                 }, () => {
    //                     // Lấy access_token từ AppVui
    //                     axios.post(`${this.state.AuthLinkAppVui}auth/realms/${res.Data.client_id}/protocol/openid-connect/token`, params.toString(), configs)
    //                         .then(resToken => {
    //                             if (resToken && resToken.access_token) {
    //                                 this.putDataAttendance(resToken.access_token)
    //                             }
    //                         }).catch(er => console.log(er, 'er ãxios'))
    //                 })

    //             }
    //         )
    // }

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
    }

    render() {
        const { linkWebAccess } = this.state;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                {linkWebAccess ? (
                    <View style={[styleSheets.containerGrey]}>
                        <WebView
                            scrollEnabled
                            ref={(refWebView) => (this.refWebView = refWebView)}
                            source={{ uri: linkWebAccess, method: 'GET' }}
                            startInLoadingState={true}
                            incognito={true}
                            renderLoading={() => (
                                <View style={styles.styWebViewVuiApp}>
                                    <VnrLoading size={'large'} />
                                </View>
                            )}
                        />
                    </View>
                ) : (
                    <VnrLoading size="large" isVisible={true} />
                )}
            </SafeAreaView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

export default connect(mapStateToProps, null)(AppVui);

const styles = StyleSheet.create({
    styWebViewVuiApp: {
        position: 'absolute',
        width: Size.deviceWidth,
        height: Size.deviceheight - Size.headerHeight,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
