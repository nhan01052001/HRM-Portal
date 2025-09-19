import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
    TouchableWithoutFeedback,
    Text,
    FlatList,
    Platform,
    Alert
} from 'react-native';
import { styleSheets, styleSafeAreaView, Size, Colors, CustomStyleSheet } from '../../../../constants/styleConfig';
import { EnumName } from '../../../../assets/constant';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import HttpService from '../../../../utils/HttpService';
import DrawerServices from '../../../../utils/DrawerServices';
import { IconRadioCheck, IconRadioUnCheck } from '../../../../constants/Icons';
import WebView from 'react-native-webview';
import VnrLoading from '../../../../components/VnrLoading/VnrLoading';
import { getDataVnrStorage, dataVnrStorage } from '../../../../assets/auth/authentication';
import ManageFileSevice from '../../../../utils/ManageFileSevice';
import Vnr_Services from '../../../../utils/Vnr_Services';
import { ToasterSevice } from '../../../../components/Toaster/Toaster';

class RecruitmentReport extends Component {
    constructor(props) {
        super(props);

        this.state = {
            menuData: null,
            reportID: null,
            isModalVisible: false,
            uriPor: dataVnrStorage?.apiConfig?.uriPor
        };
    }

    componentDidMount() {
        HttpService.Get('[URI_POR]/New_BI_Chart/ListMenuData')
            .then((res) => {
                if (res && Array.isArray(res) && res.length > 0) {
                    let data = res;
                    data[0].isSelect = true;
                    this.setState({
                        menuData: res,
                        reportID: res[0].ID
                    });
                } else {
                    this.setState({ menuData: EnumName.E_EMPTYDATA });
                }
            })
            .catch((error) => {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            });
    }

    closeModal() {
        this.setState({
            isModalVisible: false
        });
    }

    openModal() {
        this.setState({ isModalVisible: true });
    }

    toggleIsCheckItem = (index, id) => {
        this.setState(
            (prevState) => {
                // Nếu item chưa được chọn, cập nhật trạng thái
                const updatedMenuData = prevState.menuData.map((item, i) => ({
                    ...item,
                    isSelect: i === index // Chỉ chọn item được nhấn
                }));
                return { menuData: updatedMenuData, reportID: id, isModalVisible: false };
            },
            () => {
                this.reloadReportView();

            }
        );
    };

    reloadReportView() {
        const { reportID } = this.state;
        if (reportID) {
            // Update injected JavaScript
            const _dataVnrStorage = getDataVnrStorage(),
                { currentUser } = _dataVnrStorage;
            const newInjectedJavaScript = `
                (function () {
                try {
                    function waitForAngularAndInit() {
                        if (window.angular && angular.element(document.body).injector()) {
                            initChartApp('${reportID}', '${currentUser?.headers?.tokenportalapp}');
                        } else {
                            setTimeout(waitForAngularAndInit, 100);
                        }
                    }
                    waitForAngularAndInit();
                } catch (error) {
                    console.error('Error in injectedJavaScript:', error);
                }
                })();
                true;
            `;
            // Update WebView with new injected JavaScript and reload it
            if (this.refWeb) {
                this.refWeb.injectJavaScript(newInjectedJavaScript);
                this.refWeb.reload();
            }
        }
    }

    shouldComponentUpdate(nextState) {
        return nextState.reportID !== this.state.reportID;
    }

    handleMessage = (event) => {
        let data = null;
        try {
            data = JSON.parse(event.nativeEvent.data);
        } catch (error) {
            data = event.nativeEvent.data;
        }

        if (data && data.Type === 'E_FILE' && data.Data?.Blob && data.Data?.Name) {
            let uriBase64 = data.Data.Blob,
                uriName = data.Data.Name;
            // eslint-disable-next-line no-useless-escape
            let cleanedFileName = uriName.replace(/__.*(?=\.[^\.]+$)/, '');
            this.downloadFile(uriBase64, cleanedFileName);
        }
    };

    downloadFile = async (uriBase64, fileName) => {
        try {
            let granted = true;
            // Chỉ kiểm tra quyền trên Android và khi phiên bản Android lớn hơn 33
            if (Platform.OS === 'android') {
                granted = await Vnr_Services.checkVersionDeviceGreaterThan33();
            }
            if (granted) {
                ManageFileSevice.DownloadFileBase64(uriBase64, fileName);
            } else {
                Alert.alert('Permission Denied!', 'You need to give storage permission to download the file');
            }
        } catch (err) {
            ToasterSevice.showError('HRM_Payroll_ErrorInProcessing', 5000);
        }
    };
    render() {
        const { isModalVisible, menuData, reportID, uriPor } = this.state;
        let viewListItem = <View />;

        const _dataVnrStorage = getDataVnrStorage(),
            { currentUser } = _dataVnrStorage;

        const INJECTED_JAVASCRIPT = `
                (function () {
                    function waitForAngularAndInit() {
                        if (window.angular && angular.element(document.body).injector()) {
                            // Angular đã tải hoàn tất, gọi hàm initChartApp
                            initChartApp('${reportID}', '${currentUser?.headers?.tokenportalapp}');
                        } else {
                            // Angular chưa sẵn sàng, kiểm tra lại sau 100ms
                            setTimeout(waitForAngularAndInit, 100);
                        }
                    }
                    waitForAngularAndInit();
                })();
                true;
        `;

        if (menuData && menuData.length > 0) {
            viewListItem = (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={menuData}
                    extraData={this.state}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            onPress={() => this.toggleIsCheckItem(index, item.ID)}
                            //style={{backgroundColor:Colors.grey}}
                            activeOpacity={1}
                            underlayColor={Colors.greySecondaryConstraint}
                        >
                            <View style={styles.styViewItemOptions}>
                                <View style={CustomStyleSheet.flex(9.3)}>
                                    <Text style={[styleSheets.text]}>{item.Name}</Text>
                                </View>
                                <View style={[CustomStyleSheet.flex(0.7), CustomStyleSheet.alignItems('flex-end')]}>
                                    {item.isSelect ? (
                                        <IconRadioCheck size={Size.iconSize} color={Colors.primary} />
                                    ) : (
                                        <IconRadioUnCheck size={Size.iconSize} color={Colors.grey} />
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id}
                />
            );
        }

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styles.styContainer]}>
                    <View style={styles.styViewBtnFullScreen}>
                        <TouchableOpacity style={styles.styBtnFullScreen} onPress={() => this.openModal()}>
                            <Image
                                source={require('../../../../assets/images/hreRecruitment/ReportOptionBtn.png')}
                                style={styles.styImgEmpty}
                                resizeMode={'contain'}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.containerGrey]}>
                        <WebView
                            ref={(ref) => (this.refWeb = ref)}
                            style={CustomStyleSheet.flex(1)}
                            cacheEnabled={false}
                            setDisplayZoomControls={false} // android only
                            source={{
                                uri: `${uriPor}/New_Home/Chart_App_Mobile`
                            }}
                            //scalesPageToFit={Platform.OS === 'android' ? false : true}
                            incognito={true}
                            startInLoadingState={true}
                            javaScriptEnabled={true}
                            injectedJavaScript={INJECTED_JAVASCRIPT}
                            scrollEnabled={true}
                            renderLoading={() => (
                                // eslint-disable-next-line react-native/no-inline-styles
                                <View style={{ alignSelf: 'center' }}>
                                    <VnrLoading size="large" color={Colors.primary} />
                                </View>
                            )}
                            onError={() => {}}
                            onLoad={() => {}}
                        />
                    </View>
                    {/* Modal chọn loại báo cáo biểu đồ */}
                    <Modal
                        onBackButtonPress={() => this.closeModal()}
                        isVisible={isModalVisible}
                        customBackdrop={
                            <TouchableWithoutFeedback onPress={() => this.closeModal()}>
                                <View style={styles.styBackdropModal} />
                            </TouchableWithoutFeedback>
                        }
                        animationIn="slideInUp" // Hiệu ứng khi modal hiển thị (hiệu ứng từ phía dưới lên)
                        animationOut="slideOutDown" // Hiệu ứng khi modal ẩn đi (hiệu ứng từ phía trên xuống)
                        style={CustomStyleSheet.margin(0)}
                    >
                        <TouchableWithoutFeedback
                            style={styles.styViewContainerModal}
                            onPress={() => this.closeModal()}
                        >
                            <View style={[styles.styViewContentModal]}>
                                <View style={CustomStyleSheet.flex(1)}>{viewListItem}</View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                </View>
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

export default connect(mapStateToProps, null)(RecruitmentReport);

const HIGHT_BTN = Size.deviceWidth >= 1024 ? 60 : Size.deviceWidth * 0.17,
    // WIDTH_LEFT_CALENDAR = (Size.deviceWidth - Size.defineSpace * 2) * 0.63,
    WIDTH_RIGHT_CALENDAR = (Size.deviceWidth - Size.defineSpace * 2) * 0.37;
const styles = StyleSheet.create({
    containerGrey: {
        flex: 1
    },
    styViewItemOptions: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        minHeight: 50,
        alignItems: 'center',
        marginHorizontal: Size.defineSpace,
        marginBottom: 2,
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5
    },
    styViewContentModal: {
        backgroundColor: Colors.white,
        height: Size.deviceheight * 0.5,
        width: Size.deviceWidth,
        position: 'absolute',
        paddingTop: 16,
        bottom: 0,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },
    styBackdropModal: { flex: 1, backgroundColor: Colors.black, opacity: 0.5 },
    styViewContainerModal: { flex: 1, backgroundColor: Colors.white },
    // styBottomModal: {
    //     width: '100%',
    //     flexDirection: 'row',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     paddingHorizontal: styleSheets.p_10,
    //     minHeight: 60
    // },
    styContainer: {
        position: 'relative',
        top: 0,
        right: 0,
        left: 0,
        height: '100%',
        elevation: 99,
        zIndex: 100,
        flex: 1,
        backgroundColor: Colors.gray_3
    },
    styViewBtnFullScreen: {
        position: 'absolute',
        bottom: Size.defineSpace * 4,
        right: Size.defineSpace,
        alignItems: 'flex-end',
        zIndex: 100
    },
    styBtnFullScreen: {
        width: HIGHT_BTN,
        height: HIGHT_BTN,
        borderRadius: HIGHT_BTN / 2,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.7
    },
    styImgEmpty: {
        width: WIDTH_RIGHT_CALENDAR * 0.65,
        height: WIDTH_RIGHT_CALENDAR * 0.65
    }
});
