import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Alert,
  Vibration,
} from 'react-native';
import * as Progress from 'react-native-progress';
import { Audio } from 'expo-av';

const screen = Dimensions.get('window');

const formatNumber = (number) => `0${number}`.slice(-2);
const PHASES = [
  { name: 'Work', duration: 1 * 60 }, // 25 minutes
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
  const [isAlertVisible, setIsAlertVisible] = useState(false);
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
  
  const handleAlertClose = () => {
    toggle(); // Resume the timer
  };


  const playSound = async () => {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(require('../audio/ringing.mp3'));
      await soundObject.playAsync();
    } catch (error) {
      console.error('Failed to load and play sound', error);
    }
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

        // Start shaking the device for 3 seconds when the phase ends
        Vibration.vibrate([500, 500, 500], true);

        // Play a sound when the phase ends
        playSound();

        // Show an alert when the phase ends
        Alert.alert(
          'Phase Ended',
          `The ${PHASES[currentPhase].name} phase has ended.`,
          [
            {
              text: 'OK',
              onPress: () => {
                Vibration.cancel(); // Stop vibration
                handleAlertClose(); // Resume the timer
              },
            },
          ],
          { cancelable: false }
        );

        setIsActive(false); // Pause the timer
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
      {isAlertVisible && ( // Render the alert when isAlertVisible is true
        <View style={styles.alertOverlay}>
          <View style={styles.alertContainer}>
            <Text style={styles.alertText}>
              {`The ${PHASES[currentPhase].name} phase has ended.`}
            </Text>
            <TouchableOpacity onPress={handleAlertClose} style={styles.alertButton}>
              <Text style={styles.alertButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  // Alert styles
  alertOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  alertText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  alertButton: {
    backgroundColor: '#FF851B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  alertButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Timer;
