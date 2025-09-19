import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Colors, Size, styleSheets } from '../../../../../constants/styleConfig';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { translate } from '../../../../../i18n/translate';

export default class HreWorkManageListItem extends React.Component {
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

        let colorStatusView = null,
            bgStatusView = null,
            valueProgress = (dataItem.CompletedTaskCount / dataItem.TaskCount) * 100;

        // xử lý color
        if (dataItem.itemStatus) {
            const { colorStatus, bgStatus } = dataItem.itemStatus;
            colorStatusView = colorStatus ? colorStatus : null;
            bgStatusView = bgStatus ? bgStatus : null;
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
                                            backgroundColor: bgStatusView
                                                ? Vnr_Function.convertTextToColor(bgStatusView)
                                                : Colors.white
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
                                            }
                                        ]}
                                    >
                                        {dataItem.WorkListStatusView ? dataItem.WorkListStatusView : ''}
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
                                    {`${translate('HRM_System_AsynTask_PercentComplete')}: ${dataItem.ProgressTask}`}
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
