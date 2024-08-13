import { View, Text, Pressable, TextInput, KeyboardAvoidingView } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";

const ForgotPassword = () => {
  const emailRef = useRef();

  const [emailValue, setEmailValue] = useState("");
  const [errors, setErrors] = useState({ general: [] });
  const [message, setMessage] = useState("");

  const handlePasswordReset = async () => {
    const currentErrors = { general: [] };
    if (!emailValue) {
      currentErrors.general.push("Email is required");
      setErrors(currentErrors);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, emailValue);
      setMessage("Password reset email sent");
    } catch (error) {
      console.log(error);
      if (error.code === "auth/user-not-found") {
        currentErrors.general.push("Account not found");
      } else if (error.code === "auth/invalid-email") {
        currentErrors.general.push("Invalid email");
      } else {
        currentErrors.general.push("An error occurred");
      }
      setErrors(currentErrors);
    }
  };

  useEffect(() => {
    setMessage("");
  }, [errors]);

  useEffect(() => {
    setErrors({ general: [] });
  }, [message]);

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView className="flex-1 justify-center" behavior="padding" keyboardVerticalOffset={-100}>
        <View className="flex-1 justify-center" behavior="padding" keyboardVerticalOffset={-100}>
          <View className="bg-zinc-100 mx-6 rounded-lg pt-8 justify-between">
            <Pressable className="absolute right-0 top-0 py-2 px-3" onPress={router.back}>
              <Text>back</Text>
            </Pressable>

            <View className="mx-4">
              <View className="pb-7">
                <Text className="text-2xl text-center font-bold mb-1">Reset Password</Text>
                <Text className="text-center mb-4">Please Enter your email below</Text>
                <View className="flex-col">
                  <>
                    <View className="flex-row">
                      <TextInput
                        className="border-b border-zinc-400 p-1 flex-1"
                        ref={emailRef}
                        placeholder="Email"
                        style={{
                          fontSize: 19,
                        }}
                        onChangeText={(text) => {
                          setEmailValue(text);
                          setErrors({ ...errors, email: "" });
                        }}
                        value={emailValue}
                      />
                    </View>
                    <Text className="text-red-500">{errors.general?.[0] || " "}</Text>
                  </>
                  <Text className="text-center mt-2 mb-1 text-green-500">{message || " "}</Text>
                  <View className="items-center">
                    <Pressable className="px-3 py-2 border rounded-lg" onPress={handlePasswordReset}>
                      <Text>Continue</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
