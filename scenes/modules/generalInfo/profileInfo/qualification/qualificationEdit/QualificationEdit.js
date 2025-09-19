import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleSafeAreaView } from '../../../../../../constants/styleConfig';
import { ScreenName, EnumName } from '../../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../../assets/auth/authentication';
import QualificationList from '../qualificationList/QualificationList';
import { generateRowActionAndSelected, QualificationBusinessFunction } from '../QualificationBusinessFunction';
let enumName = null,
    screenName = null,
    screenViewDetail = null;
export default class QualificationEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataBody: null,
            rowActions: [],
            selected: [],
            refreshList: true
        };

        this.storeParamsDefault = null;
        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            // reload danh sách khi có edit hoặc delete dữ liệu
            if (QualificationBusinessFunction.checkForLoadEditDelete[ScreenName.QualificationEdit]) {
                this.reload();
            }
            QualificationBusinessFunction.setThisForBusiness(this, false);
        });
    }

    reload = paramsFilter => {
        if (paramsFilter === 'E_KEEP_FILTER') {
            paramsFilter = { ...this.paramsFilter };
        } else {
            this.paramsFilter = { ...paramsFilter };
        }

        QualificationBusinessFunction.checkForLoadEditDelete[ScreenName.QualificationEdit] = false;

        let _paramsDefault = this.storeParamsDefault;
        _paramsDefault = {
            ..._paramsDefault,
            dataBody: { ..._paramsDefault.dataBody, ...paramsFilter },
            refreshList: !this.state.refreshList
        };
        this.setState(_paramsDefault);
    };

    paramsDefault = () => {
        const _configList = {}, //configList[screenName],
            //renderRow = _configList[enumName.E_Row],
            orderBy = _configList[enumName.E_Order];

        const dataRowActionAndSelected = generateRowActionAndSelected(screenName);
        let _params = {
            IsPortal: true,
            sort: orderBy,
            profileID: dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null
        };
        return {
            rowActions: dataRowActionAndSelected.rowActions,
            selected: dataRowActionAndSelected.selected,
            //renderRow: renderRow,
            dataBody: _params
        };
    };

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
    }

    generaRender = () => {
        enumName = EnumName;
        screenName = ScreenName.QualificationEdit;
        screenViewDetail = ScreenName.QualificationEditViewDetail;
        // const _configList = configList && configList['GeneralInfoAttendanceGrade'],
        //     renderRow = _configList && _configList[enumName.E_Row];

        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);
    };

    componentDidMount() {
        this.generaRender();
    }

    render() {
        const { dataBody, rowActions, selected, refreshList } = this.state;

        // console.log(selected, rowActions)
        return (
            <SafeAreaView {...styleSafeAreaView}>
                {dataBody && (
                    <View style={[styleSheets.container]}>
                        <QualificationList
                            isRefreshList={refreshList}
                            rowActions={rowActions}
                            selected={selected}
                            reloadScreenList={this.reload.bind(this)}
                            detail={{
                                dataLocal: false,
                                screenDetail: screenViewDetail,
                                screenName: screenName
                            }}
                            api={{
                                urlApi: '[URI_HR]/Hre_GetData/GetHre_ProfileQualificationByDataStatus_Edit',
                                type: 'E_POST',
                                dataBody: dataBody
                            }}
                            valueField="ID"
                            // renderConfig={renderRow}
                        />
                    </View>
                )}
            </SafeAreaView>
        );
    }
    // constructor(porps) {
    //     super(porps);
    //     this.state = {
    //         renderRow: null,
    //         isShowList: false
    //     }
    // }

    // generaRender = () => {
    //     configList = ConfigList.value;
    //     enumName = EnumName;
    //     screenName = ScreenName.QualificationEdit;
    //     screenViewDetail = ScreenName.QualificationEditViewDetail;
    //     // const _configList = configList && configList[screenName],
    //     //     renderRow = _configList && _configList[enumName.E_Row];
    //     this.setState({ isShowList: true });
    // }

    // componentDidMount() {
    //     this.generaRender();
    // }

    // render() {
    //     const { isShowList } = this.state;
    //     return (
    //         <SafeAreaView {...styleSafeAreaView}>
    //             {
    //                 isShowList && (
    //                     <View style={[styleSheets.container]}>
    //                         <QualificationList
    //                             detail={{
    //                                 dataLocal: false,
    //                                 screenDetail: screenViewDetail,
    //                                 screenName: screenName
    //                             }}
    //                             api={{
    //                                 urlApi: `[URI_HR]/Hre_GetData/GetHre_ProfileQualificationByDataStatus_Edit`,
    //                                 type: "E_POST",
    //                                 dataBody: {
    //                                     profileID: dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID
    //                                         : null
    //                                 },
    //                             }}
    //                             valueField="ID"
    //                         />
    //                     </View>
    //                 )
    //             }
    //         </SafeAreaView>
    //     );
    // }
}
