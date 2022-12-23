import React, { useRef, useState, useEffect } from 'react';
import {
  Animated,
  Text,
  View,
  StyleSheet,
  Button,
  TouchableWithoutFeedback,
} from 'react-native';
import { Audio } from 'expo-av';
import KnockedText from './components/KnockedText';

const useGetState = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const valueRef = useRef(value).current;
  valueRef.current = value;
  const getValue = () => valueRef.current;
  return [value, setValue, getValue];
};

const App = () => {
  // fadeAnim will be used as the value for opacity. Initial Value: 0
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
    }).start();
  };

  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
    }).start();
  };

  const heightAnim = useRef(new Animated.Value(200)).current;

  const scaleIn = () => {
    fadeAnim.setValue(1);
    Animated.timing(heightAnim, {
      toValue: 210,
      duration: 100,
    }).start();
  };

  const scaleOut = () => {
    fadeAnim.setValue(1);
    Animated.timing(heightAnim, {
      toValue: 200,
      duration: 100,
    }).start();
  };

  const spring = () => {
    fadeAnim.setValue(1);
    Animated.spring(heightAnim, {
      toValue: 210,
      friction: 2,
      tension: 140,
    }).start();
  };

  const [knockList, setKnockList, getKnockList] = useGetState([]);
  const soundRef = useRef();
  useEffect(() => {
    Audio.Sound.createAsync(require('./assets/muyu.mp3')).then(({ sound }) => {
      soundRef.current = sound;
    });
    spring();
  }, []);
  const knock = () => {
    fadeAnim.setValue(1);
    Animated.sequence([
      Animated.timing(heightAnim, {
        toValue: 200,
        duration: 100,
      }),
      Animated.timing(heightAnim, {
        toValue: 210,
        duration: 100,
      }),
    ]).start((finished) => {
      console.log(finished);
    });
    setKnockList([...knockList, Date.now()]);
    setTimeout(() => {
      const _knockList = getKnockList();
      _knockList.shift();
      setKnockList([..._knockList]);
    }, 1500);
    soundRef.current.replayAsync();
  };

  return (
    <View style={styles.container}>
      <View style={styles.imgContainer}>
        {knockList.map((ts) => (
          <KnockedText key={ts} />
        ))}
        <TouchableWithoutFeedback onPress={knock}>
          <Animated.Image
            style={[
              styles.img,
              {
                opacity: fadeAnim, // Bind opacity to animated value
              },
              {
                height: heightAnim,
              },
            ]}
            resizeMode="stretch"
            source={require('./assets/muyu.jpeg')}
          />
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.buttonRow}>
        <Button title="Fade In" onPress={fadeIn} />
        <Button title="Fade Out" onPress={fadeOut} />
        <Button title="Spring" onPress={spring} />
      </View>
      <View style={styles.buttonRow}>
        <Button title="Scale In" onPress={scaleIn} />
        <Button title="Scale Out" onPress={scaleOut} />
        <Button title="Knock" onPress={knock} />
      </View>
      {/* <Text>{knockList}</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgContainer: {
    width: 210,
    height: 260,
    backgroundColor: 'black',
    justifyContent: 'flex-end',
  },
  img: {
    width: 210,
  },
  buttonRow: {
    flexDirection: 'row',
    marginVertical: 16,
  },
});

export default App;
