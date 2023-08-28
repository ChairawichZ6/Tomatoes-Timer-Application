import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Timer from "./Timer";
import Profile from "./Profile";
import Task from "./Task";
import Login from "./Login";
import Register from './Register';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const Tomaotes_Screen= () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Tomatoes" component={Timer} />
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
