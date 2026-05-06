import { ImageSourcePropType } from "react-native";

export const ITEM_ASSETS: Record<string, ImageSourcePropType> = {
  bomb: require("../../assets/items/item_partial_attack.png"),
  global_bomb: require("../../assets/items/item_global_attack.png"),
  freeze: require("../../assets/items/item_slow.png"),
  heart_boost: require("../../assets/items/item_heart_boost.png"),
};
