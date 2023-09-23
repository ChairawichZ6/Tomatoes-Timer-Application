import React, { useState, useContext, useEffect } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { AuthContext } from "./AuthProvider";
import { db } from "../FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "react-native-elements";
import CustomCheckbox from "./CustomCheckbox";

const screenWidth = Dimensions.get("window").width;
// Calculate the font size based on the screen width
const fontSize = screenWidth > 360 ? 24 : 16;
const buttonSizeFactor = screenWidth >= 768 ? 1.5 : 1;

const Profile = ({ navigation }) => {
  const { user, setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showScore, setShowScore] = useState(0);
  const [score, setScore] = useState(0); // score for music
  const [changeCardBG, setCardBG] = useState("");

  const cardBG = [
    "#f5f5f5",
    "#00ffff",
    "#4169e1",
    "#4b0082",
    "#98fb98",
    "#d2691e",
    "#dc143c",
    "#228b22",
    "#ff69b4",
    "#ffd700",
    "#ff6347",
  ];

  const customStyle = {
    backgroundColor: changeCardBG, // Your custom styles here
    padding: 10,
    marginBottom: 10,
  };

  useEffect(() => {
    InitScoreBG();
    const fetchData = async () => {
      try {
        const docRef = doc(db, "Tomatoes_users", user);
        const docSnap = await getDoc(docRef);
        const userData = docSnap.data();
        setEmail(userData.email || "");
        setPassword(userData.password || "");
        setAge(userData.age || "");
        setPhone(userData.phone || "");
        setShowScore(userData.score);
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

      navigation.navigate("Login_Screen", { screen: "Login" });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }
  // Function to navigate to the Tutorial screen
  const handleNavigateToTutorial = () => {
    navigation.navigate("Tutorial"); // Replace 'Tutorial' with the actual screen name of Tutorial component
  };
  // function to navigate to the Reward Screen
  const handleNavigateToReward = () => {
    navigation.navigate("Reward");
  };

  const handleNavigateToMusicApp = () => {
    navigation.navigate("ListMusic"); // Replace 'MusicPlayer' with the actual screen name of MusicPlayer component
  };

  // update Score to color_background
  const InitScoreBG = async () => {
    const docRef = doc(db, "Tomatoes_users", user);
    const docSnap = await getDoc(docRef);
    const newScore = docSnap.data().score; // store new score
    // condition for BG
    const scoreThresholds = [
      0, 100, 150, 250, 400, 500, 650, 800, 1000, 1200, 1400,
    ];
    let colorIndex = 0; // Initialize colorIndex to the default value

    // Use a loop to find the appropriate colorIndex based on the newScore
    for (let i = 0; i < scoreThresholds.length; i++) {
      if (newScore > scoreThresholds[i]) {
        colorIndex = i + 1;
      } else {
        break;
      }
    }

    setCardBG(cardBG[colorIndex]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>USER INFORMATION </Text>
      <View style={[styles.userInfo, customStyle]}>
        <View style={styles.infoCard}>
          <Image source={require("../assets/Human.png")} style={styles.logo} />
          <View style={styles.infoTextBorder}>
            <Text style={styles.emailText}>Username: {email}</Text>
            <View style={styles.passwordContainer}>
              <Text style={[styles.passwordText, { marginRight: 10 }]}>
                Password: {showPassword ? password : "********"}
              </Text>
              <CustomCheckbox
                status={showPassword ? "checked" : "unchecked"}
                onPress={() => setShowPassword(!showPassword)}
                color={showPassword ? "green" : "gray"}
              />
            </View>
            <Text style={styles.ScoreText}>Score: {showScore}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.infoText}>Phone: {phone}</Text>
            <Text style={styles.infoText}>Age: {age}</Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonRow}>
        <Button
          title="Reward"
          onPress={handleNavigateToReward}
          buttonStyle={[
            styles.rewardButton,
            screenWidth >= 768
              ? {
                  width: 150 * buttonSizeFactor,
                  height: 50 * buttonSizeFactor,
                  borderRadius: 25 * buttonSizeFactor,
                }
              : null,
          ]}
          titleStyle={styles.buttonText}
        />

        <Button
          title="Music Player"
          onPress={handleNavigateToMusicApp}
          buttonStyle={[
            styles.musicButton,
            screenWidth >= 768
              ? {
                  width: 150 * buttonSizeFactor,
                  height: 50 * buttonSizeFactor,
                  borderRadius: 25 * buttonSizeFactor,
                }
              : null,
          ]}
          titleStyle={styles.buttonText}
        />
      </View>
      <View style={styles.buttonRow}>
        <Button
          title="Tutorial"
          onPress={handleNavigateToTutorial}
          buttonStyle={[
            styles.tutorialButton,
            screenWidth >= 768
              ? {
                  width: 150 * buttonSizeFactor,
                  height: 50 * buttonSizeFactor,
                  borderRadius: 25 * buttonSizeFactor,
                }
              : null,
          ]}
          titleStyle={styles.buttonText}
        />
        <Button
          title="Logout"
          onPress={handleLogout}
          buttonStyle={[
            styles.logoutButton,
            screenWidth >= 768
              ? {
                  width: 150 * buttonSizeFactor,
                  height: 50 * buttonSizeFactor,
                  borderRadius: 25 * buttonSizeFactor,
                }
              : null,
          ]}
          titleStyle={styles.buttonText}
        />
      </View>
      <View style={styles.creditContainer}></View>
      <Text style={styles.credit}>Developed by Chairawit_63070034</Text>
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
    fontSize: fontSize,
    fontWeight: "bold",
    marginBottom: 10,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 10,
    maxWidth: 400,
    marginTop: 20,
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  ScoreText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#e80f0e",
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 0,
    borderWidth: 0,
    borderColor: "#F28500",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    textAlign: "center",
  },
  passwordText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  // Define the button style
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  button: {
    width: 150,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tutorialButton: {
    backgroundColor: "#0074e4",
    // borderRadius: 25,
    marginRight: 10,
  },
  musicButton: {
    backgroundColor: "#4caf50",
    // borderRadius: 25,
    marginRight: 10,
  },
  rewardButton: {
    backgroundColor: "#ff5733",
    // borderRadius: 25,
    marginRight: 10,
  },
  logoutButton: {
    backgroundColor: "#808080",
    // borderRadius: 25,
    marginLeft: screenWidth <= 360 ? "5%" : 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  logoutContainer: {
    alignItems: "center",
  },
  creditContainer: {
    alignItems: "center",
    marginTop: "auto",
  },
  credit: {
    textAlign: "center",
    color: "#999",
  },
});

export default Profile;
