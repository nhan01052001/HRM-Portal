import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {
    Colors,
    Size,
    styleSafeAreaView,
    styleSheets,
    stylesModalPopupBottom,
    styleVnrListItem
} from '../../../constants/styleConfig';
import ActionSheet from 'react-native-actionsheet';
import Vnr_Function from '../../../utils/Vnr_Function';
import { translate } from '../../../i18n/translate';
import { EnumName } from '../../../assets/constant';

export default class RenderItemChatFriend extends Component {
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

        if (dataItem.Permission == 'Admin') dataItem.BusinessAllowAction = [];
        else dataItem.BusinessAllowAction = ['E_DELETE', 'E_GRANT_PERMISSION'];

        if (!Vnr_Function.CheckIsNullOrEmpty(thisProps.rowActions)) {
            this.rightListActions = thisProps.rowActions.filter(item => {
                item.title = item.title;
                return (
                    !Vnr_Function.CheckIsNullOrEmpty(dataItem.BusinessAllowAction) &&
                    dataItem.BusinessAllowAction.indexOf(item.type) >= 0
                );
            });

            if (this.rightListActions.length > 1) {
                this.sheetActions = [...this.rightListActions.slice(0), ...this.sheetActions];
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
                    // <View style={[
                    //     styleVnrListItem.RenderItem.viewIcon,
                    //     styles.styBtnMore
                    // ]}>
                    //     <TouchableOpacity onPress={() => this.openActionSheet()} style={{ flex: 1, justifyContent: "center", alignItems: "center", }}>
                    //         <View style={styleVnrListItem.RenderItem.icon}>
                    //             <IconMoreHorizontal size={Size.iconSize} color={Colors.black} />
                    //         </View>
                    //     </TouchableOpacity>
                    <ActionSheet
                        ref={o => (this.ActionSheet = o)}
                        options={options}
                        cancelButtonIndex={this.sheetActions.length - 1}
                        destructiveButtonIndex={this.sheetActions.length - 1}
                        onPress={index => this.actionSheetOnCLick(index)}
                    />
                    // </View>
                )}
                {!Vnr_Function.CheckIsNullOrEmpty(this.rightListActions) &&
                    this.rightListActions.length == 1 &&
                    this.rightListActions.map((item, index) => {
                        let buttonColor = '';

                        switch (item.type) {
                            case EnumName.E_MODIFY:
                                buttonColor = Colors.warning;
                                break;
                            case EnumName.E_DELETE:
                                buttonColor = Colors.volcano;
                                break;
                            case EnumName.E_EVALUATION:
                                buttonColor = Colors.BahamaBlue;
                                break;
                            case EnumName.E_UPDATESTATUS:
                                buttonColor = Colors.indigo;
                                break;
                            default:
                                buttonColor = Colors.info;
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
            fullName = dataItem.UserInfoName.split(' '),
            lastName = fullName[fullName.length - 1],
            firstChar = lastName ? lastName.split('')[0] : dataItem.UserInfoName,
            randomColor = Vnr_Function.randomColor(firstChar),
            { PrimaryColor, SecondaryColor } = randomColor;

        let colorStatus = null;
        if (dataItem.Status && Object.keys(dataItem.Status).length > 0 && dataItem.Status.theme) {
            colorStatus = dataItem.Status.theme.PrimaryColor;
        }

        return (
            <View style={styles.viewAvatar}>
                {dataItem.Image ? (
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

                <View
                    style={[
                        styles.buttonStatus,
                        {
                            backgroundColor: colorStatus != null ? colorStatus : Colors.gray_5
                        }
                    ]}
                />
            </View>
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
        } = this.props;

        let contentView = (
            <View style={styles.viewMenber}>
                <View style={styles.viewMenber_left}>{this.renderAvatar()}</View>
                <View style={styles.viewMenber_right}>
                    <Text style={[styleSheets.textFontMedium, styles.viewMenber_right__textprofile]}>
                        {dataItem.UserInfoName}
                    </Text>
                    <Text style={[styleSheets.text, styles.viewMenber_right__textEmail]}>
                        {dataItem.Permission == 'Admin' ? 'Trưởng nhóm' : dataItem.PositionName}
                    </Text>
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
        );
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
                {this.sheetActions && this.sheetActions.length > 1 ? (
                    <TouchableOpacity style={styles.swipeable} onPress={() => this.openActionSheet()}>
                        {contentView}
                    </TouchableOpacity>
                ) : (
                    <View style={styles.swipeable}>{contentView}</View>
                )}
            </Swipeable>
        );
    }
}

const HIGHT_AVATAR = Size.deviceWidth >= 1024 ? 70 : Size.deviceWidth * 0.12,
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
        marginLeft: PADDING_DEFINE + HIGHT_AVATAR / 2,
        borderWidth: 0.5,
        borderColor: Colors.gray_5
    },
    contentRight: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    swipeable: {
        flex: 1,
        backgroundColor: Colors.white,
        marginHorizontal: PADDING_DEFINE
    },
    viewListMenber: {
        flex: 1
    },
    styBtnMore: {
        backgroundColor: Colors.gray_5,
        borderRadius: 10,
        marginVertical: 5,
        marginRight: Size.defineHalfSpace,
        minWidth: 50
    },
    viewMenber: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 13
    },
    viewMenber_right: {
        flex: 1,
        justifyContent: 'center'
    },
    viewAvatar: {
        backgroundColor: Colors.borderColor,
        marginRight: 8,
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
    viewMenber_right__textprofile: {
        fontWeight: '500',
        fontSize: Size.text + 1
    },
    viewMenber_right__textEmail: {
        // fontWeight: '500',
        fontSize: Size.text - 2,
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
    }
});
