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
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, SubmitHandler, Controller, set } from "react-hook-form";
import { router } from "expo-router";

const Create = () => {
  const bodyInputRef = useRef(null);
  const titleInputRef = useRef(null);
  const scrollViewRef = useRef(null);

  const [bodyText, setBodyText] = useState("");
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const [keyboardShowing, setKeyboardShowing] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [scrolling, setScrolling] = useState(false);

  const [bodyInputFocused, setBodyInputFocused] = useState(false);

  const handleContentSizeChange = (e) => {
    if (selection.start === selection.end && selection.start === bodyText.length && bodyInputRef.current.isFocused()) {
      scrollViewRef.current.scrollToEnd();
    }
  };

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
    <SafeAreaView className="flex-1" edges={["left", "right"]} style={{ backgroundColor: "rgb(20, 20, 20)" }}>
      {/* <View className="bg-black flex-row h-[45] justify-center p-2">
        <View className="flex-1">
          <View className="flex-row flex-1 items-center">
            <Pressable className="px-5 ml-2 text-center justify-center" onPress={router.back}>
              <Text className="text-white text-2xl text-center">X</Text>
            </Pressable>
          </View>
        </View>
        <Pressable className="justify-center">
          <Text className="text-white font-bold text-xl">Create</Text>
        </Pressable>
        <View className="flex-1">
          <View className="flex-row flex-1 items-center justify-end">
            <Pressable className="justify-center px-3 mr-2 bg-zinc-700 rounded-lg">
              <Text className="text-white text-xl font-bold">Post</Text>
            </Pressable>
          </View>
        </View>
      </View> */}

      <View className="flex-1" style={{ marginBottom: keyboardShowing && keyboardHeight }}>
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
            style={{ fontSize: 30 }}
            placeholderTextColor={"white"}
            placeholder="Title"
            keyboardAppearance="dark"
            multiline={true}
            returnKeyType="next"
            scrollEnabled={false}
            enablesReturnKeyAutomatically={true}
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
            onPress={(e) => {
              console.log("press");
            }}
          />
        </ScrollView>
        <View className="flex-row justify-end mx-5 mb-1">
          <Pressable>
            <Text className="text-white font-semibold" onPress={router.back}>Cancel</Text>
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
