import { useEffect, useState, type ReactNode } from "react";
import {
  Award,
  BookOpen,
  BrainCircuit,
  ChevronDown,
  Flame,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import { mockHomeScreenData } from "./home.data";
import type { HeroFeatureItem, HomeCategory, HomeHeroData } from "./home.types";

interface HeroSectionProps {
  userName?: string;
  onLogout?: () => void;
  progress?: number;
  heroData?: HomeHeroData;
  categories?: HomeCategory[];
}

const CYBER_CYAN = "#21E6FF";

export function HeroSection({
  userName,
  onLogout,
  progress = 65,
  heroData = mockHomeScreenData.hero,
  categories = mockHomeScreenData.catalog.categories,
}: HeroSectionProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const cycleLength = Math.max(
      heroData.streakFrames.length,
      heroData.expFrames.length,
      heroData.labFrames.length,
      heroData.insightFrames.length,
      1,
    );

    const timer = window.setInterval(() => {
      setFrame((current) => (current + 1) % cycleLength);
    }, 2600);

    return () => window.clearInterval(timer);
  }, [heroData]);

  const resolvedName = userName || heroData.userNameFallback;
  const streak = heroData.streakFrames[frame % heroData.streakFrames.length];
  const exp = heroData.expFrames[frame % heroData.expFrames.length];
  const lab = heroData.labFrames[frame % heroData.labFrames.length];
  const insight = heroData.insightFrames[frame % heroData.insightFrames.length];
  const nextLabFooter = heroData.labFrames[0];
  const displayProgress = Math.max(progress, insight.value);
  const greeting = heroData.greeting.replace("{userName}", resolvedName);

  return (
    <section className="hero-shell relative overflow-hidden bg-[#07111f] text-white">
      <div className="hero-grid absolute inset-0 opacity-30" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-cyan-400/10 to-transparent" />
      <div className="absolute left-1/2 top-[22%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-400/20 blur-[160px]" />
      <div className="absolute right-[8%] top-[5%] h-[300px] w-[300px] rounded-full bg-sky-500/10 blur-[100px]" />
      <div className="absolute left-[6%] bottom-[12%] h-[240px] w-[240px] rounded-full bg-cyan-500/10 blur-[100px]" />
      <div className="hero-circuit absolute right-[4%] top-[8%] h-[46%] w-[28%] min-w-[240px] opacity-25" />

      <header className="relative z-10 flex w-full items-center justify-between px-6 py-6 md:px-10">
        <div className="group relative">
          <button className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-[#0D1627] px-4 py-2 font-semibold text-[#69EAEF] shadow-inner transition hover:bg-[#111A2E]">
            <Menu size={18} />
            <span className="text-xs uppercase tracking-[0.2em]">menu</span>
            <ChevronDown size={14} className="transition group-hover:rotate-180" />
          </button>

          <div className="pointer-events-none absolute left-0 top-[calc(100%+12px)] z-20 min-w-[230px] rounded-2xl border border-white/10 bg-[#0B1628]/95 p-3 opacity-0 shadow-[0_18px_50px_rgba(2,9,20,0.45)] backdrop-blur-xl transition duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
            <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Danh mục khóa học
            </div>
            <div className="space-y-1">
              {categories
                .filter((category) => category.id !== "all")
                .map((category) => (
                  <a
                    key={category.id}
                    href="#courses"
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-slate-200 transition hover:bg-cyan-400/10 hover:text-cyan-300"
                  >
                    <span>{category.name}</span>
                    <span className="text-slate-500">→</span>
                  </a>
                ))}
            </div>
          </div>
        </div>

        <div className="relative mx-6 hidden max-w-xl flex-1 md:flex">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            placeholder={heroData.searchPlaceholder}
            className="w-full rounded-full border border-white/10 bg-[#0D1627]/80 py-3 pl-11 pr-4 text-xs text-slate-200 placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-4 md:gap-5">
          <button className="relative text-cyan-400">
            <ShoppingCart size={20} />
            <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-cyan-400 text-[9px] font-bold text-[#060B18]">
              3
            </span>
          </button>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-xs font-medium text-slate-400">{resolvedName}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-cyan-400">
              <User size={16} className="text-[#060B18]" />
            </div>
          </div>

          <button onClick={onLogout} className="text-slate-500 transition hover:text-red-400">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-[1440px] flex-col justify-center px-4 pb-16 pt-8 md:px-10">
        <div className="relative grid items-start gap-8 xl:grid-cols-[280px_minmax(0,1fr)_280px]">
          <div className="order-2 space-y-5 xl:order-1 xl:grid xl:auto-rows-fr xl:gap-5 xl:space-y-0 xl:pt-20">
            <StatusCard
              icon={<Flame size={24} className="text-orange-400" />}
              distributeContent
              desktopHeightClass="xl:h-[316px]"
              alignTitleCenter
              eyebrow={
                <div className="flex items-center gap-2 rounded-full bg-cyan-400 px-3 py-1.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(33,230,255,0.18)]">
                  <span>Streak</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[11px] font-bold text-[#12a8d8]">
                    {streak.value}
                  </span>
                </div>
              }
              title={streak.label}
              barValue={Number(streak.value) * 10}
              barColor="from-orange-400 via-orange-300 to-cyan-300"
              detail={streak.detail}
            />

            <StatusCard
              icon={<Zap size={20} className="text-cyan-300" />}
              distributeContent
              desktopHeightClass="xl:h-[316px]"
              alignExpCenter
              eyebrow={<span className="font-semibold text-slate-100">EXP</span>}
              title={exp.exp}
              subtitle={exp.rank}
              extra={exp.delta}
              accent="bg-cyan-400/15 text-cyan-300"
              footerIcon={<Award size={18} className="text-amber-300" />}
            />
          </div>

          <div className="order-1 flex flex-col items-center text-center xl:order-2">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-[#0C182A]/85 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300 shadow-[0_0_30px_rgba(33,230,255,0.12)]">
              <Sparkles size={14} />
              {heroData.badgeText}
            </div>

            <h1 className="max-w-4xl text-center text-[clamp(3rem,6vw,5.6rem)] font-black leading-[0.98] tracking-[-0.04em] text-white">
              {heroData.headline}
              <span className="mt-3 block bg-gradient-to-r from-cyan-300 via-[#21E6FF] to-blue-400 bg-clip-text text-transparent">
                {heroData.highlightedHeadline}
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-balance text-xl font-semibold leading-relaxed text-slate-300/90 md:text-2xl">
              {greeting}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                className="rounded-[22px] px-10 py-4 text-lg font-black lowercase text-[#052033] transition hover:scale-[1.02]"
                style={{ backgroundColor: CYBER_CYAN, boxShadow: "0 0 30px rgba(33,230,255,0.35)" }}
              >
                {heroData.primaryCta}
              </button>
              <button className="rounded-[22px] border-2 border-cyan-400/55 bg-transparent px-10 py-4 text-lg font-black lowercase text-cyan-300 transition hover:bg-cyan-400/10">
                {heroData.secondaryCta}
              </button>
            </div>
          </div>

          <div className="order-3 space-y-5 xl:grid xl:auto-rows-fr xl:gap-5 xl:space-y-0 xl:pt-20">
            <StatusCard
              pinFooterToBottom
              eyebrow={<span className="text-[12px] font-black uppercase tracking-[0.16em] text-cyan-300">Next Lab</span>}
              title={lab.title}
              subtitle={lab.detail}
              footer={
                <div className="flex items-end justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2 text-xs font-medium text-emerald-300 sm:text-sm">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(74,222,128,0.8)]" />
                    {nextLabFooter.status}
                  </div>
                  <button className="rounded-2xl bg-cyan-400 px-4 py-2 text-xs font-bold text-[#052033] transition hover:bg-cyan-300 sm:px-5 sm:text-sm">
                    {nextLabFooter.cta} -&gt;
                  </button>
                </div>
              }
            />

            <StatusCard
              eyebrow={<span className="text-[12px] font-black uppercase tracking-[0.16em] text-cyan-300">AI Insights</span>}
              title={insight.note}
              footer={
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-xs text-slate-400 sm:text-sm">
                      <span>Tiến độ</span>
                      <span className="font-semibold text-slate-200">{displayProgress}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-white/5">
                      <div
                        className="hero-progress h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-300"
                        style={{ width: `${displayProgress}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-xs leading-[1.35] text-slate-400 sm:text-sm">Hãy làm bài test để nhận chứng chỉ.</p>
                </div>
              }
            />
          </div>
        </div>

        <div className="relative z-10 mt-12 grid gap-5 md:grid-cols-3 md:gap-7">
          {heroData.featureCards.map((feature) => (
            <article
              key={feature.title}
              className="group rounded-[22px] border border-white/60 bg-[#081321]/40 px-6 py-7 backdrop-blur-md transition hover:-translate-y-1 hover:border-cyan-300/90 hover:bg-cyan-400/8"
            >
              <div className="mb-4 flex items-center gap-3 text-cyan-300">
                {renderFeatureIcon(feature)}
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Feature</span>
              </div>
              <h3 className="text-2xl font-black tracking-[-0.03em] text-white">{feature.title}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function renderFeatureIcon(feature: HeroFeatureItem) {
  switch (feature.icon) {
    case "book":
      return <BookOpen size={20} />;
    case "brain":
      return <BrainCircuit size={20} />;
    case "shield":
      return <ShieldCheck size={20} />;
    default:
      return <BookOpen size={20} />;
  }
}

interface StatusCardProps {
  icon?: ReactNode;
  eyebrow?: ReactNode;
  title: string;
  subtitle?: string;
  extra?: string;
  detail?: string;
  footer?: ReactNode;
  footerIcon?: ReactNode;
  barValue?: number;
  barColor?: string;
  accent?: string;
  distributeContent?: boolean;
  desktopHeightClass?: string;
  alignTitleCenter?: boolean;
  alignExpCenter?: boolean;
  pinFooterToBottom?: boolean;
}

function StatusCard({
  icon,
  eyebrow,
  title,
  subtitle,
  extra,
  detail,
  footer,
  footerIcon,
  barValue,
  barColor = "from-cyan-400 to-blue-400",
  accent = "bg-amber-300/15 text-amber-200",
  distributeContent = false,
  desktopHeightClass = "xl:min-h-[272px]",
  alignTitleCenter = false,
  alignExpCenter = false,
  pinFooterToBottom = false,
}: StatusCardProps) {
  return (
    <article className={`hero-panel flex min-h-[260px] flex-col rounded-[26px] border border-white/8 bg-[#101A2D]/70 p-5 sm:min-h-[280px] sm:p-6 ${desktopHeightClass} shadow-[0_18px_50px_rgba(2,9,20,0.45)] backdrop-blur-xl`}>
      {alignTitleCenter ? (
        <>
          <div className="flex items-start justify-between gap-4">
            {icon ? (
              <div className="mt-0.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-400/18">{icon}</div>
            ) : <div />}
            {eyebrow}
          </div>

          <div className="flex flex-1 flex-col justify-between">
            <div className="flex flex-1 items-center justify-center px-4">
              <h3 className="text-center text-[clamp(1.2rem,3.9vw,1.65rem)] font-black leading-[1.1] tracking-[-0.03em] text-white">
                {title}
              </h3>
            </div>

            <div>
              {typeof barValue === "number" ? (
                <div className="h-2 rounded-full bg-white/5">
                  <div className={`hero-progress h-full rounded-full bg-gradient-to-r ${barColor}`} style={{ width: `${barValue}%` }} />
                </div>
              ) : null}
              {detail ? (
                <p className="mt-3 break-words text-left text-[clamp(0.78rem,2vw,0.95rem)] leading-[1.25] text-slate-400">
                  {detail}
                </p>
              ) : null}
            </div>
          </div>
        </>
      ) : alignExpCenter ? (
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between gap-4">
            {icon ? (
              <div className="mt-0.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-transparent">{icon}</div>
            ) : <div />}
            {extra ? (
              <span className="shrink-0 rounded-full bg-cyan-400 px-4 py-2 text-[clamp(0.78rem,2vw,0.95rem)] font-bold text-white shadow-[0_8px_20px_rgba(33,230,255,0.18)]">
                {extra}
              </span>
            ) : null}
          </div>

          <div className="flex flex-1 flex-col items-center justify-center pb-16 text-center -translate-y-3">
            {eyebrow ? <div className="mb-4 text-[1.05rem] text-slate-400">{eyebrow}</div> : null}
            <h3 className="text-[clamp(2.1rem,4.4vw,3rem)] font-black leading-none tracking-[-0.04em] text-white">
              {title}
            </h3>
            {subtitle ? (
              <p className="mt-3 text-[clamp(1rem,2.4vw,1.2rem)] font-medium leading-[1.35] text-slate-300">
                {subtitle}
              </p>
            ) : null}
          </div>

          {footerIcon ? (
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-amber-400 text-amber-300">
                {footerIcon}
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3">
              {icon ? (
                <div className="mt-0.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/6">{icon}</div>
              ) : null}
              <div className="min-w-0 flex-1 space-y-1.5">
                {eyebrow}
                <h3 className="break-words text-[clamp(0.82rem,3.5vw,1.35rem)] font-black leading-[1.12] tracking-[-0.03em] text-white">
                  {title}
                </h3>
                {subtitle ? (
                  <p className="break-words text-[clamp(0.68rem,2.2vw,0.95rem)] font-semibold leading-[1.28] text-slate-300">
                    {subtitle}
                  </p>
                ) : null}
              </div>
            </div>
            {extra ? (
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[clamp(0.65rem,2vw,0.9rem)] font-bold ${accent}`}>
                {extra}
              </span>
            ) : null}
          </div>

          <div className={`mt-4 flex-1 ${(distributeContent || pinFooterToBottom) ? "flex flex-col justify-between" : ""}`}>
            <div className={distributeContent ? "flex flex-1 flex-col justify-between" : ""}>
              {typeof barValue === "number" ? (
                <div className="h-2 rounded-full bg-white/5">
                  <div className={`hero-progress h-full rounded-full bg-gradient-to-r ${barColor}`} style={{ width: `${barValue}%` }} />
                </div>
              ) : null}
              {detail ? (
                <p className="mt-3 break-words text-right text-[clamp(0.62rem,1.8vw,0.85rem)] leading-[1.25] text-slate-400">
                  {detail}
                </p>
              ) : null}
            </div>

            {footerIcon || footer ? (
              <div className={distributeContent ? "" : "mt-4"}>
                {footer ? footer : null}
                {footerIcon && !footer ? <div className={distributeContent ? "" : "mt-4"}>{footerIcon}</div> : null}
              </div>
            ) : null}
          </div>
        </>
      )}
    </article>
  );
}
