import { ImageSourcePropType } from "react-native";

export const BACKGROUND_ASSETS: Record<string, ImageSourcePropType> = {
  spaceship: require("../../assets/backgrounds/bg_spaceship.png"),
  base: require("../../assets/backgrounds/bg_base.png"),
  planet: require("../../assets/backgrounds/bg_planet.png"),
};

export function getWaveBackground(waveId: number): ImageSourcePropType {
  if (waveId <= 7) return BACKGROUND_ASSETS.spaceship;
  if (waveId <= 14) return BACKGROUND_ASSETS.base;
  return BACKGROUND_ASSETS.planet;
}
