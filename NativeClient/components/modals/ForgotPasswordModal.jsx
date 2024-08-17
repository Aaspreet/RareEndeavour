import { View, Text, Pressable, Keyboard } from "react-native";
import React, { forwardRef, useEffect, useState } from "react";
import { BottomSheetModal, BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet";
import tailwindConfig from "../../tailwind.config";
import { ArrowRight } from "../../assets/icons";
import { auth } from "../../config/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ForgotPasswordModal = forwardRef(({}, ref) => {
  const [emailValue, setEmailValue] = useState("");
  const [emailError, setEmailError] = useState("");

  const [resetEmailState, setResetEmailState] = useState("not sent");

  const [isLoading, setIsLoading] = useState(false);

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const { colors } = tailwindConfig.theme.extend;
  const insets = useSafeAreaInsets();

  const handleSendResetEmail = async () => {
    setIsLoading(true);
    setEmailError("");
    setResetEmailState("not sent");

    if (!emailValue) {
      setEmailError("Email is required");
      return setIsLoading(false);
    }

    try {
      await sendPasswordResetEmail(auth, emailValue);
      setResetEmailState("sent");
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      if (error.code === "auth/invalid-email") {
        setEmailError("Invalid email");
      } else if (error.code === "auth/user-not-found") {
        setEmailError("Account not found");
      } else if (error.code === "auth/too-many-requests") {
        setEmailError("Too many requests. Try again later");
      } else {
        setResetEmailState("failed");
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const keyboardWillHideListener = Keyboard.addListener("keyboardWillHide", () => {
      ref.current?.snapToIndex(0);
      setKeyboardVisible(false);
    });

    const keyboardWillShowListener = Keyboard.addListener("keyboardWillShow", () => {
      setKeyboardVisible(true);
    });

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={["40%"]}
      containerStyle={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      backgroundStyle={{ backgroundColor: colors.primary }}
      keyboardBehavior="interactive"
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
          className="text-mainText mt-[21]"
          style={{
            fontSize: 23,
            fontFamily: "pd-bold",
            textAlign: "center",
          }}
        >
          Reset Password
        </Text>
        <Text
          className="text-secondaryText mb-[35]"
          style={{
            fontSize: 16,
            fontFamily: "p-medium",
            textAlign: "center",
          }}
        >
          Enter your email below.
        </Text>
        <View className="mx-[35]">
          <BottomSheetTextInput
            style={{
              color: colors.mainText,
              paddingHorizontal: 10,
              paddingVertical: 20,
              backgroundColor: colors.secondary,
              borderRadius: 10,
              fontSize: 15,
              fontFamily: "p-medium",
            }}
            keyboardAppearance="dark"
            value={emailValue}
            onChangeText={(text) => {
              setEmailValue(text);
              setEmailError("");
            }}
            placeholder="Email"
            placeholderTextColor={colors.mainText}
          />
          <Text
            className="text-mainRed px-[10]"
            style={{
              fontSize: 13,
              fontFamily: "p-medium",
            }}
          >
            {emailError}
          </Text>
        </View>
        <View className="items-center" style={{ marginTop: keyboardVisible ? 38 : 13 }}>
          <Pressable
            className=" items-center pt-[4] px-[25] mt-[10]"
            onPress={handleSendResetEmail}
            disabled={isLoading}
          >
            <View className="flex-row items-center">
              <Text
                className="text-mainText pr-[2]"
                style={{
                  fontSize: 15,
                  fontFamily: "p-semibold",
                  textAlign: "center",
                }}
              >
                {isLoading ? "Loading..." : "Continue"}
              </Text>
              {!isLoading && (
                <View className="mt-[3]">
                  <ArrowRight colour={colors.mainText} height={19} />
                </View>
              )}
            </View>
            <Text
              className="text-center"
              style={{
                color: resetEmailState === "failed" ? colors.mainRed : colors.mainGreen,
                fontFamily: "p-bold",
                fontSize: 13,
              }}
            >
              {(resetEmailState === "sent" && "Sent!") ||
                (resetEmailState === "failed" && "Failed to send email...") ||
                ""}
            </Text>
          </Pressable>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default ForgotPasswordModal;
