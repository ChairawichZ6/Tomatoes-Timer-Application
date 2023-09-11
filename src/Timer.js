import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Vibration,
  Modal,
  TextInput,
  Image,
  Alert,
} from "react-native";
import * as Progress from "react-native-progress";
import { Audio } from "expo-av";
import logoImage from "../assets/TimeMode.png";

const screen = Dimensions.get("window");

const formatNumber = (number) => `0${number}`.slice(-2);
const PHASES = [
  { name: "Work", duration: 25 * 60 }, // 25 minutes (0)
  { name: "Short Break", duration: 1 * 60 }, // 5 minutes (1)
  { name: "Work", duration: 25 * 60 }, // 25 minutes (2)
  { name: "Long Break", duration: 1 * 60 }, // 15 minutes
];

const getRemaining = (time) => {
  const mins = Math.floor(time / 60);
  const secs = time - mins * 60;
  return { mins: formatNumber(mins), secs: formatNumber(secs) };
};

const Timer = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [previousPhaseName, setPreviousPhaseName] = useState(""); // Store the name of the previous phase
  // Initialize the remainingSecs based on whether custom work duration is set or not
  const initialRemainingSecs = isCustomWorkTimeSet
    ? customWorkTime
    : PHASES[0].duration;
  const [remainingSecs, setRemainingSecs] = useState(initialRemainingSecs);

  const [isActive, setIsActive] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [customWorkTime, setCustomWorkTime] = useState(null); // mode time
  const [isCustomMode, setIsCustomMode] = useState(false); // mode time
  const [isModalVisible, setIsModalVisible] = useState(false); // Control the modal visibility
  const [customWorkTimeInput, setCustomWorkTimeInput] = useState("");
  const [isCustomWorkTimeSet, setIsCustomWorkTimeSet] = useState(false);
  const [shouldStartNextPhase, setShouldStartNextPhase] = useState(false);
  const [isTimerEndedTextVisible, setIsTimerEndedTextVisible] = useState(false);

  const { mins, secs } = getRemaining(remainingSecs);
  const progress = 1 - remainingSecs / PHASES[currentPhase].duration;

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setCurrentPhase(0);
    setRemainingSecs(PHASES[0].duration); // Reset to the default time of the current phase
    setIsActive(false);
    setIsTimerEndedTextVisible(false); // Hide the "Pomodoro Timer was ended" text
  };

  const handleAlertClose = () => {
    setIsAlertVisible(false); // Close the alert
    setShouldStartNextPhase(true); // start next phase manually

    // Check if the Long Break phase just ended (assuming it's the last phase)
    if (currentPhase === 3) {
      setIsTimerEndedTextVisible(true); // Show the timer ended text
    } else {
      setIsTimerEndedTextVisible(false); // Hide the timer ended text for other phases
    }
  };

  const playSound = async () => {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(require("../audio/ringing.mp3"));
      await soundObject.playAsync();
    } catch (error) {
      console.error("Failed to load and play sound", error);
    }
  };

  const handleDurationSelected = (durationInSeconds) => {
    if (customWorkTimeInput) {
      const selectedDurationInMinutes = parseInt(customWorkTimeInput, 10);

      // Check if the selected duration is within the range of 1 to 60 minutes
      if (selectedDurationInMinutes >= 1 && selectedDurationInMinutes <= 60) {
        const customDuration = selectedDurationInMinutes * 60; // Convert minutes to seconds
        setCustomWorkTime(customDuration);

        // Update the duration for work phases only
        const updatedPhases = [...PHASES];
        updatedPhases[0].duration = customDuration; // Update the first work phase
        updatedPhases[2].duration = customDuration; // Update the second work phase

        if (currentPhase === 0 || (currentPhase === 2 && isCustomMode)) {
          // If in phase 0 or phase 2 with custom mode, update remainingSecs
          setRemainingSecs(customDuration);
        }

        setCurrentPhase(0);
        setShouldStartNextPhase(true); // start the next phase manually (first work phase)
        setIsCustomWorkTimeSet(true);
        setIsModalVisible(false); // Close the modal
        setIsActive(false); // Timer is not started immediately
        setShouldStartNextPhase(false); // Reset the manual phase start flag
      } else {
        // Display an error message or handle the case where the selected duration is out of range
        Alert.alert(
          "Invalid Duration",
          "Work time must range between 1 to 60 min.",
          [{ text: "OK" }],
          { cancelable: false }
        );
      }
    }
  };

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setRemainingSecs((remainingSecs) => remainingSecs - 1);
      }, 1000);

      if (remainingSecs === 0) {
        // Store the name of the previous phase before updating the current phase
        const previousPhaseName = PHASES[currentPhase].name;

        if (isCustomMode && currentPhase == 2) {
          // If in custom mode and it's the third work phase, reset the timer to the custom work time
          setCurrentPhase(0);
          setRemainingSecs(customWorkTime);
        } else {
          // Otherwise, follow the predefined sequence
          setCurrentPhase((currentPhase + 1) % PHASES.length);
          setRemainingSecs(PHASES[(currentPhase + 1) % PHASES.length].duration);
        }

        // Start shaking the device for 3 seconds when the phase ends
        Vibration.vibrate([500, 500, 500], true);

        // Play a sound when the phase ends
        playSound();

        // Show an alert when the phase ends
        setIsAlertVisible(true);

        // Set the name of the previous phase in the state
        setPreviousPhaseName(previousPhaseName);

        setIsActive(false); // Pause the timer
      }
    } else if (!isActive && remainingSecs !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [
    isActive,
    remainingSecs,
    currentPhase,
    customWorkTime,
    isCustomMode,
    shouldStartNextPhase,
  ]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <Image source={logoImage} style={styles.logo} />
        </TouchableOpacity>
      </View>
      <View style={styles.timerContainer}>
        <Text style={styles.phaseText}>
          {`${currentPhase === 0 ? "Let's Focus" : PHASES[currentPhase].name} `}
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
            {isActive ? "Pause" : "Start"}
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
              {`The ${previousPhaseName} phase has ended..`}
            </Text>
            {isTimerEndedTextVisible && (
              <Text style={styles.timerEndedText}>
                Pomodoro Timer was ended.
              </Text>
            )}
            <TouchableOpacity
              onPress={handleAlertClose}
              style={styles.alertButton}
            >
              <Text style={styles.alertButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Enter your work time (1-60 minutes):
            </Text>
            <TextInput
              style={styles.modalInput}
              onChangeText={(text) => setCustomWorkTimeInput(text)}
              value={customWorkTimeInput}
              keyboardType="numeric"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={handleDurationSelected}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Set</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={[styles.modalButton, styles.cancelButton]}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07121B",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50,
  },
  timerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    position: "absolute",
    top: 0,
    right: 0,
    padding: 20,
  },
  logo: {
    width: 60,
    height: 60,
  },
  button: {
    borderWidth: 2,
    borderColor: "#FF851B",
    alignItems: "center",
    justifyContent: "center",
    width: screen.width / 5,
    height: screen.width / 5,
    borderRadius: screen.width / 10,
  },
  buttonText: {
    color: "#FF851B",
    fontSize: screen.width / 21,
  },
  toggleButton: {
    marginRight: 20,
    backgroundColor: "transparent",
  },
  phaseText: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 10,
  },
  timerText: {
    color: "#fff",
    marginBottom: 10,
    fontSize: screen.width / 6,
  },
  buttonReset: {
    backgroundColor: "#FF851B",
  },
  buttonTextReset: {
    color: "#fff",
  },
  // Alert styles
  alertOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  alertContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  alertText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  alertButton: {
    backgroundColor: "#FF851B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  alertButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: 200,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  modalButton: {
    flex: 1,
    backgroundColor: "#FF851B",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    paddingVertical: 10,
    marginRight: 10,
  },

  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },

  cancelButton: {
    backgroundColor: "#FF0000",
  },

  cancelButtonText: {
    color: "#fff",
  },
  timerEndedText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FF851B",
  },
});

export default Timer;
