import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RNRestart from "react-native-restart";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import I18n from '../src/utils/I18n';


export default class Languages extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${I18n.t('language')}`,
    headerStyle: {
      backgroundColor: '#FAFAFA',
    },
    headerTintColor: '#000',
  });

  constructor(props){
    super(props);
    this.state={
      lang:I18n.locale
    }
  }

  handleLanguageChange = (lang) => {
		AsyncStorage.setItem("lang", lang)
			.then(data => {
				RNRestart.Restart();
			})
			.catch(err => {
				alert(err.message);
			});
	}

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.touch} onPress={()=>this.handleLanguageChange('en')}>
          <Text style={styles.txt} >Engilsh</Text>
          {this.state.lang.slice(0,2)=='en' && <Image style={styles.img} source={require('../icons/right.png')}/>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.touch}  onPress={()=>this.handleLanguageChange('ar')}>
          <Text style={styles.txt} >العربية</Text>
          {this.state.lang.slice(0,2)=='ar' && <Image style={styles.img} source={require('../icons/right.png')}/>}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: wp('3%'),
  },
  touch: {
    marginTop: hp('4%'),
    flexDirection: 'row',

  },
  txt: {
    fontSize: wp('5%'),
    color: 'black',
    fontWeight: 'bold'
  },
  img: {
    width: wp('5%'),
    height: hp('4%'),
    marginHorizontal: wp('2%'),
  }
});
