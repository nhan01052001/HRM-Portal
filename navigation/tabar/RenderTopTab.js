import React, { createRef } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Colors, styleSheets, Size, CustomStyleSheet } from '../../constants/styleConfig';
import VnrText from '../../components/VnrText/VnrText';
import Vnr_Function from '../../utils/Vnr_Function';
import HttpService from '../../utils/HttpService';
import { EnumName } from '../../assets/constant';
import { Text } from 'react-native';

export default class RenderTopTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isRefresh: false,
            countData: {
                CountSubmitTemp: 0,
                CountWaitApprove: 0,
                CountApproved: 0,
                CountRejected: 0,
                CountCancelled: 0,
                CountConfirmed: 0
            }
        };

        this.scrollView = createRef(null);
    }

    componentDidMount() {
        if (this.props?.isShowCountData)
            HttpService.Post('[URI_CENTER]/api/Att_OvertimePlan/GetCountDataGridOvertimePlan', {}).then((res) => {
                if (res?.Status === EnumName.E_SUCCESS && res?.Data && Object.keys(res?.Data).length > 0) {
                    const total = Object.values(res?.Data).reduce((sum, val) => sum + val, 0);
                    this.setState({
                        countData: { ...res?.Data, CountAll: total }
                    });
                }
            });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            !Vnr_Function.compare(nextProps?.data, this.props?.data) ||
            !Vnr_Function.compare(
                nextProps?.navigationAll?.navigation?.state,
                this.props?.navigationAll?.navigation?.state
            ) ||
            !Vnr_Function.compare(nextState?.countData, this.state?.countData)
        );
    }

    render() {
        const { data, navigationAll } = this.props;
        const { navigation } = navigationAll,
            { index, routes } = navigation.state,
            getNameTab = routes[index] ? routes[index]['key'] : null,
            params = navigation.state?.params ? navigation.state?.params : null;
        const { countData } = this.state;

        return (
            <View style={[styles.containTab, data.length === 1 && styles.jus_ali_center]}>
                {data && data.length == 2 ? (
                    <View style={styles.styViewTabTwo} ref={(ref) => (this.scrollView = ref)}>
                        {data.map((value, i) => {
                            return (
                                <TouchableOpacity
                                    key={i}
                                    disabled={data.length === 1 ? true : false}
                                    activeOpacity={0.6}
                                    style={[
                                        styles.tabTwoStyle,
                                        value.screenName == getNameTab && styles.styleTabTwoActive,
                                        data.length === 1 && { width: Size.deviceWidth / data.length - 32 }
                                    ]}
                                    onPress={() => {
                                        navigation.navigate(value.screenName, params);
                                    }}
                                >
                                    <VnrText
                                        i18nKey={value.title}
                                        style={[
                                            styleSheets.text,
                                            value.screenName == getNameTab
                                                ? styles.text_colorSecondary
                                                : styles.text_colorGray,
                                            CustomStyleSheet.textAlign('center')
                                        ]}
                                    />
                                    {this.props?.isShowCountData && (
                                        <View
                                            style={[
                                                styles.wrapCount,
                                                CustomStyleSheet.backgroundColor(
                                                    value.screenName == getNameTab ? Colors.primary_1 : Colors.gray_4
                                                )
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.textCount,
                                                    CustomStyleSheet.color(
                                                        value.screenName == getNameTab ? Colors.primary : Colors.gray_8
                                                    )
                                                ]}
                                            >
                                                {value?.fieldCount ? (countData?.[value?.fieldCount] ?? 0) : 0}
                                            </Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ) : (
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={[
                            styles.styScroll,
                            CustomStyleSheet.width('auto'),
                            data.length === 1 && styles.jus_ali_center
                        ]}
                        ref={(ref) => (this.scrollView = ref)}
                        onLayout={() => {
                            if (index !== 0) {
                                if (this.scrollView) {
                                    if (index > data.length / 2) {
                                        this.scrollView.scrollToEnd({ animated: true });
                                    } else this.scrollView.scrollTo({ x: (index * 100) / 2, y: 0, animated: true });
                                }
                            }
                        }}
                    >
                        {data.map((value, i) => {
                            return (
                                <View key={i}>
                                    <TouchableOpacity
                                        disabled={data.length === 1 ? true : false}
                                        activeOpacity={0.6}
                                        style={[
                                            styles.tabStyle,
                                            value.screenName == getNameTab && styles.styleTabActive,
                                            data.length === 1 && { width: Size.deviceWidth / data.length - 32 },
                                            this.props?.isShowCountData && CustomStyleSheet.flexDirection('row')
                                        ]}
                                        onPress={() => {
                                            if (this.scrollView) {
                                                if (i > data.length / 2)
                                                    this.scrollView.scrollToEnd({ animated: true });
                                                else
                                                    this.scrollView.scrollTo({
                                                        x: (i * 100) / 2,
                                                        y: 0,
                                                        animated: true
                                                    });
                                            }
                                            navigation.navigate(value.screenName, params);
                                        }}
                                    >
                                        <VnrText
                                            i18nKey={value.title}
                                            style={[
                                                styleSheets.text,
                                                value.screenName == getNameTab
                                                    ? styles.text_colorSecondary
                                                    : styles.text_colorGray,
                                                CustomStyleSheet.textAlign('center')
                                            ]}
                                        />
                                        {this.props?.isShowCountData && (
                                            <View
                                                style={[
                                                    styles.wrapCount,
                                                    CustomStyleSheet.backgroundColor(
                                                        value.screenName == getNameTab
                                                            ? Colors.primary_1
                                                            : Colors.gray_4
                                                    )
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.textCount,
                                                        CustomStyleSheet.color(
                                                            value.screenName == getNameTab
                                                                ? Colors.primary
                                                                : Colors.gray_8
                                                        )
                                                    ]}
                                                >
                                                    {value?.fieldCount ? (countData?.[value?.fieldCount] ?? 0) : 0}
                                                </Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                    {value.screenName == getNameTab && <View style={styles.customBorderBottom} />}
                                </View>
                            );
                        })}
                    </ScrollView>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containTab: {
        flex: 1,
        maxHeight: 55,
        backgroundColor: Colors.white
    },
    styViewTabTwo: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: Size.defineSpace
    },
    tabStyle: {
        height: '100%',
        paddingHorizontal: Size.defineSpace,
        // width: 90,
        justifyContent: 'center',
        alignItems: 'center'
        // borderRadius: 4
    },
    tabTwoStyle: {
        flex: 1,
        height: '100%',
        paddingHorizontal: Size.defineSpace,
        // width: 90,
        justifyContent: 'center',
        alignItems: 'center'
        // borderRadius: 4
    },
    text_colorGray: {
        color: Colors.gray_8
    },
    text_colorSecondary: {
        color: Colors.primary,
        fontWeight: Platform.OS == 'android' ? '600' : '500'
    },
    styleTabActive: {
        backgroundColor: Colors.white
    },
    styleTabTwoActive: {
        backgroundColor: Colors.white,
        borderBottomColor: Colors.primary,
        borderBottomWidth: 2.2
    },
    styScroll: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingHorizontal: Size.defineSpace,
        paddingVertical: Size.defineHalfSpace
    },

    jus_ali_center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    customBorderBottom: {
        borderBottomWidth: 3,
        borderBottomColor: Colors.primary,
        height: 2,
        width: '90%',
        alignSelf: 'center',
        marginTop: 5,
        borderRadius: 2
    },

    wrapCount: {
        width: 24,
        height: 24,
        borderRadius: 24,
        marginLeft: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },

    textCount: {
        fontSize: 12,
        fontWeight: '400'
    }
});
