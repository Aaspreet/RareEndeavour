import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { Link, router } from 'expo-router'

const test = () => {
  return (
    <View className="flex-1 justify-center">
<Pressable onPress={router.back}><Text>Go back</Text></Pressable>
      <Link href={"inbox"}>To inbox</Link>
    </View>
  );
}

export default test