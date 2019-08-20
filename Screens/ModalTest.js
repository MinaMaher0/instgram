import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import I18n from '../src/utils/I18n';
export default class PostModal extends Component {
  constructor(props){
    super(props);
    this.state={
      vis: true,
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Modal
           visible={this.state.vis}
           onRequestClose={()=>{this.props.changeVis()}}
           transparent={true}
         >
         <TouchableOpacity
           style={{flex: 1,backgroundColor: 'rgba(52, 52, 52, 0.5)',justifyContent: 'center',
           alignItems: 'center',}}
           onPressOut={()=>{this.props.changeVis();this.setState({vis:false})}}>
            <TouchableWithoutFeedback >
              <View style={styles.itemsContainer}>
                <TouchableOpacity style={styles.touch}>
                  <Text style={styles.itemText}>{I18n.t('Report')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.touch}>
                  <Text style={styles.itemText}>{I18n.t('CopyLink')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.touch}>
                  <Text style={styles.itemText}>{I18n.t('TurnOnPostNotification')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.touch}>
                  <Text style={styles.itemText}>{I18n.t('ShareLink')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.touch}>
                  <Text style={styles.itemText}>{I18n.t('Unfollow')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.touch}>
                  <Text style={styles.itemText}>{I18n.t('Mute')}</Text>
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
    flex: 1,
  },
  itemsContainer: {
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('2.5%'),
    width: wp('65%'),
    backgroundColor: '#FFF',
    borderRadius: wp('1.5%')
  },
  touch: {
    marginVertical: hp('1%'),
  },
  itemText: {
    fontSize: wp('4%'),
    color: 'black',
  }
});
