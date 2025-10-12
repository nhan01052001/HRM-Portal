import React, { Component } from 'react'
import { Image, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors, CustomStyleSheet, Size, styleSheets, stylesScreenDetailV3 } from '../../../../../constants/styleConfig';
import { translate } from '../../../../../i18n/translate';
import { IconShowDownChevron, IconShowUpChevron, IconUser } from '../../../../../constants/Icons';
import moment from 'moment';

class ViewMovementHistoryInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: true
        };
    }
    render() {
        const { configListDetail, data } = this.props,
            { isShow } = this.state;

        if (!Array.isArray(data) || data.length === 0 || !configListDetail)
            return <View />;

        const col = configListDetail[0];

        return (
            <View style={CustomStyleSheet.marginBottom(12)}>
                <TouchableOpacity
                    style={[
                        stylesScreenDetailV3.styItemContentGroup,
                        !isShow && stylesScreenDetailV3.styItemGroupCollapse,
                        CustomStyleSheet.marginVertical(0),
                        CustomStyleSheet.marginBottom(4),
                        CustomStyleSheet.justifyContent('space-between')
                    ]}
                    activeOpacity={0.7}
                    disabled={!col.isCollapse}
                    onPress={() => this.setState({ isShow: !isShow })}
                >
                    <Text style={[styleSheets.lable, styles.textLable]}>
                        {translate(col.DisplayKey)}
                    </Text>
                    {col.isCollapse && (
                        <View style={CustomStyleSheet.marginRight(styleSheets.p_10)}>
                            {isShow ? (
                                <IconShowUpChevron size={Size.iconSize} color={Colors.black} />
                            ) : (
                                <IconShowDownChevron size={Size.iconSize} color={Colors.black} />
                            )}
                        </View>
                    )}
                </TouchableOpacity>

                {
                    isShow
                        ? (data.map((value, i) => {
                            return (
                                <View style={[CustomStyleSheet.flex(1), CustomStyleSheet.paddingHorizontal(styleSheets.p_10)]} key={i}>
                                    <View style={CustomStyleSheet.flexDirection('row')}>
                                        <View style={[CustomStyleSheet.height('100%'), CustomStyleSheet.alignItems('center')]}>
                                            <View
                                                style={styles.circle}
                                            >
                                                <Image
                                                    source={require('../../../../../assets/images/hreRecruitment/company.png')}
                                                    style={
                                                        [
                                                            CustomStyleSheet.width(12),
                                                            CustomStyleSheet.height(12)
                                                        ]
                                                    }
                                                />

                                            </View>
                                            <View
                                                style={[
                                                    CustomStyleSheet.width(1),
                                                    CustomStyleSheet.backgroundColor(Colors.gray_5),
                                                    i === data.length - 1
                                                        ? CustomStyleSheet.flex(1)
                                                        : CustomStyleSheet.height('100%')
                                                ]}
                                            />
                                        </View>
                                        <View style={CustomStyleSheet.flex(1)}>
                                            <View style={styles.wrapTextDateStartDateEnd_Line}>
                                                <View
                                                    style={styles.wrapTextDateStartDateEnd}
                                                >
                                                    <Text style={[styleSheets.text]}>
                                                        {value?.DateStart ? moment(value?.DateStart).format('MM/YYYY') : ''}
                                                    </Text>
                                                    <View>
                                                        <Image
                                                            source={require('../../../../../assets/images/vnrDateFromTo/picker-separator.png')}
                                                        />
                                                    </View>
                                                    <Text style={[styleSheets.text]}>
                                                        {value?.DateFinish ? moment(value?.DateFinish).format('MM/YYYY') : ''}
                                                    </Text>
                                                </View>
                                                <View style={styles.lineHorizontal} />
                                            </View>
                                            <ScrollView style={{ paddingLeft: Size.defineSpace / 2 }}>
                                                {
                                                    value?.CompanyName
                                                    && <View>
                                                        <Text style={[styleSheets.lable]}>{value?.CompanyName}</Text>
                                                    </View>
                                                }
                                                <View
                                                    style={styles.wrapIcon_Position}
                                                >
                                                    <IconUser size={22} color={Colors.blue} />
                                                    <Text style={[styleSheets.lable, CustomStyleSheet.marginLeft(4)]}>{value?.PositionLast}</Text>
                                                </View>
                                            </ScrollView>
                                        </View>
                                    </View>
                                </View>
                            )
                        }))
                        : <View />
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    circle: {
        backgroundColor: Colors.gray_5,
        width: 24,
        height: 24,
        borderRadius: 24,
        marginTop: Size.defineSpace / 2 - 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.white
    },

    wrapTextDateStartDateEnd_Line: {
        paddingLeft: Size.defineSpace / 2,
        flexDirection: 'row',
        alignItems: 'center'
    },

    lineHorizontal: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.gray_6,
        marginLeft: 8
    },

    wrapTextDateStartDateEnd: {
        flexDirection: 'row'
    },

    wrapIcon_Position: {
        flexDirection: 'row',
        marginTop: 2,
        alignItems: 'center'
    },

    textLable: {
        color: Colors.black,
        fontSize: Size.text + 1,
        marginLeft: styleSheets.p_10
    }
});

export default ViewMovementHistoryInfo;