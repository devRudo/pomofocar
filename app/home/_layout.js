import React from "react";
import { Slot, Tabs, Stack } from "expo-router";
import { Image, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => {
            // console.log(props);
            return (
              <MaterialIcons
                name="home"
                size={24}
                color={focused ? "#0086f7" : "#343335"}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="settings"
              size={24}
              color={focused ? "#0086f7" : "#343335"}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
