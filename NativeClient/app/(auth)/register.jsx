import { View, Text, TextInput, Pressable, KeyboardAvoidingView } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Controller, set, useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, Ionicons, MaterialCommunityIcons, AntDesign } from "react-native-vector-icons";
import { Link } from "expo-router";
import { auth } from "../../config/firebaseConfig.js";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useRegisterMutation, useRegisteryMutation, useTestMutation } from "../../redux/api/authApi.js";
import { useGetUserQuery } from "../../redux/api/userApi.js";

const Register = () => {
  const [registerTrigger, { data }] = useRegisterMutation();

  const [selectingUsername, setSelectingUsername] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [errors, setErrors] = useState({
    email: [],
    password: [],
    username: [],
    verificationEmail: [],
    general: [],
  });

  const emailRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();

  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [usernameValue, setUsernameValue] = useState("");

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
  const usernameValidationRules = [
    { rule: (username) => username.length >= 3, message: "Username must be at least 3 characters long" },
    { rule: (username) => username.length <= 20, message: "Username must be at most 20 characters long" },
    {
      rule: (username) => username.match(/^[a-zA-Z0-9_]*$/),
      message: "Username can only contain letters, numbers, and underscores",
    },
  ];

  const onContinue = async () => {
    const currentErrors = { email: [], password: [], general: [] };

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
      await sendEmailVerification(auth.currentUser).catch((err) => {
        console.log(err);
      });
      setVerifyingEmail(true);
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

  const verifiedSubmit = async () => {
    const currentErrors = { verificationEmail: [] };
    try {
      await auth.currentUser.reload();
      if (!auth.currentUser.emailVerified) {
        currentErrors.verificationEmail.push("Email is not verified");
        setErrors({ ...errors, verificationEmail: currentErrors.verificationEmail });
        return;
      }

      setSelectingUsername(true);
      setVerifyingEmail(false);
    } catch (error) {
      currentErrors.verificationEmail.push("Something went wrong");
      setErrors({ ...errors, verificationEmail: currentErrors.verificationEmail });
      return;
    }
  };

  const onSubmit = async () => {
    const currentErrors = { username: [] };

    usernameValidationRules.forEach((rule) => {
      if (!rule.rule(usernameValue)) {
        console.log(rule.message);
        currentErrors.username.push(rule.message);
      }
    });

    if (currentErrors.username.length > 0) {
      setErrors({ ...errors, username: currentErrors.username });
      return;
    }

    const token = await auth.currentUser.getIdToken();
    registerTrigger({ username: usernameValue, token: token });
  };

  // useEffect(() => {
  //   console.log("1111");
  //   console.log(data);
  // }, [data]);

  const EmailInput = () => {};

  const PasswordInput = () => {};

  const UsernameInput = () => {};

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView className="flex-1 justify-center" behavior="padding" keyboardVerticalOffset={-100}>
        <View className="bg-zinc-100 mx-6 rounded-lg pt-8 justify-between">
          <View className="mx-4">
            <View className="pb-7">
              <Text className="text-2xl text-center font-bold mb-6">Register</Text>
              <View className="flex-col">
                {!verifyingEmail ? (
                  <>
                    <View className="flex-col">
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
                          editable={!selectingUsername && !verifyingEmail}
                          onSubmitEditing={() => {
                            passwordRef.current.focus();
                          }}
                        />
                      </View>
                      <Text className="text-red-500">{errors.email?.[0] || " "}</Text>
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
                          editable={!selectingUsername && !verifyingEmail}
                        />
                        {!selectingUsername && !verifyingEmail && (
                          <Pressable
                            className="border rounded-t-lg rounded-br-lg px-2 justify-center  border-zinc-300 border-b-zinc-400"
                            onPress={onContinue}
                          >
                            <AntDesign name="arrowright" size={22} color="black" />
                          </Pressable>
                        )}
                      </View>
                      <Text className="text-red-500">{errors.password?.[0] || " "}</Text>
                    </View>
                  </>
                ) : (
                  <View className="flex-col items-center">
                    <Text className="text-center">If that email exists</Text>
                    <Text className="text-center">We sent you an email to verify your account</Text>
                    <Text className="text-center">Please check your inbox</Text>
                    <Pressable onPress={verifiedSubmit} className="mt-3">
                      <Text className="text-center text-blue-500 underline">I have verified my email</Text>
                    </Pressable>
                    <Text className="text-red-500">{errors.verificationEmail?.[0] || " "}</Text>
                  </View>
                )}

                {selectingUsername && (
                  <View className="flex-col">
                    <View className="flex-row">
                      <TextInput
                        className="border-b border-zinc-400 p-1 flex-1"
                        ref={usernameRef}
                        placeholder="Username"
                        style={{
                          fontSize: 19,
                        }}
                        onChangeText={(text) => {
                          setUsernameValue(text);
                          setErrors({ ...errors, username: "" });
                        }}
                        value={usernameValue}
                      />
                      <Pressable
                        className="border rounded-t-lg rounded-br-lg px-2 justify-center  border-zinc-300 border-b-zinc-400"
                        onPress={onSubmit}
                      >
                        <AntDesign name="arrowright" size={22} color="black" />
                      </Pressable>
                    </View>
                    <Text className="text-red-500">{errors.username?.[0] || " "}</Text>
                  </View>
                )}
                <Text className="text-red-500">{errors?.general?.[0] || " "}</Text>
              </View>
            </View>
            <View className="pb-1 pl-1 items-start">
              <View className="flex-col mb-1">
                <View className="flex-row">
                  <Text className="mr-2">Already a user?</Text>
                  <Link href="login" className="text-orange-500 font-semibold" replace>
                    Login
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

export default Register;
