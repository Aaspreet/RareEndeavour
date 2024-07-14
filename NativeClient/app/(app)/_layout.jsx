import { View, Text } from "react-native";
import React, { createContext, useEffect, useState } from "react";
import { Redirect, router, Slot, Stack, Tabs, useRootNavigationState } from "expo-router";
import TabBar from "../../components/TabBar";
import { HomeFeedContext } from "../../components/contexts/HomeFeedContext";
import Header from "../../components/Header";

const Layout = () => {
  const [scrollingDown, setScrollingDown] = useState(false);

  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (rootNavigationState?.key && /** is there is no user */ true) {
      // router.push("login");
    }
  }, [rootNavigationState?.key]);

  return (
    <HomeFeedContext.Provider value={{ scrollingDown, setScrollingDown }}>
      <Tabs
        screenOptions={(props) => ({ header: () => <Header {...props} /> })}
        initialRouteName="index"
        tabBar={(props) => <TabBar {...props} />}
      
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="grid" />
        {/* <Tabs.Screen
          name="fake"
          options={{}}
          listeners={() => ({
            tabPress: (e) => {
              e.preventDefault();
              router.push("create");
            },
          })}
        /> */}
        <Tabs.Screen name="chat" />
        <Tabs.Screen name="inbox" />
      </Tabs>
    </HomeFeedContext.Provider>
  );
};

export default Layout;
