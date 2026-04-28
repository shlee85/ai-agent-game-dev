const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// 3D 모델/바이너리 에셋을 require()로 안전하게 번들
config.resolver.assetExts.push("glb", "gltf", "bin");

module.exports = withNativeWind(config, { input: "./global.css" });
