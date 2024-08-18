import React, { useState, useRef, useEffect } from "react";
import { View, PanResponder, Text, Pressable } from "react-native";
import { FlatList, Gesture, GestureDetector, ScrollView } from "react-native-gesture-handler";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import PostFeed from "../../components/Feeds/PostFeed";
import { useLazyFetchPostsQuery } from "../../redux/api/postsApi";
import tailwindConfig from "../../tailwind.config";
import { usePathname } from "expo-router";

const DraggableHeightView = () => {
  const [initialRootViewHeight, setInitialRootViewHeight] = useState(null);
  const initialNameViewPadding = 50;

  const rootViewHeight = useSharedValue(null);
  const nameViewPadding = useSharedValue(initialNameViewPadding);

  const [nameViewMinimumHeight, setNameViewMinimumHeight] = useState(null);

  const [feedSelection, setFeedSelection] = useState("posts");
  const [feedState, setFeedState] = useState("colapsed");

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
    // console.log('called two')
    if (fetchPostsIsFetching) return;
    console.log("a");

    lazyFetchPosts({ limit: '3' })
      .unwrap()
      .then((response) => {
        console.log(response.length);
        if (!response) return setError("No more posts...");
        setPosts([...posts, ...response]);
      })
      .catch((error) => {
        setError("Error fetching posts");
      });
  };

  const handleScroll = (e) => {
    const currentOffset = e.nativeEvent.contentOffset.y;
    if (currentOffset < 10) {
      if (feedState == "collapsed") return;
      rootViewHeight.value = withTiming(initialRootViewHeight, { duration: 650 });
      nameViewPadding.value = withTiming(initialNameViewPadding, { duration: 650 });
      setFeedState("collapsed");
    }

    if (currentOffset >= 10) {
      if (feedState == "expanded") return;
      rootViewHeight.value = withTiming(nameViewMinimumHeight, { duration: 650 });
      nameViewPadding.value = withTiming(0, { duration: 650 });
      setFeedState("expanded");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <SafeAreaView className="flex-1" edges={["left", "right", "bottom"]}>
      <Animated.View
        className="justify-start overflow-hidden"
        onLayout={(e) => {
          if (initialRootViewHeight) return;
          setInitialRootViewHeight(e.nativeEvent.layout.height);
          rootViewHeight.value = e.nativeEvent.layout.height;
        }}
        style={{ height: rootViewHeight || "auto" }}
      >
        <Animated.View
          className=""
          style={{
            paddingTop: nameViewPadding,
            minHeight: "auto",
          }}
        >
          <Text
            className="text-center text-mainText"
            style={{
              fontFamily: "pd-semibold",
              fontSize: 24,
            }}
            onLayout={(e) => {
              if (nameViewMinimumHeight) return;
              setNameViewMinimumHeight(e.nativeEvent.layout.height);
            }}
          >
            RareDestroyer8
          </Text>
        </Animated.View>
        <View className="justify-between mt-[10] mb-[15] ">
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
      <View className="flex-row justify-between">
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
      <FlatList
        data={posts}
        contentContainerStyle={{ rowGap: 35 }}
        ListFooterComponent={
          <View
            className=""
            style={{
              marginBottom: insets.bottom + 25,
            }}
          >
            <Text
              className=""
              style={{
                color: error ? colors.mainRed : colors.mainText,
                fontSize: 16,
                fontFamily: "p-semibold",
                textAlign: "center",
                letterSpacing: 1.25,
              }}
            >
              {error || "Fetching posts..."}
            </Text>
          </View>
        }
        onEndReached={() => {
          console.log("end reachd");
          fetchPosts();
        }}
        onEndReachedThreshold={0.5}
        keyExtractor={(item) => item.id}
        onScroll={handleScroll}
        bounces={false}
        top
        renderItem={({ item, index }) => <PostFeed item={item} index={index} />}
      />
    </SafeAreaView>
  );
};

export default DraggableHeightView;
