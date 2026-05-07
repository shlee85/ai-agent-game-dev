import React, { useEffect, useRef } from "react";
import { View, Text, Image, Animated, ImageBackground } from "react-native";

const MESSAGES = [
  "INITIALIZING CORE SYSTEMS...",
  "LOADING DEFENSE GRID...",
  "CALIBRATING PULSE LANCER...",
  "SYNCING SENTINEL NETWORK...",
  "STAND BY FOR DEPLOYMENT...",
];

export function LoadingScreen() {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scanAnim = useRef(new Animated.Value(0)).current;
  const [msgIndex, setMsgIndex] = React.useState(0);

  useEffect(() => {
    // 페이드인
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // 프로그레스 바 애니메이션
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2200,
      useNativeDriver: false,
    }).start();

    // 스캔 라인 반복
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();

    // 메시지 순환
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const scanTranslateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-8, 8],
  });

  return (
    <Animated.View style={{ flex: 1, opacity: opacityAnim }}>
      <ImageBackground
        source={require("../../assets/bg.png")}
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        imageStyle={{ opacity: 0.45 }}
      >
        {/* 스캔 라인 오버레이 */}
        <Animated.View
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            overflow: "hidden",
            transform: [{ translateY: scanTranslateY }],
          }}
          pointerEvents="none"
        >
          {Array.from({ length: 60 }).map((_, i) => (
            <View
              key={i}
              style={{
                height: 1,
                backgroundColor: "rgba(6,182,212,0.04)",
                marginBottom: 5,
              }}
            />
          ))}
        </Animated.View>

        {/* 로고 */}
        <Image
          source={require("../../assets/logo.png")}
          style={{
            width: 100,
            height: 100,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: "rgba(6,182,212,0.6)",
            marginBottom: 24,
          }}
        />

        {/* 타이틀 */}
        <Text
          style={{
            fontSize: 28,
            fontWeight: "900",
            color: "#22D3EE",
            letterSpacing: 6,
            textShadowColor: "rgba(6,182,212,0.9)",
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 18,
            marginBottom: 4,
          }}
        >
          SENTINEL PROTOCOL
        </Text>
        <Text
          style={{
            fontSize: 10,
            fontWeight: "700",
            color: "#A78BFA",
            letterSpacing: 5,
            marginBottom: 48,
          }}
        >
          DEFEND THE SPACE UNION
        </Text>

        {/* 프로그레스 바 */}
        <View
          style={{
            width: 260,
            height: 4,
            backgroundColor: "rgba(30,41,59,0.9)",
            borderRadius: 4,
            overflow: "hidden",
            marginBottom: 12,
            borderWidth: 1,
            borderColor: "rgba(6,182,212,0.2)",
          }}
        >
          <Animated.View
            style={{
              height: "100%",
              width: progressWidth,
              backgroundColor: "#06B6D4",
              borderRadius: 4,
              shadowColor: "#06B6D4",
              shadowOpacity: 0.9,
              shadowRadius: 8,
            }}
          />
        </View>

        {/* 로딩 메시지 */}
        <Text
          style={{
            fontSize: 9,
            fontWeight: "700",
            color: "rgba(6,182,212,0.7)",
            letterSpacing: 2,
          }}
        >
          {MESSAGES[msgIndex]}
        </Text>
      </ImageBackground>
    </Animated.View>
  );
}
