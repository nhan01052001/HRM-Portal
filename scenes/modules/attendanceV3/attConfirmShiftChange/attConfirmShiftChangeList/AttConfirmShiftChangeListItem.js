/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, CustomStyleSheet, Size, styleSheets, stylesScreenDetailV3 } from '../../../../../constants/styleConfig';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import {
    IconCheck,
    IconChat
} from '../../../../../constants/Icons';
import RightActions from '../../../../../componentsV3/ListButtonMenuRight/RightActions';
import VnrFormatStringTypeItem from '../../../../../componentsV3/VnrFormatStringType/VnrFormatStringTypeItem';
import VnrRenderListItem from '../../../../../componentsV3/VnrRenderList/VnrRenderListItem';

export default class AttConfirmShiftChangeListItem extends VnrRenderListItem {
    render() {
        const {
            dataItem,
            index,
            listItemOpenSwipeOut,
            rowActions,
            isOpenAction,
            isDisable,
            handerOpenSwipeOut,
            renderConfig
        } = this.props;

        let colorStatusView = null,
            textFieldSalary = '',
            bgStatusView = null;

        const { DataStatus } = dataItem,
            { ProfileInfo } = dataItem;
        let _renderConfig = [];
        if (renderConfig && renderConfig.length > 0)
            _renderConfig = renderConfig.filter(config => config.TypeView !== 'E_STATUS');

        if (dataItem.Type === 'E_DIFFERENTDAY' ||
            dataItem.Type === 'E_CHANGE_SHIFT_COMPANSATION' ||
            dataItem.Type === 'E_SAMEDAY') {
            _renderConfig = _renderConfig.flatMap(item => {
                if (item.DataType === 'DateToFrom') {
                    return [
                        {
                            TypeView: 'E_COMMON',
                            Name: 'DateStart',
                            DisplayKey: 'HRM_PortalApp_ShiftChangeDate',
                            DataType: 'DateToFrom',
                            DataFormat: 'DD/MM/YYYY'
                        },
                        {
                            TypeView: 'E_COMMON',
                            Name: 'AlternateDate',
                            DisplayKey: 'HRM_PortalApp_TheReplacementDay',
                            DataType: 'DateToFrom',
                            DataFormat: 'DD/MM/YYYY'
                        }
                    ];
                } else {
                    return item;
                }
            });
        }


        // xử lý color
        if (dataItem.itemStatus) {
            const { colorStatus, bgStatus } = dataItem.itemStatus;
            colorStatusView = colorStatus ? colorStatus : null;
            bgStatusView = bgStatus ? bgStatus : null;
        }

        if (dataItem.SalaryClassName) {
            textFieldSalary = `${dataItem.SalaryClassName}`;
        }
        if (dataItem.PositionName) {
            if (textFieldSalary != '') {
                textFieldSalary = `${textFieldSalary} | ${dataItem.PositionName}`;
            } else {
                textFieldSalary = `${dataItem.PositionName}`;
            }
        }

        let permissionRightAction =
            rowActions != null &&
                Array.isArray(rowActions) &&
                rowActions.length > 0 &&
                !isOpenAction &&
                this.rightListActions &&
                Array.isArray(this.rightListActions) &&
                this.rightListActions.length > 0
                ? true
                : false;

        let isDisableWhenConfig = dataItem?.IsDisable ? true : false;

        return (
            <Swipeable
                ref={ref => {
                    this.Swipe = ref;
                    if (
                        listItemOpenSwipeOut.findIndex(value => {
                            return value['ID'] == index;
                        }) < 0
                    ) {
                        listItemOpenSwipeOut.push({ ID: index, value: ref });
                    } else {
                        listItemOpenSwipeOut[index].value = ref;
                    }
                }}
                overshootRight={false}
                renderRightActions={
                    permissionRightAction && isDisableWhenConfig === false
                        ? () => <RightActions rowActions={rowActions} dataItem={dataItem} />
                        : this.rightActionsEmpty
                }
                friction={0.6}
                containerStyle={[styles.swipeable]}
            >
                <View style={[styles.swipeableLayout, isDisableWhenConfig && styleSheets.opacity05]}>
                    <View style={styles.left_isCheckbox}>
                        {rowActions === null || (Array.isArray(rowActions) && rowActions.length === 0) ? null : (
                            <View
                                style={[
                                    styles.styRadiusCheck,
                                    this.props.isSelect && stylesScreenDetailV3.checkAll
                                ]}
                            >
                                {this.props.isSelect && <IconCheck size={Size.iconSize - 10} color={Colors.white} />}
                            </View>
                        )}
                        <TouchableOpacity
                            style={[
                                styles.btnLeft_check,
                                (rowActions === null || (Array.isArray(rowActions) && rowActions.length === 0)) && {
                                    ...CustomStyleSheet.zIndex(1),
                                    ...CustomStyleSheet.elevation(1)
                                }
                            ]}
                            activeOpacity={isDisable ? 1 : 0.8}
                            onPress={() => {
                                if (rowActions === null || (Array.isArray(rowActions) && rowActions.length === 0)) {
                                    this.props.onMoveDetail();
                                } else {
                                    this.props.onClick();
                                }
                            }}
                        />
                    </View>
                    <TouchableWithoutFeedback
                        onPressIn={() => handerOpenSwipeOut && handerOpenSwipeOut(index)}
                        onPress={() => {
                            this.props.onMoveDetail();
                        }}
                    >
                        <View style={styles.btnRight_ViewDetail}>
                            <View style={[CustomStyleSheet.flex(1)]}>
                                <View style={[styles.contentMain]} key={index}>
                                    {/* top */}
                                    <View style={styles.styViewTop}>
                                        {/* Top - left */}
                                        <View style={[styles.wh69]}>
                                            {
                                                dataItem?.ProfileInfo2?.ProfileName2 && (
                                                    <View>
                                                        {Vnr_Function.renderAvatarCricleByName(
                                                            dataItem?.ProfileInfo2?.ImagePath2,
                                                            dataItem?.ProfileInfo2?.ProfileName2,
                                                            38
                                                        )}
                                                    </View>
                                                )
                                            }

                                            {
                                                dataItem?.ProfileInfo2?.ProfileName2 && (
                                                    <View style={[CustomStyleSheet.marginLeft(6), CustomStyleSheet.justifyContent('center')]}>
                                                        <Text numberOfLines={2} style={[styleSheets.lable, CustomStyleSheet.fontSize(16)]}>{dataItem?.ProfileInfo2?.ProfileName2}</Text>
                                                    </View>
                                                )
                                            }
                                        </View>

                                        {/* Top - right */}
                                        <View style={styles.viewContentTopRight}>
                                            <View
                                                style={[
                                                    styles.lineSatus,
                                                    {
                                                        backgroundColor: bgStatusView ? this.convertTextToColor(bgStatusView) : Colors.white
                                                    }
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
                                                    {DataStatus && DataStatus.StatusView ? DataStatus.StatusView : ''}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    {(_renderConfig.length > 0) && (
                                        _renderConfig.map((item, index) => {
                                            return (
                                                <View style={[CustomStyleSheet.paddingRight(16)]} key={index}>
                                                    <VnrFormatStringTypeItem key={index} data={dataItem} col={item} allConfig={_renderConfig} />
                                                </View>
                                            );
                                        })
                                    )}
                                    {dataItem.Comment != null && (
                                        <View style={styles.wrapContentCenter}>
                                            <View style={styles.styIconMess}>
                                                <IconChat size={Size.text + 1} color={Colors.gray_8} />
                                            </View>
                                            <View style={styles.wrapReason}>
                                                <Text
                                                    numberOfLines={2}
                                                    style={[styleSheets.text, styles.viewReason_text]}
                                                >
                                                    {dataItem.Comment ? `${dataItem.Comment}` : ''}
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                </View>
                                <View style={styles.viewStatusBottom}>
                                    <View style={[styles.leftContent, isDisable ? styleSheets.opacity05 : styleSheets.opacity1]}>
                                        {Vnr_Function.renderAvatarCricleByName(
                                            ProfileInfo.ImagePath,
                                            ProfileInfo.ProfileName,
                                            20
                                        )}
                                    </View>
                                    <View style={styles.styUserApprove}>
                                        <Text numberOfLines={1} style={[styleSheets.lable, styles.textProfileName]}>
                                            {`${dataItem.ProfileName ? dataItem.ProfileName : ''} `}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </Swipeable>
        );
    }
}

const PADDING_DEFINE = Size.defineSpace;
const styles = StyleSheet.create({
    styUserApprove: {
        flexShrink: 1
    },
    swipeable: {
        flex: 1
    },
    swipeableLayout: {
        flex: 1,
        backgroundColor: Colors.white,
        flexDirection: 'row'
    },
    viewStatusBottom: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: PADDING_DEFINE / 2,
        paddingRight: Size.defineSpace,
        flexDirection: 'row'
    },
    lineSatus: {
        paddingHorizontal: 6,
        alignItems: 'center',
        paddingVertical: 2,
        borderRadius: Size.borderRadiusCircle
        // padding: 4
    },
    lineSatus_text: {
        fontSize: Size.text - 3,
        fontWeight: '500'
    },
    styRadiusCheck: {
        width: Size.iconSize - 3,
        height: Size.iconSize - 3,
        borderRadius: (Size.iconSize - 3) / 2,
        borderWidth: 1,
        borderColor: Colors.gray_8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    contentMain: {
        flex: 1,
        paddingTop: Size.defineSpace
        // paddingHorizontal: Size.defineSpace,
    },
    styViewTop: {
        flexDirection: 'row',
        justifyContent: 'space-between'
        // marginBottom: Size.defineHalfSpace,
    },
    leftContent: {
        marginRight: 5
    },

    left_isCheckbox: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingLeft: 8
    },

    btnLeft_check: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: Dimensions.get('window').width / 2,
        zIndex: 2,
        elevation: 2
    },

    btnRight_ViewDetail: {
        flex: 1,
        zIndex: 1,
        elevation: 1
    },

    viewContentTopRight: {
        // width: '30%',
        maxWidth: '33%',
        justifyContent: 'center',
        paddingRight: 12
    },
    textProfileName: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.blue
    },
    wh69: {
        width: '69%',
        maxWidth: '69%',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    wrapContentCenter: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4
    },
    styIconMess: {
        marginTop: 3
    },
    wrapReason: {
        width: '92%',
        paddingRight: 12,
        paddingLeft: 6,
        marginTop: 2
    },
    viewReason_text: {
        fontSize: Size.textSmall,
        color: Colors.gray_9
    }
});
