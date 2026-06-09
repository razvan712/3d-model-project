import CatScene from "./components/CatScene";
import RoomTour from "./components/RoomTour";
import Link from "next/link";

export default function Page() {
  return (
<main style={{ height: "80vh" }}>
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>
        3D Model Showcase
      </h1>
      <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
 <Link
  href="/models"
  style={{
    padding: "10px 20px",
    backgroundColor: "#0070f3",
    color: "white",
    borderRadius: 5,
    textDecoration: "none",
  }}
>
  View Models
</Link>
  
        <Link href="/room-tour"
          style={{
            padding: "10px 20px",
            backgroundColor: "#0070f3",
            color: "white",
            borderRadius: 5,
            textDecoration: "none",
          }}
        >

            Room Tour
      
        </Link>
      </div>
      <h1 style={{ textAlign: "center", marginTop: 40 }}>
        Welcome to the 3D Model Showcase!
      </h1>
</main>
  );
}