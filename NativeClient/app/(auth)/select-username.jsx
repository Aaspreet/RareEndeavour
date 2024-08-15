import { View, Text, KeyboardAvoidingView, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import tailwindConfig from "../../tailwind.config";
import { ArrowRight, Close } from "../../assets/icons";
import { router } from "expo-router";
import { TextInput } from "react-native-gesture-handler";
import { useRegisterMutation } from "../../redux/api/authApi";
import { usernameValidationRules } from "../../assets/other/authenticationRules";
import { auth } from "../../config/firebaseConfig";

const SelectUsername = () => {
  const [usernameValue, setUsernameValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [usernameError, setUsernameError] = useState("");

  const [registerTrigger] = useRegisterMutation();

  const { colors } = tailwindConfig.theme.extend;
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

    await registerTrigger({ username: usernameValue })
      .unwrap()
      .then(() => router.push("/"))
      .catch((error) => {
        setUsernameError(error.data?.message);
      });
    setIsLoading(false);
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
    <SafeAreaView className="flex-1 bg-primary" edges={["top", "left", "right", "bottom"]}>
      <KeyboardAvoidingView className="flex-1 justify-center mb-[20]" behavior="padding">
        <View className="mx-[20]">
          <Text
            className="text-mainText"
            style={{
              fontSize: 23,
              fontFamily: "pd-bold",
              textAlign: "center",
            }}
          >
            Select Username
          </Text>
          <Text
            className="text-secondaryText mt-[10]"
            style={{
              fontSize: 16,
              fontFamily: "p-medium",
              textAlign: "center",
              lineHeight: 24,
            }}
          >
            You can only select your username once
          </Text>
        </View>

        <View className="mx-[25] mt-[30]">
          <TextInput
            className="text-mainText px-[10] py-[20] bg-secondary rounded-[10px] mt-[10]"
            style={{
              fontSize: 15,
              fontFamily: "p-medium",
            }}
            value={usernameValue}
            onChangeText={(text) => {
              setUsernameValue(text);
              setUsernameError("");
            }}
            keyboardAppearance="dark"
            placeholder="Username"
            placeholderTextColor={colors.mainText}
          />
          <Text
            className="text-mainRed px-[10]"
            style={{
              fontSize: 13,
              fontFamily: "p-medium",
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
              className="text-mainText pr-[2]"
              style={{
                fontSize: 16,
                fontFamily: "p-semibold",
                textAlign: "center",
              }}
            >
              {isLoading ? "Loading..." : "Yup. That's me."}
            </Text>
            {!isLoading && (
              <View className="mt-[3]">
                <ArrowRight colour={colors.mainText} height={19} />
              </View>
            )}
          </Pressable>

          <View>
            <Text
              className="text-mainRed text-center mx-[50]"
              style={{
                fontSize: 13,
                fontFamily: "p-medium",
              }}
            >
              {/**error */}
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
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

export default SelectUsername;
