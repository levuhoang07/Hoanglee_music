---
file: .agents/workflows/kiem-thu-truoc-khi-public.md
slash_command: /kiem-thu-truoc-khi-public
purpose: Kiểm thử MVP web nghe nhạc trước khi public để chặn lỗi player, Drive, bảo mật, bản quyền và hiệu năng visual.
risk_level: medium
---

# Workflow: Kiểm thử trước khi public

## 1. Lệnh gọi
`/kiem-thu-truoc-khi-public`

## 2. Mục tiêu vận hành
Đảm bảo web chỉ được public khi không còn lỗi Mức 0 và chủ dự án đã duyệt rủi ro còn lại.

## 3. Khi nào dùng / Không dùng
Dùng trước khi deploy staging hoặc production. Không dùng để thay thế kiểm thử bảo mật chuyên sâu nếu sản phẩm có người dùng ngoài cá nhân.

## 4. Điều kiện trước khi chạy
Có bản build chạy local hoặc staging, checklist tính năng, danh sách file test và thông tin Drive nếu có tích hợp.

## 5. Đầu vào bắt buộc
| Đầu vào | Mô tả | Tiêu chí hợp lệ |
|---|---|---|
| URL hoặc source | Bản cần test | Chạy được |
| Checklist tính năng | Tính năng có trong MVP | Rõ pass/fail |
| File test | Audio hợp lệ và lỗi | Có nhiều định dạng |
| Deploy target | Nơi public | Có người duyệt |

## 6. Skill Chain
| Thứ tự | Skill | Mục đích | Input nhận | Output trả |
|---|---|---|---|---|
| 1 | kiem-thu-web-nhac | Tạo test plan | Source và checklist | QA report |
| 2 | xay-player-am-thanh | Sửa lỗi player | QA lỗi player | Patch đề xuất |
| 3 | ket-noi-google-drive | Sửa lỗi Drive | QA lỗi Drive | Patch đề xuất |
| 4 | tao-visual-hoat-hoa | Sửa lỗi visual | QA lỗi visual | Patch đề xuất |

## 7. Human-Agent Role Map
| Bước | Agent làm | Người làm | Skill gọi | Output | Ai duyệt | Không được tự động hóa |
|---|---|---|---|---|---|---|
| Test plan | Tạo checklist | Cung cấp URL | kiem-thu-web-nhac | Test plan | Chủ dự án | Bỏ qua nhóm test |
| Test lỗi | Phân loại lỗi | Chạy lại | kiem-thu-web-nhac | QA report | Chủ dự án | Tự public |
| Fix plan | Đề xuất sửa | Chọn sửa | Skill liên quan | Fix plan | Chủ dự án | Sửa scope lớn |
| Public Gate | Tổng hợp kết quả | Quyết định public | kiem-thu-web-nhac | Public decision brief | Chủ dự án | Deploy khi chưa duyệt |

## 8. Các bước vận hành
1. Thu thập URL hoặc source.
2. Tạo test plan.
3. Kiểm thử player, upload, playlist, Drive, visual, mobile, security, copyright.
4. Phân loại lỗi Mức 0, Mức 1, Mức 2.
5. Dừng nếu có Mức 0.
6. Tạo public decision brief nếu đạt.

## 9. Decision Gates
| Gate | Khi nào dừng | Ai duyệt | Duyệt cái gì | Nếu không duyệt |
|---|---|---|---|---|
| QA Gate | Có lỗi Mức 0 | Chủ dự án | Fix plan | Không public |
| Public Gate | Trước deploy | Chủ dự án | Rủi ro còn lại | Không public |
| Rollback Gate | Sau public có lỗi nặng | Chủ dự án | Rollback | Gỡ bản public |

## 10. Output
- Test plan.
- QA report.
- Fix plan.
- Public decision brief.
- Rollback checklist nếu cần.

## 11. Action Handoff
| Output | Người nhận | Hành động tiếp theo | Thời hạn | Bằng chứng hoàn thành |
|---|---|---|---|---|
| QA report | Chủ dự án | Duyệt lỗi | Trước public | Lỗi được phân loại |
| Fix plan | Người triển khai | Sửa lỗi | Trước public | Test pass |
| Public brief | Chủ dự án | Quyết định deploy | Trước public | Duyệt bằng văn bản |
| Rollback checklist | Chủ dự án | Gỡ bản lỗi | Khi có sự cố | Bản lỗi không còn public |

## 12. Feedback Loop
Các lỗi sau public được ghi vào `vong-doi/nhat-ky-quyet-dinh.md` để tạo backlog sửa ở vòng tiếp theo.

## 13. Tình huống ngoại lệ
| Tình huống | Cách xử lý |
|---|---|
| Thiếu URL | Test source local nếu có |
| Có secret trong client | Lỗi Mức 0, dừng public |
| OAuth lỗi domain | Lỗi Mức 0 nếu Drive là tính năng bắt buộc |
| Visual lag mạnh | Mức 1 hoặc Mức 0 tùy ảnh hưởng audio |
| Bản quyền chưa rõ | Lỗi Mức 0 nếu public |

## 14. Lệnh kiểm thử
- Happy path: public checklist pass.
- Thiếu input: không có URL.
- Sai format: file test không phải audio.
- Dữ liệu nhạy cảm: token trong console.
- Cần người duyệt: yêu cầu deploy ngay.
- Ngoài phạm vi: chia sẻ nhạc public.

## 15. Giới hạn hiện tại
Không thay thế pentest, legal review hoặc kiểm thử thiết bị quy mô lớn.
