import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import * as Progress from "react-native-progress";
import { Audio } from "expo-av";
import logoImage from "../assets/TimeMode.png";
import { Card, List } from "react-native-paper";
import CustomCheckbox from "./CustomCheckbox";
//database
import { db } from "../FirebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { AuthContext } from "./AuthProvider";
import { useTimer } from "./TimerContext";

const screen = Dimensions.get("window");

const formatNumber = (number) => `0${number}`.slice(-2);

const getRemaining = (time) => {
  const mins = Math.floor(time / 60);
  const secs = time - mins * 60;
  return { mins: formatNumber(mins), secs: formatNumber(secs) };
};

const Timer = () => {
  const [previousPhaseName, setPreviousPhaseName] = useState(""); // Store the name of the previous phase
  // Initialize the remainingSecs based on whether custom work duration is set or not

  const {
    isActive,
    remainingSecs,
    currentPhase,
    customWorkTime,
    isCustomMode,
    PHASES,
    setCurrentPhase,
    setRemainingSecs,
    setIsActive,
    setCustomWorkTime,
    setIsCustomMode,
  } = useTimer();

  const initialRemainingSecs = PHASES[currentPhase].duration;

  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // Control the modal visibility
  const [customWorkTimeInput, setCustomWorkTimeInput] = useState("");
  const [shouldStartNextPhase, setShouldStartNextPhase] = useState(false);
  const [isTimerEndedTextVisible, setIsTimerEndedTextVisible] = useState(false);

  //UserData
  const [taskList, setTaskList] = useState([]);
  const { user } = useContext(AuthContext);

  const { mins, secs } = getRemaining(remainingSecs);
  const progress = 1 - remainingSecs / PHASES[currentPhase].duration;

  const toggle = () => {
    setIsActive((prevIsActive) => !prevIsActive);
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
      const selectedDurationInMinutes = parseFloat(customWorkTimeInput, 10);

      // Check if the selected duration is a valid integer and within the range of 1 to 60 minutes
      if (
        Number.isInteger(selectedDurationInMinutes) && // Check if it's an integer
        selectedDurationInMinutes >= 1 &&
        selectedDurationInMinutes <= 60
      ) {
        const customDuration = Math.round(selectedDurationInMinutes * 60); // Convert minutes to seconds and round to the nearest integer
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
  //TaskData from Task
  const fetchData = async () => {
    try {
      const q = query(
        collection(db, "Task_users"),
        where("userId", "==", user)
      );
      const querySnapshot = await getDocs(q);

      const newData = [];
      querySnapshot.forEach((doc) => {
        const data = {
          id: doc.id,
          task_name: doc.data().task,
          task_des: doc.data().description,
          status: doc.data().status,
        };
        newData.push(data);
      });

      setTaskList(newData); // Update the taskList state after the loop
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  //Task handleCheck
  const handleCheck = async (item) => {
    const documentRef = doc(db, "Task_users", item.id);
    const updatedData = {
      status: !item.status,
    };
    try {
      await updateDoc(documentRef, updatedData);
      console.log("Task status updated successfully");
    } catch (error) {
      console.error("Error updating task status:", error);
    }
    fetchData();
  };

  useEffect(() => {
    fetchData();
    let interval = null;

    // Check if the Timer component has just mounted
    if (!isActive && remainingSecs === 0) {
      const initialRemainingSecs = PHASES[currentPhase].duration;
      setRemainingSecs(initialRemainingSecs);
      setIsActive(false);
    }

    if (isActive) {
      if (remainingSecs === 0) {
        // Handle phase change or timer end when remainingSecs reaches 0
        const previousPhaseName = PHASES[currentPhase].name;
        if (isCustomMode && currentPhase === 2) {
          setCurrentPhase(0);
        } else {
          const nextPhase = (currentPhase + 1) % PHASES.length;
          setCurrentPhase(nextPhase);
        }
        playSound();
        setIsAlertVisible(true);
        setPreviousPhaseName(previousPhaseName);
        setIsActive(false); // Pause the timer
        return; // Exit early to prevent negative remainingSecs
      }
      // If isActive is true and remainingSecs is not 0, decrement remainingSecs
      interval = setInterval(() => {
        setRemainingSecs((prevRemainingSecs) => prevRemainingSecs - 1);
      }, 1000);
    } else if (!isActive && remainingSecs !== 0) {
      clearInterval(interval);
    }

    // When isActive changes to true, reset remainingSecs to the initial duration
    if (isActive && remainingSecs === 0) {
      const initialRemainingSecs = PHASES[currentPhase].duration;
      setRemainingSecs(initialRemainingSecs);
    }

    return () => clearInterval(interval);
  }, [isActive, remainingSecs, currentPhase, isCustomMode]);

  const formatTime = (minutes, seconds) => {
    return `${formatNumber(minutes)}:${formatNumber(seconds)}`;
  };

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
        <Text style={styles.timerText}>{formatTime(mins, secs)}</Text>
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

      <View style={styles.taskListContainer}>
        <Text style={styles.taskListTitle}>TASK TODAY</Text>
        <View style={styles.separator} />
        <ScrollView //Task Card
          style={styles.taskList}
          contentContainerStyle={{ marginBottom: 16 }}
        >
          {taskList.map((item, index) => (
            <Card
              key={`${item.id}_${index}`}
              style={[styles.taskCard, item.status && styles.completedTaskCard]}
            >
              <List.Item
                title={item.task_name}
                description={item.task_des}
                left={() => (
                  <CustomCheckbox
                    status={item.status ? "checked" : "unchecked"}
                    onPress={() => handleCheck(item)}
                    color={item.status ? "green" : "gray"} // Use green when checked, blue when unchecked
                  />
                )}
                style={styles.taskItem}
              />
            </Card>
          ))}
        </ScrollView>
      </View>
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
    zIndex: 1,
  },
  alertContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    zIndex: 2,
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
  // Task Card
  taskList: {
    flex: 1,
  },
  taskCard: {
    backgroundColor: "white",
    marginBottom: 10,
    borderRadius: 5,
  },
  completedTaskCard: {
    backgroundColor: "#C9E9C6",
  },
  //Task Card
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  taskListContainer: {
    flex: 1,
    marginTop: 40,
    marginBottom: 10,
    marginLeft: 16,
  },
  taskListTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "white",
  },
  separator: {
    height: 2,
    backgroundColor: "#ccc",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  taskCard: {
    marginBottom: 16,
    borderRadius: 10,
    elevation: 2,
    marginLeft: 16,
    marginRight: 16,
  },
  completedTaskCard: {
    backgroundColor: "#C9E9C6",
  },
  taskTextContainer: {
    flex: 1,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
  },
  completedTaskText: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  descriptionText: {
    fontSize: 14,
    color: "#555",
  },
});

export default Timer;
