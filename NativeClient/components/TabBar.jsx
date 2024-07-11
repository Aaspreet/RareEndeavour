import { View, Text, TouchableOpacity, Pressable } from "react-native";
import React, { useEffect } from "react";
import { BlurView } from "expo-blur";
import { useContext } from "react";
import { HomeFeedContext } from "./contexts/HomeFeedContext";
import Animated, { useAnimatedProps, useSharedValue, withTiming } from "react-native-reanimated";
import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const TabBar = ({ state, descriptors, navigation, ...rest }) => {
  const { scrollingDown } = useContext(HomeFeedContext);
  const blurViewIntensity = useSharedValue(0);
  const isHomeScreen = state.routes[state.index].name === "index";

  const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

  const modifiedRoutess = state.routes.map((route, index) => ({ ...route, index }));
  modifiedRoutess.splice(2, 0, { name: "create", key: "create" });

  console.log(modifiedRoutess);
  const navigationBarIcons = [
    {
      iconType: "Ionicons",
      iconOutline: "home-outline",
      iconFilled: "home",
      route: "index",
    },
    {
      iconType: "Ionicons",
      iconOutline: "grid-outline",
      iconFilled: "grid",
      route: "grid",
    },
    {
      iconType: "Ionicons",
      iconOutline: "add",
      iconFilled: "add",
      route: "create",
    },
    {
      iconType: "Ionicons",
      iconOutline: "chatbox-outline",
      iconFilled: "chatbox",
      route: "chat",
    },
    {
      iconType: "Ionicons",
      iconOutline: "notifications-outline",
      iconFilled: "notifications",
      route: "inbox",
    },
  ];

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
      intensity={isHomeScreen ? blurViewIntensity : 0}
      tint="dark"
      style={{
        paddingBottom: rest.insets.bottom,
        paddingTop: 5,
        backgroundColor: isHomeScreen ? "rgba(0, 0, 0, 0.7)" : "rgb(0, 0, 0)",
        position: isHomeScreen && "absolute",
      }}
    >
      {modifiedRoutess.map((route, index) => {
        const { options } = descriptors[route.key] || {};

        // const label =
        //   options.tabBarLabel !== undefined
        //     ? options.tabBarLabel
        //     : options.title !== undefined
        //     ? options.title
        //     : route.name;

        const isFocused = state.index === route.index;

        const onPress = () => {
          if (route.name === "create") {
            router.push("create");
            return;
          }

          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        const icon = navigationBarIcons.find((icon) => icon.route === route.name);
        if (!icon) return null;
        const IconComponent = icon.iconType === "MaterialCommunityIcons" ? MaterialCommunityIcons : Ionicons;
        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options?.tabBarAccessibilityLabel || route.name}
            testID={options?.tabBarTestID || route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            className="flex-1 items-center"
          >
            <View className="py-2">
              <IconComponent
                name={isFocused ? icon.iconFilled : icon.iconOutline}
                color={isFocused ? "rgb(255, 255, 255)" : "rgb(255, 255, 255)"}
                size={isFocused ? 25 : 23}
              />
            </View>
          </Pressable>
        );
      })}
    </AnimatedBlurView>
  );
};

export default TabBar;
