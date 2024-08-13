import { View, Text, StatusBar } from "react-native";
import React, { useContext } from "react";
import { useEffect } from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeFeedContext } from "./contexts/HomeFeedContext";
import Animated, { useAnimatedStyle, useSharedValue, withClamp, withTiming } from "react-native-reanimated";

const Header = ({ route, navigation, ...rest }) => {
  const insets = useSafeAreaInsets();
  const intialHeaderHeight = insets.top + 25;

  // const { scrollingDown } = useContext(HomeFeedContext);
  // const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

  // const headerHeight = useSharedValue(intialHeaderHeight);

  const headerTitles = {
    index: "Home",
    grid: "Grid",
    create: "Create",
    chat: "Chat",
    inbox: "Inbox",
  };
  const title = headerTitles[route.name];

  const Switch = () => {
    switch (route.name) {
      case "":
        break;
      default:
        return (
          <View>
            <Text className="text-center font-bold text-xl text-white">{title}</Text>
          </View>
        );
        break;
    }
  };

  // useEffect(() => {
  //   if (scrollingDown) {
  //     headerHeight.value = withTiming(0, { duration: 500 });
  //   } else {
  //     headerHeight.value = withTiming(intialHeaderHeight, { duration: 500 });
  //   }
  //   console.log(scrollingDown)
  // }, [scrollingDown]);

  //MAKE SURE TO ADD AnimatedSafeAreaView
  return (
    <SafeAreaView edges={["left", "right"]} className="bg-zinc-950">
      <View className="flex-row justify-center pb-2" style={{ paddingTop: insets.top }}>
        <Switch />
      </View>
      <StatusBar barStyle="light-content" />
    </SafeAreaView>
  );
};

export default Header;
