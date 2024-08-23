import { View, Text } from "react-native";
import React from "react";
import { Slot, Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="test"/>
    </Stack>
  );
};

export default Layout;
