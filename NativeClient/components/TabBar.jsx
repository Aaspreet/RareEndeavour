import { View, Text, TouchableOpacity, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { BlurView } from "expo-blur";
import { useContext } from "react";
import { HomeFeedContext } from "./contexts/HomeFeedContext";
import Animated, { useAnimatedProps, useSharedValue, withTiming } from "react-native-reanimated";
import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, router, useLocalSearchParams, useNavigation } from "expo-router";

const TabBar = ({ state, ...rest }) => {
  const navigation = useNavigation();
  const { scrollingDown } = useContext(HomeFeedContext);
  const blurViewIntensity = useSharedValue(0);

  const [allowAnimatedTabBar, setAllowAnimatedTabBar] = useState(false);
  const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

  const routesConfig = [
    {
      iconType: "Ionicons",
      iconOutline: "home-outline",
      iconFilled: "home",
      name: "index",
      path: "/",
    },
    {
      iconType: "Ionicons",
      iconOutline: "grid-outline",
      iconFilled: "grid",
      name: "grid",
    },
    {
      iconType: "Ionicons",
      iconOutline: "add",
      iconFilled: "add",
      name: "create",
    },
    {
      iconType: "Ionicons",
      iconOutline: "chatbox-outline",
      iconFilled: "chatbox",
      name: "chat",
    },
    {
      iconType: "Ionicons",
      iconOutline: "notifications-outline",
      iconFilled: "notifications",
      name: "inbox",
    },
  ];

  const routesProperties = state.routes.map((route, index) => {
    const { iconOutline, iconFilled, path } = routesConfig.find((icon) => icon.name === route.name);
    return {
      name: route.name,
      path: path || route.name,
      index: index,
      iconOutline,
      iconFilled,
    };
  });
  routesProperties.splice(2, 0, {
    name: "create",
    path: "create",
    index: null,
    iconOutline: routesConfig.find((icon) => icon.name === "create").iconOutline,
    iconFilled: routesConfig.find((icon) => icon.name === "create").iconFilled,
  });

  useEffect(() => {
    setAllowAnimatedTabBar(state.routes[state.index].name === "index");
  }, [state]);

  useEffect(() => {
    if (scrollingDown) {
      blurViewIntensity.value = withTiming(5, { duration: 500 });
    } else {
      blurViewIntensity.value = withTiming(25);
    }
  }, [scrollingDown]);

  return (
    <AnimatedBlurView
      className="bottom-0 flex-row justify-between border-t border-zinc-400"
      intensity={allowAnimatedTabBar ? blurViewIntensity : 0}
      tint="dark"
      style={{
        paddingBottom: rest.insets.bottom,
        paddingTop: 5,
        backgroundColor: allowAnimatedTabBar ? "rgba(0, 0, 0, 0.7)" : "rgb(0, 0, 0)",
        position: allowAnimatedTabBar && "absolute",
      }}
    >
      {routesProperties.map((route, index) => {
        const isFocused = state.index === route.index && route.index !== null;

        return (
          <Link key={route.name} href={route.path} className="flex-1 py-[12px] items-center" asChild>
            <Pressable>
                <Ionicons
                  name={isFocused ? route.iconFilled : route.iconOutline}
                  color={isFocused ? "rgb(255, 255, 255)" : "rgb(255, 255, 255)"}
                  size={isFocused ? 25 : 23}
                />
            </Pressable>
          </Link>
        );
      })}
    </AnimatedBlurView>
  );
};

export default TabBar;
