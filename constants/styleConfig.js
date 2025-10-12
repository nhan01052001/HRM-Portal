// https://www.npmjs.com/package/color
// https://github.com/Mottie/javascript-number-formatter
import Color from 'color';
import { Dimensions, StyleSheet, Platform } from 'react-native';
import { Header } from 'react-navigation-stack';
const { height, width } = Dimensions.get('window');
// width = 320;

export const CustomStyleSheet = {
    textAlign: value => {
        return {
            textAlign: value
        };
    },

    alignItems: (value) => {
        return {
            alignItems: value
        };
    },

    justifyContent: (value) => {
        return {
            justifyContent: value
        };
    },
    opacity: (value) => {
        return {
            opacity: value
        };
    },

    flexDirection: (value) => {
        return {
            flexDirection: value
        };
    },

    zIndex: (value) => {
        return {
            zIndex: value
        };
    },

    flex: (value = 1) => {
        return {
            flex: value
        };
    },

    width: (value = width) => {
        return {
            width: value
        };
    },

    minWidth: (value = width) => {
        return {
            minWidth: value
        };
    },

    height: (value = height) => {
        return {
            height: value
        };
    },

    marginVertical: (value = 0) => {
        return {
            marginVertical: value
        };
    },

    marginHorizontal: (value = 0) => {
        return {
            marginHorizontal: value
        };
    },

    margin: (value = 0) => {
        return {
            margin: value
        };
    },

    marginBottom: (value = 0) => {
        return {
            marginBottom: value
        };
    },

    marginTop: (value = 0) => {
        return {
            marginTop: value
        };
    },

    marginRight: (value = 0) => {
        return {
            marginRight: value
        };
    },

    marginLeft: (value = 0) => {
        return {
            marginLeft: value
        };
    },

    paddingVertical: (value = 0) => {
        return {
            paddingVertical: value
        };
    },

    paddingHorizontal: (value = 0) => {
        return {
            paddingHorizontal: value
        };
    },

    paddingTop: (value = 0) => {
        return {
            paddingTop: value
        };
    },

    paddingBottom: (value = 0) => {
        return {
            paddingBottom: value
        };
    },

    paddingRight: (value = 0) => {
        return {
            paddingRight: value
        };
    },

    paddingLeft: (value = 0) => {
        return {
            paddingLeft: value
        };
    },

    padding: (value = 0) => {
        return {
            padding: value
        };
    },

    flexGrow: (value = 1) => {
        return {
            flexGrow: value
        };
    },

    borderRadius: (value = 0) => {
        return {
            borderRadius: value
        };
    },

    borderWidth: (value = 0) => {
        return {
            borderWidth: value
        };
    },

    borderTopWidth: (value = 0) => {
        return {
            borderTopWidth: value
        };
    },

    borderBottomWidth: (value = 0) => {
        return {
            borderBottomWidth: value
        };
    },

    borderBottomColor: (value = Colors.primary) => {
        return {
            borderBottomColor: value
        };
    },

    borderColor: (value = Colors.primary) => {
        return {
            borderColor: value
        };
    },

    backgroundColor: (value = Colors.primary) => {
        return {
            backgroundColor: value
        };
    },

    color: (value = Colors.primary) => {
        return {
            color: value
        };
    },

    borderRightWidth: (value = 0) => {
        return {
            borderRightWidth: value
        };
    },

    borderLeftWidth: (value = 0) => {
        return {
            borderLeftWidth: value
        };
    },

    fontWeight: (value = '400') => {
        if (typeof value === 'number') value = value.toString();
        return {
            fontWeight: value
        };
    },

    fontSize: (value = Size.text) => {
        return {
            fontSize: value
        };
    },

    maxWidth: (value = width) => {
        return {
            maxWidth: value
        };
    },

    maxHeight: (value = width) => {
        return {
            maxHeight: value
        };
    },

    minHeight: (value = height) => {
        return {
            minHeight: value
        };
    },

    elevation: (value = 1) => {
        return {
            elevation: value
        };
    },

    flexWrap: (value = 'wrap') => {
        return {
            flexWrap: value
        }
    }
};

const scale = width / 320;
const paddingFontFamily = 2;
export const normalize = (size) => {
    const newSize = size * scale;
    //if (Platform.OS === 'ios') {
    const sizeText = Math.round(newSize);
    if (width > 700 && sizeText >= 20) {
        return 20;
    }
    if (sizeText >= 17) {
        return 17;
    } else {
        return sizeText;
    }
    // } else {
    //   const size = Math.round(newSize) - 2;
    //   if (width > 700 && size >= 20) {
    //     return 20;
    //   }
    //   if (size >= 17) {
    //     return 17;
    //   }
    //   else {
    //     return size;
    //   }
    // }
};

// const primaryColor = '#0971DC';
export const Colors = {
    transparent_modal: '#26262680',
    transparent: 'transparent',
    black: '#000',
    black12: '#121212',

    black_transparent_7: Color.rgb(0, 0, 0, 0.6),
    black_transparent_8: Color.rgb(0, 0, 0, 0.08),

    // primary: primaryColor,
    primaryDark: '#B80000',
    white: '#ffff',
    RedOrange: '#f44336',
    indigo: '#3f51b5',
    BahamaBlue: '#23527c',
    DarkslateBlue: '#134c9c',
    green50: '#e8f5e9',
    grey: '#9e9e9e',
    brown_tranparent: Color.rgb(250, 84, 28, 0.08),

    lightOrange: Color('#ff9800').lighten(0.5).hex(),
    accent: '#039be5',
    lightAccent: '#b3e5fc',
    secondaryConstraint: '#F7FFFB',

    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffa701',
    info: '#17a2b8',
    verdurous: '#56ca09',
    warning_blur: '#FFFCED',
    success_blur: '#F3FAEE',
    info_blur: '#ECF4FB',
    danger_blur: '#FBEDEE',

    Secondary: '#9ACD32',
    SecondaryOpacity20: Color.rgb(9, 113, 220, 0.2),
    SecondaryOpacity10: Color.rgb(9, 113, 220, 0.1),
    Secondary95: Color.rgb(9, 113, 220, 0.08),
    greyPrimary: '#8c8a8a',
    greySecondary: '#505050',
    greyBorder: '#f5f5f5',
    greyPrimaryConstraint: '#f5f5f5', //'#eaeaea',
    greySecondaryConstraint: '#cccccc',

    black03: Color.rgb(0, 0, 0, 0.3),
    whileOpacity80: Color.rgb(255, 255, 255, 0.95),
    whiteOpacity70: Color.rgb(255, 255, 255, 0.7),
    whiteOpacity60: Color.rgb(255, 255, 255, 0.6),
    whiteOpacity30: Color.rgb(255, 255, 255, 0.3),
    whiteOpacity40: Color.rgb(255, 255, 255, 0.4),

    borderColor: '#e5e5e7',
    whitePure: '#f3f2f2',
    whitePure2: '#f0eded',
    whitePure3: '#edeae2',

    navy: '#3c4252',
    navy_7: '#354FBF',
    navy_6: '#4F67CE',
    navy_5: '#6F83D7',
    navy_3: '#AFBAE9',

    green_1: '#DCF8CD',
    green_4: '#B7EB8F',
    green_3: '#BBF2A0',
    green_5: '#9BEC73',
    green_6: '#8BE95D',
    green: '#52C41A',

    yellow_1: '#FEF7C8',
    yellow_5: '#FCEA78',
    yellow_6: '#FADB14',
    yellow: '#FADE28',

    orangeOpacity80: Color.rgb(255, 123, 9, 0.8),
    orange_1: '#FEE4C8',
    orange_3: '#FDD0A0',
    orange_5: '#FCBC78',
    orange_6: '#FCB364',
    orange: '#FA8C16', //ForgeLeaveday

    volcano_1: '#FEDDD2',
    volcano_3: '#FDBFAA',
    volcano_5: '#FC9A78',
    volcano_6: '#FC8A64',
    volcano: '#FA541C',

    red_1: '#FDD3D5',
    red_3: '#FBACB0',
    red_5: '#F9858B',
    red_6: '#F97279',
    red: '#F5222D', // overtime

    blue: '#0971DC',
    blue_1: '#CEE5FD',
    blue_3: '#9DCBFB',
    blue_5: '#6CB1F9',
    blue_6: '#54A5F8',
    blue_7: '#3B98F7',

    blue_transparent_8: Color.rgb(9, 113, 220, 0.08),

    // primary: '#006400',//'#008500',
    // primary_1: '#7AFF7A',
    // // primary_3 : '#3DFF3D',
    // //primary_5: '#00FF00',
    // //primary_6 : '#00E000',
    // primary_7: '#00b800',

    primary: '#0971DC',
    primary_1: '#CEE5FD',
    primary_3: '#9DCBFB',
    primary_5: '#6CB1F9',
    primary_6: '#54A5F8',
    primary_7: '#3B98F7',
    primary_transparent_8: Color.rgb(9, 113, 220, 0.08),

    neutralGreen_1: '#E6F9F3',
    neutralGreen_3: '#B4ECDC',
    neutralGreen_5: '#81DFC4',
    neutralGreen_6: '#68D9B9',
    neutralGreen: '#04BF8A', // c4ng tác

    purple_1: '#F1EAFA',
    purple_3: '#D5C0F1',
    purple_5: '#B896E8',
    purple_6: '#AA82E3',
    purple: '#722ED1', // leaveday

    gray_1: '#FFFFFF',
    gray_2: '#fafafa',
    gray_3: '#f5f5f5',
    gray_4: '#F0F0F0',
    gray_5: '#D9D9D9',
    gray_6: '#BFBFBF',
    gray_7: '#8C8C8C',
    gray_8: '#595959',
    gray_9: '#434343',
    gray_10: '#262626',

    grayD: '#d9e1e8',
    grayD1: '#D1D1D1',
    grayOpacity24: Color.rgb(255, 255, 255, 0.24),
    grayOpacity15: Color.rgb(255, 255, 255, 0.15),

    dark: '#191919',
    pink: '#FD3995'
};

export const Size = {
    iconSize: normalize(13) + 6,
    iconSizeHeader: normalize(13) + 8,
    heightInput: 50,
    heightButton: 40,
    textSmall: normalize(11),
    text: normalize(12),
    textmedium: normalize(13) + 2,
    textlarge: normalize(13) + 5,
    textLableTabar: 13,
    deviceWidth: width,
    deviceheight: height,
    headerHeight: Header.HEIGHT,
    defineSpace: 16,
    defineHalfSpace: 8,
    borderPicker: 4,
    borderRadiusPrimary: 4,
    iconSizeLoadingSmall: 22,
    AvatarSize: width * 0.1 > 60 ? 60 : width * 0.1,
    borderRadiusBotton: 8,
    borderRadiusCircle: 100
};

export const styleSheets = {
    sizeIconImage: {
        width: 22,
        height: 22
    },
    opacity_button: 0.6,
    //'opacity' : 0.5,
    radius_5: 5,
    radius_8: 8,
    radius_10: 10,
    m_7: 7,
    m_10: Size.defineSpace,
    p_10: Size.defineSpace,
    p_15: 15,
    p_20: 20,
    m_20: 20,
    m_5: 5,
    p_5: 5,
    p_7: 7,
    col_1: {
        flex: 0.1,
        height: 'auto'
    },
    col_2: {
        flex: 0.2,
        height: 'auto'
    },
    col_3: {
        flex: 0.3,
        height: 'auto'
    },
    col_4: {
        flex: 0.4,
        height: 'auto'
    },
    col_5: {
        flex: 0.5,
        height: 'auto'
    },
    col_6: {
        flex: 0.6,
        height: 'auto'
    },
    col_7: {
        flex: 0.7,
        height: 'auto'
    },
    col_8: {
        flex: 0.8,
        height: 'auto'
    },
    col_9: {
        flex: 0.9,
        height: 'auto'
    },
    col_10: {
        flex: 1,
        height: 'auto'
    },

    row: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: -10
    },
    container: {
        flex: 1,
        width: width
    },
    containerGrey: {
        flex: 1,
        backgroundColor: Colors.gray_3
    },
    textInput: {
        height: 35,
        fontSize: Size.text,
        fontWeight: '500',
        paddingHorizontal: Size.defineSpace,
        paddingVertical: 0,
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        borderRadius: Size.borderPicker,
        backgroundColor: Colors.white
    },
    textInputDisable: {
        backgroundColor: Colors.gray_3,
        borderWidth: 0
    },
    text: {
        fontSize: Size.text,
        fontFamily: Platform.OS == 'android' ? 'SF-Pro-Text-Regular' : 'SFProText-Regular',
        fontWeight: '400',
        color: Colors.gray_10,
        includeFontPadding: false,
        paddingVertical: paddingFontFamily
    },
    textFontMedium: {
        fontSize: Size.text,
        fontFamily: Platform.OS == 'android' ? 'SF-Pro-Text-Regular' : 'SFProText-Regular',
        fontWeight: '500',
        color: Colors.black,
        includeFontPadding: false,
        paddingVertical: paddingFontFamily
    },
    textItalic: {
        fontSize: Size.text,
        fontFamily: Platform.OS == 'android' ? 'SF-Pro-Text-RegularItalic' : 'SFProText-RegularItalic',
        includeFontPadding: false,
        paddingVertical: paddingFontFamily
    },
    lable: {
        fontSize: Size.text,
        fontFamily: Platform.OS == 'android' ? 'SF-Pro-Text-Medium' : 'SFProText-Bold',
        fontWeight: '500',
        color: Platform.OS == 'android' ? Colors.gray_10 : Colors.black,
        includeFontPadding: false,
        paddingVertical: paddingFontFamily
    },
    wrapNameAndSubtitle: {
        flex: 1,
        marginLeft: Size.defineSpace - 4
    },
    detailNameApprover: {
        fontSize: Size.text,
        fontFamily: Platform.OS == 'android' ? 'SF-Pro-Text-Regular' : 'SFProText-Bold',
        fontWeight: Platform.OS == 'android' ? '700' : '500',
        color: Colors.black,
        includeFontPadding: false,
        paddingVertical: paddingFontFamily
    },
    subTitleApprover: {
        fontSize: Size.text - 2,
        fontFamily: Platform.OS == 'android' ? 'SF-Pro-Text-Regular' : 'SFProText-Bold',
        fontWeight: Platform.OS == 'android' ? '500' : '400',
        color: Colors.gray_10,
        includeFontPadding: false,
        paddingVertical: paddingFontFamily
    },
    detailPositionApprover: {
        fontSize: Size.text - 2,
        fontFamily: Platform.OS == 'android' ? 'SF-Pro-Text-Regular' : 'SFProText-Regular',
        fontWeight: Platform.OS == 'android' ? '500' : '400',
        color: Colors.gray_8,
        marginVertical: paddingFontFamily
    },
    headerTitleStyle: {
        fontSize: Size.textmedium,
        fontWeight: '500',
        fontFamily: Platform.OS == 'android' ? 'SF-Pro-Text-Medium' : 'SFProText-Bold',
        color: Colors.gray_10,
        includeFontPadding: false,
        paddingVertical: paddingFontFamily
    },
    viewLable: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    viewControl: {
        flexDirection: 'row',
        marginTop: 5
    },
    titleAlert: {
        fontSize: 19,
        fontWeight: '500',
        fontFamily: Platform.OS == 'android' ? 'SF-Pro-Text-Regular' : 'SFProText-Bold',
        includeFontPadding: false,
        paddingVertical: paddingFontFamily
    },
    fontSizeLagre: {
        fontSize: 18,
        fontWeight: Platform.OS == 'android' ? '300' : '500',
        fontFamily: 'SFProText-Bold'
    },
    bnt_HeaderRight: {
        paddingHorizontal: Size.defineSpace
    },
    bnt_primary: {
        height: Size.heightButton,
        backgroundColor: Colors.primary,
        borderRadius: 5,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bnt_danger: {
        height: Size.heightButton,
        backgroundColor: Colors.danger,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bnt_warning: {
        height: Size.heightButton,
        backgroundColor: Colors.warning,
        borderRadius: 5,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bnt_info: {
        height: Size.heightButton,
        backgroundColor: Colors.info,
        borderRadius: 5,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bnt_default: {
        height: Size.heightButton,
        backgroundColor: Colors.greySecondaryConstraint,
        borderRadius: 5,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    VnrText: {
        TitleGroup: {
            // flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: 'bold',
            borderBottomWidth: 1,
            borderColor: Colors.grey,
            paddingLeft: 5
        }
    },
    flexGrow1: {
        flexGrow: 1
    },
    opacity05: {
        opacity: 0.5
    },
    opacity1: {
        opacity: 1
    },
    border1: {
        borderColor: Colors.primary,
        borderWidth: 1
    },
    fontWeight500ColorPrimary: { fontWeight: '500', color: Colors.primary },
    flexGrow1flexDirectionColumn: {
        flexGrow: 1,
        flexDirection: 'column'
    },
    coatingOpacity05: {
        flex: 1,
        backgroundColor: Colors.black,
        opacity: 0.5
    },
    size100: {
        width: '100%',
        height: '100%'
    },
    size12: {
        width: 12,
        height: 12
    },
    flex1AlignCenter: {
        flex: 1,
        alignItems: 'center'
    },
    flex1Center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    flex1flexDirectionRow: {
        flex: 1,
        flexDirection: 'row'
    },
    coatingOpacity01: {
        flex: 1,
        backgroundColor: Colors.black,
        opacity: 0.1
    },
    rightActions: {
        maxWidth: 300,
        flexDirection: 'row',
        marginBottom: 0.5
    }
};

export const stylesScreenDetailV2 = StyleSheet.create({
    styItemContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderTopColor: Colors.gray_5,
        borderTopWidth: 0.5
        // maxWidth: Size.deviceWidth - (Size.defineSpace * 2),
        // flexWrap: 'wrap',
    },
    styItemContentColunm: {
        paddingVertical: 12,
        borderTopColor: Colors.gray_5,
        borderTopWidth: 0.5
    },
    styItemContentGroup: {
        paddingVertical: Size.defineSpace
    },
    styTextGroup: {
        color: Colors.black,
        fontSize: Size.text + 2,
        fontWeight: '600'
    },
    styViewValue: {
        flexShrink: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingLeft: Size.defineHalfSpace,
        minWidth: 160 - Size.defineSpace * 2
        // backgroundColor:Colors.red_5
        // maxWidth : (Size.deviceWidth - (Size.defineSpace * 2)) /2
    },
    viewLable: {
        flexShrink: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        minWidth: 160 - Size.defineSpace * 2
        // backgroundColor:Colors.primary_5
        // maxWidth : (Size.deviceWidth - (Size.defineSpace * 2)) /2
    },
    styViewValueLeft: {
        flex: 8,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: Size.defineSpace,
        minWidth: 160 - Size.defineSpace * 2
        // maxWidth : (Size.deviceWidth - (Size.defineSpace * 2)) /2
    },
    viewLableLeft: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'flex-start',
        minWidth: 160 - Size.defineSpace * 2
        // maxWidth : (Size.deviceWidth - (Size.defineSpace * 2)) /2
    },
    // styViewValue: {
    //   flexGrow: 1,
    //   justifyContent: 'center',
    //   alignItems:'flex-end',
    //   marginLeft: 15,
    //   minWidth : 100,
    // },
    // viewLable: {
    //   flexGrow: 1,
    //   justifyContent: 'center',
    //   alignItems: 'flex-start',
    //   minWidth: 100,
    // },

    styTextLableInfo: {},
    styTextValueInfo: {
        color: Colors.gray_7,
        textAlign: 'right'
    },
    styViewFileAttach: {
        backgroundColor: Colors.gray_2,
        padding: Size.defineSpace,
        paddingVertical: Size.defineHalfSpace,
        borderRadius: 8,
        marginVertical: Size.defineHalfSpace,
        paddingHorizontal: Size.defineSpace
    },
    styContentFile: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: Size.defineHalfSpace,
        marginRight: Size.defineHalfSpace
    },
    styTextDownload: {
        fontWeight: '500',
        marginLeft: Size.defineSpace,
        color: Colors.primary,
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
        textDecorationColor: Colors.primary
    },
    styViewStatusColor: {
        padding: Size.defineSpace,
        paddingVertical: Size.defineHalfSpace,
        borderRadius: 5,
        justifyContent: 'center',
        marginTop: Size.defineHalfSpace,
        alignItems: 'center',
        borderWidth: 0.5,
        marginBottom: Size.defineSpace
    },
    styInfoApprove: {
        justifyContent: 'flex-end',
        flexDirection: 'row'
    },
    styAvatarApprove: {
        width: 25,
        height: 25,
        borderRadius: 12.5
    },
    styNameApprove: {
        fontSize: Size.text - 1,
        marginLeft: 8,
        color: Colors.black,
        textAlign: 'right'
    },
    styViewWarning: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.danger,
        borderRadius: 7,
        padding: Size.defineHalfSpace,
        marginTop: Size.defineSpace
        // marginHorizontal: Size.defineSpace,
        // marginBottom: Size.defineHalfSpace,
    },
    styWarText: {
        color: Colors.danger
    },
    styTextValueDateTimeStatus: {
        fontSize: Size.text - 1,
        marginTop: 4
    },
    containerItemDetail: {
        flexDirection: 'column',
        paddingHorizontal: styleSheets.p_10,
        backgroundColor: Colors.white
    },
    bottomActions: {
        flexGrow: 1,
        minHeight: 40,
        marginVertical: 10,
        maxHeight: 45
    },
    styViewBtnShowHide: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Size.defineHalfSpace
    },
    styViewBtnShowHideText: {
        color: Colors.primary,
        marginLeft: 5
    },
    loadingFooter: {
        flex: 1,
        paddingVertical: styleSheets.p_10,
        marginBottom: 30
    }
});

const HIGHT_AVATAR = Size.deviceWidth >= 1024 ? 75 : Size.deviceWidth * 0.14;
const sizeBtnAdd = Size.deviceheight >= 1024 ? 80 : Size.deviceWidth * 0.15;
export const stylesScreenDetailV3 = StyleSheet.create({
    // styles List
    modalBackdrop: {
        flex: 1,
        backgroundColor: Colors.black,
        opacity: 0.5
    },
    containBotton: {
        flex: 1
    },
    containerGrey: {
        flex: 1,
        backgroundColor: Colors.gray_3
    },
    styleViewBorderButtom: {
        flex: 1,
        flexDirection: 'row',
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5
    },

    btnTitleGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5,
        paddingVertical: 10,
        paddingHorizontal: 8
    },

    checkTitleActive: {
        width: Size.iconSize - 3,
        height: Size.iconSize - 3,
        borderRadius: (Size.iconSize - 3) / 2,
        borderWidth: 1,
        borderColor: Colors.gray_8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 6
    },

    btnCheckAllAndUnChekAll: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.blue_1,
        padding: 8,
        borderRadius: 26,
        paddingHorizontal: 12
    },

    textTitleGroup: {
        fontSize: Size.text + 1
    },
    wrapBtnCreate: {
        position: 'absolute',
        right: Size.defineSpace,
        bottom: Size.defineSpace * 2,
        alignItems: 'flex-end'
    },
    btnCreate: {
        maxWidth: 80,
        maxHeight: 80,
        height: sizeBtnAdd,
        width: sizeBtnAdd,
        borderRadius: sizeBtnAdd / 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        zIndex: 2,
        elevation: 2
    },
    //----------------------//
    styIamgeType: {
        width: Size.iconSize + 15,
        height: Size.iconSize + 15,
        resizeMode: 'cover'
    },
    // style Avtar
    styListProfile: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        marginTop: 5
    },
    styListProfileItem: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        backgroundColor: Colors.gray_4,
        borderRadius: Size.borderRadiusCircle,
        marginRight: 5,
        marginBottom: 8
    },
    styAvatarUser: {
        paddingVertical: 12,
        flexDirection: 'row',
        backgroundColor: Colors.white,
        alignItems: 'center'
    },
    styViewAvatar: {},
    styAvatar: {
        height: HIGHT_AVATAR,
        width: HIGHT_AVATAR,
        backgroundColor: Colors.borderColor,
        borderRadius: HIGHT_AVATAR / 2 //HIGHT_AVATAR / 3,
    },
    styImgAvatar: {
        height: HIGHT_AVATAR,
        width: HIGHT_AVATAR,

        borderRadius: HIGHT_AVATAR / 2, // HIGHT_AVATAR / 3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    styViewProfile: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 10
    },
    styProfileName: {},
    styProfileText: {
        color: Colors.black,
        fontSize: Size.text + 2,
        fontWeight: Platform.OS == 'android' ? '700' : '500'
    },
    styleftContentAvatar: {
        width: HIGHT_AVATAR,
        height: HIGHT_AVATAR,
        resizeMode: 'cover',
        maxWidth: HIGHT_AVATAR,
        maxHeight: HIGHT_AVATAR,
        borderRadius: HIGHT_AVATAR / 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    // -------------- //
    styItemContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingVertical: Size.defineHalfSpace
        // borderTopColor: Colors.gray_5,
        // borderTopWidth: 0.5,
        // maxWidth: Size.deviceWidth - (Size.defineSpace * 2),
        // flexWrap: 'wrap',
    },
    wrapLevelApproveAndDisplaykey: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    },
    wrapLevelApprove: {
        width: Size.defineSpace + 2,
        height: Size.defineSpace + 2,
        borderRadius: Size.defineSpace,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.gray_4,
        marginRight: 8
    },
    wrapStraightLine: {
        height: '100%',
        width: 16,
        alignItems: 'center'
    },
    straightLine: {
        height: '100%',
        width: 1,
        backgroundColor: Colors.gray_7
    },
    styleComment: {
        backgroundColor: Colors.gray_3,
        padding: 8,
        borderRadius: 4
    },
    styMarginLeftCmt: { marginLeft: 44 + Size.defineSpace - 9 },
    styDateUpdate: { fontSize: Size.textSmall, fontWeight: '400', color: Colors.gray_7 },
    wrapInforApprover: {
        flex: 1,
        paddingLeft: 0,
        flexDirection: 'row',
        alignItems: 'center'
    },
    styItemContentColunm: {
        paddingVertical: 12,
        borderTopColor: Colors.gray_5,
        borderTopWidth: 0.5
    },
    styItemContentGroup: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Colors.gray_3,
        paddingVertical: Size.defineHalfSpace,
        marginHorizontal: -Size.defineSpace,
        paddingHorizontal: Size.defineSpace,
        marginBottom: Size.defineHalfSpace,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    styItemGroupCollapse: {
        marginBottom: 0,
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.gray_5
    },
    styTextGroup: {
        color: Colors.black,
        fontSize: Size.text + 1
        // marginLeft: Size.defineHalfSpace
    },
    styViewValue: {
        flex: 8,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: Size.defineSpace,
        minWidth: 160 - Size.defineSpace * 2
        // maxWidth : (Size.deviceWidth - (Size.defineSpace * 2)) /2
    },
    styViewValueJustify: {
        flexShrink: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingLeft: Size.defineHalfSpace,
        minWidth: 160 - Size.defineSpace * 2
    },
    viewLableJustify: {
        flexShrink: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        minWidth: 160 - Size.defineSpace * 2
    },
    viewLable: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'flex-start',
        minWidth: 160 - Size.defineSpace * 2
        // maxWidth : (Size.deviceWidth - (Size.defineSpace * 2)) /2
    },
    // styViewValue: {
    //   flexGrow: 1,
    //   justifyContent: 'center',
    //   alignItems:'flex-end',
    //   marginLeft: 15,
    //   minWidth : 100,
    // },
    // viewLable: {
    //   flexGrow: 1,
    //   justifyContent: 'center',
    //   alignItems: 'flex-start',
    //   minWidth: 100,
    // },

    styTextLableInfo: {},
    styTextValueInfo: {
        color: Colors.black,
        textAlign: 'left'
    },
    styViewFileAttach: {
        backgroundColor: Colors.gray_2,
        padding: Size.defineSpace,
        paddingVertical: Size.defineHalfSpace,
        borderRadius: 3,
        marginVertical: Size.defineHalfSpace,
        paddingHorizontal: Size.defineSpace,
        borderWidth: 0.5,
        borderColor: Colors.gray_5
    },
    styContentFile: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginVertical: Size.defineHalfSpace
        // marginRight: Size.defineHalfSpace
    },
    styTextDownload: {
        marginLeft: Size.defineSpace,
        color: Colors.black
        // textDecorationLine: 'underline',
        // textDecorationStyle: 'solid',
        // textDecorationColor: Colors.black,
    },
    styViewStatusColor: {
        flexDirection: 'row',
        padding: Size.defineSpace,
        paddingVertical: Size.defineHalfSpace,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1.7,
        marginHorizontal: -Size.defineSpace
    },
    styViewStatusColorNew: {
        borderBottomWidth: 0,
        borderRadius: 5,
        paddingVertical: 2,
        paddingHorizontal: 10
    },
    styInfoApprove: {
        justifyContent: 'flex-end',
        flexDirection: 'row'
    },
    styAvatarApprove: {
        width: 25,
        height: 25,
        borderRadius: 12.5
    },
    styNameApprove: {
        fontSize: Size.text - 1,
        marginLeft: 8,
        color: Colors.black,
        textAlign: 'right'
    },
    styViewWarning: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.danger,
        borderRadius: 7,
        padding: Size.defineHalfSpace,
        marginTop: Size.defineSpace
        // marginHorizontal: Size.defineSpace,
        // marginBottom: Size.defineHalfSpace,
    },
    styWarText: {
        color: Colors.danger
    },
    styStatusWrap: {
        maxWidth: '70%',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    styTimeWrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    styTextValueDateTimeStatus: {
        fontSize: Size.text - 1,
        color: Colors.gray_8
    },
    containerItemDetail: {
        flexDirection: 'column',
        paddingHorizontal: styleSheets.p_10,
        backgroundColor: Colors.white
    },
    bottomActions: {
        flexGrow: 1,
        minHeight: 40,
        marginVertical: 10,
        maxHeight: 45
    },
    styViewBtnShowHide: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Size.defineHalfSpace
    },
    styViewBtnShowHideText: {
        color: Colors.primary,
        marginLeft: 5
    },

    separator: {
        height: 0.5,
        width: 'auto',
        backgroundColor: Colors.grey,
        marginHorizontal: styleSheets.p_10
    },

    loadingFooter: {
        flex: 1,
        paddingBottom: styleSheets.p_20,
        marginBottom: 60
    },

    borderRadius: {
        backgroundColor: Colors.primary,
        borderRadius: 100,
        borderWidth: 0
    },

    searchIsHaveFilter: {
        marginTop: 0,
        paddingTop: 80
    },

    searchIsNotHaveFilter: {
        marginTop: Size.defineHalfSpace,
        paddingTop: 0
    },

    checkAll: {
        backgroundColor: Colors.primary,
        borderRadius: 100,
        borderWidth: 0
    }
});

export const stylesToaster = {
    modal: {
        backgroundColor: Colors.white,
        position: 'absolute',
        width: Size.deviceWidth - Size.defineSpace * 2,
        marginHorizontal: Size.defineSpace,
        borderColor: Colors.danger,
        borderWidth: 1,
        paddingVertical: 0,
        borderRadius: styleSheets.radius_10
    },
    contentToaster: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    left: {
        flex: 1.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    center: {
        flex: 8.5,
        justifyContent: 'center',
        paddingVertical: styleSheets.p_5
    },
    right: {
        flex: 1.5,
        alignItems: 'center'
    }
};

export const stylesVnrDate = {
    bntPicker: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: Colors.gray_5,
        borderWidth: 0.5,
        borderRadius: 7,
        paddingHorizontal: Size.defineSpace,
        backgroundColor: Colors.white
    },
    bntPickerDisable: {
        backgroundColor: Colors.gray_3,
        borderWidth: 0
    },
    selectPicker: {
        flex: 1,
        flexDirection: 'row',
        minHeight: Size.heightInput,
        maxHeight: Size.heightInput
    },
    stylePlaceholder: {
        color: Colors.grey
    },
    styLableValue: {
        fontSize: Size.text,
        fontWeight: '500'
    }
};

export const stylesModalPopupBottom = {
    viewModal: {
        backgroundColor: Colors.white,
        height: Size.deviceheight * 0.7,
        width: Size.deviceWidth,
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },
    viewModalTime: {
        backgroundColor: Colors.white,
        height: Size.deviceheight * 0.35,
        width: Size.deviceWidth,
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },
    viewModalBussiness: {
        backgroundColor: Colors.white,
        height: Size.deviceheight * 0.35,
        width: Size.deviceWidth,
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },
    safeRadius: {
        flex: 1,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },

    styleScrollVew: {
        paddingBottom: 30
    },
    styleViewBntApprove: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        flex: 1,
        alignItems: 'flex-end',
        paddingVertical: 15
    },
    bntCancel: {
        width: '30%',
        height: 40,
        borderRadius: 15,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colors.black,
        borderWidth: 0.5
    },
    bntApprove: {
        flex: 1,
        height: 40,
        borderRadius: 15,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewEditModal: {
        backgroundColor: Colors.white,
        height: Size.deviceheight * 0.7,
        width: Size.deviceWidth,
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },
    headerCloseModal: {
        paddingVertical: 15,
        flexDirection: 'row',
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: Colors.borderColor,
        borderBottomWidth: 0.5
    },
    titleModal: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    //styles Error
    fontText: {
        fontSize: Size.text - 1
    },
    viewInfo: {
        flex: 1
    },
    Line: {
        flex: 1,
        flexDirection: 'row',
        maxWidth: '100%',
        marginVertical: 2
    },
    scrollViewError: {
        flexGrow: 1,
        flexDirection: 'column',
        paddingHorizontal: Size.defineSpace
    },
    groupButton: {
        flexGrow: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: styleSheets.p_10,
        backgroundColor: Colors.white,
        marginTop: 10,
        marginBottom: 10
    },
    btnClose: {
        height: Size.heightButton,
        backgroundColor: Colors.borderColor,
        borderRadius: styleSheets.radius_5,
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5
    }
};

export const stylesVnrFilter = {
    formDate_To_From: {
        flex: 1,
        flexDirection: 'row'
    },
    controlDate_from: {
        flex: 5
    },
    controlDate_To: {
        flex: 5,
        marginLeft: 10
    },
    contentViewControl: {
        paddingHorizontal: Size.defineSpace,
        paddingVertical: Size.defineHalfSpace
    },
    viewLable: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    viewControl: {
        flexDirection: 'row',
        marginTop: Size.defineHalfSpace
    },
    styLableText: {
        fontSize: Size.text - 4,
        textTransform: 'uppercase',
        color: Colors.greySecondary
    },
    bnt_Cancel: {
        height: Size.heightButton,
        backgroundColor: Colors.danger,
        borderRadius: styleSheets.radius_5,
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: styleSheets.m_10
    },

    btn_ClearFilter: {
        height: Size.heightButton,
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: styleSheets.m_10,
        borderRadius: Size.borderRadiusBotton,
        backgroundColor: Colors.gray_3,
        borderWidth: 0.5,
        borderColor: Colors.gray_5
    },

    bnt_Ok: {
        height: Size.heightButton,
        backgroundColor: Colors.primary,
        borderRadius: styleSheets.radius_5,
        flex: 7,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    wrapNumberCountFilter: {
        backgroundColor: 'red',
        position: 'absolute',
        top: -10,
        right: 0,
        width: 24,
        height: 24,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center'
    }
};

export const styleVnrListItem = {
    VnrListItem: {
        container: {
            flex: 1,
            zIndex: 0
        },
        item: {
            justifyContent: 'space-between',
            flexDirection: 'row',
            padding: styleSheets.p_10
        },
        title: {
            fontSize: 16
        },
        leftContent: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: styleSheets.p_10
        },
        circle: {
            justifyContent: 'center',
            alignItems: 'center',
            width: 25,
            height: 25,
            borderRadius: 25 / 2
        }
    },
    RenderItem: {
        swipeable: { paddingHorizontal: 10 },
        bnt_icon: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        },
        icon: {
            paddingBottom: styleSheets.p_5
        },
        container: {
            flex: 1,
            flexDirection: 'row'
        },
        leftContent: {
            minWidth: 40,
            maxWidth: 40,
            flex: 1,
            flexDirection: 'column',
            padding: styleSheets.p_10,
            // paddingBottom: styleSheets.p_5,
            alignItems: 'center',
            justifyContent: 'center'
        },
        rightContent: {
            flex: 1,
            flexDirection: 'column',
            paddingVertical: styleSheets.p_10,
            // paddingBottom: styleSheets.p_5,
            backgroundColor: Colors.white,
            alignItems: 'center',
            marginBottom: 0.5
            // borderBottomWidth: 0.5,
            // borderBottomColor: Colors.grey,
        },
        borderItem: {
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.grey
        },
        itemRow: {
            flex: 1,
            flexDirection: 'row',
            marginBottom: styleSheets.m_5,
            justifyContent: 'space-between'
        },
        leftContentAction: {
            flexDirection: 'column',
            padding: styleSheets.p_10,
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 100
        },
        viewIcon: {
            //backgroundColor: Colors.info,
            minWidth: 70,
            borderRightColor: Colors.white,
            borderRightWidth: 0.3,
            paddingHorizontal: styleSheets.p_10
            //justifyContent:'center',
            // alignItems:'center'
        }
    },
    BottomActions: {
        number: {
            color: Colors.primary
        },
        itemaACtionleft: {
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'row',
            paddingLeft: styleSheets.m_10
        },
        itemaACtionCenter: {
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row'
        },
        itemaACtionRight: {
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row'
        },
        trashlefticon: {
            marginRight: styleSheets.m_5
        },
        iconHighLight: {
            paddingVertical: styleSheets.p_5,
            paddingHorizontal: styleSheets.p_10,
            borderRadius: styleSheets.radius_5
        },
        actionHeader: {
            position: 'absolute',
            minWidth: Size.deviceWidth,
            backgroundColor: Colors.white,
            zIndex: 1,
            bottom: 0,
            borderTopColor: Colors.gray_5,
            borderTopWidth: 0.5,
            flexDirection: 'row'
        }
    },
    TopActions: {
        number: {
            fontSize: 18,
            color: Colors.primary
        },
        trashlefticon: {
            marginRight: styleSheets.m_5
        },
        iconHighLight: {
            paddingHorizontal: styleSheets.p_5,
            borderRadius: styleSheets.radius_5
        },
        iconLeftAction: {
            paddingHorizontal: styleSheets.p_15,
            borderRadius: styleSheets.radius_5
        },
        actionHeader: {
            top: 0,
            width: Size.deviceWidth,
            backgroundColor: Colors.white,
            zIndex: 1,
            borderBottomColor: Colors.grey,
            borderBottomWidth: 0.5,
            flexDirection: 'row',
            height: 65,
            padding: styleSheets.p_10
        },
        ActionList: {
            flex: 1,
            height: '100%',
            borderWidth: 0.5,
            borderColor: Colors.grey,
            borderRadius: styleSheets.radius_5,
            flexDirection: 'row'
        },
        leftAction: {
            flex: 2,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around'
        },
        rightAction: {
            flex: 8,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center'
        }
    },
    VnrListItemAction: {
        container: {
            flex: 1,
            zIndex: 0
        },
        item: {
            justifyContent: 'space-between',
            flexDirection: 'row',
            padding: styleSheets.p_10
        },
        title: {
            fontSize: 16
        },
        leftContent: {
            flex: 1,
            flexDirection: 'column',
            paddingHorizontal: styleSheets.p_10,
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingTop: styleSheets.p_10
        },
        circle: {
            justifyContent: 'center',
            alignItems: 'center',
            width: Size.deviceWidth * 0.12,
            height: Size.deviceWidth * 0.12,
            borderRadius: (Size.deviceWidth * 0.12) / 2,
            borderColor: Colors.primary,
            borderWidth: 1
        },
        avatarUser: {
            width: Size.deviceWidth * 0.12,
            height: Size.deviceWidth * 0.12,
            borderRadius: (Size.deviceWidth * 0.12) / 2,
            resizeMode: 'cover',
            backgroundColor: Colors.borderColor
        },
        txtCricle: {
            color: Colors.white
        },
        styleViewBorderButtom: {
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.borderColor,
            flex: 1,
            flexDirection: 'row',
            marginBottom: 0.5
        }
    },
    RenderItemAction: {
        container: {
            flex: 1,
            flexDirection: 'row'
        },
        leftContent: {
            minWidth: 40,
            maxWidth: 40,
            flex: 1,
            flexDirection: 'column',
            padding: styleSheets.p_10,
            paddingBottom: styleSheets.p_5,
            alignItems: 'center',
            justifyContent: 'center'
        },
        rightContent: {
            flex: 1,
            flexDirection: 'column',
            padding: styleSheets.p_10,
            paddingBottom: styleSheets.p_5,
            backgroundColor: Colors.white
            //alignItems: "center",
        },
        itemRow: {
            flex: 1,
            flexDirection: 'row',
            marginBottom: styleSheets.m_5,
            justifyContent: 'space-between'
        },
        leftContentAction: {
            flexDirection: 'column',
            padding: styleSheets.p_10,
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 100
        },
        Line: {
            flex: 1,
            flexDirection: 'row',
            maxWidth: '100%'
        }
    }
};

export const styleSwipeableAction = StyleSheet.create({
    bnt_icon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5
    },
    icon: {
        flex: 1,
        maxHeight: 60,
        maxWidth: 80,
        width: Size.deviceWidth * 0.16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Size.defineSpace * 0.5
    },
    viewIcon: {
        marginHorizontal: Size.defineSpace
    },
    wrapStyleSwipeableAction: {
        width: Size.deviceWidth / 2,
        minWidth: 100,
        flexDirection: 'row',
        marginBottom: 0.5
    },
    bnt_iconV3: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconV3: {
        flex: 1,
        height: '100%',
        width: Size.deviceWidth / 4,
        minWidth: 55,
        borderRadius: 0,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export const styleVnrListItemOvertime = {
    VnrListItem: {
        container: {
            flex: 1,
            zIndex: 0
        },
        item: {
            justifyContent: 'space-between',
            flexDirection: 'row',
            padding: styleSheets.p_10
        },
        title: {
            fontSize: 16
        },
        leftContent: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: styleSheets.p_10
        },
        circle: {
            justifyContent: 'center',
            alignItems: 'center',
            width: 25,
            height: 25,
            borderRadius: 25 / 2
        }
    },
    BottomActions: {
        number: {
            color: Colors.primary
        },
        itemaACtionleft: {
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: styleSheets.m_10
        },
        itemaACtionCenter: {
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row'
        },
        itemaACtionRight: {
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row'
        },
        trashlefticon: {
            marginRight: styleSheets.m_5
        },
        iconHighLight: {
            paddingVertical: styleSheets.p_5,
            paddingHorizontal: styleSheets.p_10,
            borderRadius: styleSheets.radius_5
        },
        actionHeader: {
            position: 'absolute',
            minWidth: Size.deviceWidth,
            backgroundColor: Colors.white,
            zIndex: 1,
            bottom: 0,
            borderTopColor: Colors.grey,
            borderTopWidth: 0.5,
            flexDirection: 'row'
        }
    },
    TopActions: {
        number: {
            color: Colors.primary
        },
        trashlefticon: {
            marginRight: styleSheets.m_7,
            borderWidth: 1,
            padding: 5,
            borderRadius: styleSheets.radius_5,
            backgroundColor: Colors.white
        },
        iconHighLight: {
            // paddingHorizontal: 1,
            borderRadius: styleSheets.radius_5
        },
        iconLeftAction: {
            flexDirection: 'row',
            paddingHorizontal: styleSheets.p_5,
            ///backgroundColor:'red',
            alignItems: 'center'
        },
        txtTitleBntAction: {
            marginRight: styleSheets.m_5
        },
        actionHeader: {
            top: 0,
            width: Size.deviceWidth,
            backgroundColor: Colors.borderColor,
            zIndex: 1,
            height: 120,
            padding: styleSheets.p_10
        },
        contentActionHeader: {
            flex: 1,
            height: '100%',
            borderWidth: 0.5,
            borderColor: Colors.grey,
            borderRadius: styleSheets.radius_5
        },
        ActionList: {
            flex: 1,
            flexDirection: 'row'
        },

        leftAction: {
            //flex: 2,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around'
        },
        rightAction: {
            flex: 8,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center'
        }
    },
    VnrListItemAction: {
        container: {
            flex: 1,
            zIndex: 0
        },
        item: {
            justifyContent: 'space-between',
            flexDirection: 'row',
            padding: styleSheets.p_10
        },
        title: {
            fontSize: 16
        },
        leftContent: {
            flex: 1,
            flexDirection: 'column',
            paddingHorizontal: styleSheets.p_10,
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingTop: styleSheets.p_10
        },
        circle: {
            justifyContent: 'center',
            alignItems: 'center',
            width: Size.deviceWidth * 0.12,
            height: Size.deviceWidth * 0.12,
            borderRadius: (Size.deviceWidth * 0.12) / 2,
            borderColor: Colors.primary,
            borderWidth: 1
        },
        avatarUser: {
            width: Size.deviceWidth * 0.12,
            height: Size.deviceWidth * 0.12,
            borderRadius: (Size.deviceWidth * 0.12) / 2,
            resizeMode: 'cover',
            backgroundColor: Colors.borderColor
        },
        txtCricle: {
            color: Colors.white
        },
        styleViewBorderButtom: {
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.borderColor,
            flex: 1,
            flexDirection: 'row',
            marginBottom: 0.5
        }
    },
    RenderItemAction: {
        container: {
            flex: 1,
            flexDirection: 'row'
        },
        leftContent: {
            minWidth: 40,
            maxWidth: 40,
            flex: 1,
            flexDirection: 'column',
            padding: styleSheets.p_10,
            paddingBottom: styleSheets.p_5,
            alignItems: 'center',
            justifyContent: 'center'
        },
        rightContent: {
            flex: 1,
            flexDirection: 'column',
            padding: styleSheets.p_10,
            paddingBottom: styleSheets.p_5,
            backgroundColor: Colors.white
            //alignItems: "center",
        },
        itemRow: {
            flex: 1,
            flexDirection: 'row',
            marginBottom: styleSheets.m_5,
            justifyContent: 'space-between'
        },
        leftContentAction: {
            flexDirection: 'column',
            padding: styleSheets.p_10,
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 100
        },
        Line: {
            flex: 1,
            flexDirection: 'row',
            maxWidth: '100%'
        }
    },

    ViewTopInfoOvertime: {
        contentTopViewInfo: {
            width: Size.deviceWidth,
            height: 120,
            backgroundColor: Colors.borderColor,
            flexDirection: 'row'
        },
        leftCotentInfo: {
            flex: 5,
            width: 'auto',
            height: '100%',
            alignContent: 'space-between',
            justifyContent: 'space-around',
            paddingLeft: styleSheets.p_5,
            borderRightWidth: 0.5,
            borderRightColor: Colors.greySecondary,
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.greySecondary
        },
        styleOption: {
            flexDirection: 'row',
            //flex: 1,
            paddingRight: styleSheets.p_5
            // alignContent:'space-around',
            // justifyContent:'space-between'
        },
        lebleCheckbox: {
            fontSize: Size.text,
            marginHorizontal: 3,
            color: Colors.greySecondary
        },
        styleCheckBox: {
            flexDirection: 'row',
            flex: 1
        },
        righCotentInfo: {
            width: 'auto',
            flex: 5,
            height: '100%'
        },
        styleViewTitle: {
            paddingVertical: styleSheets.p_5,
            justifyContent: 'center',
            alignItems: 'center'
        },
        listViewMonth: {
            flexDirection: 'row',
            flex: 1
        },
        viewOption: {
            flex: 1,
            height: '100%',
            borderRightWidth: 0.5,
            borderRightColor: Colors.greySecondary,
            borderTopWidth: 0.5,
            borderTopColor: Colors.greySecondary
        },
        option: {
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.greySecondary,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        },
        option_number: {
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.greySecondary,
            paddingVertical: styleSheets.p_7,
            alignItems: 'center'
        },
        lebleTxtHour: {
            fontSize: Size.text,
            color: Colors.greySecondary
        },
        txtStyleHour: {
            color: Colors.greySecondary
        },
        txtStyleNumberOld: {
            color: Colors.green
        },
        txtStyleNumberCurrent: {
            color: Colors.primary
        },
        txtColorSeconary: {
            color: Colors.primary
        },
        txtColorWarning: {
            color: Colors.warning
        }
    }
    // new style AttApproveOvertime //
    // ViewTopInfoOvertime: {
    //   contentTopViewInfo: {
    //     width: Size.deviceWidth,
    //     height: 120,
    //     backgroundColor: Colors.primary,
    //     flexDirection: 'row',
    //   },
    //   leftCotentInfo: {
    //     flex: 5,
    //     width: 'auto',
    //     height: '100%',
    //     alignContent: 'space-between',
    //     justifyContent: 'space-around',
    //     paddingLeft: styleSheets.p_5,
    //     borderRightWidth: 0.5,
    //     borderRightColor: Colors.greySecondary,
    //     borderBottomWidth: 0.5,
    //     borderBottomColor: Colors.greySecondary,
    //   },
    //   styleOption: {
    //     flexDirection: 'row',
    //     //flex: 1,
    //     paddingRight: styleSheets.p_5,
    //     // alignContent:'space-around',
    //     // justifyContent:'space-between'
    //   },
    //   lebleCheckbox: {
    //     color: Colors.white,
    //   },
    //   styleCheckBox: {
    //     flexDirection: 'row',
    //     flex: 1,
    //   },
    //   righCotentInfo: {
    //     // width: 'auto',
    //     flex: 1,
    //     height: '100%',
    //     alignItems: 'center',
    //   },
    //   styleViewTitle: {
    //     paddingVertical: 7,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     backgroundColor: Colors.whiteOpacity30,
    //     // marginHorizontal: 50,
    //     width: Size.deviceWidth * 0.7,
    //     borderTopLeftRadius: 5,
    //     borderTopRightRadius: 5,
    //     marginBottom: 0.5
    //   },
    //   listViewMonth: {
    //     flexDirection: 'row',
    //     flex: 1,
    //     borderColor: Colors.white,
    //     borderWidth: 0.5,
    //     borderRightWidth: 0
    //   },
    //   viewOption: {
    //     flex: 1,
    //     height: '100%',
    //     borderRightWidth: 0.5,
    //     borderRightColor: Colors.white,
    //     // borderTopWidth: 0.5,
    //     // borderTopColor: Colors.white,
    //   },
    //   option: {
    //     borderBottomWidth: 0.5,
    //     borderBottomColor: Colors.white,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     height: '50%'
    //   },
    //   option_number: {
    //     borderBottomWidth: 0.5,
    //     borderBottomColor: Colors.white,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     height: '50%'
    //   },
    //   lebleTxtHour: {
    //     fontSize: Size.text,
    //     color: Colors.white,
    //   },
    //   txtStyleHour: {
    //     color: Colors.white,
    //   },
    //   txtStyleNumberOld: {
    //     color: Colors.white,
    //   },
    //   txtStyleNumberCurrent: {
    //     color: Colors.yellow,
    //   },
    //   txtColorSeconary: {
    //     color: Colors.yellow,
    //   },
    //   txtColorWarning: {
    //     color: Colors.yellow,
    //   },
    // },
};

export const stylesVnrLoading = {
    VnrLoading: {
        container: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }
    },
    VnrLoadingPages: {},
    loadingInList: {
        flex: 1,
        paddingVertical: styleSheets.p_10,
        marginBottom: 30
    }
};

export const stylesVnrPicker = {
    VnrPicker: StyleSheet.create({
        styLableValue: {
            fontWeight: '500',
            fontSize: Size.text
        },
        stylePlaceholder: {
            color: Colors.gray_7
        },
        textInput: {
            height: Size.heightInput,
            paddingLeft: 5
        },
        modalStyle: {
            flex: 1
        },
        bottomModal: {
            // flex: 1,
            width: '100%',
            flexDirection: 'row',
            // borderTopWidth: 0.5,
            // borderTopColor: Colors.grey,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: styleSheets.p_10,
            minHeight: 60
        },
        headerSearch: {
            flex: 9,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderColor: Colors.gray_5,
            borderWidth: 0.5,
            borderRadius: 5,
            paddingHorizontal: styleSheets.p_10,
            maxHeight: Size.heightInput
        },
        headerClose: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            height: 36,
            marginLeft: styleSheets.p_10
        },
        bnt_Cancel: {
            flex: 5,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
        },
        bnt_Close: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
        },
        bnt_Ok: {
            flex: 5,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
        },
        item: {
            justifyContent: 'space-between',
            flexDirection: 'row',
            padding: styleSheets.p_10,
            marginHorizontal: styleSheets.m_10,
            borderBottomColor: Colors.grey,
            borderBottomWidth: 0.5
        },
        title: {
            fontSize: 16
        },
        topModal: {
            flex: 1,
            // borderBottomColor: Colors.grey,
            // borderBottomWidth: 0.5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: styleSheets.p_10,
            maxHeight: 70,
            minHeight: 40
        },
        bntPicker: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderColor: Colors.gray_5,
            borderWidth: 0.5,
            borderRadius: Size.borderPicker,
            paddingHorizontal: Size.defineSpace,
            backgroundColor: Colors.white
        },
        bntPickerDisable: {
            backgroundColor: Colors.gray_3,
            borderWidth: 0
        },
        selectPicker: {
            flex: 1,
            flexDirection: 'row',
            height: Size.heightInput
        },
        ScroollviewModal: {
            flex: 1
        },
        styViewDrop: {
            flex: 1,
            backgroundColor: Colors.black,
            opacity: 0.5
        }
    }),
    Item: {
        item: {
            justifyContent: 'space-between',
            flexDirection: 'row',
            minHeight: 50,
            alignItems: 'center',
            marginHorizontal: Size.defineSpace,
            marginBottom: 2,
            borderBottomColor: Colors.gray_5,
            borderBottomWidth: 0.5
        },
        title: {
            fontSize: 16
        }
    }
};

export const stylesVnrPickerV3 = StyleSheet.create({
    wrapHeaderTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: Size.defineSpace,
        paddingTop: Size.defineSpace,
        paddingBottom: Size.defineHalfSpace
    },
    styViewTitle: {
        flex: 8.5,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    styDefTitle: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginRight: 6
    },
    styDefTitleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Size.defineSpace
    },
    styViewLayoutFilter: {
        width: '100%',
        height: 'auto',
        paddingTop: Size.defineHalfSpace,
        paddingHorizontal: Size.defineSpace,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    styWarpLayoutFilter: {
        flex: 1,
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    styLableLayoutFilter: {
        fontSize: Size.text + 1,
        color: Colors.gray_10
    },
    styRemoveLayoutFilter: {
        color: Colors.red,
        fontSize: Size.text + 1
    },
    styIconLayoutFilter: {
        height: Size.iconSize * 1.5,
        width: Size.iconSize * 1.5,
        backgroundColor: Colors.gray_4,
        borderRadius: (Size.iconSize * 1.5) / 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewInputMultiline: {
        minHeight: 53,
        borderColor: Colors.gray_5,
        backgroundColor: Colors.white
        // paddingLeft: Size.defineSpace
    },
    styContentPicker: {
        height: 53
    },
    styBntPickerError: {
        borderBottomColor: Colors.red,
        borderBottomWidth: 1
    },
    styBntPicker: {
        flex: 1,
        flexDirection: 'row',

        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5,

        paddingHorizontal: Size.defineSpace,
        backgroundColor: Colors.white,
        alignItems: 'center'
    },
    styLeftPicker: {
        flex: 1
    },
    styRightPicker: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    styLbPicker: {
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    styLbHaveValuePicker: {
        fontSize: Size.text - 1.5,
        color: Colors.gray_8
    },
    styLbNotHaveValuePicker: {
        fontSize: Size.text + 1,
        color: Colors.gray_8,
        marginLeft: Size.defineHalfSpace
    },
    styLbNoValuePicker: {
        fontSize: Size.text + 1,
        color: Colors.gray_8
    },
    styVlPicker: {
        flexDirection: 'row'
    },
    styLableValue: {
        fontWeight: '500',
        fontSize: Size.text + 1
    },
    styBtnClear: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },

    stylePlaceholder: {
        color: Colors.gray_7
    },
    textInput: {
        height: Size.heightInput,
        paddingLeft: 5
    },
    modalStyle: {
        flex: 1
    },
    bottomModal: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: styleSheets.p_10,
        minHeight: 60
    },
    headerSearch: {
        flex: 9,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: Colors.gray_5,
        borderWidth: 0.5,
        borderRadius: 5,
        paddingHorizontal: styleSheets.p_10,
        maxHeight: Size.heightInput
    },
    headerClose: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        height: 36,
        marginLeft: styleSheets.p_10
    },
    bnt_Cancel: {
        flex: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bnt_Close: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bnt_Ok: {
        flex: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    item: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: styleSheets.p_10,
        marginHorizontal: styleSheets.m_10,
        borderBottomColor: Colors.grey,
        borderBottomWidth: 0.5
    },
    title: {
        fontSize: 16
    },
    topModal: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: styleSheets.p_10,
        maxHeight: 70,
        minHeight: 40
    },

    bntPickerDisable: {
        backgroundColor: Colors.gray_3,
        borderWidth: 0
    },
    selectPicker: {
        flex: 1,
        flexDirection: 'row',
        height: Size.heightInput
    },
    ScroollviewModal: {
        flex: 1
    },

    onlyFlRowSpaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});

export const stylesVnrPickerMulti = {
    VnrPickerMulti: {
        textInput: {
            height: Size.heightInput,
            paddingLeft: 5
        },
        stylePlaceholder: {
            color: Colors.grey
        },
        headerSearch: {
            flex: 9,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderColor: Colors.gray_5,
            borderWidth: 0.5,
            borderRadius: 5,
            paddingHorizontal: styleSheets.p_10,
            maxHeight: Size.heightInput
        },
        bnt_Cancel: {
            flex: 5,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
        },
        bnt_Ok: {
            flex: 5,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
        },
        item: {
            justifyContent: 'space-between',
            flexDirection: 'row',
            padding: styleSheets.p_10,
            marginHorizontal: styleSheets.m_10,
            borderBottomColor: Colors.grey,
            borderBottomWidth: 0.5
        },
        title: {
            fontSize: 16
        },
        topModal: {
            flex: 1,
            // borderBottomColor: Colors.grey,
            // borderBottomWidth: .5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: styleSheets.p_10,
            maxHeight: 70,
            minHeight: 40
        },
        bottomModal: {
            flex: 1,
            flexDirection: 'row',
            // borderTopWidth: 0.5,
            // borderTopColor: Colors.grey,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: styleSheets.p_10
        },
        bntPicker: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            //marginHorizontal: styleSheets.m_10,
            borderColor: Colors.gray_5,
            borderWidth: 0.5,
            borderRadius: Size.borderPicker,
            paddingHorizontal: Size.defineSpace
        },
        bntPickerDisable: {
            backgroundColor: Colors.gray_3,
            borderWidth: 0
        },
        ScroollviewModal: {
            flex: 1
            //height: "auto"//Size.deviceheight - heightStautsBar// - 100
        },
        multiiSelect: {
            flex: 1,
            flexDirection: 'row',
            height: Size.heightInput
        },
        multiSelectRight: {
            flexDirection: 'row',
            marginLeft: styleSheets.m_5,
            alignItems: 'center',
            marginRight: -styleSheets.m_10,
            marginVertical: -styleSheets.m_10
        },
        bntDeleteAll: {
            minWidth: 25,
            justifyContent: 'center',
            //backgroundColor:Colors.grey,
            alignItems: 'center'
        }
    },
    Item: {
        styCheckBox: {
            height: Size.iconSize * 1.2,
            width: Size.iconSize * 1.2,
            borderRadius: (Size.iconSize * 1.2) / 2,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: Colors.gray_7
        },
        styDeactive: {
            backgroundColor: Colors.primary,
            borderColor: Colors.primary
        },
        item: {
            justifyContent: 'space-between',
            flexDirection: 'row',
            minHeight: 50,
            alignItems: 'center',
            marginHorizontal: Size.defineSpace,
            borderBottomColor: Colors.gray_5,
            borderBottomWidth: 0.5,
            backgroundColor: Colors.white
        },
        itemActive: {
            backgroundColor: Colors.primary
        }
    },
    List: {
        item: {
            justifyContent: 'space-between',
            flexDirection: 'row',
            padding: styleSheets.p_10
        },
        title: {
            fontSize: 16
        }
    },
    MultiItem: {
        multiItem: {
            justifyContent: 'space-between',
            flexDirection: 'row',
            paddingHorizontal: styleSheets.p_5,
            marginHorizontal: styleSheets.m_5,
            borderColor: Colors.grey,
            borderWidth: 0.5,
            //backgroundColor:Colors.grey,
            alignItems: 'center',
            borderRadius: styleSheets.radius_5,
            paddingVertical: styleSheets.m_5
        },
        titleItem: {
            fontSize: Size.text,
            marginRight: styleSheets.m_5
        },
        bnt_delete: {
            //paddingVertical: styleSheets.p_5,
            alignItems: 'center',
            width: 25
        },

        borderDetele: {
            backgroundColor: Colors.grey,
            borderColor: Colors.black,
            borderWidth: 0.5,
            borderRadius: styleSheets.radius_5,
            marginVertical: -styleSheets.m_5,
            marginRight: -styleSheets.m_5
        }
    }
};

export const stylesVnrTreeView = {
    selectPicker: {
        flex: 1,
        flexDirection: 'row',
        minHeight: Size.heightInput,
        backgroundColor: Colors.white
        //maxHeight: Size.heightInput,
    },
    bntPicker: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: Colors.gray_5,
        borderWidth: 0.5,
        borderRadius: Size.borderPicker,
        paddingHorizontal: Size.defineSpace,
        backgroundColor: Colors.white
    },
    bnt_Cancel: {
        flex: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    bnt_Ok: {
        flex: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerSearch: {
        flex: 9,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: Colors.gray_5,
        borderWidth: 0.5,
        borderRadius: 5,
        paddingHorizontal: styleSheets.p_10,
        maxHeight: Size.heightInput
    },
    textInput: {
        height: Size.heightInput,
        paddingLeft: 5
    },
    headerTop: {
        maxHeight: 100,
        minHeight: 80,
        flex: 1,
        paddingHorizontal: Size.defineSpace
    },
    bottomModal: {
        flex: 1,
        flexDirection: 'row',
        // borderTopWidth: 0.5,
        // borderTopColor: Colors.grey,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: styleSheets.p_10
    },
    bntPickerDisable: {
        backgroundColor: Colors.gray_3,
        borderWidth: 0
    },
    headerTopUpon: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 10
    },
    styBtnRefresh: {
        backgroundColor: Colors.gray_3,
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginLeft: 10,
        justifyContent: 'center'
    },
    styViewData: { flex: 8, paddingTop: 15 }
};

export const styleContentFilter = StyleSheet.create({
    contentFilter: {
        flex: 1,
        backgroundColor: Colors.white,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        //padding: styleSheets.p_10,
        //flex:1,
        height: 65,
        maxHeight: 65,
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5,
        paddingVertical: 10,
        paddingHorizontal: Size.defineSpace
    },
    filter: {
        flex: 1,
        flexDirection: 'row',
        borderColor: Colors.gray_5,
        borderWidth: 0.5,
        paddingVertical: Size.defineSpace / 2,
        borderRadius: styleSheets.radius_5,
        paddingHorizontal: Size.defineSpace
    },
    search: {
        height: '100%',
        paddingVertical: 0,
        backgroundColor: Colors.white
    },
    leftIcon: {
        height: '100%',
        justifyContent: 'center',
        marginRight: styleSheets.m_5
    },
    viewFilter: {
        height: '100%',
        // marginLeft: styleSheets.m_5,
        justifyContent: 'center'
    }
});

export const styleContentFilterDesign = StyleSheet.create({
    styBoxFilter: {
        height: 70,
        maxHeight: 70,
        backgroundColor: Colors.gray_3
    },
    contentFilter: {
        flex: 1,
        backgroundColor: Colors.gray_3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 65,
        maxHeight: 65,
        paddingVertical: Size.defineSpace / 2,
        paddingHorizontal: Size.defineSpace
    },
    filter: {
        flex: 1,
        flexDirection: 'row',
        borderColor: Colors.gray_5,
        borderWidth: 0.5,
        paddingVertical: Size.defineSpace / 2,
        borderRadius: 8,
        backgroundColor: Colors.white
    },
    search: {
        height: '100%',
        paddingVertical: 0,
        paddingHorizontal: Size.defineSpace,
        backgroundColor: Colors.white,
        borderWidth: 0
    },
    viewFilter: {
        height: '100%',
        paddingHorizontal: Size.defineSpace,
        justifyContent: 'center',
        alignItems: 'center',
        borderLeftColor: Colors.gray_5,
        borderLeftWidth: 0.5
    },
    styRightPicker: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    fl1Jus_Center: {
        flex: 1,
        justifyContent: 'center'
    },
    styleAli_Jus_Center: {
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export const styleContentFilterDesignV3 = StyleSheet.create({
    styViewAnimation: {
        elevation: 1,
        zIndex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        width: Size.deviceWidth
    },
    styBoxFilter: {
        height: 70,
        width: Size.deviceWidth,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Size.defineHalfSpace,
        backgroundColor: Colors.white
    },
    contentFilter: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: Size.defineHalfSpace + 3,
        paddingHorizontal: Size.defineSpace
    },
    filter: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: 7,
        alignItems: 'center'
    },
    search: {
        paddingVertical: 0,
        paddingHorizontal: Size.defineSpace,
        backgroundColor: Colors.gray_3,
        borderRadius: 7
    },
    backgroundColor: {
        backgroundColor: Colors.gray_3
    },
    viewFilter: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Size.defineSpace,
        backgroundColor: Colors.gray_3,
        borderRadius: 7,
        marginLeft: Size.defineHalfSpace
    }
});

export const styleContentFilterBackgroudHeader = {
    contentFilter: {
        flex: 1,
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: styleSheets.p_10,
        //flex:1,
        height: 65,
        maxHeight: 65,
        borderBottomColor: Colors.grey,
        borderBottomWidth: 0.5
    },
    filter: {
        flex: 1,
        flexDirection: 'row',
        // borderColor: Colors.grey,
        // borderWidth: 0.5,
        padding: styleSheets.p_5,
        borderRadius: styleSheets.radius_5,
        backgroundColor: Colors.whiteOpacity30
    },
    search: {
        height: 31,
        paddingVertical: 0,
        color: Colors.white
    },
    leftIcon: {
        height: '100%',
        justifyContent: 'center',
        marginRight: styleSheets.m_5
    },
    viewFilter: {
        height: '100%',
        marginLeft: styleSheets.m_5,
        justifyContent: 'center'
    }
};

export const styleViewTitleForGroup = StyleSheet.create({
    itemContent: {
        paddingVertical: styleSheets.p_10,
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.borderColor,
        marginHorizontal: styleSheets.m_10,
        backgroundColor: Colors.white
    },
    textLableInfo: {
        fontSize: Size.text - 4,
        textTransform: 'uppercase',
        color: Colors.greySecondary
    },
    styleViewLable: {
        flex: 1
    },
    textLableGroup: {
        textTransform: 'uppercase',
        color: Colors.primary,
        fontWeight: '500'
    },
    styleViewTitleGroup: {
        width: Size.deviceWidth - 20,
        marginHorizontal: 10,
        borderBottomColor: Colors.primary,
        borderBottomWidth: 1,
        paddingVertical: 10,
        // marginTop: -1,
        backgroundColor: Colors.white

        // alignItems:'center'
    },
    styleViewTitleGroupRow: {
        width: Size.deviceWidth - Size.defineSpace * 2,
        marginHorizontal: Size.defineSpace,
        borderBottomColor: Colors.primary,
        borderBottomWidth: 1,
        paddingVertical: 10,
        // marginTop: -1,
        backgroundColor: Colors.white,
        flexDirection: 'row',
        justifyContent: 'space-between'
        // alignItems:'center'
    }
});

export const styleProfileInfo = StyleSheet.create({
    itemContent: {
        paddingVertical: styleSheets.p_10,
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.borderColor,
        marginHorizontal: styleSheets.m_10,
        backgroundColor: Colors.white
    },
    styleViewTitleGroup: {
        width: Size.deviceWidth - Size.defineSpace * 2,
        marginHorizontal: styleSheets.m_10,
        borderBottomColor: Colors.primary,
        borderBottomWidth: 1,
        paddingVertical: 10,
        marginTop: -1,
        backgroundColor: Colors.white
    },
    textLableGroup: {
        fontSize: Size.text + 2,
        fontWeight: '600',
        color: Colors.primary
    },
    viewInputEdit: {
        flex: 7,
        marginRight: 5
    },
    bntSaveInputView: {
        backgroundColor: Colors.success,
        flex: 1,
        borderRadius: styleSheets.radius_5,
        justifyContent: 'center',
        marginRight: 3
    },
    bntCancelInputView: {
        backgroundColor: Colors.danger,
        flex: 1,
        borderRadius: styleSheets.radius_5,
        justifyContent: 'center'
    },
    bntCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export const styleScreenDetail = {
    containerItemDetail: {
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: styleSheets.p_10,
        backgroundColor: Colors.white
    },
    contentScroll: {
        flex: 1,
        width: Size.deviceWidth
    },
    bottomActions: {
        height: 60,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: Colors.white,
        zIndex: 3,
        elevation: 3,
        paddingHorizontal: Size.defineHalfSpace - 5,
        paddingVertical: Size.defineHalfSpace + 2
    },
    itemContent: {
        paddingVertical: styleSheets.p_10,
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.borderColor
    },
    textLableInfo: {
        fontSize: Size.text,
        color: Colors.gray_10,
        fontWeight: '500'
    },
    textValueInfo: {
        fontSize: Size.text,
        color: Colors.gray_7,
        fontWeight: '500'
    }
};

export const styleViewImg = StyleSheet.create({
    bntGoBack: {
        width: 35,
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 20,
        backgroundColor: Colors.black,
        borderRadius: Size.borderPicker,
        zIndex: 2
    },
    ViewImg: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    styleImg: {
        width: Size.deviceWidth,
        height: Size.deviceheight,
        flex: 1,
        paddingHorizontal: styleSheets.p_5
    },
    viewGoBack: {
        position: 'absolute',
        width: Size.deviceWidth,
        opacity: 1,
        top: 0
    }
});

export const styleViewMap = {
    bntGoBack: {
        width: 60,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
        borderRadius: styleSheets.radius_5,
        flexDirection: 'row',
        borderColor: Colors.primary,
        borderWidth: 1
    },
    viewGoback: {
        position: 'absolute',
        width: Size.deviceWidth,
        opacity: 1,
        top: 10,
        left: 20
    },
    styleMap: {
        flex: 1
    }
};

export const styleSafeAreaView = {
    style: { flex: 1, backgroundColor: Colors.white },
    forceInset: { top: 'never', bottom: 'always' }
};

export const styleSafeAreaViewNoHeader = Platform.select({
    style: { flex: 1, backgroundColor: Colors.white },
    forceInset: { top: 'always', bottom: 'always' }
});

export const stylesListPickerControl = StyleSheet.create({
    itemContent: {
        paddingVertical: styleSheets.p_10,
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.borderColor,
        marginHorizontal: styleSheets.m_10,
        backgroundColor: Colors.white
    },
    textLableInfo: {
        fontSize: Size.text - 1,
        // textTransform: 'uppercase',
        color: Colors.gray_9
    },
    styleViewTitleGroup: {
        width: Size.deviceWidth - 20,
        marginHorizontal: styleSheets.m_10,
        borderBottomColor: Colors.primary,
        borderBottomWidth: 1,
        paddingVertical: 10,
        marginTop: -1,
        backgroundColor: Colors.white
        // alignItems:'center'
    },
    textLableGroup: {
        textTransform: 'uppercase',
        color: Colors.primary,
        fontWeight: '500'
    },
    formDate_To_From: {
        flex: 1,
        flexDirection: 'row'
    },
    controlDate_from: {
        flex: 5,
        marginRight: 10
    },
    controlDate_To: {
        flex: 5
    },
    headerButtonStyle: {
        paddingHorizontal: Size.defineSpace
        // borderRadius: 5,
        // backgroundColor: Colors.white,
        // marginRight: 5,
    },
    contentViewControl: {
        paddingHorizontal: Size.defineSpace,
        paddingVertical: Size.defineHalfSpace
    },
    viewBtnShowHideUser: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    viewBtnShowHideUser_text: {
        color: Colors.primary,
        marginLeft: 5
    },
    viewLable: {
        flexDirection: 'row',
        alignItems: 'center'
        // marginBottom: this.m_7
    },
    viewControl: {
        flexDirection: 'row',
        marginTop: 5
    },
    viewInputMultiline: {
        minHeight: 50,
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        borderRadius: 5,
        padding: 10,
        backgroundColor: Colors.white
    },
    styBtnCheckBox: {
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 11,
        marginBottom: Size.defineHalfSpace
    },
    styBtnCheckBoxActive: {
        backgroundColor: Colors.primary
    },
    styBtnCheckBoxText: {
        color: Colors.gray_10,
        marginLeft: 6
    }
});

export const styleValid = {
    color: Colors.danger,
    marginLeft: 3
};

export const styleListLableValueCommom = StyleSheet.create({
    swipeable: {
        flex: 1,
        borderRadius: 10,
        marginBottom: 13,
        marginHorizontal: 10,
        padding: 4,
        backgroundColor: Colors.whitePure
    },
    viewButton: {
        flex: 1,
        backgroundColor: Colors.whiteOpacity70,
        borderRadius: 10,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    viewButtonIOS: {
        flex: 1,
        borderRadius: 10,
        marginBottom: 13,
        marginHorizontal: 10,
        shadowColor: Colors.black,
        backgroundColor: Colors.whitePure,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.2,
        shadowRadius: 5.46,
        elevation: 8
    },
    txtLable: {
        marginRight: 3
    },
    leftBody: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightColor: Colors.borderColor,
        borderRightWidth: 0.5
    },
    rightBody: {
        flex: 7,
        paddingHorizontal: 10
    },
    iconAvatarView: {
        flex: 1,
        marginBottom: 5
    },
    avatarUser: {
        width: Size.deviceWidth * 0.2,
        height: Size.deviceWidth * 0.2,
        borderRadius: (Size.deviceWidth * 0.2) / 2,
        resizeMode: 'cover',
        backgroundColor: Colors.borderColor
    },
    Line: {
        flex: 1,
        flexDirection: 'row',
        maxWidth: '100%',
        justifyContent: 'center',
        marginBottom: 5
    },
    valueView: {
        flex: 6.5,
        marginLeft: 5,
        alignItems: 'center',
        flexDirection: 'row'
    },
    IconView: {
        flex: 3.5,
        height: '100%',
        justifyContent: 'flex-start',
        flexDirection: 'row'
    }
});

export const styleListIconValueCommom = StyleSheet.create({
    swipeable: {
        flex: 1,
        borderRadius: 10,
        flexDirection: 'row',
        marginBottom: 13,
        marginHorizontal: 10,
        backgroundColor: Colors.whiteOpacity70,
        borderWidth: 2,
        borderColor: Colors.borderColor,
        paddingVertical: 10
    },
    viewButton: {
        flex: 1,
        backgroundColor: Colors.whiteOpacity70,
        borderRadius: 10,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    viewButtonIOS: {
        flex: 1,
        borderRadius: 10,
        marginBottom: 13,
        marginHorizontal: 10,
        shadowColor: Colors.black,
        backgroundColor: Colors.whitePure,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.2,
        shadowRadius: 5.46,
        elevation: 8
    },
    leftBody: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightColor: Colors.borderColor,
        borderRightWidth: 0.5
    },
    rightBody: {
        flex: 7,
        paddingHorizontal: 10
    },
    iconAvatarView: {
        flex: 1,
        marginBottom: 5
    },
    avatarUser: {
        width: Size.deviceWidth * 0.15,
        height: Size.deviceWidth * 0.15,
        borderRadius: (Size.deviceWidth * 0.15) / 2,
        resizeMode: 'cover',
        backgroundColor: Colors.borderColor
    },
    Line: {
        flex: 1,
        flexDirection: 'row',
        maxWidth: '100%',
        justifyContent: 'center',
        marginBottom: 5
    },
    valueView: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center'
    },
    IconView: {
        height: '100%',
        justifyContent: 'center'
    }
});

export const styleButtonAddOrEdit = StyleSheet.create({
    groupButton: {
        flexGrow: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: Size.defineSpace,
        backgroundColor: Colors.white,
        marginTop: 10,
        marginBottom: 10
    },
    groupButton__button_save: {
        height: Size.heightButton,
        borderRadius: styleSheets.radius_5,
        backgroundColor: Colors.primary,
        flex: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
        paddingHorizontal: Size.defineSpace / 2
    },
    groupButton__button_Confirm: {
        height: Size.heightButton,
        borderRadius: styleSheets.radius_5,
        backgroundColor: Colors.primary,
        flex: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
        paddingHorizontal: Size.defineSpace / 2
    },
    groupButton__text: {
        marginLeft: 5,
        color: Colors.white
    },
    txtButtonAdd: {
        marginLeft: 5
    },
    btnClose: {
        height: Size.heightButton,
        backgroundColor: Colors.borderColor,
        borderRadius: styleSheets.radius_5,
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5
    }
});

export const styleViewDetailHumanResource = StyleSheet.create({
    container: {
        backgroundColor: Colors.gray_3,
        paddingHorizontal: 12,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center'
    },

    wrapLine: {
        paddingHorizontal: 8,
        paddingVertical: 6
    },

    line: {
        width: '100%',
        height: 0.5,
        backgroundColor: Colors.gray_5
    }
});

export const styleApproveProcessHRE = StyleSheet.create({
    flex_Row_Ali_Center: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    textProfileName: {
        fontSize: Size.text - 1,
        color: Colors.blue
    },
    wrapLable: {
        backgroundColor: Colors.gray_3,
        paddingHorizontal: 12,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center'
    },
    wrapNameEvalution: {
        paddingHorizontal: styleSheets.p_10 + 12,
        paddingVertical: styleSheets.p_10,
        borderBottomColor: Colors.gray_3,
        borderBottomWidth: 0.5
    },
    flex_Row_Ali_Center_Jus_Beet: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    wrapLablePoint: {
        backgroundColor: Colors.gray_3,
        paddingHorizontal: 12,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center'
    },
    wrapInheritance: {
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5,
        paddingHorizontal: styleSheets.p_10 + 12
    },
    wrapNameAndIconInheritance: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: '60%'
    },
    btnInheritance: {
        borderColor: Colors.blue,
        borderWidth: 1,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6
    },
    textInheritance: {
        fontSize: Size.text,
        marginLeft: 6,
        color: Colors.blue
    },
    wrapLabelEvaluateCriteria: {
        flex: 1,
        paddingHorizontal: styleSheets.p_10 + 12,
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5,
        paddingVertical: 12
    },
    size16: {
        width: 16,
        height: 16
    },
    wrapEvaluationProcess: {
        backgroundColor: Colors.gray_3,
        paddingHorizontal: 12,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16
    }
});

const PADDING_DEFINE = Size.defineSpace;
export const styleListItemV3 = StyleSheet.create({
    styViewConfirmHours: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: PADDING_DEFINE / 2,
        paddingLeft: 4,
        flexDirection: 'row'
    },
    styUserApprove: {
        flexShrink: 1
    },
    styViewDate: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 2
    },
    swipeable: {
        flex: 1
    },
    swipeableLayout: {
        flex: 1,
        backgroundColor: Colors.white,
        flexDirection: 'row'
    },
    viewStatusBottom: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: PADDING_DEFINE / 2,
        paddingRight: Size.defineSpace,
        flexDirection: 'row'
    },
    lineSatus: {
        paddingHorizontal: 6,
        alignItems: 'center',
        paddingVertical: 2,
        borderRadius: Size.borderRadiusCircle
        // padding: 4
    },
    viewLimitTitle: {
        width: '100%',
        marginBottom: PADDING_DEFINE / 2,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    viewReasoLimitTitle_text: {
        fontSize: Size.text - 1,
        color: Colors.red,
        marginLeft: 5
    },
    viewReason_text: {
        fontSize: Size.textSmall,
        color: Colors.gray_9
    },
    lineSatus_text: {
        fontSize: Size.text - 3,
        fontWeight: '500'
    },
    styRadiusCheck: {
        width: Size.iconSize - 3,
        height: Size.iconSize - 3,
        borderRadius: (Size.iconSize - 3) / 2,
        borderWidth: 1,
        borderColor: Colors.gray_8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    dateTimeSubmit_Text: {
        fontSize: Size.text - 2,
        color: Colors.gray_8,
        marginLeft: 3
    },
    contentMain: {
        flex: 1,
        paddingTop: Size.defineSpace
        // paddingHorizontal: Size.defineSpace,
    },
    styViewTop: {
        flexDirection: 'row',
        justifyContent: 'space-between'
        // marginBottom: Size.defineHalfSpace,
    },
    leftContent: {
        marginRight: 5
    },
    styleFlex1_row_AlignCenter: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    styleTextViewTop: {
        // fontWeight: fw,
        color: Colors.gray_10,
        fontSize: Size.text + 1
    },
    styleTextNum: {
        fontSize: Size.text - 1
    },
    styleTextType: {
        fontWeight: Platform.OS == 'android' ? '600' : '500',
        color: Colors.gray_10,
        fontSize: Size.text - 2
    },

    left_isCheckbox: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingLeft: 8
    },

    btnLeft_check: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: Dimensions.get('window').width / 2,
        zIndex: 2,
        elevation: 2
    },

    btnRight_ViewDetail: {
        flex: 1,
        zIndex: 1,
        elevation: 1
    },

    viewContentTopRight: {
        // width: '30%',
        maxWidth: '33%',
        justifyContent: 'center',
        paddingRight: 12
    },

    wrapContentCenter: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4
    },
    styIconMess: {
        marginTop: 3
    },
    wrapReason: {
        width: '92%',
        paddingRight: 12,
        paddingLeft: 6,
        marginTop: 2
    },

    textProfileName: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.blue
    },

    wh100: {
        width: '100%',
        maxWidth: '100%'
    },

    wh69: { width: '69%', maxWidth: '69%' },
    AccumulateHour: {
        width: '100%',
        paddingRight: 12,
        marginVertical: 4
    },
    container: {
        flex: 1,
        paddingRight: Size.defineSpace,
        paddingVertical: Size.defineHalfSpace
    },
    contentCenter: {
        flex: 7.2,
        paddingRight: PADDING_DEFINE,
        justifyContent: 'center'
    },
    contentRight: {
        justifyContent: 'center'
    },
    profileText: {
        fontSize: Size.text - 1
    },
    // ============= //
    styProgress: {
        flex: 1,
        backgroundColor: Colors.gray_3,
        borderRadius: 3,
        paddingHorizontal: Size.defineHalfSpace,
        paddingVertical: Size.defineHalfSpace
        // marginHorizontal: Size.defineHalfSpace
    }
});
