import React, { Component } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { translate } from '../../i18n/translate';
import { IconFilter } from '../../constants/Icons';
import { Size, Colors, styleContentFilter, styleSheets, CustomStyleSheet } from '../../constants/styleConfig';
import VnrTextInput from '../VnrTextInput/VnrTextInput';
import DrawerServices from '../../utils/DrawerServices';
import { ScreenName, EnumName, ControlName } from '../../assets/constant';
import { ConfigListFilter } from '../../assets/configProject/ConfigListFilter';

// eslint-disable-next-line no-unused-vars
const DEFAULT_FILTER = {
    HreSubmitWorkHistorySalary: {
        FilterCommon: {
            fieldName: '',
            placeholder: ['HRM_Cat_ConstructionProject_DateEffective'],
            ClassStyle: '',
            IsShowFilterCommon: false
        },
        FilterAdvance: [
            {
                Label: 'HRM_Att_RosterGroupByOrganization_DateEffective',
                ControlGroup: [
                    {
                        Name: 'VnrDate',
                        format: 'DD/MM/YYYY',
                        fieldName: 'DateFrom',
                        placeHolder: '',
                        response: 'string'
                    },
                    {
                        Name: 'VnrDate',
                        format: 'DD/MM/YYYY',
                        fieldName: 'DateTo',
                        placeHolder: '',
                        response: 'string'
                    }
                ]
            },
            {
                Label: 'HRM_Category_OrgStructure_OrgStructureName',
                ControlGroup: [
                    {
                        Name: 'VnrTreeView',
                        api: {
                            urlApi: '[URI_HR]/Cat_GetData/GetOrgTreeView',
                            type: 'E_GET'
                        },
                        fieldName: 'orgStructureID',
                        isCheckChildren: true,
                        response: 'string',
                        textField: 'Name',
                        valueField: 'OrderNumber'
                    }
                ]
            },
            {
                Label: 'HRM_Evaluation_Evaluator_JobTitleName',
                ControlGroup: [
                    {
                        Name: 'VnrPickerMulti',
                        api: {
                            urlApi: '[URI_HR]/Cat_GetData/GetMultiJobTitle',
                            type: 'E_GET'
                        },
                        filterParams: 'text',
                        textField: 'JobTitleName',
                        valueField: 'ID',
                        filter: true,
                        filterServer: true,
                        response: 'string',
                        fieldName: 'strJobTitleID',
                        placeholder: ''
                    }
                ]
            },
            {
                Label: 'HRM_Evaluation_Evaluator_PositionName',
                ControlGroup: [
                    {
                        Name: 'VnrPickerMulti',
                        api: {
                            urlApi: '[URI_HR]/Cat_GetData/GetMultiPosition',
                            type: 'E_GET'
                        },
                        filterParams: 'text',
                        textField: 'PositionName',
                        valueField: 'ID',
                        filter: true,
                        filterServer: true,
                        response: 'string',
                        fieldName: 'strPositionID',
                        placeholder: ''
                    }
                ]
            },

            {
                Label: 'Status',
                ControlGroup: [
                    {
                        Name: 'VnrPickerMulti',
                        api: {
                            urlApi: '[URI_SYS]/Sys_GetData/GetEnum?text=WorkHistoryStatus',
                            type: 'E_GET'
                        },
                        filterParams: 'text',
                        textField: 'Text',
                        valueField: 'Value',
                        filter: true,
                        filterServer: true,
                        response: 'string',
                        fieldName: 'strStatus',
                        placeholder: ''
                    }
                ]
            },
            {
                Label: 'HRM_Hre_WorkHistorySalary_IsSalaryOrContractAddendum',
                ControlGroup: [
                    {
                        Name: 'VnrSwitch',
                        fieldName: 'IsSalaryOrContractAddendum'
                    }
                ]
            }
        ]
    },
    HreApproveWorkHistorySalary: {
        FilterCommon: {
            fieldName: 'CodeEmp, ProfileName',
            placeholder: ['HRM_HR_Common_Profile_CodeEmp', 'HRM_HR_Common_Profile_ProfileName'],
            ClassStyle: ''
        },
        FilterAdvance: [
            {
                Label: 'HRM_Att_RosterGroupByOrganization_DateEffective',
                ControlGroup: [
                    {
                        Name: 'VnrDate',
                        format: 'DD/MM/YYYY',
                        fieldName: 'DateFrom',
                        placeHolder: '',
                        response: 'string'
                    },
                    {
                        Name: 'VnrDate',
                        format: 'DD/MM/YYYY',
                        fieldName: 'DateTo',
                        placeHolder: '',
                        response: 'string'
                    }
                ]
            },
            {
                Label: 'HRM_Category_OrgStructure_OrgStructureName',
                ControlGroup: [
                    {
                        Name: 'VnrTreeView',
                        api: {
                            urlApi: '[URI_HR]/Cat_GetData/GetOrgTreeView',
                            type: 'E_GET'
                        },
                        fieldName: 'orgStructureID',
                        isCheckChildren: true,
                        response: 'string',
                        textField: 'Name',
                        valueField: 'OrderNumber'
                    }
                ]
            },
            {
                Label: 'HRM_Evaluation_Evaluator_JobTitleName',
                ControlGroup: [
                    {
                        Name: 'VnrPickerMulti',
                        api: {
                            urlApi: '[URI_HR]/Cat_GetData/GetMultiJobTitle',
                            type: 'E_GET'
                        },
                        filterParams: 'text',
                        textField: 'JobTitleName',
                        valueField: 'ID',
                        filter: true,
                        filterServer: true,
                        response: 'string',
                        fieldName: 'strJobTitleID',
                        placeholder: ''
                    }
                ]
            },
            {
                Label: 'HRM_Evaluation_Evaluator_PositionName',
                ControlGroup: [
                    {
                        Name: 'VnrPickerMulti',
                        api: {
                            urlApi: '[URI_HR]/Cat_GetData/GetMultiPosition',
                            type: 'E_GET'
                        },
                        filterParams: 'text',
                        textField: 'PositionName',
                        valueField: 'ID',
                        filter: true,
                        filterServer: true,
                        response: 'string',
                        fieldName: 'strPositionID',
                        placeholder: ''
                    }
                ]
            },
            {
                Label: 'HRM_HR_IsNotComputProductSalary',
                ControlGroup: [
                    {
                        Name: 'VnrSwitch',
                        fieldName: 'IsNotComputProductSalary'
                    }
                ]
            }
        ]
    },
    HreApprovedWorkHistorySalary: {
        FilterCommon: {
            fieldName: 'CodeEmp,ProfileName',
            placeholder: ['HRM_HR_Common_Profile_CodeEmp', 'HRM_HR_Common_Profile_ProfileName'],
            ClassStyle: ''
        },
        FilterAdvance: [
            {
                Label: 'HRM_Att_RosterGroupByOrganization_DateEffective',
                ControlGroup: [
                    {
                        Name: 'VnrDate',
                        format: 'DD/MM/YYYY',
                        fieldName: 'DateFrom',
                        placeHolder: '',
                        response: 'string'
                    },
                    {
                        Name: 'VnrDate',
                        format: 'DD/MM/YYYY',
                        fieldName: 'DateTo',
                        placeHolder: '',
                        response: 'string'
                    }
                ]
            },
            {
                Label: 'HRM_Category_OrgStructure_OrgStructureName',
                ControlGroup: [
                    {
                        Name: 'VnrTreeView',
                        api: {
                            urlApi: '[URI_HR]/Cat_GetData/GetOrgTreeView',
                            type: 'E_GET'
                        },
                        fieldName: 'orgStructureID',
                        isCheckChildren: true,
                        response: 'string',
                        textField: 'Name',
                        valueField: 'OrderNumber'
                    }
                ]
            },
            {
                Label: 'HRM_Evaluation_Evaluator_JobTitleName',
                ControlGroup: [
                    {
                        Name: 'VnrPickerMulti',
                        api: {
                            urlApi: '[URI_HR]/Cat_GetData/GetMultiJobTitle',
                            type: 'E_GET'
                        },
                        filterParams: 'text',
                        textField: 'JobTitleName',
                        valueField: 'ID',
                        filter: true,
                        filterServer: true,
                        response: 'string',
                        fieldName: 'strJobTitleID',
                        placeholder: ''
                    }
                ]
            },
            {
                Label: 'HRM_Evaluation_Evaluator_PositionName',
                ControlGroup: [
                    {
                        Name: 'VnrPickerMulti',
                        api: {
                            urlApi: '[URI_HR]/Cat_GetData/GetMultiPosition',
                            type: 'E_GET'
                        },
                        filterParams: 'text',
                        textField: 'PositionName',
                        valueField: 'ID',
                        filter: true,
                        filterServer: true,
                        response: 'string',
                        fieldName: 'strPositionID',
                        placeholder: ''
                    }
                ]
            }
        ]
    }
};

let configListFilter = null,
    enumName = null,
    controlName = null,
    filterList = null;

export default class VnrFilterCommon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spreadTextFilterCommon: '',
            filterCommon: null,
            filterAdvance: null,
            refreshTextCommon: false,
            refreshFilter: false
        };

        this.textFilterCommon = '';
        this.objParamAdvance = null;
        this.spreadTextFilterParams = '';
    }

    // eslint-disable-next-line react/no-deprecated
    componentWillReceiveProps(nexProps) {
        if (this.props.isRefreshFilter !== nexProps.isRefreshFilter) {
            this.initStateFilter(nexProps);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            nextState.spreadTextFilterCommon !== this.state.spreadTextFilterCommon ||
            nextState.filterCommon !== this.state.filterCommon ||
            nextState.refreshFilter !== this.state.refreshFilter ||
            nextState.refreshTextCommon !== this.state.refreshTextCommon ||
            nextProps.isRefreshFilter !== this.props.isRefreshFilter
        );
    }

    initStateFilter = nexProps => {
        enumName = EnumName;
        filterList = ScreenName.FilterList;
        controlName = ControlName;
        configListFilter = {
            ...ConfigListFilter.value
            // ...DEFAULT_FILTER
        };
        const { screenName, dataBody } = nexProps ? nexProps : this.props;
        let _configListFilter = configListFilter[screenName],
            FilterCommon = _configListFilter ? _configListFilter.FilterCommon : null,
            FilterAdvance = null;

        if (_configListFilter && _configListFilter.FilterAdvance) {
            FilterAdvance = _configListFilter.FilterAdvance.map(item => {
                return {
                    ...item,
                    ControlGroup: [
                        ...item.ControlGroup.map(control => {
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
        if (dataBody && dataBody.NotificationID && FilterAdvance) {
            isFilterFromNotify = true;
            FilterAdvance = [
                {
                    Label: 'HRM_PortalApp_Filter_From_notification',
                    ControlGroup: [
                        {
                            Name: 'VnrSwitch',
                            fieldName: 'isFilterFromNotify',
                            value: true
                        }
                    ]
                }
            ].concat(FilterAdvance);
        }

        // Xử lý filter mặc định
        if (dataBody && dataBody.defaultParams && dataBody.defaultParams.length > 0 && FilterAdvance) {
            FilterAdvance = FilterAdvance.map(item => {
                if (item && item.ControlGroup && item.ControlGroup.length == 1) {
                    let control = item.ControlGroup[0];
                    let findItem = dataBody.defaultParams.find(value => {
                        return value['fieldName'] == control['fieldName'];
                    });

                    if (findItem) {
                        control.value = findItem.value;
                        let value = findItem.value,
                            handledValue = '';

                        if (Array.isArray(value)) {
                            handledValue = value
                                .map(e => {
                                    return translate(e[findItem.textField]);
                                })
                                .join(',');
                        } else if (Object.keys(value).length > 0 && value[findItem.textField]) {
                            handledValue = translate(value[findItem.textField]);
                        } else if (typeof value === 'string') {
                            handledValue = translate(value);
                        }

                        _spreadTextFilterCommon += `${translate(item.Label)}: ${handledValue}`;
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
            }

            if (arrPlaceHolder && Array.isArray(arrPlaceHolder)) {
                let transPlaceHolder = arrPlaceHolder.map(key => translate(key)).join(', ');

                _placeHolder = translate('HRM_Filter_By') + ' ' + transPlaceHolder;

                FilterCommon.placeholder = _placeHolder;
            }
        }

        this.setState({
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
            if (filterCommon.IsShowFilterCommon !== false) {
                let fieldNameTrim = filterCommon.fieldName.replace(/ /g, '');
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

            DrawerServices.navigate(filterList, {
                filterAdvance,
                onFinish: this.onFilterAdvance
            });
        }
    };

    onChangeTextFilter = text => {
        this.textFilterCommon = text;
        this.setState({ spreadTextFilterCommon: text, refreshTextCommon: !this.state.refreshTextCommon });
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
    onFilterCommon = () => {
        //#region [callback func reload từ danh sách]
        let getParamCommon = this.spreadParamCommon(),
            paramsFilter = { ...getParamCommon };

        if (this.objParamAdvance) {
            paramsFilter = { ...paramsFilter, ...this.objParamAdvance };
        }

        const { onSubmitEditing } = this.props;
        onSubmitEditing(paramsFilter);
        //#endregion
    };

    //nhấn lọc từ màn hình nâng cao, gọi hàm spreadParamsFilter xử lý cho text common và lọc
    onFilterAdvance = (dataDisplay, dataFilter, pureData) => {
        const { filterCommon } = this.state;
        //gán obj filter cho biến
        this.objParamAdvance = dataFilter;

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
            paramsFilter = { ...dataFilter, ...getParamCommon };

        const { onSubmitEditing, dataBody } = this.props;

        // kiểm tra tìm kiếm theo notificaiton
        if (dataBody && dataBody.NotificationID) {
            paramsFilter = {
                ...paramsFilter,
                NotificationID: dataFilter.isFilterFromNotify ? dataBody.NotificationID : null
            };
        }

        onSubmitEditing(paramsFilter);
        //#endregion

        //#region [xử lý hiển thị text ở FilterCommon từ filter advance và set lại state FilterAdvance có giá trị vừa chọn]
        let { filterAdvance } = this.state,
            arrDisplayTextCommon = [];

        //lặp các điều kiện lọc
        filterAdvance.forEach(item => {
            let label = item.Label && item.Label !== '' ? translate(item.Label) : '',
                controls = item.ControlGroup,
                valueForTypeBool = null,
                arrValue = [];
            //lặp các control trong groupControl
            controls.forEach(control => {
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
        this.spreadTextFilterParams = arrDisplayTextCommon.join(' ');

        //gọi hàm gán state cho FilterCommon và giá trị mới cho FilterAdvance
        this.spreadParamsFilter(filterAdvance);
        //#endregion

        //về lại danh sách
        const { screenName } = this.props;
        DrawerServices.navigate(screenName);
    };

    spreadParamsFilter = newFilterAdvanceState => {
        let _textCommon = this.textFilterCommon;

        //set lại text cho filter common
        let nextSpreadTextFilterParams = _textCommon;

        if (this.spreadTextFilterParams && this.spreadTextFilterParams !== '') {
            nextSpreadTextFilterParams += ' ' + this.spreadTextFilterParams;
        }
        this.setState({
            spreadTextFilterCommon: nextSpreadTextFilterParams,
            filterAdvance: newFilterAdvanceState,
            refreshTextCommon: !this.state.refreshTextCommon
        });
    };

    spreadParamCommon = () => {
        const { filterCommon } = this.state;
        let paramsCommon = filterCommon[enumName.E_fieldName].split(','),
            valueCommon = this.textFilterCommon,
            result = {};

        paramsCommon.forEach(param => {
            param = param.trim();
            result[param] = valueCommon;
        });

        return result;
    };

    onClearText = () => {
        this.textFilterCommon = '';
        this.objParamAdvance = null;
        this.spreadTextFilterParams = '';

        //set value cho filter advance
        let { filterAdvance } = this.state,
            newFilterAdvanceState = filterAdvance.map(item => {
                let { ControlGroup } = item;
                ControlGroup.forEach(control => {
                    if (Object.prototype.hasOwnProperty.call(control, enumName.E_value)) {
                        delete control[enumName.E_value];
                    }
                });

                return { ...item };
            });

        this.setState({
            spreadTextFilterCommon: '',
            filterAdvance: newFilterAdvanceState,
            refreshTextCommon: !this.state.refreshTextCommon
        });

        const { onSubmitEditing, dataBody } = this.props;

        // kiểm tra tìm kiếm theo notificaiton
        if (dataBody && dataBody.NotificationID) {
            onSubmitEditing({
                NotificationID: null
            });
        } else {
            // Xử lý filter mặc định
            let _params = {};
            if (dataBody && dataBody.defaultParams && dataBody.defaultParams.length > 0) {
                dataBody.defaultParams.forEach(el => {
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
    };

    renderContent = () => {
        const { filterCommon, filterAdvance, spreadTextFilterCommon, refreshTextCommon } = this.state,
            { style } = this.props,
            { contentFilter, filter, search, viewFilter } = style ? style : styleContentFilter;

        if (filterCommon && filterCommon.IsShowFilterCommon !== false) {
            return (
                <View style={contentFilter}>
                    <View style={filter}>
                        <VnrTextInput
                            refresh={refreshTextCommon}
                            style={[styleSheets.text, search]}
                            value={spreadTextFilterCommon}
                            onClearText={() => {
                                this.onClearText();
                            }}
                            onFocus={() => this.onFocusFilterCommon()}
                            onBlur={() => this.spreadParamsFilter(filterAdvance)}
                            returnKeyType={enumName.E_search}
                            onChangeText={text => this.onChangeTextFilter(text)}
                            onSubmitEditing={() => this.onFilterCommon()}
                            placeholder={filterCommon.placeholder}
                        />
                        {filterAdvance && filterAdvance.length && (
                            <TouchableOpacity style={viewFilter} onPress={() => this.nextScreenFilterAdv()}>
                                <IconFilter color={Colors.gray_10} size={Size.iconSize} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            );
        } else if (filterCommon && filterCommon.IsShowFilterCommon === false && filterAdvance && filterAdvance.length) {
            return (
                <View style={contentFilter}>
                    <TouchableOpacity style={filter} onPress={() => this.nextScreenFilterAdv()}>
                        <TextInput
                            editable={false}
                            refresh={refreshTextCommon}
                            style={[styleSheets.text, search, CustomStyleSheet.flex(1)]}
                            value={spreadTextFilterCommon}
                            onClearText={() => {
                                this.onClearText();
                            }}
                            onFocus={() => this.onFocusFilterCommon()}
                            onBlur={() => this.spreadParamsFilter(filterAdvance)}
                            returnKeyType={enumName.E_search}
                            onChangeText={text => this.onChangeTextFilter(text)}
                            onSubmitEditing={() => this.onFilterCommon()}
                            placeholder={filterCommon.placeholder}
                        />
                        {filterAdvance && filterAdvance.length && (
                            <View style={viewFilter}>
                                <IconFilter color={Colors.gray_10} size={Size.iconSize} />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            );
        } else {
            return <View />;
        }
    };

    render() {
        return this.renderContent();
    }
}
