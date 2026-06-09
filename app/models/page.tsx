import CatScene from "../components/CatScene";
import Link from "next/link";


export default function Page() {
  return (
    <main style={{ height: "80vh" }}>
        <Link  href="/"
  style={{
    padding: "10px 20px",
    backgroundColor: "#0070f3",
    color: "white",
    borderRadius: 5,
    textDecoration: "none",
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
  }}
>
Back to Home
</Link>
      <CatScene />
    </main>
  );
}