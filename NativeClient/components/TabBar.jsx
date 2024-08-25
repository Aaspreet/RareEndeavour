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
  ProfileFill,
  ProfileOutline,
} from "../assets/icons";
import { AuthPromptModalContext, IsAuthenticatedContext, ScrollingDownContext } from "../utils/contexts";
import { useTheme } from "react-native-paper";
import { useFetchUserQuery } from "../redux/api/userApi";

const TabBar = ({ state, ...rest }) => {
  const blurViewIntensity = useSharedValue(0);

  const theme = useTheme();

  const focusedIconSize = 27;
  const unfocusedIconSize = 25;

  const focusedIconColour = theme.colors.onBackground;
  const unfocusedIconColour = theme.colors.onBackground;

  const routesRequiringAuth = ["create", "chat", "inbox"];

  const routesWithAnimatedTabBar = ["index", "profile", "chat"];
  const allowAnimatedTabBar = routesWithAnimatedTabBar.includes(state.routes[state.index].name);

  const { authPromptModalRef } = useContext(AuthPromptModalContext);
  const { isAuthenticated, checkAuthentication } = useContext(IsAuthenticatedContext);

  const { scrollingDown } = useContext(ScrollingDownContext);
  const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

  const routesConfig = [
    {
      iconOutline: <HomeOutline height={unfocusedIconSize} colour={unfocusedIconColour} />,
      iconFilled: <HomeFill height={focusedIconSize} colour={focusedIconColour} />,
      name: "index",
    },
    {
      iconOutline: <ProfileOutline height={unfocusedIconSize} colour={unfocusedIconColour} />,
      iconFilled: <ProfileFill height={focusedIconSize} colour={focusedIconColour} />,
      name: "profile",
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
        backgroundColor: allowAnimatedTabBar ? rgba(theme.colors.background, 0.8) : theme.colors.background,
        //The position absolute is making expo go crash on android
        position: allowAnimatedTabBar && "absolute",
      }}
    >
      {routesConfig.map((route) => {
        const isFocused = state.index === state.routeNames.indexOf(route.name);

        return (
          <Pressable
            key={route.name}
            onPress={async () => {
              if (!auth.currentUser && routesRequiringAuth.includes(route.name))
                return authPromptModalRef.current?.present();
              if (routesRequiringAuth.includes(route.name)) {
                const response = await checkAuthentication(true);
                if (!response) return;
              }

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
