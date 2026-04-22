import React from "react";
import { Text, View } from "react-native";

interface HUDProps {
  gold: number;
  heart: number;
  waveId: number;
}

export function HUD({ gold, heart, waveId }: HUDProps) {
  return (
    <View className="flex-row items-center gap-6 rounded-full border border-slate-700/50 bg-slate-900/80 px-6 py-2 shadow-sm">
      <Text className="font-bold text-yellow-400">Gold {gold}</Text>
      <Text className="font-bold text-rose-400">Heart {heart}</Text>
      <Text className="font-bold text-blue-400">Wave {waveId}</Text>
    </View>
  );
}
