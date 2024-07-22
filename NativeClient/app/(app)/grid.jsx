import { View, Text, Pressable } from "react-native";
import React from "react";
import { useTestMMutation } from "../../redux/api/userApi";

const Grid = () => {
  // const [trigger, { data }] = useTestMMutation();
  return (
    <View>
      {/* <Pressable className="" onPress={trigger}> */}
        <Text>click this button</Text>
      {/* </Pressable> */}
      <Text>Grid</Text>
    </View>
  );
};

export default Grid;
