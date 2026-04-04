import { useState } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import { CourseCard } from "../../UI/CourseCard";
import { mockHomeScreenData } from "./home.data";
import type { HomeCatalogData } from "./home.types";

interface DisplaySectionProps {
  catalogData?: HomeCatalogData;
}

export function DisplaySection({ catalogData = mockHomeScreenData.catalog }: DisplaySectionProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredCourses =
    activeCategory === "all"
      ? catalogData.courses
      : catalogData.courses.filter((course) => course.category === activeCategory);

  const topCourses = [...filteredCourses].sort((a, b) => b.rating - a.rating).slice(0, 8);

  const categorySections = catalogData.sections.map((section) => ({
    ...section,
    courses: catalogData.courses.filter((course) => section.categoryIds.includes(course.category)),
  }));

  return (
    <section id="courses" className="bg-slate-100 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 text-teal-600">
              <Sparkles size={18} />
              <span className="text-sm font-medium">Khám phá</span>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
              Khóa học được đánh giá cao
            </h2>
            <p className="max-w-2xl text-sm text-gray-600 sm:text-base">
              Khám phá các khóa học chất lượng cao từ các chuyên gia hàng đầu trong ngành
            </p>
          </div>
          <button className="self-start whitespace-nowrap text-sm font-medium text-teal-600 hover:text-teal-700 sm:self-auto sm:text-base">
            <span className="flex items-center gap-1">
              Xem tất cả <ChevronRight size={16} />
            </span>
          </button>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 sm:mb-8 sm:gap-3 scrollbar-hide">
          {catalogData.categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex-shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
                activeCategory === category.id
                  ? "bg-teal-500 text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {topCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {filteredCourses.length > 8 ? (
          <div className="mt-8 text-center sm:mt-10">
            <button className="rounded-lg bg-teal-500 px-6 py-3 font-medium text-white transition-colors hover:bg-teal-600 sm:px-8">
              Xem thêm khóa học
            </button>
          </div>
        ) : null}

        <div className="mt-12 space-y-12 sm:mt-16 sm:space-y-16 lg:mt-20">
          {categorySections.map((section) => (
            <CategorySection
              key={section.title}
              title={section.title}
              subtitle={section.subtitle}
              courses={section.courses}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategorySection({
  title,
  subtitle,
  courses,
}: {
  title: string;
  subtitle: string;
  courses: HomeCatalogData["courses"];
}) {
  const topCourses = [...courses].sort((a, b) => b.rating - a.rating).slice(0, 4);

  if (topCourses.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="mb-1 text-xl font-bold text-gray-900 sm:text-2xl">{title}</h3>
          <p className="text-sm text-gray-600 sm:text-base">{subtitle}</p>
        </div>
        <button className="self-start whitespace-nowrap text-sm font-medium text-teal-600 hover:text-teal-700 sm:self-auto">
          <span className="flex items-center gap-1">
            Xem tất cả <ChevronRight size={16} />
          </span>
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {topCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

export default DisplaySection;
