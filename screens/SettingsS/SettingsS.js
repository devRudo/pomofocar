import { Stack, router } from "expo-router";
import React from "react";
import { Button, Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const SettingsS = () => {
  // const randomWidth = useSharedValue(10);
  // const config = {
  //   duration: 500,
  //   easing: Easing.bezier(0.5, 0.01, 0, 1),
  // };

  // const style = useAnimatedStyle(() => {
  //   return {
  //     width: withTiming(randomWidth.value, config),
  //   };
  // });

  return (
    <View>
      {/* <Animated.View style={[styles.box, style]} /> */}
      <Text>settings for android</Text>
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
