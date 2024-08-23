import React, { useState, useRef, useEffect, useContext } from "react";
import { View, PanResponder, Text, Pressable } from "react-native";
import { FlatList, Gesture, GestureDetector, ScrollView } from "react-native-gesture-handler";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import PostFeed from "../../components/feeds/PostFeed";
import tailwindConfig from "../../tailwind.config";
import { usePathname } from "expo-router";
import axios from "../../config/axiosConfig";
import { ScrollingDownContext } from "../../utils/contexts";
import updateScrollingDown from "../../utils/functions/updateScrollingDown";
import { PostFeedListFooter } from "../../components/other/PostFeedList";
import { useTheme } from "react-native-paper";

const Profile = () => {
  const [initialRootViewHeight, setInitialRootViewHeight] = useState(null);
  const initialNameViewPadding = 125;

  const rootViewHeight = useSharedValue(null);
  const nameViewPadding = useSharedValue(initialNameViewPadding);

  const [nameViewMinimumHeight, setNameViewMinimumHeight] = useState(null);

  const [feedSelection, setFeedSelection] = useState("posts");
  const [feedState, setFeedState] = useState("collapsed");

  const [posts, setPosts] = useState([]);

  const previousScrollOffset = useRef(0);
  const { scrollingDown, setScrollingDown } = useContext(ScrollingDownContext);

  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");

  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const fetchPosts = () => {
    if (isFetching) return;
    // console.log("fetching posts in chat");
    setError("");
    setIsFetching(true);

    axios
      .get(`/posts/fetch?limit=3`)
      .then((response) => {
        if (!response.data) return setError("No more posts...");
        setPosts([...posts, ...response.data]);
        setIsFetching(false);
      })
      .catch((error) => {
        setError("Error fetching posts");
        setIsFetching(false);
      });
  };

  const handleScroll = (e) => {
    const currentOffset = e.nativeEvent.contentOffset.y;
    const contentSize = e.nativeEvent.contentSize.height;
    const visibleLength = e.nativeEvent.layoutMeasurement.height;

    const distanceFromEnd = contentSize - visibleLength - currentOffset;

    if (distanceFromEnd < 0.5 * visibleLength) fetchPosts();

    if (currentOffset < 65) {
      if (feedState == "collapsed") return;
      console.log("collapsing");
      rootViewHeight.value = withTiming(initialRootViewHeight, { duration: 650 });
      nameViewPadding.value = withTiming(initialNameViewPadding, { duration: 650 });
      setFeedState("collapsed");
    }

    if (currentOffset >= 65) {
      if (feedState == "expanded") return;
      console.log("expanding");
      rootViewHeight.value = withTiming(nameViewMinimumHeight, { duration: 650 });
      nameViewPadding.value = withTiming(0, { duration: 650 });
      setFeedState("expanded");
    }

    previousScrollOffset.current = updateScrollingDown(e, scrollingDown, setScrollingDown, previousScrollOffset.current);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <SafeAreaView
      className="flex-1"
      edges={["left", "right", "bottom", "top"]}
      style={{
        backgroundColor: theme.colors.background,
      }}
    >
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
          style={{
            paddingTop: nameViewPadding,
            minHeight: "auto",
          }}
        >
          <Text
            className="text-center"
            style={{
              ...theme.fonts.header,
              color: theme.colors.onBackground,
            }}
            onLayout={(e) => {
              if (nameViewMinimumHeight) return;
              setNameViewMinimumHeight(e.nativeEvent.layout.height);
            }}
          >
            RareDestroyer8
          </Text>
        </Animated.View>
        <View className="justify-between mt-[10] mb-[15]">
          <Text
            className="text-center"
            style={{
              ...theme.fonts.textMedium,
              color: theme.colors.onBackgroundLighter,
            }}
          >
            "Add quote here right this second!"
          </Text>
          <Pressable className="mt-[40] mb-[27]">
            <Text
              className="text-center"
              style={{
                ...theme.fonts.textMediumBold,
                color: theme.colors.onBackground,
              }}
            >
              Manage Account
            </Text>
          </Pressable>
        </View>
      </Animated.View>
      <View
        className="flex-row justify-between"
        style={{
          backgroundColor: theme.colors.primary,
        }}
      >
        <Pressable
          className="flex-1 p-[12]"
          onPress={() => {
            setFeedSelection("posts");
          }}
        >
          <Text
            className="text-center"
            style={{
              ...theme.fonts.textMediumBold,
              color: feedSelection == "posts" ? theme.colors.onPrimary : theme.colors.onPrimaryLighter,
            }}
          >
            Posts
          </Text>
        </Pressable>
        <Pressable
          className="flex-1 p-[12]"
          onPress={() => {
            setFeedSelection("comments");
          }}
        >
          <Text
            className="text-center"
            style={{
              ...theme.fonts.textMediumBold,
              color: feedSelection == "comments" ? theme.colors.onPrimary : theme.colors.onPrimaryLighter,
            }}
          >
            Comments
          </Text>
        </Pressable>
        <Pressable
          className="flex-1 p-[12]"
          onPress={() => {
            setFeedSelection("history");
          }}
        >
          <Text
            className="text-center"
            style={{
              ...theme.fonts.textMediumBold,
              color: feedSelection == "history" ? theme.colors.onPrimary : theme.colors.onPrimaryLighter,
            }}
          >
            History
          </Text>
        </Pressable>
      </View>
      <FlatList
        data={posts}
        contentContainerStyle={{ rowGap: 35 }}
        ListFooterComponent={<PostFeedListFooter error={error} fetchPosts={fetchPosts} />}
        onEndReachedThreshold={0.5}
        keyExtractor={(item) => item.id}
        onScroll={handleScroll}
        renderItem={({ item, index }) => <PostFeed item={item} index={index} />}
      />
    </SafeAreaView>
  );
};

export default Profile;
