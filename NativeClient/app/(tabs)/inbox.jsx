import { View, Text, Pressable } from "react-native";
import React, { useEffect } from "react";
import { Link, router } from "expo-router";
import { useFetchUsernameQuery, useLazyFetchUsernameQuery } from "../../redux/api/userApi";

const Inbox = () => {
  const [trigger, {data, error}] = useLazyFetchUsernameQuery();

  useEffect(() => {
    console.log(data);
    
    // console.log(error);
  }, [data, error]);
  
  useEffect(() => {
    trigger()
  }
  , [])

  return <View className="flex-1 justify-center"></View>;
};


export default Inbox;
