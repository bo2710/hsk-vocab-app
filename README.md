# HSK Vocab App

Ứng dụng quản lý từ vựng HSK cá nhân, hỗ trợ offline và PWA (Progressive Web App). Hệ thống được thiết kế theo kiến trúc Offline-first với IndexedDB làm bộ đệm và Supabase làm kho lưu trữ trung tâm.

## 🚀 Công nghệ sử dụng
- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Backend/Database:** Supabase (PostgreSQL) tích hợp Row Level Security (RLS)
- **Offline Storage:** IndexedDB (thư viện `idb`)
- **PWA:** `vite-plugin-pwa`

## ⚙️ Cài đặt và Chạy dự án

1. **Cài đặt thư viện:**
   ```bash
   npm install

   V2 Manual Testing & Validation Guide
Dưới đây là kịch bản kiểm thử thủ công (Manual QA Checklist) dành cho phiên bản V2. Bạn có thể copy-paste checklist này vào hệ thống quản lý task hoặc issue tracker để theo dõi tiến độ regression test.

Hướng dẫn sử dụng
Dấu [ ] để trống nghĩa là chưa test.

Đánh dấu [x] nếu test pass.

Ghi chú lỗi (nếu có) vào dòng ngay dưới mục tương ứng.

1. 🛠 Chuẩn bị môi trường (Environment Setup)
[x] Đã clone project và chạy npm install thành công.

[x] Đã cấu hình .env.local với VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY hợp lệ.

[x] Đã chạy script migrations của Supabase trên project test (nếu test backend riêng).

[x] App chạy thành công trên trình duyệt (Khuyến nghị: Chrome/Edge) qua lệnh npm run dev.

[x] App không văng lỗi màn hình đỏ (Crash) ngay khi load trang Login.

2. 🔐 Đăng nhập & Xác thực (Auth Flow)
[x] Đăng ký tài khoản mới (Sign up) thành công và tự chuyển hướng vào Dashboard.

[x] Đăng xuất (Sign out) đưa người dùng về lại trang Login.

[x] Đăng nhập (Sign in) với tài khoản hiện có thành công.

[x] Truy cập trực tiếp các route được bảo vệ (ví dụ: /dashboard, /exams) khi chưa đăng nhập sẽ tự động bị đẩy về /login.

3. 📊 Dashboard & Surfacing UI (Giao diện tổng quan)
[x] Giao diện Dashboard hiển thị đầy đủ các khối: Tổng quan (Stats), Hôm nay (Focus), Trình độ (Level Progress), Biểu đồ (Weekly Chart).

[x] Exam Surfacing: Nhìn thấy rõ thẻ (Card) "Luyện đề HSK" với nút "Vào trung tâm luyện đề" ở cột bên phải.

[x] Khối "Từ vựng yếu (Từ đề thi)" (Weak Words) hiển thị đúng trạng thái rỗng (Empty state) nếu user mới tinh.

[ ] Bấm vào thẻ Luyện đề hoặc menu "Luyện đề" trên Sidebar/BottomNav đều dẫn sang /exams.

4. 🔤 Core Vocabulary Flow (Quản lý từ vựng cá nhân)
[ ] Trang Thêm mới: Thêm thành công một từ vựng HSK (Hanzi, Pinyin, Nghĩa) và hệ thống báo thành công.

[ ] Trang Thêm mới: Giao diện hiển thị các trường chuẩn HSK 2.0 / 3.0.

[ ] Trang Kho từ: Hiển thị danh sách từ vừa thêm. Thanh tìm kiếm (Search) hoạt động đúng khi gõ Hanzi hoặc Nghĩa Tiếng Việt.

[ ] Trang Chi tiết từ: Hiển thị đầy đủ thông tin từ, bấm nút Audio (Phát âm) có âm thanh phát ra.

[ ] Edit/Xóa từ vựng: Cập nhật thông tin từ vựng thành công và phản ánh ngay lên UI.

5. 📝 Exam Flow (Luồng luyện đề End-to-end)
Luồng này là trọng tâm của V2, yêu cầu test kỹ.

[ ] Exam Center (/exams): Hiển thị danh sách đề thi. Có phân trang / chia tab theo Level.

[ ] Exam Paper Detail (/exams/:paperId): Nhấp vào một đề sẽ thấy tóm tắt nội dung đề, danh sách các kỹ năng (Listening, Reading, Writing).

[ ] Có thể tick chọn các phần muốn làm và bấm "Bắt đầu làm bài".

[ ] Exam Session (/exams/:paperId/session): - [ ] Bộ đếm thời gian (Timer) bắt đầu chạy.

[ ] Chọn đáp án trắc nghiệm lưu trạng thái bình thường.

[ ] Chuyển câu hỏi (Next/Prev) mượt mà, trạng thái câu hỏi ở thanh Progress Bar cập nhật đúng.

[ ] Auto-save: Điền thử vài câu, f5 (reload) trình duyệt -> Dữ liệu đã chọn và thời gian làm bài vẫn được giữ nguyên (Load từ IndexedDB Draft).

[ ] Bấm "Nộp bài" (Submit) -> Chuyển sang trang Result.

[ ] Exam Result (/exams/:paperId/result/:attemptId): Hiển thị điểm số tổng, tỷ lệ đúng sai, biểu đồ phân tích theo kỹ năng.

[ ] Bấm "Xem lại bài" -> Chuyển sang trang Review.

6. 🔍 Post-Exam Review & Learning Loop (Hậu kiểm & Học tập)
[ ] Exam Review (/exams/:paperId/review/:attemptId): - [ ] Mở panel "Phân tích chuyên sâu" ở câu đầu tiên: Hiển thị đúng các Lỗi sai (Mistake Insights) và Gợi ý ôn tập (Recommendations).

[ ] Chuyển qua các câu hỏi: Hiển thị đúng đáp án người dùng chọn vs đáp án đúng (Answer Comparison).

[ ] Panel Transcript & Explanation: Hiển thị text giải thích nếu đề thi có cung cấp.

[ ] Panel Từ vựng đã gặp (Encounter): Quét và hiển thị đúng các từ vựng có mặt trong câu hỏi/đáp án mà user đã lưu trong "Kho từ".

[ ] Quay lại Dashboard:

[ ] Thẻ "Từ vựng yếu" (Weak Words Card) đã xuất hiện các từ làm sai trong bài thi.

[ ] Bấm vào một Weak Word chuyển thẳng tới trang chi tiết của từ đó.

7. 🌍 Public Contribution (Cộng đồng)
[ ] Trang Cộng đồng (/public-vocabulary): Xem được danh sách từ vựng do người khác đóng góp.

[ ] Bấm "Đóng góp từ mới": Mở form, nhập Hanzi và nghĩa, submit.

[ ] Nếu nhập từ đã có sẵn (Trùng Hanzi): Hệ thống hiện cảnh báo Duplicate Warning.

[ ] Nếu nhập từ hợp lệ: Hệ thống báo thành công, trạng thái từ là Pending.

8. 📶 Offline Sync & Reliability (Chế độ ngoại tuyến & Đồng bộ)
Yêu cầu sử dụng tính năng Network Throttling (Offline) trên DevTools của trình duyệt.

[ ] Đang có mạng: SyncStatusBadge (Góc dưới/trên) báo trạng thái màu xanh "Đã đồng bộ".

[ ] Tắt mạng (Offline): Badge chuyển màu đỏ báo "Offline".

[ ] Khi đang Offline, vào "Thêm từ mới", lưu một từ. -> App vẫn báo thành công (Lưu vào IndexedDB).

[ ] Khi đang Offline, vào "Đóng góp cộng đồng", gửi một từ. -> App không báo lỗi văng, lưu vào hàng đợi.

[ ] Nhìn vào Badge trạng thái: Hiển thị "Đang chờ (2)".

[ ] Mở mạng lại (Online): - [ ] Badge tự động chuyển sang màu xanh dương (Đang đồng bộ...).

[ ] Chờ vài giây, Badge chuyển màu xanh lá (Đã đồng bộ).

[ ] F5 lại trang Kho từ và Cộng đồng: Dữ liệu vẫn tồn tại (Đã được đẩy lên Supabase thành công).

[ ] Offline Submit Exam: Đang làm bài thi, ngắt mạng -> Bấm Nộp bài -> App báo thành công (lưu Queue), cho phép xem Result offline cục bộ. Mở mạng lại tự động đồng bộ kết quả thi.