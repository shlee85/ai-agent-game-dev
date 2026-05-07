import { Audio } from "expo-av";

type SoundKey =
  | "sfx_attack_sniper"
  | "sfx_attack_aoe"
  | "sfx_attack_slow"
  | "sfx_attack_chain"
  | "sfx_wave_clear"
  | "sfx_game_over"
  | "sfx_item_use"
  | "sfx_enemy_leak"
  | "bgm_lobby"
  | "bgm_wave";

const SOUND_ASSETS: Record<SoundKey, ReturnType<typeof require>> = {
  sfx_attack_sniper: require("../../assets/sounds/sfx_attack_sniper.wav"),
  sfx_attack_aoe:    require("../../assets/sounds/sfx_attack_aoe.wav"),
  sfx_attack_slow:   require("../../assets/sounds/sfx_attack_slow.wav"),
  sfx_attack_chain:  require("../../assets/sounds/sfx_attack_chain.wav"),
  sfx_wave_clear:    require("../../assets/sounds/sfx_wave_clear.wav"),
  sfx_game_over:     require("../../assets/sounds/sfx_game_over.wav"),
  sfx_item_use:      require("../../assets/sounds/sfx_item_use.wav"),
  sfx_enemy_leak:    require("../../assets/sounds/sfx_enemy_leak.wav"),
  bgm_lobby:         require("../../assets/sounds/bgm_lobby.wav"),
  bgm_wave:          require("../../assets/sounds/bgm_wave.wav"),
};

class SoundManager {
  private sfxCache: Partial<Record<SoundKey, Audio.Sound>> = {};
  private bgmSound: Audio.Sound | null = null;
  private currentBgmKey: SoundKey | null = null;
  private sfxCooldowns: Partial<Record<SoundKey, number>> = {};

  async init() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
  }

  // SFX: 캐시에서 로드해서 즉시 재생 (쿨타임으로 중복 방지)
  async playSfx(key: SoundKey, volume = 0.8, cooldownMs = 80) {
    const now = Date.now();
    const last = this.sfxCooldowns[key] ?? 0;
    if (now - last < cooldownMs) return;
    this.sfxCooldowns[key] = now;

    try {
      let sound = this.sfxCache[key];
      if (!sound) {
        const { sound: loaded } = await Audio.Sound.createAsync(SOUND_ASSETS[key], {
          volume,
          shouldPlay: false,
        });
        this.sfxCache[key] = loaded;
        sound = loaded;
      }
      await sound.setPositionAsync(0);
      await sound.setVolumeAsync(volume);
      await sound.playAsync();
    } catch (_) {}
  }

  // BGM: 루핑 재생
  async playBgm(key: SoundKey, volume = 0.4) {
    if (this.currentBgmKey === key) return;
    await this.stopBgm();
    try {
      const { sound } = await Audio.Sound.createAsync(SOUND_ASSETS[key], {
        isLooping: true,
        volume,
        shouldPlay: true,
      });
      this.bgmSound = sound;
      this.currentBgmKey = key;
    } catch (_) {}
  }

  async stopBgm() {
    if (this.bgmSound) {
      try {
        await this.bgmSound.stopAsync();
        await this.bgmSound.unloadAsync();
      } catch (_) {}
      this.bgmSound = null;
      this.currentBgmKey = null;
    }
  }

  async setBgmVolume(volume: number) {
    try {
      await this.bgmSound?.setVolumeAsync(volume);
    } catch (_) {}
  }

  // 화면 전환 시 SFX 캐시 해제
  async unloadSfx() {
    for (const sound of Object.values(this.sfxCache)) {
      try { await sound?.unloadAsync(); } catch (_) {}
    }
    this.sfxCache = {};
    this.sfxCooldowns = {};
  }

  // 타워 ID로 SFX 키 매핑
  getTowerSfxKey(towerId: string): SoundKey {
    const map: Record<string, SoundKey> = {
      sniper: "sfx_attack_sniper",
      aoe:    "sfx_attack_aoe",
      slow:   "sfx_attack_slow",
      chain:  "sfx_attack_chain",
    };
    return map[towerId] ?? "sfx_attack_sniper";
  }
}

export const soundManager = new SoundManager();
