/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import moment from 'moment';

import {
    styleSheets,
    Size,
    Colors,
    stylesScreenDetailV3,
    stylesVnrFilter,
    CustomStyleSheet
} from '../../constants/styleConfig';
import { IconCancel, IconCheck, IconShowDownChevron, IconShowUpChevron } from '../../constants/Icons';
import Vnr_Function from '../../utils/Vnr_Function';
import { translate } from '../../i18n/translate';
import VnrText from '../../components/VnrText/VnrText';
import { EnumName } from '../../assets/constant';

const sizeImg = 44;
class VnrRenderApproverAtt extends Component {
    constructor(props) {
        super(props);
        this.state = { isShowMore: true };
    }

    render() {
        const { dataApprover, lable, isCollapse } = this.props;
        const { isShowMore } = this.state;
        let styTextLable = { ...styleSheets.text, ...{ textAlign: 'left' } };
        if (Array.isArray(dataApprover) && dataApprover.length > 0) {
            return (
                <View>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        disabled={!isCollapse}
                        onPress={() => this.setState({ isShowMore: !isShowMore })}
                        style={[
                            stylesScreenDetailV3.styItemContentGroup,
                            !isShowMore && stylesScreenDetailV3.styItemGroupCollapse,
                            CustomStyleSheet.marginVertical(0)
                        ]}
                    >
                        <Text style={[styleSheets.lable, { flex: 1, color: Colors.black, fontSize: Size.text + 1 }]}>
                            {translate(lable)}
                        </Text>
                        {isCollapse && (
                            <View>
                                {isShowMore ? (
                                    <IconShowUpChevron size={Size.iconSize} color={Colors.black} />
                                ) : (
                                    <IconShowDownChevron size={Size.iconSize} color={Colors.black} />
                                )}
                            </View>
                        )}
                    </TouchableOpacity>
                    {isShowMore &&
                        (Array.isArray(dataApprover) && dataApprover.length > 0) &&
                        dataApprover.map((item, index) => {
                            return (
                                <View key={index} style={{ marginBottom: Size.defineSpace - 4, paddingHorizontal: 16 }}>
                                    <View style={stylesScreenDetailV3.wrapLevelApproveAndDisplaykey}>
                                        <View
                                            style={[
                                                stylesScreenDetailV3.wrapLevelApprove,
                                                (item?.StatusProcess === EnumName.E_success ||
                                                    item?.StatusProcess === EnumName.E_process) && {
                                                    backgroundColor: Colors.green
                                                },
                                                item?.StatusProcess === EnumName.E_error && { backgroundColor: Colors.red }
                                            ]}
                                        >
                                            {item?.StatusProcess === EnumName.E_error ? (
                                                <IconCancel size={Size.iconSize - 10} color={Colors.white} />
                                            ) : item?.StatusProcess === EnumName.E_success ? (
                                                <IconCheck size={Size.iconSize - 10} color={Colors.white} />
                                            ) : (
                                                <Text
                                                    style={[
                                                        styleSheets.styTextValueDateTimeStatus,
                                                        (item?.StatusProcess === EnumName.E_success ||
                                                            item?.StatusProcess === EnumName.E_process) && {
                                                            color: Colors.white
                                                        }
                                                    ]}
                                                >
                                                    {index + 1}
                                                </Text>
                                            )}
                                        </View>
                                        <VnrText style={[styleSheets.text, styTextLable]} value={item?.Label} />
                                    </View>
                                    <View style={[stylesScreenDetailV3.wrapInforApprover]}>
                                        <View style={stylesScreenDetailV3.wrapStraightLine}>
                                            <View
                                                style={[
                                                    stylesScreenDetailV3.straightLine,
                                                    (item?.StatusProcess === EnumName.E_success ||
                                                        item?.StatusProcess === EnumName.E_process ||
                                                        dataApprover[index - 1]?.StatusProcess === EnumName.E_success) && {
                                                        backgroundColor: Colors.green
                                                    },
                                                    item?.StatusProcess === EnumName.E_error && {
                                                        backgroundColor: Colors.red
                                                    }
                                                ]}
                                            />
                                        </View>
                                        {Array.isArray(item.ListDetails) && item.ListDetails.length > 0 ? (
                                            <View style={{ flexDirection: 'column', flex: 1 }}>
                                                {item.ListDetails.map((ListItem, index) => {
                                                    return (
                                                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            {
                                                                item.ListDetails.length > 1 &&
                                                                <View
                                                                    style={[
                                                                        stylesScreenDetailV3.wrapLevelApprove,
                                                                        (ListItem?.StatusProcess === EnumName.E_success ) && {
                                                                            backgroundColor: Colors.green
                                                                        },
                                                                    ListItem?.StatusProcess === EnumName.E_error && {
                                                                            backgroundColor: Colors.red
                                                                        },
                                                                    (ListItem?.StatusProcess === '' ||
                                                                    ListItem?.StatusProcess === EnumName.E_process) && {
                                                                        backgroundColor: Colors.gray_4
                                                                    }
                                                                    ]}
                                                                >
                                                                    {ListItem?.StatusProcess === EnumName.E_error ? (
                                                                        <IconCancel
                                                                            size={Size.iconSize - 10}
                                                                            color={Colors.white}
                                                                        />
                                                                    ) : ListItem?.StatusProcess === EnumName.E_success ? (
                                                                        <IconCheck
                                                                            size={Size.iconSize - 10}
                                                                            color={Colors.white}
                                                                        />
                                                                    ) : (
                                                                        <IconCheck
                                                                            size={Size.iconSize - 10}
                                                                            color={Colors.gray_10}
                                                                        />
                                                                    )}
                                                                </View>
                                                            }
                                                            <View style={{ flex: 1 }}>
                                                                <View style={stylesVnrFilter.viewLable}>
                                                                    {Vnr_Function.renderAvatarCricleByName(
                                                                    ListItem?.ImagePath,
                                                                    ListItem.UserInfoName ? ListItem.UserInfoName : 'A',
                                                                    sizeImg
                                                                    )}
                                                                    <View style={styleSheets.wrapNameAndSubtitle}>
                                                                        <View style={{ flex: 1 }}>
                                                                            <Text
                                                                                numberOfLines={2}
                                                                                style={[styleSheets.subTitleApprover]}
                                                                            >
                                                                                <Text style={[styleSheets.detailNameApprover]}>
                                                                                    {ListItem.UserInfoName}{' '}
                                                                                </Text>
                                                                                {ListItem?.Content ? ListItem?.Content : ''}
                                                                            </Text>
                                                                        </View>
                                                                        <Text style={[styleSheets.detailPositionApprover]}>
                                                                            {ListItem.PositionName ? ListItem.PositionName : ''}
                                                                        </Text>
                                                                    </View>
                                                                </View>
                                                                {ListItem?.Comment ? (
                                                                    <View
                                                                        style={[
                                                                            stylesScreenDetailV3.styMarginLeftCmt,
                                                                            stylesScreenDetailV3.styleComment
                                                                        ]}
                                                                    >
                                                                        <Text style={styleSheets.text}>
                                                                            {ListItem?.Comment}
                                                                        </Text>
                                                                    </View>
                                                                ) : null}
                                                                {ListItem?.DateUpdated && (
                                                                    <View style={stylesScreenDetailV3.styMarginLeftCmt}>
                                                                        <Text style={stylesScreenDetailV3.styDateUpdate}>
                                                                            {translate('E_AT_TIME')}{' '}
                                                                            {moment(ListItem?.DateUpdated).format(
                                                                                'HH:mm, DD/MM/YYYY'
                                                                            )}
                                                                        </Text>
                                                                    </View>
                                                                )}
                                                            </View>
                                                        </View>
                                                    );
                                                })}
                                            </View>
                                        ) : (
                                            <View style={{ flex: 1 }}>
                                                <View style={stylesVnrFilter.viewLable}>
                                                    {Vnr_Function.renderAvatarCricleByName(
                                                        item?.ImagePath,
                                                        item.UserInfoName ? item.UserInfoName : 'A',
                                                        sizeImg
                                                    )}
                                                    <View style={styleSheets.wrapNameAndSubtitle}>
                                                        <View style={{ flex: 1 }}>
                                                            <Text numberOfLines={2} style={[styleSheets.subTitleApprover]}>
                                                                <Text style={[styleSheets.detailNameApprover]}>
                                                                    {item.UserInfoName}{' '}
                                                                </Text>
                                                                {item?.Content ? item?.Content : ''}
                                                            </Text>
                                                        </View>
                                                        <Text style={[styleSheets.detailPositionApprover]}>
                                                            {item.PositionName ? item.PositionName : ''}
                                                        </Text>
                                                    </View>
                                                </View>
                                                {item?.Comment ? (
                                                    <View
                                                        style={[
                                                            stylesScreenDetailV3.styMarginLeftCmt,
                                                            stylesScreenDetailV3.styleComment
                                                        ]}
                                                    >
                                                        <Text style={styleSheets.text}>{item?.Comment}</Text>
                                                    </View>
                                                ) : null}
                                                {item?.DateUpdated && (
                                                    <View style={stylesScreenDetailV3.styMarginLeftCmt}>
                                                        <Text style={stylesScreenDetailV3.styDateUpdate}>
                                                            {translate('E_AT_TIME')}{' '}
                                                            {moment(item?.DateUpdated).format('HH:mm, DD/MM/YYYY')}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                        )}
                                    </View>
                                </View>
                            );
                        })}
                </View>
            );
        } else return <View></View>
        //#endregion
    }
}

export default VnrRenderApproverAtt;
