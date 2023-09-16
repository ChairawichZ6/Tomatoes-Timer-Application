import React, { useState, useEffect, useRef, useContext } from "react";
import { View, Text, StyleSheet, Image, Button, Alert } from "react-native";
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";
import Icon from "react-native-vector-icons/MaterialIcons";

//database
import { doc, getDoc } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { AuthContext } from "./AuthProvider";

const ListMusic = ({ navigation }) => {
  const audioFiles = [
    {
      id: "audio1",
      source: require("../audio/M1.mp3"),
      title: "The First Song",
      cover: require("../assets/Tomato_Music.jpg"),
      score: 0,
    },
    {
      id: "audio2",
      source: require("../audio/M2.mp3"),
      title: "Song_#2",
      cover: require("../assets/Tomato_Music.jpg"),
      score: 100,
    },
    {
      id: "audio3",
      source: require("../audio/M3.mp3"),
      title: "Song_#3",
      cover: require("../assets/Tomato_Music_T1.jpg"),
      score: 200,
    },
    {
      id: "audio4",
      source: require("../audio/M4.mp3"),
      title: "Song_#4",
      cover: require("../assets/Tomato_Music_T1.jpg"),
      score: 300,
    },
    {
      id: "audio5",
      source: require("../audio/M5.mp3"),
      title: "Song_#5",
      cover: require("../assets/Tomato_Music_T1.jpg"),
      score: 400,
    },
    {
      id: "audio6",
      source: require("../audio/M6.mp3"),
      title: "Song_#6",
      cover: require("../assets/Tomato_Music_T1.jpg"),
      score: 500,
    },
    {
      id: "audio7",
      source: require("../audio/M7.mp3"),
      title: "Song_#7",
      cover: require("../assets/Tomato_Music_T1.jpg"),
      score: 600,
    },
    {
      id: "audio8",
      source: require("../audio/M8.mp3"),
      title: "Song_#8",
      cover: require("../assets/Tomato_Music_T2.jpg"),
      score: 700,
    },
    {
      id: "audio9",
      source: require("../audio/M9.mp3"),
      title: "Song_#9",
      cover: require("../assets/Tomato_Music_T2.jpg"),
      score: 800,
    },
    {
      id: "audio10",
      source: require("../audio/M10.mp3"),
      title: "The Last Song",
      cover: require("../assets/Tomato_Music_T2.jpg"),
      score: 900,
    },
  ];

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [position, setPosition] = useState(0);
  const soundObject = useRef(null);
  const { user, setUser } = useContext(AuthContext); //database user
  const [score, setScore] = useState(0); // score for music
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  const loadAudio = async (audio) => {
    if (soundObject.current) {
      await soundObject.current.unloadAsync();
    }

    try {
      setIsAudioLoading(true);
      await soundObject.current.loadAsync(audio.source);
      setIsAudioLoading(false);
      setSelectedAudio(audio);
    } catch (error) {
      setIsAudioLoading(false);
      console.error("Error loading audio:", error);
    }
  };

  const playAudio = async (audio, index) => {
    if (score >= audioFiles[index].score) {
      if (isPlaying) {
        await soundObject.current.stopAsync();
        setIsPlaying(false);
      }

      if (audio) {
        await loadAudio(audio);

        if (!isAudioLoading) {
          try {
            await soundObject.current.playAsync();
            setIsPlaying(true);
            setCurrentTrackIndex(index);

            soundObject.current.setOnPlaybackStatusUpdate(async (status) => {
              if (status.didJustFinish) {
                await soundObject.current.setPositionAsync(0);
              }
            });
          } catch (error) {
            console.error("Error playing audio:", error);
          }
        }
      }
    } else {
      Alert.alert("Your SCORE ", "MUST ABOVE THAN " + audioFiles[index].score, [
        {
          text: "OK",
          onPress: () => console.log("OK Pressed"),
        },
      ]);
    }
  };

  const pauseAudio = async () => {
    if (isPlaying) {
      await soundObject.current.pauseAsync();
      setIsPlaying(false);
    }
  };

  const playNextTrack = async () => {
    const nextIndex = (currentTrackIndex + 1) % audioFiles.length;
    const nextAudio = audioFiles[nextIndex];
    await playAudio(nextAudio, nextIndex);
  };

  const playPreviousTrack = async () => {
    const previousIndex =
      (currentTrackIndex - 1 + audioFiles.length) % audioFiles.length;
    const previousAudio = audioFiles[previousIndex];
    await playAudio(previousAudio, previousIndex);
  };

  const onSliderValueChange = async (value) => {
    if (selectedAudio) {
      const newPosition =
        value * (await soundObject.current.getStatusAsync()).durationMillis;
      await soundObject.current.setPositionAsync(newPosition);
      setPosition(newPosition);
    }
  };

  useEffect(() => {
    InitScoreMusic();
    soundObject.current = new Audio.Sound();
    // Preload the first audio file
    (async () => {
      const { sound } = await Audio.Sound.createAsync(audioFiles[0].source);
      soundObject.current = sound;
      // Start playing "Audio 1" by default
      await playAudio(audioFiles[0], 0);
    })();

    return () => {
      if (soundObject.current) {
        soundObject.current.unloadAsync();
      }
    };
  }, []);

  const currentAudio = audioFiles[currentTrackIndex];

  // update Score to Music
  const InitScoreMusic = async () => {
    const docRef = doc(db, "Tomatoes_users", user);
    const docSnap = await getDoc(docRef);
    await setScore(docSnap.data().score);
    // console.log(score);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Tomatoes Music Player</Text>
      </View>
      <Image
        source={currentAudio ? currentAudio.cover : null}
        style={styles.coverImage}
      />

      <Text style={styles.currentTrack}>
        {currentTrackIndex !== null ? `Now Playing: ${currentAudio.title}` : ""}
      </Text>
      <View style={styles.buttonContainer}>
        <Icon
          name="skip-previous"
          size={32}
          color="white"
          onPress={playPreviousTrack}
          style={styles.previousButton}
        />

        <Icon
          name="skip-next"
          size={32}
          color="white"
          onPress={playNextTrack}
          style={styles.nextButton}
        />
      </View>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={position / 1000} // Assuming position is in milliseconds
        onValueChange={onSliderValueChange}
        disabled={!isPlaying}
      />

      <Icon
        name={isPlaying ? "pause" : "play-arrow"}
        size={32}
        color="white"
        onPress={
          isPlaying
            ? pauseAudio
            : () => playAudio(currentAudio, currentTrackIndex)
        }
        style={[styles.button, { backgroundColor: isPlaying ? "red" : "gray" }]}
      />

      <Button
        title="Back to Profile"
        onPress={() =>
          navigation.navigate("Tomatoes_Screen", {
            screen: "Profile",
          })
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    backgroundColor: "darkblue",
    alignItems: "center",
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 24,
    position: "absolute",
    top: 0,
    zIndex: 1,
    borderBottomLeftRadius: 30, // Adjust this value for oval shape
    borderBottomRightRadius: 30, // Adjust this value for oval shape
    overflow: "hidden",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFA500",
    textTransform: "uppercase",
  },
  coverImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  currentTrack: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  previousButton: {
    backgroundColor: "blue",
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  nextButton: {
    backgroundColor: "green",
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  slider: {
    width: "80%",
    marginTop: 20,
  },
});

export default ListMusic;
