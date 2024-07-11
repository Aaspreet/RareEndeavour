import { View, Text, FlatList } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, Redirect, router, useLocalSearchParams, useRootNavigationState } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { HomeFeedContext } from "../../components/contexts/HomeFeedContext";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const previousScrollOffset = useRef(0);

  const { scrollingDown, setScrollingDown } = useContext(HomeFeedContext);

  const handleScroll = (e) => {
    const currentOffset = e.nativeEvent.contentOffset.y;
    const direction = currentOffset > previousScrollOffset.current ? "down" : "up";

    const isAtTop = currentOffset <= 20;
    const isAtBottom = e.nativeEvent.contentSize.height <= e.nativeEvent.layoutMeasurement.height + currentOffset+100;
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
    const fetchPosts = async () => {
      const response = await fetch("https://dummyjson.com/posts");
      const data = await response.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  return (
    <SafeAreaView className="" style={{ backgroundColor: "rgb(20, 20, 20)" }} edges={["left", "right", "bottom"]}>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <View className="px-4 py-6 border-b border-zinc-400">
            <Text className="text-white font-bold mb-3">{item.title}</Text>
            <Text className="text-white">{item.body}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        onScroll={handleScroll}
      />
    </SafeAreaView>
  );
};

export default Home;
