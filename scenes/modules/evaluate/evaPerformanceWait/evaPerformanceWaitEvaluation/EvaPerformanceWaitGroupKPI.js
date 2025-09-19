import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    styleSafeAreaView,
    styleViewTitleForGroup,
    styleScreenDetail,
    Size,
    styleProfileInfo,
    Colors,
    styleButtonAddOrEdit,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import { EnumIcon, EnumName } from '../../../../../assets/constant';
import HttpService from '../../../../../utils/HttpService';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import {
    IconCheck,
    IconColse,
    IconEdit,
    IconPrev,
    IconPublish,
    IconError,
    IconDown,
    IconUp
} from '../../../../../constants/Icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DrawerServices from '../../../../../utils/DrawerServices';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { AlertSevice } from '../../../../../components/Alert/Alert';
export default class EvaPerformanceWaitGroupKPI extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDataEdit: null,
            fullData: null,
            dataUpdate: null,
            listIsUpdate: {},
            listShowHideGroup: {}
            // listCheckUpdate: {}
        };
        this.fullData = null;
        this.listCheckUpdate = {};
    }

    getFullData = () => this.fullData;

    setFullData = (data) => {
        this.fullData = [...data];
    };

    reload = () => {
        this.listCheckUpdate = {};
        this.getDataGroup();
    };

    getDataGroup = () => {
        const _params = this.props.navigation.state.params,
            { dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
            { listShowHideGroup } = this.state,
            dataBody = {
                PerfomanceEvaID: dataItem.ID,
                Type: 'E_PD',
                KPIGroupType: 'E_KPI'
            };

        HttpService.Post('[URI_HR]/Eva_GetData/GetPerformanceEvaDetailByPerformanceEvaID', dataBody).then((res) => {
            const newsData = [];
            // console.log(res)
            if (res && res.Data && Array.isArray(res.Data) && res.Data.length > 0) {
                //{eva_PerformanceEvaModel:{} : PerformanceEvaDetailModels : [] }

                const listGroup = res.Data.reduce(function (objGroup, currentValue, indexItem) {
                    listShowHideGroup[currentValue.NameEntityName] = true;
                    if (objGroup[currentValue.NameEntityName]) {
                        currentValue['indexItemApp'] = indexItem;
                        // dùng để check đang edit item nào
                        currentValue['listIsUpdate'] = {};
                        // dùng để check đã edit hay chưa
                        //currentValue['listCheckUpdated'] = {};
                        objGroup[currentValue.NameEntityName].push(currentValue);
                    } else {
                        currentValue['indexItemApp'] = indexItem;
                        // dùng để check đang edit item nào
                        currentValue['listIsUpdate'] = {};
                        // dùng để check đã edit hay chưa
                        //currentValue['listCheckUpdated'] = {};
                        objGroup[currentValue.NameEntityName] = [currentValue];
                    }

                    newsData.push({ ...currentValue });
                    return objGroup;
                }, {});
                this.setFullData(newsData);
                this.setState({
                    listDataEdit: listGroup,
                    dataUpdate: [...res.Data],
                    listShowHideGroup: listShowHideGroup
                });
            } else {
                this.setState({ listDataEdit: 'EmptyData' });
            }
        });
    };

    componentDidMount() {
        this.getDataGroup();
    }

    onViewEdit = (dataItem, fileUpdate) => {
        // on edit Filed
        const { dataUpdate } = this.state;
        const dataItemFromUpdate = dataUpdate[dataItem.indexItemApp];
        if (dataItemFromUpdate) {
            let { listIsUpdate } = dataItemFromUpdate;
            if (listIsUpdate) {
                listIsUpdate[fileUpdate] = true;
            }
            this.setState({ dataUpdate });
        }
    };

    onChangeText = (dataItem, text, fileUpdate) => {
        let { dataUpdate } = this.state;
        const _dataUpdate = [...dataUpdate];
        const dataItemFromUpdate = _dataUpdate[dataItem.indexItemApp];
        if (dataItemFromUpdate) {
            dataItemFromUpdate[fileUpdate] = text;
            dataUpdate = _dataUpdate;
            this.setState({ dataUpdate });
        }
    };

    undoText = (dataItem, filedUndo) => {
        // undo dữ liệu từ fullData
        const { dataUpdate } = this.state;
        let dataItemFromUpdate = dataUpdate[dataItem.indexItemApp],
            dataItemFromFull = this.getFullData()[dataItem.indexItemApp];
        if (dataItemFromUpdate) {
            let idItem = dataItemFromUpdate.ID;
            // Xoá key khỏi object khi undo
            if (this.listCheckUpdate[idItem]) {
                if (Object.keys(this.listCheckUpdate[idItem]).length == 1) {
                    delete this.listCheckUpdate[idItem];
                } else if (this.listCheckUpdate[idItem][filedUndo]) {
                    delete this.listCheckUpdate[idItem][filedUndo];
                }
            }
            // listCheckUpdate[dataItemFromUpdate.ID] && delete listCheckUpdate[dataItemFromUpdate.ID];

            // đưa về dữ liệu ban đầu
            dataItemFromUpdate[filedUndo] = dataItemFromFull[filedUndo];

            let { listIsUpdate } = dataItemFromUpdate;
            if (listIsUpdate) {
                listIsUpdate[filedUndo] = false;
            }

            this.setState({ dataUpdate });
        }
    };

    applyText = (dataItem, fileUpdate) => {
        const { dataUpdate } = this.state;
        let dataItemFromUpdate = dataUpdate[dataItem.indexItemApp];

        if (dataItemFromUpdate) {
            // đưa vô object id làm key để check dòng nào bị thay đổi
            // if(this.listCheckUpdate[idItem]){
            let idItem = dataItemFromUpdate.ID;
            this.listCheckUpdate[idItem] = {
                ...this.listCheckUpdate[idItem],
                ...{
                    [fileUpdate]: true
                }
            };
            // }
            // else{
            //    this.listCheckUpdate[idItem] ={
            ///         [fileUpdate] : true
            //    };
            // }

            //listCheckUpdate[dataItemFromUpdate.ID] = true;

            let { listIsUpdate } = dataItemFromUpdate;
            if (listIsUpdate) {
                listIsUpdate[fileUpdate] = false;
            }

            dataItemFromUpdate[fileUpdate] = parseFloat(dataItemFromUpdate[fileUpdate]);
            this.setState({ dataUpdate });
        }
    };

    editEvalResult = () => {
        const { dataUpdate } = this.state,
            _params = this.props.navigation.state.params,
            { reloadList, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params);

        if (this.listCheckUpdate && Object.keys(this.listCheckUpdate).length === 0) {
            ToasterSevice.showWarning('HRM_Data_Not_Change');
            return;
        }

        try {
            const dataBody = {
                eva_PerformanceEvaModel: dataItem,
                PerformanceEvaDetailModels: dataUpdate
            };
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Hre_GetDataV2/SaveWaitingEvaluation', dataBody).then((res) => {
                //  console.log(res)
                VnrLoadingSevices.hide();
                if (res && res.ActionStatus == EnumName.E_Success) {
                    ToasterSevice.showSuccess('Hrm_Succeed');
                    //reload danh sach
                    typeof reloadList === 'function' && reloadList();
                    this.reload();
                    DrawerServices.navigate('EvaPerformanceWait');
                } else if (res && Object.keys(res).length > 0 && res.messageNotify) {
                    ToasterSevice.showWarning(res.messageNotify);
                } else {
                    ToasterSevice.showWarning('Hrm_Fail');
                }
            });
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    onBackConfirm = () => {
        if (this.listCheckUpdate && Object.keys(this.listCheckUpdate).length > 0) {
            AlertSevice.alert({
                iconType: EnumIcon.E_CONFIRM,
                message: 'HRM_HR_DoYouWantToUpdateDataBelow',
                onCancel: () => {
                    DrawerServices.navigate('EvaPerformanceWait');
                },
                onConfirm: () => {
                    this.editEvalResult();
                }
            });
        } else {
            DrawerServices.navigate('EvaPerformanceWait');
        }
    };

    renderItemEdit = (listItemEdit) => {
        const { itemContent, viewInputEdit, bntSaveInputView, bntCancelInputView, bntCenter } = styleProfileInfo,
            { textValueInfo, textLableInfo } = styleScreenDetail,
            { dataUpdate } = this.state;

        if (Array.isArray(listItemEdit) && listItemEdit.length <= 0) return;

        return listItemEdit.map((item) => {
            let dataItemFromUpdate = dataUpdate[item.indexItemApp];

            let viewControlScore = <View />,
                viewControlActual2 = <View />;

            if (dataItemFromUpdate && dataItemFromUpdate.listIsUpdate && dataItemFromUpdate.listIsUpdate['Mark']) {
                viewControlScore = (
                    <View style={styleSheets.viewControl}>
                        <View style={viewInputEdit}>
                            <VnrTextInput
                                style={[styleSheets.textInput, { height: Size.heightInput }]}
                                autoFocus={true}
                                returnKeyType={'done'}
                                onSubmitEditing={() => this.applyText(item, 'Mark')}
                                value={dataItemFromUpdate.Mark ? `${dataItemFromUpdate.Mark}` : ''}
                                onChangeText={(text) => {
                                    this.onChangeText(item, text, 'Mark');
                                }}
                                keyboardType={'numeric'}
                                charType={'double'}
                                key={item.indexItemApp}
                            />
                        </View>

                        <View style={styles.styViewSaveInputbtn}>
                            <View style={bntSaveInputView}>
                                <TouchableOpacity
                                    style={bntCenter}
                                    onPress={() => {
                                        this.applyText(item, 'Mark');
                                    }}
                                >
                                    <IconCheck size={Size.iconSize} color={Colors.white} />
                                </TouchableOpacity>
                            </View>

                            <View style={bntCancelInputView}>
                                <TouchableOpacity
                                    style={bntCenter}
                                    onPress={() => {
                                        this.undoText(item, 'Mark');
                                    }}
                                >
                                    <IconColse size={Size.iconSize} color={Colors.white} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                );
            } else {
                let _isUpdateRecord = false;
                if (
                    this.listCheckUpdate[dataItemFromUpdate.ID] &&
                    this.listCheckUpdate[dataItemFromUpdate.ID]['Mark']
                ) {
                    _isUpdateRecord = true;
                }
                viewControlScore = (
                    <View style={styleSheets.viewControl}>
                        <View style={styles.styFlex9Center}>
                            <VnrText
                                style={[styleSheets.text, textValueInfo, CustomStyleSheet.marginRight(5)]}
                                value={dataItemFromUpdate.Mark ? dataItemFromUpdate.Mark : 0}
                            />
                            {_isUpdateRecord && <IconError size={Size.iconSize - 2} color={Colors.warning} />}
                        </View>
                        <View style={CustomStyleSheet.flex(1)}>
                            <TouchableOpacity
                                style={styles.styBtnViewEditMark}
                                onPress={() => this.onViewEdit(item, 'Mark')}
                            >
                                <IconEdit size={Size.iconSize - 3} color={Colors.gray_7} />
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            }

            if (dataItemFromUpdate && dataItemFromUpdate.listIsUpdate && dataItemFromUpdate.listIsUpdate['Actual2']) {
                viewControlActual2 = (
                    <View style={styleSheets.viewControl}>
                        <View style={viewInputEdit}>
                            <VnrTextInput
                                style={[styleSheets.textInput, { height: Size.heightInput }]}
                                autoFocus={true}
                                returnKeyType={'done'}
                                onSubmitEditing={() => this.applyText(item, 'Actual2')}
                                value={dataItemFromUpdate.Actual2 ? `${dataItemFromUpdate.Actual2}` : ''}
                                onChangeText={(text) => {
                                    this.onChangeText(item, text, 'Actual2');
                                }}
                                keyboardType={'numeric'}
                                charType={'double'}
                                key={item.indexItemApp}
                            />
                        </View>

                        <View style={styles.stySaveInputViewFlex3}>
                            <View style={bntSaveInputView}>
                                <TouchableOpacity
                                    style={bntCenter}
                                    onPress={() => {
                                        this.applyText(item, 'Actual2');
                                    }}
                                >
                                    <IconCheck size={Size.iconSize} color={Colors.white} />
                                </TouchableOpacity>
                            </View>

                            <View style={bntCancelInputView}>
                                <TouchableOpacity
                                    style={bntCenter}
                                    onPress={() => {
                                        this.undoText(item, 'Actual2');
                                    }}
                                >
                                    <IconColse size={Size.iconSize} color={Colors.white} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                );
            } else {
                let _isUpdateRecord = false;
                if (
                    this.listCheckUpdate[dataItemFromUpdate.ID] &&
                    this.listCheckUpdate[dataItemFromUpdate.ID]['Actual2']
                ) {
                    _isUpdateRecord = true;
                }

                // console.log(dataItemFromUpdate, 'dataItemFromUpdate.Actual2')
                viewControlActual2 = (
                    <View style={styleSheets.viewControl}>
                        <View style={styles.styFlex9Center}>
                            <VnrText
                                style={[styleSheets.text, textValueInfo, CustomStyleSheet.marginRight(5)]}
                                value={dataItemFromUpdate.Actual2 ? dataItemFromUpdate.Actual2 : 0}
                            />
                            {_isUpdateRecord && <IconError size={Size.iconSize - 2} color={Colors.warning} />}
                        </View>
                        <View style={CustomStyleSheet.flex(1)}>
                            <TouchableOpacity
                                style={styles.styBtnViewEditMark}
                                onPress={() => this.onViewEdit(item, 'Actual2')}
                            >
                                <IconEdit size={Size.iconSize - 3} color={Colors.gray_7} />
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            }

            return (
                <View style={styles.styViewKPI} key={item.indexItemApp}>
                    <View key={''} style={itemContent}>
                        <View style={styleSheets.viewLable}>
                            <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'KPIName'} />
                        </View>
                        <View style={styleSheets.viewControl}>
                            <VnrText style={[styleSheets.lable, textValueInfo]} value={item['KPIName']} />
                        </View>
                    </View>
                    <View key={''} style={itemContent}>
                        <View style={styles.styViewTitle}>
                            <View style={styles.styMasterData}>
                                <View style={styles.styFieldLeft}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Evaluation_Rate'}
                                    />
                                    <VnrText
                                        style={[styleSheets.text, textValueInfo]}
                                        value={item.Rate != null ? item.Rate : ''}
                                    />
                                </View>
                                <View style={styles.styFieldRight}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Evaluation_MinimumRating'}
                                    />
                                    <VnrText
                                        style={[styleSheets.text, textValueInfo]}
                                        value={item.MinimumRating != null ? item.MinimumRating : ''}
                                    />
                                </View>
                                <View style={styles.styFieldLeft}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'Eva_PerformanceDetail_DifficultRatio'}
                                    />
                                    <VnrText
                                        style={[styleSheets.text, textValueInfo]}
                                        value={item.DifficultRatio != null ? item.DifficultRatio : ''}
                                    />
                                </View>
                                <View style={styles.styFieldRight}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'MaximumRating'} />
                                    <VnrText
                                        style={[styleSheets.text, textValueInfo]}
                                        value={item.MaximumRating != null ? item.MaximumRating : ''}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    <View key={''} style={itemContent}>
                        <View style={styleSheets.viewLable}>
                            <VnrText
                                style={[styleSheets.text, textLableInfo]}
                                i18nKey={'HRM_Evaluation_PerformanceForDetail_Actual2'}
                            />
                        </View>
                        {viewControlActual2}
                    </View>

                    <View key={''} style={[itemContent, CustomStyleSheet.borderBottomWidth(0)]}>
                        <View style={styleSheets.viewLable}>
                            <VnrText
                                style={[styleSheets.text, textLableInfo]}
                                i18nKey={'HRM_Evaluation_PerformanceDetail_Mark'}
                            />
                        </View>
                        {viewControlScore}
                    </View>
                    {/* <View key={''} style={itemContent}>
                        <View style={styleSheets.viewLable} >
                            <VnrText
                                style={[styleSheets.text, textLableInfo]}
                                i18nKey={'Eva_ExtractionScore'}
                            />
                        </View>
                        <View style={styleSheets.viewControl}>
                            <Text>{item.ExtractionScore ? item.ExtractionScore : 0}</Text>
                        </View>
                    </View> */}
                </View>
            );
        });
    };

    ToggleGroup = (key) => () => {
        const { listShowHideGroup } = this.state;
        listShowHideGroup[key] = !listShowHideGroup[key];
        this.setState({
            listShowHideGroup
        });
    };

    renderListGroup = (dataListGroup) => {
        const { listShowHideGroup } = this.state,
            { styleViewTitleGroupRow, styleViewLable, textLableGroup } = styleViewTitleForGroup;

        if (Object.keys(dataListGroup).length <= 0) return;

        return Object.keys(dataListGroup).map((key, index) => {
            return (
                <View key={index}>
                    <TouchableOpacity style={styleViewTitleGroupRow} onPress={this.ToggleGroup(key)}>
                        <View style={styleViewLable}>
                            <VnrText style={[styleSheets.lable, textLableGroup]} value={key} />
                        </View>
                        {listShowHideGroup[key] ? (
                            <IconUp size={Size.iconSize - 3} color={Colors.primary} />
                        ) : (
                            <IconDown size={Size.iconSize - 3} color={Colors.primary} />
                        )}
                    </TouchableOpacity>
                    {listShowHideGroup[key] && this.renderItemEdit(dataListGroup[key])}
                    {/* {} */}
                </View>
            );
        });
    };

    render() {
        const { listDataEdit } = this.state;
        let contentView = <VnrLoading size={'large'} />;
        if (listDataEdit && listDataEdit !== 'EmptyData') {
            contentView = (
                <View style={styleSheets.container}>
                    <KeyboardAwareScrollView
                        contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                        extraScrollHeight={20} // khoan cach
                        keyboardShouldPersistTaps={'handled'}
                    >
                        {this.renderListGroup(listDataEdit)}
                    </KeyboardAwareScrollView>
                    {/* bottom button close, confirm */}
                    <View style={styleButtonAddOrEdit.groupButton}>
                        <TouchableOpacity onPress={() => this.onBackConfirm()} style={[styleButtonAddOrEdit.btnClose]}>
                            <IconPrev size={Size.iconSize} color={Colors.black} />
                            <VnrText
                                style={[
                                    styleSheets.lable,
                                    styleButtonAddOrEdit.groupButton__text,
                                    { color: Colors.greySecondary }
                                ]}
                                i18nKey={'HRM_Common_GoBack'}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => this.editEvalResult()}
                            style={styleButtonAddOrEdit.groupButton__button_save}
                        >
                            <IconPublish size={Size.iconSize} color={Colors.white} />
                            <VnrText
                                style={[styleSheets.lable, styleButtonAddOrEdit.groupButton__text]}
                                i18nKey={'HRM_Common_Save'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            );
        } else if (listDataEdit == 'EmptyData') {
            contentView = <EmptyData messageEmptyData={'EmptyData'} />;
        }
        return <SafeAreaView {...styleSafeAreaView}>{contentView}</SafeAreaView>;
    }
}

const styles = StyleSheet.create({
    stySaveInputViewFlex3: {
        flex: 3,
        flexDirection: 'row'
    },
    styBtnViewEditMark: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    styFlex9Center: {
        flex: 9,
        alignItems: 'center',
        flexDirection: 'row'
    },
    styViewSaveInputbtn: {
        flex: 3,
        flexDirection: 'row'
    },
    styViewKPI: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.gray_5,
        borderRadius: 5,
        marginHorizontal: Size.defineSpace,
        marginTop: 15,
        marginBottom: 7
    },
    styViewTitle: {
        width: '100%'
        // backgroundColor: Colors.primary_transparent_8
    },
    styMasterData: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        // backgroundColor: Colors.primary_transparent_8,
        // paddingHorizontal: 4,
        // paddingVertical: 5,
        borderRadius: 4
        // marginTop: 5
    },
    styFieldLeft: {
        width: '50%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingRight: 10
    },
    styFieldRight: {
        width: '50%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingLeft: 10
    }
});
