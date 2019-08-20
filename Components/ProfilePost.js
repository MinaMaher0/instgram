import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import ModalTest from '../Screens/ModalTest';
import I18n from '../src/utils/I18n';
import {firebaseApp} from '../Screens/firebase' ;
import 'firebase/firestore';
import store from '../store' ;
import FastImage from 'react-native-fast-image';

export default class Post extends Component {

  static navigationOptions = ({navigation})=>({
    title: 'Post'
  })

  constructor(props) {
    super(props);
    this.state={
      likeStatus: 0,
      likeImage:[
        require('../icons/like.png'),
        require('../icons/liked.png')
      ],
      usrImg: '',
      likes: props.navigation.state.params.likes,
      comments: props.navigation.state.params.comment,
      done: false,
      likeDisable: false,
      commentStatus: props.navigation.state.params.commentStatus,
    }
    for (let i =0; i<props.navigation.state.params.likes.length;++i){
      if (props.navigation.state.params.likes[i]==store.getState().uid){
        this.state={
          ...this.state,
          likeStatus: 1,
        };
        break;
      }
    }
    this.getUsrImg();
  }

  getUsrImg = () =>{
      var db =firebaseApp.firestore();
      db.collection("users").where("uid","==",this.props.navigation.state.params.uid).get()
      .then((query)=>{
          this.setState({usrImg: query.docs["0"].data().imgURL},()=>{this.setState({done:true})})

        }
      )
  }

  changelikeStatus = () => {
    this.setState({likeDisable: true});
    this.setState({likeStatus: this.state.likeStatus^1});
    if (this.state.likeStatus){
      this.setState({likes: this.state.likes.filter(uid=>{uid!=store.getState(uid)})},()=>{
        this.props.navigation.state.params.refe.update({
          likes: this.state.likes
        }).then(data=>{
          this.setState({likeDisable: false});
        })
      })
    }else{
      this.setState({likes: [...this.state.likes,store.getState().uid]},()=>{
        this.props.navigation.state.params.refe.update({
          likes: this.state.likes
        }).then(data=>{
          this.setState({likeDisable: false});
        })
      })
    }
  }

  render() {
    if (!this.state.done){
      return (
        <View style={{ flex: 1, paddingTop: hp('3%') }}>
          <ActivityIndicator size="large" color="gray" />
        </View>
      )
      }else {
      return (
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={{flexDirection: 'row',alignItems: 'center'}} >
                <View style={styles.userAvatarContainer}>
                  <FastImage
                    style={styles.userAvatar}
                    source={{uri : this.state.usrImg}}
                    resizeMode={FastImage.resizeMode.contain}
                    />
                </View>
                <Text style={styles.userName}>{this.props.navigation.state.params.userName}</Text>
              </View>

            </View>
            <FastImage
              style={styles.post}
              source={{uri : this.props.navigation.state.params.imageURL}}
              />
            <View style={styles.reacts}>
              <TouchableOpacity
                onPress={this.changelikeStatus}
                disabled={this.state.likeDisable}
                activeOpacity={0.7}
                >
                <Image
                  style={styles.like}
                  source={this.state.likeImage[this.state.likeStatus]}
                  resizeMode='contain'
                  />
              </TouchableOpacity>
              {!this.state.commentStatus && <TouchableOpacity>
                <Image style={styles.comment} source={require('../icons/comment.jpg')} />
              </TouchableOpacity>}
              <View style={styles.saveContainer}>
                <TouchableOpacity >
                  <Image style={styles.save} source={require('../icons/save.png')} />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.likesContainer} onPress={()=>this.props.navigation.state.params.navigation.navigate('testLikes',{likes: this.state.likes})}>
              <Text style={styles.likesCount}>{this.state.likes.length}</Text>
              <Text style={styles.likesTxt}>{I18n.t('likescount')}</Text>
            </TouchableOpacity>
            <View style={styles.descriptionContainer}>
            </View>
            <TouchableOpacity style={styles.commentsContainer} onPress={()=>this.props.navigation.state.params.navigation.navigate('testComments',{commments :this.state.comments,refe: this.props.navigation.state.params.refe})} disabled={this.state.commentStatus}>
              <Text style={styles.descriptionTxt}><Text style={styles.descriptionUsrName}>{this.props.navigation.state.params.userName} </Text>{this.props.navigation.state.params.description}</Text>
              {!this.state.commentStatus && <Text style={styles.commentTxt}>{I18n.t('Viewcomments')} (<Text>{this.props.navigation.state.params.comment.length}</Text>)</Text>}
            </TouchableOpacity>
          </View>
        </View>
      );}
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  card: {
    paddingVertical: hp('1%'),
    width: wp('96%'),
    backgroundColor: '#FFFFFF',
    marginHorizontal: wp('2%'),
    marginTop: hp('1%'),
    marginBottom: hp('1%'),
    borderWidth: .2,
  },
  userAvatarContainer: {
    borderRadius: wp('100%'),
    width: hp('5%'),
    height: hp('5%'),
  },
  cardHeader: {
    flexDirection: 'row',
    paddingHorizontal: wp('1%'),
    paddingVertical: hp('.5%'),
    alignItems: 'center',
  },
  userAvatar: {
    width: hp('5%'),
    height: hp('5%'),
    borderRadius: hp('100%'),
  },
  userName: {
    fontSize: wp('4%'),
    color: 'black',
    marginHorizontal: wp('2%'),
  },
  points: {
    height: hp('5%'),
    width: wp('2%'),
  },
  pointsContainer: {
    flex: 1,

    alignItems: 'flex-end',
    marginRight: wp('1%'),
  },
  pointsTouch: {
    width: wp('7%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  post: {
    width: wp('96%'),
    height: hp('50%'),
  },
  reacts: {
    marginHorizontal: wp('2%'),
    flexDirection: 'row',
    alignItems: 'center'
  },
  like: {
    width: wp('10%'),
    height: hp('7%'),
  },
  comment: {
    width: wp('8%'),
    height: hp('8%'),
    marginLeft: wp('3%'),
  },
  save: {
    width: wp('10%'),
    height: hp('10%'),
    marginLeft: wp('3%'),
  },
  saveContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  likesContainer: {
    flexDirection: 'row',
    marginHorizontal: wp('3%'),
  },
  likesTxt: {
    marginHorizontal: wp('1%'),
    fontSize: wp('4%'),
    color: 'black',
    fontWeight: 'bold'
  },
  likesCount: {
    fontSize: wp('4%'),
    color: 'black',
    fontWeight: 'bold',
  },
  descriptionContainer: {
    flexDirection: 'row',
    marginHorizontal: wp('3%'),
  },
  descriptionUsrName: {
    fontSize: wp('4%'),
    color: 'black',
    fontWeight: '500'
  },
  descriptionTxt: {
    fontSize: wp('4%'),
    color: 'black',
  },
  commentsContainer: {
    marginHorizontal: wp('3%'),
  },
  commentTxt: {
    fontSize: wp('4%'),
  }
});
