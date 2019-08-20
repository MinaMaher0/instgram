import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  CameraRoll,
  Image,
  FlatList,
  TouchableOpacity,
  Platform
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import Permissions from 'react-native-permissions';


const keyExtractor = (item) =>{return item.node.image.uri;}

export default class Gallary extends Component {

  constructor(props){
    super(props);
    this.state ={
      items: [],
      done: false,
      photo: '',
    }
    this.chkPermission();
  }

  chkPermission = ()=>{
    Permissions.check('photo')
    .then(response=>{
      this.setState({photo: response});
      this.mangePermission();
    })
  }

  getPermission = ()=>{
    Permissions.request('photo').then(response => {
      this.setState({photo: response});
      if (response=="authorized"){
        this.getImages();
      }
    });
  }

  mangePermission = () =>{
    if (this.state.photo=="authorized"){
      this.getImages();
    }else if (this.state.photo=="denied"){
      if (Platform.os=='ios'){
        alert('you must enable permission from setting');
      }else{
        this.getPermission();
      }
    }else if (this.state.photo=="restricted"){
      alert('you must enable permission from setting');
    }else {
      this.getPermission();
    }
  }

  getImages = async () => {
  CameraRoll.getPhotos({
      first: 100000,
    }).then((res)=>{this.setState({items:res.edges,done:true})}).catch((error)=>{alert(error.message);})
  }



  renderItem = ({item}) =>{
    return (
      <TouchableOpacity
        style={{marginVertical: hp('.5%'),marginHorizontal: wp('.5%')}}
        onPress={()=>this.props.navigation.navigate(this.props.navigation.getParam('nxt',"ChoosedPhoto"),{photoUri: item.node.image.uri,nxt: this.props.navigation.getParam("screenToGo",null)})}
        activeOpacity={1}>
        <Image style={{backgroundColor: 'gray',width: wp('24%'),height: hp('16%')}} source={{uri : item.node.image.uri }} />
      </TouchableOpacity>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        {this.state.photo=="denied" &&
          <View style={{flex: 1,justifyContent: 'center',alignItems: 'center'}}>
            <View style={{marginHorizontal: wp('3%'),justifyContent: 'center',alignItems: 'center'}}>
              <Text style={{fontSize: wp('5%')}}>You must allow us to access photos to get your gallary photos</Text>
            </View>
            <TouchableOpacity
               style={{marginTop: hp('2%'),borderRadius: wp('2%'),height: hp('6%'),width: wp('20%'),backgroundColor: 'green',justifyContent: 'center',alignItems: 'center' }}
               onPress={this.getPermission}
               >
              <Text style={{fontSize: wp('5%'),color: 'white',fontWeight:  'bold'}}>
                Allow
              </Text>
            </TouchableOpacity>
          </View>
        }
        {this.state.done &&
          <FlatList
            data={this.state.items}
            renderItem={this.renderItem}
            keyExtractor={keyExtractor}
            numColumns={4}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        }
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: wp('.2%'),
  },
});
