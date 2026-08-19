---
file: .agents/workflows/tich-hop-google-drive-music.md
slash_command: /tich-hop-google-drive-music
purpose: Điều phối tích hợp Google Drive Picker để chọn file nhạc cá nhân và đưa vào player.
risk_level: medium
---

# Workflow: Tích hợp Google Drive Music

## 1. Lệnh gọi
`/tich-hop-google-drive-music`

## 2. Mục tiêu vận hành
Giúp dự án chọn file nhạc từ Google Drive bằng quyền tối thiểu, xử lý lỗi OAuth và bàn giao connector an toàn cho player.

## 3. Khi nào dùng / Không dùng
Dùng sau khi MVP local đã chạy. Không dùng để quét toàn bộ Drive, đồng bộ thư viện lớn hoặc xử lý file người khác chia sẻ khi chưa rõ quyền.

## 4. Điều kiện trước khi chạy
Có Google Cloud project, OAuth client, domain localhost hoặc staging, và chủ dự án duyệt scope OAuth.

## 5. Đầu vào bắt buộc
| Đầu vào | Mô tả | Tiêu chí hợp lệ |
|---|---|---|
| OAuth config | Client ID và domain | Không chứa client secret trong frontend |
| Drive use case | Chọn file nhạc | Không yêu cầu toàn bộ Drive nếu chưa cần |
| Player API | Hàm nhận file hoặc URL | Có interface rõ |

## 6. Skill Chain
| Thứ tự | Skill | Mục đích | Input nhận | Output trả |
|---|---|---|---|---|
| 1 | ket-noi-google-drive | Thiết kế Picker/OAuth | OAuth config | Drive connector |
| 2 | xay-player-am-thanh | Nhận file Drive | Connector output | Player integration |
| 3 | kiem-thu-web-nhac | Kiểm thử Drive | Code tích hợp | QA report |

## 7. Human-Agent Role Map
| Bước | Agent làm | Người làm | Skill gọi | Output | Ai duyệt | Không được tự động hóa |
|---|---|---|---|---|---|---|
| Scope OAuth | Đề xuất quyền | Duyệt quyền | ket-noi-google-drive | OAuth plan | Chủ dự án | Xin quyền rộng |
| Credential | Viết hướng dẫn | Tạo credential | ket-noi-google-drive | Config guide | Chủ dự án | Tạo credential thay người |
| Connector | Sinh code | Test login | ket-noi-google-drive | Code | Chủ dự án | Lưu secret |
| QA | Tạo test | Chạy test | kiem-thu-web-nhac | QA report | Chủ dự án | Public khi lỗi |

## 8. Các bước vận hành
1. Kiểm tra MVP local.
2. Đề xuất OAuth scope tối thiểu.
3. Dừng tại Drive Security Gate.
4. Tạo hướng dẫn Google Cloud setup.
5. Tạo code Picker.
6. Kết nối output Picker với player.
7. Test từ chối quyền, chọn file sai định dạng và file lớn.

## 9. Decision Gates
| Gate | Khi nào dừng | Ai duyệt | Duyệt cái gì | Nếu không duyệt |
|---|---|---|---|---|
| Drive Security Gate | Trước code OAuth | Chủ dự án | Scope và domain | Dừng tích hợp |
| Credential Gate | Trước test thật | Chủ dự án | OAuth client | Sửa Google Cloud config |
| QA Gate | Trước merge | Chủ dự án | Lỗi Drive | Sửa lỗi |

## 10. Output
- OAuth plan.
- Google Cloud setup guide.
- Drive Picker connector.
- Player integration notes.
- Drive QA report.

## 11. Action Handoff
| Output | Người nhận | Hành động tiếp theo | Thời hạn | Bằng chứng hoàn thành |
|---|---|---|---|---|
| OAuth plan | Chủ dự án | Duyệt scope | Trong pilot | Scope được chốt |
| Setup guide | Chủ dự án | Tạo credential | Trong pilot | Client ID hợp lệ |
| Connector | Người triển khai | Test chọn file | Trong pilot | File Drive phát được |
| QA report | Chủ dự án | Duyệt merge | Trước public | Không còn Mức 0 |

## 12. Feedback Loop
Ghi lỗi OAuth, domain, scope và file type vào `vong-doi/nhat-ky-quyet-dinh.md`.

## 13. Tình huống ngoại lệ
| Tình huống | Cách xử lý |
|---|---|
| Thiếu OAuth client | Dừng và tạo hướng dẫn setup |
| User từ chối quyền | Hiển thị lỗi dễ hiểu |
| File không phải audio | Từ chối và yêu cầu chọn file khác |
| Cần quét toàn Drive | Dừng và yêu cầu lý do nghiệp vụ |

## 14. Lệnh kiểm thử
- Happy path: chọn file MP3 từ Drive.
- Thiếu input: chưa có client ID.
- Sai format: chọn PDF.
- Dữ liệu nhạy cảm: tên file chứa thông tin cá nhân.
- Cần người duyệt: xin scope rộng.
- Ngoài phạm vi: đồng bộ toàn Drive.

## 15. Giới hạn hiện tại
Chưa xác nhận quota API, domain production và OAuth verification.
