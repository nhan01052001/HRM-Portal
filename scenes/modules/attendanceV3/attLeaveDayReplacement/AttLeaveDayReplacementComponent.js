import React, { Component } from 'react'
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import styleComonAddOrEdit from '../../../../constants/styleComonAddOrEdit';
import { Colors, CustomStyleSheet, styleSheets, stylesVnrPickerV3 } from '../../../../constants/styleConfig';
import VnrDateFromTo from '../../../../componentsV3/VnrDateFromTo/VnrDateFromTo';
import moment from 'moment/moment';
import VnrPickerLittle from '../../../../componentsV3/VnrPickerLittle/VnrPickerLittle';
import VnrTextInput from '../../../../componentsV3/VnrTextInput/VnrTextInput';
import VnrSwitch from '../../../../componentsV3/VnrSwitch/VnrSwitch';
import { translate } from '../../../../i18n/translate';


class AttLeaveDayReplacementComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            DurationType: {
                lable: 'lblform_PersonalSubmitOverTimeInfo_DurationType',
                disable: false,
                refresh: false,
                value: null,
                data: [],
                visible: true,
                visibleConfig: true
            },
            Note: {
                lable: 'Note',
                visible: true,
                visibleConfig: true,
                disable: false,
                value: '',
                refresh: false,
                isValid: true
            },
            replaceLessDays: {
                lable: 'HRM_PortalApp_ReplacingWithFewerDays',
                disable: false,
                refresh: false,
                value: false,
                visible: true,
                visibleConfig: true
            },
            refresh: false
        };
    }

    getIsSelect = (value = []) => {
        if (Array.isArray(value) && value.length > 0) {
            let rs = value.find((item) => item.isSelect);
            return rs ? rs : null;
        }
        return null;
    }

    render() {
        const { dataItem, onScrollToInputIOS } = this.props;
        const { DurationType, Note, replaceLessDays, refresh } = this.state;


        let isListDate = Array.isArray(dataItem?.ListDate) && dataItem?.ListDate.length > 0,
            isListDateBigger1 = isListDate && dataItem?.ListDate.length > 1;


        return (
            <View style={styles.wrapItem}>
                {
                    dataItem?.ProfileName && (
                        <View
                            style={CustomStyleSheet.padding(16)}
                        >
                            <Text style={[styleSheets.lable, styleComonAddOrEdit.styHeaderText]}>{dataItem?.ProfileName}</Text>
                        </View>
                    )
                }
                {
                    isListDateBigger1 && (
                        <View style={[CustomStyleSheet.backgroundColor(Colors.white),
                            CustomStyleSheet.borderBottomColor(Colors.gray_5),
                            CustomStyleSheet.borderBottomWidth(0.5)
                        ]}>
                            <VnrSwitch
                                lable={replaceLessDays.lable}
                                value={replaceLessDays.value}
                                onFinish={value => {
                                    this.setState({
                                        replaceLessDays: {
                                            ...replaceLessDays,
                                            value: value
                                        }
                                    })
                                }}
                            />
                        </View>
                    )
                }
                {
                    isListDate && (
                        ((isListDate && replaceLessDays.value) || !isListDateBigger1) ? (
                            dataItem?.ListDate.map((item, index) => {
                                if (Array.isArray(item?.ListDurationType) && item?.ListDurationType.length > 0) {
                                    if (item?.ListDurationType.length > 1) {
                                        item?.ListDurationType.forEach((element) => {
                                            element.isSelect = element?.Value === 'E_FULLSHIFT';
                                        })
                                    } else {
                                        item.ListDurationType[0].isSelect = true;
                                    }
                                }
                                return (
                                    <View key={index}
                                        style={[CustomStyleSheet.borderBottomColor(Colors.gray_5), CustomStyleSheet.borderBottomWidth(0.5)]}
                                    >
                                        <View
                                            style={[
                                                CustomStyleSheet.flexDirection('row'),
                                                CustomStyleSheet.alignItems('center'),
                                                CustomStyleSheet.justifyContent('center')
                                            ]}
                                        >
                                            <View style={CustomStyleSheet.flex(1)}>
                                                <VnrDateFromTo
                                                    styContentPicker={{
                                                        height: 53,
                                                        width: '100%',
                                                        borderWidth: 0,
                                                        borderRadius: 0
                                                    }}
                                                    isHiddenIcon={false}
                                                    refresh={true}
                                                    value={[moment(item?.Date).format('YYYY-MM-DD')]}
                                                    displayOptions={false}
                                                    onlyChooseOneDay={true}
                                                    isControll={true}
                                                    onFinish={(value) => {
                                                        item.Date = new Date(value[0]).toISOString();
                                                        this.setState(
                                                            {
                                                                refresh: !refresh
                                                            });
                                                    }}
                                                />
                                            </View>
                                            {
                                                replaceLessDays.value && (
                                                    <View style={[CustomStyleSheet.alignItems('flex-end')]}>
                                                        <TouchableOpacity
                                                            style={CustomStyleSheet.paddingHorizontal(16)}
                                                            onPress={() => {
                                                                if (index > -1) {
                                                                    dataItem?.ListDate.splice(index, 1);
                                                                    this.setState(
                                                                        {
                                                                            refresh: !refresh
                                                                        });
                                                                }
                                                            }}
                                                        >
                                                            <Text
                                                                style={[styleSheets.text, { color: Colors.red }]}
                                                            >{translate('HRM_System_Resource_Sys_Delete')}</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            }
                                        </View>
                                        <VnrPickerLittle
                                            refresh={DurationType.refresh}
                                            dataLocal={Array.isArray(item?.ListDurationType) ? item?.ListDurationType : []}
                                            value={
                                                this.getIsSelect(item?.ListDurationType)
                                            }
                                            textField="Text"
                                            valueField="Value"
                                            filter={true}
                                            filterServer={true}
                                            filterParams="text"
                                            disable={this.getIsSelect(item?.ListDurationType)?.Value && this.getIsSelect(item?.ListDurationType)?.Value !== 'E_FULLSHIFT' && !this.getIsSelect(item?.ListDurationType)?.isNotDisable}
                                            lable={DurationType.lable}
                                            stylePicker={styles.resetBorder}
                                            isChooseQuickly={true}
                                            onFinish={value => {
                                                value.isNotDisable = true;
                                                this.setState(
                                                    {
                                                        refresh: !refresh
                                                    });
                                            }}
                                        />
                                    </View>
                                )
                            })
                        ) : isListDate && isListDateBigger1 && !replaceLessDays.value ? (
                            <View>
                                <VnrDateFromTo
                                    isHiddenIcon={false}
                                    refresh={true}
                                    value={{
                                        startDate: dataItem?.DateStart,
                                        endDate: dataItem?.DateEnd
                                    }}
                                    displayOptions={false}
                                    onlyChooseOneDay={false}
                                    isControll={true}
                                    onFinish={(value) => {
                                        dataItem.DateStart = new Date(value?.startDate).toISOString();
                                        dataItem.DateEnd = new Date(value?.endDate).toISOString();
                                        this.setState(
                                            {
                                                refresh: !refresh
                                            });
                                    }}
                                />
                            </View>
                        ) : <View />
                    )
                }
                <VnrTextInput
                    placeHolder={'HRM_PortalApp_PleaseInput'}
                    disable={Note.disable}
                    lable={Note.lable}
                    style={[
                        styleSheets.text,
                        stylesVnrPickerV3.viewInputMultiline,
                        CustomStyleSheet.paddingHorizontal(0)
                    ]}
                    multiline={true}
                    value={Note.value}
                    onChangeText={(text) => {
                        dataItem.Note = text;
                        this.setState({
                            Note: {
                                ...Note,
                                value: text,
                                refresh: !Note.refresh
                            }
                        });
                    }}
                    onFocus={() => {
                        Platform.OS == 'ios' &&
                            onScrollToInputIOS(1, this.layoutHeightItem);
                    }}
                    refresh={Note.refresh}
                />
            </View>
        );
    }
}

const styles = styleComonAddOrEdit;

export default AttLeaveDayReplacementComponent;