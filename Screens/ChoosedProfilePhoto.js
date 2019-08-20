import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { firebaseApp } from '../Screens/firebase';
import 'firebase/firestore';
import RNFetchBlob from 'react-native-fetch-blob'
import store from '../store';
import { withNavigation } from 'react-navigation';
import I18n from '../src/utils/I18n';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';


export default class ChoosedProfilePhoto extends Component {

  static navigationOptions = ({ navigation }) =>{
    const {params = {}} = navigation.state;
    return {
      headerRight: (
        <TouchableOpacity style={{marginRight: wp('4%')}} onPress={()=>params.radd()}>
          <Text style={{fontSize: wp('5%'),color: 'blue',fontWeight: 'bold' }}>{I18n.t('done')}</Text>
        </TouchableOpacity>
      )
    }
  };


  constructor(props){
    super(props);
    this.state= {
      uri: props.navigation.state.params.photoUri,
      spinner: false,
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
       radd: this.add
     });
  }

  uploadImage = ()=> {
    const Blob = RNFetchBlob.polyfill.Blob
    const fs = RNFetchBlob.fs
    const tempWindowXMLHttpRequest = window.XMLHttpRequest;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
    window.Blob = Blob

    var sd = firebaseApp.storage();
    const uploadUri = Platform.OS === 'ios' ? this.state.uri.replace('file://', '') : this.state.uri
    let uploadBlob = null
    const imageRef = sd.ref("profile").child('/test.jpg')
      fs.readFile(uploadUri, 'base64')
      .then((data) => {
        return Blob.build(data, { type: 'image/jpg;BASE64' })
      })
      .then((blob) => {
        uploadBlob = blob
        return imageRef.put(blob, { contentType: 'image/jpg' })
      })
      .then(() => {
        uploadBlob.close()
        return imageRef.getDownloadURL()
      })
      .then((url) => {
        window.XMLHttpRequest = tempWindowXMLHttpRequest;
        store.setState({imgURL:url});
        this.setState({spinner: true},()=>{this.props.navigation.navigate(this.props.navigation.state.params.nxt)});
      })
      .catch((error) => {
        this.setState({spinner: true});
        alert(error.message);
      })
  }

  add = ()=> {
    this.setState({spinner: true});
    this.uploadImage();
  }


  render() {
    return (
      <View style={styles.container}>
        <Spinner
          visible={this.state.spinner}
          textStyle={styles.spinnerTextStyle}
          />
        <Image
          style={{width: wp('80%'),height: hp('60%')}}
          source={{ uri : this.props.navigation.state.params.photoUri}}
          resizeMode='contain'
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
});
