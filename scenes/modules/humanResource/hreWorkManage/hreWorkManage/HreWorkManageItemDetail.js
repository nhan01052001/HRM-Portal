/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { styleSheets, Size, Colors, CustomStyleSheet } from '../../../../../constants/styleConfig';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { translate } from '../../../../../i18n/translate';
import { IconTime, IconCheck } from '../../../../../constants/Icons';
import moment from 'moment';
import { Swipeable } from 'react-native-gesture-handler';

const sizeText1 = Size.text + 1;

class HreWorkManageItemDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.refSwipe = null;
    }
    render() {
        const {
            item,
            rightActions,
            listItemOpenSwipeOut,
            isDisable,
            handerOpenSwipeOut,
            index,
            onPress,
            maxWidth,
            configFileAttach
        } = this.props;

        const EnumColors = {
            E_GREEN: {
                bgColors: '82, 196, 26, 0.08',
                colors: '#52C41A'
            },
            E_BLACK: {
                bgColors: '0, 0, 0, 0.08',
                colors: '#262626'
            },
            E_RED: {
                bgColors: '245, 34, 45, 0.08',
                colors: '#F5222D'
            },
            E_ORANGE: {
                bgColors: '250, 140, 22, 0.08',
                colors: '#FA541C'
            }
        };

        return (
            <Swipeable
                ref={ref => {
                    this.refSwipe = ref;
                    if (
                        listItemOpenSwipeOut.findIndex(value => {
                            return value['ID'] == index;
                        }) < 0
                    ) {
                        listItemOpenSwipeOut.push({ ID: index, value: ref });
                    } else {
                        listItemOpenSwipeOut[index].value = ref;
                    }
                }}
                overshootRight={false}
                renderRightActions={() => rightActions}
                // friction={0.6}
                containerStyle={[
                    CustomStyleSheet.flex(1)
                ]}
            >
                <View style={CustomStyleSheet.flex(1)}>
                    <TouchableOpacity
                        onPressIn={() => handerOpenSwipeOut && handerOpenSwipeOut(index)}
                        disabled={isDisable}
                        activeOpacity={0.7}
                        style={styles.item}
                        onPress={() => {
                            onPress();
                        }}
                    >
                        <View style={CustomStyleSheet.justifyContent('center')}>
                            {isDisable || item?.isSelected ? (
                                <View style={styles.checked}>
                                    <IconCheck size={16} color={Colors.white} />
                                </View>
                            ) : (
                                <View style={styles.unCheck} />
                            )}
                        </View>
                        <View style={CustomStyleSheet.marginLeft(7)}>
                            <View>
                                <Text
                                    numberOfLines={2}
                                    style={[
                                        styleSheets.lable,
                                        {
                                            fontSize: Size.text + 3
                                        },
                                        isDisable && styles.textTaskCompleted
                                    ]}
                                >
                                    {item?.WorkListCode} - {item?.WorkListName}
                                </Text>
                            </View>
                            <View style={styles.flex_Row_Ali_Center}>
                                {item?.ColorDate && (
                                    <View style={styles.dateCompleted}>
                                        <IconTime
                                            size={16}
                                            color={item?.Color ? EnumColors[(item?.Color)]?.colors : Colors.black}
                                        />
                                        <Text
                                            style={[
                                                styleSheets.lable,
                                                // eslint-disable-next-line react-native/no-color-literals
                                                {
                                                    marginLeft: 6,
                                                    color: item?.Color ? EnumColors[(item?.Color)]?.colors : null
                                                }
                                            ]}
                                        >
                                            {item?.ColorDate ? moment(item?.ColorDate).format('DD/MM/YYYY') : ''}
                                        </Text>
                                    </View>
                                )}
                                <View
                                    style={[
                                        styles.wrapImgAndName,
                                        {
                                            maxWidth: maxWidth
                                        }
                                    ]}
                                >
                                    {Vnr_Function.renderAvatarCricleByName(
                                        item?.ImplementerImagePath,
                                        item?.ImplementerName,
                                        24
                                    )}
                                    <Text numberOfLines={1} style={[styleSheets.lable, styles.textProfileName]}>
                                        {item?.ImplementerName}
                                    </Text>
                                </View>
                            </View>
                            {item?.IsArrear && item?.Status === 'E_DONE' && (
                                <View style={{ paddingVertical: 6 }}>
                                    <View style={styles.flex_Row_Ali_Center}>
                                        <Text style={[styleSheets.text, { fontSize: sizeText1 }]}>
                                            {translate('HRM_PortalApp_Tas_AmountOfArrears')}{' '}
                                        </Text>
                                        <Text style={[styleSheets.lable, { fontSize: sizeText1 }]}>
                                            {item?.AmountOfArrears}
                                        </Text>
                                    </View>

                                    {configFileAttach.map(e => {
                                        if (e.TypeView != 'E_COMMON_PROFILE')
                                            return Vnr_Function.formatStringTypeV3(item, e, configFileAttach);
                                    })}

                                    <View style={styles.flex_Row_Ali_Center}>
                                        <Text style={[styleSheets.text, { fontSize: sizeText1 }]}>
                                            {translate('HRM_PortalApp_Tas_Note')}{' '}
                                        </Text>
                                        <Text style={[styleSheets.lable, { fontSize: sizeText1 }]}>{item?.Note}</Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            </Swipeable>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.gray_2,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5
    },

    checked: {
        width: 24,
        height: 24,
        borderRadius: 24,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center'
    },

    unCheck: {
        width: 24,
        height: 24,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: Colors.gray_5,
        backgroundColor: Colors.white
    },

    textTaskCompleted: {
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid'
    },

    textProfileName: {
        fontSize: Size.text + 2,
        color: Colors.primary,
        marginLeft: 4,
        maxWidth: '100%'
    },

    wrapImgAndName: {
        marginLeft: 4,
        flexDirection: 'row',
        alignItems: 'center'
    },

    dateCompleted: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 2,
        paddingHorizontal: 4,
        alignSelf: 'baseline'
    },

    flex_Row_Ali_Center: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export default HreWorkManageItemDetail;
