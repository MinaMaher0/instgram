import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Picker,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager
} from 'react-native-fbsdk';
import I18n from "../src/utils/I18n";
import * as Firebase from 'firebase/app';
import AsyncStorage from '@react-native-community/async-storage';
import RNRestart from "react-native-restart";
import store from '../store';
import Spinner from 'react-native-loading-spinner-overlay';

export default class SignUpFB extends Component {

  static navigationOptions = {
    header: null,
  };


  constructor(props) {
    super(props);
    this.state={
      selectedValue: I18n.locale.slice(0,2),
      fbname: 'facebook',
      test: false,
      spinner: false,
      uid: '',
    }
  }

  componentDidMount() {

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


  setinAsync = (key,val) => {
    AsyncStorage.setItem(key,val)
  }


  SignUpFB = ()=>{
    var db = Firebase.firestore();
    LoginManager.logInWithPermissions(['public_profile'])
          .then(
            (result) => {
              if (result.isCancelled) {
                Alert.alert('Whoops!', 'You cancelled the sign in.');
              } else {
                AccessToken.getCurrentAccessToken()
                  .then((data) => {
                    const credential = Firebase.auth.FacebookAuthProvider.credential(data.accessToken);
                    Firebase.auth().signInWithCredential(credential)
                      .then((data)=>{
                        this.setinAsync('uid',data.user.uid);

                        const responseInfoCallback = (error, result) => {
                          if (error) {
                            alert('Error fetching data: ' + error.toString());
                          } else {
                            store.setState({
                              name: result.name,
                              usrName: result.first_name,
                              uid: data.user.uid,
                              imgURL: result.picture.data.url,
                            })
                            this.setState({spinner: true},()=>{
                              db.collection("users").add({
                                name: result.name,
                                usrName: result.first_name,
                                uid: data.user.uid,
                                imgURL: result.picture.data.url,
                              })
                              .then((docRef)=>{
                                this.setState({spinner: false},()=>{this.props.navigation.navigate('home')})

                              })
                              .catch((error)=>{
                                this.setState({spinner: false});
                                alert(error.message)
                              });
                            });
                          }
                        }

                        const usrInfo = new GraphRequest('./me',{
                          accessToken: data.credential.accessToken,
                          parameters:{
                            fields: {
                                string: 'email,name,first_name,picture.height(10000)'
                            }
                          }

                        },responseInfoCallback);

                        new GraphRequestManager().addRequest(usrInfo).start()

                      })
                      .catch((error) => {
                        loginSingUpFail(dispatch, error.message);
                      });
                  });
              }
            },
            (error) => {
              Alert.alert('Sign in error', error);
            },
          );
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner
          visible={this.state.spinner}
          />
        <View style={styles.content}>
          <View style={{alignItems: 'center' }}>
            <Picker
                selectedValue={this.state.selectedValue}
                style={{alignItems: 'center', height: hp('5%'), width: wp('28.5%')}}
                onValueChange={ (itemValue, itemIndex) => {
                  this.changelocal(itemValue);
                }}
              >
                <Picker.Item label="English" value="en" />
                <Picker.Item label="Arabic" value="ar" />
            </Picker>
          </View>
          <Image
            style={styles.instagramLogo}
            source={require('../icons/instagram-logo.png')}
            resizeMode='contain'
          />
        <TouchableOpacity style={styles.TouchableOpacityFB} activeOpacity={.5} onPress={this.SignUpFB}>
              <Image style={styles.fbIcon} source={require('../icons/fbwhite.jpg')} />
              <Text style={styles.fbText}>
                {I18n.t("loginFB")} {this.state.fbname}
              </Text>
          </TouchableOpacity>
          <View style={{flexDirection: 'row',marginVertical: hp('3%'),alignItems: 'center'}}>
            <View style={{width: wp('35%'),borderWidth: .3,height: 0}}/>
            <Text style={styles.orText}> {I18n.t("OR")} </Text>
            <View style={{width: wp('35%'),borderWidth: .3,height: 0}}/>
          </View>
          <TouchableOpacity style={{alignItems: 'center'}} activeOpacity={1} onPress={()=>{this.props.navigation.navigate('SignUpEmailPhone')}}>
            <Text style={styles.signUP}>{I18n.t("signup")}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <View style={{marginVertical: hp('1%'),width: wp('100%'),borderWidth: .6,}} />
          <TouchableOpacity style={styles.TouchableOpacityLogin} activeOpacity={1} onPress={()=>this.props.navigation.navigate('Login')}>
            <Text>{I18n.t("haveAccount")} <Text style={{fontWeight: 'bold',color: 'black'}}>{I18n.t("login")}</Text></Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1
  },
  TouchableOpacityFB: {
    backgroundColor: '#3B5999',
    height: hp('6%'),
    width: wp('80%'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('2%'),
  },
  instagramLogo: {
    marginVertical: wp('25%'),
    justifyContent: 'center',
    width: wp('70%'),
    height: hp('20%')
  },
  fbIcon: {
    width: wp('4%'),
    height: wp('4%'),
  },
  fbText: {
    fontSize: wp('4%'),
    color: 'white',
    marginLeft: wp('3%'),
  },
  orText: {
    fontSize: wp('4%'),
    marginVertical: wp('5%'),
  },
  signUP: {
    color: '#3B5999',
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center'
  },
  TouchableOpacityLogin: {
    height: hp('5%'),
    width: wp('100%'),
    alignItems: 'center'
  },
  loginTxt: {
    fontSize: wp('4%')
  }
});
