import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Size, styleSheets, styleVnrListItem } from '../../../../../constants/styleConfig';
import moment from 'moment';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { translate } from '../../../../../i18n/translate';
import RenderItem from './RenderItem';

const characters = '************';

export default class HreWorkHistoryListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.isLock !== this.props.isLock;
    }

    render() {
        const { dataItem, isLock, index, length } = this.props;
        let objValue = {
            lable: null,
            obj1: {
                lable: null,
                value: {
                    valueOld: null,
                    valueNew: null
                }
            },
            obj2: {
                lable: null,
                value: {
                    valueOld: null,
                    valueNew: null
                }
            },
            obj3: {
                lable: null,
                value: {
                    valueOld: null,
                    valueNew: null
                }
            },
            rootDataItem: null
        };

        let lsData = [];
        if (Array.isArray(dataItem?.DataDetail)) {
            dataItem?.DataDetail.map((item) => {
                if (item?.TableData === 'Hre_WorkHistory') {
                    // Quá trình công tác
                    objValue = {
                        lable: translate('HRM_PortalApp_WorkProcess'),
                        obj1: {
                            lable: translate('HRM_PortalApp_TypeOfTransfer'),
                            value: {
                                valueOld: null,
                                valueNew: item?.TypeOfTransferName
                            }
                        },
                        obj2: {
                            lable: translate('HRM_Portal_Button_Working_History'),
                            value: {
                                valueOld: item?.JobTitleOld,
                                valueNew: item?.JobTitleName
                            }
                        },
                        obj3: {
                            lable: translate('HRM_PortalApp_BasicSalary'),
                            value: {
                                valueOld: item?.GrossAmountCurrencyName_Old
                                    ? isLock
                                        ? characters
                                        : `${item?.GrossAmountCurrencyName_Old}`
                                    : null,
                                valueNew: item?.GrossAmountCurrencyName
                                    ? isLock
                                        ? characters
                                        : `${item?.GrossAmountCurrencyName}`
                                    : null
                            }
                        },
                        rootDataItem: item
                    };
                } else if (item?.TableData === 'Hre_Reward') {
                    // khen thưởng
                    objValue = {
                        lable: translate('ModuleFunction__E_REWARD'),
                        obj1: {
                            lable: translate('HRM_HR_Reward_RewardedTypeID'),
                            value: {
                                valueOld: null,
                                valueNew: item?.RewardedTypeName
                            }
                        },
                        obj2: {
                            lable: translate('HRM_HR_Reward_RewardValue'),
                            value: {
                                valueOld: null,
                                valueNew: item?.RewardCurrencyName
                                    ? isLock
                                        ? characters
                                        : Vnr_Function.formatNumber(item?.RewardCurrencyName)
                                    : null
                            }
                        },
                        obj3: null,
                        rootDataItem: item
                    };
                } else if (item?.TableData === 'Hre_ConCurrent') {
                    // kiêm nhiệm
                    objValue = {
                        lable: translate('ModuleFunction__E_CONCURRENT'),
                        obj1: {
                            lable: translate('HRM_HR_Discipline_DecisionNo'),
                            value: {
                                valueOld: null,
                                valueNew: item?.DecisionNoConCurrent
                            }
                        },
                        obj2: {
                            lable: translate('HRM_PortalApp_DepartmentConcurrent'),
                            value: {
                                valueOld: null,
                                valueNew: item?.OrgStructureNameConCurrent
                            }
                        },
                        obj3: {
                            lable: translate('HRM_HR_Profile_JobTitleName_CON'),
                            value: {
                                valueOld: item?.JobTitleOld,
                                valueNew: item?.JobTitleName
                            }
                        },
                        rootDataItem: item
                    };
                } else if (item?.TableData === 'Hre_Discipline') {
                    // kỷ luật
                    objValue = {
                        lable: translate('ModuleFunction__E_DISCIPLINE'),
                        obj1: {
                            lable: translate('HRM_HR_Reward_RewardedTypeID'),
                            value: {
                                valueOld: null,
                                valueNew: item?.DisciplinedTypesName
                            }
                        },
                        obj2: {
                            lable: translate('HRM_CountDiscipline'),
                            value: {
                                valueOld: null,
                                valueNew: item?.CountDis
                            }
                        },
                        obj3: {
                            lable: translate('HRM_PortalApp_DisciplineReson'),
                            value: {
                                valueOld: null,
                                valueNew: item?.DisciplineReson
                            }
                        },
                        rootDataItem: item
                    };
                } else if (item?.TableData === 'Hre_Accident') {
                    // tai nạn
                    objValue = {
                        lable: translate('HRM_Hr_Hre_IsCopyAccident'),
                        obj1: {
                            lable: translate('HRM_PortalApp_TypeOfAccident'),
                            value: {
                                valueOld: null,
                                valueNew: item?.AccidentTypeName
                            }
                        },
                        obj2: {
                            lable: translate('HRM_PortalApp_AccidentTime'),
                            value: {
                                valueOld: null,
                                valueNew: item?.TimeHappen
                            }
                        },
                        obj3: null,
                        rootDataItem: item
                    };
                } else if (item?.TableData === 'Sal_BasicSalary') {
                    // lương
                    objValue = {
                        lable: translate('HRM_PortalApp_SalaryLevel'),
                        obj1: {
                            lable: translate('HRM_PortalApp_BasicSalary'),
                            value: {
                                valueOld: item?.SalGrossAmountCurrencyName_Old
                                    ? isLock
                                        ? characters
                                        : `${item?.SalGrossAmountCurrencyName_Old}`
                                    : null,
                                valueNew: item?.SalGrossAmountCurrencyName
                                    ? isLock
                                        ? characters
                                        : `${item?.SalGrossAmountCurrencyName}`
                                    : null
                            }
                        },
                        obj2: null,
                        obj3: null,
                        rootDataItem: item
                    };
                }

                lsData.push({ ...objValue });
            });
        }

        return (
            <View style={[styles.swipeable]}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ height: '100%', alignItems: 'center' }}>
                        <View
                            style={{
                                backgroundColor: '#fff',
                                width: 16,
                                height: 16,
                                borderRadius: 16,
                                borderWidth: 1.5,
                                borderColor: '#BFBFBF',
                                marginTop: Size.defineSpace / 2 - 3
                            }}
                        />
                        <View
                            style={[
                                {
                                    width: 1,
                                    backgroundColor: '#BFBFBF'
                                },
                                index === length - 1
                                    ? {
                                          flex: 1
                                      }
                                    : {
                                          height: '100%'
                                      }
                            ]}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ paddingLeft: Size.defineSpace / 2, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[styleSheets.text]}>
                                {dataItem?.DateEffect ? moment(dataItem?.DateEffect).format('DD/MM/YYYY') : ''}
                            </Text>
                            <View style={{ flex: 1, height: 1, backgroundColor: '#BFBFBF', marginLeft: 8 }} />
                        </View>
                        <ScrollView style={{ paddingLeft: Size.defineSpace / 2 }}>
                            {lsData.map((item) => {
                                return (
                                    <RenderItem
                                        item={item}
                                        isLock={isLock}
                                        dateEffect={dataItem?.DateEffect}
                                        characters={characters}
                                        dataFilter={this.props?.dataFilter}
                                    />
                                );
                            })}
                        </ScrollView>
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
        paddingHorizontal: Size.defineSpace,
        marginTop: 10
    },
    swipeableLayout: {
        flex: 1,
        borderRadius: 8,
        backgroundColor: Colors.white,
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        position: 'relative'
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: PADDING_DEFINE,
        marginBottom: PADDING_DEFINE / 2
    },
    viewStatusBottom: {
        paddingVertical: PADDING_DEFINE / 2,
        paddingHorizontal: PADDING_DEFINE,
        borderTopColor: Colors.gray_5,
        borderTopWidth: 0.5,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    lineSatus: {
        paddingHorizontal: 3,
        borderRadius: styleSheets.radius_5,
        alignItems: 'center',
        // backgroundColor: Colors.volcano_1,
        // borderColor: Color.rgb(18, 13, 224, 0.5),
        borderWidth: 0.5,
        paddingVertical: 2,
        paddingHorizontal: PADDING_DEFINE
        // backgroundColor: Color.rgb(18, 13, 224, 0.04),
    },
    dateTimeSubmit: {
        alignSelf: 'flex-end'
    },

    lineSatus_text: {
        fontSize: Size.text - 3,
        // color: Colors.volcano,
        fontWeight: '500'
    },

    txtstyleStatus: {
        color: Colors.white,
        fontWeight: '600'
    },

    viewButton: {
        flex: 1,
        backgroundColor: Colors.whiteOpacity70,
        borderRadius: 10,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    viewButtonIOS: {
        flex: 1,
        borderRadius: 10,
        marginBottom: 13,
        marginHorizontal: 10,
        shadowColor: Colors.black,
        backgroundColor: '#f3f2f2',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.2,
        shadowRadius: 5.46,
        elevation: 8
    },
    leftBody: {
        // flex: 2.5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightColor: Colors.borderColor,
        borderRightWidth: 0.5
    },
    styleSizeTexthours: {
        fontSize: Size.text + 2
    },
    Line: {
        flex: 1,
        // flexDirection: "row",
        justifyContent: 'center',
        // marginBottom: 5,
        backgroundColor: Colors.primary_transparent_8,
        paddingHorizontal: PADDING_DEFINE / 2,
        paddingVertical: PADDING_DEFINE / 2,
        borderRadius: 8,
        marginTop: 3
    },
    viewDateNotWorking: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    dateTimeSubmit_Text: {
        fontSize: Size.text - 3,
        color: Colors.gray_10
    },
    viewDateNotWorking_value: {
        fontSize: Size.text - 1,
        color: Colors.primary,
        fontWeight: '500'
    },
    viewDateNotWorking_lable: {
        fontSize: Size.text - 2,
        marginRight: PADDING_DEFINE / 2
    },
    viewDateReason: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center'
    },
    viewValue: {
        flex: 1
    },
    profileText: {
        fontSize: Size.text + 3,
        fontWeight: '600'
    },
    positionText: {
        color: Colors.gray_7
    },
    leftContent: {
        paddingHorizontal: PADDING_DEFINE
    },
    contentRight: {
        flex: 7.2,
        justifyContent: 'flex-start',
        paddingRight: PADDING_DEFINE
    },
    actionRight: {
        position: 'absolute',
        top: 0,
        right: -Size.defineSpace,
        height: '100%',
        justifyContent: 'center'
    },
    actionRight_icon: {
        // width: 16
    },
    leftContentButton: {
        maxWidth: 120,
        maxHeight: 135
    },
    leftContentIconView: {
        borderRadius: 18
    },
    leftContentIcon: {
        width: Size.deviceWidth * 0.23,
        height: Size.deviceWidth * 0.25,
        resizeMode: 'cover',
        maxWidth: 120,
        maxHeight: 130,
        borderRadius: 18
    },
    circle: {
        width: Size.deviceWidth * 0.23,
        height: Size.deviceWidth * 0.25,
        maxWidth: 120,
        maxHeight: 130,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 18,
        borderWidth: 0.5,
        borderColor: Colors.primary
    }
});

const stylesSheetAction = StyleSheet.create({
    bnt_icon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        height: '37%',
        width: Size.deviceWidth * 0.16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Size.defineSpace * 0.5
    },
    viewIcon: {
        marginHorizontal: Size.defineSpace
    }
});
