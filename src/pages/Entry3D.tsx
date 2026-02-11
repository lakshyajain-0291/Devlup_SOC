import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {  Environment } from "@react-three/drei";

import * as THREE from "three";


/* ---------- Room Model ---------- */
function Room({ onEnter }: { onEnter: (mesh: THREE.Mesh | null) => void }) {
  const { scene } = useGLTF("/model.glb");
  const monitorRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.name === "Monitor") {
          monitorRef.current = child;
        }
      }
    });
  }, [scene]);

  return (
    <primitive
      object={scene}
      onPointerDown={(e) => {
        e.stopPropagation();

        let obj: THREE.Object3D | null = e.object;
        while (obj) {
          if (obj.name === "Monitor") {
            onEnter(monitorRef.current);
            break;
          }
          obj = obj.parent;
        }
      }}
    />
  );
}

/* ---------- Camera Lock Inside Room ---------- */
function CameraLimiter() {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -12.5, 12.5);
    camera.position.y = THREE.MathUtils.clamp(camera.position.y, 1.4, 2.4);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -10, 10);
  });

  return null;
}

/* ---------- Camera Zoom Animation ---------- */
function CameraAnimator({
  target,
  active,
}: {
  target: THREE.Mesh | null;
  active: boolean;
}) {
  const { camera } = useThree();

  useFrame(() => {
    if (!active || !target) return;

    const targetPos = target.position
      .clone()
      .add(new THREE.Vector3(0, 0.6, 1.5));

    camera.position.lerp(targetPos, 0.05);
    camera.lookAt(target.position);
  });

  return null;
}

/* ---------- ENTRY 3D PAGE ---------- */
export default function Entry3D() {
  const navigate = useNavigate();
  const [entering, setEntering] = useState(false);
  const [monitor, setMonitor] = useState<THREE.Mesh | null>(null);

  const handleEnter = (monitorMesh: THREE.Mesh | null) => {
    if (entering || !monitorMesh) return;

    setEntering(true);
    setMonitor(monitorMesh);

    setTimeout(() => {
      navigate("/home");
    }, 1200);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", background: "black" }}>
      <Canvas shadows camera={{ position: [0, 1.6, 2.5], fov: 60 }}>
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* Scene */}
        <Room onEnter={handleEnter} />

        {/* Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={!entering}
          enableRotate={!entering}
          enableDamping
          dampingFactor={0.08}
        />
        {/* Lights */}
        <ambientLight intensity={0.25} />

        <directionalLight
          position={[5, 10, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* HDRI Environment */}
        <Environment
          files="/hdri/studio.hdr"
          background={false}
        />

        {/* Logic */}
        <CameraLimiter />
        <CameraAnimator target={monitor} active={entering} />
      </Canvas>
    </div>
  );
}
