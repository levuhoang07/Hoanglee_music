# Bản đồ giải pháp

## Kiến trúc tổng quan

User mở web app, đưa nhạc vào bằng local upload hoặc Google Drive Picker. App lưu metadata vào thư viện nhạc, điều khiển player và chạy visual hoạt họa khi nhạc phát.

```text
User
  -> Web UI
  -> Music Library
     -> Local Upload
     -> Google Drive Picker
     -> Playlist Manager
  -> Audio Engine
  -> Visual Layer
  -> QA + Deploy
```

## Component Map

| Component | Tên | Mục đích |
|---|---|---|
| Rule | l1-ban-quyen-va-su-dung-ca-nhan | Kiểm soát bản quyền và phạm vi cá nhân |
| Rule | l1-bao-mat-drive-oauth | Kiểm soát OAuth và quyền Drive |
| Rule | l1-khong-luu-secret-tren-client | Chặn lưu secret trong frontend |
| Rule | l2-chat-luong-audio-visual | Đảm bảo trải nghiệm nghe và visual |
| Workflow | trien-khai-mvp-web-nghe-nhac | Điều phối build MVP |
| Workflow | tich-hop-google-drive-music | Điều phối tích hợp Drive |
| Workflow | kiem-thu-truoc-khi-public | Kiểm thử trước deploy |
| Skill | lap-ke-hoach-san-pham | Tạo backlog và milestone |
| Skill | xay-player-am-thanh | Xây audio player |
| Skill | ket-noi-google-drive | Tạo Drive connector |
| Skill | quan-ly-thu-vien-nhac | Quản lý thư viện và playlist |
| Skill | tao-visual-hoat-hoa | Tạo bot hoặc visual chuyển động |
| Skill | kiem-thu-web-nhac | Tạo test report |

## Human-Agent Role Map cấp giải pháp

| Bước | Agent làm | Người làm | Ai duyệt |
|---|---|---|---|
| Chốt scope | Đề xuất MVP | Chọn phạm vi | Chủ dự án |
| Build player | Sinh code và hướng dẫn test | Chạy thử | Chủ dự án |
| Drive OAuth | Sinh hướng dẫn và code mẫu | Tạo credential | Chủ dự án |
| Visual | Tạo prototype | Chọn phong cách | Chủ dự án |
| Public | Tạo QA report | Quyết định deploy | Chủ dự án |
