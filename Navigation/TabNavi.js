import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  I18nManager,
  SafeAreaView,
  Image,
} from 'react-native';
import {
  createStackNavigator,
  createDrawerNavigator,
  createBottomTabNavigator,
  createAppContainer,
  DrawerItems,
  createSwitchNavigator,
  createMaterialTopTabNavigator,

} from 'react-navigation';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from '@react-native-community/async-storage';

import PostsPage from '../Screens/PostsPage';
import Profile from '../Screens/Profile';
import EditProfile from '../Screens/EditProfile';
import Login from '../Screens/Login';
import SignUpFB from '../Screens/SignUpFB';
import Camera from '../Screens/Camera';
import ChoosedPhoto from '../Screens/ChoosedPhoto';
import Gallary from '../Screens/Gallary';
import Search from '../Screens/Search';
import Languages from '../Screens/Languages';
import Likes from '../Screens/Likes';
import Comments from '../Screens/Comments';
import ModalChoosePhoto from '../Components/ModalChoosePhoto';
import ChoosedProfilePhoto from '../Screens/ChoosedProfilePhoto';
import ProfilePost from '../Components/ProfilePost';


const ChoosePhoto = createMaterialTopTabNavigator({
  Gallary:  {
    screen: Gallary,
  },
  camera: {
    screen: Camera,
  },
},{
  tabBarPosition:'bottom',
  animationEnabled: true,
  swipeEnabled: true,
  lazy:true,
  tabBarOptions: {
    showIcon: true,
    activeTintColor: '#000',
    inactiveTintColor: '#999999',
    style: {
      backgroundColor: '#FFF',
    },
    labelStyle: {
      textAlign: 'center',
      color: 'black',
      fontSize: 16,
      fontWeight: 'bold'
    },
    indicatorStyle: {
      borderBottomColor: '#FFFFFF',
      borderBottomWidth: 2,
    },
  }
});


const HomeStack = createStackNavigator({
  PostsPage: {
    screen: PostsPage,
    navigationOptions: {
        header: null,
    },
  },
  Likes: {
    screen: Likes
  },
  Comments: {
    screen: Comments
  },
  Profile: {
    screen: Profile
  }
});

const BridgeStack = createStackNavigator({
  ChoosePhoto: {
    screen: ChoosePhoto,
    navigationOptions: ({ navigation }) => ({
      header: null
    }),
  },
  ChoosedPhoto: {
    screen: ChoosedPhoto
  }

});
const SearchStack = createStackNavigator({
  search: {
    screen: Search,
  },
  searchProfile: {
    screen: Profile
  }
});

const TabNavigator = createMaterialTopTabNavigator({
  Posts:  {
    screen: HomeStack,
    navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="home" size={30} color={tintColor} />
        ),
        tabBarLabel: () => {
          <View></View>
        },
      },
  },
  Search: {
    screen: SearchStack,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (
        <Icon name="search" size={25} color={tintColor} />
      ),
      tabBarLabel: () => {
        <View></View>
      }
    },
  },
  UP: {
    screen: BridgeStack,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (
        <Icon name="plus-square" size={30} color={tintColor} />
      ),
      tabBarLabel: () => {
        <View></View>
      },
      //tabBarVisible: false,

    },
  },
  ProfileStack: {
    screen: Profile,
    navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="user" size={30} color={tintColor} />
        ),
        tabBarLabel: () => {
          <View></View>
        }
      },
  },
},{
  tabBarPosition:'bottom',
  animationEnabled: true,
  swipeEnabled: false,
  lazy:true,
  tabBarOptions: {
 showIcon: true,
  activeTintColor: '#000',
  inactiveTintColor: '#999999',
  style: {
    backgroundColor: '#FFF',
  },
  labelStyle: {
    textAlign: 'center',
  },
  indicatorStyle: {
    borderBottomColor: '#FFFFFF',
    borderBottomWidth: 2,
  },
}
});


const CustomDrawerComponent = props => (
  <SafeAreaView style={{flex: 1}}>
    <TouchableOpacity style={{marginTop: hp('1%'),marginHorizontal: wp('3%')}} onPress={()=>{props.navigation.navigate('Languages')}}>
      <Text style={{fontSize: wp('5%'),color: 'black',fontWeight: 'bold' }}>Languages</Text>
    </TouchableOpacity>
    <View style={{marginTop: hp('2%'),width: wp('100%'),borderTopWidth: .6,}} />
    <TouchableOpacity style={{marginTop: hp('2%'),marginHorizontal: wp('3%')}}
      onPress={()=>{
        AsyncStorage.removeItem("uid").then(data=>{
            props.navigation.navigate("login");
          }
        )}}
      >
      <Text style={{fontSize: wp('5%'),color: 'black',fontWeight: 'bold' }}>Logout</Text>
    </TouchableOpacity>
  </SafeAreaView>
)

const DrawNavi = createDrawerNavigator({
  home: {
    screen: TabNavigator,
    navigationOptions: {
      header: null
    }
  }
},{
  drawerPosition:I18nManager.isRTL ? 'left' : 'right',
  drawerType:'slide',
  drawerLockMode: 'locked-closed',
  contentComponent: CustomDrawerComponent,

});
const DrawerStack = createStackNavigator({
  home: {
    screen: DrawNavi,
    navigationOptions: {
      header: null
    }
  },
  Languages: {
    screen: Languages,
  }
});



const HomeNavi = createStackNavigator({
  tab: {
    screen: DrawerStack,
    navigationOptions: ({navigation}) => ({
      header: null,
    })
  },
  EditProfile: {
    screen: EditProfile,
  },
  ChangeProfilePhoto:{
    screen: ModalChoosePhoto,
  },
  Gallarys: {
    screen: Gallary,
  },
  cameras: {
    screen: Camera,
  },
  ChoosedProfilePhoto: {
    screen: ChoosedProfilePhoto,
  },
  Post: {
    screen: ProfilePost,
  },
  Languages: {
    screen: Languages,
  },
  testLikes: {
    screen: Likes
  },
  testComments: {
    screen: Comments
  },
});


export default HomeNavi;
