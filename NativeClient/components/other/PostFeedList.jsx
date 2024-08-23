import { View, Text, Pressable } from "react-native";
import React from "react";
import tailwindConfig from "../../tailwind.config";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Retry } from "../../assets/icons";
import { useTheme } from "react-native-paper";

export const PostFeedListFooter = ({ error, fetchPosts }) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { colors } = tailwindConfig.theme.extend;

  return (
    <View
      className="flex-row justify-center items-center"
      style={{
        marginBottom: insets.bottom + 25,
      }}
    >
      <Text
        className="items-center"
        style={{
          color: error ? theme.colors.onError : theme.colors.onBackground,
          ...theme.fonts.textMedium,
          letterSpacing: 1.25,
        }}
      >
        {error || "Fetching posts..."}
      </Text>
      <Pressable className="mt-[4] p-[10]" onPress={fetchPosts}>
        {error && <Retry height={16} colour={theme.colors.onBackground} />}
      </Pressable>
    </View>
  );
};
