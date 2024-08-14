import { View, Text, Pressable } from "react-native";
import React from "react";
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";

const ContinueWithGoogle = () => {

const handlePress = () => {
    const provider = new GoogleAuthProvider();
    // Sign in with popup
    signInWithRedirect(auth, provider)
}

  return (
    <Pressable className="border p-2 flex-row rounded-lg mt-1" onPress={handlePress}>
      <Text className="mr-2">G</Text>
      <Text>Continue with Google</Text>
    </Pressable>
  );
};

export default ContinueWithGoogle;
