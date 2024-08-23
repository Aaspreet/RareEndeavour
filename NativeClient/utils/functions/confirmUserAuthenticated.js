import { useContext } from "react";
import { auth } from "../../config/firebaseConfig";
import { AuthPromptModalContext } from "../contexts";
import { router } from "expo-router";
import { Keyboard } from "react-native";

export default confirmUserAuthenticated = async (authPromptModalRef) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      authPromptModalRef?.current?.present();
      Keyboard.dismiss();
      return false;
    }

    if (!user.emailVerified) {
      router.push("verify-email");
      Keyboard.dismiss();
      return false;
    }

    const result = await user.getIdTokenResult();
    if (!result.claims.hasUsername) {
      router.push("select-username");
      Keyboard.dismiss();
      return false;
    }
    return true;
  } catch (err) {
    authPromptModalRef?.current?.present();
    Keyboard.dismiss();
    return false;
  }
};
