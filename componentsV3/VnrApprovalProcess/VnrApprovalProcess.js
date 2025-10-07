import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, FlatList } from 'react-native';
import { Colors, CustomStyleSheet, Size, styleSafeAreaView } from '../../constants/styleConfig';
import { IconArrowDownSupperLong, IconCancel, IconDown, IconPencil, IconUp } from '../../constants/Icons';
import Vnr_Function from '../../utils/Vnr_Function';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { translate } from '../../i18n/translate';
import HttpService from '../../utils/HttpService';
import { EnumName } from '../../assets/constant';
import VnrSuperFilterWithTextInputUserApprover from '../VnrSuperFilterWithTextInput/VnrSuperFilterWithTextInputUserApprover';

const initSateDefault = {
    isDropDown: false,
    isVisible: false,
    dataUserApprover: [],
    approvalData: [],
    editingIndex: null
};

class VnrApprovalProcess extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ...initSateDefault, approvalData: Array.isArray(props?.data) ? [...props.data] : [] };
        this.refVnrSuperFilterWithTextInput = null;
        this.refPickers = {};
    }

    // Trả về dữ liệu quy trình duyệt hiện tại để component cha lấy qua ref
    // Dùng trong các màn xác nhận gửi yêu cầu
    getData = () => {
        return this.state.approvalData;
    };

    componentDidUpdate(prevProps) {
        if (prevProps?.data !== this.props?.data) {
            try {
                const next = Array.isArray(this.props?.data) ? [...this.props.data] : [];
                this.setState({ approvalData: next });
            } catch (e) {}
        }
    }

    // Khi nhấn nút Lưu trong modal, bắn dữ liệu ra ngoài qua các callback nếu có
    onConfirmApproval = () => {
        const { onConfirmApprover, onChangeApprover, onConfirm } = this.props;
        const { approvalData } = this.state;
        try {
            if (typeof onConfirmApprover === 'function') onConfirmApprover(approvalData);
            if (typeof onChangeApprover === 'function') onChangeApprover(approvalData);
            if (typeof onConfirm === 'function') onConfirm(approvalData);
        } catch (e) {}
        this.setState({ isVisible: false, editingIndex: null });
    };

    // Cập nhật danh sách người duyệt cho một cấp duyệt cụ thể theo index
    // Bảo toàn cấu trúc approvalData và chỉ thay trường EmployeeInfo
    updateApproverAtIndex = (rowIndex, listItem) => {
        try {
            const { approvalData } = this.state;
            const next = Array.isArray(approvalData) ? [...approvalData] : [];
            if (rowIndex != null && next[rowIndex]) {
                next[rowIndex] = {
                    ...next[rowIndex],
                    EmployeeInfo: Array.isArray(listItem) ? [...listItem] : []
                };
                this.setState({ approvalData: next });
            }
        } catch (e) {}
    };

    renderItem = (item, index) => {
        return (
            <View style={styles.itemContainer}>
                <View style={styles.wrapLableAndNumberLevelApprove}>
                    <View style={styles.wrapNumberLevelApprove}>
                        <Text style={styles.textLable}>{item?.Order ? item?.Order + 1 : index + 1}</Text>
                    </View>
                    <View
                        style={[
                            styles.lineVertical,
                            CustomStyleSheet.height(
                                Array.isArray(item?.EmployeeInfo) && item?.EmployeeInfo.length > 1
                                    ? 42 * item?.EmployeeInfo.length + 12 * (item?.EmployeeInfo.length - 1)
                                    : 42
                            )
                        ]}
                    />
                </View>
                <View style={CustomStyleSheet.flex(1)}>
                    <View style={styles.wrapExecutionStepView}>
                        <Text style={styles.textExecutionStepView}>{item?.ExecutionStepView ?? ''}</Text>
                    </View>
                    {Array.isArray(item?.EmployeeInfo)
                        ? item?.EmployeeInfo.map((v, i) => {
                              return (
                                  <View style={styles.wrapItem} key={i}>
                                      {Vnr_Function.renderAvatarCricleByName(
                                          v?.ImagePath,
                                          v.ProfileName ? v.ProfileName : 'A',
                                          44,
                                          false,
                                          v?.IsImportant
                                      )}
                                      <View style={CustomStyleSheet.marginLeft(8)}>
                                          <Text numberOfLines={1} style={styles.textNameApprover}>
                                              {v?.ProfileName ?? ''}
                                          </Text>
                                          <Text numberOfLines={1} style={styles.textPositionApprover}>
                                              {v?.PositionName ?? ''}
                                          </Text>
                                      </View>
                                  </View>
                              );
                          })
                        : null}
                </View>
            </View>
        );
    };

    ToasterSevice = () => {
        const { ToasterSevice } = this.props;
        return ToasterSevice;
    };

    componentDidMount() {
        try {
            HttpService.Post('[URI_CENTER]/api/Sys_Common/GetMultiUserApproveByType', {
                page: 1,
                pageSize: 100,
                IsExclude: true,
                Type: 'E_REQUIREMENTRECRUITMENT'
            }).then((res) => {
                if(res?.Status === EnumName.E_SUCCESS && res?.Data?.Data?.length > 0) {
                    this.setState({
                        dataUserApprover: res?.Data?.Data
                    });
                }
            });
        } catch (error) {
            this.setState({
                dataUserApprover: []
            });
        }
    }

    render() {
        const { isDropDown, isVisible, dataUserApprover, approvalData, editingIndex } = this.state,
            { isEdit } = this.props;

        return (
            <View style={styles.container}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                        this.setState({
                            isDropDown: !isDropDown
                        });
                    }}
                >
                    <View style={styles.wrapHeaderButton}>
                        <Text style={styles.textHeaderButton}>{translate('HRM_PortalApp_ApprovalProcess')}</Text>
                        {isDropDown ? (
                            <IconUp size={22} color={Colors.gray_8} />
                        ) : (
                            <IconDown size={22} color={Colors.gray_8} />
                        )}
                    </View>
                    <View>
                        <Text style={styles.textInfoLevelAprrove}>
                            {approvalData?.length ?? '0'} {translate('HRM_PortalApp_ApprovalLevel')}
                        </Text>
                    </View>
                </TouchableOpacity>
                {isDropDown ? (
                    <View style={CustomStyleSheet.flex(1)}>
                        {Array.isArray(approvalData)
                            ? approvalData.map((item, index) => (
                                  <View key={index}>{this.renderItem(item, index)}</View>
                              ))
                            : null}
                    </View>
                ) : null}
                {isEdit ? (
                    <TouchableOpacity
                        onPress={() => {
                        this.setState({ isVisible: true, editingIndex: null });
                        }}
                        activeOpacity={0.7}
                        style={styles.buttonEditApprover}
                    >
                        <Text style={styles.textButtonEditApprover}>{translate('HRM_PortalApp_EditApprover')}</Text>
                    </TouchableOpacity>
                ) : null}
                <Modal
                    onBackButtonPress={() =>
                        this.setState({
                            isVisible: false
                        })
                    }
                    isVisible={isVisible}
                    onBackdropPress={() =>
                        this.setState({
                            isVisible: false
                        })
                    }
                    customBackdrop={
                        <TouchableWithoutFeedback
                            onPress={() =>
                                this.setState({
                                    isVisible: false
                                })
                            }
                        >
                            <View style={styles.viewBackdrop} />
                        </TouchableWithoutFeedback>
                    }
                    style={[CustomStyleSheet.margin(0), CustomStyleSheet.backgroundColor('white')]}
                >
                    <SafeAreaView {...styleSafeAreaView}>
                        <View style={CustomStyleSheet.flex(1)}>
                            {/* Header */}
                            <View style={styles.wrapHeaderModal}>
                                <Text style={styles.textHeader}>{translate('HRM_PortalApp_EditApprover')}</Text>
                                <TouchableOpacity
                                    onPress={() =>
                                        this.setState({
                                            isVisible: false
                                        })
                                    }
                                    style={styles.buttonCricleClose}
                                >
                                    <IconCancel size={16} color={Colors.gray_10} />
                                </TouchableOpacity>
                            </View>

                            {/* Render list */}
                            <View style={styles.wrapRenderList}>
                                {Array.isArray(this.props?.data) ? (
                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        ItemSeparatorComponent={() => (
                                            <View style={CustomStyleSheet.alignItems('center')}>
                                                <IconArrowDownSupperLong size={22} color={'black'} />
                                            </View>
                                        )}
                                        data={approvalData}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <View style={styles.wrapItemEdit}>
                                                    <View style={styles.wrapLableEdit}>
                                                        <Text style={styles.textLableEdit}>
                                                            {item?.ExecutionStepView}
                                                        </Text>
                                                        {item?.ExecutionStep !== 'E_PROPOSE' &&
                                                        item?.ExecutionStep !== 'E_COMMENT' ? (
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    this.setState({ editingIndex: index }, () => {
                                                                        const ref = this.refPickers[index];
                                                                        if (ref && typeof ref.opentModal === 'function') {
                                                                            ref.opentModal();
                                                                        }
                                                                    });
                                                                }}
                                                                style={styles.buttonCloseModalEdit}
                                                            >
                                                                <IconPencil size={15} color={Colors.gray_10} />
                                                            </TouchableOpacity>
                                                        ) : null}
                                                    </View>
                                                    <View style={CustomStyleSheet.flex(1)}>
                                                        {Array.isArray(item?.EmployeeInfo)
                                                            ? item?.EmployeeInfo.map((v, i) => {
                                                                  return (
                                                                      <View
                                                                          style={[
                                                                              styles.wrapItem
                                                                          ]}
                                                                          key={i}
                                                                      >
                                                                          {Vnr_Function.renderAvatarCricleByName(
                                                                              v?.ImagePath,
                                                                              v.ProfileName ? v.ProfileName : 'A',
                                                                              44,
                                                                              false,
                                                                              v?.IsImportant
                                                                          )}
                                                                          <View style={CustomStyleSheet.marginLeft(8)}>
                                                                              <Text
                                                                                  numberOfLines={1}
                                                                                  style={[styles.textNameApprover]}
                                                                              >
                                                                                  {v?.ProfileName ?? ''}
                                                                              </Text>
                                                                              <Text
                                                                                  numberOfLines={1}
                                                                                  style={[styles.textPositionApprover]}
                                                                              >
                                                                                  {v?.PositionName ?? ''}
                                                                              </Text>
                                                                          </View>
                                                                      </View>
                                                                  );
                                                              })
                                                            : null}
                                                        <View
                                                            style={{
                                                                position: 'absolute',
                                                                bottom: -Size.deviceheight
                                                            }}
                                                        >
                                                            <VnrSuperFilterWithTextInputUserApprover
                                                                ref={(ref) => (this.refPickers[index] = ref)}
                                                                lable={'HRM_PortalApp_SelectApprover'}
                                                                value={item?.EmployeeInfo?.length > 0 ? item?.EmployeeInfo : []}
                                                                fieldValid={true}
                                                                onFinish={(listItem) => this.updateApproverAtIndex(index, listItem)}
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
                                                </View>
                                            );
                                        }}
                                        keyExtractor={(_, index) => String(index)}
                                    />
                                ) : (
                                    <View />
                                )}
                            </View>

                            <View style={styles.wrapButotnSave}>
                                <TouchableOpacity onPress={this.onConfirmApproval} style={styles.buttonSave}>
                                    <Text style={styles.textButtonSave}>{translate('HRM_PortalApp_Common_Save')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SafeAreaView>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        backgroundColor: Colors.white,
        margin: 12,
        borderRadius: 8
    },

    wrapHeaderButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    textHeaderButton: {
        fontSize: 16,
        fontWeight: '600'
    },
    textInfoLevelAprrove: {
        fontSize: 14,
        fontWeight: '400',
        color: Colors.gray_8
    },
    buttonEditApprover: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: Colors.gray_3,
        marginTop: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textButtonEditApprover: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.gray_10
    },

    itemContainer: {
        flexDirection: 'row',
        padding: 12
    },

    wrapLableAndNumberLevelApprove: {
        height: '100%',
        alignItems: 'center'
    },

    wrapNumberLevelApprove: {
        width: 21,
        height: 21,
        borderRadius: 21,
        backgroundColor: Colors.blue,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4
    },

    textLable: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.white
    },
    lineVertical: {
        width: 1,
        backgroundColor: Colors.gray_6,
        marginTop: 10
    },
    wrapExecutionStepView: {
        paddingLeft: 8,
        flexDirection: 'row',
        alignItems: 'center'
    },
    textExecutionStepView: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.gray_10
    },

    wrapItem: {
        marginTop: 16,
        marginLeft: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    textNameApprover: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.gray_10,
        lineHeight: 18
    },
    textPositionApprover: {
        fontSize: 14,
        fontWeight: '400',
        color: Colors.gray_8,
        lineHeight: 18
    },

    // modal
    wrapHeaderModal: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 18,
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5
    },

    textHeader: {
        fontSize: 16,
        fontWeight: '600'
    },

    buttonCricleClose: {
        backgroundColor: Colors.gray_4,
        padding: 4,
        height: 26,
        width: 26,
        borderRadius: 26,
        justifyContent: 'center',
        alignItems: 'center'
    },

    wrapRenderList: {
        flex: 1,
        padding: 12
    },

    wrapItemEdit: {
        padding: 12,
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        borderRadius: 8,
        justifyContent: 'center'
    },

    wrapLableEdit: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },

    textLableEdit: {
        fontSize: 16,
        fontWeight: '600'
    },

    buttonCloseModalEdit: {
        width: 32,
        height: 32,
        borderRadius: 32,
        backgroundColor: Colors.gray_4,
        justifyContent: 'center',
        alignItems: 'center'
    },

    viewBackdrop: {
        flex: 1,
        backgroundColor: Colors.black,
        opacity: 0.5
    },

    wrapButotnSave: {
        borderTopColor: Colors.gray_5,
        borderTopWidth: 0.5,
        padding: 12
    },

    buttonSave: {
        backgroundColor: Colors.blue,
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },

    textButtonSave: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.white
    }
});

export default VnrApprovalProcess;
