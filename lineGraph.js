import React, {Component} from 'react';

import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TextInput,
  ScrollView,
} from 'react-native';
import * as path from 'svg-path-properties';
import Svg, {Path, G, Defs, LinearGradient, Stop} from 'react-native-svg';

import * as shape from 'd3-shape';

const d3 = {
  shape,
};

import {scaleLinear, scaleTime} from 'd3-scale';

class LineGraph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      x: new Animated.Value(0),
    };
  }
  componentDidMount() {
    this.state.x.addListener(({value}) => this.moveCursor(value));
    this.moveCursor(0);
  }

  moveCursor = value => {
    const {x, y} = this.properties.getPointAtLength(this.lineLength - value);
    this.cursor.current.setNativeProps({
      top: y - this.cursorRadius,
      left: x - this.cursorRadius,
    });
    const labletext = this.scaleY.invert(y);
    this.lable.current.setNativeProps({
      text: `${labletext} V`,
    });

    const timetext = this.scaleX.invert(x);
    const iso = timetext.split(" ");
    console.log(iso);

    this.time.current.setNativeProps({
      text: `${timetext}`,
    });
  };

  showmenu = () => {
    return (
      <View style={showmenu}>
        <Text>hiii works</Text>
      </View>
    );
  };

  render() {
    this.cursor = React.createRef();
    this.lable = React.createRef();
    this.time = React.createRef();
    const height = 200;
    const {width} = Dimensions.get('window');
    this.cursorRadius = 15;
    const data = [
      {x: new Date(2019, 9, 23), y: 23},
      {x: new Date(2019, 9, 24), y: 50},
      {x: new Date(2019, 10, 12), y: 80},
      {x: new Date(2019, 10, 16), y: 100},
      {x: new Date(2019, 10, 28), y: 203},
      {x: new Date(2019, 10, 30), y: 400},
      {x: new Date(2019, 11, 1), y: 550},
      {x: new Date(2019, 11, 16), y: 750},
      {x: new Date(2019, 11, 23), y: 800},
      {x: new Date(2019, 12, 6), y: 900},
    ];

    const paddingVertical = 5;
    this.scaleX = scaleTime()
      .domain([new Date(2019, 9, 23), new Date(2019, 12, 6)])
      .range([0, width]);
    this.scaleY = scaleLinear()
      .domain([0, 900])
      .range([height - paddingVertical, paddingVertical]);

    const line = d3.shape
      .line()
      .x(d => this.scaleX(d.x))
      .y(d => this.scaleY(d.y))
      .curve(d3.shape.curveBasis)(data);

    this.properties = path.svgPathProperties(line);
    this.lineLength = this.properties.getTotalLength();
    const {x} = this.state;
    const translateX = this.state.x.interpolate({
      inputRange: [0, this.lineLength],
      outputRange: [width - 150, 0],
      extrapolate: 'clamp',
    });

    return (
      <SafeAreaView style={styles.root}>
        <View style={{...styles.container, width: width * 0.9}}>
          <Text style={styles.text}> Total Out for Selected Station </Text>
          <Svg
            {...{width: width * 0.9, height}}
            style={{borderBottomRightRadius: 15, borderBottomLeftRadius: 15}}>
            <G>
              <Defs>
                <LinearGradient
                  id="Gradient1"
                  x1="50%"
                  y1="0%"
                  x2="50%"
                  y2="100%">
                  <Stop stopColor="#FFC370" offset="0%" />
                  <Stop stopColor="#FFC370" offset="80%" />
                  {/* F9F9F9 
                   F9B043
                   F98339
                   */}
                  <Stop stopColor="#FFC370" offset="100%" />
                </LinearGradient>
              </Defs>
              <Path
                d={line}
                fill="transparent"
                stroke="#FF8C19"
                fillOpacity={0.7}
                onLongPress={this.showmenu}
                strokeWidth={10}
              />
              <Path
                d={`${line} L ${width} ${height} L 0 ${height}`}
                fill="url(#Gradient1)"
              />
              <Path
                d={line}
                fill="transparent"
                stroke="#FF8C19"
                fillOpacity={0.7}
                onLongPress={this.showmenu}
                strokeWidth={10}
              />
              <Path
                d={`${line} L ${width} ${height} L 0 ${height}`}
                fill="url(#Gradient1)"
              />
              <View ref={this.cursor} style={styles.cursor} />
            </G>
          </Svg>
          {/* <Text>{JSON.stringify(translateX)}</Text> */}
          <Animated.View style={[styles.label]}>
            <TextInput ref={this.lable} />
            <TextInput ref={this.time} />
          </Animated.View>

          <Animated.ScrollView
            style={StyleSheet.absoluteFill}
            contentContainerStyle={{width: width * this.lineLength}}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={5}
            bounces={true}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {x},
                  },
                },
              ],
              {useNativeDriver: true},
            )}
            horizontal
          />
        </View>
      </SafeAreaView>
    );
  }
}

export default LineGraph;

const height = 400;
const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    marginTop: 60,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 20,
    backgroundColor: 'white',
    shadowOffset: {width: 5, height: 5},
    shadowColor: 'black',
    shadowOpacity: 1.0,
    borderRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingTop: 20,
  },
  svgimage: {
    height,
    width,
  },
  cursor: {
    height: 25,
    width: 25,
    borderRadius: 15,
    borderWidth: 4,
    backgroundColor: 'white',
    borderColor: '#FF8C19',
  },
  label: {
    borderColor: '#FFA426',
    backgroundColor: 'white',
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 10,
    left: 4,
    top: 50,
  },
  text: {
    fontSize: 16,
    color: 'black',
    alignSelf: 'center',
    fontWeight: '400',
  },
});
