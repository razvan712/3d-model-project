"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

type ModalData = {
  title: string;
  description: string;
};

type Viewpoint = {
  name: string;
  position: [number, number, number];
  lookAt: [number, number, number];
};

const VIEWPOINTS: Viewpoint[] = [
  {
    name: "Entrance",
    position: [0, 1.7, 8],
    lookAt: [0, 1.5, 0],
  },
  {
    name: "Bed",
    position: [-5, 1.7, 0],
    lookAt: [0, 1.5, 0],
  },
  {
    name: "Desk",
    position: [5, 1.7, 0],
    lookAt: [0, 1.5, 0],
  },
];

function CameraRig({
  target,
}: {
  target: Viewpoint;
}) {
  const { camera } = useThree();

  const targetPosition = useRef(
    new THREE.Vector3(...target.position)
  );

  const lookTarget = useRef(
    new THREE.Vector3(...target.lookAt)
  );

  targetPosition.current.set(...target.position);
  lookTarget.current.set(...target.lookAt);

  useFrame(() => {
    camera.position.lerp(targetPosition.current, 0.05);

    const currentLook = new THREE.Vector3();
    currentLook.lerpVectors(
      camera.getWorldDirection(new THREE.Vector3())
        .add(camera.position),
      lookTarget.current,
      0.05
    );

    camera.lookAt(currentLook);
  });

  return null;
}

function NavigationHotspot({
  position,
  label,
  onClick,
}: {
  position: [number, number, number];
  label: string;
  onClick: () => void;
}) {
  return (
    <Html position={position} center>
      <button
        onClick={onClick}
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "none",
          background: "#ffffff",
          cursor: "pointer",
          fontWeight: "bold",
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
        }}
      >
      {label==="Entrance" ? "E" : label==="Bed" ? "B" : "D"}
      </button>
    </Html>
  );
}

function InfoHotspot({
  position,
  title,
  description,
  onOpen,
}: {
  position: [number, number, number];
  title: string;
  description: string;
  onOpen: (data: ModalData) => void;
}) {
  return (
    <Html position={position} center>
      <button
        onClick={() =>
          onOpen({
            title,
            description,
          })
        }
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "none",
          background: "#2563eb",
          color: "white",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        i
      </button>
    </Html>
  );
}

function Room() {
  return (
    <>
      {/* Floor */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#d6d6d6" />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 2.5, -10]}>
        <boxGeometry args={[20, 5, 0.2]} />
        <meshStandardMaterial color="#f3f3f3" />
      </mesh>

      {/* Left wall */}
      <mesh position={[-10, 2.5, 0]}>
        <boxGeometry args={[0.2, 5, 20]} />
        <meshStandardMaterial color="#ececec" />
      </mesh>

      {/* Right wall */}
      <mesh position={[10, 2.5, 0]}>
        <boxGeometry args={[0.2, 5, 20]} />
        <meshStandardMaterial color="#ececec" />
      </mesh>

      {/* Bed */}
      <mesh position={[-5, 0.5, 0]} castShadow>
        <boxGeometry args={[3, 1, 5]} />
        <meshStandardMaterial color="#888" />
      </mesh>

      {/* Desk */}
      <mesh position={[5, 0.75, 0]} castShadow>
        <boxGeometry args={[3, 1.5, 2]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* Lamp */}
      <mesh position={[0, 2, -5]} castShadow>
        <sphereGeometry args={[0.5]} />
        <meshStandardMaterial color="#ffd700" />
      </mesh>
    </>
  );
}

export default function RoomTour() {
  const [modal, setModal] = useState<ModalData | null>(null);

  const [currentView, setCurrentView] = useState(
    VIEWPOINTS[0]
  );

  return (
    <>
      <Canvas
        shadows
        camera={{
          position: currentView.position,
          fov: 60,
        }}
        style={{
          width: "100%",
          height: "100vh",
        }}
      >
        <ambientLight intensity={0.7} />

        <directionalLight
          position={[5, 10, 5]}
          intensity={2}
          castShadow
        />

        <CameraRig target={currentView} />

        <Room />

        {/* Navigation */}
        <NavigationHotspot
          position={[0, 0.5, 5]}
          label="Entrance"
          onClick={() => setCurrentView(VIEWPOINTS[0])}
        />

        <NavigationHotspot
          position={[-5, 1.2, 2]}
          label="Bed"
          onClick={() => setCurrentView(VIEWPOINTS[1])}
        />

        <NavigationHotspot
          position={[5, 1.2, 2]}
          label="Desk"
          onClick={() => setCurrentView(VIEWPOINTS[2])}
        />

        {/* Information hotspots */}
        <InfoHotspot
          position={[-5, 2, 0]}
          title="Bed"
          description="King-size bed with premium linens."
          onOpen={setModal}
        />

        <InfoHotspot
          position={[5, 2, 0]}
          title="Work Desk"
          description="Dedicated workspace with charging ports."
          onOpen={setModal}
        />

        <InfoHotspot
          position={[0, 3, -5]}
          title="Lighting"
          description="Adjustable ambient room lighting."
          onOpen={setModal}
        />
      </Canvas>

      {modal && (
        <div
          onClick={() => setModal(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 400,
              background: "white",
              color: "black",
              padding: 24,
              borderRadius: 12,
            }}
          >
            <h2>{modal.title}</h2>

            <p>{modal.description}</p>

            <button
              onClick={() => setModal(null)}
              style={{
                marginTop: 12,
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}