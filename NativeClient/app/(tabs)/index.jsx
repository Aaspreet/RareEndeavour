import { View, Text, FlatList, Pressable, StatusBar } from "react-native";
import React, { lazy, memo, useContext, useEffect, useRef, useState } from "react";
import { Link, Redirect, router, useLocalSearchParams, useRootNavigationState } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../../config/firebaseConfig";
import { FontAwesome, Ionicons, MaterialCommunityIcons, Octicons } from "react-native-vector-icons";
import tailwindConfig from "../../tailwind.config";
import { ScrollingDownContext } from "../../utils/contexts";
import PostFeed from "../../components/feeds/PostFeed";
import axios from "../../config/axiosConfig";
import { Retry } from "../../assets/icons";
import updateScrollingDown from "../../utils/functions/updateScrollingDown";
import { PostFeedListFooter } from "../../components/other/PostFeedList";
import { useTheme } from "react-native-paper";

const Home = () => {
  const [posts, setPosts] = useState([]);

  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const previousScrollOffset = useRef(0);
  const { scrollingDown, setScrollingDown } = useContext(ScrollingDownContext);

  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const fetchPosts = () => {
    if (isFetching) return;
    // console.log("fetching posts in index");
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

    previousScrollOffset.current = updateScrollingDown(
      e,
      scrollingDown,
      setScrollingDown,
      previousScrollOffset.current
    );
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <SafeAreaView
      className="flex-1"
      edges={["left", "right", "bottom"]}
      style={{
        backgroundColor: theme.colors.background,
      }}
    >
      <FlatList
        data={posts}
        contentContainerStyle={{
          paddingTop: insets.top,
          rowGap: 35,
        }}
        ListHeaderComponent={
          <View className="justify-center">
            <Text
              className="mt-4"
              style={{
                ...theme.fonts.headerSmaller,
                color: theme.colors.onBackground,
                letterSpacing: 1.25,
              }}
            >
              Welcome, RareV
            </Text>
          </View>
        }
        ListFooterComponent={<PostFeedListFooter error={error} fetchPosts={fetchPosts} />}
        keyExtractor={(item) => item.id}
        onScroll={handleScroll}
        renderItem={({ item }) => <PostFeed item={item} />}
      />
      <StatusBar barStyle={"light-content"} />
    </SafeAreaView>
  );
};

export default Home;
