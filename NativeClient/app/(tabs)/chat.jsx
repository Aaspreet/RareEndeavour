import { View, Text, Pressable } from "react-native";
import React, { useContext, useEffect, useRef } from "react";
import { useLazyTestQQuery, useTestQQuery } from "../../redux/api/userApi";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";
import { AuthModalContext } from "../_layout";

const Chat = () => {
  const modalRef = useRef(null);
  const { presentAuthModal } = useContext(AuthModalContext);

  const handlePress = () => {
    presentAuthModal();
  };

  return (
    <>
      <View>
        <Pressable className="bg-red-500" onPress={handlePress}>
          <Text>Chat</Text>
        </Pressable>
      </View>
      {/* <BottomSheetModal ref={modalRef} snapPoints={["50%"]}>
        <BottomSheetView style={{ justifyContent: "center", flexGrow: 1 }}>
          <Text>YIPIEEE</Text>
        </BottomSheetView>
      </BottomSheetModal> */}
    </>
  );
};

export default Chat;
