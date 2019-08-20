import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import I18n from '../src/utils/I18n';
import {firebaseApp} from './firebase';
import AsyncStorage from '@react-native-community/async-storage';
import store from '../store' ;
import Spinner from 'react-native-loading-spinner-overlay';

export default class SignUpEmailPhone extends Component {

  static navigationOptions = {
    header: null,
  };


  constructor(props) {
    super(props);
    this.state={
      phone: {
        borderBottomColor: 'black',
        borderBottomWidth: 3
      },
      email: {
        borderBottomColor: '#999999',
        borderBottomWidth: 1
      },
      phoneTxtColor : 'black',
      emailTxtColor : '#999999',
      phoneClicked: true,
      next: false,
      emailTxt: '',
      phoneTxt: '',
      password: '',
      showpassword: false,
      spinner: false,
    }
  }

  setinAsync = (key,val) => {
    AsyncStorage.setItem(key,val)
    .then(data=>{

    }).catch((error)=>{
      alert(error.message);
    })
  }
  signUP = () =>{
    if (this.state.phoneClicked){
      alert("Not available singup with phone , try by email");
    }else{
      this.setState({spinner: true},()=>{
        firebaseApp.auth().createUserWithEmailAndPassword(this.state.emailTxt, this.state.password)
        .then((data)=>{
          this.setinAsync('uid',data.user.uid);
          store.setState({uid: data.user.uid})
          this.setState({spinner: false},()=>{
            this.props.navigation.navigate('ProfileAndUser',{uid: data.user.uid});
          });

        })
        .catch((error)=>{
          this.setState({spinner: false})
          Alert.alert("Error",error.message)
        });
      })
    }
  }

  changeShowPass = ()=>{
    this.setState({showpassword: !this.state.showpassword});
  }
  phoneClick = ()=>{
    const clicked = {
      borderBottomColor: 'black',
      borderBottomWidth: 3
    }
    const notClicked = {
      borderBottomColor: '#999999',
      borderBottomWidth: 1
    }
    this.setState({emailTxt: '',phoneClicked: true,phone: clicked,email: notClicked,phoneTxtColor: 'black',emailTxtColor:'#999999',test: "doen"});
  }
  emailClick = ()=>{
    const clicked = {
      borderBottomColor: 'black',
      borderBottomWidth: 3
    }
    const notClicked = {
      borderBottomColor: '#999999',
      borderBottomWidth: 1
    }
    this.setState({phoneTxt: '',phoneClicked: false,phone: notClicked,email: clicked,phoneTxtColor: '#999999',emailTxtColor: 'black',test: "doen"});
  }

  render() {
    return (
      <KeyboardAvoidingView style={{flex:1}}  behavior={Platform.OS === "ios" ? "padding" : null}>
        <View style={styles.container}>
          <Spinner
            visible={this.state.spinner}
            textStyle={styles.spinnerTextStyle}
            />
          <Image style={{width: wp('60%'),height: hp('40%'),}} source={require('../icons/user.png')} />
          <View style={{flexDirection: 'row' }}>
            <TouchableOpacity style={[styles.touch,this.state.phone]} onPress={this.phoneClick} activeOpacity={1}>
              <Text style={[styles.touchTxt,{color: this.state.phoneTxtColor}]}>{I18n.t('PHONE')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.touch,this.state.email]} onPress={this.emailClick} activeOpacity={1}>
              <Text style={[styles.touchTxt,{color: this.state.emailTxtColor}]}>{I18n.t('EMAIL')}</Text>
            </TouchableOpacity>
          </View>
          {this.state.phoneClicked &&
            <TextInput
              placeholder= {I18n.t('PHONE')}
              style={styles.txtInput}
              keyboardType='numeric'
              value={this.state.phoneTxt}
              onChangeText={(phoneTxt)=>{this.setState({phoneTxt})}}
              />
          }
          {!this.state.phoneClicked &&
              <TextInput
                placeholder= {I18n.t('EMAIL')}
                style={styles.txtInput}
                keyboardType='email-address'
                value={this.state.emailTxt}
                onChangeText={(emailTxt)=>{this.setState({emailTxt})}}
                />
          }
          <View style={{flexDirection: 'row'}}>
            <TextInput
              secureTextEntry={this.state.password==''  ? false : !this.state.showpassword}
              onChangeText={(password)=>{this.setState({password})}}
              value={this.state.password}
              placeholder={I18n.t('password')}
              style={styles.txtInput}
              />
            <TouchableOpacity style={styles.showPassContainer} onPress={this.changeShowPass}>
              <Image style={styles.showPass} source={require('../icons/showpassword.png')}/>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.nextBtn} disabled={this.state.next} onPress={this.signUP}>
            <Text style={styles.nextTxt}>{I18n.t('next')}</Text>
          </TouchableOpacity>

          <View style={{ flex : 1 }} />
          <View style={styles.footer}>
            <View style={{width: wp('100%'),borderWidth:.5,marginBottom: hp('1%')}}></View>
            <TouchableOpacity style={styles.TouchableOpacityLogin} activeOpacity={1} onPress={()=>{this.props.navigation.navigate('Login')}}>
              <Text>{I18n.t("haveAccount")}? <Text style={{fontWeight: 'bold',color: 'black'}}>{I18n.t("login")}</Text></Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  touch: {
    width: wp('45%'),
    height: hp('7%'),
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  touchTxt: {
    fontSize: wp('6%'),
    fontWeight: '400',
    color: '#999999'
  },
  txtInput: {
    width: wp('90%'),
    borderWidth: 1,
    marginTop: hp('3%'),
    paddingLeft: wp('4%'),
    height: hp('7%'),
  },
  nextBtn: {
    width: wp('90%'),
    backgroundColor: '#3B5999',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('2%'),
    height: wp('11%'),
    borderRadius: wp('1%'),
  },
  nextTxt: {
    color: 'white',
    fontSize: wp('6%'),
  },
  footer: {
    alignItems: 'center'
  },
  TouchableOpacityLogin: {
    height: hp('5%'),
    width: wp('100%'),
    alignItems: 'center'
  },
  showPass: {
    justifyContent: 'center',
    width: wp('6%'),
    height: hp('4.5%'),
  },
  showPassContainer: {
    position: 'absolute',
    left: wp('80%'),
    top: hp('4%'),
  },
});
