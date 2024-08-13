import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  Button,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useCreatePostMutation } from "../../redux/api/postsApi";

const Create = () => {
  const bodyInputRef = useRef(null);
  const titleInputRef = useRef(null);
  const scrollViewRef = useRef(null);

  const [titleText, setTitleText] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const [keyboardShowing, setKeyboardShowing] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [scrolling, setScrolling] = useState(false);

  const [bodyInputFocused, setBodyInputFocused] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const insets = useSafeAreaInsets();

  const [
    createPostTrigger,
    {
      data: createPostData,
      error: createPostError,
      isLoading: createPostIsLoading,
      isSuccess: createPostIsSuccess,
      isError: createPostIsError,
    },
  ] = useCreatePostMutation();

  const handleContentSizeChange = (e) => {
    if (selection.start === selection.end && selection.start === bodyText.length && bodyInputRef.current.isFocused()) {
      scrollViewRef.current.scrollToEnd();
    }
  };

  const handleSubmit = () => {
    if (titleText.length < 10) return setToastMessage("Title must be at least 10 characters");
    if (bodyText.length < 10) return setToastMessage("Body must be at least 10 characters");
    createPostTrigger({ title: titleText, body: bodyText });
  };

  useEffect(() => {
    if (createPostError) {
      setToastMessage(createPostError?.data?.message);
    }
  }, [createPostError]);

  useEffect(() => {
    if (createPostIsSuccess) {
      router.back();
    }
  }, [createPostData]);

  useEffect(() => {
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

    router.setParams({
      enableGestures: "false",
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
      keyboardWillShow.remove();
      keyboaredWillHide.remove();
    };
  }, []);

  const EditorToolbar = () => {
    return (
      <View className="flex-row border border-t-zinc-700 justify-between h-[40]">
        <View className="flex-row flex-1  pl-3">
          <Pressable className="justify-center px-3 ">
            <Text className="text-white">B</Text>
          </Pressable>
        </View>
        <Pressable className="flex-row items-center justify-center px-3" onPress={handleSubmit}>
          <Text className="text-white text-center">POST</Text>
        </Pressable>
        <Pressable
          className="flex-row items-center justify-center px-3"
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <Text className="text-white text-center">Col</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1" edges={["left", "right", 'bottom']} style={{ backgroundColor: "rgb(20, 20, 20)" }}>
      <View className="flex-1" style={{ marginBottom: keyboardShowing && keyboardHeight - insets.bottom }}>
        <ScrollView
          className="flex-1"
          ref={scrollViewRef}
          contentContainerStyle={{ flexGrow: 1 }}
          onContentSizeChange={handleContentSizeChange}
          onScrollBeginDrag={() => {
            setScrolling(true);
          }}
          onScrollEndDrag={() => {
            setScrolling(false);
          }}
        >
          <TextInput
            className="font-bold px-4 mt-2 pb-2 text-white"
            ref={titleInputRef}
            value={titleText}
            style={{ fontSize: 30 }}
            placeholderTextColor={"white"}
            placeholder="Title"
            keyboardAppearance="dark"
            multiline={true}
            returnKeyType="next"
            scrollEnabled={false}
            enablesReturnKeyAutomatically={true}
            onChangeText={(e) => {
              setTitleText(e);
              if (toastMessage) setToastMessage("");
            }}
            autoFocus={true}
            blurOnSubmit={true}
            onSubmitEditing={() => {
              bodyInputRef.current.focus();
            }}
          />
          <TextInput
            className="px-4 pb-2 flex-1 rounded-lg text-white"
            ref={bodyInputRef}
            placeholder="Body"
            placeholderTextColor={"gray"}
            multiline={true}
            scrollEnabled={false}
            style={{ fontSize: 22 }}
            onChangeText={(e) => {
              setBodyText(e);
              if (toastMessage) setToastMessage("");
            }}
            value={bodyText}
            onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
            editable={keyboardShowing || !scrolling}
            keyboardAppearance="dark"
            onFocus={() => {
              setBodyInputFocused(true);
            }}
            onBlur={() => {
              setBodyInputFocused(false);
            }}
          />
        </ScrollView>
        <View className="flex-row justify-between mx-5 mb-1">
          <Text className="text-red-500 font-semibold">{toastMessage}</Text>
          <Pressable>
            <Text className="text-white font-semibold" onPress={router.back}>
              Cancel
            </Text>
          </Pressable>
          {/* <Pressable>
            <Text className="text-white font-semibold">Post</Text>
          </Pressable> */}
        </View>
        {keyboardShowing && <EditorToolbar />}
      </View>
    </SafeAreaView>
  );
};

export default Create;
