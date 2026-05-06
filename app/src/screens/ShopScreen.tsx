import React from "react";
import { View, Text, TouchableOpacity, ImageBackground, Image } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

import { MAX_ITEM_INVENTORY, SHOP_ITEMS } from "../data/shop";
import { ITEM_ASSETS } from "../data/itemAssets";

interface ShopScreenProps {
  diamond: number;
  inventory: Record<string, number>;
  onBuy: (itemId: string, price: number) => void;
  onBack: () => void;
}

export function ShopScreen({ diamond, inventory, onBuy, onBack }: ShopScreenProps) {
  return (
    <ImageBackground
      source={require("../../assets/bg.png")}
      className="flex-1 items-center justify-center bg-slate-950"
      imageStyle={{ opacity: 0.55 }}
    >
      <View className="absolute left-4 top-4 z-20">
        <TouchableOpacity
          onPress={onBack}
          className="rounded-lg border border-cyan-700 bg-slate-900/90 px-4 py-2 active:bg-slate-800"
        >
          <Text className="font-bold text-cyan-300">BACK</Text>
        </TouchableOpacity>
      </View>

      <View className="mb-4 rounded-full border border-cyan-700/60 bg-slate-900/90 px-5 py-2">
        <View className="flex-row items-center">
          <FontAwesome5 name="gem" size={13} color="#67E8F9" />
          <Text className="ml-2 font-black text-cyan-300">DIAMOND {diamond}</Text>
        </View>
      </View>

      <View className="w-11/12 max-w-2xl rounded-2xl border border-slate-700 bg-slate-900/90 p-4">
        <Text className="mb-3 text-center text-xl font-black tracking-widest text-cyan-300">SHOP</Text>

        <View className="gap-3">
          {SHOP_ITEMS.map((item) => {
            const canBuyByDiamond = diamond >= item.price;
            const count = inventory[item.targetItemId] || 0;
            const isFull = count >= MAX_ITEM_INVENTORY;
            const canBuy = canBuyByDiamond && !isFull;

            return (
              <View
                key={item.id}
                className="flex-row items-center justify-between rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-3"
              >
                <View className="flex-row items-center gap-3">
                  <Image source={ITEM_ASSETS[item.targetItemId]} style={{ width: 30, height: 30 }} resizeMode="contain" />
                  <View>
                  <Text className="font-black text-slate-100">{item.label}</Text>
                  <Text className="text-xs font-bold text-slate-400">
                    보유 수량: {count}/{MAX_ITEM_INVENTORY}
                  </Text>
                  </View>
                </View>

                <TouchableOpacity
                  disabled={!canBuy}
                  onPress={() => onBuy(item.targetItemId, item.price)}
                  className={`rounded-lg border px-3 py-2 ${canBuy ? "border-cyan-600 bg-cyan-900/40 active:bg-cyan-800/60" : "border-slate-700 bg-slate-900 opacity-50"}`}
                >
                  <View className="flex-row items-center">
                    <FontAwesome5 name="gem" size={10} color={canBuy ? "#67E8F9" : "#64748B"} />
                    <Text className={`ml-2 text-xs font-black ${canBuy ? "text-cyan-300" : "text-slate-500"}`}>
                      {item.price}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
    </ImageBackground>
  );
}
