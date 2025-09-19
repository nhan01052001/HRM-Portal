/* eslint-disable no-console */
import React, { Component } from 'react';
import { StatusBar, FlatList, ScrollView, View, StyleSheet, Animated, Platform, RefreshControl } from 'react-native';
import { Colors, CustomStyleSheet, Size, styleSheets } from '../../constants/styleConfig';
import HeaderHome from './HeaderHome';
import ItemMain from '../../components/Main/ItemMain';
import DrawerServices from '../../utils/DrawerServices';
import { dataVnrStorage } from '../../assets/auth/authentication';
import { ConfigDashboard } from '../../assets/configProject/ConfigDashboard';
import VnrText from '../../components/VnrText/VnrText';
import Vnr_Function from '../../utils/Vnr_Function';
// import { SafeAreaView } from 'react-navigation';
import { SafeAreaView, SafeAreaConsumer } from 'react-native-safe-area-context';
import { EnumTask } from '../../assets/constant';
import { connect } from 'react-redux';
import { ConfigVersionBuild } from '../../assets/configProject/ConfigVersionBuild';
import badgesNotification from '../../redux/badgesNotification';
import { PermissionForAppMobile } from '../../assets/configProject/PermissionForAppMobile';
import VnrIndeterminate from '../../components/VnrLoading/VnrIndeterminate';
import HreEventCalendarHome from '../modules/humanResource/hreEventCalendar/HreEventCalendarHome';
import { VnrBalloonService } from '../../components/VnrBalloon/VnrBalloonHome';
import VnrUpdateAppAtHome from '../../components/modalUpdateVersion/VnrUpdateAppAtHome';
import update from '../../redux/update';

const PADDING = Size.deviceWidth >= 1024 ? Size.defineSpace : 10;

const TABAR_HEIGHT =
        Size.deviceWidth <= 320
            ? Size.deviceheight * 0.09
            : Platform.OS === 'android'
                ? Size.deviceheight * 0.08
                : Size.deviceheight * 0.1,
    HEIGHT_SEARCH = Size.deviceheight >= 1024 ? 57 : 47;

const api = {};
export const DashboardApi = api;

class HomeScene extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataDashboard: [],
            _topNavigate: dataVnrStorage.topNavigate.slice(0, 4),
            heightAllow: 0,
            refreshing: false,
            isShowUpdate: true
        };

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            if (DrawerServices.getBeforeScreen() === 'MessageChatBot') {
                VnrBalloonService.hide();
            }
            DrawerServices.closeDrawer();
        });
        this.distanceTopSearch = HEIGHT_SEARCH + 50;
        this.heightViewLableButton = 0;
        this.heightContent = null;
        this.refHeaerSearch = null;
    }

    UNSAFE_componentWillMount() {
        this.scrollY = new Animated.Value(0);
    }

    componentWillUnmount() {
        this.willFocusScreen.remove();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.reloadScreenName == EnumTask.KT_Permission_RequestDataConfig) {
            const dashboard = ConfigDashboard.value;
            if (dashboard && Array.isArray(dashboard) && !Vnr_Function.compare(dashboard, this.state.dataDashboard)) {
                this.setState({
                    dataDashboard: [...dashboard]
                });
            }
        }

        if (
            nextProps.countNumbersApprove !== null &&
            nextProps.countNumbersApprove !== this.props.countNumbersApprove
        ) {
            this.handleNumberApprove(nextProps.countNumbersApprove);
        }
    }

    componentDidMount() {
        // setTimeout(() => {
        //   // === hide plashScreen === /
        //   SplashScreen.hide();
        // }, 0);
        // const dataStorage = await SInfoService.getItem('E_SAVE_PASSWORD')
        // console.log(dataStorage, 'dataStorage')
        api.reloadDashboard = this.reloadDashboard.bind(this);
        api.reGetCountApp = this._handleRefresh.bind(this);
        // api.requestCountApproveBusiness = this.requestCountApproveBusiness.bind(this)
        this.reloadDashboard();

        // count number approve
        this.requestCountApproveBusiness();
    }

    handleNumberApprove = (dataCount) => {
        const dashboard = ConfigDashboard.value;

        if (typeof dataCount == 'object' && Object.keys(dataCount).length > 0) {
            const dashboardHandle = dashboard.map((group) => {
                group.listGroup = group.listGroup.map((item) => {
                    let valueField = item.countWaitApprove;
                    if (valueField && dataCount[valueField] != null) {
                        item = {
                            ...item,
                            countNumApprove: dataCount[valueField]
                        };
                    }
                    return item;
                });

                return group;
            });

            this.setState({
                dataDashboard: dashboardHandle,
                refreshing: false
            });
        } else {
            this.setState({
                refreshing: false
            });
        }
    };

    requestCountApproveBusiness = () => {
        const { fetchCountNumberApproveInfo } = this.props;
        fetchCountNumberApproveInfo &&
            typeof fetchCountNumberApproveInfo == 'function' &&
            fetchCountNumberApproveInfo();
    };

    reloadDashboard = () => {
        console.disableYellowBox = true;
        if (Platform.OS == 'android') {
            StatusBar.setBackgroundColor(Colors.white, true);
        }
        StatusBar.setBarStyle('dark-content');
        const dashboard = ConfigDashboard.value;

        // Test App Vui.
        if (ConfigVersionBuild.value == '080918' && dashboard[2]) {
            dashboard[2].listGroup.push({
                id: 'A5A22921-168S-497F-9C08-073A8228F6H5',
                type: 'E_SCREEN',
                title: 'Vui App',
                urlIcon: 'https://eportal.vnresource.net/Content/images/icons/menu/logo_vui_app.png',
                screenName: 'AppVui'
            });
        }

        if (dashboard && Array.isArray(dashboard)) {
            this.setState({
                dataDashboard: [...dashboard]
            });
        }
    };

    handleScroll = (event) => {
        let posY = event.nativeEvent.contentOffset.y;
        if (posY < -20) {
            this.refHeaerSearch && this.refHeaerSearch.focusInputSearch && this.refHeaerSearch.focusInputSearch();
        }
        if (posY < this.oldPosY && posY < HEIGHT_SEARCH) {
            this.refScroll && this.refScroll.scrollTo({ x: 0, y: 0, animated: true });
        }

        if (this.oldPosY < posY && posY < HEIGHT_SEARCH && posY > 0) {
            this.refScroll && this.refScroll.scrollTo({ x: 0, y: HEIGHT_SEARCH, animated: true });
        }
    };

    renderItem = (item, index) => {
        // countWaitApprove
        try {
            //check thông tin cá nhân
            if (item['screenName'] != undefined && item['screenName'] == 'ProfileInfo') {
                //set lại title = tên nhân viên và avatar
                item.title = dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info.FullName : '';
                item.urlIcon = item.urlIcon != null ? item.urlIcon : dataVnrStorage.currentUser.info.ImagePath;
            }

            let countNumApprove = item.countNumApprove;
            if (this.state.refreshing) {
                countNumApprove = undefined;
            }

            return (
                <ItemMain
                    key={item.resource && item.resource.name ? item.resource.name : index}
                    index={index}
                    title={item.title}
                    countWaitApprove={item.countWaitApprove}
                    urlIcon={{ uri: item.urlIcon }}
                    screenName={item.screenName}
                    countNumApprove={countNumApprove}
                    nav={item}
                />
            );
        } catch (error) {
            return null;
        }
    };

    renderDashboard = (dashboard) => {
        let isNewLayoutV3 = false;
        if (dataVnrStorage.apiConfig?.uriCenter && dataVnrStorage.apiConfig?.uriIdentity) {
            isNewLayoutV3 = true;
        }

        return dashboard.map((item, index) => {
            if (item.type === 'E_GROUP') {
                if (isNewLayoutV3 == false) item.listGroup = item.listGroup.filter((e) => e.isNewLayoutV3 != true);

                //check group có item
                if (item.listGroup && item.listGroup.length) {
                    //retun render Group
                    return (
                        <View key={item.title} style={styleItemGroup.styleViewContainer}>
                            <View style={styleItemGroup.styleViewItem}>
                                <View style={styleItemGroup.styleView}>
                                    <View style={styleItemGroup.styleView_TitleGroup}>
                                        <VnrText
                                            style={[styleSheets.text, styleItemGroup.styleText]}
                                            i18nKey={item['title']}
                                        />

                                        {item['description'] && (
                                            <VnrText
                                                style={[styleSheets.text, styleItemGroup.styleTextTitle]}
                                                i18nKey={item['description']}
                                            />
                                        )}
                                    </View>
                                </View>

                                <FlatList
                                    scrollEnabled={false}
                                    style={CustomStyleSheet.marginBottom(15)}
                                    data={item.listGroup}
                                    numColumns={Size.deviceWidth <= 320 ? 3 : 4}
                                    columnWrapperStyle={{
                                        marginTop: PADDING * 0.5,
                                        marginBottom: PADDING * 0.5,
                                        paddingHorizontal: Size.defineSpace
                                    }}
                                    renderItem={({ item, index }) => this.renderItem(item, index)}
                                    keyExtractor={(item, index) => {
                                        return item.resource && item.resource.name ? item.resource.name : index;
                                    }}
                                />
                            </View>
                        </View>
                    );
                }

                //không có item trong list group
                else {
                    return <View />;
                }
            }
            //render screen
            else {
                return this.renderItem(item, index);
            }
        });
    };

    onLayoutViewScroll = (ev) => {
        if (this.heightContent != null) {
            const heightView = ev.nativeEvent.layout.height - (HEIGHT_SEARCH + TABAR_HEIGHT);
            const HEIGHT_ALLOW_CONTENT = heightView;

            this.setState({
                heightAllow: HEIGHT_ALLOW_CONTENT
            });
        }
    };

    _handleRefresh = () => {
        this.setState({ refreshing: true });
        // Lấy số dòng chờ duyệt
        this.requestCountApproveBusiness();
        this.reloadDashboard();

        // lấy lại số dòng thông báo của chuông
        this.getCountNumberNotify();
    };

    getCountNumberNotify = () => {
        const { fetchCountNotifyInfo } = this.props;
        if (
            PermissionForAppMobile.value &&
            PermissionForAppMobile.value &&
            PermissionForAppMobile.value['New_Feature_Notification_Tabbar'] &&
            PermissionForAppMobile.value['New_Feature_Notification_Tabbar']['View'] &&
            fetchCountNotifyInfo &&
            typeof fetchCountNotifyInfo == 'function'
        ) {
            fetchCountNotifyInfo();
        }
    };

    render() {
        const { dataDashboard, refreshing, isShowUpdate } = this.state;
        const { status, progress, isUpdateLater, closeupdate } = this.props;
        return (
            <SafeAreaView style={[stylesSearch.contentHome]}>
                <SafeAreaConsumer>
                    {(insets) => (
                        <View style={stylesSearch.styViewScoll}>
                            <ScrollView
                                //bounces={false} // không pulltoRefresh

                                ref={(ref) => (this.refScroll = ref)}
                                showsVerticalScrollIndicator={false}
                                refreshControl={
                                    <RefreshControl
                                        onRefresh={() => this._handleRefresh()}
                                        refreshing={refreshing}
                                        size="large"
                                        tintColor={Colors.primary}
                                    />
                                }
                                contentContainerStyle={[
                                    stylesSearch.styContentScoll,
                                    { paddingBottom: TABAR_HEIGHT - insets.bottom }
                                ]}
                            >
                                {isShowUpdate && <View style={styleItemGroup.line} />}
                                {isUpdateLater && (
                                    <VnrUpdateAppAtHome
                                        progress={progress}
                                        status={status}
                                        onClose={closeupdate}
                                    />
                                )}
                                {Platform.OS == 'android' && <VnrIndeterminate isVisible={refreshing} />}
                                {PermissionForAppMobile &&
                                    PermissionForAppMobile.value &&
                                    PermissionForAppMobile.value['Att_Event_Calendar_Mobile'] &&
                                    PermissionForAppMobile.value['Att_Event_Calendar_Mobile']['View'] && (
                                    <HreEventCalendarHome />
                                )}

                                <View onLayout={(ev) => (this.heightContent = ev.nativeEvent.layout.height)}>
                                    {this.renderDashboard(dataDashboard)}
                                </View>
                            </ScrollView>
                        </View>
                    )}
                </SafeAreaConsumer>
                <HeaderHome ref={(refs) => (this.refHeaerSearch = refs)} />
            </SafeAreaView>
        );
    }
}

const styleItemGroup = StyleSheet.create({
    styleViewContainer: {
        width: Size.deviceWidth,
        zIndex: 1,
        backgroundColor: Colors.gray_3,
        paddingTop: 15
    },
    styleViewItem: {
        backgroundColor: Colors.white
    },
    styleView: {},
    styleView_TitleGroup: {
        padding: Size.defineSpace,
        paddingBottom: 0
    },
    styleText: {
        textTransform: 'uppercase',
        color: Colors.primary,
        fontWeight: Platform.OS == 'android' ? '700' : '600',
        fontSize: Size.text + 3
    },
    styleTextTitle: {
        color: Colors.gray_7,
        fontWeight: Platform.OS == 'android' ? '400' : '600',
        fontSize: Size.text
    },
    line: {
        width: '100%',
        height: 15,
        backgroundColor: Colors.gray_3
    }
});

const stylesSearch = StyleSheet.create({
    contentHome: {
        flex: 1,
        backgroundColor: Colors.white
    },
    styViewScoll: {
        flex: 1
    },
    styContentScoll: {
        flexGrow: 1,
        paddingTop: HEIGHT_SEARCH + 20
    }
});

const mapStateToProps = (state) => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message,
        countNumbersApprove: state.badgesNotification.countNumbersApprove,
        // Update app
        isUpdateLater: state.update.isUpdateLater,
        progress: state.update.progress,
        status: state.update.status
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchCountNumberApproveInfo: () => {
            dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());
        },
        fetchCountNotifyInfo: () => {
            dispatch(badgesNotification.actions.fetchCountNotifyInfo());
        },
        closeupdate: () => {
            dispatch(update.actions.setIsUpdateLater(false));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScene);
