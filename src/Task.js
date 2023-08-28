import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { Checkbox, Card, Title, Paragraph } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons"; // Import MaterialIcons from Expo vector icons
import { db } from "../FirebaseConfig";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { AuthContext } from "./AuthProvider";

const Task = () => {
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const { user } = useContext(AuthContext);
  const [ isEdit, setIsEdit ] = useState(false);
  const [ item, setItem ] = useState();

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

  const handleAddTask = async () => {
    try {
      const docRef = await addDoc(collection(db, "Task_users"), {
        task: task,
        description: description,
        status: false,
        userId: user,
      });
      console.log("Document written with ID: ", docRef.id);

      fetchData();
      setTask("");
      setDescription("");

      Alert.alert("Success", "Add Task successful.");
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("Error", "An error occurred while registering.");
    }
  };

  const handleEditTask = (item) => {
    setTask(item.task_name);
    setDescription(item.task_des);
    setIsEdit(true);
    setItem(item);
  };

  const handleUpdate = async () => {
    const documentRef = doc(db, "Task_users", item.id);
    const updatedData = {
      task: task,
      description: description,
    };
    try {
      await updateDoc(documentRef, updatedData);
      console.log("Task updated successfully");
    } catch (error) {
      console.error("Error updating task:", error);
    }
    setTask("");
    setDescription("");
    setIsEdit(false);
    fetchData();
  };
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

  const handleDeleteTask = (index) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async() => {
            await deleteDoc(doc(db, "Task_users", index));
            fetchData();
          },
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Title style={styles.title}>To-Do List</Title>
      <TextInput
        style={styles.input}
        placeholder="Add a task..."
        value={task}
        onChangeText={(text) => setTask(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Add a description..."
        value={description}
        onChangeText={(text) => setDescription(text)}
      />

      {isEdit ? (
        <TouchableOpacity style={styles.addButton} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      )}

      <ScrollView style={styles.taskList}>
        {taskList.map((item, index) => (
          <Card
            key={`${item.id}_${index}`} // Use a combination of ID and index as the key
            style={[
              styles.taskCard,
              item.status && styles.completedTaskCard,
            ]}
          >
            <Card.Content>
              <View style={styles.taskItem}>
                <Checkbox
                  status={
                    item.status ? "checked" : "unchecked"
                  }
                  onPress={() => handleCheck(item)}
                  color="#007AFF"
                />
                <View style={styles.taskTextContainer}>
                  <Text
                    style={[
                      styles.taskText,
                      item.status && styles.completedTaskText,
                    ]}
                  >
                    {item.task_name}
                  </Text>
                  {item.task_des.trim() !== "" && (
                    <Text style={styles.descriptionText}>{item.task_des}</Text>
                  )}
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => handleEditTask(item)}
                    style={styles.editButton}
                  >
                    <MaterialIcons name="edit" size={24} color="#007AFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteTask(item.id)}
                    style={styles.deleteButton}
                  >
                    <MaterialIcons name="delete" size={24} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F6F6F6",
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
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
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    justifyContent: "space-between", // Aligns children to the start and end
  },
  taskTextContainer: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    marginRight: 10,
    color: "#007AFF",
  },
  editButtonText: {
    color: "#007AFF",
  },
  deleteButton: {
    color: "#FF3B30",
  },
  deleteButtonText: {
    color: "#FF3B30",
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

export default Task;
