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
import ForgotPasswordModal from "../../components/modals/ForgotPasswordModal";
import { useTheme } from "react-native-paper";

const UserAccess = () => {
  const { mode } = useLocalSearchParams();

  const emailRef = useRef();
  const passwordRef = useRef();
  const forgotPasswordModalRef = useRef(null);

  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [lazyFetchUser, { data: userData }] = useLazyFetchUserQuery();

  const theme = useTheme();
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

      router.push("verify-email");
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
    } finally {
      setIsLoading(false);
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
      const result = await user.getIdTokenResult();

      if (!result.claims.email_verified) router.push("verify-email");
      if (!result.claims.hasUsername) router.push("select-username");
      router.push("/");
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      className="flex-1"
      edges={["top", "left", "right", "bottom"]}
      style={{
        backgroundColor: theme.colors.primary,
      }}
    >
      <KeyboardAvoidingView className="flex-1 justify-center mb-[15]" behavior="padding">
        <View className="mx-[20]">
          <Text
            style={{
              ...theme.fonts.header,
              color: theme.colors.onPrimary,
              textAlign: "center",
            }}
          >
            Welcome{mode == "login" ? " back" : ""}!
          </Text>
          <Text
            className="mt-[17]"
            style={{
              ...theme.fonts.textMedium,
              color: theme.colors.onPrimaryLighter,
              textAlign: "center",
            }}
          >
            Please fill in the below credientials to {"\n"} {mode == "login" ? "login" : "sign up"}
          </Text>
        </View>

        <View className="mx-[25] mt-[30]">
          <Text
            className="text-center mb-[7]"
            style={{
              ...theme.fonts.textSmall,
              color: theme.colors.onError,
            }}
          >
            {generalError}
          </Text>
          <TextInput
            className="px-[10] py-[20] rounded-[10px]"
            style={{
              ...theme.fonts.textInput,
              backgroundColor: theme.colors.primaryContainer,
              color: theme.colors.onPrimaryContainer,
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
            placeholderTextColor={theme.colors.onPrimaryContainer}
            onSubmitEditing={() => {
              passwordRef.current?.focus();
            }}
          />
          <Text
            className="px-[10]"
            style={{
              ...theme.fonts.textSmall,
              color: theme.colors.onError,
            }}
          >
            {emailError}
          </Text>
          <TextInput
            className="px-[10] py-[20] rounded-[10px] mt-[10]"
            style={{
              ...theme.fonts.textInput,
              backgroundColor: theme.colors.primaryContainer,
              color: theme.colors.onPrimaryContainer,
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
            placeholderTextColor={theme.colors.onPrimaryContainer}
          />
          <View className="flex-row justify-between px-[10]">
            <Text
              className="flex-1"
              style={{
                ...theme.fonts.textSmall,
                color: theme.colors.onError,
              }}
            >
              {passwordError}
            </Text>
            {mode == "login" && (
              <Pressable
                className="ml-[16] pb-[4]"
                onPress={() => {
                  Keyboard.dismiss();
                  forgotPasswordModalRef.current.present();
                }}
              >
                <Text
                  style={{
                    ...theme.fonts.textSmallBold,
                    color: theme.colors.onPrimaryLighter,
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
              className="pr-[2]"
              style={{
                ...theme.fonts.textMediumBold,
                color: theme.colors.onPrimary,
                textAlign: "center",
              }}
            >
              {isLoading ? "Loading..." : "Continue"}
            </Text>
            {!isLoading && (
              <View className="mt-[3]">
                <ArrowRight colour={theme.colors.onPrimary} height={19} />
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
                color: theme.colors.accent,
                ...theme.fonts.textMediumBold,
                lineHeight: 20,
              }}
            >
              {mode == "login" ? "Sign Up" : "Login"}
            </Text>
            <Text
              className="text-center ml-[6]"
              style={{
                ...theme.fonts.textMediumBold,
                color: theme.colors.onPrimaryLighter,
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
        <Close colour={theme.colors.onPrimary} height={27} />
      </Pressable>
      <ForgotPasswordModal ref={forgotPasswordModalRef} />
    </SafeAreaView>
  );
};

export default UserAccess;
