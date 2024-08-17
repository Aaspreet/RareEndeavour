import { View, Text } from "react-native";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Redirect, router, Slot, Stack, Tabs, useRootNavigationState } from "expo-router";
import TabBar from "../../components/TabBar";
import Header from "../../components/Header";
import { auth } from "../../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { AuthPromptModalContext } from "../../components/contexts";

const Layout = () => {
  const rootNavigationState = useRootNavigationState();

  const { authPromptModalRef } = useContext(AuthPromptModalContext);

  useEffect(() => {
    setTimeout(() => {
      // router.push({ pathname: "user-access", params: { mode: "login" } });
      router.push("chat")
      // authPromptModalRef.current?.present();
    }, 400);
  }, []);

  return (
    <Tabs
      screenOptions={(props) => ({ header: () => <Header {...props} /> })}
      initialRouteName="index"
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ headerShown: false }} />
      <Tabs.Screen name="grid" options={{ headerShown: false }} />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="inbox" />
    </Tabs>
  );
};

export default Layout;
