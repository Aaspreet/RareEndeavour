import { View, Text, FlatList, Pressable, StatusBar } from "react-native";
import React, { lazy, memo, useContext, useEffect, useRef, useState } from "react";
import { Link, Redirect, router, useLocalSearchParams, useRootNavigationState } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../../config/firebaseConfig";
import { FontAwesome, Ionicons, MaterialCommunityIcons, Octicons } from "react-native-vector-icons";
import { postsApi, useLazyFetchPostsQuery } from "../../redux/api/postsApi";
import tailwindConfig from "../../tailwind.config";
import { ScrollingDownContext } from "../../components/contexts";
import PostFeed from "../../components/Feeds/PostFeed";

const Home = () => {
  const [posts, setPosts] = useState([]);

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

  const [error, setError] = useState("");

  const previousScrollOffset = useRef(0);
  const { scrollingDown, setScrollingDown } = useContext(ScrollingDownContext);

  const insets = useSafeAreaInsets();
  const { colors } = tailwindConfig.theme.extend;

  const fetchPosts = () => {
    console.log("called");

    if (fetchPostsIsFetching) return;
    lazyFetchPosts()
      .unwrap()
      .then((response) => {
        console.log(response);
        console.log('response above')

        
        if (!response) return setError("No more posts...");
        // console.log(posts.length);
        setPosts([...posts, ...response]);
      })
      .catch((error) => {
        console.log(error);
        setError("Error fetching posts");
      });
  };

  const handleScroll = (e) => {
    const currentOffset = e.nativeEvent.contentOffset.y;
    const direction = currentOffset > previousScrollOffset.current ? "down" : "up";

    const isAtTop = currentOffset <= 20;
    const isAtBottom = e.nativeEvent.contentSize.height <= e.nativeEvent.layoutMeasurement.height + currentOffset + 40;

    if (isAtTop || isAtBottom) return setScrollingDown(false);

    if (Math.abs(currentOffset - previousScrollOffset.current) < 10) return;

    if (direction === "down" && !scrollingDown) {
      setScrollingDown(true);
    } else if (direction === "up" && scrollingDown) {
      setScrollingDown(false);
    }

    previousScrollOffset.current = currentOffset;
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-secondary" edges={["left", "right", "bottom"]}>
      <FlatList
        data={posts}
        contentContainerStyle={{ paddingTop: insets.top, rowGap: 35 }}
        onEndReached={() => {
          console.log("end reachd home");
          fetchPosts();
        }}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <View className="justify-center">
            <Text
              className="text-white mt-4"
              style={{
                fontSize: 20,
                fontFamily: "p-semibold",
                textAlign: "center",
                letterSpacing: 1.25,
              }}
            >
              Welcome, RareV
            </Text>
          </View>
        }
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
        keyExtractor={(item) => item.id}
        onScroll={handleScroll}
        renderItem={({ item }) => <PostFeed item={item} />}
      />
      <StatusBar barStyle={"light-content"} />
    </SafeAreaView>
  );
};

export default Home;
