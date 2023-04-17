import React from 'react';
import {View, StyleSheet} from 'react-native';
import getColors from '../util/COLORS';

const propStyle = (percent, base_degrees) => {
  const rotateBy = base_degrees + (percent * 3.6);
  return {
    transform:[{rotateZ: `${rotateBy}deg`}]
  };
}

const renderThirdLayer = (percent, size) => {
  if(percent > 50){
    return <View style={[
        styles.secondProgressLayer, propStyle((percent - 50), 45), { width: size, height: size }
    ]} />
  }else{
    return <View style={{...styles.offsetLayer, width: size, height: size }} />
  }
}

const CircularProgress = ({ percent, size = 64 }) => {
  var firstProgressLayerStyle;
  if(percent > 50){
    firstProgressLayerStyle = propStyle(50, -135);
  }else {
    firstProgressLayerStyle = propStyle(percent, -135);
  }

  return(
    <View style={{
        ...styles.container,
        width: size,
        height: size,
    }}>
      <View style={[
            styles.firstProgressLayer,
            firstProgressLayerStyle,
            { width: size, height: size }
        ]} />
      {renderThirdLayer(percent, size)}
    </View>
  );
}

const COLORS = getColors();

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    borderWidth: 5,
    borderRadius: 1024,
    borderColor: COLORS.GREY,
    justifyContent: 'center',
    alignItems: 'center',
    position: "relative"
  },
  firstProgressLayer: {
    width: 200,
    height: 200,
    borderWidth: 5,
    borderRadius: 1024,
    position: 'absolute',
    borderLeftColor: COLORS.GREY,
    borderLeftWidth: 0,
    borderBottomColor: COLORS.GREY,
    borderBottomWidth: 0,
    borderRightColor: COLORS.GREEN,
    borderTopColor: COLORS.GREEN,
    transform:[{rotateZ: '-135deg'}]
  },
  secondProgressLayer:{
    width: 200,
    height: 200,
    position: 'absolute',
    borderWidth: 5,
    borderRadius: 1024,
    borderLeftColor: COLORS.GREY,
    borderBottomColor: COLORS.GREY,
    borderRightColor: COLORS.GREEN,
    borderTopColor: COLORS.GREEN,
    transform: [{rotateZ: '45deg'}]
  },
  offsetLayer: {
    width: 200,
    height: 200,
    position: 'absolute',
    borderWidth: 5,
    borderRadius: 1024,
    borderLeftColor: COLORS.ALPHA_GREEN,
    borderBottomColor: COLORS.ALPHA_GREEN,
    borderRightColor: COLORS.GREY,
    borderTopColor: COLORS.GREY,
    transform:[{rotateZ: '-135deg'}]
  }
});

export default CircularProgress;