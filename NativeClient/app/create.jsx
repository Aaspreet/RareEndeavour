import { View, Text, TextInput } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

const Create = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  return (
    <SafeAreaView className="flex-1 w-52" edges={["left", "right", "bottom"]} style={{ backgroundColor: "rgb(20, 20, 20)" }}>
      <View className="mx-2 mt-8">
        <Controller
          name="title"
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              className="py-2 text-white font-bold text-2xl px-2"
              placeholderTextColor={"white"}
              value={value}
              onChangeText={onChange}
              onBlue={onBlur}
              placeholder="Title"
            />
          )}
        />
      </View>
      <View className="mx-2 mt-4 flex-1 border border-zinc-500 rounded-lg ">
        <Controller
          name="body"
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              className="py-2 text-white font-semibold text-[18px] px-2"
              placeholderTextColor={"white"}
              value={value}
              onChangeText={onChange}
              onBlue={onBlur}
              placeholder="Body"
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Create;
