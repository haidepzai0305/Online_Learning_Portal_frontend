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
          categories={data.catalog.categories}
        />
        <DisplaySection catalogData={data.catalog} />
        <footer className="bg-[#07111f] px-4 py-10 text-slate-300 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-[28px] border border-white/10 bg-white/5 px-6 py-8 backdrop-blur-md md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">UniLearn</p>
              <h2 className="mt-2 text-2xl font-black text-white">Kết nối cùng cộng đồng học tập.</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                Khu vực hiển thị thông tin mạng xã hội của trang để người dùng dễ nhận diện thương hiệu.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {data.footerSocials.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/60 hover:bg-cyan-400/15"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default HomeScreen;
