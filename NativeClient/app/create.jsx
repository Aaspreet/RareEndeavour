import { View, Text, TextInput, Pressable, ScrollView, Keyboard, KeyboardAvoidingView } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, SubmitHandler, Controller, set } from "react-hook-form";
import { router } from "expo-router";
import { RichEditor } from "react-native-pell-rich-editor";

const Create = () => {
  const bodyInputRef = useRef(null);

  const [scrollPosition, setScrollPosition] = useState(0);
  const [prevContentHeight, setPrevContentHeight] = useState(0);
  const [keyboardShowing, setKeyboardShowing] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const [bodyInputHeight, setBodyInputHeight] = useState(0);

  const [initialScrollViewHeight, setInitialScrollViewHeight] = useState(0);

  const handleContentSizeChange = (e) => {
    console.log('called  + ', e.nativeEvent.contentSize.height);
    console.log('a' + initialScrollViewHeight)
    //content size 36
    //initial 
    const contentHeight = e.nativeEvent.contentSize.height;
    const heightDifference = contentHeight - prevContentHeight;
    setPrevContentHeight(contentHeight);

    bodyInputRef.current.scrollTo({ y: scrollPosition + heightDifference, animated: true });
    setScrollPosition((prev) => prev + heightDifference);

    // console.log("contentHeight", contentHeight);
    // console.log("scrollPosition", scrollPosition);
    // bodyInputRef.current.scrollTo({ y: scrollPosition.current + 32, animated: true });
    // bodyInputRef.current.scrollTo({ y: scrollPosition, animated: true });
    // setScrollPosition((prev) => prev + 32);
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

  return (
    <SafeAreaView className="flex-1" edges={["left", "right"]} style={{ backgroundColor: "rgb(20, 20, 20)" }}>
      <View className="flex-1" style={{ marginBottom: keyboardShowing && keyboardHeight + 20 }}>
        <ScrollView
          className="bg-red-500"
          ref={bodyInputRef}
          onLayout={(e) => setInitialScrollViewHeight(e.nativeEvent.layout.height)}
        >
          <TextInput
            className="text-white font-bold text-2xl px-2 h-[30]"
            placeholderTextColor={"white"}
            placeholder="Title"
            keyboardAppearance="dark"
          />
          <TextInput
            className="bg-blue-500 p-0 m-0"
            multiline={true}
            scrollEnabled={false}
            style={{ fontSize: 30, lineHeight: 0 }}
            onContentSizeChange={handleContentSizeChange}
          />
          {/* <RichEditor scrollEnabled={false} editorStyle={{backgroundColor:'black', color:'white'}}/> */}
        </ScrollView>
      </View>
      {/* <ScrollView
        className="flex-1 flex-col"
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ marginBottom: keyboardShowing && keyboardHeight + 100 }}
      >
        <View className="mx-2 mt-8">
          <TextInput
            className="py-2 text-white font-bold text-2xl px-2"
            placeholderTextColor={"white"}
            placeholder="Title"
            keyboardAppearance="dark"
          />
        </View>
        <View className="mx-2 mt-4 flex-1 border border-zinc-500 rounded-lg bg-red-500">
          <TextInput
            className=" text-white font-semibold text-[18px] px-2 flex-1"
            ref={bodyInputRef}
            placeholderTextColor={"white"}
            multiline={true}
            placeholder="Body"
            keyboardAppearance="dark"
            scrollEnabled={false}
          />
        </View>
      </ScrollView> */}
    </SafeAreaView>
  );
};

export default Create;
