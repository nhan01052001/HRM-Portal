import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {
    Colors,
    CustomStyleSheet,
    Size,
    styleSheets,
    styleSwipeableAction
} from '../../../../../constants/styleConfig';
import moment from 'moment';
import format from 'number-format.js';
import ActionSheet from 'react-native-actionsheet';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { translate } from '../../../../../i18n/translate';
import {
    IconEdit,
    IconDelete,
    IconMoreHorizontal,
    IconEvaluate,
    IconInfo,
    IconProgressCheck,
    IconBack
} from '../../../../../constants/Icons';
import VnrText from '../../../../../components/VnrText/VnrText';
import { EnumName } from '../../../../../assets/constant';

export default class RenderItemAction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.formatStringType = this.formatStringType.bind(this);
        this.setRightAction(props);
    }
    setRightAction = (thisProps) => {
        const { dataItem } = thisProps;
        dataItem.BusinessAllowAction = ['E_DELETE', 'E_MODIFY'];
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
            if (this.rightListActions.length > 2) {
                this.sheetActions = [...this.rightListActions.slice(1), ...this.sheetActions];
            } else if (this.rightListActions.length > 0) {
                this.sheetActions = [...this.rightListActions.slice(2), ...this.sheetActions];
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

    formatStringType = (data, col, styleText) => {
        if (!Vnr_Function.CheckIsNullOrEmpty(data[col.Name])) {
            if (col.Name == 'StatusView' && !Vnr_Function.CheckIsNullOrEmpty(data.colorStatus)) {
                return (
                    <View style={[styles.LineSatus, { backgroundColor: data.colorStatus }]}>
                        <Text style={[styleSheets.textItalic, styles.txtstyleStatus]} numberOfLines={2}>
                            {data[col.Name]}
                        </Text>
                    </View>
                );
            }
            if (col.DataType && col.DataType.toLowerCase() == 'datetime') {
                return (
                    <Text style={[styleSheets.text, { fontSize: Size.text - 2 }]} numberOfLines={1}>
                        {moment(data[col.Name]).format(col.DataFormat)}
                    </Text>
                );
            }
            if (col.DataType && col.DataType.toLowerCase() == 'double') {
                return (
                    <Text style={[styleSheets.text, { fontSize: Size.text - 2 }]} numberOfLines={1}>
                        {format(col.DataFormat, data[col.Name])}
                    </Text>
                );
            } else {
                return (
                    <Text style={[styleSheets.text, styleText]} numberOfLines={1}>
                        {data[col.Name]}
                    </Text>
                );
            }
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
        const { dataItem } = this.props;
        //dataItem.BusinessAllowAction = ["E_CANCEL", "E_DELETE", "E_APPROVE"];

        return (
            <View style={styles.styViewRightAction}>
                {!Vnr_Function.CheckIsNullOrEmpty(this.sheetActions) && this.sheetActions.length > 1 && (
                    <View style={styleSwipeableAction.viewIcon}>
                        <TouchableOpacity onPress={() => this.openActionSheet()} style={styleSwipeableAction.bnt_icon}>
                            <View style={[styleSwipeableAction.icon, { backgroundColor: Colors.gray_7 }]}>
                                <IconMoreHorizontal size={Size.iconSize} color={Colors.white} />
                            </View>
                            <Text style={[styleSheets.text]}>{translate('MoreActions')}</Text>
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
                        let buttonColor = '',
                            iconName = '';

                        switch (item.type) {
                            case EnumName.E_MODIFY:
                                buttonColor = Colors.warning;
                                iconName = <IconEdit size={Size.iconSize} color={Colors.white} />;
                                break;
                            case EnumName.E_DELETE:
                                buttonColor = Colors.danger;
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
                        if (this.sheetActions.length > 0 && index < 1) {
                            return (
                                <View style={styleSwipeableAction.viewIcon}>
                                    <TouchableOpacity
                                        onPress={() => item.onPress(dataItem)}
                                        style={styleSwipeableAction.bnt_icon}
                                    >
                                        <View style={[styleSwipeableAction.icon, { backgroundColor: buttonColor }]}>
                                            {iconName}
                                        </View>
                                        <Text style={[styleSheets.text]}>{item.title}</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        } else if (this.sheetActions.length <= 1 && index < 2) {
                            return (
                                <View style={styleSwipeableAction.viewIcon}>
                                    <TouchableOpacity
                                        onPress={() => item.onPress(dataItem)}
                                        style={styleSwipeableAction.bnt_icon}
                                    >
                                        <View style={[styleSwipeableAction.icon, { backgroundColor: buttonColor }]}>
                                            {iconName}
                                        </View>
                                        <Text style={[styleSheets.text]}>{item.title}</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        }
                    })}
            </View>
        );
    };

    render() {
        const { dataItem, isSelect, index, listItemOpenSwipeOut, isOpenAction, rowActions } = this.props;
        return (
            <Swipeable
                ref={(ref) => {
                    this.Swipe = ref;
                    if (
                        listItemOpenSwipeOut.findIndex((value) => {
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
                <View
                    style={[styles.content, isSelect && { backgroundColor: Colors.primary_transparent_8 }]}
                    key={index}
                >
                    <View style={styles.contentRight}>
                        <View style={styles.Line}>
                            <View style={styles.IconView}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.lable, styles.txtLable]}
                                    i18nKey={'TeamCode'}
                                />
                            </View>
                            <View style={styles.valueView}>
                                <Text numberOfLines={1} style={[styleSheets.text]}>
                                    {dataItem.TaskLevelGroupCode ? dataItem.TaskLevelGroupCode : ''}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.Line}>
                            <View style={styles.IconView}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.lable, styles.txtLable]}
                                    i18nKey={'HRM_Tas_Task_LevelGroup'}
                                />
                            </View>
                            <View style={styles.valueView}>
                                <Text numberOfLines={1} style={[styleSheets.text]}>
                                    {dataItem.TaskLevelGroupName ? dataItem.TaskLevelGroupName : ''}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.Line}>
                            <View style={styles.IconView}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.lable, styles.txtLable]}
                                    i18nKey={'HRM_Tas_Task_Level'}
                                />
                            </View>
                            <View style={styles.valueView}>
                                <Text numberOfLines={1} style={[styleSheets.text]}>
                                    {dataItem.TaskLevelName ? dataItem.TaskLevelName : ''}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.Line}>
                            <View style={styles.IconView}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.lable, styles.txtLable]}
                                    i18nKey={'HRM_Tas_Task_Proportion'}
                                />
                            </View>
                            <View style={styles.valueView}>
                                <Text numberOfLines={1} style={[styleSheets.text]}>
                                    {dataItem.Proportion ? dataItem.Proportion : ''}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.Line}>
                            <View style={styles.IconView}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.lable, styles.txtLable]}
                                    i18nKey={'Description'}
                                />
                            </View>
                            <View style={styles.valueView}>
                                <Text numberOfLines={1} style={[styleSheets.text]}>
                                    {dataItem.Description ? dataItem.Description : ''}
                                </Text>
                            </View>
                        </View>

                        <ActionSheet
                            ref={(o) => (this.ActionSheet = o)}
                            title={'Which one do you like ?'}
                            options={['action 1', 'action 2', 'cancel']}
                            cancelButtonIndex={2}
                            destructiveButtonIndex={1}
                            onPress={(index) => this.actionSheetOnCLick(index)}
                        />
                    </View>

                    {Array.isArray(this.rightListActions) && this.rightListActions.length > 0 && (
                        <View>
                            <IconBack color={Colors.grey} size={Size.iconSize} />
                        </View>
                    )}
                </View>
            </Swipeable>
        );
    }
}

const styles = StyleSheet.create({
    styViewRightAction: { maxWidth: 300, flexDirection: 'row' },
    content: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: styleSheets.p_10,
        backgroundColor: Colors.white,
        paddingLeft: 10,
        borderRadius: 5
    },
    contentRight: {
        flex: 1
    },
    LineSatus: {
        //paddingVertical  :2,
        paddingHorizontal: 3,
        borderRadius: styleSheets.radius_5,
        alignItems: 'center'
    },
    txtstyleStatus: {
        color: Colors.white,
        fontWeight: '600'
    },
    Line: {
        flex: 1,
        flexDirection: 'row',
        maxWidth: '100%',
        justifyContent: 'center',
        marginBottom: 3
    },
    valueView: {
        flex: 6,
        marginLeft: 10,
        alignItems: 'center',
        flexDirection: 'row'
    },
    IconView: {
        flex: 4,
        height: '100%',
        justifyContent: 'center'
    }
});
