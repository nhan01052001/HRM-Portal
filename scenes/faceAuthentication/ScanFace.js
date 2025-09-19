/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Modal,
    ScrollView,
    PixelRatio,
    Platform
} from 'react-native';

import { IconCancel } from '../../constants/Icons';
import DrawerServices from '../../utils/DrawerServices';
import { VnrLoadingSevices } from '../../components/VnrLoading/VnrLoadingPages';
import { IconPrev } from '../../constants/Icons';
import Vnr_Function from '../../utils/Vnr_Function';
import { Colors, Size, styleSheets } from '../../constants/styleConfig';
import HttpService from '../../utils/HttpService';
import { EnumName } from '../../assets/constant';

const DATA_IMAGE = [
    {
        id: 1,
        path: 'https://firebasestorage.googleapis.com/v0/b/upload-image-f8fdc.appspot.com/o/image1.png?alt=media&token=9a5279e5-8c2d-4119-b890-d08cb39d717f'
    },
    {
        id: 2,
        path: 'https://firebasestorage.googleapis.com/v0/b/upload-image-f8fdc.appspot.com/o/image2.png?alt=media&token=02032639-dbf1-4ae9-a763-e14b94a125fb'
    },
    {
        id: 3,
        path: 'https://firebasestorage.googleapis.com/v0/b/upload-image-f8fdc.appspot.com/o/image3.png?alt=media&token=9ff7f4f8-67b4-45c1-8073-6122ab3bc661'
    },
    {
        id: 4,
        path: 'https://firebasestorage.googleapis.com/v0/b/upload-image-f8fdc.appspot.com/o/image31.png?alt=media&token=43a70715-c147-46aa-b99e-b1d85041bdc6'
    },
    {
        id: 5,
        path: 'https://firebasestorage.googleapis.com/v0/b/upload-image-f8fdc.appspot.com/o/image4.png?alt=media&token=d1e4a75a-62bb-49ac-8e58-a7820608e6bb'
    }
];

const DATA_SKILL_AND_CETIFICATION = [
    {
        id: 1,
        name: 'Đại học công nghệ thông tin'
    },
    {
        id: 2,
        name: 'ECBA'
    },
    {
        id: 3,
        name: 'UX/UI'
    },
    {
        id: 4,
        name: 'Ielts 7.0'
    },
    {
        id: 5,
        name: 'React Native'
    },
    {
        id: 6,
        name: 'Back-end .Net'
    },
    {
        id: 6,
        name: 'Angular'
    },
    {
        id: 7,
        name: 'React Js'
    },
    {
        id: 8,
        name: 'AWS Cloud'
    },
    {
        id: 9,
        name: 'Firebase Cloud'
    },
    {
        id: 10,
        name: 'DevOps'
    },
    {
        id: 11,
        name: 'Tiến sĩ phần mềm'
    },
    {
        id: 12,
        name: 'Thạc sĩ phần mềm'
    }
];

class ScanFace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            file: null,
            sizeImage: {
                width: 0,
                height: 0
            },
            modalVisible: false,
            dataChoose: null
        };
    }

    getDataItem = () => {
        try {
            const { file, data, orientation } = this.props?.navigation?.state?.params;

            if (file && file?.uri) {
                Image.getSize(file?.uri, (width, height) => {
                    this.setState({
                        dataSource: data,
                        file: file,
                        sizeImage: {
                            width,
                            height
                        },
                        isImageHorizontal:
                            (orientation?.deviceOrientation === 3 && orientation?.pictureOrientation === 3) ||
                            (orientation?.deviceOrientation === 4 && orientation?.pictureOrientation === 4)
                                ? true
                                : false,
                        numberHorizontal:
                            orientation?.pictureOrientation === orientation?.deviceOrientation
                                ? orientation?.deviceOrientation
                                : 0
                    });
                });
            }
        } catch (error) {
            // go to screen error
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    componentDidMount() {
        this.getDataItem();
    }

    getRandomNumber = () => {
        return Math.floor(Math.random() * 11);
    };

    randomOrg = (fullName) => {
        // if (fullName == null || fullName == '') {
        //     return {
        //         FirstCharName: '',
        //         PrimaryColor: Colors.white,
        //         SecondaryColor: Colors.white
        //     }
        // }

        let strFull = fullName.split(' - ')[0].trim(),
            splFull = strFull.split(' '),
            strFirstName = splFull[splFull.length - 1],
            strFirst = strFirstName.charAt(0).toUpperCase();

        let colours = [
                {
                    name1: 'Phòng ban R&D',
                    name2: 'Front-end Developer'
                },
                {
                    name1: 'Phòng ban Sal',
                    name2: 'Back-end Developer'
                },
                {
                    name1: 'Phòng ban Hre',
                    name2: 'Back-end Developer'
                },
                {
                    name1: 'Phòng ban Att',
                    name2: 'Back-end Developer'
                },
                {
                    name1: 'Phòng ban Ins&Tax',
                    name2: 'Back-end Developer'
                },
                {
                    name1: 'Phòng ban App',
                    name2: 'Front-end Developer'
                },
                {
                    name1: 'Phòng ban PE',
                    name2: 'Customer Support'
                },
                {
                    name1: 'Phòng ban CS',
                    name2: 'Customer Support'
                },
                {
                    name1: 'Phòng ban Designer',
                    name2: 'UX/UI Designer'
                },
                {
                    name1: 'Phòng ban QC',
                    name2: 'Qualiton Control'
                },
                {
                    name1: 'Phòng ban App',
                    name2: 'Front-end Developer'
                },
                {
                    name1: 'Phòng ban R&D',
                    name2: 'UX/UI Designer'
                },
                {
                    name1: 'Phòng ban SE',
                    name2: 'FullStack Developer'
                },
                {
                    name1: 'Phòng ban Sal',
                    name2: 'Back-end Developer'
                },
                {
                    name1: 'Phòng ban R&D',
                    name2: 'Front-end Developer'
                }
            ],
            nameSplit = strFirst,
            charIndex = '',
            initials = '',
            colourIndex = 0;

        initials = nameSplit[nameSplit.length - 1].charAt(0); //+ nameSplit[1].charAt(0);
        charIndex = (initials == '?' ? 72 : initials.charCodeAt(0)) - 14;
        colourIndex = charIndex % 20;

        return {
            ...colours[colourIndex - 1]
        };
    };

    getDataUser = (item) => {
        const split = item.name.split('|');
        const dataBody = {
            ProfileID: split[3]
        };

        VnrLoadingSevices.show();
        HttpService.Post('[URI_CENTER]/api/Hre_ProfileAPI/GetProfileDetailPortalByID', dataBody).then((response) => {
            VnrLoadingSevices.hide();
            if (response && response.Status == EnumName.E_SUCCESS) {
                const avatar = split[1] ? '[URI_MAIN]/Images/' + split[1] : '';
                let data = {
                    ...response.Data,
                    Email: split[2],
                    ProfileID: split[3]
                };
                if (
                    response.Data['New_Hre_ProfilePersonalDetailModel'] &&
                    response.Data['New_Hre_ProfilePersonalDetailModel'][0]
                ) {
                    data = {
                        ...data,
                        ...response.Data['New_Hre_ProfilePersonalDetailModel'][0],
                        ImagePath: avatar ? HttpService.handelUrl(avatar) : null
                    };
                }

                this.setState({
                    modalVisible: true,
                    dataChoose: data
                });
            }
        });
    };

    convertPxTodpOrPoint = (px) => {
        if (Platform.OS == 'android') {
            const DPI = PixelRatio.get() * 160;
            return px / (DPI / 160);
        } else {
            const scaleFactor = PixelRatio.get();
            return px / scaleFactor;
        }
    };

    render() {
        const { dataSource, file, sizeImage, modalVisible, dataChoose, isImageHorizontal } =
            this.state;
        let arraySaveTempValue = [];

        return file && file?.uri ? (
            <View
                style={{
                    flex: 1
                }}
            >
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        top: 35,
                        left: 10,
                        width: 58,
                        height: 58,
                        borderRadius: 13,
                        backgroundColor: '#080808',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 100,
                        elevation: 100
                    }}
                    activeOpacity={0.8}
                    onPress={() => DrawerServices.navigate('Home')}
                >
                    <IconPrev size={32} color={'#fff'} />
                </TouchableOpacity>
                {dataSource.map((item, index) => {
                    let caculatorLeft = null;
                    let caculatorTop = null;
                    let caculatorRight = null;
                    let lastName = null;
                    let { width, height } = sizeImage;

                    if (isImageHorizontal) {
                        // top lay left , left lay bottom
                        const percentTop = (item?.rectangle?.left / width) * 100,
                            precentRight = (item?.rectangle?.top / height) * 100;

                        caculatorTop = (Size.deviceheight * percentTop) / 100;
                        caculatorRight = (Size.deviceWidth * precentRight) / 100;
                    } else {
                        const percentTop = (item?.rectangle?.top / height) * 100,
                            precentLeft = (item?.rectangle?.left / width) * 100;

                        caculatorTop = (Size.deviceheight * percentTop) / 100;
                        caculatorLeft = (Size.deviceWidth * precentLeft) / 100;

                        // caculatorLeft = this.convertPxTodpOrPoint(item?.rectangle?.left);
                        // caculatorTop = this.convertPxTodpOrPoint(item?.rectangle?.top);
                    }

                    if (caculatorLeft < 0) {
                        caculatorLeft += 70;
                    }

                    if (caculatorTop < 0) {
                        caculatorLeft += 70;
                    }

                    if (caculatorRight < 0) {
                        caculatorRight += 70;
                    }

                    if (item?.name && typeof item?.name === 'string') {
                        const split = item.name.split('|');
                        const fullName = split[0] ? split[0] : split[0];
                        const strFull = fullName.split(' - ')[0].trim(),
                            splFull = strFull.split(' ');

                        lastName = splFull[splFull.length - 1];
                    }
                    // console.log(pixelRatio, item?.rectangle?.left, Size.deviceheight, Size.deviceWidth);
                    // console.log(caculatorTop);

                    return (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            key={index}
                            style={[
                                {
                                    position: 'absolute',
                                    elevation: 100,
                                    zIndex: 100,

                                    flexDirection: 'row',
                                    backgroundColor: '#444444',
                                    paddingHorizontal: 5,
                                    paddingVertical: 3,
                                    borderRadius: 5,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                },
                                isImageHorizontal
                                    ? {
                                        top: caculatorTop - 30,
                                        right: caculatorRight,
                                        transform: [{ rotate: '90deg' }]
                                    }
                                    : {
                                        top: caculatorTop,
                                        left: caculatorLeft - 20
                                    }
                            ]}
                            onPress={() => {
                                this.getDataUser(item);
                            }}
                        >
                            <Text
                                style={[
                                    styleSheets.text,
                                    {
                                        color: Colors.white,
                                        marginRight: 5,
                                        fontSize: 12
                                    }
                                ]}
                            >
                                {lastName ? lastName : ''}
                            </Text>
                            <Image
                                source={require('../test/war.png')}
                                style={{ width: 18, height: 18, marginBottom: 1 }}
                            />
                        </TouchableOpacity>
                    );
                })}

                {isImageHorizontal ? (
                    <Image
                        // source={require('./z5613096316914_c672d47166c866dbba84de3c5d10c2f6.jpg')}
                        // source={{
                        //     uri: 'https://firebasestorage.googleapis.com/v0/b/upload-image-f8fdc.appspot.com/o/Avatar%2Fdoibong2.jpg?alt=media&token=ca6ef922-6e8b-4d88-b3a6-df0f10a8b87d',
                        // }}
                        source={{
                            uri: file.uri
                        }}
                        style={[
                            {
                                width: '100%',
                                height: '100%',
                                aspectRatio: 1,
                                alignSelf: 'center',
                                transform: [{ rotate: '90deg' }]
                            }
                        ]}
                        resizeMode={'contain'}
                    />
                ) : (
                    <Image
                        source={{
                            uri: file.uri
                        }}
                        style={[
                            {
                                width: '100%',
                                height: '100%'
                            }
                        ]}
                        resizeMode={'stretch'}
                    />
                )}

                {/* */}

                {dataChoose && (
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible} //modalVisible
                        onRequestClose={() => {
                            this.setState({ modalVisible: false });
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: '#fff',
                                marginTop: 35
                            }}
                        >
                            <View
                                style={{
                                    backgroundColor: '#FAFAFA',
                                    paddingHorizontal: 12,
                                    // paddingVertical: 12,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Image source={require('../test/idcard.png')} />
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight: '600',
                                            marginLeft: 8
                                        }}
                                    >
                                        Thông tin nhân viên
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={{
                                        padding: 12
                                    }}
                                    onPress={() => {
                                        this.setState({ modalVisible: false });
                                    }}
                                >
                                    <IconCancel color="#000" size={18} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView
                                style={{
                                    flex: 1
                                }}
                            >
                                {/* Nhân viên */}
                                <View
                                    style={{
                                        marginHorizontal: 12
                                    }}
                                >
                                    <View
                                        style={{
                                            marginVertical: 12
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: '600'
                                            }}
                                        >
                                            Nhân viên
                                        </Text>
                                    </View>

                                    <View>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center'
                                            }}
                                        >
                                            {Vnr_Function.renderAvatarCricleByName(
                                                dataChoose.ImagePath,
                                                dataChoose.ProfileName,
                                                56
                                            )}

                                            <View
                                                style={{
                                                    marginLeft: 8
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: 16,
                                                        fontWeight: '600',
                                                        marginBottom: 2
                                                    }}
                                                >
                                                    {dataChoose.ProfileName}
                                                </Text>

                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        flexWrap: 'wrap',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            paddingHorizontal: 6,
                                                            paddingVertical: 2,
                                                            backgroundColor: '#f5f5f5',
                                                            borderRadius: 8,
                                                            alignSelf: 'baseline',
                                                            marginRight: 6,
                                                            marginTop: 2
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                fontSize: 14,
                                                                fontWeight: '600'
                                                            }}
                                                        >
                                                            {dataChoose.PositionName ? dataChoose.PositionName : ''}
                                                        </Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            paddingHorizontal: 6,
                                                            paddingVertical: 2,
                                                            backgroundColor: '#f5f5f5',
                                                            borderRadius: 8,
                                                            alignSelf: 'baseline',
                                                            marginRight: 6,
                                                            marginTop: 2
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                fontSize: 14,
                                                                fontWeight: '600'
                                                            }}
                                                        >
                                                            {dataChoose.E_UNIT ? dataChoose.E_UNIT : ''}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {/* Liên hệ */}
                                <View
                                    style={{
                                        marginHorizontal: 12
                                    }}
                                >
                                    <View
                                        style={{
                                            marginVertical: 12
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: '600'
                                            }}
                                        >
                                            Liên hệ
                                        </Text>
                                    </View>

                                    <View>
                                        {/* <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginVertical: 4,
                                            }}
                                        >
                                            <View
                                                style={{
                                                    width: 30,
                                                    height: 30,
                                                    borderRadius: 30,
                                                    backgroundColor: '#f5f5f5',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: 8,
                                                }}
                                            >
                                                <Image source={require('../test/phone.png')} />
                                            </View>

                                            <View>
                                                <Text
                                                    style={{
                                                        fontSize: 16,
                                                        fontWeight: '400',
                                                    }}
                                                >
                                                    {dataChoose?.CodeTax ? dataChoose?.CodeTax : ''}
                                                </Text>
                                            </View>
                                        </View> */}

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginVertical: 4
                                            }}
                                        >
                                            <View
                                                style={{
                                                    width: 30,
                                                    height: 30,
                                                    borderRadius: 30,
                                                    backgroundColor: '#f5f5f5',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: 8
                                                }}
                                            >
                                                <Image source={require('../test/mail.png')} />
                                            </View>

                                            <View>
                                                <Text
                                                    style={{
                                                        fontSize: 16,
                                                        fontWeight: '400'
                                                    }}
                                                >
                                                    {dataChoose?.Email ? dataChoose?.Email : ''}
                                                </Text>
                                            </View>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginVertical: 4
                                            }}
                                        >
                                            <View
                                                style={{
                                                    width: 30,
                                                    height: 30,
                                                    borderRadius: 30,
                                                    backgroundColor: '#f5f5f5',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: 8
                                                }}
                                            >
                                                <Image source={require('../test/name.png')} />
                                            </View>

                                            <View>
                                                <Text
                                                    style={{
                                                        fontSize: 16,
                                                        fontWeight: '400'
                                                    }}
                                                >
                                                    {`${dataChoose.PlaceOfBirthName ? dataChoose.PlaceOfBirthName + ', ' : ''}${dataChoose.NationalityName ? dataChoose.NationalityName : ''}`}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {/* Tương tác */}
                                <View
                                    style={{
                                        marginHorizontal: 12
                                    }}
                                >
                                    <View
                                        style={{
                                            marginVertical: 12
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: '600'
                                            }}
                                        >
                                            Tương tác
                                        </Text>
                                    </View>

                                    <View>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginVertical: 4
                                            }}
                                        >
                                            <View
                                                style={{
                                                    // width: 42,
                                                    // height: 42,
                                                    borderRadius: 100,
                                                    backgroundColor: '#f5f5f5',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: 8
                                                }}
                                            >
                                                <Image source={require('../test/giaoviec.png')} />
                                            </View>

                                            <View>
                                                <Text
                                                    style={{
                                                        fontSize: 16,
                                                        fontWeight: '400'
                                                    }}
                                                >
                                                    Giao việc
                                                </Text>
                                            </View>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginVertical: 4
                                            }}
                                        >
                                            <View
                                                style={{
                                                    // width: 42,
                                                    // height: 42,
                                                    borderRadius: 100,
                                                    backgroundColor: '#f5f5f5',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: 8
                                                }}
                                            >
                                                <Image source={require('../test/khenngoi.png')} />
                                            </View>

                                            <View>
                                                <Text
                                                    style={{
                                                        fontSize: 16,
                                                        fontWeight: '400'
                                                    }}
                                                >
                                                    Khen ngợi
                                                </Text>
                                            </View>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginVertical: 4
                                            }}
                                        >
                                            <View
                                                style={{
                                                    // width: 42,
                                                    // height: 42,
                                                    borderRadius: 100,
                                                    backgroundColor: '#f5f5f5',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: 8
                                                }}
                                            >
                                                <Image source={require('../test/trochuyen.png')} />
                                            </View>

                                            <View>
                                                <Text
                                                    style={{
                                                        fontSize: 16,
                                                        fontWeight: '400'
                                                    }}
                                                >
                                                    Trò chuyện
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {/* Trực thuộc */}
                                <View
                                    style={{
                                        marginHorizontal: 12
                                    }}
                                >
                                    <View
                                        style={{
                                            marginVertical: 12
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: '600'
                                            }}
                                        >
                                            Trực thuộc
                                        </Text>
                                    </View>

                                    <View
                                        style={{
                                            paddingVertical: 8,
                                            backgroundColor: '#f5f5f5',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center'
                                            }}
                                        >
                                            {DATA_IMAGE.map((item, index) => {
                                                return (
                                                    <View
                                                        key={index}
                                                        style={[
                                                            {
                                                                width: 32,
                                                                height: 32,
                                                                borderRadius: 32,
                                                                borderColor: '#fff',
                                                                borderWidth: 2,
                                                                backgroundColor: '#f5f5f5',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            },
                                                            index !== 0 && { marginLeft: -8 }
                                                        ]}
                                                    >
                                                        <Image
                                                            source={{
                                                                uri: item.path
                                                            }}
                                                            style={{
                                                                width: 32,
                                                                height: 32,
                                                                borderRadius: 32,
                                                                borderColor: '#fff',
                                                                borderWidth: 2
                                                            }}
                                                        />
                                                    </View>
                                                );
                                            })}
                                            <View
                                                style={[
                                                    {
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: 32,
                                                        borderColor: '#fff',
                                                        borderWidth: 2,
                                                        backgroundColor: '#f1f1f1',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        marginLeft: -8
                                                    }
                                                ]}
                                            >
                                                <Text
                                                    style={{
                                                        color: '#000',
                                                        fontSize: 16,
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    +2
                                                </Text>
                                            </View>
                                        </View>

                                        <View
                                            style={{
                                                marginVertical: 8
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: '600'
                                                }}
                                            >
                                                {dataChoose.OrgStructureName ? dataChoose.OrgStructureName : ''}
                                            </Text>
                                        </View>

                                        <View>
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    fontWeight: '400'
                                                }}
                                            >
                                                7 nhân viên
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Xem chi tiết hồ sơ nhân viên */}
                                <View
                                    style={{
                                        marginHorizontal: 12
                                    }}
                                >
                                    <TouchableOpacity
                                        style={{
                                            paddingVertical: 12,
                                            marginVertical: 12,
                                            backgroundColor: '#f5f5f5',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        onPress={() => {
                                            DrawerServices.navigate('ScanFaceViewDetail', {
                                                dataItem: dataChoose
                                            });

                                            this.setState({
                                                modalVisible: false,
                                                dataChoose: null
                                            });
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: '400'
                                            }}
                                        >
                                            Xem chi tiết hồ sơ nhân viên
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Kỹ năng & Chứng chỉ */}
                                <View
                                    style={{
                                        marginHorizontal: 12
                                    }}
                                >
                                    <View
                                        style={{
                                            marginVertical: 12
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: '600'
                                            }}
                                        >
                                            Kỹ năng & Chứng chỉ
                                        </Text>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            flexWrap: 'wrap',
                                            alignItems: 'center'
                                        }}
                                    >
                                        {[1, 2, 3, 4, 5].map((item, index) => {
                                            let numbeRandom = this.getRandomNumber();
                                            if (!arraySaveTempValue.includes(numbeRandom)) {
                                                arraySaveTempValue.push(numbeRandom);
                                                return (
                                                    <View
                                                        key={index}
                                                        style={{
                                                            paddingHorizontal: 6,
                                                            paddingVertical: 2,
                                                            backgroundColor: '#f5f5f5',
                                                            borderRadius: 8,
                                                            alignSelf: 'baseline',
                                                            marginRight: 6,
                                                            marginTop: 2,
                                                            marginBottom: 4
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                fontSize: 14,
                                                                fontWeight: '600'
                                                            }}
                                                        >
                                                            {DATA_SKILL_AND_CETIFICATION[numbeRandom].name}
                                                        </Text>
                                                    </View>
                                                );
                                            }
                                        })}
                                    </View>
                                </View>

                                {/* Biểu đồ năng lực */}
                                <View
                                    style={{
                                        marginHorizontal: 12
                                    }}
                                >
                                    <View
                                        style={{
                                            marginVertical: 12
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: '600'
                                            }}
                                        >
                                            Biểu đồ năng lực
                                        </Text>
                                    </View>

                                    <View
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Image source={require('../test/bieudonangluc.png')} />
                                    </View>
                                </View>

                                {/* Xem lộ trình phát triển */}
                                <View
                                    style={{
                                        marginTop: 12,
                                        marginHorizontal: 12
                                    }}
                                >
                                    <TouchableOpacity
                                        style={{
                                            paddingVertical: 12,
                                            marginVertical: 12,
                                            backgroundColor: '#f5f5f5',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: '400'
                                            }}
                                        >
                                            Xem lộ trình phát triển
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {/* end */}
                                <View
                                    style={{
                                        paddingBottom: 35
                                    }}
                                />
                            </ScrollView>
                        </View>
                    </Modal>
                )}
            </View>
        ) : (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Text>No data</Text>
            </View>
        );
    }
}

export default ScanFace;
