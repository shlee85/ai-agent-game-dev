import React from "react";
import { View, Text, Pressable } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { ITEM_CONFIG, ItemStats } from "../data/items";

interface ItemShopProps {
  diamond: number;
  onUseItem: (item: ItemStats) => void;
  activeItemType: string | null; // 타겟팅 모드 활성화 중인 아이템 (bomb 등)
}

export function ItemShop({ diamond, onUseItem, activeItemType }: ItemShopProps) {
  const items = Object.values(ITEM_CONFIG);

  return (
    <View className="absolute left-4 top-1/2 -translate-y-1/2 items-center gap-3 z-50 bg-slate-900/80 p-2 rounded-2xl border border-slate-700" pointerEvents="box-none">
      <Text className="text-[10px] font-bold text-slate-400 mb-1">SKILLS</Text>
      {items.map((item) => {
        const canAfford = diamond >= item.cost;
        const isActive = activeItemType === item.id;

        return (
          <Pressable
            key={item.id}
            onPress={() => {
              if (canAfford || isActive) { // 이미 활성화된 상태라면 취소하기 위해 선택 가능하게 함
                onUseItem(item);
              }
            }}
            className={`w-14 h-14 rounded-xl border-2 items-center justify-center relative ${
              isActive 
                ? "border-amber-400 bg-amber-900/50" 
                : canAfford
                  ? "border-slate-600 bg-slate-800 active:bg-slate-700"
                  : "border-slate-800 bg-slate-900/50 opacity-50"
            }`}
            pointerEvents="auto"
          >
            <View 
              style={{ backgroundColor: item.color }} 
              className={`w-6 h-6 rounded-md mb-1 ${isActive ? "opacity-50" : ""}`} 
            />
            
            {/* 비용 표시 */}
            <View className="absolute bottom-[-6px] bg-slate-900 px-1.5 py-0.5 rounded-full border border-slate-700 flex-row items-center justify-center">
              <FontAwesome5 name="gem" size={8} color={canAfford ? "#67E8F9" : "#F87171"} className="mr-0.5" />
              <Text className={`text-[9px] font-bold ${canAfford ? "text-cyan-300" : "text-red-400"}`}>
                {item.cost}
              </Text>
            </View>

            {isActive && (
              <View className="absolute inset-0 bg-white/20 rounded-xl" pointerEvents="none" />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
