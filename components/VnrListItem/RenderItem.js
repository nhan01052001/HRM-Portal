import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, CustomStyleSheet, Size, styleSheets, styleVnrListItem } from '../../constants/styleConfig';

import {
    IconEdit,
    IconCheck,
    IconMail,
    IconDelete,
    IconMoreHorizontal,
    IconInfo,
    IconCancelMarker,
    IconCancel
} from '../../constants/Icons';
import moment from 'moment';
import format from 'number-format.js';
import ActionSheet from 'react-native-actionsheet';
import Vnr_Function from '../../utils/Vnr_Function';
import { translate } from '../../i18n/translate';

export default class RenderItem extends React.Component {
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
            } else if (this.rightListActions.length > 0) {
                this.sheetActions = [...this.rightListActions.slice(3), ...this.sheetActions];
            }
        }
    };

    // eslint-disable-next-line react/no-deprecated
    componentWillReceiveProps(nextProps) {
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

        return (
            // eslint-disable-next-line react-native/no-inline-styles
            <View style={{ maxWidth: 300, flexDirection: 'row', marginBottom: 0.5 }}>
                {!Vnr_Function.CheckIsNullOrEmpty(this.sheetActions) && this.sheetActions.length > 1 && (
                    <View style={[styleVnrListItem.RenderItem.viewIcon, { backgroundColor: Colors.info }]}>
                        <TouchableOpacity
                            onPress={() => this.openActionSheet()}
                            style={styleVnrListItem.RenderItem.bnt_icon}
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
                        if (this.sheetActions.length > 1 && index < 2) {
                            return (
                                <View style={[styleVnrListItem.RenderItem.viewIcon, { backgroundColor: buttonColor }]}>
                                    <TouchableOpacity
                                        onPress={() => item.onPress(dataItem)}
                                        style={styleVnrListItem.RenderItem.bnt_icon}
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
                                        style={styleVnrListItem.RenderItem.bnt_icon}
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
            renderRowConfig,
            index,
            listItemOpenSwipeOut,
            rowActions,
            isOpenAction,
            numberDataSoure
        } = this.props;

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
                containerStyle={[
                    styleVnrListItem.RenderItem.swipeable,
                    isSelect && { backgroundColor: Colors.Secondary95 }
                ]}
            >
                <View
                    style={[
                        styleVnrListItem.RenderItem.rightContent,
                        isSelect && { backgroundColor: Colors.Secondary95 },
                        index < numberDataSoure - 1 && styleVnrListItem.RenderItem.borderItem
                    ]}
                    key={index}
                >
                    {renderRowConfig.map((row, index) => {
                        return (
                            <View style={styleVnrListItem.RenderItem.itemRow} key={index}>
                                {row.map((col, index) => {
                                    return (
                                        <View
                                            style={[
                                                // eslint-disable-next-line react-native/no-inline-styles
                                                {
                                                    flex: col.Col,
                                                    flexDirection: 'row',
                                                    justifyContent: 'flex-start'
                                                },
                                                col.ClassStyle != undefined && col.ClassStyle.ViewStyle
                                            ]}
                                            key={index}
                                        >
                                            <Text
                                                numberOfLines={1}
                                                style={[
                                                    styleSheets.text,
                                                    col.ClassStyle != undefined && col.ClassStyle.TextStyle,
                                                    col.Name == 'StatusView' &&
                                                        !Vnr_Function.CheckIsNullOrEmpty(dataItem.colorStatus) && {
                                                        color: dataItem.colorStatus
                                                    }
                                                ]}
                                            >
                                                {this.formatStringType(dataItem, col)}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        );
                    })}
                </View>
            </Swipeable>
        );
    }
}
