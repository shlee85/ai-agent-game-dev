import { ImageSourcePropType } from "react-native";

export const TOWER_ASSETS: Record<string, ImageSourcePropType> = {
  sniper: require("../../assets/units/towers/tower_sniper.png"),
  aoe: require("../../assets/units/towers/tower_aoe.png"),
  slow: require("../../assets/units/towers/tower_slow.png"),
  chain: require("../../assets/units/towers/tower_chain.png"),
};

// 레벨별 이미지가 있는 타워 (없으면 TOWER_ASSETS 기본 이미지 사용)
export const TOWER_ASSETS_BY_LEVEL: Record<string, Record<number, ImageSourcePropType>> = {
  sniper: {
    1: require("../../assets/image_lance.png"),
    2: require("../../assets/image_lance2.png"),
    3: require("../../assets/image_lance3.png"),
  },
  aoe: {
    1: require("../../assets/nova_canon1.png"),
    2: require("../../assets/nova_canon2.png"),
    3: require("../../assets/nova_canon3.png"),
  },
  slow: {
    1: require("../../assets/CryoField1.png"),
    2: require("../../assets/CryoField2.png"),
    3: require("../../assets/CryoField3.png"),
  },
};

export function getTowerImage(towerType: string, level: number): ImageSourcePropType {
  const levelMap = TOWER_ASSETS_BY_LEVEL[towerType];
  if (levelMap) {
    return levelMap[level] ?? levelMap[1] ?? TOWER_ASSETS[towerType];
  }
  return TOWER_ASSETS[towerType];
}
