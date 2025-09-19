import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleScreenDetail, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import { connect } from 'react-redux';
import evaPerformanceEvaDataResultV3 from '../../../../../redux/evaPerformanceEvaDataResultV3';
class PerformanceTemplateProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null
        };
    }

    getDataItem = () => {
        try {
            const _params = this.props.navigation.state.params,
                { dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                { dataItemFormRedux, fetchGetById } = this.props;

            if (!Vnr_Function.CheckIsNullOrEmpty(dataItem)) {
                if (dataItemFormRedux && dataItemFormRedux.ID === dataItem.ID) {
                    this.setState({ dataItem: dataItemFormRedux });
                } else {
                    fetchGetById(dataItem ? dataItem.ID : '');
                }
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

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { dataItemFormRedux } = nextProps;
        if (dataItemFormRedux) {
            this.setState({ dataItem: dataItemFormRedux });
        }
    }

    render() {
        const { dataItem } = this.state,
            { containerItemDetail } = styleScreenDetail,
            configListDetail = ConfigListDetail.value['PerformanceTemplateProfile'];

        let contentViewDetail = <View />;
        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={[styleSheets.col_10]}>
                    <ScrollView>
                        <View style={containerItemDetail}>
                            {configListDetail.map((e) => {
                                return Vnr_Function.formatStringTypeV2(dataItem, e);
                            })}
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

const mapStateToProps = (state) => {
    return { dataItemFormRedux: state.evaPerformanceEvaDataResultV3.data };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchGetById: (ID) => {
            dispatch(evaPerformanceEvaDataResultV3.actions.fetchGetById(ID));
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(PerformanceTemplateProfile);
