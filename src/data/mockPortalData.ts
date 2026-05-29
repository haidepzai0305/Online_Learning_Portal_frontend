export const mockPortalData = {
  instructor: {
    overview: {
      totalStudents: 0,
      totalRevenue: 0,
      averageRating: 0,
      pendingGrading: 0,
      enrollmentTrend: [],
      scoreDistribution: [],
      topQuestions: [],
    },
    courses: [],
    questions: []
  },
  student: {
    overview: {
      streak: 0,
      exp: 0,
      rank: "Mới",
      learningTimeHrs: 0,
      completedCourses: 0,
    },
    inProgress: [
      {
        id: "1",
        title: "Docker trong Một Cuối Tuần: 40 Bài Thực Hành Cho Người Học DevOps",
        thumbnail: "https://studyvn.academy/wp-content/uploads/2023/12/docker-course.jpg",
        category: "Other IT & Software",
        progress: 0,
        purchaseDate: "21/03/2026"
      },
      {
        id: "2",
        title: "Khóa học Bootcamp CI/CD Pipeline DevOps với Jenkins toàn diện",
        thumbnail: "https://studyvn.academy/wp-content/uploads/2023/12/jenkins-course.jpg",
        category: "Design Tools",
        progress: 0,
        purchaseDate: "21/03/2026"
      }
    ],
    orders: [
      {
        id: "SVN-89234",
        date: "21/03/2026",
        total: 1098000,
        status: "Thành công",
        method: "Chuyển khoản (VietQR)",
        items: ["Docker trong Một Cuối Tuần...", "Bootcamp CI/CD Pipeline..."]
      },
      {
        id: "SVN-61021",
        date: "15/01/2026",
        total: 499000,
        status: "Thành công",
        method: "Momo",
        items: ["Khóa học Python từ Zero đến Hero"]
      }
    ]
  }
};
