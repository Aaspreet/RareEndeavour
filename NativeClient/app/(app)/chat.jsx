import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useLazyTestQQuery, useTestQQuery } from "../../redux/api/userApi";

const Chat = () => {
  // const { data } = useTestQQuery();
  // const [trigger, { data: data2 }] = useLazyTestQQuery();

  // useEffect(() => {
  //   console.log("nowww");
  //   trigger();
  // }, []);
  return (
    <View>
      <Text>Chat</Text>
    </View>
  );
};

export default Chat;
