import React from "react";
import { View, Text, Pressable } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { TOWER_CONFIG } from "../data/towers";
import { getTowerRoleLabel, getTowerRoleTag } from "../data/visualTheme";

interface BuildMenuProps {
  gold: number;
  onBuild: (towerId: string, cost: number) => void;
  onClose: () => void;
}

export const TOWER_OPTIONS = Object.values(TOWER_CONFIG);

export function BuildMenu({ gold, onBuild, onClose }: BuildMenuProps) {
  return (
    <View className="w-full items-center" pointerEvents="box-none">
      <View className="w-11/12 max-w-lg rounded-2xl border border-slate-700 bg-slate-900/95 p-4 shadow-lg flex-row items-center justify-between">
        <View className="flex-row gap-3">
          {TOWER_OPTIONS.map((tower) => {
            const canAfford = gold >= tower.cost;
            return (
              <Pressable
                key={tower.id}
                onPress={() => {
                  if (canAfford) {
                    onBuild(tower.id, tower.cost);
                  }
                }}
                className={`items-center justify-center rounded-xl border p-2 w-24 ${
                  canAfford ? "border-slate-600 bg-slate-800 active:bg-slate-700" : "border-slate-800 bg-slate-900 opacity-50"
                }`}
              >
                <View
                  style={{ backgroundColor: tower.color }}
                  className="mb-2 h-8 w-8 items-center justify-center rounded-full border border-slate-500"
                >
                  <Text className="text-[9px] font-black text-slate-950">{getTowerRoleTag(tower.id)}</Text>
                </View>
                <Text className="text-xs font-semibold text-slate-300 text-center" numberOfLines={1}>{tower.name}</Text>
                <Text className="text-[9px] font-black tracking-wider text-cyan-300/90">
                  {getTowerRoleTag(tower.id)} · {getTowerRoleLabel(tower.id)}
                </Text>
                <View className="flex-row items-center mt-1">
                  <FontAwesome5 name="coins" size={8} color={canAfford ? "#FBBF24" : "#F87171"} className="mr-1" />
                  <Text className={`text-xs font-bold ${canAfford ? "text-yellow-400" : "text-red-400"}`}>
                    {tower.cost}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
        <Pressable onPress={onClose} className="p-3 bg-slate-800 rounded-full border border-slate-600">
          <Text className="text-slate-300 font-bold">X</Text>
        </Pressable>
      </View>
    </View>
  );
}
