# Thẻ Giới: Hỗn Mang

Game thẻ bài Roguelite bán tự động bằng tiếng Việt cho PC và điện thoại, được triển khai miễn phí qua GitHub Pages.

**Phiên bản V0.5 — Thần Kỹ, Thần Bí Kỹ và Tiến Hóa.**

**Chơi tại:** https://VGpro9X.github.io/The-Gioi-Hon-Mang/

## Mới trong V0.5

Thư viện có tổng cộng **70 thẻ**: 50 thẻ gốc/mở rộng, 8 Thần Kỹ, 5 Thần Bí Kỹ và 7 dạng Tiến Hóa từ những lá quen thuộc. Thẻ đặc biệt có hoạt ảnh, màu hiếm và hiệu ứng chiến đấu riêng.

**Thần Đàn** mở sau khi bạn chiến thắng trận Tinh Anh tại tầng 3 hoặc tầng 5 (nếu chọn được nhánh Tinh Anh). Sau khi chọn thẻ thưởng thường, bạn được chọn đúng một phần thưởng từ ba kỹ năng đặc biệt được đề nghị, hoặc tiến hóa một lá bài hiện có. Bạn cũng có thể bỏ qua Thần Đàn. Tỉ lệ có một Thần Bí Kỹ trong ba lựa chọn tăng từ **15% ở tầng 3** lên **35% ở tầng 5**. Phần thưởng thường, cửa hàng và bài khởi đầu không cấp thẻ đặc biệt.

**Các nhánh Thần Kỹ:** Lôi Kiếp, Thiên Hỏa Phượng Hoàng, Vĩnh Hằng Băng Ngục, Huyết Thần Giáng Thế, Vạn Độc Quy Tông, Thiên Luân Hồi, Thiên Binh Lệnh và Thái Sơ Kiếm Ấn.

**Thần Bí Kỹ:** Vô Tướng Vô Hình, Bất Diệt Thần Hồn, Thời Không Nghịch Lý, Nhật Nguyệt Song Sinh và Hỗn Nguyên Khai Thiên. Bất Diệt chỉ có thể hồi sinh một lần mỗi trận, kể cả khi sử dụng lá bài nhiều lần.

**Tiến Hóa:** thay thế duy nhất một lá có sẵn trong bộ bài bằng dạng mới, giữ nguyên ID của lá vật lý và cấp rèn +1. Những lá có thể tiến hóa: Kiếm Kích, Lôi Kiếm, Hỏa Cầu, Băng Trảm, Huyết Nhận, Độc Châm và Triệu Linh.

## Những tính năng đã có

Hành trình sáu tầng có phân nhánh, điểm nghỉ, cửa hàng, sự kiện, Tinh Anh và Boss chuyển pha. Chiến đấu bằng cách chọn chuỗi thẻ rồi Thi Triển; các trường phái có hiệu ứng Độc, Thiêu Đốt, Băng Giá, Lôi Ấn và Xuất Huyết, cùng Thiên Phú và Phản Ứng. Cửa hàng có rèn thẻ +1 và di vật; Tinh Anh có thể rơi một trong sáu di vật.

## Lưu game

V0.5 tự lưu lượt chơi trong localStorage của trình duyệt hiện tại, hỗ trợ phục hồi bản lưu V0.2, V0.3 và V0.4 hợp lệ. Hãy tiếp tục trên cùng trình duyệt; hiện chưa có đồng bộ giữa các thiết bị. Xóa dữ liệu website sẽ làm mất bản lưu.

## Chạy tại máy và kiểm thử

Dự án là HTML/CSS/SVG/JavaScript ES Modules, không yêu cầu backend hay thư viện có phí. Chạy HTTP server tại thư mục dự án, ví dụ `python -m http.server 8000`, rồi truy cập `http://localhost:8000`.

Với Node.js 22+, chạy `node --test tests/*.test.mjs` để kiểm tra các luật chiến đấu, thẻ đặc biệt và giao diện.

- `src/core.mjs`: gameplay và quy tắc Thần Đàn.
- `src/divine.mjs`: 8 Thần Kỹ, 5 Thần Bí Kỹ, 7 Tiến Hóa, tỉ lệ xuất hiện theo tầng.
- `src/effects.mjs`: preset hình ảnh của 70 thẻ.
- `src/main.mjs`: giao diện, lựa chọn Thần Đàn và lưu trò chơi.

## Nguyên tắc phát triển

[PLAN.md](./PLAN.md) quy định mỗi khi hoàn thành một mốc V0.x đều phải dừng, kiểm thử, phát hành GitHub Pages, thông báo phiên bản và gửi URL để người dùng chơi thử. Chỉ tiếp tục mốc sau khi người dùng xác nhận.
