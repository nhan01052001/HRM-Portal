import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Size, styleSheets } from '../../constants/styleConfig';
import Vnr_Function from '../../utils/Vnr_Function';

export default class Item extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null
        };
        this.toggleIsCheckItem = this.toggleIsCheckItem.bind(this);
    }
    toggleIsCheckItem() {
        this.props.isChecked(this.props.index);
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.isSelect !== this.props.isSelect;
    }

    render() {
        const { dataItem, textField } = this.props,
            fullName = dataItem && dataItem[textField] ? dataItem[textField] : '';

        return (
            <TouchableOpacity
                onPress={this.toggleIsCheckItem}
                activeOpacity={0.3}
                underlayColor={Colors.greySecondaryConstraint}
            >
                {dataItem !== null && dataItem !== undefined ? (
                    dataItem.isSelect === false ? (
                        <View style={styles.wrapIn4ApproverItem}>
                            <View style={styles.styViewAvatar}>
                                {Vnr_Function.renderAvatarCricleByName(dataItem.AvatarURI, fullName, 40)}
                            </View>
                            <View>
                                <Text style={[styleSheets.text, styles.styFs16Color262626]} numberOfLines={1}>
                                    {dataItem !== null && dataItem !== undefined && dataItem[`${textField}`]
                                        ? dataItem[`${textField}`].slice(0, dataItem[`${textField}`].indexOf('-'))
                                        : null}
                                </Text>
                                <View style={styles.styName}>
                                    <Text style={[styleSheets.text, styles.styFsNoName]} numberOfLines={1}>
                                        {dataItem !== null && dataItem !== undefined && dataItem[`${textField}`]
                                            ? dataItem[`${textField}`].slice(dataItem[`${textField}`].indexOf('-') + 1)
                                            : null}{' '}
                                        -
                                    </Text>
                                    {/*<VnrText
                                        numberOfLines={1}
                                        style={[styleSheets.text, styles.styFsNoName]}
                                        i18nKey={' Trưởng nhóm lập trình'}
                                    /> */}
                                </View>
                            </View>
                        </View>
                    ) : null
                ) : null}
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    wrapIn4ApproverItem: {
        padding: 10,
        backgroundColor: Colors.white,
        paddingHorizontal: 28,
        flexDirection: 'row',
        alignItems: 'center'
    },
    styName : { flexDirection: 'row', alignItems: 'center' },
    styViewAvatar: {
        marginRight: Size.defineHalfSpace
    }
});
