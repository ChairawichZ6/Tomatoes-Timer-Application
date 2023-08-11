import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import * as Progress from 'react-native-progress';

const screen = Dimensions.get('window');

const formatNumber = (number) => `0${number}`.slice(-2);
const PHASES = [
  { name: 'Work', duration: 25 * 60 }, // 25 minutes
  { name: 'Short Break', duration: 5 * 60 }, // 5 minutes
  { name: 'Long Break', duration: 15 * 60 }, // 15 minutes
];

const getRemaining = (time) => {
  const mins = Math.floor(time / 60);
  const secs = time - mins * 60;
  return { mins: formatNumber(mins), secs: formatNumber(secs) };
};

const Timer = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [remainingSecs, setRemainingSecs] = useState(PHASES[0].duration);
  const [isActive, setIsActive] = useState(false);
  const { mins, secs } = getRemaining(remainingSecs);
  const progress = 1 - remainingSecs / PHASES[currentPhase].duration;

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setCurrentPhase(0);
    setRemainingSecs(PHASES[0].duration);
    setIsActive(false);
  };

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setRemainingSecs((remainingSecs) => remainingSecs - 1);
      }, 1000);

      if (remainingSecs === 0) {
        setCurrentPhase((currentPhase + 1) % PHASES.length);
        setRemainingSecs(PHASES[(currentPhase + 1) % PHASES.length].duration);
      }
    } else if (!isActive && remainingSecs !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, remainingSecs, currentPhase]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.timerContainer}>
        <Text style={styles.phaseText}>
          {`${PHASES[currentPhase].name} (${PHASES[currentPhase].duration / 60} min)`}
        </Text>
        <Text style={styles.timerText}>{`${mins}:${secs}`}</Text>
        <Progress.Bar
          progress={progress}
          width={screen.width - 40}
          color="#FF851B"
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={toggle}
          style={[styles.button, styles.toggleButton]}
        >
          <Text style={[styles.buttonText, styles.toggleButtonText]}>
            {isActive ? 'Pause' : 'Start'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={reset}
          style={[styles.button, styles.buttonReset]}
        >
          <Text style={[styles.buttonText, styles.buttonTextReset]}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07121B',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderWidth: 2,
    borderColor: '#FF851B',
    alignItems: 'center',
    justifyContent: 'center',
    width: screen.width / 5,
    height: screen.width / 5,
    borderRadius: screen.width / 10,
  },
  buttonText: {
    color: '#FF851B',
    fontSize: screen.width / 21,
  },
  toggleButton: {
    marginRight: 20,
    backgroundColor: 'transparent',
  },
  phaseText: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 10,
  },
  timerText: {
    color: '#fff',
    marginBottom: 10,
    fontSize: screen.width / 6,
  },
  buttonReset: {
    backgroundColor: '#FF851B',
  },
  buttonTextReset: {
    color: '#fff',
  },
});

export default Timer;
