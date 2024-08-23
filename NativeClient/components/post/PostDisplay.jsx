import { View, Text, Pressable, FlatList, KeyboardAvoidingView, Keyboard } from "react-native";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Bookmark, CloseX, Dotdotdot, Reply, Share, Triangle } from "../../assets/icons";
import { useTheme, TextInput } from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "../../config/axiosConfig";
import { useLocalSearchParams } from "expo-router";

const PostDisplay = ({post}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="mx-[2] pb-[15]"
      style={{
        backgroundColor: theme.colors.primary,
        paddingTop: insets.top + 39,
        borderRadius: 8,
      }}
    >
      <View className="flex-row justify-between items-center">
        <View className="">
          <Pressable className="px-[12]">
            <Text
              style={{
                ...theme.fonts.textMediumBold,
                color: theme.colors.onPrimary,
              }}
            >
              {post?.username}
            </Text>
          </Pressable>
          <Text
            className="pl-[12]"
            style={{
              ...theme.fonts.textExtraSmall,
              color: theme.colors.onPrimaryLighter,
            }}
          >
            {post?.timestamp}
          </Text>
        </View>
        <Pressable className="px-[12] py-[8] mb-[8] mr-[6]">
          <Dotdotdot height={20} colour={theme.colors.onPrimary} />
        </Pressable>
      </View>
      <View className="flex-row ml-[4] mt-[26]">
        {post?.tags?.map((tag) => {
          return (
            <View className="px-[8] py-[2]" key={tag}>
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
      <View className="mx-[12]">
        <View className="mt-[12]">
          <Text
            style={{
              ...theme.fonts.postTitle,
              color: theme.colors.onPrimary,
            }}
          >
            {post?.title}
          </Text>
        </View>
        <View className="mt-[8]">
          <Text
            style={{
              ...theme.fonts.postBody,
              color: theme.colors.onPrimary,
            }}
          >
            {post?.body}
          </Text>
        </View>
      </View>

      <View className="flex-row mt-[16] justify-between items-center">
        <View>
          <View className="flex-row items-center gap-x-[5] ml-[3]">
            <Pressable className="px-[6] py-[6]">
              <Triangle height={20} colour={theme.colors.onPrimary} />
            </Pressable>
            <Text
              style={{
                ...theme.fonts.textMedium,
                color: theme.colors.onPrimary,
              }}
            >
              {post?.vote_count}
            </Text>
            <Pressable className="transform scale-y-[-1] px-[6] py-[6]">
              <Triangle height={20} colour={theme.colors.onPrimary} />
            </Pressable>
          </View>
        </View>
        <View className="flex-row items-center">
          <Pressable className="py-[8] px-[8]">
            <Share height={22} colour={theme.colors.onPrimary} />
          </Pressable>
          <Pressable className="py-[8] px-[8]">
            <Bookmark height={22} colour={theme.colors.onPrimary} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default PostDisplay;
