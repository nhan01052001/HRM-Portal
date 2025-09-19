/* eslint-disable react-native/no-raw-text */
import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import moment from 'moment';

import {
    styleSheets,
    Size,
    Colors,
    stylesScreenDetailV3,
    CustomStyleSheet
} from '../../constants/styleConfig';
import { IconCancel, IconCheck, IconReturnUpBack, IconShowDownChevron, IconShowUpChevron } from '../../constants/Icons';
import Vnr_Function from '../../utils/Vnr_Function';
import { translate } from '../../i18n/translate';
import VnrText from '../../components/VnrText/VnrText';
import { EnumName } from '../../assets/constant';

const sizeImg = 44;

class VnrRenderApprover extends Component {
    constructor(props) {
        super(props);
        this.state = { isShowMore: true, isExpanded: false };
    }

    getBackgroundColorWithStatus = (status) => {
        let backgroundColor = null;

        switch (status) {
            case EnumName.E_success:
                backgroundColor = Colors.green;
                break;
            case EnumName.E_process:
                backgroundColor = Colors.green;
                break;
            case EnumName.E_error:
                backgroundColor = Colors.red;
                break;
            case EnumName.E_CANCEL:
                backgroundColor = Colors.red;
                break;
            case EnumName.E_warning:
                backgroundColor = Colors.yellow;
                break;
            case EnumName.E_wait:
                backgroundColor = null;
                break;
            case EnumName.E_submitChange:
                backgroundColor = Colors.purple_6;
                break;
            default:
                backgroundColor = null;
                break;
        }

        return backgroundColor;
    };

    renderIconStatusApprove = (status = null, index, isDetail = false) => {
        if (!status) {
            return;
        }

        let icon = null,
            backgroundColor = null;

        switch (status) {
            case EnumName.E_success:
                backgroundColor = Colors.green_1;
                icon = <IconCheck size={Size.iconSize - 10} color={Colors.green} />;
                break;
            case EnumName.E_process:
                backgroundColor = Colors.green;
                icon = (
                    <Text style={[styleSheets.styTextValueDateTimeStatus, CustomStyleSheet.color(Colors.white)]}>
                        {index + 1}
                    </Text>
                );
                break;
            case EnumName.E_error:
                backgroundColor = Colors.red;
                icon = <IconCancel size={Size.iconSize - 10} color={Colors.white} />;
                break;
            case EnumName.E_CANCEL:
                backgroundColor = Colors.red;
                icon = <IconCancel size={Size.iconSize - 10} color={Colors.white} />;
                break;
            case EnumName.E_warning:
                backgroundColor = Colors.yellow_6;
                icon = <IconCheck size={Size.iconSize - 10} color={Colors.black} />;
                break;
            case EnumName.E_wait:
                backgroundColor = null;
                icon = isDetail ? (
                    <IconCheck size={Size.iconSize - 10} color={Colors.black} />
                ) : (
                    <Text style={[styleSheets.styTextValueDateTimeStatus]}>{index + 1}</Text>
                );
                break;
            case EnumName.E_submitChange:
                backgroundColor = '#e4d4f5';
                icon = <IconReturnUpBack size={Size.iconSize - 10} color={Colors.purple} />;
                break;
            default:
                backgroundColor = null;
                icon = <Text style={[styleSheets.styTextValueDateTimeStatus]}>{index + 1}</Text>;
                break;
        }

        return (
            <View
                style={[
                    stylesScreenDetailV3.wrapLevelApprove,
                    backgroundColor && CustomStyleSheet.backgroundColor(backgroundColor)
                ]}
            >
                {icon}
            </View>
        );
    };

    renderLevelApprove = (data) => {
        return data.map((item, index) => {
            return (
                <View
                    key={index}
                    style={[
                        styles.wrapLableLevelApprove
                        // item?.IsDisable && CustomStyleSheet.opacity(0.5),
                    ]}
                >
                    <View
                        style={[
                            stylesScreenDetailV3.wrapLevelApproveAndDisplaykey,
                            item?.IsDisable && CustomStyleSheet.opacity(0.6)
                        ]}
                    >
                        {this.renderIconStatusApprove(item?.StatusProcess, index)}
                        <VnrText style={[styleSheets.lable, CustomStyleSheet.textAlign('left')]} value={item?.Label} />
                    </View>
                    <View style={[stylesScreenDetailV3.wrapInforApprover]}>
                        <View style={stylesScreenDetailV3.wrapStraightLine}>
                            <View
                                style={[
                                    stylesScreenDetailV3.straightLine,
                                    this.getBackgroundColorWithStatus(EnumName.E_success) &&
                                        CustomStyleSheet.backgroundColor(
                                            this.getBackgroundColorWithStatus(item?.StatusProcess)
                                        )
                                ]}
                            />
                        </View>
                        <View style={CustomStyleSheet.flex(1)}>
                            {Array.isArray(item?.ListDetails) &&
                                item?.ListDetails.length > 0 &&
                                item?.ListDetails.map((ListItem, i) => {
                                    return (
                                        <View
                                            key={i}
                                            style={[
                                                CustomStyleSheet.flex(1),
                                                item?.ListDetails.length > 1 &&
                                                    i !== item?.ListDetails.length - 1 &&
                                                    CustomStyleSheet.marginBottom(12),
                                                ListItem?.IsDisable && CustomStyleSheet.opacity(0.5)
                                            ]}
                                        >
                                            <View style={styles.inforApprover}>
                                                {item?.ListDetails.length > 1 &&
                                                    this.renderIconStatusApprove(ListItem?.StatusProcess, i, true)}
                                                {this.renderApprover(ListItem)}
                                            </View>
                                            <View
                                                style={[
                                                    CustomStyleSheet.flex(1),
                                                    item?.ListDetails.length > 1 && CustomStyleSheet.marginLeft(24)
                                                ]}
                                            >
                                                {Array.isArray(ListItem?.ListContentHistory) &&
                                                    ListItem?.ListContentHistory.length > 0 &&
                                                    ListItem?.ListContentHistory.map((value, j) => {
                                                        return this.renderContentHistory(
                                                            value,
                                                            j,
                                                            ListItem?.ListContentHistory.length
                                                        );
                                                    })}
                                                {this.renderComment(ListItem?.Comment)}
                                                {this.renderDateTime(ListItem?.DateUpdated)}
                                            </View>
                                        </View>
                                    );
                                })}
                        </View>
                    </View>
                </View>
            );
        });
    };

    renderApprover = (item = null) => {
        if (!item) {
            return <View />;
        }

        return (
            <View style={stylesScreenDetailV3.styViewRenderApprove}>
                {Vnr_Function.renderAvatarCricleByName(
                    item?.ImagePath,
                    item.UserInfoName ? item.UserInfoName : 'A',
                    sizeImg
                )}
                <View style={[styleSheets.wrapNameAndSubtitle]}>
                    <View style={CustomStyleSheet.flex(1)}>
                        <Text numberOfLines={2} style={[styleSheets.subTitleApprover]}>
                            <Text style={[styleSheets.detailNameApprover]}>{item.UserInfoName} </Text>
                            {item?.Content ? item?.Content : ''}
                        </Text>
                    </View>
                    <Text style={[styleSheets.detailPositionApprover]}>
                        {item.PositionName ? item.PositionName : ''}
                    </Text>
                </View>
            </View>
        );
    };

    renderComment = (comment = null) => {
        if (!comment) return null;

        return (
            <View
                style={[
                    stylesScreenDetailV3.styMarginLeftCmt,
                    stylesScreenDetailV3.styleComment,
                    CustomStyleSheet.marginTop(4)
                ]}
            >
                <Text style={styleSheets.text}>{comment}</Text>
            </View>
        );
    };

    renderDateTime = (date = null) => {
        if (!date) return null;

        return (
            <View style={[stylesScreenDetailV3.styMarginLeftCmt, CustomStyleSheet.marginTop(2)]}>
                <Text style={stylesScreenDetailV3.styDateUpdate}>
                    {translate('E_AT_TIME')} {moment(date).format('HH:mm, DD/MM/YYYY')}
                </Text>
            </View>
        );
    };

    handleTitle = (title) => {
        if (title == null || title == '') return null;
        title = title.trim();
        if (title.includes('</span>')) title = title.replace('</span>', '');
        let fullTextView = <View />;
        const styleTextTitle = styleSheets.text;
        try {
            const cutstring =
                title.includes('<s>&#xFEFF;') || title.includes('</s>')
                    ? title
                        .replace(new RegExp(/<s>&#xFEFF;/g, 'g'), '&lt;strong&gt; @@DECO@@')
                        .replace(new RegExp(/<\/s>/g, 'g'), ' &lt;/strong&gt;')
                    // eslint-disable-next-line no-useless-escape
                        .split(/&lt;strong&gt;.|.\&lt;\/strong&gt;/)
                    : title;

            if (cutstring && Array.isArray(cutstring) && cutstring.length > 1) {
                fullTextView = (
                    <Text style={styleTextTitle}>
                        {cutstring.map((string) => {
                            if (string.includes('@@DECO@@')) {
                                const stringRep = string.includes('@@DECO@@') ? string.replace('@@DECO@@', '') : string;
                                return <Text style={[styleSheets.text, styles.stytextDeco]}>{stringRep}</Text>;
                            } else return <Text style={styleTextTitle}>{string}</Text>;
                        })}
                    </Text>
                );
            } else if (cutstring && cutstring.length == 1) {
                fullTextView = <Text style={styleTextTitle}>{cutstring[0]}</Text>;
            } else {
                fullTextView = <Text style={styleTextTitle}>{title}</Text>;
            }

            return <Text style={styleTextTitle}>{fullTextView}</Text>;
        } catch (error) {
            <Text style={styleTextTitle}>{title}</Text>;
        }
    };

    renderContentHistory = (item, index, maxLength) => {
        const title = this.handleTitle(item);
        const { isExpanded } = this.state;
        if (isExpanded == false && index > 2) return <View />;

        let btnShowMore = <View />;
        if (maxLength > 3) {
            if (!isExpanded && index == 2) {
                btnShowMore = (
                    <TouchableOpacity
                        onPress={() => this.setState({ isExpanded: !isExpanded })}
                        style={CustomStyleSheet.flexDirection('row')}
                    >

                        <VnrText style={[styleSheets.lable, styles.showMoreText]} i18nKey={'HRM_PortalApp_ShowMore'} />
                    </TouchableOpacity>
                );
            } else if (isExpanded && index == maxLength - 1) {
                btnShowMore = (
                    <TouchableOpacity onPress={() => this.setState({ isExpanded: !isExpanded })}>
                        <VnrText style={[styleSheets.lable, styles.showMoreText]} i18nKey={'HRM_PortalApp_ShowLess'} />
                    </TouchableOpacity>
                );
            }
        }

        return (
            <View style={[stylesScreenDetailV3.styMarginLeftCmt, CustomStyleSheet.paddingVertical(2)]} key={index}>
                <View style={styles.styViewHis}>
                    <View style={styles.styContentHis}>
                        <View style={styles.dot} />
                        <View>
                            <Text style={[styleSheets.text]} numberOfLines={3}>
                                {title}
                                {
                                    (maxLength > 3 && !isExpanded && index == 2) && (
                                        <Text style={styleSheets.text}>...</Text>

                                    )
                                }
                            </Text>
                        </View>
                    </View>

                    {btnShowMore}
                </View>
            </View>
        );
    };

    render() {
        const { dataApprover, lable, isCollapse } = this.props;
        const { isShowMore } = this.state;

        if (!Array.isArray(dataApprover) || dataApprover.length === 0) return <View />;

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
                    <Text style={[styleSheets.lable, styles.textLable]}>{translate(lable)}</Text>
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
                {isShowMore && <View>{this.renderLevelApprove(dataApprover)}</View>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    textLable: {
        flex: 1,
        color: Colors.black,
        fontSize: Size.text + 1
    },
    showMoreText: {
        color: Colors.blue
    },
    wrapLableLevelApprove: {
        marginBottom: Size.defineSpace - 4
    },

    inforApprover: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },

    dot: {
        width: 4,
        height: 4,
        backgroundColor: Colors.black,
        borderRadius: 4,
        marginRight: 6
    },
    stytextDeco: {
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
        color: Colors.gray_8
    },
    styViewHis : {
        flexWrap : 'wrap',
        flexDirection : 'row'
    },
    styContentHis :{
        marginTop : 7,
        marginRight : Size.defineHalfSpace,
        flexDirection:'row',
        alignItems : 'center'
    }
});

export default VnrRenderApprover;
