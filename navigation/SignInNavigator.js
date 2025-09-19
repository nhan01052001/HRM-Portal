import { createStackNavigator } from 'react-navigation-stack';
import LoginScene from '../scenes/auth/Login';
import QrScanner from '../scenes/auth/QrScanner';

const SignInNavigator = createStackNavigator(
    {
        SignIn: {
            screen: LoginScene,
            navigationOptions: {
                headerShown: false
            }
        },
        QrScanner: {
            screen: QrScanner,
            navigationOptions: {
                headerShown: false
            }
        }
    },
    {
        initialRouteName: 'SignIn'
    }
);
export default SignInNavigator;
