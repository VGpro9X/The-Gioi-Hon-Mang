# KẾ HOẠCH PHÁT TRIỂN — THẺ GIỚI: HỖN MANG

> Game thẻ bài Roguelite chiến đấu bán tự động. Thiết kế cho PC và điện thoại, chơi đơn, miễn phí trên GitHub Pages. Bản kế hoạch được duyệt ngày 26/09/2026.

## QUY TẮC CHECKPOINT BẮT BUỘC

**Hoàn thành từng phiên bản V0.x thì PHẢI DỪNG.**
1. Chỉ triển khai đúng phạm vi của phiên bản đang làm; kiểm tra gameplay và lỗi cơ bản.
2. Commit và push tất cả thay đổi lên repo `VGpro9X/The-Gioi-Hon-Mang`.
3. Triển khai trên GitHub Pages công khai, kiểm tra build và đường dẫn hoạt động.
4. Báo người dùng phiên bản đã hoàn thành, thay đổi chính và **URL GitHub Pages để chơi/test trên PC hoặc điện thoại**.
5. **Không triển khai phiên bản tiếp theo khi người dùng chưa test và xác nhận.** Nếu người dùng yêu cầu sửa phiên bản hiện tại, sửa và cập nhật checkpoint đó trước.
6. Khi môi trường chưa cho phép kích hoạt/kiểm tra GitHub Pages, phải báo đúng trạng thái và hướng dẫn một bước cấu hình còn thiếu; tuyệt đối không tuyên bố đã triển khai khi chưa xác thực.

## ĐỊNH HƯỚNG

- Người chơi có thể học kỹ năng đa trường phái, phối hợp Lôi / Hỏa / Băng / Huyết / Kiếm / Phòng thủ / Hỗn Mang.
- Chọn thẻ theo thứ tự rồi nhân vật tự thi triển; có năng lượng, ý định địch, Khiên, hiệu ứng trạng thái, combo.
- Thêm thẻ sau chiến thắng, đi qua bản đồ phân nhánh, kiếm di vật, phát triển bộ bài đa hướng; về sau có Thần Kỹ / Thần Bí Kỹ và Sinh Tồn vô hạn.
- Ưu tiên hoạt ảnh rõ, giao diện Việt hóa và responsive trên điện thoại, hạn chế cuộn dọc.

## CÁC MỐC PHÁT TRIỂN

| Mốc | Nội dung | Trạng thái |
|---|---|---|
| V0.1 | Prototype 20 thẻ, chiến đấu chọn chuỗi, layout PC/mobile | Đã hoàn thành; người dùng đồng ý tiếp tục |
| V0.2 | Bản đồ 6 tầng phân nhánh, cửa hàng, sự kiện, điểm nghỉ, vàng và tự lưu | Đã viết mã; chờ kiểm thử Pages và người dùng đánh giá |
| V0.3 | Mở rộng ~50 thẻ, nhiều nguyên tố và combo; kỹ năng bị động, phản ứng | Chưa bắt đầu |
| V0.4 | Hoạt ảnh và hiệu ứng đặc trưng, nâng cấp thẻ, di vật, quái tinh anh và boss | Chưa bắt đầu |
| V0.5 | Thần Kỹ, Thần Bí Kỹ, tiến hóa và biến thể kỹ năng hiếm | Chưa bắt đầu |
| V0.6 | Hành Trình đầy đủ với nhiều khu vực, cân bằng, thành tích và mở khóa | Chưa bắt đầu |
| V0.7 | Chế độ Sinh Tồn vô hạn, tăng độ khó và thành tích cá nhân | Chưa bắt đầu |

## CẤU TRÚC V0.1

- `src/core.mjs`: luật chiến đấu thuần dữ liệu, 20 thẻ, hiệu ứng và xử lý từng lượt; không phụ thuộc trình duyệt.
- `src/main.mjs`: giao diện DOM, hiển thị chiến trường SVG và hoạt ảnh đơn giản.
- `src/style.css`: bố cục và hiệu ứng responsive.
- `tests/core.test.mjs`: kiểm thử luật chiến đấu với Node.js.
- `.github/workflows/pages.yml`: tự động kiểm thử và phát hành GitHub Pages khi push vào main.

**Quyết định kỹ thuật V0.1:** Web tĩnh HTML/CSS/ES Modules, không cần npm/build để chạy trực tiếp trên GitHub Pages và giảm lỗi môi trường. Gameplay tách khỏi giao diện để chuyển dần sang Vue + Phaser khi bước phát triển cần hệ thống animation phức tạp hơn. Bản V0.1 dùng SVG và CSS cho nhân vật, thẻ và hiệu ứng ban đầu; không sử dụng hình ảnh/tài sản có bản quyền.

## TIÊU CHÍ NGHIỆM THU V0.1

- [x] Bộ bài khởi đầu có thể chơi và thư viện đủ 20 kỹ năng.
- [x] Xem ý định kẻ địch, xếp thẻ trong giới hạn năng lượng, thực hiện theo thứ tự chọn.
- [x] Có Khiên, Kiếm Ý, Thiêu Đốt, Xuất Huyết, Băng Giá, Lôi Ấn và tương tác combo.
- [x] Có thể chiến đấu 3 ải, chọn thẻ thưởng và chơi lại; lưu số lượt hoàn thành.
- [x] Giao diện tiếng Việt, đáp ứng màn hình PC/mobile.
- [x] Đã xác nhận Pages V0.1 và URL công khai.
- [x] Người dùng cho phép bắt đầu V0.2.


## V0.2 — CHECKPOINT HIỆN TẠI

- Bản đồ 6 tầng, 16 điểm và đường đi theo cột liền kề; các điểm sự kiện, nghỉ, cửa hàng được xáo trộn mỗi lần chơi.
- Thắng trận nhận vàng, chọn một thẻ và hồi một ít máu. Trận Tinh Anh và Boss có chỉ số khác trận thường.
- Cửa hàng có 3 thẻ ngẫu nhiên, mỗi thẻ mua một lần; thuốc hồi máu dùng vàng.
- Điểm nghỉ cho chọn hồi máu hoặc tăng máu tối đa; ba sự kiện với lựa chọn đánh đổi.
- Tự động lưu và khôi phục lượt chơi bằng localStorage trên trình duyệt hiện tại.
- Chạy toàn bộ kiểm thử Node.js trước khi tự triển khai GitHub Pages.

**DỪNG sau V0.2:** Sau khi build/deploy thành công, gửi link và chờ người dùng test và xác nhận rồi mới làm V0.3.
