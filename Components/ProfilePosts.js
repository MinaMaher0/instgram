import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { firebaseApp } from '../Screens/firebase';
import 'firebase/firestore';
import FastImage from 'react-native-fast-image';
import uuid from 'react-native-uuid';

const keyExtractor = ({ uid }) => uuid.v1();

export default class ProfilePosts extends Component {


  constructor(props) {
    super(props);
    this.state= {
      uid: props.uid,
      posts: props.posts,
      done: false,
    }
  }

  componentDidMount() {
    var db = firebaseApp.firestore();

  }

  renderItem = ({item}) =>{
      return (
        <TouchableOpacity
          onPress={()=>this.props.navigation.navigate("Post",{refe:item.ref, uid:item.data.uid, userName:item.data.name, imageURL:item.data.image, likes:item.data.likes, comment:item.data.comments, description:item.data.description, commentStatus:item.data.trunOffComments, changeVis:this.changeVis, navigation:this.props.navigation})}
          activeOpacity={0.7}
          >
          <FastImage
            source={{uri : item.data.image}}
            style={styles.img}
            />
        </TouchableOpacity>
      );
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          renderItem={this.renderItem}
          keyExtractor={keyExtractor}
          data={this.state.posts}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  img: {
    width: wp('30'),
    height: hp('20%'),
    marginLeft: wp('1%'),
    marginBottom: hp('1%'),
  }
});
