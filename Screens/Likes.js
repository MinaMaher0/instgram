import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { firebaseApp } from './firebase';
import 'firebase/firestore';
import Account from '../Components/Account';
import I18n from '../src/utils/I18n';

const keyExtractor = ({uid})=>uid;

export default class Likes extends Component {

  static navigationOptions = ({navigation}) =>({
    title: `${I18n.t('likes')}`
  });

  constructor(props){
    super(props);
    this.state={
      items: [],
      uids: props.navigation.state.params.likes,
      done: false,
    }
  }

  componentDidMount() {
    var db = firebaseApp.firestore();
      for (let i=0;i<this.state.uids.length;++i){
        db.collection("users").where("uid","==",this.state.uids[i]).get()
        .then((query)=>{
          this.setState({items: [...this.state.items,query.docs["0"].data()]})
        }).then(data=>{
          this.setState({done:true});
        })
      }
  }

  renderItem = ({item}) =>{
    return (
      <TouchableOpacity onPress={()=>this.props.navigation.navigate('Profile',{uid:item.uid})}>
        <Account img={item.imgURL} name={item.name} usrName={item.usrName} uid={item.uid}/>
      </TouchableOpacity>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.state.done && <FlatList
          renderItem={this.renderItem}
          data={this.state.items}
          keyExtractor={keyExtractor}
          />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
