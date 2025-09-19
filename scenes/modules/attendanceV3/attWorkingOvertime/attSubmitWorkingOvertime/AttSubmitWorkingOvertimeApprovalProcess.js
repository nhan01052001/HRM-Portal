import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors, CustomStyleSheet, Size, styleSheets } from '../../../../../constants/styleConfig';
import VnrSwitch from '../../../../../componentsV3/VnrSwitch/VnrSwitch';
import { translate } from '../../../../../i18n/translate';
import { IconPlus, IconRemoveUser, IconUserSetting } from '../../../../../constants/Icons';
import Vnr_Function from '../../../../../utils/Vnr_Function';

const initSateDefault = {
    setUpProcess: {
        refresh: false,
        disable: false,
        value: false,
        visible: false,
        visibleConfig: true
    }
};

class AttSubmitWorkingOvertimeApprovalProcess extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initSateDefault
        };
    }

    render() {
        const { setUpProcess } = this.state;
        return (
            <View style={[CustomStyleSheet.flex(1), CustomStyleSheet.backgroundColor(Colors.white)]}>
                <View style={CustomStyleSheet.backgroundColor(Colors.white)}>
                    <VnrSwitch
                        lable={'Thiết lập quy trình'}
                        subLable={translate('Sử dụng quy trình có sẵn?')}
                        value={setUpProcess.value}
                        onFinish={(value) => {
                            this.setState({
                                setUpProcess: {
                                    ...setUpProcess,
                                    value,
                                    refresh: !setUpProcess.refresh
                                }
                            });
                        }}
                    />
                </View>

                {/* --- Block người lập đề xuất --- */}
                <View style={styles.proposerContainer}>
                    <View style={styles.proposerHeader}>
                        <View style={styles.proposerTitleWrapper}>
                            <Text numberOfLines={1} style={styles.proposerTitle}>
                                Người lập đề xuất
                            </Text>
                        </View>

                        <View style={styles.actionButtons}>
                            <TouchableOpacity activeOpacity={0.7} style={styles.btnSetting}>
                                <IconUserSetting size={14} color={Colors.black} />
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={0.7} style={styles.btnRemove}>
                                <IconRemoveUser size={14} color={Colors.white} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.userInfoRow}>
                        {Vnr_Function.renderAvatarCricleByName(null, 'A', 44)}
                        <View style={styles.userInfoWrapper}>
                            <View style={CustomStyleSheet.flex(1)}>
                                <Text numberOfLines={2} style={[styleSheets.subTitleApprover]}>
                                    <Text style={[styleSheets.detailNameApprover]}>
                                        Đỗ Hoàng Thiên Thanh Ngọc Khuê
                                    </Text>
                                </Text>
                            </View>
                            <Text numberOfLines={1} style={[styleSheets.detailPositionApprover]}>
                                Nhân viên tuyển dụng
                            </Text>
                        </View>
                    </View>
                </View>

                {/* --- Line dashed --- */}
                <View style={styles.lineDashedWrapper}>
                    <View style={styles.lineDashed} />
                </View>

                {/* --- Add step button --- */}
                <View style={CustomStyleSheet.flex(1)}>
                    <TouchableOpacity activeOpacity={0.7} style={styles.buttonAddStep}>
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
        backgroundColor: Colors.blue_1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: Colors.blue
    }
});

export default AttSubmitWorkingOvertimeApprovalProcess;
