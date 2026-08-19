# Tiêu chí kiểm thử

## Player

- Phát được ít nhất MP3 và WAV trong môi trường test.
- Play, pause, seek, volume hoạt động.
- Next, previous, shuffle, repeat hoạt động nếu có playlist.
- Khi file lỗi, app hiển thị thông báo rõ.

## Upload local

- Người dùng chọn được file audio từ máy.
- File không phải audio bị từ chối.
- File lớn không làm treo toàn bộ giao diện.
- Metadata cơ bản được hiển thị nếu đọc được.

## Google Drive

- Người dùng mở được Picker.
- Người dùng chọn được file audio.
- App không yêu cầu quyền rộng hơn nhu cầu MVP.
- Khi người dùng từ chối quyền, app báo lỗi dễ hiểu.

## Visual

- Bot hoặc nền hoạt họa chạy loop.
- Hoạt họa không làm giật âm thanh rõ rệt.
- Có trạng thái khi nhạc dừng.
- Có fallback khi trình duyệt yếu.

## Public Gate

- Không có secret trong frontend.
- Không log token.
- Có cảnh báo phạm vi sử dụng cá nhân.
- Chủ dự án duyệt trước khi deploy.
