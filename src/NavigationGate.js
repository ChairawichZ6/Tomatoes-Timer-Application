import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Timer from "./Timer"
import Profile from "./Profile"
import Task from "./Task"
// Import your app screens/components here
// For example:
// import HomeScreen from './path/to/HomeScreen';
// import LoginScreen from './path/to/LoginScreen';

const Tab = createBottomTabNavigator();

const NavigationGate = () => {
  // Replace the screens below with your actual screens/components
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Tomatoes" component={Timer} />
        <Tab.Screen name="Task" component={Task} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default NavigationGate;
