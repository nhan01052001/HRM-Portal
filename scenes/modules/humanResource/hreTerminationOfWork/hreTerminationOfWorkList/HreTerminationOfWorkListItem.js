import React from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, Size, styleListItemV3, styleSheets } from '../../../../../constants/styleConfig';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import RightActions from '../../../../../componentsV3/ListButtonMenuRight/RightActions';
import Vnr_Services from '../../../../../utils/Vnr_Services';
import VnrFormatStringTypeItem from '../../../../../componentsV3/VnrFormatStringType/VnrFormatStringTypeItem';
import VnrRenderListItem from '../../../../../componentsV3/VnrRenderList/VnrRenderListItem';

export default class HreTerminationOfWorkListItem extends VnrRenderListItem {
    renderStatusView = (dataItem, renderConfig) => {
        if (renderConfig && renderConfig.length > 0) {
            const configStatus = renderConfig.find((config) => config.TypeView == 'E_STATUS');
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

                if (valueView)
                    return (
                        <View style={styles.contentRight}>
                            <View
                                style={[
                                    styles.lineSatus,
                                    {
                                        backgroundColor: bgStatusView
                                            ? Vnr_Function.convertTextToColor(bgStatusView)
                                            : Colors.white
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
                        </View>
                    );
            }

            return <View />;
        }
    };

    render() {
        const { dataItem, index, listItemOpenSwipeOut, rowActions, isOpenAction, handerOpenSwipeOut, renderConfig } =
            this.props;

        let _renderConfig = [];
        if (renderConfig && renderConfig.length > 0)
            _renderConfig = renderConfig.filter((config) => config.TypeView !== 'E_STATUS');

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
                ref={(ref) => {
                    this.Swipe = ref;
                    if (
                        listItemOpenSwipeOut.findIndex((value) => {
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
                    <TouchableWithoutFeedback
                        onPressIn={() => handerOpenSwipeOut && handerOpenSwipeOut(index)}
                        onPress={() => {
                            this.props.onMoveDetail();
                        }}
                    >
                        <View style={styles.swipeableLayout}>
                            <View style={styles.container}>
                                <View style={styles.styViewTop}>
                                    <View style={styles.contentCenter}>
                                        <Text numberOfLines={1} style={[styleSheets.lable, styles.profileText]}>
                                            {dataItem.TypeOfStopName ? dataItem.TypeOfStopName : ''}
                                        </Text>
                                    </View>

                                    {this.renderStatusView(dataItem, renderConfig)}
                                </View>

                                <View style={styles.styProgress}>
                                    {_renderConfig.map((col, index) => (
                                        <VnrFormatStringTypeItem
                                            key={index}
                                            data={dataItem}
                                            col={col}
                                            allConfig={_renderConfig}
                                        />
                                    ))}
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </Swipeable>
        );
    }
}

const styles = {
    ...styleListItemV3,
    swipeableLayout: {
        flex: 1,
        backgroundColor: Colors.white,
        flexDirection: 'row',
        paddingLeft: Size.defineHalfSpace
    },
    styViewTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Size.defineHalfSpace
    }
}
