import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

const CustomCheckbox = ({ status, onPress, color }) => {
    return (
        <TouchableOpacity onPress={onPress}>
          <View style={styles.checkboxContainer}>
            {status ? (
              <View style={[styles.checkbox, { backgroundColor: color }]} />
            ) : (
              <View style={styles.uncheckedCheckbox} />
            )}
          </View>
        </TouchableOpacity>
      );
    };
  
  const styles = StyleSheet.create({
    checkboxContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 8,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 3, 
      },
      uncheckedCheckbox: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderColor: "#007AFF",
      },
  });

export default CustomCheckbox;
