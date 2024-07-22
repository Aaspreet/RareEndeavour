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

SplashScreen.preventAutoHideAsync();

const Layout = () => {
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const unsubscribeAuthState = onAuthStateChanged(auth, async (user) => {
      setAuthInitialized(true);
      await SplashScreen.hideAsync();
    });

    return () => {
      unsubscribeAuthState();
    };
  }, []);

  if (!authInitialized) return <Loading />;

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
