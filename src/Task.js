import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Checkbox, Card, Title, Paragraph } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons from Expo vector icons

const Task = () => {
  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');
  const [taskList, setTaskList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);

  const handleAddTask = () => {
    if (task.trim()) {
      if (editIndex !== null) {
        const updatedTaskList = [...taskList];
        updatedTaskList[editIndex] = {
          text: task,
          description: description,
          completed: completedTasks.includes(editIndex),
        };
        setTaskList(updatedTaskList);
        setEditIndex(null);
      } else {
        setTaskList([...taskList, { text: task, description: description, completed: false }]);
      }
      setTask('');
      setDescription('');
    }
  };

  const handleEditTask = (index) => {
    setTask(taskList[index].text);
    setDescription(taskList[index].description);
    setEditIndex(index);
  };

  const handleDeleteTask = (index) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedTaskList = [...taskList];
            updatedTaskList.splice(index, 1);

            // Remove the index from completedTasks if it exists
            const updatedCompletedTasks = completedTasks.filter((item) => item !== index);

            setTaskList(updatedTaskList);
            setCompletedTasks(updatedCompletedTasks);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleToggleComplete = (index) => {
    if (completedTasks.includes(index)) {
      setCompletedTasks(completedTasks.filter((item) => item !== index));
    } else {
      setCompletedTasks([...completedTasks, index]);
    }
  };

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
      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.buttonText}>{editIndex !== null ? 'Update' : 'Add'}</Text>
      </TouchableOpacity>
      <ScrollView style={styles.taskList}>
        {taskList.map((item, index) => (
          <Card
            key={index}
            style={[
              styles.taskCard,
              completedTasks.includes(index) && styles.completedTaskCard,
            ]}
          >
            <Card.Content>
              <View style={styles.taskItem}>
                <Checkbox
                  status={completedTasks.includes(index) ? 'checked' : 'unchecked'}
                  onPress={() => handleToggleComplete(index)}
                  color="#007AFF"
                />
                <View style={styles.taskTextContainer}>
                  <Text
                    style={[
                      styles.taskText,
                      item.completed && styles.completedTaskText,
                    ]}
                  >
                    {item.text}
                  </Text>
                  {item.description.trim() !== '' && (
                    <Text style={styles.descriptionText}>{item.description}</Text>
                  )}
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => handleEditTask(index)}
                    style={styles.editButton}
                  >
                    <MaterialIcons name="edit" size={24} color="#007AFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteTask(index)}
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
    backgroundColor: '#F6F6F6',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  taskList: {
    flex: 1,
  },
  taskCard: {
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 5,
  },
  completedTaskCard: {
    backgroundColor: '#C9E9C6',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between', // Aligns children to the start and end
  },
  taskTextContainer: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    marginRight: 10,
    color: '#007AFF',
  },
  editButtonText: {
    color: '#007AFF',
  },
  deleteButton: {
    color: '#FF3B30',
  },
  deleteButtonText: {
    color: '#FF3B30',
  },
  taskText: {
    flex: 1,
    fontSize: 16,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
  },
});

export default Task;
