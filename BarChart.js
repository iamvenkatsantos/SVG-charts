import React, {Component} from 'react';
import App from './App';
import {StyleSheet, View} from 'react-native';
class BarCharts extends Component {
  render() {
   
    return (
      <View style={styles.container}>
        <App data={data} round={100} unit="€" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});

export default BarCharts;
