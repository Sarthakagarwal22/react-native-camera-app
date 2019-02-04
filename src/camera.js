import React, { Component } from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Constants, ImagePicker, Permissions } from 'expo';

export default class CameraApp extends Component {
  state = {
    image: null,
    uploading: false,
  };

  componentDidMount(){
    console.log("CWM");
    let progress = this.props.configVar._retrieveData('Progress');
    if(progress){
      if(progress[this.props.buttontext])
      this.state.image = progress[this.props.buttontext];
    }
  }

  render() {
    let {
      image
    } = this.state;

    return (
      <View style={styles.container}>

        <Button onPress={this._takePhoto} title={this.props.buttontext} />

        {this._maybeRenderImage()}
        </View>
    );
  }

  _maybeRenderImage = () => {
    let {
      image
    } = this.state;

    if (!image) {
      return(
          <View style={styles.maybeRenderContainer}></View>
        )
    }

    return (
      <View
        style={styles.maybeRenderContainer}>
        <View
          style={styles.maybeRenderImageContainer}>
          <Image source={{ uri: image }} style={styles.maybeRenderImage} />
        </View>
      </View>
    );
  };

  _takePhoto = async () => {
    const {
      status: cameraPerm
    } = await Permissions.askAsync(Permissions.CAMERA);

    const {
      status: cameraRollPerm
    } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // only if user allows permission to camera AND camera roll
    if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
      let pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
      });

      this._handleImagePicked(pickerResult);
    }
  };

  
  _handleImagePicked = async pickerResult => {
    this.setState({image:pickerResult.uri})
    this.props.configVar._setCurrentImage(this.props.buttontext,pickerResult.uri)
    this.props.fromChildToParentCallback(this.props.buttontext)
}
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  maybeRenderUploading: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
  },
  maybeRenderContainer: {
    borderRadius: 3,
    elevation: 2,
    marginTop: 20,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 4,
      width: 4,
    },
    shadowRadius: 5,
    width: 100,
    height:100
  },
  maybeRenderImageContainer: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    overflow: 'hidden',
  },
  maybeRenderImage: {
    height: 100,
    width: 100,
  },
  maybeRenderImageText: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  }
});