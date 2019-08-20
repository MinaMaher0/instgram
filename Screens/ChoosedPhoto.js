import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Switch,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { StackActions, NavigationActions } from 'react-navigation';
import RNFetchBlob from 'react-native-fetch-blob'
import { firebaseApp } from './firebase';
import 'firebase/firestore';
import "firebase/storage";
import store from '../store';
import uuid from 'react-native-uuid';
import Spinner from 'react-native-loading-spinner-overlay';
import I18n from '../src/utils/I18n';




export default class ChoosedPhoto extends Component {

  static navigationOptions = ({ navigation }) =>{
    const {params = {}} = navigation.state;
    return {
      title: `${I18n.t('NewPost')}`,
      headerRight: (
        <TouchableOpacity style={{marginRight: wp('4%')}} onPress={()=>params.radd()}>
          <Text style={{fontSize: wp('5%'),color: 'blue',fontWeight: 'bold' }}>{I18n.t('Share')}</Text>
        </TouchableOpacity>
      )
    }
  };

  constructor(props) {
    super(props);
    this.state={
      trunOffComments: false,
      description: '',
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

    const Fetch = RNFetchBlob.polyfill.Fetch
    // replace built-in fetch
    window.fetch = new Fetch({
        // enable this option so that the response data conversion handled automatically
        auto : true,
        // when receiving response data, the module will match its Content-Type header
        // with strings in this array. If it contains any one of string in this array,
        // the response body will be considered as binary data and the data will be stored
        // in file system instead of in memory.
        // By default, it only store response data to file system when Content-Type
        // contains string `application/octet`.
        binaryContentTypes : [
            'image/',
            'video/',
            'audio/',
            'foo/',
        ]
    }).build()
    var sd = firebaseApp.storage();
    const uploadUri = Platform.OS === 'ios' ? this.state.uri.replace('file://', '') : this.state.uri
    let uploadBlob = null
    const imageRef = sd.ref("posts").child(`${store.getState().uid}/${uuid.v1()}.jpg`)
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
        this.addPost(url);
      })
      .catch((error) => {
        this.setState({spinner: false});
        alert(error.message);
      })
  }

  add = ()=> {
    this.setState({spinner: true})
    this.uploadImage();
  }

  addPost = (url) => {
    var db = firebaseApp.firestore();
    db.collection("posts").doc().set({
        uid: store.getState().uid,
        name: store.getState().usrName,
        description: this.state.description,
        likes: [],
        comments: [],
        trunOffComments: this.state.trunOffComments,
        image: url,
        myTimeStamp: new Date(),
    })
    .then(()=>{
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'tab' })],
        });
        this.setState({spinner: false});
        this.props.navigation.dispatch(resetAction);
    })
    .catch(function(error) {
      this.setState({spinner: false});
      console.error("Error adding document: ", error);
    });
  }
  switchClc = () =>{
    this.setState({trunOffComments : !this.state.trunOffComments});
  }
  render() {
    return (
      <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === "ios" ? "padding" : null}>
        <View  style={styles.container}>
          <Spinner
            visible={this.state.spinner}
            textStyle={styles.spinnerTextStyle}
            />
          <Image
            style={{width: wp('80%'),height: hp('40%')}}
            source={{ uri : this.props.navigation.state.params.photoUri}}
            resizeMode='contain'
            />
          <TextInput
            placeholder={I18n.t('WriteACaption')}
            style={styles.txtInput}
            value={this.state.description}
            onChangeText={(description)=>this.setState({description})}
            multiline={true}
            />
          <View style={styles.commentContainer}>
            <Text style={styles.commentText}>{I18n.t('TurnOffCommenting')}</Text>
            <View style={styles.switchs}>
              <Switch
                disabled={false}
                value={this.state.trunOffComments}
                onValueChange={this.switchClc}
                />
            </View>
          </View>
          <View style={{ flex : 1 }} />
        </View>

      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "flex-end",
  },
  txtInput: {
    marginTop: hp('4%'),
    width: wp('90%'),
    minHeight: hp('10%'),
    borderWidth: .2,
    paddingHorizontal: wp('3%'),
    fontSize: wp('4%'),
  },
  commentContainer: {
    flexDirection: 'row',
    width: wp('90%'),
    marginTop: hp('5%')
  },
  commentText: {
    fontSize: wp('5%'),
    color: 'black'
  },
  switchs: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems:  'flex-end'
  }
});
