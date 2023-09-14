import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const windowWidth = Dimensions.get("window").width;

const tutorialData = [
  {
    title: "Welcome to MyApp",
    image: require("../assets/tutorial_picture/tutorial_1.png"),
    description: "Swipe left to begin the tutorial.",
  },
  {
    title: "Page 2",
    image: require("../assets/tutorial_picture/tutorial_2.png"),
    description: "Swipe left to continue.",
  },
  {
    title: "Page 3",
    image: require("../assets/tutorial_picture/tutorial_3.png"),
    description: "Keep swiping left.",
  },
  {
    title: "Page 4",
    image: require("../assets/tutorial_picture/tutorial_4.png"),
    description: "Almost there!",
  },
  {
    title: "Page 5",
    image: require("../assets/tutorial_picture/tutorial_5.png"),
    description: "Just a few more steps.",
  },
  {
    title: "Page 6",
    image: require("../assets/tutorial_picture/tutorial_6.png"),
    description: "Almost done.",
  },
  {
    title: "Page 7",
    image: require("../assets/tutorial_picture/tutorial_7.png"),
    description: "Last step!",
  },
];

const icons = [
  "directions-walk",
  "mood-bad",
  "local-cafe",
  "attach-money",
  "settings",
  "star",
  "thumb-up",
];

const Tutorial = ({ navigation }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef();
  
  // const navigation = useNavigation();
  
  const handleNextPage = () => {
    if (currentPage < tutorialData.length - 1) {
      const nextPage = currentPage + 1;
      scrollViewRef.current.scrollTo({
        x: nextPage * windowWidth,
        animated: true,
      });
      setCurrentPage(nextPage);
    }
  };

  const handleNavigateToMain = () => {
    // Navigate to the main menu screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'Tutorial' }],
    });
    navigation.navigate("Tomatoes_Screen", { screen: "Tomatoes" });
  };

  

  
  const iconColors = ["indigo", "red", "green", "gold", "brown", "orange", "blue"];

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollContainer}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const xOffset = event.nativeEvent.contentOffset.x;
          const page = Math.round(xOffset / windowWidth);
          setCurrentPage(page);
        }}
        scrollEventThrottle={200}
      >
        {tutorialData.map((item, index) => (
          <View key={index} style={styles.pageContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Image source={item.image} style={styles.image} />
            <View style={styles.iconContainer}>
              <Icon name={icons[index]} size={40} color={iconColors[index]} />
            </View>
          </View>
        ))}
      </ScrollView>
      {currentPage < tutorialData.length - 1 ? (
        <TouchableOpacity
          onPress={handleNextPage}
          style={styles.arrowContainer}
        >
          <Icon name="keyboard-arrow-right" size={40} color="blue" />
        </TouchableOpacity>
      ) : (
        <View style={styles.buttonContainer}>
          <Button
            title="START USING TOMATOES TIMER NOW"
            onPress={handleNavigateToMain}
            color="red"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    flex: 1,
    width: windowWidth,
  },
  pageContainer: {
    width: windowWidth,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: 40, // Adjust the marginTop to move content up
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginTop: 20, // Adjust the marginTop to move image up
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20, // Adjust marginBottom to move text up
  },
  iconContainer: {
    marginTop: 10, // Adjust marginTop to move icon up
  },
  arrowContainer: {
    position: "absolute",
    bottom: 40, // Adjust the bottom position to move the arrow up
    right: 20,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
  },
});

export default Tutorial;
