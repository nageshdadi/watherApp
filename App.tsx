import React, {Component} from 'react';
import {PermissionsAndroid} from 'react-native';
import Home from './src/components/Home';
export class App extends Component {
  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Cool location App map Permission',
          message:
            'Cool location App needs access to your map ' +
            'so you can vhech locations.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the map');
      } else {
        console.log('map permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  componentDidMount(): void {
    this.requestCameraPermission();
  }
  render() {
    return <Home />;
  }
}

export default App;
