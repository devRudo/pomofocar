// import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, Switch } from "react-native";
import sounds from "../../utils/sounds";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "react-native-paper";
import Slider from "@react-native-community/slider";
import CommonPicker from "../../components/CommonPicker/CommonPicker";
import packageJSON from "./../../package.json";
import { Audio } from "expo-av";

const SettingsS = () => {
  const [values, setValues] = useState({});
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height
  );

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
    console.log(allKeys);
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

    const onResize = (event) => {
      setScreenWidth(event.window.width);
      setScreenHeight(event.window.height);
    };
    Dimensions.addEventListener("change", onResize);

    return () => Dimensions.removeEventListener("change", onResize);
  }, []);

  // console.log("values", values);

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
          width:
            screenWidth > 800
              ? screenWidth * 0.4
              : screenWidth > 500
              ? screenWidth * 0.7
              : screenWidth * 0.8,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <Text style={{ fontSize: 16, color: "#f3f3f3" }}>Task duration</Text>
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
        </div>
        <div
          style={{
            gap: 20,
            display: "flex",
            flexDirection: "column",
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
        </div>
        <div
          style={{
            gap: 20,
            display: "flex",
            flexDirection: "column",
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
        </div>
        <div
          style={{
            borderColor: "#d3d3d3",
            borderWidth: 1,
            borderStyle: "solid",
            borderRadius: 5,
            marginTop: 20,
            position: "relative",
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
        </div>
        <div style={{ gap: 20, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              gap: 10,
              display: "flex",
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
          </div>
          <div
            style={{
              gap: 10,
              display: "flex",
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
          </div>
          <div
            style={{
              gap: 10,
              display: "flex",
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
          </div>
          <div
            style={{
              gap: 10,
              display: "flex",
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
          </div>
        </div>
        <div style={{ marginTop: "auto" }}>
          <Text
            style={{
              fontSize: 16,
              color: "#c3c3c3",
              textAlign: "center",
            }}
          >
            v{packageJSON.version}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default SettingsS;
