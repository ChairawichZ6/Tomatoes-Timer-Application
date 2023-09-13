import React, { useContext, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { TextInput, Button } from "react-native-paper"; // decorate screen
import { db } from "../FirebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import {AuthContext} from "./AuthProvider";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        alert("Login Failed", "No user found with this email.");
        return; // Exit the function if no matching user is found
      }
  
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        setUser(doc.id);
        console.log("success");
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
      <Text style={styles.registerText}>
        Don't have an account?{" "}
        <Text
          style={{ ...styles.registerLink, color: "#007bff" }}
        >
          Register Now!
        </Text>
      </Text>
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
  button: {
    width: "80%",
    marginBottom: 10,
  },
  registerText: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
  },
});

export default Login;
