import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { Colors, Size, styleVnrListItem } from '../../../../../constants/styleConfig';
import { IconBack, IconDelete, IconInfo, IconEvaluate, IconProgressCheck } from '../../../../../constants/Icons';
import ActionSheet from 'react-native-actionsheet';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { translate } from '../../../../../i18n/translate';
import IconFeather from 'react-native-vector-icons/Feather';
import { EnumName } from '../../../../../assets/constant';
export default class TopAction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toggleCheckedAll: true
        };

        this.sheetActions = [
            {
                title: translate('HRM_Common_Close'),
                onPress: null
            }
        ];
        this.listActionsTop = null;
        if (!Vnr_Function.CheckIsNullOrEmpty(this.props.listActions)) {
            this.listActionsTop = this.props.listActions.map(item => {
                return item;
            });
            this.sheetActions = [...this.listActionsTop.slice(3), ...this.sheetActions];
        }
    }

    actionSheetOnCLick = index => {
        const { itemSelected, dataBody } = this.props;
        !Vnr_Function.CheckIsNullOrEmpty(this.sheetActions[index].onPress) &&
            this.sheetActions[index].onPress(itemSelected, dataBody, true);
    };

    openActionSheet = () => {
        this.ActionSheet.show();
    };

    render() {
        const options = this.sheetActions.map(item => {
            return item.title;
        });
        const TopActions = styleVnrListItem.TopActions;
        const { dataBody, itemSelected } = this.props;

        return (
            <View style={[TopActions.actionHeader, {}]}>
                <View style={TopActions.ActionList}>
                    <View style={TopActions.leftAction}>
                        <TouchableHighlight
                            onPress={() => this.props.closeAction()}
                            underlayColor={Colors.lightAccent}
                            style={TopActions.iconHighLight}
                        >
                            <IconBack color={Colors.primary} size={Size.iconSize} />
                        </TouchableHighlight>
                        <Text style={TopActions.number}>{this.props.numberItemSelected} </Text>
                    </View>

                    <View style={TopActions.rightAction}>
                        {!Vnr_Function.CheckIsNullOrEmpty(this.listActionsTop) &&
                            this.listActionsTop.length > 0 &&
                            this.listActionsTop.map((item, index) => {
                                let iconName = '';
                                let typeStatus = !Vnr_Function.CheckIsNullOrEmpty(item.type) ? item.type : null;
                                switch (typeStatus) {
                                    case EnumName.E_DELETE:
                                        iconName = <IconDelete size={Size.iconSize} color={Colors.primary} />;
                                        break;
                                    case EnumName.E_EVALUATION:
                                        iconName = <IconEvaluate size={Size.iconSize} color={Colors.primary} />;
                                        break;
                                    case EnumName.E_UPDATESTATUS:
                                        iconName = (
                                            <IconProgressCheck size={Size.iconSize + 5} color={Colors.primary} />
                                        );
                                        break;
                                    default:
                                        iconName = <IconInfo size={Size.iconSize} color={Colors.primary} />;
                                        break;
                                }
                                if (index <= 2) {
                                    return (
                                        <View style={TopActions.trashlefticon}>
                                            <TouchableHighlight
                                                onPress={() => {
                                                    item.onPress(itemSelected, dataBody, true);
                                                }}
                                                underlayColor={Colors.lightAccent}
                                                style={TopActions.iconLeftAction}
                                            >
                                                {iconName}
                                            </TouchableHighlight>
                                        </View>
                                    );
                                }
                            })}
                        {!Vnr_Function.CheckIsNullOrEmpty(this.sheetActions) && this.sheetActions.length > 1 && (
                            <View style={TopActions.trashlefticon}>
                                <TouchableHighlight
                                    onPress={() => this.openActionSheet()}
                                    underlayColor={Colors.lightAccent}
                                    style={TopActions.iconHighLight}
                                >
                                    <IconFeather name={'more-horizontal'} size={Size.iconSize} color={Colors.primary} />
                                </TouchableHighlight>
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
                    </View>
                </View>
            </View>
        );
    }
}
