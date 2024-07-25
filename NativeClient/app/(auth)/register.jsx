import { View, Text, TextInput, Pressable, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Controller, set, useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, Ionicons, MaterialCommunityIcons, AntDesign } from "react-native-vector-icons";
import { Link, router } from "expo-router";
import { auth } from "../../config/firebaseConfig.js";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, sendEmailVerification } from "firebase/auth";
import { useRegisterMutation, useRegisteryMutation, useTestMutation } from "../../redux/api/authApi.js";
import { useGetUserQuery } from "../../redux/api/userApi.js";
import ContinueWithGoogle from "./continue_with_google.jsx";

const Register = () => {
  const [errors, setErrors] = useState({
    email: [],
    password: [],
    username: [],
    verificationEmail: [],
    general: [],
  });

  const emailRef = useRef();
  const passwordRef = useRef();

  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const emailValidationRules = [
    { rule: (email) => email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/), message: "Email is invalid" },
  ];
  const passwordValidationRules = [
    { rule: (password) => password.length >= 6, message: "Password must be at least 6 characters long" },
    { rule: (password) => password.length <= 20, message: "Password must be at most 20 characters long" },
    { rule: (password) => password.match(/[A-Z]/), message: "Password must contain at least one uppercase letter" },
    { rule: (password) => password.match(/[a-z]/), message: "Password must contain at least one lowercase letter" },
    { rule: (password) => password.match(/[0-9]/), message: "Password must contain at least one number" },
    {
      rule: (password) => password.match(/[^A-Za-z0-9]/),
      message: "Password must contain at least one special character",
    },
  ];

  const onContinue = async () => {
    const currentErrors = { email: [], password: [], general: [] };

    const emailSignInMethods = await fetchSignInMethodsForEmail(auth, 'dhillonaaspreet@gmail.com');
    console.log(emailSignInMethods);
    if (emailSignInMethods.length > 0) {
      currentErrors.email.push("Email is already in use");
      setErrors(currentErrors);
      return;
    }

    emailValidationRules.forEach((rule) => {
      if (!rule.rule(emailValue)) {
        console.log(rule.message);
        currentErrors.email.push(rule.message);
      }
    });

    passwordValidationRules.forEach((rule) => {
      if (!rule.rule(passwordValue)) {
        console.log(rule.message);
        currentErrors.password.push(rule.message);
      }
    });

    if (currentErrors.email.length > 0 || currentErrors.password.length > 0) {
      setErrors(currentErrors);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, emailValue, passwordValue);

      router.push("verify_email");
    } catch (error) {
      console.log(error.code);
      if (error.code === "auth/email-already-in-use") {
        currentErrors.email.push("Email is already in use");
      } else if (error.code === "auth/invalid-email") {
        currentErrors.email.push("Email is invalid");
      } else if (error.code === "auth/weak-password") {
        currentErrors.password.push("Password is too weak");
      } else {
        currentErrors.general.push("An error occurred");
      }
      setErrors(currentErrors);
      return;
    }
  };

  // useEffect(() => {
  //   setErrors({
  //     email: ["test emailemail error"],
  //     password: ["test passwordpassword error"],
  //     general: ["test generalgenral error"],
  //   });
  // }, []);

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView className="flex-1 justify-center" behavior="padding" keyboardVerticalOffset={-110}>
        <View className="bg-zinc-100 mx-6 rounded-lg pt-8 justify-between px-4">
          <Pressable className="absolute right-0 top-0 py-2 px-3" onPress={router.back}>
            <Text>---</Text>
          </Pressable>
          {/**Title */}
          <View className="">
            <Text className="text-center mb-8 text-[28px]" style={{ fontFamily: "headerbold" }}>
              Register
            </Text>
          </View>
          {/**Form */}
          <View className="flex-col mb-10 justify-between">
            <View className="mb-3">
              <TextInput
                className="border-b border-zinc-400 p-1"
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
                onSubmitEditing={() => {
                  passwordRef.current.focus();
                }}
              />
              <Text
                className="text-red-500 tracking-wide text-[17px] mt-1.5"
                style={{
                  fontFamily: "errorsmall",
                }}
              >
                {errors.email?.[0] || " "}
              </Text>
            </View>
            <>
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
                  onPress={onContinue}
                >
                  <AntDesign name="arrowright" size={22} color="black" />
                </Pressable>
              </View>
              <Text
                className="text-red-500 tracking-wide text-[17px] mt-1.5"
                style={{
                  fontFamily: "errorsmall",
                }}
              >
                {errors.password?.[0] || " "}
              </Text>
            </>
          </View>
          {/**Footer */}
          <View className="pb-1 pl-1 items-start">
            <View className="flex-col mb-1">
              <View className="flex-row">
                <Text className="mr-2">Already a user?</Text>
                <Link href="login" className="text-orange-500 font-semibold" replace>
                  Login
                </Link>
              </View>
              <ContinueWithGoogle />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;
