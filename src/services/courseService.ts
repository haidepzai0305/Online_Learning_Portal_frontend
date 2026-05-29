import axiosInstance from "./axiosInstance";

export const courseService = {
  listCourses: async () => {
    const response = await axiosInstance.get("/courses/");
    return response.data;
  },
  listMyCourses: async () => {
    const response = await axiosInstance.get("/courses/my-courses/");
    return response.data;
  },
  listEnrolledCourses: async () => {
    const response = await axiosInstance.get("/courses/enrolled/");
    return response.data;
  },
  getCourseDetail: async (courseId: string | number) => {
    const response = await axiosInstance.get(`/courses/${courseId}/`);
    return response.data;
  },
  enrollInCourse: async (courseId: string | number) => {
    const response = await axiosInstance.post(`/courses/${courseId}/enroll/`);
    return response.data;
  },
  createCourse: async (data: any) => {
    const response = await axiosInstance.post(`/courses/create/`, data);
    return response.data;
  },
  updateCourse: async (courseId: string | number, data: any) => {
    const response = await axiosInstance.put(`/courses/${courseId}/update/`, data);
    return response.data;
  },
  deleteCourse: async (courseId: string | number) => {
    const response = await axiosInstance.delete(`/courses/${courseId}/delete/`);
    return response.data;
  }
};

export default courseService;
