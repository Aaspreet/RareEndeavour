import { Pressable } from "react-native";
import React, { useEffect } from "react";
import { BlurView } from "expo-blur";
import { useContext } from "react";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { Link, router } from "expo-router";
import { auth } from "../config/firebaseConfig";
import tailwindConfig from "../tailwind.config";
import { rgba } from "polished";
import {
  ChatFill,
  ChatOutline,
  GridFill,
  GridOutline,
  HomeFill,
  HomeOutline,
  NotificationsFill,
  NotificationsOutline,
  Plus,
} from "../assets/icons";
import { AuthPromptModalContext, ScrollingDownContext } from "./contexts";

const TabBar = ({ state, ...rest }) => {
  const blurViewIntensity = useSharedValue(0);

  const focusedIconSize = 27;
  const unfocusedIconSize = 25;

  const focusedIconColour = "rgb(255, 255, 255)";
  const unfocusedIconColour = "rgb(255, 255, 255)";

  const routesRequiringAuth = ["create", "chat", "inbox"];

  const routesWithAnimatedTabBar = ["index", "grid"];
  const allowAnimatedTabBar = routesWithAnimatedTabBar.includes(state.routes[state.index].name);

  const { authPromptModalRef } = useContext(AuthPromptModalContext);

  const { scrollingDown } = useContext(ScrollingDownContext);
  const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

  const { colors } = tailwindConfig.theme.extend;

  const routesConfig = [
    {
      iconOutline: <HomeOutline height={unfocusedIconSize} colour={unfocusedIconColour} />,
      iconFilled: <HomeFill height={focusedIconSize} colour={focusedIconColour} />,
      name: "index",
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
        backgroundColor: allowAnimatedTabBar ? rgba(colors.secondary, 0.8) : colors.secondary,
        //The position absolute is making expo go crash on android
        position: allowAnimatedTabBar && "absolute",
      }}
    >
      {routesConfig.map((route) => {
        const isFocused = state.index === state.routeNames.indexOf(route.name);

        return (
          <Pressable
            key={route.name}
            onPress={() => {
              if (!auth.currentUser && routesRequiringAuth.includes(route.name))
                return authPromptModalRef.current?.present();

              route.name === "index" ? router.push("") : router.push(route.name);
            }}
            className="flex-1 py-[6] items-center"
            asChild
          >
            {isFocused ? route.iconFilled : route.iconOutline}
          </Pressable>
        );
      })}
    </AnimatedBlurView>
  );
};

export default TabBar;
