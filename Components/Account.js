import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import I18n from '../src/utils/I18n';
import store from '../store';
import { firebaseApp } from '../Screens/firebase';
import 'firebase/firestore';

export default class Account extends Component {
  constructor(props){
    super(props);
    this.state={
      following: false,
      myuid: store.getState().uid,
    }
  }

  chkFollow = ()=>{
    var db = firebaseApp.firestore();
    db.collection("following").where("from","==",this.state.myuid).where("to","==",this.props.uid).get().then((querySnapshot) => {
      if (querySnapshot.docs.length){
        this.setState({following:true})
      }else{
        this.setState({following:false})
      }
    });
  }

  follow = ()=>{
    var db = firebaseApp.firestore();
      db.collection("following").add({
        from: this.state.myuid,
        to: this.props.uid
      }).then(data=>{
        this.setState({following: true})
      }).catch(error=>{
        alert(error.message);
      }).catch(error=>{
        alert(error.message);
      })
  }

  unfollow = ()=>{
    var db = firebaseApp.firestore();
    db.collection("following").where("from","==",this.state.myuid).where("to","==",this.props.uid).get()
    .then((querySnapshot)=>{
          querySnapshot.forEach(function(doc) {
            doc.ref.delete();

          });
    })
    .then(data=>{
      this.setState({following: false})
    })
    .catch(error=>{
      alert(error.message);
    })
    .catch(error=>{
      alert(error.message);
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.accountContainer}>
          <Image style={styles.accountImg} source={{uri:this.props.img}}/>
          <View style={styles.accountDetails}>
            <Text style={styles.usrNameTxt}>{this.props.usrName}</Text>
            <Text>{this.props.name}</Text>
          </View>
          {this.props.uid != this.state.myuid && <View style={styles.touchContainer} >
            {!this.state.following && <TouchableOpacity style={styles.follow} onPress={this.follow}>
              <Text style={styles.followTxt}>{I18n.t('Follow')}</Text>
            </TouchableOpacity>}
            {this.state.following && <TouchableOpacity style={styles.unfollow} onPress={this.unfollow}>
              <Text style={styles.unfollowTxt}>{I18n.t('UnFollow')}</Text>
            </TouchableOpacity>}
          </View>}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  accountContainer: {
    flexDirection: 'row',
    marginHorizontal: wp('4%'),
    marginTop: hp('2%'),
  },
  accountImg: {
    width: hp('10%'),
    height: hp('10%'),
    borderRadius: wp('100%'),
  },
  accountDetails: {
    marginHorizontal: wp('4%'),
    justifyContent: 'center'
  },
  usrNameTxt: {
    color: 'black',
    fontSize: wp('4%'),
  },
  nameTxt: {
    fontSize: wp('4%'),

  },
  touchContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  follow: {
    width: wp('23%'),
    height: hp('5.5%'),
    backgroundColor: '#3897F1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('2')
  },
  followTxt: {
    color: 'white',
  },
  unfollow: {
    width: wp('23%'),
    height: hp('5.5%'),
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('2'),
    borderWidth: .5,
  },
  unfollowTxt: {
    color: 'black',
  }
});
