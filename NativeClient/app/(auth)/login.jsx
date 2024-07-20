import { View, Text, StyleSheet, SafeAreaView, TextInput, KeyboardAvoidingView, Pressable } from "react-native";
import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FontAwesome, Ionicons, MaterialCommunityIcons, AntDesign } from "react-native-vector-icons";
import { Link } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";

const Login = () => {
  const [errors, setErrors] = useState({
    email: [],
    password: [],
    general: [],
  });

  const userRef = useRef();
  const passwordRef = useRef();

  const [userValue, setUserValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const onSubmit = async () => {
    const currentErrors = { email: [], password: [], general: [] };
    if (!userValue) {
      currentErrors.email.push("Email is required");
    }
    if (!passwordValue) {
      currentErrors.password.push("Password is required");
    }
    if (currentErrors.email.length || currentErrors.password.length) {
      setErrors(currentErrors);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, userValue, passwordValue);
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        currentErrors.email.push("Invalid email");
      } else if (error.code === "auth/invalid-credential") {
        currentErrors.password.push("Incorrect password");
      } else {
        currentErrors.general.push("An error occurred");
      }
      setErrors(currentErrors);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
        className="flex-1 justify-center"
        behavior="padding"
        keyboardVerticalOffset={-100}
      >
        <View className="bg-zinc-100 mx-6 rounded-lg pt-8 justify-between">
          <View className="mx-4">
            <View className="pb-7">
              <Text className="text-2xl text-center font-bold mb-6">Login</Text>
              <View className="flex-col">
                <>
                  <View className="flex-col">
                    <View className="flex-row">
                      <TextInput
                        className="border-b border-zinc-400 p-1 flex-1"
                        ref={userRef}
                        placeholder="Email"
                        style={{
                          fontSize: 19,
                        }}
                        onChangeText={(text) => {
                          setUserValue(text);
                          setErrors({ ...errors, email: "" });
                        }}
                        value={userValue}
                        onSubmitEditing={() => {
                          passwordRef.current.focus();
                        }}
                      />
                    </View>
                    <Text className="text-red-500">{errors.email[0] || " "}</Text>
                  </View>
                  <View className="flex-col">
                    <View className="flex-row">
                      <TextInput
                        className="border-b border-zinc-400 p-1 flex-1"
                        ref={passwordRef}
                        placeholder="Password"
                        style={{
                          fontSize: 19,
                        }}
                        onChangeText={(text) => {
                          setPasswordValue(text);
                          setErrors({ ...errors, password: "" });
                        }}
                        value={passwordValue}
                      />
                      <Pressable
                        className="border rounded-t-lg rounded-br-lg px-2 justify-center  border-zinc-300 border-b-zinc-400"
                        onPress={onSubmit}
                      >
                        <AntDesign name="arrowright" size={22} color="black" />
                      </Pressable>
                    </View>
                    <Text className="text-red-500">{errors.password[0] || " "}</Text>
                    <Text className="text-red-500">{errors.general[0]}</Text>
                  </View>
                </>
              </View>
            </View>
            <View className="pb-1 pl-1 items-start">
              <View className="flex-col mb-1">
                <View className="flex-row">
                  <Text className="mr-2">New here?</Text>
                  <Link href="register" className="text-orange-500 font-semibold" replace>
                    Sign up
                  </Link>
                </View>
                <View className="border p-2 flex-row rounded-lg mt-1">
                  <Text className="mr-2">G</Text>
                  <Text>Continue with Google</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
