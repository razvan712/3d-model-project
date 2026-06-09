"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, useGLTF } from "@react-three/drei";

type ModalData = {
  title: string;
  description: string;
};

function Model() {
  const { scene } = useGLTF("/models/white_mesh.glb");

  return (
    <primitive
      object={scene}
      scale={5}
      rotation={[0, Math.PI / 2, 0]}
    />
  );
}

function Hotspot({
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
    <Html
      position={position}
      center
      occlude="blending"
      distanceFactor={8}
    >
      <button
        onClick={() => onOpen({ title, description })}
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          fontSize: 18,
          fontWeight: "bold",
          background: "white",
          color: "black",
          boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
        }}
      >
        i
      </button>
    </Html>
  );
}

export default function RoomScene() {
  const [modal, setModal] = useState<ModalData | null>(null);

  return (
    <>
      <Canvas
        camera={{ position: [0, 2, 10] }}
        style={{
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[2, 2, 2]} intensity={3} />

        <Model />

        <Hotspot
          position={[3, 1, 0]}
          title="Reception Area"
          description="Visitors are welcomed here before entering the workspace."
          onOpen={setModal}
        />

        <Hotspot
          position={[-2, 1.5, 1]}
          title="Meeting Room"
          description="A collaborative space for team discussions and presentations."
          onOpen={setModal}
        />

        <Hotspot
          position={[0, 3, -1]}
          title="Feature Highlight"
          description="Important information about this section of the model."
          onOpen={setModal}
        />

        <OrbitControls enableZoom />
      </Canvas>

      {modal && (
        <div
          onClick={() => setModal(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 500,
              maxWidth: "90vw",
              background: "white",
              borderRadius: 12,
              padding: 24,
              color: "black",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            }}
          >
            <h2>{modal.title}</h2>

            <p>{modal.description}</p>

            <button
              onClick={() => setModal(null)}
              style={{
                marginTop: 16,
                padding: "10px 16px",
                cursor: "pointer",
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