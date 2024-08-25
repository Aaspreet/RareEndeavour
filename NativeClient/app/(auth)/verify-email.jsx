import { View, Text, KeyboardAvoidingView, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import tailwindConfig from "../../tailwind.config";
import { ArrowRight, Close, Retry } from "../../assets/icons";
import { router } from "expo-router";
import { auth } from "../../config/firebaseConfig";
import { sendEmailVerification } from "firebase/auth";
import { useLazyFetchUserQuery } from "../../redux/api/userApi";
import { useTheme } from "react-native-paper";

const VerifyEmail = () => {
  const [initialVerificationEmailState, setInitialVerificationEmailState] = useState("not sent");
  const [resendVerificationEmailState, setResendVerificationEmailState] = useState("not sent");

  const [emailVerificationError, setEmailVerificationError] = useState("");
  const [emailResendError, setEmailResendError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [lazyFetchUser] = useLazyFetchUserQuery();

  const handleVerfiedEmailSubmit = async () => {
    setEmailVerificationError("");
    setIsLoading(true);

    try {
      await auth.currentUser.reload();

      if (!auth.currentUser?.emailVerified) {
        setEmailVerificationError("Email is not verified");
        return setIsLoading(false);
      }

      await auth.currentUser.getIdToken(true).catch((error) => {
        router.push({ pathname: "user-access", params: { mode: "login" } });
      });

      router.replace("select-username");
    } catch (error) {
      setEmailVerificationError("Hmm... Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    setResendVerificationEmailState("sending");
    try {
      await sendEmailVerification(auth.currentUser);
      setResendVerificationEmailState("sent");
      if (initialVerificationEmailState != "sent") setInitialVerificationEmailState("sent");
    } catch (error) {
      console.log(error);
      setResendVerificationEmailState("failed");
      setEmailResendError("Failed to resend verification email");
    }
  };

  useEffect(() => {
    const checkAuthenticationStage = async () => {
      const user = await auth.currentUser?.getIdTokenResult(true);
      if (!user) router.push({ pathname: "user-access", params: { mode: "login" } });
      if (user.claims.email_verified) {
        if (!user.claims.hasUsername) router.push("select-username");
        if (user.claims.hasUsername) router.push("/");
      }
    };

    const sendInitialVerificationEmail = async () => {
      setInitialVerificationEmailState("sending");
      try {
        await sendEmailVerification(auth.currentUser);
        setInitialVerificationEmailState("sent");
      } catch (error) {
        console.log(error);
        setInitialVerificationEmailState("failed");
      }
    };

    const asyncUseEffect = async () => {
      await checkAuthenticationStage();
      sendInitialVerificationEmail();
    };
    asyncUseEffect();
  }, []);

  return (
    <SafeAreaView
      className="flex-1"
      edges={["top", "left", "right", "bottom"]}
      style={{
        backgroundColor: theme.colors.primary,
      }}
    >
      <KeyboardAvoidingView className="flex-1 justify-center mb-[20]" behavior="padding">
        <View className="mx-[20]">
          <Text
            style={{
              ...theme.fonts.header,
              color: theme.colors.onPrimary,
              textAlign: "center",
            }}
          >
            Verify Email
          </Text>
          <Text
            className="mt-[10]"
            style={{
              ...theme.fonts.textMedium,
              color: theme.colors.onPrimaryLighter,
              textAlign: "center",
              lineHeight: 24,
            }}
          >
            {(initialVerificationEmailState == "sending" && "Sending verficiation email to: ") ||
              (initialVerificationEmailState == "failed" && "Failed to send verification email to: ") ||
              (initialVerificationEmailState == "sent" && "Verfication email sent to: ") ||
              "Something went wrong trying to send verification email to: "}
            <Text
              style={{
                color: initialVerificationEmailState == "failed" ? theme.colors.onError : theme.colors.onSuccess,
                fontFamily: "p-bold",
              }}
            >
              {auth.currentUser?.email}
            </Text>
          </Text>
        </View>

        {initialVerificationEmailState == "sent" && (
          <View className="items-center mt-[40]">
            <Pressable
              className="flex-row items-center pt-[4] px-[8]"
              onPress={() => {
                handleVerfiedEmailSubmit();
              }}
              disabled={isLoading}
            >
              <Text
                className="pr-[2]"
                style={{
                  ...theme.fonts.textMediumBold,
                  color: theme.colors.onPrimary,
                  textAlign: "center",
                }}
              >
                {isLoading ? "Loading..." : "I've verfied my email"}
              </Text>
              {!isLoading && (
                <View className="mt-[3]">
                  <ArrowRight colour={theme.colors.onPrimary} height={19} />
                </View>
              )}
            </Pressable>

            <View>
              <Text
                className="text-center mx-[50]"
                style={{
                  ...theme.fonts.textSmall,
                  color: theme.colors.onError,
                }}
              >
                {emailVerificationError}
              </Text>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
      <View className="items-center mb-[4]">
        <Pressable className="items-center py-[4] px-[8]" onPress={resendVerificationEmail} disabled={isLoading}>
          <Text
            className="text-center"
            style={{
              ...theme.fonts.textSmall,
              color: resendVerificationEmailState == "failed" ? theme.colors.onError : theme.colors.onSuccess,
              lineHeight: 20,
            }}
          >
            {(resendVerificationEmailState == "sending" && "Sending email...") ||
              (resendVerificationEmailState == "failed" &&
                "Failed to send email. \n Please wait before trying again.") ||
              (resendVerificationEmailState == "sent" && "Email sent")}
          </Text>
          <Text
            className="text-center"
            style={{
              ...theme.fonts.textSmall,
              color: theme.colors.onPrimaryLighter,
              textAlign: "center",
            }}
          >
            Resend email
          </Text>
        </Pressable>
      </View>
      <Pressable
        className="absolute right-0 mb-[20] mx-[20] px-[10] py-[10]"
        style={{ marginTop: insets.top + 7 }}
        onPress={() => {
          router.replace({ pathname: "user-access", params: { mode: "login" } });
        }}
      >
        <Close colour={theme.colors.onPrimary} height={27} />
      </Pressable>
    </SafeAreaView>
  );
};

export default VerifyEmail;
