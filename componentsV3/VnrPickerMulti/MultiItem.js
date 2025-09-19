/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, Size, styleSheets } from '../../constants/styleConfig';
import { translate } from '../../i18n/translate';

const { width } = Dimensions.get('window');
const widthW = width;

class MultiItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDelete: false,
            arr: []
        };
    }
    toggleIsCheckItem() {
        this.setState({ isCheck: !this.state.isDelete });
    }
    removeItemSlect = () => {
        const { revomeItemSelect, item } = this.props;
        revomeItemSelect(item);
    };
    render() {
        //const iconNameUnCheck = `${Platform.OS === 'ios' ? 'ios-' : 'md-'}square-outline`;
        const iconNameDelete = `${Platform.OS === 'ios' ? 'ios-' : 'md-'}close`;
        const { item, textFieldTitle, disable, index, onExceedSizeWith, lengthData } = this.props;
        return (
            <TouchableOpacity
                onPress={() => {
                    !disable ? this.props.onOpentModal() : null;
                }}
                activeOpacity={!disable ? 0.2 : 1}
                style={{ flexDirection: 'row', justifyContent: 'flex-start' }}
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
                    <View style={{ maxWidth: '95%' }}>
                        <Text style={[styleSheets.lable, styles.titleItem]} numberOfLines={1}>
                            {translate(item[textFieldTitle])}
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
        const { dataSource, textField, onOpentModal, revomeItemSelect, disable, onExceedSizeWith } = this.props;
        let dataLimit = [...dataSource];

        if (Array.isArray(dataSource) && dataSource.length > 7) {
            dataLimit = dataSource.slice(0, 7);
        }
        return (
            // <FlatList
            //     showsVerticalScrollIndicator={false}
            //     data={dataSource}
            //     renderItem={({ item }) => (
            //         <MultiItem
            //             revomeItemSelect={revomeItemSelect}
            //             item={item}
            //             textFieldTitle={textField}
            //             onOpentModal={onOpentModal}
            //             disable={disable}
            //         />)}
            //     keyExtractor={item => item[textField]}
            //     horizontal={true}
            // />
            <ScrollView
            // contentContainerStyle={{
            //     // backgroundColor: Colors.white,
            // }}
            // style={{ maxHeight: 130 }}
            // style={{maxHeight: 130, flexDirection: "row", width: "100%",}}
            >
                <View
                    style={{
                        flex: 1,
                        flexWrap: 'wrap',
                        flexDirection: 'row'
                    }}
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
        color: Colors.primary
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
    }
});
