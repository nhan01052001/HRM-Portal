import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { styleSheets, styleListLableValueCommom } from '../../../../../constants/styleConfig';
import moment from 'moment';
import format from 'number-format.js';
import VnrText from '../../../../../components/VnrText/VnrText';

export default class GradeInsuranceItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.formatStringType = this.formatStringType.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
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

        let TimeCouse = '';
        if (dataItem.MonthOfEffect) {
            TimeCouse = moment(dataItem.MonthOfEffect).format('DD/MM/YYYY');
        }

        const styles = styleListLableValueCommom;
        // ClassName DateTime EndDate StatusView
        return (
            <View style={Platform.OS == 'ios' ? styles.viewButtonIOS : styles.swipeable} key={index}>
                <View style={styles.viewButton}>
                    <View style={styles.rightBody}>
                        <View style={styles.Line}>
                            <View style={styles.IconView}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.lable, styles.txtLable]}
                                    i18nKey={'HRM_Grade'}
                                />
                            </View>
                            <View style={styles.valueView}>
                                {/* <Text style={styleSheets.text}>: </Text> */}
                                <Text numberOfLines={1} style={[styleSheets.text]}>
                                    {dataItem.InsuranceGradeName}
                                </Text>
                            </View>
                        </View>

                        {TimeCouse != '' && (
                            <View style={styles.Line}>
                                <View style={styles.IconView}>
                                    <VnrText
                                        numberOfLines={1}
                                        style={[styleSheets.lable, styles.txtLable]}
                                        i18nKey={'HRM_Field_Train_DurationTime'}
                                    />
                                </View>
                                <View style={styles.valueView}>
                                    {/* <Text style={styleSheets.text}>: </Text> */}
                                    <Text numberOfLines={1} style={[styleSheets.text]}>
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

// const styles = StyleSheet.create({
//   swipeable: {
//     flex: 1,
//     borderRadius: 10,

//     marginBottom: 13,
//     marginHorizontal: 10,
//     padding: 4,
//     backgroundColor: '#f3f2f2',
//   },
//   viewButton: {
//     flex: 1,
//     backgroundColor: Colors.whiteOpacity70,
//     borderRadius: 10,
//     justifyContent: 'center',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//   },
//   viewButtonIOS: {
//     flex: 1,
//     borderRadius: 10,
//     marginBottom: 13,
//     marginHorizontal: 10,
//     shadowColor: Colors.black,
//     backgroundColor: '#f3f2f2',
//     shadowOffset: {
//       width: 0,
//       height: 2.5,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 5.46,
//     elevation: 6,
//   },
//   txtLable: {
//     marginRight: 3,
//   },
//   leftBody: {
//     flex: 3,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRightColor: Colors.borderColor,
//     borderRightWidth: 0.5
//   },
//   rightBody: {
//     flex: 7,
//     paddingHorizontal: 10,
//   },
//   iconAvatarView: {
//     flex: 1,
//     marginBottom: 5
//   },
//   avatarUser: {
//     width: Size.deviceWidth * 0.2,
//     height: Size.deviceWidth * 0.2,
//     borderRadius: (Size.deviceWidth * 0.2) / 2,
//     resizeMode: 'cover',
//     backgroundColor: Colors.borderColor,
//   },
//   Line: {
//     flex: 1,
//     flexDirection: "row",
//     maxWidth: "100%",
//     justifyContent: 'center',
//     //  paddingBottom: 4,
//     marginBottom: 7,
//     // borderBottomColor: Colors.borderColor,
//     // borderBottomWidth: 0.5
//   },

//   valueView: {
//     flex: 7.5,
//     marginLeft: 5,
//     alignItems: 'center',
//     flexDirection: 'row'
//   },
//   IconView: {
//     flex: 2.5,
//     height: '100%',
//     justifyContent: 'flex-start',
//     flexDirection: 'row'
//   }
// })
