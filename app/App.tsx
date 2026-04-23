import "./global.css";
import React, { useEffect, useState } from "react";
import { SafeAreaView, StatusBar, Text, View } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import * as NavigationBar from "expo-navigation-bar";

import { WaveScreen } from "./src/screens/WaveScreen";
import { LobbyScreen } from "./src/screens/LobbyScreen";
import { Difficulty } from "./src/data/difficulty";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<"lobby" | "wave">("lobby");
  const [selectedWave, setSelectedWave] = useState<1 | 2 | 3>(1);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("normal");
  const [resetKey, setResetKey] = useState<number>(0);

  useEffect(() => {
    async function lockOrientation() {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }
    async function hideNavigationBar() {
      await NavigationBar.setVisibilityAsync("hidden");
      await NavigationBar.setBehaviorAsync("overlay-swipe");
    }
    lockOrientation();
    hideNavigationBar();
  }, []);

  return (
    <View className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" hidden={true} />
      {currentScreen === "lobby" ? (
        <LobbyScreen 
          initialDifficulty={selectedDifficulty}
          onSelectWave={(wave, difficulty) => {
            setSelectedWave(wave);
            setSelectedDifficulty(difficulty);
            setCurrentScreen("wave");
          }} 
        />
      ) : (
        <WaveScreen 
          key={`${selectedWave}-${resetKey}`}
          waveId={selectedWave}
          difficultyLevel={selectedDifficulty}
          onBackToLobby={() => setCurrentScreen("lobby")}
          onNextWave={() => {
            if (selectedWave < 3) setSelectedWave((selectedWave + 1) as 1 | 2 | 3);
          }}
          onRestartWave={() => setResetKey((prev) => prev + 1)}
        />
      )}
    </View>
  );
}
