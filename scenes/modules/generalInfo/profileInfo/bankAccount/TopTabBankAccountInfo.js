import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import BankAccountConfirmed from './bankAccountConfirmed/BankAccountConfirmed';
import BankAccountConfirm from './bankAccountConfirm/BankAccountConfirm';
import { translate } from '../../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ScreenName } from '../../../../../assets/constant';
import RenderTopTab from '../../../../../navigation/tabar/RenderTopTab';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

let data = [
    {
        title: 'HRM_Common_Confirm',
        screenName: ScreenName.BankAccountConfirmed
    },
    {
        title: 'HRM_Common_WaitingConfirm',
        screenName: ScreenName.BankAccountConfirm
    }
];

const TopTabBankAccountInfo = createMaterialTopTabNavigator(
    {
        BankAccountConfirmed: {
            screen: BankAccountConfirmed,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_Common_Confirm')
        },
        BankAccountConfirm: {
            screen: BankAccountConfirm,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_Common_WaitingConfirm')
        }
    },
    {
        lazy: true,
        swipeEnabled: false,
        tabBarComponent: navigationAll => {

            let perTabConfirmed = true,
                perTabWaitConfirm = true;
            if (
                PermissionForAppMobile &&
                (!PermissionForAppMobile.value['BankAccount_Info_Index_BankAccount_InfoGird'] ||
                    !PermissionForAppMobile.value['BankAccount_Info_Index_BankAccount_InfoGird']['View'])
            ) {
                data = data.filter(item => item.screenName !== ScreenName.BankAccountConfirmed);
                perTabConfirmed = false;
            }

            if (
                PermissionForAppMobile &&
                (!PermissionForAppMobile.value['BankAccount_Request_Add_Index_BankAccount_Request_AddGird'] ||
                    !PermissionForAppMobile.value['BankAccount_Request_Add_Index_BankAccount_Request_AddGird']['View'])
            ) {
                data = data.filter(item => item.screenName !== ScreenName.BankAccountConfirm);
                perTabWaitConfirm = false;
            }

            if ((perTabConfirmed || perTabWaitConfirm) && Array.isArray(data) && data.length > 0) {
                return (
                    // <View style={[styles.containTab]}>
                    //     <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}
                    //         contentContainerStyle={[styles.styScroll, { width: 'auto' }]}
                    //         ref={ref => scrollView = ref}
                    //     >
                    //         {
                    //             data.map((value, i) => {
                    //                 return (
                    //                     <TouchableOpacity
                    //                         disabled={data.length === 1 ? true : false}
                    //                         activeOpacity={0.6}
                    //                         style={[styles.tabStyle, index == i && styles.styleTabActive, !isOverSize && { width: (Size.deviceWidth / data.length) - (Size.defineSpace) }]}
                    //                         onPress={() => {
                    //                             if (scrollView) {
                    //                                 if (i > data.length / 2)
                    //                                     scrollView.scrollToEnd({ animated: true });
                    //                                 else
                    //                                     scrollView.scrollTo({ x: ((i * 100) / 2), y: 0, animated: true });
                    //                             }
                    //                             navigation.navigate(value.screenName);
                    //                         }
                    //                         }>
                    //                         <VnrText
                    //                             i18nKey={value.title}
                    //                             numberOfLines={numberOfLines}
                    //                             style={[styleSheets.text, index == i ? styles.text_colorSecondary : styles.text_colorGray, { textAlign: 'center', }]}
                    //                             onTextLayout={(e) => {
                    //                                 const { lines } = e.nativeEvent;
                    //                                 if (lines.length > numberOfLines) {
                    //                                     isOverSize = true;
                    //                                 }
                    //                             }}
                    //                         />
                    //                     </TouchableOpacity>
                    //                 )
                    //             })
                    //         }
                    //     </ScrollView>
                    // </View >
                    <RenderTopTab data={data} navigationAll={navigationAll} />
                );
            } else {
                return <View />;
            }
        }
    }
);

export default TopTabBankAccountInfo;
