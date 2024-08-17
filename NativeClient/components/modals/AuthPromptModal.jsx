import { View, Text, Pressable } from "react-native";
import React, { forwardRef, useContext } from "react";
import tailwindConfig from "../../tailwind.config";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Link } from "expo-router";

const AuthPromptModal = forwardRef(({}, ref) => {
  const { colors } = tailwindConfig.theme.extend;

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={["46%"]}
      containerStyle={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      backgroundStyle={{ backgroundColor: colors.primary }}
      handleComponent={() => {
        return (
          <View>
            <View
              style={{
                width: "30%",
                height: 4,
                backgroundColor: colors.mainWhite,
                borderRadius: 2,
                alignSelf: "center",
                marginTop: 5,
              }}
            />
          </View>
        );
      }}
    >
      <BottomSheetView style={{}}>
        <Text
          className="text-mainText mt-[30] mb-[35]"
          style={{
            fontSize: 23,
            fontFamily: "pd-bold",
            textAlign: "center",
          }}
        >
          Sign Up
        </Text>
        <View className="mx-[35]">
          <Link
            href={{ pathname: "user-access", params: { mode: "register" } }}
            onPress={() => {
              ref.current?.close();
            }}
            className="bg-secondary rounded-[10px] py-[15]"
          >
            <Text
              className="text-secondaryText"
              style={{
                fontSize: 16,
                fontFamily: "p-medium",
                textAlign: "center",
              }}
            >
              Continue with email
            </Text>
          </Link>
          <Pressable className="bg-secondary rounded-[10px] mt-[10] py-[15]">
            <Text
              className="text-secondaryText"
              style={{
                fontSize: 16,
                fontFamily: "p-medium",
                textAlign: "center",
              }}
            >
              Continue with google
            </Text>
          </Pressable>
        </View>
        <View className="flex-row items-center justify-center mt-[30]">
          <Link
            href={{ pathname: "user-access", params: { mode: "login" } }}
            onPress={() => {
              ref.current?.close();
            }}
            className="py-[4] px-[4]"
          >
            <Text
              className="text-mainRed"
              style={{
                fontSize: 16,
                fontFamily: "p-bold",
              }}
            >
              Login
            </Text>
          </Link>
          <Text
            className="text-mainText"
            style={{
              fontSize: 16,
              fontFamily: "p-semibold",
            }}
          >
            instead
          </Text>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default AuthPromptModal;
