import { View, Text, TextInput, KeyboardAvoidingView, Pressable, Keyboard } from "react-native";
import { FontAwesome, Ionicons, MaterialCommunityIcons } from "react-native-vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AddComment = ({ postId, replyingTo, setReplyingTo, keyboardShowing, keyboardHeight }) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(null);

  const inputRef = useRef(null);

  const insets = useSafeAreaInsets();

  const [
    createComment,
    {
      data: createCommentData,
      error: createCommentError,
      isLoading: createCommentIsLoading,
      isSuccess: createCommentIsSuccess,
    },
  ] = useCreateCommentMutation();

  const handleSubmit = () => {
    if (inputValue.length < 1) return setError("Comment must be at least 1 characters long");

    createComment({ postId, content: inputValue, parentCommentId: replyingTo ? replyingTo.id : null });
  };

  useEffect(() => {
    // console.log(createCommentData?.message);
  }, [createCommentIsSuccess]);

  const EditorToolbar = () => {
    return (
      <View className="flex-row border-t border-zinc-500 py-2 justify-end">
        <Pressable className="px-2 py-1" onPress={Keyboard.dismiss}>
          <Text className="text-white">Col</Text>
        </Pressable>
        <Pressable className=" px-2 py-1" onPress={handleSubmit}>
          <Text className="text-white">{replyingTo ? "Reply" : "Comment"}</Text>
        </Pressable>
      </View>
    );
  };

  useEffect(() => {
    if (keyboardShowing) {
      inputRef.current.setSelection(inputValue.length, inputValue.length);
    }
  }, [keyboardShowing]);

  return (
    <View
      className="absolute bottom-0 w-full"
      style={{ marginBottom: keyboardShowing && keyboardHeight - insets.bottom }}
    >
      <View className="mx-3">
        {error && <Text className="text-red-500">{error}</Text>}
        {replyingTo && (
          <View className="flex-row items-center justify-between border-t border-x border-zinc-600 rounded-t-lg px-2 py-1">
            <Text className="text-white">Replying to {replyingTo.username}</Text>
            <Pressable
              onPress={() => {
                setReplyingTo(null);
              }}
            >
              <Ionicons name="close" size={20} color={"white"} />
            </Pressable>
          </View>
        )}
        <View
          className="border border-zinc-600 rounded-lg px-2 py-2"
          style={{ marginBottom: keyboardShowing ? 4 : 0, maxHeight: keyboardShowing ? 150 : 80 }}
        >
          <TextInput
            ref={inputRef}
            value={inputValue}
            onChangeText={(text) => {
              setInputValue(text);
              if (error) setError(null);
            }}
            className="text-white"
            placeholder="Comment..."
            placeholderTextColor={"white"}
            style={{ fontSize: 15 }}
            multiline={true}
          />
        </View>
      </View>
      {keyboardShowing && <EditorToolbar />}
    </View>
  );
};

export default AddComment;
