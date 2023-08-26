import React from "react";
import { Slot, Tabs, Stack } from "expo-router";
import { Image, Pressable, View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { PaperProvider } from "react-native-paper";

const Layout = () => {
  const { top, bottom, left, right } = useSafeAreaInsets();

  // console.log(top, bottom, left, right);
  console.log(Platform.OS);

  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerTitleAlign: "center",
            title: "Pomofocus",
            headerTitle: (props) => (
              <Image
                style={{ width: 120, height: 40 }}
                source={require("../assets/texticon.png")}
              />
            ),
            // headerLeft: (props) => (
            //   <Pressable
            //     onPress={() =>
            //       router.canGoBack() ? router.back() : router.replace("/")
            //     }
            //   >
            //     <MaterialIcons name="arrow-back" size={24} />
            //   </Pressable>
            // ),
          }}
        />
        <Stack.Screen
          name="home"
          options={{
            headerTitleAlign: "center",
            title: "Pomofocus",
            headerTitle: (props) => (
              <Image
                style={{ width: 120, height: 40 }}
                source={require("../assets/texticon.png")}
              />
            ),
            // headerLeft: (props) => (
            //   <Pressable
            //     onPress={() =>
            //       router.canGoBack() ? router.back() : router.replace("/")
            //     }
            //   >
            //     <MaterialIcons name="arrow-back" size={24} />
            //   </Pressable>
            // ),
          }}
        />
      </Stack>
    </PaperProvider>
  );
};

export default Layout;
