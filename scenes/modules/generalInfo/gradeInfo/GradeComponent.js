import React, { Component } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import VnrText from '../../../../components/VnrText/VnrText';
import { styleSheets, Colors } from '../../../../constants/styleConfig';
import { dataVnrStorage } from '../../../../assets/auth/authentication';
import HttpService from '../../../../utils/HttpService';
import DrawerServices from '../../../../utils/DrawerServices';

export default class GradeComponent extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            isLoading: true,
            dataAtt: null,
            dataSalary: null,
            dataInsurance: null
        };
    }

    getData = () => {
        const dataBody = {
                profileID: dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null
            },
            listRequest = [
                HttpService.Post('[URI_HR]/Att_GetData/GetGradeAttendanceByProfileID', dataBody),
                HttpService.Post('[URI_HR]/Ins_GetData/GetDataInsGradePortal', dataBody),
                HttpService.Post('[URI_HR]/Sal_GetData/GetGradeList', dataBody)
            ];

        HttpService.MultiRequest(listRequest, this.getData).then(resAll => {
            if (resAll && resAll.length > 2) {
                const [res1, res2, res3] = resAll;
                this.setState({
                    dataAtt: res1.Data && Array.isArray(res1.Data) && res1.Data.length > 0 ? res1.Data[0] : null,
                    dataInsurance: res2.Data && Array.isArray(res2.Data) && res1.Data.length > 0 ? res2.Data[0] : null,
                    dataSalary: res3.Data && Array.isArray(res3.Data) && res3.Data.length > 0 ? res3.Data[0] : null,
                    isLoading: false
                });
            } else {
                this.setState({
                    isLoading: false
                });
            }
        });
    };

    componentDidMount() {
        this.getData();
    }

    render() {
        const { isLoading, dataAtt, dataInsurance, dataSalary } = this.state,
            { styles, initLableValue } = this.props;
        return (
            <View style={styles.styBlock}>
                <View style={styles.styTopTitle}>
                    <View style={styles.styWrap}>
                        <VnrText style={[styleSheets.lable, styles.styTitle]} i18nKey={'HRM_Grade'} />
                    </View>
                    {isLoading ? (
                        <ActivityIndicator size={'small'} color={Colors.primary} />
                    ) : (
                        <TouchableOpacity
                            onPress={() => DrawerServices.navigate('GradeInfo')}
                            style={styles.styWrapRight}
                        >
                            <VnrText style={[styleSheets.text, styles.styTextDetail]} i18nKey={'HRM_Common_ViewMore'} />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.styViewData}>
                    {dataAtt != null &&
                        initLableValue(dataAtt, {
                            Name: 'GradeAttendanceName',
                            DisplayKey: 'HRM_Attendance',
                            DataType: 'string'
                        })}

                    {dataAtt != null &&
                        initLableValue(dataAtt, {
                            Name: 'MonthStart',
                            DisplayKey: 'DateOfEffect',
                            DataType: 'DateTime',
                            DataFormat: 'DD/MM/YYYY'
                        })}

                    {dataSalary != null &&
                        initLableValue(dataSalary, {
                            Name: 'GradeCfgName',
                            DisplayKey: 'HRM_Payroll',
                            DataType: 'string'
                        })}

                    {dataSalary != null &&
                        initLableValue(dataSalary, {
                            Name: 'MonthStart',
                            DisplayKey: 'DateOfEffect',
                            DataType: 'DateTime',
                            DataFormat: 'DD/MM/YYYY'
                        })}

                    {dataInsurance != null &&
                        initLableValue(dataInsurance, {
                            Name: 'InsuranceGradeName',
                            DisplayKey: 'HRM_HR_Profile_Insurance',
                            DataType: 'string'
                        })}

                    {dataInsurance != null &&
                        initLableValue(dataInsurance, {
                            Name: 'MonthOfEffect',
                            DisplayKey: 'DateOfEffect',
                            DataType: 'DateTime',
                            DataFormat: 'DD/MM/YYYY'
                        })}
                </View>
            </View>
        );
    }
}
