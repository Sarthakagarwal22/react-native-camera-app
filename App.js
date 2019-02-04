import React from 'react';
import { StyleSheet, View, Text, Button, AppState} from 'react-native';
import CameraApp from './src/camera'
import ConfigVar from './config.js'

let positions = [];
let allPos = ["top","mid","bottom","left","right"];


export default class App extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      images: 0,
      appState: AppState.currentState,
    };
    this.receiveChildValue = this.receiveChildValue.bind(this);
  }
  
  receiveChildValue(value){
   positions.push(value);
   var k = allPos.filter(pos => positions.indexOf(pos)===-1);
   this.setState({images:5 - k.length});
  };
 

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    this.setState({appState:nextAppState});
    if (this.state.appState.match(/inactive|background/)) { 
    console.log("yesss123")     
      if(this.state.images !== 5){
         ConfigVar._processIncomplete();
      }
      else{ 
      if(ConfigVar.uploadQueue.length > 0){
        ConfigVar._uploadUnsuccessful();
      }
    }
  };
  if(this.state.appState.match(/active/)){
    console.log(ConfigVar._retrieveData('Progress'));
  }
}

  render(){
    return (
      <View style={styles.container}>
      <CameraApp style = {styles.top} buttontext="top" fromChildToParentCallback={this.receiveChildValue} configVar = {ConfigVar}> </CameraApp>
      <View style={styles.rowContainer}>
        <CameraApp style = {styles.left} buttontext="left" fromChildToParentCallback={this.receiveChildValue} configVar = {ConfigVar}> </CameraApp>
        <CameraApp style = {styles.mid} buttontext="mid" fromChildToParentCallback={this.receiveChildValue} configVar = {ConfigVar}> </CameraApp>
        <CameraApp style = {styles.right} buttontext="right" fromChildToParentCallback={this.receiveChildValue} configVar = {ConfigVar}> </CameraApp>
      </View> 
      <CameraApp style = {styles.bottom} buttontext="bottom" fromChildToParentCallback={this.receiveChildValue} configVar = {ConfigVar}> </CameraApp>
      
      {
        this.state.images === 5 &&
        <View>
          <Text>You have successfully updated all the pictures</Text>
          <Button title = "Upload" onPress = {()=>{ConfigVar._upload(ConfigVar.currentUpload)}} />    
        </View>
      }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:4,
    backgroundColor: '#fff',
    alignItems:'center'
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent:'space-between',
    backgroundColor: '#fff'
  }
});
