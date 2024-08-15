import { View, Text, KeyboardAvoidingView, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import tailwindConfig from "../../tailwind.config";
import { ArrowRight, Close, Retry } from "../../assets/icons";
import { router } from "expo-router";
import { auth } from "../../config/firebaseConfig";
import { sendEmailVerification } from "firebase/auth";
import { useLazyFetchUserQuery } from "../../redux/api/userApi";

const VerifyEmail = () => {
  const [initialVerificationEmailState, setInitialVerificationEmailState] = useState("not sent");
  const [resendVerificationEmailState, setResendVerificationEmailState] = useState("not sent");

  const [emailVerificationError, setEmailVerificationError] = useState("");
  const [emailResendError, setEmailResendError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const { colors } = tailwindConfig.theme.extend;
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

      router.replace("select-username");
    } catch (error) {
      setEmailVerificationError("Hmm... Something went wrong");
      return setIsLoading(false);
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
    const asyncUseEffect = async () => {
      if (auth.currentUser) {
        if (auth.currentUser?.emailVerified) {
          await lazyFetchUser()
            .unwrap()
            .then((user) => {
              if (!user.username) {
                return router.replace("select-username");
              } else {
                return router.replace("/");
              }
            })
            .catch((error) => {
              return router.replace("select-username");
            });
          return;
        }

        setInitialVerificationEmailState("sending");

        try {
          await sendEmailVerification(auth.currentUser);
          setInitialVerificationEmailState("sent");
        } catch (error) {
          console.log(error);

          setInitialVerificationEmailState("failed");
        }
      } else {
        router.replace("user-access");
      }
    };
    asyncUseEffect();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-primary" edges={["top", "left", "right", "bottom"]}>
      <KeyboardAvoidingView className="flex-1 justify-center mb-[20]" behavior="padding">
        <View className="mx-[20]">
          <Text
            className="text-mainText"
            style={{
              fontSize: 23,
              fontFamily: "pd-bold",
              textAlign: "center",
            }}
          >
            Verify Email
          </Text>
          <Text
            className="text-secondaryText mt-[10]"
            style={{
              fontSize: 16,
              fontFamily: "p-medium",
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
                color: initialVerificationEmailState == "failed" ? colors.mainRed : colors.mainGreen,
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
                className="text-mainText pr-[2]"
                style={{
                  fontSize: 16,
                  fontFamily: "p-semibold",
                  textAlign: "center",
                }}
              >
                {isLoading ? "Loading..." : "I've verfied my email"}
              </Text>
              {!isLoading && (
                <View className="mt-[3]">
                  <ArrowRight colour={colors.mainText} height={19} />
                </View>
              )}
            </Pressable>

            <View>
              <Text
                className="text-mainRed text-center mx-[50]"
                style={{
                  fontSize: 13,
                  fontFamily: "p-medium",
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
              color: resendVerificationEmailState == "failed" ? colors.mainRed : colors.mainGreen,
              fontSize: 14,
              fontFamily: "p-medium",
              lineHeight: 20,
            }}
          >
            {(resendVerificationEmailState == "sending" && "Sending email...") ||
              (resendVerificationEmailState == "failed" &&
                "Failed to send email. \n Please wait before trying again.") ||
              (resendVerificationEmailState == "sent" && "Email sent")}
          </Text>
          <Text
            className="text-mainText text-center"
            style={{
              fontSize: 16,
              fontFamily: "p-semibold",
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
        onPress={router.back}
      >
        <Close colour={colors.mainText} height={27} />
      </Pressable>
    </SafeAreaView>
  );
};

export default VerifyEmail;
