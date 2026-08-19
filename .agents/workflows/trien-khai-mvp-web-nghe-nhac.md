---
file: .agents/workflows/trien-khai-mvp-web-nghe-nhac.md
slash_command: /trien-khai-mvp-web-nghe-nhac
purpose: Điều phối triển khai MVP web nghe nhạc cá nhân có upload local, player, playlist, Drive-ready architecture và visual hoạt họa.
risk_level: medium
---

# Workflow: Triển khai MVP web nghe nhạc cá nhân

## 1. Lệnh gọi
`/trien-khai-mvp-web-nghe-nhac`

## 2. Mục tiêu vận hành
Giúp chủ dự án triển khai MVP web nghe nhạc cá nhân từ scope đến bản chạy local có player, upload, playlist và visual.

## 3. Khi nào dùng / Không dùng
Dùng khi bắt đầu dự án hoặc cần tạo MVP. Không dùng để public web, xử lý bản quyền phức tạp hoặc tích hợp Drive production chưa có credential.

## 4. Điều kiện trước khi chạy
Có repo hoặc thư mục dự án, tech stack đã chốt, file nhạc test hợp lệ và chủ dự án sẵn sàng duyệt scope.

## 5. Đầu vào bắt buộc
| Đầu vào | Mô tả | Tiêu chí hợp lệ |
|---|---|---|
| Mô tả sản phẩm | Web nghe nhạc cá nhân | Có mục tiêu và phạm vi MVP |
| Visual brief | Bot hoặc nền chuyển động | Có mô tả style |
| File test | File audio dùng thử | Không chứa dữ liệu nhạy cảm |

## 6. Skill Chain
| Thứ tự | Skill | Mục đích | Input nhận | Output trả |
|---|---|---|---|---|
| 1 | lap-ke-hoach-san-pham | Chốt backlog | Mô tả sản phẩm | MVP backlog |
| 2 | xay-player-am-thanh | Tạo player | Backlog player | Player component |
| 3 | quan-ly-thu-vien-nhac | Tạo thư viện | Metadata | Library schema |
| 4 | tao-visual-hoat-hoa | Tạo visual | Visual brief | Visual prototype |
| 5 | kiem-thu-web-nhac | Kiểm thử | Source code | QA report |

## 7. Human-Agent Role Map
| Bước | Agent làm | Người làm | Skill gọi | Output | Ai duyệt | Không được tự động hóa |
|---|---|---|---|---|---|---|
| Scope | Đề xuất backlog | Chọn phạm vi | lap-ke-hoach-san-pham | Backlog | Chủ dự án | Mở rộng scope |
| Player | Sinh code | Test local | xay-player-am-thanh | Component | Chủ dự án | Đổi stack |
| Library | Sinh schema | Chạy thử playlist | quan-ly-thu-vien-nhac | Library | Chủ dự án | Xóa dữ liệu |
| Visual | Sinh prototype | Chọn style | tao-visual-hoat-hoa | Visual | Chủ dự án | Dùng asset có bản quyền |
| QA | Tạo report | Duyệt sửa lỗi | kiem-thu-web-nhac | QA report | Chủ dự án | Public web |

## 8. Các bước vận hành
1. Tạo backlog MVP.
2. Dừng tại MVP Scope Gate.
3. Tạo project React, Vite, TypeScript.
4. Xây player và upload local.
5. Xây playlist và metadata.
6. Tạo visual loop.
7. Chạy QA local.
8. Ghi lỗi và quyết định vào log.

## 9. Decision Gates
| Gate | Khi nào dừng | Ai duyệt | Duyệt cái gì | Nếu không duyệt |
|---|---|---|---|---|
| MVP Scope Gate | Trước khi code | Chủ dự án | Tính năng MVP | Sửa backlog |
| Visual Gate | Trước khi polish UI | Chủ dự án | Style visual | Làm prototype khác |
| QA Gate | Trước khi chuyển Drive/public | Chủ dự án | Lỗi Mức 0 | Sửa lỗi |

## 10. Output
- MVP backlog.
- Source code hoặc patch.
- Player component.
- Library schema.
- Visual prototype.
- QA report.

## 11. Action Handoff
| Output | Người nhận | Hành động tiếp theo | Thời hạn | Bằng chứng hoàn thành |
|---|---|---|---|---|
| Backlog | Chủ dự án | Duyệt scope | Trong pilot | Scope được chốt |
| Player | Chủ dự án | Test file | Trong pilot | Phát được nhạc |
| Visual | Chủ dự án | Duyệt style | Trong pilot | Visual chạy loop |
| QA report | Chủ dự án | Sửa lỗi | Trước Drive | Không còn Mức 0 |

## 12. Feedback Loop
Ghi lỗi, quyết định scope, feedback visual và lỗi audio vào `vong-doi/nhat-ky-quyet-dinh.md`.

## 13. Tình huống ngoại lệ
| Tình huống | Cách xử lý |
|---|---|
| Thiếu file test | Tạo file test giả hoặc yêu cầu file hợp lệ |
| Visual gây lag | Tắt audio-reactive effect và dùng loop nhẹ |
| Browser không autoplay | Yêu cầu user click play |
| Scope quá rộng | Tách phase |

## 14. Lệnh kiểm thử
- Happy path: build MVP local.
- Thiếu input: không có visual brief.
- Sai format: file không phải audio.
- Dữ liệu nhạy cảm: tên file chứa thông tin cá nhân.
- Cần người duyệt: yêu cầu public ngay.
- Ngoài phạm vi: chia sẻ nhạc công khai.

## 15. Giới hạn hiện tại
Chưa kiểm thử trên hosting thật, OAuth thật và nhiều thiết bị thật.
