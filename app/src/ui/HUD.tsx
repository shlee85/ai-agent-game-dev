import React from "react";
import { Text, View, Pressable } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useLanguage } from "../contexts/LanguageContext";

interface HUDProps {
  gold: number;
  diamond: number;
  heart: number;
  waveId: number;
  speedMultiplier: number;
  onToggleSpeed: () => void;
  timeLeftSec?: number | null;
}

function formatTime(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m.toString().padStart(2, "0")}:${r.toString().padStart(2, "0")}`;
}

export function HUD({ gold, diamond, heart, waveId, speedMultiplier, onToggleSpeed, timeLeftSec }: HUDProps) {
  const { t } = useLanguage();
  return (
    <View className="flex-row items-center gap-4 rounded-full border border-slate-700/50 bg-slate-900/80 px-5 py-2 shadow-sm" pointerEvents="auto">
      <View className="flex-row items-center">
        <FontAwesome5 name="coins" size={12} color="#FBBF24" style={{ marginRight: 4 }} />
        <Text className="font-bold text-yellow-400">{gold}</Text>
      </View>
      <View className="flex-row items-center">
        <FontAwesome5 name="gem" size={12} color="#67E8F9" style={{ marginRight: 4 }} />
        <Text className="font-bold text-cyan-300">{diamond}</Text>
      </View>
      <View className="flex-row items-center">
        <Ionicons name="heart" size={14} color="#FB7185" style={{ marginRight: 4 }} />
        <Text className="font-bold text-rose-400">{heart}</Text>
      </View>
      <Text className="font-bold text-blue-400 ml-2">{t.waveLabel} {waveId}</Text>
      {typeof timeLeftSec === "number" && (
        <Text className="font-bold text-amber-300">{t.timeLabel} {formatTime(timeLeftSec)}</Text>
      )}
      
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
