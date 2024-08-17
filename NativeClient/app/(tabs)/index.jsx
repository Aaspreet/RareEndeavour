import { View, Text, FlatList, Pressable, StatusBar } from "react-native";
import React, { lazy, memo, useContext, useEffect, useRef, useState } from "react";
import { Link, Redirect, router, useLocalSearchParams, useRootNavigationState } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../../config/firebaseConfig";
import { FontAwesome, Ionicons, MaterialCommunityIcons, Octicons } from "react-native-vector-icons";
import { useLazyFetchPostsQuery } from "../../redux/api/postsApi";
import tailwindConfig from "../../tailwind.config";
import { ScrollingDownContext } from "../../components/contexts";

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
    if (fetchPostsIsFetching) return;
    lazyFetchPosts({ limit: 20 })
      .unwrap()
      .then((response) => {
        // console.log(response);
        if (response.length === 0) return setError("No more posts...");
        console.log(posts.length);
        setPosts([...posts, ...response]);
      })
      .catch((error) => {
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
    // fetchPosts();
    // if (fetchPostsIsFetching) console.log("fetching posts");
  }, [fetchPostsIsFetching]);

  const Feed = memo(({ item }) => {
    return (
      <View className="pt-[30] pb-[25] px-[9] bg-primary rounded-lg">
        {/* {console.log("rendering", item.id.toString())} */}
        <View className="pb-[28] flex-row justify-between">
          <View className="">
            <Pressable className="px-[6]">
              <Text
                className="text-mainText"
                style={{
                  fontSize: 15,
                  fontFamily: "p-regular",
                }}
              >
                {item.username}
              </Text>
            </Pressable>
            <Text
              className="text-secondaryText pl-[6]"
              style={{
                fontSize: 12,
                fontFamily: "p-regular",
              }}
            >
              {item.timestamp}
            </Text>
          </View>
          <View className="flex-row items-center">
            {/* <Text
                  className="mr-[12]"
                  style={{
                    fontSize: 14,
                    fontFamily: "p-semibold",
                    color: "white",
                  }}
                >
                  5 min read
                </Text> */}
            <Pressable className="py-[4] px-[6] mt-[4]">
              <Octicons name="kebab-horizontal" size={16} color={"white"} />
            </Pressable>
          </View>
        </View>
        {/* <View className="flex-row">
          {item.tags.map((tag) => {
            return (
              <View className="px-[6] py-[2]" key={tag}>
                <Text
                  className="text-secondaryText"
                  style={{
                    fontSize: 15,
                    fontFamily: "p-regular",
                  }}
                >
                  # {tag}
                </Text>
              </View>
            );
          })}
        </View> */}
        <View className="mt-[12] pl-[6]">
          <Text
            className="text-mainText "
            style={{
              fontSize: 25,
              // lineHeight: "50%",
              lineHeight: 37,
              fontFamily: "p-bold",
            }}
          >
            {item.title}
          </Text>
        </View>
        <View className="flex-row mt-[36] justify-between mr-[10] ml-[3]">
          <Pressable className="px-[6] py-[4] flex-row items-center">
            <View className="transform scale-x-[-1] mr-[10]">
              <Ionicons name="chatbubble-outline" size="18" color="white" />
            </View>
            <Text
              className="text-thirdText"
              style={{
                fontSize: 13,
                fontFamily: "p-regular",
              }}
            >
              Add comment
            </Text>
          </Pressable>
          <View>
            <View className="flex-row items-center">
              <Pressable className="px-[6] py-[6]">
                <Ionicons name="triangle-outline" size="16" color="white" />
              </Pressable>
              <Text
                className="text-mainText"
                style={{
                  fontSize: 15,
                  fontFamily: "p-regular",
                }}
              >
                {item.vote_count}
              </Text>
              <Pressable className="transform scale-y-[-1] px-[6] py-[6]">
                <Ionicons name="triangle-outline" size="16" color="white" />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    );
  });

  return (
    <SafeAreaView className="flex-1 bg-secondary" edges={["left", "right", "bottom"]}>
      <FlatList
        data={posts}
        contentContainerStyle={{ paddingTop: insets.top, rowGap: 35 }}
        onEndReached={() => {
          console.log("end reachd");
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
        renderItem={({ item }) => <Feed item={item} />}
      />
      <StatusBar barStyle={"light-content"} />
    </SafeAreaView>
  );
};

export default Home;
