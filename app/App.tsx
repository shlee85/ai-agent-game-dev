import "./global.css";
import React, { useEffect } from "react";
import { SafeAreaView, StatusBar, Text, View } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";

import { WaveScreen } from "./src/screens/WaveScreen";

export default function App() {
  useEffect(() => {
    async function lockOrientation() {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }
    lockOrientation();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" hidden={true} />
      <WaveScreen />
    </SafeAreaView>
  );
}
