import { View, Text, KeyboardAvoidingView, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { auth } from "../../config/firebaseConfig";
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";

const VerifyEmail = () => {
  const [errors, setErrors] = useState({ verificationEmail: [] });

  const verifiedSubmit = async () => {
    const currentErrors = { verificationEmail: [] };
    try {
      await auth.currentUser.reload();
      if (!auth.currentUser.emailVerified) {
        currentErrors.verificationEmail.push("Email is not verified");
        setErrors({ ...errors, verificationEmail: currentErrors.verificationEmail });
        return;
      }

      router.replace("select_username");
    } catch (error) {
      currentErrors.verificationEmail.push("Something went wrong");
      setErrors({ ...errors, verificationEmail: currentErrors.verificationEmail });
      return;
    }
  };

  const sendEmailToVerifyUser = async () => {
    console.log("sending email");
    try {
      await sendEmailVerification(auth.currentUser);
      console.log("email sent");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
      if (auth.currentUser) {
        if (auth.currentUser.emailVerified) {
          router.replace("select_username");
        } else {
          sendEmailToVerifyUser();
        }
      } else {
        router.replace("login");
      }
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView className="flex-1 justify-center" behavior="padding" keyboardVerticalOffset={-100}>
        <View className="bg-zinc-100 mx-6 rounded-lg pt-8 justify-between">
          <View className="mx-4">
            <View className="flex-col items-center">
              <Text className="text-xl text-center font-bold mb-6">{auth.currentUser.email}</Text>
              <Text className="text-center">If that email exists</Text>
              <Text className="text-center">We sent you an email to verify your account</Text>
              <Text className="text-center">Please check your inbox</Text>
              <Pressable onPress={verifiedSubmit} className="mt-3">
                <Text className="text-center text-blue-500 underline">I have verified my email</Text>
              </Pressable>
              <Pressable className="mt-3" onPress={sendEmailToVerifyUser}>
                <Text className="text-center text-green-500 underline">Resend verification email</Text>
              </Pressable>
              <Text className="text-red-500">{errors.verificationEmail?.[0] || " "}</Text>
              <Pressable className="mt-2" onPress={router.back}>
                <Text className="text-center text-blue-500 underline">Change email</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default VerifyEmail;
