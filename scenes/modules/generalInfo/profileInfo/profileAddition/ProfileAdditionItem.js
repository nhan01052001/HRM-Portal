import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import VnrAttachFile from '../../../../../componentsV3/VnrAttachFile/VnrAttachFile';
import VnrText from '../../../../../components/VnrText/VnrText';
import {
    styleSheets,
    Size,
    Colors,
    styleValid,
    stylesVnrPickerV3,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import { EnumName } from '../../../../../assets/constant';
import { translate } from '../../../../../i18n/translate';
import Color from 'color';

class ProfileAdditionItem extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nextProps) {
        return this.props.state?.refresh !== nextProps.state?.refresh;
    }

    convertTextToColor = value => {
        const [num1, num2, num3, opacity] = value.split(',');
        return Color.rgb(parseFloat(num1), parseFloat(num2), parseFloat(num3), parseFloat(opacity));
    };

    render() {
        const { state } = this.props,
            { stylePlaceholder } = stylesVnrPickerV3;
        const { colorStatus, bgStatus } = state?.statusStyle;
        let colorStatusView = colorStatus ? colorStatus : null,
            bgStatusView = bgStatus ? bgStatus : null;

        return (
            <View style={[styles.containerItem]}>
                <VnrAttachFile
                    disable={state?.disabled}
                    lable={state?.lable}
                    refresh={state?.refresh}
                    value={state?.value}
                    multiFile={true}
                    uri={'[URI_CENTER]/api/Sys_Common/saveFileFromApp'}
                    style={[
                        stylesVnrPickerV3.styBntPicker,
                        styles.attachFile,
                        state?.disabled && { backgroundColor: Colors.gray_2 }
                    ]}
                    onFinish={file => {
                        if (state?.ReqDocumentStatus === EnumName.E_REJECTED) {
                            this.props.onFinish(file, true);
                        } else {
                            this.props.onFinish(file);
                        }
                    }}
                >
                    <View
                        style={[
                            stylesVnrPickerV3.styLeftPicker,
                            state?.lable && stylesVnrPickerV3.onlyFlRowSpaceBetween, CustomStyleSheet.alignItems('center')
                        ]}
                    >
                        {state?.lable && (
                            <View style={[stylesVnrPickerV3.styLbPicker, styles.wrapLableAttachFile]}>
                                <View style={styles.wrapContentLableAttachFile}>
                                    <VnrText
                                        numberOfLines={2}
                                        style={[
                                            styleSheets.text,
                                            stylesVnrPickerV3.styLbNotHaveValuePicker,
                                            styles.lable
                                        ]}
                                        i18nKey={state?.lable}
                                    />
                                </View>
                                {state?.fieldValid && <VnrText style={[styleSheets.text, styleValid]} i18nKey={'*'} />}
                                {state?.statusView && state?.statusView !== 'null' && (
                                    <View style={[styles.viewContentTopRight]}>
                                        <View
                                            style={[
                                                styles.lineSatus,
                                                {
                                                    backgroundColor: bgStatusView ? this.convertTextToColor(bgStatusView) : Colors.white
                                                },
                                                CustomStyleSheet.borderRadius(4)
                                            ]}
                                        >
                                            <Text
                                                numberOfLines={1}
                                                style={[
                                                    styleSheets.text,
                                                    styles.lineSatus_text,
                                                    {
                                                        color: colorStatusView ? colorStatusView : Colors.gray_10
                                                    }
                                                ]}
                                            >
                                                {state?.statusView}
                                            </Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                        )}

                        <View style={[styles.wrapContentPlaceholder]}>
                            <VnrText
                                numberOfLines={2}
                                style={[styleSheets.text, stylePlaceholder]}
                                i18nKey={'HRM_PortalApp_Please_Attachment'}
                            />
                        </View>
                    </View>
                </VnrAttachFile>

                {state?.RejectionReason && (
                    <View style={styles.wrapContentRejetReason}>
                        <Text
                            numberOfLines={2}
                            style={[styleSheets.text, styles.txtRejectionReason]}
                        >
                            {translate('Reason')}: {state?.RejectionReason}
                        </Text>
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    lineSatus: {
        // paddingHorizontal: 3,
        alignItems: 'center',
        // paddingVertical: 2,
        padding: 4
    },

    lineSatus_text: {
        fontSize: Size.text - 3,
        fontWeight: '500'
    },

    viewContentTopRight: {
        justifyContent: 'flex-start',
        paddingRight: 12,
        marginLeft: 6
    },

    containerItem: {
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.gray_5
    },

    wrapLableAttachFile: {
        maxWidth: '60%',
        alignItems: 'center'
    },

    wrapContentLableAttachFile: {
        alignSelf: 'baseline',
        maxWidth: '70%'
    },

    attachFile: {
        paddingHorizontal: 12,
        borderBottomWidth: 0
    },

    lable: {
        marginLeft: 0,
        maxWidth: '100%'
    },

    wrapContentPlaceholder: {
        width: '30%',
        alignItems: 'flex-end'
    },

    wrapContentRejetReason: {
        paddingHorizontal: 16,
        paddingVertical: 8
    },

    txtRejectionReason: {
        fontSize: Size.text, fontStyle: 'italic'
    }
});

export default ProfileAdditionItem;
