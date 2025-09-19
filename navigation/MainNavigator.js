import { createDrawerNavigator } from 'react-navigation-drawer';
import drawerContentComponents from '../components/DrawerComponent/DrawerComponent';
import { Size } from '../constants/styleConfig';
import TabarBottom from './TabarNavigatior';

const DrawerNavigator = createDrawerNavigator(
    {
        TabarBottom: {
            screen: TabarBottom
        }
    },
    {
        contentComponent: drawerContentComponents,
        drawerWidth: Size.deviceWidth * 0.85,
        headerMode: 'none'
    }
);
export default DrawerNavigator;
