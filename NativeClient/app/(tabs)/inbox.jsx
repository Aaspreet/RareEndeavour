import { View, Text, Pressable, Keyboard } from "react-native";
import React, { useEffect, useRef } from "react";
import { Link, router } from "expo-router";
import { useLazyFetchUserQuery } from "../../redux/api/userApi";
import { BottomSheetModal, BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet";
import { TextInput } from "react-native-gesture-handler";
import ForgotPassword from "../../components/ForgotPassword";

const Inbox = () => {
  const bottomSheetModalRef = useRef(null);

  const [triggerfetch, { data, error, status }] = useLazyFetchUserQuery();

  const handle = () => {
    console.log("triggered");
    triggerfetch().unwrap().then((res) => {console.log(res)}).catch((err) => {console.log(err)});
  }

  useEffect(() => {

    // console.log('Bottom Data');
    // console.log(data);
    // console.log(error);
  }, [data, error]);

  return (
    <View className="flex-1 justify-center bg-black">
      <Pressable onPress={handle}>
        <Text className="text-white">CLICK</Text>
      </Pressable>
      <Pressable onPress={() => bottomSheetModalRef.current?.present()} className="bg-primary p-4 rounded-lg">
        <Text className="text-white">Open Bottom Sheet</Text>
      </Pressable>
      <ForgotPassword ref={bottomSheetModalRef}></ForgotPassword>
    </View>
  );
};

export default Inbox;
