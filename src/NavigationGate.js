import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import Timer from "./Timer";
import Profile from "./Profile";
import Task from "./Task";
import Login from "./Login";
import Register from './Register';
import Tutorial from './Tutorial';
import Reward from './Reward';
import ListMusic from './ListMusic';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const Tomaotes_Screen= () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Timer') {
            iconName = 'clock-o'; 
          } else if (route.name === 'Task') {
            iconName = 'tasks'; 
          } else if (route.name === 'Profile') {
            iconName = 'user'; 
          }

          // Return the icon component
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Timer" component={Timer} />
      <Tab.Screen name="Task" component={Task} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

const Login_Screen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Tutorial" component={Tutorial} />
      <Stack.Screen name="Reward" component={Reward} />
      <Stack.Screen name="ListMusic" component={ListMusic} />
    </Stack.Navigator>
  );
};

const NavigationGate = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login_Screen" component={Login_Screen} />
        <Stack.Screen name="Tomatoes_Screen" component={Tomaotes_Screen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default NavigationGate;
