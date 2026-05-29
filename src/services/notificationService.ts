import axiosInstance from "./axiosInstance";

export const notificationService = {
  listNotifications: async () => {
    const response = await axiosInstance.get("/notifications/");
    return response.data;
  },
  
  markAsRead: async (notificationId: number) => {
    const response = await axiosInstance.post(`/notifications/${notificationId}/read/`);
    return response.data;
  }
};

export default notificationService;
