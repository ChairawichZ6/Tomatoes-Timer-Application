import React, { createContext, useContext, useState } from 'react';

const TimerContext = createContext();

const PHASES = [
    { name: "Work", duration: 25 * 60 }, // 25 minutes (0)
    { name: "Short Break", duration: 5 * 60 }, // 5 minutes (1)
    { name: "Work", duration: 25 * 60 }, // 25 minutes (2)
    { name: "Long Break", duration: 15 * 60 }, // 15 minutes (3)
  ];

export const TimerProvider = ({ children }) => {
    const [remainingSecs, setRemainingSecs] = useState(0);
    const [currentPhase, setCurrentPhase] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [customWorkTime, setCustomWorkTime] = useState(null);
    const [isCustomMode, setIsCustomMode] = useState(false);
    // const [isCustomWorkTimeSet, setIsCustomWorkTimeSet] = useState(false);
  

  return (
    <TimerContext.Provider  value={{
        currentPhase,
        remainingSecs,
        isActive,
        customWorkTime,
        isCustomMode,
        setCurrentPhase,
        setRemainingSecs,
        setIsActive,
        setCustomWorkTime,
        setIsCustomMode,
        PHASES, 
      }}>
        {children}
      </TimerContext.Provider>
    );
  };
  
  export const useTimer = () => {
    return useContext(TimerContext);
  };