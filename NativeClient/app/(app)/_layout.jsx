import { View, Text, Keyboard } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { router, Stack } from "expo-router";
import { AuthPromptModalContext, IsAuthenticatedContext } from "../../utils/contexts";
import { auth } from "../../config/firebaseConfig";
import { useFetchUserQuery, userApi } from "../../redux/api/userApi";
import { useDispatch } from "react-redux";

const Layout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { authPromptModalRef } = useContext(AuthPromptModalContext);

  const dispatch = useDispatch();

  const checkAuthentication = async (reroute = false, currentPath) => {
    try {
      if (!auth.currentUser) {
        setIsAuthenticated(false);
        if (reroute) authPromptModalRef?.current?.present();
        return;
      }

      if (!auth.currentUser.emailVerified) {
        const refreshedResult = await auth.currentUser.getIdTokenResult(true);
        if (!refreshedResult.claims.email_verified) {
          setIsAuthenticated(false);
          if (reroute && currentPath != "verify-email") router.push("verify-email");
          return;
        }
      }

      const idTokenResult = await auth.currentUser.getIdTokenResult();
      if (!idTokenResult.claims.hasUsername) {
        const refreshedResult = await auth.currentUser.getIdTokenResult(true);
        if (!refreshedResult.claims.hasUsername) {
          setIsAuthenticated(false);
          if (reroute && currentPath != "select-username") router.push("select-username");
          return;
        }
      }

      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Error checking authentication:", error);
      setIsAuthenticated(false);
      if (reroute) authPromptModalRef?.current?.present();
    } finally {
      if (reroute) Keyboard.dismiss();
    }
  };

  useEffect(() => {
    checkAuthentication();
    dispatch(userApi.util.resetApiState());
  }, [auth]);

  return (
    <IsAuthenticatedContext.Provider value={{ isAuthenticated, checkAuthentication }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(pages)" />
        <Stack.Screen name="(modals)" />
        <Stack.Screen name="(test)" options={{}} />
      </Stack>
    </IsAuthenticatedContext.Provider>
  );
};

export default Layout;
