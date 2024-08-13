import { View, Text, Pressable, Image, ScrollView, FlatList, PanResponder } from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTestMMutation } from "../../redux/api/userApi";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { auth } from "../../config/firebaseConfig";
import { BlurView } from "expo-blur";
import Animated, { useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { HomeFeedContext } from "../../components/contexts/HomeFeedContext";
import { Link } from "expo-router";

const Grid = () => {
  const [layoutComplete, setLayoutComplete] = useState(false);

  const [initialProfileHeight, setInitialProfileHeight] = useState(null);
  const [profileState, setProfileState] = useState("expanded");
  const profileHeaderHeight = 245;

  const [viewingPreviousContent, setViewingPreviousContent] = useState("posts");

  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  const previousScrollOffset = useRef(0);

  const profileInfoHeightAnimated = useSharedValue(null);
  const profileHeaderHeightAnimated = useSharedValue(profileHeaderHeight);
  const pfpOpacityAnimated = useSharedValue(1);

  const minimizedProfileHeaderHeight = 100;

  const { scrollingDown, setScrollingDown } = useContext(HomeFeedContext);

  const handleScroll = (e) => {
    const currentOffset = e.nativeEvent.contentOffset.y;

    // Profile header animation
    if (currentOffset < -40) {
      if (profileState != "expanded") {
        profileHeaderHeightAnimated.value = withTiming(profileHeaderHeight, { duration: 650 });
        profileInfoHeightAnimated.value = withTiming(initialProfileHeight, { duration: 650 });
        pfpOpacityAnimated.value = withTiming(1, { duration: 650 });
      }
      setProfileState("expanded");
    } else if (currentOffset > 150) {
      if (profileState != "minimized") {
        profileHeaderHeightAnimated.value = withTiming(minimizedProfileHeaderHeight, { duration: 650 });
        profileInfoHeightAnimated.value = withTiming(0, { duration: 650 });
        pfpOpacityAnimated.value = withTiming(0, { duration: 650 });
      }
      setProfileState("minimized");
    } else if (currentOffset > 0) {
      if (profileState != "semi-minimized") {
        profileHeaderHeightAnimated.value = withTiming(profileHeaderHeight, { duration: 650 });
        profileInfoHeightAnimated.value = withTiming(0, { duration: 650 });
        pfpOpacityAnimated.value = withTiming(1, { duration: 650 });
      }
      setProfileState("semi-minimized");
    }

    // Tabbar animation
    const direction = currentOffset > previousScrollOffset.current ? "down" : "up";

    const isAtTop = currentOffset <= 20;
    const isAtBottom = e.nativeEvent.contentSize.height <= e.nativeEvent.layoutMeasurement.height + currentOffset + 100;
    if (isAtTop || isAtBottom) return setScrollingDown(false);

    if (Math.abs(currentOffset - previousScrollOffset.current) < 10) return;

    if (direction === "down" && !scrollingDown) {
      setScrollingDown(true);
    } else if (direction === "up" && scrollingDown) {
      setScrollingDown(false);
    }

    previousScrollOffset.current = currentOffset;
  };

  const handleLayout = (e) => {
    if (!initialProfileHeight) {
      profileInfoHeightAnimated.value = e.nativeEvent.layout.height;
      setInitialProfileHeight(e.nativeEvent.layout.height);
    }
    setLayoutComplete(true);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("https://dummyjson.com/posts");
      const data = await response.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "rgb(20, 20, 20)" }} edges={["left", "right", "bottom"]}>
      <View className="flex-1">
        <Animated.View className="items-center justify-end" style={{ height: profileHeaderHeightAnimated }}>
          <Image
            src="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"
            className="absolute top-0 w-full h-[85%]"
          />
          <BlurView
            tint="dark"
            className="absolute top-0 w-full h-full"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            intensity={80}
          />

          <Animated.View style={{ opacity: pfpOpacityAnimated }}>
            <Image
              src="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"
              className="h-24 w-24 border border-white rounded-full"
            />
          </Animated.View>

          <View className="pb-2">
            <Text className="text-white text-[28px] font-bold">RareDestroyer8</Text>
          </View>
        </Animated.View>
        <Animated.View
          className="overflow-hidden"
          onLayout={handleLayout}
          style={{ height: layoutComplete ? profileInfoHeightAnimated : "30%" }}
        >
          <View className="mx-4">
            <View className="flex-col mt-3 items-center">
              <View>
                <Pressable className="mt-5">
                  <Text className="text-[17px] text-zinc-200 text-center mx-5">
                    This is a temporary bio. This does not include many words and does not signify anything. It is only
                    a temporary string of text written while developing the profile page user interface.
                  </Text>
                  <Text className="text-white text-center">-</Text>
                </Pressable>
                <Link href={"account_settings"} push asChild>
                  <Pressable className="mt-10">
                    <Text className="text-white text-center font-bold text-[18px]">Manage Account</Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          </View>
        </Animated.View>
        <View className="border-t border-t-zinc-500 mx-4" style={{}}>
          <View className="flex-row justify-between">
            <Pressable className="py-2 px-5 flex-1">
              <Text
                className="text-[18px] font-bold text-center"
                style={{ color: viewingPreviousContent === "posts" ? "rgb(228 228 231)" : "rgb(161 161 170)" }}
              >
                Posts
              </Text>
            </Pressable>
            <Pressable className="py-2 px-5 flex-1">
              <Text
                className="text-[18px] font-bold text-center"
                style={{ color: viewingPreviousContent === "comments" ? "rgb(228 228 231)" : "rgb(161 161 170)" }}
              >
                Comments
              </Text>
            </Pressable>
          </View>
          <View className="mt-1">
            {viewingPreviousContent === "posts" ? (
              <FlatList
                data={posts}
                renderItem={({ item, index }) => (
                  <View className={`px-1 ${index == 0 ? "pb-6" : "py-6"} border-b border-zinc-400`}>
                    <Text className="text-white font-bold mb-3 text-[20px]">{item.title}</Text>
                    <Text className="text-white text-[15px]">{item.body}</Text>
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()}
                onScroll={handleScroll}
              />
            ) : null}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Grid;
