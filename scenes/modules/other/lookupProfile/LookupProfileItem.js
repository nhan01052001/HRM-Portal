import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { Colors, CustomStyleSheet, Size, styleSheets, styleVnrListItem } from '../../../../constants/styleConfig';
import moment from 'moment';
import format from 'number-format.js';
import ActionSheet from 'react-native-actionsheet';
import Vnr_Function from '../../../../utils/Vnr_Function';
import { translate } from '../../../../i18n/translate';
import {
    IconLeaveDay,
    IconInOut,
    IconTime,
    IconMoreHorizontal,
    IconUser,
    IconStructure,
    IconSuitcase
} from '../../../../constants/Icons';
import { ConfigField } from '../../../../assets/configProject/ConfigField';

export default class LookupProfileItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.formatStringType = this.formatStringType.bind(this);
        this.setRightAction(props);
    }
    setRightAction = (thisProps) => {
        const { dataItem } = thisProps;
        this.sheetActions = [
            {
                title: translate('HRM_Common_Close'),
                onPress: null
            }
        ];
        if (!Vnr_Function.CheckIsNullOrEmpty(thisProps.rowActions)) {
            this.rightListActions = thisProps.rowActions.filter((item) => {
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
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.isPullToRefresh !== this.props.isPullToRefresh) {
            this.setRightAction(nextProps);
        }
    }
    shouldComponentUpdate(nextProps) {
        if (
            nextProps.isPullToRefresh !== this.props.isPullToRefresh ||
            nextProps.isSelect !== this.props.isSelect ||
            nextProps.isOpenAction !== this.props.isOpenAction
        ) {
            return true;
        } else {
            return false;
        }
    }

    formatStringType = (data, col) => {
        if (col.DataType && col.DataType.toLowerCase() == 'datetime') {
            return moment(data[col.Name]).format(col.DataFormat);
        }
        if (col.DataType && col.DataType.toLowerCase() == 'double') {
            return format(col.DataFormat, data[col.Name]);
        } else {
            return data[col.Name];
        }
    };
    openActionSheet = () => {
        this.ActionSheet.show();
    };
    actionSheetOnCLick = (index) => {
        const { dataItem } = this.props;
        !Vnr_Function.CheckIsNullOrEmpty(this.sheetActions[index].onPress) &&
            this.sheetActions[index].onPress(dataItem);
    };
    rightActionsEmpty = () => {
        return <View style={CustomStyleSheet.width(0)} />;
    };
    rightActions = () => {
        const options = this.sheetActions.map((item) => {
            return item.title;
        });

        return (
            <View style={styles.styViewRightAction}>
                {!Vnr_Function.CheckIsNullOrEmpty(this.sheetActions) && this.sheetActions.length > 1 && (
                    <View style={[styleVnrListItem.RenderItem.viewIcon, { backgroundColor: Colors.info }]}>
                        <TouchableOpacity onPress={() => this.openActionSheet()} style={styles.styTouchSheetAction}>
                            <View style={styleVnrListItem.RenderItem.icon}>
                                <IconMoreHorizontal size={Size.iconSize} color={Colors.white} />
                            </View>
                            <Text style={[styleSheets.text, { color: Colors.white }]}>{translate('MoreActions')}</Text>
                        </TouchableOpacity>
                        <ActionSheet
                            ref={(o) => (this.ActionSheet = o)}
                            //title={'Which one do you like ?'}
                            options={options}
                            cancelButtonIndex={this.sheetActions.length - 1}
                            destructiveButtonIndex={this.sheetActions.length - 1}
                            onPress={(index) => this.actionSheetOnCLick(index)}
                        />
                    </View>
                )}
                {!Vnr_Function.CheckIsNullOrEmpty(this.rightListActions) &&
                    this.rightListActions.length > 0 &&
                    this.rightListActions.map((item, index) => {
                        let buttonColor = '';
                        let iconName = '';
                        switch (item.type) {
                            case 'E_LEAVEDAY':
                                buttonColor = Colors.info;
                                iconName = <IconLeaveDay size={Size.iconSize} color={Colors.white} />;
                                break;
                            case 'E_INOUT':
                                buttonColor = Colors.warning;
                                iconName = <IconInOut size={Size.iconSize} color={Colors.white} />;
                                break;
                            case 'E_OVERTIME':
                                buttonColor = Colors.primary;
                                iconName = <IconTime size={Size.iconSize} color={Colors.white} />;
                                break;
                        }
                        if (this.sheetActions.length > 1 && index < 2) {
                            return (
                                <View style={[styleVnrListItem.RenderItem.viewIcon, { backgroundColor: buttonColor }]}>
                                    <TouchableOpacity onPress={() => item.onPress()} style={styles.styTouchSheetAction}>
                                        <View style={styleVnrListItem.RenderItem.icon}>{iconName}</View>
                                        <Text style={[styleSheets.text, { color: Colors.white }]}>{item.title}</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        } else if (this.sheetActions.length <= 1 && index < 3) {
                            return (
                                <View style={[styleVnrListItem.RenderItem.viewIcon, { backgroundColor: buttonColor }]}>
                                    <TouchableOpacity onPress={() => item.onPress()} style={styles.styTouchSheetAction}>
                                        <View style={styleVnrListItem.RenderItem.icon}>{iconName}</View>
                                        <Text style={[styleSheets.text, { color: Colors.white }]}>{item.title}</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        }
                    })}
            </View>
        );
    };

    render() {
        const { dataItem } = this.props;
        const { viewButton, BackgroundIcon, avatarStyle, avatar, viewButtonIOS, viewLable, numberPhone, rightUser } =
            styles;
        let imgUserDefault = '';
        if (dataItem.ImagePath) {
            imgUserDefault = {
                uri: dataItem.ImagePath
            };
        }

        const _configField =
            ConfigField && ConfigField.value['LookupProfile'] ? ConfigField.value['LookupProfile']['Hidden'] : [];
        let isShowCellphone = _configField.findIndex((key) => key == 'Cellphone') > -1 ? false : true;

        return Platform.OS == 'android' ? (
            <View style={BackgroundIcon}>
                <View style={viewButton}>
                    <View style={avatar}>
                        <Image source={imgUserDefault} style={avatarStyle} />
                        {isShowCellphone ? (
                            <Text style={[styleSheets.text, numberPhone]} numberOfLines={1}>
                                {dataItem.Cellphone}
                            </Text>
                        ) : null}
                    </View>
                    <View style={rightUser}>
                        <View style={viewLable}>
                            <View style={styles.viewIcon}>
                                <IconUser size={Size.iconSize} color={Colors.primary} />
                            </View>

                            <View style={styles.viewLable_text}>
                                <Text style={[styleSheets.text]} numberOfLines={1}>
                                    {dataItem.ProfileName}
                                </Text>
                            </View>
                        </View>

                        <View style={viewLable}>
                            <View style={styles.viewIcon}>
                                <IconStructure size={Size.iconSize} color={Colors.primary} />
                            </View>

                            <View style={styles.viewLable_text}>
                                <Text style={[styleSheets.text]} numberOfLines={1}>
                                    {dataItem.OrgStructureName}
                                </Text>
                            </View>
                        </View>

                        <View style={viewLable}>
                            <View style={styles.viewIcon}>
                                <IconSuitcase size={Size.iconSize} color={Colors.primary} />
                            </View>

                            <View style={styles.viewLable_text}>
                                <Text style={[styleSheets.text]} numberOfLines={1}>
                                    {dataItem.PositionName}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        ) : (
            <View style={viewButtonIOS}>
                <View style={avatar}>
                    <Image source={imgUserDefault} style={avatarStyle} />
                    {isShowCellphone ? (
                        <Text style={[styleSheets.text, numberPhone]} numberOfLines={1}>
                            {dataItem.Cellphone}
                        </Text>
                    ) : null}
                </View>

                <View style={rightUser}>
                    <View style={viewLable}>
                        <View style={styles.viewIcon}>
                            <IconUser size={Size.iconSize} color={Colors.primary} />
                        </View>
                        <View style={styles.viewLable_text}>
                            <Text style={[styleSheets.text]} numberOfLines={1}>
                                {dataItem.ProfileName}
                            </Text>
                        </View>
                    </View>

                    <View style={viewLable}>
                        <View style={styles.viewIcon}>
                            <IconStructure size={Size.iconSize} color={Colors.primary} />
                        </View>
                        <View style={styles.viewLable_text}>
                            <Text style={[styleSheets.text]} numberOfLines={1}>
                                {dataItem.OrgStructureName}
                            </Text>
                        </View>
                    </View>

                    <View style={viewLable}>
                        <View style={styles.viewIcon}>
                            <IconSuitcase size={Size.iconSize} color={Colors.primary} />
                        </View>
                        <View style={styles.viewLable_text}>
                            <Text style={[styleSheets.text]} numberOfLines={1}>
                                {dataItem.PositionName}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const WIDTH_ITEM = Size.deviceWidth - Size.defineSpace * 2;
const styles = StyleSheet.create({
    styViewRightAction: {
        maxWidth: 300,
        flexDirection: 'row'
    },
    styTouchSheetAction: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    // eslint-disable-next-line react-native/no-unused-styles
    viewButtonIOS: {
        //height: 100,
        width: WIDTH_ITEM,
        borderRadius: 12,
        marginHorizontal: styleSheets.m_10,
        marginVertical: styleSheets.m_10,
        padding: styleSheets.p_15,
        backgroundColor: Colors.whiteOpacity70,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
        flexDirection: 'row'
    },
    // eslint-disable-next-line react-native/no-unused-styles
    BackgroundIcon: {
        width: WIDTH_ITEM,
        borderRadius: 12,
        marginHorizontal: styleSheets.m_10,
        marginVertical: styleSheets.m_10,

        backgroundColor: Colors.whitePure,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 2
    },
    // eslint-disable-next-line react-native/no-unused-styles
    viewButton: {
        //height: 96,
        width: WIDTH_ITEM - 4,
        backgroundColor: Colors.whiteOpacity70,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        padding: styleSheets.p_15
    },
    // eslint-disable-next-line react-native/no-unused-styles
    avatar: {
        alignItems: 'center',
        marginRight: 10
    },
    // eslint-disable-next-line react-native/no-unused-styles
    avatarStyle: {
        width: 68,
        height: 68,
        resizeMode: 'cover',
        borderRadius: styleSheets.radius_5
    },
    // eslint-disable-next-line react-native/no-unused-styles
    viewLable: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 7,
        flexDirection: 'row',
        // paddingRight: 10
        marginRight: 10
    },
    // eslint-disable-next-line react-native/no-unused-styles
    numberPhone: {
        fontSize: Size.text - 2,
        marginTop: 15
    },
    // eslint-disable-next-line react-native/no-unused-styles
    rightUser: {
        flex: 1,
        justifyContent: 'center'
    },
    viewIcon: {
        marginRight: 15
    },
    viewLable_text: {
        flex: 1
    }
});
