import React from "react";
import { Text, View } from "react-native";

import { DIFFICULTY_CONFIG } from "../data/difficulty";
import { STAGE_CONFIG } from "../data/stages";
import { WAVE_CONFIG } from "../data/waves";
import { GridMap } from "../ui/GridMap";
import { HUD } from "../ui/HUD";

export function WaveScreen() {
  const difficulty = DIFFICULTY_CONFIG.normal;
  const wave = WAVE_CONFIG[1];
  const stage = STAGE_CONFIG[1];

  return (
    <View className="flex-1 px-3">
      <HUD gold={difficulty.startGold} heart={difficulty.startHeart} waveId={wave.id} />
      <View className="mt-3 flex-1 rounded-xl border border-slate-800 bg-slate-900 p-3">
        <Text className="text-base font-semibold text-slate-300">Wave Prototype</Text>
        <Text className="mt-2 text-slate-400">
          duration: {wave.durationSec}s / spawn interval: {wave.spawnIntervalSec}s
        </Text>
        <Text className="mt-1 text-slate-400">total spawn: {wave.totalSpawnCount}</Text>
        <Text className="mt-1 text-slate-500">green: start / red: goal / gray: path</Text>

        <View className="mt-3 flex-1">
          <GridMap stage={stage} />
        </View>
      </View>
    </View>
  );
}
