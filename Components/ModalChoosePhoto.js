import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import I18n from '../src/utils/I18n';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

export default class ModalChoosePhoto extends Component {


  constructor(props){
    super(props);
    this.state = {
      vis: false,
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
          onRequestClose={()=>{this.props.changeVis()}}
          transparent={true}
          >
          <TouchableOpacity
            style={{flex: 1,backgroundColor: 'rgba(52, 52, 52, 0.5)',justifyContent: 'center',
            alignItems: 'center',}}
            onPressOut={()=>{this.props.changeVis();this.setState({vis:false})}}
            >
            <TouchableWithoutFeedback >
              <View style={styles.itemsContainer}>
                <TouchableOpacity style={styles.touch} onPress={()=>{this.props.changeVis();this.setState({vis:false});this.props.navigation.navigate('cameras',{nxt: 'ChoosedProfilePhoto',screenToGo: this.props.nxt})}}>
                  <Text style={styles.itemText}>{I18n.t('takeFromCamera')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.touch} onPress={()=>{this.props.changeVis();this.setState({vis:false});this.props.navigation.navigate('Gallarys',{nxt: 'ChoosedProfilePhoto',screenToGo: this.props.nxt})}}>
                  <Text style={styles.itemText}>{I18n.t('chooseFromGallery')}</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  },
  touch: {
    marginVertical: hp('2%'),
  },
  itemText: {
    fontSize: wp('4%'),
    color: 'blue',
    fontWeight: 'bold',
  },
  itemsContainer: {
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('2.5%'),
    width: wp('65%'),
    backgroundColor: '#FFF',
    borderRadius: wp('1.5%')
  },
});
