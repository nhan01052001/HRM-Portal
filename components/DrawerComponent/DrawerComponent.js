import React, { Component } from 'react';
import { SafeAreaView } from 'react-navigation';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import { Colors, styleSheets, Size, CustomStyleSheet } from '../../constants/styleConfig';
import { IconDown, IconUp } from '../../constants/Icons';
import ItemMenu from './ItemMenu';
import { dataVnrStorage } from '../../assets/auth/authentication';
import DrawerServices from '../../utils/DrawerServices';
import { ConfigDrawer } from '../../assets/configProject/ConfigDrawer';
import VnrText from '../VnrText/VnrText';

const eNum = {
    E_SHOW_MORE: 'E_SHOW_MORE',
    E_SHOW_LESS: 'E_SHOW_LESS',
    E_LOGOUT: 'E_LOGOUT',
    E_GROUP: 'E_GROUP',
    E_CHANGE_LANGUAGE: 'E_CHANGE_LANGUAGE'
};

const api = {};
export const DrawerApi = api;

export default class drawerContentComponents extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            numberRow: 6,
            dataDrawer: [],
            stateGroupShowMore: {},
            isvisibleModalLanguage: false,
            reloadDawer: true
        };
    }

    numberRowGroup = 4;

    router = (roouterName, params) => {
        DrawerServices.navigate(roouterName, params);
    };

    initView = () => {
        const _ConfigDrawer = ConfigDrawer.value;
        return _ConfigDrawer.map((elementMenu, index) => {
            if (elementMenu.type == eNum.E_GROUP) {
                return <View style={styles.styleBorderGroup}>{this.renderGroup(elementMenu)}</View>;
            } else if (elementMenu.type == eNum.E_LOGOUT || elementMenu.type == eNum.E_CHANGE_LANGUAGE) {
                return (
                    <ItemMenu
                        type={elementMenu.type}
                        title={elementMenu.title}
                        urlIcon={elementMenu.urlIcon}
                        screenName={elementMenu.screenName}
                        screenCreate={elementMenu.screenCreate != undefined ? elementMenu.screenCreate : null}
                        touchMenu={elementMenu.touchMenu ? elementMenu.touchMenu : null}
                    />
                );
            } else {
                return this.renderItem(elementMenu, index);
            }
        });
    };

    lessAndShow = titleGroup => {
        const { stateGroupShowMore } = this.state;
        if (stateGroupShowMore[titleGroup]) {
            stateGroupShowMore[titleGroup]['isShowAll'] = !stateGroupShowMore[titleGroup]['isShowAll'];
            this.setState({ stateGroupShowMore });
        } else {
            let newItemGroup = {
                [titleGroup]: { isShowAll: true }
            };
            this.setState({
                stateGroupShowMore: { ...stateGroupShowMore, ...newItemGroup }
            });
        }
    };

    renderGroup = elementMenu => {
        try {
            const { stateGroupShowMore } = this.state;
            if (elementMenu.listGroup && elementMenu.listGroup.length > 0) {
                let runShortOfMenu = [],
                    configShowMore = [
                        {
                            type: eNum.E_SHOW_MORE,
                            title: 'HRM_Common_Showmore',
                            titleGroup: elementMenu.title
                        }
                    ],
                    configShowLess = [
                        {
                            type: eNum.E_SHOW_LESS,
                            title: 'HRM_Common_Showless',
                            titleGroup: elementMenu.title
                        }
                    ];
                runShortOfMenu = elementMenu.listGroup.slice(0, this.numberRowGroup);
                if (elementMenu.listGroup.length > this.numberRowGroup) {
                    if (
                        stateGroupShowMore[elementMenu.title] &&
                        stateGroupShowMore[elementMenu.title]['isShowAll'] == true
                    ) {
                        runShortOfMenu = [
                            ...runShortOfMenu,
                            ...configShowLess,
                            ...elementMenu.listGroup.slice(this.numberRowGroup)
                        ];
                    } else {
                        runShortOfMenu = [...runShortOfMenu, ...configShowMore];
                    }
                }

                // if(stateGroupShowMore[elementMenu.title] && stateGroupShowMore[elementMenu.title]['isShowAll'] == true ){
                //   runShortOfMenu = [...runShortOfMenu, ...elementMenu.listGroup.slice(this.numberRowGroup)];
                // }

                return runShortOfMenu.map(subGroup => {
                    return this.renderItem(subGroup);
                });
            } else {
                return <View />;
            }
        } catch (error) {
            return <View />;
        }
    };

    renderItem = item => {
        try {
            if (item.type == eNum.E_SHOW_LESS) {
                return (
                    <TouchableOpacity
                        onPress={() => this.lessAndShow(item.titleGroup)}
                        style={styles.BackgroundIconShowMore}
                    >
                        <IconUp color={Colors.gray_10} size={Size.iconSize} />
                        <View style={styles.viewLable}>
                            <VnrText i18nKey={item.title} style={styles.lableStyle} />
                        </View>
                    </TouchableOpacity>
                );
            } else if (item.type == eNum.E_SHOW_MORE) {
                return (
                    <TouchableOpacity
                        onPress={() => this.lessAndShow(item.titleGroup)}
                        style={styles.BackgroundIconShowMore}
                    >
                        <IconDown color={Colors.gray_10} size={Size.iconSize} />
                        <View style={styles.viewLable}>
                            <VnrText i18nKey={item.title} style={styles.lableStyle} />
                        </View>
                    </TouchableOpacity>
                );
            } else {
                let _screenCreate = null;

                if (item['screenName'] && item['screenName'] == 'ProfileInfo') {
                    item.title = dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info.FullName : '';
                    item.urlIcon = item.urlIcon != null ? item.urlIcon : dataVnrStorage.currentUser.info.ImagePath;
                    _screenCreate = {
                        screenName: 'Home',
                        title: 'home',
                        colorType: Colors.success
                    };
                    return (
                        <View style={styles.styleBorderGroup}>
                            <ItemMenu
                                nav={item}
                                type={item.type}
                                title={item.title}
                                urlIcon={item.urlIcon}
                                screenName={item.screenName}
                                screenCreate={_screenCreate}
                            />
                        </View>
                    );
                } else {
                    if (item['screenCreate']) {
                        _screenCreate = item['screenCreate'];
                    }

                    return (
                        <ItemMenu
                            nav={item}
                            type={item.type}
                            title={item.title}
                            urlIcon={item.urlIcon}
                            screenName={item.screenName}
                            screenCreate={_screenCreate}
                        />
                    );
                }
            }
        } catch (error) {
            return <View />;
        }
    };

    componentDidMount() {
        api.reloadDrawer = this.reloadDrawer.bind(this);
    }

    reloadDrawer = () => {
        this.setState({
            reloadDawer: !this.state.reloadDawer
        });
    };

    showhideModalLanguage = () => {
        DrawerServices.closeDrawer();
        this.setState({ isvisibleModalLanguage: !this.state.isvisibleModalLanguage });
    };

    hideModalLanguage = () => {
        this.setState({ isvisibleModalLanguage: false });
    };

    render() {
        return (
            <SafeAreaView style={CustomStyleSheet.flex(1)}>
                <ScrollView showsVerticalScrollIndicator={false} bounces={false} style={styles.container}>
                    <View style={styles.menu}>{this.initView()}</View>
                </ScrollView>
                {/* View Modal language */}
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Colors.white,
        paddingHorizontal: styleSheets.m_10
    },
    menu: {
        flex: 1,
        backgroundColor: Colors.white
    },
    BackgroundIconShowMore: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        backgroundColor: Colors.greyPrimaryConstraint,
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        marginBottom: 10,
        paddingLeft: 5
    },
    viewLable: {
        flex: 1,
        marginLeft: 20
    },
    lableStyle: {
        fontSize: Size.text
    },
    styleBorderGroup: {
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5
    }
});
