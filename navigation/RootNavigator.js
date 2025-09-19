import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import PermissionScene from '../scenes/permission/Permission';
import { TransitionPresets } from 'react-navigation-stack';
import ErrorScreen from '../scenes/common/ErrorScreen';
import SignInNavigator from './SignInNavigator';
import ChangePassword from '../scenes/auth/ChangePassword';
import ForgotPassword from '../scenes/auth/ForgotPassword';
import TabarBottom from './TabarNavigatior';
import ChangePasswordV3 from '../scenes/auth/changePasswordV3/ChangePasswordV3';

const switchNav = createSwitchNavigator(
    {
        Permission: PermissionScene,
        Main: TabarBottom,
        Login: SignInNavigator,
        UpdatePassword: ChangePassword,
        UpdatePasswordV3: ChangePasswordV3,
        ForgotPassword: ForgotPassword,
        ErrorScreen: ErrorScreen
    },
    {
        initialRouteName: 'Permission',
        headerMode: 'none',
        defaultNavigationOptions: {
            gestureEnabled: true,
            cardOverlayEnabled: true,
            ...TransitionPresets.SlideFromRightIOS
        }
    }
);

const AppRootContainer = createAppContainer(switchNav);
export default AppRootContainer;
