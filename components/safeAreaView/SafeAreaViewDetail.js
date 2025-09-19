import React from 'react';
import { View } from 'react-native';
import { SafeAreaConsumer } from 'react-native-safe-area-context';

export default class SafeAreaViewDetail extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { style, children } = this.props;
        return (
            <SafeAreaConsumer>
                {insets => (
                    <View
                        style={[
                            {
                                paddingBottom: insets.bottom
                            },
                            style
                        ]}
                    >
                        {children}
                    </View>
                )}
            </SafeAreaConsumer>
        );
    }
}
