import { View, Text, Pressable } from "react-native";
import React, { memo } from "react";
import { Comment, Dotdotdot, Triangle } from "../../assets/icons";
import tailwindConfig from "../../tailwind.config";
import { usePathname } from "expo-router";
import { useTheme } from "react-native-paper";

const PostFeed = memo(({ item, index }) => {
  const pathname = usePathname();
  const theme = useTheme();

  return (
    <View
      className="pt-[30] pb-[25] px-[9]"
      style={{
        backgroundColor: theme.colors.primary,
        borderTopLeftRadius: index === 0 && pathname == "/chat" ? 0 : 8,
        borderTopRightRadius: index === 0 && pathname == "/chat" ? 0 : 8,
        borderBottomLeftRadius: index === 0 && pathname == "/chat" ? 8 : 8,
        borderBottomRightRadius: index === 0 && pathname == "/chat" ? 8 : 8,
      }}
    >
      <View className="pb-[28] flex-row justify-between">
        <View className="">
          <Pressable className="px-[6]">
            <Text
              style={{
                ...theme.fonts.textMedium,
                color: theme.colors.onPrimary,
              }}
            >
              {item.username}
            </Text>
          </Pressable>
          <Text
            className="pl-[6]"
            style={{
              ...theme.fonts.textExtraSmall,
              color: theme.colors.onPrimaryLighter,
            }}
          >
            {item.timestamp}
          </Text>
        </View>
        <View className="flex-row items-center">
          {/* <Text
                  className="mr-[12]"
                  style={{
                    fontSize: 14,
                    fontFamily: "p-semibold",
                    color: "white",
                  }}
                >
                  5 min read
                </Text> */}
          <Pressable className="py-[4] px-[6] mt-[4]">
            <Dotdotdot height={20} colour={theme.colors.onPrimary} />
          </Pressable>
        </View>
      </View>
      <View className="flex-row">
        {item.tags?.map((tag) => {
          return (
            <View className="px-[6] py-[2]" key={tag}>
              <Text
                style={{
                  ...theme.fonts.textSmall,
                  color: theme.colors.onPrimaryLighter,
                }}
              >
                # {tag}
              </Text>
            </View>
          );
        })}
      </View>
      <View className="mt-[12] pl-[6]">
        <Text
          style={{
            ...theme.fonts.postTitle,
            color: theme.colors.onPrimary,
          }}
        >
          {item.title}
        </Text>
      </View>
      <View className="flex-row mt-[36] justify-between mr-[10] ml-[4]">
        <Pressable className="px-[6] py-[4] flex-row items-center">
          <View className="transform scale-x-[-1] mr-[6]">
            <Comment height={18} colour={theme.colors.onPrimary} />
          </View>
          <Text
            style={{
              ...theme.fonts.textMedium,
              color: theme.colors.onPrimaryLighter,
            }}
          >
            Add comment
          </Text>
        </Pressable>
        <View>
          <View className="flex-row items-center gap-x-[5]">
            <Pressable className="px-[6] py-[6]">
              <Triangle height={18} colour={theme.colors.onPrimary} />
            </Pressable>
            <Text
              style={{
                ...theme.fonts.textMedium,
                color: theme.colors.onPrimary,
              }}
            >
              {item.vote_count}
            </Text>
            <Pressable className="transform scale-y-[-1] px-[6] py-[6]">
              <Triangle height={18} colour={theme.colors.onPrimary} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
});

export default PostFeed;
