import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import BasicSalaryDetailList from './BasicSalaryDetailList';
import { styleSheets, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { EnumName, ScreenName } from '../../../../../assets/constant';
import DrawerServices from '../../../../../utils/DrawerServices';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import TouchIDService from '../../../../../utils/TouchIDService';

let configList = null,
    enumName = null;

export default class BasicSalaryDetail extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            renderRow: null,
            isConfirmPass: false
        };
    }

    generaRender = () => {
        configList = ConfigList.value;
        enumName = EnumName;

        const _configList = configList && configList['GeneralInfoSalBasicSalaryDetail'],
            renderRow = _configList && _configList[enumName.E_Row];

        this.setState({ renderRow, isConfirmPass: true });
    };

    onFinish = isSuccess => {
        if (isSuccess) this.generaRender();
        else DrawerServices.goBack();
    };

    componentDidMount() {
        TouchIDService.checkConfirmPass(this.onFinish.bind(this));
    }

    render() {
        const { renderRow, isConfirmPass } = this.state;
        return (
            <SafeAreaView {...styleSafeAreaView}>
                {renderRow && isConfirmPass ? (
                    <View style={[styleSheets.container]}>
                        <BasicSalaryDetailList
                            detail={{
                                dataLocal: false,
                                screenDetail: ScreenName.BasicSalaryDetailViewDetail,
                                screenName: ScreenName.GeneralInfoSalBasicSalaryDetail
                            }}
                            api={{
                                urlApi: '[URI_HR]/Sal_GetData/New_GetBasicSalaryByIdProfile',
                                type: 'E_POST',
                                dataBody: {
                                    profileID: null
                                },
                                pageSize: 0
                            }}
                            valueField="ID"
                            renderConfig={renderRow}
                        />
                    </View>
                ) : (
                    <VnrLoading size="large" isVisible={true} />
                )}
            </SafeAreaView>
        );
    }
}
