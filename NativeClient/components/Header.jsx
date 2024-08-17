import { View, Text, StatusBar } from "react-native";
import React, { useContext } from "react";
import { useEffect } from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeFeedContext } from "./contexts";
import Animated, { useAnimatedStyle, useSharedValue, withClamp, withTiming } from "react-native-reanimated";
import tailwindConfig from "../tailwind.config";

const Header = ({ route, navigation, ...rest }) => {
  const insets = useSafeAreaInsets();
  const { colors } = tailwindConfig.theme.extend;

  const headerTitles = {
    index: "Home",
    grid: "Grid",
    create: "Create",
    chat: "Chat",
    inbox: "Inbox",
  };

  const title = headerTitles[route.name];

  return (
    <SafeAreaView
      edges={["left", "right"]}
      style={{
        backgroundColor: colors.primary,
      }}
    >
      <View className="flex-row justify-center pb-2" style={{ paddingTop: insets.top }}>
        <View>
          <Text
            className="text-center font-bold text-xl text-mainText"
          >
            {title}
          </Text>
        </View>
      </View>
      <StatusBar barStyle="light-content" />
    </SafeAreaView>
  );
};

export default Header;

// const intialHeaderHeight = insets.top + 25;

// useEffect(() => {
//   if (scrollingDown) {
//     headerHeight.value = withTiming(0, { duration: 500 });
//   } else {
//     headerHeight.value = withTiming(intialHeaderHeight, { duration: 500 });
//   }
//   console.log(scrollingDown)
// }, [scrollingDown]);

//MAKE SURE TO ADD AnimatedSafeAreaView
// const { scrollingDown } = useContext(HomeFeedContext);
// const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);
// const headerHeight = useSharedValue(intialHeaderHeight);
