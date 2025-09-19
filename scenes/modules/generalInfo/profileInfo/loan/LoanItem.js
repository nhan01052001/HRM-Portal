import React from 'react';
import {
    View,
    StyleSheet
} from 'react-native';
import {
    Colors,
    Size
} from '../../../../../constants/styleConfig';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
export default class LoanItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    shouldComponentUpdate(nextProps) {
        if (
            nextProps.isPullToRefresh !== this.props.isPullToRefresh ||
            !Vnr_Function.compare(nextProps?.dataItem, this.props?.dataItem)
        ) {
            return true;
        } else {
            return false;
        }
    }


    render() {
        const {
            dataItem,
            rowActions
        } = this.props;

        dataItem.LoanLimitFileAttach = ManageFileSevice.setFileAttachApp(dataItem.LoanLimitFileAttach);


        return (
            <View
                style={styles.swipeable}>
                <View style={[styles.swipeableLayout]}>
                    <View style={[styles.container]}>

                        <View style={styles.styContentItem} >
                            {/* {
                                rowActions.map((item, index) => {
                                    let text = dataItem[item?.Name] ? dataItem[item?.Name] : '-';

                                    if (item?.DataType === 'DateTime' && dataItem[item?.Name] && item?.DataFormat)
                                        text = moment(dataItem[item?.Name]).format(item?.DataFormat);

                                    return (
                                        <View
                                            key={index}
                                            style={styles.containerItem}
                                        >
                                            <View
                                                style={CustomStyleSheet.flex(1)}
                                            >
                                                <Text style={styleSheets.lable}>{translate(item?.DisplayKey)}</Text>
                                            </View>

                                            <View
                                                style={CustomStyleSheet.flex(1)}
                                            >
                                                <Text
                                                    style={[styleSheets.text, CustomStyleSheet.textAlign('right')]}
                                                >
                                                    {text}
                                                </Text>
                                            </View>
                                        </View>
                                    )
                                })
                            } */}
                            {rowActions.map((e) => {
                                if (e.TypeView != 'E_COMMON_PROFILE')
                                    return Vnr_Function.formatStringTypeV3(dataItem, e, rowActions);
                            })}
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const PADDING_DEFINE = Size.defineSpace;
const styles = StyleSheet.create({
    swipeable: {
        flex: 1,
        paddingHorizontal: Size.defineSpace

    },
    swipeableLayout: {
        flex: 1,
        borderRadius: 8,
        backgroundColor: Colors.white,
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        position: 'relative',
        flexDirection: 'row',
        minHeight: 90
    },
    container: {
        flex: 1,
        // backgroundColor: Colors.white,
        // borderRadius: 10,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: PADDING_DEFINE
    },
    styContentItem: {
        flex: 7,
        paddingHorizontal: Size.defineSpace
    }
});
