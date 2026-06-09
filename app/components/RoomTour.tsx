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

  const applyViewpoint = (view: Viewpoint) => {
    setCurrentView(view);
    setSettings((prev) => ({
      ...prev,
      cameraX: view.position[0],
      cameraY: view.position[1],
      cameraZ: view.position[2],
      lookX: view.lookAt[0],
      lookY: view.lookAt[1],
      lookZ: view.lookAt[2],
    }));
  };

      const [settings, setSettings] = useState({
  cameraX: 0,
  cameraY: 1.7,
  cameraZ: 8,

  lookX: 0,
  lookY: 1.5,
  lookZ: 0,

  ambientIntensity: 0.7,

  lightIntensity: 2,
  lightX: 5,
  lightY: 10,
  lightZ: 5,
});

const [showDebug, setShowDebug] = useState(true);

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
   <ambientLight intensity={settings.ambientIntensity} />

  <directionalLight
  position={[
    settings.lightX,
    settings.lightY,
    settings.lightZ,
  ]}
  intensity={settings.lightIntensity}
  castShadow
/>

       <CameraRig
  target={{
    name: "Custom",
    position: [
      settings.cameraX,
      settings.cameraY,
      settings.cameraZ,
    ],
    lookAt: [
      settings.lookX,
      settings.lookY,
      settings.lookZ,
    ],
  }}
/>

        <Room />

        {/* Navigation */}
        <NavigationHotspot
          position={[0, 0.5, 5]}
          label="Entrance"
          onClick={() => applyViewpoint(VIEWPOINTS[0])}
        />

        <NavigationHotspot
          position={[-5, 1.2, 2]}
          label="Bed"
          onClick={() => applyViewpoint(VIEWPOINTS[1])}
        />

        <NavigationHotspot
          position={[5, 1.2, 2]}
          label="Desk"
          onClick={() => applyViewpoint(VIEWPOINTS[2])}
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

      <button
  onClick={() => setShowDebug(!showDebug)}
  style={{
    position: "fixed",
    top: 20,
    right: showDebug ? 340 : 20,
    zIndex: 100000,
    width: 40,
    height: 40,
    border: "none",
    borderRadius: 8,
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontSize: 18,
    transition: "right 0.3s ease",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  }}
>
  {showDebug ? "→" : "←"}
</button>

<div
  style={{
    position: "fixed",
    top: 20,
    right: 20,
    width: 320,
    background: "white",
    color: "black",
    padding: 16,
    borderRadius: 12,
    zIndex: 99999,
    maxHeight: "90vh",
    overflow: "auto",

    boxShadow: "0 10px 30px rgba(0,0,0,.2)",

    transform: showDebug
      ? "translateX(0)"
      : "translateX(calc(100% + 40px))",

    opacity: showDebug ? 1 : 0.95,

    transition:
      "transform 0.3s ease, opacity 0.3s ease",
  }}
>
  <h2
    style={{
      marginTop: 0,
      marginBottom: 20,
    }}
  >
    Debug Controls
  </h2>


  <h3>Camera</h3>

  <label>
    X
    <input
      type="range"
      min="-20"
      max="20"
      step="0.1"
      value={settings.cameraX}
      onChange={(e) =>
        setSettings({
          ...settings,
          cameraX: Number(e.target.value),
        })
      }
    />
    {settings.cameraX}
  </label>

  <label>
    Y
    <input
      type="range"
      min="0"
      max="10"
      step="0.1"
      value={settings.cameraY}
      onChange={(e) =>
        setSettings({
          ...settings,
          cameraY: Number(e.target.value),
        })
      }
    />
    {settings.cameraY}
  </label>

  <label>
    Z
    <input
      type="range"
      min="-20"
      max="20"
      step="0.1"
      value={settings.cameraZ}
      onChange={(e) =>
        setSettings({
          ...settings,
          cameraZ: Number(e.target.value),
        })
      }
    />
    {settings.cameraZ}
  </label>

  <hr />

  <h3>Look At</h3>

  <label>
    X
    <input
      type="range"
      min="-20"
      max="20"
      step="0.1"
      value={settings.lookX}
      onChange={(e) =>
        setSettings({
          ...settings,
          lookX: Number(e.target.value),
        })
      }
    />
    {settings.lookX}
  </label>

  <label>
    Y
    <input
      type="range"
      min="-20"
      max="20"
      step="0.1"
      value={settings.lookY}
      onChange={(e) =>
        setSettings({
          ...settings,
          lookY: Number(e.target.value),
        })
      }
    />
    {settings.lookY}
  </label>

  <label>
    Z
    <input
      type="range"
      min="-20"
      max="20"
      step="0.1"
      value={settings.lookZ}
      onChange={(e) =>
        setSettings({
          ...settings,
          lookZ: Number(e.target.value),
        })
      }
    />
    {settings.lookZ}
  </label>

  <hr />

  <h3>Ambient Light</h3>

  <input
    type="range"
    min="0"
    max="5"
    step="0.1"
    value={settings.ambientIntensity}
    onChange={(e) =>
      setSettings({
        ...settings,
        ambientIntensity: Number(e.target.value),
      })
    }
  />

  {settings.ambientIntensity}

  <hr />

  <h3>Directional Light</h3>

  <input
    type="range"
    min="0"
    max="10"
    step="0.1"
    value={settings.lightIntensity}
    onChange={(e) =>
      setSettings({
        ...settings,
        lightIntensity: Number(e.target.value),
      })
    }
  />

  {settings.lightIntensity}

  <hr />

  <h3>Light Position</h3>

  <label>
    X
    <input
      type="range"
      min="-20"
      max="20"
      step="0.1"
      value={settings.lightX}
      onChange={(e) =>
        setSettings({
          ...settings,
          lightX: Number(e.target.value),
        })
      }
    />
    {settings.lightX}
  </label>

  <label>
    Y
    <input
      type="range"
      min="-20"
      max="20"
      step="0.1"
      value={settings.lightY}
      onChange={(e) =>
        setSettings({
          ...settings,
          lightY: Number(e.target.value),
        })
      }
    />
    {settings.lightY}
  </label>

  <label>
    Z
    <input
      type="range"
      min="-20"
      max="20"
      step="0.1"
      value={settings.lightZ}
      onChange={(e) =>
        setSettings({
          ...settings,
          lightZ: Number(e.target.value),
        })
      }
    />
    {settings.lightZ}
  </label>



</div>

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