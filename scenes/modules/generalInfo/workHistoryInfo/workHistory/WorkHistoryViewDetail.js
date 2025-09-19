import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleScreenDetail, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';

// eslint-disable-next-line no-unused-vars
const configDetail = [
    {
        Name: 'DateEffective',
        DisplayKey: 'HRM_HR_WorkHistory_DateEffective',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'JobTitleName',
        DisplayKey: 'HRM_Common_JobTitle',
        DataType: 'string'
    },
    {
        Name: 'PositionName',
        DisplayKey: 'PositionOffer',
        DataType: 'string'
    },
    {
        Name: 'OrgStructureName',
        DisplayKey: 'HRM_HR_WorkHistory_OrgStructureID',
        DataType: 'string'
    },

    {
        Name: 'WorkPlaceName',
        DisplayKey: 'HRM_HR_WorkHistory_WorkLocation',
        DataType: 'string'
    },
    {
        Name: 'TypeOfTransferName',
        DisplayKey: 'HRM_Category_TypeOfTransfer_Name',
        DataType: 'string'
    }

    // phần còn thiếu
];

export default class WorkHistoryViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null
        };
    }

    getDataItem = (isReload = false) => {
        try {
            const _params = this.props.navigation.state.params,
                { screenName, dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail = ConfigListDetail.value[screenName];
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
                this.setState({ configListDetail: _configListDetail, dataItem });
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

    render() {
        const { dataItem, configListDetail } = this.state,
            { containerItemDetail } = styleScreenDetail;
        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={[styleSheets.col_10]}>
                    <ScrollView>
                        <View style={containerItemDetail}>
                            {configListDetail.map(e => Vnr_Function.formatStringTypeV2(dataItem, e))}
                        </View>
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
