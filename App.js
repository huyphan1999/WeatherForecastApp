import React from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
  ScrollView,
} from 'react-native';

import {Dimensions} from 'react-native';

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

// Utils
import {getRequest} from './utils/api';
import getImageForWeather from './utils/getImageForWeather';
import getIconForWeather from './utils/getIconForWeather';

// Search component
import SearchInput from './SearchInput';

// MomentJS
import moment from 'moment';

const baseUrl = 'http://cloudtemp.tk/iot';

const TempComponent = ({temp, title}) => {
  return (
    <View style={styles.defaultContainer}>
      <Text style={[styles.smallText, styles.textStyle]}>
        {getIconForWeather('Heavy Cloud')}
      </Text>
      <Text style={[styles.smallText, styles.textStyle]}>{title}</Text>
      <Text style={[styles.smallText, styles.textStyle]}>
        {`${Math.round(temp)}°C`}
      </Text>
    </View>
  );
};

// CLASS
export default class App extends React.Component {
  constructor(props) {
    super(props);

    // bind SCOPE
    this.handleDate = this.handleDate.bind(this);

    // STATE
    this.state = {
      loading: false,
      error: false,
      location: 'Kiev',
      temperature: 0,
      currentTemp: 0,
      nextTemp: 0,
      afterOneHourTemp: 0,
      predictTemp: 0,
      weather: 'Heavy Cloud',
      created: '2000-01-01T00:00:00.000000Z',
    };
  }
  // Life cycle
  componentDidMount() {
    this.getData();
  }

  // Parse of date
  handleDate = date => moment(date).format('hh:mm:ss');

  // Update current location
  getData = async () => {
    // if (!city) return;

    this.setState({loading: true}, async () => {
      try {
        console.log('Getting');
        const {current_temperature, next_temperature} = await getRequest(
          baseUrl + '/timeNext',
        );

        const {next_temperature: nextTempOneHour} = await getRequest(
          baseUrl + '/time1h',
        );

        this.setState({
          loading: false,
          error: false,
          currentTemp: current_temperature,
          nextTemp: next_temperature,
          afterOneHourTemp: nextTempOneHour,
        });
      } catch (e) {
        console.log(e);
        this.setState({
          loading: false,
          error: true,
        });
      }
    });
  };

  handleSubmit = async temp => {
    // if (!city) return;

    this.setState({loading: true}, async () => {
      try {
        console.log('Getting');
        const {next_temperature: predictTemp} = await getRequest(
          baseUrl + `/${temp}`,
        );

        console.log('Predict Temp', predictTemp);
        this.setState({
          loading: false,
          error: false,
          predictTemp: predictTemp,
        });
      } catch (e) {
        console.log(e);
        this.setState({
          loading: false,
          error: true,
        });
      }
    });
  };

  // RENDERING
  render() {
    // GET values of state
    const {
      loading,
      error,
      currentTemp,
      nextTemp,
      predictTemp,
      afterOneHourTemp,
    } = this.state;

    // Activity
    return (
      <View style={styles.container} behavior="padding">
        <StatusBar barStyle="light-content" />

        <ImageBackground
          source={getImageForWeather('Showers')}
          style={styles.imageContainer}
          imageStyle={styles.image}>
          <View style={styles.detailsContainer}>
            <ActivityIndicator animating={loading} color="white" size="large" />

            {!loading && (
              <View>
                {error && (
                  <Text style={[styles.smallText, styles.textStyle]}>
                    😞 Could not load weather. Please try again later...
                  </Text>
                )}
                {!error && (
                  <View>
                    <Text style={[styles.largeText, styles.textStyle]}>
                      Thủ đức
                    </Text>
                    <SearchInput
                      placeholder="Temperature"
                      onSubmit={this.handleSubmit}
                    />
                    <View style={styles.scrollViewCotainer}>
                      <TempComponent temp={currentTemp} title="Now" />
                      <TempComponent temp={nextTemp} title="Next" />
                      <TempComponent temp={afterOneHourTemp} title="After 1h" />
                      <TempComponent temp={predictTemp} title="Predict" />
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>
        </ImageBackground>
      </View>
    );
  }
}

/* StyleSheet */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495E',
  },
  imageContainer: {
    flex: 1,
  },
  defaultContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  scrollViewCotainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: width * 0.07,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 20,
  },
  textStyle: {
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
    color: 'white',
  },
  largeText: {
    fontSize: 44,
  },
  smallText: {
    fontSize: 18,
  },
});
