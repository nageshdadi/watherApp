import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {Component} from 'react';
import Geolocation from '@react-native-community/geolocation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons from 'react-native-vector-icons/Entypo';
import Wather30 from '../images/Wather30.png';
import Wather29 from '../images/Wather29.png';
import Wather27 from '../images/Wather27.png';
import Wather20 from '../images/Wather20.png';
import Wather10 from '../images/Wather10.png';
interface IProps {}
interface IState {
  longitude: number;
  latitude: number;
  positionErrorMsg: string;
  currentCity: string;
  watherName: string;
  watherRegion: string;
  temp: string;
  userCity: string;
}
export class Home extends Component<IProps, IState> {
  state = {
    longitude: 0,
    latitude: 0,
    positionErrorMsg: '',
    currentCity: '',
    watherName: '',
    watherRegion: '',
    temp: '',
    userCity: '',
  };

  getCurrentLoactions = () => {
    Geolocation.getCurrentPosition(
      position => {
        this.setState(
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            positionErrorMsg: '',
          },
          () => {
            this.getCityName(this.state.latitude, this.state.longitude);
          },
        );
      },
      error => this.setState({positionErrorMsg: error.message}),
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
    );
  };
  getWatherData = async (city: string) => {
    const watherUrl = `http://api.weatherapi.com/v1/current.json?key=dbb705cdfc814910a4d60145232705&q=${city}`;
    const response = await fetch(watherUrl);
    const data = await response.json();
    if (response.ok) {
      console.log(data.location.name);
      console.log(data.current.temp_c);
      this.setState({
        watherName: data.location.name,
        watherRegion: data.location.region,
        temp: data.current.temp_c,
      });
    } else {
      console.log(data.error.message);
      Alert.alert('Warning!', `${data.error.message}`);
    }
  };
  getCityName = async (lat: number, long: number) => {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=2c707d7c25834ec5b9fb8361f430db51`;
    const response = await fetch(url);
    const data = await response.json();
    if (response.ok) {
      console.log(data.results[0].components.city);
      this.setState({currentCity: data.results[0].components.city}, () => {
        this.getWatherData(this.state.currentCity);
      });
    } else {
      Alert.alert('Warning!', `${data.error.message}`);
    }
  };
  componentDidMount() {
    this.getCurrentLoactions();
  }

  render() {
    const {longitude, latitude, currentCity, temp} = this.state;
    console.log(latitude, longitude, currentCity);
    let backImg = Wather30;
    if (temp !== '') {
      const tempValue = parseInt(temp);
      console.log(tempValue);
      console.log(typeof tempValue);
      if (tempValue > 30) {
        backImg = Wather30;
      } else if (tempValue >= 29) {
        backImg = Wather29;
      } else if (tempValue >= 27) {
        backImg = Wather27;
      } else if (tempValue >= 10) {
        backImg = Wather20;
      } else if (tempValue <= 10) {
        backImg = Wather10;
      }
    }

    return (
      <View style={styles.mainCrad}>
        <ImageBackground
          style={styles.backGroundImg}
          resizeMode="contain"
          source={backImg}>
          {temp !== '' && (
            <View style={styles.watherCard}>
              <Text style={styles.tempText}>
                {this.state.temp}{' '}
                <MaterialCommunityIcons
                  name="temperature-celsius"
                  size={40}
                  color="#fff"
                />{' '}
                <View>
                  <Text style={styles.cityText}>H: 33</Text>
                  <Text style={styles.cityText}>L: 23</Text>
                </View>
              </Text>

              <View>
                <Text style={styles.cityText}>
                  <Icons name="location-pin" size={20} color="#fff" />
                  {this.state.watherName}, {this.state.watherRegion}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.inputCard}>
            <TextInput
              style={styles.inputComponent}
              value={this.state.userCity}
              placeholder="Enter City Name"
              onChangeText={(newText: string) =>
                this.setState({userCity: newText.trim()})
              }
            />
            <TouchableOpacity
              style={styles.watherBtn}
              onPress={() => {
                this.getWatherData(this.state.userCity);
                this.setState({userCity: ''});
              }}>
              <Text style={styles.getWatherText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  mainCrad: {
    flex: 1,
  },
  backGroundImg: {
    height: 775,
    padding: 20,
  },
  inputComponent: {
    width: 250,
    height: 40,
    marginBottom: 30,
    backgroundColor: '#d3d4d2',
    paddingLeft: 15,
    borderRadius: 10,
  },
  inputCard: {
    position: 'absolute',
    top: 450,
    left: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  watherBtn: {
    backgroundColor: '#d3d4d2',
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
    marginTop: 30,
    borderRadius: 10,
  },
  getWatherText: {
    fontSize: 18,
  },
  watherCard: {
    position: 'absolute',
    top: 80,
    left: 180,
    padding: 10,
  },
  tempText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '500',
  },
  cityText: {
    color: '#ffff',
    width: 180,
    marginTop: 10,
    fontSize: 10,
  },
});
export default Home;
