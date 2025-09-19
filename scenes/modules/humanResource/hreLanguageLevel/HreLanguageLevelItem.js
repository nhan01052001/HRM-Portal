import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { styleSheets, Colors, Size, CustomStyleSheet } from '../../../../constants/styleConfig';
import moment from 'moment';
export default class HreLanguageLevelItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nextProps) {
        if (
            nextProps.isPullToRefresh !== this.props.isPullToRefresh ||
            nextProps.isSelect !== this.props.isSelect ||
            nextProps.isOpenAction !== this.props.isOpenAction
        ) {
            return true;
        } else {
            return false;
        }
    }

    render() {
        const { dataItem, index } = this.props;

        let TimeCouse = '',
            colorStatusView = null;

        // xử lý color
        if (dataItem.itemStatus) {
            const { colorStatus } = dataItem.itemStatus;
            colorStatusView = colorStatus ? colorStatus : null;
        }

        if (dataItem.DateOfIssue) {
            TimeCouse = moment(dataItem.DateOfIssue).format('DD/MM/YYYY');
        }

        if (dataItem.DateExpired) {
            if (TimeCouse !== '') {
                TimeCouse = `${TimeCouse} - ${moment(dataItem.DateExpired).format('DD/MM/YYYY')}`;
            } else {
                TimeCouse = moment(dataItem.DateExpired).format('DD/MM/YYYY');
            }
        }

        return (
            <View style={styles.swipeable} key={index}>
                <View style={styles.styViewItem}>
                    <View style={styles.styViewStatusColor}>
                        <Image
                            resizeMode={'contain'}
                            style={styles.styViewImg}
                            source={require('../../../../assets/images/Certificate.png')}
                        />
                        <Text numberOfLines={1} style={[styleSheets.text, styles.styTextScore]}>
                            {dataItem.RatingOrScore}
                        </Text>
                    </View>

                    <View style={styles.styContentItem}>
                        <View style={styles.styLine}>
                            <View style={styles.styLineLeft}>
                                <Text numberOfLines={1} style={[styleSheets.lable, styles.txtLable_1]}>
                                    {dataItem.Speaking}
                                </Text>
                            </View>
                            <View style={styles.styLineValue}>
                                <Text
                                    numberOfLines={1}
                                    style={[
                                        styleSheets.text,
                                        {
                                            color: colorStatusView
                                                ? this.convertTextToColor(colorStatusView)
                                                : Colors.gray_8
                                        }
                                    ]}
                                >
                                    {dataItem.TrainingTypeView}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.styLine}>
                            <View style={styles.styLineLeft}>
                                <Text numberOfLines={1} style={[styleSheets.text, styles.txtLable_2]}>
                                    {dataItem.TrainingPlace}
                                </Text>
                            </View>
                        </View>

                        {TimeCouse != '' && (
                            <View style={[styles.styLine, CustomStyleSheet.marginBottom(0)]}>
                                <View style={styles.valueView}>
                                    <Text numberOfLines={1} style={[styleSheets.text, styles.styTypeTime]}>
                                        {TimeCouse}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    swipeable: {
        flex: 1,
        borderRadius: 10,
        marginBottom: Size.defineSpace / 2,
        marginHorizontal: Size.defineSpace
    },
    styViewItem: {
        flex: 1,
        backgroundColor: Colors.white,
        borderRadius: 10,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },

    txtLable_1: {
        fontSize: Size.text + 1,
        fontWeight: '500'
    },
    txtLable_2: {
        fontSize: Size.text,
        fontWeight: '400'
    },
    styViewStatusColor: {
        width: Size.deviceWidth * 0.17,
        height: '100%',
        // backgroundColor: bgColor,
        marginLeft: Size.defineSpace / 2,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center'
    },
    styViewImg: {
        width: Size.iconSize + 10,
        height: Size.iconSize + 10
    },
    styTypeTime: {
        fontSize: Size.text - 1,
        color: Colors.gray_7
    },
    styContentItem: {
        flex: 7,
        paddingHorizontal: 10
    },
    styLine: {
        flexDirection: 'row',
        marginBottom: 2
    },
    styLineValue: {
        marginLeft: 10
    },
    styLineLeft: {
        flex: 1
    },
    styTextScore: {
        fontSize: Size.text - 1,
        color: Colors.primary,
        marginTop: 7
    }
});
