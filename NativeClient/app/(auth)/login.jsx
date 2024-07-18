import { View, Text, StyleSheet, SafeAreaView, TextInput } from "react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { FontAwesome, Ionicons, MaterialCommunityIcons, AntDesign } from "react-native-vector-icons";
import { Link } from "expo-router";

const Login = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { username: "", password: "" } });

  const UsernameField = () => {
    return (
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="border-b border-zinc-400 p-1 flex-1"
            placeholder="Username"
            style={{
              fontSize: 19,
            }}
            onChangeText={onChange}
            value={value}
            onBlur={onBlur}
          />
        )}
        name="username"
        rules={{ required: "Username is required" }}
      />
    );
  };

  const PasswordField = () => {
    return (
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="border-b border-zinc-400 p-1 flex-1"
            placeholder="Password"
            style={{
              fontSize: 19,
            }}
            onChangeText={onChange}
            value={value}
            onBlur={onBlur}
          />
        )}
        name="password"
        rules={{ required: "Password is required" }}
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 justify-center">
      <View className="bg-zinc-100 mx-6 rounded-lg pt-8 justify-between">
        <View className="mx-4">
          <View className="pb-7">
            <Text className="text-2xl text-center font-bold mb-6">Login</Text>
            <View className="flex-col">
              <View className="mb-[30] flex-row">
                <UsernameField />
              </View>
              <View className="flex-row">
                <PasswordField />
                <View className="border rounded-t-lg rounded-br-lg px-2 justify-center  border-zinc-300 border-b-zinc-400">
                  <AntDesign name="arrowright" size={22} color="black" />
                </View>
              </View>
            </View>
          </View>
          <View className="pb-1 pl-1 items-start">
            <View className="flex-col mb-1">
              <View className="flex-row">
                <Text className="mr-2">Already a user?</Text>
                <Link href="register" className="text-orange-500 font-semibold" replace>
                  Sign up.
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
    </SafeAreaView>
  );
};

export default Login;
