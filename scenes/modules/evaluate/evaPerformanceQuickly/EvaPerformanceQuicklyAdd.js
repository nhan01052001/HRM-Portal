import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    Colors,
    styleSafeAreaView,
    stylesListPickerControl,
    styleValid,
    styleButtonAddOrEdit,
    Size,
    CustomStyleSheet
} from '../../../../constants/styleConfig';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import VnrPickerMulti from '../../../../components/VnrPickerMulti/VnrPickerMulti';
import VnrText from '../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../components/VnrTextInput/VnrTextInput';
import VnrDate from '../../../../components/VnrDate/VnrDate';
import { translate } from '../../../../i18n/translate';
import { ToasterSevice } from '../../../../components/Toaster/Toaster';
import { VnrLoadingSevices } from '../../../../components/VnrLoading/VnrLoadingPages';
import DrawerServices from '../../../../utils/DrawerServices';
import HttpService from '../../../../utils/HttpService';
import { dataVnrStorage } from '../../../../assets/auth/authentication';
import moment from 'moment';
import { EnumIcon } from '../../../../assets/constant';
import { AlertSevice } from '../../../../components/Alert/Alert';

export default class EvaPerformanceQuicklyAdd extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            Evaluator: {
                ID: null,
                ProfileName: ''
            },
            DateEvaluation: {
                value: new Date(),
                refresh: false
            },
            ProfileIDs: {
                disable: false,
                refresh: false,
                value: null,
                data: []
            },
            KPIName: {
                disable: false,
                refresh: false,
                value: null,
                data: []
            },
            ListKPIEva: [],
            fieldValid: {}
        };

        //data hidden
        this.ProfileIDMulti = null;
        this.KPIIDMulti = null;
        this.ListProfileIDHide = null;
    }

    //get config valid
    getConfigValid = (tblName) => {
        return HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + tblName);
    };

    componentDidMount() {
        //get config validate
        this.getConfigValid('New_Potal_New_PerformanceQuickly').then((res) => {
            if (res) {
                try {
                    let profile = dataVnrStorage
                            ? dataVnrStorage.currentUser
                                ? dataVnrStorage.currentUser.info
                                : null
                            : null,
                        nextState = {
                            fieldValid: res,
                            Evaluator: {
                                ID: profile['ProfileID'],
                                ProfileName: profile['FullName']
                            }
                        };

                    this.setState({ ...nextState }, () => {
                        this.getListProfileForEvaluation();
                    });
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            }
        });
    }

    //GetListProfileForEvaluation
    getListProfileForEvaluation = () => {
        const { DateEvaluation, Evaluator, ProfileIDs } = this.state;

        HttpService.Post('[URI_HR]//Eva_GetData/GetListProfileForEvaluation', {
            timeEvalua: moment(DateEvaluation.value).format('YYYY-MM-DD HH:mm:ss'),
            lstProfileID: Evaluator.ID
        }).then((data) => {
            let toArray = [];

            if (data && Array.isArray(data)) {
                toArray = data.map((item) => {
                    return { ID: item.ID, ProfileName: item.ProfileName };
                });

                this.ProfileIDMulti = data.map((item) => item.ID).join();
            }

            this.setState(
                {
                    ProfileIDs: {
                        ...ProfileIDs,
                        data: [...toArray],
                        refresh: !ProfileIDs.refresh
                    }
                },
                () => {
                    // để THUC HIEN CHANGE control người đánh giá và ngày đánh giá để lấy tiêu chí
                    this.changeGetKpiOfControl();
                }
            );
        });
    };

    //change ngày đánh giá
    onDateChangeDateEvaluation = (value) => {
        const { DateEvaluation } = this.state;

        this.setState(
            {
                DateEvaluation: {
                    ...DateEvaluation,
                    value: value
                }
            },
            () => {
                this.getListProfileForEvaluation();
            }
        );
    };

    //change nhân viên
    onDateChangeProfileIDs = (items, payload) => {
        if (payload && payload.isClose === true) {
            return;
        }

        const { ProfileIDs } = this.state;
        this.setState(
            {
                ProfileIDs: {
                    ...ProfileIDs,
                    value: items
                }
            },
            () => {
                this.changeGetKpiOfControl();
            }
        );
    };

    //change tiêu chí - KPIName
    onChangeKPIName = (items) => {
        const { KPIName } = this.state;
        this.setState({
            KPIName: {
                ...KPIName,
                value: items,
                refresh: !KPIName.refresh
            }
        });
    };

    changeGetKpiOfControl = (data) => {
        const { DateEvaluation, Evaluator, ProfileIDs } = this.state;
        if (
            !DateEvaluation.value ||
            !Evaluator.ID ||
            !ProfileIDs.data ||
            (ProfileIDs.data && ProfileIDs.data.length == 0)
        )
            return;

        let params = {
            lstProfileMulti: this.ProfileIDMulti
        };

        if (ProfileIDs.value) {
            params = {
                lstProfileMulti: ProfileIDs.value.map((item) => item.ID).join()
            };
        }

        if (data) {
            const {
                orgStructure,
                ContractType,
                EmployeeType,
                JobTitle,
                MaxSeniority,
                MinSeniority,
                Position,
                WorkPlace
            } = data;

            params = {
                ...params,
                orgStructureID: orgStructure.value ? orgStructure.value.map((item) => item.ID).join() : null,
                jobTitleID: JobTitle.value ? JobTitle.value.map((item) => item.ID).join() : null,
                positionID: Position.value ? Position.value.map((item) => item.ID).join() : null,
                workPlaceID: WorkPlace.value ? WorkPlace.value.map((item) => item.ID).join() : null,
                employeeType: EmployeeType.value ? EmployeeType.value.map((item) => item.ID).join() : null,
                maxSeniority: MaxSeniority.value,
                minSeniority: MinSeniority.value,
                contractTypeName: ContractType.value ? ContractType.value.map((item) => item.ID).join() : null
            };
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Eva_GetData/GetLisKPIForEvaluation', params).then((data) => {
            VnrLoadingSevices.hide();

            try {
                let IdData = [],
                    IdDataProfile = [],
                    { KPIName } = this.state,
                    nextState = {
                        KPIName: {
                            ...KPIName,
                            value: [],
                            data: [],
                            refresh: !KPIName.refresh
                        }
                    };

                if (data.lstKPIMulti != null) {
                    nextState = {
                        KPIName: {
                            ...KPIName,
                            data: [...data.lstKPIMulti],
                            refresh: !KPIName.refresh
                        }
                    };

                    for (let i = 0; i < data.lstKPIMulti.length; i++) {
                        IdData.push(data.lstKPIMulti[i].ID);
                    }
                    for (let i = 0; i < data.lstProfileID.length; i++) {
                        IdDataProfile.push(data.lstProfileID[i]);
                    }

                    this.KPIIDMulti = IdData.join(',');
                    this.ListProfileIDHide = IdDataProfile.join(',');
                }

                this.setState({ ...nextState });
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    //add tiêu chí
    addKPI = () => {
        const { KPIName } = this.state,
            { value } = KPIName;

        if (!value || value.length === 0) {
            ToasterSevice.showWarning('HRM_Portal_KPIName');
            return;
        }

        const { ProfileIDs } = this.state;

        let valProd = ProfileIDs.value;

        if (valProd && valProd.length) {
            this.GetListEvaKPI();
        }
        //confirm nếu k chọn Profiles
        else {
            AlertSevice.alert({
                iconType: EnumIcon.E_CONFIRM,
                message: translate('HRM_Eva_All_Employees_MeetingCondition'),
                onCancel: () => {},
                onConfirm: () => {
                    this.GetListEvaKPI();
                }
            });
        }
    };

    GetListEvaKPI = () => {
        const { ProfileIDs, DateEvaluation, Evaluator, ListKPIEva, KPIName } = this.state;

        let params = {
            lstKpi: KPIName.value.map((item) => item.ID).join(),
            ProfileID: ProfileIDs.value ? ProfileIDs.value.map((item) => item.ID).join() : null,
            ProfileIDHide: this.ListProfileIDHide,
            DateEvaluation: DateEvaluation.value ? moment(DateEvaluation.value).format('YYYY-MM-DD HH:mm:ss') : null,
            EvaluatorID: Evaluator.ID
        };

        HttpService.Post('[URI_HR]//Eva_MultiSelect/GetListEvaKPI', params).then((data) => {
            if (data.length > 0) {
                let toListNotExist = [];

                //check kpi exist
                if (ListKPIEva.length) {
                    let arrID = ListKPIEva.map((item) => item.ID);

                    data.forEach((item) => {
                        if (!arrID.includes(item.ID)) {
                            toListNotExist = [{ ...item }, ...toListNotExist];
                        }
                    });
                } else {
                    toListNotExist = [...data];
                }

                this.setState({
                    ListKPIEva: [...toListNotExist, ...ListKPIEva],
                    KPIName: {
                        ...KPIName,
                        value: [],
                        refresh: !KPIName.refresh
                    }
                });
            } else {
                ToasterSevice.showWarning('DuplicateData');
            }
        });
    };

    initListKPIEva = () => {
        const { ListKPIEva } = this.state,
            { textLableInfo, contentViewControl, viewLable, viewControl } = stylesListPickerControl;

        return ListKPIEva.map((_item, index) => {
            const item = _item;
            let viewFormControlTarget = <View />,
                viewFormControlActual = <View />,
                viewFormControlScore = <View />,
                viewFormControlTime = <View />;

            if (item.FormOfCaculation === 'E_SATISFACTORYDAYRATE') {
                viewFormControlTarget = (
                    <View style={contentViewControl}>
                        <View style={viewLable}>
                            <VnrText
                                style={[styleSheets.text, textLableInfo]}
                                i18nKey={'HRM_Evaluation_PerformanceDetail_Value'}
                            />
                        </View>

                        <View style={viewControl}>
                            <VnrTextInput
                                value={item.Target ? item.Target : ''}
                                keyboardType={'numeric'}
                                charType={'double'}
                                returnKeyType={'done'}
                                onChangeText={(value) => {
                                    item['Target'] = value;
                                    this.setState({ ListKPIEva });
                                }}
                            />
                        </View>
                    </View>
                );
                viewFormControlActual = (
                    <View style={contentViewControl}>
                        <View style={viewLable}>
                            <VnrText
                                style={[styleSheets.text, textLableInfo]}
                                i18nKey={'HRM_Evaluation_PerformanceDetail_Value2'}
                            />
                        </View>

                        <View style={viewControl}>
                            <VnrTextInput
                                value={item.Actual ? item.Actual : ''}
                                keyboardType={'numeric'}
                                charType={'double'}
                                returnKeyType={'done'}
                                onChangeText={(value) => {
                                    item['Actual'] = value;
                                    this.setState({ ListKPIEva });
                                }}
                            />
                        </View>
                    </View>
                );
            } else if (item.FormOfCaculation === 'E_TIMES') {
                viewFormControlTime = (
                    <View style={contentViewControl}>
                        <View style={viewLable}>
                            <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'FormOfCalculation__E_TIMES'} />
                        </View>

                        <View style={viewControl}>
                            <VnrTextInput
                                value={item.Time ? item.Time : ''}
                                keyboardType={'numeric'}
                                charType={'double'}
                                returnKeyType={'done'}
                                onChangeText={(value) => {
                                    item['Time'] = value;
                                    this.setState({ ListKPIEva });
                                }}
                            />
                        </View>
                    </View>
                );
            } else {
                // Score - Null
                viewFormControlScore = (
                    <View style={contentViewControl}>
                        <View style={viewLable}>
                            <VnrText
                                style={[styleSheets.text, textLableInfo]}
                                i18nKey={'HRM_Evaluation_PerformanceDetail_Mark'}
                            />
                        </View>

                        <View style={viewControl}>
                            <VnrTextInput
                                value={item.Score ? item.Score : ''}
                                keyboardType={'numeric'}
                                charType={'double'}
                                returnKeyType={'done'}
                                onChangeText={(value) => {
                                    item['Score'] = value;
                                    this.setState({ ListKPIEva });
                                }}
                            />
                        </View>
                    </View>
                );
            }

            return (
                <View key={index} style={styles.styViewContentControl}>
                    {/* Tiêu chí - KPI */}
                    <View style={contentViewControl}>
                        <View style={viewControl}>
                            <VnrText style={[styleSheets.text]} i18nKey={item.KPIName} />
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                const { ListKPIEva } = this.state;

                                if (ListKPIEva.length == 1) {
                                    this.setState({ ListKPIEva: [] });
                                } else {
                                    //find index item in array
                                    let index = ListKPIEva.map((item) => item.ID).indexOf(item.ID);

                                    ListKPIEva.splice(index, 1);

                                    this.setState({ ListKPIEva: [...ListKPIEva] });
                                }
                            }}
                        >
                            <VnrText
                                style={[styleSheets.text, { color: Colors.danger }]}
                                i18nKey={'HRM_System_Resource_Sys_Delete'}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Chỉ tiêu - Target */}
                    {viewFormControlTarget}

                    {/* Thực đạt - Actual */}
                    {viewFormControlActual}

                    {/* Điểm - Score */}
                    {viewFormControlScore}

                    {/* So lan - Time */}
                    {viewFormControlTime}

                    {/* Ghi chú - Comment */}
                    <View style={contentViewControl}>
                        <View style={viewLable}>
                            <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'Notes'} />
                        </View>

                        <View style={viewControl}>
                            <VnrTextInput
                                //height={70}
                                value={item.Comment}
                                onChangeText={(value) => {
                                    item['Comment'] = value;
                                    this.setState({ ListKPIEva });
                                }}
                                multiline={true}
                                numberOfLines={5}
                                returnKeyType={'done'}
                            />
                        </View>
                    </View>
                </View>
            );
        });
    };

    //Lưu - saveEva
    saveEva = () => {
        let lstPostdata = [],
            arrProfileHide = this.ListProfileIDHide;

        if (arrProfileHide != null && arrProfileHide.length > 0) {
            let lstId = arrProfileHide.split(',');

            const { ListKPIEva, Evaluator, DateEvaluation } = this.state;
            for (var i = 0; i < lstId.length; i++) {
                ListKPIEva.forEach((item) => {
                    let obj = {
                        ...item,
                        Comment: item.Comment,
                        KPIID: item.ID,
                        ID: null,
                        EvaluatorID: Evaluator.ID,
                        DateEvaluation: DateEvaluation.value
                            ? moment(DateEvaluation.value).format('YYYY-MM-DD HH:mm:ss')
                            : null,
                        ProfileID: lstId[i]
                    };
                    lstPostdata.push(obj);
                });
            }
            HttpService.Post(
                '[URI_HR]/Eva_GetData/CreateOrDupdateForEvaluationQuickly',
                JSON.stringify(lstPostdata)
            ).then((data) => {
                if (data.success == false) {
                    ToasterSevice.showWarning(data.messageNotify);
                } else {
                    ToasterSevice.showSuccess(data.messageNotify);

                    const { reloadTabProfile, reloadTabKPI } = this.props.navigation.state.params;
                    if (reloadTabProfile && typeof reloadTabProfile === 'function') {
                        reloadTabProfile();
                    }
                    if (reloadTabKPI && typeof reloadTabKPI === 'function') {
                        reloadTabKPI();
                    }

                    DrawerServices.goBack();
                }
            });
        } else {
            ToasterSevice.showWarning('HRM_Process_NoDataYet');
        }
    };

    render() {
        const { Evaluator, DateEvaluation, ProfileIDs, KPIName, ListKPIEva, fieldValid } = this.state;

        const { textLableInfo, contentViewControl, viewLable, viewControl } = stylesListPickerControl;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    <KeyboardAwareScrollView contentContainerStyle={CustomStyleSheet.flexGrow(1)}>
                        <View style={styles.styleViewTitleGroup}>
                            <VnrText
                                style={[styleSheets.text, styles.textLableGroup]}
                                i18nKey={'HRM_HR_Contract_EvaContractInfo'}
                            />
                        </View>

                        {/* Người đánh giá - Evaluator */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText
                                    style={[styleSheets.text, textLableInfo]}
                                    i18nKey={'HRM_Evaluation_EvaluatorIDs'}
                                />

                                {/* valid EvaluatorID */}
                                {fieldValid.EvaluatorID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                            </View>
                            <View style={viewControl}>
                                <VnrTextInput disable={true} value={Evaluator.ProfileName} />
                            </View>
                        </View>

                        {/* Ngày đánh giá - DateEvaluation */}
                        {
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Evaluation_PerformanceEva_DateEva'}
                                    />

                                    {/* valid DateEvaluation */}
                                    {fieldValid.DateEvaluation && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={DateEvaluation.value}
                                        refresh={DateEvaluation.refresh}
                                        type={'date'}
                                        onFinish={(value) => this.onDateChangeDateEvaluation(value)}
                                    />
                                </View>
                            </View>
                        }

                        {/* Nhân viên - ProfileIDs */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText
                                    style={[styleSheets.text, textLableInfo]}
                                    i18nKey={'HRM_Evaluation_Eva_PerformancePerDay_ProfileID'}
                                />

                                {/* valid LeaveDayTypeID */}
                                {fieldValid.LeaveDayTypeID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                            </View>
                            <View style={viewControl}>
                                <VnrPickerMulti
                                    dataLocal={ProfileIDs.data}
                                    value={ProfileIDs.value}
                                    refresh={ProfileIDs.refresh}
                                    textField="ProfileName"
                                    valueField="ID"
                                    filter={true}
                                    filterServer={false}
                                    onFinish={(items, payload) => this.onDateChangeProfileIDs(items, payload)}
                                />
                            </View>
                        </View>

                        {/* Chọn thêm - ChoseMore */}
                        <View style={styles.viewMoreDetail}>
                            <TouchableOpacity
                                onPress={() => {
                                    DrawerServices.navigate('EvaPerformanceQuicklyAddChoseMore', {
                                        dataConfirm: this.state,
                                        changeGetKpiOfControl: this.changeGetKpiOfControl
                                    });
                                }}
                            >
                                <Text style={[styleSheets.text, styles.styleShowMore]}>
                                    {`${translate('HRM_Common_ChoseMore_Info')}`}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.styleViewTitleGroup}>
                            <VnrText
                                style={[styleSheets.text, styles.textLableGroup]}
                                i18nKey={'HRM_Evaluation_Eva_KPI'}
                            />
                        </View>

                        {/* Tiêu chí - KPIName */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText
                                    style={[styleSheets.text, textLableInfo]}
                                    i18nKey={'Hrm_Sal_EvaluationOfSalaryApprove_Criteria'}
                                />

                                {/* valid KPIName */}
                                {fieldValid.KPIName && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                            </View>
                            <View style={viewControl}>
                                <View style={styles.styFlex8Row}>
                                    <VnrPickerMulti
                                        dataLocal={KPIName.data}
                                        value={KPIName.value}
                                        refresh={KPIName.refresh}
                                        textField="KPIName"
                                        valueField="ID"
                                        filter={true}
                                        filterServer={false}
                                        onFinish={(items) => this.onChangeKPIName(items)}
                                    />
                                </View>

                                {/* button Add */}
                                <View style={styles.styViewBtnAdd}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.addKPI();
                                        }}
                                        style={styles.bnt_More}
                                    >
                                        <VnrText
                                            style={[styleSheets.text, { color: Colors.white }]}
                                            i18nKey={'HRM_Common_SearchAdd'}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style={styles.styleViewTitleGroup}>
                            <VnrText
                                style={[styleSheets.text, styles.textLableGroup]}
                                i18nKey={'HRM_Evaluation_PerformanceDetail_Evaluation'}
                            />
                        </View>

                        <View style={CustomStyleSheet.flex(1)}>
                            {ListKPIEva.length ? (
                                this.initListKPIEva()
                            ) : (
                                <VnrText
                                    style={[styleSheets.text, { padding: Size.defineSpace }]}
                                    i18nKey={'Hrm_Sal_EvaluationOfSalaryApprove_EmptyData'}
                                />
                            )}
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
                            onPress={() => this.saveEva()}
                            style={styleButtonAddOrEdit.groupButton__button_save}
                        >
                            <VnrText
                                style={[styleSheets.lable, styleButtonAddOrEdit.groupButton__text]}
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
    styFlex8Row: { flex: 8, flexDirection: 'row' },
    styViewBtnAdd: { flex: 2, flexDirection: 'row', marginLeft: 5 },
    styViewContentControl: {
        paddingVertical: 10,
        borderRadius: 10,
        borderColor: Colors.green_3
    },
    viewMoreDetail: {
        minHeight: 10,
        padding: Size.defineSpace
    },
    bnt_More: {
        backgroundColor: Colors.info,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7,
        height: Size.heightInput
    },

    styleShowMore: {
        color: Colors.primary,
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
        textDecorationColor: Colors.primary
    },
    textLableGroup: {
        textTransform: 'uppercase',
        color: Colors.primary,
        fontWeight: '500'
    },
    styleViewTitleGroup: {
        width: Size.deviceWidth - Size.defineSpace * 2,
        marginHorizontal: Size.defineSpace,
        borderBottomColor: Colors.primary,
        borderBottomWidth: 1,
        paddingVertical: 10,
        // marginTop: -1,
        backgroundColor: Colors.white

        // alignItems:'center'
    }
});
