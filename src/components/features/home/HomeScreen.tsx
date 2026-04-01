import { DisplaySection } from "./DisplaySection";
import { HeroSection } from "./HeroSection";
import { useHomeScreenData } from "./useHomeScreenData";
import "../../styles/home.css";

interface HomeScreenProps {
  userName?: string;
  onLogout?: () => void;
  progress?: number;
}

export function HomeScreen({ userName, onLogout, progress = 65 }: HomeScreenProps) {
  const { data, error } = useHomeScreenData();

  return (
    <div className="home-screen-root">
      {error ? (
        <div className="border-b border-amber-400/20 bg-amber-100 px-4 py-3 text-sm text-amber-900">
          {error}
        </div>
      ) : null}

      <main className="min-h-screen">
        <HeroSection
          userName={userName}
          onLogout={onLogout}
          progress={progress}
          heroData={data.hero}
        />
        <DisplaySection catalogData={data.catalog} />
      </main>
    </div>
  );
}

export default HomeScreen;
