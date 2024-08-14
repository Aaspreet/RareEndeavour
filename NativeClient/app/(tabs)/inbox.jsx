import { View, Text, Pressable, Keyboard } from "react-native";
import React, { useEffect, useRef } from "react";
import { Link, router } from "expo-router";
import { useFetchUsernameQuery, useLazyFetchUsernameQuery } from "../../redux/api/userApi";
import { BottomSheetModal, BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet";
import { TextInput } from "react-native-gesture-handler";
import ForgotPassword from "../../components/ForgotPassword";

const Inbox = () => {
  const bottomSheetModalRef = useRef(null);



  return (
    <View className="flex-1 justify-center bg-black">
      <Pressable onPress={() => bottomSheetModalRef.current?.present()} className="bg-primary p-4 rounded-lg">
        <Text className="text-white">Open Bottom Sheet</Text>
      </Pressable>
      <ForgotPassword ref={bottomSheetModalRef}></ForgotPassword>
    </View>
  );
};

export default Inbox;
