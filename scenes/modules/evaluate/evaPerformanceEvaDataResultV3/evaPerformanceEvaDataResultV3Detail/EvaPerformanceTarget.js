import React, { Component } from 'react';
import { SafeAreaView } from 'react-navigation';
import { styleSafeAreaView } from '../../../../../constants/styleConfig';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { connect } from 'react-redux';
import evaPerformanceEvaDataResultV3 from '../../../../../redux/evaPerformanceEvaDataResultV3';
import { EnumName, ScreenName } from '../../../../../assets/constant';
import EvaPerformanceTargetList from './evaPerformanceTargetList/EvaPerformanceTargetList';
class EvaPerformanceTarget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null
        };
    }
F
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
        const { dataItem } = this.state;
        return (
            <SafeAreaView {...styleSafeAreaView}>
                {dataItem && (
                    <EvaPerformanceTargetList
                        detail={{
                            dataLocal: false,
                            screenName: ScreenName.EvaPerformanceTarget,
                            screenDetail: ScreenName.EvaPerformanceTargetViewDetail
                        }}
                        api={{
                            urlApi: '[URI_HR]/Eva_GetData/PerformanceEvaDataResultV3GetDetail_Portal',
                            type: EnumName.E_POST,
                            dataBody: {
                                PerformanceEvaID: dataItem ? dataItem.ID : '',
                                PerformanceID: dataItem ? dataItem.PerformanceID : ''
                            },
                            pageSize: 20
                        }}
                        valueField="ID"
                    />
                )}
            </SafeAreaView>
        );
    }
}

const mapStateToProps = state => {
    return { dataItemFormRedux: state.evaPerformanceEvaDataResultV3.data };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchGetById: ID => {
            dispatch(evaPerformanceEvaDataResultV3.actions.fetchGetById(ID));
        }
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EvaPerformanceTarget);
