import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LobbyScreenProps {
  onSelectWave: (waveId: 1 | 2 | 3) => void;
}

export function LobbyScreen({ onSelectWave }: LobbyScreenProps) {
  const [maxUnlocked, setMaxUnlocked] = useState<number>(1);

  // 로비에 진입할 때마다 진행도를 다시 읽어옴
  const loadProgress = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem("maxUnlockedWave");
      if (saved) {
        setMaxUnlocked(Number(saved));
      }
    } catch (e) {
      console.error("Failed to load progress", e);
    }
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  return (
    <View className="flex-1 items-center justify-center bg-slate-950">
      <Text className="mb-10 text-5xl font-black text-emerald-400">Path Defense</Text>
      
      <View className="flex-row gap-6">
        {[1, 2, 3].map((wave) => {
          // 임시 테스트용: 모든 웨이브 강제 해금 (진행도 무시)
          const isUnlocked = true; // wave <= maxUnlocked;
          return (
            <TouchableOpacity
              key={wave}
              disabled={!isUnlocked}
              onPress={() => onSelectWave(wave as 1 | 2 | 3)}
              className={`h-40 w-40 items-center justify-center rounded-2xl border-2 ${
                isUnlocked
                  ? "border-emerald-500 bg-slate-800 active:bg-slate-700"
                  : "border-slate-700 bg-slate-900 opacity-50"
              }`}
            >
              <Text className={`text-2xl font-bold ${isUnlocked ? "text-emerald-400" : "text-slate-500"}`}>
                Wave {wave}
              </Text>
              {!isUnlocked && (
                <Text className="mt-2 text-xs font-bold text-slate-500">Locked</Text>
              )}
              {isUnlocked && (
                <Text className="mt-2 text-xs font-semibold text-emerald-600">Play</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity 
        onPress={async () => {
          await AsyncStorage.removeItem("maxUnlockedWave");
          setMaxUnlocked(1);
        }}
        className="absolute bottom-10 px-6 py-3 bg-slate-800 rounded-xl border border-slate-700 active:bg-slate-700"
      >
         <Text className="text-slate-400 font-bold">초기화 (Reset Progress)</Text>
      </TouchableOpacity>
    </View>
  );
}
