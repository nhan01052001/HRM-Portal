import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    TouchableWithoutFeedback
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, CustomStyleSheet, Size, styleSheets, stylesScreenDetailV3, styleListItemV3 } from '../../constants/styleConfig';
import moment from 'moment';
import format from 'number-format.js';
import Vnr_Function from '../../utils/Vnr_Function';
import { translate } from '../../i18n/translate';
import { IconCheck } from '../../constants/Icons';
import Color from 'color';
import RightActions from '../ListButtonMenuRight/RightActions';
import Vnr_Services from '../../utils/Vnr_Services';
import VnrFormatStringTypeItem from '../VnrFormatStringType/VnrFormatStringTypeItem';

export default class VnrRenderListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            widthIconBack: new Animated.Value(Size.defineSpace),
            heightIconNext: new Animated.Value(0),
            springIconBack: new Animated.Value(1),
            springIconNext: new Animated.Value(0)
        };
        this.formatStringType = this.formatStringType.bind(this);
        this.setRightAction(props?.value?.props ? props?.value?.props : props);
        this.Swipe = null;
    }
    setRightAction = thisProps => {
        const { dataItem } = thisProps;
        this.sheetActions = [
            {
                title: translate('HRM_Common_Close'),
                onPress: null
            }
        ];
        if (!Vnr_Function.CheckIsNullOrEmpty(thisProps.rowActions)) {
            this.rightListActions = thisProps.rowActions.filter(item => {
                return (
                    !Vnr_Function.CheckIsNullOrEmpty(dataItem.BusinessAllowAction) &&
                    dataItem.BusinessAllowAction.indexOf(item.type) >= 0
                );
            });
        }
    };
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps?.value) {
            nextProps = nextProps.value?.props;
        }

        if (this.props?.value) {
            this.props = this.props.value?.props;
        }

        if (nextProps.isPullToRefresh !== this.props.isPullToRefresh) {
            this.setRightAction(nextProps);
        }
    }
    shouldComponentUpdate(nextProps) {
        // assign props about old format
        if (nextProps?.value?.props) {
            nextProps = nextProps?.value?.props;
        }

        if (this.props?.value?.props) {
            this.props = this.props?.value?.props;
        }

        if (
            nextProps.isPullToRefresh !== this.props.isPullToRefresh ||
            nextProps.isSelect !== this.props.isSelect ||
            nextProps.isOpenAction !== this.props.isOpenAction ||
            nextProps.isDisable !== this.props.isDisable
        ) {
            return true;
        } else {
            return false;
        }
    }
    formatStringType = (data, col) => {
        if (data[col.Name]) {
            if (col.DataType && col.DataType.toLowerCase() == 'datetime') {
                return moment(data[col.Name]).format(col.DataFormat);
            }
            if (col.DataType && col.DataType.toLowerCase() == 'double') {
                return format(col.DataFormat, data[col.Name]);
            } else {
                return data[col.Name];
            }
        } else {
            return '';
        }
    };

    rightActionsEmpty = () => {
        return <View style={CustomStyleSheet.width(0)} />;
    };

    convertTextToColor = value => {
        const [num1, num2, num3, opacity] = value.split(',');
        return Color.rgb(parseFloat(num1), parseFloat(num2), parseFloat(num3), parseFloat(opacity));
    };

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
            subProfile = '';

        const { DataStatus } = dataItem;
        isHaveAvatar = DataStatus?.UserProcessName ? true : false;

        // render sub profile
        if (itemConfig?.TypeView === 'E_PROFILE' && typeof itemConfig?.Name === 'string' && itemConfig?.Name.split(',').length > 0) {
            itemConfig?.Name.split(',').map((item, index) => {
                subProfile += `${index === 0 ? '' : ' - '}${dataItem[item] ? dataItem[item] : 'null'}`
            })
        }

        return (
            <View style={styles.styViewTop}>
                {/* top left */}
                {
                    itemConfig?.TypeView === 'E_PROFILE' && (
                        <View style={[styles.wh69]}>
                            <View>
                                {isHaveAvatar
                                    ? Vnr_Function.renderAvatarCricleByName(
                                        DataStatus.ImagePath,
                                        DataStatus?.UserProcessName,
                                        38
                                    )
                                    : null}
                            </View>

                            <View style={[CustomStyleSheet.marginLeft(6), CustomStyleSheet.justifyContent('center')]}>
                                <Text numberOfLines={2} style={[styleSheets.lable, CustomStyleSheet.fontSize(16)]}>{dataItem?.ProfileName}</Text>
                                {subProfile && <Text numberOfLines={2} style={styleSheets.text}>{subProfile}</Text>}
                            </View>
                        </View>
                    )
                }

                {
                    itemConfig?.TypeView === 'E_HEADER' && (
                        <View style={[styles.wh79]}>
                            <View style={[CustomStyleSheet.justifyContent('center')]}>
                                {(itemConfig?.Name && dataItem[itemConfig?.Name]) && <Text numberOfLines={1} style={[styleSheets.lable, CustomStyleSheet.fontSize(16)]}>{dataItem[itemConfig?.Name]}</Text>}
                                {(itemConfig?.SubName && dataItem[itemConfig?.SubName]) && <Text numberOfLines={2} style={styleSheets.text}>{dataItem[itemConfig?.SubName]}</Text>}
                            </View>
                        </View>
                    )
                }

                {/* top right */}
                <View style={[styles.viewContentTopRight, CustomStyleSheet.justifyContent('flex-start')]}>
                    {/* sub top right */}
                    <View
                        style={[
                            styles.subTopRight,
                            CustomStyleSheet.marginBottom(6)
                        ]}
                    >
                        <Text
                            numberOfLines={1}
                            style={[
                                styleSheets.text,
                                styles.lineSatus_text,
                                CustomStyleSheet.textAlign('center')
                            ]}
                        >
                            80%
                        </Text>
                    </View>

                    {/* render status */}
                    {this.renderStatusView(dataItem, renderConfig)}
                </View>
            </View>
        )
    }

    componentDidMount() {
        // assign props when render first time
        if (this.props?.value?.props)
            this.props = this.props?.value?.props;
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
                                                        {
                                                            (typeof item?.Name === 'string' && item?.Name.split(',').length > 0)
                                                            && item?.Name.split(', ').map((value, i) => {
                                                                return dataItem[value] ? (
                                                                    <View style={styles.viewItemCluster} key={i}>
                                                                        <Text>{dataItem[value]}</Text>
                                                                    </View>
                                                                ) : null
                                                            })
                                                        }
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

const styles = styleListItemV3;
