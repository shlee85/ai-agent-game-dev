import React from "react";
import { Text, View, Pressable } from "react-native";

interface HUDProps {
  gold: number;
  heart: number;
  waveId: number;
  speedMultiplier: number;
  onToggleSpeed: () => void;
}

export function HUD({ gold, heart, waveId, speedMultiplier, onToggleSpeed }: HUDProps) {
  return (
    <View className="flex-row items-center gap-6 rounded-full border border-slate-700/50 bg-slate-900/80 px-6 py-2 shadow-sm" pointerEvents="auto">
      <Text className="font-bold text-yellow-400">Gold {gold}</Text>
      <Text className="font-bold text-rose-400">Heart {heart}</Text>
      <Text className="font-bold text-blue-400">Wave {waveId}</Text>
      
      <Pressable 
        onPress={onToggleSpeed}
        className="ml-2 rounded-lg bg-slate-800 px-3 py-1 border border-slate-600 active:bg-slate-700"
      >
        <Text className="font-black text-emerald-400">
          {speedMultiplier === 1 ? "▶ x1" : "▶▶ x2"}
        </Text>
      </Pressable>
    </View>
  );
}
