import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors, CustomStyleSheet, Size, styleSheets } from '../../../../../constants/styleConfig';
import VnrSwitch from '../../../../../componentsV3/VnrSwitch/VnrSwitch';
import { translate } from '../../../../../i18n/translate';
import { IconPlus, IconRemoveUser, IconUserSetting } from '../../../../../constants/Icons';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrPickerLittle from '../../../../../componentsV3/VnrPickerLittle/VnrPickerLittle';
import VnrSuperFilterWithTextInput from '../../../../../componentsV3/VnrSuperFilterWithTextInput/VnrSuperFilterWithTextInput';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { EnumIcon } from '../../../../../assets/constant';

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
    }
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

    render() {
        const { setUpProcess, Template, listApprove } = this.state;
        console.log(this.state, 'this.state');
        
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
                            this.setState({
                                ...nextState,
                                setUpProcess: {
                                    ...setUpProcess,
                                    value,
                                    refresh: !setUpProcess.refresh
                                }
                            });
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
                            textField="Text"
                            valueField="Value"
                            filter={true}
                            filterServer={true}
                            filterParams="text"
                            params="Template"
                            disable={Template.disable}
                            lable={Template.label}
                            stylePicker={styles.resetBorder}
                            isChooseQuickly={true}
                            onFinish={(item) => {
                                this.setState({
                                    Template: {
                                        ...Template,
                                        value: item ? { ...item } : null,
                                        refresh: !Template.refresh
                                    }
                                });
                            }}
                        />
                    </View>
                )}

                {/* --- Block người lập đề xuất --- */}
                <View style={CustomStyleSheet.paddingHorizontal(12)}>
                    {listApprove.map((item, index) => {
                        return (
                            <View key={index}>
                                <View
                                    style={{
                                        position: 'absolute',
                                        bottom: -Size.deviceheight
                                    }}
                                >
                                    <View
                                        style={[
                                            CustomStyleSheet.marginBottom(12),
                                            CustomStyleSheet.paddingHorizontal(12)
                                        ]}
                                    >
                                        <VnrSuperFilterWithTextInput
                                            ref={(ref) => {
                                                this.refEmp[`${item ?? index}`] = ref;
                                            }}
                                            lable={this.state[item]?.label}
                                            value={this.state[item]?.value ?? []}
                                            fieldValid={true}
                                            onFinish={(listItem) => {
                                                this.setState({
                                                    [item]: {
                                                        ...this.state[item],
                                                        value: [
                                                            {
                                                                ...listItem[0],
                                                                Name: listItem[0]?.JoinProfileNameCode ?? ''
                                                            }
                                                        ],
                                                        refresh: !this.state[item]?.refresh
                                                    }
                                                });
                                            }}
                                            refresh={this.state[item]?.refresh}
                                            api={{
                                                urlApi: '[URI_CENTER]/api/Att_GetData/GetProfileDetailForAttendance_App',
                                                type: 'E_POST',
                                                dataBody: {
                                                    page: 1,
                                                    pageSize: 100
                                                }
                                            }}
                                            filterParams={'ProfileName'}
                                            textField={'JoinProfileNameCode'}
                                            textFieldFilter={'FormatProfileCodeLogin'}
                                            valueField={'ID'}
                                            filter={true}
                                            autoFilter={true}
                                            filterServer={true}
                                            response={'string'}
                                            placeholder={'SELECT_ITEM'}
                                            isChooseOne={true}
                                            licensedDisplay={[
                                                {
                                                    Name: ['JoinProfileNameCode'],
                                                    Avatar: ['ImagePath'],
                                                    UnderName: [
                                                        'PositionName',
                                                        'HRM_PortalApp_ContractHistory_Position'
                                                    ]
                                                }
                                            ]}
                                        />
                                    </View>
                                    <View>
                                        <VnrPickerLittle
                                            ref={(ref) => {
                                                this.refStep[`${item ?? index}`] = ref;
                                            }}
                                            isNewUIValue={true}
                                            refresh={this.state[item]?.refresh}
                                            dataLocal={[
                                                {
                                                    Text: 'Người xem xét/ Thẩm định',
                                                    Value: 'E_REVIEWER'
                                                },
                                                {
                                                    Text: 'Người phê duyệt',
                                                    Value: 'E_APPROVER'
                                                }
                                            ]}
                                            value={
                                                this.state[item]?.enum
                                                    ? {
                                                          Text: this.state[item]?.label,
                                                          Value: this.state[item]?.enum
                                                      }
                                                    : null
                                            }
                                            textField="Text"
                                            valueField="Value"
                                            lable={this.state[item]?.label}
                                            stylePicker={styles.resetBorder}
                                            isChooseQuickly={true}
                                            onFinish={(value) => {
                                                this.setState({
                                                    [item]: {
                                                        ...this.state[item],
                                                        label: value?.Text ?? '',
                                                        refresh: !this.state[item]?.refresh,
                                                        enum: value?.Value
                                                    }
                                                });
                                            }}
                                        />
                                    </View>
                                </View>
                                <View style={styles.proposerContainer}>
                                    <View style={styles.proposerHeader}>
                                        <View style={styles.proposerTitleWrapper}>
                                            <Text numberOfLines={1} style={styles.proposerTitle}>
                                                {this.state[item]?.label}
                                            </Text>
                                        </View>

                                        <View style={styles.actionButtons}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    if (
                                                        typeof this.refStep?.[`${item ?? index}`]?.opentModal ===
                                                        'function'
                                                    ) {
                                                        this.refStep?.[`${item ?? index}`]?.opentModal();
                                                    }
                                                }}
                                                disabled={this.state[item]?.isProposer}
                                                activeOpacity={0.7}
                                                style={styles.btnSetting}
                                            >
                                                <IconUserSetting size={14} color={Colors.black} />
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                disabled={this.state[item]?.isProposer}
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
                                                                        ? listApprove.filter((value) => value !== item)
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
                                    <TouchableOpacity
                                        onPress={() => {
                                            if (typeof this.refEmp?.[`${item ?? index}`]?.opentModal === 'function') {
                                                this.refEmp?.[`${item ?? index}`]?.opentModal();
                                            }
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
                                                            !this.state[item]?.value[0]?.Name && styles.noValueText
                                                        ]}
                                                    >
                                                        {this.state[item]?.value[0]?.Name ?? translate('SELECT_ITEM')}
                                                    </Text>
                                                </Text>
                                            </View>
                                            <Text numberOfLines={1} style={[styleSheets.detailPositionApprover]}>
                                                {this.state[item]?.value[0]?.PositionName ?? ''}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
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
                                    refresh: false,
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
