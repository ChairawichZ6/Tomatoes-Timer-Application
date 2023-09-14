import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
} from "react-native";
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";
import Icon from "react-native-vector-icons/MaterialIcons";

class ListMusic extends Component {
  constructor(props) {
    super(props);

    this.audioFiles = [
      {
        id: "audio1",
        url: require("../audio/M1.mp3"),
        title: "The First Song",
        cover: require("../assets/Tomato_Music.jpg"),
      },
      {
        id: "audio2",
        url: require("../audio/M2.mp3"),
        title: "Song_#2",
        cover: require("../assets/Tomato_Music.jpg"),
      },
      {
        id: "audio3",
        url: require("../audio/M3.mp3"),
        title: "Song_#3",
        cover: require("../assets/Tomato_Music_T1.jpg"),
      },
      {
        id: "audio4",
        url: require("../audio/M4.mp3"),
        title: "Song_#4",
        cover: require("../assets/Tomato_Music_T1.jpg"),
      },
      {
        id: "audio5",
        url: require("../audio/M5.mp3"),
        title: "Song_#5",
        cover: require("../assets/Tomato_Music_T1.jpg"),
      },
      {
        id: "audio6",
        url: require("../audio/M6.mp3"),
        title: "Song_#6",
        cover: require("../assets/Tomato_Music_T1.jpg"),
      },
      {
        id: "audio7",
        url: require("../audio/M7.mp3"),
        title: "Song_#7",
        cover: require("../assets/Tomato_Music_T1.jpg"),
      },
      {
        id: "audio8",
        url: require("../audio/M8.mp3"),
        title: "Song_#8",
        cover: require("../assets/Tomato_Music_T2.jpg"),
      },
      {
        id: "audio9",
        url: require("../audio/M9.mp3"),
        title: "Song_#9",
        cover: require("../assets/Tomato_Music_T2.jpg"),
      },
      {
        id: "audio10",
        url: require("../audio/M10.mp3"),
        title: "The Last Song",
        cover: require("../assets/Tomato_Music_T2.jpg"),
      },
    ];

    this.state = {
      isPlaying: false,
      currentTrackIndex: null,
      selectedAudio: null,
      position: 0,
      soundObject: null,
    };
  }

  async componentDidMount() {
    const soundObject = new Audio.Sound();
    this.setState({ soundObject });

    // Preload the first audio file
    const { sound } = await Audio.Sound.createAsync(this.audioFiles[0].url);
    this.setState({ currentAudio: sound });

    // Start playing "Audio 1" by default
    await this.playAudio(this.audioFiles[0], 0);
  }

  componentWillUnmount() {
    if (this.state.soundObject) {
      this.state.soundObject.unloadAsync();
    }
  }

  async loadAudio(audio) {
    if (this.state.soundObject) {
      await this.state.soundObject.unloadAsync();
    }

    try {
      await this.state.soundObject.loadAsync(audio.url);
      this.setState({ selectedAudio: audio });
    } catch (error) {
      console.error("Error loading audio:", error);
    }
  }

  playAudio = async (audio, index) => {
    if (this.state.isPlaying) {
      await this.state.soundObject.stopAsync();
      this.setState({ isPlaying: false });
    }
  
    if (audio) {
      await this.loadAudio(audio);
  
      try {
        await this.state.soundObject.playAsync();
        this.setState({ isPlaying: true, currentTrackIndex: index });
  
        // Set up playback status update listener
        this.state.soundObject.setOnPlaybackStatusUpdate(async (status) => {
          if (status.didJustFinish) {
            // Audio finished playing, seek to the beginning to loop
            await this.state.soundObject.setPositionAsync(0);
          }
        });
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }
  };

  pauseAudio = async () => {
    if (this.state.isPlaying) {
      await this.state.soundObject.pauseAsync();
      this.setState({ isPlaying: false });
    }
  };

  playNextTrack = async () => {
    const nextIndex =
      (this.state.currentTrackIndex + 1) % this.audioFiles.length;
    const nextAudio = this.audioFiles[nextIndex];
    await this.playAudio(nextAudio, nextIndex);
  };

  onSliderValueChange = async (value) => {
    if (this.state.selectedAudio) {
      const position =
        value * (await this.state.soundObject.getStatusAsync()).durationMill;
      await this.state.soundObject.setPositionAsync(position);
      this.setState({ position });
    }
  };

  render() {
    const currentAudio = this.audioFiles[this.state.currentTrackIndex];

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
          {this.state.currentTrackIndex !== null
            ? `Now Playing: ${currentAudio.title}`
            : ""}
        </Text>

        <Icon
          name="skip-next"
          size={32}
          color="white"
          onPress={this.playNextTrack}
          style={styles.nextButton}
        />

        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={this.state.position / 1000} // Assuming position is in milliseconds
          onValueChange={this.onSliderValueChange}
          disabled={!this.state.isPlaying}
        />

        <Icon
          name={this.state.isPlaying ? "pause" : "play-arrow"}
          size={32}
          color="white"
          onPress={
            this.state.isPlaying
              ? this.pauseAudio
              : () => this.playAudio(currentAudio, this.state.currentTrackIndex)
          }
          style={[
            styles.button,
            { backgroundColor: this.state.isPlaying ? "red" : "gray" },
          ]}
        />

        <Button
          title="Back to Profile"
          onPress={() =>
            this.props.navigation.navigate("Tomatoes_Screen", {
              screen: "Profile",
            })
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    backgroundColor: 'darkblue',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    position: 'absolute', 
    top: 0, 
    zIndex: 1,
    borderBottomLeftRadius: 30, // Adjust this value for oval shape
    borderBottomRightRadius: 30, // Adjust this value for oval shape
    overflow: 'hidden'
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
