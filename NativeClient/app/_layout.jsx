import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
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

SplashScreen.preventAutoHideAsync();

const Layout = () => {
  const [authInitialized, setAuthInitialized] = useState(false);
  const [loaded, error] = useFonts({
    "AvenirNext-Regular": require("../assets/fonts/AvenirNext-Regular.otf"),
    "headerbold": require("../assets/fonts/AvenirNextLTPro-Bold.otf"),
    "errorsmall": require("../assets/fonts/AvenirNextLTPro-It.otf"),
    "AvenirNext-BoldItalic": require("../assets/fonts/AvenirNext-BoldItalic.otf"),
    "AvenirNext-Regular": require("../assets/fonts/AvenirNextLTPro-Regular.otf"),
    "SF-Compact-Regular": require("../assets/fonts/SF-Compact-Display-Regular.ttf"),
    "SF-Compact-Semibold": require("../assets/fonts/SF-Compact-Display-Semibold.ttf"),
    "SF-UI-Text-Regular": require("../assets/fonts/SF-UI-Text-Regular.ttf"),
    "SF-UI-Text-Semibold": require("../assets/fonts/SF-UI-Text-Semibold.ttf"),
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
        <SafeAreaProvider>
          <Stack initialRouteName="(app)">
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ presentation: "transparentModal", headerShown: false }} />
            <Stack.Screen
              name="(modals)"
              options={{
                presentation: "modal",
                animation: "default",
                gestureEnabled: false,
                headerShown: false,
              }}
            />
          </Stack>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default Layout;
