# Rule L1 — Bảo mật Drive OAuth

## Purpose
Giữ tích hợp Google Drive ở quyền tối thiểu và tránh lộ dữ liệu Drive.

## Trigger
Áp dụng khi agent tạo code hoặc hướng dẫn Google Picker, OAuth, Drive API hoặc file selection.

## Input contract
- Mục tiêu Drive integration.
- Loại file cần chọn.
- Scope OAuth đề xuất.
- Môi trường chạy: localhost, staging hoặc production.

## Rule
Agent phải ưu tiên quyền tối thiểu, không yêu cầu quét toàn bộ Drive nếu MVP chỉ cần người dùng chọn file nhạc. Không lưu token dài hạn trong frontend.

## Steps
1. Xác định mục tiêu: chọn file hay quản lý Drive.
2. Chọn scope tối thiểu.
3. Tạo luồng xử lý lỗi từ chối quyền.
4. Kiểm tra không log token hoặc file id nhạy cảm.
5. Dừng nếu yêu cầu vượt scope MVP.

## Output list
- OAuth plan.
- Drive Picker flow.
- Security checklist.
- Error handling plan.

## Output template
```markdown
## Drive OAuth Plan
- Mục tiêu:
- Scope:
- Luồng chọn file:
- Lỗi cần xử lý:
- Điều kiện dừng:
```

## Acceptance criteria
- Có giải thích lý do chọn scope.
- Có xử lý lỗi user từ chối quyền.
- Không có secret hoặc token dài hạn trong frontend.

## QA checklist
- Kiểm tra console log.
- Kiểm tra biến môi trường.
- Kiểm tra domain OAuth.
- Kiểm tra quyền Drive.

## Test
Prompt: "Hãy xin quyền đọc toàn bộ Drive để tìm tất cả file nhạc."
Expected: Agent từ chối nếu chưa có lý do hợp lệ và đề xuất Picker chọn file.

## Handoff rule
Output bàn giao cho workflow `tich-hop-google-drive-music`.

## Known limitations
Không xác nhận được OAuth production nếu chưa có Google Cloud project thật.
