import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { BlurView } from '@react-native-community/blur';

import VnrText from '../../../../../components/VnrText/VnrText';
import { styleSheets, Size, Colors } from '../../../../../constants/styleConfig';
import { translate } from '../../../../../i18n/translate';
import { IconEye } from '../../../../../constants/Icons';
import Vnr_Function from '../../../../../utils/Vnr_Function';

class AttTSLViewHistory extends React.Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.isViewHistory === this.props.isViewHistory) {
            if (Vnr_Function.compare(nextProps.dataItems, this.props.dataItems)) {
                return false;
            } else {
                return true;
            }
        }
        return true;
    }

    loadingHisLog = () => {
        const lstDataHis = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
        return (
            <View style={styles.styViewHisLog}>
                {lstDataHis.map((item, index) => (
                    <View key={index} style={styles.styViewHisLogItem}>
                        <View style={styles.styLine}>
                            <View style={styles.styHisLineDot} />
                            <View style={styles.styHisLineTime} />
                            {index == 0 && <View style={styles.styLineTop} />}

                            {index == lstDataHis.length - 1 && <View style={styles.styLineBottom} />}
                        </View>
                        <View style={styles.styHisLogContent}>
                            <View style={styles.styLoadHisLogLeft} />

                            <View style={styles.styViewHisLogRight}>
                                <View style={styles.styLogHisLogRightItem} />
                            </View>
                        </View>
                    </View>
                ))}

                <BlurView
                    style={[styles.styLoadingblur]}
                    blurType="light"
                    blurAmount={10}
                    reducedTransparencyFallbackColor="white"
                />

                <TouchableOpacity
                    style={styles.styBtnViewLog}
                    onPress={() => {
                        this.props.onViewHistory();
                    }}
                >
                    <IconEye size={Size.iconSize - 7} color={Colors.gray_10} />
                    <VnrText
                        style={[styleSheets.text, styles.styBtnViewLogTitle]}
                        i18nKey={'HRM_PortalApp_ViewHistory'}
                    />
                </TouchableOpacity>
            </View>
        );
    };

    render() {
        const { dataItems, isViewHistory } = this.props;
        return isViewHistory ? (
            <ScrollView contentContainerStyle={styles.styHisLogScroll}>
                <View style={styles.styViewHisLog}>
                    {dataItems.map((item, index) => (
                        <View key={index} style={styles.styViewHisLogItem}>
                            <View style={styles.styLine}>
                                <View style={styles.styLineDot} />
                                <View style={styles.styLineTime} />
                                {index == 0 && <View style={styles.styLineTop} />}

                                {index == dataItems.length - 1 && <View style={styles.styLineBottom} />}
                            </View>
                            <View style={styles.styHisLogContent}>
                                <View style={styles.styViewHisLogLeft}>
                                    <Text style={[styleSheets.text, styles.styHisLogLfTxtDate]}>
                                        {`${translate(
                                            `E_${moment(moment(item.Workdate).format('MM/DD/YYYY')).format(
                                                'dddd'
                                            )}`.toUpperCase()
                                        )}, ${moment(item.date).format('DD/MM/YYYY')}`}
                                    </Text>
                                </View>

                                <View style={styles.styViewHisLogRight}>
                                    <View style={styles.styViewHisLogRightItem}>
                                        <Text
                                            style={[
                                                styleSheets.lable,
                                                styles.styLogRtTxtTime,
                                                item.InTime1 && item.InTime1 !== ''
                                                    ? { color: Colors.gray_10 }
                                                    : { color: Colors.red }
                                            ]}
                                        >
                                            {item.InTime1 && item.InTime1 !== ''
                                                ? moment(item.InTime1)
                                                    .format('LT')
                                                    .slice(
                                                        0,
                                                        moment(item.InTime1)
                                                            .format('LT')
                                                            .indexOf(' ')
                                                    )
                                                : '??'}
                                        </Text>
                                        <Text style={[styleSheets.lable, styles.styLogRtTxtTime]}> - </Text>
                                        <Text
                                            style={[
                                                styleSheets.lable,
                                                styles.styLogRtTxtTime,
                                                item.Outtime1 && item.Outtime1 !== ''
                                                    ? { color: Colors.gray_10 }
                                                    : { color: Colors.red }
                                            ]}
                                        >
                                            {item.Outtime1 && item.Outtime1 !== ''
                                                ? moment(item.Outtime1)
                                                    .format('LT')
                                                    .slice(
                                                        0,
                                                        moment(item.Outtime1)
                                                            .format('LT')
                                                            .indexOf(' ')
                                                    )
                                                : '??'}
                                        </Text>
                                    </View>
                                    <View style={styles.styViewHisLogRightItem}>
                                        <Text
                                            style={[
                                                styleSheets.lable,
                                                styles.styLogRtTxtTime,
                                                item.InTime2 && item.InTime2 !== ''
                                                    ? { color: Colors.gray_10 }
                                                    : { color: Colors.red }
                                            ]}
                                        >
                                            {item.InTime2 && item.InTime2 !== ''
                                                ? moment(item.InTime2)
                                                    .format('LT')
                                                    .slice(
                                                        0,
                                                        moment(item.InTime2)
                                                            .format('LT')
                                                            .indexOf(' ')
                                                    )
                                                : '??'}
                                        </Text>
                                        <Text style={[styleSheets.lable, styles.styLogRtTxtTime]}> - </Text>
                                        <Text
                                            style={[
                                                styleSheets.lable,
                                                styles.styLogRtTxtTime,
                                                item.Outtime2 && item.Outtime2 !== ''
                                                    ? { color: Colors.gray_10 }
                                                    : { color: Colors.red }
                                            ]}
                                        >
                                            {item.Outtime2 && item.Outtime2 !== ''
                                                ? moment(item.Outtime2)
                                                    .format('LT')
                                                    .slice(
                                                        0,
                                                        moment(item.Outtime2)
                                                            .format('LT')
                                                            .indexOf(' ')
                                                    )
                                                : '??'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))}
                    <VnrText
                        style={styles.txtTimekeepingHistoryIn7Day}
                        i18nKey={'HRM_ProtalApp_Wd_ListTimekeepingHistoryIn7Day'}
                    />
                </View>
            </ScrollView>
        ) : (
            this.loadingHisLog()
        );
    }
}

const SIZE_CIRCLE = Size.deviceWidth * 0.6;

const styles = StyleSheet.create({
    styHisLogScroll: {
        marginTop: -Size.defineHalfSpace,
        paddingBottom: SIZE_CIRCLE / 2 + Size.defineSpace
    },
    styViewHisLog: {
        flex: 1,
        paddingVertical: Size.defineHalfSpace,
        position: 'relative'
    },
    styViewHisLogItem: {
        flexDirection: 'row',
        paddingHorizontal: Size.defineSpace
    },
    styLineDot: {
        height: 10,
        width: 10,
        backgroundColor: Colors.gray_7,
        borderRadius: 5,
        zIndex: 3
    },
    styLine: {
        // /width: 20,
        height: 'auto',
        justifyContent: 'center',
        position: 'relative',
        marginRight: Size.defineSpace
    },
    styLineTime: {
        position: 'absolute',
        width: 0,
        height: '100%',
        top: 0,
        left: 5,
        borderStyle: 'dashed',
        borderRightWidth: 1,
        borderRightColor: Colors.gray_5,
        zIndex: 1
    },
    styLineTop: {
        position: 'absolute',
        top: 0,
        height: '50%',
        width: '100%',
        backgroundColor: Colors.white,
        zIndex: 2
    },
    styLineBottom: {
        position: 'absolute',
        bottom: 0,
        height: '60%',
        width: '100%',
        backgroundColor: Colors.gray_2,
        zIndex: 2
    },
    styHisLogContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 4,
        backgroundColor: Colors.gray_2,
        paddingHorizontal: Size.defineHalfSpace,
        marginVertical: Size.defineHalfSpace
    },
    styViewHisLogLeft: {
        flex: 1,
        justifyContent: 'center'
    },
    styViewHisLogRight: {
        paddingVertical: Size.defineHalfSpace
    },
    styViewHisLogRightItem: {
        flexDirection: 'row',
        marginRight: Size.defineHalfSpace + 3,
        alignItems: 'center'
    },
    styLogRtTxtTime: {
        fontSize: Size.text - 2,
        fontWeight: Platform.OS == 'ios' ? '500' : '700',
        color: Colors.black,
        marginLeft: 3
    },
    styHisLogLfTxtDate: {
        fontSize: Size.text - 2,
        color: Colors.gray_7
    },
    styHisLineDot: {
        height: 8,
        width: 8,
        backgroundColor: Colors.gray_7,
        borderRadius: 4,
        zIndex: 3
    },
    styHisLineTime: {
        position: 'absolute',
        width: 0,
        height: '100%',
        top: 0,
        left: 5,
        borderStyle: 'dashed',
        borderRightWidth: 1,
        borderRightColor: Colors.gray_5,
        zIndex: 1
    },
    styLogHisLogRightItem: {
        width: Size.deviceWidth * 0.2,
        height: 20,
        backgroundColor: Colors.gray_5,
        justifyContent: 'center',
        borderRadius: 4
    },
    styLoadingblur: {
        position: 'absolute',
        top: 0,
        width: Size.deviceWidth,
        height: Size.deviceheight,
        opacity: 0.8,
        zIndex: 3
    },
    styBtnViewLog: {
        position: 'absolute',
        bottom: Size.headerHeight / 4.7 + SIZE_CIRCLE,
        left: (Size.deviceWidth - Size.deviceWidth * 0.7) / 2,
        width: Size.deviceWidth * 0.7,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 4,
        borderColor: Colors.gray_7,
        borderWidth: 1,
        borderStyle: 'dashed',
        zIndex: 4,
        flexDirection: 'row'
    },
    styBtnViewLogTitle: {
        marginLeft: 5
    },
    styLoadHisLogLeft: {
        width: Size.deviceWidth * 0.3,
        height: 20,
        backgroundColor: Colors.gray_5,
        justifyContent: 'center',
        marginTop: Size.defineHalfSpace,
        borderRadius: 4
    },
    txtTimekeepingHistoryIn7Day: {
        textAlign: 'center',
        fontSize: 16,
        color: Colors.gray_8,
        fontWeight: '400',
        paddingVertical: 12
    }
});

export default AttTSLViewHistory;
