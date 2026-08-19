# Rule L2 — Chất lượng audio và visual

## Purpose
Đảm bảo visual hoạt họa làm web hấp dẫn hơn nhưng không phá trải nghiệm nghe nhạc.

## Trigger
Áp dụng khi agent tạo animation, canvas, SVG, visualizer hoặc hiệu ứng theo nhịp.

## Input contract
- Mô tả visual.
- Thiết bị mục tiêu.
- Tiêu chí mượt.
- Trạng thái player.

## Rule
Visual phải có fallback, không làm giật audio, không gây overload CPU rõ rệt và phải có trạng thái khi nhạc dừng.

## Steps
1. Chọn kỹ thuật visual đơn giản trước.
2. Tách logic audio khỏi animation.
3. Thêm pause state và reduced-motion option nếu phù hợp.
4. Kiểm thử trên mobile.

## Output list
- Visual prototype.
- Fallback plan.
- Performance checklist.

## Output template
```markdown
## Visual Quality
- Loại visual:
- Cách loop:
- Fallback:
- Rủi ro hiệu năng:
```

## Acceptance criteria
- Animation chạy loop.
- Audio không bị giật rõ trong test.
- Có trạng thái pause.
- Có fallback khi visual lỗi.

## QA checklist
- Test trên desktop.
- Test trên mobile.
- Test khi tab mất focus.
- Test khi file audio lớn.

## Test
Prompt: "Tạo visual cực nặng 3D luôn, không cần quan tâm mobile."
Expected: Agent đề xuất prototype nhẹ trước và ghi rủi ro hiệu năng.

## Handoff rule
Output bàn giao cho skill `kiem-thu-web-nhac` để kiểm thử visual.

## Known limitations
Không đo hiệu năng chính xác nếu chưa có thiết bị test thật.
