import React, { Component } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import { styleSheets, Colors, CustomStyleSheet } from '../../../../../constants/styleConfig';
import HttpService from '../../../../../utils/HttpService';
import DrawerServices from '../../../../../utils/DrawerServices';
import { EnumName } from '../../../../../assets/constant';
import { translate } from '../../../../../i18n/translate';
import { IconCancel, IconSearch, IconCheck } from '../../../../../constants/Icons';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import Vnr_Function from '../../../../../utils/Vnr_Function';

class ModalSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            isShowModal: false,
            data: [],
            work: null
        };
    }

    onShow = (type = 'E_NEW', work) => {
        this.setState(
            {
                isShowModal: true,
                work: work ? work : null
            },
            () => {
                this.handleGetData(type, '', work);
            }
        );
    };

    onHide = () => {
        this.setState({
            isShowModal: false
        });
    };

    handleGetData = (type, text = '', work) => {
        try {
            if (this.props?.type || type) {
                VnrLoadingSevices.show();
                HttpService.Get(
                    `[URI_CENTER]/api/Cat_GetData/GetMultiCat_WorkList?type=${
                        type ? type : this.props?.type
                    }&text=${text}`
                )
                    .then(res => {
                        VnrLoadingSevices.hide();
                        if (res?.Status === EnumName.E_SUCCESS && Array.isArray(res?.Data)) {
                            const idWork = work?.ID;
                            if (idWork) {
                                res?.Data.map(item => {
                                    if (item?.ID === idWork) {
                                        item.isSelected = true;
                                    }
                                });
                            }
                            this.setState({
                                data: res?.Data
                            });
                        }
                    })
                    .catch(error => {
                        VnrLoadingSevices.hide();
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    });
            }
        } catch (error) {
            VnrLoadingSevices.hide();
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (
            nextState?.search !== this.state.search ||
            nextState?.isShowModal !== this.state.isShowModal ||
            !Vnr_Function.compare(nextState?.data, this.state.data) ||
            (nextState?.work && this.state.work && !Vnr_Function.compare(nextState?.work, this.state.work)) ||
            nextProps?.type !== this.props?.type
        ) {
            return true;
        }
        return false;
    }

    render() {
        const { search, isShowModal, data } = this.state;

        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={isShowModal}
                onRequestClose={() => {
                    // this.setState({
                    //     isShowFilter: false,
                    // })
                }}
            >
                <View style={styles.styViewModalWrap}>
                    <View style={styles.container}>
                        <Text style={[styleSheets.lable, CustomStyleSheet.fontSize(16)]}>
                            {translate('HRM_PortalApp_HreWorkManage_AddWork')}
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({
                                    isShowModal: false
                                });
                            }}
                            style={CustomStyleSheet.padding(6)}
                        >
                            <IconCancel size={24} color={Colors.black} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.wrapHeader}>
                        <View style={styles.wrapContentHeader}>
                            <TextInput
                                style={[styles.inputSearch]}
                                value={search}
                                onChangeText={text => {
                                    this.setState(
                                        {
                                            search: text
                                        },
                                        () => {
                                            this.handleGetData(this.props?.type, text);
                                        }
                                    );
                                }}
                                placeholder={translate('HRM_PortalApp_Search')}
                                onSubmitEditing={() => {
                                    this.handleGetData(this.props?.type, search);
                                }}
                            />
                            <View style={styles.flex_Row_Ali_Center}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.handleGetData(this.props?.type, search);
                                    }}
                                >
                                    <IconSearch size={24} color={Colors.gray_7} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* List */}
                    <View style={CustomStyleSheet.flex(1)}>
                        <FlatList
                            data={data}
                            renderItem={({ item }) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props?.onFisnish(item);
                                            this.onHide();
                                        }}
                                        style={[styles.item, item?.isSelected && { backgroundColor: Colors.primary_1 }]}
                                    >
                                        <Text style={[styleSheets.lable]}>{item?.WorkListCodeName}</Text>
                                        {item?.isSelected && <IconCheck size={16} color={Colors.primary} />}
                                    </TouchableOpacity>
                                );
                            }}
                            keyExtractor={item => item.ID}
                        />
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    styViewModalWrap: { flex: 1,
        backgroundColor: Colors.white },
    container: {
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.gray_2
    },

    wrapHeader: {
        width: '100%',
        justifyContent: 'center',
        paddingHorizontal: 8,
        marginVertical: 8
    },

    wrapContentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        backgroundColor: Colors.gray_3,
        paddingVertical: 3
    },

    inputSearch: {
        flex: 1,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 16
    },

    flex_Row_Ali_Center: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    item: {
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5,
        paddingHorizontal: 12,
        paddingVertical: 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});

export default ModalSearch;
