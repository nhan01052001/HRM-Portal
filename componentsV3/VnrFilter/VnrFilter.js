/* eslint-disable no-case-declarations */
import React from 'react';
import { View, TouchableOpacity, Modal, SafeAreaView, StyleSheet, Image } from 'react-native';
import { Colors, CustomStyleSheet, Size, styleSheets, stylesVnrFilter } from '../../constants/styleConfig';
import moment from 'moment';
import VnrTextInput from '../VnrTextInput/VnrTextInput';
import VnrPicker from '../VnrPicker/VnrPicker';
import VnrPickerMulti from '../VnrPickerMulti/VnrPickerMulti';
import VnrDate from '../VnrDate/VnrDate';
import VnrMonthYear from '../VnrMonthYear/VnrMonthYear';
import VnrYearPicker from '../VnrYearPicker/VnrYearPicker';
import VnrTreeView from '../VnrTreeView/VnrTreeView';
import VnrText from '../../components/VnrText/VnrText';
import Vnr_Function from '../../utils/Vnr_Function';
import HttpService from '../../utils/HttpService';
import { VnrLoadingSevices } from '../../components/VnrLoading/VnrLoadingPages';
import { Format, EnumName, ControlName } from '../../assets/constant';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import VnrDateFromTo from '../VnrDateFromTo/VnrDateFromTo';
import VnrSuperFilterWithTextInput from '../VnrSuperFilterWithTextInput/VnrSuperFilterWithTextInput';
import VnrSwitch from '../VnrSwitch/VnrSwitch';
import { translate } from '../../i18n/translate';

export default class VnrFilter extends React.Component {
    constructor(props) {
        super(props);

        const _state = this.createStateFilter();
        this.state = _state;
        this.state.refresh = false;
        this.state.isDisableBtnApply = true;
        this.dataConfirm = {};
    }

    setDataConfirm = (data) => {
        const _data = {};
        Object.keys(data).forEach((key) => {
            if (data[key] && data[key].value && data[key].value != null && data[key].value != '')
                _data[key] = { ...data[key] };
        });
        this.dataConfirm = _data;
    };

    getDataConfirm = () => {
        return this.dataConfirm;
    };

    createStateFilter = (isClearValue) => {
        const arrState = {},
            { E_value } = EnumName;
        this.props.filterConfig.forEach((item) => {
            item.ControlGroup.forEach((control) => {
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

        this.setDataConfirm(arrState);
        return arrState;
    };

    handelData = async (control) => {
        const { ShowHideControl } = control;
        if (ShowHideControl && ShowHideControl.fieldName && ShowHideControl.valueField && ShowHideControl.value) {
            const { fieldName, valueField, value } = ShowHideControl;

            const getControl = this.state[fieldName];
            let valueControl = null;
            if (getControl && getControl.value && Array.isArray(getControl.value) && getControl.value.length > 0) {
                valueControl = getControl.value[0][valueField];
            } else if (getControl && getControl.value) {
                valueControl = getControl.value[valueField];
            }

            if (valueControl != value) {
                return null;
            }
        }

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
                        dataFomart = moment(control.value).startOf('day').format('YYYY-MM-DD HH:mm:ss');
                    } else if (control.timeEnd) {
                        dataFomart = moment(control.value).endOf('day').format('YYYY-MM-DD HH:mm:ss');
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
                    let dateStartFormat = null,
                        dateEndFormat = null;
                    let text = moment(control.value).format(control.format);

                    if (Array.isArray(control?.fieldForFilter) && control?.fieldForFilter.length > 0) {
                        dateStartFormat = Vnr_Function.formatDateAPI(moment(control.value).startOf('month'));
                        dateEndFormat = Vnr_Function.formatDateAPI(moment(control.value).endOf('month'));
                        return {
                            Text: text,
                            Value: {
                                [`${control.fieldForFilter ? control.fieldForFilter[1] : 'DateEnd'}`]: dateEndFormat,
                                [`${control.fieldForFilter ? control.fieldForFilter[0] : 'DateStart'}`]: dateStartFormat
                            }
                        };
                    }

                    return {
                        Text: text,
                        Value: dataFomart
                    };
                } else if (control.value) {
                    let dateStartFormat = null,
                        dateEndFormat = null;
                    let text = moment(control.value).format(control.format);

                    if (Array.isArray(control?.fieldForFilter) && control?.fieldForFilter.length > 0) {
                        dateStartFormat = Vnr_Function.formatDateAPI(moment(control.value).startOf('month'));
                        dateEndFormat = Vnr_Function.formatDateAPI(moment(control.value).endOf('month'));
                        return {
                            Text: text,
                            Value: {
                                [`${control.fieldForFilter ? control.fieldForFilter[1] : 'DateEnd'}`]: dateEndFormat,
                                [`${control.fieldForFilter ? control.fieldForFilter[0] : 'DateStart'}`]: dateStartFormat
                            }
                        };
                    }

                    return {
                        Text: text,
                        Value: this.vnrDateResult(control.value, control)
                    };
                } else {
                    return null;
                }
            }
            case ControlName.VnrYearPicker: {
                if (
                    !Vnr_Function.CheckIsNullOrEmpty(control.response) &&
                    control.response == EnumName.E_string &&
                    control.Name == ControlName.VnrYearPicker &&
                    control.value
                ) {
                    // const dataFomart = await this.formatDataFromSever(control.value);
                    return {
                        Text: control.value,
                        Value: control.value
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
            case ControlName.VnrDateFromTo: {
                if (
                    !Vnr_Function.CheckIsNullOrEmpty(control.response) &&
                    control.response == EnumName.E_string &&
                    control.Name == ControlName.VnrDateFromTo &&
                    control.value &&
                    control.value.startDate
                ) {
                    // const dateStartFormat = await this.formatDataFromSever(control.value.startDate);
                    // const dateEndFormat = await this.formatDataFromSever(control.value.endDate);

                    const dateStartFormat = Vnr_Function.formatDateAPI(moment(control.value.startDate).startOf('day'));
                    const dateEndFormat = Vnr_Function.formatDateAPI(moment(control.value.endDate).endOf('day'));
                    return {
                        Text:
                            `${moment(control.value.startDate).format(control.format)}` +
                            ' --> ' +
                            ` ${moment(control.value.endDate).format(control.format)}`,
                        Value: {
                            [`${control.fieldForFilter ? control.fieldForFilter[1] : 'DateEnd'}`]: dateEndFormat,
                            [`${control.fieldForFilter ? control.fieldForFilter[0] : 'DateStart'}`]: dateStartFormat
                        }
                    };
                } else if (control.value && Array.isArray(control.value) && control.value.length > 0) {
                    const value = control.value[0];
                    const dateStartFormat = moment(value).format('YYYY/MM/D'); //Vnr_Function.formatDateAPI(value, true);
                    return {
                        Text: `${moment(value).format(control.format)}`,
                        Value: {
                            [`${control.fieldForFilter ? control.fieldForFilter[0] : 'DateStart'}`]: dateStartFormat
                        }
                    };
                } else if (control.value) {
                    const dateStartFormat = await this.formatDataFromSever(control.value.startDate);
                    const dateEndFormat = await this.formatDataFromSever(control.value.endDate);
                    return {
                        Text:
                            `${moment(control.value.startDate).format(control.format)}` +
                            ' --> ' +
                            ` ${moment(control.value.endDate).format(control.format)}`,
                        Value: {
                            [`${control.fieldForFilter ? control.fieldForFilter[1] : 'DateEnd'}`]: dateEndFormat,
                            [`${control.fieldForFilter ? control.fieldForFilter[0] : 'DateStart'}`]: dateStartFormat
                        }
                    };
                } else {
                    const value = {};
                    if (control.fieldForFilter[0])
                        value[`${control.fieldForFilter ? control.fieldForFilter[0] : 'DateStart'}`] = null;

                    if (control.fieldForFilter[1])
                        value[`${control.fieldForFilter ? control.fieldForFilter[1] : 'DateEnd'}`] = null;

                    return {
                        Text: '',
                        Value: value
                    };
                }
            }
            case ControlName.VnrPicker: {
                if (Array.isArray(control?.fieldForFilter) && control?.fieldForFilter.length > 0 && control.value) {
                    const text = control.value[control.textField];
                    const dateStartFormat = Vnr_Function.formatDateAPI(
                        moment(control.value[control.fieldForFilter[0]])
                    );
                    const dateEndFormat = Vnr_Function.formatDateAPI(
                        moment(control.value[control.fieldForFilter[1] ? control.fieldForFilter[1] : 'DateEnd'])
                    );
                    return {
                        Text: text,
                        Value: {
                            [`${control.fieldForFilter ? control.fieldForFilter[1] : 'DateEnd'}`]: dateEndFormat,
                            [control.fieldForFilter[0]]: dateStartFormat
                        }
                    };
                }
                return this.pickerResult(control.value, control);
            }
            case ControlName.VnrPickerMulti:
                return this.pickerMultiResult(control.value, control);
            case ControlName.VnrTreeView:
                return this.treeViewResult(control.value, control);
            case ControlName.VnrSuperFilterWithTextInput:
                return this.pickerMultiResult(control.value, control);

            default:
                return null;
        }
    };

    applyFilter = async (isNotClose) => {
        // Check Internet
        if (!HttpService.checkConnectInternet()) {
            HttpService.showAlertNoNetwork(this.applyFilter);
            return;
        }
        VnrLoadingSevices.show();
        let dataConfirm = {},
            dataDisplay = {},
            pureData = this.state;
        // eslint-disable-next-line no-unused-vars
        for (let key in pureData) {
            let control = pureData[key],
                _handelData = await this.handelData(control);
            if (Array.isArray(control?.fieldForFilter) && control?.fieldForFilter.length > 0) {
                dataConfirm = {
                    ...dataConfirm,
                    ..._handelData?.Value
                };
            } else {
                dataConfirm[control.fieldName] = _handelData ? _handelData.Value : null;
            }

            dataDisplay[control.fieldName] = _handelData ? _handelData.Text : null;
        }

        if (dataConfirm != {}) {
            this.setDataConfirm(pureData);
            VnrLoadingSevices.hide();
            this.props.onFinish(dataDisplay, dataConfirm, pureData);
            !isNotClose && this.props.onCloseModalFilter();
        }
    };

    textResult = (item) => {
        if (!Vnr_Function.CheckIsNullOrEmpty(item)) {
            return item;
        } else {
            return '';
        }
    };

    switchResult = (item) => {
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

    // dateFromToResult = (item, control) => {};

    pickerMultiResult = (listItem, control) => {
        let listFormat = null;
        if (Vnr_Function.CheckIsNullOrEmpty(listItem) == true || listItem.length == 0) {
            return null;
        }

        if (!Vnr_Function.CheckIsNullOrEmpty(control.response) && control.response == EnumName.E_string) {
            listFormat = {
                Text: listItem
                    .map((item) => {
                        return item[control.textField];
                    })
                    .join(', '),
                Value: listItem
                    .map((item) => {
                        return item[control.valueField];
                    })
                    .join(',')
            };
        } else {
            listFormat = {
                Text: listItem
                    .map((item) => {
                        return item[control.textField];
                    })
                    .join(', '),
                Value: listItem.map((item) => {
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
                    .map((item) => {
                        return item[control.textField];
                    })
                    .join(', '),
                Value: listItem
                    .map((item) => {
                        return item[control.valueField];
                    })
                    .join(',')
            };
        } else {
            listFormat = {
                Text: listItem
                    .map((item) => {
                        return item[control.textField];
                    })
                    .join(', '),
                Value: listItem.map((item) => {
                    return item[control.valueField];
                })
            };
        }
        return listFormat;
    };

    formatDataFromSever = async (value) => {
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
        this.setState(_state, () => {
            this.applyFilter();
        });
    };

    clearFilter = () => {
        this.refreshControl();
    };

    renderControl = (control, index, Label) => {
        // nhannguyen: no dispalay control when IsShowFilterCommon === true
        if (!control?.IsShowFilterCommon) {
            const { ShowHideControl } = control;
            if (ShowHideControl && ShowHideControl.fieldName && ShowHideControl.valueField && ShowHideControl.value) {
                const { fieldName, valueField, value } = ShowHideControl;

                const getControl = this.state[fieldName];
                let valueControl = null;
                if (getControl && getControl.value && Array.isArray(getControl.value) && getControl.value.length > 0) {
                    valueControl = getControl.value[0][valueField];
                } else if (getControl && getControl.value) {
                    valueControl = getControl.value[valueField];
                }

                if (valueControl != value) {
                    return <View />;
                }
            }
            switch (control.Name) {
                case ControlName.VnrText:
                    return (
                        <VnrTextInput
                            {...control}
                            lable={Label}
                            value={this.state[control.fieldName].value}
                            onChangeText={(text) => {
                                const fieldControl = this.state[control.fieldName];
                                fieldControl.value = text;
                                this.setState({ [control.fieldName]: fieldControl }, this.handleApplyFilter);
                            }}
                            key={control.fieldName}
                            styleContent={CustomStyleSheet.borderBottomWidth(0)}
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
                            placeHolder={'HRM_PortalApp_Limit'}
                            lable={Label}
                            layoutFilter={true}
                            value={this.state[control.fieldName].value}
                            stylePicker={index == 1 ? stylesVnrFilter.controlDate_To : stylesVnrFilter.controlDate_from}
                            onFinish={(value) => {
                                const fieldControl = this.state[control.fieldName];
                                fieldControl.value = value;
                                this.setState({ [control.fieldName]: fieldControl }, this.handleApplyFilter);
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
                            lable={Label}
                            value={this.state[control.fieldName]?.value}
                            stylePicker={index == 1 ? stylesVnrFilter.controlDate_To : stylesVnrFilter.controlDate_from}
                            onFinish={(value) => {
                                const fieldControl = this.state[control.fieldName];
                                fieldControl.value = value;
                                this.setState({ [control.fieldName]: fieldControl }, this.handleApplyFilter);
                            }}
                            refresh={this.state.refresh}
                        />
                    );
                }
                case ControlName.VnrYearPicker: {
                    let controlVnrYearPicker = { ...control };
                    controlVnrYearPicker.response = null;
                    const valueDefault =
                        controlVnrYearPicker?.defaultValue !== null && controlVnrYearPicker?.defaultValue !== undefined
                            ? parseInt(new Date().getFullYear()) + controlVnrYearPicker?.defaultValue
                            : parseInt(new Date().getFullYear());
                    return (
                        <VnrYearPicker
                            key={control.fieldName}
                            {...controlVnrYearPicker}
                            //lable={Label}
                            value={this.state[control.fieldName]?.value || valueDefault}
                            //stylePicker={(index == 1) ? stylesVnrFilter.controlDate_To : stylesVnrFilter.controlDate_from}
                            onFinish={(value) => {
                                const fieldControl = this.state[control.fieldName];
                                fieldControl.value = value?.year;
                                this.setState({ [control.fieldName]: fieldControl }, this.handleApplyFilter);
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
                            placeHolder={'HRM_PortalApp_Limit'}
                            lable={Label}
                            layoutFilter={true}
                            value={this.state[control.fieldName].value}
                            onFinish={(value) => {
                                const fieldControl = this.state[control.fieldName];
                                fieldControl.value = value;
                                this.setState({ [control.fieldName]: fieldControl }, this.handleApplyFilter);
                            }}
                            refresh={this.state.refresh}
                        />
                    );
                case ControlName.VnrPicker:
                    return (
                        <VnrPicker
                            key={control.fieldName}
                            {...control}
                            lable={Label}
                            layoutFilter={true}
                            value={this.state[control.fieldName].value}
                            onFinish={(Item) => {
                                const fieldControl = this.state[control.fieldName];
                                fieldControl.value = Item;
                                this.setState({ [control.fieldName]: fieldControl }, this.handleApplyFilter);
                            }}
                            refresh={this.state.refresh}
                        />
                    );
                case ControlName.VnrPickerMulti:
                    return (
                        <VnrPickerMulti
                            key={control.fieldName}
                            {...control}
                            lable={Label}
                            autoBind={true}
                            value={this.state[control.fieldName].value}
                            layoutFilter={true}
                            onFinish={(listItem) => {
                                const fieldControl = this.state[control.fieldName];
                                fieldControl.value = listItem;
                                this.setState({ [control.fieldName]: fieldControl }, this.handleApplyFilter);
                            }}
                            refresh={this.state.refresh}
                        />
                    );
                case ControlName.VnrTreeView:
                    return (
                        <VnrTreeView
                            {...control}
                            lable={Label}
                            layoutFilter={true}
                            value={this.state[control.fieldName].value}
                            onSelect={(listItem) => {
                                const fieldControl = this.state[control.fieldName];
                                fieldControl.value = listItem;
                                this.setState({ [control.fieldName]: fieldControl }, this.handleApplyFilter);
                            }}
                            refresh={this.state.refresh}
                        />
                    );
                case ControlName.VnrDateFromTo:
                    let controlVnrDateFromTo = { ...control };
                    controlVnrDateFromTo.response = null;
                    return (
                        <VnrDateFromTo
                            // ref={(ref) => (this.refVnrDateFromTo = ref)}
                            {...controlVnrDateFromTo}
                            placeHolder={'HRM_PortalApp_Limit'}
                            layoutFilter={true}
                            isControll={true}
                            lable={Label}
                            key={control.fieldName}
                            refresh={this.state.refresh}
                            value={this.state[control.fieldName].value ? this.state[control.fieldName].value : {}}
                            displayOptions={control.displayOptions}
                            onlyChooseEveryDay={control.onlyChooseEveryDay}
                            stylePlaceholder={{ color: Colors.greySecondaryConstraint }}
                            onFinish={(value) => {
                                const fieldControl = this.state[control.fieldName];
                                fieldControl.value = value;
                                this.setState({ [control.fieldName]: fieldControl }, this.handleApplyFilter);
                            }}
                        />
                    );
                case ControlName.VnrSwitch:
                    return (
                        <VnrSwitch
                            {...control}
                            layoutFilter={true}
                            lable={Label}
                            trackColor={{ false: Colors.gray_5, true: Colors.primary }}
                            thumbColor={Colors.white}
                            ios_backgroundColor={Colors.gray_5}
                            value={this.state[control.fieldName]?.value ? this.state[control.fieldName].value : false}
                            onFinish={() => {
                                const fieldControl = this.state[control.fieldName];
                                fieldControl.value = fieldControl.value ? !fieldControl.value : true;
                                this.setState({ [control.fieldName]: fieldControl }, this.handleApplyFilter);
                            }}
                        />
                    );
                case ControlName.VnrSuperFilterWithTextInput:
                    return (
                        <VnrSuperFilterWithTextInput
                            key={control.fieldName}
                            {...control}
                            lable={Label}
                            layoutFilter={true}
                            value={this.state[control.fieldName].value}
                            onFinish={(listItem) => {
                                const fieldControl = this.state[control.fieldName];
                                fieldControl.value = listItem;
                                this.setState({ [control.fieldName]: fieldControl }, this.handleApplyFilter);
                            }}
                            refresh={this.state.refresh}
                        />
                    );

                default:
                    break;
            }
        }
    };

    closeModal = () => {
        // this.checkValueOfPropAndState();
        // this.setState({ isShowModal: false });
        this.props.onCloseModalFilter();
    };

    handleApplyFilter() {
        const state = this.state;
        const getDataConfirm = this.getDataConfirm();
        const listValue = {};

        Object.keys(state).forEach((key) => {
            if (state[key] && state[key].value && state[key].value != null && state[key].value != '')
                listValue[key] = state[key];
        });

        if (!Vnr_Function.compare(listValue, getDataConfirm)) {
            this.setState({
                isDisableBtnApply: false
            });
        } else {
            this.setState({
                isDisableBtnApply: true
            });
        }

        // if (listValue.length == 0) {
        //     this.applyFilter(true);
        // }
    }

    render() {
        const { textLeftButton, textRightButton, isShowModalFilter } = this.props;
        const state = this.state,
            { isDisableBtnApply } = this.state;

        const listValue = Object.keys(state).filter((key) => {
                return state[key] && state[key].value && state[key].value != null && state[key].value != '';
            }),
            isDisableBtnRemove = listValue.length > 0 ? false : true,
            numberValue = listValue.length > 0 ? `(${listValue.length})` : '';

        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={isShowModalFilter} //isShowModalFilter
                onRequestClose={this.closeModal}
            >
                <TouchableOpacity onPress={() => this.closeModal()} style={styles.styContentModal} />
                <SafeAreaView style={styles.wrapInsideModal} forceInset={{ top: 'always', bottom: 'always' }}>
                    <View style={[styles.wrapHeaderCalender]}>
                        <View style={styles.styTitleFilter}>
                            <VnrText style={[styleSheets.lable, styles.styLableText]} i18nKey={'HRM_Filter_Data'} />
                        </View>
                        <View style={styles.flex_def}>
                            <TouchableOpacity
                                style={[styles.flexD_align_center, CustomStyleSheet.padding(10)]}
                                onPress={() => this.closeModal()}
                            >
                                <Image source={require('../../assets/images/filterV3/fi_x.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={CustomStyleSheet.flex(1)}>
                        <View style={CustomStyleSheet.flex(9)}>
                            {/* <ScrollView> */}
                            <KeyboardAwareScrollView
                                contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                                enableOnAndroid={false}
                                keyboardShouldPersistTaps={'handled'}
                            >
                                <View style={{ flexDirection: EnumName.E_column }}>
                                    {this.props.filterConfig.map((e) => {
                                        return (
                                            <View
                                                key={e.Label}
                                                style={[stylesVnrFilter.contentViewControl, styles.styViewGp]}
                                            >
                                                <View style={[stylesVnrFilter.viewControl]}>
                                                    {e.ControlGroup.map((control, index) => {
                                                        return this.renderControl(control, index, e.Label);
                                                    })}
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>
                            </KeyboardAwareScrollView>
                        </View>

                        <View style={styles.styViewBtn}>
                            <View
                                style={{
                                    flexDirection: EnumName.E_row,
                                    backgroundColor: Colors.white
                                }}
                            >
                                <TouchableOpacity
                                    accessibilityLabel={'VnrFilter-ClearFilter'}
                                    onPress={() => (isDisableBtnRemove == false ? this.clearFilter() : null)}
                                    style={[
                                        stylesVnrFilter.btn_ClearFilter,
                                        isDisableBtnRemove
                                            ? { backgroundColor: Colors.gray_3 }
                                            : { backgroundColor: Colors.white }
                                    ]}
                                    activeOpacity={isDisableBtnRemove ? 1 : 0.7}
                                >
                                    <VnrText
                                        style={[
                                            styleSheets.lable,
                                            isDisableBtnRemove
                                                ? {
                                                    color: Colors.gray_8
                                                }
                                                : {
                                                    color: Colors.gray_9
                                                }
                                        ]}
                                        i18nKey={textLeftButton != null ? textLeftButton : 'HRM_RemoveFilter'}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    accessibilityLabel={'VnrFilter-ApplyFilterAdvance'}
                                    onPress={() => (isDisableBtnApply == false ? this.applyFilter() : null)}
                                    style={[
                                        stylesVnrFilter.bnt_Ok,
                                        isDisableBtnApply
                                            ? { backgroundColor: Colors.gray_3 }
                                            : { backgroundColor: Colors.primary }
                                    ]}
                                    activeOpacity={isDisableBtnApply ? 1 : 0.7}
                                >
                                    <VnrText
                                        style={[
                                            styleSheets.lable,
                                            isDisableBtnApply ? { color: Colors.gray_8 } : { color: Colors.white }
                                        ]}
                                        value={
                                            textRightButton != null
                                                ? `${translate(textRightButton)} ${numberValue}`
                                                : `${translate('HRM_Common_Apply')} ${numberValue}`
                                        }
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    wrapInsideModal: {
        flex: 1,
        backgroundColor: Colors.white
    },
    styTitleFilter: { flex: 8.5, justifyContent: 'center', alignItems: 'flex-start' },
    styContentModal: { backgroundColor: Colors.black, opacity: 0.2, height: Size.deviceheight * 0.1, width: '100%' },
    styViewGp: {
        paddingHorizontal: 0,
        paddingVertical: 0
    },
    styLableText: {
        fontSize: Size.text + 1,
        color: Colors.gray_10
    },
    styViewBtn: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        padding: 10
    },
    wrapHeaderCalender: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        paddingLeft: 12
    },

    flex_def: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginRight: 6
    },

    flexD_align_center: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});
