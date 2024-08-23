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
import AuthPromptModal from "../components/modals/AuthPromptModal";
import { AuthPromptModalContext, ScrollingDownContext } from "../utils/contexts.js";
import { PaperProvider } from "react-native-paper";
import theme from "../assets/theme";

SplashScreen.preventAutoHideAsync();

const Layout = () => {
  const [authInitialized, setAuthInitialized] = useState(false);

  const [scrollingDown, setScrollingDown] = useState(false);

  const authPromptModalRef = useRef(null);

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

      await SplashScreen.hideAsync();
    });

    return () => {
      unsubscribeAuthState();
    };
  }, []);

  if (!authInitialized || !loaded) return <Loading />;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView>
          <PaperProvider theme={theme}>
            <SafeAreaProvider>
              <BottomSheetModalProvider>
                <AuthPromptModalContext.Provider value={{ authPromptModalRef }}>
                  <ScrollingDownContext.Provider value={{ scrollingDown, setScrollingDown }}>
                    <Stack screenOptions={{ headerShown: false }}>
                      <Stack.Screen name="(tabs)" />
                      <Stack.Screen name="(auth)" options={{ animation: "slide_from_bottom" }} />
                      <Stack.Screen name="(pages)" />
                      <Stack.Screen name="(test)" options={{}} />
                    </Stack>
                  </ScrollingDownContext.Provider>
                </AuthPromptModalContext.Provider>
                <AuthPromptModal ref={authPromptModalRef} />
              </BottomSheetModalProvider>
            </SafeAreaProvider>
          </PaperProvider>
        </GestureHandlerRootView>
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
