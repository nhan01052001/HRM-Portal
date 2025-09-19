import React, { Component } from 'react';
import { View } from 'react-native';
import { styleSheets, styleSafeAreaView, CustomStyleSheet } from '../../../../../constants/styleConfig';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';
import { EnumName } from '../../../../../assets/constant';
import DrawerServices from '../../../../../utils/DrawerServices';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import { WebView } from 'react-native-webview';
import moment from 'moment';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';

const configDefault = [
    {
        TypeView: 'E_COMMON',
        Name: 'jobs-name',
        DataField: 'TitlePosting',
        DisplayKey: 'Tên công việc',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'jobs-quantity',
        DataField: 'NumberOfRecruitment',
        DisplayKey: 'SỐ LƯỢNG TUYỂN DỤNG',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'jobs-age',
        DataField: 'Age',
        DisplayKey: 'ĐỘ TUỔI ỨNG TUYỂN',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'jobs-type',
        DataField: 'EmploymentTypeView',
        DisplayKey: 'LOẠI CÔNG VIỆC',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'jobs-gender',
        DataField: 'GenderViewList',
        DisplayKey: 'SỐ NĂM KINH NGHIỆM',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'jobs-experience',
        DataField: 'Experiences',
        DisplayKey: 'SỐ LƯỢNG TUYỂN DỤNG',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'jobs-date_from',
        DataField: 'HiringStartDate',
        DisplayKey: 'NGÀY BẮT ĐẦU ỨNG TUYỂN',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'jobs-date_to',
        DataField: 'HiringEndDate',
        DisplayKey: 'NGÀY KẾT THÚC ỨNG TUYỂN',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'jobs-position',
        DataField: 'JobTitleName',
        DisplayKey: 'CHỨC VỤ TUYỂN DỤNG',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'jobs-career',
        DataField: 'SubMajorNameList',
        DisplayKey: 'NGÀNH NGHỀ TUYỂN DỤNG',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'jobs-description',
        DataField: 'JobResponsibilities',
        DisplayKey: 'MÔ TẢ CÔNG VIỆC',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'jobs-requirement',
        DataField: 'HiringCriteria',
        DisplayKey: 'YÊU CẦU TUYỂN DỤNG',
        DataType: 'string'
    }
];

export default class HrePostPreviewViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            dataRowActionAndSelected: [],
            lstCollapse: {},
            uriReview: null
        };

        if (props.navigation.state.params && props.navigation.state.params.dataItem) {
            const { dataItem } = props.navigation.state.params;
            const title = dataItem.SourceAdsName;
            props.navigation.setParams({
                title: title ? title : ''
            });
        }
    }

    initURI = (dataItem) => {
        let url = null,
            lstBenefits = '';

        const { ListWelfare, EmployeeGroupID } = dataItem;
        if (dataVnrStorage?.apiConfig?.serviceReviewPostingUrl)
            url = dataVnrStorage?.apiConfig?.serviceReviewPostingUrl;

        if (url != null) {
            if (ListWelfare?.length > 0) {
                lstBenefits = ListWelfare.map((x) => ({
                    vnr_id: x?.ID,
                    name: x?.WelfareName
                }));
            }

            let queryString = `level=${encodeURIComponent(EmployeeGroupID)}&benefit=${encodeURIComponent(
                JSON.stringify(lstBenefits)
            )}`;

            if (queryString) {
                url = `${url}?${queryString}`;
            }
        }

        return url;
    };

    getDataItem = async () => {
        try {
            const _params = this.props.navigation.state.params,
                { dataItem, screenName } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail = ConfigListDetail.value[screenName]
                    ? ConfigListDetail.value[screenName]
                    : configDefault;

            if (dataItem != null) {
                const data = {},
                    uriReview = this.initURI(dataItem);
                _configListDetail.forEach((item) => {
                    if (item.DataType == 'datetime') {
                        data[item.Name] = dataItem[item.DataField]
                            ? moment(dataItem[item.DataField]).format(item.DataFormat)
                            : '';
                    } else {
                        data[item.Name] = dataItem[item.DataField] ? dataItem[item.DataField] : '';
                    }
                });

                //  origin app
                data.originApp = 'portal4hrm';
                this.setState({
                    dataItem: data,
                    uriReview: uriReview,
                    listActions: [],
                    configListDetail: _configListDetail
                });
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

    reload = () => {
        const { reloadScreenList } = this.props.navigation.state.params;
        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');
        DrawerServices.goBack();
    };

    render() {
        const { dataItem, uriReview } = this.state;
        let contentViewDetail = <VnrLoading size={'large'} />;


        if (dataItem && Object.keys(dataItem).length > 0 && uriReview != null) {
            const getOrigin = Vnr_Function.getOriginFromUrl(uriReview);

            const INJECTED_JAVASCRIPT = `
                const data = ${JSON.stringify(dataItem)};
                window.postMessage(data, '${getOrigin}')
            `;

            contentViewDetail = (
                <View style={styleSheets.container}>
                    <WebView
                        ref={(ref) => (this.refWeb = ref)}
                        style={CustomStyleSheet.flex(1)}
                        cacheEnabled={false}
                        setDisplayZoomControls={true} // android only
                        source={{
                            uri: uriReview
                        }}
                        startInLoadingState={true}
                        injectedJavaScript={INJECTED_JAVASCRIPT}
                        scrollEnabled={true}
                        renderLoading={() => (
                            // eslint-disable-next-line react-native/no-inline-styles
                            <View style={{ alignSelf: 'center' }}>
                                <VnrLoading size="large" isVisible={true} />
                            </View>
                        )}
                    />
                </View>
            );
        } else if (dataItem == EnumName.E_EMPTYDATA || uriReview == null) {
            contentViewDetail = <EmptyData messageEmptyData={'EmptyData'} />;
        }

        return (
            <SafeAreaViewDetail style={styleSafeAreaView.style}>
                <View style={[styleSheets.container]}>{contentViewDetail}</View>
            </SafeAreaViewDetail>
        );
    }
}
