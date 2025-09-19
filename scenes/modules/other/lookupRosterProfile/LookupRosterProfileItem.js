import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Size, styleSheets, Colors, CustomStyleSheet } from '../../../../constants/styleConfig';
import moment from 'moment';
import format from 'number-format.js';
import VnrText from '../../../../components/VnrText/VnrText';
import Vnr_Function from '../../../../utils/Vnr_Function';
export default class RenderItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.formatStringType = this.formatStringType.bind(this);
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

    formatStringType = (data, col) => {
        if (data[col.Name]) {
            if (col.DataType && col.DataType.toLowerCase() == 'datetime') {
                return moment(data[col.Name]).format(col.DataFormat);
            }
            if (col.DataType && col.DataType.toLowerCase() == 'double') {
                return format(col.DataFormat, data[col.Name]);
            } else {
                return data[col.Name];
            }
        } else {
            return '';
        }
    };

    render() {
        const { dataItem, index } = this.props;
        return (
            <View style={styles.swipeable} key={index}>
                <View style={styles.viewButton}>
                    <View style={styles.leftBody} key={index}>
                        <View style={styles.iconAvatarView}>
                            <Image
                                source={require('../../../../assets/images/bg_calendar.png')}
                                style={styles.avatarUser}
                            />
                            <View style={styles.viewMonth}>
                                <VnrText i18nKey={'E_DAY'} style={styles.txtMonthLable} />
                                <Text style={styles.txtMonthValue}>{moment(dataItem.DateStart).format('DD')}</Text>
                            </View>
                        </View>
                        <View style={{}}>
                            <Text style={styleSheets.lable}>{moment(dataItem.DateStart).format('MM/YYYY')}</Text>
                        </View>
                    </View>
                    <View style={styles.rightBody}>
                        {/* Tên ca - Title */}
                        <View style={styles.Line}>
                            <View style={styles.IconView}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.lable, styles.txtLable]}
                                    i18nKey={'HRM_HR_Category_Employee'}
                                />
                            </View>

                            <View style={styles.valueView}>
                                <Text numberOfLines={1} style={[styleSheets.text]}>
                                    {dataItem.ProfileName ? dataItem.ProfileName : ''}
                                </Text>
                            </View>
                        </View>

                        {/* Tên ca - Title */}
                        <View style={styles.Line}>
                            <View style={styles.IconView}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.lable, styles.txtLable]}
                                    i18nKey={'E_HOUR'}
                                />
                            </View>

                            <View style={styles.valueView}>
                                <Text numberOfLines={1} style={[styleSheets.text]}>
                                    {`${moment(dataItem.DateStart).format('HH:mm')} - ${moment(dataItem.DateEnd).format(
                                        'HH:mm'
                                    )}`}
                                </Text>
                            </View>
                        </View>

                        {/* Tên ca - Title */}
                        <View style={styles.Line}>
                            <View style={styles.IconView}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.lable, styles.txtLable]}
                                    i18nKey={'HRM_Human_LookupRoster_Title'}
                                />
                            </View>

                            <View style={styles.valueView}>
                                <Text numberOfLines={1} style={[styleSheets.text]}>
                                    {dataItem.Title ? dataItem.Title : ''}
                                </Text>
                            </View>
                        </View>

                        {/* Trạng thái - StatusView */}
                        <View style={[styles.Line, CustomStyleSheet.marginBottom(0)]}>
                            <View style={styles.IconView}>
                                <VnrText i18nKey={'StatusView'} style={[styleSheets.lable]} />
                            </View>
                            <View style={styles.valueView}>
                                <Text numberOfLines={1} style={[styleSheets.text]}>
                                    {Vnr_Function.formatStringType(dataItem, {
                                        Name: 'StatusView',
                                        DataType: '',
                                        DataFormat: ''
                                    })}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const frontSizeValueMonth = Size.text + 3;
const styles = StyleSheet.create({
    swipeable: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: 10,
        borderBottomColor: Colors.borderColor,
        borderBottomWidth: 0.5
    },
    viewButton: {
        flex: 1,
        borderRadius: 10,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    leftBody: {
        flex: 2.5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightColor: Colors.borderColor,
        borderRightWidth: 0.5
    },
    rightBody: {
        flex: 7.5,
        paddingHorizontal: 10
    },
    iconAvatarView: {
        flex: 1,
        marginBottom: 5,
        position: 'relative'
    },
    avatarUser: {
        maxWidth: 150,
        maxHeight: 150,
        width: Size.deviceWidth * 0.2,
        height: Size.deviceWidth * 0.2,
        resizeMode: 'contain'
    },
    viewMonth: {
        position: 'absolute',
        maxWidth: 150,
        maxHeight: 150,
        width: Size.deviceWidth * 0.2,
        height: Size.deviceWidth * 0.2,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom:
            Size.deviceWidth * 0.2 > 150
                ? 75 - frontSizeValueMonth * 2
                : (Size.deviceWidth * 0.2) / 2 - frontSizeValueMonth * 2
    },
    txtMonthLable: {
        fontSize: Size.text - 5,
        color: Colors.greySecondary
    },
    txtMonthValue: {
        fontSize: frontSizeValueMonth,
        fontWeight: '500'
    },
    Line: {
        flex: 1,
        flexDirection: 'row',
        maxWidth: '100%',
        justifyContent: 'center'
    },
    valueView: {
        flex: 6.7,
        marginLeft: 10,
        alignItems: 'center',
        flexDirection: 'row'
    },
    IconView: {
        flex: 3.3,
        height: '100%',
        justifyContent: 'center'
    }
});
