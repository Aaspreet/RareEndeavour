import { View, Text, Pressable, StyleSheet, Button, TextInput } from "react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../../config/firebaseConfig";
import { router, useLocalSearchParams } from "expo-router";
import BottomSheet, { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Settings = () => {
  const bottomSheetModalRef = useRef(null);

  const handlePresent = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  useEffect(() => {
    router.setParams({
      enableGestures: "true",
    });
  }, []);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "rgb(20, 20, 20)" }} edges={["left", "right", "bottom"]}>
      <BottomSheetModalProvider>
        <BottomSheetModal ref={bottomSheetModalRef} snapPoints={["30%"]} keyboardBehavior="interactive">
          <Text>Is it working?</Text>
          <TextInput className="bg-red-500"></TextInput>
        </BottomSheetModal>
        <View>
          <Text className="text-white text-[20px] font-bold text-center mt-3">RareDestroyer8</Text>
        </View>
        <View className="flex-1 mx-5 mt-10">
          <View className="flex-row">
            <Text className="text-white text-[18px] font-bold">Email: </Text>
            <Text className="text-white text-[18px]">{auth.currentUser?.email || "null"}</Text>
          </View>
          <Pressable className="flex-row mt-3" onPress={handlePresent}>
            <Text className="text-green-500 text-[18px] font-bold">Change Password </Text>
          </Pressable>
          <View className="flex-row mt-10">
            <Text className="text-zinc-300 text-[18px] font-bold">Account created: </Text>
            <Text className="text-zinc-300 text-[18px]">{"2016-07-12" || "null"}</Text>
          </View>

          <View className="flex-row mt-10">
            <Text className="text-red-500 text-[18px] font-bold">Logout</Text>
          </View>
          <View className="bg-red-500 mt-10"></View>
        </View>
      </BottomSheetModalProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});

export default Settings;
