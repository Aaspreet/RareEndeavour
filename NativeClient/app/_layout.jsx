import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { createContext, useEffect, useRef, useState } from "react";
import { Link, router, Slot, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { Provider } from "react-redux";
import { persistor, store } from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import Loading from "./loading";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";
import tailwindConfig from "../tailwind.config";

SplashScreen.preventAutoHideAsync();

export const AuthModalContext = createContext(null);

const Layout = () => {
  const [authInitialized, setAuthInitialized] = useState(false);
  const authModalRef = useRef(null);

  const { colors } = tailwindConfig.theme.extend;

  const presentAuthModal = () => {
    authModalRef.current?.present();
  };

  const [loaded, error] = useFonts({
    "p-thin": require("../assets/fonts/Palanquin-Thin.ttf"),
    "p-extralight": require("../assets/fonts/Palanquin-ExtraLight.ttf"),
    "p-light": require("../assets/fonts/Palanquin-Light.ttf"),
    "p-regular": require("../assets/fonts/Palanquin-Regular.ttf"),
    "p-medium": require("../assets/fonts/Palanquin-Medium.ttf"),
    "p-semibold": require("../assets/fonts/Palanquin-SemiBold.ttf"),
    "p-bold": require("../assets/fonts/Palanquin-Bold.ttf"),
    "pd-regular": require("../assets/fonts/PalanquinDark-Regular.ttf"),
    "pd-medium": require("../assets/fonts/PalanquinDark-Medium.ttf"),
    "pd-semibold": require("../assets/fonts/PalanquinDark-SemiBold.ttf"),
    "pd-bold": require("../assets/fonts/PalanquinDark-Bold.ttf"),
  });

  useEffect(() => {
    const unsubscribeAuthState = onAuthStateChanged(auth, async (user) => {
      setAuthInitialized(true);
      // authModalRef.current?.present();

      await SplashScreen.hideAsync();
    });

    return () => {
      unsubscribeAuthState();
    };
  }, []);

  if (!authInitialized || !loaded) return <Loading />;

  const AuthBottomSheetModal = () => {
    return (
      <BottomSheetModal
        ref={authModalRef}
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
        <BottomSheetView style={{ }}>
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
            <Pressable className="bg-secondary rounded-[10px] py-[15]">
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
            </Pressable>
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
            <Pressable className="py-[4] px-[4]">
              <Text
                className="text-mainRed"
                style={{
                  fontSize: 16,
                  fontFamily: "p-bold",
                }}
              >
                Login
              </Text>
            </Pressable>
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
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <GestureHandlerRootView>
            <BottomSheetModalProvider>
              <AuthModalContext.Provider value={{ presentAuthModal }}>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="(auth)" options={{ presentation: "fullScreenModal" }} />
                  <Stack.Screen name="(test)" />
                </Stack>
              </AuthModalContext.Provider>
              <AuthBottomSheetModal />
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default Layout;

// <Stack.Screen
//   name="(modals)"
//   options={({ navigation, route }) => ({
//     presentation: "modal",
//     animation: "default",
//     gestureEnabled: route.params?.enableGestures === "true",
//   })}
// />;
