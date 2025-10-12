import React, { createRef } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Colors, styleSheets, Size, CustomStyleSheet } from '../../constants/styleConfig';
import VnrText from '../../components/VnrText/VnrText';
import Vnr_Function from '../../utils/Vnr_Function';

export default class RenderTopTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isRefresh: false
        };

        this.scrollView = createRef(null);
    }

    shouldComponentUpdate(nextProps) {
        return (
            !Vnr_Function.compare(nextProps?.data, this.props?.data) ||
            !Vnr_Function.compare(
                nextProps?.navigationAll?.navigation?.state,
                this.props?.navigationAll?.navigation?.state
            )
        );
    }

    render() {
        const { data, navigationAll } = this.props;
        const { navigation } = navigationAll,
            { index, routes } = navigation.state,
            getNameTab = routes[index] ? routes[index]['key'] : null;

        return (
            <View style={[styles.containTab, data.length === 1 && styles.jus_ali_center]}>
                {
                    data && data.length == 2 ? (
                        <View
                            style={styles.styViewTabTwo}
                            ref={ref => (this.scrollView = ref)}
                        >
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
                                            navigation.navigate(value.screenName);
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
                            ref={ref => (this.scrollView = ref)}
                            onLayout={() => {
                                if (index !== 0) {
                                    if (this.scrollView) {
                                        if (index > (data.length / 2)) {
                                            this.scrollView.scrollToEnd({ animated: true });
                                        }
                                        else
                                            this.scrollView.scrollTo({ x: (index * 100) / 2, y: 0, animated: true });
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
                                                data.length === 1 && { width: Size.deviceWidth / data.length - 32 }
                                            ]}
                                            onPress={() => {
                                                if (this.scrollView) {
                                                    if (i > data.length / 2) this.scrollView.scrollToEnd({ animated: true });
                                                    else this.scrollView.scrollTo({ x: (i * 100) / 2, y: 0, animated: true });
                                                }
                                                navigation.navigate(value.screenName);
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
                                        </TouchableOpacity>
                                        {value.screenName == getNameTab && <View style={styles.customBorderBottom} />}
                                    </View>
                                );
                            })}
                        </ScrollView>
                    )
                }

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
    styViewTabTwo:{
        flex:1,
        flexDirection :'row',
        paddingHorizontal : Size.defineSpace
    },
    tabStyle: {
        height: '100%',
        paddingHorizontal: Size.defineSpace,
        // width: 90,
        justifyContent: 'center',
        alignItems: 'center'
        // borderRadius: 4
    },
    tabTwoStyle : {
        flex :1,
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
    styleTabTwoActive :{
        backgroundColor: Colors.white,
        borderBottomColor : Colors.primary,
        borderBottomWidth : 2.2
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
    }
});
