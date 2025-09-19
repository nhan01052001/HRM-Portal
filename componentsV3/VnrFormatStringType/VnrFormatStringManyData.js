/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import {
    styleSheets,
    Size,
    Colors,
    stylesScreenDetailV3,
    CustomStyleSheet
} from '../../constants/styleConfig';
import { IconShowDownChevron, IconShowUpChevron } from '../../constants/Icons';
import Vnr_Function from '../../utils/Vnr_Function';
import { translate } from '../../i18n/translate';
import Vnr_Services from '../../utils/Vnr_Services';
import ManageFileSevice from '../../utils/ManageFileSevice';

class VnrFormatStringManyData extends Component {
    constructor(props) {
        super(props);
        this.state = { isShowMore: true };
    }

    render() {
        const { data, allConfig } = this.props;
        const { isShowMore } = this.state;
        let label = null;
        let isCollapse = true;

        if (allConfig && allConfig.length > 0) {
            const currentGroup = allConfig.find((i) => i.TypeView == 'E_GROUP');
            // eslint-disable-next-line no-unused-vars
            label = currentGroup.DisplayKey;
        }

        if (Array.isArray(data) && data.length > 0) {
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
                            {translate(label)}
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
                        Array.isArray(data) &&
                        data.length > 0 &&
                        data.map((item, index) => {
                            item.itemStatus = Vnr_Services.formatStyleStatusApp(item.Status);

                            if (!Array.isArray(item.FileAttachment))
                                item.FileAttachment = ManageFileSevice.setFileAttachApp(item.FileAttachment);

                            if (item.TagName) {
                                item.itemStatus = {
                                    colorStatus: item.Color ? item.Color : '#262626',
                                    borderStatus: Colors.white,
                                    bgStatus: item.ColorRGB ? item.ColorRGB : '0, 0, 0, 0.08'
                                };
                            }

                            return (
                                <View key={index} style={CustomStyleSheet.marginTop(Size.defineHalfSpace)}>
                                    {index > 0 && <View style={stylesScreenDetailV3.styLineManydata} />}
                                    {allConfig.map((e) => {
                                        if (e.TypeView != 'E_GROUP') return Vnr_Function.formatStringTypeV3(item, e);
                                    })}
                                </View>
                            );
                        })}
                </View>
            );
        } else return <View></View>;
        //#endregion
    }
}

export default VnrFormatStringManyData;
