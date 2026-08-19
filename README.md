# Gói giải pháp web nghe nhạc cá nhân v0.1

Gói này dùng để mở workspace trong Google Antigravity và triển khai MVP web nghe nhạc cá nhân. Trọng tâm là web app có upload nhạc local, chọn nhạc từ Google Drive, player, thư viện nhạc, playlist và visual hoạt họa khi phát nhạc.

## Cách dùng nhanh

1. Mở thư mục này trong Antigravity.
2. Đọc `GIOI-THIEU.md` để hiểu phạm vi.
3. Gọi workflow chính: `/trien-khai-mvp-web-nghe-nhac`.
4. Sau khi có MVP local, gọi `/tich-hop-google-drive-music`.
5. Trước khi public, gọi `/kiem-thu-truoc-khi-public`.

## Ranh giới quan trọng

- Dự án ưu tiên dùng nhạc cá nhân hoặc nhạc có quyền sử dụng.
- Không thiết kế tính năng chia sẻ nhạc công khai nếu chưa có xác nhận bản quyền.
- Không lưu secret hoặc token dài hạn trong frontend.
- Không tự public nếu chưa qua Public Gate.
