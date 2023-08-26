import { Stack, router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Button,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ScrollView } from "react-native-gesture-handler";
import Slider from "@react-native-community/slider";
import packageJSON from "./../../package.json";
import { Picker } from "@react-native-picker/picker";
import sounds from "../../utils/sounds";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import CommonPicker from "../../components/CommonPicker/CommonPicker";

const SettingsS = () => {
  const [values, setValues] = useState({});

  const handlePlaySound = async (soundName) => {
    console.log("coming here settings ");
    try {
      const { sound } = await Audio.Sound.createAsync(
        sounds?.find((sound) => sound.label === soundName)?.path
      );
      try {
        await sound.playAsync();
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      console.log(e);
    }
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

  const updateValues = async () => {
    try {
      const settings = JSON.parse(await AsyncStorage.getItem("settings"));
      if (settings !== null) {
        await AsyncStorage.setItem("settings", JSON.stringify(values));
      } else {
        await AsyncStorage.setItem("settings", JSON.stringify(values));
      }
      // console.log("settings", settings);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (
      Object.values(values) &&
      Array.isArray(Object.values(values)) &&
      Object.values(values).length > 0
    ) {
      updateValues(values);
    }
  }, [values]);

  useEffect(() => {
    getAsyncStoreSettingsData();
  }, []);

  // console.log("values", values);

  return (
    <View>
      {/* <Animated.View style={[styles.box, style]} /> */}
      <ScrollView style={{ backgroundColor: "#343a40" }}>
        <View
          style={{
            display: "flex",
            // justifyContent: "center",
            // alignItems: "center",
            flexDirection: "column",
            padding: 20,
            minHeight: Dimensions.get("screen").height - 170,
            // backgroundColor: "#d3d3d3",
            gap: 10,
          }}
        >
          <View
            style={{
              gap: 20,
            }}
          >
            <Text style={{ fontSize: 16, color: "#f3f3f3" }}>
              Task duration
            </Text>
            <Slider
              // style={{width: 200, height: 40}}
              step={1}
              // thumbImage={require("../../assets/favicon.png")}
              value={values?.taskduration}
              onValueChange={(value) => {
                setValues({
                  ...values,
                  taskduration: value,
                });
              }}
              minimumValue={5}
              maximumValue={60}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#fff"
            />
          </View>
          <View
            style={{
              gap: 20,
            }}
          >
            <Text style={{ fontSize: 16, color: "#f3f3f3" }}>
              Short break duration
            </Text>
            <Slider
              // style={{width: 200, height: 40}}
              step={1}
              value={values?.shortbreakduration}
              onValueChange={(value) =>
                setValues({
                  ...values,
                  shortbreakduration: value,
                })
              }
              minimumValue={1}
              maximumValue={30}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#fff"
            />
          </View>
          <View
            style={{
              gap: 20,
            }}
          >
            <Text style={{ fontSize: 16, color: "#f3f3f3" }}>
              Long break duration
            </Text>
            <Slider
              step={1}
              // style={{width: 200, height: 40}}
              value={values?.longbreakduration}
              onValueChange={(value) =>
                setValues({
                  ...values,
                  longbreakduration: value,
                })
              }
              minimumValue={1}
              maximumValue={45}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#fff"
            />
          </View>
          <View
            style={{
              borderColor: "#d3d3d3",
              borderWidth: 1,
              borderStyle: "solid",
              borderRadius: 5,
              marginTop: 20,
            }}
          >
            <CommonPicker
              items={sounds.map((sound) => {
                return {
                  label: sound?.label,
                  value: sound?.label,
                };
              })}
              value={values?.notificationSound}
              handleChange={(itemValue) => {
                setValues({
                  ...values,
                  notificationSound: itemValue,
                });
                handlePlaySound(itemValue);
              }}
            />
            <Text
              style={{
                fontSize: 15,
                position: "absolute",
                top: -16,
                left: 6,
                backgroundColor: "#343a40",
                padding: 5,
                color: "#f1f1f1",
              }}
            >
              Notification Sound
            </Text>
          </View>
          <View style={{ gap: 10 }}>
            {/* <View
              style={{
                gap: 10,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Switch
                onValueChange={() => {
                  setValues({
                    ...values,
                    timerInTitle: !values?.timerInTitle,
                  });
                }}
                value={values?.timerInTitle}
              />
              <Text style={{ fontSize: 16, color: "#f3f3f3" }}>
                Timer in title
              </Text>
            </View> */}
            {/* <View
              style={{
                gap: 10,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Switch
                onValueChange={() =>
                  setValues({
                    ...values,
                    notifications: !values?.notifications,
                  })
                }
                value={values?.notifications}
              />
              <Text style={{ fontSize: 16, color: "#f3f3f3" }}>
                Notifications
              </Text>
            </View> */}
            <View
              style={{
                gap: 10,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Switch
                onValueChange={() =>
                  setValues({ ...values, autostart: !values?.autostart })
                }
                value={values?.autostart}
              />
              <Text style={{ fontSize: 16, color: "#f3f3f3" }}>Autostart</Text>
            </View>
            {/* <View
              style={{
                gap: 10,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Switch
                onValueChange={() =>
                  setValues({ ...values, darkmode: !values?.darkmode })
                }
                value={values?.darkmode}
              />
              <Text style={{ fontSize: 16, color: "#f3f3f3" }}>Dark mode</Text>
            </View> */}
          </View>
          <View style={{ marginTop: "auto" }}>
            <Text
              style={{
                fontSize: 16,
                color: "#c3c3c3",
                textAlign: "center",
              }}
            >
              v{packageJSON.version}
            </Text>
          </View>
        </View>
      </ScrollView>
      {/* <Button
        title="toggle"
        onPress={() => {
          randomWidth.value = Math.random() * 350;
        }}
      /> */}
    </View>
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

export default SettingsS;
