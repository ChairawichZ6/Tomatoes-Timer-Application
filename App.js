import React, { useState } from 'react';
import NavigationGate from './src/NavigationGate';
import { AuthProvider } from './src/AuthProvider'; // Correct the import path here

export default function App() {
  
  return (
    <AuthProvider>
      <NavigationGate />
    </AuthProvider>
  );
}
