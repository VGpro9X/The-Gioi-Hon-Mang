# Thẻ Giới: Hỗn Mang

Game thẻ bài Roguelite chơi đơn, Việt hóa, thiết kế cho PC và điện thoại.

**Phiên bản hiện tại: V0.1 — Prototype chiến đấu.** Chọn các lá bài theo thứ tự (tối đa 3 năng lượng), nhấn **Thi Triển** để thực hiện chuỗi kỹ năng, tận dụng hiệu ứng trạng thái và vượt qua 3 ải. Thư viện V0.1 có 20 kỹ năng. Giữa các ải, chọn một trong ba lá bài thưởng.

**Chơi trên GitHub Pages (sau khi Actions triển khai thành công):** https://VGpro9X.github.io/The-Gioi-Hon-Mang/

## Hướng dẫn

- Chọn thẻ để thêm vào chuỗi. Chạm lại vào thẻ hoặc nút trong hàng chuỗi để bỏ chọn.
- Nhấn Thi Triển hoặc Kết Thúc Lượt; kẻ địch hành động cuối lượt theo ý định đã hiển thị.
- Lôi Kiếm → Lôi Bạo, Hỏa Cầu → Bộc Viêm, Băng Trảm → Băng Toái là các combo thử nghiệm.
- Chiến thắng 3 ải để hoàn thành prototype. Có thể bắt đầu lượt chơi mới với hai thẻ khởi đầu ngẫu nhiên khác.
- Trò chơi chạy trực tiếp trong trình duyệt, không cần tài khoản. Thành tích hoàn thành được lưu cục bộ bằng localStorage; tiến trình đang chơi chưa được lưu trong V0.1.

## Chạy tại máy

Chạy một HTTP server tại thư mục dự án (ví dụ `python -m http.server 8000`), sau đó mở `http://localhost:8000`. Không nên mở bằng `file://` vì ES Modules có thể bị trình duyệt chặn.

Chạy kiểm thử (Node.js 20+):

```sh
node --test tests/core.test.mjs
```

## Kiến trúc

Giao diện V0.1 hiện sử dụng native ES Modules + SVG/CSS để chạy ngay trên GitHub Pages. Engine chiến đấu được tách riêng trong `src/core.mjs` để tiện mở rộng và chuyển giao diện sang Vue/Phaser về sau.

**[Đọc PLAN.md](./PLAN.md)** để xem roadmap V0.1–V0.7 và **quy tắc checkpoint bắt buộc**: làm xong từng V0.x phải dừng, deploy và gửi link cho người dùng test; chỉ tiếp tục sau khi được xác nhận.
