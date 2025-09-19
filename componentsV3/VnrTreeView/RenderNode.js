/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Colors, styleSheets, Size, CustomStyleSheet } from '../../constants/styleConfig';

import CheckBox from 'react-native-check-box';
import { IconDown, IconRight, IconGroupUser, IconUser } from '../../constants/Icons';

export default class RenderNode extends React.Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        if (
            this.props.cloneNode.isChecked === nextProps.cloneNode.isChecked &&
            this.props.cloneNode.isExpanded === nextProps.cloneNode.isExpanded
        ) {
            return false;
        }
        return true;
    }

    render() {
        const { cloneNode, checkedNode, expandChild, level, isDisable } = this.props;

        let display = '';

        if (cloneNode.NameFilter && cloneNode.NameFilter !== '') {
            let _splitName = cloneNode.Name.split(cloneNode.NameFilter);
            let lenNameFilter = _splitName.length;

            display = _splitName.map((sub, i) => {
                if (i < lenNameFilter - 1) {
                    return (
                        <Text>
                            {sub}
                            <Text style={{ backgroundColor: Colors.yellow }}>{cloneNode.NameFilter}</Text>
                        </Text>
                    );
                } else if (i == lenNameFilter - 1) {
                    return <Text>{sub}</Text>;
                }
            });
        } else {
            display = <Text>{cloneNode.Name}</Text>;
        }
        return cloneNode.hasChildren ? (
            <View style={{ marginLeft: level * 15, flexDirection: 'row' }}>
                <TouchableOpacity
                    style={{
                        // backgroundColor: Colors.grey,
                        height: 45,
                        paddingRight: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: isDisable ? 0.5 : 1
                    }}
                    activeOpacity={0.2}
                    onPress={() => expandChild(cloneNode)}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        {cloneNode.isExpanded ? (
                            <IconDown size={Size.iconSize + 2} color={Colors.grey} />
                        ) : (
                            <IconRight size={Size.iconSize + 2} color={Colors.grey} />
                        )}
                        <CheckBox
                            checkBoxColor={Colors.black}
                            checkedCheckBoxColor={Colors.primary}
                            onClick={() => {
                                !isDisable ? checkedNode(cloneNode) : null;
                            }}
                            disabled={isDisable}
                            isChecked={cloneNode.isChecked}
                        />
                        {/* <Image
                            style={{ width: 20, height: 20, marginHorizontal: 7 }}
                            source={group}
                        /> */}
                        <View style={CustomStyleSheet.marginHorizontal(7)}>
                            <IconGroupUser
                                size={Size.iconSize}
                                color={cloneNode.isChecked ? Colors.primary : Colors.grey}
                            />
                        </View>

                        {cloneNode.Inactive ? (
                            <Text style={[styleSheets.text, { color: Colors.orangeOpacity80 }]}>{display}</Text>
                        ) : (
                            <Text style={[styleSheets.text]}>{display}</Text>
                        )}
                    </View>
                </TouchableOpacity>
            </View>
        ) : (
            <View style={{ marginLeft: level * 15 + 40, flexDirection: 'row', padding: 7 }}>
                <View
                    style={{
                        height: 30,
                        paddingRight: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        opacity: isDisable ? 0.5 : 1
                    }}
                >
                    <CheckBox
                        checkBoxColor={Colors.black}
                        checkedCheckBoxColor={Colors.primary}
                        onClick={() => {
                            !isDisable ? checkedNode(cloneNode) : null;
                        }}
                        disabled={isDisable}
                        isChecked={cloneNode.isChecked}
                    />
                    <View style={CustomStyleSheet.marginHorizontal(7)}>
                        <IconUser size={Size.iconSize} color={cloneNode.isChecked ? Colors.primary : Colors.grey} />
                    </View>
                    {/* <Image
                            style={{ width: 20, height: 20, marginHorizontal: 7 }}
                            source={user}
                        /> */}
                    {cloneNode.Inactive ? (
                        <Text style={[styleSheets.text, { color: Colors.orangeOpacity80 }]}>{display}</Text>
                    ) : (
                        <Text style={[styleSheets.text]}>{display}</Text>
                    )}
                </View>
            </View>
        );
    }
}
