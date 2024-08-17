import { View, Text, Pressable } from "react-native";
import React, { memo } from "react";
import { Comment, Dotdotdot, Triangle } from "../../assets/icons";
import tailwindConfig from "../../tailwind.config";
import { usePathname } from "expo-router";

const PostFeed = memo(({ item, index }) => {
  const pathname = usePathname();

  const { colors } = tailwindConfig.theme.extend;
  return (
    <View
      className="pt-[30] pb-[25] px-[9] bg-primary"
      style={{
        borderTopLeftRadius: index === 0 && pathname == '/chat'? 0 : 8,
        borderTopRightRadius: index === 0 && pathname == '/chat'? 0 : 8,
        borderBottomLeftRadius: index === 0 && pathname == '/chat'? 8 : 8,
        borderBottomRightRadius: index === 0 && pathname == '/chat'? 8 : 8,
      }}
    >
      {/* {console.log("rendering", item.id.toString())} */}
      <View className="pb-[28] flex-row justify-between">
        <View className="">
          <Pressable className="px-[6]">
            <Text
              className="text-mainText"
              style={{
                fontSize: 15,
                fontFamily: "p-regular",
              }}
            >
              {item.username}
            </Text>
          </Pressable>
          <Text
            className="text-secondaryText pl-[6]"
            style={{
              fontSize: 12,
              fontFamily: "p-regular",
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
            <Dotdotdot height={20} colour={colors.mainWhite} />
          </Pressable>
        </View>
      </View>
      <View className="flex-row">
        {item.tags.map((tag) => {
          return (
            <View className="px-[6] py-[2]" key={tag}>
              <Text
                className="text-secondaryText"
                style={{
                  fontSize: 15,
                  fontFamily: "p-regular",
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
          className="text-mainText "
          style={{
            fontSize: 25,
            // lineHeight: "50%",
            lineHeight: 37,
            fontFamily: "p-bold",
          }}
        >
          {item.title}
        </Text>
      </View>
      <View className="flex-row mt-[36] justify-between mr-[10] ml-[4]">
        <Pressable className="px-[6] py-[4] flex-row items-center">
          <View className="transform scale-x-[-1] mr-[6]">
            <Comment height={18} colour={colors.mainWhite} />
          </View>
          <Text
            className="text-thirdText"
            style={{
              fontSize: 13,
              fontFamily: "p-regular",
            }}
          >
            Add comment
          </Text>
        </Pressable>
        <View>
          <View className="flex-row items-center gap-x-[5]">
            <Pressable className="px-[6] py-[6]">
              <Triangle height={18} colour={colors.mainWhite} />
            </Pressable>
            <Text
              className="text-mainText"
              style={{
                fontSize: 15,
                fontFamily: "p-regular",
              }}
            >
              {item.vote_count}
            </Text>
            <Pressable className="transform scale-y-[-1] px-[6] py-[6]">
              <Triangle height={18} colour={colors.mainWhite} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
});

export default PostFeed;
