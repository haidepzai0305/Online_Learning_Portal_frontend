import axiosInstance from "./axiosInstance";

export const paymentService = {
  // Bắt đầu thanh toán
  initiateCheckout: async (courseId: number, paymentMethod: string) => {
    const response = await axiosInstance.post("/payments/checkout/", {
      course_id: courseId,
      payment_method: paymentMethod
    });
    return response.data;
  },
  
  // Lịch sử giao dịch
  getTransactionHistory: async () => {
    const response = await axiosInstance.get("/payments/history/");
    return response.data;
  },

  // Giả lập webhook call (chỉ dùng cho testing)
  simulateSuccess: async (transactionId: number) => {
    const response = await axiosInstance.post("/payments/webhook/", {
      transaction_id: transactionId,
      status: "SUCCESS"
    });
    return response.data;
  }
};

export default paymentService;
