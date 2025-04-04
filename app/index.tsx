import { View, Text } from "react-native";
import React from "react";
import AppleInvites from "@/components/AppleInvites";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const index = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppleInvites />
    </GestureHandlerRootView>
  );
};

export default index;
