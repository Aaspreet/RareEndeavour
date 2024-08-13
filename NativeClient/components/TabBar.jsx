import { View, Text, TouchableOpacity, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { BlurView } from "expo-blur";
import { useContext } from "react";
import { HomeFeedContext } from "./contexts/HomeFeedContext";
import Animated, { useAnimatedProps, useSharedValue, withTiming } from "react-native-reanimated";
import { FontAwesome, Ionicons, MaterialCommunityIcons, Octicons } from "react-native-vector-icons";
import { Link, router, useLocalSearchParams, useNavigation } from "expo-router";
import { auth } from "../config/firebaseConfig";
import tailwindConfig from "../tailwind.config";
import { rgba } from "polished";
import Svg, { G, Path } from "react-native-svg";
import Icon from "./utils/Icon";
import {
  ChatFill,
  ChatOutline,
  GridFill,
  GridOutline,
  HomeFill,
  HomeFilled,
  HomeOutline,
  NotificationsFill,
  NotificationsOutline,
  Plus,
} from "../assets/icons";

const TabBar = ({ state, ...rest }) => {
  const navigation = useNavigation();
  const { scrollingDown } = useContext(HomeFeedContext);
  const blurViewIntensity = useSharedValue(0);

  const [allowAnimatedTabBar, setAllowAnimatedTabBar] = useState(false);
  const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

  const { colors } = tailwindConfig.theme.extend;

  const focusedIconSize = 27;
  const unfocusedIconSize = 25;

  const focusedIconColour = "rgb(255, 255, 255)";
  const unfocusedIconColour = "rgb(255, 255, 255)";

  const routesRequiringAuth = ["create", "chat", "inbox"];

  const routesConfig = [
    {
      iconOutline: <HomeOutline height={unfocusedIconSize} colour={unfocusedIconColour} />,
      iconFilled: <HomeFill height={focusedIconSize} colour={focusedIconColour} />,
      name: "index",
      path: "/",
    },
    {
      iconOutline: <GridOutline height={unfocusedIconSize} colour={unfocusedIconColour} />,
      iconFilled: <GridFill height={focusedIconSize} colour={focusedIconColour} />,
      name: "grid",
    },
    {
      iconOutline: <Plus height={unfocusedIconSize} colour={unfocusedIconColour} />,
      iconFilled: <Plus height={focusedIconSize} colour={focusedIconColour} />,
      name: "create",
    },
    {
      iconOutline: <ChatOutline height={unfocusedIconSize} colour={unfocusedIconColour} />,
      iconFilled: <ChatFill height={focusedIconSize} colour={focusedIconColour} />,
      name: "chat",
    },
    {
      iconOutline: <NotificationsOutline height={unfocusedIconSize} colour={unfocusedIconColour} />,
      iconFilled: <NotificationsFill height={focusedIconSize} colour={focusedIconColour} />,
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
    setAllowAnimatedTabBar(state.routes[state.index].name === "index" || state.routes[state.index].name === "grid");
  }, [state]);

  useEffect(() => {
    if (scrollingDown) {
      blurViewIntensity.value = withTiming(5, { duration: 500 });
    } else {
      blurViewIntensity.value = withTiming(30);
    }
  }, [scrollingDown]);

  return (
    <AnimatedBlurView
      className="bottom-0 flex-row justify-between" //add top border here if you want that line
      intensity={allowAnimatedTabBar ? blurViewIntensity : 0}
      tint="dark"
      style={{
        paddingBottom: rest.insets.bottom,
        paddingTop: 8,
        paddingHorizontal: 5,
        backgroundColor: allowAnimatedTabBar ? rgba(colors.secondary, 1) : "rgb(0, 0, 0)",
        //The position absolute is making expo go crash on android
        position: allowAnimatedTabBar && "absolute",
      }}
    >
      {routesProperties.map((route, index) => {
        const isFocused = state.index === route.index && route.index !== null;

        return (
          <Link
            key={route.name}
            href={!auth.currentUser && routesRequiringAuth.includes(route.name) ? "register" : route.path}
            className="flex-1 py-[6] items-center"
            asChild
          >
            <Pressable>{isFocused ? route.iconFilled : route.iconOutline}</Pressable>
          </Link>
        );
      })}
    </AnimatedBlurView>
  );
};

export default TabBar;
