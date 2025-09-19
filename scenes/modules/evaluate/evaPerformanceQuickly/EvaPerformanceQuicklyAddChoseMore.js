import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    styleButtonAddOrEdit,
    styleSafeAreaView,
    Colors,
    stylesListPickerControl,
    styleValid,
    CustomStyleSheet
} from '../../../../constants/styleConfig';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import VnrPickerMulti from '../../../../components/VnrPickerMulti/VnrPickerMulti';
import VnrText from '../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../components/VnrTextInput/VnrTextInput';
import DrawerServices from '../../../../utils/DrawerServices';
import VnrTreeView from '../../../../components/VnrTreeView/VnrTreeView';

export default class EvaPerformanceQuicklyAddChoseMore extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            orgStructure: {
                refresh: false,
                value: null
            },
            JobTitle: {
                disable: false,
                refresh: false,
                value: null
            },
            Position: {
                disable: false,
                refresh: false,
                value: null
            },
            WorkPlace: {
                disable: false,
                refresh: false,
                value: null
            },
            EmployeeType: {
                disable: false,
                refresh: false,
                value: null
            },
            ContractType: {
                disable: false,
                refresh: false,
                value: null
            },
            MaxSeniority: {
                disable: false,
                refresh: false,
                value: null
            },
            MinSeniority: {
                disable: false,
                refresh: false,
                value: null
            },
            fieldValid: {}
        };
    }

    componentDidMount() {}

    //change phòng ban - orgStructure
    onChangeOrg = (items) => {
        const { orgStructure } = this.state;

        this.setState({
            orgStructure: {
                ...orgStructure,
                value: items
            }
        });
    };

    //change chức danh - Jobtitle
    onChangeJobTitle = (items) => {
        const { JobTitle } = this.state;

        this.setState({
            JobTitle: {
                ...JobTitle,
                value: items
            }
        });
    };

    //change chức vụ - Position
    onChangePosition = (items) => {
        const { Position } = this.state;

        this.setState({
            Position: {
                ...Position,
                value: items
            }
        });
    };

    //change nơi làm việc - WorkPlace
    onChangeWorkPlace = (items) => {
        const { WorkPlace } = this.state;

        this.setState({
            WorkPlace: {
                ...WorkPlace,
                value: items
            }
        });
    };

    //change loại nhân viên - EmployeeType
    onChangeEmployeeType = (items) => {
        const { EmployeeType } = this.state;

        this.setState({
            EmployeeType: {
                ...EmployeeType,
                value: items
            }
        });
    };

    //change loại hợp đồng - ContractType
    onChangeContractType = (items) => {
        const { ContractType } = this.state;

        this.setState({
            ContractType: {
                ...ContractType,
                value: items
            }
        });
    };

    render() {
        const {
            orgStructure,
            JobTitle,
            Position,
            WorkPlace,
            EmployeeType,
            ContractType,
            MaxSeniority,
            MinSeniority,
            fieldValid
        } = this.state;

        const { textLableInfo, contentViewControl, viewLable, viewControl } = stylesListPickerControl;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    <KeyboardAwareScrollView contentContainerStyle={CustomStyleSheet.flexGrow(1)}>
                        {/* Phòng ban - orgStructure */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText
                                    style={[styleSheets.text, textLableInfo]}
                                    i18nKey={'HRM_HR_Profile_OrgStructureName'}
                                />

                                {/* valid orgStructureID */}
                                {fieldValid.orgStructureID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                            </View>
                            <View style={viewControl}>
                                <VnrTreeView
                                    api={{
                                        urlApi: '[URI_HR]/Cat_GetData/GetOrgTreeView',
                                        type: 'E_GET'
                                    }}
                                    valueField={'ID'}
                                    value={orgStructure.value}
                                    refresh={orgStructure.refresh}
                                    isCheckChildren={true}
                                    onSelect={(items) => this.onChangeOrg(items)}
                                />
                            </View>
                        </View>

                        {/* Chức danh - JobTitle */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'Cat_JobTitle'} />

                                {/* valid JobTitleID */}
                                {fieldValid.JobTitleID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                            </View>
                            <View style={viewControl}>
                                <VnrPickerMulti
                                    api={{
                                        urlApi: '[URI_HR]/Cat_GetData/GetMultiJobTitle',
                                        type: 'E_POST',
                                        dataBody: {}
                                    }}
                                    value={JobTitle.value}
                                    refresh={JobTitle.refresh}
                                    textField="JobTitleName"
                                    valueField="ID"
                                    filter={true}
                                    filterServer={false}
                                    onFinish={(items) => this.onChangeJobTitle(items)}
                                />
                            </View>
                        </View>

                        {/* Chức vụ - Position */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'Cat_Position'} />

                                {/* valid PositionID */}
                                {fieldValid.PositionID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                            </View>
                            <View style={viewControl}>
                                <VnrPickerMulti
                                    api={{
                                        urlApi: '[URI_HR]/Cat_GetData/GetMultiPosition',
                                        type: 'E_POST',
                                        dataBody: {}
                                    }}
                                    value={Position.value}
                                    refresh={Position.refresh}
                                    textField="PositionName"
                                    valueField="ID"
                                    filter={true}
                                    filterServer={false}
                                    onFinish={(items) => this.onChangePosition(items)}
                                />
                            </View>
                        </View>

                        {/* Nơi làm việc - WorkPlace */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'Cat_WorkPlace'} />

                                {/* valid WorkPlaceID */}
                                {fieldValid.WorkPlaceID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                            </View>
                            <View style={viewControl}>
                                <VnrPickerMulti
                                    api={{
                                        urlApi: '[URI_HR]/Cat_GetData/GetMultiWorkPlace',
                                        type: 'E_POST',
                                        dataBody: {}
                                    }}
                                    value={WorkPlace.value}
                                    refresh={WorkPlace.refresh}
                                    textField="WorkPlaceName"
                                    valueField="ID"
                                    filter={true}
                                    filterServer={false}
                                    onFinish={(items) => this.onChangeWorkPlace(items)}
                                />
                            </View>
                        </View>

                        {/* Loại nhân viên - EmployeeType */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'Cat_EmployeeType'} />

                                {/* valid EmployeeType */}
                                {fieldValid.EmployeeType && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                            </View>
                            <View style={viewControl}>
                                <VnrPickerMulti
                                    api={{
                                        urlApi: '[URI_HR]/Cat_GetData/GetMultiEmployeeType',
                                        type: 'E_POST',
                                        dataBody: {}
                                    }}
                                    value={EmployeeType.value}
                                    refresh={EmployeeType.refresh}
                                    textField="EmployeeTypeName"
                                    valueField="ID"
                                    filter={true}
                                    filterServer={false}
                                    onFinish={(items) => this.onChangeEmployeeType(items)}
                                />
                            </View>
                        </View>

                        {/* Loại hợp đồng - ContractType */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'Cat_ContractType'} />

                                {/* valid ContractType */}
                                {fieldValid.ContractType && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                            </View>
                            <View style={viewControl}>
                                <VnrPickerMulti
                                    api={{
                                        urlApi: '[URI_HR]/Cat_GetData/GetMultiContractType',
                                        type: 'E_POST',
                                        dataBody: {}
                                    }}
                                    value={ContractType.value}
                                    refresh={ContractType.refresh}
                                    textField="ContractTypeName"
                                    valueField="ID"
                                    filter={true}
                                    filterServer={false}
                                    onFinish={(items) => this.onChangeContractType(items)}
                                />
                            </View>
                        </View>

                        {/* Thâm niên tối thiểu - MinSeniority */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText
                                    style={[styleSheets.text, textLableInfo]}
                                    i18nKey={'HRM_Evaluation_PerformanceTemplate_SeniorityFrom_Hre'}
                                />

                                {/* valid MinSeniority */}
                                {fieldValid.MinSeniority && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                            </View>

                            <View style={viewControl}>
                                <VnrTextInput
                                    value={MinSeniority.value}
                                    refresh={MinSeniority.refresh}
                                    disable={MinSeniority.disable}
                                    keyboardType={'numeric'}
                                    charType={'double'}
                                    returnKeyType={'done'}
                                    onChangeText={(value) =>
                                        this.setState({
                                            MinSeniority: {
                                                ...MinSeniority,
                                                value: value
                                            }
                                        })
                                    }
                                />
                            </View>
                        </View>

                        {/* Thâm niên tối đa - MaxSeniority */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText
                                    style={[styleSheets.text, textLableInfo]}
                                    i18nKey={'HRM_Evaluation_PerformanceTemplate_SeniorityTo_Hre'}
                                />

                                {/* valid MaxSeniority */}
                                {fieldValid.MaxSeniority && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                            </View>

                            <View style={viewControl}>
                                <VnrTextInput
                                    value={MaxSeniority.value}
                                    refresh={MaxSeniority.refresh}
                                    disable={MaxSeniority.disable}
                                    keyboardType={'numeric'}
                                    charType={'double'}
                                    returnKeyType={'done'}
                                    onChangeText={(value) =>
                                        this.setState({
                                            MaxSeniority: {
                                                ...MaxSeniority,
                                                value: value
                                            }
                                        })
                                    }
                                />
                            </View>
                        </View>
                    </KeyboardAwareScrollView>

                    {/* bottom button close, confirm */}
                    <View style={styleButtonAddOrEdit.groupButton}>
                        <TouchableOpacity
                            onPress={() => DrawerServices.goBack()}
                            style={[styleButtonAddOrEdit.btnClose]}
                        >
                            <VnrText
                                style={[
                                    styleSheets.lable,
                                    styleButtonAddOrEdit.groupButton__text,
                                    { color: Colors.greySecondary }
                                ]}
                                i18nKey={'HRM_Common_Close'}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                const { changeGetKpiOfControl } = this.props.navigation.state.params;
                                if (changeGetKpiOfControl && typeof changeGetKpiOfControl === 'function') {
                                    changeGetKpiOfControl({ ...this.state });
                                    DrawerServices.navigate('EvaPerformanceQuicklyAdd');
                                }
                            }}
                            style={styleButtonAddOrEdit.groupButton__button_save}
                        >
                            <VnrText
                                style={[styleSheets.lable, styleButtonAddOrEdit.groupButton__text]}
                                i18nKey={'HRM_Common_Apply'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}
