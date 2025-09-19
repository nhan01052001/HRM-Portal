import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, CustomStyleSheet, Size, styleSheets, styleVnrListItem } from '../../constants/styleConfig';
import moment from 'moment';
import format from 'number-format.js';
import ActionSheet from 'react-native-actionsheet';
import Vnr_Function from '../../utils/Vnr_Function';
import { translate } from '../../i18n/translate';
import {
    IconEdit,
    IconColse,
    IconCheckCirlceo,
    IconMail,
    IconDelete,
    IconMoreHorizontal,
    IconDate,
    IconNext,
    IconInfo
} from '../../constants/Icons';
import VnrText from '../VnrText/VnrText';

export default class RenderItemAction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.formatStringType = this.formatStringType.bind(this);
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
        if (!Vnr_Function.CheckIsNullOrEmpty(thisProps.rowActions)) {
            this.rightListActions = thisProps.rowActions.filter(item => {
                item.title = translate(item.title);
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

    formatStringType = (data, col, styleText) => {
        if (!Vnr_Function.CheckIsNullOrEmpty(data[col.Name])) {
            if (col.Name == 'StatusView' && !Vnr_Function.CheckIsNullOrEmpty(data.colorStatus)) {
                return (
                    <Text style={[styleSheets.text, styleText, { color: data.colorStatus }]} numberOfLines={1}>
                        {data[col.Name]}
                    </Text>
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
    actionSheetOnCLick = index => {
        const { dataItem } = this.props;
        !Vnr_Function.CheckIsNullOrEmpty(this.sheetActions[index].onPress) &&
            this.sheetActions[index].onPress(dataItem);
    };
    rightActionsEmpty = () => {
        return <View style={CustomStyleSheet.width(0)} />;
    };
    rightActions = () => {
        const options = this.sheetActions.map(item => {
            return item.title;
        });
        const { dataItem } = this.props;
        // dataItem.BusinessAllowAction = ["E_CANCEL", "E_DELETE", "E_APPROVE"];

        return (
            <View style={styles.styRightAction}>
                {!Vnr_Function.CheckIsNullOrEmpty(this.sheetActions) && this.sheetActions.length > 1 && (
                    <View style={[styleVnrListItem.RenderItem.viewIcon, { backgroundColor: Colors.info }]}>
                        <TouchableOpacity
                            onPress={() => this.openActionSheet()}
                            style={styles.styRightItem}
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
                        let buttonColor = '';
                        let iconName = '';
                        switch (item.type) {
                            case 'E_MODIFY':
                                buttonColor = Colors.warning;
                                iconName = <IconEdit size={Size.iconSize} color={Colors.white} />;
                                break;
                            case 'E_CANCEL':
                                buttonColor = Colors.warning;
                                iconName = <IconColse size={Size.iconSize} color={Colors.white} />;
                                break;
                            case 'E_APPROVE':
                                buttonColor = Colors.success;
                                iconName = <IconCheckCirlceo size={Size.iconSize} color={Colors.white} />;
                                break;
                            case 'E_REJECT':
                                buttonColor = Colors.danger;
                                iconName = <IconColse size={Size.iconSize} color={Colors.white} />;
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
                        if (this.sheetActions.length > 1 && index < 2) {
                            return (
                                <View style={[styleVnrListItem.RenderItem.viewIcon, { backgroundColor: buttonColor }]}>
                                    <TouchableOpacity
                                        onPress={() => item.onPress(dataItem)}
                                        style={styles.styRightItem}
                                    >
                                        <View style={styleVnrListItem.RenderItem.icon}>{iconName}</View>
                                        <Text style={[styleSheets.text, { color: Colors.white }]}>{item.title}</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        } else if (this.sheetActions.length <= 1 && index < 3) {
                            return (
                                <View style={[styleVnrListItem.RenderItem.viewIcon, { backgroundColor: buttonColor }]}>
                                    <TouchableOpacity
                                        onPress={() => item.onPress(dataItem)}
                                        style={styles.styRightItem}
                                    >
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
        const {
            dataItem,
            isSelect,
            index,
            listItemOpenSwipeOut,
            isOpenAction,
            rowActions
        } = this.props;
        const RenderItemAction = styles; //styleVnrListItem.RenderItemAction;
        let ViewDateTodateFrom = <View />;
        if (
            !Vnr_Function.CheckIsNullOrEmpty(dataItem['DateStart']) ||
            !Vnr_Function.CheckIsNullOrEmpty(dataItem['DateEnd'])
        ) {
            ViewDateTodateFrom = (
                <View style={RenderItemAction.Line}>
                    <View style={RenderItemAction.iconDateContent}>
                        <IconDate size={Size.text + 1} color={Colors.primary} />
                    </View>
                    {this.formatStringType(dataItem, {
                        Name: 'DateStart',
                        DataType: 'datetime',
                        DataFormat: 'DD/MM/YY'
                    })}
                    <Text> - </Text>
                    {this.formatStringType(dataItem, { Name: 'DateEnd', DataType: 'datetime', DataFormat: 'DD/MM/YY' })}
                </View>
            );
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
                <View
                    style={[
                        RenderItemAction.rightContent,
                        isSelect && { backgroundColor: Colors.primary_transparent_8 }
                    ]}
                    key={index}
                >
                    <View style={RenderItemAction.viewInfo}>
                        <View style={RenderItemAction.Line}>
                            <Text style={[styleSheets.lable, { fontSize: Size.text - 2 }]}>
                                {dataItem['ProfileName']}
                            </Text>
                        </View>

                        {ViewDateTodateFrom}

                        <View style={RenderItemAction.Line}>
                            <VnrText
                                numberOfLines={1}
                                style={[styleSheets.textItalic, RenderItemAction.fontText]}
                                i18nKey={'HRM_System_Resource_Tra_Reason'}
                            />
                            <Text style={[styleSheets.textItalic, RenderItemAction.fontText]}>: </Text>
                            <View style={CustomStyleSheet.flex(1)}>
                                <Text numberOfLines={1} style={[styleSheets.textItalic, RenderItemAction.fontText]}>
                                    {dataItem['Comment']}
                                </Text>
                            </View>
                        </View>

                        <View style={RenderItemAction.Line}>
                            <VnrText
                                numberOfLines={1}
                                style={[styleSheets.textItalic, RenderItemAction.fontText]}
                                i18nKey={'HRM_Evaluation_Evaluator_ApprovedName'}
                            />
                            <Text style={[styleSheets.textItalic, RenderItemAction.fontText]}>: </Text>
                            <View style={CustomStyleSheet.flex(1)}>
                                <Text numberOfLines={1} style={[styleSheets.textItalic, RenderItemAction.fontText]}>
                                    {dataItem['UserApproveName2']}
                                </Text>
                            </View>
                        </View>

                        <View style={RenderItemAction.Line}>
                            <VnrText
                                numberOfLines={1}
                                style={[styleSheets.textItalic, RenderItemAction.fontText]}
                                i18nKey={'HRM_FIN_TravelRequest_Status'}
                            />
                            <Text style={[styleSheets.textItalic, RenderItemAction.fontText]}>: </Text>
                            {this.formatStringType(dataItem, { Name: 'StatusView' }, styleSheets.textItalic)}
                        </View>
                    </View>
                    <View style={RenderItemAction.viewOvertime}>
                        <View style={RenderItemAction.numberTime}>
                            <Text numberOfLines={1} style={[styleSheets.lable, { color: Colors.white }]}>
                                {dataItem['LeaveHours']}
                            </Text>
                        </View>
                        <IconNext size={Size.iconSize} color={Colors.grey} />
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
            </Swipeable>
        );
    }
}

const styles = StyleSheet.create({
    styRightAction : { maxWidth: 300, flexDirection: 'row' },
    styRightItem : styles.styRightItem
});
