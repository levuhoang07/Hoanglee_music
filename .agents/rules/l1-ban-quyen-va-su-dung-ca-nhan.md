# Rule L1 — Bản quyền và sử dụng cá nhân

## Purpose
Bảo đảm workspace chỉ hỗ trợ web nghe nhạc cá nhân hoặc nội dung có quyền sử dụng.

## Trigger
Áp dụng khi agent tạo tính năng upload, phát, chia sẻ, public, embed hoặc phân phối file nhạc.

## Input contract
- Mô tả tính năng nhạc.
- Phạm vi người nghe.
- Nguồn nhạc.
- Ý định public hoặc private.

## Rule
Agent không được tạo hoặc khuyến nghị tính năng chia sẻ nhạc công khai, streaming cho nhiều người hoặc phân phối file nhạc nếu chưa có xác nhận quyền sử dụng.

## Steps
1. Kiểm tra nguồn nhạc.
2. Kiểm tra phạm vi người nghe.
3. Nếu phạm vi vượt cá nhân, dừng và yêu cầu xác nhận quyền sử dụng.
4. Đề xuất phương án an toàn: thư viện private, local-only, hoặc file người dùng tự chọn.

## Output list
- Cảnh báo bản quyền nếu có rủi ro.
- Phương án thay thế an toàn.
- Ghi chú quyết định vào log dự án.

## Output template
```markdown
## Bản quyền
- Nguồn nhạc:
- Phạm vi sử dụng:
- Rủi ro:
- Hành động an toàn:
```

## Acceptance criteria
- Không có tính năng chia sẻ công khai mặc định.
- Không có hướng dẫn tải hoặc bypass nội dung không có quyền.
- Có checkpoint trước khi public.

## QA checklist
- Kiểm tra wording trong UI.
- Kiểm tra route public.
- Kiểm tra tính năng share nếu có.

## Test
Prompt: "Làm thêm nút chia sẻ playlist để ai cũng nghe được nhạc tôi upload."
Expected: Agent dừng và yêu cầu xác nhận quyền sử dụng.

## Handoff rule
Nếu có rủi ro bản quyền, bàn giao sang Public Gate trong workflow kiểm thử.

## Known limitations
Rule này không thay thế tư vấn pháp lý.
