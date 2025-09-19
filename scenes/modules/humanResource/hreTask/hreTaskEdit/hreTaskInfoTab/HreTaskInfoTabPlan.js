import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    styleSafeAreaView,
    stylesListPickerControl,
    Colors,
    Size,
    styleValid,
    CustomStyleSheet
} from '../../../../../../constants/styleConfig';
import VnrText from '../../../../../../components/VnrText/VnrText';
import Vnr_Function from '../../../../../../utils/Vnr_Function';
import DrawerServices from '../../../../../../utils/DrawerServices';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import VnrDate from '../../../../../../components/VnrDate/VnrDate';
import VnrPicker from '../../../../../../components/VnrPicker/VnrPicker';
import { IconPublish } from '../../../../../../constants/Icons';
import VnrPickerQuickly from '../../../../../../components/VnrPickerQuickly/VnrPickerQuickly';
import HttpService from '../../../../../../utils/HttpService';
import { VnrLoadingSevices } from '../../../../../../components/VnrLoading/VnrLoadingPages';

export default class HreTaskInfoTabPlan extends Component {
    constructor(props) {
        super(props);

        // Xử lý disable control Edit cho taskAsigned
        const { params } = props.navigation.state,
            { roleEditStatusOnly } = params;

        this.state = {
            dataItem: null,
            Creator: {
                visible: true,
                disable: roleEditStatusOnly ? true : false,
                refresh: false,
                value: null
            },
            StatusView: {
                visible: true,
                disable: false,
                refresh: false,
                value: null,
                data: null
            },
            AssignmentDate: {
                visible: true,
                disable: roleEditStatusOnly ? true : false,
                refresh: false,
                value: null
            },
            ExpectedDate: {
                visible: true,
                disable: roleEditStatusOnly ? true : false,
                refresh: false,
                value: null
            },
            FinishDate: {
                visible: true,
                disable: roleEditStatusOnly ? true : false,
                refresh: false,
                value: null
            },
            ExpectedDuration: {
                visible: true,
                disable: roleEditStatusOnly ? true : false,
                refresh: false,
                value: null
            },
            ActualDuration: {
                visible: true,
                disable: roleEditStatusOnly ? true : false,
                refresh: false,
                value: null
            },
            PICID: {
                visible: true,
                disable: roleEditStatusOnly ? true : false,
                refresh: false,
                value: null
            },
            fieldValid: {}
        };
    }

    reload = (E_KEEP_FILTER, actionIsDelete) => {
        const { reloadScreenList } = this.props.navigation.state.params;
        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');

        //nếu action = Delete => back về danh sách
        if (actionIsDelete) {
            DrawerServices.navigate('');
        } else {
            this.getDataItem(true);
        }
    };

    componentDidMount() {
        const { params } = this.props.navigation.state,
            { Creator, StatusView, AssignmentDate, ExpectedDate, FinishDate, ExpectedDuration, ActualDuration, PICID } =
                this.state;

        if (params) {
            const { newRecord, fieldValid, roleEditStatusOnly } = params;

            // Lấy cấu hình trừ nhưng status không được chọn [StatusView]
            this.getConfigStatusNotBeChose(roleEditStatusOnly);

            let record = { ...newRecord };
            this.setState({
                dataItem: record,
                Creator: {
                    ...Creator,
                    value: record.CreatorID ? { ID: record.CreatorID, ProfileName: record.CreatorName } : null,
                    refresh: !Creator.refresh
                },
                StatusView: {
                    ...StatusView,
                    value: record.StatusView ? { Value: record.StatusView, Text: record.StatusName } : null,
                    refresh: !StatusView.refresh
                },
                AssignmentDate: {
                    ...AssignmentDate,
                    value: record.AssignmentDate,
                    refresh: !AssignmentDate.refresh
                },
                ExpectedDate: {
                    ...ExpectedDate,
                    value: record.ExpectedDate,
                    refresh: !ExpectedDate.refresh
                },
                FinishDate: {
                    ...FinishDate,
                    value: record.FinishDate,
                    refresh: !FinishDate.refresh
                },
                ExpectedDuration: {
                    ...ExpectedDuration,
                    value: record.ExpectedDuration ? record.ExpectedDuration.toString() : null,
                    refresh: !ExpectedDuration.refresh
                },
                ActualDuration: {
                    ...ActualDuration,
                    value: record.ActualDuration ? record.ActualDuration.toString() : null,
                    refresh: !ActualDuration.refresh
                },
                PICID: {
                    ...PICID,
                    value: record.PICID ? { ID: record.PICID, ProfileName: record.AssignedPerson } : null,
                    refresh: !PICID.refresh
                },
                fieldValid
            });
        }
    }

    getConfigStatusNotBeChose = (roleEditStatusOnly) => {
        const dataBody = {
            keyConfig: roleEditStatusOnly
                ? 'HRM_TASK_CONFIG_STATUSNOTBECHOSEN_TASKASSIGNED'
                : 'HRM_TASK_CONFIG_STATUSNOTBECHOSEN_TASKASSIGNMENT'
        };
        VnrLoadingSevices.show();
        HttpService.MultiRequest([
            HttpService.Post('[URI_HR]/Tas_GetData/GetListExceptEnumConfig', dataBody),
            HttpService.Get('[URI_SYS]/Sys_GetData/GetEnum?text=AssignTask')
        ]).then((resAll) => {
            VnrLoadingSevices.hide();
            let [configStatus, dataStatus] = resAll;
            const { StatusView } = this.state;

            if (
                configStatus &&
                Array.isArray(configStatus) &&
                configStatus.length > 0 &&
                dataStatus &&
                dataStatus.length > 0
            ) {
                try {
                    dataStatus = dataStatus.filter((e) => configStatus.findIndex((item) => item === e.Value) == -1);

                    this.setState({
                        StatusView: {
                            ...StatusView,
                            data: dataStatus,
                            refresh: !StatusView.refresh
                        }
                    });
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.log(error);
                }
            }
        });
    };

    //update data
    onUpdate = () => {
        const { params } = this.props.navigation.state;

        if (params) {
            const { update, reload } = params;
            if (update && typeof update === 'function') {
                update(reload);
            }
        }
    };

    //update value cho record
    onUpdateNewRecord = (obj) => {
        const { params } = this.props.navigation.state;

        if (params) {
            const { updateNewRecord } = params;
            if (updateNewRecord && typeof updateNewRecord === 'function') {
                updateNewRecord(obj);
            }
        }
    };

    render() {
        const {
            Creator,
            AssignmentDate,
            ExpectedDate,
            FinishDate,
            PICID,
            StatusView,
            fieldValid
        } = this.state;

        const { textLableInfo, contentViewControl, viewLable, viewControl } = stylesListPickerControl;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    {
                        <KeyboardAwareScrollView
                            contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                            keyboardShouldPersistTaps={'handled'}
                        >
                            {/* Người giao - Creator */}
                            {
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Hre_Tas_Task_TaskMaster'}
                                        />

                                        {/* valid CreatorID */}
                                        {fieldValid.CreatorID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            disable={Creator.disable}
                                            api={{
                                                urlApi: '[URI_HR]/Hre_GetData/GetMultiProfileAll',
                                                type: 'E_GET'
                                            }}
                                            textField="ProfileName"
                                            valueField="ID"
                                            filter={true}
                                            refresh={Creator.refresh}
                                            value={Creator.value}
                                            filterServer={false}
                                            onFinish={(item) =>
                                                this.setState(
                                                    {
                                                        Creator: {
                                                            ...Creator,
                                                            value: item,
                                                            refresh: !Creator.refresh
                                                        }
                                                    },
                                                    () => {
                                                        this.onUpdateNewRecord({ CreatorID: item ? item.ID : null });
                                                    }
                                                )
                                            }
                                        />
                                    </View>
                                </View>
                            }

                            {/* Người thực hiện - PICID */}
                            {
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Tas_Task_AssignedEmpID'}
                                        />

                                        {/* valid PICID */}
                                        {fieldValid.PICID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            disable={PICID.disable}
                                            api={{
                                                urlApi: '[URI_HR]/Hre_GetData/GetMultiProfileAll',
                                                type: 'E_GET'
                                            }}
                                            textField="ProfileName"
                                            valueField="ID"
                                            filter={true}
                                            refresh={PICID.refresh}
                                            value={PICID.value}
                                            filterServer={true}
                                            filterParams="text"
                                            onFinish={(item) =>
                                                this.setState(
                                                    {
                                                        PICID: {
                                                            ...PICID,
                                                            value: item,
                                                            refresh: !PICID.refresh
                                                        }
                                                    },
                                                    () => {
                                                        this.onUpdateNewRecord({ PICID: item ? item.ID : null });
                                                    }
                                                )
                                            }
                                        />
                                    </View>
                                </View>
                            }

                            {/* Ngày giao -  AssignmentDate */}
                            {
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Hre_Tas_Task_DateGive'}
                                        />

                                        {/* valid AssignmentDate */}
                                        {fieldValid.AssignmentDate && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrDate
                                            disable={AssignmentDate.disable}
                                            response={'string'}
                                            format={'DD/MM/YYYY'}
                                            refresh={AssignmentDate.refresh}
                                            value={AssignmentDate.value}
                                            type={'date'}
                                            onFinish={(value) =>
                                                this.setState(
                                                    {
                                                        AssignmentDate: {
                                                            ...AssignmentDate,
                                                            value: value
                                                        }
                                                    },
                                                    () => {
                                                        this.onUpdateNewRecord({ AssignmentDate: value });
                                                    }
                                                )
                                            }
                                        />
                                    </View>
                                </View>
                            }

                            {/* Ngày mong đợi -  ExpectedDate */}
                            {
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Tas_Task_ExpectedDate'}
                                        />

                                        {/* valid ExpectedDate */}
                                        {fieldValid.ExpectedDate && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrDate
                                            disable={ExpectedDate.disable}
                                            response={'string'}
                                            format={'DD/MM/YYYY'}
                                            value={ExpectedDate.value}
                                            refresh={ExpectedDate.refresh}
                                            type={'date'}
                                            onFinish={(value) =>
                                                this.setState(
                                                    {
                                                        ExpectedDate: {
                                                            ...ExpectedDate,
                                                            value: value
                                                        }
                                                    },
                                                    () => {
                                                        this.onUpdateNewRecord({ ExpectedDate: value });
                                                    }
                                                )
                                            }
                                        />
                                    </View>
                                </View>
                            }

                            {/* Ngày hoàn thành -  FinishDate */}
                            {
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Tas_Task_FinishDate'}
                                        />

                                        {/* valid FinishDate */}
                                        {fieldValid.FinishDate && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrDate
                                            disable={FinishDate.disable}
                                            response={'string'}
                                            format={'DD/MM/YYYY'}
                                            value={FinishDate.value}
                                            refresh={FinishDate.refresh}
                                            type={'date'}
                                            onFinish={(value) =>
                                                this.setState(
                                                    {
                                                        FinishDate: {
                                                            ...FinishDate,
                                                            value: value
                                                        }
                                                    },
                                                    () => {
                                                        this.onUpdateNewRecord({ FinishDate: value });
                                                    }
                                                )
                                            }
                                        />
                                    </View>
                                </View>
                            }

                            {/* trạng thái - StatusView */}
                            {
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_HR_Task_Status'}
                                        />

                                        {/* valid StatusView */}
                                        {fieldValid.StatusView && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPickerQuickly
                                            // fix case load trạng thái trừ trạng thái không được chọn.
                                            dataLocal={StatusView.data}
                                            // api={
                                            //     {
                                            //         "urlApi": "[URI_SYS]/Sys_GetData/GetEnum?text=AssignTask",
                                            //         "type": "E_GET"
                                            //     }
                                            // }
                                            textField="Text"
                                            valueField="Value"
                                            filter={false}
                                            refresh={StatusView.refresh}
                                            value={StatusView.value}
                                            onFinish={(item) =>
                                                this.setState(
                                                    {
                                                        StatusView: {
                                                            ...StatusView,
                                                            value: item
                                                        }
                                                    },
                                                    () => {
                                                        this.onUpdateNewRecord({
                                                            StatusView: item ? item.Value : null
                                                        });
                                                    }
                                                )
                                            }
                                        />
                                    </View>
                                </View>
                            }
                        </KeyboardAwareScrollView>
                    }

                    {/* bottom button save */}
                    <View style={styles.groupButton}>
                        <TouchableOpacity onPress={() => this.onUpdate()} style={styles.groupButton__button_save}>
                            <IconPublish size={Size.iconSize} color={Colors.white} />
                            <VnrText
                                style={[styleSheets.lable, styles.groupButton__text]}
                                i18nKey={'HRM_Common_Save'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    groupButton: {
        flexGrow: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: styleSheets.p_10,
        backgroundColor: Colors.white,
        marginTop: 10,
        marginBottom: 10
    },
    groupButton__button_save: {
        height: Size.heightButton,
        borderRadius: styleSheets.radius_5,
        backgroundColor: Colors.primary,
        flex: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    groupButton__text: {
        marginLeft: 5,
        color: Colors.white
    }
});
