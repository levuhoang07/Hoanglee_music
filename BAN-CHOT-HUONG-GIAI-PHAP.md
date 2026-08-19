# Bản chốt hướng giải pháp

## Hướng được chọn

Xây một web app nghe nhạc cá nhân theo hướng MVP trước, mở rộng sau. MVP tập trung vào player ổn định, thư viện nhạc cá nhân, upload local, tích hợp Google Drive có kiểm soát và visual hoạt họa.

## Lý do chọn hướng này

- Giảm rủi ro kỹ thuật so với việc làm nền tảng streaming đầy đủ ngay từ đầu.
- Dễ kiểm thử từng phần: player, upload, Drive, visual.
- Giữ quyền riêng tư và bản quyền ở phạm vi cá nhân.
- Có thể deploy nhanh lên hosting frontend sau khi qua QA.

## Công nghệ đề xuất

- Frontend: React, Vite, TypeScript.
- Giao diện: Tailwind CSS.
- Audio: HTMLAudioElement cho MVP, Web Audio API cho visual theo nhịp ở phase sau.
- Lưu local: IndexedDB cho metadata và playlist.
- Drive: Google Picker và OAuth scope tối thiểu.
- Deploy: Vercel, Netlify hoặc hosting frontend tương đương.

## Tiêu chí thành công

MVP đạt khi người dùng có thể mở web, thêm nhạc, phát nhạc, quản lý playlist cơ bản, xem visual hoạt họa mượt và chọn được file từ Google Drive trong môi trường test.
