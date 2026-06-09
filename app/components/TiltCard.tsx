"use client";

import { useEffect, useRef } from "react";
import VanillaTilt from "vanilla-tilt";

export default function TiltCard({ title }) {
  const ref = useRef(null);

  useEffect(() => {
    VanillaTilt.init(ref.current, {
      max: 15,
      speed: 400,
      glare: true,
      "max-glare": 0.3,
    });
  }, []);

  return (
    <div
      ref={ref}
      style={{
        width: "250px",
        height: "300px",
        background: "white",
        margin: "20px",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        fontSize: "20px",
        fontWeight: "bold",
      }}
    >
      {title}
    </div>
  );
}