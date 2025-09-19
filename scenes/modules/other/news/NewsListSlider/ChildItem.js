import React from 'react';
import { Image, StyleSheet, View, Text, ScrollView, Platform } from 'react-native';
import { Size, Colors, styleSheets } from '../../../../../constants/styleConfig';
import { IconDate } from '../../../../../constants/Icons';
import { WebView } from 'react-native-webview';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import { EnumName } from '../../../../../assets/constant';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import Vnr_Function from '../../../../../utils/Vnr_Function';
export default class ChildItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            datahandel: null,
            isReload: false
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.refreshSlider !== this.props.refreshSlider || nextState.isReload !== this.state.isReload;
    }

    validURL = (str) => {
        // eslint-disable-next-line no-useless-escape
        var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
        if (!regex.test(str)) {
            //   alert("Please enter valid URL.");
            return false;
        } else {
            return true;
        }
    };

    renderPDF = (item) => {
        const { local, imageKey } = this.props;

        let urlFilePDF = item[imageKey],
            INJECTED_JAVASCRIPT = '',
            makeId = Vnr_Function.MakeId(10);

        if (Platform.OS == 'android') {
            urlFilePDF = `https://docs.google.com/gview?embedded=true&url=${urlFilePDF}?v=${makeId}`;
            INJECTED_JAVASCRIPT = `(function() {
                if(document.getElementsByClassName('ndfHFb-c4YZDc-GSQQnc-LgbsSe ndfHFb-c4YZDc-to915-LgbsSe VIpgJd-TzA9Ye-eEGnhe ndfHFb-c4YZDc-LgbsSe') &&
                document.getElementsByClassName('ndfHFb-c4YZDc-GSQQnc-LgbsSe ndfHFb-c4YZDc-to915-LgbsSe VIpgJd-TzA9Ye-eEGnhe ndfHFb-c4YZDc-LgbsSe')[0]
                ){
                    document.getElementsByClassName('ndfHFb-c4YZDc-GSQQnc-LgbsSe ndfHFb-c4YZDc-to915-LgbsSe VIpgJd-TzA9Ye-eEGnhe ndfHFb-c4YZDc-LgbsSe')[0].style.display='none';
                }
              })();`;
        }

        return (
            <View style={[styles.pdfContent]}>
                <WebView
                    style={{ backgroundColor: Colors.white }}
                    cacheEnabled={false}
                    source={local ? urlFilePDF : { uri: urlFilePDF }}
                    scalesPageToFit={Platform.OS === 'android' ? false : true}
                    incognito={true}
                    startInLoadingState={true}
                    javaScriptEnabled={true}
                    injectedJavaScript={INJECTED_JAVASCRIPT}
                    scrollEnabled={true}
                    renderLoading={() => (
                        <View style={styles.styWebViewLoading}>
                            <VnrLoading size={'large'} />
                        </View>
                    )}
                    onLoad={() => {}}
                />
            </View>
        );
    };

    getImageSize = (filePath) => {
        return new Promise((resolve, reject) => {
            Image.getSize(
                filePath,
                (width, height) => {
                    resolve({ width, height });
                },
                (error) => reject(error)
            );
        });
    };

    handelData = async () => {
        const { dataItem, imageKey, local } = this.props;
        if (dataItem.ListFile && Array.isArray(dataItem.ListFile) && dataItem.ListFile.length > 0) {
            const list = dataItem.ListFile;

            const anAsyncFunction = async (item) => {
                const { uriMain } = dataVnrStorage.apiConfig;
                if (item.TypeFile === 'E_IMAGE') {
                    let urlFilePDF = item[imageKey];
                    if (!local && !this.validURL(urlFilePDF)) {
                        urlFilePDF = `${uriMain}${urlFilePDF}`;
                    }
                    item[imageKey] = urlFilePDF;
                    const { width, height } = await this.getImageSize(item[imageKey]);
                    item.width = width;
                    item.height = height;
                } else {
                    let urlFilePDF = item[imageKey];
                    if (!local && !this.validURL(urlFilePDF)) {
                        urlFilePDF = `${uriMain}${urlFilePDF}`;
                    }
                    item[imageKey] = urlFilePDF;
                    item.width = 0;
                    item.height = 0;
                }

                return Promise.resolve(item);
            };
            const getData = async () => {
                return Promise.all(list.map((item) => anAsyncFunction(item)));
            };

            dataItem.ListFile = await getData();
            this.setState({ datahandel: dataItem, isReload: !this.state.isReload });
        } else {
            this.setState({ datahandel: EnumName.E_EMPTYDATA, isReload: !this.state.isReload });
        }
    };

    componentDidMount() {
        this.handelData();
    }

    renderListImg = () => {
        const { local, imageKey } = this.props,
            { datahandel } = this.state;

        if (datahandel.ListFile && Array.isArray(datahandel.ListFile) && datahandel.ListFile.length > 0) {
            if (datahandel.ListFile.length == 1) {
                const file = datahandel.ListFile[0];
                if (file.TypeFile === 'E_IMAGE' && file.height) {
                    return (
                        <Image
                            style={[
                                styles.image,
                                {
                                    height: file.height * (Size.deviceWidth / file.width)
                                }
                            ]}
                            source={local ? file[imageKey] : { uri: file[imageKey] }}
                        />
                    );
                } else {
                    return this.renderPDF(file, '100%');
                }
            } else {
                return (
                    <ScrollView contentContainerStyle={[styles.imgContent]} showsVerticalScrollIndicator={true}>
                        {datahandel.ListFile.map((file) => {
                            if (file.TypeFile === 'E_IMAGE' && file.height) {
                                return (
                                    <Image
                                        style={[
                                            styles.image,
                                            {
                                                height: file.height * (Size.deviceWidth / file.width)
                                            }
                                        ]}
                                        source={local ? file[imageKey] : { uri: file[imageKey] }}
                                    />
                                );
                            } else {
                                return this.renderPDF(file, Size.deviceheight * 0.7);
                            }
                        })}
                    </ScrollView>
                );
            }
        }
    };

    render() {
        const { onPress, index } = this.props,
            { datahandel } = this.state;

        let viewContent = (
            <View style={styles.viewLoading}>
                <VnrLoading size={'large'} />
            </View>
        );

        if (datahandel == EnumName.E_EMPTYDATA) {
            viewContent = (
                <View style={styles.viewLoading}>
                    <EmptyData messageEmptyData={'EmptyData'} />
                </View>
            );
        } else if (datahandel != null) {
            viewContent = this.renderListImg();
        }

        return (
            <View
                // activeOpacity={1}
                style={styles.container}
                onPress={() => {
                    typeof onPress == 'function' && onPress(index);
                }}
            >
                {datahandel != null && datahandel.NewsTitle != null && datahandel.NewsTitle != '' && (
                    <View style={styles.viewTitle}>
                        <Text style={[styleSheets.textFontMedium, styles.viewTitle_text]}>{datahandel.NewsTitle}</Text>
                        <View style={styles.viewDate}>
                            <IconDate size={Size.text} color={Colors.gray_7} />
                            <Text style={[styleSheets.text, styles.viewTitle_date]}>{datahandel.PostingDateView}</Text>
                        </View>
                    </View>
                )}

                {viewContent}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    styWebViewLoading: { alignSelf: 'center' },
    viewLoading: {
        width: Size.deviceWidth,
        height: '100%'
    },
    container: {
        backgroundColor: Colors.white
    },
    pdfContent: {
        width: '100%',
        height: '100%',
        marginTop: 12
    },
    imgContent: {
        width: Size.deviceWidth,
        paddingHorizontal: Size.defineSpace
    },
    image: {
        width: Size.deviceWidth - Size.defineSpace * 2,
        marginBottom: Size.defineSpace
    },
    viewTitle: {
        width: Size.deviceWidth - Size.defineSpace * 2,
        paddingVertical: 10,
        marginHorizontal: Size.defineSpace,
        marginTop: 12,
        borderRadius: 11
    },
    viewTitle_text: {
        color: Colors.gray_10,
        fontSize: Size.text + 7,
        fontWeight: '600'
    },
    viewDate: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    viewTitle_date: {
        fontSize: Size.text - 2,
        marginLeft: 3,
        color: Colors.gray_7
    }
});
