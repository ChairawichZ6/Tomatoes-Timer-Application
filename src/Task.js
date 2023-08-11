import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Checkbox, Card, Title, Paragraph } from 'react-native-paper';

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
    const updatedTaskList = [...taskList];
    updatedTaskList.splice(index, 1);
    setTaskList(updatedTaskList);
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
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteTask(index)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
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
