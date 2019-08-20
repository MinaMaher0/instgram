import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import I18n from '../src/utils/I18n';
import Icon from "react-native-vector-icons/FontAwesome";
import { firebaseApp } from './firebase';
import 'firebase/firestore';
import ModalChoosePhoto from '../Components/ModalChoosePhoto';
import store from '../store';


export default class EditProfile extends Component {

  static navigationOptions = ({navigation}) =>{
    const {params = {}} = navigation.state;
    return {
    title: `${I18n.t('editProfile')}`,
    headerRight: (
      <TouchableOpacity onPress={()=>params.radd()}>
        <Image style={{width: wp('8%'),height: hp('5%'),marginHorizontal: wp('3%')}} source={require('../icons/checkmark.png')}/>
      </TouchableOpacity>
    )
  }}

  constructor(props) {
    super(props);
    this.state = {
      name: store.getState().name,
      usrName: store.getState().usrName,
      profileImg: store.getState().imgURL,
      uid: store.getState().uid,
      email: '',
      bio: store.getState().bio,
      phone: '',
      doneUsrData: false,
      vis: false,
    }
  }


  componentDidMount() {
    this.props.navigation.setParams({
       radd: this.upto
     });
    this.unsubscribe = store.onChange(() =>
      this.setState({
        profileImg: store.getState().imgURL,
      }));
  }

  componentWillUnmount() {
    this.unsubscribe();
  }
  upto =()=>{
    var db = firebaseApp.firestore();
    this.props.navigation.state.params.ref.update({
        imgURL: this.state.profileImg,
        name: this.state.name,
        usrName: this.state.usrName,
        bio: this.state.bio,
    }).then(data=>{
      store.setState({
        imgURL: this.state.profileImg,
        name: this.state.name,
        usrName: this.state.usrName,
        bio: this.state.bio,
      })
      this.props.navigation.navigate("ProfileStack");
    })

  }

  updater = ()=>{

  }

  changeVis = ()=> {
    this.setState({vis: !this.state.vis})
  }

  render() {
      return (
        <ScrollView>

        <View style={styles.container}>
          {this.state.vis && <ModalChoosePhoto nxt="EditProfile" navigation={this.props.navigation} changeVis={this.changeVis}  />}
          <TouchableOpacity style={styles.pofileImgContainer} activeOpacity={1}>
            <Image style={styles.profileImg} source={{uri : store.getState().imgURL}}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pofileImgTxtContainer} activeOpacity={1} onPress={()=>{this.setState({vis:true})}}>
            <Text style={styles.pofileImgTxt}>{I18n.t('ChangeProfilePhoto')}</Text>
          </TouchableOpacity>
          <View style={styles.txtInputConatiner}>
            <View>
              <Text style={styles.txtlabel}>{I18n.t('name').charAt(0).toUpperCase()}{I18n.t('name').slice(1)}</Text>
              <TextInput
                placeholder= {I18n.t('name')}
                value={this.state.name}
                onChangeText={(name)=>{this.setState({name})}}
                style={styles.txtInput}
                />
            </View>
            <View style={styles.txtInputItem}>
              <Text style={styles.txtlabel}>{I18n.t('username').charAt(0).toUpperCase()}{I18n.t('username').slice(1)}</Text>
              <TextInput
                placeholder= {I18n.t('username')}
                value={this.state.usrName}
                onChangeText={(usrName)=>{this.setState({usrName})}}
                style={styles.txtInput}
                />
            </View>
            <View style={styles.txtInputItem}>
              <Text style={styles.txtlabel}>{I18n.t('bio').charAt(0).toUpperCase()}{I18n.t('bio').slice(1)}</Text>
              <TextInput
                placeholder= {I18n.t('bio')}
                value={this.state.bio}
                onChangeText={(bio)=>{this.setState({bio})}}
                style={styles.txtInput}
                />
            </View>

            {/*<View style={styles.txtInputItem}>
              <Text style={styles.txtlabel}>{I18n.t('email').charAt(0).toUpperCase()}{I18n.t('email').slice(1)}</Text>
              <TextInput
                placeholder= {I18n.t('email')}
                value={this.state.email}
                onChangeText={(email)=>{this.setState({email})}}
                style={styles.txtInput}
                />
            </View>*/}
          </View>
        </View>
      </ScrollView>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  pofileImgContainer: {
    borderWidth: 1,
    borderRadius: wp('100%'),
    marginTop: hp('2.5%'),
  },
  profileImg: {
    width: wp('30%'),
    height: wp('30%'),
    borderRadius: wp('100%'),
  },
  pofileImgTxtContainer: {

  },
  pofileImgTxt: {
    marginTop: hp('2%'),
    fontSize: wp('5%'),
    color: 'blue'
  },
  txtInputConatiner: {
    flex: 1,
    width: wp('90%'),
    marginTop: hp('4%'),
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
  },
  txtlabel: {
    fontSize: wp('5%'),
  },
  txtInput: {
    borderBottomWidth: .8,
    color: 'black',
    fontSize: wp('5%'),
  },
  txtInputItem: {
    marginTop: hp('2.5%'),
  }
});
