# Thẻ Giới: Hỗn Mang

Game thẻ bài Roguelite bán tự động bằng tiếng Việt cho PC và điện thoại, phát hành miễn phí qua GitHub Pages. Chọn chuỗi thẻ trong giới hạn năng lượng, nhân vật tự thi triển, phối hợp nhiều trường phái và xây dựng bộ bài khác nhau trên mỗi hành trình.

**Phiên bản hiện tại: V0.4 – Rèn Thẻ, Di Vật và Hiệu Ứng Chiến Đấu.**

**Chơi tại:** https://VGpro9X.github.io/The-Gioi-Hon-Mang/

## Tính năng mới V0.4

- Hiệu ứng riêng theo từng thẻ trong thư viện 50 kỹ năng: chém kiếm, sét, lửa, băng, máu, độc, thời gian, triệu hồi, phòng ngự và hỗn mang. Có hiệu ứng nổi sát thương, dấu hiệu Boss chuyển pha và hỗ trợ giảm chuyển động theo cài đặt hệ thống.
- **Rèn thẻ +1:** tại Điểm Nghỉ (thay thế hồi máu hoặc thể phách) hoặc Lò Rèn trong cửa hàng (45 vàng, chỉ một lần/lượt ghé). Chọn một lá chưa rèn: thẻ gây sát thương thêm một đòn 5 sát thương, thẻ hỗ trợ thêm 5 Khiên khi sử dụng.
- **6 Di Vật tồn tại qua một hành trình:** Lôi Ấn Cổ, Hỏa Chủng, Độc Tinh, Tinh Thuẫn, Chuông Triệu Linh và Huyết Ngọc. Tinh Anh rơi một di vật chưa sở hữu nếu còn, cửa hàng có thể bán một món chưa có. Mỗi di vật có hiệu ứng gắn với kỹ năng, trận đấu hoặc chiến thắng.
- **Tinh Anh** dùng đòn Xuyên Giáp bỏ qua 50% Khiên. **Boss** chuyển pha khi còn không quá 50% máu, đổi ý định sang Hấp Thụ Tinh Vân, Cuồng Nộ hoặc Bùng Nổ xuyên 25% Khiên.
- Giao diện bản đồ, trận đấu và cửa hàng hiển thị di vật; thẻ +1 có viền và tên đặc biệt.

## Tính năng nền từ V0.3

Thư viện có 50 thẻ gồm Kiếm Đạo, Lôi, Hỏa, Băng, Huyết, Độc, Thời Không, Triệu Hồi và Hỗn Mang. Thiên Phú tồn tại hết trận và Phản Ứng tự kích hoạt khi địch tấn công. Chọn các lá theo thứ tự rồi bấm Thi Triển; các lá rút và khôi phục có thể mở thêm chuỗi trong cùng lượt. Bản đồ sáu tầng có nhánh rẽ, cửa hàng, sự kiện, điểm nghỉ, Tinh Anh và Boss.

## Lưu game

Tiến trình tự lưu trên trình duyệt đang chơi. V0.4 đọc được bản lưu hợp lệ V0.2 và V0.3 và bổ sung các trường mới; dùng cùng trình duyệt để tiếp tục lượt cũ. Dữ liệu không đồng bộ giữa PC và điện thoại; xóa dữ liệu website sẽ mất bản lưu. Chơi mới có xác nhận trước khi ghi đè.

## Chạy thử từ mã nguồn

Web tĩnh HTML/CSS/SVG/ES Modules, không cần backend hoặc thư viện có phí. Mở HTTP server trong thư mục dự án, ví dụ python -m http.server 8000, sau đó truy cập http://localhost:8000.

Kiểm thử bằng Node.js 22+: node --check src/core.mjs && node --check src/main.mjs && node --test tests/*.test.mjs.

- src/core.mjs: luật chiến đấu, hành trình, nâng cấp, di vật và Boss.
- src/expansion.mjs: 30 thẻ mở rộng từ V0.3.
- src/effects.mjs: 50 hiệu ứng định danh, không phụ thuộc trình duyệt.
- src/relics.mjs: sáu di vật; src/journey.mjs: bản đồ.
- src/main.mjs: giao diện và điều khiển.

## Quy tắc checkpoint

[PLAN.md](./PLAN.md) quy định sau mỗi V0.x phải dừng, chạy kiểm thử, triển khai GitHub Pages và gửi URL cho người dùng test. Chỉ tiếp tục sau khi được xác nhận.
