import React from 'react';
import { View, TouchableHighlight } from 'react-native';
import { Colors, styleVnrListItem, styleSheets, CustomStyleSheet } from '../../constants/styleConfig';
import VnrText from '../../components/VnrText/VnrText';
import { translate } from '../../i18n/translate';

export default class BottomAction extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isCheck: {
                value: false,
                disable: false
            },
            isCheckServer: {
                value: false,
                disable: false
            }
        };
    }

    //check all client
    toggleChecked = (isChecked, isCheckAndUnCheckALl = true) => {
        const { isCheck, isCheckServer } = this.state;
        if (!isChecked) {
            this.setState(
                {
                    isCheck: {
                        ...isCheck,
                        value: !isChecked
                    },
                    isCheckServer: {
                        ...isCheckServer,
                        disable: true
                    }
                },
                () => {
                    isCheckAndUnCheckALl && this.props.checkedAll(null);
                }
            );
        } else {
            this.setState(
                {
                    isCheck: {
                        ...isCheck,
                        value: !isChecked
                    },
                    isCheckServer: {
                        ...isCheckServer,
                        disable: false
                    }
                },
                () => {
                    isCheckAndUnCheckALl && this.props.unCheckedAll(null);
                }
            );
        }
    };

    //check all server
    toggleCheckedServer = (isChecked, isCheckAndUnCheckALl = true) => {
        const { isCheck, isCheckServer } = this.state;
        if (!isChecked) {
            this.setState(
                {
                    isCheckServer: {
                        ...isCheckServer,
                        value: !isChecked
                    },
                    isCheck: {
                        ...isCheck,
                        disable: true
                    }
                },
                () => {
                    isCheckAndUnCheckALl && this.props.checkedAll(true);
                }
            );
        } else {
            this.setState(
                {
                    isCheckServer: {
                        ...isCheckServer,
                        value: !isChecked
                    },
                    isCheck: {
                        ...isCheck,
                        disable: false
                    }
                },
                () => {
                    isCheckAndUnCheckALl && this.props.unCheckedAll(false);
                }
            );
        }
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { isCheck, isCheckServer } = this.state;
        if (nextProps.numberItemSelected === this.props.lengthDataSource && !isCheck.value && !isCheckServer.value) {
            this.toggleChecked(false);
        } else if (
            nextProps.numberItemSelected < this.props.lengthDataSource &&
            isCheck.value &&
            !isCheckServer.value
        ) {
            this.toggleChecked(true, false);
        } else if (
            nextProps.numberItemSelected < this.props.lengthDataSource &&
            !isCheck.value &&
            isCheckServer.value
        ) {
            this.toggleCheckedServer(true, false);
        }
    }
    render() {
        const BottomActions = styleVnrListItem.BottomActions,
            { isCheck, isCheckServer } = this.state;
        const { totalRow } = this.props;

        let _tran = isCheckServer.value
            ? translate('UNSELECT_ALL') + '(' + totalRow + ')'
            : translate('SELECT_ALL') + '(' + totalRow + ')';
        return (
            <View style={[BottomActions.actionHeader, { minHeight: this.props.heightAction }]}>
                <View style={BottomActions.itemaACtionleft}>
                    <View style={isCheck.disable ? CustomStyleSheet.opacity(0.5):CustomStyleSheet.opacity(1)}>
                        <TouchableHighlight
                            activeOpacity={isCheck.disable ? 1 : 0.8}
                            onPress={() => (!isCheck.disable ? this.toggleChecked(isCheck.value) : null)}
                            underlayColor={!isCheck.disable ? Colors.lightAccent : Colors.white}
                            style={BottomActions.iconHighLight}
                        >
                            {!isCheck.value ? (
                                <VnrText
                                    style={[styleSheets.text, { color: Colors.gray_10 }]}
                                    i18nKey={'SELECT_ALL'}
                                    value={'select all'}
                                />
                            ) : (
                                <VnrText
                                    style={[styleSheets.text, { color: Colors.gray_10 }]}
                                    i18nKey={'UNSELECT_ALL'}
                                    value={'Unselect all'}
                                />
                            )}
                        </TouchableHighlight>
                    </View>
                    <View style={isCheckServer.disable ? CustomStyleSheet.opacity(0.5):CustomStyleSheet.opacity(1)}>
                        <TouchableHighlight
                            activeOpacity={isCheckServer.disable ? 1 : 0.8}
                            onPress={() =>
                                !isCheckServer.disable ? this.toggleCheckedServer(isCheckServer.value) : null
                            }
                            underlayColor={!isCheckServer.disable ? Colors.lightAccent : Colors.white}
                            style={BottomActions.iconHighLight}
                        >
                            <VnrText style={[styleSheets.text, { color: Colors.gray_10 }]} value={_tran} />
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        );
    }
}
