import { View, Text, Pressable, Keyboard, ScrollView, FlatList } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome, Ionicons, MaterialCommunityIcons } from "react-native-vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { postsApi, useLazyGetPostQuery } from "../../../redux/api/postsApi";
import { useDispatch } from "react-redux";
import { useGetCommentsMutation } from "../../../redux/api/commentsApi";
import AddComment from "../../../components/other/AddComment";

const PostPage = () => {
  const { id } = useLocalSearchParams();
  const [getPost, { data: postData, error: postError, isLoading: postIsLoading, isSuccess: postIsSuccess }] =
    useLazyGetPostQuery();

  const [
    getComments,
    {
      data: commentsData,
      error: commentsError,
      isLoading: commentsIsLoading,
      isSuccess: commentsIsSuccess,
      reset: resetComments,
    },
  ] = useGetCommentsMutation();

  const [comments, setComments] = useState([]);
  const [keyboardShowing, setKeyboardShowing] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const [replyingTo, setReplyingTo] = useState(null);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (commentsData) {
      if (comments[comments.length - 1]?.id !== commentsData.comments[commentsData.comments.length - 1]?.id) {
        setComments((prev) => [...prev, ...commentsData.comments]);
      }
    }
  }, [commentsData]);

  useEffect(() => {
    getPost(id);
    getComments({ postId: id, quantity: 10 });

    const keyboardWillShow = Keyboard.addListener("keyboardWillShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      setKeyboardShowing(true);
    });
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      setKeyboardShowing(true);
    });
    const keyboaredWillHide = Keyboard.addListener("keyboardWillHide", () => {
      setKeyboardShowing(false);
    });
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardShowing(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
      keyboardWillShow.remove();
      keyboaredWillHide.remove();
    };
  }, []);

  if (postError) {
    return (
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: "rgb(20, 20, 20)" }}
        edges={["left", "right", "bottom", "top"]}
      >
        <View className="flex-row ">
          <Pressable
            className="px-3 py-1"
            onPress={() => {
              router.canGoBack() ? router.back() : router.replace("index");
            }}
          >
            <Ionicons name="chevron-back-outline" size={25} color={"white"} />
          </Pressable>
        </View>
        <View className="mx-4 mt-7">
          <Text className="text-white font-bold" style={{ fontSize: 25 }}>
            Error
          </Text>
          <Text className="text-white mt-4" style={{ fontSize: 15 }}>
            An error occurred while fetching the post.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const PostStructure = () => {
    return (
      <View className="pb-7">
        <Text className="text-white font-bold" style={{ fontSize: 25 }}>
          {postData?.post?.title}
        </Text>
        <Text className="text-white mt-4" style={{ fontSize: 15 }}>
          {postData?.post?.body}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: "rgb(20, 20, 20)" }}
      edges={["left", "right", "bottom", "top"]}
    >
      <View className="flex-1">
        <View className="flex-1">
          <View className="flex-row">
            <Pressable
              className="px-3 py-1"
              onPress={() => {
                router.canGoBack() ? router.back() : router.replace("index");
              }}
            >
              <Ionicons name="chevron-back-outline" size="25" color={"white"} />
            </Pressable>
          </View>
          <FlatList
            data={comments}
            keyExtractor={(comment) => comment.id.toString()}
            ListHeaderComponent={PostStructure}
            className="mx-4 mt-7 flex-1"
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              console.log("end reached");
              if (!commentsIsLoading) {
                getComments({ postId: id, quantity: 10 });
              }
            }}
            renderItem={({ item }) => (
              <View className="flex-1 py-4">
                {console.log(item)}
                <Pressable className="py-1">
                  <Text className="text-white font-semibold">{item.username}</Text>
                </Pressable>
                <Text className="text-white">{item.content}</Text>
                <Pressable
                  className="py-1"
                  onPress={() => {
                    const deconstructedItem = { ...item, username: item.username, id: item.id };
                    setReplyingTo(deconstructedItem);
                  }}
                >
                  <Text className="text-white font-semibold">Reply</Text>
                </Pressable>
              </View>
            )}
          />
        </View>
        <AddComment
          postId={id}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          keyboardShowing={keyboardShowing}
          keyboardHeight={keyboardHeight}
        />
      </View>
    </SafeAreaView>
  );
};

export default PostPage;
