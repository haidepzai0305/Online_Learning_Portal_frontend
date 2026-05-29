import { DisplaySection } from "./DisplaySection";
import { HeroSection } from "./HeroSection";
import { useHomeScreenData } from "./useHomeScreenData";
import "../../styles/home.css";

export function HomeScreen() {
  const { data, error } = useHomeScreenData();

  return (
    <div style={{ width: "100%" }}>
      {error ? (
        <div
          style={{
            borderBottom: "1px solid rgba(245,158,11,0.2)",
            background: "#fffbeb",
            padding: "12px 16px",
            fontSize: 14,
            color: "#92400e",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      ) : null}

      <main>
        <HeroSection />
        <DisplaySection catalogData={data.catalog} />
      </main>
    </div>
  );
}

export default HomeScreen;
