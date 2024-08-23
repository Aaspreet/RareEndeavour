import { View, Text, Pressable, FlatList, KeyboardAvoidingView, Keyboard } from "react-native";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Bookmark, CloseX, Dotdotdot, Reply, Share, Triangle } from "../../assets/icons";
import { useTheme, TextInput } from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "../../config/axiosConfig";
import { useLocalSearchParams } from "expo-router";

const CommentsDisplay = forwardRef(({ item, post, setReplyingTo }, addCommentInputRef) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View>
      <View className="flex-row items-center">
        <Pressable className="px-[12] mt-[3]">
          <Text
            style={{
              ...theme.fonts.textMediumBold,
              color: theme.colors.onPrimary,
            }}
          >
            {item.username}
          </Text>
        </Pressable>
        <Text
          style={{
            ...theme.fonts.textExtraSmall,
            color: theme.colors.onPrimaryLighter,
          }}
        >
          {item.timestamp}
        </Text>
      </View>
      <View className="ml-[12] mt-[5] mb-[4]">
        <Text
          style={{
            ...theme.fonts.textMedium,
            color: theme.colors.onPrimary,
          }}
        >
          {item.content}
        </Text>
      </View>
      <View className="flex-row justify-end mb-[10]">
        <View className="flex-row items-center py-[4] px-[12] mt-[3]">
          <Dotdotdot height={20} colour={theme.colors.onPrimary} />
        </View>
        <Pressable
          className="flex-row items-center py-[4] px-[12]"
          onPress={() => {
            setReplyingTo(item);
            addCommentInputRef.current.focus();
          }}
        >
          <View className="mr-[4]">
            <Reply height={20} colour={theme.colors.onPrimary} />
          </View>
          <Text
            style={{
              ...theme.fonts.textMedium,
              color: theme.colors.onPrimaryLighter,
            }}
          >
            Reply
          </Text>
        </Pressable>
        <View className="flex-row items-center">
          <Pressable className="px-[6] py-[6] mr-[3]">
            <Triangle height={20} colour={theme.colors.onPrimary} />
          </Pressable>
          <View className="">
            <Text
              style={{
                ...theme.fonts.textMedium,
                color: theme.colors.onPrimary,
              }}
            >
              {post?.vote_count}
            </Text>
          </View>
          <Pressable className="transform scale-y-[-1] px-[6] py-[6] mr-[5] ml-[3]">
            <Triangle height={20} colour={theme.colors.onPrimary} />
          </Pressable>
        </View>
      </View>
      {item.replies?.map((reply) => {
        return (
          <View
            key={reply.id}
            className="ml-[10] pl-[5] border-l"
            style={{
              // backgroundColor: 'red',
              borderLeftColor: theme.colors.onPrimaryLighter,
              borderLeftWidth: 1,
            }}
          >
            <CommentsDisplay item={reply} />
          </View>
        );
      })}
    </View>
  );
});

export default CommentsDisplay;
