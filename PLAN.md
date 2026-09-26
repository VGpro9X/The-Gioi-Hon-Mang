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
| V0.2 | Bản đồ 6 tầng phân nhánh, cửa hàng, sự kiện, điểm nghỉ, vàng và tự lưu | Đã hoàn thành và được yêu cầu tiếp tục V0.3 |
| V0.3 | Mở rộng 50 thẻ, Độc/Thời Không/Triệu Hồi, combo, Thiên Phú và Phản Ứng | Đã phát hành và được người dùng chấp thuận tiếp tục V0.4 |
| V0.4 | 50 hiệu ứng riêng, rèn thẻ +1, 6 Di Vật, Tinh Anh Xuyên Giáp và Boss chuyển pha | Đã triển khai GitHub Pages; 35/35 kiểm thử đạt; dừng chờ người dùng chơi/test |
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


## V0.2 — CHECKPOINT ĐÃ HOÀN THÀNH

- Bản đồ 6 tầng, 16 điểm và đường đi theo cột liền kề; các điểm sự kiện, nghỉ, cửa hàng được xáo trộn mỗi lần chơi.
- Thắng trận nhận vàng, chọn một thẻ và hồi một ít máu. Trận Tinh Anh và Boss có chỉ số khác trận thường.
- Cửa hàng có 3 thẻ ngẫu nhiên, mỗi thẻ mua một lần; thuốc hồi máu dùng vàng.
- Điểm nghỉ cho chọn hồi máu hoặc tăng máu tối đa; ba sự kiện với lựa chọn đánh đổi.
- Tự động lưu và khôi phục lượt chơi bằng localStorage trên trình duyệt hiện tại.
- Chạy toàn bộ kiểm thử Node.js trước khi tự triển khai GitHub Pages.

**V0.2:** Đã triển khai và được người dùng yêu cầu chuyển sang V0.3.


## V0.3 — CHECKPOINT ĐÃ HOÀN THÀNH

- Mở rộng đúng 30 thẻ (tổng 50): năm thẻ Độc, năm Thời Không, năm Triệu Hồi, năm nguyên tố kết hợp, năm Thiên Phú và năm Phản Ứng.
- Cơ chế Độc: sát thương cuối lượt theo tầng, mỗi lượt giảm một tầng. Triệu hồi Linh Hồn tấn công, Thạch Vệ phòng thủ, giới hạn số lượng để tránh tràn hiệu ứng.
- Thiên Phú tồn tại trong một trận, tối đa hai tầng; reset khi đi vào trận mới. Phản Ứng tồn tại cho tới lúc địch tấn công, được dùng một lần và có giới hạn hai lượt dự trữ.
- Trình tự phản ứng cố định và hữu hạn; khả năng sao chép/khôi phục thẻ có giới hạn, tránh tái kích hoạt đệ quy.
- Combo kết hợp trạng thái nhiều nguyên tố, đặc biệt Hỗn Mang Trảm và Vọng Thời.
- Thư viện 50 thẻ có bộ lọc theo trường phái/loại, bảng trạng thái trận đấu cập nhật thêm triệu hồi, Thiên Phú và Phản Ứng.
- Thưởng chiến thắng có ít nhất một lựa chọn thuộc Thiên Phú hoặc Phản Ứng; cửa hàng luôn có ít nhất một kỹ năng mới.
- Tự động chuyển bản lưu hợp lệ V0.2 sang V0.3; sử dụng khoá lưu mới nên Chơi mới không khôi phục nhầm bản cũ.
- Kiểm thử hồi quy V0.1–V0.2 và các cơ chế V0.3 qua GitHub Actions trước khi phát hành.

**V0.3:** Đã phát hành và được người dùng duyệt để chuyển sang V0.4.


## V0.4 — CHECKPOINT HIỆN TẠI

- Đồ họa tự tạo bằng CSS và DOM có 50 preset định danh độc lập, gồm vệt chém, lôi điện, cầu lửa, băng tinh, độc vụ, cổng thời gian, triệu hồi, hộ mệnh và hỗn mang. Chế độ giảm chuyển động dựa vào cài đặt hệ thống, giới hạn 3–12 hạt cho mỗi kỹ năng.
- Rèn thẻ +1 tại điểm nghỉ (miễn phí, thay thế một lựa chọn nghỉ) hoặc lò rèn cửa hàng (45 vàng, tối đa một lần mỗi lượt ghé). Một lá nâng cấp tối đa một lần theo UID; thẻ gây sát thương thêm một đòn 5 sát thương, thẻ hỗ trợ thêm 5 Khiên.
- Sáu Di Vật tồn tại qua các trận trong cùng hành trình: Lôi Ấn Cổ, Hỏa Chủng, Độc Tinh, Tinh Thuẫn, Chuông Triệu Linh và Huyết Ngọc. Thắng Tinh Anh nhận 1 món chưa sở hữu nếu còn, hoặc mua một món ngẫu nhiên tại cửa hàng.
- Tinh Anh có ý định Xuyên Giáp bỏ qua 50% Khiên. Boss chuyển pha khi còn không quá 50% sinh mệnh: dùng Hấp Thụ Tinh Vân, Cuồng Nộ và Bùng Nổ bỏ qua 25% Khiên. Giao diện có cảnh báo chuyển pha.
- Giao diện chiến đấu hiện hiệu ứng đặc trưng và số sát thương. Điểm nghỉ, cửa hàng có công cụ rèn và quản lý di vật. Thẻ +1 có hiển thị trực quan.
- Tự lưu theo phiên bản V0.4, chuyển bản lưu V0.2 và V0.3 hợp lệ mà không mất bộ bài, vàng hoặc tiến trình; mặc định mới đảm bảo tương thích.
- Kiểm thử hồi quy V0.1–V0.3 và mới cho rèn thẻ, di vật, ý định Tinh Anh/Boss, đồ họa theo thẻ và thao tác UI.

**QUY TẮC DỪNG:** Khi V0.4 triển khai thành công lên GitHub Pages, báo URL và chờ người dùng chơi/test. Chỉ sửa lỗi V0.4 nếu có. Không làm V0.5 trước khi người dùng xác nhận.
