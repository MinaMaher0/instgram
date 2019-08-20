import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, I18nManager} from 'react-native';
import Root from './Navigation/Root';
import Home from './Navigation/Home';
import AsyncStorage from '@react-native-community/async-storage';
import RNRestart from "react-native-restart";
import I18n from './src/utils/I18n';
import store from './store';
import { firebaseApp }from './Screens/firebase';
type Props = {};
export default class App extends Component<Props> {
  constructor(props){
    super(props);
    this.state= {
      finished: false,
      done: false,
      route: '',
    }
  }

  componentDidMount() {
    AsyncStorage.getItem("lang")
    .then(language => {
      if (language === "ar") {
        I18nManager.forceRTL(true);
        if (!I18nManager.isRTL) {
          RNRestart.Restart();
        }
        I18n.locale = language;
        this.setState({finished: true});
      } else {
        I18nManager.forceRTL(false);
        if (I18nManager.isRTL) {
          RNRestart.Restart();
        }
        if (language)
        I18n.locale = language;
        this.setState({finished: true});
      }
    }).catch(
      (error)=>{
        AsyncStorage.setItem("lang", I18n.locale.slice(0,2))
    			.then(data => {
    				RNRestart.Restart();
    			})
    			.catch(err => {
    				alert(err.message);
    			});
      }
    );
    AsyncStorage.getItem("uid")
    .then(data=>{

      if (data){
        var db = firebaseApp.firestore();
        db.collection("users").where("uid", "==", data)
        .get()
        .then(querySnapshot =>{
          if (querySnapshot.docs.length){
              store.setState({
                name:querySnapshot.docs["0"].data().name,
                imgURL:querySnapshot.docs["0"].data().imgURL,
                usrName:querySnapshot.docs["0"].data().usrName,
                uid: data,
              })
              this.setState({route: "home"});
            }else{

            }
        }).then(()=>{
          this.setState({done: true})
        })
        .catch(error=> {
          alert(error.message)
        });
      }else{
        this.setState({route: "login"},()=>{this.setState({done: true})});
      }
    })



	}
  render() {
    if (this.state.done){
      if (this.state.route=="home"){
        return(
          <View style={styles.container}>
              <Home />
          </View>
        )
      }else {
        return (
          <View style={styles.container}>
            <Root />
          </View>
        );
      }
    }else{
      return (
        <View>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});
