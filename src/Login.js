import React, { useContext, useState } from "react";
import { View, Text, Image, StyleSheet, Alert } from "react-native";
import { TextInput, Button, IconButton } from "react-native-paper"; // decorate screen
import { db } from "../FirebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import {AuthContext} from "./AuthProvider";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const { user, setUser } = useContext(AuthContext);

  async function handleLogin() {
    try {
      console.log(email);
      console.log(password);
      const q = query(
        collection(db, "Tomatoes_users"),
        where("email", "==", email),where("password", "==", password)
      );
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        Alert.alert("Login Failed", "No user found with this account.");
        return; // Exit the function if no matching user is found
      }
  
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        setUser(doc.id);
        console.log("success");
        Alert.alert("Login Successfully");
      });
      
      navigation.navigate("Tomatoes_Screen");
      setEmail("");
      setPassword("");
    } catch (error) {
      alert("Error", error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/tomato_icon.png")}
        style={styles.logo}
      />
      <Text style={styles.appName}>Tomatoes Timer</Text>
      <TextInput
        label="Username"
        mode="outlined"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.passwordInputContainer}>
        <TextInput
          label="Password"
          mode="outlined"
          style={styles.passwordInput}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <IconButton
          icon={showPassword ? "eye-off" : "eye"}
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        />
      </View>
      <Button mode="contained" style={styles.button} onPress={handleLogin}>
        Login
      </Button>
      <Button
        mode="outlined"
        style={styles.button}
        onPress={() => navigation.navigate("Register")}
      >
        Register
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
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  appName: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  passwordInputContainer: {
    width: "80%",
    position: "relative",
  },
  passwordInput: {
    width: "100%",
    padding: 10,
    borderRadius: 5,
    marginBottom: 40, 
  },
  button: {
    width: "30%",
    marginBottom: 10,
    zIndex: 1,
  },
  registerText: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
  },
  eyeIcon: {
    position: "absolute",
    top: 14,
    right: 10,
    zIndex: 2, 
  },
});

export default Login;
