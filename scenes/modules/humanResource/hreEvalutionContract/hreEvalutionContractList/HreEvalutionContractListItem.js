/* eslint-disable no-undef */
import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Colors, CustomStyleSheet, Size, styleSheets } from '../../../../../constants/styleConfig';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { translate } from '../../../../../i18n/translate';

export default class HreWorkManageListItemManage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.Swipe = null;
    }

    shouldComponentUpdate(nextProps) {
        if (
            nextProps.isPullToRefresh !== this.props.isPullToRefresh ||
            nextProps.isSelect !== this.props.isSelect ||
            nextProps.isOpenAction !== this.props.isOpenAction ||
            nextProps.isDisable !== this.props.isDisable
        ) {
            return true;
        } else {
            return false;
        }
    }

    render() {
        const { dataItem, isDisable } = this.props;

        let evaluated = 0,
            needevaluat = 0;

        if (dataItem?.Progress) {
            let arrProgress = dataItem?.Progress.split('/');
            if (Array.isArray(arrProgress) && arrProgress.length === 2) {
                evaluated = arrProgress[0];
                needevaluat = arrProgress[1];
            }
        }

        let colorStatusView = null,
            bgStatusView = null,
            colorStatusView2 = null,
            bgStatusView2 = null,
            valueProgress = (evaluated / needevaluat) * 100;

        // xử lý color
        if (dataItem.itemStatus) {
            const { colorStatus, bgStatus } = dataItem.itemStatus;
            colorStatusView = colorStatus ? colorStatus : null;
            bgStatusView = bgStatus ? bgStatus : null;
        }

        if (dataItem.itemStatus) {
            const { colorStatus, bgStatus } = dataItem.itemStatus2;
            colorStatusView2 = colorStatus ? colorStatus : null;
            bgStatusView2 = bgStatus ? bgStatus : null;
        }

        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    this.props.onMoveDetail();
                }}
            >
                <View style={styles.swipeableLayout}>
                    <View style={styles.container}>
                        <View style={styles.styViewTop}>
                            <View
                                style={[styles.leftContent, isDisable ? styleSheets.opacity05 : styleSheets.opacity1]}
                            >
                                {Vnr_Function.renderAvatarCricleByName(dataItem.ImagePath, dataItem.ProfileName, 37)}
                            </View>

                            <View style={styles.contentCenter}>
                                <Text numberOfLines={1} style={[styleSheets.lable, styles.profileText]}>
                                    {dataItem.ProfileName} {dataItem?.CodeEmp ? ` - ${dataItem?.CodeEmp}` : ''}
                                </Text>

                                {dataItem.OrgStructureName != null && (
                                    <Text numberOfLines={1} style={[styleSheets.text, styles.positionText]}>
                                        {dataItem.OrgStructureName ? dataItem.OrgStructureName : ''}
                                    </Text>
                                )}
                                {dataItem.UserLogin != null && (
                                    <Text numberOfLines={1} style={[styleSheets.text, styles.positionText]}>
                                        {dataItem.UserLogin ? dataItem.UserLogin : ''}
                                    </Text>
                                )}
                                {dataItem.WorkListTypeView != null && (
                                    <Text numberOfLines={1} style={[styleSheets.text, styles.positionText]}>
                                        {dataItem.WorkListTypeView ? dataItem.WorkListTypeView : ''}
                                    </Text>
                                )}
                            </View>

                            <View style={styles.contentRight}>
                                <View
                                    style={[
                                        styles.lineSatus,
                                        {
                                            backgroundColor: bgStatusView2 ? rgb(bgStatusView2) : Colors.white
                                        },
                                        CustomStyleSheet.marginBottom(6)
                                    ]}
                                >
                                    <Text
                                        numberOfLines={1}
                                        style={[
                                            styleSheets.text,
                                            styles.lineSatus_text,
                                            {
                                                color: colorStatusView2 ? colorStatusView2 : Colors.gray_10
                                            }
                                        ]}
                                    >
                                        {dataItem.OverdueView ? dataItem.OverdueView : ''}
                                    </Text>
                                </View>

                                <View
                                    style={[
                                        styles.lineSatus,
                                        {
                                            backgroundColor: bgStatusView ? rgb(bgStatusView) : Colors.white
                                        }
                                    ]}
                                >
                                    <Text
                                        numberOfLines={1}
                                        style={[
                                            styleSheets.text,
                                            styles.lineSatus_text,
                                            {
                                                color: colorStatusView ? colorStatusView : Colors.gray_10
                                            },
                                            styles.styViewAlignSeft
                                        ]}
                                    >
                                        {dataItem.StatusPerFormanceView ? dataItem.StatusPerFormanceView : ''}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.styProgress}>
                            <View style={styles.styLeftProgress}>
                                <View style={styles.styViewProgress}>
                                    <View style={[styles.styValProgress, { width: `${valueProgress}%` }]} />
                                </View>
                            </View>
                            <View style={styles.styRightProgress}>
                                <Text style={styles.styTextValProgress}>
                                    {`${translate('HRM_System_AsynTask_PercentComplete')}: ${dataItem?.Progress}`}
                                </Text>
                            </View>
                        </View>

                        <View>
                            <View style={styles.styViewMoreInfo}>
                                <View
                                    style={[
                                        styles.leftContent,
                                        isDisable ? styleSheets.opacity05 : styleSheets.opacity1
                                    ]}
                                >
                                    {Vnr_Function.renderAvatarCricleByName(
                                        dataItem?.EvaluatorImagePath,
                                        dataItem?.EvaluatorName,
                                        16
                                    )}
                                </View>

                                <View>
                                    <Text
                                        numberOfLines={1}
                                        style={[styleSheets.text, { fontSize: Size.text - 1, color: Colors.blue }]}
                                    >
                                        {dataItem?.EvaluatorName}
                                    </Text>
                                </View>
                            </View>

                            <View>
                                <Text numberOfLines={2} style={[styleSheets.text, { fontSize: Size.text - 1 }]}>
                                    {`${translate('HRM_PortalApp_ContractHistory_ContractType')}: `}{' '}
                                    {dataItem?.ContractTypeName}
                                </Text>
                            </View>
                            <View>
                                <Text numberOfLines={1} style={[styleSheets.text, { fontSize: Size.text - 1 }]}>
                                    {`${translate('HRM_PortalApp_ContractHistory_ContractNo')}: `}{' '}
                                    {dataItem?.ContractNo}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const PADDING_DEFINE = Size.defineSpace;
const styles = StyleSheet.create({
    styViewAlignSeft: {
        alignSelf: 'baseline'
    },
    swipeableLayout: {
        flex: 1,
        backgroundColor: Colors.white
    },
    container: {
        flex: 1,
        paddingHorizontal: Size.defineSpace,
        paddingVertical: Size.defineHalfSpace
    },
    styViewTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Size.defineHalfSpace
    },
    leftContent: {
        marginRight: Size.defineHalfSpace,
        justifyContent: 'center'
    },
    contentCenter: {
        flex: 7.2,
        paddingRight: PADDING_DEFINE,
        justifyContent: 'center'
    },
    contentRight: {
        justifyContent: 'center'
    },
    profileText: {
        fontSize: Size.text - 1
    },
    positionText: {
        fontSize: Size.text - 2
    },
    lineSatus: {
        // paddingHorizontal: 3,
        alignItems: 'center',
        // paddingVertical: 2,
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 3
    },
    lineSatus_text: {
        fontSize: Size.text - 3,
        fontWeight: '500'
    },
    styViewMoreInfo: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    // ============= //
    styProgress: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    styLeftProgress: {
        flex: 7.5,
        paddingRight: Size.defineSpace
    },
    styRightProgress: {
        flex: 2.5
    },
    styViewProgress: {
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.gray_5
    },
    styValProgress: {
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.primary
    },
    styTextValProgress: {
        color: Colors.gray_10
    }
});
