import { View, Text, Pressable } from "react-native";
import React, { forwardRef, useContext } from "react";
import tailwindConfig from "../../tailwind.config";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Link } from "expo-router";
import { useTheme } from "react-native-paper";

const AuthPromptModal = forwardRef(({}, ref) => {
  const theme = useTheme();

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={["46%"]}
      containerStyle={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      backgroundStyle={{ backgroundColor: theme.colors.surface }}
      handleComponent={() => {
        return (
          <View>
            <View
              style={{
                width: "30%",
                height: 4,
                backgroundColor: theme.colors.onSurface,
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
          className="mt-[30] mb-[35]"
          style={{
            ...theme.fonts.header,
            color: theme.colors.onSurface,
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
            asChild
          >
            <Pressable
              className="rounded-[10px] py-[15]"
              style={{
                backgroundColor: theme.colors.surfaceContainer,
              }}
            >
              <Text
                style={{
                  ...theme.fonts.textMedium,
                  color: theme.colors.onSurfaceContainer,
                  textAlign: "center",
                }}
              >
                Continue with email
              </Text>
            </Pressable>
          </Link>
          <Pressable
            className="rounded-[10px] mt-[10] py-[15]"
            style={{
              backgroundColor: theme.colors.surfaceContainer,
            }}
          >
            <Text
              style={{
                ...theme.fonts.textMedium,
                color: theme.colors.onSurfaceContainer,
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
              style={{
                ...theme.fonts.textMediumBold,
                color: theme.colors.accent,
              }}
            >
              Login
            </Text>
          </Link>
          <Text
            style={{
              ...theme.fonts.textMediumBold,
              color: theme.colors.onSurfaceLighter,
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
