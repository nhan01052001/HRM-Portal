import React, { Component } from 'react';
import { View, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Colors, CustomStyleSheet, Size, styleSheets, stylesVnrFilter } from '../../constants/styleConfig';
import moment from 'moment';
import VnrTextInput from '../../components/VnrTextInput/VnrTextInput';
import VnrPicker from '../../components/VnrPicker/VnrPicker';
import VnrPickerMulti from '../../components/VnrPickerMulti/VnrPickerMulti';
import VnrDate from '../../components/VnrDate/VnrDate';
import VnrMonthYear from '../../components/VnrMonthYear/VnrMonthYear';
import VnrTreeView from '../VnrTreeView/VnrTreeView';
import VnrText from '../VnrText/VnrText';
import Vnr_Function from '../../utils/Vnr_Function';
import HttpService from '../../utils/HttpService';
import { VnrLoadingSevices } from '../VnrLoading/VnrLoadingPages';
import { Format, EnumName, ControlName } from '../../assets/constant';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default class VnrFilter extends Component {
    constructor(props) {
        super(props);

        const _state = this.createStateFilter();
        this.state = _state;
        this.state.refresh = false;
    }

    createStateFilter = isClearValue => {
        const arrState = {},
            { E_value } = EnumName;
        this.props.filterConfig.forEach(item => {
            item.ControlGroup.forEach(control => {
                if (isClearValue) {
                    let _control = { ...control };
                    if (Object.prototype.hasOwnProperty.call(_control, E_value)) {
                        delete _control[E_value];
                    }
                    arrState[control.fieldName] = { ..._control };
                } else {
                    arrState[control.fieldName] = { ...control };
                }
            });
        });
        return arrState;
    };

    handelData = async control => {
        switch (control.Name) {
            case ControlName.VnrSwitch: {
                let _result = this.switchResult(control.value);
                return {
                    Text: _result,
                    Value: _result
                };
            }
            case ControlName.VnrText: {
                let _result = this.textResult(control.value);
                return {
                    Text: _result,
                    Value: _result
                };
            }
            case ControlName.VnrDate: {
                if (
                    !Vnr_Function.CheckIsNullOrEmpty(control.response) &&
                    control.response == EnumName.E_string &&
                    control.Name == ControlName.VnrDate &&
                    control.value
                ) {
                    let dataFomart = await this.formatDataFromSever(control.value);
                    if (control.timeStart) {
                        dataFomart = moment(control.value)
                            .startOf('day')
                            .format('YYYY-MM-DD HH:mm:ss');
                    } else if (control.timeEnd) {
                        dataFomart = moment(control.value)
                            .endOf('day')
                            .format('YYYY-MM-DD HH:mm:ss');
                    }
                    return {
                        Text: moment(control.value).format(control.format),
                        Value: dataFomart
                    };
                } else if (control.value) {
                    return {
                        Text: moment(control.value).format(control.format),
                        Value: this.vnrDateResult(control.value, control)
                    };
                } else {
                    return null;
                }
            }
            case ControlName.VnrMonthYear: {
                if (
                    !Vnr_Function.CheckIsNullOrEmpty(control.response) &&
                    control.response == EnumName.E_string &&
                    control.Name == ControlName.VnrMonthYear &&
                    control.value
                ) {
                    const dataFomart = await this.formatDataFromSever(control.value);
                    return {
                        Text: moment(control.value).format(control.format),
                        Value: dataFomart
                    };
                } else if (control.value) {
                    return {
                        Text: moment(control.value).format(control.format),
                        Value: this.vnrDateResult(control.value, control)
                    };
                } else {
                    return null;
                }
            }
            case ControlName.VnrTime: {
                if (control.value) {
                    return {
                        Text: moment(control.value).format(control.format),
                        Value: this.vnrDateResult(control.value, control)
                    };
                } else {
                    return null;
                }
            }
            case ControlName.VnrPicker:
                return this.pickerResult(control.value, control);
            case ControlName.VnrPickerMulti:
                return this.pickerMultiResult(control.value, control);
            case ControlName.VnrTreeView:
                return this.treeViewResult(control.value, control);

            default:
                return null;
        }
    };

    ShowData = async () => {
        // Check Internet
        if (!HttpService.checkConnectInternet()) {
            HttpService.showAlertNoNetwork(this.ShowData);
            return;
        }
        VnrLoadingSevices.show();
        const dataConfirm = {},
            dataDisplay = {},
            pureData = this.state;

        // eslint-disable-next-line no-unused-vars
        for (let key in pureData) {
            let control = pureData[key],
                _handelData = await this.handelData(control);

            dataConfirm[control.fieldName] = _handelData ? _handelData.Value : null;
            dataDisplay[control.fieldName] = _handelData ? _handelData.Text : null;
        }
        if (dataConfirm != {}) {
            VnrLoadingSevices.hide();
            this.props.onFinish(dataDisplay, dataConfirm, pureData);
        }
    };

    textResult = item => {
        if (!Vnr_Function.CheckIsNullOrEmpty(item)) {
            return item;
        } else {
            return '';
        }
    };

    switchResult = item => {
        if (!Vnr_Function.CheckIsNullOrEmpty(item)) {
            return item;
        } else {
            return false;
        }
    };

    pickerResult = (item, control) => {
        if (!Vnr_Function.CheckIsNullOrEmpty(item)) {
            return { Text: item[control.textField], Value: item[control.valueField] };
        } else {
            return null;
        }
    };

    pickerMultiResult = (listItem, control) => {
        let listFormat = null;
        if (Vnr_Function.CheckIsNullOrEmpty(listItem) == true || listItem.length == 0) {
            return null;
        }

        if (!Vnr_Function.CheckIsNullOrEmpty(control.response) && control.response == EnumName.E_string) {
            listFormat = {
                Text: listItem
                    .map(item => {
                        return item[control.textField];
                    })
                    .join(', '),
                Value: listItem
                    .map(item => {
                        return item[control.valueField];
                    })
                    .join(',')
            };
        } else {
            listFormat = {
                Text: listItem
                    .map(item => {
                        return item[control.textField];
                    })
                    .join(', '),
                Value: listItem.map(item => {
                    return item[control.valueField];
                })
            };
        }

        return listFormat;
    };

    treeViewResult = (listItem, control) => {
        let listFormat = null;
        if (Vnr_Function.CheckIsNullOrEmpty(listItem) == true || listItem.length == 0) {
            return null;
        }

        if (!Vnr_Function.CheckIsNullOrEmpty(control.response) && control.response == EnumName.E_string) {
            listFormat = {
                Text: listItem
                    .map(item => {
                        return item[control.textField];
                    })
                    .join(', '),
                Value: listItem
                    .map(item => {
                        return item[control.valueField];
                    })
                    .join(',')
            };
        } else {
            listFormat = {
                Text: listItem
                    .map(item => {
                        return item[control.textField];
                    })
                    .join(', '),
                Value: listItem.map(item => {
                    return item[control.valueField];
                })
            };
        }
        return listFormat;
    };

    formatDataFromSever = async value => {
        const api = {
            urlApi: '[URI_SYS]/Sys_GetData/GetFormatDate',
            type: EnumName.E_POST,
            dataBody: {
                value: moment(value).format(Format.Date_DDMMYYYY)
            }
        };
        const dataFomart = await HttpService.Post(api.urlApi, api.dataBody);
        return dataFomart;
    };

    vnrDateResult = (value, control) => {
        if (!Vnr_Function.CheckIsNullOrEmpty(value)) {
            if (
                !Vnr_Function.CheckIsNullOrEmpty(control.response) &&
                control.response == EnumName.E_string &&
                control.Name == ControlName.VnrTime
            ) {
                return moment(value).format(control.format);
            } else {
                return value;
            }
        } else {
            return null;
        }
    };

    refreshControl = () => {
        let _state = this.state;
        _state = this.createStateFilter(true);
        _state.refresh = !this.state.refresh;
        this.setState(_state);
    };

    clearFilter = () => {
        this.refreshControl();
    };

    renderControl = (control, index) => {
        switch (control.Name) {
            case ControlName.VnrText:
                return (
                    <VnrTextInput
                        {...control}
                        value={this.state[control.fieldName].value}
                        onChangeText={text => {
                            const fieldControl = this.state[control.fieldName];
                            fieldControl.value = text;
                            this.setState({ [control.fieldName]: fieldControl });
                        }}
                        key={control.fieldName}
                        refresh={this.state.refresh}
                    />
                );
            case ControlName.VnrDate: {
                let controlVnrDate = { ...control };
                controlVnrDate.response = null;
                return (
                    <VnrDate
                        key={control.fieldName}
                        {...controlVnrDate}
                        value={this.state[control.fieldName].value}
                        stylePicker={index == 1 ? stylesVnrFilter.controlDate_To : stylesVnrFilter.controlDate_from}
                        onFinish={value => {
                            const fieldControl = this.state[control.fieldName];
                            fieldControl.value = value;
                            this.setState({ [control.fieldName]: fieldControl });
                        }}
                        refresh={this.state.refresh}
                    />
                );
            }
            case ControlName.VnrMonthYear: {
                let controlVnrMonthYear = { ...control };
                controlVnrMonthYear.response = null;
                return (
                    <VnrMonthYear
                        key={control.fieldName}
                        {...controlVnrMonthYear}
                        value={this.state[control.fieldName].value}
                        stylePicker={index == 1 ? stylesVnrFilter.controlDate_To : stylesVnrFilter.controlDate_from}
                        onFinish={value => {
                            const fieldControl = this.state[control.fieldName];
                            fieldControl.value = value;
                            this.setState({ [control.fieldName]: fieldControl });
                        }}
                        refresh={this.state.refresh}
                    />
                );
            }
            case ControlName.VnrTime:
                return (
                    <VnrDate
                        key={control.fieldName}
                        {...control}
                        value={this.state[control.fieldName].value}
                        onFinish={value => {
                            const fieldControl = this.state[control.fieldName];
                            fieldControl.value = value;
                            this.setState({ [control.fieldName]: fieldControl });
                        }}
                        refresh={this.state.refresh}
                    />
                );
            case ControlName.VnrPicker:
                return (
                    <VnrPicker
                        key={control.fieldName}
                        {...control}
                        value={this.state[control.fieldName].value}
                        onFinish={Item => {
                            const fieldControl = this.state[control.fieldName];
                            fieldControl.value = Item;
                            this.setState({ [control.fieldName]: fieldControl });
                        }}
                        refresh={this.state.refresh}
                    />
                );
            case ControlName.VnrPickerMulti:
                return (
                    <VnrPickerMulti
                        key={control.fieldName}
                        {...control}
                        value={this.state[control.fieldName].value}
                        onFinish={listItem => {
                            const fieldControl = this.state[control.fieldName];
                            fieldControl.value = listItem;
                            this.setState({ [control.fieldName]: fieldControl });
                        }}
                        refresh={this.state.refresh}
                    />
                );
            case ControlName.VnrTreeView:
                return (
                    <VnrTreeView
                        {...control}
                        value={this.state[control.fieldName].value}
                        onSelect={listItem => {
                            const fieldControl = this.state[control.fieldName];
                            fieldControl.value = listItem;
                            this.setState({ [control.fieldName]: fieldControl });
                        }}
                        refresh={this.state.refresh}
                    />
                );
            case ControlName.VnrSwitch:
                return (
                    <Switch
                        {...control}
                        trackColor={{ false: Colors.gray_5, true: Colors.primary }}
                        thumbColor={Colors.white}
                        ios_backgroundColor={Colors.gray_5}
                        value={this.state[control.fieldName].value ? this.state[control.fieldName].value : false}
                        onValueChange={() => {
                            const fieldControl = this.state[control.fieldName];
                            fieldControl.value = fieldControl.value ? !fieldControl.value : true;
                            this.setState({ [control.fieldName]: fieldControl });
                        }}
                    />
                );

            default:
                break;
        }
    };

    render() {
        const { textLeftButton, textRightButton } = this.props;
        return (
            <View style={CustomStyleSheet.flex(1)}>
                <View style={CustomStyleSheet.flex(9)}>
                    {/* <ScrollView> */}
                    <KeyboardAwareScrollView
                        contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                        enableOnAndroid={false}
                        keyboardShouldPersistTaps={'handled'}
                    >
                        <View style={{ flexDirection: EnumName.E_column }}>
                            {this.props.filterConfig.map(e => {
                                if (
                                    Array.isArray(e.ControlGroup) &&
                                    e.ControlGroup.length > 0 &&
                                    e.ControlGroup[0].Name == ControlName.VnrSwitch
                                ) {
                                    return (
                                        <View
                                            key={e.Label}
                                            style={[
                                                stylesVnrFilter.contentViewControl,
                                                // eslint-disable-next-line react-native/no-inline-styles
                                                {
                                                    flexDirection: 'row',
                                                    alignItems: 'center'
                                                }
                                            ]}
                                        >
                                            {e.Label && (
                                                <View
                                                    style={CustomStyleSheet.flex(1)}
                                                >
                                                    <VnrText
                                                        style={[styleSheets.text, stylesVnrFilter.styLableText]}
                                                        i18nKey={e.Label}
                                                        value={e.Label}
                                                    />
                                                </View>
                                            )}
                                            <View style={{}}>
                                                {e.ControlGroup.map((control, index) => {
                                                    return this.renderControl(control, index);
                                                })}
                                            </View>
                                        </View>
                                    );
                                } else {
                                    return (
                                        <View key={e.Label} style={[stylesVnrFilter.contentViewControl, {}]}>
                                            {e.Label && (
                                                <View style={stylesVnrFilter.viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, stylesVnrFilter.styLableText]}
                                                        i18nKey={e.Label}
                                                        value={e.Label}
                                                    />
                                                </View>
                                            )}

                                            <View style={[stylesVnrFilter.viewControl]}>
                                                {e.ControlGroup.map((control, index) => {
                                                    return this.renderControl(control, index);
                                                })}
                                            </View>
                                        </View>
                                    );
                                }
                            })}
                        </View>
                    </KeyboardAwareScrollView>
                </View>

                <View
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{
                        flexGrow: 1,
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                        padding: 10
                    }}
                >
                    <View
                        style={{
                            flexDirection: EnumName.E_row,
                            backgroundColor: Colors.white
                        }}
                    >
                        <TouchableOpacity onPress={this.clearFilter} style={stylesVnrFilter.btn_ClearFilter}>
                            <VnrText
                                style={[
                                    styleSheets.lable,
                                    {
                                        color: Colors.gray_8
                                    }
                                ]}
                                i18nKey={textLeftButton != null ? textLeftButton : 'HRM_RemoveFilter'}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.ShowData();
                            }}
                            style={stylesVnrFilter.bnt_Ok}
                        >
                            <VnrText
                                style={[styleSheets.lable, { color: Colors.white }]}
                                i18nKey={textRightButton != null ? textRightButton : 'HRM_Common_Apply'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}
