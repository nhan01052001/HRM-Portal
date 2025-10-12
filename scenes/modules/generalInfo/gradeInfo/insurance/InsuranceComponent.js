import React, { Component } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import VnrText from '../../../../../components/VnrText/VnrText';
import { styleSheets, Colors } from '../../../../../constants/styleConfig';
import DrawerServices from '../../../../../utils/DrawerServices';
import { EnumName, EnumTask } from '../../../../../assets/constant';
import { getDataLocal } from '../../../../../factories/LocalData';
import { startTask } from '../../../../../factories/BackGroundTask';
import { connect } from 'react-redux';

class InsuranceComponent extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            dataSource: null,
            isLoading: true,
            refreshing: false,
            keyQuery: EnumName.E_PRIMARY_DATA
        };
    }

    remoteData = (param = {}) => {
        const { keyQuery } = this.state;
        getDataLocal(EnumTask.KT_GeneralInfomation)
            .then(resData => {
                const res = resData && resData[keyQuery] ? resData[keyQuery] : null;

                if (res && res !== EnumName.E_EMPTYDATA) {
                    this.setState({
                        dataSource: { ...res[0] },
                        isLoading: false,
                        refreshing: false
                    });
                } else if (res === EnumName.E_EMPTYDATA) {
                    this.setState({
                        dataSource: null,
                        isLoading: false,
                        refreshing: false
                    });
                }
            })
            .catch(error => {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            });
    };

    pullToReFresh = () => {
        this.setState(
            {
                refreshing: true,
                keyQuery: EnumName.E_PRIMARY_DATA
            },
            () => {
                startTask({
                    keyTask: EnumTask.KT_GeneralInfomation,
                    payload: {
                        keyQuery: EnumName.E_PRIMARY_DATA,
                        reload: this.remoteData,
                        isCompare: true
                    }
                });
            }
        );
    };

    componentDidMount() {
        this.remoteData();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;
        console.log(nextProps, 'nextProps');
        if (nextProps.reloadScreenName == EnumTask.KT_GeneralInfomation) {
            //khi màn hình đang reload thì messsage phải là filter thì màn hình mới reload
            if (nextProps.message && keyQuery == nextProps.message.keyQuery) {
                if (nextProps.message.dataChange) {
                    this.remoteData({ isLazyLoading: true });
                } else {
                    this.setState({
                        isLoading: false,
                        refreshing: false
                    });
                }
            }
        }
    }

    render() {
        const { isLoading, dataSource } = this.state,
            { styles, initLableValue } = this.props;
        return (
            <View style={styles.styBlock}>
                <View style={styles.styTopTitle}>
                    <View style={styles.styWrap}>
                        <VnrText style={[styleSheets.lable, styles.styTitle]} i18nKey={'HRM_HR_Profile_Insurance'} />
                    </View>
                    {isLoading ? (
                        <ActivityIndicator size={'small'} color={Colors.primary} />
                    ) : (
                        <TouchableOpacity
                            onPress={() => DrawerServices.navigate('Insurance')}
                            style={styles.styWrapRight}
                        >
                            <VnrText style={[styleSheets.text, styles.styTextDetail]} i18nKey={'HRM_Common_ViewMore'} />
                        </TouchableOpacity>
                    )}
                </View>

                {dataSource !== null && (
                    <View style={styles.styViewData}>
                        {initLableValue(dataSource, {
                            Name: 'HealthInsNo',
                            DisplayKey: 'HRM_Medical_HistoryMedical_HealthInsNo',
                            DataType: 'string'
                        })}

                        {initLableValue(dataSource, {
                            Name: 'SocialInsNo',
                            DisplayKey: 'HRM_HR_Profile_SocialInsNo',
                            DataType: 'string'
                        })}
                    </View>
                )}
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        //generalProfileInfo: state.generalProfileInfo.data,
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InsuranceComponent);
