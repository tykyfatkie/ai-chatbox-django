export const chatHistory = [
  {
    id: 1,
    title: "Phân tích dữ liệu bán hàng Q4",
    preview: "Hãy phân tích xu hướng...",
    time: "10 phút trước",
    active: true,
  },
  {
    id: 2,
    title: "Viết email marketing",
    preview: "Tôi cần một email giới thiệu...",
    time: "2 giờ trước",
    active: false,
  },
  {
    id: 3,
    title: "Tóm tắt tài liệu PDF",
    preview: "Đây là nội dung tài liệu...",
    time: "Hôm qua",
    active: false,
  },
  {
    id: 4,
    title: "Code React Component",
    preview: "Giúp tôi tạo một component...",
    time: "Hôm qua",
    active: false,
  },
  {
    id: 5,
    title: "Lên kế hoạch du lịch Đà Lạt",
    preview: "Tôi muốn đi Đà Lạt 3 ngày...",
    time: "2 ngày trước",
    active: false,
  },
  {
    id: 6,
    title: "Dịch thuật Anh - Việt",
    preview: "Please translate this text...",
    time: "3 ngày trước",
    active: false,
  },
  {
    id: 7,
    title: "Tư vấn chiến lược SEO",
    preview: "Website của tôi đang bị...",
    time: "1 tuần trước",
    active: false,
  },
];

export const initialMessages = [
  {
    id: 1,
    sender: "bot",
    text: "Xin chào! Tôi là trợ lý AI của bạn. Tôi có thể giúp bạn phân tích dữ liệu, viết nội dung, lập trình, và nhiều hơn nữa. Hôm nay tôi có thể giúp gì cho bạn?",
    time: "10:23 SA",
    avatar: "AI",
  },
  {
    id: 2,
    sender: "user",
    text: "Hãy phân tích xu hướng doanh thu của tôi trong quý 4 năm nay so với năm ngoái.",
    time: "10:24 SA",
    avatar: "ND",
  },
  {
    id: 3,
    sender: "bot",
    text: "Tất nhiên! Để phân tích xu hướng doanh thu Q4, tôi cần một số thông tin:\n\n• **Dữ liệu doanh thu Q4 năm nay** (tháng 10, 11, 12)\n• **Dữ liệu doanh thu Q4 năm ngoái** cùng kỳ\n• **Các chỉ số bạn quan tâm**: tổng doanh thu, tăng trưởng %, phân tích theo sản phẩm/kênh bán hàng?\n\nBạn có thể chia sẻ dữ liệu dưới dạng bảng hoặc upload file Excel/CSV không?",
    time: "10:24 SA",
    avatar: "AI",
  },
  {
    id: 4,
    sender: "user",
    text: "Doanh thu Q4 năm nay: T10: 450tr, T11: 520tr, T12: 680tr. Năm ngoái: T10: 380tr, T11: 420tr, T12: 590tr",
    time: "10:26 SA",
    avatar: "ND",
  },
  {
    id: 5,
    sender: "bot",
    text: "Xuất sắc! Dựa trên số liệu bạn cung cấp, đây là phân tích chi tiết:\n\n**📊 Tổng quan Q4:**\n- Năm nay: **1.650 triệu đồng**\n- Năm ngoái: **1.390 triệu đồng**\n- Tăng trưởng tổng: **+18.7%** 🚀\n\n**📈 Chi tiết từng tháng:**\n| Tháng | Năm ngoái | Năm nay | Tăng trưởng |\n|-------|-----------|---------|-------------|\n| T10 | 380tr | 450tr | **+18.4%** |\n| T11 | 420tr | 520tr | **+23.8%** |\n| T12 | 590tr | 680tr | **+15.3%** |\n\n**💡 Nhận xét:** Tháng 11 có mức tăng trưởng ấn tượng nhất (+23.8%). Đây có thể liên quan đến các chương trình khuyến mãi cuối năm. Bạn có muốn tôi phân tích sâu hơn về nguyên nhân không?",
    time: "10:27 SA",
    avatar: "AI",
  },
];