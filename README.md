# Thẻ Giới: Hỗn Mang

Game thẻ bài Roguelite bán tự động, chơi bằng tiếng Việt trên PC và điện thoại, phát hành miễn phí trên GitHub Pages.

**Phiên bản V0.3 — Mở rộng hệ thống kỹ năng: 50 thẻ.**

**Chơi:** https://VGpro9X.github.io/The-Gioi-Hon-Mang/

## Tính năng V0.3

- **30 thẻ mới** bên cạnh 20 thẻ từ V0.1–V0.2: Độc, Thời Không, Triệu Hồi, kỹ năng phối hợp và kỹ năng thuộc hai loại mới là Thiên Phú, Phản Ứng.
- **Độc:** gây sát thương cuối lượt, giảm dần mỗi lượt; có thẻ tích tầng, kích nổ hoặc đổi tầng Độc lấy Khiên.
- **Thời Không:** rút thêm bài, đưa thẻ từ chồng bài bỏ về tay, hồi năng lượng, tung dư âm của chiêu tấn công/phép trước đó.
- **Triệu Hồi:** Linh Hồn tự tấn công cuối lượt, Thạch Vệ che chắn trước đòn địch; có kỹ năng hiến tế hoặc khuếch đại theo số lượng triệu hồi.
- **Phối hợp nguyên tố:** kết hợp Băng/Hỏa, Lôi/Hỏa, Băng/Lôi và Huyết/Hỏa; Hỗn Mang Trảm hấp thụ cả năm trạng thái.
- **Thiên Phú:** hiệu ứng được kích hoạt khi sử dụng lá bài và tồn tại đến cuối trận chiến; mỗi loại cộng dồn tối đa hai tầng và làm mới khi gặp trận khác.
- **Phản Ứng:** dùng bài để chuẩn bị trước; tự kích hoạt khi địch thực sự tấn công, không tiêu hao khi địch dựng Khiên. Mỗi loại có tối đa hai lượt dự trữ.
- **Thư viện 50 thẻ:** có bộ lọc theo trường phái và loại kỹ năng. Trong trận hiển thị Độc, triệu hồi, Thiên Phú và Phản Ứng đã chuẩn bị.
- **Phần thưởng:** sau chiến thắng, luôn có ít nhất một lựa chọn Thiên Phú hoặc Phản Ứng; cửa hàng có ít nhất một thẻ thuộc phần mở rộng V0.3.

## Cách chơi

1. Trên bản đồ sáu tầng, chọn nhánh cùng cột hoặc sát cột hiện tại; ghé điểm nghỉ, cửa hàng, sự kiện, đấu Tinh Anh và Boss.
2. Trong trận, chọn bài theo thứ tự trong giới hạn năng lượng, nhấn **Thi Triển** để nhân vật tự tung chuỗi kỹ năng.
3. Tận dụng trạng thái Độc, Lôi Ấn, Thiêu Đốt, Băng Giá, Xuất Huyết để kích hoạt combo. Chuẩn bị Phản Ứng khi sắp bị đánh.
4. Thư viện thẻ mở bằng nút **Bộ thẻ**, hỗ trợ lọc Thiên Phú, Phản Ứng và các trường phái.

**Lưu tiến trình:** V0.3 tự lưu trong localStorage trên trình duyệt bạn đang dùng và tự nhận bản lưu V0.2 hợp lệ ở lần mở đầu tiên. Không đồng bộ giữa các thiết bị. Xóa dữ liệu website sẽ mất bản lưu; chọn Chơi mới có hộp thoại xác nhận. Không nên chạy nhiều tab để chỉnh sửa một lượt chơi song song.

## Chạy thử từ mã nguồn

Dự án tĩnh HTML/CSS/SVG + JavaScript ES Modules, không yêu cầu backend hay npm. Mở HTTP server trong thư mục dự án, ví dụ `python -m http.server 8000` và truy cập `http://localhost:8000`.

Kiểm thử (Node.js 22+):

```sh
node --check src/core.mjs
node --check src/expansion.mjs
node --check src/main.mjs
node --test tests/*.test.mjs
```

`src/core.mjs` xử lý chiến đấu và hành trình; `src/expansion.mjs` khai báo 30 thẻ mới; `src/journey.mjs` sinh bản đồ; `src/main.mjs` hiển thị giao diện.

## Quy tắc checkpoint

Theo [PLAN.md](./PLAN.md), sau khi hoàn thành mỗi phiên bản V0.x phải **dừng, kiểm thử, cập nhật GitHub Pages, gửi URL để người dùng chơi thử và đợi xác nhận** rồi mới chuyển sang phiên bản tiếp theo.
