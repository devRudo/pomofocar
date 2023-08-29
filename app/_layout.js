import React from "react";
import { Slot, Tabs, Stack } from "expo-router";
import { Image, Pressable, View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Button, PaperProvider } from "react-native-paper";
import { Linking } from "react-native";

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
            headerRight: (props) =>
              Platform.OS === "web" ? (
                <Button
                  icon={"download"}
                  mode="contained"
                  buttonColor={"#0086f7"}
                  textColor="#fff"
                  style={{
                    marginHorizontal: 20,
                  }}
                  onPress={() =>
                    Linking.openURL(
                      "https://play.google.com/store/apps/details?id=com.pomofocar"
                    )
                  }
                >
                  Download Android App
                </Button>
              ) : null,
          }}
        />
      </Stack>
    </PaperProvider>
  );
};

export default Layout;
