import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    TouchableOpacity,
    Animated
} from 'react-native';
import { connect } from 'react-redux';

import { Colors, CustomStyleSheet, Size, styleSheets } from '../../../../../constants/styleConfig';
import { translate } from '../../../../../i18n/translate';
import DrawerServices from '../../../../../utils/DrawerServices';
import HttpService from '../../../../../utils/HttpService';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import { EnumName } from '../../../../../assets/constant';
import profileAddition from '../../../../../redux/profileAddition';

class ProfileAdditonComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisibleRequestDocs: false,
            animated: new Animated.Value(210),
            dataRequestDocs: [],
            numberWaitings: null,
            numberTotal: null
        };
    }

    componentDidMount() {
        if (dataVnrStorage.currentUser.info.isLoginSSO) {
            this.getData();
        }
    }

    getData = () => {
        try {
            if (dataVnrStorage.currentUser.info.ProfileID) {
                // VnrLoadingSevices.show();
                HttpService.Get(
                    `[URI_CENTER]/api/Hre_ReqDocument/GetReqDocumentByProfileID?profileID=${dataVnrStorage.currentUser.info.ProfileID
                    }`
                )
                    .then(res => {
                        // VnrLoadingSevices.hide();
                        if (res?.Data && res?.Status === EnumName.E_SUCCESS) {
                            let dataWaitingApprove = [],
                                nextState = {};
                            if (Array.isArray(res?.Data?.Hre_ReqDocumentNewPortalAPIModel)) {
                                res?.Data?.Hre_ReqDocumentNewPortalAPIModel.map(item => {
                                    if (
                                        item?.ReqDocumentStatus === 'E_SUBMIT' ||
                                        item?.ReqDocumentStatus === 'E_APPROVED3' ||
                                        item?.ReqDocumentStatus === 'E_FIRST_APPROVED' ||
                                        item?.ReqDocumentStatus === 'E_APPROVED2' ||
                                        item?.ReqDocumentStatus === 'E_APPROVED1'
                                    ) {
                                        dataWaitingApprove.push(item);
                                    }
                                });
                                this.props.setProfileAdded(
                                    `${dataWaitingApprove.length}/${res?.Data?.Hre_ReqDocumentNewPortalAPIModel.length}`
                                );
                                nextState = {
                                    ...nextState,
                                    numberWaitings: dataWaitingApprove.length,
                                    numberTotal: res?.Data?.Hre_ReqDocumentNewPortalAPIModel.length
                                };
                            }

                            nextState = {
                                ...nextState,
                                dataRequestDocs: res?.Data
                            };

                            this.setState(
                                {
                                    isVisibleRequestDocs: true,
                                    ...nextState
                                },
                                () => {
                                    Animated.timing(this.state.animated, {
                                        toValue: 0,
                                        duration: 250,
                                        useNativeDriver: true
                                    }).start();
                                }
                            );
                        }
                    })
                    .catch(error => {
                        VnrLoadingSevices.hide();
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    });
            }
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }

        Animated.timing(this.state.animated, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true
        }).start();
    };

    render() {
        const { isVisibleRequestDocs, dataRequestDocs, numberWaitings, numberTotal } = this.state;

        return (
            <View>
                {isVisibleRequestDocs && (
                    <View style={styles.container}>
                        <Animated.View
                            style={[styles.wrapAllRequestDocs, { transform: [{ translateY: this.state.animated }] }]}
                        >
                            <View style={styles.wrapRequestDocsAbove}>
                                <View style={styles.requestDoocsAboveLeft}>
                                    <Image
                                        source={require('../../../../../assets/images/profileinfo/request_docs.png')}
                                        style={styles.imageRequestDoc}
                                    />
                                </View>
                                <View style={CustomStyleSheet.flex(0.8)}>
                                    <View>
                                        <Text style={[styleSheets.lable, styles.textRequestDocAndBtn]}>
                                            {translate('HRM_PortalApp_SupplementRequiredDocuments')}
                                            {this.props.dataProfileAdded && ` (${this.props.dataProfileAdded})`}
                                        </Text>
                                    </View>
                                    {
                                        (dataRequestDocs?.ApplicationDeadLine) && (
                                            <View
                                                style={[
                                                    styles.wrapDeadline,
                                                    dataRequestDocs?.StatusDate === 'E_OUTOFDATE' && {
                                                        backgroundColor: Colors.red
                                                    }
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styleSheets.lable,
                                                        { fontSize: Size.text },
                                                        dataRequestDocs?.StatusDate === 'E_OUTOFDATE' && { color: Colors.white }
                                                    ]}
                                                >
                                                    {translate('HRM_Evaluation_Deadline')}:{' '}
                                                    {dataRequestDocs?.ApplicationDeadLine}
                                                </Text>
                                            </View>
                                        )
                                    }
                                    <View style={CustomStyleSheet.maxWidth('95%')}>
                                        <Text
                                            numberOfLines={3}
                                            style={[styleSheets.text, styles.textViewDetailTypeDocs]}
                                        >
                                            {translate('HRM_PortalApp_ViewDetailsOfRecordTypes')}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.wrapRequestDocsBelow}>
                                <TouchableOpacity
                                    style={styles.btnTempHide}
                                    onPress={() => {
                                        Animated.timing(this.state.animated, {
                                            toValue: 210,
                                            duration: 250,
                                            useNativeDriver: true
                                        }).start(() => {
                                            this.setState({
                                                isVisibleRequestDocs: false
                                            });
                                        });
                                    }}
                                >
                                    <Text
                                        style={[styleSheets.text, { fontSize: Size.text + 2, color: Colors.gray_10 }]}
                                    >
                                        {translate('HRM_PortalApp_Button_Snooze')}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.btnAddRequestDocs}
                                    onPress={() => {
                                        DrawerServices.navigate('ProfileAddition', {
                                            data: dataRequestDocs?.Hre_ReqDocumentNewPortalAPIModel,
                                            deadline: dataRequestDocs?.ApplicationDeadLine,
                                            isOverDeadline: dataRequestDocs?.StatusDate === 'E_OUTOFDATE',
                                            numberWaitings: numberWaitings,
                                            numberTotal: numberTotal
                                        });
                                    }}
                                >
                                    <Text style={[styleSheets.text, styles.textRequestDocAndBtn]}>
                                        {translate('HRM_PortalApp_Button_AddProfile')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapAllRequestDocs: {
        backgroundColor: Colors.gray_10,
        padding: 16,
        margin: 8,
        borderRadius: 8
    },

    wrapRequestDocsAbove: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },

    requestDoocsAboveLeft: {
        flex: 0.2,
        justifyContent: 'flex-start'
    },

    imageRequestDoc: {
        width: 56,
        height: 56
    },

    textRequestDocAndBtn: {
        fontSize: Size.text + 2,
        color: Colors.white
    },

    wrapDeadline: {
        backgroundColor: Colors.yellow_6,
        paddingHorizontal: 4,
        alignSelf: 'baseline',
        borderRadius: 4,
        marginVertical: 4
    },

    textViewDetailTypeDocs: {
        fontSize: Size.text + 1,
        color: Colors.gray_5
    },

    wrapRequestDocsBelow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16
    },

    btnTempHide: {
        flex: 0.3,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 4
    },

    btnAddRequestDocs: {
        flex: 0.65,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 4
    },
    container: {
        position: 'absolute', width: '100%', bottom: 0
    }
});

const mapStateToProps = state => {
    return {
        dataProfileAdded: state.profileAddition.dataProfileAdded
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setProfileAdded: data => {
            dispatch(profileAddition.actions.setProfileAdded(data));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfileAdditonComponent);
