import "./global.css";
import React from "react";
import { SafeAreaView, StatusBar, Text, View } from "react-native";

import { WaveScreen } from "./src/screens/WaveScreen";

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" />
      <View className="px-3 py-3">
        <Text className="text-lg font-bold text-slate-200">Path Defense Game - Prototype</Text>
      </View>
      <WaveScreen />
    </SafeAreaView>
  );
}
