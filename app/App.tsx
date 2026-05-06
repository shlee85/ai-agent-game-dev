import "./global.css";
import React, { useEffect, useState, useRef } from "react";
import { StatusBar, View } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import * as NavigationBar from "expo-navigation-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { WaveScreen } from "./src/screens/WaveScreen";
import { LobbyScreen } from "./src/screens/LobbyScreen";
import { Phase0Screen } from "./src/screens/Phase0Screen";
import { Phase1Screen } from "./src/screens/Phase1Screen";
import { ShopScreen } from "./src/screens/ShopScreen";
import { Difficulty } from "./src/data/difficulty";
import { DEFAULT_ITEM_INVENTORY, MAX_ITEM_INVENTORY, SHOP_BUY_COOLDOWN_MS } from "./src/data/shop";
import { WaveId } from "./src/data/waves";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<"lobby" | "wave" | "phase0" | "phase1" | "shop">("lobby");
  const [selectedWave, setSelectedWave] = useState<WaveId>(1);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("normal");
  const [resetKey, setResetKey] = useState<number>(0);
  const [diamond, setDiamond] = useState<number>(20);
  const [itemInventory, setItemInventory] = useState<Record<string, number>>(DEFAULT_ITEM_INVENTORY);
  const [adminEnabled, setAdminEnabled] = useState<boolean>(false);
  const adminPrevDiamondRef = useRef<number | null>(null);
  const lastShopBuyAtRef = useRef<number>(0);

  const toggleAdminMode = () => {
    if (!adminEnabled) {
      adminPrevDiamondRef.current = diamond;
      setAdminEnabled(true);
      setDiamond(1000);
      return;
    }

    setAdminEnabled(false);
    if (adminPrevDiamondRef.current != null) {
      setDiamond(adminPrevDiamondRef.current);
      adminPrevDiamondRef.current = null;
    }
  };

  const handleAdminResetDifficultyProgress = async (difficulty: Difficulty) => {
    try {
      await AsyncStorage.removeItem(`maxUnlockedWave_${difficulty}`);
    } catch (e) {
      console.error("Failed to reset difficulty progress", e);
    }
  };

  const handleAdminAddItems = (amount: number) => {
    if (amount <= 0) return;
    setItemInventory((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((itemId) => {
        next[itemId] = (next[itemId] || 0) + amount;
      });
      return next;
    });
  };

  useEffect(() => {
    async function lockOrientation() {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }
    async function hideNavigationBar() {
      await NavigationBar.setVisibilityAsync("hidden");
      await NavigationBar.setBehaviorAsync("overlay-swipe");
    }
    lockOrientation();
    hideNavigationBar();
  }, []);

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const savedDiamond = await AsyncStorage.getItem("metaDiamond");
        const savedInventory = await AsyncStorage.getItem("metaItemInventory");
        if (savedDiamond != null) {
          setDiamond(Number(savedDiamond));
        }
        if (savedInventory) {
          setItemInventory({ ...DEFAULT_ITEM_INVENTORY, ...JSON.parse(savedInventory) });
        }
      } catch (e) {
        console.error("Failed to load meta shop state", e);
      }
    };
    loadMeta();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("metaDiamond", String(diamond)).catch(() => {});
  }, [diamond]);

  useEffect(() => {
    AsyncStorage.setItem("metaItemInventory", JSON.stringify(itemInventory)).catch(() => {});
  }, [itemInventory]);

  const handleBuyShopItem = (itemId: string, price: number) => {
    const now = Date.now();
    if (now - lastShopBuyAtRef.current < SHOP_BUY_COOLDOWN_MS) return;
    if ((itemInventory[itemId] || 0) >= MAX_ITEM_INVENTORY) return;
    if (diamond < price) return;
    lastShopBuyAtRef.current = now;
    setDiamond((prev) => prev - price);
    setItemInventory((prev) => ({
      ...prev,
      [itemId]: Math.min(MAX_ITEM_INVENTORY, (prev[itemId] || 0) + 1),
    }));
  };

  const handleConsumeItem = (itemId: string) => {
    if ((itemInventory[itemId] || 0) <= 0) return false;
    setItemInventory((prev) => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) - 1),
    }));
    return true;
  };

  const handleWaveClearReward = (rewardDiamond: number) => {
    if (rewardDiamond <= 0) return;
    setDiamond((prev) => prev + rewardDiamond);
  };

  return (
    <View className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" hidden={true} />
      {currentScreen === "lobby" ? (
        <LobbyScreen 
          initialDifficulty={selectedDifficulty}
          onOpenShop={() => setCurrentScreen("shop")}
          adminEnabled={adminEnabled}
          onToggleAdmin={toggleAdminMode}
          onAdminResetDifficultyProgress={handleAdminResetDifficultyProgress}
          onAdminAddItems={handleAdminAddItems}
          onSelectWave={(wave, difficulty) => {
            setSelectedWave(wave);
            setSelectedDifficulty(difficulty);
            setCurrentScreen("wave");
          }} 
        />
      ) : currentScreen === "wave" ? (
        <WaveScreen 
          key={`${selectedWave}-${resetKey}`}
          waveId={selectedWave}
          difficultyLevel={selectedDifficulty}
          diamond={diamond}
          itemInventory={itemInventory}
          onConsumeItem={handleConsumeItem}
          onWaveClearReward={handleWaveClearReward}
          onBackToLobby={() => setCurrentScreen("lobby")}
          initialGoldOverride={adminEnabled ? 1000 : undefined}
          onNextWave={() => {
            if (selectedWave < 15) setSelectedWave((selectedWave + 1) as WaveId);
          }}
          onRestartWave={() => setResetKey((prev) => prev + 1)}
        />
      ) : currentScreen === "shop" ? (
        <ShopScreen
          diamond={diamond}
          inventory={itemInventory}
          onBuy={handleBuyShopItem}
          onBack={() => setCurrentScreen("lobby")}
        />
      ) : currentScreen === "phase0" ? (
        <Phase0Screen onBack={() => setCurrentScreen("lobby")} />
      ) : (
        <Phase1Screen onBack={() => setCurrentScreen("lobby")} />
      )}
    </View>
  );
}
