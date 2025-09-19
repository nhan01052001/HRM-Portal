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

export default class RenderItemChatFriend extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.setRightAction(props);
    }

    setRightAction = thisProps => {
        const { dataItem } = thisProps;
        this.sheetActions = [
            {
                title: translate('HRM_Common_Close'),
                onPress: null
            }
        ];
        dataItem.BusinessAllowAction = ['E_CANCEL', 'E_DELETE', 'E_APPROVE'];
        if (!Vnr_Function.CheckIsNullOrEmpty(thisProps.rowActions)) {
            this.rightListActions = thisProps.rowActions.filter(item => {
                item.title = item.title;
                return (
                    !Vnr_Function.CheckIsNullOrEmpty(dataItem.BusinessAllowAction) &&
                    dataItem.BusinessAllowAction.indexOf(item.type) >= 0
                );
            });
            if (this.rightListActions.length > 3) {
                this.sheetActions = [...this.rightListActions.slice(2), ...this.sheetActions];
            } else {
                this.sheetActions = [...this.rightListActions.slice(3), ...this.sheetActions];
            }
        }
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.isPullToRefresh !== this.props.isPullToRefresh) {
            this.setRightAction(nextProps);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (
            nextProps.isPullToRefresh !== this.props.isPullToRefresh ||
            nextProps.isSelect !== this.props.isSelect ||
            nextProps.isOpenAction !== this.props.isOpenAction ||
            nextProps.isDisable !== this.props.isDisable
        ) {
            return true;
        } else {
            return false;
        }
    }

    openActionSheet = () => {
        this.ActionSheet.show();
    };

    actionSheetOnCLick = index => {
        const { dataItem } = this.props;
        !Vnr_Function.CheckIsNullOrEmpty(this.sheetActions[index].onPress) &&
            this.sheetActions[index].onPress(dataItem);
    };

    rightActionsEmpty = () => {
        return <View style={{ width: 0 }} />;
    };

    rightActions = (progress, dragX) => {
        const options = this.sheetActions.map(item => {
            return item.title;
        });
        const { dataItem } = this.props;

        return (
            <View style={{ maxWidth: 300, flexDirection: 'row' }}>
                {!Vnr_Function.CheckIsNullOrEmpty(this.sheetActions) && this.sheetActions.length > 1 && (
                    <View style={[styleVnrListItem.RenderItem.viewIcon, { backgroundColor: Colors.info }]}>
                        <TouchableOpacity
                            onPress={() => this.openActionSheet()}
                            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                        >
                            <View style={styleVnrListItem.RenderItem.icon}>
                                <IconMoreHorizontal size={Size.iconSize} color={Colors.white} />
                            </View>
                            <Text style={[styleSheets.text, { color: Colors.white }]}>{translate('MoreActions')}</Text>
                        </TouchableOpacity>
                        <ActionSheet
                            ref={o => (this.ActionSheet = o)}
                            //title={'Which one do you like ?'}
                            options={options}
                            cancelButtonIndex={this.sheetActions.length - 1}
                            destructiveButtonIndex={this.sheetActions.length - 1}
                            onPress={index => this.actionSheetOnCLick(index)}
                        />
                    </View>
                )}
                {!Vnr_Function.CheckIsNullOrEmpty(this.rightListActions) &&
                    this.rightListActions.length > 0 &&
                    this.rightListActions.map((item, index) => {
                        let buttonColor = '',
                            iconName = '';

                        switch (item.type) {
                            case EnumName.E_MODIFY:
                                buttonColor = Colors.warning;
                                iconName = <IconEdit size={Size.iconSize} color={Colors.white} />;
                                break;
                            case EnumName.E_DELETE:
                                buttonColor = Colors.volcano;
                                iconName = <IconDelete size={Size.iconSize} color={Colors.white} />;
                                break;
                            case EnumName.E_EVALUATION:
                                buttonColor = Colors.BahamaBlue;
                                iconName = <IconEvaluate size={Size.iconSize} color={Colors.white} />;
                                break;
                            case EnumName.E_UPDATESTATUS:
                                buttonColor = Colors.indigo;
                                iconName = <IconProgressCheck size={Size.iconSize + 5} color={Colors.white} />;
                                break;
                            default:
                                buttonColor = Colors.info;
                                iconName = <IconInfo size={Size.iconSize} color={Colors.white} />;
                                break;
                        }
                        if (this.sheetActions.length > 1 && index < 2) {
                            return (
                                <View style={[styles.viewIcon, { backgroundColor: buttonColor }]}>
                                    <TouchableOpacity
                                        onPress={() => item.onPress(dataItem)}
                                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                                    >
                                        <Text style={[styleSheets.text, { color: Colors.white, fontWeight: '500' }]}>
                                            {item.title}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        } else if (this.sheetActions.length <= 1 && index < 3) {
                            return (
                                <View style={[styles.viewIcon, { backgroundColor: buttonColor }]}>
                                    <TouchableOpacity
                                        onPress={() => item.onPress(dataItem)}
                                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                                    >
                                        <Text
                                            style={[
                                                styleSheets.textFontMedium,
                                                { color: Colors.white, fontWeight: '500' }
                                            ]}
                                        >
                                            {item.title}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        }
                    })}
            </View>
        );
    };

    renderAvatar = () => {
        const { dataItem } = this.props,
            firstChar = dataItem && dataItem.NameView ? dataItem.NameView.split('')[0] : '',
            randomColor = Vnr_Function.randomColor(firstChar),
            { PrimaryColor, SecondaryColor } = randomColor;

        let colorStatus = null;

        if (dataItem.Status && Object.keys(dataItem.Status).length > 0 && dataItem.Status.theme) {
            colorStatus = dataItem.Status.theme.PrimaryColor;
        }
        return (
            <View style={styles.viewAvatar}>
                {dataItem.Image ? (
                    <Image source={{ uri: dataItem.Image }} resizeMode={'cover'} style={styles.imgAvatar} />
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
            </View>
        );
    };

    handelTimeChat = firstContent => {
        if (!firstContent) return null;

        //Nếu ngày hôm nay thì hiển thì giờ, còn lại hiển thị ngày
        const isToday = moment().format('DD/MM/YYYY') === moment(firstContent.TimeChat).format('DD/MM/YYYY'),
            date = firstContent.TimeChat,
            dateFormat = isToday
                ? moment(date).format('HH:mm')
                : `${translate(`E_${moment(date).format('dddd')}`.toUpperCase())}, ${moment(date).format(
                    'DD'
                )} ${translate('Month_Lowercase')} ${moment(date).format('M')}`;

        return (
            firstContent !== null && (
                <Text style={[styleSheets.textFontMedium, styles.viewName_Time]}>{dateFormat}</Text>
            )
        );
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
            firstContent = dataItem.ListMessage && dataItem.ListMessage.length > 0 ? dataItem.ListMessage[0] : null;

        let lastMessage = dataItem.PositionName,
            countRemind = '';

        if (dataItem.RemindQty != null && dataItem.RemindQty != 0) {
            countRemind = dataItem.RemindQty < 100 ? dataItem.RemindQty : '99+';
        }

        if (dataItem.ListMessage && dataItem.ListMessage.Data && dataItem.ListMessage.Data[0]) {
            lastMessage =
                dataItem.ListMessage.Data[0]['Type'] === 'image'
                    ? translate('Image')
                    : dataItem.ListMessage.Data[0].Content;
        }
        return (
            <Swipeable
                ref={ref => {
                    this.Swipe = ref;
                    if (
                        listItemOpenSwipeOut.findIndex(value => {
                            return value['ID'] == index;
                        }) < 0
                    ) {
                        listItemOpenSwipeOut.push({ ID: index, value: ref });
                    } else {
                        listItemOpenSwipeOut[index].value = ref;
                    }
                }}
                overshootRight={false}
                renderRightActions={rowActions != null && !isOpenAction ? this.rightActions : this.rightActionsEmpty}
                friction={0.6}
            >
                <View style={styles.swipeable}>
                    <View
                        style={[styles.content, isSelect && { backgroundColor: Colors.primary_transparent_8 }]}
                        key={index}
                    >
                        <View style={styles.contentRight}>
                            {this.renderAvatar()}
                            <View style={styles.viewRight}>
                                <View style={styles.viewName}>
                                    <View style={styles.viewMessaging_content}>
                                        <Text
                                            style={[styleSheets.textFontMedium, styles.viewName_Text]}
                                            numberOfLines={1}
                                        >
                                            {dataItem.NameView}
                                        </Text>
                                    </View>
                                    {this.handelTimeChat(firstContent)}
                                </View>

                                <View style={styles.viewMessaging}>
                                    <View style={styles.viewMessaging_content}>
                                        <Text
                                            style={[
                                                styleSheets.text,
                                                styles.viewMessaging_Text,
                                                dataItem.IsOnRemind && {
                                                    fontWeight: '400',
                                                    color: Colors.black
                                                }
                                            ]}
                                            numberOfLines={1}
                                        >
                                            {lastMessage}
                                        </Text>
                                    </View>

                                    {countRemind !== '' && (
                                        <View style={styles.viewBaged}>
                                            <Text style={[styleSheets.textFontMedium, styles.viewBaged_Number]}>
                                                {countRemind}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            <ActionSheet
                                ref={o => (this.ActionSheet = o)}
                                title={'Which one do you like ?'}
                                options={['action 1', 'action 2', 'cancel']}
                                cancelButtonIndex={2}
                                destructiveButtonIndex={1}
                                onPress={index => this.actionSheetOnCLick(index)}
                            />
                        </View>
                    </View>
                </View>
            </Swipeable>
        );
    }
}

const HIGHT_AVATAR = Size.deviceWidth >= 1024 ? 80 : Size.deviceWidth * 0.13,
    PADDING_DEFINE = 16;
const styles = StyleSheet.create({
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
    iconStatus: {
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
        paddingHorizontal: 7,
        paddingVertical: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start'
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
        color: Colors.gray_7,
        fontSize: Size.text - 1
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
