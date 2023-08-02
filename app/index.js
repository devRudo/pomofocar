import React, { useCallback } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Appearance, useColorScheme } from "react-native";
import { Redirect, Stack } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Home } from "../screens";

SplashScreen.preventAutoHideAsync();

const Page = () => {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    "Inter-Black": require("../assets/fonts/Inter-Black.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  console.log(colorScheme);

  return <Redirect href={"/home"} />;
};

export default Page;
