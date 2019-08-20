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
import {firebaseApp} from '../Screens/firebase';
import 'firebase/firestore';

export default class Comment extends Component {
  constructor(props) {
    super(props);
    this.state={
      likeStatus: 0,
      likeImage:[
        require('../icons/like.png'),
        require('../icons/liked.png')
      ],
      usrName: '',
      usrImg: '',
      comment: props.comment,
    }
    this.getUserInfo(props.uid);
  }

  getUserInfo = (uid)=>{
    var db = firebaseApp.firestore();
    db.collection("users").where("uid","==",uid).get()
    .then((query)=>{
      this.setState({
        usrName: query.docs["0"].data().usrName,
        usrImg: query.docs["0"].data().imgURL,
      })
    }).then(data=>{
      this.setState({done:true});
    })
  }

  changelikeStatus = () => {
    this.setState({likeStatus: this.state.likeStatus^1})
  }


  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.accountImg} source={{uri: this.state.usrImg}} />
        <View style={styles.txt}>
          <Text style={styles.usrNameTxt}>{this.state.usrName}  <Text style={styles.commentTxt}>{this.state.comment}</Text></Text>
        </View>
        {/*<View style={styles.likeContainer}>
          <TouchableOpacity onPress={this.changelikeStatus}>
            <Image
              style={styles.like}
              source={this.state.likeImage[this.state.likeStatus]}
              resizeMode='contain'
              />
          </TouchableOpacity>
        </View>*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: wp('92%'),
    marginHorizontal: wp('3%'),
    marginTop: hp('2%'),
  },
  accountImg: {
    width: hp('8%'),
    height: hp('8%'),
    borderRadius: wp('100%'),
  },
  txt: {
    marginHorizontal: wp('3%'),
    alignItems: 'center',
    width: wp('60%'),
    flexDirection: 'row'
  },
  usrNameTxt: {
    color: 'black',
    fontSize: wp('4%'),
    fontWeight: 'bold'
  },
  commentTxt: {
    color: 'black',
    fontSize: wp('3.2%'),
  },
  like: {
    width: wp('6%'),
    height: hp('5%'),
  },
  likeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  }
});
