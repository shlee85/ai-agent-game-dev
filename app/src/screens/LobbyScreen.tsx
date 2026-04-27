import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, ImageBackground, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import { Difficulty } from "../data/difficulty";

interface LobbyScreenProps {
  initialDifficulty: Difficulty;
  onSelectWave: (waveId: 1 | 2 | 3, difficulty: Difficulty) => void;
}

export function LobbyScreen({ initialDifficulty, onSelectWave }: LobbyScreenProps) {
  const [maxUnlocked, setMaxUnlocked] = useState<number>(1);
  const [selectedDiff, setSelectedDiff] = useState<Difficulty>(initialDifficulty);

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
    <ImageBackground 
      source={require('../../assets/bg.png')} 
      className="flex-1 items-center justify-center bg-slate-950"
      imageStyle={{ opacity: 0.6 }} // 우주 배경이 너무 밝지 않게
    >
      <View className="absolute right-4 top-4 z-10 rounded-md border border-cyan-500/40 bg-slate-950/80 px-2 py-1">
        <Text className="text-[10px] font-black tracking-wider text-cyan-400/90">beta2.0</Text>
      </View>

      {/* 타이틀 영역 */}
      <View className="items-center mb-6 mt-4">
        <Image 
          source={require('../../assets/logo.png')} 
          style={{ width: 80, height: 80, marginBottom: 12, borderRadius: 16, borderWidth: 2, borderColor: "rgba(6, 182, 212, 0.5)" }} 
        />
        <Text 
          className="text-4xl font-black text-cyan-400 tracking-wider" 
          style={{ textShadowColor: "rgba(6, 182, 212, 0.8)", textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 15 }}
        >
          SENTINEL PROTOCOL
        </Text>
        <Text className="text-xs font-bold text-fuchsia-400 tracking-[0.3em] mt-1">
          DEFEND THE SPACE UNION
        </Text>
      </View>
      
      {/* 난이도 선택 영역 */}
      <View className="mb-6 flex-row gap-4">
        {(["easy", "normal", "hard"] as Difficulty[]).map((diff) => {
          const isSelected = selectedDiff === diff;
          let colorClass = "text-slate-400";
          let borderClass = "border-slate-700 bg-slate-900";
          let shadow = {};
          
          if (isSelected) {
            if (diff === "easy") {
              colorClass = "text-emerald-400";
              borderClass = "border-emerald-500 bg-emerald-900/40";
              shadow = { shadowColor: "#10B981", shadowOpacity: 0.5, shadowRadius: 10, elevation: 5 };
            } else if (diff === "normal") {
              colorClass = "text-cyan-400";
              borderClass = "border-cyan-500 bg-cyan-900/40";
              shadow = { shadowColor: "#06B6D4", shadowOpacity: 0.5, shadowRadius: 10, elevation: 5 };
            } else {
              colorClass = "text-fuchsia-400";
              borderClass = "border-fuchsia-500 bg-fuchsia-900/40";
              shadow = { shadowColor: "#D946EF", shadowOpacity: 0.5, shadowRadius: 10, elevation: 5 };
            }
          }

          return (
            <TouchableOpacity
              key={diff}
              onPress={() => setSelectedDiff(diff)}
              style={shadow}
              className={`px-6 py-3 rounded-xl border-2 flex-row items-center gap-2 ${borderClass}`}
            >
              <Ionicons 
                name={diff === "easy" ? "shield-checkmark" : diff === "normal" ? "flash" : "skull"} 
                size={16} 
                color={isSelected ? (diff === "easy" ? "#34D399" : diff === "normal" ? "#22D3EE" : "#E879F9") : "#94A3B8"} 
              />
              <Text className={`font-black tracking-widest ${colorClass}`}>
                {diff === "easy" ? "EASY" : diff === "normal" ? "NORMAL" : "HARD"}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 웨이브(섹터) 선택 영역 */}
      <View className="flex-row gap-6">
        {[1, 2, 3].map((wave) => {
          // 임시 테스트용: 모든 웨이브 강제 해금 (진행도 무시)
          const isUnlocked = true; // wave <= maxUnlocked;
          return (
            <TouchableOpacity
              key={wave}
              disabled={!isUnlocked}
              onPress={() => onSelectWave(wave as 1 | 2 | 3, selectedDiff)}
              style={isUnlocked ? { shadowColor: "rgba(6, 182, 212, 0.5)", shadowOpacity: 0.4, shadowRadius: 15, elevation: 8 } : {}}
              className={`h-32 w-32 items-center justify-center rounded-2xl border-2 relative overflow-hidden ${
                isUnlocked
                  ? "border-cyan-500 bg-slate-900"
                  : "border-slate-800 bg-slate-950 opacity-60"
              }`}
            >
              {/* 백그라운드 장식용 무늬 */}
              {isUnlocked && (
                <View className="absolute inset-0 opacity-10 border-[15px] border-cyan-500 rounded-full scale-150" />
              )}
              
              <Text className="text-[10px] font-bold text-slate-400 mb-2 tracking-widest">SECTOR</Text>
              <Text 
                className={`text-4xl font-black ${isUnlocked ? "text-cyan-300" : "text-slate-600"}`} 
                style={isUnlocked ? { textShadowColor: "rgba(6, 182, 212, 0.8)", textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 } : {}}
              >
                0{wave}
              </Text>
              
              <View className="mt-4 flex-row items-center bg-slate-950/80 px-3 py-1 rounded-full border border-slate-800">
                {!isUnlocked ? (
                  <View className="flex-row items-center">
                    <Ionicons name="lock-closed" size={12} color="#475569" className="mr-1" />
                    <Text className="text-[10px] font-bold text-slate-500 tracking-widest">LOCKED</Text>
                  </View>
                ) : (
                  <View className="flex-row items-center">
                    <Ionicons name="play" size={12} color="#22D3EE" className="mr-1" />
                    <Text className="text-[10px] font-bold text-cyan-400 tracking-widest">ENGAGE</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity 
        onPress={async () => {
          await AsyncStorage.removeItem("maxUnlockedWave");
          setMaxUnlocked(1);
        }}
        className="absolute bottom-8 right-8 px-4 py-2 bg-slate-900/80 rounded-lg border border-rose-900/50 active:bg-slate-800"
      >
         <Text className="text-rose-500/80 font-bold text-xs tracking-wider">RESET PROGRESS</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}
