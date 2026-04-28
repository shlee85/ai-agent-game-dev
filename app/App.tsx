import "./global.css";
import React, { useEffect, useState } from "react";
import { StatusBar, View } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import * as NavigationBar from "expo-navigation-bar";

import { WaveScreen } from "./src/screens/WaveScreen";
import { LobbyScreen } from "./src/screens/LobbyScreen";
import { Phase0Screen } from "./src/screens/Phase0Screen";
import { Phase1Screen } from "./src/screens/Phase1Screen";
import { Difficulty } from "./src/data/difficulty";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<"lobby" | "wave" | "phase0" | "phase1">("lobby");
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
          onOpenPhase0={() => setCurrentScreen("phase0")}
          onOpenPhase1={() => setCurrentScreen("phase1")}
          onSelectWave={(wave, difficulty) => {
            setSelectedWave(wave);
            setSelectedDifficulty(difficulty);
            setCurrentScreen("wave");
          }} 
        />
      ) : currentScreen === "wave" ? (
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
      ) : currentScreen === "phase0" ? (
        <Phase0Screen onBack={() => setCurrentScreen("lobby")} />
      ) : (
        <Phase1Screen onBack={() => setCurrentScreen("lobby")} />
      )}
    </View>
  );
}
