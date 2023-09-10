// import React, { Component } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import AudioRecorderPlayer from 'react-native-audio';

// class MusicApp extends Component {
//   constructor(props) {
//     super(props);

//     this.audioFiles = [
//       {
//         id: 'audio1',
//         url: require('../audio/M1.mp3'),
//         title: 'Audio 1',
//       },
//       {
//         id: 'audio2',
//         url: require('../audio/M2.mp3'),
//         title: 'Audio 2',
//       },
//       {
//         id: 'audio3',
//         url: require('../audio/M3.mp3'),
//         title: 'Audio 3',
//       },
//       {
//         id: 'audio4',
//         url: require('../audio/M4.mp3'),
//         title: 'Audio 4',
//       },
//       {
//         id: 'audio5',
//         url: require('../audio/M5.mp3'),
//         title: 'Audio 5',
//       },
//       {
//         id: 'audio6',
//         url: require('../audio/M6.mp3'),
//         title: 'Audio 6',
//       },
//       {
//         id: 'audio7',
//         url: require('../audio/M7.mp3'),
//         title: 'Audio 7',
//       },
//       {
//         id: 'audio8',
//         url: require('../audio/M8.mp3'),
//         title: 'Audio 8',
//       },
//       {
//         id: 'audio9',
//         url: require('../audio/M9.mp3'),
//         title: 'Audio 9',
//       },
//       {
//         id: 'audio10',
//         url: require('../audio/M10.mp3'),
//         title: 'Audio 10',
//       },
//     ];

//     this.state = {
//       isPlaying: false,
//       currentTrack: null,
//       selectedAudio: null,
//     };

//     this.audioRecorderPlayer = new AudioRecorderPlayer();
//   }

//   componentWillUnmount() {
//     // Release the audio player resources when the component is unmounted
//     this.audioRecorderPlayer.stopPlayer();
//   }

//   playAudio = async (audio) => {
//     if (this.state.selectedAudio) {
//       this.audioRecorderPlayer.stopPlayer();
//       this.setState({ isPlaying: false, currentTrack: null, selectedAudio: null });
//     }

//     const audioPath = audio.url;
//     const result = await this.audioRecorderPlayer.startPlayer(audioPath);
//     if (result === 'OK') {
//       this.setState({ isPlaying: true, currentTrack: audio.title, selectedAudio: audioPath });
//     }
//   };

//   pauseAudio = async () => {
//     if (this.state.selectedAudio) {
//       const result = await this.audioRecorderPlayer.stopPlayer();
//       if (result === 'OK') {
//         this.setState({ isPlaying: false });
//       }
//     }
//   };

//   render() {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.title}>Simple Music Player</Text>
//         <Text style={styles.currentTrack}>
//           {this.state.currentTrack ? `Now Playing: ${this.state.currentTrack}` : ''}
//         </Text>

//         {this.audioFiles.map((audio, index) => (
//           <TouchableOpacity
//             key={audio.id}
//             onPress={() => this.playAudio(audio)}
//             style={styles.button}
//           >
//             <Text style={styles.buttonText}>{`Play Audio ${index + 1}`}</Text>
//           </TouchableOpacity>
//         ))}

//         <TouchableOpacity
//           onPress={this.pauseAudio}
//           style={[styles.button, { backgroundColor: 'red' }]}
//           disabled={!this.state.isPlaying}
//         >
//           <Text style={styles.buttonText}>Pause Audio</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   currentTrack: {
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   button: {
//     backgroundColor: 'blue',
//     padding: 10,
//     margin: 5,
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });

// export default MusicApp;
