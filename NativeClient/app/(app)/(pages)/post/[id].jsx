import { View, Text, Pressable, FlatList, KeyboardAvoidingView, Keyboard } from "react-native";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Bookmark, CloseX, Dotdotdot, Reply, Share, Triangle } from "../../../../assets/icons";
import { useTheme, TextInput } from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "../../../../config/axiosConfig";
import { useLocalSearchParams } from "expo-router";
import AddComment from "../../../../components/post/AddComment";
import PostDisplay from "../../../../components/post/PostDisplay";
import CommentsDisplay from "../../../../components/post/CommentsDisplay";

const Post = () => {
  const { id } = useLocalSearchParams();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  const [replyingTo, setReplyingTo] = useState(null);

  const [isFetchingPost, setIsFetchingPost] = useState(false);
  const [isFetchingComments, setIsFetchingComments] = useState(false);

  const addCommentInputRef = useRef(null);

  const [postError, setPostError] = useState(null);
  const [commentsError, setCommentsError] = useState(null);

  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const fetchPost = async () => {
    if (isFetchingPost) return;
    setIsFetchingPost(true);
    await axios
      .get(`/posts/fetch-single/${id}`)
      .then((res) => {
        setPost(res.data);
        setIsFetchingPost(false);
      })
      .catch((err) => {
        setPostError(err.response.data.message || "Error fetching post");
        setIsFetchingPost(false);
      });
  };

  const fetchComments = async () => {
    if (isFetchingComments) return;
    setIsFetchingComments(true);
    await axios
      .post(`/comments/fetch/${id}?limit=3`, { alreadyFetchedRootComments: [] })
      .then((res) => {
        setComments(res.data);
        setIsFetchingComments(false);
      })
      .catch((err) => {
        console.log(err);
        setCommentsError(err.response?.data?.message || "Error fetching comments");
        setIsFetchingComments(false);
      });
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, []);

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior="padding"
      edges={["left", "right"]}
      style={{
        backgroundColor: theme.colors.background,
      }}
    >
      <FlatList
        ListHeaderComponent={<PostDisplay post={post} />} //Display error if there is.
        data={comments}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{}}
        renderItem={({ item }) => (
          <View
            className="py-[10] mt-[25]"
            style={{
              backgroundColor: theme.colors.primary,
              borderRadius: 8,
            }}
          >
            <CommentsDisplay item={item} post={post} setReplyingTo={setReplyingTo} ref={addCommentInputRef} />
          </View>
        )}
      />
      <AddComment postId={id} replyingTo={replyingTo} setReplyingTo={setReplyingTo} ref={addCommentInputRef} />
    </KeyboardAvoidingView>
  );
};

export default Post;
