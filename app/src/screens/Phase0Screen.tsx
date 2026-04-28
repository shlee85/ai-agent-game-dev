import React, { useCallback, useEffect, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";

interface Phase0ScreenProps {
  onBack: () => void;
}

export function Phase0Screen({ onBack }: Phase0ScreenProps) {
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, []);

  const handleContextCreate = useCallback(async (gl: WebGLRenderingContext & { endFrameEXP: () => void }) => {
    const renderer = new Renderer({ gl }) as unknown as {
      setSize: (width: number, height: number) => void;
      setClearColor: (color: number) => void;
      render: (scene: THREE.Scene, camera: THREE.Camera) => void;
    };
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setClearColor(0x020617);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      65,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.8, 3.3);
    camera.lookAt(0, 0, 0);

    const ambientLight = new THREE.AmbientLight(0x6ee7ff, 0.55);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(2, 3, 2);
    scene.add(directionalLight);
    scene.add(new THREE.HemisphereLight(0x67e8f9, 0x020617, 0.5));

    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      metalness: 0.5,
      roughness: 0.35,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.22,
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cube);

    const baseGeometry = new THREE.CircleGeometry(1.9, 48);
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x111827,
      metalness: 0.2,
      roughness: 0.8,
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.rotation.x = -Math.PI / 2;
    base.position.y = -0.85;
    scene.add(base);

    const grid = new THREE.GridHelper(6, 12, 0x155e75, 0x1e293b);
    grid.position.y = -0.84;
    scene.add(grid);

    let lastTime = Date.now();
    const render = () => {
      const now = Date.now();
      const dt = Math.min(0.033, (now - lastTime) / 1000);
      lastTime = now;

      cube.rotation.x += dt * 0.75;
      cube.rotation.y += dt * 1.1;
      cube.position.y = Math.sin(now / 450) * 0.08;

      renderer.render(scene, camera);
      gl.endFrameEXP();
      frameRef.current = requestAnimationFrame(render);
    };

    render();
  }, []);

  return (
    <View className="flex-1 bg-slate-950">
      <View className="absolute top-4 left-4 z-20 flex-row gap-2">
        <Pressable
          onPress={() => {
            if (frameRef.current !== null) {
              cancelAnimationFrame(frameRef.current);
              frameRef.current = null;
            }
            onBack();
          }}
          className="rounded-lg border border-cyan-700 bg-slate-900/90 px-4 py-2"
        >
          <Text className="font-bold text-cyan-300">BACK</Text>
        </Pressable>
      </View>

      <View className="absolute top-4 right-4 z-20 rounded-lg border border-cyan-700 bg-slate-900/90 px-3 py-2">
        <Text className="text-xs font-black tracking-wider text-cyan-300">PHASE 0 3D TEST</Text>
      </View>

      <GLView className="flex-1" onContextCreate={handleContextCreate} />
    </View>
  );
}
