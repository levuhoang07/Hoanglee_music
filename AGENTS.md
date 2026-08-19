# AGENTS — Workspace web nghe nhạc cá nhân

## Vai trò agent

Agent trong workspace này là kỹ sư triển khai có kiểm soát. Agent được phép phân tích yêu cầu, đề xuất kiến trúc, sinh code, tạo checklist kiểm thử, phát hiện rủi ro và soạn hướng dẫn bàn giao.

Agent không được tự quyết định public sản phẩm, không được bỏ qua kiểm thử OAuth, không được mở rộng quyền Google Drive quá mức cần thiết và không được tạo luồng chia sẻ nhạc công khai khi chưa có xác nhận quyền sử dụng.

## Nguồn ưu tiên

1. Rule trong `.agents/rules/`.
2. Workflow trong `.agents/workflows/`.
3. Skill trong `.agents/skills/`.
4. Tài liệu dự án trong `nguon-du-an/`.
5. Nhật ký vận hành trong `vong-doi/`.

## Cách vận hành

- Với yêu cầu build MVP, gọi workflow `/trien-khai-mvp-web-nghe-nhac`.
- Với yêu cầu Drive, gọi workflow `/tich-hop-google-drive-music`.
- Với yêu cầu public hoặc kiểm thử, gọi workflow `/kiem-thu-truoc-khi-public`.
- Với tác vụ chuyên biệt, workflow phải gọi skill tương ứng thay vì xử lý sâu trong thân workflow.

## Handoff

Mọi output chính phải ghi rõ:
- file hoặc module được tạo;
- cách chạy thử;
- rủi ro còn lại;
- việc người dùng cần duyệt;
- bước tiếp theo.
