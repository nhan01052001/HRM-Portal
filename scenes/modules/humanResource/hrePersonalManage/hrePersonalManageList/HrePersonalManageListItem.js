import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Colors, Size, styleSheets } from '../../../../../constants/styleConfig';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrFormatStringTypeItem from '../../../../../componentsV3/VnrFormatStringType/VnrFormatStringTypeItem';
import Vnr_Services from '../../../../../utils/Vnr_Services';
import Color from 'color';

export default class HrePersonalManageListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.Swipe = null;
    }

    shouldComponentUpdate(nextProps) {
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
                    <View style={styles.contentRight}>
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
                    </View>
                );
            }

            return <View />;
        }
    };

    render() {
        const { dataItem, isDisable, renderConfig } = this.props;

        let _renderConfig = [],
            txtProfileName = null;
        if (renderConfig && renderConfig.length > 0)
            _renderConfig = renderConfig.filter(config => config.TypeView !== 'E_STATUS');

        if (dataItem.CodeEmp != null) txtProfileName = dataItem.CodeEmp;

        if (dataItem.ProfileName)
            txtProfileName =
                txtProfileName != null ? `${txtProfileName} - ${dataItem.ProfileName}` : dataItem.ProfileName;

        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    this.props.onMoveDetail();
                }}
            >
                <View style={styles.swipeableLayout}>
                    <View style={styles.container}>
                        <View style={styles.styViewTop}>
                            <View style={[styles.leftContent, isDisable ? styleSheets.opacity05 : styleSheets.opacity1]}>
                                {Vnr_Function.renderAvatarCricleByName(
                                    dataItem.ImagePath,
                                    dataItem.ProfileName,
                                    Size.AvatarSize
                                )}
                            </View>

                            <View style={styles.contentCenter}>
                                <Text numberOfLines={1} style={[styleSheets.lable, styles.profileText]}>
                                    {txtProfileName}
                                </Text>

                                {dataItem.OrgStructureName != null && (
                                    <Text numberOfLines={1} style={[styleSheets.text, styles.positionText]}>
                                        {dataItem.OrgStructureName ? dataItem.OrgStructureName : ''}
                                    </Text>
                                )}
                            </View>

                            {this.renderStatusView(dataItem, renderConfig)}
                        </View>

                        <View style={styles.styProgress}>
                            {_renderConfig.map((col, index) => (
                                <VnrFormatStringTypeItem key={index} data={dataItem} col={col} allConfig={_renderConfig} />
                            ))}
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const PADDING_DEFINE = Size.defineSpace;
const styles = StyleSheet.create({
    swipeableLayout: {
        flex: 1,
        backgroundColor: Colors.white
    },
    container: {
        flex: 1,
        paddingHorizontal: Size.defineSpace,
        paddingVertical: Size.defineHalfSpace
    },
    styViewTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Size.defineHalfSpace
    },
    leftContent: {
        marginRight: Size.defineHalfSpace,
        justifyContent: 'center'
    },
    contentCenter: {
        flex: 7.2,
        paddingRight: PADDING_DEFINE,
        justifyContent: 'center'
    },
    contentRight: {
        justifyContent: 'center'
    },
    profileText: {
        fontSize: Size.text - 1
    },
    positionText: {
        fontSize: Size.text - 2
    },
    lineSatus: {
        // paddingHorizontal: 3,
        alignItems: 'center',
        // paddingVertical: 2,
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 3
    },
    lineSatus_text: {
        fontSize: Size.text - 3,
        fontWeight: '500'
    },
    // ============= //
    styProgress: {
        flex: 1,
        backgroundColor: Colors.gray_3,
        borderRadius: 3,
        paddingHorizontal: Size.defineHalfSpace,
        paddingVertical: Size.defineHalfSpace
        // marginHorizontal: Size.defineHalfSpace
    }
});
