import { View, Text, KeyboardAvoidingView, Pressable, TextInput, Keyboard } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import tailwindConfig from "../../tailwind.config";
import { ArrowRight, Close } from "../../assets/icons";
import { Link, router, useLocalSearchParams } from "expo-router";
import { emailValidationRules, passwordValidationRules } from "../../assets/other/authenticationRules";
import { auth } from "../../config/firebaseConfig";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { useLazyFetchUserQuery, userApi } from "../../redux/api/userApi";
import ForgotPassword from "../../components/ForgotPassword";

const UserAccess = () => {
  const { mode } = useLocalSearchParams();

  const emailRef = useRef();
  const passwordRef = useRef();
  const bottomSheetModalRef = useRef(null);

  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [lazyFetchUser] = useLazyFetchUserQuery();

  const { colors } = tailwindConfig.theme.extend;
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const handleRegister = async () => {
    setIsLoading(true);
    Keyboard.dismiss();
    let errorInEmailOrPassword = false;

    const methods = await fetchSignInMethodsForEmail(auth, emailValue).catch((error) => {});
    if (methods?.length > 0) {
      setEmailError("Email is already in use");
      setPasswordError("");
      return setIsLoading(false);
    }

    for (const rule of emailValidationRules) {
      if (!rule.rule(emailValue)) {
        setEmailError(rule.message);
        errorInEmailOrPassword = true;
        break;
      }
    }
    for (const rule of passwordValidationRules) {
      if (!rule.rule(passwordValue)) {
        setPasswordError(rule.message);
        errorInEmailOrPassword = true;
        break;
      }
    }

    if (errorInEmailOrPassword) return setIsLoading(false);

    try {
      await createUserWithEmailAndPassword(auth, emailValue, passwordValue);

      router.replace("verify-email");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setEmailError("Email is already in use");
      } else if (error.code === "auth/invalid-email") {
        setEmailError("Email is invalid");
      } else if (error.code === "auth/invalid-password") {
        setPasswordError("Invalid Passord");
      } else if (error.code === "auth/weak-password") {
        setPasswordError("Password is too weak");
      } else {
        setGeneralError("An error occurred");
      }

      return setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);

    if (!emailValue) {
      setEmailError("Email is required");
      return setIsLoading(false);
    }
    try {
      const { user } = await signInWithEmailAndPassword(auth, emailValue, passwordValue);
      dispatch(userApi.util.invalidateTags(["user"]));

      if (!user.emailVerified) router.replace("verify-email");

      await lazyFetchUser()
        .unwrap()
        .then((user) => {
          if (!user.username) {
            return router.replace("select-username");
          } else {
            return router.replace("/");
          }
        })
        .catch((error) => {
          return router.replace("select-username");
        });
    } catch (error) {
      console.log(error);
      if (error.code === "auth/invalid-email") {
        setEmailError("Invalid email");
      } else if (error.code === "auth/user-not-found") {
        setEmailError("No account with that email");
      } else if (error.code === "auth/wrong-password") {
        setPasswordError("Incorrect password");
      } else if (error.code === "auth/missing-password") {
        setPasswordError("Password is required");
      } else if (error.code === "auth/too-many-requests") {
        setGeneralError("Too many requests, try again later");
      } else {
        setGeneralError("Server error");
      }
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary" edges={["top", "left", "right", "bottom"]}>
      <KeyboardAvoidingView className="flex-1 justify-center mb-[15]" behavior="padding">
        <View className="mx-[20]">
          <Text
            className="text-mainText"
            style={{
              fontSize: 23,
              fontFamily: "pd-bold",
              textAlign: "center",
            }}
          >
            Welcome{mode == "login" ? " back" : ""}!
          </Text>
          <Text
            className="text-secondaryText mt-[17]"
            style={{
              fontSize: 15,
              fontFamily: "p-medium",
              textAlign: "center",
            }}
          >
            Please fill in the below credientials to {"\n"} {mode == "login" ? "login" : "sign up"}
          </Text>
        </View>

        <View className="mx-[25] mt-[30]">
          <Text
            className="text-mainRed text-center mb-[7]"
            style={{
              fontSize: 13,
              fontFamily: "p-medium",
            }}
          >
            {generalError}
          </Text>
          <TextInput
            className="text-mainText px-[10] py-[20] bg-secondary rounded-[10px]"
            style={{
              fontSize: 15,
              fontFamily: "p-medium",
            }}
            keyboardAppearance="dark"
            ref={emailRef}
            value={emailValue}
            onChangeText={(text) => {
              setEmailValue(text);
              setEmailError("");
              setGeneralError("");
            }}
            placeholder="Email"
            placeholderTextColor={colors.mainText}
            onSubmitEditing={() => {
              passwordRef.current?.focus();
            }}
          />
          <Text
            className="text-mainRed px-[10]"
            style={{
              fontSize: 13,
              fontFamily: "p-medium",
            }}
          >
            {emailError}
          </Text>
          <TextInput
            className="text-mainText px-[10] py-[20] bg-secondary rounded-[10px] mt-[10]"
            style={{
              fontSize: 15,
              fontFamily: "p-medium",
            }}
            keyboardAppearance="dark"
            ref={passwordRef}
            value={passwordValue}
            onChangeText={(text) => {
              setPasswordValue(text);
              setPasswordError("");
              setGeneralError("");
            }}
            placeholder="Password"
            placeholderTextColor={colors.mainText}
          />
          <View className="flex-row justify-between px-[10]">
            <Text
              className="text-mainRed flex-1"
              style={{
                fontSize: 13,
                fontFamily: "p-medium",
              }}
            >
              {passwordError || "\n"}
            </Text>
            {mode == "login" && (
              <Pressable
                className="ml-[16] pb-[4]"
                onPress={() => {
                  Keyboard.dismiss();
                  bottomSheetModalRef.current.present();
                }}
              >
                <Text
                  className="text-secondaryText"
                  style={{
                    fontSize: 13,
                    fontFamily: "p-medium",
                  }}
                >
                  Forgot password
                </Text>
              </Pressable>
            )}
          </View>
        </View>
        <View className="items-center mt-[20]">
          <Pressable
            className="flex-row items-center py-[4] px-[20]"
            onPress={mode == "login" ? handleLogin : handleRegister}
            disabled={isLoading}
          >
            <Text
              className="text-mainText pr-[2]"
              style={{
                fontSize: 15,
                fontFamily: "p-semibold",
                textAlign: "center",
              }}
            >
              {isLoading ? "Loading..." : "Continue"}
            </Text>
            {!isLoading && (
              <View className="mt-[3]">
                <ArrowRight colour={colors.mainText} height={19} />
              </View>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
      <View className="items-center">
        <Link
          className="items-center py-[12] px-[4] mb-[17] flex-row justify-center"
          href={{ pathname: "user-access", params: { mode: mode == "login" ? "register" : "login" } }}
          disabled={isLoading}
          replace
          asChild
        >
          <Pressable className="flex-row">
            <Text
              className="text-center"
              style={{
                color: colors.mainRed,
                fontSize: 15,
                fontFamily: "p-bold",
                lineHeight: 20,
              }}
            >
              {mode == "login" ? "Sign Up" : "Login"}
            </Text>
            <Text
              className="text-mainText text-center ml-[6]"
              style={{
                fontSize: 15,
                fontFamily: "p-semibold",
                lineHeight: 20,
                textAlign: "center",
              }}
            >
              instead.
            </Text>
          </Pressable>
        </Link>
      </View>
      <Pressable
        className="absolute right-0 mb-[20] mx-[20] px-[10] py-[10]"
        style={{ marginTop: insets.top + 7 }}
        onPress={router.back}
      >
        <Close colour={colors.mainText} height={27} />
      </Pressable>
      <ForgotPassword ref={bottomSheetModalRef}></ForgotPassword>
    </SafeAreaView>
  );
};

export default UserAccess;
