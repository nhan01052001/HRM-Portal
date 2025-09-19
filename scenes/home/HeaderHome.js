// import React, { Component } from 'react';
// import {
//     FlatList,
//     ScrollView,
//     Image,
//     View,
//     TouchableOpacity,
//     StyleSheet,
//     Animated,
//     TouchableWithoutFeedback,
//     Platform,
//     Modal
// } from 'react-native';
// import {
//     Colors,
//     Size,
//     styleSheets,
// } from '../../constants/styleConfig';
// import ItemFilterMain from '../../components/Main/ItemFilterMain';
// import DrawerServices from '../../utils/DrawerServices';
// import { dataVnrStorage, updateTopNavigate } from '../../assets/auth/authentication';
// import { ConfigDashboard } from '../../assets/configProject/ConfigDashboard';
// import { IconSearch } from '../../constants/Icons';
// import VnrTextInput from '../../components/VnrTextInput/VnrTextInput';
// import VnrText from '../../components/VnrText/VnrText';
// import { translate } from '../../i18n/translate';
// import Vnr_Function from '../../utils/Vnr_Function';
// import { BlurView } from '@react-native-community/blur';
// import { SafeAreaView } from 'react-navigation';
// import VnrLoading from '../../components/VnrLoading/VnrLoading';

// const PADDING = Size.deviceWidth >= 1024 ? Size.defineSpace : 10,
//     WIDTH_VIEW_BNT_ITEM = Size.deviceWidth <= 320
//         ? (Size.deviceWidth - (Size.defineSpace * 2) - (PADDING * 2) - 3)
//         : (Size.deviceWidth - (Size.defineSpace * 2) - (PADDING * 3) - 4)

// const HEIGHT_SEARCH = Size.deviceheight >= 1024 ? 57 : 47,
//     HEIHGT_BUTTON = Size.deviceheight >= 1024 ? 120 : (Size.deviceWidth <= 320 ? 85 : 95),
//     WIDTH_BUTTON = Size.deviceWidth <= 320 ? WIDTH_VIEW_BNT_ITEM / 3 : WIDTH_VIEW_BNT_ITEM / 4,
//     WIDTH_SEARCH = Size.deviceWidth - (Size.defineSpace * 2),
//     WIDTH_ICON_BUTTON = (WIDTH_BUTTON) * 0.35 >= 50
//         ? 50 : (WIDTH_BUTTON) * 0.35;
// const api = {};
// export const topNavigateApi = api;
// export default class HeaderHome extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             // dataDashboard: [],
//             fullDataDashboard: [],
//             dataDashboardFilter: [],
//             isFilter: false,
//             searchText: '',
//             _topNavigate: [],//dataVnrStorage.topNavigate.slice(0, 4),
//         };

//         this.distanceTopSearch = HEIGHT_SEARCH + 50;
//         this.heightViewLableButton = 0;
//         this.reloadHeader = this.reloadHeader.bind(this)
//     }

//     focusInputSearch = () => {
//         this.setState({ isFilter: true });
//     };

//     handleBlur = () => {
//         this.setState({ isFilter: false });
//     };

//     onShowFilter = () => {
//         const dashboard = ConfigDashboard.value;
//         if (dashboard && Array.isArray(dashboard)) {
//             //translate item in group and set slug
//             dashboard.forEach(item => {

//                 if (item.listGroup && item.listGroup.length) {

//                     let _group = item.listGroup;

//                     //loop items in group
//                     _group.forEach(subItem => {

//                         //translate title
//                         if (subItem.title) {

//                             let _trans = translate(subItem.title),
//                                 _toSlug = Vnr_Function.toSlug(_trans);
//                             //subItem.title = _trans;
//                             subItem.slug = _trans.toLowerCase() + ' ' + _toSlug;
//                         }
//                     });
//                 }
//             });
//             this.setState({
//                 fullDataDashboard: [...dashboard],
//                 dataDashboardFilter: [...dashboard],
//             });
//         }
//     }

//     reloadHeader = () => {
//         const dashboard = ConfigDashboard.value;
//         let { _topNavigate } = this.state;
//         _topNavigate = dataVnrStorage.topNavigate.slice(0, 4);
//         if (dashboard && Array.isArray(dashboard)) {

//             //translate item in group and set slug
//             dashboard.forEach(item => {

//                 if (item.listGroup && item.listGroup.length) {

//                     let _group = item.listGroup;

//                     //loop items in group
//                     _group.forEach(subItem => {

//                         //translate title
//                         if (subItem.title) {

//                             let _trans = translate(subItem.title),
//                                 _toSlug = Vnr_Function.toSlug(_trans);

//                             //subItem.title = _trans;
//                             subItem.slug = _trans.toLowerCase() + ' ' + _toSlug;

//                             //set TopNavigateDefault
//                             if (_topNavigate.length < 4 && subItem.isTopNavigateDefault) {
//                                 let findNav = _topNavigate.find(nav => nav.screenName === subItem.screenName);

//                                 //nếu chưa có thì add vào
//                                 if (!findNav) {
//                                     _topNavigate = [..._topNavigate, { ...subItem }];
//                                 }
//                             }
//                         }
//                     });
//                 }
//             });
//             this.setState({
//                 _topNavigate
//             });
//         }
//     }

//     renderItemFilter = (item, index, lengthData) => {
//         try {
//             //check thông tin cá nhân
//             if (
//                 item['screenName'] != undefined &&
//                 item['screenName'] == 'ProfileInfo'
//             ) {
//                 //set lại title = tên nhân viên và avatar
//                 item.title = dataVnrStorage.currentUser
//                     ? dataVnrStorage.currentUser.info.FullName
//                     : '';
//                 item.urlIcon = dataVnrStorage.currentUser.info.ImagePath;
//             }

//             return (
//                 <ItemFilterMain
//                     key={(item.resource && item.resource.name) ? item.resource.name : index}
//                     index={index}
//                     closeFilter={this.handleBlur}
//                     lengthData={lengthData}
//                     type={item.type}
//                     title={item.title}
//                     urlIcon={item.urlIcon}
//                     screenName={item.screenName}
//                     nav={item}
//                 />
//             );
//         } catch (error) {
//             return null;
//         }
//     }

//     renderDashboardFilter = dashboardFilter => {
//         return dashboardFilter.map((item, i) => {
//             if (item.type === 'E_GROUP') {
//                 //check group có item
//                 if (item.listGroup && item.listGroup.length > 0) {
//                     //retun render Group
//                     const lengthData = item.listGroup.length;
//                     return (
//                         <View>
//                             <View style={styleItemGroup.styleViewTitleFilter}>
//                                 <VnrText
//                                     style={[styleSheets.text, styleItemGroup.styleTitleFilter]}
//                                     i18nKey={item['title']}
//                                 />
//                             </View>

//                             <FlatList
//                                 style={{ marginBottom: 15 }}
//                                 data={item.listGroup}
//                                 renderItem={({ item, index }) => this.renderItemFilter(item, index, lengthData)}
//                                 keyExtractor={(item, index) => index}
//                             />
//                         </View>
//                     );
//                 }
//                 //không có item trong list group
//                 else {
//                     return <View />;
//                 }
//             }
//             //render screen
//             else {
//                 return this.renderItemFilter(item, i);
//             }
//         });
//     }

//     renderTopNav = () => {
//         const { animatedHeader } = this.props,
//             { _topNavigate } = this.state;

//         return _topNavigate.map((nav, index) => {
//             // iphone 5 chỉ hiển thị 3 icon
//             if (Size.deviceWidth <= 320 && index > 2) {
//                 return <View />;
//             }
//             else {
//                 return <TouchableWithoutFeedback
//                     onPress={() => {
//                         DrawerServices.navigate(nav.screenName);
//                         updateTopNavigate({ ...nav }, this.onShowFilter);
//                     }}>
//                     <Animated.View
//                         style={[
//                             stylesSearch.viewButtonIOS,
//                             {
//                                 width: animatedHeader.widthButton,
//                                 height: animatedHeader.heightButton,
//                                 borderWidth: animatedHeader.borderButton,
//                                 opacity: animatedHeader.opacityButton,
//                                 marginRight:
//                                     Size.deviceWidth <= 320
//                                         ? (index + 1) % 3 == 0
//                                             ? 0
//                                             : PADDING
//                                         : (index + 1) % 4 == 0
//                                             ? 0
//                                             : PADDING
//                             }
//                         ]}
//                         onPress={() => this.router(screenName)}
//                         activeOpacity={0.7}>
//                         <View style={stylesSearch.icon}>
//                             <Image
//                                 source={{ uri: nav.urlIcon }}
//                                 //source={require('../../assets/images/GPS/off.png')}
//                                 style={stylesSearch.iconStyle}
//                             />
//                         </View>

//                         <Animated.View
//                             style={[
//                                 stylesSearch.viewLable,
//                                 {
//                                     width: animatedHeader.widthLableText,
//                                     opacity: animatedHeader.opacityText,
//                                 },
//                                 Platform.OS == 'android' && (
//                                     {
//                                         maxHeight: animatedHeader.heightLableText,
//                                     }
//                                 )
//                             ]}>
//                             <VnrText
//                                 numberOfLines={2}
//                                 style={[styleSheets.textFontMedium, stylesSearch.lableStyle]}
//                                 i18nKey={nav.title}
//                             />
//                         </Animated.View>
//                     </Animated.View>
//                 </TouchableWithoutFeedback>
//             }

//         })
//     }

//     renderContentSearch = () => {
//         const { searchText, isFilter, dataDashboardFilter } = this.state;
//         return (
//             <Modal
//                 onShow={this.onShowFilter}
//                 visible={isFilter}
//                 animationType={Platform.OS === 'iod' ? 'fade' : 'none'}
//                 transparent={true}
//             >
//                 <View
//                     style={stylesSearch.BlurSearch}
//                     reducedTransparencyFallbackColor="gray"
//                     blurType="light"
//                     blurAmount={10}>
//                     <SafeAreaView style={{ flex: 1 }} >
//                         <View style={stylesSearch.headerForFilter}>
//                             <View style={stylesSearch.view_searchForFilter}>
//                                 <View style={[stylesSearch.search_inputForFilter]}>
//                                     <View style={stylesSearch.iconSearch}>
//                                         <IconSearch size={Size.iconSize} color={Colors.gray_9} />
//                                     </View>
//                                     <VnrTextInput
//                                         // onBlur={() => this.handleBlur()}
//                                         autoFocus={true}
//                                         onClearText={() => this.changeSearchBar('')}
//                                         placeholder={translate('HRM_Common_Search')}
//                                         onChangeText={text => this.changeSearchBar(text)}
//                                         value={searchText}
//                                         returnKeyType="search"
//                                         onSubmitEditing={() => { }}
//                                         style={[styleSheets.text, stylesSearch.search_VnrTextInput]}
//                                     />
//                                 </View>

//                                 <TouchableOpacity
//                                     onPress={() => this.handleBlur()}
//                                     style={stylesSearch.search__bntCancel}>
//                                     <VnrText
//                                         i18nKey={'CANCEL'}
//                                         style={[styleSheets.text, { color: Colors.primary }]}
//                                     />
//                                 </TouchableOpacity>
//                             </View>
//                         </View>

//                         <View style={stylesSearch.contentSearch}>
//                             {
//                                 dataDashboardFilter.length > 0 ? (
//                                     <ScrollView
//                                         showsVerticalScrollIndicator={false}
//                                         contentContainerStyle={{
//                                             paddingBottom: (Size.deviceheight) * 0.1,
//                                         }}>
//                                         {this.renderDashboardFilter(dataDashboardFilter)}
//                                     </ScrollView>
//                                 ) : (
//                                     <VnrLoading size="small" isVisible={true} />
//                                 )
//                             }

//                         </View>
//                     </SafeAreaView>
//                 </View>
//             </Modal>
//         );
//     };

//     componentDidMount() {
//         api.refreshTopNavigate = this.reloadHeader;
//         this.reloadHeader()
//     }

//     changeSearchBar = text => {
//         this.setState({ searchText: text },
//             () => {
//                 this.onFilter();
//             }
//         );
//     };

//     onFilter = (type) => {
//         const { fullDataDashboard, searchText } = this.state;
//         const dataDashboardFilter = [...fullDataDashboard.map(group => {
//             const listgroupFilter = group.listGroup.filter(item => (item.slug && item.slug.toLowerCase().indexOf(searchText.toLowerCase()) > -1));
//             return { ...group, ...{ listGroup: listgroupFilter } };
//         })];
//         this.setState({ dataDashboardFilter: dataDashboardFilter });
//     };

//     render() {
//         const { ContentCenter } = stylesSearch,
//             { animatedHeader } = this.props;

//         return Platform.OS == 'ios' ? (
//             <BlurView
//                 style={[ContentCenter]}
//                 blurType="light"
//                 blurAmount={10}
//                 reducedTransparencyFallbackColor="white">
//                 <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end', }}>
//                     <Animated.View
//                         style={[
//                             stylesSearch.header,
//                             {
//                                 height: animatedHeader.height,

//                             },
//                         ]}>
//                         <TouchableWithoutFeedback onPress={() => this.focusInputSearch()}>
//                             <Animated.View
//                                 ref={view => {
//                                     this.feedPost = view;
//                                 }}
//                                 onLayout={event => {
//                                     this.feedPost.measure((fx, fy, width, height, px, py) => {
//                                         this.distanceTopSearch = py - 10;
//                                     });
//                                 }}
//                                 style={[
//                                     stylesSearch.view_search,
//                                     {
//                                         position: 'absolute',
//                                         left: Size.defineSpace,
//                                         top: 10,
//                                         width: animatedHeader.widthInputSearch,
//                                     },
//                                 ]}>
//                                 <Animated.View
//                                     style={[
//                                         stylesSearch.search_input,
//                                         {
//                                             borderWidth: animatedHeader.borderInputSearch,
//                                         },
//                                     ]}>
//                                     <View style={stylesSearch.iconSearch}>
//                                         <IconSearch size={Size.iconSize} color={Colors.gray_9} />
//                                     </View>
//                                     <Animated.View
//                                         style={{
//                                             opacity: animatedHeader.opacityText,
//                                         }}>
//                                         <VnrText
//                                             i18nKey={'HRM_Common_Search'}
//                                             style={[styleSheets.text, { color: Colors.gray_7 }]}
//                                         />
//                                     </Animated.View>
//                                 </Animated.View>
//                             </Animated.View>
//                         </TouchableWithoutFeedback>
//                         <Animated.View
//                             style={[
//                                 stylesSearch.subMenu,
//                                 {
//                                     position: 'absolute',
//                                     bottom: animatedHeader.marginBottomSubMenu,// ,
//                                     width: animatedHeader.withSubMenu,
//                                     left: animatedHeader.marginLeftSubMenu
//                                 },
//                             ]}>
//                             {
//                                 this.renderTopNav()
//                             }
//                         </Animated.View>
//                     </Animated.View>
//                     {this.renderContentSearch()}
//                 </SafeAreaView>
//             </BlurView>
//         ) :
//             (
//                 <View
//                     style={[ContentCenter, {
//                         backgroundColor: Colors.whileOpacity80
//                     }]}
//                     blurType="light"
//                     blurAmount={10}
//                     reducedTransparencyFallbackColor="white">
//                     <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end' }}>
//                         <Animated.View
//                             style={[
//                                 stylesSearch.header,
//                                 {
//                                     height: animatedHeader.height,
//                                 },
//                             ]}>
//                             <TouchableWithoutFeedback onPress={() => this.focusInputSearch()}>
//                                 <Animated.View
//                                     ref={view => {
//                                         this.feedPost = view;
//                                     }}
//                                     style={[
//                                         stylesSearch.view_search,
//                                         {
//                                             position: 'absolute',
//                                             left: Size.defineSpace,
//                                             top: 10,
//                                             width: animatedHeader.widthInputSearch,
//                                         },
//                                     ]}>
//                                     <Animated.View
//                                         style={[
//                                             stylesSearch.search_input,
//                                             {
//                                                 borderWidth: animatedHeader.borderInputSearch,
//                                             },
//                                         ]}>
//                                         <View style={stylesSearch.iconSearch}>
//                                             <IconSearch size={Size.iconSize} color={Colors.gray_9} />
//                                         </View>
//                                         <Animated.View
//                                             style={{
//                                                 opacity: animatedHeader.opacityText,
//                                             }}>
//                                             <VnrText
//                                                 i18nKey={'HRM_Common_Search'}
//                                                 style={[styleSheets.text, { color: Colors.gray_7 }]}
//                                             />
//                                         </Animated.View>
//                                     </Animated.View>
//                                 </Animated.View>
//                             </TouchableWithoutFeedback>
//                             <Animated.View
//                                 style={[
//                                     stylesSearch.subMenu,
//                                     {
//                                         position: 'absolute',
//                                         bottom: 10,
//                                         width: animatedHeader.withSubMenu,
//                                         left: animatedHeader.marginLeftSubMenu
//                                     },
//                                 ]}>

//                                 {
//                                     this.renderTopNav()
//                                 }
//                             </Animated.View>
//                         </Animated.View>
//                         {this.renderContentSearch()}
//                     </SafeAreaView>
//                 </View>
//             );
//     }
// }

// const styleItemGroup = StyleSheet.create({
//     styleText: {
//         textTransform: 'uppercase',
//         color: Colors.primary,
//         fontWeight: '700',
//     },
//     styleViewTitleFilter: {
//         paddingVertical: 5
//     },
//     styleTitleFilter: {
//         color: Colors.gray_8,
//         fontSize: Size.text + 2
//     }
// });

// const stylesSearch = StyleSheet.create({
//     contentHome: {
//         flex: 1,
//     },
//     ContentCenter: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         width: Size.deviceWidth,
//     },
//     BlurSearch: {
//         flex: 1,
//         flexDirection: 'column',
//         justifyContent: 'flex-start',
//         backgroundColor: Colors.white
//     },
//     contentSearch: {
//         flexGrow: 1,
//         paddingHorizontal: Size.defineSpace,
//     },
//     header: {
//         height: 170,
//         width: 'auto',
//         paddingHorizontal: Size.defineSpace,
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         justifyContent: 'flex-start',
//         alignContent: 'space-around',
//         alignItems: 'center',
//     },
//     headerForFilter: {
//         height: HEIGHT_SEARCH + 20,
//         width: 'auto',
//         paddingHorizontal: Size.defineSpace,
//         justifyContent: 'center',
//     },
//     search_inputForFilter: {
//         flex: 1,
//         flexDirection: 'row',
//         borderWidth: 0.5,
//         borderColor: Colors.gray_5,
//         paddingVertical: 5,
//         borderRadius: 20,
//         alignItems: 'center',
//         paddingRight: 10,
//     },
//     view_search: {
//         flexDirection: 'row',
//         width: WIDTH_SEARCH,
//         height: HEIGHT_SEARCH,
//         maxWidth: WIDTH_SEARCH,
//     },
//     view_searchForFilter: {
//         flexDirection: 'row',
//         width: WIDTH_SEARCH,
//         height: HEIGHT_SEARCH,
//     },
//     search_input: {
//         flex: 1,
//         flexDirection: 'row',
//         borderWidth: 0.5,
//         borderColor: Colors.gray_5,
//         paddingVertical: 5,
//         borderRadius: 20,
//         alignItems: 'center',
//         paddingRight: 10,
//     },
//     iconSearch: {
//         marginLeft: 10,
//         marginRight: 10,
//     },
//     search_VnrTextInput: {
//         height: '100%'
//     },
//     subMenu: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         // paddingVertical: 2
//     },
//     viewButtonIOS: {
//         height: HEIHGT_BUTTON,
//         maxHeight: HEIHGT_BUTTON,
//         borderRadius: 12,
//         paddingVertical: 8,
//         // paddingHorizontal: 3,
//         borderWidth: 0.5,
//         borderColor: Colors.gray_5,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     icon: {
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     iconStyle: {
//         width: WIDTH_ICON_BUTTON,
//         height: WIDTH_ICON_BUTTON,
//         maxWidth: 50,
//         maxHeight: 50,
//         resizeMode: 'contain',
//     },
//     lableStyle: {
//         fontSize: Size.text - 2,
//         textAlign: 'center',
//         color: Colors.gray_10,
//         fontWeight: '500',
//         paddingBottom: 1,
//     },
//     viewLable: {
//         marginTop: 8,
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingHorizontal: 3
//         // flexDirection: 'row',
//     },
//     viewListSearch: {
//         position: 'absolute',
//         left: 0,
//         width: Size.deviceWidth,
//         height: Size.deviceheight - HEIGHT_SEARCH,
//     },
//     search__bntCancel: {
//         height: '100%',
//         marginLeft: Size.defineSpace,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
// });

import React, { Component } from 'react';
import {
    FlatList,
    ScrollView,
    Image,
    View,
    TouchableOpacity,
    StyleSheet,
    Animated,
    TouchableWithoutFeedback,
    Platform,
    Modal
} from 'react-native';
import { Colors, CustomStyleSheet, Size, styleSheets } from '../../constants/styleConfig';
import ItemFilterMain from '../../components/Main/ItemFilterMain';
import DrawerServices from '../../utils/DrawerServices';
import { dataVnrStorage } from '../../assets/auth/authentication';
import { ConfigDashboard } from '../../assets/configProject/ConfigDashboard';
import { IconSearch } from '../../constants/Icons';
import VnrTextInput from '../../components/VnrTextInput/VnrTextInput';
import VnrText from '../../components/VnrText/VnrText';
import { translate } from '../../i18n/translate';
import Vnr_Function from '../../utils/Vnr_Function';
import { BlurView } from '@react-native-community/blur';
import { SafeAreaConsumer, SafeAreaView } from 'react-native-safe-area-context';

import VnrLoading from '../../components/VnrLoading/VnrLoading';

const PADDING = Size.deviceWidth >= 1024 ? Size.defineSpace : 10,
    WIDTH_VIEW_BNT_ITEM =
        Size.deviceWidth <= 320
            ? Size.deviceWidth - Size.defineSpace * 2 - PADDING * 2 - 3
            : Size.deviceWidth - Size.defineSpace * 2 - PADDING * 3 - 4;

const HEIGHT_SEARCH = Size.deviceheight >= 1024 ? 57 : 47,
    HEIHGT_BUTTON = Size.deviceheight >= 1024 ? 120 : Size.deviceWidth <= 320 ? 85 : 95,
    WIDTH_BUTTON = Size.deviceWidth <= 320 ? WIDTH_VIEW_BNT_ITEM / 3 : WIDTH_VIEW_BNT_ITEM / 4,
    WIDTH_SEARCH = Size.deviceWidth - Size.defineSpace * 2,
    WIDTH_ICON_BUTTON = WIDTH_BUTTON * 0.35 >= 50 ? 50 : WIDTH_BUTTON * 0.35;
// const api = {};
// export const topNavigateApi = api;
export default class HeaderHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // dataDashboard: [],
            fullDataDashboard: [],
            dataDashboardFilter: [],
            isFilter: false,
            searchText: '',
            _topNavigate: [] //dataVnrStorage.topNavigate.slice(0, 4),
        };

        this.distanceTopSearch = HEIGHT_SEARCH + 50;
        this.heightViewLableButton = 0;
        this.reloadHeader = this.reloadHeader.bind(this);
    }

    focusInputSearch = () => {
        this.setState({ isFilter: true });
    };

    handleBlur = () => {
        this.setState({ isFilter: false });
    };

    onShowFilter = () => {
        const dashboard = ConfigDashboard.value;
        // nhan.nguyen: 	0178277: [TB W16]App: Lỗi tìm kiếm
        if (dashboard && Array.isArray(dashboard) && this.state.searchText.length === 0) {
            //translate item in group and set slug
            dashboard.forEach(item => {
                if (item.listGroup && item.listGroup.length) {
                    let _group = item.listGroup;

                    //loop items in group
                    _group.forEach(subItem => {
                        //translate title
                        if (subItem.title) {
                            let _trans = translate(subItem.title),
                                _toSlug = Vnr_Function.toSlug(_trans);
                            //subItem.title = _trans;
                            subItem.slug = _trans.toLowerCase() + ' ' + _toSlug;
                        }
                    });
                }
            });
            this.setState({
                fullDataDashboard: [...dashboard],
                dataDashboardFilter: [...dashboard]
            });
        }
    };

    reloadHeader = () => {
        const dashboard = ConfigDashboard.value;
        let { _topNavigate } = this.state;
        _topNavigate = dataVnrStorage.topNavigate.slice(0, 4);
        if (dashboard && Array.isArray(dashboard)) {
            //translate item in group and set slug
            dashboard.forEach(item => {
                if (item.listGroup && item.listGroup.length) {
                    let _group = item.listGroup;

                    //loop items in group
                    _group.forEach(subItem => {
                        //translate title
                        if (subItem.title) {
                            let _trans = translate(subItem.title),
                                _toSlug = Vnr_Function.toSlug(_trans);

                            //subItem.title = _trans;
                            subItem.slug = _trans.toLowerCase() + ' ' + _toSlug;

                            //set TopNavigateDefault
                            if (_topNavigate.length < 4 && subItem.isTopNavigateDefault) {
                                let findNav = _topNavigate.find(nav => nav.screenName === subItem.screenName);

                                //nếu chưa có thì add vào
                                if (!findNav) {
                                    _topNavigate = [..._topNavigate, { ...subItem }];
                                }
                            }
                        }
                    });
                }
            });
            this.setState({
                _topNavigate
            });
        }
    };

    renderItemFilter = (item, index, lengthData) => {
        try {
            //check thông tin cá nhân
            if (item['screenName'] != undefined && item['screenName'] == 'ProfileInfo') {
                //set lại title = tên nhân viên và avatar
                item.title = dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info.FullName : '';
                item.urlIcon = dataVnrStorage.currentUser.info.ImagePath;
            }

            return (
                <ItemFilterMain
                    key={item.resource && item.resource.name ? item.resource.name : index}
                    index={index}
                    closeFilter={this.handleBlur}
                    lengthData={lengthData}
                    type={item.type}
                    title={item.title}
                    urlIcon={item.urlIcon}
                    screenName={item.screenName}
                    nav={item}
                />
            );
        } catch (error) {
            return null;
        }
    };

    renderDashboardFilter = dashboardFilter => {
        return dashboardFilter.map((item, i) => {
            if (item.type === 'E_GROUP') {
                //check group có item
                if (item.listGroup && item.listGroup.length > 0) {
                    //retun render Group
                    const lengthData = item.listGroup.length;
                    return (
                        <View>
                            <View style={styleItemGroup.styleViewTitleFilter}>
                                <VnrText
                                    style={[styleSheets.text, styleItemGroup.styleTitleFilter]}
                                    i18nKey={item['title']}
                                />
                            </View>

                            <FlatList
                                accessibilityLabel='HeaderHome-ListItem'
                                style={CustomStyleSheet.marginBottom(15)}
                                data={item.listGroup}
                                renderItem={({ item, index }) => this.renderItemFilter(item, index, lengthData)}
                                keyExtractor={(item, index) => index}
                            />
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
                return this.renderItemFilter(item, i);
            }
        });
    };

    renderTopNav = () => {
        const { animatedHeader } = this.props,
            { _topNavigate } = this.state;

        return _topNavigate.map((nav, index) => {
            // iphone 5 chỉ hiển thị 3 icon
            if (Size.deviceWidth <= 320 && index > 2) {
                return <View />;
            } else {
                return (
                    <TouchableWithoutFeedback
                        onPress={() => {
                            DrawerServices.navigate(nav.screenName);
                            // updateTopNavigate({ ...nav }, this.onShowFilter);
                        }}
                    >
                        <Animated.View
                            style={[
                                stylesSearch.viewButtonIOS,
                                {
                                    width: animatedHeader.widthButton,
                                    height: animatedHeader.heightButton,
                                    borderWidth: animatedHeader.borderButton,
                                    opacity: animatedHeader.opacityButton,
                                    marginRight:
                                        Size.deviceWidth <= 320
                                            ? (index + 1) % 3 == 0
                                                ? 0
                                                : PADDING
                                            : (index + 1) % 4 == 0
                                                ? 0
                                                : PADDING
                                }
                            ]}
                            onPress={() => this.router(nav.screenName)}
                            activeOpacity={0.7}
                        >
                            <View style={stylesSearch.icon}>
                                <Image
                                    source={{ uri: nav.urlIcon }}
                                    //source={require('../../assets/images/GPS/off.png')}
                                    style={stylesSearch.iconStyle}
                                />
                            </View>

                            <Animated.View
                                style={[
                                    stylesSearch.viewLable,
                                    {
                                        width: animatedHeader.widthLableText,
                                        opacity: animatedHeader.opacityText
                                    },
                                    Platform.OS == 'android' && {
                                        maxHeight: animatedHeader.heightLableText
                                    }
                                ]}
                            >
                                <VnrText
                                    numberOfLines={2}
                                    style={[styleSheets.textFontMedium, stylesSearch.lableStyle]}
                                    i18nKey={nav.title}
                                />
                            </Animated.View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                );
            }
        });
    };

    renderContentSearch = () => {
        const { searchText, isFilter, dataDashboardFilter } = this.state;
        return (
            <Modal
                onShow={this.onShowFilter}
                visible={isFilter}
                animationType={Platform.OS === 'iod' ? 'fade' : 'none'}
                transparent={true}
            >
                <View
                    style={stylesSearch.BlurSearch}
                    reducedTransparencyFallbackColor="gray"
                    blurType="light"
                    blurAmount={10}
                >
                    <SafeAreaView style={CustomStyleSheet.flex(1)}>
                        <View style={stylesSearch.headerForFilter}>
                            <View style={stylesSearch.view_searchForFilter}>
                                <View style={[stylesSearch.search_inputForFilter]}>
                                    <VnrTextInput
                                        textField={'HeaderInputSearch'}
                                        // onBlur={() => this.handleBlur()}
                                        autoFocus={true}
                                        onClearText={() => this.changeSearchBar('')}
                                        placeholder={translate('HRM_Common_Search')}
                                        onChangeText={text => this.changeSearchBar(text)}
                                        value={searchText}
                                        returnKeyType="search"
                                        onSubmitEditing={() => {}}
                                        style={[
                                            styleSheets.text,
                                            stylesSearch.search_VnrTextInput,
                                            CustomStyleSheet.paddingHorizontal(12)
                                        ]}
                                    />
                                    <View style={stylesSearch.iconSearch}>
                                        <IconSearch size={Size.iconSize} color={Colors.gray_9} />
                                    </View>
                                </View>

                                <TouchableOpacity
                                    onPress={() => this.handleBlur()}
                                    style={stylesSearch.search__bntCancel}
                                >
                                    <VnrText i18nKey={'CANCEL'} style={[styleSheets.text, { color: Colors.primary }]} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={stylesSearch.contentSearch}>
                            {dataDashboardFilter.length > 0 ? (
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{
                                        paddingBottom: Size.deviceheight * 0.1
                                    }}
                                >
                                    {this.renderDashboardFilter(dataDashboardFilter)}
                                </ScrollView>
                            ) : (
                                <VnrLoading size="small" isVisible={true} />
                            )}
                        </View>
                    </SafeAreaView>
                </View>
            </Modal>
        );
    };

    componentDidMount() {
        // api.refreshTopNavigate = this.reloadHeader;
        this.reloadHeader();
    }

    changeSearchBar = text => {
        this.setState({ searchText: text }, () => {
            this.onFilter();
        });
    };

    onFilter = () => {
        const { fullDataDashboard, searchText } = this.state;
        const dataDashboardFilter = [
            ...fullDataDashboard.map(group => {
                const listgroupFilter = group.listGroup.filter(
                    item => item.slug && item.slug.toLowerCase().indexOf(searchText.toLowerCase()) > -1
                );
                return { ...group, ...{ listGroup: listgroupFilter } };
            })
        ];
        this.setState({ dataDashboardFilter: dataDashboardFilter });
    };

    render() {
        return Platform.OS == 'ios' ? (
            <BlurView
                style={[stylesSearch.ContentCenter]}
                blurType="light"
                blurAmount={10}
                reducedTransparencyFallbackColor="white"
            >
                <SafeAreaConsumer>
                    {insets => (
                        <View style={{ paddingTop: insets.top }}>
                            <Animated.View
                                style={[
                                    stylesSearch.header,
                                    {
                                        height: HEIGHT_SEARCH + 20
                                    }
                                ]}
                            >
                                <Animated.View
                                    ref={view => {
                                        this.feedPost = view;
                                    }}
                                    style={[stylesSearch.view_search]}
                                >
                                    <TouchableWithoutFeedback
                                        accessibilityLabel='HeaderHome-FocusSearch'
                                        onPress={() => this.focusInputSearch()}>
                                        <Animated.View
                                            style={ stylesSearch.search_input}
                                        >
                                            <Animated.View style={{}}>
                                                <VnrText
                                                    i18nKey={'HRM_Common_Search'}
                                                    style={[styleSheets.text, { color: Colors.gray_7 }]}
                                                />
                                            </Animated.View>
                                            <View style={stylesSearch.iconSearch}>
                                                <IconSearch size={Size.iconSize - 1} color={Colors.gray_7} />
                                            </View>
                                        </Animated.View>
                                    </TouchableWithoutFeedback>

                                    {/* <Animated.View>
                                    <TouchableOpacity
                                        style={{
                                            flex: 1,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            paddingHorizontal: 12,
                                            backgroundColor: Colors.gray_3,
                                            borderRadius: 6,
                                            marginLeft: 4
                                        }}
                                        onPress={() => {
                                            DrawerServices.navigate('TakePictureFace')
                                        }}
                                    >
                                        <Image source={require('../../assets/images/facescan.png')}
                                            width={22} height={22}
                                            style={{
                                                width: 22,
                                                height: 22,
                                            }}
                                        />
                                    </TouchableOpacity>
                                </Animated.View> */}
                                </Animated.View>
                            </Animated.View>
                            {this.renderContentSearch()}
                        </View>
                    )}
                </SafeAreaConsumer>
            </BlurView>
        ) : (
            <View
                style={[
                    stylesSearch.ContentCenter,
                    {
                        backgroundColor: Colors.white
                    }
                ]}
                blurType="light"
                blurAmount={10}
                reducedTransparencyFallbackColor="white"
            >
                <SafeAreaView style={stylesSearch.stySafe}>
                    <Animated.View
                        style={[
                            stylesSearch.header,
                            {
                                height: HEIGHT_SEARCH + 20
                            }
                        ]}
                    >
                        {/* <Animated.View> */}
                        <Animated.View
                            ref={view => {
                                this.feedPost = view;
                            }}
                            style={[stylesSearch.view_search]}
                        >
                            <TouchableWithoutFeedback
                                accessibilityLabel='HeaderHome-FocusSearch'
                                onPress={() => this.focusInputSearch()}>
                                <Animated.View
                                    style={stylesSearch.search_input}
                                >
                                    <Animated.View style={{}}>
                                        <VnrText
                                            i18nKey={'HRM_Common_Search'}
                                            style={[styleSheets.text, { color: Colors.gray_7 }]}
                                        />
                                    </Animated.View>
                                    <View style={stylesSearch.iconSearch}>
                                        <IconSearch size={Size.iconSize - 1} color={Colors.gray_7} />
                                    </View>
                                </Animated.View>
                            </TouchableWithoutFeedback>

                            {/* <Animated.View>
                                    <TouchableOpacity
                                        style={{
                                            flex: 1,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            paddingHorizontal: 12,
                                            backgroundColor: Colors.gray_3,
                                            borderRadius: 6,
                                            marginLeft: 4
                                        }}
                                        onPress={() => {
                                            DrawerServices.navigate('TakePictureFace')
                                        }}
                                    >
                                        <Image source={require('../../assets/images/facescan.png')}
                                            width={22} height={22}
                                            style={{
                                                width: 22,
                                                height: 22,
                                            }}
                                        />
                                    </TouchableOpacity>
                                </Animated.View> */}
                        </Animated.View>
                        {/* </Animated.View> */}
                        {/* <Animated.View
                                style={[
                                    stylesSearch.subMenu,
                                    {
                                        position: 'absolute',
                                        bottom: 10,
                                        width: animatedHeader.withSubMenu,
                                        left: animatedHeader.marginLeftSubMenu
                                    },
                                ]}>

                                {
                                    this.renderTopNav()
                                }
                            </Animated.View> */}
                    </Animated.View>
                    {this.renderContentSearch()}
                </SafeAreaView>
            </View>
        );
    }
}

const styleItemGroup = StyleSheet.create({
    styleViewTitleFilter: {
        paddingVertical: 5
    },
    styleTitleFilter: {
        color: Colors.gray_8,
        fontSize: Size.text + 2
    }
});

const stylesSearch = StyleSheet.create({
    stySafe: { flex: 1, justifyContent: 'flex-end' },
    ContentCenter: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: Size.deviceWidth
    },
    BlurSearch: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: Colors.white
    },
    contentSearch: {
        flexGrow: 1,
        paddingHorizontal: Size.defineSpace
    },
    header: {
        height: 170,
        width: 'auto',
        paddingHorizontal: Size.defineSpace,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignContent: 'space-around',
        alignItems: 'center'
    },
    headerForFilter: {
        height: HEIGHT_SEARCH + 20,
        width: 'auto',
        paddingHorizontal: Size.defineSpace,
        justifyContent: 'center'
    },
    search_inputForFilter: {
        flex: 1,
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        borderRadius: 20,
        alignItems: 'center',
        paddingRight: 10
    },
    view_search: {
        flexDirection: 'row',
        width: WIDTH_SEARCH,
        height: HEIGHT_SEARCH,
        maxWidth: WIDTH_SEARCH,
        position: 'absolute',
        left: Size.defineSpace,
        top: 10
    },
    view_searchForFilter: {
        flexDirection: 'row',
        width: WIDTH_SEARCH,
        height: HEIGHT_SEARCH
    },
    search_input: {
        flex: 1,
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        paddingVertical: 5,
        alignItems: 'center',

        justifyContent: 'space-between',
        paddingRight: 0,
        paddingHorizontal: 12,
        backgroundColor: Colors.gray_3,
        borderRadius: 8,
        marginRight: 4
    },
    iconSearch: {
        marginLeft: 10,
        marginRight: 10
    },
    search_VnrTextInput: {
        height: HEIGHT_SEARCH,
        fontSize: Size.text - 1
    },
    viewButtonIOS: {
        height: HEIHGT_BUTTON,
        maxHeight: HEIHGT_BUTTON,
        borderRadius: 12,
        paddingVertical: 8,
        // paddingHorizontal: 3,
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconStyle: {
        width: WIDTH_ICON_BUTTON,
        height: WIDTH_ICON_BUTTON,
        maxWidth: 50,
        maxHeight: 50,
        resizeMode: 'contain'
    },
    lableStyle: {
        fontSize: Size.text - 2,
        textAlign: 'center',
        color: Colors.gray_10,
        fontWeight: '500',
        paddingBottom: 1
    },
    viewLable: {
        marginTop: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 3
        // flexDirection: 'row',
    },
    search__bntCancel: {
        height: '100%',
        marginLeft: Size.defineSpace,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
