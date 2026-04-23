import React from "react";
import { Text, View, Pressable } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

interface HUDProps {
  gold: number;
  diamond: number;
  heart: number;
  waveId: number;
  speedMultiplier: number;
  onToggleSpeed: () => void;
}

export function HUD({ gold, diamond, heart, waveId, speedMultiplier, onToggleSpeed }: HUDProps) {
  return (
    <View className="flex-row items-center gap-4 rounded-full border border-slate-700/50 bg-slate-900/80 px-5 py-2 shadow-sm" pointerEvents="auto">
      <View className="flex-row items-center">
        <FontAwesome5 name="coins" size={12} color="#FBBF24" className="mr-1" />
        <Text className="font-bold text-yellow-400">{gold}</Text>
      </View>
      <View className="flex-row items-center">
        <FontAwesome5 name="gem" size={12} color="#67E8F9" className="mr-1" />
        <Text className="font-bold text-cyan-300">{diamond}</Text>
      </View>
      <View className="flex-row items-center">
        <Ionicons name="heart" size={14} color="#FB7185" className="mr-1" />
        <Text className="font-bold text-rose-400">{heart}</Text>
      </View>
      <Text className="font-bold text-blue-400 ml-2">Wave {waveId}</Text>
      
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
