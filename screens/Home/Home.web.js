import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import { Stack } from "expo-router";
import React, { useRef, useState, useEffect } from "react";
import { Dimensions, Image, Pressable } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Text, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Easing } from "react-native-reanimated";
import Modal from "react-native-modal";
import { v4 as uuidv4 } from "uuid";
import "../../assets/css/global.css";
import sounds from "../../utils/sounds";

const Home = () => {
  const circularProgressRef = useRef();
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height
  );
  const [values, setValues] = useState({
    autostart: true,
    darkmode: true,
    longbreakduration: 15,
    notificationSound: "Bells",
    notifications: true,
    shortbreakduration: 5,
    taskduration: 25,
    timerInTitle: true,
  });
  const [timerRunning, setTimerRunning] = useState(false);
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [tasks, setTasks] = useState([]);
  const navigation = useNavigation();

  const timerRef = useRef(null);

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [task, setTask] = useState("");

  const [animationDuration, setAnimationDuration] = useState(0);
  const [timerSs, setTimerSs] = useState(
    Math.round(animationDuration / 1000) || null
  );

  const [currentFill, setCurrentFill] = useState(0);
  const [prefill, setPrefill] = useState(0);

  const [sessionType, setSessionType] = useState("task");
  const [showEditTaskModal, setShowEditTaskModal] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");

  const [showAllTasksOptions, setShowAllTasksOptions] = useState(false);

  const handlePlaySound = async (soundName) => {
    console.log("coming here home ");
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
    // console.log(allKeys);
  };

  const getAsyncStoreData = async () => {
    let allKeys = [];
    try {
      allKeys = await AsyncStorage.getAllKeys();
      if (allKeys && Array.isArray(allKeys) && allKeys.length > 0) {
        if (allKeys.filter((key) => key === "tasks")?.[0]) {
          setTasks(JSON.parse(await AsyncStorage.getItem("tasks")));
        } else {
          await AsyncStorage.setItem("tasks", JSON.stringify([]));
        }
      }
    } catch (e) {
      console.log(e);
    }
    // console.log(allKeys);
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

  const handleUpdateTask = async () => {
    if (taskTitle && taskTitle.trim() && taskTitle.length > 3) {
      try {
        const tasks = JSON.parse(await AsyncStorage.getItem("tasks"));
        const updatedTasks = tasks?.map((task) => {
          if (task?.id === showEditTaskModal) {
            return {
              ...task,
              title: taskTitle,
            };
          } else {
            return task;
          }
        });
        await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
        getAsyncStoreData();
        setShowEditTaskModal(null);
        setTaskTitle("");
        console.log("tasks", tasks);
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log("atleast 3 characters required");
    }
  };

  // const handleClearFinishedTasks = async () => {
  //   try {
  //     const tasks = JSON.parse(await AsyncStorage.getItem("tasks"));
  //     const updatedTasks = tasks?.filter((task) => task?.done);
  //     await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
  //     getAsyncStoreData();
  //     setShowEditTaskModal(null);
  //     setTaskTitle("");
  //     console.log("tasks", tasks);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  const handleClearAllTasks = async () => {
    try {
      const tasks = JSON.parse(await AsyncStorage.getItem("tasks"));
      await AsyncStorage.setItem("tasks", JSON.stringify([]));
      getAsyncStoreData();
      setShowAllTasksOptions(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {}, [tasks]);

  useEffect(() => {
    if (circularProgressRef.current) {
      // circularProgressRef.current.animate(100, 60000, Easing.linear);
    }
  }, [circularProgressRef]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getAsyncStoreData();
      getAsyncStoreSettingsData();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    getAsyncStoreData();
    getAsyncStoreSettingsData();
    const onResize = (event) => {
      setScreenWidth(event.window.width);
      setScreenHeight(event.window.height);
    };
    Dimensions.addEventListener("change", onResize);

    return () => Dimensions.removeEventListener("change", onResize);
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
    if (sessionType === "shortbreak") {
      setAnimationDuration(values?.shortbreakduration * 60000);
    } else if (sessionType === "longbreak") {
      setAnimationDuration(values?.longbreakduration * 60000);
    } else {
      setAnimationDuration(values?.taskduration * 60000);
    }
  }, [sessionType, values]);

  // console.log(Dimensions.get("screen").width / 2);
  // console.log(circularProgressRef.current);
  // console.log("values", values);
  // console.log("animation duration", animationDuration);
  // console.log("current fill", currentFill);
  // console.log("sessionType", sessionType);
  // console.log("activeTaskIndex", activeTaskIndex);
  // console.log("values", values);
  // console.log("navigation", navigation);
  // console.log(timerSs);
  // console.log(screenWidth);
  // console.log(screenHeight);

  return (
    <div
      style={{
        display: "flex",
        // justifyContent: "center",
        // alignItems: "center",
        flexDirection: "column",
        padding: "40px 40px",
        minHeight: "calc(100vh - 190px)",
        maxHeight: "calc(100vh - 190px)",
        backgroundColor: "#343a40",
        gap: 40,
        overflowY: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <AnimatedCircularProgress
          prefill={prefill}
          ref={circularProgressRef}
          size={screenHeight * 0.35}
          width={25}
          fill={0}
          // duration={60000}
          tintColor="#f381a6"
          onAnimationComplete={() => console.log("onAnimationComplete")}
          backgroundColor="#543ef6"
          onFillChange={(value) => setCurrentFill(value)}
        />
        <div
          style={{
            position: "absolute",
            backgroundColor: "#343a40",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            gap: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: screenHeight / 20,
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
              fontSize: screenHeight / 30,
              color: "#fff",
            }}
          >
            {sessionType === "task" ? "Focus" : "Break"}
          </Text>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <Pressable
          onPress={() => {
            // setActiveTaskIndex(0);
            resetTimer();
          }}
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
          onPress={() => {
            if (
              activeTaskIndex === tasks.length - 1 &&
              sessionType === "task"
            ) {
              setSessionType("longbreak");
            } else if (
              sessionType === "task" &&
              activeTaskIndex !== tasks.length - 1
            ) {
              setSessionType("shortbreak");
            } else {
              setSessionType("task");
              setActiveTaskIndex((prev) =>
                prev === tasks.length - 1 ? 0 : prev + 1
              );
            }
          }}
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
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <div
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
            #{activeTaskIndex + 1}
          </Text>
        </div>
      </div>
      <div
        style={{
          gap: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width:
              screenWidth > 800
                ? screenWidth * 0.4
                : screenWidth > 500
                ? screenWidth * 0.7
                : screenWidth * 0.9,
          }}
        >
          <Text style={{ fontSize: 16, color: "#f3f3f3" }}>Tasks</Text>
          <Pressable onPress={() => setShowAllTasksOptions(true)}>
            <MaterialIcons name="more-vert" size={24} color={"#f3f3f3"} />
          </Pressable>
        </div>
        <div
          style={{
            backgroundColor: "#d3d3d3",
            height: 1,
            width:
              screenWidth > 800
                ? screenWidth * 0.4
                : screenWidth > 500
                ? screenWidth * 0.7
                : screenWidth * 0.9,
          }}
        ></div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            width:
              screenWidth > 800
                ? screenWidth * 0.4
                : screenWidth > 500
                ? screenWidth * 0.7
                : screenWidth * 0.9,
          }}
        >
          {tasks && tasks.length > 0
            ? tasks.map((task) => (
                <div
                  key={task?.id}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "rgba(0,0,0,0.4)",
                    borderRadius: 5,
                    padding: 15,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
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
                  </div>
                  <Pressable
                    onPress={() => {
                      setShowEditTaskModal(task?.id);
                      setTaskTitle(task?.title);
                    }}
                  >
                    <FontAwesome5 name="edit" size={20} color={"#f3f3f3"} />
                  </Pressable>
                </div>
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
        </div>
      </div>
      <Modal
        isVisible={showAddTaskModal}
        animationIn={"fadeIn"}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            // alignItems: "center",
            backgroundColor: "#fff",
            maxWidth: 500,
            minWidth: 500,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // width: "100%",
              padding: 20,
            }}
          >
            <TextInput
              autoFocus
              mode="outlined"
              placeholder="What are you working on?"
              value={task}
              onChangeText={setTask}
              style={{
                backgroundColor: "transparent",
                width: "90%",
              }}
              textColor="#343a40"
              outlineColor="#343a40"
              activeOutlineColor="#343a40"
            />
          </div>
          <div
            style={{
              backgroundColor: "#343a40",
              padding: 15,
              flex: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Pressable
              style={{
                paddingVertical: 5,
                paddingHorizontal: 15,
                backgroundColor: "#343a40",
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
          </div>
        </div>
      </Modal>
      <Modal
        isVisible={Boolean(showEditTaskModal)}
        animationIn={"fadeIn"}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "#fff",
            maxWidth: 500,
            minWidth: 500,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
          >
            <TextInput
              autoFocus
              mode="outlined"
              placeholder="What are you working on?"
              value={taskTitle}
              onChangeText={setTaskTitle}
              style={{
                backgroundColor: "transparent",
                width: "90%",
              }}
              textColor="#343a40"
              outlineColor="#343a40"
              activeOutlineColor="#343a40"
            />
          </div>
          <div
            style={{
              backgroundColor: "#343a40",
              padding: 15,
              flex: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Pressable
              style={{
                paddingVertical: 5,
                paddingHorizontal: 15,
                backgroundColor: "#343a40",
                borderWidth: 1,
                borderColor: "#0086f7",
                borderStyle: "solid",
                borderRadius: 5,
              }}
              onPress={() => setShowEditTaskModal(null)}
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
              onPress={() => handleUpdateTask()}
            >
              <Text style={{ color: "#fff" }}>Save</Text>
            </Pressable>
          </div>
        </div>
      </Modal>
      <Modal
        isVisible={Boolean(showAllTasksOptions)}
        animationIn={"fadeIn"}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "#fff",
            maxWidth: 500,
            minWidth: 500,
          }}
        >
          <div
            style={{
              padding: 20,
              gap: 10,
            }}
          >
            {/* <Pressable onPress={()=>handleClearFinishedTasks()}>
              <Text style={{ fontSize: 16 }}>Clear finished tasks</Text>
            </Pressable> */}
            <Pressable onPress={() => handleClearAllTasks()}>
              <Text style={{ fontSize: 16, color: "#343a40" }}>
                Clear all tasks
              </Text>
            </Pressable>
          </div>
          <div
            style={{
              backgroundColor: "#343a40",
              padding: 15,
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Pressable
              style={{
                paddingVertical: 5,
                paddingHorizontal: 15,
                backgroundColor: "#343a40",
                borderWidth: 1,
                borderColor: "#0086f7",
                borderStyle: "solid",
                borderRadius: 5,
              }}
              onPress={() => setShowAllTasksOptions(false)}
            >
              <Text>Close</Text>
            </Pressable>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Home;
