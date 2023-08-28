import React, { useState, useContext, useEffect } from "react";
import { View, Text, Button, Image, StyleSheet } from "react-native";
import { AuthContext } from "./AuthProvider";
import { db } from "../FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Checkbox } from "react-native-paper";

const Profile = ({ navigation }) => {
  const { user, setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "Tomatoes_users", user);
        const docSnap = await getDoc(docRef);
        const userData = docSnap.data();
        setEmail(userData.email || "");
        setPassword(userData.password || "");
        setAge(userData.age || "");
        setPhone(userData.phone || "");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (user !== "") {
      fetchData();
    }
  }, [user]);

  async function handleLogout() {
    try {
      setUser("");
      
      navigation.navigate("Login_Screen");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      <View style={styles.userInfo}>
        <View style={styles.infoCard}>
          <Image source={require("../assets/Human.png")} style={styles.logo} />
          <View style={styles.infoTextBorder}>
            <Text style={styles.emailText}>Email: {email}</Text>
            <Text style={styles.emailText}>Password: {showPassword ? password : "********"}</Text>
            <Checkbox
              status={showPassword ? "checked" : "unchecked"}
              onPress={() => setShowPassword(!showPassword)}
              color="#007bff"
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.infoText}>Phone: {phone}</Text>
            <Text style={styles.infoText}>Age: {age}</Text>
          </View>
        </View>
      </View>
      <Button title="Logout" onPress={handleLogout} />
      <Text style={styles.credit}>Credit: Developed by Chairawit</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: "center", // Center the image
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginHorizontal: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  infoTextBorder: {
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 10,
    marginBottom: 10,
  },
  emailText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  boldText: {
    fontWeight: "bold",
  },
  credit: {
    position: "absolute",
    bottom: 20,
    textAlign: "center",
    color: "#999",
  },
});

export default Profile;
