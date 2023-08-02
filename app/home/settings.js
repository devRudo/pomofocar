import React, { useCallback } from "react";
import { View, Text } from "react-native";
import { SettingsS } from "../../screens";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { Appearance, useColorScheme } from "react-native";

SplashScreen.preventAutoHideAsync();

const Settings = () => {
  const colorScheme = useColorScheme();

  console.log(colorScheme);

  return (
    <SafeAreaProvider>
      <SettingsS />
    </SafeAreaProvider>
  );
};

export default Settings;
