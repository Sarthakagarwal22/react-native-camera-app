import {AsyncStorage} from 'react-native';

let allPos = ["top","mid","bottom","left","right"] 

class Config {
	constructor(){
		this.uploadSuccessful = false;
		this.uploadQueue = [];
		this.currentUpload = {
			top:"",
			mid:"",
			bottom:"",
			left:"",
			right:""
		};
	}
	
	_storeData = async (key,value) => {
	  try {
	    await AsyncStorage.setItem(key, JSON.stringify(value));
	  } catch (error) {
	    console.log("Error saving data")
	  }
	}

	_retrieveData = async (key) => {
		try{
			var item = await AsyncStorage.getItem(key);
			var value = JSON.parse(item)
			return value;
		} catch (error){
			console.log("Could not find the item")
		}
	}

	_setCurrentImage = async(key,value) => {
		this.currentUpload[key] = value;
	}

	_upload = (itemsToUpload) => {
		Object.keys(itemsToUpload).map((key) => this.uploadQueue.push(itemsToUpload[key]));
		this.uploadQueue.map((file)=> {
			setTimeout(()=>{
				console.log(this.file+"uploaded")
				this.uploadQueue.shift();
			},1000)	
		})
	}

	_uploadUnsuccessful = () => {
		this._storeData('uploadQueue',this.uploadQueue);
	}

	_completeLastUpload = () => {
		if(this._retrieveData('uploadQueue')){
			_upload(this._retrieveData('uploadQueue'))
		}
	}

	_processIncomplete = () => {
		this._storeData('Progress',this.currentUpload);
		console.log(this.currentUpload);
	}
}

const ConfigVar = new Config();
 
 export default ConfigVar;