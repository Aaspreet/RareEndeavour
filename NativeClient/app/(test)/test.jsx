import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from "react-native-reanimated";
import { router } from "expo-router";
import { Dimensions, View } from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function MyModalScreen() {
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (translateX.value > screenWidth / 2) {
        router.back();
      } else {
        translateX.value = withSpring(0);
      }
    });

  return (
    <View></View>
    // <GestureDetector gesture={panGesture}>
    //   <Animated.View style={[animatedStyle]}>{/* Your modal content here */}</Animated.View>
    // </GestureDetector>
  );
}
