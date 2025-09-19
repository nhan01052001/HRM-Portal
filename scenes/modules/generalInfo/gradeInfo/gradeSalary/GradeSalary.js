import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import GradeSalaryList from './GradeSalaryList';
import { styleSheets, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName } from '../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';

let configList = null,
    enumName = null,
    screenName = null,
    screenViewDetail = null;
export default class GradeSalary extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            renderRow: null
        };
    }

    generaRender = () => {
        configList = ConfigList.value;
        enumName = EnumName;
        screenName = ScreenName.GeneralInfoSalaryGrade;
        screenViewDetail = ScreenName.GradeSalaryViewDetail;
        const _configList = configList && configList[screenName],
            renderRow = _configList && _configList[enumName.E_Row];
        this.setState({ renderRow });
    };

    componentDidMount() {
        this.generaRender();
    }

    render() {
        const { renderRow } = this.state;
        return (
            <SafeAreaView {...styleSafeAreaView}>
                {renderRow && (
                    <View style={[styleSheets.container]}>
                        <GradeSalaryList
                            detail={{
                                dataLocal: false,
                                screenDetail: screenViewDetail,
                                screenName: screenName
                            }}
                            api={{
                                urlApi: '[URI_HR]/Sal_GetData/GetGradeList',
                                type: 'E_POST',
                                dataBody: {
                                    profileID: dataVnrStorage.currentUser.info
                                        ? dataVnrStorage.currentUser.info.ProfileID
                                        : null
                                }
                            }}
                            valueField="ID"
                            renderConfig={renderRow}
                        />
                    </View>
                )}
            </SafeAreaView>
        );
    }
}
