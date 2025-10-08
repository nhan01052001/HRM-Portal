import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors, CustomStyleSheet, Size, styleSheets } from '../../../../../constants/styleConfig';
import VnrSwitch from '../../../../../componentsV3/VnrSwitch/VnrSwitch';
import { translate } from '../../../../../i18n/translate';
import { IconPlus, IconRemoveUser, IconUserSetting } from '../../../../../constants/Icons';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrPickerLittle from '../../../../../componentsV3/VnrPickerLittle/VnrPickerLittle';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { EnumIcon, EnumName } from '../../../../../assets/constant';
import HttpService from '../../../../../utils/HttpService';
import VnrSuperFilterWithTextInputUserApprover from '../../../../../componentsV3/VnrSuperFilterWithTextInput/VnrSuperFilterWithTextInputUserApprover';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';

const initSateDefault = {
    setUpProcess: {
        refresh: false,
        disable: false,
        value: false,
        visible: false,
        visibleConfig: true
    },
    ProfileID2: {
        label: 'HRM_PortalApp_ReplacementStaff',
        disable: false,
        refresh: false,
        value: [],
        visible: true,
        visibleConfig: true,
        isValid: false
    },
    Template: {
        label: 'Chọn quy trình mẫu',
        visible: true,
        visibleConfig: true,
        refresh: false,
        value: null,
        data: [
            {
                Text: 'Trả tiền',
                Value: 'E_CASHOUT',
                Number: 1
            },
            {
                Text: 'Nghỉ bù',
                Value: 'E_TIMEOFF',
                Number: 2
            },
            {
                Text: 'Trả tiền và nghỉ bù',
                Value: 'E_CASHOUT_TIMEOFF',
                Number: 3
            }
        ]
    },
    listApprove: ['Proposer'],
    Proposer: {
        label: 'Người lập đề xuất',
        disable: false,
        refresh: false,
        value: [],
        visible: true,
        visibleConfig: true,
        isProposer: true
    },
    DataApprove: [],
    dataUserApprover: [],
    listTemplate: []
};

class AttSubmitWorkingOvertimeApprovalProcess extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initSateDefault
        };

        this.refEmp = {};
        this.refStep = {};
    }

    GetDataPropose = () => {
        try {
            VnrLoadingSevices.show();
            HttpService.MultiRequest([
                HttpService.Post('[URI_CENTER]/api/Sys_Common/GetDataPropose', {
                    Bussiness: 'E_OVERTIMEFORM'
                }),
                HttpService.Post('[URI_CENTER]/api/Sys_Common/GetMultiUserApproveByType', {
                    page: 1,
                    pageSize: 100,
                    IsExclude: true,
                    Type: 'E_OVERTIMEFORM'
                })
            ]).then((resAll) => {
                VnrLoadingSevices.hide();
                const [res1, res2] = resAll;
                let nextState = {};
                if (res1?.Status === EnumName.E_SUCCESS) {
                    if (Array.isArray(res1?.Data?.DataApprove)) {
                        nextState = {
                            ...nextState,
                            DataApprove: [...res1?.Data?.DataApprove]
                        };
                    }
                } else {
                    nextState = {
                        ...nextState,
                        DataApprove: []
                    };
                }

                if (res2?.Status === EnumName.E_SUCCESS && res2?.Data?.Data?.length > 0) {
                    nextState = {
                        ...nextState,
                        dataUserApprover: res2?.Data?.Data
                    };
                } else {
                    nextState = {
                        ...nextState,
                        dataUserApprover: []
                    };
                }

                this.setState({ ...nextState });
            });
        } catch (error) {
            VnrLoadingSevices.hide();
            this.setState({
                DataApprove: [],
                dataUserApprover: []
            });
        }
    };

    // Cập nhật danh sách người duyệt cho một cấp duyệt cụ thể theo index
    // Bảo toàn cấu trúc DataApprove và chỉ thay trường EmployeeInfo
    updateApproverAtIndex = (rowIndex, listItem) => {
        try {
            const { DataApprove } = this.state;
            const next = Array.isArray(DataApprove) ? [...DataApprove] : [];
            if (rowIndex != null && next[rowIndex]) {
                next[rowIndex] = {
                    ...next[rowIndex],
                    EmployeeInfo: Array.isArray(listItem) ? [...listItem] : []
                };
                this.setState({ DataApprove: next });
            }
        } catch (e) {}
    };

    GetManagementConfigMulti = () => {
        try {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_CENTER]/api/Sys_Common/GetManagementConfigMulti', {
                Bussiness: 'E_OVERTIMEFORM'
            }).then((res) => {
                VnrLoadingSevices.hide();
                if (res?.Status === EnumName.E_SUCCESS && res?.Data?.[0]?.ListChild?.length > 0) {
                    this.setState({
                        Template: {
                            ...this.state.Template,
                            data: res?.Data?.[0]?.ListChild,
                            refresh: !this.state.Template.refresh
                        }
                    });
                }
            });
        } catch (error) {
            VnrLoadingSevices.hide();
            this.setState({
                Template: {
                    ...this.state.Template,
                    data: [],
                    refresh: !this.state.Template.refresh
                }
            });
        }
    };

    GetDataApproveByConfigID = (ID = null) => {
        if (!ID) return;
        try {
            VnrLoadingSevices.show();
            HttpService.Get(`[URI_CENTER]/api/Sys_Common/GetDataApproveByConfigID?ID=${ID}`).then((res) => {
                let nextState = {};
                if (res?.Status === EnumName.E_SUCCESS) {
                    if (Array.isArray(res?.Data)) {
                        nextState = {
                            ...nextState,
                            DataApprove: [...res?.Data]
                        };
                    }
                } else {
                    nextState = {
                        ...nextState,
                        DataApprove: []
                    };
                }

                this.setState({
                    ...nextState
                });
            });
        } catch (error) {
            VnrLoadingSevices.hide();
            this.setState({
                DataApprove: [...this.state.DataApprove]
            });
        }
    };

    componentDidMount() {
        this.GetDataPropose();
    }

    render() {
        const { setUpProcess, Template, listApprove, DataApprove, dataUserApprover } = this.state;

        return (
            <View style={[CustomStyleSheet.flex(1), CustomStyleSheet.backgroundColor(Colors.white)]}>
                <View style={CustomStyleSheet.backgroundColor(Colors.white)}>
                    <VnrSwitch
                        lable={'Thiết lập quy trình'}
                        subLable={translate('Sử dụng quy trình có sẵn?')}
                        value={setUpProcess.value}
                        onFinish={(value) => {
                            let nextState = {};
                            if (!value) {
                                nextState = {
                                    Template: {
                                        ...Template,
                                        value: null,
                                        refresh: !Template.refresh
                                    }
                                };
                            }
                            this.setState(
                                {
                                    ...nextState,
                                    setUpProcess: {
                                        ...setUpProcess,
                                        value,
                                        refresh: !setUpProcess.refresh
                                    }
                                },
                                () => {
                                    if (value) {
                                        this.GetManagementConfigMulti();
                                    } else {
                                        this.GetDataPropose();
                                    }
                                }
                            );
                        }}
                    />
                </View>

                {setUpProcess.value && (
                    <View
                        style={[
                            CustomStyleSheet.borderBottomWidth(0.5),
                            CustomStyleSheet.borderBottomColor(Colors.gray_5),
                            CustomStyleSheet.marginBottom(12),
                            CustomStyleSheet.marginHorizontal(12)
                        ]}
                    >
                        <VnrPickerLittle
                            isNewUIValue={true}
                            refresh={Template.refresh}
                            dataLocal={Template.data}
                            value={Template.value}
                            textField="ManagementConfigCodeName"
                            valueField="ID"
                            filter={false}
                            disable={Template.disable}
                            lable={Template.label}
                            stylePicker={styles.resetBorder}
                            isChooseQuickly={true}
                            onFinish={(item) => {
                                this.setState(
                                    {
                                        Template: {
                                            ...Template,
                                            value: item ? { ...item } : null,
                                            refresh: !Template.refresh
                                        }
                                    },
                                    () => {
                                        this.GetDataApproveByConfigID(item?.ID);
                                    }
                                );
                            }}
                        />
                    </View>
                )}

                {/* --- Block người lập đề xuất --- */}
                <View style={CustomStyleSheet.paddingHorizontal(12)}>
                    {Array.isArray(DataApprove) &&
                        DataApprove.map((item, index) => {
                            return (
                                <View key={index}>
                                    <View style={styles.proposerContainer}>
                                        <View style={styles.proposerHeader}>
                                            <View style={styles.proposerTitleWrapper}>
                                                <Text numberOfLines={1} style={styles.proposerTitle}>
                                                    {item?.ExecutionStepView ?? ''}
                                                </Text>
                                            </View>

                                            <View style={styles.actionButtons}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        // if (
                                                        //     typeof this.refStep?.[`${item ?? index}`]?.opentModal ===
                                                        //     'function'
                                                        // ) {
                                                        //     this.refStep?.[`${item ?? index}`]?.opentModal();
                                                        // }
                                                    }}
                                                    disabled={!item?.IsEdit}
                                                    activeOpacity={0.7}
                                                    style={styles.btnSetting}
                                                >
                                                    <IconUserSetting size={14} color={Colors.black} />
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    disabled={!item?.IsDelete}
                                                    onPress={() => {
                                                        AlertSevice.alert({
                                                            iconType: EnumIcon.E_WARNING,
                                                            title: 'Bạn có chắc muốn xoá dữ liệu?',
                                                            textLeftButton: 'Huỷ',
                                                            textRightButton: 'Đồng ý xoá',
                                                            message: null,
                                                            onCancel: () => {},
                                                            onConfirm: () => {
                                                                this.setState({
                                                                    listApprove:
                                                                        listApprove?.length > 0
                                                                            ? listApprove.filter(
                                                                                  (value) => value !== item
                                                                              )
                                                                            : [],
                                                                    [item]: null
                                                                });
                                                            }
                                                        });
                                                    }}
                                                    activeOpacity={0.7}
                                                    style={styles.btnRemove}
                                                >
                                                    <IconRemoveUser size={14} color={Colors.white} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        {item?.EmployeeInfo?.length > 0 ? (
                                            item?.EmployeeInfo?.map((emp) => {
                                                return (
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            const ref = this.refEmp[index];
                                                            if (ref && typeof ref.opentModal === 'function') {
                                                                ref.opentModal();
                                                            }
                                                        }}
                                                        activeOpacity={0.7}
                                                        style={styles.userInfoRow}
                                                    >
                                                        {Vnr_Function.renderAvatarCricleByName(emp?.ImagePath, 'A', 44)}
                                                        <View style={styles.userInfoWrapper}>
                                                            <View style={CustomStyleSheet.flex(1)}>
                                                                <Text
                                                                    numberOfLines={2}
                                                                    style={[styleSheets.subTitleApprover]}
                                                                >
                                                                    <Text
                                                                        style={[
                                                                            styleSheets.detailNameApprover,
                                                                            !emp?.ProfileName && styles.noValueText
                                                                        ]}
                                                                    >
                                                                        {emp?.ProfileName ?? translate('SELECT_ITEM')}
                                                                    </Text>
                                                                </Text>
                                                            </View>
                                                            <Text
                                                                numberOfLines={1}
                                                                style={[styleSheets.detailPositionApprover]}
                                                            >
                                                                {emp?.PositionName ?? ''}
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                );
                                            })
                                        ) : (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    // if (typeof this.refEmp?.[`${item ?? index}`]?.opentModal === 'function') {
                                                    //     this.refEmp?.[`${item ?? index}`]?.opentModal();
                                                    // }
                                                }}
                                                activeOpacity={0.7}
                                                style={styles.userInfoRow}
                                            >
                                                {Vnr_Function.renderAvatarCricleByName(null, 'A', 44)}
                                                <View style={styles.userInfoWrapper}>
                                                    <View style={CustomStyleSheet.flex(1)}>
                                                        <Text numberOfLines={2} style={[styleSheets.subTitleApprover]}>
                                                            <Text
                                                                style={[
                                                                    styleSheets.detailNameApprover,
                                                                    !this.state[item]?.value[0]?.Name &&
                                                                        styles.noValueText
                                                                ]}
                                                            >
                                                                {this.state[item]?.value[0]?.Name ??
                                                                    translate('SELECT_ITEM')}
                                                            </Text>
                                                        </Text>
                                                    </View>
                                                    <Text
                                                        numberOfLines={1}
                                                        style={[styleSheets.detailPositionApprover]}
                                                    >
                                                        {this.state[item]?.value[0]?.PositionName ?? ''}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                        <View
                                            style={{
                                                position: 'absolute',
                                                bottom: -Size.deviceheight
                                            }}
                                        >
                                            <VnrSuperFilterWithTextInputUserApprover
                                                ref={(ref) => (this.refEmp[index] = ref)}
                                                lable={item?.ExecutionStepView ?? ''}
                                                value={item?.EmployeeInfo?.length > 0 ? item?.EmployeeInfo : []}
                                                fieldValid={true}
                                                onFinish={(listItem) => {
                                                    this.updateApproverAtIndex(index, listItem);
                                                }}
                                                refresh={false}
                                                dataLocal={dataUserApprover}
                                                filterParams={'ProfileName'}
                                                textField={'ProfileName'}
                                                textFieldFilter={'FormatProfileCodeLogin'}
                                                valueField={'ID'}
                                                filter={true}
                                                autoFilter={true}
                                                filterServer={false}
                                                response={'string'}
                                                placeholder={'SELECT_ITEM'}
                                                // isChooseOne={true}
                                                licensedDisplay={[
                                                    {
                                                        Name: ['ProfileName'],
                                                        Avatar: ['ImagePath'],
                                                        UnderName: [
                                                            'PositionName',
                                                            'HRM_PortalApp_ContractHistory_Position'
                                                        ]
                                                    }
                                                ]}
                                            />
                                        </View>
                                    </View>
                                    {/* --- Line dashed --- */}
                                    <View style={styles.lineDashedWrapper}>
                                        <View style={styles.lineDashed} />
                                    </View>
                                </View>
                            );
                        })}
                </View>

                {/* --- Add step button --- */}
                <View style={[CustomStyleSheet.flex(1), CustomStyleSheet.paddingHorizontal(12)]}>
                    <TouchableOpacity
                        onPress={() => {
                            const count = listApprove.filter((item) => item.startsWith('UserApprove')).length;
                            const newItem = count === 0 ? 'UserApprove' : `UserApprove${count}`;
                            this.setState({
                                listApprove: [...listApprove, newItem],
                                [newItem]: {
                                    label: 'Người xem xét / Thẩm định',
                                    disable: false,
                                    refresh: false,
                                    value: [],
                                    visible: true,
                                    visibleConfig: true,
                                    enum: 'E_REVIEWER'
                                }
                            });
                        }}
                        activeOpacity={0.7}
                        style={styles.buttonAddStep}
                    >
                        <IconPlus size={Size.iconSize} color={Colors.blue} />
                        <Text
                            style={[
                                styleSheets.text,
                                CustomStyleSheet.color(Colors.blue),
                                CustomStyleSheet.fontSize(16),
                                CustomStyleSheet.fontWeight('500'),
                                CustomStyleSheet.marginLeft(6)
                            ]}
                        >
                            Thêm bước thực hiện
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    proposerContainer: {
        padding: 12,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: Colors.gray_5
    },
    proposerHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    proposerTitleWrapper: {
        maxWidth: '75%'
    },
    proposerTitle: {
        fontSize: 16,
        fontWeight: '600'
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    btnSetting: {
        height: 32,
        width: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        backgroundColor: Colors.gray_4,
        marginRight: 6
    },
    btnRemove: {
        height: 32,
        width: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        backgroundColor: Colors.red,
        marginLeft: 6
    },
    userInfoRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8
    },
    userInfoWrapper: {
        flex: 1,
        marginLeft: Size.defineSpace - 4
    },
    lineDashedWrapper: {
        width: '100%',
        alignItems: 'center'
    },
    lineDashed: {
        height: 40,
        borderStyle: 'dashed',
        borderColor: Colors.blue,
        borderWidth: 1
    },
    buttonAddStep: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 12,
        backgroundColor: Colors.blue_transparent,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: Colors.blue
    },
    noValueText: {
        fontWeight: '400',
        color: Colors.gray_6
    }
    // wrapCurrentShift: {
    //     paddingHorizontal: Size.defineSpace,
    //     paddingVertical: Size.defineHalfSpace - 2,
    //     backgroundColor: Colors.gray_2,
    //     borderBottomColor: Colors.gray_5,
    //     borderBottomWidth: 0.5
    // },
    // chil_controlVnrSuperTextInput: {
    //     flex: 1,
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     alignItems: 'center'
    // },

    // chil_controlVnrSuperTextInput_left: {
    //     flex: 1,
    //     maxWidth: '50%',
    //     flexDirection: 'row',
    //     alignItems: 'center'
    // },

    // chil_controlVnrSuperTextInput_right: {
    //     flex: 1,
    //     maxWidth: '50%',
    //     alignItems: 'flex-end'
    // },
    // flex_Row_Ali_Center: {
    //     flexDirection: 'row',
    //     alignItems: 'center'
    // },

    // textImplementer: {
    //     fontSize: Size.text + 1,
    //     marginLeft: 6,
    //     color: Colors.blue,
    //     maxWidth: '90%'
    // }
});

export default AttSubmitWorkingOvertimeApprovalProcess;
