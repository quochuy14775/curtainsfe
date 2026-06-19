"use client";

import { useEffect } from "react";
import { driver } from "driver.js";
import { HelpCircle } from "lucide-react";
import "driver.js/dist/driver.css";

const TOUR_DONE_KEY = "admin-tour-done";

const steps = [
  {
    element: '[data-tour="brand"]',
    popover: {
      title: "Chào mừng đến trang quản trị 👋",
      description:
        "Đây là khu vực quản lý của Maison. Mình sẽ hướng dẫn nhanh các phần chính. Bấm “Tiếp” để bắt đầu.",
    },
  },
  {
    element: '[data-tour="dashboard"]',
    popover: {
      title: "Tổng quan",
      description:
        "Xem nhanh số liệu: tổng đơn, đơn chờ xử lý, lịch hẹn sắp tới và tỉ lệ hoàn thành. Đây là trang mặc định khi đăng nhập.",
    },
  },
  {
    element: '[data-tour="orders"]',
    popover: {
      title: "Đơn tư vấn",
      description:
        "Nơi tiếp nhận yêu cầu tư vấn của khách. Bạn xác nhận, hẹn lịch, đánh dấu hoàn thành hoặc huỷ đơn tại đây.",
    },
  },
  {
    element: '[data-tour="products"]',
    popover: {
      title: "Sản phẩm",
      description:
        "Thêm, sửa, ẩn/hiện sản phẩm rèm. Mỗi sản phẩm gắn với một phân loại và có hình ảnh, mô tả, giá.",
    },
  },
  {
    element: '[data-tour="categories"]',
    popover: {
      title: "Phân loại",
      description:
        "Quản lý nhóm sản phẩm (ví dụ: rèm vải, rèm cuốn...). Tạo phân loại trước rồi mới gán cho sản phẩm.",
    },
  },
  {
    element: '[data-tour="contact"]',
    popover: {
      title: "Liên hệ",
      description:
        "Sửa số điện thoại, email, địa chỉ, link Zalo/WhatsApp... Lưu xong trang chủ tự cập nhật ngay mà không cần sửa code.",
    },
  },
  {
    element: '[data-tour="help"]',
    popover: {
      title: "Xem lại hướng dẫn bất cứ lúc nào",
      description:
        "Quên thao tác? Nút “Hướng dẫn” này luôn ở góc trên bên phải mọi trang — bấm vào để chạy lại tour này bất cứ lúc nào. Chúc bạn thao tác thuận lợi!",
    },
  },
];

function startTour() {
  const d = driver({
    popoverClass: "maison-tour",
    showProgress: true,
    overlayColor: "#2c2c2c",
    overlayOpacity: 0.55,
    stagePadding: 2,
    stageRadius: 10,
    nextBtnText: "Tiếp →",
    prevBtnText: "← Quay lại",
    doneBtnText: "Hoàn tất",
    progressText: "{{current}}/{{total}}",
    steps,
    onDestroyed: () => {
      try {
        localStorage.setItem(TOUR_DONE_KEY, "1");
      } catch {
        /* ignore */
      }
    },
  });
  d.drive();
}

export function AdminTour() {
  useEffect(() => {
    // Nút "Hướng dẫn sử dụng" phát sự kiện này để chạy lại tour.
    const handler = () => startTour();
    window.addEventListener("admin-tour:start", handler);

    // Tự bật lần đầu (chỉ trên màn hình lớn vì sidebar bị ẩn trên mobile).
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const done = localStorage.getItem(TOUR_DONE_KEY);
      if (!done && window.innerWidth >= 768) {
        timer = setTimeout(startTour, 600);
      }
    } catch {
      /* ignore */
    }

    return () => {
      window.removeEventListener("admin-tour:start", handler);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <button
      type="button"
      data-tour="help"
      onClick={() => startTour()}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-charcoal text-warm-white text-xs font-medium shadow-lg hover:bg-gold hover:text-charcoal transition-colors duration-200"
      aria-label="Hướng dẫn sử dụng"
    >
      <HelpCircle size={15} />
      <span className="hidden sm:inline">Hướng dẫn</span>
    </button>
  );
}
