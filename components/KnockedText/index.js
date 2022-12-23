import React, { useRef, useState, useEffect } from 'react';
import { Animated, Text, View, StyleSheet, Button, Easing } from 'react-native';

const KnockedText = () => {
  const topAnim = useRef(new Animated.Value(60)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.timing(topAnim, {
      toValue: 20,
      duration: 1000,
    }).start();
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      easing: Easing.in(Easing.ease),
    }).start();
  }, [])
  return <Animated.Text style={[
    styles.textWrap,
    {
      top: topAnim,
      opacity: fadeAnim,
    }
  ]}>+1 功德</Animated.Text>;
};

const styles = StyleSheet.create({
  textWrap: {
    position: 'absolute',
    zIndex: 1,
    alignSelf: 'center',
    color: '#fff',
  },
});

export default KnockedText;
