import { HeroSection } from "./HeroSection";
import { DisplaySection } from "./DisplaySection";
import "../../styles/home.css";

interface HomeScreenProps {
  userName?: string;
  onLogout?: () => void;
}

export function HomeScreen({ userName = "Sơn", onLogout }: HomeScreenProps) {
  return (
    <div className="home-screen-root">
      <main className="min-h-screen">
        <HeroSection userName={userName} onLogout={onLogout} />
        <DisplaySection />
      </main>
    </div>
  );
}

export default HomeScreen;