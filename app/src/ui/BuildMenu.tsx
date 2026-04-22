import React from "react";
import { View, Text, Pressable } from "react-native";
import { TOWER_CONFIG } from "../data/towers";

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
                <View style={{ backgroundColor: tower.color }} className="w-8 h-8 mb-2 rounded-full border border-slate-500" />
                <Text className="text-xs font-semibold text-slate-300 text-center" numberOfLines={1}>{tower.name}</Text>
                <Text className={`text-xs font-bold mt-1 ${canAfford ? "text-yellow-400" : "text-red-400"}`}>
                  {tower.cost}G
                </Text>
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
