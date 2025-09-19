import React, { Component } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import {
    Colors,
    CustomStyleSheet,
    Size,
    styleSheets,
    stylesScreenDetailV3
} from '../../../../../constants/styleConfig';
import { translate } from '../../../../../i18n/translate';
import { IconShowDownChevron, IconShowUpChevron, IconUserFullColor } from '../../../../../constants/Icons';
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

        if (!Array.isArray(data) || data.length === 0 || !configListDetail) return <View />;

        const col = configListDetail[0];

        return (
            <View>
                <TouchableOpacity
                    style={[
                        stylesScreenDetailV3.styItemContentGroup,
                        !isShow && stylesScreenDetailV3.styItemGroupCollapse,
                        CustomStyleSheet.marginVertical(0),
                        CustomStyleSheet.justifyContent('space-between')
                    ]}
                    activeOpacity={0.7}
                    disabled={!col.isCollapse}
                    onPress={() => this.setState({ isShow: !isShow })}
                >
                    <Text style={[styleSheets.lable, styles.textLable]}>{translate(col.DisplayKey)}</Text>
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

                {isShow ? (
                    <View style={CustomStyleSheet.paddingVertical(Size.defineHalfSpace)}>
                        {
                            data.map((value, i) => {
                                return (
                                    <View style={styles.styRowdata} key={i}>
                                        <View style={styles.styLeftRow}>
                                            <View style={styles.circle}>
                                                <Image
                                                    source={require('../../../../../assets/images/hreRecruitment/company.png')}
                                                    style={styles.styImgCam}
                                                />
                                            </View>
                                            <View style={styles.styLineVertical} />
                                        </View>
                                        <View style={styles.styRightRow}>
                                            <View style={styles.wrapTextDateStartDateEnd_Line}>
                                                <View style={styles.wrapTextDateStartDateEnd}>
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
                                            <View style={styles.styMainInfo}>
                                                {value?.CompanyName && (
                                                    <Text style={[styleSheets.lable, styles.styTextCompany]}>
                                                        {value?.CompanyName}
                                                    </Text>
                                                )}
                                                <View style={styles.wrapIcon_Position}>
                                                    <IconUserFullColor size={Size.iconSize - 2} color={Colors.blue} />
                                                    <Text style={[styleSheets.text, styles.styLastText]}>
                                                        {value?.PositionLast ? value?.PositionLast : ''}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                );
                            })
                        }
                    </View>
                ) : (
                    <View />
                )}
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
    styMainInfo: {
        paddingVertical: Size.defineHalfSpace,
        paddingLeft: Size.defineSpace / 2
    },
    styImgCam:{
        width : 25,
        height : 25
    },
    wrapTextDateStartDateEnd_Line: {
        paddingLeft: Size.defineSpace / 2,
        flexDirection: 'row',
        alignItems: 'center'
    },
    styTextCompany: {
        fontSize: Size.text + 1,
        fontWeight: '600'
    },
    styRowdata: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: Size.defineHalfSpace
    },
    styRightRow: {
        flex: 1
    },
    styLeftRow: {
        height: 'auto',
        alignItems: 'center',
        paddingBottom : Size.defineSpace
    },
    styLineVertical: {
        width: 0.5,
        height: '80%',
        backgroundColor: Colors.gray_5
    },
    lineHorizontal: {
        flex: 1,
        height: 0.5,
        backgroundColor: Colors.gray_5,
        marginLeft: 8
    },
    styLastText : {
        marginLeft : 5
    },
    wrapTextDateStartDateEnd: {
        flexDirection: 'row'
    },

    wrapIcon_Position: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginTop : 5
    },

    textLable: {
        color: Colors.black,
        fontSize: Size.text + 1,
        marginLeft: styleSheets.p_10
    }
});

export default ViewMovementHistoryInfo;
