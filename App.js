import React from 'react';
import NavigationGate from './src/NavigationGate';
import { AuthProvider } from './src/AuthProvider'; // Login systems
import { TimerProvider } from './src/TimerContext'; // timer systems

export default function App() {
  
  return (
    <AuthProvider>
      <TimerProvider>

      <NavigationGate />
      
      </TimerProvider>
    </AuthProvider>
  );
}
