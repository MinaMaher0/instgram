import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  FlatList,
  Image,
} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import I18n from '../src/utils/I18n';
import { firebaseApp } from './firebase';
import 'firebase/firestore';

const keyExtractor = ({uid})=> uid;

export default class Search extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props){
    super(props);
    this.state= {
      search: '',
      items: [],
      searchDisable: false,
    }
  }

  search = () => {
    this.setState({items: [],searchDisable: true})
    Keyboard.dismiss();
    var db = firebaseApp.firestore();
    db.collection("users").where("usrName","==",this.state.search).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            this.setState({items: [...this.state.items,doc.data()]})
        });
    }).then(data=>{
      this.setState({searchDisable: false})
    })
  }

  renderItem = ({item}) =>{
    return(
      <TouchableOpacity style={styles.accountContainer} onPress={()=>this.props.navigation.navigate('searchProfile',{uid: item.uid})}>
        <View style={styles.account}>
          <Image style={styles.accountImg} source={{uri : item.imgURL}}/>
          <View style={styles.accountInfoContainer}>
            <Text style={styles.userName}>{item.usrName}</Text>
            <Text style={styles.name}>{item.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TouchableOpacity
            style={styles.iconContainer}
            activeOpacity={1}
            onPress={this.search}
            disabled={this.state.searchDisable}
            >
            <Icon name="search" size={30} color="#000" style={styles.seachIcon}/>
          </TouchableOpacity>
          <TextInput
            placeholder={I18n.t('Search')}
            value={this.state.search}
            onChangeText={(search)=>{this.setState({search})}}
            style={styles.SearchInput}
            />
        </View>
        <FlatList
          renderItem={this.renderItem}
          data={this.state.items}
          keyExtractor={keyExtractor}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: hp('1%'),
    alignItems: 'center',
    backgroundColor: '#FAFAFA'
  },
  SearchInput: {
    flex: 1,
    borderWidth: .1,
    paddingHorizontal: wp('3%'),
    color: 'black',
    backgroundColor: '#FFF',
    fontSize: wp('4%'),
  },
  searchContainer: {
    borderWidth: .2,
    width: wp('95%'),
    marginHorizontal: wp('2%'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  seachIcon: {
    marginHorizontal: wp('2%'),
  },
  iconContainer: {

  },
  accountContainer: {
    flex: 1,
    width: wp('90%'),
    marginTop: hp('3%'),
  },
  account: {
    flexDirection: 'row',
  },
  accountImg: {
    width: wp('14%'),
    height: wp('14%'),
    borderRadius: wp('100%'),
    borderWidth: 1,
  },
  accountInfoContainer: {
    marginHorizontal: wp('3.5%'),
    justifyContent:  'center',
  },
  userName: {
    color: 'black',
    fontSize: wp('5%'),
    fontWeight: 'bold',
  },
  name: {
    fontSize: wp('4%'),
  }
});
