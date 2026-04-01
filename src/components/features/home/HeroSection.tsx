import { useEffect, useState, type ReactNode } from "react";
import {
  Award,
  BookOpen,
  BrainCircuit,
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
import type { HeroFeatureItem, HomeHeroData } from "./home.types";

interface HeroSectionProps {
  userName?: string;
  onLogout?: () => void;
  progress?: number;
  heroData?: HomeHeroData;
}

const CYBER_CYAN = "#21E6FF";

export function HeroSection({
  userName,
  onLogout,
  progress = 65,
  heroData = mockHomeScreenData.hero,
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
        <button className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-[#0D1627] px-4 py-2 font-semibold text-[#69EAEF] shadow-inner transition hover:bg-[#111A2E]">
          <Menu size={18} />
          <span className="text-xs uppercase tracking-[0.2em]">menu</span>
        </button>

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
          <div className="order-2 space-y-5 xl:order-1 xl:pt-20">
            <StatusCard
              icon={<Flame size={24} className="text-orange-400" />}
              eyebrow={
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-100">Streak</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400 text-[11px] font-bold text-[#072034]">
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
              eyebrow={<span className="font-semibold text-slate-100">EXP</span>}
              title={exp.exp}
              subtitle={exp.rank}
              extra={exp.delta}
              accent="bg-cyan-400/15 text-cyan-300"
              footerIcon={<Award size={18} className="text-amber-300" />}
            />
          </div>

          <div className="order-1 flex flex-col items-center text-center xl:order-2">
            <div className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/2 text-[clamp(6rem,18vw,13rem)] font-black uppercase tracking-[0.25em] text-cyan-300/18 blur-[10px]">
              AI
            </div>

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

          <div className="order-3 space-y-5 xl:pt-20">
            <StatusCard
              eyebrow={<span className="text-[12px] font-black uppercase tracking-[0.16em] text-cyan-300">Next Lab</span>}
              title={lab.title}
              subtitle={lab.detail}
              footer={
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm text-emerald-300">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(74,222,128,0.8)]" />
                    {lab.status}
                  </div>
                  <button className="rounded-2xl bg-cyan-400 px-5 py-2 text-sm font-bold text-[#052033] transition hover:bg-cyan-300">
                    {lab.cta} -&gt;
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
                    <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
                      <span>Progress</span>
                      <span className="font-semibold text-slate-200">{displayProgress}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-white/5">
                      <div
                        className="hero-progress h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-300"
                        style={{ width: `${displayProgress}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-slate-400">Hay lam bai test de nhan chung chi.</p>
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
}: StatusCardProps) {
  return (
    <article className="hero-panel rounded-[26px] border border-white/8 bg-[#101A2D]/70 p-6 shadow-[0_18px_50px_rgba(2,9,20,0.45)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          {icon ? (
            <div className="mt-0.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/6">{icon}</div>
          ) : null}
          <div className="space-y-1.5">
            {eyebrow}
            <h3 className="text-xl font-black leading-tight tracking-[-0.03em] text-white md:text-[1.7rem]">{title}</h3>
            {subtitle ? <p className="text-base font-semibold text-slate-300">{subtitle}</p> : null}
          </div>
        </div>
        {extra ? <span className={`rounded-full px-3 py-1 text-sm font-bold ${accent}`}>{extra}</span> : null}
      </div>

      {typeof barValue === "number" ? (
        <div className="mt-6">
          <div className="h-2 rounded-full bg-white/5">
            <div className={`hero-progress h-full rounded-full bg-gradient-to-r ${barColor}`} style={{ width: `${barValue}%` }} />
          </div>
          {detail ? <p className="mt-3 text-right text-sm text-slate-400">{detail}</p> : null}
        </div>
      ) : null}

      {footerIcon || footer ? (
        <div className="mt-6">
          {footer ? footer : null}
          {footerIcon && !footer ? <div className="mt-4">{footerIcon}</div> : null}
        </div>
      ) : null}
    </article>
  );
}
