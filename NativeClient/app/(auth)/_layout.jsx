import { View, Text } from "react-native";
import React from "react";
import { Slot, Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "rgba(0, 0, 0,0.7)" },
        headerShown: false,
        animation: "fade",
        animationDuration: 100,
      }}
    >
      <Stack.Screen name="register" />
      <Stack.Screen name="login" />
      <Stack.Screen name="verify-email" />
      <Stack.Screen name="select_username" />
      <Stack.Screen name="user-access" />
    </Stack>
  );
};

export default Layout;
