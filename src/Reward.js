import React, { useState, useEffect, useContext} from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as Progress from "react-native-progress";
import { useNavigation } from "@react-navigation/native";
import { Button as PaperButton } from "react-native-paper";
//database
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { AuthContext } from "./AuthProvider";

// Import your reward images
import poor from "../assets/reward_picture/Poor.jpg";
import common from "../assets/reward_picture/Common.jpg";
import rare from "../assets/reward_picture/Legend.jpg";
import questionGif from "../assets/reward_picture/question.gif";


const Reward = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [isReadyToOpen, setIsReadyToOpen] = useState(true); // Initially, the user is ready to open
  const [remainingTime, setRemainingTime] = useState(60); // 1 minute in seconds
  const { user, setUser } = useContext(AuthContext); 

  const navigation = useNavigation();

  useEffect(() => {
    let timer;
    if (isVisible) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            setIsReadyToOpen(true); // Set to "Ready" when timer runs out
            setIsVisible(false); // Set the picture back to question.gif when timer runs out
            return 0;
          }
        });
      }, 1000);
    } else {
      setRemainingTime(0);
    }

    return () => clearInterval(timer);
  }, [isVisible]);

  const revealRandomPicture = () => {
    if (!isVisible && isReadyToOpen) {
      // Create an array of your reward images
      const rewardImages = [poor, common, rare];

      // Randomly select one image from the array
      const randomIndex = Math.floor(Math.random() * rewardImages.length);
      const selectedImage = rewardImages[randomIndex];

      setSelectedPicture(selectedImage);
      setIsVisible(true);

      // Reset the timer for the next 1 minute
      setRemainingTime(60);
      setIsReadyToOpen(false); // Set to "Not Ready" when revealing a picture

      // Define alert title and message based on the selected image
    let alertTitle;
    let alertMessage;
    if (selectedImage === rare ) {
      UpdateScore(100);
      alertTitle = "Congratulation";
      alertMessage = "You got a Golden Tomato!";
    } else if (selectedImage === common) {
      UpdateScore(40);
      alertTitle = "Not Bad";
      alertMessage = "You got a Silver Tomato";
    } else if (selectedImage === poor) {
      UpdateScore(10);
      alertTitle = "Nice Try";
      alertMessage = "You got a Rotten Tomato";
    }

    Alert.alert(
      alertTitle,
      alertMessage,
      [
          {
            text: "OK",
            onPress: () => console.log("OK Pressed"),
          },
        ]
      );
    }
  };

  const handleNavigateToProfile = () => {
    navigation.navigate("Tomatoes_Screen", { screen: "Profile" });
  };
  // update Score User
  const UpdateScore  =  async (score) => {
    const docRef =  doc(db, "Tomatoes_users", user);
    const docSnap = await getDoc(docRef);
    await updateDoc(docRef,{ score : docSnap.data().score + score})
    console.log(docSnap.data());
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
      <Text style={styles.claimRewardTitle}>Claim Reward</Text>
      </View>
      <TouchableOpacity
        onPress={revealRandomPicture}
        style={styles.imageContainer}
      >
        {isVisible ? (
          // Render the selected reward image when visible
          <Image source={selectedPicture} style={styles.image} />
        ) : (
          // Render the question.gif as a cover when not visible
          <Image source={questionGif} style={styles.image} />
        )}
      </TouchableOpacity>
      <Text style={styles.timerText}>Time until next reveal:</Text>
      <Progress.Bar
          progress={remainingTime / 60}
          width={300} 
          height={20} 
          borderWidth={0}
          color="green" 
          unfilledColor="gray" 
          borderColor="transparent"
          borderRadius={10}
          useNativeDriver={true} // Improve performance
        />
       <Text style={styles.secondsText}>{remainingTime} seconds left</Text>
      <PaperButton
        mode="contained"
        onPress={revealRandomPicture}
        style={[
          styles.button,
          { backgroundColor: isReadyToOpen ? "green" : "red" }, // Set button background color
        ]}
        disabled={!isReadyToOpen || isVisible} // Disable the button when not ready or when the picture is already visible
        labelStyle={{ color: "white" }} // Set text color to white
      >
        {isReadyToOpen ? "Ready to Open" : "Not Ready"}
      </PaperButton>
      <PaperButton
        mode="outlined"
        onPress={handleNavigateToProfile}
        style={styles.button}
      >
        Back to Profile
      </PaperButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  titleContainer: {
    backgroundColor: 'black',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    position: 'absolute', 
    top: 0, 
    zIndex: 1,
    borderBottomLeftRadius: 50, // Adjust this value for oval shape
    borderBottomRightRadius: 50, // Adjust this value for oval shape
    overflow: 'hidden'
  },
  claimRewardTitle: {
    fontSize: 32, 
    fontWeight: 'bold', 
    color: 'yellow', 
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 10,
  },
  image: {
    width: 300,
    height: 300,
  },
  button: {
    marginTop: 20,
    width: 200,
  },
  timerText: {
    fontSize: 20, 
    marginTop: 16, 
  },
  secondsText: {
    fontSize: 20, 
    fontWeight: 'bold', 
    marginTop: 8, 
  },
});

export default Reward;

//เหลือทำร่วมกับ Score System
