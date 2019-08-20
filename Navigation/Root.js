import react from 'react';
import {
  createStackNavigator,
  createDrawerNavigator,
  createAppContainer,
  DrawerItems,
  createSwitchNavigator
} from 'react-navigation';

import SignUpEmailPhone from '../Screens/SignUpEmailPhone';
import SignUpFB from '../Screens/SignUpFB';
import ProfileAndUser from '../Screens/ProfileAndUser';
import ChoosedProfilePhoto from '../Screens/ChoosedProfilePhoto';
import ModalChoosePhoto from '../Components/ModalChoosePhoto';
import Camera from '../Screens/Camera';
import Gallary from '../Screens/Gallary';
import Login from '../Screens/Login';
import TabNavigator from './TabNavi';
import store from '../store';

const loginNav = createStackNavigator(
  {
    SignUpEmailPhone: {
      screen: SignUpEmailPhone
    },
    SignUpFB: {
      screen: SignUpFB
    },
    Login: {
      screen: Login,
    },
    ProfileAndUser: {
      screen: ProfileAndUser
    },
    Gallarys: {
      screen: Gallary
    },
    photos: {
      screen: Camera
    },
    ChoosedProfilePhoto: {
      screen: ChoosedProfilePhoto
    },
    ModalChoosePhoto: {
      screen : ModalChoosePhoto
    }
  },
  {
    initialRouteName: 'SignUpFB'
  }
);

const switchNav = createSwitchNavigator({
  login: {
    screen: loginNav
  },
  home: {
    screen: TabNavigator
  }
}
)

export default createAppContainer(switchNav);;
