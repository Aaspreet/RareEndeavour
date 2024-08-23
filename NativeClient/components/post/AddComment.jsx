import { View, Text, Pressable, FlatList, KeyboardAvoidingView, Keyboard } from "react-native";
import React, { forwardRef, useContext, useEffect, useRef, useState } from "react";
import { Bookmark, CloseX, Dotdotdot, Reply, Share, Triangle } from "../../assets/icons";
import { useTheme, TextInput } from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "../../config/axiosConfig";
import { useLocalSearchParams } from "expo-router";
import confirmUserAuthenticated from "../../utils/functions/confirmUserAuthenticated";
import { AuthPromptModalContext } from "../../utils/contexts";

const AddComment = forwardRef(({ postId, replyingTo, setReplyingTo }, inputRef) => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const [inputValue, setInputValue] = useState("");

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [replyDisabled, setReplyDisabled] = useState(true);

  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const { authPromptModalRef } = useContext(AuthPromptModalContext);

  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const handleSubmit = async () => {
    setError(null);
    if (isLoading) return;
    setIsLoading(true);

    if (inputValue.length < 1) {
      setIsLoading(false);
      return setError("Comment must be at least 1 characters long");
    }

    console.log(inputValue);
    await axios
      .post("/comments/create", { postId, parentCommentId: replyingTo?.id, content: inputValue })
      .then((res) => {
        setInputValue("");
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Error creating comment");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!keyboardVisible) inputRef.current.setNativeProps({ selection: { start: 1, end: 1 } });
  }, [keyboardVisible]);

  useEffect(() => {
    const keyboardWillHideListener = Keyboard.addListener("keyboardWillHide", () => {
      setKeyboardVisible(false);
    });

    const keyboardWillShowListener = Keyboard.addListener("keyboardWillShow", () => {
      setKeyboardVisible(true);
    });

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  const EditorToolbar = () => {
    return (
      <View
        className="flex-row justify-end mt-[4] items-center"
        style={{
          backgroundColor: theme.colors.primary,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}
      >
        <Pressable className="px-[8] py-[4]" disabled={replyDisabled || isLoading} onPress={handleSubmit}>
          <Text
            style={{
              ...theme.fonts.textSmallBold,
              color: replyDisabled ? theme.colors.onPrimaryDisabled : theme.colors.onPrimary,
            }}
          >
            {isLoading ? "Replying..." : "Reply"}
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View
      className="pt-[6] px-[10]"
      style={{
        backgroundColor: theme.colors.background,
        paddingBottom: keyboardVisible ? (error ? 2 : 15) : insets.bottom,
        paddingTop: keyboardVisible && replyingTo ? 6 : 15,
      }}
    >
      {keyboardVisible && replyingTo && (
        <View className="mb-[6] ml-[6] flex-row items-center">
          <Text
            style={{
              ...theme.fonts.textExtraSmall,
              color: theme.colors.onPrimary,
            }}
          >
            Replying to {replyingTo?.username}
          </Text>
          <Pressable
            className="ml-[12] mt-[2] py-[4] px-[4]"
            onPress={() => {
              setReplyingTo(null);
            }}
          >
            <CloseX height={12} colour={theme.colors.onPrimary} />
          </Pressable>
        </View>
      )}
      <View
        style={{
          backgroundColor: theme.colors.primary,
          borderRadius: 8,
          borderBottomLeftRadius: keyboardVisible ? 0 : 8,
          borderBottomRightRadius: keyboardVisible ? 0 : 8,
        }}
      >
        <TextInput
          ref={inputRef}
          placeholder="Comment..."
          multiline={true}
          dense={true}
          selectionColor="white"
          placeholderTextColor={theme.colors.onPrimaryLighter}
          onPress={async () => {
            if (!userAuthenticated) {
              await confirmUserAuthenticated(authPromptModalRef).then((res) => {
                if (res) setUserAuthenticated(true);
              });
            }
          }}
          readOnly={!userAuthenticated}
          onFocus={(e) => {
            inputRef.current.setNativeProps({ selection: { start: inputValue.length, end: inputValue.length } });
          }}
          keyboardAppearance="dark"
          onChangeText={(text) => {
            if (text.length < 1 && !replyDisabled) setReplyDisabled(true);
            else if (text.length > 0 && replyDisabled) setReplyDisabled(false);

            setInputValue(text);
            setError(null);
          }}
          className="mt-[5]"
          scrollEnabled={keyboardVisible}
          style={{
            ...theme.fonts.textMedium,
            color: theme.colors.onPrimary,
            maxHeight: keyboardVisible && inputValue ? 300 : !keyboardVisible && inputValue ? 100 : "auto",
          }}
        />
      </View>
      {keyboardVisible && <EditorToolbar />}
      {keyboardVisible && error && (
        <View className="items-center">
          <Text
            style={{
              ...theme.fonts.textSmall,
              color: theme.colors.onError,
            }}
          >
            {error}
          </Text>
        </View>
      )}
    </View>
  );
});

export default AddComment;
