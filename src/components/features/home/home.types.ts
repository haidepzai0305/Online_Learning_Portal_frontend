import type { Course } from "../../UI/CourseCard";

export interface HeroMetricFrame {
  value: string;
  label: string;
  detail?: string;
}

export interface HeroExpFrame {
  exp: string;
  rank: string;
  delta: string;
}

export interface HeroLabFrame {
  title: string;
  detail: string;
  status: string;
  cta: string;
}

export interface HeroInsightFrame {
  value: number;
  note: string;
}

export interface HeroFeatureItem {
  title: string;
  icon: "book" | "brain" | "shield";
}

export interface HomeHeroData {
  userNameFallback: string;
  searchPlaceholder: string;
  badgeText: string;
  headline: string;
  highlightedHeadline: string;
  greeting: string;
  primaryCta: string;
  secondaryCta: string;
  streakFrames: HeroMetricFrame[];
  expFrames: HeroExpFrame[];
  labFrames: HeroLabFrame[];
  insightFrames: HeroInsightFrame[];
  featureCards: HeroFeatureItem[];
}

export interface HomeCategory {
  id: string;
  name: string;
}

export interface HomeCourseSection {
  title: string;
  subtitle: string;
  categoryIds: string[];
}

export interface HomeCatalogData {
  categories: HomeCategory[];
  courses: Course[];
  sections: HomeCourseSection[];
}

export interface HomeScreenData {
  hero: HomeHeroData;
  catalog: HomeCatalogData;
}
