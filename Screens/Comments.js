import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import Comment from '../Components/Comment';
import I18n from '../src/utils/I18n';
import {firebaseApp} from '../Screens/firebase' ;
import 'firebase/firestore';
import store from '../store'
const keyExtractor =({uid,comment})=>uid+comment

export default class Comments extends Component {

  static navigationOptions= ({navigation})=>({
    title: `${I18n.t('comments')}`,
  })

  constructor(props){
    super(props);
    this.state={
      items: props.navigation.state.params.commments,
      comment: '',
    }
  }


  addComment = ()=>{
    var db = firebaseApp.firestore();
    this.setState({items: [...this.state.items,{uid: store.getState().uid,comment:this.state.comment}],comment:''},
    ()=>{
      this.props.navigation.state.params.refe.update({
        comments: this.state.items,
      }).then((date)=>{
      })
    }
    )
  }

  renderItem = ({item}) =>{
    return(
      <Comment uid={item.uid} comment={item.comment}/>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.items}
          renderItem={this.renderItem}
          keyExtractor={keyExtractor}
          />
        <View style={styles.inputContainer}>
          <Image style={styles.img} source={{uri: store.getState().imgURL}} />
          <TextInput
            placeholder={I18n.t('EnterComment')}
            value={this.state.comment}
            onChangeText={(comment)=>{this.setState({comment})}}
            style={styles.txtInput}
            />
          {this.state.comment!='' &&
            <TouchableOpacity style={{justifyContent: 'center',alignItems: 'flex-end'}} onPress={this.addComment}>
              <Text style={styles.post}>{I18n.t("Post")}</Text>
            </TouchableOpacity>
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    marginHorizontal: wp('3%'),
  },
  img: {
    width: hp('6%'),
    height: hp('6%'),
    borderRadius: wp('100%'),
  },
  txtInput: {
    marginHorizontal: wp('2%'),
    flex: 1,
  },
  post: {
    color: 'blue',
    fontSize: wp('4%'),
  }
});
