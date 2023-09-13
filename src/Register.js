import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { db } from "../FirebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { Alert } from "react-native";

const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");

  async function handleRegister() {
    if (!email || !password || !age || !phone) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (email.length < 8) {
      Alert.alert("Error", "UserID must be at least 8 characters.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters.");
      return;
    }

    if (!/^[0]\d{9}$/.test(phone)) {
      Alert.alert(
        "Error",
        "Phone number must start with 0 and be followed by 9 digits."
      );
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "Tomatoes_users"), {
        email: email,
        password: password,
        age: age,
        phone: phone,
      });
      console.log("Document written with ID: ", docRef.id);
      Alert.alert("Success", "Registration successful.");
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("Error", "An error occurred while registering.");
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        label="UserID"
        mode="outlined"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        label="Password"
        mode="outlined"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        label="Age"
        mode="outlined"
        style={styles.input}
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />
      <TextInput
        label="Phone"
        mode="outlined"
        style={styles.input}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <Button mode="contained" style={styles.button} onPress={handleRegister}>
        Register
      </Button>
      <Button
        mode="outlined"
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        Back to Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "80%",
    marginBottom: 10,
  },
  button: {
    width: "80%",
    marginBottom: 10,
  },
});

export default Register;
