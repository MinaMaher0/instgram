import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import I18n from '../src/utils/I18n';
import ProfilePosts from '../Components/ProfilePosts';
import store from '../store';
import { firebaseApp } from './firebase';
import 'firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';

export default class Profile extends Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      profileImg: '',
      usrName: '',
      bio: '',
      uid: props.navigation.getParam('uid', null),
      myuid: null,
      following: false ,
      doneUsrData: true,
      doneUsrPosts: true,
      posts: [],
      followersList: [],
      followingList: [],
    }
    this.getDate();
  }

  getDate = ()=>{
    AsyncStorage.getItem("uid")
    .then(data=>{
      this.setState({myuid: data},()=>{
        this.getPosts();
        this.getFollowers()
        this.getFollowing()
      })
      if (!this.state.uid)
        this.getUsrData(data);
      else this.chkFollow();
    })
  }

  getUsrData = (uid)=>{
      var db = firebaseApp.firestore();
      db.collection("users").where("uid","==",uid).get().then((querySnapshot) => {
        this.setState({
            name: querySnapshot.docs['0'].data().name,
            profileImg: querySnapshot.docs['0'].data().imgURL,
            usrName: querySnapshot.docs['0'].data().usrName,
            bio: querySnapshot.docs['0'].data().bio,
            ref: querySnapshot.docs['0'].ref,
            doneUsrData:false,
        })
      }).catch(error=>{
        alert(error.message);
      })
  }

  getPosts = ()=>{
    var db = firebaseApp.firestore();
    db.collection("posts").where("uid","==",this.state.uid ? this.state.uid : this.state.myuid).orderBy("myTimeStamp", "desc").get()
    .then((querySnapshot)=>{
      querySnapshot.forEach(res=>{
        this.setState({posts: [...this.state.posts,{data:res.data(),ref: res.ref}]})
      })
    }).then(data=>{
      this.setState({doneUsrPosts:false});
    }).catch(error=>{
      alert(error.message);
    })
  }

  getFollowers = ()=>{
    var db = firebaseApp.firestore();
    db.collection("following").where("to","==",this.state.uid ? this.state.uid : this.state.myuid).get()
    .then((querySnapshot)=>{
      querySnapshot.forEach(doc=>{
        this.setState({followersList: [...this.state.followersList,doc.data().from]})
      })
    })
  }

  getFollowing = ()=>{
    var db = firebaseApp.firestore();
    db.collection("following").where("from","==",this.state.uid ? this.state.uid : this.state.myuid).get()
    .then((querySnapshot)=>{
      querySnapshot.forEach(doc=>{
        this.setState({followingList: [...this.state.followingList,doc.data().to]})
      })
    })
  }

  chkFollow = ()=>{
    var db = firebaseApp.firestore();

    db.collection("following").where("from","==",this.state.myuid).where("to","==",this.state.uid).get().then((querySnapshot) => {
      if (querySnapshot.docs.length){
        this.setState({following:true})
      }else{
        this.setState({following:false})
      }
      this.getUsrData(this.state.uid);
    });
  }

  follow = ()=>{
    var db = firebaseApp.firestore();
      db.collection("following").add({
        from: this.state.myuid,
        to: this.state.uid
      }).then(data=>{
        this.setState({
          following: true,
          followersList: [...this.state.followersList,this.state.myuid]
          })
      }).catch(error=>{
        alert(error.message);
      }).catch(error=>{
        alert(error.message);
      })
  }

  unfollow = ()=>{
    var db = firebaseApp.firestore();
    db.collection("following").where("from","==",this.state.myuid).where("to","==",this.state.uid).get()
    .then((querySnapshot)=>{
          querySnapshot.forEach(function(doc) {
            doc.ref.delete();
          });
    })
    .then(data=>{
      this.setState({
        following: false,
        followersList: this.state.followersList.filter(item=>item!=this.state.myuid)
      })
    })
    .catch(error=>{
      alert(error.message);
    })
    .catch(error=>{
      alert(error.message);
    })
  }

  _onRefresh = ()=>{
    this.setState({
      doneUsrData: true,
      doneUsrPosts:true,
      posts:[],
      followersList: [],
      followingList: [],
    },()=>{
      this.getDate();
    });

  }

  render() {
    if (!this.state.doneUsrPosts && !this.state.doneUsrData){
      return (
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
               refreshing={this.state.doneUsrPosts || this.state.doneUsrData}
               onRefresh={this._onRefresh}
             />
          }
          >
          <View style={styles.account}>
            {this.state.uid && <TouchableOpacity onPress={()=>{this.props.navigation.goBack()}}>
              <Image style={{width: wp('7%'),height: hp('3.5%'),marginHorizontal: wp('4%')}} source={require('../icons/backarrow.png')} />
            </TouchableOpacity>}
            <Text style={styles.userName}>{this.state.usrName}</Text>
            <View style={styles.menuContainer}>
              {(!this.state.uid || this.state.uid==AsyncStorage.getItem("uid")) && <TouchableOpacity style={styles.menuTouch} onPress={()=>{this.props.navigation.openDrawer();}}>
                <Image style={styles.menu} source={require('../icons/menu.png')}/>
              </TouchableOpacity>}
            </View>
          </View>
          <View style={styles.accountInfo}>
            <View style={styles.userImgContainer}>
              <Image
                style={styles.userImg}
                source={{uri : this.state.profileImg}}
                resizeMode='contain'
              />
          </View>
            <View style={styles.infoContainer}>
              <View style={styles.infoDetails}>
                <Text style={styles.num}>{this.state.posts.length}</Text>
                <Text style={styles.type}>{I18n.t('posts')}</Text>
              </View>
              <View style={styles.infoDetails}>
                <Text style={styles.num}>{this.state.followersList.length}</Text>
                <Text style={styles.type}>{I18n.t('Followers')}</Text>
              </View>
              <View style={styles.infoDetails}>
                <Text style={styles.num}>{this.state.followingList.length}</Text>
                <Text style={styles.type}>{I18n.t('Following')}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.accountName}>{this.state.name}</Text>
          <Text style={styles.accountBio}>{this.state.bio}</Text>
          {(this.state.uid && this.state.uid!=this.state.myuid) &&<View style={{justifyContent: 'center',alignItems: 'center', flexDirection: 'row' }}>
            { !this.state.following && <TouchableOpacity style={styles.follow} onPress={this.follow}>
              <Text style={styles.followTxt}>{I18n.t("Follow")}</Text>
            </TouchableOpacity>}
            { this.state.following && <TouchableOpacity style={styles.unfollow} onPress={this.unfollow}>
              <Text style={styles.unfollowTxt}>{I18n.t("UnFollow")}</Text>
            </TouchableOpacity>}
            <TouchableOpacity style={styles.unfollow}>
              <Text style={styles.unfollowTxt}>message</Text>
            </TouchableOpacity>
          </View>}
          {(!this.state.uid || this.state.uid==this.state.myuid) && <TouchableOpacity style={styles.editProfile} onPress={()=>this.props.navigation.navigate('EditProfile',{uid : this.state.myuid,ref : this.state.ref})}>
            <Text style={styles.editTxt}>{I18n.t('editProfile')}</Text>
          </TouchableOpacity>}
          <ProfilePosts posts={this.state.posts} navigation={this.props.navigation}/>
        </ScrollView>
      );
    }else{
      return (
        <View style={{ flex: 1, paddingTop: hp('3%') }}>
          <ActivityIndicator size="large" color="gray" />
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: wp('4%'),
  },
  account: {
    flexDirection: 'row',
    height: hp('11%'),
    alignItems: 'center'
  },
  menu: {
    width: wp('8%'),
    height: hp('11%'),
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  menuTouch: {
    width: wp('10%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: wp('4%'),
    color: 'black',
    fontWeight: 'bold'
  },
  accountInfo: {
    flexDirection: 'row',
  },
  userImg: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('50%'),
  },
  userImgContainer: {
    borderRadius: wp('50%'),
    marginHorizontal: wp('2.5%'),
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  infoDetails: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp('2.5%'),
  },
  num: {
    fontSize: wp('5%'),
    color: 'black',
  },
  type: {
    fontSize: wp('4%'),
    color: 'black',
  },
  accountName: {
    fontSize: wp('5%'),
    color: 'black',
    marginTop: hp('2%'),
  },
  accountBio: {
    fontSize: wp('3.5%'),
    color: 'black',
    marginBottom: hp('2%'),
  },
  editProfile: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: .1,
    borderBottomWidth: 0.6,
    height: hp('5%'),
    marginBottom: hp('2%'),
  },
  editTxt: {
    fontSize: wp('4%'),
    color: 'black',
  },
  follow: {
    backgroundColor: '#3B5999',
    width: wp('40%'),
    borderWidth: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('1%'),
    marginBottom: hp('2%'),
    height: hp('4%'),
  },
  followTxt: {
    color: 'white',
    fontSize: wp('4%'),
    fontWeight: '500'
  },
  unfollow: {
    backgroundColor: '#FAFAFA',
    marginBottom: hp('2%'),
    width: wp('40%'),
    borderWidth: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('1%'),
    height: hp('4%'),
  },
  unfollowTxt: {
    color: 'black',
    fontSize: wp('4%'),
    fontWeight: '500'
  }
});
