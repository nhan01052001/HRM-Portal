import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleSafeAreaView, Size, Colors, CustomStyleSheet } from '../../../../constants/styleConfig';
import VnrText from '../../../../components/VnrText/VnrText';
import Vnr_Function from '../../../../utils/Vnr_Function';
import VnrLoading from '../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../components/EmptyData/EmptyData';
import moment from 'moment';
import { translate } from '../../../../i18n/translate';
export default class AttDataWorkdaysEmpsViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null
        };

        const titleDate = props.navigation.state.params.dataItem ? props.navigation.state.params.dataItem.dateTime : '';
        props.navigation.setParams({
            title: titleDate
                ? `${translate('HRM_Common_ViewMore')} ${moment(titleDate).format('DD/MM/YYYY')}`
                : translate('HRM_Common_ViewMore')
        });
    }

    getDataItem = (isReload = false) => {
        try {
            const _params = this.props.navigation.state.params,
                { dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params);

            if (!Vnr_Function.CheckIsNullOrEmpty(dataId) || isReload) {
                // HttpService.Post(`[URI_HR]/Att_GetData/GetTamScanLogRegisterById`, {
                //     id: !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID,
                //     screenName: screenName,
                //     uri: dataVnrStorage.apiConfig.uriHr
                // })
                //     .then(res => {
                //         console.log(res);
                //         if (!Vnr_Function.CheckIsNullOrEmpty(res)) {
                //             this.setState({ configListDetail: _configListDetail, dataItem: res });
                //         }
                //         else {
                //             this.setState({ dataItem: 'EmptyData' });
                //         }
                //     });
            } else if (!Vnr_Function.CheckIsNullOrEmpty(dataItem)) {
                this.setState({ dataItem });
            } else {
                this.setState({ dataItem: 'EmptyData' });
            }
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    componentDidMount() {
        this.getDataItem();
    }

    renderItem = data => {
        return data.map((item, index) => {
            const isEnd = index == data.length - 1 ? true : false,
                itemDisplay = item.ItemDisplayApp ? item.ItemDisplayApp : {};
            return (
                <View key={index} style={[styles.viewItem, isEnd && CustomStyleSheet.borderBottomWidth(0)]}>
                    <View style={styles.viewItemLeft}>
                        <Text style={[styleSheets.text]}>{itemDisplay.ProfileName ? itemDisplay.ProfileName : ''}</Text>
                    </View>
                    <View style={styles.viewItemRight}>
                        <Text style={[styleSheets.text]}>{itemDisplay.CodeByType ? itemDisplay.CodeByType : ''}</Text>
                    </View>
                </View>
            );
        });
    };

    render() {
        const { dataItem } = this.state;

        let contentViewDetail = <VnrLoading size={'large'} />,
            listTotalOT = [],
            listTotalLD = [],
            listTotalRT = [];

        if (dataItem && dataItem.data && Array.isArray(dataItem.data)) {
            dataItem.data.forEach(item => {
                if (item.CalendarType == 'E_OVERTIME') {
                    listTotalOT.push(item);
                }
                if (item.CalendarType == 'E_LEAVE_DAY') {
                    listTotalLD.push(item);
                }
                if (item.CalendarType == 'E_ROSTER') {
                    listTotalRT.push(item);
                }
            });
        }

        if (dataItem) {
            contentViewDetail = (
                <View style={[styleSheets.col_10]}>
                    <ScrollView>
                        {listTotalOT.length > 0 && (
                            <View style={styles.line}>
                                <View style={[styles.styleViewTitleGroup]}>
                                    <View style={styles.styleViewTitleGroupLeft}>
                                        <View style={[styles.stylesDot, styles.dotOT]} />
                                        <VnrText
                                            style={[styleSheets.text, styles.textLableGroup]}
                                            i18nKey={'HRM_Att_Overtime'}
                                        />
                                    </View>

                                    {/* <Text style={[styleSheets.text, styles.textLableDate]}>
                                            {moment(dataItem.dateTime).format('DD/MM/YYYY')}
                                        </Text> */}
                                </View>
                                {this.renderItem(listTotalOT)}
                            </View>
                        )}

                        {listTotalLD.length > 0 && (
                            <View style={styles.line}>
                                <View style={[styles.styleViewTitleGroup]}>
                                    <View style={styles.styleViewTitleGroupLeft}>
                                        <View style={[styles.stylesDot, styles.dotLD]} />
                                        <VnrText
                                            style={[styleSheets.text, styles.textLableGroup]}
                                            i18nKey={'HRM_Att_LeaveDay'}
                                        />
                                    </View>

                                    {/* <Text style={[styleSheets.text, styles.textLableDate]}>
                                            {moment(dataItem.dateTime).format('DD/MM/YYYY')}
                                        </Text> */}
                                </View>
                                {this.renderItem(listTotalLD)}
                            </View>
                        )}

                        {listTotalRT.length > 0 && (
                            <View style={styles.line}>
                                <View style={[styles.styleViewTitleGroup]}>
                                    <View style={styles.styleViewTitleGroupLeft}>
                                        <View style={[styles.stylesDot, styles.dotRT]} />
                                        <VnrText
                                            style={[styleSheets.text, styles.textLableGroup]}
                                            i18nKey={'HRM_Attendance_ShiftName'}
                                        />
                                    </View>

                                    {/* <Text style={[styleSheets.text, styles.textLableDate]}>
                                            {moment(dataItem.dateTime).format('DD/MM/YYYY')}
                                        </Text> */}
                                </View>
                                {this.renderItem(listTotalRT)}
                            </View>
                        )}
                    </ScrollView>
                </View>
            );
        } else if (dataItem == 'EmptyData') {
            contentViewDetail = <EmptyData messageEmptyData={'EmptyData'} />;
        }
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container]}>{contentViewDetail}</View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    line: {
        width: Size.deviceWidth
    },

    viewItem: {
        flexDirection: 'row',
        paddingVertical: 11,
        marginHorizontal: Size.defineSpace,
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5
    },
    viewItemLeft: {
        flex: 1
    },
    styleViewTitleGroup: {
        marginHorizontal: Size.defineSpace,
        marginTop: Size.defineSpace / 2,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.primary,
        paddingBottom: Size.defineSpace / 2
    },
    styleViewTitleGroupLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    textLableGroup: {
        fontSize: Size.text + 2,
        fontWeight: '500',
        marginLeft: 5,
        color: Colors.primary
    },
    stylesDot: {
        width: Size.text - 5,
        height: Size.text - 5,
        borderRadius: (Size.text - 5) / 2
    },
    dotOT: {
        backgroundColor: Colors.red
    },
    dotLD: {
        backgroundColor: Colors.purple
    },
    dotRT: {
        backgroundColor: Colors.green
    }
});
