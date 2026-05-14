import { ImageSourcePropType } from "react-native";

export const ENEMY_ASSETS: Record<string, ImageSourcePropType> = {
  runner: require("../../assets/RunnerDrone.png"),
  guard: require("../../assets/GuardShell.png"),
  phantom: require("../../assets/PhantomCrawler.png"),
  golem: require("../../assets/SiegeGolem.png"),
};
