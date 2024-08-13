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
import { useLazyFetchUsernameQuery, userApi } from "../../redux/api/userApi";

const UserAccess = () => {
  const { mode } = useLocalSearchParams();

  const emailRef = useRef();
  const passwordRef = useRef();

  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [lazyFetchUsername, { data: usernameData }] = useLazyFetchUsernameQuery();

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

    if (!emailValue) setEmailError("Email is required");
    if (!passwordValue) setPasswordError("Password is required");
    if (!emailValue || !passwordValue) return setIsLoading(false);

    try {
      const { user } = await signInWithEmailAndPassword(auth, emailValue, passwordValue);
      dispatch(userApi.util.invalidateTags(["user"]));

      if (!user.emailVerified) router.replace("verify-email");

      await lazyFetchUsername()
        .unwrap()
        .then((response) => {
          if (!response.username) {
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
        setGeneralError("Incorrect email or password");
      } else {
        setGeneralError("An error occurred");
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("mode");
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-primary" edges={["top", "left", "right", "bottom"]}>
      <KeyboardAvoidingView className="flex-1 justify-center mb-[24]" behavior="padding">
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
          <Text
            className="text-mainRed px-[10]"
            style={{
              fontSize: 13,
              fontFamily: "p-medium",
            }}
          >
            {passwordError}
          </Text>
        </View>
        <View className="items-center mt-[30]">
          <Pressable
            className="flex-row items-center py-[4] px-[8]"
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
      <View className="items-center mb-[17] flex-row justify-center">
        <Link
          className="items-center py-[4] px-[4]"
          href={{ pathname: "user-access", params: { mode: mode == "login" ? "register" : "login" } }}
          disabled={isLoading}
          replace
        >
          <Text
            className="text-center"
            style={{
              color: colors.mainRed,
              fontSize: 15,
              fontFamily: "p-bold",
              lineHeight: 20,
            }}
          >
            {mode == "login" ? "Login" : "Sign up"}
          </Text>
        </Link>
        <Text
          className="text-mainText text-center"
          style={{
            fontSize: 15,
            fontFamily: "p-semibold",
            lineHeight: 20,
            textAlign: "center",
          }}
        >
          instead.
        </Text>
      </View>
      <Pressable
        className="absolute right-0 mb-[20] mx-[20] px-[10] py-[10]"
        style={{ marginTop: insets.top + 7 }}
        onPress={router.back}
      >
        <Close colour={colors.mainText} height={27} />
      </Pressable>
    </SafeAreaView>
  );
};

export default UserAccess;
