import { View, Text, KeyboardAvoidingView, TextInput, Pressable } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useRegisterMutation } from "../../redux/api/authApi";
import { auth } from "../../config/firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, Ionicons, MaterialCommunityIcons, AntDesign } from "react-native-vector-icons";
import { onAuthStateChanged } from "firebase/auth";

const SelectUsername = () => {
  const [usernameValue, setUsernameValue] = useState("");
  const [errors, setErrors] = useState({ username: [] });

  const usernameRef = useRef();

  const [registerTrigger, { data }] = useRegisterMutation();

  const usernameValidationRules = [
    { rule: (username) => username.length >= 3, message: "Username must be at least 3 characters long" },
    { rule: (username) => username.length <= 20, message: "Username must be at most 20 characters long" },
    {
      rule: (username) => username.match(/^[a-zA-Z0-9_]*$/),
      message: "Username can only contain letters, numbers, and underscores",
    },
  ];

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

  useEffect(() => {
    if (auth.currentUser) {
      if (!auth.currentUser.emailVerified) {
        router.replace("verify_email");
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
            <View className="flex-col">
              <Text className="text-1xl text-center font-bold mb-6">{auth.currentUser.email}</Text>
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
                  autoFocus={true}
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
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SelectUsername;
