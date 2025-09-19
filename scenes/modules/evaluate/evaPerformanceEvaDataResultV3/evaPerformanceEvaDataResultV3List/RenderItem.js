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
    IconMail,
    IconDelete,
    IconMoreHorizontal,
    IconInfo,
    IconCheck,
    IconCancelMarker,
    IconBack,
    IconCancel
} from '../../../../../constants/Icons';
import VnrText from '../../../../../components/VnrText/VnrText';

export default class RenderItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.formatStringType = this.formatStringType.bind(this);
        this.setRightAction(props);
    }
    setRightAction = (thisProps) => {
        const { dataItem } = thisProps;
        dataItem.BusinessAllowAction = ['E_MODIFY'];
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
            nextProps.isOpenAction !== this.props.isOpenAction ||
            nextProps.isDisable !== this.props.isDisable
        ) {
            return true;
        } else {
            return false;
        }
    }
    formatStringType = (data, col) => {
        if (data[col.Name]) {
            if (col.DataType && col.DataType.toLowerCase() == 'datetime') {
                return moment(data[col.Name]).format(col.DataFormat);
            }
            if (col.DataType && col.DataType.toLowerCase() == 'double') {
                return format(col.DataFormat, data[col.Name]);
            } else {
                return data[col.Name];
            }
        } else {
            return '';
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
                        let buttonColor = '';
                        let iconName = '';
                        switch (item.type) {
                            case 'E_MODIFY':
                                buttonColor = Colors.warning;
                                iconName = <IconEdit size={Size.iconSize} color={Colors.white} />;
                                break;
                            case 'E_CANCEL':
                                buttonColor = Colors.red;
                                iconName = <IconCancelMarker size={Size.iconSize} color={Colors.white} />;
                                break;
                            case 'E_APPROVE':
                                buttonColor = Colors.success;
                                iconName = <IconCheck size={Size.iconSize} color={Colors.white} />;
                                break;
                            case 'E_REJECT':
                                buttonColor = Colors.volcano;
                                iconName = <IconCancel size={Size.iconSize + 2} color={Colors.white} />;
                                break;
                            case 'E_SENDMAIL':
                                buttonColor = Colors.primary;
                                iconName = <IconMail size={Size.iconSize} color={Colors.white} />;
                                break;
                            case 'E_DELETE':
                                buttonColor = Colors.danger;
                                iconName = <IconDelete size={Size.iconSize} color={Colors.white} />;
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
        const { dataItem, isSelect, index, listItemOpenSwipeOut, rowActions, isOpenAction, isDisable } = this.props;
        let actionView = <View />;

        // onpen action
        if (isOpenAction) {
            actionView = (
                <View
                    style={[
                        styles.leftContent,
                        this.props.isSelect && { backgroundColor: Colors.Secondary95 },
                        isDisable ? styleSheets.opacity05 : styleSheets.opacity1
                    ]}
                >
                    <TouchableOpacity
                        activeOpacity={isDisable ? 1 : 0.8}
                        onPress={() => {
                            !isDisable ? this.props.onClick() : null;
                        }}
                    >
                        <View
                            style={[
                                styles.circle,
                                this.props.isSelect && { backgroundColor: Colors.white },
                                styles.styViewIsSeletced
                            ]}
                        >
                            {this.props.isSelect && <IconCheck size={Size.iconSize - 4} color={Colors.primary} />}
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }

        //
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
                containerStyle={[styles.swipeable, isSelect && { backgroundColor: Colors.Secondary95 }]}
            >
                <View
                    style={[styles.content, isSelect && { backgroundColor: Colors.primary_transparent_8 }]}
                    key={index}
                >
                    {actionView}

                    <View style={styles.contentRight}>
                        <View style={styles.Line}>
                            <View style={styles.IconView}>
                                <VnrText i18nKey={'HRM_HR_Category_Employee'} style={[styleSheets.lable]} />
                            </View>
                            <View style={styles.valueView}>
                                <Text numberOfLines={1} style={[styleSheets.text]}>
                                    {dataItem.ProfileName}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.Line}>
                            <View style={styles.IconView}>
                                <VnrText i18nKey={'HRM_HR_Contract_ContractEvaType'} style={[styleSheets.lable]} />
                            </View>
                            <View style={styles.valueView}>
                                <Text numberOfLines={1} style={[styleSheets.text]}>
                                    {dataItem.PerformanceTypeName}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.Line}>
                            <View style={styles.IconView}>
                                <VnrText i18nKey={'PerformanceTime'} style={[styleSheets.lable]} />
                            </View>
                            <View style={styles.valueView}>
                                <Text numberOfLines={1} style={[styleSheets.text]}>
                                    {dataItem.EvaluationTime}
                                </Text>
                            </View>
                        </View>
                    </View>
                    {Array.isArray(this.rightListActions) && this.rightListActions.length > 0 && (
                        <View style={styles.actionRight}>
                            <IconBack color={Colors.grey} size={Size.iconSize} />
                        </View>
                    )}
                </View>
            </Swipeable>
        );
    }
}

const styles = StyleSheet.create({
    styViewIsSeletced: {
        borderColor: Colors.primary,
        borderWidth: 1
    },
    styViewRightAction: { maxWidth: 300, flexDirection: 'row', marginBottom: 0.5 },
    content: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 15,
        backgroundColor: Colors.white,
        borderRadius: 10
    },
    swipeable: {
        flex: 1
    },
    Line: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 5
    },
    valueView: {
        flex: 6,
        marginLeft: 10,
        alignItems: 'center',
        flexDirection: 'row'
    },
    IconView: {
        //height: '100%',
        flex: 4,
        justifyContent: 'center'
    },
    circle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: Size.iconSize,
        height: Size.iconSize,
        borderRadius: Size.iconSize / 2,
        borderWidth: 0.5,
        borderColor: Colors.borderColor
    },
    leftContent: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10
    },
    contentRight: {
        flex: 1,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    actionRight: {
        marginRight: 5
    }
});
