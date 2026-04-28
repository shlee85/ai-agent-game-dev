import React, { useCallback, useEffect, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { GLView } from "expo-gl";
import { Asset } from "expo-asset";
import { Renderer } from "expo-three";
import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";

interface Phase1ScreenProps {
  onBack: () => void;
}

export function Phase1Screen({ onBack }: Phase1ScreenProps) {
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
    scene.fog = new THREE.Fog(0x020617, 6, 18);

    const camera = new THREE.PerspectiveCamera(
      58,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      100
    );
    camera.position.set(0, 9.5, 8.8);
    camera.lookAt(0, 0, 0);

    const ambientLight = new THREE.AmbientLight(0x67e8f9, 0.65);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.05);
    directionalLight.position.set(4, 10, 3);
    scene.add(directionalLight);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 10),
      new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.92,
        metalness: 0.1,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const grid = new THREE.GridHelper(16, 16, 0x1e293b, 0x111827);
    grid.position.y = 0.01;
    scene.add(grid);

    const pathLine = new THREE.Mesh(
      new THREE.BoxGeometry(8, 0.03, 0.6),
      new THREE.MeshStandardMaterial({
        color: 0x334155,
        emissive: 0x1e293b,
        emissiveIntensity: 0.3,
      })
    );
    pathLine.position.set(0, 0.02, 0);
    scene.add(pathLine);

    // Phase 1 actual model test: GLB model loading
    const towerGroup = new THREE.Group();
    towerGroup.position.set(-2.7, 0.25, 0);
    scene.add(towerGroup);

    const pedestalBottom = new THREE.Mesh(
      new THREE.CylinderGeometry(0.78, 0.92, 0.46, 12),
      new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.8,
        roughness: 0.35,
      })
    );
    pedestalBottom.position.y = -0.02;
    towerGroup.add(pedestalBottom);

    const pedestalTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.58, 0.68, 0.44, 12),
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.75,
        roughness: 0.3,
      })
    );
    pedestalTop.position.y = 0.34;
    towerGroup.add(pedestalTop);

    const coreColumn = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.36, 0.24),
      new THREE.MeshStandardMaterial({
        color: 0x22d3ee,
        emissive: 0x0ea5e9,
        emissiveIntensity: 0.55,
      })
    );
    coreColumn.position.set(0, 0.22, 0.48);
    towerGroup.add(coreColumn);

    const towerBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.44, 0.52, 0.42, 10),
      new THREE.MeshStandardMaterial({
        color: 0x1f2937,
        metalness: 0.65,
        roughness: 0.35,
      })
    );
    towerBase.position.y = 0.2;
    towerGroup.add(towerBase);

    const towerRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.42, 0.04, 8, 24),
      new THREE.MeshStandardMaterial({
        color: 0x67e8f9,
        emissive: 0x0891b2,
        emissiveIntensity: 0.85,
        metalness: 0.15,
        roughness: 0.45,
      })
    );
    towerRing.rotation.x = Math.PI / 2;
    towerRing.position.y = 0.43;
    towerGroup.add(towerRing);

    const towerHead = new THREE.Mesh(
      new THREE.BoxGeometry(0.72, 0.34, 0.58),
      new THREE.MeshStandardMaterial({
        color: 0x334155,
        emissive: 0x334155,
        emissiveIntensity: 0.15,
        metalness: 0.75,
        roughness: 0.28,
      })
    );
    towerHead.position.y = 0.7;
    towerGroup.add(towerHead);

    const sideGlowL = new THREE.Mesh(
      new THREE.BoxGeometry(0.13, 0.16, 0.26),
      new THREE.MeshStandardMaterial({
        color: 0xe879f9,
        emissive: 0xc026d3,
        emissiveIntensity: 0.75,
      })
    );
    sideGlowL.position.set(-0.35, 0.72, 0.06);
    towerGroup.add(sideGlowL);

    const sideGlowR = sideGlowL.clone();
    sideGlowR.position.x = 0.35;
    towerGroup.add(sideGlowR);

    const headPlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.52, 0.14, 0.38),
      new THREE.MeshStandardMaterial({
        color: 0x67e8f9,
        emissive: 0x0891b2,
        emissiveIntensity: 0.5,
      })
    );
    headPlate.position.y = 0.86;
    towerGroup.add(headPlate);

    const muzzleRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.13, 0.03, 8, 20),
      new THREE.MeshStandardMaterial({
        color: 0xa5f3fc,
        emissive: 0x22d3ee,
        emissiveIntensity: 0.9,
      })
    );
    muzzleRing.rotation.x = Math.PI / 2;
    muzzleRing.position.set(0, 0.7, 1.42);
    towerGroup.add(muzzleRing);

    const barrel = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.16, 1.42),
      new THREE.MeshStandardMaterial({
        color: 0x67e8f9,
        emissive: 0x0ea5e9,
        emissiveIntensity: 0.8,
      })
    );
    barrel.position.set(0, 0.72, 0.95);
    towerGroup.add(barrel);

    // Phase1: Khronos PBR 샘플 "DamagedHelmet" — 본게임 아군 유닛이 아니라 GLB 텍스처 파이프라인 검증용.
    // SF 타워/유닛 실사급 모델은 추후 `assets/3d`에 교체 예정 (`Character.md` 방향과 맞출 것).
    const modelAsset = Asset.fromModule(require("../../assets/3d/models/DamagedHelmet.glb"));
    await modelAsset.downloadAsync();
    const modelUri = modelAsset.localUri || modelAsset.uri;
    if (modelUri) {
      try {
        const gltfLoader = new GLTFLoader();
        const gltf = await gltfLoader.loadAsync(modelUri);
        const towerModel = gltf.scene;
        towerModel.scale.set(1.55, 1.55, 1.55);
        towerModel.position.set(0, 0.35, 0);
        towerModel.rotation.set(0, Math.PI, 0);
        towerGroup.add(towerModel);
      } catch (error) {
        console.error("Phase1 model load failed:", error);
      }
    }

    // Phase 1: runner enemy (game-like drone silhouette)
    const runnerGroup = new THREE.Group();
    scene.add(runnerGroup);

    const runnerBody = new THREE.Mesh(
      new THREE.ConeGeometry(0.24, 0.62, 7),
      new THREE.MeshStandardMaterial({
        color: 0xf43f5e,
        emissive: 0xbe123c,
        emissiveIntensity: 0.45,
        metalness: 0.35,
        roughness: 0.35,
      })
    );
    runnerBody.rotation.z = Math.PI / 2;
    runnerGroup.add(runnerBody);

    const runnerTop = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.08, 0.28),
      new THREE.MeshStandardMaterial({
        color: 0xfb7185,
        emissive: 0xbe123c,
        emissiveIntensity: 0.25,
      })
    );
    runnerTop.position.set(0.04, 0.14, 0);
    runnerGroup.add(runnerTop);

    const runnerWingL = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.03, 0.16),
      new THREE.MeshStandardMaterial({ color: 0x9f1239, emissive: 0x881337, emissiveIntensity: 0.3 })
    );
    runnerWingL.position.set(-0.04, 0, -0.21);
    runnerGroup.add(runnerWingL);

    const runnerWingR = runnerWingL.clone();
    runnerWingR.position.z = 0.21;
    runnerGroup.add(runnerWingR);

    const runnerEye = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0xfda4af })
    );
    runnerEye.position.set(0.27, 0.02, 0);
    runnerGroup.add(runnerEye);

    runnerGroup.position.set(2.8, 0.34, 0);

    const beamCore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.028, 0.028, 1, 10),
      new THREE.MeshBasicMaterial({ color: 0xa5f3fc })
    );
    beamCore.visible = false;
    scene.add(beamCore);

    const beamOuter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 1, 10),
      new THREE.MeshBasicMaterial({ color: 0xeab308 })
    );
    beamOuter.visible = false;
    scene.add(beamOuter);

    const muzzleFlash = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xa5f3fc })
    );
    muzzleFlash.visible = false;
    scene.add(muzzleFlash);

    let lastTime = Date.now();
    let enemyDir = -1;
    let attackCooldown = 0;
    let beamTimer = 0;
    const shotStart = new THREE.Vector3();
    const shotEnd = new THREE.Vector3();
    const shotDir = new THREE.Vector3();
    const shotMid = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);

    const render = () => {
      const now = Date.now();
      const dt = Math.min(0.033, (now - lastTime) / 1000);
      lastTime = now;

      // runner movement (left <-> right path)
      runnerGroup.position.x += enemyDir * dt * 2.2;
      if (runnerGroup.position.x < -2.8) enemyDir = 1;
      if (runnerGroup.position.x > 2.8) enemyDir = -1;
      runnerGroup.position.y = 0.34 + Math.sin(now / 110) * 0.03;
      runnerGroup.rotation.y = enemyDir > 0 ? Math.PI / 2 : -Math.PI / 2;

      // tower tracks runner
      towerHead.lookAt(runnerGroup.position.x, towerHead.position.y, runnerGroup.position.z);
      barrel.lookAt(runnerGroup.position.x, barrel.position.y, runnerGroup.position.z);
      towerRing.rotation.z += dt * 0.9;

      // fire loop every 1.1s
      attackCooldown -= dt;
      if (attackCooldown <= 0) {
        attackCooldown = 1.1;
        beamTimer = 0.12;
        beamCore.visible = true;
        beamOuter.visible = true;
        muzzleFlash.visible = true;
        shotStart.set(towerGroup.position.x, 0.72, towerGroup.position.z + 1.5);
        shotEnd.set(runnerGroup.position.x, runnerGroup.position.y, runnerGroup.position.z);
        muzzleFlash.position.copy(shotStart);
      }

      if (beamTimer > 0) {
        beamTimer -= dt;
        shotDir.subVectors(shotEnd, shotStart);
        const length = Math.max(0.001, shotDir.length());
        shotMid.copy(shotStart).addScaledVector(shotDir, 0.5);
        beamCore.position.copy(shotMid);
        beamOuter.position.copy(shotMid);
        beamCore.scale.set(1, length, 1);
        beamOuter.scale.set(1, length, 1);
        shotDir.normalize();
        beamCore.quaternion.setFromUnitVectors(up, shotDir);
        beamOuter.quaternion.copy(beamCore.quaternion);
        (beamOuter.material as THREE.MeshBasicMaterial).opacity = 0.32 + Math.sin(now / 45) * 0.08;
        (beamOuter.material as THREE.MeshBasicMaterial).transparent = true;

        if (beamTimer <= 0) {
          beamCore.visible = false;
          beamOuter.visible = false;
          muzzleFlash.visible = false;
          // brief runner hit flash
          const mat = runnerBody.material as THREE.MeshStandardMaterial;
          mat.emissiveIntensity = 0.9;
          setTimeout(() => {
            mat.emissiveIntensity = 0.45;
          }, 90);
        }
      }

      // recoil feel
      const recoilKick = beamTimer > 0 ? beamTimer * 1.8 : 0;
      barrel.position.z = 0.95 - recoilKick * 0.12;
      muzzleRing.position.z = 1.42 - recoilKick * 0.12;

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

      <View className="absolute top-4 right-4 z-20 rounded-lg border border-fuchsia-700/70 bg-slate-900/90 px-3 py-2">
        <Text className="text-xs font-black tracking-wider text-fuchsia-300">PHASE 1 3D PROXY</Text>
      </View>

      <GLView className="flex-1" onContextCreate={handleContextCreate} />
    </View>
  );
}
