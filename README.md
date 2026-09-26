# Thẻ Giới: Hỗn Mang

Game thẻ bài Roguelite bán tự động, Việt hóa, dành cho PC và điện thoại.

**Phiên bản V0.2 — Hành trình Roguelite.**

**Chơi trên GitHub Pages:** https://VGpro9X.github.io/The-Gioi-Hon-Mang/

## Cách chơi

- Chọn nhánh trên bản đồ 6 tầng. Chỉ đi tới nút cùng cột hoặc cột liền kề vị trí vừa đi; sơ đồ được xáo trộn sau mỗi hành trình mới.
- Trong trận, chọn thẻ theo thứ tự trong giới hạn 3 năng lượng, bấm Thi Triển để nhân vật tự tung chiêu. Thử combo Lôi Kiếm → Lôi Bạo, Băng Trảm → Băng Toái, Hỏa Cầu → Bộc Viêm.
- Thắng trận thường/Tinh Anh: nhận vàng, chọn một trong ba thẻ mới và hồi một phần sinh lực.
- Cửa hàng: mua ba thẻ ngẫu nhiên theo giá/độ hiếm, mỗi thẻ chỉ một lần. Thuốc hồi 22 Máu giá 24 vàng.
- Điểm nghỉ: chọn hồi 25 Máu hoặc tăng 8 Máu tối đa kèm hồi 8.
- Sự kiện: một trong ba tình huống ngẫu nhiên, mỗi sự kiện có hai cách giải quyết.
- Đánh bại Boss tầng 6 để hoàn thành V0.2.

**Tự lưu:** Lượt chơi đang diễn ra lưu bằng localStorage trên trình duyệt hiện tại. Tải lại trang để chơi tiếp; không đồng bộ giữa thiết bị và sẽ mất nếu xóa dữ liệu website. Chơi mới yêu cầu xác nhận trước khi ghi đè.

## Chạy tại máy

Dùng một HTTP server ở thư mục dự án, ví dụ: python -m http.server 8000, sau đó truy cập http://localhost:8000. Không dùng file:// vì trình duyệt có thể chặn ES Modules.

Chạy kiểm thử (Node.js 20+): node --test tests/*.test.mjs

Kiến trúc: HTML/CSS/SVG + ES Modules. src/core.mjs chứa luật chiến đấu và hành trình, src/journey.mjs chứa bản đồ, src/main.mjs xử lý giao diện. Không cần backend.

## Quy tắc checkpoint

Xem PLAN.md: Sau mỗi V0.x, phải dừng, kiểm tra GitHub Pages và gửi URL cho người dùng test; chỉ tiếp tục sau khi người dùng xác nhận.