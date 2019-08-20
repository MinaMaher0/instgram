import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import Icon from "react-native-vector-icons/FontAwesome";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import Permissions from 'react-native-permissions';
import Spinner from 'react-native-loading-spinner-overlay';

export default class Camera extends Component {
  constructor(props){
    super(props);
    this.state ={
      type: 1,
      camera: 'none',
      Spinner: false,
    }
    this.mangePermission();
  }

  getPermission = ()=>{
    Permissions.request('camera').then(response => {
      this.setState({camera: response});
    });
  }

  mangePermission = () =>{
    if (this.state.photo=="authorized"){
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

  takePicture() {
    this.setState({spinner: true})
    if (Platform.OS === 'ios'){
      this.camera.takePictureAsync({ exif:true ,forceUpOrientation: true, mirrorImage:this.state.type ? true: false,})
      .then((data) =>{ this.setState({spinner: false},()=>{this.props.navigation.navigate(this.props.navigation.getParam('nxt',"ChoosedPhoto"),{photoUri: data.uri,nxt: this.props.navigation.getParam("screenToGo",null)});})})
      .catch(err => console.error(err));
    }else{
      this.camera.takePictureAsync({ exif:true ,fixOrientation: true, mirrorImage:this.state.type ? true: false,})
      .then((data) =>{ this.setState({spinner: false},()=>{this.props.navigation.navigate(this.props.navigation.getParam('nxt',"ChoosedPhoto"),{photoUri: data.uri,nxt: this.props.navigation.getParam("screenToGo",null)});})})
      .catch(err => console.error(err));
    }
  }
  changeType= ()=>{
    this.setState({type : this.state.type^1})
  }
  render() {
    if (this.state.camera=="denied" || this.state.camera=="undetermined" || this.state.camera=="none" ){
      return (
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
      )
    }
    if (this.state.camera=="authorized"){
    return (
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={{
            height: hp('80%'),
            width: '100%',
          }}
          type={this.state.type}
        >
        <Spinner
          visible={this.state.spinner}
          textStyle={styles.spinnerTextStyle}
        />
        <View style={styles.btnContainer}>
          <TouchableOpacity style={styles.btnChange} onPress={this.changeType}>
            <Icon name="retweet" size={30} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnCapture} onPress={this.takePicture.bind(this)}>
            <Icon name="camera" size={60} color="#FFF" />
          </TouchableOpacity>
        </View>
        </RNCamera>

    );
  }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnContainer: {
    flexDirection: 'row',
    marginTop: hp('67%'),
    alignItems: 'center',
    marginHorizontal: wp('2%'),
  },
  btnChange: {
    width: wp('10%'),
    height: hp('6%'),
  },
  btnCapture: {
    marginHorizontal: wp('30%'),
    width: wp('18%'),
    height: hp('10'),
    justifyContent: 'center',
    alignItems: 'center'
  }

});
