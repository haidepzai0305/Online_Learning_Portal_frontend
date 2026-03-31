import { useState } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import { CourseCard } from "../../UI/CourseCard";

const categories = [
   { id: "all", name: "Tất cả" },
   { id: "python", name: "Python" },
   { id: "cybersecurity", name: "Cyber Security" },
   { id: "webdev", name: "Web Dev" },
   { id: "datascience", name: "Data Science" },
   { id: "devops", name: "DevOps" },
   { id: "mobile", name: "Mobile" },
 ];

 const mockCourses: Course[] = [
   {
     id: "1",
     title: "Python cho người mới bắt đầu - Từ Zero đến Hero",
     instructor: "Nguyễn Văn A",
     thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=300&fit=crop",
     rating: 4.8,
     reviewCount: 2543,
     duration: "42h 30m",
     students: 15420,
     price: 499000,
     originalPrice: 1299000,
     category: "python",
     level: "Beginner",
   },
   {
     id: "2",
     title: "Ethical Hacking & Penetration Testing Complete Course",
     instructor: "Trần Minh B",
     thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop",
     rating: 4.9,
     reviewCount: 1876,
     duration: "56h 15m",
     students: 8932,
     price: 799000,
     originalPrice: 1899000,
     category: "cybersecurity",
     level: "Advanced",
   },
   {
     id: "3",
     title: "Full Stack Web Development với React & Node.js",
     instructor: "Lê Thị C",
     thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop",
     rating: 4.7,
     reviewCount: 3421,
     duration: "68h 45m",
     students: 21543,
     price: 699000,
     originalPrice: 1599000,
     category: "webdev",
     level: "Intermediate",
   },
   {
     id: "4",
     title: "Machine Learning & Deep Learning A-Z",
     instructor: "Phạm Văn D",
     thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop",
     rating: 4.8,
     reviewCount: 2198,
     duration: "78h 20m",
     students: 12876,
     price: 899000,
     originalPrice: 2199000,
     category: "datascience",
     level: "Advanced",
   },
   {
     id: "5",
     title: "Docker & Kubernetes - DevOps Masterclass",
     instructor: "Hoàng Văn E",
     thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=300&fit=crop",
     rating: 4.6,
     reviewCount: 1543,
     duration: "35h 10m",
     students: 7654,
     price: 599000,
     originalPrice: 1399000,
     category: "devops",
     level: "Intermediate",
   },
   {
     id: "6",
     title: "React Native - Xây dựng ứng dụng Mobile",
     instructor: "Ngô Thị F",
     thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
     rating: 4.7,
     reviewCount: 1876,
     duration: "48h 30m",
     students: 9876,
     price: 649000,
     originalPrice: 1499000,
     category: "mobile",
     level: "Intermediate",
   },
   {
     id: "7",
     title: "Python Data Analysis với Pandas & NumPy",
     instructor: "Vũ Minh G",
     thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
     rating: 4.9,
     reviewCount: 2876,
     duration: "32h 45m",
     students: 18765,
     price: 549000,
     originalPrice: 1199000,
     category: "python",
     level: "Intermediate",
   },
   {
     id: "8",
     title: "Network Security & Firewall Fundamentals",
     instructor: "Đinh Văn H",
     thumbnail: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400&h=300&fit=crop",
     rating: 4.5,
     reviewCount: 987,
     duration: "28h 15m",
     students: 5432,
     price: 449000,
     originalPrice: 999000,
     category: "cybersecurity",
     level: "Beginner",
   },
 ];

 export function DisplaySection() {
   const [activeCategory, setActiveCategory] = useState("all");

   const filteredCourses =
     activeCategory === "all"
       ? mockCourses
       : mockCourses.filter((course) => course.category === activeCategory);

   const topCourses = [...filteredCourses]
     .sort((a, b) => b.rating - a.rating)
     .slice(0, 8);

   return (
     <section className="bg-slate-100 py-12 sm:py-16 lg:py-20">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         {/* Section Header */}
         <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
           <div>
             <div className="inline-flex items-center gap-2 text-teal-600 mb-2">
               <Sparkles size={18} />
               <span className="text-sm font-medium">Khám phá</span>
             </div>
             <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
               Khóa học được đánh giá cao
             </h2>
             <p className="text-gray-600 text-sm sm:text-base max-w-2xl">
               Khám phá các khóa học chất lượng cao từ các chuyên gia hàng đầu trong ngành
             </p>
           </div>
           <button className="self-start sm:self-auto flex items-center gap-1 text-teal-600 hover:text-teal-700 font-medium text-sm sm:text-base whitespace-nowrap">
             Xem tất cả <ChevronRight size={16} />
           </button>
         </div>

         {/* Category Tabs */}
         <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8 overflow-x-auto pb-2 scrollbar-hide">
           {categories.map((category) => (
             <button
               key={category.id}
               onClick={() => setActiveCategory(category.id)}
               className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                 activeCategory === category.id
                   ? "bg-teal-500 text-white"
                   : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
               }`}
             >
               {category.name}
             </button>
           ))}
         </div>

         {/* Course Grid - Responsive 1/2/3/4 columns */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
           {topCourses.map((course) => (
             <CourseCard key={course.id} course={course} />
           ))}
         </div>

         {/* Load More */}
         {filteredCourses.length > 8 && (
           <div className="text-center mt-8 sm:mt-10">
             <button className="bg-teal-500 hover:bg-teal-600 text-white font-medium px-6 sm:px-8 py-3 rounded-lg transition-colors">
               Xem thêm khóa học
             </button>
           </div>
         )}

         {/* Category Sections */}
         <div className="mt-12 sm:mt-16 lg:mt-20 space-y-12 sm:space-y-16">
           <CategorySection
             title="Python & Data Science"
             subtitle="Nắm vững ngôn ngữ lập trình phổ biến nhất thế giới"
             courses={mockCourses.filter((c) => c.category === "python" || c.category === "datascience")}
           />

           <CategorySection
             title="Cyber Security"
             subtitle="Bảo vệ hệ thống và dữ liệu khỏi các mối đe dọa"
             courses={mockCourses.filter((c) => c.category === "cybersecurity")}
           />

           <CategorySection
             title="Web & Mobile Development"
             subtitle="Xây dựng ứng dụng hiện đại với các công nghệ mới nhất"
             courses={mockCourses.filter((c) => c.category === "webdev" || c.category === "mobile")}
           />
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
   courses: Course[];
 }) {
   const topCourses = [...courses].sort((a, b) => b.rating - a.rating).slice(0, 4);

   if (topCourses.length === 0) return null;

   return (
     <div>
       <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4 sm:mb-6">
         <div>
           <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{title}</h3>
           <p className="text-gray-600 text-sm sm:text-base">{subtitle}</p>
         </div>
         <button className="self-start sm:self-auto flex items-center gap-1 text-teal-600 hover:text-teal-700 font-medium text-sm whitespace-nowrap">
           Xem tất cả <ChevronRight size={16} />
         </button>
       </div>
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
         {topCourses.map((course) => (
           <CourseCard key={course.id} course={course} />
         ))}
       </div>
     </div>
   );
 }

 export default DisplaySection;
