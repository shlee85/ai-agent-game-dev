import { ImageSourcePropType } from "react-native";

export const PROJECTILE_ASSETS: Record<string, ImageSourcePropType> = {
  sniper: require("../../assets/proj_sniper.png"),
  aoe:    require("../../assets/proj_cannon.png"),
  slow:   require("../../assets/proj_cryo.png"),
  chain:  require("../../assets/proj_volt.png"),
};
