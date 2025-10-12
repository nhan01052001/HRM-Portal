import React, { Component } from 'react';
import { View, TouchableOpacity, Text, ScrollView, Animated } from 'react-native';
import { translate } from '../../i18n/translate';
import { IconCancel, IconSliders } from '../../constants/Icons';
import {
    Size,
    Colors,
    styleContentFilter,
    styleSheets,
    stylesVnrFilter,
    stylesListPickerControl,
    styleContentFilterDesign,
    CustomStyleSheet
} from '../../constants/styleConfig';
import VnrTextInput from '../../components/VnrTextInput/VnrTextInput';
import { ScreenName, EnumName, ControlName, Format } from '../../assets/constant';
import { ConfigListFilter } from '../../assets/configProject/ConfigListFilter';
import VnrPicker from '../VnrPicker/VnrPicker';
import VnrPickerMulti from '../VnrPickerMulti/VnrPickerMulti';
import VnrDate from '../VnrDate/VnrDate';
import VnrMonthYear from '../VnrMonthYear/VnrMonthYear';
import VnrTreeView from '../VnrTreeView/VnrTreeView';
import VnrDateFromTo from '../VnrDateFromTo/VnrDateFromTo';
import moment from 'moment';
import VnrFilter from './VnrFilter';
import VnrSuperFilterWithTextInput from '../VnrSuperFilterWithTextInput/VnrSuperFilterWithTextInput';
import Vnr_Function from '../../utils/Vnr_Function';
import HttpService from '../../utils/HttpService';

const DEFAULT_FILTER = {
};

let configListFilter = null,
    enumName = null,
    controlName = null,
    // eslint-disable-next-line no-unused-vars
    filterList = null;

export default class VnrFilterCommon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spreadTextFilterCommon: '',
            filterCommon: null,
            filterAdvance: null,
            refreshTextCommon: false,
            refreshFilter: false,
            refresh: false,
            isShowModalFilter: false,
            dataFilter: null,
            activeFilterAdvance: false,
            numberCountFilter: 0
        };

        this.textFilterCommon = '';
        this.objParamAdvance = null;
        this.spreadTextFilterParams = '';
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            nextState.spreadTextFilterCommon !== this.state.spreadTextFilterCommon ||
            nextState.filterCommon !== this.state.filterCommon ||
            nextState.refreshFilter !== this.state.refreshFilter ||
            nextState.refreshTextCommon !== this.state.refreshTextCommon ||
            nextProps.isRefreshFilter !== this.props.isRefreshFilter ||
            nextState.isShowModalFilter !== this.state.isShowModalFilter ||
            nextProps.dataBody !== this.props.dataBody
        );
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.dataBody !== null && this.props.dataBody == null) {
            this.initStateFilter(nextProps);
        }
    }

    initStateFilter = (nexProps) => {
        enumName = EnumName;
        filterList = ScreenName.FilterListV3;
        controlName = ControlName;
        configListFilter = {
            ...ConfigListFilter.value,
            ...DEFAULT_FILTER
        };
        const { screenName, dataBody } = nexProps ? nexProps : this.props;
        if (dataBody == null) {
            return;
        }

        let _configListFilter = configListFilter[screenName],
            FilterCommon = _configListFilter ? _configListFilter.FilterCommon : null,
            FilterAdvance = null,
            numberCountFilter = 0;

        if (_configListFilter && _configListFilter.FilterAdvance) {
            FilterAdvance = _configListFilter.FilterAdvance.map((item) => {
                return {
                    ...item,
                    ControlGroup: [
                        ...item.ControlGroup.map((control) => {
                            return { ...control };
                        })
                    ]
                };
            });
        }

        let _placeHolder = '',
            _spreadTextFilterCommon = '',
            isFilterFromNotify = false;

        // kiểm tra tìm kiếm theo notificaiton
        if (
            dataBody &&
            (Object.prototype.hasOwnProperty.call(dataBody, 'NotificationID') ||
                Object.prototype.hasOwnProperty.call(dataBody, 'NotificationIDs') ||
                Object.prototype.hasOwnProperty.call(dataBody, 'tokenEncodedParam')) &&
            FilterAdvance
        ) {
            // const { filterAdvance } = this.state;
            let dataNoti = {
                NotificationID: dataBody.NotificationID,
                NotificationIDs: dataBody.NotificationIDs,
                tokenEncodedParam: dataBody.tokenEncodedParam
            };

            // if (nexProps) {
            //     const control = FilterAdvance.find(
            //         item => item.ControlGroup && item.ControlGroup[0]?.fieldName == 'isFilterFromNotify'
            //     );
            //     dataNoti = control && control.ControlGroup ? control.ControlGroup[0]?.data : dataNoti;
            // }

            isFilterFromNotify =
                dataBody.NotificationID != null ||
                    dataBody.NotificationIDs != null ||
                    dataBody.tokenEncodedParam != null
                    ? true
                    : false;
            FilterAdvance = FilterAdvance.concat([
                {
                    Label: 'HRM_PortalApp_Filter_From_notification',
                    ControlGroup: [
                        {
                            Name: 'VnrSwitch',
                            fieldName: 'isFilterFromNotify',
                            data: dataNoti,
                            value: isFilterFromNotify
                        }
                    ]
                }
            ]);
        }

        // Xử lý filter mặc định
        if (dataBody && FilterAdvance) {
            FilterAdvance = FilterAdvance.map((item) => {
                if (item && item.ControlGroup && item.ControlGroup.length == 1) {
                    const control = item.ControlGroup[0],
                        valueControl = dataBody[control.fieldName];
                    if (valueControl != null) {
                        if (
                            control.Name == ControlName.VnrDate ||
                            control.Name == ControlName.VnrDateFromTo ||
                            control.Name == ControlName.VnrText ||
                            control.Name == ControlName.VnrSwitch ||
                            control.Name == ControlName.VnrCheckBox
                        ) {
                            control.value = valueControl;
                            numberCountFilter += 1;
                        } else if (control.Name == ControlName.VnrTime) {
                            if (typeof valueControl == 'string' && valueControl.includes(':')) {
                                let date = new Date();
                                let [hours, minutes] = valueControl.split(':').map(Number);
                                date.setHours(hours, minutes, 0, 0);
                                control.value = date;
                                numberCountFilter += 1;
                            } else {
                                control.value = moment(valueControl);
                                numberCountFilter += 1;
                            }
                        }
                        // else if (control.Name == ControlName.VnrPickerMulti && dataBody[control.fieldName] ) {

                        // }
                        // else {
                        // }
                    }

                    return item;
                } else {
                    return item;
                }
            });
        }

        if (FilterCommon && FilterCommon.placeholder) {
            const arrPlaceHolder = FilterCommon.placeholder;

            if (isFilterFromNotify) {
                _spreadTextFilterCommon += translate('HRM_PortalApp_Filter_From_notification');
                numberCountFilter += 1;
            }

            if (arrPlaceHolder && Array.isArray(arrPlaceHolder)) {
                let transPlaceHolder = arrPlaceHolder.map((key) => translate(key)).join(', ');

                _placeHolder = translate('HRM_Common_Search') + ' ' + transPlaceHolder;

                FilterCommon.placeholder = _placeHolder;
            }
        }

        // nhan.nguyen: upgrade fileter
        if (
            _configListFilter?.FilterCommon?.IsShowFilterCommon &&
            _configListFilter?.FilterCommon?.fieldName &&
            typeof _configListFilter?.FilterCommon?.fieldName === 'string'
        ) {
            if (
                nexProps?.dataBody[_configListFilter?.FilterCommon?.fieldName] &&
                (nexProps?.dataBody[_configListFilter?.FilterCommon?.fieldName] !== '' ||
                    (typeof nexProps?.dataBody[_configListFilter?.FilterCommon?.fieldName] === 'string' &&
                        nexProps?.dataBody[_configListFilter?.FilterCommon?.fieldName].length > 0))
            ) {
                _spreadTextFilterCommon = nexProps?.dataBody[_configListFilter?.FilterCommon?.fieldName];
            }
        }

        this.setState({
            numberCountFilter: numberCountFilter,
            filterCommon: FilterCommon,
            filterAdvance: FilterAdvance,
            spreadTextFilterCommon: _spreadTextFilterCommon,
            refreshFilter: !this.state.refreshFilter,
            refreshTextCommon: !this.state.refreshTextCommon
        });
    };

    componentDidMount() {
        this.initStateFilter();
    }

    nextScreenFilterAdv = () => {
        let { filterCommon, filterAdvance } = this.state;
        if (filterAdvance && filterCommon) {
            if (filterCommon.IsShowFilterCommon == true && filterCommon.fieldName) {
                const indexInputFiler = filterAdvance.findIndex((item) => {
                    if (item.ControlGroup && item.ControlGroup[0]?.fieldName == filterCommon.fieldName) return true;
                    return false;
                });

                let fieldNameTrim = filterCommon.fieldName.replace(/ /g, '');
                if (indexInputFiler > -1) {
                    const control = filterAdvance[indexInputFiler]['ControlGroup'];
                    filterAdvance[indexInputFiler] = {
                        ControlGroup: [
                            {
                                Name: controlName.VnrText,
                                value: control && control[0] ? control[0].value : this.textFilterCommon,
                                ...filterCommon,
                                fieldName: fieldNameTrim
                            }
                        ]
                    };
                } else {
                    filterAdvance = [
                        {
                            ControlGroup: [
                                {
                                    Name: controlName.VnrText,
                                    value: this.textFilterCommon,
                                    ...filterCommon,
                                    fieldName: fieldNameTrim
                                }
                            ]
                        },
                        ...filterAdvance
                    ];
                }
            }
        }

        this.setState({
            filterAdvance: filterAdvance,
            isShowModalFilter: true
        });
    };

    onChangeTextFilter = (text) => {
        this.textFilterCommon = text;
        this.setState({ spreadTextFilterCommon: text, refreshTextCommon: !this.state.refreshTextCommon }, () => {
            Vnr_Function.delay(() => {
                this.onFilterCommon();
            }, 200);
        });
    };

    //focus text filter common
    onFocusFilterCommon = () => {
        let _textCommon = this.textFilterCommon;
        if (_textCommon && _textCommon !== '') {
            let { spreadTextFilterCommon } = this.state,
                splitSpreadTextFilterCommon = spreadTextFilterCommon.split(_textCommon);

            if (splitSpreadTextFilterCommon.length == 2) {
                this.spreadTextFilterParams = splitSpreadTextFilterCommon[1];
            } else {
                this.spreadTextFilterParams = splitSpreadTextFilterCommon[0];
            }

            this.setState({ spreadTextFilterCommon: _textCommon });
        } else {
            let { spreadTextFilterCommon } = this.state;
            this.spreadTextFilterParams = spreadTextFilterCommon;
            this.setState({ spreadTextFilterCommon: '' });
        }
    };

    //nhấn lọc từ bàn phím sau khi nhập giá trị, gọi hàm spreadParamsFilter xử lý cho text common và lọc
    onFilterCommon = (paramsFilterReset = {}) => {
        //#region [callback func reload từ danh sách]
        let getParamCommon = this.spreadParamCommon(),
            paramsFilter = { ...getParamCommon };

        if (this.objParamAdvance) {
            paramsFilter = { ...this.objParamAdvance, ...paramsFilter };
        }

        const { onSubmitEditing } = this.props;
        onSubmitEditing({ ...paramsFilter, ...paramsFilterReset });
        //#endregion
    };

    getNumberCountFilterAdvance = (paramsFilter) => {
        const { filterAdvance } = this.state;
        let numberCount = 0;
        filterAdvance.forEach((item) => {
            if (item && item.ControlGroup && item.ControlGroup.length == 1) {
                const control = item.ControlGroup[0],
                    fieldName =
                        control.Name == ControlName.VnrDateFromTo && control.fieldForFilter
                            ? control.fieldForFilter[0]
                            : control['fieldName'];

                if (
                    fieldName &&
                    paramsFilter[fieldName] &&
                    paramsFilter[fieldName] != null &&
                    paramsFilter[fieldName] !== false
                )
                    numberCount += 1;

                // Trường hợp đặc thù configFilter HreAllAccidentManage DateffectiveType
                if (
                    fieldName == 'DateffectiveType' &&
                    paramsFilter[fieldName] &&
                    paramsFilter[fieldName] != null &&
                    ['E_DATETO', 'E_INFORCE'].indexOf(paramsFilter[fieldName]) > -1
                )
                    numberCount -= 1;
            }
        });

        return numberCount;
    };

    //nhấn lọc từ màn hình nâng cao, gọi hàm spreadParamsFilter xử lý cho text common và lọc
    onFilterAdvance = (dataDisplay, dataFilter, pureData) => {
        const { filterCommon, spreadTextFilterCommon, filterAdvance } = this.state;
        let numberCountFilter = 0;
        //gán obj filter cho biến
        this.objParamAdvance = dataFilter;
        // nhannguyen: handle filter when filter textinput first and then choose filter advanced
        let tempPramsFromTextInput = {};
        if (
            filterCommon?.IsShowFilterCommon &&
            filterCommon?.fieldName &&
            typeof filterCommon?.fieldName === 'string' &&
            filterCommon?.fieldName.length > 0 &&
            spreadTextFilterCommon
        ) {
            filterCommon?.fieldName.split(',').map((item) => {
                tempPramsFromTextInput = {
                    ...tempPramsFromTextInput,
                    [item]: spreadTextFilterCommon
                };
            });
        }

        if (filterCommon && filterCommon.IsShowFilterCommon !== false) {
            //gán lại text cho FilterCommon
            this.textFilterCommon = dataDisplay
                ? Object.values(dataDisplay)[0]
                    ? Object.values(dataDisplay)[0]
                    : ''
                : '';
        }

        //#region [callback func reload từ danh sách]
        let getParamCommon = this.spreadParamCommon(),
            paramsFilter = { ...dataFilter, ...getParamCommon, ...tempPramsFromTextInput };

        const { onSubmitEditing, dataBody } = this.props;
        // kiểm tra tìm kiếm theo notificaiton
        if (
            dataBody &&
            (Object.prototype.hasOwnProperty.call(dataBody, 'NotificationID') ||
                Object.prototype.hasOwnProperty.call(dataBody, 'NotificationIDs') ||
                Object.prototype.hasOwnProperty.call(dataBody, 'tokenEncodedParam'))
        ) {
            const control = filterAdvance.find(
                (item) => item.ControlGroup && item.ControlGroup[0]?.fieldName == 'isFilterFromNotify'
            );
            const dataNoti = control && control.ControlGroup ? control.ControlGroup[0]?.data : dataNoti;

            paramsFilter = {
                ...paramsFilter,
                NotificationIDs: dataFilter.isFilterFromNotify ? dataNoti.NotificationID : null,
                NotificationID: dataFilter.isFilterFromNotify ? dataNoti.NotificationID : null,
                tokenEncodedParam: dataFilter.isFilterFromNotify ? dataNoti.tokenEncodedParam : null
            };
        }

        //dùng trong trường hợp khi có controll chọn từ ngày đến ngày
        // if (paramsFilter.DateRange) {
        //     paramsFilter = { ...paramsFilter, ...paramsFilter.DateRange };
        // }
        // console.log(paramsFilter, 'paramsFilter');
        // remove property DateRange: dùng trong trường hợp khi có controll chọn từ ngày đến ngày
        // chủ yếu là nhìn cho đẹp
        delete paramsFilter.DateRange;

        onSubmitEditing(paramsFilter);
        //#endregion

        //#region [xử lý hiển thị text ở FilterCommon từ filter advance và set lại state FilterAdvance có giá trị vừa chọn]
        let arrDisplayTextCommon = [];

        // Lấy số filter áp dụng
        numberCountFilter = this.getNumberCountFilterAdvance(paramsFilter);

        //lặp các điều kiện lọc
        filterAdvance.forEach((item) => {
            let label = item.Label && item.Label !== '' ? translate(item.Label) : '',
                controls = item.ControlGroup,
                valueForTypeBool = null,
                arrValue = [];

            if (controls && controls[0]?.IsShowFilterCommon) {
                return;
            }

            //lặp các control trong groupControl
            controls.forEach((control) => {
                const { fieldName } = control;
                //xử lý hiển thị text ở FilterCommon
                if (typeof dataDisplay[fieldName] === 'boolean' && dataDisplay[fieldName] === true) {
                    valueForTypeBool = label;
                } else if (dataDisplay[fieldName]) {
                    arrValue = [...arrValue, dataDisplay[fieldName]];
                }

                //gán giá trị vừa chọn cho control ở filter andvance
                if (pureData[fieldName] && pureData[fieldName].value) {
                    control.value = pureData[fieldName].value;
                } else if (Object.prototype.hasOwnProperty.call(control, enumName.E_value)) {
                    delete control[enumName.E_value];
                }
            });

            if (arrValue.length) {
                arrDisplayTextCommon = [...arrDisplayTextCommon, label + ': ' + arrValue.join(' ~ ')];
            } else if (valueForTypeBool !== null) {
                arrDisplayTextCommon = [...arrDisplayTextCommon, label];
            }
        });

        //join ra chuỗi để set lại state cho TextCommon
        this.spreadTextFilterParams = arrDisplayTextCommon.length > 0 ? arrDisplayTextCommon.join(' ') : '';

        //gọi hàm gán state cho FilterCommon và giá trị mới cho FilterAdvance
        this.spreadParamsFilter(filterAdvance, numberCountFilter);
        //#endregion
        //về lại danh sách
        //const { screenName } = this.props;
        //DrawerServices.navigate(screenName);
    };

    spreadParamsFilter = (newFilterAdvanceState, numberCountFilter) => {
        const { filterCommon, spreadTextFilterCommon } = this.state;
        let _textCommon = this.textFilterCommon;

        //set lại text cho filter common
        let nextSpreadTextFilterParams = _textCommon;

        if (this.spreadTextFilterParams && this.spreadTextFilterParams !== '') {
            nextSpreadTextFilterParams += ' ' + this.spreadTextFilterParams;
        }
        this.setState({
            activeFilterAdvance: this.spreadTextFilterParams != '' && !filterCommon?.IsShowFilterCommon ? true : false,
            spreadTextFilterCommon: !filterCommon?.IsShowFilterCommon
                ? nextSpreadTextFilterParams
                : spreadTextFilterCommon,
            filterAdvance: newFilterAdvanceState,
            refreshTextCommon: !this.state.refreshTextCommon,
            dataFilter:
                Array.isArray(newFilterAdvanceState) &&
                    newFilterAdvanceState.length > 0 &&
                    Array.isArray(newFilterAdvanceState[0].ControlGroup) &&
                    newFilterAdvanceState[0].ControlGroup.length > 0 &&
                    newFilterAdvanceState[0].ControlGroup[0].value
                    ? newFilterAdvanceState[0].ControlGroup[0].value
                    : null,
            numberCountFilter: numberCountFilter
        });
    };

    spreadParamCommon = () => {
        const { filterCommon } = this.state;
        let paramsCommon = filterCommon[enumName.E_fieldName].split(','),
            valueCommon = this.textFilterCommon,
            result = {};

        paramsCommon.forEach((param) => {
            param = param.trim();
            result[param] = valueCommon;
        });

        return result;
    };

    onClearText = () => {
        const { filterCommon, filterAdvance } = this.state;
        const { dataBody, onSubmitEditing } = this.props;
        // nhannguyen: just clear text of control textinput
        if (
            filterCommon?.IsShowFilterCommon &&
            filterCommon?.fieldName &&
            typeof filterCommon?.fieldName === 'string' &&
            filterCommon?.fieldName.length > 0
        ) {
            let tempPramsFromTextInput = {};
            filterCommon?.fieldName.split(',').map((item) => {
                tempPramsFromTextInput = {
                    ...tempPramsFromTextInput,
                    [item]: null
                };
            });

            let newFilterAdvanceState = filterAdvance;
            if (
                dataBody &&
                (Object.prototype.hasOwnProperty.call(dataBody, 'NotificationID') ||
                    Object.prototype.hasOwnProperty.call(dataBody, 'NotificationIDs') ||
                    Object.prototype.hasOwnProperty.call(dataBody, 'tokenEncodedParam'))
            ) {
                tempPramsFromTextInput = {
                    ...tempPramsFromTextInput,
                    NotificationID: null,
                    NotificationIDs: null,
                    tokenEncodedParam: null
                };
            }

            if (dataBody && dataBody.defaultParams && dataBody.defaultParams.length > 0) {
                dataBody.defaultParams.forEach((el) => {
                    if (el.fieldName && el.value && el.valueField) {
                        tempPramsFromTextInput = {
                            ...tempPramsFromTextInput,
                            [el.fieldName]: null
                        };
                    }
                });
            }

            //set value cho filter
            newFilterAdvanceState = filterAdvance.map((item) => {
                let { ControlGroup } = item;
                ControlGroup.forEach((control) => {
                    if (Object.prototype.hasOwnProperty.call(control, enumName.E_value)) {
                        delete control[enumName.E_value];
                    }
                });

                return { ...item };
            });

            this.textFilterCommon = '';
            this.setState(
                {
                    filterAdvance: newFilterAdvanceState,
                    spreadTextFilterCommon: '',
                    refreshTextCommon: !this.state.refreshTextCommon,
                    numberCountFilter: 0
                },
                () => {
                    // kiểm tra tìm kiếm theo notificaiton
                    this.onFilterCommon(tempPramsFromTextInput);
                }
            );
        } else {
            this.textFilterCommon = '';
            this.objParamAdvance = null;
            this.spreadTextFilterParams = '';

            //set value cho filter advance
            let { filterAdvance } = this.state,
                newFilterAdvanceState = filterAdvance.map((item) => {
                    let { ControlGroup } = item;
                    ControlGroup.forEach((control) => {
                        if (Object.prototype.hasOwnProperty.call(control, enumName.E_value)) {
                            delete control[enumName.E_value];
                        }
                    });

                    return { ...item };
                });

            this.setState({
                spreadTextFilterCommon: '',
                filterAdvance: newFilterAdvanceState,
                refreshTextCommon: !this.state.refreshTextCommon,
                dataFilter: null,
                numberCountFilter: 0
            });

            // kiểm tra tìm kiếm theo notificaiton
            if (
                dataBody &&
                (Object.prototype.hasOwnProperty.call(dataBody, 'NotificationID') ||
                    Object.prototype.hasOwnProperty.call(dataBody, 'NotificationIDs') ||
                    Object.prototype.hasOwnProperty.call(dataBody, 'tokenEncodedParam'))
            ) {
                onSubmitEditing({
                    NotificationID: null,
                    NotificationIDs: null,
                    tokenEncodedParam: null
                });
            } else {
                // Xử lý filter mặc định
                let _params = {};
                if (dataBody && dataBody.defaultParams && dataBody.defaultParams.length > 0) {
                    dataBody.defaultParams.forEach((el) => {
                        if (el.fieldName && el.value && el.valueField) {
                            _params = {
                                ..._params,
                                [el.fieldName]: null
                            };
                        }
                    });
                }

                onSubmitEditing(_params);
            }
        }
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

    renderControl = (control, index, Label, valueDisplay, dataFilter) => {
        switch (control.Name) {
            case ControlName.VnrDate: {
                let controlVnrDate = { ...control };
                controlVnrDate.response = null;
                return (
                    <VnrDate
                        key={control.fieldName}
                        {...controlVnrDate}
                        value={''}
                        isOptionFilterQuicly={true}
                        placeHolder={translate('HRM_Common_Search') + ' ' + translate(Label)}
                        stylePicker={index == 1 ? stylesVnrFilter.controlDate_To : stylesVnrFilter.controlDate_from}
                        onFinish={(value) => {
                            let dataDisplay = {
                                    [control.fieldName]: `${moment(value).format(control.format)}`
                                },
                                dataFilter = {
                                    [control.fieldName]: `${moment(value).format('MM/DD/YYYY HH:mm a')}`
                                };

                            control.value = value;

                            let pureData = {
                                [control.fieldName]: { ...control }
                            };

                            this.onFilterAdvance(dataDisplay, dataFilter, pureData);
                            control.value = value;
                            // const fieldControl = this.state[control.fieldName];
                            // fieldControl.value = value;
                            // this.setState({ [control.fieldName]: fieldControl });
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
                        value={this.state[control.fieldName].value}
                        stylePicker={index == 1 ? stylesVnrFilter.controlDate_To : stylesVnrFilter.controlDate_from}
                        onFinish={() => { }}
                        refresh={this.state.refresh}
                    />
                );
            }
            case ControlName.VnrPicker:
                return (
                    <VnrPicker
                        key={control.fieldName}
                        {...control}
                        value={{}}
                        isOptionFilterQuicly={true}
                        placeholder={translate('HRM_Common_Search') + ' ' + translate(Label)}
                        stylePicker={this.props?.style?.backgroundColor ? this.props?.style?.backgroundColor : {}}
                        onFinish={(Item) => {
                            if (Item !== undefined && Item !== null) {
                                let dataDisplay = {
                                        [control.fieldName]: `${Item[control.textField]}`
                                    },
                                    dataFilter = {
                                        [control.fieldName]: `${Item[control.valueField]}`
                                    };

                                control.value = Item;
                                let pureData = {
                                    [control.fieldName]: { ...control }
                                };

                                this.onFilterAdvance(dataDisplay, dataFilter, pureData);
                                control.value = Item;
                            }
                            // const fieldControl = this.state[control.fieldName];
                            // fieldControl.value = Item;
                            // this.setState({ [control.fieldName]: fieldControl });
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
                        value={[]}
                        isOptionFilterQuicly={true}
                        placeholder={translate('HRM_Common_Search') + ' ' + translate(Label)}
                        stylePicker={this.props?.style?.backgroundColor ? this.props?.style?.backgroundColor : {}}
                        onFinish={(listItem, isClose) => {
                            if (listItem.length > 0 && !isClose) {
                                let dataDisplay = {},
                                    dataFilter = {},
                                    pureData = {},
                                    lsDataDisplay = [],
                                    lsDataFilter = [];
                                listItem.map((item) => {
                                    lsDataDisplay.push(item[control.textField]);
                                    lsDataFilter.push(item[control.valueField]);
                                });

                                control.value = listItem;

                                pureData = {
                                    [control.fieldName]: { ...control }
                                };

                                dataDisplay = {
                                    [control.fieldName]: `${lsDataDisplay.join(', ')}`
                                };
                                dataFilter = {
                                    [control.fieldName]: `${lsDataFilter.join(',')}`
                                };
                                this.onFilterAdvance(dataDisplay, dataFilter, pureData);
                                control.value = listItem;
                            }
                        }}
                        refresh={this.state.refresh}
                    />
                );
            case ControlName.VnrTreeView:
                return (
                    <VnrTreeView
                        {...control}
                        lable={Label}
                        value={this.state[control.fieldName].value}
                        onSelect={() => {
                            // const fieldControl = this.state[control.fieldName];
                            // fieldControl.value = listItem
                            // this.setState({ [control.fieldName]: fieldControl })
                        }}
                        refresh={this.state.refresh}
                    />
                );
            case ControlName.VnrSuperFilterWithTextInput:
                return (
                    <VnrSuperFilterWithTextInput
                        key={control.fieldName}
                        {...control}
                        // lable={Label}
                        value={dataFilter ? dataFilter : []}
                        valueDisplay={valueDisplay}
                        isOptionFilterQuicly={true}
                        placeholder={translate('HRM_Common_Search') + ' ' + translate(Label)}
                        onFinish={(listItem, isClose) => {
                            if (listItem.length > 0 && !isClose) {
                                let dataDisplay = {},
                                    dataFilter = {},
                                    pureData = {},
                                    lsDataDisplay = [],
                                    lsDataFilter = [];
                                listItem.map((item) => {
                                    lsDataDisplay.push(item[control.textField]);
                                    lsDataFilter.push(item[control.valueField]);
                                });

                                control.value = listItem;

                                pureData = {
                                    [control.fieldName]: { ...control }
                                };

                                dataDisplay = {
                                    [control.fieldName]: `${lsDataDisplay.join(', ')}`
                                };
                                dataFilter = {
                                    [control.fieldName]: `${lsDataFilter.join(',')}`
                                };

                                this.onFilterAdvance(dataDisplay, dataFilter, pureData);
                                control.value = listItem;
                            }
                        }}
                        refresh={this.state.refresh}
                    />
                );
            case ControlName.VnrDateFromTo:
                // eslint-disable-next-line no-case-declarations
                let controlVnrDateFromTo = { ...control };
                controlVnrDateFromTo.response = null;
                return (
                    <VnrDateFromTo
                        key={control.fieldName}
                        refresh={this.state.refresh}
                        value={dataFilter ? dataFilter : {}}
                        displayOptions={control.displayOptions}
                        onlyChooseEveryDay={control.onlyChooseEveryDay}
                        stylePlaceholder={{ color: Colors.greySecondaryConstraint }}
                        isOptionFilterQuicly={true}
                        valueDisplay={valueDisplay}
                        placeHolder={translate('HRM_Common_Search') + ' ' + translate(Label)}
                        stylePicker={this.props?.style?.backgroundColor ? this.props?.style?.backgroundColor : {}}
                        onFinish={(value) => {
                            let dataDisplay = {},
                                dataFilter = {},
                                pureData = {};
                            if (value && typeof value === 'object' && value.startDate && value.endDate) {
                                dataDisplay = {
                                    [control.fieldName]:
                                        `${moment(value.startDate).format(control.format)}` +
                                        ' --> ' +
                                        ` ${moment(value.endDate).format(control.format)}`
                                };
                                dataFilter = {
                                    [`${control.fieldForFilter ? control.fieldForFilter[0] : 'DateStart'}`]:
                                        Vnr_Function.formatDateAPI(moment(value.startDate).startOf('day')),
                                    [`${control.fieldForFilter ? control.fieldForFilter[1] : 'DateEnd'}`]:
                                        Vnr_Function.formatDateAPI(moment(value.endDate).endOf('day'))
                                };
                            }
                            control.value = value;
                            pureData = {
                                [control.fieldName]: { ...control }
                            };

                            this.onFilterAdvance(dataDisplay, dataFilter, pureData);
                            control.value = value;

                            // const fieldControl = this.state[control.fieldName];
                            // fieldControl.value = value;
                            // this.setState({ [control.fieldName]: fieldControl });
                        }}
                    />
                );

            default:
                break;
        }
    };

    renderContent = () => {
        const {
                filterCommon,
                filterAdvance,
                spreadTextFilterCommon,
                refreshTextCommon,
                activeFilterAdvance,
                numberCountFilter
            } = this.state,
            { style } = this.props,
            { styBoxFilter, contentFilter, filter, search, viewFilter } = style ? style : styleContentFilter;
        // let numberInFilterCommon =
        //     (filterCommon?.fieldName && typeof filterCommon?.fieldName === 'string') ||
        //     filterCommon?.fieldName.length === 0
        //         ? filterCommon?.fieldName.split(',').length
        //         : 0;

        if (filterCommon && filterCommon.IsShowFilterCommon == true) {
            const isFilterCommonInput =
                filterCommon.fieldName && filterCommon.IsShowFilterCommon && !activeFilterAdvance;
            const viewInput = (
                <VnrTextInput
                    editable={isFilterCommonInput ? true : false}
                    refresh={refreshTextCommon}
                    style={[styleSheets.text, CustomStyleSheet.flex(1)]}
                    value={spreadTextFilterCommon}
                    onClearText={() => {
                        this.onClearText();
                    }}
                    //onFocus={() => this.onFocusFilterCommon()}
                    //onBlur={() => this.spreadParamsFilter(filterAdvance)}
                    returnKeyType={enumName.E_search}
                    onChangeText={(text) => this.onChangeTextFilter(text)}
                    //onSubmitEditing={() => this.onFilterCommon()}
                    placeholder={translate(filterCommon.placeholder)}
                />
            );

            return (
                <View style={styBoxFilter}>
                    <View style={contentFilter}>
                        <View style={filter}>
                            {filterCommon.fieldName && !activeFilterAdvance ? (
                                <View style={[styleContentFilterDesign.fl1Jus_Center, search]}>
                                    <View
                                        style={[
                                            stylesListPickerControl.formDate_To_From,
                                            CustomStyleSheet.width('100%')
                                        ]}
                                    >
                                        {viewInput}
                                    </View>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={[styleContentFilterDesign.fl1Jus_Center, search]}
                                    onPress={() => this.nextScreenFilterAdv()}
                                >
                                    <View
                                        style={[
                                            stylesListPickerControl.formDate_To_From,
                                            CustomStyleSheet.width('100%')
                                        ]}
                                    >
                                        {viewInput}
                                    </View>
                                </TouchableOpacity>
                            )}

                            {filterAdvance && filterAdvance.length && (
                                <TouchableOpacity
                                    accessibilityLabel={'VnrFilter-OpenfilterAdvance'}
                                    style={[
                                        viewFilter,
                                        !isNaN(numberCountFilter) &&
                                        numberCountFilter !== 0 && {
                                            backgroundColor: Colors.blue_7
                                        }
                                    ]}
                                    onPress={() => this.nextScreenFilterAdv()}
                                >
                                    <IconSliders
                                        size={Size.iconSize}
                                        color={
                                            !isNaN(numberCountFilter) && numberCountFilter !== 0
                                                ? Colors.white
                                                : Colors.grey
                                        }
                                    />
                                    {!isNaN(numberCountFilter) && numberCountFilter !== 0 && (
                                        <View style={stylesVnrFilter.wrapNumberCountFilter}>
                                            <Text
                                                style={[
                                                    styleSheets.lable,
                                                    {
                                                        color: Colors.white
                                                    }
                                                ]}
                                            >
                                                {numberCountFilter}
                                            </Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            );
        } else if (filterCommon && filterCommon.IsShowFilterCommon === false && filterAdvance && filterAdvance.length) {
            return (
                <View style={styBoxFilter}>
                    <View style={contentFilter}>
                        <View style={filter}>
                            <View style={[styleContentFilterDesign.fl1Jus_Center, search]}>
                                {spreadTextFilterCommon.length > 0 && !filterCommon?.IsShowFilterCommon ? (
                                    <View
                                        style={[
                                            stylesListPickerControl.formDate_To_From,
                                            CustomStyleSheet.width('100%')
                                        ]}
                                    >
                                        {
                                            <TouchableOpacity
                                                style={[
                                                    CustomStyleSheet.flex(1),
                                                    styleContentFilterDesign.styRightPicker
                                                ]}
                                                onPress={() => this.nextScreenFilterAdv()}
                                            >
                                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                                    <View>
                                                        <Text style={styleSheets.text}>{spreadTextFilterCommon}</Text>
                                                    </View>
                                                </ScrollView>
                                            </TouchableOpacity>
                                        }
                                        <TouchableOpacity
                                            accessibilityLabel={'VnrFilter-ClearText'}
                                            style={styleContentFilterDesign.styleAli_Jus_Center}
                                            onPress={() => this.onClearText()}
                                        >
                                            <IconCancel
                                                size={Size.iconSize - 2}
                                                color={
                                                    this.props.iconCloseColor ? this.props.iconCloseColor : Colors.black
                                                }
                                            />
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    filterAdvance[0].ControlGroup.map((control, index) => {
                                        return this.renderControl(control, index, filterAdvance[0].Label);
                                    })
                                )}
                            </View>
                            {filterAdvance && filterAdvance.length && (
                                <TouchableOpacity
                                    accessibilityLabel={'VnrFilter-OpenfilterAdvance'}
                                    style={[
                                        viewFilter,
                                        !isNaN(numberCountFilter) &&
                                        numberCountFilter !== 0 && {
                                            backgroundColor: Colors.blue_7
                                        }
                                    ]}
                                    onPress={() => this.nextScreenFilterAdv()}
                                >
                                    <IconSliders
                                        size={Size.iconSize}
                                        color={
                                            !isNaN(numberCountFilter) && numberCountFilter !== 0
                                                ? Colors.white
                                                : Colors.grey
                                        }
                                    />
                                    {!isNaN(numberCountFilter) && numberCountFilter !== 0 && (
                                        <View style={stylesVnrFilter.wrapNumberCountFilter}>
                                            <Text
                                                style={[
                                                    styleSheets.lable,
                                                    {
                                                        color: Colors.white
                                                    }
                                                ]}
                                            >
                                                {numberCountFilter}
                                            </Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            );
        } else {
            return <View />;
        }
    };

    onCloseModalFilter = () => {
        this.setState({
            isShowModalFilter: false
        });
    };

    render() {
        const { filterAdvance, isShowModalFilter } = this.state,
            { scrollYAnimatedValue, style, children } = this.props,
            { styViewAnimation } = style ? style : styleContentFilter;

        let translateY = null,
            headerOpacity = null;

        if (scrollYAnimatedValue) {
            translateY = scrollYAnimatedValue.interpolate({
                inputRange: [0, HEADER_MAX_HEIGHT],
                outputRange: [0, -HEADER_MAX_HEIGHT],
                extrapolate: 'clamp'
            });

            headerOpacity = scrollYAnimatedValue.interpolate({
                inputRange: [0, HEADER_MAX_HEIGHT],
                outputRange: [1, 0],
                extrapolate: 'clamp'
            });
        }

        return translateY && headerOpacity && scrollYAnimatedValue ? (
            <Animated.View
                style={[
                    styViewAnimation,
                    {
                        opacity: headerOpacity,
                        transform: [
                            {
                                translateY: translateY
                            }
                        ]
                    }
                ]}
            >
                {children != null ? children : this.renderContent()}
                {filterAdvance && isShowModalFilter === true ? (
                    <VnrFilter
                        onFinish={this.onFilterAdvance}
                        filterConfig={filterAdvance}
                        isShowModalFilter={isShowModalFilter}
                        onCloseModalFilter={this.onCloseModalFilter}
                    />
                ) : null}
            </Animated.View>
        ) : (
            <View>
                {children != null ? children : this.renderContent()}
                {filterAdvance && isShowModalFilter === true ? (
                    <VnrFilter
                        onFinish={this.onFilterAdvance}
                        filterConfig={filterAdvance}
                        isShowModalFilter={isShowModalFilter}
                        onCloseModalFilter={this.onCloseModalFilter}
                    />
                ) : null}
            </View>
        );
    }
}

const HEADER_MAX_HEIGHT = 70 + Size.defineHalfSpace;
