import React, { Component } from 'react';
import { View, Modal, TouchableOpacity, ScrollView, Text } from 'react-native';

import styleComonAddOrEdit from '../../constants/styleComonAddOrEdit';
import { Colors, CustomStyleSheet, Size, styleSheets } from '../../constants/styleConfig';
import VnrText from '../../components/VnrText/VnrText';
import { IconCloseCircle } from '../../constants/Icons';
import { translate } from '../../i18n/translate';

class VnrModalError extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
            modalErrorDetail: {
                cacheID: null,
                data: []
            }
        };
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
    }

    show = (data, cacheID) => {
        const { modalErrorDetail } = this.state;
        this.setState({
            modalErrorDetail: {
                ...modalErrorDetail,
                cacheID: cacheID,
                data: data
            },
            isModalVisible: true
        });
    };

    hide = () => {
        this.setState({
            isModalVisible: false
        });
    };

    componentDidMount() {}

    renderErrorDetail = () => {
        const { modalErrorDetail } = this.state,
            { data } = modalErrorDetail;

        if (data && data.length > 0) {
            const dataGroup = this.groupByMessage(data, 'MessageName'),
                dataSourceError = this.mappingDataGroup(dataGroup);

            return dataSourceError.map((dataItem, index) => {
                let viewContent = <View />;
                if (dataItem['Type'] && dataItem['Type'] == 'E_GROUP') {
                    viewContent = (
                        <View style={styleComonAddOrEdit.styleViewTitleGroup}>
                            <VnrText
                                style={[styleSheets.lable, styleComonAddOrEdit.styFontErrTitle]}
                                i18nKey={dataItem['TitleGroup']}
                            />
                        </View>
                    );
                } else {
                    viewContent = (
                        <View style={styleComonAddOrEdit.styFontErrInfo}>
                            <View style={styleComonAddOrEdit.styFontErrLine}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, styleComonAddOrEdit.styFontErrText]}
                                    i18nKey={'HRM_PortalApp_Message_ErrorCodeEmp'}
                                />

                                <View style={styleComonAddOrEdit.styFontErrVal}>
                                    <Text
                                        numberOfLines={1}
                                        style={[styleSheets.textItalic, styleComonAddOrEdit.styFontErrText]}
                                    >
                                        {dataItem['CodeEmp']}
                                    </Text>
                                </View>
                            </View>

                            <View style={styleComonAddOrEdit.styFontErrLine}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, styleComonAddOrEdit.styFontErrText]}
                                    i18nKey={'HRM_PortalApp_Message_ErrorProfileName'}
                                />

                                <View style={styleComonAddOrEdit.styFontErrVal}>
                                    <Text
                                        numberOfLines={1}
                                        style={[styleSheets.textItalic, styleComonAddOrEdit.styFontErrText]}
                                    >
                                        {dataItem['ProfileName']}
                                    </Text>
                                </View>
                            </View>

                            <View style={styleComonAddOrEdit.styFontErrLine}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, styleComonAddOrEdit.styFontErrText]}
                                    i18nKey={'HRM_PortalApp_Message_ErrorDescription'}
                                />

                                <View style={[styleComonAddOrEdit.styFontErrVal, CustomStyleSheet.marginLeft(6)]}>
                                    <Text style={[styleSheets.textItalic, styleComonAddOrEdit.styFontErrText]}>
                                        {dataItem['ErrorDescription']}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    );
                }

                return (
                    <View
                        key={index}
                        style={[
                            styleComonAddOrEdit.styleViewNoBorder,
                            dataSourceError.length - 1 == index && styleComonAddOrEdit.styleViewNoBorder
                        ]}
                    >
                        {viewContent}
                    </View>
                );
            });
        } else {
            return (
                <View style={styleComonAddOrEdit.noData}>
                    <Text style={[styleComonAddOrEdit.styHeaderText, { color: Colors.white }]}>
                        {translate('HRM_HR_NoneData')}
                    </Text>
                </View>
            );
        }
    };

    groupByMessage = (array, key) => {
        // Return the end result
        return array.reduce((result, currentValue) => {
            // If an array already present for key, push it to the array. Else create an array and push the object
            (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
            // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
            return result;
        }, {}); // empty object is the initial value for result object
    };

    mappingDataGroup = dataGroup => {
        let dataSource = [];
        // eslint-disable-next-line no-unused-vars
        for (let key in dataGroup) {
            let title =
                translate('HRM_Attendance_Message_MessageName') +
                ': ' +
                key +
                ' (' +
                translate('NumberCount') +
                ': ' +
                dataGroup[key].length +
                ')';

            dataSource = [...dataSource, { Type: 'E_GROUP', TitleGroup: title }, ...dataGroup[key]];
        }

        return dataSource;
    };

    render() {
        const { isModalVisible } = this.state;

        return (
            <View>
                {isModalVisible && (
                    <Modal animationType="slide" transparent={true} isVisible={true}>
                        <View style={styleComonAddOrEdit.wrapModalError}>
                            <TouchableOpacity style={[styleComonAddOrEdit.bgOpacity]} onPress={() => this.hide()} />
                            <View style={styleComonAddOrEdit.wrapContentModalError}>
                                <View style={styleComonAddOrEdit.wrapTitileHeaderModalError}>
                                    <VnrText
                                        style={[
                                            styleSheets.text,
                                            styleComonAddOrEdit.styRegister,
                                            styleComonAddOrEdit.fS16fW600
                                        ]}
                                        i18nKey={'HRM_PortalApp_Message_ErrorDetail'}
                                    />

                                    <TouchableOpacity onPress={() => this.hide()}>
                                        <IconCloseCircle size={Size.iconSize} color={Colors.white} />
                                    </TouchableOpacity>
                                </View>
                                <ScrollView style={[styleComonAddOrEdit.wrapLevelError, CustomStyleSheet.paddingHorizontal(8)]}>
                                    {this.renderErrorDetail()}
                                </ScrollView>
                            </View>
                        </View>
                    </Modal>
                )}
            </View>
        );
    }
}
export default VnrModalError;
