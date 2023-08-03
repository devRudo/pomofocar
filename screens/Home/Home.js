import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import "react-native-get-random-values";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Stack, router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";
import CircularProgress from "react-native-circular-progress-indicator";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";
import { v4 as uuidv4 } from "uuid";
import sounds from "../../utils/sounds";
import { Audio } from "expo-av";

const Home = () => {
  const circularProgressRef = useRef();
  const [values, setValues] = useState({});
  const [timerRunning, setTimerRunning] = useState(false);
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const totalTasks = 4;
  const [tasks, setTasks] = useState([]);

  const timerRef = useRef(null);

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [task, setTask] = useState("");

  const [animationDuration, setAnimationDuration] = useState(0);
  const [timerSs, setTimerSs] = useState(
    Math.round(animationDuration / 1000) || null
  );

  const [currentFill, setCurrentFill] = useState(0);
  const [prefill, setPrefill] = useState(0);

  const handlePlaySound = async (soundName) => {
    const { sound } = await Audio.Sound.createAsync(
      sounds?.find((sound) => sound.label === soundName)?.path
    );
    await sound.playAsync();
  };

  const startTimer = () => {
    setTimerRunning(true);
    if (circularProgressRef.current) {
      circularProgressRef.current.animate(
        100,
        animationDuration,
        Easing.linear
      );
    }
    timerRef.current = setInterval(() => {
      setTimerSs((prev) => prev - 1);
    }, 1000);
  };

  const pauseTimer = () => {
    setTimerRunning(false);
    clearInterval(timerRef.current);
    if (circularProgressRef.current) {
      circularProgressRef.current.animate(currentFill, 100, Easing.linear);
      // setPrefill(currentFill);
    }
  };

  const resetTimer = () => {
    if (circularProgressRef.current) {
      circularProgressRef.current.animate(0, 100, Easing.linear);
    }
    setCurrentFill(0);
    setTimerSs(Math.round(animationDuration / 1000));
    setTimerRunning(false);
    clearInterval(timerRef.current);
  };

  const getAsyncStoreSettingsData = async () => {
    let allKeys = [];
    try {
      allKeys = await AsyncStorage.getAllKeys();
      if (allKeys && Array.isArray(allKeys) && allKeys.length > 0) {
        if (allKeys.filter((key) => key === "settings")?.[0]) {
          setValues(JSON.parse(await AsyncStorage.getItem("settings")));
        } else {
          await AsyncStorage.setItem(
            "settings",
            JSON.stringify({
              taskduration: 25,
              shortbreakduration: 5,
              longbreakduration: 15,
              notificationSound: 'require("../assets/sounds/bell.wav")',
              timerInTitle: false,
              notifications: true,
              autostart: false,
              darkmode: true,
            })
          );
          setValues({
            taskduration: 25,
            shortbreakduration: 5,
            longbreakduration: 15,
            notificationSound: 'require("../assets/sounds/bell.wav")',
            timerInTitle: false,
            notifications: true,
            autostart: false,
            darkmode: true,
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
    console.log(allKeys);
  };

  const getAsyncStoreData = async () => {
    let allKeys = [];
    try {
      allKeys = await AsyncStorage.getAllKeys();
      if (allKeys && Array.isArray(allKeys) && allKeys.length > 0) {
        if (allKeys.filter((key) => key === "tasks")?.[0]) {
          setTasks(JSON.parse(await AsyncStorage.getItem("tasks")));
        } else {
          await AsyncStorage.setItem("tasks", []);
        }
      }
    } catch (e) {
      console.log(e);
    }
    console.log(allKeys);
  };

  const handleAddTask = async () => {
    if (task && task.trim() && task.length > 3) {
      try {
        const tasks = JSON.parse(await AsyncStorage.getItem("tasks"));
        if (tasks !== null) {
          await AsyncStorage.setItem(
            "tasks",
            JSON.stringify([
              ...tasks,
              {
                id: uuidv4(),
                title: task,
                done: false,
              },
            ])
          );
        } else {
          await AsyncStorage.setItem(
            "tasks",
            JSON.stringify([
              {
                id: uuidv4(),
                title: task,
                done: false,
              },
            ])
          );
        }
        getAsyncStoreData();
        setShowAddTaskModal(false);
        setTask("");
        console.log("tasks", tasks);
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log("atleast 3 characters required");
    }
  };

  useEffect(() => {}, [tasks]);

  useEffect(() => {
    if (circularProgressRef.current) {
      // circularProgressRef.current.animate(100, 60000, Easing.linear);
    }
  }, [circularProgressRef]);

  useEffect(() => {
    getAsyncStoreData();
    getAsyncStoreSettingsData();
    // AsyncStorage.clear();
  }, []);

  useEffect(() => {
    setTimerSs(Math.round(animationDuration / 1000) || null);
  }, [animationDuration]);

  useEffect(() => {
    if (timerSs === 0) {
      resetTimer();
      handlePlaySound(values?.notificationSound);
      setActiveTaskIndex((prev) => (prev !== tasks * 2 ? prev + 1 : 0));
    }
  }, [timerSs]);

  useEffect(() => {
    if (activeTaskIndex % 2 !== 0 && activeTaskIndex !== tasks.length * 2 - 1) {
      setAnimationDuration(values?.shortbreakduration * 60000);
    } else if (
      activeTaskIndex % 2 !== 0 &&
      activeTaskIndex === tasks.length * 2 - 1
    ) {
      setAnimationDuration(values?.longbreakduration * 60000);
    } else {
      setAnimationDuration(values?.taskduration * 60000);
    }
  }, [activeTaskIndex, values]);

  // console.log(Dimensions.get("screen").width / 2);
  // console.log(circularProgressRef.current);
  // console.log("values", values);
  // console.log("animation duration", animationDuration);
  console.log("current fill", currentFill);

  return (
    <ScrollView style={{ backgroundColor: "#343a40" }}>
      <View
        style={{
          display: "flex",
          // justifyContent: "center",
          // alignItems: "center",
          flexDirection: "column",
          paddingHorizontal: 20,
          paddingVertical: 40,
          minHeight: Dimensions.get("screen").height - 170,
          // backgroundColor: "#d3d3d3",
          gap: 40,
        }}
      >
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Text>{timerSs}</Text>
          <AnimatedCircularProgress
            prefill={prefill}
            ref={circularProgressRef}
            size={Dimensions.get("screen").width * 0.65}
            width={25}
            fill={0}
            // duration={60000}
            tintColor="#f381a6"
            onAnimationComplete={() => console.log("onAnimationComplete")}
            backgroundColor="#543ef6"
            onFillChange={(value) => setCurrentFill(value)}
          />
          <View
            style={{
              position: "absolute",
              backgroundColor: "#343a40",
              zIndex: 9999,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 40,
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              {Math.floor(timerSs / 60) > 9
                ? Math.floor(timerSs / 60)
                : `0${Math.floor(timerSs / 60)}`}
              :{timerSs % 60 > 9 ? timerSs % 60 : `0${timerSs % 60}`}
            </Text>
            <Text
              style={{
                fontSize: 24,
                color: "#fff",
              }}
            >
              Focus
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <Pressable
            onPress={() => resetTimer()}
            style={{
              borderWidth: 1,
              borderColor: "#0086f7",
              borderStyle: "solid",
              borderRadius: 40,
              padding: 10,
            }}
          >
            <FontAwesome5 name="redo" size={18} color={"#0086f7"} />
          </Pressable>
          <Pressable
            onPress={() => (timerRunning ? pauseTimer() : startTimer())}
            style={{
              borderWidth: 2,
              borderColor: "#0086f7",
              borderStyle: "solid",
              borderRadius: 40,
              padding: 5,
            }}
          >
            {timerRunning ? (
              <MaterialIcons name="pause" size={36} color={"#0086f7"} />
            ) : (
              <MaterialIcons name="play-arrow" size={36} color={"#0086f7"} />
            )}
          </Pressable>
          <Pressable
            onPress={() =>
              setActiveTaskIndex((prev) =>
                prev === totalTasks - 1 ? 0 : prev + 1
              )
            }
            style={{
              borderWidth: 1,
              borderColor: "#0086f7",
              borderStyle: "solid",
              borderRadius: 40,
              padding: 5,
            }}
          >
            <MaterialIcons name="skip-next" size={26} color={"#0086f7"} />
          </Pressable>
        </View>
        <View
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <View
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#d3d3d3",
              }}
            >
              {activeTaskIndex + 1} of {tasks.length * 2 + 1} sessions
            </Text>
          </View>
        </View>
        <View style={{ gap: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 16, color: "#f3f3f3" }}>Tasks</Text>
            <Pressable>
              <MaterialIcons name="more-vert" size={24} color={"#f3f3f3"} />
            </Pressable>
          </View>
          <View
            style={{
              backgroundColor: "#d3d3d3",
              height: 1,
            }}
          ></View>
          <View style={{ gap: 10 }}>
            {tasks && tasks.length > 0
              ? tasks.map((task) => (
                  <View
                    key={task?.id}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: "rgba(0,0,0,0.4)",
                      borderRadius: 5,
                      padding: 15,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <Pressable>
                        <MaterialIcons
                          name="check-circle"
                          size={24}
                          color={task?.done ? "#0086f7" : "#a3a3a3"}
                        />
                      </Pressable>
                      <Text
                        style={{
                          fontSize: 16,
                          color: task?.done ? "#a3a3a3" : "#f3f3f3",
                          textDecorationLine: task?.done
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {task.title}
                      </Text>
                    </View>
                    <Pressable>
                      <MaterialIcons
                        name="more-vert"
                        size={24}
                        color={"#f3f3f3"}
                      />
                    </Pressable>
                  </View>
                ))
              : null}
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.4)",
                borderRadius: 5,
                padding: 10,
                gap: 10,
              }}
              onPress={() => setShowAddTaskModal(true)}
            >
              <MaterialIcons name="add" size={24} color={"#f3f3f3"} />
              <Text
                style={{
                  fontSize: 16,
                  color: "#f3f3f3",
                }}
              >
                Add task
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
      <Modal isVisible={showAddTaskModal} animationIn={"fadeIn"}>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
          }}
        >
          <View
            style={{
              padding: 20,
            }}
          >
            <TextInput
              autoFocus
              placeholder="What are you working on?"
              value={task}
              onChangeText={setTask}
            />
          </View>
          <View
            style={{
              backgroundColor: "#d3d3d3",
              padding: 15,
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Pressable
              style={{
                paddingVertical: 5,
                paddingHorizontal: 15,
                backgroundColor: "#d3d3d3",
                borderWidth: 1,
                borderColor: "#0086f7",
                borderStyle: "solid",
                borderRadius: 5,
              }}
              onPress={() => setShowAddTaskModal(false)}
            >
              <Text>Cancel</Text>
            </Pressable>
            <Pressable
              style={{
                paddingVertical: 5,
                paddingHorizontal: 15,
                backgroundColor: "#0086f7",
                borderWidth: 1,
                borderColor: "#0086f7",
                borderStyle: "solid",
                borderRadius: 5,
              }}
              onPress={() => handleAddTask()}
            >
              <Text style={{ color: "#fff" }}>Save</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  box: {
    width: 100,
    height: 80,
    backgroundColor: "black",
    margin: 30,
  },
});

export default Home;
