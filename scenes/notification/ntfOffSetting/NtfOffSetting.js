import React, { Component } from 'react';
import { Image, View, TouchableOpacity, StyleSheet, Text, Platform, ScrollView, Switch, Animated } from 'react-native';
import { Colors, Size, styleSheets, styleSafeAreaView, styleButtonAddOrEdit } from '../../../constants/styleConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dataVnrStorage, logout } from '../../../assets/auth/authentication';
import generalProfileInfo from '../../../redux/generalProfileInfo';
import {
    IconLock,
    IconNext,
    IconLogout,
    IconAppStore,
    IconAndroid,
    IconOffNotify,
    IconTime,
    IconCheck
} from '../../../constants/Icons';
import moment from 'moment';
import ModalUpdateVersion from '../../../components/modalUpdateVersion/ModalUpdateVersion';
import VnrText from '../../../components/VnrText/VnrText';
import { SafeAreaView } from 'react-navigation';
import VnrDate from '../../../components/VnrDate/VnrDate';
import languageReducer from '../../../redux/i18n';
import { connect } from 'react-redux';
import HttpService from '../../../utils/HttpService';
import { VnrLoadingSevices } from '../../../components/VnrLoading/VnrLoadingPages';
import DeviceInfo from 'react-native-device-info';
import codePush from 'react-native-code-push';
import { ToasterSevice } from '../../../components/Toaster/Toaster';
import { listKeys } from '../../../i18n/locales/vi';
import VnrLoading from '../../../components/VnrLoading/VnrLoading';
import { EnumTask } from '../../../assets/constant';
import { getDataLocal } from '../../../factories/LocalData';

const EnumTimeOff = {
        E_TOMORROW: {
            KEY: 'E_TOMORROW',
            VALUE: 8
        },
        E_ONE_HOUR: {
            KEY: 'E_ONE_HOUR',
            VALUE: 1
        },
        E_FOUR_HOUR: {
            KEY: 'E_FOUR_HOUR',
            VALUE: 4
        },
        E_NERVER: {
            KEY: 'E_NERVER',
            VALUE: 0
        }
    },
    EnumTimeOn = {
        E_DAILY: 'E_DAILY',
        E_WEEKLY: 'E_WEEKLY',
        E_MONTHLY: 'E_MONTHLY',
        E_DEFAULT: 'E_DEFAULT'
    };

export default class NtfOffSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOnOffNotification: false,
            isLoading: true,
            offNotification: null,
            onNotification: null,
            weeksSelect: [
                {
                    value: 2,
                    keyTrans: 'E_MONDAY_SHORT'
                },
                {
                    value: 3,
                    keyTrans: 'E_TUESDAY_SHORT'
                },
                {
                    value: 4,
                    keyTrans: 'E_WEDNESDAY_SHORT'
                },
                {
                    value: 5,
                    keyTrans: 'E_THURSDAY_SHORT'
                },
                {
                    value: 6,
                    keyTrans: 'E_FRIDAY_SHORT'
                },
                {
                    value: 7,
                    keyTrans: 'E_SATURDAY_SHORT'
                },
                {
                    value: 8,
                    keyTrans: 'E_SUNDAY_SHORT'
                }
            ],
            monthsSelect: [...Array(31).keys()].map(e => e + 1),
            // configNotify: null,
            animatedCollap: new Animated.Value(HEIGHT_ACTION),
            animatedCollapOpacity: new Animated.Value(0),
            minHeight: HEIGHT_ACTION
        };

        this.refTimeNotify = null;
    }

    selectPickerTime = () => this.refTimeNotify.showDatePicker();

    router = roouterName => {
        const { navigation } = this.props;
        navigation.navigate(roouterName);
    };

    toggleSwitchNotify = () => {
        let initialValue = this.state.isOnOffNotification
                ? this.state.maxHeight + this.state.minHeight
                : this.state.minHeight,
            finalValue = this.state.isOnOffNotification
                ? this.state.minHeight
                : this.state.maxHeight + this.state.minHeight;

        this.setState({
            isOnOffNotification: !this.state.isOnOffNotification
        });
        this.state.animatedCollap.setValue(initialValue);
        // Animated.spring(
        //     this.state.animatedCollap,
        //     {
        //         toValue: Math.ceil(finalValue),
        //         bounciness: 0,
        //         speed: 7
        //     }
        // ).start();
    };

    undoSetting = () => {
        this.getData();
    };

    saveSetting = () => {
        console.log(this.state);
    };

    getData = () => {
        getDataLocal(EnumTask.KT_Notification_Setting).then(res => {
            if (res != null) {
            } else {
                this.setState({
                    isLoading: false,
                    isOnOffNotification: false,
                    offNotification: `${EnumTimeOff.E_NERVER.KEY}|${EnumTimeOff.E_NERVER.VALUE}`,
                    onNotification: {
                        typeOn: EnumTimeOn.E_DAILY,
                        timeSetting: new Date(), //'DD/MM/YYYY hh:ss.mm'
                        numberListWeeks: [],
                        numberListMonths: []
                    }
                });
            }
            //console.log(res, 'abc')
        });
    };

    componentDidMount() {
        this.getData();
    }

    _setMaxHeight(event) {
        this.setState({
            maxHeight: event.nativeEvent.layout.height
        });
    }

    //#region [Notification On]
    onChangeTimeManager = value => {
        const { onNotification } = this.state;

        this.setState({
            onNotification: {
                ...onNotification,
                timeSetting: value
            }
        });
    };

    selectWeekOption = value => () => {
        const { onNotification } = this.state,
            { numberListWeeks } = onNotification;
        let indexFind = numberListWeeks.findIndex(e => e == value);

        if (indexFind != -1) {
            numberListWeeks.splice(indexFind, 1);
        } else {
            numberListWeeks.push(value);
        }

        this.setState({
            onNotification
        });
    };

    selectMonthOption = value => () => {
        const { onNotification } = this.state,
            { numberListMonths } = onNotification;
        let indexFind = numberListMonths.findIndex(e => e == value);

        if (indexFind != -1) {
            numberListMonths.splice(indexFind, 1);
        } else {
            numberListMonths.push(value);
        }

        this.setState({
            onNotification
        });
    };

    renderListWeeks = () => {
        const { onNotification, weeksSelect } = this.state,
            { numberListWeeks } = onNotification;

        // đưa mảng về object để check
        let objNumberList = {};
        numberListWeeks.forEach(e => (objNumberList[e] = e));

        return (
            <View style={styles.styViewSlTime}>
                <View style={styles.styViewTitleTime}>
                    <VnrText
                        style={[styleSheets.text, styles.styTitle]}
                        i18nKey={'HRM_Notification_Notice_Ontime_Setting'}
                    />
                </View>
                <View style={styles.styListWeek}>
                    {weeksSelect.map(item => {
                        return (
                            <TouchableOpacity
                                onPress={this.selectWeekOption(item.value)}
                                style={[
                                    styles.styListWeekItem,
                                    objNumberList[item.value] == item.value && styles.styListWeekItemActive
                                ]}
                            >
                                <VnrText
                                    style={[
                                        styleSheets.text,
                                        objNumberList[item.value] == item.value
                                            ? styles.styListWeekItemTextActive
                                            : styles.styListWeekItemTextInActive
                                    ]}
                                    i18nKey={item.keyTrans}
                                />
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        );
    };

    renderListMonths = () => {
        const { onNotification, monthsSelect } = this.state,
            { numberListMonths } = onNotification;

        // đưa mảng về object để check
        let objNumberList = {};
        numberListMonths.forEach(e => (objNumberList[e] = e));

        return (
            <View style={styles.styViewSlTime}>
                <View style={styles.styViewTitleList}>
                    <VnrText
                        style={[styleSheets.text, styles.styTitle]}
                        i18nKey={'HRM_Notification_Notice_Ontime_Setting'}
                    />

                    <VnrText
                        style={[styleSheets.lable, styles.stySubTitle]}
                        i18nKey={'HRM_Notification_Notice_Ontime_Message_Setting'}
                    />
                </View>
                <View style={styles.styListMonth}>
                    {monthsSelect.map((item, index) => {
                        return (
                            <TouchableOpacity
                                onPress={this.selectMonthOption(item)}
                                style={[
                                    styles.styListWeekItem,
                                    {
                                        marginRight: (index + 1) % 7 == 0 ? 0 : Size.defineSpace
                                    },
                                    objNumberList[item] == item && styles.styListWeekItemActive
                                ]}
                            >
                                <VnrText
                                    style={[
                                        styleSheets.text,
                                        objNumberList[item] == item
                                            ? styles.styListWeekItemTextActive
                                            : styles.styListWeekItemTextInActive
                                    ]}
                                    value={item}
                                />
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        );
    };

    selectTypeOn = typeOnSelected => {
        const { onNotification } = this.state;

        this.setState({
            onNotification: {
                ...onNotification,
                typeOn: typeOnSelected == onNotification.typeOn ? EnumTimeOn.E_DEFAULT : typeOnSelected
            }
        });
    };

    renderViewOn = () => {
        const { isOnOffNotification, onNotification, weeksSelect } = this.state,
            { timeSetting, typeOn } = onNotification;
        if (!isOnOffNotification) {
            return <View />;
        }

        return (
            <View style={styles.styViewOn}>
                <View style={styles.styViewTitle}>
                    <VnrText
                        style={[styleSheets.lable, styles.styTitle]}
                        i18nKey={'HRM_Notification_On_Manage_Setting'}
                    />
                    <VnrText
                        style={[styleSheets.lable, styles.stySubTitle]}
                        i18nKey={'HRM_Notification_On_Manage_Message_Setting'}
                    />
                </View>

                <TouchableOpacity style={styles.styAction} onPress={() => this.selectTypeOn(EnumTimeOn.E_DAILY)}>
                    <View style={styles.styAction__left}>
                        <View style={styles.styAction__left_text}>
                            <VnrText
                                style={[styleSheets.text, styles.styAction__text]}
                                i18nKey={'ScheduleTask__Daily'}
                            />
                        </View>
                        {typeOn === EnumTimeOn.E_DAILY && (
                            <View style={[styles.styAction__IconRight]}>
                                <IconCheck size={Size.iconSize - 3} color={Colors.primary} />
                            </View>
                        )}
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.styAction} onPress={() => this.selectTypeOn(EnumTimeOn.E_WEEKLY)}>
                    <View style={styles.styAction__left}>
                        <View style={styles.styAction__left_text}>
                            <VnrText
                                style={[styleSheets.text, styles.styAction__text]}
                                i18nKey={'ScheduleTask__Weekly'}
                            />
                        </View>
                        {typeOn === EnumTimeOn.E_WEEKLY && (
                            <View style={[styles.styAction__IconRight]}>
                                <IconCheck size={Size.iconSize - 3} color={Colors.primary} />
                            </View>
                        )}
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.styAction} onPress={() => this.selectTypeOn(EnumTimeOn.E_MONTHLY)}>
                    <View style={styles.styAction__left}>
                        <View style={styles.styAction__left_text}>
                            <VnrText
                                style={[styleSheets.text, styles.styAction__text]}
                                i18nKey={'ScheduleTask__Monthly'}
                            />
                        </View>
                        {typeOn === EnumTimeOn.E_MONTHLY && (
                            <View style={[styles.styAction__IconRight]}>
                                <IconCheck size={Size.iconSize - 3} color={Colors.primary} />
                            </View>
                        )}
                    </View>
                </TouchableOpacity>

                <View style={styles.styViewSlTime}>
                    <View style={styles.styViewTitleTime}>
                        <VnrText
                            style={[styleSheets.text, styles.styTitle]}
                            i18nKey={'HRM_Notification_On_Time_Setting'}
                        />
                    </View>

                    <TouchableOpacity style={styles.styViewSlValue} onPress={this.selectPickerTime}>
                        <Text style={[styleSheets.text, styles.styViewSlTime_text]}>
                            {moment(timeSetting).format('hh:mm')}
                        </Text>
                        <IconTime size={Size.iconSize} color={Colors.gray_5} />
                    </TouchableOpacity>
                    <View style={styles.styPickerhiden}>
                        <VnrDate
                            ref={ref => (this.refTimeNotify = ref)}
                            //  response={'string'}
                            //format={"hh:mm:ss"}
                            value={timeSetting}
                            // refresh={configTimeNotify.refresh}
                            type={'time'}
                            onFinish={value => this.onChangeTimeManager(value)}
                        />
                    </View>
                </View>

                {typeOn === EnumTimeOn.E_WEEKLY && this.renderListWeeks()}
                {typeOn === EnumTimeOn.E_MONTHLY && this.renderListMonths()}
            </View>
        );
    };
    //#endregion

    //#region [Notification Off]
    selectTypeOff = vaue => {
        const { offNotification } = this.state;
        let valueStr = `${vaue.KEY}|${vaue.VALUE}`;

        this.setState({
            offNotification:
                offNotification === valueStr ? `${EnumTimeOff.E_NERVER.KEY}|${EnumTimeOff.E_NERVER.VALUE}` : valueStr
        });
    };

    renderViewOff = () => {
        const { offNotification } = this.state;
        let [typeOff] = offNotification.split('|');
        if (this.state.isOnOffNotification) {
            return <View />;
        }

        return (
            <View style={styles.styViewOff}>
                <View style={styles.styViewTitle}>
                    <VnrText
                        style={[styleSheets.lable, styles.styTitle]}
                        i18nKey={'HRM_Notification_Question_Off_Setting'}
                    />
                </View>

                <TouchableOpacity style={styles.styAction} onPress={() => this.selectTypeOff(EnumTimeOff.E_TOMORROW)}>
                    <View style={styles.styAction__left}>
                        <View style={styles.styAction__left_text}>
                            <VnrText
                                style={[styleSheets.text, styles.styAction__text]}
                                i18nKey={'HRM_Notification_Off_Tomorrow_Setting'}
                            />
                        </View>
                        {typeOff === EnumTimeOff.E_TOMORROW.KEY && (
                            <View style={[styles.styAction__IconRight]}>
                                <IconCheck size={Size.iconSize - 3} color={Colors.primary} />
                            </View>
                        )}
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.styAction} onPress={() => this.selectTypeOff(EnumTimeOff.E_ONE_HOUR)}>
                    <View style={styles.styAction__left}>
                        <View style={styles.styAction__left_text}>
                            <VnrText
                                style={[styleSheets.text, styles.styAction__text]}
                                i18nKey={'HRM_Notification_Off_Onehour_Setting'}
                            />
                        </View>
                        {typeOff === EnumTimeOff.E_ONE_HOUR.KEY && (
                            <View style={[styles.styAction__IconRight]}>
                                <IconCheck size={Size.iconSize - 3} color={Colors.primary} />
                            </View>
                        )}
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.styAction} onPress={() => this.selectTypeOff(EnumTimeOff.E_FOUR_HOUR)}>
                    <View style={styles.styAction__left}>
                        <View style={styles.styAction__left_text}>
                            <VnrText
                                style={[styleSheets.text, styles.styAction__text]}
                                i18nKey={'HRM_Notification_Off_Fourhour_Setting'}
                            />
                        </View>
                        {typeOff === EnumTimeOff.E_FOUR_HOUR.KEY && (
                            <View style={[styles.styAction__IconRight]}>
                                <IconCheck size={Size.iconSize - 3} color={Colors.primary} />
                            </View>
                        )}
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.styAction} onPress={() => this.selectTypeOff(EnumTimeOff.E_NERVER)}>
                    <View style={styles.styAction__left}>
                        <View style={styles.styAction__left_text}>
                            <VnrText
                                style={[styleSheets.text, styles.styAction__text]}
                                i18nKey={'HRM_Notification_Off_Nerver_Setting'}
                            />
                        </View>
                        {typeOff === EnumTimeOff.E_NERVER.KEY && (
                            <View style={[styles.styAction__IconRight]}>
                                <IconCheck size={Size.iconSize - 3} color={Colors.primary} />
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    //#endregion

    render() {
        const { isOnOffNotification, isLoading } = this.state;
        if (isLoading)
            return (
                <View style={styles.container}>
                    <VnrLoading size="large" isVisible={isLoading} />
                </View>
            );

        return (
            <SafeAreaView {...styleSafeAreaView} style={styles.container}>
                {/* <Animated.View
                    style={[styles.styContent,
                        //  { height: this.state.animatedCollap }
                    ]}
                > */}
                <ScrollView
                    ref={ref => (this.refScroll = ref)}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.styScrollList}
                >
                    <View
                        // onLayout={this._setMinHeight.bind(this)}
                        style={styles.styAction}
                        //onPress={() => this.router('ChangePassword')}
                    >
                        <View style={styles.styAction__left}>
                            {/* <View style={styles.styAction__IconRight}>
                                    <IconOffNotify
                                        size={Size.iconSize - 2}
                                        color={Colors.gray_10}
                                    />
                                </View> */}
                            <View style={styles.styAction__left_text}>
                                <VnrText style={[styleSheets.text, styles.styAction__text]} i18nKey={'Notify'} />
                            </View>
                            <Switch
                                trackColor={{ false: Colors.gray_5, true: Colors.primary }}
                                thumbColor={Colors.white}
                                ios_backgroundColor={Colors.gray_5}
                                onValueChange={this.toggleSwitchNotify}
                                value={isOnOffNotification}
                            />
                        </View>
                    </View>

                    <View style={{}} onLayout={this._setMaxHeight.bind(this)}>
                        {this.renderViewOff()}
                        {this.renderViewOn()}
                    </View>
                </ScrollView>
                {/* </Animated.View> */}

                {/* bottom button close, confirm */}
                <View style={styles.styListBnt}>
                    <TouchableOpacity onPress={() => this.undoSetting()} style={styles.stybntCancel}>
                        <VnrText style={[styleSheets.lable]} i18nKey={'CANCEL'} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.saveSetting()} style={styles.stybntSave}>
                        <VnrText style={[styleSheets.lable, styles.styTextBntOk]} i18nKey={'Save'} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
}

const WIDTH_LIST_WEEKS = Size.deviceWidth - Size.defineSpace * 2,
    WIDTH_LIST_WEEKS_ITEM = (WIDTH_LIST_WEEKS - Size.defineSpace * 6) / 7,
    HEIGHT_LINE_ACTION = Size.deviceWidth * 0.13,
    HEIGHT_ACTION = Math.floor(
        HEIGHT_LINE_ACTION < 70 && HEIGHT_LINE_ACTION > 40 ? HEIGHT_LINE_ACTION : HEIGHT_LINE_ACTION > 70 ? 70 : 40
    );

const styles = StyleSheet.create({
    styPickerhiden: {
        position: 'absolute',
        left: -1000
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: Colors.white
    },
    styScrollList: {
        paddingBottom: Size.defineSpace * 2
    },
    styContent: {},
    styListBnt: {
        flexGrow: 1,
        backgroundColor: 'red',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        backgroundColor: Colors.white,
        marginBottom: 10
    },
    stybntCancel: {
        height: Size.heightButton,
        backgroundColor: Colors.borderColor,
        borderRadius: styleSheets.radius_5,
        flex: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Size.defineSpace / 2
    },
    stybntSave: {
        height: Size.heightButton,
        borderRadius: styleSheets.radius_5,
        backgroundColor: Colors.primary,
        flex: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
        paddingHorizontal: Size.defineSpace / 2
    },
    styTextBntOk: {
        color: Colors.white
    },

    styAction: {
        flexDirection: 'row',
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5,
        justifyContent: 'space-between',
        height: HEIGHT_ACTION,
        alignItems: 'center'
    },
    styNoneBorder: {
        borderBottomWidth: 0
    },
    styViewTitle: {
        // paddingVertical: 7,
        justifyContent: 'center',
        marginTop: Size.defineSpace
    },
    styViewTitleTime: {
        justifyContent: 'center',
        marginTop: Size.defineSpace * 1.5
    },
    styViewTitleList: {
        justifyContent: 'center',
        marginTop: Size.defineSpace * 1.5,
        marginBottom: Size.defineSpace
    },
    styTitle: {
        fontSize: Size.textSmall,
        fontWeight: '500'
    },
    stySubTitle: {
        fontSize: Size.textSmall - 1,
        color: Colors.gray_7
    },
    styAction__left: {
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        alignItems: 'center'
    },
    styAction__left_text: {
        flex: 1
    },
    styAction__text: {},
    styAction__IconRight: {
        // width: Size.iconSize + 12,
        marginLeft: Size.defineHalfSpace
    },
    styViewSlTime: {
        // flexDirection: 'row',
        // alignItems: 'center',
        // marginTop: Size.defineSpace
    },
    styViewSlValue: {
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        flexDirection: 'row',
        paddingVertical: Size.defineSpace * 0.7,
        paddingHorizontal: Size.defineSpace,
        width: Size.deviceWidth * 0.4,
        maxWidth: 300,
        borderRadius: 7,
        justifyContent: 'space-between',
        marginTop: Size.defineSpace * 0.5
    },
    styViewSlTime_text: {
        color: Colors.gray_8
        // marginRight: 5
    },
    styListWeek: {
        marginTop: Size.defineHalfSpace,
        width: WIDTH_LIST_WEEKS,
        maxWidth: 800,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    styListWeekItem: {
        width: WIDTH_LIST_WEEKS_ITEM,
        justifyContent: 'center',
        alignItems: 'center',
        height: WIDTH_LIST_WEEKS_ITEM,
        backgroundColor: Colors.gray_3,
        borderRadius: WIDTH_LIST_WEEKS_ITEM / 2,
        maxWidth: 50,
        maxHeight: 50,
        marginBottom: Size.defineHalfSpace
    },
    styListWeekItemActive: {
        backgroundColor: Colors.primary
    },
    styListWeekItemTextActive: {
        fontSize: Size.textSmall,
        color: Colors.white,
        fontWeight: '600'
    },
    styListWeekItemTextInActive: {
        fontSize: Size.textSmall - 1
    },
    styListMonth: {
        marginTop: Size.defineHalfSpace,
        width: WIDTH_LIST_WEEKS,
        flexDirection: 'row',
        flexWrap: 'wrap',
        display: 'flex'
    }
});
