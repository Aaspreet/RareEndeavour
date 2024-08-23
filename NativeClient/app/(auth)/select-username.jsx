import { View, Text, KeyboardAvoidingView, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import tailwindConfig from "../../tailwind.config";
import { ArrowRight, Close } from "../../assets/icons";
import { Link, router } from "expo-router";
import { TextInput } from "react-native-gesture-handler";
import { usernameValidationRules } from "../../assets/other/authenticationRules";
import { auth } from "../../config/firebaseConfig";
import axios from "../../config/axiosConfig";
import { useTheme } from "react-native-paper";

const SelectUsername = () => {
  const [usernameValue, setUsernameValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [usernameError, setUsernameError] = useState("");

  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const handleSubmit = async () => {
    setIsLoading(true);
    setUsernameError("");

    for (const rule of usernameValidationRules) {
      if (!rule.rule(usernameValue)) {
        setUsernameError(rule.message);
        return setIsLoading(false);
      }
    }
    try {
      const response = await axios.post("/auth/register", { username: usernameValue });
      await auth.currentUser.getIdToken(true).catch((error) => {
        router.push({ pathname: "user-access", params: { mode: "login" } });
      });
      router.replace("/");
    } catch (error) {
      setUsernameError(error.response.data?.message || "Error selecting username");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (auth.currentUser) {
      if (!auth.currentUser?.emailVerified) {
        router.replace("verify-email");
      }
    } else {
      router.replace("user-access");
    }
  }, []);

  return (
    <SafeAreaView
      className="flex-1"
      edges={["top", "left", "right", "bottom"]}
      style={{
        backgroundColor: theme.colors.primary,
      }}
    >
      <KeyboardAvoidingView className="flex-1 justify-center mb-[20]" behavior="padding">
        <View className="mx-[20]">
          <Text
            style={{
              ...theme.fonts.header,
              color: theme.colors.onPrimary,
              textAlign: "center",
            }}
          >
            Select Username
          </Text>
          <Text
            className="mt-[10]"
            style={{
              ...theme.fonts.textMedium,
              color: theme.colors.onPrimaryLighter,
              textAlign: "center",
              lineHeight: 24,
            }}
          >
            You can only select your username once
          </Text>
        </View>

        <View className="mx-[25] mt-[30]">
          <TextInput
            className="px-[10] py-[20] rounded-[10px] mt-[10]"
            style={{
              ...theme.fonts.textInput,
              backgroundColor: theme.colors.primaryContainer,
              color: theme.colors.onPrimaryContainer,
            }}
            value={usernameValue}
            onChangeText={(text) => {
              setUsernameValue(text);
              setUsernameError("");
            }}
            keyboardAppearance="dark"
            placeholder="Username"
            placeholderTextColor={theme.colors.onPrimaryContainer}
          />
          <Text
            className="px-[10]"
            style={{
              ...theme.fonts.textSmall,
              color: theme.colors.onError,
            }}
          >
            {usernameError}
          </Text>
        </View>

        <View className="items-center mt-[40]">
          <Pressable
            className="flex-row items-center pt-[4] px-[20]"
            onPress={() => {
              handleSubmit();
            }}
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
              {isLoading ? "Loading..." : "Yup. That's me."}
            </Text>
            {!isLoading && (
              <View className="mt-[3]">
                <ArrowRight colour={theme.colors.onPrimary} height={19} />
              </View>
            )}
          </Pressable>

          <View>
            <Text
              className="text-center mx-[50]"
              style={{
                ...theme.fonts.textSmall,
                color: theme.colors.onError,
              }}
            >
              {/**error */}
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>

      <View className="items-center justify-center">
        <Text
          style={{
            color: theme.colors.onPrimaryLighter,
            ...theme.fonts.textExtraSmall,
            lineHeight: 20,
          }}
        >
          {auth.currentUser?.email}
        </Text>
        <Link
          className="items-center py-[4] px-[4] mb-[17] mt-[5] flex-row justify-center"
          href={{ pathname: "user-access", params: { mode: "register" } }}
          replace
          asChild
        >
          <Pressable
            onPress={() => {
              auth.signOut();
            }}
          >
            <Text
              className="text-center"
              style={{
                color: theme.colors.accent,
                ...theme.fonts.textMediumBold,
                lineHeight: 20,
              }}
            >
              sign out
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
    </SafeAreaView>
  );
};

export default SelectUsername;
