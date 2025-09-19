import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Image, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, CustomStyleSheet, Size, styleSheets } from '../../constants/styleConfig';
import Vnr_Function from '../../utils/Vnr_Function';

const { width } = Dimensions.get('window');
const widthW = width;

class MultiItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDelete: false
        };
    }
    toggleIsCheckItem() {
        this.setState({ isCheck: !this.state.isDelete });
    }
    removeItemSlect = () => {
        const { revomeItemSelect, item } = this.props;
        revomeItemSelect(item);
    };

    renderAvatar = (name, avatar) => {
        const firstChar = name ? name.split('')[0] : '';
        let randomColor = Vnr_Function.randomColor(firstChar),
            { PrimaryColor, SecondaryColor } = randomColor;
        return (
            <View style={CustomStyleSheet.padding(3)}>
                {avatar ? (
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                ) : (
                    <View
                        style={[
                            styles.avatar,
                            {
                                backgroundColor: SecondaryColor
                            }
                        ]}
                    >
                        <Text
                            style={[
                                styleSheets.text,
                                {
                                    color: PrimaryColor
                                }
                            ]}
                        >
                            {firstChar.toUpperCase()}
                        </Text>
                    </View>
                )}
            </View>
        );
    };

    render() {
        //const iconNameUnCheck = `${Platform.OS === 'ios' ? 'ios-' : 'md-'}square-outline`;
        const iconNameDelete = `${Platform.OS === 'ios' ? 'ios-' : 'md-'}close`;
        const { item, textFieldTitle, disable, index, onExceedSizeWith, lengthData, licensedDisplay } = this.props;

        return (
            <TouchableOpacity
                onPress={() => {
                    !disable ? this.props.onOpentModal() : null;
                }}
                activeOpacity={!disable ? 0.2 : 1}
                style={styles.styBtnOpen}
            >
                <View
                    style={styles.multiItem}
                    onLayout={event => {
                        let { width } = event.nativeEvent.layout;
                        if (lengthData === 2) {
                            onExceedSizeWith(width, widthW);
                        }
                    }}
                >
                    {Vnr_Function.renderAvatarCricleByName(item[licensedDisplay.Avatar[0]], item[textFieldTitle], 22)}
                    <View style={CustomStyleSheet.maxWidth('85%')}>
                        <Text style={[styleSheets.text, styles.titleItem]} numberOfLines={1}>
                            {item[textFieldTitle]}
                        </Text>
                    </View>
                    <View style={styles.borderDetele}>
                        <TouchableOpacity
                            activeOpacity={!disable ? 0.2 : 1}
                            onPress={() => {
                                !disable ? this.removeItemSlect() : null;
                            }}
                            style={styles.bnt_delete}
                        >
                            <Icon name={iconNameDelete} size={Size.iconSize - 5} color={Colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>
                {lengthData > 7 && index === 6 && (
                    <View style={styles.multiItem}>
                        <Text style={[styleSheets.lable, styles.titleItem]} numberOfLines={1}>
                            +{lengthData - 7}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    }
}

export default class ListMultiItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            dataSource,
            textField,
            onOpentModal,
            revomeItemSelect,
            disable,
            onExceedSizeWith,
            licensedDisplay
        } = this.props;
        let dataLimit = [...dataSource];

        if (Array.isArray(dataSource) && dataSource.length > 7) {
            dataLimit = dataSource.slice(0, 7);
        }

        return (
            <ScrollView
            // style={{ maxHeight: 150 }}
            >
                <View
                    style={styles.styViewData}
                >
                    {dataLimit !== null && dataLimit !== undefined && Array.isArray(dataLimit)
                        ? dataLimit.map((item, index) => {
                            return (
                                <MultiItem
                                    key={index}
                                    revomeItemSelect={revomeItemSelect}
                                    item={item}
                                    textFieldTitle={textField}
                                    onOpentModal={onOpentModal}
                                    disable={disable}
                                    index={index}
                                    lengthData={dataSource.length}
                                    onExceedSizeWith={onExceedSizeWith}
                                    licensedDisplay={licensedDisplay}
                                />
                            );
                        })
                        : null}
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    multiItem: {
        maxWidth: Size.deviceWidth - Size.defineSpace,
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 6,
        backgroundColor: Colors.primary_transparent_8,
        alignItems: 'center',
        borderRadius: 3,
        paddingVertical: 1,
        marginRight: 6,
        marginVertical: 4
    },
    titleItem: {
        fontSize: Size.text - 1,
        color: Colors.primary,
        marginLeft: 5
    },
    bnt_delete: {
        alignItems: 'center',
        width: 22,
        height: 22,
        justifyContent: 'center'
    },

    borderDetele: {
        borderRadius: 4,
        marginVertical: 3,
        paddingHorizontal: 2
    },

    avatar: {
        width: 22,
        height: 22,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center'
    },
    styBtnOpen : { flexDirection: 'row', justifyContent: 'center' },
    styViewData : {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row'
    }
});
