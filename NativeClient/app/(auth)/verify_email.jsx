import { View, Text } from "react-native";
import React from "react";

const verify_email = () => {
  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView className="flex-1 justify-center" behavior="padding" keyboardVerticalOffset={-100}>
        <View className="bg-zinc-100 mx-6 rounded-lg pt-8 justify-between">
          <View className="mx-4"></View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default verify_email;
