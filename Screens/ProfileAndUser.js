import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import ModalChoosePhoto from '../Components/ModalChoosePhoto';
import store from '../store';
import { firebaseApp } from './firebase';
import 'firebase/firestore';
import Spinner from 'react-native-loading-spinner-overlay';
import I18n from '../src/utils/I18n';

export default class ProfileAndUser extends Component {

  static navigationOptions = ({navigation})=>({
    header: null,
  })

  constructor(props){
    super(props);
    this.state= {
      url: store.getState().imgURL,
      userName: "",
      name: "",
      bio: "",
      vis: false,
      spinner: false,
    }
  }

  async componentDidMount() {
    this.unsubscribe = store.onChange(() =>
      this.setState({
          url: store.getState().imgURL,
      }));
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  changeVis = ()=> {
    this.setState({vis: !this.state.vis})
  }

  cont = ()=>{
    var db = firebaseApp.firestore();
    store.setState({
      name: this.state.name,
      usrName: this.state.userName,
    })
    this.setState({spinner: true},()=>{
      db.collection("users").add({
        uid: store.getState().uid,
        name: this.state.name,
        usrName: this.state.userName,
        imgURL: this.state.url,
        bio: this.state.bio,
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

  render() {
    return (
      <View style={styles.container}>
        {this.state.vis && <ModalChoosePhoto nxt="ProfileAndUser" navigation={this.props.navigation} changeVis={this.changeVis}  />}
        <Spinner
          visible={this.state.spinner}
          textStyle={styles.spinnerTextStyle}
          />
        <TouchableOpacity style={styles.imgContainer} activeOpacity={.7} onPress={()=>{this.setState({vis: true})}}>
          <Image style={styles.img} source={{uri : this.state.url}}/>
          <Text style={styles.chooseTxt}>{I18n.t("ChoosePhoto")}</Text>
        </TouchableOpacity>
        <View style={styles.touchContainer}>
          <TextInput
            placeholder={I18n.t("name")}
            style={styles.txtInput}
            value={this.state.name}
            onChangeText={(name)=>{this.setState({name})}}
            maxLength={32}
            />
          <TextInput
            placeholder={I18n.t("username")}
            style={styles.txtInput}
            value={this.state.userName}
            onChangeText={(userName)=>{this.setState({userName})}}
            maxLength={32}
            />
          <TextInput
            placeholder={I18n.t("bio")}
            multiline
            style={styles.txtInput}
            value={this.state.bio}
            onChangeText={(bio)=>{this.setState({bio})}}
            maxLength={150}
            />
        </View>
        <TouchableOpacity
          style={styles.cont} activeOpacity={0.7}
          onPress={this.cont}
          >
          <Text style={styles.contTxt}>{I18n.t("continue")}</Text>
        </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#FAFAFA"
  },
  img: {
    width: wp('40%'),
    height: hp('25%'),
    borderRadius: wp('100%'),
  },
  imgContainer: {
    alignItems: 'center',
  },
  chooseTxt: {
    fontSize: wp('5%'),
    color: 'blue'
  },
  touchContainer: {
    marginTop: hp('5%'),
  },
  txtInput: {
    width: wp('70%'),
    borderWidth: 0.3,
    borderRadius: wp('2%'),
    color: 'black',
    fontSize: wp('4%'),
    marginTop: hp('2%'),
    paddingHorizontal: wp('4%'),
  },
  cont: {
    width: wp('70%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('5%'),
    backgroundColor: '#0053FF',
    height: hp('7%'),
    borderRadius: wp('2%'),
  },
  contTxt: {
    color: 'white',
    fontSize: wp('4%'),
  }
});
