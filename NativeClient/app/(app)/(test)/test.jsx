import { View, Text, Pressable } from "react-native";
import React, { useEffect } from "react";
import { useLazyFetchUserQuery } from "../../../redux/api/userApi";
import { Link } from "expo-router";

const Test = () => {
  const [trigger, { data }] = useLazyFetchUserQuery();

  const handlePress = async () => {
    const res = await trigger()
      .unwrap()
      .then((res) => console.log("res", res))
      .catch((err) => console.log("err", err));
    console.log(res);
  };

  useEffect(() => {
    // console.log(data);
  }, [data]);

  return (
    <View>
      <Text>Test</Text>
      <Pressable className="bg-red-500 w-24 h-24" onPress={handlePress}>
        <Text>Click here</Text>
      </Pressable>
      <Link href={"/"}>Go to index</Link>
    </View>
  );
};

export default Test;
