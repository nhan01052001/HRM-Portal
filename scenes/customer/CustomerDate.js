import React, { Component } from 'react';
import {
    StatusBar,
    FlatList,
    ScrollView,
    Image,
    View,
    StyleSheet,
    Animated,
    Platform,
    ImageBackground,
    TouchableOpacity,
    Text,
    RefreshControl
} from 'react-native';

import VnrDate from '../../componentsV3/VnrDate/VnrDate';
import VnrDateFromTo from '../../componentsV3/VnrDateFromTo/VnrDateFromTo';
import VnrYearPicker from '../../components/VnrYearPicker/VnrYearPicker';
import VnrPicker from '../../componentsV3/VnrPicker/VnrPicker';
import moment from 'moment';
import VnrLoadApproval from '../../componentsV3/VnrLoadApproval/VnrLoadApproval';

import AttSubmitTamScanLogRegisterAddOrEdit from '../modules/attendanceV3/attTamScanLogRegister/attSubmitTamScanLogRegister/AttSubmitTamScanLogRegisterAddOrEdit';

class CustomerDate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ShiftID: {
                label: 'HRM_Attendance_Overtime_ShiftID',
                data: [],
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            }
        };

        this.AttSubmitTamScanLogRegisterAddOrEdit = null;
    }

    onAddOrEdit = () => {
        //console.log(this.AttSubmitTamScanLogRegisterAddOrEdit, 'this.AttSubmitTamScanLogRegisterAddOrEdit');
        if (this.AttSubmitTamScanLogRegisterAddOrEdit && this.AttSubmitTamScanLogRegisterAddOrEdit.onShow) {
            this.AttSubmitTamScanLogRegisterAddOrEdit.onShow({
                reload: this.reload,
                // record: {
                //     "ProfileID": "c35096dc-4c0e-4ace-8c22-c08dff873083",
                //     "CodeEmp": "00490",
                //     "ProfileName": "TRẦN CÔNG HIẾU",
                //     "TimeLog": "2023-05-03T05:01:46Z",
                //     "Type": "E_OUT",
                //     "TypeView": "Ra",
                //     "Status": "E_SUBMIT_TEMP",
                //     "TimeLogOfWeek": "Thứ 4",
                //     "StatusView": "Lưu tạm",
                //     "Checked": false,
                //     "EmailSent": false,
                //     "TimeLogDate": "2023-05-02T17:00:00Z",
                //     "TimeLogTime": "2023-05-03T05:01:46Z",
                //     "UserSubmit": "c35096dc-4c0e-4ace-8c22-c08dff873083",
                //     "UserApproveID": "7eec8830-0358-4e10-859d-42a0db1869ca",
                //     "UserApproveID2": "23abbf7b-f763-4c43-8872-e0f3a4e23202",
                //     "UserApproveID3": "23abbf7b-f763-4c43-8872-e0f3a4e23202",
                //     "UserApproveID4": "23abbf7b-f763-4c43-8872-e0f3a4e23202",
                //     "UserApproveName": "Võ Đăng Toàn",
                //     "UserApproveName2": "Phạm Văn Hiển",
                //     "UserApproveName3": "Phạm Văn Hiển",
                //     "UserApproveName4": "Phạm Văn Hiển",
                //     "OrgStructureName": "SE.HRM HCM",
                //     "PositionName": "Nhân viên Lập trình",
                //     "JobTitleName": "Nhân viên",
                //     "WorkPlaceName": "Hồ Chí Minh",
                //     "E_UNIT": "VnR",
                //     "E_DIVISION": "HCM",
                //     "E_DEPARTMENT": "Product",
                //     "E_SECTION": "SE.HRM HCM",
                //     "E_UNIT_CODE": "VnR",
                //     "E_DIVISION_CODE": "HCM",
                //     "E_DEPARTMENT_CODE": "Product",
                //     "E_SECTION_CODE": "SE.HRM HCM",
                //     "OrgStructureID": "4d1600a6-9d62-4012-a9f8-0cf3ea448031",
                //     "PositionID": "0baeff0f-9e04-4e7f-96b2-139840e73eca",
                //     "DateExport": "0001-01-01T00:00:00Z",
                //     "JobTitleID": "dc56df9e-0abd-4a53-81ec-9d4646f6b34f",
                //     "WorkPlaceID": "1bc99349-54d3-43a8-bbba-4750dc1d62d1",
                //     "ProfileInfo": {
                //         "ProfileName": "TRẦN CÔNG HIẾU",
                //         "PositionName": "Nhân viên Lập trình",
                //         "OrgStructureName": "SE.HRM HCM",
                //         "ImagePath": "https://hrm10.vnresource.net:19006/Resources/ProfileImage//"
                //     },
                //     "DataRegister": {
                //         "TypeView": "Giờ ra",
                //         "TimeLog": "03/05/2023"
                //     },
                //     "DataTimeRegister": {
                //         "TimeLog": "12:01"
                //     },
                //     "DataStatus": {
                //         "Status": "E_SUBMIT_TEMP",
                //         "StatusView": "Lưu tạm",
                //         "ListDataApprove": [
                //             {
                //                 "FieldName": "UserApproveName1",
                //                 "ProfileName": "Võ Đăng Toàn",
                //                 "Image": "https://hrm10.vnresource.net:19006/Resources/ProfileImage/",
                //                 "Order": 1
                //             },
                //             {
                //                 "FieldName": "UserApproveName2",
                //                 "ProfileName": "Phạm Văn Hiển",
                //                 "Image": "https://hrm10.vnresource.net:19006/Resources/ProfileImage/2019-06-14_8-57-1716770370097551677037009756.jpg",
                //                 "Order": 2
                //             },
                //             {
                //                 "FieldName": "UserApproveName3",
                //                 "ProfileName": "Phạm Văn Hiển",
                //                 "Image": "https://hrm10.vnresource.net:19006/Resources/ProfileImage/2019-06-14_8-57-1716770370097551677037009756.jpg",
                //                 "Order": 3
                //             },
                //             {
                //                 "FieldName": "UserApproveName4",
                //                 "ProfileName": "Phạm Văn Hiển",
                //                 "Image": "https://hrm10.vnresource.net:19006/Resources/ProfileImage/2019-06-14_8-57-1716770370097551677037009756.jpg",
                //                 "Order": 4
                //             }
                //         ]
                //     },
                //     "AvatarUserApprove2": "2019-06-14_8-57-1716770370097551677037009756.jpg",
                //     "AvatarUserApprove3": "2019-06-14_8-57-1716770370097551677037009756.jpg",
                //     "AvatarUserApprove4": "2019-06-14_8-57-1716770370097551677037009756.jpg",
                //     "DateCreate": "2023-05-04T04:08:44.843Z",
                //     "DateUpdate": "2023-05-04T04:08:44.843Z",
                //     "TotalRow": 7,
                //     "ID": "28134507-c04b-4d73-852a-213383aa5a24",
                //     "UserUpdate": "hieu.tran",
                //     "UserCreate": "hieu.tran"
                // },
                record: null
            });
        }
    };

    onAddOrEditFromWorkDay = () => {
        //console.log(this.AttSubmitTamScanLogRegisterAddOrEdit, 'this.AttSubmitTamScanLogRegisterAddOrEdit');
        if (this.AttSubmitTamScanLogRegisterAddOrEdit && this.AttSubmitTamScanLogRegisterAddOrEdit.onShowFromWorkDay) {
            this.AttSubmitTamScanLogRegisterAddOrEdit.onShowFromWorkDay({
                reload: this.reload,
                record: null
            });
        }
    };

    componentDidMount() {
        // if (this.AttSubmitTamScanLogRegisterAddOrEdit && this.AttSubmitTamScanLogRegisterAddOrEdit.onShowFromWorkDay) {
        //     this.AttSubmitTamScanLogRegisterAddOrEdit.onShowFromWorkDay({
        //         reload: this.reload,
        //         record: null
        //     })
        // }
    }

    reload = () => {};

    render() {
        const { ShiftID } = this.state;

        return (
            <View style={styles.container}>
                {/* <VnrLoadApproval
                    api={{
                        urlApi: '[URI_HR]/Cat_GetData/GetMultiShiftByOrdernumber',
                        type: 'E_GET',
                    }}
                    refresh={ShiftID.refresh}
                    textField="ShiftName"
                    valueField="ID"
                    filter={true}
                    filterServer={false}
                    value={ShiftID.value}
                    disable={ShiftID.disable}
                    onFinish={(item) => console.log(item, 'item')}
                /> */}
                <TouchableOpacity onPress={() => this.onAddOrEdit()}>
                    <Text>Tạo mới quẹt thẻ</Text>
                </TouchableOpacity>
                <AttSubmitTamScanLogRegisterAddOrEdit
                    ref={refs => (this.AttSubmitTamScanLogRegisterAddOrEdit = refs)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
        // padding: 24,
    }
});

export default CustomerDate;
