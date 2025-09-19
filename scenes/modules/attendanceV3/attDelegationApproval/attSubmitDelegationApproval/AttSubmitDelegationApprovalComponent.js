import React, { Component } from 'react';
import { Platform, View } from 'react-native';
import styleComonAddOrEdit from '../../../../../constants/styleComonAddOrEdit';
import { CustomStyleSheet, styleSheets, stylesVnrPickerV3 } from '../../../../../constants/styleConfig';
import VnrDateFromTo from '../../../../../componentsV3/VnrDateFromTo/VnrDateFromTo';
import VnrTextInput from '../../../../../componentsV3/VnrTextInput/VnrTextInput';
import VnrSuperFilterWithTextInput from '../../../../../componentsV3/VnrSuperFilterWithTextInput/VnrSuperFilterWithTextInput';
import VnrPickerMulti from '../../../../../componentsV3/VnrPickerMulti/VnrPickerMulti';
import { translate } from '../../../../../i18n/translate';
import moment from 'moment';

const initSateDefault = {
    UserDelegateIDs: {
        label: 'HRM_PortalApp_AuthorizedPerson',
        disable: false,
        refresh: false,
        value: [],
        visible: true,
        visibleConfig: true
    },
    DataTypeDelegate: {
        lable: 'HRM_PortalApp_Expertise',
        disable: false,
        refresh: false,
        value: [],
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
    DateFromTo: {
        refresh: false,
        disable: false,
        value: null
    },
    refresh: false,
    isError: false
};

class AttSubmitDelegationApprovalComponent extends Component {
    constructor(props) {
        super(props);
        this.state = JSON.parse(JSON.stringify(initSateDefault));

        this.layoutHeightItem = null;
    }

    initState = () => {

    }

    getAllData = () => {
        const { fieldConfig } = this.props,
            {
                UserDelegateIDs, Note, DataTypeDelegate, DateFromTo
            } = this.state;

        if (
            (fieldConfig?.UserDelegateIDs?.isValid && !UserDelegateIDs.value) ||
            (fieldConfig?.DataTypeDelegate?.isValid && !DataTypeDelegate.value) ||
            (fieldConfig?.DateFromTo?.isValid && !DateFromTo.value) ||
            (Note.value && Note.value.length > 500)
        ) {
            this.setState({
                isError: true
            }, () => {
                if (Note.value && Note.value.length > 500) {
                    let keyTrans = translate('HRM_Sytem_MaxLength500');
                    let errorMax500 = keyTrans.replace('[E_NAME]', Note.lable ? `[${translate(Note.lable)}]` : '');
                    this.props.ToasterSevice().showWarning(errorMax500);
                    return null;
                }

                this.props.ToasterSevice().showWarning('HRM_PortalApp_InputValue_Please');
            });
            return null;
        }

        this.setState({
            isError: false
        });

        let lsUserDelegateIDs = [],
            lsDataTypeDelegate = [];

        if (Array.isArray(UserDelegateIDs.value)) {
            UserDelegateIDs.value.map((item) => {
                lsUserDelegateIDs.push(item.ID);
            });
        }

        if (Array.isArray(DataTypeDelegate.value)) {
            DataTypeDelegate.value.map((item) => {
                lsDataTypeDelegate.push(item.Value);
            });
        }

        let payload = {};

        if (DateFromTo.value?.startDate) {
            payload = {
                ...payload,
                DateFrom: moment(DateFromTo.value?.startDate).format('MM/DD/YYYY 12:00:00 A')
            };
        }

        if (DateFromTo.value?.endDate) {
            payload = {
                ...payload,
                DateTo: moment(DateFromTo.value?.endDate).format('MM/DD/YYYY 12:00:00 A')
            };
        }

        return {
            UserDelegateIDs: lsUserDelegateIDs.length > 0 ? lsUserDelegateIDs.join(',') : null,
            DataTypeDelegate: lsDataTypeDelegate.length > 0 ? lsDataTypeDelegate.join(',') : null,
            Note: Note.value,
            ...payload
        };
    };

    unduData = () => {
        this.setState({ ...initSateDefault });
    };

    render() {
        const { onScrollToInputIOS, index, fieldConfig } = this.props;
        const { UserDelegateIDs, Note, DataTypeDelegate, DateFromTo, isError } = this.state;

        return (
            <View style={styles.wrapItem}
                onLayout={(event) => {
                    const layout = event.nativeEvent.layout;
                    this.layoutHeightItem = layout.height;
                }}
            >
                {
                    fieldConfig?.UserDelegateIDs?.visibleConfig && (
                        <VnrSuperFilterWithTextInput
                            lable={UserDelegateIDs.label}
                            fieldValid={fieldConfig?.UserDelegateIDs?.isValid}
                            isCheckEmpty={fieldConfig?.UserDelegateIDs?.isValid
                                && isError
                                && (UserDelegateIDs.value === null || UserDelegateIDs.value === undefined || Object.keys(UserDelegateIDs.value).length === 0)}
                            ref={(resf) => (this.refReceiver = resf)}
                            api={{
                                urlApi: '[URI_HR]/Sys_GetData/GetMultiUser',
                                type: 'E_GET'
                            }}
                            refresh={UserDelegateIDs.refresh}
                            textField="ProfileNameOnly"
                            valueField="ID"
                            licensedDisplay={[
                                {
                                    Name: ['ProfileNameOnly'],
                                    Avatar: ['ImagePath'],
                                    UnderName: ['CodeEmp', 'JobTitleName']
                                }
                            ]}
                            filter={true}
                            filterServer={true}
                            filterParams={'text'}
                            autoFilter={true}
                            value={UserDelegateIDs.value ? UserDelegateIDs.value : []}
                            disable={UserDelegateIDs.disable}
                            onFinish={(item) => {
                                this.setState({
                                    UserDelegateIDs: {
                                        ...UserDelegateIDs,
                                        value: item,
                                        refresh: !UserDelegateIDs.refresh
                                    }
                                });
                            }}
                        />
                    )
                }

                {
                    fieldConfig?.DataTypeDelegate?.visibleConfig && (
                        <VnrPickerMulti
                            fieldValid={fieldConfig?.DataTypeDelegate?.isValid}
                            isCheckEmpty={fieldConfig?.DataTypeDelegate?.isValid && isError && (DataTypeDelegate.value === null || DataTypeDelegate.value === undefined || Object.keys(DataTypeDelegate.value).length === 0)}
                            refresh={DataTypeDelegate.refresh}
                            api={{
                                'urlApi': '[URI_SYS]/Sys_GetData/GetEnum?text=FunctionType',
                                'type': 'E_GET'
                            }}
                            value={DataTypeDelegate.value}
                            textField="Text"
                            valueField="Value"
                            filter={true}
                            filterLocal={true}
                            autoFilter={true}
                            filterParams="text"
                            disable={DataTypeDelegate.disable}
                            lable={DataTypeDelegate.lable}
                            onFinish={(item) => {
                                this.setState({
                                    DataTypeDelegate: {
                                        ...DataTypeDelegate,
                                        value: item,
                                        refresh: !DataTypeDelegate.refresh
                                    }
                                });
                            }}
                        />
                    )
                }

                {
                    fieldConfig?.DateFromTo?.visibleConfig && (
                        <VnrDateFromTo
                            fieldValid={fieldConfig?.DateFromTo?.isValid}
                            isCheckEmpty={fieldConfig?.DateFromTo?.isValid && isError && (DateFromTo.value === null || DateFromTo.value === undefined || Object.keys(DateFromTo.value).length === 0)}
                            lable={'HRM_PortalApp_Authorizationeriod'}
                            isControll={true}
                            isHiddenIcon={true}
                            placeHolder={'SELECT_ITEM'}
                            refresh={DateFromTo.refresh}
                            value={DateFromTo.value ? DateFromTo.value : {}}
                            displayOptions={false}
                            onlyChooseEveryDay={false}
                            disable={DateFromTo.disable}
                            onFinish={range => {
                                this.setState({
                                    DateFromTo: {
                                        ...DateFromTo,
                                        value: range,
                                        refresh: !DateFromTo.refresh
                                    }
                                });
                            }}
                        />
                    )
                }

                {
                    fieldConfig?.Note?.visibleConfig && (
                        <VnrTextInput
                            fieldValid={fieldConfig?.Note?.isValid}
                            isCheckEmpty={
                                fieldConfig?.Note?.isValid
                                && isError
                                && (Note.value === null || Note.value === undefined || (typeof Note.value === 'string' && Note.value.length === 0))
                            }
                            placeHolder={'HRM_PortalApp_PleaseInput'}
                            disable={Note.disable}
                            lable={Note.lable}
                            style={[styleSheets.text, stylesVnrPickerV3.viewInputMultiline, CustomStyleSheet.paddingHorizontal(0)]}
                            multiline={true}
                            value={Note.value}
                            onChangeText={(text) => {
                                this.setState({
                                    Note: {
                                        ...Note,
                                        value: text,
                                        refresh: !Note.refresh
                                    }
                                });
                            }}
                            onFocus={() => {
                                Platform.OS == 'ios' && onScrollToInputIOS(index + 1, this.layoutHeightItem);
                            }}
                            refresh={Note.refresh}
                        />
                    )
                }
            </View>
        );
    }
}

const styles = styleComonAddOrEdit;

export default AttSubmitDelegationApprovalComponent;