import React, { Component } from 'react';
import { styleSheets, styleSafeAreaView, Size, Colors, CustomStyleSheet } from '../../../../constants/styleConfig';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import VnrText from '../../../../components/VnrText/VnrText';

export default class AttWorkdayFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isVisibleModalFilter: false
        };
    }

    closeModalFilter = () => {
        this.setState({ isVisibleModalFilter: false });
    };

    onClearFilter = key => {
        const { onClearFilter } = this.props;
        onClearFilter && onClearFilter(key);
    };

    onFilter = key => {
        const { onFilter } = this.props;
        onFilter && onFilter(key);
    };

    showFilter = () => {
        this.setState({ isVisibleModalFilter: true });
    };

    componentDidMount() {
        // this.getDataItem();
    }

    render() {
        const { dataFilter } = this.props,
            { isVisibleModalFilter } = this.state;

        let checkHavenFilter = Object.keys(dataFilter).filter(key => dataFilter[key]?.isSelect === true);
        return (
            <View>
                {isVisibleModalFilter && (
                    <TouchableWithoutFeedback onPress={() => this.closeModalFilter()}>
                        <View style={styles.styBackdrop} />
                    </TouchableWithoutFeedback>
                )}

                {isVisibleModalFilter && (
                    <View {...styleSafeAreaView} style={[styles.styViewModal]}>
                        <View style={styles.container}>
                            <View style={styles.styHdModal}>
                                <VnrText
                                    style={[styleSheets.text, { color: Colors.white }]}
                                    i18nKey={'HRM_PortalApp_Wd_Filter'}
                                />

                                <VnrText
                                    style={[styleSheets.text, { color: Colors.white }]}
                                    i18nKey={'HRM_PortalApp_Wd_Filter_NumberDay'}
                                />
                            </View>
                            <View style={styles.styLstModal}>
                                {dataFilter &&
                                    Object.keys(dataFilter).length > 0 &&
                                    Object.keys(dataFilter).map((key, index) => {
                                        if (Object.keys(dataFilter[key]).length > 0) {
                                            let item = dataFilter[key];
                                            return (
                                                <TouchableOpacity
                                                    style={[
                                                        styles.styBtnModal,
                                                        index == Object.keys(dataFilter).length - 1 && {
                                                            ...CustomStyleSheet.borderBottomWidth(0)
                                                        },
                                                        item.isSelect && {
                                                            backgroundColor: Colors.primary_transparent_8,
                                                            ...CustomStyleSheet.borderBottomWidth(0)
                                                        }
                                                    ]}
                                                    onPress={() => this.onFilter(key)}
                                                >
                                                    <View
                                                        style={CustomStyleSheet.maxWidth('90%')}
                                                    >
                                                        <VnrText
                                                            style={[
                                                                styleSheets.text,
                                                                item.isSelect && { color: Colors.primary }
                                                            ]}
                                                            i18nKey={item.keyTras}
                                                        />
                                                    </View>
                                                    <View>
                                                        <Text
                                                            style={[
                                                                styleSheets.lable,
                                                                item.isSelect && { color: Colors.primary }
                                                            ]}
                                                        >
                                                            {item?.number ?? 0}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            );
                                        }
                                    })}
                            </View>

                            <View style={styles.styleViewBntApprove}>
                                <TouchableOpacity style={styles.bntCancel} onPress={() => this.closeModalFilter()}>
                                    <VnrText
                                        style={[styleSheets.text, { color: Colors.black }]}
                                        i18nKey={'HRM_Common_Close'}
                                    />
                                </TouchableOpacity>
                                {checkHavenFilter.length > 0 && (
                                    <TouchableOpacity style={styles.bntClear} onPress={this.onClearFilter}>
                                        <VnrText
                                            style={[styleSheets.lable, styles.styTextBntClear]}
                                            i18nKey={'HRM_Common_Clear_Filter'}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>
                )}
            </View>
        );
    }
}

const WIDTH_MODAL = Size.deviceWidth * 0.63,
    HEIGHT_BUTTON_FILTER = Size.heightInput - 5;

const styles = StyleSheet.create({
    styViewModal: {
        position: 'absolute',
        width: WIDTH_MODAL,

        bottom: Size.deviceheight * 0.1 + Size.defineSpace + Size.defineHalfSpace,
        left: Size.defineSpace,
        zIndex: 3,
        elevation: 3
    },
    container: {
        flex: 1
    },
    styHdModal: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',

        paddingHorizontal: Size.defineHalfSpace,
        paddingVertical: Size.defineHalfSpace,

        backgroundColor: Colors.gray_8
    },
    styLstModal: {
        width: '100%',
        backgroundColor: Colors.white
    },
    styBtnModal: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: Size.defineSpace,
        height: HEIGHT_BUTTON_FILTER,

        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5,

        alignItems: 'center',
        justifyContent: 'space-between'
    },
    bntCancel: {
        flex: 1,
        height: HEIGHT_BUTTON_FILTER,

        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white
    },
    bntClear: {
        flex: 1,
        height: HEIGHT_BUTTON_FILTER,
        justifyContent: 'center',
        alignItems: 'center',
        borderLeftColor: Colors.gray_5,
        borderLeftWidth: 0.5,
        backgroundColor: Colors.white,
        marginLeft: Size.defineHalfSpace - 3
    },
    styleViewBntApprove: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        height: HEIGHT_BUTTON_FILTER,
        marginTop: Size.defineHalfSpace - 3
        // backgroundColor: Colors.s
    },
    styTextBntClear: {
        fontSize: Size.text + 2,
        fontWeight: '500',
        color: Colors.red
    },
    styBackdrop: {
        position: 'absolute',
        width: Size.deviceWidth,
        height: Size.deviceheight,
        bottom: 0,
        left: 0,
        zIndex: 2,
        backgroundColor: Colors.gray_9,
        opacity: 0.3
    }
});
