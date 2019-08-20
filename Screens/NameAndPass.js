import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import I18n from '../src/utils/I18n';
import {firebaseApp} from './firebase';
import AsyncStorage from '@react-native-community/async-storage';


export default class NameAndPass extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state={
      email: props.navigation.state.params.email,
      name: '',
      password: '123456',
      showpassword: true,
    }
  }
  changeShowPass = ()=>{
    this.setState({showpassword: !this.state.showpassword});
  }

  setinAsync = (key,val) => {
    AsyncStorage.setItem(key,val)
    .then(data=>{

    }).catch((error)=>{
      alert(error.message);
    })
  }

  signUP = () => {
    firebaseApp.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then((data)=>{
      this.setinAsync('uid',data.user.uid);
    })
    .catch((error)=>{
      Alert.alert("Error",error.message)
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{I18n.t('name').toUpperCase()} {I18n.t('And')} {I18n.t('password').toUpperCase()}</Text>
        <TextInput
          placeholder={I18n.t('fullname')}
          style={styles.txtInput}
          />
        <View style={{flexDirection: 'row'}}>
          <TextInput
            secureTextEntry={this.state.password==''  ? false : this.state.showpassword}
            placeholder={I18n.t('password')}
            style={styles.txtInput}
            />
          <TouchableOpacity style={styles.showPassContainer} onPress={this.changeShowPass}>
            <Image style={styles.showPass} source={require('../icons/showpassword.png')}/>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.contBtn} activeOpacity={1} onPress={this.signUP}>
          <Text style={styles.contTxt}>{I18n.t('continue')}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA'
  },
  title: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: 'black',
    marginBottom: hp('5%'),
  },
  txtInput: {
    width: wp('80%'),
    height: wp('13%'),
    borderWidth: 0.2,
    marginBottom: hp('3%'),
    paddingLeft: wp('3%'),
    backgroundColor: '#ECECEC',
    fontSize: wp('4%'),
    color: 'black'

  },
  showPass: {
    justifyContent: 'center',
    width: wp('6%'),
    height: hp('4.5%'),
  },
  showPassContainer: {
    position: 'absolute',
    left: wp('72%'),
    top: hp('2%'),
  },
  contBtn: {
    width: wp('80%'),
    backgroundColor: '#0053FF',
    height: hp('7%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('1%')
  },
  contTxt: {
    color: 'white',
    fontSize: wp('4%'),
  }
});
