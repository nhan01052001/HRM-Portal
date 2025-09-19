import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from 'react-native';
import { IconSearch, IconSliders } from '../../../../constants/Icons';
import { Colors, CustomStyleSheet, Size } from '../../../../constants/styleConfig';
import { translate } from '../../../../i18n/translate';

export default class TopTabViewPlanAndResult extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isPlan: true
        };
    }

    render() {
        const { isPlan } = this.state;
        return (
            <View style={styles.headerWrapper}>
                <View style={styles.headerRow}>
                    <View style={styles.filterRow}>
                        <Text style={styles.filterLabel}>{translate('HRM_PortalApp_TakeBusinessTrip_ViewBy')}:</Text>
                        <View style={styles.switchWrapper}>
                            <TouchableOpacity
                                onPress={() => {
                                    if (!isPlan)
                                        this.setState({
                                            isPlan: true
                                        });
                                }}
                                activeOpacity={0.7}
                                style={[isPlan ? styles.switchActive : styles.switchInactive]}
                            >
                                <Text style={styles.switchActiveText}>
                                    {translate('HRM_PortalApp_TakeBusinessTrip_Plan')}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    if (isPlan)
                                        this.setState({
                                            isPlan: false
                                        });
                                }}
                                activeOpacity={0.7}
                                style={[!isPlan ? styles.switchActive : styles.switchInactive]}
                            >
                                <Text style={styles.switchInactiveText}>
                                    {translate('HRM_PortalApp_TakeBusinessTrip_Result')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[CustomStyleSheet.flexDirection('row'), CustomStyleSheet.alignItems('center')]}>
                        <TouchableOpacity style={CustomStyleSheet.padding(10)}>
                            <IconSearch size={Size.iconSize} color={Colors.black} />
                        </TouchableOpacity>
                        <TouchableOpacity style={CustomStyleSheet.padding(10)}>
                            <IconSliders size={Size.iconSize} color={Colors.black} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerWrapper: {
        paddingVertical: 2,
        paddingHorizontal: 12,
        width: '100%'
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: '400',
        marginRight: 4
    },
    switchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.gray_4,
        padding: 4,
        borderRadius: 6
    },
    switchActive: {
        backgroundColor: Colors.white,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5.46,
        elevation: 8
    },
    switchActiveText: {
        fontSize: 14,
        fontWeight: '500'
    },
    switchInactive: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6
    },
    switchInactiveText: {
        fontSize: 14,
        fontWeight: '400',
        color: Colors.gray_8
    }
});
