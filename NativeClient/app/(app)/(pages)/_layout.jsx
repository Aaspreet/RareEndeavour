import { Slot, Stack } from "expo-router";

import { View, Text } from "react-native";
import React from "react";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="post" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
