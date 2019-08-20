import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  I18nManager,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import Post from '../Components/Post';
import PostModal from '../Components/PostModal';
import I18n from '../src/utils/I18n';
import { firebaseApp } from './firebase';
import 'firebase/firestore';
import store from '../store';
import uuid from 'react-native-uuid';


const keyExtractor = ({ uuid }) => uuid;
export default class PostsPage extends Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state={
      vis:false,
      items: [],
      done: true,
    }

  }

  componentDidMount() {
    this.getPost();
  }

  getPost = ()=>{
    var db =firebaseApp.firestore();
    db.collection('following').where("from","==",store.getState().uid).get()
    .then((query)=>{
        query.forEach(doc=>{
          db.collection("posts").where("uid","==",doc.data().to).get()
          .then((result)=>{
            result.forEach(res=>{
              this.setState({items: [...this.state.items,{data:res.data(),ref: res.ref,uuid: uuid.v1()}]})
            })
          })
        })
    }).then(data=>{
      this.setState({done: false})
    })
  }

  renderItem = ({item}) => {
    return (
      <Post refe={item.ref} uid={item.data.uid} userName={item.data.name} imageURL={item.data.image} likes={item.data.likes} comment={item.data.comments} description={item.data.description}  commentStatus={item.data.trunOffComments} changeVis={this.changeVis} navigation={this.props.navigation}/>
    );
  }

  changeVis = ()=> {
    this.setState({vis: !this.state.vis})
  }

  _onRefresh = ()=>{
    this.setState({done:true,items:[]},()=>{
      this.getPost();
    })
  }

  render() {
    if (!this.state.done){
      return (
        <View style={styles.container}>
          {this.state.vis && <PostModal changeVis={this.changeVis}  />}
          <FlatList
            renderItem={this.renderItem}
            data={this.state.items}
            keyExtractor={keyExtractor}
            refreshControl={
              <RefreshControl
                 refreshing={this.state.done}
                 onRefresh={this._onRefresh}
               />
            }
            />
        </View>
      );
    }else{
      return (
        <View style={{ flex: 1, paddingTop: hp('3%') }}>
          <ActivityIndicator size="large" color="gray" />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
