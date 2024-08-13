import { View, Text } from "react-native";
import React, { createContext, useEffect, useState } from "react";
import { Redirect, router, Slot, Stack, Tabs, useRootNavigationState } from "expo-router";
import TabBar from "../../components/TabBar";
import { HomeFeedContext } from "../../components/contexts/HomeFeedContext";
import Header from "../../components/Header";
import { auth } from "../../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const Layout = () => {
  const [scrollingDown, setScrollingDown] = useState(false);
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    setTimeout(() => {
      router.push({ pathname: "user-access", search: { mode: "login" } });
    }, 1000);
  }, []);

  return (
    <HomeFeedContext.Provider value={{ scrollingDown, setScrollingDown }}>
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
    </HomeFeedContext.Provider>
  );
};

export default Layout;
