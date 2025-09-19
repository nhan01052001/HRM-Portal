/* eslint-disable react-native/no-unused-styles */
/* eslint-disable react/display-name */
import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView, createAppContainer } from 'react-navigation';
import { styleSheets, styleScreenDetail, styleSafeAreaView, Colors, Size, CustomStyleSheet } from '../../../../../constants/styleConfig';
import { TaskBusinessBusinessFunction } from '../HreTaskBusiness';
import VnrText from '../../../../../components/VnrText/VnrText';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import DrawerServices from '../../../../../utils/DrawerServices';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../../i18n/translate';
import moment from 'moment';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
import HreModalEvaluation from '../HreModalEvaluation';
const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

//#region [tạo tab màn hình detail (công việc, đánh giá)]
const TopTabHreTaskDetailInfo = createMaterialTopTabNavigator(
    {
        Description: {
            screen: props => <Description {...props} />,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'Description')
        },
        Plan: {
            screen: props => <Plan {...props} />,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_System_Resource_Tra_Plan')
        },
        Detail: {
            screen: props => <Detail {...props} />,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_Common_ViewMore')
        },
        Note: {
            screen: props => <Note {...props} />,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'Note')
        }
    },
    {
        lazy: true,
        tabBarComponent: navigationAll => {
            const { navigation } = navigationAll,
                { index } = navigation.state;
            return (
                <View style={styles.containTab}>
                    <ScrollView horizontal pagingEnabled={false} showsHorizontalScrollIndicator={false}>
                        <TouchableOpacity
                            style={[styles.tabStyle, index == 0 && styles.styleTabActive]}
                            onPress={() => navigation.navigate('Description')}
                        >
                            <VnrText
                                i18nKey={'Description'}
                                style={[styleSheets.text, index != 0 ? styles.text_colorGrey : styles.text_colorBlue]}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tabStyle, index == 1 && styles.styleTabActive]}
                            onPress={() => navigation.navigate('Plan')}
                        >
                            <VnrText
                                i18nKey={'HRM_System_Resource_Tra_Plan'}
                                style={[styleSheets.text, index != 1 ? styles.text_colorGrey : styles.text_colorBlue]}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tabStyle, index == 2 && styles.styleTabActive]}
                            onPress={() => navigation.navigate('Detail')}
                        >
                            <VnrText
                                i18nKey={'HRM_Common_ViewMore'}
                                style={[styleSheets.text, index != 2 ? styles.text_colorGrey : styles.text_colorBlue]}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tabStyle, index == 3 && styles.styleTabActive]}
                            onPress={() => navigation.navigate('Note')}
                        >
                            <VnrText
                                i18nKey={'Note'}
                                style={[styleSheets.text, index != 3 ? styles.text_colorGrey : styles.text_colorBlue]}
                            />
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            );
        }
    }
);
const ContainerHreTaskDetailInfo = createAppContainer(TopTabHreTaskDetailInfo);
//#endregion

const Description = _props => {
    const { dataItem } = _props.screenProps;

    if (dataItem.Content) {
        dataItem.Content = dataItem.Content.replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&Agrave;/g, 'À')
            .replace(/&Aacute;/g, 'Á')
            .replace(/&Acirc;/g, 'Â')
            .replace(/&Atilde;/g, 'Ã')
            .replace(/&Egrave;/g, 'È')
            .replace(/&Eacute;/g, 'É')
            .replace(/&Ecirc;/g, 'Ê')
            .replace(/&Igrave;/g, 'Ì')
            .replace(/&Iacute;/g, 'Í')
            .replace(/&ETH;/g, 'Ð')
            .replace(/&Ograve;/g, 'Ò')
            .replace(/&Oacute;/g, 'Ó')
            .replace(/&Ocirc;/g, 'Ô')
            .replace(/&Otilde;/g, 'Õ')
            .replace(/&Ugrave;/g, 'Ù')
            .replace(/&Uacute;/g, 'Ú')
            .replace(/&Yacute;/g, 'Ý')
            .replace(/&agrave;/g, 'à')
            .replace(/&aacute;/g, 'á')
            .replace(/&acirc;/g, 'â')
            .replace(/&atilde;/g, 'ã')
            .replace(/&egrave;/g, 'è')
            .replace(/&eacute;/g, 'é')
            .replace(/&ecirc;/g, 'ê')
            .replace(/&igrave;/g, 'ì')
            .replace(/&iacute;/g, 'í')
            .replace(/&ograve;/g, 'ò')
            .replace(/&oacute;/g, 'ó')
            .replace(/&ocirc;/g, 'ô')
            .replace(/&otilde;/g, 'õ')
            .replace(/&ugrave;/g, 'ù')
            .replace(/&uacute;/g, 'ú')
            .replace(/&yacute;/g, 'ý')
            .replace(/&amp;/g, '&')
            .replace(/<[^>]*>?/gm, '');
    }

    return (
        <View style={CustomStyleSheet.flex(1)}>
            <ScrollView style={CustomStyleSheet.flex(1)}>
                <View style={styleScreenDetail.containerItemDetail}>
                    {/* TaskModelName */}
                    <View key={''} style={styleScreenDetail.itemContent}>
                        <View style={styleSheets.viewLable}>
                            <VnrText
                                style={[styleSheets.text, styleScreenDetail.textLableInfo]}
                                i18nKey={'SampleTaskID'}
                            />
                        </View>
                        <View style={styleSheets.viewControl}>
                            {Vnr_Function.formatStringType(dataItem, {
                                Name: 'TaskModelName',
                                DataType: '',
                                DataFormat: ''
                            })}
                        </View>
                    </View>

                    {/* Code */}
                    <View key={''} style={styleScreenDetail.itemContent}>
                        <View style={styleSheets.viewLable}>
                            <VnrText
                                style={[styleSheets.text, styleScreenDetail.textLableInfo]}
                                i18nKey={'HRM_Hre_FacilityItem_Code'}
                            />
                        </View>
                        <View style={styleSheets.viewControl}>
                            {Vnr_Function.formatStringType(dataItem, {
                                Name: 'Code',
                                DataType: '',
                                DataFormat: ''
                            })}
                        </View>
                    </View>

                    {/* TaskName */}
                    <View key={''} style={styleScreenDetail.itemContent}>
                        <View style={styleSheets.viewLable}>
                            <VnrText
                                style={[styleSheets.text, styleScreenDetail.textLableInfo]}
                                i18nKey={'HRM_HR_Task_TaskName'}
                            />
                        </View>
                        <View style={styleSheets.viewControl}>
                            {Vnr_Function.formatStringType(dataItem, {
                                Name: 'TaskName',
                                DataType: '',
                                DataFormat: ''
                            })}
                        </View>
                    </View>

                    {/* TaskProjectName */}
                    <View key={''} style={styleScreenDetail.itemContent}>
                        <View style={styleSheets.viewLable}>
                            <VnrText
                                style={[styleSheets.text, styleScreenDetail.textLableInfo]}
                                i18nKey={'HRM_Tas_Task_Project'}
                            />
                        </View>
                        <View style={styleSheets.viewControl}>
                            {Vnr_Function.formatStringType(dataItem, {
                                Name: 'TaskProjectName',
                                DataType: '',
                                DataFormat: ''
                            })}
                        </View>
                    </View>

                    {/* TaskPhaseName */}
                    <View key={''} style={styleScreenDetail.itemContent}>
                        <View style={styleSheets.viewLable}>
                            <VnrText
                                style={[styleSheets.text, styleScreenDetail.textLableInfo]}
                                i18nKey={'HRM_Tas_Task_Phase'}
                            />
                        </View>
                        <View style={styleSheets.viewControl}>
                            {Vnr_Function.formatStringType(dataItem, {
                                Name: 'TaskPhaseName',
                                DataType: '',
                                DataFormat: ''
                            })}
                        </View>
                    </View>

                    {/* TaskGroupName */}
                    <View key={''} style={styleScreenDetail.itemContent}>
                        <View style={styleSheets.viewLable}>
                            <VnrText
                                style={[styleSheets.text, styleScreenDetail.textLableInfo]}
                                i18nKey={'HRM_Tas_Task_TaskGroup'}
                            />
                        </View>
                        <View style={styleSheets.viewControl}>
                            {Vnr_Function.formatStringType(dataItem, {
                                Name: 'TaskGroupName',
                                DataType: '',
                                DataFormat: ''
                            })}
                        </View>
                    </View>

                    {/* TypeView */}
                    <View key={''} style={styleScreenDetail.itemContent}>
                        <View style={styleSheets.viewLable}>
                            <VnrText
                                style={[styleSheets.text, styleScreenDetail.textLableInfo]}
                                i18nKey={'HRM_Tas_Task_TypeView'}
                            />
                        </View>
                        <View style={styleSheets.viewControl}>
                            {Vnr_Function.formatStringType(dataItem, {
                                Name: 'TypeView',
                                DataType: '',
                                DataFormat: ''
                            })}
                        </View>
                    </View>

                    {/* HRM_Evaluation_GeneralFormula */}
                    <View key={''} style={styleScreenDetail.itemContent}>
                        <View style={styleSheets.viewLable}>
                            <VnrText
                                style={[styleSheets.text, styleScreenDetail.textLableInfo]}
                                i18nKey={'HRM_Evaluation_GeneralFormula'}
                            />
                        </View>
                        <View style={styleSheets.viewControl}>
                            <VnrText style={[styleSheets.text]} value={dataItem.NameEntityName} />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const Plan = _props => {
    const { dataItem } = _props.screenProps;

    return (
        <View style={CustomStyleSheet.flex(1)}>
            <ScrollView style={CustomStyleSheet.flex(1)}>
                <View style={styleScreenDetail.containerItemDetail}>
                    {/* AssignmentDate */}
                    <View key={''} style={styleScreenDetail.itemContent}>
                        <View style={styleSheets.viewLable}>
                            <VnrText
                                style={[styleSheets.text, styleScreenDetail.textLableInfo]}
                                i18nKey={'HRM_Hre_Tas_Task_DateGive'}
                            />
                        </View>
                        <View style={styleSheets.viewControl}>
                            {Vnr_Function.formatStringType(dataItem, {
                                Name: 'AssignmentDate',
                                DataType: 'datetime',
                                DataFormat: 'DD/MM/YYYY'
                            })}
                        </View>
                    </View>

                    {/* ExpectedDate */}
                    <View key={''} style={styleScreenDetail.itemContent}>
                        <View style={styleSheets.viewLable}>
                            <VnrText
                                style={[styleSheets.text, styleScreenDetail.textLableInfo]}
                                i18nKey={'HRM_Tas_Task_ExpectedDate'}
                            />
                        </View>
                        <View style={styleSheets.viewControl}>
                            {Vnr_Function.formatStringType(dataItem, {
                                Name: 'ExpectedDate',
                                DataType: 'datetime',
                                DataFormat: 'DD/MM/YYYY'
                            })}
                        </View>
                    </View>

                    {/* FinishDate */}
                    <View key={''} style={styleScreenDetail.itemContent}>
                        <View style={styleSheets.viewLable}>
                            <VnrText
                                style={[styleSheets.text, styleScreenDetail.textLableInfo]}
                                i18nKey={'HRM_Tas_Task_FinishDate'}
                            />
                        </View>
                        <View style={styleSheets.viewControl}>
                            {Vnr_Function.formatStringType(dataItem, {
                                Name: 'FinishDate',
                                DataType: 'datetime',
                                DataFormat: 'DD/MM/YYYY'
                            })}
                        </View>
                    </View>

                    {/* StatusView */}
                    <View key={''} style={styleScreenDetail.itemContent}>
                        <View style={styleSheets.viewLable}>
                            <VnrText
                                style={[styleSheets.text, styleScreenDetail.textLableInfo]}
                                i18nKey={'HRM_Hre_Tas_Task_Status'}
                            />
                        </View>
                        <View style={styleSheets.viewControl}>
                            {Vnr_Function.formatStringType(dataItem, {
                                Name: 'StatusView',
                                DataType: '',
                                DataFormat: ''
                            })}
                        </View>
                    </View>

                    {/* TaskMaster */}
                    <View key={''} style={styleScreenDetail.itemContent}>
                        <View style={styleSheets.viewLable}>
                            <VnrText
                                style={[styleSheets.text, styleScreenDetail.textLableInfo]}
                                i18nKey={'HRM_Hre_Tas_Task_TaskMaster'}
                            />
                        </View>
                        <View style={styleSheets.viewControl}>
                            {Vnr_Function.formatStringType(dataItem, {
                                Name: 'TaskMaster',
                                DataType: '',
                                DataFormat: ''
                            })}
                        </View>
                    </View>

                    {/* AssignedPerson */}
                    <View key={''} style={styleScreenDetail.itemContent}>
                        <View style={styleSheets.viewLable}>
                            <VnrText
                                style={[styleSheets.text, styleScreenDetail.textLableInfo]}
                                i18nKey={'HRM_Tas_Task_AssignedEmpID'}
                            />
                        </View>
                        <View style={styleSheets.viewControl}>
                            {Vnr_Function.formatStringType(dataItem, {
                                Name: 'AssignedPerson',
                                DataType: '',
                                DataFormat: ''
                            })}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const Detail = _props => {
    const { dataItem } = _props.screenProps,
        reviewfile = url => {
            if (Platform.OS == 'ios') {
                ManageFileSevice.ReviewFile(url);
            } else {
                ManageFileSevice.DownloadFile(url);
            }
        },
        fileAttch = dataItem && dataItem.FileAttach ? dataItem.FileAttach : '';

    let listFileAttach = [];

    if (fileAttch) {
        fileAttch.split('[Portal_FileAttach_Space]').map(item => {
            let [link, nameFile] = item.split('[Portal_FileAttach_Link]');
            listFileAttach.push({
                nameFile: nameFile,
                uriFile: link
            });
        });
    }

    return (
        <View style={CustomStyleSheet.flex(1)}>
            <ScrollView style={CustomStyleSheet.flex(1)}>
                <View style={styleScreenDetail.containerItemDetail}>
                    {/* FileAttach */}
                    <View key={''} style={styleScreenDetail.itemContent}>
                        <View style={styleSheets.viewLable}>
                            <VnrText
                                style={[styleSheets.text, styleScreenDetail.textLableInfo]}
                                i18nKey={'HRM_HR_Reward_Attachment'}
                            />
                        </View>

                        {listFileAttach.length > 0 ? (
                            listFileAttach.map((item, index) => {
                                return (
                                    <View key={index} style={styleSheets.viewControl}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                item.uriFile && reviewfile(item.uriFile);
                                            }}
                                        >
                                            <Text style={[styleSheets.text, { color: Colors.primary }]}>
                                                {item.nameFile && item.nameFile}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })
                        ) : (
                            <View style={styleSheets.viewControl}>
                                <Text />
                            </View>
                        )}
                    </View>
                    {/* Content */}
                    <View key={''} style={styleScreenDetail.itemContent}>
                        <View style={styleSheets.viewLable}>
                            <VnrText style={[styleSheets.text, styleScreenDetail.textLableInfo]} i18nKey={'Content'} />
                        </View>
                        <View style={styleSheets.viewControl}>
                            {Vnr_Function.formatStringType(dataItem, {
                                Name: 'Content',
                                DataType: '',
                                DataFormat: ''
                            })}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

class Note extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listComment: null
        };
    }

    async componentDidMount() {
        const { dataItem } = this.props.screenProps;
        const responseList = await HttpService.Post('[URI_HR]/Tas_GetData/GetTasTaskNoteList', {
            TaskID: dataItem.ID ? dataItem.ID : null
        });
        if (responseList && Array.isArray(responseList) && responseList.length > 0) {
            this.setState({ listComment: responseList });
        } else {
            this.setState({ listComment: 'EmptyData' });
        }
    }

    renderItemComment = (dataItem, index) => {
        const styles = stylesComment;
        return (
            <View style={styles.viewButton} key={index}>
                <View style={styles.rightBody}>
                    <View style={styles.Line}>
                        <View style={styles.valueView}>
                            <Text numberOfLines={1} style={[styleSheets.text]}>
                                {dataItem.CreatorName}
                            </Text>
                            <Text numberOfLines={1} style={[styleSheets.text, styles.txtDateSmall]}>
                                {dataItem.DateCreate && moment(dataItem.DateCreate).format('DD/MM/YYYY')}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.LineViewComment}>
                        <View style={styles.valueView}>
                            <Text style={[styleSheets.text, styles.txtComment]}>{dataItem.Content}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    render() {
        const { listComment } = this.state;
        let contentViewComment = <VnrLoading size={'large'} />;
        if (listComment && Array.isArray(listComment)) {
            contentViewComment = (
                <View style={styleSheets.container}>
                    <ScrollView style={CustomStyleSheet.flex(1)}>
                        <View style={styleScreenDetail.containerItemDetail}>
                            {listComment.map((item, index) => {
                                return (
                                    <View key={''} style={styleScreenDetail.itemContent}>
                                        {this.renderItemComment(item, index)}
                                    </View>
                                );
                            })}
                        </View>
                    </ScrollView>
                </View>
            );
        } else if (listComment === 'EmptyData') {
            contentViewComment = <EmptyData messageEmptyData={'EmptyData'} />;
        }

        return contentViewComment;
    }
}

export default class HreTaskInfoDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataItem: null,
            configListDetail: null,
            dataRowActionAndSelected: null,
            listActions: this.resultListActionHeader(),
            // cập nhật đánh gía
            evaluateModalVisible: false,
            evaluateData: null
        };
    }

    resultListActionHeader = () => {
        const _params = this.props;
        if (_params && _params.listActions && Array.isArray(_params.listActions)) {
            return _params.listActions;
        }
        return [];
    };

    rowActionsHeaderRight = (dataItem, dataRowActionAndSelected) => {
        let _listActions = [];
        const { rowActions } = dataRowActionAndSelected;

        if (
            !Vnr_Function.CheckIsNullOrEmpty(rowActions) &&
            !Vnr_Function.CheckIsNullOrEmpty(dataItem.BusinessAllowAction)
        ) {
            _listActions = rowActions.filter(item => {
                return dataItem.BusinessAllowAction.indexOf(item.type) >= 0;
            });
        }

        return _listActions;
    };

    // cập nhật đánh gía
    hideModalEvaluate = () => {
        this.setState({ evaluateModalVisible: false, evaluateData: null });
    };
    // cập nhật đánh gía
    showModalEvaluate = dataItem => {
        this.setState({ evaluateModalVisible: true, evaluateData: dataItem });
    };

    getDataItem = async () => {
        try {
            const _params = this.props,
                { dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params);
            if (!Vnr_Function.CheckIsNullOrEmpty(dataItem)) {
                this.setState({ dataItem });
            } else {
                this.setState({ dataItem: 'EmptyData' });
            }
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    reload = (E_KEEP_FILTER, actionIsDelete) => {
        const { reloadScreenList, screenName } = this.props;
        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');

        //nếu action = Delete => back về danh sách
        if (actionIsDelete) {
            DrawerServices.navigate(screenName);
        } else {
            this.getDataItem(true);
        }
    };

    componentDidMount() {
        TaskBusinessBusinessFunction.setThisForBusiness(this, true);
        this.getDataItem();
    }

    render() {
        const { dataItem, listActions, evaluateData, evaluateModalVisible } = this.state,
            { bottomActions } = styleScreenDetail;
        let contentViewDetail = <VnrLoading size={'large'} />;

        if (dataItem) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    {/* Tab thông tin công việc */}
                    <ContainerHreTaskDetailInfo screenProps={{ dataItem: dataItem }} />

                    {Array.isArray(listActions) && listActions.length > 0 && (
                        <View style={bottomActions}>
                            <ListButtonMenuRight listActions={listActions} dataItem={dataItem} />
                        </View>
                    )}
                    {/* cập nhật đánh giá */}
                    {evaluateData && (
                        <HreModalEvaluation
                            evaluateData={evaluateData}
                            evaluateModalVisible={evaluateModalVisible}
                            hideModalEvaluate={this.hideModalEvaluate}
                        />
                    )}
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

const stylesComment = StyleSheet.create({
    viewButton: {
        flex: 1,
        backgroundColor: Colors.whiteOpacity70,
        borderRadius: 10,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5
    },

    leftBody: {
        // flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightColor: Colors.borderColor,
        borderRightWidth: 0.5,
        paddingHorizontal: 5
    },
    rightBody: {
        flex: 8,
        paddingHorizontal: 10
    },
    iconAvatarView: {
        flex: 1,
        marginBottom: 5
    },
    avatarUser: {
        width: Size.deviceWidth * 0.15,
        height: Size.deviceWidth * 0.15,
        borderRadius: (Size.deviceWidth * 0.15) / 2,
        resizeMode: 'cover',
        backgroundColor: Colors.borderColor
    },
    Line: {
        flex: 1,
        flexDirection: 'row',
        maxWidth: '100%',
        justifyContent: 'center'
    },
    LineViewComment: {
        flex: 1,
        flexDirection: 'row',
        maxWidth: '100%',
        justifyContent: 'center',
        paddingVertical: 7,
        paddingHorizontal: 10,
        backgroundColor: Colors.primaryOpacity10,
        borderRadius: 5,
        marginTop: 10
    },
    valueView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    IconView: {
        height: '100%',
        justifyContent: 'center'
    },
    txtDateSmall: {
        fontSize: Size.text - 3,
        color: Colors.grey
    },
    txtComment: {
        fontSize: Size.text
    }
});

const styles = StyleSheet.create({
    containTab: {
        flex: 1,
        maxHeight: 55,
        backgroundColor: Colors.greyPrimaryConstraint,
        paddingVertical: 8
        // borderBottomColor: Colors.borderColor,
        // borderBottomWidth: 1
    },
    tabStyle: {
        marginHorizontal: 5,
        borderRadius: 5,
        borderColor: Colors.borderColor,
        borderWidth: 1,
        width: 'auto',
        paddingHorizontal: 10,
        justifyContent: 'center'
    },
    text_colorWhite: {
        color: Colors.white
    },
    text_colorGrey: {
        color: Colors.grey
    },
    text_colorBlue: {
        color: Colors.primary
    },
    styleTabActive: {
        backgroundColor: Colors.white,
        borderColor: Colors.primary,
        borderWidth: 1
    }
});
