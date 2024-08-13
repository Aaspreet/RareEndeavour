import { View, Text, FlatList, Pressable, StatusBar } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, Redirect, router, useLocalSearchParams, useRootNavigationState } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { HomeFeedContext } from "../../components/contexts/HomeFeedContext";
import { auth } from "../../config/firebaseConfig";
import { FontAwesome, Ionicons, MaterialCommunityIcons, Octicons } from "react-native-vector-icons";

const Home = () => {
  const [posts, setPosts] = useState([]);

  const previousScrollOffset = useRef(0);
  const { scrollingDown, setScrollingDown } = useContext(HomeFeedContext);

  const insets = useSafeAreaInsets();

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
    // const fetchPosts = async () => {
    //   const response = await fetch("https://dummyjson.com/posts");
    //   const data = await response.json();
    //   setPosts(data.posts);
    // };
    // fetchPosts();
    // console.log("fetching posts");
    setPosts([
      {
        id: 1,
        title: "Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et et et.",
        body: "This is the body of post one This is the body of post one This is the body of post one ",
        readingTime: "5 min read",
        timestamp: "2 hours ago",
        voteCount: 1024,
        tags: ["tag1", "tag2", "tag3"],
        username: "Anonymouse4",
      },
      {
        id: 2,
        title: "Post Two Post Two Post Two",
        body: "This is the body of post two This is the body of post two This is the body of post two",
        readingTime: "3 min read",
        timestamp: "4 hours ago",
        voteCount: 1024,
        tags: ["tag1", "tag2", "tag3"],
        username: "Anonymouse4",
      },
      {
        id: 3,
        title: "Post Three Post Three Post Three",
        body: "This is the body of post three This is the body of post three This is the body of post three",
        readingTime: "7 min read",
        timestamp: "6 hours ago",
        voteCount: 1024,
        tags: ["tag1", "tag2", "tag3"],
        username: "Anonymouse4",
      },
      {
        id: 4,
        title: "Post Four Post Four Post Four",
        body: "This is the body of post four This is the body of post four This is the body of post four",
        readingTime: "2 min read",
        timestamp: "8 hours ago",
        voteCount: 1024,
        tags: ["tag1", "tag2", "tag3"],
        username: "Anonymouse4",
      },
    ]);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-secondary" edges={["left", "right", "bottom"]}>
      <FlatList
        data={posts}
        contentContainerStyle={{ paddingTop: insets.top, rowGap: 35 }}
        ListHeaderComponent={
          <View className="justify-center">
            <Text
              className="text-white mt-4"
              style={{
                fontSize: 20,
                fontFamily: "p-semibold",
                textAlign: "center",
                letterSpacing: 1.25
              }}
            >
              Welcome, RareV
            </Text>
          </View>
        }
        keyExtractor={(item) => item.id.toString()}
        onScroll={handleScroll}
        renderItem={({ item }) => (
          <View className="pt-[30] pb-[25] px-[9] bg-primary rounded-lg">
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
                <Text
                  className="mr-[12]"
                  style={{
                    fontSize: 14,
                    fontFamily: "p-semibold",
                    color: "white",
                  }}
                >
                  {item.readingTime}
                </Text>
                <Pressable className="py-[4] px-[6] mt-[4]">
                  <Octicons name="kebab-horizontal" size={16} color={"white"} />
                </Pressable>
              </View>
            </View>
            <View className="flex-row">
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
            </View>
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
                    {item.voteCount}
                  </Text>
                  <Pressable className="transform scale-y-[-1] px-[6] py-[6]">
                    <Ionicons name="triangle-outline" size="16" color="white" />
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        )}
      />
      <StatusBar barStyle={"light-content"} />
    </SafeAreaView>
  );
};

export default Home;
