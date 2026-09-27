# Thẻ Giới: Hỗn Mang

Game thẻ bài Roguelite chiến đấu bán tự động, giao diện tiếng Việt, tối ưu PC và điện thoại. Phát hành miễn phí qua GitHub Pages.

**Phiên bản V0.6 — Hành Trình Tam Giới, Thành Tích và Mở Khóa.**

**Chơi ngay:** https://vgpro9x.github.io/The-Gioi-Hon-Mang/

## Hành trình V0.6 — 18 tầng, ba khu vực

Hành trình nay có ba khu vực độc lập, mỗi khu vực gồm sáu tầng và một Boss cuối:

- **Tinh Vân Khởi Nguyên:** khu vực mở đầu, đánh bại Thủ Vệ Tinh Giới.
- **Vực Sâu Hư Không:** kẻ địch nhiều máu hơn, có chiêu Hư Không Hấp Huyết giúp hồi phục khi đánh trúng; Boss là Chúa Tể Hư Không.
- **Long Mạch Hỗn Mang:** kẻ địch tiếp tục mạnh lên, có đòn Long Khí Phá Giáp xuyên 30% Khiên; Boss cuối là Hỗn Mang Thần Long.

Sau khi hạ Boss vùng I và II, người chơi chọn **một trong ba Phúc Lành**, rồi bước vào bản đồ ngẫu nhiên mới: Tẩy Tủy Tinh Quang (+12 Máu tối đa, hồi 24 Máu), Tinh Vân Tài Khố (+90 vàng) hoặc Linh Hồn Chúc Phúc (một Di Vật chưa sở hữu, hoặc 60 vàng nếu đã có đủ sáu, đồng thời hồi 12 Máu). **Giữ nguyên bộ bài, Di Vật, thẻ rèn và vàng** khi chuyển vùng. Mỗi vùng có phối màu riêng; đối thủ tăng máu, sát thương và Khiên theo cấp vùng. Vàng và lượng hồi sau các trận cũng tăng nhẹ, kết hợp các Phúc Lành để chuẩn bị cho vùng sau.

## Thành tích và mở khóa

Có **8 thành tích** lưu trên trình duyệt: đánh bại Boss từng khu vực, sở hữu Thần Kỹ/Thần Bí Kỹ, thu thập ba Di Vật, rèn ba lá bài, hoàn thành Tam Giới với đủ vàng hoặc máu. Nhấn **Thành tích** trong giao diện để xem toàn bộ mục tiêu và tiến độ.

Hai phần thưởng cho lần chơi mới: sau khi vượt Boss vùng I, bạn mở khóa **+8 Máu tối đa** khởi đầu; sau khi hoàn thành cả ba vùng, lần chơi tiếp theo có **thêm một lá Uncommon**. Thành tích không tự động đồng bộ giữa điện thoại và PC.

## Các hệ thống kế thừa

Thư viện có 70 thẻ gồm 50 kỹ năng thường, 8 Thần Kỹ, 5 Thần Bí Kỹ và 7 tiến hóa. Kỹ năng của mọi trường phái có hoạt ảnh riêng. Thiên Phú và Phản Ứng tự kích hoạt theo điều kiện; Độc, Lôi, Hỏa, Băng, Huyết và Hỗn Mang có thể kết hợp thành combo.

Thắng Tinh Anh để nhận Di Vật và mở Thần Đàn: chọn một Thần Kỹ, có cơ hội gặp Thần Bí Kỹ, hoặc tiến hóa một lá bài hiện có. Xác suất xuất hiện Thần Bí Kỹ là 15% ở tầng 3 và 35% ở tầng 5 trong mỗi khu vực. Có thể rèn thẻ +1 ở điểm nghỉ hoặc cửa hàng.

## Lưu game và chuyển phiên bản

V0.6 tự lưu tiến trình đang chơi bằng `localStorage` ở trình duyệt hiện tại (`tghm-v06-save`) và lưu riêng hồ sơ thành tích (`tghm-v06-profile`). Hệ thống tiếp tục được các bản lưu V0.2–V0.5 hợp lệ. **Bản lưu V0.5 đã thắng Boss sáu tầng có thể tiếp tục thẳng tại màn Phúc Lành để bước vào vùng II**, không phải tạo lại lượt mới. Nếu muốn nhận các phần thưởng mở khóa khi bắt đầu, chọn Chơi Mới sau khi mở thành tích.

Dữ liệu chưa đồng bộ giữa các thiết bị. Xóa dữ liệu website sẽ mất lưu game lẫn thành tích.

## Chạy và kiểm thử

Dự án tĩnh dùng HTML/CSS/SVG và JavaScript ES Modules, không cần backend, npm hoặc thư viện đồ họa trả phí. Tại thư mục dự án, chạy `python -m http.server 8000` rồi truy cập `http://localhost:8000`.

Dùng Node.js 22+ để kiểm thử:

```sh
node --check src/core.mjs
node --check src/campaign.mjs
node --check src/main.mjs
node --test tests/*.test.mjs
```

- `src/campaign.mjs`: ba khu vực, Phúc Lành, hồ sơ thành tích và mở khóa.
- `src/core.mjs`: chiến đấu, 18 tầng, chuyển vùng, chọn thưởng và chuyển bản lưu cũ.
- `src/divine.mjs`, `src/expansion.mjs`, `src/effects.mjs`, `src/relics.mjs`: kỹ năng, đồ họa và Di Vật.
- `src/main.mjs` và `src/style.css`: giao diện Tam Giới, hồ sơ thành tích và layout responsive.

## Quy tắc checkpoint

Theo [PLAN.md](./PLAN.md), hoàn thành mỗi phiên bản V0.x đều **phải dừng**, đẩy mã lên GitHub, chạy kiểm thử, triển khai GitHub Pages và gửi URL công khai để người dùng chơi/test. Chỉ bắt đầu phiên bản tiếp theo khi có xác nhận.
