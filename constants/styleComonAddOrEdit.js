import { Platform, StyleSheet } from 'react-native';
import { Colors, Size } from './styleConfig';

const styleComonAddOrEdit = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: -Size.deviceheight
    },
    styFlatListContainer: {
        flex: 1,
        paddingBottom: 50
    },
    styLoadingHeader: {
        width: '100%',
        height: 1.5
    },
    styViewLoading: {
        position: 'absolute',
        width: Size.deviceWidth,
        height: Size.deviceheight,
        zIndex: 4
    },

    styViewLogo: {
        backgroundColor: Colors.white,
        alignItems: 'center',
        marginBottom: 12,
        paddingVertical: 6
    },

    wrapInsideModal: {
        flex: 1,
        backgroundColor: Colors.gray_2,
        borderRadius: 8
    },

    styAvoiding: {
        flex: 1
    },

    wrapButtonHandler: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: Size.defineSpace,
        zIndex: 1,
        elevation: 1,
        paddingVertical: Size.defineSpace,
        backgroundColor: Colors.white
    },

    btnRefresh: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.blue,
        borderRadius: 2,
        paddingVertical: 10
    },

    btnSaveTemp: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.black_transparent_8,
        marginRight: Size.defineHalfSpace,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: Size.borderRadiusBotton
    },

    wrapBtnRegister: {
        flex: 6,
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Size.borderRadiusBotton,
        paddingVertical: 10
    },
    wrapBtnSurvey: {
        flex: 6,
        borderColor: Colors.primary,
        borderWidth: 0.5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Size.borderRadiusBotton,
        paddingVertical: 10
    },
    separate: {
        flex: 1,
        height: 6,
        backgroundColor: Colors.primary
    },

    // flRowSpaceBetween: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     padding: Size.defineSpace
    // },

    wrapItem: {
        backgroundColor: Colors.white,
        marginTop: Size.defineHalfSpace
    },

    resetBorder: {
        borderBottomWidth: 0,
        borderRadius: 0
    },

    styRegister: {
        fontSize: Size.text + 1,
        fontWeight: '400',
        color: Colors.white
    },

    stySurvey: {
        fontSize: Size.text + 1,
        fontWeight: '400',
        color: Colors.primary,
        marginLeft: Size.defineHalfSpace
    },
    styApproveProcessTitle: {
        color: Colors.white,
        fontSize: Size.text + 1,
        fontWeight: Platform.OS == 'android' ? '600' : '500'
    },

    styViewApprove: {
        flex: 1,
        alignItems: 'center',
        marginVertical: 12
    },

    styBtnShowApprove: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,

        borderRadius: 5,
        paddingVertical: Size.defineHalfSpace,
        paddingHorizontal: Size.defineSpace
    },

    styHeaderText: {
        fontSize: Size.text,
        fontWeight: Platform.OS === 'android' ? '700' : '500'
    },

    styRowDateFromTo: {
        flexDirection: 'row'
    },
    styRowDate: {
        flex: 0.5
    },
    styRowDateLine: {
        height: '100%',
        width: 0.5,
        backgroundColor: Colors.gray_5
    },
    styErrorInputLength: {
        paddingHorizontal: Size.defineSpace,
        color: Colors.red,
        paddingVertical: 2,
        fontSize: 14,
        fontWeight: '500'
    },

    //#region thêm giờ vào ra
    btnAddTimeInOut: {
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.gray_5,
        height: 50,
        paddingHorizontal: Size.defineSpace,
        flexDirection: 'row',
        alignItems: 'center'
    },

    styAddTimeIn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.gray_5
    },

    lblAddTimeInOut: {
        fontSize: 16,
        color: Colors.blue
    },

    btnDeleteTimeInOut: {
        paddingVertical: 12,
        paddingHorizontal: 6,
        marginRight: Size.defineSpace
    },

    fl1: {
        flex: 1
    },
    //#endregion

    //#region khu vực modal cấp duyệt
    // eslint-disable-next-line react-native/no-color-literals
    wrapContentModal: {
        flex: 0.55,
        marginHorizontal: 12,
        backgroundColor: 'transparent'
    },
    // eslint-disable-next-line react-native/no-color-literals
    bgOpacity: {
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0
    },

    wrapModalApproval: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        bottom: 26,
        right: 0,
        left: 0,
        zIndex: 3,
        elevation: 3
    },

    wrapModalApprovaLevel: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 12
    },

    wrapContentDisplayInModal: {
        flex: 1,
        backgroundColor: Colors.black,
        borderRadius: 8
    },

    wrapTitileHeaderModalApprovaLevel: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: Colors.black12,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },

    wrapTitleStatusApproval: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6,
        paddingBottom: 14
    },

    statusApproval: {
        width: 18,
        height: 18,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center'
    },

    styApprover: {
        fontSize: 12,
        fontWeight: '500',
        color: Colors.gray_7,
        marginRight: 8
    },

    dashLine: {
        flex: 1,
        height: 1,
        backgroundColor:Colors.grayOpacity15
    },

    wrapIn4MationApprover: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 6,
        borderRadius: 100,
        backgroundColor: Colors.grayOpacity15
    },

    wrapImgAndNameApprover: {
        maxWidth: '50%',
        flexDirection: 'row',
        alignItems: 'center'
    },

    wrapImgApprover: {
        backgroundColor: Colors.black,
        padding: 2,
        borderRadius: 26,
        marginRight: 4
    },

    imgApprover: {
        width: 26,
        height: 26,
        borderRadius: 26
    },

    wrapContentModalApproval: {
        width: Size.deviceWidth - 24,
        marginHorizontal: 12,
        paddingTop: 0
    },

    fS16fW600: { fontSize: 16, fontWeight: '600' },

    wrapLevelApproval: {
        padding: Size.defineHalfSpace,
        backgroundColor: Colors.black,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8
    },

    h90: { height: 90 },

    wrapFullScreen: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    },
    //#endregion

    //#region  Khu vực thông báo lỗi chi tiết
    wrapModalError: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 12
    },
    wrapContentModalError: {
        width: Size.deviceWidth - 24,
        marginHorizontal: 12,
        paddingTop: 0
    },
    wrapTitileHeaderModalError: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: Colors.black12,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    wrapLevelError: {
        height: Size.deviceheight * 0.6,
        backgroundColor:  Colors.black,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8
    },
    styleViewTitleGroup: {
        width: '100%'
    },
    styFontErrText: {
        color: Colors.white,
        fontSize: Size.text - 1,
        textAlign: 'right'
    },
    styFontErrTitle: {
        color: Colors.white
    },
    styFontErrInfo: {},
    styFontErrLine: {
        flexDirection: 'row',
        maxWidth: '100%'
    },
    btnClose: {
        height: Size.heightButton,
        backgroundColor: Colors.red,
        borderRadius: 5,
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5
    },
    styleViewBorderButtom: {
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.gray_1,
        flex: 1,
        marginBottom: 0.5,
        marginHorizontal: 10,
        paddingVertical: 10
    },
    styleViewNoBorder: {
        borderBottomWidth: 0
    },
    styFontErrVal: {
        flex: 1,
        alignItems: 'flex-end'
    },
    //#endregion

    //#region  View Remain LeaveDay
    styViewRemain: {
        position: 'absolute',
        left: Size.defineSpace,
        top: -50,
        height: 40,
        width: Size.deviceWidth - Size.defineSpace * 2,
        paddingLeft: Size.defineHalfSpace,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: Colors.dark,

        borderRadius: 3,

        zIndex: 2,
        elevation: 2
    },
    styViewRemainText: {
        color: Colors.white,
        fontSize: Size.text,
        marginLeft: Size.defineHalfSpace
    },
    //#endregion

    //#region  LeaveDay Count
    styRowControl: {
        marginTop: Size.defineHalfSpace
    },

    flRowSpaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: Size.defineSpace,
        paddingVertical: Size.defineHalfSpace
    },
    styLableGp: {
        fontSize: Size.text + 1
    },
    styLableDeleteGp: {
        color: Colors.red
    },
    styViewLeaveDayCount: {
        width: '100%',
        paddingHorizontal: Size.defineSpace,
        paddingVertical: Size.defineHalfSpace,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.gray_2

        // borderBottomColor: Colors.gray_5,
        // borderBottomWidth: 0.5
    },
    styViewError: {
        width: '100%',
        paddingHorizontal: Size.defineSpace,
        paddingVertical: Size.defineHalfSpace,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.red_1,
        borderColor: Colors.red,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5
    },
    styViewLeaveDayCountLable: {
        color: Colors.gray_10,
        fontSize: Size.text - 2
    },
    styViewLeaveDayCountValue: {
        fontWeight: '600',
        color: Colors.primary,
        fontSize: Size.text - 2
    },
    //#endregion

    //#region  Khu vực thông tin khác
    wrapModalOrther: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: Size.defineSpace
    },
    wrapContentModalOrther: {
        width: Size.deviceWidth - 24,
        marginHorizontal: 12,
        paddingTop: 0
    },
    wrapTitileHeaderModalOrther: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: Colors.gray_2,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    wrapLevelErrorOrther: {
        height: 'auto',
        backgroundColor: Colors.gray_2,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8
        //paddingBottom: Size.defineSpace
    },
    bgOpacityOther: {
        backgroundColor: Colors.black,
        opacity: 0.5,
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0
    },
    styBtnDoneLeaveday: {
        color: Colors.blue
    },

    styBusinessNight: {
        backgroundColor: Colors.white,
        height: 100,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8
    },
    //#endregion

    //#region AttSubmitWorkingOvertimeComponent
    styLbNotHaveValuePicker: {
        fontSize: Size.text + 1,
        color: Colors.gray_8
    },

    inputRef: {
        position: 'absolute',
        height: '100%',
        width: 50,
        left: 12,
        zIndex: 1,
        elevation: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    customForTextInputChooseHour: {
        textAlign: 'right',
        borderRightWidth: 0,
        borderTopWidth: 0,
        fontSize: 16,
        fontWeight: '600',
        borderWidth: 0
    },

    caculatorHour: {
        backgroundColor: Colors.gray_2,
        width: '100%',
        paddingVertical: 6,
        paddingHorizontal: Size.defineSpace,
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5
    },
    noData: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },

    // other information
    wrapBtnOtherInformation: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 12
    },

    btnOtherInformation: {
        width: '50%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    wrapLableAndCheckbox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5
    },

    fl07_aliCenter: {
        flex: 0.7,
        alignItems: 'flex-start'
    },

    wrapCheckbox: {
        flex: 0.3,
        marginTop: 0,
        alignItems: 'flex-end'
    },

    wrapViewRemaining: {
        height: 40,
        width: Size.deviceWidth - Size.defineSpace * 2,
        paddingHorizontal: Size.defineHalfSpace,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: Colors.dark,
        borderRadius: 3
    },

    contentRemaining: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },

    modalApprover: { position: 'absolute', bottom: 0, left: 0, right: 0 },
    alignItems: { alignItems: 'center' }

    //#endregion
});

export default styleComonAddOrEdit;
