import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
import type { AudioPlayer } from "expo-audio";

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
  | "bgm_wave1"
  | "bgm_wave2";

const SOUND_ASSETS: Record<SoundKey, ReturnType<typeof require>> = {
  sfx_attack_sniper: require("../../assets/sounds/sfx_attack_sniper.wav"),
  sfx_attack_aoe:    require("../../assets/sounds/sfx_attack_aoe.wav"),
  sfx_attack_slow:   require("../../assets/sounds/sfx_attack_slow.wav"),
  sfx_attack_chain:  require("../../assets/sounds/sfx_attack_chain.wav"),
  sfx_wave_clear:    require("../../assets/sounds/sfx_wave_clear.wav"),
  sfx_game_over:     require("../../assets/sounds/sfx_game_over.wav"),
  sfx_item_use:      require("../../assets/sounds/sfx_item_use.wav"),
  sfx_enemy_leak:    require("../../assets/sounds/sfx_enemy_leak.wav"),
  bgm_lobby:  require("../../assets/music/The_Sovereign_Gate.mp3"),
  bgm_wave1:  require("../../assets/music/Iron_Perimeter.mp3"),
  bgm_wave2:  require("../../assets/music/Siege_of_the_Iron_Moon.mp3"),
};

class SoundManager {
  private sfxCache: Partial<Record<SoundKey, AudioPlayer>> = {};
  private bgmPlayer: AudioPlayer | null = null;
  private currentBgmKey: SoundKey | null = null;
  private sfxCooldowns: Partial<Record<SoundKey, number>> = {};

  async init() {
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
    });
  }

  // SFX: 캐시에서 로드해서 즉시 재생 (쿨타임으로 중복 방지)
  async playSfx(key: SoundKey, volume = 0.8, cooldownMs = 80) {
    const now = Date.now();
    const last = this.sfxCooldowns[key] ?? 0;
    if (now - last < cooldownMs) return;
    this.sfxCooldowns[key] = now;

    try {
      let player = this.sfxCache[key];
      if (!player) {
        player = createAudioPlayer(SOUND_ASSETS[key]);
        this.sfxCache[key] = player;
      }
      await player.seekTo(0);
      player.volume = volume;
      player.play();
    } catch (_) {}
  }

  // BGM: 루핑 재생
  async playBgm(key: SoundKey, volume = 0.4) {
    if (this.currentBgmKey === key) return;
    this.stopBgm();
    try {
      const player = createAudioPlayer(SOUND_ASSETS[key]);
      player.loop = true;
      player.volume = volume;
      player.play();
      this.bgmPlayer = player;
      this.currentBgmKey = key;
    } catch (_) {}
  }

  stopBgm() {
    if (this.bgmPlayer) {
      try {
        this.bgmPlayer.pause();
        this.bgmPlayer.remove();
      } catch (_) {}
      this.bgmPlayer = null;
      this.currentBgmKey = null;
    }
  }

  setBgmVolume(volume: number) {
    try {
      if (this.bgmPlayer) this.bgmPlayer.volume = volume;
    } catch (_) {}
  }

  // 화면 전환 시 SFX 캐시 해제
  unloadSfx() {
    for (const player of Object.values(this.sfxCache)) {
      try { player?.remove(); } catch (_) {}
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
