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
import { Colors, CustomStyleSheet, Size, styleSheets, stylesScreenDetailV3 } from '../../../../../../constants/styleConfig';
import Vnr_Function from '../../../../../../utils/Vnr_Function';
import { IconCheck } from '../../../../../../constants/Icons';
import RightActions from '../../../../../../componentsV3/ListButtonMenuRight/RightActions';
import Vnr_Services from '../../../../../../utils/Vnr_Services';
import VnrRenderListItem from '../../../../../../componentsV3/VnrRenderList/VnrRenderListItem';
import VnrFormatStringTypeItem from '../../../../../../componentsV3/VnrFormatStringType/VnrFormatStringTypeItem';
import { translate } from '../../../../../../i18n/translate';

export default class HreReceiveJobItem extends VnrRenderListItem {
    renderStatusView = (dataItem, renderConfig) => {
        if (renderConfig && renderConfig.length > 0) {
            const configStatus = renderConfig.find(config => config.TypeView == 'E_STATUS');
            if (configStatus) {
                let colorStatusView = null,
                    bgStatusView = null,
                    valueView = null;

                const fieldStatus = configStatus.Name;

                if (dataItem[`${fieldStatus}View`]) valueView = dataItem[`${fieldStatus}View`];
                else if (dataItem['StatusView']) valueView = dataItem['StatusView'];

                dataItem.itemStatus = Vnr_Services.formatStyleStatusApp(dataItem[fieldStatus]);

                const { colorStatus, bgStatus } = dataItem.itemStatus;
                colorStatusView = colorStatus ? colorStatus : null;
                bgStatusView = bgStatus ? bgStatus : null;

                return (
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
                            {valueView ? valueView : ''}
                        </Text>
                    </View>
                );
            }

            return <View />;
        }
    };

    renderProfileView = (dataItem, itemConfig, renderConfig) => {
        let isHaveAvatar = false,
            subProfile = [];
        isHaveAvatar = dataItem?.CandidateName ? true : false;


        // render sub profile
        if (itemConfig?.TypeView === 'E_PROFILE' && typeof itemConfig?.Name === 'string' && itemConfig?.Name.split(',').length > 0) {
            itemConfig?.Name.split(',').map((item) => {
                if (dataItem[item.trim()])
                    subProfile.push(`${dataItem[item.trim()]}${item.trim() === 'Age' ? ' ' + translate('HRM_PortalApp_YearOld') : ''}`);
            })
        }

        return (
            <View style={styles.styViewTop}>
                {/* top left */}
                {
                    itemConfig?.TypeView === 'E_PROFILE' && (
                        <View style={[styles.wh60]}>
                            <View>
                                {isHaveAvatar
                                    ? Vnr_Function.renderAvatarCricleByName(
                                        dataItem?.ImagePath,
                                        dataItem?.CandidateName,
                                        38
                                    )
                                    : null}
                            </View>

                            <View style={[CustomStyleSheet.marginLeft(6), CustomStyleSheet.justifyContent('center')]}>
                                <Text numberOfLines={2} style={[styleSheets.lable, CustomStyleSheet.fontSize(16)]}>{dataItem?.CandidateName}</Text>
                                {(subProfile.length > 0) && <Text numberOfLines={2} style={styleSheets.text}>{subProfile.join(' - ')}</Text>}
                            </View>
                        </View>
                    )
                }

                {/* top right */}
                <View style={[styles.viewContentTopRight, CustomStyleSheet.justifyContent('flex-start')]}>
                    {/* render status */}
                    {this.renderStatusView(dataItem, renderConfig)}
                </View>
            </View>
        )
    }

    render() {

        // assign props when render first time
        if (this.props?.value?.props)
            this.props = this.props?.value?.props;

        const {
            dataItem,
            index,
            listItemOpenSwipeOut,
            rowActions,
            isOpenAction,
            isDisable,
            handerOpenSwipeOut,
            renderConfig,
            onMoveDetail,
            onClick
        } = this.props;

        let _renderConfig = [];

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

        if (renderConfig && renderConfig.length > 0)
            _renderConfig = renderConfig.filter(config => config.TypeView !== 'E_STATUS');

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
                    permissionRightAction
                        ? () => <RightActions rowActions={rowActions} dataItem={dataItem} />
                        : this.rightActionsEmpty
                }
                friction={0.6}
                containerStyle={[styles.swipeable]}
            >
                <View style={[styles.swipeableLayout]}>
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
                                    typeof onMoveDetail === 'function' && onMoveDetail();
                                } else {
                                    typeof onClick === 'function' && onClick();
                                }
                            }}
                        />
                    </View>
                    <TouchableWithoutFeedback
                        onPressIn={() => handerOpenSwipeOut && handerOpenSwipeOut(index)}
                        onPress={() => {
                            typeof onMoveDetail === 'function' && onMoveDetail();
                        }}
                    >
                        <View style={styles.btnRight_ViewDetail}>
                            <View style={[CustomStyleSheet.flex(1)]}>
                                <View style={[styles.contentMain]} key={index}>

                                    {(_renderConfig.length > 0) && (
                                        _renderConfig.map((item, index) => {
                                            if ((item?.TypeView === 'E_PROFILE' || item?.TypeView === 'E_HEADER') && dataItem)
                                                return (
                                                    this.renderProfileView(dataItem, item, renderConfig)
                                                );
                                            else if (item?.TypeView === 'E_CLUSTER' && dataItem)
                                                return (
                                                    <View style={styles.viewCluster_swap}>
                                                        {/* {
                                                            (typeof item?.Name === 'string' && item?.Name.split(',').length > 0)
                                                            && item?.Name.split(', ').map((value, i) => {
                                                                return (dataItem[value]) ? (
                                                                    <View style={styles.viewItemCluster} key={i}>
                                                                        <Text>{dataItem[value]}</Text>
                                                                    </View>
                                                                ) : <View></View>
                                                            })
                                                        } */}
                                                    </View>
                                                );
                                            return (
                                                <View style={[CustomStyleSheet.paddingRight(16)]} key={index}>
                                                    <VnrFormatStringTypeItem data={dataItem} col={item} allConfig={_renderConfig} />
                                                </View>
                                            );
                                        })
                                    )}
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </Swipeable>
        );
    }
}

const styles = StyleSheet.create({
    swipeable: {
        flex: 1
    },
    swipeableLayout: {
        flex: 1,
        backgroundColor: Colors.white,
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
        justifyContent: 'space-between',
        marginBottom: Size.defineHalfSpace
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
        maxWidth: '40%',
        justifyContent: 'center',
        paddingRight: 12
    },

    wh60: {
        // width: '52%',
        maxWidth: '52%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    viewCluster_swap: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row'
    }
});
