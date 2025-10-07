/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Colors, Size, styleSheets } from '../../constants/styleConfig';
import Vnr_Function from '../../utils/Vnr_Function';
import { IconCheck, IconStar, IconStarOutline } from '../../constants/Icons';

export default class ItemUserApprover extends React.PureComponent {
    render() {
        const { dataItem, textField, licensedDisplay, isSelect, onPress, showStar, onToggleStar } = this.props;

        let sub = '';
        if (Array.isArray(licensedDisplay?.UnderName) && licensedDisplay.UnderName.length === 1) {
            sub = dataItem[licensedDisplay.UnderName[0]];
        }

        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                <View
                    style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12 }}
                >
                    <View
                        style={{
                            width: 22,
                            height: 22,
                            borderRadius: 11,
                            borderWidth: isSelect ? 0 : 1.5,
                            borderColor: isSelect ? Colors.primary : Colors.gray_6,
                            backgroundColor: isSelect ? Colors.primary : Colors.white,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {isSelect ? <IconCheck size={Size.text - 1} color={Colors.white} /> : null}
                    </View>

                    <View style={{ marginLeft: 12, flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        {Vnr_Function.renderAvatarCricleByName(
                            dataItem[licensedDisplay?.Avatar?.[0]],
                            dataItem[textField],
                            36
                        )}
                        <View style={{ marginLeft: 10, flex: 1 }}>
                            <Text style={[styleSheets.text]} numberOfLines={1}>
                                {dataItem[textField]}
                            </Text>
                            {!!sub && (
                                <Text
                                    style={[styleSheets.text, { fontSize: 13, color: Colors.gray_7 }]}
                                    numberOfLines={1}
                                >
                                    {sub}
                                </Text>
                            )}
                        </View>
                        {showStar ? (
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={onToggleStar}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                                {dataItem.IsImportant ? (
                                    <IconStar
                                        size={Size.iconSize}
                                        color={Colors.yellow}
                                    />
                                ) : (
                                    <IconStarOutline
                                        size={Size.iconSize}
                                        color={Colors.gray_6}
                                    />
                                )}
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
