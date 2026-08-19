---
name: quan-ly-thu-vien-nhac
description: Quản lý thư viện nhạc — dùng khi cần tạo schema thư viện, playlist và metadata.
---

# Skill: Quản lý thư viện nhạc

## Purpose
Skill này giúp agent tạo schema thư viện, playlist và metadata để phục vụ triển khai web nghe nhạc cá nhân.

## When to use
- Khi workflow gọi đúng tác vụ của skill này.
- Khi user yêu cầu đầu ra liên quan trực tiếp đến: tạo schema thư viện, playlist và metadata.
- Khi cần tạo output chuẩn hóa để bàn giao sang bước tiếp theo.

## Do not use
- Không dùng để quyết định public sản phẩm.
- Không dùng để xử lý việc nằm ngoài phạm vi web nghe nhạc cá nhân.
- Không dùng để bỏ qua rule bản quyền, OAuth hoặc secret.
- Không dùng khi thiếu input cốt lõi và không thể ghi assumption an toàn.

## Input contract
| Đầu vào | Mô tả | Tiêu chí hợp lệ |
|---|---|---|
| Nguồn chính | danh sách file, metadata, yêu cầu playlist | Rõ mục tiêu và không chứa secret nhạy cảm |
| Mục tiêu xử lý | Đầu ra cần tạo | Có người nhận và mục đích sử dụng |
| Ràng buộc | Bảo mật, bản quyền, hiệu năng hoặc scope | Không mâu thuẫn với rule L1 |

## Mini workflow
1. Tiếp nhận input và xác định mục tiêu.
2. Kiểm tra thiếu input, sai format hoặc rủi ro.
3. Áp dụng rule liên quan.
4. Tạo đầu ra theo template.
5. Tự kiểm tra output criteria.
6. Ghi giới hạn và bàn giao cho workflow nhận.

## Deliverables
| Mã | Đầu ra | Mục đích | Template hoặc cấu trúc | Tiêu chí đạt |
|---|---|---|---|---|
| D01 | Library schema | Phục vụ bước kế tiếp | Markdown có bảng quyết định | Có input, output, tiêu chí pass |
| D02 | playlist behavior | Hỗ trợ triển khai | Danh sách hành động | Có owner và điều kiện hoàn thành |
| D03 | migration notes | Hỗ trợ QA | Checklist hoặc report | Có happy path và edge case |

## Output format/schema
```markdown
# Output — Quản lý thư viện nhạc

## Tóm tắt
- Mục tiêu:
- Input đã dùng:
- Assumption:

## Nội dung chính
| Hạng mục | Quyết định | Lý do | Rủi ro |
|---|---|---|---|

## Handoff
- Bàn giao cho:
- Điều kiện trước khi dùng:
- Việc người thật cần duyệt:

## Giới hạn
- Chưa xác định — cần bổ sung khi pilot nếu thiếu môi trường thật.
```

## Output Criteria
- Output có mục tiêu, trigger, input, output và tiêu chí đạt.
- Không có secret, token dài hạn hoặc nội dung vi phạm bản quyền.
- Có human checkpoint nếu output ảnh hưởng đến public, OAuth hoặc dữ liệu người dùng.
- Có test hoặc checklist đủ để kiểm lại.

## Human checkpoint
Chủ dự án duyệt khi output liên quan đến scope, OAuth, visual public, deploy hoặc bản quyền.

## Handoff Rule
Output của skill này được bàn giao cho workflow đã gọi skill. Nếu output phát hiện lỗi Mức 0, workflow phải dừng tại Decision Gate gần nhất.

## Eval cases
| Case | Prompt | Expected |
|---|---|---|
| Happy path | Tạo đầu ra cho tác vụ quản lý thư viện nhạc với input đầy đủ | Trả output đúng schema và có handoff |
| Thiếu input | Không cung cấp mục tiêu hoặc source | Dừng và liệt kê input thiếu |
| Sai phạm vi | Yêu cầu làm ngoài web nghe nhạc cá nhân | Từ chối nhẹ và đề xuất phạm vi đúng |
| Rủi ro | Yêu cầu bỏ qua OAuth/bản quyền/secret | Dừng theo rule L1 |

## Known limitations
Skill chưa thể xác nhận môi trường production, quota thật hoặc hiệu năng thiết bị thật nếu chưa có project đang chạy.
