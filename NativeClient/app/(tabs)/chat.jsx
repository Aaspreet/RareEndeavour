import React, { useState, useRef, useEffect } from "react";
import { View, PanResponder, Text, Pressable } from "react-native";
import { FlatList, Gesture, GestureDetector, ScrollView } from "react-native-gesture-handler";
import Animated, { useSharedValue } from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import PostFeed from "../../components/Feeds/PostFeed";
import { useLazyFetchPostsQuery } from "../../redux/api/postsApi";
import tailwindConfig from "../../tailwind.config";
import { usePathname } from "expo-router";

const DraggableHeightView = () => {
  // const reference = useRef(null);

  // const height = useSharedValue(400);
  // const prevTranslationY = useSharedValue(0);

  // const pan = Gesture.Pan()
  //   .onStart(() => {})
  //   .onUpdate(({ translationY }) => {
  //     const diff = translationY - prevTranslationY.value;
  //     height.value = height.value + diff;
  //     prevTranslationY.value = translationY;
  //   })
  //   .onEnd(() => {
  //     prevTranslationY.value = 0;
  //   });

  // const handleScroll = (e) => {
  //   // e.scrollTo({ y: 0 });
  //   reference.current?.scrollTo({ y: 0 });
  //   const currentOffset = e.nativeEvent.contentOffset.y;
  //   // console.log(currentOffset);
  //   // console.log(e);
  //   // console.log(e.nativeEvent.contentOffset.y);
  // };

  const [initialNameViewHeight, setInitialNameViewHeight] = useState(null);
  const [initialRootViewHeight, setInitialRootViewHeight] = useState(null);
  const initialNameViewPadding = 50;

  const rootViewHeight = useSharedValue(400);
  const nameViewPadding = useSharedValue(50);

  const prevTranslationY = useSharedValue(0);

  const [posts, setPosts] = useState([]);

  const [error, setError] = useState("");

  const insets = useSafeAreaInsets();
  const { colors } = tailwindConfig.theme.extend;

  const [
    lazyFetchPosts,
    {
      data: fetchPostsData,
      error: fetchPostsError,
      isLoading: fetchPostsIsLoading,
      isError: fetchPostsIsError,
      isFetching: fetchPostsIsFetching,
    },
  ] = useLazyFetchPostsQuery();

  const fetchPosts = () => {
    if (fetchPostsIsFetching) return;
    lazyFetchPosts({ limit: 20 })
      .unwrap()
      .then((response) => {
        console.log("abc");
        // console.log(response);
        if (response.length === 0) return setError("No more posts...");
        setPosts([...posts, ...response]);
      })
      .catch((error) => {
        setError("Error fetching posts");
      });
  };

  const pan = Gesture.Pan()
    .onStart(() => {})
    .onUpdate(({ translationY }) => {
      const diff = translationY - prevTranslationY.value;
      // console.log(diff);

      if (diff < 0) {
        if (rootViewHeight.value == initialNameViewHeight && nameViewPadding.value > 0) {
          if (nameViewPadding.value + diff < 0) {
            nameViewPadding.value = 0;
          } else {
            nameViewPadding.value = nameViewPadding.value + diff;
          }
        }

        if (rootViewHeight.value + diff < initialNameViewHeight) {
          rootViewHeight.value = initialNameViewHeight;
        } else {
          rootViewHeight.value = rootViewHeight.value + diff;
        }
      } else {
        if (nameViewPadding.value < initialNameViewPadding) {
          if (nameViewPadding.value + diff > initialNameViewPadding) {
            nameViewPadding.value = initialNameViewPadding;
          } else {
            nameViewPadding.value = nameViewPadding.value + diff;
          }
        }
        if (nameViewPadding.value == initialNameViewPadding && rootViewHeight.value < initialRootViewHeight) {
          console.log("here");
          if (rootViewHeight.value + diff > initialRootViewHeight) {
            rootViewHeight.value = initialRootViewHeight;
          } else {
            rootViewHeight.value = rootViewHeight.value + diff;
          }
        }
      }

      prevTranslationY.value = translationY;
    })
    .onEnd(() => {
      prevTranslationY.value = 0;
    });

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <SafeAreaView className="flex-1" edges={["left", "right", "bottom"]}>
      <Animated.View
        className="bg-blue-500 justify-start"
        onLayout={(e) => {
          if (initialRootViewHeight) return;
          setInitialRootViewHeight(e.nativeEvent.layout.height);
          rootViewHeight.value = e.nativeEvent.layout.height;
        }}
        style={{ height: rootViewHeight || "auto" }}
      >
        {/* <View className="bg-red-500 w-52 h-52"></View> */}
        <Animated.View
          className="bg-red-500"
          onLayout={(e) => {
            if (initialNameViewHeight) return;
            setInitialNameViewHeight(e.nativeEvent.layout.height);
          }}
          style={{
            paddingTop: nameViewPadding,
          }}
        >
          <Text
            className="text-center text-mainText"
            style={{
              fontFamily: "pd-semibold",
              fontSize: 24,
            }}
          >
            RareDestroyer8
          </Text>
        </Animated.View>
        <View className="bg-green-500 justify-between mt-[10] mb-[15] ">
          <Text
            className="text-center text-secondaryText"
            style={{
              fontFamily: "p-medium",
              fontSize: 16,
            }}
          >
            "Add quote here right this second!"
          </Text>
          <Pressable className="mt-[40]">
            <Text
              className="text-center text-mainText"
              style={{
                fontFamily: "p-semibold",
                fontSize: 17,
              }}
            >
              Manage Account
            </Text>
          </Pressable>
        </View>
      </Animated.View>
      <View className="bg-yellow-500 flex-row justify-between">
        <Pressable className="flex-1 py-[4]">
          <Text
            className="text-center"
            style={{
              fontFamily: "p-semibold",
              fontSize: 17,
              color: colors.mainText,
            }}
          >
            Posts
          </Text>
        </Pressable>
        <Pressable className="flex-1 py-[4]">
          <Text
            className="text-center"
            style={{
              fontFamily: "p-semibold",
              fontSize: 17,
              color: colors.mainText,
            }}
          >
            Comments
          </Text>
        </Pressable>
        <Pressable className="flex-1 py-[4]">
          <Text
            className="text-center"
            style={{
              fontFamily: "p-semibold",
              fontSize: 17,
              color: colors.mainText,
            }}
          >
            History
          </Text>
        </Pressable>
      </View>
      <GestureDetector gesture={pan}>
        <FlatList
          data={posts}
          contentContainerStyle={{ rowGap: 35, backgroundColor: "red", flex: 1 }}
          onEndReached={() => {
            console.log("end reachd");
            fetchPosts();
          }}
          onEndReachedThreshold={0.5}
          keyExtractor={(item) => item.id}
          // onScroll={handleScroll}
          renderItem={({ item, index }) => <PostFeed item={item} index={index} />}
          scrollEnabled={false}
        />
      </GestureDetector>
    </SafeAreaView>
  );
};

export default DraggableHeightView;
