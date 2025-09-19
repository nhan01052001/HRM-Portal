/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors, styleSheets, Size } from '../../constants/styleConfig';
import { IconCaretdown, IconCaretRight } from '../../constants/Icons';

export default class RenderNodeOrg extends React.Component {
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
        const { ColorStructureType } = cloneNode;
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
            display = (
                <Text
                    style={[
                        styleSheets.text,
                        {
                            color: cloneNode.isChecked ? Colors.primary : Colors.gray_10
                        }
                    ]}
                >
                    {cloneNode.Name}
                </Text>
            );
        }

        return cloneNode.hasChildren ? (
            <View style={{ marginLeft: level * 15, flexDirection: 'row' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => expandChild(cloneNode)}>
                        {cloneNode.isExpanded ? (
                            <IconCaretdown size={Size.text - 3} color={Colors.gray_8} />
                        ) : (
                            <IconCaretRight size={Size.text - 3} color={Colors.gray_8} />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => (!isDisable ? checkedNode(cloneNode) : null)}
                        style={[
                            styles.styViewItem,
                            cloneNode.isChecked && styles.styViewItemActive,
                            isDisable && { opacity: 0.5 }
                        ]}
                        activeOpacity={isDisable ? 0.5 : 0.2}
                    >
                        <View style={[styles.styDot, ColorStructureType && { backgroundColor: ColorStructureType }]} />

                        {cloneNode.Inactive ? (
                            <Text style={[styleSheets.text, { color: Colors.orangeOpacity80 }]}>{display}</Text>
                        ) : (
                            <Text style={[styleSheets.text]}>{display}</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        ) : (
            <View style={{ marginLeft: level * 15 + 40, flexDirection: 'row', padding: 7 }}>
                <TouchableOpacity
                    style={[
                        styles.styViewItemChild,
                        cloneNode.isChecked && styles.styViewItemActive,
                        isDisable && { opacity: 0.5 }
                    ]}
                    activeOpacity={isDisable ? 0.5 : 0.2}
                    onPress={() => (!isDisable ? checkedNode(cloneNode) : null)}
                >
                    <View style={[styles.styDot, ColorStructureType && { backgroundColor: ColorStructureType }]} />

                    {cloneNode.Inactive ? (
                        <Text style={[styleSheets.text, { color: Colors.orangeOpacity80 }]}>{display}</Text>
                    ) : (
                        <Text
                            style={[
                                styleSheets.text,
                                {
                                    color: cloneNode.isChecked ? Colors.primary : Colors.gray_10
                                }
                            ]}
                        >
                            {display}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    styDot: {
        height: 6,
        width: 6,
        borderRadius: 3,
        backgroundColor: Colors.gray_7,
        marginRight: Size.defineHalfSpace
    },
    styViewItem: {
        height: 40,
        flexDirection: 'row',
        paddingHorizontal: Size.defineHalfSpace,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7,
        marginLeft: Size.defineHalfSpace
    },
    styViewItemChild: {
        flexDirection: 'row',
        height: 30,
        paddingHorizontal: Size.defineHalfSpace,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7
    },
    styViewItemActive: {
        backgroundColor: Colors.primary_transparent_8
    }
});
