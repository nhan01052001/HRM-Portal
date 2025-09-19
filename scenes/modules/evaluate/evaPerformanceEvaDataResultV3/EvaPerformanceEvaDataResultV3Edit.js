import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    styleSafeAreaView,
    styleViewTitleForGroup,
    Size,
    styleProfileInfo,
    Colors,
    styleButtonAddOrEdit,
    CustomStyleSheet
} from '../../../../constants/styleConfig';
import { EnumIcon } from '../../../../assets/constant';
import HttpService from '../../../../utils/HttpService';
import { VnrLoadingSevices } from '../../../../components/VnrLoading/VnrLoadingPages';
import VnrLoading from '../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../components/EmptyData/EmptyData';
import VnrText from '../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../components/VnrTextInput/VnrTextInput';
import { IconCheck, IconColse, IconEdit, IconPrev, IconPublish, IconError } from '../../../../constants/Icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DrawerServices from '../../../../utils/DrawerServices';
import { ToasterSevice } from '../../../../components/Toaster/Toaster';
import { AlertSevice } from '../../../../components/Alert/Alert';

export default class EvaPerformanceEvaDataResultV3Edit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDataEdit: null,
            fullData: null,
            dataUpdate: null,
            listCheckUpdate: {}
        };
        this.fullData = null;
    }

    getFullData = () => this.fullData;

    setFullData = (data) => {
        this.fullData = [...data];
    };

    getDataGroup = () => {
        const _params = this.props.navigation.state.params,
            { listDataEdit } = typeof _params == 'object' ? _params : JSON.parse(_params),
            listID = listDataEdit.map((item) => item.ID),
            dataBody = {
                PerformanceEvaIDs: listID
            };

        HttpService.Post('[URI_HR]/Eva_GetData/GetPerformanceEvaDetailByPerformanceEvaIDs_Portal', dataBody).then(
            (res) => {
                const newsData = [];

                if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
                    const listGroup = res.data.reduce(function (objGroup, currentValue, indexItem) {
                        if (objGroup[currentValue.GroupFieldGridCustom]) {
                            currentValue['indexItemApp'] = indexItem;
                            objGroup[currentValue.GroupFieldGridCustom].push(currentValue);
                        } else {
                            currentValue['indexItemApp'] = indexItem;
                            objGroup[currentValue.GroupFieldGridCustom] = [currentValue];
                        }

                        newsData.push({ ...currentValue });
                        return objGroup;
                    }, {});

                    this.setFullData(newsData);
                    this.setState({
                        listDataEdit: listGroup,
                        dataUpdate: [...res.data]
                    });
                } else {
                    this.setState({ listDataEdit: 'EmptyData' });
                }
            }
        );
    };

    componentDidMount() {
        this.getDataGroup();
    }

    onViewEdit = (dataItem) => {
        // on edit Filed
        const { dataUpdate } = this.state;
        const dataItemFromUpdate = dataUpdate[dataItem.indexItemApp];
        if (dataItemFromUpdate) {
            dataItemFromUpdate.isUpdate = true;
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
        const { dataUpdate, listCheckUpdate } = this.state;
        let dataItemFromUpdate = dataUpdate[dataItem.indexItemApp],
            dataItemFromFull = this.getFullData()[dataItem.indexItemApp];
        if (dataItemFromUpdate) {
            // Xoá key khỏi object khi undo
            listCheckUpdate[dataItemFromUpdate.ID] && delete listCheckUpdate[dataItemFromUpdate.ID];

            dataItemFromUpdate[filedUndo] = dataItemFromFull[filedUndo];
            dataItemFromUpdate.isUpdate = false;
            this.setState({ dataUpdate });
        }
    };

    applyText = (dataItem, fileUpdate) => {
        const { dataUpdate, listCheckUpdate } = this.state;
        let dataItemFromUpdate = dataUpdate[dataItem.indexItemApp];

        if (dataItemFromUpdate) {
            // đưa vô object id làm key để check dòng nào bị thay đổi
            listCheckUpdate[dataItemFromUpdate.ID] = true;

            dataItemFromUpdate.isUpdate = false;
            dataItemFromUpdate[fileUpdate] = parseFloat(dataItemFromUpdate[fileUpdate]);
            this.setState({ dataUpdate });
        }
    };

    editEvalResult = () => {
        const { dataUpdate, listCheckUpdate } = this.state,
            _params = this.props.navigation.state.params,
            { reloadList } = typeof _params == 'object' ? _params : JSON.parse(_params);

        if (listCheckUpdate && Object.keys(listCheckUpdate).length === 0) {
            ToasterSevice.showWarning('HRM_Data_Not_Change');
            return;
        }

        try {
            const dataBody = {
                listPerformanceEvaDetailEntity: dataUpdate
            };
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Eva_GetData/SaveDataPerformanceEvaDetail_App', dataBody).then((res) => {
                VnrLoadingSevices.hide();
                if (res && Object.keys(res).length > 0 && res.success) {
                    ToasterSevice.showSuccess('Hrm_Succeed');
                    //reload danh sach

                    typeof reloadList === 'function' && reloadList();
                    DrawerServices.navigate('EvaPerformanceEvaDataResultV3');
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
        const { listCheckUpdate } = this.state;
        if (listCheckUpdate && Object.keys(listCheckUpdate).length > 0) {
            AlertSevice.alert({
                iconType: EnumIcon.E_CONFIRM,
                message: 'HRM_HR_DoYouWantToUpdateDataBelow',
                onCancel: () => {
                    DrawerServices.navigate('EvaPerformanceEvaDataResultV3');
                },
                onConfirm: () => {
                    this.editEvalResult();
                }
            });
        } else {
            DrawerServices.navigate('EvaPerformanceEvaDataResultV3');
        }
    };

    renderItemEdit = (listItemEdit) => {
        const { itemContent, textLableInfo, viewInputEdit, bntSaveInputView, bntCancelInputView, bntCenter } =
                styleProfileInfo,
            { dataUpdate, listCheckUpdate } = this.state;

        if (Array.isArray(listItemEdit) && listItemEdit.length <= 0) return;

        return listItemEdit.map((item) => {
            let dataItemFromUpdate = dataUpdate[item.indexItemApp];
            let viewControlScore = <View />,
                _isUpdateRecord = false;

            if (dataItemFromUpdate && listCheckUpdate[dataItemFromUpdate.ID]) {
                _isUpdateRecord = true;
            }

            if (dataItemFromUpdate && dataItemFromUpdate.isUpdate) {
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

                        <View style={styles.styViewBtnSaveInput}>
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
                viewControlScore = (
                    <View style={styleSheets.viewControl}>
                        <View style={styles.styViewControlScoreMark}>
                            <VnrText
                                style={[styleSheets.text, CustomStyleSheet.marginRight(5)]}
                                value={dataItemFromUpdate.Mark ? dataItemFromUpdate.Mark : 0}
                            />
                            {_isUpdateRecord && <IconError size={Size.iconSize - 2} color={Colors.warning} />}
                        </View>
                        <View style={CustomStyleSheet.flex(1)}>
                            <TouchableOpacity style={styles.styViewBtnEdit} onPress={() => this.onViewEdit(item)}>
                                <IconEdit size={Size.iconSize} color={Colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            }

            return (
                <View style={styles.styViewControlWrapp} key={item.indexItemApp}>
                    <View key={''} style={itemContent}>
                        <View style={styleSheets.viewLable}>
                            <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'KPIName'} />
                        </View>
                        <View style={styleSheets.viewControl}>
                            <View style={styles.styViewKPIname}>
                                <VnrText style={[styleSheets.text]} value={item['KPIName']} />
                            </View>
                        </View>
                    </View>

                    <View key={''} style={itemContent}>
                        <View style={styleSheets.viewLable}>
                            <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'TotalMark'} />
                        </View>
                        {viewControlScore}
                    </View>

                    <View key={''} style={itemContent}>
                        <View style={styleSheets.viewLable}>
                            <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'Eva_ExtractionScore'} />
                        </View>
                        <View style={styleSheets.viewControl}>
                            <Text>{item.ExtractionScore ? item.ExtractionScore : 0}</Text>
                        </View>
                    </View>
                </View>
            );
        });
    };

    renderListGroup = (dataListGroup) => {
        const { styleViewTitleGroup, textLableGroup } = styleViewTitleForGroup;

        if (Object.keys(dataListGroup).length <= 0) return;

        return Object.keys(dataListGroup).map((item, index) => {
            return (
                <View key={index}>
                    <View style={styleViewTitleGroup}>
                        <VnrText style={[styleSheets.text, textLableGroup]} value={item} />
                    </View>
                    {this.renderItemEdit(dataListGroup[item])}
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
    styViewKPIname: {
        flex: 9,
        justifyContent: 'center'
    },
    styViewControlWrapp: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.borderColor,
        borderRadius: 5,
        marginHorizontal: Size.defineSpace,
        marginTop: 15,
        marginBottom: 7
    },
    styViewBtnEdit: { alignItems: 'center', justifyContent: 'center' },
    styViewControlScoreMark: { flex: 9, alignItems: 'center', flexDirection: 'row' },
    styViewBtnSaveInput: { flex: 3, flexDirection: 'row' }
});
