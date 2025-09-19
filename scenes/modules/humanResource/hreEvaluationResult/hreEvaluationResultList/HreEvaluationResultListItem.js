import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { styleSheets, Colors, Size } from '../../../../../constants/styleConfig';
import { translate } from '../../../../../i18n/translate';
import { IconCheckCirlce } from '../../../../../constants/Icons';

export default class HreEvaluationResultListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false, //biến hiển thị loading pull to refresh
            dataSource: [],
            page: 1,
            isPullToRefresh: false, // biến dùng phủ định lại dữ liệu để render lại RenderItem
            totalRow: 0
        };
        this.endLoading = false;
        this.callOnEndReached = false;
        this.pageSize = 10;
    }

    render() {
        const { dataItem, index, isItemChecked, isSelect, isDisable } = this.props;
        return (
            <TouchableWithoutFeedback key={index}>
                <View style={styles.contentContainer}>
                    <View>
                        <View
                            style={[
                                styles.styRadiusCheck,
                                isSelect && isItemChecked && styles.styVIewItemChecked,
                                !isSelect &&
                                    isItemChecked && {
                                    backgroundColor: Colors.gray_4
                                }
                            ]}
                        >
                            {isSelect && isItemChecked && (
                                <View style={styles.styViewIconCheck}>
                                    <IconCheckCirlce size={Size.iconSize - 4} color={Colors.primary} />
                                </View>
                            )}
                        </View>
                        <TouchableOpacity
                            disabled={!isSelect && isItemChecked}
                            style={styles.btnLeft_check}
                            activeOpacity={isDisable ? 1 : 0.8}
                            onPress={() => {
                                this.props.onClick();
                            }}
                        />
                    </View>
                    <View style={styles.styViewContant}>
                        <View style={styles.contentHeader}>
                            <Text numberOfLines={2} style={[styleSheets.headerTitleStyle]}>
                                {dataItem.PerformancePlanCodeName}
                            </Text>
                        </View>
                        <View style={styles.contentBody}>
                            <View style={styles.contentItemWrap}>
                                <Text numberOfLines={1} style={[styleSheets.text, styles.textProfileName]}>
                                    {translate('PerformanceTemplateName')}
                                </Text>
                                <Text numberOfLines={1} style={[styleSheets.lable, styles.textExtendInfo]}>
                                    {' '}
                                    {dataItem.TemplateCodeName}
                                </Text>
                            </View>
                            <View style={styles.contentItemWrap}>
                                <Text numberOfLines={1} style={[styleSheets.text, styles.textProfileName]}>
                                    {translate('Score')}
                                </Text>
                                <Text numberOfLines={1} style={[styleSheets.lable, styles.textExtendInfo]}>
                                    {' '}
                                    {dataItem.TotalMark}
                                </Text>
                            </View>
                            <View style={styles.contentItemWrap}>
                                <Text numberOfLines={1} style={[styleSheets.text, styles.textProfileName]}>
                                    {translate('Grade')}
                                </Text>
                                <Text numberOfLines={1} style={[styleSheets.lable, styles.textExtendInfo]}>
                                    {' '}
                                    {dataItem.LevelName}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    styVIewItemChecked: {
        backgroundColor: Colors.white,
        borderRadius: 3,
        borderWidth: 1.3,
        borderColor: Colors.primary,
        overflow: 'hidden'
    },
    styViewIconCheck: { position: 'absolute', left: -0.8, right: -1 },
    styViewContant: { flex: 1, marginLeft: Size.defineHalfSpace },
    styRadiusCheck: {
        width: Size.iconSize - 3,
        height: Size.iconSize - 3,
        borderRadius: (Size.iconSize - 3) / 2,
        borderWidth: 1,
        borderColor: Colors.gray_5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    contentContainer: {
        flexDirection: 'row',
        padding: 12,
        paddingBottom: 4,
        backgroundColor: Colors.white,
        marginTop: Size.defineHalfSpace,
        alignItems: 'center'
    },
    textProfileName: {
        color: Colors.gray_10,
        flex: 0.45
    },
    textExtendInfo: {
        fontWeight: '500',
        color: Colors.gray_10,
        flex: 0.55,
        textAlign: 'right'
    },
    contentHeader: {
        marginBottom: 12
    },
    contentBody: {
        // marginBottom: 8
    },
    btnLeft_check: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: Dimensions.get('window').width / 2,
        zIndex: 2,
        elevation: 2
    },
    contentItemWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    }
});
