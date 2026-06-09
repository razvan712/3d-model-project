"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Center,
  Html,
  Stage,
  useGLTF,
} from "@react-three/drei";

type ModalData = {
  title: string;
  description: string;
};

const MODELS = [
  {
    name: "Cat",
    path: "/models/white_mesh.glb",
    scale: 5,
  },
  {
    name: "Dog",
    path: "/models/eduardo_the_druid.glb",
    scale: 0.01,
  },

];

function Model({ modelPath, scale }: { modelPath: string; scale: number }) {
  const { scene } = useGLTF(modelPath);

  scene.traverse((child: any) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return (
    <Center>
      <primitive
        object={scene}
        scale={scale}
        rotation={[0, Math.PI / 2, 0]}
      />
    </Center>
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
      occlude
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

export default function CatScene() {
  const [modal, setModal] = useState<ModalData | null>(null);

  const [selectedModel, setSelectedModel] = useState(
    MODELS[0]
  );

  return (
    <>
      {/* Top Navigation */}
      <div
        style={{
          position: "fixed",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 12,
          zIndex: 1000,
        }}
      >
        {MODELS.map((model) => (
          <button
            key={model.path}
            onClick={() => setSelectedModel(model)}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              background:
                selectedModel.path === model.path
                  ? "#000"
                  : "#fff",
              color:
                selectedModel.path === model.path
                  ? "#fff"
                  : "#000",
              boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
            }}
          >
            {model.name}
          </button>
        ))}
      </div>

      <Canvas
        shadows
        camera={{
          position: [0, 2, 10],
          fov: 50,
        }}
        style={{
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      >
        <Stage
          intensity={1}
          environment="sunset"
          shadows="contact"
          adjustCamera
        >
          <Model modelPath={selectedModel.path} scale={selectedModel.scale} />
        </Stage>

        {/* Hotspots */}
        <Hotspot
          position={[3, 1, 0]}
          title="Nose"
          description="This is the cat's nose. It has a keen sense of smell, which helps it navigate and find food."
          onOpen={setModal}
        />

        <Hotspot
          position={[-3, 1, 1]}
          title="Butt"
          description="This is the cat's butt. It helps the cat maintain balance and agility."
          onOpen={setModal}
        />

        <Hotspot
          position={[0, 3, -1]}
          title="Ear"
          description="This is the cat's ear. It helps the cat detect sounds and maintain balance."
          onOpen={setModal}
        />

        <OrbitControls enableZoom />
      </Canvas>

      {/* Modal */}
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