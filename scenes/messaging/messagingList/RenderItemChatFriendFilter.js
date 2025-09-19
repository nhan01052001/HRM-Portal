import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, Size, styleSheets, styleVnrListItem } from '../../../constants/styleConfig';
import moment from 'moment';
import format from 'number-format.js';
import ActionSheet from 'react-native-actionsheet';
import Vnr_Function from '../../../utils/Vnr_Function';
import { translate } from '../../../i18n/translate';
import {
    IconEdit,
    IconColse,
    IconCheckCirlceo,
    IconMail,
    IconDelete,
    IconMoreHorizontal,
    IconEvaluate,
    IconNext,
    IconInfo,
    IconProgressCheck,
    IconBack
} from '../../../constants/Icons';
import VnrText from '../../../components/VnrText/VnrText';
import { EnumName } from '../../../assets/constant';
import Color from 'color';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import DrawerServices from '../../../utils/DrawerServices';
import { ConfigField } from '../../../assets/configProject/ConfigField';

export default class RenderItemChatFriend extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        // this.setRightAction(props);
    }

    //#region
    // setRightAction = (thisProps) => {
    //     const { dataItem } = thisProps;
    //     this.sheetActions = [{
    //         "title": translate("HRM_Common_Close"),
    //         "onPress": null
    //     }];
    //     dataItem.BusinessAllowAction = ["E_CANCEL", "E_DELETE", "E_APPROVE"];
    //     if (!Vnr_Function.CheckIsNullOrEmpty(thisProps.rowActions)) {
    //         this.rightListActions = thisProps.rowActions.filter(
    //             (item) => {
    //                 item.title = item.title;
    //                 return (!Vnr_Function.CheckIsNullOrEmpty(dataItem.BusinessAllowAction) && dataItem.BusinessAllowAction.indexOf(item.type) >= 0)
    //             });
    //         if (this.rightListActions.length > 3) {
    //             this.sheetActions = [...this.rightListActions.slice(2), ...this.sheetActions]
    //         }
    //         else {
    //             this.sheetActions = [...this.rightListActions.slice(3), ...this.sheetActions]
    //         }
    //     }
    // }

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.isPullToRefresh !== this.props.isPullToRefresh) {
    //         this.setRightAction(nextProps)
    //     }
    // }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if (nextProps.isPullToRefresh !== this.props.isPullToRefresh ||
    //         nextProps.isSelect !== this.props.isSelect ||
    //         nextProps.isOpenAction !== this.props.isOpenAction ||
    //         nextProps.isDisable !== this.props.isDisable) {
    //         return true;
    //     }
    //     else {
    //         return false
    //     }
    // }
    //#endregion

    renderAvatar = () => {
        const { dataItem } = this.props,
            fullName = dataItem.UserInfoName.split(' '),
            lastName = fullName[fullName.length - 1],
            firstChar = lastName ? lastName.split('')[0] : dataItem.UserInfoName,
            //firstChar = (dataItem && dataItem.UserInfoName) ? dataItem.UserInfoName.split('')[0] : '',
            randomColor = Vnr_Function.randomColor(firstChar),
            { PrimaryColor, SecondaryColor } = randomColor;

        let colorStatus = null;

        if (dataItem.Status && Object.keys(dataItem.Status).length > 0 && dataItem.Status.theme) {
            colorStatus = dataItem.Status.theme.PrimaryColor;
        }

        return (
            <View style={styles.viewAvatar}>
                {dataItem.Image != null ? (
                    <Image source={{ uri: dataItem.Image }} style={styles.imgAvatar} />
                ) : (
                    <View style={[styles.imgAvatar, { backgroundColor: SecondaryColor }]}>
                        <Text
                            style={[
                                styleSheets.textFontMedium,
                                styles.avatar_TextName,
                                {
                                    color: PrimaryColor
                                }
                            ]}
                        >
                            {firstChar.toUpperCase()}
                        </Text>
                    </View>
                )}

                {/* <View style={styles.buttonStatus}>

                </View> */}
                <View
                    style={[
                        styles.iconStatus,
                        {
                            backgroundColor: colorStatus != null ? colorStatus : Colors.gray_5
                        }
                    ]}
                />
            </View>
        );
    };

    moveToDetail = (item, index) => {
        const { detail, dataItem, rowTouch } = this.props;
        debugger;
        // console.log(dataItem, 'dataItemdataItem')
        if (!Vnr_Function.CheckIsNullOrEmpty(rowTouch) && typeof rowTouch == 'function') {
            rowTouch(item, index);
        } else if (
            !Vnr_Function.CheckIsNullOrEmpty(detail) &&
            !Vnr_Function.CheckIsNullOrEmpty(detail.screenDetail) &&
            !Vnr_Function.CheckIsNullOrEmpty(detail.screenName)
        ) {
            DrawerServices.navigate(detail.screenDetail, {
                dataItem: dataItem,
                screenName: detail.screenName
                // listActions: _listActions,
                // reloadScreenList: reloadScreenList
            });
        }
    };

    render() {
        const {
                dataItem,
                isSelect,
                renderRowConfig,
                index,
                listItemOpenSwipeOut,
                isOpenAction,
                rowActions
            } = this.props,
            _configField =
                ConfigField && ConfigField.value['MessagingChatFriend']
                    ? ConfigField.value['MessagingChatFriend']['Hidden']
                    : [];

        let isShowCodeEmp = _configField.findIndex(key => key == 'CodeEmp') > -1 ? false : true;

        return (
            <TouchableOpacity style={styles.swipeable} onPress={() => this.moveToDetail()}>
                <View style={styles.content} key={index}>
                    <View style={styles.contentRight}>
                        {this.renderAvatar()}
                        <View style={styles.viewRight}>
                            <View style={styles.viewName}>
                                <View style={styles.viewMessaging_content}>
                                    <Text style={[styleSheets.textFontMedium, styles.viewName_Text]} numberOfLines={1}>
                                        {dataItem.UserInfoName}
                                    </Text>
                                    {isShowCodeEmp && (
                                        <Text style={[styleSheets.text, styles.viewMessaging_Text]} numberOfLines={1}>
                                            {dataItem.CodeEmp && dataItem.CodeEmp}
                                        </Text>
                                    )}

                                    {/* {
                                            (isShowCodeEmp && dataItem.CodeEmp) ? (
                                                <Text style={[styleSheets.text, styles.viewMessaging_Text]}
                                                    numberOfLines={1}>
                                                   {
                                                        dataItem.CodeEmp
                                                }
                                               </Text>
                                           ) : null
                                         } */}
                                </View>

                                <View style={styles.viewMessaging}>
                                    <View style={styles.viewMessaging_content}>
                                        <Text style={[styleSheets.text, styles.viewMessaging_Text]} numberOfLines={1}>
                                            {dataItem.PositionName}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
const HIGHT_AVATAR = Size.deviceWidth >= 1024 ? 80 : Size.deviceWidth * 0.13,
    PADDING_DEFINE = 16;
const styles = StyleSheet.create({
    iconStatus: {
        borderColor: Colors.white,
        borderWidth: 1,
        width: 12,
        height: 12,
        position: 'absolute',
        bottom: -1,
        borderRadius: 6,
        right: 0
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: styleSheets.p_10,
        backgroundColor: Colors.white,
        paddingLeft: 10,
        borderRadius: 16,
        marginBottom: 12,
        // marginRight: PADDING_DEFINE,
        marginLeft: PADDING_DEFINE + HIGHT_AVATAR / 2,
        borderWidth: 0.5,
        borderColor: Colors.gray_5
    },
    contentRight: {
        flex: 1,
        flexDirection: 'row'
    },
    swipeable: {
        flex: 1,
        backgroundColor: Colors.gray_3,
        marginRight: PADDING_DEFINE
    },
    viewAvatar: {
        // justifyContent: 'flex-start',
        // alignItems: 'flex-start',
        backgroundColor: Colors.borderColor,
        marginLeft: -(HIGHT_AVATAR / 2 + PADDING_DEFINE / 2),
        borderRadius: 18
    },
    avatar: {
        height: HIGHT_AVATAR,
        width: HIGHT_AVATAR,
        backgroundColor: Colors.gray_3,
        borderRadius: 18 //HIGHT_AVATAR / 3,
    },
    imgAvatar: {
        height: HIGHT_AVATAR,
        width: HIGHT_AVATAR,

        borderRadius: 18, // HIGHT_AVATAR / 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewRight: {
        flex: 1,
        marginHorizontal: 12,
        justifyContent: 'center'
    },
    buttonStatus: {
        backgroundColor: Colors.green,
        borderColor: Colors.white,
        borderWidth: 1,
        width: 12,
        height: 12,
        position: 'absolute',
        bottom: -1,
        borderRadius: 6,
        right: 0
    },
    viewName: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    viewName_Text: {
        fontWeight: '500',
        color: Colors.gray_10
    },
    viewName_code: {
        fontWeight: '500',
        color: Colors.gray_10
    },
    viewName_Time: {
        fontSize: Size.text - 4,
        color: Colors.gray_7,
        fontWeight: '500'
    },
    viewMessaging: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    viewBaged: {
        borderRadius: 12.5,
        backgroundColor: Colors.volcano,
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewBaged_Number: {
        color: Colors.white,
        fontWeight: '500',
        fontSize: Size.text - 1
    },
    viewMessaging_content: {
        flex: 1,
        marginRight: 10
    },
    viewMessaging_Text: {
        fontSize: Size.text - 1,
        color: Colors.gray_7
    },
    viewIcon: {
        minWidth: 60,
        borderRightColor: Colors.white,
        borderRightWidth: 0.3,
        paddingHorizontal: styleSheets.p_10,
        marginTop: 5,
        borderRadius: 8,
        marginBottom: 21,
        marginRight: PADDING_DEFINE
    },
    avatar_TextName: {
        fontWeight: '500',
        fontSize: Size.text + 5
    }
});
