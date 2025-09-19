import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
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
        const { cloneNode, checkedNode, expandChild, level } = this.props;

        let display = '';

        if (cloneNode.NameFilter && cloneNode.NameFilter !== '') {
            let _splitName = cloneNode.Name.split(cloneNode.NameFilter);
            let lenNameFilter = _splitName.length;

            display = _splitName.map((sub, i) => {
                if (i < lenNameFilter - 1) {
                    return (
                        <Text>
                            {sub}
                            <Text style={styles.styNodeText}>{cloneNode.NameFilter}</Text>
                        </Text>
                    );
                } else if (i == lenNameFilter - 1) {
                    return <Text>{sub}</Text>;
                }
            });
        } else {
            display = <Text>{cloneNode.Name}</Text>;
        }
        return cloneNode.ListChild && cloneNode.ListChild.length > 0 ? (
            // eslint-disable-next-line react-native/no-inline-styles
            <View style={{ marginLeft: level * 15, flexDirection: 'row' }}>
                <TouchableOpacity
                    style={styles.styCloneNode}
                    activeOpacity={0.2}
                    onPress={() => expandChild(cloneNode)}
                >
                    <View style={CustomStyleSheet.flexDirection('row')}>
                        {cloneNode.isExpanded ? (
                            <IconDown size={Size.iconSize + 2} color={Colors.grey} />
                        ) : (
                            <IconRight size={Size.iconSize + 2} color={Colors.grey} />
                        )}
                        <CheckBox
                            checkBoxColor={Colors.black}
                            checkedCheckBoxColor={Colors.primary}
                            onClick={() => {
                                checkedNode(cloneNode);
                            }}
                            isChecked={cloneNode.isChecked}
                        />

                        <View style={CustomStyleSheet.marginHorizontal(7)}>
                            <IconGroupUser
                                size={Size.iconSize}
                                color={cloneNode.isChecked ? Colors.primary : Colors.grey}
                            />
                        </View>

                        {cloneNode.Inactive ? (
                            <Text style={[styleSheets.text, CustomStyleSheet.color(Colors.orangeOpacity80)]}>{display}</Text>
                        ) : (
                            <Text style={[styleSheets.text]}>{display}</Text>
                        )}
                    </View>
                </TouchableOpacity>
            </View>
        ) : (
            // eslint-disable-next-line react-native/no-inline-styles
            <View style={{ marginLeft: level * 15 + 40, flexDirection: 'row', padding: 7 }}>
                <View style={styles.styViewCheck}>
                    <CheckBox
                        checkBoxColor={Colors.black}
                        checkedCheckBoxColor={Colors.primary}
                        onClick={() => {
                            checkedNode(cloneNode);
                        }}
                        isChecked={cloneNode.isChecked}
                    />
                    <View style={CustomStyleSheet.marginHorizontal(7)}>
                        <IconUser size={Size.iconSize} color={cloneNode.isChecked ? Colors.primary : Colors.grey} />
                    </View>

                    {cloneNode.Inactive ? (
                        <Text style={[styleSheets.text, CustomStyleSheet.color(Colors.orangeOpacity80)]}>{display}</Text>
                    ) : (
                        <Text style={[styleSheets.text]}>{display}</Text>
                    )}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    styViewCheck: {
        height: 30,
        paddingRight: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    styNodeText: { backgroundColor: Colors.yellow },
    styCloneNode: {
        height: 45,
        paddingRight: 20,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
