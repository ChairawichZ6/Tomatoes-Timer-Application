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
    title: "Pomodoro Technique คืออะไร",
    image: require("../assets/tutorial_picture/tutorial_1.png"),
    description: "เป็นเทคนิคในการจับเวลาที่มุ่งเน้นในการทำงานภายในระยะเวลาสั้น ๆ ร่วมไปกับการพักผ่อนเพื่อให้ร่างกายได้อยู่ในสภาวะสมดุลระหว่างการทำงานและการพักผ่อนโดยช่วยเพิ่มประสิทธิภาพในการทำงานรวมไปถึงลดความเสี่ยงในด้านสุขภาพ",
  },
  {
    title: "ทำงานอย่างไร ? ",
    image: require("../assets/tutorial_picture/tutorial_2.png"),
    description: "เริ่มแรกให้เราเลือก Task ที่เราต้องการตั้งเป้าว่าจะทำให้เสร็จ จากนั้นเริ่มใช้งานตัวจับเวลาโดยจะมีเวลาให้ 25 นาทีในการทำงานที่ตั้งเป้าหมายไว้ให้สำเร็จเพื่อสร้างความสมดุลในการทำงานไม่ให้หนักจนเกินไป",
  },
  {
    title: "Stay Focus กับงานเข้าไว้",
    image: require("../assets/tutorial_picture/tutorial_3.png"),
    description: "ในช่วงเวลา 25 นาทีให้คุณมีสมาธิในการทำงานอย่าสนใจสิ่งรอบข้าง จดจ่ออยู่กับการทำงานของตัวเองให้เสร็จตามช่วงเวลาเป็นพอ",
  },
  {
    title: "Take a Break พักผ่อนบ้าง",
    image: require("../assets/tutorial_picture/tutorial_4.png"),
    description: "เมื่อถึงช่วงเวลาพัก ให้พักสายตากับงานที่ทำแล้วออกไปสูดอากาศข้างนอกและเคลื่อนไหวร่างกายซักหน่อย เพื่อสุขภาพของตัวเอง",
  },
  {
    title: "ทำซ้ำอีกรอบ Repeat Cycle",
    image: require("../assets/tutorial_picture/tutorial_5.png"),
    description: "หลังจากนั้นให้ทำขั้นตอนนี้วนซ้ำไปเรื่อย ๆ จนกว่างานที่ตั้งเป้าหมายไว้จะเสร็จ โดยจะแบ่งช่วงเวลาเป็น 4 ช่วง ได้แก่ Work -> Short Break -> Work -> Long Break เพื่อปรับความคุ้นเคยของสภาพร่างกายให้เหมาะสมกับ Pomodoro Technique",
  },
  {
    title: "Gamification Idea",
    image: require("../assets/tutorial_picture/tutorial_6.png"),
    description: "มีการนำระบบ Score เข้ามาภายใน Application เพื่อช่วยกระตุ้นผู้ใช้ในการใช้งาน โดยที่ Score ของผู้ใช้จะได้รับจากการไปเปิด Reward แผ่นภาพจากภายในแอปซึ่งจะเปิดได้ในทุก ๆ 25 นาที โดยระดับคะแนนก็จะส่งผลต่อความเปลี่ยนแปลงภายในแอปพลิเคชัน เช่น เพลง และ พื้นหลัง Profile",
  },
  {
    title: "ประโยชน์ที่จะได้รับ Benefit",
    image: require("../assets/tutorial_picture/tutorial_7.png"),
    description: "ด้วยการใช้ Pomodoro Technique จะช่วยให้การทำงานของคุณมีประสิทธิภาพที่ดีขึ้น รวมไปถึงการก่อให้เกิดความสมดุลในการบริหารจัดการ และยังได้รับแรงจูงใจในการทำงานที่ตั้งเป้าไว้ให้สำเร็จอีกด้วย",
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
