import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Picker,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import I18n from '../src/utils/I18n';
import {firebaseApp} from './firebase';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import store from '../store';
import RNRestart from "react-native-restart";

export default class Login extends Component {

  static navigationOptions = ({navigation})=>({
    header: null,
  })

  constructor(props) {
    super(props);
    this.state= {
      spinner: false,
      lang: I18n.locale.slice(0,2),
      fbname: ' facebook',
      email: '',
      password: '',
    }
  }
  setinAsync = (key,val) => {
    AsyncStorage.setItem(key,val)

  }

  changelocal = (lang) => {
		AsyncStorage.setItem("lang", lang)
			.then(data => {
				RNRestart.Restart();
			})
			.catch(err => {
				alert(err.message);
			});
	}

  signin = ()=>{
    this.setState({spinner:true});
      const { email, password } = this.state;
      firebaseApp.auth().signInWithEmailAndPassword(email, password)
      .then((userdata)=>{
        this.setinAsync('uid',userdata.user.uid);
        var db = firebaseApp.firestore();
        db.collection("users").where("uid", "==", userdata.user.uid)
        .get()
        .then(querySnapshot =>{
          if (querySnapshot.docs.length){
            store.setState({
              name:querySnapshot.docs["0"].data().name,
              imgURL:querySnapshot.docs["0"].data().imgURL,
              usrName:querySnapshot.docs["0"].data().usrName,
              bio: querySnapshot.docs["0"].data().bio,
              uid: userdata.user.uid,
            })
            this.setState({spinner:false});
            this.props.navigation.navigate('home');
          }else{
            store.setState({
              uid: userdata.user.uid,
            })
            this.setState({spinner:false});
            this.props.navigation.navigate('ProfileAndUser');
          }
        }).then(()=>{
        })
        .catch(error=> {
          this.setState({spinner:false});
          alert(error.message);
        });

      }).catch((error)=>{
        this.setState({spinner:false});
        alert(error.message);
      });

  }


  render() {
    return (
      <KeyboardAvoidingView style={{flex:1}}  behavior={Platform.OS === "ios" ? "padding" : null}>
        <View style={{flex: 1,alignItems: 'center',justifyContent: 'flex-end', paddingHorizontal: wp('6%')}}>
          <Spinner
            visible={this.state.spinner}
            textStyle={styles.spinnerTextStyle}
            />
            <View style={{alignItems: 'center' }}>
              <Picker
                selectedValue={this.state.lang}
                style={{alignItems: 'center', height: hp('5%'), width: wp('28.5%')}}
                onValueChange={(itemValue, itemIndex) => {
                  this.changelocal(itemValue);
                }}
                >
                <Picker.Item label="English" value="en" />
                <Picker.Item label="Arabic" value="ar" />
              </Picker>
            </View>
            <View style={{alignItems: 'center'}}>
              <Image
                style={styles.instagramLogo}
                source={require('../icons/instagram-logo.png')}
                resizeMode='contain'
              />
            </View>
              <TextInput
                style={styles.txtinput}
                placeholder={I18n.t("phoneOrEmailOrUsername")}
                onSubmitEditing={()=>{this.password.focus();}}
                blurOnSubmit={false}
                value={this.state.email}
                onChangeText={(email)=>{this.setState({email})}}
                />
              <TextInput
                style={styles.txtinput}
                secureTextEntry
                value={this.state.password}
                placeholder={I18n.t("password")}
                ref={(input)=>{this.password=input;}}
                onChangeText={(password)=>{this.setState({password})}}
                />
              <TouchableOpacity style={styles.loginBtn} activeOpacity={.6} onPress={this.signin}>
              <Text style={styles.loginTxt}>{I18n.t('login')}</Text>
            </TouchableOpacity>
            {/*<View style={{alignItems: 'center' }}>
              <Text>{I18n.t('forgetlogin')}<Text style={{fontWeight: 'bold',color: 'black'}}>{I18n.t('gethelp')}</Text></Text>
            </View>*/}
            <View style={{flexDirection: 'row',marginVertical: hp('3%'),alignItems: 'center'}}>
              <View style={{width: wp('35%'),borderWidth: .3,height: 0}}/>
              <Text style={styles.orText}> {I18n.t("OR")} </Text>
              <View style={{width: wp('35%'),borderWidth: .3,height: 0}}/>
            </View>
            {/*<Text style={styles.loginFB}>{I18n.t('loginFB')}{this.state.fbname}</Text>*/}

            <View style={{ flex : 1 }} />
            <View style={{alignItems: 'center',justifyContent: 'flex-end' }}>
              <View style={{marginVertical: hp('1%'),width: wp('100%'),borderWidth: .6,}} />
              <TouchableOpacity style={styles.TouchableOpacitysignup} activeOpacity={1} onPress={()=>this.props.navigation.navigate('SignUpFB')}>
                <Text>{I18n.t('nothaveAccount')}<Text style={{fontWeight: 'bold',color: 'black'}}>{I18n.t("singupword")}</Text></Text>
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
    paddingTop: 2,
    alignItems: 'center'
  },
  instagramLogo: {
    marginTop: wp('23%'),
    justifyContent: 'center',
    width: wp('70%'),
    height: hp('20%')
  },
  txtinput: {
    width: wp('90%'),
    borderWidth: .2,
    backgroundColor: '#eaeaea',
    paddingHorizontal: wp('3%'),
    marginBottom: hp('3%'),
  },
  loginBtn: {
    width: wp('90%'),
    backgroundColor: '#3B5999',
    height: hp('6%'),
    borderRadius: wp('1.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('3%'),
  },
  loginTxt: {
    color: 'white',
    fontSize: wp('4%'),
  },
  orText: {
    fontSize: wp('4%'),
  },
  loginFB: {
    color: 'blue',
    fontSize: wp('5%'),
  },footer: {
    alignItems: 'center'
  },
  TouchableOpacitysignup: {
    height: hp('5%'),
    width: wp('80%'),
    alignItems: 'center'
  },
});
