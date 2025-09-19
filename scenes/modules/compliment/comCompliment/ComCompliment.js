import React, { Component } from 'react';
import {
    Image,
    View,
    TouchableOpacity,
    StyleSheet,
    Text,
    AppState,
    ScrollView,
    RefreshControl,
    Platform
} from 'react-native';
import { Colors, Size, styleSheets, styleSafeAreaView, CustomStyleSheet } from '../../../../constants/styleConfig';
import { dataVnrStorage } from '../../../../assets/auth/authentication';
import generalProfileInfo from '../../../../redux/generalProfileInfo';
import { IconCancel, IconUser, IconPlus, IconQuestion } from '../../../../constants/Icons';
import VnrText from '../../../../components/VnrText/VnrText';
import { SafeAreaView } from 'react-navigation';
import languageReducer from '../../../../redux/i18n';
import { connect } from 'react-redux';
import HttpService from '../../../../utils/HttpService';
import VnrLoading from '../../../../components/VnrLoading/VnrLoading';
import { translate } from '../../../../i18n/translate';
import Modal from 'react-native-modal';
import ComComplimentAddOrEdit from './ComComplimentAddOrEdit';
import { VnrLoadingSevices } from '../../../../components/VnrLoading/VnrLoadingPages';
import { WebView } from 'react-native-webview';
import styleComonAddOrEdit from '../../../../constants/styleComonAddOrEdit';
import DrawerServices from '../../../../utils/DrawerServices';
import { ScreenName } from '../../../../assets/constant';
import { HistoryOfComComplimentBusinessFunction } from '../historyOfComCompliment/HistoryOfComComplimentBusiness';
import ComComplimentExchange from './ComComplimentExchange';

class ComCompliment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                TotalGivenProfile: 0,
                RootCumulativePoint: 0, //điểm được khen
                totalGivenProfile: 0, //người khen ngợi
                IssuedPoint: 0, //Điểm cấp phát
                CurrentCumulativePoint: 0, //Điểm tích lũy
                ComplimentRank: 0 //Top,
                ///
                // totalPraised: 0,
                // totalPraisedBy: 0,
                // totalExchange: 0
            },
            dataPraised: {
                isLoading: false,
                data: 0,
                isVisibleModal: false
            },
            dataPraisedBy: {
                isLoading: false,
                data: 0,
                isVisibleModal: false
            },
            dataExchange: {
                isLoading: false,
                data: 0,
                isVisibleModal: false
            },
            linkPolicy: {
                uri: null,
                isVisibleModal: false
            },
            isVisibleCreate: false,
            refreshing: false
        };

        this.ComComplimentAddOrEdit = null;
        this.ComComplimentExchange = null;

        props.navigation.setParams({
            headerRight: (
                <TouchableOpacity onPress={() => this.showPolicy()}>
                    <View style={styleSheets.bnt_HeaderRight}>
                        <IconQuestion color={Colors.blue} size={Size.iconSizeHeader} />
                    </View>
                </TouchableOpacity>
            )
        });

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            // Trường hợp goBack từ detail thì phải gán lại this
            if (HistoryOfComComplimentBusinessFunction.checkForReLoadScreen[ScreenName.ComCompliment]) {
                this.reload();
            }
        });
    }

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    componentDidMount() {
        this.getDataHeader();
    }

    showPolicy = () => {
        const { linkPolicy } = this.state;
        VnrLoadingSevices.show();
        HttpService.Get('[URI_POR]/Portal/GetPolicyHtml').then((data) => {
            VnrLoadingSevices.hide();

            if (data && data.filePath) {
                let path = HttpService.handelUrl(`[URI_POR]${data.filePath}`);
                this.setState({
                    linkPolicy: {
                        ...linkPolicy,
                        uri: path,
                        isVisibleModal: true
                    }
                });
            }
        });
    };

    closeModalPolicy = () => {
        this.setState({
            linkPolicy: {
                uri: null,
                isVisibleModal: false
            }
        });
    };

    reload = () => {
        this.getDataHeader();
    };

    onCreate = () => {
        if (this.ComComplimentAddOrEdit && this.ComComplimentAddOrEdit.onShow) {
            this.showHideBtnCreate(false);
            this.ComComplimentAddOrEdit.onShow({
                reload: this.reload,
                record: null
            });
        }
    };

    onExChange = () => {
        if (this.ComComplimentExchange && this.ComComplimentExchange.onShow) {
            this.showHideBtnCreate(false);
            this.ComComplimentExchange.onShow({
                reload: this.reload,
                CurrentCumulativePoint: this.state.data?.CurrentCumulativePoint,
                record: null
            });
        }
    };

    getDataHeader = () => {
        const profileID = dataVnrStorage.currentUser.info.ProfileID;
        const { dataPraised, dataPraisedBy, dataExchange } = this.state,
            dataBody = {
                ProfileID: profileID,
                ValueFields: 'id,ProfileName,CriteriaName,RecordDate,Point,Note',
                IsPortal: true,
                // sort: orderBy,
                page: 1,
                pageSize: 1
            };

        this.setState({
            dataPraised: {
                ...dataPraised,
                isLoading: true,
                data: null
            },
            dataPraisedBy: {
                ...dataPraisedBy,
                isLoading: true,
                data: null
            },
            dataExchange: {
                ...dataExchange,
                isLoading: true,
                data: null
            },
            refreshing: false
        });

        HttpService.Get(`[URI_HR]/Com_GetData/GetEmpPointForMaster?ProfileID=${profileID}`).then((data) => {
            if (data) {
                this.setState({
                    data: {
                        TotalGivenProfile: data.TotalGivenProfile ? data.TotalGivenProfile : 0,
                        RootCumulativePoint: data.RootCumulativePoint ? data.RootCumulativePoint : 0,
                        totalGivenProfile: data.totalGivenProfile ? data.totalGivenProfile : 0,
                        IssuedPoint: data.IssuedPoint ? data.IssuedPoint : 0,
                        CurrentCumulativePoint: data.CurrentCumulativePoint ? data.CurrentCumulativePoint : 0,
                        ComplimentRank: data.ComplimentRank ? data.ComplimentRank : 0
                        ///
                        // totalPraised: resPraised && resPraised.SumPoint ? resPraised.SumPoint : 0,
                        // totalPraisedBy: resPraisedBy && resPraisedBy.SumPoint ? resPraisedBy.SumPoint : 0,
                        // totalExchange: resExchange && resExchange.SumPoint ? resExchange.SumPoint : 0,
                    }
                });
            }
        });

        HttpService.Post('[URI_HR]/Com_GetData/GetComplimentHistoryPraised', dataBody).then((data) => {
            if (data) {
                this.setState({
                    dataPraised: {
                        ...dataPraised,
                        isLoading: false,
                        data: data.SumPoint ? data.SumPoint : 0
                    }
                });
            }
        });

        HttpService.Post('[URI_HR]/Com_GetData/GetComplimentHistoryPraisedBy', dataBody).then((data) => {
            if (data) {
                this.setState({
                    dataPraisedBy: {
                        ...dataPraisedBy,
                        isLoading: false,
                        data: data.SumPoint ? data.SumPoint : 0
                    }
                });
            }
        });

        HttpService.Post('[URI_HR]/Com_GetData/GetComplimentHistoryExchange', dataBody).then((data) => {
            if (data) {
                this.setState({
                    dataExchange: {
                        ...dataExchange,
                        isLoading: false,
                        data: data.SumPoint ? data.SumPoint : 0
                    }
                });
            }
        });
    };

    router = (roouterName) => {
        const { navigation } = this.props;
        navigation.navigate(roouterName);
    };

    showHideBtnCreate = (bool) => {
        this.setState({ isVisibleCreate: bool });
    };

    render() {
        const {
            data,
            dataPraised,
            dataPraisedBy,
            dataExchange,
            isVisibleCreate,
            linkPolicy,
            refreshing
        } = this.state;

        return (
            <SafeAreaView {...styleSafeAreaView} style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            onRefresh={() => {
                                this.setState(
                                    {
                                        refreshing: true
                                    },
                                    () => {
                                        this.getDataHeader();
                                    }
                                );
                            }}
                            refreshing={refreshing}
                            size="large"
                            tintColor={Colors.primary}
                        />
                    }
                >
                    <View style={styles.styTopImg}>
                        <View style={styles.styViewImgAvatar}>
                            <Image
                                // resizeMode={'}
                                source={require('../../../../assets/images/compliment/top_1.png')}
                                style={styles.stywImgTop}
                            />

                            <Text style={[styleSheets.lable, styles.styTextTopImg]}>
                                {data.ComplimentRank < 100000 ? data.ComplimentRank : 99999}
                            </Text>
                        </View>

                        <View style={styles.styViewTopInfo}>
                            <Text style={[styleSheets.text, styles.styTextTop]}>
                                {`${data.TotalGivenProfile} ${translate('HRM_PortalApp_Compliment_People')}`}
                            </Text>
                            <Text style={[styleSheets.text, styles.styTextDotTop]}>{'  •  '}</Text>
                            <Text style={[styleSheets.text, styles.styTextTop]}>
                                {`${data.RootCumulativePoint} ${translate('HRM_PortalApp_Compliment_PointsRewarded')}`}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.styContentHeader}>
                        <View style={styles.viewAvatar}>
                            <View style={styles.avatar}>
                                <Image
                                    source={require('../../../../assets/images/compliment/star_1.png')}
                                    style={styles.imgAvatar}
                                />
                            </View>

                            <View style={styles.viewInfo}>
                                <VnrText
                                    numberOfLines={2}
                                    style={[styleSheets.text, styles.textLableInfo]}
                                    i18nKey={'HRM_PortalApp_Compliment_Distribute'}
                                />
                                <VnrText
                                    style={[styleSheets.lable, styles.textValueInfo]}
                                    value={`${data.IssuedPoint} ${translate('HRM_PortalApp_Compliment_Point')}`}
                                />
                            </View>
                        </View>

                        <View style={styles.viewAvatarBorder} />

                        <View style={styles.viewAvatar}>
                            <View style={styles.avatar}>
                                <Image
                                    source={require('../../../../assets/images/compliment/star_2.png')}
                                    style={styles.imgAvatar}
                                />
                            </View>

                            <View style={styles.viewInfo}>
                                <VnrText
                                    numberOfLines={2}
                                    style={[styleSheets.text, styles.textLableInfo]}
                                    i18nKey={'HRM_PortalApp_Compliment_Accumulated'}
                                />
                                <VnrText
                                    style={[styleSheets.lable, styles.textValueInfo]}
                                    value={`${data.CurrentCumulativePoint} ${translate(
                                        'HRM_PortalApp_Compliment_Point'
                                    )}`}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.styTileLable}>
                        <VnrText
                            style={[styleSheets.lable, styles.styTileLableText]}
                            i18nKey={'HRM_PortalApp_Compliment_History'}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.bnt_action}
                        onPress={() => {
                            DrawerServices.navigate('HistoryOfComComplimenting');
                        }}
                    >
                        <View style={styles.bnt_action__left}>
                            <View style={styles.bnt_action__IconLeft}>
                                <Image
                                    source={require('../../../../assets/images/compliment/PraisedBy.png')}
                                    style={styles.styIconLeft}
                                />
                            </View>
                            <VnrText
                                style={[styleSheets.text, styles.bnt_action__text]}
                                i18nKey={'HRM_PortalApp_Compliment_PraisedBy'}
                            />
                        </View>

                        {dataPraisedBy.isLoading ? (
                            <VnrLoading size="small" color={Colors.primary} style={{}} />
                        ) : (
                            <VnrText
                                style={[styleSheets.lable, styles.bnt_action__text]}
                                value={`${dataPraisedBy.data} ${translate('HRM_PortalApp_Compliment_Point')}`}
                            />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.bnt_action}
                        onPress={() => {
                            DrawerServices.navigate('HistoryOfComComplimented');
                        }}
                    >
                        <View style={styles.bnt_action__left}>
                            <View style={styles.bnt_action__IconLeft}>
                                <Image
                                    source={require('../../../../assets/images/compliment/Praised.png')}
                                    style={styles.styIconLeft}
                                />
                            </View>
                            <VnrText
                                style={[styleSheets.text, styles.bnt_action__text]}
                                i18nKey={'HRM_PortalApp_Compliment_Praised'}
                            />
                        </View>

                        {dataPraised.isLoading ? (
                            <VnrLoading size="small" color={Colors.primary} style={{}} />
                        ) : (
                            <VnrText
                                style={[styleSheets.lable, styles.bnt_action__text]}
                                value={`${dataPraised.data} ${translate('HRM_PortalApp_Compliment_Point')}`}
                            />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.bnt_action}
                        onPress={() => {
                            DrawerServices.navigate('HistoryConversion');
                        }}
                    >
                        <View style={styles.bnt_action__left}>
                            <View style={styles.bnt_action__IconLeft}>
                                <Image
                                    source={require('../../../../assets/images/compliment/Exchange.png')}
                                    style={styles.styIconLeft}
                                />
                            </View>
                            <VnrText
                                style={[styleSheets.text, styles.bnt_action__text]}
                                i18nKey={'HRM_PortalApp_Compliment_Exchange'}
                            />
                        </View>

                        {dataExchange.isLoading ? (
                            <VnrLoading size="small" color={Colors.primary} style={{}} />
                        ) : (
                            <VnrText
                                style={[styleSheets.lable, styles.bnt_action__text]}
                                value={`${dataExchange.data} ${translate('HRM_PortalApp_Compliment_Point')}`}
                            />
                        )}
                    </TouchableOpacity>

                    <View style={styles.styTileLable}>
                        <VnrText
                            style={[styleSheets.lable, styles.styTileLableText]}
                            i18nKey={'HRM_PortalApp_Compliment_Rank'}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.bnt_action}
                        onPress={() => {
                            DrawerServices.navigate('RankingPersonal');
                        }}
                    >
                        <View style={styles.bnt_action__left}>
                            <View style={styles.bnt_action__IconLeft}>
                                <IconUser size={Size.iconSize - 2} color={Colors.gray_10} />
                            </View>
                            <VnrText
                                style={[styleSheets.text, styles.bnt_action__text]}
                                i18nKey={'HRM_PortalApp_Compliment_Personal'}
                            />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.bnt_action}
                        onPress={() => {
                            DrawerServices.navigate('RankingPeopleGiving');
                        }}
                    >
                        <View style={styles.bnt_action__left}>
                            <View style={styles.bnt_action__IconLeft}>
                                <Image
                                    source={require('../../../../assets/images/compliment/Individual.png')}
                                    style={styles.styIconLeft}
                                />
                            </View>
                            <VnrText
                                style={[styleSheets.text, styles.bnt_action__text]}
                                i18nKey={'HRM_PortalApp_Compliment_Individual'}
                            />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.bnt_action}
                        onPress={() => {
                            DrawerServices.navigate('RankingCriteria');
                        }}
                    >
                        <View style={styles.bnt_action__left}>
                            <View style={styles.bnt_action__IconLeft}>
                                <Image
                                    source={require('../../../../assets/images/compliment/Criteria.png')}
                                    style={styles.styIconLeft}
                                />
                            </View>
                            <VnrText
                                style={[styleSheets.text, styles.bnt_action__text]}
                                i18nKey={'HRM_PortalApp_Compliment_Criteria'}
                            />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.bnt_action}
                        onPress={() => {
                            DrawerServices.navigate('RankingDepartment');
                        }}
                    >
                        <View style={styles.bnt_action__left}>
                            <View style={styles.bnt_action__IconLeft}>
                                <Image
                                    source={require('../../../../assets/images/compliment/Department.png')}
                                    style={styles.styIconLeft}
                                />
                            </View>
                            <VnrText
                                style={[styleSheets.text, styles.bnt_action__text]}
                                i18nKey={'HRM_PortalApp_Compliment_Department'}
                            />
                        </View>
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                        style={styles.bnt_Gift}
                        onPress={() => { DrawerServices.navigate("GiftComCompliment", {
                            point: data?.CurrentCumulativePoint
                        }) }}>
                        <View style={styles.bnt_action__IconLeft}>
                            <Image
                                source={require('../../../../assets/images/compliment/gift_2.png')}
                                style={styles.styGiftLeft}
                            />
                        </View>
                        <VnrText
                            style={[styleSheets.lable]}
                            i18nKey={'HRM_PortalApp_Compliment_ChangeGift'}
                        />

                    </TouchableOpacity> */}
                </ScrollView>

                <ComComplimentAddOrEdit ref={(refs) => (this.ComComplimentAddOrEdit = refs)} />
                <ComComplimentExchange ref={(refs) => (this.ComComplimentExchange = refs)} />

                {isVisibleCreate && (
                    <Modal visible={true} style={CustomStyleSheet.margin(0)}>
                        <View style={styles.styViewCreate}>
                            <View style={styles.styViewBtnCreate}>
                                <TouchableOpacity style={styles.styBtnCreate} onPress={() => this.onExChange()}>
                                    <VnrText
                                        style={[styleSheets.text, styles.styBtnCreatetext]}
                                        i18nKey={'HRM_PortalApp_Compliment_Exchange'}
                                    />
                                    <View style={styles.styBtnCreateRight}>
                                        <Image
                                            source={require('../../../../assets/images/compliment/gift.png')}
                                            style={styles.styBtnCreateIcon}
                                        />
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.styBtnCreate} onPress={() => this.onCreate()}>
                                    <VnrText
                                        style={[styleSheets.text, styles.styBtnCreatetext]}
                                        i18nKey={'HRM_PortalApp_Compliment_SendAppreciation'}
                                    />
                                    <View style={styles.styBtnCreateRight}>
                                        <Image
                                            source={require('../../../../assets/images/compliment/love.png')}
                                            style={styles.styBtnCreateIcon}
                                        />
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.styBtnCreate}
                                    onPress={() => this.showHideBtnCreate(false)}
                                >
                                    <View style={styles.styBtnCreateIconWhite}>
                                        <IconCancel size={Size.iconSize} color={Colors.black} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                )}

                {!isVisibleCreate && (
                    <View style={styles.styViewBtnCreate}>
                        <TouchableOpacity style={styles.styBtnAdd} onPress={() => this.showHideBtnCreate(true)}>
                            <IconPlus size={Size.iconSizeHeader} color={Colors.white} />
                        </TouchableOpacity>
                    </View>
                )}

                {linkPolicy.isVisibleModal && (
                    <Modal visible={true} style={CustomStyleSheet.margin(0)}>
                        <SafeAreaView {...styleSafeAreaView}>
                            <View style={styleComonAddOrEdit.flRowSpaceBetween}>
                                <VnrText
                                    style={[styleSheets.lable, styleComonAddOrEdit.styHeaderText]}
                                    i18nKey={'HRM_PortalApp_Compliment_Policy'}
                                />
                                <TouchableOpacity onPress={() => this.closeModalPolicy()}>
                                    <IconCancel size={Size.iconSize} color={Colors.gray_8} />
                                </TouchableOpacity>
                            </View>

                            <WebView
                                style={CustomStyleSheet.flex(1)}
                                ref={(refWebView) => (this.refWebView = refWebView)}
                                cacheEnabled={false}
                                source={{ uri: linkPolicy.uri.trim() }}
                                scalesPageToFit={true}
                                startInLoadingState={true}
                                scrollEnabled
                                renderLoading={() => (
                                    <View
                                        style={styles.styWebView}
                                    >
                                        <VnrLoading size={'large'} />
                                    </View>
                                )}
                                onLoadStart={() => {
                                    // hàm gọi khi start load
                                    this.canGoback && VnrLoadingSevices.show();
                                }}
                                onLoadEnd={(syntheticEvent) => {
                                    // hàm gọi khi end load
                                    VnrLoadingSevices.hide();
                                    const { nativeEvent } = syntheticEvent;
                                    this.canGoback = nativeEvent.canGoBack;
                                }}
                            />
                        </SafeAreaView>
                    </Modal>
                )}
            </SafeAreaView>
        );
    }
}

const HIGHT_AVATAR = Size.deviceWidth >= 1024 ? 80 : Size.deviceWidth * 0.17,
    HIGHT_STAR = Size.deviceWidth >= 1024 ? 50 : Size.deviceWidth * 0.12,
    HIGHT_BTN = Size.deviceWidth >= 1024 ? 60 : Size.deviceWidth * 0.15;
const styles = StyleSheet.create({
    styWebView: {
        position: 'absolute',
        width: Size.deviceWidth,
        height: Size.deviceheight - Size.headerHeight,
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: Colors.gray_3
    },
    styViewTopInfo: {
        flexDirection: 'row',
        backgroundColor: Colors.gray_3,
        paddingHorizontal: Size.defineHalfSpace,
        paddingVertical: 3,
        borderRadius: 4
    },
    styTopImg: {
        backgroundColor: Colors.white,
        alignItems: 'center',
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5,
        paddingBottom: Size.defineHalfSpace
    },
    styViewImgAvatar: {
        position: 'relative'
        // paddingVertical: Size.defineSpace,
    },
    stywImgTop: {
        width: HIGHT_AVATAR,
        resizeMode: 'contain',
        borderRadius: 18 // HIGHT_AVATAR / 3,
    },
    styTextDotTop: {
        fontSize: Size.text + 5,
        marginTop: -3
    },
    styTextTop: {
        color: Colors.gray_8
    },
    styTextTopImg: {
        position: 'absolute',
        top: HIGHT_AVATAR - Size.text,
        // left: (HIGHT_AVATAR - Size.text) / 2
        alignSelf: 'center'
    },
    viewInfo: {
        flex: 1,
        marginLeft: Size.defineSpace,
        paddingVertical: 3
    },
    styTileLable: {
        paddingVertical: Size.defineHalfSpace,
        paddingHorizontal: Size.defineSpace,
        backgroundColor: Colors.gray_3
    },
    styTileLableText: {
        color: Colors.gray_8,
        fontWeight: Platform.OS == 'android' ? '700' : '500'
    },
    styContentHeader: {
        backgroundColor: Colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
        // paddingHorizontal: Size.defineSpace,
        // borderBottomColor: Colors.gray_5,
        // borderBottomWidth: 0.5,
    },
    viewAvatar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: Size.defineSpace
    },
    viewAvatarBorder: {
        height: '100%',
        backgroundColor: Colors.gray_5,
        width: 1
    },
    avatar: {},
    imgAvatar: {
        width: HIGHT_STAR,
        resizeMode: 'contain'
    },
    textLableInfo: {
        color: Colors.gray_8
    },
    textValueInfo: {
        fontSize: Size.textlarge
    },
    styViewCreate: {
        top: 0,
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: Colors.black_transparent_7
    },
    styViewBtnCreate: {
        position: 'absolute',
        bottom: Size.defineSpace * 3,
        right: Size.defineSpace,
        alignItems: 'flex-end'
    },
    styBtnCreate: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Size.defineSpace
    },
    styBtnCreatetext: {
        color: Colors.white
    },
    styBtnCreateRight: {
        marginLeft: Size.defineSpace
    },
    styBtnCreateIcon: {
        width: HIGHT_BTN,
        height: HIGHT_BTN,
        borderRadius: HIGHT_BTN / 2,
        resizeMode: 'cover'
    },
    styBtnCreateIconWhite: {
        width: HIGHT_BTN,
        height: HIGHT_BTN,
        borderRadius: HIGHT_BTN / 2,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center'
    },
    styBtnAdd: {
        width: HIGHT_BTN,
        height: HIGHT_BTN,
        borderRadius: HIGHT_BTN / 2,
        backgroundColor: Colors.neutralGreen,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Size.defineSpace
    },
    bnt_action: {
        flexDirection: 'row',
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5,
        justifyContent: 'space-between',
        height: Size.deviceWidth * 0.13,
        maxHeight: 70,
        minHeight: 40,
        alignItems: 'center',
        paddingHorizontal: Size.defineSpace,
        backgroundColor: Colors.white
    },
    bnt_action__left: {
        flexDirection: 'row',
        height: '100%',
        alignItems: 'center'
    },
    bnt_action__text: {
        // paddingHorizontal: 5,
    },
    bnt_action__IconLeft: {
        // width: Size.iconSize + 12,
        marginRight: Size.defineHalfSpace
    },

    styIconLeft: {
        width: Size.iconSize - 2,
        height: Size.iconSize - 3
    }
});

const mapStateToProps = (state) => {
    return {
        language: state.languageReducer.language,
        generalProfileInfo: state.generalProfileInfo.data
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setLanguage: (language) => {
            dispatch(languageReducer.actions.changeLanguage(language));
        },
        fetchGeneralProfileInfo: () => {
            dispatch(generalProfileInfo.actions.fetchGeneralProfileInfo());
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ComCompliment);
