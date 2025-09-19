/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { Colors, styleSheets, Size } from '../../../../../constants/styleConfig';
import { translate } from '../../../../../i18n/translate';

class CommentItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numberOfLines: 4,
            isShowMore: false,
            isShowLess: false,
            numberOfLinesTextDisplay: 4
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            nextProps?.comment !== this.props.comment ||
            nextState?.numberOfLines !== this.state.numberOfLines ||
            nextState?.isShowMore !== this.state.isShowMore ||
            nextState?.isShowLess !== this.state.isShowLess ||
            nextState?.numberOfLinesTextDisplay !== this.state.numberOfLinesTextDisplay
        );
    }

    render() {
        const { numberOfLines, isShowMore, numberOfLinesTextDisplay, isShowLess } = this.state,
            { comment } = this.props;

        return (
            <View style={{ marginLeft: 38, padding: 4, backgroundColor: Colors.gray_3 }}>
                <Text
                    onTextLayout={e => {
                        if (e.nativeEvent.lines.length > numberOfLines || isShowMore) {
                            this.setState({
                                isShowMore: true,
                                isShowLess: false,
                                numberOfLinesTextDisplay: e.nativeEvent.lines.length
                            });
                        }
                    }}
                    numberOfLines={numberOfLines}
                    style={[styleSheets.text, { fontSize: Size.text }]}
                >
                    {comment}
                </Text>
                {(isShowMore || isShowLess) && (
                    <TouchableOpacity
                        onPress={() => {
                            if (numberOfLinesTextDisplay > numberOfLines) {
                                this.setState({
                                    numberOfLines: numberOfLinesTextDisplay,
                                    isShowMore: false,
                                    isShowLess: true
                                });
                            } else {
                                this.setState({
                                    numberOfLines: 4,
                                    isShowMore: true,
                                    isShowLess: false
                                });
                            }
                        }}
                    >
                        <Text
                            style={[
                                styleSheets.text,
                                {
                                    fontSize: Size.text,
                                    color: Colors.blue
                                }
                            ]}
                        >
                            {numberOfLinesTextDisplay === numberOfLines
                                ? translate('HRM_PortalApp_ShowLess')
                                : translate('HRM_PortalApp_ShowMore')}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }
}

export default CommentItem;
